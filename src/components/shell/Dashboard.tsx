import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  FolderGit2,
  Users,
  MessageSquare,
  Network,
  Bell,
  Radio,
  BookOpen,
  LifeBuoy,
  X,
  ChevronRight,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { ActiveWorkspaceView, User } from '../../types';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ActiveWorkspaceView;
  onSelectView: (view: ActiveWorkspaceView) => void;
  currentUser: User | null;
  onStartUserGuide: () => void;
  onOpenHelpSupport: () => void;
  unreadNotificationsCount: number;
  pendingApplicantsCount: number;
  unreadChatCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  isOpen,
  onClose,
  activeView,
  onSelectView,
  currentUser,
  onStartUserGuide,
  onOpenHelpSupport,
  unreadNotificationsCount,
  pendingApplicantsCount,
  unreadChatCount,
}) => {
  const menuItems = [
    {
      id: 'main' as ActiveWorkspaceView,
      label: '1. Main Page',
      sublabel: 'Project Discovery',
      icon: Compass,
      badge: null,
    },
    {
      id: 'my_projects' as ActiveWorkspaceView,
      label: '2. My Projects',
      sublabel: 'Applied & Posted',
      icon: FolderGit2,
      badge: null,
    },
    {
      id: 'my_applicants' as ActiveWorkspaceView,
      label: '3. My Applicants',
      sublabel: 'Review Candidates',
      icon: Users,
      badge: pendingApplicantsCount > 0 ? pendingApplicantsCount : null,
    },
    {
      id: 'chatroom' as ActiveWorkspaceView,
      label: '4. M.Chatroom',
      sublabel: 'Direct Collaborator DMs',
      icon: MessageSquare,
      badge: unreadChatCount > 0 ? unreadChatCount : null,
    },
    {
      id: 'team' as ActiveWorkspaceView,
      label: '5. M.Team',
      sublabel: 'Active Teammates & Roles',
      icon: Network,
      badge: null,
    },
    {
      id: 'notifications' as ActiveWorkspaceView,
      label: '6. M.Notifications',
      sublabel: 'Alerts & Activity',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
    },
    {
      id: 'updates' as ActiveWorkspaceView,
      label: '7. M.Updates',
      sublabel: 'Project Milestones',
      icon: Radio,
      badge: null,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Subtle backdrop overlay so main workspace is visible behind */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1.5px]"
          />

          {/* Sliding Dashboard Panel */}
          <motion.aside
            id="mosaic-dashboard-panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed top-0 left-0 bottom-0 z-40 w-72 sm:w-80 bg-[#0B101B]/95 border-r border-zinc-800/90 shadow-2xl flex flex-col justify-between select-none overflow-y-auto"
          >
            {/* Top Brand & Close */}
            <div>
              <div className="flex items-center justify-between p-5 border-b border-zinc-800/80">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-xs rotate-45" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold tracking-[0.2em] text-white">MOSAIC</h2>
                    <p className="text-[10px] text-cyan-400/90 font-mono tracking-wider">WORKSPACE DASHBOARD</p>
                  </div>
                </div>

                <button
                  id="dashboard-close-btn"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                  title="Minimize Dashboard"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Items (1-7) */}
              <div className="p-3 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      id={`dashboard-item-${item.id}`}
                      onClick={() => {
                        onSelectView(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition group ${
                        isActive
                          ? 'bg-zinc-800/90 text-cyan-300 font-semibold border border-cyan-500/30 shadow-xs'
                          : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 transition ${
                            isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'
                          }`}
                        />
                        <div className="truncate">
                          <p className="text-xs font-medium truncate">{item.label}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{item.sublabel}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        {item.badge !== null && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-cyan-500 text-zinc-950 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition ${
                            isActive ? 'text-cyan-400 translate-x-0.5' : 'text-zinc-600 opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}

                {/* Section 8: User Guide */}
                <button
                  id="dashboard-item-user-guide"
                  onClick={() => {
                    onClose();
                    onStartUserGuide();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition group"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition" />
                    <div>
                      <p className="text-xs font-medium">8. User Guide</p>
                      <p className="text-[10px] text-zinc-500">Interactive Spotlight Tour</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition" />
                </button>

                {/* Section 9: Help & Support */}
                <button
                  id="dashboard-item-help-support"
                  onClick={() => {
                    onClose();
                    onOpenHelpSupport();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition group"
                >
                  <div className="flex items-center space-x-3">
                    <LifeBuoy className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition" />
                    <div>
                      <p className="text-xs font-medium">9. Help & Support</p>
                      <p className="text-[10px] text-zinc-500">Creator Contact & FAQs</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition" />
                </button>
              </div>
            </div>

            {/* Bottom: Followers & Following (Section 26) */}
            <div
              id="dashboard-social-counters"
              className="p-4 border-t border-zinc-800/80 bg-zinc-950/50"
            >
              <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 mb-2">
                Your Network
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* Followers Button */}
                <button
                  id="dashboard-followers-counter-btn"
                  onClick={() => {
                    onSelectView('followers');
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    activeView === 'followers'
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                      : 'bg-zinc-900/70 hover:bg-zinc-850 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px] font-medium text-zinc-400">Followers</span>
                  </div>
                  <p className="text-base font-bold text-white">
                    {currentUser?.followersCount || 0}
                  </p>
                </button>

                {/* Following Button */}
                <button
                  id="dashboard-following-counter-btn"
                  onClick={() => {
                    onSelectView('following');
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    activeView === 'following'
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                      : 'bg-zinc-900/70 hover:bg-zinc-850 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px] font-medium text-zinc-400">Following</span>
                  </div>
                  <p className="text-base font-bold text-white">
                    {currentUser?.followingCount || 0}
                  </p>
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
