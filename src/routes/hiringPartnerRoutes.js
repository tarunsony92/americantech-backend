const hiringPartnerController = require("../controllers/hiringPartnerController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Hiring Partner: admin-only writes, public reads
module.exports = createCrudRouter(hiringPartnerController, [authenticate, authorize("admin")]);
