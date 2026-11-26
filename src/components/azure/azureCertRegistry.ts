import type {
  CertExamFact,
  CertFlashcardItem,
  CertQuestion,
} from "@/components/certification/types";
import type {
  AzureArchitecturePattern,
  AzureComparisonTable,
  AzureDomain,
  AzureKeyFact,
  AzureOfficialResource,
  AzurePitfall,
} from "@/data/azure-types";
import {
  az900Comparisons,
  az900Domains,
  az900ExamFacts,
  az900KeyFacts,
  az900OfficialResources,
  az900Patterns,
  az900Pitfalls,
  az900PracticeQuestions,
  az900QuickLookup,
} from "@/data/azure-az900";
import {
  AZURE_CERT_IDS,
  AZURE_CERT_META,
  type AzureCertId,
  type AzureCertMeta,
} from "./azureCertMeta";

export {
  AZURE_CERT_IDS,
  AZURE_CERT_META,
  type AzureCertId,
  type AzureCertMeta,
};

export interface AzureCertData {
  examFacts: CertExamFact[];
  domains: AzureDomain[];
  comparisons: AzureComparisonTable[];
  patterns: AzureArchitecturePattern[];
  pitfalls: AzurePitfall[];
  keyFacts: AzureKeyFact[];
  quickLookup: CertFlashcardItem[];
  practiceQuestions: CertQuestion[];
  officialResources: AzureOfficialResource[];
}

export const INITIAL_AZURE_CERT_DATA: AzureCertData = {
  examFacts: az900ExamFacts,
  domains: az900Domains,
  comparisons: az900Comparisons,
  patterns: az900Patterns,
  pitfalls: az900Pitfalls,
  keyFacts: az900KeyFacts,
  quickLookup: az900QuickLookup,
  practiceQuestions: az900PracticeQuestions,
  officialResources: az900OfficialResources,
};

const certDataCache = new Map<AzureCertId, AzureCertData>([["az900", INITIAL_AZURE_CERT_DATA]]);
const certLoadPromises = new Map<AzureCertId, Promise<AzureCertData>>();

export function getCachedAzureCertData(certId: AzureCertId): AzureCertData | undefined {
  return certDataCache.get(certId);
}

/**
 * Dynamically imports a single Azure certification dataset on demand so Next.js / Webpack
 * splits the other 7 exams into separate async chunks rather than bundling all upfront.
 */
export async function loadAzureCertData(certId: AzureCertId): Promise<AzureCertData> {
  const cached = certDataCache.get(certId);
  if (cached) return cached;

  const inflight = certLoadPromises.get(certId);
  if (inflight) return inflight;

  const loaderPromise = (async (): Promise<AzureCertData> => {
    let data: AzureCertData;
    switch (certId) {
      case "az900":
        data = INITIAL_AZURE_CERT_DATA;
        break;
      case "ai900": {
        const m = await import("@/data/azure-ai900");
        data = {
          examFacts: m.ai900ExamFacts,
          domains: m.ai900Domains,
          comparisons: m.ai900Comparisons,
          patterns: m.ai900Patterns,
          pitfalls: m.ai900Pitfalls,
          keyFacts: m.ai900KeyFacts,
          quickLookup: m.ai900QuickLookup,
          practiceQuestions: m.ai900PracticeQuestions,
          officialResources: m.ai900OfficialResources,
        };
        break;
      }
      case "dp900": {
        const m = await import("@/data/azure-dp900");
        data = {
          examFacts: m.dp900ExamFacts,
          domains: m.dp900Domains,
          comparisons: m.dp900Comparisons,
          patterns: m.dp900Patterns,
          pitfalls: m.dp900Pitfalls,
          keyFacts: m.dp900KeyFacts,
          quickLookup: m.dp900QuickLookup,
          practiceQuestions: m.dp900PracticeQuestions,
          officialResources: m.dp900OfficialResources,
        };
        break;
      }
      case "sc900": {
        const m = await import("@/data/azure-sc900");
        data = {
          examFacts: m.sc900ExamFacts,
          domains: m.sc900Domains,
          comparisons: m.sc900Comparisons,
          patterns: m.sc900Patterns,
          pitfalls: m.sc900Pitfalls,
          keyFacts: m.sc900KeyFacts,
          quickLookup: m.sc900QuickLookup,
          practiceQuestions: m.sc900PracticeQuestions,
          officialResources: m.sc900OfficialResources,
        };
        break;
      }
      case "az104": {
        const m = await import("@/data/azure-az104");
        data = {
          examFacts: m.az104ExamFacts,
          domains: m.az104Domains,
          comparisons: m.az104Comparisons,
          patterns: m.az104Patterns,
          pitfalls: m.az104Pitfalls,
          keyFacts: m.az104KeyFacts,
          quickLookup: m.az104QuickLookup,
          practiceQuestions: m.az104PracticeQuestions,
          officialResources: m.az104OfficialResources,
        };
        break;
      }
      case "ai103": {
        const m = await import("@/data/azure-ai103");
        data = {
          examFacts: m.ai103ExamFacts,
          domains: m.ai103Domains,
          comparisons: m.ai103Comparisons,
          patterns: m.ai103Patterns,
          pitfalls: m.ai103Pitfalls,
          keyFacts: m.ai103KeyFacts,
          quickLookup: m.ai103QuickLookup,
          practiceQuestions: m.ai103PracticeQuestions,
          officialResources: m.ai103OfficialResources,
        };
        break;
      }
      case "ai200": {
        const m = await import("@/data/azure-ai200");
        data = {
          examFacts: m.ai200ExamFacts,
          domains: m.ai200Domains,
          comparisons: m.ai200Comparisons,
          patterns: m.ai200Patterns,
          pitfalls: m.ai200Pitfalls,
          keyFacts: m.ai200KeyFacts,
          quickLookup: m.ai200QuickLookup,
          practiceQuestions: m.ai200PracticeQuestions,
          officialResources: m.ai200OfficialResources,
        };
        break;
      }
      case "az305": {
        const m = await import("@/data/azure-az305");
        data = {
          examFacts: m.az305ExamFacts,
          domains: m.az305Domains,
          comparisons: m.az305Comparisons,
          patterns: m.az305Patterns,
          pitfalls: m.az305Pitfalls,
          keyFacts: m.az305KeyFacts,
          quickLookup: m.az305QuickLookup,
          practiceQuestions: m.az305PracticeQuestions,
          officialResources: m.az305OfficialResources,
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
