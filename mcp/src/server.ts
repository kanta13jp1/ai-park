import {
  RESOURCE_MIME_TYPE,
  RESOURCE_URI_META_KEY,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  FEEDBACK_CATEGORIES,
  GITHUB_REPO,
  IN_PROGRESS_LABEL,
  buildBoardIssueDraft,
  detectSensitiveContent,
} from "./lib/parsers.js";
import { PortalService, buildPublicSiteUrl } from "./lib/portal-service.js";
import type { BoardKind, FeedbackCategory, FeedbackPriority, PlatformAdapter } from "./lib/types.js";

export const DASHBOARD_RESOURCE_URI = "ui://ai-park/dashboard.html";

const feedbackCategoryEnum = z.enum([
  "UI/UX",
  "AI導入編",
  "AI初級編",
  "AI実践編",
  "ガイドライン",
  "企画・懸賞",
  "開発環境",
  "アカウント運用",
]);

function jsonText(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function createAiParkMcpServer(adapter: PlatformAdapter): McpServer {
  const service = new PortalService(adapter);

  const server = new McpServer(
    {
      name: "ai-park",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  const buildConsoleSnapshot = async (tab?: string, query?: string) => {
    const portalStatus = service.getPortalStatus("all");
    const news = await service.getAiNews({ query, limit: 8 });
    const usage = await service.getGeminiUsage(false);
    const search = await service.searchPortal({ query: query ?? "", limit: 12 });
    return {
      initialTab: tab ?? "search",
      initialQuery: query ?? "",
      runtimeMode: adapter.mode,
      counts: portalStatus.counts,
      search,
      news: {
        dataSource: news.dataSource,
        lastSyncedAtFormatted: news.lastSyncedAtFormatted,
        items: news.items,
      },
      usage: {
        dataSource: usage.dataSource,
        syncedAt: usage.syncedAt,
        gcpInfo: usage.gcpInfo,
        summary: usage.summary,
      },
      features: portalStatus.features.slice(0, 28),
      feedbackCategories: [...FEEDBACK_CATEGORIES],
    };
  };

  // 1. MCP App Interactive Console (side pane + global sidebar + inline)
  server.registerTool(
    "open_ai_park_console",
    {
      title: "AI Park コンソールを開く",
      description:
        "AI Park ポータル（横断検索、ご意見/アイデア/プロジェクトボード、ニュース＆Gemini利用監視、品質ゲート状況）のインタラクティブ操作画面を開きます。",
      inputSchema: z.object({
        tab: z
          .enum(["search", "boards", "news", "quality"])
          .optional()
          .describe("最初に開くタブ（省略時は search）"),
        query: z
          .string()
          .optional()
          .describe("初期検索キーワード（省略可）"),
      }),
      annotations: { readOnlyHint: true },
      _meta: {
        ui: { resourceUri: DASHBOARD_RESOURCE_URI },
        [RESOURCE_URI_META_KEY]: DASHBOARD_RESOURCE_URI,
        "com.google.antigravity/ui": {
          entrypoints: [
            { type: "aux_pane", title: "AI Park" },
            { type: "global", title: "AI Park" },
          ],
        },
      },
    },
    async (args) => {
      const data = await buildConsoleSnapshot(args.tab, args.query);
      const summaryLines = [
        `AI Park コンソール概要 (mode=${data.runtimeMode})`,
        `- 登録機能: ${data.counts.total}件 (公開確認済 ${data.counts.verified}件 / 工事中 ${data.counts.in_development}件 / PoC ${data.counts.poc_sample}件 / 準備中 ${data.counts.draft}件)`,
        `- UAT合格: ${data.counts.uatPassed}件`,
        `- 最新ニュース取得元: ${data.news.dataSource} (${data.news.items.length}件表示)`,
        `- 検索結果 (${data.initialQuery || "全件"}): ${data.search.totalHits}件ヒット`,
      ];
      return {
        content: [{ type: "text", text: summaryLines.join("\n") }],
        structuredContent: data,
      };
    }
  );

  // 2. Portal Cross-Search
  server.registerTool(
    "search_portal",
    {
      title: "AI Park ポータル横断検索",
      description:
        "AI Park 内の全ページ、ガイド、最新ニュース、Windows トラブルシューティング、Skills、MCP 安全チェックリストを横断検索し、該当 URL を返します。",
      inputSchema: z.object({
        query: z.string().describe("検索キーワード（空文字の場合は主要一覧を返却）"),
        category: z
          .enum(["all", "page", "news", "troubleshooting", "skill", "mcp_guide"])
          .optional()
          .describe("対象カテゴリ（既定: all）"),
        limit: z.number().int().min(1).max(25).optional().describe("最大取得件数（既定: 10）"),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ query, category, limit }) => {
      const result = await service.searchPortal({ query, category, limit });
      return {
        content: [{ type: "text", text: jsonText(result) }],
        structuredContent: result,
      };
    }
  );

  // 3. Portal Status & UAT Summary
  server.registerTool(
    "get_portal_status",
    {
      title: "ポータル公開ステータス・UAT状況照会",
      description:
        "feature-status.ts と preflight-checklist.ts に基づき、公開済み・工事中・PoC中・準備中の各機能ステータスと 4大軸 UAT 合格状況を返します。",
      inputSchema: z.object({
        statusFilter: z
          .enum(["all", "verified", "in_development", "poc_sample", "draft"])
          .optional()
          .describe("ステータス絞り込み（既定: all）"),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ statusFilter }) => {
      const result = service.getPortalStatus(statusFilter ?? "all");
      return {
        content: [{ type: "text", text: jsonText(result) }],
        structuredContent: result,
      };
    }
  );

  // 4. AI News
  server.registerTool(
    "get_ai_news",
    {
      title: "最新AIニュース取得",
      description:
        "AI Park で配信中の公式 RSS/Atom 巡回AIニュース（Google DeepMind / Antigravity / OpenAI 等）をキーワード・カテゴリ別に取得します。",
      inputSchema: z.object({
        query: z.string().optional().describe("キーワード絞り込み"),
        category: z.string().optional().describe("カテゴリID（model / industry 等）"),
        importance: z.string().optional().describe("重要度（official / tech 等）"),
        limit: z.number().int().min(1).max(52).optional().describe("最大取得件数（既定: 10）"),
      }),
      annotations: { readOnlyHint: true },
    },
    async (args) => {
      const result = await service.getAiNews(args);
      return {
        content: [{ type: "text", text: jsonText(result) }],
        structuredContent: result,
      };
    }
  );

  // 5. Gemini Usage Stats
  server.registerTool(
    "get_gemini_usage",
    {
      title: "Gemini / Antigravity 利用状況取得",
      description:
        "会社の Google Cloud トライアル残高・課金推移・リクエスト/トークン集計（gcp-usage-live.json 基準）を取得します。",
      inputSchema: z.object({
        includeDaily: z.boolean().optional().describe("日次履歴配列を含めるか（既定: true）"),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ includeDaily }) => {
      const result = await service.getGeminiUsage(includeDaily ?? true);
      return {
        content: [{ type: "text", text: jsonText(result) }],
        structuredContent: result,
      };
    }
  );

  // 6. AI Tools Matrix (Live Google Sheets CSV)
  server.registerTool(
    "list_ai_tools",
    {
      title: "AIツール検証マトリックス取得",
      description:
        "社内マスター Google Sheets（PoC 同期中）から AI ツール一覧をライブ取得し、キーワードやステータスで絞り込みます。",
      inputSchema: z.object({
        query: z.string().optional().describe("ツール名や用途の検索語"),
        status: z
          .enum(["all", "全社員利用可能", "利用可能", "社内セキュア網", "検証中", "リストアップ"])
          .optional()
          .describe("ステータス絞り込み"),
      }),
      annotations: { readOnlyHint: true },
    },
    async (args) => {
      try {
        const result = await service.listAiTools(args);
        return {
          content: [{ type: "text", text: jsonText(result) }],
          structuredContent: result,
        };
      } catch (err) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `AIツール一覧のライブ取得に失敗しました: ${
                err instanceof Error ? err.message : String(err)
              }`,
            },
          ],
        };
      }
    }
  );

  // 7. Board Items (GitHub Issues Live)
  server.registerTool(
    "list_board_items",
    {
      title: "AI Park ボード一覧取得",
      description:
        "ご意見・改善ToDo（feedback）、社内AIプロジェクト（ai-project）、アイデア宣言（idea）の GitHub Issue 一覧をライブ取得します（test ラベル除外）。",
      inputSchema: z.object({
        board: z.enum(["feedback", "ai-project", "idea"]).describe("対象ボード"),
        state: z.enum(["all", "open", "closed"]).optional().describe("Issue 状態（既定: all）"),
        query: z.string().optional().describe("キーワード絞り込み"),
        includeTest: z.boolean().optional().describe("test ラベル付き Issue を含めるか（既定: false）"),
      }),
      annotations: { readOnlyHint: true },
    },
    async (args) => {
      try {
        const result = await service.listBoardItems(args);
        return {
          content: [{ type: "text", text: jsonText(result) }],
          structuredContent: result,
        };
      } catch (err) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `GitHub Issues (${args.board}) の取得に失敗しました: ${
                err instanceof Error ? err.message : String(err)
              }`,
            },
          ],
        };
      }
    }
  );

  // 8. Create Board Item (Safe dryRun default + secret guard)
  server.registerTool(
    "create_board_item",
    {
      title: "AI Park ボード起票（ご意見 / プロジェクト / アイデア）",
      description:
        "GitHub Issue テンプレート準拠の起票内容を生成し、dryRun=true（既定）で下書き＆プリフィルURLを返します。ユーザー承認後に dryRun=false で実起票できます（公開リポジトリのため機密・個人情報は自動ブロック）。",
      inputSchema: z.object({
        board: z.enum(["feedback", "ai-project", "idea"]).describe("起票先ボード"),
        title: z.string().min(2).describe("タイトル（接頭辞は自動付与）"),
        author: z.string().optional().describe("お名前 / 担当者 / 宣言者（ニックネーム可）"),
        dept: z.string().optional().describe("所属部署 / チーム"),
        category: feedbackCategoryEnum.optional().describe("feedback 用カテゴリ"),
        priority: z.enum(["高", "中", "低"]).optional().describe("feedback 用優先度"),
        quote: z.string().optional().describe("feedback 用原文・メモ"),
        actionPlan: z.string().optional().describe("feedback 用対応方針"),
        stage: z.string().optional().describe("ai-project / idea 用の状況"),
        tools: z.string().optional().describe("利用・希望 AI ツール"),
        summary: z.string().optional().describe("ai-project 用概要"),
        effect: z.string().optional().describe("ai-project 用成果・課題"),
        problem: z.string().optional().describe("idea 用困っていること"),
        idea: z.string().optional().describe("idea 用AIにさせたいこと"),
        wantsHelp: z.boolean().optional().describe("idea 用協力者募集フラグ"),
        isTest: z.boolean().optional().describe("連携テスト用に test ラベルを付けるか"),
        dryRun: z
          .boolean()
          .optional()
          .describe("true の場合は起票せずプレビューとプリフィルURLのみ返す（既定: true）"),
      }),
      annotations: { destructiveHint: false, openWorldHint: true },
    },
    async (args) => {
      const combinedText = [
        args.title,
        args.author,
        args.dept,
        args.quote,
        args.actionPlan,
        args.tools,
        args.summary,
        args.effect,
        args.problem,
        args.idea,
      ]
        .filter(Boolean)
        .join("\n");

      const findings = detectSensitiveContent(combinedText);
      if (findings.length > 0) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `公開リポジトリ保護ガードにより起票を中止しました。検出された機密・ローカル情報: ${findings.join(", ")}`,
            },
          ],
        };
      }

      const draft = buildBoardIssueDraft({
        board: args.board as BoardKind,
        title: args.title,
        author: args.author,
        dept: args.dept,
        category: args.category as FeedbackCategory | undefined,
        priority: args.priority as FeedbackPriority | undefined,
        quote: args.quote,
        actionPlan: args.actionPlan,
        stage: args.stage,
        tools: args.tools,
        summary: args.summary,
        effect: args.effect,
        problem: args.problem,
        idea: args.idea,
        wantsHelp: args.wantsHelp,
        isTest: args.isTest,
      });

      const dryRun = args.dryRun ?? true;
      if (dryRun) {
        const preview = {
          dryRun: true,
          repo: GITHUB_REPO,
          title: draft.title,
          labels: draft.labels,
          body: draft.body,
          prefilledUrl: draft.prefilledUrl,
          note: "dryRun=true のため実際の GitHub Issue 作成は行っていません。実行する場合はユーザー確認後に dryRun=false を指定するか、prefilledUrl をブラウザで開いてください。",
        };
        return {
          content: [{ type: "text", text: jsonText(preview) }],
          structuredContent: preview,
        };
      }

      const created = await adapter.createGitHubIssue({
        title: draft.title,
        body: draft.body,
        labels: draft.labels,
      });

      const payload = {
        dryRun: false,
        ...created,
        title: draft.title,
        labels: draft.labels,
        prefilledUrl: draft.prefilledUrl,
      };
      return {
        content: [{ type: "text", text: jsonText(payload) }],
        structuredContent: payload,
      };
    }
  );

  // 9. Update Board Item Status
  server.registerTool(
    "update_board_item_status",
    {
      title: "ボード Issue ステータス更新 / コメント",
      description:
        "既存 GitHub Issue の着手中ラベル付与/解除、クローズ/再オープン、コメント追加を行います（既定 dryRun=true で変更内容のみプレビュー）。",
      inputSchema: z.object({
        issueNumber: z.number().int().positive().describe("対象 GitHub Issue 番号"),
        action: z
          .enum(["start_progress", "stop_progress", "close", "reopen", "comment"])
          .describe("実施アクション"),
        comment: z.string().optional().describe("追記コメント（任意。action=comment 時は必須）"),
        dryRun: z
          .boolean()
          .optional()
          .describe("true の場合は実行せず予定変更内容のみ返す（既定: true）"),
      }),
      annotations: { destructiveHint: false, openWorldHint: true },
    },
    async ({ issueNumber, action, comment, dryRun }) => {
      if (action === "comment" && !comment?.trim()) {
        return {
          isError: true,
          content: [{ type: "text", text: "action='comment' の場合は comment を指定してください。" }],
        };
      }
      if (comment) {
        const findings = detectSensitiveContent(comment);
        if (findings.length > 0) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `公開リポジトリ保護ガードにより更新を中止しました。検出された機密・ローカル情報: ${findings.join(", ")}`,
              },
            ],
          };
        }
      }

      const plan = {
        issueNumber,
        state:
          action === "close"
            ? ("closed" as const)
            : action === "reopen"
            ? ("open" as const)
            : undefined,
        addLabels: action === "start_progress" ? [IN_PROGRESS_LABEL] : undefined,
        removeLabels: action === "stop_progress" ? [IN_PROGRESS_LABEL] : undefined,
        comment: comment?.trim() || undefined,
      };

      const isDryRun = dryRun ?? true;
      if (isDryRun) {
        const preview = {
          dryRun: true,
          repo: GITHUB_REPO,
          issueUrl: `https://github.com/${GITHUB_REPO}/issues/${issueNumber}`,
          plannedChange: plan,
          note: "dryRun=true のため実際の GitHub 更新は行っていません。実行するにはユーザー確認後に dryRun=false を指定してください。",
        };
        return {
          content: [{ type: "text", text: jsonText(preview) }],
          structuredContent: preview,
        };
      }

      const result = await adapter.updateGitHubIssue(plan);
      return {
        content: [{ type: "text", text: jsonText(result) }],
        structuredContent: { dryRun: false, ...result },
      };
    }
  );

  // 10. Quality Gate Verification
  server.registerTool(
    "run_quality_gate",
    {
      title: "公開品質ゲート (verify-deployment-gate) 実行",
      description:
        "リポジトリの scripts/verify-deployment-gate.mjs を実行し、未確認機能のガード状況と手動 UAT 4大軸の合格状況を検証します。",
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true },
    },
    async () => {
      const result = await adapter.runQualityGate();
      return {
        content: [{ type: "text", text: jsonText(result) }],
        structuredContent: { ...result },
      };
    }
  );

  // 11. App-only helper tool for MCP App iframe UI
  server.registerTool(
    "app_dashboard_action",
    {
      title: "AI Park UI 内部アクション",
      description: "MCP App ダッシュボード UI から呼び出されるアプリ専用操作ツール。",
      inputSchema: z.object({
        action: z.enum([
          "search",
          "list_board",
          "list_tools",
          "get_news",
          "get_usage",
          "get_status",
          "run_gate",
          "preview_issue",
          "create_issue",
        ]),
        query: z.string().optional(),
        board: z.enum(["feedback", "ai-project", "idea"]).optional(),
        title: z.string().optional(),
        author: z.string().optional(),
        dept: z.string().optional(),
        category: feedbackCategoryEnum.optional(),
        priority: z.enum(["高", "中", "低"]).optional(),
        detail: z.string().optional(),
      }),
      _meta: {
        ui: {
          resourceUri: DASHBOARD_RESOURCE_URI,
          visibility: ["app"],
        },
        [RESOURCE_URI_META_KEY]: DASHBOARD_RESOURCE_URI,
      },
    },
    async (args) => {
      switch (args.action) {
        case "search": {
          const data = await service.searchPortal({ query: args.query ?? "", limit: 15 });
          return { content: [{ type: "text", text: jsonText(data) }], structuredContent: data };
        }
        case "list_board": {
          const data = await service.listBoardItems({
            board: args.board ?? "feedback",
            query: args.query,
          });
          return { content: [{ type: "text", text: jsonText(data) }], structuredContent: data };
        }
        case "list_tools": {
          const data = await service.listAiTools({ query: args.query });
          return { content: [{ type: "text", text: jsonText(data) }], structuredContent: data };
        }
        case "get_news": {
          const data = await service.getAiNews({ query: args.query, limit: 15 });
          return { content: [{ type: "text", text: jsonText(data) }], structuredContent: data };
        }
        case "get_usage": {
          const data = await service.getGeminiUsage(true);
          return { content: [{ type: "text", text: jsonText(data) }], structuredContent: data };
        }
        case "get_status": {
          const data = service.getPortalStatus("all");
          return { content: [{ type: "text", text: jsonText(data) }], structuredContent: data };
        }
        case "run_gate": {
          const data = await adapter.runQualityGate();
          return { content: [{ type: "text", text: jsonText(data) }], structuredContent: { ...data } };
        }
        case "preview_issue":
        case "create_issue": {
          const board = args.board ?? "feedback";
          const title = args.title?.trim() ?? "";
          if (title.length < 2) {
            return {
              isError: true,
              content: [{ type: "text", text: "タイトルを 2 文字以上で入力してください。" }],
            };
          }
          const combined = [title, args.author, args.dept, args.detail].filter(Boolean).join("\n");
          const findings = detectSensitiveContent(combined);
          if (findings.length > 0) {
            return {
              isError: true,
              content: [
                {
                  type: "text",
                  text: `機密・ローカル情報が検出されたため中止しました: ${findings.join(", ")}`,
                },
              ],
            };
          }
          const draft = buildBoardIssueDraft({
            board,
            title,
            author: args.author,
            dept: args.dept,
            category: args.category as FeedbackCategory | undefined,
            priority: args.priority as FeedbackPriority | undefined,
            quote: args.detail,
            summary: args.detail,
            problem: args.detail,
            idea: args.detail,
          });
          if (args.action === "preview_issue") {
            const payload = { dryRun: true, ...draft };
            return { content: [{ type: "text", text: jsonText(payload) }], structuredContent: payload };
          }
          const res = await adapter.createGitHubIssue({
            title: draft.title,
            body: draft.body,
            labels: draft.labels,
          });
          const payload = { dryRun: false, ...res, ...draft };
          return { content: [{ type: "text", text: jsonText(payload) }], structuredContent: payload };
        }
      }
    }
  );

  // Resources (5)
  server.registerResource(
    "ai-park-routes",
    "aipark://routes",
    {
      title: "AI Park ルート & ナビゲーション SSOT",
      description: "AI Park の全ページメタデータと公開 URL 一覧",
      mimeType: "application/json",
    },
    async () => {
      const snap = service.getSnapshot();
      const routes = Object.entries(snap.routeMetadata).map(([p, meta]) => ({
        path: p,
        url: buildPublicSiteUrl(p),
        ...meta,
      }));
      return {
        contents: [
          {
            uri: "aipark://routes",
            mimeType: "application/json",
            text: jsonText({ siteBaseUrl: snap.siteBaseUrl, routes }),
          },
        ],
      };
    }
  );

  server.registerResource(
    "ai-park-feature-status",
    "aipark://feature-status",
    {
      title: "AI Park 機能公開ステータス SSOT",
      description: "公開中・工事中・PoC中・準備中の全機能台帳",
      mimeType: "application/json",
    },
    async () => ({
      contents: [
        {
          uri: "aipark://feature-status",
          mimeType: "application/json",
          text: jsonText(service.getPortalStatus("all")),
        },
      ],
    })
  );

  server.registerResource(
    "ai-park-news",
    "aipark://news",
    {
      title: "AI Park 最新AIニュースフィード",
      description: "AI Park の公式ニュース巡回 JSON",
      mimeType: "application/json",
    },
    async () => {
      const news = await service.getAiNews({ limit: 52 });
      return {
        contents: [
          {
            uri: "aipark://news",
            mimeType: "application/json",
            text: jsonText(news),
          },
        ],
      };
    }
  );

  server.registerResource(
    "ai-park-preflight",
    "aipark://preflight",
    {
      title: "AI Park 手動 UAT チェックリストサマリー",
      description: "4大評価軸に基づくリリース前手動検証記録",
      mimeType: "application/json",
    },
    async () => ({
      contents: [
        {
          uri: "aipark://preflight",
          mimeType: "application/json",
          text: jsonText(service.getSnapshot().preflightChecklistSummary),
        },
      ],
    })
  );

  server.registerResource(
    "ai-park-console-ui",
    DASHBOARD_RESOURCE_URI,
    {
      title: "AI Park Interactive Console",
      description: "Antigravity App サイドパネル・フルページ・チャット内表示対応の AI Park UI",
      mimeType: RESOURCE_MIME_TYPE,
      _meta: {
        ui: {
          prefersBorder: false,
        },
      },
    },
    async () => ({
      contents: [
        {
          uri: DASHBOARD_RESOURCE_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: await adapter.readAppHtml(),
          _meta: {
            ui: {
              prefersBorder: false,
            },
          },
        },
      ],
    })
  );

  // Prompts (3)
  server.registerPrompt(
    "triage_feedback",
    {
      title: "ご意見・改善ToDo トリアージ",
      description: "AI Park のご意見ボードのオープン項目を取得し、優先度と対応方針を整理します。",
      argsSchema: {
        focus: z.string().optional().describe("着目したいカテゴリやキーワード"),
      },
    },
    ({ focus }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "AI Park MCP ツールを使ってご意見・改善ToDoボードを整理してください。",
              "1. `list_board_items` で `board: \"feedback\"` の項目を取得する",
              "2. `get_portal_status` で関連機能の現在ステータス（verified / in_development 等）を確認する",
              focus ? `3. 特に「${focus}」に関連する要望を優先して分類・対応案をまとめる` : "3. 優先度（高/中/低）と現状ステータス別に対応案をまとめる",
              "4. Issue ステータスを更新する場合は、まず `dryRun: true` で提案を提示し、承認を得てから実行する。",
            ].join("\n"),
          },
        },
      ],
    })
  );

  server.registerPrompt(
    "draft_idea_declaration",
    {
      title: "アイデア宣言下書き作成",
      description: "業務課題を AI Park の「アイデア宣言ボード」向けテンプレートに整形します。",
      argsSchema: {
        topic: z.string().describe("AI化したい作業やアイデアの概要"),
      },
    },
    ({ topic }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              `次のテーマについて AI Park のアイデア宣言ボード（/idea-board）向けの下書きを作成してください: 「${topic}」`,
              "1. 公開リポジトリのため、顧客名・個人情報・社内アカウントID等を含めないこと。",
              "2. `list_board_items` (`board: \"idea\"`) で既存の類似宣言がないか確認すること。",
              "3. `create_board_item` を `board: \"idea\"`, `dryRun: true` で呼び出し、下書きと起票用 URL を提示すること。",
            ].join("\n"),
          },
        },
      ],
    })
  );

  server.registerPrompt(
    "release_readiness_check",
    {
      title: "AI Park リリース前品質ゲート確認",
      description: "feature-status・UAT 記録・verify-deployment-gate を横断点検します。",
      argsSchema: {
        targetRoute: z.string().optional().describe("確認対象ルート（例: /mcp-hub）"),
      },
    },
    ({ targetRoute }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "AI Park の公開前品質チェックを実施してください。",
              "1. `run_quality_gate` を実行して `verify-deployment-gate.mjs` の合否を確認する",
              "2. `get_portal_status` を呼び出し、未完了機能が誠実ステータスで保護されているか確認する",
              targetRoute
                ? `3. \`search_portal\` で \`${targetRoute}\` を検索し、関連説明とリンク整合を確認する`
                : "3. 未完了項目と次に必要な UAT エビデンスを簡潔に報告する",
            ].join("\n"),
          },
        },
      ],
    })
  );

  return server;
}
