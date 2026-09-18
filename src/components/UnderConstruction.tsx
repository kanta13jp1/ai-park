"use client";

import { Construction, AlertCircle } from "lucide-react";

interface UnderConstructionBannerProps {
  message?: string;
  submessage?: string;
}

export function UnderConstructionBanner({
  message = "このページは現在開発・準備中です",
  submessage = "表示されている数値やコンテンツはサンプル（モックデータ）です。今後のアップデートで社内本番システムと連携予定です。",
}: UnderConstructionBannerProps) {
  return (
    <div className="bg-amber-50/90 border border-amber-300/80 rounded-xl p-4 shadow-xs flex items-start space-x-3 text-amber-900 animate-in fade-in duration-200">
      <div className="p-2 bg-amber-200/60 text-amber-800 rounded-lg shrink-0 mt-0.5">
        <Construction className="w-5 h-5 animate-pulse" />
      </div>
      <div className="space-y-0.5 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm text-amber-950 flex items-center space-x-1">
            <span>🚧</span>
            <span>{message}</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-semibold text-[10px]">
            工事中 / モック表示
          </span>
        </div>
        <p className="text-amber-800/90 leading-relaxed">{submessage}</p>
      </div>
    </div>
  );
}

export function UnderConstructionBadge({ label = "準備中" }: { label?: string }) {
  return (
    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
      <span>🚧</span>
      <span>{label}</span>
    </span>
  );
}
