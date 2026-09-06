import React, { useState } from 'react';
import {
  UserCheck,
  UserPlus,
  MessageSquare,
  Search,
  ExternalLink,
  Users,
} from 'lucide-react';
import { User } from '../../types';

interface SocialConnectionsViewProps {
  type: 'followers' | 'following';
  usersList: User[];
  currentUser: User | null;
  onOpenUserProfile: (mosaicId: string) => void;
  onStartChatWithUser: (targetUserId: string) => void;
  onFollowToggle: (targetUserId: string) => void;
  isFollowing: (userId: string) => boolean;
  onSwitchType: (type: 'followers' | 'following') => void;
}

export const SocialConnectionsView: React.FC<SocialConnectionsViewProps> = ({
  type,
  usersList,
  currentUser,
  onOpenUserProfile,
  onStartChatWithUser,
  onFollowToggle,
  isFollowing,
  onSwitchType,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = usersList.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.mosaicId.toLowerCase().includes(q) ||
      u.targetedRole.toLowerCase().includes(q) ||
      (u.college && u.college.toLowerCase().includes(q))
    );
  });

  return (
    <div id="social-connections-workspace" className="h-full flex flex-col overflow-hidden text-zinc-100">
      {/* Subheader */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-zinc-800/80 bg-[#0B101D]/70 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white">
              {type === 'followers' ? 'Your Followers' : 'Users You Follow'}
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 rounded-md">
              {usersList.length} Connected
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {type === 'followers'
              ? 'Collaborators and student brainstormers tracking your project contributions.'
              : 'Students, leads, and builders you are following across Mosaic.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            onClick={() => onSwitchType('followers')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              type === 'followers'
                ? 'bg-cyan-500 text-zinc-950 shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => onSwitchType('following')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              type === 'following'
                ? 'bg-cyan-500 text-zinc-950 shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Following
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-zinc-800/60 bg-[#0C1222]/40">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-900/80 border border-zinc-700/70 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20">
            <Users className="w-10 h-10 text-zinc-600 mb-2" />
            <h3 className="text-sm font-semibold text-zinc-300">
              {type === 'followers' ? 'No Followers Yet' : 'Not Following Anyone Yet'}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Discover active student projects and team brainstormers on the Main Page to start expanding your network!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((user) => {
              const followingThisUser = isFollowing(user.id);
              const isCurrentUser = user.id === currentUser?.id;

              return (
                <div
                  key={user.id}
                  className="p-4 bg-[#0D1424] border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col justify-between space-y-3 transition group"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-700 flex-shrink-0"
                    />

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
                      <button
                        type="button"
                        onClick={() => onOpenUserProfile(user.mosaicId)}
                        className="text-[11px] font-mono text-cyan-400 hover:underline block truncate"
                      >
                        {user.mosaicId}
                      </button>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {user.targetedRole}
                      </p>
                      {user.college && (
                        <p className="text-[10px] text-zinc-500 truncate">
                          {user.college}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenUserProfile(user.mosaicId)}
                      className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1 transition"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {!isCurrentUser && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => onStartChatWithUser(user.id)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                          title="Message in Chatroom"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onFollowToggle(user.id)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition flex items-center space-x-1 ${
                            followingThisUser
                              ? 'bg-zinc-800 hover:bg-red-950/60 hover:text-red-300 text-cyan-300 border border-cyan-500/30'
                              : 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold'
                          }`}
                        >
                          {followingThisUser ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3" />
                              <span>Follow</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
