import express from 'express';
import { AuthController } from './controllers/authController';
import { CourseController } from './controllers/courseController';
import { GamificationController } from './controllers/gamificationController';
import { PeerHelpController } from './controllers/peerHelpController';
import { AnalyticsController } from './controllers/analyticsController';
import * as AIController from './controllers/aiController';
import { AdminController } from './controllers/adminController';
import { InstructorInviteController } from './controllers/instructorInviteController';
import { handleSecureVideoUpload, verifyVideoAccess, updateLessonVideo, regenerateVideoUrl } from './controllers/videoUploadController';
import { authenticate, authorize, authorizeApprovedInstructor, authorizeAdmin, refreshToken } from './middleware/auth';
import { validateRequest, registerSchema, loginSchema, createCourseSchema, createQuestionSchema, createAnswerSchema, idParamSchema, paginationSchema } from './middleware/validator';
import { generalLimiter, authLimiter, aiLimiter } from './middleware/rateLimiter';
import { asyncHandler } from './middleware/errorHandler';
import { AIService } from './services/aiService';
import passport from './config/passport';

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
router.post('/auth/register', 
  authLimiter.middleware,
  validateRequest({ body: registerSchema }),
  asyncHandler(AuthController.register)
);

// Add signup route (alias for register to match user expectations)
router.post('/auth/signup', 
  authLimiter.middleware,
  validateRequest({ body: registerSchema }),
  asyncHandler(AuthController.register)
);

router.post('/auth/login',
  authLimiter.middleware,
  validateRequest({ body: loginSchema }),
  asyncHandler(AuthController.login)
);

// Add me route (alias for profile to match user expectations)
router.get('/auth/me',
  authenticate,
  asyncHandler(AuthController.getProfile)
);

router.post('/auth/refresh',
  authenticate,
  asyncHandler(refreshToken)
);

router.post('/auth/logout',
  authenticate,
  asyncHandler(AuthController.logout)
);

router.get('/auth/profile',
  authenticate,
  asyncHandler(AuthController.getProfile)
);

router.put('/auth/profile',
  authenticate,
  asyncHandler(AuthController.updateProfile)
);

router.put('/auth/change-password',
  authenticate,
  asyncHandler(AuthController.changePassword)
);

router.get('/auth/dashboard',
  authenticate,
  asyncHandler(AuthController.getDashboard)
);

// Google OAuth routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed' }),
  asyncHandler(AuthController.googleCallback)
);

// ===== INSTRUCTOR AUTHENTICATION ROUTES =====
router.get('/auth/instructor/validate-invite',
  asyncHandler(AuthController.validateInstructorInvite)
);

router.post('/auth/instructor/signup',
  authLimiter.middleware,
  asyncHandler(AuthController.instructorSignupWithToken)
);

router.put('/auth/instructor/profile',
  authenticate,
  authorizeApprovedInstructor,
  asyncHandler(AuthController.updateInstructorProfile)
);

router.get('/auth/instructor/profile',
  authenticate,
  authorizeApprovedInstructor,
  asyncHandler(AuthController.getInstructorProfile)
);

// ===== INSTRUCTOR INVITE ROUTES (Admin Only) =====
router.post('/admin/instructor-invites',
  authenticate,
  authorize(['admin']),
  asyncHandler(InstructorInviteController.generateInvite)
);

router.get('/admin/instructor-invites',
  authenticate,
  authorize(['admin']),
  asyncHandler(InstructorInviteController.listInvites)
);

router.delete('/admin/instructor-invites/:inviteId',
  authenticate,
  authorize(['admin']),
  asyncHandler(InstructorInviteController.revokeInvite)
);

router.get('/instructor-invites/:token',
  asyncHandler(InstructorInviteController.getInviteByToken)
);

// ===== ADMIN MANAGEMENT ROUTES =====
router.get('/admin/instructors/pending',
  authenticate,
  authorizeAdmin,
  asyncHandler(AdminController.getPendingInstructors)
);

router.get('/admin/instructors',
  authenticate,
  authorizeAdmin,
  asyncHandler(AdminController.getAllInstructors)
);

router.post('/admin/instructors/:instructorId/approve',
  authenticate,
  authorizeAdmin,
  asyncHandler(AdminController.approveInstructor)
);

router.post('/admin/instructors/:instructorId/reject',
  authenticate,
  authorizeAdmin,
  asyncHandler(AdminController.rejectInstructor)
);

router.post('/admin/instructors/:instructorId/reset',
  authenticate,
  authorizeAdmin,
  asyncHandler(AdminController.resetInstructorStatus)
);

router.get('/admin/stats',
  authenticate,
  authorizeAdmin,
  asyncHandler(AdminController.getPlatformStats)
);

