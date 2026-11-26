import type {
  CertExamFact,
  CertFlashcardItem,
  CertQuestion,
} from "@/components/certification/types";
import type {
  LpicComparisonTable,
  LpicKeyPathFact,
  LpicOfficialResource,
  LpicPitfall,
  LpicWorkflowPattern,
  UnifiedLpicDomain,
} from "@/data/lpic-types";
import {
  lpic1Comparisons,
  lpic1Domains,
  lpic1ExamFacts,
  lpic1KeyPaths,
  lpic1OfficialResources,
  lpic1Patterns,
  lpic1Pitfalls,
  lpic1PracticeQuestions,
  lpic1QuickLookup,
} from "@/data/lpic-1";
import {
  LPIC_LEVELS,
  LPIC_LEVEL_META,
  type LpicLevel,
  type LpicLevelMeta,
} from "./lpicCertMeta";

export {
  LPIC_LEVELS,
  LPIC_LEVEL_META,
  type LpicLevel,
  type LpicLevelMeta,
};

export interface LpicCertData {
  examFacts: CertExamFact[];
  domains: UnifiedLpicDomain[];
  comparisons: LpicComparisonTable[];
  patterns: LpicWorkflowPattern[];
  pitfalls: LpicPitfall[];
  keyPaths: LpicKeyPathFact[];
  quickLookup: CertFlashcardItem[];
  practiceQuestions: CertQuestion[];
  officialResources: LpicOfficialResource[];
}

export const INITIAL_LPIC_CERT_DATA: LpicCertData = {
  examFacts: lpic1ExamFacts,
  domains: lpic1Domains,
  comparisons: lpic1Comparisons,
  patterns: lpic1Patterns,
  pitfalls: lpic1Pitfalls,
  keyPaths: lpic1KeyPaths,
  quickLookup: lpic1QuickLookup,
  practiceQuestions: lpic1PracticeQuestions,
  officialResources: lpic1OfficialResources,
};

const certDataCache = new Map<LpicLevel, LpicCertData>([["lpic-1", INITIAL_LPIC_CERT_DATA]]);
const certLoadPromises = new Map<LpicLevel, Promise<LpicCertData>>();

export function getCachedLpicCertData(level: LpicLevel): LpicCertData | undefined {
  return certDataCache.get(level);
}

/**
 * Dynamically imports a single LPIC track dataset on demand so Next.js / Webpack
 * splits LPIC-2 and LPIC-3 (300/303/305/306) into separate async chunks rather than bundling all upfront.
 */
export async function loadLpicCertData(level: LpicLevel): Promise<LpicCertData> {
  const cached = certDataCache.get(level);
  if (cached) return cached;

  const inflight = certLoadPromises.get(level);
  if (inflight) return inflight;

  const loaderPromise = (async (): Promise<LpicCertData> => {
    let data: LpicCertData;
    switch (level) {
      case "lpic-1":
        data = INITIAL_LPIC_CERT_DATA;
        break;
      case "lpic-2": {
        const m = await import("@/data/lpic-2");
        data = {
          examFacts: m.lpic2ExamFacts,
          domains: m.lpic2Domains,
          comparisons: m.lpic2Comparisons,
          patterns: m.lpic2Patterns,
          pitfalls: m.lpic2Pitfalls,
          keyPaths: m.lpic2KeyPaths,
          quickLookup: m.lpic2QuickLookup,
          practiceQuestions: m.lpic2PracticeQuestions,
          officialResources: m.lpic2OfficialResources,
        };
        break;
      }
      case "lpic-300": {
        const m = await import("@/data/lpic-300");
        data = {
          examFacts: m.lpic300ExamFacts,
          domains: m.lpic300Domains,
          comparisons: m.lpic300Comparisons,
          patterns: m.lpic300Patterns,
          pitfalls: m.lpic300Pitfalls,
          keyPaths: m.lpic300KeyPaths,
          quickLookup: m.lpic300QuickLookup,
          practiceQuestions: m.lpic300PracticeQuestions,
          officialResources: m.lpic300OfficialResources,
        };
        break;
      }
      case "lpic-303": {
        const m = await import("@/data/lpic-303");
        data = {
          examFacts: m.lpic303ExamFacts,
          domains: m.lpic303Domains,
          comparisons: m.lpic303Comparisons,
          patterns: m.lpic303Patterns,
          pitfalls: m.lpic303Pitfalls,
          keyPaths: m.lpic303KeyPaths,
          quickLookup: m.lpic303QuickLookup,
          practiceQuestions: m.lpic303PracticeQuestions,
          officialResources: m.lpic303OfficialResources,
        };
        break;
      }
      case "lpic-305": {
        const m = await import("@/data/lpic-305");
        data = {
          examFacts: m.lpic305ExamFacts,
          domains: m.lpic305Domains,
          comparisons: m.lpic305Comparisons,
          patterns: m.lpic305Patterns,
          pitfalls: m.lpic305Pitfalls,
          keyPaths: m.lpic305KeyPaths,
          quickLookup: m.lpic305QuickLookup,
          practiceQuestions: m.lpic305PracticeQuestions,
          officialResources: m.lpic305OfficialResources,
        };
        break;
      }
      case "lpic-306": {
        const m = await import("@/data/lpic-306");
        data = {
          examFacts: m.lpic306ExamFacts,
          domains: m.lpic306Domains,
          comparisons: m.lpic306Comparisons,
          patterns: m.lpic306Patterns,
          pitfalls: m.lpic306Pitfalls,
          keyPaths: m.lpic306KeyPaths,
          quickLookup: m.lpic306QuickLookup,
          practiceQuestions: m.lpic306PracticeQuestions,
          officialResources: m.lpic306OfficialResources,
        };
        break;
      }
    }
    certDataCache.set(level, data);
    certLoadPromises.delete(level);
    return data;
  })().catch((err) => {
    certLoadPromises.delete(level);
    throw err;
  });

  certLoadPromises.set(level, loaderPromise);
  return loaderPromise;
}
