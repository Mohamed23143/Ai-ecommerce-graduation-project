import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../ProductCard';
import ProductSkeleton from '../ProductSkeleton';
import ScrollReveal from '../ScrollReveal';
import { fetchProducts, type BackendProduct } from '../../services/api';

/** Maps backend products to the format ProductCard expects. */
function toCardProduct(p: BackendProduct) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
  };
}

const TrendingNow = () => {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data.slice(0, 4)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="trending" className="py-16 lg:py-20 bg-[#f9f8f5]">
      <div className="max-w-8xl mx-auto px-5 lg:px-12">
        {/* Header */}
        <ScrollReveal variant="fade-up" className="flex items-end justify-between mb-10 lg:mb-12">
          <h2 className="font-serif text-3xl lg:text-[42px] text-dark italic">
            Trending Now
          </h2>
          <Link
            to="/new-arrivals"
            className="text-[11px] font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors duration-300 hidden sm:block"
          >
            View All →
          </Link>
        </ScrollReveal>

        {/* Loading */}
        {loading && <ProductSkeleton count={4} />}

        {/* Error */}
        {error && (
          <p className="text-sm font-sans text-red-500 text-center py-12">
            Failed to load products. Please try again later.
          </p>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <ScrollReveal variant="fade-up" className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 stagger-grid">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={toCardProduct(product)}
                index={index}
              />
            ))}
          </ScrollReveal>
        )}

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/new-arrivals"
            className="text-[11px] font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors duration-300 border-b border-dark pb-1"
          >
            View All Trending →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
