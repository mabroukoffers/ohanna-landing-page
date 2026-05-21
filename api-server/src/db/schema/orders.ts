/**
 * Orders table schema
 */

import {
  pgTable,
  text,
  integer,
  varchar,
  timestamp,
  json,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ordersTable = pgTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey(),
  stripeSessionId: varchar("stripe_session_id", { length: 255 }),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  shippingAddress: json("shipping_address").notNull(),
  items: json("items").notNull(), // Array of CartItem
  total: integer("total").notNull(), // Total in EGP (stored as cents)
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, paid, shipped, delivered
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
