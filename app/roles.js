// server/roles.js
const AccessControl = require('accesscontrol')
const ac = new AccessControl()

exports.roles = (function () {
  // .grant gives roles
  ac.grant('unenrolled')

  // .extend inherit grants from .extend('this users permisions')
  ac.grant('student')
    .readAny('a')

  ac.grant('teacher')
    .extend('student')
    .extend('supervisor')
    .updateAny('profile')
    .deleteAny('profile')

return ac;
})();
