const applicationStatusController = require("../controllers/applicationStatusController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Application Status: admin-only writes, public reads
module.exports = createCrudRouter(applicationStatusController, [authenticate, authorize("admin")]);
