import { Request, Response, NextFunction } from 'express';
import { SendSmsSchema } from '../types/schemas.js';
import { sendSms } from '../services/smsService.js';
import { successResponse } from '../utils/responses.js';

/**
 * POST /api/sms — Send an SMS via Twilio (or simulate).
 */
export async function sendSmsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = SendSmsSchema.parse(req.body);
    const smsLog = await sendSms(data);

    successResponse(res, {
      sms_id: smsLog.id,
      status: smsLog.status,
      provider: smsLog.provider,
    }, 201);
  } catch (error) {
    next(error);
  }
}
