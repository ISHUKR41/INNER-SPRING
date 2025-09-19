import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register all API routes and create HTTP server with WebSocket support
  // The registerRoutes function sets up WebSocket server on the /ws endpoint
  const httpServer = await registerRoutes(app);

  // Global error handler for Express - handles all uncaught errors
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup development environment with Vite HMR or serve static production files
  // This must be done after setting up all API routes so the catch-all route
  // doesn't interfere with API endpoints
  if (app.get("env") === "development") {
    // In development, Vite provides hot module replacement and dev server
    await setupVite(app, httpServer);
  } else {
    // In production, serve pre-built static files
    serveStatic(app);
  }

  // Start the HTTP server which includes WebSocket support
  // ALWAYS serve on the port specified in PORT environment variable (Replit requirement)
  // Other ports are firewalled by Replit. Default to 5000 if PORT is not set.
  // This single server handles:
  // - HTTP API requests (REST endpoints)
  // - WebSocket connections (real-time chat)
  // - Static file serving (frontend assets)
  const port = parseInt(process.env.PORT || '5000', 10);
  
  httpServer.listen(port, "0.0.0.0", () => {
    log(`🚀 Server started successfully`);
    log(`📡 HTTP server listening on port ${port}`);
    
    // Dynamic URL generation based on environment instead of hardcoded localhost
    // This provides accurate connection URLs in both development and production
    const protocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
    const httpProtocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    
    // Generate proper host URL for different environments
    let host = 'localhost';
    if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
      // Production Replit environment
      host = `${process.env.REPL_SLUG}--${process.env.REPL_OWNER}.replit.app`;
    } else if (process.env.NODE_ENV !== 'production') {
      // Development environment - include port
      host = `localhost:${port}`;
    }
    
    log(`🔌 WebSocket server available at ${protocol}://${host}/ws`);
    log(`🌐 Frontend accessible at ${httpProtocol}://${host}`);
    
    // Log environment-specific information
    if (app.get("env") === "development") {
      log(`🛠️  Development mode: Hot reload enabled`);
    } else {
      log(`⚡ Production mode: Serving static files`);
    }
  });
})();
