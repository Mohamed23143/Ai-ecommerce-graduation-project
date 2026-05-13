import { useState } from 'react';
import { IoStar, IoStarHalf, IoHeartOutline, IoHeart } from 'react-icons/io5';
import { LuTruck, LuRotateCcw, LuShieldCheck } from 'react-icons/lu';
import { formatPrice, type Product } from '../data/products';
import Accordion from './Accordion';
import { useCart } from '../context/CartContext';

const colors = [
  { name: 'Camel', hex: '#c4a265' },
  { name: 'Ivory', hex: '#e8e0d4' },
  { name: 'Charcoal', hex: '#3a3a3a' },
];

const sizes = [
  { label: 'XS', available: false },
  { label: 'S', available: true },
  { label: 'M', available: true },
  { label: 'L', available: true },
  { label: 'XL', available: true },
];

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(2); // M selected by default
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoStar key={`full-${i}`} className="w-4 h-4 text-gold" />);
    }
    if (hasHalf) {
      stars.push(<IoStarHalf key="half" className="w-4 h-4 text-gold" />);
    }
    return stars;
  };

  const handleAddToBag = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: sizes[selectedSize].label,
      color: colors[selectedColor].name,
    });
    setAddedToBag(true);
    setTimeout(() => {
      setAddedToBag(false);
      setIsCartOpen(true);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-0 fade-in-up">
      {/* Breadcrumb */}
      <nav id="breadcrumb" className="flex items-center gap-2 text-xs font-sans text-muted mb-4">
        <a href="#" className="hover:text-dark transition-colors">Home</a>
        <span className="text-muted-light">/</span>
        <a href="#" className="hover:text-dark transition-colors">Collections</a>
        <span className="text-muted-light">/</span>
        <span className="text-dark font-medium">Outerwear</span>
      </nav>

      {/* Category */}
      <span className="text-[11px] font-sans tracking-widest-xl uppercase text-muted mb-3">
        {product.category} · SS26
      </span>

      {/* Title */}
      <h1 id="product-title" className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-dark leading-[1.15] mb-5">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-5 pb-5 border-b border-border-light">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">{renderStars(4.7)}</div>
          <span className="text-sm font-sans font-semibold text-dark">4.7</span>
          <span className="text-sm font-sans text-muted">(128 reviews)</span>
        </div>
        <a
          href="#reviews"
          id="read-reviews-link"
          className="text-sm font-sans text-dark underline underline-offset-2 hover:text-gold transition-colors"
        >
          Read reviews
        </a>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-serif text-[28px] text-dark font-medium">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <>
            <span className="text-base font-sans text-muted line-through">{formatPrice(product.originalPrice)}</span>
            <span className="text-[11px] font-sans tracking-wider uppercase text-gold font-semibold bg-gold/10 px-2.5 py-1 rounded">
              Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-sm font-sans text-dark/65 leading-[1.8] mb-8">
        A refined double-faced Mongolian cashmere overcoat with notched lapels and a
        self-tie belt. Lined in pure mulberry silk for effortless drape. Crafted in Italy.
      </p>

      {/* Color Selector */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-sans tracking-widest-xl uppercase">
            Colour: <span className="font-medium normal-case tracking-normal text-sm">{colors[selectedColor].name}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {colors.map((color, index) => (
            <button
              key={color.name}
              id={`color-${color.name.toLowerCase()}`}
              onClick={() => setSelectedColor(index)}
              className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-200 border ${
                selectedColor === index
                  ? 'ring-2 ring-offset-2 ring-dark border-transparent'
                  : 'border-border-light hover:ring-2 hover:ring-offset-2 hover:ring-muted/50'
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={`Select ${color.name}`}
            />
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-sans tracking-widest-xl uppercase font-medium">
            Size
          </span>
          <a
            href="#"
            id="size-guide-link"
            className="text-sm font-sans text-dark underline underline-offset-2 hover:text-gold transition-colors"
          >
            Size Guide
          </a>
        </div>
        <div className="flex items-center gap-2">
          {sizes.map((size, index) => (
            <button
              key={size.label}
              id={`size-${size.label.toLowerCase()}`}
              onClick={() => size.available && setSelectedSize(index)}
              className={`w-[60px] h-12 border flex items-center justify-center text-sm font-sans cursor-pointer transition-all duration-200 ${
                !size.available
                  ? 'border-border-light opacity-35 cursor-not-allowed line-through text-muted'
                  : selectedSize === index
                  ? 'border-dark bg-dark text-white'
                  : 'border-border-light hover:border-dark text-dark'
              }`}
              disabled={!size.available}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Indicator */}
      <div className="bg-gold/8 rounded-md px-4 py-3 mb-6 flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-gold pulse-glow flex-shrink-0" />
        <span className="text-sm font-sans text-dark/75">
          Only <strong className="font-semibold text-dark">3 items</strong> left in stock
        </span>
      </div>

      {/* Add to Bag + Wishlist */}
      <div className="flex gap-3 mb-8">
        <button
          id="add-to-bag"
          onClick={handleAddToBag}
          className={`btn-primary flex-1 text-center transition-all duration-300 ${
            addedToBag ? 'bg-green-stock !tracking-wider' : ''
          }`}
        >
          {addedToBag ? '✓ Added to Bag' : 'Add to Bag'}
        </button>
        <button
          id="wishlist-btn"
          onClick={() => setWishlisted(!wishlisted)}
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
            Complimentary <strong className="text-dark font-medium">shipping</strong> on orders over $200
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
        <Accordion title="Product Details" defaultOpen>
          <p>
            The Belted Cashmere Overcoat is a masterpiece of tailoring — a silhouette that
            moves with the body while maintaining a structured, polished edge. Cut from
            100% double-faced Mongolian cashmere, this coat features notched lapels, a self-
            tie belt, and oversized patch pockets. The clean lines and precision stitching
            reflect our commitment to enduring craftsmanship.
          </p>
        </Accordion>

        <Accordion title="Materials & Composition">
          <ul className="list-none space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Outer: 100% double-faced Mongolian cashmere</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Lining: 100% mulberry silk</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Buttons: Natural corozo nut</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Belt: Self-fabric with covered buckle</span>
            </li>
          </ul>
        </Accordion>

        <Accordion title="Care Instructions">
          <ul className="list-none space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Professional dry clean only</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Do not bleach, tumble dry, or iron directly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Store on a padded hanger to maintain shape</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Use a cashmere brush to remove pilling</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Air between wears to refresh</span>
            </li>
          </ul>
        </Accordion>

        <Accordion title="Shipping & Returns">
          <ul className="list-none space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
              <span>Complimentary express shipping on orders over $200</span>
            </li>
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
