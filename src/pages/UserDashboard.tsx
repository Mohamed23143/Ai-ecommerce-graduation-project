import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useUser, useAuth } from '@clerk/react';
import { fetchMyOrders } from '../services/api';
import type { OrderWithItems } from '../services/api';
import { FiPackage, FiDollarSign, FiCalendar, FiUser, FiClock, FiChevronDown } from 'react-icons/fi';
import { IoArrowBackOutline } from 'react-icons/io5';

const formatPrice = (v: number) => `$${v.toFixed(2)}`;

const statusColors: Record<string, string> = {
  delivered: 'bg-green-100 text-green-800',
  shipped: 'bg-blue-100 text-blue-800',
  processing: 'bg-amber-100 text-amber-800',
  pending: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-800',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const UserDashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [activeSection, setActiveSection] = useState<'overview' | 'orders' | 'profile'>('overview');
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f9f8f5] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#f9f8f5] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-dark italic mb-4">Sign In Required</h1>
          <p className="text-sm font-sans text-muted mb-8">Please sign in to access your account dashboard.</p>
          <Link to="/auth" className="inline-block bg-dark text-white px-8 py-4 text-[11px] font-sans tracking-widest-2xl uppercase hover:bg-neutral-800 transition-all">Sign In</Link>
        </div>
      </div>
    );
  }

  const userName = user?.fullName || user?.emailAddresses?.[0]?.emailAddress || 'Guest';
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  const totalSpent = orders.reduce((s, o) => s + o.total_amount, 0);
  const activeOrders = orders.filter((o) => o.status === 'pending' || o.status === 'shipped' || o.status === 'processing');

  return (
    <div className="min-h-screen bg-[#f9f8f5]">
      <Helmet>
        <title>My Account — NASSEG</title>
        <meta name="description" content="Manage your NASSEG account, view orders, and update preferences." />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-[10px] font-sans tracking-widest-2xl uppercase text-muted hover:text-dark transition-all group">
            <IoArrowBackOutline className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Boutique
          </Link>
          <Link to="/" className="font-sans text-lg tracking-[0.3em] uppercase font-medium text-dark">NASSEG</Link>
        </div>

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl text-dark italic mb-2">Welcome, {userName.split(' ')[0]}</h1>
          <p className="text-sm font-sans text-muted">Manage your orders and account details.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-border-light rounded-lg p-5">
            <FiPackage className="w-5 h-5 text-gold mb-3" />
            <p className="text-2xl font-serif italic text-dark">{orders.length}</p>
            <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mt-1">Total Orders</p>
          </div>
          <div className="bg-white border border-border-light rounded-lg p-5">
            <FiDollarSign className="w-5 h-5 text-gold mb-3" />
            <p className="text-2xl font-serif italic text-dark">{formatPrice(totalSpent)}</p>
            <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mt-1">Total Spent</p>
          </div>
          <div className="bg-white border border-border-light rounded-lg p-5">
            <FiCalendar className="w-5 h-5 text-gold mb-3" />
            <p className="text-2xl font-serif italic text-dark">{memberSince.split(',')[0]}</p>
            <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mt-1">Member Since</p>
          </div>
          <div className="bg-white border border-border-light rounded-lg p-5">
            <FiClock className="w-5 h-5 text-gold mb-3" />
            <p className="text-2xl font-serif italic text-dark">{activeOrders.length}</p>
            <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mt-1">Active Orders</p>
          </div>
        </div>

        {/* Sections Nav */}
        <div className="flex gap-1 mb-8 border-b border-border-light">
          {(['overview', 'orders', 'profile'] as const).map(s => (
            <button key={s} onClick={() => setActiveSection(s)}
              className={`px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase transition-all duration-300 border-b-2 -mb-[1px] ${activeSection === s ? 'border-dark text-dark' : 'border-transparent text-muted hover:text-dark'}`}>
              {s === 'overview' ? 'Overview' : s === 'orders' ? 'My Orders' : 'My Profile'}
            </button>
          ))}
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-sm font-sans text-red-500 mb-2">Failed to load orders.</p>
            <button onClick={() => window.location.reload()} className="text-[10px] font-sans tracking-widest-xl uppercase text-gold underline">Retry</button>
          </div>
        )}

        {/* Overview */}
        {!loading && !error && activeSection === 'overview' && (
          <div>
            <h2 className="font-serif text-2xl text-dark italic mb-6">
              {orders.length === 0 ? 'No Orders Yet' : 'Recent Orders'}
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-sans text-sm text-muted mb-6">You haven't placed any orders yet.</p>
                <Link to="/collections" className="inline-block bg-dark text-white px-8 py-4 text-[11px] font-sans tracking-widest-2xl uppercase hover:bg-neutral-800 transition-all">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 4).map(order => (
                  <div key={order.id}
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="bg-white border border-border-light rounded-lg p-5 cursor-pointer hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-sans text-sm text-dark font-medium">Order #NSG-{String(order.id).padStart(5, '0')}</p>
                        <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mt-1">{formatDate(order.created_at)} · {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.length > 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <p className="font-serif italic text-dark">{formatPrice(order.total_amount)}</p>
                          <span className={`inline-block mt-1 px-2.5 py-0.5 text-[9px] font-sans tracking-widest-xl uppercase rounded ${statusColors[order.status] || statusColors.pending}`}>{order.status}</span>
                        </div>
                        <FiChevronDown className={`w-4 h-4 text-muted transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    {expandedOrder === order.id && (
                      <div className="mt-4 pt-4 border-t border-border-light space-y-3">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-12 h-14 bg-[#eae7e0] rounded overflow-hidden flex-shrink-0">
                              <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-sans text-dark truncate">{item.product_name}</p>
                              <p className="text-[10px] font-sans text-muted">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-serif text-dark">{formatPrice(item.price_at_purchase * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders (full table) */}
        {!loading && !error && activeSection === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-sans text-sm text-muted mb-6">You haven't placed any orders yet.</p>
                <Link to="/collections" className="inline-block bg-dark text-white px-8 py-4 text-[11px] font-sans tracking-widest-2xl uppercase hover:bg-neutral-800 transition-all">Start Shopping</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="pb-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Order</th>
                      <th className="pb-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Date</th>
                      <th className="pb-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Items</th>
                      <th className="pb-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Total</th>
                      <th className="pb-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="border-b border-border-light/50 cursor-pointer hover:bg-white/50 transition-colors"
                      >
                        <td className="py-4"><span className="text-sm font-sans text-dark">#NSG-{String(order.id).padStart(5, '0')}</span></td>
                        <td className="py-4"><span className="text-sm font-sans text-dark">{formatDate(order.created_at)}</span></td>
                        <td className="py-4"><span className="text-sm font-sans text-dark">{order.items.reduce((s, i) => s + i.quantity, 0)}</span></td>
                        <td className="py-4"><span className="font-serif italic text-dark">{formatPrice(order.total_amount)}</span></td>
                        <td className="py-4">
                          <span className={`inline-block px-2.5 py-0.5 text-[9px] font-sans tracking-widest-xl uppercase rounded ${statusColors[order.status] || statusColors.pending}`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {expandedOrder !== null && (
              <div className="mt-4 bg-white border border-border-light rounded-lg p-5 space-y-3">
                <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-2">Items in Order #NSG-{String(expandedOrder).padStart(5, '0')}</p>
                {orders.find(o => o.id === expandedOrder)?.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-14 h-16 bg-[#eae7e0] rounded overflow-hidden flex-shrink-0">
                      <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans text-dark truncate">{item.product_name}</p>
                      <p className="text-[10px] font-sans text-muted">Qty: {item.quantity} · {formatPrice(item.price_at_purchase)} each</p>
                    </div>
                    <span className="text-sm font-serif text-dark">{formatPrice(item.price_at_purchase * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile */}
        {!loading && !error && activeSection === 'profile' && (
          <div className="bg-white border border-border-light rounded-lg p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-dark flex items-center justify-center">
                <FiUser className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-dark italic">{userName}</h3>
                <p className="text-sm font-sans text-muted">{userEmail}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Full Name</p>
                <p className="font-sans text-dark">{userName}</p>
              </div>
              <div>
                <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Email</p>
                <p className="font-sans text-dark">{userEmail}</p>
              </div>
              <div>
                <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Member Since</p>
                <p className="font-sans text-dark">{memberSince}</p>
              </div>
              <div>
                <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Total Orders</p>
                <p className="font-sans text-dark">{orders.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;