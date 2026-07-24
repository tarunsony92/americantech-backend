const mediaLibraryItemService = require("../services/mediaLibraryItemService");
const createCrudController = require("./createCrudController");

const mediaLibraryItemController = createCrudController(mediaLibraryItemService, "Media Item");

module.exports = mediaLibraryItemController;
