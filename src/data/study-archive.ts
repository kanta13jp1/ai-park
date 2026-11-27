export interface StudyTaskItem {
  step: string;
  title: string;
  description: string;
  relatedHref?: string;
  relatedLabel?: string;
}

export interface StudySession {
  id: string;
  roundLabel: string;
  date: string;
  timeRange: string;
  title: string;
  summary: string;
  topics: string[];
  /** Google Drive 共有URL（.../file/d/<ID>/view...）。社内 Google Workspace 限定公開のもののみ設定する */
  videoDriveUrl: string | null;
  /** Google Docs 共有URL（.../document/d/<ID>/...）。社内 Google Workspace 限定公開のもののみ設定する */
  minutesDocUrl: string | null;
  nextSession?: {
    date: string;
    timeRange: string;
  };
  tasks: StudyTaskItem[];
}

export interface WeeklyProgressSheetConfig {
  title: string;
  description: string;
  updateRule: string;
  /** Google Spreadsheets 共有URL（.../spreadsheets/d/<ID>/...）。社内 Google Workspace 限定公開のもののみ設定する */
  sheetUrl: string | null;
}

/**
 * Google Drive の file URL から iframe 埋め込み用の /preview URL を生成する。
 */
export function toDrivePreviewUrl(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  return `https://drive.google.com/file/d/${match[1]}/preview`;
}

/**
 * Google Docs の document URL から iframe 埋め込み用の /preview URL を生成する。
 */
export function toDocsPreviewUrl(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  return `https://docs.google.com/document/d/${match[1]}/preview`;
}

/**
 * Google Spreadsheets の URL から iframe 埋め込み用の /preview URL を生成する。
 */
export function toSheetsPreviewUrl(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  return `https://docs.google.com/spreadsheets/d/${match[1]}/preview`;
}

/**
 * AI勉強会 週次進捗シート設定
 *
 * 出どころメモ（AGENTS.md 準拠）:
 * - Google Chat「AI勉強会」スペースの週次進捗報告（毎週金曜目安）を集約する
 *   社内 Google Workspace 限定共有（ml-mightylink.com 閲覧専用）スプレッドシート
 *   (ID: 1HfGcGFm8hDKG1PLHi_nRqbzQeCsrjJD4IbNYg1IuReo)。
 * - 公開リポジトリのため、各メンバーの実名や進捗本文は本ファイルへ記載しない。
 */
export const weeklyProgressSheet: WeeklyProgressSheetConfig = {
  title: "AI勉強会 週次進捗シート",
  description:
    "Google Chat「AI勉強会」スペースで毎週共有される各メンバー・AI推進担当の進捗状況とネクストアクションを一覧できます（社内 Google Workspace 限定公開）。",
  updateRule: "毎週金曜日目安で週次更新（社内限定公開）",
  sheetUrl:
    "https://docs.google.com/spreadsheets/d/1HfGcGFm8hDKG1PLHi_nRqbzQeCsrjJD4IbNYg1IuReo/edit?usp=sharing",
};

/**
 * 開催回ごとの AI 勉強会アーカイブデータ
 *
 * 出どころメモ（AGENTS.md 準拠）:
 * - 2026-11-18 開催回: 梅澤さん共有の Google Drive 録画リンク
 *   (https://drive.google.com/file/d/1xKTSDvNEP1SxIG0NfdeOEObTYP1UoI9I/view?usp=sharing)
 *   および Google Chat「AI勉強会」スペースの次回開催告知（2026-12-16 15:00-16:00）。
 * - 公開サイト・公開リポジトリのため、社員の実名・案件の固有名詞・議事メモ本文は記載しない。
 */
export const studySessions: StudySession[] = [
  {
    id: "2026-11-18",
    roundLabel: "2026年11月回",
    date: "2026-11-18",
    timeRange: "15:00〜16:00",
    title: "Antigravity 操作実演 & GitHub Pages 公開課題",
    summary:
      "Antigravity の初期設定・画面操作の実演と、生成された HTML/CSS の確認方法、GitHub リポジトリ登録〜GitHub Pages 公開までの進め方を共有しました。",
    topics: [
      "Antigravity 導入・アカウント設定・操作実演",
      "デベロッパーツールを使った画面とコードの対応確認",
      "GitHub リポジトリ作成 & GitHub Pages 公開手順",
      "公開ページでの個人情報・検索インデックス対策（noindex 等）",
    ],
    videoDriveUrl:
      "https://drive.google.com/file/d/1xKTSDvNEP1SxIG0NfdeOEObTYP1UoI9I/view?usp=sharing",
    minutesDocUrl:
      "https://docs.google.com/document/d/17nFRRxq2yHWUUgRYUJchq-o5wJXplWEq1csiccCfvWQ/edit?tab=t.o9d8akbam28s",
    nextSession: {
      date: "2026-12-16",
      timeRange: "15:00〜16:00",
    },
    tasks: [
      {
        step: "課題 0（今週の目標）",
        title: "GitHub リポジトリ登録 & GitHub Pages 公開",
        description:
          "GitHub アカウントを作成し、AI で作成した Web ページをリポジトリに登録して GitHub Pages で公開する（本名・電話番号などの個人情報は含めず、必要に応じて noindex を設定）。",
      },
      {
        step: "ステップ 1（次期課題）",
        title: "Antigravity カスタマイズ入門（AGENTS.md / Skills）",
        description:
          "リポジトリに AGENTS.md（開発ルール）と .agents/skills/（定型作業スキル）を追加し、Antigravity 上で動作を確認して GitHub に push する。",
        relatedHref: "/guide",
        relatedLabel: "Antigravity導入ガイド",
      },
      {
        step: "ステップ 2（次期課題）",
        title: "GitHub 開発フロー体験（Issue / PR / Actions）",
        description:
          "機能追加を想定して Issue 起票 → ブランチ作成 → 実装 → PR 作成・マージの一連の流れを体験する。",
      },
      {
        step: "ステップ 3（発展課題）",
        title: "バックエンド（Java + DB）& GCP 連携",
        description:
          "Java（Spring Boot）と DB を使ったミニアプリをローカルで構築し、将来的に Cloud Run 等へのデプロイへつなげる。",
      },
    ],
  },
];
