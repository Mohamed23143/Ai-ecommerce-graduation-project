import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { IoGridOutline, IoListOutline, IoChevronDown, IoFilterOutline } from 'react-icons/io5';
import { fetchProducts, type BackendProduct } from '../services/api';

function toCardProduct(p: BackendProduct) {
  return { id: p.id, name: p.name, price: p.price, image: p.image, category: p.category };
}

const categoryMeta: Record<string, { title: string; subtitle: string; heroImage: string }> = {
  women: {
    title: "Women's Collection",
    subtitle: 'Timeless elegance redefined for the modern woman',
    heroImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop',
  },
  men: {
    title: "Men's Collection",
    subtitle: 'Refined sophistication for the contemporary gentleman',
    heroImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1600&auto=format&fit=crop',
  },
  accessories: {
    title: 'Accessories',
    subtitle: 'The finishing touches that complete every look',
    heroImage: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1600&auto=format&fit=crop',
  },
  eyewear: {
    title: 'Eyewear',
    subtitle: 'See the world through a lens of luxury',
    heroImage: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=1600&auto=format&fit=crop',
  },
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = ['Black', 'Natural', 'Cream', 'Gold', 'Silver', 'Brown', 'Tortoise'];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Sellers'];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  // Draft filter state (changes on keystroke, not applied until Apply)
  const [draftMin, setDraftMin] = useState('');
  const [draftMax, setDraftMax] = useState('');
  // Applied filter state (triggers API call when changed)
  const [appliedMin, setAppliedMin] = useState('');
  const [appliedMax, setAppliedMax] = useState('');
  const [appliedSize, setAppliedSize] = useState('');
  const [appliedColor, setAppliedColor] = useState('');
  const mountedRef = useRef(false);
  const heroReveal = useRevealOnScroll<HTMLElement>({ threshold: 0.1 });
  const gridReveal = useRevealOnScroll<HTMLDivElement>({ threshold: 0.05 });

  const meta = categoryMeta[slug || ''] || categoryMeta.women;

  const hasActiveFilters = appliedMin || appliedMax || appliedSize || appliedColor;

  // Fetch products only when slug or applied filters change
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
    }
    setLoading(true);
    setError('');
    fetchProducts({
      category: slug,
      minPrice: appliedMin ? Number(appliedMin) : undefined,
      maxPrice: appliedMax ? Number(appliedMax) : undefined,
      size: appliedSize || undefined,
      color: appliedColor || undefined,
    })
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug, appliedMin, appliedMax, appliedSize, appliedColor]);

  const clearFilters = () => {
    setDraftMin('');
    setDraftMax('');
    setAppliedMin('');
    setAppliedMax('');
    setAppliedSize('');
    setAppliedColor('');
  };

  const applyFilters = () => {
    setAppliedMin(draftMin);
    setAppliedMax(draftMax);
    setShowFilters(false);
  };

  const toggleSize = (size: string) => {
    const next = appliedSize === size ? '' : size;
    setAppliedSize(next);
  };

  const toggleColor = (color: string) => {
    const next = appliedColor === color ? '' : color;
    setAppliedColor(next);
  };

  // Apply client-side sorting
  const sorted = [...products].sort((a, b) => {
    switch (selectedSort) {
      case 'Price: Low to High': return a.price - b.price;
      case 'Price: High to Low': return b.price - a.price;
      case 'Newest': return b.id - a.id;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-[#f9f8f5]">
      <Helmet>
        <title>{meta.title} — NASSEG</title>
        <meta name="description" content={meta.subtitle} />
      </Helmet>
      <Header backLabel="Back to Home" backTo="/" />

      {/* Category Hero */}
      <section
        ref={heroReveal.ref}
        className={`relative h-[300px] md:h-[400px] overflow-hidden reveal-element ${heroReveal.isVisible ? 'revealed' : ''}`}
      >
        <img
          src={meta.heroImage}
          alt={meta.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          <span className="text-[11px] font-sans tracking-widest-2xl uppercase text-white/60 mb-3">
            Collection
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-white italic mb-3">
            {meta.title}
          </h1>
          <p className="text-sm md:text-base text-white/50 font-sans max-w-md">
            {meta.subtitle}
          </p>
        </div>
      </section>

      {/* Breadcrumbs + Filter Bar */}
      <div className="max-w-8xl mx-auto px-5 lg:px-12 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <nav className="text-xs font-sans text-muted">
          <Link to="/" className="hover:text-dark transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-dark capitalize">{slug}</span>
        </nav>

        <div className="flex items-center gap-4">
          <span className="text-xs font-sans text-muted">{loading ? '...' : sorted.length} Products</span>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 text-xs font-sans tracking-widest-xl uppercase border px-4 py-2.5 transition-colors cursor-pointer ${hasActiveFilters ? 'bg-dark text-white border-dark' : 'border-border-light text-dark hover:border-dark'}`}
          >
            <IoFilterOutline className="w-3.5 h-3.5" />
            Filters
            {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 text-xs font-sans tracking-widest-xl uppercase text-dark border border-border-light px-4 py-2.5 hover:border-dark transition-colors cursor-pointer"
            >
              {selectedSort}
              <IoChevronDown className={`w-3 h-3 transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-border-light shadow-lg z-20 min-w-[180px]">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSelectedSort(opt); setSortOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-xs font-sans hover:bg-cream transition-colors cursor-pointer ${
                      selectedSort === opt ? 'text-gold font-medium' : 'text-dark'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid toggle */}
          <div className="hidden sm:flex items-center gap-1 border border-border-light">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-dark text-white' : 'text-muted hover:text-dark'}`} 
              aria-label="Grid view"
            >
              <IoGridOutline className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-dark text-white' : 'text-muted hover:text-dark'}`} 
              aria-label="List view"
            >
              <IoListOutline className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="max-w-8xl mx-auto px-5 lg:px-12 pb-8">
          <div className="bg-white border border-border-light p-6 space-y-6">
            {/* Price Range */}
            <div>
              <span className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-3">Price Range</span>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={draftMin}
                  onChange={(e) => setDraftMin(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') applyFilters(); }}
                  className="w-full border border-border-light px-3 py-2 text-xs font-sans outline-none focus:border-dark transition-colors"
                />
                <span className="text-muted text-xs">—</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Max"
                  value={draftMax}
                  onChange={(e) => setDraftMax(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') applyFilters(); }}
                  className="w-full border border-border-light px-3 py-2 text-xs font-sans outline-none focus:border-dark transition-colors"
                />
              </div>
            </div>

            {/* Size */}
            <div>
              <span className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-3">Size</span>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`px-4 py-2 text-[10px] font-sans tracking-widest-xl uppercase border transition-colors cursor-pointer ${
                      appliedSize === s
                        ? 'bg-dark text-white border-dark'
                        : 'border-border-light text-muted hover:border-dark hover:text-dark'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <span className="block text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-3">Color</span>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleColor(c)}
                    className={`px-4 py-2 text-[10px] font-sans tracking-widest-xl uppercase border transition-colors cursor-pointer ${
                      appliedColor === c
                        ? 'bg-dark text-white border-dark'
                        : 'border-border-light text-muted hover:border-dark hover:text-dark'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear / Apply */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={clearFilters}
                className="text-[10px] font-sans tracking-widest-xl uppercase text-muted hover:text-dark underline transition-colors"
              >
                Clear filters
              </button>
              <button
                onClick={applyFilters}
                className="text-[10px] font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors ml-auto"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List/Grid */}
      <div
        ref={gridReveal.ref}
        className={`max-w-8xl mx-auto px-5 lg:px-12 pb-16 lg:pb-24 reveal-element ${gridReveal.isVisible ? 'revealed' : ''}`}
      >
        {/* Loading skeletons */}
        {loading && <ProductSkeleton count={8} />}

        {/* Error */}
        {error && (
          <p className="text-sm font-sans text-red-500 text-center py-12">
            Failed to load products. Please try again later.
          </p>
        )}

        {/* Products */}
        {!loading && !error && (
          <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" : "flex flex-col gap-2"}>
            {sorted.map((product, index) => (
              <ProductCard key={product.id} product={toCardProduct(product)} index={index} layout={viewMode} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
