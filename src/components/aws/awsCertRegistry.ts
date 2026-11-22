import type {
  SaaExamFact,
  SaaDomain,
  SaaComparisonTable,
  SaaQuickLookupItem,
  SaaQuestion,
  SaaOfficialResource,
  SaaArchitecturePattern,
  SaaPitfall,
  SaaLimitFact,
} from "@/data/aws-types";
import {
  saaExamFacts,
  saaDomains,
  saaComparisons,
  saaQuickLookup,
  saaPracticeQuestions,
  saaOfficialResources,
  saaArchitecturePatterns,
  saaPitfalls,
  saaKeyLimits,
  saaServiceQueryAliases,
  saaWellArchitectedPillars,
} from "@/data/aws-saa";
import { normalizeAwsSearchQuery } from "@/lib/aws-search";
import {
  AWS_CERT_META,
  AWS_CERT_IDS,
  AWS_LEVEL_GROUPS,
  type AwsCertId,
  type AwsCertLevel,
  type AwsCertMeta,
} from "./awsCertMeta";

export {
  AWS_CERT_META,
  AWS_CERT_IDS,
  AWS_LEVEL_GROUPS,
  saaWellArchitectedPillars,
  type AwsCertId,
  type AwsCertLevel,
  type AwsCertMeta,
};

export interface AwsCertData {
  examFacts: SaaExamFact[];
  domains: SaaDomain[];
  comparisons: SaaComparisonTable[];
  quickLookup: SaaQuickLookupItem[];
  practiceQuestions: SaaQuestion[];
  officialResources: SaaOfficialResource[];
  architecturePatterns: SaaArchitecturePattern[];
  pitfalls: SaaPitfall[];
  keyLimits: SaaLimitFact[];
  resolveServiceQuery: (serviceName: string) => string;
}

export const INITIAL_AWS_CERT_DATA: AwsCertData = {
  examFacts: saaExamFacts,
  domains: saaDomains,
  comparisons: saaComparisons,
  quickLookup: saaQuickLookup,
  practiceQuestions: saaPracticeQuestions,
  officialResources: saaOfficialResources,
  architecturePatterns: saaArchitecturePatterns,
  pitfalls: saaPitfalls,
  keyLimits: saaKeyLimits,
  resolveServiceQuery: (svc: string) => normalizeAwsSearchQuery(svc, saaServiceQueryAliases),
};

const certDataCache = new Map<AwsCertId, AwsCertData>([["saa", INITIAL_AWS_CERT_DATA]]);
const certLoadPromises = new Map<AwsCertId, Promise<AwsCertData>>();

export function getCachedAwsCertData(certId: AwsCertId): AwsCertData | undefined {
  return certDataCache.get(certId);
}

/**
 * Dynamically imports a single AWS certification dataset on demand so Next.js / Webpack
 * splits the other 5 exams into separate async chunks rather than bundling all 514 KB upfront.
 */
export async function loadAwsCertData(certId: AwsCertId): Promise<AwsCertData> {
  const cached = certDataCache.get(certId);
  if (cached) return cached;

  const inflight = certLoadPromises.get(certId);
  if (inflight) return inflight;

  const loaderPromise = (async (): Promise<AwsCertData> => {
    let data: AwsCertData;
    switch (certId) {
      case "saa":
        data = INITIAL_AWS_CERT_DATA;
        break;
      case "clf": {
        const m = await import("@/data/aws-clf");
        data = {
          examFacts: m.clfExamFacts,
          domains: m.clfDomains,
          comparisons: m.clfComparisons,
          quickLookup: m.clfQuickLookup,
          practiceQuestions: m.clfPracticeQuestions,
          officialResources: m.clfOfficialResources,
          architecturePatterns: m.clfArchitecturePatterns,
          pitfalls: m.clfPitfalls,
          keyLimits: m.clfKeyLimits,
          resolveServiceQuery: (svc) => normalizeAwsSearchQuery(svc, m.clfServiceQueryAliases),
        };
        break;
      }
      case "aif": {
        const m = await import("@/data/aws-aif");
        data = {
          examFacts: m.aifExamFacts,
          domains: m.aifDomains,
          comparisons: m.aifComparisons,
          quickLookup: m.aifQuickLookup,
          practiceQuestions: m.aifPracticeQuestions,
          officialResources: m.aifOfficialResources,
          architecturePatterns: m.aifArchitecturePatterns,
          pitfalls: m.aifPitfalls,
          keyLimits: m.aifKeyLimits,
          resolveServiceQuery: (svc) => normalizeAwsSearchQuery(svc, m.aifServiceQueryAliases),
        };
        break;
      }
      case "dva": {
        const m = await import("@/data/aws-dva");
        data = {
          examFacts: m.dvaExamFacts,
          domains: m.dvaDomains,
          comparisons: m.dvaComparisons,
          quickLookup: m.dvaQuickLookup,
          practiceQuestions: m.dvaPracticeQuestions,
          officialResources: m.dvaOfficialResources,
          architecturePatterns: m.dvaArchitecturePatterns,
          pitfalls: m.dvaPitfalls,
          keyLimits: m.dvaKeyLimits,
          resolveServiceQuery: (svc) => normalizeAwsSearchQuery(svc, m.dvaServiceQueryAliases),
        };
        break;
      }
      case "soa": {
        const m = await import("@/data/aws-soa");
        data = {
          examFacts: m.soaExamFacts,
          domains: m.soaDomains,
          comparisons: m.soaComparisons,
          quickLookup: m.soaQuickLookup,
          practiceQuestions: m.soaPracticeQuestions,
          officialResources: m.soaOfficialResources,
          architecturePatterns: m.soaArchitecturePatterns,
          pitfalls: m.soaPitfalls,
          keyLimits: m.soaKeyLimits,
          resolveServiceQuery: (svc) => normalizeAwsSearchQuery(svc, m.soaServiceQueryAliases),
        };
        break;
      }
      case "sap": {
        const m = await import("@/data/aws-sap");
        data = {
          examFacts: m.sapExamFacts,
          domains: m.sapDomains,
          comparisons: m.sapComparisons,
          quickLookup: m.sapQuickLookup,
          practiceQuestions: m.sapPracticeQuestions,
          officialResources: m.sapOfficialResources,
          architecturePatterns: m.sapArchitecturePatterns,
          pitfalls: m.sapPitfalls,
          keyLimits: m.sapKeyLimits,
          resolveServiceQuery: (svc) => normalizeAwsSearchQuery(svc, m.sapServiceQueryAliases),
        };
        break;
      }
    }
    certDataCache.set(certId, data);
    certLoadPromises.delete(certId);
    return data;
  })().catch((err) => {
    certLoadPromises.delete(certId);
    throw err;
  });

  certLoadPromises.set(certId, loaderPromise);
  return loaderPromise;
}
