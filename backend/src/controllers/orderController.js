const { success } = require("../utils/apiResponse");
const {
  checkoutFromCart,
  getOrdersForUser,
  getOrderByIdForUser,
  updateOrderStatusByAdmin,
} = require("../services/orderService");

async function checkoutFromCartHandler(req, res, next) {
  try {
    const shippingAddress = req.validated.body.shippingAddress;
    const order = await checkoutFromCart(req.user._id, { shippingAddress });
    return success(res, { order }, "Order created", 201);
  } catch (err) {
    next(err);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const orders = await getOrdersForUser(req.user._id);
    return success(res, { orders });
  } catch (err) {
    next(err);
  }
}

async function getOrderById(req, res, next) {
  try {
    const order = await getOrderByIdForUser(req.user._id, req.params.id);
    return success(res, { order });
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await updateOrderStatusByAdmin(req.params.id, status);
    return success(res, { order }, "Order status updated");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  checkoutFromCart: checkoutFromCartHandler,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
