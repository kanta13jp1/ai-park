"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Cloud,
  ShieldCheck,
  Layers,
  Zap,
  Coins,
  CheckCircle2,
  Circle,
  BookOpen,
  TableProperties,
  HelpCircle,
  Compass,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Award,
  Lightbulb,
} from "lucide-react";
import HeroBanner from "@/components/HeroBanner";
import TiltCard from "@/components/TiltCard";
import SpotlightCard from "@/components/SpotlightCard";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import AwsSaaPracticeQuiz from "@/components/aws/AwsSaaPracticeQuiz";
import {
  saaExamFacts,
  saaDomains,
  saaComparisons,
  saaPracticeQuestions,
  saaOfficialResources,
  type SaaDomain,
} from "@/data/aws-saa";
import { playCyberClick, playCyberHover } from "@/lib/sound";

type TabId = "domains" | "comparisons" | "quiz" | "resources";

interface AwsSaaProgress {
  completedTopics: string[];
  quizAnswers: Record<string, number>;
}

const STORAGE_KEY = "ai-park-aws-saa-progress-v1";

const DEFAULT_PROGRESS: AwsSaaProgress = {
  completedTopics: [],
  quizAnswers: {},
};

const DOMAIN_ICONS: Record<string, typeof ShieldCheck> = {
  "domain-1": ShieldCheck,
  "domain-2": Layers,
  "domain-3": Zap,
  "domain-4": Coins,
};

const ACCENT_STYLES: Record<
  SaaDomain["accentColor"],
  { badge: string; bar: string; border: string; iconBg: string }
> = {
  indigo: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    bar: "bg-indigo-500",
    border: "border-indigo-200/80",
    iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
    border: "border-emerald-200/80",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  amber: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    bar: "bg-amber-500",
    border: "border-amber-200/80",
    iconBg: "bg-amber-50 text-amber-600 border-amber-100",
  },
  cyan: {
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
    bar: "bg-cyan-500",
    border: "border-cyan-200/80",
    iconBg: "bg-cyan-50 text-cyan-600 border-cyan-100",
  },
};

const COMPARISON_CATEGORIES = [
  "すべて",
  "セキュリティ",
  "ネットワーク",
  "非同期・連携",
  "ストレージ",
  "データベース",
] as const;

