const roleService = require("../services/roleService");
const createCrudController = require("./createCrudController");

const roleController = createCrudController(roleService, "Role");

module.exports = roleController;
