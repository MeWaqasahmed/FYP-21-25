const Analytics = require('../models/Analytics.model');
const Product = require('../models/Product.model');
const mongoose = require('mongoose');

/**
 * Get analytics summary for an influencer
 */
async function getAnalyticsSummary(userId, startDate, endDate) {
  try {
    const summary = await Analytics.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: '$event',
          total: { $sum: 1 },
        },
      },
    ]);

    const result = {
      clicks: 0,
      views: 0,
      shares: 0,
    };

    summary.forEach((item) => {
      result[item._id + 's'] = item.total;
    });

    return result;
  } catch (error) {
    console.error('Analytics summary error:', error.message);
    throw error;
  }
}

/**
 * Get clicks per day for chart
 */
async function getClicksPerDay(userId, startDate, endDate) {
  try {
    const clicksPerDay = await Analytics.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
          event: 'click',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return clicksPerDay.map((item) => ({
      date: item._id,
      clicks: item.count,
    }));
  } catch (error) {
    console.error('Clicks per day error:', error.message);
    throw error;
  }
}

/**
 * Get top products by clicks
 */
async function getTopProducts(userId, limit = 5) {
  try {
    const topProducts = await Product.find({ owner: userId, isActive: true })
      .sort({ clickCount: -1 })
      .limit(limit)
      .select('name clickCount viewCount category images')
      .lean();

    return topProducts;
  } catch (error) {
    console.error('Top products error:', error.message);
    throw error;
  }
}

/**
 * Get per-product analytics
 */
async function getProductAnalytics(userId, startDate, endDate) {
  try {
    const productStats = await Analytics.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: { product: '$product', event: '$event' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.product',
          events: {
            $push: {
              event: '$_id.event',
              count: '$count',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          productName: '$product.name',
          category: '$product.category',
          events: 1,
        },
      },
    ]);

    return productStats;
  } catch (error) {
    console.error('Product analytics error:', error.message);
    throw error;
  }
}

module.exports = {
  getAnalyticsSummary,
  getClicksPerDay,
  getTopProducts,
  getProductAnalytics,
};
