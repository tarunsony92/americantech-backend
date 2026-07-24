const stateController = require("../controllers/stateController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// State: admin-only writes, public reads
module.exports = createCrudRouter(stateController, [authenticate, authorize("admin")]);
