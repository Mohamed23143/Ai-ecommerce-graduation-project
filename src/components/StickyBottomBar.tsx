import { useState } from 'react';
import { useCart } from '../context/CartContext';

interface StickyBottomBarProps {
  productImage: string;
  productName: string;
  price: string;
}

const StickyBottomBar = ({ productImage, productName, price }: StickyBottomBarProps) => {
  const [added, setAdded] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();

  const handleAdd = () => {
    addToCart({
      id: 17,
      name: 'Belted Cashmere Overcoat',
      price: 890,
      image: productImage,
      size: 'M',
      color: 'Camel',
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setIsCartOpen(true);
    }, 800);
  };

  return (
    <div
      id="sticky-bottom-bar"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border-light shadow-[0_-2px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-8xl mx-auto px-5 lg:px-12 h-[64px] flex items-center justify-between">
        {/* Product Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-12 overflow-hidden rounded-sm flex-shrink-0 bg-[#eae7e0]">
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-serif text-sm text-dark truncate">{productName}</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-serif font-medium text-dark">{price}</span>
              <span className="text-xs font-sans text-muted line-through hidden sm:inline">$1,150</span>
            </div>
          </div>
        </div>

        {/* Add to Bag */}
        <button
          id="sticky-add-to-bag"
          onClick={handleAdd}
          className={`text-[11px] font-sans tracking-widest-xl uppercase py-3 px-6 lg:px-8 transition-all duration-300 cursor-pointer whitespace-nowrap active:scale-[0.98] ${
            added
              ? 'bg-green-stock text-white'
              : 'bg-dark text-white hover:bg-neutral-800'
          }`}
        >
          {added ? '✓ Added' : 'Add to Bag'}
        </button>
      </div>
    </div>
  );
};

export default StickyBottomBar;
