import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import SearchOverlay from './components/SearchOverlay';
import CartDrawer from './components/CartDrawer';
import AIChatBot from './components/home/AIChatBot';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import SalePage from './pages/SalePage';
import CollectionsPage from './pages/CollectionsPage';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import CheckoutPage from './pages/CheckoutPage';
import NotFound from './pages/NotFound';
import InfoPage from './pages/InfoPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const title = 'NASSEG — AI-Powered Fashion Boutique';
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Discover luxury fashion at NASSEG — an AI-powered boutique featuring curated collections, smart recommendations, and seamless shopping." />
      </Helmet>
      <ScrollToTop />
      <SearchOverlay />
      <CartDrawer />
      {isHome && <AIChatBot />}
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="/sale" element={<SalePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/account" element={<UserDashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/info/:slug" element={<InfoPage />} />
          <Route path="/contact-us" element={<InfoPage />} />
          <Route path="/about" element={<InfoPage />} />
          <Route path="/faqs" element={<InfoPage />} />
          <Route path="/shipping-returns" element={<InfoPage />} />
          <Route path="/sizing-guide" element={<InfoPage />} />
          <Route path="/order-tracking" element={<InfoPage />} />
          <Route path="/sustainability" element={<InfoPage />} />
          <Route path="/privacy-policy" element={<InfoPage />} />
          <Route path="/terms-of-service" element={<InfoPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </>
  );
}



function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('splashShown');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <FavoritesProvider>
      <CartProvider>
      <HelmetProvider>
      <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
      </AuthProvider>
      </HelmetProvider>
    </CartProvider>
    </FavoritesProvider>
    </>
  );
}

export default App;
