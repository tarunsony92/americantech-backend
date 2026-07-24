const { JobApplication } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Job Application — list/get/create/update/remove, all delegated to the generic service.
const jobApplicationService = createCrudService(JobApplication, {
  searchableFields: ["fullName","email"],
});

module.exports = jobApplicationService;
