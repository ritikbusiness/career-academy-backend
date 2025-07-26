import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler middleware
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message);
    error = new AppError(message.join(', '), 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // Database connection errors
  if (err.message?.includes('connect ECONNREFUSED')) {
    const message = 'Database connection failed';
    error = new AppError(message, 503);
  }

  // AI API errors
  if (err.message?.includes('DeepSeek') || err.message?.includes('OpenAI')) {
    const message = 'AI service temporarily unavailable';
    error = new AppError(message, 503);
  }

  // File upload errors
  if (err.message?.includes('File too large')) {
    const message = 'File size exceeds limit';
    error = new AppError(message, 413);
  }

  // Rate limiting errors
  if (err.message?.includes('Too many requests')) {
    error = new AppError(err.message, 429);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Don't leak error details in production
  const errorResponse = {
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: error
    })
  };

  res.status(statusCode).json(errorResponse);
};

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Specific error creators
export const createValidationError = (message: string) => {
  return new AppError(message, 400);
};

export const createAuthError = (message: string = 'Authentication failed') => {
  return new AppError(message, 401);
};

export const createForbiddenError = (message: string = 'Access forbidden') => {
  return new AppError(message, 403);
};

export const createNotFoundError = (resource: string = 'Resource') => {
  return new AppError(`${resource} not found`, 404);
};

export const createConflictError = (message: string) => {
  return new AppError(message, 409);
};

export const createServerError = (message: string = 'Internal server error') => {
  return new AppError(message, 500);
};

// Business logic error handlers
export const handleCourseErrors = (error: any) => {
  if (error.message?.includes('already enrolled')) {
    throw new AppError('User already enrolled in this course', 409);
  }
  
  if (error.message?.includes('course not found')) {
    throw new AppError('Course not found', 404);
  }
  
  if (error.message?.includes('insufficient permissions')) {
    throw new AppError('Insufficient permissions to access this course', 403);
  }
  
  throw error;
};

export const handlePaymentErrors = (error: any) => {
  if (error.message?.includes('payment_failed')) {
    throw new AppError('Payment processing failed', 402);
  }
  
  if (error.message?.includes('invalid_card')) {
    throw new AppError('Invalid payment method', 400);
  }
  
  if (error.message?.includes('insufficient_funds')) {
    throw new AppError('Insufficient funds', 402);
  }
  
  throw error;
};

export const handleQuizErrors = (error: any) => {
  if (error.message?.includes('time_expired')) {
    throw new AppError('Quiz time limit exceeded', 400);
  }
  
  if (error.message?.includes('already_completed')) {
    throw new AppError('Quiz already completed', 409);
  }
  
  throw error;
};