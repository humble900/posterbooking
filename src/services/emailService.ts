import { Resend } from 'resend';
import prisma from '../utils/prisma.js';
import config from '../utils/config.js';
import { logger } from '../middleware/logger.js';
import type { SendEmailInput } from '../types/index.js';

// Initialize Resend client (may be null if no API key)
const resend = config.RESEND_API_KEY ? new Resend(config.RESEND_API_KEY) : null;

/**
 * Email templates for PosterBooking.
 */
const templates: Record<string, { subject: string; html: string }> = {
  signup: {
    subject: 'Welcome to PosterBooking — Get Started Today!',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #2563eb; font-size: 28px; margin-bottom: 16px;">Welcome to PosterBooking!</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Thanks for your interest in PosterBooking — the easiest way to manage digital signage across all your locations.
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Sign up now and start your free trial:
        </p>
        <a href="https://posterbooking.com/signup" style="display: inline-block; background: #2563eb; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 16px 0;">
          Start Free Trial →
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
          Questions? Reply to this email or visit our <a href="https://posterbooking.com/help" style="color: #2563eb;">Help Center</a>.
        </p>
      </div>
    `,
  },
  follow_up: {
    subject: 'Following Up — PosterBooking',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #2563eb; font-size: 28px; margin-bottom: 16px;">Still Interested?</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          We wanted to follow up on our recent conversation about PosterBooking.
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          PosterBooking helps businesses like yours manage digital signage effortlessly. Our customers typically see a 40% improvement in promotional effectiveness.
        </p>
        <a href="https://posterbooking.com/signup" style="display: inline-block; background: #2563eb; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 16px 0;">
          Get Started →
        </a>
      </div>
    `,
  },
  demo: {
    subject: 'Your PosterBooking Demo is Ready',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #2563eb; font-size: 28px; margin-bottom: 16px;">Your Demo Awaits!</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Great news! We've prepared a personalized demo of PosterBooking for your business.
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          See how PosterBooking can transform your digital signage management across all your locations.
        </p>
        <a href="https://posterbooking.com/demo" style="display: inline-block; background: #2563eb; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 16px 0;">
          Watch Demo →
        </a>
      </div>
    `,
  },
};

/**
 * Send an email using Resend and log it to the database.
 */
export async function sendEmail(data: SendEmailInput) {
  logger.info({ email: data.email, template: data.template }, 'Sending email');

  const template = templates[data.template];
  if (!template) {
    throw new Error(`Unknown email template: ${data.template}. Available: ${Object.keys(templates).join(', ')}`);
  }

  let providerMessageId: string | null = null;
  let status: 'sent' | 'failed' = 'sent';

  if (resend) {
    try {
      const result = await resend.emails.send({
        from: config.RESEND_FROM_EMAIL,
        to: data.email,
        subject: template.subject,
        html: template.html,
      });

      if (result.error) {
        logger.error({ error: result.error }, 'Resend API error');
        status = 'failed';
      } else {
        providerMessageId = result.data?.id || null;
        logger.info({ messageId: providerMessageId }, 'Email sent via Resend');
      }
    } catch (error) {
      logger.error({ error }, 'Failed to send email via Resend');
      status = 'failed';
    }
  } else {
    logger.warn('Resend API key not configured — simulating email send');
    providerMessageId = `sim_${Date.now()}`;
  }

  // Log to database
  const emailLog = await prisma.email.create({
    data: {
      lead_id: data.lead_id || null,
      email: data.email,
      template: data.template,
      provider: 'resend',
      provider_message_id: providerMessageId,
      status,
    },
  });

  logger.info({ email_id: emailLog.id, status }, 'Email logged to database');
  return emailLog;
}
