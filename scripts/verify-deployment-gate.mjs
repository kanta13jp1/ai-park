import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("=================================================");
console.log("🛡️  MightyLINK AI Park: Deployment Quality Gate");
console.log("=================================================");
console.log("デプロイ前チェック: 事実確認・実装未完了項目の検査を開始します...\n");

let hasErrors = false;

// 1. feature-status.ts のパース
const featureStatusPath = path.join(rootDir, "src", "data", "feature-status.ts");
if (!fs.existsSync(featureStatusPath)) {
  console.error("❌ エラー: src/data/feature-status.ts が見つかりません。");
  process.exit(1);
}

const featureStatusContent = fs.readFileSync(featureStatusPath, "utf-8");

// 未確認機能リストの抽出
const unverifiedHrefs = [];
const unverifiedRegex = /href:\s*["']([^"']+)["'],\s*isVerified:\s*false/g;
let match;
while ((match = unverifiedRegex.exec(featureStatusContent)) !== null) {
  unverifiedHrefs.push(match[1]);
}

console.log(`📋 事実確認・未完了（未連携・検証中）の対象機能: ${unverifiedHrefs.length} 件`);
unverifiedHrefs.forEach((href) => console.log(`   - ${href}`));
console.log("");

// 2. ナビゲーション類の検査（未確認機能が「稼働中」「公開中」になっていないか）
//    サイドバー（navigation.ts）に加え、目的別ナビ（PurposeJump.tsx）も対象にする
const navContent = ["src/data/navigation.ts", "src/components/PurposeJump.tsx"]
  .map((rel) => fs.readFileSync(path.join(rootDir, rel), "utf-8"))
  .join("\n");

const forbiddenProductionBadges = ["稼働中", "公開中", "正式運用", "本番稼働", "運用中"];

unverifiedHrefs.forEach((href) => {
  // 同じ href が複数のナビに載ることがあるため、すべての出現箇所の badge を検査する
  const itemRegex = new RegExp(`href:\\s*["']${href}["'][^}]*?badge:\\s*["']([^"']+)["']`, "gs");
  const reverseItemRegex = new RegExp(`badge:\\s*["']([^"']+)["'][^{}]*?href:\\s*["']${href}["']`, "gs");
  const badges = [...navContent.matchAll(itemRegex), ...navContent.matchAll(reverseItemRegex)].map((m) => m[1]);

  for (const badge of badges) {
    for (const forbidden of forbiddenProductionBadges) {
      if (badge.includes(forbidden)) {
        console.error(
          `❌ GATE VIOLATION [Navigation]: "${href}" は事実確認・本番連携が未完了ですが、badge に「${badge}」が指定されています！`
        );
        console.error(`   👉 修正指示: "🚧 工事中", "🧪 PoC中", "📋 準備中" 等のステータスに変更してください。\n`);
        hasErrors = true;
      }
    }
  }
});

// 3. 各ページの実装内ディスクレーマー（工事中・サンプルデータ表示）の検査
unverifiedHrefs.forEach((href) => {
  const pageRelPath = path.join("src", "app", href.replace(/^\//, ""), "page.tsx");
  const pageFullPath = path.join(rootDir, pageRelPath);

  if (!fs.existsSync(pageFullPath)) {
    console.warn(`⚠️ 警告: ページファイル ${pageRelPath} が存在しません。`);
    return;
  }

  const pageContent = fs.readFileSync(pageFullPath, "utf-8");

  // 工事中、準備中、PoC、サンプルデータ等の表示があるかチェック
  const disclaimerKeywords = ["工事中", "準備中", "PoC", "サンプル", "試作", "モデルケース"];
  const hasDisclaimer = disclaimerKeywords.some((kw) => pageContent.includes(kw));

  if (!hasDisclaimer) {
    console.error(
      `❌ GATE VIOLATION [Page Content]: ${pageRelPath} に「工事中」「準備中」「PoC」「サンプル」等の注意書きが見当たりません！`
    );
    console.error(
      `   👉 修正指示: ユーザーが正式データと誤認しないよう、注意書きバナー（UnderConstructionBanner等）を配置してください。\n`
    );
    hasErrors = true;
  } else {
    console.log(`✅ OK: ${pageRelPath} に未確認・工事中・サンプルの注記を確認しました。`);
  }
});

console.log("\n=================================================");
if (hasErrors) {
  console.error("🚨 品質ゲート不合格: 事実確認が未完了な項目が本番公開用として検出されました。");
  console.error("   上記の指摘事項を修正後、再度ビルドを実行してください。");
  console.error("=================================================");
  process.exit(1);
} else {
  console.log("🎉 品質ゲート通過: すべての未確認項目が誠実に「工事中 / 準備中 / PoC」として管理されています。");
  console.log("   本番デプロイを承認します。");
  console.log("=================================================");
  process.exit(0);
}
