import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import { BarChart3 } from "lucide-react";

// 実データの連携ができるまでは数値を表示しない（架空の統計を載せないため）
const PLANNED = [
  "部門ごとの Gemini 利用回数（最大値・中央値・平均値・人数）",
  "全社の利用人数と、月ごとの推移",
  "表の並べ替え・部門名での絞り込み・CSV ダウンロード",
];

export default function GeminiStatsPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner title="Gemini利用率" subtitle="部門別の Gemini 利用状況（実データの連携を準備中）" />

      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 工事中：実データの連携を準備しています"
          message="社内の利用ログと連携できるまでは、統計の数値は表示しません。"
          prepDetails="社内BigQuery利用ログデータパイプライン接続 & 日次MAU実データ自動集計バッチの稼働"
          releaseDate="2026年11月20日(金)"
        />

        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 space-y-3">
          <BarChart3 className="w-8 h-8 mx-auto text-slate-400" />
          <p className="text-sm font-bold text-slate-700">公開後に表示する予定の内容</p>
          <ul className="text-xs space-y-1">
            {PLANNED.map((item) => (
              <li key={item}>・{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
