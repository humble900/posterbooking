# ==============================================================================
# PosterBooking AI Backend - Railway Programmatic Deployment Script
# ==============================================================================
# This script configures and deploys the PosterBooking backend programmatically
# using the Railway CLI. It bypasses the Railway UI completely.
#
# Requirements:
# 1. Railway CLI installed (Run: npm i -g @railway/cli)
# 2. Authenticated in CLI (Run: railway login)
# 3. Pushed repository on GitHub (e.g., humble900/posterbooking)
# ==============================================================================

# Configurations
$ProjectID = "002986d1-693b-4ca8-b7ae-f134324c43f3"
$EnvironmentID = "c5d17e2c-22cc-4031-8920-288d9f45eaea"
$ServiceName = "posterbooking-backend"
$GitHubRepo = "humble900/posterbooking"
$Branch = "main"

# Generate a secure API Key for Retell AI integration
$ApiKey = [guid]::NewGuid().ToString()

Write-Host "[START] Starting programmatic Railway setup..." -ForegroundColor Cyan

# 1. Link to the existing Railway project and environment
Write-Host "[LINK] Linking to Railway project ($ProjectID)..." -ForegroundColor Yellow
railway link --project $ProjectID --environment $EnvironmentID
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to link to Railway project. Please ensure you are logged in by running: railway login"
    exit $LASTEXITCODE
}

# 2. Add PostgreSQL database plugin/service (failsafe - will skip if already exists)
Write-Host "[DB] Adding PostgreSQL database service..." -ForegroundColor Yellow
railway add --database postgres
# Note: If database already exists in the project, this is fine and will connect to it.

# 3. Create the backend service linked to the GitHub repository
Write-Host "[SERVICE] Creating and linking backend service ($ServiceName) to GitHub..." -ForegroundColor Yellow
railway add --service $ServiceName --repo $GitHubRepo --branch $Branch
if ($LASTEXITCODE -ne 0) {
    Write-Host "Service may already exist. Continuing to configuration..." -ForegroundColor Gray
}

# 4. Set environment variables programmatically on the backend service
Write-Host "[CONFIG] Setting environment variables..." -ForegroundColor Yellow
$Variables = @(
    "PORT=3000",
    "NODE_ENV=production",
    "API_KEY=$ApiKey",
    "RESEND_FROM_EMAIL=noreply@posterbooking.com",
    "CORS_ORIGIN=*",
    "LOG_LEVEL=info",
    "RATE_LIMIT_WINDOW_MS=900000",
    "RATE_LIMIT_MAX_REQUESTS=100"
)

# Apply each variable to the service
foreach ($Var in $Variables) {
    Write-Host "   Setting $Var" -ForegroundColor Gray
    railway variables set --service $ServiceName $Var
}

# Link the DATABASE_URL dynamically from the PostgreSQL service
Write-Host "   Linking DATABASE_URL to PostgreSQL..." -ForegroundColor Gray
railway variables set --service $ServiceName 'DATABASE_URL=${{Postgres.DATABASE_URL}}'

Write-Host " "
Write-Host "[SUCCESS] Programmatic setup completed!" -ForegroundColor Green
Write-Host "[API KEY] Retell AI API Key: $ApiKey" -ForegroundColor Green
Write-Host "[DEPLOY] To deploy the latest code manually, run: railway up" -ForegroundColor Cyan
