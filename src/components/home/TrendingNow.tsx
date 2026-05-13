import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import { allProducts } from '../../data/products';

const trendingProducts = allProducts.slice(0, 4);

const TrendingNow = () => {
  return (
    <section id="trending" className="py-16 lg:py-20 bg-[#f9f8f5]">
      <div className="max-w-8xl mx-auto px-5 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 lg:mb-12">
          <h2 className="font-serif text-3xl lg:text-[42px] text-dark italic">
            Trending Now
          </h2>
          <Link
            to="/new-arrivals"
            className="text-[11px] font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors duration-300 hidden sm:block"
          >
            View All →
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {trendingProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

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
