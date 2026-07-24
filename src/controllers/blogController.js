const blogService = require("../services/blogService");
const createCrudController = require("./createCrudController");

const blogController = createCrudController(blogService, "Blog");

module.exports = blogController;
