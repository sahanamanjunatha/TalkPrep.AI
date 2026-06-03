const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  jobDescription: {
    type: String,
    default: ''
  },
  resumeContent: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'English'
  },
  totalQuestions: {
    type: Number,
    default: 5
  },
  focusAreas: {
    type: String,
    default: ''
  },
  customInstructions: {
    type: String,
    default: ''
  },
  companyName: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['In-Progress', 'Completed'],
    default: 'In-Progress'
  },
  questions: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      questionText: { type: String, required: true },
      userAnswer: { type: String, default: '' },
      audioDurationSec: { type: Number, default: 0 },
      evaluation: {
        score: { type: Number, default: 0 },
        correctness: { type: String, default: 'Partially Correct' },
        confidenceFeedback: { type: String, default: '' },
        feedback: String,
        strengths: [String],
        weaknesses: [String],
        improvementSuggestions: [String],
        hint: { type: String, default: '' },
        modelAnswer: String
      }
    }
  ],
  overallScore: {
    type: Number,
    default: 0
  },
  overallFeedback: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
