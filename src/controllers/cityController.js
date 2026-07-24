const cityService = require("../services/cityService");
const createCrudController = require("./createCrudController");

const cityController = createCrudController(cityService, "City");

module.exports = cityController;
