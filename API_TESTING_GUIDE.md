# API Testing Guide

Complete guide to test all backend endpoints using curl, Postman, or Thunder Client.

## 🚀 Setup

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Seed the database (optional):
```bash
npm run seed
```

## 📝 Test Accounts (After Seeding)

- **Admin**: admin@platform.com / Admin@1234
- **Influencer 1**: influencer1@test.com / Test@1234
- **Influencer 2**: influencer2@test.com / Test@1234

## 🔐 Authentication Endpoints

### 1. Register New User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test@1234"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "Test User",
      "username": "testuser",
      "email": "test@example.com",
      "role": "influencer"
    }
  },
  "message": "Registration successful"
}
```

### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "influencer1@test.com",
  "password": "Test@1234"
}
```

**Save the token from response for subsequent requests!**

### 3. Get Current User
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Update Profile
```bash
PATCH http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "My new bio"
}
```

### 5. Forgot Password
```bash
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

## 🏪 Store Endpoints

### 1. Create Store
```bash
POST http://localhost:5000/api/store
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "My Awesome Store",
  "username": "mystore",
  "description": "Welcome to my store!",
  "categories": ["Fashion", "Lifestyle"]
}
```

### 2. Get My Store
```bash
GET http://localhost:5000/api/store/my
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Update Store
```bash
PATCH http://localhost:5000/api/store
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "description": "Updated description",
  "isPublished": true
}
```

### 4. Get Public Store (No Auth Required)
```bash
GET http://localhost:5000/api/store/store1
```

### 5. Browse Stores (No Auth Required)
```bash
GET http://localhost:5000/api/store/browse?search=fashion&page=1&limit=12
```

## 📦 Product Endpoints

### 1. Upload Product (with images)
```bash
POST http://localhost:5000/api/products
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

name: Cool Product
description: This is an amazing product
category: Tech
referralUrl: https://example.com/product
price: 99.99
displayPrice: $99.99
images: [file1.jpg, file2.jpg]
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Cool Product" \
  -F "description=Amazing product" \
  -F "category=Tech" \
  -F "referralUrl=https://example.com/product" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### 2. Get My Products
```bash
GET http://localhost:5000/api/products/my?category=Tech&page=1&limit=12
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Get Single Product (No Auth Required)
```bash
GET http://localhost:5000/api/products/PRODUCT_ID
```

### 4. Update Product
```bash
PATCH http://localhost:5000/api/products/PRODUCT_ID
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Updated Product Name",
  "description": "Updated description",
  "isActive": true
}
```

### 5. Delete Product
```bash
DELETE http://localhost:5000/api/products/PRODUCT_ID
Authorization: Bearer YOUR_TOKEN_HERE
```

## 📊 Analytics Endpoints

### 1. Get Analytics Summary
```bash
GET http://localhost:5000/api/analytics/summary?startDate=2026-04-01&endDate=2026-05-14
Authorization: Bearer YOUR_TOKEN_HERE
```

### 2. Get Clicks Over Time
```bash
GET http://localhost:5000/api/analytics/clicks?startDate=2026-04-01&endDate=2026-05-14
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Get Per-Product Analytics
```bash
GET http://localhost:5000/api/analytics/products?startDate=2026-04-01&endDate=2026-05-14
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Export Analytics as CSV
```bash
GET http://localhost:5000/api/analytics/export?startDate=2026-04-01&endDate=2026-05-14
Authorization: Bearer YOUR_TOKEN_HERE
```

## 🤖 AI Endpoints

### 1. Generate AI Content
```bash
POST http://localhost:5000/api/ai/generate
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Wireless Earbuds",
  "category": "Tech",
  "targetAudience": "Tech enthusiasts and music lovers"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "content": {
      "seoDescription": "...",
      "hashtags": ["#tech", "#earbuds", ...],
      "instagramCaption": "...",
      "facebookPost": "..."
    }
  }
}
```

### 2. Schedule Social Media Post
```bash
POST http://localhost:5000/api/ai/schedule-post
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "productId": "PRODUCT_ID",
  "platform": "instagram",
  "caption": "Check out this amazing product!",
  "scheduledAt": "2026-05-15T10:00:00Z"
}
```

## 💳 Subscription Endpoints

### 1. Get Available Plans (No Auth Required)
```bash
GET http://localhost:5000/api/subscription/plans
```

### 2. Create Checkout Session
```bash
POST http://localhost:5000/api/subscription/checkout
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "planName": "pro"
}
```

**Response contains Stripe checkout URL**

