const contactQueryService = require("../services/contactQueryService");
const createCrudController = require("./createCrudController");

const contactQueryController = createCrudController(contactQueryService, "Contact Query");

module.exports = contactQueryController;
