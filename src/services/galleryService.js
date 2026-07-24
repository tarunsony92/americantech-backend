const { Gallery } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Gallery Image — list/get/create/update/remove, all delegated to the generic service.
const galleryService = createCrudService(Gallery, {
  searchableFields: ["title","category"],
});

module.exports = galleryService;
