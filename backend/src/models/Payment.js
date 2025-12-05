const mongoose = require("mongoose");

const cartItemSnapshotSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String },
    image: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    // For Razorpay flows we may not always have an authenticated user or a domain Order,
    // so these fields are optional and enforced at the service layer where needed.
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },

    // High-level provider and amount info
    provider: { type: String, enum: ["stripe", "razorpay"], default: "stripe" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: {
      type: String,
      enum: ["created", "succeeded", "failed"],
      default: "created",
      index: true,
    },

    // Customer snapshot at the time of payment
    customerEmail: { type: String },
    customerName: { type: String },
    customerPhone: { type: String },
    customerFirebaseUid: { type: String },

    // Cart / product snapshot
    items: [cartItemSnapshotSchema],

    // For Stripe this is the PaymentIntent ID; for Razorpay we store the order id here.
    paymentIntentId: { type: String, index: true },

    // Razorpay-specific identifiers
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    // Full provider response snapshot for debugging / reconciliation.
    rawResponse: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
