"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import Link from "next/link";
import { useState } from "react";
import { featureStatusMaster } from "@/data/feature-status";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  Search,
  Filter,
  Bot,
  Wrench,
  BarChart3,
  Users,
  Lightbulb,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

type StatusType = "all" | "in-progress" | "planned" | "completed";

interface TaskItem {
  id: string;
  title: string;
  pageName: string;
  href: string;
  phase: "Phase 1" | "Phase 2" | "Phase 3" | "Phase 4";
  targetDate: string; // 具体的な日付
  status: "completed" | "in-progress" | "planned";
  currentVerificationBadge?: string; // 現在のバッジ（🧪 PoC中 / 🚧 工事中 / 📋 準備中 / β版 / 公開中）
  releaseCondition: string; // 解除に必要な条件・マイルストーン
  category: "interaction" | "community" | "data" | "system";
  icon: string;
  description: string;
  items: { text: string; done: boolean }[];
}

// 準備中・PoC中・工事中機能の解除タイムライン（日付昇順）
interface UnverifiedReleaseMilestone {
  date: string;
  pageName: string;
  href: string;
  currentStatus: string;
  badgeColor: string;
  condition: string;
  phase: string;
}

// 工事中・準備中・PoC中の機能は feature-status.ts を唯一の情報源にする
const badgeColorOf = (badge: string) =>
  badge.includes("工事中")
    ? "bg-amber-100 text-amber-800 border-amber-300"
    : badge.includes("PoC")
      ? "bg-purple-100 text-purple-800 border-purple-300"
      : badge.includes("準備中")
        ? "bg-slate-100 text-slate-700 border-slate-300"
        : "bg-sky-100 text-sky-800 border-sky-300";

const unverifiedReleaseSchedule: UnverifiedReleaseMilestone[] = featureStatusMaster
  .filter((f) => !f.isVerified)
  .map((f) => ({
    date: f.releaseDate,
    pageName: f.name,
    href: f.href,
    currentStatus: f.currentBadge,
    badgeColor: badgeColorOf(f.currentBadge),
    condition: f.releaseCondition,
    phase: "",
  }));

