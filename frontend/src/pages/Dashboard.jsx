import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  Sparkles,
  Terminal,
  FileText,
  TrendingUp,
  Award,
  Zap,
  CheckCircle,
  Clock,
  Play,
  ArrowRight,
  Eye,
  Camera,
  Edit2,
  GraduationCap,
  BookOpen,
  HelpCircle,
  Sliders,
  X,
  Check,
  Code
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, token, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Edit Profile States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    targetRole: '',
    experienceLevel: 'Intermediate',
    avatar: ''
  });

  // Sync edit form when user details change
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        targetRole: user.targetRole || '',
        experienceLevel: user.experienceLevel || 'Intermediate',
        avatar: user.avatar || ''
      });
    }
  }, [user, isEditModalOpen]);

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        } else {
          addToast('Error fetching dashboard statistics.', 'error');
        }
      } catch (err) {
        console.error("Dashboard error:", err.message);
        addToast('Connection failed. Please run standard backend servers.', 'warning');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, navigate, addToast]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(editForm);
      if (res && res.success) {
        addToast('Profile updated successfully!', 'success');
        setIsEditModalOpen(false);
      } else {
        addToast(res?.message || 'Failed to update profile.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Profile update failed.', 'error');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('Image size should be less than 2MB.', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <PageWrapper className="justify-center items-center py-20 bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-mono tracking-wider">LOADING USER DASHBOARD...</p>
        </div>
      </PageWrapper>
    );
  }

  // Fallback defaults if API fails or is offline
  const stats = data?.stats || {
    interviewsCompleted: 0,
    challengesSolved: 0,
    averageInterviewScore: 0,
    streakCount: 1
  };
  const badges = data?.badges || [
    { title: 'Welcome onboard!', description: 'Created your AI Mock Interview account.', icon: 'Award' }
  ];
  const recentInterviews = data?.recentInterviews || [];
  const recentResume = data?.recentResume || null;
  const dailyChallenge = data?.dailyChallenge || {
    _id: '123',
    title: 'Two Sum',
    description: 'Find indices of the two numbers such that they add up to a specific target.',
    difficulty: 'Easy'
  };
  const weeklyActivity = data?.weeklyActivity || [
    { day: 'Mon', count: 0 },
    { day: 'Tue', count: 0 },
    { day: 'Wed', count: 0 },
    { day: 'Thu', count: 1 },
    { day: 'Fri', count: 0 },
    { day: 'Sat', count: 0 },
    { day: 'Sun', count: 0 }
  ];

  // SVG Radial Gauge parameters
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const avgScore = stats.averageInterviewScore || 0;
  const strokeDashoffset = circumference - (avgScore / 100) * circumference;

  const features = [
    {
      title: 'Virtual Interview',
      desc: 'Speak to our conversational AI interviewer in real-time. Practice technical, coding, or behavioral rounds.',
      path: '/interview',
      badge: 'Voice Active',
      icon: Sparkles,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400 shadow-glow-cyan'
    },
    {
      title: 'Build Resume',
      desc: 'Craft a highly professional, single-sheet resume using templates. Export directly to print PDF.',
      path: '/resume-builder',
      badge: 'NEW',
      icon: FileText,
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400 shadow-glow-purple'
    },
    {
      title: 'Analyze Resume',
      desc: 'Upload your CV to run an ATS scan. Discover key-word gaps, score metrics, and suggestions.',
      path: '/resume',
      badge: 'ATS Scanner',
      icon: Eye,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400 shadow-glow-amber'
    },
    {
      title: 'Quiz Arena',
      desc: 'Challenge yourself with timed multiple-choice pools. Track aptitude, system design, and algorithms.',
      path: '/quiz',
      badge: 'NEW - Timed',
      icon: HelpCircle,
      color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400 shadow-glow-rose'
    },
    {
      title: 'Domain Practice',
      desc: 'Test your answers across 8 tech & behavioral domains evaluated instantly with career tips.',
      path: '/domain-practice',
      badge: 'NEW - AI Evaluate',
      icon: GraduationCap,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400 shadow-glow-emerald'
    }
  ];

  const learningPoints = [
    { title: 'HR Interview Skills', desc: 'Master common behavior questions and cultural fit frameworks.', icon: Award, color: 'text-pink-400 bg-pink-500/10' },
    { title: 'Communication Skills', desc: 'Refine vocal clarity, pacing, and vocabulary for structured delivery.', icon: Sparkles, color: 'text-indigo-400 bg-indigo-500/10' },
    { title: 'Technical Problem Solving', desc: 'Break down complex algorithms and talk through your logical steps.', icon: Terminal, color: 'text-blue-400 bg-blue-500/10' },
    { title: 'Resume Building', desc: 'Design ATS-optimized, professional-grade single-page layouts.', icon: FileText, color: 'text-amber-400 bg-amber-500/10' },
    { title: 'Coding Interview Prep', desc: 'Practice mock IDE challenges with real-time feedback hints.', icon: Code, color: 'text-emerald-400 bg-emerald-500/10' },
    { title: 'Aptitude Practice', desc: 'Sharpen logical reasoning, mathematical concepts, and timers.', icon: Sliders, color: 'text-violet-400 bg-violet-500/10' },
    { title: 'Confidence Improvement', desc: 'Overcome stage fright with repetitive interactive mock rounds.', icon: Zap, color: 'text-yellow-400 bg-yellow-500/10' },
    { title: 'Real Interview Experience', desc: 'Simulate high-pressure whiteboard sessions and board panel loops.', icon: GraduationCap, color: 'text-cyan-400 bg-cyan-500/10' }
  ];

  return (
    <PageWrapper className="bg-slate-950 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden font-sans">
      
      {/* Personalized Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl border border-slate-900 bg-slate-900/10 mb-8 overflow-hidden shadow-2xl backdrop-blur-md">
        {/* Glow rings in background */}
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-brand-secondary/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar container with Edit overlay */}
            <div className="relative group shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-950 border-2 border-slate-800 p-1 shadow-glow-cyan overflow-hidden flex items-center justify-center">
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'TalkPrep'}`} 
                alt="User Avatar" 
                className="w-full h-full object-contain rounded-2xl bg-slate-900" 
              />
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-xs font-semibold gap-1 rounded-2xl cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Change
              </button>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome back, {user?.name || 'Practicer'}!
                </h1>
                <span className="text-[10px] bg-brand-primary/15 text-brand-primary border border-brand-primary/35 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Candidate
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Target Role: <span className="text-white font-semibold">{user?.targetRole || 'Software Engineer'}</span> | Level: <span className="text-brand-secondary font-semibold">{user?.experienceLevel || 'Intermediate'}</span>
              </p>
              <p className="text-xs text-slate-500 max-w-md">
                "Consistency is key. Sharpen your interview answers, build a stunning ATS CV, and practice your pitch today."
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 shrink-0">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5 hover:bg-slate-900 transition-colors shadow-lg cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
            <Link
              to="/interview"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-xs sm:text-sm font-semibold text-white shadow-glow-cyan flex items-center gap-1.5 hover:opacity-90 transition-opacity animate-pulse-slow"
            >
              <Sparkles className="w-4 h-4" />
              Start Voice AI Interview
            </Link>
          </div>
        </div>
      </div>

      {/* What You Will Learn Section */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl border border-slate-900 bg-slate-900/10 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-brand-primary" />
          <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase">What You Will Learn</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {learningPoints.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div key={idx} className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 flex items-start gap-3.5 hover:border-slate-800 transition-colors">
                <div className={`p-2 rounded-lg shrink-0 ${pt.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{pt.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">{pt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Feature Cards */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="w-5 h-5 text-brand-secondary" />
          <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase">Interactive Practice Hub</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className={`p-5 rounded-2xl border bg-gradient-to-br ${feature.color} flex flex-col justify-between h-[200px] relative transition-all duration-300 shadow-md hover:shadow-xl`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[8px] font-extrabold bg-slate-950/60 border border-slate-850 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-4">{feature.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                    {feature.desc}
                  </p>
                </div>
                <Link
                  to={feature.path}
                  className="text-[10px] font-bold text-white hover:underline flex items-center gap-1 mt-3"
                >
                  Launch Room
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Grid of stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        
        {/* Stat 1 */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-900 bg-slate-900/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-brand-primary shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider">Interviews</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">{stats.interviewsCompleted}</h3>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-900 bg-slate-900/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-brand-secondary shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider">Codes Solved</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">{stats.challengesSolved}</h3>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-900 bg-slate-900/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-brand-accent shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider">Day Streak</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">{stats.streakCount}</h3>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-900 bg-slate-900/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider">Avg Score</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">{avgScore}%</h3>
          </div>
        </div>

      </div>

      {/* Analytics & Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
        
        {/* SVG Circle Gauge Widget */}
        <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Performance Gauge</h3>
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-900 fill-none"
                strokeWidth="10"
              />
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-brand-primary fill-none"
                strokeWidth="10"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold text-white leading-none">{avgScore}</span>
              <span className="text-xs text-slate-500 block mt-0.5">% Avg</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-6 leading-relaxed max-w-[200px]">
            Keep scoring above 80% to maintain your Honor Graduate badge.
          </p>
        </div>

        {/* Weekly activity SVG bar chart */}
        <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Weekly Activity</h3>
            <p className="text-[10px] text-slate-500">Practice frequency logs per weekday</p>
          </div>
          
          {/* Custom SVG Bar Chart */}
          <div className="h-32 flex items-end justify-between gap-1 pt-4 px-2">
            {weeklyActivity.map((act, idx) => {
              const maxVal = Math.max(...weeklyActivity.map(w => w.count), 1);
              const heightPercent = `${(act.count / maxVal) * 80 + 10}%`; // Minimum 10% height
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-950 rounded-lg h-24 flex items-end overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: heightPercent }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="w-full bg-gradient-to-t from-brand-primary to-brand-secondary rounded-t-lg"
                    />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">{act.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges Panel */}
        <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5 text-brand-secondary" />
              Achievements
            </h3>
            <p className="text-[10px] text-slate-500">Gamified milestones unlocked</p>
          </div>

          <div className="grid grid-cols-2 gap-3 py-4 max-h-[140px] overflow-y-auto pr-1">
            {badges.map((badge, idx) => (
              <div key={idx} className="p-2.5 rounded-xl border border-slate-900 bg-slate-950/60 flex items-start gap-2">
                <div className="w-6 h-6 rounded bg-brand-secondary/15 flex items-center justify-center text-brand-secondary shrink-0 mt-0.5">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-white leading-tight truncate max-w-[80px]">{badge.title}</h4>
                  <p className="text-[8px] text-slate-500 mt-0.5 leading-tight">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/analytics"
            className="text-[10px] text-brand-primary font-bold hover:underline inline-flex items-center gap-1 mt-1 justify-end"
          >
            Detailed Analytics
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>

      {/* History and challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Recent Interviews list */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Interviews</h3>
          
          <div className="space-y-3">
            {recentInterviews.length > 0 ? (
              recentInterviews.map((session) => (
                <div
                  key={session._id}
                  className="p-4 rounded-2xl border border-slate-900 bg-slate-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{session.role}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {session.type} | Level: {session.difficulty} | {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block">Score</span>
                      <span className="text-xs sm:text-sm font-extrabold text-brand-primary">{session.overallScore}%</span>
                    </div>
                    <Link
                      to={`/interview?sessionId=${session._id}`}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="View Report"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
                No past sessions recorded. Start a new voice interview room to begin.
              </div>
            )}
          </div>
        </div>

        {/* Daily challenge card */}
        <div className="space-y-6">
          
          {/* Challenge Card */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between h-[210px] relative">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-full uppercase">DAILY CHALLENGE</span>
                <span className="text-[9px] text-slate-500 uppercase">{dailyChallenge.difficulty}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-4">{dailyChallenge.title}</h4>
              <p className="text-[11px] text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                {dailyChallenge.description}
              </p>
            </div>
            <Link
              to={`/coding?challengeId=${dailyChallenge._id}`}
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-xs font-semibold text-brand-primary flex items-center justify-center gap-1.5 hover:bg-slate-900 transition-colors mt-4"
            >
              <Play className="w-3.5 h-3.5" />
              Solve Challenge
            </Link>
          </div>

          {/* Resume scan quick overview */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-brand-primary shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">ATS CV Score</h4>
                <p className="text-[9px] text-slate-500 mt-0.5 truncate max-w-[120px]">
                  {recentResume ? recentResume.fileName : 'No CV Uploaded'}
                </p>
              </div>
            </div>
            <div className="text-right">
              {recentResume ? (
                <>
                  <span className="text-xs font-extrabold text-brand-primary block">{recentResume.score}%</span>
                  <Link to="/resume" className="text-[8px] text-slate-400 hover:underline">Re-upload</Link>
                </>
              ) : (
                <Link
                  to="/resume"
                  className="text-[10px] text-brand-primary font-bold hover:underline"
                >
                  Upload
                </Link>
              )}
            </div>
          </div>

          {/* Gamified Leaderboard Card */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-secondary animate-pulse" />
              Candidate Leaderboard
            </h4>
            
            <div className="space-y-2.5 text-xs">
              {[
                { name: 'Alex Rivera', score: 94, isUser: false },
                { name: 'Jessica Chen', score: 91, isUser: false },
                { name: user?.name || 'You', score: avgScore, isUser: true }
              ]
                .sort((a, b) => b.score - a.score)
                .map((cand, idx) => {
                  const rank = idx + 1;
                  const isUser = cand.isUser;
                  return (
                    <div
                      key={idx}
                      className={`flex justify-between items-center p-2 rounded-xl border ${
                        isUser
                          ? 'bg-brand-primary/5 border-brand-primary/20 bg-slate-950/60'
                          : 'bg-slate-950/60 border-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold font-mono w-4 ${
                            rank === 1
                              ? 'text-brand-secondary'
                              : rank === 2
                              ? 'text-slate-400'
                              : isUser
                              ? 'text-brand-primary'
                              : 'text-slate-500'
                          }`}
                        >
                          #{rank}
                        </span>
                        <span className={`font-semibold ${isUser ? 'text-white' : 'text-slate-300'}`}>
                          {cand.name} {isUser && '(You)'}
                        </span>
                      </div>
                      <span className="font-bold text-[10px] text-brand-primary">{cand.score}%</span>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 relative shadow-2xl"
          >
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
            
            <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-5 h-5 text-brand-primary" />
              Edit Profile Details
            </h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Photo Upload block */}
              <div className="flex items-center gap-4 p-3 rounded-2xl border border-slate-900 bg-slate-900/10">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 p-0.5 overflow-hidden shrink-0 flex items-center justify-center shadow-glow-cyan">
                  <img 
                    src={editForm.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${editForm.name || 'TalkPrep'}`} 
                    alt="Preview" 
                    className="w-full h-full object-contain rounded-xl bg-slate-900"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Profile Photo</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden" 
                    id="profile-photo-upload"
                  />
                  <label 
                    htmlFor="profile-photo-upload"
                    className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-slate-300 cursor-pointer transition-colors inline-block"
                  >
                    Upload Image
                  </label>
                  <span className="text-[8px] text-slate-500 block mt-1">PNG, JPG up to 2MB.</span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-900 bg-slate-950 text-sm font-semibold text-white focus:outline-none focus:border-brand-primary transition-colors"
                  placeholder="e.g. John Doe"
                />
              </div>

              {/* Target Role */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">Target Role</label>
                <input 
                  type="text" 
                  value={editForm.targetRole}
                  onChange={(e) => setEditForm(prev => ({ ...prev, targetRole: e.target.value }))}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-900 bg-slate-950 text-sm font-semibold text-white focus:outline-none focus:border-brand-primary transition-colors"
                  placeholder="e.g. Frontend Engineer"
                />
              </div>

              {/* Level dropdown */}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">Difficulty Level</label>
                <select
                  value={editForm.experienceLevel}
                  onChange={(e) => setEditForm(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-900 bg-slate-950 text-sm font-semibold text-white focus:outline-none focus:border-brand-primary transition-colors cursor-pointer"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-xs font-semibold text-white shadow-glow-cyan hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

    </PageWrapper>
  );
};

export default Dashboard;
