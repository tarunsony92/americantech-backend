const { HiringPartner } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Hiring Partner — list/get/create/update/remove, all delegated to the generic service.
const hiringPartnerService = createCrudService(HiringPartner, {
  searchableFields: ["name"],
});

module.exports = hiringPartnerService;
