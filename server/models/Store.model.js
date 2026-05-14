const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Store username is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    logo: {
      type: String,
      default: '',
    },
    bannerImage: {
      type: String,
      default: '',
    },
    theme: {
      primaryColor: { type: String, default: '#6366f1' },
      accentColor: { type: String, default: '#f59e0b' },
      fontFamily: { type: String, default: 'Inter' },
    },
    categories: [{ type: String }],
    isPublished: {
      type: Boolean,
      default: false,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes
storeSchema.index({ owner: 1 });
storeSchema.index({ username: 1 });
storeSchema.index({ isPublished: 1, createdAt: -1 });

module.exports = mongoose.model('Store', storeSchema);
