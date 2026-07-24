const { Job, HiringPartner, CareerCategory } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Job — list/get/create/update/remove, all delegated to the generic service.
const jobService = createCrudService(Job, {
  searchableFields: ["title", "location", "type"],
  include: [
    { model: HiringPartner, as: "company", attributes: ["id", "name", "logo"] },
    { model: CareerCategory, as: "category", attributes: ["id", "name"] },
  ],
});

module.exports = jobService;
