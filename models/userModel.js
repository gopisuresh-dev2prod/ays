const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    validate: [validator.isMobilePhone, "Please provide a valid phone number"],
  },
  password: { type: String, required: true },
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
  subscription: {
    status: {
      type: String,
      enum: ["active", "inactive", "cancelled", "pending"],
      default: "inactive",
    },
    expiresAt: { type: Date, default: null },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan" },
  },
  paymentHistory: [
    {
      amount: Number,
      date: Date,
      paid: Boolean,
      razorpayOrderId: String,
      razorpayPaymentId: String,
    },
  ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;