const { CareerOpportunity } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Career Opportunity — list/get/create/update/remove, all delegated to the generic service.
const careerOpportunityService = createCrudService(CareerOpportunity, {
  searchableFields: ["title"],
});

module.exports = careerOpportunityService;
