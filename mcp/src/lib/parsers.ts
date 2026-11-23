import type {
  BoardKind,
  FeedbackCategory,
  FeedbackItem,
  FeedbackPriority,
  FeedbackStatus,
  GitHubIssueRaw,
  IdeaItem,
  IdeaStage,
  ProjectItem,
  ProjectStage,
  ToolMatrixItem,
} from "./types.js";

export const GITHUB_REPO = "kanta13jp1/ai-park";
export const SITE_BASE_URL = "https://kanta13jp1.github.io/ai-park";
export const TOOLS_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR49_QiMXyFDle6USwoDRRIzfjljOR0QRHpEWJN-ncHMoxOxR3VdasIjgixvyz43JkQ2aAEGO_aFqCk/pub?gid=895015812&single=true&output=csv";

export const FEEDBACK_LABEL = "feedback";
export const PROJECT_LABEL = "ai-project";
export const IDEA_LABEL = "idea";
export const IN_PROGRESS_LABEL = "status:in-progress";
export const TEST_LABEL = "test";

export const FEEDBACK_CATEGORIES: readonly FeedbackCategory[] = [
  "UI/UX",
  "AI導入編",
  "AI初級編",
  "AI実践編",
  "ガイドライン",
  "企画・懸賞",
  "開発環境",
  "アカウント運用",
];

export const PROJECT_STAGES: readonly ProjectStage[] = [
  "検討中",
  "PoC中",
  "本番運用中",
  "終了",
];

export const IDEA_STAGES: readonly IdeaStage[] = [
  "アイデア段階",
  "作っている",
  "完成・使っている",
  "終了",
];

const TOOL_STATUSES = [
  "全社員利用可能",
  "利用可能",
  "社内セキュア網",
  "検証中",
  "リストアップ",
] as const;

