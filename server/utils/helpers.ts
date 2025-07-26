import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Generate secure random tokens
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const generateVerificationCode = (): string => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// Date utilities
export const getStartOfWeek = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

export const getEndOfWeek = (date: Date = new Date()): Date => {
  const d = getStartOfWeek(date);
  return new Date(d.setDate(d.getDate() + 6));
};

export const getStartOfMonth = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getEndOfMonth = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

// Pagination utilities
export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const createPaginationResult = <T>(
  data: T[],
  totalItems: number,
  options: PaginationOptions
): PaginationResult<T> => {
  const totalPages = Math.ceil(totalItems / options.limit);
  
  return {
    data,
    pagination: {
      currentPage: options.page,
      totalPages,
      totalItems,
      itemsPerPage: options.limit,
      hasNextPage: options.page < totalPages,
      hasPrevPage: options.page > 1
    }
  };
};

// XP and level calculations
export const calculateLevelFromXP = (xp: number): number => {
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const calculateXPForLevel = (level: number): number => {
  // XP required for level: xp = (level - 1)^2 * 100
  return Math.pow(level - 1, 2) * 100;
};

export const calculateXPToNextLevel = (currentXP: number): number => {
  const currentLevel = calculateLevelFromXP(currentXP);
  const nextLevelXP = calculateXPForLevel(currentLevel + 1);
  return nextLevelXP - currentXP;
};

// Progress calculations
export const calculateCourseProgress = (completedLessons: string[], totalLessons: number): number => {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons.length / totalLessons) * 100);
};

export const calculateLearningStreak = (lastActivityDate: Date | null): number => {
  if (!lastActivityDate) return 0;
  
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const lastActivity = new Date(lastActivityDate);
  
  // Reset day comparison (ignore time)
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  lastActivity.setHours(0, 0, 0, 0);
  
  if (lastActivity.getTime() === today.getTime() || lastActivity.getTime() === yesterday.getTime()) {
    return 1; // Continue streak calculation in business logic
  }
  
  return 0; // Streak broken
};

// Text processing utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const extractHashtags = (text: string): string[] => {
  const hashtags = text.match(/#[a-zA-Z0-9_]+/g);
  return hashtags ? hashtags.map(tag => tag.substring(1)) : [];
};

// Search utilities
export const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const createSearchTerms = (query: string): string[] => {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(term => term.length > 2)
    .map(term => escapeRegex(term));
};

// File utilities
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isValidImageFile = (filename: string): boolean => {
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  return validExtensions.includes(getFileExtension(filename));
};

export const isValidVideoFile = (filename: string): boolean => {
  const validExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
  return validExtensions.includes(getFileExtension(filename));
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Currency utilities
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

// Time utilities
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

export const parseTimeToSeconds = (timeString: string): number => {
  const regex = /(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/;
  const matches = timeString.match(regex);
  
  if (!matches) return 0;
  
  const hours = parseInt(matches[1] || '0');
  const minutes = parseInt(matches[2] || '0');
  const seconds = parseInt(matches[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, contains uppercase, lowercase, digit, and special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Analytics utilities
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const calculateAverageRating = (ratings: number[]): number => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 100) / 100;
};

// Cache key generators
export const generateCacheKey = (...parts: (string | number)[]): string => {
  return parts.map(part => String(part)).join(':');
};

export const generateUserCacheKey = (userId: number, resource: string): string => {
  return generateCacheKey('user', userId, resource);
};

export const generateCourseCacheKey = (courseId: number, resource: string): string => {
  return generateCacheKey('course', courseId, resource);
};