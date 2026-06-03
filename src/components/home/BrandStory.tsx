import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';

const stats = [
  { value: '5+', label: 'Flagship Stores' },
  { value: '42', label: 'Countries Served' },
  { value: '100%', label: 'Authentic Materials' },
];

const BrandStory = () => {
  return (
    <section id="brand-story" className="relative bg-dark text-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        {/* Left - Content */}
        <div className="flex flex-col justify-center px-5 lg:px-16 py-14 lg:py-20">
          <ScrollReveal variant="fade-up">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-white leading-[1.15] mb-6 italic">
              Designed to last,<br />
              crafted to inspire.
            </h2>
          </ScrollReveal>
          
          <ScrollReveal variant="fade-up" delay={0.1}>
            <p className="text-sm sm:text-base text-white/45 leading-relaxed mb-10 max-w-md font-sans">
              Every Nasseg piece embodies the marriage of heritage craftsmanship
              and progressive design. Our artisans work with the world's finest materials —
              from Italian cashmere to Japanese selvedge — creating garments
              that transcend seasons and trends.
            </p>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal variant="fade-up" delay={0.2} className="flex items-center gap-8 lg:gap-12 mb-12">
            {stats.map((stat) => (
              <div key={stat.label}>
                <span className="block font-serif text-3xl lg:text-4xl text-gold mb-1">
                  {stat.value}
                </span>
                <span className="text-[10px] font-sans tracking-widest-xl uppercase text-white/40">
                  {stat.label}
                </span>
              </div>
            ))}
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.3}>
            <Link
              to="/about"
              className="w-fit inline-block bg-white text-dark text-[11px] font-sans tracking-widest-xl uppercase px-8 py-4 hover:bg-gold hover:text-white transition-all duration-300"
            >
              Learn More About Us
            </Link>
          </ScrollReveal>
        </div>

        {/* Right - Image */}
        <ScrollReveal variant="fade-left" className="relative h-[350px] lg:h-auto">
          <img
            src="/brand-image.png"
            alt="NASSEG Brand Story"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/30 to-transparent lg:block hidden" />
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BrandStory;
