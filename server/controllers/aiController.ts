import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { createValidationError, AppError } from '../middleware/errorHandler';
import { AIService } from '../services/aiService';

export class AIController {
  // Generate lesson summary
  static async generateLessonSummary(req: AuthRequest, res: Response) {
    try {
      const { lessonContent, lessonTitle } = req.body;
      
      if (!lessonContent || !lessonTitle) {
        throw createValidationError('Lesson content and title are required');
      }

      const summary = await AIService.generateLessonSummary(lessonContent, lessonTitle);
      
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('AI lesson summary generation failed', { error });
      throw createValidationError('Failed to generate lesson summary');
    }
  }

  // Generate practice questions
  static async generatePracticeQuestions(req: AuthRequest, res: Response) {
    try {
      const { lessonContent, lessonTitle, difficulty = 'medium' } = req.body;
      
      if (!lessonContent || !lessonTitle) {
        throw createValidationError('Lesson content and title are required');
      }

      const questions = await AIService.generatePracticeQuestions(lessonContent, lessonTitle, difficulty);
      
      res.json({
        success: true,
        data: questions
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('AI practice questions generation failed', { error });
      throw createValidationError('Failed to generate practice questions');
    }
  }

  // AI Study Buddy Chat
  static async studyBuddyChat(req: AuthRequest, res: Response) {
    try {
      const { message, conversationHistory = [], lessonContext } = req.body;
      
      if (!message) {
        throw createValidationError('Message is required');
      }

      const response = await AIService.getChatResponse(message, conversationHistory, lessonContext);
      
      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('AI study buddy chat failed', { error });
      throw createValidationError('Failed to get chat response');
    }
  }

  // Skill gap analysis
  static async analyzeSkillGaps(req: AuthRequest, res: Response) {
    try {
      const { userProgress, courseContent } = req.body;
      
      if (!userProgress || !courseContent) {
        throw createValidationError('User progress data and course content are required');
      }

      const analysis = await AIService.analyzeSkillGaps(userProgress, courseContent);
      
      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('AI skill gap analysis failed', { error });
      throw createValidationError('Failed to analyze skill gaps');
    }
  }

  // Generate lesson content (instructors only)
  static async generateLessonContent(req: AuthRequest, res: Response) {
    try {
      const { topic, learningObjectives, targetAudience, duration } = req.body;
      
      if (!topic || !learningObjectives || !targetAudience || !duration) {
        throw createValidationError('Topic, learning objectives, target audience, and duration are required');
      }

      const content = await AIService.generateLessonContent(topic, learningObjectives, targetAudience, duration);
      
      res.json({
        success: true,
        data: content
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('AI lesson content generation failed', { error });
      throw createValidationError('Failed to generate lesson content');
    }
  }

  // Check AI service health
  static async healthCheck(req: Request, res: Response) {
    try {
      const isHealthy = await AIService.checkHealth();
      
      res.json({
        status: isHealthy ? 'ok' : 'error',
        service: 'deepseek-ai',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('AI health check failed', { error });
      res.status(503).json({
        status: 'error',
        service: 'deepseek-ai',
        error: 'Service unavailable',
        timestamp: new Date().toISOString()
      });
    }
  }
}