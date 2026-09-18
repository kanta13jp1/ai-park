"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Award,
  Download,
  Upload,
  Sparkles,
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  RefreshCw,
  FileSpreadsheet,
  PieChart,
} from "lucide-react";
import { useState } from "react";

interface DeptStat {
  name: string;
  rate: number;
  users: number;
  prompts: number;
}

const defaultStatsByPeriod: Record<
  string,
  {
    mau: string;
    mauDiff: string;
    totalPrompts: string;
    promptsDiff: string;
    activeUsers: string;
    totalLicense: string;
    topDept: string;
    topRate: string;
    departments: DeptStat[];
  }
> = {
  "30d": {
    mau: "79.4%",
    mauDiff: "+4.2% (前月比)",
    totalPrompts: "109.9K",
    promptsDiff: "+18%",
    activeUsers: "1,240",
    totalLicense: "1,500名",
    topDept: "DX推進部",
    topRate: "94%",
    departments: [
      { name: "DX・イノベーション推進部", rate: 94, users: 48, prompts: 18420 },
      { name: "クラウド基盤推進部", rate: 89, users: 72, prompts: 24800 },
      { name: "エンタープライズソリューション部", rate: 82, users: 110, prompts: 31200 },
      { name: "基幹システム開発部", rate: 76, users: 65, prompts: 14500 },
      { name: "人事・総務・経営企画部", rate: 71, users: 54, prompts: 12100 },
      { name: "デジタルサービス推進部", rate: 64, users: 42, prompts: 8900 },
    ],
  },
  "7d": {
    mau: "82.1%",
    mauDiff: "+2.8% (前週比)",
    totalPrompts: "29.4K",
    promptsDiff: "+12%",
    activeUsers: "1,180",
    totalLicense: "1,500名",
    topDept: "クラウド基盤推進部",
    topRate: "96%",
    departments: [
      { name: "クラウド基盤推進部", rate: 96, users: 74, prompts: 7200 },
      { name: "DX・イノベーション推進部", rate: 93, users: 47, prompts: 5100 },
      { name: "エンタープライズソリューション部", rate: 84, users: 112, prompts: 8600 },
      { name: "基幹システム開発部", rate: 78, users: 66, prompts: 4200 },
      { name: "人事・総務・経営企画部", rate: 69, users: 52, prompts: 2500 },
      { name: "デジタルサービス推進部", rate: 62, users: 40, prompts: 1800 },
    ],
  },
  "90d": {
    mau: "74.8%",
    mauDiff: "+15.2% (前四半期比)",
    totalPrompts: "318.5K",
    promptsDiff: "+42%",
    activeUsers: "1,290",
    totalLicense: "1,500名",
    topDept: "DX推進部",
    topRate: "91%",
    departments: [
      { name: "DX・イノベーション推進部", rate: 91, users: 46, prompts: 54000 },
      { name: "クラウド基盤推進部", rate: 86, users: 69, prompts: 71000 },
      { name: "エンタープライズソリューション部", rate: 79, users: 105, prompts: 89000 },
      { name: "基幹システム開発部", rate: 72, users: 61, prompts: 43000 },
      { name: "人事・総務・経営企画部", rate: 66, users: 50, prompts: 35000 },
      { name: "デジタルサービス推進部", rate: 58, users: 38, prompts: 26500 },
    ],
  },
};

const modelShares = [
  { name: "Gemini 2.5 Flash", share: "54%", tokens: "1.2B tokens", color: "bg-blue-500", desc: "日常質問・コード補完・軽量自動化" },
  { name: "Gemini 2.5 Pro", share: "34%", tokens: "760M tokens", color: "bg-purple-600", desc: "大規模リファクタ・仕様設計・複雑な思考" },
  { name: "Antigravity Subagents", share: "12%", tokens: "270M tokens", color: "bg-emerald-500", desc: "自律並列探索・E2Eテスト検証・障害調査" },
];

