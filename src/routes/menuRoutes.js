const menuController = require("../controllers/menuController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Menu: admin-only writes, public reads
module.exports = createCrudRouter(menuController, [authenticate, authorize("admin")]);
