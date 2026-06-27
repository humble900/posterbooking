import { Router } from 'express';
import { createCompanyHandler, getCompanyHandler } from '../controllers/companyController.js';

const router = Router();

/**
 * @openapi
 * /api/company:
 *   post:
 *     tags: [Companies]
 *     summary: Create a company
 *     description: Creates a new company for multi-tenant support.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Acme Digital Signage
 *               website:
 *                 type: string
 *                 format: uri
 *                 example: https://acmedigital.com
 *               support_email:
 *                 type: string
 *                 format: email
 *                 example: support@acmedigital.com
 *               sales_email:
 *                 type: string
 *                 format: email
 *                 example: sales@acmedigital.com
 *               knowledge_base_url:
 *                 type: string
 *                 format: uri
 *               signup_url:
 *                 type: string
 *                 format: uri
 *               whatsapp_number:
 *                 type: string
 *               active:
 *                 type: boolean
 *                 default: true
 *           example:
 *             name: "Acme Digital Signage"
 *             website: "https://acmedigital.com"
 *             support_email: "support@acmedigital.com"
 *             sales_email: "sales@acmedigital.com"
 *             active: true
 *     responses:
 *       201:
 *         description: Company created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 company_id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/api/company', createCompanyHandler);

/**
 * @openapi
 * /api/company/{id}:
 *   get:
 *     tags: [Companies]
 *     summary: Get a company by ID
 *     description: Returns company details with recent leads.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */
router.get('/api/company/:id', getCompanyHandler);

export default router;
