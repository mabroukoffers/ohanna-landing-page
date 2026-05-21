# Database Setup Guide

## Overview

OHANNA uses PostgreSQL with Drizzle ORM for type-safe database operations. This guide covers setup, migrations, and seeding.

## Prerequisites

- PostgreSQL 12+ installed and running
- Node.js 18+
- npm or pnpm

## Database Setup

### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ohanna;

# Create user (optional, for security)
CREATE USER ohanna_user WITH PASSWORD 'your_secure_password';
ALTER ROLE ohanna_user SET client_encoding TO 'utf8';
ALTER ROLE ohanna_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE ohanna_user SET default_transaction_deferrable TO on;
ALTER ROLE ohanna_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE ohanna TO ohanna_user;

# Exit psql
\q
```

### 2. Configure Environment Variables

Create `.env` file in `api-server/` directory:

```bash
# For local development with default postgres user
DATABASE_URL=postgresql://postgres:password@localhost:5432/ohanna

# Or with custom user
DATABASE_URL=postgresql://ohanna_user:your_secure_password@localhost:5432/ohanna

# For remote database (e.g., Helium)
DATABASE_URL=postgresql://postgres:password@helium/heliumdb?sslmode=disable
```

### 3. Generate Migrations

Generate migration files from schema:

```bash
npm run db:generate
```

This creates migration files in the `drizzle/` directory.

### 4. Run Migrations

Apply migrations to the database:

```bash
npm run db:migrate
```

Or use Drizzle Kit directly:

```bash
npm run db:push
```

### 5. Seed Database

Populate the database with initial product data:

```bash
npm run db:seed
```

This inserts 12 sample products into the database.

## Database Schema

### Products Table

```sql
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  badge VARCHAR(50),
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique product identifier (UUID)
- `name`: Product name
- `description`: Product description
- `price`: Price in EGP (stored as cents, e.g., 3499 = 34.99 EGP)
- `category`: Product category (Hoodies, T-Shirts, Jackets, Bottoms, Accessories)
- `badge`: Badge label (BESTSELLER, LIMITED, NEW, TRENDING, EXCLUSIVE, UTILITY)
- `imageUrl`: Path to product image
- `stock`: Available inventory count
- `slug`: URL-friendly identifier
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Orders Table

```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  stripe_session_id VARCHAR(255),
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  shipping_address JSON NOT NULL,
  items JSON NOT NULL,
  total INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Fields:**
- `id`: Order identifier (OHN-{timestamp})
- `stripeSessionId`: Stripe checkout session ID (if using Stripe)
- `customerEmail`: Customer email address
- `customerName`: Customer name
- `shippingAddress`: JSON object with shipping details
- `items`: JSON array of cart items
- `total`: Order total in EGP (stored as cents)
- `status`: Order status (pending, paid, shipped, delivered)
- `createdAt`: Order creation timestamp
- `updatedAt`: Last update timestamp

### Contacts Table

```sql
CREATE TABLE contacts (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Fields:**
- `id`: Contact message identifier (UUID)
- `name`: Sender name
- `email`: Sender email
- `subject`: Message subject
- `message`: Message content
- `createdAt`: Message creation timestamp

## Data Types

### Price Format

All prices are stored as integers representing cents:
- 3499 = 34.99 EGP
- 129900 = 1299.00 EGP

Use utility functions to convert:
```typescript
import { egpToCents, centsTOEgp, formatPrice } from "@/lib/utils";

const priceInEgp = 34.99;
const priceInCents = egpToCents(priceInEgp); // 3499

const displayPrice = formatPrice(3499); // "EGP 34.99"
```

### Shipping Address

```typescript
interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  governorate: string;
  postalCode: string;
}
```

### Cart Item

```typescript
interface CartItem {
  product: Product;
  quantity: number;
  size?: string; // XS, S, M, L, XL, XXL
}
```

## Database Queries

Use the query functions in `src/db/queries.ts`:

```typescript
import { products, orders, contacts } from "@/db/queries";

// Get all products
const allProducts = await products.getAll();

// Get product by ID
const product = await products.getById("product-id");

// Get products by category
const hoodies = await products.getByCategory("Hoodies");

// Create order
const order = await orders.create({
  id: "OHN-123",
  customerEmail: "user@example.com",
  customerName: "John Doe",
  shippingAddress: {...},
  items: [...],
  total: 349900,
  status: "pending",
});

// Update order status
await orders.updateStatus("OHN-123", "paid");

// Get order by ID
const order = await orders.getById("OHN-123");

// Create contact
const contact = await contacts.create({
  id: randomUUID(),
  name: "John",
  email: "john@example.com",
  subject: "Inquiry",
  message: "Hello...",
});
```

## Troubleshooting

### Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:** Ensure PostgreSQL is running:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL service from Services app
```

### Database Does Not Exist

```
Error: database "ohanna" does not exist
```

**Solution:** Create the database:
```bash
createdb ohanna
```

### Migration Failed

```
Error: relation "products" already exists
```

**Solution:** Migrations are idempotent. If you need to reset:
```bash
# Drop all tables (WARNING: destructive)
psql -U postgres -d ohanna -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migrations
npm run db:migrate
```

### Seed Failed

```
Error: duplicate key value violates unique constraint
```

**Solution:** Clear existing data and re-seed:
```bash
npm run db:seed
```

## Backup & Restore

### Backup Database

```bash
pg_dump -U postgres ohanna > ohanna_backup.sql
```

### Restore Database

```bash
psql -U postgres ohanna < ohanna_backup.sql
```

## Production Deployment

### Environment Variables

Set these in your production environment:

```bash
DATABASE_URL=postgresql://user:password@prod-host:5432/ohanna
NODE_ENV=production
```

### Run Migrations

```bash
npm run db:migrate
```

### Seed Data

```bash
npm run db:seed
```

### Connection Pooling

For production, configure connection pooling in `src/db/index.ts`:

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Monitoring

### Check Database Size

```sql
SELECT pg_size_pretty(pg_database_size('ohanna'));
```

### Check Table Sizes

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Active Connections

```sql
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;
```

## References

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview)
