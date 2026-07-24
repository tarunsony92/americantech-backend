const studentController = require("../controllers/studentController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate } = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");

// Student records contain PII — every operation requires the matching permission.
const canRead = [authenticate, requirePermission("students:read", "students:write")];
const canWrite = [authenticate, requirePermission("students:write")];
module.exports = createCrudRouter(studentController, {
  list: canRead,
  getById: canRead,
  create: canWrite,
  update: canWrite,
  remove: canWrite,
});
