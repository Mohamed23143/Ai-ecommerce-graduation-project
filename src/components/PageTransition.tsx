import { useEffect, useState, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [curtainPhase, setCurtainPhase] = useState<'idle' | 'enter' | 'exit'>('idle');
  const prevPath = useRef(location.pathname);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setIsVisible(true);
      return;
    }

    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;

    // Phase 1: Hide current page + curtain enters
    setIsVisible(false);
    setCurtainPhase('enter');

    // Phase 2: After curtain covers screen, switch content
    const timer1 = setTimeout(() => {
      setCurtainPhase('exit');
      setIsVisible(true);
    }, 400);

    // Phase 3: Curtain exits
    const timer2 = setTimeout(() => {
      setCurtainPhase('idle');
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [location.pathname]);

  return (
    <>
      {/* Curtain overlay */}
      {curtainPhase !== 'idle' && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div
            className={`absolute inset-0 bg-gradient-to-br from-dark via-dark to-[#2a2420] ${
              curtainPhase === 'enter' ? 'page-curtain-enter' : 'page-curtain-exit'
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-sans text-[28px] tracking-[0.5em] uppercase font-medium text-gold/60 page-curtain-text">
                NASSEG
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Page content */}
      <div
        className={`page-transition-content ${isVisible ? 'page-content-visible' : 'page-content-hidden'}`}
      >
        {children}
      </div>
    </>
  );
};

export default PageTransition;

