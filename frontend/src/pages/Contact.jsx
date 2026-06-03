import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { useToast } from '../context/ToastContext';
import { Mail, MessageSquare, Send, Globe, MapPin, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const { addToast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);

    setTimeout(() => {
      addToast('Message sent! Support representatives will review your ticket shortly.', 'success');
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  const supportChannels = [
    {
      icon: Mail,
      title: 'Email Queries',
      detail: 'support@talkprep.ai',
      desc: 'Typical response within 12 hours.'
    },
    {
      icon: PhoneCall,
      title: 'Voice Helpline',
      detail: '+1 (555) 123-4567',
      desc: 'Mon - Fri | 9 AM - 6 PM EST'
    },
    {
      icon: MapPin,
      title: 'Corporate Headquarters',
      detail: 'San Francisco, California',
      desc: 'Vanguard Hub Tech Park, Space 12.'
    }
  ];

  return (
    <PageWrapper className="bg-slate-950 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden font-sans">
      
      {/* Glow overlays */}
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-brand-primary/5 blur-[100px] pointer-events-none" />

      {/* Title */}
      <div className="text-center space-y-3 mb-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Support & Contact</h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Questions about subscriptions or API configurations? Send us a ticket and our team will check it out.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Support Cards */}
        <div className="space-y-6">
          {supportChannels.map((chan, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-900 bg-slate-900/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-brand-primary shrink-0 mt-0.5">
                <chan.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{chan.title}</h4>
                <p className="text-xs text-brand-primary font-mono mt-1">{chan.detail}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{chan.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Support Message form */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-6 shadow-2xl relative">
          
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
            <MessageSquare className="w-4.5 h-4.5 text-brand-secondary animate-pulse" />
            Submit a message ticket
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-2.5 px-4 text-xs sm:text-sm outline-none focus:border-brand-primary text-slate-200"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-2.5 px-4 text-xs sm:text-sm outline-none focus:border-brand-primary text-slate-200"
                  required
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Message details</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Briefly describe your request details here..."
                className="w-full h-32 bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs sm:text-sm outline-none focus:border-brand-primary text-slate-200 resize-none leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-slate-950 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 mt-6 cursor-pointer shadow-glow-cyan"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  Submit message ticket
                </>
              )}
            </button>

          </form>

        </div>

      </div>

    </PageWrapper>
  );
};

export default Contact;
