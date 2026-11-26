export interface LpicTopicItem {
  id: string;
  code: string;
  title: string;
  commands: string[];
  keyPoints: string[];
  examTip: string;
}

export interface UnifiedLpicDomain {
  id: string;
  exam: string;
  number: string;
  title: string;
  englishTitle: string;
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  summary: string;
  topics: LpicTopicItem[];
}

export interface LpicDomain extends UnifiedLpicDomain {
  exam: "101-500" | "102-500";
}

export interface Lpic2Domain extends UnifiedLpicDomain {
  exam: "201-450" | "202-450";
}

export interface Lpic300Domain extends UnifiedLpicDomain {
  exam: "300-300";
}

export interface Lpic303Domain extends UnifiedLpicDomain {
  exam: "303-300";
}

export interface Lpic305Domain extends UnifiedLpicDomain {
  exam: "305-300";
}

export interface Lpic306Domain extends UnifiedLpicDomain {
  exam: "306-300";
}

export interface LpicComparisonRow {
  feature: string;
  values: string[];
}

export interface LpicComparisonTable {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  columns: string[];
  rows: LpicComparisonRow[];
  decisionRule: string;
}

export interface LpicWorkflowPattern {
  id: string;
  title: string;
  badge: string;
  flow: string[];
  summary: string;
  keyDesignPoints: string[];
}

export interface LpicPitfall {
  id: string;
  trap: string;
  whyWrong: string;
  correctApproach: string;
}

export interface LpicKeyPathFact {
  id: string;
  target: string;
  value: string;
  detail: string;
}

export interface LpicOfficialResource {
  title: string;
  description: string;
  url: string;
  badge: string;
}
