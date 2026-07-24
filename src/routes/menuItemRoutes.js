const menuItemController = require("../controllers/menuItemController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Menu Item: admin-only writes, public reads
module.exports = createCrudRouter(menuItemController, [authenticate, authorize("admin")]);
