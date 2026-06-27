import prisma from '../utils/prisma.js';
import { logger } from '../middleware/logger.js';

/**
 * Create an audit log entry directly (for use in services).
 */
export async function createAuditLog(data: {
  action: string;
  endpoint: string;
  method: string;
  ip_address?: string;
  user_agent?: string;
  request_body?: string;
  response_status?: number;
}) {
  try {
    await prisma.auditLog.create({ data });
  } catch (error) {
    logger.error({ error }, 'Failed to create audit log');
  }
}
