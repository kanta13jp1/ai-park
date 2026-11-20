export interface CertExamFact {
  label: string;
  value: string;
  detail: string;
}

export interface CertFlashcardItem {
  keyword: string;
  category: string;
  recommended: string;
  reason: string;
}

export interface CertQuestion {
  id: string;
  domainId: string;
  domainLabel: string;
  difficulty: "基礎" | "標準" | "応用";
  selectCount: 1 | 2;
  question: string;
  options: string[];
  correctIndices: number[];
  explanation: string;
  keywords: string[];
}

export interface CertQuizDomain {
  id: string;
  number: number | string;
  shortLabel: string;
  filterLabel: string;
}

export interface CertMockExamRecord {
  date: string;
  correct: number;
  total: number;
  scaledScore: number;
}

export interface CertPassingConfig {
  minScore: number;
  maxScore: number;
  passingScore: number;
  passingPct: number;
  officialExamLabel: string;
}
