/**
 * 社内 Skills カタログ用データモジュール（/skills-hub）
 *
 * 出どころメモ（AGENTS.md 準拠）:
 * - 実運用スキル 4 件: 本公開リポジトリ（https://github.com/kanta13jp1/ai-park）内の
 *   `.agents/skills/<name>/SKILL.md` の実在ファイル定義から抜粋。
 * - Antigravity カスタマイズ仕様（種別・配置パス・優先順位・Progressive Disclosure）:
 *   Antigravity 内蔵の `agy-customizations/SKILL.md` 仕様に準拠。
 * - SKILL.md スターターテンプレート 3 種: 架空の部署名・人名・数値を一切含まない汎用テンプレート。
 */

export type WorkspaceSkillCategory = "品質・UAT" | "運用自動化" | "コード・品質";

export interface WorkspaceSkillItem {
  id: string;
  name: string;
  displayName: string;
  category: WorkspaceSkillCategory;
  status: "AI Park 運用中（参考実例）";
  description: string;
  triggerPhrase: string;
  sourcePath: string;
  githubUrl: string;
  author: string;
}

export interface CustomizationComparisonItem {
  type: string;
  configPath: string;
  loadingTiming: string;
  bestFor: string;
  enforcement: string;
}

export interface SkillDiscoveryTier {
  priority: number;
  label: string;
  path: string;
  scope: string;
  description: string;
}

export interface SkillTemplateItem {
  id: string;
  title: string;
  folderName: string;
  summary: string;
  useCase: string;
  powershellCmd: string;
  markdownContent: string;
}

export const WORKSPACE_SKILLS: WorkspaceSkillItem[] = [
  {
    id: "preflight-uat-workflow",
    name: "preflight-uat-workflow",
    displayName: "プリフライト手動UAT＆品質ゲート反復スキル",
    category: "品質・UAT",
    status: "AI Park 運用中（参考実例）",
    description:
      "AI Park における新機能・更新画面の公開前チェック（手動UAT、事実確認・推測排除、4大評価軸、品質ゲート検証、本番自動デプロイ監視）を一気通貫で実行する標準手順書。",
    triggerPhrase:
      "preflight-uat-workflow スキルを使って、この変更の公開前品質ゲートとUAT項目を点検して",
    sourcePath: ".agents/skills/preflight-uat-workflow/SKILL.md",
    githubUrl:
      "https://github.com/kanta13jp1/ai-park/blob/main/.agents/skills/preflight-uat-workflow/SKILL.md",
    author: "AI Park リポジトリ実運用",
  },
  {
    id: "feedback-to-production-workflow",
    name: "feedback-to-production-workflow",
    displayName: "フィードバック起点・本番デプロイ標準スキル",
    category: "運用自動化",
    status: "AI Park 運用中（参考実例）",
    description:
      "改善要望・提案の受付から、/feedback-todo・GitHub Issues 同期起票、型安全実装、品質ゲート（npm run check:gate）検証、Issue クローズ、本番デプロイ監視までを一気通貫で実行する手順書。",
    triggerPhrase:
      "feedback-to-production-workflow スキルに沿って、改善要望をIssue起票から実装・品質ゲート検証まで進めて",
    sourcePath: ".agents/skills/feedback-to-production-workflow/SKILL.md",
    githubUrl:
      "https://github.com/kanta13jp1/ai-park/blob/main/.agents/skills/feedback-to-production-workflow/SKILL.md",
    author: "AI Park リポジトリ実運用",
  },
  {
    id: "tech-to-production-pipeline",
    name: "tech-to-production-pipeline",
    displayName: "最新技術リサーチ還元・デリバリー標準スキル",
    category: "運用自動化",
    status: "AI Park 運用中（参考実例）",
    description:
      "公式アナウンスや技術記事の精査から、AI Park への還元価値抽出、ToDo・Issue 起票、型安全実装、品質ゲート検証、本番自動デプロイ監視までを実行する手順書。",
    triggerPhrase:
      "tech-to-production-pipeline スキルで、最新ドキュメントの変更点を整理してポータル改善案に落とし込んで",
    sourcePath: ".agents/skills/tech-to-production-pipeline/SKILL.md",
    githubUrl:
      "https://github.com/kanta13jp1/ai-park/blob/main/.agents/skills/tech-to-production-pipeline/SKILL.md",
    author: "AI Park リポジトリ実運用",
  },
  {
    id: "awards-driven-quality-cycle",
    name: "awards-driven-quality-cycle",
    displayName: "UI/UX・アクセシビリティ品質反復改善スキル",
    category: "コード・品質",
    status: "AI Park 運用中（参考実例）",
    description:
      "UI/UX・マイクロインタラクション・アクセシビリティ（prefers-reduced-motion / レスポンシブ）の改善と、品質ゲート（npm run check:gate）・SSG ビルド検証を反復実行する手順書。",
    triggerPhrase:
      "awards-driven-quality-cycle スキルを使って、このページのUI/UXとレスポンシブ表示を点検・改善して",
    sourcePath: ".agents/skills/awards-driven-quality-cycle/SKILL.md",
    githubUrl:
      "https://github.com/kanta13jp1/ai-park/blob/main/.agents/skills/awards-driven-quality-cycle/SKILL.md",
    author: "AI Park リポジトリ実運用",
  },
];

