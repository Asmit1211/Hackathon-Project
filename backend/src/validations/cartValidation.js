const { z } = require("zod");

const cartItemBody = z.object({
  productId: z.string().length(24),
  quantity: z.number().int().positive(),
});

const addToCartSchema = z.object({ body: cartItemBody });

const updateCartItemSchema = z.object({
  body: cartItemBody,
  params: z.object({ productId: z.string().length(24) }),
});

const removeCartItemSchema = z.object({
  params: z.object({ productId: z.string().length(24) }),
});

const checkoutSchema = z.object({
  body: z.object({
    addressId: z.string().length(24).optional(),
    shippingAddress: z
      .object({
        line1: z.string(),
        line2: z.string().optional(),
        city: z.string(),
        state: z.string().optional(),
        postalCode: z.string(),
        country: z.string(),
      })
      .optional(),
  }),
});

const createPaymentIntentSchema = z.object({
  body: z.object({ orderId: z.string().length(24) }),
});

const createRazorpayOrderSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    currency: z
      .string()
      .min(3)
      .max(3)
      .transform((value) => value.toUpperCase())
      .optional(),
    receipt: z.string().max(191).optional(),
    notes: z.record(z.string()).optional(),
  }),
});

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
  checkoutSchema,
  createPaymentIntentSchema,
  createRazorpayOrderSchema,
};
