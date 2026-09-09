const express = require('express');
const router = express.Router();
const {
  chatbotChat,
  getCodingHint,
  evaluateAnswerDirectly
} = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/chat', chatbotChat);
router.post('/coding-hint', getCodingHint);
router.post('/evaluate', evaluateAnswerDirectly);

module.exports = router;
