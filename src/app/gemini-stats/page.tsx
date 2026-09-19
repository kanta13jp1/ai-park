"use client";

import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Search,
  Users,
  TrendingUp,
  BarChart3,
  Sparkles,
  HelpCircle,
  Calendar,
  Layers,
  Activity,
  Award,
  Filter,
} from "lucide-react";
import { useState, useMemo } from "react";

interface DeptMetric {
  name: string;
  category: "tech" | "business" | "corporate" | "project";
  maxVal: number;
  medianVal: number;
  avgVal: number;
  headcount: number;
}

type SortField = "name" | "maxVal" | "medianVal" | "avgVal" | "headcount";
type SortOrder = "asc" | "desc";

// 月次データ（2026年6月〜9月）
const monthlyData: Record<string, { label: string; periodNote: string; data: DeptMetric[] }> = {
  "2026-09": {
    label: "2026年9月 (最新)",
    periodNote: "※ データ取得は2026年9月、部門名は2026年",
    data: [
      { name: "次世代クラウド基盤プロジェクト", category: "project", maxVal: 2479, medianVal: 111, avgVal: 244, headcount: 113 },
      { name: "AI・イノベーション推進部", category: "tech", maxVal: 2399, medianVal: 309, avgVal: 506, headcount: 26 },
      { name: "デジタルチャネルソリューション部", category: "tech", maxVal: 1785, medianVal: 165, avgVal: 321, headcount: 71 },
      { name: "品質技術・自動化テスト統括部", category: "tech", maxVal: 1115, medianVal: 67, avgVal: 200, headcount: 15 },
      { name: "CXマネジメント・顧客体験部", category: "business", maxVal: 1083, medianVal: 114, avgVal: 201, headcount: 47 },
      { name: "バリュークリエーション推進部", category: "business", maxVal: 1059, medianVal: 92, avgVal: 185, headcount: 74 },
      { name: "経営企画推進部", category: "corporate", maxVal: 1009, medianVal: 247, avgVal: 451, headcount: 4 },
      { name: "プラットフォーム運用システム部", category: "tech", maxVal: 895, medianVal: 61, avgVal: 137, headcount: 78 },
      { name: "セキュリティ・インフラ整備部", category: "tech", maxVal: 890, medianVal: 58, avgVal: 133, headcount: 44 },
      { name: "エンタープライズDX推進プロジェクト", category: "project", maxVal: 868, medianVal: 84, avgVal: 165, headcount: 39 },
      { name: "経営管理統括部", category: "corporate", maxVal: 810, medianVal: 67, avgVal: 169, headcount: 16 },
      { name: "人材・組織戦略部", category: "corporate", maxVal: 693, medianVal: 77, avgVal: 130, headcount: 81 },
      { name: "セキュリティマネジメント統括室", category: "corporate", maxVal: 433, medianVal: 48, avgVal: 116, headcount: 15 },
    ],
  },
  "2026-06": {
    label: "2026年6月 (参考元データ)",
    periodNote: "※ データ取得は2026年6月、部門名は2026年",
    data: [
      { name: "次世代クラウド基盤プロジェクト", category: "project", maxVal: 2479, medianVal: 111, avgVal: 244, headcount: 113 },
      { name: "AI・イノベーション推進部", category: "tech", maxVal: 2399, medianVal: 309, avgVal: 506, headcount: 26 },
      { name: "デジタルチャネルソリューション部", category: "tech", maxVal: 1785, medianVal: 165, avgVal: 321, headcount: 71 },
      { name: "品質技術・自動化テスト統括部", category: "tech", maxVal: 1115, medianVal: 67, avgVal: 200, headcount: 15 },
      { name: "CXマネジメント・顧客体験部", category: "business", maxVal: 1083, medianVal: 114, avgVal: 201, headcount: 47 },
      { name: "バリュークリエーション推進部", category: "business", maxVal: 1059, medianVal: 92, avgVal: 185, headcount: 74 },
      { name: "経営企画推進部", category: "corporate", maxVal: 1009, medianVal: 247, avgVal: 451, headcount: 4 },
      { name: "プラットフォーム運用システム部", category: "tech", maxVal: 895, medianVal: 61, avgVal: 137, headcount: 78 },
      { name: "セキュリティ・インフラ整備部", category: "tech", maxVal: 890, medianVal: 58, avgVal: 133, headcount: 44 },
      { name: "エンタープライズDX推進プロジェクト", category: "project", maxVal: 868, medianVal: 84, avgVal: 165, headcount: 39 },
      { name: "経営管理統括部", category: "corporate", maxVal: 810, medianVal: 67, avgVal: 169, headcount: 16 },
      { name: "人材・組織戦略部", category: "corporate", maxVal: 693, medianVal: 77, avgVal: 130, headcount: 81 },
      { name: "セキュリティマネジメント統括室", category: "corporate", maxVal: 433, medianVal: 48, avgVal: 116, headcount: 15 },
    ],
  },
};

