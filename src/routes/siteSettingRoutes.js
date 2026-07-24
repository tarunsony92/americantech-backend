const siteSettingController = require("../controllers/siteSettingController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Site Setting: admin-only writes, public reads
module.exports = createCrudRouter(siteSettingController, [authenticate, authorize("admin")]);
