const blogCategoryService = require("../services/blogCategoryService");
const createCrudController = require("./createCrudController");

const blogCategoryController = createCrudController(blogCategoryService, "Blog Category");

module.exports = blogCategoryController;
