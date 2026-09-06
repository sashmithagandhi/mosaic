import React, { useState } from 'react';
import {
  User as UserType,
  Project,
  TeamMember,
} from '../../types';
import {
  UserCheck,
  UserPlus,
  MessageSquare,
  Linkedin,
  Github,
  GraduationCap,
  Calendar,
  Sparkles,
  Edit3,
  Puzzle,
  Check,
  X,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { StorageService } from '../../services/storage';

interface ProfileViewProps {
  viewUser: UserType;
  currentUser: UserType | null;
  projects: Project[];
  teamMembers: TeamMember[];
  onOpenProject: (projectId: string) => void;
  onStartChatWithUser: (targetUserId: string) => void;
  onProfileUpdated: (updatedUser: UserType) => void;
  onFollowToggle: (targetUserId: string) => void;
  isFollowing: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  viewUser,
  currentUser,
  projects,
  teamMembers,
  onOpenProject,
  onStartChatWithUser,
  onProfileUpdated,
  onFollowToggle,
  isFollowing,
}) => {
  const isOwnProfile = currentUser?.id === viewUser.id;
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form State
  const [name, setName] = useState(viewUser.name);
  const [targetedRole, setTargetedRole] = useState(viewUser.targetedRole);
  const [college, setCollege] = useState(viewUser.college || '');
  const [degree, setDegree] = useState(viewUser.degree || '');
  const [yearOfStudy, setYearOfStudy] = useState(viewUser.yearOfStudy || '');
  const [bio, setBio] = useState(viewUser.bio || '');
  const [linkedinUrl, setLinkedinUrl] = useState(viewUser.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(viewUser.githubUrl || '');
  const [skillsInput, setSkillsInput] = useState(viewUser.skills.join(', '));
  const [avatarUrl, setAvatarUrl] = useState(viewUser.avatarUrl);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated: UserType = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      targetedRole: targetedRole.trim() || currentUser.targetedRole,
      college: college.trim(),
      degree: degree.trim(),
      yearOfStudy: yearOfStudy.trim(),
      bio: bio.trim(),
      linkedinUrl: linkedinUrl.trim(),
      githubUrl: githubUrl.trim(),
      avatarUrl: avatarUrl.trim() || currentUser.avatarUrl,
      skills: skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    StorageService.saveCurrentUser(updated);
    onProfileUpdated(updated);
    setIsEditing(false);
  };

  // Find projects brainstormed by this user
  const userPostedProjects = projects.filter((p) => p.brainstormerId === viewUser.id);

  // Find team assignments / project roles for this user
  const userTeamAssignments = teamMembers.filter((tm) => tm.userId === viewUser.id);

  return (
    <div id="profile-workspace" className="h-full flex flex-col overflow-y-auto text-zinc-100 p-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Profile Card Header */}
        <div className="relative bg-[#0D1424] border border-zinc-800 rounded-2xl p-6 md:p-8 overflow-hidden shadow-lg">
          {/* Subtle decorative mesh background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
              <div className="relative">
                <img
                  src={viewUser.avatarUrl}
                  alt={viewUser.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-zinc-700 shadow-xl"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-cyan-500 text-zinc-950 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-zinc-900">
                  ✓
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-extrabold text-white">
                    {viewUser.name}
                  </h1>
                  {/* Mosaic ID Badge (Section 15) */}
                  <span
                    id="profile-mosaic-id"
                    className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60"
                  >
                    {viewUser.mosaicId}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-zinc-300 font-medium mt-1">
                  {viewUser.targetedRole}
                </p>

                {/* College / Degree / Year (Section 16) */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-zinc-400">
                  {viewUser.college && (
                    <span className="flex items-center space-x-1">
                      <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{viewUser.college}</span>
                    </span>
                  )}
                  {viewUser.degree && (
                    <span>• {viewUser.degree}</span>
                  )}
                  {viewUser.yearOfStudy && (
                    <span>• {viewUser.yearOfStudy}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions: Edit or Follow + Chat */}
            <div className="flex items-center space-x-2.5 flex-shrink-0">
              {isOwnProfile ? (
                <button
                  id="profile-edit-btn"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 rounded-xl transition flex items-center space-x-1.5 border border-zinc-700 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    id="profile-follow-btn"
                    onClick={() => onFollowToggle(viewUser.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer ${
                      isFollowing
                        ? 'bg-zinc-800 hover:bg-red-950/60 hover:text-red-300 text-cyan-300 border border-cyan-500/40'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-md shadow-cyan-500/20'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  <button
                    id="profile-message-btn"
                    onClick={() => onStartChatWithUser(viewUser.id)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 rounded-xl transition flex items-center space-x-1.5 border border-zinc-700 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Message</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Social Links & Counters (Sections 16, 24, 25) */}
          <div className="mt-6 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6 text-xs">
              <div>
                <span className="text-base font-extrabold text-white mr-1.5">
                  {viewUser.followersCount}
                </span>
                <span className="text-zinc-400">Followers</span>
              </div>
              <div>
                <span className="text-base font-extrabold text-white mr-1.5">
                  {viewUser.followingCount}
                </span>
                <span className="text-zinc-400">Following</span>
              </div>
            </div>

            {/* External Links */}
            <div className="flex items-center space-x-3">
              {viewUser.linkedinUrl && (
                <a
                  href={viewUser.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg text-xs text-[#0077b5] transition"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}

              {viewUser.githubUrl && (
                <a
                  href={viewUser.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg text-xs text-zinc-300 transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {viewUser.bio && (
          <div className="p-6 bg-[#0C1220] border border-zinc-800 rounded-2xl">
            <h3 className="text-xs uppercase font-mono tracking-wider text-zinc-500 mb-2">
              About & Trajectory
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {viewUser.bio}
            </p>
          </div>
        )}

        {/* Skills */}
        <div className="p-6 bg-[#0C1220] border border-zinc-800 rounded-2xl">
          <h3 className="text-xs uppercase font-mono tracking-wider text-zinc-500 mb-3">
            Core Competencies & Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {viewUser.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-700/80 text-cyan-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Roles Held in Projects (Section 16) */}
        <div className="p-6 bg-[#0C1220] border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <Puzzle className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Project Roles & Assembled Pieces</h3>
          </div>

          {userTeamAssignments.length === 0 && userPostedProjects.length === 0 ? (
            <p className="text-xs text-zinc-500">
              No active project team participations yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Brainstormer Projects */}
              {userPostedProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onOpenProject(p.id)}
                  className="p-4 bg-[#0F1626] border border-zinc-800 hover:border-cyan-500/40 rounded-xl transition cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[180px]">{p.title}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 font-mono text-[10px]">
                      Brainstormer / Lead
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{p.tagline}</p>
                </div>
              ))}

              {/* Contributor Roles */}
              {userTeamAssignments.map((tm) => (
                <div
                  key={`${tm.projectId}-${tm.projectRole}`}
                  onClick={() => onOpenProject(tm.projectId)}
                  className="p-4 bg-[#0F1626] border border-zinc-800 hover:border-cyan-500/40 rounded-xl transition cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[180px]">
                      {tm.projectTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 font-mono text-[10px]">
                      Role: {tm.projectRole}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Active Collaborator</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- EDIT PROFILE MODAL --- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <div className="relative w-full max-w-lg bg-[#0F1626] border border-zinc-700/90 rounded-2xl shadow-2xl p-6 text-zinc-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">Edit Your Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3.5 text-left text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Targeted Role / Title</label>
                <input
                  type="text"
                  value={targetedRole}
                  onChange={(e) => setTargetedRole(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">College / University</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Degree / Branch</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Year of Study</label>
                  <input
                    type="text"
                    placeholder="e.g. 3rd Year (Class of 2026)"
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-xl"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
