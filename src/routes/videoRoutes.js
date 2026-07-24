const videoController = require("../controllers/videoController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Video: admin-only writes, public reads
module.exports = createCrudRouter(videoController, [authenticate, authorize("admin")]);
