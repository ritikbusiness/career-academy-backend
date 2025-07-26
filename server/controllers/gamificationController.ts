import { Request, Response } from 'express';
import { storage } from '../storage';
import { AuthRequest } from '../middleware/auth';
import { logger, metricsLogger } from '../utils/logger';
import { createValidationError, createNotFoundError, AppError } from '../middleware/errorHandler';
import { calculateLevelFromXP, calculateXPToNextLevel, calculateLearningStreak } from '../utils/helpers';

export class GamificationController {
  // Get user's gamification stats
  static async getUserStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      
      const userStats = await storage.getUserStats!(userId);
      if (!userStats) {
        throw createNotFoundError('User stats');
      }

      // Calculate derived values
      const currentLevel = calculateLevelFromXP(userStats.totalXP);
      const xpToNextLevel = calculateXPToNextLevel(userStats.totalXP);
      const currentStreak = calculateLearningStreak(userStats.lastActivityDate);

      // Get achievements
      const achievements = await storage.getUserAchievements!(userId);

      res.json({
        success: true,
        data: {
          stats: {
            ...userStats,
            currentLevel,
            xpToNextLevel,
            currentStreak,
            achievementCount: achievements.length
          },
          achievements
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Get user stats error:', error);
      throw createValidationError('Failed to fetch user stats');
    }
  }

  // Get global leaderboard
  static async getLeaderboard(req: Request, res: Response) {
    try {
      const { category = 'overall', limit = 10, period = 'all-time' } = req.query;
      
      const leaderboard = await storage.getLeaderboard!(
        category as string, 
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: {
          leaderboard,
          category,
          period
        }
      });
    } catch (error) {
      logger.error('Get leaderboard error:', error);
      throw createValidationError('Failed to fetch leaderboard');
    }
  }

