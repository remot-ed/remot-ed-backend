const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  answerTwo: {
    type: String,
    required: true
  },
  answerThree: {
    type: String,
    required: true
  },
  answerFour: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Question', questionSchema)
