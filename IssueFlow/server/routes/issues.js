const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const auth = require('../middleware/auth');

router.post('/', auth, issueController.createIssue);
router.get('/repo/:repoId', issueController.getIssuesByRepo);
router.put('/:id', auth, issueController.updateIssue);

module.exports = router;
