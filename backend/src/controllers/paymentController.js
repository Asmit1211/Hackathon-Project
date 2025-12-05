const { success } = require("../utils/apiResponse");
const { createOrderPaymentIntent, createRazorpayOrder } = require("../services/paymentService");
const { ENV } = require("../config/env");

async function createPaymentIntent(req, res, next) {
  try {
    const { orderId } = req.validated.body;
    const { intent } = await createOrderPaymentIntent(req.user._id, orderId);
    return success(res, { clientSecret: intent.client_secret }, "Payment intent created", 201);
  } catch (err) {
    next(err);
  }
}

async function createRazorpayOrderController(req, res, next) {
  try {
    const { amount, currency, receipt, notes } = req.validated.body;
    const order = await createRazorpayOrder({ amount, currency, receipt, notes });
    return success(
      res,
      { order, keyId: ENV.RAZORPAY_KEY_ID },
      "Razorpay order created",
      201,
    );
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createPaymentIntent,
  createRazorpayOrder: createRazorpayOrderController,
};
