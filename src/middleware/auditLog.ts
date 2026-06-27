import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma.js';
import { logger } from './logger.js';

/**
 * Audit log middleware.
 * Logs every API action to the audit_logs table.
 * Runs asynchronously (fire-and-forget) so it doesn't block responses.
 */
export function auditLogMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Skip logging for health checks and docs
  const skipPaths = ['/health', '/api-docs'];
  if (skipPaths.some((path) => req.path.startsWith(path))) {
    next();
    return;
  }

  // Log after response is sent
  res.on('finish', () => {
    const requestBody =
      req.method !== 'GET' && req.body
        ? JSON.stringify(sanitizeBody(req.body))
        : undefined;

    prisma.auditLog
      .create({
        data: {
          action: `${req.method} ${req.path}`,
          endpoint: req.originalUrl,
          method: req.method,
          ip_address: req.ip || req.socket.remoteAddress || 'unknown',
          user_agent: req.get('user-agent') || null,
          request_body: requestBody,
          response_status: res.statusCode,
        },
      })
      .catch((err) => {
        logger.error({ error: err.message }, 'Failed to write audit log');
      });
  });

  next();
}

/**
 * Remove sensitive fields from request body before logging.
 */
function sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'api_key', 'token', 'secret', 'authorization'];
  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }
  return sanitized;
}
