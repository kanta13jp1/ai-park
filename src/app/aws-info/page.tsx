"use client";

import { useEffect, useState, useMemo, useRef, type KeyboardEvent } from "react";
import {
  Cloud,
  ShieldCheck,
  Layers,
  Zap,
  Coins,
  Cpu,
  Network,
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
  Brain,
  Bot,
  Lock,
  Terminal,
  GitBranch,
  Activity,
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
  CertMockExamRecord,
  CertQuizDomain,
} from "@/components/certification/types";
import type { SaaDomain } from "@/data/aws-types";
import {
  AWS_CERT_META,
  AWS_CERT_IDS,
  AWS_LEVEL_GROUPS,
  INITIAL_AWS_CERT_DATA,
  loadAwsCertData,
  saaWellArchitectedPillars,
  type AwsCertId,
  type AwsCertData,
} from "@/components/aws/awsCertRegistry";
import {
  playCyberClick,
  playCyberHover,
  playCyberOpen,
  playCyberSuccess,
} from "@/lib/sound";

type TabId = "domains" | "comparisons" | "flashcards" | "quiz" | "resources";

interface AwsCertProgress {
  completedTopics: string[];
  quizAnswers: Record<string, number[]>;
  bookmarkedQuestions: string[];
  masteredCards: string[];
  topicNotes: Record<string, string>;
  mockExamHistory: CertMockExamRecord[];
}

const DEFAULT_PROGRESS: AwsCertProgress = {
  completedTopics: [],
  quizAnswers: {},
  bookmarkedQuestions: [],
  masteredCards: [],
  topicNotes: {},
  mockExamHistory: [],
};

