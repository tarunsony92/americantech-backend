const { verifyAccessToken } = require("../helpers/tokenHelper");
const { failure } = require("../utils/apiResponse");
const { User, Role, Permission } = require("../models");

// Verifies the JWT on the Authorization header and attaches req.user (with its role name and
// the flat list of permission names granted to that role, via Role -> RolePermission -> Permission).
const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return failure(res, { statusCode: 401, message: "Authentication token missing" });
    }

    const token = header.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: "role", include: [{ model: Permission, as: "permissions" }] }],
    });
    if (!user || !user.isActive) {
      return failure(res, { statusCode: 401, message: "Invalid session, please log in again" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role?.name || null,
      permissions: user.role?.permissions?.map((p) => p.name) || [],
    };
    return next();
  } catch (err) {
    return next(err);
  }
};

// Usage: authorize("admin"), authorize("admin", "instructor")
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return failure(res, { statusCode: 403, message: "You do not have permission to perform this action" });
  }
  return next();
};

module.exports = { authenticate, authorize };
