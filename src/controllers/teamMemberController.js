const teamMemberService = require("../services/teamMemberService");
const createCrudController = require("./createCrudController");

const teamMemberController = createCrudController(teamMemberService, "Team Member");

module.exports = teamMemberController;
