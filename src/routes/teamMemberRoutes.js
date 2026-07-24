const teamMemberController = require("../controllers/teamMemberController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Team Member: admin-only writes, public reads
module.exports = createCrudRouter(teamMemberController, [authenticate, authorize("admin")]);
