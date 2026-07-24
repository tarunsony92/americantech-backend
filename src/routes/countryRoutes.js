const countryController = require("../controllers/countryController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Country: admin-only writes, public reads
module.exports = createCrudRouter(countryController, [authenticate, authorize("admin")]);
