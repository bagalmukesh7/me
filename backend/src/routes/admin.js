const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/dashboard', authenticate, requireAdmin, adminController.getDashboardStats);
router.get('/users', authenticate, requireAdmin, adminController.getAllUsers);
router.get('/users/:id', authenticate, requireAdmin, adminController.getUserDetails);
router.get('/applications', authenticate, requireAdmin, adminController.getAllApplications);
router.put('/applications/:id/status', authenticate, requireAdmin, adminController.updateApplicationStatus);

module.exports = router;
