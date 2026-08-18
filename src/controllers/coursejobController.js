const { CourseJob } = require("../models");
const { Op } = require("sequelize");

exports.getJobs = async (req, res) => {
  try {
    const { search, page = 1, limit = 6, type, experienceLevel, category } = req.query;

    const where = { isActive: true };
    if (type) where.type = type;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (category) where.category = category;

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } },
        { skills: { [Op.overlap]: [search] } },
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { rows: jobs, count: total } = await CourseJob.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      offset,
      limit: Number(limit),
    });

    res.json({
      data: jobs,
      meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await CourseJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ data: job });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job", error: err.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const job = await CourseJob.create({ ...req.body, postedBy: req.user?.id });
    res.status(201).json({ data: job });
  } catch (err) {
    res.status(400).json({ message: "Failed to create job", error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await CourseJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    await job.update(req.body);
    res.json({ data: job });
  } catch (err) {
    res.status(400).json({ message: "Failed to update job", error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await CourseJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    await job.destroy();
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete job", error: err.message });
  }
};