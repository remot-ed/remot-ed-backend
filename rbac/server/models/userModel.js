// server/models/userModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
 email: {
  type: String,
  required: true,
  trim: true
 },
 password: {
  type: String,
  required: true
 },
 role: {
  type: String,
  default: 'teacher',
  enum: ["student", "teacher", "admin"]
 },
 // accessToken will id users across ap
 accessToken: {
  type: String
 }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
