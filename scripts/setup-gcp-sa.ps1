# ==============================================================================
# MightyLINK AI Park: GCP サービスアカウント自動セットアップ & GitHub Secrets 登録スクリプト
# ==============================================================================
# 実行条件:
# 1. Google Cloud SDK (gcloud) がインストールされ、プロジェクト編集権限のあるアカウントでログインしていること
# 2. GitHub CLI (gh) がインストールされ、リポジトリへの write 権限があること
# ==============================================================================

param(
    [string]$ProjectId = "antigravity-pj-509006",
    [string]$ServiceAccountName = "ai-park-usage-sync",
    [string]$DisplayName = "AI Park Usage Sync Service Account",
    [string]$Role = "roles/logging.viewer"
)

$ErrorActionPreference = "Stop"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  MightyLINK AI Park: GCP SA Setup Pipeline      " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. 前提条件チェック
Write-Host "`n[Step 1/5] 前提条件の検査..." -ForegroundColor Yellow
if (-not (Get-Command "gcloud" -ErrorAction SilentlyContinue)) {
    Write-Error "Google Cloud SDK (gcloud) が見つかりません。インストールしてください。"
}
if (-not (Get-Command "gh" -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI (gh) が見つかりません。インストールしてください。"
}
Write-Host "  OK: gcloud, gh CLI の存在を確認しました。" -ForegroundColor Green

# 2. サービスアカウントの存在確認 / 作成
$saEmail = "$ServiceAccountName@$ProjectId.iam.gserviceaccount.com"
Write-Host "`n[Step 2/5] サービスアカウントの確認: $saEmail" -ForegroundColor Yellow

$existingSa = gcloud iam service-accounts list --project=$ProjectId --filter="email:$saEmail" --format="value(email)" 2>$null
if (-not $existingSa) {
    Write-Host "  新規作成中: $ServiceAccountName ..." -ForegroundColor Cyan
    gcloud iam service-accounts create $ServiceAccountName `
        --project=$ProjectId `
        --display-name="$DisplayName" `
        --description="Antigravity 利用実績ログ同期用サービスアカウント (AI Park)"
    Write-Host "  OK: サービスアカウントを作成しました。" -ForegroundColor Green
} else {
    Write-Host "  OK: 既存のサービスアカウントを検出しました。" -ForegroundColor Green
}

# 3. 権限（Logging 閲覧者）の付与
Write-Host "`n[Step 3/5] IAM ロールの付与 ($Role)..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$saEmail" `
    --role="$Role" `
    --condition=None `
    --quiet
Write-Host "  OK: ロール ($Role) をバインドしました。" -ForegroundColor Green

# 4. キーの発行（一時ファイル）
$tempKeyFile = [System.IO.Path]::Combine($PSScriptRoot, ".temp-sa-key.json")
Write-Host "`n[Step 4/5] サービスアカウントキーの発行..." -ForegroundColor Yellow
if (Test-Path $tempKeyFile) { Remove-Item $tempKeyFile -Force }

gcloud iam service-accounts keys create $tempKeyFile `
    --iam-account=$saEmail `
    --project=$ProjectId `
    --key-file-type="json"
Write-Host "  OK: 一時キーファイルを生成しました。" -ForegroundColor Green

# 5. GitHub Secrets (GCP_SA_KEY) への登録
Write-Host "`n[Step 5/5] GitHub Secrets (GCP_SA_KEY) への暗号化登録..." -ForegroundColor Yellow
try {
    gh secret set GCP_SA_KEY < $tempKeyFile
    Write-Host "  OK: GitHub Secrets 'GCP_SA_KEY' の登録に成功しました！" -ForegroundColor Green
} finally {
    # セキュリティ: 一時キーファイルの完全削除
    if (Test-Path $tempKeyFile) {
        Remove-Item $tempKeyFile -Force
        Write-Host "  OK: 一時キーファイルを安全に削除しました。" -ForegroundColor Green
    }
}

Write-Host "`n=================================================" -ForegroundColor Cyan
Write-Host "🎉 セットアップ完了！" -ForegroundColor Green
Write-Host "これ以降、GitHub Actions (sync-gcp-usage.yml) が自動で" -ForegroundColor Green
Write-Host "Google Cloud Logging API をクエリし、利用データを自動更新します。" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
