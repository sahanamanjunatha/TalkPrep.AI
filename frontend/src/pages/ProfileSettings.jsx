import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Mail,
  LogOut,
  Briefcase,
  Shield,
  Edit2,
  Check,
  X,
  Github,
  Linkedin,
  Cpu,
  BookOpen
} from 'lucide-react';

const ProfileSettings = () => {
  const { user, logout, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    targetRole: user?.targetRole || '',
    experienceLevel: user?.experienceLevel || 'Intermediate',
    bio: user?.bio || '',
    skillsStr: (user?.skills || []).join(', '),
    github: user?.github || '',
    linkedin: user?.linkedin || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully.', 'info');
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.targetRole.trim()) {
      addToast('Name and Target Role are required.', 'warning');
      return;
    }
    setIsSaving(true);
    addToast('Saving profile updates...', 'info');

    const skills = formData.skillsStr
      ? formData.skillsStr.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const result = await updateProfile({
      name: formData.name.trim(),
      targetRole: formData.targetRole.trim(),
      experienceLevel: formData.experienceLevel,
      bio: formData.bio.trim(),
      skills,
      github: formData.github.trim(),
      linkedin: formData.linkedin.trim()
    });

    if (result && result.success) {
      addToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } else {
      addToast(result?.message || 'Failed to update profile.', 'error');
    }
    setIsSaving(false);
  };

  // Determine avatar URL based on name or fallback
  const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'TalkPrep'}`;

  return (
    <PageWrapper className="bg-slate-950 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">My Profile</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">View your candidate account credentials and active session parameters.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-glow-cyan transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto">
        {isEditing ? (
          <form onSubmit={handleSave} className="p-8 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-6 relative overflow-hidden shadow-2xl">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-3">
              <User className="w-5 h-5 text-brand-primary" />
              Edit Profile Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-900 bg-slate-950 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Target Role</label>
                <input
                  type="text"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-900 bg-slate-950 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Difficulty Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-900 bg-slate-950 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Biography</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-900 bg-slate-950 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary resize-none leading-relaxed"
                placeholder="Share a brief candidate statement..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Skills (comma-separated)</label>
              <input
                type="text"
                name="skillsStr"
                value={formData.skillsStr}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-900 bg-slate-950 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary"
                placeholder="e.g. React, Node.js, Python, SQL"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block flex items-center gap-1">
                  <Github className="w-3 h-3 text-slate-400" /> GitHub URL
                </label>
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-900 bg-slate-950 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary"
                  placeholder="github.com/..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block flex items-center gap-1">
                  <Linkedin className="w-3 h-3 text-slate-400" /> LinkedIn URL
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-900 bg-slate-950 text-xs font-semibold text-white focus:outline-none focus:border-brand-primary"
                  placeholder="linkedin.com/in/..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-900">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-855 text-xs font-bold text-slate-300 transition-all cursor-pointer flex justify-center items-center gap-1.5"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-grow py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-slate-955 font-bold text-xs flex justify-center items-center gap-1.5 cursor-pointer shadow-glow-cyan hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isSaving ? (
                  <span className="w-4 h-4 border-2 border-slate-955 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Save Details
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-6 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
            {/* Background glows */}
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-brand-secondary/5 blur-3xl pointer-events-none" />

            {/* User Avatar */}
            <div className="w-24 h-24 rounded-3xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shadow-glow-cyan overflow-hidden shrink-0">
              <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-contain" />
            </div>

            {/* User details */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-extrabold text-white">{user?.name || 'Practicer'}</h2>
                {user?.role === 'admin' && (
                  <span className="flex items-center gap-1 text-[9px] bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/35 px-2 py-0.5 rounded-full uppercase font-bold">
                    <Shield className="w-2.5 h-2.5" /> Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center justify-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-primary" />
                {user?.email || 'user@example.com'}
              </p>
            </div>

            {/* Target Role & Level */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm pt-4 border-t border-slate-900/80">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 text-center">
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">Target Role</span>
                <span className="text-xs font-bold text-white mt-1 block">{user?.targetRole || 'Software Engineer'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 text-center">
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">Difficulty Level</span>
                <span className="text-xs font-bold text-white mt-1 block">{user?.experienceLevel || 'Intermediate'}</span>
              </div>
            </div>

            {/* Professional Bio */}
            <div className="w-full border-t border-slate-900/80 pt-4 text-left space-y-1.5">
              <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-brand-primary" /> Professional Bio
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-medium bg-slate-950/40 p-4 rounded-2xl border border-slate-900/80">
                {user?.bio || 'No bio provided. Edit details to add a professional statement.'}
              </p>
            </div>

            {/* Skills & Tech stack */}
            <div className="w-full border-t border-slate-900/80 pt-4 text-left space-y-1.5">
              <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-brand-primary" /> Skills & Tech Stack
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, idx) => (
                    <span key={idx} className="text-[9px] bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2.5 py-0.5 rounded-full uppercase font-bold">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-600 italic">No skills listed. Edit profile to append technologies.</span>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="w-full border-t border-slate-900/80 pt-4 text-left space-y-1.5 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">Social Profiles</span>
                <div className="flex gap-4 mt-1.5 text-xs text-slate-400 font-mono">
                  {user?.github ? (
                    <a href={user.github.startsWith('http') ? user.github : `https://${user.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary flex items-center gap-1">
                      <Github className="w-3.5 h-3.5" /> GitHub
                    </a>
                  ) : (
                    <span className="opacity-40 flex items-center gap-1 select-none"><Github className="w-3.5 h-3.5" /> GitHub</span>
                  )}
                  {user?.linkedin ? (
                    <a href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary flex items-center gap-1">
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                  ) : (
                    <span className="opacity-40 flex items-center gap-1 select-none"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</span>
                  )}
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full max-w-xs py-3 px-6 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-rose-500/20 mt-4"
            >
              <LogOut className="w-4 h-4" />
              Sign Out from Session
            </button>
          </div>
        )}
      </div>

    </PageWrapper>
  );
};

export default ProfileSettings;