### 3. Get My Subscription
```bash
GET http://localhost:5000/api/subscription/my
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Cancel Subscription
```bash
DELETE http://localhost:5000/api/subscription/cancel
Authorization: Bearer YOUR_TOKEN_HERE
```

## 📍 Tracking Endpoint

### Track Referral Click (No Auth Required)
```bash
POST http://localhost:5000/api/track/click/PRODUCT_ID
```

**This endpoint:**
- Increments product click count
- Creates analytics record
- Sends notification on milestones (100, 500, 1000 clicks)

## 🔔 Notification Endpoints

### 1. Get Notifications
```bash
GET http://localhost:5000/api/notifications?page=1&limit=20&unreadOnly=true
Authorization: Bearer YOUR_TOKEN_HERE
```

### 2. Mark Notification as Read
```bash
PATCH http://localhost:5000/api/notifications/NOTIFICATION_ID/read
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Mark All as Read
```bash
PATCH http://localhost:5000/api/notifications/read-all
Authorization: Bearer YOUR_TOKEN_HERE
```

## 👑 Admin Endpoints

**Note: Requires admin role**

### 1. Get All Users
```bash
GET http://localhost:5000/api/admin/users?page=1&limit=20&role=influencer
Authorization: Bearer ADMIN_TOKEN_HERE
```

### 2. Update User Status
```bash
PATCH http://localhost:5000/api/admin/users/USER_ID/status
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "isActive": false,
  "isVerified": true
}
```

### 3. Get Platform Statistics
```bash
GET http://localhost:5000/api/admin/stats
Authorization: Bearer ADMIN_TOKEN_HERE
```

### 4. Get All Subscriptions
```bash
GET http://localhost:5000/api/admin/subscriptions?plan=pro&status=active
Authorization: Bearer ADMIN_TOKEN_HERE
```

## 🧪 Complete Test Flow

### Scenario: New Influencer Journey

1. **Register**
```bash
POST /api/auth/register
{
  "name": "Jane Doe",
  "username": "janedoe",
  "email": "jane@example.com",
  "password": "Jane@1234"
}
```

2. **Create Store**
```bash
POST /api/store
Authorization: Bearer TOKEN
{
  "name": "Jane's Fashion",
  "username": "janefashion",
  "description": "Curated fashion picks"
}
```

3. **Upload Product**
```bash
POST /api/products
Authorization: Bearer TOKEN
{
  "name": "Designer Handbag",
  "description": "Luxury handbag",
  "category": "Fashion",
  "referralUrl": "https://example.com/handbag"
}
```

4. **Generate AI Content**
```bash
POST /api/ai/generate
Authorization: Bearer TOKEN
{
  "name": "Designer Handbag",
  "category": "Fashion",
  "targetAudience": "Fashion enthusiasts"
}
```

5. **View Analytics**
```bash
GET /api/analytics/summary
Authorization: Bearer TOKEN
```

6. **Upgrade Subscription**
```bash
POST /api/subscription/checkout
Authorization: Bearer TOKEN
{
  "planName": "pro"
}
```

## 🔍 Testing Tips

### Using Postman
1. Create a new collection
2. Add environment variables for `baseUrl` and `token`
3. Use `{{baseUrl}}` and `{{token}}` in requests
4. Save token from login response to environment

### Using Thunder Client (VS Code)
1. Install Thunder Client extension
2. Create new request
3. Set Authorization header: `Bearer {{token}}`
4. Use environment variables

### Using curl
```bash
# Save token to variable
TOKEN="your_token_here"

# Use in requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/auth/me
```

## ✅ Expected Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (no/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **409** - Conflict (duplicate username/email)
- **500** - Internal Server Error

## 🐛 Common Issues

### 401 Unauthorized
- Check if token is included in Authorization header
- Verify token format: `Bearer TOKEN`
- Token may have expired (7 days default)

### 403 Forbidden
- Check user role (admin endpoints require admin role)
- Verify you're accessing your own resources

### 409 Conflict
- Username or email already exists
- Store username already taken

### 500 Internal Server Error
- Check server logs
- Verify MongoDB connection
- Check environment variables

## 📊 Sample Data

After running `npm run seed`, you'll have:

**Stores:**
- store1 (influencer1)
- store2 (influencer2)
- store3 (influencer3)

**Products:**
- 5 products per store (15 total)
- Various categories
- Sample analytics data

**Users:**
- 1 admin
- 3 influencers

## 🔄 Real-time Testing

### Test Socket.io Notifications

1. Connect to Socket.io:
```javascript
const socket = io('http://localhost:5000');
socket.emit('join', 'USER_ID');
socket.on('notification', (data) => {
  console.log('Notification:', data);
});
```

2. Trigger notification by clicking a product 100 times:
```bash
for i in {1..100}; do
  curl -X POST http://localhost:5000/api/track/click/PRODUCT_ID
done
```

## 📝 Notes

- All timestamps are in ISO 8601 format
- File uploads use multipart/form-data
- Pagination uses `page` and `limit` query params
- Date filters use `startDate` and `endDate` query params
- Search uses case-insensitive regex matching

---

**Happy Testing! 🚀**
