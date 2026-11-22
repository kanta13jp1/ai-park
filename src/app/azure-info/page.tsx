"use client";

import { useEffect, useState, useMemo, type KeyboardEvent } from "react";
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
  Brain,
  Eye,
  MessageSquare,
  Bot,
  Activity,
  BarChart3,
  Lock,
  KeyRound,
  FileText,
  Workflow,
  Container,
  FileCheck2,
  HardDrive,
  Zap,
  FileDown,
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
  CertPassingConfig,
  CertQuestion,
} from "@/components/certification/types";
import type {
  AzureDomain,
  AzureComparisonTable,
  AzureArchitecturePattern,
  AzurePitfall,
  AzureKeyFact,
  AzureOfficialResource,
} from "@/data/azure-types";
import {
  az900ExamFacts,
  az900Domains,
  az900Comparisons,
  az900Patterns,
  az900Pitfalls,
  az900KeyFacts,
  az900QuickLookup,
  az900PracticeQuestions,
  az900OfficialResources,
} from "@/data/azure-az900";
import {
  ai900ExamFacts,
  ai900Domains,
  ai900Comparisons,
  ai900Patterns,
  ai900Pitfalls,
  ai900KeyFacts,
  ai900QuickLookup,
  ai900PracticeQuestions,
  ai900OfficialResources,
} from "@/data/azure-ai900";
import {
  dp900ExamFacts,
  dp900Domains,
  dp900Comparisons,
  dp900Patterns,
  dp900Pitfalls,
  dp900KeyFacts,
  dp900QuickLookup,
  dp900PracticeQuestions,
  dp900OfficialResources,
} from "@/data/azure-dp900";
import {
  sc900ExamFacts,
  sc900Domains,
  sc900Comparisons,
  sc900Patterns,
  sc900Pitfalls,
  sc900KeyFacts,
  sc900QuickLookup,
  sc900PracticeQuestions,
  sc900OfficialResources,
} from "@/data/azure-sc900";
import {
  az104ExamFacts,
  az104Domains,
  az104Comparisons,
  az104Patterns,
  az104Pitfalls,
  az104KeyFacts,
  az104QuickLookup,
  az104PracticeQuestions,
  az104OfficialResources,
} from "@/data/azure-az104";
import {
  ai103ExamFacts,
  ai103Domains,
  ai103Comparisons,
  ai103Patterns,
  ai103Pitfalls,
  ai103KeyFacts,
  ai103QuickLookup,
  ai103PracticeQuestions,
  ai103OfficialResources,
} from "@/data/azure-ai103";
import {
  ai200ExamFacts,
  ai200Domains,
  ai200Comparisons,
  ai200Patterns,
  ai200Pitfalls,
  ai200KeyFacts,
  ai200QuickLookup,
  ai200PracticeQuestions,
  ai200OfficialResources,
} from "@/data/azure-ai200";
import {
  az305ExamFacts,
  az305Domains,
  az305Comparisons,
  az305Patterns,
  az305Pitfalls,
  az305KeyFacts,
  az305QuickLookup,
  az305PracticeQuestions,
  az305OfficialResources,
} from "@/data/azure-az305";
import { playCyberClick, playCyberHover } from "@/lib/sound";
import { normalizeAzureSearchQuery } from "@/lib/azure-search";

type AzureCertId = "az900" | "ai900" | "dp900" | "sc900" | "az104" | "ai103" | "ai200" | "az305";
type TabId = "domains" | "comparisons" | "flashcards" | "quiz" | "resources";

interface AzureCertConfig {
  id: AzureCertId;
  label: string;
  shortLabel: string;
  badgeText: string;
  headline: string;
  description: string;
  storageKey: string;
  examFacts: CertExamFact[];
  domains: AzureDomain[];
  comparisons: AzureComparisonTable[];
  patterns: AzureArchitecturePattern[];
  pitfalls: AzurePitfall[];
  keyFacts: AzureKeyFact[];
  quickLookup: CertFlashcardItem[];
  practiceQuestions: CertQuestion[];
  officialResources: AzureOfficialResource[];
  defaultExpanded: Record<string, boolean>;
  passingConfig: CertPassingConfig;
  quizBadgeLabel: string;
  flashcardTitle: string;
  quickSearchChips: string[];
}

