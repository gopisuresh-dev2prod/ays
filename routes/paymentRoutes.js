const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/subscribe", authMiddleware, paymentController.subscribeUser);
router.post("/payment/verify", authMiddleware, paymentController.verifyPayment);

module.exports = router;