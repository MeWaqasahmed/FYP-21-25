# Influencer Platform - Frontend

A modern, production-ready React application for influencers to manage promotional products, track analytics, and leverage AI-powered content generation.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Material-UI v5** - Component library with custom dark theme
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **React Query** - Server state management
- **React Hook Form + Zod** - Form handling and validation
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Socket.io Client** - Real-time notifications
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

## 📁 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── api/               # API integration layer
│   │   ├── axiosInstance.js
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── store.js
│   │   ├── analytics.js
│   │   ├── ai.js
│   │   ├── subscription.js
│   │   ├── admin.js
│   │   ├── notifications.js
│   │   └── track.js
│   ├── components/        # Reusable components
│   │   ├── layout/       # Layout components
│   │   │   ├── PageWrapper.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Navbar.jsx
│   │   ├── common/       # Shared components
│   │   │   ├── Button.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── SubscriptionBadge.jsx
│   │   ├── dashboard/    # Dashboard components
│   │   │   ├── ChartWidget.jsx
│   │   │   └── TopProductsTable.jsx
│   │   ├── analytics/    # Analytics components
│   │   │   ├── ClicksLineChart.jsx
│   │   │   ├── TopProductsBar.jsx
│   │   │   ├── ConversionDonut.jsx
│   │   │   └── AnalyticsTable.jsx
│   │   └── ai/          # AI components
│   │       ├── AIContentPanel.jsx
│   │       └── HashtagChips.jsx
│   ├── pages/            # Page components
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # Dashboard pages
│   │   ├── store/       # Store management
│   │   ├── products/    # Product management
│   │   ├── analytics/   # Analytics pages
│   │   ├── ai/          # AI tools
│   │   ├── subscription/# Subscription pages
│   │   ├── settings/    # Settings pages
│   │   ├── public/      # Public pages
│   │   └── admin/       # Admin pages
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useSocket.js
│   │   ├── useTitle.js
│   │   ├── useAnalytics.js
│   │   └── useStore.js
│   ├── routes/           # Route configuration
│   │   ├── AppRouter.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── store/            # Zustand stores
│   │   ├── authSlice.js
│   │   └── uiSlice.js
│   ├── constants/        # Constants and configs
│   │   ├── apiEndpoints.js
│   │   ├── planTiers.js
│   │   └── roles.js
│   ├── utils/            # Utility functions
│   │   ├── validators.js
│   │   ├── formatCurrency.js
│   │   └── formatDate.js
│   ├── theme.js          # MUI theme configuration
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
├── index.html
├── vite.config.js
├── package.json
└── .env.example
```

## 🎨 Design System

### Colors
- **Background**: `#0f0f13` (default), `#1a1a24` (paper)
- **Primary**: `#6366f1` (indigo)
- **Secondary**: `#f59e0b` (amber)
- **Success**: `#22c55e`
- **Error**: `#ef4444`
- **Warning**: `#f97316`

### Typography
- **Font Family**: Inter (Google Fonts)
- **Border Radius**: 12px
- **Transitions**: 150-200ms ease

### Animations
- **Hover**: `translateY(-2px)` with shadow increase
- **Active**: `scale(0.98)`
- **Page Transitions**: 200ms fade with Framer Motion
- **Stats**: CountUp animation on mount

## 🔧 Setup & Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

3. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage and Zustand
3. Axios interceptor adds token to all requests
4. Protected routes check authentication status
5. Admin routes check role permissions

## 🎯 Key Features

### For Influencers
- **Dashboard**: Overview with stats, charts, and quick actions
- **Store Management**: Create and customize branded storefront
- **Product Management**: Upload products with multi-image support
- **AI Content Generation**: SEO descriptions, hashtags, social captions
- **Analytics**: Track clicks, views, conversions with charts
- **Subscription Plans**: Free, Pro, Premium tiers with Stripe
- **Real-time Notifications**: Socket.io for milestone alerts

### For Admins
- **Admin Dashboard**: Platform-wide statistics
- **User Management**: View, suspend, activate users
- **Subscription Overview**: Monitor paid subscriptions

### Public Features
- **Landing Page**: Marketing page with features and pricing
- **Browse Stores**: Discover influencer storefronts
- **Public Storefront**: View products without authentication
- **Product Tracking**: Click tracking on referral links

