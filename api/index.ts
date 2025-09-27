/**
 * Vercel Serverless Function Handler
 * 
 * This file exports the Express app as a serverless function compatible with Vercel.
 * It handles all API routes and server-side functionality in a serverless environment.
 */

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes/index";

/**
 * Express Application Setup for Vercel
 */
const app = express();

// Enable JSON parsing for API requests
app.use(express.json());

// Enable URL-encoded parsing for form data
app.use(express.urlencoded({ extended: false }));

/**
 * API Request Logging Middleware for Production
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    return originalSend.call(this, data);
  };

  next();
});

/**
 * Register API Routes
 * All routes from server/routes/index.ts are registered here
 */
registerRoutes(app);

/**
 * Global Error Handler
 */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error(`Error ${status}: ${message}`, err.stack);
  
  res.status(status).json({ 
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

/**
 * Health Check Endpoint
 */
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production"
  });
});

// Export for Vercel
export default app;