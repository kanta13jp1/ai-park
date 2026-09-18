"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import BookingModal from "@/components/BookingModal";
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  Award,
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
  Video,
  Presentation,
  Check,
  ChevronRight,
  GraduationCap,
  Layers,
} from "lucide-react";
import { useState, useEffect } from "react";

interface CourseItem {
  id: string;
  title: string;
  level: "全社員" | "初級" | "中級" | "エンジニア向け";
  duration: string;
  format: string;
  description: string;
  modules: string[];
  slideUrl?: string;
  videoUrl?: string;
  completed: boolean;
}

const initialCourses: CourseItem[] = [
  {
    id: "security-basics",
    title: "【必修】MightyLINK 社内AI利用規約 & セキュリティ基礎",
    level: "全社員",
    duration: "25分",
    format: "e-Learning (動画 + 確認テスト)",
    description:
      "社内データを安全に取り扱うためのセキュリティガイドライン、個人情報・機密情報のマスキング、著作権・利用許諾の重要ポイントを網羅します。",
    modules: ["生成AI利用の社内基本原則", "機密情報・コード送信のルール", "著作権・成果物の商用利用基準", "確認テスト (全10問)"],
    slideUrl: "#",
    videoUrl: "#",
    completed: true,
  },
  {
    id: "antigravity-onboarding",
    title: "Google Antigravity IDE / CLI 導入 & スラッシュコマンド実践",
    level: "初級",
    duration: "40分",
    format: "ハンズオン動画教材",
    description:
      "次世代開発基盤 Antigravity のインストールから、VS Code連携、CLI (agy) の基本コマンド、スラッシュコマンド（/goal, /browser 等）の使い方を習得します。",
    modules: ["Antigravity アーキテクチャ概要", "agy コマンドの初期設定", "スラッシュコマンド活用テクニック", "Gemini 3.1 Pro モデル切り替え"],
    slideUrl: "#",
    videoUrl: "#",
    completed: false,
  },
  {
    id: "skills-rules-authoring",
    title: "社内業務特化 Skills & Rules 開発マスター講座",
    level: "中級",
    duration: "60分",
    format: "ハンズオン教材 & サンプルコード",
    description:
      "コーディング規約や自社特有の設計ルールをAIに遵守させる `RULE` の書き方と、繰り返し業務を自動化する `SKILL.md` の設計・カタログ登録手順を学びます。",
    modules: ["Antigravity カスタマイズの仕組み", "SKILL.md の構造とパラメータ定義", "破壊的操作防止ルールの実装", "社内カタログへの申請フロー"],
    slideUrl: "#",
    videoUrl: "#",
    completed: false,
  },
  {
    id: "subagents-mcp-advanced",
    title: "MCP (Model Context Protocol) ツール連携 & Subagents 並列実行",
    level: "エンジニア向け",
    duration: "75分",
    format: "高度アーキテクチャ講義 + 演習",
    description:
      "社内DBやGitHub、外部APIをAIエージェントに直結するMCPサーバーの構築手法と、自律型Subagents（並列サブエージェント）のオーケストレーションを習得します。",
    modules: ["MCP プロトコルの基本構造", "自作 MCP サーバーの実装 (TypeScript/Python)", "Subagents への役割分担プロンプト設計", "並列実行時のエラーハンドリング"],
    slideUrl: "#",
    videoUrl: "#",
    completed: false,
  },
  {
    id: "bigquery-data-analysis",
    title: "BigQuery × Gemini によるデータ分析・SQL自動最適化",
    level: "中級",
    duration: "45分",
    format: "動画 + 実践クエリ演習",
    description:
      "膨大な社内データウェアハウスからBigQueryとGeminiを活用して高速にインサイトを抽出するクエリ自動生成手法と、コストを抑制するSQL最適化ルールを学習します。",
    modules: ["自然言語からのSQL生成", "パーティション・クラスタリング最適化", "BigQuery ML 簡易モデル構築", "可視化ダッシュボード連携"],
    slideUrl: "#",
    videoUrl: "#",
    completed: false,
  },
];

