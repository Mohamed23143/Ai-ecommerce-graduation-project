import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';

const HeroSection = () => {
  return (
    <section id="hero-section" className="relative w-full h-screen min-h-[650px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 hero-parallax">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop&crop=center"
          alt="New Collection"
          className="w-full h-full object-cover hero-bg-animate"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-8xl mx-auto px-5 lg:px-12 h-full flex flex-col justify-center">
        <div className="max-w-xl">
          {/* Badge */}
          <ScrollReveal variant="fade-up" delay={0.1}>
            <span className="inline-block text-[11px] font-sans tracking-widest-2xl uppercase text-white/70 mb-4">
              Outerwear · Happy Days
            </span>
          </ScrollReveal>

          {/* Main Title */}
          <ScrollReveal variant="fade-up" delay={0.2}>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[80px] text-white leading-[1.05] mb-6 italic">
              New<br />
              Collection
            </h1>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal variant="fade-up" delay={0.3}>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-8 max-w-md font-sans">
              Timeless silhouettes meet contemporary design. Discover our latest outerwear
              for the modern individual.
            </p>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal variant="fade-up" delay={0.4}>
            <div className="flex items-center gap-4">
              <Link
                to="/new-arrivals"
                id="hero-shop-now"
                className="border border-white text-white text-[11px] font-sans tracking-widest-xl uppercase py-3.5 px-8 hover:bg-white hover:text-dark transition-all duration-400 cursor-pointer"
              >
                Shop Now
              </Link>
              <a
                href="#trending"
                id="hero-explore"
                className="bg-white text-dark text-[11px] font-sans tracking-widest-xl uppercase py-3.5 px-8 hover:bg-gold hover:text-white transition-all duration-400 cursor-pointer shimmer-hover"
              >
                Explore
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Scrolling Marquee at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm py-3 overflow-hidden">
        <div className="marquee-container flex whitespace-nowrap">
          <div className="marquee-content animate-marquee flex">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="text-[11px] font-sans tracking-[0.3em] uppercase text-white/50 mx-8">
                Free Shipping Over $200 &nbsp;·&nbsp; New Arrivals Weekly &nbsp;·&nbsp; Authenticity Guaranteed &nbsp;·&nbsp; Free Returns Within 30 Days &nbsp;·&nbsp; Crafted With Care &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
