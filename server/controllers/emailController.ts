import { Request, Response } from 'express';
import { AuthStorage } from '../storage/authStorage';
import { logger } from '../utils/logger';
import { ERROR_CODES } from '../utils/errors';

export class EmailController {
  // Verify email address
  static async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Verification token is required',
          code: ERROR_CODES.VALIDATION_ERROR
        });
        return;
      }

      // Find and verify email verification token
      const tokenData = await AuthStorage.findEmailVerificationToken(token);
      if (!tokenData) {
        res.status(400).json({
          success: false,
          error: 'Invalid or expired verification token',
          code: ERROR_CODES.INVALID_TOKEN
        });
        return;
      }

      // Get user to check current verification status
      const user = await AuthStorage.getUserById(tokenData.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
          code: ERROR_CODES.INVALID_TOKEN
        });
        return;
      }

      if (user.emailVerifiedAt) {
        // Email already verified
        res.json({
          success: true,
          message: 'Email has already been verified',
          data: { alreadyVerified: true }
        });
        return;
      }

      // Mark email as verified
      await AuthStorage.verifyUserEmail(tokenData.userId);
      
      // Delete used verification token
      await AuthStorage.deleteEmailVerificationToken(token);
      
      logger.info('Email verification successful', { userId: tokenData.userId, email: user.email });
      
      res.json({
        success: true,
        message: 'Email verified successfully! You can now access all features.',
        data: { verified: true }
      });
    } catch (error) {
      logger.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Email verification failed'
      });
    }
  }

  // Resend verification email
  static async resendVerification(req: Request, res: Response): Promise<void> {
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
      
      // Check if user exists
      const user = await AuthStorage.getUserByEmail(normalizedEmail);
      if (!user) {
        // For security, don't reveal if user exists
        res.json({
          success: true,
          message: 'If an account with that email exists and is unverified, a verification email has been sent'
        });
        return;
      }

      if (user.emailVerifiedAt) {
        res.json({
          success: true,
          message: 'Email is already verified'
        });
        return;
      }

      // Generate new verification token
      const { generateSecureToken } = await import('../utils/auth');
      const { sendVerificationEmail } = await import('../utils/email');
      
      const emailToken = generateSecureToken();
      
      // Store email verification token (expires in 24 hours)
      await AuthStorage.createEmailVerificationToken({
        userId: user.id,
        token: emailToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      
      const emailSent = await sendVerificationEmail(user.email, user.name, emailToken);
      
      if (!emailSent) {
        logger.warn('Resend verification email failed', { email: user.email });
      }
      
      logger.info('Verification email resent', { userId: user.id, email: user.email, sent: emailSent });
      
      res.json({
        success: true,
        message: 'Verification email has been sent'
      });
    } catch (error) {
      logger.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resend verification email'
      });
    }
  }
}