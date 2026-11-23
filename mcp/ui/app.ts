import {
  App,
  applyDocumentTheme,
  applyHostStyleVariables,
  type McpUiHostCapabilities,
  type McpUiHostContext,
} from "@modelcontextprotocol/ext-apps";

type TabKey = "search" | "boards" | "news" | "quality";
type BoardKey = "feedback" | "ai-project" | "idea";

interface SearchHit {
  kind: string;
  title: string;
  summary: string;
  path?: string;
  url: string;
  badge?: string;
}

interface ConsoleSnapshot {
  initialTab?: TabKey;
  initialQuery?: string;
  runtimeMode?: string;
  counts?: {
    total: number;
    verified: number;
    in_development: number;
    poc_sample: number;
    draft: number;
    uatPassed: number;
  };
  search?: { query: string; totalHits: number; hits: SearchHit[] };
  news?: {
    dataSource: string;
    lastSyncedAtFormatted?: string;
    items: Array<{
      id: string;
      title: string;
      date: string;
      sourceName: string;
      sourceUrl: string;
      importanceLabel: string;
      summary: string;
    }>;
  };
  usage?: {
    dataSource: string;
    syncedAt?: string;
    gcpInfo?: Record<string, unknown>;
    summary?: Record<string, unknown>;
  };
  features?: Array<{
    id: string;
    name: string;
    href: string;
    url: string;
    isVerified: boolean;
    status: string;
    currentBadge: string;
    disclaimer: string;
  }>;
}

const app = new App({ name: "AI Park Console", version: "1.0.0" }, {});

let hostCaps: McpUiHostCapabilities | undefined;
let activeTab: TabKey = "search";
let currentBoard: BoardKey = "feedback";
let latestData: ConsoleSnapshot = {};

const rootEl = document.getElementById("app") as HTMLDivElement;

function clearChildren(el: HTMLElement): void {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function createEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function applyContext(ctx?: McpUiHostContext): void {
  if (!ctx) return;
  if (ctx.theme) applyDocumentTheme(ctx.theme);
  if (ctx.styles?.variables) applyHostStyleVariables(ctx.styles.variables);
}

// Build persistent static skeleton
rootEl.innerHTML = "";
const shell = createEl("div", "shell");

const topbar = createEl("header", "topbar");
const brand = createEl("div", "brand");
const brandBadge = createEl("span", "brand-badge", "MCP App");
const brandTitle = createEl("h1", "brand-title", "MightyLINK AI Park コンソール");
brand.append(brandBadge, brandTitle);
const statusPill = createEl("span", "status-pill", "初期化中...");
topbar.append(brand, statusPill);

const kpiGrid = createEl("section", "kpi-grid");
const tabList = createEl("div", "tablist");
tabList.setAttribute("role", "tablist");
tabList.setAttribute("aria-label", "AI Park コンソール機能タブ");

const noticeArea = createEl("div", "notice");
noticeArea.setAttribute("role", "status");
noticeArea.setAttribute("aria-live", "polite");
noticeArea.hidden = true;

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "search", label: "🔍 横断検索" },
  { key: "boards", label: "📋 ボード・起票" },
  { key: "news", label: "📰 ニュース & 利用監視" },
  { key: "quality", label: "🛡️ 品質ゲート & 機能状態" },
];

const tabButtons = new Map<TabKey, HTMLButtonElement>();
const panels = new Map<TabKey, HTMLDivElement>();

for (const t of tabs) {
  const btn = createEl("button", "tab-btn", t.label);
  btn.type = "button";
  btn.id = `tab-${t.key}`;
  btn.setAttribute("role", "tab");
  btn.setAttribute("aria-controls", `panel-${t.key}`);
  btn.setAttribute("aria-selected", t.key === activeTab ? "true" : "false");
  btn.addEventListener("click", () => selectTab(t.key));
  tabButtons.set(t.key, btn);
  tabList.appendChild(btn);

  const panel = createEl("div", "panel");
  panel.id = `panel-${t.key}`;
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", btn.id);
  panel.hidden = t.key !== activeTab;
  panels.set(t.key, panel);
}

