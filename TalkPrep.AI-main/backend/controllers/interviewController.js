const InterviewSession = require('../models/InterviewSession');
const Analytics = require('../models/Analytics');
const aiService = require('../services/openaiService');

/**
 * @desc    Start a new mock interview session
 * @route   POST /api/interviews/start
 * @access  Private
 */
const startInterviewSession = async (req, res, next) => {
  try {
    const { 
      role, 
      type, 
      difficulty,
      jobDescription,
      resumeContent,
      language,
      totalQuestions,
      focusAreas,
      customInstructions,
      companyName
    } = req.body;

    if (!role || !type || !difficulty) {
      return res.status(400).json({ success: false, message: 'Please provide role, type, and difficulty' });
    }

    const options = {
      jobDescription: jobDescription || '',
      resumeContent: resumeContent || '',
      language: language || 'English',
      focusAreas: focusAreas || '',
      customInstructions: customInstructions || '',
      companyName: companyName || ''
    };

    // Generate first dynamic question from AI Service
    const firstQuestion = await aiService.generateDynamicQuestion(role, type, difficulty, 1, options);

    // Save session
    const session = await InterviewSession.create({
      user: req.user.id,
      role,
      type,
      difficulty,
      jobDescription: options.jobDescription,
      resumeContent: options.resumeContent,
      language: options.language,
      totalQuestions: totalQuestions || 5,
      focusAreas: options.focusAreas,
      customInstructions: options.customInstructions,
      companyName: options.companyName,
      status: 'In-Progress',
      questions: [
        {
          questionText: firstQuestion.text,
          userAnswer: '',
          evaluation: {
            score: 0,
            feedback: '',
            strengths: [],
            weaknesses: [],
            improvementSuggestions: [],
            modelAnswer: firstQuestion.idealAnswer || ''
          }
        }
      ]
    });

    res.status(201).json({
      success: true,
      session: {
        id: session._id,
        role: session.role,
        type: session.type,
        difficulty: session.difficulty,
        status: session.status,
        currentQuestionIndex: 0,
        currentQuestionText: firstQuestion.text
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit user answer and get next question or finish interview
 * @route   POST /api/interviews/:id/submit
 * @access  Private
 */
const submitAnswerAndGetNext = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const { answer } = req.body;

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    if (session.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Interview session is already completed' });
    }

    const currentQuestionIndex = session.questions.length - 1;
    const currentQuestion = session.questions[currentQuestionIndex];

    // Evaluate answer via AI Service
    const evalData = await aiService.evaluateAnswer(currentQuestion.questionText, answer || '(No answer provided)');

    // Save user answer and evaluation details
    currentQuestion.userAnswer = answer || '';
    currentQuestion.evaluation = {
      score: evalData.score || 0,
      correctness: evalData.correctness || 'Partially Correct',
      confidenceFeedback: evalData.confidenceFeedback || '',
      feedback: evalData.feedback || '',
      strengths: evalData.strengths || [],
      weaknesses: evalData.weaknesses || [],
      improvementSuggestions: evalData.improvementSuggestions || [],
      hint: evalData.hint || '',
      modelAnswer: evalData.modelAnswer || ''
    };

    // Check if session has hit limit (dynamic questions count per interview session)
    const totalQuestionsLimit = session.totalQuestions || 5;
    if (session.questions.length >= totalQuestionsLimit) {
      session.status = 'Completed';

      // Compute overall score
      let totalScore = 0;
      session.questions.forEach((q) => {
        totalScore += q.evaluation.score;
      });
      session.overallScore = Math.round(totalScore / totalQuestionsLimit);

      // Generate overall feedback summary
      session.overallFeedback = `You completed a ${session.difficulty} ${session.type} mock interview for the ${session.role} position. Your average score was ${session.overallScore}%. You showed great capability in answering general conceptual details but have space for optimization on detail depth.`;

      await session.save();

      // Update User Analytics
      let analytics = await Analytics.findOne({ user: req.user.id });
      if (!analytics) {
        analytics = new Analytics({ user: req.user.id });
      }

      analytics.interviewsCompleted += 1;
      
      // Update overall average score
      const sessions = await InterviewSession.find({ user: req.user.id, status: 'Completed' });
      let cumulativeScore = 0;
      sessions.forEach(s => {
        cumulativeScore += s.overallScore;
      });
      analytics.averageInterviewScore = Math.round(cumulativeScore / sessions.length);

      // Update target skill ratings
      const skillName = session.type; // Technical or HR or System Design
      const targetSkill = analytics.skillScores.find(s => s.skill === skillName);
      if (targetSkill) {
        targetSkill.score = Math.round((targetSkill.score + session.overallScore) / 2);
      } else {
        analytics.skillScores.push({ skill: skillName, score: session.overallScore });
      }

      // Add a badge for completing their first mock session
      if (analytics.interviewsCompleted === 1) {
        analytics.badges.push({
          title: 'First Step taken!',
          description: 'Completed your very first AI Mock Interview session.',
          icon: 'Compass'
        });
      }
      
      // Add a badge if they score above 85%
      if (session.overallScore >= 85) {
        analytics.badges.push({
          title: 'Honor Graduate',
          description: 'Achieved an outstanding overall score above 85% in an interview.',
          icon: 'Star'
        });
      }

      // Increment weekly activity counts
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDay = days[new Date().getDay()];
      const dayActivity = analytics.weeklyActivity.find(w => w.day === currentDay);
      if (dayActivity) {
        dayActivity.count += 1;
      }

      await analytics.save();

      return res.json({
        success: true,
        isFinished: true,
        session
      });
    }

    // Otherwise, generate the next question
    const nextQuestionIndex = session.questions.length + 1;
    const options = {
      jobDescription: session.jobDescription || '',
      resumeContent: session.resumeContent || '',
      language: session.language || 'English',
      focusAreas: session.focusAreas || '',
      customInstructions: session.customInstructions || '',
      companyName: session.companyName || ''
    };
    const nextQuestion = await aiService.generateDynamicQuestion(session.role, session.type, session.difficulty, nextQuestionIndex, options);

    // Save next empty question shell
    session.questions.push({
      questionText: nextQuestion.text,
      userAnswer: '',
      evaluation: {
        score: 0,
        feedback: '',
        strengths: [],
        weaknesses: [],
        improvementSuggestions: [],
        modelAnswer: nextQuestion.idealAnswer || ''
      }
    });

    await session.save();

    res.json({
      success: true,
      isFinished: false,
      currentQuestionIndex: session.questions.length - 1,
      currentQuestionText: nextQuestion.text,
      evaluation: currentQuestion.evaluation // Return result of the graded question
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's past interview session records
 * @route   GET /api/interviews
 * @access  Private
 */
const getInterviewSessions = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: sessions.length, sessions });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get complete details of a single interview session
 * @route   GET /api/interviews/:id
 * @access  Private
 */
const getInterviewDetails = async (req, res, next) => {
  try {
    const session = await InterviewSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session record not found' });
    }

    // Verify session belongs to user
    if (session.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Unauthorized view' });
    }

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startInterviewSession,
  submitAnswerAndGetNext,
  getInterviewSessions,
  getInterviewDetails
};
