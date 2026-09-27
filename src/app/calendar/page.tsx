import HeroBanner from "@/components/HeroBanner";
import { CalendarDays, Lock, Sparkles } from "lucide-react";

// 「AI Park イベント」カレンダーのカレンダーID（社内限定で共有。gas/ai-study-agenda/README.md 参照）
// 未設定の間は設定待ちの案内を表示する
const AI_PARK_CALENDAR_ID = "";

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
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="AI Park カレンダー"
        subtitle="AI勉強会・打ち合わせ・募集の締切などの予定（社内アカウントでログイン中のみ表示）"
      />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
            <p className="text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">AI勉強会のアジェンダは自動で入ります</span>
              タイトルに「AI勉強会」を含む予定を登録すると、10分ほどで予定の説明欄にアジェンダ（最新のご意見・社内AIプロジェクトなど）が追加されます。予定をクリックすると確認できます。
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex gap-3">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">予定は社内限定です</span>
              会社の Google アカウントでログインしているときだけ表示されます。表示されない場合は、ブラウザで会社アカウントにログインしてから再読み込みしてください。
            </p>
          </div>
        </div>

        {AI_PARK_CALENDAR_ID ? (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <iframe title="AI Park カレンダー（月）" src={embedUrl("MONTH")} className="w-full h-[640px] border-0" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <iframe title="AI Park カレンダー（予定リスト）" src={embedUrl("AGENDA")} className="w-full h-[420px] border-0" />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 space-y-2">
            <CalendarDays className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-sm font-bold text-slate-700">🚧 工事中：カレンダーの接続を準備しています</p>
            <p className="text-xs">「AI Park イベント」カレンダーの作成と共有設定が済み次第、ここに予定が表示されます。</p>
          </div>
        )}
      </div>
    </div>
  );
}
