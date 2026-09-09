const aiService = require('../services/openaiService');

/**
 * @desc    Chat with floating AI assistant
 * @route   POST /api/ai/chat
 * @access  Private
 */
const chatbotChat = async (req, res, next) => {
  try {
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Please provide a message' });
    }

    const reply = await aiService.getChatbotResponse(message, chatHistory || []);

    res.json({
      success: true,
      reply
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get hints for active coding editor challenge
 * @route   POST /api/ai/coding-hint
 * @access  Private
 */
const getCodingHint = async (req, res, next) => {
  try {
    const { title, description, code } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Please provide challenge title and description' });
    }

    const hint = await aiService.getCodingHint(title, description, code || '');

    res.json({
      success: true,
      hint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Standalone evaluation of user answer
 * @route   POST /api/ai/evaluate
 * @access  Private
 */
const evaluateAnswerDirectly = async (req, res, next) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Please provide both question and answer' });
    }

    const evaluation = await aiService.evaluateAnswer(question, answer);

    res.json({
      success: true,
      evaluation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chatbotChat,
  getCodingHint,
  evaluateAnswerDirectly
};
