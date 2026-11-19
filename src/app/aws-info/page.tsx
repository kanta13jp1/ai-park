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
  Search,
  EyeOff,
  ChevronsUpDown,
  Sparkles,
  Layers2,
  ArrowRight,
  X,
  StickyNote,
  Copy,
  Check,
  Download,
} from "lucide-react";
import HeroBanner from "@/components/HeroBanner";
import TiltCard from "@/components/TiltCard";
import SpotlightCard from "@/components/SpotlightCard";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import AwsSaaPracticeQuiz, { isQuestionCorrect } from "@/components/aws/AwsSaaPracticeQuiz";
import AwsSaaFlashcards from "@/components/aws/AwsSaaFlashcards";
import {
  saaExamFacts,
  saaDomains,
  saaComparisons,
  saaQuickLookup,
  saaPracticeQuestions,
  saaOfficialResources,
  saaArchitecturePatterns,
  type SaaDomain,
} from "@/data/aws-saa";
import { playCyberClick, playCyberHover } from "@/lib/sound";

type TabId = "domains" | "comparisons" | "flashcards" | "quiz" | "resources";

interface AwsSaaProgress {
  completedTopics: string[];
  quizAnswers: Record<string, number[]>;
  bookmarkedQuestions: string[];
  masteredCards: string[];
  topicNotes: Record<string, string>;
}

const STORAGE_KEY = "ai-park-aws-saa-progress-v1";

const DEFAULT_PROGRESS: AwsSaaProgress = {
  completedTopics: [],
  quizAnswers: {},
  bookmarkedQuestions: [],
  masteredCards: [],
  topicNotes: {},
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

function normalizeQuizAnswers(raw: unknown): Record<string, number[]> {
  if (!raw || typeof raw !== "object") return {};
  const result: Record<string, number[]> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(v)) {
      result[k] = v.filter((n): n is number => typeof n === "number");
    } else if (typeof v === "number") {
      result[k] = [v];
    }
  }
  return result;
}

function normalizeStringArray(raw: unknown): string[] {
  return Array.isArray(raw) ? raw.filter((s): s is string => typeof s === "string") : [];
}

function normalizeStringRecord(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === "string") result[k] = v;
  }
  return result;
}

