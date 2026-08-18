// src/routes/coursejobRoutes.js
const express = require("express");
const router = express.Router();

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/coursejobController");

const { authenticate, authorize } = require("../middlewares/auth");

router.get("/", getJobs);
router.get("/:id", getJobById);

router.post("/", authenticate, authorize("admin"), createJob);
router.put("/:id", authenticate, authorize("admin"), updateJob);
router.delete("/:id", authenticate, authorize("admin"), deleteJob);

module.exports = router;