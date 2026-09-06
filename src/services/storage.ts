/**
 * Mosaic Local Persistence & Service Layer
 * "Every role is a piece."
 * Implements persistent localStorage management with rich default prototype seeds.
 */

import {
  User,
  Project,
  ProjectApplication,
  NotificationItem,
  ProjectUpdate,
  ChatConversation,
  ChatMessage,
  TeamMember,
} from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'mosaic_current_user',
  USERS: 'mosaic_users',
  PROJECTS: 'mosaic_projects',
  APPLICATIONS: 'mosaic_applications',
  NOTIFICATIONS: 'mosaic_notifications',
  UPDATES: 'mosaic_updates',
  CONVERSATIONS: 'mosaic_conversations',
  MESSAGES: 'mosaic_messages',
  FOLLOWING: 'mosaic_following', // Array of user IDs followed by current user
  GUIDE_COMPLETED: 'mosaic_user_guide_completed',
  AUTH_TOKEN: 'mosaic_auth_token',
};

// Initial Seed Users
const SEED_USERS: User[] = [
  {
    id: 'user-arjun',
    mosaicId: '@arjun.ai',
    name: 'Arjun Rao',
    email: 'arjun@mosaic.dev',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    targetedRole: 'Machine Learning Engineer',
    college: 'IIT Madras',
    course: 'B.Tech Electrical & Computer Engineering',
    year: '4th Year (Class of 2026)',
    about: 'Obsessed with deploying compact diffusion models and edge bioacoustics models on low-power devices. Building AetherLens to track biodiversity.',
    skills: ['PyTorch', 'TensorRT', 'Edge Computing', 'FastAPI', 'Python', 'C++'],
    portfolioLinks: [
      { label: 'GitHub', url: 'https://github.com' },
      { label: 'arXiv Papers', url: 'https://arxiv.org' }
    ],
    linkedinUrl: 'https://linkedin.com/in/arjun-rao-ai',
    followersCount: 142,
    followingCount: 38,
    joinedDate: 'Feb 2026',
    isVerified: true,
  },
  {
    id: 'user-maya',
    mosaicId: '@maya.ux',
    name: 'Maya Lin',
    email: 'maya@mosaic.dev',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    targetedRole: 'Lead Product Designer',
    college: 'National Institute of Design',
    course: 'M.Des Interaction Design',
    year: 'Postgrad (Class of 2026)',
    about: 'Crafting spatial audio canvases, micro-interactions, and accessible design tokens. Believes UI should breathe and feel physical.',
    skills: ['Figma', 'Design Systems', 'Spatial UI', 'Prototyping', 'Tailwind', 'Motion Design'],
    portfolioLinks: [
      { label: 'Personal Portfolio', url: 'https://readcv.com' },
      { label: 'Dribbble', url: 'https://dribbble.com' }
    ],
    linkedinUrl: 'https://linkedin.com/in/mayalin-ux',
    followersCount: 289,
    followingCount: 64,
    joinedDate: 'Jan 2026',
    isVerified: true,
  },
  {
    id: 'user-elena',
    mosaicId: '@elena_code',
    name: 'Elena Rostova',
    email: 'elena@mosaic.dev',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    targetedRole: 'Systems & Graphics Engineer',
    college: 'ETH Zürich',
    course: 'M.Sc Computer Science',
    year: '1st Year Masters',
    about: 'Writing WebGPU compute pipelines and high-performance Rust kernels. Exploring procedural terrain synthesis in real-time browsers.',
    skills: ['Rust', 'WebGPU', 'TypeScript', 'WGSL', 'WebGL', 'Wasm'],
    portfolioLinks: [
      { label: 'ShaderToy Works', url: 'https://shadertoy.com' }
    ],
    linkedinUrl: 'https://linkedin.com/in/elena-rostova',
    followersCount: 95,
    followingCount: 42,
    joinedDate: 'Mar 2026',
    isVerified: true,
  },
  {
    id: 'user-marcus',
    mosaicId: '@dev_marcus',
    name: 'Marcus Vance',
    email: 'marcus@mosaic.dev',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    targetedRole: 'Embedded IoT & Hardware Specialist',
    college: 'Carnegie Mellon University',
    course: 'B.S. Robotics & Mechatronics',
    year: '3rd Year',
    about: 'Designing ESP32 telemetry sensor mesh networks and solar battery harvesters. Hardware prototyping meets low-latency telemetry.',
    skills: ['ESP32', 'FreeRTOS', 'KiCad', 'MQTT', 'C/C++', 'Circuit Prototyping'],
    portfolioLinks: [
      { label: 'Hardware Lab Log', url: 'https://github.com' }
    ],
    linkedinUrl: 'https://linkedin.com/in/marcus-vance',
    followersCount: 67,
    followingCount: 29,
    joinedDate: 'Mar 2026',
    isVerified: true,
  },
  {
    id: 'user-priya',
    mosaicId: '@priya.fin',
    name: 'Priya Sharma',
    email: 'priya@mosaic.dev',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    targetedRole: 'Full Stack & Quant Developer',
    college: 'UC Berkeley',
    course: 'B.A. Economics & Computer Science',
    year: '3rd Year',
    about: 'Democratizing student grant distribution and milestone escrow contracts. Focused on clean user journeys and transparent ledger records.',
    skills: ['Solidity', 'Next.js', 'PostgreSQL', 'Ethers.js', 'Tailwind', 'Go'],
    portfolioLinks: [
      { label: 'Grant Explorer', url: 'https://github.com' }
    ],
    linkedinUrl: 'https://linkedin.com/in/priyasharma',
    followersCount: 114,
    followingCount: 51,
    joinedDate: 'Feb 2026',
    isVerified: true,
  },
];

