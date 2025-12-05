const express = require("express");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");
const {
  checkoutFromCart,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const { validate } = require("../middlewares/validateRequest");
const { checkoutSchema } = require("../validations/cartValidation");

const router = express.Router();

router.use(authenticate);

router.post("/checkout", validate(checkoutSchema), checkoutFromCart);
router.get("/me", getMyOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", authorizeAdmin, updateOrderStatus);

module.exports = router;
