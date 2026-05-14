const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: `${API_BASE}/auth/register`,
    LOGIN: `${API_BASE}/auth/login`,
    LOGOUT: `${API_BASE}/auth/logout`,
    ME: `${API_BASE}/auth/me`,
    UPDATE_PROFILE: `${API_BASE}/auth/me`,
    FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`,
    RESET_PASSWORD: (token) => `${API_BASE}/auth/reset-password/${token}`,
  },
  
  // Store
  STORE: {
    CREATE: `${API_BASE}/store`,
    MY: `${API_BASE}/store/my`,
    UPDATE: `${API_BASE}/store`,
    DELETE: `${API_BASE}/store`,
    PUBLIC: (username) => `${API_BASE}/store/${username}`,
    BROWSE: `${API_BASE}/store/browse`,
  },
  
  // Products
  PRODUCTS: {
    UPLOAD: `${API_BASE}/products`,
    MY: `${API_BASE}/products/my`,
    GET: (id) => `${API_BASE}/products/${id}`,
    UPDATE: (id) => `${API_BASE}/products/${id}`,
    DELETE: (id) => `${API_BASE}/products/${id}`,
  },
  
  // Analytics
  ANALYTICS: {
    SUMMARY: `${API_BASE}/analytics/summary`,
    CLICKS: `${API_BASE}/analytics/clicks`,
    PRODUCTS: `${API_BASE}/analytics/products`,
    EXPORT: `${API_BASE}/analytics/export`,
  },
  
  // AI
  AI: {
    GENERATE: `${API_BASE}/ai/generate`,
    SCHEDULE_POST: `${API_BASE}/ai/schedule-post`,
  },
  
  // Subscription
  SUBSCRIPTION: {
    PLANS: `${API_BASE}/subscription/plans`,
    CHECKOUT: `${API_BASE}/subscription/checkout`,
    MY: `${API_BASE}/subscription/my`,
    CANCEL: `${API_BASE}/subscription/cancel`,
  },
  
  // Track
  TRACK: {
    CLICK: (productId) => `${API_BASE}/track/click/${productId}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    GET: `${API_BASE}/notifications`,
    MARK_READ: (id) => `${API_BASE}/notifications/${id}/read`,
    MARK_ALL_READ: `${API_BASE}/notifications/read-all`,
  },
  
  // Admin
  ADMIN: {
    USERS: `${API_BASE}/admin/users`,
    UPDATE_USER_STATUS: (id) => `${API_BASE}/admin/users/${id}/status`,
    STATS: `${API_BASE}/admin/stats`,
    SUBSCRIPTIONS: `${API_BASE}/admin/subscriptions`,
  },
};
