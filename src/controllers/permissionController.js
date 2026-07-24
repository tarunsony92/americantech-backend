const permissionService = require("../services/permissionService");
const createCrudController = require("./createCrudController");

const permissionController = createCrudController(permissionService, "Permission");

module.exports = permissionController;
