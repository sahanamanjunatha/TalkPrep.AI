const User = require('../models/User');
const InterviewSession = require('../models/InterviewSession');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const Challenge = require('../models/Challenge');
const Question = require('../models/Question');

/**
 * @desc    Get all users list (Admin only)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get platform stats overview (Admin only)
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInterviews = await InterviewSession.countDocuments();
    const totalResumes = await ResumeAnalysis.countDocuments();
    const totalChallenges = await Challenge.countDocuments();

    // Calculate overall average scores
    const completedSessions = await InterviewSession.find({ status: 'Completed' });
    let totalScoreSum = 0;
    completedSessions.forEach(s => {
      totalScoreSum += s.overallScore;
    });
    const platformAverageScore = completedSessions.length > 0
      ? Math.round(totalScoreSum / completedSessions.length)
      : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalInterviews,
        totalResumes,
        totalChallenges,
        platformAverageScore
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new mock interview question (Admin only)
 * @route   POST /api/admin/questions
 * @access  Private/Admin
 */
const addQuestion = async (req, res, next) => {
  try {
    const { role, type, difficulty, text, suggestedPoints, idealAnswer } = req.body;

    if (!role || !type || !difficulty || !text) {
      return res.status(400).json({ success: false, message: 'Please provide role, type, difficulty, and text' });
    }

    const question = await Question.create({
      role,
      type,
      difficulty,
      text,
      suggestedPoints: suggestedPoints || [],
      idealAnswer: idealAnswer || ''
    });

    res.status(201).json({ success: true, question });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a mock interview question (Admin only)
 * @route   DELETE /api/admin/questions/:id
 * @access  Private/Admin
 */
const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    await question.deleteOne();

    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getPlatformStats,
  addQuestion,
  deleteQuestion
};

