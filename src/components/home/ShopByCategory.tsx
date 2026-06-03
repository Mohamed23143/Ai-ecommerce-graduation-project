import { Link } from 'react-router-dom';

interface Category {
  name: string;
  image: string;
  span?: string;
}

const categories: Category[] = [
  {
    name: "Women's",
    image: '/catagore/Woman_walking_luxury_boutique_202606030746.jpeg',
  },
  {
    name: "Men's",
    image: '/catagore/Man_in_suit_in_boutique_202606030746.jpeg',
  },
  {
    name: 'Accessories',
    image: '/catagore/Luxury_accessories_flat-lay_crea__202606030746.jpeg',
  },
  {
    name: 'Eyewear',
    image: '/catagore/Luxury_sunglasses_eyeglasses_cre__202606030746.jpeg',
  },
];

const ShopByCategory = () => {
  return (
    <section id="shop-by-category" className="py-16 lg:py-20 bg-white">
      <div className="max-w-8xl mx-auto px-5 lg:px-12">
        {/* Title */}
        <h2 className="font-serif text-3xl lg:text-[42px] text-dark text-center mb-10 lg:mb-14">
          Shop by Category
        </h2>

        {/* Category Grid - 2x2 layout matching Figma */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {/* Women's - tall left */}
          <Link
            to="/category/women"
            className="group relative overflow-hidden h-[350px] md:h-[500px] cursor-pointer"
          >
            <img
              src={categories[0].image}
              alt={categories[0].name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 lg:p-8">
              <span className="text-[11px] font-sans tracking-widest-xl uppercase text-white/60 block mb-1">
                Collection
              </span>
              <h3 className="font-serif text-2xl lg:text-3xl text-white italic">
                {categories[0].name}
              </h3>
            </div>
            <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Men's - tall right */}
          <Link
            to="/category/men"
            className="group relative overflow-hidden h-[350px] md:h-[500px] cursor-pointer"
          >
            <img
              src={categories[1].image}
              alt={categories[1].name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 lg:p-8">
              <span className="text-[11px] font-sans tracking-widest-xl uppercase text-white/60 block mb-1">
                Collection
              </span>
              <h3 className="font-serif text-2xl lg:text-3xl text-white italic">
                {categories[1].name}
              </h3>
            </div>
            <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Accessories - wide bottom left */}
          <Link
            to="/category/accessories"
            className="group relative overflow-hidden h-[280px] md:h-[350px] cursor-pointer"
          >
            <img
              src={categories[2].image}
              alt={categories[2].name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 lg:p-8">
              <span className="text-[11px] font-sans tracking-widest-xl uppercase text-white/60 block mb-1">
                Collection
              </span>
              <h3 className="font-serif text-2xl lg:text-3xl text-white italic">
                {categories[2].name}
              </h3>
            </div>
            <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Eyewear - wide bottom right */}
          <Link
            to="/category/eyewear"
            className="group relative overflow-hidden h-[280px] md:h-[350px] cursor-pointer"
          >
            <img
              src={categories[3].image}
              alt={categories[3].name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 lg:p-8">
              <span className="text-[11px] font-sans tracking-widest-xl uppercase text-white/60 block mb-1">
                Collection
              </span>
              <h3 className="font-serif text-2xl lg:text-3xl text-white italic">
                {categories[3].name}
              </h3>
            </div>
            <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