const workshops = [
  {
    date: "2026年9月10日",
    title: "第3回 Antigravity 開発者ハンズオン (CLI & Subagents 実践編)",
    speaker: "AI CoE テクニカルリード 高橋",
    slides: "38 pages (PDF)",
    videoDuration: "52分",
  },
  {
    date: "2026年8月22日",
    title: "全社生成AI推進勉強会：日常業務を10倍効率化するプロンプト術",
    speaker: "DX推進部 佐藤",
    slides: "45 pages (PDF)",
    videoDuration: "45分",
  },
  {
    date: "2026年7月30日",
    title: "セキュアなAI利活用シンポジウム：社内機密情報と知的財産保護",
    speaker: "品質保証・セキュリティ統括部 田中",
    slides: "30 pages (PDF)",
    videoDuration: "40分",
  },
];

export default function LearningPage() {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const toggleCourseCompletion = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  const completedCount = courses.filter((c) => c.completed).length;
  const progressPercent = Math.round((completedCount / courses.length) * 100);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="学習リソース & 勉強会アーカイブ"
        subtitle="MightyLINK 全社員向け基礎教育からエンジニア向け高度エージェント開発教材まで"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* バナー: Phase 2 稼働 */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-emerald-200/60 text-emerald-800 rounded-lg shrink-0 mt-0.5">
              <GraduationCap className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-emerald-950 flex items-center space-x-1">
                  <span>📚</span>
                  <span>公式カリキュラム & 勉強会アーカイブ公開中</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-semibold text-[10px]">
                  Phase 2 機能稼働
                </span>
              </div>
              <p className="text-emerald-800/90 leading-relaxed">
                全社員向けの必修リテラシーから、Antigravity・MCP・自律エージェントの本格的な実装ハンズオンまで体系的に学習できます。
              </p>
            </div>
          </div>
        </div>

        {/* 受講進捗バー */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>あなたの学習進捗ステータス</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                必修講座および推奨講座を受講し、受講完了チェックをつけてください。
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium">完了コース: </span>
              <span className="text-base font-bold text-slate-900">
                {completedCount} / {courses.length}
              </span>
              <span className="text-xs text-emerald-600 font-bold ml-2">
                ({progressPercent}%)
              </span>
            </div>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* コース一覧 */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>カリキュラム一覧</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          course.level === "全社員"
                            ? "bg-rose-100 text-rose-800"
                            : course.level === "初級"
                            ? "bg-blue-100 text-blue-800"
                            : course.level === "中級"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {course.level}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{course.duration}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => toggleCourseCompletion(course.id)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                        course.completed
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Check size={12} className={course.completed ? "text-emerald-600" : "text-slate-400"} />
                      <span>{course.completed ? "受講完了" : "未完了"}</span>
                    </button>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{course.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{course.description}</p>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 block">学習モジュール:</span>
                    <ul className="space-y-1">
                      {course.modules.map((mod, idx) => (
                        <li key={idx} className="flex items-center space-x-1.5 text-slate-700 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">{course.format}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => alert(`「${course.title}」の講義スライドを開きます（社内Google Drive）`)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-[11px] transition-colors"
                    >
                      <Presentation size={12} />
                      <span>スライド</span>
                    </button>
                    <button
                      onClick={() => alert(`「${course.title}」の録画動画を再生します（社内ストリーミング）`)}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-[11px] transition-colors shadow-2xs"
                    >
                      <PlayCircle size={12} />
                      <span>受講する</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 社内勉強会アーカイブ */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
            <Video className="w-5 h-5 text-purple-600" />
            <span>社内勉強会・ハンズオンアーカイブ</span>
          </h3>

          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
            {workshops.map((ws, idx) => (
              <div
                key={idx}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span>{ws.date}</span>
                    <span>•</span>
                    <span>講師: {ws.speaker}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{ws.title}</h4>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => alert(`「${ws.title}」のスライド（${ws.slides}）を開きます。`)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    <FileText size={13} />
                    <span>資料 ({ws.slides})</span>
                  </button>
                  <button
                    onClick={() => alert(`「${ws.title}」の録画（${ws.videoDuration}）を再生します。`)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-medium transition-colors"
                  >
                    <PlayCircle size={13} />
                    <span>録画を視聴 ({ws.videoDuration})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 学習相談CTA */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-800 text-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-base">チーム向け個別ハンズオン・勉強会の開催受付中</h4>
            <p className="text-xs text-slate-300">
              「自チームのメンバー向けにAntigravityの入門勉強会を開催してほしい」「自社ドメインのSkills作成ワークショップを行いたい」といったご要望はCoEまでご相談ください。
            </p>
          </div>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="shrink-0 inline-flex items-center space-x-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm self-start md:self-center"
          >
            <span>勉強会・ハンズオンの開催を相談する</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Office Hour 予約モーダル */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
