const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  interviewsCompleted: {
    type: Number,
    default: 0
  },
  challengesSolved: {
    type: Number,
    default: 0
  },
  averageInterviewScore: {
    type: Number,
    default: 0
  },
  streakCount: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  badges: [
    {
      title: { type: String, required: true },
      description: String,
      icon: String, // lucide icon name representation
      unlockedAt: { type: Date, default: Date.now }
    }
  ],
  skillScores: [
    {
      skill: { type: String, required: true }, // e.g., 'React', 'Algorithms', 'Communication'
      score: { type: Number, default: 0 } // 0-100
    }
  ],
  weeklyActivity: [
    {
      day: String, // 'Mon', 'Tue', etc.
      count: { type: Number, default: 0 }
    }
  ]
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
