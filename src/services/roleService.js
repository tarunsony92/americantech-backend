const { Role } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Role — list/get/create/update/remove, all delegated to the generic service.
const roleService = createCrudService(Role, {
  searchableFields: ["name"],
});

module.exports = roleService;
