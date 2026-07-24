const applicationStatusService = require("../services/applicationStatusService");
const createCrudController = require("./createCrudController");

const applicationStatusController = createCrudController(applicationStatusService, "Application Status");

module.exports = applicationStatusController;
