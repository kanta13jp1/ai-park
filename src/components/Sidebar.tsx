"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { navigationSections } from "@/data/navigation";
import { ExternalLink, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* モバイル用トグルボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-3 left-3 z-50 p-2 bg-[#3b4856] text-white rounded-md shadow-md focus:outline-none"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* オーバーレイ (モバイル時) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドバー本体 */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-[#3b4856] text-slate-100 flex flex-col transition-transform duration-200 ease-in-out select-none shadow-xl md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* ヘッダー・ロゴ領域 */}
        <div className="pt-6 pb-4 px-6 border-b border-slate-600/40">
          <div className="flex items-center space-x-2 mb-3">
            <div className="bg-slate-900/60 border border-slate-600/50 px-3 py-1.5 rounded-lg shadow-sm flex items-center">
              <Image
                src="/images/mightylink-logo.png"
                alt="MightyLINK"
                width={130}
                height={30}
                className="h-6 w-auto object-contain"
                priority
              />
            </div>
          </div>
          <Link
            href="/"
            className="block text-2xl font-bold tracking-tight text-white hover:text-cyan-200 transition-colors"
          >
            AI Park
          </Link>
        </div>

        {/* ナビゲーションリスト */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-sm">
          {navigationSections.map((section, secIdx) => (
            <div key={secIdx} className="space-y-1">
              {section.title && (
                <div className="px-3 py-1 text-xs font-semibold text-slate-300/80 tracking-wider">
                  {section.title}
                </div>
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
                        className="flex items-center justify-between px-3 py-2 rounded-md text-slate-200 hover:bg-slate-600/50 hover:text-white transition-colors"
                      >
                        <span className="flex items-center space-x-2">
                          {item.icon && <span>{item.icon}</span>}
                          <span>{item.name}</span>
                        </span>
                        <ExternalLink size={14} className="opacity-70" />
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors text-[13.5px] font-medium ${
                        isActive
                          ? "bg-white text-slate-800 font-semibold shadow-sm"
                          : "text-slate-200 hover:bg-slate-600/50 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center space-x-2.5 truncate">
                        {item.icon && (
                          <span className="text-base leading-none">{item.icon}</span>
                        )}
                        <span className="truncate">{item.name}</span>
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-normal shrink-0 ml-1 ${
                            isActive
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-700/80 text-amber-300 border border-amber-400/30"
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
        <div className="p-3 border-t border-slate-600/40 text-xs text-slate-400 text-center">
          © MightyLINK AI CoE
        </div>
      </aside>
    </>
  );
}
