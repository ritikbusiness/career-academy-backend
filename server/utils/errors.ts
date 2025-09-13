// Standard error response format
export interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: any;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  message?: string;
  data: T;
}

// Error codes for consistent client handling
export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  REFRESH_TOKEN_EXPIRED: 'REFRESH_TOKEN_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PASSWORD_TOO_WEAK: 'PASSWORD_TOO_WEAK',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  INVALID_EMAIL: 'INVALID_EMAIL',
  
  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
  
  // General errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // OAuth errors
  GOOGLE_AUTH_FAILED: 'GOOGLE_AUTH_FAILED',
  OAUTH_CANCELLED: 'OAUTH_CANCELLED',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// Helper functions to create standardized error responses
export const createErrorResponse = (
  error: string,
  code: ErrorCode,
  details?: any
): ApiErrorResponse => ({
  success: false,
  error,
  code,
  ...(details && { details })
});

export const createSuccessResponse = <T>(
  data: T,
  message?: string
): ApiSuccessResponse<T> => ({
  success: true,
  ...(message && { message }),
  data
});

// Authentication specific errors
export const AUTH_ERRORS = {
  invalidCredentials: () => createErrorResponse(
    'Invalid email or password',
    ERROR_CODES.INVALID_CREDENTIALS
  ),
  
  tokenExpired: () => createErrorResponse(
    'Access token has expired',
    ERROR_CODES.TOKEN_EXPIRED
  ),
  
  invalidToken: () => createErrorResponse(
    'Invalid or malformed token',
    ERROR_CODES.INVALID_TOKEN
  ),
  
  refreshTokenExpired: () => createErrorResponse(
    'Refresh token has expired. Please log in again',
    ERROR_CODES.REFRESH_TOKEN_EXPIRED
  ),
  
  emailExists: () => createErrorResponse(
    'An account with this email already exists',
    ERROR_CODES.EMAIL_ALREADY_EXISTS
  ),
  
  weakPassword: (details: string[]) => createErrorResponse(
    'Password does not meet security requirements',
    ERROR_CODES.PASSWORD_TOO_WEAK,
    { requirements: details }
  ),
  
  rateLimited: (retryAfter?: number) => createErrorResponse(
    'Too many attempts. Please try again later',
    ERROR_CODES.RATE_LIMITED,
    { retryAfter }
  ),
  
  googleAuthFailed: () => createErrorResponse(
    'Google authentication failed',
    ERROR_CODES.GOOGLE_AUTH_FAILED
  ),
  
  unauthorized: () => createErrorResponse(
    'Authentication required',
    ERROR_CODES.UNAUTHORIZED
  ),
  
  forbidden: () => createErrorResponse(
    'Insufficient permissions',
    ERROR_CODES.FORBIDDEN
  )
};