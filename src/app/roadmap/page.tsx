"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import Link from "next/link";
import { useState } from "react";
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

const unverifiedReleaseSchedule: UnverifiedReleaseMilestone[] = [
  {
    date: "2026年10月2日(金)",
    pageName: "ご意見・改善ToDoボード",
    href: "/feedback-todo",
    currentStatus: "β版",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
    condition: "Google Chat / GitHub Issue 双方向自動同期の稼働をもって正式運用へ移行",
    phase: "Phase 1",
  },
  {
    date: "2026年10月9日(金)",
    pageName: "AIツール検証マトリックス",
    href: "/tools",
    currentStatus: "🧪 PoC中",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    condition: "社内Google SheetsマスターAPI自動同期 & 残ライセンス枠・申請フロー連携の完了",
    phase: "Phase 2",
  },
  {
    date: "2026年10月16日(金)",
    pageName: "現場のAI活用インタビュー",
    href: "/interviews",
    currentStatus: "📋 準備中",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
    condition: "デジタル推進部・クラウド開発チーム2編の実取材完了と第1弾記事の正式公開",
    phase: "Phase 2",
  },
  {
    date: "2026年10月23日(金)",
    pageName: "社内AIアンバサダー",
    href: "/ambassadors",
    currentStatus: "📋 準備中",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
    condition: "第1期アンバサダー公募選定・各事業部リーダーの正式登録と相談窓口の開設",
    phase: "Phase 2",
  },
  {
    date: "2026年10月30日(金)",
    pageName: "Subagents活用事例",
    href: "/agent-cases",
    currentStatus: "🧪 PoC中",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    condition: "実運用コードレビュー・障害解析エージェントの社内本番稼働実績・定量効果データの反映",
    phase: "Phase 2",
  },
  {
    date: "2026年11月13日(金)",
    pageName: "社内AI活用状況 & ROIシミュレータ",
    href: "/adoption",
    currentStatus: "🧪 PoC中",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    condition: "2026年Q3全社AI利用アンケートの集計結果および部署別実測ROIの反映",
    phase: "Phase 3",
  },
  {
    date: "2026年11月20日(金)",
    pageName: "利用状況ダッシュボード",
    href: "/gemini-stats",
    currentStatus: "🚧 工事中",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    condition: "社内BigQuery利用ログデータパイプライン接続 & 日次MAU実データ自動集計バッチの稼働",
    phase: "Phase 3",
  },
  {
    date: "2026年11月27日(金)",
    pageName: "AI Tools Hub & 申請フロー",
    href: "/tools-hub",
    currentStatus: "🚧 工事中",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    condition: "社内ワークフロー基盤（承認ルート・Slack通知）との本番接続・即時利用申請受付の開始",
    phase: "Phase 3",
  },
  {
    date: "2026年12月11日(金)",
    pageName: "全社共通基盤連携（SSO・Slack Bot）",
    href: "/",
    currentStatus: "進行中",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    condition: "全社SSO統合・Slack Bot更新自動通知・GitHub Discussions同期基盤の全面稼働",
    phase: "Phase 4",
  },
];

