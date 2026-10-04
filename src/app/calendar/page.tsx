"use client";

import { useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import {
  CalendarDays,
  Lock,
  Sparkles,
  Calendar as CalendarIcon,
  ExternalLink,
  Layers,
  ListFilter,
} from "lucide-react";

// 「AI Park イベント」カレンダーのカレンダーID（社内限定で共有。gas/ai-study-agenda/README.md 参照）
const AI_PARK_CALENDAR_ID = "c_54efbf0cb034ce399450784c14c91910006003253eb98ca8ff161f5ba16ad1a7@group.calendar.google.com";

const embedUrl = (mode: "MONTH" | "AGENDA") =>
  `https://calendar.google.com/calendar/embed?${new URLSearchParams({
    src: AI_PARK_CALENDAR_ID,
    ctz: "Asia/Tokyo",
    hl: "ja",
    mode,
    showPrint: "0",
    showTitle: "0",
  }).toString()}`;

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<"all" | "month" | "agenda">("all");

  const googleCalendarDirectUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(
    AI_PARK_CALENDAR_ID
  )}`;

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="AI Park カレンダー"
        subtitle="社内AI勉強会・Office Hour・募集締切・イベント予定（社内Google Workspace限定公開）"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ガイドインフォメーションカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <TiltCard maxTilt={6} glareOpacity={0.12} className="h-full rounded-2xl">
            <SpotlightCard
              spotlightColor="rgba(99, 102, 241, 0.15)"
              className="bg-white border-slate-200/90 h-full rounded-2xl"
            >
              <div onMouseEnter={() => playCyberHover()} className="p-5 flex gap-3.5 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">AI勉強会のアジェンダは自動で入ります</h4>
                  <p className="text-slate-600 leading-relaxed font-normal">
                    タイトルに「AI勉強会」を含む予定を登録すると、GASによって予定の説明欄にアジェンダ（最新の改善要望・進行中プロジェクト）が自動付与されます。
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </TiltCard>

          <TiltCard maxTilt={6} glareOpacity={0.12} className="h-full rounded-2xl">
            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.15)"
              className="bg-white border-slate-200/90 h-full rounded-2xl"
            >
              <div onMouseEnter={() => playCyberHover()} className="p-5 flex gap-3.5 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 shadow-2xs">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">予定は社内限定公開です</h4>
                  <p className="text-slate-600 leading-relaxed font-normal">
                    会社の Google Workspace アカウントでログインしている時だけ表示されます。表示されない場合は、ブラウザで会社アカウントにログインした状態で再読み込みしてください。
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </TiltCard>
        </div>

        {AI_PARK_CALENDAR_ID ? (
          <div className="space-y-6">
            {/* ビュー切り替えピルタブ ＆ カレンダー直接追加ボタン */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => {
                    playCyberClick();
                    setViewMode("all");
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    viewMode === "all"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Layers size={14} />
                  <span>すべて表示</span>
                </button>
                <button
                  onClick={() => {
                    playCyberClick();
                    setViewMode("month");
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    viewMode === "month"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <CalendarIcon size={14} />
                  <span>月間カレンダー</span>
                </button>
                <button
                  onClick={() => {
                    playCyberClick();
                    setViewMode("agenda");
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    viewMode === "agenda"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <ListFilter size={14} />
                  <span>アジェンダ一覧</span>
                </button>
              </div>

              <a
                href={googleCalendarDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playCyberClick()}
                onMouseEnter={() => playCyberHover()}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
              >
                <span>Google カレンダーで開く</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* 月間カレンダービュー */}
            {(viewMode === "all" || viewMode === "month") && (
              <TiltCard maxTilt={2} glareOpacity={0.04} className="rounded-3xl">
                <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
                  <div
                    onMouseEnter={() => playCyberHover()}
                    className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 cursor-default"
                  >
                    <div className="flex items-center space-x-2.5">
                      <CalendarIcon className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-sm">月間スケジュールビュー</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-slate-400 font-mono">Live Google Calendar</span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-4 bg-slate-50/50">
                    <iframe
                      title="AI Park カレンダー（月）"
                      src={embedUrl("MONTH")}
                      className="w-full h-[640px] border-0 rounded-2xl bg-white shadow-inner"
                    />
                  </div>
                </div>
              </TiltCard>
            )}

            {/* リスト（アジェンダ）ビュー */}
            {(viewMode === "all" || viewMode === "agenda") && (
              <TiltCard maxTilt={2} glareOpacity={0.04} className="rounded-3xl">
                <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
                  <div
                    onMouseEnter={() => playCyberHover()}
                    className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 cursor-default"
                  >
                    <div className="flex items-center space-x-2.5">
                      <CalendarDays className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold text-sm">直近の予定・アジェンダ一覧</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Upcoming Events</span>
                  </div>
                  <div className="p-2 sm:p-4 bg-slate-50/50">
                    <iframe
                      title="AI Park カレンダー（予定リスト）"
                      src={embedUrl("AGENDA")}
                      className="w-full h-[420px] border-0 rounded-2xl bg-white shadow-inner"
                    />
                  </div>
                </div>
              </TiltCard>
            )}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
            <CalendarDays className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-base font-bold text-slate-800">🚧 工事中：カレンダーの接続を準備しています</p>
            <p className="text-xs max-w-md mx-auto text-slate-500">
              「AI Park イベント」カレンダーの作成と共有設定が済み次第、ここに予定が表示されます。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
