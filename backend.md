# Backend Instructions — Influencer Promotional Management Platform
> Kiro Instruction Document | Node.js + Express.js | REST API

---

## Project Identity

**Backend Stack:** Node.js, Express.js  
**Database:** MongoDB via Mongoose  
**Auth:** JWT + Bcrypt  
**Real-time:** Socket.io  
**File Uploads:** Multer + Cloudinary  
**AI Integration:** OpenAI API  
**Email:** Nodemailer  
**Payments:** Stripe  
**Scheduled Jobs:** node-cron  

---

## Folder Structure

```
server/
├── config/
│   ├── db.js             # MongoDB connection
│   ├── cloudinary.js     # Cloudinary config
│   ├── stripe.js         # Stripe init
│   └── socket.js         # Socket.io setup
├── controllers/
│   ├── auth.controller.js
│   ├── store.controller.js
│   ├── product.controller.js
│   ├── analytics.controller.js
│   ├── ai.controller.js
│   ├── subscription.controller.js
│   ├── notification.controller.js
│   ├── track.controller.js
│   └── admin.controller.js
├── middleware/
│   ├── auth.middleware.js    # verifyToken, requireRole
│   ├── upload.middleware.js  # Multer config
│   ├── errorHandler.js       # Global error handler
│   └── rateLimiter.js        # express-rate-limit
├── models/
│   ├── User.model.js
│   ├── Store.model.js
│   ├── Product.model.js
│   ├── Analytics.model.js
│   ├── Subscription.model.js
│   └── Notification.model.js
├── routes/
│   ├── auth.routes.js
│   ├── store.routes.js
│   ├── product.routes.js
│   ├── analytics.routes.js
│   ├── ai.routes.js
│   ├── subscription.routes.js
│   ├── track.routes.js
│   ├── notification.routes.js
│   └── admin.routes.js
├── services/
│   ├── ai.service.js         # OpenAI calls
│   ├── email.service.js      # Nodemailer helpers
│   ├── stripe.service.js     # Stripe helpers
│   └── analytics.service.js  # Aggregation helpers
├── utils/
│   ├── generateToken.js
│   ├── generateReferralCode.js
│   └── apiResponse.js        # Standardized response wrapper
├── jobs/
│   └── scheduledPosts.job.js # node-cron for scheduled social posts
├── .env
├── app.js
└── server.js
```

---

## Entry Points

### `server.js`
```js
const app = require('./app');
const { createServer } = require('http');
const { initSocket } = require('./config/socket');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

initSocket(httpServer);
connectDB().then(() => {
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
```

### `app.js`
```js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(errorHandler);
module.exports = app;
```

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register new influencer |
| POST | `/login` | No | Login, return JWT |
| POST | `/forgot-password` | No | Send reset email |
| POST | `/reset-password/:token` | No | Reset password with token |
| GET | `/me` | JWT | Get current user profile |
| PATCH | `/me` | JWT | Update profile |
| POST | `/logout` | JWT | Invalidate session |

### Store (`/api/store`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Influencer | Create store |
| GET | `/my` | Influencer | Get own store |
| PATCH | `/` | Influencer | Update store details |
| DELETE | `/` | Influencer | Delete store |
| GET | `/:username` | Public | Get public store by username |
| GET | `/browse` | Public | Browse/search all public stores |

### Products (`/api/products`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Influencer | Upload new product |
| GET | `/my` | Influencer | Get own products (with filters) |
| PATCH | `/:id` | Influencer | Edit product |
| DELETE | `/:id` | Influencer | Delete product |
| GET | `/:id` | Public | Get single product |

### Analytics (`/api/analytics`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/summary` | Influencer | Total clicks, views, top products |
| GET | `/clicks` | Influencer | Clicks over time (date range) |
| GET | `/products` | Influencer | Per-product analytics |
| GET | `/export` | Influencer | Export CSV |

### AI (`/api/ai`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/generate` | Influencer | Generate SEO desc + hashtags + captions |
| POST | `/schedule-post` | Influencer | Schedule a social media post |

### Referral Tracking (`/api/track`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/click/:productId` | Public | Record a referral link click |

### Subscription (`/api/subscription`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/plans` | Public | List available plans |
| POST | `/checkout` | Influencer | Create Stripe checkout session |
| POST | `/webhook` | No (Stripe) | Stripe webhook handler |
| GET | `/my` | Influencer | Get current subscription |
| DELETE | `/cancel` | Influencer | Cancel subscription |

