const careerCategoryController = require("../controllers/careerCategoryController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Career Category: admin-only writes, public reads
module.exports = createCrudRouter(careerCategoryController, [authenticate, authorize("admin")]);
