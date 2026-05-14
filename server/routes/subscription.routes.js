const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// Public routes
router.get('/plans', subscriptionController.getPlans);

// Stripe webhook (raw body required)
router.post('/webhook', express.raw({ type: 'application/json' }), subscriptionController.handleWebhook);

// Protected routes (influencer only)
router.post('/checkout', verifyToken, requireRole('influencer'), subscriptionController.createCheckout);
router.get('/my', verifyToken, requireRole('influencer'), subscriptionController.getMySubscription);
router.delete('/cancel', verifyToken, requireRole('influencer'), subscriptionController.cancelSubscription);

module.exports = router;
