import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { Target, Users, BookOpen, Milestone } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const milestones = [
    {
      year: '2024',
      title: 'Platform Foundation',
      desc: 'Formulated the first interactive voice-driven evaluation engine concept.'
    },
    {
      year: '2025',
      title: 'Advanced AI Integration',
      desc: 'Launched OpenAI backend logic and speech-to-text response evaluations.'
    },
    {
      year: '2026',
      title: 'Global Scale',
      desc: 'Helping thousands of software engineers prepare for technical mock rounds weekly.'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Job-seeker Centric',
      desc: 'We structure templates to match actual FAANG/startup job requirements closely.'
    },
    {
      icon: BookOpen,
      title: 'Gamified Skill Acquisition',
      desc: 'Solve daily problems, score high average grades, and earn glowing milestone badges.'
    },
    {
      icon: Users,
      title: 'Beginner Friendly',
      desc: 'Progressive levels (Beginner to Advanced) let any applicant practice stress-free.'
    }
  ];

  return (
    <PageWrapper className="bg-slate-950 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
      
      {/* Title */}
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">About Our Platform</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Empowering software builders, project managers, and applicants with simulated mock workspaces.
        </p>
      </div>

      {/* Vision Blocks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Our Mission</h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Standard interviews can feel stressful. Most applicants block during live technical questions not due to coding capabilities, but because of presentation anxiety. 
          </p>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            We built TalkPrep.AI to establish a safe, zero-pressure virtual environment. By testing logic inside our simulated IDE and responding to Speech synthesis, you condition your presentation skills dynamically.
          </p>
        </div>
        <div className="p-8 rounded-2xl border border-slate-950 bg-slate-900/10 flex flex-col justify-center relative">
          <div className="absolute top-[-5%] left-[5%] w-[100px] h-[100px] rounded-full bg-brand-primary/10 blur-[50px] pointer-events-none" />
          <h3 className="text-sm uppercase font-bold tracking-wider text-brand-primary">The Core Objective</h3>
          <p className="text-lg text-white font-semibold mt-3 italic">
            "To bridge the gap between classroom coding and high-stakes recruiter interviews."
          </p>
          <div className="h-px bg-slate-900 my-6" />
          <span className="text-xs text-slate-500 font-mono">TalkPrep Dev Team</span>
        </div>
      </section>

      {/* Values Grid */}
      <section className="mb-24">
        <h2 className="text-xl sm:text-3xl font-bold text-center text-white mb-12">Core Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-slate-900/60 bg-slate-900/20 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-primary">
                <val.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base sm:text-lg">{val.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-xl sm:text-3xl font-bold text-center text-white mb-16 flex items-center justify-center gap-2">
          <Milestone className="w-6 h-6 text-brand-primary" />
          Timeline & Milestones
        </h2>
        
        <div className="relative border-l-2 border-slate-900 ml-4 space-y-12">
          {milestones.map((mile, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative pl-8"
            >
              {/* Timeline bubble icon */}
              <div className="absolute -left-3.5 top-1 w-6.5 h-6.5 rounded-full bg-slate-950 border-2 border-brand-primary flex items-center justify-center text-white shadow-glow-cyan">
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-bold text-brand-primary font-mono bg-brand-primary/10 px-2.5 py-0.5 rounded-full">{mile.year}</span>
                <h3 className="text-lg font-bold text-white pt-1.5">{mile.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{mile.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </PageWrapper>
  );
};

export default About;
