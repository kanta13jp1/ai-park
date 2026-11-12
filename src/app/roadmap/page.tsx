"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import { playCyberClick, playCyberHover } from "@/lib/sound";
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
  .filter((f) => !f.isVerified && f.id !== "roadmap")
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
  // Phase 1: 完了（ポータル公開・基本ガイド・学習基盤）
  {
    id: "portal-launch",
    title: "ポータル初期公開 & 導入ガイド・トラブル対処",
    pageName: "Antigravity導入ガイド",
    href: "/guide",
    phase: "Phase 1",
    targetDate: "公開済み",
    status: "completed",
    currentVerificationBadge: "公開中",
    releaseCondition: "トップ・導入ガイド・初級編チートシート・トラブル対処手順の公開",
    category: "interaction",
    icon: "🚀",
    description: "ポータルのトップと、画面キャプチャ付きの Antigravity 導入ガイド・会社の Google Cloud で使うための手順・実機トラブル対処手順を公開しました。",
    items: [
      { text: "トップ・はじめての方向け3ステップ導線", done: true },
      { text: "Antigravity 導入ガイド（画面キャプチャ付き）と会社の Google Cloud 利用手順", done: true },
      { text: "初級編チートシート（頼み方・編集の流れ・エラー対処）", done: true },
      { text: "権限エラー・チャット実行エラーの切り分け手順（/troubleshooting）", done: true },
    ],
  },
  {
    id: "calendar-integration",
    title: "Office Hour 相談のGoogleカレンダー仮予定リンク",
    pageName: "お問い合わせ",
    href: "/contact",
    phase: "Phase 1",
    targetDate: "公開済み",
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
  {
    id: "academy",
    title: "Antigravity Academy（3コース・12レッスン・動画・テスト）",
    pageName: "Antigravity Academy",
    href: "/academy",
    phase: "Phase 1",
    targetDate: "公開済み（β版）",
    status: "completed",
    currentVerificationBadge: "β版",
    releaseCondition: "修了報告の受付（Google Chat）と AI推進担当 での記録",
    category: "interaction",
    icon: "🎓",
    description: "導入ガイド・注意事項と同じ公式ドキュメント／実機画面で確認済みの内容で、3コース・12レッスンの動画付き学習コースと評価テスト・修了証を公開しました。",
    items: [
      { text: "3コース・12レッスン（画面キャプチャ付き）", done: true },
      { text: "全レッスンの動画（読み上げ・字幕付き）", done: true },
      { text: "評価テストと修了証（ブラウザ内保存）", done: true },
      { text: "修了報告（報告文をコピーして Google Chat で AI推進担当 に送る）", done: true },
    ],
  },
  // Phase 2: 完了・運用中（自動同期・コミュニティ・利用監視）
  {
    id: "news-pipeline",
    title: "最新AIニュース & 公式フィード自動巡回パイプライン",
    pageName: "最新AIニュース",
    href: "/news",
    phase: "Phase 2",
    targetDate: "公開済み",
    status: "completed",
    currentVerificationBadge: "NEW",
    releaseCondition: "各社公式RSS/Atomフィードの定時自動巡回と即時反映の確認",
    category: "data",
    icon: "📰",
    description: "Google DeepMind、Google Antigravity、OpenAI、Mistral AI、Hugging Face、GitHub などの公式RSS/Atomフィードを GitHub Actions（6時間定時Cron）で自動巡回し、最新ニュースを反映しています。",
    items: [
      { text: "カテゴリ・重要度フィルターとキーワード検索", done: true },
      { text: "GitHub Actions（6時間定時Cron）による公式RSS/Atomフィード自動巡回", done: true },
      { text: "GitHub raw 優先取得による最新ニュースの即時反映", done: true },
    ],
  },
  {
    id: "gemini-stats-sync",
    title: "Antigravity利用監視（Google Cloud 課金・利用実績の自動同期）",
    pageName: "Antigravity利用監視",
    href: "/gemini-stats",
    phase: "Phase 2",
    targetDate: "公開済み（β版）",
    status: "completed",
    currentVerificationBadge: "β版",
    releaseCondition: "Google Cloud Billing / Cloud Logging からの自動同期稼働",
    category: "data",
    icon: "📊",
    description: "社内 Google Cloud プロジェクト（antigravity-pj-xxxxxx）の90日無料トライアル残高・課金状況・リクエスト数を自動同期して表示しています（識別ID・個人名は匿名化済み）。",
    items: [
      { text: "90日無料トライアルクレジット残高・日別推移の表示", done: true },
      { text: "BigQuery 課金エクスポート連携と予算アラート設定手順の掲載", done: true },
      { text: "GitHub Actions / GAS API による定期自動同期とプロジェクトID・個人名のマスキング", done: true },
    ],
  },
  {
    id: "ai-projects",
    title: "社内AIプロジェクト一覧の公開・GitHub Issue 連携",
    pageName: "社内AIプロジェクト一覧",
    href: "/ai-projects",
    phase: "Phase 2",
    targetDate: "公開済み（β版）",
    status: "completed",
    currentVerificationBadge: "β版",
    releaseCondition: "GitHub Issue フォームからの登録・自動掲載・Google Chat 通知の確認",
    category: "community",
    icon: "🏢",
    description: "社内で進めているAI関連プロジェクトを一覧化。GitHub Issue フォームから登録すると一覧へ自動掲載され、Google Chat にも通知されます。",
    items: [
      { text: "AI推進担当が進める実在プロジェクトの初期掲載", done: true },
      { text: "ai-project ラベル付き GitHub Issue からの自動取得・一覧反映", done: true },
      { text: "新規登録・更新時の Google Chat 自動通知", done: true },
    ],
  },
  {
    id: "ai-calendar",
    title: "AI Park カレンダーとAI勉強会アジェンダの自動追加",
    pageName: "AI Park カレンダー",
    href: "/calendar",
    phase: "Phase 2",
    targetDate: "公開済み（β版）",
    status: "completed",
    currentVerificationBadge: "β版",
    releaseCondition: "「AI Park イベント」カレンダーの作成・共有とカレンダーIDの設定",
    category: "community",
    icon: "🗓️",
    description: "社内限定の「AI Park イベント」カレンダーをページに表示し、AI勉強会の予定に AI Park の最新状況入りのアジェンダを自動で追加するようにしました。",
    items: [
      { text: "アジェンダ自動追加の Apps Script（10分ごとに実行）", done: true },
      { text: "「AI Park イベント」カレンダーの作成・社内共有とIDの設定", done: true },
      { text: "アジェンダ用の状況ファイル（park-status.json）の自動更新", done: true },
    ],
  },
  {
    id: "idea-board",
    title: "アイデア宣言ボードの受付開始",
    pageName: "アイデア宣言ボード",
    href: "/idea-board",
    phase: "Phase 2",
    targetDate: "公開済み（β版）",
    status: "completed",
    currentVerificationBadge: "β版",
    releaseCondition: "宣言を保存・共有できる仕組み（GitHub Issues）との連携",
    category: "interaction",
    icon: "💡",
    description: "アイデアの宣言を GitHub Issue で受け付け、ボードに自動掲載し、Google Chat に通知するようにしました。",
    items: [
      { text: "宣言フォーム（GitHub Issue フォーム）", done: true },
      { text: "ボードへの自動掲載・状況と協力者募集での絞り込み・キーワード検索", done: true },
      { text: "宣言・終了時の Google Chat 通知", done: true },
    ],
  },
  // Phase 3: 進行中（社内展開・確認・取材・公募）
  {
    id: "company-antigravity",
    title: "【最優先】会社の Google アカウントで Antigravity を使えるようにする",
    pageName: "Antigravity導入ガイド",
    href: "/guide#company-setup",
    phase: "Phase 3",
    targetDate: "進行中",
    status: "in-progress",
    currentVerificationBadge: "最優先",
    releaseCondition: "無料トライアル期間中のコスト消化ペース確認と、希望者への順次権限付与",
    category: "system",
    icon: "🔑",
    description: "会社の Google アカウントのまま、会社の Google Cloud プロジェクト経由（従量課金・無料トライアルクレジット適用中）で Antigravity を使えるようにしています。",
    items: [
      { text: "会社の Google Cloud プロジェクト（antigravity-pj-xxxxxx）の用意", done: true },
      { text: "管理者・利用者の手順を導入ガイドに掲載（画面キャプチャ・権限エラー対処付き）", done: true },
      { text: "請求先アカウントのリンク・90日無料トライアル適用・予算上限アラートの設定確認", done: true },
      { text: "先行メンバー（2名）の会社アカウントでのサインイン・利用監視（/gemini-stats）の確認", done: true },
      { text: "300ドル無料トライアルの消化ペースを見ながら、利用希望者への権限付与（roles/cloudaicompanion.user）を順次拡大", done: false },
    ],
  },
  {
    id: "feedback-github-sync",
    title: "ご意見・改善ToDoボードのGitHub Issue / Google Chat連携",
    pageName: "ご意見・改善ToDoボード",
    href: "/feedback-todo",
    phase: "Phase 3",
    targetDate: "公開済み（β版）",
    status: "in-progress",
    currentVerificationBadge: "β版",
    releaseCondition: "Google Chat / GitHub Issue 連携の運用継続",
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
  },
  {
    id: "tools-sheets-sync",
    title: "AIツール検証マトリックスの社内シート自動同期・内容確認",
    pageName: "AIツール一覧",
    href: "/tools",
    phase: "Phase 3",
    targetDate: "未定（社内確認後）",
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
  },
  {
    id: "interviews-first-edition",
    title: "現場のAI活用インタビュー 第1弾 取材・公開",
    pageName: "AI活用インタビュー",
    href: "/interviews",
    phase: "Phase 3",
    targetDate: "未定（取材・確認後）",
    status: "in-progress",
    currentVerificationBadge: "📋 準備中",
    releaseCondition: "実際の取材と、本人・上長の原稿確認が済んだ記事の公開",
    category: "community",
    icon: "🎙️",
    description: "社内で AI を使っている人に取材し、工夫や効果を記事にして公開します。",
    items: [
      { text: "記事フォーマットと取材立候補フォーム", done: true },
      { text: "取材立候補のGitHub Issue受付・Google Chat通知 & 取材キット（流れ・質問項目）公開", done: true },
      { text: "社内での実際の取材", done: false },
      { text: "本人・上長の原稿確認完了後の正式公開", done: false },
    ],
  },
  {
    id: "ambassadors-kickoff",
    title: "社内AIアンバサダー 第1期公募選定 & 相談窓口開設",
    pageName: "AIアンバサダー",
    href: "/ambassadors",
    phase: "Phase 3",
    targetDate: "未定（公募・選定後）",
    status: "in-progress",
    currentVerificationBadge: "📋 準備中",
    releaseCondition: "第1期アンバサダー公募選定・各事業部リーダーの正式登録と相談窓口の開設",
    category: "community",
    icon: "🤝",
    description: "各事業部で AI 活用の相談役になる「AIアンバサダー」を募集・選定し、相談窓口を開きます。",
    items: [
      { text: "アンバサダー紹介の画面と応募フォーム", done: true },
      { text: "応募のGitHub Issue受付・Google Chat通知 & 第1期制度（案）の公開", done: true },
      { text: "第1期アンバサダーの公募・選定", done: false },
      { text: "アンバサダーへの相談窓口（Google Chat）の開設", done: false },
    ],
  },
  // Phase 4: 工事中（内容の準備待ち）
  {
    id: "adoption-data",
    title: "社内AI活用状況の実データ連携",
    pageName: "社内AI活用状況",
    href: "/adoption",
    phase: "Phase 4",
    targetDate: "未定",
    status: "planned",
    currentVerificationBadge: "🚧 工事中",
    releaseCondition: "利用ログやアンケートなどの実データとの連携",
    category: "data",
    icon: "👀",
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
    phase: "Phase 4",
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
    id: "tools-policy",
    title: "会社として使えるAIツールと申請方法の決定",
    pageName: "AI Tools Hub",
    href: "/tools-hub",
    phase: "Phase 4",
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
    phase: "Phase 4",
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
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="開発ロードマップ & 実装スケジュール"
        subtitle="MightyLINK 社内AIポータル「AI Park」の機能拡充計画と進捗ステータス"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* いまの最優先 */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold">いま最優先</span>
            <h2 className="text-lg font-bold text-slate-900">会社の Google アカウントで Antigravity を使えるようにする</h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              会社の Google Cloud プロジェクト用意・請求先リンク（90日無料トライアル適用・予算上限アラート設定）・先行メンバー2名でのサインインと利用監視（/gemini-stats）まで完了しました。無料トライアルの消化ペースを見ながら、希望者への権限付与を順次進めています。
            </p>
          </div>
          <Link
            href="/guide#company-setup"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold self-start md:self-center"
          >
            手順を見る（導入ガイド）
          </Link>
        </div>

        {/* 全体進捗サマリーカード */}
        <SpotlightCard
          spotlightColor="rgba(6, 182, 212, 0.15)"
          className="bg-white border-slate-200/90 shadow-sm"
        >
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200/60 text-xs font-bold font-mono tracking-wider uppercase">
                    Project Schedule
                  </span>
                  <span className="text-xs text-slate-400 font-mono">最終更新: 2026年11月12日</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
                  AI Park 機能実装マイルストーン
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  準備中・PoC中・工事中となっている箇所を、内容がそろったものから順に公開していきます（予定日が「未定」のものは、決まり次第お知らせします）。
                </p>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4 bg-slate-50/80 border border-slate-200/90 p-3.5 rounded-2xl shrink-0">
                <div className="text-center px-2">
                  <div className="text-[11px] text-slate-500 font-semibold">全体タスク</div>
                  <div className="text-lg font-black text-slate-800 font-mono">
                    <AnimatedCounter value={totalTasks} /> 件
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center px-2">
                  <div className="text-[11px] text-emerald-600 font-semibold">公開・完了</div>
                  <div className="text-lg font-black text-emerald-600 font-mono">
                    <AnimatedCounter value={completedTasks} /> 件
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center px-2">
                  <div className="text-[11px] text-blue-600 font-semibold">進行中</div>
                  <div className="text-lg font-black text-blue-600 font-mono">
                    <AnimatedCounter value={inProgressTasks} /> 件
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center px-2">
                  <div className="text-[11px] text-amber-600 font-semibold">準備中</div>
                  <div className="text-lg font-black text-amber-600 font-mono">
                    <AnimatedCounter value={plannedTasks} /> 件
                  </div>
                </div>
              </div>
            </div>

            {/* プログレスバー */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Phase 1〜4 全体進行度</span>
                </span>
                <span className="font-black text-cyan-700 font-mono">
                  <AnimatedCounter value={progressPercentage} suffix="%" /> 完了
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* フェーズ概要バナー */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              <TiltCard maxTilt={5} glareOpacity={0.1} className="h-full rounded-2xl">
                <div onMouseEnter={() => playCyberHover()} className="p-4 rounded-2xl border border-emerald-200/90 bg-emerald-50/50 space-y-1.5 transition-all hover:bg-emerald-50/80 h-full cursor-default">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 px-2.5 py-0.5 bg-emerald-100/80 rounded-full border border-emerald-200 font-mono flex items-center space-x-1">
                      <span>✓</span>
                      <span>Phase 1 (完了)</span>
                    </span>
                    <span className="text-[11px] text-emerald-600 font-mono font-semibold">公開済み</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1">ポータル公開・学習基盤</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">トップ、導入ガイド、初級編チートシート、Academy、トラブル対処、Office Hour</p>
                </div>
              </TiltCard>

              <TiltCard maxTilt={5} glareOpacity={0.1} className="h-full rounded-2xl">
                <div onMouseEnter={() => playCyberHover()} className="p-4 rounded-2xl border border-emerald-200/90 bg-emerald-50/50 space-y-1.5 transition-all hover:bg-emerald-50/80 h-full cursor-default">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 px-2.5 py-0.5 bg-emerald-100/80 rounded-full border border-emerald-200 font-mono flex items-center space-x-1">
                      <span>✓</span>
                      <span>Phase 2 (完了・運用中)</span>
                    </span>
                    <span className="text-[11px] text-emerald-600 font-mono font-semibold">稼働中</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1">自動同期・利用監視・共創</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">AIニュース自動巡回、Antigravity利用監視、社内プロジェクト一覧、宣言ボード、カレンダー</p>
                </div>
              </TiltCard>

              <TiltCard maxTilt={5} glareOpacity={0.1} className="h-full rounded-2xl">
                <div onMouseEnter={() => playCyberHover()} className="p-4 rounded-2xl border border-blue-200/90 bg-blue-50/60 space-y-1.5 ring-2 ring-blue-500/20 transition-all hover:bg-blue-50/90 h-full cursor-default">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-800 px-2.5 py-0.5 bg-blue-100/80 rounded-full border border-blue-200 font-mono flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping mr-0.5" />
                      <span>Phase 3 (進行中)</span>
                    </span>
                    <span className="text-[11px] text-blue-600 font-mono font-semibold">現在進行中</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1">社内展開・確認・取材・公募</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">会社アカウント権限拡大、ご意見ボード連携、ツールシート確認、インタビュー取材、アンバサダー公募</p>
                </div>
              </TiltCard>

              <TiltCard maxTilt={5} glareOpacity={0.1} className="h-full rounded-2xl">
                <div onMouseEnter={() => playCyberHover()} className="p-4 rounded-2xl border border-amber-200/90 bg-amber-50/50 space-y-1.5 transition-all hover:bg-amber-50/80 h-full cursor-default">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-800 px-2.5 py-0.5 bg-amber-100/80 rounded-full border border-amber-200 font-mono">
                      Phase 4 (準備中)
                    </span>
                    <span className="text-[11px] text-amber-600 font-mono font-semibold">未定</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1">工事中ページの内容準備</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">社内AI活用状況の実データ、Subagents事例・Skills、ツール利用方針、AWS・MCP情報局</p>
                </div>
              </TiltCard>
            </div>
          </div>
        </SpotlightCard>

        {/* 📅 準備中・PoC中・工事中機能の正式稼働（解除）スケジュール（最重要セクション） */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono flex items-center space-x-1.5">
                  <Calendar size={13} className="text-emerald-400" />
                  <span>RELEASE TIMELINE</span>
                </span>
                <span className="text-xs text-slate-400">公開・解除に必要な条件一覧</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white mt-1.5 tracking-tight">
                📌 準備中・PoC中・工事中機能の正式稼働スケジュール
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                現在ポータル上で「準備中」「PoC中」「工事中」となっている全機能について、いつ正式稼働し注意書きが解除されるかのロードマップです。
              </p>
            </div>
            <span className="text-xs font-mono bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 text-slate-300 shrink-0 self-start sm:self-auto font-bold">
              全 {unverifiedReleaseSchedule.length} 機能
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {unverifiedReleaseSchedule.map((item, idx) => (
              <TiltCard
                key={idx}
                maxTilt={5}
                glareOpacity={0.08}
                className="h-full rounded-2xl"
              >
                <SpotlightCard
                  spotlightColor="rgba(56, 189, 248, 0.12)"
                  className="bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm h-full rounded-2xl"
                >
                  <div
                    onMouseEnter={() => playCyberHover()}
                    className="p-4 sm:p-5 flex flex-col justify-between space-y-3.5 h-full cursor-default"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-emerald-400 font-mono flex items-center space-x-1.5">
                          <Clock size={13} />
                          <span>{item.date}</span>
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${item.badgeColor}`}
                        >
                          {item.currentStatus}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-white text-sm sm:text-base">
                        {item.pageName}
                      </h4>

                      <p className="text-[11px] text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-slate-400 font-semibold block mb-0.5 font-mono">🔑 解除マイルストーン:</span>
                        {item.condition}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-mono font-medium">{item.phase}</span>
                      <Link
                        href={item.href}
                        onClick={() => playCyberClick()}
                        onMouseEnter={() => playCyberHover()}
                        className="inline-flex items-center space-x-1 text-cyan-300 hover:text-cyan-200 font-bold transition-colors cursor-pointer"
                      >
                        <span>該当画面を見る</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* フィルターバー */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-800">
            <Filter className="w-4 h-4 text-cyan-600" />
            <span>開発タスク詳細一覧 ({filteredTasks.length}件)</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-200/80 p-1 rounded-xl text-xs font-medium self-start sm:self-auto font-mono">
            <button
              onMouseEnter={() => playCyberHover()}
              onClick={() => {
                playCyberClick();
                setSelectedStatus("all");
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStatus === "all"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              すべて ({totalTasks})
            </button>
            <button
              onMouseEnter={() => playCyberHover()}
              onClick={() => {
                playCyberClick();
                setSelectedStatus("in-progress");
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStatus === "in-progress"
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              進行中 ({inProgressTasks})
            </button>
            <button
              onMouseEnter={() => playCyberHover()}
              onClick={() => {
                playCyberClick();
                setSelectedStatus("planned");
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStatus === "planned"
                  ? "bg-amber-500 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              準備中 ({plannedTasks})
            </button>
            <button
              onMouseEnter={() => playCyberHover()}
              onClick={() => {
                playCyberClick();
                setSelectedStatus("completed");
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStatus === "completed"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
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
              <TiltCard key={task.id} maxTilt={4} glareOpacity={0.08} className="h-full rounded-2xl">
                <SpotlightCard
                  spotlightColor="rgba(6, 182, 212, 0.12)"
                  className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
                >
                  <div
                    onMouseEnter={() => playCyberHover()}
                    className="p-6 flex flex-col justify-between space-y-4 h-full cursor-default"
                  >
                  <div className="space-y-3.5">
                    {/* ヘッダー */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xl p-2 bg-slate-100/90 border border-slate-200/70 rounded-xl shrink-0 shadow-2xs">
                          {task.icon}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 font-mono">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                task.phase === "Phase 1"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : task.phase === "Phase 2"
                                  ? "bg-blue-50 text-blue-800 border-blue-200"
                                  : task.phase === "Phase 3"
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : "bg-purple-50 text-purple-800 border-purple-200"
                              }`}
                            >
                              {task.phase}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{task.targetDate}</span>
                            </span>
                            {task.currentVerificationBadge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-700 border-slate-200">
                                現在: {task.currentVerificationBadge}
                              </span>
                            )}
                          </div>
                          <h3 className="font-extrabold text-slate-900 text-base mt-1.5">
                            {task.title}
                          </h3>
                        </div>
                      </div>

                      <div className="shrink-0 font-mono">
                        {isProgress && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1" />
                            <span>進行中</span>
                          </span>
                        )}
                        {task.status === "planned" && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                            <span>🚧 準備中</span>
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
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
                      <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 text-xs space-y-1">
                        <span className="text-[11px] font-bold text-slate-800 flex items-center space-x-1 font-mono">
                          <span>🎯</span>
                          <span>本番稼働（解除）マイルストーン:</span>
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                          {task.releaseCondition}
                        </p>
                      </div>
                    )}

                    {/* チェックリスト */}
                    <div className="bg-slate-50/60 rounded-xl p-3.5 border border-slate-200/70 space-y-2">
                      <div className="text-[11px] font-bold text-slate-800 font-mono">主な実装項目:</div>
                      <div className="space-y-1.5">
                        {task.items.map((item, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-xs">
                            {item.done ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0 mt-0.5 bg-white" />
                            )}
                            <span
                              className={item.done ? "text-slate-400 line-through" : "text-slate-700 font-medium"}
                            >
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* フッター / 画面リンク */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium font-mono">対象機能: {task.pageName}</span>
                    <Link
                      href={task.href}
                      onClick={() => playCyberClick()}
                      onMouseEnter={() => playCyberHover()}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-700 hover:text-cyan-800 transition-colors cursor-pointer"
                    >
                      <span>該当画面へ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </TiltCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
