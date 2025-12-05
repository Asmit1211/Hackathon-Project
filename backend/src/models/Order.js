const mongoose = require("mongoose");
const { ORDER_STATUS } = require("../utils/constants");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    category: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PROCESSING,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    // Stripe is the default, but we also support Razorpay as a payment provider.
    paymentProvider: { type: String, enum: ["stripe", "razorpay"], default: "stripe" },
    paymentIntentId: { type: String },
    transactionId: { type: String },
    shippingAddress: shippingAddressSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
