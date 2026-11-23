import snapshotRaw from "../generated/portal-snapshot.json" with { type: "json" };
import {
  FEEDBACK_LABEL,
  GITHUB_REPO,
  IDEA_LABEL,
  PROJECT_LABEL,
  SITE_BASE_URL,
  TEST_LABEL,
  TOOLS_SHEET_CSV_URL,
  csvToTools,
  issueToFeedbackItem,
  issueToIdea,
  issueToProject,
} from "./parsers.js";
import type {
  AiNewsPayload,
  BoardKind,
  GcpUsagePayload,
  GitHubIssueRaw,
  PlatformAdapter,
} from "./types.js";

export interface PortalSnapshot {
  generatedFrom: string;
  siteBaseUrl: string;
  githubRepo: string;
  routeMetadata: Record<string, { title: string; description: string }>;
  navigationSections: Array<{
    title?: string;
    href?: string;
    items: Array<{
      name: string;
      href: string;
      icon?: string;
      badge?: string;
      isExternal?: boolean;
    }>;
  }>;
  featureStatusMaster: Array<{
    id: string;
    name: string;
    href: string;
    isVerified: boolean;
    status: "verified" | "in_development" | "poc_sample" | "draft";
    evidence: string;
    currentBadge: string;
    disclaimer: string;
    releaseDate: string;
    releaseCondition: string;
  }>;
  preflightChecklistSummary: Array<{
    id: string;
    name: string;
    path: string;
    targetAudience: string;
    lastVerifiedAt: string;
    verifiedBy: string;
    overallStatus: string;
    environment: string;
    memo: string;
    checks: Record<string, { passed: boolean; evidence: string }>;
  }>;
  troubleshootingCommands: Array<{
    id: string;
    category: string;
    categoryLabel: string;
    errorTitle: string;
    errorPattern: string;
    cause: string;
    solutionCommand: string;
    explanation: string;
    safetyNote?: string;
    frequency: string;
  }>;
  workspaceSkills: Array<{
    id: string;
    name: string;
    displayName: string;
    category: string;
    status: string;
    description: string;
    triggerPhrase: string;
    sourcePath: string;
    githubUrl: string;
  }>;
  mcpGuide: {
    configLocations: Array<{ scope: string; path: string; description: string; caution: string }>;
    configTemplates: Array<{
      id: string;
      title: string;
      serverKey: string;
      transport: string;
      packageOrEndpoint: string;
      summary: string;
      docUrl: string;
    }>;
    safetyChecklist: Array<{
      id: string;
      category: string;
      title: string;
      detail: string;
      actionHint: string;
    }>;
    officialLinks: Array<{ label: string; href: string }>;
  };
  aiNewsFallback: AiNewsPayload;
  gcpUsageFallback: GcpUsagePayload;
}

export const snapshot = snapshotRaw as unknown as PortalSnapshot;

export interface SearchHit {
  kind: "page" | "news" | "troubleshooting" | "skill" | "mcp_guide";
  title: string;
  summary: string;
  path?: string;
  url: string;
  badge?: string;
  score: number;
}

