/**
 * MCP 外部ツール連携ハブ用データモジュール（/mcp-hub）
 *
 * 出どころメモ（AGENTS.md 準拠）:
 * - Model Context Protocol (MCP) 仕様（Host / Client / Server、Tools / Resources / Prompts、Stdio / Streamable HTTP）:
 *   Model Context Protocol 公式仕様（https://modelcontextprotocol.io/）に準拠。
 * - Antigravity カスタマイズ機能 5 種の使い分け・`mcp_config.json` スキーマ・配置パス:
 *   Antigravity 内蔵 `agy-customizations` 仕様（SKILL.md / docs/mcp_servers.md）および
 *   Google Antigravity 公式 MCP ドキュメント（https://antigravity.google/docs/mcp）に準拠。
 * - 汎用設定テンプレート 3 種:
 *   公式 MCP Filesystem サーバー（modelcontextprotocol/servers）、Context7 MCP（upstash/context7）、
 *   GitHub 公式 MCP サーバー（github/github-mcp-server）の公式ドキュメントに基づく汎用テンプレート例。
 *   ※ 社内で正式に利用を認める MCP サーバー一覧・申請フローは準備中であり、架空の承認済みサーバー・認証値・ローカル絶対パスは一切含めていません。
 * - セキュリティ基準（Level 1〜3）との対応:
 *   社内ポータル `/tools-hub`（src/app/tools-hub/page.tsx）および `/guide`（src/app/guide/page.tsx）の定義に準拠。
 */

export interface McpArchitectureLayer {
  id: "host" | "client" | "server";
  name: string;
  roleLabel: string;
  summary: string;
  responsibilities: string[];
  antigravityExample: string;
}

export interface McpPrimitiveItem {
  id: "tools" | "resources" | "prompts";
  name: string;
  controlModel: string;
  summary: string;
  examples: string[];
  safetyNote: string;
}

export interface McpTransportItem {
  id: "stdio" | "streamable-http";
  name: string;
  scopeLabel: string;
  mechanism: string;
  configKeys: string[];
  bestFor: string;
  caution: string;
}

export interface McpCustomizationRow {
  type: string;
  configPath: string;
  loadingTiming: string;
  bestFor: string;
  howItWorks: string;
}

export interface McpConfigLocationItem {
  scope: string;
  path: string;
  description: string;
  caution: string;
}

export interface McpConfigTemplateItem {
  id: string;
  title: string;
  serverKey: string;
  transport: "Stdio (ローカル)" | "Streamable HTTP (リモート)";
  statusBadge: string;
  packageOrEndpoint: string;
  authRequirement: string;
  summary: string;
  recommendedScope: string;
  configJson: string;
  notes: string[];
  docLabel: string;
  docUrl: string;
}

export interface McpSecurityLevelItem {
  level: "Level 1" | "Level 2" | "Level 3";
  title: string;
  badgeTone: "emerald" | "amber" | "rose";
  targetToolsSummary: string;
  mcpGuidance: string;
  allowedScope: string;
}

export interface McpSafetyChecklistItem {
  id: string;
  category: "権限・認証" | "設定・運用" | "データ保護";
  title: string;
  detail: string;
  actionHint: string;
}

export const MCP_ARCHITECTURE_LAYERS: McpArchitectureLayer[] = [
  {
    id: "host",
    name: "Host（ホスト）",
    roleLabel: "ユーザー対話・セキュリティ統括",
    summary:
      "AI モデルを内蔵し、ユーザーからの指示を受け付けるアプリケーション本体です。複数の Client を保持し、承認ポリシーやアクセス制御を統括します。",
    responsibilities: [
      "ユーザーへの権限確認・ツール実行承認 UI の提供",
      "セキュリティポリシー（Sandbox や実行承認設定）の適用",
      "複数の MCP Client のライフサイクル管理",
    ],
    antigravityExample: "Antigravity 2.0 / Antigravity IDE / Antigravity CLI (agy)",
  },
  {
    id: "client",
    name: "Client（クライアント）",
    roleLabel: "1対1 プロトコル通信の仲介",
    summary:
      "Host 内部で動作し、1 つの MCP Server と 1 対 1 のセッション（JSON-RPC 2.0）を結んでメッセージの送受信や機能ネゴシエーションを行います。",
    responsibilities: [
      "Server との接続確立（Initialize）と利用可能機能の一覧取得",
      "Host（AI エージェント）からのツール呼び出し要求のルーティング",
      "Server からの実行結果やエラー応答を Host へ返却",
    ],
    antigravityExample: "Antigravity Language Server 内の各 MCP 接続セッション",
  },
  {
    id: "server",
    name: "Server（サーバー）",
    roleLabel: "外部データ・機能の提供元",
    summary:
      "ファイル、ドキュメント検索、外部 SaaS API などの機能を、標準プロトコルに沿って Tools / Resources / Prompts として公開する軽量プログラムです。",
    responsibilities: [
      "公開可能なツール・リソース・プロンプトのスキーマ宣言",
      "Client からの要求に応じた読み取り・検索・API 実行",
      "許可されたパス・権限スコープ外のリクエスト拒否",
    ],
    antigravityExample: "Filesystem / Context7 / GitHub などの各種 MCP サーバー",
  },
];

