const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const { validate } = require('../middleware');
const { createProductSchema, updateProductSchema } = require('../validators/productValidator');

/**
 * @route   GET /api/products/categories
 * @desc    Get all distinct categories
 */
router.get('/categories', ctrl.getCategories);

/**
 * @route   GET /api/products
 * @desc    List all products (supports ?search=, ?category=, ?artist=, ?page=, ?limit=)
 */
router.get('/', ctrl.getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by ID
 */
router.get('/:id', ctrl.getProductById);

/**
 * @route   POST /api/products
 * @desc    Create a new product (image fetched automatically from Lorem Picsum)
 */
router.post('/', validate(createProductSchema), ctrl.createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 */
router.put('/:id', validate(updateProductSchema), ctrl.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 */
router.delete('/:id', ctrl.deleteProduct);

module.exports = router;
