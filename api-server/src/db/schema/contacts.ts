/**
 * Contacts table schema
 */

import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contactsTable = pgTable("contacts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Create insert schema and omit auto-generated fields
export const insertContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().optional().nullable(),
  message: z.string().min(1, "Message is required"),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactsTable.$inferSelect;
