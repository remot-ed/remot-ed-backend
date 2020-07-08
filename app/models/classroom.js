const mongoose = require('mongoose')

const classroomSchema = new mongoose.Schema({
  classname: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Classroom', classroomSchema)
