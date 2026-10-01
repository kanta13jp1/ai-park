"use client";

import Link from "next/link";
import { Sparkles, ExternalLink, ShieldCheck, Heart, Terminal, Compass, BookOpen, Layers } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#070b14] border-t border-slate-800/80 text-slate-400 select-none relative z-20">
      {/* 上部微細アンビエントライン */}
      <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500/20 via-cyan-500/40 to-indigo-500/20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ブランド情報 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles size={16} />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                AI Park
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              みんなでつくるAI広場。<br />
              MightyLINK × Google Antigravity による次世代エンタープライズAI協創ポータル。
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Gemini 3.1 Pro & Antigravity 2.0 Ready</span>
            </div>
          </div>

          {/* ナビゲーション 1: 学び・導入 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono flex items-center space-x-1.5">
              <BookOpen size={13} className="text-cyan-400" />
              <span>学び・導入</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/academy" className="hover:text-cyan-300 transition-colors">
                  Antigravity Academy (全12レッスン)
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-cyan-300 transition-colors">
                  Antigravity 導入ガイド
                </Link>
              </li>
              <li>
                <Link href="/learning" className="hover:text-cyan-300 transition-colors">
                  初心者向けチートシート
                </Link>
              </li>
              <li>
                <Link href="/how-to" className="hover:text-cyan-300 transition-colors">
                  使い方・学び 総合ハブ
                </Link>
              </li>
            </ul>
          </div>

          {/* ナビゲーション 2: 共創・コミュニティ */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono flex items-center space-x-1.5">
              <Layers size={13} className="text-indigo-400" />
              <span>共創・コミュニティ</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/ai-projects" className="hover:text-cyan-300 transition-colors">
                  社内AIプロジェクト一覧
                </Link>
              </li>
              <li>
                <Link href="/idea-board" className="hover:text-cyan-300 transition-colors">
                  アイデア宣言ボード
                </Link>
              </li>
              <li>
                <Link href="/feedback-todo" className="hover:text-cyan-300 transition-colors">
                  ご意見・改善ToDoボード
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-cyan-300 transition-colors">
                  AI Park カレンダー
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-cyan-300 transition-colors">
                  開発ロードマップ
                </Link>
              </li>
            </ul>
          </div>

          {/* ガバナンス・サポート */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono flex items-center space-x-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>ガバナンス・窓口</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tools-hub" className="hover:text-cyan-300 transition-colors">
                  AIセキュリティ基準 (Level 1〜3)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-300 transition-colors">
                  AI推進担当（担当：梅澤）相談窓口
                </Link>
              </li>
              <li>
                <a
                  href="https://antigravity.google/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 hover:text-cyan-300 transition-colors"
                >
                  <span>Google Antigravity 公式Doc</span>
                  <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライトとクレジット */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© 2026 MightyLINK Co., Ltd. Internal AI Promotion Office.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span>Crafted for Enterprise Innovation</span>
              <Heart size={12} className="text-rose-500 fill-rose-500 inline" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
