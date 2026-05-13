import { useState, useRef, useEffect } from 'react';
import { IoChevronDown } from 'react-icons/io5';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Accordion = ({ title, children, defaultOpen = false }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>(defaultOpen ? '500px' : '0px');

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight + 24}px` : '0px');
    }
  }, [isOpen]);

  return (
    <div className="border-t border-border-light">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-xs font-sans tracking-widest-xl uppercase cursor-pointer hover:text-gold transition-colors duration-300 group"
      >
        <span className="font-medium">{title}</span>
        <IoChevronDown
          className={`w-4 h-4 text-muted group-hover:text-gold transition-all duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
      >
        <div className={`text-sm font-sans text-dark/75 leading-relaxed pb-6 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
