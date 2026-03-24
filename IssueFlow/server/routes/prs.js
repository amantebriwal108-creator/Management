const express = require('express');
const router = express.Router();
const prController = require('../controllers/prController');
const auth = require('../middleware/auth');

router.post('/', auth, prController.createPR);
router.get('/repo/:repoId', prController.getPRsByRepo);
router.put('/:id/status', auth, prController.updatePRStatus);

module.exports = router;
