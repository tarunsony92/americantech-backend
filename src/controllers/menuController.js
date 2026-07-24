const menuService = require("../services/menuService");
const createCrudController = require("./createCrudController");

const menuController = createCrudController(menuService, "Menu");

module.exports = menuController;
