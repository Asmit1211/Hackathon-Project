const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  createPaymentIntent,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");
const { validate } = require("../middlewares/validateRequest");
const {
  createPaymentIntentSchema,
  createRazorpayOrderSchema,
  verifyRazorpayPaymentSchema,
} = require("../validations/cartValidation");

const router = express.Router();

// Stripe payment intent remains protected, Razorpay order can be created directly
router.post("/intent", authenticate, validate(createPaymentIntentSchema), createPaymentIntent);
router.post("/razorpay/order", validate(createRazorpayOrderSchema), createRazorpayOrder);
router.post("/razorpay/verify", validate(verifyRazorpayPaymentSchema), verifyRazorpayPayment);

module.exports = router;
