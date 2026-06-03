import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoYoutube,
} from 'react-icons/io5';

interface FooterLink {
  label: string;
  to: string;
}

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const shopLinks: FooterLink[] = [
    { label: 'New Arrivals', to: '/new-arrivals' },
    { label: 'Women', to: '/category/women' },
    { label: 'Men', to: '/category/men' },
    { label: 'Accessories', to: '/category/accessories' },
    { label: 'Sale', to: '/sale' },
  ];
  const helpLinks: FooterLink[] = [
    { label: 'Sizing Guide', to: '/sizing-guide' },
    { label: 'Shipping & Returns', to: '/shipping-returns' },
    { label: 'Order Tracking', to: '/order-tracking' },
    { label: 'FAQs', to: '/faqs' },
    { label: 'Contact Us', to: '/contact-us' },
  ];
  const companyLinks: FooterLink[] = [
    { label: 'About Nasseg', to: '/about' },
    { label: 'Sustainability', to: '/sustainability' },
    { label: 'Careers', to: '/info/careers' },
    { label: 'Press', to: '/info/press' },
    { label: 'Stockists', to: '/info/stockists' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer id="main-footer">
      {/* Newsletter Banner */}
      <div className="bg-dark text-white">
        <div className="max-w-8xl mx-auto px-5 lg:px-12 py-10 lg:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl lg:text-2xl text-white mb-1.5 italic">
                Stay in the know
              </h3>
              <p className="text-sm text-white/40 max-w-md">
                Subscribe for early access, exclusive offers, and style inspiration.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
              <input
                type="email"
                id="newsletter-email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/8 border border-white/15 text-white placeholder:text-white/30 text-sm px-4 py-3 w-full md:w-64 outline-none focus:border-gold transition-colors duration-300"
                required
              />
              <button
                id="subscribe-btn"
                type="submit"
                className={`text-white text-[11px] font-sans tracking-widest-xl uppercase px-6 py-3 transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  subscribed
                    ? 'bg-green-stock'
                    : 'bg-gold hover:bg-gold-hover'
                }`}
              >
                {subscribed ? '✓ Done' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-8xl mx-auto px-5 lg:px-12 py-14 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 lg:col-span-2">
              <Link to="/">
                <h2 className="font-sans text-xl tracking-[0.35em] uppercase font-medium mb-4 hover:text-gold transition-colors">
                  NASSEG
                </h2>
              </Link>
              <p className="text-sm text-white/45 leading-relaxed mb-6 max-w-xs">
                Crafting timeless elegance for the modern generation since 2023.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-white/50 hover:bg-gold hover:text-white transition-all duration-300"
                >
                  <IoLogoInstagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-white/50 hover:bg-gold hover:text-white transition-all duration-300"
                >
                  <IoLogoTwitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-white/50 hover:bg-gold hover:text-white transition-all duration-300"
                >
                  <IoLogoFacebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-white/50 hover:bg-gold hover:text-white transition-all duration-300"
                >
                  <IoLogoYoutube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h3 className="text-[11px] font-sans tracking-widest-xl uppercase mb-6 text-white/70 font-medium">
                Shop
              </h3>
              <ul className="space-y-3">
                {shopLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="text-[11px] font-sans tracking-widest-xl uppercase mb-6 text-white/70 font-medium">
                Help
              </h3>
              <ul className="space-y-3">
                {helpLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-[11px] font-sans tracking-widest-xl uppercase mb-6 text-white/70 font-medium">
                Company
              </h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/8">
          <div className="max-w-8xl mx-auto px-5 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              © 2026 Nasseg. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy-policy" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms of Service</Link>
              <Link to="/info/cookies" className="text-xs text-white/30 hover:text-white/60 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
