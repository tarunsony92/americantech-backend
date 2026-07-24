const eventService = require("../services/eventService");
const createCrudController = require("./createCrudController");

const eventController = createCrudController(eventService, "Event");

module.exports = eventController;
