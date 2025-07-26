import { Request, Response, NextFunction } from 'express';

interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

interface ClientInfo {
  requests: number;
  resetTime: number;
}

class RateLimiter {
  private clients: Map<string, ClientInfo> = new Map();
  private windowMs: number;
  private maxRequests: number;
  private message: string;

  constructor(options: RateLimiterOptions) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;
    this.message = options.message || 'Too many requests, please try again later';
    
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, client] of this.clients.entries()) {
      if (now > client.resetTime) {
        this.clients.delete(key);
      }
    }
  }

  middleware = (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    let client = this.clients.get(clientId);
    
    if (!client || now > client.resetTime) {
      client = {
        requests: 0,
        resetTime: now + this.windowMs
      };
      this.clients.set(clientId, client);
    }
    
    client.requests++;
    
    if (client.requests > this.maxRequests) {
      return res.status(429).json({
        error: this.message,
        retryAfter: Math.ceil((client.resetTime - now) / 1000)
      });
    }
    
    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': this.maxRequests.toString(),
      'X-RateLimit-Remaining': Math.max(0, this.maxRequests - client.requests).toString(),
      'X-RateLimit-Reset': new Date(client.resetTime).toISOString()
    });
    
    next();
  };
}

// Create rate limiters for different endpoints
export const generalLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests from this IP, please try again later'
});

export const authLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many authentication attempts, please try again later'
});

export const aiLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  message: 'AI features rate limit exceeded, please wait before making more requests'
});

export const uploadLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5,
  message: 'Upload rate limit exceeded, please wait before uploading again'
});