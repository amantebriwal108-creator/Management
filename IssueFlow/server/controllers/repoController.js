const Repository = require('../models/Repository');

exports.createRepo = async (req, res) => {
  try {
    const { name, description } = req.body;
    const repo = new Repository({
      name,
      description,
      owner: req.user.id
    });
    await repo.save();
    res.json(repo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRepos = async (req, res) => {
  try {
    const repos = await Repository.find().populate('owner', 'username');
    res.json(repos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRepoById = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id).populate('owner', 'username');
    if (!repo) return res.status(404).json({ msg: 'Repository not found' });
    res.json(repo);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Repository not found' });
    res.status(500).send('Server Error');
  }
};
