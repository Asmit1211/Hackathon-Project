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
    amount: z.coerce.number().positive(),
    currency: z
      .string()
      .min(3)
      .max(3)
      .transform((value) => value.toUpperCase())
      .optional(),
    receipt: z.string().max(191).optional(),
    notes: z.record(z.string()).optional(),
    // Optional linkage to a domain Order; current frontend does not send this but
    // other clients (e.g. admin tools) can.
    orderId: z.string().length(24).optional(),
    customer: z
      .object({
        email: z.string().email().optional(),
        name: z.string().min(1).optional(),
        phone: z.string().optional(),
        firebaseUid: z.string().optional(),
      })
      .optional(),
    items: z
      .array(
        z.object({
          productId: z.string(),
          title: z.string(),
          category: z.string().optional(),
          image: z.string().optional(),
          quantity: z.coerce.number().int().positive(),
          price: z.coerce.number().nonnegative(),
          subtotal: z.coerce.number().nonnegative(),
        })
      )
      .optional(),
  }),
});

const verifyRazorpayPaymentSchema = z.object({
  body: z.object({
    razorpayOrderId: z.string().min(1),
    razorpayPaymentId: z.string().min(1),
    razorpaySignature: z.string().min(1),
  }),
});

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
  checkoutSchema,
  createPaymentIntentSchema,
  createRazorpayOrderSchema,
  verifyRazorpayPaymentSchema,
};
