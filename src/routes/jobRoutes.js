const jobController = require("../controllers/jobController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate } = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");

// Job posting: public reads, writes require the jobs:write permission.
const canWrite = [authenticate, requirePermission("jobs:write")];
module.exports = createCrudRouter(jobController, canWrite);
