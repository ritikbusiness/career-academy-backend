import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

import { config } from './config';

// Bcrypt utilities
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// JWT utilities
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: number;
  jti: string;
  iat?: number;
  exp?: number;
}

export const generateAccessToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: '15m', // Short-lived access token
    issuer: 'lms-auth',
    audience: 'lms-api'
  });
};

export const generateRefreshToken = (userId: number): { token: string; jti: string } => {
  const jti = randomUUID(); // Unique token identifier
  const payload: Omit<RefreshTokenPayload, 'iat' | 'exp'> = {
    userId,
    jti
  };
  
  const token = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: '7d', // Long-lived refresh token
    issuer: 'lms-auth',
    audience: 'lms-api'
  });
  
  return { token, jti };
};

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    const payload = jwt.verify(token, config.JWT_SECRET, {
      issuer: 'lms-auth',
      audience: 'lms-api'
    }) as JWTPayload;
    
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    throw error;
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const payload = jwt.verify(token, config.JWT_REFRESH_SECRET, {
      issuer: 'lms-auth',
      audience: 'lms-api'
    }) as RefreshTokenPayload;
    
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

// Cookie utilities
export const getCookieOptions = (maxAge?: number) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const domain = process.env.COOKIE_DOMAIN;
  
  return {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: 'lax' as const,
    domain: domain || undefined,
    maxAge: maxAge || 7 * 24 * 60 * 60 * 1000, // 7 days default
    path: '/'
  };
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Security utilities
export const generateSecureToken = (): string => {
  return randomUUID();
};

export const sanitizeUserData = (user: any) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};