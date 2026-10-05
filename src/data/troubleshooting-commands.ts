/**
 * Windows環境・社内実務トラブルシューティング＆エラー解決確定コマンドマスター
 * 実機検証済みの確定コマンドのみを収録（推測・架空のコマンドは排除）
 */

export interface TroubleshootingCommand {
  id: string;
  category: "powershell" | "gcp" | "git" | "node" | "network";
  categoryLabel: string;
  errorTitle: string;
  errorPattern: string;
  cause: string;
  solutionCommand: string;
  explanation: string;
  safetyNote?: string;
  frequency: "高" | "中" | "低";
}

export const troubleshootingCommands: TroubleshootingCommand[] = [
  {
    id: "TS-01",
    category: "powershell",
    categoryLabel: "PowerShell実行環境",
    errorTitle: "スクリプトの実行が無効になっている（PSSecurityException）",
    errorPattern: "このシステムではスクリプトの実行が無効になっているため、ファイル ... を読み込むことができません。",
    cause: "Windowsの初期設定でPowerShellのスクリプト実行ポリシー（ExecutionPolicy）がRestrictedに設定されているため。",
    solutionCommand: "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser",
    explanation: "管理者権限不要で、現在ログインしている社内ユーザーの範囲（CurrentUser）でのみ安全に自作・ダウンロードスクリプトの実行を許可します。",
    safetyNote: "全社ポリシー（MachinePolicy）は変更せず、個人の実行権限のみを適正化します。",
    frequency: "高",
  },
  {
    id: "TS-02",
    category: "gcp",
    categoryLabel: "Google Cloud / gcloud",
    errorTitle: "社内会社アカウント（ml-mightylink.com）への切替とADC更新",
    errorPattern: "Your current active account does not have permission / 403 Forbidden",
    cause: "個人のGoogleアカウントがgcloudのアクティブアカウントになっており、社内AI基盤プロジェクトへのアクセス権がない状態。",
    solutionCommand: "gcloud auth login --update-adc",
    explanation: "ブラウザが起動し、会社アカウント（@ml-mightylink.com）でログインすることで、CLIおよびApplication Default Credentials（ADC）を一括更新します。",
    frequency: "高",
  },
  {
    id: "TS-03",
    category: "gcp",
    categoryLabel: "Google Cloud / gcloud",
    errorTitle: "GCPプロジェクト未指定・クォータプロジェクト未設定エラー",
    errorPattern: "The project property has not been set in your active configuration",
    cause: "gcloudやSDKがどのプロジェクトに対して課金・API呼び出しを行うべきか認識できていない。",
    solutionCommand: "gcloud config set project antigravity-pj-xxxxxx",
    explanation: "監視・稼働対象の社内プロジェクト「antigravity-pj-xxxxxx」をアクティブプロジェクトに固定します。",
    frequency: "高",
  },
  {
    id: "TS-04",
    category: "powershell",
    categoryLabel: "PowerShell実行環境",
    errorTitle: "ターミナル出力で日本語が文字化けする（Shift-JIS競合）",
    errorPattern: "文字化けした記号列（例:  や ?????）が出力される",
    cause: "Windows PowerShellの標準文字エンコーディングがShift-JIS（CP932）になっている。",
    solutionCommand: "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8",
    explanation: "コンソールおよびパイプラインの標準出力をUTF-8に切り替えます。PowerShell起動時に自動適用したい場合はプロファイルに追記します。",
    frequency: "中",
  },
  {
    id: "TS-05",
    category: "node",
    categoryLabel: "Node.js / メモリ",
    errorTitle: "ビルド時・タスク実行時のメモリ不足エラー（heap out of memory）",
    errorPattern: "FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory",
    cause: "Node.jsのデフォルトヒープサイズ（約2GB）をNext.jsビルドや大規模解析プロセスが超過したため。",
    solutionCommand: '$env:NODE_OPTIONS="--max-old-space-size=4096"',
    explanation: "カレントターミナル環境のNode.js最大ヒープメモリを4GBに拡張してビルドを実行可能にします。",
    safetyNote: "ターミナルを閉じると設定は自動でリセットされます。",
    frequency: "中",
  },
  {
    id: "TS-06",
    category: "network",
    categoryLabel: "ポート・プロセス競合",
    errorTitle: "開発サーバー起動時のポート重複（Port 3000 in use）",
    errorPattern: "Error: listen EADDRINUSE: address already in use :::3000",
    cause: "バックグラウンドで以前の `next dev` やデバッグサーバーが残存している。",
    solutionCommand: "Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force",
    explanation: "ポート3000を専有している孤立プロセスをPowerShellから安全に特定し、強制終了します。",
    safetyNote: "他の開発サーバーを意図して稼働させていないか確認してから実行してください。",
    frequency: "高",
  },
  {
    id: "TS-07",
    category: "git",
    categoryLabel: "Git / 改行コード",
    errorTitle: "Windows改行コード（CRLF）自動変換の差分警告",
    errorPattern: "warning: LF will be replaced by CRLF the next time Git touches it",
    cause: "Gitのautocrlfがtrueになっているため、コミット時に改行が勝手に変換されて差分が生じる。",
    solutionCommand: "git config --global core.autocrlf false",
    explanation: "リポジトリの改行コード（LF）をそのまま保持し、不必要な全行改行差分コミットの発生を防止します。",
    frequency: "中",
  },
  {
    id: "TS-08",
    category: "gcp",
    categoryLabel: "Google Cloud / gcloud",
    errorTitle: "現在のアクティブアカウント・プロジェクト状態の確認",
    errorPattern: "今どのアカウント・プロジェクトに繋がっているかわからない",
    cause: "複数アカウント（社内個人、共有、推進担当）を使い分けている際の設定混乱。",
    solutionCommand: "gcloud config list",
    explanation: "現在gcloud CLIが認識しているアカウント、プロジェクト、コンピュートゾーンを一覧表示します。",
    frequency: "低",
  },
];
