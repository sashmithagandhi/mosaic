import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Linkedin, ExternalLink, LifeBuoy, HeartHandshake } from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          className="relative w-full max-w-md bg-[#0F1626] border border-zinc-700/80 rounded-2xl shadow-2xl p-6 text-zinc-100 z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Help & Support</h3>
                <p className="text-xs text-zinc-400">Direct creator assistance & feedback</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="mt-4 space-y-3">
            <p className="text-xs text-zinc-300 leading-relaxed">
              If you encounter bugs, have questions regarding your project applications or team roles, or would like to discuss new platform capabilities for Mosaic, please reach out directly:
            </p>

            <div className="space-y-2.5 pt-2">
              {/* Creator Email */}
              <a
                href="mailto:sashmithagandhi6@gmail.com"
                className="flex items-center justify-between p-3 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-zinc-200">Email Support</p>
                    <p className="text-[11px] font-mono text-zinc-400">sashmithagandhi6@gmail.com</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition" />
              </a>

              {/* Creator LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0077b5]/20 border border-[#0077b5]/30 flex items-center justify-center text-[#0077b5]">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-zinc-200">LinkedIn Connect</p>
                    <p className="text-[11px] text-zinc-400">Discuss Mosaic & Student Teams</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-[#0077b5] transition" />
              </a>
            </div>

            <div className="mt-4 p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/50 flex items-center space-x-2 text-[11px] text-zinc-400">
              <HeartHandshake className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Mosaic V1 Prototype • Every role is a piece.</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
