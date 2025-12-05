const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { ORDER_STATUS } = require("../utils/constants");

async function checkoutFromCart(userId, { shippingAddress }) {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    const err = new Error("Cart is empty");
    err.statusCode = 400;
    throw err;
  }

  // Validate stock and compute totals
  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (!product || !product.isActive) {
      const err = new Error(`Product ${item.product._id} is unavailable`);
      err.statusCode = 400;
      throw err;
    }
    if (product.stock < item.quantity) {
      const err = new Error(`Insufficient stock for ${product.name}`);
      err.statusCode = 400;
      throw err;
    }

    const price = product.price;
    const subtotal = price * item.quantity;
    totalAmount += subtotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      category: product.category,
      quantity: item.quantity,
      price,
      subtotal,
    });
  }

  // Deduct stock & increment totalSold
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity, totalSold: item.quantity },
    });
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    status: ORDER_STATUS.PROCESSING,
    paymentStatus: "pending",
    shippingAddress: shippingAddress || undefined,
  });

  // Clear cart after order creation
  cart.items = [];
  await cart.save();

  return order;
}

async function getOrdersForUser(userId) {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
}

async function getOrderByIdForUser(userId, orderId) {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }
  return order;
}

async function getAllOrders() {
  return Order.find().sort({ createdAt: -1 }).populate("user", "name email");
}

async function updateOrderStatusByAdmin(orderId, status) {
  const order = await Order.findById(orderId);
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }
  order.status = status;
  await order.save();
  return order;
}

async function getSalesSummary() {
  const [totals] = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
  ]);

  return totals || { totalRevenue: 0, count: 0 };
}

module.exports = {
  checkoutFromCart,
  getOrdersForUser,
  getOrderByIdForUser,
  getAllOrders,
  updateOrderStatusByAdmin,
  getSalesSummary,
};
