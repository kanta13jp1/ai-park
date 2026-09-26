import { basePath } from "@/lib/basePath";
import { ImageIcon, ExternalLink } from "lucide-react";

// 導入ガイドの手順カード（左：手順、右：画面キャプチャ）。
// 画面キャプチャは public/images/guide/ に置き、image にファイル名を指定する（未指定の間は枠のみ表示）

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
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-900 text-white">{step.id}</span>
          <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
          {step.who && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              作業する人：{step.who}
            </span>
          )}
        </div>
        {step.path && (
          <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <span className="font-bold text-slate-700">開き方：</span>
            {step.path}
          </p>
        )}
        <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
          {step.actions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ol>
        {step.link && (
          <a
            href={step.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
          >
            {step.link.label}
            <ExternalLink size={11} />
          </a>
        )}
        {step.note && (
          <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed">
            {step.note}
          </p>
        )}
      </div>
      {step.image ? (
        <div className="space-y-3">
          {[step.image].flat().map((file) => (
            <a key={file} href={`${basePath}/images/guide/${file}`} target="_blank" rel="noopener noreferrer" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}/images/guide/${file}`}
                alt={step.imageAlt}
                className="w-full rounded-lg border border-slate-200 shadow-xs"
              />
            </a>
          ))}
          <span className="block text-[11px] text-slate-400">画像をクリックで拡大</span>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center p-6 min-h-40 text-slate-400">
          <ImageIcon size={28} />
          <span className="text-xs font-semibold mt-2">画面キャプチャ準備中</span>
          <span className="text-[11px] mt-0.5">{step.imageAlt}</span>
        </div>
      )}
    </div>
  );
}
