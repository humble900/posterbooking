import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import config from './utils/config.js';
import { swaggerSpec } from './utils/swagger.js';
import { logger, requestLogger } from './middleware/logger.js';
import { authMiddleware } from './middleware/auth.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { auditLogMiddleware } from './middleware/auditLog.js';
import { errorHandler } from './middleware/errorHandler.js';
import prisma from './utils/prisma.js';

// Routes
import healthRoutes from './routes/health.js';
import leadRoutes from './routes/leads.js';
import emailRoutes from './routes/email.js';
import smsRoutes from './routes/sms.js';
import callRoutes from './routes/calls.js';
import companyRoutes from './routes/companies.js';

const app = express();

// ── Security Middleware ────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // Needed for Swagger UI
}));
app.use(cors({
  origin: config.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(rateLimiter);

// ── Body Parsing ───────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ────────────────────────────────
app.use(requestLogger);

// ── Audit Logging ──────────────────────────
app.use(auditLogMiddleware);

// ── Authentication ─────────────────────────
app.use(authMiddleware);

// ── Swagger Documentation ──────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'PosterBooking AI API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// Serve raw OpenAPI spec as JSON
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ── Routes ─────────────────────────────────
app.use(healthRoutes);
app.use(leadRoutes);
app.use(emailRoutes);
app.use(smsRoutes);
app.use(callRoutes);
app.use(companyRoutes);

// ── 404 Handler ────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// ── Global Error Handler ───────────────────
app.use(errorHandler);

// ── Start Server ───────────────────────────
const PORT = config.PORT;

const server = app.listen(PORT, () => {
  logger.info(`🚀 PosterBooking AI Backend running on port ${PORT}`);
  logger.info(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
  logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
  logger.info(`🌍 Environment: ${config.NODE_ENV}`);
});

// ── Graceful Shutdown ──────────────────────
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');
    await prisma.$disconnect();
    logger.info('Database connection closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
