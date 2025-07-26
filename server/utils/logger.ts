import winston from 'winston';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'lms-backend' },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

// Performance monitoring helper
export const performance = {
  startTimer: () => {
    return Date.now();
  },
  
  endTimer: (startTime: number, operation: string) => {
    const duration = Date.now() - startTime;
    logger.info(`Performance: ${operation} completed in ${duration}ms`);
    return duration;
  }
};

// API request logger
export const apiLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id || 'anonymous'
    };
    
    if (res.statusCode >= 400) {
      logger.error('API Error', logData);
    } else {
      logger.info('API Request', logData);
    }
  });
  
  next();
};

// Database query logger
export const dbLogger = {
  query: (query: string, params?: any[], duration?: number) => {
    logger.debug('Database Query', {
      query: query.replace(/\s+/g, ' ').trim(),
      params: params?.length ? '[REDACTED]' : undefined,
      duration: duration ? `${duration}ms` : undefined
    });
  },
  
  error: (error: Error, query?: string) => {
    logger.error('Database Error', {
      error: error.message,
      query: query?.replace(/\s+/g, ' ').trim(),
      stack: error.stack
    });
  }
};

// Security event logger
export const securityLogger = {
  authFailure: (username: string, ip: string, reason: string) => {
    logger.warn('Authentication Failure', {
      username,
      ip,
      reason,
      timestamp: new Date().toISOString()
    });
  },
  
  authSuccess: (userId: number, username: string, ip: string) => {
    logger.info('Authentication Success', {
      userId,
      username,
      ip,
      timestamp: new Date().toISOString()
    });
  },
  
  rateLimitExceeded: (ip: string, endpoint: string) => {
    logger.warn('Rate Limit Exceeded', {
      ip,
      endpoint,
      timestamp: new Date().toISOString()
    });
  },
  
  suspiciousActivity: (userId: number, activity: string, metadata?: any) => {
    logger.warn('Suspicious Activity', {
      userId,
      activity,
      metadata,
      timestamp: new Date().toISOString()
    });
  }
};

// Business metrics logger
export const metricsLogger = {
  courseEnrollment: (userId: number, courseId: number, price: number) => {
    logger.info('Course Enrollment', {
      userId,
      courseId,
      price,
      timestamp: new Date().toISOString()
    });
  },
  
  courseCompletion: (userId: number, courseId: number, completionTime: number) => {
    logger.info('Course Completion', {
      userId,
      courseId,
      completionTime: `${completionTime}ms`,
      timestamp: new Date().toISOString()
    });
  },
  
  xpEarned: (userId: number, amount: number, source: string) => {
    logger.info('XP Earned', {
      userId,
      amount,
      source,
      timestamp: new Date().toISOString()
    });
  },
  
  achievementUnlocked: (userId: number, achievementId: number, achievementName: string) => {
    logger.info('Achievement Unlocked', {
      userId,
      achievementId,
      achievementName,
      timestamp: new Date().toISOString()
    });
  }
};

// Create logs directory if it doesn't exist
import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}