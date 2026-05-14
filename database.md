# Database Instructions — Influencer Promotional Management Platform
> Kiro Instruction Document | MongoDB + Mongoose

---

## Overview

**Database:** MongoDB Atlas (cloud) / MongoDB local (dev)  
**ODM:** Mongoose  
**Strategy:** Document-oriented NoSQL, collections per domain entity  
**Indexing:** Compound and single-field indexes on all frequently queried fields  

---

## Collections Summary

| Collection | Model File | Purpose |
|---|---|---|
| `users` | `User.model.js` | Influencer + Admin accounts |
| `stores` | `Store.model.js` | Influencer's online storefronts |
| `products` | `Product.model.js` | Products inside each store |
| `analytics` | `Analytics.model.js` | Individual click/view events |
| `subscriptions` | `Subscription.model.js` | Plan subscriptions per user |
| `notifications` | `Notification.model.js` | In-app notifications |

---

## Schema Definitions

### `User.model.js`

```js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['influencer', 'admin'], default: 'influencer' },
  avatar: { type: String, default: '' },
  bio: { type: String, maxlength: 300 },
  socialLinks: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    tiktok: { type: String, default: '' },
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  lastLogin: { type: Date },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);
```

---

### `Store.model.js`

```js
const storeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, maxlength: 500 },
  logo: { type: String, default: '' },
  bannerImage: { type: String, default: '' },
  theme: {
    primaryColor: { type: String, default: '#6366f1' },
    accentColor: { type: String, default: '#f59e0b' },
    fontFamily: { type: String, default: 'Inter' },
  },
  categories: [{ type: String }],
  isPublished: { type: Boolean, default: false },
  totalClicks: { type: Number, default: 0 },
  totalProducts: { type: Number, default: 0 },
}, { timestamps: true });

storeSchema.index({ owner: 1 });
storeSchema.index({ username: 1 });
storeSchema.index({ isPublished: 1, createdAt: -1 });

module.exports = mongoose.model('Store', storeSchema);
```

---

### `Product.model.js`

```js
const productSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  seoDescription: { type: String, default: '' },       // AI-generated
  hashtags: [{ type: String }],                        // AI-generated
  category: {
    type: String,
    enum: ['Fashion', 'Tech', 'Beauty', 'Health', 'Food', 'Lifestyle', 'Travel', 'Sports', 'Other'],
    required: true,
  },
  images: [{ type: String }],                          // Cloudinary URLs
  referralUrl: { type: String, required: true },
  referralCode: { type: String, unique: true },
  price: { type: Number },
  displayPrice: { type: String },
  clickCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  scheduledPosts: [{
    platform: { type: String, enum: ['instagram', 'facebook'] },
    caption: { type: String },
    scheduledAt: { type: Date },
    status: { type: String, enum: ['pending', 'published', 'failed'], default: 'pending' },
  }],
}, { timestamps: true });

productSchema.index({ store: 1 });
productSchema.index({ owner: 1 });
productSchema.index({ category: 1 });
productSchema.index({ clickCount: -1 });
productSchema.index({ referralCode: 1 });
productSchema.index({ store: 1, category: 1 });

module.exports = mongoose.model('Product', productSchema);
```

---

### `Analytics.model.js`

Stores individual interaction events. Aggregated on-demand using MongoDB aggregation pipelines.

```js
const analyticsSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: String, enum: ['click', 'view', 'share'], required: true },
  ipHash: { type: String },           // Hashed IP for uniqueness, not stored raw
  userAgent: { type: String },
  referrer: { type: String },
  country: { type: String },
}, { timestamps: true });

// TTL index: auto-delete raw events older than 1 year
analyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

// Query indexes
analyticsSchema.index({ owner: 1, createdAt: -1 });
analyticsSchema.index({ product: 1, event: 1, createdAt: -1 });
analyticsSchema.index({ store: 1, event: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
```

---

### `Subscription.model.js`

```js
const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  plan: { type: String, enum: ['free', 'pro', 'premium'], default: 'free' },
  status: { type: String, enum: ['active', 'cancelled', 'expired', 'trialing'], default: 'active' },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  currentPeriodStart: { type: Date },
  currentPeriodEnd: { type: Date },
  features: {
    maxProducts: { type: Number, default: 5 },
    aiGenerations: { type: Number, default: 10 },
    analyticsRetentionDays: { type: Number, default: 30 },
    scheduledPosts: { type: Boolean, default: false },
  },
}, { timestamps: true });

subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
```

**Plan Limits Reference:**

| Feature | Free | Pro | Premium |
|---|---|---|---|
| Max Products | 5 | 50 | Unlimited |
| AI Generations/mo | 10 | 100 | Unlimited |
| Analytics Retention | 30 days | 90 days | 1 year |
| Scheduled Posts | No | Yes | Yes |
| Custom Store Theme | No | Yes | Yes |

---

### `Notification.model.js`

```js
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['milestone', 'subscription', 'admin_alert', 'ai_complete', 'post_published'],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed },  // e.g. { productId, clickCount }
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

// Auto-delete notifications older than 90 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('Notification', notificationSchema);
```

---

## Database Connection (`config/db.js`)

```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## Key Aggregation Queries

### Get analytics summary for an influencer

```js
// Total clicks + views in date range
const summary = await Analytics.aggregate([
  {
    $match: {
      owner: new mongoose.Types.ObjectId(userId),
      event: { $in: ['click', 'view'] },
      createdAt: { $gte: startDate, $lte: endDate },
    },
  },
  { $group: { _id: '$event', total: { $sum: 1 } } },
]);
```

### Clicks per day (for chart)

```js
const clicksPerDay = await Analytics.aggregate([
  { $match: { owner: userId, event: 'click', createdAt: { $gte: startDate } } },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      count: { $sum: 1 },
    },
  },
  { $sort: { '_id': 1 } },
]);
```

### Top 5 products by clicks

```js
const topProducts = await Product.find({ owner: userId })
  .sort({ clickCount: -1 })
  .limit(5)
  .select('name clickCount viewCount category images');
```

---

## Data Integrity Rules

- A `User` can only have **one** `Store` — enforced via `unique: true` on `store.owner`.
- A `User` can only have **one** `Subscription` — enforced via `unique: true`.
- `Product` documents reference both `store` and `owner` for fast queries without joins.
- `referralCode` on Product is auto-generated (nanoid, 8 chars) and globally unique.
- Never delete analytics events — use TTL indexes for automatic cleanup.
- Soft-delete products via `isActive: false` — do not hard delete to preserve analytics.
- When a store is deleted: soft-delete all its products, archive analytics.

---

## Seeding (Development)

Create `server/seeds/seed.js`:

```js
// Creates: 1 admin, 3 influencers, each with a store and 5 products
// Run: node seeds/seed.js
```

Seed data should include:
- Admin user: `admin@platform.com` / `Admin@1234`
- Influencer user: `influencer1@test.com` / `Test@1234`
- Sample store with 5 products across different categories
- Sample analytics events (click, view) for the past 30 days
- Sample notifications

---

## Atlas Setup

1. Create a free-tier M0 cluster on MongoDB Atlas.
2. Whitelist IP `0.0.0.0/0` for development (restrict in production).
3. Create a DB user with read/write permissions.
4. Copy the connection string into `.env` as `MONGODB_URI`.
5. Enable **Atlas Search** if full-text store/product search is required.
6. Set up **Atlas Backup** for production.
