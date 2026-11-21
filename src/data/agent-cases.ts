/**
 * Subagents 活用事例・カスタムエージェント カタログ用データモジュール（/agent-cases）
 *
 * 出どころメモ（AGENTS.md 準拠）:
 * - 実在カスタムエージェント 6 件: 本公開リポジトリ（https://github.com/kanta13jp1/ai-park）内の
 *   `.agents/agents/<name>.md` の実在定義ファイルから直接抜粋。
 * - オーケストレーション 3 方式比較（invoke_subagent / run_workflow / Agent Swarms `/swarm`）および
 *   Swarm ワークスペース分離モード（inherit / share / branch）・役割分担（coordinator / author / verifier / monitor）:
 *   Antigravity 内蔵の `run-workflow/SKILL.md`、`swarm_monitor/SKILL.md`、ツール仕様、および
 *   `src/data/antigravity-info.ts` の公式仕様整理に基づく。
 * - エージェント定義テンプレート 2 種（release-auditor.md / pr-reviewer.md）:
 *   架空の部署名・人名・未測定の数値・社内認定表現を一切含まない汎用スターターテンプレート。
 */

export type WorkspaceAgentCategory =
  | "リリース監査"
  | "セキュリティ・品質"
  | "システム・協調設計";

export interface WorkspaceAgentItem {
  id: string;
  name: string;
  displayName: string;
  category: WorkspaceAgentCategory;
  status: "AI Park 定義済み（参考実例）";
  description: string;
  readOnly: boolean;
  tools: string[];
  highlights: string[];
  invocationPrompt: string;
  sourcePath: string;
  githubUrl: string;
  sourceOrigin: string;
}

export interface OrchestrationModeItem {
  id: string;
  name: string;
  badge: string;
  mechanism: string;
  contextSharing: string;
  workspaceHandling: string;
  bestFor: string;
  caution: string;
}

export interface SwarmWorkspaceModeItem {
  mode: "inherit" | "share" | "branch";
  title: string;
  mechanism: string;
  recommendedRoles: string;
  caution: string;
}

export interface SwarmRolePatternItem {
  role: string;
  defaultWorkspace: "inherit" | "share" | "branch";
  purpose: string;
  boardRule: string;
}

export interface AgentTemplateItem {
  id: string;
  title: string;
  fileName: string;
  readOnly: boolean;
  tools: string[];
  summary: string;
  useCase: string;
  powershellCmd: string;
  markdownContent: string;
}

