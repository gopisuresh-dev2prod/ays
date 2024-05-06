const express = require('express');
const router = express.Router();
const subscriptionPlanController = require('../controllers/subscriptionPlanController');

// Route to get all subscription plans
router.get('/', subscriptionPlanController.getAllSubscriptionPlans);

// Route to create a new subscription plan
router.post('/', subscriptionPlanController.createSubscriptionPlan);

// Route to delete a subscription plan
router.delete('/:id', subscriptionPlanController.deleteSubscriptionPlan);

module.exports = router;