const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
const { validate } = require("../middlewares/validateRequest");
const {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} = require("../validations/cartValidation");

const router = express.Router();

router.use(authenticate);

router.get("/", getCart);
router.post("/items", validate(addToCartSchema), addToCart);
router.put("/items/:productId", validate(updateCartItemSchema), updateCartItem);
router.delete("/items/:productId", validate(removeCartItemSchema), removeCartItem);
router.delete("/", clearCart);

module.exports = router;
