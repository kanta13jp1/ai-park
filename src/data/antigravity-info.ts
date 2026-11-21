// Antigravity情報局のコンテンツデータ
// 出どころ: Google Antigravity 公式ドキュメント（https://antigravity.google/docs）、
// Antigravity 組み込みガイド（antigravity-guide スキル: cli.md / ide.md / app.md）、
// Dynamic Workflows（run-workflow スキル: run_workflow）、
// および Agent Swarms（/swarm・swarm_monitor スキル）公式仕様に基づく。
// ※ 架空の社内制度・数値・事例は記載せず、公式仕様に基づく機能解説と汎用的な実務実行例のみを掲載しています。

export type SurfaceId = "app" | "ide" | "cli" | "sdk";

export interface AntigravitySurface {
  id: SurfaceId;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  highlights: string[];
  recommendedFor: string;
  docUrl: string;
}

export type FeatureCategory =
  | "すべて"
  | "AIモダリティ"
  | "カスタマイズ・連携"
  | "自律実行・テスト"
  | "セキュリティ・権限";

export interface AntigravityFeature {
  id: string;
  category: Exclude<FeatureCategory, "すべて">;
  name: string;
  shortcutOrSyntax?: string;
  summary: string;
  details: string[];
  practicalTip: string;
  docUrl: string;
}

export type ExampleCategory =
  | "すべて"
  | "調査・設計"
  | "実装・リファクタ"
  | "テスト・UI検証"
  | "自動化・標準化";

export interface PracticalExample {
  id: string;
  category: Exclude<ExampleCategory, "すべて">;
  title: string;
  scene: string;
  usedFeatures: string[];
  prompt: string;
  workflowSteps: string[];
  checkPoints: string[];
}

export interface ModalityComparisonRow {
  modality: string;
  trigger: string;
  scope: string;
  bestUseCase: string;
}

export interface SwarmWorkspaceMode {
  mode: "inherit" | "share" | "branch";
  label: string;
  mechanism: string;
  bestFor: string;
  caution: string;
}

export interface SwarmRolePattern {
  role: string;
  workspace: string;
  responsibility: string;
  handoffTip: string;
}

export interface SwarmLifecycleStep {
  step: string;
  title: string;
  detail: string;
}

export const officialDocLinks = [
  { label: "公式ドキュメント Top", href: "https://antigravity.google/docs" },
  { label: "Skills", href: "https://antigravity.google/docs/skills" },
  { label: "Rules & Workflows", href: "https://antigravity.google/docs/rules-workflows" },
  { label: "MCP 連携", href: "https://antigravity.google/docs/mcp" },
  { label: "Browser Automation", href: "https://antigravity.google/docs/ide/browser" },
  { label: "Permissions & Security", href: "https://antigravity.google/docs/permissions" },
  { label: "Terminal Sandbox", href: "https://antigravity.google/docs/sandbox" },
  { label: "Changelog", href: "https://antigravity.google/changelog" },
];

export const antigravitySurfaces: AntigravitySurface[] = [
  {
    id: "app",
    name: "Antigravity 2.0",
    badge: "デスクトップアプリ",
    tagline: "複数エージェントを並列起動・監視する統合プラットフォーム",
    description:
      "IDE に依存せず独立して動作する Electron 製デスクトップアプリ。左サイドバーからプロジェクト切り替え、定期タスク（Scheduled Tasks）、Skills / Rules / MCP の管理を行い、Chat Canvas と補助ペインでエージェントの作業を並列管理できます。",
    highlights: [
      "Left-hand Sidebar：会話・Projects・Scheduled Tasks・Skills & Customizations・Settings を集約",
      "Chat Canvas：「/」スラッシュコマンド、「@」メンション、画像・ファイルのドラッグ＆ドロップに対応",
      "Auxiliary Pane：Subagents・Background Tasks・Artifacts・Files Changed・Terminals を一覧表示",
    ],
    recommendedFor: "複数タスクの並列実行、設計・調査・ドキュメント作成、スケジュール実行",
    docUrl: "https://antigravity.google/docs",
  },
  {
    id: "ide",
    name: "Antigravity IDE",
    badge: "VS Code ベース IDE",
    tagline: "コード編集とエージェント協働をシームレスに統合した AI-first IDE",
    description:
      "VS Code ベースの統合開発環境。Tab 補完（受動的）、インラインコマンド（指示型）、サイドバーチャット＆エージェント（協働型）の 3 つのモダリティをタスクに応じて使い分けられます。",
    highlights: [
      "Inline Code Lenses：関数・クラス上部に「Refactor」「Write Tests」「Explain Code」を表示",
      "Visual Diff Overlays：エディタ上で変更差分（赤/緑）を直接確認して承認・却下",
      "Diagnostic Auto-Fix：コンパイルエラーや Lint 警告から直接エージェントへ修正を依頼",
    ],
    recommendedFor: "日々のコーディング、局所的なリファクタリング、エラー修正とテスト実装",
    docUrl: "https://antigravity.google/docs",
  },
  {
    id: "cli",
    name: "Antigravity CLI (agy)",
    badge: "ターミナル CLI",
    tagline: "ターミナルから即座に呼び出せる軽量エージェントインターフェース",
    description:
      "コマンドライン上で `agy` を起動し、対話形式（TUI）やフラグ指定で素早くエージェントを実行できるインターフェース。`~/.gemini/antigravity-cli/settings.json` で設定を管理します。",
    highlights: [
      "`agy` で起動、`Ctrl+D`×2 または `/exit`・`/quit` で終了",
      "TUI 内で `/help` を実行すると利用可能なスラッシュコマンド一覧を確認可能",
      "`agy --help` で CLI フラグやサブコマンドを確認し、スクリプト連携にも活用可能",
    ],
    recommendedFor: "SSH 先やターミナル中心の作業、軽量なコマンド生成・ログ調査",
    docUrl: "https://antigravity.google/docs/cli/features",
  },
  {
    id: "sdk",
    name: "Antigravity SDK",
    badge: "Python SDK",
    tagline: "エージェントの制御・オーケストレーションをコード化する公開 SDK",
    description:
      "Python からプログラム的にエージェントのリース取得、オーケストレーション API の呼び出し、カスタムツールの公開を行える公開 SDK（google-antigravity/antigravity-sdk-python）です。",
    highlights: [
      "プログラムからのエージェント起動・タスクオーケストレーション",
      "独自業務ロジックをカスタムツールとしてエージェントへ公開",
      "CI/CD や社内ワークフローへの組み込み基盤として利用可能",
    ],
    recommendedFor: "社内ツール連携、自動パイプラインや独自オーケストレーションの構築",
    docUrl: "https://github.com/google-antigravity/antigravity-sdk-python",
  },
];

