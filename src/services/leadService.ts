import prisma from '../utils/prisma.js';
import { logger } from '../middleware/logger.js';
import type { CreateLeadInput, LeadQueryInput } from '../types/index.js';

/**
 * Create a new lead in the database.
 */
export async function createLead(data: CreateLeadInput) {
  logger.info({ business_name: data.business_name }, 'Creating lead');

  const lead = await prisma.lead.create({
    data: {
      company_id: data.company_id,
      business_name: data.business_name,
      contact_name: data.contact_name,
      phone: data.phone,
      email: data.email,
      industry: data.industry,
      website: data.website || null,
      number_of_locations: data.number_of_locations,
      estimated_screens: data.estimated_screens,
      current_solution: data.current_solution,
      interest_level: data.interest_level,
      status: data.status,
      notes: data.notes,
      call_id: data.call_id,
    },
  });

  logger.info({ lead_id: lead.id }, 'Lead created successfully');
  return lead;
}

/**
 * Get leads with pagination, filtering, and search.
 */
export async function getLeads(query: LeadQueryInput) {
  const { page, limit, status, interest_level, search, company_id, sort_by, sort_order } = query;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Record<string, unknown> = {};

  if (status) where.status = status;
  if (interest_level) where.interest_level = interest_level;
  if (company_id) where.company_id = company_id;

  if (search) {
    where.OR = [
      { business_name: { contains: search, mode: 'insensitive' } },
      { contact_name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { industry: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sort_by || 'created_at']: sort_order || 'desc' },
      include: {
        company: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  logger.info({ total, page, limit }, 'Leads retrieved');
  return { leads, total };
}

/**
 * Get a single lead by ID.
 */
export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      company: true,
      calls: true,
      emails: true,
      sms_logs: true,
    },
  });
}
