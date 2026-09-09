const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getPlatformStats,
  addQuestion,
  deleteQuestion
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.get('/stats', getPlatformStats);

router.post('/questions', addQuestion);
router.delete('/questions/:id', deleteQuestion);

module.exports = router;