export const antigravityFeatures: AntigravityFeature[] = [
  {
    id: "tab-autocomplete",
    category: "AIモダリティ",
    name: "Antigravity Tab（Autocomplete / Supercomplete）",
    shortcutOrSyntax: "Tab 承認 / Esc キャンセル / Ctrl+→(⌘+→) 単語単位承認",
    summary:
      "開いているタブやターミナル出力・周囲のコードから次の編集意図を予測し、Tab キー1つで補完する受動的 AI 機能です。",
    details: [
      "Autocomplete：カーソル位置へのコード挿入を提案",
      "Supercomplete：削除や複数行を含む大きめの差分をフローティングウィンドウで提案",
      "Tab to Jump / Tab to Import：次の編集箇所へのカーソル移動や、不足している import 文の自動追加を実行",
    ],
    practicalTip:
      "関数名や型定義を書いた直後に一呼吸置くと、実装全体やテストコードの候補が提示されやすくなります。",
    docUrl: "https://antigravity.google/docs",
  },
  {
    id: "inline-command",
    category: "AIモダリティ",
    name: "Inline Command（インライン指示）",
    shortcutOrSyntax: "Ctrl+I (Windows/Linux) / ⌘+I (macOS)",
    summary:
      "選択したコードブロックのみを対象に、その場でリファクタリング・解説・ドキュメント追記・新規生成を行う指示型モーダルです。",
    details: [
      "コードを選択して起動すると、選択範囲外を壊さずピンポイントで編集",
      "未選択の状態で起動すると、カーソル位置に新規コードを生成",
      "変更後は Visual Diff Overlays で差分を確認してから反映可能",
    ],
    practicalTip:
      "「この関数に JSDoc と null チェックを追加して」など、スコープが明確な小〜中規模の修正に最適です。",
    docUrl: "https://antigravity.google/docs",
  },
  {
    id: "sidebar-agent-planning",
    category: "AIモダリティ",
    name: "Sidebar Chat & Agent / Planning Mode",
    shortcutOrSyntax: "チャット欄から Planning Mode / Agent Mode を利用",
    summary:
      "複数ファイルの読み書き、ターミナル実行、Web 検索、MCP ツール呼び出しを組み合わせて多段階タスクを完遂する協働型エージェントです。",
    details: [
      "Agent Mode：ファイル調査・実装・ビルド/テスト実行まで自律的に進行",
      "Planning Mode：実行前にステップごとの計画を作成し、ユーザーがレビュー・調整してから着工",
      "Diagnostic Auto-Fix：Problems パネルやエディタ上のエラーから直接修正を依頼可能",
    ],
    practicalTip:
      "複数ファイルにまたがる改修では、最初に Planning Mode で方針を擦り合わせると手戻りを防げます。",
    docUrl: "https://antigravity.google/docs",
  },
  {
    id: "at-mentions",
    category: "AIモダリティ",
    name: "@ Mentions（コンテキスト明示）",
    shortcutOrSyntax: "@ファイル名 / @フォルダ / @ターミナル / @ルール / @MCP",
    summary:
      "チャット入力欄で `@` を入力し、参照してほしいファイル・フォルダ・過去の会話・ターミナル出力・ルール・MCP ツールを直接添付します。",
    details: [
      "ファイル・フォルダを指定して読み込み範囲を明確化",
      "過去の会話や実行中ターミナルの出力をそのまま文脈として渡せる",
      "特定の Rules や MCP サーバーを明示的に呼び出すことも可能",
    ],
    practicalTip:
      "エラー調査では、該当ソースファイルとエラーが出ているターミナルの両方を `@` で添付すると原因特定が速くなります。",
    docUrl: "https://antigravity.google/docs",
  },
  {
    id: "skills",
    category: "カスタマイズ・連携",
    name: "Skills（再利用可能な専門手順パッケージ）",
    shortcutOrSyntax: "<project-root>/.agents/skills/<skill-name>/SKILL.md",
    summary:
      "特定業務の手順書（SKILL.md）、補助スクリプト、テンプレートをフォルダ単位でまとめ、必要なタスク時にエージェントへ読み込ませる仕組みです。",
    details: [
      "常時コンテキストを圧迫せず、タスク内容に一致したときだけ詳細手順を読み込む設計",
      "scripts/ や references/・examples/ を同梱でき、再現性の高い作業を実現",
      "ワークスペース配下の `.agents/` に配置するとチームメンバー全員で共有可能",
    ],
    practicalTip:
      "「PR レビュー手順」「リリース前チェック」「定型レポート作成」など、手順が決まっている業務を Skill 化すると品質が安定します。",
    docUrl: "https://antigravity.google/docs/skills",
  },
  {
    id: "rules-and-slash",
    category: "カスタマイズ・連携",
    name: "Rules & Slash Commands（規約と定型ワークフロー）",
    shortcutOrSyntax: ".agents/ 配下のルール定義 / チャット欄で「/」入力",
    summary:
      "プロジェクト全体で守るべき規約を Rules として常時適用し、定型ワークフローや専用エージェントを `/` スラッシュコマンドで即座に呼び出せます。",
    details: [
      "Rules：コーディング規約、使用禁止パターン、出力言語などをプロジェクト単位で自動適用",
      "Slash Commands：`/plan` や `/compact` などの組み込みコマンドやカスタムワークフローを実行",
      "Antigravity IDE / 2.0 ともにワークスペースの `.agents/` 設定を自動認識",
    ],
    practicalTip:
      "毎回プロンプトに書いている「日本語で回答」「型定義を省略しない」などの前提は Rules に逃がすと指示が簡潔になります。",
    docUrl: "https://antigravity.google/docs/rules-workflows",
  },
  {
    id: "mcp-integration",
    category: "カスタマイズ・連携",
    name: "MCP（Model Context Protocol）連携",
    shortcutOrSyntax: "MCP サーバー設定経由で外部ツール・リソースを接続",
    summary:
      "Google Drive、GitHub、Sentry、データベース、Figma などの外部サービスを標準プロトコル（MCP）経由でエージェントのツールとして接続します。",
    details: [
      "チャット上の指示だけで外部ドキュメント検索や Issue 確認、ログ調査を横断実行",
      "読み取り専用・書き込み系など、MCP サーバー単位でツールを整理して利用可能",
      "Plugins と組み合わせることで、Skills + Rules + MCP を 1 ユニットとして管理可能",
    ],
    practicalTip:
      "業務利用では社内規定で許可された MCP サーバーのみ接続し、認証情報や権限範囲を確認したうえで運用してください。",
    docUrl: "https://antigravity.google/docs/mcp",
  },
  {
    id: "plugins-hooks-sidecars",
    category: "カスタマイズ・連携",
    name: "Plugins / Hooks / Sidecars",
    shortcutOrSyntax: "Skills & Customizations から管理",
    summary:
      "複数のカスタマイズ要素を 1 つに束ねる Plugins、イベント駆動で自動処理を行う Hooks、外部 UI やデバイスプレビューを提供する Sidecars を備えます。",
    details: [
      "Plugins：Skills・エージェント・Rules・MCP・Hooks を名前空間付きパッケージとして一括有効化/無効化",
      "Hooks：特定のタイミングに連動して検証や整形処理を自動実行",
      "Sidecars：専用プレビューペインなどの補助画面を並走表示",
    ],
    practicalTip:
      "チーム内で開発環境を揃えるときは、個別の設定ファイルを配る代わりに Plugin 単位で管理すると導入がスムーズです。",
    docUrl: "https://antigravity.google/docs/plugins",
  },
  {
    id: "subagents-scheduled",
    category: "自律実行・テスト",
    name: "Subagents & Scheduled Tasks（並列・定期実行）",
    shortcutOrSyntax: "Auxiliary Pane で進捗監視 / サイドバーからスケジュール管理",
    summary:
      "調査や専門作業を別コンテキストの Subagents に委譲して並列実行したり、cron 式・タイマーでバックグラウンドタスクを自動実行できます。",
    details: [
      "Subagents：親会話のコンテキストを汚さずに広範なコード調査やレビューを並列実行",
      "Scheduled Tasks：cron 式による定期実行と、指定時間後のワンショットタイマーを設定可能",
      "Auxiliary Pane：各サブエージェントやバックグラウンドタスクの状態・成果物（Artifacts）を一覧監視",
    ],
    practicalTip:
      "大きな変更のあとに「セキュリティ」「パフォーマンス」「UI/アクセシビリティ」の観点別チェックを並列で走らせる使い方が有効です。",
    docUrl: "https://antigravity.google/docs",
  },
  {
    id: "agent-swarms",
    category: "自律実行・テスト",
    name: "Agent Swarms（/swarm）— 共有ボード並列マルチエージェント",
    shortcutOrSyntax: '/swarm / workspace: "inherit" | "share" | "branch"',
    summary:
      "役割別の複数エージェントを並列起動し、共有メッセージボード上の @メンション 協調とワークスペース分離を組み合わせて並列開発・反復検証を行う機能です。",
    details: [
      "共有メッセージボード協調：read_board / post_message / swarm_wait を使い、必要な相手だけを @<worker-name> で起床・ハンドオフ",
      'workspace 分離：共有作業コピーの "inherit"、作業コピー分離の "share"、完全独立クローンの "branch" を役割に応じて選択可能',
      "kill 前の必須手順：kill は不可逆で share / branch の作業コピーも削除されるため、終了前にコミット＆coordinator 作業コピーへの統合が必須",
    ],
    practicalTip:
      '同時編集する複数の Author には workspace: "share" を割り当ててファイル所有権を分離し、編集しない Verifier は workspace: "inherit" で差分監査に専念させると競合を防げます。',
    docUrl: "https://antigravity.google/docs",
  },
  {
    id: "run-workflow",
    category: "自律実行・テスト",
    name: "Dynamic Workflows（run_workflow）— Python オーケストレーション",
    shortcutOrSyntax: "run_workflow(Script / ScriptPath) + agent / parallel / pipeline / phase",
    summary:
      "Python 3.8+ スクリプトから `agent`、`parallel`、`pipeline`、`phase` を用いて、多数のファイル・モジュール・レビュー観点への並列ファンアウト実行・段階パイプライン・結果集約を行える公式機能です。",
    details: [
      "`Script`（インライン）または `ScriptPath`（ファイルパス）で Python 3.8+ スクリプトを実行し、`Args` で JSON 入力を `args` 辞書として渡せます",
      "`phase(name)` で工程を区切り、`parallel(items, fn)` で並列ファンアウト、`pipeline(items, fn)` で順次段階処理を実行可能",
      "`agent()` ごとに `schema`（`finish` ツールの JSON Schema 検証）、`model`（`\"inherit\"` / `\"flash_lite\"` / `\"flash\"` / `\"pro\"`）、`workspace`（`\"inherit\"` / `\"share\"` / `\"branch\"`）を指定可能",
      "`call_tool()` によるツール直接呼び出しや、`await trajectory()` による先行ステップ出力の参照、`log()` / `print()` での集約出力に対応",
    ],
    practicalTip:
      "単発の補助委譲は Subagents を使い、リストへのループ処理や段階パイプラインを組む場面で `run_workflow` を選びます。大量ファンアウトでは `ScriptPath` 保存が再実行しやすく、単純チェックには `model: \"flash_lite\"` や `\"flash\"` が適しています。",
    docUrl: "https://antigravity.google/docs",
  },
  {
    id: "browser-automation",
    category: "自律実行・テスト",
    name: "Browser Automation & Testing",
    shortcutOrSyntax: "Browser サブエージェント / ブラウザ許可リスト設定",
    summary:
      "内蔵ウェブビューブラウザをエージェントが操作し、画面遷移・フォーム入力・表示確認・スクリーンショット検証を自動で行います。",
    details: [
      "ローカル開発サーバー（localhost）や検証用ページの表示・クリック・入力動作を実機確認",
      "Browser Allowlist により、ナビゲーション可能なドメインを安全に制限可能",
      "Visual 確認と合わせて、クライアント描画される SPA/SSR 画面の E2E 検証に活用",
    ],
    practicalTip:
      "UI 修正後に「localhost:3000 を開いて主要導線をクリックし、表示崩れやコンソールエラーがないか確認して」と指示すると便利です。",
    docUrl: "https://antigravity.google/docs/ide/browser",
  },
  {
    id: "permissions-sandbox",
    category: "セキュリティ・権限",
    name: "Agent Permissions & Terminal Sandbox",
    shortcutOrSyntax: "Settings（Global / Project-Level）で制御",
    summary:
      "コマンド実行の承認ポリシー、サンドボックス隔離、ワークスペース外ファイルアクセス、通信制限をグローバルおよびプロジェクト単位で厳格に制御します。",
    details: [
      "Tool Execution Policy：`always-proceed` / `request-review` / `strict` / `proceed-in-sandbox` から選択",
      "Terminal Sandbox：制限されたサンドボックス環境内でシェルコマンドを実行し意図しない影響を防止",
      "Project-Level Override：プロジェクトごとにファイルアクセス・通信ポリシー・Allowlist/Denylist を上書き可能",
    ],
    practicalTip:
      "社外リポジトリや検証用プロジェクトを開く際は、Project-Level Settings で厳格な承認ポリシーと Sandbox を有効にしてください。",
    docUrl: "https://antigravity.google/docs/permissions",
  },
];