// Initial Seed Projects
const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'AetherLens — Edge Bioacoustics for Forest Conservation',
    tagline: 'Autonomous audio capture and acoustic classification of endangered avian species.',
    description: 'We are engineering low-power edge sensor boxes that continuously capture environmental soundscapes, run quantized neural audio classifiers on-chip, and relay species identification telemetry via LoRa mesh networks to conservation teams. We need passionate builders to take our test bench into field trials.',
    brainstormerId: 'user-arjun',
    brainstormerName: 'Arjun Rao',
    brainstormerMosaicId: '@arjun.ai',
    brainstormerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    postedDate: 'Yesterday',
    status: 'Recruiting',
    category: 'Climate & IoT',
    tags: ['Edge AI', 'Audio ML', 'LoRa', 'Embedded Systems', 'Conservation'],
    meetingRhythm: 'Weekly standup (Saturdays 10 AM EST) + asynchronous Discord sprint',
    targetDuration: '10 weeks (prototype submission ready)',
    rolesRequired: [
      {
        id: 'role-1a',
        title: 'Embedded Firmware Developer',
        description: 'Implement audio circular buffers and power sleep cycles on Nordic nRF5340 / ESP32-S3.',
        slots: 1,
        filledSlots: 0,
        skillsNeeded: ['C/C++', 'FreeRTOS', 'I2S Audio', 'Power Optimization'],
      },
      {
        id: 'role-1b',
        title: 'Frontend Telemetry Engineer',
        description: 'Build real-time map visualization and spectrogram rendering dashboard.',
        slots: 2,
        filledSlots: 1,
        skillsNeeded: ['React', 'TypeScript', 'Canvas / WebGL', 'Mapbox'],
      },
      {
        id: 'role-1c',
        title: 'Machine Learning Researcher',
        description: 'Quantize PyTorch Audio Spectrogram Transformer for edge microcontrollers.',
        slots: 1,
        filledSlots: 0,
        skillsNeeded: ['PyTorch', 'TensorFlow Lite Micro', 'Digital Signal Processing'],
      },
    ],
  },
  {
    id: 'proj-2',
    title: 'Cadence — Spatial Sound Studio for Ambient Coders',
    tagline: 'Binaural generative soundscape builder designed for deep-focus development sprints.',
    description: 'Cadence re-imagines how developers listen to audio while writing code. Instead of repetitive static loops, Cadence dynamically assembles generative stems (soft rhodes, tape hiss, ambient rain, analog modular chirps) influenced by your Git commit frequency and typing cadence.',
    brainstormerId: 'user-maya',
    brainstormerName: 'Maya Lin',
    brainstormerMosaicId: '@maya.ux',
    brainstormerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    postedDate: '3 days ago',
    status: 'Recruiting',
    category: 'Design & UX',
    tags: ['Web Audio API', 'Spatial Sound', 'Design Systems', 'Generative Music'],
    meetingRhythm: 'Twice weekly critique and sprint syncing via Google Meet',
    targetDuration: '8 weeks',
    rolesRequired: [
      {
        id: 'role-2a',
        title: 'Web Audio DSP Engineer',
        description: 'Craft node-based audio synthesis graph with custom biquad filters and binaural panners.',
        slots: 1,
        filledSlots: 0,
        skillsNeeded: ['Web Audio API', 'Tone.js', 'DSP', 'JavaScript/TypeScript'],
      },
      {
        id: 'role-2b',
        title: 'Interaction & Visual Designer',
        description: 'Design tactile dial controls, glass sound-source nodes, and darkroom workspace layout.',
        slots: 1,
        filledSlots: 0,
        skillsNeeded: ['Figma', 'Tailwind', 'Micro-interactions', 'Motion'],
      },
      {
        id: 'role-2c',
        title: 'Full Stack Integration Lead',
        description: 'Handle user preset saving, cloud stem delivery, and OAuth authentication.',
        slots: 1,
        filledSlots: 1,
        skillsNeeded: ['Node.js', 'Express', 'Cloudflare Workers', 'S3'],
      },
    ],
  },
  {
    id: 'proj-3',
    title: 'Prism Engine — Realtime WebGPU Geometry Shader Sandbox',
    tagline: 'Instant browser playground for compute shaders, volumetric fluid, and fractals.',
    description: 'Building an open-source collaborative code editor where graphics students can write WGSL compute shaders, see 60fps volumetric simulations in real-time, inspect intermediate render passes, and share interactive snippets with live feedback.',
    brainstormerId: 'user-elena',
    brainstormerName: 'Elena Rostova',
    brainstormerMosaicId: '@elena_code',
    brainstormerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    postedDate: '5 days ago',
    status: 'Recruiting',
    category: 'Web & Cloud',
    tags: ['WebGPU', 'WGSL', 'Graphics', 'Monaco Editor', 'Compilers'],
    meetingRhythm: 'Asynchronous GitHub Pull Request reviews + weekly Friday hack hour',
    targetDuration: '12 weeks',
    rolesRequired: [
      {
        id: 'role-3a',
        title: 'Compute Shader Specialist',
        description: 'Author sample pipelines for Smoothed-Particle Hydrodynamics and Ray Marching.',
        slots: 2,
        filledSlots: 0,
        skillsNeeded: ['WebGPU', 'WGSL / HLSL', 'Linear Algebra', 'Graphics Programming'],
      },
      {
        id: 'role-3b',
        title: 'Frontend IDE Architect',
        description: 'Integrate Monaco code editor, syntax highlighting, diagnostics, and multi-tab render view.',
        slots: 1,
        filledSlots: 0,
        skillsNeeded: ['React', 'Monaco Editor', 'TypeScript', 'Tailwind'],
      },
    ],
  },
  {
    id: 'proj-4',
    title: 'FinMosaic — Peer Micro-Grants & Milestone Escrow',
    tagline: 'Transparent milestone-locked funding pool for collegiate open-source projects.',
    description: 'Student builders often need small sums ($100-$500) for PCB manufacturing, domain names, or cloud compute credits. FinMosaic pools micro-grants from alumni and unlocks funds automatically when verified milestones and pull requests are approved by peers.',
    brainstormerId: 'user-priya',
    brainstormerName: 'Priya Sharma',
    brainstormerMosaicId: '@priya.fin',
    brainstormerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    postedDate: '1 week ago',
    status: 'Recruiting',
    category: 'FinTech & Web3',
    tags: ['Smart Contracts', 'Escrow', 'Open Source', 'Microfinance'],
    meetingRhythm: 'Weekly Tuesday sync at 6 PM PST',
    targetDuration: '6 weeks',
    rolesRequired: [
      {
        id: 'role-4a',
        title: 'Backend API Architect',
        description: 'Design idempotent transaction APIs and webhook listeners for GitHub milestone triggers.',
        slots: 1,
        filledSlots: 0,
        skillsNeeded: ['FastAPI / Express', 'PostgreSQL', 'GitHub REST API', 'Docker'],
      },
      {
        id: 'role-4b',
        title: 'Product Designer',
        description: 'Create intuitive milestone approval cards, donor leaderboards, and receipts.',
        slots: 1,
        filledSlots: 0,
        skillsNeeded: ['Figma', 'UI/UX', 'Financial Dashboard Design'],
      },
    ],
  },
  {
    id: 'proj-5',
    title: 'HydroGrid — Distributed Campus Water Telemetry Mesh',
    tagline: 'Ultrasonic flow sensors and turbidity telemetry for sustainable university water grids.',
    description: 'We have installed pilot ultrasonic flow meters across three residential halls to detect hidden plumbing leaks and water waste in real-time. We are expanding to monitor drinking fountains and cooling towers across campus.',
    brainstormerId: 'user-marcus',
    brainstormerName: 'Marcus Vance',
    brainstormerMosaicId: '@dev_marcus',
    brainstormerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    postedDate: '2 weeks ago',
    status: 'In Progress',
    category: 'Climate & IoT',
    tags: ['IoT', 'Sensors', 'Telemetry', 'Hardware', 'Sustainability'],
    meetingRhythm: 'In-person lab session on Thursdays + biweekly sprint call',
    targetDuration: 'Ongoing semester project',
    rolesRequired: [
      {
        id: 'role-5a',
        title: 'Embedded Hardware Prototyper',
        description: 'Build weather-sealed sensor housings and calibrate ultrasonic transit-time meters.',
        slots: 1,
        filledSlots: 1,
        skillsNeeded: ['Soldering', 'CAD / 3D Printing', 'Analog Electronics'],
      },
      {
        id: 'role-5b',
        title: 'Data Visualizer & Frontend Lead',
        description: 'Display live campus water consumption graphs and automated leak alert notifications.',
        slots: 1,
        filledSlots: 0,
        skillsNeeded: ['React', 'D3.js / Recharts', 'WebSockets', 'Tailwind'],
      },
    ],
  },
];

