const careerOpportunityController = require("../controllers/careerOpportunityController");
const createCrudRouter = require("./createCrudRouter");
const { authenticate, authorize } = require("../middlewares/auth");

// Career Opportunity: admin-only writes, public reads
module.exports = createCrudRouter(careerOpportunityController, [authenticate, authorize("admin")]);
