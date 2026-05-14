const User = require('../models/User.model');
const Store = require('../models/Store.model');
const Product = require('../models/Product.model');
const Subscription = require('../models/Subscription.model');
const Analytics = require('../models/Analytics.model');
const apiResponse = require('../utils/apiResponse');

/**
 * Get all users
 * GET /api/admin/users
 */
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, isActive, search } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await User.countDocuments(query);

    return apiResponse(res, 200, true, {
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user status (suspend/activate)
 * PATCH /api/admin/users/:id/status
 */
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive, isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        ...(isActive !== undefined && { isActive }),
        ...(isVerified !== undefined && { isVerified }),
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return apiResponse(res, 404, false, null, 'User not found');
    }

    return apiResponse(res, 200, true, { user }, 'User status updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get platform-wide statistics
 * GET /api/admin/stats
 */
exports.getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'influencer' });
    const activeUsers = await User.countDocuments({ role: 'influencer', isActive: true });
    const totalStores = await Store.countDocuments();
    const publishedStores = await Store.countDocuments({ isPublished: true });
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Subscription breakdown
    const subscriptionStats = await Subscription.aggregate([
      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 },
        },
      },
    ]);

    // Total clicks in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentClicks = await Analytics.countDocuments({
      event: 'click',
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Revenue calculation (mock - in production, calculate from Stripe)
    const paidSubscriptions = await Subscription.countDocuments({
      plan: { $in: ['pro', 'premium'] },
      status: 'active',
    });

    return apiResponse(res, 200, true, {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      stores: {
        total: totalStores,
        published: publishedStores,
      },
      products: {
        total: totalProducts,
      },
      subscriptions: subscriptionStats,
      analytics: {
        clicksLast30Days: recentClicks,
      },
      revenue: {
        paidSubscriptions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all subscriptions
 * GET /api/admin/subscriptions
 */
exports.getSubscriptions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, plan, status } = req.query;

    const query = {};

    if (plan) {
      query.plan = plan;
    }

    if (status) {
      query.status = status;
    }

    const subscriptions = await Subscription.find(query)
      .populate('user', 'name email username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Subscription.countDocuments(query);

    return apiResponse(res, 200, true, {
      subscriptions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    next(error);
  }
};
