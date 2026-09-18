"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sliders,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Layers,
  X,
  Compass,
  BarChart3,
  Bot,
  Zap,
} from "lucide-react";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";

interface MatrixTool {
  id: number;
  initial: string;
  initialBg: string;
  name: string;
  form: string;
  manualUrl?: string;
  applyRequired?: boolean;
  status: "全社員利用可能" | "利用可能" | "社内セキュア網" | "検証中" | "リストアップ";
  statusNote?: string;
  licenseCount?: string;
  dev: { score: 1 | 2 | 3; note: string };
  doc: { score: 1 | 2 | 3; note: string };
  research: { score: 1 | 2 | 3; note: string };
  auto: { score: 1 | 2 | 3; note: string };
  coverage: string;
  coverageRatio: number; // 0 to 1
  description: string;
  securityLevel: string;
  impactScore: number; // 1-10 for quadrant
  easeScore: number;   // 1-10 for quadrant
}

const matrixTools: MatrixTool[] = [
  {
    id: 1,
    initial: "D",
    initialBg: "bg-blue-600 text-white",
    name: "Dify",
    form: "アプリ基盤",
    manualUrl: "/learning",
    status: "全社員利用可能",
    dev: { score: 2, note: "API連携" },
    doc: { score: 2, note: "プロンプト" },
    research: { score: 2, note: "RAG" },
    auto: { score: 3, note: "ワークフロー" },
    coverage: "4/4",
    coverageRatio: 1.0,
    description: "全社標準のLLMアプリケーション開発基盤。ドラッグ＆ドロップでRAG検索や自律ワークフローを構築可能。",
    securityLevel: "Level 1: 社内機密・文書投入可",
    impactScore: 9,
    easeScore: 8,
  },
  {
    id: 2,
    initial: "G",
    initialBg: "bg-emerald-600 text-white",
    name: "Gemini for Workspace",
    form: "サイドパネル / Gems",
    status: "全社員利用可能",
    dev: { score: 1, note: "補助" },
    doc: { score: 3, note: "作成・要約" },
    research: { score: 3, note: "DeepResearch" },
    auto: { score: 2, note: "Gems" },
    coverage: "4/4",
    coverageRatio: 1.0,
    description: "Google Docs/Gmail/Sheetsに直接統合された対話型AI。全社員の日常業務での文章作成とメール要約に即時利用可能。",
    securityLevel: "Level 1: 社内機密・文書投入可",
    impactScore: 8,
    easeScore: 10,
  },
  {
    id: 3,
    initial: "N",
    initialBg: "bg-teal-600 text-white",
    name: "NotebookLM",
    form: "リサーチノート",
    status: "全社員利用可能",
    dev: { score: 1, note: "仕様参照" },
    doc: { score: 3, note: "要約・ノート" },
    research: { score: 3, note: "DeepResearch" },
    auto: { score: 1, note: "音声解説" },
    coverage: "3/4",
    coverageRatio: 0.75,
    description: "アップロードした社内PDF・仕様書・議事録に基づき、ハルシネーションなく正確に質疑応答・要約・音声解説を生成。",
    securityLevel: "Level 1: 社内機密・文書投入可",
    impactScore: 8,
    easeScore: 9,
  },
  {
    id: 4,
    initial: "G",
    initialBg: "bg-amber-600 text-white",
    name: "Google Workspace Studio",
    form: "ノーコード自動化 / AIエージェント",
    manualUrl: "/learning",
    status: "全社員利用可能",
    dev: { score: 2, note: "AppSheet連携" },
    doc: { score: 2, note: "ドラフト生成" },
    research: { score: 1, note: "Drive検索" },
    auto: { score: 3, note: "Flow/Agent" },
    coverage: "4/4",
    coverageRatio: 1.0,
    description: "フォーム入力トリガーによる自動メール送信、承認フロー、Driveファイル自動仕分けなどのノーコード自動化。",
    securityLevel: "Level 1: 社内機密・文書投入可",
    impactScore: 7,
    easeScore: 8,
  },
  {
    id: 5,
    initial: "J",
    initialBg: "bg-fuchsia-600 text-white",
    name: "Jitora",
    form: "Webプラットフォーム / VS Code拡張",
    manualUrl: "/learning",
    status: "利用可能",
    licenseCount: "残22/30",
    dev: { score: 3, note: "生成" },
    doc: { score: 2, note: "ドキュメント" },
    research: { score: 1, note: "コード検索" },
    auto: { score: 3, note: "業務システム" },
    coverage: "3/4",
    coverageRatio: 0.75,
    description: "業務要件からReact/Next.js/Node.js等のフルスタックコードと画面設計書を自動生成する開発プラットフォーム。",
    securityLevel: "Level 2: マスキング必須",
    impactScore: 8,
    easeScore: 6,
  },
  {
    id: 6,
    initial: "C",
    initialBg: "bg-indigo-600 text-white",
    name: "Claude Code",
    form: "Code / Cowork / API",
    applyRequired: true,
    status: "社内セキュア網",
    dev: { score: 3, note: "Code" },
    doc: { score: 3, note: "Cowork" },
    research: { score: 2, note: "Cowork" },
    auto: { score: 2, note: "API" },
    coverage: "4/4",
    coverageRatio: 1.0,
    description: "ターミナル上で自律的にバグ修正・リファクタリング・テスト実行を完結するAnthropic社最新のコーディングエージェント。",
    securityLevel: "Level 1: 社内セキュア網内限定",
    impactScore: 9,
    easeScore: 5,
  },
  {
    id: 7,
    initial: "A",
    initialBg: "bg-sky-600 text-white",
    name: "Google Antigravity",
    form: "次世代IDE / CLI (agy)",
    manualUrl: "/guide",
    status: "全社員利用可能",
    dev: { score: 3, note: "自律Agent" },
    doc: { score: 2, note: "設計書" },
    research: { score: 3, note: "コード探索" },
    auto: { score: 3, note: "Subagents" },
    coverage: "4/4",
    coverageRatio: 1.0,
    description: "自律並列サブエージェント、Skills/Rules自動適用、MCP連携を標準装備した全社推奨の開発・エージェント基盤。",
    securityLevel: "Level 1: 社内機密・コード投入可",
    impactScore: 10,
    easeScore: 7,
  },
  {
    id: 8,
    initial: "G",
    initialBg: "bg-slate-800 text-white",
    name: "GitHub Copilot Enterprise",
    form: "IDE拡張 / PRレビュー",
    applyRequired: true,
    status: "利用可能",
    licenseCount: "残15/50",
    dev: { score: 3, note: "補完・PR" },
    doc: { score: 2, note: "Markdown" },
    research: { score: 2, note: "Chat" },
    auto: { score: 2, note: "Actions" },
    coverage: "4/4",
    coverageRatio: 1.0,
    description: "VS Code / IntelliJ 内でのリアルタイムコード補完、GitHub pull request 自動要約・コードレビュー。",
    securityLevel: "Level 1: 社内機密・コード投入可",
    impactScore: 8,
    easeScore: 9,
  },
  {
    id: 9,
    initial: "C",
    initialBg: "bg-violet-700 text-white",
    name: "Cursor",
    form: "AI統合エディタ",
    applyRequired: true,
    status: "利用可能",
    licenseCount: "残8/20",
    dev: { score: 3, note: "Composer" },
    doc: { score: 2, note: "設計メモ" },
    research: { score: 3, note: "Codebase" },
    auto: { score: 2, note: "Terminal" },
    coverage: "4/4",
    coverageRatio: 1.0,
    description: "リポジトリ全体をインデックス化し、複数ファイルにまたがるコード編集をComposerで一括適用できる開発エディタ。",
    securityLevel: "Level 2: マスキング推奨",
    impactScore: 9,
    easeScore: 7,
  },
  {
    id: 10,
    initial: "C",
    initialBg: "bg-emerald-700 text-white",
    name: "ChatGPT Enterprise",
    form: "Web対話 / Code Interpreter",
    applyRequired: true,
    status: "利用可能",
    licenseCount: "残35/100",
    dev: { score: 2, note: "Python実行" },
    doc: { score: 3, note: "高度推論" },
    research: { score: 3, note: "DeepSearch" },
    auto: { score: 2, note: "CustomGPTs" },
    coverage: "4/4",
    coverageRatio: 1.0,
    description: "OpenAI GPT-4o / o1 を搭載したエンタープライズ対話基盤。データ分析、高度推論、カスタムGPTs作成に対応。",
    securityLevel: "Level 2: マスキング推奨",
    impactScore: 8,
    easeScore: 9,
  },
  {
    id: 11,
    initial: "P",
    initialBg: "bg-cyan-700 text-white",
    name: "Perplexity Enterprise",
    form: "AI検索エンジン",
    status: "利用可能",
    licenseCount: "全社枠あり",
    dev: { score: 1, note: "エラー調査" },
    doc: { score: 2, note: "市場レポート" },
    research: { score: 3, note: "リアルタイム" },
    auto: { score: 1, note: "Collections" },
    coverage: "3/4",
    coverageRatio: 0.75,
    description: "出典引用付きの最新Web検索に特化したAIリサーチツール。技術動向調査や特許・競合分析に強み。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 7,
    easeScore: 10,
  },
  {
    id: 12,
    initial: "V",
    initialBg: "bg-black text-white",
    name: "v0 by Vercel",
    form: "UIコンポーネント生成",
    status: "検証中",
    dev: { score: 3, note: "React/Tailwind" },
    doc: { score: 1, note: "デザイン定義" },
    research: { score: 1, note: "UIギャラリー" },
    auto: { score: 2, note: "プロトタイプ" },
    coverage: "2/4",
    coverageRatio: 0.5,
    description: "テキスト指示から即座にNext.js / Tailwind CSS / shadcn/ui準拠のUIプロトタイプを生成するフロントエンド支援ツール。",
    securityLevel: "Level 2: マスキング必須",
    impactScore: 8,
    easeScore: 8,
  },
  {
    id: 13,
    initial: "B",
    initialBg: "bg-orange-600 text-white",
    name: "Bolt.new",
    form: "フルスタックWeb自動構築",
    status: "検証中",
    dev: { score: 3, note: "Node/WebContainer" },
    doc: { score: 1, note: "README" },
    research: { score: 1, note: "パッケージ調査" },
    auto: { score: 2, note: "ワンクリック公開" },
    coverage: "2/4",
    coverageRatio: 0.5,
    description: "ブラウザ内のWebContainer上でフロントエンド・バックエンド・DBを同時構築し即時実行・デプロイできるツール。",
    securityLevel: "Level 2: マスキング必須",
    impactScore: 8,
    easeScore: 7,
  },
  {
    id: 14,
    initial: "G",
    initialBg: "bg-blue-700 text-white",
    name: "Glean",
    form: "社内横断エンタープライズ検索",
    status: "検証中",
    dev: { score: 2, note: "GitLab/GitHub" },
    doc: { score: 2, note: "社内Wiki検索" },
    research: { score: 3, note: "全社横断" },
    auto: { score: 2, note: "Action" },
    coverage: "4/4",
    coverageRatio: 1.0,
    description: "Google Drive, Slack, GitHub, Jira など社内全ツールを横断してセキュアにナレッジを検索・回答するAI検索基盤。",
    securityLevel: "Level 1: 社内機密・文書投入可",
    impactScore: 9,
    easeScore: 8,
  },
  {
    id: 15,
    initial: "M",
    initialBg: "bg-purple-800 text-white",
    name: "Midjourney / Imagen 3",
    form: "画像生成 / クリエイティブ",
    status: "検証中",
    dev: { score: 1, note: "UIアセット" },
    doc: { score: 3, note: "プレゼン素材" },
    research: { score: 1, note: "参照" },
    auto: { score: 1, note: "バナー自動" },
    coverage: "1/4",
    coverageRatio: 0.25,
    description: "プレゼン資料の挿絵、社内ポータルのバナー画像、UIモックアップ用のアセット画像を高解像度で生成。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 6,
    easeScore: 8,
  },
  {
    id: 16,
    initial: "A",
    initialBg: "bg-amber-700 text-white",
    name: "Amazon Q Developer",
    form: "AWSクラウド特化AI",
    status: "検証中",
    dev: { score: 3, note: "AWS Java/TS" },
    doc: { score: 2, note: "アーキ解説" },
    research: { score: 2, note: "AWSドキュメント" },
    auto: { score: 2, note: "CodeTransform" },
    coverage: "3/4",
    coverageRatio: 0.75,
    description: "AWSリソースへのアクセス最適化、IAMポリシー生成、レガシーJava言語の自動バージョンアップを支援するAI。",
    securityLevel: "Level 1: AWS VPC内限定",
    impactScore: 8,
    easeScore: 6,
  },
  {
    id: 17,
    initial: "N",
    initialBg: "bg-zinc-800 text-white",
    name: "Notion AI",
    form: "ナレッジ管理 / Wiki",
    status: "リストアップ",
    dev: { score: 1, note: "仕様管理" },
    doc: { score: 3, note: "Wiki/議事録" },
    research: { score: 2, note: "社内Q&A" },
    auto: { score: 2, note: "自動プロパティ" },
    coverage: "3/4",
    coverageRatio: 0.75,
    description: "チームのドキュメント作成・議事録の要約・タスク管理を自動支援するワークスペースAI。",
    securityLevel: "Level 2: マスキング推奨",
    impactScore: 7,
    easeScore: 8,
  },
  {
    id: 18,
    initial: "C",
    initialBg: "bg-amber-800 text-white",
    name: "Claude 3.5 Sonnet (API)",
    form: "高度推論・Computer Use",
    status: "リストアップ",
    dev: { score: 3, note: "Code/Artifacts" },
    doc: { score: 3, note: "長文分析" },
    research: { score: 3, note: "視覚/PDF" },
    auto: { score: 3, note: "Computer Use" },
    coverage: "4/4",
    coverageRatio: 1.0,
    description: "200kトークンの大容量コンテキストと優れたコーディング・論理的推論力を誇る次世代マルチモーダル基盤モデル。",
    securityLevel: "Level 1: セキュアAPIゲートウェイ経由",
    impactScore: 10,
    easeScore: 5,
  },
  {
    id: 19,
    initial: "D",
    initialBg: "bg-red-700 text-white",
    name: "DeepSeek-R1 (Private)",
    form: "社内オンプレミス推論",
    status: "リストアップ",
    dev: { score: 3, note: "競プロ・アルゴ" },
    doc: { score: 2, note: "推論プロセス" },
    research: { score: 3, note: "数学・論理" },
    auto: { score: 1, note: "API" },
    coverage: "3/4",
    coverageRatio: 0.75,
    description: "完全社内インフラ環境にホストされたオープン推論モデル。極めて高難度の数学・アルゴリズム検証をセキュアに実行。",
    securityLevel: "Level 1: 完全社内オンプレミス",
    impactScore: 8,
    easeScore: 4,
  },
];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<"matrix" | "quadrant" | "coverage" | "diagnosis">("matrix");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "verifying" | "listup">("available");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState("2026/09/18 17:50");
  const [selectedTool, setSelectedTool] = useState<MatrixTool | null>(null);

  // 診断ウィザード用状態
  const [diagnosisAnswers, setDiagnosisAnswers] = useState({
    purpose: "",
    skillLevel: "",
    dataLevel: "",
  });

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSynced(
        `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
      );
    }, 800);
  };

  // フィルタリング処理
  const filteredTools = matrixTools.filter((tool) => {
    if (statusFilter === "available") {
      return (
        tool.status === "全社員利用可能" ||
        tool.status === "利用可能" ||
        tool.status === "社内セキュア網"
      );
    }
    if (statusFilter === "verifying") {
      return tool.status === "検証中";
    }
    if (statusFilter === "listup") {
      return tool.status === "リストアップ";
    }
    return true; // all
  });

  // 適合度ドットレンダラー
  const renderDots = (score: 1 | 2 | 3, note: string) => {
    let dotColors = "bg-blue-600";
    let bgCell = "bg-blue-50/70 border-blue-100 text-blue-900";

    if (score === 3) {
      bgCell = "bg-indigo-600 text-white font-semibold shadow-xs";
      dotColors = "bg-white";
    } else if (score === 2) {
      bgCell = "bg-sky-100/90 text-sky-900 font-medium";
      dotColors = "bg-sky-700";
    } else {
      bgCell = "bg-slate-100/70 text-slate-700";
      dotColors = "bg-slate-400";
    }

    return (
      <div
        className={`px-2.5 py-1.5 rounded-lg flex flex-col items-center justify-center text-center text-xs transition-all ${bgCell}`}
      >
        <div className="flex space-x-1 mb-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              score >= 1 ? dotColors : "bg-slate-300"
            }`}
          />
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              score >= 2 ? dotColors : "bg-slate-300"
            }`}
          />
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              score >= 3 ? dotColors : "bg-slate-300"
            }`}
          />
        </div>
        <span className="text-[11px] leading-tight truncate max-w-[85px]">
          {note}
        </span>
      </div>
    );
  };

  // ステータスバッジレンダラー
  const renderStatusBadge = (tool: MatrixTool) => {
    switch (tool.status) {
      case "全社員利用可能":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
            全社員利用可能
          </span>
        );
      case "利用可能":
        return (
          <div className="flex items-center space-x-1.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mr-1.5"></span>
              利用可能
            </span>
            {tool.licenseCount && (
              <span className="text-[10.5px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {tool.licenseCount}
              </span>
            )}
          </div>
        );
      case "社内セキュア網":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-1.5"></span>
            社内セキュア網
          </span>
        );
      case "検証中":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-1.5"></span>
            検証中
          </span>
        );
      case "リストアップ":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
            リストアップ
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* ページタイトルヘッダー（参考サイト準拠） */}
      <div className="bg-white border-b border-slate-200/90 pt-8 pb-6 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AIツール検証マトリックス
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
              ブランド × 適用領域。セルの濃さ＝その領域での適用適性（外部リサーチ評価・2026年6月時点）、注記＝主に担う役割（強み）。
              社内マスターシートの最新登録情報が自動反映されます。
            </p>
          </div>

          <UnderConstructionAlert
            statusType="poc"
            title="🧪 PoC検証中・サンプルデータ表示"
            message="本ツールのマトリクス適合度・残ライセンス数は検証用サンプルデータです。現在、社内Google SheetsマスターAPI連携および本番反映を準備中です。"
            prepDetails="スプレッドシート連携APIおよび権限管理仕様の策定フェーズ"
          />

          {/* 4大KPIカード */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">掲載ツール数</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">19</span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">利用可能</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-600 mt-1 block">7</span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">全社員利用可能</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 block">4</span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-medium text-slate-500 block">同期ステータス</span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-bold text-emerald-700">Sheet連携中</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* ビュー切り替えタブ */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-3">
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab("matrix")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                activeTab === "matrix"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Layers size={16} />
              <span>マトリクス</span>
            </button>
            <button
              onClick={() => setActiveTab("quadrant")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                activeTab === "quadrant"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Compass size={16} />
              <span>クアドラント</span>
            </button>
            <button
              onClick={() => setActiveTab("coverage")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                activeTab === "coverage"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <BarChart3 size={16} />
              <span>カバレッジ</span>
            </button>
            <button
              onClick={() => setActiveTab("diagnosis")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                activeTab === "diagnosis"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Sparkles size={16} />
              <span>ツール診断</span>
            </button>
          </div>

          {/* 右側：再読込（同期）ボタン */}
          <div className="flex items-center space-x-3">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              最終同期: {lastSynced}
            </span>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <RefreshCw
                size={13}
                className={isSyncing ? "animate-spin text-sky-600" : "text-slate-500"}
              />
              <span>{isSyncing ? "同期中..." : "再読込（同期）"}</span>
            </button>
          </div>
        </div>

        {/* 1. マトリクスビュー */}
        {activeTab === "matrix" && (
          <div className="space-y-4">
            {/* フィルター & 凡例バー */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              {/* ステータスフィルターピル */}
              <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    statusFilter === "all"
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  すべて (19)
                </button>
                <button
                  onClick={() => setStatusFilter("available")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    statusFilter === "available"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  利用可能 (7)
                </button>
                <button
                  onClick={() => setStatusFilter("verifying")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    statusFilter === "verifying"
                      ? "bg-amber-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  検証中 (5)
                </button>
                <button
                  onClick={() => setStatusFilter("listup")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    statusFilter === "listup"
                      ? "bg-slate-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  リストアップ (7)
                </button>
              </div>

              {/* 適合度レジェンド */}
              <div className="flex items-center space-x-3 text-[11px] text-slate-500 flex-wrap gap-y-1">
                <span className="flex items-center space-x-1">
                  <span className="text-slate-400">● ○ ○</span>
                  <span>補助的に使える</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="text-sky-600">● ● ○</span>
                  <span>実用的に活用</span>
                </span>
                <span className="flex items-center space-x-1 font-bold text-indigo-700">
                  <span>● ● ●</span>
                  <span>中核的な強み</span>
                </span>
              </div>
            </div>

            {/* マトリクステーブル本体 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[950px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                      <th className="py-3 px-3 w-12 text-center">#</th>
                      <th className="py-3 px-4 min-w-[200px]">ブランド / 形態</th>
                      <th className="py-3 px-4 min-w-[170px]">利用ステータス</th>
                      <th className="py-3 px-3 text-center min-w-[110px]">開発</th>
                      <th className="py-3 px-3 text-center min-w-[110px]">文書・資料</th>
                      <th className="py-3 px-3 text-center min-w-[110px]">調査・分析</th>
                      <th className="py-3 px-3 text-center min-w-[110px]">業務自動化</th>
                      <th className="py-3 px-4 min-w-[90px] text-center">カバー</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTools.map((tool) => (
                      <tr
                        key={tool.id}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                        onClick={() => setSelectedTool(tool)}
                      >
                        {/* # */}
                        <td className="py-4 px-3 text-center text-xs font-bold text-slate-400">
                          {tool.id}
                        </td>

                        {/* ブランド / 形態 */}
                        <td className="py-4 px-4">
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-2xs ${tool.initialBg}`}
                            >
                              {tool.initial}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {tool.name}
                                </span>
                                {tool.manualUrl && (
                                  <span className="text-[10px] px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium">
                                    マニュアル
                                  </span>
                                )}
                                {tool.applyRequired && (
                                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-medium">
                                    利用申請
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500 block">
                                {tool.form}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 利用ステータス */}
                        <td className="py-4 px-4">
                          {renderStatusBadge(tool)}
                        </td>

                        {/* 開発 */}
                        <td className="py-4 px-2 text-center">
                          {renderDots(tool.dev.score, tool.dev.note)}
                        </td>

                        {/* 文書・資料 */}
                        <td className="py-4 px-2 text-center">
                          {renderDots(tool.doc.score, tool.doc.note)}
                        </td>

                        {/* 調査・分析 */}
                        <td className="py-4 px-2 text-center">
                          {renderDots(tool.research.score, tool.research.note)}
                        </td>

                        {/* 業務自動化 */}
                        <td className="py-4 px-2 text-center">
                          {renderDots(tool.auto.score, tool.auto.note)}
                        </td>

                        {/* カバー */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-xs font-extrabold text-slate-700">
                              {tool.coverage}
                            </span>
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full"
                                style={{ width: `${tool.coverageRatio * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. クアドラントビュー */}
        {activeTab === "quadrant" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Compass className="text-indigo-600" size={20} />
                AIツール 2軸クアドラントマップ（導入容易性 × 業務インパクト）
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                右上に位置するツールほど「導入が手軽で、かつ高い業務インパクト」を創出します。
              </p>
            </div>

            {/* 2軸マッピング平面 */}
            <div className="relative w-full h-[520px] bg-slate-50/70 border border-slate-200 rounded-2xl p-6 overflow-hidden">
              {/* 軸ラベル */}
              <div className="absolute top-4 left-6 text-xs font-bold text-slate-400">
                ▲ 業務インパクト・自律化深度（高）
              </div>
              <div className="absolute bottom-4 right-6 text-xs font-bold text-slate-400">
                導入容易性・即時性（高） ▶
              </div>

              {/* 十字線 */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200 border-dashed" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-200 border-dashed" />

              {/* 象限ラベル */}
              <div className="absolute top-6 right-6 text-right opacity-30 text-xs font-extrabold text-emerald-700 uppercase">
                Quick Win / 全社即効（最優先推奨）
              </div>
              <div className="absolute top-6 left-6 text-left opacity-30 text-xs font-extrabold text-indigo-700 uppercase">
                High Impact / 高度自動化（開発・専門領域）
              </div>
              <div className="absolute bottom-6 right-6 text-right opacity-30 text-xs font-extrabold text-slate-600 uppercase">
                Standard / 日常サポート
              </div>

              {/* ツールプロットバブル */}
              {matrixTools.map((tool) => {
                const leftPercent = Math.min(Math.max((tool.easeScore / 10) * 88 + 6, 6), 92);
                const bottomPercent = Math.min(Math.max((tool.impactScore / 10) * 85 + 6, 6), 92);

                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool)}
                    style={{ left: `${leftPercent}%`, bottom: `${bottomPercent}%` }}
                    className="absolute -translate-x-1/2 translate-y-1/2 flex items-center space-x-1.5 px-2.5 py-1.5 bg-white border border-slate-200/90 rounded-full shadow-xs hover:shadow-md hover:scale-110 hover:border-indigo-500 hover:z-20 transition-all cursor-pointer group"
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${tool.initialBg}`}
                    >
                      {tool.initial}
                    </span>
                    <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
                      {tool.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. カバレッジビュー */}
        {activeTab === "coverage" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="text-indigo-600" size={20} />
                4大業務領域の全社AIカバレッジと推奨スタック
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                業務目的ごとに整備されている公認AIツール群の充実度とベストプラクティスです。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 開発・コード */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    開発・エンジニアリング領域
                  </h3>
                  <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    カバレッジ: 100%
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  自律コーディング・コードレビュー・テスト自動化を完全カバー。
                </p>
                <div className="text-xs space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">全社推奨スタック:</span>
                    <span className="text-slate-900 font-bold">Google Antigravity / GitHub Copilot</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">ターミナル自律修正:</span>
                    <span className="text-slate-900 font-bold">Claude Code (社内網)</span>
                  </div>
                </div>
              </div>

              {/* 文書・資料作成 */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    文書・資料・メール作成領域
                  </h3>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    カバレッジ: 100%
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  日常のビジネス文書作成、議事録要約、企画書ドラフトを即時支援。
                </p>
                <div className="text-xs space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">全社推奨スタック:</span>
                    <span className="text-slate-900 font-bold">Gemini for Workspace</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">仕様書・PDF要約:</span>
                    <span className="text-slate-900 font-bold">NotebookLM</span>
                  </div>
                </div>
              </div>

              {/* 調査・分析 */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
                    調査・市場分析・社内検索領域
                  </h3>
                  <span className="text-xs font-extrabold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">
                    カバレッジ: 95%
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  リアルタイムWeb検索と社内ナレッジのハルシネーションなき抽出。
                </p>
                <div className="text-xs space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">外部Web調査:</span>
                    <span className="text-slate-900 font-bold">Perplexity Enterprise</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">社内文書照会:</span>
                    <span className="text-slate-900 font-bold">NotebookLM / Glean (検証中)</span>
                  </div>
                </div>
              </div>

              {/* 業務自動化 */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                    業務自動化・ノーコードエージェント
                  </h3>
                  <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    カバレッジ: 90%
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  定常タスクの自動トリガー実行、承認連動、自律ワークフロー構築。
                </p>
                <div className="text-xs space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">RAG・アプリ基盤:</span>
                    <span className="text-slate-900 font-bold">Dify</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">ノーコード連携:</span>
                    <span className="text-slate-900 font-bold">Google Workspace Studio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. ツール診断ビュー */}
        {activeTab === "diagnosis" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-2xs">
                <Sparkles size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                3問でわかる！ あなたの業務に最適なAIツール診断
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                選択肢をタップするだけで、社内規定に適合した最適な公認ツールをご案内します。
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* 質問1 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Q1. 最も効率化したい主な業務は何ですか？
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: "dev", label: "ソースコード実装・レビュー・テスト" },
                    { id: "doc", label: "メール作成・企画書ドラフト・議事録" },
                    { id: "research", label: "大量の社内PDFや外部市場の調査・分析" },
                    { id: "auto", label: "定常フローや業務システムの自動化" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() =>
                        setDiagnosisAnswers({ ...diagnosisAnswers, purpose: opt.id })
                      }
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        diagnosisAnswers.purpose === opt.id
                          ? "border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 質問2 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Q2. どの環境で利用したいですか？
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: "browser", label: "ブラウザ上で手軽に使いたい" },
                    { id: "ide", label: "VS Code / IDEエディタと一体化したい" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() =>
                        setDiagnosisAnswers({ ...diagnosisAnswers, skillLevel: opt.id })
                      }
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        diagnosisAnswers.skillLevel === opt.id
                          ? "border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 診断結果表示 */}
              {diagnosisAnswers.purpose && diagnosisAnswers.skillLevel && (
                <div className="pt-6 border-t border-slate-200 animate-in fade-in zoom-in-95 duration-200 space-y-4">
                  <div className="bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-50 border border-indigo-200/80 rounded-2xl p-6 space-y-4">
                    <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                      <CheckCircle2 size={16} />
                      あなたにおすすめの社内公認AIツール
                    </span>

                    <div className="space-y-3">
                      {diagnosisAnswers.purpose === "dev" && diagnosisAnswers.skillLevel === "ide" && (
                        <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-slate-900 text-base">
                              Google Antigravity (IDE / CLI)
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                              全社員利用可能
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            並列サブエージェントとSkills/Rulesにより、社内規約に則った安全かつ爆速な開発が可能です。
                          </p>
                          <Link
                            href="/guide"
                            className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-1"
                          >
                            導入ガイドを見る <ChevronRight size={14} />
                          </Link>
                        </div>
                      )}

                      {diagnosisAnswers.purpose === "doc" && (
                        <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-slate-900 text-base">
                              Gemini for Workspace
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                              全社員利用可能
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            DocsやGmailのサイドパネルから申請不要で即座に文書作成・メール推敲を行えます。
                          </p>
                        </div>
                      )}

                      {diagnosisAnswers.purpose === "research" && (
                        <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-slate-900 text-base">
                              NotebookLM
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                              全社員利用可能
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            社内資料を放り込むだけで、根拠の明示された高精度な要約・FAQ回答を即時生成します。
                          </p>
                        </div>
                      )}

                      {diagnosisAnswers.purpose === "auto" && (
                        <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-slate-900 text-base">
                              Dify / Google Workspace Studio
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                              全社員利用可能
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            社内RAG検索アプリや承認ワークフローをノーコードで迅速に構築・自動化できます。
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ツール詳細モーダル */}
      {selectedTool && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${selectedTool.initialBg}`}
                >
                  {selectedTool.initial}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedTool.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedTool.form}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTool(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-y border-slate-100">
                <span className="text-slate-500 font-semibold">利用ステータス</span>
                <div>{renderStatusBadge(selectedTool)}</div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">セキュリティ基準</span>
                <span className="font-bold text-slate-800">
                  {selectedTool.securityLevel}
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-slate-500 font-semibold block">ツールの特徴・概要</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedTool.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
              {selectedTool.manualUrl && (
                <Link
                  href={selectedTool.manualUrl}
                  onClick={() => setSelectedTool(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  マニュアル・利用方法
                </Link>
              )}
              {selectedTool.applyRequired ? (
                <Link
                  href="/tools-hub"
                  onClick={() => setSelectedTool(null)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  利用ライセンスを申請
                </Link>
              ) : (
                <button
                  onClick={() => setSelectedTool(null)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  閉じる
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
