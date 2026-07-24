const { CareerCategory } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Career Category — list/get/create/update/remove, all delegated to the generic service.
const careerCategoryService = createCrudService(CareerCategory, {
  searchableFields: ["name"],
});

module.exports = careerCategoryService;
