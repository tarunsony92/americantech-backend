const fAQService = require("../services/fAQService");
const createCrudController = require("./createCrudController");

const fAQController = createCrudController(fAQService, "FAQ");

module.exports = fAQController;
