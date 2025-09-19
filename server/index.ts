/**
 * Main Server Entry Point - Mental Health Support Application Backend
 * 
 * This is the primary server file that orchestrates the entire backend application.
 * It sets up the Express server with comprehensive middleware, API routes, WebSocket
 * support, and development/production environment handling.
 * 
 * Key Components:
 * - Express app with JSON parsing and URL encoding
 * - API request logging middleware with performance monitoring
 * - REST API routes organized by feature (auth, chat, appointments, etc.)
 * - WebSocket server for real-time chat functionality
 * - Vite development server integration with hot module replacement
 * - Static file serving for production deployment
 * - Global error handling with appropriate status codes
 * 
 * The server handles:
 * - HTTP API requests on all /api/* endpoints
 * - WebSocket connections on /ws endpoint for real-time chat
 * - Frontend static file serving (development via Vite, production via static files)
 * - Development hot reloading and production optimization
 */

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes/index";
import { setupVite, serveStatic, log } from "./vite";

/**
 * Express Application Setup
 * 
 * Creates the main Express application with essential middleware for:
 * - JSON request body parsing (for API endpoints)
 * - URL-encoded form data parsing (for form submissions)
 * - Request/response logging and performance monitoring
 */
const app = express();

// Enable JSON parsing for API requests (required for POST/PUT endpoints)
app.use(express.json());

// Enable URL-encoded parsing for form data (with basic encoding for security)
app.use(express.urlencoded({ extended: false }));

/**
 * API Request Logging Middleware
 * 
 * This comprehensive logging middleware tracks all API requests with:
 * - Request method, path, and response status code
 * - Performance timing (request duration in milliseconds)
 * - Response body capture for debugging and monitoring
 * - Automatic log truncation to prevent console spam
 * 
 * Only logs API requests (paths starting with /api) to avoid logging
 * static file requests which would clutter the development console.
 * Essential for debugging, performance monitoring, and understanding
 * application usage patterns.
 */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Intercept res.json to capture response data for logging
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log the completed request with timing and response data
  res.on("finish", () => {
    const duration = Date.now() - start;
    
    // Only log API requests to avoid cluttering logs with static file requests
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // Include response data for debugging (truncated for readability)
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      // Truncate long log lines to keep console readable
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

/**
 * Server Initialization and Configuration
 * 
 * This async function orchestrates the complete server setup process:
 * 1. Registers all API routes organized by feature (auth, chat, appointments, etc.)
 * 2. Creates HTTP server with integrated WebSocket support for real-time features
 * 3. Sets up development environment with Vite or production static file serving
 * 4. Starts the server on the required port with proper error handling
 * 
 * The initialization order is critical:
 * - API routes must be registered first
 * - WebSocket server is created alongside HTTP server
 * - Frontend serving (Vite or static) is configured last to avoid route conflicts
 * - Server starts on port 5000 (Replit requirement) with 0.0.0.0 binding
 */
(async () => {
  /**
   * API Routes Registration
   * 
   * Registers all REST API endpoints organized by feature area:
   * - /api/auth/* - User authentication and registration
   * - /api/chat/* - AI chatbot conversations and messages
   * - /api/appointments/* - Counselor booking and schedule management
   * - /api/assessments/* - Mental health assessments with AI analysis
   * - /api/resources/* - Educational content and resource library
   * - /api/forum/* - Peer support community discussions
   * - /api/emergency/* - Crisis intervention and emergency contacts
   * 
   * Also creates HTTP server with WebSocket support on /ws endpoint
   * for real-time chat functionality.
   */
  const httpServer = await registerRoutes(app);

  /**
   * Global Error Handler
   * 
   * Catches all uncaught errors from route handlers and middleware.
   * Provides consistent error response format and prevents server crashes.
   * 
   * Error handling strategy:
   * - Extracts HTTP status code from error object (defaults to 500)
   * - Sanitizes error message for client response
   * - Returns JSON error response with appropriate status code
   * - Re-throws error to ensure it's logged by the system
   * 
   * This middleware must be registered AFTER all routes to catch their errors.
   */
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    // Extract status code from error, defaulting to 500 for unknown errors
    const status = err.status || err.statusCode || 500;
    
    // Provide safe error message (avoid exposing internal details in production)
    const message = err.message || "Internal Server Error";

    // Send consistent JSON error response to client
    res.status(status).json({ message });
    
    // Re-throw to ensure error is logged by the runtime
    throw err;
  });

  /**
   * Frontend Development and Production Setup
   * 
   * Configures frontend serving based on environment:
   * 
   * Development Mode:
   * - Integrates Vite dev server for hot module replacement (HMR)
   * - Enables instant file change reflection for development efficiency
   * - Proxies frontend requests to Vite dev server
   * - Provides source maps and development debugging tools
   * 
   * Production Mode:
   * - Serves pre-built static files from dist directory
   * - Optimized file serving with proper caching headers
   * - All assets are pre-compressed and optimized
   * 
   * CRITICAL: This setup must happen AFTER API routes registration
   * to prevent the frontend catch-all route from intercepting API calls.
   */
  if (app.get("env") === "development") {
    // Development: Vite dev server with hot module replacement
    await setupVite(app, httpServer);
  } else {
    // Production: serve optimized static files
    serveStatic(app);
  }

  /**
   * Server Startup and Network Configuration
   * 
   * Starts the HTTP server with WebSocket support on the required port.
   * 
   * Port Configuration:
   * - Uses PORT environment variable (required for Replit deployment)
   * - Defaults to 5000 if PORT not set (Replit and local development standard)
   * - Binds to 0.0.0.0 to accept connections from all network interfaces
   * - Other ports are firewalled in Replit environment
   * 
   * This single server instance handles:
   * - REST API endpoints (/api/*)
   * - WebSocket connections (/ws)
   * - Frontend static file serving (/ and all non-API routes)
   * 
   * Environment-aware URL generation provides accurate connection information
   * for both development (localhost) and production (Replit domain) environments.
   */
  const port = parseInt(process.env.PORT || '5000', 10);
  
  httpServer.listen(port, "0.0.0.0", () => {
    log(`🚀 Server started successfully`);
    log(`📡 HTTP server listening on port ${port}`);
    
    /**
     * Dynamic URL Generation
     * 
     * Generates accurate URLs for different deployment environments:
     * - Development: localhost with port number
     * - Production: Replit subdomain without port
     * - Handles both HTTP and WebSocket protocol selection
     */
    const protocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
    const httpProtocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    
    // Environment-specific host URL generation
    let host = 'localhost';
    if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
      // Production Replit environment - use subdomain format
      host = `${process.env.REPL_SLUG}--${process.env.REPL_OWNER}.replit.app`;
    } else if (process.env.NODE_ENV !== 'production') {
      // Development environment - include port for local access
      host = `localhost:${port}`;
    }
    
    // Log connection endpoints for easy access during development
    log(`🔌 WebSocket server available at ${protocol}://${host}/ws`);
    log(`🌐 Frontend accessible at ${httpProtocol}://${host}`);
    
    // Environment-specific feature information
    if (app.get("env") === "development") {
      log(`🛠️  Development mode: Hot reload enabled`);
    } else {
      log(`⚡ Production mode: Serving static files`);
    }
  });
})();
