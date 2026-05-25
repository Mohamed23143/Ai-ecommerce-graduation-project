import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoCloseOutline, IoSearchOutline } from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { allProducts, formatPrice } from '../data/products';

const SearchOverlay = () => {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length >= 2
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const popular = ['Cashmere', 'Outerwear', 'Silk', 'Accessories', 'Eyewear'];

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] search-overlay-enter">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Search Panel */}
      <div className="absolute top-0 left-0 right-0 bg-[#f9f8f5] shadow-2xl search-panel-slide">
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto px-5 lg:px-12 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[11px] font-sans tracking-widest-2xl uppercase text-muted">
              Search
            </span>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 text-dark hover:text-gold transition-colors cursor-pointer"
              aria-label="Close search"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>
          </div>

          <div className="relative">
            <IoSearchOutline className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, categories..."
              className="w-full bg-transparent border-b-2 border-dark/20 focus:border-gold text-dark text-lg font-serif pl-8 pr-4 py-3 outline-none transition-colors placeholder:text-muted/50"
            />
          </div>
        </div>

        {/* Results / Popular */}
        <div className="max-w-4xl mx-auto px-5 lg:px-12 pb-10 max-h-[60vh] overflow-y-auto">
          {query.length < 2 ? (
            <div>
              <span className="text-[11px] font-sans tracking-widest-xl uppercase text-muted block mb-4">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {popular.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-sm font-sans border border-border-light px-4 py-2 hover:border-dark hover:bg-dark hover:text-white transition-all duration-200 cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-xl text-dark italic mb-2">No results found</p>
              <p className="text-sm font-sans text-muted">Try a different search term</p>
            </div>
          ) : (
            <div>
              <span className="text-[11px] font-sans tracking-widest-xl uppercase text-muted block mb-4">
                {results.length} Result{results.length !== 1 ? 's' : ''}
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.slice(0, 8).map((product, index) => (
                  <Link
                    to="/product"
                    key={product.id}
                    onClick={() => { setIsSearchOpen(false); setQuery(''); }}
                    className="group cursor-pointer search-result-card"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative overflow-hidden mb-3 bg-[#eae7e0]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-[180px] md:h-[220px] object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.tag && (
                        <span className={`absolute top-2 left-2 ${product.tagColor} text-white text-[9px] font-sans tracking-widest-xl uppercase px-2 py-0.5`}>
                          {product.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-sm text-dark group-hover:text-gold transition-colors duration-200 mb-0.5">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-serif font-medium text-dark">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs font-sans text-muted line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
