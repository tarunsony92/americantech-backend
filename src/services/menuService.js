const { Menu } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Menu — list/get/create/update/remove, all delegated to the generic service.
const menuService = createCrudService(Menu, {
  searchableFields: ["name"],
});

module.exports = menuService;
