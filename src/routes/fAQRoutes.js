const fAQController = require("../controllers/fAQController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// FAQ: admin-only writes, public reads
module.exports = createCrudRouter(fAQController, [authenticate, authorize("admin")]);
