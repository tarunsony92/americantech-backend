const downloadController = require("../controllers/downloadController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Download: admin-only writes, public reads
module.exports = createCrudRouter(downloadController, [authenticate, authorize("admin")]);
