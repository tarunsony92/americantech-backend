const jobService = require("../services/jobService");
const createCrudController = require("./createCrudController");

const jobController = createCrudController(jobService, "Job");

module.exports = jobController;
