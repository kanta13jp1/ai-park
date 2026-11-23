export interface WebMcpToolAnnotations {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  consequentialHint?: boolean;
  debugging?: boolean;
}

export interface WebMcpToolDefinition {
  name: string;
  title?: string;
  description: string;
  inputSchema?: object;
  outputSchema?: object;
  annotations?: WebMcpToolAnnotations;
  execute: (
    inputObject: Record<string, unknown>,
    options: { signal: AbortSignal }
  ) => unknown | Promise<unknown>;
}

export interface WebMcpModelContext {
  registerTool: (
    tool: WebMcpToolDefinition,
    options?: { signal?: AbortSignal; exposedTo?: string[] }
  ) => Promise<void> | void;
}

export interface AiParkWebMcpRouteInfo {
  path: string;
  title: string;
  description: string;
  status?: string;
  badge?: string;
}

export interface AiParkWebMcpDeps {
  modelContext: WebMcpModelContext | undefined | null;
  routes: AiParkWebMcpRouteInfo[];
  navigate: (path: string) => void;
  openCommandPalette: (query?: string) => void;
  getCurrentPage: () => {
    path: string;
    title: string;
    headings: string[];
  };
}

export function normalizeAiParkRoutePath(rawPath: string): string {
  let clean = rawPath.trim();
  if (!clean) return "/";
  clean = clean.split("#")[0]?.split("?")[0] ?? clean;
  if (clean.startsWith("/ai-park/")) {
    clean = clean.slice("/ai-park".length);
  } else if (clean === "/ai-park") {
    clean = "/";
  }
  if (!clean.startsWith("/")) clean = `/${clean}`;
  if (clean.length > 1 && clean.endsWith("/")) {
    clean = clean.slice(0, -1);
  }
  return clean;
}

export function registerAiParkWebMcpTools(deps: AiParkWebMcpDeps): AbortController | null {
  if (!deps.modelContext || typeof deps.modelContext.registerTool !== "function") {
    return null;
  }

  const controller = new AbortController();
  const allowedRouteMap = new Map<string, AiParkWebMcpRouteInfo>();
  for (const r of deps.routes) {
    allowedRouteMap.set(normalizeAiParkRoutePath(r.path), r);
  }

  const tools: WebMcpToolDefinition[] = [
    {
      name: "ai_park_list_routes",
      title: "AI Park ページ一覧取得",
      description:
        "AI Park ポータル内の全ページパス、タイトル、概要、公開ステータス（公開中/工事中/PoC中/準備中）を一覧で返します。",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "パスやタイトルで絞り込むキーワード（任意）",
          },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: (input) => {
        const q = typeof input.query === "string" ? input.query.trim().toLowerCase() : "";
        const matched = deps.routes.filter((r) => {
          if (!q) return true;
          return [r.path, r.title, r.description, r.badge ?? "", r.status ?? ""]
            .join(" ")
            .toLowerCase()
            .includes(q);
        });
        return {
          totalRoutes: matched.length,
          routes: matched,
        };
      },
    },
    {
      name: "ai_park_navigate",
      title: "AI Park ページ移動",
      description:
        "AI Park ポータル内の実在するルート（例: /guide, /mcp-hub, /feedback-todo）へクライアントサイド遷移します。",
      inputSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "遷移先のポータル内パス（例: /mcp-hub または /）",
          },
        },
        required: ["path"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: (input) => {
        const rawPath = typeof input.path === "string" ? input.path : "";
        if (!rawPath || /^https?:\/\//i.test(rawPath) || rawPath.startsWith("//")) {
          return {
            navigated: false,
            error: "外部 URL または空パスには遷移できません。AI Park 内のパスを指定してください。",
          };
        }
        const normalized = normalizeAiParkRoutePath(rawPath);
        const route = allowedRouteMap.get(normalized);
        if (!route) {
          return {
            navigated: false,
            requestedPath: rawPath,
            error: `未登録のパス "${normalized}" は許可されていません。ai_park_list_routes で一覧を確認してください。`,
          };
        }
        deps.navigate(normalized);
        return {
          navigated: true,
          path: normalized,
          title: route.title,
        };
      },
    },
    {
      name: "ai_park_get_current_page",
      title: "現在表示中のページ情報取得",
      description:
        "ブラウザで現在開いている AI Park ページのパス、タイトル、主要見出し（h1/h2/h3）を返します。",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: () => deps.getCurrentPage(),
    },
    {
      name: "ai_park_open_command_palette",
      title: "AI Park コマンドパレットを開く",
      description:
        "AI Park のクイック検索コマンドパレット（⌘K）を開き、必要に応じて初期検索キーワードを設定します。",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "コマンドパレットに入力する初期検索キーワード（任意）",
          },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: (input) => {
        const query = typeof input.query === "string" ? input.query.trim() : "";
        deps.openCommandPalette(query || undefined);
        return {
          opened: true,
          query,
        };
      },
    },
  ];

  for (const tool of tools) {
    try {
      void Promise.resolve(deps.modelContext.registerTool(tool, { signal: controller.signal })).catch(
        () => {
          // Ignore browser polyfill/experimental rejection
        }
      );
    } catch {
      // Ignore unsupported experimental browser API errors
    }
  }

  return controller;
}
