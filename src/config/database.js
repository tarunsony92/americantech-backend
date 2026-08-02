const { Sequelize } = require("sequelize");

const allConfig = require("./config");

const rawEnv = process.env.NODE_ENV || "development";
const env = rawEnv.trim().toLowerCase();
const config = allConfig[env];

if (!config) {
  throw new Error(
    `[config/database.js] No config found for NODE_ENV="${rawEnv}" (normalized: "${env}"). ` +
    `Available keys: ${Object.keys(allConfig).join(", ")}.`
  );
}

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`[db] PostgreSQL connected -> ${config.database}`);
  } catch (err) {
    console.error("[db] Unable to connect to the database:", err.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };