import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Providers
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Storefront Components
import Navbar from './components/storefront/Navbar';
import Footer from './components/storefront/Footer';
import CartDrawer from './components/storefront/CartDrawer';
import WhatsAppButton from './components/storefront/WhatsAppButton';

// Storefront Pages
import Home from './pages/storefront/Home';
import Shop from './pages/storefront/Shop';
import ProductDetail from './pages/storefront/ProductDetail';
import Checkout from './pages/storefront/Checkout';
import OrderConfirmation from './pages/storefront/OrderConfirmation';
import TrackOrder from './pages/storefront/TrackOrder';
import About from './pages/storefront/About';
import Contact from './pages/storefront/Contact';

// Admin Components & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminInventory from './pages/admin/AdminInventory';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

function StorefrontLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <CartDrawer />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  // Scroll to top on route navigation
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <SettingsProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Storefront Routes */}
            <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
            <Route path="/shop" element={<StorefrontLayout><Shop /></StorefrontLayout>} />
            <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
            <Route path="/checkout" element={<StorefrontLayout><Checkout /></StorefrontLayout>} />
            <Route path="/order-confirmation/:id" element={<StorefrontLayout><OrderConfirmation /></StorefrontLayout>} />
            <Route path="/track-order" element={<StorefrontLayout><TrackOrder /></StorefrontLayout>} />
            <Route path="/about" element={<StorefrontLayout><About /></StorefrontLayout>} />
            <Route path="/contact" element={<StorefrontLayout><Contact /></StorefrontLayout>} />

            {/* Admin Authentication Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Protected Console */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
