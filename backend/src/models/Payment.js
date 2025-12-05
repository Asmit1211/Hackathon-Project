const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    provider: { type: String, enum: ["stripe"], default: "stripe" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: {
      type: String,
      enum: ["created", "succeeded", "failed"],
      default: "created",
    },
    paymentIntentId: { type: String },
    rawResponse: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
