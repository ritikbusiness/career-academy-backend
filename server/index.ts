// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
import path from 'path';

// Configure environment immediately
dotenv.config({ 
  path: path.resolve(process.cwd(), '.env'),
  override: true
});

// Verify environment variables are loaded
console.log('🔧 Environment variables loaded, initializing Google OAuth...');
console.log('GOOGLE_CLIENT_ID present:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET present:', !!process.env.GOOGLE_CLIENT_SECRET);

// Now import everything else after environment variables are loaded
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { router } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { apiLogger } from "./utils/logger";
import cors from "cors";
import cookieParser from 'cookie-parser';

// Main server setup function
async function setupServer() {
  const app = express();

  // Middleware setup
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true // Enable cookies for authentication
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(cookieParser()); // Enable cookie parsing for refresh tokens

  // Now we can safely import passport after environment variables are loaded
  console.log('🔧 Importing passport after environment setup...');
  const passportModule = await import('./config/passport');
  const passport = passportModule.default;
  console.log('✅ Passport imported successfully!');

  // Initialize Passport middleware BEFORE setting up routes
  app.use(passport.initialize());
  console.log('✅ Passport initialized!');

  return app;
}

// Initialize the app
const app = await setupServer();

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

// Request logging  
app.use(apiLogger);

// API routes
app.use('/api', router);

// 404 handler for API routes
app.use('/api', notFound);

(async () => {
  // Global error handler
  app.use(errorHandler);

  // Create HTTP server
  const server = createServer(app);
  
  // Use production build for stability
  serveStatic(app);

  // serve the app on port 5000 for Replit workflow compatibility
  const port = 5000;
  server.listen(port, "0.0.0.0", () => {
    console.log(`[express] serving on port ${port}`);
  });
})();
