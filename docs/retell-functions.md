# Retell AI Custom Functions — PosterBooking Backend

This document describes all custom functions available for the Retell AI agent. Each function maps to an API endpoint on the PosterBooking backend.

---

## Authentication

All functions require an API key passed as a Bearer token:

```
Authorization: Bearer YOUR_API_KEY
```

---

## 1. `create_lead`

Creates a new sales lead in the database.

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /api/leads` |
| **Method** | POST |
| **Auth Required** | Yes |

### JSON Schema

```json
{
  "type": "object",
  "required": ["business_name"],
  "properties": {
    "business_name": {
      "type": "string",
      "description": "The name of the business"
    },
    "contact_name": {
      "type": "string",
      "description": "The name of the contact person"
    },
    "phone": {
      "type": "string",
      "description": "Phone number of the contact"
    },
    "email": {
      "type": "string",
      "description": "Email address of the contact"
    },
    "industry": {
      "type": "string",
      "description": "Industry of the business"
    },
    "website": {
      "type": "string",
      "description": "Business website URL"
    },
    "number_of_locations": {
      "type": "integer",
      "description": "Number of business locations"
    },
    "estimated_screens": {
      "type": "integer",
      "description": "Estimated number of digital screens"
    },
    "current_solution": {
      "type": "string",
      "description": "Current signage solution the business uses"
    },
    "interest_level": {
      "type": "string",
      "enum": ["Hot", "Warm", "Cold", "Unknown"],
      "description": "Level of interest in PosterBooking"
    },
    "notes": {
      "type": "string",
      "description": "Additional notes from the conversation"
    }
  }
}
```

### Example Payload

```json
{
  "business_name": "Acme Corp",
  "contact_name": "John Doe",
  "phone": "+14155551234",
  "email": "john@acme.com",
  "industry": "Retail",
  "number_of_locations": 3,
  "estimated_screens": 10,
  "interest_level": "Hot",
  "notes": "Interested in multi-location pricing"
}
```

### Example Response

```json
{
  "success": true,
  "lead_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| 401 | Missing Authorization header |
| 403 | Invalid API key |
| 422 | Validation error (invalid fields) |
| 500 | Internal server error |

---

## 2. `send_email`

Sends an email to a lead using Resend.

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /api/email` |
| **Method** | POST |
| **Auth Required** | Yes |

### JSON Schema

```json
{
  "type": "object",
  "required": ["email", "template"],
  "properties": {
    "lead_id": {
      "type": "string",
      "description": "UUID of the lead to associate the email with"
    },
    "email": {
      "type": "string",
      "description": "Recipient email address"
    },
    "template": {
      "type": "string",
      "enum": ["signup", "follow_up", "demo"],
      "description": "Email template to send"
    }
  }
}
```

### Example Payload

```json
{
  "lead_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@acme.com",
  "template": "signup"
}
```

### Example Response

```json
{
  "success": true,
  "email_id": "660e8400-e29b-41d4-a716-446655440001",
  "status": "sent",
  "provider_message_id": "re_abc123xyz"
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| 401 | Missing Authorization header |
| 403 | Invalid API key |
| 422 | Validation error |
| 500 | Email send failure |

---

## 3. `send_sms`

Sends an SMS to a phone number via Twilio.

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /api/sms` |
| **Method** | POST |
| **Auth Required** | Yes |

### JSON Schema

```json
{
  "type": "object",
  "required": ["phone", "message"],
  "properties": {
    "lead_id": {
      "type": "string",
      "description": "UUID of the lead to associate the SMS with"
    },
    "phone": {
      "type": "string",
      "description": "Recipient phone number in E.164 format"
    },
    "message": {
      "type": "string",
      "description": "SMS message content (max 1600 characters)"
    }
  }
}
```

### Example Payload

```json
{
  "phone": "+14155551234",
  "message": "Thanks for your interest in PosterBooking! Sign up at https://posterbooking.com/signup"
}
```

### Example Response

```json
{
  "success": true,
  "sms_id": "770e8400-e29b-41d4-a716-446655440002",
  "status": "sent",
  "provider": "twilio"
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| 401 | Missing Authorization header |
| 403 | Invalid API key |
| 422 | Validation error |
| 500 | SMS send failure |

> **Note**: If Twilio is not configured, the status will be `simulated` and the provider will be `simulated`.

---

## 4. `save_call_summary`

Stores call data including transcript, recording URL, summary, and outcome.

| Property | Value |
|----------|-------|
| **Endpoint** | `POST /api/call-summary` |
| **Method** | POST |
| **Auth Required** | Yes |

### JSON Schema

```json
{
  "type": "object",
  "properties": {
    "lead_id": {
      "type": "string",
      "description": "UUID of the lead associated with the call"
    },
    "retell_call_id": {
      "type": "string",
      "description": "Retell AI call identifier"
    },
    "duration": {
      "type": "integer",
      "description": "Call duration in seconds"
    },
    "recording_url": {
      "type": "string",
      "description": "URL to the call recording"
    },
    "transcript": {
      "type": "string",
      "description": "Full call transcript"
    },
    "summary": {
      "type": "string",
      "description": "Summary of the call"
    },
    "call_status": {
      "type": "string",
      "enum": ["completed", "failed", "no_answer", "busy", "canceled", "voicemail"],
      "description": "Outcome status of the call"
    },
    "ended_reason": {
      "type": "string",
      "description": "Reason the call ended"
    }
  }
}
```

### Example Payload

```json
{
  "lead_id": "550e8400-e29b-41d4-a716-446655440000",
  "retell_call_id": "call_abc123xyz",
  "duration": 180,
  "recording_url": "https://storage.retellai.com/recordings/abc123.wav",
  "transcript": "Agent: Hello, this is Sarah from PosterBooking...",
  "summary": "Prospect is interested in digital signage for 5 locations.",
  "call_status": "completed",
  "ended_reason": "Call ended normally"
}
```

### Example Response

```json
{
  "success": true,
  "call_id": "880e8400-e29b-41d4-a716-446655440003",
  "call_status": "completed"
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| 401 | Missing Authorization header |
| 403 | Invalid API key |
| 422 | Validation error |
| 409 | Duplicate retell_call_id |
| 500 | Internal server error |

---

## 5. `get_company`

Retrieves company details (used by the AI agent to get knowledge base URLs, signup links, etc.).

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /api/company/:id` |
| **Method** | GET |
| **Auth Required** | Yes |

### JSON Schema

```json
{
  "type": "object",
  "required": ["id"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Company UUID"
    }
  }
}
```

### Example Request

```
GET /api/company/pb-default-001
Authorization: Bearer YOUR_API_KEY
```

### Example Response

```json
{
  "success": true,
  "company": {
    "id": "pb-default-001",
    "name": "PosterBooking",
    "website": "https://posterbooking.com",
    "support_email": "support@posterbooking.com",
    "sales_email": "sales@posterbooking.com",
    "knowledge_base_url": "https://posterbooking.com/help",
    "signup_url": "https://posterbooking.com/signup",
    "active": true
  }
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| 401 | Missing Authorization header |
| 403 | Invalid API key |
| 404 | Company not found |

---

## 6. `health_check`

Checks if the API is running.

| Property | Value |
|----------|-------|
| **Endpoint** | `GET /health` |
| **Method** | GET |
| **Auth Required** | No |

### Example Request

```
GET /health
```

### Example Response

```json
{
  "status": "ok"
}
```
