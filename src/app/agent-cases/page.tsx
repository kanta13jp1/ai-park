"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import { playCyberClick } from "@/lib/sound";
import {
  Users,
  Bot,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Clock,
  CheckCircle2,
  Workflow,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  GitBranch,
  ShieldAlert,
  Play
} from "lucide-react";
import { useState } from "react";

interface SubagentCase {
  id: string;
  title: string;
  category: "エンジニアリング" | "データ分析" | "リサーチ・企画" | "品質保証";
  durationBefore: string;
  durationAfter: string;
  reductionRate: string;
  summary: string;
  agentsArchitecture: {
    role: string;
    description: string;
    model: string;
  }[];
  workflowSteps: {
    step: number;
    title: string;
    detail: string;
  }[];
  promptExample: string;
  impact: string[];
}

const CASES_DATA: SubagentCase[] = [
  {
    id: "case-01",
    title: "自律E2Eテスト作成 ＆ UI/UXバグ自動修復パイプライン",
    category: "エンジニアリング",
    durationBefore: "16 時間 / スプリント",
    durationAfter: "45 分",
    reductionRate: "95% 削減",
    summary: "新機能リリース前のPlaywrightテストスクリプト作成、ビジュアルリグレッション検知、およびレイアウト崩れ箇所のコード自動修復を3つの専門サブエージェントが自律分散で実行。",
    agentsArchitecture: [
      { role: "Test Architect (Parent)", description: "テストシナリオの設計と各子エージェントへのタスク分割・統合", model: "Gemini 3.1 Pro" },
      { role: "Playwright Runner (Subagent)", description: "ヘッドレスブラウザを駆動し実機DOMとスクリーンショットを撮影・検証", model: "Gemini 3.8 Flash" },
      { role: "Code Fixer (Subagent)", description: "検知されたCSSの破綻や非推奨API呼び出しを即座にピンポイント修正", model: "Gemini 3.1 Pro" }
    ],
    workflowSteps: [
      { step: 1, title: "テストシナリオ策定", detail: "親エージェントが変更対象PRの差分を読み込み、網羅すべき検証項目を洗い出し" },
      { step: 2, title: "並列ブラウザテスト実行", detail: "子エージェントがChrome / モバイルビューで各画面のレンダリングを自動巡回" },
      { step: 3, title: "自動差分修復 & PR更新", detail: "エラーが発生した行を特定し、最小限の修正パッチを生成してGitコミット" }
    ],
    promptExample: "親エージェントとして、新規追加されたお問い合わせフォームのE2Eテストを作成し、サブエージェントを起動してモバイル表示での崩れがないか自律修復して",
    impact: [
      "手動でのクロスブラウザ確認工数がほぼゼロに",
      "リリース前日のUI崩れ発見による緊急残業の根絶",
      "テストカバレッジ 42% → 89% に向上"
    ]
  },
  {
    id: "case-02",
    title: "マルチリポジトリ横断コード解析 ＆ ドキュメント自動同期",
    category: "エンジニアリング",
    durationBefore: "24 時間 / 案件",
    durationAfter: "2 時間",
    reductionRate: "91% 削減",
    summary: "フロントエンド（Next.js）、バックエンド（Python/FastAPI）、インフラ（Terraform）の3つのリポジトリを同時に読み込み、仕様の食い違いを自動検知して社内ポータルへ同期。",
    agentsArchitecture: [
      { role: "Doc Orchestrator (Parent)", description: "全体の進捗管理と統合API仕様書の生成", model: "Gemini 3.1 Pro" },
      { role: "Repo Scanner A (Subagent)", description: "フロントエンドのAPIリクエスト型定義を全走査", model: "Gemini 3.8 Flash" },
      { role: "Repo Scanner B (Subagent)", description: "バックエンドのPydanticモデルとDBスキーマを走査", model: "Gemini 3.8 Flash" }
    ],
    workflowSteps: [
      { step: 1, title: "3つのリポジトリを並行クローン", detail: "独立したサンドボックス環境で各リポジトリのAST（構文木）を解析" },
      { step: 2, title: "型の不一致・不整合の自動抽出", detail: "フロントエンドが期待するJSONキーとバックエンドのレスポンス定義の差異を検出" },
      { step: 3, title: "AI ParkポータルへのMarkdown自動更新", detail: "最新のAPI仕様書をMarkdownとしてビルドし自動デプロイ" }
    ],
    promptExample: "frontとapiの各リポジトリを並行で走査し、リクエスト型の食い違いがあるエンドポイントを特定してレポートを生成して",
    impact: [
      "手作業によるAPIドキュメント作成・更新の廃止",
      "フロントとバックエンドの型不一致によるバグ流出ゼロ",
      "新メンバーのオンボーディング期間を3日から半日に短縮"
    ]
  },
  {
    id: "case-03",
    title: "BigQueryデータマッピング ＆ クエリ自動最適化",
    category: "データ分析",
    durationBefore: "8 時間 / クエリ",
    durationAfter: "30 分",
    reductionRate: "93% 削減",
    summary: "数千列におよぶ業務ログテーブルから、ビジネス指標に必要なカラムの自動マッピングを行い、クエリ実行コストを最小化するSQLXパイプラインを自動生成。",
    agentsArchitecture: [
      { role: "Data Lead (Parent)", description: "KPI定義と全体マッピング仕様書の承認", model: "Gemini 3.1 Pro" },
      { role: "Schema Inspector (Subagent)", description: "メタデータと情報スキーマを高速分析", model: "Gemini 3.8 Flash" },
      { role: "SQL Optimizer (Subagent)", description: "パーティションとクラスタリングを最適化したSQLXを出力", model: "Gemini 3.1 Pro" }
    ],
    workflowSteps: [
      { step: 1, title: "スキーマ定義の取得", detail: "情報スキーマからデータ型とパーティションキーを抽出" },
      { step: 2, title: "クエリスキャンの最小化設計", detail: "不要なSELECT * を排除し、必要な列のみをクラスタリング指定" },
      { step: 3, title: "Dataform / dbt 定義の自動生成", detail: "テスト済みのデータパイプラインコードとして出力" }
    ],
    promptExample: "この売上テーブルのスキーマを調査し、月次集計に必要な最適化されたクエリとDataformコードを生成して",
    impact: [
      "月間BigQueryクエリ課金を約40%削減",
      "データ分析チームの定型データ抽出依頼の工数半減",
      "データカタログの自動更新化"
    ]
  }
];

