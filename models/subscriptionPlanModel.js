const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  duration: {
    value: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true, enum: ['day', 'month', 'year'] },
  },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
module.exports = SubscriptionPlan;