"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Terminal,
  Cpu,
  Package,
  FileCode2,
  HardDrive,
  Network,
  Shield,
  Clock,
  Monitor,
  Users,
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
  AlertTriangle,
  Gauge,
} from "lucide-react";
import HeroBanner from "@/components/HeroBanner";
import TiltCard from "@/components/TiltCard";
import SpotlightCard from "@/components/SpotlightCard";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import CertificationFlashcards from "@/components/certification/CertificationFlashcards";
import CertificationPracticeQuiz, {
  isQuestionCorrect,
} from "@/components/certification/CertificationPracticeQuiz";
import type { CertMockExamRecord } from "@/components/certification/types";
import {
  lpic1ExamFacts,
  lpic1Domains,
  lpic1Comparisons,
  lpic1QuickLookup,
  lpic1PracticeQuestions,
  lpic1OfficialResources,
  lpic1Patterns,
  lpic1Pitfalls,
  lpic1KeyPaths,
  type LpicDomain,
} from "@/data/lpic-1";
import { playCyberClick, playCyberHover } from "@/lib/sound";

type TabId = "domains" | "comparisons" | "flashcards" | "quiz" | "resources";
type ExamFilter = "all" | "101-500" | "102-500";

interface LpicProgress {
  completedTopics: string[];
  quizAnswers: Record<string, number[]>;
  bookmarkedQuestions: string[];
  masteredCards: string[];
  topicNotes: Record<string, string>;
  mockExamHistory: CertMockExamRecord[];
}

const STORAGE_KEY = "ai-park-lpic-1-progress-v1";

const DEFAULT_PROGRESS: LpicProgress = {
  completedTopics: [],
  quizAnswers: {},
  bookmarkedQuestions: [],
  masteredCards: [],
  topicNotes: {},
  mockExamHistory: [],
};

const DOMAIN_ICONS: Record<string, typeof Cpu> = {
  "topic-101": Cpu,
  "topic-102": Package,
  "topic-103": Terminal,
  "topic-104": HardDrive,
  "topic-105": FileCode2,
  "topic-106": Monitor,
  "topic-107": Users,
  "topic-108": Clock,
  "topic-109": Network,
  "topic-110": Shield,
};

const ACCENT_STYLES: Record<
  LpicDomain["accentColor"],
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
  "パッケージ・起動",
  "ファイル・権限",
  "プロセス・ログ",
  "ネットワーク",
] as const;

const QUIZ_DOMAINS = lpic1Domains.map((d) => ({
  id: d.id,
  number: d.number,
  shortLabel: `T${d.number}`,
  filterLabel: `${d.number}: ${d.title}`,
}));

const LPIC_PASSING_CONFIG = {
  minScore: 200,
  maxScore: 800,
  passingScore: 500,
  passingPct: 63,
  officialExamLabel: "LPIC-1 本試験（101-500 / 102-500）",
};

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

function normalizeMockExamHistory(raw: unknown): CertMockExamRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is CertMockExamRecord =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as CertMockExamRecord).date === "string" &&
        typeof (item as CertMockExamRecord).correct === "number" &&
        typeof (item as CertMockExamRecord).total === "number" &&
        typeof (item as CertMockExamRecord).scaledScore === "number"
    )
    .slice(0, 5);
}

