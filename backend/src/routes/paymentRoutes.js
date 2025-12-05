const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const { createPaymentIntent, createRazorpayOrder } = require("../controllers/paymentController");
const { validate } = require("../middlewares/validateRequest");
const {
  createPaymentIntentSchema,
  createRazorpayOrderSchema,
} = require("../validations/cartValidation");

const router = express.Router();

// Stripe payment intent remains protected, Razorpay order can be created directly
router.post("/intent", authenticate, validate(createPaymentIntentSchema), createPaymentIntent);
router.post("/razorpay/order", validate(createRazorpayOrderSchema), createRazorpayOrder);

module.exports = router;
