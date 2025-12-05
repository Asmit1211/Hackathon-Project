const express = require("express");
const {
  register,
  login,
  refreshToken,
  logout,
  firebaseLoginNotify,
  firebaseSignupNotify,
} = require("../controllers/authController");
const { validate } = require("../middlewares/validateRequest");
const {
  registerSchema,
  loginSchema,
  firebaseLoginNotifySchema,
  firebaseSignupNotifySchema,
} = require("../validations/authValidation");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// Called from the frontend after a successful Firebase login/signup.
router.post("/firebase-login-notify", validate(firebaseLoginNotifySchema), firebaseLoginNotify);
router.post("/firebase-signup-notify", validate(firebaseSignupNotifySchema), firebaseSignupNotify);

module.exports = router;
