const { Lesson } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Lesson — list/get/create/update/remove, all delegated to the generic service.
const lessonService = createCrudService(Lesson, {
  searchableFields: ["title"],
});

module.exports = lessonService;
