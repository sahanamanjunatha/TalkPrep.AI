const Analytics = require('../models/Analytics');
const InterviewSession = require('../models/InterviewSession');

/**
 * @desc    Get detailed user metrics and progress charts
 * @route   GET /api/analytics
 * @access  Private
 */
const getAnalyticsDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user Analytics
    let analytics = await Analytics.findOne({ user: userId });
    if (!analytics) {
      analytics = await Analytics.create({ user: userId });
    }

    // Fetch completed interview sessions to draw line charts
    const completedSessions = await InterviewSession.find({
      user: userId,
      status: 'Completed'
    }).sort({ createdAt: 1 });

    // Format historical score timeline
    const scoreTimeline = completedSessions.map(session => ({
      date: new Date(session.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      score: session.overallScore,
      role: session.role,
      type: session.type
    }));

    // Generate topic breakdowns (Communication, Logic, Knowledge, Confidence)
    // We mock values based on past session count
    const baseCount = completedSessions.length;
    const topicScores = [
      { topic: 'Communication', score: baseCount > 0 ? Math.min(100, 72 + baseCount * 2) : 70 },
      { topic: 'Technical Skills', score: baseCount > 0 ? Math.min(100, 68 + baseCount * 3) : 65 },
      { topic: 'System Design', score: baseCount > 0 ? Math.min(100, 60 + baseCount * 4) : 60 },
      { topic: 'Behavioral responses', score: baseCount > 0 ? Math.min(100, 75 + baseCount * 1) : 75 },
      { topic: 'Problem Solving', score: baseCount > 0 ? Math.min(100, 65 + baseCount * 4) : 70 }
    ];

    res.json({
      success: true,
      data: {
        overall: {
          interviewsCompleted: analytics.interviewsCompleted,
          challengesSolved: analytics.challengesSolved,
          averageInterviewScore: analytics.averageInterviewScore,
          streakCount: analytics.streakCount
        },
        badges: analytics.badges,
        skillScores: analytics.skillScores,
        weeklyActivity: analytics.weeklyActivity,
        scoreTimeline,
        topicScores
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsDetails
};
