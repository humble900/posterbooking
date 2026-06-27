import { Router } from 'express';
import { sendEmailHandler } from '../controllers/emailController.js';

const router = Router();

/**
 * @openapi
 * /api/email:
 *   post:
 *     tags: [Email]
 *     summary: Send an email
 *     description: Sends an email using Resend and logs it to the database. Available templates are signup, follow_up, and demo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, template]
 *             properties:
 *               lead_id:
 *                 type: string
 *                 format: uuid
 *                 description: Optional lead ID to associate the email with
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@acme.com
 *               template:
 *                 type: string
 *                 enum: [signup, follow_up, demo]
 *                 example: signup
 *           example:
 *             lead_id: "550e8400-e29b-41d4-a716-446655440000"
 *             email: "john@acme.com"
 *             template: "signup"
 *     responses:
 *       201:
 *         description: Email sent and logged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 email_id:
 *                   type: string
 *                   format: uuid
 *                 status:
 *                   type: string
 *                   example: sent
 *                 provider_message_id:
 *                   type: string
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/api/email', sendEmailHandler);

export default router;
