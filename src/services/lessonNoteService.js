const { LessonNote } = require("../models");
const fs = require("fs");
const path = require("path");

const lessonNoteService = {
  async list({ lessonId } = {}) {
    const where = {};
    if (lessonId) where.lessonId = lessonId;
    return LessonNote.findAll({ where, order: [["createdAt", "DESC"]] });
  },

  async create(payload) {
    return LessonNote.create(payload);
  },

  async remove(id) {
    const record = await LessonNote.findByPk(id);
    if (!record) return false;

    const filePath = path.join(__dirname, "..", "uploads", "notes", record.fileName);
    fs.unlink(filePath, () => {}); // best-effort delete, ignore errors

    await record.destroy();
    return true;
  },
};

module.exports = lessonNoteService;