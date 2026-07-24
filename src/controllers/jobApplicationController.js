const jobApplicationService = require("../services/jobApplicationService");
const createCrudController = require("./createCrudController");

const jobApplicationController = createCrudController(jobApplicationService, "Job Application");

module.exports = jobApplicationController;
