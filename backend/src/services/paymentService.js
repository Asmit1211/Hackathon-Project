const Stripe = require("stripe");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { ENV } = require("../config/env");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const { logger } = require("../utils/logger");

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
const razorpay =
  ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: ENV.RAZORPAY_KEY_ID,
        key_secret: ENV.RAZORPAY_KEY_SECRET,
      })
    : null;

async function createOrderPaymentIntent(userId, orderId) {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }
  if (order.paymentStatus === "paid") {
    const err = new Error("Order already paid");
    err.statusCode = 400;
    throw err;
  }

  const amountInCents = Math.round(order.totalAmount * 100);

  const intent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: order.currency || "usd",
    metadata: {
      orderId: order._id.toString(),
      userId: userId.toString(),
    },
  });

  const payment = await Payment.create({
    user: userId,
    order: order._id,
    amount: order.totalAmount,
    currency: order.currency,
    status: "created",
    paymentIntentId: intent.id,
    rawResponse: intent,
  });

  // Store intent id on order for traceability
  order.paymentIntentId = intent.id;
  await order.save();

  return { intent, payment };
}

// Optionally accepts a userId/orderId so callers can associate the Razorpay order with a domain user/order.
// Also accepts a customer snapshot and cart items so we can persist full transaction
// details even when the cart lives client-side.
async function createRazorpayOrder({
  amount,
  currency = "INR",
  receipt,
  notes = {},
  userId,
  orderId,
  customer,
  items,
}) {
  if (!razorpay) {
    logger.error("Razorpay not configured - missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET");
    const err = new Error("Razorpay is not configured. Please check server environment variables.");
    err.statusCode = 503;
    throw err;
  }

  const normalizedCurrency = (currency || "INR").toUpperCase();
  const amountInSubunits = Math.round(Number(amount) * 100);

  if (Number.isNaN(amountInSubunits) || amountInSubunits <= 0) {
    logger.error("Invalid amount for Razorpay order", { amount, amountInSubunits });
    const err = new Error(`Invalid amount: ${amount}. Must be a positive number.`);
    err.statusCode = 400;
    throw err;
  }

  try {
    const order = await razorpay.orders.create({
      amount: amountInSubunits,
      currency: normalizedCurrency,
      receipt: receipt || `cursed_${Date.now()}`,
      notes,
    });

    logger.info("Created Razorpay order", {
      razorpayOrderId: order.id,
      amount: amountInSubunits / 100,
      currency: normalizedCurrency,
      customerEmail: customer?.email,
    });

    // Persist a payment record so Razorpay orders are traceable in our own database.
    try {
      await Payment.create({
        user: userId || undefined,
        order: orderId || undefined,
        provider: "razorpay",
        amount: amountInSubunits / 100,
        currency: normalizedCurrency,
        status: "created",
        paymentIntentId: order.id,
        razorpayOrderId: order.id,
        customerEmail: customer?.email,
        customerName: customer?.name,
        customerPhone: customer?.phone,
        customerFirebaseUid: customer?.firebaseUid,
        items: Array.isArray(items) ? items : [],
        rawResponse: order,
      });
    } catch (err) {
      logger.error("Failed to persist Razorpay payment", {
        error: err.message,
        stack: err.stack,
        userId,
        orderId,
      });
      // Don't fail the order creation if DB persistence fails
    }

    return order;
  } catch (err) {
    logger.error("Razorpay order creation failed", {
      error: err.message,
      stack: err.stack,
      amount: amountInSubunits,
      currency: normalizedCurrency,
    });
    const error = new Error(`Failed to create Razorpay order: ${err.message}`);
    error.statusCode = err.statusCode || 500;
    throw error;
  }
}

async function verifyAndFinalizeRazorpayPayment({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  if (!razorpay) {
    const err = new Error("Razorpay is not configured");
    err.statusCode = 503;
    throw err;
  }

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    const err = new Error("Missing Razorpay identifiers");
    err.statusCode = 400;
    throw err;
  }

  const generatedSignature = crypto
    .createHmac("sha256", ENV.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    const err = new Error("Invalid Razorpay signature");
    err.statusCode = 400;
    throw err;
  }

  const payment = await Payment.findOne({
    provider: "razorpay",
    paymentIntentId: razorpayOrderId,
  });

  if (!payment) {
    const err = new Error("Payment record not found for Razorpay order");
    err.statusCode = 404;
    throw err;
  }

  payment.status = "succeeded";
  payment.razorpayOrderId = razorpayOrderId;
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;

  await payment.save();

  logger.info("Razorpay payment verified and stored", {
    razorpayOrderId,
    razorpayPaymentId,
    paymentId: payment._id,
  });

  return payment;
}

module.exports = {
  createOrderPaymentIntent,
  createRazorpayOrder,
  verifyAndFinalizeRazorpayPayment,
};