export default function AwsInfoPage() {
  const [activeTab, setActiveTab] = useState<TabId>("domains");
  const [progress, setProgress] = useState<AwsSaaProgress>(DEFAULT_PROGRESS);
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({
    "domain-1": true,
    "domain-2": true,
    "domain-3": false,
    "domain-4": false,
  });
  const [compCategory, setCompCategory] = useState<string>("すべて");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AwsSaaProgress>;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProgress({
          completedTopics: Array.isArray(parsed.completedTopics) ? parsed.completedTopics : [],
          quizAnswers: parsed.quizAnswers && typeof parsed.quizAnswers === "object" ? parsed.quizAnswers : {},
        });
      }
    } catch {
      // localStorage 読み取り失敗時は初期状態のまま
    }
  }, []);

  const saveProgress = (next: AwsSaaProgress) => {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage quota errors
    }
  };

  const toggleTopic = (topicId: string) => {
    playCyberClick();
    const exists = progress.completedTopics.includes(topicId);
    const completedTopics = exists
      ? progress.completedTopics.filter((id) => id !== topicId)
      : [...progress.completedTopics, topicId];
    saveProgress({ ...progress, completedTopics });
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    saveProgress({
      ...progress,
      quizAnswers: { ...progress.quizAnswers, [questionId]: optionIndex },
    });
  };

  const handleResetQuiz = () => {
    saveProgress({ ...progress, quizAnswers: {} });
  };

  const handleResetAll = () => {
    playCyberClick();
    saveProgress(DEFAULT_PROGRESS);
  };

  const totalTopics = useMemo(
    () => saaDomains.reduce((sum, d) => sum + d.topics.length, 0),
    []
  );
  const doneTopicsCount = progress.completedTopics.length;
  const topicPct = totalTopics > 0 ? Math.round((doneTopicsCount / totalTopics) * 100) : 0;

  const answeredCount = Object.keys(progress.quizAnswers).length;
  const correctCount = saaPracticeQuestions.filter(
    (q) => progress.quizAnswers[q.id] === q.correctIndex
  ).length;
  const quizPct =
    answeredCount > 0 ? Math.round((correctCount / saaPracticeQuestions.length) * 100) : 0;

  const filteredComparisons = useMemo(() => {
    if (compCategory === "すべて") return saaComparisons;
    return saaComparisons.filter((c) => c.category === compCategory);
  }, [compCategory]);

  const tabs: { id: TabId; label: string; icon: typeof BookOpen; badge?: string }[] = [
    { id: "domains", label: "4ドメイン攻略", icon: BookOpen, badge: `${doneTopicsCount}/${totalTopics}` },
    { id: "comparisons", label: "頻出比較表", icon: TableProperties, badge: `${saaComparisons.length}` },
    {
      id: "quiz",
      label: "実践演習クイズ",
      icon: HelpCircle,
      badge: `${correctCount}/${saaPracticeQuestions.length}`,
    },
    { id: "resources", label: "学習ロードマップ", icon: Compass },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="AWS・クラウド情報局"
        subtitle="AWS認定ソリューションアーキテクト [アソシエイト] (SAA-C03) 合格学習ハブ"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* SAA-C03 学習ステータス HUD バナー */}
        <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-3xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-700/50 p-6 sm:p-8 text-white shadow-xl"
          >
            <div className="absolute -top-10 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 tracking-wider">
                    <Cloud size={12} />
                    <span>AWS SAA-C03 STUDY HUB</span>
                  </span>
                  <span className="text-xs text-slate-300">
                    4ドメイン体系整理 ・ 頻出比較表 ・ シナリオ演習クイズ
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  AWS認定ソリューションアーキテクト - アソシエイト 合格対策
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  試験ガイド（SAA-C03）の4つの出題ドメインに沿って、頻出サービスの選定基準・設計パターン・実践問題をまとめた学習サイトです。学習チェックや演習結果はブラウザに自動保存されます。
                </p>
              </div>

              {/* 進捗ゲージカード */}
              <div className="shrink-0 grid grid-cols-2 gap-3 sm:min-w-[280px]">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">トピック習得</div>
                  <div className="text-2xl font-black text-cyan-300 font-mono">{topicPct}%</div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-500"
                      style={{ width: `${topicPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {doneTopicsCount} / {totalTopics} トピック完了
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">演習正答率</div>
                  <div className="text-2xl font-black text-emerald-300 font-mono">{quizPct}%</div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-500"
                      style={{ width: `${quizPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {correctCount} / {saaPracticeQuestions.length} 問正解
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* タブナビゲーション */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playCyberClick();
                    setActiveTab(tab.id);
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        isActive ? "bg-white/15 text-cyan-300" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>全進捗リセット</span>
          </button>
        </div>

        {/* Tab 1: 試験概要 & 4ドメイン攻略 */}
        {activeTab === "domains" && (
          <div className="space-y-8">
            {/* 試験基本データグリッド */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                  <Award size={18} className="text-indigo-600" />
                  <span>SAA-C03 試験スペック（AWS公式ガイド準拠）</span>
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {saaExamFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-1"
                  >
                    <div className="text-[11px] font-bold text-slate-500">{fact.label}</div>
                    <div className="text-lg font-black text-slate-900 font-mono">{fact.value}</div>
                    <div className="text-[10px] text-slate-400">{fact.detail}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4つの出題ドメイン */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    4つの出題ドメイン別 攻略チェックリスト
                  </h3>
                  <p className="text-xs text-slate-500">
                    各トピックを確認したらチェックを入れて進捗を管理できます。
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {saaDomains.map((domain) => {
                  const Icon = DOMAIN_ICONS[domain.id] ?? Cloud;
                  const style = ACCENT_STYLES[domain.accentColor];
                  const isExpanded = !!expandedDomains[domain.id];
                  const doneInDomain = domain.topics.filter((t) =>
                    progress.completedTopics.includes(t.id)
                  ).length;

                  return (
                    <SpotlightCard
                      key={domain.id}
                      spotlightColor="rgba(99, 102, 241, 0.08)"
                      className={`bg-white rounded-2xl border ${style.border} shadow-xs overflow-hidden`}
                    >
                      {/* ドメインヘッダー */}
                      <button
                        type="button"
                        onClick={() => {
                          playCyberClick();
                          setExpandedDomains((prev) => ({
                            ...prev,
                            [domain.id]: !prev[domain.id],
                          }));
                        }}
                        className="w-full p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${style.iconBg}`}
                          >
                            <Icon size={22} />
                          </div>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${style.badge}`}
                              >
                                Domain {domain.number} ・ 出題比率 {domain.weight}%
                              </span>
                              <span className="text-[11px] font-mono font-bold text-slate-500">
                                {doneInDomain}/{domain.topics.length} 完了
                              </span>
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-slate-900">
                              {domain.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                              {domain.summary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                          <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full ${style.bar} transition-all duration-300`}
                              style={{
                                width: `${Math.round((doneInDomain / domain.topics.length) * 100)}%`,
                              }}
                            />
                          </div>
                          {isExpanded ? (
                            <ChevronUp size={18} className="text-slate-400" />
                          ) : (
                            <ChevronDown size={18} className="text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* トピック一覧 */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/40">
                          {domain.topics.map((topic) => {
                            const checked = progress.completedTopics.includes(topic.id);
                            return (
                              <div key={topic.id} className="p-5 sm:p-6 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                  <button
                                    type="button"
                                    onClick={() => toggleTopic(topic.id)}
                                    className="flex items-start space-x-3 text-left group cursor-pointer"
                                  >
                                    {checked ? (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 shrink-0 mt-0.5 transition-colors" />
                                    )}
                                    <span
                                      className={`text-sm sm:text-base font-bold transition-colors ${
                                        checked
                                          ? "text-emerald-800 line-through decoration-emerald-400/60"
                                          : "text-slate-900 group-hover:text-indigo-700"
                                      }`}
                                    >
                                      {topic.title}
                                    </span>
                                  </button>
                                </div>

                                <div className="pl-8 space-y-3">
                                  {/* 関連サービスバッジ */}
                                  <div className="flex flex-wrap gap-1.5">
                                    {topic.services.map((svc) => (
                                      <span
                                        key={svc}
                                        className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                                      >
                                        {svc}
                                      </span>
                                    ))}
                                  </div>

                                  {/* 押さえるべきポイント */}
                                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 list-disc pl-4">
                                    {topic.keyPoints.map((pt, idx) => (
                                      <li key={idx} className="leading-relaxed">
                                        {pt}
                                      </li>
                                    ))}
                                  </ul>

                                  {/* 試験テクニック */}
                                  <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 px-3.5 py-2.5 flex items-start space-x-2 text-xs text-amber-950">
                                    <Lightbulb
                                      size={15}
                                      className="text-amber-600 shrink-0 mt-0.5"
                                    />
                                    <span>
                                      <strong className="font-bold">試験の狙い目：</strong>
                                      {topic.examTip}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </SpotlightCard>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: 頻出サービス比較表 */}
        {activeTab === "comparisons" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {COMPARISON_CATEGORIES.map((cat) => {
                const active = compCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setCompCategory(cat);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="space-y-6">
              {filteredComparisons.map((table) => (
                <div
                  key={table.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
                >
                  <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {table.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                        {table.title}
                      </h3>
                      <p className="text-xs text-slate-500">{table.subtitle}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                          {table.columns.map((col, idx) => (
                            <th key={idx} className="py-3 px-4 font-bold whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/70">
                            <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap bg-slate-50/30">
                              {row.feature}
                            </td>
                            {row.values.map((val, vIdx) => (
                              <td key={vIdx} className="py-3 px-4 text-slate-700 leading-relaxed">
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-indigo-50/60 border-t border-indigo-100 px-5 py-3 text-xs text-indigo-950 flex items-start space-x-2">
                    <Lightbulb size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-bold">判断ルール：</strong>
                      {table.decisionRule}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: 実践演習クイズ */}
        {activeTab === "quiz" && (
          <AwsSaaPracticeQuiz
            answers={progress.quizAnswers}
            onSelectAnswer={handleSelectAnswer}
            onResetQuiz={handleResetQuiz}
          />
        )}

        {/* Tab 4: 学習ロードマップ・公式リソース */}
        {activeTab === "resources" && (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  SAA-C03 合格までの標準学習ステップ
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  丸暗記ではなく「要件（セキュリティ・可用性・性能・コスト）から最適サービスを選ぶ力」を養う手順です。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    step: "STEP 1",
                    title: "全体像とネットワーク基礎",
                    desc: "VPC（サブネット、ルートテーブル、IGW/NAT、SG/NACL）と IAM の仕組みを図解で理解する。",
                  },
                  {
                    step: "STEP 2",
                    title: "コアサービスの使い分け",
                    desc: "本ページの「4ドメイン攻略」と「頻出比較表」を使い、EBS/EFS/S3 や ALB/NLB、SQS/SNS の違いを整理する。",
                  },
                  {
                    step: "STEP 3",
                    title: "シナリオ問題で定着",
                    desc: "実践演習クイズや AWS Skill Builder の公式練習問題で「なぜ他の選択肢が誤りか」を言語化する。",
                  },
                  {
                    step: "STEP 4",
                    title: "模擬試験で時間配分確認",
                    desc: "130分で65問（1問約2分）のペース配分を確認し、苦手ドメインを重点復習して本番に臨む。",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2"
                  >
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300">
                      {item.step}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-black text-slate-900">AWS 公式学習リソース</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {saaOfficialResources.map((res) => (
                  <a
                    key={res.url}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playCyberClick()}
                    onMouseEnter={() => playCyberHover()}
                    className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {res.badge}
                        </span>
                        <ExternalLink
                          size={15}
                          className="text-slate-400 group-hover:text-indigo-600 transition-colors"
                        />
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 社内ルール・相談窓口についての誠実な未完了注記 */}
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 一部工事中：社内の AWS 利用ルール・受験補助制度は準備中です"
          message="このページでは AWS認定ソリューションアーキテクト [アソシエイト] (SAA-C03) の学習コンテンツを公開しています。なお、社内の AWS アカウント申請ルール・資格受験補助・相談窓口についてはまだ決まっていないため、決まり次第ここに掲載します。"
        />
      </div>
    </div>
  );
}
