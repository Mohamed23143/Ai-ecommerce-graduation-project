import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoMenuOutline, IoCloseOutline, IoBagHandleOutline, IoSearchOutline, IoPersonOutline } from 'react-icons/io5';
import { Show, useUser } from '@clerk/react';
import { useCart } from '../../context/CartContext';

const HomeHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, setIsCartOpen, setIsSearchOpen } = useCart();
  const { user } = useUser();
  const userAvatar = user?.imageUrl;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        id="home-header"
        className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'bg-[#f9f8f5]/95 backdrop-blur-md border-b border-border-light/50 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-8xl mx-auto px-5 lg:px-12 h-[72px] flex items-center justify-between">
          {/* Left: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/new-arrivals"
              className={`text-[11px] font-sans tracking-widest-xl uppercase transition-colors duration-300 relative group ${
                scrolled ? 'text-dark hover:text-gold' : 'text-white/80 hover:text-white'
              }`}
            >
              New In
              <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${scrolled ? 'bg-gold' : 'bg-white'}`} />
            </Link>
            <Link
              to="/category/women"
              className={`text-[11px] font-sans tracking-widest-xl uppercase transition-colors duration-300 relative group ${
                scrolled ? 'text-dark hover:text-gold' : 'text-white/80 hover:text-white'
              }`}
            >
              Women
              <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${scrolled ? 'bg-gold' : 'bg-white'}`} />
            </Link>
            <Link
              to="/category/men"
              className={`text-[11px] font-sans tracking-widest-xl uppercase transition-colors duration-300 relative group ${
                scrolled ? 'text-dark hover:text-gold' : 'text-white/80 hover:text-white'
              }`}
            >
              Men
              <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${scrolled ? 'bg-gold' : 'bg-white'}`} />
            </Link>
            <Link
              to="/category/accessories"
              className={`text-[11px] font-sans tracking-widest-xl uppercase transition-colors duration-300 relative group ${
                scrolled ? 'text-dark hover:text-gold' : 'text-white/80 hover:text-white'
              }`}
            >
              Accessories
              <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${scrolled ? 'bg-gold' : 'bg-white'}`} />
            </Link>
          </nav>

          {/* Mobile: Menu Button */}
          <button
            id="home-mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            className={`md:hidden p-1 transition-colors cursor-pointer ${
              scrolled ? 'text-dark hover:text-gold' : 'text-white hover:text-white/70'
            }`}
            aria-label="Open menu"
          >
            <IoMenuOutline className="w-6 h-6" />
          </button>

          {/* Center: Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
            <img 
              src="/favicon-transparent.png?v=2" 
              alt="NASSEG Logo" 
              className={`w-9 h-9 md:w-11 md:h-11 object-contain transition-all duration-500 ${
                !scrolled ? 'brightness-0 invert' : ''
              }`}
            />
            <h1
              className={`font-sans text-[24px] tracking-[0.4em] uppercase font-medium transition-colors duration-500 ${
                scrolled ? 'text-dark' : 'text-white'
              }`}
            >
              NASSEG
            </h1>
          </Link>

          {/* Right: Icons */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-1 transition-colors cursor-pointer hidden md:block ${
                scrolled ? 'text-dark hover:text-gold' : 'text-white/80 hover:text-white'
              }`}
              aria-label="Search"
            >
              <IoSearchOutline className="w-[18px] h-[18px]" />
            </button>
            <Show when="signed-in">
              <Link
                to="/account"
                className={`p-1 transition-colors hidden md:flex items-center ${
                  scrolled ? 'text-dark hover:text-gold' : 'text-white/80 hover:text-white'
                }`}
                aria-label="Account"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt="Account" className="w-[24px] h-[24px] rounded-full object-cover border border-white/30 hover:border-gold transition-all duration-300" />
                ) : (
                  <IoPersonOutline className="w-[18px] h-[18px]" />
                )}
              </Link>
            </Show>
            <Show when="signed-out">
              <Link
                to="/auth"
                className={`p-1 transition-colors hidden md:block ${
                  scrolled ? 'text-dark hover:text-gold' : 'text-white/80 hover:text-white'
                }`}
                aria-label="Account"
              >
                <IoPersonOutline className="w-[18px] h-[18px]" />
              </Link>
            </Show>
            <button
              onClick={() => setIsCartOpen(true)}
              className={`p-1 transition-colors cursor-pointer relative ${
                scrolled ? 'text-dark hover:text-gold' : 'text-white/80 hover:text-white'
              }`}
              aria-label="Cart"
            >
              <IoBagHandleOutline className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-white text-[9px] font-sans font-semibold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile icons */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-1 transition-colors cursor-pointer md:hidden ${
                scrolled ? 'text-dark hover:text-gold' : 'text-white/80 hover:text-white'
              }`}
              aria-label="Search"
            >
              <IoSearchOutline className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] mobile-menu-overlay" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-0 left-0 w-[300px] h-full bg-[#f9f8f5] shadow-2xl p-8 flex flex-col home-mobile-slide-in"
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
              <Link to="/new-arrivals" onClick={() => setMobileOpen(false)} className="text-sm font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors">New In</Link>
              <Link to="/category/women" onClick={() => setMobileOpen(false)} className="text-sm font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors">Women</Link>
              <Link to="/category/men" onClick={() => setMobileOpen(false)} className="text-sm font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors">Men</Link>
              <Link to="/category/accessories" onClick={() => setMobileOpen(false)} className="text-sm font-sans tracking-widest-xl uppercase text-dark hover:text-gold transition-colors">Accessories</Link>
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

            <div className="mt-auto pt-8 border-t border-border-light flex items-center gap-6">
              <button onClick={() => { setMobileOpen(false); setIsSearchOpen(true); }} className="text-dark hover:text-gold transition-colors cursor-pointer" aria-label="Search">
                <IoSearchOutline className="w-5 h-5" />
              </button>
              <Show when="signed-in">
                <Link to="/account" onClick={() => setMobileOpen(false)} className="text-dark hover:text-gold transition-colors" aria-label="Account">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Account" className="w-5 h-5 rounded-full object-cover border border-border-light" />
                  ) : (
                    <IoPersonOutline className="w-5 h-5" />
                  )}
                </Link>
              </Show>
              <Show when="signed-out">
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="text-dark hover:text-gold transition-colors" aria-label="Account">
                  <IoPersonOutline className="w-5 h-5" />
                </Link>
              </Show>
              <button onClick={() => { setMobileOpen(false); setIsCartOpen(true); }} className="text-dark hover:text-gold transition-colors relative cursor-pointer" aria-label="Cart">
                <IoBagHandleOutline className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-white text-[9px] font-sans font-semibold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeHeader;
