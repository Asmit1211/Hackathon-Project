const User = require("../models/User");

async function getUserById(id) {
  return User.findById(id).select("-password -refreshToken");
}

async function updateUserProfile(id, payload) {
  const allowed = { name: payload.name };
  return User.findByIdAndUpdate(id, allowed, { new: true }).select("-password -refreshToken");
}

async function addUserAddress(id, address) {
  const user = await User.findById(id);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  user.addresses.push(address);
  await user.save();
  return user;
}

async function removeUserAddress(id, addressId) {
  const user = await User.findById(id);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  user.addresses.id(addressId)?.remove?.();
  await user.save();
  return user;
}

async function getAllUsers() {
  return User.find().select("-password -refreshToken");
}

module.exports = {
  getUserById,
  updateUserProfile,
  addUserAddress,
  removeUserAddress,
  getAllUsers,
};
