# ==============================================================================
# MightyLINK AI Park: GCP Service Account Setup & GitHub Secrets Registration
# ==============================================================================

param(
    [string]$ProjectId = "antigravity-pj-509006",
    [string]$ServiceAccountName = "ai-park-usage-sync",
    [string]$DisplayName = "AI Park Usage Sync Service Account",
    [string]$Role = "roles/logging.viewer",
    [string]$TargetAccount = "k-umezawa@ml-mightylink.com"
)

$ErrorActionPreference = "Stop"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  MightyLINK AI Park: GCP SA Setup Pipeline      " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Prerequisite Check
Write-Host "`n[Step 1/5] Checking prerequisites & active account..." -ForegroundColor Yellow
if (-not (Get-Command "gcloud" -ErrorAction SilentlyContinue)) {
    Write-Error "Google Cloud SDK (gcloud) is not found. Please install it."
}
if (-not (Get-Command "gh" -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI (gh) is not found. Please install it."
}

# Ensure company account is active
$activeAccount = gcloud config get-value account 2>$null
if ($activeAccount -ne $TargetAccount) {
    Write-Host "  Switching gcloud account to $TargetAccount (currently: $activeAccount)..." -ForegroundColor Cyan
    gcloud config set account $TargetAccount 2>$null
}

# Test authentication
try {
    $null = gcloud projects describe $ProjectId --format="value(projectId)" 2>$null
} catch {
    Write-Host "`n[!] Google Cloud の再認証が必要です。" -ForegroundColor Red
    Write-Host "以下のコマンドを実行してブラウザでログインを完了してください:" -ForegroundColor Yellow
    Write-Host "  gcloud auth login $TargetAccount" -ForegroundColor Cyan
    exit 1
}

Write-Host "  OK: Authenticated as $TargetAccount for project $ProjectId." -ForegroundColor Green

# 2. Check / Create Service Account
$saEmail = "$ServiceAccountName@$ProjectId.iam.gserviceaccount.com"
Write-Host "`n[Step 2/5] Checking service account: $saEmail" -ForegroundColor Yellow

$existingSa = gcloud iam service-accounts list --project=$ProjectId --filter="email:$saEmail" --format="value(email)" 2>$null
if (-not $existingSa) {
    Write-Host "  Creating service account: $ServiceAccountName ..." -ForegroundColor Cyan
    gcloud iam service-accounts create $ServiceAccountName `
        --project=$ProjectId `
        --display-name="$DisplayName" `
        --description="Antigravity usage sync service account"
    Write-Host "  OK: Service account created." -ForegroundColor Green
} else {
    Write-Host "  OK: Existing service account found." -ForegroundColor Green
}

# 3. Bind IAM Role (Logging Viewer)
Write-Host "`n[Step 3/5] Granting IAM Role ($Role)..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$saEmail" `
    --role="$Role" `
    --condition=None `
    --quiet
Write-Host "  OK: IAM role ($Role) bound successfully." -ForegroundColor Green

# 4. Create Service Account Key
$tempKeyFile = [System.IO.Path]::Combine($PSScriptRoot, ".temp-sa-key.json")
Write-Host "`n[Step 4/5] Generating service account key..." -ForegroundColor Yellow
if (Test-Path $tempKeyFile) { 
    Remove-Item $tempKeyFile -Force 
}

gcloud iam service-accounts keys create $tempKeyFile `
    --iam-account=$saEmail `
    --project=$ProjectId `
    --key-file-type="json"
Write-Host "  OK: Temporary key generated." -ForegroundColor Green

# 5. Set GitHub Secret
Write-Host "`n[Step 5/5] Registering GitHub Secrets (GCP_SA_KEY)..." -ForegroundColor Yellow
try {
    Get-Content $tempKeyFile -Raw | gh secret set GCP_SA_KEY
    Write-Host "  OK: Successfully registered GCP_SA_KEY in GitHub Secrets!" -ForegroundColor Green
} finally {
    if (Test-Path $tempKeyFile) {
        Remove-Item $tempKeyFile -Force
        Write-Host "  OK: Temporary key file securely removed." -ForegroundColor Green
    }
}

Write-Host "`n=================================================" -ForegroundColor Cyan
Write-Host "SETUP COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "GitHub Actions (sync-gcp-usage.yml) will now automatically" -ForegroundColor Green
Write-Host "query Cloud Logging and sync usage metrics without manual work." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
