import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Terminal, FileText, ChevronDown, Check, Shield, Star, Users, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';

const Home = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    {
      icon: Sparkles,
      title: 'Mock Interviews',
      desc: 'Answer interview prompts aloud. Our speech AI listens, transcribes your replies in real-time, and generates granular scores.'
    },
    {
      icon: Terminal,
      title: 'Coding IDE',
      desc: 'Select coding challenges, write solutions in our rich interactive editor, run test cases, and receive live AI helper tips.'
    },
    {
      icon: Eye,
      title: 'ATS Resume Analyzer',
      desc: 'Upload your CV to analyze ATS compatibility indices, scan keyword matches, and receive instant structural suggestions.'
    },
    {
      icon: FileText,
      title: 'Resume Builder',
      desc: 'Craft highly professional, single-sheet resumes using curated layouts and export them directly to print-ready PDF.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Software Dev at Stripe',
      quote: 'The coding round simulator was extremely close to actual technical rounds. The AI-suggested hints guided me when I was blocked without giving away the logic. Highly recommended!',
      rating: 5
    },
    {
      name: 'David K.',
      role: 'Product Designer',
      quote: 'TalkPrep helped me overcome public speaking anxieties. Listening to the synthesized voice questions and speaking answers aloud was the perfect practice framework.',
      rating: 5
    }
  ];

  const faqs = [
    {
      q: "How does the Speech AI evaluation work?",
      a: "Our mock interviewer room generates customized job interview questions, speaks them to you, and captures your replies using standard speech-to-text hooks. It evaluates your structure, vocabulary, and keywords, reporting granular score breakdowns."
    },
    {
      q: "Can I run this without configuring OpenAI keys?",
      a: "Yes! If you run the app locally, it defaults to a built-in Mock AI logic engine. It generates rich evaluations and simulated scores out-of-the-box, allowing you to prototype everything without paying API fees."
    },
    {
      q: "What coding languages does the compiler support?",
      a: "The compiler workspace provides syntax theme selections and template code structures for JavaScript, Python, and Java, letting you test algorithms dynamically."
    }
  ];

  return (
    <PageWrapper className="bg-slate-950 text-slate-100 relative overflow-hidden">
      
      {/* Glow overlays */}
      <div className="absolute top-[-10%] left-[5%] w-[400px] h-[400px] rounded-full bg-brand-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px] rounded-full bg-brand-secondary/5 blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/5 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            Empowered by Advanced AI Recruiter Models
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Ace Your Next Job Interview with{' '}
            <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
              TalkPrep.AI
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Practice live voice responses, debug coding algorithms, and critique resume ATS formatting within a single premium, dark-themed virtual ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/auth"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-sm font-semibold text-white shadow-lg hover:shadow-cyan-500/10 hover:opacity-90 flex items-center justify-center gap-2 group transition-all"
            >
              Get Started
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-slate-800 bg-slate-900/40 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all flex items-center justify-center"
            >
              See How It Works
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Preview Widget Mock */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 border border-slate-900 rounded-3xl bg-slate-950/60 p-2 overflow-hidden shadow-2xl relative"
        >
          <div className="border border-slate-800/80 rounded-2xl bg-slate-900/30 overflow-hidden relative">
            
            {/* Window bar */}
            <div className="h-10 bg-slate-950 flex items-center justify-between px-4 border-b border-slate-900">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/40" />
                <span className="w-3 h-3 rounded-full bg-amber-500/40" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/40" />
              </div>
              <span className="text-[10px] text-slate-500 tracking-wider">AI MOCK SESSION TERMINAL</span>
              <div className="w-12" />
            </div>

            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              
              {/* Dynamic Interview Preview */}
              <div className="space-y-4">
                <div className="inline-block px-2.5 py-1 rounded bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                  Q1: Technical Loop
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  "Explain how Javascript closures function and give a common scenario for using them."
                </h3>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>TRANSCRIPTION OUTPUT</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-sm text-slate-300 font-mono italic">
                    "A closure lets a function keep access to its outer scope variables even after that outer function has returned. We use them for data encapsulation..."
                  </p>
                </div>
              </div>

              {/* Dynamic evaluation scorecard Preview */}
              <div className="p-5 rounded-2xl border border-brand-primary/20 bg-brand-primary/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-xs text-brand-primary font-bold tracking-wider">AI PLATFORM AUDIT REPORT</span>
                    <div className="flex items-baseline gap-0.5 text-brand-primary">
                      <span className="text-4xl font-extrabold">88</span>
                      <span className="text-sm font-semibold">%</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-3">Strengths</h4>
                  <ul className="text-xs text-slate-300 space-y-1 mt-1 pl-3 list-disc">
                    <li>Accurately defined outer block scope closures</li>
                    <li>Stated private variables encapsulation uses</li>
                  </ul>
                  <h4 className="font-bold text-white text-sm mt-3">Improvement Areas</h4>
                  <ul className="text-xs text-slate-300 space-y-1 mt-1 pl-3 list-disc">
                    <li>Could detail memory retention impacts</li>
                  </ul>
                </div>
                <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-800/40">
                  Ready to test? Connect your microphone and start.
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-900">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-white">Full-Suite Mock Environment</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Every tool you need to land developer, manager, or designer offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8 }}
              className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/20 hover:border-slate-800 transition-all space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-primary">
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg">{feat.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#040810] border-y border-slate-900/60 py-20 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white">Success Stories</h2>
            <p className="text-slate-400 text-sm sm:text-base">Read feedback from our members who successfully navigated core recruiter rounds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-300 italic text-sm leading-relaxed">"{test.quote}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-brand-primary">
                    {test.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{test.name}</h4>
                    <p className="text-[10px] text-slate-500">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tables */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-white">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base">
            Choose the plan that suits your schedule. Cancel anytime.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-sm ${!isAnnual ? 'text-white font-semibold' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6.5 rounded-full bg-slate-800 p-1 flex items-center justify-start cursor-pointer transition-all"
            >
              <motion.div
                layout
                className="w-4.5 h-4.5 rounded-full bg-brand-primary"
                animate={{ x: isAnnual ? 22 : 0 }}
              />
            </button>
            <span className={`text-sm flex items-center gap-1.5 ${isAnnual ? 'text-white font-semibold' : 'text-slate-500'}`}>
              Annually
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          
          {/* Plan 1 */}
          <div className="p-8 rounded-2xl border border-slate-900 bg-slate-900/10 hover:border-slate-800 transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <p className="text-xs text-slate-500 mt-1">Perfect for quick career checks.</p>
              <div className="flex items-baseline gap-1 py-6 text-white">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-sm text-slate-500">/ forever</span>
              </div>
              <div className="h-px bg-slate-900 mb-6" />
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-primary" /> 2 Dynamic Mock Interviews</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-primary" /> Basic Coding Round Solves</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-primary" /> 1 Resume ATS Analysis</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-primary" /> Chatbot Companion Access</li>
              </ul>
            </div>
            <Link
              to="/auth"
              className="mt-8 block text-center py-3 rounded-xl border border-slate-800 text-sm font-semibold hover:bg-slate-900 hover:text-white transition-all"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Plan 2 */}
          <div className="p-8 rounded-2xl border border-brand-primary/30 bg-brand-primary/5 shadow-lg shadow-cyan-500/5 hover:border-brand-primary/50 transition-all flex flex-col justify-between relative">
            <span className="absolute -top-3.5 right-6 text-[10px] font-bold text-slate-950 bg-gradient-to-r from-brand-primary to-brand-secondary px-3 py-1 rounded-full uppercase tracking-wider">
              Popular
            </span>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                Pro
                <Sparkles className="w-4 h-4 text-brand-primary" />
              </h3>
              <p className="text-xs text-slate-500 mt-1">For active job seekers who want mock feedback.</p>
              <div className="flex items-baseline gap-1 py-6 text-white">
                <span className="text-4xl font-extrabold">${isAnnual ? 19 : 24}</span>
                <span className="text-sm text-slate-500">/ month</span>
              </div>
              <div className="h-px bg-slate-900/60 mb-6" />
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-primary" /> Unlimited Mock Interviews</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-primary" /> Full Access Coding Challenges</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-primary" /> Progressive AI Hints Generator</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-primary" /> Unlimited Resume Uploads & Critiques</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-primary" /> Detailed Analytics & PDF Reports</li>
              </ul>
            </div>
            <Link
              to="/auth"
              className="mt-8 block text-center py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-sm font-semibold text-white hover:opacity-90 transition-all"
            >
              Get Premium Access
            </Link>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-900">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm sm:text-base">Quick answers to common questions about our system structure.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isFaqActive = activeFaq === idx;
            return (
              <div key={idx} className="border border-slate-950 bg-slate-900/20 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(isFaqActive ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isFaqActive ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isFaqActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-5 pt-0 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-900/30">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

    </PageWrapper>
  );
};

export default Home;
