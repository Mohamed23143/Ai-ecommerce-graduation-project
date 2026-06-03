import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react';

type RevealVariant = 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'blur' | 'fade-down';

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

const variantStyles: Record<RevealVariant, { hidden: CSSProperties; visible: CSSProperties }> = {
  'fade-up': {
    hidden: { opacity: 0, transform: 'translateY(40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-down': {
    hidden: { opacity: 0, transform: 'translateY(-40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-left': {
    hidden: { opacity: 0, transform: 'translateX(-50px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-right': {
    hidden: { opacity: 0, transform: 'translateX(50px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'scale': {
    hidden: { opacity: 0, transform: 'scale(0.9)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'blur': {
    hidden: { opacity: 0, filter: 'blur(10px)', transform: 'translateY(20px)' },
    visible: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' },
  },
};

const ScrollReveal = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.8,
  threshold = 0.15,
  className = '',
  style = {},
  as: Tag = 'div',
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const { hidden, visible } = variantStyles[variant];
  const currentStyle = isVisible ? visible : hidden;

  const combinedStyle: CSSProperties = {
    ...style,
    ...currentStyle,
    transition: `opacity ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s, 
                 transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s,
                 filter ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
    willChange: 'opacity, transform, filter',
  };

  // @ts-expect-error - dynamic tag element
  return <Tag ref={ref} className={className} style={combinedStyle}>{children}</Tag>;
};

export default ScrollReveal;
