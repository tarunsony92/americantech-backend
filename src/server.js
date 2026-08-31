const app = require("./app");
const { connectDB } = require("./config/database");

const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || "/api/v1";

let server;

const start = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(
        `[server] American FutureTech API running on http://localhost:${PORT}${API_PREFIX}`
      );
    });
  } catch (err) {
    console.error("[server] Failed to start:", err);
    process.exit(1);
  }
};

/* =========================================================
   GRACEFUL SHUTDOWN
   Stops accepting new connections, lets in-flight requests finish,
   then exits. Prevents dropped requests during deploys/restarts.
========================================================= */

const shutdown = (signal) => {
  console.log(`[server] Received ${signal}, shutting down gracefully...`);

  if (!server) {
    process.exit(0);
  }

  server.close((err) => {
    if (err) {
      console.error("[server] Error during shutdown:", err);
      process.exit(1);
    }
    console.log("[server] Closed all connections. Exiting.");
    process.exit(0);
  });

  // Force-exit if shutdown hangs (e.g. a socket never closes)
  setTimeout(() => {
    console.error("[server] Forcing shutdown after timeout.");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (err) => {
  console.error("[server] Unhandled rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("[server] Uncaught exception:", err);
  process.exit(1);
});

start();