"use client";

import { useEffect, useState, useMemo, useRef, type KeyboardEvent } from "react";
import {
  Cloud,
  ShieldCheck,
  Layers,
  Cpu,
  Database,
  Network,
  Sparkles,
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
  Layers2,
  ArrowRight,
  X,
  StickyNote,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Gauge,
  Terminal,
  Wrench,
  Brain,
  Activity,
  Lock,
  GitBranch,
  Zap,
  Loader2,
} from "lucide-react";
import HeroBanner from "@/components/HeroBanner";
import TiltCard from "@/components/TiltCard";
import SpotlightCard from "@/components/SpotlightCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import CertificationFlashcards from "@/components/certification/CertificationFlashcards";
import CertificationPracticeQuiz, {
  isQuestionCorrect,
} from "@/components/certification/CertificationPracticeQuiz";
import type { CertMockExamRecord } from "@/components/certification/types";
import type { GcpDomain } from "@/data/gcp-types";
import {
  GCP_CERT_META,
  GCP_CERT_IDS,
  CERT_LEVEL_GROUPS,
  INITIAL_GCP_CERT_DATA,
  loadGcpCertData,
  type GcpCertId,
  type GcpCertData,
} from "@/components/gcp/gcpCertRegistry";
import { normalizeGcpSearchQuery } from "@/lib/gcp-search";
import {
  playCyberClick,
  playCyberHover,
  playCyberOpen,
  playCyberSuccess,
} from "@/lib/sound";

type TabId = "domains" | "comparisons" | "flashcards" | "quiz" | "resources";

interface GcpProgress {
  completedTopics: string[];
  quizAnswers: Record<string, number[]>;
  bookmarkedQuestions: string[];
  masteredCards: string[];
  topicNotes: Record<string, string>;
  mockExamHistory: CertMockExamRecord[];
}

const DEFAULT_PROGRESS: GcpProgress = {
  completedTopics: [],
  quizAnswers: {},
  bookmarkedQuestions: [],
  masteredCards: [],
  topicNotes: {},
  mockExamHistory: [],
};

const DOMAIN_ICONS: Record<string, typeof Cloud> = {
  "cdl-domain-1": Cloud,
  "cdl-domain-2": Database,
  "cdl-domain-3": Sparkles,
  "cdl-domain-4": Layers,
  "cdl-domain-5": ShieldCheck,
  "cdl-domain-6": Gauge,
  "gail-domain-1": Sparkles,
  "gail-domain-2": Cloud,
  "gail-domain-3": Brain,
  "gail-domain-4": Layers,
  "ace-domain-1": Wrench,
  "ace-domain-2": Cpu,
  "ace-domain-3": Terminal,
  "ace-domain-4": Gauge,
  "ace-domain-5": ShieldCheck,
  "adp-domain-1": Database,
  "adp-domain-2": Activity,
  "adp-domain-3": GitBranch,
  "adp-domain-4": ShieldCheck,
  "pca-domain-1": Layers,
  "pca-domain-2": Network,
  "pca-domain-3": ShieldCheck,
  "pca-domain-4": Cpu,
  "pca-domain-5": Database,
  "pca-domain-6": Gauge,
  "pde-domain-1": Layers,
  "pde-domain-2": Database,
  "pde-domain-3": Cpu,
  "pde-domain-4": Wrench,
  "pde-domain-5": ShieldCheck,
  "pmle-domain-1": Brain,
  "pmle-domain-2": Database,
  "pmle-domain-3": Cpu,
  "pmle-domain-4": Sparkles,
  "pmle-domain-5": GitBranch,
  "pmle-domain-6": Activity,
  "pcse-domain-1": Lock,
  "pcse-domain-2": Network,
  "pcse-domain-3": ShieldCheck,
  "pcse-domain-4": Activity,
  "pcse-domain-5": Wrench,
  "pcde-domain-1": Layers,
  "pcde-domain-2": GitBranch,
  "pcde-domain-3": Activity,
  "pcde-domain-4": Gauge,
  "pcde-domain-5": Cpu,
  "pcd-domain-1": Layers,
  "pcd-domain-2": Terminal,
  "pcd-domain-3": GitBranch,
  "pcd-domain-4": Cpu,
  "pcd-domain-5": Activity,
  "pcne-domain-1": Network,
  "pcne-domain-2": Layers,
  "pcne-domain-3": Cloud,
  "pcne-domain-4": Wrench,
  "pcne-domain-5": Gauge,
};

const ACCENT_STYLES: Record<
  GcpDomain["accentColor"],
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
  "コンピュート",
  "ストレージ・DB",
  "AI・データ分析",
  "ネットワーク・セキュリティ",
  "運用・移行・コスト",
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

function normalizeMockExamHistory(raw: unknown): CertMockExamRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is CertMockExamRecord =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as CertMockExamRecord).date === "string" &&
      typeof (item as CertMockExamRecord).correct === "number" &&
      typeof (item as CertMockExamRecord).total === "number" &&
      typeof (item as CertMockExamRecord).scaledScore === "number"
  );
}

