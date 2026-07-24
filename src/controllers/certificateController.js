const certificateService = require("../services/certificateService");
const createCrudController = require("./createCrudController");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

const certificateController = createCrudController(certificateService, "Certificate");

// The logged-in student's own certificates — used by the dashboard's My Certificates page.
certificateController.listMine = asyncHandler(async (req, res) => {
  const certificates = await certificateService.listMine(req.user.id);
  return success(res, { message: "Your certificates", data: { items: certificates, total: certificates.length } });
});

module.exports = certificateController;
