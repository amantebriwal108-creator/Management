const PullRequest = require('../models/PullRequest');
const Issue = require('../models/Issue');
const User = require('../models/User');

exports.createPR = async (req, res) => {
  try {
    const { title, description, issueId, repository } = req.body;
    const pr = new PullRequest({
      title,
      description,
      issueId,
      repository,
      author: req.user.id
    });
    await pr.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, { $inc: { 'stats.prsSubmitted': 1 } });

    res.json(pr);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getPRsByRepo = async (req, res) => {
  try {
    const prs = await PullRequest.find({ repository: req.params.repoId })
      .populate('author', 'username')
      .populate('issueId', 'title status')
      .sort({ createdAt: -1 });
    res.json(prs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updatePRStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    let pr = await PullRequest.findById(req.params.id);
    if (!pr) return res.status(404).json({ msg: 'PR not found' });

    pr.status = status;
    await pr.save();

    if (status === 'approved') {
      // Close the linked issue
      const issue = await Issue.findById(pr.issueId);
      if (issue && issue.status !== 'closed') {
        issue.status = 'closed';
        await issue.save();

        // Increment author's solved stats if PR is approved
        await User.findByIdAndUpdate(pr.author, { $inc: { 'stats.issuesSolved': 1 } });
      }
    }

    res.json(pr);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
