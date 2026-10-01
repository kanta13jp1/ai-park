"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import { playCyberClick } from "@/lib/sound";
import {
  Wrench,
  Search,
  Sparkles,
  Terminal,
  Code2,
  Database,
  SearchCode,
  Workflow,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Filter,
  CheckCircle2,
  Tag,
  PlusCircle,
  FileCode2,
  Layers,
  ChevronRight,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { useState, useMemo } from "react";

export interface SkillItem {
  id: string;
  name: string;
  title: string;
  category: "dev" | "data" | "research" | "infra" | "workflow";
  description: string;
  triggerPrompt: string;
  commandSnippet: string;
  tags: string[];
  recommendedModel: string;
  author: string;
  verified: boolean;
  docUrl?: string;
  sampleOutput: string;
}

const SKILL_CATEGORIES = [
  { id: "all", label: "すべて", icon: Layers },
  { id: "dev", label: "開発・コード生成", icon: Code2 },
  { id: "data", label: "データ分析・SQL", icon: Database },
  { id: "research", label: "リサーチ・設計", icon: SearchCode },
  { id: "infra", label: "クラウド・インフラ", icon: Cpu },
  { id: "workflow", label: "業務効率化", icon: Workflow },
];

const OFFICIAL_SKILLS: SkillItem[] = [
  {
    id: "tech-to-prod",
    name: "tech-to-production-pipeline",
    title: "本番デプロイ・CI検証自動化スキル",
    category: "dev",
    description: "最新技術リサーチから本番アプリへの安全な機能導入、Fail-Openフォールバック、Issue/PR発行、CI検証、本番自動デプロイまでを一気通貫で反復実行する標準ワークフロー。",
    triggerPrompt: "最新機能の調査結果をもとに、Fail-Openフォールバック付きで本番デプロイパイプラインを実行して",
    commandSnippet: "view_file /skills/tech-to-production-pipeline/SKILL.md",
    tags: ["Next.js", "CI/CD", "GitHub Actions", "本番運用"],
    recommendedModel: "Gemini 3.1 Pro / 3.8 Flash",
    author: "AI推進担当",
    verified: true,
    sampleOutput: "✅ テスト実行完了 → ✅ ビルド成功 (3.0s) → ✅ Gitコミット & PR発行 → ✅ 本番環境へ自動デプロイ完了"
  },
  {
    id: "bigquery-sql",
    name: "bigquery-sql",
    title: "BigQuery 高度SQL最適化 & コスト削減",
    category: "data",
    description: "BigQuery SQLクエリの実行効率化、スキャン量削減、パーティション/クラスタリング最適化、およびクエリコストを最小化するチューニングルールを適用します。",
    triggerPrompt: "このBigQueryの集計クエリのスキャンデータ量を削減し、実行速度をチューニングして",
    commandSnippet: "view_file /skills/bigquery-sql/SKILL.md",
    tags: ["BigQuery", "SQL", "コスト削減", "パフォーマンス"],
    recommendedModel: "Gemini 3.1 Pro",
    author: "社内データエンジニア",
    verified: true,
    sampleOutput: "スキャン量を 1.4 TB → 18 MB (98.7% 削減) に圧縮。月間推定コスト約 $7.2 削減を達成。"
  },
  {
    id: "model-router",
    name: "model-router",
    title: "最適AIモデル自動ルーティング",
    category: "workflow",
    description: "ユーザーの指示やタスク内容（規模・難易度・コンテキスト量・速度要件）を自動判別し、Flash / Pro / サブエージェント実行モードを自動選定します。",
    triggerPrompt: "このタスクの規模と難易度を評価し、最適な基盤モデルを選定して実行して",
    commandSnippet: "view_file /skills/model-router/SKILL.md",
    tags: ["マルチモデル", "コスト最適化", "Gemini 3.8", "ルーティング"],
    recommendedModel: "自動選定",
    author: "AI推進担当",
    verified: true,
    sampleOutput: "選定結果: 単純なデータ変換のため『Gemini 3.8 Flash』を選択。処理時間 0.4s で完了。"
  },
  {
    id: "oss-architect",
    name: "oss-first-architect",
    title: "OSSファースト設計 & 車輪の再発明防止",
    category: "research",
    description: "新規機能開発の着手前に、GitHub上の既存OSSや成熟ライブラリを探索・評価し、車輪の再発明を防いで最もシンプルなMVP実装方針を策定します。",
    triggerPrompt: "この機能を自前で作る前に、GitHub上でデファクトスタンダードになっているOSSを調査して比較して",
    commandSnippet: "view_file /skills/oss-first-architect/SKILL.md",
    tags: ["アーキテクチャ", "GitHub", "OSS", "車輪の再発明防止"],
    recommendedModel: "Gemini 3.1 Pro",
    author: "AI推進担当",
    verified: true,
    sampleOutput: "自作工数 約3人月 → 成熟OSS (Lucide/Tailwind) 採用により実装期間 0.5日に短縮。"
  },
  {
    id: "ui-ux-review",
    name: "world-class-ui-ux-review",
    title: "厳格UI/UXデザイン整合性レビュー",
    category: "dev",
    description: "画面遷移、重複ナビゲーション検知、モバイルレスポンシブ、垂直スタックの破綻、デザインシステムのトークン準拠を徹底的に自動検査します。",
    triggerPrompt: "このページのUI/UXをレビューし、ナビゲーションの不整合やモバイルでの崩れがないか監査して",
    commandSnippet: "view_file /skills/world-class-ui-ux-review/SKILL.md",
    tags: ["UI/UX", "Tailwind CSS", "アクセシビリティ", "品質保証"],
    recommendedModel: "Gemini 3.1 Pro",
    author: "フロントエンド推進",
    verified: true,
    sampleOutput: "監査スコア: 96/100。ヘッダーの重なり不具合1件を検出し自動修正PRを作成。"
  },
  {
    id: "data-loss-prevention",
    name: "accidental-data-loss-prevention",
    title: "データ破壊・誤操作完全防止ガード",
    category: "infra",
    description: "DROP TABLE、TRUNCATE、広範囲DELETE、ストレージバケット削除などの不可逆な破壊操作を未然に検知し、人間の明示的な同意を強制する安全ガードレール。",
    triggerPrompt: "本番環境に対してマイグレーションSQLを実行する前に、データ損失リスクを検査して",
    commandSnippet: "view_file /skills/accidental-data-loss-prevention/SKILL.md",
    tags: ["セキュリティ", "安全ガード", "GCP", "SQL"],
    recommendedModel: "Gemini 3.1 Pro",
    author: "インフラ管理部",
    verified: true,
    sampleOutput: "⚠️ 警告検知: WHERE句のない一括削除を遮断。ユーザーの確認を待機中。"
  }
];

export default function SkillsHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  // フィルタリング処理
  const filteredSkills = useMemo(() => {
    return OFFICIAL_SKILLS.filter((skill) => {
      const matchCategory =
        selectedCategory === "all" || skill.category === selectedCategory;
      const matchSearch =
        searchQuery === "" ||
        skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="社内Skillsカタログ"
        subtitle="Antigravity 2.0 で即戦力として呼び出せる社内認定スキル集"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          statusType="poc"
          title="🧪 PoC検証中・社内Skillsカタログ"
          message="本カタログに掲載されているSkillsは社内PoC環境における検証済みサンプルモジュールです。全社展開に向けたセキュリティ監査・権限分離ガイドラインの策定を継続中です。"
          prepDetails="社内独自MCPサーバー連携およびSkillsの自動デプロイワークフローを整備しています。"
          releaseDate="2026年Q4予定"
        />

        {/* スキル概要と利用方法ガイド */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
                <Sparkles size={14} />
                <span>Antigravity Skills エコシステム</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                定型業務や専門作業をエージェントに自律実行させる
              </h2>
              <p className="text-slate-300 text-xs leading-relaxed">
                Skills（スキル）は、複雑な指示や専門手順をエージェントにあらかじめ教育した拡張モジュールです。
                チャット内で「〜スキルを使って」と指示するだけで、ベストプラクティスに基づいた正確な成果物が得られます。
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-xs space-y-2 shrink-0">
              <div className="font-bold flex items-center gap-1.5 text-indigo-200">
                <Terminal size={14} />
                <span>簡単な使い方の流れ</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-200 text-[11px]">
                <li>使いたいスキルの「プロンプトをコピー」</li>
                <li>Antigravity のチャットに貼り付けて送信</li>
                <li>エージェントが自動でスキルを読み込み実行</li>
              </ol>
            </div>
          </div>
        </div>

        {/* 検索・カテゴリーフィルター */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* カテゴリタブ */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {SKILL_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* 検索バー */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="スキル名、用途、タグで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* スキルカード一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Wrench size={16} />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                        {skill.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {skill.name}
                      </p>
                    </div>
                  </div>
                  {skill.verified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      <CheckCircle2 size={11} />
                      社内認定
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                  {skill.description}
                </p>

                {/* タグ一覧 */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 space-y-3">
                {/* 呼び出しプロンプトプレビュー */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 relative">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                    指示プロンプト例:
                  </span>
                  <p className="text-[11px] text-slate-700 italic font-mono line-clamp-2 pr-6">
                    &ldquo;{skill.triggerPrompt}&rdquo;
                  </p>
                  <button
                    onClick={() => handleCopyPrompt(skill.id, skill.triggerPrompt)}
                    className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-all"
                    title="プロンプトをコピー"
                  >
                    {copiedId === skill.id ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Cpu size={12} className="text-indigo-500" />
                    推奨: {skill.recommendedModel}
                  </span>
                  <button
                    onClick={() => setSelectedSkill(skill)}
                    className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                  >
                    詳細・実行例
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* スキル詳細モーダル */}
        {selectedSkill && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                      {SKILL_CATEGORIES.find((c) => c.id === selectedSkill.category)?.label}
                    </span>
                    <span className="text-xs text-slate-400">作成: {selectedSkill.author}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedSkill.title}
                  </h3>
                  <code className="text-xs text-slate-500 font-mono">
                    {selectedSkill.name}
                  </code>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">機能詳細</h4>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedSkill.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1">指示プロンプト例</h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 relative flex items-center justify-between">
                    <span className="font-mono text-slate-700 text-[11px]">
                      {selectedSkill.triggerPrompt}
                    </span>
                    <button
                      onClick={() => handleCopyPrompt(selectedSkill.id, selectedSkill.triggerPrompt)}
                      className="ml-3 shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-bold hover:bg-indigo-700 transition-colors"
                    >
                      {copiedId === selectedSkill.id ? (
                        <>
                          <Check size={12} />
                          コピー済
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          コピー
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1">出力・実行結果のイメージ</h4>
                  <div className="bg-slate-900 text-slate-200 rounded-xl p-3 font-mono text-[11px] leading-relaxed">
                    {selectedSkill.sampleOutput}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
