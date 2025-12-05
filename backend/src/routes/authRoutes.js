const express = require("express");
const { register, login, refreshToken, logout } = require("../controllers/authController");
const { validate } = require("../middlewares/validateRequest");
const { registerSchema, loginSchema } = require("../validations/authValidation");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

module.exports = router;