// ===== COURSE ROUTES =====
router.get('/courses',
  validateRequest({ query: paginationSchema }),
  asyncHandler(CourseController.getCourses)
);

router.get('/courses/:id',
  validateRequest({ params: idParamSchema }),
  asyncHandler(CourseController.getCourse)
);

router.post('/courses',
  authenticate,
  authorize(['instructor', 'admin']),
  validateRequest({ body: createCourseSchema }),
  asyncHandler(CourseController.createCourse)
);

router.put('/courses/:id',
  authenticate,
  authorize(['instructor', 'admin']),
  validateRequest({ params: idParamSchema }),
  asyncHandler(CourseController.updateCourse)
);

router.delete('/courses/:id',
  authenticate,
  authorize(['instructor', 'admin']),
  validateRequest({ params: idParamSchema }),
  asyncHandler(CourseController.deleteCourse)
);

router.post('/courses/:id/enroll',
  authenticate,
  authorize(['student']),
  validateRequest({ params: idParamSchema }),
  asyncHandler(CourseController.enrollInCourse)
);

router.get('/my-courses',
  authenticate,
  authorize(['student']),
  asyncHandler(CourseController.getUserCourses)
);

router.get('/instructor-courses',
  authenticate,
  authorize(['instructor', 'admin']),
  asyncHandler(CourseController.getInstructorCourses)
);

router.post('/courses/:courseId/modules',
  authenticate,
  authorize(['instructor', 'admin']),
  asyncHandler(CourseController.addModule)
);

router.post('/modules/:moduleId/lessons',
  authenticate,
  authorize(['instructor', 'admin']),
  asyncHandler(CourseController.addLesson)
);

router.put('/courses/:courseId/lessons/:lessonId/complete',
  authenticate,
  authorize(['student']),
  asyncHandler(CourseController.completeLesson)
);

router.get('/courses/:id/analytics',
  authenticate,
  authorize(['instructor', 'admin']),
  validateRequest({ params: idParamSchema }),
  asyncHandler(CourseController.getCourseAnalytics)
);

// ===== GAMIFICATION ROUTES =====
router.get('/gamification/stats',
  authenticate,
  asyncHandler(GamificationController.getUserStats)
);

router.get('/gamification/leaderboard',
  asyncHandler(GamificationController.getLeaderboard)
);

router.post('/gamification/award-xp',
  authenticate,
  authorize(['admin']),
  asyncHandler(GamificationController.awardXP)
);

router.put('/gamification/streak',
  authenticate,
  asyncHandler(GamificationController.updateLearningStreak)
);

router.get('/gamification/achievements',
  asyncHandler(GamificationController.getAvailableAchievements)
);

router.post('/gamification/check-achievements',
  authenticate,
  asyncHandler(GamificationController.checkAchievements)
);

router.get('/gamification/xp-history',
  authenticate,
  asyncHandler(GamificationController.getXPHistory)
);

// ===== PEER HELP CENTER ROUTES =====
router.get('/help/categories',
  asyncHandler(PeerHelpController.getCategories)
);

router.get('/help/questions',
  validateRequest({ query: paginationSchema }),
  asyncHandler(PeerHelpController.getQuestions)
);

router.get('/help/questions/:id',
  validateRequest({ params: idParamSchema }),
  asyncHandler(PeerHelpController.getQuestion)
);

router.post('/help/questions',
  authenticate,
  validateRequest({ body: createQuestionSchema }),
  asyncHandler(PeerHelpController.createQuestion)
);

router.post('/help/questions/:questionId/answers',
  authenticate,
  validateRequest({ body: createAnswerSchema }),
  asyncHandler(PeerHelpController.createAnswer)
);

router.put('/help/answers/:answerId/rate',
  authenticate,
  asyncHandler(PeerHelpController.rateAnswer)
);

router.get('/help/leaderboard',
  asyncHandler(PeerHelpController.getHelpLeaderboard)
);

router.get('/help/my-stats',
  authenticate,
  asyncHandler(PeerHelpController.getUserHelpStats)
);

router.post('/help/questions/:questionId/vote',
  authenticate,
  asyncHandler(PeerHelpController.voteOnQuestion)
);

router.post('/help/answers/:answerId/vote',
  authenticate,
  asyncHandler(PeerHelpController.voteOnAnswer)
);

router.put('/help/answers/:answerId/accept',
  authenticate,
  asyncHandler(PeerHelpController.acceptAnswer)
);

router.get('/help/search',
  asyncHandler(PeerHelpController.searchQuestions)
);

// ===== ANALYTICS ROUTES =====
router.get('/analytics/user',
  authenticate,
  asyncHandler(AnalyticsController.getUserAnalytics)
);

