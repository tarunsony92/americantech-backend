const { Student } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Student — list/get/create/update/remove, all delegated to the generic service.
const studentService = createCrudService(Student, {
  searchableFields: [],
});

module.exports = studentService;
