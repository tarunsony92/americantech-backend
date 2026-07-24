const courseCategoryController = require("../controllers/courseCategoryController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Course Category: admin-only writes, public reads
module.exports = createCrudRouter(courseCategoryController, [authenticate, authorize("admin")]);
