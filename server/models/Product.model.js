const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
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
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    seoDescription: {
      type: String,
      default: '',
    },
    hashtags: [{ type: String }],
    category: {
      type: String,
      enum: ['Fashion', 'Tech', 'Beauty', 'Health', 'Food', 'Lifestyle', 'Travel', 'Sports', 'Other'],
      required: true,
    },
    images: [{ type: String }],
    referralUrl: {
      type: String,
      required: [true, 'Referral URL is required'],
    },
    referralCode: {
      type: String,
      unique: true,
    },
    price: {
      type: Number,
    },
    displayPrice: {
      type: String,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    scheduledPosts: [
      {
        platform: {
          type: String,
          enum: ['instagram', 'facebook'],
        },
        caption: { type: String },
        scheduledAt: { type: Date },
        status: {
          type: String,
          enum: ['pending', 'published', 'failed'],
          default: 'pending',
        },
      },
    ],
  },
  { timestamps: true }
);

// Indexes
productSchema.index({ store: 1 });
productSchema.index({ owner: 1 });
productSchema.index({ category: 1 });
productSchema.index({ clickCount: -1 });
productSchema.index({ referralCode: 1 });
productSchema.index({ store: 1, category: 1 });

module.exports = mongoose.model('Product', productSchema);
