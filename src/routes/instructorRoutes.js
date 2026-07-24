const instructorController = require("../controllers/instructorController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Instructor: admin-only writes, public reads
module.exports = createCrudRouter(instructorController, [authenticate, authorize("admin")]);
