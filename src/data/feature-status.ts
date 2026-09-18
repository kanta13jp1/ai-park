export type FeatureVerificationStatus =
  | "verified"        // 事実確認・本番データ連携完了（公式公開可）
  | "in_development" // 開発中・工事中
  | "poc_sample"      // PoC検証中・サンプルデータ表示中
  | "draft";          // ドラフト・準備中

export interface FeatureStatusItem {
  id: string;
  name: string;
  href: string;
  isVerified: boolean; // 事実確認および本番バックエンド連携が完了しているか
  status: FeatureVerificationStatus;
  evidence: string;    // 確認エビデンス（空文字の場合は未完了）
  currentBadge: string;
  disclaimer: string;  // 工事中・サンプルデータ表示の注意書き
}

export const featureStatusMaster: FeatureStatusItem[] = [
  {
    id: "home",
    name: "ポータルトップ",
    href: "/",
    isVerified: true,
    status: "verified",
    evidence: "サイト基本構成・ナビゲーション・3ステップ導線の実装完了",
    currentBadge: "公開中",
    disclaimer: "",
  },
  {
    id: "how-to",
    name: "使い方・学び 総合ハブ",
    href: "/how-to",
    isVerified: true,
    status: "verified",
    evidence: "4大ナレッジへの案内リンクおよびステップガイド確認完了",
    currentBadge: "公開中",
    disclaimer: "",
  },
  {
    id: "guide",
    name: "Antigravity導入ガイド",
    href: "/guide",
    isVerified: true,
    status: "verified",
    evidence: "IDE/CLIのインストール手順・スラッシュコマンド解説の実機確認完了",
    currentBadge: "公開中",
    disclaimer: "",
  },
  {
    id: "learning",
    name: "生成AI 学習コンテンツ",
    href: "/learning",
    isVerified: true,
    status: "verified",
    evidence: "Udemy講座情報およびGUGA/JDLA等の資格試験情報の確認完了",
    currentBadge: "公開中",
    disclaimer: "",
  },
  {
    id: "feedback-todo",
    name: "ご意見・改善ToDoボード",
    href: "/feedback-todo",
    isVerified: true,
    status: "verified",
    evidence: "Google Chatでいただいた実在のご意見を初期タスクとして登録・起票機能稼働",
    currentBadge: "β版",
    disclaimer: "",
  },
  {
    id: "gemini-stats",
    name: "利用状況ダッシュボード",
    href: "/gemini-stats",
    isVerified: false,
    status: "in_development",
    evidence: "",
    currentBadge: "🚧 工事中",
    disclaimer: "【工事中】現在表示されているMAUや部署別プロンプト推移はサンプル・シミュレーション値です。社内BigQueryとの実データ連携を準備中です。",
  },
  {
    id: "adoption",
    name: "社内AI活用状況 & ROIシミュレータ",
    href: "/adoption",
    isVerified: false,
    status: "poc_sample",
    evidence: "",
    currentBadge: "🧪 PoC中",
    disclaimer: "【PoC検証中】満足度91.8%などのアンケート結果は試算モデル値です。社内全社アンケートの実施・集計基盤を準備中です。",
  },
  {
    id: "interviews",
    name: "現場のAI活用インタビュー",
    href: "/interviews",
    isVerified: false,
    status: "draft",
    evidence: "",
    currentBadge: "📋 準備中",
    disclaimer: "【取材準備中】掲載中の記事は実務ユースケースに基づくモデルケース（ドラフト）です。正式な社内インタビュー取材を受付・準備中です。",
  },
  {
    id: "ambassadors",
    name: "社内AIアンバサダー",
    href: "/ambassadors",
    isVerified: false,
    status: "draft",
    evidence: "",
    currentBadge: "📋 準備中",
    disclaimer: "【公募準備中】掲載中のアンバサダーはモデルプロフィールです。正式な社内アンバサダー公募・選定制度を準備中です。",
  },
  {
    id: "tools",
    name: "AIツール検証マトリックス",
    href: "/tools",
    isVerified: false,
    status: "poc_sample",
    evidence: "",
    currentBadge: "🧪 PoC中",
    disclaimer: "【PoC検証中】ツールマトリクスの適合度・残枠数は検証用サンプルデータです。社内マスターGoogle Sheets APIとの自動同期を準備中です。",
  },
  {
    id: "tools-hub",
    name: "AI Tools Hub & 申請フロー",
    href: "/tools-hub",
    isVerified: false,
    status: "in_development",
    evidence: "",
    currentBadge: "🚧 工事中",
    disclaimer: "【工事中】ライセンス利用申請フォームはUI試作版です。社内ワークフロー基盤（承認・Slack連携）への本番接続を準備中です。",
  },
  {
    id: "agent-cases",
    name: "Subagents活用事例",
    href: "/agent-cases",
    isVerified: false,
    status: "poc_sample",
    evidence: "",
    currentBadge: "🧪 PoC中",
    disclaimer: "【PoC検証中】掲載中の自律エージェント構成図・効果は検証モデルです。社内本番環境での定量測定を順次進めています。",
  },
  {
    id: "skills-hub",
    name: "社内Skillsカタログ",
    href: "/skills-hub",
    isVerified: true,
    status: "verified",
    evidence: "コードベース内実在スキル（accidental-data-loss-prevention等）の定義配布完了",
    currentBadge: "β版",
    disclaimer: "",
  },
  {
    id: "idea-board",
    name: "アイデア宣言ボード",
    href: "/idea-board",
    isVerified: true,
    status: "verified",
    evidence: "LocalStorageによるアイデア起票・共創リアクション機能の稼働確認完了",
    currentBadge: "β版",
    disclaimer: "",
  },
  {
    id: "roadmap",
    name: "開発ロードマップ",
    href: "/roadmap",
    isVerified: false,
    status: "in_development",
    evidence: "",
    currentBadge: "進行中",
    disclaimer: "【進行中】各機能のUIプロトタイプは実装完了していますが、社内本番データ連携や実運用の確認を順次進めています。",
  },
];
