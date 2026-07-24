require("dotenv").config();

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  logging: false,
  // Supabase (and most managed Postgres providers) require SSL even outside production.
  // Set DB_SSL=false in .env for a local/self-hosted Postgres that has no SSL configured.
  ...(process.env.DB_SSL !== "false" && {
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  }),
};

module.exports = {
  development: base,
  test: { ...base, database: `${process.env.DB_NAME}_test` },
  production: base,
};
