const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.get('/', verifyToken, notificationController.getNotifications);
router.patch('/:id/read', verifyToken, notificationController.markAsRead);
router.patch('/read-all', verifyToken, notificationController.markAllAsRead);

module.exports = router;
