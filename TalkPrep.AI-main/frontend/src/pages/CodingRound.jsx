import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  Terminal,
  Play,
  Award,
  Sparkles,
  Timer,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const domainMockChallenges = {
  "Frontend Engineer": {
    _id: 'frontend_phone',
    title: "Implement Phone Number Formatter",
    category: "FRONTEND / JAVASCRIPT",
    difficulty: "Easy",
    description: "Write a function formatPhoneNumber(numbers) that takes an array of 10 integers (between 0 and 9) and returns a string of those numbers formatted as a phone number: (123) 456-7890.",
    constraints: ["Input array length is exactly 10.", "Numbers are integers from 0 to 9."],
    boilerplate: {
      javascript: "function formatPhoneNumber(numbers) {\n    // Write your frontend code here\n    \n}",
      python: "def format_phone_number(numbers):\n    # Write your frontend code here\n    pass",
      java: "public class Solution {\n    public String formatPhoneNumber(int[] numbers) {\n        // Write your code here\n        return \"\";\n    }\n}"
    },
    hints: [
      "Use array slicing or substring methods to group the digits.",
      "You can use template literals in JavaScript.",
      "Check that the input array length is exactly 10."
    ]
  },
  "Data Analyst": {
    _id: 'db_second_highest',
    title: "Second Highest Salary Query",
    category: "DATABASE / SQL",
    difficulty: "Medium",
    description: "Write a SQL query to find the second highest salary from the Employee table. If there is no second highest salary, return null.",
    constraints: ["Salary must be unique ranks.", "Result column should be SecondHighestSalary."],
    boilerplate: {
      javascript: "-- Write your SQL query here\nSELECT DISTINCT salary \nFROM Employee \n...",
      python: "# In python: write code to compute second highest salary in pandas dataframe\ndef second_highest_salary(df):\n    pass",
      java: "/* SQL Query */\nSELECT DISTINCT salary FROM Employee..."
    },
    hints: [
      "Use the ORDER BY and LIMIT clauses to find the ranks.",
      "Use OFFSET 1 to skip the highest salary.",
      "Wrap it in a subquery or use IFNULL / COALESCE to handle cases with no second highest salary."
    ]
  },
  "Java Developer": {
    _id: 'java_anagram',
    title: "Valid Anagram in Java",
    category: "JAVA / STRUCTURES",
    difficulty: "Easy",
    description: "Write a Java method isAnagram(String s, String t) that returns true if t is an anagram of s, and false otherwise.",
    constraints: ["1 <= s.length, t.length <= 10^4", "s and t consist of lowercase English letters."],
    boilerplate: {
      javascript: "function isAnagram(s, t) {\n    // Write your code here\n    return false;\n}",
      python: "def is_anagram(s, t):\n    # Write your code here\n    return False",
      java: "public class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your Java code here\n        return false;\n    }\n}"
    },
    hints: [
      "An anagram must have the exact same length.",
      "You can sort the character arrays and compare them.",
      "Alternatively, use a frequency array or hash map."
    ]
  },
  "Python Developer": {
    _id: 'py_two_sum',
    title: "Two Sum in Python",
    category: "PYTHON / ALGORITHMS",
    difficulty: "Easy",
    description: "Write a Python function two_sum(nums: list, target: int) -> list that returns indices of the two numbers such that they add up to target.",
    constraints: ["2 <= nums.length <= 10^4", "Only one valid answer exists."],
    boilerplate: {
      javascript: "function twoSum(nums, target) {\n    // Write your code here\n    return [];\n}",
      python: "def two_sum(nums, target):\n    # Write your Python code here\n    pass",
      java: "public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[0];\n    }\n}"
    },
    hints: [
      "Use a dictionary to store values and their indices as you iterate.",
      "The complement is target - current_value.",
      "Return the indices of current_value and complement if found."
    ]
  }
};

