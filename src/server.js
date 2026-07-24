const app = require("./app");
const { connectDB } = require("./config/database");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] American Tech Global API running on http://localhost:${PORT}${process.env.API_PREFIX || "/api/v1"}`);
  });
};

start();

process.on("unhandledRejection", (err) => {
  console.error("[server] Unhandled rejection:", err);
  process.exit(1);
});
