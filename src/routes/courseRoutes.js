const courseController = require("../controllers/courseController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate } = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");

// Course: public reads, writes require the courses:write permission (granted to admin and
// instructor roles — see database/seeders/20260101000104-seed-role-permissions.js).
const canWrite = [authenticate, requirePermission("courses:write")];
module.exports = createCrudRouter(courseController, canWrite);
