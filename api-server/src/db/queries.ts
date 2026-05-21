/**
 * Database query functions
 * Centralized data access layer
 */

import { db, productsTable, ordersTable, contactsTable } from "./index";
import { eq, like, desc } from "drizzle-orm";
import type { InsertProduct, Product, InsertOrder, Order, InsertContact, Contact } from "./schema";

/**
 * Products queries
 */
export const products = {
  async getAll(): Promise<Product[]> {
    return db.select().from(productsTable);
  },

  async getById(id: string): Promise<Product | undefined> {
    const result = await db.select().from(productsTable).where(eq(productsTable.id, id));
    return result[0];
  },

  async getBySlug(slug: string): Promise<Product | undefined> {
    const result = await db.select().from(productsTable).where(eq(productsTable.slug, slug));
    return result[0];
  },

  async getByCategory(category: string): Promise<Product[]> {
    return db.select().from(productsTable).where(eq(productsTable.category, category));
  },

  async search(query: string): Promise<Product[]> {
    return db
      .select()
      .from(productsTable)
      .where(like(productsTable.name, `%${query}%`));
  },

  async create(data: InsertProduct): Promise<Product> {
    const result = await db.insert(productsTable).values(data).returning();
    return result[0];
  },

  async update(id: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db
      .update(productsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(productsTable.id, id))
      .returning();
    return result[0];
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(productsTable).where(eq(productsTable.id, id));
    return result.rowCount > 0;
  },
};

/**
 * Orders queries
 */
export const orders = {
  async getAll(): Promise<Order[]> {
    return db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  },

  async getById(id: string): Promise<Order | undefined> {
    const result = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    return result[0];
  },

  async getByCustomerEmail(email: string): Promise<Order[]> {
    return db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.customerEmail, email))
      .orderBy(desc(ordersTable.createdAt));
  },

  async getByStripeSessionId(sessionId: string): Promise<Order | undefined> {
    const result = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.stripeSessionId, sessionId));
    return result[0];
  },

  async create(data: InsertOrder): Promise<Order> {
    const result = await db.insert(ordersTable).values(data).returning();
    return result[0];
  },

  async update(id: string, data: Partial<InsertOrder>): Promise<Order | undefined> {
    const result = await db
      .update(ordersTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(ordersTable.id, id))
      .returning();
    return result[0];
  },

  async updateStatus(id: string, status: string): Promise<Order | undefined> {
    const result = await db
      .update(ordersTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(ordersTable.id, id))
      .returning();
    return result[0];
  },
};

/**
 * Contacts queries
 */
export const contacts = {
  async getAll(): Promise<Contact[]> {
    return db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
  },

  async getById(id: string): Promise<Contact | undefined> {
    const result = await db.select().from(contactsTable).where(eq(contactsTable.id, id));
    return result[0];
  },

  async create(data: InsertContact): Promise<Contact> {
    const result = await db.insert(contactsTable).values(data).returning();
    return result[0];
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(contactsTable).where(eq(contactsTable.id, id));
    return result.rowCount > 0;
  },
};
