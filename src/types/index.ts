/**
 * Mosaic Application Domain Types
 * "Every role is a piece."
 */

export interface User {
  id: string;
  mosaicId: string; // e.g. @sashmitha
  name: string;
  email: string;
  avatarUrl: string;
  targetedRole: string;
  college?: string;
  course?: string;
  year?: string;
  about?: string;
  skills: string[];
  portfolioLinks: { label: string; url: string }[];
  linkedinUrl?: string;
  followersCount: number;
  followingCount: number;
  joinedDate: string;
  isVerified?: boolean;
}

export interface ProjectRole {
  id: string;
  title: string;
  description: string;
  slots: number;
  filledSlots: number;
  skillsNeeded: string[];
  assignedUserIds?: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  brainstormerId: string;
  brainstormerName: string;
  brainstormerMosaicId: string;
  brainstormerAvatar: string;
  postedDate: string;
  status: 'Recruiting' | 'In Progress' | 'Completed';
  category: 'AI / Machine Learning' | 'Web & Cloud' | 'Climate & IoT' | 'FinTech & Web3' | 'Design & UX' | 'HealthTech' | 'Mobile Apps';
  rolesRequired: ProjectRole[];
  tags: string[];
  meetingRhythm?: string;
  targetDuration?: string;
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  projectTitle: string;
  applicantId: string;
  applicantMosaicId: string;
  applicantName: string;
  applicantAvatar: string;
  applicantRole: string;
  applicantCollege?: string;
  roleId: string;
  appliedRoleTitle: string;
  message: string;
  appliedDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  decisionDate?: string;
}

export interface TeamMember {
  userId: string;
  mosaicId: string;
  name: string;
  avatarUrl: string;
  targetedRole: string;
  projectRole: string;
  projectId: string;
  projectTitle: string;
  joinedDate: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderMosaicId: string;
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  participantIds: string[]; // [user1Id, user2Id]
  participantData: Record<string, { name: string; mosaicId: string; avatarUrl: string; targetedRole: string }>;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'application_received' | 'application_status' | 'new_follower' | 'new_project_posted' | 'team_update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedProjectId?: string;
  relatedUserId?: string;
  linkView?: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  projectTitle: string;
  authorId: string;
  authorMosaicId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  timestamp: string;
  tag: 'Milestone' | 'Recruitment' | 'Release' | 'Announcement';
}

export type ActiveWorkspaceView =
  | 'main'
  | 'project_detail'
  | 'my_projects'
  | 'my_applicants'
  | 'chatroom'
  | 'team'
  | 'notifications'
  | 'updates'
  | 'profile'
  | 'other_profile'
  | 'followers'
  | 'following';
