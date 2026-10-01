import HeroBanner from "@/components/HeroBanner";
import SpotlightCard from "@/components/SpotlightCard";
import { CalendarDays, Lock, Sparkles, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";

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
  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="AI Park カレンダー"
        subtitle="社内AI勉強会・Office Hour・募集締切・イベント予定（社内Google Workspace限定公開）"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ガイドインフォメーションカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <SpotlightCard
            spotlightColor="rgba(99, 102, 241, 0.15)"
            className="bg-white border-slate-200/90"
          >
            <div className="p-5 flex gap-3.5">
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

          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.15)"
            className="bg-white border-slate-200/90"
          >
            <div className="p-5 flex gap-3.5">
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
        </div>

        {AI_PARK_CALENDAR_ID ? (
          <div className="space-y-6">
            {/* 月間カレンダービュー */}
            <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
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

            {/* リスト（アジェンダ）ビュー */}
            <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
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
