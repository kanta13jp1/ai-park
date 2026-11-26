---
name: certification-hub-standard
description: >-
  AI Park の資格学習ハブ（/aws-info, /azure-info, /gcp-info, /lpic-info, /ipa-info および新規資格ルート）を
  新規作成・拡充・リファクタリング・品質監査するときに使用する専門実装・検証標準スキル。
  データモジュール分割（Node --test 互換）、検索正規化の純粋関数抽出、キーワードバッジ 100% 逆引き保証、
  公式 URL のライブ HTTP 200 検証、WAI-ARIA APG タブ操作、768px 狭幅ガードを標準化する。
---

# Certification Hub Standard（AI Park 資格学習ハブ実装・検証標準）

AI Park 内の資格試験学習ハブ（`src/app/*-info`）で自己流実装と品質ドリフトを防ぐための専門チェックリストです。
サイト全般の必須ルール（架空情報禁止・Next.js 16 内蔵 docs 参照・5 段階 CI ゲート・並行セッション制約）は [AGENTS.md](../../../AGENTS.md)、公開前総合 UAT は [preflight-uat-workflow](../preflight-uat-workflow/SKILL.md) に従い、本スキルでは**資格ハブ固有の設計・テスト・UI 契約**のみを定めます。

---

## 1. 着手前ベンチマーク確認（自己流の禁止）

新規作成や大規模更新の前に、最新リファレンス実装を必ず確認して差分を棚卸しする。

- **UI 基準実装**: `src/app/ipa-info/page.tsx`、`src/app/lpic-info/page.tsx`、`src/app/azure-info/page.tsx`
- **検索正規化ヘルパー**: `src/lib/ipa-search.ts`、`src/lib/lpic-search.ts`、`src/lib/azure-search.ts`
- **データ構造と回帰テスト**: `tests/cert-data.test.mjs`（共通）、`tests/<domain>-cert.test.mjs`（例: `tests/azure-cert.test.mjs` — 並行セッション競合回避のためドメイン専用テストへ分離）

---

## 2. データ分割と Node ネイティブ ESM（`node --test`）互換設計

1. **モジュール分割とバレル構成**:
   - 複数試験・多階層データ（例: IPA 13 試験）は階層・トラック別のリーフモジュール（`src/data/ipa/{foundation,specialist,management}.ts` や `src/data/lpic-*.ts`）へ分割し、アプリ側からはバレル（`src/data/ipa-exam.ts` 等）経由で読み込む。
2. **`@/*` パスエイリアス制約の回避**:
   - `npm test`（`node --test tests/*.test.mjs`）は Node ネイティブ実行のため、`tsconfig.json` の `@/*` パスエイリアスを解決しない。
   - `tests/cert-data.test.mjs` から直接 import されるリーフデータモジュールでは、ランタイムの `@/` import を避け（相対パスまたは `import type` のみ使用）、テスト側もバレルではなくリーフファイルを `pathToFileURL(...)` で直接 import する。
3. **グローバル一意 ID と参照整合性**:
   - 階層をまたぐ ID 衝突を防ぐため、プレフィックス付き命名規則（例: `comp-{tier}-*`, `pat-{tier}-*`, `pit-{tier}-*`, `kf-{tier}-*`, `{exam}-q*`）を徹底する。
   - `domain.id`・`topic.id`・`question.id`・`comparison.id`・`flashcard.keyword` の重複ゼロ、および `question.domainId` が同一 `examId` の実在ドメインを指すことをテストで固定する。
   - 比較表のセル数はヘッダ設計に厳密一致させる（先頭 `<th>` が `row.feature` 専用列なら `row.values.length === comp.columns.length`、`comp.columns[0]` が `feature` 見出し兼用なら `comp.columns.length - 1`）。

---

## 3. 純粋関数抽出と 100% キーワードバッジ逆引き設計

1. **検索クエリ正規化の分離**:
   - トピックのキーワード／コマンドバッジ押下時の検索正規化ロジックを `"use client"` な `page.tsx` に直書きせず、`src/lib/<cert>-search.ts` に純粋関数として切り出す。
   - 全角括弧 `（`・半角括弧 `(`・スラッシュ `/` 付きの表記揺れ（例: `ISMS (ISO/IEC 27001)`, `EVM (CPI/SPI/EAC)`）を確実に正規化できるよう `kw.split(/[（(/]/)[0].trim()` 相当の設計を行い、`tests/core-logic.test.mjs` に境界値テストを追加する。
2. **100% ヒット率（miss 0）と 5 セクション逆引き UX**:
   - すべての試験・トラックにおいて、各トピックの全サービス／キーワードバッジ（正規化後）**および `page.tsx` の `quickSearchChips` 全件**が 5 セクション横断検索で **100% ヒット（miss 0）** することを `tests/<domain>-cert.test.mjs` で検証する。
   - **テストと UI の検索対象 1:1 一致（偽陽性防止）**: テストの haystack 構築ロジックは `page.tsx` 側のフィルタ対象フィールドと完全一致させる（例: `filteredComparisons` が `comp.category` を検索しない場合、テスト側にも `c.category` を含めない）。
   - どの試験タブでも比較表・逆引き（`filteredQuickLookup`）・パターン/公式・ひっかけ・重要数値/仕様の 5 セクションが **0 件（空振り）** にならないよう網羅し、検索バー直下に `role="status" aria-live="polite"` のセクション別ヒット件数・0 件時ガイダンスを配置する。あわせて学習メモの Markdown 出力（`handleExportNotesMarkdown`）とパネル閉鎖時の `role="status"` フィードバックを備える。

