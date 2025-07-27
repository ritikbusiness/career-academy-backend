import { Request, Response } from 'express';
import { storage } from '../storage';
import { AuthRequest } from '../middleware/auth';
import { securityLogger, logger } from '../utils/logger';
import { createValidationError, createAuthError, createConflictError, AppError } from '../middleware/errorHandler';
import { createInstructorInviteSchema } from '@shared/schema';
import crypto from 'crypto';

export class InstructorInviteController {
  // Generate instructor invite (Admin only)
  static async generateInvite(req: AuthRequest, res: Response) {
    try {
      // Verify admin role
      if (req.user!.role !== 'admin') {
        throw createAuthError('Access denied: Admin role required');
      }

      const { email } = createInstructorInviteSchema.parse(req.body);
      
      // Check if user with this email already exists
      const existingUser = await storage.getUserByEmail?.(email);
      if (existingUser) {
        throw createConflictError('User with this email already exists');
      }

      // Check if there's already a pending invite for this email
      const existingInvite = await storage.getInstructorInviteByEmail?.(email);
      if (existingInvite && !existingInvite.isUsed && new Date() < existingInvite.expiresAt) {
        throw createConflictError('An active invite already exists for this email');
      }

      // Generate secure token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Set expiration to 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Create invite
      const invite = await storage.createInstructorInvite?.({
        token,
        email,
        invitedBy: req.user!.id,
        expiresAt,
        isUsed: false
      });

      if (!invite) {
        throw createValidationError('Failed to create instructor invite');
      }

      // Generate invite URL
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
      const inviteUrl = `${baseUrl}/instructor-signup?token=${token}`;

      securityLogger.authSuccess(req.user!.id, req.user!.username, req.ip || 'unknown');
      logger.info(`Admin ${req.user!.id} generated instructor invite for ${email}`, {
        adminId: req.user!.id,
        inviteEmail: email,
        token: token.substring(0, 8) + '...' // Log partial token for tracking
      });

      res.status(201).json({
        success: true,
        message: 'Instructor invite generated successfully',
        data: {
          invite: {
            id: invite.id,
            email: invite.email,
            token: invite.token,
            inviteUrl,
            expiresAt: invite.expiresAt,
            createdAt: invite.createdAt
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Generate instructor invite error:', error);
      throw createValidationError('Failed to generate instructor invite');
    }
  }

  // List all instructor invites (Admin only)
  static async listInvites(req: AuthRequest, res: Response) {
    try {
      // Verify admin role
      if (req.user!.role !== 'admin') {
        throw createAuthError('Access denied: Admin role required');
      }

      const invites = await storage.getAllInstructorInvites?.() || [];

      res.json({
        success: true,
        data: {
          invites: invites.map(invite => ({
            id: invite.id,
            email: invite.email,
            token: invite.token.substring(0, 8) + '...', // Partial token for security
            isUsed: invite.isUsed,
            usedBy: invite.usedBy,
            createdAt: invite.createdAt,
            expiresAt: invite.expiresAt,
            usedAt: invite.usedAt
          }))
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('List instructor invites error:', error);
      throw createValidationError('Failed to list instructor invites');
    }
  }

  // Revoke instructor invite (Admin only)
  static async revokeInvite(req: AuthRequest, res: Response) {
    try {
      // Verify admin role
      if (req.user!.role !== 'admin') {
        throw createAuthError('Access denied: Admin role required');
      }

      const { inviteId } = req.params;
      
      if (!inviteId) {
        throw createValidationError('Invite ID is required');
      }

      // Mark invite as expired by setting expiresAt to current time
      const success = await storage.revokeInstructorInvite?.(parseInt(inviteId));
      
      if (!success) {
        throw createValidationError('Invite not found or already revoked');
      }

      logger.info(`Admin ${req.user!.id} revoked instructor invite ${inviteId}`, {
        adminId: req.user!.id,
        inviteId
      });

      res.json({
        success: true,
        message: 'Instructor invite revoked successfully'
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Revoke instructor invite error:', error);
      throw createValidationError('Failed to revoke instructor invite');
    }
  }

  // Get invite details by token (for signup form)
  static async getInviteByToken(req: Request, res: Response) {
    try {
      const { token } = req.params;
      
      if (!token) {
        throw createValidationError('Token is required');
      }

      const invite = await storage.getInstructorInviteByToken?.(token);
      if (!invite) {
        throw createValidationError('Invalid invite token');
      }

      // Check if token is expired
      if (new Date() > invite.expiresAt) {
        throw createValidationError('Invite token has expired');
      }

      // Check if token is already used
      if (invite.isUsed) {
        throw createValidationError('Invite token has already been used');
      }

      res.json({
        success: true,
        data: {
          email: invite.email,
          expiresAt: invite.expiresAt
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Get invite by token error:', error);
      throw createValidationError('Failed to get invite details');
    }
  }
}