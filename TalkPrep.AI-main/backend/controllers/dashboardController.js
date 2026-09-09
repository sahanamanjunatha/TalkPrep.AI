const Analytics = require('../models/Analytics');
const InterviewSession = require('../models/InterviewSession');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const Challenge = require('../models/Challenge');

/**
 * @desc    Get aggregated dashboard details
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user Analytics (streaks, badges, counts)
    let analytics = await Analytics.findOne({ user: userId });
    if (!analytics) {
      // Create default if not found
      analytics = await Analytics.create({
        user: userId,
        streakCount: 1,
        badges: [
          {
            title: 'Welcome onboard!',
            description: 'Created your AI Mock Interview account successfully.',
            icon: 'Award'
          }
        ]
      });
    }

    // Fetch recent 4 interview sessions
    const recentInterviews = await InterviewSession.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(4);

    // Fetch recent resume scan
    const recentResume = await ResumeAnalysis.findOne({ user: userId })
      .sort({ createdAt: -1 });

    // Fetch 3 general coding challenges to show as suggestions
    const challenges = await Challenge.find().limit(3);

    // Provide a "daily challenge" question card
    const dailyChallenge = challenges[0] || {
      title: "FizzBuzz",
      description: "Write a program that prints numbers from 1 to N, replacing multiples of 3 with 'Fizz' and 5 with 'Buzz'.",
      difficulty: "Easy"
    };

    res.json({
      success: true,
      data: {
        stats: {
          interviewsCompleted: analytics.interviewsCompleted,
          challengesSolved: analytics.challengesSolved,
          averageInterviewScore: analytics.averageInterviewScore,
          streakCount: analytics.streakCount,
          lastActivityDate: analytics.lastActivityDate
        },
        badges: analytics.badges,
        skillScores: analytics.skillScores,
        weeklyActivity: analytics.weeklyActivity,
        recentInterviews,
        recentResume: recentResume ? {
          fileName: recentResume.fileName,
          score: recentResume.score,
          createdAt: recentResume.createdAt
        } : null,
        dailyChallenge
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData
};