// Helper to initialize local storage safely
export class StorageService {
  static isInitialized(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.USERS);
  }

  static initSeeds() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.UPDATES)) {
      const initialUpdates: ProjectUpdate[] = [
        {
          id: 'upd-1',
          projectId: 'proj-1',
          projectTitle: 'AetherLens — Edge Bioacoustics for Forest Conservation',
          authorId: 'user-arjun',
          authorMosaicId: '@arjun.ai',
          authorName: 'Arjun Rao',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          title: 'Benchmarked 8-bit quantized Audio Spectrogram Transformer',
          content: 'Exciting breakthrough! We successfully ran the quantized model at 42ms inference on the nRF5340 board while maintaining 91.4% top-1 accuracy on our Costa Rican bird chirps dataset.',
          timestamp: '2 hours ago',
          tag: 'Milestone',
        },
        {
          id: 'upd-2',
          projectId: 'proj-2',
          projectTitle: 'Cadence — Spatial Sound Studio for Ambient Coders',
          authorId: 'user-maya',
          authorMosaicId: '@maya.ux',
          authorName: 'Maya Lin',
          authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
          title: 'New interactive soundboard tokens in Figma',
          content: 'Completed the complete token architecture for Cadence darkroom theme. Stems now have physical spring physics when rearranged on the spatial grid.',
          timestamp: 'Yesterday',
          tag: 'Release',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.UPDATES, JSON.stringify(initialUpdates));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FOLLOWING)) {
      // Default follow Arjun and Maya to have dynamic feed
      localStorage.setItem(STORAGE_KEYS.FOLLOWING, JSON.stringify(['user-arjun', 'user-maya']));
    }
  }

  // Helper aliases
  static initializeDefaults() {
    this.initSeeds();
  }

  static saveCurrentUser(user: User) {
    this.setCurrentUser(user);
  }

  static getFollowing(userId?: string): string[] {
    return this.getFollowingList();
  }

  static getFollowers(userId?: string): string[] {
    const targetId = userId || this.getCurrentUser()?.id;
    if (!targetId) return [];
    // Return users that have targetId in their following list or mock seed followers
    const allUsers = this.getUsers();
    return allUsers.filter((u) => u.id !== targetId).slice(0, 3).map((u) => u.id);
  }

  static getTeamMembers(): TeamMember[] {
    const curr = this.getCurrentUser();
    if (!curr) return [];
    return this.getTeamMembersForUser(curr.id);
  }

  static createApplication(appData: Omit<ProjectApplication, 'id' | 'appliedDate' | 'status'>): ProjectApplication {
    return this.submitApplication(appData);
  }

  static acceptApplication(applicationId: string): ProjectApplication | null {
    return this.updateApplicationStatus(applicationId, 'Accepted');
  }

  static rejectApplication(applicationId: string): ProjectApplication | null {
    return this.updateApplicationStatus(applicationId, 'Rejected');
  }

  static markAllNotificationsRead(userId?: string) {
    const targetId = userId || this.getCurrentUser()?.id;
    if (targetId) {
      this.markNotificationsAsRead(targetId);
    }
  }

  // --- Current User & Auth ---
  static getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      // Ensure user is in USERS list
      const users = this.getUsers();
      const existingIdx = users.findIndex((u) => u.id === user.id);
      if (existingIdx >= 0) {
        users[existingIdx] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  static getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) return SEED_USERS;
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_USERS;
    }
  }

  static getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  static getUserByMosaicId(mosaicId: string): User | undefined {
    const clean = mosaicId.startsWith('@') ? mosaicId : `@${mosaicId}`;
    return this.getUsers().find((u) => u.mosaicId.toLowerCase() === clean.toLowerCase());
  }

  // --- Projects ---
  static getProjects(): Project[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) return SEED_PROJECTS;
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_PROJECTS;
    }
  }

  static getProjectById(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  }

  static saveProject(project: Project): Project {
    const projects = this.getProjects();
    const idx = projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      projects[idx] = project;
    } else {
      projects.unshift(project);
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));

    // Notify followers
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.broadcastProjectPostNotification(project, currentUser);
    }

    return project;
  }

  // --- Applications ---
  static getApplications(): ProjectApplication[] {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static submitApplication(appData: Omit<ProjectApplication, 'id' | 'appliedDate' | 'status'>): ProjectApplication {
    const apps = this.getApplications();
    const newApp: ProjectApplication = {
      ...appData,
      id: 'app-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      appliedDate: 'Just now',
      status: 'Pending',
    };
    apps.unshift(newApp);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));

    // Notify project brainstormer
    const project = this.getProjectById(appData.projectId);
    if (project) {
      this.addNotification({
        userId: project.brainstormerId,
        type: 'application_received',
        title: 'New Role Application',
        message: `${appData.applicantName} (${appData.applicantMosaicId}) applied for "${appData.appliedRoleTitle}" on ${project.title}`,
        relatedProjectId: project.id,
        relatedUserId: appData.applicantId,
        linkView: 'my_applicants',
      });
    }

    return newApp;
  }

  static updateApplicationStatus(applicationId: string, newStatus: 'Accepted' | 'Rejected'): ProjectApplication | null {
    const apps = this.getApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (!app) return null;

    app.status = newStatus;
    app.decisionDate = 'Just now';
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));

    // If accepted, update the project role filled slots
    if (newStatus === 'Accepted') {
      const projects = this.getProjects();
      const proj = projects.find((p) => p.id === app.projectId);
      if (proj) {
        const role = proj.rolesRequired.find((r) => r.id === app.roleId || r.title === app.appliedRoleTitle);
        if (role) {
          role.filledSlots = Math.min(role.slots, role.filledSlots + 1);
          if (!role.assignedUserIds) role.assignedUserIds = [];
          if (!role.assignedUserIds.includes(app.applicantId)) {
            role.assignedUserIds.push(app.applicantId);
          }
          localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        }
      }
    }

    // Notify applicant
    this.addNotification({
      userId: app.applicantId,
      type: 'application_status',
      title: `Application ${newStatus}`,
      message: `Your application for "${app.appliedRoleTitle}" on ${app.projectTitle} was ${newStatus.toLowerCase()}.`,
      relatedProjectId: app.projectId,
      linkView: 'my_projects',
    });

    return app;
  }

  // --- Team Members ---
  static getTeamMembersForUser(userId: string): TeamMember[] {
    const teams: TeamMember[] = [];
    const projects = this.getProjects();
    const apps = this.getApplications().filter((a) => a.status === 'Accepted');

    // Projects where this user is brainstormer
    const ownedProjects = projects.filter((p) => p.brainstormerId === userId);
    for (const proj of ownedProjects) {
      // The brainstormer themselves
      const bUser = this.getUserById(proj.brainstormerId);
      if (bUser) {
        teams.push({
          userId: bUser.id,
          mosaicId: bUser.mosaicId,
          name: bUser.name + ' (Brainstormer)',
          avatarUrl: bUser.avatarUrl,
          targetedRole: bUser.targetedRole,
          projectRole: 'Project Lead',
          projectId: proj.id,
          projectTitle: proj.title,
          joinedDate: proj.postedDate,
        });
      }

      // Accepted applicants
      const projApps = apps.filter((a) => a.projectId === proj.id);
      for (const a of projApps) {
        teams.push({
          userId: a.applicantId,
          mosaicId: a.applicantMosaicId,
          name: a.applicantName,
          avatarUrl: a.applicantAvatar,
          targetedRole: a.applicantRole,
          projectRole: a.appliedRoleTitle,
          projectId: proj.id,
          projectTitle: proj.title,
          joinedDate: a.decisionDate || 'Recently',
        });
      }
    }

    // Projects where this user was accepted as applicant
    const userAcceptedApps = apps.filter((a) => a.applicantId === userId);
    for (const a of userAcceptedApps) {
      const proj = projects.find((p) => p.id === a.projectId);
      if (proj && proj.brainstormerId !== userId) {
        // Brainstormer of that project
        const bUser = this.getUserById(proj.brainstormerId);
        if (bUser) {
          teams.push({
            userId: bUser.id,
            mosaicId: bUser.mosaicId,
            name: bUser.name + ' (Brainstormer)',
            avatarUrl: bUser.avatarUrl,
            targetedRole: bUser.targetedRole,
            projectRole: 'Project Lead',
            projectId: proj.id,
            projectTitle: proj.title,
            joinedDate: proj.postedDate,
          });
        }
        // The user themselves
        const curr = this.getUserById(userId);
        if (curr) {
          teams.push({
            userId: curr.id,
            mosaicId: curr.mosaicId,
            name: curr.name,
            avatarUrl: curr.avatarUrl,
            targetedRole: curr.targetedRole,
            projectRole: a.appliedRoleTitle,
            projectId: proj.id,
            projectTitle: proj.title,
            joinedDate: a.decisionDate || 'Recently',
          });
        }
      }
    }

    // De-duplicate if needed
    return teams;
  }

  // --- Following & Followers ---
  static getFollowingList(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FOLLOWING);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static isFollowing(userId: string): boolean {
    return this.getFollowingList().includes(userId);
  }

  static toggleFollow(targetUserId: string): boolean {
    const following = this.getFollowingList();
    const currentUser = this.getCurrentUser();
    let isNowFollowing = false;

    if (following.includes(targetUserId)) {
      const next = following.filter((id) => id !== targetUserId);
      localStorage.setItem(STORAGE_KEYS.FOLLOWING, JSON.stringify(next));
      isNowFollowing = false;
      // Decrement target user follower count
      this.adjustFollowerCount(targetUserId, -1);
      if (currentUser) {
        currentUser.followingCount = Math.max(0, (currentUser.followingCount || 1) - 1);
        this.setCurrentUser(currentUser);
      }
    } else {
      following.push(targetUserId);
      localStorage.setItem(STORAGE_KEYS.FOLLOWING, JSON.stringify(following));
      isNowFollowing = true;
      // Increment target user follower count
      this.adjustFollowerCount(targetUserId, 1);
      if (currentUser) {
        currentUser.followingCount = (currentUser.followingCount || 0) + 1;
        this.setCurrentUser(currentUser);

        // Notify target user
        this.addNotification({
          userId: targetUserId,
          type: 'new_follower',
          title: 'New Follower',
          message: `${currentUser.name} (${currentUser.mosaicId}) started following you on Mosaic.`,
          relatedUserId: currentUser.id,
          linkView: 'followers',
        });
      }
    }

    return isNowFollowing;
  }

  private static adjustFollowerCount(userId: string, delta: number) {
    const users = this.getUsers();
    const u = users.find((x) => x.id === userId);
    if (u) {
      u.followersCount = Math.max(0, (u.followersCount || 0) + delta);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }

  // --- Notifications ---
  static getNotifications(userId?: string): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    let all: NotificationItem[] = [];
    if (raw) {
      try {
        all = JSON.parse(raw);
      } catch {
        all = [];
      }
    }
    if (!userId) return all;
    return all.filter((n) => n.userId === userId);
  }

  static addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const notifs = this.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: 'Just now',
      read: false,
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return newNotif;
  }

  static markNotificationsAsRead(userId: string) {
    const notifs = this.getNotifications();
    for (const n of notifs) {
      if (n.userId === userId) {
        n.read = true;
      }
    }
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  static broadcastProjectPostNotification(project: Project, author: User) {
    // Notify all mock users or system followers
    const notifs = this.getNotifications();
    // Simulate notifying users that follow the author
    const newNotif: NotificationItem = {
      id: 'notif-bc-' + Date.now(),
      userId: 'user-broadcast', // General or target
      type: 'new_project_posted',
      title: 'New Project from followed Brainstormer',
      message: `${author.name} (${author.mosaicId}) just posted: "${project.title}"`,
      timestamp: 'Just now',
      read: false,
      relatedProjectId: project.id,
      linkView: 'project_detail',
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  // --- Updates ---
  static getUpdates(): ProjectUpdate[] {
    const raw = localStorage.getItem(STORAGE_KEYS.UPDATES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static addUpdate(update: Omit<ProjectUpdate, 'id' | 'timestamp'>): ProjectUpdate {
    const updates = this.getUpdates();
    const newUpdate: ProjectUpdate = {
      ...update,
      id: 'upd-' + Date.now(),
      timestamp: 'Just now',
    };
    updates.unshift(newUpdate);
    localStorage.setItem(STORAGE_KEYS.UPDATES, JSON.stringify(updates));
    return newUpdate;
  }

  // --- Chatroom & Conversations ---
  static getConversations(currentUserId: string): ChatConversation[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    let convs: ChatConversation[] = [];
    if (raw) {
      try {
        convs = JSON.parse(raw);
      } catch {
        convs = [];
      }
    }

    // If none exist for this user, seed an initial introductory conversation with Arjun or Maya
    if (convs.length === 0 && currentUserId) {
      const arjun = this.getUserById('user-arjun') || SEED_USERS[0];
      const maya = this.getUserById('user-maya') || SEED_USERS[1];
      const user = this.getUserById(currentUserId);

      if (user) {
        const initialConv1: ChatConversation = {
          id: `conv-${currentUserId}-${arjun.id}`,
          participantIds: [currentUserId, arjun.id],
          participantData: {
            [currentUserId]: {
              name: user.name,
              mosaicId: user.mosaicId,
              avatarUrl: user.avatarUrl,
              targetedRole: user.targetedRole,
            },
            [arjun.id]: {
              name: arjun.name,
              mosaicId: arjun.mosaicId,
              avatarUrl: arjun.avatarUrl,
              targetedRole: arjun.targetedRole,
            },
          },
          lastMessage: 'Welcome to Mosaic! Happy to discuss roles on AetherLens anytime.',
          lastMessageTime: '10:45 AM',
          unreadCount: 1,
        };

        const initialConv2: ChatConversation = {
          id: `conv-${currentUserId}-${maya.id}`,
          participantIds: [currentUserId, maya.id],
          participantData: {
            [currentUserId]: {
              name: user.name,
              mosaicId: user.mosaicId,
              avatarUrl: user.avatarUrl,
              targetedRole: user.targetedRole,
            },
            [maya.id]: {
              name: maya.name,
              mosaicId: maya.mosaicId,
              avatarUrl: maya.avatarUrl,
              targetedRole: maya.targetedRole,
            },
          },
          lastMessage: 'Love your portfolio! Are you interested in spatial UI work?',
          lastMessageTime: 'Yesterday',
          unreadCount: 0,
        };

        convs = [initialConv1, initialConv2];
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));

        // Seed messages
        const initialMessages: ChatMessage[] = [
          {
            id: 'msg-1',
            conversationId: initialConv1.id,
            senderId: arjun.id,
            senderMosaicId: arjun.mosaicId,
            text: 'Hey! Glad you joined Mosaic. Every role is a piece, so if you see an open slot on AetherLens let me know!',
            timestamp: '10:44 AM',
          },
          {
            id: 'msg-2',
            conversationId: initialConv1.id,
            senderId: arjun.id,
            senderMosaicId: arjun.mosaicId,
            text: 'Welcome to Mosaic! Happy to discuss roles on AetherLens anytime.',
            timestamp: '10:45 AM',
          },
          {
            id: 'msg-3',
            conversationId: initialConv2.id,
            senderId: maya.id,
            senderMosaicId: maya.mosaicId,
            text: 'Love your portfolio! Are you interested in spatial UI work?',
            timestamp: 'Yesterday',
          },
        ];
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initialMessages));
      }
    }

    return convs.filter((c) => c.participantIds.includes(currentUserId));
  }

  static getOrCreateConversation(currentUserId: string, targetUserId: string): ChatConversation {
    const convs = this.getConversations(currentUserId);
    const existing = convs.find(
      (c) => c.participantIds.includes(currentUserId) && c.participantIds.includes(targetUserId)
    );
    if (existing) return existing;

    const user1 = this.getUserById(currentUserId);
    const user2 = this.getUserById(targetUserId);

    const newConv: ChatConversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      participantIds: [currentUserId, targetUserId],
      participantData: {
        [currentUserId]: {
          name: user1?.name || 'You',
          mosaicId: user1?.mosaicId || '@you',
          avatarUrl: user1?.avatarUrl || '',
          targetedRole: user1?.targetedRole || 'Member',
        },
        [targetUserId]: {
          name: user2?.name || 'User',
          mosaicId: user2?.mosaicId || '@user',
          avatarUrl: user2?.avatarUrl || '',
          targetedRole: user2?.targetedRole || 'Member',
        },
      },
      lastMessage: 'Conversation started',
      lastMessageTime: 'Just now',
      unreadCount: 0,
    };

    const allRaw = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    let allConvs: ChatConversation[] = allRaw ? JSON.parse(allRaw) : [];
    allConvs.unshift(newConv);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(allConvs));

    return newConv;
  }

  static getMessages(conversationId: string): ChatMessage[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!raw) return [];
    try {
      const all: ChatMessage[] = JSON.parse(raw);
      return all.filter((m) => m.conversationId === conversationId);
    } catch {
      return [];
    }
  }

  static sendMessage(conversationId: string, senderId: string, senderMosaicId: string, text: string): ChatMessage {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const all: ChatMessage[] = raw ? JSON.parse(raw) : [];

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      conversationId,
      senderId,
      senderMosaicId,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    all.push(newMsg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));

    // Update conversation lastMessage
    const convRaw = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (convRaw) {
      const convs: ChatConversation[] = JSON.parse(convRaw);
      const c = convs.find((item) => item.id === conversationId);
      if (c) {
        c.lastMessage = text.trim();
        c.lastMessageTime = newMsg.timestamp;
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
      }
    }

    return newMsg;
  }

  // --- User Guide Walkthrough Persistence ---
  static isUserGuideCompleted(): boolean {
    return localStorage.getItem(STORAGE_KEYS.GUIDE_COMPLETED) === 'true';
  }

  static setUserGuideCompleted(completed: boolean) {
    localStorage.setItem(STORAGE_KEYS.GUIDE_COMPLETED, completed ? 'true' : 'false');
  }
}

// Initialize seed data on load
StorageService.initSeeds();
