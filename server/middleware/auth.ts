// AUTHENTICATION SYSTEM REMOVED
// This middleware has been removed as part of complete auth system rebuild
// Will be replaced with clean implementation

import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: any; // Placeholder for rebuild
}

// Placeholder middleware during rebuild
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  res.status(503).json({
    success: false,
    error: 'Authentication system is being rebuilt. Please check back shortly.'
  });
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.status(503).json({
      success: false,
      error: 'Authorization system is being rebuilt. Please check back shortly.'
    });
  };
};

export const authorizeApprovedInstructor = (req: Request, res: Response, next: NextFunction) => {
  res.status(503).json({
    success: false,
    error: 'Instructor authorization is being rebuilt. Please check back shortly.'
  });
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  res.status(503).json({
    success: false,
    error: 'Admin authorization is being rebuilt. Please check back shortly.'
  });
};

export const refreshToken = (req: Request, res: Response) => {
  res.status(503).json({
    success: false,
    error: 'Token refresh is being rebuilt. Please check back shortly.'
  });
};

export const generateToken = (userId: number) => {
  return 'temp-token-during-rebuild';
};