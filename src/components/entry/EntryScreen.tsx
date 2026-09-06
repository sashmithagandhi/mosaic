import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EntryScreenProps {
  onTransitionComplete?: () => void;
  onComplete?: () => void;
}

interface PuzzlePiece {
  id: number;
  textChar?: string;
  isSubtitle?: boolean;
  initialX: number;
  initialY: number;
  scatterX: number;
  scatterY: number;
  rotation: number;
  delay: number;
  clipPath: string;
}

// Geometric puzzle interlocking paths for mosaic fragments
const PUZZLE_SHAPES = [
  'polygon(0% 0%, 75% 0%, 75% 25%, 100% 50%, 75% 75%, 75% 100%, 0% 100%, 0% 75%, 25% 50%, 0% 25%)',
  'polygon(25% 0%, 50% 25%, 75% 0%, 100% 0%, 100% 100%, 75% 100%, 50% 75%, 25% 100%, 0% 100%, 0% 0%)',
  'polygon(0% 0%, 100% 0%, 100% 75%, 75% 50%, 100% 25%, 100% 100%, 25% 100%, 50% 75%, 25% 50%, 0% 100%)',
  'polygon(25% 0%, 100% 0%, 75% 50%, 100% 100%, 0% 100%, 25% 50%, 0% 0%)',
  'polygon(0% 0%, 50% 20%, 100% 0%, 80% 50%, 100% 100%, 50% 80%, 0% 100%, 20% 50%)',
  'polygon(15% 0%, 85% 0%, 100% 30%, 80% 60%, 100% 100%, 0% 100%, 20% 60%, 0% 30%)',
];

export const EntryScreen: React.FC<EntryScreenProps> = ({ onTransitionComplete, onComplete }) => {
  // Stages: 'idle' (opening identity) -> 'scattering' (disrupted puzzle pieces fall) -> 'reassembling' (come back together) -> 'complete'
  const [stage, setStage] = useState<'idle' | 'scattering' | 'reassembling'>('idle');

  const triggerCompletion = () => {
    if (typeof onTransitionComplete === 'function') {
      onTransitionComplete();
    } else if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  useEffect(() => {
    // Stage 1: Display clean identity screen for 2 seconds
    const timer1 = setTimeout(() => {
      setStage('scattering');
    }, 2100);

    // Stage 2: After scattering downward, reassemble
    const timer2 = setTimeout(() => {
      setStage('reassembling');
    }, 3900);

    // Stage 3: Complete transition to authentication
    const timer3 = setTimeout(() => {
      triggerCompletion();
    }, 4900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onTransitionComplete, onComplete]);

  // Generate mosaic pieces for letters M-O-S-A-I-C and fragments
  const titleLetters = ['M', 'O', 'S', 'A', 'I', 'C'];

  return (
    <div
      id="mosaic-entry-screen"
      onClick={() => {
        if (stage === 'idle') setStage('scattering');
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F17] text-white select-none overflow-hidden cursor-default"
    >
      {/* Skip Button */}
      <button
        id="mosaic-entry-skip-btn"
        onClick={(e) => {
          e.stopPropagation();
          triggerCompletion();
        }}
        className="absolute top-6 right-6 z-50 text-xs uppercase tracking-widest text-zinc-500 hover:text-white px-3 py-1.5 rounded-full border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 backdrop-blur-sm transition-colors cursor-pointer"
      >
        Skip intro &rarr;
      </button>

      {/* Background subtle geometric coordinate lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative flex flex-col items-center justify-center px-6">
        {/* Main MOSAIC Letters */}
        <div className="relative flex items-center justify-center space-x-2 md:space-x-4 tracking-[0.25em] font-extrabold text-5xl md:text-7xl lg:text-8xl">
          {titleLetters.map((char, index) => {
            // Scatter physics offsets
            const scatterX = (index - 2.5) * 110 + (Math.sin(index * 2) * 60);
            const scatterY = 160 + (index % 2 === 0 ? 90 : 150) + Math.cos(index) * 40;
            const rotation = (index % 2 === 0 ? 1 : -1) * (28 + index * 12);

            return (
              <motion.span
                key={`mosaic-letter-${index}`}
                id={`mosaic-letter-${char}-${index}`}
                initial={{ opacity: 0, y: 15 }}
                animate={
                  stage === 'idle'
                    ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
                    : stage === 'scattering'
                    ? {
                        opacity: 0.85,
                        x: scatterX,
                        y: scatterY,
                        rotate: rotation,
                        scale: 0.85,
                        transition: {
                          duration: 1.3,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
                    : {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 1,
                        transition: {
                          duration: 0.7,
                          ease: [0.34, 1.56, 0.64, 1],
                        },
                      }
                }
                transition={{ duration: 0.8, delay: index * 0.08 }}
                className="relative inline-block text-zinc-100 drop-shadow-[0_2px_12px_rgba(255,255,255,0.08)]"
              >
                {char}

                {/* Simulated interlocking puzzle piece notch indicator during scatter */}
                {stage === 'scattering' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-cyan-400/60 blur-[1px]"
                  />
                )}
              </motion.span>
            );
          })}
        </div>

        {/* Dynamic scattered mosaic tessellation shards */}
        <AnimatePresence>
          {stage === 'scattering' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(14)].map((_, i) => {
                const angle = (i / 14) * Math.PI * 2;
                const distance = 120 + (i % 3) * 60;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * 70 + 180;
                const shape = PUZZLE_SHAPES[i % PUZZLE_SHAPES.length];

                return (
                  <motion.div
                    key={`shard-${i}`}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 0.75, 0.4],
                      scale: [0.3, 1, 0.8],
                      x: x,
                      y: y,
                      rotate: i * 35,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 1.4,
                      ease: [0.25, 1, 0.5, 1],
                      delay: i * 0.03,
                    }}
                    style={{ clipPath: shape }}
                    className="absolute left-1/2 top-1/2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-500/30"
                  />
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Subtitle */}
        <motion.div
          id="mosaic-entry-subtitle"
          initial={{ opacity: 0, y: 8 }}
          animate={
            stage === 'idle'
              ? { opacity: 0.85, y: 0 }
              : stage === 'scattering'
              ? {
                  opacity: 0.2,
                  y: 70,
                  filter: 'blur(3px)',
                  transition: { duration: 0.9 },
                }
              : {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.6 },
                }
          }
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-6 text-center text-xs md:text-sm lg:text-base font-medium text-zinc-400 tracking-[0.18em] uppercase max-w-xl"
        >
          Students Team Project Collaboration Platform
        </motion.div>

        {/* Tiny subtle cue for users if they wish to accelerate */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: stage === 'idle' ? 0.35 : 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-12 text-[11px] tracking-widest text-zinc-600 font-mono"
        >
          INITIALIZING WORKSPACE
        </motion.p>
      </div>
    </div>
  );
};
