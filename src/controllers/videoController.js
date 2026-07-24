const videoService = require("../services/videoService");
const createCrudController = require("./createCrudController");

const videoController = createCrudController(videoService, "Video");

module.exports = videoController;
