const studentService = require("../services/studentService");
const createCrudController = require("./createCrudController");

const studentController = createCrudController(studentService, "Student");

module.exports = studentController;
