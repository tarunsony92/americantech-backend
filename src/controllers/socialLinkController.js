const socialLinkService = require("../services/socialLinkService");
const createCrudController = require("./createCrudController");

const socialLinkController = createCrudController(socialLinkService, "Social Link");

module.exports = socialLinkController;
