import React, { useState, useEffect } from 'react';
import { Menu, Bell, User as UserIcon, HelpCircle, BookOpen, Sparkles, LogOut } from 'lucide-react';
import {
  ActiveWorkspaceView,
  User,
  Project,
  ProjectApplication,
  TeamMember,
  NotificationItem,
  ProjectUpdate,
  ProjectRole,
} from './types';
import { StorageService } from './services/storage';

// Screens & Shell
import { EntryScreen } from './components/entry/EntryScreen';
import { AuthScreen } from './components/auth/AuthScreen';
import { Dashboard } from './components/shell/Dashboard';
import { UserGuideSpotlight } from './components/guide/UserGuideSpotlight';
import { HelpSupportModal } from './components/common/HelpSupportModal';

// Workspace Views
import { MainPageView } from './components/views/MainPageView';
import { ProjectDetailView } from './components/views/ProjectDetailView';
import { MyProjectsView } from './components/views/MyProjectsView';
import { MyApplicantsView } from './components/views/MyApplicantsView';
import { ChatroomView } from './components/views/ChatroomView';
import { TeamView } from './components/views/TeamView';
import { NotificationsView } from './components/views/NotificationsView';
import { UpdatesView } from './components/views/UpdatesView';
import { ProfileView } from './components/views/ProfileView';
import { SocialConnectionsView } from './components/views/SocialConnectionsView';

