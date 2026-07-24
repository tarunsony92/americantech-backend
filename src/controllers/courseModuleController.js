const courseModuleService = require("../services/courseModuleService");
const createCrudController = require("./createCrudController");

const courseModuleController = createCrudController(courseModuleService, "Course Module");

module.exports = courseModuleController;
