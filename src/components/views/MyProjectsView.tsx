import React, { useState, useMemo } from 'react';
import {
  Search,
  FolderGit2,
  Clock,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  ChevronRight,
  Puzzle,
  ExternalLink,
} from 'lucide-react';
import { Project, ProjectApplication, User } from '../../types';

interface MyProjectsViewProps {
  currentUser: User | null;
  projects: Project[];
  applications: ProjectApplication[];
  onOpenProject: (projectId: string) => void;
  onOpenUserProfile: (mosaicId: string) => void;
  onSelectView: (view: any) => void;
}

type MyProjectsFilter = 'Applied — Pending' | 'Accepted' | 'Rejected' | 'Projects Posted';

export const MyProjectsView: React.FC<MyProjectsViewProps> = ({
  currentUser,
  projects,
  applications,
  onOpenProject,
  onOpenUserProfile,
  onSelectView,
}) => {
  const [activeFilter, setActiveFilter] = useState<MyProjectsFilter>('Projects Posted');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs: { id: MyProjectsFilter; label: string; count: number }[] = [
    {
      id: 'Projects Posted',
      label: 'Projects Posted',
      count: projects.filter((p) => p.brainstormerId === currentUser?.id).length,
    },
    {
      id: 'Applied — Pending',
      label: 'Applied — Pending',
      count: applications.filter((a) => a.applicantId === currentUser?.id && a.status === 'Pending').length,
    },
    {
      id: 'Accepted',
      label: 'Accepted',
      count: applications.filter((a) => a.applicantId === currentUser?.id && a.status === 'Accepted').length,
    },
    {
      id: 'Rejected',
      label: 'Rejected',
      count: applications.filter((a) => a.applicantId === currentUser?.id && a.status === 'Rejected').length,
    },
  ];

  // Projects Posted by current user
  const postedProjects = useMemo(() => {
    return projects.filter((p) => p.brainstormerId === currentUser?.id);
  }, [projects, currentUser]);

  // Filtered applications by current user
  const userApplications = useMemo(() => {
    return applications.filter((a) => a.applicantId === currentUser?.id);
  }, [applications, currentUser]);

  return (
    <div id="my-projects-workspace" className="h-full flex flex-col overflow-hidden text-zinc-100">
      {/* Subheader */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-zinc-800/80 bg-[#0B101D]/70 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white">
              My Projects
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-800 text-zinc-300 rounded-md">
              Portfolio & Applications
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage projects you brainstormed as well as your role applications across the Mosaic network.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-zinc-800/60 bg-[#0C1222]/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects or applied roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-zinc-900/80 border border-zinc-700/70 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* 4 Strict Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                id={`my-projects-filter-${tab.id.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-cyan-400 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* PROJECTS POSTED VIEW */}
        {activeFilter === 'Projects Posted' && (
          <div>
            {postedProjects.length === 0 ? (
              <div className="h-60 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20">
                <FolderGit2 className="w-10 h-10 text-zinc-600 mb-2" />
                <h3 className="text-sm font-semibold text-zinc-300">No Projects Posted Yet</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                  You haven't posted any projects as a brainstormer yet. Post an idea to recruit student collaborators!
                </p>
                <button
                  onClick={() => onSelectView('main')}
                  className="mt-4 px-3.5 py-1.5 text-xs font-bold bg-cyan-500 text-zinc-950 rounded-lg hover:bg-cyan-400 transition"
                >
                  Go to Main Page & Post Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {postedProjects
                  .filter((p) => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((proj) => {
                    const totalSlots = proj.rolesRequired.reduce((a, r) => a + r.slots, 0);
                    const filledSlots = proj.rolesRequired.reduce((a, r) => a + r.filledSlots, 0);
                    const openSlots = totalSlots - filledSlots;

                    return (
                      <div
                        key={proj.id}
                        className="bg-[#0D1424] border border-zinc-800 hover:border-cyan-500/40 rounded-2xl p-5 flex flex-col justify-between transition group shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-2">
                            <span className="px-2 py-0.5 rounded bg-zinc-800/90 text-cyan-300 font-mono text-[10px]">
                              {proj.category}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 font-medium text-[10px]">
                              Brainstormer: You
                            </span>
                          </div>

                          <h3
                            onClick={() => onOpenProject(proj.id)}
                            className="text-base font-bold text-white group-hover:text-cyan-300 transition cursor-pointer"
                          >
                            {proj.title}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                            {proj.tagline || proj.description}
                          </p>

                          {/* Role Piece Badges */}
                          <div className="mt-3.5 pt-3 border-t border-zinc-800/70 space-y-1.5">
                            <p className="text-[10px] font-mono text-zinc-500">ROLES SPECS:</p>
                            <div className="flex flex-wrap gap-1">
                              {proj.rolesRequired.map((r) => (
                                <span
                                  key={r.id}
                                  className="px-2 py-0.5 text-[10px] rounded bg-zinc-900 border border-zinc-700/80 text-zinc-300"
                                >
                                  {r.title} ({r.filledSlots}/{r.slots})
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-zinc-400">
                            {openSlots} slots remaining
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onSelectView('my_applicants')}
                              className="px-2.5 py-1 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition"
                            >
                              Applicants
                            </button>
                            <button
                              onClick={() => onOpenProject(proj.id)}
                              className="px-2.5 py-1 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-lg transition"
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* APPLIED TABS (Pending, Accepted, Rejected) */}
        {activeFilter !== 'Projects Posted' && (
          <div>
            {(() => {
              const statusTarget =
                activeFilter === 'Applied — Pending'
                  ? 'Pending'
                  : activeFilter === 'Accepted'
                  ? 'Accepted'
                  : 'Rejected';

              const matchingApps = userApplications.filter(
                (a) =>
                  a.status === statusTarget &&
                  (!searchQuery ||
                    a.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.appliedRoleTitle.toLowerCase().includes(searchQuery.toLowerCase()))
              );

              if (matchingApps.length === 0) {
                return (
                  <div className="h-60 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20">
                    <Clock className="w-10 h-10 text-zinc-600 mb-2" />
                    <h3 className="text-sm font-semibold text-zinc-300">
                      No {statusTarget} Applications
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                      {statusTarget === 'Pending'
                        ? 'You do not have any pending role applications. Explore projects on the Main Page to apply!'
                        : statusTarget === 'Accepted'
                        ? 'No accepted applications yet. Keep applying to projects that match your targeted role.'
                        : 'No rejected applications.'}
                    </p>
                    <button
                      onClick={() => onSelectView('main')}
                      className="mt-4 px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition"
                    >
                      Browse Projects
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {matchingApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 bg-[#0D1424] border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-zinc-700"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4
                            onClick={() => onOpenProject(app.projectId)}
                            className="text-sm font-bold text-white hover:text-cyan-400 transition cursor-pointer"
                          >
                            {app.projectTitle}
                          </h4>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                              app.status === 'Pending'
                                ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                                : app.status === 'Accepted'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                : 'bg-red-950/60 text-red-400 border border-red-800/40'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                          <span>
                            Applied Role Piece:{' '}
                            <span className="text-cyan-300 font-semibold">{app.appliedRoleTitle}</span>
                          </span>
                          <span>•</span>
                          <span>Applied: {app.appliedDate}</span>
                        </div>

                        {app.message && (
                          <p className="text-xs text-zinc-400 italic bg-zinc-950/50 p-2 rounded-lg border border-zinc-900 mt-2">
                            "{app.message}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {app.status === 'Accepted' && (
                          <button
                            onClick={() => onSelectView('team')}
                            className="px-3 py-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg hover:bg-emerald-500 hover:text-zinc-950 transition"
                          >
                            View Team Workspace
                          </button>
                        )}
                        <button
                          onClick={() => onOpenProject(app.projectId)}
                          className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition"
                        >
                          View Project
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
