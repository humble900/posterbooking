-- CreateEnum
CREATE TYPE "InterestLevel" AS ENUM ('Hot', 'Warm', 'Cold', 'Unknown');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('New', 'Contacted', 'Qualified', 'Demo_Scheduled', 'Closed_Won', 'Closed_Lost');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('completed', 'failed', 'no_answer', 'busy', 'canceled', 'voicemail');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('sent', 'delivered', 'bounced', 'failed');

-- CreateEnum
CREATE TYPE "SmsStatus" AS ENUM ('sent', 'delivered', 'failed', 'simulated');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "support_email" TEXT,
    "sales_email" TEXT,
    "knowledge_base_url" TEXT,
    "signup_url" TEXT,
    "whatsapp_number" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "company_id" TEXT,
    "business_name" TEXT NOT NULL,
    "contact_name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "number_of_locations" INTEGER,
    "estimated_screens" INTEGER,
    "current_solution" TEXT,
    "interest_level" "InterestLevel" NOT NULL DEFAULT 'Unknown',
    "status" "LeadStatus" NOT NULL DEFAULT 'New',
    "notes" TEXT,
    "call_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calls" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT,
    "retell_call_id" TEXT,
    "duration" INTEGER,
    "recording_url" TEXT,
    "transcript" TEXT,
    "summary" TEXT,
    "call_status" "CallStatus" NOT NULL DEFAULT 'completed',
    "ended_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT,
    "email" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'resend',
    "provider_message_id" TEXT,
    "status" "EmailStatus" NOT NULL DEFAULT 'sent',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_logs" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT,
    "phone" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'twilio',
    "message" TEXT NOT NULL,
    "status" "SmsStatus" NOT NULL DEFAULT 'sent',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sms_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "request_body" TEXT,
    "response_status" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_company_id_idx" ON "leads"("company_id");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_interest_level_idx" ON "leads"("interest_level");

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "calls_retell_call_id_key" ON "calls"("retell_call_id");

-- CreateIndex
CREATE INDEX "calls_lead_id_idx" ON "calls"("lead_id");

-- CreateIndex
CREATE INDEX "calls_retell_call_id_idx" ON "calls"("retell_call_id");

-- CreateIndex
CREATE INDEX "calls_created_at_idx" ON "calls"("created_at");

-- CreateIndex
CREATE INDEX "emails_lead_id_idx" ON "emails"("lead_id");

-- CreateIndex
CREATE INDEX "emails_created_at_idx" ON "emails"("created_at");

-- CreateIndex
CREATE INDEX "sms_logs_lead_id_idx" ON "sms_logs"("lead_id");

-- CreateIndex
CREATE INDEX "sms_logs_created_at_idx" ON "sms_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sms_logs" ADD CONSTRAINT "sms_logs_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
