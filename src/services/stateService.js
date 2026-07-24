const { State } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for State — list/get/create/update/remove, all delegated to the generic service.
const stateService = createCrudService(State, {
  searchableFields: ["name"],
});

module.exports = stateService;
