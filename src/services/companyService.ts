import prisma from '../utils/prisma.js';
import { logger } from '../middleware/logger.js';
import type { CreateCompanyInput } from '../types/index.js';

/**
 * Create a new company.
 */
export async function createCompany(data: CreateCompanyInput) {
  logger.info({ name: data.name }, 'Creating company');

  const company = await prisma.company.create({
    data: {
      name: data.name,
      website: data.website || null,
      support_email: data.support_email,
      sales_email: data.sales_email,
      knowledge_base_url: data.knowledge_base_url || null,
      signup_url: data.signup_url || null,
      whatsapp_number: data.whatsapp_number,
      active: data.active,
    },
  });

  logger.info({ company_id: company.id }, 'Company created');
  return company;
}

/**
 * Get a company by ID.
 */
export async function getCompanyById(id: string) {
  logger.info({ company_id: id }, 'Fetching company');

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      leads: {
        select: { id: true, business_name: true, status: true, interest_level: true },
        take: 50,
        orderBy: { created_at: 'desc' },
      },
    },
  });

  return company;
}