export const MCP_PRIMITIVES: McpPrimitiveItem[] = [
  {
    id: "tools",
    name: "Tools（ツール）",
    controlModel: "Model-controlled（AI モデル主導）",
    summary:
      "AI モデルが必要に応じて引数付きで呼び出す実行可能な関数です。検索・データ取得だけでなく、状態変更を伴う処理も含まれます。",
    examples: [
      "ライブラリドキュメントの検索（query-docs）",
      "Issue・Pull Request の一覧取得や詳細参照",
      "許可されたディレクトリ内のファイル検索",
    ],
    safetyNote:
      "書き込みや外部更新を伴う Tool は、読み取り専用設定を優先し、実行前確認（request-review 等）を有効にして利用します。",
  },
  {
    id: "resources",
    name: "Resources（リソース）",
    controlModel: "Application-controlled（アプリ主導）",
    summary:
      "ファイル内容、設定、ログ、ドキュメントなど、コンテキストとしてモデルへ渡すための読み取り専用データです。",
    examples: [
      "特定の設計ドキュメントやテキストファイルの参照",
      "データベースのスキーマ定義の読み取り",
      "システムログや設定スナップショットの添付",
    ],
    safetyNote:
      "機密情報・個人情報・認証ファイル（.env 等）を含むパスをリソース公開範囲に含めないよう注意します。",
  },
  {
    id: "prompts",
    name: "Prompts（プロンプト）",
    controlModel: "User-controlled（ユーザー主導）",
    summary:
      "サーバー側が提供する再利用可能な指示テンプレートです。ユーザーが UI やスラッシュコマンド等から明示的に選択して呼び出します。",
    examples: [
      "特定の障害調査用定型プロンプト",
      "API 仕様レビュー用の定型テンプレート",
    ],
    safetyNote:
      "外部サーバー由来のプロンプト内容もそのまま信用せず、呼び出し時の入力データ範囲を確認してから実行します。",
  },
];

export const MCP_TRANSPORTS: McpTransportItem[] = [
  {
    id: "stdio",
    name: "Stdio（標準入出力）",
    scopeLabel: "ローカル実行向け",
    mechanism:
      "Host / Client がローカル PC 上のコマンドをサブプロセスとして起動し、標準入力（stdin）と標準出力（stdout）経由で JSON-RPC 2.0 メッセージをやり取りします。",
    configKeys: ["command", "args", "env"],
    bestFor:
      "ローカルディレクトリの読み取り専用参照、ローカルツール連携、ネットワークポートを開放せずに完結させたい処理。",
    caution:
      "ローカル PC 上の実行権限で動作するため、公式・信頼できるパッケージのみ指定してください。Windows 環境で npx が起動しない場合は cmd /c 経由での指定が必要になる場合があります。",
  },
  {
    id: "streamable-http",
    name: "Streamable HTTP",
    scopeLabel: "リモート接続向け",
    mechanism:
      "リモートで稼働する HTTP(S) MCP エンドポイント（例: /mcp）へ接続し、リクエスト応答とストリーミング通信を行います。",
    configKeys: ["url（互換キー: serverUrl）", "headers"],
    bestFor:
      "GitHub や Context7 などのクラウドホスト型リモート MCP サーバー、ローカル環境への個別ランタイム導入を避けたい連携。",
    caution:
      "Antigravity では旧仕様の HTTP+SSE（2024-11-05）は非サポートのため、Streamable HTTP エンドポイントを指定します（旧 SSE のみのサーバーには mcp-remote 等の Stdio ブリッジを利用）。通信先のデータ保護方針も確認が必要です。",
  },
];

