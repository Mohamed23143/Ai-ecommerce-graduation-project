import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

import { allProducts } from '../data/products';

const newProducts = allProducts.filter(p => p.tag === 'NEW');

const NewArrivalsPage = () => {
  const heroReveal = useRevealOnScroll<HTMLElement>({ threshold: 0.1 });
  const gridReveal = useRevealOnScroll<HTMLDivElement>({ threshold: 0.05 });

  return (
    <div className="min-h-screen bg-[#f9f8f5]">
      <Header backLabel="Back to Home" backTo="/" />

      {/* Hero */}
      <section
        ref={heroReveal.ref}
        className={`relative h-[300px] md:h-[420px] overflow-hidden reveal-element ${heroReveal.isVisible ? 'revealed' : ''}`}
      >
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=500&fit=crop&crop=center"
          alt="New Arrivals"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          <span className="text-[11px] font-sans tracking-widest-2xl uppercase text-white/60 mb-3">
            Just Landed
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white italic mb-3">
            New Arrivals
          </h1>
          <p className="text-sm md:text-base text-white/50 font-sans max-w-md">
            Discover our latest pieces — fresh from the atelier, designed to inspire.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="max-w-8xl mx-auto px-5 lg:px-12 py-6">
        <nav className="text-xs font-sans text-muted">
          <Link to="/" className="hover:text-dark transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-dark">New Arrivals</span>
        </nav>
      </div>

      {/* Products */}
      <div
        ref={gridReveal.ref}
        className={`max-w-8xl mx-auto px-5 lg:px-12 pb-16 lg:pb-24 reveal-element ${gridReveal.isVisible ? 'revealed' : ''}`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {newProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewArrivalsPage;