export default function AwsInfoPage() {
  const [activeTab, setActiveTab] = useState<TabId>("domains");
  const [quizDomainTarget, setQuizDomainTarget] = useState<string>("all");
  const [progress, setProgress] = useState<AwsSaaProgress>(DEFAULT_PROGRESS);
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({
    "domain-1": true,
    "domain-2": true,
    "domain-3": false,
    "domain-4": false,
  });
  const [onlyIncompleteTopics, setOnlyIncompleteTopics] = useState<boolean>(false);
  const [onlyWithNotesTopics, setOnlyWithNotesTopics] = useState<boolean>(false);
  const [topicQuery, setTopicQuery] = useState<string>("");
  const [compCategory, setCompCategory] = useState<string>("すべて");
  const [compQuery, setCompQuery] = useState<string>("");
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [openNoteTopics, setOpenNoteTopics] = useState<Record<string, boolean>>({});
  const [showBackupPanel, setShowBackupPanel] = useState<boolean>(false);
  const [backupInput, setBackupInput] = useState<string>("");
  const [copiedBackup, setCopiedBackup] = useState<boolean>(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProgress({
          completedTopics: normalizeStringArray(parsed.completedTopics),
          quizAnswers: normalizeQuizAnswers(parsed.quizAnswers),
          bookmarkedQuestions: normalizeStringArray(parsed.bookmarkedQuestions),
          masteredCards: normalizeStringArray(parsed.masteredCards),
          topicNotes: normalizeStringRecord(parsed.topicNotes),
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

  const handleSubmitAnswer = (questionId: string, selectedIndices: number[]) => {
    saveProgress({
      ...progress,
      quizAnswers: { ...progress.quizAnswers, [questionId]: selectedIndices },
    });
  };

  const handleToggleBookmark = (questionId: string) => {
    const exists = progress.bookmarkedQuestions.includes(questionId);
    const bookmarkedQuestions = exists
      ? progress.bookmarkedQuestions.filter((id) => id !== questionId)
      : [...progress.bookmarkedQuestions, questionId];
    saveProgress({ ...progress, bookmarkedQuestions });
  };

  const handleToggleMasteredCard = (keyword: string) => {
    const exists = progress.masteredCards.includes(keyword);
    const masteredCards = exists
      ? progress.masteredCards.filter((k) => k !== keyword)
      : [...progress.masteredCards, keyword];
    saveProgress({ ...progress, masteredCards });
  };

  const handleResetQuiz = () => {
    saveProgress({ ...progress, quizAnswers: {} });
  };

  const handleResetMasteredCards = () => {
    saveProgress({ ...progress, masteredCards: [] });
  };

  const handleResetAllClick = () => {
    playCyberClick();
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    saveProgress(DEFAULT_PROGRESS);
    setConfirmReset(false);
  };

  const handleExpandAllDomains = (expand: boolean) => {
    playCyberClick();
    const next: Record<string, boolean> = {};
    for (const d of saaDomains) {
      next[d.id] = expand;
    }
    setExpandedDomains(next);
  };

  const handleJumpToDomainQuiz = (domainId: string) => {
    playCyberClick();
    setQuizDomainTarget(domainId);
    setActiveTab("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpToServiceComparison = (serviceName: string) => {
    playCyberClick();
    // "Amazon S3" -> "S3", "EC2 Auto Scaling" -> "EC2" のように比較表にヒットしやすい語を抽出
    const cleanQuery = serviceName.replace(/^(Amazon|AWS)\s+/i, "").trim();
    setCompCategory("すべて");
    setCompQuery(cleanQuery);
    setActiveTab("comparisons");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateTopicNote = (topicId: string, note: string) => {
    saveProgress({
      ...progress,
      topicNotes: { ...progress.topicNotes, [topicId]: note },
    });
  };

  const handleCopyBackup = async () => {
    playCyberClick();
    try {
      await navigator.clipboard.writeText(JSON.stringify(progress));
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2500);
    } catch {
      setImportMessage("クリップボードへのコピーに失敗しました。");
    }
  };

  const handleRestoreBackup = () => {
    playCyberClick();
    try {
      const parsed = JSON.parse(backupInput.trim()) as Record<string, unknown>;
      saveProgress({
        completedTopics: normalizeStringArray(parsed.completedTopics),
        quizAnswers: normalizeQuizAnswers(parsed.quizAnswers),
        bookmarkedQuestions: normalizeStringArray(parsed.bookmarkedQuestions),
        masteredCards: normalizeStringArray(parsed.masteredCards),
        topicNotes: normalizeStringRecord(parsed.topicNotes),
      });
      setBackupInput("");
      setImportMessage("学習進捗を復元しました。");
      setTimeout(() => setImportMessage(null), 3000);
    } catch {
      setImportMessage("JSON の形式が正しくありません。コピーした文字列をそのまま貼り付けてください。");
    }
  };

  const totalTopics = useMemo(
    () => saaDomains.reduce((sum, d) => sum + d.topics.length, 0),
    []
  );
  const doneTopicsCount = progress.completedTopics.length;
  const topicPct = totalTopics > 0 ? Math.round((doneTopicsCount / totalTopics) * 100) : 0;

  const answeredCount = Object.keys(progress.quizAnswers).length;
  const correctCount = saaPracticeQuestions.filter((q) =>
    isQuestionCorrect(q, progress.quizAnswers[q.id])
  ).length;
  const quizPct =
    answeredCount > 0 ? Math.round((correctCount / saaPracticeQuestions.length) * 100) : 0;

  const normalizedCompQuery = compQuery.trim().toLowerCase();

  const filteredComparisons = useMemo(() => {
    return saaComparisons.filter((c) => {
      if (compCategory !== "すべて" && c.category !== compCategory) return false;
      if (!normalizedCompQuery) return true;
      const haystack = [
        c.title,
        c.subtitle,
        c.decisionRule,
        ...c.rows.flatMap((r) => [r.feature, ...r.values]),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedCompQuery);
    });
  }, [compCategory, normalizedCompQuery]);

  const filteredQuickLookup = useMemo(() => {
    if (!normalizedCompQuery) return saaQuickLookup;
    return saaQuickLookup.filter((item) =>
      `${item.keyword} ${item.category} ${item.recommended} ${item.reason}`
        .toLowerCase()
        .includes(normalizedCompQuery)
    );
  }, [normalizedCompQuery]);

  const normalizedTopicQuery = topicQuery.trim().toLowerCase();

  const tabs: { id: TabId; label: string; icon: typeof BookOpen; badge?: string }[] = [
    { id: "domains", label: "4ドメイン攻略", icon: BookOpen, badge: `${doneTopicsCount}/${totalTopics}` },
    { id: "comparisons", label: "頻出比較 & 逆引き", icon: TableProperties, badge: `${saaComparisons.length}` },
    {
      id: "flashcards",
      label: "フラッシュカード",
      icon: Layers2,
      badge: `${progress.masteredCards.length}/${saaQuickLookup.length}`,
    },
    {
      id: "quiz",
      label: "実践演習クイズ",
      icon: HelpCircle,
      badge: `${correctCount}/${saaPracticeQuestions.length}`,
    },
    { id: "resources", label: "学習ロードマップ", icon: Compass },
  ];

  const allExpanded = saaDomains.every((d) => expandedDomains[d.id]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="AWS・クラウド情報局"
        subtitle="AWS認定ソリューションアーキテクト [アソシエイト] (SAA-C03) 合格学習ハブ"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* SAA-C03 学習ステータス HUD バナー */}
        <TiltCard maxTilt={2} glareOpacity={0.05} className="rounded-3xl">
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
                    {totalTopics} トピック ・ 比較表 {saaComparisons.length} 種 ・ カード {saaQuickLookup.length} 枚 ・ 演習 {saaPracticeQuestions.length} 問
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  AWS認定ソリューションアーキテクト - アソシエイト 合格対策
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  試験ガイド（SAA-C03）の4つの出題ドメインに沿って、頻出サービスの選定基準・フラッシュカード暗記・択一＆複数選択の実践問題をまとめた学習サイトです。学習記録はブラウザに自動保存されます。
                </p>
              </div>

              {/* 進捗ゲージカード */}
              <div className="shrink-0 grid grid-cols-3 gap-2.5 sm:min-w-[360px]">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">トピック習得</div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">{topicPct}%</div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-500"
                      style={{ width: `${topicPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {doneTopicsCount} / {totalTopics} 完了
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">カード暗記</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    {Math.round((progress.masteredCards.length / saaQuickLookup.length) * 100)}%
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-500"
                      style={{
                        width: `${Math.round((progress.masteredCards.length / saaQuickLookup.length) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {progress.masteredCards.length} / {saaQuickLookup.length} 枚
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">演習正答率</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">{quizPct}%</div>
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
            onClick={handleResetAllClick}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
              confirmReset
                ? "bg-rose-600 text-white"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <RotateCcw size={12} />
            <span>{confirmReset ? "もう一度押すと全進捗をリセット" : "全進捗リセット"}</span>
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    4つの出題ドメイン別 攻略チェックリスト
                  </h3>
                  <p className="text-xs text-slate-500">
                    各トピックを確認したらチェックを入れて進捗を管理できます。
                  </p>
                </div>

                {/* 検索 & コントロール */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={topicQuery}
                      onChange={(e) => setTopicQuery(e.target.value)}
                      placeholder="サービス名・キーワード検索..."
                      className="pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 w-52"
                    />
                    {topicQuery && (
                      <button
                        type="button"
                        onClick={() => setTopicQuery("")}
                        aria-label="検索をクリア"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setOnlyIncompleteTopics((v) => !v);
                    }}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      onlyIncompleteTopics
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <EyeOff size={13} />
                    <span>未完了のみ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setOnlyWithNotesTopics((v) => !v);
                    }}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      onlyWithNotesTopics
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-amber-300"
                    }`}
                  >
                    <StickyNote size={13} />
                    <span>メモあり</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExpandAllDomains(!allExpanded)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-indigo-300 cursor-pointer"
                  >
                    <ChevronsUpDown size={13} />
                    <span>{allExpanded ? "すべて折りたたむ" : "すべて展開"}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {saaDomains.map((domain) => {
                  const Icon = DOMAIN_ICONS[domain.id] ?? Cloud;
                  const style = ACCENT_STYLES[domain.accentColor];
                  const isExpanded =
                    !!expandedDomains[domain.id] ||
                    normalizedTopicQuery.length > 0 ||
                    onlyWithNotesTopics;
                  const doneInDomain = domain.topics.filter((t) =>
                    progress.completedTopics.includes(t.id)
                  ).length;
                  const isDomainComplete = doneInDomain === domain.topics.length;

                  const visibleTopics = domain.topics.filter((t) => {
                    if (onlyIncompleteTopics && progress.completedTopics.includes(t.id)) {
                      return false;
                    }
                    if (
                      onlyWithNotesTopics &&
                      !(progress.topicNotes[t.id] && progress.topicNotes[t.id].trim().length > 0)
                    ) {
                      return false;
                    }
                    if (!normalizedTopicQuery) return true;
                    const hay = [t.title, ...t.services, ...t.keyPoints, t.examTip]
                      .join(" ")
                      .toLowerCase();
                    return hay.includes(normalizedTopicQuery);
                  });

                  if ((normalizedTopicQuery || onlyWithNotesTopics) && visibleTopics.length === 0) {
                    return null;
                  }

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
                              {isDomainComplete && (
                                <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <Sparkles size={10} />
                                  <span>達成済み</span>
                                </span>
                              )}
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
                          {visibleTopics.length === 0 ? (
                            <div className="p-6 text-xs text-slate-500 text-center">
                              このドメインのトピックはすべて完了しています。
                            </div>
                          ) : (
                            visibleTopics.map((topic) => {
                              const checked = progress.completedTopics.includes(topic.id);
                              return (
                                <div key={topic.id} className="p-5 sm:p-6 space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => toggleTopic(topic.id)}
                                    className="w-full flex items-start space-x-3 text-left group cursor-pointer"
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

                                  <div className="pl-8 space-y-3">
                                    {/* 関連サービスバッジ（クリックで比較表・逆引き検索へ） */}
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {topic.services.map((svc) => (
                                        <button
                                          key={svc}
                                          type="button"
                                          onClick={() => handleJumpToServiceComparison(svc)}
                                          title={`「${svc}」を比較表・逆引きで検索`}
                                          className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
                                        >
                                          {svc}
                                        </button>
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

                                    {/* トピック別マイメモ */}
                                    {(() => {
                                      const noteVal = progress.topicNotes[topic.id] ?? "";
                                      const hasNote = noteVal.trim().length > 0;
                                      const isNoteOpen = !!openNoteTopics[topic.id];
                                      return (
                                        <div className="space-y-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              playCyberClick();
                                              setOpenNoteTopics((prev) => ({
                                                ...prev,
                                                [topic.id]: !prev[topic.id],
                                              }));
                                            }}
                                            className={`inline-flex items-center space-x-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                                              hasNote
                                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
                                            }`}
                                          >
                                            <StickyNote size={12} />
                                            <span>
                                              {isNoteOpen
                                                ? "マイメモを閉じる"
                                                : hasNote
                                                  ? "マイメモあり（編集）"
                                                  : "マイメモを追加"}
                                            </span>
                                          </button>

                                          {isNoteOpen && (
                                            <textarea
                                              value={noteVal}
                                              onChange={(e) =>
                                                handleUpdateTopicNote(topic.id, e.target.value)
                                              }
                                              rows={2}
                                              placeholder="このトピックで自分が迷いやすい点や暗記メモを記録（ブラウザに自動保存）..."
                                              className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
                                            />
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>
                              );
                            })
                          )}

                          {/* ドメイン→演習直行導線 */}
                          <div className="px-5 sm:px-6 py-3.5 bg-white/80 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => handleJumpToDomainQuiz(domain.id)}
                              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors cursor-pointer"
                            >
                              <span>Domain {domain.number} の実践問題を解く</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </SpotlightCard>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: 頻出サービス比較表 & 要件逆引き */}
        {activeTab === "comparisons" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={compQuery}
                  onChange={(e) => setCompQuery(e.target.value)}
                  placeholder="比較表・逆引きを検索..."
                  className="pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 w-full sm:w-56"
                />
                {compQuery && (
                  <button
                    type="button"
                    onClick={() => setCompQuery("")}
                    aria-label="検索をクリア"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* 要件→サービス即断逆引きチートシート */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                  <Zap size={17} className="text-amber-500" />
                  <span>本番直前：要件キーワード → 推奨サービス即断チートシート</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredQuickLookup.map((item) => (
                  <div
                    key={item.keyword}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 leading-snug">
                        「{item.keyword}」
                      </span>
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-xs font-mono font-black text-indigo-700 bg-indigo-50/70 border border-indigo-100 px-3 py-1.5 rounded-lg">
                      → {item.recommended}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{item.reason}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 比較テーブル一覧 */}
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

        {/* Tab 3: フラッシュカード暗記 */}
        {activeTab === "flashcards" && (
          <AwsSaaFlashcards
            masteredKeywords={progress.masteredCards}
            onToggleMastered={handleToggleMasteredCard}
            onResetMastered={handleResetMasteredCards}
          />
        )}

        {/* Tab 4: 実践演習クイズ */}
        {activeTab === "quiz" && (
          <AwsSaaPracticeQuiz
            key={quizDomainTarget}
            answers={progress.quizAnswers}
            bookmarkedIds={progress.bookmarkedQuestions}
            initialDomain={quizDomainTarget}
            onSubmitAnswer={handleSubmitAnswer}
            onToggleBookmark={handleToggleBookmark}
            onResetQuiz={handleResetQuiz}
          />
        )}

        {/* Tab 5: 学習ロードマップ・公式リソース */}
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
                    title: "カード暗記 & シナリオ演習",
                    desc: "フラッシュカードで即答力を鍛え、実践演習クイズや AWS Skill Builder で誤答理由を言語化する。",
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

            {/* 定番アーキテクチャ設計パターン 4選 */}
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  SAA-C03 定番アーキテクチャ設計パターン 4選
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  試験で頻出する標準構成のつながり（フロー）と設計上の勘所を押さえましょう。
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {saaArchitecturePatterns.map((pat) => (
                  <div
                    key={pat.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm sm:text-base font-black text-slate-900">{pat.title}</h4>
                      <span className="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {pat.badge}
                      </span>
                    </div>

                    {/* フロー図チェーン */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-200/70 rounded-xl p-3">
                      {pat.flow.map((node, idx) => (
                        <div key={node} className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                            {node}
                          </span>
                          {idx < pat.flow.length - 1 && (
                            <ArrowRight size={12} className="text-indigo-400 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{pat.summary}</p>

                    <ul className="space-y-1 text-xs text-slate-700 list-disc pl-4">
                      {pat.keyDesignPoints.map((pt, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {pt}
                        </li>
                      ))}
                    </ul>
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

        {/* 学習進捗バックアップ・復元 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <Download size={14} className="text-indigo-600" />
              <span className="font-bold text-slate-800">学習データの引き継ぎ・バックアップ</span>
              <span className="text-slate-400 hidden sm:inline">
                （別PCや別ブラウザへ学習記録・マイメモを移行できます）
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleCopyBackup}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                {copiedBackup ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span className="text-emerald-700">コピーしました</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>進捗JSONをコピー</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  playCyberClick();
                  setShowBackupPanel((v) => !v);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer"
              >
                {showBackupPanel ? "閉じる" : "復元する"}
              </button>
            </div>
          </div>

          {showBackupPanel && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <textarea
                value={backupInput}
                onChange={(e) => setBackupInput(e.target.value)}
                rows={2}
                placeholder="コピーした学習進捗 JSON をここに貼り付けて「復元を実行」を押してください..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-400"
              />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-indigo-700 font-semibold">{importMessage ?? ""}</span>
                <button
                  type="button"
                  disabled={!backupInput.trim()}
                  onClick={handleRestoreBackup}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  復元を実行
                </button>
              </div>
            </div>
          )}
        </div>

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