export const WORKSPACE_AGENTS: WorkspaceAgentItem[] = [
  {
    id: "ai-park-release-audit",
    name: "ai-park-release-audit",
    displayName: "AI Park デプロイ前総合リリース監査エージェント",
    category: "リリース監査",
    status: "AI Park 定義済み（参考実例）",
    description:
      "MightyLINK AI Park デプロイ前総合リリース監査ゲートエージェント。誠実な未完了注記・手動UAT合格ステータス・静的エクスポート整合性・404ハンドラを監査し、リリース合否判定レポートを出力します。",
    readOnly: true,
    tools: ["run_command", "view_file"],
    highlights: [
      "Phase 1: npm run check:gate により未完了ページの注記・バナー有無を検査",
      "Phase 2-3: 手動UAT記録、src/app/not-found.tsx、npx tsc --noEmit を検証",
      "Phase 4: APPROVED / CONDITIONAL / BLOCKED の合否レポートを出力（コード変更不可）",
    ],
    invocationPrompt:
      "ai-park-release-audit を呼び出して、現在の変更に対して公開前リリースゲート監査（読み取り専用）を実行して",
    sourcePath: ".agents/agents/ai-park-release-audit.md",
    githubUrl:
      "https://github.com/kanta13jp1/ai-park/blob/main/.agents/agents/ai-park-release-audit.md",
    sourceOrigin: "AI Park リポジトリ（.agents/agents/）",
  },
  {
    id: "play-release-audit",
    name: "play-release-audit",
    displayName: "Google Play リリース前ポリシー監査エージェント",
    category: "リリース監査",
    status: "AI Park 定義済み（参考実例）",
    description:
      "Google Play Pre-submission Release Gate Auditor。Android ビルド成果物と設定を Google Play デベロッパープログラムポリシー、権限、Intent セキュリティ、R8 縮小ルールの観点で監査します。",
    readOnly: true,
    tools: ["run_command", "view_file"],
    highlights: [
      "Phase 1: AndroidManifest.xml の宣言権限と Target SDK 要件を検証",
      "Phase 2: android:exported 明示と intent-filter の保護状態を点検",
      "Phase 3-4: Proguard / R8 keep ルール確認と APPROVED / CONDITIONAL / BLOCKED 判定",
    ],
    invocationPrompt:
      "play-release-audit を使って、対象 Android プロジェクトの Manifest 権限と R8 設定を読み取り専用で監査して",
    sourcePath: ".agents/agents/play-release-audit.md",
    githubUrl:
      "https://github.com/kanta13jp1/ai-park/blob/main/.agents/agents/play-release-audit.md",
    sourceOrigin: "AI Park リポジトリ（.agents/agents/）",
  },
  {
    id: "firebase-rules",
    name: "firebase-rules",
    displayName: "Firebase セキュリティルール生成・検証エージェント",
    category: "セキュリティ・品質",
    status: "AI Park 定義済み（参考実例）",
    description:
      "Firebase Security Rules Custom Agent。firestore.rules と storage.rules の過剰な許可ルール（allow read, write: if true 等）を検出し、最小権限ルールとエミュレータテストを生成・検証します。",
    readOnly: false,
    tools: ["run_command", "view_file", "write_to_file"],
    highlights: [
      "無条件ワイルドカード（allow read, write: if true 等）の静的検出",
      "データスキーマと request.auth != null / request.auth.uid の整合確認",
      "@firebase/rules-unit-testing 向けテスト生成と最小権限ルールの作成（write_to_file 使用）",
    ],
    invocationPrompt:
      "firebase-rules エージェントで firestore.rules の緩い権限を検出し、最小権限ルール案と Emulator テストを作成して",
    sourcePath: ".agents/agents/firebase-rules.md",
    githubUrl:
      "https://github.com/kanta13jp1/ai-park/blob/main/.agents/agents/firebase-rules.md",
    sourceOrigin: "AI Park リポジトリ（.agents/agents/）",
  },
  {
    id: "flutter-a11y",
    name: "flutter-a11y",
    displayName: "Flutter アクセシビリティ監査・修正エージェント",
    category: "セキュリティ・品質",
    status: "AI Park 定義済み（参考実例）",
    description:
      "Flutter Accessibility Custom Agent。宣言的 Widget ツリーを監査し、48x48 dp の最小タッチ領域要件・semanticLabel 付与・WCAG 2.2 AA コントラスト比の検証と Dart 修正適用を行います。",
    readOnly: false,
    tools: ["run_command", "view_file", "replace_file_content"],
    highlights: [
      "GestureDetector / IconButton / InkWell の 48x48 dp 最小タッチ領域チェック",
      "アイコン・画像の semanticLabel 欠落と WCAG 2.2 AA コントラスト比の確認",
      "Semantics ラップや余白・制約の Dart 修正を適用（replace_file_content 使用）",
    ],
    invocationPrompt:
      "flutter-a11y エージェントを使って、対象 Widget ファイルのアクセシビリティ課題（48x48 dp / semanticLabel）を点検・修正して",
    sourcePath: ".agents/agents/flutter-a11y.md",
    githubUrl:
      "https://github.com/kanta13jp1/ai-park/blob/main/.agents/agents/flutter-a11y.md",
    sourceOrigin: "AI Park リポジトリ（.agents/agents/）",
  },
  {
    id: "iot-display-controller",
    name: "iot-display-controller",
    displayName: "IoT・物理LEDディスプレイ制御支援エージェント",
    category: "システム・協調設計",
    status: "AI Park 定義済み（参考実例）",
    description:
      "物理ディスプレイ（HUB75 RGB LEDパネル・ESP32 WLED-MM・Raspberry Pi）の音声AI連携制御を支援。OpenAI Developers 公式ブログのアーキテクチャ設計に準拠し、多層役割分離・128x64 RGB描画・DDP通信検証を行います。",
    readOnly: true,
    tools: ["run_command", "view_file"],
    highlights: [
      "Full-Duplex 音声・Responses API 推論・ピクセルレンダラの多層役割分離を遵守",
      "DDP（UDP 4048）疎通確認、128x64 アスペクト比維持描画、Idle Screen フォールバック検証",
      "ESP32 フラッシュ書込や GPIO 設定前のピンアサイン・電源定格（5V 4A等）整合チェック",
    ],
    invocationPrompt:
      "iot-display-controller エージェントを使って、WLED-MM DDP通信と 128x64 シーンJSONの設計・疎通確認を手伝って",
    sourcePath: ".agents/agents/iot-display-controller.md",
    githubUrl:
      "https://github.com/kanta13jp1/ai-park/blob/main/.agents/agents/iot-display-controller.md",
    sourceOrigin: "AI Park リポジトリ（.agents/agents/）",
  },
  {
    id: "team-bot-orchestrator",
    name: "team-bot-orchestrator",
    displayName: "チーム共有 AI Bot 統括設計エージェント",
    category: "システム・協調設計",
    status: "AI Park 定義済み（参考実例）",
    description:
      "xAI 公式発表の Team Bots アーキテクチャに準拠し、Context（規程・設計書）・Plugins（MCP/SaaS連携）・Credentials（鍵隔離）・Memory（組織運用記憶）の4層協調と Slack 常駐設計を支援します。",
    readOnly: true,
    tools: ["run_command", "view_file"],
    highlights: [
      "Context（設計書・SKILL.md）と RBAC の参照範囲整合を確認",
      "Plugins 破壊的操作ガードと Credentials の生APIキー隔離（委譲トークン）設計",
      "Memory によるチーム知識の継続蓄積と、1対1ダイレクトスレッドの秘匿保護を両立",
    ],
    invocationPrompt:
      "team-bot-orchestrator エージェントで、共有Botの4層構造（Context / Plugins / Credentials / Memory）と権限境界を点検して",
    sourcePath: ".agents/agents/team-bot-orchestrator.md",
    githubUrl:
      "https://github.com/kanta13jp1/ai-park/blob/main/.agents/agents/team-bot-orchestrator.md",
    sourceOrigin: "AI Park リポジトリ（.agents/agents/）",
  },
];

