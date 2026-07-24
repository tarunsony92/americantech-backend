const { ContactQuery } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Contact Query — list/get/create/update/remove, all delegated to the generic service.
const contactQueryService = createCrudService(ContactQuery, {
  searchableFields: ["name","email","subject"],
});

module.exports = contactQueryService;
