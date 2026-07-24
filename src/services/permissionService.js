const { Permission } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Permission — list/get/create/update/remove, all delegated to the generic service.
const permissionService = createCrudService(Permission, {
  searchableFields: ["name"],
});

module.exports = permissionService;
