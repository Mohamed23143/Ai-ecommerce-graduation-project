import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { allProducts, formatPrice } from '../data/products';
import { adminStats, recentOrders, adminUsers, categories, monthlyAnalytics, topProducts } from '../data/adminData';
import type { Order, AdminUser } from '../data/adminData';
import { IoGridOutline, IoBagHandleOutline, IoCartOutline, IoPeopleOutline, IoCubeOutline, IoClose, IoSearchOutline, IoChevronDown, IoPricetagOutline, IoBarChartOutline, IoSettingsOutline, IoAddOutline, IoTrashOutline, IoCheckmarkCircle, IoLogOutOutline } from 'react-icons/io5';
import AdminAuthPage from './AdminAuthPage';

type Section = 'dashboard' | 'products' | 'orders' | 'users' | 'categories' | 'analytics' | 'settings';

const statusStyles: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const sidebarLinks: { id: Section; label: string; icon: typeof IoGridOutline }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: IoGridOutline },
  { id: 'products', label: 'Products', icon: IoCubeOutline },
  { id: 'orders', label: 'Orders', icon: IoCartOutline },
  { id: 'users', label: 'Users', icon: IoPeopleOutline },
  { id: 'categories', label: 'Categories', icon: IoPricetagOutline },
  { id: 'analytics', label: 'Analytics', icon: IoBarChartOutline },
  { id: 'settings', label: 'Settings', icon: IoSettingsOutline },
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

      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-dark text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-serif italic text-gold">NASSEG</h1>
            <span className="text-[10px] text-white/40 font-sans tracking-widest-xl uppercase">Admin Panel</span>
            {adminName && <p className="text-[10px] text-white/20 font-sans mt-0.5">Logged in as {adminName}</p>}
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <IoClose className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            return (
              <button key={link.id} onClick={() => setSection(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans transition-all duration-200 ${
                  section === link.id ? 'bg-gold text-dark font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-white/10 space-y-2">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 text-[11px] text-white/40 font-sans tracking-widest-xl uppercase hover:text-red-400 transition-colors">
            <IoLogOutOutline className="w-3.5 h-3.5" />
            Sign Out
          </button>
          <a href="/" className="flex items-center gap-2 text-[11px] text-white/40 font-sans tracking-widest-xl uppercase hover:text-gold transition-colors">
            <IoBagHandleOutline className="w-3.5 h-3.5" />
            Back to Store
          </a>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-border-light px-4 lg:px-8 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg border border-border-light flex items-center justify-center hover:border-dark transition-colors">
            <IoGridOutline className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-serif italic font-medium text-dark capitalize">{section}</h2>
          </div>
          <a href="/" className="hidden sm:flex items-center gap-2 text-[10px] font-sans tracking-widest-xl uppercase text-muted hover:text-dark transition-colors">
            <IoBagHandleOutline className="w-3.5 h-3.5" />
            View Store
          </a>
        </header>

        <div className="p-4 lg:p-8">
          {section === 'dashboard' && <Dashboard />}
          {section === 'products' && <Products />}
          {section === 'orders' && <Orders />}
          {section === 'users' && <Users />}
          {section === 'categories' && <Categories />}
          {section === 'analytics' && <Analytics />}
          {section === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const cards = [
    { label: 'Total Products', value: adminStats.totalProducts, icon: IoCubeOutline, color: 'bg-dark' },
    { label: 'Total Orders', value: adminStats.totalOrders, icon: IoCartOutline, color: 'bg-gold' },
    { label: 'Total Revenue', value: `$${(adminStats.totalRevenue / 1000).toFixed(1)}K`, icon: IoBagHandleOutline, color: 'bg-dark', change: `+${adminStats.monthlyGrowth}%` },
    { label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), icon: IoPeopleOutline, color: 'bg-gold' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-lg border border-border-light p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-sans tracking-widest-xl uppercase text-muted">{card.label}</p>
                  <p className="text-2xl font-serif font-medium text-dark mt-1">{card.value}</p>
                  {card.change && <span className="text-[11px] text-green-stock font-sans mt-1 inline-block">{card.change} this month</span>}
                </div>
                <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-serif italic font-medium text-dark mb-4">Top Selling Products</h3>
          <div className="bg-white rounded-lg border border-border-light p-5 space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cream-dark flex items-center justify-center text-[10px] font-sans font-medium text-muted">{i + 1}</span>
                  <div>
                    <p className="text-sm font-sans text-dark">{p.name}</p>
                    <p className="text-[11px] text-muted">{p.sales} sales</p>
                  </div>
                </div>
                <span className="text-sm font-sans font-medium text-dark">{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-serif italic font-medium text-dark mb-4">Quick Stats</h3>
          <div className="bg-white rounded-lg border border-border-light p-5 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans tracking-widest-xl uppercase text-muted">Conversion Rate</span>
              <span className="text-sm font-sans font-medium text-dark">{adminStats.conversionRate}%</span>
            </div>
            <div className="w-full h-px bg-border-light" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans tracking-widest-xl uppercase text-muted">Avg. Order Value</span>
              <span className="text-sm font-sans font-medium text-dark">{formatPrice(adminStats.avgOrderValue)}</span>
            </div>
            <div className="w-full h-px bg-border-light" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans tracking-widest-xl uppercase text-muted">Categories</span>
              <span className="text-sm font-sans font-medium text-dark">{adminStats.totalCategories}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-serif italic font-medium text-dark mb-4">Recent Orders</h3>
        <div className="bg-white rounded-lg border border-border-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-border-light bg-cream-dark/50">
                  <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Order</th>
                  <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Customer</th>
                  <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Items</th>
                  <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Total</th>
                  <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Status</th>
                  <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 5).map(order => (
                  <tr key={order.id} className="border-b border-border-light last:border-b-0 hover:bg-cream/50 transition-colors">
                    <td className="px-5 py-3.5 text-dark font-medium">{order.id}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-dark">{order.customer}</p>
                      <p className="text-[11px] text-muted">{order.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-dark">{order.items}</td>
                    <td className="px-5 py-3.5 text-dark">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-[10px] font-sans tracking-widest-xl uppercase px-2.5 py-1 rounded-md ${statusStyles[order.status]}`}>{order.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-muted text-[11px]">{order.date}</td>
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
  const [editingProduct, setEditingProduct] = useState<typeof allProducts[0] | null>(null);

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white border border-border-light rounded-lg pl-10 pr-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors placeholder:text-muted/40"
          />
        </div>
        <span className="text-[11px] text-muted font-sans">{filtered.length} products</span>
        <button className="ml-auto flex items-center gap-2 text-[10px] font-sans tracking-widest-xl uppercase px-4 py-2.5 bg-dark text-white rounded-lg hover:bg-neutral-800 transition-all duration-300">
          <IoAddOutline className="w-3.5 h-3.5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border-light bg-cream-dark/50">
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Product</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Category</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Price</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Tag</th>
                <th className="w-20 px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} className="border-b border-border-light last:border-b-0 hover:bg-cream/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-12 rounded object-cover bg-cream-dark" />
                      <p className="text-dark font-medium">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted capitalize">{product.category}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-dark">{formatPrice(product.price)}</span>
                    {product.originalPrice && <span className="text-muted text-[11px] line-through ml-2">{formatPrice(product.originalPrice)}</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    {product.tag ? (
                      <span className={`inline-block text-[10px] font-sans tracking-widest-xl uppercase px-2 py-0.5 rounded text-white ${product.tagColor || 'bg-dark'}`}>{product.tag}</span>
                    ) : (
                      <span className="text-muted/40 text-[11px]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setEditingProduct(product)}
                      className="text-[10px] font-sans tracking-widest-xl uppercase text-muted hover:text-dark transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30" onClick={() => setEditingProduct(null)} />
          <div className="relative bg-white rounded-lg border border-border-light shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-serif italic font-medium text-dark">Edit Product</h3>
              <button onClick={() => setEditingProduct(null)} className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-border-light flex items-center justify-center transition-colors">
                <IoClose className="w-3.5 h-3.5 text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Product Name</label>
                <input type="text" defaultValue={editingProduct.name}
                  className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Price</label>
                  <input type="number" defaultValue={editingProduct.price}
                    className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Category</label>
                  <input type="text" defaultValue={editingProduct.category}
                    className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setEditingProduct(null)}
                  className="text-[10px] font-sans tracking-widest-xl uppercase px-5 py-2.5 border border-border-light rounded-lg hover:border-dark transition-colors">
                  Cancel
                </button>
                <button onClick={() => setEditingProduct(null)}
                  className="text-[10px] font-sans tracking-widest-xl uppercase px-5 py-2.5 bg-dark text-white rounded-lg hover:bg-neutral-800 transition-colors">
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
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = recentOrders.filter(o =>
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full bg-white border border-border-light rounded-lg pl-10 pr-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors placeholder:text-muted/40"
          />
        </div>
        <span className="text-[11px] text-muted font-sans">{filtered.length} orders</span>
      </div>

      <div className="bg-white rounded-lg border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border-light bg-cream-dark/50">
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Order</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Customer</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Items</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Total</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Status</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Date</th>
                <th className="w-10 px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-b border-border-light hover:bg-cream/50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="px-5 py-3.5 text-dark font-medium">{order.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-dark">{order.customer}</p>
                    <p className="text-[11px] text-muted">{order.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-dark">{order.items}</td>
                  <td className="px-5 py-3.5 text-dark">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block text-[10px] font-sans tracking-widest-xl uppercase px-2.5 py-1 rounded-md ${statusStyles[order.status]}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-muted text-[11px]">{order.date}</td>
                  <td className="px-5 py-3.5"><IoChevronDown className="w-3.5 h-3.5 text-muted" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-lg border border-border-light shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-serif italic font-medium text-dark">{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-border-light flex items-center justify-center transition-colors">
                <IoClose className="w-3.5 h-3.5 text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Customer</p>
                  <p className="text-sm text-dark">{selectedOrder.customer}</p>
                  <p className="text-[11px] text-muted">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Status</p>
                  <span className={`inline-block text-[10px] font-sans tracking-widest-xl uppercase px-2.5 py-1 rounded-md ${statusStyles[selectedOrder.status]}`}>{selectedOrder.status}</span>
                </div>
              </div>
              <div className="w-full h-px bg-border-light" />
              <div>
                <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Shipping Address</p>
                <p className="text-sm text-dark">{selectedOrder.address}</p>
              </div>
              <div>
                <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Payment</p>
                <p className="text-sm text-dark">{selectedOrder.payment}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Items</p>
                  <p className="text-sm text-dark">{selectedOrder.items}</p>
                </div>
                <div>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Total</p>
                  <p className="text-sm font-medium text-dark">{formatPrice(selectedOrder.total)}</p>
                </div>
              </div>
              <div className="w-full h-px bg-border-light" />
              <div>
                <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'processing', 'shipped', 'delivered'] as const).map(status => (
                    <button key={status} onClick={() => setSelectedOrder(null)}
                      className={`text-[10px] font-sans tracking-widest-xl uppercase px-3 py-1.5 rounded-lg border transition-all duration-200 ${
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
        </div>
      )}
    </div>
  );
}

function Users() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const filtered = adminUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-white border border-border-light rounded-lg pl-10 pr-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors placeholder:text-muted/40"
          />
        </div>
        <span className="text-[11px] text-muted font-sans">{filtered.length} users</span>
      </div>

      <div className="bg-white rounded-lg border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border-light bg-cream-dark/50">
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Name</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Email</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Orders</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Total Spent</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Status</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-border-light last:border-b-0 hover:bg-cream/50 transition-colors cursor-pointer" onClick={() => setSelectedUser(user)}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-dark flex items-center justify-center text-white text-xs font-sans font-medium">{user.name.charAt(0)}</div>
                      <p className="text-dark font-medium">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted">{user.email}</td>
                  <td className="px-5 py-3.5 text-dark">{user.orders}</td>
                  <td className="px-5 py-3.5 text-dark">{formatPrice(user.spent)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block text-[10px] font-sans tracking-widest-xl uppercase px-2 py-0.5 rounded ${user.status === 'active' ? 'text-green-stock bg-green-100' : 'text-muted bg-cream-dark'}`}>{user.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-muted text-[11px]">{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-white rounded-lg border border-border-light shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-serif italic font-medium text-dark">{selectedUser.name}</h3>
              <button onClick={() => setSelectedUser(null)} className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-border-light flex items-center justify-center transition-colors">
                <IoClose className="w-3.5 h-3.5 text-muted" />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-lg bg-dark flex items-center justify-center text-white text-lg font-sans font-medium">{selectedUser.name.charAt(0)}</div>
              <div>
                <p className="text-sm font-medium text-dark">{selectedUser.name}</p>
                <p className="text-[11px] text-muted">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 bg-cream rounded-lg">
              <div className="text-center">
                <p className="text-lg font-serif font-medium text-dark">{selectedUser.orders}</p>
                <p className="text-[9px] font-sans tracking-widest-xl uppercase text-muted">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-serif font-medium text-dark">{formatPrice(selectedUser.spent)}</p>
                <p className="text-[9px] font-sans tracking-widest-xl uppercase text-muted">Spent</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-serif font-medium text-dark capitalize">{selectedUser.status}</p>
                <p className="text-[9px] font-sans tracking-widest-xl uppercase text-muted">Status</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Categories() {
  const [search, setSearch] = useState('');
  const [categoryList, setCategoryList] = useState(categories);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', slug: '' });

  const filtered = categoryList.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const addCategory = () => {
    if (!newCat.name || !newCat.slug) return;
    setCategoryList(prev => [...prev, { id: Date.now(), name: newCat.name, slug: newCat.slug, products: 0, created: new Date().toISOString().split('T')[0] }]);
    setNewCat({ name: '', slug: '' });
    setShowAdd(false);
  };

  const deleteCategory = (id: number) => {
    setCategoryList(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-white border border-border-light rounded-lg pl-10 pr-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors placeholder:text-muted/40"
          />
        </div>
        <span className="text-[11px] text-muted font-sans">{filtered.length} categories</span>
        <button onClick={() => setShowAdd(true)}
          className="ml-auto flex items-center gap-2 text-[10px] font-sans tracking-widest-xl uppercase px-4 py-2.5 bg-dark text-white rounded-lg hover:bg-neutral-800 transition-all duration-300">
          <IoAddOutline className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cat => (
          <div key={cat.id} className="bg-white rounded-lg border border-border-light p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-sans font-medium text-dark capitalize">{cat.name}</h4>
                <p className="text-[11px] text-muted mt-0.5">/{cat.slug}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[10px] font-sans tracking-widest-xl uppercase text-muted bg-cream-dark px-2 py-0.5 rounded">{cat.products} products</span>
                  <span className="text-[10px] text-muted">{cat.created}</span>
                </div>
              </div>
              <button onClick={() => deleteCategory(cat.id)}
                className="w-7 h-7 rounded-lg border border-border-light flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-colors flex-shrink-0">
                <IoTrashOutline className="w-3.5 h-3.5 text-muted hover:text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-lg border border-border-light shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-serif italic font-medium text-dark">Add Category</h3>
              <button onClick={() => setShowAdd(false)} className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-border-light flex items-center justify-center transition-colors">
                <IoClose className="w-3.5 h-3.5 text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Category Name</label>
                <input type="text" value={newCat.name} onChange={e => setNewCat(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Swimwear"
                  className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors placeholder:text-muted/40" />
              </div>
              <div>
                <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Slug</label>
                <input type="text" value={newCat.slug} onChange={e => setNewCat(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g. swimwear"
                  className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors placeholder:text-muted/40" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowAdd(false)}
                  className="text-[10px] font-sans tracking-widest-xl uppercase px-5 py-2.5 border border-border-light rounded-lg hover:border-dark transition-colors">
                  Cancel
                </button>
                <button onClick={addCategory}
                  className="text-[10px] font-sans tracking-widest-xl uppercase px-5 py-2.5 bg-dark text-white rounded-lg hover:bg-neutral-800 transition-colors">
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
  const maxRevenue = Math.max(...monthlyAnalytics.map(m => m.revenue));
  const maxOrders = Math.max(...monthlyAnalytics.map(m => m.orders));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-border-light p-5">
          <p className="text-[11px] font-sans tracking-widest-xl uppercase text-muted">Total Revenue (YTD)</p>
          <p className="text-2xl font-serif font-medium text-dark mt-1">${adminStats.totalRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-green-stock font-sans mt-1 inline-block">+{adminStats.monthlyGrowth}% vs last year</span>
        </div>
        <div className="bg-white rounded-lg border border-border-light p-5">
          <p className="text-[11px] font-sans tracking-widest-xl uppercase text-muted">Total Orders (YTD)</p>
          <p className="text-2xl font-serif font-medium text-dark mt-1">{adminStats.totalOrders}</p>
          <span className="text-[11px] text-green-stock font-sans mt-1 inline-block">+8.3% vs last year</span>
        </div>
        <div className="bg-white rounded-lg border border-border-light p-5">
          <p className="text-[11px] font-sans tracking-widest-xl uppercase text-muted">Avg. Order Value</p>
          <p className="text-2xl font-serif font-medium text-dark mt-1">{formatPrice(adminStats.avgOrderValue)}</p>
          <span className="text-[11px] text-muted font-sans mt-1 inline-block">Stable vs last year</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-serif italic font-medium text-dark mb-4">Monthly Revenue</h3>
        <div className="bg-white rounded-lg border border-border-light p-5">
          <div className="flex items-end justify-between gap-1 h-40">
            {monthlyAnalytics.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="w-full bg-gold/20 rounded-t-sm relative" style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-dark text-white text-[10px] px-2 py-0.5 rounded font-sans">
                    ${m.revenue.toLocaleString()}
                  </div>
                  <div className="w-full h-full bg-gold rounded-t-sm opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[9px] text-muted font-sans">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-3 h-3 rounded bg-gold/30" />
            <span className="text-[10px] text-muted font-sans">Monthly revenue in USD</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-serif italic font-medium text-dark mb-4">Top Products</h3>
          <div className="bg-white rounded-lg border border-border-light p-5 space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cream-dark flex items-center justify-center text-[10px] font-sans font-medium text-muted">{i + 1}</span>
                  <p className="text-sm font-sans text-dark">{p.name}</p>
                </div>
                <span className="text-sm font-sans font-medium text-dark">{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-serif italic font-medium text-dark mb-4">Monthly Orders</h3>
          <div className="bg-white rounded-lg border border-border-light p-5">
            <div className="flex items-end justify-between gap-1 h-32">
              {monthlyAnalytics.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="w-full bg-dark/10 rounded-t-sm relative" style={{ height: `${(m.orders / maxOrders) * 100}%` }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-dark text-white text-[10px] px-2 py-0.5 rounded font-sans">
                      {m.orders} orders
                    </div>
                    <div className="w-full h-full bg-dark rounded-t-sm opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[9px] text-muted font-sans">{m.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-3 h-3 rounded bg-dark/20" />
              <span className="text-[10px] text-muted font-sans">Monthly order count</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Settings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-lg border border-border-light p-6">
        <h3 className="text-sm font-serif italic font-medium text-dark mb-5">Store Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Store Name</label>
              <input type="text" defaultValue="NASSEG"
                className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Email</label>
              <input type="email" defaultValue="hello@nasseg.com"
                className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Tagline</label>
            <input type="text" defaultValue="Timeless fashion, crafted for the discerning"
              className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border-light p-6">
        <h3 className="text-sm font-serif italic font-medium text-dark mb-5">Shipping Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Free Shipping Threshold</label>
              <input type="text" defaultValue="$200"
                className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Standard Shipping</label>
              <input type="text" defaultValue="$12.00"
                className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Processing Time</label>
            <input type="text" defaultValue="1-2 business days"
              className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border-light p-6">
        <h3 className="text-sm font-serif italic font-medium text-dark mb-5">Notifications</h3>
        <div className="space-y-4">
          {['New Order Alert', 'Low Stock Warning', 'Customer Signup', 'Order Cancellation'].map(item => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm font-sans text-dark">{item}</span>
              <div className="w-10 h-5 rounded-full bg-gold relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSave}
          className="flex items-center gap-2 text-[10px] font-sans tracking-widest-xl uppercase px-6 py-3 bg-dark text-white rounded-lg hover:bg-neutral-800 transition-all duration-300">
          {saved ? (
            <><IoCheckmarkCircle className="w-4 h-4 text-green-stock" /> Saved</>
          ) : (
            'Save Changes'
          )}
        </button>
        <button className="text-[10px] font-sans tracking-widest-xl uppercase px-6 py-3 border border-border-light rounded-lg hover:border-dark transition-colors">
          Reset
        </button>
      </div>
    </div>
  );
}
