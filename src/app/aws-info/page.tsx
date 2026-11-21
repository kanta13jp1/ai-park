"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Cloud,
  ShieldCheck,
  Layers,
  Zap,
  Coins,
  Cpu,
  Network,
  CheckCircle2,
  Circle,
  BookOpen,
  TableProperties,
  HelpCircle,
  Compass,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Award,
  Lightbulb,
  Search,
  EyeOff,
  ChevronsUpDown,
  Sparkles,
  Layers2,
  ArrowRight,
  X,
  StickyNote,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Gauge,
  Brain,
  Bot,
  Lock,
  Terminal,
  GitBranch,
  Activity,
  Workflow,
} from "lucide-react";
import HeroBanner from "@/components/HeroBanner";
import TiltCard from "@/components/TiltCard";
import SpotlightCard from "@/components/SpotlightCard";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import CertificationFlashcards from "@/components/certification/CertificationFlashcards";
import CertificationPracticeQuiz, {
  isQuestionCorrect,
} from "@/components/certification/CertificationPracticeQuiz";
import type {
  CertMockExamRecord,
  CertPassingConfig,
  CertQuizDomain,
} from "@/components/certification/types";
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
  saaWellArchitectedPillars,
  resolveAwsServiceQuery,
  type SaaDomain,
  type SaaExamFact,
  type SaaComparisonTable,
  type SaaQuickLookupItem,
  type SaaQuestion,
  type SaaOfficialResource,
  type SaaArchitecturePattern,
  type SaaPitfall,
  type SaaLimitFact,
} from "@/data/aws-saa";
import {
  clfExamFacts,
  clfDomains,
  clfComparisons,
  clfQuickLookup,
  clfPracticeQuestions,
  clfOfficialResources,
  clfArchitecturePatterns,
  clfPitfalls,
  clfKeyLimits,
  resolveClfServiceQuery,
} from "@/data/aws-clf";
import {
  aifExamFacts,
  aifDomains,
  aifComparisons,
  aifQuickLookup,
  aifPracticeQuestions,
  aifOfficialResources,
  aifArchitecturePatterns,
  aifPitfalls,
  aifKeyLimits,
  resolveAifServiceQuery,
} from "@/data/aws-aif";
import {
  dvaExamFacts,
  dvaDomains,
  dvaComparisons,
  dvaQuickLookup,
  dvaPracticeQuestions,
  dvaOfficialResources,
  dvaArchitecturePatterns,
  dvaPitfalls,
  dvaKeyLimits,
  resolveDvaServiceQuery,
} from "@/data/aws-dva";
import {
  soaExamFacts,
  soaDomains,
  soaComparisons,
  soaQuickLookup,
  soaPracticeQuestions,
  soaOfficialResources,
  soaArchitecturePatterns,
  soaPitfalls,
  soaKeyLimits,
  resolveSoaServiceQuery,
} from "@/data/aws-soa";
import {
  sapExamFacts,
  sapDomains,
  sapComparisons,
  sapQuickLookup,
  sapPracticeQuestions,
  sapOfficialResources,
  sapArchitecturePatterns,
  sapPitfalls,
  sapKeyLimits,
  resolveSapServiceQuery,
} from "@/data/aws-sap";
import { playCyberClick, playCyberHover } from "@/lib/sound";

type AwsCertId = "clf" | "aif" | "saa" | "dva" | "soa" | "sap";
type AwsCertLevel = "Foundational" | "Associate" | "Professional";
type TabId = "domains" | "comparisons" | "flashcards" | "quiz" | "resources";

interface AwsCertProgress {
  completedTopics: string[];
  quizAnswers: Record<string, number[]>;
  bookmarkedQuestions: string[];
  masteredCards: string[];
  topicNotes: Record<string, string>;
  mockExamHistory: CertMockExamRecord[];
}