const tasksData: TaskItem[] = [
  // Phase 1: 初期公開
  {
    id: "portal-launch",
    title: "ポータル初期公開 & 導入ガイド",
    pageName: "Antigravity導入ガイド",
    href: "/guide",
    phase: "Phase 1",
    targetDate: "2026年9月18日(金)",
    status: "completed",
    currentVerificationBadge: "公開中",
    releaseCondition: "トップ・導入ガイド・初級編チートシートの公開",
    category: "interaction",
    icon: "🚀",
    description: "ポータルのトップと、画面キャプチャ付きの Antigravity 導入ガイド・会社の Google Cloud で使うための手順を公開しました。",
    items: [
      { text: "トップ・はじめての方向け3ステップ導線", done: true },
      { text: "Antigravity 導入ガイド（画面キャプチャ付き）と会社の Google Cloud 利用手順", done: true },
      { text: "初級編チートシート（頼み方・編集の流れ・エラー対処）", done: true },
    ],
  },
  {
    id: "calendar-integration",
    title: "Office Hour 相談のGoogleカレンダー仮予定リンク",
    pageName: "お問い合わせ",
    href: "/contact",
    phase: "Phase 1",
    targetDate: "2026年9月18日(金)",
    status: "completed",
    currentVerificationBadge: "公開中",
    releaseCondition: "相談内容のコピーと、Googleカレンダーへの仮予定追加リンクの確認",
    category: "interaction",
    icon: "📅",
    description: "Office Hour の相談内容をコピーして Google Chat で送れるようにし、Googleカレンダーに仮予定を追加できるリンクを用意しました。",
    items: [
      { text: "Googleカレンダーへの仮予定追加リンク", done: true },
      { text: "相談内容（所属・テーマ・事前メモ）のコピー", done: true },
    ],
  },
  // Phase 2: 進行中
  {
    id: "academy",
    title: "Antigravity Academy",
    pageName: "Antigravity Academy",
    href: "/academy",
    phase: "Phase 2",
    targetDate: "2026年10月16日(金)",
    status: "in-progress",
    currentVerificationBadge: "β版",
    releaseCondition: "修了者の社内記録（AI推進担当での管理）方法の決定",
    category: "interaction",
    icon: "🎓",
    description: "3コース・12レッスンの動画付き学習コースと評価テスト・修了証を公開しました。",
    items: [
      { text: "3コース・12レッスン（画面キャプチャ付き）", done: true },
      { text: "全レッスンの動画（読み上げ・字幕付き）", done: true },
      { text: "評価テストと修了証（ブラウザ内保存）", done: true },
      { text: "修了者の社内記録方法の決定", done: false },
    ],
  },
  {
    id: "feedback-github-sync",
    title: "ご意見・改善ToDoボードのGitHub Issue / Google Chat連携",
    pageName: "ご意見・改善ToDoボード",
    href: "/feedback-todo",
    phase: "Phase 1",
    targetDate: "2026年10月2日(金)",
    status: "in-progress",
    currentVerificationBadge: "β版",
    releaseCondition: "Google Chat / GitHub Issue 双方向自動同期の稼働をもって正式運用へ移行",
    category: "system",
    icon: "📋",
    description: "ラベル「feedback」付きGitHub Issueをボードへ自動掲載し、ボードからはIssueフォームへ入力内容をプリフィルして起票できるようにしました。Issueの起票・対応開始・完了はGitHub ActionsからGoogle Chatへ通知します。",
    items: [
      { text: "feedbackラベル付きIssueのボード自動同期（対応中ラベル / Closeでステータス反映）", done: true },
      { text: "起票モーダルからIssueフォームへのプリフィル起票 & Issueテンプレート整備", done: true },
      { text: "Issue起票・対応開始・完了時のGoogle Chat通知ワークフロー", done: true },
      { text: "Google Chat Webhook（GOOGLE_CHAT_WEBHOOK_URL）の本番設定と通知の実機確認", done: true },
      { text: "Google Chat 投稿からのIssue自動起票（Chatアプリ / GCP側の受け口整備）", done: false },
    ],
  },  {
    id: "tools-sheets-sync",
    title: "AIツール検証マトリックスの社内シート自動同期",
    pageName: "AIツール一覧",
    href: "/tools",
    phase: "Phase 2",
    targetDate: "2026年10月9日(金)",
    status: "in-progress",
    currentVerificationBadge: "🧪 PoC中",
    releaseCondition: "社内マスターシートの内容（利用ステータス・適合度）の社内確認",
    category: "data",
    icon: "🤖",
    description: "AIツールの一覧を、社内マスターシート（AIツールマスター）から自動で表示します。シートの内容は社内での確認がまだ済んでいません。",
    items: [
      { text: "マトリクス表示・4象限ポジションの画面", done: true },
      { text: "社内Google Sheets（AIツールマスター）公開CSVからのマトリクス自動同期", done: true },
      { text: "シートの内容（利用ステータス・適合度）の社内確認", done: false },
    ],
  },  {
    id: "interviews-first-edition",
    title: "現場のAI活用インタビュー 第1弾（2編）取材・公開",
    pageName: "AI活用インタビュー",
    href: "/interviews",
    phase: "Phase 2",
    targetDate: "2026年10月16日(金)",
    status: "in-progress",
    currentVerificationBadge: "📋 準備中",
    releaseCondition: "実際の取材と、本人・上長の原稿確認が済んだ記事の公開",
    category: "community",
    icon: "🎙️",
    description: "社内で AI を使っている人に取材し、工夫や効果を記事にして公開します。",
    items: [
      { text: "記事フォーマットと取材立候補フォーム", done: true },
      { text: "取材立候補のGitHub Issue受付・Google Chat通知 & 取材キット（流れ・質問項目）公開", done: true },
      { text: "社内での実際の取材（2件）", done: false },
      { text: "記事校正・関係者レビュー完了後の正式公開", done: false },
    ],
  },  {
    id: "ambassadors-kickoff",
    title: "社内AIアンバサダー 第1期公募選定 & 相談窓口開設",
    pageName: "AIアンバサダー",
    href: "/ambassadors",
    phase: "Phase 2",
    targetDate: "2026年10月23日(金)",
    status: "in-progress",
    currentVerificationBadge: "📋 準備中",
    releaseCondition: "第1期アンバサダー公募選定・各事業部リーダーの正式登録と相談窓口の開設",
    category: "community",
    icon: "🤝",
    description: "各事業部で AI 活用の相談役になる「AIアンバサダー」を募集・選定し、相談窓口を開きます。",
    items: [
      { text: "アンバサダー紹介の画面と応募フォーム", done: true },
      { text: "応募のGitHub Issue受付・Google Chat通知 & 第1期制度（案）の公開", done: true },
      { text: "第1期アンバサダーの全社公募・選定", done: false },
      { text: "アンバサダーへの相談窓口（Google Chat）の正式稼働", done: false },
    ],
  },  {
    id: "ai-calendar",
    title: "AI Park カレンダーとAI勉強会アジェンダの自動追加",
    pageName: "AI Park カレンダー",
    href: "/calendar",
    phase: "Phase 2",
    targetDate: "未定",
    status: "in-progress",
    currentVerificationBadge: "🚧 工事中",
    releaseCondition: "「AI Park イベント」カレンダーの作成・共有とカレンダーIDの設定",
    category: "community",
    icon: "🗓️",
    description: "AI勉強会の予定を登録すると、説明欄にアジェンダが自動で入る仕組みと、サイトでの予定表示を用意します。",
    items: [
      { text: "アジェンダ自動追加の Apps Script", done: true },
      { text: "「AI Park イベント」カレンダーの作成とIDの設定", done: false },
    ],
  },
  // Phase 3: 工事中（内容の準備待ち）
  {
    id: "usage-data",
    title: "利用状況（Gemini利用率・社内AI活用状況）の実データ連携",
    pageName: "Gemini利用率・社内AI活用状況",
    href: "/gemini-stats",
    phase: "Phase 3",
    targetDate: "未定",
    status: "planned",
    currentVerificationBadge: "🚧 工事中",
    releaseCondition: "利用ログやアンケートなどの実データとの連携",
    category: "data",
    icon: "📊",
    description: "実データと連携できるまでは数値を表示しません。",
    items: [
      { text: "利用ログ・アンケートなど、使うデータの決定", done: false },
      { text: "データとの連携と表示", done: false },
    ],
  },
  {
    id: "cases-skills",
    title: "社内の活用事例・Skills の収集と掲載",
    pageName: "Subagents活用事例・社内Skillsカタログ",
    href: "/agent-cases",
    phase: "Phase 3",
    targetDate: "未定",
    status: "planned",
    currentVerificationBadge: "🚧 工事中",
    releaseCondition: "社内の実際の事例と Skills がそろうこと",
    category: "community",
    icon: "🟣",
    description: "社内で実際に使っているエージェントの事例と、共有できる Skills を集めて掲載します。",
    items: [
      { text: "実際の活用事例の収集（効果は実測値）", done: false },
      { text: "社内で共有する Skills の作成・確認", done: false },
    ],
  },
  {
    id: "idea-board",
    title: "アイデア宣言ボードの受付開始",
    pageName: "アイデア宣言ボード",
    href: "/idea-board",
    phase: "Phase 3",
    targetDate: "未定",
    status: "planned",
    currentVerificationBadge: "🚧 工事中",
    releaseCondition: "宣言を保存・共有できる仕組み（GitHub Issues など）との連携",
    category: "interaction",
    icon: "💡",
    description: "アイデアの宣言を保存・共有できるようにします。それまでは Google Chat の「AI勉強会」スペースで受け付けます。",
    items: [{ text: "宣言を保存・共有できる仕組みとの連携", done: false }],
  },
  {
    id: "tools-policy",
    title: "会社として使えるAIツールと申請方法の決定",
    pageName: "AI Tools Hub",
    href: "/tools-hub",
    phase: "Phase 3",
    targetDate: "未定",
    status: "planned",
    currentVerificationBadge: "🚧 工事中",
    releaseCondition: "利用を認めるツールと申請方法の社内決定",
    category: "system",
    icon: "📍",
    description: "会社として利用を認めるAIツールと、その申請方法を決めて掲載します。",
    items: [
      { text: "セキュリティ基準（Level 1〜3）と注意事項5箇条（暫定版）", done: true },
      { text: "利用を認めるツールと申請方法の決定", done: false },
    ],
  },
  {
    id: "info-pages",
    title: "AWS・MCP・Antigravity情報局の内容準備",
    pageName: "AWS・クラウド情報局 ほか",
    href: "/aws-info",
    phase: "Phase 3",
    targetDate: "未定",
    status: "planned",
    currentVerificationBadge: "🚧 工事中",
    releaseCondition: "社内ルール・相談窓口・使ってよいツールの決定",
    category: "system",
    icon: "☁️",
    description: "社内の AWS 利用ルール、使ってよい MCP サーバー、Antigravity の社内向けお知らせを準備します。",
    items: [
      { text: "社内の AWS 利用ルールと相談窓口", done: false },
      { text: "使ってよい MCP サーバーと設定方法", done: false },
      { text: "Antigravity の社内向けお知らせ・よくある質問", done: false },
    ],
  },
];

