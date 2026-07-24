const { SiteSetting } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Site Setting — list/get/create/update/remove, all delegated to the generic service.
const siteSettingService = createCrudService(SiteSetting, {
  searchableFields: ["key"],
});

module.exports = siteSettingService;
