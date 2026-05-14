const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const { uploadMultiple } = require('../middleware/upload.middleware');

// Public routes
router.get('/:id', productController.getProduct);

// Protected routes (influencer only)
router.post('/', verifyToken, requireRole('influencer'), uploadMultiple, productController.uploadProduct);
router.get('/my', verifyToken, requireRole('influencer'), productController.getMyProducts);
router.patch('/:id', verifyToken, requireRole('influencer'), uploadMultiple, productController.updateProduct);
router.delete('/:id', verifyToken, requireRole('influencer'), productController.deleteProduct);

module.exports = router;
