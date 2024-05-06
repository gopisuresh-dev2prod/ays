const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (amount) => {
  console.log("Order created",amount,process.env.RAZORPAY_KEY_SECRET,razorpay)
  try {
    const order = await razorpay.orders.create({
      amount: 100,
      currency: "INR",
    });
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.verifyPayment = async (orderId, paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    if (payment.order_id !== orderId) {
      throw new Error("Invalid payment");
    }
    return payment;
  } catch (error) {
    throw new Error(error.message);
  }
};