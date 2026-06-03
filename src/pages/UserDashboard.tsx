import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/react';
import { allProducts, formatPrice, type Product } from '../data/products';
import { FiPackage, FiHeart, FiUser, FiClock, FiChevronDown, FiChevronUp, FiMapPin, FiCreditCard, FiLogOut } from 'react-icons/fi';
import { IoArrowBackOutline } from 'react-icons/io5';

interface OrderItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'delivered' | 'shipped' | 'processing' | 'pending' | 'cancelled';
  address: string;
  payment: string;
}

const statusColors: Record<string, string> = {
  delivered: 'bg-green-50 text-green-700 border border-green-200',
  shipped: 'bg-blue-50 text-blue-700 border border-blue-200',
  processing: 'bg-amber-50 text-amber-700 border border-amber-200',
  pending: 'bg-gray-50 text-gray-600 border border-gray-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
};

const statusDots: Record<string, string> = {
  delivered: 'bg-green-500',
  shipped: 'bg-blue-500',
  processing: 'bg-amber-500',
  pending: 'bg-gray-400',
  cancelled: 'bg-red-500',
};

const generateOrders = (): Order[] => {

  return [
    {
      id: 'ORD-2026-001',
      date: '2026-05-28',
      items: [
        { product: allProducts[0], size: 'M', color: 'Camel', quantity: 1 },
        { product: allProducts[8], size: 'One Size', color: 'Black', quantity: 1 },
      ],
      total: 1200,
      status: 'delivered',
      address: '124 Park Avenue, New York, NY 10001',
      payment: 'Visa •••• 4242',
    },
    {
      id: 'ORD-2026-002',
      date: '2026-05-22',
      items: [
        { product: allProducts[4], size: 'L', color: 'Navy', quantity: 1 },
      ],
      total: 1200,
      status: 'shipped',
      address: '124 Park Avenue, New York, NY 10001',
      payment: 'Visa •••• 4242',
    },
    {
      id: 'ORD-2026-003',
      date: '2026-05-18',
      items: [
        { product: allProducts[2], size: 'S', color: 'Black', quantity: 1 },
        { product: allProducts[9], size: 'One Size', color: 'Ivory', quantity: 1 },
        { product: allProducts[10], size: 'One Size', color: 'Gold', quantity: 1 },
      ],
      total: 780,
      status: 'processing',
      address: '56 Oak Lane, Los Angeles, CA 90001',
      payment: 'Mastercard •••• 5555',
    },
    {
      id: 'ORD-2026-004',
      date: '2026-05-12',
      items: [
        { product: allProducts[12], size: 'One Size', color: 'Gold', quantity: 1 },
        { product: allProducts[14], size: 'One Size', color: 'Tortoise', quantity: 1 },
      ],
      total: 600,
      status: 'delivered',
      address: '124 Park Avenue, New York, NY 10001',
      payment: 'Apple Pay',
    },
    {
      id: 'ORD-2026-005',
      date: '2026-05-05',
      items: [
        { product: allProducts[16], size: 'M', color: 'Camel', quantity: 1 },
      ],
      total: 890,
      status: 'delivered',
      address: '124 Park Avenue, New York, NY 10001',
      payment: 'Visa •••• 4242',
    },
  ];
};

const UserDashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'profile'>('overview');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders] = useState<Order[]>(() => generateOrders());
  const [wishlist] = useState<Product[]>(() => [
    allProducts[1],
    allProducts[6],
    allProducts[11],
    allProducts[17],
    allProducts[19],
  ]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-dark italic mb-4">Sign In Required</h1>
          <p className="text-sm font-sans text-muted mb-8">Please sign in to access your account dashboard.</p>
          <Link to="/auth" className="inline-block bg-dark text-white px-10 py-4 text-[11px] font-sans tracking-widest-2xl uppercase hover:bg-neutral-800 transition-all">Sign In</Link>
        </div>
      </div>
    );
  }

  const userName = user?.fullName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Guest';
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const userInitial = userName.charAt(0).toUpperCase();
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'delivered').length;

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: FiPackage },
    { key: 'orders' as const, label: 'My Orders', icon: FiClock },
    { key: 'wishlist' as const, label: 'Wishlist', icon: FiHeart },
    { key: 'profile' as const, label: 'Profile', icon: FiUser },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-border-light sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-[10px] font-sans tracking-widest-2xl uppercase text-muted hover:text-dark transition-all group">
              <IoArrowBackOutline className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Boutique</span>
            </Link>
            <Link to="/" className="font-sans text-lg tracking-[0.3em] uppercase font-medium text-dark">NASSEG</Link>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-[10px] font-sans tracking-widest-xl uppercase text-muted hover:text-dark transition-all"
            >
              <FiLogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-dark flex items-center justify-center flex-shrink-0">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={userName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="font-serif text-2xl sm:text-3xl italic text-white">{userInitial}</span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1">Welcome back</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-dark italic">{userName.split(' ')[0]}</h1>
            <p className="text-sm font-sans text-muted mt-1">{userEmail}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <div className="bg-white border border-border-light p-5 sm:p-6 group hover:border-dark/20 transition-colors">
            <FiPackage className="w-4 h-4 text-gold mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-2xl sm:text-3xl font-serif italic text-dark">{orders.length}</p>
            <p className="text-[9px] sm:text-[10px] font-sans tracking-widest-xl uppercase text-muted mt-1">Total Orders</p>
          </div>
          <div className="bg-white border border-border-light p-5 sm:p-6 group hover:border-dark/20 transition-colors">
            <FiCreditCard className="w-4 h-4 text-gold mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-2xl sm:text-3xl font-serif italic text-dark">{formatPrice(totalSpent)}</p>
            <p className="text-[9px] sm:text-[10px] font-sans tracking-widest-xl uppercase text-muted mt-1">Total Spent</p>
          </div>
          <div className="bg-white border border-border-light p-5 sm:p-6 group hover:border-dark/20 transition-colors">
            <FiClock className="w-4 h-4 text-gold mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-2xl sm:text-3xl font-serif italic text-dark">{activeOrders}</p>
            <p className="text-[9px] sm:text-[10px] font-sans tracking-widest-xl uppercase text-muted mt-1">Active Orders</p>
          </div>
          <div className="bg-white border border-border-light p-5 sm:p-6 group hover:border-dark/20 transition-colors">
            <FiHeart className="w-4 h-4 text-gold mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-2xl sm:text-3xl font-serif italic text-dark">{wishlist.length}</p>
            <p className="text-[9px] sm:text-[10px] font-sans tracking-widest-xl uppercase text-muted mt-1">Wishlist Items</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-10 border-b border-border-light overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 sm:px-6 py-3.5 text-[10px] sm:text-[11px] font-sans tracking-widest-xl uppercase whitespace-nowrap transition-all duration-300 border-b-2 -mb-[1px] ${
                activeTab === t.key
                  ? 'border-dark text-dark font-medium'
                  : 'border-transparent text-muted hover:text-dark'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-dark italic">Recent Orders</h2>
                <button onClick={() => setActiveTab('orders')} className="text-[10px] font-sans tracking-widest-xl uppercase text-gold hover:text-dark transition-colors">View All</button>
              </div>
              <div className="space-y-3">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="bg-white border border-border-light p-5 sm:p-6 hover:border-dark/15 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, i) => (
                            <div key={i} className="w-12 h-14 bg-cream-dark border-2 border-white overflow-hidden flex-shrink-0">
                              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-12 h-14 bg-cream-dark border-2 border-white flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] font-sans text-muted">+{order.items.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-sans text-sm text-dark font-medium">{order.id}</p>
                          <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mt-0.5">
                            {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:gap-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-sans tracking-widest-xl uppercase rounded-full ${statusColors[order.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDots[order.status]}`} />
                          {order.status}
                        </span>
                        <p className="font-serif italic text-dark text-lg">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="font-serif text-2xl text-dark italic mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link to="/collections" className="bg-white border border-border-light p-6 flex items-center gap-4 hover:border-dark/20 transition-colors group">
                  <div className="w-10 h-10 bg-cream-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                    <FiPackage className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-sans text-dark font-medium">Continue Shopping</p>
                    <p className="text-[10px] font-sans text-muted uppercase tracking-widest">Browse our collections</p>
                  </div>
                </Link>
                <button onClick={() => setActiveTab('wishlist')} className="bg-white border border-border-light p-6 flex items-center gap-4 hover:border-dark/20 transition-colors group text-left">
                  <div className="w-10 h-10 bg-cream-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                    <FiHeart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-sans text-dark font-medium">My Wishlist</p>
                    <p className="text-[10px] font-sans text-muted uppercase tracking-widest">{wishlist.length} saved items</p>
                  </div>
                </button>
                <button onClick={() => setActiveTab('profile')} className="bg-white border border-border-light p-6 flex items-center gap-4 hover:border-dark/20 transition-colors group text-left">
                  <div className="w-10 h-10 bg-cream-dark flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-sans text-dark font-medium">Edit Profile</p>
                    <p className="text-[10px] font-sans text-muted uppercase tracking-widest">Personal details</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="font-serif text-2xl text-dark italic mb-6">Order History</h2>
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="bg-white border border-border-light overflow-hidden">
                  {/* Order Header */}
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-cream/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 2).map((item, i) => (
                          <div key={i} className="w-10 h-12 bg-cream-dark border-2 border-white overflow-hidden flex-shrink-0">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="font-sans text-sm text-dark font-medium">{order.id}</p>
                        <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mt-0.5">
                          {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-sans tracking-widest-xl uppercase rounded-full ${statusColors[order.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDots[order.status]}`} />
                        {order.status}
                      </span>
                      <p className="font-serif italic text-dark text-lg hidden sm:block">{formatPrice(order.total)}</p>
                      {expandedOrder === order.id ? (
                        <FiChevronUp className="w-4 h-4 text-muted" />
                      ) : (
                        <FiChevronDown className="w-4 h-4 text-muted" />
                      )}
                    </div>
                  </button>

                  {/* Order Details (Expanded) */}
                  {expandedOrder === order.id && (
                    <div className="border-t border-border-light">
                      {/* Items */}
                      <div className="p-5 sm:p-6 space-y-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex gap-4">
                            <Link to={`/product/${item.product.id}`} className="w-20 h-24 bg-cream-dark overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity">
                              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link to={`/product/${item.product.id}`} className="font-sans text-sm text-dark font-medium hover:text-gold transition-colors">{item.product.name}</Link>
                              <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mt-1">{item.size} · {item.color}</p>
                              <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-serif italic text-dark">{formatPrice(item.product.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Order Info */}
                      <div className="border-t border-border-light p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                          <FiMapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Delivery Address</p>
                            <p className="text-sm font-sans text-dark">{order.address}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FiCreditCard className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Payment</p>
                            <p className="text-sm font-sans text-dark">{order.payment}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FiPackage className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Order Total</p>
                            <p className="text-lg font-serif italic text-dark">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-dark italic">My Wishlist</h2>
              <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted">{wishlist.length} items saved</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {wishlist.map(product => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group bg-white border border-border-light overflow-hidden hover:border-dark/20 transition-all"
                >
                  <div className="aspect-[3/4] bg-cream-dark overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {product.tag && (
                      <span className={`absolute top-3 left-3 px-2.5 py-1 text-[8px] font-sans tracking-widest-2xl uppercase text-white ${product.tagColor || 'bg-dark'}`}>
                        {product.tag}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-serif text-sm text-dark italic truncate group-hover:text-gold transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className="font-serif italic text-dark">{formatPrice(product.price)}</p>
                      {product.originalPrice && (
                        <p className="text-[11px] font-sans text-muted line-through">{formatPrice(product.originalPrice)}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl text-dark italic mb-6">Personal Information</h2>
            <div className="bg-white border border-border-light p-6 sm:p-8">
              {/* Profile Header */}
              <div className="flex items-center gap-5 mb-8 pb-8 border-b border-border-light">
                <div className="w-20 h-20 rounded-full bg-dark flex items-center justify-center flex-shrink-0">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={userName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="font-serif text-3xl italic text-white">{userInitial}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-dark italic">{userName}</h3>
                  <p className="text-sm font-sans text-muted mt-0.5">{userEmail}</p>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-gold mt-2">Member since {memberSince}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-2">Full Name</p>
                  <p className="font-sans text-dark border-b border-border-light pb-3">{userName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-2">Email Address</p>
                  <p className="font-sans text-dark border-b border-border-light pb-3">{userEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-2">Phone Number</p>
                  <p className="font-sans text-muted border-b border-border-light pb-3 italic">Not provided</p>
                </div>
                <div>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-2">Date of Birth</p>
                  <p className="font-sans text-muted border-b border-border-light pb-3 italic">Not provided</p>
                </div>
              </div>

              {/* Default Address */}
              <div className="mt-8 pt-8 border-t border-border-light">
                <div className="flex items-center gap-3 mb-4">
                  <FiMapPin className="w-4 h-4 text-gold" />
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-dark font-medium">Default Address</p>
                </div>
                <div className="bg-cream/50 p-5 border border-border-light">
                  <p className="text-sm font-sans text-dark">{orders[0]?.address || 'No address on file'}</p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-8 border-t border-border-light">
                <div className="flex items-center gap-3 mb-4">
                  <FiCreditCard className="w-4 h-4 text-gold" />
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-dark font-medium">Payment Methods</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-cream/50 p-4 border border-border-light">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-dark rounded flex items-center justify-center">
                        <span className="text-white text-[8px] font-sans font-bold">VISA</span>
                      </div>
                      <span className="text-sm font-sans text-dark">•••• •••• •••• 4242</span>
                    </div>
                    <span className="text-[9px] font-sans tracking-widest-xl uppercase text-gold">Default</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
