import React, { useState } from 'react';
import {
  Users,
  Check,
  X,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Project, ProjectApplication, User } from '../../types';

interface MyApplicantsViewProps {
  currentUser: User | null;
  projects: Project[];
  applications: ProjectApplication[];
  onAcceptApplicant: (applicationId: string) => void;
  onRejectApplicant: (applicationId: string) => void;
  onOpenUserProfile: (mosaicId: string) => void;
  onStartChatWithUser: (targetUserId: string) => void;
}

export const MyApplicantsView: React.FC<MyApplicantsViewProps> = ({
  currentUser,
  projects,
  applications,
  onAcceptApplicant,
  onRejectApplicant,
  onOpenUserProfile,
  onStartChatWithUser,
}) => {
  const [filterProject, setFilterProject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Find projects owned by current user
  const ownedProjects = projects.filter((p) => p.brainstormerId === currentUser?.id);
  const ownedProjectIds = ownedProjects.map((p) => p.id);

  // Filter applications that belong to the current user's posted projects
  const relevantApplications = applications.filter((a) => ownedProjectIds.includes(a.projectId));

  const filtered = relevantApplications.filter((app) => {
    const matchesProject = filterProject === 'All' || app.projectId === filterProject;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      app.applicantName.toLowerCase().includes(query) ||
      app.applicantMosaicId.toLowerCase().includes(query) ||
      app.appliedRoleTitle.toLowerCase().includes(query) ||
      app.projectTitle.toLowerCase().includes(query);

    return matchesProject && matchesQuery;
  });

  return (
    <div id="my-applicants-workspace" className="h-full flex flex-col overflow-hidden text-zinc-100">
      {/* Subheader */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-zinc-800/80 bg-[#0B101D]/70 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white">
              My Applicants
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 rounded-md">
              {relevantApplications.filter((a) => a.status === 'Pending').length} Pending Decisions
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Review applicant profiles for your posted projects, assign missing role pieces, and accept members into your team.
          </p>
        </div>
      </div>

      {/* Filter by Project & Search */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-zinc-800/60 bg-[#0C1222]/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search applicants by name, role, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-zinc-900/80 border border-zinc-700/70 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Project Selector */}
        {ownedProjects.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-400">Project:</span>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Posted Projects ({ownedProjects.length})</option>
              {ownedProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {relevantApplications.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20">
            <Users className="w-10 h-10 text-zinc-600 mb-2" />
            <h3 className="text-sm font-semibold text-zinc-300">No Applicants Yet</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              When other students discover your posted projects and apply for your required roles, their applications and candidate profiles will appear here for review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="p-5 bg-[#0D1424] border border-zinc-800 hover:border-zinc-700 rounded-2xl transition space-y-4 shadow-sm"
              >
                {/* Header row: Applicant profile + applied role */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={app.applicantAvatar}
                      alt={app.applicantName}
                      className="w-11 h-11 rounded-xl object-cover border border-zinc-700"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-white">{app.applicantName}</h3>
                        <button
                          type="button"
                          onClick={() => onOpenUserProfile(app.applicantMosaicId)}
                          className="text-xs font-mono text-cyan-400 hover:underline transition"
                        >
                          {app.applicantMosaicId}
                        </button>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {app.applicantRole} {app.applicantCollege ? `• ${app.applicantCollege}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                        app.status === 'Pending'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
                          : app.status === 'Accepted'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                          : 'bg-red-950/60 text-red-400 border border-red-800/50'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Applied Project & Role Piece */}
                <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-900 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-zinc-500 font-medium">Applied Project:</span>{' '}
                    <span className="text-zinc-200 font-semibold">{app.projectTitle}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Applied Role Piece:</span>{' '}
                    <span className="text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/50">
                      {app.appliedRoleTitle}
                    </span>
                  </div>
                  <div className="text-zinc-500 font-mono text-[11px]">
                    Applied: {app.appliedDate}
                  </div>
                </div>

                {/* Motivation message */}
                {app.message && (
                  <div className="text-xs text-zinc-300 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/80 leading-relaxed">
                    <span className="text-zinc-500 block text-[10px] uppercase font-mono mb-1">
                      Applicant's Statement:
                    </span>
                    "{app.message}"
                  </div>
                )}

                {/* Actions row: View Profile, Chat, Accept, Reject */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenUserProfile(app.applicantMosaicId)}
                      className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition flex items-center space-x-1"
                    >
                      <span>View Full Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onStartChatWithUser(app.applicantId)}
                      className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition flex items-center space-x-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat</span>
                    </button>
                  </div>

                  {app.status === 'Pending' ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onRejectApplicant(app.id)}
                        className="px-3 py-1.5 text-xs font-bold bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 rounded-lg transition flex items-center space-x-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => onAcceptApplicant(app.id)}
                        className="px-4 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg transition flex items-center space-x-1 shadow-sm shadow-emerald-500/20 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept into Team</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-400">
                      Decision finalized ({app.status})
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
