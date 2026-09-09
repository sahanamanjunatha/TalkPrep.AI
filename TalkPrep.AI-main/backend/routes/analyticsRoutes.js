const express = require('express');
const router = express.Router();
const { getAnalyticsDetails } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAnalyticsDetails);

module.exports = router;
