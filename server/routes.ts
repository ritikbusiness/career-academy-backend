import express from 'express';
import * as UserController from './controllers/userController';
import * as CourseController from './controllers/courseController';
import * as GameController from './controllers/gameController';
import * as AIController from './controllers/aiController';
import { AuthController } from './controllers/authController';
import { generalLimiter, aiLimiter } from './middleware/rateLimiter';
import { asyncHandler } from './middleware/errorHandler';

const router = express.Router();

// Apply general rate limiting to all routes
router.use(generalLimiter.middleware);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// AI Service health check
router.get('/health/ai', asyncHandler(AIController.healthCheck));

// ===== AUTHENTICATION ROUTES REMOVED =====
// All authentication routes have been removed during system rebuild
// They will be replaced with clean implementation

router.all('/auth/*', (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Authentication system is being rebuilt. Please check back shortly.',
    message: 'All authentication endpoints are temporarily unavailable during system reconstruction.'
  });
});

// ===== PUBLIC ROUTES (No Authentication Required) =====

// Public course listings
router.get('/courses', asyncHandler(CourseController.getAllCourses));
router.get('/courses/:id', asyncHandler(CourseController.getCourse));

// ===== PROTECTED ROUTES TEMPORARILY DISABLED =====
// All protected routes have been disabled during authentication system rebuild
// They will be re-enabled with proper authentication in the next phase

router.all('/admin/*', (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Admin features temporarily unavailable during authentication rebuild.'
  });
});

router.all('/instructor/*', (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Instructor features temporarily unavailable during authentication rebuild.'
  });
});

router.all('/student/*', (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Student features temporarily unavailable during authentication rebuild.'
  });
});

router.all('/courses/:id/enroll', (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Course enrollment temporarily unavailable during authentication rebuild.'
  });
});

router.all('/courses/:id/lessons/*', (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Course lessons temporarily unavailable during authentication rebuild.'
  });
});

router.all('/gamification/*', (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Gamification features temporarily unavailable during authentication rebuild.'
  });
});

router.all('/peer-help/*', (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Peer help features temporarily unavailable during authentication rebuild.'
  });
});

router.all('/ai/*', (req, res) => {
  res.status(503).json({
    success: false,
    error: 'AI features temporarily unavailable during authentication rebuild.'
  });
});

router.all('/video/*', (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Video features temporarily unavailable during authentication rebuild.'
  });
});

// Catch-all for any other protected routes
router.all('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(503).json({
      success: false,
      error: 'This API endpoint is temporarily unavailable during authentication system rebuild.'
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Route not found'
    });
  }
});

export { router };