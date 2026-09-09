const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true, // e.g. Frontend Engineer, Fullstack, Product Manager, HR
    trim: true
  },
  type: {
    type: String,
    enum: ['Technical', 'HR', 'System Design'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please add a question text']
  },
  suggestedPoints: [String], // Points the user should mention
  idealAnswer: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
