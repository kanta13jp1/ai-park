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
  targetDate: string;
  status: "completed" | "in-progress" | "planned";
  category: "interaction" | "community" | "data" | "system";
  icon: string;
  description: string;
  items: { text: string; done: boolean }[];
}

const tasksData: TaskItem[] = [
  // Phase 1
  {
    id: "skills-hub-filter",
    title: "社内Skillsカタログの検索・申請機能",
    pageName: "社内Skillsカタログ",
    href: "/skills-hub",
    phase: "Phase 1",
    targetDate: "2026年9月下旬 (W1)",
    status: "in-progress",
    category: "interaction",
    icon: "🛠️",
    description: "現在サンプル展示中の社内Skillsを、タグ・カテゴリで絞り込める検索機能および、エンジニアが自身の作成したSKILL.mdを共有・登録申請できるモーダルUIを実装します。",
    items: [
      { text: "キーワード & カテゴリ（開発・分析・インフラ）フィルター", done: false },
      { text: "新規Skill登録申請フォーム（モーダル）の追加", done: false },
      { text: "公式SKILL.md作成ガイド & テンプレート即時コピー機能", done: true },
    ],
  },
  {
    id: "idea-board-interact",
    title: "アイデア宣言ボードの投稿・いいね機能",
    pageName: "アイデア宣言ボード",
    href: "/idea-board",
    phase: "Phase 1",
    targetDate: "2026年9月下旬 (W2)",
    status: "in-progress",
    category: "interaction",
    icon: "💡",
    description: "社内メンバーが自らAI活用のアイデアを起票し、いいねリアクションを送信できるUIを実装します。ブラウザ内に一時保存しつつ、社内Slackとの連携導線を整備します。",
    items: [
      { text: "アイデア新規投稿フォーム（タイトル・概要・タグ・ステータス）", done: false },
      { text: "リアルタイムいいねカウントのインタラクション", done: false },
      { text: "ステータス別（検証中 / アイデア募集中 / 本番開発中）タブ切替", done: true },
    ],
  },
  {
    id: "calendar-integration",
    title: "Office Hour予約のGoogleカレンダー連携",
    pageName: "Antigravity情報局",
    href: "/antigravity-info",
    phase: "Phase 1",
    targetDate: "2026年10月上旬 (W2)",
    status: "in-progress",
    category: "interaction",
    icon: "📅",
    description: "AI CoE相談デスクの予約完了画面から、ワンクリックでGoogleカレンダーやOutlookに予定を追加できるリンク生成機能を実装します。",
    items: [
      { text: "予約スロット選択時のGoogle Calendar追加リンク生成", done: false },
      { text: "予約確認メッセージ・事前質問の下書きコピー機能", done: false },
      { text: "予約履歴のブラウザローカル保存とキャンセル機能", done: false },
    ],
  },

  // Phase 2
  {
    id: "ambassadors-page",
    title: "社内AIアンバサダー紹介ネットワーク",
    pageName: "AIアンバサダー",
    href: "/ambassadors",
    phase: "Phase 2",
    targetDate: "2026年10月上旬 (W3)",
    status: "planned",
    category: "community",
    icon: "🤝",
    description: "各事業部・開発チームでAI活用をリードする「AIアンバサダー」のメンバー一覧、得意技術スタック（フロント、バックエンド、データ分析）、相談窓口を公開します。",
    items: [
      { text: "アンバサダープロフィールカード（所属・技術・アバター）", done: false },
      { text: "得意分野別（LLMアプリ、プロンプト、MCP開発）タグ検索", done: false },
      { text: "アンバサダーへの質問・壁打ち依頼ボタン（Slack連携）", done: false },
    ],
  },
  {
    id: "subagent-cases",
    title: "Subagents活用事例アーキテクチャ詳細",
    pageName: "Subagents活用事例",
    href: "/agent-cases",
    phase: "Phase 2",
    targetDate: "2026年10月中旬 (W3)",
    status: "planned",
    category: "community",
    icon: "🟣",
    description: "MightyLINK社内ですでに稼働・PoC中の自律型Subagents（コード自動レビュー、障害影響分析、仕様書生成）のアーキテクチャ図と定量効果を詳細掲載します。",
    items: [
      { text: "エージェント構成図（Mermaid図）のインタラクティブ表示", done: false },
      { text: "システムプロンプトの構成例 & 設計ベストプラクティス", done: false },
      { text: "導入前後の工数削減実績（メトリクス）グラフの配置", done: false },
    ],
  },
  {
    id: "learning-resources",
    title: "学習リソース & 勉強会アーカイブ",
    pageName: "学習リソース",
    href: "/learning",
    phase: "Phase 2",
    targetDate: "2026年10月中旬 (W4)",
    status: "planned",
    category: "community",
    icon: "📚",
    description: "過去に社内開催されたAntigravityハンズオン、プロンプト勉強会の録画アーカイブやスライド資料を体系化して集約します。",
    items: [
      { text: "初級・中級・上級別のステップアップ学習ロードマップ", done: false },
      { text: "社内勉強会スライド & YouTube/Drive録画への直リンク", done: false },
      { text: "おすすめ外部認定資格（Google Cloud GenAI認定等）ガイド", done: false },
    ],
  },

  // Phase 3
  {
    id: "gemini-stats-realtime",
    title: "利用状況ダッシュボードの動的フィルタ & エクスポート",
    pageName: "利用状況ダッシュボード",
    href: "/gemini-stats",
    phase: "Phase 3",
    targetDate: "2026年10月下旬 (W5)",
    status: "planned",
    category: "data",
    icon: "💎",
    description: "現在固定モックデータとなっているグラフに、期間切り替え（日次・週次・月次）や部署別フィルタ、CSVインポート/エクスポート機能を実装します。",
    items: [
      { text: "集計期間セレクター（過去7日間 / 30日間 / 3ヶ月）", done: false },
      { text: "部署・チーム別のアクティブ利用率フィルター", done: false },
      { text: "社内利用集計データのCSVエクスポート機能", done: false },
    ],
  },
  {
    id: "adoption-metrics",
    title: "社内AI活用状況 & ROIシミュレータ",
    pageName: "社内AI活用状況",
    href: "/adoption",
    phase: "Phase 3",
    targetDate: "2026年10月下旬 (W6)",
    status: "planned",
    category: "data",
    icon: "👀",
    description: "全社的なAIツールの導入率、アンケートに基づく満足度推移、推定削減工数（月間合計時間）を可視化するダッシュボードを新設します。",
    items: [
      { text: "事業部別のAIツール利用浸透度グラフ", done: false },
      { text: "「削減できた工数」を試算する簡易ROIシミュレータ", done: false },
      { text: "定期社内アンケート結果サマリーの自動反映エリア", done: false },
    ],
  },
  {
    id: "tools-hub-guide",
    title: "AI Tools Hub & 申請フローの整備",
    pageName: "AI Tools Hub",
    href: "/tools-hub",
    phase: "Phase 3",
    targetDate: "2026年11月上旬 (W6)",
    status: "planned",
    category: "data",
    icon: "📍",
    description: "社内で利用可能な各種生成AIツール（Antigravity, Gemini Code Assist, ChatGPT Enterprise, Claude等）の利用規約・セキュリティ区分・アカウント申請手順を整理します。",
    items: [
      { text: "ツール別セキュリティ基準（機密情報取扱い可否マトリクス）", done: false },
      { text: "ライセンス利用申請フォームへのワンクリック導線", done: false },
      { text: "各ツールの利用推奨ユースケース比較表", done: false },
    ],
  },

  // Phase 4
  {
    id: "slack-github-integration",
    title: "全社共通基盤連携（Slack / GitHub Discussions）",
    pageName: "全社連携基盤",
    href: "/",
    phase: "Phase 4",
    targetDate: "2026年11月中旬以降",
    status: "planned",
    category: "system",
    icon: "⚡",
    description: "社内Slack（#ai-park）への更新通知Botや、GitHub Discussions / Issueとの自動双方向同期を整備します。",
    items: [
      { text: "新規Skill公開時のSlack自動アナウンスBot", done: false },
      { text: "アイデア宣言ボードとGitHub Discussionsの双方向同期", done: false },
      { text: "社内SSO / 組織マスターとのアクセス制御連携検討", done: false },
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
    ((completedTasks + inProgressTasks * 0.3) / totalTasks) * 100
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
                <span className="text-xs text-slate-500">最終更新: 2026年9月18日</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                AI Park 機能実装マイルストーン
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                準備中・モックとなっている箇所を、優先度順に順次本番機能としてリリースしていきます。
              </p>
            </div>

            <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
              <div className="text-center px-2">
                <div className="text-xs text-slate-500 font-medium">全体タスク</div>
                <div className="text-lg font-bold text-slate-800">{totalTasks} 件</div>
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
              <span className="font-bold text-cyan-700">{progressPercentage}% 完了 (Phase 1 進行中)</span>
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
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-800 px-2 py-0.5 bg-blue-100 rounded">
                  Phase 1 (進行中)
                </span>
                <span className="text-[10px] text-blue-600 font-medium">9月下旬〜</span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs mt-1">インタラクション・申請</h4>
              <p className="text-[11px] text-slate-600">Skills検索、アイデア投稿、OfficeHourカレンダー連携</p>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 px-2 py-0.5 bg-emerald-100 rounded">
                  Phase 2 (予定)
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">10月上旬〜</span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs mt-1">コミュニティ & 事例</h4>
              <p className="text-[11px] text-slate-600">アンバサダー紹介、Subagents事例詳細、学習教材</p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800 px-2 py-0.5 bg-amber-100 rounded">
                  Phase 3 (予定)
                </span>
                <span className="text-[10px] text-amber-600 font-medium">10月下旬〜</span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs mt-1">データ可視化 & 分析</h4>
              <p className="text-[11px] text-slate-600">利用統計フィルタ、全社AI活用率、ToolsHub整備</p>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-800 px-2 py-0.5 bg-purple-100 rounded">
                  Phase 4 (予定)
                </span>
                <span className="text-[10px] text-purple-600 font-medium">11月中旬〜</span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs mt-1">システム連携基盤</h4>
              <p className="text-[11px] text-slate-600">Slack Bot通知、Discussions同期、SSO連携</p>
            </div>
          </div>
        </div>

        {/* フィルターバー */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-slate-800">
            <Filter className="w-4 h-4 text-slate-500" />
            <span>対応タスク一覧 ({filteredTasks.length}件)</span>
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
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              task.phase === "Phase 1"
                                ? "bg-blue-100 text-blue-800"
                                : task.phase === "Phase 2"
                                ? "bg-emerald-100 text-emerald-800"
                                : task.phase === "Phase 3"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {task.phase}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{task.targetDate}</span>
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mt-1">
                          {task.title}
                        </h3>
                      </div>
                    </div>

                    <div>
                      {isProgress && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">
                          <span>🔵</span>
                          <span>進行中</span>
                        </span>
                      )}
                      {task.status === "planned" && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <span>🚧</span>
                          <span>準備中</span>
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
                            className={item.done ? "text-slate-500 line-through" : "text-slate-700"}
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
                  <span className="text-xs text-slate-500">対象: {task.pageName}</span>
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
