const galleryService = require("../services/galleryService");
const createCrudController = require("./createCrudController");

const galleryController = createCrudController(galleryService, "Gallery Image");

module.exports = galleryController;
