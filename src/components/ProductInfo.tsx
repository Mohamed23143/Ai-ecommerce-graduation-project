import { useState } from 'react';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { LuTruck, LuRotateCcw, LuShieldCheck } from 'react-icons/lu';
import { formatPrice } from '../data/products';
import type { BackendProduct } from '../services/api';
import Accordion from './Accordion';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const COLOR_HEX: Record<string, string> = {
  black: '#000000', white: '#ffffff', ivory: '#e8e0d4', cream: '#f9f8f5',
  camel: '#c4a265', charcoal: '#3a3a3a', navy: '#000080', gray: '#808080',
  grey: '#808080', beige: '#f5f5dc', taupe: '#483c32', brown: '#8B4513',
  olive: '#556b2f', burgundy: '#800020', gold: '#c4a265', silver: '#c0c0c0',
  red: '#cc3333', blue: '#336699', green: '#4a7c59', pink: '#d4a0a0',
};

function getColorHex(name: string): string {
  return COLOR_HEX[name.toLowerCase().trim()] || '#cccccc';
}

interface ProductInfoProps {
  product: BackendProduct;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const colors = product.colors || [];
  const sizes = product.sizes || [];
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    sizes.length > 0 ? Math.floor(sizes.length / 2) : -1
  );
  const { isFavorite, toggleFavorite } = useFavorites();
  const wishlisted = isFavorite(product.id);
  const [addedToBag, setAddedToBag] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();

  const handleAddToBag = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: sizes[selectedSize] || '',
      color: colors[selectedColor] || '',
    });
    setAddedToBag(true);
    setTimeout(() => {
      setAddedToBag(false);
      setIsCartOpen(true);
    }, 800);
  };

  const inStock = product.stock_quantity > 0;
  const lowStock = inStock && product.stock_quantity <= 5;

  return (
    <div className="flex flex-col gap-0 fade-in-up">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-sans text-muted mb-4">
        <a href="/" className="hover:text-dark transition-colors">Home</a>
        <span className="text-muted-light">/</span>
        <a href={`/category/${product.category}`} className="hover:text-dark transition-colors capitalize">
          {product.category}
        </a>
        <span className="text-muted-light">/</span>
        <span className="text-dark font-medium truncate max-w-[180px]">{product.name}</span>
      </nav>

      {/* Category */}
      <span className="text-[11px] font-sans tracking-widest-xl uppercase text-muted mb-3">
        {product.category}
      </span>

      {/* Title */}
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-dark leading-[1.15] mb-5">
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-8">
        <span className="font-serif text-[28px] text-dark font-medium">{formatPrice(product.price)}</span>
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-sm font-sans text-dark/65 leading-[1.8] mb-8">
          {product.description}
        </p>
      )}

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-sans tracking-widest-xl uppercase">
              Colour: <span className="font-medium normal-case tracking-normal text-sm">{colors[selectedColor]}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {colors.map((color, index) => (
              <button
                key={color}
                onClick={() => setSelectedColor(index)}
                className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-200 border ${
                  selectedColor === index
                    ? 'ring-2 ring-offset-2 ring-dark border-transparent'
                    : 'border-border-light hover:ring-2 hover:ring-offset-2 hover:ring-muted/50'
                }`}
                style={{ backgroundColor: getColorHex(color) }}
                aria-label={`Select ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-sans tracking-widest-xl uppercase font-medium">Size</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {sizes.map((size, index) => (
              <button
                key={size}
                onClick={() => setSelectedSize(index)}
                className={`min-w-[60px] h-12 border flex items-center justify-center text-sm font-sans cursor-pointer transition-all duration-200 ${
                  selectedSize === index
                    ? 'border-dark bg-dark text-white'
                    : 'border-border-light hover:border-dark text-dark'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Indicator */}
      {inStock && lowStock && (
        <div className="bg-gold/8 rounded-md px-4 py-3 mb-6 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-gold pulse-glow flex-shrink-0" />
          <span className="text-sm font-sans text-dark/75">
            Only <strong className="font-semibold text-dark">{product.stock_quantity} items</strong> left in stock
          </span>
        </div>
      )}
      {!inStock && (
        <div className="bg-red-50 rounded-md px-4 py-3 mb-6 flex items-center gap-2.5">
          <span className="text-sm font-sans text-red-600">Out of stock</span>
        </div>
      )}

      {/* Add to Bag + Wishlist */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleAddToBag}
          disabled={!inStock}
          className={`btn-primary flex-1 text-center transition-all duration-300 ${
            addedToBag ? 'bg-green-stock !tracking-wider' : ''
          } ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {addedToBag ? '✓ Added to Bag' : inStock ? 'Add to Bag' : 'Sold Out'}
        </button>
        <button
          onClick={() => toggleFavorite(product.id)}
          className={`btn-wishlist w-14 flex-shrink-0 ${wishlisted ? 'border-red-400 bg-red-50' : ''}`}
          aria-label="Add to wishlist"
        >
          {wishlisted ? (
            <IoHeart className="w-5 h-5 text-red-500" />
          ) : (
            <IoHeartOutline className="w-5 h-5 text-dark" />
          )}
        </button>
      </div>

      {/* Trust Badges */}
      <div className="bg-[#f5f3ef] rounded-lg p-5 mb-8 space-y-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
            <LuTruck className="w-4 h-4 text-gold" />
          </div>
          <span className="text-sm font-sans text-dark/75">
            Standard <strong className="text-dark font-medium">shipping</strong> available
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
            <LuRotateCcw className="w-4 h-4 text-gold" />
          </div>
          <span className="text-sm font-sans text-dark/75">
            Free returns within <strong className="text-dark font-medium">30 days</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
            <LuShieldCheck className="w-4 h-4 text-gold" />
          </div>
          <span className="text-sm font-sans text-dark/75">
            Authenticity <strong className="text-dark font-medium">guaranteed</strong>
          </span>
        </div>
      </div>

      {/* Accordions */}
      <div className="border-b border-border-light">
        {product.description && (
          <Accordion title="Product Details" defaultOpen>
            <p>{product.description}</p>
          </Accordion>
        )}

        <Accordion title="Shipping & Returns">
          <ul className="list-none space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Standard delivery: 3–5 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Express delivery: 1–2 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Free returns within 30 days of delivery</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Items must be unworn with tags attached</span>
            </li>
          </ul>
        </Accordion>
      </div>
    </div>
  );
};

export default ProductInfo;
