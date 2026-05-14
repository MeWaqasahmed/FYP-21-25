const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parser middleware
// Note: Stripe webhook needs raw body, so we handle it separately in routes
app.use((req, res, next) => {
  if (req.originalUrl === '/api/subscription/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/store', require('./routes/store.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/subscription', require('./routes/subscription.routes'));
app.use('/api/track', require('./routes/track.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
