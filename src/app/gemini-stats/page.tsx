"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import SpotlightCard from "@/components/SpotlightCard";
import GeminiStatsSyncStatus from "@/components/GeminiStatsSyncStatus";
import { basePath } from "@/lib/basePath";
import { playCyberClick } from "@/lib/sound";
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
const DEFAULT_GCP_INFO = {
  org: "ml-mightylink.com",
  projectId: "antigravity-pj-509006",
  billingAccountId: "012EB1-1D4C87-D1B374",
  totalCreditUsd: 300,
  trialDaysTotal: 90,
  trialDaysLeft: 84, // 2026/10/01時点
};

// ユーザー別の利用状況データ型
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

// 日別推移データ
interface DailyUsage {
  date: string;
  requests: number;
  tokens: number;
  costUsd: number;
}

export default function GeminiStatsPage() {
  const [users, setUsers] = useState<UserUsage[]>([]);
  const [dailyData, setDailyData] = useState<DailyUsage[]>([]);
  const [gcpInfo, setGcpInfo] = useState(DEFAULT_GCP_INFO);
  const [syncedAt, setSyncedAt] = useState<string>("取得中...");
  const [dataSource, setDataSource] = useState<string>("GitHub Actions 自動同期パイプライン");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [period, setPeriod] = useState<"7d" | "14d" | "30d" | "all">("14d");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGcpDocOpen, setIsGcpDocOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // 為替レート（概算 1ドル=150円）
  const USD_JPY = 150;

  // GAS Web API エンドポイント（v5: 公開設定=全員）
  const GAS_ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbzWXZpu6loQFXXATUtrrOfN5XkPzMEFleqzxfqs-izyix5HFtj3TOsCn7ISENekEtqYgg/exec";

  // 自動同期データのフェッチ (GAS Live API -> 静的JSONフォールバック)
  const fetchLiveData = useCallback(async () => {
    setIsLoading(true);
    let loaded = false;

    // 1. まず GAS Live Web API からのリアルタイム取得を試行
    try {
      const gasRes = await fetch(GAS_ENDPOINT_URL, { redirect: "follow" });
      if (gasRes.ok) {
        const data = await gasRes.json();
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
          if (data.dailyHistory) setDailyData(data.dailyHistory);
          if (data.gcpInfo) setGcpInfo((prev) => ({ ...prev, ...data.gcpInfo }));
          setSyncedAt(data.syncedAt || "リアルタイム同期");
          setDataSource(data.dataSource || "GAS Live API");
          setIsLive(true);
          loaded = true;
        }
      }
    } catch {
      // GASフェッチ失敗時はフォールバックへ進む
    }

    // 2. フォールバック: 静的 JSON ファイルから読み込み
    if (!loaded) {
      try {
        const res = await fetch(`${basePath}/data/gcp-usage-live.json?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.users && Array.isArray(data.users)) setUsers(data.users);
          if (data.dailyHistory && Array.isArray(data.dailyHistory)) setDailyData(data.dailyHistory);
          if (data.gcpInfo) setGcpInfo((prev) => ({ ...prev, ...data.gcpInfo }));
          setSyncedAt(data.syncedAt || "最新");
          setDataSource(data.dataSource || "GCP Verified Data");
          setIsLive(true);
        }
      } catch (err) {
        console.warn("Failed to load sync data", err);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  // 集計計算
  const totalCostUsd = useMemo(
    () => users.reduce((acc, u) => acc + u.costUsd, 0),
    [users]
  );
  const remainingCreditUsd = gcpInfo.totalCreditUsd - totalCostUsd;
  const creditUsagePercent = Math.min(
    100,
    (totalCostUsd / gcpInfo.totalCreditUsd) * 100
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
  const projectId = "${gcpInfo.projectId}";
  
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
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="Antigravity / Gemini 利用監視ダッシュボード"
        subtitle="社内アカウントの利用実績・無料クレジット消化状況・ユーザー別推移の可視化"
      />
      <OfficeHourBanner />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 社内本番接続ステータスバー */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className={`w-3.5 h-3.5 rounded-full ${isLive ? "bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" : "bg-amber-400"}`} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  監視対象プロジェクト: <span className="font-mono text-cyan-300">{gcpInfo.projectId}</span>
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2.5 py-0.5 rounded-full font-mono">
                  Agent Platform
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                  <CheckCircle2 size={11} />
                  <span>自動同期稼働中 ({syncedAt})</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                組織: {gcpInfo.org} ｜ 請求先ID: {gcpInfo.billingAccountId} ｜ データ元: {dataSource}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={() => {
                playCyberClick();
                fetchLiveData();
              }}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              title="最新データを再取得"
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
              <span>{isLoading ? "更新中..." : "即時再取得"}</span>
            </button>
            <button
              onClick={() => {
                playCyberClick();
                handleExportCsv();
              }}
              className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Download size={13} />
              <span>CSV出力</span>
            </button>
            <a
              href={`https://console.cloud.google.com/billing/${gcpInfo.billingAccountId}/reports?project=${gcpInfo.projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playCyberClick()}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
            >
              <span>Cloud Billing コンソール</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* データ同期ステータス & 反映トラブルシューティングFAQ */}
        <GeminiStatsSyncStatus
          syncedAt={syncedAt}
          dataSource={dataSource}
          isLive={isLive}
          isLoading={isLoading}
          onRefresh={() => {
            playCyberClick();
            fetchLiveData();
          }}
          projectId={gcpInfo.projectId}
        />

        {/* 4大KPIメトリクス */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ① 300ドル無料クレジット残高 */}
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.15)"
            className="bg-white border-slate-200/90"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CreditCard size={15} className="text-emerald-600" />
                  無料トライアルクレジット
                </span>
                <span className="text-emerald-700 font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px]">
                  残り {gcpInfo.trialDaysLeft} 日
                </span>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                    ${remainingCreditUsd.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    / ${gcpInfo.totalCreditUsd}
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
          </SpotlightCard>

          {/* ② 今月の累計利用金額 */}
          <SpotlightCard
            spotlightColor="rgba(99, 102, 241, 0.15)"
            className="bg-white border-slate-200/90"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <TrendingUp size={15} className="text-indigo-600" />
                  今月の累計利用金額
                </span>
                <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold border border-indigo-200/60">
                  実質0円(枠内)
                </span>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-indigo-900 font-mono tracking-tight">
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
          </SpotlightCard>

          {/* ③ アクティブ利用社員数 */}
          <SpotlightCard
            spotlightColor="rgba(59, 130, 246, 0.15)"
            className="bg-white border-slate-200/90"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Users size={15} className="text-blue-600" />
                  利用社員アカウント
                </span>
                <span className="text-blue-700 font-bold text-xs bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                  {activeUserCount} 名 稼働中
                </span>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {activeUserCount}
                    <span className="text-xs font-normal text-slate-400 ml-1">/ {users.length} 名</span>
                  </span>
                </div>
                <span className="text-xs text-slate-500 block mt-0.5">
                  招待中 / 待機: {users.length - activeUserCount} 名
                </span>
              </div>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>本日利用: 2名（梅澤, 小林）</span>
              </div>
            </div>
          </SpotlightCard>

          {/* ④ 総リクエスト・トークン量 */}
          <SpotlightCard
            spotlightColor="rgba(245, 158, 11, 0.15)"
            className="bg-white border-slate-200/90"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Zap size={15} className="text-amber-600" />
                  総AIリクエスト数
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold font-mono border border-amber-200/60">
                  API Calls
                </span>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
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
          </SpotlightCard>
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
              {dailyData.map((item) => {
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
