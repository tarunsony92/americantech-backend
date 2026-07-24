const { Testimonial } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Testimonial — list/get/create/update/remove, all delegated to the generic service.
const testimonialService = createCrudService(Testimonial, {
  searchableFields: ["name"],
});

module.exports = testimonialService;