export default function LpicInfoPage() {
  const [activeTab, setActiveTab] = useState<TabId>("domains");
  const [examFilter, setExamFilter] = useState<ExamFilter>("all");
  const [quizDomainTarget, setQuizDomainTarget] = useState<string>("all");
  const [progress, setProgress] = useState<LpicProgress>(DEFAULT_PROGRESS);
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({
    "topic-101": true,
    "topic-102": false,
    "topic-103": false,
    "topic-104": false,
    "topic-105": false,
    "topic-106": false,
    "topic-107": false,
    "topic-108": false,
    "topic-109": false,
    "topic-110": false,
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
          mockExamHistory: normalizeMockExamHistory(parsed.mockExamHistory),
        });
      }
    } catch {
      // localStorage 読み取り失敗時は初期状態のまま
    }
  }, []);

  const saveProgress = (next: LpicProgress) => {
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
    for (const d of lpic1Domains) {
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

  const handleJumpToCommandComparison = (cmdName: string) => {
    playCyberClick();
    const cleanQuery = cmdName.split(" ")[0].replace(/^\//, "").trim();
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

  const handleRecordMockExam = (record: CertMockExamRecord) => {
    saveProgress({
      ...progress,
      mockExamHistory: [record, ...progress.mockExamHistory].slice(0, 5),
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

  const handleImportBackup = () => {
    playCyberClick();
    try {
      const parsed = JSON.parse(backupInput.trim()) as Record<string, unknown>;
      const restored: LpicProgress = {
        completedTopics: normalizeStringArray(parsed.completedTopics),
        quizAnswers: normalizeQuizAnswers(parsed.quizAnswers),
        bookmarkedQuestions: normalizeStringArray(parsed.bookmarkedQuestions),
        masteredCards: normalizeStringArray(parsed.masteredCards),
        topicNotes: normalizeStringRecord(parsed.topicNotes),
        mockExamHistory: normalizeMockExamHistory(parsed.mockExamHistory),
      };
      saveProgress(restored);
      setBackupInput("");
      setImportMessage("学習データを復元しました。");
      setTimeout(() => setImportMessage(null), 3000);
    } catch {
      setImportMessage("JSON形式が正しくありません。コピーしたバックアップ文字列を確認してください。");
    }
  };

  const allTopics = useMemo(() => lpic1Domains.flatMap((d) => d.topics), []);
  const completedTopicCount = allTopics.filter((t) =>
    progress.completedTopics.includes(t.id)
  ).length;
  const topicPct = allTopics.length > 0 ? Math.round((completedTopicCount / allTopics.length) * 100) : 0;

  const answeredQuizCount = Object.keys(progress.quizAnswers).length;
  const correctQuizCount = lpic1PracticeQuestions.filter((q) =>
    isQuestionCorrect(q, progress.quizAnswers[q.id])
  ).length;

  const masteredCardCount = progress.masteredCards.length;
  const notedTopicCount = Object.values(progress.topicNotes).filter((v) => v.trim().length > 0).length;

  const totalActions = allTopics.length + lpic1PracticeQuestions.length + lpic1QuickLookup.length;
  const doneActions = completedTopicCount + answeredQuizCount + masteredCardCount;
  const overallPct = totalActions > 0 ? Math.round((doneActions / totalActions) * 100) : 0;

  const filteredDomains = useMemo(() => {
    const q = topicQuery.trim().toLowerCase();
    return lpic1Domains
      .filter((d) => examFilter === "all" || d.exam === examFilter)
      .map((d) => {
        const topics = d.topics.filter((t) => {
          if (onlyIncompleteTopics && progress.completedTopics.includes(t.id)) {
            return false;
          }
          if (onlyWithNotesTopics && !(progress.topicNotes[t.id] ?? "").trim()) {
            return false;
          }
          if (!q) return true;
          const haystack = [t.code, t.title, ...t.commands, ...t.keyPoints, t.examTip]
            .join(" ")
            .toLowerCase();
          return haystack.includes(q);
        });
        return { ...d, visibleTopics: topics };
      })
      .filter((d) => d.visibleTopics.length > 0);
  }, [examFilter, topicQuery, onlyIncompleteTopics, onlyWithNotesTopics, progress.completedTopics, progress.topicNotes]);

  const filteredComparisons = useMemo(() => {
    const q = compQuery.trim().toLowerCase();
    return lpic1Comparisons.filter((comp) => {
      if (compCategory !== "すべて" && comp.category !== compCategory) return false;
      if (!q) return true;
      const haystack = [
        comp.title,
        comp.subtitle,
        comp.decisionRule,
        ...comp.columns,
        ...comp.rows.flatMap((r) => [r.feature, ...r.values]),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [compCategory, compQuery]);

  const tabs: { id: TabId; label: string; icon: typeof BookOpen; badge?: string }[] = [
    {
      id: "domains",
      label: "トピック別学習",
      icon: BookOpen,
      badge: `${completedTopicCount}/${allTopics.length}`,
    },
    { id: "comparisons", label: "比較・運用パターン", icon: TableProperties },
    {
      id: "flashcards",
      label: "暗記カード",
      icon: Layers2,
      badge: `${masteredCardCount}/${lpic1QuickLookup.length}`,
    },
    {
      id: "quiz",
      label: "練習問題・模試",
      icon: HelpCircle,
      badge: `${correctQuizCount}/${lpic1PracticeQuestions.length}`,
    },
    { id: "resources", label: "公式リソース", icon: Compass },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="LPIC・Linux情報局"
        subtitle="LPIC-1（101-500 / 102-500）合格学習ハブ"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          title="🚧 一部工事中・学習ハブ先行公開"
          message="現在 LPIC-1（101-500 / 102-500）の公式試験範囲に基づく学習ハブを掲載しています。社内の資格取得支援・受験補助ルール等は準備中（確定次第掲載）です。"
          statusType="construction"
        />

        {/* LPIC-1 学習ステータス HUD バナー */}
        <TiltCard maxTilt={2} glareOpacity={0.05} className="rounded-3xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border border-cyan-700/50 p-6 sm:p-8 text-white shadow-xl"
          >
            <div className="absolute -top-10 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 tracking-wider">
                    <Terminal size={12} />
                    <span>LPIC-1 (101 / 102) STUDY HUB</span>
                  </span>
                  <span className="text-xs text-slate-300">
                    {allTopics.length} トピック ・ 比較表 {lpic1Comparisons.length} 種 ・ カード {lpic1QuickLookup.length} 枚 ・ 演習 {lpic1PracticeQuestions.length} 問
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white break-keep">
                  <span className="inline-block">LPIC-1（101-500 / 102-500）</span>
                  <span className="inline-block">合格対策学習ハブ</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  LPI 公式試験範囲（Version 5.0）の Topic 101〜110 に沿って、コマンド比較表・フラッシュカード暗記・択一＆複数選択の実践問題をまとめた学習ページです。学習記録はブラウザに自動保存されます。
                </p>
              </div>

              <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:min-w-[360px]">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">トピック習得</div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">{topicPct}%</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {completedTopicCount} / {allTopics.length}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">暗記カード</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    {masteredCardCount} / {lpic1QuickLookup.length}
                  </div>
                  <div className="text-[11px] text-slate-400">枚習得</div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">演習問題</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                    {correctQuizCount} / {lpic1PracticeQuestions.length}
                  </div>
                  <div className="text-[11px] text-slate-400">問正解</div>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

      {/* 試験概要カード */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {lpic1ExamFacts.map((fact) => (
          <div
            key={fact.label}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-1"
          >
            <div className="text-[11px] font-bold text-slate-400">{fact.label}</div>
            <div className="text-sm sm:text-base font-black text-slate-900 whitespace-nowrap">{fact.value}</div>
            <div className="text-[11px] text-slate-500 leading-snug">{fact.detail}</div>
          </div>
        ))}
      </section>

      {/* 総合進捗＆データ管理バー */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-cyan-600" />
                <span>総合学習進捗（トピック・暗記カード・練習問題）</span>
              </span>
              <span className="font-mono text-cyan-700">{overallPct}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                playCyberClick();
                setShowBackupPanel((v) => !v);
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <Download size={13} />
              <span>バックアップ / 復元</span>
            </button>

            <button
              type="button"
              onClick={handleResetAllClick}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                confirmReset
                  ? "bg-rose-600 text-white border-rose-600"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-rose-600"
              }`}
            >
              <RotateCcw size={13} />
              <span>{confirmReset ? "もう一度押すと全消去" : "進捗リセット"}</span>
            </button>
          </div>
        </div>

        {showBackupPanel && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-xs text-slate-600">
                進捗やメモはブラウザの localStorage に保存されます。別端末へ移行する場合は JSON 文字列をコピーしてください。
              </p>
              <button
                type="button"
                onClick={handleCopyBackup}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer shrink-0"
              >
                {copiedBackup ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedBackup ? "コピーしました" : "現在のデータをコピー"}</span>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={backupInput}
                onChange={(e) => setBackupInput(e.target.value)}
                placeholder="復元したいバックアップJSONを貼り付け..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="button"
                onClick={handleImportBackup}
                disabled={!backupInput.trim()}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 disabled:opacity-40 cursor-pointer"
              >
                復元する
              </button>
            </div>
            {importMessage && <p className="text-xs font-bold text-cyan-700">{importMessage}</p>}
          </div>
        )}
      </section>

      {/* タブナビゲーション */}
      <nav className="flex flex-wrap gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playCyberClick();
                setActiveTab(tab.id);
              }}
              onMouseEnter={() => playCyberHover()}
              className={`flex-1 min-w-fit inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/70"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Icon size={15} className={`shrink-0 ${active ? "text-cyan-600" : "text-slate-400"}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    active ? "bg-cyan-50 text-cyan-700" : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* TAB 1: トピック別学習 */}
      {activeTab === "domains" && (
        <div className="space-y-6">
          {/* フィルター＆検索バー */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: "all", label: "全トピック (101-110)" },
                    { id: "101-500", label: "Exam 101-500 (101-104)" },
                    { id: "102-500", label: "Exam 102-500 (105-110)" },
                  ] as const
                ).map((ef) => (
                  <button
                    key={ef.id}
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setExamFilter(ef.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      examFilter === ef.id
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {ef.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={topicQuery}
                    onChange={(e) => setTopicQuery(e.target.value)}
                    placeholder="コマンド・設定ファイル検索..."
                    className="w-full pl-8 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  {topicQuery && (
                    <button
                      type="button"
                      onClick={() => setTopicQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                  className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    onlyIncompleteTopics
                      ? "bg-cyan-600 text-white border-cyan-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-cyan-300"
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
                  className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    onlyWithNotesTopics
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-amber-300"
                  }`}
                >
                  <StickyNote size={13} />
                  <span>メモあり ({notedTopicCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExpandAllDomains(true)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronsUpDown size={13} />
                  <span>全展開</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExpandAllDomains(false)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <span>全折りたたみ</span>
                </button>
              </div>
            </div>
          </div>

          {/* トピック一覧 */}
          {filteredDomains.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-sm font-black text-slate-700">条件に一致するトピックがありません</div>
              <button
                type="button"
                onClick={() => {
                  setExamFilter("all");
                  setTopicQuery("");
                  setOnlyIncompleteTopics(false);
                  setOnlyWithNotesTopics(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                フィルターを解除
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDomains.map((domain) => {
                const Icon = DOMAIN_ICONS[domain.id] ?? Terminal;
                const style = ACCENT_STYLES[domain.accentColor];
                const isExpanded = Boolean(expandedDomains[domain.id] || topicQuery.trim());
                const domainDone = domain.topics.filter((t) =>
                  progress.completedTopics.includes(t.id)
                ).length;
                const domainPct = Math.round((domainDone / domain.topics.length) * 100);

                return (
                  <div
                    key={domain.id}
                    className={`bg-white rounded-2xl border ${style.border} shadow-xs overflow-hidden`}
                  >
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          playCyberClick();
                          setExpandedDomains((prev) => ({
                            ...prev,
                            [domain.id]: !prev[domain.id],
                          }));
                        }}
                        className="flex items-start space-x-3.5 text-left flex-1 cursor-pointer"
                      >
                        <div className={`p-2.5 rounded-xl border shrink-0 ${style.iconBg}`}>
                          <Icon size={20} />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${style.badge}`}>
                              {domain.exam} ・ Topic {domain.number}
                            </span>
                            <span className="text-xs font-mono text-slate-500">
                              完了 {domainDone}/{domain.topics.length} ({domainPct}%)
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900">
                            {domain.title}
                            <span className="ml-2 text-xs font-normal text-slate-400">
                              {domain.englishTitle}
                            </span>
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed">{domain.summary}</p>
                        </div>
                      </button>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleJumpToDomainQuiz(domain.id)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                        >
                          <span>この分野の問題を解く</span>
                          <ArrowRight size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playCyberClick();
                            setExpandedDomains((prev) => ({
                              ...prev,
                              [domain.id]: !prev[domain.id],
                            }));
                          }}
                          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer"
                          aria-label="展開切り替え"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4">
                        {domain.visibleTopics.map((topic) => {
                          const isDone = progress.completedTopics.includes(topic.id);
                          const noteText = progress.topicNotes[topic.id] ?? "";
                          const isNoteOpen = Boolean(openNoteTopics[topic.id] || noteText.trim());

                          return (
                            <div
                              key={topic.id}
                              className={`bg-white rounded-xl border p-5 space-y-3 transition-all ${
                                isDone ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200/80"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <button
                                  type="button"
                                  onClick={() => toggleTopic(topic.id)}
                                  className="flex items-start space-x-2.5 text-left cursor-pointer group"
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-slate-300 group-hover:text-cyan-500 shrink-0 mt-0.5" />
                                  )}
                                  <div>
                                    <span className="text-[11px] font-mono font-bold text-slate-400">
                                      Objective {topic.code}
                                    </span>
                                    <h4
                                      className={`text-sm sm:text-base font-black ${
                                        isDone ? "text-emerald-950" : "text-slate-900"
                                      }`}
                                    >
                                      {topic.title}
                                    </h4>
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    playCyberClick();
                                    setOpenNoteTopics((prev) => ({
                                      ...prev,
                                      [topic.id]: !prev[topic.id],
                                    }));
                                  }}
                                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer shrink-0 ${
                                    noteText.trim()
                                      ? "bg-amber-50 text-amber-800 border-amber-200"
                                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                  }`}
                                >
                                  <StickyNote size={12} />
                                  <span>{noteText.trim() ? "メモ済" : "メモ"}</span>
                                </button>
                              </div>

                              {/* 関連コマンド・パス */}
                              <div className="flex flex-wrap gap-1.5">
                                {topic.commands.map((cmd) => (
                                  <button
                                    key={cmd}
                                    type="button"
                                    onClick={() => handleJumpToCommandComparison(cmd)}
                                    title="比較表で検索する"
                                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 font-mono text-[11px] font-bold text-slate-700 hover:text-cyan-800 transition-colors cursor-pointer"
                                  >
                                    {cmd}
                                  </button>
                                ))}
                              </div>

                              {/* 学習要点 */}
                              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                                {topic.keyPoints.map((pt) => (
                                  <li key={pt} className="flex items-start space-x-2">
                                    <span className="text-cyan-500 font-bold mt-0.5">•</span>
                                    <span className="leading-relaxed">{pt}</span>
                                  </li>
                                ))}
                              </ul>

                              {/* 試験対策ヒント */}
                              <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 px-3.5 py-2.5 flex items-start space-x-2">
                                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-950 leading-relaxed">
                                  <span className="font-bold">試験のポイント: </span>
                                  {topic.examTip}
                                </p>
                              </div>

                              {/* 個人メモ欄 */}
                              {isNoteOpen && (
                                <div className="pt-2">
                                  <textarea
                                    rows={2}
                                    value={noteText}
                                    onChange={(e) => handleUpdateTopicNote(topic.id, e.target.value)}
                                    placeholder="このトピックのメモ（実機で試したコマンドや覚えるべきオプションなど）..."
                                    className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/30 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 比較表・運用パターン */}
      {activeTab === "comparisons" && (
        <div className="space-y-8">
          {/* 比較表フィルター */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {COMPARISON_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    playCyberClick();
                    setCompCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    compCategory === cat
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative sm:w-64">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={compQuery}
                onChange={(e) => setCompQuery(e.target.value)}
                placeholder="コマンド・キーワードで絞り込み..."
                className="w-full pl-8 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {compQuery && (
                <button
                  type="button"
                  onClick={() => setCompQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* 比較表 */}
          <div className="space-y-5">
            {filteredComparisons.map((comp) => (
              <div
                key={comp.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="space-y-1">
                  <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                    {comp.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">{comp.title}</h3>
                  <p className="text-xs text-slate-500">{comp.subtitle}</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        {comp.columns.map((col) => (
                          <th key={col} className="py-2.5 px-3 font-black text-slate-700">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {comp.rows.map((row) => (
                        <tr key={row.feature} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-bold text-slate-800">{row.feature}</td>
                          {row.values.map((val, idx) => (
                            <td key={idx} className="py-2.5 px-3 text-slate-600 font-mono text-xs">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-xl bg-slate-900 text-slate-100 px-4 py-3 text-xs flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-cyan-300">使い分けルール: </strong>
                    {comp.decisionRule}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 頻出運用フローパターン */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-cyan-600" />
              <span>頻出コマンド・運用フローパターン</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lpic1Patterns.map((pat) => (
                <SpotlightCard key={pat.id} className="p-5 space-y-3 bg-white border border-slate-200/80 rounded-2xl">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-black text-slate-900">{pat.title}</h4>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
                      {pat.badge}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {pat.flow.map((step, idx) => (
                      <div key={step} className="flex items-center gap-1.5">
                        <span className="px-2 py-1 rounded-lg bg-slate-100 font-mono text-[11px] font-bold text-slate-800">
                          {step}
                        </span>
                        {idx < pat.flow.length - 1 && (
                          <ArrowRight size={12} className="text-slate-400 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{pat.summary}</p>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {pat.keyDesignPoints.map((pt) => (
                      <li key={pt} className="flex items-start space-x-1.5">
                        <span className="text-cyan-600 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              ))}
            </div>
          </section>

          {/* 試験のひっかけ対策 */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>よくあるひっかけ・誤答パターン</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lpic1Pitfalls.map((pit) => (
                <div
                  key={pit.id}
                  className="bg-white rounded-2xl border border-amber-200/80 p-5 space-y-2.5 shadow-xs"
                >
                  <div className="text-xs font-black text-rose-700">✕ {pit.trap}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{pit.whyWrong}</p>
                  <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 px-3 py-2 text-xs text-emerald-950">
                    <span className="font-bold">○ 正しいアプローチ: </span>
                    {pit.correctApproach}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 重要設定ファイル・数値早見 */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Gauge className="w-5 h-5 text-indigo-600" />
              <span>重要設定ファイル・数値早見表</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {lpic1KeyPaths.map((kp) => (
                <div
                  key={kp.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-1 shadow-xs"
                >
                  <div className="font-mono text-xs font-black text-indigo-700">{kp.target}</div>
                  <div className="text-sm font-black text-slate-900">{kp.value}</div>
                  <p className="text-[11px] text-slate-500 leading-snug">{kp.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB 3: フラッシュカード */}
      {activeTab === "flashcards" && (
        <CertificationFlashcards
          items={lpic1QuickLookup}
          masteredKeywords={progress.masteredCards}
          onToggleMastered={handleToggleMasteredCard}
          onResetMastered={handleResetMasteredCards}
          badgeText="LPIC-1 直前暗記フラッシュカード"
          title="要件・用途 → コマンド / 設定ファイル 即答トレーニング"
          promptLabel="次の要件に対応するコマンド・設定ファイルは？"
          answerLabel="推奨コマンド・設定値"
        />
      )}

      {/* TAB 4: 練習問題・模擬試験 */}
      {activeTab === "quiz" && (
        <CertificationPracticeQuiz
          questions={lpic1PracticeQuestions}
          domains={QUIZ_DOMAINS}
          examBadgeLabel="LPIC-1 (101/102) 演習"
          passingConfig={LPIC_PASSING_CONFIG}
          answers={progress.quizAnswers}
          bookmarkedIds={progress.bookmarkedQuestions}
          mockExamHistory={progress.mockExamHistory}
          initialDomain={quizDomainTarget}
          onSubmitAnswer={handleSubmitAnswer}
          onToggleBookmark={handleToggleBookmark}
          onRecordMockExam={handleRecordMockExam}
          onResetQuiz={handleResetQuiz}
        />
      )}

      {/* TAB 5: 公式リソース */}
      {activeTab === "resources" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lpic1OfficialResources.map((res) => (
            <TiltCard key={res.url} className="h-full">
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playCyberClick()}
                className="block h-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-cyan-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                    {res.badge}
                  </span>
                  <ExternalLink size={15} className="text-slate-400" />
                </div>
                <h3 className="text-base font-black text-slate-900">{res.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                <div className="text-[11px] font-mono text-cyan-700 truncate">{res.url}</div>
              </a>
            </TiltCard>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
