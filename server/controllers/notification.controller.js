const Notification = require('../models/Notification.model');
const apiResponse = require('../utils/apiResponse');

/**
 * Get all notifications for current user
 * GET /api/notifications
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;

    const query = { user: req.user.userId };

    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ user: req.user.userId, isRead: false });

    return apiResponse(res, 200, true, {
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return apiResponse(res, 404, false, null, 'Notification not found');
    }

    return apiResponse(res, 200, true, { notification }, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 */
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.userId, isRead: false },
      { isRead: true }
    );

    return apiResponse(res, 200, true, null, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};
