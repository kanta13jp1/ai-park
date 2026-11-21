export interface AzureTopicItem {
  id: string;
  code: string;
  title: string;
  services: string[];
  keyPoints: string[];
  examTip: string;
}

export interface AzureDomain {
  id: string;
  number: string;
  title: string;
  englishTitle: string;
  weight: string;
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  summary: string;
  topics: AzureTopicItem[];
}

export interface AzureComparisonRow {
  feature: string;
  values: string[];
}

export type AzureComparisonCategory =
  | "コンピュート"
  | "ストレージ・DB"
  | "AI・機械学習"
  | "ネットワーク・セキュリティ"
  | "ガバナンス・監視・コスト";

export interface AzureComparisonTable {
  id: string;
  category: AzureComparisonCategory;
  title: string;
  subtitle: string;
  columns: string[];
  rows: AzureComparisonRow[];
  decisionRule: string;
}

export interface AzureArchitecturePattern {
  id: string;
  title: string;
  badge: string;
  flow: string[];
  summary: string;
  keyDesignPoints: string[];
}

export interface AzurePitfall {
  id: string;
  trap: string;
  whyWrong: string;
  correctApproach: string;
}

export interface AzureKeyFact {
  id: string;
  target: string;
  value: string;
  detail: string;
}

export interface AzureOfficialResource {
  title: string;
  description: string;
  url: string;
  badge: string;
}
