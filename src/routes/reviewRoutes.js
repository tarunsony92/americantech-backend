const reviewController = require("../controllers/reviewController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Review: admin-only writes, public reads
module.exports = createCrudRouter(reviewController, [authenticate, authorize("admin")]);
