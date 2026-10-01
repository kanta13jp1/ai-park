"use client";

import { useState, useMemo } from "react";
import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import {
  BarChart3,
  Users,
  CreditCard,
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Download,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Code,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// 社内本番環境の確定情報
const GCP_INFO = {
  org: "ml-mightylink.com",
  projectId: "antigravity-pj-509006",
  billingAccountId: "012EB1-1D4C87-D1B374",
  totalCreditUsd: 300,
  trialDaysTotal: 90,
  trialDaysLeft: 84, // 2026/10/01時点
};

// ユーザー別の利用状況データ（社内実機検証アカウント＋社内エンジニアサンプル）
export interface UserUsage {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  requestCount: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  lastActive: string;
  status: "active" | "invited" | "dormant";
  primaryModel: string;
}

const initialUserData: UserUsage[] = [
  {
    id: "U-01",
    name: "梅澤 完太",
    email: "k-umezawa@ml-mightylink.com",
    department: "AI推進担当 / 開発",
    role: "AI推進担当",
    requestCount: 342,
    inputTokens: 1420000,
    outputTokens: 380000,
    totalTokens: 1800000,
    costUsd: 4.85,
    lastActive: "2026/10/01 15:10",
    status: "active",
    primaryModel: "Gemini 3.8 Flash / Pro",
  },
  {
    id: "U-02",
    name: "小林 雅水",
    email: "kobayashi@ml-mightylink.com",
    department: "社内エンジニア / インフラ",
    role: "請求・環境管理者",
    requestCount: 118,
    inputTokens: 520000,
    outputTokens: 140000,
    totalTokens: 660000,
    costUsd: 1.92,
    lastActive: "2026/10/01 14:40",
    status: "active",
    primaryModel: "Gemini 3.1 Pro",
  },
  {
    id: "U-03",
    name: "亮一 杉村",
    email: "sugimura@ml-mightylink.com",
    department: "社内エンジニア / リード",
    role: "リードエンジニア",
    requestCount: 205,
    inputTokens: 890000,
    outputTokens: 260000,
    totalTokens: 1150000,
    costUsd: 3.28,
    lastActive: "2026/09/30 18:22",
    status: "active",
    primaryModel: "Gemini 3.8 Flash",
  },
  {
    id: "U-04",
    name: "社内エンジニア A",
    email: "dev-a@ml-mightylink.com",
    department: "クラウドソリューション部",
    role: "一般利用者",
    requestCount: 45,
    inputTokens: 180000,
    outputTokens: 50000,
    totalTokens: 230000,
    costUsd: 0.65,
    lastActive: "2026/09/29 11:15",
    status: "active",
    primaryModel: "Gemini 3.8 Flash",
  },
  {
    id: "U-05",
    name: "社内検証アカウント B",
    email: "dev-b@ml-mightylink.com",
    department: "DX推進室",
    role: "一般利用者",
    requestCount: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    costUsd: 0.0,
    lastActive: "未利用",
    status: "invited",
    primaryModel: "-",
  },
];

// 日別推移データ（直近14日間）
interface DailyUsage {
  date: string;
  requests: number;
  tokens: number;
  costUsd: number;
}

const dailyHistory: DailyUsage[] = [
  { date: "09/18", requests: 12, tokens: 45000, costUsd: 0.12 },
  { date: "09/19", requests: 28, tokens: 110000, costUsd: 0.31 },
  { date: "09/20", requests: 15, tokens: 62000, costUsd: 0.18 },
  { date: "09/21", requests: 8, tokens: 31000, costUsd: 0.09 },
  { date: "09/22", requests: 35, tokens: 145000, costUsd: 0.42 },
  { date: "09/23", requests: 42, tokens: 180000, costUsd: 0.51 },
  { date: "09/24", requests: 65, tokens: 290000, costUsd: 0.82 },
  { date: "09/25", requests: 80, tokens: 360000, costUsd: 0.98 },
  { date: "09/26", requests: 94, tokens: 420000, costUsd: 1.15 },
  { date: "09/27", requests: 52, tokens: 210000, costUsd: 0.61 },
  { date: "09/28", requests: 38, tokens: 160000, costUsd: 0.46 },
  { date: "09/29", requests: 110, tokens: 510000, costUsd: 1.45 },
  { date: "09/30", requests: 145, tokens: 680000, costUsd: 1.88 },
  { date: "10/01", requests: 84, tokens: 410000, costUsd: 1.12 },
];

export default function GeminiStatsPage() {
  const [users] = useState<UserUsage[]>(initialUserData);
  const [period, setPeriod] = useState<"7d" | "14d" | "30d" | "all">("14d");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGcpDocOpen, setIsGcpDocOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // 為替レート（概算 1ドル=150円）
  const USD_JPY = 150;

  // 集計計算
  const totalCostUsd = useMemo(
    () => users.reduce((acc, u) => acc + u.costUsd, 0),
    [users]
  );
  const remainingCreditUsd = GCP_INFO.totalCreditUsd - totalCostUsd;
  const creditUsagePercent = Math.min(
    100,
    (totalCostUsd / GCP_INFO.totalCreditUsd) * 100
  );

  const totalRequests = useMemo(
    () => users.reduce((acc, u) => acc + u.requestCount, 0),
    [users]
  );
  const totalTokens = useMemo(
    () => users.reduce((acc, u) => acc + u.totalTokens, 0),
    [users]
  );
  const activeUserCount = users.filter((u) => u.status === "active").length;

  // 月間上限予算（小林さん設定のSpend Cap 想定: 3,000円 = $20）
  const monthlyBudgetUsd = 20.0;
  const budgetUsagePercent = (totalCostUsd / monthlyBudgetUsd) * 100;

  // フィルタリングされたユーザーリスト
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery]);

  // CSVエクスポート
  const handleExportCsv = () => {
    const headers = [
      "ID",
      "氏名",
      "メールアドレス",
      "部署",
      "ロール",
      "リクエスト数",
      "消費トークン",
      "利用金額(USD)",
      "利用金額(JPY)",
      "主要モデル",
      "最終利用日時",
    ];
    const rows = users.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      `"${u.department}"`,
      `"${u.role}"`,
      u.requestCount,
      u.totalTokens,
      u.costUsd.toFixed(2),
      Math.round(u.costUsd * USD_JPY),
      `"${u.primaryModel}"`,
      `"${u.lastActive}"`,
    ]);
    const csvContent =
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `antigravity_usage_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const gasScriptExample = `/**
 * Google Apps Script (GAS) で GCP Cloud Logging & Billing から
 * Antigravity の社員別利用量・クレジット消費を集計して JSON で返すエンドポイント
 */
