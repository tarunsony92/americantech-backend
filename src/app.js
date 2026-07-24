require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const routes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");
const { apiLimiter } = require("./middlewares/rateLimiter");

const app = express();

app.use(helmet());
// NOTE: origin:"*" with credentials:true is invalid per the CORS spec (browsers reject it
// outright) and would be unsafe if a browser somehow allowed it. Falling back to it silently
// when CLIENT_URL isn't set masked what should be a loud misconfiguration — fail closed to
// localhost during local dev instead, and require CLIENT_URL to be set for anything else.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(process.env.API_PREFIX || "/api/v1", apiLimiter, routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
