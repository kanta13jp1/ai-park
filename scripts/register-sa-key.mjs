/**
 * register-sa-key.mjs
 * Google Cloud コンソールからダウンロードしたサービスアカウント JSON キーを
 * GitHub Secrets (GCP_SA_KEY) に安全に一発登録するスクリプト
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 引数でファイルパスを受け取るか、Downloads フォルダから自動検出
const args = process.argv.slice(2);
let keyPath = args[0];

if (!keyPath) {
  // ユーザーの Downloads フォルダから最新の antigravity / service-account JSON を探索
  const userProfile = process.env.USERPROFILE || process.env.HOME || '';
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
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('有効なサービスアカウント JSON キーではありません (client_email または private_key が不足しています)');
  }

  console.log(`\n🔑 サービスアカウントを検出: ${parsed.client_email}`);
  console.log('⏳ GitHub Secrets (GCP_SA_KEY) へ暗号化登録中...');

  execSync(`gh secret set GCP_SA_KEY < "${keyPath}"`, { shell: true, stdio: 'inherit' });

  console.log('\n=================================================');
  console.log('🎉 GitHub Secrets (GCP_SA_KEY) への登録が完了しました！');
  console.log('これで定期ワークフロー (sync-gcp-usage.yml) がログを自動取得できるようになりました。');
  console.log('=================================================\n');
} catch (err) {
  console.error('❌ 登録エラー:', err.message);
  process.exit(1);
}
