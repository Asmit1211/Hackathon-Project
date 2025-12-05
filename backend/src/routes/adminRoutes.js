const express = require("express");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  getAllOrders,
  getAnalytics,
} = require("../controllers/adminController");

const router = express.Router();

router.use(authenticate, authorizeAdmin);

router.get("/users", getAllUsers);
router.get("/orders", getAllOrders);
router.get("/analytics", getAnalytics);

module.exports = router;
