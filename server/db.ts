/**
 * Database Connection Configuration
 * 
 * This file establishes the PostgreSQL database connection using Neon's serverless
 * driver and configures Drizzle ORM for type-safe database operations.
 * 
 * Key Features:
 * - Serverless PostgreSQL connection via Neon
 * - WebSocket support for real-time features
 * - Type-safe database queries through Drizzle ORM
 * - Automatic schema inference for compile-time validation
 * 
 * Environment Requirements:
 * - DATABASE_URL: PostgreSQL connection string from Neon/Replit
 * 
 * Security:
 * - Connection string validation ensures database is properly configured
 * - No hardcoded credentials - uses environment variables only
 * 
 * @author MindCare Development Team
 * @version 1.0.0
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon to use WebSocket for real-time features
// Required for chat functionality and live updates
neonConfig.webSocketConstructor = ws;

// Validate database connection configuration
// Ensures proper setup before application startup
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create PostgreSQL connection pool for efficient database access
// Pool manages multiple connections for concurrent requests
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Initialize Drizzle ORM with schema for type-safe database operations
// Provides compile-time type checking for all database queries
export const db = drizzle({ client: pool, schema });