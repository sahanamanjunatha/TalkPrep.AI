import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Adapter override for demo/mock mode
const originalAdapter = api.defaults.adapter || axios.defaults.adapter;
api.defaults.adapter = async (config) => {
  const token = localStorage.getItem('token');
  if (token === 'mock-jwt-token-for-demo-purposes') {
    // Get logged-in user email
    const loggedInUserStr = localStorage.getItem('user');
    let userEmail = 'user@talkprep.ai';
    if (loggedInUserStr) {
      try {
        userEmail = JSON.parse(loggedInUserStr).email || 'user@talkprep.ai';
      } catch (e) {
        console.error(e);
      }
    }

    // Helper functions to get/set dashboard data per user
    const getDashboardData = (email) => {
      const key = `dashboard_data_${email}`;
      let saved = localStorage.getItem(key);
      if (!saved) {
        const isDefaultUser = email === 'user@talkprep.ai';
        const isDefaultAdmin = email === 'admin@talkprep.ai';
        
        const defaultData = {
          stats: {
            interviewsCompleted: isDefaultUser ? 3 : isDefaultAdmin ? 10 : 0,
            challengesSolved: isDefaultUser ? 2 : isDefaultAdmin ? 8 : 0,
            averageInterviewScore: isDefaultUser ? 82 : isDefaultAdmin ? 92 : 0,
            streakCount: isDefaultUser ? 4 : isDefaultAdmin ? 12 : 0
          },
          badges: isDefaultUser ? [
            { title: 'Welcome onboard!', description: 'Created your AI Mock Interview account.', icon: 'Award' },
            { title: 'Smart Coder', description: 'Solved a daily coding challenge.', icon: 'Award' }
          ] : [
            { title: 'Welcome onboard!', description: 'Created your AI Mock Interview account.', icon: 'Award' }
          ],
          recentInterviews: isDefaultUser ? [
            {
              _id: 'mock-session-1',
              role: 'Software Engineer',
              type: 'Technical',
              difficulty: 'Intermediate',
              overallScore: 82,
              createdAt: new Date().toISOString(),
              questions: [
                {
                  questionText: 'Explain the event loop in JavaScript and how it handles asynchronous operations.',
                  evaluation: {
                    score: 82,
                    feedback: 'Your answer is well-structured and covers the key points successfully.',
                    strengths: [
                      'Clear explanation of the Call Stack and Task Queues.',
                      'Good pacing and vocal articulation.'
                    ],
                    weaknesses: [
                      'Could mention the Microtask Queue specifically.'
                    ],
                    improvementSuggestions: [
                      'Explain the priority differences between promise callbacks and timeouts.'
                    ],
                    modelAnswer: 'JavaScript executes synchronous code on the call stack. Asynchronous callbacks are queued in the Task/Microtask queues, which the event loop moves to the stack once empty.'
                  }
                }
              ]
            }
          ] : [],
          recentResume: isDefaultUser ? {
            fileName: 'John_Candidate_Resume.pdf',
            score: 85
          } : null,
          dailyChallenge: {
            _id: 'mock-challenge-1',
            title: 'Two Sum',
            description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
            difficulty: 'Easy'
          },
          weeklyActivity: isDefaultUser ? [
            { day: 'Mon', count: 1 },
            { day: 'Tue', count: 2 },
            { day: 'Wed', count: 0 },
            { day: 'Thu', count: 1 },
            { day: 'Fri', count: 3 },
            { day: 'Sat', count: 1 },
            { day: 'Sun', count: 0 }
          ] : [
            { day: 'Mon', count: 0 },
            { day: 'Tue', count: 0 },
            { day: 'Wed', count: 0 },
            { day: 'Thu', count: 0 },
            { day: 'Fri', count: 0 },
            { day: 'Sat', count: 0 },
            { day: 'Sun', count: 0 }
          ]
        };
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
      }
      return JSON.parse(saved);
    };

    const saveDashboardData = (email, data) => {
      const key = `dashboard_data_${email}`;
      localStorage.setItem(key, JSON.stringify(data));
    };

    const url = config.url || '';
    let data = { success: true };
    
    if (url.includes('/auth/profile')) {
      const user = localStorage.getItem('user');
      data = { success: true, user: user ? JSON.parse(user) : {} };
    } else if (url.includes('/dashboard')) {
      data = {
        success: true,
        data: getDashboardData(userEmail)
      };
    } else if (url.includes('/resumes/analyze')) {
      const payload = config.data ? JSON.parse(config.data) : {};
      const score = 80 + Math.floor(Math.random() * 15);
      const fileName = payload.fileName || 'Resume.pdf';
      
      const dash = getDashboardData(userEmail);
      dash.recentResume = {
        fileName: fileName,
        score: score
      };
      saveDashboardData(userEmail, dash);
      
      data = {
        success: true,
        analysis: {
          fileName: fileName,
          score: score,
          matchedKeywords: ['React', 'JavaScript', 'CSS', 'HTML', 'Git'],
          missingKeywords: ['TypeScript', 'Jest', 'CI/CD'],
          atsSuggestions: [
            'Consider adding more measurable impact metrics to your bullet points.',
            'Include missing keywords such as TypeScript in your skills section.',
            'Ensure layout uses standard margins and simple columns.'
          ],
          formattingFeedback: [
            'Formatting looks clean and easily parsable.',
            'Fonts and headers are structured sequentially.'
          ],
          roleCompatibility: [
            { role: 'Frontend Engineer', compatibilityPercentage: score },
            { role: 'Software Engineer', compatibilityPercentage: Math.max(50, score - 10) }
          ]
        }
      };
    } else if (url.includes('/challenges/') && url.includes('/submit')) {
      const dash = getDashboardData(userEmail);
      dash.stats.challengesSolved += 1;
      
      if (!dash.badges.some(b => b.title === 'Smart Coder')) {
        dash.badges.push({
          title: 'Smart Coder',
          description: 'Solved a daily coding challenge.',
          icon: 'Award'
        });
      }
      saveDashboardData(userEmail, dash);
      
      data = {
        success: true,
        allPassed: true,
        feedback: 'Success: All test cases passed successfully!\nTime Complexity: O(N)\nSpace Complexity: O(N)',
        testResults: [
          { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]', actualOutput: '[0, 1]', passed: true },
          { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]', actualOutput: '[1, 2]', passed: true }
        ]
      };
    } else if (url.includes('/challenges')) {
      data = {
        success: true,
        challenges: [
          {
            _id: 'mock-challenge-1',
            title: 'Two Sum',
            description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution.',
            difficulty: 'Easy',
            category: 'Arrays',
            constraints: ['2 <= nums.length <= 10^4', 'Only one valid answer exists.'],
            boilerplate: {
              javascript: 'function twoSum(nums, target) {\n    // Write your code here\n    \n}',
              python: 'def two_sum(nums, target):\n    # Write your code here\n    pass',
              java: 'public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[0];\n    }\n}'
            },
            hints: [
              'Use a Hash Map to store numbers and their indices.',
              'Compute the complement: target - nums[i].',
              'Check if complement exists in the map.'
            ]
          }
        ]
      };
    } else if (url.includes('/analytics')) {
      const dash = getDashboardData(userEmail);
      data = {
        success: true,
        analytics: {
          overallPerformance: dash.stats.averageInterviewScore || 0,
          speechSpeed: 125,
          fillerWordIndex: 2
        }
      };
    } else if (url.includes('/interviews/start')) {
      const payload = config.data ? JSON.parse(config.data) : {};
      const roleStr = payload.role || 'Software Engineer';
      const typeStr = payload.type || 'Technical';
      const diffStr = payload.difficulty || 'Intermediate';
      const numQ = payload.numQuestions || 5;
      
      const questionsList = [
        `Explain the difference between let, const, and var in JavaScript.`,
        `How does the virtual DOM boost rendering speeds in React?`,
        `How do you optimize render performance in a massive React application with frequent state updates?`,
        `Why do you want to join our company, and what motivated you to apply?`,
        `Tell me about a time you failed or faced a major setback in a project. How did you handle it?`
      ];
      
      const sessionId = 'mock-session-' + Date.now();
      const sessionState = {
        id: sessionId,
        role: roleStr,
        type: typeStr,
        difficulty: diffStr,
        numQuestions: numQ,
        currentIndex: 0,
        questions: questionsList.slice(0, numQ),
        answers: []
      };
      
      localStorage.setItem(`active_session_${userEmail}`, JSON.stringify(sessionState));
      
      data = {
        success: true,
        session: {
          id: sessionId,
          role: roleStr,
          type: typeStr,
          difficulty: diffStr,
          currentQuestionText: sessionState.questions[0],
          currentQuestionIndex: 0
        }
      };
    } else if (url.includes('/interviews/') && url.includes('/submit')) {
      const payload = config.data ? JSON.parse(config.data) : {};
      const answerText = payload.answer || '';
      
      const activeSessionKey = `active_session_${userEmail}`;
      const sessionStateStr = localStorage.getItem(activeSessionKey);
      
      if (sessionStateStr) {
        const sessionState = JSON.parse(sessionStateStr);
        const currentIndex = sessionState.currentIndex;
        const currentQuestion = sessionState.questions[currentIndex];
        
        const qScore = 75 + Math.floor(Math.random() * 20);
        
        sessionState.answers.push({
          questionText: currentQuestion,
          evaluation: {
            score: qScore,
            feedback: 'Your answer is well-structured and covers the key points successfully.',
            strengths: [
              'Demonstrates solid understanding of core software engineering patterns.',
              'Articulates trade-offs clearly with structured logical sections.'
            ],
            weaknesses: [
              'Could expand more on performance optimization constraints.',
              'Avoid using too many fillers or conversational hesitations.'
            ],
            improvementSuggestions: [
              'Try to explicitly quote runtime complexity where applicable.',
              'Practice pacing by speaking slightly slower to improve articulation.'
            ],
            modelAnswer: 'A model answer would explain key concepts, name relevant design considerations, outline typical implementation challenges, and detail a robust step-by-step resolution.'
          }
        });
        
        const nextIndex = currentIndex + 1;
        sessionState.currentIndex = nextIndex;
        
        if (nextIndex >= sessionState.numQuestions) {
          const overallScore = Math.round(sessionState.answers.reduce((acc, q) => acc + q.evaluation.score, 0) / sessionState.numQuestions);
          
          const completedSession = {
            _id: sessionState.id,
            role: sessionState.role,
            type: sessionState.type,
            difficulty: sessionState.difficulty,
            overallScore: overallScore,
            overallFeedback: 'Great work! You demonstrated strong capability and clear communication skills during this mock round.',
            createdAt: new Date().toISOString(),
            questions: sessionState.answers
          };
          
          const dash = getDashboardData(userEmail);
          dash.stats.interviewsCompleted += 1;
          
          const totalScores = dash.recentInterviews.reduce((acc, s) => acc + s.overallScore, 0) + overallScore;
          dash.stats.averageInterviewScore = Math.round(totalScores / (dash.recentInterviews.length + 1));
          
          dash.recentInterviews.unshift(completedSession);
          dash.stats.streakCount += 1;
          
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const todayName = daysOfWeek[new Date().getDay()];
          const dayAct = dash.weeklyActivity.find(d => d.day === todayName);
          if (dayAct) {
            dayAct.count += 1;
          }
          
          if (overallScore >= 80 && !dash.badges.some(b => b.title === 'Honors Prep')) {
            dash.badges.push({
              title: 'Honors Prep',
              description: 'Scored above 80% on average.',
              icon: 'Award'
            });
          }
          
          saveDashboardData(userEmail, dash);
          localStorage.removeItem(activeSessionKey);
          
          data = {
            success: true,
            isFinished: true,
            session: completedSession
          };
        } else {
          localStorage.setItem(activeSessionKey, JSON.stringify(sessionState));
          
          data = {
            success: true,
            isFinished: false,
            evaluation: {
              score: qScore,
              feedback: 'Well explained. Good articulation.',
              strengths: [
                'Demonstrates solid understanding of core software engineering patterns.',
                'Articulates trade-offs clearly with structured logical sections.'
              ],
              weaknesses: [
                'Could expand more on performance optimization constraints.',
                'Avoid using too many fillers or conversational hesitations.'
              ],
              improvementSuggestions: [
                'Try to explicitly quote runtime complexity where applicable.',
                'Practice pacing by speaking slightly slower to improve articulation.'
              ],
              modelAnswer: 'A model answer would explain key concepts, name relevant design considerations, outline typical implementation challenges, and detail a robust step-by-step resolution.'
            },
            currentQuestionText: sessionState.questions[nextIndex],
            currentQuestionIndex: nextIndex
          };
        }
      } else {
        data = {
          success: false,
          message: 'Active interview session not found.'
        };
      }
    } else if (url.includes('/interviews/')) {
      const pathParts = url.split('/');
      const sessionId = pathParts[pathParts.length - 1];
      
      const dash = getDashboardData(userEmail);
      const session = dash.recentInterviews.find(s => s._id === sessionId);
      
      if (session) {
        data = {
          success: true,
          session: session
        };
      } else {
        data = {
          success: false,
          message: 'Past interview session not found.'
        };
      }
    } else if (url.includes('/ai/coding-hint')) {
      data = {
        success: true,
        hint: 'Hint: Try using a hash map to keep track of indices of elements we have visited. If target minus current element is already in the map, we have found our pair!'
      };
    } else if (url.includes('/ai/evaluate')) {
      data = {
        success: true,
        evaluation: {
          score: 85,
          feedback: 'Excellent response. You clearly defined the core concepts and gave concrete technical examples.'
        }
      };
    } else if (url.includes('/admin/stats')) {
      data = {
        success: true,
        stats: {
          totalUsers: 12,
          totalInterviews: 24,
          totalChallenges: 3,
          activeStreak: 5
        }
      };
    } else if (url.includes('/admin/users')) {
      data = {
        success: true,
        users: [
          { _id: '1', name: 'John Candidate', email: 'user@talkprep.ai', role: 'user', createdAt: new Date().toISOString() },
          { _id: '2', name: 'System Admin', email: 'admin@talkprep.ai', role: 'admin', createdAt: new Date().toISOString() }
        ]
      };
    }
    
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }
  
  if (originalAdapter) {
    return originalAdapter(config);
  }
  
  // Default fallback if adapter is undefined
  return axios.defaults.adapter(config);
};

// Request Interceptor: Attach token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally (e.g. 401 Unauthorized logouts)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to authentication page if on a protected route
      const publicPaths = ['/', '/auth', '/about', '/contact'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/auth?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