export const MCP_CUSTOMIZATION_COMPARISON: McpCustomizationRow[] = [
  {
    type: "Rules",
    configPath: "AGENTS.md / GEMINI.md / .agents/rules/*.md",
    loadingTiming: "常時・階層読み込み（always_on / model_decision）",
    bestFor: "コーディング規約、架空記述や機密漏洩の禁止事項、出力形式の統一",
    howItWorks: "プロンプト指示としてエージェントへ注入され、行動指針を定める",
  },
  {
    type: "Skills",
    configPath: ".agents/skills/<name>/SKILL.md",
    loadingTiming: "オンデマンド読み込み（Progressive Disclosure）",
    bestFor: "複数ステップの定型手順書、MCP ツールの使い順や確認観点の標準化",
    howItWorks: "通常時は名前と概要のみ保持し、該当タスク実行時に手順全文を読み込む",
  },
  {
    type: "Hooks",
    configPath: "hooks.json（例: .agents/hooks.json）",
    loadingTiming: "ライフサイクルイベント駆動（PreToolUse / PostToolUse 等）",
    bestFor: "ツール実行前後の自動リント、機密文字列スキャン、決定論的ガード",
    howItWorks: "AI の判断を介さず、指定コマンド・スクリプトをプログラムとして実行",
  },
  {
    type: "MCP Servers",
    configPath: "mcp_config.json",
    loadingTiming: "接続時にツール登録・エージェントが必要時に呼び出し",
    bestFor: "外部サービス API、公式ドキュメント検索、許可フォルダへの標準化されたアクセス",
    howItWorks: "Stdio / Streamable HTTP 経由で外部の Tools・Resources・Prompts を提供",
  },
  {
    type: "Plugins",
    configPath: "plugins/<name>/plugin.json",
    loadingTiming: "プラグイン有効化時に一括ロード",
    bestFor: "関連する Skills・Rules・Hooks・MCP 設定を 1 パッケージにまとめて管理",
    howItWorks: "名前空間付きのバンドル単位でインストールや有効/無効を切り替え",
  },
];

export const MCP_CONFIG_LOCATIONS: McpConfigLocationItem[] = [
  {
    scope: "グローバル設定（PC ローカル共通）",
    path: "~/.gemini/config/mcp_config.json",
    description:
      "自分の PC で開くすべての Antigravity セッションで有効になります。個人検証用の設定やローカル専用の環境変数管理に利用します。",
    caution:
      "API キーや PAT を設定した場合はローカル PC 外へ共有・コピーしないでください。",
  },
  {
    scope: "ワークスペース設定（プロジェクト固有）",
    path: "<project-root>/.agents/mcp_config.json",
    description:
      "特定のリポジトリ・プロジェクト配下に閉じて MCP サーバーを定義したい場合に配置します。",
    caution:
      "Git で管理する設定ファイルには、シークレットやローカル固有の絶対パスを絶対に書き込まないでください。",
  },
  {
    scope: "プラグイン同梱設定（バンドル単位）",
    path: "plugins/<plugin_name>/mcp_config.json",
    description:
      "Plugin を有効化したときだけ MCP サーバーを起動させたい場合に同梱します。ツール名の衝突を防ぐ名前空間管理にも対応します。",
    caution:
      "社内配布向けプラグインは社内ルール確認後にのみ共有してください。",
  },
];

export interface AiParkMcpToolSpec {
  name: string;
  category: "検索・照会" | "ボード起票・更新" | "品質・UI";
  summary: string;
  safetyNote: string;
}

export interface AiParkMcpTransportEntry {
  id: string;
  name: string;
  transport: string;
  location: string;
  availability: string;
  commandOrUrl: string;
}

