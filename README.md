# PosterBooking AI Reception Backend

Production-ready backend API for Retell AI outbound sales agent. Multi-tenant SaaS architecture supporting lead management, call summaries, email/SMS automation, and comprehensive audit logging.

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js 22+ | Runtime |
| TypeScript | Type safety |
| Express.js 5 | HTTP framework |
| PostgreSQL | Database |
| Prisma ORM | Database access |
| Zod | Request validation |
| Pino | Structured logging |
| Resend | Email delivery |
| Twilio | SMS delivery (optional) |
| Swagger/OpenAPI | API documentation |
| Helmet | Security headers |
| Railway | Deployment |

---

## Quick Start

### Prerequisites

- Node.js 22+
- PostgreSQL (or Railway database)
- npm

### 1. Clone & Install

```bash
git clone <repo-url>
cd posterbooking-ai
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/posterbooking
API_KEY=your-secret-api-key
RESEND_API_KEY=re_your_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 3. Run Migrations

```bash
npx prisma migrate dev --name init
```

### 4. Seed Database

```bash
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

The server starts at `http://localhost:3000`.

- **Health**: http://localhost:3000/health
- **Swagger**: http://localhost:3000/api-docs

---

## Railway Deployment

### 1. Create Railway Project

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Add PostgreSQL
railway add --database postgres
```

### 2. Set Environment Variables

```bash
railway variables set API_KEY=your-secret-api-key
railway variables set RESEND_API_KEY=re_your_key
railway variables set RESEND_FROM_EMAIL=noreply@yourdomain.com
railway variables set NODE_ENV=production
```

> **Note**: `DATABASE_URL` is automatically set by Railway when you add PostgreSQL.

### 3. Deploy

```bash
railway up
```

Railway will automatically:
- Install dependencies
- Generate Prisma client
- Run migrations
- Build TypeScript
- Start the server

### 4. Get Your URL

```bash
railway domain
```

### 5. Verify

```bash
curl https://your-app.up.railway.app/health
```

---

## API Endpoints

All endpoints (except `/health` and `/api-docs`) require authentication:

```
Authorization: Bearer YOUR_API_KEY
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check (no auth) |
| POST | `/api/leads` | Create a lead |
| GET | `/api/leads` | List leads (paginated) |
| GET | `/api/leads/:id` | Get lead by ID |
| POST | `/api/email` | Send email |
| POST | `/api/sms` | Send SMS |
| POST | `/api/call-summary` | Save call summary |
| GET | `/api/calls` | List calls (paginated) |
| POST | `/api/company` | Create company |
| GET | `/api/company/:id` | Get company by ID |

### Example: Create a Lead

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "Acme Corp",
    "contact_name": "John Doe",
    "phone": "+14155551234",
    "email": "john@acme.com",
    "industry": "Retail",
    "number_of_locations": 3,
    "estimated_screens": 10,
    "interest_level": "Hot",
    "notes": "Interested in multi-location pricing"
  }'
```

Response:

```json
{
  "success": true,
  "lead_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Example: List Leads (with filters)

```bash
curl "http://localhost:3000/api/leads?status=New&interest_level=Hot&search=acme&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Example: Send Email

```bash
curl -X POST http://localhost:3000/api/email \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@acme.com",
    "template": "signup"
  }'
```

---

## Prisma Commands

```bash
# Generate client
npx prisma generate

# Create migration
npx prisma migrate dev --name <migration_name>

# Deploy migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (GUI)
npx prisma studio

# Seed database
npm run seed

# Reset database
npx prisma migrate reset
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string |
| `API_KEY` | **Yes** | — | API authentication key |
| `RESEND_API_KEY` | No | — | Resend API key for emails |
| `RESEND_FROM_EMAIL` | No | noreply@posterbooking.com | Email sender address |
| `TWILIO_ACCOUNT_SID` | No | — | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | No | — | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | No | — | Twilio phone number |
| `RATE_LIMIT_WINDOW_MS` | No | 900000 | Rate limit window (ms) |
| `RATE_LIMIT_MAX_REQUESTS` | No | 100 | Max requests per window |
| `CORS_ORIGIN` | No | * | CORS allowed origins |
| `LOG_LEVEL` | No | info | Pino log level |

---

## Retell AI Configuration

See the following docs for Retell AI integration:

- [`docs/retell-functions.md`](docs/retell-functions.md) — Function documentation
- [`docs/retell-function-schemas.json`](docs/retell-function-schemas.json) — JSON schemas for import
- [`docs/retell-setup.md`](docs/retell-setup.md) — Step-by-step setup guide

---

## Folder Structure

```
posterbooking-ai/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seed script
│   └── migrations/            # Auto-generated migrations
├── src/
│   ├── index.ts               # App entry point
│   ├── routes/
│   │   ├── health.ts          # GET /health
│   │   ├── leads.ts           # Lead endpoints
│   │   ├── email.ts           # Email endpoint
│   │   ├── sms.ts             # SMS endpoint
│   │   ├── calls.ts           # Call endpoints
│   │   └── companies.ts       # Company endpoints
│   ├── controllers/
│   │   ├── healthController.ts
│   │   ├── leadController.ts
│   │   ├── emailController.ts
│   │   ├── smsController.ts
│   │   ├── callController.ts
│   │   └── companyController.ts
│   ├── services/
│   │   ├── leadService.ts     # Lead business logic
│   │   ├── emailService.ts    # Resend integration
│   │   ├── smsService.ts      # Twilio integration
│   │   ├── callService.ts     # Call summary logic
│   │   ├── companyService.ts  # Company operations
│   │   └── auditService.ts    # Audit logging
│   ├── middleware/
│   │   ├── auth.ts            # API key authentication
│   │   ├── logger.ts          # Pino request logging
│   │   ├── errorHandler.ts    # Global error handler
│   │   ├── rateLimiter.ts     # Rate limiting
│   │   └── auditLog.ts        # Audit log middleware
│   ├── types/
│   │   ├── schemas.ts         # Zod validation schemas
│   │   └── index.ts           # Type exports
│   └── utils/
│       ├── prisma.ts          # Prisma client singleton
│       ├── config.ts          # Environment config
│       ├── responses.ts       # Response helpers
│       └── swagger.ts         # OpenAPI spec
├── docs/
│   ├── retell-functions.md    # Retell function docs
│   ├── retell-function-schemas.json  # Retell JSON schemas
│   └── retell-setup.md        # Retell setup guide
├── .env.example               # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── railway.toml               # Railway deployment config
├── Procfile
└── README.md
```

---

## Security

- **Helmet** — Security headers
- **CORS** — Configurable origin restrictions
- **Rate Limiting** — 100 requests / 15 minutes per IP
- **API Key Auth** — Bearer token authentication
- **Zod Validation** — Input validation on all endpoints
- **Prisma ORM** — SQL injection protection
- **Audit Logging** — Every API action recorded
- **Body Sanitization** — Sensitive fields redacted from logs

---

## Testing

### Health Check

```bash
curl http://localhost:3000/health
```

### Authenticated Request

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:3000/api/leads
```

### Swagger UI

Open http://localhost:3000/api-docs in your browser.

### Prisma Studio

```bash
npx prisma studio
```

---

## License

Proprietary — PosterBooking
