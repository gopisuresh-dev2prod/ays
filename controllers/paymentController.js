const User = require("../models/userModel");
const SubscriptionPlan = require("../models/subscriptionPlanModel");
const razorpayService = require("../config/razorpayService");

exports.subscribeUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
console.log('user',user)
    if (user.subscription.status === "active") {
      return res
        .status(400)
        .json({ error: "You already have an active subscription" });
    }

    // Find the subscription plan for 30 days with an amount of 99
     // Find the subscription plan by its ID
     const planId = "66347a309d3a7d0c0a6f50e7"; // Replace with the appropriate plan ID
     const plan = await SubscriptionPlan.findById(planId);
 
     if (!plan) {
       return res.status(404).json({ error: "Subscription plan not found" });
     }
    if (!plan) {
      return res
        .status(404)
        .json({ error: "Subscription plan not found" });
    }
 // Update the user's subscription details
 console.log('plan',plan,plan.amount)
   // Create a Razorpay order

  // Convert plan.amount to paise and handle different data types
  const orderAmount = typeof plan.amount === 'string' ? parseInt(plan.amount.trim()) * 100 : plan.amount * 100;

  // Create a Razorpay order
  const order = await razorpayService.createOrder(orderAmount);
  console.log('order', order);
    // Update the user's subscription details
     console.log('order2',order)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + plan.duration.value);
    user.subscription = {
      status: 'pending',
      plan: plan._id,
      expiresAt: expirationDate,
      // paymentHistory: [],
    };

    // user.subscription.status = "pending";
    // user.subscription.plan = plan._id;
    // user.subscription.expiresAt = new Date(
    //   Date.now() + plan.duration * 24 * 60 * 60 * 1000
    // );
    await user.save();

    res.status(200).json({ orderId: order.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const { razorpayOrderId, razorpayPaymentId } = req.body;

    // Verify the payment with Razorpay
    const payment = await razorpayService.verifyPayment(
      razorpayOrderId,
      razorpayPaymentId
    );

    if (payment.status !== "captured") {
      return res.status(400).json({ error: "Payment failed" });
    }

    // Update the user's subscription status and payment history
    const user = await User.findByIdAndUpdate(
      userId,
      {
        "subscription.status": "active",
        $push: {
          paymentHistory: {
            amount: payment.amount,
            date: new Date(),
            paid: true,
            razorpayOrderId,
            razorpayPaymentId,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Payment successful", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};