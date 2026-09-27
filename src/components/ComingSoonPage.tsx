import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import { Hammer } from "lucide-react";

// 実際の情報がそろうまで、架空の内容を載せずに「工事中」だけを表示するページの共通レイアウト
interface ComingSoonPageProps {
  title: string;
  subtitle: string;
  message: string;
  planned: string[];
  links?: { href: string; label: string }[];
  children?: React.ReactNode;
}

export default function ComingSoonPage({ title, subtitle, message, planned, links = [], children }: ComingSoonPageProps) {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner title={title} subtitle={subtitle} />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionAlert statusType="construction" title="🚧 工事中：内容を準備しています" message={message} />

        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-slate-500 space-y-3">
          <Hammer className="w-7 h-7 mx-auto text-slate-400" />
          <p className="text-sm font-bold text-slate-700 text-center">公開後に載せる予定の内容</p>
          <ul className="text-xs space-y-1 max-w-xl mx-auto list-disc pl-5">
            {planned.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {links.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <p className="text-xs font-bold text-slate-700">いま使えるページ</p>
            <div className="flex flex-wrap gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
