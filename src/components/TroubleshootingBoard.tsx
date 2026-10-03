"use client";

import { useState, useMemo } from "react";
import {
  troubleshootingCommands,
  type TroubleshootingCommand,
} from "@/data/troubleshooting-commands";
import { playCyberClick, playCyberSuccess, playCyberHover } from "@/lib/sound";
import TiltCard from "@/components/TiltCard";
import {
  Search,
  Terminal,
  Copy,
  Check,
  AlertTriangle,
  Flame,
  Filter,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  HelpCircle,
  X,
} from "lucide-react";

export default function TroubleshootingBoard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "すべて" },
    { id: "powershell", label: "PowerShell" },
    { id: "gcp", label: "GCP / gcloud" },
    { id: "node", label: "Node.js / メモリ" },
    { id: "network", label: "ポート競合" },
    { id: "git", label: "Git / 改行コード" },
  ];

  const filteredItems = useMemo(() => {
    return troubleshootingCommands.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.errorTitle.toLowerCase().includes(q);
        const matchPattern = item.errorPattern.toLowerCase().includes(q);
        const matchCause = item.cause.toLowerCase().includes(q);
        const matchCmd = item.solutionCommand.toLowerCase().includes(q);
        const matchExp = item.explanation.toLowerCase().includes(q);
        return matchTitle || matchPattern || matchCause || matchCmd || matchExp;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = (cmd: TroubleshootingCommand) => {
    playCyberSuccess();
    navigator.clipboard?.writeText(cmd.solutionCommand).then(() => {
      setCopiedId(cmd.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  return (
    <div className="space-y-6" id="troubleshooting-board">
      {/* ツールバー */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* 検索入力欄 */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="エラー文、コマンド、キーワードで検索..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 self-end sm:self-auto">
            <span>該当:</span>
            <strong className="text-indigo-600 text-sm">{filteredItems.length}</strong>
            <span>/ {troubleshootingCommands.length} 件</span>
          </div>
        </div>

        {/* カテゴリタブ */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat.id === "all"
                ? troubleshootingCommands.length
                : troubleshootingCommands.filter((c) => c.category === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  playCyberClick();
                  setSelectedCategory(cat.id);
                }}
                onMouseEnter={playCyberHover}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? "bg-indigo-700 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* コマンドカード一覧 */}
      <div className="grid grid-cols-1 gap-4">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            該当するエラー解決コマンドが見つかりませんでした。別のキーワードでお試しください。
          </div>
        ) : (
          filteredItems.map((item) => (
            <TiltCard
              key={item.id}
              maxTilt={2}
              glareOpacity={0.04}
              className="rounded-2xl"
            >
              <div
                onMouseEnter={playCyberHover}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4 hover:border-indigo-300 transition-colors"
              >
                {/* ヘッダー情報 */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        {item.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                        {item.categoryLabel}
                      </span>
                      {item.frequency === "高" && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/60 text-[10px] font-bold flex items-center gap-1">
                          <Flame size={11} className="text-rose-500" />
                          頻出エラー
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                      {item.errorTitle}
                    </h4>
                  </div>
                </div>

                {/* エラー症状と原因 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
                    <span className="font-bold text-rose-900 flex items-center gap-1 text-[11px]">
                      <AlertTriangle size={13} className="text-rose-600" />
                      発生するエラー症状・メッセージ
                    </span>
                    <p className="font-mono text-rose-800 text-[11px] break-all">
                      {item.errorPattern}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                    <span className="font-bold text-slate-700 text-[11px] flex items-center gap-1">
                      <HelpCircle size={13} className="text-slate-500" />
                      主な発生原因
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {item.cause}
                    </p>
                  </div>
                </div>

                {/* 解決コマンドボックス */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Terminal size={13} className="text-cyan-600" />
                      解決コマンド（PowerShellで実行）
                    </span>
                    <span className="text-[10px] text-slate-400">ワンクリックでコピー</span>
                  </div>

                  <div className="relative flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 group shadow-inner">
                    <code className="font-mono text-xs text-cyan-300 break-all select-all mr-3">
                      {item.solutionCommand}
                    </code>
                    <button
                      onClick={() => handleCopy(item)}
                      onMouseEnter={playCyberHover}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer shadow-xs active:scale-95 text-xs font-bold flex items-center gap-1.5"
                      title="コマンドをクリップボードにコピー"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check size={13} className="text-emerald-300" />
                          <span className="text-emerald-300">コピー完了</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>コピー</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 解説と安全注記 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  <p className="text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">動作解説:</strong> {item.explanation}
                  </p>
                  {item.safetyNote && (
                    <span className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium border border-emerald-200/60 flex items-center gap-1">
                      <ShieldCheck size={12} className="text-emerald-600" />
                      {item.safetyNote}
                    </span>
                  )}
                </div>
              </div>
            </TiltCard>
          ))
        )}
      </div>
    </div>
  );
}
