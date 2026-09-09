const express = require('express');
const router = express.Router();
const {
  startInterviewSession,
  submitAnswerAndGetNext,
  getInterviewSessions,
  getInterviewDetails
} = require('../controllers/interviewController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getInterviewSessions)
  .post(startInterviewSession);

router.route('/:id')
  .get(getInterviewDetails);

router.route('/:id/submit')
  .post(submitAnswerAndGetNext);

module.exports = router;