export function parseIssueFormBody(body: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = body.split(/^### /m).slice(1);
  for (const part of parts) {
    const newline = part.indexOf("\n");
    if (newline === -1) continue;
    const heading = part.slice(0, newline).trim();
    const value = part.slice(newline + 1).trim();
    sections[heading] = value === "_No response_" ? "" : value;
  }
  return sections;
}

export function pickSection(sections: Record<string, string>, prefix: string): string {
  const key = Object.keys(sections).find((k) => k.startsWith(prefix));
  return key ? sections[key] : "";
}

export function formatDateYmd(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function issueToFeedbackItem(issue: GitHubIssueRaw): FeedbackItem {
  const sections = parseIssueFormBody(issue.body ?? "");
  const labels = issue.labels.map((l) => l.name);
  const category = pickSection(sections, "カテゴリ");
  const priority = pickSection(sections, "優先度");
  const author = pickSection(sections, "お名前") || issue.user?.login || "匿名";
  const quote = pickSection(sections, "いただいたご意見");
  const actionPlan = pickSection(sections, "ポータルでの対応方針");

  const status: FeedbackStatus =
    issue.state === "closed"
      ? "done"
      : labels.includes(IN_PROGRESS_LABEL)
      ? "in_progress"
      : "todo";

  return {
    id: `GH-${issue.number}`,
    title: issue.title.replace(/^\[ご意見\]\s*/, ""),
    category: (FEEDBACK_CATEGORIES as readonly string[]).includes(category)
      ? (category as FeedbackCategory)
      : "UI/UX",
    author: `${author} さん`,
    authorDept: pickSection(sections, "所属部署") || "社内",
    date: formatDateYmd(issue.created_at),
    priority:
      priority === "高" || priority === "中" || priority === "低"
        ? (priority as FeedbackPriority)
        : "中",
    status,
    feedbackQuote: quote
      ? `「${quote}」`
      : (Object.keys(sections).length === 0 && issue.body?.trim()) || "（GitHub Issueからのご意見）",
    actionPlan: actionPlan || "対応方針を検討・反映予定",
    issueNumber: issue.number,
    issueUrl: issue.html_url,
  };
}

export function issueToProject(issue: GitHubIssueRaw): ProjectItem {
  const sections = parseIssueFormBody(issue.body ?? "");
  const stage = pickSection(sections, "状況");
  return {
    id: `GH-${issue.number}`,
    name: issue.title.replace(/^\[AIプロジェクト\]\s*/, ""),
    dept: pickSection(sections, "部署") || "未記入",
    owner: pickSection(sections, "担当者"),
    stage:
      issue.state === "closed"
        ? "終了"
        : (PROJECT_STAGES as readonly string[]).includes(stage)
        ? (stage as ProjectStage)
        : "検討中",
    tools: pickSection(sections, "使っているAIツール"),
    summary: pickSection(sections, "何をしているか"),
    effect: pickSection(sections, "成果"),
    updated: formatDateYmd(issue.updated_at ?? issue.created_at),
    issueNumber: issue.number,
    issueUrl: issue.html_url,
  };
}

export function issueToIdea(issue: GitHubIssueRaw): IdeaItem {
  const sections = parseIssueFormBody(issue.body ?? "");
  const stage = pickSection(sections, "状況");
  return {
    id: `#${issue.number}`,
    title: issue.title.replace(/^\[アイデア\]\s*/, ""),
    dept: pickSection(sections, "部署") || "未記入",
    author: pickSection(sections, "宣言者"),
    stage:
      issue.state === "closed"
        ? "終了"
        : (IDEA_STAGES as readonly string[]).includes(stage)
        ? (stage as IdeaStage)
        : "アイデア段階",
    problem: pickSection(sections, "困っていること"),
    idea: pickSection(sections, "AIにどうさせたいか"),
    tools: pickSection(sections, "使いたいAIツール"),
    wantsHelp: pickSection(sections, "協力者を募集") === "募集する",
    updated: formatDateYmd(issue.updated_at ?? issue.created_at),
    issueNumber: issue.number,
    issueUrl: issue.html_url,
  };
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

type Score = 0 | 1 | 2 | 3;

const toScore = (v: string): Score => {
  if (v.trim() === "") return 0;
  const n = Number(v);
  return n >= 3 ? 3 : n >= 2 ? 2 : n >= 1 ? 1 : 0;
};

const toNumber = (v: string, fallback: number): number => {
  const n = Number(v);
  return Number.isFinite(n) && v.trim() !== "" ? n : fallback;
};

export function csvToTools(text: string): ToolMatrixItem[] {
  const [header, ...rows] = parseCsv(text);
  if (!header) return [];
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  const get = (r: string[], key: string) =>
    idx[key] !== undefined ? (r[idx[key]] ?? "").trim() : "";

  return rows
    .filter((r) => get(r, "name"))
    .map((r, i) => {
      const status = get(r, "status");
      const name = get(r, "name");
      return {
        id: toNumber(get(r, "id"), i + 1),
        name,
        form: get(r, "form"),
        status: (TOOL_STATUSES as readonly string[]).includes(status)
          ? (status as ToolMatrixItem["status"])
          : "リストアップ",
        statusNote: get(r, "statusNote") || undefined,
        licenseCount: get(r, "licenseCount") || undefined,
        dev: { score: toScore(get(r, "dev_score")), note: get(r, "dev_note") },
        doc: { score: toScore(get(r, "doc_score")), note: get(r, "doc_note") },
        research: { score: toScore(get(r, "research_score")), note: get(r, "research_note") },
        auto: { score: toScore(get(r, "auto_score")), note: get(r, "auto_note") },
        coverage: get(r, "coverage"),
        coverageRatio: Math.min(1, Math.max(0, toNumber(get(r, "coverageRatio"), 0))),
        description: get(r, "description"),
        securityLevel: get(r, "securityLevel"),
        impactScore: toNumber(get(r, "impactScore"), 5),
        easeScore: toNumber(get(r, "easeScore"), 5),
      };
    });
}

export interface BoardIssueDraftInput {
  board: BoardKind;
  title: string;
  author?: string;
  dept?: string;
  category?: FeedbackCategory;
  priority?: FeedbackPriority;
  quote?: string;
  actionPlan?: string;
  stage?: string;
  tools?: string;
  summary?: string;
  effect?: string;
  problem?: string;
  idea?: string;
  wantsHelp?: boolean;
  isTest?: boolean;
}

export function buildBoardIssueDraft(input: BoardIssueDraftInput): {
  title: string;
  body: string;
  labels: string[];
  prefilledUrl: string;
} {
  const cleanTitle = input.title.trim();
  const extraLabels = input.isTest ? [TEST_LABEL] : [];

  if (input.board === "feedback") {
    const formattedTitle = cleanTitle.startsWith("[ご意見]")
      ? cleanTitle
      : `[ご意見] ${cleanTitle}`;
    const body = [
      `### お名前 / 起票元`,
      ``,
      input.author?.trim() || "社内メンバー",
      ``,
      `### 所属部署 / チーム`,
      ``,
      input.dept?.trim() || "社内",
      ``,
      `### カテゴリ`,
      ``,
      input.category ?? "UI/UX",
      ``,
      `### 優先度`,
      ``,
      input.priority ?? "中",
      ``,
      `### いただいたご意見の原文・引用メモ`,
      ``,
      input.quote?.trim() || "_No response_",
      ``,
      `### ポータルでの対応方針・アクションプラン`,
      ``,
      input.actionPlan?.trim() || "_No response_",
    ].join("\n");

    const params = new URLSearchParams({
      template: "feedback.yml",
      title: formattedTitle,
      author: input.author?.trim() || "",
      dept: input.dept?.trim() || "",
      quote: input.quote?.trim() || "",
      action_plan: input.actionPlan?.trim() || "",
    });
    return {
      title: formattedTitle,
      body,
      labels: [FEEDBACK_LABEL, ...extraLabels],
      prefilledUrl: `https://github.com/${GITHUB_REPO}/issues/new?${params.toString()}`,
    };
  }

  if (input.board === "ai-project") {
    const formattedTitle = cleanTitle.startsWith("[AIプロジェクト]")
      ? cleanTitle
      : `[AIプロジェクト] ${cleanTitle}`;
    const stageValue =
      input.stage && ["検討中", "PoC中", "本番運用中"].includes(input.stage)
        ? input.stage
        : "検討中";
    const body = [
      `### 部署 / チーム`,
      ``,
      input.dept?.trim() || "未記入",
      ``,
      `### 担当者（窓口）`,
      ``,
      input.author?.trim() || "_No response_",
      ``,
      `### 状況`,
      ``,
      stageValue,
      ``,
      `### 使っているAIツール`,
      ``,
      input.tools?.trim() || "_No response_",
      ``,
      `### 何をしているか（概要）`,
      ``,
      input.summary?.trim() || input.quote?.trim() || "（概要未記入）",
      ``,
      `### 成果・現在の課題`,
      ``,
      input.effect?.trim() || "_No response_",
    ].join("\n");

    const params = new URLSearchParams({
      template: "ai-project.yml",
      title: formattedTitle,
      dept: input.dept?.trim() || "",
      owner: input.author?.trim() || "",
      tools: input.tools?.trim() || "",
      summary: input.summary?.trim() || input.quote?.trim() || "",
      effect: input.effect?.trim() || "",
    });
    return {
      title: formattedTitle,
      body,
      labels: [PROJECT_LABEL, ...extraLabels],
      prefilledUrl: `https://github.com/${GITHUB_REPO}/issues/new?${params.toString()}`,
    };
  }

  const formattedTitle = cleanTitle.startsWith("[アイデア]")
    ? cleanTitle
    : `[アイデア] ${cleanTitle}`;
  const stageValue =
    input.stage && ["アイデア段階", "作っている", "完成・使っている"].includes(input.stage)
      ? input.stage
      : "アイデア段階";
  const helpValue = input.wantsHelp ? "募集する" : "今は募集しない";
  const body = [
    `### 部署 / チーム`,
    ``,
    input.dept?.trim() || "未記入",
    ``,
    `### 宣言者`,
    ``,
    input.author?.trim() || "匿名",
    ``,
    `### 状況`,
    ``,
    stageValue,
    ``,
    `### 困っていること（誰が・どんな作業で・どのくらい時間がかかっているか）`,
    ``,
    input.problem?.trim() || input.quote?.trim() || "（課題詳細）",
    ``,
    `### AIにどうさせたいか`,
    ``,
    input.idea?.trim() || input.summary?.trim() || "（実現したいこと）",
    ``,
    `### 使いたいAIツール（分かれば）`,
    ``,
    input.tools?.trim() || "_No response_",
    ``,
    `### 協力者を募集しますか？`,
    ``,
    helpValue,
  ].join("\n");

  const params = new URLSearchParams({
    template: "idea.yml",
    title: formattedTitle,
    dept: input.dept?.trim() || "",
    author: input.author?.trim() || "",
    problem: input.problem?.trim() || input.quote?.trim() || "",
    idea: input.idea?.trim() || input.summary?.trim() || "",
    tools: input.tools?.trim() || "",
  });
  return {
    title: formattedTitle,
    body,
    labels: [IDEA_LABEL, ...extraLabels],
    prefilledUrl: `https://github.com/${GITHUB_REPO}/issues/new?${params.toString()}`,
  };
}

export function detectSensitiveContent(text: string): string[] {
  const findings: string[] = [];
  if (/AIza[0-9A-Za-z_-]{30,}/.test(text)) findings.push("Google API キー形式");
  if (/(?:ghp|gho|ghu|ghs|ghr)_[0-9A-Za-z]{20,}|github_pat_[0-9A-Za-z_]{20,}/.test(text)) {
    findings.push("GitHub トークン形式");
  }
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(text)) findings.push("秘密鍵ブロック");
  if (/[A-Za-z]:\\Users\\[A-Za-z0-9._-]+\\/i.test(text) || /\/Users\/[A-Za-z0-9._-]+\//.test(text)) {
    findings.push("ローカルユーザーディレクトリパス");
  }
  if (/[A-Za-z0-9._%+-]+@ml-mightylink\.com/i.test(text)) {
    findings.push("社内ドメインメールアドレス");
  }
  return findings;
}
