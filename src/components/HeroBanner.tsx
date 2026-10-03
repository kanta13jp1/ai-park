"use client";

import { Search, Sparkles, Command } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { playCyberClick } from "@/lib/sound";

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
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const bannerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // -15px 〜 +15px の範囲でスムーズな視差オフセット
    const deltaX = ((mouseX - centerX) / centerX) * 16;
    const deltaY = ((mouseY - centerY) / centerY) * 12;
    setOffset({ x: deltaX, y: deltaY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={bannerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full overflow-hidden flex items-center justify-center select-none shadow-xl border-b border-slate-800/60 transition-colors duration-500 ${
        isHome ? "h-64 sm:h-72 md:h-80 bg-[#07130e]" : "h-48 sm:h-52 md:h-56 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950"
      }`}
    >
      {isHome ? (
        <>
          {/* 深碧・サイバーオーロラ背景 */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050e0a] via-[#0b1f17] to-[#06120c]" />

          {/* 多層オーロラ・グロー光彩（マウス連動視差） */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[360px] bg-gradient-to-r from-emerald-500/20 via-teal-400/15 to-cyan-500/20 blur-3xl pointer-events-none rounded-full transition-transform duration-300 ease-out"
            style={{
              transform: `translate(calc(-50% + ${offset.x * 0.8}px), calc(-50% + ${offset.y * 0.8}px))`,
            }}
          />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[200px] bg-gradient-to-r from-amber-400/15 via-emerald-400/20 to-sky-400/15 blur-2xl pointer-events-none transition-transform duration-500 ease-out"
            style={{
              transform: `translate(calc(-50% + ${offset.x * -0.5}px), ${offset.y * -0.5}px)`,
            }}
          />

          {/* デジタルAIツリー SVG アートワーク（マウス連動微細パララックス） */}
          <svg
            className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none transition-transform duration-200 ease-out"
            style={{
              transform: `translate(${offset.x * 0.4}px, ${offset.y * 0.4}px) scale(1.02)`,
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 400"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* 樹の幹と主枝（回路パターン） */}
            <g stroke="#34d399" strokeWidth="2.5" fill="none" opacity="0.85">
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
            <g fill="#6ee7b7" opacity="0.95">
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
            <g fill="#10b981" opacity="0.25">
              <circle cx="320" cy="100" r="30" />
              <circle cx="420" cy="80" r="40" />
              <circle cx="520" cy="50" r="45" />
              <circle cx="600" cy="45" r="50" fill="#34d399" opacity="0.3" />
              <circle cx="680" cy="50" r="45" />
              <circle cx="780" cy="80" r="40" />
              <circle cx="880" cy="100" r="30" />
              <circle cx="240" cy="180" r="35" />
              <circle cx="960" cy="180" r="35" />
            </g>
          </svg>

          {/* 微細なスターダスト・グリッド */}
          <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />
        </>
      ) : (
        <>
          {/* 個別ページのダークフューチャリスティック背景 */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />
          <div
            className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${offset.x * 0.5}px, ${offset.y * 0.5}px)`,
            }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${offset.x * -0.5}px, ${offset.y * -0.5}px)`,
            }}
          />
        </>
      )}

      {/* 右上の検索バー/トリガー */}
      <div className="absolute top-4 right-5 z-20">
        <button
          onClick={() => {
            playCyberClick();
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
          }}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-slate-200 hover:text-white transition-all shadow-md group cursor-pointer active:scale-95"
          title="サイト内横断検索 (⌘K)"
        >
          <Search size={14} className="text-cyan-300 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium">Search</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/15 rounded text-slate-300">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 中央タイトル & コンテンツ */}
      <div className="relative z-10 text-center px-4 max-w-4xl space-y-4">
        {isHome && (
          <div className="flex flex-wrap items-center justify-center gap-2 animate-float-slow">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/15 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles size={13} className="text-emerald-400 animate-pulse" />
              <span>MightyLINK Enterprise AI Playground</span>
            </div>
            <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 backdrop-blur-md border border-cyan-400/30 text-cyan-300 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Gemini 3.1 Pro & Google Antigravity</span>
            </div>
          </div>
        )}

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
          {isHome ? (
            <span className="bg-gradient-to-r from-white via-emerald-100 to-cyan-300 bg-clip-text text-transparent">
              {title}
            </span>
          ) : (
            title
          )}
        </h1>

        {subtitle && (
          <p
            className={`text-xs sm:text-sm md:text-base font-normal tracking-wide max-w-2xl mx-auto leading-relaxed ${
              isHome ? "text-emerald-100/90" : "text-slate-300"
            }`}
          >
            {subtitle}
          </p>
        )}

        {isHome && (
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-slate-300 text-xs font-mono">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md">
              <span className="text-cyan-400 font-bold">12</span>
              <span className="text-slate-400 text-[11px]">Academy Lessons</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md">
              <span className="text-emerald-400 font-bold">LIVE</span>
              <span className="text-slate-400 text-[11px]">Issue & Task Sync</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md">
              <span className="text-amber-400 font-bold">CoE</span>
              <span className="text-slate-400 text-[11px]">Weekly Office Hour</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
