/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated service
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private readonly windowMs: number; // Time window in milliseconds
  private readonly maxRequests: number; // Max requests per window

  constructor(windowMs: number = 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  /**
   * Check if a request should be allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count < this.maxRequests) {
      entry.count++;
      return true;
    }

    return false;
  }

  /**
   * Get remaining requests for a key
   */
  getRemaining(key: string): number {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * Get reset time for a key
   */
  getResetTime(key: string): number | null {
    const entry = this.store.get(key);
    return entry?.resetTime || null;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.store.clear();
  }
}

// Create global instances for different endpoints
export const chatRateLimiter = new RateLimiter(60 * 1000, 30); // 30 requests per minute
export const uploadRateLimiter = new RateLimiter(60 * 60 * 1000, 10); // 10 uploads per hour
export const apiRateLimiter = new RateLimiter(60 * 1000, 100); // 100 requests per minute

/**
 * Get client IP from request
 */
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return req.headers.get('x-real-ip') || 'unknown';
}

/**
 * Check rate limit and return response headers
 */
export function checkRateLimit(
  limiter: RateLimiter,
  key: string
): { allowed: boolean; headers: Record<string, string> } {
  const allowed = limiter.isAllowed(key);
  const remaining = limiter.getRemaining(key);
  const resetTime = limiter.getResetTime(key);

  return {
    allowed,
    headers: {
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': resetTime?.toString() || '0',
    },
  };
}
