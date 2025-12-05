const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ENV } = require("../config/env");

function generateTokens(user) {
  const payload = { id: user._id, role: user.role };
  const accessToken = jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
    expiresIn: ENV.JWT_ACCESS_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
}

async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email already registered");
    err.statusCode = 400;
    throw err;
  }
  const user = await User.create({ name, email, password });
  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();
  return { user, ...tokens };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }
  const match = await user.comparePassword(password);
  if (!match) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }
  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();
  return { user, ...tokens };
}

async function rotateRefreshToken(oldRefreshToken) {
  if (!oldRefreshToken) {
    const err = new Error("Refresh token required");
    err.statusCode = 400;
    throw err;
  }
  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, ENV.JWT_REFRESH_SECRET);
  } catch (e) {
    const err = new Error("Invalid refresh token");
    err.statusCode = 401;
    throw err;
  }
  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== oldRefreshToken) {
    const err = new Error("Refresh token no longer valid");
    err.statusCode = 401;
    throw err;
  }
  const tokens = generateTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();
  return { user, ...tokens };
}

async function clearRefreshToken(userId) {
  const user = await User.findById(userId);
  if (!user) return;
  user.refreshToken = undefined;
  await user.save();
}

module.exports = {
  registerUser,
  loginUser,
  rotateRefreshToken,
  clearRefreshToken,
};
