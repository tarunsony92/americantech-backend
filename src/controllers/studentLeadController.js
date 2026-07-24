const studentLeadService = require("../services/studentLeadService");
const createCrudController = require("./createCrudController");

const studentLeadController = createCrudController(studentLeadService, "Student Lead");

module.exports = studentLeadController;
