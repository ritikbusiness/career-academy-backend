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
  
  const secret = config.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is required for refresh token generation');
  }
  
  const token = jwt.sign(payload, secret, {
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
  const secret = config.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is required for refresh token verification');
  }
  
  try {
    const payload = jwt.verify(token, secret, {
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
  const isProduction = config.NODE_ENV === 'production';
  const domain = config.COOKIE_DOMAIN;
  
  return {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: 'lax' as const,
    domain: domain && domain !== 'localhost' ? domain : undefined,
    maxAge: maxAge || 7 * 24 * 60 * 60 * 1000, // 7 days default
    path: '/'
  };
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  // Extract domain
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return false;
  }

  // Prevent obvious fake patterns
  const suspiciousPatterns = [
    /^[a-z]{1,4}$/, // Very short random letters like "asdf"
    /^test\d*$/, // "test", "test1", "test123"
    /^fake/i, // Starts with "fake"
    /^dummy/i, // Starts with "dummy" 
    /^\d+$/, // Only numbers
    /^[xyz]+$/, // Only x, y, z
    /^[qwerty]+$/, // Keyboard mashing
    /^temp/i, // Temporary
    /^invalid/i, // Obviously invalid
  ];

  const localPart = email.split('@')[0]?.toLowerCase();
  if (localPart && suspiciousPatterns.some(pattern => pattern.test(localPart))) {
    return false;
  }

  // Block suspicious domains
  const suspiciousDomains = [
    'test.com', 'fake.com', 'invalid.com', 'dummy.com',
    'temp.com', 'throwaway.email', '10minutemail.com'
  ];

  if (suspiciousDomains.includes(domain)) {
    return false;
  }

  // Require legitimate TLD (top-level domain)
  const legitimateTlds = [
    'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
    'co.uk', 'co.in', 'co.au', 'ca', 'de', 'fr', 'jp',
    'br', 'ru', 'cn', 'in', 'uk', 'au', 'mx', 'es',
    'it', 'nl', 'pl', 'se', 'no', 'dk', 'fi', 'be'
  ];

  const tld = domain.includes('.') ? domain.split('.').slice(-1)[0] : domain;
  const fullTld = domain.includes('.') ? domain.split('.').slice(-2).join('.') : domain;

  if (!legitimateTlds.includes(tld) && !legitimateTlds.includes(fullTld)) {
    return false;
  }

  return true;
};

// Common weak passwords list (top 100 most common)
const COMMON_PASSWORDS = new Set([
  'password', '123456', '123456789', 'welcome', 'admin', 'password123', 'root', 'toor',
  'pass', '12345678', '123123', '1234567890', 'qwerty', 'abc123', 'Password1',
  'password1', 'admin123', 'root123', 'welcome123', '1qaz2wsx', 'dragon',
  'master', 'monkey', 'letmein', 'login', 'princess', 'qwertyuiop', 'solo',
  'sunshine', 'secret', 'freedom', 'whatever', 'qazwsx', 'football', 'jesus',
  'michael', 'ninja', 'mustang', 'password12', 'shadow', 'master123', '696969',
  'superman', 'michael1', 'batman', 'trustno1', 'thomas', 'robert', 'jesus1',
  'abcdef', 'matrix', 'cheese', 'hunter', 'buster', 'killer', 'soccer',
  'harley', 'ranger', 'jordan', 'andrew', 'charles', 'daniel', 'compaq',
  'merlin', 'starwars', 'computer', 'michelle', 'jessica', 'pepper', 'test',
  'changeme', 'fuckme', 'fuckyou', 'pussy', 'andrea', 'joshua', 'love',
  'amanda', 'ashley', 'bailey', 'passw0rd', 'shadow1', 'power', 'fire',
  'hammer', 'diamond', 'important', 'secure', 'welcome1', 'admin1', 'system',
  'manager', 'office', 'internet', 'service', 'hello', 'guest', 'university',
  'default', 'money', 'coffee', 'house', 'family', 'business', 'music',
  'student', 'forever', 'friend', 'orange', 'flower', 'beautiful', 'summer'
]);

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
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*...)');
  }
  
  // Check against common passwords (case insensitive)
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a more unique password');
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

// Generate a secure password reset token
export const generatePasswordResetToken = (): string => {
  return randomUUID() + '-' + Date.now();
};

export const sanitizeUserData = (user: any) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};