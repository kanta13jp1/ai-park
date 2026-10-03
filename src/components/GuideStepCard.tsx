import { basePath } from "@/lib/basePath";
import { ImageIcon, ExternalLink, ZoomIn, Sparkles, CheckCircle2 } from "lucide-react";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";

// 導入ガイドの手順カード（左：手順、右：画面キャプチャ）
export interface GuideStep {
  id: string;
  title: string;
  who?: string;
  path?: string; // 画面の開き方（メニューのたどり方）
  link?: { label: string; href: string };
  actions: string[];
  note?: string;
  image?: string | string[]; // 複数指定すると縦に並べて表示
  imageAlt: string;
}

export default function StepCard({ step }: { step: GuideStep }) {
  return (
    <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-3xl">
      <div
        onMouseEnter={() => playCyberHover()}
        className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-2 gap-6 relative overflow-hidden group h-full cursor-default"
      >
        {/* 左サイド：手順解説 */}
      <div className="space-y-4 flex flex-col justify-between">
        <div className="space-y-3.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-slate-900 text-white tracking-wider shadow-xs">
              {step.id}
            </span>
            <h4 className="font-extrabold text-slate-900 text-base leading-snug tracking-tight">
              {step.title}
            </h4>
            {step.who && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 font-bold">
                担当：{step.who}
              </span>
            )}
          </div>

          {step.path && (
            <div className="text-xs text-slate-600 bg-slate-50/80 border border-slate-200/80 rounded-xl px-3.5 py-2.5 font-mono">
              <span className="font-bold text-slate-900 mr-1.5 font-sans">画面パス:</span>
              <span className="text-indigo-600">{step.path}</span>
            </div>
          )}

          <ol className="space-y-2 text-xs text-slate-700 leading-relaxed font-normal">
            {step.actions.map((a, idx) => (
              <li key={a} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-mono border border-slate-200">
                  {idx + 1}
                </span>
                <span className="flex-1">{a}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-2.5 pt-2">
          {step.link && (
            <a
              href={step.link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playCyberClick()}
              onMouseEnter={() => playCyberHover()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all w-fit shadow-2xs cursor-pointer active:scale-95"
            >
              <span>{step.link.label}</span>
              <ExternalLink size={12} />
            </a>
          )}

          {step.note && (
            <div className="text-xs text-amber-950 bg-amber-500/10 border border-amber-300/70 rounded-2xl p-3.5 leading-relaxed">
              <span className="font-bold text-amber-900 mr-1">💡 注意:</span>
              {step.note}
            </div>
          )}
        </div>
      </div>

      {/* 右サイド：画面キャプチャ */}
      <div className="flex flex-col justify-center">
        {step.image ? (
          <div className="space-y-3">
            {[step.image].flat().map((file) => (
              <a
                key={file}
                href={`${basePath}/images/guide/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playCyberClick()}
                onMouseEnter={() => playCyberHover()}
                className="relative block rounded-2xl overflow-hidden border border-slate-200 shadow-2xs group/img hover:border-indigo-400 transition-all cursor-zoom-in active:scale-98"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}/images/guide/${file}`}
                  alt={step.imageAlt}
                  className="w-full object-cover transition-transform duration-300 group-hover/img:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <ZoomIn size={14} className="text-cyan-300" />
                    <span>拡大して確認</span>
                  </div>
                </div>
              </a>
            ))}
            <span className="block text-[11px] text-slate-400 text-right">クリックで原寸大表示</span>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-slate-200/90 bg-slate-50/60 flex flex-col items-center justify-center text-center p-8 min-h-48 text-slate-400 space-y-2">
            <ImageIcon size={32} className="text-slate-300" />
            <span className="text-xs font-bold text-slate-500">画面キャプチャ準備中</span>
            <span className="text-[11px] text-slate-400 max-w-xs leading-normal">{step.imageAlt}</span>
          </div>
        )}
        </div>
      </div>
    </TiltCard>
  );
}
