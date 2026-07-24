const { Country } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Country — list/get/create/update/remove, all delegated to the generic service.
const countryService = createCrudService(Country, {
  searchableFields: ["name"],
});

module.exports = countryService;