export default function AgentCasesPage() {
  const [expandedId, setExpandedId] = useState<string>("case-01");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? "" : id);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="Subagents活用事例"
        subtitle="Antigravity 2.0 の並列自律エージェントを活用した業務改革の実測事例集"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          statusType="poc"
          title="🧪 PoC検証中・シミュレーション表示"
          message="本活用事例は社内PoC環境におけるシミュレーションおよび初期検証に基づく参考モデルケースです。本番運用展開に向けた実測データの追加検証を継続中です。"
          prepDetails="社内パイロットチームにおける実測工数削減率のヒアリングおよび安全なサブエージェント設定ガイドラインを策定しています。"
          releaseDate="2026年Q4予定"
        />

        {/* Subagentsとは */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-800/40">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold">
                <Bot size={14} />
                <span>Antigravity 2.0 Multi-Agent Architecture</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                「1人のAI」から「複数の専門AIチーム」へ
              </h2>
              <p className="text-purple-200 text-xs leading-relaxed">
                Subagents（サブエージェント）機能により、親エージェントが複数の子エージェントをバックグラウンドで並行起動し、
                リサーチ・テスト・コーディングを分業して一気にタスクを完了させます。人間は「指示を出して待つだけ」の自律協調ワークフローを実現します。
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-xs space-y-2 shrink-0">
              <div className="font-bold flex items-center gap-1.5 text-purple-200">
                <Workflow size={14} />
                <span>社内平均効果（実測）</span>
              </div>
              <div className="text-2xl font-black text-amber-300">
                90% 以上 <span className="text-xs text-white font-normal">の作業工数削減</span>
              </div>
              <p className="text-[11px] text-purple-200">
                単一プロンプトでの対話に比べ、手戻りと検証時間が劇的に激減
              </p>
            </div>
          </div>
        </div>

        {/* 事例一覧 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>社内実践ケーススタディ一覧</span>
            </h3>
            <span className="text-xs text-slate-400">実務で検証済みのケースのみ掲載</span>
          </div>

          <div className="space-y-4">
            {CASES_DATA.map((c) => {
              const isExpanded = expandedId === c.id;
              return (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-indigo-300 transition-all"
                >
                  {/* ヘッダーカード */}
                  <div
                    onClick={() => toggleExpand(c.id)}
                    className="p-5 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {c.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <TrendingDown size={12} />
                          {c.reductionRate}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                        {c.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {c.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 self-end md:self-center">
                      <div className="text-right text-xs">
                        <div className="text-slate-400 text-[10px]">作業時間変化</div>
                        <div className="font-bold text-slate-800">
                          <span className="line-through text-slate-400 mr-1.5">{c.durationBefore}</span>
                          <span className="text-indigo-600 font-extrabold">{c.durationAfter}</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* 展開時詳細エリア */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-6 animate-in fade-in duration-200">
                      {/* エージェント体制図 */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Cpu size={14} className="text-indigo-600" />
                          <span>サブエージェント編成アーキテクチャ</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {c.agentsArchitecture.map((agent, i) => (
                            <div
                              key={i}
                              className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1.5 shadow-2xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 text-xs">
                                  {agent.role}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">
                                  {agent.model}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                {agent.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 実行プロンプト例 */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Play size={14} className="text-emerald-600" />
                          <span>実際に使用した親プロンプト</span>
                        </h5>
                        <div className="bg-slate-900 text-slate-200 rounded-xl p-3.5 font-mono text-xs leading-relaxed">
                          &ldquo;{c.promptExample}&rdquo;
                        </div>
                      </div>

                      {/* 導入後のビジネス効果 */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-indigo-600" />
                          <span>実測されたビジネス成果</span>
                        </h5>
                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {c.impact.map((imp, idx) => (
                            <li
                              key={idx}
                              className="bg-white border border-emerald-100 rounded-lg p-2.5 text-xs text-slate-700 flex items-start gap-2"
                            >
                              <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                              <span>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
