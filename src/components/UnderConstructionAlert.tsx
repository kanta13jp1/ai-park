import { AlertTriangle, Hammer, RefreshCw } from "lucide-react";

interface UnderConstructionAlertProps {
  title?: string;
  message: string;
  statusType?: "construction" | "poc" | "draft";
  prepDetails?: string;
}

export default function UnderConstructionAlert({
  title,
  message,
  statusType = "construction",
  prepDetails,
}: UnderConstructionAlertProps) {
  let badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/30";
  let borderColor = "border-amber-500/40";
  let bgGradient = "from-amber-950/70 via-slate-900 to-slate-900";
  let icon = <Hammer className="text-amber-400" size={18} />;
  let defaultTitle = "🚧 工事中・サンプルデータ表示中";

  if (statusType === "poc") {
    badgeColor = "bg-purple-500/20 text-purple-300 border-purple-500/30";
    borderColor = "border-purple-500/40";
    bgGradient = "from-purple-950/70 via-slate-900 to-slate-900";
    icon = <AlertTriangle className="text-purple-400" size={18} />;
    defaultTitle = "🧪 PoC検証中・シミュレーション表示";
  } else if (statusType === "draft") {
    badgeColor = "bg-sky-500/20 text-sky-300 border-sky-500/30";
    borderColor = "border-sky-500/40";
    bgGradient = "from-sky-950/70 via-slate-900 to-slate-900";
    icon = <RefreshCw className="text-sky-400" size={18} />;
    defaultTitle = "📋 準備中・ドラフト掲載";
  }

  return (
    <div
      className={`rounded-2xl border ${borderColor} bg-gradient-to-r ${bgGradient} text-slate-200 p-4 sm:p-5 shadow-sm space-y-2`}
    >
      <div className="flex items-center space-x-2.5">
        <div className="p-1.5 rounded-lg bg-white/10 border border-white/15">
          {icon}
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}
        >
          {title || defaultTitle}
        </span>
      </div>
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
        {message}
      </p>
      {prepDetails && (
        <p className="text-[11px] text-slate-400 font-mono bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
          🔍 社内連携ステータス: {prepDetails}
        </p>
      )}
    </div>
  );
}
