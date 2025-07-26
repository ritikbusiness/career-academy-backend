import { Request, Response } from 'express';
import { storage } from '../storage';
import { AuthRequest } from '../middleware/auth';
import { logger, metricsLogger } from '../utils/logger';
import { createValidationError, createNotFoundError, createForbiddenError, AppError } from '../middleware/errorHandler';
import { insertCourseSchema, insertModuleSchema, insertLessonSchema } from '@shared/schema';
import { createPaginationResult } from '../utils/helpers';

export class CourseController {
  // Get all courses with filtering
  static async getCourses(req: Request, res: Response) {
    try {
      const { page = 1, limit = 12, search, domain, level, sort = 'created', order = 'desc' } = req.query;
      
      const filters = {
        search: search as string,
        domain: domain as string,
        level: level as string
      };

      const courses = await storage.getCourses!(filters);

      // Apply pagination (in a real app, this would be done in the database)
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedCourses = courses.slice(startIndex, endIndex);

      const result = createPaginationResult(
        paginatedCourses,
        courses.length,
        { page: Number(page), limit: Number(limit), sort: sort as string, order: order as 'asc' | 'desc' }
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Get courses error:', error);
      throw createValidationError('Failed to fetch courses');
    }
  }

  // Get single course with modules and lessons
  static async getCourse(req: AuthRequest, res: Response) {
    try {
      const courseId = parseInt(req.params.id);
      
      const course = await storage.getCourse!(courseId);
      if (!course) {
        throw createNotFoundError('Course');
      }

      // Get course modules and lessons
      const modules = await storage.getCourseModules!(courseId);
      const modulesWithLessons = await Promise.all(
        modules.map(async (module) => {
          const lessons = await storage.getModuleLessons!(module.id);
          return { ...module, lessons };
        })
      );

      // Check if user is enrolled (if authenticated)
      let userEnrollment = null;
      if (req.user) {
        userEnrollment = await storage.getUserEnrollment!(req.user.id, courseId);
      }

      // Record analytics
      if (req.user) {
        await storage.recordLearningActivity!({
          userId: req.user.id,
          courseId,
          activityType: 'lesson_view',
          createdAt: new Date()
        });
      }

      res.json({
        success: true,
        data: {
          course,
          modules: modulesWithLessons,
          userEnrollment,
          isEnrolled: !!userEnrollment
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Get course error:', error);
      throw createValidationError('Failed to fetch course');
    }
  }

  // Create new course (instructors only)
  static async createCourse(req: AuthRequest, res: Response) {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const instructorId = req.user!.id;

      const newCourse = await storage.createCourse!({
        ...courseData,
        instructorId
      });

      logger.info(`Course created: ${newCourse.id} by instructor ${instructorId}`);

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: { course: newCourse }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Create course error:', error);
      throw createValidationError('Failed to create course');
    }
  }

  // Update course (instructor/admin only)
  static async updateCourse(req: AuthRequest, res: Response) {
    try {
      const courseId = parseInt(req.params.id);
      const updates = req.body;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // Check if course exists
      const course = await storage.getCourse!(courseId);
      if (!course) {
        throw createNotFoundError('Course');
      }

      // Check permissions (instructor can only update their own courses)
      if (userRole !== 'admin' && course.instructorId !== userId) {
        throw createForbiddenError('You can only update your own courses');
      }

      const updatedCourse = await storage.updateCourse!(courseId, updates);

      res.json({
        success: true,
        message: 'Course updated successfully',
        data: { course: updatedCourse }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Update course error:', error);
      throw createValidationError('Failed to update course');
    }
  }

  // Delete course (instructor/admin only)
  static async deleteCourse(req: AuthRequest, res: Response) {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // Check if course exists
      const course = await storage.getCourse!(courseId);
      if (!course) {
        throw createNotFoundError('Course');
      }

      // Check permissions
      if (userRole !== 'admin' && course.instructorId !== userId) {
        throw createForbiddenError('You can only delete your own courses');
      }

      await storage.deleteCourse!(courseId);

      res.json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Delete course error:', error);
      throw createValidationError('Failed to delete course');
    }
  }

  // Enroll in course
  static async enrollInCourse(req: AuthRequest, res: Response) {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user!.id;

      // Check if course exists
      const course = await storage.getCourse!(courseId);
      if (!course) {
        throw createNotFoundError('Course');
      }

      // Check if already enrolled
      const existingEnrollment = await storage.getUserEnrollment!(userId, courseId);
      if (existingEnrollment) {
        throw createValidationError('Already enrolled in this course');
      }

      // Create enrollment
      const enrollment = await storage.enrollInCourse!(userId, courseId);

      // Award XP for enrollment
      await storage.addXP!(userId, 10, 'Course enrollment', 'course_enrollment', courseId);

      // Log metrics
      metricsLogger.courseEnrollment(userId, courseId, Number(course.price));

      res.status(201).json({
        success: true,
        message: 'Successfully enrolled in course',
        data: { enrollment }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Enroll in course error:', error);
      throw createValidationError('Failed to enroll in course');
    }
  }

  // Get user's enrolled courses
  static async getUserCourses(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      
      const enrolledCourses = await storage.getUserEnrolledCourses!(userId);

      // Get progress for each course
      const coursesWithProgress = await Promise.all(
        enrolledCourses.map(async (course) => {
          const progress = await storage.getCourseProgress!(userId, course.id);
          return { ...course, progress };
        })
      );

      res.json({
        success: true,
        data: { courses: coursesWithProgress }
      });
    } catch (error) {
      logger.error('Get user courses error:', error);
      throw createValidationError('Failed to fetch user courses');
    }
  }

  // Get instructor's courses
  static async getInstructorCourses(req: AuthRequest, res: Response) {
    try {
      const instructorId = req.user!.id;
      
      const courses = await storage.getInstructorCourses!(instructorId);

      res.json({
        success: true,
        data: { courses }
      });
    } catch (error) {
      logger.error('Get instructor courses error:', error);
      throw createValidationError('Failed to fetch instructor courses');
    }
  }

  // Add module to course
  static async addModule(req: AuthRequest, res: Response) {
    try {
      const courseId = parseInt(req.params.courseId);
      const moduleData = insertModuleSchema.parse(req.body);
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // Check if course exists and user has permission
      const course = await storage.getCourse!(courseId);
      if (!course) {
        throw createNotFoundError('Course');
      }

      if (userRole !== 'admin' && course.instructorId !== userId) {
        throw createForbiddenError('You can only add modules to your own courses');
      }

      const newModule = await storage.createModule!({
        ...moduleData,
        courseId
      });

      res.status(201).json({
        success: true,
        message: 'Module added successfully',
        data: { module: newModule }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Add module error:', error);
      throw createValidationError('Failed to add module');
    }
  }

  // Add lesson to module
  static async addLesson(req: AuthRequest, res: Response) {
    try {
      const moduleId = parseInt(req.params.moduleId);
      const lessonData = insertLessonSchema.parse(req.body);
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // Get module and check permissions
      const modules = await storage.getCourseModules!(0); // This needs to be fixed to get specific module
      const module = modules.find(m => m.id === moduleId);
      
      if (!module) {
        throw createNotFoundError('Module');
      }

      // Check course ownership
      const course = await storage.getCourse!(module.courseId);
      if (!course) {
        throw createNotFoundError('Course');
      }

      if (userRole !== 'admin' && course.instructorId !== userId) {
        throw createForbiddenError('You can only add lessons to your own courses');
      }

      const newLesson = await storage.createLesson!({
        ...lessonData,
        moduleId
      });

      res.status(201).json({
        success: true,
        message: 'Lesson added successfully',
        data: { lesson: newLesson }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Add lesson error:', error);
      throw createValidationError('Failed to add lesson');
    }
  }

  // Mark lesson as completed
  static async completeLesson(req: AuthRequest, res: Response) {
    try {
      const { courseId, lessonId } = req.params;
      const userId = req.user!.id;

      // Check enrollment
      const enrollment = await storage.getUserEnrollment!(userId, parseInt(courseId));
      if (!enrollment) {
        throw createValidationError('Not enrolled in this course');
      }

      // Update lesson progress
      await storage.updateLessonProgress!(userId, parseInt(courseId), parseInt(lessonId));

      // Award XP for lesson completion
      await storage.addXP!(userId, 25, 'Lesson completion', 'lesson_completion', parseInt(lessonId));

      // Record analytics
      await storage.recordLearningActivity!({
        userId,
        courseId: parseInt(courseId),
        lessonId: parseInt(lessonId),
        activityType: 'lesson_complete',
        createdAt: new Date()
      });

      res.json({
        success: true,
        message: 'Lesson marked as completed'
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Complete lesson error:', error);
      throw createValidationError('Failed to complete lesson');
    }
  }

  // Get course analytics (instructor/admin only)
  static async getCourseAnalytics(req: AuthRequest, res: Response) {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // Check course ownership
      const course = await storage.getCourse!(courseId);
      if (!course) {
        throw createNotFoundError('Course');
      }

      if (userRole !== 'admin' && course.instructorId !== userId) {
        throw createForbiddenError('You can only view analytics for your own courses');
      }

      // Get analytics data
      const analytics = await storage.getCourseLearningAnalytics!(courseId);

      // Process analytics (group by activity type, calculate completion rates, etc.)
      const analyticsData = {
        totalViews: analytics.filter(a => a.activityType === 'lesson_view').length,
        totalCompletions: analytics.filter(a => a.activityType === 'lesson_complete').length,
        averageSessionTime: 0, // Calculate from analytics data
        activityByDay: {}, // Group by day
        popularLessons: [] // Most viewed lessons
      };

      res.json({
        success: true,
        data: { analytics: analyticsData }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Get course analytics error:', error);
      throw createValidationError('Failed to fetch course analytics');
    }
  }
}