const { Sequelize } = require("sequelize");
const config = require("./config")[process.env.NODE_ENV || "development"];

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
