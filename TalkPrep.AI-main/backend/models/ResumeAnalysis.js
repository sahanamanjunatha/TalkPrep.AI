const mongoose = require('mongoose');

const ResumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  matchedKeywords: [String],
  missingKeywords: [String],
  atsSuggestions: [String],
  formattingFeedback: [String],
  bulletPointsFeedback: [String],
  roleCompatibility: [
    {
      role: String,
      compatibilityPercentage: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);
