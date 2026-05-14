/**
 * Standardized API response wrapper
 */
const apiResponse = (res, statusCode, success, data = null, message = '') => {
  return res.status(statusCode).json({
    success,
    ...(data && { data }),
    ...(message && { message }),
  });
};

module.exports = apiResponse;
