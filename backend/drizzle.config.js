import { env } from "./src/config/env.js";

export default {
    schema: "./src/db/schema.js",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: { url: env.DB_URL }
}