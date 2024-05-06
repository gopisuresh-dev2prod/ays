const SubscriptionPlan = require('../models/subscriptionPlanModel');

// Get all subscription plans
exports.getAllSubscriptionPlans = async (req, res) => {
  try {
    const subscriptionPlans = await SubscriptionPlan.find();
    res.status(200).json(subscriptionPlans);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createSubscriptionPlan = async (req, res) => {
    try {
      const { name, duration, amount, description, features } = req.body;
  
      // Check if a plan with the same name already exists
      const existingPlan = await SubscriptionPlan.findOne({ name });
      if (existingPlan) {
        return res.status(400).json({ error: 'Subscription plan with the same name already exists' });
      }
  
      // Generate a unique slug based on the name
      const slug = name.replace(/\s+/g, '-').toLowerCase();
  
      // Check if a plan with the same slug already exists
      const existingSlugPlan = await SubscriptionPlan.findOne({ slug });
      if (existingSlugPlan) {
        return res.status(400).json({ error: 'Subscription plan with the same slug already exists' });
      }
  
      const newSubscriptionPlan = new SubscriptionPlan({
        name,
        slug,
        duration,
        amount,
        description,
        features,
      });
  
      const savedSubscriptionPlan = await newSubscriptionPlan.save();
      res.status(201).json(savedSubscriptionPlan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// controllers/subscriptionPlanController.js
exports.deleteSubscriptionPlan = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPlan = await SubscriptionPlan.findByIdAndDelete(id);
  
      if (!deletedPlan) {
        return res.status(404).json({ error: 'Subscription plan not found' });
      }
  
      res.status(200).json({ message: 'Subscription plan deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };