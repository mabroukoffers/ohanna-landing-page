/**
 * Drizzle ORM configuration
 */

import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
} satisfies Config;
