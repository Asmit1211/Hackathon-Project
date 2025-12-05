const { success } = require("../utils/apiResponse");
const { getAllUsers } = require("../services/userService");
const { getAllOrders, getSalesSummary } = require("../services/orderService");
const { getTopSelling } = require("../services/productService");

async function getAllUsersHandler(req, res, next) {
  try {
    const users = await getAllUsers();
    return success(res, { users });
  } catch (err) {
    next(err);
  }
}

async function getAllOrdersHandler(req, res, next) {
  try {
    const orders = await getAllOrders();
    return success(res, { orders });
  } catch (err) {
    next(err);
  }
}

async function getAnalytics(req, res, next) {
  try {
    const [sales, topProducts] = await Promise.all([
      getSalesSummary(),
      getTopSelling(5),
    ]);
    return success(res, { sales, topProducts });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllUsers: getAllUsersHandler,
  getAllOrders: getAllOrdersHandler,
  getAnalytics,
};
