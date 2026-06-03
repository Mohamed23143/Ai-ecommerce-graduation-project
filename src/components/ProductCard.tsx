import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, type Product } from '../data/products';
import { IoCartOutline } from 'react-icons/io5';

const PLACEHOLDER_BG = [
  'from-stone-200 to-stone-100',
  'from-amber-100 to-amber-50',
  'from-slate-200 to-slate-100',
  'from-rose-100 to-rose-50',
  'from-teal-100 to-teal-50',
];

interface ProductCardProps {
  product: Product;
  index?: number;
  layout?: 'grid' | 'list';
}

const ProductCard = ({ product, index = 0, layout = 'grid' }: ProductCardProps) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [broken, setBroken] = useState(false);
  const initial = product?.name?.charAt(0) || 'P';
  const bgClass = PLACEHOLDER_BG[(product?.id || 0) % PLACEHOLDER_BG.length];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...product,
      size: 'M', // Default size for quick add
      color: 'Natural', // Default color for quick add
    });
    setIsCartOpen(true);
  };

  if (layout === 'list') {
    return (
      <Link
        to={`/product/${product.id}`}
        className="group cursor-pointer flex gap-6 py-6 border-b border-border-light first:pt-0 last:border-0"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <div className="relative w-32 sm:w-48 aspect-[3/4] bg-[#eae7e0] overflow-hidden flex-shrink-0">
          {broken ? (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${bgClass}`}>
              <span className="font-serif text-3xl text-dark/30">{initial}</span>
            </div>
          ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={() => setBroken(true)}
          />
          )}
        </div>
        
        <div className="flex flex-col justify-center flex-1">
          <div className="flex flex-col gap-2 mb-4">
            <span className="text-[10px] font-sans tracking-widest-xl uppercase text-muted">
              {product.category}
            </span>
            <h3 className="font-serif text-lg sm:text-2xl text-dark group-hover:text-gold transition-colors duration-300">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-lg text-dark font-medium">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm font-sans text-muted line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-fit bg-dark text-white text-[10px] font-sans tracking-widest-xl uppercase px-6 py-3 flex items-center gap-2 hover:bg-gold transition-colors duration-300"
          >
            <IoCartOutline className="w-4 h-4" />
            Quick Add
          </button>
        </div>
      </Link>
    );
  }


  return (
    <Link
      to={`/product/${product.id}`}
      className="group cursor-pointer block product-card-hover"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="relative img-zoom mb-4 bg-[#eae7e0] overflow-hidden">
        {broken ? (
          <div className={`w-full h-[280px] sm:h-[340px] lg:h-[420px] flex items-center justify-center bg-gradient-to-br ${bgClass}`}>
            <span className="font-serif text-6xl text-dark/20">{initial}</span>
          </div>
        ) : (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[280px] sm:h-[340px] lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={() => setBroken(true)}
        />
        )}
        
        {/* Tag */}
        {product.tag && (
          <span className={`absolute top-3 left-3 ${product.tagColor || 'bg-dark'} text-white text-[10px] font-sans tracking-widest-xl uppercase px-3 py-1 z-10`}>
            {product.tag}
          </span>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            className="bg-white text-dark text-[10px] font-sans tracking-widest-xl uppercase px-6 py-3 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-dark hover:text-white"
          >
            <IoCartOutline className="w-4 h-4" />
            Add to Bag
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-sm sm:text-base text-dark group-hover:text-gold transition-colors duration-300 truncate">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 whitespace-nowrap">
            <span className="font-serif text-sm sm:text-base text-dark font-medium">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
        {product.originalPrice && (
          <span className="text-xs font-sans text-muted line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
