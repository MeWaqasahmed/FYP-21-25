const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// All routes require influencer authentication
router.get('/summary', verifyToken, requireRole('influencer'), analyticsController.getSummary);
router.get('/clicks', verifyToken, requireRole('influencer'), analyticsController.getClicks);
router.get('/products', verifyToken, requireRole('influencer'), analyticsController.getProductAnalytics);
router.get('/export', verifyToken, requireRole('influencer'), analyticsController.exportAnalytics);

module.exports = router;