export const ORCHESTRATION_MODES: OrchestrationModeItem[] = [
  {
    id: "invoke-subagent",
    name: "invoke_subagent（単発委譲）",
    badge: "1対1 委譲",
    mechanism:
      "親エージェントが特定のサブエージェント（または定義済みカスタムエージェント）を単発で起動し、完了通知で結果を受け取る方式。",
    contextSharing:
      "サブエージェントは親会話の全文を持たず、依頼文だけをコンテキストとして受け取るため、調査ログで親のコンテキストが肥大化しない。",
    workspaceHandling:
      "基本は親と同じワークスペースを参照。完了後のやり取りが必要な場合は send_message で追加指示を送れる。",
    bestFor:
      "単一テーマのコード調査、読み取り専用のリリース監査（ai-park-release-audit 等）、スポットでの専門チェック。",
    caution:
      "数十ファイルへの同一レビューの並列展開や、ワーカー同士が自律的に差し戻し合う反復開発には向かない。",
  },
  {
    id: "run-workflow",
    name: "run_workflow（Python 決定的ファンアウト）",
    badge: "コード制御パイプライン",
    mechanism:
      "Python 3.8+ スクリプトで agent / parallel / pipeline / phase / call_tool を記述し、各ノードから JSON schema 準拠の結果（finish）を回収する方式。",
    contextSharing:
      "各エージェントは互いに見えず、スクリプトが前段の出力や trajectory() の必要部分だけをプロンプトに埋め込んで引き渡す。",
    workspaceHandling:
      'agent(..., workspace="inherit" | "share" | "branch") と model（inherit / flash_lite / flash / pro）をノード単位で指定可能。',
    bestFor:
      "対象ファイル一覧の並列レビュー（parallel）、段階的パイプライン（pipeline）、構造化データの決定的集約。",
    caution:
      "実行中にユーザーへの途中質問は不可。parallel 内の 1 エージェントが失敗すると残りの並列処理もキャンセルされる。",
  },
  {
    id: "agent-swarms",
    name: "Agent Swarms（/swarm 共有ボード協調）",
    badge: "共有ボード並列協調",
    mechanism:
      "Coordinator が複数の名前付きワーカーを起動し、共有メッセージボード（read_board / post_message / swarm_wait）上の @メンション で協調させる方式。",
    contextSharing:
      "ボード上のブリーフと投稿は全員が参照可能。起動時に fork を指定すれば特定メンバーの会話履歴を引き継ぐこともできる。",
    workspaceHandling:
      'author には workspace: "share"（作業コピー分離）や "branch"、読み取り専用の verifier・monitor には "inherit" を割り当てて競合を防ぐ。',
    bestFor:
      "独立モジュールの同時実装（複数 author）、実装担当と検査担当の分離（author vs verifier）、停滞監視（monitor）付きの長めタスク。",
    caution:
      "kill は不可逆で share / branch の作業コピーを削除するため、終了前に必ずコミットして coordinator 側へ統合（マージ）する必要がある。",
  },
];

