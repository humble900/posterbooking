import { Request, Response, NextFunction } from 'express';
import { CreateLeadSchema, LeadQuerySchema } from '../types/schemas.js';
import { createLead, getLeads, getLeadById } from '../services/leadService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responses.js';

/**
 * POST /api/leads — Create a new lead.
 */
export async function createLeadHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = CreateLeadSchema.parse(req.body);
    const lead = await createLead(data);
    successResponse(res, { lead_id: lead.id }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/leads — List leads with pagination, filtering, and search.
 */
export async function getLeadsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = LeadQuerySchema.parse(req.query);
    const { leads, total } = await getLeads(query);
    paginatedResponse(res, leads, total, query.page, query.limit);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/leads/:id — Get a single lead by ID.
 */
export async function getLeadByIdHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const lead = await getLeadById(id);

    if (!lead) {
      errorResponse(res, 'Lead not found', 404);
      return;
    }

    successResponse(res, { lead });
  } catch (error) {
    next(error);
  }
}
