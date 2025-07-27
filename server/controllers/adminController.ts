import { Request, Response } from 'express';
import { storage } from '../storage';
import { AuthRequest } from '../middleware/auth';
import { securityLogger, logger } from '../utils/logger';
import { createValidationError, createAuthError, AppError } from '../middleware/errorHandler';

export class AdminController {
  // Get all pending instructors
  static async getPendingInstructors(req: AuthRequest, res: Response) {
    try {
      const pendingInstructors = await storage.getPendingInstructors?.() || [];
      
      res.json({
        success: true,
        data: {
          instructors: pendingInstructors.map(instructor => ({
            id: instructor.id,
            username: instructor.username,
            fullName: instructor.fullName,
            email: instructor.email,
            bio: instructor.bio,
            expertiseAreas: instructor.expertiseAreas,
            qualifications: instructor.qualifications,
            teachingExperience: instructor.teachingExperience,
            linkedinProfile: instructor.linkedinProfile,
            personalWebsite: instructor.personalWebsite,
            credentialsUrl: instructor.credentialsUrl,
            instructorStatus: instructor.instructorStatus,
            createdAt: instructor.createdAt
          }))
        }
      });
    } catch (error) {
      logger.error('Get pending instructors error:', error);
      throw createValidationError('Failed to fetch pending instructors');
    }
  }

  // Get all instructors with any status
  static async getAllInstructors(req: AuthRequest, res: Response) {
    try {
      const instructors = await storage.getAllInstructors?.() || [];
      
      res.json({
        success: true,
        data: {
          instructors: instructors.map(instructor => ({
            id: instructor.id,
            username: instructor.username,
            fullName: instructor.fullName,
            email: instructor.email,
            bio: instructor.bio,
            expertiseAreas: instructor.expertiseAreas,
            qualifications: instructor.qualifications,
            teachingExperience: instructor.teachingExperience,
            linkedinProfile: instructor.linkedinProfile,
            personalWebsite: instructor.personalWebsite,
            credentialsUrl: instructor.credentialsUrl,
            instructorStatus: instructor.instructorStatus,
            verificationDate: instructor.verificationDate,
            createdAt: instructor.createdAt
          }))
        }
      });
    } catch (error) {
      logger.error('Get all instructors error:', error);
      throw createValidationError('Failed to fetch instructors');
    }
  }

  // Approve instructor
  static async approveInstructor(req: AuthRequest, res: Response) {
    try {
      const { instructorId } = req.params;
      
      if (!instructorId) {
        throw createValidationError('Instructor ID is required');
      }

      // Get instructor details
      const instructor = await storage.getUser(parseInt(instructorId));
      if (!instructor) {
        throw createValidationError('Instructor not found');
      }

      if (instructor.role !== 'instructor') {
        throw createValidationError('User is not an instructor');
      }

      // Update instructor status
      const updatedInstructor = await storage.updateUser?.(parseInt(instructorId), {
        instructorStatus: 'approved',
        verificationDate: new Date()
      });

      if (!updatedInstructor) {
        throw createValidationError('Failed to approve instructor');
      }

      securityLogger.authSuccess(req.user!.id, req.user!.username, req.ip || 'unknown');
      logger.info(`Admin ${req.user!.id} approved instructor ${instructorId}`, {
        adminId: req.user!.id,
        instructorId: parseInt(instructorId),
        instructorEmail: instructor.email
      });

      res.json({
        success: true,
        message: 'Instructor approved successfully',
        data: {
          instructor: {
            id: updatedInstructor.id,
            username: updatedInstructor.username,
            fullName: updatedInstructor.fullName,
            email: updatedInstructor.email,
            instructorStatus: updatedInstructor.instructorStatus,
            verificationDate: updatedInstructor.verificationDate
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Approve instructor error:', error);
      throw createValidationError('Failed to approve instructor');
    }
  }

  // Reject instructor
  static async rejectInstructor(req: AuthRequest, res: Response) {
    try {
      const { instructorId } = req.params;
      const { reason } = req.body;
      
      if (!instructorId) {
        throw createValidationError('Instructor ID is required');
      }

      // Get instructor details
      const instructor = await storage.getUser(parseInt(instructorId));
      if (!instructor) {
        throw createValidationError('Instructor not found');
      }

      if (instructor.role !== 'instructor') {
        throw createValidationError('User is not an instructor');
      }

      // Update instructor status
      const updatedInstructor = await storage.updateUser?.(parseInt(instructorId), {
        instructorStatus: 'rejected'
      });

      if (!updatedInstructor) {
        throw createValidationError('Failed to reject instructor');
      }

      logger.info(`Admin ${req.user!.id} rejected instructor ${instructorId}`, {
        adminId: req.user!.id,
        instructorId: parseInt(instructorId),
        instructorEmail: instructor.email,
        reason: reason || 'No reason provided'
      });

      res.json({
        success: true,
        message: 'Instructor rejected successfully',
        data: {
          instructor: {
            id: updatedInstructor.id,
            username: updatedInstructor.username,
            fullName: updatedInstructor.fullName,
            email: updatedInstructor.email,
            instructorStatus: updatedInstructor.instructorStatus
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Reject instructor error:', error);
      throw createValidationError('Failed to reject instructor');
    }
  }

  // Get platform statistics
  static async getPlatformStats(req: AuthRequest, res: Response) {
    try {
      const stats = await storage.getPlatformStats?.() || {
        totalUsers: 0,
        totalStudents: 0,
        totalInstructors: 0,
        pendingInstructors: 0,
        approvedInstructors: 0,
        totalCourses: 0,
        totalEnrollments: 0
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Get platform stats error:', error);
      throw createValidationError('Failed to fetch platform statistics');
    }
  }

  // Reset instructor status (for re-review)
  static async resetInstructorStatus(req: AuthRequest, res: Response) {
    try {
      const { instructorId } = req.params;
      
      if (!instructorId) {
        throw createValidationError('Instructor ID is required');
      }

      // Get instructor details
      const instructor = await storage.getUser(parseInt(instructorId));
      if (!instructor) {
        throw createValidationError('Instructor not found');
      }

      if (instructor.role !== 'instructor') {
        throw createValidationError('User is not an instructor');
      }

      // Reset to pending status
      const updatedInstructor = await storage.updateUser?.(parseInt(instructorId), {
        instructorStatus: 'pending',
        verificationDate: null
      });

      if (!updatedInstructor) {
        throw createValidationError('Failed to reset instructor status');
      }

      logger.info(`Admin ${req.user!.id} reset instructor status for ${instructorId}`, {
        adminId: req.user!.id,
        instructorId: parseInt(instructorId),
        instructorEmail: instructor.email
      });

      res.json({
        success: true,
        message: 'Instructor status reset to pending',
        data: {
          instructor: {
            id: updatedInstructor.id,
            username: updatedInstructor.username,
            fullName: updatedInstructor.fullName,
            email: updatedInstructor.email,
            instructorStatus: updatedInstructor.instructorStatus
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Reset instructor status error:', error);
      throw createValidationError('Failed to reset instructor status');
    }
  }
}