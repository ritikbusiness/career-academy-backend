import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthStorage } from '../storage/authStorage';
import { hashPassword, generateAccessToken, generateRefreshToken, verifyRefreshToken, getCookieOptions, validateEmail, validatePassword, sanitizeUserData } from '../utils/auth';
import { AUTH_ERRORS, createSuccessResponse, ERROR_CODES } from '../utils/errors';
import { registerSchema, loginSchema, changePasswordSchema, updateProfileSchema } from '@shared/schema';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  // User registration with email/password
  static async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = registerSchema.parse(req.body);
      const { email, password, name, role, domain, branch, year } = validatedData;

      // Normalize email
      const normalizedEmail = email.toLowerCase().trim();

      // Validate email format
      if (!validateEmail(normalizedEmail)) {
        res.status(400).json({
          success: false,
          error: 'Invalid email format',
          code: ERROR_CODES.INVALID_EMAIL
        });
        return;
      }

      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        res.status(400).json(AUTH_ERRORS.weakPassword(passwordValidation.errors));
        return;
      }

      // Check if user already exists
      const existingUser = await AuthStorage.getUserByEmail(normalizedEmail);
      if (existingUser) {
        res.status(409).json(AUTH_ERRORS.emailExists());
        return;
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const user = await AuthStorage.createUser({
        email: normalizedEmail,
        passwordHash,
        name,
        provider: 'local',
        role: role || 'student',
        domain,
        branch,
        year
      });

      logger.info('User registered successfully', { userId: user.id, email: user.email });

      // Generate tokens
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const { token: refreshToken, jti } = generateRefreshToken(user.id);

      // Store refresh token in database
      await AuthStorage.createRefreshToken({
        userId: user.id,
        jti,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: req.get('User-Agent') || null,
        ipAddress: req.ip || null
      });

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', refreshToken, getCookieOptions());

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: sanitizeUserData(user),
          accessToken
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed'
      });
    }
  }

  // User login with email/password
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body);
      
      // Use Passport local strategy
      passport.authenticate('local', { session: false }, async (err: any, user: any, info: any) => {
        if (err) {
          logger.error('Login error:', err);
          res.status(500).json({
            success: false,
            error: 'Login failed'
          });
          return;
        }

        if (!user) {
          res.status(401).json({
            success: false,
            error: info?.message || 'Invalid credentials'
          });
          return;
        }

        try {
          logger.info('User logged in successfully', { userId: user.id, email: user.email });

          // Generate tokens
          const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role
          });

          const { token: refreshToken, jti } = generateRefreshToken(user.id);

          // Store refresh token in database
          await AuthStorage.createRefreshToken({
            userId: user.id,
            jti,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            userAgent: req.get('User-Agent') || null,
            ipAddress: req.ip || null
          });

          // Set refresh token as httpOnly cookie
          res.cookie('refreshToken', refreshToken, getCookieOptions());

          res.json({
            success: true,
            message: 'Login successful',
            data: {
              user: sanitizeUserData(user),
              accessToken
            }
          });
        } catch (tokenError) {
          logger.error('Token generation error:', tokenError);
          res.status(500).json({
            success: false,
            error: 'Login failed'
          });
        }
      })(req, res, next);
    } catch (error) {
      logger.error('Login validation error:', error);
      res.status(400).json({
        success: false,
        error: 'Invalid request data'
      });
    }
  }

  // Google OAuth redirect
  static googleAuth(req: Request, res: Response, next: NextFunction): void {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account' // Force Google account selection
    })(req, res, next);
  }

  // Google OAuth callback
  static async googleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    passport.authenticate('google', { session: false }, async (err: any, user: any) => {
      if (err) {
        logger.error('Google OAuth error:', err);
        res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=google_auth_failed`);
        return;
      }

      if (!user) {
        res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=google_auth_cancelled`);
        return;
      }

      try {
        logger.info('Google OAuth successful', { userId: user.id, email: user.email });

        // Generate tokens
        const accessToken = generateAccessToken({
          userId: user.id,
          email: user.email,
          role: user.role
        });

        const { token: refreshToken, jti } = generateRefreshToken(user.id);

        // Store refresh token in database
        await AuthStorage.createRefreshToken({
          userId: user.id,
          jti,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          userAgent: req.get('User-Agent') || null,
          ipAddress: req.ip || null
        });

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, getCookieOptions());

        // Redirect to frontend with success
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${accessToken}`);
      } catch (tokenError) {
        logger.error('Google OAuth token generation error:', tokenError);
        res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=token_generation_failed`);
      }
    })(req, res, next);
  }

  // Refresh access token
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: 'No refresh token provided'
        });
        return;
      }

      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);

      // Check if refresh token exists and is valid
      const storedToken = await AuthStorage.getRefreshTokenByJti(payload.jti);
      if (!storedToken) {
        res.status(401).json({
          success: false,
          error: 'Invalid refresh token'
        });
        return;
      }

      // Get user
      const user = await AuthStorage.getUserById(payload.userId);
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Revoke old refresh token
      await AuthStorage.revokeRefreshToken(payload.jti);

      // Generate new tokens
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const { token: newRefreshToken, jti: newJti } = generateRefreshToken(user.id);

      // Store new refresh token
      await AuthStorage.createRefreshToken({
        userId: user.id,
        jti: newJti,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: req.get('User-Agent') || null,
        ipAddress: req.ip || null
      });

      // Set new refresh token as httpOnly cookie
      res.cookie('refreshToken', newRefreshToken, getCookieOptions());

      res.json({
        success: true,
        data: {
          accessToken,
          user: sanitizeUserData(user)
        }
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        error: 'Token refresh failed'
      });
    }
  }

  // Logout user
  static async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        try {
          const payload = verifyRefreshToken(refreshToken);
          await AuthStorage.revokeRefreshToken(payload.jti);
        } catch (error) {
          // Continue with logout even if token is invalid
          logger.debug('Error revoking refresh token during logout:', error);
        }
      }

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
  }

  // Get current user profile
  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
        return;
      }

      // Get fresh user data from database
      const user = await AuthStorage.getUserById(req.user.id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          user: sanitizeUserData(user)
        }
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch profile'
      });
    }
  }

  // Update user profile
  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
        return;
      }

      // Validate request body
      const validatedData = updateProfileSchema.parse(req.body);

      // Update user
      const user = await AuthStorage.updateUser(req.user.id, validatedData);

      logger.info('User profile updated', { userId: user.id });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: sanitizeUserData(user)
        }
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  }

  // Change password
  static async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
        return;
      }

      // Validate request body
      const validatedData = changePasswordSchema.parse(req.body);
      const { currentPassword, newPassword } = validatedData;

      // Get user with password hash
      const user = await AuthStorage.getUserById(req.user.id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Check if user has a password (not OAuth-only)
      if (!user.passwordHash) {
        res.status(400).json({
          success: false,
          error: 'Cannot change password for OAuth-only accounts'
        });
        return;
      }

      // Verify current password
      const { comparePassword } = await import('../utils/auth');
      const isValidPassword = await comparePassword(currentPassword, user.passwordHash);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: 'Current password is incorrect'
        });
        return;
      }

      // Validate new password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          success: false,
          error: 'New password validation failed',
          details: passwordValidation.errors
        });
        return;
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      // Update password
      await AuthStorage.updatePassword(user.id, newPasswordHash);

      // Revoke all existing refresh tokens for security
      await AuthStorage.revokeAllUserRefreshTokens(user.id);

      logger.info('User password changed', { userId: user.id });

      res.json({
        success: true,
        message: 'Password changed successfully. Please log in again.'
      });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change password'
      });
    }
  }
}