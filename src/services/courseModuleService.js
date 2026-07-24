const { CourseModule } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Course Module — list/get/create/update/remove, all delegated to the generic service.
const courseModuleService = createCrudService(CourseModule, {
  searchableFields: ["title"],
});

module.exports = courseModuleService;
