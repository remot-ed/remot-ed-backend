const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  grade: {
    type: Number,
    required: true
  },
  quizOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Result', resultSchema)
