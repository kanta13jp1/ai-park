import type {
  CertExamFact,
  CertFlashcardItem,
  CertPassingConfig,
  CertQuestion,
} from "@/components/certification/types";
import {
  foundationExamMetas,
  foundationDomains,
  foundationComparisons,
  foundationFormulaPatterns,
  foundationPitfalls,
  foundationKeyFacts,
  foundationFlashcards,
  foundationQuestions,
} from "@/data/ipa/foundation";
import {
  specialistExamMetas,
  specialistDomains,
  specialistComparisons,
  specialistFormulaPatterns,
  specialistPitfalls,
  specialistKeyFacts,
  specialistFlashcards,
  specialistQuestions,
} from "@/data/ipa/specialist";
import {
  managementExamMetas,
  managementDomains,
  managementComparisons,
  managementFormulaPatterns,
  managementPitfalls,
  managementKeyFacts,
  managementFlashcards,
  managementQuestions,
} from "@/data/ipa/management";

export type IpaExamId =
  | "ip"
  | "sg"
  | "fe"
  | "ap"
  | "sc"
  | "db"
  | "nw"
  | "es"
  | "st"
  | "sa"
  | "pm"
  | "sm"
  | "au";

export type IpaExamTier = "foundation" | "specialist" | "management";

export interface IpaExamMeta {
  id: IpaExamId;
  tier: IpaExamTier;
  shortLabel: string;
  title: string;
  subtitle: string;
  skillLevel: string;
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  description: string;
  examFacts: CertExamFact[];
  passingConfig: CertPassingConfig;
  secondsPerQuestion: number;
}

export interface IpaTopicItem {
  id: string;
  code: string;
  title: string;
  keywords: string[];
  keyPoints: string[];
  examTip: string;
}

export interface IpaDomain {
  id: string;
  examId: IpaExamId;
  number: string;
  category: "ストラテジ系" | "マネジメント系" | "テクノロジ系";
  title: string;
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  summary: string;
  topics: IpaTopicItem[];
}

export interface IpaComparisonRow {
  feature: string;
  values: string[];
}

export interface IpaComparisonTable {
  id: string;
  examIds: IpaExamId[];
  category: "ネットワーク・セキュリティ" | "開発・データベース" | "マネジメント・戦略" | "コンピュータ基礎";
  title: string;
  subtitle: string;
  columns: string[];
  rows: IpaComparisonRow[];
  decisionRule: string;
}

export interface IpaFormulaPattern {
  id: string;
  examIds: IpaExamId[];
  title: string;
  badge: string;
  flow: string[];
  summary: string;
  keyDesignPoints: string[];
}

export interface IpaPitfall {
  id: string;
  examIds: IpaExamId[];
  trap: string;
  whyWrong: string;
  correctApproach: string;
}

export interface IpaKeyFact {
  id: string;
  examIds: IpaExamId[];
  target: string;
  value: string;
  detail: string;
}

export interface IpaOfficialResource {
  title: string;
  description: string;
  url: string;
  badge: string;
}

export interface IpaFlashcardItem extends CertFlashcardItem {
  examId: IpaExamId;
}

export interface IpaQuestion extends CertQuestion {
  examId: IpaExamId;
}

// 出典: 独立行政法人情報処理推進機構 (IPA) 情報処理技術者試験・情報処理安全確保支援士試験 試験要綱・シラバス（https://www.ipa.go.jp/shiken/syllabus/gaiyou.html）
export const ipaExamMetas: IpaExamMeta[] = [
  ...foundationExamMetas,
  ...specialistExamMetas,
  ...managementExamMetas,
];

export const ipaDomains: IpaDomain[] = [
  ...foundationDomains,
  ...specialistDomains,
  ...managementDomains,
];

export const ipaComparisons: IpaComparisonTable[] = [
  ...foundationComparisons,
  ...specialistComparisons,
  ...managementComparisons,
];

export const ipaFormulaPatterns: IpaFormulaPattern[] = [
  ...foundationFormulaPatterns,
  ...specialistFormulaPatterns,
  ...managementFormulaPatterns,
];

export const ipaPitfalls: IpaPitfall[] = [
  ...foundationPitfalls,
  ...specialistPitfalls,
  ...managementPitfalls,
];

export const ipaKeyFacts: IpaKeyFact[] = [
  ...foundationKeyFacts,
  ...specialistKeyFacts,
  ...managementKeyFacts,
];

export const ipaFlashcards: IpaFlashcardItem[] = [
  ...foundationFlashcards,
  ...specialistFlashcards,
  ...managementFlashcards,
];

export const ipaPracticeQuestions: IpaQuestion[] = [
  ...foundationQuestions,
  ...specialistQuestions,
  ...managementQuestions,
];

// 出典: 独立行政法人情報処理推進機構 (IPA) 公式ページ
export const ipaOfficialResources: IpaOfficialResource[] = [
  {
    title: "IPA 情報処理技術者試験・情報処理安全確保支援士試験 トップ",
    description: "試験区分一覧、申込スケジュール、CBT 試験案内、最新の制度変更に関する公式情報。",
    url: "https://www.ipa.go.jp/shiken/index.html",
    badge: "IPA 公式トップ",
  },
  {
    title: "試験要綱・シラバス（出題範囲）",
    description: "ITパスポート・基本情報・応用情報・高度試験の公式試験要綱、シラバス PDF が掲載されています。",
    url: "https://www.ipa.go.jp/shiken/syllabus/gaiyou.html",
    badge: "公式シラバス",
  },
  {
    title: "過去問題・解答例・採点講評",
    description: "公開されている過去の問題冊子、配点割合、解答例、採点講評をダウンロードできます。",
    url: "https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html",
    badge: "公式過去問",
  },
];
