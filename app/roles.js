// server/roles.js
const AccessControl = require('accesscontrol')

const ac = new AccessControl()

exports.roles = (function () {
  // .grant gives roles
  ac.grant('student')
    .createOwn('response')
    .readOwn('response')
    .readOwn('results')
    .readAny('classroom')
    .readAny('quiz')
    .readAny('question')

  // .extend inherit grants from .extend('this users permisions')
  ac.grant('teacher')
    .extend('student')
    .updateOwn('classroom')
    .updateOwn('quiz')
    .updateOwn('question')
    .deleteOwn('quiz')
    .deleteOwn('question')
    .deleteOwn('classroom')
    .readAny('response')
    .readAny('results')
    .readAny('classroom')
    .readAny('quiz')
    .readAny('question')

  ac.grant('admin')
    .extend('student')
    .extend('teacher')
    .updateAny('quiz')
    .updateAny('classroom')
    .updateAny('question')
    .deleteAny('quiz')
    .deleteAny('question')
    .deleteAny('classroom')
    .deleteAny('result')
    .deleteAny('response')
    .deleteAny('user')

  return ac
})()
