import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useToast } from '../context/ToastContext';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  RotateCcw,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizSection = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Quiz configuration states
  const [category, setCategory] = useState(null); // 'aptitude', 'technical', 'coding'
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // idx: selected_option_index
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const timerRef = useRef(null);

  // Question database
  const quizData = {
    aptitude: [
      {
        q: "A train running at the speed of 60 km/h crosses a pole in 9 seconds. What is the length of the train in meters?",
        options: ["120 m", "150 m", "324 m", "180 m"],
        answer: 1 // index 1 (150 m)
      },
      {
        q: "The average weight of 8 persons increases by 2.5 kg when a new person comes in place of one of them weighing 65 kg. What is the weight of the new person?",
        options: ["76 kg", "82 kg", "85 kg", "88 kg"],
        answer: 2
      },
      {
        q: "If log 27 = 1.431, then the value of log 9 is:",
        options: ["0.934", "0.945", "0.954", "0.958"],
        answer: 2
      },
      {
        q: "A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?",
        options: ["3", "4", "5", "6"],
        answer: 2
      },
      {
        q: "What is the probability of getting a sum of 9 from two throws of a dice?",
        options: ["1/6", "1/8", "1/9", "1/12"],
        answer: 2
      }
    ],
    technical: [
      {
        q: "Which of the following is NOT a hook in React?",
        options: ["useState", "useEffect", "useFetcher", "useContext"],
        answer: 2 // useFetcher
      },
      {
        q: "What does the 'typeof' operator return for 'null' in JavaScript?",
        options: ["'null'", "'undefined'", "'object'", "'string'"],
        answer: 2
      },
      {
        q: "Which database system is structured around the relational document model instead of tabular rows?",
        options: ["PostgreSQL", "MongoDB", "MySQL", "SQLite"],
        answer: 1
      },
      {
        q: "In CSS, what is the default value of the position property?",
        options: ["relative", "absolute", "static", "fixed"],
        answer: 2
      },
      {
        q: "Which HTTP status code represents 'Internal Server Error'?",
        options: ["400", "401", "404", "500"],
        answer: 3
      }
    ],
    coding: [
      {
        q: "What is the time complexity of searching a value in a balanced Binary Search Tree (BST)?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        answer: 1
      },
      {
        q: "Which data structure operates on a Last In First Out (LIFO) model?",
        options: ["Queue", "Stack", "Binary Tree", "Graph"],
        answer: 1
      },
      {
        q: "What is the output of `console.log(2 + '2')` in JavaScript?",
        options: ["4", "'4'", "'22'", "NaN"],
        answer: 2
      },
      {
        q: "What is the primary usage of the `useCallback` hook in React?",
        options: ["Caches calculations", "Caches function references", "Triggers synchronous state changes", "Bypasses state variables"],
        answer: 1
      },
      {
        q: "Which sort algorithm has a worst-case time complexity of O(N²)?",
        options: ["Merge Sort", "Quick Sort", "Heap Sort", "Radix Sort"],
        answer: 1
      }
    ]
  };

  const activeQuestions = category ? quizData[category] : [];

  // Start timer loop on start
  useEffect(() => {
    if (isQuizStarted && !isQuizFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isQuizStarted, isQuizFinished]);

  const startQuiz = (cat) => {
    setCategory(cat);
    setIsQuizStarted(true);
    setIsQuizFinished(false);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setTimeLeft(300); // 5 minutes for 5 questions
    addToast(`Started ${cat} quiz! Time limit: 5 minutes.`, 'info');
  };

  const selectOption = (optIdx) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIdx]: optIdx
    });
  };

  const nextQuestion = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const finishQuiz = () => {
    setIsQuizFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    addToast('Quiz complete! Review your statistics.', 'success');
  };

  const resetQuiz = () => {
    setCategory(null);
    setIsQuizStarted(false);
    setIsQuizFinished(false);
    setSelectedAnswers({});
  };

  // Compute final score
  const getScoreData = () => {
    let correct = 0;
    activeQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correct += 1;
      }
    });
    const percent = Math.round((correct / activeQuestions.length) * 100);
    return { correct, total: activeQuestions.length, percent };
  };

  const scoreInfo = isQuizFinished ? getScoreData() : { correct: 0, total: 0, percent: 0 };

  // Timer format
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
  };

  // SVG Radial Gauge parameters
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreInfo.percent / 100) * circumference;

  return (
    <PageWrapper className="bg-slate-950 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden font-sans">
      
      {/* Glow overlays */}
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-brand-secondary/5 blur-[120px] pointer-events-none" />

      {/* START SCREEN: Select category */}
      {!isQuizStarted && (
        <div className="max-w-3xl mx-auto text-center space-y-10 py-10">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Interactive <span className="text-brand-primary">Quiz Arena</span>
            </h1>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Test your quantitative aptitude, technical standards, and logical coding skills under timed conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Aptitude card */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between items-center text-center space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Aptitude Quiz</h3>
                <p className="text-xs text-slate-500 mt-2">Quantitative formulas, probabilities, averages, and ratio computations.</p>
              </div>
              <button
                onClick={() => startQuiz('aptitude')}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-brand-primary font-bold text-xs border border-slate-900 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Start Aptitude
              </button>
            </div>

            {/* Technical card */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between items-center text-center space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Technical Quiz</h3>
                <p className="text-xs text-slate-500 mt-2">Standard web parameters, database differences, and REST specifications.</p>
              </div>
              <button
                onClick={() => startQuiz('technical')}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-brand-secondary font-bold text-xs border border-slate-900 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Start Technical
              </button>
            </div>

            {/* Coding card */}
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between items-center text-center space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Coding Logic</h3>
                <p className="text-xs text-slate-500 mt-2">Data structures time-complexities, search algorithms, and code outputs.</p>
              </div>
              <button
                onClick={() => startQuiz('coding')}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-brand-accent font-bold text-xs border border-slate-900 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Start Logic
              </button>
            </div>

          </div>
        </div>
      )}

      {/* QUIZ IN PROGRESS PANEL */}
      {isQuizStarted && !isQuizFinished && (
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Header tracker */}
          <div className="flex justify-between items-center p-4 rounded-2xl border border-slate-900 bg-slate-900/10">
            <div>
              <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">Timed Quiz Arena</span>
              <h2 className="text-sm font-bold text-white capitalize">{category} preparation</h2>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold ${
              timeLeft < 60
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 animate-pulse'
                : 'border-slate-800 bg-slate-950 text-slate-300'
            }`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-300"
            />
          </div>

          {/* Question box */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-8 min-h-[300px] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-500">Question {currentIdx + 1} of {activeQuestions.length}</span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">{activeQuestions[currentIdx]?.q}</h3>
            </div>

            {/* Options list */}
            <div className="grid grid-cols-1 gap-3.5 my-6">
              {activeQuestions[currentIdx]?.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => selectOption(oIdx)}
                  className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedAnswers[currentIdx] === oIdx
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-glow-cyan'
                      : 'border-slate-900 bg-slate-950/60 text-slate-300 hover:border-slate-800 hover:text-white'
                  }`}
                >
                  <span className="font-mono mr-2.5 text-brand-secondary">{String.fromCharCode(65 + oIdx)}.</span>
                  {opt}
                </button>
              ))}
            </div>

            {/* Nav controls */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-900/60">
              <button
                onClick={prevQuestion}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-xl border border-slate-900 bg-slate-950 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentIdx === activeQuestions.length - 1 ? (
                <button
                  onClick={finishQuiz}
                  className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-slate-950 font-bold text-xs cursor-pointer shadow-glow-cyan"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  disabled={selectedAnswers[currentIdx] === undefined}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-primary font-bold text-xs border border-slate-900 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  Next Question
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* QUIZ COMPLETION SCREEN */}
      {isQuizFinished && (
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Radial score box */}
          <div className="p-8 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative overflow-hidden">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Quiz Evaluation Completed</h2>
            
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-slate-900 fill-none"
                  strokeWidth="10"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className={`fill-none ${
                    scoreInfo.percent >= 80 ? 'stroke-brand-primary' : scoreInfo.percent >= 50 ? 'stroke-amber-400' : 'stroke-rose-500'
                  }`}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-extrabold text-white leading-none">{scoreInfo.percent}%</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{scoreInfo.correct} of {scoreInfo.total} Correct</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400 max-w-md">
                {scoreInfo.percent >= 80
                  ? "Outstanding! You displayed excellent mastery. Maintain this logical standard for top interviews."
                  : scoreInfo.percent >= 50
                  ? "Good job! You have solid foundational knowledge, but review the critiques below to cover missing parameters."
                  : "Requires focus. Brush up on core concepts and attempt the quiz again to verify progression."}
              </p>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={resetQuiz}
                className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4.5 h-4.5" /> Retake Quiz
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer shadow-glow-cyan transition-colors"
              >
                <LayoutDashboard className="w-4.5 h-4.5" /> Back to Dashboard
              </button>
            </div>
          </div>

          {/* Question by question critique logs */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1">Detailed Question Review</h3>
            <div className="space-y-4">
              {activeQuestions.map((q, idx) => {
                const selected = selectedAnswers[idx];
                const isCorrect = selected === q.answer;
                return (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-900 bg-slate-950/60 space-y-3">
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{q.q}</h4>
                        <div className="mt-2 text-[10px] sm:text-xs space-y-1">
                          <p className="text-slate-500">
                            Your Selection: <span className={`font-semibold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {selected !== undefined ? q.options[selected] : '(No choice made)'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-slate-400">
                              Correct Solution: <span className="font-semibold text-emerald-400">{q.options[q.answer]}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </PageWrapper>
  );
};

export default QuizSection;
