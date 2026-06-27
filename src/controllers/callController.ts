import { Request, Response, NextFunction } from 'express';
import { CallSummarySchema, CallQuerySchema } from '../types/schemas.js';
import { saveCallSummary, getCalls } from '../services/callService.js';
import { successResponse, paginatedResponse } from '../utils/responses.js';

/**
 * POST /api/call-summary — Store call data from Retell AI.
 */
export async function saveCallSummaryHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = CallSummarySchema.parse(req.body);
    const call = await saveCallSummary(data);

    successResponse(res, {
      call_id: call.id,
      call_status: call.call_status,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/calls — List calls with pagination.
 */
export async function getCallsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = CallQuerySchema.parse(req.query);
    const { calls, total } = await getCalls(query);
    paginatedResponse(res, calls, total, query.page, query.limit);
  } catch (error) {
    next(error);
  }
}
