// アイデア宣言ボード ⇔ GitHub Issue 連携
// `idea` ラベル付き Issue（.github/ISSUE_TEMPLATE/idea.yml で起票）を一覧用データへ変換する。

import {
  GITHUB_REPO,
  fetchIssuesByLabel,
  formatDate,
  parseIssueFormBody,
  pick,
  type GitHubIssue,
} from "@/lib/githubFeedback";

export const IDEA_LABEL = "idea";

export const ideaStages = ["アイデア段階", "作っている", "完成・使っている", "終了"] as const;
export type IdeaStage = (typeof ideaStages)[number];

export interface Idea {
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
  issueUrl: string;
}

export function issueToIdea(issue: GitHubIssue & { updated_at?: string }): Idea {
  const sections = parseIssueFormBody(issue.body ?? "");
  const stage = pick(sections, "状況");
  return {
    id: `#${issue.number}`,
    title: issue.title.replace(/^\[アイデア\]\s*/, ""),
    dept: pick(sections, "部署") || "未記入",
    author: pick(sections, "宣言者"),
    // Close された Issue は「終了」として扱う
    stage:
      issue.state === "closed"
        ? "終了"
        : (ideaStages as readonly string[]).includes(stage)
        ? (stage as IdeaStage)
        : "アイデア段階",
    problem: pick(sections, "困っていること"),
    idea: pick(sections, "AIにどうさせたいか"),
    tools: pick(sections, "使いたいAIツール"),
    wantsHelp: pick(sections, "協力者を募集") === "募集する",
    updated: formatDate(issue.updated_at ?? issue.created_at),
    issueUrl: issue.html_url,
  };
}

export async function fetchIdeaIssues(signal?: AbortSignal): Promise<Idea[]> {
  return (await fetchIssuesByLabel(IDEA_LABEL, signal)).map(issueToIdea);
}

export function buildNewIdeaUrl(): string {
  const params = new URLSearchParams({ template: "idea.yml", title: "[アイデア] " });
  return `https://github.com/${GITHUB_REPO}/issues/new?${params.toString()}`;
}
