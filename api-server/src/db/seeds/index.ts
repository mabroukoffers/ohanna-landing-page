/**
 * Database seeds
 * Initial data for the database
 */

import { db, productsTable } from "../index";
import { PRODUCT_SEEDS } from "./products";
import { logger } from "../../lib/logger";

async function seedDatabase() {
  try {
    logger.info("🌱 Starting database seed...");

    // Clear existing products
    await db.delete(productsTable);
    logger.info("✓ Cleared existing products");

    // Insert products
    await db.insert(productsTable).values(PRODUCT_SEEDS);
    logger.info(`✓ Inserted ${PRODUCT_SEEDS.length} products`);

    logger.info("✅ Database seed completed successfully!");
    return true;
  } catch (error) {
    logger.error({ err: error }, "❌ Seed failed");
    throw error;
  }
}

export { seedDatabase, PRODUCT_SEEDS };
