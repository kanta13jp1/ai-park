// ご意見・改善ToDoボード ⇔ GitHub Issue 連携
// 公開リポジトリの `feedback` ラベル付き Issue を取得し、ボードのToDo形式へ変換する。

export const GITHUB_REPO = "kanta13jp1/ai-park";
export const FEEDBACK_LABEL = "feedback";
export const IN_PROGRESS_LABEL = "status:in-progress";
export const TEST_LABEL = "test";

export const feedbackCategories = [
  "UI/UX",
  "AI導入編",
  "AI初級編",
  "AI実践編",
  "ガイドライン",
  "企画・懸賞",
  "開発環境",
  "アカウント運用",
] as const;

export type FeedbackCategory = (typeof feedbackCategories)[number];
export type FeedbackPriority = "高" | "中" | "低";
export type FeedbackStatus = "todo" | "in_progress" | "done";

export interface GitHubFeedbackItem {
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

export interface GitHubIssue {
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  html_url: string;
  created_at: string;
  labels: { name: string }[];
  user: { login: string } | null;
  pull_request?: unknown;
}

// Issue フォーム（.github/ISSUE_TEMPLATE/feedback.yml）が生成する「### 見出し\n\n値」形式を解析
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

export function pick(sections: Record<string, string>, prefix: string): string {
  const key = Object.keys(sections).find((k) => k.startsWith(prefix));
  return key ? sections[key] : "";
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function issueToFeedbackItem(issue: GitHubIssue): GitHubFeedbackItem {
  const sections = parseIssueFormBody(issue.body ?? "");
  const labels = issue.labels.map((l) => l.name);

  const category = pick(sections, "カテゴリ");
  const priority = pick(sections, "優先度");
  const author = pick(sections, "お名前") || issue.user?.login || "匿名";
  const quote = pick(sections, "いただいたご意見");
  const actionPlan = pick(sections, "ポータルでの対応方針");

  const status: FeedbackStatus =
    issue.state === "closed"
      ? "done"
      : labels.includes(IN_PROGRESS_LABEL)
      ? "in_progress"
      : "todo";

  return {
    id: `GH-${issue.number}`,
    title: issue.title.replace(/^\[ご意見\]\s*/, ""),
    category: (feedbackCategories as readonly string[]).includes(category)
      ? (category as FeedbackCategory)
      : "UI/UX",
    author: `${author} さん`,
    authorDept: pick(sections, "所属部署") || "社内",
    date: formatDate(issue.created_at),
    priority: priority === "高" || priority === "中" || priority === "低" ? priority : "中",
    status,
    // フォームを使わず自由記述で起票された Issue は本文をそのまま引用として扱う
    feedbackQuote: quote
      ? `「${quote}」`
      : (Object.keys(sections).length === 0 && issue.body?.trim()) || "（GitHub Issueからのご意見）",
    actionPlan: actionPlan || "対応方針を検討・反映予定",
    issueNumber: issue.number,
    issueUrl: issue.html_url,
  };
}

// 公開リポジトリの指定ラベル付き Issue を取得（Pull Request は除外）
export async function fetchIssuesByLabel(label: string, signal?: AbortSignal): Promise<GitHubIssue[]> {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/issues?labels=${encodeURIComponent(
    label
  )}&state=all&per_page=100&sort=created&direction=desc`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
    signal,
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}`);
  }
  const issues = (await res.json()) as GitHubIssue[];
  // 連携テスト用の Issue（test ラベル）はページに表示しない
  return issues.filter((i) => !i.pull_request && !i.labels.some((l) => l.name === TEST_LABEL));
}

export async function fetchFeedbackIssues(signal?: AbortSignal): Promise<GitHubFeedbackItem[]> {
  return (await fetchIssuesByLabel(FEEDBACK_LABEL, signal)).map(issueToFeedbackItem);
}

// Issue フォームへ入力値をプリフィルした起票URL（フォーム項目の id をクエリに指定）
export function buildNewIssueUrl(fields: {
  title: string;
  author: string;
  dept: string;
  quote: string;
  actionPlan: string;
}): string {
  const params = new URLSearchParams({
    template: "feedback.yml",
    title: `[ご意見] ${fields.title}`,
    author: fields.author,
    dept: fields.dept,
    quote: fields.quote,
    action_plan: fields.actionPlan,
  });
  return `https://github.com/${GITHUB_REPO}/issues/new?${params.toString()}`;
}
