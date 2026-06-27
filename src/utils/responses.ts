import { Response } from 'express';

/**
 * Standardized API response helpers
 */

export function successResponse(res: Response, data: unknown, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    ...((data && typeof data === 'object') ? data : { data }),
  });
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 400,
  details?: unknown
) {
  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(details ? { details } : {}),
  });
}

export function paginatedResponse(
  res: Response,
  data: unknown[],
  total: number,
  page: number,
  limit: number
) {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    },
  });
}
