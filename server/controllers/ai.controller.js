const { generateProductContent } = require('../services/ai.service');
const Product = require('../models/Product.model');
const Subscription = require('../models/Subscription.model');
const apiResponse = require('../utils/apiResponse');

/**
 * Generate AI content for product
 * POST /api/ai/generate
 */
exports.generateContent = async (req, res, next) => {
  try {
    const { name, category, targetAudience, productId } = req.body;

    if (!name || !category) {
      return apiResponse(res, 400, false, null, 'Product name and category are required');
    }

    // Check subscription limits (AI generations)
    const subscription = await Subscription.findOne({ user: req.user.userId });
    
    // Note: In production, you'd track AI generation count per month
    // For now, we'll allow based on plan features

    const content = await generateProductContent({
      name,
      category,
      targetAudience,
    });

    // If productId provided, update the product
    if (productId) {
      const product = await Product.findOne({ _id: productId, owner: req.user.userId });
      if (product) {
        product.seoDescription = content.seoDescription;
        product.hashtags = content.hashtags;
        await product.save();
      }
    }

    return apiResponse(res, 200, true, { content }, 'AI content generated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Schedule social media post
 * POST /api/ai/schedule-post
 */
exports.schedulePost = async (req, res, next) => {
  try {
    const { productId, platform, caption, scheduledAt } = req.body;

    if (!productId || !platform || !caption || !scheduledAt) {
      return apiResponse(res, 400, false, null, 'All fields are required');
    }

    // Check subscription feature
    const subscription = await Subscription.findOne({ user: req.user.userId });
    if (!subscription.features.scheduledPosts) {
      return apiResponse(res, 403, false, null, 'Scheduled posts feature not available in your plan');
    }

    const product = await Product.findOne({ _id: productId, owner: req.user.userId });

    if (!product) {
      return apiResponse(res, 404, false, null, 'Product not found');
    }

    // Add scheduled post
    product.scheduledPosts.push({
      platform,
      caption,
      scheduledAt: new Date(scheduledAt),
      status: 'pending',
    });

    await product.save();

    return apiResponse(res, 201, true, { product }, 'Post scheduled successfully');
  } catch (error) {
    next(error);
  }
};
