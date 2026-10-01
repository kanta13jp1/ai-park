"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { navigationSections } from "@/data/navigation";
import { ExternalLink, Menu, X, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { basePath } from "@/lib/basePath";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* モバイル用トグルボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-3 left-3 z-50 p-2.5 bg-slate-900/90 text-white rounded-xl shadow-lg border border-slate-700/60 backdrop-blur-md focus:outline-none active:scale-95 transition-transform"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* オーバーレイ (モバイル時) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドバー本体 */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-72 bg-gradient-to-b from-[#0a0f1d] via-[#0d1527] to-[#070a12] text-slate-100 flex flex-col transition-all duration-300 ease-in-out select-none shadow-2xl border-r border-slate-800/80 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* 背景の微細なアンビエント光彩 */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent pointer-events-none" />

        {/* ヘッダー・ロゴ領域 */}
        <div className="relative pt-6 pb-4 px-5 border-b border-slate-800/70 space-y-3 z-10">
          <div className="flex items-center justify-between">
            <div className="bg-slate-900/90 border border-slate-700/60 px-3 py-1.5 rounded-xl shadow-inner flex items-center backdrop-blur-md">
              <Image
                src={`${basePath}/images/mightylink-logo.png`}
                alt="MightyLINK"
                width={120}
                height={26}
                className="h-5 w-auto object-contain brightness-110"
                priority
              />
            </div>
            {/* リアルタイム稼働ステータス */}
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="group flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="block text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent group-hover:text-cyan-200 transition-colors">
                AI Park
              </span>
              <span className="block text-[10px] text-slate-400 font-mono tracking-wider -mt-0.5">
                INTERNAL AI PORTAL
              </span>
            </div>
          </Link>

          {/* クイック検索ボタン（Cmd+K誘導） */}
          <button
            onClick={() => {
              setIsOpen(false);
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/50 text-slate-400 hover:text-slate-200 transition-all text-xs group cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Search size={13} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>サイト内を横断検索...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-800 text-slate-400 border border-slate-700 rounded shadow-xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* ナビゲーションリスト */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 text-sm z-10">
          {navigationSections.map((section, secIdx) => (
            <div key={secIdx} className="space-y-1">
              {section.title && (
                section.href ? (
                  <Link
                    href={section.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-md transition-colors ${
                      pathname === section.href || pathname.startsWith(section.href + "/")
                        ? "text-cyan-300 bg-cyan-950/40"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                    }`}
                  >
                    {section.title}
                  </Link>
                ) : (
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400/80 tracking-wider uppercase">
                    {section.title}
                  </div>
                )
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));

                  if (item.isExternal) {
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-xs"
                      >
                        <span className="flex items-center space-x-2.5">
                          {item.icon && <span className="text-sm leading-none opacity-80 group-hover:opacity-100">{item.icon}</span>}
                          <span>{item.name}</span>
                        </span>
                        <ExternalLink size={13} className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0 ml-1.5" />
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`group relative flex items-center justify-between px-3 py-2 rounded-xl transition-all text-xs font-medium ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-transparent text-white font-bold border border-blue-500/30 shadow-xs"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {/* アクティブ時の左側光彩バー */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                      )}

                      <span className="flex items-center space-x-2.5">
                        {item.icon && (
                          <span className="text-sm leading-none opacity-90 group-hover:scale-110 transition-transform shrink-0">
                            {item.icon}
                          </span>
                        )}
                        <span className="leading-snug">{item.name}</span>
                      </span>

                      {item.badge && (
                        <span
                          className={`text-[9.5px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-1.5 transition-colors whitespace-nowrap ${
                            isActive
                              ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40"
                              : "bg-slate-800/80 text-slate-300 border border-slate-700/50 group-hover:border-slate-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* フッター情報 */}
        <div className="p-3.5 border-t border-slate-800/70 bg-slate-950/40 text-[11px] text-slate-400 flex flex-col items-center justify-center space-y-1 text-center z-10">
          <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
            <span>© MightyLINK AI推進窓口</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Platform v1.2 • Gemini 3.1 Pro Ready
          </span>
        </div>
      </aside>
    </>
  );
}