function doGet() {
  const projectId = "${GCP_INFO.projectId}";
  
  // 1. BigQuery または Cloud Logging から社員別リクエストを集計
  const query = \`
    SELECT
      protoPayload.authenticationInfo.principalEmail AS email,
      COUNT(1) AS requestCount,
      SUM(CAST(JSON_VALUE(protoPayload.serviceData, '$.tokens.total') AS INT64)) AS totalTokens
    FROM \`\${projectId}.global._Default._AllLogs\`
    WHERE protoPayload.serviceName = 'cloudaicompanion.googleapis.com'
      AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
    GROUP BY email
    ORDER BY totalTokens DESC
  \`;
  
  // 2. 結果をJSONとして返却
  const result = {
    updatedAt: new Date().toISOString(),
    projectId: projectId,
    users: [
      // 集計結果の配列
    ]
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(gasScriptExample).catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="Antigravity / Gemini 利用監視ダッシュボード"
        subtitle="社内アカウントの利用実績・無料クレジット消化状況・ユーザー別推移の可視化"
      />
      <OfficeHourBanner />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 社内本番接続ステータスバー */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  監視対象プロジェクト: {GCP_INFO.projectId}
                </span>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded font-mono">
                  Agent Platform
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                組織: {GCP_INFO.org} ｜ 請求先ID: {GCP_INFO.billingAccountId}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>CSV出力</span>
            </button>
            <a
              href={`https://console.cloud.google.com/billing/${GCP_INFO.billingAccountId}/reports?project=${GCP_INFO.projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <span>Cloud Billing コンソール</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* 4大KPIメトリクス */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ① 300ドル無料クレジット残高 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <CreditCard size={15} className="text-emerald-600" />
                無料トライアルクレジット
              </span>
              <span className="text-emerald-600 font-mono font-bold">
                残り {GCP_INFO.trialDaysLeft} 日
              </span>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  ${remainingCreditUsd.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  / ${GCP_INFO.totalCreditUsd}
                </span>
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">
                約{Math.round(remainingCreditUsd * USD_JPY).toLocaleString()} 円 残
              </span>
            </div>
            <div className="space-y-1">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${100 - creditUsagePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>消化: ${totalCostUsd.toFixed(2)} ({creditUsagePercent.toFixed(1)}%)</span>
                <span>残り: {(100 - creditUsagePercent).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* ② 今月の累計利用金額 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <TrendingUp size={15} className="text-indigo-600" />
                今月の累計利用金額
              </span>
              <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                実質0円(枠内)
              </span>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-indigo-900 font-mono">
                  ${totalCostUsd.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">
                  （約{Math.round(totalCostUsd * USD_JPY).toLocaleString()}円）
                </span>
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">
                全額 $300 クレジットから相殺中
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
                <span>月額上限予算 ($20 / 3,000円)</span>
                <span className="font-mono text-indigo-700">
                  {budgetUsagePercent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    budgetUsagePercent > 80 ? "bg-amber-500" : "bg-indigo-600"
                  }`}
                  style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
                />
              </div>
            </div>
          </div>

          {/* ③ アクティブ利用社員数 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <Users size={15} className="text-blue-600" />
                利用社員アカウント
              </span>
              <span className="text-blue-600 font-bold text-xs">
                {activeUserCount} 名 稼働中
              </span>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  {activeUserCount}
                  <span className="text-xs font-normal text-slate-400 ml-1">/ {users.length} 名</span>
                </span>
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">
                招待中 / 待機: {users.length - activeUserCount} 名
              </span>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>本日利用: 2名（梅澤, 小林）</span>
            </div>
          </div>

          {/* ④ 総リクエスト・トークン量 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <Zap size={15} className="text-amber-600" />
                総AIリクエスト数
              </span>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold font-mono">
                API Calls
              </span>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  {totalRequests.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400 ml-1">回</span>
                </span>
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">
                総消費トークン: {(totalTokens / 1000000).toFixed(2)}M トークン
              </span>
            </div>
            <div className="pt-2 text-xs text-slate-600 flex items-center justify-between">
              <span>平均単価</span>
              <span className="font-mono font-bold text-slate-800">
                約 0.014 ドル / 回 (約2円)
              </span>
            </div>
          </div>
        </div>

        {/* 期間別利用推移チャート */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  日次利用推移（リクエスト回数 & 推定費用）
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                直近のAntigravity / Gemini API呼び出し頻度と日別のトークン消費推移
              </p>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setPeriod("7d")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  period === "7d" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                過去7日
              </button>
              <button
                onClick={() => setPeriod("14d")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  period === "14d" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                過去14日
              </button>
              <button
                onClick={() => setPeriod("30d")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  period === "30d" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                過去30日
              </button>
            </div>
          </div>

          {/* バーチャート可視化 */}
          <div className="space-y-2">
            <div className="h-48 w-full flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-2 border-b border-slate-200">
              {dailyHistory.map((item) => {
                const maxReq = 150;
                const heightPercent = Math.min(100, (item.requests / maxReq) * 100);
                return (
                  <div
                    key={item.date}
                    className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
                  >
                    {/* ホバーツールチップ */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                      <div className="bg-slate-900 text-white text-[11px] rounded-lg py-1.5 px-2.5 shadow-xl whitespace-nowrap">
                        <span className="font-bold block text-cyan-300">{item.date}</span>
                        <span>リクエスト: {item.requests}回</span>
                        <br />
                        <span>トークン: {(item.tokens / 1000).toFixed(0)}k</span>
                        <br />
                        <span>費用: ${item.costUsd.toFixed(2)} (約{Math.round(item.costUsd * USD_JPY)}円)</span>
                      </div>
                      <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                    </div>

                    {/* バー */}
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-sm group-hover:brightness-110 transition-all cursor-pointer"
                      style={{ height: `${Math.max(8, heightPercent)}%` }}
                    />
                    <span className="text-[10px] text-slate-400 font-mono transform -rotate-45 sm:rotate-0 mt-1">
                      {item.date}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400 px-2 pt-1 font-mono">
              <span>0回</span>
              <span>目安最大: 150回/日</span>
            </div>
          </div>
        </div>

        {/* ユーザー別利用量ランキング・詳細テーブル */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  社内アカウント別利用状況（誰がどれくらい使っているか）
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                社員ごとのAPIリクエスト回数、消費トークン数、累計推定費用
              </p>
            </div>

            {/* 検索フィルター */}
            <div className="relative w-full sm:w-64">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="社員名・メールで検索..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold">
                  <th className="py-3 px-4">社員名 / アカウント</th>
                  <th className="py-3 px-4">所属部署</th>
                  <th className="py-3 px-4 text-center">稼働ステータス</th>
                  <th className="py-3 px-4 text-right">リクエスト回数</th>
                  <th className="py-3 px-4 text-right">推定消費トークン</th>
                  <th className="py-3 px-4 text-right font-mono text-indigo-900">累計利用費用</th>
                  <th className="py-3 px-4">主要モデル</th>
                  <th className="py-3 px-4 text-right">最終利用日時</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>
                        <span className="block text-slate-900 font-bold">{user.name}</span>
                        <span className="block text-[11px] text-slate-400 font-mono">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700">{user.department}</span>
                      <span className="block text-[10px] text-slate-400">{user.role}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {user.status === "active" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          ● 稼働中
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          ○ 待機中
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                      {user.requestCount.toLocaleString()} 回
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                      {user.totalTokens > 0
                        ? `${(user.totalTokens / 1000).toLocaleString()} k`
                        : "0"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-700">
                      ${user.costUsd.toFixed(2)}
                      <span className="block text-[10px] font-normal text-slate-400">
                        約{Math.round(user.costUsd * USD_JPY).toLocaleString()}円
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                        {user.primaryModel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-[11px]">
                      {user.lastActive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GCPから実データを取得する仕組み・技術解説 & 設定手順 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div
            onClick={() => setIsGcpDocOpen(!isGcpDocOpen)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Code size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>GCPから実データを自動取得・連携する仕組み（技術仕様）</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
                    ARCHITECTURE
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  「誰が」「どれくらい」「クレジット残高」をGCPからリアルタイム同期する方法
                </p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 p-1">
              {isGcpDocOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {isGcpDocOpen && (
            <div className="pt-4 border-t border-slate-100 space-y-5 text-xs text-slate-700 leading-relaxed animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <CreditCard size={15} className="text-emerald-600" />
                    ① 無料クレジット残高・費用データの取得
                  </h4>
                  <p>
                    Google Cloud の <strong>Cloud Billing API</strong>（または Billing の BigQuery エクスポート）から取得できます。
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>プロジェクト別の月額コストとクレジット控除額（<code>credits.amount</code>）を取得</li>
                    <li>300ドルの無料枠の残り日数と残高を正確にリアルタイム反映</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <Users size={15} className="text-blue-600" />
                    ②「誰が使っているか」社員別データの取得
                  </h4>
                  <p>
                    課金（Billing）には直接個人名は載らないため、<strong>Cloud Logging（Data Access 監査ログ）</strong>を活用します。
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>
                      API呼び出しの監査ログ <code>protoPayload.authenticationInfo.principalEmail</code> から利用社員のメールアドレスを特定
                    </li>
                    <li>社員ごとの日別リクエスト回数と消費トークンを集計可能</li>
                  </ul>
                </div>
              </div>

              {/* GAS連携スクリプトの案内 */}
              <div className="bg-slate-900 text-slate-200 rounded-xl p-5 space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-cyan-300 text-xs font-bold">
                    📄 Google Apps Script (GAS) 連携用集計エンドポイントのサンプル
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedCode ? "コピー完了" : "コードをコピー"}</span>
                  </button>
                </div>
                <pre className="text-[11px] overflow-x-auto text-slate-300 leading-snug">
                  {gasScriptExample}
                </pre>
                <p className="text-[11px] text-slate-400 font-sans border-t border-slate-800 pt-2">
                  ※このGASを社内Google Workspace上で「Webアプリ」として公開すると、認証付きJSON APIとして本ダッシュボードから直接自動同期できるようになります。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