export const modalityComparison: ModalityComparisonRow[] = [
  {
    modality: "Antigravity Tab",
    trigger: "タイピング中（Tab で承認）",
    scope: "カーソル周辺〜1ブロック",
    bestUseCase: "ボイラープレート記述、import 補完、連続した定型実装",
  },
  {
    modality: "Inline Command",
    trigger: "Ctrl+I / ⌘+I",
    scope: "選択範囲またはカーソル位置",
    bestUseCase: "特定関数のリファクタ、コメント/Docstring 追加、ピンポイント生成",
  },
  {
    modality: "Sidebar Chat & Agent",
    trigger: "チャットパネル（Planning / Agent）",
    scope: "複数ファイル・リポジトリ全体・外部ツール",
    bestUseCase: "新機能実装、原因調査、テスト実行、複数観点レビュー",
  },
  {
    modality: "Antigravity CLI (agy)",
    trigger: "ターミナルで `agy` 実行",
    scope: "カレントディレクトリ・CLI 作業全般",
    bestUseCase: "コマンド操作、ログ解析、スクリプト連携、軽量な対話",
  },
  {
    modality: "Agent Swarms (/swarm)",
    trigger: "/swarm（共有ボード起動）",
    scope: "複数ロール・分離ワークスペース横断",
    bestUseCase: "独立した複数機能の並列実装＋専用 Verifier による反復検品",
  },
  {
    modality: "Dynamic Workflows (run_workflow)",
    trigger: "Python スクリプト実行（Script / ScriptPath）",
    scope: "多数ファイル・モジュールの一括ファンアウト",
    bestUseCase: "ループ処理や段階パイプライン、大量ファイル横断チェックの定型集約",
  },
];

// 出どころ: Google Antigravity Agent Swarms（/swarm）および swarm_monitor スキルの公式仕様に基づく
export const swarmWorkspaceModes: SwarmWorkspaceMode[] = [
  {
    mode: "inherit",
    label: "共有ワークスペース",
    mechanism: "coordinator と同一の作業コピーを共有（デフォルト設定）",
    bestFor: "調査・差分監査・verifier・単一担当での編集作業",
    caution: "複数 author で併用する場合はファイル単位の排他分担が必須",
  },
  {
    mode: "share",
    label: "作業コピー分離・共有リポジトリ",
    mechanism: "リポジトリ実体を共有しつつ独立した作業コピーを作成",
    bestFor: "複数 author による同時ファイル編集・独立ビルド",
    caution: "kill と同時に作業コピーが削除されるため事前のコミット＆統合が必須",
  },
  {
    mode: "branch",
    label: "完全独立クローン",
    mechanism: "リポジトリごと独立したクローンを作成",
    bestFor: "完全に分離した実験・検証",
    caution: "大容量 .git 環境では複製・ディスクコストが大きくなる点に注意",
  },
];

