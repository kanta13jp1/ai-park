import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const rootDir = process.cwd();

function stripJsonComments(src) {
  return src.replace(/^\s*\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

function walkFiles(dir, predicate) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(full, predicate));
    } else if (predicate(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

test("All MCP & plugin JSON/JSONC files are valid UTF-8 without BOM", () => {
  const jsonTargets = [
    ".agents/plugins/ai-park-mcp/plugin.json",
    ".agents/plugins/ai-park-mcp/mcp_config.json",
    "mcp/package.json",
    "mcp/tsconfig.json",
    "mcp/mcp_config.example.json",
    "mcp/worker/wrangler.jsonc",
  ];

  for (const rel of jsonTargets) {
    const full = path.join(rootDir, rel);
    const bytes = fs.readFileSync(full);
    assert.equal(
      bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf,
      false,
      `${rel} must not contain a UTF-8 BOM`
    );
    const text = bytes.toString("utf8");
    const parsed = JSON.parse(rel.endsWith(".jsonc") ? stripJsonComments(text) : text);
    assert.ok(parsed && typeof parsed === "object", `${rel} must parse to JSON object`);
  }

  const pluginJson = JSON.parse(
    fs.readFileSync(path.join(rootDir, ".agents/plugins/ai-park-mcp/plugin.json"), "utf8")
  );
  assert.equal(pluginJson.name, "ai-park-mcp");
  assert.equal(pluginJson.displayName, "AI Park");
  assert.ok(Array.isArray(pluginJson.suggestedPrompts) && pluginJson.suggestedPrompts.length <= 3);
});

test("Plugin bundle and MCP dist outputs contain zero local filesystem paths or live secrets", () => {
  const files = [
    ...walkFiles(path.join(rootDir, ".agents/plugins/ai-park-mcp"), (n) =>
      /\.(json|md|svg|mjs|js)$/.test(n)
    ),
    ...walkFiles(path.join(rootDir, "mcp/dist"), (n) => /\.(mjs|js|html)$/.test(n)),
  ];
  assert.ok(files.length >= 6, "Expected built plugin and dist artifacts");

  const windowsUserPath = /[A-Za-z]:\\Users\\[A-Za-z0-9._-]+\\/;
  const unixUserPath = /\/Users\/[A-Za-z0-9._-]+\//;
  const googleApiKey = /AIza[0-9A-Za-z_-]{30,}/;
  const githubPat = /(?:ghp|github_pat)_[0-9A-Za-z_]{20,}/;
  const privateKeyBlock = /-----BEGIN [A-Z ]*PRIVATE KEY-----/;

  const leaks = [];
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const rel = path.relative(rootDir, file).replace(/\\/g, "/");
    if (windowsUserPath.test(content) || unixUserPath.test(content)) {
      leaks.push(`${rel}: local filesystem path`);
    }
    if (googleApiKey.test(content) || githubPat.test(content) || privateKeyBlock.test(content)) {
      leaks.push(`${rel}: secret/token pattern`);
    }
  }
  assert.deepEqual(leaks, [], `Hygiene leak detected:\n${leaks.join("\n")}`);
});

test("Stdio MCP server (.agents/plugins/ai-park-mcp/bin/server.mjs) serves tools, resources, prompts, UI, and safety guards E2E", async () => {
  const serverPath = path.join(rootDir, ".agents/plugins/ai-park-mcp/bin/server.mjs");
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
    cwd: rootDir,
    env: {
      ...process.env,
      AI_PARK_REPO_ROOT: rootDir,
    },
    stderr: "pipe",
  });
  const client = new Client({ name: "ai-park-test-client", version: "1.0.0" });

  try {
    await client.connect(transport);

    const toolsResult = await client.listTools();
    assert.equal(toolsResult.tools.length, 11);
    const toolMap = new Map(toolsResult.tools.map((t) => [t.name, t]));
    const expectedTools = [
      "open_ai_park_console",
      "search_portal",
      "get_portal_status",
      "get_ai_news",
      "get_gemini_usage",
      "list_ai_tools",
      "list_board_items",
      "create_board_item",
      "update_board_item_status",
      "run_quality_gate",
      "app_dashboard_action",
    ];
    for (const name of expectedTools) {
      assert.ok(toolMap.has(name), `Missing MCP tool: ${name}`);
    }

    const consoleMeta = toolMap.get("open_ai_park_console")?._meta;
    assert.equal(consoleMeta?.ui?.resourceUri, "ui://ai-park/dashboard.html");
    assert.equal(consoleMeta?.["ui/resourceUri"], "ui://ai-park/dashboard.html");
    const entrypoints = consoleMeta?.["com.google.antigravity/ui"]?.entrypoints ?? [];
    assert.ok(entrypoints.some((e) => e.type === "aux_pane" && e.title === "AI Park"));
    assert.ok(entrypoints.some((e) => e.type === "global" && e.title === "AI Park"));

    const appOnlyMeta = toolMap.get("app_dashboard_action")?._meta;
    assert.deepEqual(appOnlyMeta?.ui?.visibility, ["app"]);

    const resourcesResult = await client.listResources();
    const resourceUris = resourcesResult.resources.map((r) => r.uri);
    for (const uri of [
      "aipark://routes",
      "aipark://feature-status",
      "aipark://news",
      "aipark://preflight",
      "ui://ai-park/dashboard.html",
    ]) {
      assert.ok(resourceUris.includes(uri), `Missing MCP resource: ${uri}`);
    }

    const promptsResult = await client.listPrompts();
    const promptNames = promptsResult.prompts.map((p) => p.name);
    for (const name of ["triage_feedback", "draft_idea_declaration", "release_readiness_check"]) {
      assert.ok(promptNames.includes(name), `Missing MCP prompt: ${name}`);
    }

    const uiResource = await client.readResource({ uri: "ui://ai-park/dashboard.html" });
    const uiContent = uiResource.contents[0];
    assert.equal(uiContent.mimeType, "text/html;profile=mcp-app");
    assert.ok(typeof uiContent.text === "string" && uiContent.text.length > 500);
    assert.ok(Buffer.byteLength(uiContent.text, "utf8") < 10 * 1024 * 1024);
    assert.equal(/<script[^>]+src=["']https?:/i.test(uiContent.text), false);
    assert.ok(uiContent.text.includes("ui/initialize"));
    assert.ok(uiContent.text.includes("--color-background-primary"));

    const searchRes = await client.callTool({
      name: "search_portal",
      arguments: { query: "Antigravity" },
    });
    assert.equal(searchRes.isError ?? false, false);
    assert.ok(searchRes.structuredContent.totalHits > 0);
    assert.ok(
      searchRes.structuredContent.hits.some((h) =>
        String(h.url).startsWith("https://kanta13jp1.github.io/ai-park/")
      )
    );

    const statusRes = await client.callTool({ name: "get_portal_status", arguments: {} });
    assert.ok(statusRes.structuredContent.counts.total >= 20);
    assert.ok(statusRes.structuredContent.counts.verified >= 10);

    const newsRes = await client.callTool({ name: "get_ai_news", arguments: { limit: 3 } });
    assert.ok(newsRes.structuredContent.items.length > 0);

    const usageRes = await client.callTool({
      name: "get_gemini_usage",
      arguments: { includeDaily: false },
    });
    assert.ok(usageRes.structuredContent.gcpInfo);

    const previewRes = await client.callTool({
      name: "create_board_item",
      arguments: {
        board: "idea",
        title: "MCP連携テスト提案",
        dept: "クラウド開発",
        author: "開発有志",
        problem: "検索に時間がかかる",
        idea: "MCP で横断検索する",
        dryRun: true,
      },
    });
    assert.equal(previewRes.structuredContent.dryRun, true);
    assert.ok(
      String(previewRes.structuredContent.prefilledUrl).startsWith(
        "https://github.com/kanta13jp1/ai-park/issues/new?"
      )
    );

    const blockedRes = await client.callTool({
      name: "create_board_item",
      arguments: {
        board: "feedback",
        title: "機密テスト",
        quote: "secret@ml-mightylink.com",
        dryRun: true,
      },
    });
    assert.equal(blockedRes.isError, true);

    const updatePreviewRes = await client.callTool({
      name: "update_board_item_status",
      arguments: {
        issueNumber: 1,
        action: "start_progress",
        dryRun: true,
      },
    });
    assert.equal(updatePreviewRes.structuredContent.dryRun, true);

    const gateRes = await client.callTool({ name: "run_quality_gate", arguments: {} });
    assert.equal(gateRes.structuredContent.available, true);
    assert.equal(gateRes.structuredContent.passed, true);

    const consoleRes = await client.callTool({
      name: "open_ai_park_console",
      arguments: {},
    });
    assert.ok(Array.isArray(consoleRes.content) && consoleRes.content.length > 0);
    assert.ok(consoleRes.structuredContent && consoleRes.structuredContent.counts);
  } finally {
    await client.close();
  }
});

test("Node Streamable HTTP server (mcp/dist/http.mjs) enforces Bearer auth and handles MCP calls E2E", async () => {
  const { startHttpServer } = await import(pathToFileURL(path.join(rootDir, "mcp/dist/http.mjs")).href);
  const handle = await startHttpServer({
    host: "127.0.0.1",
    port: 0,
    authToken: "test-mcp-token",
    repoRoot: rootDir,
  });

  const client = new Client({ name: "ai-park-http-test", version: "1.0.0" });
  try {
    const healthRes = await fetch(handle.url.replace(/\/mcp$/, "/health"));
    assert.equal(healthRes.status, 200);
    const healthJson = await healthRes.json();
    assert.equal(healthJson.status, "ok");

    const unauthRes = await fetch(handle.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    assert.equal(unauthRes.status, 401);

    const getRes = await fetch(handle.url, {
      method: "GET",
      headers: { Authorization: "Bearer test-mcp-token" },
    });
    assert.equal(getRes.status, 405);

    const transport = new StreamableHTTPClientTransport(new URL(handle.url), {
      requestInit: {
        headers: { Authorization: "Bearer test-mcp-token" },
      },
    });
    await client.connect(transport);
    const tools = await client.listTools();
    assert.equal(tools.tools.length, 11);

    const res = await client.callTool({
      name: "search_portal",
      arguments: { query: "MCP" },
    });
    assert.ok(res.structuredContent.totalHits > 0);
  } finally {
    await client.close().catch(() => {});
    await handle.close();
  }
});

test("Cloudflare Worker adapter (mcp/dist/worker.mjs) enforces fail-closed 503, auth 401, and Streamable HTTP MCP E2E", async () => {
  const workerMod = await import(pathToFileURL(path.join(rootDir, "mcp/dist/worker.mjs")).href);
  const worker = workerMod.default;

  const noAuthHealthRes = await worker.fetch(new Request("https://example.workers.dev/health"), {});
  assert.equal(noAuthHealthRes.status, 200);
  const noAuthHealth = await noAuthHealthRes.json();
  assert.equal(noAuthHealth.authConfigured, false);

  const failClosedRes = await worker.fetch(
    new Request("https://example.workers.dev/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    }),
    {}
  );
  assert.equal(failClosedRes.status, 503);

  const env = { AI_PARK_MCP_AUTH_TOKEN: "worker-secret-token" };

  const healthRes = await worker.fetch(new Request("https://example.workers.dev/health"), env);
  assert.equal(healthRes.status, 200);
  const health = await healthRes.json();
  assert.equal(health.service, "ai-park-mcp-worker");
  assert.equal(health.authConfigured, true);

  const unauthRes = await worker.fetch(
    new Request("https://example.workers.dev/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer wrong-token",
      },
      body: "{}",
    }),
    env
  );
  assert.equal(unauthRes.status, 401);

  const client = new Client({ name: "ai-park-worker-test", version: "1.0.0" });
  try {
    const transport = new StreamableHTTPClientTransport(new URL("https://example.workers.dev/mcp"), {
      fetch: (input, init) => {
        const req = input instanceof Request ? input : new Request(input, init);
        return worker.fetch(req, env);
      },
      requestInit: {
        headers: {
          Authorization: "Bearer worker-secret-token",
        },
      },
    });
    await client.connect(transport);
    const tools = await client.listTools();
    assert.equal(tools.tools.length, 11);

    const gateRes = await client.callTool({ name: "run_quality_gate", arguments: {} });
    assert.equal(gateRes.structuredContent.available, false);
  } finally {
    await client.close().catch(() => {});
  }
});

test("WebMCP helper (src/lib/webmcp.ts) registers 4 tools safely, validates routes, and cleans up via AbortController", async () => {
  const mod = await import(pathToFileURL(path.join(rootDir, "src/lib/webmcp.ts")).href);
  const { registerAiParkWebMcpTools, normalizeAiParkRoutePath } = mod;

  assert.equal(normalizeAiParkRoutePath("/ai-park/mcp-hub/"), "/mcp-hub");
  assert.equal(normalizeAiParkRoutePath("/ai-park"), "/");

  assert.equal(
    registerAiParkWebMcpTools({
      modelContext: undefined,
      routes: [],
      navigate: () => {},
      openCommandPalette: () => {},
      getCurrentPage: () => ({ path: "/", title: "Home", headings: [] }),
    }),
    null
  );

  const registered = [];
  let navigatedTo = null;
  let paletteOpenedWith = null;

  const controller = registerAiParkWebMcpTools({
    modelContext: {
      registerTool(tool, options) {
        registered.push({ tool, signal: options?.signal });
      },
    },
    routes: [
      { path: "/", title: "トップ", description: "ホーム" },
      { path: "/mcp-hub", title: "MCP連携ハブ", description: "MCPガイド" },
    ],
    navigate: (p) => {
      navigatedTo = p;
    },
    openCommandPalette: (q) => {
      paletteOpenedWith = q ?? "";
    },
    getCurrentPage: () => ({ path: "/mcp-hub", title: "MCP連携ハブ", headings: ["見出し1"] }),
  });

  assert.ok(controller instanceof AbortController);
  assert.equal(registered.length, 4);
  assert.deepEqual(
    registered.map((r) => r.tool.name),
    [
      "ai_park_list_routes",
      "ai_park_navigate",
      "ai_park_get_current_page",
      "ai_park_open_command_palette",
    ]
  );

  const navTool = registered.find((r) => r.tool.name === "ai_park_navigate").tool;
  const dummySignal = new AbortController().signal;

  const okNav = await navTool.execute({ path: "/mcp-hub/" }, { signal: dummySignal });
  assert.equal(okNav.navigated, true);
  assert.equal(navigatedTo, "/mcp-hub");

  const badNav = await navTool.execute({ path: "/does-not-exist" }, { signal: dummySignal });
  assert.equal(badNav.navigated, false);

  const extNav = await navTool.execute({ path: "https://example.com" }, { signal: dummySignal });
  assert.equal(extNav.navigated, false);

  const paletteTool = registered.find((r) => r.tool.name === "ai_park_open_command_palette").tool;
  const paletteRes = await paletteTool.execute({ query: "Antigravity" }, { signal: dummySignal });
  assert.equal(paletteRes.opened, true);
  assert.equal(paletteOpenedWith, "Antigravity");

  controller.abort();
  assert.ok(registered.every((r) => r.signal?.aborted === true));
});

test("/mcp-hub page preserves A11y tabs, button types, responsive table classes, and AI Park MCP section", () => {
  const pagePath = path.join(rootDir, "src/app/mcp-hub/page.tsx");
  const content = fs.readFileSync(pagePath, "utf8");

  for (const token of [
    'id="ai-park-mcp"',
    'role="tablist"',
    'role="tab"',
    "aria-selected",
    'role="tabpanel"',
    'aria-live="polite"',
    'min-w-[640px]',
  ]) {
    assert.ok(content.includes(token), `/mcp-hub/page.tsx missing ${token}`);
  }

  const buttonMatches = [...content.matchAll(/<button\b/g)];
  assert.ok(buttonMatches.length > 0);
  for (let i = 0; i < buttonMatches.length; i++) {
    const start = buttonMatches[i].index;
    const nextStart = i + 1 < buttonMatches.length ? buttonMatches[i + 1].index : content.length;
    const chunk = content.slice(start, Math.min(nextStart, start + 350));
    assert.match(chunk, /\btype="button"/, `/mcp-hub/page.tsx button at ${start} missing type="button"`);
  }
});
