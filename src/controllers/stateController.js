const stateService = require("../services/stateService");
const createCrudController = require("./createCrudController");

const stateController = createCrudController(stateService, "State");

module.exports = stateController;
