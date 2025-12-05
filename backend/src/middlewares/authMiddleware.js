const jwt = require("jsonwebtoken");
const { ENV } = require("../config/env");
const User = require("../models/User");
const { failure } = require("../utils/apiResponse");
const { ROLES } = require("../utils/constants");

async function authenticate(req, res, next) {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return failure(res, "Not authorized", 401);
    }

    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return failure(res, "User not found", 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return failure(res, "Not authorized", 401);
  }
}

function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    return failure(res, "Admin access required", 403);
  }
  next();
}

module.exports = { authenticate, authorizeAdmin };
