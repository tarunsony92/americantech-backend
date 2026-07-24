const roleController = require("../controllers/roleController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");

// Role: reveals the RBAC structure, so reads are admin-only (not public); writes additionally
// require the roles:write permission.
const adminOnly = [authenticate, authorize("admin")];
const canWrite = [authenticate, requirePermission("roles:write")];
module.exports = createCrudRouter(roleController, {
  list: adminOnly,
  getById: adminOnly,
  create: canWrite,
  update: canWrite,
  remove: canWrite,
});
