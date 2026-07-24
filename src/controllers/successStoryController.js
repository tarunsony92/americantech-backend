const successStoryService = require("../services/successStoryService");
const createCrudController = require("./createCrudController");

const successStoryController = createCrudController(successStoryService, "Success Story");

module.exports = successStoryController;
