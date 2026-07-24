const { FAQ } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for FAQ — list/get/create/update/remove, all delegated to the generic service.
const fAQService = createCrudService(FAQ, {
  searchableFields: ["question"],
});

module.exports = fAQService;
