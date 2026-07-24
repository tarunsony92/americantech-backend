const blogController = require("../controllers/blogController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate } = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");

// Blog: public reads, writes require the blogs:write permission.
const canWrite = [authenticate, requirePermission("blogs:write")];
module.exports = createCrudRouter(blogController, canWrite);