export const swarmRolePatterns: SwarmRolePattern[] = [
  {
    role: "Coordinator",
    workspace: "inherit",
    responsibility: "全体設計・ワーカー起動・ブリーフ作成・成果物統合",
    handoffTip: "役割と所有ファイル・完了条件をブリーフに明記",
  },
  {
    role: "Author",
    workspace: "share",
    responsibility: "担当スコープのコード実装・ドキュメント作成",
    handoffTip: "完了時にコミットハッシュを添えて次担当ピア（@verifier 等）のみをメンション",
  },
  {
    role: "Verifier",
    workspace: "inherit",
    responsibility: "差分監査・仕様準拠確認・テスト結果チェック",
    handoffTip: "自身では編集せず、修正点があれば該当 @author のみをメンション",
  },
  {
    role: "Monitor",
    workspace: "inherit",
    responsibility: "タイマーによる停滞検知と進行フォロー",
    handoffTip: "停滞したメンバーのみを呼び出し、完了投稿でタイマーを停止して鎮静化",
  },
];

export const swarmLifecycleSteps: SwarmLifecycleStep[] = [
  {
    step: "01",
    title: "起動とブリーフ配布",
    detail:
      "/swarm で役割別にワーカーを追加し、所有ファイル・禁止事項・完了条件を共有ボードに公開します。",
  },
  {
    step: "02",
    title: "並列作業と @メンション 協調",
    detail:
      'workspace: "share" で同時編集しつつ、必要な相手だけ @name で起床させてハンドオフします。',
  },
  {
    step: "03",
    title: "成果物のコミット＆統合",
    detail:
      "share / branch 上の変更をコミットし、coordinator の作業コピーへマージまたは cherry-pick で統合・検証します。",
  },
  {
    step: "04",
    title: "鎮静化とクリーンアップ",
    detail:
      "完了報告後に役目を終えたワーカーを kill で終了します。kill により作業コピーは削除され、killed 名は再利用できません。",
  },
];

