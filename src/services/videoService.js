const { Video } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Video — list/get/create/update/remove, all delegated to the generic service.
const videoService = createCrudService(Video, {
  searchableFields: ["title"],
});

module.exports = videoService;