export const AI_PARK_MCP_TOOLS: AiParkMcpToolSpec[] = [
  {
    name: "open_ai_park_console",
    category: "品質・UI",
    summary:
      "Antigravity App 向けにサイドパネル・左サイドバー・チャット内で動作する対話型コンソール UI（ui://ai-park/dashboard.html）を開きます。",
    safetyNote: "読み取り中心。UI 内からの起票も既定で下書きプレビューを生成します。",
  },
  {
    name: "search_portal",
    category: "検索・照会",
    summary:
      "AI Park の全ページ、AI ニュース、Windows トラブル解決コマンド、Skills、MCP 安全チェックリストを横断検索します。",
    safetyNote: "Read-only（読み取り専用）。",
  },
  {
    name: "get_portal_status",
    category: "検索・照会",
    summary:
      "feature-status.ts と preflight-checklist.ts に基づく公開済み・工事中・PoC 中・UAT 合格状況を返します。",
    safetyNote: "Read-only（読み取り専用）。",
  },
  {
    name: "get_ai_news",
    category: "検索・照会",
    summary:
      "公式フィード自動巡回（ai-news-live.json）の最新 AI ニュースをキーワード・カテゴリ別に取得します。",
    safetyNote: "Read-only（読み取り専用）。",
  },
  {
    name: "get_gemini_usage",
    category: "検索・照会",
    summary:
      "GCP トライアル残高・課金推移・リクエスト集計（gcp-usage-live.json 基準）を取得します。",
    safetyNote: "Read-only（読み取り専用）。",
  },
  {
    name: "list_ai_tools",
    category: "検索・照会",
    summary:
      "社内マスター Google Sheets（PoC 同期中）から AI ツール一覧をライブ取得・絞り込みします。",
    safetyNote: "Read-only（PoC 参考データであることを注記付きで返却）。",
  },
  {
    name: "list_board_items",
    category: "検索・照会",
    summary:
      "ご意見・改善ToDo（feedback）、社内AIプロジェクト（ai-project）、アイデア宣言（idea）の GitHub Issues 一覧を取得します。",
    safetyNote: "Read-only（test ラベルおよび Pull Request を自動除外）。",
  },
  {
    name: "create_board_item",
    category: "ボード起票・更新",
    summary:
      "GitHub Issue テンプレート準拠でご意見・AI プロジェクト・アイデア宣言を作成します。",
    safetyNote:
      "既定 dryRun: true（下書き＋プリフィル URL 返却）。個人情報・社内メールアドレス・API キーを自動ブロック。",
  },
  {
    name: "update_board_item_status",
    category: "ボード起票・更新",
    summary:
      "既存 GitHub Issue への着手中ラベル付与/解除、クローズ/再オープン、コメント追加を行います。",
    safetyNote: "既定 dryRun: true（変更予定のみ返却）。機密文字列検出時は実行拒否。",
  },
  {
    name: "run_quality_gate",
    category: "品質・UI",
    summary:
      "ローカルリポジトリ上で scripts/verify-deployment-gate.mjs を実行し、公開品質ゲート合否を返します。",
    safetyNote: "ローカル環境限定（リポジトリ外・リモート環境では未実行理由を明示）。",
  },
];

export const AI_PARK_MCP_TRANSPORTS: AiParkMcpTransportEntry[] = [
  {
    id: "plugin-stdio",
    name: "Antigravity プラグイン / Stdio（リポジトリ同梱）",
    transport: "Stdio + MCP Apps (ui://)",
    location: ".agents/plugins/ai-park-mcp/",
    availability: "リポジトリを開くだけでローカル利用可（認証不要で検索・参照可能）",
    commandOrUrl: "agy plugin validate --strict .agents/plugins/ai-park-mcp",
  },
  {
    id: "node-http",
    name: "Streamable HTTP（ローカル Node サーバー）",
    transport: "Streamable HTTP (/mcp)",
    location: "mcp/src/http.ts (npm run mcp:http)",
    availability: "ローカルで http://127.0.0.1:8787/mcp として起動可能（任意 Bearer トークン保護対応）",
    commandOrUrl: "npm run mcp:http",
  },
  {
    id: "cf-workers",
    name: "Streamable HTTP（Cloudflare Workers アダプタ）",
    transport: "Web Standard Streamable HTTP",
    location: "mcp/worker/index.ts & wrangler.jsonc",
    availability: "構成コード同梱済み（外部公開デプロイは別途承認・wrangler deploy 後に稼働）",
    commandOrUrl: "mcp/worker/README.md を参照",
  },
  {
    id: "webmcp-browser",
    name: "WebMCP ブラウザブリッジ（実験的）",
    transport: "document.modelContext",
    location: "src/lib/webmcp.ts & WebMcpBridge.tsx",
    availability: "Chrome 149+ Origin Trial 等の対応ブラウザ上で画面遷移・コマンドパレット操作を公開（Antigravity 本体のネイティブ接続とは別機構）",
    commandOrUrl: "4ツール: ai_park_list_routes / ai_park_navigate / ai_park_get_current_page / ai_park_open_command_palette",
  },
];