---

## 4. 外部公式 URL のライブ HTTP 200 実測と回帰固定

- Web 検索スニペットや記憶から公式ドキュメント URL を転記しない。追加・変更した全外部 URL について、`HEAD` のステータス確認だけで済ませず **最終遷移先 URL（リダイレクト解決後）と HTML `<title>` を `GET` で実測** し、以下 3 点をすべて確認する：
  1. 最終ステータスが HTTP `200` であること（`403`/`404` ゼロ）。
  2. **Soft-404 リダイレクトではないこと**: 一覧・検索・トップページ（例: Microsoft Learn の `/training/browse/?resource_type=course`）へ HTTP `200` で転送されていないかを最終 URL と `<title>` で確認する。
  3. **最終 URL が資格内で一意であること**: 元の URL 文字列が異なっても、リダイレクト後に同一ページへ収束する重複（例: `/credentials/certifications/exams/az-900/` → `/credentials/certifications/azure-fundamentals/`）を排除する。
  ```powershell
  # Node による最終遷移先 URL・<title>・資格内一意性の一括実測例
  @'
  for (const url of process.argv.slice(1)) {
    const res = await fetch(url, { redirect: "follow" });
    const html = await res.text();
    const title = (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "").trim();
    console.log(`${res.status} | ${url === res.url ? "OK" : "REDIR -> " + res.url} | ${title}`);
  }
  '@ | node --input-type=module - "https://learn.microsoft.com/ja-jp/credentials/certifications/azure-fundamentals/"
  ```
- 過去に 404・Soft-404・重複リダイレクトが判明した旧 URL パターン（例: `ipa.go.jp/shiken/syllabus.html`, `/training/courses/ai-900t00`, `/credentials/certifications/exams/(az-900|...)/`）は `tests/<domain>-cert.test.mjs` に禁止アサーションを追加して再混入を機械的に防ぐ。

---

## 5. WAI-ARIA APG タブ操作と 768px 狭幅タブレットガード

1. **WAI-ARIA APG Tabs 完全準拠**:
   - 試験切替・セクション切替タブには `role="tablist"`、`role="tab"`、`aria-selected`、`aria-controls`、roving `tabIndex={isActive ? 0 : -1}`、`role="tabpanel"`（`aria-labelledby` 紐付け）を揃える。
   - `ArrowLeft` / `ArrowRight` / `Home` / `End` キーでのフォーカス移動（`e.preventDefault()` ＋ ref 経由の `.focus()`）を実装する。
2. **操作系・動的通知・テーブル標準**:
   - フィルタピル群は `role="group"` ＋各ボタン `aria-pressed`、開閉ドメイン／メモは `aria-expanded` ＋ `aria-controls`、検索入力は `<label htmlFor="..." className="sr-only">`、検索結果件数表示は `role="status" aria-live="polite"` とする。
   - 比較表は `overflow-x-auto` コンテナ内に `<table className="w-full min-w-[640px] ...">` を配置し、`<th>` に `whitespace-nowrap` を付与する。
3. **768px タブレット狭幅ガード（重要）**:
   - AI Park は左側に固定サイドバー（`288px`）を持つため、`768x1024` ビューポート時のメイン領域幅は約 `474px` しかない。
   - 3 列サマリーや横並びフィルタ・検索バーの `min-w-[360px]` 等は `sm:` / `md:` ではなく **`lg:`（`lg:min-w-[360px]`, `lg:flex-row`）** で展開し、flex / grid 子要素に `min-w-0` を付与して重なり・右端クリップを防ぐ。

---

## 6. テスト登録・検証手順

1. 新規ドメイン・大幅拡充時は、並行セッションと競合する共有テスト（`tests/cert-data.test.mjs` / `tests/core-logic.test.mjs`）を直接肥大化させず、ドメイン専用テスト（`tests/<domain>-cert.test.mjs`）を追加して、正規化関数・一意性・`domainId` 整合・セル数・バッジ＆`quickSearchChips` 100% ヒット率・公式 URL 禁止パターン・WAI-ARIA/768px 実装トークンを CI 固定する（`tests/cert-data.test.mjs` が自動収集するファイル数の期待値変更が必須な場合のみ最小差分で同期する）。
2. 変更後、PowerShell で 5 段階検証チェーンをすべてエラー 0 で通過させる：
   ```powershell
   npm run lint; if ($?) { npx tsc --noEmit }; if ($?) { npm test }; if ($?) { npm run check:gate }; if ($?) { npm run build }
   ```
3. 大規模更新時は Read-only `ai-park-release-audit` で独立監査を実施し、本番デプロイ後は `browser` サブエージェントで `1280x800`・`768x1024`・末尾 `/` リダイレクト・404（Hydration エラー 0）を実機確認する（スクリーンショット実体が取得できない場合は視覚検査を `not-run` として誠実報告する）。
