const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: String,
      enum: ['click', 'view', 'share'],
      required: true,
    },
    ipHash: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    referrer: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  { timestamps: true }
);

// TTL index: auto-delete raw events older than 1 year (31536000 seconds)
analyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

// Query indexes
analyticsSchema.index({ owner: 1, createdAt: -1 });
analyticsSchema.index({ product: 1, event: 1, createdAt: -1 });
analyticsSchema.index({ store: 1, event: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
