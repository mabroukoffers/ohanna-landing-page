/**
 * Application configuration
 * Centralized configuration management
 */

import { env } from "../lib/env";

export const config = {
  // Server
  server: {
    port: env.port,
    nodeEnv: env.nodeEnv,
    isDevelopment: env.nodeEnv === "development",
    isProduction: env.nodeEnv === "production",
  },

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // Stripe
  stripe: {
    secretKey: env.stripeSecretKey,
    publishableKey: env.stripePublishableKey,
    enabled: !!env.stripeSecretKey && env.stripeSecretKey.startsWith("sk_"),
  },

  // CORS
  cors: {
    origin: env.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // 24 hours
  },

  // Logging
  logging: {
    level: env.logLevel,
  },

  // API
  api: {
    version: "1.0.0",
    prefix: "/api",
    baseUrl: process.env.API_BASE_URL || `http://localhost:${env.port}`,
  },

  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  // Shipping
  shipping: {
    freeShippingThreshold: 150000, // 1500 EGP in cents
    standardShippingFee: 6000, // 60 EGP in cents
  },
};

export default config;
