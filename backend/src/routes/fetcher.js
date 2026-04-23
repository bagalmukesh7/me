const express = require('express');
const router = express.Router();
const fetcherController = require('../controllers/fetcherController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/trigger', authenticate, requireAdmin, fetcherController.triggerFetch);

module.exports = router;
