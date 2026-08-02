"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const allConfig = require("../config/config");

const rawEnv = process.env.NODE_ENV || "development";
const env = rawEnv.trim().toLowerCase();
const config = allConfig[env];

if (!config) {
  throw new Error(
    `[models/index.js] No config found for NODE_ENV="${rawEnv}" (normalized: "${env}"). ` +
    `Available keys: ${Object.keys(allConfig).join(", ")}.`
  );
}

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;