interface AwsCertConfig {
  id: AwsCertId;
  shortCode: string;
  level: AwsCertLevel;
  switchLabel: string;
  hudBadgeText: string;
  headlineLead: string;
  headlineSuffix: string;
  description: string;
  storageKey: string;
  passingConfig: CertPassingConfig;
  secondsPerQuestion: number;
  defaultExpanded: Record<string, boolean>;
  quizBadgeLabel: string;
  quickSearchChips: string[];
  domainShortLabels: Record<string, string>;
  roadmapSteps: {
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step4Desc: string;
  };
  examDayChecklist: {
    subtitle: string;
    tips: { title: string; body: string }[];
  };
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

const DEFAULT_PROGRESS: AwsCertProgress = {
  completedTopics: [],
  quizAnswers: {},
  bookmarkedQuestions: [],
  masteredCards: [],
  topicNotes: {},
  mockExamHistory: [],
};

const AWS_CERT_CONFIG: Record<AwsCertId, AwsCertConfig> = {
  clf: {
    id: "clf",
    shortCode: "CLF-C02",
    level: "Foundational",
    switchLabel: "Cloud Practitioner (CLF-C02)",
    hudBadgeText: "AWS CLF-C02 STUDY HUB",
    headlineLead: "AWS認定クラウドプラクティショナー",
    headlineSuffix: "- 基礎 合格対策",
    description:
      "試験ガイド（CLF-C02）の4つの出題ドメインに沿って、クラウドの基礎概念・責任共有モデル・主要サービスの役割・料金とサポートプランをまとめた入門〜基礎学習ハブです。学習記録はブラウザに自動保存されます。",
    storageKey: "ai-park-aws-clf-progress-v1",
    passingConfig: {
      minScore: 100,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "AWS公式模擬試験 (CLF-C02)",
    },
    secondsPerQuestion: 90,
    defaultExpanded: { "clf-domain-1": true },
    quizBadgeLabel: "CLF-C02 本番形式演習",
    quickSearchChips: ["EC2", "S3", "IAM", "責任共有モデル", "サポートプラン", "Budgets"],
    domainShortLabels: {
      "clf-domain-1": "D1: クラウドコンセプト",
      "clf-domain-2": "D2: セキュリティ",
      "clf-domain-3": "D3: テクノロジー・サービス",
      "clf-domain-4": "D4: 請求・料金・サポート",
    },
    roadmapSteps: {
      step1Title: "クラウド概念と責任共有モデル",
      step1Desc:
        "AWS クラウド採用のメリット、グローバルインフラ（リージョン / AZ）、AWS と顧客の責任境界を整理する。",
      step2Title: "主要サービスと料金体系の整理",
      step2Desc:
        "本ページの「4ドメイン攻略」と「頻出比較表」を使い、EC2 / Lambda / S3 / RDS やサポートプラン4種の違いを押さえる。",
      step4Desc:
        "90分で65問（1問約1.4分）のペース配分を確認し、苦手ドメインを重点復習して本番（合格ライン 700点）に臨む。",
    },
    examDayChecklist: {
      subtitle:
        "CLF-C02 は90分で65問を出題します。基礎用語の正確な区別と責任共有モデル・料金管理の整理が合格（700点）の鍵です。",
      tips: [
        {
          title: "1問約1.4分ペース（65問で90分）",
          body: "30問経過時点で残り45分前後が目安。迷う問題はフラグ（見直しマーク）を付けて仮選択し、一通り解き終えてから見直すのが確実です。",
        },
        {
          title: "非採点問題（15問）に動揺しない",
          body: "65問のうち15問は採点対象外の試験的設問です。見慣れないサービス名や設問が出ても動揺せず、基本問題で着実に得点（700点以上）を狙います。",
        },
        {
          title: "責任共有モデルとサポートプランを即答",
          body: "「AWS の責任か顧客の責任か」「どのサポートプランから TAM や全項目 Trusted Advisor が付くか」は頻出のため、瞬時に判断できるように整理しておきます。",
        },
        {
          title: "ピアソンVUE 受験準備（オンライン/会場）",
          body: "オンライン受験（OnVUE）の場合は事前のシステムテストと静かな個室・本人確認書類が必須。英語試験から切り替える場合、AWS認定ポータルで事前申請すると試験時間+30分延長（ESL）が利用可能です。",
        },
      ],
    },
    examFacts: clfExamFacts,
    domains: clfDomains,
    comparisons: clfComparisons,
    quickLookup: clfQuickLookup,
    practiceQuestions: clfPracticeQuestions,
    officialResources: clfOfficialResources,
    architecturePatterns: clfArchitecturePatterns,
    pitfalls: clfPitfalls,
    keyLimits: clfKeyLimits,
    resolveServiceQuery: resolveClfServiceQuery,
  },
  aif: {
    id: "aif",
    shortCode: "AIF-C01",
    level: "Foundational",
    switchLabel: "AI Practitioner (AIF-C01)",
    hudBadgeText: "AWS AIF-C01 STUDY HUB",
    headlineLead: "AWS認定 AI プラクティショナー",
    headlineSuffix: "- 基礎 合格対策",
    description:
      "試験ガイド（AIF-C01）の5つの出題ドメインに沿って、AI/ML基礎・生成AI・Amazon Bedrock / Knowledge Bases (RAG) / Guardrails / Amazon Q の選定基準・責任あるAI・ガバナンスをまとめた学習ハブです。学習記録はブラウザに自動保存されます。",
    storageKey: "ai-park-aws-aif-progress-v1",
    passingConfig: {
      minScore: 100,
      maxScore: 1000,
      passingScore: 700,
      passingPct: 70,
      officialExamLabel: "AWS公式模擬試験 (AIF-C01)",
    },
    secondsPerQuestion: 90,
    defaultExpanded: { "aif-domain-1": true },
    quizBadgeLabel: "AIF-C01 本番形式演習",
    quickSearchChips: ["Bedrock", "RAG", "SageMaker", "Guardrails", "Amazon Q", "責任あるAI"],
    domainShortLabels: {
      "aif-domain-1": "D1: AI・ML基礎",
      "aif-domain-2": "D2: 生成AI基礎",
      "aif-domain-3": "D3: 基盤モデル活用",
      "aif-domain-4": "D4: 責任あるAI",
      "aif-domain-5": "D5: セキュリティ・ガバナンス",
    },
    roadmapSteps: {
      step1Title: "AI/ML と生成 AI の基礎概念",
      step1Desc:
        "教師あり/教師なし/強化学習の使い分けや、基盤モデル（FM）・トークン・埋め込み・コンテキストウィンドウの仕組みを理解する。",
      step2Title: "Bedrock・RAG・カスタマイズ手法の選定",
      step2Desc:
        "本ページの「5ドメイン攻略」と「頻出比較表」を使い、プロンプトエンジニアリング・RAG（Knowledge Bases）・Fine-Tuning の違いを押さえる。",
      step4Desc:
        "90分で65問（1問約1.4分）のペース配分を確認し、苦手ドメインを重点復習して本番（合格ライン 700点）に臨む。",
    },
    examDayChecklist: {
      subtitle:
        "AIF-C01 は90分で65問を出題します。AI ユースケースに適した AWS サービスの選定と責任ある AI・セキュリティ原則の区別が合格（700点）の鍵です。",
      tips: [
        {
          title: "1問約1.4分ペース（65問で90分）",
          body: "30問経過時点で残り45分前後が目安。用語比較や短いユースケース判断が多いため、迷う問題はフラグ（見直しマーク）を付けて一通り解き終えてから見直します。",
        },
        {
          title: "非採点問題（15問）に動揺しない",
          body: "65問のうち15問は採点対象外の試験的設問です。見慣れない生成 AI 機能や細かなモデル名が出ても動揺せず、基本の選定軸で着実に得点（700点以上）を狙います。",
        },
        {
          title: "Customization 手法（Prompt / RAG / Fine-Tuning）を見極める",
          body: "「最新の社内ドキュメントを参照」＝ RAG（Bedrock Knowledge Bases）、「特定ドメインの出力形式・口調調整」＝ Fine-Tuning、「追加学習なしで試す」＝ プロンプトエンジニアリング、を軸に絞ります。",
        },
        {
          title: "ピアソンVUE 受験準備（オンライン/会場）",
          body: "オンライン受験（OnVUE）の場合は事前のシステムテストと静かな個室・本人確認書類が必須。英語試験から切り替える場合、AWS認定ポータルで事前申請すると試験時間+30分延長（ESL）が利用可能です。",
        },
      ],
    },
    examFacts: aifExamFacts,
    domains: aifDomains,
    comparisons: aifComparisons,
    quickLookup: aifQuickLookup,
    practiceQuestions: aifPracticeQuestions,
    officialResources: aifOfficialResources,
    architecturePatterns: aifArchitecturePatterns,
    pitfalls: aifPitfalls,
    keyLimits: aifKeyLimits,
    resolveServiceQuery: resolveAifServiceQuery,
  },
  saa: {
    id: "saa",
    shortCode: "SAA-C03",
    level: "Associate",
    switchLabel: "Solutions Architect Associate (SAA-C03)",
    hudBadgeText: "AWS SAA-C03 STUDY HUB",
    headlineLead: "AWS認定ソリューションアーキテクト",
    headlineSuffix: "- アソシエイト 合格対策",
    description:
      "試験ガイド（SAA-C03）の4つの出題ドメインに沿って、頻出サービスの選定基準・フラッシュカード暗記・択一＆複数選択の実践問題をまとめた学習サイトです。学習記録はブラウザに自動保存されます。",
    storageKey: "ai-park-aws-saa-progress-v1",
    passingConfig: {
      minScore: 100,
      maxScore: 1000,
      passingScore: 720,
      passingPct: 72,
      officialExamLabel: "AWS公式模擬試験 (SAA-C03)",
    },
    secondsPerQuestion: 120,
    defaultExpanded: {
      "domain-1": true,
      "domain-2": true,
      "domain-3": false,
      "domain-4": false,
    },
    quizBadgeLabel: "SAA-C03 本番形式演習",
    quickSearchChips: ["S3", "VPC", "RDS", "Lambda", "IAM", "SQS", "CloudFront"],
    domainShortLabels: {
      "domain-1": "D1: セキュリティ",
      "domain-2": "D2: 弾力性",
      "domain-3": "D3: 高パフォーマンス",
      "domain-4": "D4: コスト最適化",
    },
    roadmapSteps: {
      step1Title: "全体像とネットワーク基礎",
      step1Desc:
        "VPC（サブネット、ルートテーブル、IGW/NAT、SG/NACL）と IAM の仕組みを図解で理解する。",
      step2Title: "コアサービスの使い分け",
      step2Desc:
        "本ページの「4ドメイン攻略」と「頻出比較表」を使い、EBS/EFS/S3 や ALB/NLB、SQS/SNS の違いを整理する。",
      step4Desc:
        "130分で65問（1問約2分）のペース配分を確認し、苦手ドメインを重点復習して本番に臨む。",
    },
    examDayChecklist: {
      subtitle:
        "SAA-C03 は長文シナリオが多いため、技術知識に加えて時間配分と迷ったときの戦略が合否を分けます。",
      tips: [
        {
          title: "1問2分ペース（65問で130分）",
          body: "30問経過時点で残り70分前後が目安。長考しそうな問題は「フラグ（見直しマーク）」を付けて仮選択し、最後まで走り切ってから戻るのが鉄則です。",
        },
        {
          title: "非採点問題（15問）に動揺しない",
          body: "65問のうち15問は採点対象外のパイロット問題です。見慣れない新サービスや難問が出ても「非採点問題かもしれない」と割り切ってリズムを崩さないことが大切です。",
        },
        {
          title: "要件のキーワードを先に拾う",
          body: "問題文末尾の「最もコスト効率が高い」「運用負荷を最小限に」「最もセキュアに」を先に読み、Well-Architected のどの柱が問われているかを特定します。",
        },
        {
          title: "ピアソンVUE 受験準備（オンライン/会場）",
          body: "オンライン受験（OnVUE）の場合は事前のシステムテストと静かな個室・本人確認書類が必須。英語試験から切り替える場合、AWS認定ポータルで事前申請すると試験時間+30分延長（ESL）が利用可能です。",
        },
      ],
    },
    examFacts: saaExamFacts,
    domains: saaDomains,
    comparisons: saaComparisons,
    quickLookup: saaQuickLookup,
    practiceQuestions: saaPracticeQuestions,
    officialResources: saaOfficialResources,
    architecturePatterns: saaArchitecturePatterns,
    pitfalls: saaPitfalls,
    keyLimits: saaKeyLimits,
    resolveServiceQuery: resolveAwsServiceQuery,
  },
  dva: {
    id: "dva",
    shortCode: "DVA-C02",
    level: "Associate",
    switchLabel: "Developer Associate (DVA-C02)",
    hudBadgeText: "AWS DVA-C02 STUDY HUB",
    headlineLead: "AWS認定デベロッパー",
    headlineSuffix: "- アソシエイト 合格対策",
    description:
      "試験ガイド（DVA-C02）の4つの出題ドメインに沿って、Lambda / API Gateway / DynamoDB の実装・Cognito / KMS によるセキュリティ・SAM / CodeDeploy 等のデプロイ・X-Ray / CloudWatch による最適化をまとめた学習ハブです。学習記録はブラウザに自動保存されます。",
    storageKey: "ai-park-aws-dva-progress-v1",
    passingConfig: {
      minScore: 100,
      maxScore: 1000,
      passingScore: 720,
      passingPct: 72,
      officialExamLabel: "AWS公式模擬試験 (DVA-C02)",
    },
    secondsPerQuestion: 120,
    defaultExpanded: { "dva-domain-1": true },
    quizBadgeLabel: "DVA-C02 本番形式演習",
    quickSearchChips: ["Lambda", "DynamoDB", "API Gateway", "Cognito", "CodeDeploy", "X-Ray"],
    domainShortLabels: {
      "dva-domain-1": "D1: サービス開発",
      "dva-domain-2": "D2: セキュリティ",
      "dva-domain-3": "D3: デプロイ",
      "dva-domain-4": "D4: トラブルシュート・最適化",
    },
    roadmapSteps: {
      step1Title: "サーバーレス開発と認証・暗号化の基礎",
      step1Desc:
        "Lambda 呼び出しモデル・API Gateway 統合・DynamoDB パーティションキー設計と、IAM ロール / STS / KMS エンベロープ暗号化の仕組みを理解する。",
      step2Title: "API・DB・CI/CD・監視ツールの使い分け",
      step2Desc:
        "本ページの「4ドメイン攻略」と「頻出比較表」を使い、DynamoDB GSI/LSI・Cognito User/Identity Pool・SAM / CodeDeploy の違いを整理する。",
      step4Desc:
        "130分で65問（1問約2分）のペース配分を確認し、苦手ドメインを重点復習して本番（合格ライン 720点）に臨む。",
    },
    examDayChecklist: {
      subtitle:
        "DVA-C02 は130分で65問を出題します。サーバーレス設計・IAM/KMS・CI/CD・X-Ray による原因切り分けなど実装視点の的確な判断が合格（720点）の鍵です。",
      tips: [
        {
          title: "1問2分ペース（65問で130分）",
          body: "30問経過時点で残り70分前後が目安。IAM ポリシーや YAML 定義・DynamoDB キャパシティ計算に時間を掛けすぎず、迷う問題はフラグを付けて先へ進みます。",
        },
        {
          title: "非採点問題（15問）に動揺しない",
          body: "65問のうち15問は採点対象外のパイロット設問です。細かな SDK パラメータや見慣れない設定オプションが出てもペースを崩さず、720点以上を目指します。",
        },
        {
          title: "DynamoDB・Lambda・KMS の制約値を即断",
          body: "DynamoDB アイテム上限 400KB や RCU/WCU 計算、Lambda のペイロード/同時実行数制御（Reserved vs Provisioned）、KMS 4KB 制限とエンベロープ暗号化（GenerateDataKey）を整理しておきます。",
        },
        {
          title: "ピアソンVUE 受験準備（オンライン/会場）",
          body: "オンライン受験（OnVUE）の場合は事前のシステムテストと静かな個室・本人確認書類が必須。英語試験から切り替える場合、AWS認定ポータルで事前申請すると試験時間+30分延長（ESL）が利用可能です。",
        },
      ],
    },
    examFacts: dvaExamFacts,
    domains: dvaDomains,
    comparisons: dvaComparisons,
    quickLookup: dvaQuickLookup,
    practiceQuestions: dvaPracticeQuestions,
    officialResources: dvaOfficialResources,
    architecturePatterns: dvaArchitecturePatterns,
    pitfalls: dvaPitfalls,
    keyLimits: dvaKeyLimits,
    resolveServiceQuery: resolveDvaServiceQuery,
  },
  soa: {
    id: "soa",
    shortCode: "SOA-C03",
    level: "Associate",
    switchLabel: "CloudOps Engineer (SOA-C03)",
    hudBadgeText: "AWS SOA-C03 STUDY HUB",
    headlineLead: "AWS認定 CloudOps エンジニア",
    headlineSuffix: "- アソシエイト 合格対策",
    description:
      "試験ガイド（SOA-C03 / 旧 SysOps 改定）の5つの出題ドメインに沿って、CloudWatch / Systems Manager を軸とした監視・自動修復・バックアップ/DR・IaC プロビジョニング・運用セキュリティ・ネットワーク障害切り分けをまとめた学習ハブです。学習記録はブラウザに自動保存されます。",
    storageKey: "ai-park-aws-soa-progress-v1",
    passingConfig: {
      minScore: 100,
      maxScore: 1000,
      passingScore: 720,
      passingPct: 72,
      officialExamLabel: "AWS公式模擬試験 (SOA-C03)",
    },
    secondsPerQuestion: 120,
    defaultExpanded: { "soa-domain-1": true },
    quizBadgeLabel: "SOA-C03 本番形式演習",
    quickSearchChips: ["CloudWatch", "SSM", "Config", "Backup", "CloudFormation", "VPC"],
    domainShortLabels: {
      "soa-domain-1": "D1: 監視・ロギング・修復",
      "soa-domain-2": "D2: 信頼性・BCP",
      "soa-domain-3": "D3: デプロイ・自動化",
      "soa-domain-4": "D4: セキュリティ・準拠",
      "soa-domain-5": "D5: ネットワーク・配信",
    },
    roadmapSteps: {
      step1Title: "監視基盤と Systems Manager 運用の基礎",
      step1Desc:
        "CloudWatch メトリクス/ログ/複合アラーム、CloudTrail、EventBridge＋SSM Automation による自動修復やパッチ管理の仕組みを理解する。",
      step2Title: "可用性・IaC・ネットワーク切り分けの整理",
      step2Desc:
        "本ページの「5ドメイン攻略」と「頻出比較表」を使い、AWS Backup / CloudFormation ドリフト検出 / VPC Flow Logs・Reachability Analyzer の使い分けを押さえる。",
      step4Desc:
        "130分で65問（1問約2分）のペース配分を確認し、苦手ドメインを重点復習して本番（合格ライン 720点）に臨む。",
    },
    examDayChecklist: {
      subtitle:
        "SOA-C03 は130分で65問を出題します。監視・障害切り分け・自動修復・IaC 運用とパッチ/バックアップ管理の的確な運用手順選択が合格（720点）の鍵です。",
      tips: [
        {
          title: "1問2分ペース（65問で130分）",
          body: "30問経過時点で残り70分前後が目安。ネットワーク接続障害の切り分けや CloudFormation テンプレート設問で詰まりすぎないよう、フラグ機能を活用します。",
        },
        {
          title: "非採点問題（15問）に動揺しない",
          body: "65問のうち15問は採点対象外の試験的設問です。見慣れない運用シナリオが出ても焦らず、基本の監視・セキュリティ・自動化パターンで720点以上を狙います。",
        },
        {
          title: "「自動修復」「接続障害切り分け」の定番パターンを押さえる",
          body: "設定違反の自動修復＝ AWS Config ＋ SSM Automation、イベント駆動＝ EventBridge、SSH 不要アクセス＝ SSM Session Manager、到達性調査＝ VPC Reachability Analyzer を即答できるようにします。",
        },
        {
          title: "ピアソンVUE 受験準備（オンライン/会場）",
          body: "オンライン受験（OnVUE）の場合は事前のシステムテストと静かな個室・本人確認書類が必須。英語試験から切り替える場合、AWS認定ポータルで事前申請すると試験時間+30分延長（ESL）が利用可能です。",
        },
      ],
    },
    examFacts: soaExamFacts,
    domains: soaDomains,
    comparisons: soaComparisons,
    quickLookup: soaQuickLookup,
    practiceQuestions: soaPracticeQuestions,
    officialResources: soaOfficialResources,
    architecturePatterns: soaArchitecturePatterns,
    pitfalls: soaPitfalls,
    keyLimits: soaKeyLimits,
    resolveServiceQuery: resolveSoaServiceQuery,
  },
  sap: {
    id: "sap",
    shortCode: "SAP-C02",
    level: "Professional",
    switchLabel: "Solutions Architect Professional (SAP-C02)",
    hudBadgeText: "AWS SAP-C02 STUDY HUB",
    headlineLead: "AWS認定ソリューションアーキテクト",
    headlineSuffix: "- プロフェッショナル 合格対策",
    description:
      "試験ガイド（SAP-C02）の4つの出題ドメインに沿って、マルチアカウント統制・ハイブリッドネットワーク・大規模移行・モダナイゼーションの実践設計力を鍛える上級学習ハブです。学習記録はブラウザに自動保存されます。",
    storageKey: "ai-park-aws-sap-progress-v1",
    passingConfig: {
      minScore: 100,
      maxScore: 1000,
      passingScore: 750,
      passingPct: 75,
      officialExamLabel: "AWS公式模擬試験 (SAP-C02)",
    },
    secondsPerQuestion: 140,
    defaultExpanded: { "sap-domain-1": true },
    quizBadgeLabel: "SAP-C02 本番形式演習",
    quickSearchChips: [
      "Organizations",
      "Transit Gateway",
      "Direct Connect",
      "Control Tower",
      "DMS",
      "MGN",
      "CodeDeploy",
    ],
    domainShortLabels: {
      "sap-domain-1": "D1: 複雑な組織",
      "sap-domain-2": "D2: 新規設計",
      "sap-domain-3": "D3: 継続的改善",
      "sap-domain-4": "D4: 移行・モダナイズ",
    },
    roadmapSteps: {
      step1Title: "マルチアカウント統制と接続設計",
      step1Desc:
        "AWS Organizations / Control Tower / SCP と Transit Gateway・Direct Connect を軸にしたエンタープライズ基盤を理解する。",
      step2Title: "複合要件の設計トレードオフ",
      step2Desc:
        "本ページの「4ドメイン攻略」と「頻出比較表」を使い、大規模移行（MGN / DMS）やマルチリージョン構成を比較整理する。",
      step4Desc:
        "180分で75問（1問約2.4分）の長文読解ペースを確認し、苦手ドメインを重点復習して本番（合格ライン 750点）に臨む。",
    },
    examDayChecklist: {
      subtitle:
        "SAP-C02 は長文の複合シナリオが75問・180分続く上級試験です。要件と制約を素早く構造化する読解戦略が合格（750点）の鍵になります。",
      tips: [
        {
          title: "1問約2.4分ペース（75問で180分）",
          body: "25問あたり60分（1時間）が基準ペース。長文に時間を奪われすぎないよう、フラグ機能を使って2分半を超えそうな問題は仮回答で次へ進みます。",
        },
        {
          title: "非採点問題（10問）に動揺しない",
          body: "75問のうち10問は採点対象外の試験的設問です。高度なニッチ機能が出ても焦らず、65問の採点問題で750点ラインの達成を目指します。",
        },
        {
          title: "要件と制約の「除外条件」から絞る",
          body: "SAP-C02 の選択肢はどれも技術的に実現可能なものが並びます。「ダウンタイム最小」「コード変更不可」「運用負荷最小」などの制約条件に反する選択肢を消去法で落とすのが効果的です。",
        },
        {
          title: "ピアソンVUE 受験準備と ESL +30分申請",
          body: "3時間の長丁場となるため集中力の維持が重要です。英語以外の母語受験者は AWS認定ポータルで事前申請することで試験時間 +30分延長（ESL）を利用できます（予約前申請推奨）。",
        },
      ],
    },
    examFacts: sapExamFacts,
    domains: sapDomains,
    comparisons: sapComparisons,
    quickLookup: sapQuickLookup,
    practiceQuestions: sapPracticeQuestions,
    officialResources: sapOfficialResources,
    architecturePatterns: sapArchitecturePatterns,
    pitfalls: sapPitfalls,
    keyLimits: sapKeyLimits,
    resolveServiceQuery: resolveSapServiceQuery,
  },
};

const DOMAIN_ICONS: Record<string, typeof ShieldCheck> = {
  "clf-domain-1": Cloud,
  "clf-domain-2": ShieldCheck,
  "clf-domain-3": Cpu,
  "clf-domain-4": Coins,
  "aif-domain-1": Brain,
  "aif-domain-2": Sparkles,
  "aif-domain-3": Bot,
  "aif-domain-4": ShieldCheck,
  "aif-domain-5": Lock,
  "domain-1": ShieldCheck,
  "domain-2": Layers,
  "domain-3": Zap,
  "domain-4": Coins,
  "dva-domain-1": Terminal,
  "dva-domain-2": ShieldCheck,
  "dva-domain-3": GitBranch,
  "dva-domain-4": Activity,
  "soa-domain-1": Activity,
  "soa-domain-2": Layers,
  "soa-domain-3": Workflow,
  "soa-domain-4": ShieldCheck,
  "soa-domain-5": Network,
  "sap-domain-1": Network,
  "sap-domain-2": Layers,
  "sap-domain-3": Gauge,
  "sap-domain-4": Zap,
};

const ACCENT_STYLES: Record<
  SaaDomain["accentColor"],
  { badge: string; bar: string; border: string; iconBg: string }
> = {
  indigo: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    bar: "bg-indigo-500",
    border: "border-indigo-200/80",
    iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
    border: "border-emerald-200/80",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  amber: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    bar: "bg-amber-500",
    border: "border-amber-200/80",
    iconBg: "bg-amber-50 text-amber-600 border-amber-100",
  },
  cyan: {
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
    bar: "bg-cyan-500",
    border: "border-cyan-200/80",
    iconBg: "bg-cyan-50 text-cyan-600 border-cyan-100",
  },
};

