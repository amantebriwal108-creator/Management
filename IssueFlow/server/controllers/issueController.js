const Issue = require('../models/Issue');
const User = require('../models/User');

exports.createIssue = async (req, res) => {
  try {
    const { title, description, repository, labels } = req.body;
    const issue = new Issue({
      title,
      description,
      repository,
      labels: labels || [],
      author: req.user.id
    });
    await issue.save();
    
    // Update user stats
    await User.findByIdAndUpdate(req.user.id, { $inc: { 'stats.issuesCreated': 1 } });
    
    res.json(issue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getIssuesByRepo = async (req, res) => {
  try {
    const issues = await Issue.find({ repository: req.params.repoId })
      .populate('author', 'username')
      .populate('assignee', 'username')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const { status, assignee, labels } = req.body;
    const issueFields = {};
    if (status) issueFields.status = status;
    if (assignee !== undefined) issueFields.assignee = assignee;
    if (labels) issueFields.labels = labels;

    let issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: 'Issue not found' });

    issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $set: issueFields },
      { new: true }
    ).populate('author', 'username').populate('assignee', 'username');

    res.json(issue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
