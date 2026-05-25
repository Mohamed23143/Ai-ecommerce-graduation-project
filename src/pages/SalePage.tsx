import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { allProducts, formatPrice } from '../data/products';
import ProductCard from '../components/ProductCard';

const saleProducts = allProducts.filter(p => p.tag === 'SALE');

const SalePage = () => {
  const heroReveal = useRevealOnScroll<HTMLElement>({ threshold: 0.1 });
  const gridReveal = useRevealOnScroll<HTMLDivElement>({ threshold: 0.05 });

  return (
    <div className="min-h-screen bg-[#f9f8f5]">
      <Header backLabel="Back to Home" backTo="/" />

      {/* Sale Hero */}
      <section
        ref={heroReveal.ref}
        className={`relative h-[300px] md:h-[400px] overflow-hidden reveal-element ${heroReveal.isVisible ? 'revealed' : ''}`}
      >
        <div className="absolute inset-0 bg-dark" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          <span className="text-[11px] font-sans tracking-widest-2xl uppercase text-gold mb-4">
            Limited Time Only
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white italic mb-4">
            Sale
          </h1>
          <p className="text-sm md:text-base text-white/40 font-sans max-w-lg">
            Up to 30% off on selected pieces. Timeless luxury at exceptional value.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="inline-block border border-gold/30 text-gold text-[10px] font-sans tracking-widest-xl uppercase px-4 py-2">
              Use code: NASSEG30
            </span>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="max-w-8xl mx-auto px-5 lg:px-12 py-6">
        <nav className="text-xs font-sans text-muted">
          <Link to="/" className="hover:text-dark transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-dark">Sale</span>
        </nav>
      </div>

      {/* Products */}
      <div
        ref={gridReveal.ref}
        className={`max-w-8xl mx-auto px-5 lg:px-12 pb-16 lg:pb-24 reveal-element ${gridReveal.isVisible ? 'revealed' : ''}`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {saleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SalePage;
