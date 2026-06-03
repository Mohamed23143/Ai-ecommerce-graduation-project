import { Link } from 'react-router-dom';
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
    image: '/catagore/Woman_walking_luxury_boutique_202606030746.jpeg',
    description: 'Timeless elegance redefined for the modern woman',
  },
  {
    name: "Men's",
    slug: 'men',
    count: 4,
    image: '/catagore/Man_in_suit_in_boutique_202606030746.jpeg',
    description: 'Refined sophistication for the contemporary gentleman',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    count: 4,
    image: '/catagore/Luxury_accessories_flat-lay_crea__202606030746.jpeg',
    description: 'The finishing touches that complete every look',
  },
  {
    name: 'Eyewear',
    slug: 'eyewear',
    count: 4,
    image: '/catagore/Luxury_sunglasses_eyeglasses_cre__202606030746.jpeg',
    description: 'See the world through a lens of luxury',
  },
  {
    name: 'New Arrivals',
    slug: 'new-arrivals',
    count: 8,
    image: '/catagore/Elegant_fabrics_flowing_golden_l__202606030746.jpeg',
    description: 'Fresh from the atelier — discover our latest pieces',
  },
  {
    name: 'Sale',
    slug: 'sale',
    count: 6,
    image: '/catagore/Elegant_fashion_still_life_luxury_202606030746.jpeg',
    description: 'Timeless luxury at exceptional value',
  },
];

const CollectionCard = ({ collection, index }: { collection: Collection; index: number }) => {
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
      <img
        src={collection.image}
        alt={collection.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
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
