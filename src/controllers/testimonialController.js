const testimonialService = require("../services/testimonialService");
const createCrudController = require("./createCrudController");

const testimonialController = createCrudController(testimonialService, "Testimonial");

module.exports = testimonialController;
