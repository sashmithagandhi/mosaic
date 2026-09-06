import React, { useState } from 'react';
import {
  Network,
  Puzzle,
  MessageSquare,
  ExternalLink,
  Users,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { TeamMember, User } from '../../types';

interface TeamViewProps {
  currentUser: User | null;
  teamMembers: TeamMember[];
  onOpenUserProfile: (mosaicId: string) => void;
  onStartChatWithUser: (targetUserId: string) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  currentUser,
  teamMembers,
  onOpenUserProfile,
  onStartChatWithUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Group team members by project
  const projectGroups = teamMembers.reduce((acc, member) => {
    if (!acc[member.projectId]) {
      acc[member.projectId] = {
        projectId: member.projectId,
        projectTitle: member.projectTitle,
        members: [],
      };
    }
    acc[member.projectId].members.push(member);
    return acc;
  }, {} as Record<string, { projectId: string; projectTitle: string; members: TeamMember[] }>);

  const groupsArray: { projectId: string; projectTitle: string; members: TeamMember[] }[] =
    Object.values(projectGroups);

  return (
    <div id="m-team-workspace" className="h-full flex flex-col overflow-hidden text-zinc-100">
      {/* Subheader */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-zinc-800/80 bg-[#0B101D]/70 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white">
              M.Team Workspace
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 rounded-md">
              {teamMembers.length} Assembled Pieces
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Active collaborators across your accepted project puzzles and brainstormed squads.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {groupsArray.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20">
            <Network className="w-10 h-10 text-zinc-600 mb-2" />
            <h3 className="text-sm font-semibold text-zinc-300">No Active Teams Yet</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              You will see your teammates here when your project applications are accepted, or when you accept applicants on projects you posted!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupsArray.map((group) => (
              <div
                key={group.projectId}
                className="bg-[#0C1222] border border-zinc-800/90 rounded-2xl p-5 space-y-4"
              >
                {/* Project Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Puzzle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{group.projectTitle}</h3>
                      <p className="text-[11px] text-zinc-400">
                        {group.members.length} team members active
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.map((member) => {
                    const isCurrentUser = member.userId === currentUser?.id;
                    return (
                      <div
                        key={`${member.projectId}-${member.userId}-${member.projectRole}`}
                        className="p-4 bg-[#0F1626] border border-zinc-800/80 hover:border-zinc-700 rounded-xl flex flex-col justify-between space-y-3 transition group"
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-11 h-11 rounded-xl object-cover border border-zinc-700 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <h4 className="text-xs font-bold text-white truncate">
                                {member.name}
                              </h4>
                              {isCurrentUser && (
                                <span className="text-[9px] font-mono px-1 rounded bg-zinc-800 text-zinc-400">
                                  YOU
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => onOpenUserProfile(member.mosaicId)}
                              className="text-[11px] font-mono text-cyan-400 hover:underline block truncate"
                            >
                              {member.mosaicId}
                            </button>

                            <div className="mt-1.5">
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                                Role: {member.projectRole}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                          <button
                            onClick={() => onOpenUserProfile(member.mosaicId)}
                            className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1 transition"
                          >
                            <span>Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>

                          {!isCurrentUser && (
                            <button
                              onClick={() => onStartChatWithUser(member.userId)}
                              className="px-2.5 py-1 text-xs font-semibold bg-zinc-800 hover:bg-cyan-500 hover:text-zinc-950 text-zinc-200 rounded-lg transition flex items-center space-x-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Direct Message</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