router.get('/analytics/course/:courseId',
  authenticate,
  authorize(['instructor', 'admin']),
  validateRequest({ params: idParamSchema }),
  asyncHandler(AnalyticsController.getCourseAnalytics)
);

router.get('/analytics/dashboard',
  authenticate,
  asyncHandler(AnalyticsController.getDashboardAnalytics)
);

router.post('/analytics/activity',
  authenticate,
  asyncHandler(AnalyticsController.recordActivity)
);

router.get('/analytics/progress-report',
  authenticate,
  asyncHandler(AnalyticsController.getProgressReport)
);

router.get('/analytics/learning-patterns',
  authenticate,
  asyncHandler(AnalyticsController.getLearningPatterns)
);

// ===== AI-POWERED FEATURES =====
router.post('/ai/lesson-summary',
  authenticate,
  aiLimiter.middleware,
  asyncHandler(AIController.generateLessonSummary)
);

router.post('/ai/practice-questions',
  authenticate,
  aiLimiter.middleware,
  asyncHandler(AIController.generatePracticeQuestions)
);

router.post('/ai/study-buddy/chat',
  authenticate,
  aiLimiter.middleware,
  asyncHandler(AIController.studyBuddyChat)
);

router.post('/ai/skill-gap-analysis',
  authenticate,
  aiLimiter.middleware,
  asyncHandler(AIController.analyzeSkillGaps)
);

router.post('/ai/generate-content',
  authenticate,
  authorize(['instructor', 'admin']),
  aiLimiter.middleware,
  asyncHandler(AIController.generateLessonContent)
);

// ===== ENHANCED AI-POWERED BACKEND FEATURES =====

// AI Answer Analysis & Scoring
router.post('/ai/analyze-answer/:answerId',
  authenticate,
  aiLimiter.middleware,
  validateRequest({ params: idParamSchema }),
  asyncHandler(AIController.analyzeAnswer)
);

// Skill Progress Analytics
router.get('/ai/skill-analytics/:userId',
  authenticate,
  validateRequest({ params: idParamSchema }),
  asyncHandler(AIController.getSkillAnalytics)
);

router.post('/ai/skill-progress',
  authenticate,
  asyncHandler(AIController.updateSkillProgress)
);

// Mission Management
router.post('/ai/missions',
  authenticate,
  authorize(['admin']),
  asyncHandler(AIController.createMission)
);

router.get('/ai/missions/:userId',
  authenticate,
  validateRequest({ params: idParamSchema }),
  asyncHandler(AIController.getUserMissions)
);

router.post('/ai/missions/progress',
  authenticate,
  asyncHandler(AIController.updateMissionProgress)
);

router.post('/ai/missions/claim-reward',
  authenticate,
  asyncHandler(AIController.claimMissionReward)
);

// Smart Content Unlock System
router.get('/ai/unlock-status/:userId/:unlockType',
  authenticate,
  asyncHandler(AIController.checkUnlockStatus)
);

// AI Mentor Bot
router.post('/ai/mentor/:questionId',
  authenticate,
  aiLimiter.middleware,
  validateRequest({ params: idParamSchema }),
  asyncHandler(AIController.triggerAIMentor)
);

// Answer Quality Tracking
router.get('/ai/answer-quality/:userId',
  authenticate,
  validateRequest({ params: idParamSchema }),
  asyncHandler(AIController.getAnswerQualityStats)
);

// ===== ADMIN ROUTES =====
router.get('/admin/stats',
  authenticate,
  authorize(['admin']),
  asyncHandler(AdminController.getSystemStats)
);

router.put('/admin/users/role',
  authenticate,
  authorize(['admin']),
  asyncHandler(AdminController.updateUserRole)
);

router.put('/admin/config',
  authenticate,
  authorize(['admin']),
  asyncHandler(AdminController.updateSystemConfig)
);

router.post('/admin/moderate',
  authenticate,
  authorize(['admin']),
  asyncHandler(AdminController.moderateContent)
);

router.get('/admin/export-analytics',
  authenticate,
  authorize(['admin']),
  asyncHandler(AdminController.exportAnalytics)
);

// ===== VIDEO UPLOAD ROUTES =====
router.post('/upload/video',
  authenticate,
  authorize(['instructor', 'admin']),
  handleSecureVideoUpload
);

router.get('/video/verify',
  authenticate,
  verifyVideoAccess
);

router.put('/lessons/:lessonId/video',
  authenticate,
  authorize(['instructor', 'admin']),
  updateLessonVideo
);

router.post('/video/regenerate-url',
  authenticate,
  regenerateVideoUrl
);

export { router };