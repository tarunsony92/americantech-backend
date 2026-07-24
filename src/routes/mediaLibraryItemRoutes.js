const mediaLibraryItemController = require("../controllers/mediaLibraryItemController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Media Item: admin-only writes, public reads
module.exports = createCrudRouter(mediaLibraryItemController, [authenticate, authorize("admin")]);
