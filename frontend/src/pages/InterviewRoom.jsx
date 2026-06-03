import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  Sparkles,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Play,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Camera,
  Briefcase,
  FileText,
  Paperclip,
  Languages,
  Calendar,
  MessageSquare,
  Sliders,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InterviewRoom = () => {
  const { token, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Settings states
  const [role, setRole] = useState(user?.targetRole || 'Software Engineer');
  const [type, setType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [language, setLanguage] = useState('English');
  const [numQuestions, setNumQuestions] = useState('5');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Streaming hardware states
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);

  // Active question state
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Evaluation display states
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [completedReport, setCompletedReport] = useState(null);

  // Speech APIs references
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const webcamStreamRef = useRef(null);

  // Load a session from url if query parameter exists (View Mode)
  useEffect(() => {
    const sId = searchParams.get('sessionId');
    if (sId) {
      const fetchSessionDetails = async () => {
        try {
          const res = await api.get(`/interviews/${sId}`);
          if (res.data.success) {
            setCompletedReport(res.data.session);
            setIsSessionStarted(true);
          }
        } catch (err) {
          console.error(err);
          addToast('Could not load past interview data.', 'error');
        }
      };
      fetchSessionDetails();
    }
  }, [searchParams, addToast]);

  // Set up Speech Synthesis and Speech Recognition APIs
  useEffect(() => {
    // Check Speech Recognition capability
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (e) => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setUserAnswer(transcript);
      };

      rec.onerror = (e) => {
        console.error("SpeechRecognition error:", e.error);
        if (e.error === 'not-allowed') {
          addToast('Microphone access denied. Grant browser permissions.', 'error');
        }
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    } else {
      console.warn("SpeechRecognition not supported in this browser.");
    }

    return () => {
      stopCameraStream();
    };
  }, []);

  const handleCameraToggle = async () => {
    if (cameraEnabled) {
      stopCameraStream();
      setCameraEnabled(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraEnabled(true);
      } catch (err) {
        console.error(err);
        addToast('Webcam access was denied or hardware not found.', 'warning');
      }
    }
  };

  const stopCameraStream = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(track => track.stop());
      webcamStreamRef.current = null;
    }
  };

  // Speaks text using SpeechSynthesis
  const speakText = (text) => {
    if (!isSpeechEnabled || !window.speechSynthesis) return;
    
    // Cancel active synthesis first
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Choose standard english voice if available
    const voices = window.speechSynthesis.getVoices();
    const engVoice = voices.find(v => v.lang.startsWith('en-'));
    if (engVoice) utterance.voice = engVoice;

    window.speechSynthesis.speak(utterance);
  };

  const selectSetupRole = (selectedRole) => {
    setRole(selectedRole);
  };

  const fillMockJobDescription = () => {
    let desc = "Seeking a talented software practitioner to help design, test, build and maintain highly reliable scalable client features in high performance code environments.";
    if (role === 'Frontend Engineer') {
      desc = "Seeking a Frontend Engineer experienced in React, modern JavaScript (ES6+), responsive CSS layouts (Grid/Flexbox), component testing, bundle optimization, and high performance client page rendering.";
    } else if (role === 'Product Manager') {
      desc = "Seeking a Product Manager to define roadmap priority features, direct cross-functional designer/engineer teams, coordinate sprint planning, and analyze user growth/engagement telemetry metrics.";
    } else if (role === 'Data Analyst') {
      desc = "Seeking a Data Analyst with robust experience writing complex SQL queries, building Tableau visualization reports, scrubbing dirty data tables, and using statistical methodologies to verify A/B test results.";
    }
    setJobDescription(desc);
  };

  const handleResumeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      addToast(`Resume uploaded: ${file.name}`, 'success');
    }
  };

  const startInterview = async () => {
    if (!token) {
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/interviews/start', {
        role,
        type,
        difficulty,
        jobDescription,
        language,
        numQuestions: parseInt(numQuestions) || 5
      });

      if (res.data.success) {
        setSessionId(res.data.session.id);
        setCurrentQuestionText(res.data.session.currentQuestionText);
        setQuestionIndex(0);
        setUserAnswer('');
        setIsSessionStarted(true);
        addToast('Interview started. Turn on your camera for realism!', 'success');
        
        // Speak question aloud after a brief delay
        setTimeout(() => {
          speakText(res.data.session.currentQuestionText);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      addToast('Error initializing interview server endpoints.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      addToast('Speech recognition not supported in this browser. Please type your reply instead.', 'warning');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setUserAnswer('');
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setMicrophoneEnabled(true);
        addToast('Microphone recording active. Speak clearly.', 'info');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      addToast('Please input or record an answer before submitting.', 'warning');
      return;
    }

    // Stop recording first
    if (isRecording) {
      recognitionRef.current.stop();
    }

    setIsSubmitting(true);

    try {
      const res = await api.post(`/interviews/${sessionId}/submit`, {
        answer: userAnswer
      });

      if (res.data.success) {
        // If finished, load full completed scorecard report
        if (res.data.isFinished) {
          setCompletedReport(res.data.session);
          addToast('Mock Session completed! Generating grading scorecard...', 'success');
          stopCameraStream();
          setCameraEnabled(false);
        } else {
          // Store recent question graded details to show in modal/screen
          setCurrentEvaluation(res.data.evaluation);
          setShowFeedbackModal(true);

          // Render next question
          setCurrentQuestionText(res.data.currentQuestionText);
          setQuestionIndex(res.data.currentQuestionIndex);
          setUserAnswer('');
          
          addToast('Answer submitted. Here is your AI analysis.', 'success');

          // Speak next question aloud
          setTimeout(() => {
            speakText(res.data.currentQuestionText);
          }, 1500);
        }
      }
    } catch (err) {
      console.error(err);
      addToast('Error submitting mock answer.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper className="bg-slate-950 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden font-sans">
      
      {/* Glow layers */}
      <div className="absolute top-[-5%] right-[10%] w-[350px] h-[350px] rounded-full bg-brand-primary/5 blur-[100px] pointer-events-none" />

      {/* Screen 1: Pre-Interview Configurations */}
      {!isSessionStarted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto border border-slate-900 bg-slate-900/10 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl relative"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-brand-primary animate-pulse" />
              AI Virtual Mock Interview Setup
            </h1>
            <p className="text-xs text-slate-500">Configure parameters to customize the AI reviewer's evaluation algorithm.</p>
          </div>

          <div className="h-px bg-slate-900" />

          <div className="space-y-5">
            {/* Job Title / Role */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <label className="text-xs font-semibold text-slate-400">Job Title / Role</label>
                  <span className="text-[9px] bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded font-bold uppercase">Required</span>
                </div>
                <button type="button" className="text-slate-500 hover:text-slate-300" title="Specify the job role you are interviewing for.">
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Software Engineer, Product Manager..."
                className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-2.5 px-4 text-sm outline-none focus:border-brand-primary text-slate-200"
              />
              
              {/* Popular Options Capsules */}
              <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-slate-400">
                <span class="text-slate-500 my-auto">Popular:</span>
                <button type="button" onClick={() => selectSetupRole('Frontend Engineer')} className="px-2.5 py-1 rounded-full border border-slate-900 bg-slate-950 hover:border-slate-800 hover:text-white transition-colors cursor-pointer">Frontend Engineer</button>
                <button type="button" onClick={() => selectSetupRole('Product Manager')} className="px-2.5 py-1 rounded-full border border-slate-900 bg-slate-950 hover:border-slate-800 hover:text-white transition-colors cursor-pointer">Product Manager</button>
                <button type="button" onClick={() => selectSetupRole('Data Analyst')} className="px-2.5 py-1 rounded-full border border-slate-900 bg-slate-950 hover:border-slate-800 hover:text-white transition-colors cursor-pointer">Data Analyst</button>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <label className="text-xs font-semibold text-slate-400">Job Description</label>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase">Optional</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={fillMockJobDescription} className="px-2 py-0.5 rounded border border-slate-850 hover:border-slate-700 bg-slate-950 text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer">
                    <Plus className="w-3 h-3" /> Fill from Job Board
                  </button>
                  <button type="button" className="text-slate-500 hover:text-slate-300" title="Paste the job description to tailor the interview questions.">
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description or posting here..."
                maxLength={5000}
                className="w-full h-24 bg-slate-950 border border-slate-900 rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-brand-primary resize-none leading-relaxed"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>{jobDescription.length} / 5000 characters</span>
                <span>Paste to auto-tailor questions</span>
              </div>
            </div>

            {/* Resume */}
            <div class="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-slate-400" />
                  <label className="text-xs font-semibold text-slate-400">Resume</label>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase">Optional</span>
                </div>
                <button type="button" className="text-slate-500 hover:text-slate-300" title="Upload your resume to align interview questions with your background.">
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              <div
                className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950 rounded-2xl p-4 text-center cursor-pointer transition-colors relative flex items-center justify-between"
                onClick={() => document.getElementById('setup-resume-file').click()}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    resumeFile ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-slate-900 border border-slate-850 text-brand-primary'
                  }`}>
                    {resumeFile ? <CheckCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">{resumeFile ? resumeFile.name : 'Select or Upload Resume'}</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">Support PDF, DOCX up to 10MB</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <input
                  type="file"
                  id="setup-resume-file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleResumeFileChange}
                />
              </div>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-slate-400" />
                <label className="text-xs font-semibold text-slate-400">Language</label>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase">Supported</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-2.5 px-4 text-xs outline-none focus:border-brand-primary text-slate-300 cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
              <span className="text-[9px] text-slate-500 block">Choose any supported language. Your interview questions and transcription will use this selection.</span>
            </div>

            {/* Side-by-side: Experience Level & Number of Questions */}
            <div className="grid grid-cols-2 gap-4">
              {/* Experience Level */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <label className="text-xs font-semibold text-slate-400">Experience Level</label>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase">Optional</span>
                </div>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-2.5 px-3 text-xs outline-none focus:border-brand-primary text-slate-300 cursor-pointer"
                >
                  <option value="Beginner">Entry Level (0-2 years)</option>
                  <option value="Intermediate">Mid Level (2-5 years)</option>
                  <option value="Advanced">Senior Level (5+ years)</option>
                </select>
              </div>

              {/* Number of Questions */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <label className="text-xs font-semibold text-slate-400">Number of questions</label>
                </div>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-2.5 px-3 text-xs outline-none focus:border-brand-primary text-slate-300 cursor-pointer"
                >
                  <option value="3">3 questions (~7 min)</option>
                  <option value="5">5 questions (~12 min)</option>
                  <option value="10">10 questions (~25 min)</option>
                </select>
              </div>
            </div>

            {/* Advanced Customization Accordion */}
            <div className="border border-slate-900 bg-slate-950/40 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-4.5 h-4.5 text-brand-primary" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Advanced Customization</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">Tune industry, focus skills, and exact practice questions.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-400 border border-slate-800 bg-slate-950 px-2 py-0.5 rounded font-semibold">
                    {advancedOpen ? 'Advanced' : 'Basic setup'}
                  </span>
                  {advancedOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
              </button>
              
              <AnimatePresence>
                {advancedOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4 border-t border-slate-900 space-y-4 bg-slate-950/80 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {/* Category Type */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Session Category</label>
                        <select
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3 text-xs text-slate-300 outline-none"
                        >
                          <option value="Technical">Technical Interview</option>
                          <option value="HR">HR / Behavioral</option>
                          <option value="System Design">System Design</option>
                        </select>
                      </div>
                      {/* Difficulty Grade */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Difficulty Grade</label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-900 rounded-xl py-2 px-3 text-xs text-slate-300 outline-none"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          <button
            onClick={startInterview}
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-sm font-semibold text-slate-950 shadow-glow-cyan flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-6 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-4.5 h-4.5" />
                Start Interview
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Screen 2: Live Room Session Interface */}
      {isSessionStarted && !completedReport && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main workspace (Question pane) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Dynamic question header */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>QUESTION {questionIndex + 1} OF 5</span>
                <span className="text-[10px] text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {type} Round
                </span>
              </div>
              
              <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                "{currentQuestionText}"
              </h2>

              <div className="flex items-center gap-3 pt-2 text-slate-400 text-xs">
                <button
                  onClick={() => speakText(currentQuestionText)}
                  className="px-3 py-1.5 rounded-xl border border-slate-900 bg-slate-950 flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-brand-primary" />
                  Read Question
                </button>
                <button
                  onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                  className="p-1.5 rounded-xl border border-slate-900 bg-slate-950 hover:text-white transition-colors"
                  title="Toggle auto voice output"
                >
                  {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
                </button>
              </div>
            </div>

            {/* Answer textarea and Voice Pulsing Wave */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4 relative">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <label className="font-semibold uppercase tracking-wider">Your Answer Response</label>
                {isRecording && (
                  <div className="flex items-center gap-1.5 text-brand-primary font-mono text-[10px]">
                    <span className="wave-bar animate-pulse" />
                    <span className="wave-bar animate-pulse" />
                    <span className="wave-bar animate-pulse" />
                    RECORDING LIVE AUDIO
                  </div>
                )}
              </div>

              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your response details here, or click the mic button to speak your answer aloud dynamically..."
                className="w-full h-40 bg-slate-950 border border-slate-900 rounded-2xl p-4 text-sm text-slate-200 outline-none focus:border-brand-primary resize-none leading-relaxed"
              />

              <div className="flex justify-between items-center pt-2">
                
                {/* Speech recording button */}
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-rose-600 text-white shadow-rose-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={isRecording ? "Stop Speech Input" : "Start Speech Input"}
                >
                  {isRecording ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Submit button */}
                <button
                  onClick={submitAnswer}
                  disabled={isSubmitting || !userAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover disabled:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-950 disabled:text-slate-500 shadow-glow-cyan flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit Answer
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </div>
            </div>

          </div>

          {/* Sidebar hardware panel (Cam mockup) */}
          <div className="space-y-6">
            
            {/* Webcam screen wrapper */}
            <div className="aspect-video w-full rounded-3xl border border-slate-900 bg-slate-900/10 overflow-hidden relative shadow-2xl flex items-center justify-center">
              
              {cameraEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 mx-auto">
                    <VideoOff className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Virtual Recruiter Mode</span>
                  <p className="text-[9px] text-slate-600 max-w-[160px] leading-relaxed mx-auto">Click settings below to enable your camera feed.</p>
                </div>
              )}

              {/* Glowing active indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-[8px] font-bold tracking-wider">
                <span className={`w-1.5 h-1.5 rounded-full ${cameraEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                CAMERA FEED
              </div>
            </div>

            {/* Hardware panel toggles */}
            <div className="p-5 rounded-3xl border border-slate-900 bg-slate-900/10 grid grid-cols-2 gap-3">
              <button
                onClick={handleCameraToggle}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  cameraEnabled
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {cameraEnabled ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                Camera
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isMuted
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                Mute Mic
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Screen 3: Session Complete Scorecard Report */}
      {completedReport && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          
          {/* Main header stats */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative shadow-2xl">
            <div className="absolute top-[-10%] right-[10%] w-[150px] h-[150px] rounded-full bg-brand-primary/10 blur-[80px] pointer-events-none" />
            <div>
              <div className="inline-flex px-2.5 py-1 rounded bg-brand-secondary/15 text-brand-secondary text-xs font-bold uppercase tracking-wider mb-2">
                Session Completed Report
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white">{completedReport.role} Mock</h2>
              <p className="text-xs text-slate-500 mt-1">
                Category: {completedReport.type} | Difficulty: {completedReport.difficulty} | Score date: {new Date(completedReport.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Circular rating score */}
            <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-900 p-4 rounded-2xl">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Evaluation Grade</span>
                <p className="text-xs text-slate-400 italic mt-0.5">Mock feedback</p>
              </div>
              <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-slate-950 shadow-glow-cyan shrink-0">
                <span className="text-2xl font-black text-white">{completedReport.overallScore}%</span>
              </div>
            </div>
          </div>

          {/* Feedback summary */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4.5 h-4.5 text-brand-primary" />
              Overall Recruiter Feedback
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {completedReport.overallFeedback}
            </p>
          </div>

          {/* Question-wise scorecard analysis logs */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1">Detailed Question Performance</h3>
            
            {completedReport.questions.map((q, idx) => (
              <div key={q._id || idx} className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
                
                {/* Question text header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Question {idx + 1}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-white pt-1">"{q.questionText}"</h4>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-900 text-xs font-extrabold text-brand-primary">
                    {q.evaluation.score}%
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-900/60 text-xs">
                  
                  {/* Strengths & Weaknesses */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-950/40 border border-slate-900">
                    <div>
                      <span className="font-bold text-white text-[11px] uppercase tracking-wider block">Strengths</span>
                      <ul className="list-disc pl-3 text-slate-400 space-y-1 mt-1 font-medium">
                        {q.evaluation.strengths.map((str, sIdx) => <li key={sIdx}>{str}</li>)}
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold text-white text-[11px] uppercase tracking-wider block">Weaknesses / Missing Details</span>
                      <ul className="list-disc pl-3 text-slate-400 space-y-1 mt-1 font-medium">
                        {q.evaluation.weaknesses.map((weak, wIdx) => <li key={wIdx}>{weak}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* Suggestions & Model Answer */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-950/40 border border-slate-900">
                    <div>
                      <span className="font-bold text-white text-[11px] uppercase tracking-wider block">Improvement Tips</span>
                      <ul className="list-disc pl-3 text-slate-400 space-y-1 mt-1 font-medium">
                        {q.evaluation.improvementSuggestions.map((tip, tIdx) => <li key={tIdx}>{tip}</li>)}
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold text-white text-[11px] uppercase tracking-wider block">Model Answer Preview</span>
                      <p className="text-slate-400 italic leading-relaxed mt-1 font-medium">{q.evaluation.modelAnswer}</p>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => {
                setCompletedReport(null);
                setIsSessionStarted(false);
                setSessionId(null);
                setQuestionIndex(0);
                setUserAnswer('');
              }}
              className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Start Another Practice Session
            </button>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-2xl bg-brand-primary hover:bg-brand-hover text-xs sm:text-sm font-semibold text-slate-950 shadow-glow-cyan flex items-center justify-center"
            >
              Back to Dashboard
            </Link>
          </div>

        </motion.div>
      )}

      {/* Individual Question feedback modal popup */}
      <AnimatePresence>
        {showFeedbackModal && currentEvaluation && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-lg w-full rounded-3xl border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-2xl glass-panel overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 text-white flex justify-between items-center border-b border-slate-900">
                <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-5 h-5 text-brand-primary" />
                  Question evaluated scorecard
                </h3>
                <span className="text-lg font-black text-brand-primary">{currentEvaluation.score}%</span>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
                
                {/* Feedback text */}
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Critique Summary</span>
                  <p className="text-slate-300 leading-relaxed font-medium">{currentEvaluation.feedback}</p>
                </div>

                <div className="h-px bg-slate-900" />

                {/* Lists */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Strengths</span>
                    <ul className="list-disc pl-3 text-slate-400 space-y-1 mt-1 leading-normal font-medium">
                      {currentEvaluation.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px]">Weaknesses</span>
                    <ul className="list-disc pl-3 text-slate-400 space-y-1 mt-1 leading-normal font-medium">
                      {currentEvaluation.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="h-px bg-slate-900" />

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Model Answer</span>
                  <p className="text-slate-400 italic leading-relaxed font-medium">{currentEvaluation.modelAnswer}</p>
                </div>

              </div>

              <div className="p-4 bg-slate-950 border-t border-slate-900 flex justify-end">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover text-xs font-semibold text-slate-950 shadow-glow-cyan cursor-pointer"
                >
                  Continue to Next Question
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </PageWrapper>
  );
};

export default InterviewRoom;
