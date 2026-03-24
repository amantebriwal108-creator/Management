const express = require('express');
const router = express.Router();
const repoController = require('../controllers/repoController');
const auth = require('../middleware/auth');

router.post('/', auth, repoController.createRepo);
router.get('/', repoController.getRepos);
router.get('/:id', repoController.getRepoById);

module.exports = router;
