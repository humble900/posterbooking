import { Router } from 'express';
import { saveCallSummaryHandler, getCallsHandler } from '../controllers/callController.js';

const router = Router();

/**
 * @openapi
 * /api/call-summary:
 *   post:
 *     tags: [Calls]
 *     summary: Save a call summary
 *     description: Stores call data from Retell AI including transcript, recording URL, summary, duration, and call outcome.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lead_id:
 *                 type: string
 *                 format: uuid
 *               retell_call_id:
 *                 type: string
 *                 example: "call_abc123xyz"
 *               duration:
 *                 type: integer
 *                 example: 180
 *                 description: Call duration in seconds
 *               recording_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://storage.retellai.com/recordings/abc123.wav"
 *               transcript:
 *                 type: string
 *                 example: "Agent: Hello, this is Sarah from PosterBooking..."
 *               summary:
 *                 type: string
 *                 example: "Prospect is interested in digital signage for 5 locations."
 *               call_status:
 *                 type: string
 *                 enum: [completed, failed, no_answer, busy, canceled, voicemail]
 *                 example: completed
 *               ended_reason:
 *                 type: string
 *                 example: "Call ended normally"
 *           example:
 *             lead_id: "550e8400-e29b-41d4-a716-446655440000"
 *             retell_call_id: "call_abc123xyz"
 *             duration: 180
 *             recording_url: "https://storage.retellai.com/recordings/abc123.wav"
 *             transcript: "Agent: Hello, this is Sarah from PosterBooking..."
 *             summary: "Prospect is interested in digital signage for 5 locations."
 *             call_status: "completed"
 *             ended_reason: "Call ended normally"
 *     responses:
 *       201:
 *         description: Call summary saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 call_id:
 *                   type: string
 *                   format: uuid
 *                 call_status:
 *                   type: string
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/api/call-summary', saveCallSummaryHandler);

/**
 * @openapi
 * /api/calls:
 *   get:
 *     tags: [Calls]
 *     summary: List calls
 *     description: Returns a paginated list of call records.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *       - in: query
 *         name: lead_id
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: call_status
 *         schema:
 *           type: string
 *           enum: [completed, failed, no_answer, busy, canceled, voicemail]
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Paginated list of calls
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
 *                     $ref: '#/components/schemas/Call'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/api/calls', getCallsHandler);

export default router;
