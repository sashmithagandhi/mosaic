import React, { useState } from 'react';
import {
  Radio,
  Plus,
  Calendar,
  Sparkles,
  ExternalLink,
  MessageSquare,
  X,
  Send,
} from 'lucide-react';
import { ProjectUpdate, Project, User } from '../../types';
import { StorageService } from '../../services/storage';

interface UpdatesViewProps {
  updates: ProjectUpdate[];
  projects: Project[];
  currentUser: User | null;
  onOpenProject: (projectId: string) => void;
  onOpenUserProfile: (mosaicId: string) => void;
  onUpdateCreated: (newUpdate: ProjectUpdate) => void;
}

export const UpdatesView: React.FC<UpdatesViewProps> = ({
  updates,
  projects,
  currentUser,
  onOpenProject,
  onOpenUserProfile,
  onUpdateCreated,
}) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<ProjectUpdate['tag']>('Milestone');

  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !title.trim() || !content.trim()) return;

    const project = projects.find((p) => p.id === selectedProjectId) || projects[0];

    const newUpd = StorageService.addUpdate({
      projectId: project.id,
      projectTitle: project.title,
      authorId: currentUser.id,
      authorMosaicId: currentUser.mosaicId,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      title: title.trim(),
      content: content.trim(),
      tag,
    });

    onUpdateCreated(newUpd);
    setIsPostModalOpen(false);
    setTitle('');
    setContent('');
  };

  const getTagColor = (t: ProjectUpdate['tag']) => {
    switch (t) {
      case 'Milestone':
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60';
      case 'Release':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
      case 'Recruitment':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/60';
      default:
        return 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60';
    }
  };

  return (
    <div id="m-updates-workspace" className="h-full flex flex-col overflow-hidden text-zinc-100">
      {/* Subheader */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-zinc-800/80 bg-[#0B101D]/70 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white">
              M.Updates Feed
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 rounded-md">
              Broadcasts & Milestones
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Public project sprints, milestone completions, and team announcements across Mosaic.
          </p>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center space-x-2 transition shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post Milestone Update</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {updates.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20">
            <Radio className="w-10 h-10 text-zinc-600 mb-2" />
            <h3 className="text-sm font-semibold text-zinc-300">No Updates Broadcasted</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Post project progress reports, technical milestone completions, or sprint notes.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {updates.map((upd) => (
              <div
                key={upd.id}
                className="p-5 bg-[#0D1424] border border-zinc-800 hover:border-zinc-700 rounded-2xl transition space-y-3"
              >
                {/* Header: Author + Meta */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={upd.authorAvatar}
                      alt={upd.authorName}
                      className="w-10 h-10 rounded-xl object-cover border border-zinc-700"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-white">{upd.authorName}</h4>
                        <button
                          type="button"
                          onClick={() => onOpenUserProfile(upd.authorMosaicId)}
                          className="text-[11px] font-mono text-cyan-400 hover:underline"
                        >
                          {upd.authorMosaicId}
                        </button>
                      </div>

                      <button
                        onClick={() => onOpenProject(upd.projectId)}
                        className="text-[11px] text-zinc-400 hover:text-white flex items-center space-x-1 mt-0.5"
                      >
                        <span className="font-semibold text-cyan-300">Project:</span>
                        <span className="truncate max-w-xs">{upd.projectTitle}</span>
                        <ExternalLink className="w-2.5 h-2.5 ml-0.5 text-zinc-500" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md border ${getTagColor(
                        upd.tag
                      )}`}
                    >
                      {upd.tag}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">{upd.timestamp}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="pt-2 border-t border-zinc-800/70">
                  <h3 className="text-sm font-bold text-zinc-100">{upd.title}</h3>
                  <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed whitespace-pre-line">
                    {upd.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- POST UPDATE MODAL --- */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <div className="relative w-full max-w-lg bg-[#0F1626] border border-zinc-700/90 rounded-2xl shadow-2xl p-6 text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Post Project Update</h3>
                  <p className="text-xs text-zinc-400">Share milestone progress with student peers</p>
                </div>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostUpdate} className="mt-4 space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Associated Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-cyan-400"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Update Tag
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Milestone">Milestone</option>
                    <option value="Release">Release</option>
                    <option value="Recruitment">Recruitment</option>
                    <option value="Announcement">Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Headline <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Completed PCB layout & ordered test boards"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Update Content <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail what was accomplished, blockers resolved, and next steps..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20"
                >
                  Publish Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
