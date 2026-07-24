const { Download } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Download — list/get/create/update/remove, all delegated to the generic service.
const downloadService = createCrudService(Download, {
  searchableFields: ["title"],
});

module.exports = downloadService;
