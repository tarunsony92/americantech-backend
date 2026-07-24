const { City } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for City — list/get/create/update/remove, all delegated to the generic service.
const cityService = createCrudService(City, {
  searchableFields: ["name"],
});

module.exports = cityService;
