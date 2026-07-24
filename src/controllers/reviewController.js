const reviewService = require("../services/reviewService");
const createCrudController = require("./createCrudController");

const reviewController = createCrudController(reviewService, "Review");

module.exports = reviewController;
