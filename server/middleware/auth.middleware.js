const jwt = require('jsonwebtoken');
const apiResponse = require('../utils/apiResponse');

/**
 * Verify JWT token from Authorization header
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return apiResponse(res, 401, false, null, 'Unauthorized - No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, email }
    next();
  } catch (error) {
    return apiResponse(res, 401, false, null, 'Unauthorized - Invalid token');
  }
};

/**
 * Require specific role(s)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return apiResponse(res, 401, false, null, 'Unauthorized');
    }

    if (!roles.includes(req.user.role)) {
      return apiResponse(res, 403, false, null, 'Forbidden - Insufficient permissions');
    }

    next();
  };
};

module.exports = { verifyToken, requireRole };
