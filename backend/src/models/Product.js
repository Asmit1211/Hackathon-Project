const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "cursed_doll",
        "cursed_charm",
        "goodluck_charm",
        "haunted_stone",
        "haunted_art",
        "normal_merch",
      ],
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    images: [{ type: String, required: true }],
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    antiqueTag: { type: String },
    origin: { type: String },
    isFeatured: { type: Boolean, default: false },
    safeShippingWarning: {
      type: String,
      default:
        "Handle with extreme care. Do not open the package after midnight.",
    },
    hauntedLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
      index: true,
    },
    totalSold: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({
  name: "text",
  shortDescription: "text",
  longDescription: "text",
  antiqueTag: "text",
  origin: "text",
});

module.exports = mongoose.model("Product", productSchema);
