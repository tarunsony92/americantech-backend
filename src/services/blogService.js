const { Blog, BlogCategory, User } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Blog — list/get/create/update/remove, all delegated to the generic service.
const blogService = createCrudService(Blog, {
  searchableFields: ["title"],
  include: [
    { model: BlogCategory, as: "category", attributes: ["id", "name", "slug"] },
    { model: User, as: "author", attributes: ["id", "fullName"] },
  ],
});

module.exports = blogService;