shell.append(topbar, kpiGrid, tabList, noticeArea, ...panels.values());
rootEl.appendChild(shell);

function setNotice(message: string, tone: "info" | "error" | "success" = "info"): void {
  if (!message) {
    noticeArea.hidden = true;
    return;
  }
  noticeArea.className = tone === "info" ? "notice" : `notice ${tone}`;
  noticeArea.textContent = message;
  noticeArea.hidden = false;
}

function selectTab(next: TabKey): void {
  activeTab = next;
  for (const [k, btn] of tabButtons.entries()) {
    btn.setAttribute("aria-selected", k === next ? "true" : "false");
  }
  for (const [k, panel] of panels.entries()) {
    panel.hidden = k !== next;
  }
}

async function openExternal(url: string): Promise<void> {
  if (hostCaps?.openLinks) {
    const res = await app.openLink({ url });
    if (res.isError) {
      setNotice(`リンクを開けませんでした: ${url}`, "error");
    }
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

async function attachToConversation(label: string, summary: string): Promise<void> {
  if (!hostCaps?.updateModelContext) {
    setNotice("この表示面では会話コンテキスト添付は利用できません。", "error");
    return;
  }
  await app.updateModelContext({
    content: [{ type: "text", text: `[AI Park 参照] ${label}\n${summary}` }],
  });
  setNotice(`会話の次メッセージへ「${label}」を添付しました。`, "success");
}

async function callDashboardTool<T>(args: Record<string, unknown>): Promise<T> {
  const res = await app.callServerTool({
    name: "app_dashboard_action",
    arguments: args,
  });
  if (res.isError) {
    const msg = res.content
      ?.filter((c): c is { type: "text"; text: string } => c.type === "text")
      .map((c) => c.text)
      .join("\n");
    throw new Error(msg || "サーバーツール実行エラー");
  }
  if (res.structuredContent) {
    return res.structuredContent as T;
  }
  const textBlock = res.content?.find(
    (c): c is { type: "text"; text: string } => c.type === "text"
  );
  return (textBlock ? JSON.parse(textBlock.text) : {}) as T;
}

function renderKpis(counts?: ConsoleSnapshot["counts"]): void {
  clearChildren(kpiGrid);
  if (!counts) return;
  const items = [
    { label: "登録機能総数", value: `${counts.total} 件` },
    { label: "公開確認済", value: `${counts.verified} 件` },
    { label: "工事中 / PoC / 準備中", value: `${counts.in_development + counts.poc_sample + counts.draft} 件` },
    { label: "UAT 合格済み", value: `${counts.uatPassed} 件` },
  ];
  for (const item of items) {
    const card = createEl("div", "kpi-card");
    card.append(createEl("div", "kpi-label", item.label), createEl("div", "kpi-value", item.value));
    kpiGrid.appendChild(card);
  }
}

// --- Search Panel ---
const searchPanel = panels.get("search")!;
const searchToolbar = createEl("form", "toolbar");
const searchInput = createEl("input", "input");
searchInput.type = "search";
searchInput.placeholder = "キーワードで AI Park を横断検索（例: Antigravity, MCP, 資格, PowerShell）";
searchInput.setAttribute("aria-label", "AI Park 横断検索");
const searchBtn = createEl("button", "btn btn-primary", "検索");
searchBtn.type = "submit";
searchToolbar.append(searchInput, searchBtn);
const searchResultsList = createEl("div", "card-list");
searchPanel.append(searchToolbar, searchResultsList);

function renderSearchResults(hits: SearchHit[]): void {
  clearChildren(searchResultsList);
  if (hits.length === 0) {
    searchResultsList.appendChild(createEl("div", "notice", "該当する項目が見つかりませんでした。"));
    return;
  }
  for (const hit of hits) {
    const card = createEl("article", "card");
    const head = createEl("div", "card-head");
    head.append(
      createEl("h2", "card-title", hit.title),
      createEl("span", "chip", hit.badge || hit.kind)
    );
    const meta = createEl("div", "card-meta", hit.path || hit.url);
    const body = createEl("p", "card-body", hit.summary);
    const actions = createEl("div", "card-actions");

    const openBtn = createEl("button", "btn", "ページを開く");
    openBtn.type = "button";
    openBtn.addEventListener("click", () => {
      void openExternal(hit.url);
    });
    actions.appendChild(openBtn);

    if (hostCaps?.updateModelContext) {
      const attachBtn = createEl("button", "btn", "会話に添付");
      attachBtn.type = "button";
      attachBtn.addEventListener("click", () => {
        void attachToConversation(hit.title, `${hit.summary}\nURL: ${hit.url}`);
      });
      actions.appendChild(attachBtn);
    }

    card.append(head, meta, body, actions);
    searchResultsList.appendChild(card);
  }
}

searchToolbar.addEventListener("submit", async (e) => {
  e.preventDefault();
  setNotice("検索中...", "info");
  try {
    const res = await callDashboardTool<{ hits?: SearchHit[]; totalHits?: number }>({
      action: "search",
      query: searchInput.value.trim(),
    });
    renderSearchResults(res.hits ?? []);
    setNotice(`検索完了: ${res.totalHits ?? res.hits?.length ?? 0} 件ヒット`, "success");
  } catch (err) {
    setNotice(err instanceof Error ? err.message : String(err), "error");
  }
});

// --- Boards Panel ---
const boardsPanel = panels.get("boards")!;
const boardToolbar = createEl("div", "toolbar");
const boardSelect = createEl("select", "select");
boardSelect.style.maxWidth = "220px";
boardSelect.setAttribute("aria-label", "対象ボード選択");
for (const opt of [
  { value: "feedback", label: "ご意見・改善ToDo (feedback)" },
  { value: "idea", label: "アイデア宣言 (idea)" },
  { value: "ai-project", label: "社内AIプロジェクト (ai-project)" },
]) {
  const o = createEl("option", undefined, opt.label);
  o.value = opt.value;
  boardSelect.appendChild(o);
}
const boardRefreshBtn = createEl("button", "btn btn-primary", "最新を取得");
boardRefreshBtn.type = "button";
boardToolbar.append(boardSelect, boardRefreshBtn);

const boardList = createEl("div", "card-list");

const draftCard = createEl("section", "card");
draftCard.appendChild(createEl("h2", "card-title", "新規ボード起票（下書きプレビュー優先）"));
const draftForm = createEl("form", "panel");
const formGrid = createEl("div", "form-grid");

const titleField = createEl("div", "field");
const titleLbl = createEl("label", undefined, "タイトル（必須）");
titleLbl.setAttribute("for", "draft-title");
const titleInput = createEl("input", "input");
titleInput.id = "draft-title";
titleInput.placeholder = "例: MCP 連携テンプレートの解説追加";
titleField.append(titleLbl, titleInput);

const authorField = createEl("div", "field");
const authorLbl = createEl("label", undefined, "お名前 / 宣言者（ニックネーム可）");
authorLbl.setAttribute("for", "draft-author");
const authorInput = createEl("input", "input");
authorInput.id = "draft-author";
authorInput.placeholder = "例: 開発チーム有志";
authorField.append(authorLbl, authorInput);

const deptField = createEl("div", "field");
const deptLbl = createEl("label", undefined, "所属部署 / チーム");
deptLbl.setAttribute("for", "draft-dept");
const deptInput = createEl("input", "input");
deptInput.id = "draft-dept";
deptInput.placeholder = "例: クラウド開発";
deptField.append(deptLbl, deptInput);

formGrid.append(titleField, authorField, deptField);

const detailField = createEl("div", "field");
const detailLbl = createEl("label", undefined, "詳細・背景（顧客名や個人情報は入力不可）");
detailLbl.setAttribute("for", "draft-detail");
const detailInput = createEl("textarea", "textarea");
detailInput.id = "draft-detail";
detailInput.rows = 3;
detailField.append(detailLbl, detailInput);

const formActions = createEl("div", "card-actions");
const previewBtn = createEl("button", "btn btn-primary", "下書きプレビュー生成");
previewBtn.type = "submit";
const createRealBtn = createEl("button", "btn", "GitHub へ直接起票");
createRealBtn.type = "button";
formActions.append(previewBtn, createRealBtn);

const previewBox = createEl("pre", "code-box");
previewBox.hidden = true;

draftForm.append(formGrid, detailField, formActions, previewBox);
draftCard.appendChild(draftForm);
boardsPanel.append(boardToolbar, boardList, draftCard);

async function loadBoard(): Promise<void> {
  currentBoard = boardSelect.value as BoardKey;
  setNotice("GitHub Issues からボード一覧を取得中...", "info");
  try {
    const res = await callDashboardTool<{ items?: Array<Record<string, unknown>>; total?: number }>({
      action: "list_board",
      board: currentBoard,
    });
    clearChildren(boardList);
    const items = res.items ?? [];
    if (items.length === 0) {
      boardList.appendChild(createEl("div", "notice", "登録されている公開 Issue はありません。"));
    } else {
      for (const item of items.slice(0, 10)) {
        const card = createEl("article", "card");
        const head = createEl("div", "card-head");
        const title = String(item.title ?? item.name ?? "無題");
        const badge = String(item.status ?? item.stage ?? "");
        head.append(createEl("h3", "card-title", title), createEl("span", "chip", badge));
        const desc = String(
          item.feedbackQuote ?? item.summary ?? item.problem ?? item.idea ?? ""
        );
        const actions = createEl("div", "card-actions");
        if (typeof item.issueUrl === "string" && item.issueUrl) {
          const linkBtn = createEl("button", "btn", "Issue を開く");
          linkBtn.type = "button";
          linkBtn.addEventListener("click", () => {
            void openExternal(String(item.issueUrl));
          });
          actions.appendChild(linkBtn);
        }
        card.append(head, createEl("p", "card-body", desc), actions);
        boardList.appendChild(card);
      }
    }
    setNotice(`ボード取得完了 (${currentBoard}): ${res.total ?? items.length} 件`, "success");
  } catch (err) {
    setNotice(err instanceof Error ? err.message : String(err), "error");
  }
}

boardRefreshBtn.addEventListener("click", () => {
  void loadBoard();
});

async function submitDraft(executeReal: boolean): Promise<void> {
  setNotice(executeReal ? "GitHub へ起票中..." : "下書きを生成中...", "info");
  try {
    const res = await callDashboardTool<{
      dryRun?: boolean;
      executed?: boolean;
      issueUrl?: string;
      prefilledUrl?: string;
      body?: string;
      reason?: string;
    }>({
      action: executeReal ? "create_issue" : "preview_issue",
      board: boardSelect.value,
      title: titleInput.value,
      author: authorInput.value,
      dept: deptInput.value,
      detail: detailInput.value,
    });
    previewBox.hidden = false;
    previewBox.textContent = [
      res.issueUrl ? `Issue URL: ${res.issueUrl}` : `起票フォームURL: ${res.prefilledUrl ?? ""}`,
      res.reason ? `補足: ${res.reason}` : "",
      "",
      res.body ?? "",
    ]
      .filter((v) => v !== undefined)
      .join("\n");

    if (res.executed && res.issueUrl) {
      setNotice(`Issue を起票しました: ${res.issueUrl}`, "success");
      await loadBoard();
    } else if (res.dryRun) {
      setNotice("下書きとプリフィルURLを生成しました（まだ起票されていません）。", "success");
    } else {
      setNotice(res.reason || "自動起票は認証待ちです。プレビュー欄の URL から起票できます。", "info");
    }
  } catch (err) {
    setNotice(err instanceof Error ? err.message : String(err), "error");
  }
}

draftForm.addEventListener("submit", (e) => {
  e.preventDefault();
  void submitDraft(false);
});
createRealBtn.addEventListener("click", () => {
  void submitDraft(true);
});

// --- News & Usage Panel ---
const newsPanel = panels.get("news")!;
const newsRefreshToolbar = createEl("div", "toolbar");
const newsRefreshBtn = createEl("button", "btn btn-primary", "ニュース＆GCP利用を再読込");
newsRefreshBtn.type = "button";
newsRefreshToolbar.appendChild(newsRefreshBtn);
const usageCard = createEl("section", "card");
const newsList = createEl("div", "card-list");
newsPanel.append(newsRefreshToolbar, usageCard, newsList);

function renderNewsAndUsage(
  news?: ConsoleSnapshot["news"],
  usage?: ConsoleSnapshot["usage"]
): void {
  clearChildren(usageCard);
  usageCard.appendChild(createEl("h2", "card-title", "Antigravity / Gemini 利用状況"));
  if (usage?.gcpInfo) {
    const info = usage.gcpInfo;
    const sum = usage.summary ?? {};
    usageCard.append(
      createEl(
        "div",
        "card-meta",
        `取得元: ${usage.dataSource} / 同期: ${usage.syncedAt ?? "-"}`
      ),
      createEl(
        "p",
        "card-body",
        `無料トライアル残高: ¥${String(info.remainingCreditJpy ?? "-")} ($${String(
          info.remainingCreditUsd ?? "-"
        )}) / 残日数: ${String(info.trialDaysLeft ?? "-")}日 / 総リクエスト: ${String(
          sum.totalRequests ?? "-"
        )}`
      )
    );
  } else {
    usageCard.appendChild(createEl("div", "card-meta", "利用データ未取得"));
  }

  clearChildren(newsList);
  for (const item of news?.items ?? []) {
    const card = createEl("article", "card");
    const head = createEl("div", "card-head");
    head.append(
      createEl("h3", "card-title", item.title),
      createEl("span", "chip", item.importanceLabel)
    );
    card.append(
      head,
      createEl("div", "card-meta", `${item.date} / ${item.sourceName}`),
      createEl("p", "card-body", item.summary)
    );
    if (item.sourceUrl) {
      const actions = createEl("div", "card-actions");
      const openBtn = createEl("button", "btn", "一次記事を開く");
      openBtn.type = "button";
      openBtn.addEventListener("click", () => {
        void openExternal(item.sourceUrl);
      });
      actions.appendChild(openBtn);
      card.appendChild(actions);
    }
    newsList.appendChild(card);
  }
}

newsRefreshBtn.addEventListener("click", async () => {
  setNotice("最新ニュース・利用状況を再読込中...", "info");
  try {
    const [newsRes, usageRes] = await Promise.all([
      callDashboardTool<ConsoleSnapshot["news"]>({ action: "get_news" }),
      callDashboardTool<ConsoleSnapshot["usage"]>({ action: "get_usage" }),
    ]);
    renderNewsAndUsage(newsRes, usageRes);
    setNotice("ニュース・利用状況を更新しました。", "success");
  } catch (err) {
    setNotice(err instanceof Error ? err.message : String(err), "error");
  }
});

// --- Quality Panel ---
const qualityPanel = panels.get("quality")!;
const gateToolbar = createEl("div", "toolbar");
const runGateBtn = createEl("button", "btn btn-primary", "品質ゲート (check:gate) を実行");
runGateBtn.type = "button";
gateToolbar.appendChild(runGateBtn);
const gateOutputBox = createEl("pre", "code-box");
gateOutputBox.hidden = true;
const featureList = createEl("div", "card-list");
qualityPanel.append(gateToolbar, gateOutputBox, featureList);

function renderFeatures(features?: ConsoleSnapshot["features"]): void {
  clearChildren(featureList);
  for (const f of features ?? []) {
    const card = createEl("article", "card");
    const head = createEl("div", "card-head");
    head.append(
      createEl("h3", "card-title", `${f.name} (${f.href})`),
      createEl("span", "chip", f.currentBadge)
    );
    card.append(
      head,
      createEl("p", "card-body", f.disclaimer || "事実確認・UAT完了（公開中）")
    );
    featureList.appendChild(card);
  }
}

runGateBtn.addEventListener("click", async () => {
  setNotice("verify-deployment-gate.mjs を実行中...", "info");
  try {
    const res = await callDashboardTool<{
      available?: boolean;
      passed?: boolean | null;
      reason?: string;
      rawOutput?: string;
    }>({ action: "run_gate" });
    gateOutputBox.hidden = false;
    gateOutputBox.textContent = res.rawOutput || res.reason || JSON.stringify(res, null, 2);
    if (res.passed) {
      setNotice("品質ゲート通過を確認しました。", "success");
    } else if (res.available === false) {
      setNotice(res.reason || "リモート実行環境のためゲート実行対象外です。", "info");
    } else {
      setNotice("品質ゲートで違反が検出されました。ログをご確認ください。", "error");
    }
  } catch (err) {
    setNotice(err instanceof Error ? err.message : String(err), "error");
  }
});

function renderSnapshot(data: ConsoleSnapshot): void {
  latestData = data;
  statusPill.textContent = `mode: ${data.runtimeMode ?? "unknown"}`;
  if (data.initialQuery !== undefined && !searchInput.value) {
    searchInput.value = data.initialQuery;
  }
  if (data.initialTab && panels.has(data.initialTab)) {
    selectTab(data.initialTab);
  }
  renderKpis(data.counts);
  renderSearchResults(data.search?.hits ?? []);
  renderNewsAndUsage(data.news, data.usage);
  renderFeatures(data.features);
}

// Register handlers BEFORE connect() per MCP Apps spec
app.ontoolinput = ({ arguments: args }) => {
  if (args?.tab && typeof args.tab === "string" && panels.has(args.tab as TabKey)) {
    selectTab(args.tab as TabKey);
  }
  if (typeof args?.query === "string") {
    searchInput.value = args.query;
  }
  statusPill.textContent = "データ読込中...";
};

app.ontoolresult = (result) => {
  if (result.structuredContent) {
    renderSnapshot(result.structuredContent as ConsoleSnapshot);
    setNotice("", "info");
  }
};

app.onhostcontextchanged = (ctx) => {
  applyContext(ctx);
};

async function init(): Promise<void> {
  if (window.parent === window) {
    statusPill.textContent = "standalone preview";
    setNotice(
      "単体ブラウザプレビュー表示中（Antigravity サイドパネル/チャット内で実行するとライブ接続されます）。",
      "info"
    );
    return;
  }
  try {
    await app.connect();
    hostCaps = app.getHostCapabilities();
    applyContext(app.getHostContext());
    statusPill.textContent = hostCaps?.serverTools ? "connected" : "connected (readonly)";
    if (!latestData.counts && hostCaps?.serverTools) {
      const [statusRes, searchRes, newsRes, usageRes] = await Promise.all([
        callDashboardTool<{ counts: ConsoleSnapshot["counts"]; features: ConsoleSnapshot["features"] }>({
          action: "get_status",
        }),
        callDashboardTool<{ query: string; totalHits: number; hits: SearchHit[] }>({
          action: "search",
          query: "",
        }),
        callDashboardTool<ConsoleSnapshot["news"]>({ action: "get_news" }),
        callDashboardTool<ConsoleSnapshot["usage"]>({ action: "get_usage" }),
      ]);
      renderSnapshot({
        runtimeMode: "connected",
        counts: statusRes.counts,
        features: statusRes.features,
        search: searchRes,
        news: newsRes,
        usage: usageRes,
      });
    }
  } catch (err) {
    statusPill.textContent = "connection error";
    setNotice(err instanceof Error ? err.message : String(err), "error");
  }
}

void init();
