import { Router } from 'express';
import { createLeadHandler, getLeadsHandler, getLeadByIdHandler } from '../controllers/leadController.js';

const router = Router();

/**
 * @openapi
 * /api/leads:
 *   post:
 *     tags: [Leads]
 *     summary: Create a new lead
 *     description: Creates a new sales lead. Called by Retell AI during outbound calls.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [business_name]
 *             properties:
 *               company_id:
 *                 type: string
 *                 format: uuid
 *                 description: Optional company to associate the lead with
 *               business_name:
 *                 type: string
 *                 example: Acme Corp
 *               contact_name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: "+14155551234"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@acme.com
 *               industry:
 *                 type: string
 *                 example: Retail
 *               website:
 *                 type: string
 *                 example: https://acme.com
 *               number_of_locations:
 *                 type: integer
 *                 example: 3
 *               estimated_screens:
 *                 type: integer
 *                 example: 10
 *               current_solution:
 *                 type: string
 *                 example: Manual posters
 *               interest_level:
 *                 type: string
 *                 enum: [Hot, Warm, Cold, Unknown]
 *                 example: Hot
 *               notes:
 *                 type: string
 *                 example: Interested in multi-location pricing
 *     responses:
 *       201:
 *         description: Lead created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 lead_id:
 *                   type: string
 *                   format: uuid
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 */
router.post('/api/leads', createLeadHandler);

/**
 * @openapi
 * /api/leads:
 *   get:
 *     tags: [Leads]
 *     summary: List leads
 *     description: Returns a paginated list of leads with optional filtering and search.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [New, Contacted, Qualified, Demo_Scheduled, Closed_Won, Closed_Lost]
 *         description: Filter by lead status
 *       - in: query
 *         name: interest_level
 *         schema:
 *           type: string
 *           enum: [Hot, Warm, Cold, Unknown]
 *         description: Filter by interest level
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search across business name, contact, email, phone, industry
 *       - in: query
 *         name: company_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by company
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [created_at, updated_at, business_name]
 *           default: created_at
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Paginated list of leads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lead'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/api/leads', getLeadsHandler);

/**
 * @openapi
 * /api/leads/{id}:
 *   get:
 *     tags: [Leads]
 *     summary: Get a lead by ID
 *     description: Returns a single lead with related calls, emails, and SMS logs.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lead details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 lead:
 *                   $ref: '#/components/schemas/Lead'
 *       404:
 *         description: Lead not found
 */
router.get('/api/leads/:id', getLeadByIdHandler);

export default router;
