const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classroom: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom'
  }],
  numOfQuestions: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean
  },
  startTime: {
    type: Date
  },
  questions: [{
    type: mongoose.Schema.Types.Mixed,
    ref: 'Question'
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Quiz', quizSchema)
