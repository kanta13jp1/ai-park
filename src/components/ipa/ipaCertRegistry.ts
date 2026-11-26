import type {
  IpaComparisonTable,
  IpaDomain,
  IpaExamId,
  IpaExamMeta,
  IpaExamTier,
  IpaFlashcardItem,
  IpaFormulaPattern,
  IpaKeyFact,
  IpaOfficialResource,
  IpaPitfall,
  IpaQuestion,
} from "@/data/ipa-types";
import {
  foundationComparisons,
  foundationDomains,
  foundationFlashcards,
  foundationFormulaPatterns,
  foundationKeyFacts,
  foundationPitfalls,
  foundationQuestions,
} from "@/data/ipa/foundation";
import {
  IPA_EXAM_COUNTS,
  IPA_EXAM_IDS,
  IPA_EXAM_METAS,
  IPA_EXAM_TIER_MAP,
  IPA_OFFICIAL_RESOURCES,
  IPA_TIER_GROUPS,
} from "./ipaCertMeta";

export {
  IPA_EXAM_COUNTS,
  IPA_EXAM_IDS,
  IPA_EXAM_METAS,
  IPA_EXAM_TIER_MAP,
  IPA_OFFICIAL_RESOURCES,
  IPA_TIER_GROUPS,
  type IpaExamId,
  type IpaExamMeta,
  type IpaExamTier,
  type IpaOfficialResource,
};

export interface IpaTierData {
  domains: IpaDomain[];
  comparisons: IpaComparisonTable[];
  formulaPatterns: IpaFormulaPattern[];
  pitfalls: IpaPitfall[];
  keyFacts: IpaKeyFact[];
  flashcards: IpaFlashcardItem[];
  questions: IpaQuestion[];
}

export const INITIAL_IPA_TIER_DATA: IpaTierData = {
  domains: foundationDomains,
  comparisons: foundationComparisons,
  formulaPatterns: foundationFormulaPatterns,
  pitfalls: foundationPitfalls,
  keyFacts: foundationKeyFacts,
  flashcards: foundationFlashcards,
  questions: foundationQuestions,
};

const tierDataCache = new Map<IpaExamTier, IpaTierData>([["foundation", INITIAL_IPA_TIER_DATA]]);
const tierLoadPromises = new Map<IpaExamTier, Promise<IpaTierData>>();

export function getCachedIpaTierData(tier: IpaExamTier): IpaTierData | undefined {
  return tierDataCache.get(tier);
}

/**
 * Dynamically imports specialist / management IPA exam tier bundles on demand so
 * initial page load only ships the foundation (IP/SG/FE/AP) tier.
 */
export async function loadIpaTierData(tier: IpaExamTier): Promise<IpaTierData> {
  const cached = tierDataCache.get(tier);
  if (cached) return cached;

  const inflight = tierLoadPromises.get(tier);
  if (inflight) return inflight;

  const loaderPromise = (async (): Promise<IpaTierData> => {
    let data: IpaTierData;
    switch (tier) {
      case "foundation":
        data = INITIAL_IPA_TIER_DATA;
        break;
      case "specialist": {
        const m = await import("@/data/ipa/specialist");
        data = {
          domains: m.specialistDomains,
          comparisons: m.specialistComparisons,
          formulaPatterns: m.specialistFormulaPatterns,
          pitfalls: m.specialistPitfalls,
          keyFacts: m.specialistKeyFacts,
          flashcards: m.specialistFlashcards,
          questions: m.specialistQuestions,
        };
        break;
      }
      case "management": {
        const m = await import("@/data/ipa/management");
        data = {
          domains: m.managementDomains,
          comparisons: m.managementComparisons,
          formulaPatterns: m.managementFormulaPatterns,
          pitfalls: m.managementPitfalls,
          keyFacts: m.managementKeyFacts,
          flashcards: m.managementFlashcards,
          questions: m.managementQuestions,
        };
        break;
      }
    }
    tierDataCache.set(tier, data);
    tierLoadPromises.delete(tier);
    return data;
  })().catch((err) => {
    tierLoadPromises.delete(tier);
    throw err;
  });

  tierLoadPromises.set(tier, loaderPromise);
  return loaderPromise;
}
