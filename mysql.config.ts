import { defineConfig } from "drizzle-kit";

const dbConfig = {
  host: process.env.DB_HOST || 'srv1787.hstgr.io',
  user: process.env.DB_USER || 'u588148465_terasus',
  password: process.env.DB_PASSWORD || 'Emreninyalanlari33_*',
  database: process.env.DB_NAME || 'u588148465_panel',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
};

export default defineConfig({
  out: "./mysql-migrations",
  schema: "./shared/mysql-schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
  },
});
