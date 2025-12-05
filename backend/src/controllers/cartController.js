const { success } = require("../utils/apiResponse");
const {
  getCartForUser,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
} = require("../services/cartService");

async function getCart(req, res, next) {
  try {
    const cart = await getCartForUser(req.user._id);
    return success(res, { cart });
  } catch (err) {
    next(err);
  }
}

async function addToCart(req, res, next) {
  try {
    const { productId, quantity } = req.validated.body;
    const cart = await addItemToCart(req.user._id, { productId, quantity });
    return success(res, { cart }, "Item added to cart", 201);
  } catch (err) {
    next(err);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const { productId } = req.validated.params;
    const { quantity } = req.validated.body;
    const cart = await updateCartItemQuantity(req.user._id, { productId, quantity });
    return success(res, { cart }, "Cart updated");
  } catch (err) {
    next(err);
  }
}

async function removeCartItem(req, res, next) {
  try {
    const { productId } = req.validated.params;
    const cart = await removeItemFromCart(req.user._id, productId);
    return success(res, { cart }, "Item removed");
  } catch (err) {
    next(err);
  }
}

async function clearCartHandler(req, res, next) {
  try {
    await clearCart(req.user._id);
    return success(res, {}, "Cart cleared");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart: clearCartHandler,
};
