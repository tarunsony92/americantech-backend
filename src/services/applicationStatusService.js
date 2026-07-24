const { ApplicationStatus } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Application Status — list/get/create/update/remove, all delegated to the generic service.
const applicationStatusService = createCrudService(ApplicationStatus, {
  searchableFields: ["name"],
});

module.exports = applicationStatusService;