const tasksData: TaskItem[] = [
  // Phase 1: 完了・初期リリース
  {
    id: "portal-launch",
    title: "ポータル初期公開 & 生成AI学習コンテンツ",
    pageName: "生成AI学習コンテンツ",
    href: "/learning",
    phase: "Phase 1",
    targetDate: "2026年9月18日(金)",
    status: "completed",
    currentVerificationBadge: "公開中",
    releaseCondition: "全社員向けUdemy推奨講座・資格試験補助案内・基礎ガイドの公開完了",
    category: "interaction",
    icon: "✍️",
    description: "全社AI利用推進のための社内ポータル基盤を構築し、Udemy人気講座やGUGA/JDLA資格情報、Antigravity導入ガイドを公開しました。",
    items: [
      { text: "ポータルトップ・3ステップクイックスタートナビゲーション", done: true },
      { text: "Udemyおすすめ講座（Dify・エージェント）& 現場つまずき回避Tips", done: true },
      { text: "資格受験料補助案内（生成AIパスポート、G検定等）", done: true },
    ],
  },
  {
    id: "calendar-integration",
    title: "Office Hour予約のGoogleカレンダー連携",
    pageName: "Antigravity情報局",
    href: "/antigravity-info",
    phase: "Phase 1",
    targetDate: "2026年9月18日(金)",
    status: "completed",
    currentVerificationBadge: "公開中",
    releaseCondition: "AI CoE相談デスクの予約完了画面からGoogleカレンダーへの仮予定追加リンク生成の実機確認完了",
    category: "interaction",
    icon: "📅",
    description: "AI CoE相談デスクの予約完了画面から、ワンクリックでGoogleカレンダーに仮予定を追加できるリンク生成および予約メモコピー機能を実装しました。",
    items: [
      { text: "予約スロット選択時のGoogle Calendar追加リンク生成", done: true },
      { text: "予約確認メッセージ・事前質問の詳細メモコピー機能", done: true },
      { text: "入力項目（所属部署・相談テーマ・事前メモ）のUI最適化", done: true },
    ],
  },
  {
    id: "skills-hub-filter",
    title: "社内Skillsカタログの検索・申請機能",
    pageName: "社内Skillsカタログ",
    href: "/skills-hub",
    phase: "Phase 1",
    targetDate: "2026年10月2日(金)",
    status: "completed",
    currentVerificationBadge: "β版",
    releaseCondition: "Skill登録申請と社内プライベートレジストリ自動配信の接続完了",
    category: "interaction",
    icon: "🛠️",
    description: "現在社内で推奨されている主要Skillsを、カテゴリタブやキーワードで絞り込める検索機能および、エンジニアが自作SKILL.mdを共有・登録申請できるモーダルUIを実装しました。",
    items: [
      { text: "キーワード & カテゴリ（開発・分析・インフラ・セキュリティ）フィルター", done: true },
      { text: "新規Skill登録申請フォーム（モーダル） & テンプレート即時挿入", done: true },
      { text: "導入コマンド（agy CLI） & SKILL.md 定義内容ワンクリックコピー", done: true },
    ],
  },
  {
    id: "idea-board-interact",
    title: "アイデア宣言ボードの投稿・いいね機能",
    pageName: "アイデア宣言ボード",
    href: "/idea-board",
    phase: "Phase 1",
    targetDate: "2026年10月2日(金)",
    status: "completed",
    currentVerificationBadge: "β版",
    releaseCondition: "全社バックエンドDB永続化およびSlack共創通知連携の完了",
    category: "interaction",
    icon: "💡",
    description: "社内メンバーが自らAI活用のアイデアを起票し、いいねリアクションを送信できるUIを実装しました。検索・ステータス絞り込み機能も備えています。",
    items: [
      { text: "アイデア新規投稿フォーム（タイトル・概要・タグ・ステータス）", done: true },
      { text: "リアルタイムいいねカウント & トグルリアクション", done: true },
      { text: "ステータス別（検証中 / アイデア募集中 / 本番開発中）タブ切替 & キーワード検索", done: true },
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
      { text: "Google Chat Webhook（GOOGLE_CHAT_WEBHOOK_URL）の本番設定と通知の実機確認", done: false },
    ],
  },
  // Phase 2: ツール連携 & コミュニティ（現在進行中）
  {
    id: "tools-sheets-sync",
    title: "AIツール検証マトリックスの社内シート自動同期",
    pageName: "AIツール一覧",
    href: "/tools",
    phase: "Phase 2",
    targetDate: "2026年10月9日(金)",
    status: "in-progress",
    currentVerificationBadge: "🧪 PoC中",
    releaseCondition: "社内Google SheetsマスターAPI自動同期 & 残ライセンス枠・申請フロー連携の完了",
    category: "data",
    icon: "🤖",
    description: "19種類のAIツールの適合度評価・残ライセンス枠・セキュリティ区分を、社内Google SheetsマスターAPIから日次自動同期し、リアルタイム残枠を反映します。",
    items: [
      { text: "マトリクス適合度・4象限ポジションUIプロトタイプ構築", done: true },
      { text: "社内Google Sheets APIとの同期サービス・Webhook設計", done: false },
      { text: "ライセンス残枠のリアルタイム取得 & 各部署向け枠管理連携", done: false },
    ],
  },
  {
    id: "interviews-first-edition",
    title: "現場のAI活用インタビュー 第1弾（2編）取材・公開",
    pageName: "AI活用インタビュー",
    href: "/interviews",
    phase: "Phase 2",
    targetDate: "2026年10月16日(金)",
    status: "in-progress",
    currentVerificationBadge: "📋 準備中",
    releaseCondition: "デジタル推進部・クラウド開発チーム2編の実取材完了と第1弾記事の正式公開",
    category: "community",
    icon: "🎙️",
    description: "社内業務でAIツールを実践導入している社員への直接取材を実施し、実際の工数削減成果、直面した課題、プロンプトの工夫をインタビュー記事として正式公開します。",
    items: [
      { text: "インタビュー記事フォーマット & 取材立候補フォームUI構築", done: true },
      { text: "デジタル推進部・クラウド開発チームへの実務取材実施（2件）", done: false },
      { text: "記事校正・関係者レビュー完了後の正式公開", done: false },
    ],
  },
  {
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
    description: "各事業部・開発チームでAI活用をリードする「AIアンバサダー」を正式公募・選定し、各メンバーの得意技術（LLM、プロンプト、MCP）とSlack直通相談窓口を開設します。",
    items: [
      { text: "アンバサダー紹介UI & 公募応募フォームのプロトタイプ構築", done: true },
      { text: "第1期アンバサダーの全社公募・選定（各事業部より6名）", done: false },
      { text: "各アンバサダーのSlack相談チャンネル（#ask-coe-*）正式稼働", done: false },
    ],
  },
  {
    id: "subagent-cases",
    title: "Subagents活用事例の実運用ログ & 定量効果データ反映",
    pageName: "Subagents活用事例",
    href: "/agent-cases",
    phase: "Phase 2",
    targetDate: "2026年10月30日(金)",
    status: "in-progress",
    currentVerificationBadge: "🧪 PoC中",
    releaseCondition: "実運用コードレビュー・障害解析エージェントの社内本番稼働実績・定量効果データの反映",
    category: "community",
    icon: "🟣",
    description: "MightyLINK社内の本番CI/CDやSRE環境で稼働する自律並列Subagentsの実行ログと、実測された月間削減時間・一次切り分け精度データを反映します。",
    items: [
      { text: "4ステップ自律エージェント処理フロー & プロンプト構成UI構築", done: true },
      { text: "SRE障害調査エージェントの本番実測メトリクス（月間削減時間等）集計", done: false },
      { text: "全社事例投稿・ナレッジ共有ワークフローの本番稼働", done: false },
    ],
  },

  // Phase 3: データ可視化 & 申請承認基盤（準備中）
  {
    id: "adoption-metrics",
    title: "全社AI活用状況 2026年Q3アンケート集計 & 実測ROI反映",
    pageName: "社内AI活用状況",
    href: "/adoption",
    phase: "Phase 3",
    targetDate: "2026年11月13日(金)",
    status: "planned",
    currentVerificationBadge: "🧪 PoC中",
    releaseCondition: "2026年Q3全社AI利用アンケートの集計結果および部署別実測ROIの反映",
    category: "data",
    icon: "👀",
    description: "2026年Q3に全社員を対象に実施するAI活用実態アンケートの集計結果と、部署別の年間削減工数・コストROI実測値をダッシュボードに反映します。",
    items: [
      { text: "リアルタイムROI試算シミュレータUIの実装完了", done: true },
      { text: "2026年Q3全社AI活用アンケートの実施・回収（目標回収率80%）", done: false },
      { text: "部署別アクティブ活用率および社員満足度実データの正式反映", done: false },
    ],
  },
  {
    id: "gemini-stats-realtime",
    title: "利用状況ダッシュボードの社内BigQueryパイプライン本番接続",
    pageName: "利用状況ダッシュボード",
    href: "/gemini-stats",
    phase: "Phase 3",
    targetDate: "2026年11月20日(金)",
    status: "planned",
    currentVerificationBadge: "🚧 工事中",
    releaseCondition: "社内BigQuery利用ログデータパイプライン接続 & 日次MAU実データ自動集計バッチの稼働",
    category: "data",
    icon: "💎",
    description: "Gemini Enterprise および Antigravity の監査ログを格納する社内BigQueryと接続し、日次・月次の実アクティブユーザー数（MAU）やプロンプト消費推移を自動集計します。",
    items: [
      { text: "集計期間切替・部署フィルタ・CSV入出力UIの実装完了", done: true },
      { text: "BigQuery監査ログ集計マテリアライズドビューの構築", done: false },
      { text: "日次データ同期パイプライン（Cloud Composer / Cloud Functions）本番稼働", done: false },
    ],
  },
  {
    id: "tools-hub-guide",
    title: "AI Tools Hubの社内申請承認基盤（Slack連携）本番接続",
    pageName: "AI Tools Hub",
    href: "/tools-hub",
    phase: "Phase 3",
    targetDate: "2026年11月27日(金)",
    status: "planned",
    currentVerificationBadge: "🚧 工事中",
    releaseCondition: "社内ワークフロー基盤（承認ルート・Slack通知）との本番接続・即時利用申請受付の開始",
    category: "data",
    icon: "📍",
    description: "公認AIツールの利用申請フォームを社内ワークフロー基盤および承認Slack通知と接続し、申請からライセンス即時発行までの自動承認ルートを稼働させます。",
    items: [
      { text: "セキュリティ基準早見表 & 申請モーダルUIの実装完了", done: true },
      { text: "社内ワークフローAPI（マネージャー承認ルート）とのWebhook接続", done: false },
      { text: "Slackでのワンクリック承認 & ライセンスキー自動発行Bot稼働", done: false },
    ],
  },

  // Phase 4: 全社システム連携基盤（準備中）
  {
    id: "slack-github-integration",
    title: "全社共通基盤連携（SSO・Slack Bot通知・GitHub同期）",
    pageName: "全社連携基盤",
    href: "/",
    phase: "Phase 4",
    targetDate: "2026年12月11日(金)",
    status: "planned",
    currentVerificationBadge: "進行中",
    releaseCondition: "全社SSO統合・Slack Bot更新自動通知・GitHub Discussions同期基盤の全面稼働",
    category: "system",
    icon: "⚡",
    description: "社内Slack（#ai-park）への更新通知Botや、GitHub Discussions / Issueとの自動双方向同期、社内SSO組織マスターとの権限連携を整備します。",
    items: [
      { text: "新規Skill・事例公開時のSlack自動アナウンスBot", done: false },
      { text: "アイデア宣言ボードとGitHub Discussionsの双方向同期", done: false },
      { text: "社内SSO / 組織マスターとのアクセス制御連携", done: false },
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
                準備中・PoC中・工事中となっている箇所を、優先度順に具体的な期日をもって順次本番機能としてリリースしていきます。
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
                {progressPercentage}% 完了 (Phase 1 完了 / Phase 2 進行中)
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
              <p className="text-[11px] text-slate-600">トップ、Udemy学習教材、OfficeHour連携、Skills/アイデアUI</p>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 space-y-1 ring-2 ring-blue-500/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-800 px-2 py-0.5 bg-blue-100 rounded flex items-center space-x-1">
                  <span>🔵</span>
                  <span>Phase 2 (進行中)</span>
                </span>
                <span className="text-[10px] text-blue-600 font-medium">10月中</span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs mt-1">ツール連携 & コミュニティ</h4>
              <p className="text-[11px] text-slate-600">Sheets自動同期、インタビュー取材公開、アンバサダー、Subagents実測</p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800 px-2 py-0.5 bg-amber-100 rounded">
                  Phase 3 (準備中)
                </span>
                <span className="text-[10px] text-amber-600 font-medium">11月中</span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs mt-1">データ可視化 & 申請承認基盤</h4>
              <p className="text-[11px] text-slate-600">全社AI活用アンケート、BigQueryログ接続、ToolsHub承認基盤</p>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-800 px-2 py-0.5 bg-purple-100 rounded">
                  Phase 4 (企画中)
                </span>
                <span className="text-[10px] text-purple-600 font-medium">12月中旬〜</span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs mt-1">全社システム連携基盤</h4>
              <p className="text-[11px] text-slate-600">全社SSO統合、Slack Bot自動通知、Discussions同期</p>
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
              全 {unverifiedReleaseSchedule.length} 機能の期日設定完了
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
