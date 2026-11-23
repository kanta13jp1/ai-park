import { execFile, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
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

const execFileAsync = promisify(execFile);

function isAiParkRepoRoot(candidate: string): boolean {
  try {
    const pkgPath = path.join(candidate, "package.json");
    const statusPath = path.join(candidate, "src", "data", "feature-status.ts");
    if (!fs.existsSync(pkgPath) || !fs.existsSync(statusPath)) return false;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as { name?: string };
    return pkg.name === "ai-park";
  } catch {
    return false;
  }
}

export function resolveRepoRoot(explicitRoot?: string): string | undefined {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    explicitRoot,
    process.env.AI_PARK_REPO_ROOT,
    process.cwd(),
    path.resolve(moduleDir, "..", ".."),
    path.resolve(moduleDir, "..", "..", "..", ".."),
  ].filter((v): v is string => Boolean(v && v.trim()));

  for (const c of candidates) {
    if (isAiParkRepoRoot(c)) {
      return c;
    }
  }
  return undefined;
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function runGhApiJson<T>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  payload?: unknown
): Promise<T> {
  return new Promise((resolve, reject) => {
    const args = ["api", endpoint, "--method", method];
    if (payload !== undefined) {
      args.push("--input", "-");
    }
    const child = spawn("gh", args, {
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });
    child.on("error", (err) => reject(err));
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `gh api exited with code ${code}`));
        return;
      }
      if (!stdout.trim()) {
        resolve({} as T);
        return;
      }
      try {
        resolve(JSON.parse(stdout) as T);
      } catch {
        resolve({ raw: stdout.trim() } as T);
      }
    });
    if (payload !== undefined) {
      child.stdin.write(JSON.stringify(payload), "utf8");
    }
    child.stdin.end();
  });
}

