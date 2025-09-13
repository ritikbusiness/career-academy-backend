import { z } from 'zod';

// Environment configuration schema with validation
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  FRONTEND_URL: z.string().url().default('http://localhost:5000'),
  SERVER_URL: z.string().url().default('http://localhost:5000'),
  
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // JWT Secrets
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters').optional(),
  
  // Authentication
  BCRYPT_SALT_ROUNDS: z.string().transform(Number).default('12'),
  SESSION_SECRET: z.string().optional(),
  
  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required for OAuth').optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required for OAuth').optional(),
  OAUTH_CALLBACK_URL: z.string().url().default('http://localhost:5000/api/auth/google/callback'),
  
  // Cookies
  COOKIE_DOMAIN: z.string().optional().default('localhost'),
  
  // Optional
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
});

export type Config = z.infer<typeof envSchema>;

// Validate and export configuration
export const validateConfig = (): Config => {
  try {
    const config = envSchema.parse(process.env);
    
    // Additional validation for production
    if (config.NODE_ENV === 'production') {
      if (config.FRONTEND_URL.includes('localhost')) {
        throw new Error('FRONTEND_URL cannot be localhost in production');
      }
      if (config.COOKIE_DOMAIN === 'localhost') {
        throw new Error('COOKIE_DOMAIN cannot be localhost in production');
      }
    }
    
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      console.error('❌ Environment validation failed:');
      missingVars.forEach(msg => console.error(`  - ${msg}`));
      console.error('\n💡 Please check your .env file against .env.example');
      process.exit(1);
    }
    throw error;
  }
};

// Export validated config
export const config = validateConfig();