export function buildPublicSiteUrl(routePath: string): string {
  if (/^https?:\/\//i.test(routePath)) return routePath;
  if (routePath === "/") return `${SITE_BASE_URL}/`;
  const [pathPart, hashPart] = routePath.split("#");
  const normalized = pathPart.endsWith("/") ? pathPart : `${pathPart}/`;
  return hashPart ? `${SITE_BASE_URL}${normalized}#${hashPart}` : `${SITE_BASE_URL}${normalized}`;
}

export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 8000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export class PortalService {
  constructor(private readonly adapter: PlatformAdapter) {}

  getSnapshot(): PortalSnapshot {
    return snapshot;
  }

  async searchPortal(params: {
    query: string;
    category?: "all" | "page" | "news" | "troubleshooting" | "skill" | "mcp_guide";
    limit?: number;
  }): Promise<{ query: string; totalHits: number; hits: SearchHit[] }> {
    const q = params.query.trim().toLowerCase();
    const category = params.category ?? "all";
    const limit = Math.min(25, Math.max(1, params.limit ?? 10));
    const tokens = q.split(/\s+/).filter(Boolean);

    const scoreText = (fields: string[]): number => {
      if (tokens.length === 0) return 1;
      const hay = fields.join(" ").toLowerCase();
      let score = 0;
      for (const tok of tokens) {
        if (hay.includes(tok)) {
          score += fields[0]?.toLowerCase().includes(tok) ? 3 : 1;
        }
      }
      return score;
    };

    const hits: SearchHit[] = [];

    if (category === "all" || category === "page") {
      const featureByHref = new Map(
        snapshot.featureStatusMaster.map((f) => [f.href, f])
      );
      for (const [routePath, meta] of Object.entries(snapshot.routeMetadata)) {
        const feature = featureByHref.get(routePath);
        const s = scoreText([
          meta.title,
          routePath,
          meta.description,
          feature?.currentBadge ?? "",
          feature?.disclaimer ?? "",
        ]);
        if (s > 0) {
          hits.push({
            kind: "page",
            title: meta.title,
            summary: feature?.disclaimer ? `${meta.description} (${feature.disclaimer})` : meta.description,
            path: routePath,
            url: buildPublicSiteUrl(routePath),
            badge: feature?.currentBadge ?? "ページ",
            score: s,
          });
        }
      }
    }

    if (category === "all" || category === "news") {
      const news = await this.getAiNews({ query: params.query, limit: 15 });
      for (const item of news.items) {
        const s = scoreText([
          item.title,
          item.summary,
          item.categoryLabel,
          ...(item.tags ?? []),
        ]);
        if (s > 0) {
          hits.push({
            kind: "news",
            title: item.title,
            summary: `${item.date} / ${item.sourceName} — ${item.summary}`,
            path: "/news",
            url: item.sourceUrl || buildPublicSiteUrl("/news"),
            badge: item.importanceLabel,
            score: s,
          });
        }
      }
    }

    if (category === "all" || category === "troubleshooting") {
      for (const cmd of snapshot.troubleshootingCommands) {
        const s = scoreText([
          cmd.errorTitle,
          cmd.errorPattern,
          cmd.cause,
          cmd.solutionCommand,
          cmd.explanation,
          cmd.categoryLabel,
        ]);
        if (s > 0) {
          hits.push({
            kind: "troubleshooting",
            title: `[${cmd.id}] ${cmd.errorTitle}`,
            summary: `${cmd.cause} → コマンド: ${cmd.solutionCommand}`,
            path: "/troubleshooting",
            url: buildPublicSiteUrl("/troubleshooting"),
            badge: cmd.categoryLabel,
            score: s,
          });
        }
      }
    }

    if (category === "all" || category === "skill") {
      for (const skill of snapshot.workspaceSkills) {
        const s = scoreText([
          skill.displayName,
          skill.name,
          skill.description,
          skill.category,
          skill.triggerPhrase,
        ]);
        if (s > 0) {
          hits.push({
            kind: "skill",
            title: `${skill.displayName} (${skill.name})`,
            summary: skill.description,
            path: "/skills-hub",
            url: buildPublicSiteUrl("/skills-hub"),
            badge: skill.category,
            score: s,
          });
        }
      }
    }

    if (category === "all" || category === "mcp_guide") {
      for (const chk of snapshot.mcpGuide.safetyChecklist) {
        const s = scoreText([chk.title, chk.detail, chk.actionHint, chk.category]);
        if (s > 0) {
          hits.push({
            kind: "mcp_guide",
            title: `MCP安全項目: ${chk.title}`,
            summary: `${chk.detail} (${chk.actionHint})`,
            path: "/mcp-hub",
            url: buildPublicSiteUrl("/mcp-hub"),
            badge: chk.category,
            score: s,
          });
        }
      }
    }

    hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
    return {
      query: params.query,
      totalHits: hits.length,
      hits: hits.slice(0, limit),
    };
  }

  getPortalStatus(statusFilter: "all" | "verified" | "in_development" | "poc_sample" | "draft" = "all") {
    const counts = {
      total: snapshot.featureStatusMaster.length,
      verified: snapshot.featureStatusMaster.filter((f) => f.isVerified).length,
      in_development: snapshot.featureStatusMaster.filter((f) => f.status === "in_development").length,
      poc_sample: snapshot.featureStatusMaster.filter((f) => f.status === "poc_sample").length,
      draft: snapshot.featureStatusMaster.filter((f) => f.status === "draft").length,
      uatPassed: snapshot.preflightChecklistSummary.filter((p) => p.overallStatus === "passed").length,
    };

    const features = snapshot.featureStatusMaster
      .filter((f) => statusFilter === "all" || f.status === statusFilter)
      .map((f) => ({
        ...f,
        url: buildPublicSiteUrl(f.href),
      }));

    return {
      counts,
      features,
      preflightRecords: snapshot.preflightChecklistSummary,
    };
  }

  async getAiNews(params: {
    query?: string;
    category?: string;
    importance?: string;
    limit?: number;
  }) {
    const { source, data } = await this.adapter.readLiveNews();
    const q = params.query?.trim().toLowerCase() ?? "";
    const limit = Math.min(52, Math.max(1, params.limit ?? 10));

    const filtered = (data.items ?? []).filter((item) => {
      if (params.category && params.category !== "all" && item.category !== params.category) {
        return false;
      }
      if (params.importance && params.importance !== "all" && item.importance !== params.importance) {
        return false;
      }
      if (!q) return true;
      return [
        item.title,
        item.summary,
        item.sourceName,
        item.categoryLabel,
        ...(item.tags ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    return {
      dataSource: source,
      lastSyncedAtFormatted: data.lastSyncedAtFormatted ?? "",
      syncStatus: data.syncStatus ?? "snapshot",
      activeSources: data.activeSources ?? [],
      totalMatched: filtered.length,
      items: filtered.slice(0, limit),
    };
  }

  async getGeminiUsage(includeDaily = true) {
    const { source, data } = await this.adapter.readLiveGcpUsage();
    return {
      dataSource: source,
      syncedAt: data.syncedAt ?? "",
      label: data.dataSource ?? "",
      isLive: Boolean(data.isLive),
      gcpInfo: data.gcpInfo ?? {},
      summary: data.summary ?? {},
      dailyHistory: includeDaily ? data.dailyHistory ?? [] : undefined,
      users: data.users ?? [],
    };
  }

  async listAiTools(params: { query?: string; status?: string }) {
    const res = await fetchWithTimeout(TOOLS_SHEET_CSV_URL, { cache: "no-store" }, 8000);
    if (!res.ok) {
      throw new Error(`Google Sheets CSV fetch failed with HTTP ${res.status}`);
    }
    const csvText = await res.text();
    const allTools = csvToTools(csvText);
    const q = params.query?.trim().toLowerCase() ?? "";
    const filtered = allTools.filter((t) => {
      if (params.status && params.status !== "all" && t.status !== params.status) return false;
      if (!q) return true;
      return [t.name, t.form, t.description, t.securityLevel, t.status]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    return {
      disclaimer:
        "PoCデータ（社内マスターGoogle Sheetsからライブ取得・適合度や利用ステータスは社内確認前の参考情報）",
      totalTools: allTools.length,
      matchedCount: filtered.length,
      items: filtered,
    };
  }

  async listBoardItems(params: {
    board: BoardKind;
    state?: "all" | "open" | "closed";
    query?: string;
    includeTest?: boolean;
  }) {
    const label =
      params.board === "feedback"
        ? FEEDBACK_LABEL
        : params.board === "ai-project"
        ? PROJECT_LABEL
        : IDEA_LABEL;
    const state = params.state ?? "all";
    const url = `https://api.github.com/repos/${GITHUB_REPO}/issues?labels=${encodeURIComponent(
      label
    )}&state=${encodeURIComponent(state)}&per_page=100&sort=created&direction=desc`;

    const res = await fetchWithTimeout(
      url,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "ai-park-mcp-server/1.0.0",
        },
      },
      8000
    );

    if (!res.ok) {
      throw new Error(`GitHub Issues API failed with HTTP ${res.status}`);
    }

    const rawIssues = (await res.json()) as GitHubIssueRaw[];
    const visible = rawIssues.filter(
      (i) =>
        !i.pull_request &&
        (params.includeTest || !i.labels.some((l) => l.name === TEST_LABEL))
    );

    const q = params.query?.trim().toLowerCase() ?? "";

    if (params.board === "feedback") {
      const items = visible
        .map(issueToFeedbackItem)
        .filter((it) =>
          !q
            ? true
            : [it.title, it.category, it.author, it.authorDept, it.feedbackQuote, it.actionPlan]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
      return { board: params.board, total: items.length, items };
    }

    if (params.board === "ai-project") {
      const items = visible
        .map(issueToProject)
        .filter((it) =>
          !q
            ? true
            : [it.name, it.dept, it.owner, it.tools, it.summary, it.effect]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
      return { board: params.board, total: items.length, items };
    }

    const items = visible
      .map(issueToIdea)
      .filter((it) =>
        !q
          ? true
          : [it.title, it.dept, it.author, it.problem, it.idea, it.tools]
              .join(" ")
              .toLowerCase()
              .includes(q)
      );
    return { board: params.board, total: items.length, items };
  }
}
