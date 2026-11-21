export interface GcpTopicItem {
  id: string;
  code: string;
  title: string;
  services: string[];
  keyPoints: string[];
  examTip: string;
}

export interface GcpDomain {
  id: string;
  number: string;
  title: string;
  englishTitle: string;
  weight: string;
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  summary: string;
  topics: GcpTopicItem[];
}

export interface GcpComparisonRow {
  feature: string;
  values: string[];
}

export interface GcpComparisonTable {
  id: string;
  category:
    | "コンピュート"
    | "ストレージ・DB"
    | "AI・データ分析"
    | "ネットワーク・セキュリティ"
    | "運用・移行・コスト";
  title: string;
  subtitle: string;
  columns: string[];
  rows: GcpComparisonRow[];
  decisionRule: string;
}

export interface GcpArchitecturePattern {
  id: string;
  title: string;
  badge: string;
  flow: string[];
  summary: string;
  keyDesignPoints: string[];
}

export interface GcpPitfall {
  id: string;
  trap: string;
  whyWrong: string;
  correctApproach: string;
}

export interface GcpKeyFact {
  id: string;
  target: string;
  value: string;
  detail: string;
}

export interface GcpOfficialResource {
  title: string;
  description: string;
  url: string;
  badge: string;
}
