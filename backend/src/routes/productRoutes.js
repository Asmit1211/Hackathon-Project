const express = require("express");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { validate } = require("../middlewares/validateRequest");
const {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
} = require("../validations/productValidation");

const router = express.Router();

router.get("/", validate(getProductsQuerySchema), listProducts);
router.get("/:id", getProduct);

router.post("/", authenticate, authorizeAdmin, validate(createProductSchema), createProduct);
router.put("/:id", authenticate, authorizeAdmin, validate(updateProductSchema), updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

module.exports = router;
