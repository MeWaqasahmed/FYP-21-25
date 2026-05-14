# Influencer Promotional Management Platform

A complete, production-ready MERN stack application for influencers to manage their promotional products, track analytics, and grow their business.

## 🚀 Features

### For Influencers
- **Store Management**: Create and customize your own branded storefront
- **Product Management**: Upload products with images, descriptions, and referral links
- **AI-Powered Content**: Generate SEO descriptions, hashtags, and social media captions
- **Analytics Dashboard**: Track clicks, views, and conversions in real-time
- **Scheduled Posts**: Schedule social media posts for Instagram and Facebook
- **Subscription Plans**: Free, Pro, and Premium tiers with different features
- **Real-time Notifications**: Get notified about milestones and important events

### For Admins
- **User Management**: View, verify, and manage influencer accounts
- **Platform Analytics**: Monitor platform-wide statistics
- **Subscription Management**: Track active subscriptions and revenue

### Technical Features
- **Real-time Updates**: Socket.io for live notifications
- **Secure Authentication**: JWT-based auth with role-based access control
- **File Uploads**: Cloudinary integration for image storage
- **Payment Processing**: Stripe integration for subscriptions
- **AI Integration**: OpenAI GPT-4o-mini for content generation
- **Email Notifications**: Nodemailer for transactional emails
- **Scheduled Jobs**: Node-cron for automated tasks

## 📁 Project Structure

```
influencer-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API call functions
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route configuration
│   │   ├── store/         # Zustand state management
│   │   ├── utils/         # Utility functions
│   │   └── constants/     # Constants and config
│   └── package.json
│
└── server/                # Node.js backend
    ├── config/            # Configuration files
    ├── controllers/       # Route controllers
    ├── middleware/        # Custom middleware
    ├── models/            # Mongoose models
    ├── routes/            # API routes
    ├── services/          # Business logic
    ├── utils/             # Utility functions
    ├── jobs/              # Scheduled jobs
    ├── seeds/             # Database seeding
    └── package.json
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Material UI v5** for UI components
- **Zustand** for state management
- **React Query** for server state
- **React Router v6** for routing
- **React Hook Form + Zod** for form validation
- **Recharts** for data visualization
- **Socket.io-client** for real-time features
- **Stripe.js** for payments

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer + Cloudinary** for file uploads
- **Socket.io** for real-time communication
- **OpenAI API** for AI content generation
- **Stripe** for payment processing
- **Nodemailer** for emails
- **Node-cron** for scheduled tasks

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- OpenAI API key
- Stripe account
- SMTP email service (Gmail, SendGrid, etc.)

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

Create `.env` files in both `server` and `client` directories:

**server/.env**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

OPENAI_API_KEY=your_openai_api_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**client/.env**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### 3. Seed Database (Optional)

```bash
cd server
npm run seed
```

This creates:
- 1 Admin user: `admin@platform.com` / `Admin@1234`
- 3 Influencers: `influencer1@test.com` / `Test@1234` (and influencer2, influencer3)
- 3 Stores with 5 products each
- Sample analytics data for the past 30 days

### 4. Run the Application

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

## 🎯 Usage

### For Influencers

1. **Register**: Create an account at `/register`
2. **Create Store**: Set up your branded storefront
3. **Upload Products**: Add products with images and referral links
4. **Generate AI Content**: Use AI tools to create SEO descriptions and social captions
5. **Share Your Store**: Share your public storefront URL (`/store/your-username`)
6. **Track Analytics**: Monitor clicks and conversions in the dashboard
7. **Upgrade Plan**: Subscribe to Pro or Premium for more features

### For Admins

1. **Login**: Use admin credentials at `/login`
2. **View Dashboard**: See platform-wide statistics
3. **Manage Users**: View, verify, or suspend user accounts
4. **Monitor Subscriptions**: Track active subscriptions

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/me` - Update profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Store Management
- `POST /api/store` - Create store
- `GET /api/store/my` - Get own store
- `PATCH /api/store` - Update store
- `GET /api/store/:username` - Get public store
- `GET /api/store/browse` - Browse all stores

### Products
- `POST /api/products` - Upload product
- `GET /api/products/my` - Get own products
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Analytics
- `GET /api/analytics/summary` - Get analytics summary
- `GET /api/analytics/clicks` - Get clicks over time
- `GET /api/analytics/products` - Get per-product analytics
- `GET /api/analytics/export` - Export as CSV

### AI Tools
- `POST /api/ai/generate` - Generate AI content
- `POST /api/ai/schedule-post` - Schedule social media post

### Subscriptions
- `GET /api/subscription/plans` - Get available plans
- `POST /api/subscription/checkout` - Create Stripe checkout
- `GET /api/subscription/my` - Get current subscription
- `DELETE /api/subscription/cancel` - Cancel subscription

### Admin
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/status` - Update user status
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/subscriptions` - Get all subscriptions

## 🎨 Design System

### Colors
- **Primary**: #6366f1 (Indigo)
- **Accent**: #f59e0b (Amber)
- **Background**: #0f0f13
- **Surface**: #1a1a24
- **Text Primary**: #f1f5f9
- **Text Secondary**: #94a3b8

### Typography
- **Font Family**: Inter
- **Headings**: 600-800 weight
- **Body**: 400 weight

### Components
- **Border Radius**: 12px
- **Button Height**: 40px
- **Card Elevation**: Subtle shadows with dark theme

## 📱 Responsive Design

- **Desktop**: Full sidebar + multi-column layouts
- **Tablet**: Collapsed sidebar + 2-column grids
- **Mobile**: Bottom drawer navigation + single column

## 🔒 Security Features

- JWT authentication with HTTP-only considerations
- Password hashing with bcrypt (12 rounds)
- Rate limiting on auth endpoints (10 req/15min)
- CORS configuration
- Helmet.js security headers
- Input validation with Zod
- SQL injection prevention (NoSQL)
- XSS protection

## 🚀 Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, or AWS
- Set all environment variables
- Configure MongoDB Atlas whitelist
- Set up Stripe webhooks

### Frontend (React)
- Deploy to Vercel, Netlify, or AWS S3
- Update API base URL
- Configure CORS on backend

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For issues or questions, please open an issue on GitHub or contact support.

---

**Built with ❤️ using the MERN stack**
