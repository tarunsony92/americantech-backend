const pageService = require("../services/pageService");
const createCrudController = require("./createCrudController");

const pageController = createCrudController(pageService, "Page");

module.exports = pageController;
