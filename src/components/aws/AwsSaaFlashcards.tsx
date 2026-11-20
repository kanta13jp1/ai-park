"use client";

import CertificationFlashcards from "@/components/certification/CertificationFlashcards";
import { saaQuickLookup } from "@/data/aws-saa";

interface AwsSaaFlashcardsProps {
  masteredKeywords: string[];
  onToggleMastered: (keyword: string) => void;
  onResetMastered: () => void;
}

export default function AwsSaaFlashcards({
  masteredKeywords,
  onToggleMastered,
  onResetMastered,
}: AwsSaaFlashcardsProps) {
  return (
    <CertificationFlashcards
      items={saaQuickLookup}
      masteredKeywords={masteredKeywords}
      onToggleMastered={onToggleMastered}
      onResetMastered={onResetMastered}
      badgeText="直前暗記フラッシュカード"
      title="要件キーワード → 推奨サービス 即答トレーニング"
      promptLabel="次の要件に最適な AWS サービス・機能は？"
      answerLabel="推奨サービス・設計"
    />
  );
}