export default function App() {
  // App Phase: 'entry' -> 'auth' -> 'workspace'
  const [appPhase, setAppPhase] = useState<'entry' | 'auth' | 'workspace'>('entry');

  // Core State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveWorkspaceView>('main');

  // Interactive Tour & Modals
  const [isUserGuideActive, setIsUserGuideActive] = useState<boolean>(false);
  const [isHelpSupportOpen, setIsHelpSupportOpen] = useState<boolean>(false);

  // Specific entity viewing states
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [viewUserProfile, setViewUserProfile] = useState<User | null>(null);
  const [activeChatTargetUserId, setActiveChatTargetUserId] = useState<string | null>(null);

  // Entities loaded from StorageService
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [followingUserIds, setFollowingUserIds] = useState<string[]>([]);
  const [followersUserIds, setFollowersUserIds] = useState<string[]>([]);

  // Initialize data on mount
  useEffect(() => {
    StorageService.initializeDefaults();
    const user = StorageService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    refreshData();
  }, []);

  const refreshData = () => {
    const user = StorageService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setFollowingUserIds(StorageService.getFollowing(user.id));
      setFollowersUserIds(StorageService.getFollowers(user.id));
      setNotifications(StorageService.getNotifications(user.id));
    }
    setProjects(StorageService.getProjects());
    setApplications(StorageService.getApplications());
    setTeamMembers(StorageService.getTeamMembers());
    setUpdates(StorageService.getUpdates());
  };

  // Auth Complete handler
  const handleAuthComplete = (user: User) => {
    setCurrentUser(user);
    setAppPhase('workspace');
    refreshData();

    // Check if first time viewing, can suggest guide
    const guideDone = localStorage.getItem('mosaic_guide_completed');
    if (!guideDone) {
      setTimeout(() => {
        setIsUserGuideActive(true);
      }, 700);
    }
  };

  // Sign out handler
  const handleLogout = () => {
    localStorage.removeItem('mosaic_current_user');
    setCurrentUser(null);
    setAppPhase('auth');
    setIsDashboardOpen(false);
  };

  // Navigation handlers
  const handleSelectView = (view: ActiveWorkspaceView) => {
    setActiveView(view);
    if (view === 'profile') {
      setViewUserProfile(currentUser);
    }
  };

  const handleOpenProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveView('project_detail');
  };

  const handleOpenUserProfile = (mosaicId: string) => {
    const targetUser = StorageService.getUserByMosaicId(mosaicId);
    if (targetUser) {
      setViewUserProfile(targetUser);
      setActiveView('profile');
    }
  };

  const handleStartChatWithUser = (targetUserId: string) => {
    if (!currentUser) return;
    const conversation = StorageService.getOrCreateConversation(currentUser.id, targetUserId);
    setActiveChatTargetUserId(conversation.id);
    setActiveView('chatroom');
  };

  const handleStartUserGuide = () => {
    setActiveView('main');
    setIsDashboardOpen(false);
    setIsUserGuideActive(true);
  };

  // Role Application Submit
  const handleApplyToProject = (project: Project, role: ProjectRole, message?: string) => {
    if (!currentUser) return;

    const newApp = StorageService.createApplication({
      projectId: project.id,
      projectTitle: project.title,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantMosaicId: currentUser.mosaicId,
      applicantAvatar: currentUser.avatarUrl,
      applicantRole: currentUser.targetedRole,
      applicantCollege: currentUser.college,
      roleId: role.id,
      appliedRoleTitle: role.title,
      message: message || `Hi! I would love to contribute as ${role.title} on ${project.title}.`,
    });

    refreshData();
  };

  // Applicant Decision: Accept
  const handleAcceptApplicant = (applicationId: string) => {
    StorageService.acceptApplication(applicationId);
    refreshData();
  };

  // Applicant Decision: Reject
  const handleRejectApplicant = (applicationId: string) => {
    StorageService.rejectApplication(applicationId);
    refreshData();
  };

  // Social Connections: Follow / Unfollow
  const handleFollowToggle = (targetUserId: string) => {
    if (!currentUser) return;
    const isNowFollowing = StorageService.toggleFollow(targetUserId);
    refreshData();

    // Update view user if profile currently displayed
    if (viewUserProfile && viewUserProfile.id === targetUserId) {
      const updatedTarget = StorageService.getUserById(targetUserId);
      if (updatedTarget) setViewUserProfile(updatedTarget);
    }
  };

  // Unread badge counters
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const pendingApplicants = applications.filter(
    (a) =>
      a.brainstormerId === currentUser?.id && a.status === 'Pending'
  ).length;

  // Render Phase 1: Entry Screen (Puzzle Scattering Transition)
  if (appPhase === 'entry') {
    const handleEntryDone = () => {
      // If already logged in, jump directly to workspace, else to auth
      const user = StorageService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setAppPhase('workspace');
      } else {
        setAppPhase('auth');
      }
    };

    return (
      <EntryScreen
        onTransitionComplete={handleEntryDone}
        onComplete={handleEntryDone}
      />
    );
  }

  // Render Phase 2: Auth Screen (Puzzle Cracking Transition)
  if (appPhase === 'auth') {
    return (
      <AuthScreen
        onAuthComplete={handleAuthComplete}
        onAuthenticated={handleAuthComplete}
      />
    );
  }

  // Active Project for Detail View
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Follow list resolved users
  const followingUsers = followingUserIds
    .map((id) => StorageService.getUserById(id))
    .filter(Boolean) as User[];

  const followersUsers = followersUserIds
    .map((id) => StorageService.getUserById(id))
    .filter(Boolean) as User[];

  // Render Phase 3: Main Application Workspace Shell
  return (
    <div className="flex h-screen w-screen bg-[#070B14] text-zinc-100 overflow-hidden font-sans select-none antialiased">
      {/* 1. COLLAPSIBLE DASHBOARD (Sections 10 & 11) */}
      <Dashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        activeView={activeView}
        onSelectView={handleSelectView}
        currentUser={currentUser}
        onStartUserGuide={handleStartUserGuide}
        onOpenHelpSupport={() => setIsHelpSupportOpen(true)}
        unreadNotificationsCount={unreadNotifications}
        pendingApplicantsCount={pendingApplicants}
        unreadChatCount={0}
      />

      {/* 2. MAIN APPLICATION SHELL (Fixed Header + Dynamic Center Workspace) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Top Header Frame (Section 7) */}
        <header
          id="mosaic-top-header"
          className="h-14 flex-shrink-0 border-b border-zinc-800/90 bg-[#090E1B]/95 backdrop-blur-md px-4 flex items-center justify-between z-20"
        >
          {/* Left: Three-line Menu Button & Logo */}
          <div className="flex items-center space-x-3">
            <button
              id="top-menu-hamburger-btn"
              onClick={() => setIsDashboardOpen((prev) => !prev)}
              aria-label="Toggle Navigation Dashboard"
              className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 active:scale-95 transition border border-zinc-700/50 cursor-pointer"
            >
              <Menu className="w-5 h-5 text-cyan-400" />
            </button>

            {/* Brand Logo & Tagline */}
            <div
              onClick={() => handleSelectView('main')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-xs rotate-45 group-hover:scale-110 transition-transform" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-black tracking-[0.2em] text-white">
                    MOSAIC
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 font-mono border border-cyan-800/50">
                    V1
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-medium tracking-tight">
                  Students Team Project Collaboration Platform
                </p>
              </div>
            </div>
          </div>

          {/* Center Workspace Title Badge */}
          <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="capitalize">
              {activeView.replace('_', ' ')} Workspace
            </span>
          </div>

          {/* Right: Quick Notifications, Spotlight Tour trigger, and Profile Container (Section 7 & 27) */}
          <div className="flex items-center space-x-2">
            {/* Spotlight Tour Shortcut */}
            <button
              id="header-user-guide-shortcut"
              onClick={handleStartUserGuide}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-cyan-300 hover:bg-zinc-800/60 transition cursor-pointer"
              title="Interactive Feature Guide"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Guide</span>
            </button>

            {/* Notifications Bell */}
            <button
              id="header-notifications-btn"
              onClick={() => handleSelectView('notifications')}
              className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </button>

            {/* Top-Right Profile Container (Section 27) */}
            <div className="flex items-center space-x-1.5 pl-2 border-l border-zinc-800">
              <button
                id="top-right-profile-btn"
                onClick={() => {
                  if (currentUser) {
                    setViewUserProfile(currentUser);
                    setActiveView('profile');
                  }
                }}
                className="flex items-center space-x-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-zinc-800/80 transition border border-transparent hover:border-zinc-700/80 cursor-pointer group"
                title="Your Profile"
              >
                <img
                  src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name}
                  className="w-7 h-7 rounded-lg object-cover border border-zinc-700 group-hover:border-cyan-400 transition"
                />
                <div className="hidden lg:block text-left leading-tight">
                  <p className="text-xs font-bold text-zinc-200 group-hover:text-white">
                    {currentUser?.name || 'User'}
                  </p>
                  <p className="text-[10px] font-mono text-cyan-400">
                    {currentUser?.mosaicId || '@mosaic_id'}
                  </p>
                </div>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/60 rounded-xl transition"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Center Workspace Area (Section 8) */}
        <main
          id="mosaic-center-workspace"
          className="flex-1 overflow-hidden relative bg-[#080D18]"
        >
          {activeView === 'main' && (
            <MainPageView
              projects={projects}
              currentUser={currentUser}
              onOpenProject={handleOpenProject}
              onOpenUserProfile={handleOpenUserProfile}
              onApplyToProject={(proj, role) => handleApplyToProject(proj, role)}
              onProjectCreated={(newProj) => refreshData()}
            />
          )}

          {activeView === 'project_detail' && selectedProject && (
            <ProjectDetailView
              project={selectedProject}
              currentUser={currentUser}
              onBack={() => setActiveView('main')}
              onOpenUserProfile={handleOpenUserProfile}
              onApply={(proj, role, note) => handleApplyToProject(proj, role, note)}
              onViewApplicants={() => handleSelectView('my_applicants')}
            />
          )}

          {activeView === 'my_projects' && (
            <MyProjectsView
              currentUser={currentUser}
              projects={projects}
              applications={applications}
              onOpenProject={handleOpenProject}
              onOpenUserProfile={handleOpenUserProfile}
              onSelectView={handleSelectView}
            />
          )}

          {activeView === 'my_applicants' && (
            <MyApplicantsView
              currentUser={currentUser}
              projects={projects}
              applications={applications}
              onAcceptApplicant={handleAcceptApplicant}
              onRejectApplicant={handleRejectApplicant}
              onOpenUserProfile={handleOpenUserProfile}
              onStartChatWithUser={handleStartChatWithUser}
            />
          )}

          {activeView === 'chatroom' && (
            <ChatroomView
              currentUser={currentUser}
              activeConversationId={activeChatTargetUserId}
              onOpenUserProfile={handleOpenUserProfile}
            />
          )}

          {activeView === 'team' && (
            <TeamView
              currentUser={currentUser}
              teamMembers={teamMembers}
              onOpenUserProfile={handleOpenUserProfile}
              onStartChatWithUser={handleStartChatWithUser}
            />
          )}

          {activeView === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              currentUser={currentUser}
              onMarkAllAsRead={() => {
                if (currentUser) {
                  StorageService.markAllNotificationsRead(currentUser.id);
                  refreshData();
                }
              }}
              onSelectView={handleSelectView}
              onOpenProject={handleOpenProject}
            />
          )}

          {activeView === 'updates' && (
            <UpdatesView
              updates={updates}
              projects={projects}
              currentUser={currentUser}
              onOpenProject={handleOpenProject}
              onOpenUserProfile={handleOpenUserProfile}
              onUpdateCreated={() => refreshData()}
            />
          )}

          {activeView === 'profile' && (
            <ProfileView
              viewUser={viewUserProfile || currentUser!}
              currentUser={currentUser}
              projects={projects}
              teamMembers={teamMembers}
              onOpenProject={handleOpenProject}
              onStartChatWithUser={handleStartChatWithUser}
              onProfileUpdated={(updated) => {
                setCurrentUser(updated);
                setViewUserProfile(updated);
                refreshData();
              }}
              onFollowToggle={handleFollowToggle}
              isFollowing={
                viewUserProfile ? followingUserIds.includes(viewUserProfile.id) : false
              }
            />
          )}

          {activeView === 'followers' && (
            <SocialConnectionsView
              type="followers"
              usersList={followersUsers}
              currentUser={currentUser}
              onOpenUserProfile={handleOpenUserProfile}
              onStartChatWithUser={handleStartChatWithUser}
              onFollowToggle={handleFollowToggle}
              isFollowing={(uid) => followingUserIds.includes(uid)}
              onSwitchType={(t) => setActiveView(t)}
            />
          )}

          {activeView === 'following' && (
            <SocialConnectionsView
              type="following"
              usersList={followingUsers}
              currentUser={currentUser}
              onOpenUserProfile={handleOpenUserProfile}
              onStartChatWithUser={handleStartChatWithUser}
              onFollowToggle={handleFollowToggle}
              isFollowing={(uid) => followingUserIds.includes(uid)}
              onSwitchType={(t) => setActiveView(t)}
            />
          )}
        </main>
      </div>

      {/* 3. INTERACTIVE SPOTLIGHT USER GUIDE (Section 31) */}
      <UserGuideSpotlight
        isOpen={isUserGuideActive}
        isActive={isUserGuideActive}
        isDashboardOpen={isDashboardOpen}
        onToggleDashboard={() => setIsDashboardOpen((prev) => !prev)}
        onClose={() => {
          setIsUserGuideActive(false);
          StorageService.setUserGuideCompleted(true);
        }}
        onComplete={() => {
          setIsUserGuideActive(false);
          StorageService.setUserGuideCompleted(true);
        }}
        onSkip={() => {
          setIsUserGuideActive(false);
          StorageService.setUserGuideCompleted(true);
        }}
      />

      {/* 4. HELP & SUPPORT MODAL (Section 32) */}
      <HelpSupportModal
        isOpen={isHelpSupportOpen}
        onClose={() => setIsHelpSupportOpen(false)}
      />
    </div>
  );
}
