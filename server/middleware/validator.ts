import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateRequest = (schema: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

// Common validation schemas
export const paginationSchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1),
  limit: z.string().transform(val => Math.min(parseInt(val) || 10, 100)),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc')
});

export const idParamSchema = z.object({
  id: z.string().transform(val => parseInt(val))
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200).optional(),
  category: z.string().optional(),
  tags: z.string().optional()
});

// User validation schemas
export const registerSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(128),
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['student', 'instructor']).optional(),
  domain: z.string().optional(),
  branch: z.string().optional(),
  year: z.string().optional()
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

// Course validation schemas
export const createCourseSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  domain: z.string().min(1).max(100),
  price: z.number().min(0).max(9999.99),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  thumbnail: z.string().url().optional(),
  duration: z.string().optional()
});

// Help question validation schemas
export const createQuestionSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10).max(5000),
  categoryId: z.number().positive(),
  tags: z.array(z.string().max(30)).max(5).optional(),
  bountyXP: z.number().min(0).max(100).optional()
});

export const createAnswerSchema = z.object({
  content: z.string().min(10).max(5000)
});

export const rateAnswerSchema = z.object({
  xpRating: z.number().min(1).max(10).optional(),
  starRating: z.number().min(1).max(5).optional()
});

// Subscription validation schemas
export const createSubscriptionSchema = z.object({
  planId: z.number().positive(),
  paymentMethodId: z.string().min(1)
});

export const applyCouponSchema = z.object({
  code: z.string().min(1).max(50),
  courseId: z.number().positive().optional()
});

// Analytics validation schemas
export const analyticsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  courseId: z.number().positive().optional(),
  userId: z.number().positive().optional(),
  activityType: z.enum(['lesson_view', 'lesson_complete', 'quiz_attempt', 'note_taken', 'bookmark_added', 'forum_post']).optional()
});

// File upload validation
export const fileUploadSchema = z.object({
  type: z.enum(['video', 'image', 'document', 'subtitle']),
  maxSize: z.number().optional(),
  allowedTypes: z.array(z.string()).optional()
});

// Input sanitization helper
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

// SQL injection prevention
export const escapeSql = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input.replace(/'/g, "''").replace(/;/g, '');
};