export const MCP_CONFIG_TEMPLATES: McpConfigTemplateItem[] = [
  {
    id: "ai-park-stdio",
    title: "AI Park 公式 MCP サーバー（本リポジトリ同梱・Stdio / MCP Apps 対応）",
    serverKey: "ai-park",
    transport: "Stdio (ローカル)",
    statusBadge: "リポジトリ同梱（自前実装）",
    packageOrEndpoint: ".agents/plugins/ai-park-mcp/bin/server.mjs",
    authRequirement: "読み取りは認証不要 / GitHub 起票時は gh CLI 認証または AI_PARK_GITHUB_TOKEN",
    summary:
      "このリポジトリに同梱されている AI Park 専用 MCP サーバーです。通常は .agents/plugins/ai-park-mcp プラグインとして認識されますが、グローバルの mcp_config.json へ直接登録する場合にもこのテンプレートを利用できます。",
    recommendedScope: "Antigravity から AI Park の検索・ボード管理・品質ゲート・MCP App コンソールを直接操作",
    configJson: `{
  "mcpServers": {
    "ai-park": {
      "command": "node",
      "args": [
        "<PATH_TO_AI_PARK_REPO>/.agents/plugins/ai-park-mcp/bin/server.mjs"
      ],
      "env": {
        "AI_PARK_REPO_ROOT": "<PATH_TO_AI_PARK_REPO>"
      }
    }
  }
}`,
    notes: [
      "事前ビルドが必要な場合はリポジトリルートで npm run mcp:build を実行してください。",
      "<PATH_TO_AI_PARK_REPO> はローカル環境のクローン先パスに置き換え、個人環境パスを含めたファイルを Git にコミットしないでください。",
      "リポジトリ自体を Antigravity で開いている場合は、.agents/plugins/ai-park-mcp が同梱プラグイン構成として定義されています（agy plugin validate --strict .agents/plugins/ai-park-mcp で検証可能）。",
    ],
    docLabel: "ai-park/mcp (GitHub)",
    docUrl: "https://github.com/kanta13jp1/ai-park",
  },
  {
    id: "filesystem-readonly",
    title: "Read-only Filesystem（ローカル参照限定）",
    serverKey: "filesystem-readonly",
    transport: "Stdio (ローカル)",
    statusBadge: "汎用テンプレート（公式リファレンス準拠）",
    packageOrEndpoint: "@modelcontextprotocol/server-filesystem",
    authRequirement: "認証トークン不要（許可パス＋--read-only フラグで制限）",
    summary:
      "指定したディレクトリ配下のみを「読み取り専用」で参照させる公式 Filesystem MCP サーバーの構成例です。--read-only により書き込み・編集ツール自体を無効化できます。",
    recommendedScope: "公開ドキュメントや学習用ローカルフォルダの安全な参照検証",
    configJson: `{
  "mcpServers": {
    "filesystem-readonly": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "--read-only",
        "<ALLOWED_DIRECTORY_PATH>"
      ]
    }
  }
}`,
    notes: [
      "--read-only を指定すると write_file や edit_file 等の変更系ツールが無効化され、読み取り・検索系ツールのみが公開されます。",
      "<ALLOWED_DIRECTORY_PATH> は作業に最小限必要なフォルダのみを指定し、PC 全体のルート等を指定しないでください。",
      "Windows 環境で npx が直接起動できない場合は、\"command\": \"cmd\"、\"args\": [\"/c\", \"npx\", \"-y\", ...] 形式へのラップを検討してください。",
    ],
    docLabel: "modelcontextprotocol/servers (GitHub)",
    docUrl: "https://github.com/modelcontextprotocol/servers",
  },
  {
    id: "context7-docs",
    title: "Context7（公式ライブラリドキュメント参照）",
    serverKey: "context7",
    transport: "Streamable HTTP (リモート)",
    statusBadge: "汎用テンプレート（公式ドキュメント準拠）",
    packageOrEndpoint: "https://mcp.context7.com/mcp",
    authRequirement: "Bearer API キー（<YOUR_CONTEXT7_API_KEY>）",
    summary:
      "ライブラリやフレームワークのバージョンに即した公式ドキュメント・コード例を取得できる Context7 の Streamable HTTP 接続テンプレートです。",
    recommendedScope: "OSS ライブラリ（Next.js / React / Tailwind 等）の最新仕様調査",
    configJson: `{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_CONTEXT7_API_KEY>"
      }
    }
  }
}`,
    notes: [
      "接続後、ライブラリ ID を解決する resolve-library-id と、公式ドキュメントを取得する query-docs が利用可能になります。",
      "外部サービスへ検索クエリが送信されるため、社内非公開ライブラリ名や機密仕様・認証情報をクエリに含めないでください。",
      "<YOUR_CONTEXT7_API_KEY> を実キーへ置き換えた設定ファイルは、Git リポジトリへコミットしないでください（ローカル Stdio 版 @upstash/context7-mcp を利用する構成も公式に案内されています）。",
    ],
    docLabel: "Context7 (GitHub)",
    docUrl: "https://github.com/upstash/context7",
  },
  {
    id: "github-readonly",
    title: "GitHub MCP（読み取り専用ヘッダ付きリモート連携）",
    serverKey: "github",
    transport: "Streamable HTTP (リモート)",
    statusBadge: "汎用テンプレート（公式ドキュメント準拠）",
    packageOrEndpoint: "https://api.githubcopilot.com/mcp/",
    authRequirement: "GitHub PAT（<YOUR_GITHUB_PAT>）+ 読み取り専用ヘッダ",
    summary:
      "GitHub 公式ホスト型リモート MCP サーバーへ Streamable HTTP で接続し、リポジトリ・Issue・PR の参照を行う構成例です。安全のため X-MCP-Readonly を既定で有効にしています。",
    recommendedScope: "公開リポジトリや事前確認済みの対象リポジトリにおける Issue / PR 調査",
    configJson: `{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <YOUR_GITHUB_PAT>",
        "X-MCP-Readonly": "true"
      }
    }
  }
}`,
    notes: [
      "初期検証時は \"X-MCP-Readonly\": \"true\"（または読み取り専用エンドポイント https://api.githubcopilot.com/mcp/readonly）で書き込み系ツールを無効化することを推奨します。",
      "<YOUR_GITHUB_PAT> には権限を最小化した Fine-grained Personal Access Token（対象リポジトリ限定・必要最小スコープ）を使用し、シークレットをリポジトリへコミットしないでください。",
      "社内リポジトリや非公開情報を外部ホスト型 MCP で扱う場合は、事前に /tools-hub のセキュリティ基準と /contact（AI 推進担当）への相談を済ませてください。",
    ],
    docLabel: "github/github-mcp-server (GitHub)",
    docUrl: "https://github.com/github/github-mcp-server",
  },
];

