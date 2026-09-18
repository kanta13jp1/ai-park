"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
}

export default function HeroBanner({
  title,
  subtitle,
}: HeroBannerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="relative w-full h-44 md:h-52 bg-[#342e29] overflow-hidden flex items-center justify-center shadow-inner select-none">
      {/* 奥行き感のある光彩とダークグラデーションの背景 */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#231e1b] via-[#4d3d31] to-[#25201d]" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-radial from-amber-600/25 via-amber-800/10 to-transparent blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

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
              className="bg-black/60 text-white placeholder-slate-300 text-xs px-3 py-1.5 pr-8 rounded-full border border-white/30 focus:outline-none focus:ring-1 focus:ring-amber-400 w-52 transition-all shadow-md"
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
      <div className="relative z-10 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wider drop-shadow-md">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-xs md:text-sm text-amber-200/90 font-medium tracking-wide drop-shadow">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
