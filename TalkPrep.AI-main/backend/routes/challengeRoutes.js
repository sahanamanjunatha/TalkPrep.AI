const express = require('express');
const router = express.Router();
const {
  getChallenges,
  getChallengeDetails,
  submitChallengeSolution
} = require('../controllers/challengeController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getChallenges);

router.route('/:id')
  .get(getChallengeDetails);

router.route('/:id/submit')
  .post(submitChallengeSolution);

module.exports = router;
