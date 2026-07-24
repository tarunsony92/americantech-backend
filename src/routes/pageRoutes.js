const pageController = require("../controllers/pageController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Page: admin-only writes, public reads
module.exports = createCrudRouter(pageController, [authenticate, authorize("admin")]);
