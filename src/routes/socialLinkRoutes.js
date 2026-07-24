const socialLinkController = require("../controllers/socialLinkController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Social Link: admin-only writes, public reads
module.exports = createCrudRouter(socialLinkController, [authenticate, authorize("admin")]);
