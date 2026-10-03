/**
 * register-sa-key.mjs
 * Google Cloud サービスアカウント JSON または ユーザー認証情報 (ADC) を
 * GitHub Secrets (GCP_SA_KEY) に安全に一発登録するスクリプト
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 引数でファイルパスを受け取るか、自動検出
const args = process.argv.slice(2);
let keyPath = args[0];

const userProfile = process.env.USERPROFILE || process.env.HOME || '';
const adcPath = path.join(process.env.APPDATA || path.join(userProfile, '.config'), 'gcloud', 'application_default_credentials.json');

if (!keyPath) {
  // 1. Downloads フォルダから最新の JSON を探索
  const downloadsDir = path.join(userProfile, 'Downloads');
  if (fs.existsSync(downloadsDir)) {
    const files = fs.readdirSync(downloadsDir)
      .filter((f) => f.endsWith('.json') && (f.includes('antigravity') || f.includes('key') || f.includes('ai-park')))
      .map((f) => path.join(downloadsDir, f))
      .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

    if (files.length > 0) {
      keyPath = files[0];
      console.log(`🔍 Downloads フォルダから最新のキーファイルを自動検出しました: ${keyPath}`);
    }
  }

  // 2. Downloads になければ gcloud ADC を探索
  if (!keyPath && fs.existsSync(adcPath)) {
    keyPath = adcPath;
    console.log(`🔍 gcloud アプリケーション認証情報 (ADC) を自動検出しました: ${keyPath}`);
  }
}

if (!keyPath || !fs.existsSync(keyPath)) {
  console.error('\n❌ キーファイルが見つかりません。');
  console.error('使用方法: node scripts/register-sa-key.mjs <JSONキーファイルのパス>');
  console.error('例: node scripts/register-sa-key.mjs C:\\Users\\kanta\\Downloads\\antigravity-pj-xxxx.json\n');
  process.exit(1);
}

try {
  const content = fs.readFileSync(keyPath, 'utf-8');
  const parsed = JSON.parse(content);

  const isServiceAccount = parsed.client_email && parsed.private_key;
  const isAuthorizedUser = parsed.type === 'authorized_user' || parsed.refresh_token;

  if (!isServiceAccount && !isAuthorizedUser) {
    throw new Error('有効な Google Cloud 認証キーではありません (サービスアカウントキーまたは ADC 認証情報が必要です)');
  }

  const identity = isServiceAccount ? `サービスアカウント: ${parsed.client_email}` : `ユーザーアカウント: ${parsed.account || 'authorized_user'}`;
  console.log(`\n🔑 認証情報を検出: ${identity}`);
  console.log('⏳ GitHub Secrets (GCP_SA_KEY) へ暗号化登録中...');

  execSync(`gh secret set GCP_SA_KEY < "${keyPath}"`, { shell: true, stdio: 'inherit' });

  console.log('\n=================================================');
  console.log('🎉 GitHub Secrets (GCP_SA_KEY) への登録が完了しました！');
  console.log('これで定期ワークフロー (sync-gcp-usage.yml) が利用データを自動更新できるようになりました。');
  console.log('=================================================\n');
} catch (err) {
  console.error('❌ 登録エラー:', err.message);
  process.exit(1);
}
