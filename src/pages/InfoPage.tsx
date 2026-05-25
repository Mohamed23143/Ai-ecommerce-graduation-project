import { useParams, Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import { infoData } from '../data/info';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { IoArrowBackOutline } from 'react-icons/io5';

const InfoPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  
  const key = slug || pathname.split('/').pop() || 'about';
  const data = infoData[key] || infoData['about'];
  const reveal = useRevealOnScroll<HTMLDivElement>({ threshold: 0.1 });

  // Simple Markdown to HTML converter
  const renderMarkdown = (content: string) => {
    return content
      .replace(/### (.*)/g, '<h3 class="text-xl font-serif italic text-dark mt-10 mb-5">$1</h3>')
      .replace(/\*\* (.*)\*\*/g, '<strong class="text-dark block mt-6">$1</strong>')
      .replace(/\*\* (.*):/g, '<strong class="text-dark">$1:</strong>')
      .replace(/- \*\*(.*)\*\*: (.*)/g, '<li class="mb-3 pl-2"><strong class="text-dark">$1:</strong> $2</li>')
      .replace(/- (.*)/g, '<li class="mb-3 pl-2">$1</li>')
      .split('\n\n').map(p => {
        if (p.trim().startsWith('<h3') || p.trim().startsWith('<li')) return p;
        return `<p class="mb-5 text-dark/70 leading-relaxed">${p}</p>`;
      }).join('');
  };

  return (
    <div className="min-h-screen bg-[#f9f8f5] flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Image & Branding (Sticky-like) */}
      <div className="hidden md:flex md:w-5/12 bg-dark relative overflow-hidden h-screen sticky top-0">
        <div className="absolute inset-0 z-10 bg-black/30" />
        <img
          src={data.image}
          alt={data.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 p-12 flex flex-col justify-between w-full h-full">
          <Link to="/" className="inline-block">
            <span className="font-sans text-xl tracking-[0.4em] uppercase font-medium text-white">
              NASSEG
            </span>
          </Link>

          <div>
            <span className="text-[11px] font-sans tracking-widest-2xl uppercase text-white/60 block mb-4">
              Information
            </span>
            <h1 className="font-serif text-5xl lg:text-6xl text-white italic leading-tight">
              {data.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Right Side: Scrollable Content */}
      <div className="flex-1 min-h-screen bg-[#f9f8f5] flex flex-col">
        {/* Mobile Header (similar to AuthPage) */}
        <div className="md:hidden p-5 flex items-center justify-between border-b border-border-light bg-white sticky top-0 z-50">
          <Link to="/" className="text-dark">
            <IoArrowBackOutline className="w-6 h-6" />
          </Link>
          <span className="font-sans text-sm tracking-[0.3em] uppercase font-medium text-dark">
            NASSEG
          </span>
          <div className="w-6" />
        </div>

        <div className="flex-1 py-16 md:py-24 px-6 lg:px-20 max-w-4xl">
          {/* Breadcrumbs for desktop */}
          <nav className="hidden md:flex items-center gap-2 text-[10px] font-sans tracking-widest-xl uppercase text-muted mb-12">
            <Link to="/" className="hover:text-dark transition-colors">Home</Link>
            <span>/</span>
            <span className="text-dark">{data.title}</span>
          </nav>

          <div 
            ref={reveal.ref}
            className={`reveal-element ${reveal.isVisible ? 'revealed' : ''}`}
          >
            <h2 className="md:hidden font-serif text-3xl text-dark italic mb-8 border-b border-border-light pb-4">
              {data.title}
            </h2>
            
            <div 
              className="font-sans text-dark/70 text-base lg:text-lg"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(data.content) }}
            />

            <div className="mt-20 pt-10 border-t border-border-light">
              <Link
                to="/collections"
                className="inline-flex items-center gap-3 text-[11px] font-sans tracking-widest-2xl uppercase text-dark hover:text-gold transition-all group"
              >
                Explore Collections
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default InfoPage;