export default function GeminiStatsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [searchDept, setSearchDept] = useState("");
  const [customDepts, setCustomDepts] = useState<DeptStat[] | null>(null);

  const currentStats = defaultStatsByPeriod[period];
  const activeDepts = customDepts || currentStats.departments;

  const filteredDepts = activeDepts.filter((d) =>
    d.name.toLowerCase().includes(searchDept.toLowerCase())
  );

  // CSVエクスポート
  const handleExportCsv = () => {
    const headers = "順位,部署名,月間アクティブ率(%),利用人数,プロンプト数\n";
    const rows = filteredDepts
      .map(
        (d, idx) =>
          `${idx + 1},"${d.name}",${d.rate},${d.users},${d.prompts}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mightylink-ai-stats-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // サンプルCSVインポート（デモ用）
  const handleImportSample = () => {
    const mockImported: DeptStat[] = [
      { name: "DXソリューション本部 (実データ反映)", rate: 98, users: 52, prompts: 21500 },
      { name: "クラウドSRE基盤部 (実データ反映)", rate: 95, users: 80, prompts: 28900 },
      { name: "金融・決済システム第一部", rate: 88, users: 115, prompts: 34100 },
      { name: "AI・データエンジニアリング部", rate: 85, users: 70, prompts: 19800 },
      { name: "品質管理・テスト自動化室", rate: 80, users: 58, prompts: 15400 },
    ];
    setCustomDepts(mockImported);
    alert("社内利用ログCSVデータをインポートし、ダッシュボードに反映しました！");
  };

  const handleResetData = () => {
    setCustomDepts(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="利用状況ダッシュボード"
        subtitle="MightyLINK 社内AI / Antigravity の浸透状況・部署別アクティブ率レポート"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* バナー */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-emerald-200/60 text-emerald-800 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-emerald-950 flex items-center space-x-1">
                  <span>💎</span>
                  <span>利用状況ダッシュボード（動的分析版）稼働中</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-semibold text-[10px]">
                  Phase 3 機能稼働
                </span>
              </div>
              <p className="text-emerald-800/90 leading-relaxed">
                期間別の集計切り替え、CSVダウンロード、および社内利用ログのインポートによる動的シミュレーションに対応しています。
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
            {customDepts && (
              <button
                onClick={handleResetData}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                <RefreshCw size={13} />
                <span>標準データに戻す</span>
              </button>
            )}
            <button
              onClick={handleImportSample}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Upload size={13} />
              <span>CSVインポート</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Download size={13} />
              <span>CSVエクスポート</span>
            </button>
          </div>
        </div>

        {/* 期間セレクター */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>集計対象期間の選択:</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setPeriod("7d")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                period === "7d"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              過去7日間
            </button>
            <button
              onClick={() => setPeriod("30d")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                period === "30d"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              過去30日間 (標準)
            </button>
            <button
              onClick={() => setPeriod("90d")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                period === "90d"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              過去90日間 (四半期)
            </button>
          </div>
        </div>

        {/* KPIカード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>全社アクティブ利用率 (MAU)</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900">{currentStats.mau}</span>
              <span className="text-xs text-emerald-600 font-semibold">{currentStats.mauDiff}</span>
            </div>
            <p className="text-[11px] text-slate-400">対象期間内に1回以上プロンプトを実行した割合</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>総プロンプト実行数</span>
              <MessageSquare className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900">{currentStats.totalPrompts}</span>
              <span className="text-xs text-emerald-600 font-semibold">{currentStats.promptsDiff}</span>
            </div>
            <p className="text-[11px] text-slate-400">チャット、コード補完、Subagent実行を含む</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>ライセンス稼働人数</span>
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900">{currentStats.activeUsers}</span>
              <span className="text-xs text-slate-400">/ {currentStats.totalLicense}</span>
            </div>
            <p className="text-[11px] text-slate-400">全社配布枠の 82.6% が定常利用</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>活用トップ部署</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 truncate block">{currentStats.topDept}</span>
              <span className="text-xs text-amber-600 font-bold">利用率 {currentStats.topRate}</span>
            </div>
            <p className="text-[11px] text-slate-400">毎日のコード生成 & テスト自動化を標準化</p>
          </div>
        </div>

        {/* モデル別利用内訳 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              <span>基盤モデル別 トークン消費シェア</span>
            </h3>
            <span className="text-xs text-slate-400">コスト & 処理負荷の内訳</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modelShares.map((m) => (
              <div
                key={m.name}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${m.color}`} />
                    <span className="font-bold text-slate-900 text-xs">{m.name}</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">{m.share}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${m.color}`} style={{ width: m.share }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>消費量: {m.tokens}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 部署別利用率プログレスバー */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>部署別 アクティブ利用率 & 実行ボリューム</span>
            </h3>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="部署名で絞り込み..."
                value={searchDept}
                onChange={(e) => setSearchDept(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {filteredDepts.map((dept, index) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-800 font-semibold flex items-center space-x-2">
                    <span className="w-5 text-slate-400 text-[11px]">{index + 1}.</span>
                    <span>{dept.name}</span>
                  </span>
                  <div className="space-x-3 text-slate-500 text-xs">
                    <span>{dept.users}名利用</span>
                    <span className="text-slate-400">•</span>
                    <span>{dept.prompts.toLocaleString()} プロンプト</span>
                    <span className="font-extrabold text-slate-900 text-sm">{dept.rate}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      dept.rate >= 90
                        ? "bg-emerald-500"
                        : dept.rate >= 80
                        ? "bg-blue-600"
                        : dept.rate >= 70
                        ? "bg-cyan-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${dept.rate}%` }}
                  />
                </div>
              </div>
            ))}

            {filteredDepts.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400">
                該当する部署が見つかりませんでした。
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
