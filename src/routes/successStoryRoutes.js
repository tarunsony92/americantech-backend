const successStoryController = require("../controllers/successStoryController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Success Story: admin-only writes, public reads
module.exports = createCrudRouter(successStoryController, [authenticate, authorize("admin")]);
