const careerOpportunityService = require("../services/careerOpportunityService");
const createCrudController = require("./createCrudController");

const careerOpportunityController = createCrudController(careerOpportunityService, "Career Opportunity");

module.exports = careerOpportunityController;
