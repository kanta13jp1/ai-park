import type {
  CertExamFact,
  CertFlashcardItem,
  CertPassingConfig,
  CertQuestion,
} from "../components/certification/types";

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