export const MCP_SECURITY_LEVEL_GUIDANCE: McpSecurityLevelItem[] = [
  {
    level: "Level 1",
    title: "Level 1: 会社契約の AI（社内機密・コード入力可）",
    badgeTone: "emerald",
    targetToolsSummary:
      "会社の Google Cloud プロジェクト経由で利用する Antigravity 等（入力データをモデル学習に使わないことが契約上担保された環境）",
    mcpGuidance:
      "Host 側の AI が Level 1 であっても、接続する MCP サーバー自体のデータ送信先は別途確認が必要です。ローカル完結の読み取り専用 Stdio と、外部クラウドへ通信する Streamable HTTP を区別し、社内未承認の外部 MCP へ機密コード・顧客情報を送らないでください。",
    allowedScope: "承認・契約確認済みの範囲（社内承認リスト策定までは事前相談必須）",
  },
  {
    level: "Level 2",
    title: "Level 2: マスキング必須（対象ツール確認中）",
    badgeTone: "amber",
    targetToolsSummary:
      "会社として利用を認めるツールが決まり次第掲載予定（個人情報・特定顧客識別情報の置き換えが必須な区分）",
    mcpGuidance:
      "MCP 連携ではエージェントが自律的にツール引数やリソース内容を送信するため、人手での事前マスキングを強制しにくい特性があります。個人情報や顧客データを含むデータソースを MCP に直接接続しないでください。",
    allowedScope: "マスキング不要な非機密データのみ（接続前に推進担当へ確認）",
  },
  {
    level: "Level 3",
    title: "Level 3: 一般公開情報のみ（個人アカウント等）",
    badgeTone: "rose",
    targetToolsSummary:
      "個人アカウントの AI ツール（個人アカウントの Antigravity を含む・個人向け規約が適用される環境）",
    mcpGuidance:
      "顧客情報・社内機密・未公開ソースコードを扱うフォルダやリポジトリは一切接続しないでください。一般公開されている OSS ドキュメント調査や個人の公開練習環境での試用のみに限定します。",
    allowedScope: "一般公開情報・個人練習用の公開範囲のみ",
  },
];

