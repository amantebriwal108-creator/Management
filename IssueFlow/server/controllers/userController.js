const User = require('../models/User');
const Issue = require('../models/Issue');
const PullRequest = require('../models/PullRequest');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Fetch user activity
    const issues = await Issue.find({ author: req.params.userId })
      .populate('repository', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
      
    const prs = await PullRequest.find({ author: req.params.userId })
      .populate('repository', 'name')
      .populate('issueId', 'title status')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      timeline: {
        issues,
        prs
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
