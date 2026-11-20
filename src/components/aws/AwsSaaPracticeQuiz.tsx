"use client";

import CertificationPracticeQuiz, {
  isQuestionCorrect,
} from "@/components/certification/CertificationPracticeQuiz";
import type { CertMockExamRecord } from "@/components/certification/types";
import { saaDomains, saaPracticeQuestions } from "@/data/aws-saa";

export { isQuestionCorrect };
export type MockExamRecord = CertMockExamRecord;

interface AwsSaaPracticeQuizProps {
  answers: Record<string, number[]>;
  bookmarkedIds: string[];
  mockExamHistory: MockExamRecord[];
  initialDomain?: string;
  onSubmitAnswer: (questionId: string, selectedIndices: number[]) => void;
  onToggleBookmark: (questionId: string) => void;
  onRecordMockExam: (record: MockExamRecord) => void;
  onResetQuiz: () => void;
}

const DOMAIN_SHORT_LABELS: Record<string, string> = {
  "domain-1": "D1: セキュリティ",
  "domain-2": "D2: 弾力性",
  "domain-3": "D3: 高パフォーマンス",
  "domain-4": "D4: コスト最適化",
};

const QUIZ_DOMAINS = saaDomains.map((d) => ({
  id: d.id,
  number: d.number,
  shortLabel: `Domain ${d.number}`,
  filterLabel: DOMAIN_SHORT_LABELS[d.id] ?? `D${d.number}: ${d.title}`,
}));

const SAA_PASSING_CONFIG = {
  minScore: 100,
  maxScore: 1000,
  passingScore: 720,
  passingPct: 72,
  officialExamLabel: "AWS公式模擬試験",
};

export default function AwsSaaPracticeQuiz(props: AwsSaaPracticeQuizProps) {
  return (
    <CertificationPracticeQuiz
      questions={saaPracticeQuestions}
      domains={QUIZ_DOMAINS}
      examBadgeLabel="SAA-C03 本番形式演習"
      passingConfig={SAA_PASSING_CONFIG}
      {...props}
    />
  );
}
