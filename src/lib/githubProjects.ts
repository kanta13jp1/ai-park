// 社内AIプロジェクト一覧 ⇔ GitHub Issue 連携
// `ai-project` ラベル付き Issue（.github/ISSUE_TEMPLATE/ai-project.yml で起票）を一覧用データへ変換する。

import {
  GITHUB_REPO,
  fetchIssuesByLabel,
  formatDate,
  parseIssueFormBody,
  pick,
  type GitHubIssue,
} from "@/lib/githubFeedback";

export const PROJECT_LABEL = "ai-project";

export const projectStages = ["検討中", "PoC中", "本番運用中", "終了"] as const;
export type ProjectStage = (typeof projectStages)[number];

export interface AiProject {
  id: string;
  name: string;
  dept: string;
  owner: string;
  stage: ProjectStage;
  tools: string;
  summary: string;
  effect: string;
  updated: string;
  issueUrl?: string;
}

export function issueToProject(issue: GitHubIssue & { updated_at?: string }): AiProject {
  const sections = parseIssueFormBody(issue.body ?? "");
  const stage = pick(sections, "状況");
  return {
    id: `GH-${issue.number}`,
    name: issue.title.replace(/^\[AIプロジェクト\]\s*/, ""),
    dept: pick(sections, "部署") || "未記入",
    owner: pick(sections, "担当者"),
    // Close された Issue は「終了」として扱う
    stage:
      issue.state === "closed"
        ? "終了"
        : (projectStages as readonly string[]).includes(stage)
        ? (stage as ProjectStage)
        : "検討中",
    tools: pick(sections, "使っているAIツール"),
    summary: pick(sections, "何をしているか"),
    effect: pick(sections, "成果"),
    updated: formatDate(issue.updated_at ?? issue.created_at),
    issueUrl: issue.html_url,
  };
}

export async function fetchProjectIssues(signal?: AbortSignal): Promise<AiProject[]> {
  return (await fetchIssuesByLabel(PROJECT_LABEL, signal)).map(issueToProject);
}

export function buildNewProjectUrl(): string {
  const params = new URLSearchParams({ template: "ai-project.yml", title: "[AIプロジェクト] " });
  return `https://github.com/${GITHUB_REPO}/issues/new?${params.toString()}`;
}
