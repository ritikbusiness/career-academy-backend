import { Request, Response } from 'express';
import { storage } from '../storage';
import { hashPassword, comparePassword } from '../utils/helpers';
import { generateToken, AuthRequest } from '../middleware/auth';
import { securityLogger, logger } from '../utils/logger';
import { createValidationError, createAuthError, createConflictError, AppError } from '../middleware/errorHandler';
import { insertUserSchema } from '@shared/schema';

export class AuthController {
  // User registration
  static async register(req: Request, res: Response) {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        throw createConflictError('Username already exists');
      }

      const existingEmail = await storage.getUserByEmail?.(userData.email);
      if (existingEmail) {
        throw createConflictError('Email already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create user with default role
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword,
        role: userData.role || 'student'
      });

      // Initialize user stats for gamification
      await storage.createUserStats?.({
        userId: newUser.id,
        totalXP: 0,
        level: 1,
        streak: 0,
        longestStreak: 0,
        lastActivityDate: new Date(),
        coursesCompleted: 0,
        lessonsCompleted: 0,
        quizzesCompleted: 0,
        helpfulAnswers: 0
      });

      // Generate JWT token
      const token = generateToken(newUser.id);

      securityLogger.authSuccess(newUser.id, newUser.username, req.ip);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: newUser.id,
            username: newUser.username,
            fullName: newUser.fullName,
            email: newUser.email,
            role: newUser.role,
            avatar: newUser.avatar
          },
          token
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Registration error:', error);
      throw createValidationError('Registration failed');
    }
  }

  // User login
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw createValidationError('Username and password are required');
      }

      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        securityLogger.authFailure(username, req.ip, 'User not found');
        throw createAuthError('Invalid credentials');
      }

      // Check password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        securityLogger.authFailure(username, req.ip, 'Invalid password');
        throw createAuthError('Invalid credentials');
      }

      // Update last activity
      await storage.updateUserActivity?.(user.id);

      // Generate token
      const token = generateToken(user.id);

      securityLogger.authSuccess(user.id, user.username, req.ip);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            avatar: user.avatar
          },
          token
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Login error:', error);
      throw createAuthError('Login failed');
    }
  }

  // Get current user profile
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        throw createAuthError('User not found');
      }

      // Get user stats
      const userStats = await storage.getUserStats?.(user.id);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            domain: user.domain,
            branch: user.branch,
            year: user.year,
            avatar: user.avatar,
            createdAt: user.createdAt
          },
          stats: userStats
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Get profile error:', error);
      throw createAuthError('Failed to get profile');
    }
  }

  // Update user profile
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { fullName, email, domain, branch, year, avatar } = req.body;
      const userId = req.user!.id;

      // Check if email is already taken by another user
      if (email) {
        const existingUser = await storage.getUserByEmail?.(email);
        if (existingUser && existingUser.id !== userId) {
          throw createConflictError('Email already exists');
        }
      }

      const updatedUser = await storage.updateUserProfile?.({
        id: userId,
        fullName,
        email,
        domain,
        branch,
        year,
        avatar
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Update profile error:', error);
      throw createValidationError('Failed to update profile');
    }
  }

  // Change password
  static async changePassword(req: AuthRequest, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user!.id;

      if (!currentPassword || !newPassword) {
        throw createValidationError('Current password and new password are required');
      }

      // Get user
      const user = await storage.getUser(userId);
      if (!user) {
        throw createAuthError('User not found');
      }

      // Verify current password
      const isValidPassword = await comparePassword(currentPassword, user.password);
      if (!isValidPassword) {
        securityLogger.authFailure(user.username, req.ip, 'Invalid current password');
        throw createAuthError('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await storage.updateUserPassword?.(userId, hashedNewPassword);

      securityLogger.authSuccess(userId, user.username, req.ip);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Change password error:', error);
      throw createValidationError('Failed to change password');
    }
  }

  // Logout (optional - mainly for logging)
  static async logout(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      
      logger.info(`User ${userId} logged out`, { userId, ip: req.ip });

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    }
  }

  // Refresh token
  static async refreshToken(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const newToken = generateToken(userId);

      res.json({
        success: true,
        data: {
          token: newToken
        }
      });
    } catch (error) {
      logger.error('Refresh token error:', error);
      throw createAuthError('Failed to refresh token');
    }
  }

  // Get user dashboard data
  static async getDashboard(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // Get user stats
      const userStats = await storage.getUserStats?.(userId);
      
      // Get recent activity based on role
      let dashboardData: any = {
        userStats,
        recentActivity: []
      };

      if (userRole === 'student') {
        // Student dashboard data
        const enrolledCourses = await storage.getUserEnrolledCourses?.(userId);
        const recentQuizzes = await storage.getUserRecentQuizzes?.(userId);
        const upcomingAssignments = await storage.getUserUpcomingAssignments?.(userId);

        dashboardData.enrolledCourses = enrolledCourses;
        dashboardData.recentQuizzes = recentQuizzes;
        dashboardData.upcomingAssignments = upcomingAssignments;
      } else if (userRole === 'instructor') {
        // Instructor dashboard data
        const createdCourses = await storage.getInstructorCourses?.(userId);
        const recentStudents = await storage.getInstructorRecentStudents?.(userId);
        const pendingAssignments = await storage.getInstructorPendingAssignments?.(userId);

        dashboardData.createdCourses = createdCourses;
        dashboardData.recentStudents = recentStudents;
        dashboardData.pendingAssignments = pendingAssignments;
      }

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      logger.error('Get dashboard error:', error);
      throw createValidationError('Failed to get dashboard data');
    }
  }
}