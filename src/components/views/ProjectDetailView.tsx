import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Puzzle,
  Users,
  Clock,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Share2,
  ExternalLink,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Project, ProjectRole, User } from '../../types';

interface ProjectDetailViewProps {
  project: Project;
  currentUser: User | null;
  onBack: () => void;
  onOpenUserProfile: (mosaicId: string) => void;
  onApply: (project: Project, role: ProjectRole, message: string) => void;
  onViewApplicants: () => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  currentUser,
  onBack,
  onOpenUserProfile,
  onApply,
  onViewApplicants,
}) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    project.rolesRequired[0]?.id || ''
  );
  const [applicationNote, setApplicationNote] = useState('');
  const [hasAppliedSuccess, setHasAppliedSuccess] = useState(false);

  const isBrainstormer = currentUser?.id === project.brainstormerId;
  const selectedRole = project.rolesRequired.find((r) => r.id === selectedRoleId) || project.rolesRequired[0];

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    onApply(project, selectedRole, applicationNote);
    setHasAppliedSuccess(true);
    setTimeout(() => {
      setIsApplyModalOpen(false);
      setHasAppliedSuccess(false);
      setApplicationNote('');
    }, 1200);
  };

  return (
    <div id="project-detail-workspace" className="h-full flex flex-col overflow-y-auto text-zinc-100 p-6">
      {/* Back & Status Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Project Discovery</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 text-xs font-mono rounded-lg bg-zinc-900 border border-zinc-700/80 text-cyan-300">
            {project.category}
          </span>
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
              project.status === 'Recruiting'
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
                : 'bg-amber-950/40 text-amber-400 border-amber-800/50'
            }`}
          >
            {project.status}
          </span>
        </div>
      </div>

      {/* Main Detail Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description & Roles */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm text-cyan-400/90 font-medium mt-1">
              {project.tagline}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Full Description */}
          <div className="p-5 bg-[#0C1220] border border-zinc-800 rounded-2xl">
            <h3 className="text-xs uppercase font-mono tracking-wider text-zinc-500 mb-2">
              Project Blueprint & Overview
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Required Team Roles (Puzzle Pieces) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Puzzle className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Required Team Roles</h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                {project.rolesRequired.filter((r) => r.filledSlots < r.slots).length} of{' '}
                {project.rolesRequired.length} roles open
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.rolesRequired.map((role) => {
                const isOpen = role.filledSlots < role.slots;
                return (
                  <div
                    key={role.id}
                    className={`p-4 rounded-xl border transition ${
                      isOpen
                        ? 'bg-[#0E1526] border-zinc-800 hover:border-cyan-500/40'
                        : 'bg-zinc-950/60 border-zinc-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-200">{role.title}</h4>
                        <span className="text-[10px] font-mono text-cyan-400">
                          {role.filledSlots} / {role.slots} slots filled
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isOpen
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-zinc-900 text-zinc-500'
                        }`}
                      >
                        {isOpen ? 'Open Role' : 'Filled'}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {role.description}
                    </p>

                    {/* Skills Needed */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {role.skillsNeeded.map((skill) => (
                        <span
                          key={skill}
                          className="px-1.5 py-0.5 text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Join specific role shortcut */}
                    {!isBrainstormer && isOpen && (
                      <button
                        onClick={() => {
                          setSelectedRoleId(role.id);
                          setIsApplyModalOpen(true);
                        }}
                        className="mt-3 w-full py-1.5 text-xs font-semibold bg-zinc-800/70 hover:bg-cyan-500 hover:text-zinc-950 rounded-lg text-cyan-300 transition"
                      >
                        Apply for this role
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Brainstormer & Collaboration Metadata */}
        <div className="space-y-6">
          {/* Brainstormer Card */}
          <div className="p-5 bg-[#0C1220] border border-zinc-800 rounded-2xl">
            <h3 className="text-xs uppercase font-mono tracking-wider text-zinc-500 mb-3">
              Brainstormer / Project Lead
            </h3>

            <div className="flex items-center space-x-3">
              <img
                src={project.brainstormerAvatar}
                alt={project.brainstormerName}
                className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{project.brainstormerName}</h4>
                <button
                  type="button"
                  onClick={() => onOpenUserProfile(project.brainstormerMosaicId)}
                  className="text-xs font-mono text-cyan-400 hover:underline transition"
                >
                  {project.brainstormerMosaicId}
                </button>
              </div>
            </div>

            <button
              onClick={() => onOpenUserProfile(project.brainstormerMosaicId)}
              className="mt-4 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 rounded-xl transition flex items-center justify-center space-x-1.5"
            >
              <span>View Brainstormer Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Collaboration Rhythm & Info */}
          <div className="p-5 bg-[#0C1220] border border-zinc-800 rounded-2xl space-y-3">
            <h3 className="text-xs uppercase font-mono tracking-wider text-zinc-500">
              Collaboration Info
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-400 block font-medium">Cadence:</span>
                  <span className="text-zinc-200">{project.meetingRhythm || 'Weekly sprints + async updates'}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-400 block font-medium">Estimated Duration:</span>
                  <span className="text-zinc-200">{project.targetDuration || '8-12 weeks'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="p-5 bg-gradient-to-b from-[#10192B] to-[#0A0E18] border border-cyan-500/30 rounded-2xl text-center space-y-3">
            {isBrainstormer ? (
              <>
                <p className="text-xs text-cyan-300 font-semibold">
                  You are the Brainstormer of this project.
                </p>
                <button
                  onClick={onViewApplicants}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl transition shadow-md shadow-cyan-500/20"
                >
                  Manage Project Applicants
                </button>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Join This Team</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Select an open role piece to apply. The brainstormer will review your profile.
                  </p>
                </div>
                <button
                  id="project-detail-apply-btn"
                  onClick={() => setIsApplyModalOpen(true)}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl transition shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Apply to Project
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- JOIN / APPLY MODAL --- */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <div className="relative w-full max-w-lg bg-[#0F1626] border border-zinc-700/90 rounded-2xl shadow-2xl p-6 text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Puzzle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Apply for a Project Role</h3>
                  <p className="text-xs text-zinc-400">{project.title}</p>
                </div>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {hasAppliedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">Application Submitted!</h4>
                <p className="text-xs text-zinc-400">
                  The brainstormer ({project.brainstormerMosaicId}) was notified of your application for{' '}
                  <span className="text-cyan-300 font-semibold">{selectedRole?.title}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="mt-4 space-y-4 text-left">
                {/* Role selection */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Select Target Role (Puzzle Piece) <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-cyan-400"
                  >
                    {project.rolesRequired.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.title} ({role.filledSlots}/{role.slots} slots filled)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role specs summary */}
                {selectedRole && (
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-xs">
                    <p className="text-zinc-400 font-medium">{selectedRole.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedRole.skillsNeeded.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 text-[10px] bg-zinc-800 text-cyan-300 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Motivation note */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Introduction & Why you fit this role <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your relevant skills, previous project experience, and what you'd like to build..."
                    value={applicationNote}
                    onChange={(e) => setApplicationNote(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Submit buttons */}
                <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
