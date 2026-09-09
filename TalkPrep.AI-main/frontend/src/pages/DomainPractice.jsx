import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Award,
  ArrowRight,
  BookOpen,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  LayoutDashboard,
  Cpu,
  CornerDownRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DomainPractice = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Selected domain state
  const [selectedDomain, setSelectedDomain] = useState(null); // domain object
  const [isRoomStarted, setIsRoomStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Active question loop states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [activeEvaluation, setActiveEvaluation] = useState(null); // AI response evaluation object
  const [sessionHistory, setSessionHistory] = useState([]); // Array of { question, answer, evaluation }

  // 8 Domains questions database (3 questions per domain)
  const domains = [
    {
      id: 'frontend',
      title: 'Frontend Developer',
      description: 'HTML5, ES6+, CSS layouts (Grid/Flexbox), React state hooks, and client-side page rendering.',
      questions: [
        {
          text: "What is the difference between client-side rendering (CSR) and server-side rendering (SSR), and when should you choose SSR?",
          suggested: "SEO crawler indexes, load latency, initial bundle size"
        },
        {
          text: "Explain the virtual DOM diffing process in React and how it reconciles updates.",
          suggested: "Reconciliation, key indices, state rendering comparison"
        },
        {
          text: "Explain lexical closures in JavaScript and how they retain access to outer function variables.",
          suggested: "Outer scopes lexical binding, private closures cache variables"
        }
      ]
    },
    {
      id: 'backend',
      title: 'Backend Developer',
      description: 'REST API design patterns, SQL vs NoSQL models, indexing optimizations, and query performance.',
      questions: [
        {
          text: "What is a database index, and how does it speed up queries at the expense of write operations?",
          suggested: "B-Tree data structure, lookup optimization, binary search indexes"
        },
        {
          text: "Explain the difference between SQL and NoSQL engines relative to transactions (ACID vs BASE).",
          suggested: "Structured relational tables, document JSON shards, atomic commits"
        },
        {
          text: "What is CORS (Cross-Origin Resource Sharing) and how do headers secure backend servers?",
          suggested: "Access-Control-Allow-Origin browser verification, API request rejection"
        }
      ]
    },
    {
      id: 'fullstack',
      title: 'Full Stack Developer',
      description: 'Connecting client UI grids with secure Node/Express routes, managing JSON web tokens, and sharding.',
      questions: [
        {
          text: "How do you securely configure user authentication using JWT headers, and where should you store them?",
          suggested: "HttpOnly cookies, local storage XSS warnings, authorization bearer tokens"
        },
        {
          text: "How do you handle transactional operations that involve writing to multiple collections simultaneously?",
          suggested: "Database atomic transactions, rollbacks, error middlewares sharding"
        },
        {
          text: "What is the MVC (Model-View-Controller) structure and how does it decouple business layers?",
          suggested: "Data models schemas, express endpoints, client render templates"
        }
      ]
    },
    {
      id: 'uiux',
      title: 'UI/UX Designer',
      description: 'Contrast rules (WCAG guidelines), wireframing design fidelity, Fitts\'s Law, and user research heuristics.',
      questions: [
        {
          text: "What is Fitts's Law in user interface design, and how does it impact button placement and CTA size?",
          suggested: "Target distance size, click reach speed, layout sizing"
        },
        {
          text: "How do WCAG accessibility rules impact contrast ratio selections on modern dark-themed web interfaces?",
          suggested: "Color readability, text sizes, reader visual aids"
        },
        {
          text: "What is the difference between user flows, wireframes, and interactive prototypes?",
          suggested: "Low vs high fidelity layout grids, click logic maps"
        }
      ]
    },
    {
      id: 'java',
      title: 'Java Developer',
      description: 'JVM garbage collection routines, heap configurations, multithreading synchronizations, and OOP.',
      questions: [
        {
          text: "How does Java Garbage Collection reclaim heap memory, and what is the difference between minor and major GC?",
          suggested: "JVM memory spaces, mark-sweep compaction, stop-the-world logs"
        },
        {
          text: "What is the difference between HashMap, HashTable, and ConcurrentHashMap in Java?",
          suggested: "Thread safety synchronization, null keys, bucket locks"
        },
        {
          text: "Explain polymorphism in OOP, and distinguish between method overloading and overriding.",
          suggested: "Compile-time binding, runtime dynamic dispatching, inheritance overrides"
        }
      ]
    },
    {
      id: 'python',
      title: 'Python Developer',
      description: 'Mutable vs immutable structures, python decorator functions, generator statements, and PEP 8 guidelines.',
      questions: [
        {
          text: "What is the difference between list mutable arrays and tuple immutable arrays in Python?",
          suggested: "Memory allocation speeds, item re-assignment, dictionary hash values"
        },
        {
          text: "Explain Python decorators and write a brief description of how they wrap outer function logs.",
          suggested: "Higher-order callback functions, meta-programming wrappers"
        },
        {
          text: "What are generator statements (yield keyword) in Python and how do they optimize RAM overhead?",
          suggested: "Lazy evaluation arrays, iteration pipelines, buffer sharding"
        }
      ]
    },
    {
      id: 'dsa',
      title: 'Data Structures',
      description: 'Graph traversals (DFS vs BFS), Hash collision strategies, sorting arrays, and stack/queue bounds.',
      questions: [
        {
          text: "What is a Hash Collision, and how do chaining and open addressing resolve key-sharding collisions?",
          suggested: "Linked list bucket chains, probing offsets, hash map indexes"
        },
        {
          text: "Compare Depth First Search (DFS) and Breadth First Search (BFS) relative to space complexity constraints.",
          suggested: "Recursion call stacks, FIFO queue nodes, traversal sharding"
        },
        {
          text: "Explain a practical application of a Stack and how it maintains element orders.",
          suggested: "Undo-redo buffer tracks, parser compilations, LIFO operations"
        }
      ]
    },
    {
      id: 'hr',
      title: 'HR Interview Questions',
      description: 'STAR storytelling frameworks, conflict resolutions, professional goals audit, and teamwork evaluations.',
      questions: [
        {
          text: "Tell me about a time you faced a tight project deadline. How did you organize deliverables?",
          suggested: "STAR method description, agile prioritizations, teammate alignment"
        },
        {
          text: "Why should we hire you over other candidates for this software engineering position?",
          suggested: "Alignment with product goals, technical capabilities, passion for logic"
        },
        {
          text: "How do you handle technical disagreements or conflicts with senior engineers?",
          suggested: "Facts over emotions, pros-cons assessment, supporting ultimate commits"
        }
      ]
    }
  ];

  const handleStartPractice = (dom) => {
    setSelectedDomain(dom);
    setIsRoomStarted(true);
    setIsFinished(false);
    setCurrentIdx(0);
    setUserAnswer('');
    setActiveEvaluation(null);
    setSessionHistory([]);
    addToast(`Launched ${dom.title} Practice. 3 questions loaded!`, 'info');
  };

  const handleValidateAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      addToast('Please type an answer to validate.', 'warning');
      return;
    }

    setIsValidating(true);
    const activeQuestionText = selectedDomain.questions[currentIdx].text;

    try {
      // Call standard AI evaluate endpoint
      const res = await api.post('/ai/evaluate', {
        question: activeQuestionText,
        answer: userAnswer
      });

      if (res.data.success) {
        setActiveEvaluation(res.data.evaluation);
        addToast('AI evaluation parsed successfully!', 'success');
      } else {
        addToast('Failed to evaluate. Using simulated feedback.', 'warning');
      }
    } catch (err) {
      console.error(err);
      // Mock Fallback validation logic
      setTimeout(() => {
        const words = userAnswer.trim().split(/\s+/).length;
        const score = words < 10 ? 35 : words < 25 ? 65 : 88;
        
        setActiveEvaluation({
          score,
          feedback: `Simulated validation: Your response contains ${words} words. The answer covers core definitions but lacks depth in performance sharding and specific technical examples.`,
          strengths: ["Addressed the prompt core question", "Layed out brief workflow details"],
          weaknesses: ["Missing advanced framework terms", "Lacks production scaling trade-offs"],
          improvementSuggestions: ["Add technical vocabulary keywords", "Elaborate with dynamic coding metrics"],
          modelAnswer: `Model Response: A premium answer should clearly explain the core logic, mention secondary trade-offs, and outline dynamic workflow parameters.`
        });
        addToast('Using local mock AI feedback fallback.', 'info');
      }, 1000);
    } finally {
      setIsValidating(false);
    }
  };

  const handleNext = () => {
    // Save current question record to session history
    const activeQuestion = selectedDomain.questions[currentIdx];
    const newHistory = [
      ...sessionHistory,
      {
        question: activeQuestion.text,
        answer: userAnswer,
        evaluation: activeEvaluation
      }
    ];
    setSessionHistory(newHistory);

    if (currentIdx < selectedDomain.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setUserAnswer('');
      setActiveEvaluation(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetake = () => {
    setIsFinished(false);
    setCurrentIdx(0);
    setUserAnswer('');
    setActiveEvaluation(null);
    setSessionHistory([]);
  };

  const getOverallScore = () => {
    if (sessionHistory.length === 0) return 0;
    let sum = 0;
    sessionHistory.forEach(sh => {
      sum += sh.evaluation.score;
    });
    return Math.round(sum / sessionHistory.length);
  };

  const overallScore = isFinished ? getOverallScore() : 0;

  // Grade color helper
  const getGradeStyle = (score) => {
    if (score >= 80) return { text: 'Correct Answer', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', icon: CheckCircle };
    if (score >= 50) return { text: 'Partially Correct', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5', icon: AlertTriangle };
    return { text: 'Weak Answer', color: 'text-rose-400 border-rose-500/20 bg-rose-500/5', icon: HelpCircle };
  };

  return (
    <PageWrapper className="bg-slate-950 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden font-sans">
      
      {/* Background neon glows */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-brand-secondary/5 blur-[120px] pointer-events-none" />

      {/* START GRID SELECTION BOARD */}
      {!isRoomStarted && (
        <div className="space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Domain <span className="text-brand-primary">Practice Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Practice specialized job domain questions. Answer in detail and receive instant, AI-powered score audits, critique feedback, and code pointers.
            </p>
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((dom) => (
              <div
                key={dom.id}
                className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between items-start space-y-5 hover:border-slate-800 transition-all group"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform duration-200">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-brand-primary transition-colors">{dom.title}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 leading-normal line-clamp-3">{dom.description}</p>
                </div>

                <button
                  onClick={() => handleStartPractice(dom)}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-[10px] font-bold text-slate-400 hover:text-white border border-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3 h-3" /> Practice Domain
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE QUESTION BOARD */}
      {isRoomStarted && !isFinished && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header tracker */}
          <div className="flex justify-between items-center p-4 rounded-2xl border border-slate-900 bg-slate-900/10">
            <div>
              <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">Practice Room</span>
              <h2 className="text-sm font-bold text-white">{selectedDomain.title}</h2>
            </div>
            <div className="text-xs font-mono font-bold text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-900">
              Q: {currentIdx + 1} / {selectedDomain.questions.length}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              style={{ width: `${((currentIdx + 1) / selectedDomain.questions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-300"
            />
          </div>

          {/* Questions desk */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Answer panel (Form) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-6">
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Question Prompt</span>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">{selectedDomain.questions[currentIdx].text}</h3>
                </div>

                <form onSubmit={handleValidateAnswer} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">Type your answer response</label>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your explanation here. Use technical definitions, keywords, or examples..."
                      rows="6"
                      disabled={activeEvaluation !== null || isValidating}
                      className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-3 px-4 text-xs sm:text-sm text-slate-200 outline-none focus:border-brand-primary leading-relaxed resize-none disabled:opacity-60"
                      required
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                    >
                      Exit Session
                    </button>

                    {!activeEvaluation ? (
                      <button
                        type="submit"
                        disabled={isValidating}
                        className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-slate-950 font-bold text-xs shadow-glow-cyan flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {isValidating ? (
                          <>
                            <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            Evaluating...
                          </>
                        ) : (
                          <>
                            <Cpu className="w-4 h-4" /> Validate via AI
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-primary font-bold text-xs border border-slate-900 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        Next Question
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Critique Feedback panel */}
            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                {activeEvaluation ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-4"
                  >
                    
                    {/* Score badge */}
                    {(() => {
                      const grade = getGradeStyle(activeEvaluation.score);
                      const Icon = grade.icon;
                      return (
                        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${grade.color}`}>
                          <Icon className="w-5 h-5 shrink-0" />
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider block">{grade.text}</span>
                            <span className="text-lg font-extrabold mt-0.5 block">AI Score: {activeEvaluation.score}%</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Critique summary */}
                    <div className="p-5 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4 text-xs max-h-[360px] overflow-y-auto pr-1">
                      <div className="space-y-1">
                        <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">AI Critique Critique</h4>
                        <p className="text-slate-400 leading-relaxed text-[11px]">{activeEvaluation.feedback}</p>
                      </div>

                      {activeEvaluation.improvementSuggestions?.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-900/60">
                          <h4 className="font-bold text-brand-secondary uppercase tracking-wider text-[10px]">Improvement Suggestions</h4>
                          <ul className="space-y-1 text-slate-500">
                            {activeEvaluation.improvementSuggestions.map((s, idx) => (
                              <li key={idx} className="flex items-start gap-1 leading-normal text-[11px]">
                                <CornerDownRight className="w-3 h-3 text-brand-secondary shrink-0 mt-0.5" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activeEvaluation.modelAnswer && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-900/60">
                          <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Sample Model Answer</h4>
                          <p className="text-slate-500 leading-relaxed text-[10px] italic">{activeEvaluation.modelAnswer}</p>
                        </div>
                      )}
                    </div>

                  </motion.div>
                ) : (
                  <div className="p-6 rounded-3xl border border-dashed border-slate-900 bg-slate-950/40 text-center text-xs text-slate-600 h-full min-h-[180px] flex flex-col justify-center items-center gap-2">
                    <Cpu className="w-8 h-8 text-slate-800 animate-pulse" />
                    <span>Submit your answer response to load the AI-powered critique score assessment.</span>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      )}

      {/* PRACTICE SESSION COMPLETION SCREEN */}
      {isFinished && (
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Main completion scorecard */}
          <div className="p-8 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative overflow-hidden">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-6.5 h-6.5 text-brand-primary" />
              Practice Domain Complete
            </h2>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-900 flex items-center justify-between gap-6 max-w-sm w-full">
              <div className="text-left">
                <span className="text-[10px] text-slate-500 uppercase block">Overall Grade</span>
                <span className={`text-2xl font-extrabold ${overallScore >= 80 ? 'text-emerald-400' : overallScore >= 50 ? 'text-amber-400' : 'text-rose-500'}`}>
                  {overallScore}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block">Tasks Solved</span>
                <span className="text-xs font-bold text-white">{sessionHistory.length} Questions</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md">
              Great practice session! Consistent domain-specific technical preparation boosts memory recall and helps build structured technical communication skills.
            </p>

            <div className="flex gap-4 pt-2">
              <button
                onClick={handleRetake}
                className="px-5 py-2.5 rounded-xl border border-slate-850 bg-slate-950 text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4.5 h-4.5" /> Retake Practice
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-glow-cyan transition-colors"
              >
                <LayoutDashboard className="w-4.5 h-4.5" /> Dashboard Hub
              </button>
            </div>
          </div>

          {/* Answer logs review list */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1">Review Session Responses</h3>
            <div className="space-y-4">
              {sessionHistory.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-900 bg-slate-950/60 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-normal pr-4">Q{idx + 1}: {item.question}</h4>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      item.evaluation.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : item.evaluation.score >= 50 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {item.evaluation.score}%
                    </span>
                  </div>

                  <div className="text-[11px] space-y-2 border-t border-slate-900/60 pt-3">
                    <p className="text-slate-400"><strong className="text-slate-300 block mb-0.5">Your Response:</strong> {item.answer}</p>
                    <p className="text-slate-500"><strong className="text-slate-300 block mb-0.5">AI Critique:</strong> {item.evaluation.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </PageWrapper>
  );
};

export default DomainPractice;
