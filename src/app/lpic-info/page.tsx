"use client";

import { useEffect, useState, useMemo, useRef, type KeyboardEvent } from "react";
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
  Activity,
  Database,
  Globe,
  Mail,
  Server,
  Share2,
  Wrench,
  Lock,
  KeyRound,
  ShieldAlert,
  Box,
  Boxes,
  CloudCog,
  Layers,
  GitMerge,
  Workflow,
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
import type {
  CertExamFact,
  CertFlashcardItem,
  CertMockExamRecord,
  CertQuestion,
} from "@/components/certification/types";
import type {
  LpicComparisonTable,
  LpicKeyPathFact,
  LpicOfficialResource,
  LpicPitfall,
  LpicWorkflowPattern,
  UnifiedLpicDomain,
} from "@/data/lpic-types";
import {
  INITIAL_LPIC_CERT_DATA,
  LPIC_LEVELS,
  LPIC_LEVEL_META,
  loadLpicCertData,
  type LpicCertData,
  type LpicLevel,
} from "@/components/lpic/lpicCertRegistry";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import { normalizeCommandSearchQuery } from "@/lib/lpic-search";

type TabId = "domains" | "comparisons" | "flashcards" | "quiz" | "resources";

const EMPTY_EXAM_FACTS: CertExamFact[] = [];
const EMPTY_DOMAINS: UnifiedLpicDomain[] = [];
const EMPTY_COMPARISONS: LpicComparisonTable[] = [];
const EMPTY_PATTERNS: LpicWorkflowPattern[] = [];
const EMPTY_PITFALLS: LpicPitfall[] = [];
const EMPTY_KEY_PATHS: LpicKeyPathFact[] = [];
const EMPTY_QUICK_LOOKUP: CertFlashcardItem[] = [];
const EMPTY_QUESTIONS: CertQuestion[] = [];
const EMPTY_RESOURCES: LpicOfficialResource[] = [];

interface LpicProgress {
  completedTopics: string[];
  quizAnswers: Record<string, number[]>;
  bookmarkedQuestions: string[];
  masteredCards: string[];
  topicNotes: Record<string, string>;
  mockExamHistory: CertMockExamRecord[];
}

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
  "topic-200": Activity,
  "topic-201": Cpu,
  "topic-202": Terminal,
  "topic-203": HardDrive,
  "topic-204": Database,
  "topic-205": Network,
  "topic-206": Wrench,
  "topic-207": Globe,
  "topic-208": Server,
  "topic-209": Share2,
  "topic-210": Users,
  "topic-211": Mail,
  "topic-212": Shield,
  "topic-301": Server,
  "topic-302": Globe,
  "topic-303": Share2,
  "topic-304": Users,
  "topic-305": KeyRound,
  "topic-331": Lock,
  "topic-332": ShieldAlert,
  "topic-333": KeyRound,
  "topic-334": Network,
  "topic-335": Shield,
  "topic-351": Box,
  "topic-352": Boxes,
  "topic-353": CloudCog,
  "topic-361": Layers,
  "topic-362": GitMerge,
  "topic-363": Database,
  "topic-364": Workflow,
};

const ACCENT_STYLES: Record<
  UnifiedLpicDomain["accentColor"],
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

