import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JWTPayload } from '../utils/auth';
import { AuthStorage } from '../storage/authStorage';
import { logger } from '../utils/logger';

// Extend Request interface to include user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
    provider: string;
    imageUrl?: string | null;
  };
}

// Extract JWT token from Authorization header
const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

// JWT Authentication Middleware
export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req);
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No authentication token provided'
      });
      return;
    }

    // Verify JWT token
    const payload: JWTPayload = verifyAccessToken(token);
    
    // Get user from database to ensure they still exist and get latest data
    const user = await AuthStorage.getUserById(payload.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      provider: user.provider,
      imageUrl: user.imageUrl
    };

    next();
  } catch (error) {
    logger.error('JWT authentication error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Access token expired') {
        res.status(401).json({
          success: false,
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
        return;
      } else if (error.message === 'Invalid access token') {
        res.status(401).json({
          success: false,
          error: 'Invalid token',
          code: 'INVALID_TOKEN'
        });
        return;
      }
    }

    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Require authentication middleware
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }
  next();
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

// Admin authorization middleware
export const requireAdmin = authorize(['admin']);

// Instructor authorization middleware (approved instructors only)
export const requireInstructor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  if (!['instructor', 'admin'].includes(req.user.role)) {
    res.status(403).json({
      success: false,
      error: 'Instructor access required'
    });
    return;
  }

  // For instructors, check if they're approved
  if (req.user.role === 'instructor') {
    const user = await AuthStorage.getUserById(req.user.id);
    if (!user || user.instructorStatus !== 'approved') {
      res.status(403).json({
        success: false,
        error: 'Instructor approval required'
      });
      return;
    }
  }

  next();
};

// Student authorization middleware
export const requireStudent = authorize(['student', 'instructor', 'admin']);

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req);
    
    if (token) {
      const payload: JWTPayload = verifyAccessToken(token);
      const user = await AuthStorage.getUserById(payload.userId);
      
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          provider: user.provider,
          imageUrl: user.imageUrl
        };
      }
    }
  } catch (error) {
    // Silently ignore auth errors for optional auth
    logger.debug('Optional auth failed:', error);
  }
  
  next();
};