export default function RoadmapPage() {
  const [selectedStatus, setSelectedStatus] = useState<StatusType>("all");

  const filteredTasks = tasksData.filter((task) => {
    if (selectedStatus === "all") return true;
    return task.status === selectedStatus;
  });

  const totalTasks = tasksData.length;
  const inProgressTasks = tasksData.filter((t) => t.status === "in-progress").length;
  const plannedTasks = tasksData.filter((t) => t.status === "planned").length;
  const completedTasks = tasksData.filter((t) => t.status === "completed").length;
  const progressPercentage = Math.round(
    ((completedTasks + inProgressTasks * 0.4) / totalTasks) * 100
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="開発ロードマップ & 実装スケジュール"
        subtitle="MightyLINK 社内AIポータル「AI Park」の機能拡充計画と進捗ステータス"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* 全体進捗サマリーカード */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-semibold">
                  Project Schedule
                </span>
                <span className="text-xs text-slate-500">最終更新: 2026年9月25日</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                AI Park 機能実装マイルストーン
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                準備中・PoC中・工事中となっている箇所を、内容がそろったものから順に公開していきます（予定日が「未定」のものは、決まり次第お知らせします）。
              </p>
            </div>

            <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
              <div className="text-center px-2">
                <div className="text-xs text-slate-500 font-medium">全体タスク</div>
                <div className="text-lg font-bold text-slate-800">{totalTasks} 件</div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center px-2">
                <div className="text-xs text-emerald-600 font-medium">初期完了</div>
                <div className="text-lg font-bold text-emerald-600">{completedTasks} 件</div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center px-2">
                <div className="text-xs text-blue-600 font-medium">進行中</div>
                <div className="text-lg font-bold text-blue-600">{inProgressTasks} 件</div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center px-2">
                <div className="text-xs text-amber-600 font-medium">準備中</div>
                <div className="text-lg font-bold text-amber-600">{plannedTasks} 件</div>
              </div>
            </div>
          </div>

          {/* プログレスバー */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                <span>Phase 1〜4 全体進行度</span>
              </span>
              <span className="font-bold text-cyan-700">
                {progressPercentage}% 完了
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* フェーズ概要バナー */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 px-2 py-0.5 bg-emerald-100 rounded flex items-center space-x-1">
                  <span>✓</span>
                  <span>Phase 1 (完了)</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">9月下旬</span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs mt-1">ポータル公開・学習基盤</h4>
              <p className="text-[11px] text-slate-600">トップ、導入ガイド、初級編チートシート、Office Hour</p>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 space-y-1 ring-2 ring-blue-500/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-800 px-2 py-0.5 bg-blue-100 rounded flex items-center space-x-1">
                  <span>🔵</span>
                  <span>Phase 2 (進行中)</span>
                </span>
                <span className="text-[10px] text-blue-600 font-medium">10月中</span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs mt-1">学習・ツール連携 & コミュニティ</h4>
              <p className="text-[11px] text-slate-600">Academy、ご意見ボード、ツールシート同期、取材、アンバサダー、カレンダー</p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800 px-2 py-0.5 bg-amber-100 rounded">
                  Phase 3 (準備中)
                </span>
                <span className="text-[10px] text-amber-600 font-medium">11月中</span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs mt-1">工事中ページの内容準備</h4>
              <p className="text-[11px] text-slate-600">利用状況の実データ、事例・Skills、アイデアボード、ツール方針</p>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-800 px-2 py-0.5 bg-purple-100 rounded">
                  Phase 4 (企画中)
                </span>
                <span className="text-[10px] text-purple-600 font-medium">12月中旬〜</span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs mt-1">（未定）</h4>
              <p className="text-[11px] text-slate-600">Phase 3 の後に検討します</p>
            </div>
          </div>
        </div>

        {/* 📅 準備中・PoC中・工事中機能の正式稼働（解除）スケジュール（最重要セクション） */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-700/80 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/70 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1">
                  <Calendar size={13} className="text-emerald-400" />
                  <span>Release Timeline</span>
                </span>
                <span className="text-xs text-slate-400">具体的なリリース目標日（昇順）</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                📌 準備中・PoC中・工事中機能の正式稼働スケジュール
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                現在ポータル上で「準備中」「PoC中」「工事中」となっている全機能について、いつ正式稼働し注意書きが解除されるかのロードマップです。
              </p>
            </div>
            <span className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 shrink-0 self-start sm:self-auto">
              全 {unverifiedReleaseSchedule.length} 機能
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {unverifiedReleaseSchedule.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl p-4 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-emerald-400 font-mono flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{item.date}</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                      {item.currentStatus}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm">
                    {item.pageName}
                  </h4>

                  <p className="text-[11px] text-slate-300 leading-relaxed bg-black/30 p-2.5 rounded-lg border border-white/5">
                    <span className="text-slate-400 font-semibold block mb-0.5">🔑 解除マイルストーン:</span>
                    {item.condition}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-medium">{item.phase}</span>
                  <Link
                    href={item.href}
                    className="inline-flex items-center space-x-1 text-cyan-300 hover:text-cyan-200 font-semibold transition-colors"
                  >
                    <span>該当画面を見る</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* フィルターバー */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-slate-800">
            <Filter className="w-4 h-4 text-slate-500" />
            <span>開発タスク詳細一覧 ({filteredTasks.length}件)</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-200/70 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedStatus === "all"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              すべて ({totalTasks})
            </button>
            <button
              onClick={() => setSelectedStatus("in-progress")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedStatus === "in-progress"
                  ? "bg-blue-600 text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              進行中 ({inProgressTasks})
            </button>
            <button
              onClick={() => setSelectedStatus("planned")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedStatus === "planned"
                  ? "bg-amber-500 text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              準備中 ({plannedTasks})
            </button>
            <button
              onClick={() => setSelectedStatus("completed")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedStatus === "completed"
                  ? "bg-emerald-600 text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              完了 ({completedTasks})
            </button>
          </div>
        </div>

        {/* タスク一覧グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTasks.map((task) => {
            const isProgress = task.status === "in-progress";
            const isCompleted = task.status === "completed";

            return (
              <div
                key={task.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* ヘッダー */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl p-1.5 bg-slate-100 rounded-lg shrink-0">
                        {task.icon}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              task.phase === "Phase 1"
                                ? "bg-emerald-100 text-emerald-800"
                                : task.phase === "Phase 2"
                                ? "bg-blue-100 text-blue-800"
                                : task.phase === "Phase 3"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {task.phase}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-600 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{task.targetDate}</span>
                          </span>
                          {task.currentVerificationBadge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded border bg-slate-50 text-slate-700 border-slate-200">
                              現在: {task.currentVerificationBadge}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mt-1">
                          {task.title}
                        </h3>
                      </div>
                    </div>

                    <div>
                      {isProgress && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 shrink-0 animate-pulse">
                          <span>🔵</span>
                          <span>進行中</span>
                        </span>
                      )}
                      {task.status === "planned" && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                          <span>🚧</span>
                          <span>準備中</span>
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>完了</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 概要 */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {task.description}
                  </p>

                  {/* 本番解除マイルストーン */}
                  {task.releaseCondition && (
                    <div className="bg-slate-100/70 rounded-lg p-2.5 border border-slate-200 text-xs space-y-1">
                      <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                        <span>🎯</span>
                        <span>本番稼働（解除）マイルストーン:</span>
                      </span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {task.releaseCondition}
                      </p>
                    </div>
                  )}

                  {/* チェックリスト */}
                  <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-100 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-700">主な実装項目:</div>
                    <div className="space-y-1.5">
                      {task.items.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs">
                          {item.done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0 mt-0.5 bg-white" />
                          )}
                          <span
                            className={item.done ? "text-slate-500 line-through" : "text-slate-700 font-medium"}
                          >
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* フッター / 画面リンク */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">対象機能: {task.pageName}</span>
                  <Link
                    href={task.href}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-cyan-700 hover:text-cyan-800 transition-colors"
                  >
                    <span>該当画面へ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
