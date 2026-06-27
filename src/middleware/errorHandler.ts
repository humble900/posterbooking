import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from './logger.js';

/**
 * Global error handler.
 * Catches Zod validation errors, Prisma errors, and generic errors.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    logger.warn({ path: req.path, errors: err.flatten() }, 'Validation error');
    res.status(422).json({
      success: false,
      error: 'Validation failed',
      details: err.flatten().fieldErrors,
    });
    return;
  }

  // Prisma known request errors (constraint violations, not found, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error({ path: req.path, code: err.code, meta: err.meta }, 'Database error');

    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: 'A record with this value already exists',
        details: { fields: err.meta?.target },
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'Record not found',
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Database operation failed',
    });
    return;
  }

  // Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error({ path: req.path }, 'Prisma validation error');
    res.status(400).json({
      success: false,
      error: 'Invalid database query',
    });
    return;
  }

  // Generic errors
  logger.error({ path: req.path, error: err.message, stack: err.stack }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}
