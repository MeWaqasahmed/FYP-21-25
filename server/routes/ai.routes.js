const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// All routes require influencer authentication
router.post('/generate', verifyToken, requireRole('influencer'), aiController.generateContent);
router.post('/schedule-post', verifyToken, requireRole('influencer'), aiController.schedulePost);

module.exports = router;