export const SWARM_WORKSPACE_MODES: SwarmWorkspaceModeItem[] = [
  {
    mode: "inherit",
    title: "inherit（共有ワークスペース / デフォルト）",
    mechanism:
      "coordinator と同一の作業ディレクトリをそのまま参照・使用するデフォルト設定。",
    recommendedRoles:
      "verifier（読み取り専用監査）、調査担当ワーカー、monitor（停滞監視）、単独編集の担当",
    caution:
      "複数ワーカーが同じ作業コピー上で同時編集・ビルドするとファイル競合が起きるため、編集者を 1 名に限るか別モードを使う。",
  },
  {
    mode: "share",
    title: "share（作業コピー分離・同一リポジトリ）",
    mechanism:
      "リポジトリ本体（Git オブジェクト）を共有しつつ、ワーカーごとに独立した作業コピー（worktree）を払い出す。",
    recommendedRoles:
      "別ファイルを同時に実装・Lint・ビルドする複数の author ワーカー（ファイル所有権を明確に分担）",
    caution:
      "swarm kill を実行すると作業コピーごと削除される。終了前に必ずコミットし、coordinator の作業コピーへ統合すること。",
  },
  {
    mode: "branch",
    title: "branch（完全独立クローン）",
    mechanism:
      "リポジトリ全体を別ディレクトリへ独立クローンとして複製し、完全に切り離された環境で作業する。",
    recommendedRoles:
      "リポジトリ全体の設定変更を伴う実験や、他ワーカーと Git 状態まで完全に分離したい検証タスク",
    caution:
      "リポジトリ容量に応じた複製コストとディスク消費が発生する。こちらも kill 前に成果物の統合・回収が必要。",
  },
];

export const SWARM_ROLE_PATTERNS: SwarmRolePatternItem[] = [
  {
    role: "coordinator",
    defaultWorkspace: "inherit",
    purpose:
      "タスク分解・ワーカー起動（swarm add）・ファイル所有権の定義・成果物の最終統合を担う司令塔。",
    boardRule:
      "ブリーフに所有ファイル・禁止事項・完了条件を明記する。検証合格後にワーカーのコミットを統合し、最後に kill して片付ける。",
  },
  {
    role: "author",
    defaultWorkspace: "share",
    purpose:
      "割り当てられたファイルのみを実装・編集し、ESLint 等のチェックを通した上でローカルコミットを行う。",
    boardRule:
      "完了時は中間報告で @coordinator を起こさず、次の担当ピア（例: @verifier）だけを @mention して作業パスとコミットハッシュを伝える。",
  },
  {
    role: "verifier",
    defaultWorkspace: "inherit",
    purpose:
      "一切ファイルを編集せず、author のコミット差分・規約準拠・セキュリティ・Lint 結果を第三者視点で監査する。",
    boardRule:
      "不備があれば該当 @author だけをメンションして具体的な修正点を返し、担当全員の合格を確認してから @coordinator へ報告する。",
  },
  {
    role: "monitor",
    defaultWorkspace: "inherit",
    purpose:
      "swarm_monitor スキルと Daemon Cron タイマーを使い、全員待機によるデッドロック（停滞）を検知して復旧を促す。",
    boardRule:
      "自身では実装もレビューも行わない。停滞時のみ次に動ける 1 メンバーを #seq 番号付きで呼び出し、完了投稿を受けたらタイマーを停止する。",
  },
];

