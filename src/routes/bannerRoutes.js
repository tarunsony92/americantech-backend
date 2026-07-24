const bannerController = require("../controllers/bannerController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Banner: admin-only writes, public reads
module.exports = createCrudRouter(bannerController, [authenticate, authorize("admin")]);
