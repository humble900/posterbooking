import { z } from 'zod';

// ── Lead Schemas ───────────────────────────

export const CreateLeadSchema = z.object({
  company_id: z.string().uuid().optional(),
  business_name: z.string().min(1, 'business_name is required').max(255),
  contact_name: z.string().max(255).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email('Invalid email format').optional(),
  industry: z.string().max(100).optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  number_of_locations: z.coerce.number().int().min(0).optional(),
  estimated_screens: z.coerce.number().int().min(0).optional(),
  current_solution: z.string().max(500).optional(),
  interest_level: z.enum(['Hot', 'Warm', 'Cold', 'Unknown']).optional().default('Unknown'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Demo_Scheduled', 'Closed_Won', 'Closed_Lost']).optional().default('New'),
  notes: z.string().max(5000).optional(),
  call_id: z.string().optional(),
});

export const LeadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Demo_Scheduled', 'Closed_Won', 'Closed_Lost']).optional(),
  interest_level: z.enum(['Hot', 'Warm', 'Cold', 'Unknown']).optional(),
  search: z.string().max(255).optional(),
  company_id: z.string().uuid().optional(),
  sort_by: z.enum(['created_at', 'updated_at', 'business_name']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

// ── Email Schema ───────────────────────────

export const SendEmailSchema = z.object({
  lead_id: z.string().uuid('Invalid lead_id format').optional(),
  email: z.string().email('Invalid email format'),
  template: z.string().min(1, 'template is required').max(100),
});

// ── SMS Schema ─────────────────────────────

export const SendSmsSchema = z.object({
  lead_id: z.string().uuid().optional(),
  phone: z.string().min(1, 'phone is required').max(50),
  message: z.string().min(1, 'message is required').max(1600),
});

// ── Call Summary Schema ────────────────────

export const CallSummarySchema = z.object({
  lead_id: z.string().uuid().optional(),
  retell_call_id: z.string().optional(),
  duration: z.coerce.number().int().min(0).optional(),
  recording_url: z.string().url().optional().or(z.literal('')),
  transcript: z.string().optional(),
  summary: z.string().optional(),
  call_status: z.enum(['completed', 'failed', 'no_answer', 'busy', 'canceled', 'voicemail']).optional().default('completed'),
  ended_reason: z.string().max(500).optional(),
});

// ── Company Schema ─────────────────────────

export const CreateCompanySchema = z.object({
  name: z.string().min(1, 'name is required').max(255),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  support_email: z.string().email().optional(),
  sales_email: z.string().email().optional(),
  knowledge_base_url: z.string().url().optional().or(z.literal('')),
  signup_url: z.string().url().optional().or(z.literal('')),
  whatsapp_number: z.string().max(50).optional(),
  active: z.boolean().optional().default(true),
});

// ── Call Query Schema ──────────────────────

export const CallQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  lead_id: z.string().uuid().optional(),
  call_status: z.enum(['completed', 'failed', 'no_answer', 'busy', 'canceled', 'voicemail']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

// ── Inferred Types ─────────────────────────

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;
export type LeadQueryInput = z.infer<typeof LeadQuerySchema>;
export type SendEmailInput = z.infer<typeof SendEmailSchema>;
export type SendSmsInput = z.infer<typeof SendSmsSchema>;
export type CallSummaryInput = z.infer<typeof CallSummarySchema>;
export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;
export type CallQueryInput = z.infer<typeof CallQuerySchema>;
