const { CourseCategory } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Course Category — list/get/create/update/remove, all delegated to the generic service.
const courseCategoryService = createCrudService(CourseCategory, {
  searchableFields: ["name"],
});

module.exports = courseCategoryService;
