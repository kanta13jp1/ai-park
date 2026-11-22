export interface SaaExamFact {
  label: string;
  value: string;
  detail: string;
}

export interface SaaTopic {
  id: string;
  title: string;
  services: string[];
  keyPoints: string[];
  examTip: string;
}

export interface SaaDomain {
  id: string;
  number: number;
  title: string;
  englishTitle: string;
  weight: number; // %
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  summary: string;
  topics: SaaTopic[];
}

export interface SaaComparisonRow {
  feature: string;
  values: string[];
}

export interface SaaComparisonTable {
  id: string;
  category:
    | "ネットワーク"
    | "ストレージ"
    | "データベース"
    | "非同期・連携"
    | "セキュリティ"
    | "コンピュート"
    | "コスト最適化";
  title: string;
  subtitle: string;
  columns: string[];
  rows: SaaComparisonRow[];
  decisionRule: string;
}

export interface SaaQuickLookupItem {
  keyword: string;
  category: string;
  recommended: string;
  reason: string;
}

export interface SaaQuestion {
  id: string;
  domainId: string;
  domainLabel: string;
  difficulty: "基礎" | "標準" | "応用";
  selectCount: 1 | 2; // 1 = 択一, 2 = 2つ選択
  question: string;
  options: string[];
  correctIndices: number[];
  explanation: string;
  keywords: string[];
}

export interface SaaOfficialResource {
  title: string;
  description: string;
  url: string;
  badge: string;
}

export interface SaaArchitecturePattern {
  id: string;
  title: string;
  badge: string;
  flow: string[];
  summary: string;
  keyDesignPoints: string[];
}

export interface SaaPitfall {
  id: string;
  trap: string;
  whyWrong: string;
  correctApproach: string;
}

export interface SaaLimitFact {
  id: string;
  service: string;
  limitValue: string;
  detail: string;
}

export interface SaaWellArchitectedPillar {
  id: string;
  name: string;
  englishName: string;
  examKeywords: string[];
  focus: string;
}
