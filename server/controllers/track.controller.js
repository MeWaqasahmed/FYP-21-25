const Product = require('../models/Product.model');
const Store = require('../models/Store.model');
const Analytics = require('../models/Analytics.model');
const Notification = require('../models/Notification.model');
const apiResponse = require('../utils/apiResponse');
const { getIO } = require('../config/socket');
const crypto = require('crypto');

/**
 * Track referral click
 * POST /api/track/click/:productId
 */
exports.trackClick = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return apiResponse(res, 404, false, null, 'Product not found');
    }

    // Increment click count
    product.clickCount += 1;
    await product.save();

    // Update store total clicks
    await Store.findByIdAndUpdate(product.store, {
      $inc: { totalClicks: 1 },
    });

    // Hash IP for privacy
    const ipAddress = req.ip || req.connection.remoteAddress;
    const ipHash = crypto.createHash('sha256').update(ipAddress).digest('hex');

    // Create analytics record
    await Analytics.create({
      product: product._id,
      store: product.store,
      owner: product.owner,
      event: 'click',
      ipHash,
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer || req.headers.referrer,
    });

    // Check for milestones and send notifications
    const milestones = [100, 500, 1000, 5000, 10000];
    if (milestones.includes(product.clickCount)) {
      const notification = await Notification.create({
        user: product.owner,
        type: 'milestone',
        title: '🎉 Milestone Reached!',
        message: `Your product "${product.name}" just hit ${product.clickCount} clicks!`,
        metadata: {
          productId: product._id,
          clickCount: product.clickCount,
        },
      });

      // Emit real-time notification via Socket.io
      try {
        const io = getIO();
        io.to(product.owner.toString()).emit('notification', {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          createdAt: notification.createdAt,
        });
      } catch (socketError) {
        console.error('Socket emit error:', socketError.message);
      }
    }

    return apiResponse(res, 200, true, {
      clickCount: product.clickCount,
      referralUrl: product.referralUrl,
    }, 'Click tracked successfully');
  } catch (error) {
    next(error);
  }
};