const DOMAIN_ICONS: Record<string, typeof ShieldCheck> = {
  "clf-domain-1": Cloud,
  "clf-domain-2": ShieldCheck,
  "clf-domain-3": Cpu,
  "clf-domain-4": Coins,
  "aif-domain-1": Brain,
  "aif-domain-2": Sparkles,
  "aif-domain-3": Bot,
  "aif-domain-4": ShieldCheck,
  "aif-domain-5": Lock,
  "domain-1": ShieldCheck,
  "domain-2": Layers,
  "domain-3": Zap,
  "domain-4": Coins,
  "dva-domain-1": Terminal,
  "dva-domain-2": ShieldCheck,
  "dva-domain-3": GitBranch,
  "dva-domain-4": Activity,
  "soa-domain-1": Activity,
  "soa-domain-2": Layers,
  "soa-domain-3": Workflow,
  "soa-domain-4": ShieldCheck,
  "soa-domain-5": Network,
  "sap-domain-1": Network,
  "sap-domain-2": ShieldCheck,
  "sap-domain-3": Coins,
  "sap-domain-4": Layers,
  "sap-domain-5": Workflow,
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

function loadAwsProgress(storageKey: string): AwsCertProgress {
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

export default function AwsInfoPage() {
  const [activeCertId, setActiveCertId] = useState<AwsCertId>("saa");
  const meta = AWS_CERT_META[activeCertId];

  const [certDataCache, setCertDataCache] = useState<Partial<Record<AwsCertId, AwsCertData>>>({
    saa: INITIAL_AWS_CERT_DATA,
  });
  const [loadingCertId, setLoadingCertId] = useState<AwsCertId | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadRequestGenRef = useRef(0);

  const [activeTab, setActiveTab] = useState<TabId>("domains");
  const [quizDomainTarget, setQuizDomainTarget] = useState<string>("all");
  const [progressByCert, setProgressByCert] = useState<Record<AwsCertId, AwsCertProgress>>({
    clf: DEFAULT_PROGRESS,
    aif: DEFAULT_PROGRESS,
    saa: DEFAULT_PROGRESS,
    dva: DEFAULT_PROGRESS,
    soa: DEFAULT_PROGRESS,
    sap: DEFAULT_PROGRESS,
  });
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>(
    AWS_CERT_META.saa.defaultExpanded
  );
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
  const [importMessage, setImportMessage] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  // タイマークリーンアップ用 ref
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
      const loaded = {} as Record<AwsCertId, AwsCertProgress>;
      for (const id of AWS_CERT_IDS) {
        loaded[id] = loadAwsProgress(AWS_CERT_META[id].storageKey);
      }
      setProgressByCert(loaded);
    });
  }, []);

  const activeData = certDataCache[activeCertId];
  const progress = progressByCert[activeCertId];

  const triggerCertLoad = async (targetCert: AwsCertId) => {
    const reqGen = ++loadRequestGenRef.current;
    setLoadingCertId(targetCert);
    setLoadError(null);
    try {
      const data = await loadAwsCertData(targetCert);
      setCertDataCache((prev) => ({ ...prev, [targetCert]: data }));
      if (loadRequestGenRef.current === reqGen) {
        setLoadingCertId(null);
      }
    } catch {
      if (loadRequestGenRef.current === reqGen) {
        setLoadingCertId(null);
        setLoadError(`${AWS_CERT_META[targetCert].switchLabel} の学習データ読み込みに失敗しました。`);
      }
    }
  };

  const saveProgress = (next: AwsCertProgress) => {
    setProgressByCert((prev) => ({ ...prev, [activeCertId]: next }));
    try {
      window.localStorage.setItem(meta.storageKey, JSON.stringify(next));
    } catch {
      // ignore storage quota errors
    }
  };

  const handleSwitchCert = (nextCert: AwsCertId) => {
    if (nextCert === activeCertId) return;
    playCyberClick();
    loadRequestGenRef.current++;
    setActiveCertId(nextCert);
    setExpandedDomains(AWS_CERT_META[nextCert].defaultExpanded);
    setOnlyIncompleteTopics(false);
    setOnlyWithNotesTopics(false);
    setTopicQuery("");
    setOpenNoteTopics({});
    setCompCategory("すべて");
    setCompQuery("");
    setQuizDomainTarget("all");
    setConfirmReset(false);
    setShowBackupPanel(false);
    setBackupInput("");
    setCopiedBackup(false);
    setCopiedNotes(false);
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
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    playCyberClick();
    if (!confirmReset) {
      setConfirmReset(true);
      resetTimerRef.current = setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    saveProgress(DEFAULT_PROGRESS);
    setConfirmReset(false);
  };

  const handleExpandAllDomains = (expand: boolean) => {
    if (!activeData) return;
    if (expand) {
      playCyberOpen();
    } else {
      playCyberClick();
    }
    const next: Record<string, boolean> = {};
    for (const d of activeData.domains) {
      next[d.id] = expand;
    }
    setExpandedDomains(next);
  };

  const scrollTopRespectMotion = () => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  const handleJumpToDomainQuiz = (domainId: string) => {
    playCyberClick();
    setQuizDomainTarget(domainId);
    setActiveTab("quiz");
    scrollTopRespectMotion();
  };

  const handleJumpToServiceComparison = (serviceName: string) => {
    if (!activeData) return;
    playCyberClick();
    setCompCategory("すべて");
    setCompQuery(activeData.resolveServiceQuery(serviceName));
    setActiveTab("comparisons");
    scrollTopRespectMotion();
  };

  const handleUpdateTopicNote = (topicId: string, note: string) => {
    const nextNotes = { ...progress.topicNotes };
    if (note.trim() === "") {
      delete nextNotes[topicId];
    } else {
      nextNotes[topicId] = note;
    }
    saveProgress({ ...progress, topicNotes: nextNotes });
  };

  const handleRecordMockExam = (record: CertMockExamRecord) => {
    saveProgress({
      ...progress,
      mockExamHistory: [record, ...progress.mockExamHistory].slice(0, 5),
    });
  };

  const handleCopyBackup = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify({ version: 1, certId: activeCertId, ...progress })
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

  const domains = useMemo(() => activeData?.domains ?? [], [activeData]);
  const comparisons = useMemo(() => activeData?.comparisons ?? [], [activeData]);
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
  const architecturePatterns = useMemo(
    () => activeData?.architecturePatterns ?? [],
    [activeData]
  );
  const pitfalls = useMemo(() => activeData?.pitfalls ?? [], [activeData]);
  const keyLimits = useMemo(() => activeData?.keyLimits ?? [], [activeData]);

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

  const validMasteredCards = useMemo(
    () => progress.masteredCards.filter((k) => validCardKeywords.has(k)),
    [progress.masteredCards, validCardKeywords]
  );

  const hasAnyNotes = useMemo(
    () =>
      Object.entries(progress.topicNotes).some(
        ([id, n]) => validTopicIds.has(id) && n.trim().length > 0
      ),
    [progress.topicNotes, validTopicIds]
  );

  const notedTopicsCount = useMemo(
    () =>
      Object.entries(progress.topicNotes).filter(
        ([id, n]) => validTopicIds.has(id) && n.trim().length > 0
      ).length,
    [progress.topicNotes, validTopicIds]
  );

  const handleCopyNotesMarkdown = async () => {
    if (!activeData) return;
    const lines: string[] = [`# AWS ${meta.shortCode} マイメモ`, ""];
    for (const d of activeData.domains) {
      const domainLines: string[] = [];
      for (const t of d.topics) {
        const note = progress.topicNotes[t.id]?.trim();
        if (note) {
          domainLines.push(`### ${t.title}`, "", note, "");
        }
      }
      if (domainLines.length > 0) {
        lines.push(`## Domain ${d.number}: ${d.title}`, "", ...domainLines);
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
      setImportMessage({ text: "マイメモのコピーに失敗しました。", isError: true });
    }
  };

  const handleRestoreBackup = () => {
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
      if (parsed.certId !== undefined && parsed.certId !== activeCertId) {
        playCyberClick();
        setImportMessage({
          text: `別の資格（${String(parsed.certId).toUpperCase()}）のバックアップです。${meta.shortCode} のバックアップを使用するか、該当資格へ切り替えて復元してください。`,
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

      saveProgress({
        completedTopics: normalizeStringArray(parsed.completedTopics),
        quizAnswers: normalizeQuizAnswers(parsed.quizAnswers),
        bookmarkedQuestions: normalizeStringArray(parsed.bookmarkedQuestions),
        masteredCards: normalizeStringArray(parsed.masteredCards),
        topicNotes: normalizeStringRecord(parsed.topicNotes),
        mockExamHistory: normalizeMockExamHistory(parsed.mockExamHistory),
      });
      setBackupInput("");
      playCyberSuccess();
      setImportMessage({
        text: `${meta.shortCode} の学習進捗を復元しました。`,
        isError: false,
      });
      if (importMsgTimerRef.current) clearTimeout(importMsgTimerRef.current);
      importMsgTimerRef.current = setTimeout(() => setImportMessage(null), 3500);
    } catch {
      playCyberClick();
      setImportMessage({
        text: "JSON の形式が正しくありません。コピーしたバックアップ文字列をそのまま貼り付けてください。",
        isError: true,
      });
    }
  };

  const totalTopics = allTopics.length;
  const doneTopicsCount = useMemo(
    () => progress.completedTopics.filter((id) => validTopicIds.has(id)).length,
    [progress.completedTopics, validTopicIds]
  );
  const topicPct = totalTopics > 0 ? Math.round((doneTopicsCount / totalTopics) * 100) : 0;

  const cardPct =
    quickLookup.length > 0
      ? Math.round((validMasteredCards.length / quickLookup.length) * 100)
      : 0;

  const answeredCount = Object.keys(progress.quizAnswers).filter((id) =>
    validQuestionIds.has(id)
  ).length;
  const correctCount = practiceQuestions.filter((q) =>
    isQuestionCorrect(q, progress.quizAnswers[q.id])
  ).length;
  const quizPct =
    answeredCount > 0 && practiceQuestions.length > 0
      ? Math.round((correctCount / practiceQuestions.length) * 100)
      : 0;

  const quizDomains = useMemo<CertQuizDomain[]>(
    () =>
      domains.map((d) => ({
        id: d.id,
        number: d.number,
        shortLabel: `Domain ${d.number}`,
        filterLabel: meta.domainShortLabels[d.id] ?? `D${d.number}: ${d.title}`,
      })),
    [domains, meta.domainShortLabels]
  );

  const comparisonCategories = useMemo(
    () => ["すべて", ...Array.from(new Set(comparisons.map((c) => c.category)))],
    [comparisons]
  );

  const normalizedCompQuery = compQuery.trim().toLowerCase();

  const filteredComparisons = useMemo(() => {
    return comparisons.filter((c) => {
      if (compCategory !== "すべて" && c.category !== compCategory) return false;
      if (!normalizedCompQuery) return true;
      const haystack = [
        c.title,
        c.subtitle,
        c.decisionRule,
        ...c.columns,
        ...c.rows.flatMap((r) => [r.feature, ...r.values]),
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

  const filteredPitfalls = useMemo(() => {
    if (!normalizedCompQuery) return pitfalls;
    return pitfalls.filter((p) =>
      `${p.trap} ${p.whyWrong} ${p.correctApproach}`.toLowerCase().includes(normalizedCompQuery)
    );
  }, [pitfalls, normalizedCompQuery]);

  const filteredKeyLimits = useMemo(() => {
    if (!normalizedCompQuery) return keyLimits;
    return keyLimits.filter((l) =>
      `${l.service} ${l.limitValue} ${l.detail}`.toLowerCase().includes(normalizedCompQuery)
    );
  }, [keyLimits, normalizedCompQuery]);

  const topTwoDomainsSummary = useMemo(() => {
    const sorted = [...domains].sort((a, b) => b.weight - a.weight);
    if (sorted.length < 2) return "";
    const [first, second] = sorted;
    return `Domain ${first.number}（${first.weight}%）と Domain ${second.number}（${second.weight}%）で合計 ${
      first.weight + second.weight
    }% を占めます`;
  }, [domains]);

  // 進捗に応じた次のおすすめアクション
  const nextRecommendation = useMemo(() => {
    const nextDomain = domains.find((d) =>
      d.topics.some((t) => !progress.completedTopics.includes(t.id))
    );
    if (doneTopicsCount < totalTopics && nextDomain) {
      return {
        label: `次は Domain ${nextDomain.number}（${nextDomain.title}）の未完了トピックを確認しましょう`,
        actionLabel: "ドメインを開く",
        onClick: () => {
          playCyberClick();
          setActiveTab("domains");
          setExpandedDomains((prev) => ({ ...prev, [nextDomain.id]: true }));
        },
      };
    }
    if (validMasteredCards.length < quickLookup.length) {
      return {
        label: `全トピック完了！次はフラッシュカードで即答力を鍛えましょう（残り ${
          quickLookup.length - validMasteredCards.length
        } 枚）`,
        actionLabel: "フラッシュカードへ",
        onClick: () => {
          playCyberClick();
          setActiveTab("flashcards");
        },
      };
    }
    if (answeredCount < practiceQuestions.length) {
      return {
        label: `演習クイズ・模擬試験モードで実力を試しましょう（残り ${
          practiceQuestions.length - answeredCount
        } 問）`,
        actionLabel: "実践演習へ",
        onClick: () => {
          playCyberClick();
          setActiveTab("quiz");
        },
      };
    }
    const mockExamMinutes = Math.round(
      (practiceQuestions.length * meta.secondsPerQuestion) / 60
    );
    return {
      label: `全カリキュラム完了！模擬試験モード（${mockExamMinutes}分制限）や不正解の復習で仕上げましょう。`,
      actionLabel: "模擬試験に挑戦",
      onClick: () => {
        playCyberClick();
        setActiveTab("quiz");
      },
    };
  }, [
    domains,
    quickLookup.length,
    practiceQuestions.length,
    meta.secondsPerQuestion,
    doneTopicsCount,
    totalTopics,
    progress.completedTopics,
    validMasteredCards.length,
    answeredCount,
  ]);

  const normalizedTopicQuery = topicQuery.trim().toLowerCase();

  const tabs: { id: TabId; label: string; icon: typeof BookOpen; badge?: string }[] = [
    {
      id: "domains",
      label: `${domains.length > 0 ? domains.length : ""}ドメイン攻略`,
      icon: BookOpen,
      badge: activeData ? `${doneTopicsCount}/${totalTopics}` : undefined,
    },
    {
      id: "comparisons",
      label: "頻出比較 & 逆引き",
      icon: TableProperties,
      badge: activeData ? `${comparisons.length}` : undefined,
    },
    {
      id: "flashcards",
      label: "フラッシュカード",
      icon: Layers2,
      badge: activeData ? `${validMasteredCards.length}/${quickLookup.length}` : undefined,
    },
    {
      id: "quiz",
      label: "実践演習クイズ",
      icon: HelpCircle,
      badge: activeData ? `${correctCount}/${practiceQuestions.length}` : undefined,
    },
    { id: "resources", label: "学習ロードマップ", icon: Compass },
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
        document.getElementById(`aws-tab-${nextId}`)?.focus();
      });
    }
  };

  const allExpanded = domains.length > 0 && domains.every((d) => expandedDomains[d.id]);
  const firstDomainTopics = domains[0]?.topics.slice(0, 2) ?? [];
  const step1Done =
    firstDomainTopics.length > 0 &&
    firstDomainTopics.every((t) => progress.completedTopics.includes(t.id));

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen min-w-0">
      <HeroBanner
        title="AWS・クラウド情報局"
        subtitle="Foundational (CLF-C02 / AIF-C01) ・ Associate (SAA-C03 / DVA-C03 / SOA-C03) ・ Professional (SAP-C03) 全6資格統合学習ハブ"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-w-0">
        {/* 社内ルール・相談窓口についての誠実な未完了注記 */}
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 一部工事中・学習ハブ先行公開"
          message="このページでは AWS認定 全6資格（CLF-C02 / AIF-C01 / SAA-C03 / DVA-C03 / SOA-C03 / SAP-C03）の公式試験ガイドに基づく学習コンテンツを公開しています。社内の AWS アカウント申請ルール・資格受験補助制度・相談窓口は準備中です。"
          prepDetails="社内の AWS 利用ルール・資格受験補助制度・相談窓口の確定（確定次第、本画面および開発ロードマップを更新）"
          releaseDate="未定"
        />

        {/* 資格レベル切り替え（全6資格・レベル別グループ） */}
        <section
          aria-label="学習資格選択（全6資格）"
          className="flex flex-col gap-3 bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs min-w-0 max-w-full"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center space-x-2">
              <Cloud size={16} className="text-indigo-600 shrink-0" />
              <span className="text-xs sm:text-sm font-black text-slate-800">
                学習資格選択（全6資格）
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              現在: {meta.level} / {meta.shortCode}
            </span>
          </div>
          <div className="space-y-2">
            {AWS_LEVEL_GROUPS.map((group) => (
              <div
                key={group.level}
                role="group"
                aria-label={`${group.level}（${group.badge}）`}
                className="flex flex-col lg:flex-row lg:items-center gap-2 bg-slate-100/90 p-2 rounded-xl border border-slate-200/70 min-w-0"
              >
                <div className="flex items-center space-x-1.5 lg:w-48 shrink-0 px-1.5">
                  <span className="text-[11px] font-black text-slate-800">{group.level}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    {group.badge}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                  {group.ids.map((id) => {
                    const item = AWS_CERT_META[id];
                    const active = activeCertId === id;
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
                        {item.switchLabel}
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
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-700/50 p-5 sm:p-8 text-white shadow-xl"
          >
            <div className="absolute -top-10 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 tracking-wider">
                    <Cloud size={12} />
                    <span>{meta.hudBadgeText}</span>
                  </span>
                  {activeData ? (
                    <span className="text-xs text-slate-300">
                      {totalTopics} トピック ・ 比較表 {comparisons.length} 種 ・ カード{" "}
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
                  <span className="inline-block">{meta.headlineLead}</span>{" "}
                  <span className="inline-block">{meta.headlineSuffix}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {meta.description}
                </p>
              </div>

              {/* 進捗ゲージカード */}
              <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2.5 lg:min-w-[360px]">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">トピック習得</div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
                    {topicPct}%
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={topicPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${meta.shortCode} トピック習得進捗`}
                    className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden"
                  >
                    <div
                      className="h-full bg-cyan-400 transition-all duration-500"
                      style={{ width: `${topicPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {doneTopicsCount} / {totalTopics || "-"} 完了
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">カード暗記</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    {cardPct}%
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={cardPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${meta.shortCode} フラッシュカード習得進捗`}
                    className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden"
                  >
                    <div
                      className="h-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${cardPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {validMasteredCards.length} / {quickLookup.length || "-"} 枚
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">演習正答率</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                    {quizPct}%
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={quizPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${meta.shortCode} 演習正答率`}
                    className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden"
                  >
                    <div
                      className="h-full bg-emerald-400 transition-all duration-500"
                      style={{ width: `${quizPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {correctCount} / {practiceQuestions.length || "-"} 問正解
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* 動的ロード中・エラー表示 */}
        {(!activeData || loadingCertId !== null) && (
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
                  onClick={() => void triggerCertLoad(activeCertId)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  再読み込みする
                </button>
              </>
            ) : (
              <>
                <Loader2 className="w-7 h-7 text-indigo-600 mx-auto animate-spin" />
                <p className="text-xs font-bold text-slate-600">
                  {meta.switchLabel} のドメイン・比較表・演習問題データを読み込み中...
                </p>
              </>
            )}
          </div>
        )}

        {activeData && loadingCertId === null && (
          <>
            {/* スマート学習ガイドバー */}
            <div className="bg-white rounded-2xl border border-indigo-200/80 px-4 py-3 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-2">
              <div className="flex items-start sm:items-center space-x-2 text-xs text-slate-700 min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px] shrink-0">
                  NEXT STEP
                </span>
                <span className="font-medium break-words">{nextRecommendation.label}</span>
              </div>
              <button
                type="button"
                onClick={nextRecommendation.onClick}
                className="self-start lg:self-auto shrink-0 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                <span>{nextRecommendation.actionLabel}</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* タブナビゲーション (WAI-ARIA APG Tabs) */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div
                role="tablist"
                aria-label="AWS 学習セクション"
                className="flex flex-wrap gap-2"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`aws-tab-${tab.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`aws-panel-${tab.id}`}
                      tabIndex={isActive ? 0 : -1}
                      onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                      onClick={() => {
                        playCyberClick();
                        setActiveTab(tab.id);
                      }}
                      onMouseEnter={() => playCyberHover()}
                      className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-slate-900 text-white shadow-md"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
                      }`}
                    >
                      <Icon size={15} className="shrink-0" />
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
                className={`shrink-0 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  confirmReset
                    ? "bg-rose-600 text-white"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                <RotateCcw size={12} />
                <span>
                  {confirmReset
                    ? `もう一度押すと ${meta.shortCode} 進捗をリセット`
                    : "全進捗リセット"}
                </span>
              </button>
            </div>

            {/* Tab 1: 試験概要 & ドメイン攻略 */}
            {activeTab === "domains" && (
              <div
                role="tabpanel"
                id="aws-panel-domains"
                aria-labelledby="aws-tab-domains"
                className="space-y-8"
              >
                {/* 試験基本データグリッド */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                      <Award size={18} className="text-indigo-600 shrink-0" />
                      <span>{meta.shortCode} 試験スペック（AWS公式ガイド準拠）</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    {examFacts.map((fact) => (
                      <div
                        key={fact.label}
                        className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs space-y-1 min-w-0"
                      >
                        <div className="text-[11px] font-bold text-slate-500">{fact.label}</div>
                        <div className="text-sm sm:text-base font-black text-slate-900 font-mono break-words">
                          {fact.value}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-snug">{fact.detail}</div>
                      </div>
                    ))}
                  </div>

                  {/* 出題ドメイン配分バランスバー */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-slate-700">
                        出題ドメイン配分ウェイト（合計 100%）
                      </span>
                      {topTwoDomainsSummary && (
                        <span className="text-[11px] text-slate-500">{topTwoDomainsSummary}</span>
                      )}
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
                      {domains.map((d) => (
                        <div
                          key={d.id}
                          className={`${ACCENT_STYLES[d.accentColor].bar} h-full`}
                          style={{ width: `${d.weight}%` }}
                          title={`Domain ${d.number}: ${d.weight}%`}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
                      {domains.map((d) => (
                        <span key={d.id} className="inline-flex items-center space-x-1.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-xs ${ACCENT_STYLES[d.accentColor].bar}`}
                          />
                          <span>
                            D{d.number} {d.title} ({d.weight}%)
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 出題ドメイン一覧 */}
                <section className="space-y-4">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {domains.length}つの出題ドメイン別 攻略チェックリスト
                      </h3>
                      <p className="text-xs text-slate-500">
                        各トピックを確認したらチェックを入れて進捗を管理できます。
                      </p>
                    </div>

                    {/* 検索 & コントロール */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative w-full lg:w-64 shrink-0 min-w-0">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="text"
                          aria-label="AWS サービス・トピックキーワード検索"
                          value={topicQuery}
                          onChange={(e) => setTopicQuery(e.target.value)}
                          placeholder="サービス名・キーワード検索..."
                          className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
                        aria-pressed={onlyIncompleteTopics}
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
                        aria-pressed={onlyWithNotesTopics}
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
                        <span>メモあり ({notedTopicsCount})</span>
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
                    {domains.every((domain) => {
                      const hasVisible = domain.topics.some((t) => {
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
                        return [t.title, ...t.services, ...t.keyPoints, t.examTip]
                          .join(" ")
                          .toLowerCase()
                          .includes(normalizedTopicQuery);
                      });
                      return !hasVisible;
                    }) && (
                      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3">
                        <Search className="w-8 h-8 text-slate-300 mx-auto" />
                        <div className="text-sm font-black text-slate-900">
                          条件に一致するトピックがありません
                        </div>
                        <p className="text-xs text-slate-500">
                          検索キーワードや「未完了のみ」「メモあり」の絞り込み条件を解除してください。
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            playCyberClick();
                            setTopicQuery("");
                            setOnlyIncompleteTopics(false);
                            setOnlyWithNotesTopics(false);
                          }}
                          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                        >
                          フィルターをすべて解除
                        </button>
                      </div>
                    )}

                    {domains.map((domain) => {
                      const Icon = DOMAIN_ICONS[domain.id] ?? Cloud;
                      const style = ACCENT_STYLES[domain.accentColor];
                      const isExpanded =
                        !!expandedDomains[domain.id] ||
                        normalizedTopicQuery.length > 0 ||
                        onlyWithNotesTopics;
                      const doneInDomain = domain.topics.filter((t) =>
                        progress.completedTopics.includes(t.id)
                      ).length;
                      const isDomainComplete =
                        domain.topics.length > 0 && doneInDomain === domain.topics.length;
                      const domainPanelId = `aws-domain-panel-${domain.id}`;

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
                            aria-expanded={isExpanded}
                            aria-controls={domainPanelId}
                            onClick={() => {
                              if (expandedDomains[domain.id]) {
                                playCyberClick();
                              } else {
                                playCyberOpen();
                              }
                              setExpandedDomains((prev) => ({
                                ...prev,
                                [domain.id]: !prev[domain.id],
                              }));
                            }}
                            className="w-full p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start space-x-4 min-w-0">
                              <div
                                className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${style.iconBg}`}
                              >
                                <Icon size={22} />
                              </div>
                              <div className="space-y-1 min-w-0">
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
                                <h4 className="text-base sm:text-lg font-black text-slate-900 break-words">
                                  {domain.title}
                                </h4>
                                <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                                  {domain.summary}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 self-end lg:self-center shrink-0">
                              <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className={`h-full ${style.bar} transition-all duration-300`}
                                  style={{
                                    width: `${
                                      domain.topics.length > 0
                                        ? Math.round((doneInDomain / domain.topics.length) * 100)
                                        : 0
                                    }%`,
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
                            <div
                              id={domainPanelId}
                              className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/40"
                            >
                              {visibleTopics.length === 0 ? (
                                <div className="p-6 text-xs text-slate-500 text-center">
                                  このドメインのトピックはすべて完了しています。
                                </div>
                              ) : (
                                visibleTopics.map((topic) => {
                                  const checked = progress.completedTopics.includes(topic.id);
                                  const noteVal = progress.topicNotes[topic.id] ?? "";
                                  const hasNote = noteVal.trim().length > 0;
                                  const isNoteOpen = Boolean(openNoteTopics[topic.id] || hasNote);
                                  const notePanelId = `aws-note-panel-${topic.id}`;
                                  const noteInputId = `aws-note-input-${topic.id}`;
                                  return (
                                    <div key={topic.id} className="p-5 sm:p-6 space-y-3">
                                      <button
                                        type="button"
                                        aria-pressed={checked}
                                        onClick={() => toggleTopic(topic.id)}
                                        className="w-full flex items-start space-x-3 text-left group cursor-pointer"
                                      >
                                        {checked ? (
                                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                        ) : (
                                          <Circle className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 shrink-0 mt-0.5 transition-colors" />
                                        )}
                                        <span
                                          className={`text-sm sm:text-base font-bold transition-colors break-words ${
                                            checked
                                              ? "text-emerald-800 line-through decoration-emerald-400/60"
                                              : "text-slate-900 group-hover:text-indigo-700"
                                          }`}
                                        >
                                          {topic.title}
                                        </span>
                                      </button>

                                      <div className="pl-0 sm:pl-8 space-y-3">
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
                                        <div className="space-y-2">
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
                                            <div id={notePanelId}>
                                              <label htmlFor={noteInputId} className="sr-only">
                                                {topic.title} の学習メモ
                                              </label>
                                              <textarea
                                                id={noteInputId}
                                                value={noteVal}
                                                onChange={(e) =>
                                                  handleUpdateTopicNote(topic.id, e.target.value)
                                                }
                                                rows={2}
                                                placeholder="このトピックで自分が迷いやすい点や暗記メモを記録（ブラウザに自動保存）..."
                                                className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                              />
                                            </div>
                                          )}
                                        </div>
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
              <div
                role="tabpanel"
                id="aws-panel-comparisons"
                aria-labelledby="aws-tab-comparisons"
                className="space-y-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div
                    role="group"
                    aria-label="比較表カテゴリフィルター"
                    className="flex flex-wrap items-center gap-2"
                  >
                    {comparisonCategories.map((cat) => {
                      const active = compCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          aria-pressed={active}
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

                  <div className="relative w-full lg:w-64 shrink-0 min-w-0">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      aria-label="比較表・逆引き・ひっかけ・制限値を検索"
                      value={compQuery}
                      onChange={(e) => setCompQuery(e.target.value)}
                      placeholder="比較表・逆引きを検索..."
                      className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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

                {/* 人気サービス クイック検索チップ */}
                <div
                  role="group"
                  aria-label="よく調べるサービスクイック検索チップ"
                  className="flex flex-wrap items-center gap-1.5 -mt-4"
                >
                  <span className="text-[11px] font-bold text-slate-500 mr-1">
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
                            : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
                        }`}
                      >
                        {kw}
                      </button>
                    );
                  })}
                </div>

                {/* すべて0件時のエンプティステート */}
                {filteredQuickLookup.length === 0 &&
                  filteredComparisons.length === 0 &&
                  filteredPitfalls.length === 0 &&
                  filteredKeyLimits.length === 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3">
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
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                      >
                        検索・カテゴリをリセット
                      </button>
                    </div>
                  )}

                {/* 要件→サービス即断逆引きチートシート */}
                {filteredQuickLookup.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                        <Zap size={17} className="text-amber-500 shrink-0" />
                        <span>
                          {meta.shortCode} 本番直前：要件キーワード → 推奨サービス即断チートシート
                        </span>
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredQuickLookup.map((item) => (
                        <div
                          key={item.keyword}
                          className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between gap-2 min-w-0"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900 leading-snug break-words min-w-0">
                              「{item.keyword}」
                            </span>
                            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-xs font-mono font-black text-indigo-700 bg-indigo-50/70 border border-indigo-100 px-3 py-1.5 rounded-lg break-words">
                            → {item.recommended}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 比較テーブル一覧 */}
                {filteredComparisons.length > 0 && (
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
                          <table className="w-full min-w-[640px] text-left border-collapse text-xs sm:text-sm">
                            <caption className="sr-only">{table.title}</caption>
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                                {table.columns.map((col, idx) => (
                                  <th
                                    key={idx}
                                    scope="col"
                                    className="py-3 px-4 font-bold whitespace-nowrap"
                                  >
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {table.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-50/70">
                                  <th
                                    scope="row"
                                    className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap bg-slate-50/30 text-left"
                                  >
                                    {row.feature}
                                  </th>
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
                )}

                {/* 試験のひっかけ回避：典型的な誤答パターン */}
                {filteredPitfalls.length > 0 && (
                  <section className="space-y-3 pt-2">
                    <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                      <AlertTriangle size={17} className="text-rose-500 shrink-0" />
                      <span>
                        {meta.shortCode} 試験のひっかけ回避：典型的な誤答パターン{" "}
                        {filteredPitfalls.length} 選
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredPitfalls.map((pit) => (
                        <div
                          key={pit.id}
                          className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-xs space-y-2.5"
                        >
                          <div className="flex items-start space-x-2">
                            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 mt-0.5">
                              ✕ ひっかけ
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                              {pit.trap}
                            </span>
                          </div>
                          <p className="text-xs text-rose-900/80 bg-rose-50/60 rounded-lg px-3 py-2 leading-relaxed">
                            <strong>なぜ誤りか：</strong>
                            {pit.whyWrong}
                          </p>
                          <p className="text-xs text-emerald-950 bg-emerald-50/70 rounded-lg px-3 py-2 leading-relaxed">
                            <strong>正解の考え方：</strong>
                            {pit.correctApproach}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 試験に出る！AWS 重要数値・制限値マスター */}
                {filteredKeyLimits.length > 0 && (
                  <section className="space-y-3 pt-2">
                    <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                      <Gauge size={17} className="text-indigo-600 shrink-0" />
                      <span>
                        {meta.shortCode} 試験に出る！AWS 重要数値・制限値マスター{" "}
                        {filteredKeyLimits.length} 選
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {filteredKeyLimits.map((lim) => (
                        <div
                          key={lim.id}
                          className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-1.5 min-w-0"
                        >
                          <div className="text-[11px] font-bold text-indigo-600">{lim.service}</div>
                          <div className="text-xs sm:text-sm font-mono font-black text-slate-900 break-words">
                            {lim.limitValue}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{lim.detail}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* Tab 3: フラッシュカード暗記 */}
            {activeTab === "flashcards" && (
              <div
                role="tabpanel"
                id="aws-panel-flashcards"
                aria-labelledby="aws-tab-flashcards"
              >
                <CertificationFlashcards
                  key={activeCertId}
                  items={quickLookup}
                  masteredKeywords={validMasteredCards}
                  onToggleMastered={handleToggleMasteredCard}
                  onResetMastered={handleResetMasteredCards}
                  badgeText={`${meta.shortCode} 直前暗記フラッシュカード`}
                  title={`${meta.shortCode} 要件キーワード → 推奨サービス 即答トレーニング`}
                  promptLabel="次の要件に最適な AWS サービス・機能は？"
                  answerLabel="推奨サービス・設計"
                />
              </div>
            )}

            {/* Tab 4: 実践演習クイズ */}
            {activeTab === "quiz" && (
              <div role="tabpanel" id="aws-panel-quiz" aria-labelledby="aws-tab-quiz">
                <CertificationPracticeQuiz
                  key={`${activeCertId}-${quizDomainTarget}`}
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

            {/* Tab 5: 学習ロードマップ・公式リソース */}
            {activeTab === "resources" && (
              <div
                role="tabpanel"
                id="aws-panel-resources"
                aria-labelledby="aws-tab-resources"
                className="space-y-8"
              >
                <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {meta.shortCode} 合格までの標準学習ステップ
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      丸暗記ではなく「要件（セキュリティ・可用性・性能・コスト）から最適サービスを選ぶ力」を養う手順です。
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        step: "STEP 1",
                        title: meta.roadmapSteps.step1Title,
                        desc: meta.roadmapSteps.step1Desc,
                        status: step1Done ? "基礎完了" : "学習中",
                        done: step1Done,
                      },
                      {
                        step: "STEP 2",
                        title: meta.roadmapSteps.step2Title,
                        desc: meta.roadmapSteps.step2Desc,
                        status: `${doneTopicsCount}/${totalTopics} トピック`,
                        done: totalTopics > 0 && doneTopicsCount === totalTopics,
                      },
                      {
                        step: "STEP 3",
                        title: "カード暗記 & シナリオ演習",
                        desc: "フラッシュカードで即答力を鍛え、実践演習クイズや AWS Skill Builder で誤答理由を言語化する。",
                        status: `カード ${validMasteredCards.length}/${quickLookup.length} ・ 演習 ${correctCount}/${practiceQuestions.length}`,
                        done:
                          quickLookup.length > 0 &&
                          validMasteredCards.length === quickLookup.length &&
                          correctCount >=
                            Math.ceil(
                              practiceQuestions.length * (meta.passingConfig.passingPct / 100)
                            ),
                      },
                      {
                        step: "STEP 4",
                        title: "模擬試験で時間配分確認",
                        desc: meta.roadmapSteps.step4Desc,
                        status:
                          progress.mockExamHistory.length > 0
                            ? `最高 ${Math.max(...progress.mockExamHistory.map((m) => m.scaledScore))}点`
                            : "未受験",
                        done: progress.mockExamHistory.some(
                          (m) => m.scaledScore >= meta.passingConfig.passingScore
                        ),
                      },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className={`rounded-xl border p-4 space-y-2 ${
                          item.done
                            ? "border-emerald-200 bg-emerald-50/40"
                            : "border-slate-200 bg-slate-50/60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300">
                            {item.step}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.done
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-200/70 text-slate-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 試験本番・直前チェックリスト */}
                <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {meta.shortCode} 試験本番・直前チェックリスト（時間配分＆受験のコツ）
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {meta.examDayChecklist.subtitle}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                    {meta.examDayChecklist.tips.map((tip) => (
                      <div
                        key={tip.title}
                        className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-1.5"
                      >
                        <div className="font-black text-slate-900 text-xs sm:text-sm">
                          {tip.title}
                        </div>
                        <p className="leading-relaxed text-slate-600">{tip.body}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 定番アーキテクチャ設計パターン */}
                <section className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {meta.shortCode} 定番アーキテクチャ設計パターン{" "}
                      {architecturePatterns.length}選
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      試験で頻出する標準構成のつながり（フロー）と設計上の勘所を押さえましょう。
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {architecturePatterns.map((pat) => (
                      <div
                        key={pat.id}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-sm sm:text-base font-black text-slate-900">
                            {pat.title}
                          </h4>
                          <span className="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {pat.badge}
                          </span>
                        </div>

                        {/* フロー図チェーン */}
                        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-200/70 rounded-xl p-3">
                          {pat.flow.map((node, idx) => (
                            <div key={`${node}-${idx}`} className="flex items-center gap-1.5">
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

                {/* 設計判断の軸：AWS Well-Architected 6つの柱 */}
                <section className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      設計判断の軸：AWS Well-Architected 6つの柱
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      問題文が「どの柱を最優先に問うているか」を見抜くと、正解の選択肢を迷わず選べます。
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {saaWellArchitectedPillars.map((pillar) => (
                      <div
                        key={pillar.id}
                        className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2.5"
                      >
                        <div>
                          <div className="text-[10px] font-mono font-bold text-indigo-600 uppercase">
                            {pillar.englishName}
                          </div>
                          <h4 className="text-sm font-black text-slate-900">{pillar.name}</h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {pillar.examKeywords.map((kw) => (
                            <span
                              key={kw}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/70"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{pillar.focus}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-black text-slate-900">
                    AWS 公式学習リソース（{meta.shortCode}）
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {officialResources.map((res, idx) => (
                      <a
                        key={res.url}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playCyberClick()}
                        onMouseEnter={() => playCyberHover()}
                        className={`group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between gap-3 ${
                          officialResources.length % 2 === 1 && idx === 0 ? "md:col-span-2" : ""
                        }`}
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
          </>
        )}

        {/* 学習進捗バックアップ・復元 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <Download size={14} className="text-indigo-600 shrink-0" />
              <span className="font-bold text-slate-800">
                学習データの引き継ぎ・バックアップ（{meta.shortCode}）
              </span>
              <span className="text-slate-500 hidden sm:inline">
                （別PCや別ブラウザへ学習記録・マイメモを移行できます）
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {hasAnyNotes && (
                <button
                  type="button"
                  onClick={handleCopyNotesMarkdown}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-800 transition-colors cursor-pointer"
                >
                  {copiedNotes ? (
                    <>
                      <Check size={13} className="text-emerald-600" />
                      <span className="text-emerald-700">メモをコピーしました</span>
                    </>
                  ) : (
                    <>
                      <StickyNote size={13} />
                      <span>マイメモをMDコピー</span>
                    </>
                  )}
                </button>
              )}

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
                aria-expanded={showBackupPanel}
                aria-controls="aws-backup-panel"
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

          {!showBackupPanel && importMessage && (
            <div
              role="status"
              aria-live="polite"
              className={`text-xs font-semibold ${
                importMessage.isError ? "text-rose-700" : "text-indigo-700"
              }`}
            >
              {importMessage.text}
            </div>
          )}

          {showBackupPanel && (
            <div id="aws-backup-panel" className="pt-2 border-t border-slate-100 space-y-2">
              <label htmlFor="aws-backup-json-input" className="sr-only">
                {meta.shortCode} の学習進捗バックアップ JSON 入力
              </label>
              <textarea
                id="aws-backup-json-input"
                value={backupInput}
                onChange={(e) => setBackupInput(e.target.value)}
                rows={2}
                placeholder={`コピーした ${meta.shortCode} の学習進捗 JSON をここに貼り付けて「復元を実行」を押してください...`}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
              <div className="flex items-center justify-between gap-2">
                <span
                  role="status"
                  aria-live="polite"
                  className={`text-xs font-semibold ${
                    importMessage?.isError ? "text-rose-700" : "text-indigo-700"
                  }`}
                >
                  {importMessage?.text ?? ""}
                </span>
                <button
                  type="button"
                  disabled={!backupInput.trim()}
                  onClick={handleRestoreBackup}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 cursor-pointer shrink-0"
                >
                  復元を実行
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
