import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  User as UserIcon,
  Circle,
  ExternalLink,
  Smile,
} from 'lucide-react';
import { ChatConversation, ChatMessage, User } from '../../types';
import { StorageService } from '../../services/storage';

interface ChatroomViewProps {
  currentUser: User | null;
  activeConversationId?: string | null;
  onOpenUserProfile: (mosaicId: string) => void;
}

export const ChatroomView: React.FC<ChatroomViewProps> = ({
  currentUser,
  activeConversationId,
  onOpenUserProfile,
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(activeConversationId || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    if (!currentUser) return;
    const convs = StorageService.getConversations(currentUser.id);
    setConversations(convs);

    if (activeConversationId) {
      setActiveConvId(activeConversationId);
    } else if (convs.length > 0 && !activeConvId) {
      setActiveConvId(convs[0].id);
    }
  }, [currentUser, activeConversationId]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }
    const msgs = StorageService.getMessages(activeConvId);
    setMessages(msgs);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, [activeConvId]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  // Identify the other participant in this conversation
  const otherParticipantId = activeConversation?.participantIds.find(
    (id) => id !== currentUser?.id
  );
  const otherParticipant = otherParticipantId
    ? activeConversation?.participantData[otherParticipantId]
    : null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId || !currentUser) return;

    const newMsg = StorageService.sendMessage(
      activeConvId,
      currentUser.id,
      currentUser.mosaicId,
      inputText
    );

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Update conversations list preview
    setConversations(StorageService.getConversations(currentUser.id));

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const filteredConversations = conversations.filter((c) => {
    if (!currentUser) return true;
    const otherId = c.participantIds.find((id) => id !== currentUser.id);
    const data = otherId ? c.participantData[otherId] : null;
    if (!data) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      !query ||
      data.name.toLowerCase().includes(query) ||
      data.mosaicId.toLowerCase().includes(query) ||
      data.targetedRole.toLowerCase().includes(query)
    );
  });

  return (
    <div id="m-chatroom-workspace" className="h-full flex flex-col md:flex-row overflow-hidden text-zinc-100 bg-[#0A0F1B]">
      {/* Left Column: Conversations List */}
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-zinc-800/80 flex flex-col bg-[#0B101E]/90">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-extrabold tracking-tight text-white">M.Chatroom</h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            {conversations.length} Active Threads
          </span>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-zinc-800/60">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-900/80 border border-zinc-700/70 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const otherId = conv.participantIds.find((id) => id !== currentUser?.id);
              const participant = otherId ? conv.participantData[otherId] : null;
              const isActive = conv.id === activeConvId;

              if (!participant) return null;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full p-3 rounded-xl flex items-start space-x-3 text-left transition ${
                    isActive
                      ? 'bg-zinc-800/90 border border-cyan-500/40 text-white shadow-xs'
                      : 'hover:bg-zinc-850/60 text-zinc-300 border border-transparent'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={participant.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={participant.name}
                      className="w-10 h-10 rounded-xl object-cover border border-zinc-700"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-900" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold truncate text-zinc-100">
                        {participant.name}
                      </h4>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {conv.lastMessageTime || ''}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-cyan-400 truncate">
                      {participant.mosaicId}
                    </p>

                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Active Conversation Messages & Input */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0D1322]">
        {activeConversation && otherParticipant ? (
          <>
            {/* Conversation Top Header with User Identity */}
            <div className="flex-shrink-0 p-4 border-b border-zinc-800/80 bg-[#0B101F]/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={otherParticipant.avatarUrl}
                  alt={otherParticipant.name}
                  className="w-9 h-9 rounded-xl object-cover border border-zinc-700"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white">{otherParticipant.name}</h3>
                    <button
                      type="button"
                      onClick={() => onOpenUserProfile(otherParticipant.mosaicId)}
                      className="text-xs font-mono text-cyan-400 hover:underline flex items-center space-x-0.5"
                    >
                      <span>{otherParticipant.mosaicId}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {otherParticipant.targetedRole}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="flex items-center space-x-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
                  <Circle className="w-2 h-2 fill-current" />
                  <span>Online Collaborator</span>
                </span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs text-center">
                  <MessageSquare className="w-8 h-8 text-zinc-600 mb-2" />
                  <p>This is the start of your direct conversation on Mosaic.</p>
                  <p className="text-[11px] text-zinc-600 mt-1">
                    Every role is a piece — discuss tasks, shared ideas, and deliverables.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center space-x-1 text-[10px] text-zinc-500 font-mono mb-1">
                        <span>{msg.senderMosaicId}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-cyan-600 text-white rounded-br-xs shadow-md shadow-cyan-900/20'
                            : 'bg-zinc-800/90 text-zinc-100 rounded-bl-xs border border-zinc-700/60'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <div className="flex-shrink-0 p-3 md:p-4 border-t border-zinc-800/80 bg-[#0B101E]">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input
                  id="chat-message-input"
                  type="text"
                  placeholder={`Message ${otherParticipant.mosaicId}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
                />
                <button
                  id="chat-send-btn"
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-zinc-950 font-bold rounded-xl transition cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs p-6 text-center">
            <MessageSquare className="w-12 h-12 text-zinc-700 mb-3" />
            <h3 className="text-sm font-semibold text-zinc-300">Select a Conversation</h3>
            <p className="text-zinc-500 text-xs mt-1 max-w-sm">
              Choose a thread from the left or visit any user's profile to initiate a direct chat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
