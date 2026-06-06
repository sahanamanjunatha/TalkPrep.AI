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
    const url = config.url || '';
    let data = { success: true };
    
    if (url.includes('/auth/profile')) {
      const user = localStorage.getItem('user');
      data = { success: true, user: user ? JSON.parse(user) : {} };
    } else if (url.includes('/dashboard')) {
      data = {
        success: true,
        data: {
          stats: {
            interviewsCompleted: 3,
            challengesSolved: 2,
            averageInterviewScore: 82,
            streakCount: 4
          },
          badges: [
            { title: 'Welcome onboard!', description: 'Created your AI Mock Interview account.', icon: 'Award' },
            { title: 'Smart Coder', description: 'Solved a daily coding challenge.', icon: 'Award' }
          ],
          recentInterviews: [
            {
              _id: 'mock-session-1',
              role: 'Software Engineer',
              type: 'Technical',
              difficulty: 'Intermediate',
              overallScore: 82,
              createdAt: new Date().toISOString()
            }
          ],
          recentResume: {
            fileName: 'John_Candidate_Resume.pdf',
            score: 85
          },
          dailyChallenge: {
            _id: 'mock-challenge-1',
            title: 'Two Sum',
            description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
            difficulty: 'Easy'
          },
          weeklyActivity: [
            { day: 'Mon', count: 1 },
            { day: 'Tue', count: 2 },
            { day: 'Wed', count: 0 },
            { day: 'Thu', count: 1 },
            { day: 'Fri', count: 3 },
            { day: 'Sat', count: 1 },
            { day: 'Sun', count: 0 }
          ]
        }
      };
    } else if (url.includes('/challenges')) {
      data = {
        success: true,
        challenges: [
          {
            _id: 'mock-challenge-1',
            title: 'Two Sum',
            description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
            difficulty: 'Easy',
            category: 'Arrays',
            constraints: ['O(N) time'],
            boilerplate: {
              javascript: 'function twoSum(nums, target) {\n  // Write your code here\n}'
            }
          }
        ]
      };
    } else if (url.includes('/analytics')) {
      data = {
        success: true,
        analytics: {
          overallPerformance: 82,
          speechSpeed: 125,
          fillerWordIndex: 2
        }
      };
    } else if (url.includes('/interviews/start')) {
      data = {
        success: true,
        session: {
          _id: 'mock-session-1',
          role: config.data ? JSON.parse(config.data).role : 'Software Engineer',
          type: config.data ? JSON.parse(config.data).type : 'Technical',
          difficulty: config.data ? JSON.parse(config.data).difficulty : 'Intermediate',
          questions: [
            { text: 'Explain the event loop in JavaScript.' },
            { text: 'How do you optimize React render performance?' }
          ]
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
