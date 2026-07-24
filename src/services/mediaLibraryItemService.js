const { MediaLibraryItem } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Media Item — list/get/create/update/remove, all delegated to the generic service.
const mediaLibraryItemService = createCrudService(MediaLibraryItem, {
  searchableFields: ["name"],
});

module.exports = mediaLibraryItemService;
