const sEOController = require("../controllers/sEOController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// SEO Entry: admin-only writes, public reads
module.exports = createCrudRouter(sEOController, [authenticate, authorize("admin")]);
