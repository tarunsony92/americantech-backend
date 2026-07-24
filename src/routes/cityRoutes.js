const cityController = require("../controllers/cityController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// City: admin-only writes, public reads
module.exports = createCrudRouter(cityController, [authenticate, authorize("admin")]);
