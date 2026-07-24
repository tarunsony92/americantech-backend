const { BlogCategory } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Blog Category — list/get/create/update/remove, all delegated to the generic service.
const blogCategoryService = createCrudService(BlogCategory, {
  searchableFields: ["name"],
});

module.exports = blogCategoryService;
