const { z } = require("zod");

const productBody = z.object({
  name: z.string().min(2),
  category: z.enum([
    "cursed_doll",
    "cursed_charm",
    "goodluck_charm",
    "haunted_stone",
    "haunted_art",
    "normal_merch",
  ]),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()).min(1),
  shortDescription: z.string().min(10),
  longDescription: z.string().min(20),
  antiqueTag: z.string().optional(),
  origin: z.string().optional(),
  isFeatured: z.boolean().optional(),
  safeShippingWarning: z.string().optional(),
  hauntedLevel: z.number().int().min(1).max(10).optional(),
  isActive: z.boolean().optional(),
});

const createProductSchema = z.object({ body: productBody });

const updateProductSchema = z.object({
  body: productBody.partial(),
  params: z.object({ id: z.string().length(24) }),
});

const getProductsQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    sortBy: z
      .enum(["newest", "top_selling", "haunted_level"])
      .optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
};
