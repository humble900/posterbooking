import { Request, Response } from 'express';

/**
 * Health check controller.
 */
export function healthCheck(_req: Request, res: Response): void {
  res.status(200).json({ status: 'ok' });
}
