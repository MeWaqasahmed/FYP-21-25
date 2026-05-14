const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// All routes require admin authentication
router.get('/users', verifyToken, requireRole('admin'), adminController.getUsers);
router.patch('/users/:id/status', verifyToken, requireRole('admin'), adminController.updateUserStatus);
router.get('/stats', verifyToken, requireRole('admin'), adminController.getPlatformStats);
router.get('/subscriptions', verifyToken, requireRole('admin'), adminController.getSubscriptions);

module.exports = router;
