# Frontend Instructions — Influencer Promotional Management Platform
> Kiro Instruction Document | React.js + Vite | MERN Stack

---

## Project Identity

**App Name:** Influencer Promotional Management Platform  
**Frontend Stack:** React.js (Vite), React Router v6, Axios, Zustand (state), React Query, Socket.io-client  
**UI Framework:** Material UI v5 (MUI) + custom Tailwind utility classes  
**AI Integration:** OpenAI API calls proxied through backend  
**Build Tool:** Vite  

---

## Folder Structure

```
client/
├── public/
│   └── assets/
├── src/
│   ├── api/               # Axios instance + all API call functions
│   ├── assets/            # Images, fonts, icons
│   ├── components/
│   │   ├── common/        # Button, Input, Modal, Loader, Badge, Avatar, Card
│   │   ├── layout/        # Sidebar, Navbar, Footer, PageWrapper
│   │   ├── dashboard/     # StatsCard, ChartWidget, AlertBanner
│   │   ├── store/         # ProductCard, StoreHeader, ReferralBadge
│   │   ├── analytics/     # LineChart, BarChart, TopProductsTable
│   │   ├── ai/            # AIContentPanel, HashtagSuggestions, CaptionEditor
│   │   └── admin/         # UserTable, PlatformStats, SubscriptionList
│   ├── hooks/             # useAuth, useStore, useAnalytics, useSocket
│   ├── pages/
│   │   ├── auth/          # Login.jsx, Register.jsx, ForgotPassword.jsx
│   │   ├── dashboard/     # InfluencerDashboard.jsx, AdminDashboard.jsx
│   │   ├── store/         # CreateStore.jsx, EditStore.jsx, StoreView.jsx
│   │   ├── products/      # UploadProduct.jsx, EditProduct.jsx, ProductList.jsx
│   │   ├── analytics/     # AnalyticsDashboard.jsx
│   │   ├── ai/            # AITools.jsx
│   │   ├── subscription/  # SubscriptionPlans.jsx, PaymentSuccess.jsx
│   │   ├── public/        # PublicStorefront.jsx, BrowseStores.jsx
│   │   └── admin/         # AdminPanel.jsx, ManageUsers.jsx
│   ├── routes/
│   │   ├── AppRouter.jsx  # All route definitions
│   │   ├── PrivateRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── store/             # Zustand slices: authSlice, storeSlice, uiSlice
│   ├── utils/             # formatDate, formatCurrency, debounce, validators
│   ├── constants/         # roles.js, apiEndpoints.js, planTiers.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── vite.config.js
└── package.json
```

---

## Pages & Routes

### Public Routes (no auth required)
| Route | Component | Description |
|---|---|---|
| `/` | `LandingPage` | Marketing homepage |
| `/login` | `Login` | Email + password login |
| `/register` | `Register` | New influencer sign-up |
| `/forgot-password` | `ForgotPassword` | Email-based reset |
| `/store/:username` | `PublicStorefront` | Buyer-facing store view (no login) |
| `/browse` | `BrowseStores` | Public store discovery |

### Influencer Routes (protected, role: influencer)
| Route | Component | Description |
|---|---|---|
| `/dashboard` | `InfluencerDashboard` | Stats overview, AI suggestions, alerts |
| `/store/create` | `CreateStore` | One-time store setup wizard |
| `/store/edit` | `EditStore` | Update store name, logo, theme, description |
| `/products` | `ProductList` | All products with filters |
| `/products/upload` | `UploadProduct` | Add new product |
| `/products/edit/:id` | `EditProduct` | Edit existing product |
| `/analytics` | `AnalyticsDashboard` | Clicks, views, conversions, top products |
| `/ai-tools` | `AITools` | Generate SEO descriptions, hashtags, captions |
| `/subscription` | `SubscriptionPlans` | View / upgrade plans |
| `/settings` | `ProfileSettings` | Account, password, social media links |

### Admin Routes (protected, role: admin)
| Route | Component | Description |
|---|---|---|
| `/admin` | `AdminDashboard` | Platform-wide metrics |
| `/admin/users` | `ManageUsers` | View, verify, suspend influencers |
| `/admin/subscriptions` | `SubscriptionList` | Active subscriptions |
| `/admin/content` | `ContentModeration` | Flag/review products |

---

## Authentication Flow