export default function GeminiStatsPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-09");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("maxVal");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const activeDataset = monthlyData[selectedMonth] || monthlyData["2026-09"];

  // ソート処理
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // フィルタリングとソート適用
  const processedData = useMemo(() => {
    return activeDataset.data
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === "string" && typeof valB === "string") {
          return sortOrder === "asc"
            ? valA.localeCompare(valB, "ja")
            : valB.localeCompare(valA, "ja");
        }
        return sortOrder === "asc"
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      });
  }, [activeDataset, searchQuery, sortField, sortOrder]);

  // 全社サマリー集計
  const totalHeadcount = useMemo(
    () => activeDataset.data.reduce((acc, curr) => acc + curr.headcount, 0),
    [activeDataset]
  );
  const overallMax = useMemo(
    () => Math.max(...activeDataset.data.map((d) => d.maxVal)),
    [activeDataset]
  );
  const weightedAvg = useMemo(() => {
    const totalPrompts = activeDataset.data.reduce(
      (acc, curr) => acc + curr.avgVal * curr.headcount,
      0
    );
    return Math.round(totalPrompts / totalHeadcount);
  }, [activeDataset, totalHeadcount]);

  const medianOfMedians = useMemo(() => {
    const sortedMedians = [...activeDataset.data.map((d) => d.medianVal)].sort(
      (a, b) => a - b
    );
    const mid = Math.floor(sortedMedians.length / 2);
    return sortedMedians.length % 2 !== 0
      ? sortedMedians[mid]
      : Math.round((sortedMedians[mid - 1] + sortedMedians[mid]) / 2);
  }, [activeDataset]);

  // CSVダウンロード
  const handleExportCsv = () => {
    const headers = "部門,# 最大値,# 中央値,# 平均値,# 人数\n";
    const rows = processedData
      .map(
        (d) =>
          `"${d.name}",${d.maxVal},${d.medianVal},${d.avgVal},${d.headcount}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mightylink-gemini-usage-${selectedMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-40 inline-block ml-1" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-cyan-300 inline-block ml-1" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-cyan-300 inline-block ml-1" />
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* 参考サイト風 グレー・テクスチャ調 ヘッダー */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white py-14 px-6 border-b border-slate-700 shadow-inner">
        {/* 背景テクスチャ */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-600 text-slate-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>MightyLINK 社内AI / Antigravity 利用統計</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-wider drop-shadow-md text-white">
            Gemini利用率
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto pt-1 font-medium">
            部門別 Gemini / LLM利用回数の統計分布（最大値・中央値・平均値・対象人数）
          </p>
        </div>
      </div>

      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        {/* 工事中アラート（品質ゲート準拠） */}
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 工事中・サンプルシミュレーション表示中"
          message="現在表示されている部門別Gemini利用統計データはサンプル・シミュレーション値です。社内BigQuery監査ログパイプラインとの実データ連携を準備中です。"
          prepDetails="社内BigQuery利用ログデータパイプライン接続 & 日次MAU実データ自動集計バッチの稼働フェーズ"
          releaseDate="2026年11月20日(金)"
        />

        {/* 全社サマリーメトリクス */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>集計対象総人数</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl md:text-3xl font-black text-slate-900">
              {totalHeadcount.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-1">名</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">全13部門・プロジェクト合計</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>全社加重平均利用回数</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl md:text-3xl font-black text-slate-900">
              {weightedAvg.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-1">回/月</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">1人あたりの月間平均実行数</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>全社中央値 (代表水準)</span>
              <BarChart3 className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-2 text-2xl md:text-3xl font-black text-slate-900">
              {medianOfMedians.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-1">回/月</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">極端な偏りを除いた実態値</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>個人最高利用回数</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl md:text-3xl font-black text-slate-900">
              {overallMax.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-1">回</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">最高アクティブユーザー実績</p>
          </div>
        </div>

        {/* コントロールバー（月選択 & 検索 & CSV） */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>対象月:</span>
            </div>
            <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs">
              <button
                onClick={() => setSelectedMonth("2026-09")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  selectedMonth === "2026-09"
                    ? "bg-white text-indigo-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                2026年9月 (最新)
              </button>
              <button
                onClick={() => setSelectedMonth("2026-06")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  selectedMonth === "2026-06"
                    ? "bg-white text-indigo-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                2026年6月 (基準月)
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="部門名で絞り込み..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
              title="CSV形式でダウンロード"
            >
              <Download size={13} />
              <span>CSV出力</span>
            </button>
          </div>
        </div>

        {/* 参考サイト完全再現：部門別 Gemini利用状況 テーブル */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {/* テーブル上部タイトル & 注記（参考サイト準拠） */}
          <div className="p-5 border-b border-slate-200 space-y-1 bg-white">
            <div className="text-xs font-bold text-slate-500 tracking-wide">
              Gemini利用回数({selectedMonth.replace("-", ".")})
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              部門別 Gemini利用状況
            </h2>
            <p className="text-xs font-bold text-rose-600">
              {activeDataset.periodNote}
            </p>
          </div>

          {/* 統計テーブル */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* 濃紺ヘッダー（参考サイト準拠） */}
              <thead>
                <tr className="bg-[#2A3B80] text-white text-xs font-bold uppercase tracking-wider select-none">
                  <th
                    onClick={() => handleSort("name")}
                    className="py-3 px-4 sm:px-6 cursor-pointer hover:bg-[#23316c] transition-colors"
                  >
                    部門
                    {renderSortIcon("name")}
                  </th>
                  <th
                    onClick={() => handleSort("maxVal")}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-[#23316c] transition-colors"
                  >
                    # 最大値
                    {renderSortIcon("maxVal")}
                  </th>
                  <th
                    onClick={() => handleSort("medianVal")}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-[#23316c] transition-colors"
                  >
                    # 中央値
                    {renderSortIcon("medianVal")}
                  </th>
                  <th
                    onClick={() => handleSort("avgVal")}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-[#23316c] transition-colors"
                  >
                    # 平均値
                    {renderSortIcon("avgVal")}
                  </th>
                  <th
                    onClick={() => handleSort("headcount")}
                    className="py-3 px-4 sm:px-6 text-right cursor-pointer hover:bg-[#23316c] transition-colors"
                  >
                    # 人数
                    {renderSortIcon("headcount")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                {processedData.map((item, idx) => (
                  <tr
                    key={item.name}
                    className={`transition-colors hover:bg-indigo-50/50 ${
                      idx % 2 === 1 ? "bg-slate-50/60" : "bg-white"
                    }`}
                  >
                    {/* 部門名 */}
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-900 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span>{item.name}</span>
                        {item.maxVal >= 2000 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            ★ ヘビー活用
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 最大値 */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                      {item.maxVal.toLocaleString()}
                    </td>

                    {/* 中央値 */}
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-700">
                      {item.medianVal.toLocaleString()}
                    </td>

                    {/* 平均値 */}
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-700">
                      {item.avgVal.toLocaleString()}
                    </td>

                    {/* 人数 */}
                    <td className="py-3 px-4 sm:px-6 text-right font-mono font-semibold text-slate-600">
                      {item.headcount.toLocaleString()}
                    </td>
                  </tr>
                ))}

                {processedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-slate-400 text-xs"
                    >
                      該当する部門が見つかりませんでした。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* テーブル下部 読み取りガイド・インサイト */}
          <div className="p-4 bg-slate-50/70 border-t border-slate-200 text-[11px] text-slate-600 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-bold text-slate-800">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>メトリクスの見方と分析ポイント:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-500 pl-1">
              <li>
                <strong className="text-slate-700">最大値と中央値の乖離:</strong> 中央値が低く最大値が突出している部門は一部のスーパーユーザーによる牽引型、中央値が高い部門（例: AI・イノベーション推進部 中央値309）は部内全員が日常業務に定着していることを示します。
              </li>
              <li>
                <strong className="text-slate-700">プロジェクトチームの活用度:</strong> 「次世代クラウド基盤プロジェクト」のように多人数（113名）で最大値2,479を記録している組織は、コード生成やインフラ構成自動化などチーム開発標準に組み込まれています。
              </li>
            </ul>
          </div>
        </section>

        {/* 基盤モデル別トークン内訳 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>基盤モデル別 トークン消費シェア</span>
            </h3>
            <span className="text-xs text-slate-400">コスト & 処理負荷の内訳</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-bold text-slate-900 text-xs">Gemini 2.5 Flash</span>
                </div>
                <span className="text-sm font-extrabold text-slate-900">54%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "54%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>消費量: 1.2B tokens</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                日常質問・コードインライン補完・軽量データ整形
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-purple-600" />
                  <span className="font-bold text-slate-900 text-xs">Gemini 2.5 Pro</span>
                </div>
                <span className="text-sm font-extrabold text-slate-900">34%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600" style={{ width: "34%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>消費量: 760M tokens</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                大規模リファクタ・仕様設計・複雑な長文要約
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-900 text-xs">Antigravity Subagents</span>
                </div>
                <span className="text-sm font-extrabold text-slate-900">12%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "12%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>消費量: 270M tokens</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                自律並列探索・E2Eテスト検証・障害根本原因調査
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
