const { Banner } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Banner — list/get/create/update/remove, all delegated to the generic service.
const bannerService = createCrudService(Banner, {
  searchableFields: ["title"],
});

module.exports = bannerService;
