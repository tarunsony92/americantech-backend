const courseModuleController = require("../controllers/courseModuleController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Course Module: admin-only writes, public reads
module.exports = createCrudRouter(courseModuleController, [authenticate, authorize("admin")]);
