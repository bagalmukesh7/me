const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', opportunityController.listOpportunities);
router.get('/states', opportunityController.getStates);
router.get('/categories', opportunityController.getCategories);
router.get('/:id', opportunityController.getOpportunity);
router.post('/', authenticate, requireAdmin, opportunityController.createOpportunity);
router.put('/:id', authenticate, requireAdmin, opportunityController.updateOpportunity);
router.delete('/:id', authenticate, requireAdmin, opportunityController.deleteOpportunity);

module.exports = router;