export const practicalExamples: PracticalExample[] = [
  {
    id: "ex-impact-analysis",
    category: "調査・設計",
    title: "既存コードの仕様把握と変更影響範囲の調査",
    scene: "初めて触る機能やレガシーコードの改修前に、影響箇所を漏れなく洗い出したいとき。",
    usedFeatures: ["Sidebar Chat", "@ Mentions", "Planning Mode"],
    prompt: `@src/app/〇〇/page.tsx と関連する @src/data/ を確認し、以下を整理してください。
1. 現在のデータフローと状態管理の仕組み
2. 〇〇の仕様を変更した場合に影響を受けるコンポーネント・型定義の一覧
3. 既存テストやビルドチェックへの影響
まだコードは編集せず、調査結果と変更計画だけ提示してください。`,
    workflowSteps: [
      "`@` メンションで起点となるファイルやフォルダを明示する",
      "「まだコードは編集せず」と明記し、調査・計画フェーズに集中させる",
      "提示された影響範囲と計画を確認してから実装フェーズへ進む",
    ],
    checkPoints: [
      "エージェントが実際に参照したファイルパス・シンボル名に基づいているか",
      "推測で補われた箇所がないか（不明点があれば追加調査を指示する）",
    ],
  },
  {
    id: "ex-inline-refactor",
    category: "実装・リファクタ",
    title: "選択範囲の安全なリファクタリングと型・Docstring 補強",
    scene: "長くなった関数を整理したり、既存仕様を変えずに型安全性・可読性を上げたいとき。",
    usedFeatures: ["Inline Command (Ctrl+I / ⌘+I)", "Visual Diff Overlays", "Antigravity Tab"],
    prompt: `外部の振る舞いと戻り値の型は変えずに、重複しているバリデーション処理をヘルパー関数へ抽出し、エッジケース（null / 空配列）の早期リターンと簡潔な JSDoc を追加してください。`,
    workflowSteps: [
      "対象の関数またはブロックをエディタ上でドラッグ選択する",
      "`Ctrl+I`（macOS は `⌘+I`）を押して上記プロンプトを入力する",
      "Visual Diff Overlays で赤・緑の差分を確認し、問題なければ承認する",
    ],
    checkPoints: [
      "選択範囲外の既存ロジックやコメントが意図せず消えていないか",
      "既存の型定義や呼び出し元と整合が取れているか",
    ],
  },
  {
    id: "ex-feature-build-verify",
    category: "実装・リファクタ",
    title: "Planning Mode を使った機能実装からビルド・Lint 検証までの一貫実行",
    scene: "複数ファイルにまたがる新機能・画面追加を、手戻りなく最後まで完遂したいとき。",
    usedFeatures: ["Planning Mode", "Agent Mode", "Terminal Sandbox"],
    prompt: `〇〇機能を追加したいです。要件は以下の通りです：
- （要件1）
- （要件2）

まず実装計画を提示してください。承認後に実装を行い、最後に \`npm run lint\` と \`npm run build\` を実行してエラーがないことを確認してください。`,
    workflowSteps: [
      "要件と完了条件（lint / build / test の通過）を最初に明示する",
      "エージェントが作成した計画をレビューし、不要な変更や認識違いを修正する",
      "実装完了後、ターミナル実行結果で全チェックが通ったことを確認する",
    ],
    checkPoints: [
      "完了報告だけでなく、実際に実行されたコマンドとその出力結果を確認する",
      "環境設定や権限ポリシー（Tool Execution Policy）が適切に設定されているか",
    ],
  },
  {
    id: "ex-parallel-review",
    category: "調査・設計",
    title: "Subagents を活用した多角的な並列コードレビュー",
    scene: "大きな変更をマージ・デプロイする前に、複数の専門観点で抜け漏れをチェックしたいとき。",
    usedFeatures: ["Subagents", "Auxiliary Pane", "Sidebar Agent"],
    prompt: `今回の変更差分に対して、以下の 3 つの観点で並列にレビューを実施し、優先度付きで改善点をまとめてください。
1. セキュリティ観点（機密情報・権限・入力検証）
2. 保守性・品質観点（重複ロジック・型安全性・エラーハンドリング）
3. UI/UX 観点（レスポンシブ表示・アクセシビリティ・文言の明確さ）`,
    workflowSteps: [
      "観点を明確に分離して指示することで、サブエージェントの役割分担を促す",
      "Auxiliary Pane（Subagents タブ）で並列実行の進捗を確認する",
      "統合された指摘事項のうち、対応すべきものを選択して修正を依頼する",
    ],
    checkPoints: [
      "指摘された箇所が実際の差分行と一致しているか",
      "過剰なリファクタリング提案（YAGNI 違反）が含まれていないか取捨選択する",
    ],
  },
  {
    id: "ex-browser-uat",
    category: "テスト・UI検証",
    title: "Browser Automation による Web 画面の実機動作確認",
    scene: "フロントエンドの修正後、実際の画面表示・ボタン操作・コンソールエラーを自動検証したいとき。",
    usedFeatures: ["Browser Automation", "Agent Mode", "Browser Allowlist"],
    prompt: `開発サーバーを起動し、ブラウザツールで http://localhost:3000/〇〇 を開いて以下を確認してください。
1. 初期表示でレイアウト崩れやコンソールエラーが出ていないか
2. フィルター切り替え・検索入力・コピーボタンが想定通り動作するか
3. モバイル幅とデスクトップ幅の両方で文字切れや重なりがないか`,
    workflowSteps: [
      "確認したい URL と検証項目（操作手順・表示確認ポイント）を箇条書きで渡す",
      "Browser サブエージェントが起動し、クリック・入力・スクリーンショット取得を自動実行する",
      "報告された結果やスクリーンショットを確認し、不具合があればそのまま修正を依頼する",
    ],
    checkPoints: [
      "テスト対象のドメインが Browser Allowlist で許可されているか",
      "実際の画面操作結果（コンソールエラー有無など）が報告に含まれているか",
    ],
  },
  {
    id: "ex-cli-quick-ops",
    category: "自動化・標準化",
    title: "Antigravity CLI (agy) と Rules/Skills による作業の標準化",
    scene: "ターミナル中心の運用で素早く調査したいときや、チーム共通の作業手順を資産化したいとき。",
    usedFeatures: ["Antigravity CLI (agy)", "Rules", "Skills"],
    prompt: `# ターミナルで agy を起動して依頼する例
$ agy
> 直近のビルドエラーログを確認して、原因となっているファイルと修正案を提示して

# チーム共通手順を Skill として残す依頼例
今回のチェック手順を \`.agents/skills/\` 配下に再利用可能な Skill（SKILL.md）として整理してください。`,
    workflowSteps: [
      "日常の軽量な確認やログ調査はターミナルから `agy` を起動して即座に実行する",
      "うまくいったプロンプトや手順は Rules（常時適用）または Skills（必要時読み込み）として `.agents/` に保存する",
      "リポジトリにコミットすることで、チーム全員が同じ品質でエージェントを活用できる",
    ],
    checkPoints: [
      "`.agents/` 内に API キーや個人情報などの機密データが含まれていないか",
      "Skill の説明（description）が明確で、必要な場面でエージェントが発見しやすいか",
    ],
  },
  {
    id: "ex-diagnostic-tests",
    category: "テスト・UI検証",
    title: "Diagnostic Auto-Fix と Inline Code Lenses によるエラー解消・テスト整備",
    scene: "ビルドエラーや Lint 警告を素早く修正し、変更箇所のユニットテストを漏れなく追加したいとき。",
    usedFeatures: ["Diagnostic Auto-Fix", "Inline Code Lenses", "Visual Diff Overlays"],
    prompt: `対象関数の正常系・境界値（空文字・null・上限値）・異常系を網羅するユニットテストを追加してください。
既存のテストランナー設定に合わせ、実行コマンドで全件パスするところまで確認してください。`,
    workflowSteps: [
      "エディタ上のエラー箇所や Problems パネルから Diagnostic Auto-Fix を起動して型・Lint エラーを解消する",
      "関数上部に表示される Inline Code Lenses（Write Tests / Refactor）またはチャットからテスト追加を依頼する",
      "Visual Diff Overlays で差分を確認・承認し、テスト実行結果で全件通過を確かめる",
    ],
    checkPoints: [
      "エラー回避のためだけに型を any に緩めたり警告を無根拠に抑止していないか",
      "モックに頼りすぎず、実際の入出力仕様を検証できているか",
    ],
  },
  {
    id: "ex-scheduled-mcp-safe",
    category: "自動化・標準化",
    title: "Scheduled Tasks と Project-Level Settings を組み合わせた安全な定期確認",
    scene: "依存チェックや定期レポートの下書き作成など、繰り返すバックグラウンド確認を安全に自動化したいとき。",
    usedFeatures: ["Scheduled Tasks", "Project-Level Settings", "Terminal Sandbox"],
    prompt: `このプロジェクトの Project-Level Settings で Sandbox Mode を有効にしたうえで、
毎週決まったタイミングで以下を確認し、結果を Markdown でまとめる定期タスクを設計してください：
1. 未解決の Lint 警告やビルドエラーの有無
2. ドキュメント内のリンク切れや古い表記の候補
※ ファイルの自動書き換えや外部送信は行わず、レポート出力のみに限定してください。`,
    workflowSteps: [
      "Antigravity 2.0 の Settings から対象プロジェクトの Project-Level Settings（Sandbox Mode / File Access / Internet Access）を確認・上書きする",
      "左サイドバーの Scheduled Tasks から cron 式またはワンショットタイマーで定期タスクを作成する",
      "実行後は Auxiliary Pane（Background Tasks / Artifacts）で出力結果とログを確認する",
    ],
    checkPoints: [
      "定期実行タスクに破壊的なコマンドや意図しない自動コミット/外部送信が含まれていないか",
      "Project-Level Settings の権限範囲（allow / ask / deny）がタスク目的に合っているか",
    ],
  },
  {
    id: "ex-swarm-parallel-feature",
    category: "実装・リファクタ",
    title: 'Agent Swarms（/swarm）と workspace: "share" による並列実装＋検証',
    scene:
      "データ定義・UI コンポーネント・検索導線など互いに独立した複数ファイルを並列で編集し、編集禁止の専用 Verifier に差分監査させてから安全に統合したいとき。",
    usedFeatures: [
      "Agent Swarms (/swarm)",
      'workspace: "share"',
      "共有メッセージボード",
      "Verifier パターン",
    ],
    prompt: `/swarm で以下の編成を起動し、並列実装と差分監査を進めてください。

- Author A（workspace: "share"）: データ定義ファイルのみ所有（他ファイル編集禁止）。完了後にコミットして @verifier のみメンション。
- Author B（workspace: "share"）: UI コンポーネントファイルのみ所有（他ファイル編集禁止）。完了後にコミットして @verifier のみメンション。
- Verifier（workspace: "inherit"・編集禁止）: 各コミットハッシュを git show で監査し、型契約と要件の一致を確認。不備があれば該当 @author のみへ差し戻し、全件合格後に @coordinator へ完了報告。

最後に Coordinator が各コミットを統合・検証したうえでワーカーを kill してください。`,
    workflowSteps: [
      "Coordinator がブリーフで各 Author の所有ファイル・禁止事項・完了条件を共有ボードに明記する",
      '各 Author が workspace: "share" 上で担当ファイルのみ編集・コミットし、コミットハッシュを添えて @verifier のみをメンションする',
      "Verifier が差分・型互換性・規約準拠を監査し、合格後に @coordinator へ最終報告する",
      "Coordinator が成果物をマージまたは cherry-pick で作業コピーへ統合・検証してから、役目を終えたワーカーを kill する",
    ],
    checkPoints: [
      "複数の Author 間で同一ファイルを編集対象にしていないか（ファイル所有権の排他分割）",
      "share / branch のワーカーを kill する前に、必ずコミット＆coordinator 作業コピーへの統合が完了しているか",
      "中間ハンドオフで不要な @coordinator メンションや挨拶投稿を行わず、最小限の起床にとどめているか",
    ],
  },
  {
    id: "ex-swarm-multi-audit",
    category: "調査・設計",
    title: 'Agent Swarms（workspace: "inherit"）による並列調査・横断監査',
    scene:
      "コードを変更せず、仕様調査・セキュリティ確認・型/設計チェックなど複数観点の読み取り専用タスクを分担し、共有ボードで結果を統合したいとき。",
    usedFeatures: [
      "Agent Swarms (/swarm)",
      'workspace: "inherit"',
      "共有メッセージボード",
      "読み取り専用監査",
    ],
    prompt: `/swarm で以下の調査ワーカーをすべて workspace: "inherit"（読み取り専用・ファイル編集禁止）で起動してください。

- Spec Auditor: 公式仕様・設定ファイルと実装の整合性を調査
- Security Auditor: 認証情報・権限チェック・入出力境界の安全性を調査
- Design Auditor: 既存パターンとの一貫性・レスポンシブ・アクセシビリティを調査

各ワーカーはファイルパスと根拠を簡潔にまとめて @coordinator へ報告し、挨拶のみの投稿は行わないでください。`,
    workflowSteps: [
      'ファイルを変更しない調査・監査役割として、各ワーカーをデフォルトの workspace: "inherit" で起動する',
      "各ワーカーが共有ボードの既存投稿（#seq 参照）を踏まえて重複作業を避けつつ調査結果を報告する",
      "Coordinator が全報告を統合して優先度・対応方針を整理し、完了後に各ワーカーを kill する",
    ],
    checkPoints: [
      "読み取り専用タスクに share / branch を使って不要な複製コストを増やしていないか",
      "ボードへの報告に「完了」だけでなく、確認したファイルパス・根拠・結論が含まれているか",
      "inherit でやむを得ず編集を行う場合は、ワーカー間で編集対象ファイルを完全に分離しているか",
    ],
  },
  {
    id: "ex-run-workflow-fanout",
    category: "自動化・標準化",
    title: "run_workflow による多数ファイルの一括ファンアウト調査と集約",
    scene:
      "対象ファイルやモジュールが多数あり、同一観点の横断チェック・レビュー・段階処理を Python スクリプトのループと並列ファンアウトで一括集約したいとき。",
    usedFeatures: ["run_workflow", "parallel", "pipeline"],
    prompt: `run_workflow を使い、指定ディレクトリのファイルを対象に一括ファンアウト調査と集約を実行してください。

1. phase("Discover"): 対象ファイルのパス一覧を JSON 配列（schema: {"type": "array", "items": {"type": "string"}}）で抽出する
2. phase("Review"): parallel(files, ...) で各ファイルごとに agent を並列起動し、観点別の確認結果を構造化出力（schema 指定）で取得する（単純チェックには model: "flash_lite" または "flash" を検討）
3. phase("Aggregate"): 必要に応じて pipeline で段階整理し、log() で全体の集約レポートを出力する

※ 読み取り専用調査ではデフォルトの workspace: "inherit" を使い、並列でファイル変更を行う場合のみ workspace: "share" または "branch" を指定してください。`,
    workflowSteps: [
      "工程を `phase()` で区切り、ファイル保存した `ScriptPath`（またはインライン `Script`）で `run_workflow` を起動する",
      "各 `agent()` に必要な前提コンテキスト・出力 `schema`・`role`・`model`・`workspace` を渡し、`parallel()` / `pipeline()` で処理する",
      "完了通知後にツール結果の `Logs:`（`log()` 出力）と `Output:`（`print()` 出力）、および各エージェントの会話リンクを確認する",
    ],
    checkPoints: [
      "各 `agent()` はスクリプトや他エージェントの履歴を参照しないため、必要な情報と出力 `schema` をプロンプトに明記しているか",
      "`parallel()` 内の 1 件が失敗（`finish` 未呼び出しを含む）すると全体がキャンセルされるため、対象リストと出力形式が過不足なく定義されているか",
      "単発の補助委譲に過剰なワークフローを組んでいないか（単発は Subagents、ロール間協調は `/swarm` を選択）",
    ],
  },
];

