const countryService = require("../services/countryService");
const createCrudController = require("./createCrudController");

const countryController = createCrudController(countryService, "Country");

module.exports = countryController;
