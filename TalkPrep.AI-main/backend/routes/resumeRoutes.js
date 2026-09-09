const express = require('express');
const router = express.Router();
const {
  uploadResumeAndAnalyze,
  getResumes
} = require('../controllers/resumeController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getResumes);

router.route('/analyze')
  .post(uploadResumeAndAnalyze);

module.exports = router;
