import { Link } from 'react-router-dom';
import { IoCloseOutline, IoAddOutline, IoRemoveOutline, IoTrashOutline } from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cart-backdrop-enter"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute top-0 right-0 w-full max-w-[420px] h-full bg-[#f9f8f5] shadow-2xl flex flex-col cart-drawer-slide">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-light">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl text-dark italic">Your Bag</h2>
            <span className="text-xs font-sans text-muted">({cartCount} item{cartCount !== 1 ? 's' : ''})</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-dark hover:text-gold transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <IoCloseOutline className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="font-serif text-lg text-dark italic mb-2">Your bag is empty</p>
              <p className="text-sm font-sans text-muted mb-6">Discover our latest collections</p>
              <Link
                to="/collections"
                onClick={() => setIsCartOpen(false)}
                className="text-[11px] font-sans tracking-widest-xl uppercase text-dark border border-dark px-6 py-3 hover:bg-dark hover:text-white transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 pb-5 border-b border-border-light/50 last:border-0"
                >
                  {/* Image */}
                  <div className="w-[80px] h-[100px] flex-shrink-0 bg-[#eae7e0] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-serif text-sm text-dark truncate">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="p-0.5 text-muted hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <IoTrashOutline className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-sans text-muted mb-3">
                      <span>Size: {item.size}</span>
                      <span>·</span>
                      <span>{item.color}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border border-border-light">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-dark hover:text-gold transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <IoRemoveOutline className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-xs font-sans font-medium text-dark border-x border-border-light">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-dark hover:text-gold transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <IoAddOutline className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-serif text-sm font-medium text-dark">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — Order Summary */}
        {items.length > 0 && (
          <div className="border-t border-border-light px-6 py-5">
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-sans text-muted">Subtotal</span>
                <span className="text-sm font-serif font-medium text-dark">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-sans text-muted">Shipping</span>
                <span className="text-sm font-sans text-gold">
                  {formatPrice(15)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border-light">
                <span className="text-sm font-sans font-medium text-dark">Total</span>
                <span className="font-serif text-lg font-medium text-dark">
                  {formatPrice(cartTotal + 15)}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full text-center bg-dark text-white text-[11px] font-sans tracking-widest-xl uppercase py-4 hover:bg-neutral-800 transition-all duration-300 cursor-pointer active:scale-[0.98] mb-3"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={() => setIsCartOpen(false)}
              className="block w-full text-center text-[11px] font-sans tracking-widest-xl uppercase text-dark py-2 hover:text-gold transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
