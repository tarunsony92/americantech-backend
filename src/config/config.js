require("dotenv").config();

// Hostinger hPanel env vars ko uppercase/whitespace ke saath store karta hai,
// isliye har value ko yahan explicitly normalize kar rahe hain.
const clean = (val) => (val || "").toString().trim();

const dbUser = clean(process.env.DB_USER).toLowerCase();
const dbName = clean(process.env.DB_NAME).toLowerCase();
const dbHost = clean(process.env.DB_HOST).toLowerCase();
const dbPort = parseInt(clean(process.env.DB_PORT), 10) || 5432;
const dbPassword = clean(process.env.DB_PASSWORD); // password case-sensitive, sirf trim
const sslFlag = clean(process.env.DB_SSL).toLowerCase();

const base = {
  username: dbUser,
  password: dbPassword,
  database: dbName,
  host: dbHost,
  port: dbPort,
  dialect: "postgres",
  logging: false,
  ...(sslFlag !== "false" && {
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  }),
};

module.exports = {
  development: base,
  test: { ...base, database: `${base.database}_test` },
  production: base,
};