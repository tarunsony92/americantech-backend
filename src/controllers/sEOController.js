const sEOService = require("../services/sEOService");
const createCrudController = require("./createCrudController");

const sEOController = createCrudController(sEOService, "SEO Entry");

module.exports = sEOController;
