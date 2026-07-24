const { MenuItem } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Menu Item — list/get/create/update/remove, all delegated to the generic service.
const menuItemService = createCrudService(MenuItem, {
  searchableFields: ["label"],
});

module.exports = menuItemService;
