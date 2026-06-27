import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PosterBooking AI Reception API',
      version: '1.0.0',
      description:
        'Production-ready backend API for Retell AI outbound sales agent. Multi-tenant SaaS architecture supporting lead management, call summaries, email/SMS automation.',
      contact: {
        name: 'PosterBooking Support',
        email: 'support@posterbooking.com',
      },
    },
    servers: [
      {
        url: '/',
        description: 'Current server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'API Key',
          description: 'Pass your API key as a Bearer token in the Authorization header.',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Validation failed' },
            details: { type: 'object' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 42 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
            total_pages: { type: 'integer', example: 3 },
          },
        },
        Lead: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            company_id: { type: 'string', format: 'uuid', nullable: true },
            business_name: { type: 'string', example: 'Acme Corp' },
            contact_name: { type: 'string', example: 'John Doe' },
            phone: { type: 'string', example: '+14155551234' },
            email: { type: 'string', format: 'email', example: 'john@acme.com' },
            industry: { type: 'string', example: 'Retail' },
            website: { type: 'string', example: 'https://acme.com' },
            number_of_locations: { type: 'integer', example: 3 },
            estimated_screens: { type: 'integer', example: 10 },
            current_solution: { type: 'string', example: 'Manual posters' },
            interest_level: { type: 'string', enum: ['Hot', 'Warm', 'Cold', 'Unknown'] },
            status: { type: 'string', enum: ['New', 'Contacted', 'Qualified', 'Demo_Scheduled', 'Closed_Won', 'Closed_Lost'] },
            notes: { type: 'string' },
            call_id: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Company: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'PosterBooking' },
            website: { type: 'string', example: 'https://posterbooking.com' },
            support_email: { type: 'string', example: 'support@posterbooking.com' },
            sales_email: { type: 'string', example: 'sales@posterbooking.com' },
            knowledge_base_url: { type: 'string' },
            signup_url: { type: 'string' },
            whatsapp_number: { type: 'string', nullable: true },
            active: { type: 'boolean', example: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Call: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            lead_id: { type: 'string', format: 'uuid', nullable: true },
            retell_call_id: { type: 'string' },
            duration: { type: 'integer', example: 180 },
            recording_url: { type: 'string' },
            transcript: { type: 'string' },
            summary: { type: 'string' },
            call_status: { type: 'string', enum: ['completed', 'failed', 'no_answer', 'busy', 'canceled', 'voicemail'] },
            ended_reason: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ ApiKeyAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
