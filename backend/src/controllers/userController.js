const { success } = require("../utils/apiResponse");
const {
  getUserById,
  updateUserProfile,
  addUserAddress,
  removeUserAddress,
} = require("../services/userService");

async function getMe(req, res, next) {
  try {
    const user = await getUserById(req.user._id);
    return success(res, { user });
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const user = await updateUserProfile(req.user._id, req.body);
    return success(res, { user }, "Profile updated");
  } catch (err) {
    next(err);
  }
}

async function addAddress(req, res, next) {
  try {
    const user = await addUserAddress(req.user._id, req.body);
    return success(res, { user }, "Address added", 201);
  } catch (err) {
    next(err);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const user = await removeUserAddress(req.user._id, req.params.addressId);
    return success(res, { user }, "Address removed");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMe,
  updateMe,
  addAddress,
  deleteAddress,
};
