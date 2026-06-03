import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { IoGridOutline, IoListOutline, IoChevronDown } from 'react-icons/io5';

import { allProducts } from '../data/products';

const categoryMeta: Record<string, { title: string; subtitle: string; heroImage: string }> = {
  women: {
    title: "Women's Collection",
    subtitle: 'Timeless elegance redefined for the modern woman',
    heroImage: '/catagore/Woman_walking_luxury_boutique_202606030746.jpeg',
  },
  men: {
    title: "Men's Collection",
    subtitle: 'Refined sophistication for the contemporary gentleman',
    heroImage: '/catagore/Man_in_suit_in_boutique_202606030746.jpeg',
  },
  accessories: {
    title: 'Accessories',
    subtitle: 'The finishing touches that complete every look',
    heroImage: '/catagore/Luxury_accessories_flat-lay_crea__202606030746.jpeg',
  },
  eyewear: {
    title: 'Eyewear',
    subtitle: 'See the world through a lens of luxury',
    heroImage: '/catagore/Luxury_sunglasses_eyeglasses_cre__202606030746.jpeg',
  },
};

const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Sellers'];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const heroReveal = useRevealOnScroll<HTMLElement>({ threshold: 0.1 });
  const gridReveal = useRevealOnScroll<HTMLDivElement>({ threshold: 0.05 });

  const meta = categoryMeta[slug || ''] || categoryMeta.women;
  
  // Apply sorting
  const sortedProducts = [...allProducts]
    .filter((p) => p.category === slug)
    .sort((a, b) => {
      switch (selectedSort) {
        case 'Price: Low to High':
          return a.price - b.price;
        case 'Price: High to Low':
          return b.price - a.price;
        case 'Newest':
          return b.id - a.id;
        case 'Best Sellers':
          return (b.id % 3) - (a.id % 3); // Just a mock for best sellers
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-[#f9f8f5]">
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
          <span className="text-xs font-sans text-muted">{sortedProducts.length} Products</span>

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

      {/* Product List/Grid */}
      <div
        ref={gridReveal.ref}
        className={`max-w-8xl mx-auto px-5 lg:px-12 pb-16 lg:pb-24 reveal-element ${gridReveal.isVisible ? 'revealed' : ''}`}
      >
        <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" : "flex flex-col gap-2"}>
          {sortedProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} layout={viewMode} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
