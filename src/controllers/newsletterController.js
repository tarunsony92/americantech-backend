const newsletterService = require("../services/newsletterService");
const createCrudController = require("./createCrudController");

const newsletterController = createCrudController(newsletterService, "Newsletter Subscriber");

module.exports = newsletterController;
