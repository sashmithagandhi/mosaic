import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, X, MousePointer2, Compass, ArrowLeft } from 'lucide-react';

export interface GuideStep {
  id: string;
  targetSelector: string; // CSS selector or comma-separated selectors
  title: string;
  description: string;
  actionRequired?: 'click_menu' | 'click_close_menu' | 'none';
  position: 'bottom' | 'right' | 'left' | 'top' | 'center';
  requiresDashboard?: boolean;
}

export interface UserGuideSpotlightProps {
  isOpen?: boolean;
  isActive?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
  isDashboardOpen?: boolean;
  onToggleDashboard?: () => void;
  onSelectView?: (view: any) => void;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'step-menu-btn',
    targetSelector: '#top-menu-hamburger-btn, #app-menu-toggle-btn',
    title: '1. The Navigation Drawer Control',
    description:
      'Mosaic features a persistent workspace shell. Click this 3-line menu button to open or collapse your navigation dashboard containing all workspace views.',
    actionRequired: 'click_menu',
    position: 'bottom',
    requiresDashboard: false,
  },
  {
    id: 'step-dashboard-sections',
    targetSelector: '#mosaic-dashboard-panel',
    title: '2. The 9 Core Mosaic Workspaces',
    description:
      'Quickly switch across all collaboration hubs: explore student projects in Main Page, track your bids in My Projects, manage incoming applicants, and jump into M.Chatroom or M.Team.',
    actionRequired: 'none',
    position: 'right',
    requiresDashboard: true,
  },
  {
    id: 'step-dashboard-followers',
    targetSelector: '#dashboard-social-counters',
    title: '3. Interactive Followers & Following',
    description:
      'Every student builder is interconnected. Click these counters to see mutual collaborators, follow new creators, inspect profile stats, and initiate direct conversations.',
    actionRequired: 'none',
    position: 'right',
    requiresDashboard: true,
  },
  {
    id: 'step-center-workspace',
    targetSelector: '#mosaic-center-workspace, #workspace-discovery-area',
    title: '4. Dynamic Center Stage',
    description:
      'Your active workspace expands here. Browse projects, search by role or niche, inspect required team puzzle pieces, and post your own projects using the top controls.',
    actionRequired: 'none',
    position: 'bottom',
    requiresDashboard: false,
  },
  {
    id: 'step-profile-avatar',
    targetSelector: '#top-right-profile-btn, #app-profile-avatar-btn',
    title: '5. Student Identity & Mosaic ID',
    description:
      'Click your profile pill at any time to open your Mosaic Profile, view portfolio pieces, edit targeted roles, and share your unique Mosaic ID with classmates.',
    actionRequired: 'none',
    position: 'left',
    requiresDashboard: false,
  },
  {
    id: 'step-notifications-btn',
    targetSelector: '#header-notifications-btn',
    title: '6. Live Notifications',
    description:
      'Stay alert when team leaders accept your application, peers follow your profile, or collaborators send project updates. You are now ready to build!',
    actionRequired: 'none',
    position: 'bottom',
    requiresDashboard: false,
  },
];