function loadProgressFromStorage(storageKey: string): LpicProgress {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      completedTopics: normalizeStringArray(parsed.completedTopics),
      quizAnswers: normalizeQuizAnswers(parsed.quizAnswers),
      bookmarkedQuestions: normalizeStringArray(parsed.bookmarkedQuestions),
      masteredCards: normalizeStringArray(parsed.masteredCards),
      topicNotes: normalizeStringRecord(parsed.topicNotes),
      mockExamHistory: normalizeMockExamHistory(parsed.mockExamHistory),
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function LpicInfoPage() {
  const [level, setLevel] = useState<LpicLevel>("lpic-1");
  const meta = LPIC_LEVEL_META[level];

  const [certDataCache, setCertDataCache] = useState<Partial<Record<LpicLevel, LpicCertData>>>({
    "lpic-1": INITIAL_LPIC_CERT_DATA,
  });
  const [loadingLevel, setLoadingLevel] = useState<LpicLevel | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadRequestGenRef = useRef(0);

  const [activeTab, setActiveTab] = useState<TabId>("domains");
  const [examFilter, setExamFilter] = useState<string>("all");
  const [quizDomainTarget, setQuizDomainTarget] = useState<string>("all");
  const [progressMap, setProgressMap] = useState<Record<LpicLevel, LpicProgress>>({
    "lpic-1": DEFAULT_PROGRESS,
    "lpic-2": DEFAULT_PROGRESS,
    "lpic-300": DEFAULT_PROGRESS,
    "lpic-303": DEFAULT_PROGRESS,
    "lpic-305": DEFAULT_PROGRESS,
    "lpic-306": DEFAULT_PROGRESS,
  });
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({
    "topic-101": true,
    "topic-200": true,
    "topic-301": true,
    "topic-331": true,
    "topic-351": true,
    "topic-361": true,
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
  const [copiedNotes, setCopiedNotes] = useState<boolean>(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedBackupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedNotesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const importMsgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timers = [resetTimerRef, copiedBackupTimerRef, copiedNotesTimerRef, importMsgTimerRef];
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
      const loaded = {} as Record<LpicLevel, LpicProgress>;
      for (const lvl of LPIC_LEVELS) {
        loaded[lvl] = loadProgressFromStorage(LPIC_LEVEL_META[lvl].storageKey);
      }
      setProgressMap(loaded);
    });
  }, []);

  const activeData = certDataCache[level];
  const examFacts = activeData?.examFacts ?? EMPTY_EXAM_FACTS;
  const domains = activeData?.domains ?? EMPTY_DOMAINS;
  const comparisons = activeData?.comparisons ?? EMPTY_COMPARISONS;
  const patterns = activeData?.patterns ?? EMPTY_PATTERNS;
  const pitfalls = activeData?.pitfalls ?? EMPTY_PITFALLS;
  const keyPaths = activeData?.keyPaths ?? EMPTY_KEY_PATHS;
  const quickLookup = activeData?.quickLookup ?? EMPTY_QUICK_LOOKUP;
  const practiceQuestions = activeData?.practiceQuestions ?? EMPTY_QUESTIONS;
  const officialResources = activeData?.officialResources ?? EMPTY_RESOURCES;
  const progress = progressMap[level];

  const triggerLevelLoad = async (targetLevel: LpicLevel) => {
    const reqGen = ++loadRequestGenRef.current;
    setLoadingLevel(targetLevel);
    setLoadError(null);
    try {
      const data = await loadLpicCertData(targetLevel);
      setCertDataCache((prev) => ({ ...prev, [targetLevel]: data }));
      if (loadRequestGenRef.current === reqGen) {
        setLoadingLevel(null);
      }
    } catch {
      if (loadRequestGenRef.current === reqGen) {
        setLoadingLevel(null);
        setLoadError(`${LPIC_LEVEL_META[targetLevel].label} の学習データ読み込みに失敗しました。`);
      }
    }
  };

  const saveProgress = (next: LpicProgress) => {
    setProgressMap((prev) => ({ ...prev, [level]: next }));
    try {
      localStorage.setItem(meta.storageKey, JSON.stringify(next));
    } catch {
      // ignore storage quota errors
    }
  };

  const handleSwitchLevel = (nextLevel: LpicLevel) => {
    if (nextLevel === level) return;
    playCyberClick();
    loadRequestGenRef.current++;
    setLevel(nextLevel);
    setExamFilter("all");
    setQuizDomainTarget("all");
    setCompCategory("すべて");
    setCompQuery("");
    setTopicQuery("");
    setConfirmReset(false);
    setShowBackupPanel(false);
    setBackupInput("");
    setCopiedBackup(false);
    setCopiedNotes(false);
    setImportMessage(null);
    setLoadError(null);
    if (!certDataCache[nextLevel]) {
      void triggerLevelLoad(nextLevel);
    } else {
      setLoadingLevel(null);
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
    for (const d of domains) {
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
    const cleanQuery = normalizeCommandSearchQuery(cmdName);
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
      if (copiedBackupTimerRef.current) clearTimeout(copiedBackupTimerRef.current);
      copiedBackupTimerRef.current = setTimeout(() => setCopiedBackup(false), 2500);
    } catch {
      setImportMessage("クリップボードへのコピーに失敗しました。");
    }
  };

  const handleCopyNotesMarkdown = async () => {
    playCyberClick();
    const lines: string[] = [`# ${meta.label} マイメモ`, ""];
    for (const d of domains) {
      const domainLines: string[] = [];
      for (const t of d.topics) {
        const note = progress.topicNotes[t.id]?.trim();
        if (note) {
          domainLines.push(`### ${t.code} ${t.title}`, note, "");
        }
      }
      if (domainLines.length > 0) {
        lines.push(`## Topic ${d.number}: ${d.title}`, "", ...domainLines);
      }
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopiedNotes(true);
      if (copiedNotesTimerRef.current) clearTimeout(copiedNotesTimerRef.current);
      copiedNotesTimerRef.current = setTimeout(() => setCopiedNotes(false), 2500);
    } catch {
      setImportMessage("マイメモのコピーに失敗しました。");
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
      setImportMessage(`${meta.label} の学習データを復元しました。`);
      if (importMsgTimerRef.current) clearTimeout(importMsgTimerRef.current);
      importMsgTimerRef.current = setTimeout(() => setImportMessage(null), 3000);
    } catch {
      setImportMessage("JSON形式が正しくありません。コピーしたバックアップ文字列を確認してください。");
    }
  };

  const allTopics = useMemo(() => domains.flatMap((d) => d.topics), [domains]);
  const completedTopicCount = allTopics.filter((t) =>
    progress.completedTopics.includes(t.id)
  ).length;
  const topicPct = allTopics.length > 0 ? Math.round((completedTopicCount / allTopics.length) * 100) : 0;

  const answeredQuizCount = Object.keys(progress.quizAnswers).length;
  const correctQuizCount = practiceQuestions.filter((q) =>
    isQuestionCorrect(q, progress.quizAnswers[q.id])
  ).length;

  const masteredCardCount = progress.masteredCards.length;
  const notedTopicCount = Object.values(progress.topicNotes).filter((v) => v.trim().length > 0).length;

  const totalActions =
    allTopics.length + practiceQuestions.length + quickLookup.length;
  const doneActions = completedTopicCount + answeredQuizCount + masteredCardCount;
  const overallPct = totalActions > 0 ? Math.round((doneActions / totalActions) * 100) : 0;

  const quizDomains = useMemo(
    () =>
      domains.map((d) => ({
        id: d.id,
        number: d.number,
        shortLabel: `T${d.number}`,
        filterLabel: `${d.number}: ${d.title}`,
      })),
    [domains]
  );

  const filteredDomains = useMemo(() => {
    const q = topicQuery.trim().toLowerCase();
    return domains
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
  }, [
    domains,
    examFilter,
    topicQuery,
    onlyIncompleteTopics,
    onlyWithNotesTopics,
    progress.completedTopics,
    progress.topicNotes,
  ]);

  const comparisonCategories = useMemo(
    () => ["すべて", ...Array.from(new Set(comparisons.map((c) => c.category)))],
    [comparisons]
  );

  const normalizedCompQuery = compQuery.trim().toLowerCase();

  const filteredComparisons = useMemo(() => {
    return comparisons.filter((comp) => {
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
  }, [comparisons, compCategory, normalizedCompQuery]);

  const filteredQuickLookup = useMemo(() => {
    if (!normalizedCompQuery) return quickLookup;
    return quickLookup.filter((item) =>
      `${item.keyword} ${item.category} ${item.recommended} ${item.reason}`
        .toLowerCase()
        .includes(normalizedCompQuery)
    );
  }, [quickLookup, normalizedCompQuery]);

  const filteredPatterns = useMemo(() => {
    if (!normalizedCompQuery) return patterns;
    return patterns.filter((pat) =>
      [pat.title, pat.badge, pat.summary, ...pat.flow, ...pat.keyDesignPoints]
        .join(" ")
        .toLowerCase()
        .includes(normalizedCompQuery)
    );
  }, [patterns, normalizedCompQuery]);

  const filteredPitfalls = useMemo(() => {
    if (!normalizedCompQuery) return pitfalls;
    return pitfalls.filter((pit) =>
      `${pit.trap} ${pit.whyWrong} ${pit.correctApproach}`
        .toLowerCase()
        .includes(normalizedCompQuery)
    );
  }, [pitfalls, normalizedCompQuery]);

  const filteredKeyPaths = useMemo(() => {
    if (!normalizedCompQuery) return keyPaths;
    return keyPaths.filter((kp) =>
      `${kp.target} ${kp.value} ${kp.detail}`
        .toLowerCase()
        .includes(normalizedCompQuery)
    );
  }, [keyPaths, normalizedCompQuery]);

  const tabs: { id: TabId; label: string; icon: typeof BookOpen; badge?: string }[] = [
    {
      id: "domains",
      label: "トピック別学習",
      icon: BookOpen,
      badge: activeData ? `${completedTopicCount}/${allTopics.length}` : undefined,
    },
    { id: "comparisons", label: "比較・運用パターン", icon: TableProperties },
    {
      id: "flashcards",
      label: "暗記カード",
      icon: Layers2,
      badge: activeData ? `${masteredCardCount}/${quickLookup.length}` : undefined,
    },
    {
      id: "quiz",
      label: "練習問題・模試",
      icon: HelpCircle,
      badge: activeData ? `${correctQuizCount}/${practiceQuestions.length}` : undefined,
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
        document.getElementById(`lpic-tab-${nextId}`)?.focus();
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen min-w-0">
      <HeroBanner
        title="LPIC・Linux情報局"
        subtitle="LPIC-1（101/102）・LPIC-2（201/202）・LPIC-3（300/303/305/306）合格学習ハブ"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          title="🚧 一部工事中・学習ハブ先行公開"
          message="現在 LPIC-1（101-500 / 102-500）、LPIC-2（201-450 / 202-450）、および LPIC-3（300 / 303 / 305 / 306）の公式試験範囲に基づく学習ハブを掲載しています。社内の資格取得支援・受験補助ルール等は準備中（確定次第掲載）です。"
          statusType="construction"
        />

        {/* レベル切り替え（基盤 LPIC-1/2 と 専門 LPIC-3） */}
        <section
          aria-label="学習レベル・専門トラック選択"
          className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs space-y-2.5 min-w-0 max-w-full"
        >
          <div className="flex flex-col gap-2.5 min-w-0">
            <div className="flex items-center space-x-2 px-1 min-w-0">
              <Terminal size={16} className="text-cyan-600 shrink-0" />
              <span className="text-xs sm:text-sm font-black text-slate-800">
                学習レベル・専門トラック選択
              </span>
            </div>
            <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center gap-2 min-w-0">
              <div
                role="group"
                aria-label="基盤レベル (LPIC-1 / LPIC-2)"
                className="inline-flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/70 max-w-full"
              >
                <span className="text-[10px] font-bold text-slate-500 px-2 whitespace-nowrap">
                  基盤
                </span>
                {(["lpic-1", "lpic-2"] as const).map((lvl) => {
                  const item = LPIC_LEVEL_META[lvl];
                  const active = level === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleSwitchLevel(lvl)}
                      onMouseEnter={() => playCyberHover()}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer lg:whitespace-nowrap max-w-full break-words text-left ${
                        active
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div
                role="group"
                aria-label="LPIC-3 専門トラック"
                className="inline-flex flex-wrap items-center gap-1 bg-cyan-50/70 p-1 rounded-xl border border-cyan-200/70 max-w-full"
              >
                <span className="text-[10px] font-bold text-cyan-800 px-2 whitespace-nowrap">
                  LPIC-3 専門
                </span>
                {(["lpic-300", "lpic-303", "lpic-305", "lpic-306"] as const).map((lvl) => {
                  const item = LPIC_LEVEL_META[lvl];
                  const active = level === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleSwitchLevel(lvl)}
                      onMouseEnter={() => playCyberHover()}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer lg:whitespace-nowrap max-w-full break-words text-left ${
                        active
                          ? "bg-cyan-700 text-white shadow-sm"
                          : "text-slate-700 hover:text-cyan-900 hover:bg-white/80"
                      }`}
                    >
                      {item.label.replace("LPIC-3 ", "")}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 学習ステータス HUD バナー */}
        <TiltCard maxTilt={2} glareOpacity={0.05} className="rounded-3xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border border-cyan-700/50 p-5 sm:p-8 text-white shadow-xl"
          >
            <div className="absolute -top-10 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 tracking-wider">
                    <Terminal size={12} />
                    <span>{meta.badgeText}</span>
                  </span>
                  <span className="text-xs text-slate-300">
                    {activeData ? allTopics.length : "-"} トピック ・ 比較表{" "}
                    {activeData ? comparisons.length : "-"} 種 ・ カード{" "}
                    {activeData ? quickLookup.length : "-"} 枚 ・ 演習{" "}
                    {activeData ? practiceQuestions.length : "-"} 問
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white break-words">
                  <span className="inline-block">{meta.headline}</span>
                  <span className="inline-block">合格対策学習ハブ</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {meta.description}
                </p>
              </div>

              <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2.5 lg:min-w-[360px]">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">トピック習得</div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">{topicPct}%</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {completedTopicCount} / {activeData ? allTopics.length : "-"}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">暗記カード</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    {masteredCardCount} / {activeData ? quickLookup.length : "-"}
                  </div>
                  <div className="text-[11px] text-slate-400">枚習得</div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">演習問題</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                    {correctQuizCount} / {activeData ? practiceQuestions.length : "-"}
                  </div>
                  <div className="text-[11px] text-slate-400">問正解</div>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* 動的ロード中・エラー表示 */}
        {(!activeData || loadingLevel !== null) && (
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
                  onClick={() => void triggerLevelLoad(level)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  再読み込みする
                </button>
              </>
            ) : (
              <>
                <Loader2 className="w-7 h-7 text-cyan-600 mx-auto animate-spin" />
                <p className="text-xs font-bold text-slate-600">
                  {meta.label} の学習データを読み込み中...
                </p>
              </>
            )}
          </div>
        )}

        {activeData && loadingLevel === null && (
          <>
            {/* 試験概要カード */}
            <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {examFacts.map((fact) => (
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
                      <Award className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      <span>
                        {meta.label} 総合学習進捗（トピック・暗記カード・練習問題）
                      </span>
                    </span>
                <span className="font-mono text-cyan-700 shrink-0">{overallPct}%</span>
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
                onClick={handleCopyNotesMarkdown}
                disabled={notedTopicCount === 0}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-50"
              >
                {copiedNotes ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span className="text-emerald-700">メモをコピーしました</span>
                  </>
                ) : (
                  <>
                    <StickyNote size={13} />
                    <span>メモをMarkdownコピー</span>
                  </>
                )}
              </button>

              <button
                type="button"
                aria-expanded={showBackupPanel}
                aria-controls="lpic-backup-panel"
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
            <p role="status" aria-live="polite" className="text-xs font-bold text-cyan-700">
              {importMessage}
            </p>
          )}

          {showBackupPanel && (
            <div id="lpic-backup-panel" className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                <p className="text-xs text-slate-600">
                  {meta.label} の進捗やメモはブラウザの localStorage に保存されます。別端末へ移行する場合は JSON 文字列をコピーしてください。
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
                  placeholder="復元したいバックアップJSONを貼り付け..."
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleImportBackup}
                  disabled={!backupInput.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 disabled:opacity-40 cursor-pointer shrink-0"
                >
                  復元する
                </button>
              </div>
              {importMessage && (
                <p role="status" aria-live="polite" className="text-xs font-bold text-cyan-700">
                  {importMessage}
                </p>
              )}
            </div>
          )}
        </section>

        {/* タブナビゲーション */}
        <div
          role="tablist"
          aria-label="LPIC 学習セクション"
          className="flex flex-wrap gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`lpic-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`lpic-panel-${tab.id}`}
                tabIndex={active ? 0 : -1}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
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
        </div>

        {/* TAB 1: トピック別学習 */}
        {activeTab === "domains" && (
          <div
            role="tabpanel"
            id="lpic-panel-domains"
            aria-labelledby="lpic-tab-domains"
            className="space-y-6"
          >
            {/* フィルター＆検索バー */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
              <div className="flex flex-col gap-3">
                {meta.examFilters.length > 1 ? (
                  <div
                    role="group"
                    aria-label="対象試験フィルター"
                    className="flex flex-wrap items-center gap-1.5"
                  >
                    {meta.examFilters.map((ef) => (
                      <button
                        key={ef.id}
                        type="button"
                        aria-pressed={examFilter === ef.id}
                        onClick={() => {
                          playCyberClick();
                          setExamFilter(ef.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          examFilter === ef.id
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {ef.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs font-bold text-slate-500 px-1">
                    {meta.examFilters[0]?.label}
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="relative w-full lg:w-64 shrink-0">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      aria-label="トピック・コマンド検索"
                      value={topicQuery}
                      onChange={(e) => setTopicQuery(e.target.value)}
                      placeholder="コマンド・設定ファイルで検索..."
                      className="w-full pl-8 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
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

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      aria-pressed={onlyIncompleteTopics}
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
            </div>

            {/* トピック一覧 */}
            {filteredDomains.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-2">
                <Search className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="text-sm font-black text-slate-700">
                  条件に一致するトピックがありません
                </div>
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
                      <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          aria-controls={`lpic-domain-panel-${domain.id}`}
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
                                {domain.exam} ・ Topic {domain.number}
                              </span>
                              <span className="text-xs font-mono text-slate-500">
                                完了 {domainDone}/{domain.topics.length} ({domainPct}%)
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 break-words">
                              {domain.title}
                              <span className="ml-2 text-xs font-normal text-slate-400">
                                {domain.englishTitle}
                              </span>
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
                            aria-controls={`lpic-domain-panel-${domain.id}`}
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
                          id={`lpic-domain-panel-${domain.id}`}
                          className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4"
                        >
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
                                      <Circle className="w-5 h-5 text-slate-300 group-hover:text-cyan-500 shrink-0 mt-0.5" />
                                    )}
                                    <div className="min-w-0">
                                      <span className="text-[11px] font-mono font-bold text-slate-400">
                                        Objective {topic.code}
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
                                    aria-controls={`lpic-note-panel-${topic.id}`}
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
                                      title="比較表・逆引きで検索する"
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
                                  <div id={`lpic-note-panel-${topic.id}`} className="pt-2">
                                    <label
                                      htmlFor={`lpic-note-input-${topic.id}`}
                                      className="sr-only"
                                    >
                                      {topic.title} の学習メモ
                                    </label>
                                    <textarea
                                      id={`lpic-note-input-${topic.id}`}
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
          <div
            role="tabpanel"
            id="lpic-panel-comparisons"
            aria-labelledby="lpic-tab-comparisons"
            className="space-y-8"
          >
            {/* 比較表フィルター */}
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

                <div className="relative w-full lg:w-64 shrink-0">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    aria-label="比較表・逆引き・コマンド検索"
                    value={compQuery}
                    onChange={(e) => setCompQuery(e.target.value)}
                    placeholder="比較表・逆引き・コマンド検索..."
                    className="w-full pl-8 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
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

              {/* 頻出コマンド・キーワード クイック検索チップ */}
              <div
                role="group"
                aria-label="クイック検索チップ"
                className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-100"
              >
                <span className="text-[11px] font-bold text-slate-400 mr-1">
                  よく調べるコマンド・キーワード:
                </span>
                {meta.quickSearchChips.map((kw) => {
                  const isSelected = compQuery.trim().toLowerCase() === kw.toLowerCase();
                  return (
                    <button
                      key={kw}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        playCyberClick();
                        setCompCategory("すべて");
                        setCompQuery(isSelected ? "" : kw);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-cyan-300 border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:border-cyan-300 hover:text-cyan-700"
                      }`}
                    >
                      {kw}
                    </button>
                  );
                })}
              </div>

              {/* 検索ヒット件数サマリ */}
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
                            ? "text-cyan-700 font-bold"
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
                          filteredPatterns.length > 0
                            ? "text-indigo-700 font-bold"
                            : "text-slate-400"
                        }
                      >
                        運用フロー {filteredPatterns.length} 件
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
                          filteredKeyPaths.length > 0
                            ? "text-emerald-700 font-bold"
                            : "text-slate-400"
                        }
                      >
                        主要パス {filteredKeyPaths.length} 件
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* すべて0件時のエンプティステート */}
            {filteredComparisons.length === 0 &&
              filteredQuickLookup.length === 0 &&
              filteredPatterns.length === 0 &&
              filteredPitfalls.length === 0 &&
              filteredKeyPaths.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3">
                  <Search className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="text-sm font-black text-slate-900 break-words">
                    「{compQuery}」に一致する項目が見つかりませんでした
                  </div>
                  <p className="text-xs text-slate-500">
                    別のキーワード（例：{meta.quickSearchChips.slice(0, 4).join("、")}
                    ）で検索するか、条件をリセットしてください。
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setCompCategory("すべて");
                      setCompQuery("");
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 cursor-pointer"
                  >
                    検索・カテゴリをリセット
                  </button>
                </div>
              )}

            {/* 比較表 */}
            {filteredComparisons.length > 0 && (
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
                      <table className="w-full min-w-[640px] text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            {comp.columns.map((col) => (
                              <th key={col} className="py-2.5 px-3 font-black text-slate-700 whitespace-nowrap">
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
            )}

            {/* 要件・用途 → コマンド逆引き早見表 */}
            {filteredQuickLookup.length > 0 && (
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>要件・用途 → コマンド逆引き早見表</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-500">
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
                          「{item.keyword}」
                        </span>
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 max-w-full truncate">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-black text-cyan-800 bg-cyan-50/70 border border-cyan-100 px-3 py-1.5 rounded-lg break-words">
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

            {/* 頻出運用フローパターン */}
            {filteredPatterns.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-cyan-600" />
                  <span>頻出コマンド・運用フローパターン</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPatterns.map((pat) => (
                    <SpotlightCard
                      key={pat.id}
                      className="p-5 space-y-3 bg-white border border-slate-200/80 rounded-2xl"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
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
            )}

            {/* 試験のひっかけ対策 */}
            {filteredPitfalls.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>よくあるひっかけ・誤答パターン</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPitfalls.map((pit) => (
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
            )}

            {/* 重要設定ファイル・数値早見 */}
            {filteredKeyPaths.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Gauge className="w-5 h-5 text-indigo-600" />
                  <span>重要設定ファイル・数値早見表</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {filteredKeyPaths.map((kp) => (
                    <div
                      key={kp.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-1 shadow-xs min-w-0"
                    >
                      <div className="font-mono text-xs font-black text-indigo-700 break-words">{kp.target}</div>
                      <div className="text-sm font-black text-slate-900 break-words">{kp.value}</div>
                      <p className="text-[11px] text-slate-500 leading-snug">{kp.detail}</p>
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
            id="lpic-panel-flashcards"
            aria-labelledby="lpic-tab-flashcards"
          >
            <CertificationFlashcards
              key={level}
              items={quickLookup}
              masteredKeywords={progress.masteredCards}
              onToggleMastered={handleToggleMasteredCard}
              onResetMastered={handleResetMasteredCards}
              badgeText={`${meta.id.toUpperCase()} 直前暗記フラッシュカード`}
              title={meta.flashcardTitle}
              promptLabel="次の要件に対応するコマンド・設定は？"
              answerLabel="推奨コマンド・設定値"
            />
          </div>
        )}

        {/* TAB 4: 練習問題・模擬試験 */}
        {activeTab === "quiz" && (
          <div
            role="tabpanel"
            id="lpic-panel-quiz"
            aria-labelledby="lpic-tab-quiz"
          >
            <CertificationPracticeQuiz
              key={level}
              questions={practiceQuestions}
              domains={quizDomains}
              examBadgeLabel={meta.quizBadgeLabel}
              passingConfig={meta.passingConfig}
              answers={progress.quizAnswers}
              bookmarkedIds={progress.bookmarkedQuestions}
              mockExamHistory={progress.mockExamHistory}
              initialDomain={quizDomainTarget}
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
            id="lpic-panel-resources"
            aria-labelledby="lpic-tab-resources"
            className="space-y-8"
          >
            {/* 試験本番・直前チェックリスト */}
            <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 break-words">
                  {meta.label} 試験本番・直前チェックリスト（時間配分＆受験のコツ）
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {meta.examDayChecklist.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                {meta.examDayChecklist.tips.map((tip) => (
                  <div
                    key={tip.title}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-1.5 min-w-0"
                  >
                    <div className="font-black text-slate-900 text-xs sm:text-sm break-words">
                      {tip.title}
                    </div>
                    <p className="leading-relaxed text-slate-600">{tip.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 公式学習リソース */}
            <section className="space-y-3">
              <h3 className="text-lg font-black text-slate-900">
                LPI 公式学習リソース（{meta.label}）
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {officialResources.map((res) => (
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
                      <h4 className="text-base font-black text-slate-900">{res.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                      <div className="text-[11px] font-mono text-cyan-700 truncate">{res.url}</div>
                    </a>
                  </TiltCard>
                ))}
              </div>
            </section>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
