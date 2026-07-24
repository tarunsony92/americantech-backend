const { Newsletter } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Newsletter Subscriber — list/get/create/update/remove, all delegated to the generic service.
const newsletterService = createCrudService(Newsletter, {
  searchableFields: ["email"],
});

module.exports = newsletterService;
