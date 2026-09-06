import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Users,
  FolderGit2,
  Radio,
  Clock,
  Sparkles,
  CheckCheck,
} from 'lucide-react';
import { NotificationItem, User } from '../../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  currentUser: User | null;
  onMarkAllAsRead: () => void;
  onSelectView: (view: any) => void;
  onOpenProject: (projectId: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  currentUser,
  onMarkAllAsRead,
  onSelectView,
  onOpenProject,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'application_received':
        return <Users className="w-4 h-4 text-cyan-400" />;
      case 'application_status':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'new_follower':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'new_project_posted':
        return <FolderGit2 className="w-4 h-4 text-cyan-300" />;
      case 'team_update':
        return <Radio className="w-4 h-4 text-indigo-400" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div id="m-notifications-workspace" className="h-full flex flex-col overflow-hidden text-zinc-100">
      {/* Subheader */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-zinc-800/80 bg-[#0B101D]/70 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white">
              M.Notifications
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 rounded-md">
              {notifications.filter((n) => !n.read).length} Unread
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Role applications, acceptance decisions, new followers, and project alerts.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onMarkAllAsRead}
            className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition flex items-center space-x-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex-shrink-0 px-6 py-2.5 border-b border-zinc-800/60 bg-[#0C1222]/40 flex items-center space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
            filter === 'all'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          All Activity ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
            filter === 'unread'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Unread Only ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20">
            <Bell className="w-10 h-10 text-zinc-600 mb-2" />
            <h3 className="text-sm font-semibold text-zinc-300">No Notifications</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              {filter === 'unread'
                ? 'All caught up! No unread notifications right now.'
                : 'Activity notifications will populate here as collaborators apply to your projects and interact with your roles.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.relatedProjectId) {
                    onOpenProject(item.relatedProjectId);
                  } else if (item.linkView) {
                    onSelectView(item.linkView);
                  }
                }}
                className={`p-4 rounded-2xl border transition flex items-start space-x-3 cursor-pointer ${
                  !item.read
                    ? 'bg-[#0E1528] border-cyan-500/40 hover:border-cyan-400 shadow-xs'
                    : 'bg-[#0C111F] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                      <span>{item.title}</span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
