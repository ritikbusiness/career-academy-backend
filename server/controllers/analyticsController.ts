import { Request, Response } from 'express';
import { storage } from '../storage';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { createValidationError, createNotFoundError, createForbiddenError, AppError } from '../middleware/errorHandler';
import { getStartOfWeek, getEndOfWeek, getStartOfMonth, getEndOfMonth } from '../utils/helpers';

export class AnalyticsController {
  // Get user learning analytics
  static async getUserAnalytics(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { startDate, endDate, activityType } = req.query;

      const filters: any = {};
      
      if (startDate) {
        filters.startDate = new Date(startDate as string);
      }
      
      if (endDate) {
        filters.endDate = new Date(endDate as string);
      }

      if (activityType) {
        filters.activityType = activityType;
      }

      const analytics = await storage.getUserLearningAnalytics!(userId, filters);

      // Process analytics data
      const processedData = AnalyticsController.processUserAnalytics(analytics);

      res.json({
        success: true,
        data: {
          analytics: processedData,
          totalActivities: analytics.length,
          period: {
            startDate: filters.startDate,
            endDate: filters.endDate
          }
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Get user analytics error:', error);
      throw createValidationError('Failed to fetch user analytics');
    }
  }

  // Get course analytics (instructor/admin only)
  static async getCourseAnalytics(req: AuthRequest, res: Response) {
    try {
      const courseId = parseInt(req.params.courseId);
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

      const analytics = await storage.getCourseLearningAnalytics!(courseId);

      // Process course analytics
      const processedData = AnalyticsController.processCourseAnalytics(analytics);

      res.json({
        success: true,
        data: {
          course: {
            id: course.id,
            title: course.title,
            instructorId: course.instructorId
          },
          analytics: processedData,
          totalActivities: analytics.length
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Get course analytics error:', error);
      throw createValidationError('Failed to fetch course analytics');
    }
  }

  // Get dashboard analytics summary
  static async getDashboardAnalytics(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // Get current week and month ranges
      const weekStart = getStartOfWeek();
      const weekEnd = getEndOfWeek();
      const monthStart = getStartOfMonth();
      const monthEnd = getEndOfMonth();

      let dashboardData: any = {};

      if (userRole === 'student') {
        // Student dashboard analytics
        const weeklyAnalytics = await storage.getUserLearningAnalytics!(userId, {
          startDate: weekStart,
          endDate: weekEnd
        });

        const monthlyAnalytics = await storage.getUserLearningAnalytics!(userId, {
          startDate: monthStart,
          endDate: monthEnd
        });

        dashboardData = {
          thisWeek: {
            totalActivities: weeklyAnalytics.length,
            lessonsViewed: weeklyAnalytics.filter(a => a.activityType === 'lesson_view').length,
            lessonsCompleted: weeklyAnalytics.filter(a => a.activityType === 'lesson_complete').length,
            quizAttempts: weeklyAnalytics.filter(a => a.activityType === 'quiz_attempt').length,
            studyTime: weeklyAnalytics.reduce((sum, a) => sum + (a.duration || 0), 0)
          },
          thisMonth: {
            totalActivities: monthlyAnalytics.length,
            lessonsViewed: monthlyAnalytics.filter(a => a.activityType === 'lesson_view').length,
            lessonsCompleted: monthlyAnalytics.filter(a => a.activityType === 'lesson_complete').length,
            quizAttempts: monthlyAnalytics.filter(a => a.activityType === 'quiz_attempt').length,
            studyTime: monthlyAnalytics.reduce((sum, a) => sum + (a.duration || 0), 0)
          }
        };

        // Get user stats for additional context
        const userStats = await storage.getUserStats!(userId);
        if (userStats) {
          dashboardData.overall = {
            totalXP: userStats.totalXP,
            level: userStats.level,
            streak: userStats.streak,
            coursesCompleted: userStats.coursesCompleted,
            lessonsCompleted: userStats.lessonsCompleted,
            quizzesCompleted: userStats.quizzesCompleted
          };
        }

      } else if (userRole === 'instructor') {
        // Instructor dashboard analytics
        const instructorCourses = await storage.getInstructorCourses!(userId);
        const courseIds = instructorCourses.map(c => c.id);

        // Aggregate analytics across all instructor courses
        let totalStudents = 0;
        let totalLessonViews = 0;
        let totalCompletions = 0;

        for (const courseId of courseIds) {
          const courseAnalytics = await storage.getCourseLearningAnalytics!(courseId, {
            startDate: monthStart,
            endDate: monthEnd
          });

          totalLessonViews += courseAnalytics.filter(a => a.activityType === 'lesson_view').length;
          totalCompletions += courseAnalytics.filter(a => a.activityType === 'lesson_complete').length;
          
          // Count unique students per course
          const uniqueStudents = new Set(courseAnalytics.map(a => a.userId)).size;
          totalStudents += uniqueStudents;
        }

        dashboardData = {
          courses: {
            total: instructorCourses.length,
            totalStudents,
            thisMonth: {
              lessonViews: totalLessonViews,
              completions: totalCompletions,
              engagementRate: totalLessonViews > 0 ? (totalCompletions / totalLessonViews * 100).toFixed(1) : 0
            }
          }
        };

      } else if (userRole === 'admin') {
        // Admin dashboard analytics
        dashboardData = {
          systemOverview: {
            message: 'Admin analytics would show system-wide metrics'
          }
        };
      }

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      logger.error('Get dashboard analytics error:', error);
      throw createValidationError('Failed to fetch dashboard analytics');
    }
  }

  // Record learning activity
  static async recordActivity(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { 
        courseId, 
        lessonId, 
        activityType, 
        duration, 
        progress, 
        metadata 
      } = req.body;

      if (!activityType) {
        throw createValidationError('Activity type is required');
      }

      const activity = {
        userId,
        courseId: courseId ? parseInt(courseId) : undefined,
        lessonId: lessonId ? parseInt(lessonId) : undefined,
        activityType,
        duration: duration ? parseInt(duration) : undefined,
        progress: progress ? parseFloat(progress) : undefined,
        metadata: metadata || {},
        createdAt: new Date()
      };

      await storage.recordLearningActivity!(activity);

      // Update user activity timestamp for streak calculation
      await storage.updateUserActivity!(userId);

      res.json({
        success: true,
        message: 'Activity recorded successfully',
        data: { activity }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Record activity error:', error);
      throw createValidationError('Failed to record activity');
    }
  }

  // Get learning progress report
  static async getProgressReport(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { courseId, period = 'month' } = req.query;

      let startDate: Date;
      let endDate: Date = new Date();

      // Set date range based on period
      switch (period) {
        case 'week':
          startDate = getStartOfWeek();
          break;
        case 'month':
          startDate = getStartOfMonth();
          break;
        case 'year':
          startDate = new Date(endDate.getFullYear(), 0, 1);
          break;
        default:
          startDate = getStartOfMonth();
      }

      const filters: any = { startDate, endDate };
      if (courseId) {
        filters.courseId = parseInt(courseId as string);
      }

      const analytics = await storage.getUserLearningAnalytics!(userId, filters);

      // Generate progress report
      const report = AnalyticsController.generateProgressReport(analytics, period as string);

      res.json({
        success: true,
        data: {
          report,
          period,
          dateRange: { startDate, endDate }
        }
      });
    } catch (error) {
      logger.error('Get progress report error:', error);
      throw createValidationError('Failed to generate progress report');
    }
  }

  // Get learning streaks and patterns
  static async getLearningPatterns(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { days = 30 } = req.query;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days as string));

      const analytics = await storage.getUserLearningAnalytics!(userId, {
        startDate,
        endDate: new Date()
      });

      // Analyze learning patterns
      const patterns = AnalyticsController.analyzeLearningPatterns(analytics);

      res.json({
        success: true,
        data: {
          patterns,
          analysisRange: {
            days: parseInt(days as string),
            startDate,
            endDate: new Date()
          }
        }
      });
    } catch (error) {
      logger.error('Get learning patterns error:', error);
      throw createValidationError('Failed to analyze learning patterns');
    }
  }

  // Helper methods for processing analytics data
  private static processUserAnalytics(analytics: any[]) {
    const byDay: { [key: string]: any } = {};
    const byActivityType: { [key: string]: number } = {};
    let totalStudyTime = 0;

    analytics.forEach(activity => {
      const day = activity.createdAt.toISOString().split('T')[0];
      
      if (!byDay[day]) {
        byDay[day] = {
          date: day,
          activities: 0,
          studyTime: 0,
          lessonsViewed: 0,
          lessonsCompleted: 0,
          quizAttempts: 0
        };
      }

      byDay[day].activities++;
      if (activity.duration) {
        byDay[day].studyTime += activity.duration;
        totalStudyTime += activity.duration;
      }

      if (activity.activityType === 'lesson_view') {
        byDay[day].lessonsViewed++;
      } else if (activity.activityType === 'lesson_complete') {
        byDay[day].lessonsCompleted++;
      } else if (activity.activityType === 'quiz_attempt') {
        byDay[day].quizAttempts++;
      }

      byActivityType[activity.activityType] = (byActivityType[activity.activityType] || 0) + 1;
    });

    return {
      dailyActivity: Object.values(byDay),
      activityBreakdown: byActivityType,
      totalStudyTime,
      averageDailyActivity: analytics.length / Object.keys(byDay).length || 0
    };
  }

  private static processCourseAnalytics(analytics: any[]) {
    const uniqueUsers = new Set(analytics.map(a => a.userId)).size;
    const totalViews = analytics.filter(a => a.activityType === 'lesson_view').length;
    const totalCompletions = analytics.filter(a => a.activityType === 'lesson_complete').length;
    
    const engagementRate = totalViews > 0 ? (totalCompletions / totalViews * 100) : 0;

    const userActivity: { [key: number]: any } = {};
    analytics.forEach(activity => {
      if (!userActivity[activity.userId]) {
        userActivity[activity.userId] = {
          userId: activity.userId,
          views: 0,
          completions: 0,
          lastActivity: activity.createdAt
        };
      }

      if (activity.activityType === 'lesson_view') {
        userActivity[activity.userId].views++;
      } else if (activity.activityType === 'lesson_complete') {
        userActivity[activity.userId].completions++;
      }

      if (activity.createdAt > userActivity[activity.userId].lastActivity) {
        userActivity[activity.userId].lastActivity = activity.createdAt;
      }
    });

    return {
      overview: {
        uniqueUsers,
        totalViews,
        totalCompletions,
        engagementRate: engagementRate.toFixed(1)
      },
      userActivity: Object.values(userActivity)
    };
  }

  private static generateProgressReport(analytics: any[], period: string) {
    const totalActivities = analytics.length;
    const lessonsCompleted = analytics.filter(a => a.activityType === 'lesson_complete').length;
    const quizAttempts = analytics.filter(a => a.activityType === 'quiz_attempt').length;
    const totalStudyTime = analytics.reduce((sum, a) => sum + (a.duration || 0), 0);

    return {
      summary: {
        totalActivities,
        lessonsCompleted,
        quizAttempts,
        totalStudyTime,
        averageStudyTime: totalStudyTime / Math.max(totalActivities, 1)
      },
      goals: {
        lessonsTarget: period === 'week' ? 5 : period === 'month' ? 20 : 100,
        lessonsProgress: lessonsCompleted,
        completionRate: period === 'week' ? (lessonsCompleted / 5 * 100) : 
                       period === 'month' ? (lessonsCompleted / 20 * 100) : 
                       (lessonsCompleted / 100 * 100)
      }
    };
  }

  private static analyzeLearningPatterns(analytics: any[]) {
    const hourlyActivity: { [key: number]: number } = {};
    const dailyActivity: { [key: string]: number } = {};
    
    analytics.forEach(activity => {
      const hour = activity.createdAt.getHours();
      const dayOfWeek = activity.createdAt.getDay();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
      dailyActivity[dayNames[dayOfWeek]] = (dailyActivity[dayNames[dayOfWeek]] || 0) + 1;
    });

    // Find peak learning hours and days
    const peakHour = Object.entries(hourlyActivity).reduce((a, b) => 
      hourlyActivity[parseInt(a[0])] > hourlyActivity[parseInt(b[0])] ? a : b, ['0', 0]
    );

    const peakDay = Object.entries(dailyActivity).reduce((a, b) => 
      a[1] > b[1] ? a : b, ['Monday', 0]
    );

    return {
      hourlyActivity,
      dailyActivity,
      peakLearningHour: parseInt(peakHour[0]),
      peakLearningDay: peakDay[0],
      totalSessions: analytics.length,
      averageSessionLength: analytics.reduce((sum, a) => sum + (a.duration || 0), 0) / analytics.length || 0
    };
  }
}