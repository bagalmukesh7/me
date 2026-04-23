const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, applicationController.createApplication);
router.get('/', authenticate, applicationController.getUserApplications);
router.get('/:id', authenticate, applicationController.getApplication);
router.put('/:id/status', authenticate, applicationController.updateStatus);
router.delete('/:id', authenticate, applicationController.deleteApplication);

module.exports = router;
