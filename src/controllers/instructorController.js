const instructorService = require("../services/instructorService");
const createCrudController = require("./createCrudController");

const instructorController = createCrudController(instructorService, "Instructor");

module.exports = instructorController;
