const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Analytics = require('../models/Analytics');

// Load env vars
dotenv.config();

// Standard Mock Questions to Seed
const sampleQuestions = [
  // Technical - Beginner
  {
    role: 'Frontend Engineer',
    type: 'Technical',
    difficulty: 'Beginner',
    text: "What is the difference between 'let', 'const', and 'var' in JavaScript, and when should you use each?",
    suggestedPoints: ["Block scope vs function scope", "Hoisting behavior", "Re-assignment capability"],
    idealAnswer: "'let' and 'const' are block-scoped variables introduced in ES6. 'const' prevents variable re-assignment, while 'var' is function-scoped and hoisted, which causes scoping bugs."
  },
  {
    role: 'Frontend Engineer',
    type: 'Technical',
    difficulty: 'Beginner',
    text: "Explain the virtual DOM in React and how it boosts performance.",
    suggestedPoints: ["Lightweight memory representation", "Reconciliation / diffing algorithm", "Batching browser updates"],
    idealAnswer: "The virtual DOM is a lightweight copy of the real DOM in memory. React diffs it with the previous DOM tree and updates only the necessary differences (reconciliation) to boost UI speeds."
  },
  // Technical - Intermediate
  {
    role: 'Software Engineer',
    type: 'Technical',
    difficulty: 'Intermediate',
    text: "What is the event loop in JavaScript and how does it handle asynchronous operations?",
    suggestedPoints: ["Call Stack", "Callback Queue / Microtask Queue", "Event Loop monitoring process", "Non-blocking single-threaded behavior"],
    idealAnswer: "JavaScript is single-threaded, meaning it handles one operation at a time. The event loop coordinates tasks: it executes code on the Call Stack. When asynchronous code finishes, its callback is moved to the Callback/Microtask Queue, and the Event Loop pushes it to the empty Call Stack to run."
  },
  // Technical - Advanced
  {
    role: 'Software Engineer',
    type: 'Technical',
    difficulty: 'Advanced',
    text: "How do you optimize render performance in a massive React application with frequent state updates?",
    suggestedPoints: ["React.memo / PureComponent", "useCallback and useMemo hook dependencies", "Virtualizing long lists (windowing)", "State colocation or debouncing updates"],
    idealAnswer: "Optimization involves reducing unnecessary renders using React.memo for component caching, useCallback/useMemo to preserve function/object references, virtualization via libraries like react-window to only render visible elements, and state colocation to keep renders localized."
  },
  // HR - Beginner
  {
    role: 'Software Engineer',
    type: 'HR',
    difficulty: 'Beginner',
    text: "Why do you want to join our company, and what motivated you to apply?",
    suggestedPoints: ["Alignment with company culture", "Interest in platform product features", "Opportunity for personal tech growth"],
    idealAnswer: "I have been following your platform progress and love how you integrate technology to solve real user needs. I applied because my tech values align with your innovation, and I see this as the perfect place to grow as an engineer while adding value."
  },
  // HR - Intermediate
  {
    role: 'Software Engineer',
    type: 'HR',
    difficulty: 'Intermediate',
    text: "Tell me about a time you failed or faced a major setback in a project. How did you handle it?",
    suggestedPoints: ["Specific project issue", "Ownership of the mistake", "Actions taken to resolve the block", "Core lessons learned"],
    idealAnswer: "In a previous team project, I pushed an unvalidated database query that slowed down API loads. Once I noticed, I took immediate responsibility, debugged the index latency with my team, and resolved it within hours. From then on, I always run benchmark audits before deployment."
  },
  // HR - Advanced
  {
    role: 'Software Engineer',
    type: 'HR',
    difficulty: 'Advanced',
    text: "How do you handle scope creep and shifting client priorities under a tight project deadline?",
    suggestedPoints: ["Impact analysis on deliverables", "Transparent communication with stakeholders", "Agile backlog prioritization", "Negotiating trade-offs"],
    idealAnswer: "I address scope creep by evaluating the request's impact on deadlines, communicating tradeoffs directly to stakeholders, and using agile backlog grooming to swap lower-priority tasks for new requirements, ensuring core milestones are completed."
  }
];

