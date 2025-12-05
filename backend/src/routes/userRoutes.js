const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const { getMe, updateMe, addAddress, deleteAddress } = require("../controllers/userController");

const router = express.Router();

router.use(authenticate);

router.get("/me", getMe);
router.put("/me", updateMe);
router.post("/me/addresses", addAddress);
router.delete("/me/addresses/:addressId", deleteAddress);

module.exports = router;
