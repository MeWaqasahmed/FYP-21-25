const express = require('express');
const router = express.Router();
const trackController = require('../controllers/track.controller');

// Public route - no authentication required
router.post('/click/:productId', trackController.trackClick);

module.exports = router;
