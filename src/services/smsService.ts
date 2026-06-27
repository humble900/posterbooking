import Twilio from 'twilio';
import prisma from '../utils/prisma.js';
import config from '../utils/config.js';
import { logger } from '../middleware/logger.js';
import type { SendSmsInput } from '../types/index.js';

// Initialize Twilio client only if credentials are provided
const twilioClient =
  config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN
    ? Twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)
    : null;

/**
 * Send an SMS via Twilio.
 * If Twilio is not configured, simulates the send and logs it.
 */
export async function sendSms(data: SendSmsInput) {
  logger.info({ phone: data.phone }, 'Sending SMS');

  let status: 'sent' | 'failed' | 'simulated' = 'sent';
  let provider = 'twilio';

  if (twilioClient && config.TWILIO_PHONE_NUMBER) {
    try {
      const message = await twilioClient.messages.create({
        body: data.message,
        from: config.TWILIO_PHONE_NUMBER,
        to: data.phone,
      });
      logger.info({ sid: message.sid }, 'SMS sent via Twilio');
    } catch (error) {
      logger.error({ error }, 'Failed to send SMS via Twilio');
      status = 'failed';
    }
  } else {
    logger.warn(
      { phone: data.phone, message: data.message },
      'Twilio not configured — simulating SMS send'
    );
    status = 'simulated';
    provider = 'simulated';
  }

  // Log to database
  const smsLog = await prisma.smsLog.create({
    data: {
      lead_id: data.lead_id || null,
      phone: data.phone,
      provider,
      message: data.message,
      status,
    },
  });

  logger.info({ sms_id: smsLog.id, status }, 'SMS logged to database');
  return smsLog;
}