function normalizeQuizAnswers(raw: unknown): Record<string, number[]> {
  if (!raw || typeof raw !== "object") return {};
  const result: Record<string, number[]> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(v)) {
      result[k] = v.filter((n): n is number => typeof n === "number");
    } else if (typeof v === "number") {
      result[k] = [v];
    }
  }
  return result;
}

function normalizeStringArray(raw: unknown): string[] {
  return Array.isArray(raw) ? raw.filter((s): s is string => typeof s === "string") : [];
}

function normalizeStringRecord(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === "string") result[k] = v;
  }
  return result;
}

function normalizeMockExamHistory(raw: unknown): CertMockExamRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is CertMockExamRecord =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as CertMockExamRecord).date === "string" &&
        typeof (item as CertMockExamRecord).correct === "number" &&
        typeof (item as CertMockExamRecord).total === "number" &&
        typeof (item as CertMockExamRecord).scaledScore === "number"
    )
    .slice(0, 5);
}

function loadAwsProgress(storageKey: string): AwsCertProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      completedTopics: normalizeStringArray(parsed.completedTopics),
      quizAnswers: normalizeQuizAnswers(parsed.quizAnswers),
      bookmarkedQuestions: normalizeStringArray(parsed.bookmarkedQuestions),
      masteredCards: normalizeStringArray(parsed.masteredCards),
      topicNotes: normalizeStringRecord(parsed.topicNotes),
      mockExamHistory: normalizeMockExamHistory(parsed.mockExamHistory),
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function AwsInfoPage() {
  const [activeCertId, setActiveCertId] = useState<AwsCertId>("saa");
  const activeCert = AWS_CERT_CONFIG[activeCertId];

  const [activeTab, setActiveTab] = useState<TabId>("domains");
  const [quizDomainTarget, setQuizDomainTarget] = useState<string>("all");
  const [progressByCert, setProgressByCert] = useState<Record<AwsCertId, AwsCertProgress>>({
    clf: DEFAULT_PROGRESS,
    aif: DEFAULT_PROGRESS,
    saa: DEFAULT_PROGRESS,
    dva: DEFAULT_PROGRESS,
    soa: DEFAULT_PROGRESS,
    sap: DEFAULT_PROGRESS,
  });
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>(
    AWS_CERT_CONFIG.saa.defaultExpanded
  );
  const [onlyIncompleteTopics, setOnlyIncompleteTopics] = useState<boolean>(false);
  const [onlyWithNotesTopics, setOnlyWithNotesTopics] = useState<boolean>(false);
  const [topicQuery, setTopicQuery] = useState<string>("");
  const [compCategory, setCompCategory] = useState<string>("すべて");
  const [compQuery, setCompQuery] = useState<string>("");
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [openNoteTopics, setOpenNoteTopics] = useState<Record<string, boolean>>({});
  const [showBackupPanel, setShowBackupPanel] = useState<boolean>(false);
  const [backupInput, setBackupInput] = useState<string>("");
  const [copiedBackup, setCopiedBackup] = useState<boolean>(false);
  const [copiedNotes, setCopiedNotes] = useState<boolean>(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setProgressByCert({
        clf: loadAwsProgress(AWS_CERT_CONFIG.clf.storageKey),
        aif: loadAwsProgress(AWS_CERT_CONFIG.aif.storageKey),
        saa: loadAwsProgress(AWS_CERT_CONFIG.saa.storageKey),
        dva: loadAwsProgress(AWS_CERT_CONFIG.dva.storageKey),
        soa: loadAwsProgress(AWS_CERT_CONFIG.soa.storageKey),
        sap: loadAwsProgress(AWS_CERT_CONFIG.sap.storageKey),
      });
    });
  }, []);

  const progress = progressByCert[activeCertId];

  const saveProgress = (next: AwsCertProgress) => {
    setProgressByCert((prev) => ({ ...prev, [activeCertId]: next }));
    try {
      window.localStorage.setItem(activeCert.storageKey, JSON.stringify(next));
    } catch {
      // ignore storage quota errors
    }
  };

  const handleSwitchCert = (nextCert: AwsCertId) => {
    if (nextCert === activeCertId) return;
    playCyberClick();
    setActiveCertId(nextCert);
    setExpandedDomains(AWS_CERT_CONFIG[nextCert].defaultExpanded);
    setOnlyIncompleteTopics(false);
    setOnlyWithNotesTopics(false);
    setTopicQuery("");
    setOpenNoteTopics({});
    setCompCategory("すべて");
    setCompQuery("");
    setQuizDomainTarget("all");
    setConfirmReset(false);
    setShowBackupPanel(false);
    setBackupInput("");
    setCopiedBackup(false);
    setCopiedNotes(false);
    setImportMessage(null);
  };

  const toggleTopic = (topicId: string) => {
    playCyberClick();
    const exists = progress.completedTopics.includes(topicId);
    const completedTopics = exists
      ? progress.completedTopics.filter((id) => id !== topicId)
      : [...progress.completedTopics, topicId];
    saveProgress({ ...progress, completedTopics });
  };

  const handleSubmitAnswer = (questionId: string, selectedIndices: number[]) => {
    saveProgress({
      ...progress,
      quizAnswers: { ...progress.quizAnswers, [questionId]: selectedIndices },
    });
  };

  const handleToggleBookmark = (questionId: string) => {
    const exists = progress.bookmarkedQuestions.includes(questionId);
    const bookmarkedQuestions = exists
      ? progress.bookmarkedQuestions.filter((id) => id !== questionId)
      : [...progress.bookmarkedQuestions, questionId];
    saveProgress({ ...progress, bookmarkedQuestions });
  };

  const handleToggleMasteredCard = (keyword: string) => {
    const exists = progress.masteredCards.includes(keyword);
    const masteredCards = exists
      ? progress.masteredCards.filter((k) => k !== keyword)
      : [...progress.masteredCards, keyword];
    saveProgress({ ...progress, masteredCards });
  };

  const handleResetQuiz = () => {
    saveProgress({ ...progress, quizAnswers: {} });
  };

  const handleResetMasteredCards = () => {
    saveProgress({ ...progress, masteredCards: [] });
  };

  const handleResetAllClick = () => {
    playCyberClick();
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    saveProgress(DEFAULT_PROGRESS);
    setConfirmReset(false);
  };

  const handleExpandAllDomains = (expand: boolean) => {
    playCyberClick();
    const next: Record<string, boolean> = {};
    for (const d of activeCert.domains) {
      next[d.id] = expand;
    }
    setExpandedDomains(next);
  };

  const handleJumpToDomainQuiz = (domainId: string) => {
    playCyberClick();
    setQuizDomainTarget(domainId);
    setActiveTab("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpToServiceComparison = (serviceName: string) => {
    playCyberClick();
    setCompCategory("すべて");
    setCompQuery(activeCert.resolveServiceQuery(serviceName));
    setActiveTab("comparisons");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateTopicNote = (topicId: string, note: string) => {
    saveProgress({
      ...progress,
      topicNotes: { ...progress.topicNotes, [topicId]: note },
    });
  };

  const handleRecordMockExam = (record: CertMockExamRecord) => {
    saveProgress({
      ...progress,
      mockExamHistory: [record, ...progress.mockExamHistory].slice(0, 5),
    });
  };

  const handleCopyBackup = async () => {
    playCyberClick();
    try {
      await navigator.clipboard.writeText(JSON.stringify(progress));
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2500);
    } catch {
      setImportMessage("クリップボードへのコピーに失敗しました。");
    }
  };

  const hasAnyNotes = useMemo(
    () => Object.values(progress.topicNotes).some((n) => n.trim().length > 0),
    [progress.topicNotes]
  );

  const handleCopyNotesMarkdown = async () => {
    playCyberClick();
    const lines: string[] = [`# AWS ${activeCert.shortCode} マイメモ`, ""];
    for (const d of activeCert.domains) {
      const domainLines: string[] = [];
      for (const t of d.topics) {
        const note = progress.topicNotes[t.id]?.trim();
        if (note) {
          domainLines.push(`### ${t.title}`, note, "");
        }
      }
      if (domainLines.length > 0) {
        lines.push(`## Domain ${d.number}: ${d.title}`, "", ...domainLines);
      }
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopiedNotes(true);
      setTimeout(() => setCopiedNotes(false), 2500);
    } catch {
      setImportMessage("マイメモのコピーに失敗しました。");
    }
  };

  const handleRestoreBackup = () => {
    playCyberClick();
    try {
      const parsed = JSON.parse(backupInput.trim()) as Record<string, unknown>;
      saveProgress({
        completedTopics: normalizeStringArray(parsed.completedTopics),
        quizAnswers: normalizeQuizAnswers(parsed.quizAnswers),
        bookmarkedQuestions: normalizeStringArray(parsed.bookmarkedQuestions),
        masteredCards: normalizeStringArray(parsed.masteredCards),
        topicNotes: normalizeStringRecord(parsed.topicNotes),
        mockExamHistory: normalizeMockExamHistory(parsed.mockExamHistory),
      });
      setBackupInput("");
      setImportMessage(`${activeCert.shortCode} の学習進捗を復元しました。`);
      setTimeout(() => setImportMessage(null), 3000);
    } catch {
      setImportMessage("JSON の形式が正しくありません。コピーしたバックアップ文字列をそのまま貼り付けてください。");
    }
  };

  const totalTopics = useMemo(
    () => activeCert.domains.reduce((sum, d) => sum + d.topics.length, 0),
    [activeCert.domains]
  );
  const doneTopicsCount = useMemo(
    () =>
      activeCert.domains.reduce(
        (sum, d) =>
          sum + d.topics.filter((t) => progress.completedTopics.includes(t.id)).length,
        0
      ),
    [activeCert.domains, progress.completedTopics]
  );
  const topicPct = totalTopics > 0 ? Math.round((doneTopicsCount / totalTopics) * 100) : 0;

  const cardPct =
    activeCert.quickLookup.length > 0
      ? Math.round((progress.masteredCards.length / activeCert.quickLookup.length) * 100)
      : 0;

  const answeredCount = Object.keys(progress.quizAnswers).length;
  const correctCount = activeCert.practiceQuestions.filter((q) =>
    isQuestionCorrect(q, progress.quizAnswers[q.id])
  ).length;
  const quizPct =
    answeredCount > 0 && activeCert.practiceQuestions.length > 0
      ? Math.round((correctCount / activeCert.practiceQuestions.length) * 100)
      : 0;

  const quizDomains = useMemo<CertQuizDomain[]>(
    () =>
      activeCert.domains.map((d) => ({
        id: d.id,
        number: d.number,
        shortLabel: `Domain ${d.number}`,
        filterLabel: activeCert.domainShortLabels[d.id] ?? `D${d.number}: ${d.title}`,
      })),
    [activeCert]
  );

  const comparisonCategories = useMemo(
    () => ["すべて", ...Array.from(new Set(activeCert.comparisons.map((c) => c.category)))],
    [activeCert.comparisons]
  );

  const normalizedCompQuery = compQuery.trim().toLowerCase();

  const filteredComparisons = useMemo(() => {
    return activeCert.comparisons.filter((c) => {
      if (compCategory !== "すべて" && c.category !== compCategory) return false;
      if (!normalizedCompQuery) return true;
      const haystack = [
        c.title,
        c.subtitle,
        c.decisionRule,
        ...c.rows.flatMap((r) => [r.feature, ...r.values]),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedCompQuery);
    });
  }, [activeCert.comparisons, compCategory, normalizedCompQuery]);

  const filteredQuickLookup = useMemo(() => {
    if (!normalizedCompQuery) return activeCert.quickLookup;
    return activeCert.quickLookup.filter((item) =>
      `${item.keyword} ${item.category} ${item.recommended} ${item.reason}`
        .toLowerCase()
        .includes(normalizedCompQuery)
    );
  }, [activeCert.quickLookup, normalizedCompQuery]);

  const filteredPitfalls = useMemo(() => {
    if (!normalizedCompQuery) return activeCert.pitfalls;
    return activeCert.pitfalls.filter((p) =>
      `${p.trap} ${p.whyWrong} ${p.correctApproach}`.toLowerCase().includes(normalizedCompQuery)
    );
  }, [activeCert.pitfalls, normalizedCompQuery]);

  const filteredKeyLimits = useMemo(() => {
    if (!normalizedCompQuery) return activeCert.keyLimits;
    return activeCert.keyLimits.filter((l) =>
      `${l.service} ${l.limitValue} ${l.detail}`.toLowerCase().includes(normalizedCompQuery)
    );
  }, [activeCert.keyLimits, normalizedCompQuery]);

  const topTwoDomainsSummary = useMemo(() => {
    const sorted = [...activeCert.domains].sort((a, b) => b.weight - a.weight);
    if (sorted.length < 2) return "";
    const [first, second] = sorted;
    return `Domain ${first.number}（${first.weight}%）と Domain ${second.number}（${second.weight}%）で合計 ${
      first.weight + second.weight
    }% を占めます`;
  }, [activeCert.domains]);

  // 進捗に応じた次のおすすめアクション
  const nextRecommendation = useMemo(() => {
    const nextDomain = activeCert.domains.find((d) =>
      d.topics.some((t) => !progress.completedTopics.includes(t.id))
    );
    if (doneTopicsCount < totalTopics && nextDomain) {
      return {
        label: `次は Domain ${nextDomain.number}（${nextDomain.title}）の未完了トピックを確認しましょう`,
        actionLabel: "ドメインを開く",
        onClick: () => {
          playCyberClick();
          setActiveTab("domains");
          setExpandedDomains((prev) => ({ ...prev, [nextDomain.id]: true }));
        },
      };
    }
    if (progress.masteredCards.length < activeCert.quickLookup.length) {
      return {
        label: `全トピック完了！次はフラッシュカードで即答力を鍛えましょう（残り ${
          activeCert.quickLookup.length - progress.masteredCards.length
        } 枚）`,
        actionLabel: "フラッシュカードへ",
        onClick: () => {
          playCyberClick();
          setActiveTab("flashcards");
        },
      };
    }
    if (answeredCount < activeCert.practiceQuestions.length) {
      return {
        label: `演習クイズ・模擬試験モードで実力を試しましょう（残り ${
          activeCert.practiceQuestions.length - answeredCount
        } 問）`,
        actionLabel: "実践演習へ",
        onClick: () => {
          playCyberClick();
          setActiveTab("quiz");
        },
      };
    }
    const mockExamMinutes = Math.round(
      (activeCert.practiceQuestions.length * activeCert.secondsPerQuestion) / 60
    );
    return {
      label: `全カリキュラム完了！模擬試験モード（${mockExamMinutes}分制限）や不正解の復習で仕上げましょう。`,
      actionLabel: "模擬試験に挑戦",
      onClick: () => {
        playCyberClick();
        setActiveTab("quiz");
      },
    };
  }, [
    activeCert.domains,
    activeCert.quickLookup.length,
    activeCert.practiceQuestions.length,
    activeCert.secondsPerQuestion,
    doneTopicsCount,
    totalTopics,
    progress.completedTopics,
    progress.masteredCards.length,
    answeredCount,
  ]);

  const normalizedTopicQuery = topicQuery.trim().toLowerCase();

  const tabs: { id: TabId; label: string; icon: typeof BookOpen; badge?: string }[] = [
    {
      id: "domains",
      label: `${activeCert.domains.length}ドメイン攻略`,
      icon: BookOpen,
      badge: `${doneTopicsCount}/${totalTopics}`,
    },
    {
      id: "comparisons",
      label: "頻出比較 & 逆引き",
      icon: TableProperties,
      badge: `${activeCert.comparisons.length}`,
    },
    {
      id: "flashcards",
      label: "フラッシュカード",
      icon: Layers2,
      badge: `${progress.masteredCards.length}/${activeCert.quickLookup.length}`,
    },
    {
      id: "quiz",
      label: "実践演習クイズ",
      icon: HelpCircle,
      badge: `${correctCount}/${activeCert.practiceQuestions.length}`,
    },
    { id: "resources", label: "学習ロードマップ", icon: Compass },
  ];

  const allExpanded = activeCert.domains.every((d) => expandedDomains[d.id]);
  const firstDomainTopics = activeCert.domains[0]?.topics.slice(0, 2) ?? [];
  const step1Done =
    firstDomainTopics.length > 0 &&
    firstDomainTopics.every((t) => progress.completedTopics.includes(t.id));

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="AWS・クラウド情報局"
        subtitle="AWS認定 全6資格（CLF / AIF / SAA / DVA / SOA / SAP）統合学習ハブ"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 資格レベル切り替え（全6資格） */}
        <section className="flex flex-col gap-3 bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs">
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center space-x-2">
              <Cloud size={16} className="text-indigo-600" />
              <span className="text-xs sm:text-sm font-black text-slate-800">
                学習資格選択（全6資格）
              </span>
            </div>
            <span className="hidden sm:inline text-[11px] text-slate-400 font-medium">
              Foundational (2) ・ Associate (3) ・ Professional (1)
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/70">
            {(["clf", "aif", "saa", "dva", "soa", "sap"] as const).map((id) => {
              const item = AWS_CERT_CONFIG[id];
              const active = activeCertId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSwitchCert(id)}
                  onMouseEnter={() => playCyberHover()}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black transition-all cursor-pointer sm:whitespace-nowrap text-left ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <span>{item.switchLabel}</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      active
                        ? "bg-white/15 text-cyan-200"
                        : item.level === "Foundational"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                          : item.level === "Associate"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200/80"
                            : "bg-amber-50 text-amber-800 border border-amber-200/80"
                    }`}
                  >
                    {item.level}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 学習ステータス HUD バナー */}
        <TiltCard maxTilt={2} glareOpacity={0.05} className="rounded-3xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-700/50 p-5 sm:p-8 text-white shadow-xl"
          >
            <div className="absolute -top-10 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 tracking-wider">
                    <Cloud size={12} />
                    <span>{activeCert.hudBadgeText}</span>
                  </span>
                  <span className="text-xs text-slate-300">
                    {totalTopics} トピック ・ 比較表 {activeCert.comparisons.length} 種 ・ カード{" "}
                    {activeCert.quickLookup.length} 枚 ・ 演習 {activeCert.practiceQuestions.length}{" "}
                    問
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white break-words">
                  <span className="inline-block">{activeCert.headlineLead}</span>{" "}
                  <span className="inline-block">{activeCert.headlineSuffix}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {activeCert.description}
                </p>
              </div>

              {/* 進捗ゲージカード */}
              <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:min-w-[360px]">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">トピック習得</div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
                    {topicPct}%
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-500"
                      style={{ width: `${topicPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {doneTopicsCount} / {totalTopics} 完了
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">カード暗記</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    {cardPct}%
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${cardPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {progress.masteredCards.length} / {activeCert.quickLookup.length} 枚
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">演習正答率</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                    {quizPct}%
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-500"
                      style={{ width: `${quizPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {correctCount} / {activeCert.practiceQuestions.length} 問正解
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* スマート学習ガイドバー */}
        <div className="bg-white rounded-2xl border border-indigo-200/80 px-4 py-3 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-2">
          <div className="flex items-start sm:items-center space-x-2 text-xs text-slate-700 min-w-0">
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px] shrink-0">
              NEXT STEP
            </span>
            <span className="font-medium">{nextRecommendation.label}</span>
          </div>
          <button
            type="button"
            onClick={nextRecommendation.onClick}
            className="self-start lg:self-auto shrink-0 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
          >
            <span>{nextRecommendation.actionLabel}</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* タブナビゲーション */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playCyberClick();
                    setActiveTab(tab.id);
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        isActive ? "bg-white/15 text-cyan-300" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleResetAllClick}
            className={`shrink-0 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
              confirmReset
                ? "bg-rose-600 text-white"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <RotateCcw size={12} />
            <span>
              {confirmReset
                ? `もう一度押すと ${activeCert.shortCode} 進捗をリセット`
                : "全進捗リセット"}
            </span>
          </button>
        </div>

        {/* Tab 1: 試験概要 & ドメイン攻略 */}
        {activeTab === "domains" && (
          <div className="space-y-8">
            {/* 試験基本データグリッド */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                  <Award size={18} className="text-indigo-600" />
                  <span>{activeCert.shortCode} 試験スペック（AWS公式ガイド準拠）</span>
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                {activeCert.examFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs space-y-1 min-w-0"
                  >
                    <div className="text-[11px] font-bold text-slate-500">{fact.label}</div>
                    <div className="text-base sm:text-lg font-black text-slate-900 font-mono break-words">{fact.value}</div>
                    <div className="text-[10px] text-slate-400">{fact.detail}</div>
                  </div>
                ))}
              </div>

              {/* 出題ドメイン配分バランスバー */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-700">
                    出題ドメイン配分ウェイト（合計 100%）
                  </span>
                  {topTwoDomainsSummary && (
                    <span className="text-[11px] text-slate-400">{topTwoDomainsSummary}</span>
                  )}
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
                  {activeCert.domains.map((d) => (
                    <div
                      key={d.id}
                      className={`${ACCENT_STYLES[d.accentColor].bar} h-full`}
                      style={{ width: `${d.weight}%` }}
                      title={`Domain ${d.number}: ${d.weight}%`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
                  {activeCert.domains.map((d) => (
                    <span key={d.id} className="inline-flex items-center space-x-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-xs ${ACCENT_STYLES[d.accentColor].bar}`}
                      />
                      <span>
                        D{d.number} {d.title} ({d.weight}%)
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 出題ドメイン一覧 */}
            <section className="space-y-4">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {activeCert.domains.length}つの出題ドメイン別 攻略チェックリスト
                  </h3>
                  <p className="text-xs text-slate-500">
                    各トピックを確認したらチェックを入れて進捗を管理できます。
                  </p>
                </div>

                {/* 検索 & コントロール */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full lg:w-64 shrink-0">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={topicQuery}
                      onChange={(e) => setTopicQuery(e.target.value)}
                      placeholder="サービス名・キーワード検索..."
                      className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
                    />
                    {topicQuery && (
                      <button
                        type="button"
                        onClick={() => setTopicQuery("")}
                        aria-label="検索をクリア"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setOnlyIncompleteTopics((v) => !v);
                    }}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      onlyIncompleteTopics
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <EyeOff size={13} />
                    <span>未完了のみ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setOnlyWithNotesTopics((v) => !v);
                    }}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      onlyWithNotesTopics
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-amber-300"
                    }`}
                  >
                    <StickyNote size={13} />
                    <span>メモあり</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExpandAllDomains(!allExpanded)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-indigo-300 cursor-pointer"
                  >
                    <ChevronsUpDown size={13} />
                    <span>{allExpanded ? "すべて折りたたむ" : "すべて展開"}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {activeCert.domains.every((domain) => {
                  const hasVisible = domain.topics.some((t) => {
                    if (onlyIncompleteTopics && progress.completedTopics.includes(t.id)) {
                      return false;
                    }
                    if (
                      onlyWithNotesTopics &&
                      !(progress.topicNotes[t.id] && progress.topicNotes[t.id].trim().length > 0)
                    ) {
                      return false;
                    }
                    if (!normalizedTopicQuery) return true;
                    return [t.title, ...t.services, ...t.keyPoints, t.examTip]
                      .join(" ")
                      .toLowerCase()
                      .includes(normalizedTopicQuery);
                  });
                  return !hasVisible;
                }) && (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3">
                    <Search className="w-8 h-8 text-slate-300 mx-auto" />
                    <div className="text-sm font-black text-slate-900">
                      条件に一致するトピックがありません
                    </div>
                    <p className="text-xs text-slate-500">
                      検索キーワードや「未完了のみ」「メモあり」の絞り込み条件を解除してください。
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        playCyberClick();
                        setTopicQuery("");
                        setOnlyIncompleteTopics(false);
                        setOnlyWithNotesTopics(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                    >
                      フィルターをすべて解除
                    </button>
                  </div>
                )}

                {activeCert.domains.map((domain) => {
                  const Icon = DOMAIN_ICONS[domain.id] ?? Cloud;
                  const style = ACCENT_STYLES[domain.accentColor];
                  const isExpanded =
                    !!expandedDomains[domain.id] ||
                    normalizedTopicQuery.length > 0 ||
                    onlyWithNotesTopics;
                  const doneInDomain = domain.topics.filter((t) =>
                    progress.completedTopics.includes(t.id)
                  ).length;
                  const isDomainComplete =
                    domain.topics.length > 0 && doneInDomain === domain.topics.length;

                  const visibleTopics = domain.topics.filter((t) => {
                    if (onlyIncompleteTopics && progress.completedTopics.includes(t.id)) {
                      return false;
                    }
                    if (
                      onlyWithNotesTopics &&
                      !(progress.topicNotes[t.id] && progress.topicNotes[t.id].trim().length > 0)
                    ) {
                      return false;
                    }
                    if (!normalizedTopicQuery) return true;
                    const hay = [t.title, ...t.services, ...t.keyPoints, t.examTip]
                      .join(" ")
                      .toLowerCase();
                    return hay.includes(normalizedTopicQuery);
                  });

                  if ((normalizedTopicQuery || onlyWithNotesTopics) && visibleTopics.length === 0) {
                    return null;
                  }

                  return (
                    <SpotlightCard
                      key={domain.id}
                      spotlightColor="rgba(99, 102, 241, 0.08)"
                      className={`bg-white rounded-2xl border ${style.border} shadow-xs overflow-hidden`}
                    >
                      {/* ドメインヘッダー */}
                      <button
                        type="button"
                        onClick={() => {
                          playCyberClick();
                          setExpandedDomains((prev) => ({
                            ...prev,
                            [domain.id]: !prev[domain.id],
                          }));
                        }}
                        className="w-full p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start space-x-4 min-w-0">
                          <div
                            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${style.iconBg}`}
                          >
                            <Icon size={22} />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${style.badge}`}
                              >
                                Domain {domain.number} ・ 出題比率 {domain.weight}%
                              </span>
                              <span className="text-[11px] font-mono font-bold text-slate-500">
                                {doneInDomain}/{domain.topics.length} 完了
                              </span>
                              {isDomainComplete && (
                                <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <Sparkles size={10} />
                                  <span>達成済み</span>
                                </span>
                              )}
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-slate-900 break-words">
                              {domain.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                              {domain.summary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 self-end lg:self-center shrink-0">
                          <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full ${style.bar} transition-all duration-300`}
                              style={{
                                width: `${
                                  domain.topics.length > 0
                                    ? Math.round((doneInDomain / domain.topics.length) * 100)
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                          {isExpanded ? (
                            <ChevronUp size={18} className="text-slate-400" />
                          ) : (
                            <ChevronDown size={18} className="text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* トピック一覧 */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/40">
                          {visibleTopics.length === 0 ? (
                            <div className="p-6 text-xs text-slate-500 text-center">
                              このドメインのトピックはすべて完了しています。
                            </div>
                          ) : (
                            visibleTopics.map((topic) => {
                              const checked = progress.completedTopics.includes(topic.id);
                              return (
                                <div key={topic.id} className="p-5 sm:p-6 space-y-3">
                                  <button
                                    type="button"
                                    onClick={() => toggleTopic(topic.id)}
                                    className="w-full flex items-start space-x-3 text-left group cursor-pointer"
                                  >
                                    {checked ? (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 shrink-0 mt-0.5 transition-colors" />
                                    )}
                                    <span
                                      className={`text-sm sm:text-base font-bold transition-colors ${
                                        checked
                                          ? "text-emerald-800 line-through decoration-emerald-400/60"
                                          : "text-slate-900 group-hover:text-indigo-700"
                                      }`}
                                    >
                                      {topic.title}
                                    </span>
                                  </button>

                                  <div className="pl-8 space-y-3">
                                    {/* 関連サービスバッジ（クリックで比較表・逆引き検索へ） */}
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {topic.services.map((svc) => (
                                        <button
                                          key={svc}
                                          type="button"
                                          onClick={() => handleJumpToServiceComparison(svc)}
                                          title={`「${svc}」を比較表・逆引きで検索`}
                                          className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
                                        >
                                          {svc}
                                        </button>
                                      ))}
                                    </div>

                                    {/* 押さえるべきポイント */}
                                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 list-disc pl-4">
                                      {topic.keyPoints.map((pt, idx) => (
                                        <li key={idx} className="leading-relaxed">
                                          {pt}
                                        </li>
                                      ))}
                                    </ul>

                                    {/* 試験テクニック */}
                                    <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 px-3.5 py-2.5 flex items-start space-x-2 text-xs text-amber-950">
                                      <Lightbulb
                                        size={15}
                                        className="text-amber-600 shrink-0 mt-0.5"
                                      />
                                      <span>
                                        <strong className="font-bold">試験の狙い目：</strong>
                                        {topic.examTip}
                                      </span>
                                    </div>

                                    {/* トピック別マイメモ */}
                                    {(() => {
                                      const noteVal = progress.topicNotes[topic.id] ?? "";
                                      const hasNote = noteVal.trim().length > 0;
                                      const isNoteOpen = !!openNoteTopics[topic.id];
                                      return (
                                        <div className="space-y-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              playCyberClick();
                                              setOpenNoteTopics((prev) => ({
                                                ...prev,
                                                [topic.id]: !prev[topic.id],
                                              }));
                                            }}
                                            className={`inline-flex items-center space-x-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                                              hasNote
                                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
                                            }`}
                                          >
                                            <StickyNote size={12} />
                                            <span>
                                              {isNoteOpen
                                                ? "マイメモを閉じる"
                                                : hasNote
                                                  ? "マイメモあり（編集）"
                                                  : "マイメモを追加"}
                                            </span>
                                          </button>

                                          {isNoteOpen && (
                                            <textarea
                                              value={noteVal}
                                              onChange={(e) =>
                                                handleUpdateTopicNote(topic.id, e.target.value)
                                              }
                                              rows={2}
                                              placeholder="このトピックで自分が迷いやすい点や暗記メモを記録（ブラウザに自動保存）..."
                                              className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
                                            />
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>
                              );
                            })
                          )}

                          {/* ドメイン→演習直行導線 */}
                          <div className="px-5 sm:px-6 py-3.5 bg-white/80 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => handleJumpToDomainQuiz(domain.id)}
                              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors cursor-pointer"
                            >
                              <span>Domain {domain.number} の実践問題を解く</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </SpotlightCard>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: 頻出サービス比較表 & 要件逆引き */}
        {activeTab === "comparisons" && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {comparisonCategories.map((cat) => {
                  const active = compCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        playCyberClick();
                        setCompCategory(cat);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full lg:w-64 shrink-0">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={compQuery}
                  onChange={(e) => setCompQuery(e.target.value)}
                  placeholder="比較表・逆引きを検索..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
                />
                {compQuery && (
                  <button
                    type="button"
                    onClick={() => setCompQuery("")}
                    aria-label="検索をクリア"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* 人気サービス クイック検索チップ */}
            <div className="flex flex-wrap items-center gap-1.5 -mt-4">
              <span className="text-[11px] font-bold text-slate-400 mr-1">よく調べるサービス:</span>
              {activeCert.quickSearchChips.map((kw) => {
                const isSelected = compQuery.toLowerCase() === kw.toLowerCase();
                return (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setCompCategory("すべて");
                      setCompQuery(isSelected ? "" : kw);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-cyan-300 border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
                    }`}
                  >
                    {kw}
                  </button>
                );
              })}
            </div>

            {/* すべて0件時のエンプティステート */}
            {filteredQuickLookup.length === 0 &&
              filteredComparisons.length === 0 &&
              filteredPitfalls.length === 0 &&
              filteredKeyLimits.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3">
                  <Search className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="text-sm font-black text-slate-900">
                    「{compQuery}」に一致する項目が見つかりませんでした
                  </div>
                  <p className="text-xs text-slate-500">
                    別のキーワード（例：{activeCert.quickSearchChips.slice(0, 4).join("、")}
                    ）で検索するか、条件をリセットしてください。
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setCompCategory("すべて");
                      setCompQuery("");
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                  >
                    検索・カテゴリをリセット
                  </button>
                </div>
              )}

            {/* 要件→サービス即断逆引きチートシート */}
            {filteredQuickLookup.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                    <Zap size={17} className="text-amber-500" />
                    <span>
                      {activeCert.shortCode} 本番直前：要件キーワード → 推奨サービス即断チートシート
                    </span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredQuickLookup.map((item) => (
                    <div
                      key={item.keyword}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          「{item.keyword}」
                        </span>
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-black text-indigo-700 bg-indigo-50/70 border border-indigo-100 px-3 py-1.5 rounded-lg">
                        → {item.recommended}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 比較テーブル一覧 */}
            {filteredComparisons.length > 0 && (
              <div className="space-y-6">
                {filteredComparisons.map((table) => (
                  <div
                    key={table.id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
                  >
                    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {table.category}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                          {table.title}
                        </h3>
                        <p className="text-xs text-slate-500">{table.subtitle}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                            {table.columns.map((col, idx) => (
                              <th key={idx} className="py-3 px-4 font-bold whitespace-nowrap">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/70">
                              <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap bg-slate-50/30">
                                {row.feature}
                              </td>
                              {row.values.map((val, vIdx) => (
                                <td key={vIdx} className="py-3 px-4 text-slate-700 leading-relaxed">
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-indigo-50/60 border-t border-indigo-100 px-5 py-3 text-xs text-indigo-950 flex items-start space-x-2">
                      <Lightbulb size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-bold">判断ルール：</strong>
                        {table.decisionRule}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 試験のひっかけ回避：典型的な誤答パターン */}
            {filteredPitfalls.length > 0 && (
              <section className="space-y-3 pt-2">
                <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                  <AlertTriangle size={17} className="text-rose-500" />
                  <span>
                    {activeCert.shortCode} 試験のひっかけ回避：典型的な誤答パターン{" "}
                    {filteredPitfalls.length} 選
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPitfalls.map((pit) => (
                    <div
                      key={pit.id}
                      className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-xs space-y-2.5"
                    >
                      <div className="flex items-start space-x-2">
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 mt-0.5">
                          ✕ ひっかけ
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {pit.trap}
                        </span>
                      </div>
                      <p className="text-xs text-rose-900/80 bg-rose-50/60 rounded-lg px-3 py-2 leading-relaxed">
                        <strong>なぜ誤りか：</strong>
                        {pit.whyWrong}
                      </p>
                      <p className="text-xs text-emerald-950 bg-emerald-50/70 rounded-lg px-3 py-2 leading-relaxed">
                        <strong>正解の考え方：</strong>
                        {pit.correctApproach}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 試験に出る！AWS 重要数値・制限値マスター */}
            {filteredKeyLimits.length > 0 && (
              <section className="space-y-3 pt-2">
                <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                  <Gauge size={17} className="text-indigo-600" />
                  <span>
                    {activeCert.shortCode} 試験に出る！AWS 重要数値・制限値マスター{" "}
                    {filteredKeyLimits.length} 選
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {filteredKeyLimits.map((lim) => (
                    <div
                      key={lim.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-1.5 min-w-0"
                    >
                      <div className="text-[11px] font-bold text-indigo-600">{lim.service}</div>
                      <div className="text-xs sm:text-sm font-mono font-black text-slate-900 break-words">
                        {lim.limitValue}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{lim.detail}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Tab 3: フラッシュカード暗記 */}
        {activeTab === "flashcards" && (
          <CertificationFlashcards
            key={activeCertId}
            items={activeCert.quickLookup}
            masteredKeywords={progress.masteredCards}
            onToggleMastered={handleToggleMasteredCard}
            onResetMastered={handleResetMasteredCards}
            badgeText={`${activeCert.shortCode} 直前暗記フラッシュカード`}
            title={`${activeCert.shortCode} 要件キーワード → 推奨サービス 即答トレーニング`}
            promptLabel="次の要件に最適な AWS サービス・機能は？"
            answerLabel="推奨サービス・設計"
          />
        )}

        {/* Tab 4: 実践演習クイズ */}
        {activeTab === "quiz" && (
          <CertificationPracticeQuiz
            key={`${activeCertId}-${quizDomainTarget}`}
            questions={activeCert.practiceQuestions}
            domains={quizDomains}
            examBadgeLabel={activeCert.quizBadgeLabel}
            passingConfig={activeCert.passingConfig}
            answers={progress.quizAnswers}
            bookmarkedIds={progress.bookmarkedQuestions}
            mockExamHistory={progress.mockExamHistory}
            initialDomain={quizDomainTarget}
            secondsPerQuestion={activeCert.secondsPerQuestion}
            onSubmitAnswer={handleSubmitAnswer}
            onToggleBookmark={handleToggleBookmark}
            onRecordMockExam={handleRecordMockExam}
            onResetQuiz={handleResetQuiz}
          />
        )}

        {/* Tab 5: 学習ロードマップ・公式リソース */}
        {activeTab === "resources" && (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {activeCert.shortCode} 合格までの標準学習ステップ
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  丸暗記ではなく「要件（セキュリティ・可用性・性能・コスト）から最適サービスを選ぶ力」を養う手順です。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    step: "STEP 1",
                    title: activeCert.roadmapSteps.step1Title,
                    desc: activeCert.roadmapSteps.step1Desc,
                    status: step1Done ? "基礎完了" : "学習中",
                    done: step1Done,
                  },
                  {
                    step: "STEP 2",
                    title: activeCert.roadmapSteps.step2Title,
                    desc: activeCert.roadmapSteps.step2Desc,
                    status: `${doneTopicsCount}/${totalTopics} トピック`,
                    done: totalTopics > 0 && doneTopicsCount === totalTopics,
                  },
                  {
                    step: "STEP 3",
                    title: "カード暗記 & シナリオ演習",
                    desc: "フラッシュカードで即答力を鍛え、実践演習クイズや AWS Skill Builder で誤答理由を言語化する。",
                    status: `カード ${progress.masteredCards.length}/${activeCert.quickLookup.length} ・ 演習 ${correctCount}/${activeCert.practiceQuestions.length}`,
                    done:
                      activeCert.quickLookup.length > 0 &&
                      progress.masteredCards.length === activeCert.quickLookup.length &&
                      correctCount >=
                        Math.ceil(
                          activeCert.practiceQuestions.length *
                            (activeCert.passingConfig.passingPct / 100)
                        ),
                  },
                  {
                    step: "STEP 4",
                    title: "模擬試験で時間配分確認",
                    desc: activeCert.roadmapSteps.step4Desc,
                    status:
                      progress.mockExamHistory.length > 0
                        ? `最高 ${Math.max(...progress.mockExamHistory.map((m) => m.scaledScore))}点`
                        : "未受験",
                    done: progress.mockExamHistory.some(
                      (m) => m.scaledScore >= activeCert.passingConfig.passingScore
                    ),
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`rounded-xl border p-4 space-y-2 ${
                      item.done
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-slate-200 bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300">
                        {item.step}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.done
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-200/70 text-slate-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 試験本番・直前チェックリスト */}
            <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {activeCert.shortCode} 試験本番・直前チェックリスト（時間配分＆受験のコツ）
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeCert.examDayChecklist.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                {activeCert.examDayChecklist.tips.map((tip) => (
                  <div
                    key={tip.title}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-1.5"
                  >
                    <div className="font-black text-slate-900 text-xs sm:text-sm">{tip.title}</div>
                    <p className="leading-relaxed text-slate-600">{tip.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 定番アーキテクチャ設計パターン */}
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {activeCert.shortCode} 定番アーキテクチャ設計パターン{" "}
                  {activeCert.architecturePatterns.length}選
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  試験で頻出する標準構成のつながり（フロー）と設計上の勘所を押さえましょう。
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCert.architecturePatterns.map((pat) => (
                  <div
                    key={pat.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm sm:text-base font-black text-slate-900">{pat.title}</h4>
                      <span className="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {pat.badge}
                      </span>
                    </div>

                    {/* フロー図チェーン */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-200/70 rounded-xl p-3">
                      {pat.flow.map((node, idx) => (
                        <div key={`${node}-${idx}`} className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                            {node}
                          </span>
                          {idx < pat.flow.length - 1 && (
                            <ArrowRight size={12} className="text-indigo-400 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{pat.summary}</p>

                    <ul className="space-y-1 text-xs text-slate-700 list-disc pl-4">
                      {pat.keyDesignPoints.map((pt, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 設計判断の軸：AWS Well-Architected 6つの柱 */}
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  設計判断の軸：AWS Well-Architected 6つの柱
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  問題文が「どの柱を最優先に問うているか」を見抜くと、正解の選択肢を迷わず選べます。
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {saaWellArchitectedPillars.map((pillar) => (
                  <div
                    key={pillar.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2.5"
                  >
                    <div>
                      <div className="text-[10px] font-mono font-bold text-indigo-600 uppercase">
                        {pillar.englishName}
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{pillar.name}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {pillar.examKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/70"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{pillar.focus}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-black text-slate-900">
                AWS 公式学習リソース（{activeCert.shortCode}）
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCert.officialResources.map((res) => (
                  <a
                    key={res.url}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playCyberClick()}
                    onMouseEnter={() => playCyberHover()}
                    className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {res.badge}
                        </span>
                        <ExternalLink
                          size={15}
                          className="text-slate-400 group-hover:text-indigo-600 transition-colors"
                        />
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 学習進捗バックアップ・復元 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <Download size={14} className="text-indigo-600 shrink-0" />
              <span className="font-bold text-slate-800">
                学習データの引き継ぎ・バックアップ（{activeCert.shortCode}）
              </span>
              <span className="text-slate-400 hidden sm:inline">
                （別PCや別ブラウザへ学習記録・マイメモを移行できます）
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {hasAnyNotes && (
                <button
                  type="button"
                  onClick={handleCopyNotesMarkdown}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-800 transition-colors cursor-pointer"
                >
                  {copiedNotes ? (
                    <>
                      <Check size={13} className="text-emerald-600" />
                      <span className="text-emerald-700">メモをコピーしました</span>
                    </>
                  ) : (
                    <>
                      <StickyNote size={13} />
                      <span>マイメモをMDコピー</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyBackup}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                {copiedBackup ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span className="text-emerald-700">コピーしました</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>進捗JSONをコピー</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  playCyberClick();
                  setShowBackupPanel((v) => !v);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer"
              >
                {showBackupPanel ? "閉じる" : "復元する"}
              </button>
            </div>
          </div>

          {showBackupPanel && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <textarea
                value={backupInput}
                onChange={(e) => setBackupInput(e.target.value)}
                rows={2}
                placeholder={`コピーした ${activeCert.shortCode} の学習進捗 JSON をここに貼り付けて「復元を実行」を押してください...`}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-400"
              />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-indigo-700 font-semibold">{importMessage ?? ""}</span>
                <button
                  type="button"
                  disabled={!backupInput.trim()}
                  onClick={handleRestoreBackup}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 cursor-pointer shrink-0"
                >
                  復元を実行
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 社内ルール・相談窓口についての誠実な未完了注記 */}
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 一部工事中：社内の AWS 利用ルール・受験補助制度は準備中です"
          message="このページでは AWS認定 全6資格（CLF-C02 / AIF-C01 / SAA-C03 / DVA-C02 / SOA-C03 / SAP-C02）の学習コンテンツを公開しています。なお、社内の AWS アカウント申請ルール・資格受験補助・相談窓口についてはまだ決まっていないため、決まり次第ここに掲載します。"
        />
      </div>
    </div>
  );
}
