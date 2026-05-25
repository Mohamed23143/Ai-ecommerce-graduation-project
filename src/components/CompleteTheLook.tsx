import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { allProducts } from '../data/products';
import { IoArrowForward } from 'react-icons/io5';

// Find the specific products by name/id to maintain the "Complete the Look" feel
const curatedProducts = allProducts.filter(p => [18, 19, 12, 20].includes(p.id));

const CompleteTheLook = () => {
  return (
    <section id="complete-the-look" className="bg-[#f3f0ea] py-16 lg:py-20 mt-12">
      <div className="max-w-8xl mx-auto px-5 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 lg:mb-12">
          <div>
            <span className="text-[11px] font-sans tracking-widest-xl uppercase text-gold block mb-2.5">
              Style it with
            </span>
            <h2 className="font-serif text-3xl lg:text-[38px] text-dark">
              Complete the Look
            </h2>
          </div>
          <Link
            to="/collections"
            id="shop-all-link"
            className="flex items-center gap-2 text-[11px] font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors duration-300 group"
          >
            Shop All
            <IoArrowForward className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 stagger-children">
          {curatedProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompleteTheLook;
