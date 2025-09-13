import { Request, Response, NextFunction } from 'express';

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Allow all origins in development, restrict in production
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : [
        'http://localhost:3000', 
        'http://localhost:5000',
        /https:\/\/.*\.replit\.dev$/,  // Allow Replit preview URLs
        /https:\/\/.*\.replit\.app$/   // Allow Replit app URLs
      ];

  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.some(allowed => 
    typeof allowed === 'string' 
      ? allowed === origin 
      : allowed.test(origin || '')
  );
  
  if (isAllowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
};