## 🔌 API Integration

All API calls go through `axiosInstance` which:
- Adds JWT token to headers
- Handles 401 errors (redirects to login)
- Provides consistent error handling

Example:
```javascript
import { productsAPI } from '@/api/products';

const { data } = await productsAPI.getMy();
```

## 🎣 Custom Hooks

### useAuth
```javascript
const { user, login, logout, isAuthenticated } = useAuth();
```

### useStore
```javascript
const { store, products, uploadProduct, updateStore } = useStore();
```

### useAnalytics
```javascript
const { summary, clicks, products, setRange } = useAnalytics();
```

### useSocket
```javascript
useSocket(); // Auto-connects and listens for notifications
```

### useTitle
```javascript
useTitle('Dashboard'); // Sets page title
```

## 🎨 Component Patterns

### Page Structure
```jsx
<PageWrapper title="Page Title">
  <Box>
    {/* Page content */}
  </Box>
</PageWrapper>
```

### Loading States
```jsx
if (isLoading) {
  return <Loader />;
}
```

### Empty States
```jsx
<EmptyState
  icon={Package}
  title="No products found"
  message="Start by uploading your first product"
  action="Upload Product"
  onAction={() => navigate('/products/upload')}
/>
```

## 📱 Responsive Design

- **Desktop**: Full sidebar (240px)
- **Tablet** (< 1280px): Icon-only sidebar (80px)
- **Mobile** (< 768px): Drawer sidebar, bottom navigation

## 🔔 Real-time Notifications

Socket.io connection established on authentication:
- Joins user-specific room
- Listens for `notification` events
- Shows toast and updates notification bell
- Stores in Zustand for persistence

## 🎭 Form Validation

Using React Hook Form + Zod:
```javascript
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

## 🚀 Performance Optimizations

- **Code Splitting**: Route-based lazy loading
- **React Query**: Automatic caching and refetching
- **Debounced Search**: 300ms delay on search inputs
- **Image Optimization**: Lazy loading, proper sizing
- **Memoization**: useMemo/useCallback where needed

## 🔒 Security Features

- JWT token in localStorage (httpOnly not possible in SPA)
- Automatic token refresh on 401
- Role-based route protection
- Input validation on all forms
- XSS protection via React's escaping
- CORS configuration on backend

## 🎨 Theming

Custom MUI theme in `theme.js`:
- Dark mode first
- Custom color palette
- Typography scale
- Component overrides
- Custom shadows

## 📊 State Management

### Zustand Stores

**authSlice**: User authentication state
```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {},
  clearAuth: () => {},
}
```

**uiSlice**: UI state
```javascript
{
  sidebarOpen: true,
  notifications: [],
  toggleSidebar: () => {},
  addNotification: (notif) => {},
}
```

## 🧪 Testing Recommendations

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright or Cypress
- **Component Tests**: Storybook
- **API Mocking**: MSW (Mock Service Worker)

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

Output in `dist/` folder.

### Environment Variables
Set these in your hosting platform:
- `VITE_API_BASE_URL`
- `VITE_SOCKET_URL`
- `VITE_STRIPE_PUBLIC_KEY`

### Hosting Options
- **Vercel**: Zero-config deployment
- **Netlify**: Automatic builds from Git
- **AWS S3 + CloudFront**: Static hosting
- **Docker**: Use provided Dockerfile

## 📝 Code Style

- Functional components only
- Hooks for state and side effects
- Props destructuring
- Named exports for components
- Consistent file naming (PascalCase for components)
- ESLint + Prettier for formatting

## 🐛 Common Issues

### CORS Errors
Ensure backend CORS is configured for your frontend URL.

### Socket Connection Failed
Check `VITE_SOCKET_URL` matches backend URL.

### 401 Errors
Token expired or invalid. Clear localStorage and re-login.

### Build Errors
Clear `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Material-UI Docs](https://mui.com)
- [React Query Docs](https://tanstack.com/query)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

1. Follow existing code patterns
2. Add PropTypes or TypeScript types
3. Write meaningful commit messages
4. Test thoroughly before PR
5. Update documentation

## 📄 License

MIT License - see LICENSE file for details
