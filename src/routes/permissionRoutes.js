const permissionController = require("../controllers/permissionController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");

// Permission: reads are admin-only (reveals the RBAC structure); writes additionally require
// the permissions:write permission.
const adminOnly = [authenticate, authorize("admin")];
const canWrite = [authenticate, requirePermission("permissions:write")];
module.exports = createCrudRouter(permissionController, {
  list: adminOnly,
  getById: adminOnly,
  create: canWrite,
  update: canWrite,
  remove: canWrite,
});