const CodingRound = () => {
  const { token, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Selected coding variables
  const [challenges, setChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  
  // Syntax theme state
  const [editorTheme, setEditorTheme] = useState('monokai');
  
  // Running timer system
  const [timeRemaining, setTimeRemaining] = useState(2700); // 45 minutes default
  const [isRunning, setIsRunning] = useState(false);

  // Executing solution compiler states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [showResultsOverlay, setShowResultsOverlay] = useState(false);

  // AI assistant hint states
  const [aiHintsList, setAiHintsList] = useState([]);
  const [isFetchingHint, setIsFetchingHint] = useState(false);

  // Load all coding challenges
  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }

    const fetchChallenges = async () => {
      try {
        const res = await api.get('/challenges');
        let fetchedChallenges = [];
        if (res.data && res.data.success) {
          fetchedChallenges = res.data.challenges;
        }

        // Determine user's domain role using keyword mapping
        const targetRole = user?.targetRole || 'default';
        let resolvedRole = 'default';
        const roleLower = targetRole.toLowerCase();
        if (roleLower.includes('frontend') || roleLower.includes('javascript') || roleLower.includes('web')) {
          resolvedRole = 'Frontend Engineer';
        } else if (roleLower.includes('data') || roleLower.includes('sql') || roleLower.includes('database') || roleLower.includes('analyst')) {
          resolvedRole = 'Data Analyst';
        } else if (roleLower.includes('java') && !roleLower.includes('javascript')) {
          resolvedRole = 'Java Developer';
        } else if (roleLower.includes('python')) {
          resolvedRole = 'Python Developer';
        }

        const domainChallenge = domainMockChallenges[resolvedRole];
        let finalChallenges = [...fetchedChallenges];
        if (domainChallenge) {
          // Prepend domain challenge if it is not already in the fetched list
          if (!finalChallenges.some(c => c._id === domainChallenge._id)) {
            finalChallenges = [domainChallenge, ...finalChallenges];
          }
        }

        setChallenges(finalChallenges);
        
        // Pre-select challenge if supplied in search URL, otherwise default to user's domain challenge
        const chId = searchParams.get('challengeId');
        const preSelected = finalChallenges.find(c => c._id === chId) || domainChallenge || finalChallenges[0];
        
        if (preSelected) {
          setActiveChallenge(preSelected);
          setCode(preSelected.boilerplate[language] || '');
        }
      } catch (err) {
        console.error(err);
        addToast('Connection failed. Defaulting to mock local challenges.', 'warning');
        
        // Mock offline fallback - fetch challenge based on target role
        const targetRole = user?.targetRole || 'default';
        let resolvedRole = 'default';
        const roleLower = targetRole.toLowerCase();
        if (roleLower.includes('frontend') || roleLower.includes('javascript') || roleLower.includes('web')) {
          resolvedRole = 'Frontend Engineer';
        } else if (roleLower.includes('data') || roleLower.includes('sql') || roleLower.includes('database') || roleLower.includes('analyst')) {
          resolvedRole = 'Data Analyst';
        } else if (roleLower.includes('java') && !roleLower.includes('javascript')) {
          resolvedRole = 'Java Developer';
        } else if (roleLower.includes('python')) {
          resolvedRole = 'Python Developer';
        }

        const domainChallenge = domainMockChallenges[resolvedRole] || {
          _id: 'default_twosum',
          title: "Two Sum",
          category: "Arrays",
          difficulty: "Easy",
          description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
          constraints: ["2 <= nums.length <= 10^4", "Only one valid answer exists."],
          boilerplate: {
            javascript: "function twoSum(nums, target) {\n    // Write your code here\n    \n}",
            python: "def two_sum(nums, target):\n    # Write your code here\n    pass"
          },
          hints: [
            "Use a Hash Map to store numbers and their indices.",
            "Compute the complement: target - nums[i].",
            "Check if complement exists in the map."
          ]
        };

        const mockCh = [domainChallenge];
        setChallenges(mockCh);
        setActiveChallenge(domainChallenge);
        setCode(domainChallenge.boilerplate[language] || domainChallenge.boilerplate.javascript || '');
      }
    };

    fetchChallenges();
    // Timer is deferred and starts only when the user types in the editor
    setIsRunning(false);
  }, [token, navigate, addToast, searchParams, user]);

  // Sync editor boilerplate when active challenge changes or language changes
  useEffect(() => {
    if (activeChallenge) {
      setCode(activeChallenge.boilerplate[language] || '');
    }
  }, [activeChallenge, language]);

  // Countdown timer clock tick
  useEffect(() => {
    let timer = null;
    if (isRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsRunning(false);
      addToast('Time has expired! Submit your solution.', 'warning');
    }
    return () => clearInterval(timer);
  }, [isRunning, timeRemaining]);

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsSubmitting(true);
    setConsoleOutput('Compiling code boilerplate...\nRunning test cases...');
    
    try {
      const res = await api.post(`/challenges/${activeChallenge._id}/submit`, {
        code,
        language
      });

      if (res.data.success) {
        setTestResults(res.data.testResults);
        setConsoleOutput(res.data.feedback);
        setShowResultsOverlay(true);
        if (res.data.allPassed) {
          addToast('Code solved! Great job.', 'success');
        } else {
          addToast('Some test cases failed.', 'warning');
        }
      }
    } catch (err) {
      console.error(err);
      addToast('Compiler simulator error.', 'error');
      setConsoleOutput('Error: Connection lost with running compilation server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestHint = async () => {
    if (!activeChallenge) return;
    setIsFetchingHint(true);
    addToast('Retrieving progressive logic hint...', 'info');

    const localHints = activeChallenge.hints || [];
    const currentHintsCount = aiHintsList.length;

    try {
      const res = await api.post('/ai/coding-hint', {
        title: activeChallenge.title,
        description: activeChallenge.description,
        code: code
      });

      if (res.data && res.data.success) {
        setAiHintsList(prev => [...prev, res.data.hint]);
        addToast('AI Code hint appended.', 'success');
        setIsFetchingHint(false);
        return;
      }
    } catch (err) {
      console.warn("AI hint endpoint failed, falling back to local progressive challenge hints:", err.message);
    }

    // Fallback progressive hints
    if (localHints.length > 0 && currentHintsCount < localHints.length) {
      const nextHint = localHints[currentHintsCount];
      setAiHintsList(prev => [...prev, nextHint]);
      addToast(`Progressive logic hint #${currentHintsCount + 1} unlocked.`, 'success');
    } else if (localHints.length > 0) {
      addToast('All progressive hints for this challenge have been unlocked!', 'warning');
    } else {
      addToast('No hints available for this challenge.', 'warning');
    }
    setIsFetchingHint(false);
  };

  return (
    <PageWrapper className="bg-slate-950 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative overflow-hidden font-sans">
      
      {/* Header tool bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-900 pb-4">
        
        {/* Challenge selector dropdown */}
        <div className="flex items-center gap-4">
          <select
            value={activeChallenge?._id || ''}
            onChange={(e) => {
              const selected = challenges.find(c => c._id === e.target.value);
              if (selected) {
                setActiveChallenge(selected);
                setAiHintsList([]);
              }
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-brand-primary cursor-pointer"
          >
            {challenges.map(c => (
              <option key={c._id} value={c._id}>{c.title} ({c.difficulty})</option>
            ))}
          </select>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          
          {/* Countdown Clock */}
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono transition-all duration-300 ${
            isRunning 
              ? 'text-brand-primary shadow-glow-cyan' 
              : 'text-slate-400 border-dashed animate-pulse'
          }`}>
            <Timer className="w-4 h-4 text-brand-primary" />
            <span>{formatTime(timeRemaining)}</span>
            {!isRunning && timeRemaining === 2700 && (
              <span className="text-[9px] text-slate-500 font-sans ml-1 uppercase font-normal">(Starts when you type)</span>
            )}
          </div>

          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 outline-none focus:border-brand-primary text-slate-200 cursor-pointer"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>

          {/* Syntax Editor Theme selector */}
          <select
            value={editorTheme}
            onChange={(e) => setEditorTheme(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 outline-none focus:border-brand-primary text-slate-400 cursor-pointer"
          >
            <option value="monokai">Monokai Dark</option>
            <option value="synthwave">Synthwave Glass</option>
            <option value="light">Eclipse Light</option>
          </select>

        </div>
      </div>

      {/* Main split work space */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Side: Challenge specs, Constraints, AI Hints */}
        <div className="space-y-6 flex flex-col justify-between">
          
          {/* Specifications card */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-brand-primary font-bold uppercase tracking-wider">{activeChallenge?.category}</span>
              <span className="text-[10px] text-slate-500 bg-slate-950 px-2.5 py-0.5 rounded-full uppercase">{activeChallenge?.difficulty}</span>
            </div>
            
            <h2 className="text-xl font-extrabold text-white">{activeChallenge?.title}</h2>
            
            {/* Description renderer */}
            <div className="text-xs sm:text-sm text-slate-400 leading-relaxed space-y-3 pt-2">
              {activeChallenge?.description.split('\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Constraints list */}
            {activeChallenge?.constraints && activeChallenge.constraints.length > 0 && (
              <div className="pt-4 border-t border-slate-900/40">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-2">Constraints</h4>
                <ul className="list-disc pl-4 text-xs text-slate-500 space-y-1">
                  {activeChallenge.constraints.map((cons, idx) => (
                    <li key={idx} className="font-mono">{cons}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* AI Helper panels */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-brand-primary" />
                AI Logic Assistant Hints
              </h3>
              <button
                onClick={handleRequestHint}
                disabled={isFetchingHint}
                className="px-2.5 py-1 rounded bg-brand-primary/10 border border-brand-primary/20 text-[10px] text-brand-primary font-bold cursor-pointer hover:bg-brand-primary/20"
              >
                {isFetchingHint ? 'Fetching Hint...' : 'Request AI Hint'}
              </button>
            </div>

            {/* Render progressive hints */}
            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
              {aiHintsList.length > 0 ? (
                aiHintsList.map((hint, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-brand-primary/15 bg-brand-primary/5 text-xs text-slate-300 leading-relaxed font-mono">
                    {/* Basic parsing in hints */}
                    {hint.split('\n').map((hPara, hIdx) => {
                      if (hPara.startsWith('* ') || hPara.startsWith('- ')) {
                        return <li key={hIdx} className="ml-2 pt-0.5">{hPara.substring(2)}</li>;
                      }
                      return <p key={hIdx}>{hPara}</p>;
                    })}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center border border-dashed border-slate-800 text-slate-600 text-xs">
                  Stuck? Click 'Request AI Hint' to receive progressive guidance hints.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: IDE workspace Code editor, Output terminal */}
        <div className="flex flex-col gap-6">
          
          {/* Rich Editor Pane */}
          <div className={`p-4 rounded-3xl border border-slate-900 flex-1 flex flex-col justify-between ${
            editorTheme === 'synthwave' ? 'bg-indigo-950/20' : editorTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-950'
          }`}>
            
            {/* Editor lines + text editor area */}
            <div className="flex gap-4 flex-1 items-stretch">
              
              {/* Line Numbers mock */}
              <div className="text-[10px] font-mono text-slate-600 text-right select-none space-y-1 border-r border-slate-900/60 pr-3 pt-1">
                {[...Array(16)].map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (!isRunning && timeRemaining > 0) {
                    setIsRunning(true);
                  }
                }}
                placeholder="// Write code here"
                className={`flex-1 bg-transparent border-none outline-none font-mono text-xs p-1 leading-relaxed resize-none h-[280px] ${
                  editorTheme === 'light' ? 'text-slate-800' : 'text-slate-200'
                }`}
              />

            </div>

            {/* IDE bottom bar */}
            <div className="flex justify-end pt-4 border-t border-slate-900/40">
              <button
                onClick={handleRunCode}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover disabled:bg-slate-900 text-slate-950 disabled:text-slate-500 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-glow-cyan cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Compile & Run Tests
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Console / Terminal pane */}
          <div className="p-5 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Terminal className="w-4 h-4" />
              Runtime Terminal Output
            </h4>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 min-h-[90px] font-mono text-xs leading-normal">
              {consoleOutput.split('\n').map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith('Error') || line.startsWith('Failed')
                      ? 'text-rose-400'
                      : line.startsWith('Success') || line.startsWith('Congrat')
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Test cases results popup overlay */}
      <AnimatePresence>
        {showResultsOverlay && testResults.length > 0 && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full rounded-3xl border border-slate-800 shadow-2xl glass-panel overflow-hidden"
            >
              <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 text-white flex justify-between items-center border-b border-slate-900">
                <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-5 h-5 text-brand-primary" />
                  Test Case Results
                </h3>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {testResults.map((tc, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase">Test Case {idx + 1}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        tc.passed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {tc.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <div className="text-[10px] space-y-1 font-mono pt-1 text-slate-500">
                      <div>Input: <span className="text-slate-300">{tc.input}</span></div>
                      <div>Expected: <span className="text-slate-300">{tc.expectedOutput}</span></div>
                      <div>Actual: <span className={tc.passed ? 'text-emerald-400' : 'text-rose-400'}>{tc.actualOutput}</span></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-950 border-t border-slate-900 flex justify-end gap-3">
                <button
                  onClick={() => setShowResultsOverlay(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Close Results
                </button>
                <button
                  onClick={() => {
                    setShowResultsOverlay(false);
                    navigate('/dashboard');
                  }}
                  className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover text-xs font-semibold text-slate-950 cursor-pointer shadow-glow-cyan"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </PageWrapper>
  );
};

export default CodingRound;
