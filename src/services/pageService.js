const { Page } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Page — list/get/create/update/remove, all delegated to the generic service.
const pageService = createCrudService(Page, {
  searchableFields: ["title","slug"],
});

module.exports = pageService;
