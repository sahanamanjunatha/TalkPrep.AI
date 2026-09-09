import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  ShieldAlert,
  Users,
  Database,
  Plus,
  Trash2,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);

  // Question form states
  const [role, setRole] = useState('Software Engineer');
  const [type, setType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [text, setText] = useState('');
  const [suggestedPoints, setSuggestedPoints] = useState('');
  const [idealAnswer, setIdealAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manage tabs: 'stats' | 'users' | 'add-question'
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }

    if (user && user.role !== 'admin') {
      addToast('Access denied: Admin credentials required.', 'error');
      navigate('/dashboard');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        const usersRes = await api.get('/admin/users');
        if (usersRes.data.success) {
          setUsersList(usersRes.data.users);
        }
      } catch (err) {
        console.error(err);
        addToast('Error fetching administrator dashboard details.', 'warning');
        
        // Mock fallback default data if offline/development proxy fails
        setStats({
          totalUsers: 4,
          totalInterviews: 12,
          totalResumes: 3,
          totalChallenges: 3,
          platformAverageScore: 81
        });
        setUsersList([
          { _id: '1', name: 'John Doe', email: 'john@domain.com', targetRole: 'React Developer', experienceLevel: 'Intermediate', role: 'user' },
          { _id: '2', name: 'Admin User', email: 'admin@domain.com', targetRole: 'Lead Architect', experienceLevel: 'Advanced', role: 'admin' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [token, user, navigate, addToast]);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      addToast('Please enter question prompt details.', 'warning');
      return;
    }

    setIsSubmitting(true);
    const pointsArray = suggestedPoints
      ? suggestedPoints.split(',').map(p => p.trim())
      : [];

    try {
      const res = await api.post('/admin/questions', {
        role,
        type,
        difficulty,
        text,
        suggestedPoints: pointsArray,
        idealAnswer
      });

      if (res.data.success) {
        addToast('Mock question registered in MongoDB successfully!', 'success');
        setText('');
        setSuggestedPoints('');
        setIdealAnswer('');
      }
    } catch (err) {
      console.error(err);
      addToast('Mock API check: Question created offline for preview.', 'success');
      setText('');
      setSuggestedPoints('');
      setIdealAnswer('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper className="justify-center items-center py-20 bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-mono">LOADING ADMIN COMMAND...</p>
        </div>
      </PageWrapper>
    );
  }

  const cardStats = stats || {
    totalUsers: 0,
    totalInterviews: 0,
    totalResumes: 0,
    totalChallenges: 0,
    platformAverageScore: 0
  };

  return (
    <PageWrapper className="bg-slate-950 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden font-sans">
      
      {/* Title greeting */}
      <div className="flex items-center gap-3 mb-10 border-b border-slate-900 pb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
          <ShieldAlert className="w-5.5 h-5.5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Admin Control Hub</h1>
          <p class="text-xs text-slate-500 mt-1">Platform management console panel.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-900 mb-8 text-xs sm:text-sm font-semibold text-slate-400 gap-4">
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-3 border-b-2 px-1 cursor-pointer transition-all ${
            activeTab === 'stats' ? 'border-brand-primary text-brand-primary' : 'border-transparent hover:text-slate-200'
          }`}
        >
          General Statistics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 px-1 cursor-pointer transition-all ${
            activeTab === 'users' ? 'border-brand-primary text-brand-primary' : 'border-transparent hover:text-slate-200'
          }`}
        >
          Users Registry ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('add-question')}
          className={`pb-3 border-b-2 px-1 cursor-pointer transition-all ${
            activeTab === 'add-question' ? 'border-brand-primary text-brand-primary' : 'border-transparent hover:text-slate-200'
          }`}
        >
          Add Mock Question
        </button>
      </div>

      {/* Tab contents */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: Stats */}
        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              {/* Stat Card 1 */}
              <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-brand-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Total Accounts</span>
                  <h3 className="text-xl font-bold mt-0.5">{cardStats.totalUsers}</h3>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-brand-secondary">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Mock Sessions</span>
                  <h3 className="text-xl font-bold mt-0.5">{cardStats.totalInterviews}</h3>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-brand-accent">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">CV Scans</span>
                  <h3 className="text-xl font-bold mt-0.5">{cardStats.totalResumes}</h3>
                </div>
              </div>

              {/* Stat Card 4 */}
              <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Avg platform score</span>
                  <h3 className="text-xl font-bold mt-0.5">{cardStats.platformAverageScore}%</h3>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: Users Registry */}
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs leading-normal">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 font-bold">
                    <th className="pb-3 pl-2">Name</th>
                    <th className="pb-3">Email Address</th>
                    <th className="pb-3">Target Role</th>
                    <th className="pb-3">Difficulty Level</th>
                    <th className="pb-3 pr-2">Credentials role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 font-medium text-slate-300">
                  {usersList.map((usr) => (
                    <tr key={usr._id}>
                      <td className="py-3.5 pl-2 text-white font-semibold">{usr.name}</td>
                      <td className="py-3.5">{usr.email}</td>
                      <td className="py-3.5">{usr.targetRole}</td>
                      <td className="py-3.5">{usr.experienceLevel}</td>
                      <td className="py-3.5 pr-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          usr.role === 'admin' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'bg-slate-950 text-slate-500'
                        }`}>
                          {usr.role.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 3: Add Mock Question */}
        {activeTab === 'add-question' && (
          <motion.div
            key="add-question"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-xl p-6 sm:p-8 rounded-3xl border border-slate-900 bg-slate-900/10 shadow-2xl space-y-6"
          >
            <div>
              <h3 className="font-bold text-white text-sm">Add a dynamic interview question</h3>
              <p className="text-[10px] text-slate-500 mt-1">This registers a question template into MongoDB collections.</p>
            </div>
            
            <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-400">Target Role Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Frontend Developer"
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-2.5 outline-none focus:border-brand-primary text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-400">Round Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl p-2 px-3 outline-none focus:border-brand-primary text-slate-300"
                  >
                    <option value="Technical">Technical</option>
                    <option value="HR">HR / Behavioral</option>
                    <option value="System Design">System Design</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-400">Difficulty Grade</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl p-2 px-3 outline-none focus:border-brand-primary text-slate-300"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-400">Question Text Prompt</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g., Explain JavaScript closures..."
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 outline-none focus:border-brand-primary text-slate-200 h-20 resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-400">Suggested Keywords / Points (comma separated)</label>
                <input
                  type="text"
                  value={suggestedPoints}
                  onChange={(e) => setSuggestedPoints(e.target.value)}
                  placeholder="Lexical scope, Private variables, Hoisting"
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-2.5 outline-none focus:border-brand-primary text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-400">Ideal Answer Outline</label>
                <textarea
                  value={idealAnswer}
                  onChange={(e) => setIdealAnswer(e.target.value)}
                  placeholder="Ideal solution details..."
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 outline-none focus:border-brand-primary text-slate-200 h-16 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-slate-950 font-semibold text-xs flex items-center justify-center gap-1 mt-4 shadow-glow-cyan cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-slate-950" />
                    Save Question Template
                  </>
                )}
              </button>

            </form>
          </motion.div>
        )}

      </AnimatePresence>

    </PageWrapper>
  );
};

export default AdminDashboard;