// Coding Challenges to Seed
const sampleChallenges = [
  {
    title: "Two Sum",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.
    
You may assume that each input would have **exactly one solution**, and you may not use the same element twice.
    
You can return the answer in any order.`,
    difficulty: "Easy",
    category: "Arrays",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    boilerplate: {
      javascript: `function twoSum(nums, target) {
    // Write your code here
    
}`,
      python: `def two_sum(nums, target):
    # Write your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[0];
    }
}`
    },
    testCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        expectedOutput: "[0, 1]",
        isPublic: true
      },
      {
        input: "nums = [3,2,4], target = 6",
        expectedOutput: "[1, 2]",
        isPublic: true
      }
    ],
    optimalTimeComplexity: "O(N)",
    optimalSpaceComplexity: "O(N)"
  },
  {
    title: "Valid Parentheses",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: "Easy",
    category: "Strings",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    boilerplate: {
      javascript: `function isValid(s) {
    // Write your code here
    
}`,
      python: `def is_valid(s):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}`
    },
    testCases: [
      {
        input: "s = '()'",
        expectedOutput: "true",
        isPublic: true
      },
      {
        input: "s = '()[]{}'",
        expectedOutput: "true",
        isPublic: true
      },
      {
        input: "s = '(]'",
        expectedOutput: "false",
        isPublic: true
      }
    ],
    optimalTimeComplexity: "O(N)",
    optimalSpaceComplexity: "O(N)"
  },
  {
    title: "Reverse String",
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with **O(1)** extra memory.`,
    difficulty: "Easy",
    category: "Two Pointers",
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character."
    ],
    boilerplate: {
      javascript: `function reverseString(s) {
    // Write your code here
    
}`,
      python: `def reverse_string(s):
    # Write your code here
    pass`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Write your code here
    }
}`
    },
    testCases: [
      {
        input: "s = ['h','e','l','l','o']",
        expectedOutput: "['o','l','l','e','h']",
        isPublic: true
      }
    ],
    optimalTimeComplexity: "O(N)",
    optimalSpaceComplexity: "O(1)"
  }
];

const seedDB = async (exitOnComplete = true) => {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-mock-interview';
    console.log(`Connecting to database for seeding: ${dbUri}...`);
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(dbUri);
    }

    // Delete existing records
    await Question.deleteMany();
    await Challenge.deleteMany();
    await User.deleteMany();
    await Analytics.deleteMany();

    console.log('Database cleared of old Questions, Challenges, Users and Analytics.');

    // Seed questions & challenges
    await Question.insertMany(sampleQuestions);
    await Challenge.insertMany(sampleChallenges);

    // Seed default Candidate Account
    const candidate = await User.create({
      name: 'John Candidate',
      email: 'user@talkprep.ai',
      password: 'password123',
      role: 'user',
      targetRole: 'Software Engineer',
      experienceLevel: 'Intermediate'
    });

    await Analytics.create({
      user: candidate._id,
      streakCount: 3,
      interviewsCompleted: 1,
      challengesSolved: 1,
      averageInterviewScore: 78,
      badges: [
        { title: 'Welcome onboard!', description: 'Created your AI Mock Interview account.', icon: 'Award' }
      ],
      weeklyActivity: [
        { day: 'Mon', count: 0 },
        { day: 'Tue', count: 1 },
        { day: 'Wed', count: 0 },
        { day: 'Thu', count: 0 },
        { day: 'Fri', count: 0 },
        { day: 'Sat', count: 0 },
        { day: 'Sun', count: 0 }
      ]
    });

    // Seed default Admin Account
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@talkprep.ai',
      password: 'password123',
      role: 'admin',
      targetRole: 'Lead Architect',
      experienceLevel: 'Advanced'
    });

    await Analytics.create({
      user: admin._id,
      streakCount: 5,
      badges: [
        { title: 'Welcome onboard!', description: 'Created your AI Mock Interview account.', icon: 'Award' }
      ]
    });

    console.log(`Successfully seeded default user/admin credentials:`);
    console.log(`- Candidate User: user@talkprep.ai / password123`);
    console.log(`- Admin Account:  admin@talkprep.ai / password123`);
    console.log(`Successfully seeded ${sampleQuestions.length} Questions and ${sampleChallenges.length} Challenges!`);
    
    if (exitOnComplete) {
      process.exit(0);
    }
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    if (exitOnComplete) {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

if (require.main === module) {
  seedDB(true);
}

module.exports = { seedDB, sampleQuestions, sampleChallenges };