function loadGcpProgress(storageKey: string): GcpProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(storageKey);
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

export default function GcpInfoPage() {
  const [certId, setCertId] = useState<GcpCertId>("cdl");
  const meta = GCP_CERT_META[certId];

  const [certDataCache, setCertDataCache] = useState<Partial<Record<GcpCertId, GcpCertData>>>({
    cdl: INITIAL_GCP_CERT_DATA,
  });
  const [loadingCertId, setLoadingCertId] = useState<GcpCertId | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadRequestGenRef = useRef(0);

  const [activeTab, setActiveTab] = useState<TabId>("domains");
  const [progressByCert, setProgressByCert] = useState<Record<GcpCertId, GcpProgress>>({
    cdl: DEFAULT_PROGRESS,
    gail: DEFAULT_PROGRESS,
    ace: DEFAULT_PROGRESS,
    adp: DEFAULT_PROGRESS,
    pca: DEFAULT_PROGRESS,
    pde: DEFAULT_PROGRESS,
    pmle: DEFAULT_PROGRESS,
    pcse: DEFAULT_PROGRESS,
    pcde: DEFAULT_PROGRESS,
    pcd: DEFAULT_PROGRESS,
    pcne: DEFAULT_PROGRESS,
  });
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>(
    GCP_CERT_META.cdl.defaultExpanded
  );
  const [confirmReset, setConfirmReset] = useState(false);
  const [copiedNotes, setCopiedNotes] = useState(false);

  // トピック検索・フィルター
  const [topicQuery, setTopicQuery] = useState("");
  const [onlyIncompleteTopics, setOnlyIncompleteTopics] = useState(false);
  const [onlyWithNotesTopics, setOnlyWithNotesTopics] = useState(false);
  const [openNoteTopics, setOpenNoteTopics] = useState<Record<string, boolean>>({});

  // 比較表フィルター
  const [compCategory, setCompCategory] = useState<string>("すべて");
  const [compQuery, setCompQuery] = useState("");

  // 演習タブジャンプ先
  const [quizDomainTarget, setQuizDomainTarget] = useState<string>("all");

  // バックアップ / 復元パネル
  const [showBackupPanel, setShowBackupPanel] = useState(false);
  const [backupInput, setBackupInput] = useState("");
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [importMessage, setImportMessage] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  // タイマークリーンアップ用 ref
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedNotesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedBackupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const importMsgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timers = [
      resetTimerRef,
      copiedNotesTimerRef,
      copiedBackupTimerRef,
      importMsgTimerRef,
      focusScrollTimerRef,
    ];
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
      const loaded = {} as Record<GcpCertId, GcpProgress>;
      for (const id of GCP_CERT_IDS) {
        loaded[id] = loadGcpProgress(GCP_CERT_META[id].storageKey);
      }
      setProgressByCert(loaded);
    });
  }, []);

  const activeData = certDataCache[certId];
  const progress = progressByCert[certId];

  const triggerCertLoad = async (targetCert: GcpCertId) => {
    const reqGen = ++loadRequestGenRef.current;
    setLoadingCertId(targetCert);
    setLoadError(null);
    try {
      const data = await loadGcpCertData(targetCert);
      setCertDataCache((prev) => ({ ...prev, [targetCert]: data }));
      if (loadRequestGenRef.current === reqGen) {
        setLoadingCertId(null);
      }
    } catch {
      if (loadRequestGenRef.current === reqGen) {
        setLoadingCertId(null);
        setLoadError(`${GCP_CERT_META[targetCert].label} の学習データ読み込みに失敗しました。`);
      }
    }
  };

  const saveProgress = (next: GcpProgress) => {
    setProgressByCert((prev) => ({ ...prev, [certId]: next }));
    try {
      window.localStorage.setItem(meta.storageKey, JSON.stringify(next));
    } catch {
      // localStorage quota exceeded / disabled
    }
  };

  const handleSwitchCert = (nextCert: GcpCertId) => {
    if (nextCert === certId) return;
    playCyberClick();
    loadRequestGenRef.current++;
    setCertId(nextCert);
    setExpandedDomains(GCP_CERT_META[nextCert].defaultExpanded);
    setTopicQuery("");
    setCompCategory("すべて");
    setCompQuery("");
    setQuizDomainTarget("all");
    setConfirmReset(false);
    setImportMessage(null);
    setLoadError(null);
    if (!certDataCache[nextCert]) {
      void triggerCertLoad(nextCert);
    } else {
      setLoadingCertId(null);
    }
  };

  const toggleTopic = (topicId: string) => {
    const exists = progress.completedTopics.includes(topicId);
    if (exists) {
      playCyberClick();
    } else {
      playCyberSuccess();
    }
    const completedTopics = exists
      ? progress.completedTopics.filter((id) => id !== topicId)
      : [...progress.completedTopics, topicId];
    saveProgress({ ...progress, completedTopics });
  };

  const handleUpdateTopicNote = (topicId: string, text: string) => {
    const nextNotes = { ...progress.topicNotes };
    if (text.trim() === "") {
      delete nextNotes[topicId];
    } else {
      nextNotes[topicId] = text;
    }
    saveProgress({ ...progress, topicNotes: nextNotes });
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

  const handleRecordMockExam = (record: CertMockExamRecord) => {
    const nextHistory = [record, ...progress.mockExamHistory].slice(0, 10);
    saveProgress({ ...progress, mockExamHistory: nextHistory });
  };

  const handleResetQuiz = () => {
    saveProgress({ ...progress, quizAnswers: {} });
  };

  const handleToggleMasteredCard = (keyword: string) => {
    const exists = progress.masteredCards.includes(keyword);
    const masteredCards = exists
      ? progress.masteredCards.filter((k) => k !== keyword)
      : [...progress.masteredCards, keyword];
    saveProgress({ ...progress, masteredCards });
  };

  const handleResetMasteredCards = () => {
    saveProgress({ ...progress, masteredCards: [] });
  };

  const handleResetAllClick = () => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    if (!confirmReset) {
      playCyberClick();
      setConfirmReset(true);
      resetTimerRef.current = setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    playCyberClick();
    saveProgress(DEFAULT_PROGRESS);
    setConfirmReset(false);
  };

  const handleExpandAllDomains = (open: boolean) => {
    if (!activeData) return;
    if (open) {
      playCyberOpen();
    } else {
      playCyberClick();
    }
    const next: Record<string, boolean> = {};
    for (const d of activeData.domains) {
      next[d.id] = open;
    }
    setExpandedDomains(next);
  };

  const handleJumpToDomainQuiz = (domainId: string) => {
    playCyberClick();
    setQuizDomainTarget(domainId);
    setActiveTab("quiz");
  };

  const handleJumpToServiceComparison = (keyword: string) => {
    playCyberClick();
    const cleanQuery = normalizeGcpSearchQuery(keyword);
    setCompCategory("すべて");
    setCompQuery(cleanQuery);
    setActiveTab("comparisons");
  };

  const handleFocusDomain = (domainId: string) => {
    playCyberOpen();
    setExpandedDomains((prev) => ({ ...prev, [domainId]: true }));
    if (focusScrollTimerRef.current) {
      clearTimeout(focusScrollTimerRef.current);
    }
    focusScrollTimerRef.current = setTimeout(() => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document
        .getElementById(domainId)
        ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, 40);
  };

  const handleCopyNotesMarkdown = async () => {
    if (!activeData) return;
    const lines: string[] = [`# ${meta.label} マイメモ`, ""];
    for (const domain of activeData.domains) {
      const domainLines: string[] = [];
      for (const topic of domain.topics) {
        const note = (progress.topicNotes[topic.id] ?? "").trim();
        if (note) {
          domainLines.push(`### ${topic.code}: ${topic.title}`, "", note, "");
        }
      }
      if (domainLines.length > 0) {
        lines.push(`## Domain ${domain.number}: ${domain.title}`, "", ...domainLines);
      }
    }
    if (lines.length <= 2) return;
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      playCyberSuccess();
      setCopiedNotes(true);
      if (copiedNotesTimerRef.current) clearTimeout(copiedNotesTimerRef.current);
      copiedNotesTimerRef.current = setTimeout(() => setCopiedNotes(false), 2500);
    } catch {
      playCyberClick();
    }
  };

  const handleCopyBackup = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify({ version: 1, certId, ...progress })
      );
      playCyberSuccess();
      setCopiedBackup(true);
      if (copiedBackupTimerRef.current) clearTimeout(copiedBackupTimerRef.current);
      copiedBackupTimerRef.current = setTimeout(() => setCopiedBackup(false), 2500);
    } catch {
      playCyberClick();
      setImportMessage({ text: "クリップボードへのコピーに失敗しました。", isError: true });
    }
  };

  const handleImportBackup = () => {
    try {
      const parsedUnknown: unknown = JSON.parse(backupInput.trim());
      if (!parsedUnknown || typeof parsedUnknown !== "object" || Array.isArray(parsedUnknown)) {
        playCyberClick();
        setImportMessage({
          text: "有効なバックアップオブジェクト形式ではありません。",
          isError: true,
        });
        return;
      }
      const parsed = parsedUnknown as Record<string, unknown>;
      if (parsed.certId !== undefined && parsed.certId !== certId) {
        playCyberClick();
        setImportMessage({
          text: `別の資格（${String(parsed.certId).toUpperCase()}）のバックアップです。${meta.shortLabel} を選択してやり直すか、該当資格へ切り替えて復元してください。`,
          isError: true,
        });
        return;
      }
      const hasProgressKey =
        "completedTopics" in parsed ||
        "quizAnswers" in parsed ||
        "bookmarkedQuestions" in parsed ||
        "masteredCards" in parsed ||
        "topicNotes" in parsed ||
        "mockExamHistory" in parsed;
      if (!hasProgressKey) {
        playCyberClick();
        setImportMessage({
          text: "学習進捗データ（completedTopics / quizAnswers 等）が含まれていません。",
          isError: true,
        });
        return;
      }

      const restored: GcpProgress = {
        completedTopics: normalizeStringArray(parsed.completedTopics),
        quizAnswers: normalizeQuizAnswers(parsed.quizAnswers),
        bookmarkedQuestions: normalizeStringArray(parsed.bookmarkedQuestions),
        masteredCards: normalizeStringArray(parsed.masteredCards),
        topicNotes: normalizeStringRecord(parsed.topicNotes),
        mockExamHistory: normalizeMockExamHistory(parsed.mockExamHistory),
      };
      saveProgress(restored);
      setBackupInput("");
      playCyberSuccess();
      setImportMessage({
        text: `${meta.shortLabel} の学習データを復元しました。`,
        isError: false,
      });
      if (importMsgTimerRef.current) clearTimeout(importMsgTimerRef.current);
      importMsgTimerRef.current = setTimeout(() => setImportMessage(null), 3500);
    } catch {
      playCyberClick();
      setImportMessage({
        text: "JSON形式が正しくありません。コピーしたバックアップ文字列を確認してください。",
        isError: true,
      });
    }
  };

  const domains = useMemo(() => activeData?.domains ?? [], [activeData]);
  const comparisons = useMemo(() => activeData?.comparisons ?? [], [activeData]);
  const patterns = useMemo(() => activeData?.patterns ?? [], [activeData]);
  const pitfalls = useMemo(() => activeData?.pitfalls ?? [], [activeData]);
  const keyFacts = useMemo(() => activeData?.keyFacts ?? [], [activeData]);
  const quickLookup = useMemo(() => activeData?.quickLookup ?? [], [activeData]);
  const practiceQuestions = useMemo(
    () => activeData?.practiceQuestions ?? [],
    [activeData]
  );
  const examFacts = useMemo(() => activeData?.examFacts ?? [], [activeData]);
  const officialResources = useMemo(
    () => activeData?.officialResources ?? [],
    [activeData]
  );

  const allTopics = useMemo(() => domains.flatMap((d) => d.topics), [domains]);
  const validTopicIds = useMemo(() => new Set(allTopics.map((t) => t.id)), [allTopics]);
  const validQuestionIds = useMemo(
    () => new Set(practiceQuestions.map((q) => q.id)),
    [practiceQuestions]
  );
  const validCardKeywords = useMemo(
    () => new Set(quickLookup.map((c) => c.keyword)),
    [quickLookup]
  );

  const completedTopicCount = progress.completedTopics.filter((id) =>
    validTopicIds.has(id)
  ).length;
  const topicPct =
    allTopics.length > 0 ? Math.round((completedTopicCount / allTopics.length) * 100) : 0;

  const answeredQuizCount = Object.keys(progress.quizAnswers).filter((id) =>
    validQuestionIds.has(id)
  ).length;
  const correctQuizCount = practiceQuestions.filter((q) =>
    isQuestionCorrect(q, progress.quizAnswers[q.id])
  ).length;

  const masteredCardCount = progress.masteredCards.filter((k) =>
    validCardKeywords.has(k)
  ).length;
  const notedTopicCount = Object.entries(progress.topicNotes).filter(
    ([id, v]) => validTopicIds.has(id) && v.trim().length > 0
  ).length;

  const totalActions =
    allTopics.length + practiceQuestions.length + quickLookup.length;
  const doneActions = completedTopicCount + answeredQuizCount + masteredCardCount;
  const overallPct =
    totalActions > 0 ? Math.min(100, Math.round((doneActions / totalActions) * 100)) : 0;

  const quizDomains = useMemo(
    () =>
      domains.map((d) => ({
        id: d.id,
        number: d.number,
        shortLabel: `D${d.number}`,
        filterLabel: `${d.number}: ${d.title}`,
      })),
    [domains]
  );

  const filteredDomains = useMemo(() => {
    const q = topicQuery.trim().toLowerCase();
    return domains
      .map((d) => {
        const topics = d.topics.filter((t) => {
          if (onlyIncompleteTopics && progress.completedTopics.includes(t.id)) {
            return false;
          }
          if (onlyWithNotesTopics && !(progress.topicNotes[t.id] ?? "").trim()) {
            return false;
          }
          if (!q) return true;
          const haystack = [t.code, t.title, ...t.services, ...t.keyPoints, t.examTip]
            .join(" ")
            .toLowerCase();
          return haystack.includes(q);
        });
        return { ...d, visibleTopics: topics };
      })
      .filter((d) => d.visibleTopics.length > 0);
  }, [
    domains,
    topicQuery,
    onlyIncompleteTopics,
    onlyWithNotesTopics,
    progress.completedTopics,
    progress.topicNotes,
  ]);

  const availableComparisonCategories = useMemo(
    () =>
      COMPARISON_CATEGORIES.filter(
        (cat) => cat === "すべて" || comparisons.some((c) => c.category === cat)
      ),
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
      [pit.trap, pit.whyWrong, pit.correctApproach]
        .join(" ")
        .toLowerCase()
        .includes(normalizedCompQuery)
    );
  }, [pitfalls, normalizedCompQuery]);

  const filteredKeyFacts = useMemo(() => {
    if (!normalizedCompQuery) return keyFacts;
    return keyFacts.filter((kf) =>
      [kf.target, kf.value, kf.detail].join(" ").toLowerCase().includes(normalizedCompQuery)
    );
  }, [keyFacts, normalizedCompQuery]);

  const tabs: { id: TabId; label: string; icon: typeof BookOpen; badge?: string }[] = [
    {
      id: "domains",
      label: "トピック別学習",
      icon: BookOpen,
      badge: activeData ? `${completedTopicCount}/${allTopics.length}` : undefined,
    },
    { id: "comparisons", label: "比較・逆引き・設計", icon: TableProperties },
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
        document.getElementById(`gcp-tab-${nextId}`)?.focus();
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen min-w-0">
      <HeroBanner
        title="GCP・Google Cloud情報局"
        subtitle="Foundational (CDL / GAIL) ・ Associate (ACE / ADP) ・ Professional (PCA / PDE / PMLE / PCSE / PCDE / PCD / PCNE) 全11資格統合学習ハブ"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-w-0">
        <UnderConstructionAlert
          title="🚧 一部工事中・学習ハブ先行公開"
          message="現在 Google Cloud 認定資格（CDL / GAIL / ACE / ADP / PCA / PDE / PMLE / PCSE / PCDE / PCD / PCNE 全11資格）の公式ページ・公式試験ガイドに基づく学習ハブを掲載しています。社内の GCP 利用ルールや資格取得支援制度等は準備中（確定次第掲載）です。"
          prepDetails="社内の GCP 利用ルール・資格取得支援制度の確定（確定次第、本画面および開発ロードマップを更新）"
          releaseDate="未定"
          statusType="construction"
        />

        {/* 資格レベル切り替え（全11資格・レベル別グループ） */}
        <section
          aria-label="学習資格選択（全11資格）"
          className="flex flex-col gap-3 bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs min-w-0 max-w-full"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center space-x-2">
              <Cloud size={16} className="text-cyan-600 shrink-0" />
              <span className="text-xs sm:text-sm font-black text-slate-800">
                学習資格選択（全11資格）
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              現在: {meta.levelGroup} / {meta.shortLabel}
            </span>
          </div>
          <div className="space-y-2">
            {CERT_LEVEL_GROUPS.map((group) => (
              <div
                key={group.level}
                role="group"
                aria-label={`${group.level}（${group.badge}）`}
                className="flex flex-col lg:flex-row lg:items-center gap-2 bg-slate-100/90 p-2 rounded-xl border border-slate-200/70 min-w-0"
              >
                <div className="flex items-center space-x-1.5 lg:w-44 shrink-0 px-1.5">
                  <span className="text-[11px] font-black text-slate-800">{group.level}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    {group.badge}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                  {group.ids.map((id) => {
                    const item = GCP_CERT_META[id];
                    const active = certId === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => handleSwitchCert(id)}
                        onMouseEnter={() => playCyberHover()}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer lg:whitespace-nowrap max-w-full break-words text-left ${
                          active
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
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
                    <Cloud size={12} />
                    <span>{meta.badgeText}</span>
                  </span>
                  {activeData ? (
                    <span className="text-xs text-slate-300">
                      {allTopics.length} トピック ・ 比較表 {comparisons.length} 種 ・ カード{" "}
                      {quickLookup.length} 枚 ・ 演習 {practiceQuestions.length} 問
                    </span>
                  ) : (
                    <span className="text-xs text-cyan-200 inline-flex items-center space-x-1">
                      <Loader2 size={12} className="animate-spin" />
                      <span>教材データを読み込み中...</span>
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white break-words">
                  <span className="inline-block">{meta.headline}</span>
                  <span className="inline-block ml-1">合格対策学習ハブ</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {meta.description}
                </p>
              </div>

              <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2.5 lg:min-w-[360px]">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">トピック習得</div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
                    <AnimatedCounter value={topicPct} duration={600} suffix="%" />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    <AnimatedCounter value={completedTopicCount} duration={500} /> / {allTopics.length || "-"}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">暗記カード</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    <AnimatedCounter value={masteredCardCount} duration={500} /> / {quickLookup.length || "-"}
                  </div>
                  <div className="text-[11px] text-slate-400">枚習得</div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">演習問題</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                    <AnimatedCounter value={correctQuizCount} duration={500} /> / {practiceQuestions.length || "-"}
                  </div>
                  <div className="text-[11px] text-slate-400">問正解</div>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* 動的ロード中・エラー表示 */}
        {!activeData && (
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
                  onClick={() => void triggerCertLoad(certId)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  再読み込みする
                </button>
              </>
            ) : (
              <>
                <Loader2 className="w-7 h-7 text-cyan-600 mx-auto animate-spin" />
                <p className="text-xs font-bold text-slate-600">
                  {meta.label} のドメイン・比較表・演習問題データを読み込み中...
                </p>
              </>
            )}
          </div>
        )}

        {activeData && loadingCertId === null && (
          <>
            {/* 試験概要カード */}
            <section
              aria-label={`${meta.shortLabel} 試験概要`}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3"
            >
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
                        {meta.shortLabel} 総合学習進捗（トピック・暗記カード・練習問題）
                      </span>
                    </span>
                    <span className="font-mono text-cyan-700 shrink-0">
                      <AnimatedCounter value={overallPct} duration={600} suffix="%" />
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={overallPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${meta.shortLabel} 総合学習進捗`}
                    className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden"
                  >
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
                        <span className="text-emerald-700">Markdownコピー済</span>
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
                    aria-controls="gcp-backup-panel"
                    onClick={() => {
                      setShowBackupPanel((v) => {
                        const next = !v;
                        if (next) playCyberOpen();
                        else playCyberClick();
                        return next;
                      });
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
                <div
                  role="status"
                  aria-live="polite"
                  className={`text-xs font-bold ${
                    importMessage.isError ? "text-rose-700" : "text-cyan-700"
                  }`}
                >
                  {importMessage.text}
                </div>
              )}

              {showBackupPanel && (
                <div id="gcp-backup-panel" className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                    <p className="text-xs text-slate-600">
                      {meta.shortLabel} の進捗やメモはブラウザの localStorage に保存されます。別端末へ移行する場合は JSON 文字列をコピーしてください。
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyBackup}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer shrink-0 self-start lg:self-auto"
                    >
                      {copiedBackup ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedBackup ? "コピーしました" : "現在のデータをコピー"}</span>
                    </button>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-2">
                    <input
                      type="text"
                      aria-label="バックアップJSON文字列入力"
                      value={backupInput}
                      onChange={(e) => setBackupInput(e.target.value)}
                      placeholder="復元するバックアップJSON文字列を貼り付け..."
                      className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleImportBackup}
                      disabled={!backupInput.trim()}
                      className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 disabled:opacity-40 cursor-pointer shrink-0"
                    >
                      復元を実行
                    </button>
                  </div>
                  {importMessage && (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`text-xs font-bold ${
                        importMessage.isError ? "text-rose-700" : "text-cyan-700"
                      }`}
                    >
                      {importMessage.text}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* タブナビゲーション (WAI-ARIA APG Tabs) */}
            <div
              role="tablist"
              aria-label="GCP 学習セクション"
              className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`gcp-tab-${tab.id}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls={`gcp-panel-${tab.id}`}
                    tabIndex={active ? 0 : -1}
                    onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                    onClick={() => {
                      playCyberClick();
                      setActiveTab(tab.id);
                    }}
                    onMouseEnter={() => playCyberHover()}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={15} className="shrink-0" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
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
                id="gcp-panel-domains"
                aria-labelledby="gcp-tab-domains"
                className="space-y-5"
              >
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="relative w-full lg:flex-1 lg:max-w-xs min-w-0">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      aria-label="GCP サービス・gcloud トピック検索"
                      value={topicQuery}
                      onChange={(e) => setTopicQuery(e.target.value)}
                      placeholder="GCP サービス・gcloud 検索..."
                      className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
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

                {/* ドメイン別クイックジャンプ＆進捗ミニバー */}
                <div
                  className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 ${
                    domains.length === 4
                      ? "lg:grid-cols-4"
                      : domains.length === 5
                        ? "lg:grid-cols-5"
                        : "lg:grid-cols-6"
                  }`}
                >
                  {domains.map((domain) => {
                    const style = ACCENT_STYLES[domain.accentColor];
                    const done = domain.topics.filter((t) =>
                      progress.completedTopics.includes(t.id)
                    ).length;
                    const pct =
                      domain.topics.length > 0
                        ? Math.round((done / domain.topics.length) * 100)
                        : 0;
                    return (
                      <button
                        key={domain.id}
                        type="button"
                        onClick={() => {
                          setTopicQuery("");
                          setOnlyIncompleteTopics(false);
                          setOnlyWithNotesTopics(false);
                          handleFocusDomain(domain.id);
                        }}
                        onMouseEnter={() => playCyberHover()}
                        className="bg-white rounded-xl border border-slate-200/80 hover:border-cyan-300 p-3 text-left transition-all shadow-xs space-y-1.5 cursor-pointer group min-w-0"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${style.badge}`}
                          >
                            D{domain.number}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            {done}/{domain.topics.length}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-800 group-hover:text-cyan-700 line-clamp-2 leading-snug min-h-[2rem]">
                          {domain.title}
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full ${style.bar} transition-all duration-300`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {filteredDomains.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-2">
                    <Search className="w-8 h-8 text-slate-300 mx-auto" />
                    <div className="text-sm font-black text-slate-700">
                      条件に一致するトピックがありません
                    </div>
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
                      const Icon = DOMAIN_ICONS[domain.id] ?? Cloud;
                      const style = ACCENT_STYLES[domain.accentColor];
                      const isExpanded = Boolean(expandedDomains[domain.id] || topicQuery.trim());
                      const domainDone = domain.topics.filter((t) =>
                        progress.completedTopics.includes(t.id)
                      ).length;
                      const domainPct = Math.round((domainDone / domain.topics.length) * 100);
                      const panelId = `gcp-domain-panel-${domain.id}`;

                      const handleToggleDomain = () => {
                        const willExpand = !expandedDomains[domain.id];
                        if (willExpand) {
                          playCyberOpen();
                        } else {
                          playCyberClick();
                        }
                        setExpandedDomains((prev) => ({
                          ...prev,
                          [domain.id]: !prev[domain.id],
                        }));
                      };

                      return (
                        <div
                          key={domain.id}
                          id={domain.id}
                          className={`scroll-mt-6 bg-white rounded-2xl border ${style.border} shadow-xs overflow-hidden`}
                        >
                          <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <button
                              type="button"
                              aria-expanded={isExpanded}
                              aria-controls={panelId}
                              onClick={handleToggleDomain}
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
                                    Domain {domain.number} ・ 目安 {domain.weight}
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
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {domain.summary}
                                </p>
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
                                aria-controls={panelId}
                                aria-label={`${domain.title}を${isExpanded ? "折りたたむ" : "展開する"}`}
                                onClick={handleToggleDomain}
                                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer"
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div
                              id={panelId}
                              className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4"
                            >
                              {domain.visibleTopics.map((topic) => {
                                const isDone = progress.completedTopics.includes(topic.id);
                                const noteText = progress.topicNotes[topic.id] ?? "";
                                const isNoteOpen = Boolean(
                                  openNoteTopics[topic.id] || noteText.trim()
                                );
                                const notePanelId = `gcp-note-panel-${topic.id}`;
                                const noteInputId = `gcp-note-input-${topic.id}`;

                                return (
                                  <div
                                    key={topic.id}
                                    className={`bg-white rounded-xl border p-5 space-y-3 transition-all ${
                                      isDone
                                        ? "border-emerald-200 bg-emerald-50/20"
                                        : "border-slate-200/80"
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
                                            Topic {topic.code}
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
                                        aria-controls={notePanelId}
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

                                    {/* 関連サービス・コマンド */}
                                    <div className="flex flex-wrap gap-1.5">
                                      {topic.services.map((svc) => (
                                        <button
                                          key={svc}
                                          type="button"
                                          onClick={() => handleJumpToServiceComparison(svc)}
                                          title="比較表で検索する"
                                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 font-mono text-[11px] font-bold text-slate-700 hover:text-cyan-800 transition-colors cursor-pointer"
                                        >
                                          {svc}
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

                                    {/* 個人メモ */}
                                    {isNoteOpen && (
                                      <div id={notePanelId} className="pt-2">
                                        <label htmlFor={noteInputId} className="sr-only">
                                          {topic.title} の学習メモ
                                        </label>
                                        <textarea
                                          id={noteInputId}
                                          rows={2}
                                          value={noteText}
                                          onChange={(e) =>
                                            handleUpdateTopicNote(topic.id, e.target.value)
                                          }
                                          placeholder="自分用の学習メモや公式ドキュメントの覚え書きを記入（自動保存）..."
                                          className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/30 text-xs text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
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

            {/* TAB 2: 比較表・設計パターン */}
            {activeTab === "comparisons" && (
              <div
                role="tabpanel"
                id="gcp-panel-comparisons"
                aria-labelledby="gcp-tab-comparisons"
                className="space-y-8"
              >
                <div className="space-y-3">
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div
                      role="group"
                      aria-label="比較表カテゴリフィルター"
                      className="flex flex-wrap gap-1.5"
                    >
                      {availableComparisonCategories.map((cat) => (
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
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="relative w-full lg:w-64 shrink-0 min-w-0">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        aria-label="比較表・逆引き・サービス検索"
                        value={compQuery}
                        onChange={(e) => setCompQuery(e.target.value)}
                        placeholder="比較表・逆引き・サービス検索..."
                        className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
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

                  {/* 人気サービス クイック検索チップ */}
                  <div
                    role="group"
                    aria-label="クイック検索チップ"
                    className="flex flex-wrap items-center gap-1.5 px-1"
                  >
                    <span className="text-[11px] font-bold text-slate-400 mr-1">
                      よく調べるサービス:
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
                </div>

                {/* すべて0件時のエンプティステート */}
                {filteredQuickLookup.length === 0 &&
                  filteredComparisons.length === 0 &&
                  filteredPatterns.length === 0 &&
                  filteredPitfalls.length === 0 &&
                  filteredKeyFacts.length === 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3 shadow-xs">
                      <Search className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="text-sm font-black text-slate-900">
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
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                      >
                        検索・カテゴリをリセット
                      </button>
                    </div>
                  )}

                {/* 要件キーワード → 推奨サービス即断チートシート */}
                {filteredQuickLookup.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                        <span>本番直前：要件キーワード → 推奨サービス即断チートシート</span>
                      </h3>
                      <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0">
                        {filteredQuickLookup.length} 件
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredQuickLookup.map((item) => (
                        <div
                          key={item.keyword}
                          className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between gap-2 min-w-0"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900 leading-snug break-words min-w-0">
                              {item.keyword}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-xs font-mono font-black text-cyan-700 break-words">
                            → {item.recommended}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {filteredComparisons.length > 0 && (
                  <div className="space-y-5">
                    {filteredComparisons.map((comp) => (
                      <div
                        key={comp.id}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200">
                              {comp.category}
                            </span>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                              {comp.title}
                            </h3>
                            <p className="text-xs text-slate-500">{comp.subtitle}</p>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[640px] text-left border-collapse text-xs sm:text-sm">
                            <caption className="sr-only">{comp.title}</caption>
                            <thead>
                              <tr className="border-b border-slate-200 bg-slate-50">
                                {comp.columns.map((col) => (
                                  <th
                                    key={col}
                                    scope="col"
                                    className="py-2.5 px-3 font-black text-slate-700 whitespace-nowrap"
                                  >
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {comp.rows.map((row) => (
                                <tr key={row.feature} className="hover:bg-slate-50/70">
                                  <th
                                    scope="row"
                                    className="py-2.5 px-3 font-bold text-slate-800 text-left"
                                  >
                                    {row.feature}
                                  </th>
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

                {/* 頻出アーキテクチャ・運用パターン */}
                {filteredPatterns.length > 0 && (
                  <section className="space-y-4">
                    <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                      <Layers className="w-5 h-5 text-cyan-600" />
                      <span>頻出アーキテクチャ・運用パターン</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredPatterns.map((pat) => (
                        <SpotlightCard
                          key={pat.id}
                          className="p-5 space-y-3 bg-white border border-slate-200/80 rounded-2xl"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-sm sm:text-base font-black text-slate-900">
                              {pat.title}
                            </h4>
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

                {/* 重要仕様・数値早見 */}
                {filteredKeyFacts.length > 0 && (
                  <section className="space-y-4">
                    <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                      <Gauge className="w-5 h-5 text-indigo-600" />
                      <span>重要仕様・制限値早見表</span>
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
                          <div className="text-sm font-black text-slate-900 break-words">
                            {kf.value}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">{kf.detail}</p>
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
                id="gcp-panel-flashcards"
                aria-labelledby="gcp-tab-flashcards"
              >
                <CertificationFlashcards
                  key={certId}
                  items={quickLookup}
                  masteredKeywords={progress.masteredCards}
                  onToggleMastered={handleToggleMasteredCard}
                  onResetMastered={handleResetMasteredCards}
                  badgeText={`GCP ${meta.shortLabel} 直前暗記フラッシュカード`}
                  title={meta.flashcardTitle}
                  promptLabel="次の要件に対応する Google Cloud サービス・機能は？"
                  answerLabel="推奨サービス・コマンド"
                />
              </div>
            )}

            {/* TAB 4: 練習問題・模擬試験 */}
            {activeTab === "quiz" && (
              <div
                role="tabpanel"
                id="gcp-panel-quiz"
                aria-labelledby="gcp-tab-quiz"
              >
                <CertificationPracticeQuiz
                  key={certId}
                  questions={practiceQuestions}
                  domains={quizDomains}
                  examBadgeLabel={meta.quizBadgeLabel}
                  passingConfig={meta.passingConfig}
                  answers={progress.quizAnswers}
                  bookmarkedIds={progress.bookmarkedQuestions}
                  mockExamHistory={progress.mockExamHistory}
                  initialDomain={quizDomainTarget}
                  secondsPerQuestion={meta.secondsPerQuestion}
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
                id="gcp-panel-resources"
                aria-labelledby="gcp-tab-resources"
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
                    Google Cloud 公式学習リソース（{meta.label}）
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
                          <div className="text-[11px] font-mono text-cyan-700 truncate">
                            {res.url}
                          </div>
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
