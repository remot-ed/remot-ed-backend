// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
  // .grant gives roles
ac.grant("basic")
 .readOwn("profile")
 .updateOwn("profile")

// .extend inherit grants from .extend('this users permisions')
ac.grant("supervisor")
 .extend("basic")
 .readAny("profile")

ac.grant("admin")
 .extend("basic")
 .extend("supervisor")
 .updateAny("profile")
 .deleteAny("profile")

return ac;
})();
