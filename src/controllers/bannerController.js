const bannerService = require("../services/bannerService");
const createCrudController = require("./createCrudController");

const bannerController = createCrudController(bannerService, "Banner");

module.exports = bannerController;
