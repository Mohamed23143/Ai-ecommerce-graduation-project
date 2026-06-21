import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [stage, setStage] = useState<'threads' | 'logo' | 'exit'>('threads');

  useEffect(() => {
    // Stage 1: Threads drawing (0 to 3s)
    const timer1 = setTimeout(() => {
      setStage('logo');
    }, 3500);

    // Stage 2: Logo and sweater reveal (3.5s to 6.5s)
    const timer2 = setTimeout(() => {
      setStage('exit');
    }, 6500);

    // Stage 3: Exit animation finishes and triggers onComplete
    const timer3 = setTimeout(() => {
      onComplete();
    }, 7500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== 'exit' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f9f8f5] overflow-hidden"
        >
          {/* Background Image (The Sweater) */}
          <motion.img
            src="/splash-sweater.png"
            alt="Woven Background"
            initial={{ scale: 1.5, filter: 'blur(10px)', opacity: 0 }}
            animate={
              stage === 'logo'
                ? { scale: 1.1, filter: 'blur(0px)', opacity: 0.6 }
                : { scale: 1.5, filter: 'blur(10px)', opacity: 0.2 }
            }
            transition={{ duration: 3, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark Overlay for better contrast */}
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: stage === 'logo' ? 0.3 : 0.8 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-dark"
          />

          {/* SVG Weaving Threads Animation */}
          <AnimatePresence>
            {stage === 'threads' && (
              <motion.svg
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Thread 1 */}
                <motion.path
                  d="M -10,50 Q 25,20 50,50 T 110,50"
                  fill="transparent"
                  stroke="#D2B48C"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                />
                {/* Thread 2 */}
                <motion.path
                  d="M -10,30 Q 30,80 60,30 T 110,40"
                  fill="transparent"
                  stroke="#F5DEB3"
                  strokeWidth="0.3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
                />
                {/* Thread 3 */}
                <motion.path
                  d="M 110,70 Q 70,20 40,70 T -10,60"
                  fill="transparent"
                  stroke="#e6ccab"
                  strokeWidth="0.4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.2 }}
                />
                {/* Thread 4 */}
                <motion.path
                  d="M 20,-10 C 30,30 80,40 50,110"
                  fill="transparent"
                  stroke="#D2B48C"
                  strokeWidth="0.3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 2, ease: 'easeInOut', delay: 0.8 }}
                />
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Logo Reveal */}
          <AnimatePresence>
            {stage === 'logo' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="relative z-10 flex flex-col items-center"
              >
                <h1 className="font-sans text-4xl md:text-6xl tracking-[0.4em] uppercase text-white font-light drop-shadow-2xl">
                  NASSEG
                </h1>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 1, ease: 'easeInOut' }}
                  className="h-[1px] bg-gold mt-6"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
