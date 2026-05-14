const apiResponse = require('../utils/apiResponse');
const {
  getAnalyticsSummary,
  getClicksPerDay,
  getTopProducts,
  getProductAnalytics,
} = require('../services/analytics.service');

/**
 * Get analytics summary
 * GET /api/analytics/summary
 */
exports.getSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const summary = await getAnalyticsSummary(req.user.userId, start, end);
    const topProducts = await getTopProducts(req.user.userId, 5);

    return apiResponse(res, 200, true, {
      summary,
      topProducts,
      dateRange: { startDate: start, endDate: end },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get clicks over time
 * GET /api/analytics/clicks
 */
exports.getClicks = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const clicksData = await getClicksPerDay(req.user.userId, start, end);

    return apiResponse(res, 200, true, { clicksData });
  } catch (error) {
    next(error);
  }
};

/**
 * Get per-product analytics
 * GET /api/analytics/products
 */
exports.getProductAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const productStats = await getProductAnalytics(req.user.userId, start, end);

    return apiResponse(res, 200, true, { productStats });
  } catch (error) {
    next(error);
  }
};

/**
 * Export analytics as CSV
 * GET /api/analytics/export
 */
exports.exportAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const productStats = await getProductAnalytics(req.user.userId, start, end);

    // Generate CSV
    let csv = 'Product Name,Category,Clicks,Views,Shares\n';

    productStats.forEach((stat) => {
      const clicks = stat.events.find((e) => e.event === 'click')?.count || 0;
      const views = stat.events.find((e) => e.event === 'view')?.count || 0;
      const shares = stat.events.find((e) => e.event === 'share')?.count || 0;

      csv += `"${stat.productName}","${stat.category}",${clicks},${views},${shares}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