export interface ShortcutItem {
  surface: "IDE" | "Chat Canvas" | "CLI (agy)";
  keysOrCommand: string;
  action: string;
  notes: string;
}

export interface ConfigTemplate {
  id: string;
  title: string;
  filePath: string;
  description: string;
  code: string;
}

export interface FaqItem {
  id: string;
  category: "基本・環境" | "操作・カスタマイズ" | "セキュリティ・設定";
  question: string;
  answer: string;
}

export const antigravityShortcuts: ShortcutItem[] = [
  {
    surface: "IDE",
    keysOrCommand: "Tab",
    action: "Tab 補完・ジャンプ・Import を承認",
    notes: "Autocomplete / Supercomplete / Tab to Jump / Tab to Import の候補を確定",
  },
  {
    surface: "IDE",
    keysOrCommand: "Esc",
    action: "Tab 補完候補をキャンセル",
    notes: "表示中の補完提案を取り消す",
  },
  {
    surface: "IDE",
    keysOrCommand: "Ctrl+→ / ⌘+→",
    action: "補完候補を単語単位で承認",
    notes: "提案全体ではなく先頭から単語ごとに受け入れる",
  },
  {
    surface: "IDE",
    keysOrCommand: "Ctrl+I / ⌘+I",
    action: "Inline Command を起動",
    notes: "選択範囲の編集・説明、またはカーソル位置での新規コード生成",
  },
  {
    surface: "Chat Canvas",
    keysOrCommand: "/",
    action: "Slash Commands メニューを開く",
    notes: "組み込みワークフローや専用サブエージェントを即座に呼び出す",
  },
  {
    surface: "Chat Canvas",
    keysOrCommand: "@",
    action: "@ Mentions メニューを開く",
    notes: "ファイル・フォルダ・会話履歴・ターミナル・Rules・MCP ツールを添付",
  },
  {
    surface: "Chat Canvas",
    keysOrCommand: "/swarm",
    action: "Agent Swarms で複数ワーカーを並列起動",
    notes: "役割別ワーカーを追加し共有ボード上で協調作業を開始",
  },
  {
    surface: "Chat Canvas",
    keysOrCommand: "@<worker-name>",
    action: "共有ボード上で特定ワーカーを起床・ハンドオフ",
    notes: "メンションは対象ワーカーを起床させる合図のため必要な担当のみ指定",
  },
  {
    surface: "CLI (agy)",
    keysOrCommand: "agy",
    action: "Antigravity CLI（TUI）を起動",
    notes: "ターミナル上で対話形式のエージェントセッションを開始",
  },
  {
    surface: "CLI (agy)",
    keysOrCommand: "agy --help",
    action: "CLI フラグ・サブコマンド一覧を表示",
    notes: "コマンドラインオプションを確認したいときに実行",
  },
  {
    surface: "CLI (agy)",
    keysOrCommand: "/help",
    action: "TUI 内のスラッシュコマンド一覧を表示",
    notes: "agy 起動後の対話画面内で入力",
  },
  {
    surface: "CLI (agy)",
    keysOrCommand: "Ctrl+D×2 / /exit / /quit",
    action: "Antigravity CLI を終了",
    notes: "対話セッションを終了して通常のシェルへ戻る",
  },
];

export const antigravityConfigTemplates: ConfigTemplate[] = [
  {
    id: "tmpl-skill-md",
    title: "Skill 定義テンプレート（SKILL.md）",
    filePath: "<project-root>/.agents/skills/<skill-name>/SKILL.md",
    description:
      "定型作業やチェック手順をチームで再利用するための Skill 定義ファイル構造です。frontmatter の name と description をもとにエージェントが必要時に自動で読み込みます。",
    code: `---
name: my-team-workflow
description: この Skill をいつ使うべきか（トリガー条件と目的を1〜2文で明確に記述）
---

# ワークフローの目的

## 手順
1. 対象ファイルと変更範囲を確認する
2. プロジェクトの規約に沿ってチェック・修正を実施する
3. ビルド・Lint などの検証コマンドを実行して結果を確認する

## 注意事項
- 機密情報や未確認の事実を記載しない`,
  },
  {
    id: "tmpl-agents-dir",
    title: "ワークスペース設定ディレクトリ構成（.agents/）",
    filePath: "<project-root>/.agents/",
    description:
      "Antigravity IDE / 2.0 はプロジェクトルート配下の .agents/ フォルダを自動検出し、プロジェクト固有の Rules・Skills・Plugins を読み込みます。",
    code: `.agents/
├── rules/           # プロジェクト全体で常時守る規約・禁止事項
├── skills/          # 特定タスク時のみ読み込まれる手順パッケージ
│   └── <skill-name>/
│       ├── SKILL.md       # 必須: メタデータと手順本体
│       ├── scripts/       # 任意: 補助スクリプト
│       ├── references/    # 任意: 参照ドキュメント
│       └── examples/      # 任意: 入出力サンプル
└── workflows/       # 定型ワークフロー定義`,
  },
  {
    id: "tmpl-cli-settings-path",
    title: "Antigravity CLI 設定・権限ポリシーリファレンス",
    filePath: "~/.gemini/antigravity-cli/settings.json",
    description:
      "Antigravity CLI の設定ファイルパス、および Antigravity 2.0 の Global / Project-Level Settings で制御できる主要なセキュリティポリシー項目です。",
    code: `# Antigravity CLI 設定ファイルパス
~/.gemini/antigravity-cli/settings.json

# Antigravity 2.0 主要セキュリティ・実行ポリシー項目（Settings UI で設定）
- Tool Execution Policy : always-proceed | request-review | strict | proceed-in-sandbox
- Terminal Sandbox      : 有効 / 無効（Project-Level で上書き可）
- Non-Workspace File Access : allow | ask | deny
- Internet Access Policy    : allow | ask | deny
- Allowlist / Denylist      : Command Allowlist/Denylist, Browser Allowlist`,
  },
  {
    id: "tmpl-swarm-brief",
    title: "Agent Swarms ワーカーブリーフ＆ワークスペース設計テンプレート",
    filePath: "Chat Canvas: /swarm（共有ボード ブリーフ構成）",
    description:
      "Agent Swarms で各ワーカーに渡すブリーフの基本構成テンプレートです。ワーカーはデフォルトで親会話の履歴を見ないため、所有ファイル・workspace モード・完了条件・ハンドオフ先を明示します。",
    code: `# Author 向けブリーフ構成（例: workspace: "share"）
@<worker-name>
所有ファイル: <担当ファイルパスのみ>（他ファイルは編集禁止）
ワークスペース: workspace: "share"（複数 Author 同時編集時）

## 実装・作業内容
1. <担当スコープの要件・型契約を明記>
2. <厳守ルール・禁止事項を明記>

## 完了条件とハンドオフ
- 作業後に担当ファイルを git add / git commit してコミットハッシュを取得する
- コミットハッシュと変更概要を添えて @verifier のみをメンションする
- 中間工程で @coordinator への CC や挨拶投稿を行わない

# Verifier 向けブリーフ要点（workspace: "inherit"・編集禁止）
- 自身ではファイルを編集・コミットせず、git show <commit-hash> 等で差分を監査する
- 指摘時は該当 @<author> のみをメンションし、全件合格後に @coordinator [done] を投稿する`,
  },
];