async function githubFetchJson<T>(
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
        "User-Agent": "ai-park-mcp-server/1.0.0",
        ...(payload !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      ...(payload !== undefined ? { body: JSON.stringify(payload) } : {}),
    },
    10000
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status}: ${text.slice(0, 300)}`);
  }
  if (res.status === 204) return {} as T;
  return (await res.json()) as T;
}

export function createNodeAdapter(options?: { repoRoot?: string }): PlatformAdapter {
  const repoRoot = resolveRepoRoot(options?.repoRoot);

  return {
    mode: "local",

    async readLiveNews() {
      if (repoRoot) {
        const local = readJsonFile<AiNewsPayload>(
          path.join(repoRoot, "public", "data", "ai-news-live.json")
        );
        if (local?.items) {
          return { source: "local_file", data: local };
        }
      }
      try {
        const res = await fetchWithTimeout(`${SITE_BASE_URL}/data/ai-news-live.json`, {}, 6000);
        if (res.ok) {
          const remote = (await res.json()) as AiNewsPayload;
          if (remote?.items) return { source: "remote_live", data: remote };
        }
      } catch {
        // fallback to embedded snapshot
      }
      return { source: "snapshot", data: snapshot.aiNewsFallback };
    },

    async readLiveGcpUsage() {
      if (repoRoot) {
        const local = readJsonFile<GcpUsagePayload>(
          path.join(repoRoot, "public", "data", "gcp-usage-live.json")
        );
        if (local?.gcpInfo) {
          return { source: "local_file", data: local };
        }
      }
      try {
        const res = await fetchWithTimeout(`${SITE_BASE_URL}/data/gcp-usage-live.json`, {}, 6000);
        if (res.ok) {
          const remote = (await res.json()) as GcpUsagePayload;
          if (remote?.gcpInfo) return { source: "remote_live", data: remote };
        }
      } catch {
        // fallback to embedded snapshot
      }
      return { source: "snapshot", data: snapshot.gcpUsageFallback };
    },

    async readAppHtml() {
      const overridePath = process.env.AI_PARK_MCP_APP_HTML;
      if (overridePath && fs.existsSync(overridePath)) {
        return fs.readFileSync(overridePath, "utf8");
      }
      return APP_HTML;
    },

    async createGitHubIssue(input: CreateIssueInput): Promise<CreateIssueResult> {
      const token = process.env.AI_PARK_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
      if (token) {
        try {
          const created = await githubFetchJson<{ number: number; html_url: string }>(
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
      }

      try {
        const created = await runGhApiJson<{ number: number; html_url: string }>(
          `repos/${GITHUB_REPO}/issues`,
          "POST",
          {
            title: input.title,
            body: input.body,
            labels: input.labels,
          }
        );
        return {
          executed: true,
          via: "gh_cli",
          issueNumber: created.number,
          issueUrl: created.html_url,
        };
      } catch (err) {
        return {
          executed: false,
          via: "none",
          reason:
            err instanceof Error
              ? `GitHub 起票を実行できませんでした (${err.message})。返却された prefilledUrl からブラウザで起票できます。`
              : "GitHub 認証が利用できません。",
        };
      }
    },

    async updateGitHubIssue(input: UpdateIssueInput): Promise<UpdateIssueResult> {
      const token = process.env.AI_PARK_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
      const useToken = Boolean(token);
      const details: string[] = [];
      let issueUrl = `https://github.com/${GITHUB_REPO}/issues/${input.issueNumber}`;

      const execEndpoint = async <T>(
        endpoint: string,
        method: "POST" | "PATCH" | "DELETE",
        payload?: unknown
      ): Promise<T> => {
        if (useToken && token) {
          return githubFetchJson<T>(endpoint, token, method, payload);
        }
        return runGhApiJson<T>(endpoint, method, payload);
      };

      try {
        if (input.state) {
          const res = await execEndpoint<{ html_url?: string }>(
            `repos/${GITHUB_REPO}/issues/${input.issueNumber}`,
            "PATCH",
            { state: input.state }
          );
          if (res.html_url) issueUrl = res.html_url;
          details.push(`state -> ${input.state}`);
        }

        if (input.addLabels && input.addLabels.length > 0) {
          await execEndpoint(
            `repos/${GITHUB_REPO}/issues/${input.issueNumber}/labels`,
            "POST",
            { labels: input.addLabels }
          );
          details.push(`added labels: ${input.addLabels.join(", ")}`);
        }

        if (input.removeLabels && input.removeLabels.length > 0) {
          for (const lbl of input.removeLabels) {
            try {
              await execEndpoint(
                `repos/${GITHUB_REPO}/issues/${input.issueNumber}/labels/${encodeURIComponent(lbl)}`,
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
          await execEndpoint(
            `repos/${GITHUB_REPO}/issues/${input.issueNumber}/comments`,
            "POST",
            { body: input.comment.trim() }
          );
          details.push("added comment");
        }

        return {
          executed: true,
          via: useToken ? "github_api" : "gh_cli",
          issueUrl,
          details,
        };
      } catch (err) {
        return {
          executed: false,
          via: "none",
          issueUrl,
          reason:
            err instanceof Error
              ? `GitHub Issue #${input.issueNumber} の更新を実行できませんでした (${err.message})`
              : "GitHub 更新エラー",
        };
      }
    },

    async runQualityGate(): Promise<QualityGateResult> {
      if (!repoRoot) {
        return {
          available: false,
          passed: null,
          reason: "AI Park リポジトリ外の実行環境のため、ローカル品質ゲートを実行できません。",
        };
      }
      const gateScript = path.join(repoRoot, "scripts", "verify-deployment-gate.mjs");
      if (!fs.existsSync(gateScript)) {
        return {
          available: false,
          passed: null,
          reason: "scripts/verify-deployment-gate.mjs が見つかりません。",
        };
      }

      const parseGateMetrics = (output: string) => {
        const unverifiedMatch = output.match(/対象機能:\s*(\d+)\s*件/);
        const uatMatch = output.match(/手動UAT承認完了機能:\s*(\d+)\s*件/);
        return {
          unverifiedCount: unverifiedMatch ? Number(unverifiedMatch[1]) : undefined,
          uatPassedCount: uatMatch ? Number(uatMatch[1]) : undefined,
        };
      };

      try {
        const { stdout, stderr } = await execFileAsync(process.execPath, [gateScript], {
          cwd: repoRoot,
          timeout: 15000,
          windowsHide: true,
        });
        const combined = [stdout, stderr].filter(Boolean).join("\n").trim();
        return {
          available: true,
          passed: true,
          ...parseGateMetrics(combined),
          rawOutput: combined,
        };
      } catch (err) {
        const e = err as { stdout?: string; stderr?: string; message?: string };
        const combined = [e.stdout, e.stderr, e.message].filter(Boolean).join("\n").trim();
        return {
          available: true,
          passed: false,
          ...parseGateMetrics(combined),
          rawOutput: combined,
        };
      }
    },
  };
}
