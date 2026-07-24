const hiringPartnerService = require("../services/hiringPartnerService");
const createCrudController = require("./createCrudController");

const hiringPartnerController = createCrudController(hiringPartnerService, "Hiring Partner");

module.exports = hiringPartnerController;
