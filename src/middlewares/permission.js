const { failure } = require("../utils/apiResponse");

// requirePermission("students:read") or requirePermission("students:read", "students:write")
// (any one of the listed permissions is sufficient — OR semantics, matching how authorize() works
// for roles). Must run AFTER authenticate, since it reads req.user.permissions which authenticate
// populates from the user's Role -> RolePermissions -> Permissions chain.
const requirePermission = (...requiredPermissions) => (req, res, next) => {
  if (!req.user) {
    return failure(res, { statusCode: 401, message: "Authentication required" });
  }

  const granted = req.user.permissions || [];
  const hasAny = requiredPermissions.some((p) => granted.includes(p));

  if (!hasAny) {
    return failure(res, { statusCode: 403, message: "You do not have permission to perform this action" });
  }

  return next();
};

module.exports = { requirePermission };
