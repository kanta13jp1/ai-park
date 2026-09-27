"use client";

import { useState, useEffect } from "react";
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
import { TOOLS_SHEET_CSV_URL, fetchSheetTools } from "@/lib/toolsSheet";

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
  dev: { score: 0 | 1 | 2 | 3; note: string };
  doc: { score: 0 | 1 | 2 | 3; note: string };
  research: { score: 0 | 1 | 2 | 3; note: string };
  auto: { score: 0 | 1 | 2 | 3; note: string };
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
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "全社標準のLLMアプリケーション開発基盤。ドラッグ＆ドロップでRAG検索や自律ワークフローを構築可能。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 2,
    initial: "G",
    initialBg: "bg-emerald-600 text-white",
    name: "Gemini for Workspace",
    form: "サイドパネル / Gems",
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "Google Docs/Gmail/Sheetsに直接統合された対話型AI。全社員の日常業務での文章作成とメール要約に即時利用可能。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 3,
    initial: "N",
    initialBg: "bg-teal-600 text-white",
    name: "NotebookLM",
    form: "リサーチノート",
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "アップロードした社内PDF・仕様書・議事録に基づき、ハルシネーションなく正確に質疑応答・要約・音声解説を生成。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 4,
    initial: "G",
    initialBg: "bg-amber-600 text-white",
    name: "Google Workspace Studio",
    form: "ノーコード自動化 / AIエージェント",
    manualUrl: "/learning",
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "フォーム入力トリガーによる自動メール送信、承認フロー、Driveファイル自動仕分けなどのノーコード自動化。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 5,
    initial: "J",
    initialBg: "bg-fuchsia-600 text-white",
    name: "Jitora",
    form: "Webプラットフォーム / VS Code拡張",
    manualUrl: "/learning",
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "業務要件からReact/Next.js/Node.js等のフルスタックコードと画面設計書を自動生成する開発プラットフォーム。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 6,
    initial: "C",
    initialBg: "bg-indigo-600 text-white",
    name: "Claude Code",
    form: "Code / Cowork / API",
    applyRequired: true,
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "ターミナル上で自律的にバグ修正・リファクタリング・テスト実行を完結するAnthropic社最新のコーディングエージェント。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 7,
    initial: "A",
    initialBg: "bg-sky-600 text-white",
    name: "Google Antigravity",
    form: "次世代IDE / CLI (agy)",
    manualUrl: "/guide",
    status: "利用可能",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "自律並列サブエージェント、Skills/Rules自動適用、MCP連携を標準装備した全社推奨の開発・エージェント基盤。",
    securityLevel: "Level 1: 会社のGoogle Cloudプロジェクト経由のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 8,
    initial: "G",
    initialBg: "bg-slate-800 text-white",
    name: "GitHub Copilot Enterprise",
    form: "IDE拡張 / PRレビュー",
    applyRequired: true,
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "VS Code / IntelliJ 内でのリアルタイムコード補完、GitHub pull request 自動要約・コードレビュー。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 9,
    initial: "C",
    initialBg: "bg-violet-700 text-white",
    name: "Cursor",
    form: "AI統合エディタ",
    applyRequired: true,
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "リポジトリ全体をインデックス化し、複数ファイルにまたがるコード編集をComposerで一括適用できる開発エディタ。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 10,
    initial: "C",
    initialBg: "bg-emerald-700 text-white",
    name: "ChatGPT Enterprise",
    form: "Web対話 / Code Interpreter",
    applyRequired: true,
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "OpenAI GPT-4o / o1 を搭載したエンタープライズ対話基盤。データ分析、高度推論、カスタムGPTs作成に対応。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 11,
    initial: "P",
    initialBg: "bg-cyan-700 text-white",
    name: "Perplexity Enterprise",
    form: "AI検索エンジン",
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "出典引用付きの最新Web検索に特化したAIリサーチツール。技術動向調査や特許・競合分析に強み。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 12,
    initial: "V",
    initialBg: "bg-black text-white",
    name: "v0 by Vercel",
    form: "UIコンポーネント生成",
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "テキスト指示から即座にNext.js / Tailwind CSS / shadcn/ui準拠のUIプロトタイプを生成するフロントエンド支援ツール。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 13,
    initial: "B",
    initialBg: "bg-orange-600 text-white",
    name: "Bolt.new",
    form: "フルスタックWeb自動構築",
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "ブラウザ内のWebContainer上でフロントエンド・バックエンド・DBを同時構築し即時実行・デプロイできるツール。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 14,
    initial: "G",
    initialBg: "bg-blue-700 text-white",
    name: "Glean",
    form: "社内横断エンタープライズ検索",
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "Google Drive, Slack, GitHub, Jira など社内全ツールを横断してセキュアにナレッジを検索・回答するAI検索基盤。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 15,
    initial: "M",
    initialBg: "bg-purple-800 text-white",
    name: "Midjourney / Imagen 3",
    form: "画像生成 / クリエイティブ",
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "プレゼン資料の挿絵、社内ポータルのバナー画像、UIモックアップ用のアセット画像を高解像度で生成。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 16,
    initial: "A",
    initialBg: "bg-amber-700 text-white",
    name: "Amazon Q Developer",
    form: "AWSクラウド特化AI",
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "AWSリソースへのアクセス最適化、IAMポリシー生成、レガシーJava言語の自動バージョンアップを支援するAI。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 17,
    initial: "N",
    initialBg: "bg-zinc-800 text-white",
    name: "Notion AI",
    form: "ナレッジ管理 / Wiki",
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "チームのドキュメント作成・議事録の要約・タスク管理を自動支援するワークスペースAI。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 18,
    initial: "C",
    initialBg: "bg-amber-800 text-white",
    name: "Claude 3.5 Sonnet (API)",
    form: "高度推論・Computer Use",
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "200kトークンの大容量コンテキストと優れたコーディング・論理的推論力を誇る次世代マルチモーダル基盤モデル。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
  {
    id: 19,
    initial: "D",
    initialBg: "bg-red-700 text-white",
    name: "DeepSeek-R1 (Private)",
    form: "社内オンプレミス推論",
    status: "リストアップ",
    dev: { score: 0, note: "" },
    doc: { score: 0, note: "" },
    research: { score: 0, note: "" },
    auto: { score: 0, note: "" },
    coverage: "",
    coverageRatio: 0,
    description: "完全社内インフラ環境にホストされたオープン推論モデル。極めて高難度の数学・アルゴリズム検証をセキュアに実行。",
    securityLevel: "Level 3: 一般公開情報のみ",
    impactScore: 0,
    easeScore: 0,
  },
];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<"matrix" | "quadrant" | "coverage" | "diagnosis">("matrix");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "verifying" | "listup">("available");
  const [tools, setTools] = useState<MatrixTool[]>(matrixTools);
  const [isSyncing, setIsSyncing] = useState(Boolean(TOOLS_SHEET_CSV_URL));
  const [lastSynced, setLastSynced] = useState(
    TOOLS_SHEET_CSV_URL ? "同期中..." : "未接続（ページ組込みデータ）"
  );
  const [selectedTool, setSelectedTool] = useState<MatrixTool | null>(null);

  // 診断ウィザード用状態
  const [diagnosisAnswers, setDiagnosisAnswers] = useState({
    purpose: "",
    skillLevel: "",
    dataLevel: "",
  });

  // 社内Google Sheets（AIツールマスター）の公開CSVから取得。失敗時は組込みデータを維持
  const loadSheetTools = (signal?: AbortSignal) =>
    fetchSheetTools(signal)
      .then((sheetTools) => {
        setTools(sheetTools);
        const now = new Date();
        setLastSynced(
          `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}（Google Sheets）`
        );
      })
      .catch((e) => {
        if (signal?.aborted) return;
        console.error("Failed to sync tools sheet", e);
        setLastSynced("同期失敗（ページ組込みデータを表示中）");
      })
      .finally(() => {
        if (!signal?.aborted) setIsSyncing(false);
      });

  useEffect(() => {
    if (!TOOLS_SHEET_CSV_URL) return;
    const controller = new AbortController();
    loadSheetTools(controller.signal);
    return () => controller.abort();
  }, []);

  const handleSync = () => {
    if (!TOOLS_SHEET_CSV_URL) return;
    setIsSyncing(true);
    loadSheetTools();
  };

  // フィルタリング処理
  const filteredTools = tools.filter((tool) => {
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
  const renderDots = (score: 0 | 1 | 2 | 3, note: string) => {
    if (score === 0) {
      return (
        <div className="px-2.5 py-1.5 rounded-lg flex flex-col items-center justify-center text-center text-xs bg-slate-50 text-slate-400">
          <span className="text-[11px]">未評価</span>
          {note && <span className="text-[11px] leading-tight truncate max-w-[85px]">{note}</span>}
        </div>
      );
    }

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
              ブランド × 適用領域。適合度は社内で評価するまで「未評価」と表示します。
              社内マスターシートの最新登録情報が自動反映されます。
            </p>
          </div>

          <UnderConstructionAlert
            statusType="poc"
            title="🧪 PoC検証中：内容は社内でまだ確認していません"
            message="表は社内マスターシート（AIツールマスター）の登録内容を表示しています。利用ステータスや適合度は社内での確認がまだ済んでいません。業務で使う前に、AI推進担当に確認してください。"
            prepDetails="スプレッドシート連携APIおよび権限管理仕様の策定フェーズ"
            releaseDate="2026年10月9日(金)"
          />

          {/* 4大KPIカード */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">掲載ツール数</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">{tools.length}</span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">利用可能</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-600 mt-1 block">{tools.filter((t) => t.status === "全社員利用可能" || t.status === "利用可能" || t.status === "社内セキュア網").length}</span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">全社員利用可能</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 block">{tools.filter((t) => t.status === "全社員利用可能").length}</span>
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
              disabled={isSyncing || !TOOLS_SHEET_CSV_URL}
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
                  すべて ({tools.length})
                </button>
                <button
                  onClick={() => setStatusFilter("available")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    statusFilter === "available"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  利用可能 ({tools.filter((t) => t.status === "全社員利用可能" || t.status === "利用可能" || t.status === "社内セキュア網").length})
                </button>
                <button
                  onClick={() => setStatusFilter("verifying")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    statusFilter === "verifying"
                      ? "bg-amber-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  検証中 ({tools.filter((t) => t.status === "検証中").length})
                </button>
                <button
                  onClick={() => setStatusFilter("listup")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    statusFilter === "listup"
                      ? "bg-slate-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  リストアップ ({tools.filter((t) => t.status === "リストアップ").length})
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
                              {tool.coverage || "—"}
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
        {activeTab !== "matrix" && (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 space-y-2">
            <p className="text-sm font-bold text-slate-700">🚧 工事中：社内での確認が済むまで表示しません</p>
            <p className="text-xs">
              クアドラント・カバレッジ・ツール診断は、ツールの評価や「おすすめ」を含むため、社内で内容を確認してから公開します。
            </p>
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
