import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

interface Collection {
  name: string;
  slug: string;
  count: number;
  image: string;
  description: string;
}

const collections: Collection[] = [
  {
    name: "Women's",
    slug: 'women',
    count: 4,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=600&fit=crop&crop=center',
    description: 'Timeless elegance redefined for the modern woman',
  },
  {
    name: "Men's",
    slug: 'men',
    count: 4,
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=600&fit=crop&crop=center',
    description: 'Refined sophistication for the contemporary gentleman',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    count: 4,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=600&fit=crop&crop=center',
    description: 'The finishing touches that complete every look',
  },
  {
    name: 'Eyewear',
    slug: 'eyewear',
    count: 4,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=600&fit=crop&crop=center',
    description: 'See the world through a lens of luxury',
  },
  {
    name: 'New Arrivals',
    slug: 'new-arrivals',
    count: 8,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop&crop=center',
    description: 'Fresh from the atelier — discover our latest pieces',
  },
  {
    name: 'Sale',
    slug: 'sale',
    count: 6,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop&crop=center',
    description: 'Timeless luxury at exceptional value',
  },
];

const BG_GRADIENTS: Record<string, string> = {
  women: 'from-rose-100/80 to-amber-100/80',
  men: 'from-slate-200/80 to-stone-200/80',
  accessories: 'from-amber-100/80 to-yellow-100/80',
  eyewear: 'from-sky-100/80 to-indigo-100/80',
  'new-arrivals': 'from-emerald-100/80 to-teal-100/80',
  sale: 'from-rose-200/80 to-orange-200/80',
};

const PLACEHOLDER_INITIALS: Record<string, string> = {
  women: 'W',
  men: 'M',
  accessories: 'A',
  eyewear: 'E',
  'new-arrivals': 'N',
  sale: 'S',
};

const CollectionCard = ({ collection, index }: { collection: Collection; index: number }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const reveal = useRevealOnScroll<HTMLAnchorElement>({ threshold: 0.1 });
  const linkTo =
    collection.slug === 'new-arrivals'
      ? '/new-arrivals'
      : collection.slug === 'sale'
        ? '/sale'
        : `/category/${collection.slug}`;

  return (
    <Link
      to={linkTo}
      ref={reveal.ref}
      className={`group relative overflow-hidden h-[300px] md:h-[380px] cursor-pointer reveal-element ${reveal.isVisible ? 'revealed' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      {imgFailed ? (
        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${BG_GRADIENTS[collection.slug] || 'from-stone-200/80 to-stone-100/80'}`}>
          <span className="font-serif text-7xl md:text-9xl text-dark/10 select-none">
            {PLACEHOLDER_INITIALS[collection.slug] || collection.name.charAt(0)}
          </span>
        </div>
      ) : (
        <img
          src={collection.image}
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-500" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
        <span className="text-[10px] font-sans tracking-widest-xl uppercase text-white/50 block mb-1">
          {collection.count} pieces
        </span>
        <h2 className="font-serif text-2xl lg:text-3xl text-white italic mb-2 group-hover:translate-x-1 transition-transform duration-300">
          {collection.name}
        </h2>
        <p className="text-xs text-white/40 font-sans max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {collection.description}
        </p>
      </div>

      {/* Arrow */}
      <div className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:border-white/50">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};

const CollectionsPage = () => {
  const heroReveal = useRevealOnScroll<HTMLElement>({ threshold: 0.1 });

  return (
    <div className="min-h-screen bg-[#f9f8f5]">
      <Helmet>
        <title>Collections — NASSEG</title>
        <meta name="description" content="Explore curated selections across every category at NASSEG." />
      </Helmet>
      <Header backLabel="Back to Home" backTo="/" />

      {/* Hero */}
      <section
        ref={heroReveal.ref}
        className={`py-16 md:py-24 text-center reveal-element ${heroReveal.isVisible ? 'revealed' : ''}`}
      >
        <span className="text-[11px] font-sans tracking-widest-2xl uppercase text-gold block mb-4">
          Browse All
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-dark italic mb-4">
          Our Collections
        </h1>
        <p className="text-sm md:text-base text-muted font-sans max-w-md mx-auto">
          Explore curated selections across every category.
        </p>
      </section>

      {/* Collections Grid */}
      <div className="max-w-8xl mx-auto px-5 lg:px-12 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {collections.map((collection, index) => (
            <CollectionCard key={collection.slug} collection={collection} index={index} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CollectionsPage;
