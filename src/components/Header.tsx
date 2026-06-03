import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Show, useUser, UserButton } from '@clerk/react';
import { IoArrowBack, IoMenuOutline, IoCloseOutline, IoBagHandleOutline, IoSearchOutline, IoPersonOutline } from 'react-icons/io5';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  backLabel?: string;
  backTo?: string;
  overlay?: boolean;
}

const Header = ({ backLabel = 'Back to Collection', backTo = '/', overlay = false }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const { user } = useUser();
  const userAvatar = user?.imageUrl;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = overlay && !scrolled;
  const textColor = isTransparent ? 'text-white' : 'text-dark';
  const textHover = isTransparent ? 'hover:text-white/80' : 'hover:text-gold';
  const iconColor = isTransparent ? 'text-white hover:text-white/80' : 'text-dark hover:text-gold';

  return (
    <>
      <header 
        id="main-header" 
        className={`sticky left-0 right-0 w-full top-0 z-[100] transition-all duration-300 ${
          isTransparent 
            ? 'bg-transparent border-transparent' 
            : 'bg-[#f9f8f5]/95 backdrop-blur-md border-b border-border-light/50 shadow-sm'
        }`}
      >
        <div className="max-w-8xl mx-auto px-5 lg:px-12 h-[64px] flex items-center justify-between">
          {/* Left: Back Link */}
          <Link
            to={backTo}
            id="back-to-collection"
            className={`hidden md:flex items-center gap-2 text-[11px] font-sans tracking-widest-xl uppercase transition-colors duration-300 group ${textColor} ${textHover}`}
          >
            <IoArrowBack className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-300" />
            {backLabel}
          </Link>

          {/* Mobile: Menu Button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            className={`md:hidden p-1 transition-colors cursor-pointer ${iconColor}`}
            aria-label="Open menu"
          >
            <IoMenuOutline className="w-6 h-6" />
          </button>

          {/* Center: Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
            <img 
              src="/favicon-transparent.png?v=2" 
              alt="NASSEG Logo" 
              className={`w-9 h-9 object-contain transition-all duration-300 ${
                isTransparent ? 'brightness-0 invert' : ''
              }`}
            />
            <h1 className={`font-sans text-[22px] tracking-[0.35em] uppercase font-medium transition-colors duration-300 ${textColor}`}>
              NASSEG
            </h1>
          </Link>

          {/* Right: Desktop Icons + Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/collections" className={`text-[11px] font-sans tracking-widest-xl uppercase transition-colors duration-300 ${textColor} ${textHover}`}>Collections</Link>
            <button onClick={() => setIsSearchOpen(true)} className={`p-1 transition-colors cursor-pointer ${iconColor}`} aria-label="Search">
              <IoSearchOutline className="w-[18px] h-[18px]" />
            </button>
            <Show when="signed-in">
              <Link to="/account" className={`p-1 transition-colors ${iconColor}`} aria-label="Account">
                {userAvatar ? (
                  <img src={userAvatar} alt="Account" className={`w-[22px] h-[22px] rounded-full object-cover border transition-all duration-300 ${isTransparent ? 'border-white/50 hover:border-white' : 'border-border-light hover:border-gold'}`} />
                ) : (
                  <IoPersonOutline className="w-[18px] h-[18px]" />
                )}
              </Link>
            </Show>
            <Show when="signed-out">
              <Link to="/auth" className={`p-1 transition-colors ${iconColor}`} aria-label="Account">
                <IoPersonOutline className="w-[18px] h-[18px]" />
              </Link>
            </Show>
            <button onClick={() => setIsCartOpen(true)} className={`p-1 transition-colors cursor-pointer relative ${iconColor}`} aria-label="Cart">
              <IoBagHandleOutline className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-white text-[9px] font-sans font-semibold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Right: Mobile Icons */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={() => setIsSearchOpen(true)} className={`p-1 transition-colors cursor-pointer ${iconColor}`} aria-label="Search">
              <IoSearchOutline className="w-5 h-5" />
            </button>
            <button onClick={() => setIsCartOpen(true)} className={`p-1 transition-colors cursor-pointer relative ${iconColor}`} aria-label="Cart">
              <IoBagHandleOutline className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-white text-[9px] font-sans font-semibold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] mobile-menu-overlay" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-0 left-0 w-[280px] h-full bg-[#f9f8f5] shadow-2xl p-8 flex flex-col home-mobile-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="self-end mb-8 text-dark hover:text-gold transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>

            <Link to="/" className="block mb-10" onClick={() => setMobileOpen(false)}>
              <h2 className="font-sans text-lg tracking-[0.3em] uppercase font-medium text-dark">
                NASSEG
              </h2>
            </Link>

            <nav className="flex flex-col gap-6">
              <Link to="/collections" onClick={() => setMobileOpen(false)} className="text-sm font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors">Collections</Link>
              <Link to="/category/women" onClick={() => setMobileOpen(false)} className="text-sm font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors">Women</Link>
              <Link to="/category/men" onClick={() => setMobileOpen(false)} className="text-sm font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors">Men</Link>
              <Link to="/category/accessories" onClick={() => setMobileOpen(false)} className="text-sm font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors">Accessories</Link>
              <Link to="/new-arrivals" onClick={() => setMobileOpen(false)} className="text-sm font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors">New Arrivals</Link>
              <Link to="/sale" onClick={() => setMobileOpen(false)} className="text-sm font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors">Sale</Link>
              <Show when="signed-in">
                <Link to="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Account" className="w-6 h-6 rounded-full object-cover border border-border-light" />
                  ) : (
                    <IoPersonOutline className="w-5 h-5" />
                  )}
                  Account
                </Link>
              </Show>
              <Show when="signed-out">
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="text-sm font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors">Account</Link>
              </Show>
            </nav>

            <div className="mt-auto pt-8 border-t border-border-light">
              <Link to={backTo} onClick={() => setMobileOpen(false)} className="text-xs font-sans text-muted hover:text-dark transition-colors flex items-center gap-2">
                <IoArrowBack className="w-3.5 h-3.5" />
                {backLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
