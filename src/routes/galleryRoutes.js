const galleryController = require("../controllers/galleryController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Gallery Image: admin-only writes, public reads
module.exports = createCrudRouter(galleryController, [authenticate, authorize("admin")]);
