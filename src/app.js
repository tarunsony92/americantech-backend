require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const crypto = require("crypto");

const routes = require("./routes");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/errorHandler");
const { apiLimiter } = require("./middlewares/rateLimiter");

const app = express();

/* =========================================================
   TRUST PROXY
   Required behind Nginx / Cloudflare / load balancers so that
   req.ip and req.secure resolve correctly from X-Forwarded-* headers
   instead of returning the proxy's own address.
   Set to the exact number of proxy hops in front of this app
   (1 is correct for a single Nginx/Cloudflare hop).
========================================================= */

app.set("trust proxy", process.env.TRUST_PROXY_HOPS || 1);

/* =========================================================
   SECURITY
========================================================= */

app.use(helmet());

// Adds a per-request id to res.locals and response header.
// Makes it possible to trace a single request across logs.
app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"] || crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
});

/* =========================================================
   CORS CONFIGURATION
========================================================= */

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  "https://www.americanfuturetechllc.com,https://americanfuturetechllc.com,http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // e.g. server-to-server requests, Postman, health checks, etc.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`[cors] Blocked origin: ${origin}`);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "X-Request-Id",
    ],

    exposedHeaders: ["X-Request-Id"],

    optionsSuccessStatus: 204,
  })
);

/* =========================================================
   BODY PARSERS
========================================================= */

const JSON_BODY_LIMIT = process.env.JSON_BODY_LIMIT || "2mb";

app.use(express.json({ limit: JSON_BODY_LIMIT }));

app.use(
  express.urlencoded({
    extended: true,
    limit: JSON_BODY_LIMIT,
  })
);

/* =========================================================
   LOGGER
========================================================= */

if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
  );
}

/* =========================================================
   STATIC FILES
========================================================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/public", express.static(path.join(__dirname, "public")));

/* =========================================================
   HEALTH CHECK
   Kept outside the API prefix and rate limiter so uptime monitors /
   load balancers can hit it freely without consuming rate-limit quota.
========================================================= */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   API ROUTES
========================================================= */

app.use(process.env.API_PREFIX || "/api/v1", apiLimiter, routes);

/* =========================================================
   ERROR HANDLING
   Must stay last — notFoundHandler catches unmatched routes,
   errorHandler catches everything thrown/passed to next(err).
========================================================= */

app.use(notFoundHandler);

app.use(errorHandler);

/* =========================================================
   EXPORT APP
========================================================= */

module.exports = app;