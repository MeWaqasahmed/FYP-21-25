# 🚀 Quick Start Guide

Get the Influencer Management Platform running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Git installed

## Step 1: Clone & Install (2 minutes)

```bash
# Navigate to project
cd Influencer_management_system

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

## Step 2: Environment Setup (2 minutes)

### Backend Environment

```bash
# In server/ directory
cp .env.example .env
```

Edit `server/.env`:
```env
# Required - Change these
MONGODB_URI=mongodb://localhost:27017/influencer_platform
JWT_SECRET=your-super-secret-jwt-key-change-this

# Optional - For full features
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=sk-your-openai-key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend Environment

```bash
# In client/ directory
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

## Step 3: Seed Database (Optional - 30 seconds)

```bash
# In server/ directory
npm run seed
```

This creates:
- 2 test users (admin + influencer)
- 1 sample store
- 5 sample products
- Sample analytics data

**Test Credentials:**
- **Influencer**: `john@example.com` / `Password123!`
- **Admin**: `admin@example.com` / `Admin123!`

## Step 4: Start Development Servers (30 seconds)

### Terminal 1 - Backend
```bash
cd server
npm run dev
```
Backend runs on: `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```
Frontend runs on: `http://localhost:5173`

## Step 5: Open & Test! 🎉

Open browser: `http://localhost:5173`

### Quick Test Flow:
1. **Register** a new account OR login with seeded credentials
2. **Create Store** - Set up your branded storefront
3. **Upload Product** - Add a product with images
4. **Generate AI Content** - Try the AI tools
5. **View Analytics** - Check your dashboard
6. **Visit Public Store** - Go to `/store/your-username`

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB locally
mongod

# OR use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

### Port Already in Use
```bash
# Backend (5000)
# Kill process on port 5000
npx kill-port 5000

# Frontend (5173)
# Kill process on port 5173
npx kill-port 5173
```

### Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Ensure backend is running on port 5000
- Check `VITE_API_BASE_URL` in client/.env
- Verify CORS settings in server/server.js

---

## 📱 Test Features

### Without External Services (Minimal Setup)
✅ Authentication (register/login)
✅ Store creation
✅ Product management (without images)
✅ Dashboard
✅ Analytics (basic)
✅ Public storefront

### With Cloudinary (Image Uploads)
✅ Product images
✅ Store logo/banner
✅ Avatar uploads

### With OpenAI (AI Features)
✅ SEO descriptions
✅ Hashtag generation
✅ Social media captions

### With Stripe (Payments)
✅ Subscription plans
✅ Checkout flow
✅ Plan upgrades

---

## 🎯 Quick Commands

```bash
# Backend
npm run dev          # Start dev server
npm start           # Start production server
npm run seed        # Seed database

# Frontend
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## 📚 Next Steps

1. **Read Documentation**
   - `README.md` - Project overview
   - `backend.md` - Backend details
   - `client/README.md` - Frontend details
   - `API_TESTING_GUIDE.md` - API endpoints

2. **Explore Features**
   - Create products
   - Generate AI content
   - View analytics
   - Test subscriptions

3. **Customize**
   - Update branding
   - Modify theme colors
   - Add custom features

4. **Deploy**
   - Read `DEPLOYMENT.md`
   - Choose hosting platform
   - Configure production environment

---

## 🆘 Need Help?

### Check Logs
```bash
# Backend logs
# Check terminal running npm run dev

# Frontend logs
# Check browser console (F12)
```

### Common Issues

**"Cannot connect to MongoDB"**
- Start MongoDB: `mongod`
- Or use MongoDB Atlas

**"API calls failing"**
- Backend running? Check `http://localhost:5000/api/health`
- CORS configured? Check server/server.js

**"Images not uploading"**
- Cloudinary configured? Check .env
- File size < 5MB?
- Valid image format?

**"AI not working"**
- OpenAI API key set? Check .env
- API key valid?
- Credits available?

---

## 🎉 You're Ready!

Your Influencer Management Platform is now running locally!

**What's Working:**
✅ Backend API (50+ endpoints)
✅ Frontend UI (60+ components)
✅ Database (MongoDB)
✅ Authentication (JWT)
✅ Real-time (Socket.io)

**Start Building:**
- Customize the theme
- Add new features
- Deploy to production
- Share with users

**Happy Coding! 🚀**

---

*For detailed documentation, see README.md and other docs in the project root.*
