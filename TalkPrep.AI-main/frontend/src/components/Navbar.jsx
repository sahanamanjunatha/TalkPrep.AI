import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, LogOut, LayoutDashboard, Award, Sparkles, User, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const loggedInLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Mock Room', path: '/interview', icon: Sparkles },
    { name: 'Coding IDE', path: '/coding', icon: Award },
  ];

  if (user && user.role === 'admin') {
    loggedInLinks.push({ name: 'Admin Panel', path: '/admin', icon: Shield });
  }

  return (
    <nav className="sticky top-0 z-50 glass-nav transition-all duration-300 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-glow-cyan group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 dark:from-white dark:to-slate-400 light:from-slate-900 light:to-slate-600 bg-clip-text text-transparent tracking-tight">
              TalkPrep<span className="text-brand-primary">.AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-brand-primary ${
                  isActive(link.path)
                    ? 'text-brand-primary'
                    : 'text-slate-400 dark:text-slate-400 light:text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user && (
              <div className="flex items-center gap-6 border-l border-slate-800 dark:border-slate-800 light:border-slate-200 pl-6">
                {loggedInLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-brand-primary ${
                      isActive(link.path)
                        ? 'text-brand-primary'
                        : 'text-slate-400 dark:text-slate-400 light:text-slate-600'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* User controls / CTA */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 light:hover:bg-slate-100 transition-all duration-200"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-200 text-sm font-medium hover:bg-slate-900/50 light:hover:bg-slate-100 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-805 flex items-center justify-center text-brand-primary overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-contain" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-slate-300 dark:text-slate-300 light:text-slate-700 max-w-[100px] truncate">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-sm font-semibold text-white shadow-glow-cyan hover:opacity-90 transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-900 bg-slate-950 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-slate-900 text-brand-primary'
                      : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="h-px bg-slate-900 my-3" />
                  {loggedInLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium ${
                        isActive(link.path)
                          ? 'bg-slate-900 text-brand-primary'
                          : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                      }`}
                    >
                      <link.icon className="w-4.5 h-4.5" />
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-slate-400 hover:bg-slate-900/40 hover:text-slate-200"
                  >
                    <User className="w-4.5 h-4.5" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-base font-medium text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block text-center mt-4 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-sm font-semibold text-white"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