- On app load, check `localStorage` for JWT token via `useAuth` hook.
- Decode token to extract `role` (`influencer` | `admin`) and `userId`.
- Store auth state in Zustand `authSlice`.
- `PrivateRoute` redirects to `/login` if no valid token.
- `AdminRoute` additionally checks `role === 'admin'`.
- On logout: clear token, reset Zustand store, navigate to `/login`.

```js
// hooks/useAuth.js — pattern
const useAuth = () => {
  const { user, setUser, clearUser } = useAuthStore();
  const login = async (credentials) => { /* call API, store token */ };
  const logout = () => { localStorage.removeItem('token'); clearUser(); };
  return { user, login, logout };
};
```

---

## State Management (Zustand)

Use **Zustand** for global state. Keep slices small and focused.

```
authSlice     → { user, token, isAuthenticated }
storeSlice    → { storeData, products, isLoading }
uiSlice       → { sidebarOpen, notifications[], activeModal }
analyticsSlice→ { metrics, dateRange, topProducts }
```

Use **React Query** for all server state (data fetching, caching, mutations).  
Do NOT store server data in Zustand — only use it for UI/auth state.

---

## Component Patterns

### Page Layout
Every authenticated page wraps in `<PageWrapper>` which includes `<Navbar>` and `<Sidebar>`.

```jsx
// components/layout/PageWrapper.jsx
export default function PageWrapper({ title, children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <Navbar title={title} />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
```

### API Calls (Axios)
All API calls live in `src/api/`. Never call Axios directly inside components.

```js
// api/products.js
export const uploadProduct = (data) => axiosInstance.post('/products', data);
export const getMyProducts = (filters) => axiosInstance.get('/products/my', { params: filters });
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);
```

### Forms
Use **React Hook Form** + **Zod** for validation on all forms (login, register, product upload, store setup).

---

## Key Features — Implementation Notes

### Influencer Dashboard
- Fetch summary stats: total clicks, top product, active referral links, subscription status.
- Show a `LineChart` (Recharts) of clicks over the last 30 days.
- Display `AIContentPanel` with "Generate new caption" quick action.
- Show real-time notification count from `useSocket` hook.

### Product Management
- Product card shows: image, name, category, referral link (truncated), click count.
- "Upload Product" form fields: name, category (dropdown), description, referral URL, images (multi-upload via Cloudinary/Multer), price (display only).
- After upload, AI auto-generates an SEO description — show it in an editable panel.

### AI Tools Page
- Input: product name + category + target audience.
- On submit: POST to `/api/ai/generate` → display SEO description, 10 hashtag suggestions, Instagram + Facebook captions.
- Each output section has a "Copy" button and an inline editable text area.
- "Schedule Post" button opens a date-time picker modal.

### Analytics Dashboard
- Date range picker (last 7d / 30d / 90d / custom).
- Charts: clicks per day (line), top 5 products by clicks (bar), conversion rate (donut).
- Table: product name | clicks | views | conversion % | referral link.
- Export as CSV button.

### Public Storefront (`/store/:username`)
- NO authentication required.
- Display store banner, logo, description.
- Grid of product cards — clicking a product opens a modal with details + "Visit Product" button that opens the referral URL in a new tab.
- Track click event via `/api/track/click/:productId` on referral link click.

### Subscription Plans
- Three tiers: Free, Pro, Premium (fetched from backend).
- Use Stripe's hosted checkout via redirect (no embedded card form needed).
- On success redirect, show `PaymentSuccess.jsx` and refresh subscription status.

### Real-time Notifications
- Connect to Socket.io on authenticated pages.
- Listen for `notification` events → push to `uiSlice.notifications`.
- Bell icon in Navbar shows unread count badge.

---

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
```

---

## Coding Standards

- Use functional components with hooks only — no class components.
- All files use `.jsx` extension.
- Destructure props always.
- Async operations inside `useEffect` or React Query — no top-level awaits in components.
- Every API call has loading + error state handled.
- Use MUI `<Skeleton>` for all loading states.
- Responsive design: mobile-first. All pages must work on 375px viewport.
- Accessibility: all inputs have labels, all buttons have `aria-label` if icon-only.

---

## Dependencies to Install

```bash
npm create vite@latest client -- --template react
cd client
npm install react-router-dom axios zustand @tanstack/react-query
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install react-hook-form zod @hookform/resolvers
npm install recharts socket.io-client
npm install react-hot-toast
npm install @stripe/stripe-js
```
