const { Event } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Event — list/get/create/update/remove, all delegated to the generic service.
const eventService = createCrudService(Event, {
  searchableFields: ["title","location"],
});

module.exports = eventService;
