export type BoardKind = "feedback" | "ai-project" | "idea";

export type FeedbackCategory =
  | "UI/UX"
  | "AI導入編"
  | "AI初級編"
  | "AI実践編"
  | "ガイドライン"
  | "企画・懸賞"
  | "開発環境"
  | "アカウント運用";

export type FeedbackPriority = "高" | "中" | "低";
export type FeedbackStatus = "todo" | "in_progress" | "done";
export type ProjectStage = "検討中" | "PoC中" | "本番運用中" | "終了";
export type IdeaStage = "アイデア段階" | "作っている" | "完成・使っている" | "終了";

export interface GitHubIssueRaw {
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  html_url: string;
  created_at: string;
  updated_at?: string;
  labels: { name: string }[];
  user: { login: string } | null;
  pull_request?: unknown;
}

export interface FeedbackItem {
  id: string;
  title: string;
  category: FeedbackCategory;
  author: string;
  authorDept: string;
  date: string;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  feedbackQuote: string;
  actionPlan: string;
  issueNumber: number;
  issueUrl: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  dept: string;
  owner: string;
  stage: ProjectStage;
  tools: string;
  summary: string;
  effect: string;
  updated: string;
  issueNumber: number;
  issueUrl?: string;
}

export interface IdeaItem {
  id: string;
  title: string;
  dept: string;
  author: string;
  stage: IdeaStage;
  problem: string;
  idea: string;
  tools: string;
  wantsHelp: boolean;
  updated: string;
  issueNumber: number;
  issueUrl: string;
}

export interface ToolMatrixItem {
  id: number;
  name: string;
  form: string;
  status: "全社員利用可能" | "利用可能" | "社内セキュア網" | "検証中" | "リストアップ";
  statusNote?: string;
  licenseCount?: string;
  dev: { score: 0 | 1 | 2 | 3; note: string };
  doc: { score: 0 | 1 | 2 | 3; note: string };
  research: { score: 0 | 1 | 2 | 3; note: string };
  auto: { score: 0 | 1 | 2 | 3; note: string };
  coverage: string;
  coverageRatio: number;
  description: string;
  securityLevel: string;
  impactScore: number;
  easeScore: number;
}

export interface CreateIssueInput {
  title: string;
  body: string;
  labels: string[];
}

export interface CreateIssueResult {
  executed: boolean;
  via: "github_api" | "gh_cli" | "none";
  reason?: string;
  issueNumber?: number;
  issueUrl?: string;
}

export interface UpdateIssueInput {
  issueNumber: number;
  state?: "open" | "closed";
  addLabels?: string[];
  removeLabels?: string[];
  comment?: string;
}

export interface UpdateIssueResult {
  executed: boolean;
  via: "github_api" | "gh_cli" | "none";
  reason?: string;
  issueUrl?: string;
  details?: string[];
}

export interface QualityGateResult {
  available: boolean;
  passed: boolean | null;
  reason?: string;
  unverifiedCount?: number;
  uatPassedCount?: number;
  rawOutput?: string;
}

export interface AiNewsPayload {
  lastSyncedAt?: string;
  lastSyncedAtFormatted?: string;
  syncStatus?: string;
  totalCount?: number;
  activeSources?: string[];
  items: Array<{
    id: string;
    title: string;
    date: string;
    category: string;
    categoryLabel: string;
    importance: string;
    importanceLabel: string;
    summary: string;
    impactForStaff?: string;
    recommendedFor?: string[];
    sourceName: string;
    sourceUrl: string;
    tags?: string[];
  }>;
}

export interface GcpUsagePayload {
  updatedAt?: string;
  syncedAt?: string;
  dataSource?: string;
  isLive?: boolean;
  gcpInfo?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  dailyHistory?: Array<Record<string, unknown>>;
  users?: Array<Record<string, unknown>>;
}

export interface PlatformAdapter {
  mode: "local" | "remote";
  readLiveNews(): Promise<{ source: "local_file" | "remote_live" | "snapshot"; data: AiNewsPayload }>;
  readLiveGcpUsage(): Promise<{ source: "local_file" | "remote_live" | "snapshot"; data: GcpUsagePayload }>;
  readAppHtml(): Promise<string>;
  createGitHubIssue(input: CreateIssueInput): Promise<CreateIssueResult>;
  updateGitHubIssue(input: UpdateIssueInput): Promise<UpdateIssueResult>;
  runQualityGate(): Promise<QualityGateResult>;
}
