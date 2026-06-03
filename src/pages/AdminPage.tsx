import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { allProducts, formatPrice, type Product } from '../data/products';
import AdminAuthPage from './AdminAuthPage';
import {
  IoGridOutline, IoBagHandleOutline, IoCartOutline, IoPeopleOutline,
  IoCubeOutline, IoClose, IoSearchOutline, IoChevronDown,
  IoPricetagOutline, IoBarChartOutline, IoSettingsOutline, IoAddOutline,
  IoTrashOutline, IoCheckmarkCircle, IoLogOutOutline, IoShieldCheckmarkOutline,
  IoArrowBackOutline, IoCalendarOutline, IoLocationOutline,
  IoPhonePortraitOutline, IoMailOutline, IoStorefrontOutline,
} from 'react-icons/io5';

type Section = 'dashboard' | 'products' | 'orders' | 'users' | 'categories' | 'analytics' | 'settings' | 'admin-users';

interface OrderItem {
  productId: number;
  quantity: number;
  size: string;
  color: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  address: string;
  payment: string;
}

interface AdminUserEntry {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin';
  created: string;
  lastLogin?: string;
}

interface StoreUser {
  id: number;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  status: 'active' | 'inactive';
  lastOrder?: string;
  phone?: string;
  address?: string;
}

const statusStyles: Record<Order['status'], string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border border-blue-200',
  shipped: 'bg-purple-50 text-purple-700 border border-purple-200',
  delivered: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
};

