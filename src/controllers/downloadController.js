const downloadService = require("../services/downloadService");
const createCrudController = require("./createCrudController");

const downloadController = createCrudController(downloadService, "Download");

module.exports = downloadController;
