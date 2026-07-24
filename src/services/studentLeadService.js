const { StudentLead } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Student Lead — list/get/create/update/remove, all delegated to the generic service.
const studentLeadService = createCrudService(StudentLead, {
  searchableFields: ["fullName","email"],
});

module.exports = studentLeadService;
