const lessonController = require("../controllers/lessonController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Lesson: admin-only writes, public reads
module.exports = createCrudRouter(lessonController, [authenticate, authorize("admin")]);
