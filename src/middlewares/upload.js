const multer = require("multer");
const path = require("path");
const fs = require("fs");

const makeStorage = (subfolder) => {
  const dest = path.join(__dirname, "..", "uploads", subfolder);
  fs.mkdirSync(dest, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });
};

const fileFilterFor = (allowedMimes) => (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) return cb(null, true);
  return cb(new Error(`Unsupported file type: ${file.mimetype}`));
};

const uploadResume = multer({
  storage: makeStorage("resumes"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilterFor(["application/pdf"]),
});

const uploadMedia = multer({
  storage: makeStorage("media"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilterFor(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]),
});

// Lesson notes — allow PDF + common doc/image types
const uploadNotes = multer({
  storage: makeStorage("notes"),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: fileFilterFor([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ]),
});

module.exports = { uploadResume, uploadMedia, uploadNotes };