export const AGENT_TEMPLATES: AgentTemplateItem[] = [
  {
    id: "release-auditor",
    title: "読み取り専用リリース監査エージェント",
    fileName: "release-auditor.md",
    readOnly: true,
    tools: ["run_command", "view_file"],
    summary:
      "リポジトリのファイルを一切変更せず、作業ツリー状態・型チェック・Lint・機密情報・未完了表記の有無を検証して合否レポートを返すテンプレートです。",
    useCase: "公開前セルフチェック / Swarm の verifier 役",
    powershellCmd: 'New-Item -ItemType Directory -Force -Path ".agents/agents"',
    markdownContent: `---
name: release-auditor
description: 公開・マージ前にプロジェクトのビルド・Lint・機密情報非含有・変更範囲を読み取り専用で監査し、合否レポートを出力するエージェント。
tools:
  - run_command
  - view_file
---

# Release Auditor (Read-Only)

あなたは変更を加えない **読み取り専用のリリース監査エージェント** です。

## 厳守事項
1. **ファイルを編集しない**: コードの修正、\`git commit\`、\`git push\` は実行しないでください。
2. **事実のみを報告する**: 推測で「問題なし」と書かず、実際に実行したコマンドと確認したファイル行だけを根拠にしてください。
3. **不備があれば Fail Closed**: チェックが 1 つでも失敗、または未確認の場合は \`BLOCKED\` または \`CONDITIONAL\` と判定してください。

## 監査手順
1. **変更範囲の確認**: \`git status --short\` と \`git diff --stat\` で意図しないファイル変更や一時ファイルの混入がないか確認する。
2. **静的検査**: プロジェクトの Lint / 型チェック（例: \`npx eslint ...\`, \`npx tsc --noEmit\`）を実行し、終了コード 0 を確認する。
3. **安全性チェック**: APIキー・認証情報・実在の個人情報が差分に含まれていないか確認する。
4. **レポート出力**: 対象コミット・確認コマンド・指摘事項・最終判定（\`APPROVED\` / \`CONDITIONAL\` / \`BLOCKED\`）を簡潔に報告する。`,
  },
  {
    id: "pr-reviewer",
    title: "PR 差分・コード品質レビューエージェント",
    fileName: "pr-reviewer.md",
    readOnly: true,
    tools: ["run_command", "view_file"],
    summary:
      "Pull Request やコミット直前の差分（git diff）を読み取り専用で点検し、エラー処理漏れ・外部リンク属性・型安全性・重複ロジックを指摘するテンプレートです。",
    useCase: "PR 作成前のセカンドオピニオン / Subagent 単発レビュー",
    powershellCmd: 'New-Item -ItemType Directory -Force -Path ".agents/agents"',
    markdownContent: `---
name: pr-reviewer
description: 変更差分（git diff）を読み取り専用で点検し、非同期エラー処理漏れ・外部リンクの安全性・型定義・不要な変更混入をレビューするエージェント。
tools:
  - run_command
  - view_file
---

# PR Code Review Assistant (Read-Only)

あなたは変更差分の品質と安全性を点検する **コードレビュー専用エージェント** です。

## レビュー方針
- 直接ファイルを書き換えず、具体的なファイルパス・行番号・修正方針を提示してください。
- 問題の重要度を **Must Fix（必須修正）** と **Suggestion（改善提案）** に分けて報告してください。

## 点検チェックリスト
1. **スコープの妥当性**: \`git diff --stat\` で依頼範囲外のファイルが変更されていないか。
2. **非同期・外部I/Oの保護**: クリップボード操作（\`navigator.clipboard\`）や \`fetch\` 処理が \`try/catch\` で保護され、失敗時のフォールバック表示があるか。
3. **外部リンク・UI安全性**: 新規タブリンクに \`rel="noopener noreferrer"\` が設定されているか、横長テーブルに \`overflow-x-auto\` があるか。
4. **型安全性・Lint**: \`any\` の乱用や未使用 import がないか、対象ファイルの Lint チェックが通るか。`,
  },
];
