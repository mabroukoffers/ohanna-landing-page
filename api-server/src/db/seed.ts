/**
 * Database seed script runner
 * Populates the database with initial data
 */

import { seedDatabase } from "./seeds";

async function run() {
  try {
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

run();
