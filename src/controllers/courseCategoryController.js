const courseCategoryService = require("../services/courseCategoryService");
const createCrudController = require("./createCrudController");

const courseCategoryController = createCrudController(courseCategoryService, "Course Category");

module.exports = courseCategoryController;
