export type {
  IpaExamId,
  IpaExamTier,
  IpaExamMeta,
  IpaTopicItem,
  IpaDomain,
  IpaComparisonRow,
  IpaComparisonTable,
  IpaFormulaPattern,
  IpaPitfall,
  IpaKeyFact,
  IpaOfficialResource,
  IpaFlashcardItem,
  IpaQuestion,
} from "./ipa-types";

import type {
  IpaExamMeta,
  IpaDomain,
  IpaComparisonTable,
  IpaFormulaPattern,
  IpaPitfall,
  IpaKeyFact,
  IpaOfficialResource,
  IpaFlashcardItem,
  IpaQuestion,
} from "./ipa-types";
import {
  foundationExamMetas,
  foundationDomains,
  foundationComparisons,
  foundationFormulaPatterns,
  foundationPitfalls,
  foundationKeyFacts,
  foundationFlashcards,
  foundationQuestions,
} from "./ipa/foundation";
import {
  specialistExamMetas,
  specialistDomains,
  specialistComparisons,
  specialistFormulaPatterns,
  specialistPitfalls,
  specialistKeyFacts,
  specialistFlashcards,
  specialistQuestions,
} from "./ipa/specialist";
import {
  managementExamMetas,
  managementDomains,
  managementComparisons,
  managementFormulaPatterns,
  managementPitfalls,
  managementKeyFacts,
  managementFlashcards,
  managementQuestions,
} from "./ipa/management";

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
