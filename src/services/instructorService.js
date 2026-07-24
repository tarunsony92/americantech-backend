const { Instructor } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Instructor — list/get/create/update/remove, all delegated to the generic service.
const instructorService = createCrudService(Instructor, {
  searchableFields: ["fullName","expertise"],
});

module.exports = instructorService;
