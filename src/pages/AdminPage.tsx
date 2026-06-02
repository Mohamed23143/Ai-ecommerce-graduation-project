import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { fetchAdminStats, fetchAdminOrders, updateOrderStatus, fetchProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct, generateAIDescription, fetchAdminUsers, fetchAdminCategories, fetchMonthlyAnalytics, fetchTopProducts } from '../services/api';
import type { AdminStats, AdminOrder, BackendProduct, AdminUserInfoExtended, AdminCategory, MonthlyAnalytics, TopProduct } from '../services/api';
import { uploadProductImage } from '../services/supabase';
import { IoGridOutline, IoBagHandleOutline, IoCartOutline, IoPeopleOutline, IoCubeOutline, IoClose, IoSearchOutline, IoChevronDown, IoPricetagOutline, IoBarChartOutline, IoSettingsOutline, IoAdd, IoTrashOutline, IoCheckmarkCircle, IoLogOutOutline } from 'react-icons/io5';
import AdminAuthPage from './AdminAuthPage';

type Section = 'dashboard' | 'products' | 'orders' | 'users' | 'categories' | 'analytics' | 'settings';

const statusStyles: Record<string, string> = {
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
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [s, o] = await Promise.all([fetchAdminStats(), fetchAdminOrders()]);
        if (!cancelled) {
          setStats(s);
          setOrders(o);
        }
      } catch {
        // silent — keep defaults
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const avgOrderValue = stats && stats.total_orders > 0
    ? stats.total_revenue / stats.total_orders
    : 0;

  const cards = [
    { label: 'Total Products', value: stats?.total_products ?? '—', icon: IoCubeOutline, color: 'bg-dark' },
    { label: 'Total Orders', value: stats?.total_orders ?? '—', icon: IoCartOutline, color: 'bg-gold' },
    { label: 'Total Revenue', value: stats ? `$${(stats.total_revenue / 1000).toFixed(1)}K` : '—', icon: IoBagHandleOutline, color: 'bg-dark' },
    { label: 'Total Users', value: stats ? stats.total_users.toLocaleString() : '—', icon: IoPeopleOutline, color: 'bg-gold' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          <h3 className="text-sm font-serif italic font-medium text-dark mb-4">Orders by Status</h3>
          <div className="bg-white rounded-lg border border-border-light p-5 space-y-4">
            {stats && Object.keys(stats.orders_by_status).length > 0 ? (
              Object.entries(stats.orders_by_status).map(([status, count], i) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-cream-dark flex items-center justify-center text-[10px] font-sans font-medium text-muted">{i + 1}</span>
                    <p className="text-sm font-sans text-dark capitalize">{status}</p>
                  </div>
                  <span className="text-sm font-sans font-medium text-dark">{count} order{count !== 1 ? 's' : ''}</span>
                </div>
              ))
            ) : (
              <p className="text-sm font-sans text-muted text-center py-4">No orders yet</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-serif italic font-medium text-dark mb-4">Quick Stats</h3>
          <div className="bg-white rounded-lg border border-border-light p-5 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans tracking-widest-xl uppercase text-muted">Avg. Order Value</span>
              <span className="text-sm font-sans font-medium text-dark">
                {stats && stats.total_orders > 0 ? formatPrice(avgOrderValue) : '—'}
              </span>
            </div>
            <div className="w-full h-px bg-border-light" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans tracking-widest-xl uppercase text-muted">Categories</span>
              <span className="text-sm font-sans font-medium text-dark">{stats?.total_products ? 'See Products tab' : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-serif italic font-medium text-dark mb-4">Recent Orders</h3>
        <div className="bg-white rounded-lg border border-border-light overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-sans text-muted">No orders have been placed yet.</p>
            </div>
          ) : (
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
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="border-b border-border-light last:border-b-0 hover:bg-cream/50 transition-colors">
                    <td className="px-5 py-3.5 text-dark font-medium">#NSG-{String(order.id).padStart(5, '0')}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-dark">{order.user.email.split('@')[0]}</p>
                      <p className="text-[11px] text-muted">{order.user.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-dark">{order.items.reduce((s, i) => s + i.quantity, 0)}</td>
                    <td className="px-5 py-3.5 text-dark">{formatPrice(order.total_amount)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-[10px] font-sans tracking-widest-xl uppercase px-2.5 py-1 rounded-md ${statusStyles[order.status] || statusStyles.pending}`}>{order.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-muted text-[11px]">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editTarget, setEditTarget] = useState<BackendProduct | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image: '', stock_quantity: '', sizes: '', colors: '' });

  const loadProducts = () => {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const openEdit = (p: BackendProduct) => {
    setForm({ name: p.name, description: p.description, price: String(p.price), category: p.category, image: p.image, stock_quantity: String(p.stock_quantity), sizes: (p.sizes || []).join(', '), colors: (p.colors || []).join(', ') });
    setImageFile(null);
    setEditTarget(p);
  };

  const openAdd = () => {
    setForm({ name: '', description: '', price: '', category: 'women', image: '', stock_quantity: '10', sizes: '', colors: '' });
    setImageFile(null);
    setAddOpen(true);
  };

  const handleGenerateDescription = async () => {
    if (!form.name || !form.category) {
      alert('Please fill in the product name and category first.');
      return;
    }
    setAiLoading(true);
    try {
      const { description } = await generateAIDescription(form.name, form.category);
      setForm(f => ({ ...f, description }));
    } catch (err: any) {
      alert(err.message || 'Failed to generate description');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    let imageUrl = form.image || '';
    try {
      if (imageFile) {
        setUploading(true);
        try {
          imageUrl = await uploadProductImage(imageFile);
        } catch (uploadErr: any) {
          console.error("DETAILED_UPLOAD_ERROR:", uploadErr);
          alert("Upload failed: " + (uploadErr.message || "Unknown error"));
          setUploading(false);
          setSaving(false);
          return;
        }
        setUploading(false);
      }
      const payload = {
        name: form.name,
        description: form.description || '',
        price: Number(form.price),
        category: form.category,
        image: imageUrl,
        stock_quantity: form.stock_quantity ? Number(form.stock_quantity) : 0,
        sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: form.colors ? form.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      if (editTarget) {
        await updateAdminProduct(editTarget.id, payload);
      } else {
        await createAdminProduct(payload);
      }
      setEditTarget(null);
      setAddOpen(false);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (p: BackendProduct) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await deleteAdminProduct(p.id);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const modalOpen = editTarget || addOpen;
  const modalTitle = editTarget ? 'Edit Product' : 'Add Product';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
        <button onClick={openAdd} className="ml-auto flex items-center gap-2 text-[10px] font-sans tracking-widest-xl uppercase px-4 py-2.5 bg-dark text-white rounded-lg hover:bg-neutral-800 transition-all duration-300">
          <IoAdd className="w-3.5 h-3.5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg border border-border-light overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-sans text-muted">No products found.</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border-light bg-cream-dark/50">
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Product</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Category</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Price</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Stock</th>
                <th className="w-32 px-5 py-3" />
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
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-sans ${product.stock_quantity > 0 ? 'text-green-stock' : 'text-red-500'}`}>
                      {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(product)}
                        className="text-[10px] font-sans tracking-widest-xl uppercase text-muted hover:text-dark transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product)}
                        className="text-[10px] font-sans tracking-widest-xl uppercase text-red-400 hover:text-red-600 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30" onClick={() => { setEditTarget(null); setAddOpen(false); }} />
          <div className="relative bg-white rounded-lg border border-border-light shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-serif italic font-medium text-dark">{modalTitle}</h3>
              <button onClick={() => { setEditTarget(null); setAddOpen(false); }} className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-border-light flex items-center justify-center transition-colors">
                <IoClose className="w-3.5 h-3.5 text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Product Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted">Description</label>
                  <button type="button" onClick={handleGenerateDescription} disabled={aiLoading}
                    className="text-[10px] font-sans tracking-widest uppercase text-gold hover:text-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                    {aiLoading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>Generate with AI ✨</>
                    )}
                  </button>
                </div>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors resize-none" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Price ($)</label>
                  <input type="number" min={0} step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Category</label>
                  <input type="text" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Product Image</label>
                <div className="flex items-center gap-3">
                  <input id="image-upload" type="file" accept="image/*" disabled={uploading} onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                  <label htmlFor="image-upload" className="inline-block text-[10px] font-sans tracking-widest-xl uppercase px-4 py-2.5 bg-dark text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                    Choose Image
                  </label>
                  {form.image && !imageFile && (
                    <span className="text-[10px] text-muted">Current: {form.image.split('/').pop()}</span>
                  )}
                  {imageFile && (
                    <span className="text-[10px] text-green-stock">Selected: {imageFile.name}</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Stock Quantity</label>
                  <input type="number" min={0} value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))}
                    className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Sizes (comma-separated)</label>
                <input type="text" value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} placeholder="XS, S, M, L, XL"
                  className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1.5">Colors (comma-separated)</label>
                <input type="text" value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} placeholder="Black, Natural, Cream"
                  className="w-full bg-white border border-border-light rounded-lg px-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => { setEditTarget(null); setAddOpen(false); }}
                  className="text-[10px] font-sans tracking-widest-xl uppercase px-5 py-2.5 border border-border-light rounded-lg hover:border-dark transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving || uploading || !form.name || !form.price}
                  className="text-[10px] font-sans tracking-widest-xl uppercase px-5 py-2.5 bg-dark text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {uploading ? 'Uploading image…' : saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Create Product'}
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
  const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [statusLoading, setStatusLoading] = useState<number | null>(null);
  const [statusError, setStatusError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchAdminOrders()
      .then((o) => { if (!cancelled) setAllOrders(o); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = allOrders.filter(o =>
    o.user.email.toLowerCase().includes(search.toLowerCase()) ||
    `#NSG-${String(o.id).padStart(5, '0')}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setStatusLoading(orderId);
    setStatusError('');
    try {
      await updateOrderStatus(orderId, newStatus);
      setAllOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      setStatusError(err.message || 'Failed to update status');
    } finally {
      setStatusLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

      {statusError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[11px] font-sans text-red-700">
          {statusError}
        </div>
      )}

      <div className="bg-white rounded-lg border border-border-light overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-sans text-muted">No orders found.</p>
          </div>
        ) : (
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
                  <td className="px-5 py-3.5 text-dark font-medium">#NSG-{String(order.id).padStart(5, '0')}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-dark">{order.user.email.split('@')[0]}</p>
                    <p className="text-[11px] text-muted">{order.user.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-dark">{order.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="px-5 py-3.5 text-dark">{formatPrice(order.total_amount)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block text-[10px] font-sans tracking-widest-xl uppercase px-2.5 py-1 rounded-md ${statusStyles[order.status] || statusStyles.pending}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-muted text-[11px]">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="px-5 py-3.5"><IoChevronDown className="w-3.5 h-3.5 text-muted" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-lg border border-border-light shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-serif italic font-medium text-dark">Order #NSG-{String(selectedOrder.id).padStart(5, '0')}</h3>
              <button onClick={() => setSelectedOrder(null)} className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-border-light flex items-center justify-center transition-colors">
                <IoClose className="w-3.5 h-3.5 text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Customer</p>
                  <p className="text-sm text-dark">{selectedOrder.user.email.split('@')[0]}</p>
                  <p className="text-[11px] text-muted">{selectedOrder.user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Status</p>
                  <span className={`inline-block text-[10px] font-sans tracking-widest-xl uppercase px-2.5 py-1 rounded-md ${statusStyles[selectedOrder.status] || statusStyles.pending}`}>{selectedOrder.status}</span>
                </div>
              </div>
              <div className="w-full h-px bg-border-light" />
              <div>
                <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 py-1">
                      <div className="w-10 h-12 bg-[#eae7e0] rounded overflow-hidden flex-shrink-0">
                        <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-sans text-dark truncate">{item.product_name}</p>
                        <p className="text-[10px] text-muted">Qty: {item.quantity} · {formatPrice(item.price_at_purchase)} each</p>
                      </div>
                      <span className="text-sm font-serif text-dark">{formatPrice(item.price_at_purchase * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Total Items</p>
                  <p className="text-sm text-dark">{selectedOrder.items.reduce((s, i) => s + i.quantity, 0)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-1">Total</p>
                  <p className="text-sm font-medium text-dark">{formatPrice(selectedOrder.total_amount)}</p>
                </div>
              </div>
              <div className="w-full h-px bg-border-light" />
              <div>
                <p className="text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(status => (
                    <button
                      key={status}
                      disabled={statusLoading === selectedOrder.id}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                      className={`text-[10px] font-sans tracking-widest-xl uppercase px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                        selectedOrder.status === status
                          ? 'bg-dark text-white border-dark'
                          : 'border-border-light text-muted hover:border-dark hover:text-dark'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {statusLoading === selectedOrder.id && status === selectedOrder.status ? 'Updating…' : status}
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
  const [users, setUsers] = useState<AdminUserInfoExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUserInfoExtended | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAdminUsers()
      .then(data => { if (!cancelled) setUsers(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const userInitial = (email: string) => email.charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-sans text-muted">No users found.</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border-light bg-cream-dark/50">
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">User</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Orders</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Total Spent</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-border-light last:border-b-0 hover:bg-cream/50 transition-colors cursor-pointer" onClick={() => setSelectedUser(user)}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-dark flex items-center justify-center text-white text-xs font-sans font-medium">{userInitial(user.email)}</div>
                      <div>
                        <p className="text-dark font-medium">{user.email.split('@')[0]}</p>
                        <p className="text-[11px] text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-dark">{user.order_count}</td>
                  <td className="px-5 py-3.5 text-dark">{formatPrice(user.total_spent)}</td>
                  <td className="px-5 py-3.5 text-muted text-[11px]">{new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-white rounded-lg border border-border-light shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-serif italic font-medium text-dark">{selectedUser.email.split('@')[0]}</h3>
              <button onClick={() => setSelectedUser(null)} className="w-7 h-7 rounded-lg bg-cream-dark hover:bg-border-light flex items-center justify-center transition-colors">
                <IoClose className="w-3.5 h-3.5 text-muted" />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-lg bg-dark flex items-center justify-center text-white text-lg font-sans font-medium">{userInitial(selectedUser.email)}</div>
              <div>
                <p className="text-sm font-medium text-dark">{selectedUser.email.split('@')[0]}</p>
                <p className="text-[11px] text-muted">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-cream rounded-lg">
              <div className="text-center">
                <p className="text-lg font-serif font-medium text-dark">{selectedUser.order_count}</p>
                <p className="text-[9px] font-sans tracking-widest-xl uppercase text-muted">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-serif font-medium text-dark">{formatPrice(selectedUser.total_spent)}</p>
                <p className="text-[9px] font-sans tracking-widest-xl uppercase text-muted">Spent</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Categories() {
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchAdminCategories()
      .then(data => { if (!cancelled) setCats(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const slug = newName.toLowerCase().replace(/\s+/g, '-');
    setCats(prev => [...prev, { name: newName.trim(), slug, product_count: 0 }]);
    setNewName('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="New category name..."
            className="w-full bg-white border border-border-light rounded-lg pl-10 pr-4 py-2.5 text-sm font-sans outline-none focus:border-gold transition-colors placeholder:text-muted/40"
          />
        </div>
        <button onClick={handleAdd} className="flex items-center gap-1.5 px-4 py-2.5 bg-dark text-white text-[10px] font-sans tracking-widest-xl uppercase rounded-lg hover:bg-dark/90 transition-colors">
          <IoAdd className="w-3.5 h-3.5" /> Add
        </button>
        <span className="text-[11px] text-muted font-sans">{cats.length} categories</span>
      </div>

      <div className="bg-white rounded-lg border border-border-light overflow-hidden">
        {cats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-sans text-muted">No categories found.</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border-light bg-cream-dark/50">
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Name</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Slug</th>
                <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Products</th>
              </tr>
            </thead>
            <tbody>
              {cats.map(cat => (
                <tr key={cat.slug} className="border-b border-border-light last:border-b-0 hover:bg-cream/50 transition-colors">
                  <td className="px-5 py-3.5 text-dark font-medium">{cat.name}</td>
                  <td className="px-5 py-3.5 text-muted">{cat.slug}</td>
                  <td className="px-5 py-3.5 text-dark">{cat.product_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}

function Analytics() {
  const [monthlyData, setMonthlyData] = useState<MonthlyAnalytics[]>([]);
  const [topProductsData, setTopProductsData] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchMonthlyAnalytics(), fetchTopProducts()])
      .then(([m, t]) => {
        if (!cancelled) {
          setMonthlyData(m);
          setTopProductsData(t);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 1);
  const maxSales = Math.max(...topProductsData.map(t => t.sales), 1);

  return (
    <div className="space-y-8">
      {/* Monthly Revenue Chart */}
      <div>
        <h3 className="text-sm font-serif italic font-medium text-dark mb-4">Monthly Revenue</h3>
        <div className="bg-white rounded-lg border border-border-light p-6">
          {monthlyData.length === 0 ? (
            <p className="text-center text-sm text-muted font-sans py-8">No revenue data yet.</p>
          ) : (
          <div className="flex items-end gap-1.5 h-52">
            {monthlyData.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[9px] font-sans text-muted">{formatPrice(item.revenue)}</span>
                <div
                  className="w-full bg-dark/10 hover:bg-dark/20 transition-colors rounded-t cursor-pointer relative group"
                  style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-dark text-white text-[9px] font-sans px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatPrice(item.revenue)}
                  </div>
                </div>
                <span className="text-[9px] font-sans text-muted mt-1">{item.month}</span>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div>
        <h3 className="text-sm font-serif italic font-medium text-dark mb-4">Top Products</h3>
        <div className="bg-white rounded-lg border border-border-light overflow-hidden">
          {topProductsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-sans text-muted">No product data yet.</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-border-light bg-cream-dark/50">
                  <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Product</th>
                  <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Sales</th>
                  <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Revenue</th>
                  <th className="text-left px-5 py-3 text-[10px] font-sans tracking-widest-xl uppercase text-muted">Performance</th>
                </tr>
              </thead>
              <tbody>
                {topProductsData.map((product, i) => (
                  <tr key={i} className="border-b border-border-light last:border-b-0 hover:bg-cream/50 transition-colors">
                    <td className="px-5 py-3.5 text-dark font-medium">{product.name}</td>
                    <td className="px-5 py-3.5 text-dark">{product.sales}</td>
                    <td className="px-5 py-3.5 text-dark">{formatPrice(product.revenue)}</td>
                    <td className="px-5 py-3.5">
                      <div className="w-32 bg-cream-dark rounded-full h-1.5">
                        <div className="bg-dark h-1.5 rounded-full" style={{ width: `${(product.sales / maxSales) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
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
