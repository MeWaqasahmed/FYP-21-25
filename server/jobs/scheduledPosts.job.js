const cron = require('node-cron');
const Product = require('../models/Product.model');
const Notification = require('../models/Notification.model');
const { getIO } = require('../config/socket');

/**
 * Scheduled job to publish social media posts
 * Runs every minute
 */
const scheduledPostsJob = cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();

    // Find products with pending scheduled posts that are due
    const products = await Product.find({
      'scheduledPosts.status': 'pending',
      'scheduledPosts.scheduledAt': { $lte: now },
    });

    for (const product of products) {
      for (const post of product.scheduledPosts) {
        if (post.status === 'pending' && new Date(post.scheduledAt) <= now) {
          // In production, this would call the actual social media APIs
          // For now, we'll just mark it as published
          
          console.log(`📱 Publishing post for product: ${product.name} on ${post.platform}`);
          
          post.status = 'published';

          // Create notification
          const notification = await Notification.create({
            user: product.owner,
            type: 'post_published',
            title: '✅ Post Published',
            message: `Your scheduled post for "${product.name}" has been published on ${post.platform}`,
            metadata: {
              productId: product._id,
              platform: post.platform,
            },
          });

          // Emit real-time notification
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
      }

      await product.save();
    }
  } catch (error) {
    console.error('❌ Scheduled posts job error:', error.message);
  }
});

module.exports = scheduledPostsJob;
