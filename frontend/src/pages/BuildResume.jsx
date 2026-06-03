import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  FileText,
  User,
  Mail,
  Phone,
  Briefcase,
  BookOpen,
  Plus,
  Trash2,
  Printer,
  Download,
  Sparkles
} from 'lucide-react';

const BuildResume = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  // Resume states
  const [fullName, setFullName] = useState(user?.name || 'Candidate Name');
  const [email, setEmail] = useState(user?.email || 'email@example.com');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [location, setLocation] = useState('San Francisco, CA');
  const [website, setWebsite] = useState('github.com/developer');
  const [summary, setSummary] = useState(
    'Highly motivated software engineering candidate with hands-on experience in building scalable full-stack web applications. Passionate about solving complex algorithmic challenges and optimizing performance.'
  );

  // Template select
  const [template, setTemplate] = useState('modern'); // modern, minimalist, classic

  // Collections states
  const [skills, setSkills] = useState(['React', 'Node.js', 'MongoDB', 'Python', 'Tailwind CSS', 'Git']);
  const [newSkill, setNewSkill] = useState('');

  const [experiences, setExperiences] = useState([
    {
      company: 'Innovate Tech Labs',
      role: 'Frontend Development Fellow',
      duration: 'June 2025 - Present',
      description: 'Collaborated on developing premium responsive UI/UX dashboards. Reduced application bundle sizes by 20%.'
    }
  ]);
  const [expCompany, setExpCompany] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expDuration, setExpDuration] = useState('');
  const [expDesc, setExpDesc] = useState('');

  const [educations, setEducations] = useState([
    {
      school: 'Apex University of Technology',
      degree: 'B.S. in Computer Science',
      duration: '2022 - 2026',
      gpa: '3.8/4.0'
    }
  ]);
  const [eduSchool, setEduSchool] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduDuration, setEduDuration] = useState('');
  const [eduGpa, setEduGpa] = useState('');

  // Handlers
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
    addToast('Skill token added to resume draft!', 'success');
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, idx) => idx !== index));
  };

  const handleAddExp = (e) => {
    e.preventDefault();
    if (!expCompany || !expRole || !expDuration) {
      addToast('Please fill in Company, Role, and Duration.', 'warning');
      return;
    }
    setExperiences([
      ...experiences,
      { company: expCompany, role: expRole, duration: expDuration, description: expDesc }
    ]);
    setExpCompany('');
    setExpRole('');
    setExpDuration('');
    setExpDesc('');
    addToast('Work experience entry added!', 'success');
  };

  const handleRemoveExp = (index) => {
    setExperiences(experiences.filter((_, idx) => idx !== index));
  };

  const handleAddEdu = (e) => {
    e.preventDefault();
    if (!eduSchool || !eduDegree || !eduDuration) {
      addToast('Please fill in School, Degree, and Duration.', 'warning');
      return;
    }
    setEducations([
      ...educations,
      { school: eduSchool, degree: eduDegree, duration: eduDuration, gpa: eduGpa }
    ]);
    setEduSchool('');
    setEduDegree('');
    setEduDuration('');
    setEduGpa('');
    addToast('Education history block added!', 'success');
  };

  const handleRemoveEdu = (index) => {
    setEducations(educations.filter((_, idx) => idx !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageWrapper className="bg-slate-950 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden font-sans no-print-wrapper">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-900 pb-6 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-brand-primary" />
            Resume Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build your professional ATS-optimized resume in real-time and export as a clean PDF document.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            Download PDF / Print
          </button>
        </div>
      </div>

      {/* Main split dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:p-0">
        
        {/* LEFT COLUMN: Input Form Controls (hidden on print) */}
        <div className="space-y-6 print:hidden">
          
          {/* Section 1: Template selection */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-secondary animate-pulse" />
              Choose ATS Template Layout
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {['modern', 'minimalist', 'classic'].map((temp) => (
                <button
                  key={temp}
                  onClick={() => setTemplate(temp)}
                  className={`py-3 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                    template === temp
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-glow-cyan'
                      : 'border-slate-900 bg-slate-950/60 text-slate-400 hover:border-slate-800 hover:text-white'
                  }`}
                >
                  {temp} Style
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Personal details */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <User className="w-4.5 h-4.5 text-brand-primary" />
              Personal Parameters
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs text-slate-200 outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs text-slate-200 outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs text-slate-200 outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs text-slate-200 outline-none focus:border-brand-primary"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">Portfolio Link / Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs text-slate-200 outline-none focus:border-brand-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">Professional Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows="3"
                className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs text-slate-200 outline-none focus:border-brand-primary resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 3: Skills selection */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1">Resume Skill Sets</h3>
            <div className="flex flex-wrap gap-2 mb-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-900 min-h-[50px]">
              {skills.map((sk, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-bold bg-brand-primary/10 border border-brand-primary/20 text-brand-primary py-1 px-2.5 rounded-full uppercase">
                  {sk}
                  <button type="button" onClick={() => handleRemoveSkill(idx)} className="text-slate-500 hover:text-rose-400 font-bold ml-1 cursor-pointer">×</button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom skill (e.g. TypeScript)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs text-slate-200 outline-none focus:border-brand-primary"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-primary border border-slate-900 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Section 4: Work Experience */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <Briefcase className="w-4.5 h-4.5 text-brand-secondary" />
              Work Experience Timeline
            </h3>
            
            {/* Existing exp list */}
            {experiences.length > 0 && (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-white leading-none">{exp.company}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">{exp.role} | {exp.duration}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveExp(idx)}
                      className="p-1.5 rounded-lg border border-slate-900 text-slate-500 hover:text-rose-400 hover:border-slate-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Form to add */}
            <div className="space-y-3 pt-2 border-t border-slate-900/80 grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2">
                <input
                  type="text"
                  placeholder="Company Name (e.g. Innovate Tech Labs)"
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Job Title / Role"
                  value={expRole}
                  onChange={(e) => setExpRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Duration (e.g. 2025 - Present)"
                  value={expDuration}
                  onChange={(e) => setExpDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <textarea
                  placeholder="Role description bullet points..."
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  rows="2"
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-brand-primary resize-none leading-relaxed"
                />
              </div>
              <div className="col-span-2">
                <button
                  onClick={handleAddExp}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Experience Block
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Education History */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4 font-sans">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <BookOpen className="w-4.5 h-4.5 text-brand-secondary" />
              Education History Blocks
            </h3>
            
            {/* Existing edu list */}
            {educations.length > 0 && (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {educations.map((edu, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-white leading-none">{edu.school}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">{edu.degree} | {edu.duration} | GPA: {edu.gpa}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveEdu(idx)}
                      className="p-1.5 rounded-lg border border-slate-900 text-slate-500 hover:text-rose-400 hover:border-slate-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Form to add */}
            <div className="space-y-3 pt-2 border-t border-slate-900/80 grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2">
                <input
                  type="text"
                  placeholder="School/University Name"
                  value={eduSchool}
                  onChange={(e) => setEduSchool(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Degree & Major"
                  value={eduDegree}
                  onChange={(e) => setEduDegree(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Duration (e.g. 2022 - 2026)"
                  value={eduDuration}
                  onChange={(e) => setEduDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <input
                  type="text"
                  placeholder="GPA (e.g. 3.8/4.0)"
                  value={eduGpa}
                  onChange={(e) => setEduGpa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-brand-primary"
                />
              </div>
              <div className="col-span-2">
                <button
                  onClick={handleAddEdu}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Education block
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Real-Time Print Document Preview */}
        <div className="p-8 rounded-3xl border border-slate-900 bg-[#040810]/40 overflow-y-auto max-h-[820px] print:border-none print:bg-white print:text-black print:max-h-none print:overflow-visible print:p-0 shadow-2xl relative">
          
          <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest print:hidden">
            Document Live Preview
          </div>

          {/* Dynamic Template rendering */}
          <div className={`w-full max-w-xl mx-auto bg-white text-slate-800 p-8 shadow-md rounded-2xl min-h-[720px] print:shadow-none print:p-0 print:rounded-none select-text ${
            template === 'minimalist' ? 'font-serif border-t-4 border-slate-900' : 'font-sans'
          }`}>
            
            {/* Headers block */}
            <div className={`border-b pb-4 text-center ${
              template === 'classic' ? 'border-double border-b-4 border-slate-800' : 'border-slate-200'
            }`}>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase font-sans">{fullName}</h2>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-500 text-[10px] mt-1.5 font-sans">
                <span className="flex items-center gap-1 font-semibold">{email}</span>
                <span className="flex items-center gap-1 font-semibold">{phone}</span>
                <span className="flex items-center gap-1 font-semibold">{location}</span>
                <span className="flex items-center gap-1 font-semibold">{website}</span>
              </div>
            </div>

            {/* Summary block */}
            {summary && (
              <div className="mt-5 space-y-1.5 text-xs text-justify">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider">Professional Profile</h4>
                <p className="text-slate-600 leading-relaxed">{summary}</p>
              </div>
            )}

            {/* Experience timeline */}
            {experiences.length > 0 && (
              <div className="mt-5 space-y-2">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider border-b border-slate-200 pb-0.5">Professional Experience</h4>
                <div className="space-y-4">
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{exp.company}</span>
                        <span className="text-[10px] font-normal text-slate-500">{exp.duration}</span>
                      </div>
                      <div className="text-[10px] text-slate-600 font-semibold italic">{exp.role}</div>
                      {exp.description && (
                        <p className="text-slate-500 leading-relaxed text-[11px] mt-1 pl-2 border-l-2 border-slate-200">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education timeline */}
            {educations.length > 0 && (
              <div className="mt-5 space-y-2">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider border-b border-slate-200 pb-0.5">Education History</h4>
                <div className="space-y-3">
                  {educations.map((edu, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{edu.school}</span>
                        <span className="text-[10px] font-normal text-slate-500">{edu.duration}</span>
                      </div>
                      <div className="text-[10px] text-slate-600 font-semibold italic">
                        {edu.degree} {edu.gpa && `| GPA: ${edu.gpa}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills grid */}
            {skills.length > 0 && (
              <div className="mt-5 space-y-1.5">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider border-b border-slate-200 pb-0.5">Expertise & Skillsets</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {skills.join(' • ')}
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

    </PageWrapper>
  );
};

export default BuildResume;