export const MCP_SAFETY_CHECKLIST: McpSafetyChecklistItem[] = [
  {
    id: "chk-least-privilege",
    category: "権限・認証",
    title: "最小権限の原則（トークン・対象フォルダの限定）",
    detail:
      "PAT や API キーの権限を必要最小限のスコープ・対象リポジトリのみに限定し、Filesystem 連携でも最小範囲のディレクトリのみを指定している。",
    actionHint: "Classic PAT の全権付与やホームディレクトリ全体の指定は避ける",
  },
  {
    id: "chk-read-only-first",
    category: "設定・運用",
    title: "読み取り専用（Read-Only）の優先",
    detail:
      "調査・参照が目的の場合は --read-only フラグや X-MCP-Readonly: \"true\"（または /readonly エンドポイント）を設定し、更新系ツールを最初から無効化している。",
    actionHint: "書き込み権限は本当に必要な作業時のみ個別に検討する",
  },
  {
    id: "chk-no-secret-commit",
    category: "権限・認証",
    title: "シークレット・トークンの非コミット",
    detail:
      "実トークン・API キーを記述した mcp_config.json を Git にコミットしていない。共有用の設定例は <YOUR_GITHUB_PAT> 等のプレースホルダ表記になっている。",
    actionHint: "認証を含む設定はローカル専用パスに置き、.gitignore と差分を確認する",
  },
  {
    id: "chk-human-in-the-loop",
    category: "設定・運用",
    title: "破壊的操作・外部送信の人間確認",
    detail:
      "Antigravity の Settings で Security Preset: Default（または Tool Execution Policy の request-review / strict）が有効で、Turbo mode 等による無確認自動実行になっていない。",
    actionHint: "設定手順は /guide の STEP 6（安全設定の確認）を参照",
  },
  {
    id: "chk-trusted-source",
    category: "データ保護",
    title: "接続先 MCP サーバーの提供元・信頼性確認",
    detail:
      "公式リポジトリまたは一次ドキュメントで確認できる MCP サーバーのみを対象とし、出所不明なパッケージや未確認のリモート URL を設定していない。",
    actionHint: "プロンプトインジェクション対策として外部テキストの自動実行を許可しない",
  },
  {
    id: "chk-internal-approval",
    category: "データ保護",
    title: "社内データ区分と承認状況の事前確認",
    detail:
      "社内正式承認リスト・申請フローが準備中であることを踏まえ、業務データや非公開リソースを接続する前に /tools-hub の基準確認と /contact への事前相談を行った。",
    actionHint: "迷った場合は接続・実行する前に AI 推進担当へ相談する",
  },
];

export const MCP_OFFICIAL_LINKS = [
  {
    label: "Model Context Protocol 公式サイト",
    href: "https://modelcontextprotocol.io/",
  },
  {
    label: "Antigravity 公式 MCP ドキュメント",
    href: "https://antigravity.google/docs/mcp",
  },
  {
    label: "MCP Reference Servers (GitHub)",
    href: "https://github.com/modelcontextprotocol/servers",
  },
  {
    label: "GitHub Official MCP Server",
    href: "https://github.com/github/github-mcp-server",
  },
  {
    label: "Context7 MCP (GitHub)",
    href: "https://github.com/upstash/context7",
  },
];