export const UserGuideSpotlight: React.FC<UserGuideSpotlightProps> = ({
  isOpen,
  isActive,
  onClose,
  onComplete,
  onSkip,
  isDashboardOpen = false,
  onToggleDashboard,
}) => {
  const isVisible = Boolean(isOpen ?? isActive);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const handleDismiss = useCallback(() => {
    onClose?.();
    onComplete?.();
    onSkip?.();
  }, [onClose, onComplete, onSkip]);

  // Reset to step 0 when opened
  useEffect(() => {
    if (isVisible) {
      setCurrentStepIndex(0);
    }
  }, [isVisible]);

  const currentStep = GUIDE_STEPS[currentStepIndex];

  // Keep dashboard in sync with step requirements
  useEffect(() => {
    if (!isVisible || !currentStep) return;

    if (currentStep.requiresDashboard && !isDashboardOpen && onToggleDashboard) {
      onToggleDashboard();
    } else if (!currentStep.requiresDashboard && currentStepIndex >= 3 && isDashboardOpen && onToggleDashboard) {
      // Close dashboard for center stage & header steps
      onToggleDashboard();
    }
  }, [isVisible, currentStepIndex, currentStep, isDashboardOpen, onToggleDashboard]);

  // Update target rect with polling
  useEffect(() => {
    if (!isVisible || !currentStep) return;

    const updateRect = () => {
      // Target selector may have commas
      const selectors = currentStep.targetSelector.split(',').map((s) => s.trim());
      let foundEl: Element | null = null;
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          foundEl = el;
          break;
        }
      }

      if (foundEl) {
        const rect = foundEl.getBoundingClientRect();
        // Only set if rect has width and height
        if (rect.width > 0 && rect.height > 0) {
          setTargetRect(rect);
          return;
        }
      }
      setTargetRect(null);
    };

    updateRect();
    const timer = setInterval(updateRect, 250);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isVisible, currentStep, isDashboardOpen]);

  // Action clicks
  const handleTargetClick = () => {
    if (!currentStep) return;

    if (currentStep.actionRequired === 'click_menu' && !isDashboardOpen && onToggleDashboard) {
      onToggleDashboard();
      setTimeout(() => {
        setCurrentStepIndex((prev) => Math.min(prev + 1, GUIDE_STEPS.length - 1));
      }, 300);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentStepIndex < GUIDE_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleDismiss();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!isVisible || !currentStep) return null;

  // Compute card positioning safely
  const cardWidth = Math.min(360, window.innerWidth - 32);
  const cardHeight = 220;

  let cardTop = window.innerHeight / 2 - cardHeight / 2;
  let cardLeft = window.innerWidth / 2 - cardWidth / 2;

  if (targetRect) {
    if (currentStep.position === 'bottom') {
      cardTop = targetRect.bottom + 16;
      cardLeft = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    } else if (currentStep.position === 'top') {
      cardTop = targetRect.top - cardHeight - 16;
      cardLeft = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    } else if (currentStep.position === 'right') {
      cardTop = targetRect.top;
      cardLeft = targetRect.right + 20;
    } else if (currentStep.position === 'left') {
      cardTop = targetRect.top;
      cardLeft = targetRect.left - cardWidth - 20;
    }

    // Clamping within viewport
    cardTop = Math.max(16, Math.min(window.innerHeight - cardHeight - 24, cardTop));
    cardLeft = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, cardLeft));
  }

  return (
    <div
      id="mosaic-spotlight-tour"
      className="fixed inset-0 z-50 pointer-events-auto select-none overflow-hidden"
    >
      {/* SVG Spotlight Cutout Mask */}
      {targetRect ? (
        <svg className="fixed inset-0 w-full h-full pointer-events-none z-40">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - 6}
                y={targetRect.top - 6}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.78)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      ) : (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-40 pointer-events-none" />
      )}

      {/* Target Highlight Ring */}
      {targetRect && (
        <motion.div
          id="spotlight-highlight-ring"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={handleTargetClick}
          className="fixed z-50 rounded-xl border-2 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.7)] pointer-events-auto cursor-pointer"
        >
          {currentStep.actionRequired === 'click_menu' && !isDashboardOpen && (
            <motion.div
              animate={{
                y: [0, -6, 0],
                x: [0, 4, 0],
              }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              className="absolute -bottom-9 -right-4 flex items-center space-x-1.5 px-2.5 py-1 bg-cyan-400 text-zinc-950 font-bold text-[10px] tracking-wide rounded-full shadow-lg"
            >
              <MousePointer2 className="w-3 h-3 fill-current" />
              <span>CLICK MENU</span>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Tour Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          style={{
            top: cardTop,
            left: cardLeft,
            width: cardWidth,
          }}
          className="fixed z-50 p-5 bg-[#0D131F] border border-cyan-500/40 rounded-2xl shadow-2xl text-white pointer-events-auto"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold tracking-wider text-cyan-400 uppercase">
                Interactive Guide ({currentStepIndex + 1}/{GUIDE_STEPS.length})
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded transition cursor-pointer"
              title="Close Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Card Body */}
          <div className="mt-3">
            <h3 className="text-sm font-bold text-zinc-100">{currentStep.title}</h3>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="mt-4 flex items-center justify-center space-x-1.5">
            {GUIDE_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'w-6 bg-cyan-400'
                    : idx < currentStepIndex
                    ? 'w-2 bg-cyan-400/50'
                    : 'w-2 bg-zinc-700'
                }`}
                title={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Footer Controls */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-800/80">
            <button
              onClick={handleDismiss}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 tracking-wider uppercase font-medium cursor-pointer"
            >
              Skip Tour
            </button>

            <div className="flex items-center space-x-2">
              {currentStepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800/90 hover:bg-zinc-700 rounded-lg flex items-center space-x-1 transition cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
              )}
              <button
                id="spotlight-next-btn"
                onClick={handleNext}
                className="px-3.5 py-1.5 text-xs font-bold text-zinc-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg flex items-center space-x-1.5 transition shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <span>
                  {currentStepIndex === GUIDE_STEPS.length - 1 ? 'Finish Tour' : 'Next'}
                </span>
                {currentStepIndex === GUIDE_STEPS.length - 1 ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
