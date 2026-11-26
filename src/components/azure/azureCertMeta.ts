import type { CertPassingConfig } from "../certification/types";

export type AzureCertId =
  | "az900"
  | "ai900"
  | "dp900"
  | "sc900"
  | "az104"
  | "ai103"
  | "ai200"
  | "az305";

export const AZURE_CERT_IDS: readonly AzureCertId[] = [
  "az900",
  "ai900",
  "dp900",
  "sc900",
  "az104",
  "ai103",
  "ai200",
  "az305",
];

export interface AzureCertMeta {
  id: AzureCertId;
  label: string;
  shortLabel: string;
  badgeText: string;
  headline: string;
  description: string;
  storageKey: string;
  defaultExpanded: Record<string, boolean>;
  passingConfig: CertPassingConfig;
  quizBadgeLabel: string;
  flashcardTitle: string;
  quickSearchChips: string[];
}

export const AZURE_CERT_META: Record<AzureCertId, AzureCertMeta> = {
  az900: {
    id: "az900",
    label: "Azure Fundamentals (AZ-900)",
    shortLabel: "AZ-900",
    badgeText: "MICROSOFT AZURE FUNDAMENTALS STUDY HUB",
    headline: "Azure Fundamentals（AZ-900）",
    description:
      "クラウドの基本概念・責任共有モデル・Azure コアサービス（Compute / Network / Storage / Entra ID）・コスト管理とガバナンスを網羅した入門認定試験の学習ハブです。進捗やメモはブラウザに自動保存されます。",
    storageKey: "ai-park-azure-az900-progress-v1",
    defaultExpanded: { "az900-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam AZ-900 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure AZ-900 演習",
    flashcardTitle: "AZ-900 要件・キーワード → Microsoft Azure サービス即答トレーニング",
    quickSearchChips: [
      "Azure VM",
      "App Service",
      "Azure Functions",
      "Entra ID",
      "Azure Policy",
      "Blob Storage",
    ],
  },
  ai900: {
    id: "ai900",
    label: "Azure AI Fundamentals (AI-900)",
    shortLabel: "AI-900",
    badgeText: "MICROSOFT AZURE AI FUNDAMENTALS STUDY HUB",
    headline: "Azure AI Fundamentals（AI-900）",
    description:
      "責任ある AI の 6 原則・機械学習（AutoML / 評価指標）・コンピューター ビジョン・自然言語処理（NLP）・Azure OpenAI Service / 生成 AI ワークロードを体系的に学ぶ学習ハブです。",
    storageKey: "ai-park-azure-ai900-progress-v1",
    defaultExpanded: { "ai900-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam AI-900 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure AI-900 演習",
    flashcardTitle: "AI-900 AIワークロード要件 → Azure AI サービス即答トレーニング",
    quickSearchChips: [
      "Azure OpenAI",
      "Azure AI Foundry",
      "Document Intelligence",
      "Azure AI Vision",
      "Azure AI Language",
      "AutoML",
      "RAG",
    ],
  },
  dp900: {
    id: "dp900",
    label: "Azure Data Fundamentals (DP-900)",
    shortLabel: "DP-900",
    badgeText: "MICROSOFT AZURE DATA FUNDAMENTALS STUDY HUB",
    headline: "Azure Data Fundamentals（DP-900）",
    description:
      "コアデータ概念（構造化/半構造化/非構造化・OLTP/OLAP）・Azure SQL / PostgreSQL・Blob / ADLS Gen2 / Cosmos DB・Azure Data Factory / Synapse / Microsoft Fabric / Power BI を網羅したデータ基礎認定試験の学習ハブです。",
    storageKey: "ai-park-azure-dp900-progress-v1",
    defaultExpanded: { "dp900-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam DP-900 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure DP-900 演習",
    flashcardTitle: "DP-900 データ要件・ユースケース → Microsoft Azure データサービス即答トレーニング",
    quickSearchChips: [
      "Azure SQL",
      "Cosmos DB",
      "ADLS Gen2",
      "Microsoft Fabric",
      "Synapse",
      "Power BI",
    ],
  },
  sc900: {
    id: "sc900",
    label: "Security Fundamentals (SC-900)",
    shortLabel: "SC-900",
    badgeText: "MICROSOFT SECURITY, COMPLIANCE & IDENTITY STUDY HUB",
    headline: "Security, Compliance, and Identity Fundamentals（SC-900）",
    description:
      "ゼロトラスト原則・Microsoft Entra ID（MFA / 条件付きアクセス / PIM）・Microsoft Defender for Cloud / Sentinel / Defender XDR・Microsoft Purview による情報保護とコンプライアンスを学ぶ基礎学習ハブです。",
    storageKey: "ai-park-azure-sc900-progress-v1",
    defaultExpanded: { "sc900-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam SC-900 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure SC-900 演習",
    flashcardTitle: "SC-900 セキュリティ・ID・コンプライアンス要件 → Microsoft ソリューション即答トレーニング",
    quickSearchChips: [
      "Entra ID",
      "Conditional Access",
      "Defender for Cloud",
      "Microsoft Sentinel",
      "Microsoft Purview",
      "Zero Trust",
    ],
  },
  az104: {
    id: "az104",
    label: "Azure Administrator (AZ-104)",
    shortLabel: "AZ-104",
    badgeText: "MICROSOFT AZURE ADMINISTRATOR STUDY HUB",
    headline: "Azure Administrator Associate（AZ-104）",
    description:
      "Entra ID・RBAC・Azure Policy・ストレージ冗長性＆SAS・ARM/Bicep・VM/VMSS/AKS/App Service・VNet/NSG/VPN・Azure Monitor/Backup の運用管理を学ぶ実践学習ハブです。",
    storageKey: "ai-park-azure-az104-progress-v1",
    defaultExpanded: { "az104-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam AZ-104 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure AZ-104 演習",
    flashcardTitle: "AZ-104 運用要件 → Azure 管理機能・CLI/Bicep 即答トレーニング",
    quickSearchChips: [
      "RBAC",
      "Azure Policy",
      "Bicep",
      "VNet ピアリング",
      "NSG",
      "AzCopy",
      "Azure Backup",
    ],
  },
  ai103: {
    id: "ai103",
    label: "AI Apps & Agents (AI-103)",
    shortLabel: "AI-103",
    badgeText: "MICROSOFT AZURE AI APPS & AGENTS STUDY HUB",
    headline: "Azure AI Apps & Agents Developer（AI-103）",
    description:
      "旧 Exam AI-102（2026年6月廃止）の後継試験として刷新された AI アプリケーション＆エージェント開発認定の学習ハブです。Microsoft Foundry・Agent Service・Azure AI Search (RAG)・Vision / Language / Speech・Document Intelligence・Content Safety の設計と実装を網羅します。",
    storageKey: "ai-park-azure-ai103-progress-v1",
    defaultExpanded: { "ai103-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam AI-103 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure AI-103 演習",
    flashcardTitle: "AI-103 生成AI・エージェント・情報抽出要件 → Microsoft Foundry / Azure AI 即答トレーニング",
    quickSearchChips: [
      "Microsoft Foundry",
      "Agent Service",
      "Azure AI Search",
      "Document Intelligence",
      "Content Safety",
      "RAG",
    ],
  },
  ai200: {
    id: "ai200",
    label: "AI Cloud Developer (AI-200)",
    shortLabel: "AI-200",
    badgeText: "MICROSOFT AZURE AI CLOUD DEVELOPER STUDY HUB",
    headline: "Azure AI Cloud Developer（AI-200）",
    description:
      "旧 Exam AZ-204（2026年7月廃止）の後継試験として刷新されたクラウドネイティブ＆AI 基盤開発認定の学習ハブです。Container Apps / AKS・Cosmos DB / PostgreSQL (pgvector) / Managed Redis・Service Bus / Event Grid / Functions・Key Vault / OpenTelemetry 観測性を体系的に学びます。",
    storageKey: "ai-park-azure-ai200-progress-v1",
    defaultExpanded: { "ai200-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam AI-200 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure AI-200 演習",
    flashcardTitle: "AI-200 コンテナ・ベクターDB・イベント・観測性要件 → Azure 開発サービス即答トレーニング",
    quickSearchChips: [
      "Container Apps",
      "Cosmos DB",
      "pgvector",
      "Service Bus",
      "Event Grid",
      "Key Vault",
      "OpenTelemetry",
    ],
  },
  az305: {
    id: "az305",
    label: "Azure Solutions Architect (AZ-305)",
    shortLabel: "AZ-305",
    badgeText: "MICROSOFT AZURE SOLUTIONS ARCHITECT EXPERT STUDY HUB",
    headline: "Azure Solutions Architect Expert（AZ-305）",
    description:
      "ランディングゾーン（CAF）・Entra ID / Key Vault 設計・Azure SQL / Cosmos DB 整合性設計・RPO/RTO & 高可用性・ハブ＆スポーク / Virtual WAN・Well-Architected 設計力を問う上級学習ハブです。",
    storageKey: "ai-park-azure-az305-progress-v1",
    defaultExpanded: { "az305-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "Exam AZ-305 本試験（合格基準 700 / 1000 点）",
    },
    quizBadgeLabel: "Azure AZ-305 演習",
    flashcardTitle: "AZ-305 設計要件・制約 → Azure アーキテクチャ選択即答トレーニング",
    quickSearchChips: [
      "Cosmos DB",
      "Azure SQL",
      "Front Door",
      "Virtual WAN",
      "Private Link",
      "Managed ID",
      "Savings Plan",
    ],
  },
};
