const { SEO } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for SEO Entry — list/get/create/update/remove, all delegated to the generic service.
const sEOService = createCrudService(SEO, {
  searchableFields: ["metaTitle"],
});

module.exports = sEOService;
