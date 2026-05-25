import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
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
import CheckoutPage from './pages/CheckoutPage';
import InfoPage from './pages/InfoPage';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
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
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/info/:slug" element={<InfoPage />} />
          {/* Direct routes for common info pages */}
          <Route path="/contact-us" element={<InfoPage />} />
          <Route path="/about" element={<InfoPage />} />
          <Route path="/faqs" element={<InfoPage />} />
          <Route path="/shipping-returns" element={<InfoPage />} />
          <Route path="/sizing-guide" element={<InfoPage />} />
          <Route path="/order-tracking" element={<InfoPage />} />
          <Route path="/sustainability" element={<InfoPage />} />
          <Route path="/privacy-policy" element={<InfoPage />} />
          <Route path="/terms-of-service" element={<InfoPage />} />
        </Routes>
      </PageTransition>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
