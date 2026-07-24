const { TeamMember } = require("../models");
const createCrudService = require("./createCrudService");

// CRUD for Team Member — list/get/create/update/remove, all delegated to the generic service.
const teamMemberService = createCrudService(TeamMember, {
  searchableFields: ["fullName","designation"],
});

module.exports = teamMemberService;
