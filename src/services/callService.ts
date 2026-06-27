import prisma from '../utils/prisma.js';
import { logger } from '../middleware/logger.js';
import type { CallSummaryInput, CallQueryInput } from '../types/index.js';

/**
 * Save a call summary from Retell AI.
 */
export async function saveCallSummary(data: CallSummaryInput) {
  logger.info({ retell_call_id: data.retell_call_id }, 'Saving call summary');

  const call = await prisma.call.create({
    data: {
      lead_id: data.lead_id || null,
      retell_call_id: data.retell_call_id,
      duration: data.duration,
      recording_url: data.recording_url || null,
      transcript: data.transcript,
      summary: data.summary,
      call_status: data.call_status,
      ended_reason: data.ended_reason,
    },
  });

  logger.info({ call_id: call.id }, 'Call summary saved');
  return call;
}

/**
 * Get calls with pagination and optional filtering.
 */
export async function getCalls(query: CallQueryInput) {
  const { page, limit, lead_id, call_status, sort_order } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (lead_id) where.lead_id = lead_id;
  if (call_status) where.call_status = call_status;

  const [calls, total] = await Promise.all([
    prisma.call.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: sort_order || 'desc' },
      include: {
        lead: {
          select: { id: true, business_name: true, contact_name: true },
        },
      },
    }),
    prisma.call.count({ where }),
  ]);

  logger.info({ total, page, limit }, 'Calls retrieved');
  return { calls, total };
}
