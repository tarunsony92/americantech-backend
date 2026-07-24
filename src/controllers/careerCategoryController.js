const careerCategoryService = require("../services/careerCategoryService");
const createCrudController = require("./createCrudController");

const careerCategoryController = createCrudController(careerCategoryService, "Career Category");

module.exports = careerCategoryController;
