"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import Link from "next/link";
import {
  CalendarDays,
  Lock,
  Sparkles,
  Clock,
  Video,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  ExternalLink,
  BookOpen,
  Users,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

// 「AI Park イベント」カレンダーのカレンダーID（社内限定で共有。gas/ai-study-agenda/README.md 参照）
// 未設定の間はプレビュー・直近予定を表示する
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

interface UpcomingEvent {
  id: string;
  title: string;
  category: "勉強会" | "Office Hour" | "公募・締切" | "イベント";
  date: string;
  time: string;
  location: string;
  host: string;
  description: string;
  agendaItems: string[];
  actionLink?: { label: string; href: string };
  status: "scheduled" | "open" | "urgent";
}

const upcomingEvents: UpcomingEvent[] = [
  {
    id: "study-session-12",
    title: "第12回 社内AI勉強会 — Antigravity Academy活用 & 自律エージェント実践",
    category: "勉強会",
    date: "2026年10月7日(水)",
    time: "12:15 - 12:55 (ランチタイム開催)",
    location: "オンライン (Google Meet) ＋ 本社 7F オープンコラボ",
    host: "AI推進担当",
    description: "新設された「Antigravity Academy」のカリキュラム紹介と、社内各部署でのSubagents自律エージェント最新活用事例をライトに共有します。お昼を食べながら気軽にご参加ください。",
    agendaItems: [
      "12:15〜12:20 オープニング & 最新の社内AI活用状況（49名利用中）",
      "12:20〜12:35 Antigravity Academy のおすすめ受講ルートと修了証の取得法",
      "12:35〜12:50 社内プロジェクト紹介：次世代クラウド基盤PJでのコード生成自動化",
      "12:50〜12:55 質疑応答 & 次回テーマ募集",
    ],
    actionLink: { label: "カリキュラムを見る", href: "/academy" },
    status: "scheduled",
  },
  {
    id: "office-hour-weekly",
    title: "AI推進担当 Office Hour（マンツーマン技術相談デスク）",
    category: "Office Hour",
    date: "毎週木曜日",
    time: "16:00 - 17:30 (1枠20分・事前予約制)",
    location: "オンライン (Google Meet) / 個別対応",
    host: "AI推進担当 技術メンター陣",
    description: "「自分の業務にAntigravityを使いたい」「MCPで社内DBと繋げたい」「カスタムSkillsを作ってみたい」など、疑問を専門メンターと画面共有しながら即座に解決できます。",
    agendaItems: [
      "Antigravity IDE / CLI の初期環境構築トラブル解消",
      "自部署特化のプロンプト・Ruleファイル・Skill.md 設計レビュー",
      "セキュリティ基準（Level 1〜3）に沿った安全なデータマスキング相談",
    ],
    actionLink: { label: "Office Hourを予約する", href: "/antigravity-info" },
    status: "open",
  },
  {
    id: "ambassador-apply-deadline",
    title: "第1期 社内AIアンバサダー 公募受付 締切",
    category: "公募・締切",
    date: "2026年10月20日(火)",
    time: "18:00 締切",
    location: "GitHub Issue / ポータル専用フォーム",
    host: "AI推進担当 事務局",
    description: "各事業部から自チームのAI活用を後押しする「第1期AIアンバサダー」を募集中です。AIの専門知識は不問。チームをちょっと便利にしたい思いがあればどなたでも歓迎です！",
    agendaItems: [
      "月1回のアンバサダー座談会参加（先行機能の体験など特典あり）",
      "チームメンバーからの素朴な相談受付 & AI推進担当へのフィードバック",
      "社内ポータルへのアンバサダープロフィール掲載",
    ],
    actionLink: { label: "アンバサダー応募要項", href: "/ambassadors" },
    status: "urgent",
  },
];

export default function CalendarPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredEvents =
    selectedCategory === "all"
      ? upcomingEvents
      : upcomingEvents.filter((ev) => ev.category === selectedCategory);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="AI Park カレンダー"
        subtitle="社内AI勉強会・Office Hour・イベント・公募締切などのスケジュール"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        {/* 品質ゲート準拠：工事中ステータスバナー */}
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 工事中：社内共有カレンダーの接続準備中"
          message="「AI Park イベント」カレンダー（社内Google Workspace限定共有）の作成と、AI勉強会アジェンダ自動追加スクリプトの設置を準備中です。正式接続完了まで、下記の直近予定・アジェンダプレビューをご参照ください。"
          prepDetails="社内Google Workspace共有設定およびGASアジェンダ自動追加トリガーの稼働検証"
          releaseDate="2026年10月2日(金)"
        />

        {/* 案内カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
            <div className="text-slate-600 leading-relaxed space-y-1">
              <span className="font-bold text-slate-900 block">AI勉強会のアジェンダは自動で入ります</span>
              <p>
                カレンダーに「AI勉強会」を含む予定を登録すると、GAS（Google Apps Script）連携により約10分で予定の説明欄に最新のアジェンダ（直近の改善ToDoや社内AIプロジェクト一覧）が自動追加されます。
              </p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex gap-3">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-slate-600 leading-relaxed space-y-1">
              <span className="font-bold text-slate-900 block">予定は社内限定です</span>
              <p>
                社内の Google アカウントでログインしているときだけ表示・購読できます。外部公開されないため、社内プロジェクト名や検討中のテーマも安全に共有できます。
              </p>
            </div>
          </div>
        </div>

        {/* 直近の予定一覧セクション */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>直近の社内AIイベント・予定</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                開催予定のAI勉強会や個別相談枠をチェックできます
              </p>
            </div>

            {/* カテゴリフィルタ */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg text-xs">
              {["all", "勉強会", "Office Hour", "公募・締切"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-white text-indigo-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat === "all" ? "すべて" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="border border-slate-200 hover:border-indigo-300 rounded-xl p-5 bg-slate-50/40 hover:bg-white transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        event.category === "勉強会"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : event.category === "Office Hour"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-rose-100 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {event.category}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">
                      {event.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 shrink-0">
                    <span className="flex items-center space-x-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{event.date} {event.time}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {event.description}
                </p>

                {/* アジェンダ項目 */}
                <div className="bg-white border border-slate-200/80 rounded-lg p-3 text-xs space-y-1.5">
                  <span className="font-bold text-slate-700 block text-[11px]">
                    📋 予定アジェンダ / 内容（自動同期連携）:
                  </span>
                  <ul className="space-y-1 text-slate-600 pl-1">
                    {event.agendaItems.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* アクションボタン */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    主催: {event.host} / 場所: {event.location}
                  </span>
                  {event.actionLink && (
                    <Link
                      href={event.actionLink.href}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 group"
                    >
                      <span>{event.actionLink.label}</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* カレンダー埋め込み（ID設定時）または 接続準備ガイド（未設定時） */}
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
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Google カレンダー直接埋め込みについて
                </h3>
                <p className="text-xs text-slate-500">
                  現在、社内管理者が「AI Park イベント」カレンダーを作成・アクセス権限を設定中です。
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 space-y-2 border border-slate-200">
              <p className="font-semibold text-slate-800">
                💡 カレンダー完成後の機能:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>個人の Google カレンダーに「＋他のカレンダー」から1クリックで追加可能</li>
                <li>予定変更や追加がリアルタイムにブラウザ・スマホのカレンダーに同期</li>
                <li>タイトルに「AI勉強会」を入れるだけで、アジェンダ自動収集バッチが内容を最新化</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
