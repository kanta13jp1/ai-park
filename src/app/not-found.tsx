"use client";

import Link from "next/link";
import TiltCard from "@/components/TiltCard";
import SpotlightCard from "@/components/SpotlightCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-6 py-12 bg-slate-50/80 bg-grid-pattern">
      <div className="max-w-md w-full">
        <TiltCard maxTilt={6} glareOpacity={0.12} className="rounded-3xl">
          <SpotlightCard
            spotlightColor="rgba(99, 102, 241, 0.18)"
            className="bg-white border-slate-200/90 rounded-3xl shadow-xl overflow-hidden p-8 text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 shadow-sm">
              <Compass className="w-8 h-8 animate-spin-slow" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
                404 PAGE NOT FOUND
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                ページが見つかりません
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                お探しのページは移動したか、URLが変更された可能性があります。ポータルトップから目的のコンテンツをお探しください。
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                onClick={() => playCyberClick()}
                onMouseEnter={() => playCyberHover()}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Home size={15} />
                <span>ポータルトップへ戻る</span>
              </Link>
            </div>
          </SpotlightCard>
        </TiltCard>
      </div>
    </div>
  );
}
