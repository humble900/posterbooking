# Retell AI Setup Guide — PosterBooking Backend

Complete guide to configuring Retell AI to use the PosterBooking backend custom functions.

---

## Prerequisites

1. A deployed PosterBooking backend (on Railway or locally)
2. Your backend's base URL (e.g., `https://your-app.up.railway.app`)
3. Your API key (the `API_KEY` environment variable)
4. A Retell AI account

---

## Step 1: Get Your Backend URL

### Railway Deployment

After deploying to Railway, your URL will be:

```
https://your-service-name.up.railway.app
```

Find it in Railway Dashboard → Your Service → Settings → Domains.

### Local Development

If testing locally:

```
http://localhost:3000
```

> **Note**: For local testing with Retell, you'll need a tunnel (e.g., ngrok):
> ```
> ngrok http 3000
> ```

---

## Step 2: Verify the Backend

Test the health endpoint:

```bash
curl https://your-app.up.railway.app/health
```

Expected response:

```json
{"status":"ok"}
```

Test authentication:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://your-app.up.railway.app/api/company/pb-default-001
```

---

## Step 3: Configure Custom Functions in Retell

### 3.1 Open Retell Dashboard

1. Go to [app.retellai.com](https://app.retellai.com)
2. Navigate to your agent
3. Go to **Custom Functions** section

### 3.2 Add Each Function

For each function below, click **"Add Custom Function"** and fill in the details:

---

### Function: `create_lead`

| Field | Value |
|-------|-------|
| **Name** | `create_lead` |
| **Description** | Creates a new sales lead when business info is collected |
| **URL** | `https://your-app.up.railway.app/api/leads` |
| **Method** | POST |
| **Headers** | `Authorization: Bearer YOUR_API_KEY` |
| **Headers** | `Content-Type: application/json` |

**Parameters**: Copy from `retell-function-schemas.json` → `functions[0].parameters`

---

### Function: `send_email`

| Field | Value |
|-------|-------|
| **Name** | `send_email` |
| **Description** | Sends an email to the prospect using a template |
| **URL** | `https://your-app.up.railway.app/api/email` |
| **Method** | POST |
| **Headers** | `Authorization: Bearer YOUR_API_KEY` |
| **Headers** | `Content-Type: application/json` |

**Parameters**: Copy from `retell-function-schemas.json` → `functions[1].parameters`

---

### Function: `send_sms`

| Field | Value |
|-------|-------|
| **Name** | `send_sms` |
| **Description** | Sends an SMS to the prospect |
| **URL** | `https://your-app.up.railway.app/api/sms` |
| **Method** | POST |
| **Headers** | `Authorization: Bearer YOUR_API_KEY` |
| **Headers** | `Content-Type: application/json` |

**Parameters**: Copy from `retell-function-schemas.json` → `functions[2].parameters`

---

### Function: `save_call_summary`

| Field | Value |
|-------|-------|
| **Name** | `save_call_summary` |
| **Description** | Saves transcript, summary, and outcome after the call |
| **URL** | `https://your-app.up.railway.app/api/call-summary` |
| **Method** | POST |
| **Headers** | `Authorization: Bearer YOUR_API_KEY` |
| **Headers** | `Content-Type: application/json` |

**Parameters**: Copy from `retell-function-schemas.json` → `functions[3].parameters`

---

### Function: `get_company`

| Field | Value |
|-------|-------|
| **Name** | `get_company` |
| **Description** | Retrieves PosterBooking company info for answering questions |
| **URL** | `https://your-app.up.railway.app/api/company/pb-default-001` |
| **Method** | GET |
| **Headers** | `Authorization: Bearer YOUR_API_KEY` |

**Parameters**: None required

---

## Step 4: Configure Authentication

In each custom function configuration in Retell:

1. Set the **Authorization** header to:
   ```
   Bearer YOUR_API_KEY
   ```
2. Replace `YOUR_API_KEY` with the actual value of your `API_KEY` environment variable

---

## Step 5: Configure Agent Behavior

In your Retell agent's prompt, instruct it to:

1. **Collect business information** during the conversation
2. Call `create_lead` when enough info is gathered
3. Call `send_email` when the prospect agrees to receive info
4. Call `save_call_summary` when the call is about to end
5. Call `get_company` to retrieve signup URLs and support info

Example agent instruction:

```
When speaking with a prospect:
1. Introduce yourself as calling from PosterBooking
2. Learn about their business (name, industry, locations, current signage)
3. Once you have their business info, call create_lead to save it
4. If they're interested, ask for their email and call send_email with the "signup" template
5. Before ending the call, call save_call_summary with a summary of the conversation
```

---

## Step 6: Testing

### Test with curl

**Create a lead:**

```bash
curl -X POST https://your-app.up.railway.app/api/leads \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "Test Company",
    "contact_name": "Jane Doe",
    "phone": "+14155551234",
    "email": "jane@test.com",
    "industry": "Retail",
    "number_of_locations": 2,
    "estimated_screens": 5,
    "interest_level": "Warm",
    "notes": "Testing from curl"
  }'
```

**Send an email:**

```bash
curl -X POST https://your-app.up.railway.app/api/email \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@test.com",
    "template": "signup"
  }'
```

**Save call summary:**

```bash
curl -X POST https://your-app.up.railway.app/api/call-summary \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "retell_call_id": "call_test_123",
    "duration": 120,
    "transcript": "Agent: Hello, this is Sarah...",
    "summary": "Test call completed successfully",
    "call_status": "completed"
  }'
```

### Test with Retell

1. Use Retell's **Test Call** feature
2. Simulate a conversation
3. Check your database for:
   - New lead created
   - Email sent (check Resend dashboard)
   - Call summary stored

### Verify in Swagger

Open `https://your-app.up.railway.app/api-docs` to test endpoints interactively.

---

## Troubleshooting

### 401 Unauthorized

- Ensure the `Authorization` header is set correctly
- Format: `Bearer YOUR_API_KEY` (with a space after "Bearer")
- Check that `API_KEY` env var is set on Railway

### 422 Validation Error

- Check the response body for field-level errors
- `business_name` is required for lead creation
- `email` must be a valid email format
- `template` must be one of: `signup`, `follow_up`, `demo`

### 500 Internal Server Error

- Check Railway logs: `railway logs`
- Verify `DATABASE_URL` is set correctly
- Ensure Prisma migrations have been applied

### Function Not Being Called

- Verify the URL is correct in Retell's function config
- Check that headers are set (both Authorization and Content-Type)
- Review the agent's prompt to ensure it's instructed to call the function

### Email Not Sending

- Verify `RESEND_API_KEY` is set
- Check that the sending domain is verified in Resend
- Review email logs in the `emails` table

### SMS Not Sending (Simulated)

- If Twilio credentials aren't set, SMS will be simulated
- Check `sms_logs` table — status will show "simulated"
- To enable real SMS, set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

### Railway Deployment Issues

```bash
# Check deployment logs
railway logs

# Check environment variables
railway variables

# Restart service
railway restart
```