export const CUSTOMIZATION_COMPARISON: CustomizationComparisonItem[] = [
  {
    type: "Rules",
    configPath: "AGENTS.md / GEMINI.md / .agents/rules/*.md",
    loadingTiming: "常時・階層読み込み（always_on / model_decision）",
    bestFor: "コーディング規約、禁止事項（個人情報・推測排除など）、出力言語の統一",
    enforcement: "プロンプト指示としてエージェントへ常時注入",
  },
  {
    type: "Skills",
    configPath: ".agents/skills/<name>/SKILL.md",
    loadingTiming: "オンデマンド読み込み（Progressive Disclosure）",
    bestFor: "複数ステップの定型手順、チェックリスト、デプロイ・レビュー手順書",
    enforcement: "通常は名前と概要のみ保持し、必要な場面で全文ロード",
  },
  {
    type: "Hooks",
    configPath: "hooks.json",
    loadingTiming: "ライフサイクルイベント（ツール実行前後など）",
    bestFor: "コマンド・スクリプトによる自動整形、機密情報スキャン、強制ガードレール",
    enforcement: "AI の判断ではなくプログラムとして確実に実行",
  },
  {
    type: "MCP Servers",
    configPath: "mcp_config.json",
    loadingTiming: "ツール連携時（オンデマンド呼び出し）",
    bestFor: "ブラウザ操作、公式ドキュメント検索、外部サービス（GitHub/Drive等）接続",
    enforcement: "標準プロトコル経由で外部ツールを提供",
  },
  {
    type: "Plugins",
    configPath: "plugins/<name>/plugin.json",
    loadingTiming: "パッケージ単位での有効化・配布",
    bestFor: "関連する Skills・Rules・Hooks・MCP 設定をまとめてチームへ配布",
    enforcement: "バンドル単位でインストール・有効/無効を管理",
  },
];

export const SKILL_DISCOVERY_TIERS: SkillDiscoveryTier[] = [
  {
    priority: 1,
    label: "ワークスペース（プロジェクト固有）",
    path: ".agents/skills/<name>/SKILL.md",
    scope: "対象リポジトリ内（Git でチーム共有可能）",
    description:
      "最優先で読み込まれます。リポジトリにコミットしておけば、同じプロジェクトを開くメンバー全員が同じ手順を共有できます。",
  },
  {
    priority: 2,
    label: "グローバル（PC ローカル共通）",
    path: "~/.gemini/config/skills/<name>/SKILL.md",
    scope: "自分の PC 上の全プロジェクト",
    description:
      "ワークスペースをまたいで使い回したい自分専用の手順書や学習用スキルを配置するのに適しています。",
  },
  {
    priority: 3,
    label: "ビルトイン（標準同梱）",
    path: "Antigravity 内蔵マウント",
    scope: "環境標準",
    description:
      "Antigravity 本体に標準で組み込まれているスキルです。同名のスキルがワークスペースやグローバルにある場合はそちらが優先されます。",
  },
];

