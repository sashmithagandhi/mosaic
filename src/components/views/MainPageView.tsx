import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Sparkles,
  ArrowRight,
  Puzzle,
  ChevronRight,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Project, User, ProjectRole } from '../../types';
import { StorageService } from '../../services/storage';

interface MainPageViewProps {
  projects: Project[];
  currentUser: User | null;
  onOpenProject: (projectId: string) => void;
  onOpenUserProfile: (mosaicId: string) => void;
  onApplyToProject: (project: Project, role: ProjectRole) => void;
  onProjectCreated: (newProject: Project) => void;
}

export const MainPageView: React.FC<MainPageViewProps> = ({
  projects,
  currentUser,
  onOpenProject,
  onOpenUserProfile,
  onApplyToProject,
  onProjectCreated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<Project['category']>('AI / Machine Learning');
  const [meetingRhythm, setMeetingRhythm] = useState('Weekly sprint call + Async Discord');
  const [targetDuration, setTargetDuration] = useState('8-10 weeks');
  const [tagsInput, setTagsInput] = useState('React, Python, Machine Learning');
  const [roles, setRoles] = useState<Array<{ title: string; description: string; slots: number; skills: string }>>([
    { title: 'Frontend Developer', description: 'Design tokens and reactive interfaces', slots: 1, skills: 'React, Tailwind' },
    { title: 'Backend / Systems Engineer', description: 'FastAPI microservices & DB pipelines', slots: 1, skills: 'Python, SQL' },
  ]);

  const categories = [
    'All',
    'AI / Machine Learning',
    'Web & Cloud',
    'Climate & IoT',
    'FinTech & Web3',
    'Design & UX',
  ];

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.tagline.toLowerCase().includes(query) ||
        project.tags.some((t) => t.toLowerCase().includes(query)) ||
        project.brainstormerName.toLowerCase().includes(query) ||
        project.brainstormerMosaicId.toLowerCase().includes(query) ||
        project.rolesRequired.some((r) => r.title.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [projects, searchQuery, selectedCategory]);

  const handleAddRoleRow = () => {
    setRoles((prev) => [
      ...prev,
      { title: '', description: '', slots: 1, skills: '' },
    ]);
  };

  const handleRemoveRoleRow = (idx: number) => {
    setRoles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newTitle.trim() || !newDescription.trim()) return;

    const formattedRoles: ProjectRole[] = roles
      .filter((r) => r.title.trim().length > 0)
      .map((r, i) => ({
        id: `role-custom-${Date.now()}-${i}`,
        title: r.title.trim(),
        description: r.description.trim() || 'Core collaborator role',
        slots: Math.max(1, r.slots),
        filledSlots: 0,
        skillsNeeded: r.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      }));

    if (formattedRoles.length === 0) {
      formattedRoles.push({
        id: `role-custom-${Date.now()}-default`,
        title: 'Full Stack Collaborator',
        description: 'Core project builder',
        slots: 2,
        filledSlots: 0,
        skillsNeeded: ['TypeScript', 'Git'],
      });
    }

    const createdProject: Project = {
      id: 'proj-' + Date.now(),
      title: newTitle.trim(),
      tagline: newTagline.trim() || newTitle.trim(),
      description: newDescription.trim(),
      brainstormerId: currentUser.id,
      brainstormerName: currentUser.name,
      brainstormerMosaicId: currentUser.mosaicId,
      brainstormerAvatar: currentUser.avatarUrl,
      postedDate: 'Just now',
      status: 'Recruiting',
      category: newCategory,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      meetingRhythm,
      targetDuration,
      rolesRequired: formattedRoles,
    };

    StorageService.saveProject(createdProject);
    onProjectCreated(createdProject);
    setIsCreateModalOpen(false);

    // Reset Form
    setNewTitle('');
    setNewTagline('');
    setNewDescription('');
  };

  return (
    <div id="workspace-discovery-area" className="h-full flex flex-col overflow-hidden text-zinc-100">
      {/* Workspace Subheader: Title & Quick Create */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-zinc-800/80 bg-[#0B101D]/70 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white">
              Project Discovery
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 rounded-md">
              {filteredProjects.length} Newly Posted
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Discover student team ideas, browse missing puzzle pieces, and join as a core contributor.
          </p>
        </div>

        {/* Create Project Action */}
        <button
          id="main-create-project-btn"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center space-x-2 transition shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Project</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-zinc-800/60 bg-[#0C1222]/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            id="main-project-search-input"
            type="text"
            placeholder="Search by keyword, required role, tech stack, or brainstormer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-zinc-900/80 border border-zinc-700/70 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] text-zinc-500 flex items-center mr-1 flex-shrink-0">
            <Filter className="w-3 h-3 mr-1" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-zinc-800 text-cyan-300 border border-cyan-500/40'
                  : 'bg-zinc-900/60 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Project Cards Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredProjects.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20">
            <Puzzle className="w-10 h-10 text-zinc-600 mb-3" />
            <h3 className="text-sm font-semibold text-zinc-300">No Projects Found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              We couldn't find any projects matching your search criteria. Try a different query or post a new project idea!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProjects.map((project) => {
              const totalSlots = project.rolesRequired.reduce((acc, r) => acc + r.slots, 0);
              const filledSlots = project.rolesRequired.reduce((acc, r) => acc + r.filledSlots, 0);
              const openSlots = totalSlots - filledSlots;

              return (
                <div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  className="group relative bg-[#0D1424] hover:bg-[#10182C] border border-zinc-800 hover:border-cyan-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-xl hover:shadow-cyan-950/20"
                >
                  {/* Top Meta: Category & Date */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2.5">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-zinc-800/80 text-cyan-300 border border-zinc-700/50">
                        {project.category}
                      </span>
                      <span className="text-zinc-500 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{project.postedDate}</span>
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3
                      onClick={() => onOpenProject(project.id)}
                      className="text-base font-bold text-zinc-100 group-hover:text-white transition cursor-pointer leading-snug"
                    >
                      {project.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {project.tagline || project.description}
                    </p>

                    {/* Brainstormer Identity (Section 13 & 15) */}
                    <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={project.brainstormerAvatar}
                          alt={project.brainstormerName}
                          className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                        />
                        <div className="text-left">
                          <p className="text-[11px] font-semibold text-zinc-200 leading-tight">
                            {project.brainstormerName}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenUserProfile(project.brainstormerMosaicId);
                            }}
                            className="text-[10px] font-mono text-cyan-400 hover:underline hover:text-cyan-300 block transition"
                          >
                            {project.brainstormerMosaicId}
                          </button>
                        </div>
                      </div>

                      <span className="text-[10px] font-medium px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-md">
                        {openSlots > 0 ? `${openSlots} slots open` : 'Team complete'}
                      </span>
                    </div>

                    {/* Team Roles Required (Puzzle-like Piece Badges) */}
                    <div className="mt-3.5 space-y-1.5">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center space-x-1">
                        <Puzzle className="w-3 h-3 text-cyan-400" />
                        <span>Required Puzzle Pieces:</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.rolesRequired.map((role) => {
                          const isOpen = role.filledSlots < role.slots;
                          return (
                            <span
                              key={role.id}
                              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] border ${
                                isOpen
                                  ? 'bg-zinc-900/90 text-zinc-200 border-zinc-700/80 hover:border-cyan-500/50'
                                  : 'bg-zinc-950 text-zinc-500 border-zinc-900 line-through'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-cyan-400' : 'bg-zinc-600'}`} />
                              <span className="truncate max-w-[140px]">{role.title}</span>
                              <span className="text-[9px] font-mono text-zinc-400">
                                ({role.filledSlots}/{role.slots})
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <button
                      onClick={() => onOpenProject(project.id)}
                      className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center space-x-1 transition cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Apply Button */}
                    <button
                      id={`project-apply-btn-${project.id}`}
                      onClick={() => {
                        const firstOpenRole = project.rolesRequired.find((r) => r.filledSlots < r.slots) || project.rolesRequired[0];
                        onApplyToProject(project, firstOpenRole);
                      }}
                      className="px-3 py-1.5 bg-cyan-500/15 hover:bg-cyan-500 hover:text-zinc-950 border border-cyan-500/40 text-cyan-300 font-bold text-xs rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Join / Apply</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- POST NEW PROJECT MODAL --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <div className="relative w-full max-w-2xl bg-[#0F1626] border border-zinc-700/90 rounded-2xl shadow-2xl p-6 text-zinc-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Puzzle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Post a New Project</h3>
                  <p className="text-xs text-zinc-400">Become the brainstormer & gather student collaborators</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="mt-4 space-y-4 text-left">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Project Title <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Synapse — Autonomous Drone Fleet for Campus Deliveries"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Short Tagline <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real-time path planning and obstacle avoidance for collegiate logistics."
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="AI / Machine Learning">AI / Machine Learning</option>
                    <option value="Web & Cloud">Web & Cloud</option>
                    <option value="Climate & IoT">Climate & IoT</option>
                    <option value="FinTech & Web3">FinTech & Web3</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Tags <span className="text-[10px] text-zinc-500">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ROS2, Python, Drone, Computer Vision"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Full Project Description <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the problem, technical architecture, and why this project is worth building..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Roles Required Section (Every role is a piece) */}
              <div className="pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">Required Team Roles (Puzzle Pieces)</h4>
                    <p className="text-[11px] text-zinc-500">Specify what roles your project needs to be complete</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRoleRow}
                    className="px-2.5 py-1 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-cyan-300 rounded-lg transition"
                  >
                    + Add Role
                  </button>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {roles.map((role, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Role title (e.g. Flight Controller Engineer)"
                          value={role.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRoles((prev) => prev.map((r, i) => (i === idx ? { ...r, title: val } : r)));
                          }}
                          className="flex-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded-md text-xs text-white placeholder-zinc-500"
                        />
                        <div className="flex items-center space-x-1 text-zinc-400 text-xs">
                          <span>Slots:</span>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            value={role.slots}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              setRoles((prev) => prev.map((r, i) => (i === idx ? { ...r, slots: val } : r)));
                            }}
                            className="w-12 px-1.5 py-1 bg-zinc-950 border border-zinc-700 rounded-md text-xs text-center text-white"
                          />
                        </div>
                        {roles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRoleRow(idx)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Brief role responsibilities..."
                          value={role.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRoles((prev) => prev.map((r, i) => (i === idx ? { ...r, description: val } : r)));
                          }}
                          className="px-2.5 py-1 bg-zinc-950 border border-zinc-700 rounded-md text-xs text-zinc-300 placeholder-zinc-600"
                        />
                        <input
                          type="text"
                          placeholder="Skills required (e.g. C++, ArduPilot)"
                          value={role.skills}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRoles((prev) => prev.map((r, i) => (i === idx ? { ...r, skills: val } : r)));
                          }}
                          className="px-2.5 py-1 bg-zinc-950 border border-zinc-700 rounded-md text-xs text-zinc-300 placeholder-zinc-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20"
                >
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
