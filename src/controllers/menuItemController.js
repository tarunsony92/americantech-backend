const menuItemService = require("../services/menuItemService");
const createCrudController = require("./createCrudController");

const menuItemController = createCrudController(menuItemService, "Menu Item");

module.exports = menuItemController;