### Notifications (`/api/notifications`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Influencer | Get all notifications |
| PATCH | `/:id/read` | Influencer | Mark as read |
| PATCH | `/read-all` | Influencer | Mark all as read |

### Admin (`/api/admin`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users` | Admin | List all users |
| PATCH | `/users/:id/status` | Admin | Suspend / activate user |
| GET | `/stats` | Admin | Platform-wide stats |
| GET | `/subscriptions` | Admin | All subscriptions |

---

## Middleware

### `auth.middleware.js`
```js
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Forbidden' });
  next();
};
```

### `errorHandler.js`
```js
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

### `upload.middleware.js`
- Use Multer with Cloudinary storage.
- Accept images only (jpg, jpeg, png, webp).
- Max file size: 5MB.
- Max files per upload: 5.

---

## Services

### `ai.service.js`
```js
const { OpenAI } = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateProductContent({ name, category, targetAudience }) {
  const prompt = `You are an SEO and social media expert.
Product: ${name}
Category: ${category}
Target Audience: ${targetAudience}

Generate:
1. SEO product description (100-150 words)
2. 10 relevant hashtags
3. Instagram caption (2-3 sentences)
4. Facebook post (3-4 sentences)

Return as JSON: { seoDescription, hashtags, instagramCaption, facebookPost }`;

  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });
  return JSON.parse(res.choices[0].message.content);
}
```

### `analytics.service.js`
Track click events and aggregate using MongoDB's aggregation pipeline.
- Count clicks per product per day.
- Calculate conversion rate = (unique buyers / total clicks) * 100.
- Surface "top performing products" = sorted by click count desc.

### `email.service.js`
Use Nodemailer with SMTP (Gmail or SendGrid).
- `sendPasswordReset(email, resetToken)`
- `sendWelcome(email, name)`
- `sendSubscriptionConfirmation(email, planName)`

---

## Real-time (Socket.io)

```js
// config/socket.js
let io;
const initSocket = (httpServer) => {
  io = require('socket.io')(httpServer, { cors: { origin: process.env.CLIENT_URL } });
  io.on('connection', (socket) => {
    socket.on('join', (userId) => socket.join(userId));
    socket.on('disconnect', () => {});
  });
};
const getIO = () => io;
module.exports = { initSocket, getIO };
```

Emit notifications from controllers:
```js
getIO().to(userId).emit('notification', { message: 'Your product hit 100 clicks!' });
```

---

## Referral Click Tracking

When a buyer clicks a referral link on the public storefront, the frontend calls `POST /api/track/click/:productId`.

Controller logic:
1. Increment `clickCount` on the `Product` document.
2. Create an `Analytics` record: `{ productId, storeId, event: 'click', timestamp, ip (hashed), userAgent }`.
3. Check if click count crosses a milestone (100, 500, 1000) → emit Socket.io notification to influencer.

---

## Subscription (Stripe)

- Create a Stripe Checkout Session on `POST /api/subscription/checkout`.
- Pass `success_url` and `cancel_url` pointing back to the frontend.
- Handle Stripe webhooks at `POST /api/subscription/webhook` (raw body parser, not JSON).
- On `checkout.session.completed` event: activate subscription in DB.
- On `customer.subscription.deleted`: downgrade to Free plan.

---

## Scheduled Jobs (node-cron)

```js
// jobs/scheduledPosts.job.js
const cron = require('node-cron');
cron.schedule('* * * * *', async () => {
  // Find posts where scheduledAt <= now and status = 'pending'
  // Call social media APIs to publish
  // Update status to 'published'
});
```

---

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

OPENAI_API_KEY=sk-...

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
```

---

## Coding Standards

- All controller functions are `async/await` with `try/catch` or a `catchAsync` wrapper.
- Use `apiResponse` utility for consistent JSON responses: `{ success, data, message }`.
- Never expose password or sensitive fields in API responses — use `.select('-password')`.
- Validate request body with `express-validator` or `Joi` on every mutating endpoint.
- Rate limit auth endpoints: 10 requests per 15 minutes per IP.
- Use HTTP status codes correctly: 200, 201, 400, 401, 403, 404, 409, 500.

---

## Dependencies to Install

```bash
mkdir server && cd server
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors helmet
npm install multer cloudinary multer-storage-cloudinary
npm install socket.io nodemailer stripe node-cron
npm install openai express-rate-limit express-validator
npm install -D nodemon
```
