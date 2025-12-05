const Cart = require("../models/Cart");
const Product = require("../models/Product");

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

async function getCartForUser(userId) {
  return getOrCreateCart(userId);
}

async function addItemToCart(userId, { productId, quantity }) {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }
  if (product.stock < quantity) {
    const err = new Error("Insufficient stock");
    err.statusCode = 400;
    throw err;
  }

  const cart = await getOrCreateCart(userId);
  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    const newQty = existing.quantity + quantity;
    if (product.stock < newQty) {
      const err = new Error("Insufficient stock");
      err.statusCode = 400;
      throw err;
    }
    existing.quantity = newQty;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      priceAtAdd: product.price,
    });
  }
  await cart.save();
  return cart.populate("items.product");
}

async function updateCartItemQuantity(userId, { productId, quantity }) {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }
  if (product.stock < quantity) {
    const err = new Error("Insufficient stock");
    err.statusCode = 400;
    throw err;
  }
  const cart = await getOrCreateCart(userId);
  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (!existing) {
    const err = new Error("Item not in cart");
    err.statusCode = 404;
    throw err;
  }
  existing.quantity = quantity;
  await cart.save();
  return cart.populate("items.product");
}

async function removeItemFromCart(userId, productId) {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();
  return cart.populate("items.product");
}

async function clearCart(userId) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;
  cart.items = [];
  await cart.save();
  return cart;
}

module.exports = {
  getCartForUser,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
};
