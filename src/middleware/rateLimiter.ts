import rateLimit from 'express-rate-limit';
import config from '../utils/config.js';

/**
 * Rate limiter middleware.
 * Defaults to 100 requests per 15 minutes per IP.
 */
export const rateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
  },
  skip: (req) => req.path === '/health',
});
