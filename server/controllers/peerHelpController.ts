import { Request, Response } from 'express';
import { storage } from '../storage';
import { AuthRequest } from '../middleware/auth';
import { logger, metricsLogger } from '../utils/logger';
import { createValidationError, createNotFoundError, createForbiddenError, AppError } from '../middleware/errorHandler';
import { insertHelpQuestionSchema, insertHelpAnswerSchema } from '@shared/schema';
import { createPaginationResult } from '../utils/helpers';

export class PeerHelpController {
  // Get help categories
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await storage.getHelpCategories!();

      res.json({
        success: true,
        data: { categories }
      });
    } catch (error) {
      logger.error('Get categories error:', error);
      throw createValidationError('Failed to fetch categories');
    }
  }

  // Get questions with filtering and pagination
  static async getQuestions(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        categoryId, 
        search, 
        status, 
        sort = 'recent',
        tags 
      } = req.query;

      const filters = {
        search: search as string,
        status: status as string,
        tags: tags as string
      };

      const questions = await storage.getHelpQuestions!(
        categoryId ? parseInt(categoryId as string) : undefined,
        filters
      );

      // Apply pagination
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedQuestions = questions.slice(startIndex, endIndex);

      const result = createPaginationResult(
        paginatedQuestions,
        questions.length,
        { page: Number(page), limit: Number(limit), sort: sort as string }
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Get questions error:', error);
      throw createValidationError('Failed to fetch questions');
    }
  }

  // Get single question with answers
  static async getQuestion(req: Request, res: Response) {
    try {
      const questionId = parseInt(req.params.id);
      
      const question = await storage.getHelpQuestion!(questionId);
      if (!question) {
        throw createNotFoundError('Question');
      }

      // Get answers for the question
      const answers = await storage.getQuestionAnswers!(questionId);

      // Increment view count (would need to add this to storage)
      // await storage.incrementQuestionViews!(questionId);

      res.json({
        success: true,
        data: {
          question,
          answers,
          answerCount: answers.length
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Get question error:', error);
      throw createValidationError('Failed to fetch question');
    }
  }

  // Create new question
  static async createQuestion(req: AuthRequest, res: Response) {
    try {
      const questionData = insertHelpQuestionSchema.parse(req.body);
      const userId = req.user!.id;

      const newQuestion = await storage.createHelpQuestion!({
        ...questionData,
        userId
      });

      // Award XP for asking a question
      await storage.addXP!(userId, 5, 'Asked a question', 'help_question', newQuestion.id);

      logger.info(`Question created: ${newQuestion.id} by user ${userId}`);

      res.status(201).json({
        success: true,
        message: 'Question created successfully',
        data: { question: newQuestion }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Create question error:', error);
      throw createValidationError('Failed to create question');
    }
  }

  // Create answer to question
  static async createAnswer(req: AuthRequest, res: Response) {
    try {
      const questionId = parseInt(req.params.questionId);
      const answerData = insertHelpAnswerSchema.parse(req.body);
      const userId = req.user!.id;

      // Check if question exists
      const question = await storage.getHelpQuestion!(questionId);
      if (!question) {
        throw createNotFoundError('Question');
      }

      const newAnswer = await storage.createHelpAnswer!({
        ...answerData,
        questionId,
        userId
      });

      // Award XP for answering a question
      await storage.addXP!(userId, 15, 'Answered a question', 'help_answer', newAnswer.id);

      logger.info(`Answer created: ${newAnswer.id} for question ${questionId} by user ${userId}`);

      res.status(201).json({
        success: true,
        message: 'Answer created successfully',
        data: { answer: newAnswer }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Create answer error:', error);
      throw createValidationError('Failed to create answer');
    }
  }

  // Rate an answer (XP rating by question author or star rating by community)
  static async rateAnswer(req: AuthRequest, res: Response) {
    try {
      const answerId = parseInt(req.params.answerId);
      const { xpRating, starRating } = req.body;
      const userId = req.user!.id;

      // Get the answer and question to check permissions
      const answers = await storage.getQuestionAnswers!(0); // This needs to be fixed
      const answer = answers.find(a => a.id === answerId);
      
      if (!answer) {
        throw createNotFoundError('Answer');
      }

      const question = await storage.getHelpQuestion!(answer.questionId);
      if (!question) {
        throw createNotFoundError('Question');
      }

      // XP rating can only be given by the question author
      if (xpRating !== undefined) {
        if (question.userId !== userId) {
          throw createForbiddenError('Only the question author can give XP ratings');
        }

        if (xpRating < 1 || xpRating > 10) {
          throw createValidationError('XP rating must be between 1 and 10');
        }

        // Award XP to the answer author based on rating
        const xpAward = xpRating * 10; // 10-100 XP based on rating
        await storage.addXP!(
          answer.userId, 
          xpAward, 
          `Helpful answer rating: ${xpRating}/10`, 
          'helpful_answer',
          answerId
        );

        // Update helpful answers count
        await storage.updateUserStats!(answer.userId, {
          helpfulAnswers: 1 // This should increment, not set
        });

        metricsLogger.xpEarned(answer.userId, xpAward, 'helpful_answer_rating');
      }

      // Star rating can be given by anyone (except the answer author)
      if (starRating !== undefined) {
        if (answer.userId === userId) {
          throw createForbiddenError('You cannot rate your own answer');
        }

        if (starRating < 1 || starRating > 5) {
          throw createValidationError('Star rating must be between 1 and 5');
        }

        // Store the star rating (would need to implement this in storage)
        // await storage.addStarRating!(answerId, userId, starRating);
      }

      await storage.rateAnswer!(answerId, userId, xpRating, starRating);

      res.json({
        success: true,
        message: 'Answer rated successfully',
        data: {
          answerId,
          xpRating,
          starRating,
          xpAwarded: xpRating ? xpRating * 10 : 0
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Rate answer error:', error);
      throw createValidationError('Failed to rate answer');
    }
  }

  // Get leaderboard for peer help
  static async getHelpLeaderboard(req: Request, res: Response) {
    try {
      const { period = 'monthly', limit = 10 } = req.query;

      // This would get users ranked by helpful answers and XP earned from help
      const leaderboard = [
        {
          rank: 1,
          userId: 1,
          username: 'helpmaster',
          fullName: 'Help Master',
          avatar: null,
          helpfulAnswers: 45,
          totalXPFromHelp: 1250,
          level: 8
        },
        {
          rank: 2,
          userId: 2,
          username: 'codeguru',
          fullName: 'Code Guru',
          avatar: null,
          helpfulAnswers: 38,
          totalXPFromHelp: 980,
          level: 7
        }
      ];

      res.json({
        success: true,
        data: {
          leaderboard,
          period,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      logger.error('Get help leaderboard error:', error);
      throw createValidationError('Failed to fetch help leaderboard');
    }
  }

  // Get user's help statistics
  static async getUserHelpStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      // This would aggregate user's help center activity
      const stats = {
        questionsAsked: 12,
        answersGiven: 28,
        helpfulAnswers: 15,
        averageXPRating: 7.2,
        averageStarRating: 4.1,
        totalXPFromHelp: 420,
        rank: 5,
        badges: [
          { name: 'First Answer', icon: '🌟', earnedAt: '2024-01-15' },
          { name: 'Helpful Helper', icon: '🤝', earnedAt: '2024-02-20' }
        ]
      };

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      logger.error('Get user help stats error:', error);
      throw createValidationError('Failed to fetch user help stats');
    }
  }

  // Vote on question (upvote/downvote)
  static async voteOnQuestion(req: AuthRequest, res: Response) {
    try {
      const questionId = parseInt(req.params.questionId);
      const { voteType } = req.body; // 'up' or 'down'
      const userId = req.user!.id;

      if (!['up', 'down'].includes(voteType)) {
        throw createValidationError('Vote type must be "up" or "down"');
      }

      const question = await storage.getHelpQuestion!(questionId);
      if (!question) {
        throw createNotFoundError('Question');
      }

      // Prevent self-voting
      if (question.userId === userId) {
        throw createForbiddenError('You cannot vote on your own question');
      }

      // This would implement voting logic with vote tracking
      // For now, just update the counts
      // await storage.voteOnQuestion!(questionId, userId, voteType);

      res.json({
        success: true,
        message: 'Vote recorded successfully',
        data: {
          questionId,
          voteType,
          newUpvotes: question.upvotes + (voteType === 'up' ? 1 : 0),
          newDownvotes: question.downvotes + (voteType === 'down' ? 1 : 0)
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Vote on question error:', error);
      throw createValidationError('Failed to record vote');
    }
  }

  // Vote on answer (upvote/downvote)
  static async voteOnAnswer(req: AuthRequest, res: Response) {
    try {
      const answerId = parseInt(req.params.answerId);
      const { voteType } = req.body; // 'up' or 'down'
      const userId = req.user!.id;

      if (!['up', 'down'].includes(voteType)) {
        throw createValidationError('Vote type must be "up" or "down"');
      }

      // Get answer (would need proper storage method)
      const answers = await storage.getQuestionAnswers!(0); // Fix this
      const answer = answers.find(a => a.id === answerId);
      
      if (!answer) {
        throw createNotFoundError('Answer');
      }

      // Prevent self-voting
      if (answer.userId === userId) {
        throw createForbiddenError('You cannot vote on your own answer');
      }

      // This would implement voting logic
      // await storage.voteOnAnswer!(answerId, userId, voteType);

      res.json({
        success: true,
        message: 'Vote recorded successfully',
        data: {
          answerId,
          voteType,
          newUpvotes: answer.upvotes + (voteType === 'up' ? 1 : 0),
          newDownvotes: answer.downvotes + (voteType === 'down' ? 1 : 0)
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Vote on answer error:', error);
      throw createValidationError('Failed to record vote');
    }
  }

  // Mark answer as accepted (question author only)
  static async acceptAnswer(req: AuthRequest, res: Response) {
    try {
      const answerId = parseInt(req.params.answerId);
      const userId = req.user!.id;

      // Get answer and question
      const answers = await storage.getQuestionAnswers!(0); // Fix this
      const answer = answers.find(a => a.id === answerId);
      
      if (!answer) {
        throw createNotFoundError('Answer');
      }

      const question = await storage.getHelpQuestion!(answer.questionId);
      if (!question) {
        throw createNotFoundError('Question');
      }

      // Only question author can accept answers
      if (question.userId !== userId) {
        throw createForbiddenError('Only the question author can accept answers');
      }

      // Mark answer as accepted
      // await storage.acceptAnswer!(answerId);

      // Award bonus XP to answer author
      await storage.addXP!(
        answer.userId,
        50,
        'Answer accepted',
        'answer_accepted',
        answerId
      );

      res.json({
        success: true,
        message: 'Answer accepted successfully',
        data: { answerId }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Accept answer error:', error);
      throw createValidationError('Failed to accept answer');
    }
  }

  // Search questions and answers
  static async searchQuestions(req: Request, res: Response) {
    try {
      const { q, category, tags, page = 1, limit = 10 } = req.query;

      if (!q || (q as string).length < 3) {
        throw createValidationError('Search query must be at least 3 characters');
      }

      const filters = {
        search: q as string,
        category: category as string,
        tags: tags as string
      };

      const questions = await storage.getHelpQuestions!(undefined, filters);

      // Apply pagination
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedQuestions = questions.slice(startIndex, endIndex);

      const result = createPaginationResult(
        paginatedQuestions,
        questions.length,
        { page: Number(page), limit: Number(limit) }
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Search questions error:', error);
      throw createValidationError('Failed to search questions');
    }
  }
}