const Stripe = require("stripe");
const Razorpay = require("razorpay");
const { ENV } = require("../config/env");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

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

async function createRazorpayOrder({ amount, currency = "INR", receipt, notes = {} }) {
  if (!razorpay) {
    const err = new Error("Razorpay is not configured");
    err.statusCode = 503;
    throw err;
  }

  const normalizedCurrency = (currency || "INR").toUpperCase();
  const amountInSubunits = Math.round(Number(amount) * 100);

  if (Number.isNaN(amountInSubunits) || amountInSubunits <= 0) {
    const err = new Error("Invalid amount");
    err.statusCode = 400;
    throw err;
  }

  const order = await razorpay.orders.create({
    amount: amountInSubunits,
    currency: normalizedCurrency,
    receipt: receipt || `cursed_${Date.now()}`,
    notes,
  });

  return order;
}

module.exports = {
  createOrderPaymentIntent,
  createRazorpayOrder,
};
