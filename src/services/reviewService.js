const { Review } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Review — list/get/create/update/remove, all delegated to the generic service.
const reviewService = createCrudService(Review, {
  searchableFields: ["comment"],
});

module.exports = reviewService;
