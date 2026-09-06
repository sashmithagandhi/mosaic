import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle,
  Linkedin,
  Mail,
  User as UserIcon,
  Briefcase,
  GraduationCap,
  BookOpen,
  Calendar,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';
import { LinkedInService } from '../../services/linkedin';

interface AuthScreenProps {
  onAuthenticated?: (user: User) => void;
  onAuthComplete?: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated, onAuthComplete }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [isCracking, setIsCracking] = useState(false);

  // Sign up fields
  const [name, setName] = useState('');
  const [targetedRole, setTargetedRole] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // LinkedIn connection state
  const [isConnectingLinkedIn, setIsConnectingLinkedIn] = useState(false);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);

  // Email verification state
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [verificationError, setVerificationError] = useState('');

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('sashmithagandhi6@gmail.com');
  const [loginError, setLoginError] = useState('');

  // Error validation
  const [formError, setFormError] = useState('');

  // Trigger modular LinkedIn connection
  const handleConnectLinkedIn = async () => {
    setIsConnectingLinkedIn(true);
    try {
      const res = await LinkedInService.connectProfile(linkedinUrl);
      if (res.success && res.data) {
        setIsLinkedInConnected(true);
        if (!college && res.data.college) setCollege(res.data.college);
        if (!course && res.data.course) setCourse(res.data.course);
        if (!year && res.data.year) setYear(res.data.year);
        if (!targetedRole && res.data.headline) setTargetedRole(res.data.headline);
        if (!linkedinUrl) setLinkedinUrl(res.data.linkedinUrl);
      }
    } catch {
      // Fallback
    } finally {
      setIsConnectingLinkedIn(false);
    }
  };

  // Start signup & email verification
  const handleInitiateSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !targetedRole.trim() || !email.trim()) {
      setFormError('Please fill in all required fields (*).');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    // Generate prototype 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setVerificationStep(true);
  };

  // Complete email verification and create user
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode !== generatedCode) {
      setVerificationError('Invalid verification code. Please check and try again.');
      return;
    }

    // Format clean Mosaic ID from name or email
    const baseId = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const uniqueMosaicId = `@${baseId || 'student'}_${Math.floor(100 + Math.random() * 899)}`;

    const newUser: User = {
      id: 'user-' + Date.now(),
      mosaicId: uniqueMosaicId,
      name: name.trim(),
      email: email.trim(),
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      targetedRole: targetedRole.trim(),
      college: college.trim() || undefined,
      course: course.trim() || undefined,
      year: year.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      about: `Aspiring ${targetedRole.trim()}. Excited to collaborate with student teams on Mosaic.`,
      skills: [targetedRole.split(' ')[0], 'Git', 'Agile', 'Product Delivery'],
      portfolioLinks: [{ label: 'Personal Site', url: 'https://github.com' }],
      followersCount: 0,
      followingCount: 2, // Auto-follow seed peers
      joinedDate: 'Joined today',
      isVerified: true,
    };

    // Trigger puzzle cracking transition
    executePuzzleCrackingTransition(newUser);
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const query = loginIdentifier.trim().toLowerCase();
    if (!query) {
      setLoginError('Please enter your email or Mosaic ID.');
      return;
    }

    const users = StorageService.getUsers();
    let matchedUser = users.find(
      (u) => u.email.toLowerCase() === query || u.mosaicId.toLowerCase() === query || u.mosaicId.toLowerCase() === `@${query}`
    );

    // If not found, let the user quickly log in as default student or initialize
    if (!matchedUser) {
      // Auto-create on demand for the user email
      matchedUser = {
        id: 'user-' + Date.now(),
        mosaicId: `@${query.split('@')[0]}`,
        name: query.split('@')[0].toUpperCase(),
        email: query.includes('@') ? query : `${query}@mosaic.dev`,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        targetedRole: 'Software & Systems Engineer',
        college: 'Institute of Science & Technology',
        course: 'Computer Science',
        year: '3rd Year',
        about: 'Collaborator and product builder on Mosaic.',
        skills: ['React', 'TypeScript', 'Node.js', 'System Architecture'],
        portfolioLinks: [{ label: 'GitHub', url: 'https://github.com' }],
        followersCount: 12,
        followingCount: 5,
        joinedDate: 'Joined recently',
        isVerified: true,
      };
    }

    executePuzzleCrackingTransition(matchedUser);
  };

  // Puzzle cracking/breaking transition into main application
  const executePuzzleCrackingTransition = (user: User) => {
    setIsCracking(true);
    StorageService.setCurrentUser(user);

    setTimeout(() => {
      if (typeof onAuthenticated === 'function') {
        onAuthenticated(user);
      } else if (typeof onAuthComplete === 'function') {
        onAuthComplete(user);
      }
    }, 1100);
  };

  return (
    <div
      id="mosaic-auth-container"
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#090D14] text-zinc-100 p-4 select-none overflow-y-auto"
    >
      {/* Background ambient mosaic grid pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Puzzle Crack Overlay during transition */}
      <AnimatePresence>
        {isCracking && (
          <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
            {/* Crack fracture lines */}
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full"
            >
              <motion.path
                d="M 0 300 L 400 350 L 500 200 L 700 480 L 1200 320 L 1920 600"
                stroke="rgba(56, 189, 248, 0.85)"
                strokeWidth="2.5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              <motion.path
                d="M 500 200 L 550 0 M 700 480 L 850 1080 M 400 350 L 250 800"
                stroke="rgba(56, 189, 248, 0.6)"
                strokeWidth="1.5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              />
            </motion.svg>

            {/* Exploding puzzle quadrant fragments */}
            <motion.div
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: -280, y: -180, rotate: -15, opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#0E1420]/80 backdrop-blur-sm border-r border-b border-cyan-500/30"
            />
            <motion.div
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: 280, y: -180, rotate: 12, opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#0E1420]/80 backdrop-blur-sm border-l border-b border-cyan-500/30"
            />
            <motion.div
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: -280, y: 180, rotate: 10, opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#0E1420]/80 backdrop-blur-sm border-r border-t border-cyan-500/30"
            />
            <motion.div
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: 280, y: 180, rotate: -14, opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#0E1420]/80 backdrop-blur-sm border-l border-t border-cyan-500/30"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Main Authentication Card */}
      <motion.div
        id="mosaic-auth-card"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-xl bg-[#0F1624] border border-zinc-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 my-8"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center space-x-2 text-2xl font-extrabold tracking-[0.2em] text-white">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 rotate-45" />
            <span>MOSAIC</span>
          </div>
          <p className="text-xs tracking-wider text-zinc-400 uppercase mt-1 font-medium">
            Every role is a piece.
          </p>
        </div>

        {/* Mode Selector (Login vs Sign Up) */}
        {!verificationStep && (
          <div className="flex bg-zinc-900/80 p-1 rounded-xl mb-6 border border-zinc-800">
            <button
              id="auth-tab-signup"
              type="button"
              onClick={() => {
                setMode('signup');
                setFormError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg tracking-wider transition-all ${
                mode === 'signup'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/50'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              CREATE MOSAIC IDENTITY
            </button>
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => {
                setMode('login');
                setFormError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg tracking-wider transition-all ${
                mode === 'login'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/50'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              LOG IN
            </button>
          </div>
        )}

        {/* --- SIGN UP FORM --- */}
        {mode === 'signup' && !verificationStep && (
          <form onSubmit={handleInitiateSignup} className="space-y-4 text-left">
            {formError && (
              <div className="p-3 text-xs bg-red-950/40 border border-red-800/60 rounded-lg text-red-300">
                {formError}
              </div>
            )}

            {/* Mandatory Fields Notice */}
            <div className="flex items-center justify-between text-[11px] text-zinc-500 uppercase tracking-wider pb-1 border-b border-zinc-800/60">
              <span>Required Information (*)</span>
              <span className="text-cyan-400/80 lowercase">3 mandatory fields</span>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Full Name <span className="text-cyan-400 font-bold">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900/90 border border-zinc-700/70 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* Targeted Role */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Targeted Role <span className="text-cyan-400 font-bold">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  id="signup-role-input"
                  type="text"
                  required
                  placeholder="e.g. Machine Learning Researcher, Product Designer..."
                  value={targetedRole}
                  onChange={(e) => setTargetedRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900/90 border border-zinc-700/70 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Your primary piece in collaborative project puzzles.
              </p>
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Email ID <span className="text-cyan-400 font-bold">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  id="signup-email-input"
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900/90 border border-zinc-700/70 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* Optional Fields Section & LinkedIn Connector */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-500 uppercase tracking-wider pb-1 border-b border-zinc-800/60">
                <span>Optional Academic & Social Credentials</span>
                <span className="text-zinc-500 lowercase">optional</span>
              </div>

              {/* LinkedIn Modular Connector Button */}
              <div className="mt-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0077b5]/20 flex items-center justify-center text-[#0077b5]">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-200">Connect LinkedIn Profile</p>
                    <p className="text-[11px] text-zinc-500">
                      {isLinkedInConnected
                        ? 'Profile connected and pre-populated'
                        : 'Auto-retrieves your university and headline'}
                    </p>
                  </div>
                </div>

                <button
                  id="signup-connect-linkedin-btn"
                  type="button"
                  onClick={handleConnectLinkedIn}
                  disabled={isConnectingLinkedIn}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition ${
                    isLinkedInConnected
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                  }`}
                >
                  {isConnectingLinkedIn ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : isLinkedInConnected ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Sync Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* College & Course */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  College <span className="text-[10px] text-zinc-500">(Optional)</span>
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                  <input
                    id="signup-college-input"
                    type="text"
                    placeholder="e.g. Stanford / IIT / MIT"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Course <span className="text-[10px] text-zinc-500">(Optional)</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                  <input
                    id="signup-course-input"
                    type="text"
                    placeholder="e.g. B.Tech Computer Science"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Year & LinkedIn URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Year <span className="text-[10px] text-zinc-500">(Optional)</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                  <input
                    id="signup-year-input"
                    type="text"
                    placeholder="e.g. 3rd Year / Sophomore"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  LinkedIn URL <span className="text-[10px] text-zinc-500">(Optional)</span>
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                  <input
                    id="signup-linkedin-input"
                    type="text"
                    placeholder="linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              id="signup-submit-btn"
              type="submit"
              className="w-full mt-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-lg text-sm tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <span>CONTINUE TO EMAIL VERIFICATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* --- EMAIL VERIFICATION FLOW --- */}
        {verificationStep && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5 text-left"
          >
            <div className="p-4 bg-cyan-950/30 border border-cyan-800/40 rounded-xl flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-cyan-200">Email Verification Required</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  A 6-digit confirmation code was sent to{' '}
                  <span className="text-zinc-200 font-mono font-medium">{email}</span>.
                </p>
                <div className="mt-2.5 flex items-center space-x-2">
                  <span className="text-[11px] text-zinc-400">Prototype Helper Code:</span>
                  <button
                    type="button"
                    onClick={() => setVerificationCode(generatedCode)}
                    className="px-2 py-0.5 bg-cyan-900/50 hover:bg-cyan-900 border border-cyan-600/50 rounded font-mono text-xs text-cyan-300 tracking-wider transition"
                  >
                    {generatedCode} (Click to auto-fill)
                  </button>
                </div>
              </div>
            </div>

            {verificationError && (
              <div className="p-3 text-xs bg-red-950/40 border border-red-800/60 rounded-lg text-red-300">
                {verificationError}
              </div>
            )}

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Enter 6-Digit Code
                </label>
                <input
                  id="verification-code-input"
                  type="text"
                  maxLength={6}
                  required
                  placeholder="e.g. 123456"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value.trim());
                    setVerificationError('');
                  }}
                  className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-700 rounded-lg text-center font-mono text-xl tracking-[0.4em] text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedCode(newCode);
                    setVerificationError('');
                  }}
                  className="text-zinc-400 hover:text-zinc-200 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationStep(false)}
                  className="text-zinc-400 hover:text-zinc-200 underline"
                >
                  Back to edit details
                </button>
              </div>

              <button
                id="verify-code-submit-btn"
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg text-sm tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>VERIFY & ENTER MOSAIC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}

        {/* --- LOGIN FORM --- */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {loginError && (
              <div className="p-3 text-xs bg-red-950/40 border border-red-800/60 rounded-lg text-red-300">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Email ID or Mosaic ID
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  id="login-identifier-input"
                  type="text"
                  required
                  placeholder="student@university.edu or @username"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900/90 border border-zinc-700/70 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* Quick Peer Sign-in helpers for rapid testing */}
            <div className="pt-2">
              <p className="text-[11px] text-zinc-500 mb-2">Quick Sign-in as seed brainstormers:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: '@arjun.ai', name: 'Arjun (AI Lab)' },
                  { id: '@maya.ux', name: 'Maya (Design Studio)' },
                  { id: '@elena_code', name: 'Elena (WebGPU)' },
                ].map((peer) => (
                  <button
                    key={peer.id}
                    type="button"
                    onClick={() => setLoginIdentifier(peer.id)}
                    className="px-2.5 py-1 text-[11px] bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 rounded-md text-zinc-300 transition"
                  >
                    {peer.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full mt-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-lg text-sm tracking-wider flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <span>ENTER MOSAIC WORKSPACE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
