import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthStorage } from '../storage/authStorage';
import { hashPassword, generateAccessToken, generateRefreshToken, verifyRefreshToken, getCookieOptions, validateEmail, validatePassword, sanitizeUserData, generateSecureToken } from '../utils/auth';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import { AUTH_ERRORS, createSuccessResponse, ERROR_CODES } from '../utils/errors';
import { registerSchema, loginSchema, changePasswordSchema, updateProfileSchema } from '@shared/schema';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  // User registration with email/password
  static async register(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    const requestId = `reg-${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info(`[${requestId}] Registration request started`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      body: { ...req.body, password: '[REDACTED]' }
    });

    try {
      // Step 1: Validate request body
      logger.info(`[${requestId}] Step 1: Validating request body`);
      const validatedData = registerSchema.parse(req.body);
      const { email, password, name, role, domain, branch, year } = validatedData;
      logger.info(`[${requestId}] Request body validation successful`, {
        email,
        name,
        role: role || 'student',
        hasOptionalFields: { domain: !!domain, branch: !!branch, year: !!year }
      });

      // Step 2: Normalize email
      logger.info(`[${requestId}] Step 2: Normalizing email`);
      const normalizedEmail = email.toLowerCase().trim();
      logger.info(`[${requestId}] Email normalized: ${email} -> ${normalizedEmail}`);

      // Step 3: Validate email format
      logger.info(`[${requestId}] Step 3: Validating email format`);
      if (!validateEmail(normalizedEmail)) {
        logger.warn(`[${requestId}] Email validation failed for: ${normalizedEmail}`);
        res.status(400).json({
          success: false,
          error: 'Invalid email format',
          code: ERROR_CODES.INVALID_EMAIL
        });
        return;
      }
      logger.info(`[${requestId}] Email format validation passed`);

      // Step 4: Validate password strength
      logger.info(`[${requestId}] Step 4: Validating password strength`);
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        logger.warn(`[${requestId}] Password validation failed`, {
          errors: passwordValidation.errors
        });
        res.status(400).json(AUTH_ERRORS.weakPassword(passwordValidation.errors));
        return;
      }
      logger.info(`[${requestId}] Password validation passed`);

      // Step 5: Check if user already exists
      logger.info(`[${requestId}] Step 5: Checking for existing user`);
      const existingUser = await AuthStorage.getUserByEmail(normalizedEmail);
      if (existingUser) {
        logger.warn(`[${requestId}] Registration failed - user already exists`, {
          email: normalizedEmail,
          existingUserId: existingUser.id
        });
        res.status(409).json(AUTH_ERRORS.emailExists());
        return;
      }
      logger.info(`[${requestId}] No existing user found - proceeding with registration`);

      // Step 6: Hash password
      logger.info(`[${requestId}] Step 6: Hashing password`);
      const hashStartTime = Date.now();
      const passwordHash = await hashPassword(password);
      const hashDuration = Date.now() - hashStartTime;
      logger.info(`[${requestId}] Password hashed successfully (${hashDuration}ms)`);

      // Step 7: Create user in database
      logger.info(`[${requestId}] Step 7: Creating user in database`);
      const dbStartTime = Date.now();
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
      const dbDuration = Date.now() - dbStartTime;
      logger.info(`[${requestId}] User created successfully in database (${dbDuration}ms)`, {
        userId: user.id,
        email: user.email,
        role: user.role
      });

      // Step 8: Generate tokens
      logger.info(`[${requestId}] Step 8: Generating authentication tokens`);
      const tokenStartTime = Date.now();
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const { token: refreshToken, jti } = generateRefreshToken(user.id);
      const tokenDuration = Date.now() - tokenStartTime;
      logger.info(`[${requestId}] Tokens generated successfully (${tokenDuration}ms)`, {
        accessTokenLength: accessToken.length,
        refreshTokenJti: jti
      });

      // Step 9: Store refresh token in database
      logger.info(`[${requestId}] Step 9: Storing refresh token in database`);
      const refreshStartTime = Date.now();
      await AuthStorage.createRefreshToken({
        userId: user.id,
        jti,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: req.get('User-Agent') || null,
        ipAddress: req.ip || null
      });
      const refreshDuration = Date.now() - refreshStartTime;
      logger.info(`[${requestId}] Refresh token stored successfully (${refreshDuration}ms)`);

      // Step 10: Set refresh token cookie
      logger.info(`[${requestId}] Step 10: Setting refresh token cookie`);
      res.cookie('refreshToken', refreshToken, getCookieOptions());
      logger.info(`[${requestId}] Refresh token cookie set`);

      // Step 11: Send email verification
      logger.info(`[${requestId}] Step 11: Sending email verification`);
      const emailStartTime = Date.now();
      const emailToken = generateSecureToken();
      
      // Store email verification token (expires in 24 hours)
      await AuthStorage.createEmailVerificationToken({
        userId: user.id,
        token: emailToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      
      // Handle local email system response (can be boolean or EmailResult object)
      const emailResult = await sendVerificationEmail(user.email, user.name, emailToken);
      const emailDuration = Date.now() - emailStartTime;
      
      // Extract success status from result (handle both boolean and object responses)
      const emailSent = typeof emailResult === 'boolean' ? emailResult : emailResult.success;
      const testData = typeof emailResult === 'object' && emailResult.testData ? emailResult.testData : undefined;
      
      if (!emailSent) {
        logger.warn(`[${requestId}] Email verification failed to send`, { email: user.email });
      }
      
      logger.info(`[${requestId}] Email verification ${emailSent ? 'sent' : 'failed'} (${emailDuration}ms)`, {
        hasTestData: !!testData
      });

      // Step 12: Send successful response
      const totalDuration = Date.now() - startTime;
      logger.info(`[${requestId}] Registration completed successfully`, {
        userId: user.id,
        email: user.email,
        emailVerificationSent: emailSent,
        totalDurationMs: totalDuration,
        performance: {
          validation: 'N/A',
          passwordHashing: `${hashDuration}ms`,
          databaseInsert: `${dbDuration}ms`,
          tokenGeneration: `${tokenDuration}ms`,
          refreshTokenStorage: `${refreshDuration}ms`,
          emailSending: `${emailDuration}ms`
        }
      });

      // Build response data
      const responseData: any = {
        user: sanitizeUserData(user),
        accessToken,
        emailVerificationSent: emailSent
      };
      
      // Include test data in non-production environments for debugging
      if (testData && process.env.NODE_ENV !== 'production') {
        responseData.testData = testData;
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email to verify your account.',
        data: responseData
      });
    } catch (error) {
      const totalDuration = Date.now() - startTime;
      logger.error(`[${requestId}] Registration failed after ${totalDuration}ms`, {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          logger.warn(`[${requestId}] Database constraint violation - duplicate user`, { error: error.message });
          res.status(409).json({
            success: false,
            error: 'An account with this email already exists'
          });
          return;
        }
        
        if (error.message.includes('validation')) {
          logger.warn(`[${requestId}] Schema validation error`, { error: error.message });
          res.status(400).json({
            success: false,
            error: 'Invalid registration data provided'
          });
          return;
        }
      }
      
      res.status(500).json({
        success: false,
        error: 'Registration failed due to internal server error'
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
    logger.info('Google OAuth redirect initiated', {
      callbackUrl: process.env.OAUTH_CALLBACK_URL,
      clientId: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` : 'NOT SET'
    });
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

        // Redirect to frontend Google OAuth success page
        res.redirect(`${process.env.FRONTEND_URL}/auth/google-success`);
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

  // Forgot password - request reset email
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      
      if (!email) {
        res.status(400).json({
          success: false,
          error: 'Email is required',
          code: ERROR_CODES.VALIDATION_ERROR
        });
        return;
      }

      const normalizedEmail = email.toLowerCase().trim();
      
      if (!validateEmail(normalizedEmail)) {
        res.status(400).json({
          success: false,
          error: 'Invalid email format',
          code: ERROR_CODES.INVALID_EMAIL
        });
        return;
      }

      // Check if user exists (but don't reveal this for security)
      const user = await AuthStorage.getUserByEmail(normalizedEmail);
      let testData: any = undefined; // Declare testData at function scope
      
      if (user && user.passwordHash) {
        // Generate reset token
        const resetToken = generateSecureToken();
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        
        // Store reset token
        await AuthStorage.createPasswordResetToken({
          userId: user.id,
          token: resetToken,
          expiresAt
        });
        
        // Send password reset email using local testing system
        const emailResult = await sendPasswordResetEmail(user.email, user.name, resetToken);
        
        // Extract success status from result (handle both boolean and object responses)
        const emailSent = typeof emailResult === 'boolean' ? emailResult : emailResult.success;
        testData = typeof emailResult === 'object' && emailResult.testData ? emailResult.testData : undefined;
        
        logger.info('Password reset requested', { 
          userId: user.id, 
          email: user.email, 
          emailSent,
          hasTestData: !!testData
        });
        
        if (!emailSent) {
          logger.warn('Password reset email failed to send', { email: user.email });
        }
      }
      
      // Always return success to prevent user enumeration
      // In testing environments, include test data for easier debugging
      const responseData: any = {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      };
      
      // Include test data in non-production environments for debugging (if user exists)
      if (user && testData && process.env.NODE_ENV !== 'production') {
        responseData.testData = testData;
      }
      
      res.json(responseData);
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process password reset request'
      });
    }
  }

  // Reset password with token
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        res.status(400).json({
          success: false,
          error: 'Reset token and new password are required'
        });
        return;
      }

      // Validate new password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        res.status(400).json(AUTH_ERRORS.weakPassword(passwordValidation.errors));
        return;
      }

      // Find and verify reset token
      const resetRecord = await AuthStorage.findPasswordResetToken(token);
      if (!resetRecord || resetRecord.expiresAt < new Date()) {
        res.status(400).json({
          success: false,
          error: 'Invalid or expired reset token',
          code: ERROR_CODES.INVALID_TOKEN
        });
        return;
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);
      
      // Update password
      await AuthStorage.updatePassword(resetRecord.userId, newPasswordHash);
      
      // Delete used reset token
      await AuthStorage.deletePasswordResetToken(token);
      
      // Revoke all existing refresh tokens for security
      await AuthStorage.revokeAllUserRefreshTokens(resetRecord.userId);
      
      logger.info('Password reset successful', { userId: resetRecord.userId });
      
      res.json({
        success: true,
        message: 'Password has been reset successfully. Please log in with your new password.'
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reset password'
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