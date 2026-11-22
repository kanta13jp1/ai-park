"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function GlobalSegmentError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Route rendering error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-6 py-12 bg-slate-50/80 bg-grid-pattern">
      <div className="max-w-md w-full bg-white border border-rose-200 rounded-3xl shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600 shadow-sm">
          <AlertTriangle className="w-8 h-8" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            RUNTIME ERROR
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            画面の表示中にエラーが発生しました
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            一時的な読み込み失敗またはブラウザ状態の影響の可能性があります。再試行するか、ポータルトップへお戻りください。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => retry()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span>再試行する</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
          >
            <Home size={15} aria-hidden="true" />
            <span>ポータルトップへ戻る</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
