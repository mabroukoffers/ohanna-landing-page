# OHANNA Backend Architecture

## Overview

The OHANNA backend is a production-ready Express.js API with PostgreSQL database, Drizzle ORM, comprehensive middleware, and type-safe operations.

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL 12+
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Logging**: Pino
- **Language**: TypeScript
- **Build**: esbuild

## Project Structure

```
api-server/
├── src/
│   ├── api/                    # Generated API types
│   │   ├── generated/
│   │   │   ├── api.ts
│   │   │   └── types/
│   │   └── index.ts
│   ├── config/                 # Configuration
│   │   └── index.ts
│   ├── db/                     # Database layer
│   │   ├── schema/
│   │   │   ├── products.ts
│   │   │   ├── orders.ts
│   │   │   ├── contacts.ts
│   │   │   └── index.ts
│   │   ├── queries.ts          # Data access layer
│   │   ├── migrate.ts          # Migration runner
│   │   ├── seed.ts             # Database seeding
│   │   └── index.ts            # DB initialization
│   ├── lib/                    # Utilities
│   │   ├── env.ts              # Environment variables
│   │   ├── logger.ts           # Pino logger
│   │   ├── swagger.ts          # OpenAPI docs
│   │   └── utils.ts            # Helper functions
│   ├── middlewares/            # Express middleware
│   │   ├── error-handler.ts
│   │   ├── validation.ts
│   │   ├── request-logger.ts
│   │   ├── cors.ts
│   │   └── index.ts
│   ├── routes/                 # API routes
│   │   ├── health.ts
│   │   ├── ohanna.ts           # Main API routes
│   │   └── index.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── app.ts                  # Express app setup
│   └── index.ts                # Server entry point
├── drizzle/                    # Generated migrations
├── dist/                       # Compiled output
├── build.mjs                   # Build script
├── drizzle.config.ts           # Drizzle configuration
├── tsconfig.json               # TypeScript config
├── package.json
├── .env.example
├── DATABASE_SETUP.md
├── API_GUIDE.md
└── BACKEND_ARCHITECTURE.md
```

## Data Flow

### Request Lifecycle

```
Request
  ↓
Logging Middleware (pino-http)
  ↓
CORS Middleware
  ↓
Body Parsing (JSON/URL-encoded)
  ↓
Request Logger
  ↓
Route Handler
  ↓
Database Query (if needed)
  ↓
Response
  ↓
Error Handler (if error)
```

## Core Components

### 1. Database Layer (`src/db/`)

**Schema Files** (`schema/*.ts`):
- Define Drizzle tables
- Export Zod insert schemas
- Export TypeScript types

**Queries** (`queries.ts`):
- Centralized data access functions
- Type-safe database operations
- Organized by entity (products, orders, contacts)

**Initialization** (`index.ts`):
- Creates database connection pool
- Initializes Drizzle ORM instance
- Exports db and pool

### 2. Routes (`src/routes/`)

**Health Routes** (`health.ts`):
- `GET /api/healthz` - API health check

**Main Routes** (`ohanna.ts`):
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `POST /api/checkout` - Create checkout session
- `POST /api/contact` - Submit contact form
- `GET /api/track-order` - Track order status
- `GET /api/setup` - API setup status

### 3. Middleware (`src/middlewares/`)

**Error Handler**:
- Catches all errors
- Formats consistent error responses
- Logs errors with context

**Validation**:
- Validates request bodies against Zod schemas
- Validates query parameters
- Returns 400 with validation details

**Request Logger**:
- Logs incoming requests
- Measures response time
- Logs outgoing responses

**CORS**:
- Configures cross-origin requests
- Allows frontend to communicate with backend
- Supports credentials

### 4. Configuration (`src/config/`)

Centralized configuration for:
- Server settings
- Database connection
- Stripe integration
- CORS settings
- Logging levels
- API versioning
- Pagination defaults
- Shipping calculations

### 5. Types (`src/types/`)

TypeScript interfaces for:
- API requests/responses
- Database models
- Pagination
- Error handling

## API Endpoints

### Products

```
GET /api/products
  Response: { products: Product[] }

GET /api/products/:id
  Response: Product

GET /api/products/category/:category
  Response: { products: Product[] }
```

### Checkout

