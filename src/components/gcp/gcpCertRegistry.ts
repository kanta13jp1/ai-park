import type {
  CertExamFact,
  CertFlashcardItem,
  CertQuestion,
} from "@/components/certification/types";
import type {
  GcpDomain,
  GcpComparisonTable,
  GcpArchitecturePattern,
  GcpPitfall,
  GcpKeyFact,
  GcpOfficialResource,
} from "@/data/gcp-types";
import {
  cdlExamFacts,
  cdlDomains,
  cdlComparisons,
  cdlPatterns,
  cdlPitfalls,
  cdlKeyFacts,
  cdlQuickLookup,
  cdlPracticeQuestions,
  cdlOfficialResources,
} from "@/data/gcp-cdl";
import {
  GCP_CERT_META,
  GCP_CERT_IDS,
  CERT_LEVEL_GROUPS,
  type GcpCertId,
  type GcpLevelGroup,
  type GcpCertMeta,
} from "./gcpCertMeta";

export {
  GCP_CERT_META,
  GCP_CERT_IDS,
  CERT_LEVEL_GROUPS,
  type GcpCertId,
  type GcpLevelGroup,
  type GcpCertMeta,
};

export interface GcpCertData {
  examFacts: CertExamFact[];
  domains: GcpDomain[];
  comparisons: GcpComparisonTable[];
  patterns: GcpArchitecturePattern[];
  pitfalls: GcpPitfall[];
  keyFacts: GcpKeyFact[];
  quickLookup: CertFlashcardItem[];
  practiceQuestions: CertQuestion[];
  officialResources: GcpOfficialResource[];
}

export type GcpCertConfig = GcpCertMeta & GcpCertData;

export const INITIAL_GCP_CERT_DATA: GcpCertData = {
  examFacts: cdlExamFacts,
  domains: cdlDomains,
  comparisons: cdlComparisons,
  patterns: cdlPatterns,
  pitfalls: cdlPitfalls,
  keyFacts: cdlKeyFacts,
  quickLookup: cdlQuickLookup,
  practiceQuestions: cdlPracticeQuestions,
  officialResources: cdlOfficialResources,
};

const certDataCache = new Map<GcpCertId, GcpCertData>([["cdl", INITIAL_GCP_CERT_DATA]]);
const certLoadPromises = new Map<GcpCertId, Promise<GcpCertData>>();

export function getCachedGcpCertData(certId: GcpCertId): GcpCertData | undefined {
  return certDataCache.get(certId);
}

/**
 * Dynamically imports a single GCP certification dataset on demand so Next.js / Webpack
 * splits the remaining 10 exams into separate async chunks rather than loading ~865 KB upfront.
 */
