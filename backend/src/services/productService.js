const Product = require("../models/Product");

async function createProduct(data) {
  return Product.create(data);
}

async function updateProductById(id, data) {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }
  return product;
}

async function deleteProductById(id) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }
  return product;
}

async function getProductById(id) {
  const product = await Product.findById(id);
  if (!product || !product.isActive) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }
  return product;
}

async function listProductsWithFilters({ search, category, minPrice, maxPrice, sortBy, page = 1, limit = 12 }) {
  const query = { isActive: true };

  if (category) {
    query.category = category;
  }
  if (minPrice != null || maxPrice != null) {
    query.price = {};
    if (minPrice != null) query.price.$gte = minPrice;
    if (maxPrice != null) query.price.$lte = maxPrice;
  }

  let mongoQuery = Product.find(query);

  if (search) {
    mongoQuery = mongoQuery.find({ $text: { $search: search } });
  }

  if (sortBy === "newest") {
    mongoQuery = mongoQuery.sort({ createdAt: -1 });
  } else if (sortBy === "top_selling") {
    mongoQuery = mongoQuery.sort({ totalSold: -1 });
  } else if (sortBy === "haunted_level") {
    mongoQuery = mongoQuery.sort({ hauntedLevel: -1 });
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    mongoQuery.skip(skip).limit(limit),
    Product.countDocuments(query),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

async function getTopSelling(limit = 5) {
  return Product.find({ isActive: true }).sort({ totalSold: -1 }).limit(limit);
}

module.exports = {
  createProduct,
  updateProductById,
  deleteProductById,
  getProductById,
  listProductsWithFilters,
  getTopSelling,
};
