"use client";

import { useEffect, useState, useMemo, useRef, type KeyboardEvent } from "react";
import {
  ScrollText,
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
  Zap,
  Layers2,
  ArrowRight,
  X,
  StickyNote,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Gauge,
  CheckCircle2,
  Circle,
  Cpu,
  ShieldCheck,
  Briefcase,
  Layers,
  Calculator,
  Loader2,
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
import type {
  IpaComparisonTable,
  IpaDomain,
  IpaExamId,
  IpaExamTier,
  IpaFlashcardItem,
  IpaFormulaPattern,
  IpaKeyFact,
  IpaPitfall,
  IpaQuestion,
} from "@/data/ipa-types";
import {
  INITIAL_IPA_TIER_DATA,
  IPA_EXAM_COUNTS,
  IPA_EXAM_IDS,
  IPA_EXAM_METAS,
  IPA_EXAM_TIER_MAP,
  IPA_OFFICIAL_RESOURCES,
  IPA_TIER_GROUPS,
  loadIpaTierData,
  type IpaTierData,
} from "@/components/ipa/ipaCertRegistry";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import { normalizeIpaSearchQuery } from "@/lib/ipa-search";

const EMPTY_DOMAINS: IpaDomain[] = [];
const EMPTY_COMPARISONS: IpaComparisonTable[] = [];
const EMPTY_FORMULAS: IpaFormulaPattern[] = [];
const EMPTY_PITFALLS: IpaPitfall[] = [];
const EMPTY_KEY_FACTS: IpaKeyFact[] = [];
const EMPTY_FLASHCARDS: IpaFlashcardItem[] = [];
const EMPTY_QUESTIONS: IpaQuestion[] = [];

type TabId = "domains" | "comparisons" | "flashcards" | "quiz" | "resources";

interface IpaProgress {
  completedTopics: string[];
  quizAnswers: Record<string, number[]>;
  bookmarkedQuestions: string[];
  masteredCards: string[];
  topicNotes: Record<string, string>;
  mockExamHistory: Record<IpaExamId, CertMockExamRecord[]>;
}

const STORAGE_KEY = "ai-park-ipa-exam-progress-v1";

const DEFAULT_PROGRESS: IpaProgress = {
  completedTopics: [],
  quizAnswers: {},
  bookmarkedQuestions: [],
  masteredCards: [],
  topicNotes: {},
  mockExamHistory: {
    ip: [],
    sg: [],
    fe: [],
    ap: [],
    sc: [],
    db: [],
    nw: [],
    es: [],
    st: [],
    sa: [],
    pm: [],
    sm: [],
    au: [],
  },
};

const CATEGORY_ICONS: Record<IpaDomain["category"], typeof Cpu> = {
  ストラテジ系: Briefcase,
  マネジメント系: Layers,
  テクノロジ系: Cpu,
};

const ACCENT_STYLES: Record<
  IpaDomain["accentColor"],
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
  "ネットワーク・セキュリティ",
  "開発・データベース",
  "マネジメント・戦略",
  "コンピュータ基礎",
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

function normalizeExamHistoryArray(raw: unknown): CertMockExamRecord[] {
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

function normalizeMockExamHistory(raw: unknown): Record<IpaExamId, CertMockExamRecord[]> {
  if (!raw || typeof raw !== "object") {
    return {
      ip: [],
      sg: [],
      fe: [],
      ap: [],
      sc: [],
      db: [],
      nw: [],
      es: [],
      st: [],
      sa: [],
      pm: [],
      sm: [],
      au: [],
    };
  }
  const obj = raw as Record<string, unknown>;
  return {
    ip: normalizeExamHistoryArray(obj.ip),
    sg: normalizeExamHistoryArray(obj.sg),
    fe: normalizeExamHistoryArray(obj.fe),
    ap: normalizeExamHistoryArray(obj.ap),
    sc: normalizeExamHistoryArray(obj.sc),
    db: normalizeExamHistoryArray(obj.db),
    nw: normalizeExamHistoryArray(obj.nw),
    es: normalizeExamHistoryArray(obj.es),
    st: normalizeExamHistoryArray(obj.st),
    sa: normalizeExamHistoryArray(obj.sa),
    pm: normalizeExamHistoryArray(obj.pm),
    sm: normalizeExamHistoryArray(obj.sm),
    au: normalizeExamHistoryArray(obj.au),
  };
}

export default function IpaInfoPage() {
  const [selectedExam, setSelectedExam] = useState<IpaExamId>("fe");
  const selectedTier = IPA_EXAM_TIER_MAP[selectedExam];

  const [tierDataCache, setTierDataCache] = useState<Partial<Record<IpaExamTier, IpaTierData>>>({
    foundation: INITIAL_IPA_TIER_DATA,
  });
  const [loadingTier, setLoadingTier] = useState<IpaExamTier | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadRequestGenRef = useRef(0);

  const [activeTab, setActiveTab] = useState<TabId>("domains");
  const [quizDomainTarget, setQuizDomainTarget] = useState<string>("all");
  const [progress, setProgress] = useState<IpaProgress>(DEFAULT_PROGRESS);
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const examId of IPA_EXAM_IDS) {
      initial[IPA_EXAM_COUNTS[examId].firstDomainId] = true;
    }
    return initial;
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

  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedBackupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const importMsgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollFocusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timers = [resetTimerRef, copiedBackupTimerRef, importMsgTimerRef, scrollFocusTimerRef];
    return () => {
      for (const ref of timers) {
        if (ref.current) {
          clearTimeout(ref.current);
          ref.current = null;
        }
      }
    };
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, unknown>;
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
    });
  }, []);

  const activeTierData = tierDataCache[selectedTier];
  const tierDomains = activeTierData?.domains ?? EMPTY_DOMAINS;
  const tierComparisons = activeTierData?.comparisons ?? EMPTY_COMPARISONS;
  const tierFormulas = activeTierData?.formulaPatterns ?? EMPTY_FORMULAS;
  const tierPitfalls = activeTierData?.pitfalls ?? EMPTY_PITFALLS;
  const tierKeyFacts = activeTierData?.keyFacts ?? EMPTY_KEY_FACTS;
  const tierFlashcards = activeTierData?.flashcards ?? EMPTY_FLASHCARDS;
  const tierQuestions = activeTierData?.questions ?? EMPTY_QUESTIONS;

  const triggerTierLoad = async (targetTier: IpaExamTier) => {
    const reqGen = ++loadRequestGenRef.current;
    setLoadingTier(targetTier);
    setLoadError(null);
    const tierLabel = IPA_TIER_GROUPS.find((g) => g.tier === targetTier)?.label ?? targetTier;
    try {
      const data = await loadIpaTierData(targetTier);
      setTierDataCache((prev) => ({ ...prev, [targetTier]: data }));
      if (loadRequestGenRef.current === reqGen) {
        setLoadingTier(null);
      }
    } catch {
      if (loadRequestGenRef.current === reqGen) {
        setLoadingTier(null);
        setLoadError(`${tierLabel} の学習データ読み込みに失敗しました。`);
      }
    }
  };

  const saveProgress = (next: IpaProgress) => {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage quota errors
    }
  };

  const currentExamMeta = useMemo(
    () => IPA_EXAM_METAS.find((m) => m.id === selectedExam) ?? IPA_EXAM_METAS[0],
    [selectedExam]
  );

  const currentDomains = useMemo(
    () => tierDomains.filter((d) => d.examId === selectedExam),
    [tierDomains, selectedExam]
  );

  const currentTopics = useMemo(
    () => currentDomains.flatMap((d) => d.topics),
    [currentDomains]
  );

  const currentFlashcards = useMemo(
    () => tierFlashcards.filter((c) => c.examId === selectedExam),
    [tierFlashcards, selectedExam]
  );

  const currentQuestions = useMemo(
    () => tierQuestions.filter((q) => q.examId === selectedExam),
    [tierQuestions, selectedExam]
  );

  const currentQuizDomains = useMemo(
    () =>
      currentDomains.map((d) => ({
        id: d.id,
        number: d.number,
        shortLabel: d.number,
        filterLabel: `${d.number}: ${d.title}`,
      })),
    [currentDomains]
  );

  const handleSelectExam = (examId: IpaExamId) => {
    if (examId === selectedExam) return;
    playCyberClick();
    loadRequestGenRef.current++;
    setSelectedExam(examId);
    setQuizDomainTarget("all");
    setTopicQuery("");
    setCompCategory("すべて");
    setCompQuery("");
    setConfirmReset(false);
    setLoadError(null);
    const firstDomainId = IPA_EXAM_COUNTS[examId].firstDomainId;
    setExpandedDomains((prev) =>
      prev[firstDomainId] === undefined ? { ...prev, [firstDomainId]: true } : prev
    );
    const targetTier = IPA_EXAM_TIER_MAP[examId];
    if (!tierDataCache[targetTier]) {
      void triggerTierLoad(targetTier);
    } else {
      setLoadingTier(null);
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
    const nextAnswers = { ...progress.quizAnswers };
    for (const q of currentQuestions) {
      delete nextAnswers[q.id];
    }
    saveProgress({ ...progress, quizAnswers: nextAnswers });
  };

  const handleResetMasteredCards = () => {
    const currentKeywords = new Set(currentFlashcards.map((c) => c.keyword));
    saveProgress({
      ...progress,
      masteredCards: progress.masteredCards.filter((k) => !currentKeywords.has(k)),
    });
  };

  const handleResetAllClick = () => {
    playCyberClick();
    if (!confirmReset) {
      setConfirmReset(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    saveProgress(DEFAULT_PROGRESS);
    setConfirmReset(false);
  };

  const handleExpandAllDomains = (expand: boolean) => {
    playCyberClick();
    const next: Record<string, boolean> = { ...expandedDomains };
    for (const d of currentDomains) {
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

  const handleFocusDomain = (domainId: string) => {
    playCyberClick();
    setTopicQuery("");
    setOnlyIncompleteTopics(false);
    setOnlyWithNotesTopics(false);
    setExpandedDomains((prev) => ({ ...prev, [domainId]: true }));
    if (scrollFocusTimerRef.current) clearTimeout(scrollFocusTimerRef.current);
    scrollFocusTimerRef.current = setTimeout(() => {
      document
        .getElementById(`ipa-domain-${domainId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const handleJumpToKeywordComparison = (kw: string) => {
    playCyberClick();
    const cleanQuery = normalizeIpaSearchQuery(kw);
    setCompCategory("すべて");
    setCompQuery(cleanQuery);
    setActiveTab("comparisons");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchTopicsFromComparison = () => {
    playCyberClick();
    const nextQuery = compQuery.trim();
    setOnlyIncompleteTopics(false);
    setOnlyWithNotesTopics(false);
    setTopicQuery(nextQuery);
    setActiveTab("domains");
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
      mockExamHistory: {
        ...progress.mockExamHistory,
        [selectedExam]: [record, ...progress.mockExamHistory[selectedExam]].slice(0, 5),
      },
    });
  };

  const handleCopyBackup = async () => {
    playCyberClick();
    try {
      await navigator.clipboard.writeText(JSON.stringify(progress));
      setCopiedBackup(true);
      if (copiedBackupTimerRef.current) clearTimeout(copiedBackupTimerRef.current);
      copiedBackupTimerRef.current = setTimeout(() => setCopiedBackup(false), 2500);
    } catch {
      setImportMessage("クリップボードへのコピーに失敗しました。");
    }
  };

  const handleImportBackup = () => {
    playCyberClick();
    try {
      const parsed = JSON.parse(backupInput.trim()) as Record<string, unknown>;
      const restored: IpaProgress = {
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
      if (importMsgTimerRef.current) clearTimeout(importMsgTimerRef.current);
      importMsgTimerRef.current = setTimeout(() => setImportMessage(null), 3000);
    } catch {
      setImportMessage("JSON形式が正しくありません。コピーしたバックアップ文字列を確認してください。");
    }
  };

  const completedTopicCount = currentTopics.filter((t) =>
    progress.completedTopics.includes(t.id)
  ).length;
  const topicPct =
    currentTopics.length > 0 ? Math.round((completedTopicCount / currentTopics.length) * 100) : 0;

  const answeredQuizCount = currentQuestions.filter((q) =>
    Boolean(progress.quizAnswers[q.id]?.length)
  ).length;
  const correctQuizCount = currentQuestions.filter((q) =>
    isQuestionCorrect(q, progress.quizAnswers[q.id])
  ).length;

  const currentMasteredKeywords = currentFlashcards
    .map((c) => c.keyword)
    .filter((k) => progress.masteredCards.includes(k));
  const masteredCardCount = currentMasteredKeywords.length;

  const notedTopicCount = currentTopics.filter(
    (t) => (progress.topicNotes[t.id] ?? "").trim().length > 0
  ).length;

  const totalActions =
    currentTopics.length + currentQuestions.length + currentFlashcards.length;
  const doneActions = completedTopicCount + answeredQuizCount + masteredCardCount;
  const overallPct = totalActions > 0 ? Math.round((doneActions / totalActions) * 100) : 0;

  const { examStatsById, crossExamSummary } = useMemo(() => {
    const completedTopicSet = new Set(progress.completedTopics);
    const masteredCardSet = new Set(progress.masteredCards);

    const byId = {} as Record<
      IpaExamId,
      {
        totalTopics: number;
        doneTopics: number;
        totalQuestions: number;
        answeredQuestions: number;
        correctQuestions: number;
        totalFlashcards: number;
        masteredCards: number;
        started: boolean;
      }
    >;

    let startedExams = 0;
    let totalTopics = 0;
    let doneTopics = 0;
    let totalQuestions = 0;
    let correctQuestions = 0;
    let totalFlashcards = 0;
    let masteredCards = 0;

    for (const meta of IPA_EXAM_METAS) {
      const cachedTier = tierDataCache[meta.tier];
      const counts = IPA_EXAM_COUNTS[meta.id];
      let totalT = counts.totalTopics;
      let doneT = 0;
      let totalQ = counts.totalQuestions;
      let answeredQ = 0;
      let correctQ = 0;
      let totalC = counts.totalFlashcards;
      let masteredC = 0;
      let hasNotes = false;

      if (cachedTier) {
        const topics = cachedTier.domains
          .filter((d) => d.examId === meta.id)
          .flatMap((d) => d.topics);
        totalT = topics.length;
        doneT = topics.filter((t) => completedTopicSet.has(t.id)).length;

        const qs = cachedTier.questions.filter((q) => q.examId === meta.id);
        totalQ = qs.length;
        answeredQ = qs.filter((q) => Boolean(progress.quizAnswers[q.id]?.length)).length;
        correctQ = qs.filter((q) => isQuestionCorrect(q, progress.quizAnswers[q.id])).length;

        const cards = cachedTier.flashcards.filter((c) => c.examId === meta.id);
        totalC = cards.length;
        masteredC = cards.filter((c) => masteredCardSet.has(c.keyword)).length;

        hasNotes = topics.some((t) => (progress.topicNotes[t.id] ?? "").trim().length > 0);
      } else {
        const prefix = `${meta.id}-`;
        doneT = progress.completedTopics.filter((id) => id.startsWith(prefix)).length;
        answeredQ = Object.entries(progress.quizAnswers).filter(
          ([qId, ans]) => qId.startsWith(prefix) && ans.length > 0
        ).length;
        hasNotes = Object.entries(progress.topicNotes).some(
          ([tId, note]) => tId.startsWith(prefix) && note.trim().length > 0
        );
      }

      const hasMock = (progress.mockExamHistory[meta.id] ?? []).length > 0;
      const started = doneT > 0 || answeredQ > 0 || masteredC > 0 || hasMock || hasNotes;

      byId[meta.id] = {
        totalTopics: totalT,
        doneTopics: doneT,
        totalQuestions: totalQ,
        answeredQuestions: answeredQ,
        correctQuestions: correctQ,
        totalFlashcards: totalC,
        masteredCards: masteredC,
        started,
      };

      if (started) startedExams += 1;
      totalTopics += totalT;
      doneTopics += doneT;
      totalQuestions += totalQ;
      correctQuestions += correctQ;
      totalFlashcards += totalC;
      masteredCards += masteredC;
    }

    const totalItems = totalTopics + totalQuestions + totalFlashcards;
    const doneItems = doneTopics + correctQuestions + masteredCards;
    const crossOverallPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

    return {
      examStatsById: byId,
      crossExamSummary: {
        totalExams: IPA_EXAM_METAS.length,
        startedExams,
        totalTopics,
        doneTopics,
        totalQuestions,
        correctQuestions,
        totalFlashcards,
        masteredCards,
        overallPct: crossOverallPct,
      },
    };
  }, [progress, tierDataCache]);

  const topicQuickChips = useMemo(() => {
    const seen = new Set<string>();
    const chips: string[] = [];
    for (const topic of currentTopics) {
      for (const kw of topic.keywords) {
        const trimmed = kw.trim();
        if (!trimmed) continue;
        const normalized = trimmed.toLowerCase();
        if (seen.has(normalized)) continue;
        seen.add(normalized);
        chips.push(trimmed);
        if (chips.length >= 6) return chips;
      }
    }
    return chips;
  }, [currentTopics]);

  const domainQuizStats = useMemo(() => {
    const stats: Record<string, { total: number; correct: number }> = {};
    for (const d of currentDomains) {
      const qs = currentQuestions.filter((q) => q.domainId === d.id);
      const correct = qs.filter((q) => isQuestionCorrect(q, progress.quizAnswers[q.id])).length;
      stats[d.id] = { total: qs.length, correct };
    }
    return stats;
  }, [currentDomains, currentQuestions, progress.quizAnswers]);

  const domainGridClass =
    currentDomains.length <= 1
      ? "grid-cols-1"
      : currentDomains.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : currentDomains.length === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : currentDomains.length === 4
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const filteredDomains = useMemo(() => {
    const q = topicQuery.trim().toLowerCase();
    return currentDomains
      .map((d) => {
        const topics = d.topics.filter((t) => {
          if (onlyIncompleteTopics && progress.completedTopics.includes(t.id)) {
            return false;
          }
          if (onlyWithNotesTopics && !(progress.topicNotes[t.id] ?? "").trim()) {
            return false;
          }
          if (!q) return true;
          const haystack = [t.code, t.title, ...t.keywords, ...t.keyPoints, t.examTip]
            .join(" ")
            .toLowerCase();
          return haystack.includes(q);
        });
        return { ...d, visibleTopics: topics };
      })
      .filter((d) => d.visibleTopics.length > 0);
  }, [
    currentDomains,
    topicQuery,
    onlyIncompleteTopics,
    onlyWithNotesTopics,
    progress.completedTopics,
    progress.topicNotes,
  ]);

  const currentComparisons = useMemo(
    () => tierComparisons.filter((comp) => comp.examIds.includes(selectedExam)),
    [tierComparisons, selectedExam]
  );

  const comparisonCategories = useMemo(
    () => [
      "すべて",
      ...COMPARISON_CATEGORIES.slice(1).filter((cat) =>
        currentComparisons.some((comp) => comp.category === cat)
      ),
    ],
    [currentComparisons]
  );

  const normalizedCompQuery = compQuery.trim().toLowerCase();

  const filteredComparisons = useMemo(() => {
    return currentComparisons.filter((comp) => {
      if (compCategory !== "すべて" && comp.category !== compCategory) return false;
      if (!normalizedCompQuery) return true;
      const haystack = [
        comp.title,
        comp.subtitle,
        comp.decisionRule,
        ...comp.columns,
        ...comp.rows.flatMap((r) => [r.feature, ...r.values]),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedCompQuery);
    });
  }, [currentComparisons, compCategory, normalizedCompQuery]);

  const filteredQuickLookup = useMemo(() => {
    if (!normalizedCompQuery) return currentFlashcards;
    return currentFlashcards.filter((item) =>
      `${item.keyword} ${item.category} ${item.recommended} ${item.reason}`
        .toLowerCase()
        .includes(normalizedCompQuery)
    );
  }, [currentFlashcards, normalizedCompQuery]);

  const filteredFormulas = useMemo(() => {
    return tierFormulas.filter((pat) => {
      if (!pat.examIds.includes(selectedExam)) return false;
      if (!normalizedCompQuery) return true;
      return [pat.title, pat.badge, pat.summary, ...pat.flow, ...pat.keyDesignPoints]
        .join(" ")
        .toLowerCase()
        .includes(normalizedCompQuery);
    });
  }, [tierFormulas, selectedExam, normalizedCompQuery]);

  const filteredPitfalls = useMemo(() => {
    return tierPitfalls.filter((pit) => {
      if (!pit.examIds.includes(selectedExam)) return false;
      if (!normalizedCompQuery) return true;
      return `${pit.trap} ${pit.whyWrong} ${pit.correctApproach}`
        .toLowerCase()
        .includes(normalizedCompQuery);
    });
  }, [tierPitfalls, selectedExam, normalizedCompQuery]);

  const filteredKeyFacts = useMemo(() => {
    return tierKeyFacts.filter((kf) => {
      if (!kf.examIds.includes(selectedExam)) return false;
      if (!normalizedCompQuery) return true;
      return `${kf.target} ${kf.value} ${kf.detail}`
        .toLowerCase()
        .includes(normalizedCompQuery);
    });
  }, [tierKeyFacts, selectedExam, normalizedCompQuery]);

  const tabs: { id: TabId; label: string; icon: typeof BookOpen; badge?: string }[] = [
    {
      id: "domains",
      label: "トピック別学習",
      icon: BookOpen,
      badge: activeTierData ? `${completedTopicCount}/${currentTopics.length}` : "-",
    },
    { id: "comparisons", label: "比較・公式パターン", icon: TableProperties },
    {
      id: "flashcards",
      label: "暗記カード",
      icon: Layers2,
      badge: activeTierData ? `${masteredCardCount}/${currentFlashcards.length}` : "-",
    },
    {
      id: "quiz",
      label: "練習問題・模試",
      icon: HelpCircle,
      badge: activeTierData ? `${correctQuizCount}/${currentQuestions.length}` : "-",
    },
    { id: "resources", label: "公式リソース", icon: Compass },
  ];

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentId: TabId) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tabIds = tabs.map((t) => t.id);
    const currentIndex = tabIds.indexOf(currentId);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabIds.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabIds.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextId = tabIds[nextIndex];
      playCyberClick();
      setActiveTab(nextId);
      requestAnimationFrame(() => {
        document.getElementById(`ipa-tab-${nextId}`)?.focus();
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen min-w-0">
      <HeroBanner
        title="情報処理技術者試験 情報局"
        subtitle="経産省（IPA）全13区分（IP・SG・FE・AP・高度9区分）統合学習ハブ"
      />

      <div className="max-w-6xl w-full min-w-0 mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          title="🚧 一部工事中・学習ハブ先行公開"
          message="現在 IPA 情報処理技術者試験・情報処理安全確保支援士試験の全13区分（IP / SG / FE / AP / SC / DB / NW / ES / ST / SA / PM / SM / AU）の公式シラバスに基づく統合学習ハブを掲載しています。社内の資格取得支援・受験補助ルール等は準備中（確定次第掲載）です。"
          statusType="construction"
        />

        {/* 試験区分セレクター（統合型スイッチャー：3グループ整理） */}
        <section
          aria-label="学習する試験区分選択"
          className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4 min-w-0 max-w-full"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <span className="text-xs font-black text-slate-700 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>学習する試験区分を選択（全{crossExamSummary.totalExams}区分・1ページ内で切り替え）</span>
            </span>
            <span className="text-[11px] text-slate-500">
              各区分の進捗・模試履歴は個別に記録されます
            </span>
          </div>

          {/* 全13区分横断 総合進捗サマリバー */}
          <div className="rounded-xl bg-slate-900 text-white p-3.5 sm:p-4 border border-slate-800 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5 text-xs font-black text-indigo-200">
                <Award className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>全{crossExamSummary.totalExams}区分 横断 総合進捗サマリ</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-cyan-300">
                通算達成率 {crossExamSummary.overallPct}%
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                <span className="text-[10px] sm:text-[11px] text-slate-300 font-semibold">
                  着手済み区分
                </span>
                <span className="text-xs sm:text-sm font-mono font-black text-white whitespace-nowrap">
                  {crossExamSummary.startedExams}
                  <span className="text-slate-400 font-normal">/{crossExamSummary.totalExams}</span>
                </span>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                <span className="text-[10px] sm:text-[11px] text-slate-300 font-semibold">
                  通算トピック習得
                </span>
                <span className="text-xs sm:text-sm font-mono font-black text-cyan-300 whitespace-nowrap">
                  {crossExamSummary.doneTopics}
                  <span className="text-slate-400 font-normal">/{crossExamSummary.totalTopics}</span>
                </span>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                <span className="text-[10px] sm:text-[11px] text-slate-300 font-semibold">
                  通算演習正答
                </span>
                <span className="text-xs sm:text-sm font-mono font-black text-emerald-300 whitespace-nowrap">
                  {crossExamSummary.correctQuestions}
                  <span className="text-slate-400 font-normal">/{crossExamSummary.totalQuestions}</span>
                </span>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                <span className="text-[10px] sm:text-[11px] text-slate-300 font-semibold">
                  通算カード習得
                </span>
                <span className="text-xs sm:text-sm font-mono font-black text-amber-300 whitespace-nowrap">
                  {crossExamSummary.masteredCards}
                  <span className="text-slate-400 font-normal">/{crossExamSummary.totalFlashcards}</span>
                </span>
              </div>
            </div>

            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${crossExamSummary.overallPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-3.5">
            {IPA_TIER_GROUPS.map((group) => {
              const groupMetas = IPA_EXAM_METAS.filter((m) => m.tier === group.tier);
              return (
                <div
                  key={group.tier}
                  role="group"
                  aria-label={group.label}
                  className="space-y-1.5"
                >
                  <div className="text-[11px] font-bold text-slate-500 px-1">
                    {group.label}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                    {groupMetas.map((meta) => {
                      const isSelected = meta.id === selectedExam;
                      const stat = examStatsById[meta.id];

                      return (
                        <button
                          key={meta.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleSelectExam(meta.id)}
                          className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-slate-900 text-white border-slate-900 shadow-md"
                              : "bg-slate-50/70 text-slate-700 border-slate-200 hover:bg-white hover:border-indigo-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs sm:text-sm font-black leading-snug flex items-center gap-1.5 min-w-0">
                              {stat.started && (
                                <span
                                  aria-label="着手済み"
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    isSelected ? "bg-emerald-400" : "bg-emerald-500"
                                  }`}
                                />
                              )}
                              <span className="truncate">{meta.shortLabel}</span>
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                                isSelected
                                  ? "bg-indigo-500/30 text-indigo-200 border border-indigo-400/40"
                                  : "bg-white text-slate-500 border border-slate-200"
                              }`}
                            >
                              {meta.skillLevel}
                            </span>
                          </div>
                          <div
                            className={`mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-mono ${
                              isSelected ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            <span>
                              トピック {stat.doneTopics}/{stat.totalTopics}
                            </span>
                            <span>•</span>
                            <span>
                              演習 {stat.correctQuestions}/{stat.totalQuestions}
                            </span>
                            <span>•</span>
                            <span>
                              カード {stat.masteredCards}/{stat.totalFlashcards}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 選択中試験のステータス HUD バナー */}
        <TiltCard maxTilt={2} glareOpacity={0.05} className="rounded-3xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-700/50 p-5 sm:p-8 text-white shadow-xl"
          >
            <div className="absolute -top-10 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-400/20 text-indigo-200 border border-indigo-400/30 tracking-wider">
                    <ScrollText size={12} />
                    <span>IPA {currentExamMeta.id.toUpperCase()} STUDY HUB</span>
                  </span>
                  <span className="text-xs text-slate-300">
                    {activeTierData ? currentTopics.length : "-"} トピック ・ 比較表{" "}
                    {activeTierData ? currentComparisons.length : "-"} 種 ・ カード{" "}
                    {activeTierData ? currentFlashcards.length : "-"} 枚 ・ 演習{" "}
                    {activeTierData ? currentQuestions.length : "-"} 問
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white break-words">
                  {currentExamMeta.title} 合格対策ハブ
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {currentExamMeta.description}
                </p>
              </div>

              <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2.5 lg:min-w-[360px] min-w-0">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">トピック習得</div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">{topicPct}%</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {completedTopicCount} / {activeTierData ? currentTopics.length : "-"}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">暗記カード</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    {masteredCardCount} / {activeTierData ? currentFlashcards.length : "-"}
                  </div>
                  <div className="text-[11px] text-slate-400">枚習得</div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">演習問題</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                    {correctQuizCount} / {activeTierData ? currentQuestions.length : "-"}
                  </div>
                  <div className="text-[11px] text-slate-400">問正解</div>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* 動的ロード中・エラー表示 */}
        {(!activeTierData || loadingTier !== null) && (
          <div
            role="status"
            aria-live="polite"
            className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3 shadow-xs"
          >
            {loadError ? (
              <>
                <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
                <p className="text-sm font-black text-slate-800">{loadError}</p>
                <button
                  type="button"
                  onClick={() => void triggerTierLoad(selectedTier)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  再読み込みする
                </button>
              </>
            ) : (
              <>
                <Loader2 className="w-7 h-7 text-indigo-600 mx-auto animate-spin" />
                <p className="text-xs font-bold text-slate-600">
                  {currentExamMeta.title} の学習データを読み込み中...
                </p>
              </>
            )}
          </div>
        )}

        {activeTierData && loadingTier === null && (
          <>
        {/* 試験概要カード */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {currentExamMeta.examFacts.map((fact) => (
            <div
              key={fact.label}
              className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs space-y-1 min-w-0"
            >
              <div className="text-[11px] font-bold text-slate-400">{fact.label}</div>
              <div className="text-sm sm:text-base font-black text-slate-900 break-words">
                {fact.value}
              </div>
              <div className="text-[11px] text-slate-500 leading-snug">{fact.detail}</div>
            </div>
          ))}
        </section>

        {/* 総合進捗＆データ管理バー */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 text-xs font-bold">
                <span className="text-slate-700 flex items-start space-x-1.5">
                  <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    {currentExamMeta.shortLabel} 総合進捗（トピック・暗記カード・練習問題）
                  </span>
                </span>
                <span className="font-mono text-indigo-700 shrink-0">{overallPct}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                aria-expanded={showBackupPanel}
                aria-controls="ipa-backup-panel"
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

          {!showBackupPanel && importMessage && (
            <div role="status" aria-live="polite" className="text-xs font-bold text-indigo-700">
              {importMessage}
            </div>
          )}

          {showBackupPanel && (
            <div id="ipa-backup-panel" className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                <p className="text-xs text-slate-600">
                  全試験区分の進捗やメモはブラウザの localStorage に自動保存されます。別端末へ移行する場合は JSON 文字列をコピーしてください。
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
              <div className="flex flex-col lg:flex-row gap-2">
                <input
                  type="text"
                  aria-label="バックアップJSON入力"
                  value={backupInput}
                  onChange={(e) => setBackupInput(e.target.value)}
                  placeholder="復元するバックアップ JSON 文字列を貼り付け..."
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleImportBackup}
                  disabled={!backupInput.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-40 cursor-pointer shrink-0"
                >
                  復元を実行
                </button>
              </div>
              {importMessage && (
                <div role="status" aria-live="polite" className="text-xs font-bold text-indigo-700">
                  {importMessage}
                </div>
              )}
            </div>
          )}
        </section>

        {/* タブナビゲーション */}
        <div
          role="tablist"
          aria-label="IPA 学習セクション"
          className="flex flex-wrap gap-2"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`ipa-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`ipa-panel-${tab.id}`}
                tabIndex={active ? 0 : -1}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                onClick={() => {
                  playCyberClick();
                  setActiveTab(tab.id);
                }}
                className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border whitespace-nowrap max-w-full ${
                  active
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200/80 hover:border-indigo-300 hover:text-slate-900"
                }`}
              >
                <Icon size={15} className="shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: トピック別学習 */}
        {activeTab === "domains" && (
          <div
            role="tabpanel"
            id="ipa-panel-domains"
            aria-labelledby="ipa-tab-domains"
            className="space-y-6"
          >
            {/* クリック可能な分野別進捗バー */}
            <section className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <span className="text-xs font-black text-slate-700 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>分野別進捗（クリックで該当分野へジャンプ）</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  {currentExamMeta.shortLabel} 全{currentDomains.length}分野
                </span>
              </div>

              <div className={`grid ${domainGridClass} gap-3`}>
                {currentDomains.map((domain) => {
                  const style = ACCENT_STYLES[domain.accentColor];
                  const domainDone = domain.topics.filter((t) =>
                    progress.completedTopics.includes(t.id)
                  ).length;
                  const domainPct =
                    domain.topics.length > 0
                      ? Math.round((domainDone / domain.topics.length) * 100)
                      : 0;
                  const qStat = domainQuizStats[domain.id] ?? { total: 0, correct: 0 };

                  return (
                    <div
                      key={domain.id}
                      className={`bg-white rounded-xl border ${style.border} hover:border-indigo-300 shadow-xs transition-all flex flex-col justify-between overflow-hidden`}
                    >
                      <button
                        type="button"
                        onClick={() => handleFocusDomain(domain.id)}
                        onMouseEnter={() => playCyberHover()}
                        className="w-full p-3.5 text-left space-y-2 cursor-pointer group hover:bg-slate-50/70 transition-colors flex-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${style.badge} truncate`}
                          >
                            {domain.number} ・ {domain.category}
                          </span>
                          <span className="text-[11px] font-mono font-black text-slate-700 shrink-0">
                            {domainPct}%
                            <span className="ml-1 text-[10px] font-normal text-slate-400">
                              ({domainDone}/{domain.topics.length})
                            </span>
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-indigo-700 line-clamp-2 leading-snug transition-colors">
                          {domain.title}
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full ${style.bar} transition-all duration-300`}
                            style={{ width: `${domainPct}%` }}
                          />
                        </div>
                      </button>

                      <div className="px-3.5 py-2 border-t border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleFocusDomain(domain.id)}
                          className="text-[11px] font-bold text-slate-600 hover:text-indigo-700 inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <span>トピックへ</span>
                          <ChevronDown size={12} />
                        </button>
                        {qStat.total > 0 && (
                          <button
                            type="button"
                            onClick={() => handleJumpToDomainQuiz(domain.id)}
                            className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center space-x-1 cursor-pointer"
                          >
                            <span>
                              演習 ({qStat.correct}/{qStat.total})
                            </span>
                            <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* フィルター＆検索バー + クイック検索チップ */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center lg:justify-between gap-3">
                <div className="relative w-full lg:w-72 order-1">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    aria-label="用語・キーワード検索"
                    value={topicQuery}
                    onChange={(e) => setTopicQuery(e.target.value)}
                    placeholder="用語・キーワード検索..."
                    className="w-full pl-8 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {topicQuery && (
                    <button
                      type="button"
                      onClick={() => setTopicQuery("")}
                      aria-label="検索をクリア"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {topicQuickChips.length > 0 && (
                  <div
                    role="group"
                    aria-label="クイック検索チップ"
                    className="w-full flex flex-wrap items-center gap-1.5 order-2 lg:order-3 lg:pt-2.5 lg:border-t lg:border-slate-100"
                  >
                    <span className="text-[11px] font-bold text-slate-400 mr-0.5 shrink-0">
                      クイック検索:
                    </span>
                    {topicQuickChips.map((kw) => {
                      const isChipActive =
                        topicQuery.trim().toLowerCase() === kw.toLowerCase();
                      return (
                        <button
                          key={kw}
                          type="button"
                          aria-pressed={isChipActive}
                          onClick={() => {
                            playCyberClick();
                            setTopicQuery(isChipActive ? "" : kw);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors cursor-pointer ${
                            isChipActive
                              ? "bg-slate-900 text-cyan-300 border-slate-900"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-800"
                          }`}
                        >
                          {kw}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 order-3 lg:order-2">
                  <button
                    type="button"
                    aria-pressed={onlyIncompleteTopics}
                    onClick={() => {
                      playCyberClick();
                      setOnlyIncompleteTopics((v) => !v);
                    }}
                    className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
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
                    aria-pressed={onlyWithNotesTopics}
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

            {/* ドメイン・トピック一覧 */}
            {filteredDomains.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-10 text-center space-y-2">
                <Search className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="text-sm font-black text-slate-700">条件に一致するトピックがありません</div>
                <button
                  type="button"
                  onClick={() => {
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
                  const Icon = CATEGORY_ICONS[domain.category] ?? Cpu;
                  const style = ACCENT_STYLES[domain.accentColor];
                  const isExpanded = Boolean(
                    expandedDomains[domain.id] || topicQuery.trim() || onlyWithNotesTopics
                  );
                  const domainDone = domain.topics.filter((t) =>
                    progress.completedTopics.includes(t.id)
                  ).length;
                  const domainPct = Math.round((domainDone / domain.topics.length) * 100);

                  return (
                    <div
                      key={domain.id}
                      id={`ipa-domain-${domain.id}`}
                      className={`scroll-mt-6 bg-white rounded-2xl border ${style.border} shadow-xs overflow-hidden`}
                    >
                      <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          aria-controls={`ipa-domain-panel-${domain.id}`}
                          onClick={() => {
                            playCyberClick();
                            setExpandedDomains((prev) => ({
                              ...prev,
                              [domain.id]: !prev[domain.id],
                            }));
                          }}
                          className="flex items-start space-x-3.5 text-left flex-1 min-w-0 cursor-pointer"
                        >
                          <div className={`p-2.5 rounded-xl border shrink-0 ${style.iconBg}`}>
                            <Icon size={20} />
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${style.badge}`}
                              >
                                {domain.category} ・ {domain.number}
                              </span>
                              <span className="text-xs font-mono text-slate-500">
                                完了 {domainDone}/{domain.topics.length} ({domainPct}%)
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 break-words">
                              {domain.title}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">{domain.summary}</p>
                          </div>
                        </button>

                        <div className="flex items-center justify-end space-x-2 shrink-0">
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
                            aria-expanded={isExpanded}
                            aria-controls={`ipa-domain-panel-${domain.id}`}
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
                        <div
                          id={`ipa-domain-panel-${domain.id}`}
                          className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-4"
                        >
                          {domain.visibleTopics.map((topic) => {
                            const isDone = progress.completedTopics.includes(topic.id);
                            const noteText = progress.topicNotes[topic.id] ?? "";
                            const isNoteOpen = Boolean(openNoteTopics[topic.id] || noteText.trim());

                            return (
                              <div
                                key={topic.id}
                                className={`bg-white rounded-xl border p-4 sm:p-5 space-y-3 transition-all ${
                                  isDone ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200/80"
                                }`}
                              >
                                <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-2.5 sm:gap-3">
                                  <button
                                    type="button"
                                    aria-pressed={isDone}
                                    onClick={() => toggleTopic(topic.id)}
                                    className="flex items-start space-x-2.5 text-left cursor-pointer group min-w-0 flex-1"
                                  >
                                    {isDone ? (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 shrink-0 mt-0.5" />
                                    )}
                                    <div className="min-w-0">
                                      <span className="text-[11px] font-mono font-bold text-slate-400">
                                        {topic.code}
                                      </span>
                                      <h4
                                        className={`text-sm sm:text-base font-black break-words ${
                                          isDone ? "text-emerald-950" : "text-slate-900"
                                        }`}
                                      >
                                        {topic.title}
                                      </h4>
                                    </div>
                                  </button>

                                  <button
                                    type="button"
                                    aria-expanded={isNoteOpen}
                                    aria-controls={`ipa-note-panel-${topic.id}`}
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

                                <div className="flex flex-wrap gap-1.5">
                                  {topic.keywords.map((kw) => (
                                    <button
                                      key={kw}
                                      type="button"
                                      onClick={() => handleJumpToKeywordComparison(kw)}
                                      title="比較表・逆引きで検索する"
                                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 font-mono text-[11px] font-bold text-slate-700 hover:text-indigo-800 transition-colors cursor-pointer"
                                    >
                                      {kw}
                                    </button>
                                  ))}
                                </div>

                                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                                  {topic.keyPoints.map((pt) => (
                                    <li key={pt} className="flex items-start space-x-2">
                                      <span className="text-indigo-500 font-bold mt-0.5">•</span>
                                      <span className="leading-relaxed">{pt}</span>
                                    </li>
                                  ))}
                                </ul>

                                <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 px-3.5 py-2.5 flex items-start space-x-2">
                                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <p className="text-xs text-amber-950 leading-relaxed">
                                    <span className="font-bold">試験のポイント: </span>
                                    {topic.examTip}
                                  </p>
                                </div>

                                {isNoteOpen && (
                                  <div id={`ipa-note-panel-${topic.id}`} className="pt-2">
                                    <label
                                      htmlFor={`ipa-note-input-${topic.id}`}
                                      className="sr-only"
                                    >
                                      {topic.title} の学習メモ
                                    </label>
                                    <textarea
                                      id={`ipa-note-input-${topic.id}`}
                                      rows={2}
                                      value={noteText}
                                      onChange={(e) => handleUpdateTopicNote(topic.id, e.target.value)}
                                      placeholder="このトピックのメモ（公式やひっかけポイントの自分用まとめなど）..."
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

        {/* TAB 2: 比較表・公式パターン */}
        {activeTab === "comparisons" && (
          <div
            role="tabpanel"
            id="ipa-panel-comparisons"
            aria-labelledby="ipa-tab-comparisons"
            className="space-y-8"
          >
            {/* 比較表フィルタ */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div
                  role="group"
                  aria-label="比較表カテゴリフィルター"
                  className="flex flex-wrap items-center gap-1.5"
                >
                  {comparisonCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={compCategory === cat}
                      onClick={() => {
                        playCyberClick();
                        setCompCategory(cat);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                        compCategory === cat
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative w-full lg:w-72 shrink-0">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    aria-label="比較表・逆引き・公式検索"
                    value={compQuery}
                    onChange={(e) => setCompQuery(e.target.value)}
                    placeholder="比較表・逆引き・公式を検索..."
                    className="w-full pl-8 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {compQuery && (
                    <button
                      type="button"
                      onClick={() => setCompQuery("")}
                      aria-label="検索をクリア"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* 検索ヒット件数サマリバー */}
              {compQuery.trim() && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600"
                >
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                    <span className="font-bold text-slate-700 break-words">
                      「{compQuery.trim()}」のヒット件数:
                    </span>
                    <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-mono">
                      <span
                        className={
                          filteredComparisons.length > 0
                            ? "text-indigo-700 font-bold"
                            : "text-slate-400"
                        }
                      >
                        比較表 {filteredComparisons.length} 件
                      </span>
                      <span className="text-slate-300">/</span>
                      <span
                        className={
                          filteredQuickLookup.length > 0
                            ? "text-amber-700 font-bold"
                            : "text-slate-400"
                        }
                      >
                        逆引き {filteredQuickLookup.length} 件
                      </span>
                      <span className="text-slate-300">/</span>
                      <span
                        className={
                          filteredFormulas.length > 0
                            ? "text-cyan-700 font-bold"
                            : "text-slate-400"
                        }
                      >
                        公式 {filteredFormulas.length} 件
                      </span>
                      <span className="text-slate-300">/</span>
                      <span
                        className={
                          filteredPitfalls.length > 0
                            ? "text-rose-700 font-bold"
                            : "text-slate-400"
                        }
                      >
                        ひっかけ {filteredPitfalls.length} 件
                      </span>
                      <span className="text-slate-300">/</span>
                      <span
                        className={
                          filteredKeyFacts.length > 0
                            ? "text-emerald-700 font-bold"
                            : "text-slate-400"
                        }
                      >
                        早見 {filteredKeyFacts.length} 件
                      </span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setCompQuery("");
                    }}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-bold cursor-pointer shrink-0 transition-colors"
                  >
                    <X size={12} className="shrink-0" />
                    <span>検索クリア</span>
                  </button>
                </div>
              )}
            </div>

            {/* 全5セクション0件時の空状態カード */}
            {filteredComparisons.length === 0 &&
              filteredQuickLookup.length === 0 &&
              filteredFormulas.length === 0 &&
              filteredPitfalls.length === 0 &&
              filteredKeyFacts.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 text-center space-y-3 shadow-xs">
                  <Search className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="text-sm sm:text-base font-black text-slate-900 break-words">
                    該当する比較表・逆引きが見つかりませんでした
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed break-words">
                    {compQuery.trim()
                      ? `「${compQuery.trim()}」${
                          compCategory !== "すべて" ? `（カテゴリ: ${compCategory}）` : ""
                        }に一致する比較表・逆引き・公式パターンは ${currentExamMeta.shortLabel} には登録されていません。`
                      : `カテゴリ「${compCategory}」に該当する比較表・逆引き・公式パターンは ${currentExamMeta.shortLabel} には登録されていません。`}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        playCyberClick();
                        setCompCategory("すべて");
                        setCompQuery("");
                      }}
                      className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors max-w-full"
                    >
                      <RotateCcw size={13} className="shrink-0" />
                      <span>フィルタ解除</span>
                    </button>
                    {compQuery.trim() && (
                      <button
                        type="button"
                        onClick={handleSearchTopicsFromComparison}
                        className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors max-w-full text-center"
                      >
                        <BookOpen size={13} className="shrink-0" />
                        <span>このキーワードでトピック別学習を検索する</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

            {/* 比較表カード */}
            {filteredComparisons.length > 0 && (
              <div className="space-y-5">
                {filteredComparisons.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs space-y-4 min-w-0"
                  >
                    <div className="min-w-0">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {comp.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1.5 break-words">
                        {comp.title}
                      </h3>
                      <p className="text-xs text-slate-500 break-words">{comp.subtitle}</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/70">
                            <th className="py-2.5 px-3 font-black text-slate-700 whitespace-nowrap">
                              比較項目
                            </th>
                            {comp.columns.map((col) => (
                              <th key={col} className="py-2.5 px-3 font-black text-indigo-800 whitespace-nowrap">
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
                                <td key={idx} className="py-2.5 px-3 text-slate-600 text-xs">
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="rounded-xl bg-slate-900 text-slate-100 px-4 py-3 text-xs flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="min-w-0 break-words">
                        <strong className="text-indigo-300">使い分けルール: </strong>
                        {comp.decisionRule}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 逆引き早見インデックス */}
            {filteredQuickLookup.length > 0 && (
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2 min-w-0">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                    <span className="break-words">要件・出題キーワード → 推奨用語・対策・理由</span>
                  </h3>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                    {filteredQuickLookup.length} 件
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredQuickLookup.map((item) => (
                    <div
                      key={item.keyword}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between gap-2 min-w-0"
                    >
                      <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 leading-snug break-words min-w-0">
                          {item.keyword}
                        </span>
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 max-w-full truncate">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-black text-indigo-800 bg-indigo-50/70 border border-indigo-100 px-3 py-1.5 rounded-lg break-words">
                        → {item.recommended}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed break-words">
                        {item.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 頻出公式・計算パターン */}
            {filteredFormulas.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span>頻出公式・計算パターン</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFormulas.map((pat) => (
                    <SpotlightCard
                      key={pat.id}
                      className="p-5 space-y-3 bg-white border border-slate-200/80 rounded-2xl min-w-0"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm sm:text-base font-black text-slate-900 break-words min-w-0">
                          {pat.title}
                        </h4>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 max-w-full break-words">
                          {pat.badge}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {pat.flow.map((step, idx) => (
                          <div key={step} className="flex items-center gap-1.5 max-w-full">
                            <span className="px-2 py-1 rounded-lg bg-slate-100 font-mono text-[11px] font-bold text-slate-800 break-words">
                              {step}
                            </span>
                            {idx < pat.flow.length - 1 && (
                              <ArrowRight size={12} className="text-slate-400 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed break-words">{pat.summary}</p>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {pat.keyDesignPoints.map((pt) => (
                          <li key={pt} className="flex items-start space-x-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">•</span>
                            <span className="break-words min-w-0">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </SpotlightCard>
                  ))}
                </div>
              </section>
            )}

            {/* よくあるひっかけ対策 */}
            {filteredPitfalls.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>よくあるひっかけ・誤答パターン</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPitfalls.map((pit) => (
                    <div
                      key={pit.id}
                      className="bg-white rounded-2xl border border-amber-200/80 p-5 space-y-2.5 shadow-xs min-w-0"
                    >
                      <div className="text-xs font-black text-rose-700 break-words">✕ {pit.trap}</div>
                      <p className="text-xs text-slate-600 leading-relaxed break-words">{pit.whyWrong}</p>
                      <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 px-3 py-2 text-xs text-emerald-950 break-words">
                        <span className="font-bold">○ 正しいアプローチ: </span>
                        {pit.correctApproach}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 重要数値・用語早見 */}
            {filteredKeyFacts.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Gauge className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span>重要数値・用語早見表</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {filteredKeyFacts.map((kf) => (
                    <div
                      key={kf.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-1 shadow-xs min-w-0"
                    >
                      <div className="font-mono text-xs font-black text-indigo-700 break-words">
                        {kf.target}
                      </div>
                      <div className="text-sm font-black text-slate-900 break-words">{kf.value}</div>
                      <p className="text-[11px] text-slate-500 leading-snug break-words">{kf.detail}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* TAB 3: フラッシュカード */}
        {activeTab === "flashcards" && (
          <div
            role="tabpanel"
            id="ipa-panel-flashcards"
            aria-labelledby="ipa-tab-flashcards"
          >
            <CertificationFlashcards
              key={`fc-${selectedExam}`}
              items={currentFlashcards}
              masteredKeywords={currentMasteredKeywords}
              onToggleMastered={handleToggleMasteredCard}
              onResetMastered={handleResetMasteredCards}
              badgeText={`${currentExamMeta.shortLabel} 暗記カード`}
              title="出題キーワード・要件 → 用語 / 対策 即答トレーニング"
              promptLabel="次の説明・要件に該当する用語や対策手法は？"
              answerLabel="対応する重要用語・対策"
            />
          </div>
        )}

        {/* TAB 4: 練習問題・模試 */}
        {activeTab === "quiz" && (
          <div
            role="tabpanel"
            id="ipa-panel-quiz"
            aria-labelledby="ipa-tab-quiz"
          >
            <CertificationPracticeQuiz
              key={`quiz-${selectedExam}-${quizDomainTarget}`}
              questions={currentQuestions}
              domains={currentQuizDomains}
              examBadgeLabel={`${currentExamMeta.shortLabel} 演習`}
              passingConfig={currentExamMeta.passingConfig}
              answers={progress.quizAnswers}
              bookmarkedIds={progress.bookmarkedQuestions}
              mockExamHistory={progress.mockExamHistory[selectedExam]}
              initialDomain={quizDomainTarget}
              secondsPerQuestion={currentExamMeta.secondsPerQuestion}
              onSubmitAnswer={handleSubmitAnswer}
              onToggleBookmark={handleToggleBookmark}
              onRecordMockExam={handleRecordMockExam}
              onResetQuiz={handleResetQuiz}
            />
          </div>
        )}

        {/* TAB 5: 公式リソース */}
        {activeTab === "resources" && (
          <div
            role="tabpanel"
            id="ipa-panel-resources"
            aria-labelledby="ipa-tab-resources"
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {IPA_OFFICIAL_RESOURCES.map((res) => (
              <TiltCard key={res.url} className="h-full">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playCyberClick()}
                  className="block h-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-indigo-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {res.badge}
                    </span>
                    <ExternalLink size={15} className="text-slate-400" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">{res.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                  <div className="text-[11px] font-mono text-indigo-700 truncate">{res.url}</div>
                </a>
              </TiltCard>
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
