import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useUser, useAuth, useClerk } from '@clerk/react';
import { fetchMyOrders, fetchProducts } from '../services/api';
import type { OrderWithItems, BackendProduct } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { formatPrice } from '../data/products';
import { FiPackage, FiDollarSign, FiCalendar, FiUser, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { IoArrowBackOutline, IoHeartOutline, IoTrashOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const formatPriceOrder = (v: number) => `$${v.toFixed(2)}`;

const statusColors: Record<string, string> = {
  delivered: 'bg-green-100 text-green-800 border border-green-200',
  shipped: 'bg-blue-100 text-blue-800 border border-blue-200',
  processing: 'bg-amber-100 text-amber-800 border border-amber-200',
  pending: 'bg-gray-100 text-gray-600 border border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border border-red-200',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
};

const UserDashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavorites();
  const [activeSection, setActiveSection] = useState<'overview' | 'orders' | 'profile' | 'favorites'>('overview');
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [favProducts, setFavProducts] = useState<BackendProduct[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    getToken().then(token => {
      if (cancelled) return;
      if (!token) {
        setError('Authentication token unavailable');
        setLoading(false);
        return;
      }
      fetchMyOrders(token)
        .then(setOrders)
        .catch((e) => setError(e.message))
        .finally(() => { if (!cancelled) setLoading(false); });
    });
    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn, user, getToken]);

  useEffect(() => {
    if (favorites.length === 0) {
      setFavProducts([]);
      return;
    }
    let cancelled = false;
    setFavLoading(true);
    fetchProducts()
      .then(allProducts => {
        if (!cancelled) {
          setFavProducts(allProducts.filter(p => favorites.includes(p.id)));
        }
      })
      .catch(() => { /* silent */ })
      .finally(() => { if (!cancelled) setFavLoading(false); });
    return () => { cancelled = true; };
  }, [favorites]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate('/');
    } catch {
      setSigningOut(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="font-serif text-4xl text-cream italic mb-4">Sign In Required</h1>
          <p className="text-sm font-sans text-white/50 mb-8">Please sign in to access your personal boutique.</p>
          <Link to="/auth" className="inline-block bg-gold text-dark px-8 py-4 text-[11px] font-sans tracking-widest-2xl uppercase hover:bg-cream transition-all">Sign In</Link>
        </motion.div>
      </div>
    );
  }

  const userName = user?.fullName || user?.emailAddresses?.[0]?.emailAddress || 'Guest';
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const userAvatar = user?.imageUrl || '';
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  const totalSpent = orders.reduce((s, o) => s + o.total_amount, 0);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'My Orders' },
    { id: 'profile', label: 'My Profile' },
    { id: 'favorites', label: 'Favorites' }
  ] as const;

  return (
    <div className="min-h-screen bg-dark text-cream selection:bg-gold selection:text-dark flex flex-col">
      <Helmet>
        <title>My Account — NASSEG</title>
        <meta name="description" content="Manage your personal NASSEG boutique account." />
      </Helmet>

      {/* Top Section (Dark) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-4 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-12 border-b border-white/10 pb-6"
        >
          <Link to="/" className="flex items-center gap-2 text-[10px] font-sans tracking-widest-2xl uppercase text-white/50 hover:text-gold transition-all group">
            <IoArrowBackOutline className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Boutique
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img src="/favicon-transparent.png?v=2" alt="NASSEG Logo" className="w-8 h-8 object-contain brightness-0 invert" />
              <span className="font-sans text-lg tracking-[0.3em] uppercase font-medium text-white">NASSEG</span>
            </Link>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-2 px-4 py-2 text-[10px] font-sans tracking-widest-xl uppercase text-white/50 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              <FiLogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{signingOut ? 'Signing Out...' : 'Sign Out'}</span>
            </button>
          </div>
        </motion.div>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 flex items-center gap-6"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 p-1 border border-white/10">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                <FiUser className="w-8 h-8 text-gold" />
              </div>
            )}
          </div>
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-white italic mb-2">Welcome, {userName.split(' ')[0]}</h1>
            <p className="text-sm font-sans text-white/50">Your personal space in the NASSEG boutique.</p>
          </div>
        </motion.div>

        {/* Quick Stats - Staggered */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
        >
          {[
            { label: 'Total Orders', value: orders.length, icon: FiPackage },
            { label: 'Total Spent', value: formatPriceOrder(totalSpent), icon: FiDollarSign },
            { label: 'Member Since', value: memberSince.split(',')[0], icon: FiCalendar },
            { label: 'Favorites', value: favorites.length, icon: IoHeartOutline }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="w-16 h-16 text-gold" />
              </div>
              <stat.icon className="w-5 h-5 text-gold mb-4 relative z-10" />
              <p className="text-2xl font-serif italic text-white relative z-10">{stat.value}</p>
              <p className="text-[10px] font-sans tracking-widest-xl uppercase text-white/50 mt-2 relative z-10">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Section (Beige) */}
      <div className="flex-1 bg-[#f9f8f5] text-dark rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 mb-10 pb-4 border-b border-border-light">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`relative px-6 py-3 text-[11px] font-sans tracking-widest-xl uppercase transition-colors whitespace-nowrap ${activeSection === tab.id ? 'text-dark font-medium' : 'text-muted hover:text-dark'}`}
              >
                {activeSection === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-dark/5 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="min-h-[400px]">
            {loading && (
              <div className="flex justify-center py-20">
                <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {error && (
              <div className="text-center py-20">
                <p className="text-sm font-sans text-red-500 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-3 border border-dark text-dark text-[10px] tracking-widest uppercase hover:bg-dark hover:text-white transition-colors">Retry</button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!loading && !error && (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* ── OVERVIEW ── */}
                  {activeSection === 'overview' && (
                    <div>
                      <h2 className="font-serif text-2xl text-dark italic mb-6">Recent Activity</h2>
                      {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-border-light rounded-xl">
                          <p className="font-sans text-sm text-muted mb-6">Your collection is currently empty.</p>
                          <Link to="/collections" className="inline-block bg-dark text-white px-8 py-4 text-[11px] font-sans tracking-widest-2xl uppercase hover:bg-neutral-800 transition-all">Explore Collections</Link>
                        </div>
                      ) : (
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                          {orders.slice(0, 3).map(order => (
                            <motion.div key={order.id} variants={itemVariants} className="bg-white border border-border-light rounded-xl p-6 hover:shadow-sm transition-shadow">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <p className="font-sans text-sm text-dark font-medium tracking-wide">Order #NSG-{String(order.id).padStart(5, '0')}</p>
                                  <p className="text-[10px] font-sans tracking-widest uppercase text-muted mt-1">{formatDate(order.created_at)}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                  <span className={`px-3 py-1 text-[9px] font-sans tracking-widest-xl uppercase rounded-full ${statusColors[order.status] || statusColors.pending}`}>{order.status}</span>
                                  <span className="font-serif italic text-dark text-lg">{formatPriceOrder(order.total_amount)}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {orders.length > 3 && (
                            <div className="text-center pt-4">
                              <button onClick={() => setActiveSection('orders')} className="text-[10px] font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors underline">View All Orders</button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* ── ORDERS ── */}
                  {activeSection === 'orders' && (
                    <div>
                      {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-border-light rounded-xl">
                          <p className="font-sans text-sm text-muted mb-6">No orders found.</p>
                          <Link to="/collections" className="inline-block bg-dark text-white px-8 py-4 text-[11px] font-sans tracking-widest-2xl uppercase hover:bg-neutral-800 transition-all">Start Shopping</Link>
                        </div>
                      ) : (
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                          {orders.map(order => (
                            <motion.div key={order.id} variants={itemVariants} className="bg-white border border-border-light rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
                              <div
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                              >
                                <div className="flex items-center gap-6">
                                  <div className="w-12 h-12 rounded bg-[#f9f8f5] flex items-center justify-center flex-shrink-0">
                                    <FiPackage className="w-5 h-5 text-gold" />
                                  </div>
                                  <div>
                                    <p className="font-sans text-sm text-dark font-medium tracking-wide">#NSG-{String(order.id).padStart(5, '0')}</p>
                                    <p className="text-[10px] font-sans tracking-widest uppercase text-muted mt-1">{formatDate(order.created_at)} · {order.items.length} items</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  <span className={`px-3 py-1 text-[9px] font-sans tracking-widest-xl uppercase rounded-full ${statusColors[order.status] || statusColors.pending}`}>{order.status}</span>
                                  <span className="font-serif italic text-dark text-lg w-20 text-right">{formatPriceOrder(order.total_amount)}</span>
                                  <FiChevronDown className={`w-4 h-4 text-muted transition-transform duration-300 ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                                </div>
                              </div>

                              <AnimatePresence>
                                {expandedOrder === order.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-border-light bg-[#fdfcfa]"
                                  >
                                    <div className="p-6 space-y-4">
                                      {order.items.map(item => (
                                        <div key={item.id} className="flex items-center gap-4">
                                          <div className="w-16 h-20 bg-[#eae7e0] rounded overflow-hidden flex-shrink-0">
                                            <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-sans text-dark truncate">{item.product_name}</p>
                                            <p className="text-[10px] font-sans tracking-widest text-muted mt-1">Qty: {item.quantity} × {formatPriceOrder(item.price_at_purchase)}</p>
                                          </div>
                                          <span className="text-sm font-serif text-dark font-medium">{formatPriceOrder(item.price_at_purchase * item.quantity)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* ── PROFILE ── */}
                  {activeSection === 'profile' && (
                    <motion.div variants={itemVariants} className="bg-white border border-border-light rounded-xl p-8 max-w-2xl shadow-sm">
                      <h2 className="font-serif text-2xl text-dark italic mb-8">Personal Information</h2>
                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-2">Full Name</p>
                          <p className="font-sans text-dark text-lg">{userName}</p>
                        </div>
                        <div className="w-full h-px bg-border-light" />
                        <div>
                          <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-2">Email Address</p>
                          <p className="font-sans text-dark text-lg">{userEmail}</p>
                        </div>
                        <div className="w-full h-px bg-border-light" />
                        <div>
                          <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-2">Account Created</p>
                          <p className="font-sans text-dark text-lg">{memberSince}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── FAVORITES ── */}
                  {activeSection === 'favorites' && (
                    <div>
                      {favorites.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-border-light rounded-xl shadow-sm">
                          <IoHeartOutline className="w-12 h-12 text-muted mx-auto mb-4" />
                          <p className="font-sans text-sm text-muted mb-6">No favorites saved yet.</p>
                          <Link to="/collections" className="inline-block bg-dark text-white px-8 py-4 text-[11px] font-sans tracking-widest-2xl uppercase hover:bg-neutral-800 transition-all">Discover Pieces</Link>
                        </div>
                      ) : favLoading ? (
                        <div className="flex justify-center py-20">
                          <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {favProducts.map(product => (
                            <motion.div key={product.id} variants={itemVariants} className="group relative bg-white border border-border-light rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                              <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] bg-[#eae7e0] overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                              </Link>
                              <button
                                onClick={(e) => { e.preventDefault(); removeFavorite(product.id); }}
                                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-red-500 shadow-sm opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-50"
                              >
                                <IoTrashOutline className="w-4.5 h-4.5" />
                              </button>
                              <div className="p-5 text-center">
                                <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">{product.category}</p>
                                <h3 className="font-serif text-base text-dark group-hover:text-gold transition-colors truncate">{product.name}</h3>
                                <p className="font-sans text-sm text-dark font-medium mt-2">{formatPrice(product.price)}</p>

                                <div className="mt-4 pt-4 border-t border-border-light">
                                  <Link
                                    to={`/product/${product.id}`}
                                    className="block w-full text-center bg-dark text-white text-[10px] font-sans tracking-widest-xl uppercase px-4 py-2.5 hover:bg-gold hover:text-dark transition-colors duration-300 rounded"
                                  >
                                    View Product
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;