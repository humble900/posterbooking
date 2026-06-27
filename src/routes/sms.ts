import { Router } from 'express';
import { sendSmsHandler } from '../controllers/smsController.js';

const router = Router();

/**
 * @openapi
 * /api/sms:
 *   post:
 *     tags: [SMS]
 *     summary: Send an SMS
 *     description: Sends an SMS via Twilio. If Twilio credentials are not configured, the SMS is simulated and logged.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, message]
 *             properties:
 *               lead_id:
 *                 type: string
 *                 format: uuid
 *                 description: Optional lead ID to associate the SMS with
 *               phone:
 *                 type: string
 *                 example: "+14155551234"
 *               message:
 *                 type: string
 *                 example: "Thanks for your interest in PosterBooking! Sign up at https://posterbooking.com/signup"
 *                 maxLength: 1600
 *           example:
 *             phone: "+14155551234"
 *             message: "Thanks for your interest in PosterBooking! Sign up at https://posterbooking.com/signup"
 *     responses:
 *       201:
 *         description: SMS sent (or simulated) and logged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 sms_id:
 *                   type: string
 *                   format: uuid
 *                 status:
 *                   type: string
 *                   enum: [sent, simulated, failed]
 *                 provider:
 *                   type: string
 *                   example: twilio
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/api/sms', sendSmsHandler);

export default router;