const statusDots: Record<Order['status'], string> = {
  pending: 'bg-amber-500',
  processing: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const getProductPrice = (productId: number): number => {
  const product = allProducts.find(p => p.id === productId);
  return product?.price ?? 0;
};

const computeOrderTotal = (items: OrderItem[]): number =>
  items.reduce((sum, item) => sum + getProductPrice(item.productId) * item.quantity, 0);

const orderTemplates: Omit<Order, 'total'>[] = [
  { id: 'ORD-001', customer: 'Emma Richardson', email: 'emma.r@example.com', items: [{ productId: 1, quantity: 1, size: 'M', color: 'Camel' }, { productId: 9, quantity: 1, size: 'One Size', color: 'Black' }], status: 'delivered', date: '2026-05-28', address: '124 Park Avenue, New York, NY 10001', payment: 'Visa •••• 4242' },
  { id: 'ORD-002', customer: 'James Mitchell', email: 'james.m@example.com', items: [{ productId: 5, quantity: 1, size: 'L', color: 'Navy' }], status: 'shipped', date: '2026-05-25', address: '56 Oak Lane, Los Angeles, CA 90001', payment: 'Mastercard •••• 5555' },
  { id: 'ORD-003', customer: 'Sophia Chen', email: 'sophia.c@example.com', items: [{ productId: 3, quantity: 1, size: 'S', color: 'Black' }, { productId: 10, quantity: 2, size: 'One Size', color: 'Ivory' }], status: 'processing', date: '2026-05-24', address: '88 Maple Drive, Chicago, IL 60601', payment: 'Amex •••• 1234' },
  { id: 'ORD-004', customer: 'Oliver Thompson', email: 'oliver.t@example.com', items: [{ productId: 13, quantity: 1, size: 'One Size', color: 'Gold' }], status: 'pending', date: '2026-05-23', address: '23 Cedar Street, Miami, FL 33101', payment: 'PayPal' },
  { id: 'ORD-005', customer: 'Isabella Garcia', email: 'isabella.g@example.com', items: [{ productId: 2, quantity: 1, size: 'XS', color: 'Ivory' }, { productId: 11, quantity: 1, size: 'One Size', color: 'Gold' }, { productId: 17, quantity: 1, size: 'M', color: 'Camel' }], status: 'delivered', date: '2026-05-21', address: '77 Ocean View, San Francisco, CA 94101', payment: 'Visa •••• 9876' },
  { id: 'ORD-006', customer: 'Lucas Brown', email: 'lucas.b@example.com', items: [{ productId: 7, quantity: 2, size: 'M', color: 'White' }], status: 'shipped', date: '2026-05-20', address: '12 River Road, Austin, TX 73301', payment: 'Mastercard •••• 3333' },
  { id: 'ORD-007', customer: 'Mia Williams', email: 'mia.w@example.com', items: [{ productId: 14, quantity: 1, size: 'One Size', color: 'Black' }], status: 'cancelled', date: '2026-05-19', address: '45 Hill Street, Denver, CO 80201', payment: 'Apple Pay' },
  { id: 'ORD-008', customer: 'Ethan Davis', email: 'ethan.d@example.com', items: [{ productId: 4, quantity: 1, size: 'M', color: 'Black' }, { productId: 18, quantity: 1, size: 'L', color: 'Camel' }], status: 'processing', date: '2026-05-18', address: '9 Lake Road, Seattle, WA 98101', payment: 'Visa •••• 1111' },
  { id: 'ORD-009', customer: 'Charlotte Wilson', email: 'charlotte.w@example.com', items: [{ productId: 19, quantity: 1, size: 'S', color: 'Navy' }], status: 'pending', date: '2026-05-17', address: '33 Forest Avenue, Portland, OR 97201', payment: 'Amex •••• 7777' },
  { id: 'ORD-010', customer: 'Alexander Lee', email: 'alex.l@example.com', items: [{ productId: 20, quantity: 1, size: '38', color: 'Black' }], status: 'delivered', date: '2026-05-15', address: '61 Sunset Blvd, Boston, MA 02101', payment: 'Mastercard •••• 2222' },
];

const generateOrders = (): Order[] =>
  orderTemplates.map(o => ({ ...o, total: computeOrderTotal(o.items) }));

const customers = [
  { name: 'Emma Richardson', email: 'emma.r@example.com', joined: '2025-09-12', phone: '+1 (212) 555-0142', address: '124 Park Avenue, New York, NY 10001' },
  { name: 'James Mitchell', email: 'james.m@example.com', joined: '2025-11-03', phone: '+1 (310) 555-0187', address: '56 Oak Lane, Los Angeles, CA 90001' },
  { name: 'Sophia Chen', email: 'sophia.c@example.com', joined: '2025-07-22', phone: '+1 (773) 555-0234', address: '88 Maple Drive, Chicago, IL 60601' },
  { name: 'Oliver Thompson', email: 'oliver.t@example.com', joined: '2026-01-15', phone: '+1 (305) 555-0112', address: '23 Cedar Street, Miami, FL 33101' },
  { name: 'Isabella Garcia', email: 'isabella.g@example.com', joined: '2025-05-08', phone: '+1 (415) 555-0098', address: '77 Ocean View, San Francisco, CA 94101' },
  { name: 'Lucas Brown', email: 'lucas.b@example.com', joined: '2026-03-01', phone: '+1 (512) 555-0045', address: '12 River Road, Austin, TX 73301' },
  { name: 'Mia Williams', email: 'mia.w@example.com', joined: '2025-10-19', phone: '+1 (303) 555-0076', address: '45 Hill Street, Denver, CO 80201' },
  { name: 'Ethan Davis', email: 'ethan.d@example.com', joined: '2025-08-27', phone: '+1 (206) 555-0033', address: '9 Lake Road, Seattle, WA 98101' },
  { name: 'Charlotte Wilson', email: 'charlotte.w@example.com', joined: '2026-02-14', phone: '+1 (503) 555-0088', address: '33 Forest Avenue, Portland, OR 97201' },
  { name: 'Alexander Lee', email: 'alex.l@example.com', joined: '2025-12-01', phone: '+1 (617) 555-0011', address: '61 Sunset Blvd, Boston, MA 02101' },
];

const generateUsers = (orders: Order[]): StoreUser[] =>
  customers.map((c, id) => {
    const userOrders = orders.filter(o => o.email === c.email);
    const totalSpent = userOrders.reduce((s, o) => s + o.total, 0);
    const lastDate = userOrders.length ? userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date : '';
    return {
      id: id + 1, ...c, orders: userOrders.length, spent: totalSpent, status: userOrders.length > 0 ? 'active' as const : 'inactive' as const, lastOrder: lastDate,
    };
  });

const computeTopProducts = (orders: Order[]): { id: number; name: string; sales: number; revenue: number; image: string }[] => {
  const counts: Record<number, { qty: number; rev: number }> = {};
  orders.forEach(o => o.items.forEach(item => {
    const prev = counts[item.productId] || { qty: 0, rev: 0 };
    counts[item.productId] = { qty: prev.qty + item.quantity, rev: prev.rev + getProductPrice(item.productId) * item.quantity };
  }));
  return Object.entries(counts)
    .map(([id, data]) => {
      const product = allProducts.find(p => p.id === Number(id));
      return { id: Number(id), name: product?.name ?? 'Unknown', sales: data.qty, revenue: data.rev, image: product?.image ?? '' };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
};

const computeMonthlyAnalytics = (orders: Order[]): { month: string; revenue: number; orders: number }[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const buckets: Record<string, { revenue: number; orders: number }> = {};
  months.forEach(m => { buckets[m] = { revenue: 0, orders: 0 }; });
  orders.forEach(o => {
    const monthIndex = new Date(o.date).getMonth();
    const month = months[monthIndex];
    if (month) { buckets[month].revenue += o.total; buckets[month].orders += 1; }
  });
  return months.map(month => ({ month, ...buckets[month] }));
};

const categoryColors: Record<string, string> = {
  women: 'bg-rose-50 text-rose-700 border-rose-200',
  men: 'bg-blue-50 text-blue-700 border-blue-200',
  accessories: 'bg-amber-50 text-amber-700 border-amber-200',
  eyewear: 'bg-purple-50 text-purple-700 border-purple-200',
  footwear: 'bg-teal-50 text-teal-700 border-teal-200',
};

const sidebarLinks: { id: Section; label: string; icon: typeof IoGridOutline }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: IoGridOutline },
  { id: 'products', label: 'Products', icon: IoCubeOutline },
  { id: 'orders', label: 'Orders', icon: IoCartOutline },
  { id: 'users', label: 'Customers', icon: IoPeopleOutline },
  { id: 'categories', label: 'Categories', icon: IoPricetagOutline },
  { id: 'analytics', label: 'Analytics', icon: IoBarChartOutline },
  { id: 'settings', label: 'Settings', icon: IoSettingsOutline },
  { id: 'admin-users', label: 'Admin Users', icon: IoShieldCheckmarkOutline },
];

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const section = (searchParams.get('section') as Section) || 'dashboard';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (session) {
      const data = JSON.parse(session);
      setAdminName(data.name || 'Admin');
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleAuth = () => {
    const session = localStorage.getItem('adminSession');
    const name = session ? JSON.parse(session).name || 'Admin' : 'Admin';
    setAdminName(name);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setAuthenticated(false);
  };

  if (checking) return null;
  if (!authenticated) return <AdminAuthPage onAuth={handleAuth} />;

  const setSection = (s: Section) => {
    setSearchParams(s === 'dashboard' ? {} : { section: s });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-dark text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-7 border-b border-white/5">
          <Link to="/" className="inline-block">
            <h1 className="font-sans text-xl tracking-[0.35em] uppercase font-medium text-gold">NASSEG</h1>
          </Link>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-[10px] font-sans tracking-widest-2xl uppercase text-white/30">Admin Panel</span>
          </div>
          {adminName && (
            <p className="text-[10px] font-sans text-white/15 mt-2 tracking-wider">
              Signed in as <span className="text-white/40">{adminName}</span>
            </p>
          )}
        </div>

        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            return (
              <button key={link.id} onClick={() => setSection(link.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-sans transition-all duration-200 ${
                  section === link.id
                    ? 'bg-gold/15 text-gold font-medium border-l-2 border-gold'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="px-5 py-5 border-t border-white/5 space-y-2">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 text-[11px] text-white/25 font-sans tracking-widest-xl uppercase hover:text-red-400/70 transition-colors px-4 py-2">
            <IoLogOutOutline className="w-3.5 h-3.5" />
            Sign Out
          </button>
          <Link to="/" className="flex items-center gap-2.5 text-[11px] text-white/25 font-sans tracking-widest-xl uppercase hover:text-gold/60 transition-colors px-4 py-2">
            <IoStorefrontOutline className="w-3.5 h-3.5" />
            View Store
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-border-light px-4 lg:px-8 py-3.5 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg border border-border-light flex items-center justify-center hover:border-dark/30 transition-colors">
            <IoGridOutline className="w-4 h-4 text-dark" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-gold" />
            <h2 className="font-serif text-lg italic font-medium text-dark capitalize">{section}</h2>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-sans tracking-widest-xl uppercase text-muted hidden sm:block">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <div className="hidden sm:block w-px h-5 bg-border-light" />
            <Link to="/" className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest-xl uppercase text-muted hover:text-dark transition-colors">
              <IoArrowBackOutline className="w-3.5 h-3.5" />
              Store
            </Link>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {section === 'dashboard' && <Dashboard />}
          {section === 'products' && <Products />}
          {section === 'orders' && <Orders />}
          {section === 'users' && <Users />}
          {section === 'categories' && <Categories />}
          {section === 'analytics' && <Analytics />}
          {section === 'settings' && <Settings />}
          {section === 'admin-users' && <AdminUsers />}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [orders] = useState(() => generateOrders());
  const topProducts = computeTopProducts(orders);
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'delivered').length;
  const avgOrderValue = Math.round(totalRevenue / orders.length);
  const totalCustomers = [...new Set(orders.map(o => o.email))].length;

  const cards = [
    { label: 'Total Products', value: allProducts.length, icon: IoCubeOutline, bg: 'bg-dark/5', iconBg: 'bg-dark', iconColor: 'text-white' },
    { label: 'Total Orders', value: orders.length, icon: IoCartOutline, bg: 'bg-gold/10', iconBg: 'bg-gold', iconColor: 'text-white' },
    { label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(1)}K`, icon: IoBagHandleOutline, bg: 'bg-dark/5', iconBg: 'bg-dark', iconColor: 'text-white', change: `+${((totalRevenue / 80000) * 100).toFixed(1)}% this month` },
    { label: 'Active Orders', value: activeOrders, icon: IoCalendarOutline, bg: 'bg-gold/10', iconBg: 'bg-gold', iconColor: 'text-white' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-border-light p-6 hover:border-dark/10 transition-colors group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-sans tracking-widest-2xl uppercase text-muted">{card.label}</p>
                  <p className="text-2xl font-serif italic text-dark mt-1.5">{card.value}</p>
                  {card.change && <span className="text-[10px] text-green-600 font-sans tracking-wider mt-1.5 inline-block">{card.change}</span>}
                </div>
                <div className={`w-10 h-10 ${card.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-serif text-lg italic text-dark mb-4">Top Products</h3>
          <div className="bg-white border border-border-light p-6 space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 border border-border-light flex items-center justify-center text-[10px] font-sans font-medium text-muted group-hover:border-dark/30 transition-colors">{i + 1}</span>
                  <img src={p.image} alt={p.name} className="w-10 h-12 object-cover bg-cream-dark flex-shrink-0" />
                  <div>
                    <p className="text-sm font-sans text-dark">{p.name}</p>
                    <p className="text-[10px] text-muted font-sans tracking-wider">{p.sales} sales</p>
                  </div>
                </div>
                <span className="font-serif italic text-dark">{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg italic text-dark mb-4">Store Overview</h3>
          <div className="bg-white border border-border-light p-6 space-y-5">
            {[
              { label: 'Conversion Rate', value: `${((orders.length / Math.max(totalCustomers, 1)) * 100).toFixed(1)}%`, change: '+0.8%' },
              { label: 'Avg. Order Value', value: formatPrice(avgOrderValue), change: '−2.1%' },
              { label: 'Active Customers', value: totalCustomers.toString() },
              { label: 'Customer Retention', value: `${Math.round((orders.filter(o => o.status !== 'cancelled').length / Math.max(orders.length, 1)) * 100)}%`, change: '+5.3%' },
            ].map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans tracking-widest-2xl uppercase text-muted">{s.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-serif italic text-dark">{s.value}</span>
                    {s.change && (
                      <span className={`text-[9px] font-sans ${s.change.startsWith('+') ? 'text-green-600' : 'text-red-400'}`}>
                        {s.change}
                      </span>
                    )}
                  </div>
                </div>
                {i < 3 && <div className="w-full h-px bg-border-light mt-5" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg italic text-dark">Recent Orders</h3>
          <button
            onClick={() => { const p = new URLSearchParams(window.location.search); p.set('section', 'orders'); window.history.pushState({}, '', '?' + p.toString()); window.dispatchEvent(new Event('popstate')); }}
            className="text-[10px] font-sans tracking-widest-xl uppercase text-gold hover:text-dark transition-colors"
          >
            View All
          </button>
        </div>
        <div className="bg-white border border-border-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Order</th>
                  <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Customer</th>
                  <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Items</th>
                  <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Total</th>
                  <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Status</th>
                  <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="border-b border-border-light last:border-b-0 hover:bg-cream/80 transition-colors">
                    <td className="px-5 py-4 text-dark font-medium">{order.id}</td>
                    <td className="px-5 py-4">
                      <p className="text-dark">{order.customer}</p>
                      <p className="text-[11px] text-muted">{order.email}</p>
                    </td>
                    <td className="px-5 py-4 text-dark">{order.items.reduce((s, i) => s + i.quantity, 0)}</td>
                    <td className="px-5 py-4">
                      <span className="font-serif italic text-dark">{formatPrice(order.total)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-sans tracking-widest-xl uppercase ${statusStyles[order.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDots[order.status]}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted text-[11px]">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Products() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = ['all', ...new Set(allProducts.map(p => p.category))];
  const filtered = allProducts.filter(p =>
    (categoryFilter === 'all' || p.category === categoryFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-xs w-full">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white border border-border-light px-10 pr-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark placeholder:text-muted/40"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
          {categories.map(c => (
            <button key={c} onClick={() => setCategoryFilter(c)}
              className={`whitespace-nowrap px-3.5 py-1.5 text-[9px] font-sans tracking-widest-xl uppercase border transition-all ${
                categoryFilter === c ? 'bg-dark text-white border-dark' : 'bg-white text-muted border-border-light hover:border-dark/30'
              }`}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-sans text-muted whitespace-nowrap">{filtered.length} products</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="bg-white border border-border-light overflow-hidden group hover:border-dark/15 transition-colors">
            <div className="aspect-[4/5] bg-cream-dark overflow-hidden relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              {product.tag && (
                <span className={`absolute top-3 left-3 px-2.5 py-1 text-[8px] font-sans tracking-widest-2xl uppercase text-white ${product.tagColor || 'bg-dark'}`}>
                  {product.tag}
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-serif text-sm italic text-dark truncate">{product.name}</h4>
                  <span className={`inline-block mt-1.5 px-2 py-0.5 text-[8px] font-sans tracking-widest-xl uppercase ${categoryColors[product.category] || 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                    {product.category}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-serif italic text-dark">{formatPrice(product.price)}</p>
                  {product.originalPrice && (
                    <p className="text-[10px] font-sans text-muted line-through">{formatPrice(product.originalPrice)}</p>
                  )}
                </div>
              </div>
              <button onClick={() => setEditingProduct(product)}
                className="mt-3 w-full py-2 text-[9px] font-sans tracking-widest-xl uppercase border border-border-light text-muted hover:border-dark hover:text-dark transition-all">
                Edit Product
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingProduct(null)} />
          <div className="relative bg-white w-full max-w-lg p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl italic text-dark">Edit Product</h3>
              <button onClick={() => setEditingProduct(null)} className="w-8 h-8 border border-border-light flex items-center justify-center hover:border-dark transition-colors">
                <IoClose className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-5 mb-6">
              <img src={editingProduct.image} alt={editingProduct.name} className="w-20 h-24 object-cover bg-cream-dark flex-shrink-0" />
              <div>
                <p className="font-serif italic text-dark text-lg">{editingProduct.name}</p>
                <p className="text-[10px] font-sans text-muted uppercase tracking-widest mt-1">ID: #{editingProduct.id}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 text-[8px] font-sans tracking-widest-xl uppercase ${categoryColors[editingProduct.category] || 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                  {editingProduct.category}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Price ($)</label>
                  <input type="number" defaultValue={editingProduct.price}
                    className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark" />
                </div>
                <div>
                  <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Original Price</label>
                  <input type="number" defaultValue={editingProduct.originalPrice || ''}
                    className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Category</label>
                <select defaultValue={editingProduct.category}
                  className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark">
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="accessories">Accessories</option>
                  <option value="eyewear">Eyewear</option>
                  <option value="footwear">Footwear</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
                <button onClick={() => setEditingProduct(null)}
                  className="px-6 py-2.5 text-[10px] font-sans tracking-widest-xl uppercase border border-border-light text-muted hover:border-dark hover:text-dark transition-all">
                  Cancel
                </button>
                <button onClick={() => setEditingProduct(null)}
                  className="px-6 py-2.5 text-[10px] font-sans tracking-widest-xl uppercase bg-dark text-white hover:bg-neutral-800 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Orders() {
  const [orders] = useState(() => generateOrders());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const filtered = orders.filter(o => {
    const matchesSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-xs w-full">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order or customer..."
            className="w-full bg-white border border-border-light px-10 pr-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark placeholder:text-muted/40"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`whitespace-nowrap px-3.5 py-1.5 text-[9px] font-sans tracking-widest-xl uppercase border transition-all ${
                statusFilter === s ? 'bg-dark text-white border-dark' : 'bg-white text-muted border-border-light hover:border-dark/30'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-sans text-muted whitespace-nowrap">{filtered.length} orders</span>
      </div>

      <div className="bg-white border border-border-light">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Order</th>
                <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Customer</th>
                <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Items</th>
                <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Total</th>
                <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Status</th>
                <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Date</th>
                <th className="w-10 px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-b border-border-light last:border-b-0 hover:bg-cream/80 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="px-5 py-4 text-dark font-medium">{order.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-dark">{order.customer}</p>
                    <p className="text-[11px] text-muted">{order.email}</p>
                  </td>
                  <td className="px-5 py-4 text-dark">{order.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="px-5 py-4">
                    <span className="font-serif italic text-dark">{formatPrice(order.total)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-sans tracking-widest-xl uppercase ${statusStyles[order.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDots[order.status]}`} />
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted text-[11px]">{order.date}</td>
                  <td className="px-5 py-4">
                    <IoChevronDown className="w-3.5 h-3.5 text-muted" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-xl italic text-dark">{selectedOrder.id}</h3>
                <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 text-[9px] font-sans tracking-widest-xl uppercase ${statusStyles[selectedOrder.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDots[selectedOrder.status]}`} />
                  {selectedOrder.status}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 border border-border-light flex items-center justify-center hover:border-dark transition-colors flex-shrink-0">
                <IoClose className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {selectedOrder.items.map((item, i) => {
                const product = allProducts.find(p => p.id === item.productId);
                if (!product) return null;
                return (
                  <div key={i} className="flex gap-4 p-4 bg-cream/50 border border-border-light">
                    <img src={product.image} alt={product.name} className="w-16 h-20 object-cover bg-cream-dark flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm text-dark font-medium">{product.name}</p>
                      <p className="text-[10px] font-sans text-muted uppercase tracking-widest mt-1">{item.size} · {item.color} · Qty: {item.quantity}</p>
                      <p className="font-serif italic text-dark mt-1">{formatPrice(product.price * item.quantity)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-cream border border-border-light">
              <div className="flex items-start gap-3">
                <IoLocationOutline className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[9px] font-sans tracking-widest-2xl uppercase text-muted mb-1">Shipping</p>
                  <p className="text-sm font-sans text-dark">{selectedOrder.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IoBagHandleOutline className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[9px] font-sans tracking-widest-2xl uppercase text-muted mb-1">Payment</p>
                  <p className="text-sm font-sans text-dark">{selectedOrder.payment}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IoPeopleOutline className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[9px] font-sans tracking-widest-2xl uppercase text-muted mb-1">Customer</p>
                  <p className="text-sm font-sans text-dark">{selectedOrder.customer}</p>
                  <p className="text-[11px] text-muted">{selectedOrder.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IoCartOutline className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[9px] font-sans tracking-widest-2xl uppercase text-muted mb-1">Total</p>
                  <p className="text-lg font-serif italic text-dark">{formatPrice(selectedOrder.total)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border-light pt-6">
              <p className="text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Update Status</p>
              <div className="flex gap-2">
                {(['pending', 'processing', 'shipped', 'delivered'] as const).map(status => (
                  <button key={status} onClick={() => setSelectedOrder(null)}
                    className={`text-[9px] font-sans tracking-widest-xl uppercase px-3 py-1.5 border transition-all ${
                      selectedOrder.status === status
                        ? 'bg-dark text-white border-dark'
                        : 'border-border-light text-muted hover:border-dark hover:text-dark'
                    }`}>
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Users() {
  const [orders] = useState(() => generateOrders());
  const [users] = useState(() => generateUsers(orders));
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<StoreUser | null>(null);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full bg-white border border-border-light px-10 pr-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark placeholder:text-muted/40"
          />
        </div>
        <span className="text-[11px] font-sans text-muted">{filtered.length} customers</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(user => (
          <div key={user.id} className="bg-white border border-border-light p-5 hover:border-dark/15 transition-colors cursor-pointer" onClick={() => setSelectedUser(user)}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-dark flex items-center justify-center flex-shrink-0">
                <span className="font-serif italic text-white text-sm">{user.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-sans text-sm text-dark font-medium truncate">{user.name}</h4>
                <p className="text-[10px] text-muted truncate">{user.email}</p>
              </div>
              <span className={`inline-block w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border-light">
              <div className="text-center flex-1">
                <p className="font-serif italic text-dark">{user.orders}</p>
                <p className="text-[8px] font-sans tracking-widest-xl uppercase text-muted mt-0.5">Orders</p>
              </div>
              <div className="text-center flex-1">
                <p className="font-serif italic text-dark">{formatPrice(user.spent)}</p>
                <p className="text-[8px] font-sans tracking-widest-xl uppercase text-muted mt-0.5">Spent</p>
              </div>
              <div className="text-center flex-1">
                <p className="font-serif italic text-dark truncate">{user.lastOrder?.slice(5) || '—'}</p>
                <p className="text-[8px] font-sans tracking-widest-xl uppercase text-muted mt-0.5">Last Order</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-white w-full max-w-lg p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-dark flex items-center justify-center">
                  <span className="font-serif italic text-white text-2xl">{selectedUser.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl italic text-dark">{selectedUser.name}</h3>
                  <p className="text-[11px] text-muted">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="w-8 h-8 border border-border-light flex items-center justify-center hover:border-dark transition-colors flex-shrink-0">
                <IoClose className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 p-5 bg-cream border border-border-light mb-6">
              <div className="text-center">
                <p className="text-xl font-serif italic text-dark">{selectedUser.orders}</p>
                <p className="text-[8px] font-sans tracking-widest-xl uppercase text-muted">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-serif italic text-dark">{formatPrice(selectedUser.spent)}</p>
                <p className="text-[8px] font-sans tracking-widest-xl uppercase text-muted">Spent</p>
              </div>
              <div className="text-center">
                <span className={`inline-block px-3 py-1 text-[9px] font-sans tracking-widest-xl uppercase ${
                  selectedUser.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}>
                  {selectedUser.status}
                </span>
                <p className="text-[8px] font-sans tracking-widest-xl uppercase text-muted mt-2">Status</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-sans text-dark">
                <IoMailOutline className="w-4 h-4 text-gold" />
                {selectedUser.email}
              </div>
              {selectedUser.phone && (
                <div className="flex items-center gap-3 text-sm font-sans text-dark">
                  <IoPhonePortraitOutline className="w-4 h-4 text-gold" />
                  {selectedUser.phone}
                </div>
              )}
              {selectedUser.address && (
                <div className="flex items-center gap-3 text-sm font-sans text-dark">
                  <IoLocationOutline className="w-4 h-4 text-gold" />
                  {selectedUser.address}
                </div>
              )}
              <div className="flex items-center gap-3 text-sm font-sans text-dark">
                <IoCalendarOutline className="w-4 h-4 text-gold" />
                Joined {selectedUser.joined}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Categories() {
  type Cat = { id: number; name: string; slug: string; products: number; created: string };
  const [categoryList, setCategoryList] = useState<Cat[]>(() => {
    const cats = ['women', 'men', 'accessories', 'eyewear', 'footwear'];
    return cats.map((slug, i) => ({
      id: i + 1,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      products: allProducts.filter(p => p.category === slug).length,
      created: '2025-01-15',
    }));
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', slug: '' });
  const [search, setSearch] = useState('');

  const filtered = categoryList.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const addCategory = () => {
    if (!newCat.name || !newCat.slug) return;
    setCategoryList(prev => [...prev, { id: Date.now(), name: newCat.name, slug: newCat.slug, products: 0, created: new Date().toISOString().split('T')[0] }]);
    setNewCat({ name: '', slug: '' });
    setShowAdd(false);
  };

  const deleteCategory = (id: number) => setCategoryList(prev => prev.filter(c => c.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-white border border-border-light px-10 pr-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark placeholder:text-muted/40"
          />
        </div>
        <span className="text-[11px] font-sans text-muted">{filtered.length} categories</span>
        <button onClick={() => setShowAdd(true)}
          className="ml-auto flex items-center gap-2 text-[10px] font-sans tracking-widest-xl uppercase px-4 py-2.5 bg-dark text-white hover:bg-neutral-800 transition-all">
          <IoAddOutline className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cat => (
          <div key={cat.id} className="bg-white border border-border-light p-6 hover:border-dark/10 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-serif text-lg italic text-dark capitalize">{cat.name}</h4>
                <p className="text-[10px] font-sans text-muted mt-0.5 tracking-wider">/{cat.slug}</p>
              </div>
              <button onClick={() => deleteCategory(cat.id)}
                className="w-7 h-7 border border-border-light flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-colors flex-shrink-0">
                <IoTrashOutline className="w-3.5 h-3.5 text-muted hover:text-red-500" />
              </button>
            </div>
            <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border-light">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-[10px] font-sans text-muted tracking-wider">{cat.products} products</span>
              </div>
              <span className="text-[10px] font-sans text-muted">{cat.created}</span>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl italic text-dark">Add Category</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 border border-border-light flex items-center justify-center hover:border-dark transition-colors flex-shrink-0">
                <IoClose className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Name</label>
                <input type="text" value={newCat.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Swimwear"
                  className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark placeholder:text-muted/40" />
              </div>
              <div>
                <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Slug</label>
                <input type="text" value={newCat.slug} onChange={e => setNewCat(p => ({ ...p, slug: e.target.value }))}
                  placeholder="e.g. swimwear"
                  className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark placeholder:text-muted/40" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
                <button onClick={() => setShowAdd(false)}
                  className="px-5 py-2.5 text-[10px] font-sans tracking-widest-xl uppercase border border-border-light text-muted hover:border-dark hover:text-dark transition-all">
                  Cancel
                </button>
                <button onClick={addCategory}
                  className="px-5 py-2.5 text-[10px] font-sans tracking-widest-xl uppercase bg-dark text-white hover:bg-neutral-800 transition-all">
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Analytics() {
  const [orders] = useState(() => generateOrders());
  const analytics = computeMonthlyAnalytics(orders);
  const totalRevenue = analytics.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = analytics.reduce((s, m) => s + m.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / Math.max(totalOrders, 1));
  const maxRevenue = Math.max(...analytics.map(m => m.revenue));
  const maxOrders = Math.max(...analytics.map(m => m.orders));
  const topProducts = computeTopProducts(orders);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border-light p-6">
          <p className="text-[10px] font-sans tracking-widest-2xl uppercase text-muted">Revenue (YTD)</p>
          <p className="text-2xl font-serif italic text-dark mt-1.5">{formatPrice(totalRevenue)}</p>
          <span className="text-[10px] text-green-600 font-sans tracking-wider mt-1.5 inline-block">+12.5% vs last year</span>
        </div>
        <div className="bg-white border border-border-light p-6">
          <p className="text-[10px] font-sans tracking-widest-2xl uppercase text-muted">Total Orders (YTD)</p>
          <p className="text-2xl font-serif italic text-dark mt-1.5">{totalOrders}</p>
          <span className="text-[10px] text-green-600 font-sans tracking-wider mt-1.5 inline-block">+8.3% vs last year</span>
        </div>
        <div className="bg-white border border-border-light p-6">
          <p className="text-[10px] font-sans tracking-widest-2xl uppercase text-muted">Avg. Order Value</p>
          <p className="text-2xl font-serif italic text-dark mt-1.5">{formatPrice(avgOrderValue)}</p>
          <span className="text-[10px] text-muted font-sans tracking-wider mt-1.5 inline-block">Stable vs last year</span>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-lg italic text-dark mb-4">Monthly Revenue</h3>
        <div className="bg-white border border-border-light p-6">
          <div className="flex items-end justify-between gap-1.5 h-48">
            {analytics.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                <div
                  className="w-full bg-gradient-to-t from-gold/30 to-gold/10 relative cursor-pointer hover:from-gold/50 hover:to-gold/30 transition-all"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-dark text-white text-[10px] px-2 py-1 font-sans pointer-events-none">
                    ${m.revenue.toLocaleString()}
                  </div>
                </div>
                <span className="text-[9px] font-sans text-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-serif text-lg italic text-dark mb-4">Top Products</h3>
          <div className="bg-white border border-border-light p-6 space-y-4">
            {topProductsData.map((p, i) => {
              const product = allProducts.find(pr => pr.name === p.name);
              return (
                <div key={p.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <span className="w-7 h-7 border border-border-light flex items-center justify-center text-[10px] font-sans font-medium text-muted group-hover:border-dark/30 transition-colors">{i + 1}</span>
                    {product && (
                      <img src={product.image} alt={p.name} className="w-10 h-12 object-cover bg-cream-dark flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-sans text-dark">{p.name}</p>
                      <p className="text-[10px] text-muted font-sans tracking-wider">{p.sales} sales</p>
                    </div>
                  </div>
                  <span className="font-serif italic text-dark">{formatPrice(p.revenue)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg italic text-dark mb-4">Monthly Orders</h3>
          <div className="bg-white border border-border-light p-6">
            <div className="flex items-end justify-between gap-1.5 h-40">
              {analytics.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                  <div
                    className="w-full bg-gradient-to-t from-dark/30 to-dark/10 relative cursor-pointer hover:from-dark/50 hover:to-dark/20 transition-all"
                    style={{ height: `${(m.orders / maxOrders) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-dark text-white text-[10px] px-2 py-1 font-sans pointer-events-none">
                      {m.orders} orders
                    </div>
                  </div>
                  <span className="text-[9px] font-sans text-muted">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Settings() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white border border-border-light p-6 sm:p-8">
        <h3 className="font-serif text-lg italic text-dark mb-6">Store Information</h3>
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Store Name</label>
              <input type="text" defaultValue="NASSEG"
                className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark" />
            </div>
            <div>
              <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Email</label>
              <input type="email" defaultValue="hello@nasseg.com"
                className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Tagline</label>
            <input type="text" defaultValue="Timeless fashion, crafted for the discerning"
              className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-border-light p-6 sm:p-8">
        <h3 className="font-serif text-lg italic text-dark mb-6">Shipping Settings</h3>
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Free Shipping Threshold</label>
              <input type="text" defaultValue="$200"
                className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark" />
            </div>
            <div>
              <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Standard Shipping ($)</label>
              <input type="text" defaultValue="$15.00"
                className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Processing Time</label>
            <input type="text" defaultValue="1–2 business days"
              className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-border-light p-6 sm:p-8">
        <h3 className="font-serif text-lg italic text-dark mb-6">Notifications</h3>
        <div className="space-y-4">
          {['New Order Alert', 'Low Stock Warning', 'Customer Signup', 'Order Cancellation'].map((item, i) => (
            <div key={item} className="flex items-center justify-between py-2">
              <span className="text-sm font-sans text-dark">{item}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                <div className="w-9 h-5 bg-border-light peer-checked:bg-gold rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSave}
          className="flex items-center gap-2 text-[10px] font-sans tracking-widest-xl uppercase px-6 py-3 bg-dark text-white hover:bg-neutral-800 transition-all">
          {saved ? <><IoCheckmarkCircle className="w-4 h-4 text-green-stock" /> Saved</> : 'Save Changes'}
        </button>
        <button className="text-[10px] font-sans tracking-widest-xl uppercase px-6 py-3 border border-border-light text-muted hover:border-dark hover:text-dark transition-all">
          Reset
        </button>
      </div>
    </div>
  );
}

const defaultAdminUsers: AdminUserEntry[] = [
  { id: 1, name: 'Admin', email: 'admin@nasseg.com', password: 'admin123', role: 'super_admin', created: '2025-01-01', lastLogin: '2026-05-28' },
];

function loadAdminUsers(): AdminUserEntry[] {
  try {
    const stored = localStorage.getItem('adminUsers');
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultAdminUsers;
}

function saveAdminUsers(users: AdminUserEntry[]) {
  localStorage.setItem('adminUsers', JSON.stringify(users));
}

function AdminUsers() {
  const [users, setUsers] = useState<AdminUserEntry[]>(() => loadAdminUsers());
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'admin' as AdminUserEntry['role'] });
  const [sessionEmail] = useState(() => {
    try {
      const session = localStorage.getItem('adminSession');
      return session ? JSON.parse(session).email : '';
    } catch { return ''; }
  });

  const save = (updated: AdminUserEntry[]) => { setUsers(updated); saveAdminUsers(updated); };

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) return;
    if (users.some(u => u.email === newUser.email)) return;
    const updated = [...users, { ...newUser, id: Date.now(), created: new Date().toISOString().split('T')[0] }];
    save(updated);
    setNewUser({ name: '', email: '', password: '', role: 'admin' });
    setShowAdd(false);
  };

  const deleteUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    if (user.email === sessionEmail) return;
    if (user.role === 'super_admin' && users.filter(u => u.role === 'super_admin').length <= 1) return;
    save(users.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-sans text-muted">{users.length} admin users</span>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 text-[10px] font-sans tracking-widest-xl uppercase px-4 py-2.5 bg-dark text-white hover:bg-neutral-800 transition-all">
          <IoAddOutline className="w-3.5 h-3.5" />
          Add Admin User
        </button>
      </div>

      <div className="bg-white border border-border-light">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Name</th>
                <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Email</th>
                <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Role</th>
                <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Last Login</th>
                <th className="text-left px-5 py-3.5 text-[9px] font-sans tracking-widest-2xl uppercase text-muted">Created</th>
                <th className="w-20 px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-border-light last:border-b-0 hover:bg-cream/80 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-dark flex items-center justify-center flex-shrink-0">
                        <span className="font-serif italic text-white text-xs">{user.name.charAt(0)}</span>
                      </div>
                      <p className="text-dark font-medium">{user.name}</p>
                      {user.email === sessionEmail && (
                        <span className="text-[8px] font-sans tracking-widest-xl uppercase text-gold bg-gold/10 px-1.5 py-0.5">You</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block text-[9px] font-sans tracking-widest-xl uppercase px-2 py-0.5 border ${
                      user.role === 'super_admin' ? 'text-gold border-gold/30 bg-gold/5' : 'text-muted border-border-light bg-cream-dark'
                    }`}>
                      {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted text-[11px]">{user.lastLogin || '—'}</td>
                  <td className="px-5 py-4 text-muted text-[11px]">{user.created}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => deleteUser(user.id)}
                      disabled={user.email === sessionEmail}
                      className={`text-[10px] font-sans tracking-widest-xl uppercase flex items-center gap-1 transition-colors ${
                        user.email === sessionEmail ? 'text-muted/20 cursor-not-allowed' : 'text-muted hover:text-red-500'
                      }`}>
                      <IoTrashOutline className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl italic text-dark">Add Admin User</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 border border-border-light flex items-center justify-center hover:border-dark transition-colors flex-shrink-0">
                <IoClose className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Full Name</label>
                <input type="text" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark placeholder:text-muted/40" />
              </div>
              <div>
                <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Email</label>
                <input type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
                  placeholder="admin@nasseg.com"
                  className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark placeholder:text-muted/40" />
              </div>
              <div>
                <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Password</label>
                <input type="password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark placeholder:text-muted/40" />
              </div>
              <div>
                <label className="block text-[10px] font-sans tracking-widest-2xl uppercase text-muted mb-1.5">Role</label>
                <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value as AdminUserEntry['role'] }))}
                  className="w-full bg-white border border-border-light px-4 py-2.5 text-sm font-sans outline-none transition-all focus:border-dark">
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
                <button onClick={() => setShowAdd(false)}
                  className="px-5 py-2.5 text-[10px] font-sans tracking-widest-xl uppercase border border-border-light text-muted hover:border-dark hover:text-dark transition-all">
                  Cancel
                </button>
                <button onClick={addUser}
                  className="px-5 py-2.5 text-[10px] font-sans tracking-widest-xl uppercase bg-dark text-white hover:bg-neutral-800 transition-all">
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
