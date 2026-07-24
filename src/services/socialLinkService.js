const { SocialLink } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Social Link — list/get/create/update/remove, all delegated to the generic service.
const socialLinkService = createCrudService(SocialLink, {
  searchableFields: ["platform"],
});

module.exports = socialLinkService;