  // Award XP manually (admin only)
  static async awardXP(req: AuthRequest, res: Response) {
    try {
      const { userId, amount, reason } = req.body;
      
      if (!userId || !amount || !reason) {
        throw createValidationError('User ID, amount, and reason are required');
      }

      await storage.addXP!(userId, amount, reason, 'manual_award');

      // Log the XP award
      metricsLogger.xpEarned(userId, amount, reason);

      // Check for level up and achievements
      const userStats = await storage.getUserStats!(userId);
      if (userStats) {
        const newLevel = calculateLevelFromXP(userStats.totalXP);
        const oldLevel = userStats.level;
        
        if (newLevel > oldLevel) {
          // Update level
          await storage.updateUserStats!(userId, { level: newLevel });
          
          // Check for level-based achievements
          await GamificationController.checkLevelAchievements(userId, newLevel);
        }
      }

      res.json({
        success: true,
        message: `Awarded ${amount} XP to user ${userId}`,
        data: { userId, amount, reason }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Award XP error:', error);
      throw createValidationError('Failed to award XP');
    }
  }

  // Update learning streak
  static async updateLearningStreak(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      
      const userStats = await storage.getUserStats!(userId);
      if (!userStats) {
        throw createNotFoundError('User stats');
      }

      const today = new Date();
      const lastActivity = userStats.lastActivityDate;
      
      let newStreak = userStats.streak;
      let streakBonus = 0;

      // Check if streak should continue or reset
      if (lastActivity) {
        const daysSinceLastActivity = Math.floor(
          (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastActivity === 1) {
          // Continue streak
          newStreak = userStats.streak + 1;
          streakBonus = Math.min(newStreak * 2, 50); // Max 50 XP bonus
        } else if (daysSinceLastActivity > 1) {
          // Reset streak
          newStreak = 1;
        }
        // If daysSinceLastActivity === 0, no change (same day activity)
      } else {
        // First activity
        newStreak = 1;
      }

      // Update stats
      const updates: any = {
        streak: newStreak,
        lastActivityDate: today
      };

      if (newStreak > userStats.longestStreak) {
        updates.longestStreak = newStreak;
      }

      await storage.updateUserStats!(userId, updates);

      // Award streak bonus XP
      if (streakBonus > 0) {
        await storage.addXP!(
          userId, 
          streakBonus, 
          `Learning streak bonus (${newStreak} days)`, 
          'streak_bonus'
        );
      }

      // Check for streak achievements
      await GamificationController.checkStreakAchievements(userId, newStreak);

      res.json({
        success: true,
        message: 'Learning streak updated',
        data: {
          newStreak,
          streakBonus,
          longestStreak: updates.longestStreak || userStats.longestStreak
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Update learning streak error:', error);
      throw createValidationError('Failed to update learning streak');
    }
  }

  // Get available achievements
  static async getAvailableAchievements(req: Request, res: Response) {
    try {
      // This would get all achievements from the database
      // For now, return predefined achievements
      const achievements = [
        {
          id: 1,
          name: 'First Steps',
          description: 'Complete your first lesson',
          icon: '🎯',
          xpReward: 50,
          category: 'learning',
          rarity: 'common',
          requirements: { lessonsCompleted: 1 }
        },
        {
          id: 2,
          name: 'Knowledge Seeker',
          description: 'Complete 10 lessons',
          icon: '📚',
          xpReward: 200,
          category: 'learning',
          rarity: 'rare',
          requirements: { lessonsCompleted: 10 }
        },
        {
          id: 3,
          name: 'Streak Master',
          description: 'Maintain a 7-day learning streak',
          icon: '🔥',
          xpReward: 300,
          category: 'streak',
          rarity: 'epic',
          requirements: { streak: 7 }
        },
        {
          id: 4,
          name: 'Helper',
          description: 'Get 5 helpful answer ratings',
          icon: '🤝',
          xpReward: 250,
          category: 'social',
          rarity: 'rare',
          requirements: { helpfulAnswers: 5 }
        },
        {
          id: 5,
          name: 'Graduate',
          description: 'Complete your first course',
          icon: '🎓',
          xpReward: 500,
          category: 'milestone',
          rarity: 'epic',
          requirements: { coursesCompleted: 1 }
        },
        {
          id: 6,
          name: 'Quiz Master',
          description: 'Pass 20 quizzes',
          icon: '🧠',
          xpReward: 400,
          category: 'learning',
          rarity: 'epic',
          requirements: { quizzesCompleted: 20 }
        },
        {
          id: 7,
          name: 'Level 10',
          description: 'Reach level 10',
          icon: '⭐',
          xpReward: 1000,
          category: 'milestone',
          rarity: 'legendary',
          requirements: { level: 10 }
        }
      ];

      res.json({
        success: true,
        data: { achievements }
      });
    } catch (error) {
      logger.error('Get achievements error:', error);
      throw createValidationError('Failed to fetch achievements');
    }
  }

  // Check and unlock achievements
  static async checkAchievements(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      
      const userStats = await storage.getUserStats!(userId);
      if (!userStats) {
        throw createNotFoundError('User stats');
      }

      const unlockedAchievements: any[] = [];

      // Check various achievement conditions
      await GamificationController.checkLearningAchievements(userId, userStats, unlockedAchievements);
      await GamificationController.checkLevelAchievements(userId, userStats.level, unlockedAchievements);
      await GamificationController.checkStreakAchievements(userId, userStats.streak, unlockedAchievements);
      await GamificationController.checkSocialAchievements(userId, userStats, unlockedAchievements);

      res.json({
        success: true,
        message: `Checked achievements for user ${userId}`,
        data: {
          newAchievements: unlockedAchievements,
          totalUnlocked: unlockedAchievements.length
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Check achievements error:', error);
      throw createValidationError('Failed to check achievements');
    }
  }

  // Get user's XP transaction history
  static async getXPHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { page = 1, limit = 20 } = req.query;

      // This would query the xpTransactions table
      // For now, return mock data
      const transactions = [
        {
          id: 1,
          amount: 25,
          reason: 'Lesson completion',
          sourceType: 'lesson_completion',
          createdAt: new Date()
        },
        {
          id: 2,
          amount: 50,
          reason: 'Quiz completion',
          sourceType: 'quiz_completion',
          createdAt: new Date(Date.now() - 86400000)
        }
      ];

      res.json({
        success: true,
        data: {
          transactions,
          pagination: {
            currentPage: Number(page),
            totalPages: 1,
            totalItems: transactions.length
          }
        }
      });
    } catch (error) {
      logger.error('Get XP history error:', error);
      throw createValidationError('Failed to fetch XP history');
    }
  }

  // Helper methods for achievement checking
  private static async checkLearningAchievements(userId: number, userStats: any, unlockedAchievements: any[]) {
    // Check lesson completion achievements
    if (userStats.lessonsCompleted === 1) {
      await GamificationController.unlockAchievement(userId, 1, 'First Steps', unlockedAchievements);
    }
    if (userStats.lessonsCompleted === 10) {
      await GamificationController.unlockAchievement(userId, 2, 'Knowledge Seeker', unlockedAchievements);
    }
    
    // Check quiz achievements
    if (userStats.quizzesCompleted === 20) {
      await GamificationController.unlockAchievement(userId, 6, 'Quiz Master', unlockedAchievements);
    }
    
    // Check course completion achievements
    if (userStats.coursesCompleted === 1) {
      await GamificationController.unlockAchievement(userId, 5, 'Graduate', unlockedAchievements);
    }
  }

  private static async checkLevelAchievements(userId: number, level: number, unlockedAchievements: any[] = []) {
    if (level === 10) {
      await GamificationController.unlockAchievement(userId, 7, 'Level 10', unlockedAchievements);
    }
  }

  private static async checkStreakAchievements(userId: number, streak: number, unlockedAchievements: any[] = []) {
    if (streak === 7) {
      await GamificationController.unlockAchievement(userId, 3, 'Streak Master', unlockedAchievements);
    }
  }

  private static async checkSocialAchievements(userId: number, userStats: any, unlockedAchievements: any[]) {
    if (userStats.helpfulAnswers === 5) {
      await GamificationController.unlockAchievement(userId, 4, 'Helper', unlockedAchievements);
    }
  }

  private static async unlockAchievement(
    userId: number, 
    achievementId: number, 
    achievementName: string, 
    unlockedAchievements: any[]
  ) {
    try {
      // Check if already unlocked
      const userAchievements = await storage.getUserAchievements!(userId);
      const alreadyUnlocked = userAchievements.some(a => a.id === achievementId);
      
      if (!alreadyUnlocked) {
        await storage.unlockAchievement!(userId, achievementId);
        
        // Award XP for achievement (this would come from the achievement table)
        const xpReward = 100; // Default reward
        await storage.addXP!(userId, xpReward, `Achievement unlocked: ${achievementName}`, 'achievement', achievementId);
        
        unlockedAchievements.push({
          id: achievementId,
          name: achievementName,
          xpReward
        });

        metricsLogger.achievementUnlocked(userId, achievementId, achievementName);
      }
    } catch (error) {
      logger.error('Unlock achievement error:', error);
    }
  }
}