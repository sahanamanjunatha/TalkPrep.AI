const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    default: 'Algorithms'
  },
  constraints: [String],
  boilerplate: {
    javascript: { type: String, required: true },
    python: { type: String, required: true },
    java: { type: String, required: true }
  },
  testCases: [
    {
      input: { type: String, required: true },
      expectedOutput: { type: String, required: true },
      isPublic: { type: Boolean, default: true }
    }
  ],
  optimalTimeComplexity: String,
  optimalSpaceComplexity: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