const CERT_CONFIG: Record<AzureCertId, AzureCertConfig> = {
  az900: {
    id: "az900",
    label: "Azure Fundamentals (AZ-900)",
    shortLabel: "AZ-900",
    badgeText: "MICROSOFT AZURE FUNDAMENTALS STUDY HUB",
    headline: "Azure Fundamentals（AZ-900）",
    description:
      "クラウドの基本概念・責任共有モデル・Azure コアサービス（Compute / Network / Storage / Entra ID）・コスト管理とガバナンスを網羅した入門認定試験の学習ハブです。進捗やメモはブラウザに自動保存されます。",
    storageKey: "ai-park-azure-az900-progress-v1",
    examFacts: az900ExamFacts,
    domains: az900Domains,
    comparisons: az900Comparisons,
    patterns: az900Patterns,
    pitfalls: az900Pitfalls,
    keyFacts: az900KeyFacts,
    quickLookup: az900QuickLookup,
    practiceQuestions: az900PracticeQuestions,
    officialResources: az900OfficialResources,
    defaultExpanded: { "az900-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam AZ-900 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure AZ-900 演習",
    flashcardTitle: "AZ-900 要件・キーワード → Microsoft Azure サービス即答トレーニング",
    quickSearchChips: [
      "Azure VM",
      "App Service",
      "Azure Functions",
      "Entra ID",
      "Azure Policy",
      "Blob Storage",
    ],
  },
  ai900: {
    id: "ai900",
    label: "Azure AI Fundamentals (AI-900)",
    shortLabel: "AI-900",
    badgeText: "MICROSOFT AZURE AI FUNDAMENTALS STUDY HUB",
    headline: "Azure AI Fundamentals（AI-900）",
    description:
      "責任ある AI の 6 原則・機械学習（AutoML / 評価指標）・コンピューター ビジョン・自然言語処理（NLP）・Azure OpenAI Service / 生成 AI ワークロードを体系的に学ぶ学習ハブです。",
    storageKey: "ai-park-azure-ai900-progress-v1",
    examFacts: ai900ExamFacts,
    domains: ai900Domains,
    comparisons: ai900Comparisons,
    patterns: ai900Patterns,
    pitfalls: ai900Pitfalls,
    keyFacts: ai900KeyFacts,
    quickLookup: ai900QuickLookup,
    practiceQuestions: ai900PracticeQuestions,
    officialResources: ai900OfficialResources,
    defaultExpanded: { "ai900-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam AI-900 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure AI-900 演習",
    flashcardTitle: "AI-900 AIワークロード要件 → Azure AI サービス即答トレーニング",
    quickSearchChips: [
      "Azure OpenAI",
      "Azure AI Foundry",
      "Document Intelligence",
      "Azure AI Vision",
      "Azure AI Language",
      "AutoML",
      "RAG",
    ],
  },
  dp900: {
    id: "dp900",
    label: "Azure Data Fundamentals (DP-900)",
    shortLabel: "DP-900",
    badgeText: "MICROSOFT AZURE DATA FUNDAMENTALS STUDY HUB",
    headline: "Azure Data Fundamentals（DP-900）",
    description:
      "コアデータ概念（構造化/半構造化/非構造化・OLTP/OLAP）・Azure SQL / PostgreSQL・Blob / ADLS Gen2 / Cosmos DB・Azure Data Factory / Synapse / Microsoft Fabric / Power BI を網羅したデータ基礎認定試験の学習ハブです。",
    storageKey: "ai-park-azure-dp900-progress-v1",
    examFacts: dp900ExamFacts,
    domains: dp900Domains,
    comparisons: dp900Comparisons,
    patterns: dp900Patterns,
    pitfalls: dp900Pitfalls,
    keyFacts: dp900KeyFacts,
    quickLookup: dp900QuickLookup,
    practiceQuestions: dp900PracticeQuestions,
    officialResources: dp900OfficialResources,
    defaultExpanded: { "dp900-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam DP-900 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure DP-900 演習",
    flashcardTitle: "DP-900 データ要件・ユースケース → Microsoft Azure データサービス即答トレーニング",
    quickSearchChips: [
      "Azure SQL",
      "Cosmos DB",
      "ADLS Gen2",
      "Microsoft Fabric",
      "Synapse",
      "Power BI",
    ],
  },
  sc900: {
    id: "sc900",
    label: "Security Fundamentals (SC-900)",
    shortLabel: "SC-900",
    badgeText: "MICROSOFT SECURITY, COMPLIANCE & IDENTITY STUDY HUB",
    headline: "Security, Compliance, and Identity Fundamentals（SC-900）",
    description:
      "ゼロトラスト原則・Microsoft Entra ID（MFA / 条件付きアクセス / PIM）・Microsoft Defender for Cloud / Sentinel / Defender XDR・Microsoft Purview による情報保護とコンプライアンスを学ぶ基礎学習ハブです。",
    storageKey: "ai-park-azure-sc900-progress-v1",
    examFacts: sc900ExamFacts,
    domains: sc900Domains,
    comparisons: sc900Comparisons,
    patterns: sc900Patterns,
    pitfalls: sc900Pitfalls,
    keyFacts: sc900KeyFacts,
    quickLookup: sc900QuickLookup,
    practiceQuestions: sc900PracticeQuestions,
    officialResources: sc900OfficialResources,
    defaultExpanded: { "sc900-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam SC-900 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure SC-900 演習",
    flashcardTitle: "SC-900 セキュリティ・ID・コンプライアンス要件 → Microsoft ソリューション即答トレーニング",
    quickSearchChips: [
      "Entra ID",
      "Conditional Access",
      "Defender for Cloud",
      "Microsoft Sentinel",
      "Microsoft Purview",
      "Zero Trust",
    ],
  },
  az104: {
    id: "az104",
    label: "Azure Administrator (AZ-104)",
    shortLabel: "AZ-104",
    badgeText: "MICROSOFT AZURE ADMINISTRATOR STUDY HUB",
    headline: "Azure Administrator Associate（AZ-104）",
    description:
      "Entra ID・RBAC・Azure Policy・ストレージ冗長性＆SAS・ARM/Bicep・VM/VMSS/AKS/App Service・VNet/NSG/VPN・Azure Monitor/Backup の運用管理を学ぶ実践学習ハブです。",
    storageKey: "ai-park-azure-az104-progress-v1",
    examFacts: az104ExamFacts,
    domains: az104Domains,
    comparisons: az104Comparisons,
    patterns: az104Patterns,
    pitfalls: az104Pitfalls,
    keyFacts: az104KeyFacts,
    quickLookup: az104QuickLookup,
    practiceQuestions: az104PracticeQuestions,
    officialResources: az104OfficialResources,
    defaultExpanded: { "az104-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam AZ-104 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure AZ-104 演習",
    flashcardTitle: "AZ-104 運用要件 → Azure 管理機能・CLI/Bicep 即答トレーニング",
    quickSearchChips: [
      "RBAC",
      "Azure Policy",
      "Bicep",
      "VNet ピアリング",
      "NSG",
      "AzCopy",
      "Azure Backup",
    ],
  },
  ai103: {
    id: "ai103",
    label: "AI Apps & Agents (AI-103)",
    shortLabel: "AI-103",
    badgeText: "MICROSOFT AZURE AI APPS & AGENTS STUDY HUB",
    headline: "Azure AI Apps & Agents Developer（AI-103）",
    description:
      "旧 Exam AI-102（2026年6月廃止）の後継試験として刷新された AI アプリケーション＆エージェント開発認定の学習ハブです。Microsoft Foundry・Agent Service・Azure AI Search (RAG)・Vision / Language / Speech・Document Intelligence・Content Safety の設計と実装を網羅します。",
    storageKey: "ai-park-azure-ai103-progress-v1",
    examFacts: ai103ExamFacts,
    domains: ai103Domains,
    comparisons: ai103Comparisons,
    patterns: ai103Patterns,
    pitfalls: ai103Pitfalls,
    keyFacts: ai103KeyFacts,
    quickLookup: ai103QuickLookup,
    practiceQuestions: ai103PracticeQuestions,
    officialResources: ai103OfficialResources,
    defaultExpanded: { "ai103-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam AI-103 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure AI-103 演習",
    flashcardTitle: "AI-103 生成AI・エージェント・情報抽出要件 → Microsoft Foundry / Azure AI 即答トレーニング",
    quickSearchChips: [
      "Microsoft Foundry",
      "Agent Service",
      "Azure AI Search",
      "Document Intelligence",
      "Content Safety",
      "RAG",
    ],
  },
  ai200: {
    id: "ai200",
    label: "AI Cloud Developer (AI-200)",
    shortLabel: "AI-200",
    badgeText: "MICROSOFT AZURE AI CLOUD DEVELOPER STUDY HUB",
    headline: "Azure AI Cloud Developer（AI-200）",
    description:
      "旧 Exam AZ-204（2026年7月廃止）の後継試験として刷新されたクラウドネイティブ＆AI 基盤開発認定の学習ハブです。Container Apps / AKS・Cosmos DB / PostgreSQL (pgvector) / Managed Redis・Service Bus / Event Grid / Functions・Key Vault / OpenTelemetry 観測性を体系的に学びます。",
    storageKey: "ai-park-azure-ai200-progress-v1",
    examFacts: ai200ExamFacts,
    domains: ai200Domains,
    comparisons: ai200Comparisons,
    patterns: ai200Patterns,
    pitfalls: ai200Pitfalls,
    keyFacts: ai200KeyFacts,
    quickLookup: ai200QuickLookup,
    practiceQuestions: ai200PracticeQuestions,
    officialResources: ai200OfficialResources,
    defaultExpanded: { "ai200-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam AI-200 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure AI-200 演習",
    flashcardTitle: "AI-200 コンテナ・ベクターDB・イベント・観測性要件 → Azure 開発サービス即答トレーニング",
    quickSearchChips: [
      "Container Apps",
      "Cosmos DB",
      "pgvector",
      "Service Bus",
      "Event Grid",
      "Key Vault",
      "OpenTelemetry",
    ],
  },
  az305: {
    id: "az305",
    label: "Azure Solutions Architect (AZ-305)",
    shortLabel: "AZ-305",
    badgeText: "MICROSOFT AZURE SOLUTIONS ARCHITECT EXPERT STUDY HUB",
    headline: "Azure Solutions Architect Expert（AZ-305）",
    description:
      "ランディングゾーン（CAF）・Entra ID / Key Vault 設計・Azure SQL / Cosmos DB 整合性設計・RPO/RTO & 高可用性・ハブ＆スポーク / Virtual WAN・Well-Architected 設計力を問う上級学習ハブです。",
    storageKey: "ai-park-azure-az305-progress-v1",
    examFacts: az305ExamFacts,
    domains: az305Domains,
    comparisons: az305Comparisons,
    patterns: az305Patterns,
    pitfalls: az305Pitfalls,
    keyFacts: az305KeyFacts,
    quickLookup: az305QuickLookup,
    practiceQuestions: az305PracticeQuestions,
    officialResources: az305OfficialResources,
    defaultExpanded: { "az305-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam AZ-305 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure AZ-305 演習",
    flashcardTitle: "AZ-305 設計要件・制約 → Azure アーキテクチャ選択即答トレーニング",
    quickSearchChips: [
      "Cosmos DB",
      "Azure SQL",
      "Front Door",
      "Virtual WAN",
      "Private Link",
      "Managed ID",
      "Savings Plan",
    ],
  },
};

interface AzureProgress {
  completedTopics: string[];
  quizAnswers: Record<string, number[]>;
  bookmarkedQuestions: string[];
  masteredCards: string[];
  topicNotes: Record<string, string>;
  mockExamHistory: CertMockExamRecord[];
}

const DEFAULT_PROGRESS: AzureProgress = {
  completedTopics: [],
  quizAnswers: {},
  bookmarkedQuestions: [],
  masteredCards: [],
  topicNotes: {},
  mockExamHistory: [],
};

const DOMAIN_ICONS: Record<string, typeof Cloud> = {
  "az900-domain-1": Cloud,
  "az900-domain-2": Layers,
  "az900-domain-3": ShieldCheck,
  "ai900-domain-1": Sparkles,
  "ai900-domain-2": Brain,
  "ai900-domain-3": Eye,
  "ai900-domain-4": MessageSquare,
  "ai900-domain-5": Bot,
  "dp900-domain-1": Layers,
  "dp900-domain-2": Database,
  "dp900-domain-3": HardDrive,
  "dp900-domain-4": BarChart3,
  "sc900-domain-1": ShieldCheck,
  "sc900-domain-2": KeyRound,
  "sc900-domain-3": Lock,
  "sc900-domain-4": FileCheck2,
  "az104-domain-1": ShieldCheck,
  "az104-domain-2": Database,
  "az104-domain-3": Cpu,
  "az104-domain-4": Network,
  "az104-domain-5": Gauge,
  "ai103-domain-1": Compass,
  "ai103-domain-2": Bot,
  "ai103-domain-3": Eye,
  "ai103-domain-4": MessageSquare,
  "ai103-domain-5": FileText,
  "ai200-domain-1": Container,
  "ai200-domain-2": Database,
  "ai200-domain-3": Workflow,
  "ai200-domain-4": Activity,
  "az305-domain-1": ShieldCheck,
  "az305-domain-2": Database,
  "az305-domain-3": Activity,
  "az305-domain-4": Layers,
};

const ACCENT_STYLES: Record<
  AzureDomain["accentColor"],
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
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    bar: "bg-sky-500",
    border: "border-sky-200/80",
    iconBg: "bg-sky-50 text-sky-600 border-sky-100",
  },
};

const COMPARISON_CATEGORIES = [
  "すべて",
  "コンピュート",
  "ストレージ・DB",
  "AI・機械学習",
  "ネットワーク・セキュリティ",
  "ガバナンス・監視・コスト",
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

function loadAzureProgress(storageKey: string): AzureProgress {
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

export default function AzureInfoPage() {
  const [certId, setCertId] = useState<AzureCertId>("az900");
  const config = CERT_CONFIG[certId];

  const [activeTab, setActiveTab] = useState<TabId>("domains");
  const [progressByCert, setProgressByCert] = useState<Record<AzureCertId, AzureProgress>>({
    az900: DEFAULT_PROGRESS,
    ai900: DEFAULT_PROGRESS,
    dp900: DEFAULT_PROGRESS,
    sc900: DEFAULT_PROGRESS,
    az104: DEFAULT_PROGRESS,
    ai103: DEFAULT_PROGRESS,
    ai200: DEFAULT_PROGRESS,
    az305: DEFAULT_PROGRESS,
  });
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>(
    CERT_CONFIG.az900.defaultExpanded
  );
  const [confirmReset, setConfirmReset] = useState(false);

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
  const [importMessage, setImportMessage] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setProgressByCert({
        az900: loadAzureProgress(CERT_CONFIG.az900.storageKey),
        ai900: loadAzureProgress(CERT_CONFIG.ai900.storageKey),
        dp900: loadAzureProgress(CERT_CONFIG.dp900.storageKey),
        sc900: loadAzureProgress(CERT_CONFIG.sc900.storageKey),
        az104: loadAzureProgress(CERT_CONFIG.az104.storageKey),
        ai103: loadAzureProgress(CERT_CONFIG.ai103.storageKey),
        ai200: loadAzureProgress(CERT_CONFIG.ai200.storageKey),
        az305: loadAzureProgress(CERT_CONFIG.az305.storageKey),
      });
    });
  }, []);

  const progress = progressByCert[certId];

  const saveProgress = (next: AzureProgress) => {
    setProgressByCert((prev) => ({ ...prev, [certId]: next }));
    try {
      window.localStorage.setItem(config.storageKey, JSON.stringify(next));
    } catch {
      // localStorage quota exceeded / disabled
    }
  };

  const handleSwitchCert = (nextCert: AzureCertId) => {
    if (nextCert === certId) return;
    playCyberClick();
    setCertId(nextCert);
    setExpandedDomains(CERT_CONFIG[nextCert].defaultExpanded);
    setTopicQuery("");
    setCompCategory("すべて");
    setCompQuery("");
    setQuizDomainTarget("all");
    setConfirmReset(false);
    setImportMessage(null);
  };

  const toggleTopic = (topicId: string) => {
    playCyberClick();
    const exists = progress.completedTopics.includes(topicId);
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
    if (!confirmReset) {
      playCyberClick();
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    playCyberClick();
    saveProgress(DEFAULT_PROGRESS);
    setConfirmReset(false);
  };

  const handleExpandAllDomains = (open: boolean) => {
    playCyberClick();
    const next: Record<string, boolean> = {};
    for (const d of config.domains) {
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
    setCompCategory("すべて");
    setCompQuery(normalizeAzureSearchQuery(keyword));
    setActiveTab("comparisons");
  };

  const handleExportNotesMarkdown = () => {
    playCyberClick();
    const lines: string[] = [
      `# Azure ${config.shortLabel} 学習メモ`,
      "",
      `- エクスポート日時: ${new Date().toLocaleString("ja-JP")}`,
      "",
    ];
    let exportedCount = 0;

    for (const domain of config.domains) {
      const domainNotes = domain.topics
        .map((t) => ({ topic: t, note: (progress.topicNotes[t.id] ?? "").trim() }))
        .filter((item) => item.note.length > 0);
      if (domainNotes.length === 0) continue;

      lines.push(`## Domain ${domain.number}: ${domain.title}`, "");
      for (const { topic, note } of domainNotes) {
        exportedCount++;
        lines.push(`### Topic ${topic.code}: ${topic.title}`);
        lines.push(`- サービス・機能: ${topic.services.join(", ")}`);
        lines.push(`- 学習メモ:\n\n${note}`);
        lines.push("", `> 試験のポイント: ${topic.examTip}`, "");
      }
    }

    if (exportedCount === 0) return;

    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `azure-${config.id}-notes.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setImportMessage(`${config.shortLabel} の学習メモ（${exportedCount} 件）を Markdown 出力しました。`);
    setTimeout(() => setImportMessage(null), 3000);
  };

  const handleFocusDomain = (domainId: string) => {
    playCyberClick();
    setExpandedDomains((prev) => ({ ...prev, [domainId]: true }));
    setTimeout(() => {
      document.getElementById(domainId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
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
      const restored: AzureProgress = {
        completedTopics: normalizeStringArray(parsed.completedTopics),
        quizAnswers: normalizeQuizAnswers(parsed.quizAnswers),
        bookmarkedQuestions: normalizeStringArray(parsed.bookmarkedQuestions),
        masteredCards: normalizeStringArray(parsed.masteredCards),
        topicNotes: normalizeStringRecord(parsed.topicNotes),
        mockExamHistory: normalizeMockExamHistory(parsed.mockExamHistory),
      };
      saveProgress(restored);
      setBackupInput("");
      setImportMessage(`${config.shortLabel} の学習データを復元しました。`);
      setTimeout(() => setImportMessage(null), 3000);
    } catch {
      setImportMessage("JSON形式が正しくありません。コピーしたバックアップ文字列を確認してください。");
    }
  };

  const allTopics = useMemo(() => config.domains.flatMap((d) => d.topics), [config.domains]);
  const completedTopicCount = allTopics.filter((t) =>
    progress.completedTopics.includes(t.id)
  ).length;
  const topicPct = allTopics.length > 0 ? Math.round((completedTopicCount / allTopics.length) * 100) : 0;

  const answeredQuizCount = Object.keys(progress.quizAnswers).length;
  const correctQuizCount = config.practiceQuestions.filter((q) =>
    isQuestionCorrect(q, progress.quizAnswers[q.id])
  ).length;

  const masteredCardCount = progress.masteredCards.length;
  const notedTopicCount = Object.values(progress.topicNotes).filter((v) => v.trim().length > 0).length;

  const totalActions =
    allTopics.length + config.practiceQuestions.length + config.quickLookup.length;
  const doneActions = completedTopicCount + answeredQuizCount + masteredCardCount;
  const overallPct = totalActions > 0 ? Math.round((doneActions / totalActions) * 100) : 0;

  const quizDomains = useMemo(
    () =>
      config.domains.map((d) => ({
        id: d.id,
        number: d.number,
        shortLabel: `D${d.number}`,
        filterLabel: `${d.number}: ${d.title}`,
      })),
    [config.domains]
  );

  const filteredDomains = useMemo(() => {
    const q = topicQuery.trim().toLowerCase();
    return config.domains
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
    config.domains,
    topicQuery,
    onlyIncompleteTopics,
    onlyWithNotesTopics,
    progress.completedTopics,
    progress.topicNotes,
  ]);

  const availableComparisonCategories = useMemo(
    () =>
      COMPARISON_CATEGORIES.filter(
        (cat) => cat === "すべて" || config.comparisons.some((c) => c.category === cat)
      ),
    [config.comparisons]
  );

  const filteredComparisons = useMemo(() => {
    const q = compQuery.trim().toLowerCase();
    return config.comparisons.filter((comp) => {
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
  }, [config.comparisons, compCategory, compQuery]);

  const filteredPatterns = useMemo(() => {
    const q = compQuery.trim().toLowerCase();
    if (!q) return config.patterns;
    return config.patterns.filter((pat) =>
      [pat.title, pat.badge, pat.summary, ...pat.flow, ...pat.keyDesignPoints]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [config.patterns, compQuery]);

  const filteredPitfalls = useMemo(() => {
    const q = compQuery.trim().toLowerCase();
    if (!q) return config.pitfalls;
    return config.pitfalls.filter((pit) =>
      [pit.trap, pit.whyWrong, pit.correctApproach].join(" ").toLowerCase().includes(q)
    );
  }, [config.pitfalls, compQuery]);

  const filteredKeyFacts = useMemo(() => {
    const q = compQuery.trim().toLowerCase();
    if (!q) return config.keyFacts;
    return config.keyFacts.filter((kf) =>
      [kf.target, kf.value, kf.detail].join(" ").toLowerCase().includes(q)
    );
  }, [config.keyFacts, compQuery]);

  const filteredQuickLookup = useMemo(() => {
    const q = compQuery.trim().toLowerCase();
    if (!q) return [];
    return config.quickLookup.filter((item) =>
      [item.keyword, item.category, item.recommended, item.reason]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [config.quickLookup, compQuery]);

  const tabs: { id: TabId; label: string; icon: typeof BookOpen; badge?: string }[] = [
    {
      id: "domains",
      label: "トピック別学習",
      icon: BookOpen,
      badge: `${completedTopicCount}/${allTopics.length}`,
    },
    { id: "comparisons", label: "比較・設計パターン", icon: TableProperties },
    {
      id: "flashcards",
      label: "暗記カード",
      icon: Layers2,
      badge: `${masteredCardCount}/${config.quickLookup.length}`,
    },
    {
      id: "quiz",
      label: "練習問題・模試",
      icon: HelpCircle,
      badge: `${correctQuizCount}/${config.practiceQuestions.length}`,
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
        document.getElementById(`azure-tab-${nextId}`)?.focus();
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen min-w-0">
      <HeroBanner
        title="Azure・Microsoft Azure情報局"
        subtitle="AZ-900 / AI-900 / DP-900 / SC-900 / AZ-104 / AI-103 / AI-200 / AZ-305（全8資格）統合学習ハブ"
      />

      <div className="max-w-6xl w-full min-w-0 mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          title="🚧 一部工事中・学習ハブ先行公開"
          message="現在 Microsoft Azure 認定資格（AZ-900 / AI-900 / DP-900 / SC-900 / AZ-104 / AI-103 / AI-200 / AZ-305 全8資格）の公式試験ガイドに基づく学習ハブを掲載しています（AI-103 / AI-200 は旧 AI-102 / AZ-204 の後継試験）。社内の Azure 利用ルールや資格取得支援制度等は準備中（確定次第掲載）です。"
          statusType="construction"
        />

        {/* 資格レベル切り替え（全8資格） */}
        <section
          aria-label="学習資格選択"
          className="flex flex-col gap-3 bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs min-w-0"
        >
          <div className="flex items-center space-x-2 px-1">
            <Cloud size={16} className="text-sky-600" />
            <span className="text-xs sm:text-sm font-black text-slate-800">学習資格選択（全8資格）</span>
          </div>
          <div
            role="group"
            aria-label="対象資格の切り替え"
            className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/70"
          >
            {(["az900", "ai900", "dp900", "sc900", "az104", "ai103", "ai200", "az305"] as const).map((id) => {
              const item = CERT_CONFIG[id];
              const active = certId === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleSwitchCert(id)}
                  onMouseEnter={() => playCyberHover()}
                  className={`px-3 py-2 rounded-lg text-xs font-black transition-all cursor-pointer lg:whitespace-nowrap max-w-full break-words text-left ${
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
        </section>

        {/* 学習ステータス HUD バナー */}
        <TiltCard maxTilt={2} glareOpacity={0.05} className="rounded-3xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 border border-sky-700/50 p-5 sm:p-8 text-white shadow-xl"
          >
            <div className="absolute -top-10 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-300 border border-sky-400/30 tracking-wider">
                    <Cloud size={12} />
                    <span>{config.badgeText}</span>
                  </span>
                  <span className="text-xs text-slate-300">
                    {allTopics.length} トピック ・ 比較表 {config.comparisons.length} 種 ・ カード{" "}
                    {config.quickLookup.length} 枚 ・ 演習 {config.practiceQuestions.length} 問
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white break-words">
                  <span className="inline-block">{config.headline}</span>
                  <span className="inline-block ml-1">合格対策学習ハブ</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {config.description}
                </p>
              </div>

              <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2.5 lg:min-w-[360px] min-w-0">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">トピック習得</div>
                  <div className="text-xl sm:text-2xl font-black text-sky-300 font-mono">
                    {topicPct}%
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {completedTopicCount} / {allTopics.length}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">暗記カード</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    {masteredCardCount} / {config.quickLookup.length}
                  </div>
                  <div className="text-[11px] text-slate-400">枚習得</div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5 min-w-0">
                  <div className="text-[11px] text-slate-400 font-semibold">演習問題</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                    {correctQuizCount} / {config.practiceQuestions.length}
                  </div>
                  <div className="text-[11px] text-slate-400">問正解</div>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* 試験概要カード */}
        <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {config.examFacts.map((fact) => (
            <div
              key={`${config.id}-${fact.label}`}
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
                  <Award className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    {config.shortLabel} 総合学習進捗（トピック・暗記カード・練習問題）
                  </span>
                </span>
                <span className="font-mono text-sky-700 shrink-0">{overallPct}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleExportNotesMarkdown}
                disabled={notedTopicCount === 0}
                title={
                  notedTopicCount === 0
                    ? "保存済みのメモがあると Markdown 形式で書き出せます"
                    : `${notedTopicCount} 件の学習メモを Markdown で出力`
                }
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <FileDown size={13} />
                <span>メモ出力 (.md)</span>
              </button>

              <button
                type="button"
                aria-expanded={showBackupPanel}
                aria-controls="azure-backup-panel"
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
            <div role="status" aria-live="polite" className="text-xs font-bold text-sky-700">
              {importMessage}
            </div>
          )}

          {showBackupPanel && (
            <div id="azure-backup-panel" className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                <p className="text-xs text-slate-600">
                  {config.shortLabel} の進捗やメモはブラウザの localStorage に保存されます。別端末へ移行する場合は JSON 文字列をコピーしてください。
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
                  placeholder="復元するバックアップJSON文字列を貼り付け..."
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-sky-400"
                />
                <button
                  type="button"
                  onClick={handleImportBackup}
                  disabled={!backupInput.trim()}
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 disabled:opacity-40 cursor-pointer shrink-0"
                >
                  復元を実行
                </button>
              </div>
              {importMessage && (
                <div role="status" aria-live="polite" className="text-xs font-bold text-sky-700">
                  {importMessage}
                </div>
              )}
            </div>
          )}
        </section>

        {/* タブナビゲーション */}
        <div
          role="tablist"
          aria-label="Azure 学習セクション"
          className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`azure-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`azure-panel-${tab.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => {
                  playCyberClick();
                  setActiveTab(tab.id);
                }}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
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
            id="azure-panel-domains"
            aria-labelledby="azure-tab-domains"
            className="space-y-5"
          >
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="relative w-full min-w-0 lg:flex-1 lg:max-w-xs">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  aria-label="Azure トピックを検索"
                  value={topicQuery}
                  onChange={(e) => setTopicQuery(e.target.value)}
                  placeholder="Azure サービス・CLI 検索..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-400"
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
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-sky-300"
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
                config.domains.length === 3
                  ? "lg:grid-cols-3"
                  : config.domains.length === 4
                    ? "lg:grid-cols-4"
                    : "lg:grid-cols-5"
              }`}
            >
              {config.domains.map((domain) => {
                const style = ACCENT_STYLES[domain.accentColor];
                const done = domain.topics.filter((t) =>
                  progress.completedTopics.includes(t.id)
                ).length;
                const pct =
                  domain.topics.length > 0 ? Math.round((done / domain.topics.length) * 100) : 0;
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
                    className="bg-white rounded-xl border border-slate-200/80 hover:border-sky-300 p-3 text-left transition-all shadow-xs space-y-1.5 cursor-pointer group"
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
                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-sky-700 line-clamp-2 leading-snug min-h-[2rem]">
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
                  const domainPct =
                    domain.topics.length > 0
                      ? Math.round((domainDone / domain.topics.length) * 100)
                      : 0;

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
                          aria-controls={`azure-domain-panel-${domain.id}`}
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
                            aria-controls={`azure-domain-panel-${domain.id}`}
                            onClick={() => {
                              playCyberClick();
                              setExpandedDomains((prev) => ({
                                ...prev,
                                [domain.id]: !prev[domain.id],
                              }));
                            }}
                            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer"
                            aria-label={`${domain.title} の展開切り替え`}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div
                          id={`azure-domain-panel-${domain.id}`}
                          className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-4 min-w-0"
                        >
                          {domain.visibleTopics.map((topic) => {
                            const isDone = progress.completedTopics.includes(topic.id);
                            const noteText = progress.topicNotes[topic.id] ?? "";
                            const isNoteOpen = Boolean(
                              openNoteTopics[topic.id] || noteText.trim()
                            );

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
                                      <Circle className="w-5 h-5 text-slate-300 group-hover:text-sky-500 shrink-0 mt-0.5" />
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
                                    aria-controls={`azure-note-panel-${topic.id}`}
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

                                {/* 関連サービス・機能 */}
                                <div className="flex flex-wrap gap-1.5">
                                  {topic.services.map((svc, idx) => (
                                    <button
                                      key={`${topic.id}-svc-${idx}`}
                                      type="button"
                                      onClick={() => handleJumpToServiceComparison(svc)}
                                      title="比較表で検索する"
                                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 font-mono text-[11px] font-bold text-slate-700 hover:text-sky-800 transition-colors cursor-pointer"
                                    >
                                      {svc}
                                    </button>
                                  ))}
                                </div>

                                {/* 学習要点 */}
                                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                                  {topic.keyPoints.map((pt, idx) => (
                                    <li
                                      key={`${topic.id}-pt-${idx}`}
                                      className="flex items-start space-x-2"
                                    >
                                      <span className="text-sky-500 font-bold mt-0.5">•</span>
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
                                  <div id={`azure-note-panel-${topic.id}`} className="pt-2">
                                    <label
                                      htmlFor={`azure-note-input-${topic.id}`}
                                      className="sr-only"
                                    >
                                      {topic.title} の学習メモ
                                    </label>
                                    <textarea
                                      id={`azure-note-input-${topic.id}`}
                                      rows={2}
                                      value={noteText}
                                      onChange={(e) =>
                                        handleUpdateTopicNote(topic.id, e.target.value)
                                      }
                                      placeholder="自分用の学習メモや公式ドキュメントの覚え書きを記入（自動保存）..."
                                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/30 text-xs text-slate-800 focus:outline-none focus:border-amber-400"
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
            id="azure-panel-comparisons"
            aria-labelledby="azure-tab-comparisons"
            className="space-y-8"
          >
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div
                  role="group"
                  aria-label="比較カテゴリ絞り込み"
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
                <div className="relative w-full min-w-0 lg:w-64 shrink-0">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    aria-label="比較表・逆引き・設計パターンを検索"
                    value={compQuery}
                    onChange={(e) => setCompQuery(e.target.value)}
                    placeholder="サービス・特徴で絞り込み..."
                    className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-400"
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
                aria-label="よく調べるサービス クイック検索"
                className="flex flex-wrap items-center gap-1.5 px-1"
              >
                <span className="text-[11px] font-bold text-slate-400 mr-1">
                  よく調べるサービス:
                </span>
                {config.quickSearchChips.map((kw) => {
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
                          ? "bg-slate-900 text-sky-300 border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:text-sky-700"
                      }`}
                    >
                      {kw}
                    </button>
                  );
                })}
              </div>

              {/* 検索ヒット件数サマリ（5セクション横断） */}
              {compQuery.trim() && (
                <div
                  role="status"
                  aria-live="polite"
                  className="bg-white rounded-2xl border border-slate-200/80 px-4 py-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 shadow-xs"
                >
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 min-w-0">
                    <span className="font-bold text-slate-800 break-words">
                      「{compQuery.trim()}」の検索結果:
                    </span>
                    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px]">
                      <span>比較表 {filteredComparisons.length}</span>
                      <span className="text-slate-300">/</span>
                      <span>逆引き {filteredQuickLookup.length}</span>
                      <span className="text-slate-300">/</span>
                      <span>設計パターン {filteredPatterns.length}</span>
                      <span className="text-slate-300">/</span>
                      <span>誤答対策 {filteredPitfalls.length}</span>
                      <span className="text-slate-300">/</span>
                      <span>制限値 {filteredKeyFacts.length}</span>
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
              filteredKeyFacts.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3 shadow-xs">
                  <Search className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="text-sm font-black text-slate-900">
                    「{compQuery}」に一致する項目が見つかりませんでした
                  </div>
                  <p className="text-xs text-slate-500">
                    別のキーワード（例：{config.quickSearchChips.slice(0, 4).join("、")}）で検索するか、条件をリセットしてください。
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

            {filteredComparisons.length > 0 && (
              <div className="space-y-5">
                {filteredComparisons.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
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
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            {comp.columns.map((col, idx) => (
                              <th
                                key={`${comp.id}-col-${idx}`}
                                className="py-2.5 px-3 font-black text-slate-700 whitespace-nowrap"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {comp.rows.map((row, rIdx) => (
                            <tr key={`${comp.id}-row-${rIdx}`} className="hover:bg-slate-50/70">
                              <td className="py-2.5 px-3 font-bold text-slate-800">{row.feature}</td>
                              {row.values.map((val, idx) => (
                                <td
                                  key={`${comp.id}-row-${rIdx}-val-${idx}`}
                                  className="py-2.5 px-3 text-slate-600 text-xs"
                                >
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="rounded-xl bg-slate-900 text-slate-100 px-4 py-3 text-xs flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-sky-300">使い分けルール: </strong>
                        {comp.decisionRule}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 要件・用途 → Azure サービス逆引き早見表（検索時表示） */}
            {filteredQuickLookup.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>
                    要件・用途 → Azure サービス逆引き早見表 ({filteredQuickLookup.length}件)
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredQuickLookup.map((item) => (
                    <div
                      key={`${config.id}-ql-${item.keyword}`}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2.5 shadow-xs min-w-0"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          {item.category}
                        </span>
                        <span className="font-mono text-xs font-black text-sky-700 break-words">
                          {item.recommended}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 break-words">
                        要件: {item.keyword}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 頻出アーキテクチャ・運用パターン */}
            {filteredPatterns.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-sky-600" />
                  <span>頻出アーキテクチャ・運用パターン</span>
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
                          <div key={`${pat.id}-step-${idx}`} className="flex items-center gap-1.5">
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
                        {pat.keyDesignPoints.map((pt, idx) => (
                          <li
                            key={`${pat.id}-pt-${idx}`}
                            className="flex items-start space-x-1.5"
                          >
                            <span className="text-sky-600 font-bold">•</span>
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
                      <div className="font-mono text-xs font-black text-indigo-700 break-words">{kf.target}</div>
                      <div className="text-sm font-black text-slate-900 break-words">{kf.value}</div>
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
            id="azure-panel-flashcards"
            aria-labelledby="azure-tab-flashcards"
          >
            <CertificationFlashcards
              key={certId}
              items={config.quickLookup}
              masteredKeywords={progress.masteredCards}
              onToggleMastered={handleToggleMasteredCard}
              onResetMastered={handleResetMasteredCards}
              badgeText={`Azure ${config.shortLabel} 直前暗記フラッシュカード`}
              title={config.flashcardTitle}
              promptLabel="次の要件に対応する Microsoft Azure サービス・機能は？"
              answerLabel="推奨サービス・機能"
            />
          </div>
        )}

        {/* TAB 4: 練習問題・模擬試験 */}
        {activeTab === "quiz" && (
          <div
            role="tabpanel"
            id="azure-panel-quiz"
            aria-labelledby="azure-tab-quiz"
          >
            <CertificationPracticeQuiz
              key={certId}
              questions={config.practiceQuestions}
              domains={quizDomains}
              examBadgeLabel={config.quizBadgeLabel}
              passingConfig={config.passingConfig}
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
            id="azure-panel-resources"
            aria-labelledby="azure-tab-resources"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {config.officialResources.map((res, idx) => (
              <TiltCard key={`${config.id}-res-${idx}`} className="h-full">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playCyberClick()}
                  className="block h-full min-w-0 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-sky-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {res.badge}
                    </span>
                    <ExternalLink size={15} className="text-slate-400" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">{res.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                  <div className="text-[11px] font-mono text-sky-700 truncate">{res.url}</div>
                </a>
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
