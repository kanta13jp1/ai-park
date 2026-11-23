import { APP_HTML } from "../generated/app-html.js";
import { GITHUB_REPO, SITE_BASE_URL } from "./parsers.js";
import { fetchWithTimeout, snapshot } from "./portal-service.js";
import type {
  AiNewsPayload,
  CreateIssueInput,
  CreateIssueResult,
  GcpUsagePayload,
  PlatformAdapter,
  QualityGateResult,
  UpdateIssueInput,
  UpdateIssueResult,
} from "./types.js";

export interface WebAdapterEnv {
  AI_PARK_GITHUB_TOKEN?: string;
}

async function githubRest<T>(
  endpoint: string,
  token: string,
  method: "POST" | "PATCH" | "DELETE",
  payload?: unknown
): Promise<T> {
  const res = await fetchWithTimeout(
    `https://api.github.com/${endpoint}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ai-park-mcp-worker/1.0.0",
        ...(payload !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      ...(payload !== undefined ? { body: JSON.stringify(payload) } : {}),
    },
    10000
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status}: ${body.slice(0, 300)}`);
  }
  if (res.status === 204) return {} as T;
  return (await res.json()) as T;
}

export function createWebAdapter(env: WebAdapterEnv = {}): PlatformAdapter {
  const token = env.AI_PARK_GITHUB_TOKEN;

  return {
    mode: "remote",

    async readLiveNews() {
      try {
        const res = await fetchWithTimeout(`${SITE_BASE_URL}/data/ai-news-live.json`, {}, 6000);
        if (res.ok) {
          const remote = (await res.json()) as AiNewsPayload;
          if (remote?.items) return { source: "remote_live", data: remote };
        }
      } catch {
        // fallback to snapshot
      }
      return { source: "snapshot", data: snapshot.aiNewsFallback };
    },

    async readLiveGcpUsage() {
      try {
        const res = await fetchWithTimeout(`${SITE_BASE_URL}/data/gcp-usage-live.json`, {}, 6000);
        if (res.ok) {
          const remote = (await res.json()) as GcpUsagePayload;
          if (remote?.gcpInfo) return { source: "remote_live", data: remote };
        }
      } catch {
        // fallback to snapshot
      }
      return { source: "snapshot", data: snapshot.gcpUsageFallback };
    },

    async readAppHtml() {
      return APP_HTML;
    },

    async createGitHubIssue(input: CreateIssueInput): Promise<CreateIssueResult> {
      if (!token) {
        return {
          executed: false,
          via: "none",
          reason:
            "リモート環境では AI_PARK_GITHUB_TOKEN シークレットが未設定のため実起票できません。prefilledUrl から起票してください。",
        };
      }
      try {
        const created = await githubRest<{ number: number; html_url: string }>(
          `repos/${GITHUB_REPO}/issues`,
          token,
          "POST",
          {
            title: input.title,
            body: input.body,
            labels: input.labels,
          }
        );
        return {
          executed: true,
          via: "github_api",
          issueNumber: created.number,
          issueUrl: created.html_url,
        };
      } catch (err) {
        return {
          executed: false,
          via: "none",
          reason: err instanceof Error ? err.message : String(err),
        };
      }
    },

    async updateGitHubIssue(input: UpdateIssueInput): Promise<UpdateIssueResult> {
      const issueUrl = `https://github.com/${GITHUB_REPO}/issues/${input.issueNumber}`;
      if (!token) {
        return {
          executed: false,
          via: "none",
          issueUrl,
          reason: "リモート環境では AI_PARK_GITHUB_TOKEN シークレットが未設定のため Issue 更新できません。",
        };
      }
      const details: string[] = [];
      try {
        if (input.state) {
          await githubRest(`repos/${GITHUB_REPO}/issues/${input.issueNumber}`, token, "PATCH", {
            state: input.state,
          });
          details.push(`state -> ${input.state}`);
        }
        if (input.addLabels && input.addLabels.length > 0) {
          await githubRest(
            `repos/${GITHUB_REPO}/issues/${input.issueNumber}/labels`,
            token,
            "POST",
            { labels: input.addLabels }
          );
          details.push(`added labels: ${input.addLabels.join(", ")}`);
        }
        if (input.removeLabels && input.removeLabels.length > 0) {
          for (const lbl of input.removeLabels) {
            try {
              await githubRest(
                `repos/${GITHUB_REPO}/issues/${input.issueNumber}/labels/${encodeURIComponent(lbl)}`,
                token,
                "DELETE"
              );
              details.push(`removed label: ${lbl}`);
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              if (!msg.includes("404")) throw err;
            }
          }
        }
        if (input.comment && input.comment.trim()) {
          await githubRest(
            `repos/${GITHUB_REPO}/issues/${input.issueNumber}/comments`,
            token,
            "POST",
            { body: input.comment.trim() }
          );
          details.push("added comment");
        }
        return {
          executed: true,
          via: "github_api",
          issueUrl,
          details,
        };
      } catch (err) {
        return {
          executed: false,
          via: "none",
          issueUrl,
          reason: err instanceof Error ? err.message : String(err),
        };
      }
    },

    async runQualityGate(): Promise<QualityGateResult> {
      return {
        available: false,
        passed: null,
        reason:
          "リモート Workers 実行環境にはローカルファイルシステムが無いため、品質ゲート（verify-deployment-gate.mjs）はローカル Stdio または HTTP サーバーから実行してください。",
      };
    },
  };
}