export const antigravityFaqs: FaqItem[] = [
  {
    id: "faq-app-vs-ide",
    category: "基本・環境",
    question: "Antigravity 2.0 と Antigravity IDE の違いは何ですか？",
    answer:
      "Antigravity IDE は VS Code ベースの AI-first 統合開発環境で、エディタ内で Tab 補完や Inline Command（Ctrl+I / ⌘+I）、コード差分オーバーレイを使いながら開発する体験に特化しています。一方、Antigravity 2.0 は IDE に依存しない並列デスクトップアプリで、複数プロジェクトの切り替え、Scheduled Tasks（cron/タイマー）、Auxiliary Pane での Subagents・Background Tasks 監視など、エージェント活動の統括に向いています。両者は同じエージェント基盤を共有し共存します。",
  },
  {
    id: "faq-modality-choice",
    category: "操作・カスタマイズ",
    question: "Antigravity Tab・Inline Command・Sidebar Chat はどう使い分ければよいですか？",
    answer:
      "単一行〜数行の連続コーディングや import 補完には「Antigravity Tab」、選択した関数やブロックだけをピンポイントで修正・説明・ドキュメント化したいときは「Inline Command（Ctrl+I / ⌘+I）」、複数ファイルにまたがる調査・設計・実装・コマンド検証を行いたいときは「Sidebar Chat & Agent（必要に応じて Planning Mode）」を使うのが効率的です。",
  },
  {
    id: "faq-settings-priority",
    category: "セキュリティ・設定",
    question: "Global Settings と Project-Level Settings が両方設定されている場合、どちらが優先されますか？",
    answer:
      "アクティブなプロジェクトに対して設定された Project-Level Settings が、Global Settings より優先されます。File Access Policy、Internet Access Policy、Sandbox Mode、Auto-Execution Policy、Permission Grants などはプロジェクト単位で上書きできるため、検証用や社外リポジトリではより厳格なポリシーを設定できます。",
  },
  {
    id: "faq-agents-folder",
    category: "操作・カスタマイズ",
    question: "プロジェクトの .agents/ フォルダに置いた Rules や Skills はどうやって認識されますか？",
    answer:
      "Antigravity IDE および Antigravity 2.0 は、ワークスペースの `<project-root>/.agents/` フォルダを自動的に検出・尊重し、プロジェクト固有の Rules・Skills・Plugins を読み込みます。Rules は常時適用され、Skills は `SKILL.md` の `description` に一致するタスクが発生した際に詳細手順が読み込まれます。",
  },
  {
    id: "faq-cli-usage",
    category: "基本・環境",
    question: "Antigravity CLI（agy）のコマンドや設定はどこで確認できますか？",
    answer:
      "ターミナルで `agy --help` を実行すると CLI フラグとサブコマンドを確認でき、`agy` を起動した対話画面（TUI）内で `/help` を入力すると利用可能なスラッシュコマンドを確認できます。設定ファイルは `~/.gemini/antigravity-cli/settings.json` に配置され、終了するときは `Ctrl+D` を2回押すか `/exit`・`/quit` を入力します。",
  },
  {
    id: "faq-mcp-connection",
    category: "セキュリティ・設定",
    question: "外部ツール（Google Drive や GitHub など）と連携する際の注意点はありますか？",
    answer:
      "外部サービス連携には MCP（Model Context Protocol）を使用します。Chat Canvas の `@` メンションやエージェントのツール呼び出しから利用できますが、業務利用時は接続許可された MCP サーバーのみを使用し、認証情報（API キー・OAuth トークン等）をリポジトリ内に直接記述しないようご注意ください。",
  },
  {
    id: "faq-execution-policy",
    category: "セキュリティ・設定",
    question: "Tool Execution Policy の 4 つのモードはどう使い分けますか？",
    answer:
      "Antigravity 2.0 の Tool Execution Policy では、always-proceed（自動実行）、request-review（実行前にレビュー確認）、strict（厳格な承認）、proceed-in-sandbox（制限されたサンドボックス内で実行）の 4 つから選択できます。通常開発や初めて扱うリポジトリでは request-review や strict、または Terminal Sandbox と組み合わせた proceed-in-sandbox を選ぶと安全です。",
  },
  {
    id: "faq-auxiliary-scheduled",
    category: "基本・環境",
    question: "Auxiliary Pane と Scheduled Tasks はどのような場面で使いますか？",
    answer:
      "Antigravity 2.0 の Auxiliary Pane では、実行中の Subagents、Background Tasks、生成された Artifacts、Files Changed（変更ファイル一覧）、Terminals を一覧で確認できます。また左サイドバーの Scheduled Tasks を使うと、cron 式による定期実行やワンショットタイマーでバックグラウンドタスクを予約・監視できます。",
  },
  {
    id: "faq-swarm-vs-subagent",
    category: "操作・カスタマイズ",
    question: "Subagents と Agent Swarms（/swarm）はどのように使い分ければよいですか？",
    answer:
      'Subagents は親エージェントが単発または並列の調査・レビュー・補助タスクを委譲し、親へ結果を返して完結させる用途に適しています。一方、Agent Swarms（/swarm）は Coordinator・複数の Author・Verifier・Monitor といった役割別ワーカーを起動し、共有メッセージボード（read_board / post_message / swarm_wait）と @メンション を使ってピア同士で直接ハンドオフや差し戻し・再検証を行う多段階の並列開発に向いています。さらに workspace: "share" や "branch" による作業コピー分離も使えるため、複数ファイルを同時に編集・ビルドする場面で強みを発揮します。',
  },
  {
    id: "faq-swarm-workspace-modes",
    category: "セキュリティ・設定",
    question: "Agent Swarms の workspace（inherit / share / branch）の違いと、kill 前の注意点は何ですか？",
    answer:
      "inherit（デフォルト）は Coordinator と同一の作業コピーを共有するため、調査・差分監査・Verifier や単独編集に適しています（複数 Author で併用する場合はファイル単位の排他分担が必須です）。share はリポジトリ実体を共有しつつワーカー専用の独立した作業コピーを作成するため、複数 Author の同時編集や独立ビルドに向いています。branch はリポジトリごと独立したクローンを作成するため完全分離された実験・検証に適しますが、大容量 .git 環境では複製コストが大きくなります。なお、kill を実行するとワーカーは永久終了して killed 名は再利用できなくなり、share / branch の作業コピーも同時に削除されるため、kill 前に必ず変更をコミットし Coordinator の作業コピーへ統合を完了してください。",
  },
  {
    id: "faq-subagent-workflow-swarm",
    category: "操作・カスタマイズ",
    question: "Subagents・run_workflow・Agent Swarms（/swarm）の 3 つはどう使い分ければよいですか？",
    answer:
      "単発の調査や観点別レビューなど、親エージェントが作業を委譲して結果を受け取るだけで完結する場合は「Subagents」を使います。対象リストへのループ処理・多数ファイルへの一括ファンアウト（`parallel`）・段階パイプライン（`pipeline` / `phase`）・JSON Schema による定型集約を Python 3.8+ スクリプトとしてコードで組みたい場合は「Dynamic Workflows（`run_workflow`）」が適しています。そして、Coordinator・複数 Author・Verifier のように異なる役割を持たせ、共有メッセージボード上の `@メンション` で直接ハンドオフや差し戻し・再検品を行いながら `workspace` 分離で並列開発を進めたい場合は「Agent Swarms（`/swarm`）」を選択します。",
  },
];

