const blogCategoryController = require("../controllers/blogCategoryController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Blog Category: admin-only writes, public reads
module.exports = createCrudRouter(blogCategoryController, [authenticate, authorize("admin")]);
