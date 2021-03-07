const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  classroom: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom'
  }],
  response: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Response'
  }],
  role: {
    type: String,
    default: 'student',
    enum: ['student', 'teacher', 'admin']
  },
  accessToken: {
    type: String
  },
  token: String
},
{
  timestamps: true,
  toObject: {
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

module.exports = mongoose.model('User', userSchema)
