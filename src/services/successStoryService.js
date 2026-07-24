const { SuccessStory } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Success Story — list/get/create/update/remove, all delegated to the generic service.
const successStoryService = createCrudService(SuccessStory, {
  searchableFields: ["name","title"],
});

module.exports = successStoryService;
