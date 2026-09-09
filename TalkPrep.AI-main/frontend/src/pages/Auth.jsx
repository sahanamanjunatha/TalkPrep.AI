import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, User, Briefcase, ArrowRight, Sparkles, Key, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import api from '../services/api';

const Auth = () => {
  const { login, register, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Password strength state variables
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Alert on token expiration
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      addToast('Your session has expired. Please sign in again.', 'warning');
    }
  }, [searchParams, addToast]);

  // Check password strength on type
  useEffect(() => {
    if (!password) {
      setStrength(0);
      setStrengthLabel('');
      return;
    }
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    setStrength(score);
    
    if (score <= 2) {
      setStrengthLabel('Weak');
    } else if (score <= 4) {
      setStrengthLabel('Medium');
    } else {
      setStrengthLabel('Strong');
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      addToast('Please fill in all required fields.', 'warning');
      return;
    }

    setIsSubmitting(true);

    if (isForgotPassword) {
      // Mock forgot password
      try {
        const res = await api.post('/auth/forgotpassword', { email });
        if (res.data.success) {
          addToast('Password reset instructions generated!', 'success');
          addToast(`Mock URL: ${res.data.resetUrl}`, 'info', 8000);
          setIsForgotPassword(false);
        }
      } catch (err) {
        addToast(err.response?.data?.message || 'Error occurred.', 'error');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        addToast('Welcome back! Signed in successfully.', 'success');
        navigate('/dashboard');
      } else {
        setLoginError(res.message || 'Incorrect email or password. Please try again.');
      }
    } else {
      const res = await register(name, email, password, targetRole, experienceLevel);
      if (res.success) {
        addToast('Registration complete! Account created.', 'success');
        navigate('/dashboard');
      } else {
        addToast(res.message, 'error');
      }
    }
    setIsSubmitting(false);
  };

  const getStrengthBarColor = () => {
    if (strength <= 2) return 'bg-rose-500';
    if (strength <= 4) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <PageWrapper className="justify-center items-center py-16 px-4 bg-slate-950 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-brand-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-brand-secondary/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md">
        
        {/* Logo Icon */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-glow-cyan mx-auto">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {isForgotPassword
              ? 'Enter email to receive instructions'
              : isLogin
              ? 'Sign in to access your mock dashboard'
              : 'Start your simulated mock prep journey today'}
          </p>
        </div>

        {/* Auth Box Card */}
        <div className="glass-panel border border-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          


          {/* Tab switches if not in forgot password mode */}
          {!isForgotPassword && (
            <div className="flex bg-slate-950/80 border border-slate-900 rounded-2xl p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setPassword('');
                  setLoginError('');
                }}
                className={`flex-1 text-center py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isLogin ? 'bg-slate-900 text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setPassword('');
                  setLoginError('');
                }}
                className={`flex-1 text-center py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  !isLogin ? 'bg-slate-900 text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Register
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name field (Signup only) */}
            {!isLogin && !isForgotPassword && (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-brand-primary transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-brand-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Password field (Login / Signup only) */}
            {!isForgotPassword && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-slate-400 font-semibold">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[10px] text-brand-primary hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-brand-primary transition-all"
                    required
                  />
                </div>
                <p className="text-[12px] text-slate-500 mt-1 pl-1">Min 6 characters</p>
                {isLogin && loginError && (
                  <p className="text-[12px] text-rose-500 mt-1 pl-1 font-medium">{loginError}</p>
                )}

                {/* Password strength visualizer (Signup only) */}
                {!isLogin && password && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                      <span>STRENGTH: <span className="font-bold text-slate-300 uppercase">{strengthLabel}</span></span>
                      <span>{strength}/5 criteria</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-full rounded-full transition-all duration-300 ${
                            i < strength ? getStrengthBarColor() : 'bg-slate-900'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Custom inputs: Target Role & Level (Signup only) */}
            {!isLogin && !isForgotPassword && (
              <div className="grid grid-cols-2 gap-4 pt-1">
                
                {/* Target Role */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Target Job Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-2.5 px-3 text-xs text-slate-300 outline-none focus:border-brand-primary"
                  >
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Frontend Engineer">Frontend Engineer</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Mobile Engineer">Mobile Engineer</option>
                    <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="QA Automation Engineer">QA Automation Engineer</option>
                    <option value="System Architect">System Architect</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Difficulty Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-2.5 px-3 text-xs text-slate-300 outline-none focus:border-brand-primary"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-sm font-semibold text-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isForgotPassword ? (
                'Request Instructions'
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Cancel link for forgot password */}
            {isForgotPassword && (
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-300 pt-2 cursor-pointer"
              >
                Back to Sign In
              </button>
            )}

          </form>
        </div>

      </div>
    </PageWrapper>
  );
};

export default Auth;
