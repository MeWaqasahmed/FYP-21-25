import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authSlice';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Dashboard Pages
import InfluencerDashboard from '../pages/dashboard/InfluencerDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

// Store Pages
import CreateStore from '../pages/store/CreateStore';
import EditStore from '../pages/store/EditStore';

// Product Pages
import ProductList from '../pages/products/ProductList';
import UploadProduct from '../pages/products/UploadProduct';
import EditProduct from '../pages/products/EditProduct';

// Analytics
import AnalyticsDashboard from '../pages/analytics/AnalyticsDashboard';

// AI Tools
import AITools from '../pages/ai/AITools';

// Subscription
import SubscriptionPlans from '../pages/subscription/SubscriptionPlans';

// Settings
import ProfileSettings from '../pages/settings/ProfileSettings';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import PublicStorefront from '../pages/public/PublicStorefront';
import BrowseStores from '../pages/public/BrowseStores';

// Admin Pages
import ManageUsers from '../pages/admin/ManageUsers';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function AppRouter() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
              ) : (
                <PageTransition>
                  <LandingPage />
                </PageTransition>
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
              ) : (
                <PageTransition>
                  <Login />
                </PageTransition>
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <PageTransition>
                  <Register />
                </PageTransition>
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageTransition>
                <ForgotPassword />
              </PageTransition>
            }
          />
          <Route
            path="/store/:username"
            element={
              <PageTransition>
                <PublicStorefront />
              </PageTransition>
            }
          />
          <Route
            path="/browse"
            element={
              <PageTransition>
                <BrowseStores />
              </PageTransition>
            }
          />

          {/* Influencer Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <PageTransition>
                  <InfluencerDashboard />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/store/create"
            element={
              <PrivateRoute>
                <PageTransition>
                  <CreateStore />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/store/edit"
            element={
              <PrivateRoute>
                <PageTransition>
                  <EditStore />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <PageTransition>
                  <ProductList />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/products/upload"
            element={
              <PrivateRoute>
                <PageTransition>
                  <UploadProduct />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/products/edit/:id"
            element={
              <PrivateRoute>
                <PageTransition>
                  <EditProduct />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <PageTransition>
                  <AnalyticsDashboard />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/ai-tools"
            element={
              <PrivateRoute>
                <PageTransition>
                  <AITools />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <PrivateRoute>
                <PageTransition>
                  <SubscriptionPlans />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <PageTransition>
                  <ProfileSettings />
                </PageTransition>
              </PrivateRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <PageTransition>
                  <AdminDashboard />
                </PageTransition>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <PageTransition>
                  <ManageUsers />
                </PageTransition>
              </AdminRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
