"use client";

import { Search, Sparkles } from "lucide-react";
import { useState } from "react";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  isHome?: boolean;
}

export default function HeroBanner({
  title,
  subtitle = "みんなでつくるAI広場",
  isHome = false,
}: HeroBannerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden flex items-center justify-center select-none shadow-md ${
        isHome ? "h-56 md:h-64 bg-[#142823]" : "h-44 md:h-48 bg-[#1f2937]"
      }`}
    >
      {isHome ? (
        <>
          {/* デジタルAIツリー（知恵の樹）の背景グラデーション & アートワーク */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e1e1a] via-[#1a382e] to-[#12241e]" />

          {/* グロー光彩エフェクト */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] bg-radial from-emerald-500/25 via-cyan-500/15 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[180px] bg-radial from-amber-400/20 via-emerald-600/10 to-transparent blur-2xl pointer-events-none" />

          {/* デジタルAIツリー SVG アートワーク */}
          <svg
            className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 400"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* 樹の幹と主枝（回路パターン） */}
            <g stroke="#34d399" strokeWidth="2.5" fill="none" opacity="0.8">
              {/* 幹 */}
              <path d="M 600 400 L 600 240 M 590 400 L 590 260 M 610 400 L 610 260" stroke="#10b981" strokeWidth="3" />
              {/* 主枝・左 */}
              <path d="M 600 240 Q 520 180 430 150 Q 360 130 280 140" />
              <path d="M 590 260 Q 480 230 400 220 Q 320 210 220 260" />
              <path d="M 430 150 Q 400 90 350 70" />
              <path d="M 520 180 Q 490 120 460 80" />
              {/* 主枝・右 */}
              <path d="M 600 240 Q 680 180 770 150 Q 840 130 920 140" />
              <path d="M 610 260 Q 720 230 800 220 Q 880 210 980 260" />
              <path d="M 770 150 Q 800 90 850 70" />
              <path d="M 680 180 Q 710 120 740 80" />
              {/* 中央上部 */}
              <path d="M 600 240 Q 580 160 560 100 Q 550 60 530 40" />
              <path d="M 600 240 Q 620 160 640 100 Q 650 60 670 40" />
              <path d="M 600 200 L 600 60" />
            </g>

            {/* 回路ノード（接続ポイント） */}
            <g fill="#6ee7b7" opacity="0.9">
              <circle cx="280" cy="140" r="5" fill="#fbbf24" />
              <circle cx="220" cy="260" r="4.5" fill="#38bdf8" />
              <circle cx="350" cy="70" r="5" fill="#34d399" />
              <circle cx="460" cy="80" r="4" fill="#a7f3d0" />
              <circle cx="530" cy="40" r="6" fill="#fbbf24" />
              <circle cx="600" cy="60" r="7" fill="#fef08a" />
              <circle cx="670" cy="40" r="6" fill="#fbbf24" />
              <circle cx="740" cy="80" r="4" fill="#a7f3d0" />
              <circle cx="850" cy="70" r="5" fill="#34d399" />
              <circle cx="920" cy="140" r="5" fill="#fbbf24" />
              <circle cx="980" cy="260" r="4.5" fill="#38bdf8" />
              <circle cx="600" cy="240" r="7" fill="#67e8f9" />
            </g>

            {/* デジタルリーフ（木の葉）のクラスター */}
            <g fill="#10b981" opacity="0.35">
              <circle cx="320" cy="100" r="30" />
              <circle cx="420" cy="80" r="40" />
              <circle cx="520" cy="50" r="45" />
              <circle cx="600" cy="45" r="50" fill="#34d399" opacity="0.4" />
              <circle cx="680" cy="50" r="45" />
              <circle cx="780" cy="80" r="40" />
              <circle cx="880" cy="100" r="30" />
              <circle cx="240" cy="180" r="35" />
              <circle cx="960" cy="180" r="35" />
            </g>
          </svg>

          {/* 自然光・ホタル風パーティクル */}
          <div className="absolute inset-0 bg-[radial-gradient(#6ee7b7_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />
        </>
      ) : (
        <>
          {/* 個別ページのモダンダーク背景 */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-[#3b4856]" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
        </>
      )}

      {/* 右上の検索バー/アイコン */}
      <div className="absolute top-4 right-5 z-20">
        {isSearching ? (
          <div className="relative flex items-center animate-in fade-in zoom-in-95 duration-150">
            <input
              type="text"
              autoFocus
              placeholder="サイト内を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => !searchQuery && setIsSearching(false)}
              className="bg-black/60 text-white placeholder-slate-300 text-xs px-3 py-1.5 pr-8 rounded-full border border-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-400 w-52 transition-all shadow-md"
            />
            <Search className="w-3.5 h-3.5 text-slate-300 absolute right-2.5 pointer-events-none" />
          </div>
        ) : (
          <button
            onClick={() => setIsSearching(true)}
            className="p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors"
            title="サイト内検索"
          >
            <Search size={20} />
          </button>
        )}
      </div>

      {/* 中央タイトル */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-wide drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p
            className={`mt-2.5 text-xs md:text-sm font-medium tracking-wide drop-shadow ${
              isHome ? "text-emerald-200/95 font-semibold text-sm md:text-base" : "text-slate-300"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
