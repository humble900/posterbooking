import { Request, Response, NextFunction } from 'express';
import { SendEmailSchema } from '../types/schemas.js';
import { sendEmail } from '../services/emailService.js';
import { successResponse } from '../utils/responses.js';

/**
 * POST /api/email — Send an email via Resend.
 */
export async function sendEmailHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = SendEmailSchema.parse(req.body);
    const emailLog = await sendEmail(data);

    successResponse(res, {
      email_id: emailLog.id,
      status: emailLog.status,
      provider_message_id: emailLog.provider_message_id,
    }, 201);
  } catch (error) {
    next(error);
  }
}
