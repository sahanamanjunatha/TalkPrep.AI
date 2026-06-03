import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Sparkles, Send, Github, Twitter, Linkedin } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    addToast('Subscribed to newsletter updates!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-[#040810] border-t border-slate-900 text-slate-400 py-12 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 sm:px-6">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">TalkPrep.AI</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Elevate your confidence, master technical coding rounds, and scan your resume structure using advanced AI technologies.
          </p>
          <div className="flex items-center gap-4 text-slate-500 pt-1">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <Github className="w-4.5 h-4.5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <Twitter className="w-4.5 h-4.5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <Linkedin className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>

        {/* Resources */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Features</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/interview" className="hover:text-brand-primary transition-colors">Mock AI Interview</Link></li>
            <li><Link to="/coding" className="hover:text-brand-primary transition-colors">Coding Challenges IDE</Link></li>
            <li><Link to="/resume" className="hover:text-brand-primary transition-colors">ATS Resume Analyzer</Link></li>
            <li><Link to="/analytics" className="hover:text-brand-primary transition-colors">Performance Analytics</Link></li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-brand-primary transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-brand-primary transition-colors">Support Contact</Link></li>
            <li><a href="#privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-brand-primary transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        {/* Newsletter subscription */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-sans">Subscribe to Newsletter</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            Get weekly interview tips, challenge walkthroughs, and career optimization resources.
          </p>
          <form onSubmit={handleSubscribe} className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 pr-2 mt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-transparent text-sm w-full text-slate-200 outline-none border-none px-3 py-1.5 focus:ring-0"
              required
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-white transition-all cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-slate-900/60 mt-10 pt-6 text-center text-xs text-slate-600 px-4 sm:px-6">
        &copy; {new Date().getFullYear()} TalkPrep.AI Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
