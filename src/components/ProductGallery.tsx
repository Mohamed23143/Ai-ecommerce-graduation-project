import { useState, useRef, useCallback } from 'react';

interface ProductGalleryProps {
  images: string[];
}

const FALLBACK = '/product-main.png';

const thumbLabels = ['Front', 'Side', 'Back', 'Detail'];

const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  const handleImgError = useCallback((index: number) => {
    const el = imgRefs.current[index];
    if (el && el.src !== FALLBACK) {
      el.src = FALLBACK;
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex gap-4 lg:sticky lg:top-20 self-start">
      {/* Thumbnail Strip */}
      <div className="thumbnail-gallery hidden sm:flex flex-col gap-3 overflow-y-auto max-h-[650px]">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative w-[80px] h-[100px] flex-shrink-0 overflow-hidden cursor-pointer transition-all duration-300 group ${
              selectedIndex === index
                ? 'ring-2 ring-dark ring-offset-1 opacity-100'
                : 'opacity-50 hover:opacity-80'
            }`}
            aria-label={`View ${thumbLabels[index] || `image ${index + 1}`}`}
          >
            <img
              ref={el => { imgRefs.current[index] = el; }}
              src={img?.startsWith('http') ? img : FALLBACK}
              alt={`Product ${thumbLabels[index] || `view ${index + 1}`}`}
              className="w-full h-full object-cover"
              onError={() => handleImgError(index)}
            />
            {/* Label overlay */}
            <span className="absolute bottom-0 left-0 right-0 bg-dark/60 text-white text-[9px] font-sans tracking-wider uppercase text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {thumbLabels[index] || `View ${index + 1}`}
            </span>
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div
        className="flex-1 overflow-hidden cursor-crosshair relative"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          ref={el => { imgRefs.current[selectedIndex] = el; }}
          src={images[selectedIndex]?.startsWith('http') ? images[selectedIndex] : FALLBACK}
          alt="Product main view"
          className="w-full h-[500px] sm:h-[600px] lg:h-[650px] object-cover transition-all duration-500"
          style={
            isZoomed
              ? {
                  transform: 'scale(1.5)',
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : {}
          }
          onError={() => handleImgError(selectedIndex)}
        />

        {/* Mobile dots */}
        <div className="sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                selectedIndex === index
                  ? 'bg-dark w-6'
                  : 'bg-dark/30 hover:bg-dark/50'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