export async function loadGcpCertData(certId: GcpCertId): Promise<GcpCertData> {
  const cached = certDataCache.get(certId);
  if (cached) return cached;

  const inflight = certLoadPromises.get(certId);
  if (inflight) return inflight;

  const loaderPromise = (async (): Promise<GcpCertData> => {
    let data: GcpCertData;
    switch (certId) {
      case "cdl":
        data = INITIAL_GCP_CERT_DATA;
        break;
      case "gail": {
        const m = await import("@/data/gcp-gail");
        data = {
          examFacts: m.gailExamFacts,
          domains: m.gailDomains,
          comparisons: m.gailComparisons,
          patterns: m.gailPatterns,
          pitfalls: m.gailPitfalls,
          keyFacts: m.gailKeyFacts,
          quickLookup: m.gailQuickLookup,
          practiceQuestions: m.gailPracticeQuestions,
          officialResources: m.gailOfficialResources,
        };
        break;
      }
      case "ace": {
        const m = await import("@/data/gcp-ace");
        data = {
          examFacts: m.aceExamFacts,
          domains: m.aceDomains,
          comparisons: m.aceComparisons,
          patterns: m.acePatterns,
          pitfalls: m.acePitfalls,
          keyFacts: m.aceKeyFacts,
          quickLookup: m.aceQuickLookup,
          practiceQuestions: m.acePracticeQuestions,
          officialResources: m.aceOfficialResources,
        };
        break;
      }
      case "adp": {
        const m = await import("@/data/gcp-adp");
        data = {
          examFacts: m.adpExamFacts,
          domains: m.adpDomains,
          comparisons: m.adpComparisons,
          patterns: m.adpPatterns,
          pitfalls: m.adpPitfalls,
          keyFacts: m.adpKeyFacts,
          quickLookup: m.adpQuickLookup,
          practiceQuestions: m.adpPracticeQuestions,
          officialResources: m.adpOfficialResources,
        };
        break;
      }
      case "pca": {
        const m = await import("@/data/gcp-pca");
        data = {
          examFacts: m.pcaExamFacts,
          domains: m.pcaDomains,
          comparisons: m.pcaComparisons,
          patterns: m.pcaPatterns,
          pitfalls: m.pcaPitfalls,
          keyFacts: m.pcaKeyFacts,
          quickLookup: m.pcaQuickLookup,
          practiceQuestions: m.pcaPracticeQuestions,
          officialResources: m.pcaOfficialResources,
        };
        break;
      }
      case "pde": {
        const m = await import("@/data/gcp-pde");
        data = {
          examFacts: m.pdeExamFacts,
          domains: m.pdeDomains,
          comparisons: m.pdeComparisons,
          patterns: m.pdePatterns,
          pitfalls: m.pdePitfalls,
          keyFacts: m.pdeKeyFacts,
          quickLookup: m.pdeQuickLookup,
          practiceQuestions: m.pdePracticeQuestions,
          officialResources: m.pdeOfficialResources,
        };
        break;
      }
      case "pmle": {
        const m = await import("@/data/gcp-pmle");
        data = {
          examFacts: m.pmleExamFacts,
          domains: m.pmleDomains,
          comparisons: m.pmleComparisons,
          patterns: m.pmlePatterns,
          pitfalls: m.pmlePitfalls,
          keyFacts: m.pmleKeyFacts,
          quickLookup: m.pmleQuickLookup,
          practiceQuestions: m.pmlePracticeQuestions,
          officialResources: m.pmleOfficialResources,
        };
        break;
      }
      case "pcse": {
        const m = await import("@/data/gcp-pcse");
        data = {
          examFacts: m.pcseExamFacts,
          domains: m.pcseDomains,
          comparisons: m.pcseComparisons,
          patterns: m.pcsePatterns,
          pitfalls: m.pcsePitfalls,
          keyFacts: m.pcseKeyFacts,
          quickLookup: m.pcseQuickLookup,
          practiceQuestions: m.pcsePracticeQuestions,
          officialResources: m.pcseOfficialResources,
        };
        break;
      }
      case "pcde": {
        const m = await import("@/data/gcp-pcde");
        data = {
          examFacts: m.pcdeExamFacts,
          domains: m.pcdeDomains,
          comparisons: m.pcdeComparisons,
          patterns: m.pcdePatterns,
          pitfalls: m.pcdePitfalls,
          keyFacts: m.pcdeKeyFacts,
          quickLookup: m.pcdeQuickLookup,
          practiceQuestions: m.pcdePracticeQuestions,
          officialResources: m.pcdeOfficialResources,
        };
        break;
      }
      case "pcd": {
        const m = await import("@/data/gcp-pcd");
        data = {
          examFacts: m.pcdExamFacts,
          domains: m.pcdDomains,
          comparisons: m.pcdComparisons,
          patterns: m.pcdPatterns,
          pitfalls: m.pcdPitfalls,
          keyFacts: m.pcdKeyFacts,
          quickLookup: m.pcdQuickLookup,
          practiceQuestions: m.pcdPracticeQuestions,
          officialResources: m.pcdOfficialResources,
        };
        break;
      }
      case "pcne": {
        const m = await import("@/data/gcp-pcne");
        data = {
          examFacts: m.pcneExamFacts,
          domains: m.pcneDomains,
          comparisons: m.pcneComparisons,
          patterns: m.pcnePatterns,
          pitfalls: m.pcnePitfalls,
          keyFacts: m.pcneKeyFacts,
          quickLookup: m.pcneQuickLookup,
          practiceQuestions: m.pcnePracticeQuestions,
          officialResources: m.pcneOfficialResources,
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
