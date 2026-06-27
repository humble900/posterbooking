import { Request, Response, NextFunction } from 'express';
import config from '../utils/config.js';
import { logger } from './logger.js';

/**
 * API Key authentication middleware.
 * Expects: Authorization: Bearer <API_KEY>
 * Exempts: /health, /api-docs
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Skip auth for health check and docs
  const exemptPaths = ['/health', '/api-docs'];
  if (exemptPaths.some((path) => req.path.startsWith(path))) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn({ path: req.path, ip: req.ip }, 'Missing Authorization header');
    res.status(401).json({
      success: false,
      error: 'Missing Authorization header',
    });
    return;
  }

  // Support both "Bearer <key>" and raw "<key>"
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (token !== config.API_KEY) {
    logger.warn({ path: req.path, ip: req.ip }, 'Invalid API key');
    res.status(403).json({
      success: false,
      error: 'Invalid API key',
    });
    return;
  }

  next();
}
