const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'trialing'],
      default: 'active',
    },
    stripeCustomerId: {
      type: String,
    },
    stripeSubscriptionId: {
      type: String,
    },
    currentPeriodStart: {
      type: Date,
    },
    currentPeriodEnd: {
      type: Date,
    },
    features: {
      maxProducts: { type: Number, default: 5 },
      aiGenerations: { type: Number, default: 10 },
      analyticsRetentionDays: { type: Number, default: 30 },
      scheduledPosts: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Indexes
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