```
POST /api/checkout
  Body: {
    items: CartItem[],
    successUrl: string,
    cancelUrl: string,
    customerEmail: string,
    customerName: string,
    shippingAddress: ShippingAddress
  }
  Response: {
    url: string,
    sessionId: string,
    orderId: string
  }
```

### Contact

```
POST /api/contact
  Body: {
    name: string,
    email: string,
    subject?: string,
    message: string
  }
  Response: {
    success: boolean,
    message: string
  }
```

### Order Tracking

```
GET /api/track-order?id=OHN-123&email=user@example.com
  Response: {
    order: Order
  }
```

### Health

```
GET /api/healthz
  Response: { status: "ok" }

GET /health
  Response: { status: "ok", message: "OHANNA API is running" }
```

### Documentation

```
GET /api-docs
  Response: OpenAPI/Swagger JSON
```

## Database Schema

### Products Table

Stores product information with inventory tracking.

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  category: string;
  badge?: string;
  imageUrl: string;
  stock: number;
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Orders Table

Stores customer orders with shipping and payment information.

```typescript
interface Order {
  id: string;
  stripeSessionId?: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  total: number; // in cents
  status: "pending" | "paid" | "shipped" | "delivered";
  createdAt: Date;
  updatedAt: Date;
}
```

### Contacts Table

Stores contact form submissions.

```typescript
interface Contact {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: Date;
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "details": {}
  }
}
```

### Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Logging

Uses Pino for structured logging:

```typescript
logger.info({ key: "value" }, "Message");
logger.error({ err }, "Error message");
logger.warn({ duration: "100ms" }, "Warning");
```

**Development**: Pretty-printed logs
**Production**: JSON formatted logs

## Environment Variables

```bash
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@host:5432/ohanna

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info

# API
API_BASE_URL=http://localhost:3001
```

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### Development

```bash
# Build
npm run build

# Start server
PORT=3001 npm run start

# Type check
npm run typecheck
```

### Database

```bash
# Generate migrations from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed database
npm run db:seed

# Push schema to database
npm run db:push
```

## Production Deployment

### Build

```bash
npm run build
```

### Environment Setup

```bash
export DATABASE_URL=postgresql://user:password@prod-host:5432/ohanna
export NODE_ENV=production
export STRIPE_SECRET_KEY=sk_live_...
export CORS_ORIGIN=https://ohanna.com
```

### Run Migrations

```bash
npm run db:migrate
```

### Start Server

```bash
PORT=3001 npm run start
```

### Process Management

Use PM2 or systemd:

```bash
# PM2
pm2 start dist/index.mjs --name ohanna-api

# systemd
systemctl start ohanna-api
```

## Performance Considerations

### Database

- Connection pooling (max 20 connections)
- Indexed queries on frequently accessed fields
- JSON storage for flexible data (orders, shipping)

### Caching

- Consider Redis for product caching
- Cache product list for 5 minutes
- Invalidate on product updates

### Rate Limiting

- Implement rate limiting on checkout endpoint
- Limit contact form submissions per IP
- Use express-rate-limit middleware

### Monitoring

- Monitor database connection pool
- Track API response times
- Alert on error rates
- Monitor disk space for logs

## Security

### CORS

- Whitelist specific origins
- Require credentials for sensitive operations
- Validate request headers

### Input Validation

- Validate all request inputs with Zod
- Sanitize email addresses
- Validate phone numbers

### Database

- Use parameterized queries (Drizzle handles this)
- Never concatenate user input into queries
- Use environment variables for credentials

### Stripe

- Never log API keys
- Use environment variables
- Validate webhook signatures

## Testing

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

## Monitoring & Logging

### Logs

- Stored in `logs/` directory
- Rotated daily
- Archived after 30 days

### Metrics

- Request count
- Response time
- Error rate
- Database query time

### Alerts

- Error rate > 5%
- Response time > 1s
- Database connection pool exhausted
- Disk space < 10%

## Troubleshooting

### Database Connection Error

Check DATABASE_URL and PostgreSQL is running.

### Migration Failed

Ensure database exists and migrations folder is present.

### Stripe Integration Not Working

Verify STRIPE_SECRET_KEY is set and valid.

### CORS Error

Check CORS_ORIGIN matches frontend URL.

## References

- [Express.js Documentation](https://expressjs.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Pino Logger Documentation](https://getpino.io/)
- [Zod Documentation](https://zod.dev/)
