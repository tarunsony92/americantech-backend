const siteSettingService = require("../services/siteSettingService");
const createCrudController = require("./createCrudController");

const siteSettingController = createCrudController(siteSettingService, "Site Setting");

module.exports = siteSettingController;
