const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// Public routes
router.get('/browse', storeController.browseStores);
router.get('/:username', storeController.getPublicStore);

// Protected routes (influencer only)
router.post('/', verifyToken, requireRole('influencer'), storeController.createStore);
router.get('/my', verifyToken, requireRole('influencer'), storeController.getMyStore);
router.patch('/', verifyToken, requireRole('influencer'), storeController.updateStore);
router.delete('/', verifyToken, requireRole('influencer'), storeController.deleteStore);

module.exports = router;
