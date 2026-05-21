/**
 * Products table schema
 */

import { pgTable, text, integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const productsTable = pgTable("products", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in EGP (stored as cents)
  category: varchar("category", { length: 50 }).notNull(),
  badge: varchar("badge", { length: 50 }),
  imageUrl: text("image_url").notNull(),
  stock: integer("stock").notNull().default(0),
  slug: varchar("slug", { length: 255 }).unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Create insert schema and omit auto-generated fields
export const insertProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().int().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  badge: z.string().optional().nullable(),
  imageUrl: z.string().url("Invalid image URL"),
  stock: z.number().int().nonnegative("Stock cannot be negative").optional(),
  slug: z.string().optional().nullable(),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
