const eventController = require("../controllers/eventController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Event: admin-only writes, public reads
module.exports = createCrudRouter(eventController, [authenticate, authorize("admin")]);