export const SKILL_TEMPLATES: SkillTemplateItem[] = [
  {
    id: "public-site-check",
    title: "公開前セルフチェックスキル",
    folderName: "public-site-check",
    summary:
      "静的サイトや GitHub Pages を公開・更新する前に、個人情報・APIキーの混入有無、noindex タグ、リンク切れを点検するスキルです。",
    useCase: "AI勉強会（ステップ1課題）や個人練習リポジトリの公開前チェック",
    powershellCmd:
      'New-Item -ItemType Directory -Force -Path ".agents/skills/public-site-check"',
    markdownContent: `---
name: public-site-check
description: 公開用Webページ（GitHub Pages等）をpushする前に、個人情報・機密情報の混入、検索避けタグ（noindex）、リンク切れを点検するセルフチェックスキル。
---

# 公開前セルフチェック手順

このスキルが呼ばれたら、対象プロジェクトの変更ファイルに対して以下を順番に確認し、結果を一覧で報告してください。

## 1. 個人情報・機密情報の混入チェック
- 本名、実在の電話番号、個人メールアドレス、実在の住所が含まれていないか確認する（ダミー表記になっているか）。
- APIキー、トークン、認証情報ファイル（\`.env\`, \`credentials.json\` 等）が含まれていないか確認する。

## 2. 検索インデックス設定の確認（公開練習サイトの場合）
- HTML の \`<head>\` 内に \`<meta name="robots" content="noindex, nofollow">\` が含まれているか確認する。

## 3. リンク・ビルド確認
- 相対パスやページ内アンカーリンク（\`#id\`）のリンク先が存在するか確認する。
- 修正箇所と未修正で残った注意点があれば最後に明記する。`,
  },
  {
    id: "study-note-writer",
    title: "学習メモ作成スキル",
    folderName: "study-note-writer",
    summary:
      "勉強会や開発中に学んだコマンド・エラー解決策を、一定のフォーマットで Markdown ファイルに記録するスキルです。",
    useCase: "勉強会の復習ログや検証結果のドキュメント整理",
    powershellCmd:
      'New-Item -ItemType Directory -Force -Path ".agents/skills/study-note-writer"',
    markdownContent: `---
name: study-note-writer
description: 学習内容やトラブルシューティングの結果を、日付付きの整理されたMarkdownメモ（docs/notes/）としてまとめるスキル。
---

# 学習メモ作成手順

ユーザーから学んだ内容や解決したエラーの記録を依頼されたら、以下の構成で Markdown を作成してください。

## 1. 保存先の確認
- ファイル名は \`docs/notes/YYYY-MM-DD-<topic>.md\` とする（事前に既存フォルダ構成を確認し、重複があれば確認する）。

## 2. メモの必須項目
- **学んだこと（結論）**: 3行以内で簡潔に要約する。
- **試したコマンド・手順**: 実際に成功した手順のみを記録する（未確認の推測コマンドは書かない）。
- **つまずいた点と解決策**: 発生したエラーと原因・対処法。
- **次に試すこと**: 次回の課題や確認事項。`,
  },
  {
    id: "pr-self-review",
    title: "PR セルフレビュー観点スキル",
    folderName: "pr-self-review",
    summary:
      "Pull Request を作成する前に、`git diff` の内容から意図しない変更の混入やエラー処理漏れを点検するスキルです。",
    useCase: "Issue → ブランチ → PR 作成前の最終セルフチェック",
    powershellCmd:
      'New-Item -ItemType Directory -Force -Path ".agents/skills/pr-self-review"',
    markdownContent: `---
name: pr-self-review
description: コミットやPull Request作成前に、git diff・ビルド結果・エラーハンドリング・機密情報非含有をセルフレビューするスキル。
---

# PR セルフレビュー手順

ユーザーが変更内容のセルフレビューを求めたら、以下の順序で点検してください。

## 1. 変更範囲の確認
- \`git status --short\` と \`git diff\` を確認し、依頼と無関係なファイルや一時ファイルが含まれていないか確認する。

## 2. 品質・安全性チェック
- 機密情報（キー・認証情報・社内識別情報）が含まれていないか確認する。
- クリップボード操作や非同期処理（\`fetch\` 等）に適切なエラーハンドリングがあるか確認する。
- リポジトリのリンター・ビルドコマンド（\`npm run build\` 等）を実行し、エラー0件であることを確認する。

## 3. PR説明文ドラフトの提示
- 「変更理由」「変更ファイル」「確認したコマンド結果」の3点を簡潔な箇条書きで提案する。`,
  },
];
