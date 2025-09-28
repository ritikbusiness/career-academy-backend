import dotenv from 'dotenv';
// Load environment variables
dotenv.config({ path: '.env' });

import 'dotenv/config'; // <- this automatically loads .env before anything else

import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { router } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { apiLogger } from "./utils/logger";
import cors from "cors";
import passport from './config/passport';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5000',
  credentials: true // Enable cookies for authentication
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser()); // Enable cookie parsing for refresh tokens

// Initialize Passport
app.use(passport.initialize());

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