export interface WorkflowAdvisorScenario {
  id: string;
  label: string;
  taskType: string;
  recommendedSurface: string;
  recommendedMode: string;
  recommendedWorkspace?: "inherit" | "share" | "branch";
  reason: string;
  starterPrompt: string;
}

export const workflowAdvisorScenarios: WorkflowAdvisorScenario[] = [
  {
    id: "quick-edit",
    label: "局所リファクタ・Docstring 追加",
    taskType: "選択範囲のピンポイント編集",
    recommendedSurface: "Antigravity IDE",
    recommendedMode: "Inline Command（Ctrl+I / ⌘+I）",
    reason:
      "エディタで選択した関数やブロックだけを対象に編集でき、選択範囲外を壊さず Visual Diff Overlays で即座に差分を確認・承認できます。",
    starterPrompt: `選択中の関数について、外部の振る舞いと戻り値の型は変えずに重複処理を整理し、エッジケースの早期リターンと簡潔な JSDoc / Docstring を追加してください。選択範囲外のコードや既存コメントは変更しないでください。`,
  },
  {
    id: "single-feature",
    label: "単一機能の設計〜実装〜テスト",
    taskType: "複数ファイルにまたがる単一機能開発",
    recommendedSurface: "Antigravity IDE または Antigravity 2.0",
    recommendedMode: "Planning Mode + Agent Mode",
    reason:
      "最初に Planning Mode で変更対象ファイルと手順の合意を取ってから Agent Mode へ進むことで、複数ファイル間の整合性を保ちながらビルド・テスト検証まで一貫して完了できます。",
    starterPrompt: `以下の要件で新機能を追加したいです：
- （対象画面・データ仕様や要件を記載）

まず Planning Mode で変更対象ファイルと実装計画を提示してください。計画の承認後に Agent Mode で実装を進め、最後に lint・型チェック・ビルドの検証コマンドを実行して結果を確認してください。`,
  },
  {
    id: "parallel-audit",
    label: "複数観点での並列調査・横断監査",
    taskType: "読み取り専用の並列レビュー・仕様確認",
    recommendedSurface: "Antigravity 2.0",
    recommendedMode: "Agent Swarms（/swarm）",
    recommendedWorkspace: "inherit",
    reason:
      "ファイルを編集しない調査・監査タスクはデフォルトの `workspace: \"inherit\"` で作業コピー複製コストを抑えつつ、観点別の専門ワーカーを並列起動して共有ボードへ知見を集約できます。",
    starterPrompt: `/swarm で以下の調査ワーカーをすべて workspace: "inherit"（読み取り専用・ファイル編集禁止）で起動してください。

- Spec Auditor: 公式仕様・設定ファイルと実装の整合性を調査
- Quality Auditor: 型安全性・エラーハンドリング・重複ロジックを調査
- UI Auditor: レスポンシブ表示やアクセシビリティ上の懸念点を調査

各ワーカーは確認したファイルパスと根拠を簡潔にまとめ、挨拶のみの投稿は行わず @coordinator へ報告してください。`,
  },
  {
    id: "parallel-build",
    label: "独立した複数ファイルの同時実装＋検証",
    taskType: "複数 Author 並列実装＋専用 Verifier 監査",
    recommendedSurface: "Antigravity 2.0",
    recommendedMode: "Agent Swarms（/swarm）",
    recommendedWorkspace: "share",
    reason:
      "データ定義と UI コンポーネントなど互いに独立したファイルを複数 Author が同時編集・コミットする場合、`workspace: \"share\"` で作業コピーを分離し、編集禁止の Verifier（`inherit`）が差分監査する構成が衝突を防げます。",
    starterPrompt: `/swarm で以下の編成を起動し、並列実装と差分監査を進めてください。

- Author A（workspace: "share"）: データ定義ファイルのみ所有（他ファイル編集禁止）。完了後にコミットして @verifier のみメンション。
- Author B（workspace: "share"）: UI コンポーネントのみ所有（他ファイル編集禁止）。完了後にコミットして @verifier のみメンション。
- Verifier（workspace: "inherit"・編集禁止）: 各コミットを git show で監査し、型契約と要件の一致を確認。全件合格後に @coordinator へ完了報告。

※ 未追跡のネスト .git や大量の未追跡ファイルがある場合は、安全のため workspace: "inherit" とファイル単位の排他分担へ切り替えてください。`,
  },
  {
    id: "batch-fanout",
    label: "多数ファイル・モジュールの定型一括処理",
    taskType: "コード制御による大量ファンアウト・集約",
    recommendedSurface: "Antigravity 2.0",
    recommendedMode: "Dynamic Workflows（run_workflow）",
    reason:
      "対象リストに対するループ実行や `parallel` / `pipeline` / `phase` による段階オーケストレーションを Python 3.8+ スクリプトで記述でき、`schema` 指定の構造化出力を `log()` で確実に集約できます。",
    starterPrompt: `run_workflow を使い、指定ディレクトリの全ファイルを対象に一括ファンアウト調査と集約を実行してください。

1. phase("Discover"): 対象ファイルのパス一覧を schema（{"type": "array", "items": {"type": "string"}}）で抽出
2. phase("Check"): parallel(files, ...) で各ファイルへ agent を並列実行し、構造化 schema で確認結果を収集（軽量チェックには model: "flash_lite" / "flash" を活用）
3. phase("Summary"): log() で全体の集約レポートを出力`,
  },
  {
    id: "terminal-ops",
    label: "ターミナル中心のログ調査・軽量操作",
    taskType: "CLI・SSH 環境での即応調査",
    recommendedSurface: "Antigravity CLI (agy)",
    recommendedMode: "CLI 対話モード（agy / TUI）",
    reason:
      "ターミナル上で `agy` を起動するだけで、エディタやデスクトップ画面を開かずにビルドログ調査やコマンド生成を軽量・高速に実行できます（`/help`・`agy --help` で操作確認可能）。",
    starterPrompt: `$ agy
> 直近のコマンド実行エラーやビルドログを確認し、原因となっているファイルパス・行番号と最小限の修正案を提示してください。まだファイルは編集せず、確認用コマンドと調査結果のみ回答してください。`,
  },
];
