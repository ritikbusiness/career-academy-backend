import express from 'express';
import * as AIController from './controllers/aiController';
import { AuthController } from './controllers/authController';
import { authenticateJWT, requireAuth, requireAdmin, requireInstructor } from './middleware/auth';
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

// ===== AUTHENTICATION ROUTES =====
// Authentication rate limiting
const authLimiter = generalLimiter;

// Authentication routes
router.post('/auth/register', authLimiter.middleware, asyncHandler(AuthController.register));
router.post('/auth/login', authLimiter.middleware, asyncHandler(AuthController.login));
router.post('/auth/refresh', asyncHandler(AuthController.refreshToken));
router.post('/auth/logout', authenticateJWT, asyncHandler(AuthController.logout));

// Password reset routes
router.post('/auth/forgot-password', authLimiter.middleware, asyncHandler(AuthController.forgotPassword));
router.post('/auth/reset-password', authLimiter.middleware, asyncHandler(AuthController.resetPassword));

// Google OAuth routes
router.get('/auth/google', AuthController.googleAuth);
router.get('/auth/google/callback', asyncHandler(AuthController.googleCallback));

// Protected user routes
router.get('/auth/me', authenticateJWT, requireAuth, asyncHandler(AuthController.getProfile));
router.put('/auth/profile', authenticateJWT, requireAuth, asyncHandler(AuthController.updateProfile));
router.put('/auth/change-password', authenticateJWT, requireAuth, asyncHandler(AuthController.changePassword));

// ===== PUBLIC ROUTES (No Authentication Required) =====

// Public course listings (placeholder)
router.get('/courses', (req, res) => {
  res.json({
    success: true,
    message: 'Course endpoints will be restored after authentication system is complete',
    data: []
  });
});

router.get('/courses/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Course details endpoint will be restored after authentication system is complete',
    data: null
  });
});

// ===== PROTECTED ROUTES PLACEHOLDERS =====
// All protected routes return 503 until authentication system is fully integrated

router.all('/admin/*', authenticateJWT, requireAdmin, (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Admin features will be restored after authentication system integration is complete.'
  });
});

router.all('/instructor/*', authenticateJWT, requireInstructor, (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Instructor features will be restored after authentication system integration is complete.'
  });
});

router.all('/student/*', authenticateJWT, requireAuth, (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Student features will be restored after authentication system integration is complete.'
  });
});

router.all('/courses/:id/enroll', authenticateJWT, requireAuth, (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Course enrollment will be restored after authentication system integration is complete.'
  });
});

router.all('/gamification/*', authenticateJWT, requireAuth, (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Gamification features will be restored after authentication system integration is complete.'
  });
});

router.all('/peer-help/*', (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Peer help features will be restored after authentication system integration is complete.'
  });
});

router.all('/ai/*', authenticateJWT, requireAuth, (req, res) => {
  res.status(503).json({
    success: false,
    error: 'AI features will be restored after authentication system integration is complete.'
  });
});

router.all('/video/*', authenticateJWT, requireAuth, (req, res) => {
  res.status(503).json({
    success: false,
    error: 'Video features will be restored after authentication system integration is complete.'
  });
});

// Catch-all for any other protected routes
router.all('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      error: 'API endpoint not found'
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Route not found'
    });
  }
});

export { router };