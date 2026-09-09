const Challenge = require('../models/Challenge');
const Analytics = require('../models/Analytics');

/**
 * @desc    Get all coding challenges
 * @route   GET /api/challenges
 * @access  Private
 */
const getChallenges = async (req, res, next) => {
  try {
    const { difficulty } = req.query;
    const filter = {};
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const challenges = await Challenge.find(filter);
    res.json({ success: true, count: challenges.length, challenges });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single coding challenge by ID
 * @route   GET /api/challenges/:id
 * @access  Private
 */
const getChallengeDetails = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    res.json({ success: true, challenge });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Run solution against mock test cases
 * @route   POST /api/challenges/:id/submit
 * @access  Private
 */
const submitChallengeSolution = async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const { code, language } = req.body;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    // Run test cases (simulated compiler runner)
    // We parse the code to mock realistic runs
    const testResults = [];
    let allPassed = true;

    challenge.testCases.forEach((tc, idx) => {
      // Mock code logic checks: if code contains a syntax error or doesn't look correct, fail test cases
      let passed = true;
      let actualOutput = tc.expectedOutput;

      // Basic simulation check: empty or trivial code fails tests
      if (!code || code.trim().length < 25) {
        passed = false;
        actualOutput = "Error: Output did not match expected value. Standard Output: undefined";
      } else if (code.toLowerCase().includes('throw error') || code.toLowerCase().includes('syntaxerror')) {
        passed = false;
        actualOutput = "ReferenceError: variable is not defined";
      }

      if (!passed) {
        allPassed = false;
      }

      testResults.push({
        testCaseIndex: idx,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: actualOutput,
        passed: passed
      });
    });

    if (allPassed) {
      // Update User Analytics
      let analytics = await Analytics.findOne({ user: req.user.id });
      if (analytics) {
        analytics.challengesSolved += 1;
        
        // Add skill metrics for Algorithms
        const algoSkill = analytics.skillScores.find(s => s.skill === 'Algorithms');
        if (algoSkill) {
          algoSkill.score = Math.min(100, algoSkill.score + 5);
        } else {
          analytics.skillScores.push({ skill: 'Algorithms', score: 75 });
        }

        // Add badge for first code solved
        if (analytics.challengesSolved === 1) {
          analytics.badges.push({
            title: 'Hello World!',
            description: 'Successfully compiled and solved your first coding challenge.',
            icon: 'Terminal'
          });
        }
        
        // Add badge for solving 5 challenges
        if (analytics.challengesSolved === 5) {
          analytics.badges.push({
            title: 'Logic Master',
            description: 'Solved 5 programming challenges in the online IDE room.',
            icon: 'Cpu'
          });
        }

        await analytics.save();
      }
    }

    res.json({
      success: true,
      allPassed,
      testResults,
      feedback: allPassed
        ? "Congratulations! All test cases passed successfully."
        : "Failed some test cases. Review your logic and boundary conditions."
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChallenges,
  getChallengeDetails,
  submitChallengeSolution
};
