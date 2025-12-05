const { success } = require("../utils/apiResponse");
const {
  createProduct,
  updateProductById,
  deleteProductById,
  getProductById,
  listProductsWithFilters,
} = require("../services/productService");

async function listProducts(req, res, next) {
  try {
    const { search, category, minPrice, maxPrice, sortBy, page = 1, limit = 12 } = req.validated.query;
    const result = await listProductsWithFilters({
      search,
      category,
      minPrice,
      maxPrice,
      sortBy,
      page,
      limit,
    });
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await getProductById(req.params.id);
    return success(res, { product });
  } catch (err) {
    next(err);
  }
}

async function createProductHandler(req, res, next) {
  try {
    const product = await createProduct(req.validated.body);
    return success(res, { product }, "Product created", 201);
  } catch (err) {
    next(err);
  }
}

async function updateProductHandler(req, res, next) {
  try {
    const product = await updateProductById(req.params.id, req.validated.body);
    return success(res, { product }, "Product updated");
  } catch (err) {
    next(err);
  }
}

async function deleteProductHandler(req, res, next) {
  try {
    await deleteProductById(req.params.id);
    return success(res, {}, "Product deleted");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct: createProductHandler,
  updateProduct: updateProductHandler,
  deleteProduct: deleteProductHandler,
};
