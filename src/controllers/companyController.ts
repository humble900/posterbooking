import { Request, Response, NextFunction } from 'express';
import { CreateCompanySchema } from '../types/schemas.js';
import { createCompany, getCompanyById } from '../services/companyService.js';
import { successResponse, errorResponse } from '../utils/responses.js';

/**
 * POST /api/company — Create a new company.
 */
export async function createCompanyHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = CreateCompanySchema.parse(req.body);
    const company = await createCompany(data);

    successResponse(res, {
      company_id: company.id,
      name: company.name,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/company/:id — Get company by ID.
 */
export async function getCompanyHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const company = await getCompanyById(id);

    if (!company) {
      errorResponse(res, 'Company not found', 404);
      return;
    }

    successResponse(res, { company });
  } catch (error) {
    next(error);
  }
}
