const { success, failure } = require("../utils/apiResponse");
const {
  registerUser,
  loginUser,
  rotateRefreshToken,
  clearRefreshToken,
} = require("../services/authService");
const { sendWelcomeEmail } = require("../services/emailService");

function setAuthCookies(res, accessToken, refreshToken) {
  // For hackathon simplicity, we return tokens in body; cookies can be added later.
  // Example cookie config for production (HTTPS-only):
  // res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
  // res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.validated.body;
    const { user, accessToken, refreshToken } = await registerUser({ name, email, password });
    setAuthCookies(res, accessToken, refreshToken);
    // Fire-and-forget spooky welcome email for new backend user registrations
    void sendWelcomeEmail({ to: user.email, name: user.name, context: "signup" });
    return success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
      "Registered successfully",
      201,
    );
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.validated.body;
    const { user, accessToken, refreshToken } = await loginUser({ email, password });
    setAuthCookies(res, accessToken, refreshToken);
    void sendWelcomeEmail({ to: user.email, name: user.name, context: "login" });
    return success(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

async function refreshToken(req, res, next) {
  try {
    const old = req.body.refreshToken || req.cookies?.refreshToken;
    const { user, accessToken, refreshToken: newRefresh } = await rotateRefreshToken(old);
    setAuthCookies(res, accessToken, newRefresh);
    return success(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken: newRefresh,
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const refreshTokenVal = req.body.refreshToken || req.cookies?.refreshToken;
    if (req.user) {
      await clearRefreshToken(req.user._id);
    }
    if (refreshTokenVal) {
      // best-effort: try to decode and clear for that user as well
      await clearRefreshToken(refreshTokenVal);
    }
    // Clear cookies if used
    // res.clearCookie("accessToken");
    // res.clearCookie("refreshToken");
    return success(res, {}, "Logged out");
  } catch (err) {
    next(err);
  }
}

// Endpoint used when Firebase-only auth is responsible for authentication.
// The frontend calls this after a successful Firebase login so the backend can
// send an SMTP email without handling credentials in the browser.
async function firebaseLoginNotify(req, res, next) {
  try {
    const { email, name } = req.validated.body;
    void sendWelcomeEmail({ to: email, name, context: "login" });
    return success(res, {}, "Login welcome email enqueued");
  } catch (err) {
    next(err);
  }
}

// Called from the frontend after a successful Firebase signup
async function firebaseSignupNotify(req, res, next) {
  try {
    const { email, name } = req.validated.body;
    void sendWelcomeEmail({ to: email, name, context: "signup" });
    return success(res, {}, "Signup welcome email enqueued");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  firebaseLoginNotify,
  firebaseSignupNotify,
};
