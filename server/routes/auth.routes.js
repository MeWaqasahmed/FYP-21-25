const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes (with rate limiting)
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password/:token', authLimiter, authController.resetPassword);

// Protected routes
router.get('/me', verifyToken, authController.getMe);
router.patch('/me', verifyToken, authController.updateProfile);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
