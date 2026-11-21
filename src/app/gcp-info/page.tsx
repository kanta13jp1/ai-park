"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Cloud,
  ShieldCheck,
  Layers,
  Cpu,
  Database,
  Network,
  Sparkles,
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
  Layers2,
  ArrowRight,
  X,
  StickyNote,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Gauge,
  Terminal,
  Wrench,
  Brain,
  Activity,
  Lock,
  GitBranch,
  Zap,
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
  CertExamFact,
  CertFlashcardItem,
  CertMockExamRecord,
  CertPassingConfig,
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
  aceExamFacts,
  aceDomains,
  aceComparisons,
  acePatterns,
  acePitfalls,
  aceKeyFacts,
  aceQuickLookup,
  acePracticeQuestions,
  aceOfficialResources,
} from "@/data/gcp-ace";
import {
  pcaExamFacts,
  pcaDomains,
  pcaComparisons,
  pcaPatterns,
  pcaPitfalls,
  pcaKeyFacts,
  pcaQuickLookup,
  pcaPracticeQuestions,
  pcaOfficialResources,
} from "@/data/gcp-pca";
import {
  pdeExamFacts,
  pdeDomains,
  pdeComparisons,
  pdePatterns,
  pdePitfalls,
  pdeKeyFacts,
  pdeQuickLookup,
  pdePracticeQuestions,
  pdeOfficialResources,
} from "@/data/gcp-pde";
import {
  pmleExamFacts,
  pmleDomains,
  pmleComparisons,
  pmlePatterns,
  pmlePitfalls,
  pmleKeyFacts,
  pmleQuickLookup,
  pmlePracticeQuestions,
  pmleOfficialResources,
} from "@/data/gcp-pmle";
import {
  pcseExamFacts,
  pcseDomains,
  pcseComparisons,
  pcsePatterns,
  pcsePitfalls,
  pcseKeyFacts,
  pcseQuickLookup,
  pcsePracticeQuestions,
  pcseOfficialResources,
} from "@/data/gcp-pcse";
import {
  pcdeExamFacts,
  pcdeDomains,
  pcdeComparisons,
  pcdePatterns,
  pcdePitfalls,
  pcdeKeyFacts,
  pcdeQuickLookup,
  pcdePracticeQuestions,
  pcdeOfficialResources,
} from "@/data/gcp-pcde";
import {
  gailExamFacts,
  gailDomains,
  gailComparisons,
  gailPatterns,
  gailPitfalls,
  gailKeyFacts,
  gailQuickLookup,
  gailPracticeQuestions,
  gailOfficialResources,
} from "@/data/gcp-gail";
import {
  adpExamFacts,
  adpDomains,
  adpComparisons,
  adpPatterns,
  adpPitfalls,
  adpKeyFacts,
  adpQuickLookup,
  adpPracticeQuestions,
  adpOfficialResources,
} from "@/data/gcp-adp";
import {
  pcdExamFacts,
  pcdDomains,
  pcdComparisons,
  pcdPatterns,
  pcdPitfalls,
  pcdKeyFacts,
  pcdQuickLookup,
  pcdPracticeQuestions,
  pcdOfficialResources,
} from "@/data/gcp-pcd";
import {
  pcneExamFacts,
  pcneDomains,
  pcneComparisons,
  pcnePatterns,
  pcnePitfalls,
  pcneKeyFacts,
  pcneQuickLookup,
  pcnePracticeQuestions,
  pcneOfficialResources,
} from "@/data/gcp-pcne";
import { playCyberClick, playCyberHover } from "@/lib/sound";

type GcpCertId =
  | "cdl"
  | "gail"
  | "ace"
  | "adp"
  | "pca"
  | "pde"
  | "pmle"
  | "pcse"
  | "pcde"
  | "pcd"
  | "pcne";
type GcpLevelGroup = "Foundational" | "Associate" | "Professional";
type TabId = "domains" | "comparisons" | "flashcards" | "quiz" | "resources";

interface GcpCertConfig {
  id: GcpCertId;
  levelGroup: GcpLevelGroup;
  label: string;
  shortLabel: string;
  badgeText: string;
  headline: string;
  description: string;
  storageKey: string;
  examFacts: CertExamFact[];
  domains: GcpDomain[];
  comparisons: GcpComparisonTable[];
  patterns: GcpArchitecturePattern[];
  pitfalls: GcpPitfall[];
  keyFacts: GcpKeyFact[];
  quickLookup: CertFlashcardItem[];
  practiceQuestions: CertQuestion[];
  officialResources: GcpOfficialResource[];
  defaultExpanded: Record<string, boolean>;
  passingConfig: CertPassingConfig;
  quizBadgeLabel: string;
  flashcardTitle: string;
  quickSearchChips: string[];
  examDayChecklist: {
    subtitle: string;
    tips: { title: string; body: string }[];
  };
}

const CERT_CONFIG: Record<GcpCertId, GcpCertConfig> = {
  cdl: {
    id: "cdl",
    levelGroup: "Foundational",
    label: "Cloud Digital Leader (CDL)",
    shortLabel: "CDL",
    badgeText: "GOOGLE CLOUD DIGITAL LEADER STUDY HUB",
    headline: "Cloud Digital Leader（CDL）",
    description:
      "Google Cloud の基礎概念・DX・データ＆AI活用・セキュリティ・FinOps を網羅した入門〜ビジネス向け認定試験の学習ハブです。進捗やメモはブラウザに自動保存されます。",
    storageKey: "ai-park-gcp-cdl-progress-v1",
    examFacts: cdlExamFacts,
    domains: cdlDomains,
    comparisons: cdlComparisons,
    patterns: cdlPatterns,
    pitfalls: cdlPitfalls,
    keyFacts: cdlKeyFacts,
    quickLookup: cdlQuickLookup,
    practiceQuestions: cdlPracticeQuestions,
    officialResources: cdlOfficialResources,
    defaultExpanded: { "cdl-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Cloud Digital Leader 本試験（目安70%前後）",
    },
    quizBadgeLabel: "GCP CDL 演習",
    flashcardTitle: "CDL 要件・ビジネス課題 → Google Cloud サービス即答トレーニング",
    quickSearchChips: ["BigQuery", "Cloud Storage", "Vertex AI", "Cloud Run", "Cloud Armor", "CUD"],
    examDayChecklist: {
      subtitle:
        "Cloud Digital Leader は 90 分・約 50〜60 問・有効期限 3 年の入門〜ビジネス基礎資格です。技術詳細よりも「ビジネス課題に対する適切な Google Cloud ソリューション選定」を素早く判断するのが合格の鍵です。",
      tips: [
        {
          title: "⏱️ 時間配分: 1 問あたり約 1.5 分",
          body: "90 分で 50〜60 問のため、悩む問題はフラグ（見直しマーク）を付けて先に進み、最後に 15 分以上の見直し時間を残します。",
        },
        {
          title: "🏢 ビジネス価値と OpEx / TCO 視点",
          body: "CapEx から OpEx へのシフト、IaaS / PaaS / SaaS の責任共有モデル（データは常に顧客責任）の区別を問題文の制約から読み取ります。",
        },
        {
          title: "🤖 AI / データサービスの即断",
          body: "「ML知識なしで OCR」＝ Document AI、「ペタバイト分析」＝ BigQuery、「非構造化長期保管」＝ Cloud Storage Archive など役割の紐付けを優先します。",
        },
        {
          title: "💰 コスト最適化の定番ひっかけ回避",
          body: "常時稼働の削減は CUD、中断可能なバッチは Spot VM。予算アラートだけではリソースが自動停止しない点に注意してください。",
        },
      ],
    },
  },
  gail: {
    id: "gail",
    levelGroup: "Foundational",
    label: "Generative AI Leader (GAIL)",
    shortLabel: "GAIL",
    badgeText: "GOOGLE CLOUD GENERATIVE AI LEADER STUDY HUB",
    headline: "Generative AI Leader（GAIL）",
    description:
      "生成 AI の基礎・Gemini / Vertex AI・グラウンディング（RAG）・プロンプト＆モデル改善・責任ある AI と導入戦略を学ぶビジネス〜推進リーダー向け学習ハブです。",
    storageKey: "ai-park-gcp-gail-progress-v1",
    examFacts: gailExamFacts,
    domains: gailDomains,
    comparisons: gailComparisons,
    patterns: gailPatterns,
    pitfalls: gailPitfalls,
    keyFacts: gailKeyFacts,
    quickLookup: gailQuickLookup,
    practiceQuestions: gailPracticeQuestions,
    officialResources: gailOfficialResources,
    defaultExpanded: { "gail-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Generative AI Leader 本試験（目安70%前後）",
    },
    quizBadgeLabel: "GCP GAIL 演習",
    flashcardTitle: "GAIL 生成 AI 課題・ビジネス要件 → 最適ソリューション即答トレーニング",
    quickSearchChips: ["Gemini", "Vertex AI", "RAG", "NotebookLM", "Model Garden", "Responsible AI"],
    examDayChecklist: {
      subtitle:
        "Generative AI Leader は 90 分・約 50〜60 問・有効期限 3 年の生成 AI 分野の認定資格です。モデルの使い分けと出力精度改善・ガバナンス戦略の判断が中心となります。",
      tips: [
        {
          title: "⏱️ 時間配分: 90 分のペース配分",
          body: "シナリオ文が短〜中程度の設問が中心です。1 問 90 秒以内を目安にテンポ良く進め、見直し時間を確保します。",
        },
        {
          title: "🧭 導入アプローチの段階選択",
          body: "既製 SaaS（Gemini for Google Workspace / NotebookLM Enterprise）で済むか、Vertex AI Studio / Agent Builder / Model Garden で構築するかを要件から見極めます。",
        },
        {
          title: "🎯 出力改善手法の切り分け",
          body: "最新・社内情報不足には RAG（グラウンディング）、出力形式やトーンの統制には Few-shot プロンプト、特化振る舞いの学習にはチューニングを選びます。",
        },
        {
          title: "🛡️ 責任ある AI とデータ保護",
          body: "Google Cloud のエンタープライズ利用では顧客データが公開基盤モデルの学習に自動利用されない点と、Human-in-the-loop・Safety Filters の重要性を押さえます。",
        },
      ],
    },
  },
  ace: {
    id: "ace",
    levelGroup: "Associate",
    label: "Associate Cloud Engineer (ACE)",
    shortLabel: "ACE",
    badgeText: "GOOGLE CLOUD ASSOCIATE CLOUD ENGINEER STUDY HUB",
    headline: "Associate Cloud Engineer（ACE）",
    description:
      "プロジェクト階層・IAM・gcloud CLI・Compute Engine / GKE / Cloud Run・VPC ネットワーキング・Cloud Monitoring/Logging の実装と運用を学ぶエンジニア向け学習ハブです。",
    storageKey: "ai-park-gcp-ace-progress-v1",
    examFacts: aceExamFacts,
    domains: aceDomains,
    comparisons: aceComparisons,
    patterns: acePatterns,
    pitfalls: acePitfalls,
    keyFacts: aceKeyFacts,
    quickLookup: aceQuickLookup,
    practiceQuestions: acePracticeQuestions,
    officialResources: aceOfficialResources,
    defaultExpanded: { "ace-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Associate Cloud Engineer 本試験（目安70%前後）",
    },
    quizBadgeLabel: "GCP ACE 演習",
    flashcardTitle: "ACE 運用要件 → gcloud コマンド / 推奨サービス即答トレーニング",
    quickSearchChips: ["gcloud", "GKE", "Cloud Run", "IAM", "Cloud NAT", "Ops Agent", "VPC"],
    examDayChecklist: {
      subtitle:
        "Associate Cloud Engineer は 120 分・約 50〜60 問・有効期限 2 年のエンジニア向け試験です。CLI コマンド構文、最小権限の IAM、そして「Google 推奨（最も運用負荷が低い）手順」を見抜く力が問われます。",
      tips: [
        {
          title: "⏱️ 時間配分: 1 問約 2 分の余裕を活かす",
          body: "120 分あるためコマンドのフラグやサービス名（例：`gcloud config configurations`, `gcloud container clusters get-credentials`）を落ち着いて読み比べられます。",
        },
        {
          title: "🔑 キーレス認証と最小権限",
          body: "サービスアカウントの JSON 鍵ファイル生成を勧める選択肢は原則不正解（アンチパターン）。Compute Engine は SA アタッチ、GKE は Workload Identity を選びます。",
        },
        {
          title: "🌐 プライベート通信と監視の定番",
          body: "外部 IP なし VM への SSH は IAP、外向きネット通信は Cloud NAT、Google API 通信は Private Google Access、メモリ監視は Ops Agent の導入が必須です。",
        },
        {
          title: "⚙️ API 有効化と予算アラートの罠",
          body: "新規プロジェクトでエラーが出たら `gcloud services enable` 未実行を疑います。予算アラートだけでは自動停止しない点も頻出です。",
        },
      ],
    },
  },
  adp: {
    id: "adp",
    levelGroup: "Associate",
    label: "Associate Data Practitioner (ADP)",
    shortLabel: "ADP",
    badgeText: "GOOGLE CLOUD ASSOCIATE DATA PRACTITIONER STUDY HUB",
    headline: "Associate Data Practitioner（ADP）",
    description:
      "データ取り込み・前処理（BigQuery / Dataform / Dataflow）・可視化（Looker）・パイプラインオーケストレーション（Cloud Composer）・ガバナンス（Dataplex / DLP）を学ぶ実務向け学習ハブです。",
    storageKey: "ai-park-gcp-adp-progress-v1",
    examFacts: adpExamFacts,
    domains: adpDomains,
    comparisons: adpComparisons,
    patterns: adpPatterns,
    pitfalls: adpPitfalls,
    keyFacts: adpKeyFacts,
    quickLookup: adpQuickLookup,
    practiceQuestions: adpPracticeQuestions,
    officialResources: adpOfficialResources,
    defaultExpanded: { "adp-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Associate Data Practitioner 本試験（目安70%前後）",
    },
    quizBadgeLabel: "GCP ADP 演習",
    flashcardTitle: "ADP データパイプライン・分析要件 → 最適サービス即答トレーニング",
    quickSearchChips: ["BigQuery", "Dataform", "Dataflow", "Cloud Composer", "Looker", "Dataplex", "Pub/Sub"],
    examDayChecklist: {
      subtitle:
        "Associate Data Practitioner は 120 分・約 50〜60 問・有効期限 3 年のデータ実務試験です。バッチ／ストリーミングの取り込み、SQL ベースの変換（Dataform）、BI 可視化、ガバナンスツールの使い分けを整理しておきましょう。",
      tips: [
        {
          title: "⏱️ 時間配分: パイプライン要件を分解する",
          body: "「どこから取り込み（Pub/Sub・Transfer）・どこで変換し（Dataflow・Dataform・Dataproc）・どこに貯めるか（GCS・BigQuery）」を 3 ステップで切り分けます。",
        },
        {
          title: "🔄 変換ツールの使い分け（重要）",
          body: "BigQuery 内の SQL 変換＆アサーション＝Dataform、ノーコード GUI ETL＝Cloud Data Fusion / Dataprep、ストリーム/複雑コード ETL＝Dataflow、既存 Spark＝Dataproc。",
        },
        {
          title: "📊 オーケストレーション vs スケジュール",
          body: "単発の定時 BigQuery SQL は Scheduled Queries、複数サービスを跨ぐ複雑な DAG 依存制御は Cloud Composer（Apache Airflow）を選択します。",
        },
        {
          title: "🛡️ データガバナンスとコスト",
          body: "全社メタデータ・データ品質管理は Dataplex、PII 検出・マスキングは Sensitive Data Protection (DLP)、BigQuery はパーティショニング＆クラスタリングで最適化します。",
        },
      ],
    },
  },
  pca: {
    id: "pca",
    levelGroup: "Professional",
    label: "Professional Cloud Architect (PCA)",
    shortLabel: "PCA",
    badgeText: "GOOGLE CLOUD PROFESSIONAL CLOUD ARCHITECT STUDY HUB",
    headline: "Professional Cloud Architect（PCA）",
    description:
      "マルチリージョン設計・Shared VPC・Interconnect・VPC Service Controls・SRE（SLI/SLO）・大規模移行など、エンタープライズ設計力を問う上級資格向け学習ハブです。",
    storageKey: "ai-park-gcp-pca-progress-v1",
    examFacts: pcaExamFacts,
    domains: pcaDomains,
    comparisons: pcaComparisons,
    patterns: pcaPatterns,
    pitfalls: pcaPitfalls,
    keyFacts: pcaKeyFacts,
    quickLookup: pcaQuickLookup,
    practiceQuestions: pcaPracticeQuestions,
    officialResources: pcaOfficialResources,
    defaultExpanded: { "pca-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional Cloud Architect 本試験（目安70%前後）",
    },
    quizBadgeLabel: "GCP PCA 演習",
    flashcardTitle: "PCA 設計要件・制約 → アーキテクチャ選択即答トレーニング",
    quickSearchChips: ["Cloud Spanner", "Shared VPC", "VPC Service Controls", "Interconnect", "BigQuery", "SRE", "Cloud EKM"],
    examDayChecklist: {
      subtitle:
        "Professional Cloud Architect は 120 分・約 50 問・有効期限 2 年の最上位設計資格です。長文シナリオや公式ケーススタディの「ビジネス制約・RTO/RPO・セキュリティ要件」と技術選択を正確に結びつけることが合格の鍵です。",
      tips: [
        {
          title: "⏱️ ケーススタディ問題の読み方",
          body: "最初に設問文を読んで問われている領域（移行・セキュリティ・DR 等）を把握してから、ケーススタディの該当要件・制約箇所をピンポイントで参照すると時間短縮になります。",
        },
        {
          title: "⚖️ 過剰設計（オーバースペック）を避ける",
          body: "RPO 24h / RTO 8h でコスト重視なら Cold Standby が正解。要件以上のコストがかかる Cloud Spanner Multi-Region 等を無条件に選ばないよう注意します。",
        },
        {
          title: "🧱 多層防御の責務分離",
          body: "誰ができるか＝Cloud IAM、禁止設定の強制＝Organization Policy、認証情報漏洩時のデータ持ち出し防止＝VPC Service Controls と役割を明確に分けます。",
        },
        {
          title: "🚚 大容量移行は必ず帯域計算",
          body: "データ量 ÷ 回線速度で移行期限に間に合わない場合は Transfer Appliance。また 99.99% SLA の Dedicated Interconnect は 2 メトロ×4 接続が必要です。",
        },
      ],
    },
  },
  pde: {
    id: "pde",
    levelGroup: "Professional",
    label: "Professional Data Engineer (PDE)",
    shortLabel: "PDE",
    badgeText: "GOOGLE CLOUD PROFESSIONAL DATA ENGINEER STUDY HUB",
    headline: "Professional Data Engineer（PDE）",
    description:
      "BigQuery・Dataflow・Pub/Sub・Dataproc・Cloud Composer・Dataplex・Bigtable・DLP を軸に、スケーラブルで安全なデータ基盤の設計と運用を学ぶデータエンジニア向け学習ハブです。",
    storageKey: "ai-park-gcp-pde-progress-v1",
    examFacts: pdeExamFacts,
    domains: pdeDomains,
    comparisons: pdeComparisons,
    patterns: pdePatterns,
    pitfalls: pdePitfalls,
    keyFacts: pdeKeyFacts,
    quickLookup: pdeQuickLookup,
    practiceQuestions: pdePracticeQuestions,
    officialResources: pdeOfficialResources,
    defaultExpanded: { "pde-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional Data Engineer 本試験（目安70%前後）",
    },
    quizBadgeLabel: "GCP PDE 演習",
    flashcardTitle: "PDE データ基盤要件 → 最適サービス・パイプライン設計即答トレーニング",
    quickSearchChips: ["BigQuery", "Dataflow", "Pub/Sub", "Dataproc", "Cloud Composer", "Bigtable", "Dataplex"],
    examDayChecklist: {
      subtitle:
        "Professional Data Engineer は 120 分・約 50〜60 問・有効期限 2 年の専門資格です。BigQuery の物理最適化、Bigtable 行キー設計、Dataflow の遅延データ処理、およびセキュリティ/ガバナンスが頻出です。",
      tips: [
        {
          title: "⏱️ 要件キーワード即断を徹底",
          body: "「10ms未満・大量時系列」＝ Bigtable、「グローバル強整合 SQL」＝ Spanner、「ペタバイト分析」＝ BigQuery、「Spark 移行」＝ Dataproc（エフェメラル+GCS）で即絞り込みます。",
        },
        {
          title: "🔑 Cloud Bigtable 行キーの鉄則",
          body: "タイムスタンプ先頭・単調連番・固定ドメイン先頭はホットスポット化するため NG。ドメイン反転・フィールド昇格・ソルト付加でアクセスを分散させます。",
        },
        {
          title: "🌊 Dataflow（Apache Beam）のストリーム概念",
          body: "ウィンドウ（Fixed / Sliding / Session）、遅延データを扱うウォーターマークと許容遅延（Allowed Lateness）、トリガー、デッドレターパターンの役割を押さえます。",
        },
        {
          title: "📉 BigQuery の高速化＆コスト最適化",
          body: "日付シャーディング乱立は避け、単一テーブルで時間パーティショニング＋クラスタリング＋Materialized View・BI Engine・Storage Read API を活用します。",
        },
      ],
    },
  },
  pmle: {
    id: "pmle",
    levelGroup: "Professional",
    label: "Professional ML Engineer (PMLE)",
    shortLabel: "PMLE",
    badgeText: "GOOGLE CLOUD PROFESSIONAL ML ENGINEER STUDY HUB",
    headline: "Professional Machine Learning Engineer（PMLE）",
    description:
      "Vertex AI（Pipelines / Feature Store / Model Monitoring）・生成 AI（Gemini / RAG）・BigQuery ML・分散学習（GPU/TPU）・MLOps の設計と自動化を学ぶ機械学習エンジニア向け学習ハブです。",
    storageKey: "ai-park-gcp-pmle-progress-v1",
    examFacts: pmleExamFacts,
    domains: pmleDomains,
    comparisons: pmleComparisons,
    patterns: pmlePatterns,
    pitfalls: pmlePitfalls,
    keyFacts: pmleKeyFacts,
    quickLookup: pmleQuickLookup,
    practiceQuestions: pmlePracticeQuestions,
    officialResources: pmleOfficialResources,
    defaultExpanded: { "pmle-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional ML Engineer 本試験（目安70%前後）",
    },
    quizBadgeLabel: "GCP PMLE 演習",
    flashcardTitle: "PMLE 機械学習・MLOps 要件 → Vertex AI / 手法即答トレーニング",
    quickSearchChips: ["Vertex AI", "Gemini", "Feature Store", "BigQuery ML", "AutoML", "Pipelines", "Model Monitoring"],
    examDayChecklist: {
      subtitle:
        "Professional Machine Learning Engineer は 120 分・約 50〜60 問・有効期限 2 年の専門資格です。不均衡データ指標、データリーク防止、Vertex AI MLOps、生成 AI（RAG・ファインチューニング）の設計判断が問われます。",
      tips: [
        {
          title: "📏 評価指標とデータリーク防止",
          body: "不均衡クラス分類（不正検知等）では Accuracy ではなく PR-AUC や F1 を重視。スケーリングや統計量計算は必ずデータ分割（Train/Val/Test）後に訓練データのみで fit します。",
        },
        {
          title: "🧠 生成 AI 開発の適切な選択",
          body: "事前学習済み API → プロンプト / RAG（Vertex AI Search・Vector Search）→ LoRA / SFT チューニング → カスタム学習の順で、最小労力・低コストから検討します。",
        },
        {
          title: "🔁 MLOps（Feature Store & Model Monitoring）",
          body: "オンライン推論とオフライン学習の特徴量乖離を防ぐには Vertex AI Feature Store。本番稼働後の Training-Serving Skew と Feature Drift 検知には Model Monitoring を使用します。",
        },
        {
          title: "⚡ 推論レイテンシとコスト最適化",
          body: "リアルタイム推論は Endpoints（トラフィック分割・量子化/蒸留・vLLM 等）、定期一括推論は Batch Prediction、SQL 完結なら BigQuery ML を選択します。",
        },
      ],
    },
  },
  pcse: {
    id: "pcse",
    levelGroup: "Professional",
    label: "Professional Cloud Security Engineer (PCSE)",
    shortLabel: "PCSE",
    badgeText: "GOOGLE CLOUD PROFESSIONAL SECURITY ENGINEER STUDY HUB",
    headline: "Professional Cloud Security Engineer（PCSE）",
    description:
      "IAM / Workload Identity Federation・VPC Service Controls・Cloud Armor / NGFW・Cloud KMS / EKM・DLP・Security Command Center / SecOps を体系的に学ぶセキュリティエンジニア向け学習ハブです。",
    storageKey: "ai-park-gcp-pcse-progress-v1",
    examFacts: pcseExamFacts,
    domains: pcseDomains,
    comparisons: pcseComparisons,
    patterns: pcsePatterns,
    pitfalls: pcsePitfalls,
    keyFacts: pcseKeyFacts,
    quickLookup: pcseQuickLookup,
    practiceQuestions: pcsePracticeQuestions,
    officialResources: pcseOfficialResources,
    defaultExpanded: { "pcse-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional Cloud Security Engineer 本試験（目安70%前後）",
    },
    quizBadgeLabel: "GCP PCSE 演習",
    flashcardTitle: "PCSE セキュリティ脅威・要件 → 防御・境界・暗号制御即答トレーニング",
    quickSearchChips: ["IAM", "VPC Service Controls", "Cloud KMS", "Cloud Armor", "Security Command Center", "Cloud DLP", "Binary Authorization"],
    examDayChecklist: {
      subtitle:
        "Professional Cloud Security Engineer は 120 分・約 50〜60 問・有効期限 2 年のセキュリティ専門資格です。Workload Identity Federation、VPC-SC 境界、鍵管理 4 方式、DLP・SecOps の深掘り設計が問われます。",
      tips: [
        {
          title: "🔐 外部ワークロードのキーレス認証",
          body: "AWS / GitHub Actions / オンプレから GCP へアクセスする場合は静的 JSON キーを発行せず Workload Identity Federation、人間の社員フェデレーションには Workforce Identity Federation を選びます。",
        },
        {
          title: "🚧 VPC Service Controls の運用コツ",
          body: "本番境界を一気に適用して業務を止めないよう、まずドライラン（Dry-run）モードで違反ログを検証してから強制適用します。クロスプロジェクト許可には Ingress/Egress ルールを使います。",
        },
        {
          title: "🗝️ 暗号鍵オプション（GMEK / CMEK / CSEK / EKM）",
          body: "鍵ローテーション・失効の自社制御＝CMEK（Cloud KMS / HSM）、Google 外部の自社 KMS 保持＝Cloud EKM、リクエスト時のみ鍵提示＝CSEK を要件文から正確に区別します。",
        },
        {
          title: "🛡️ サプライチェーン＆ランタイム防御",
          body: "改ざん検知ブート＝Shielded VMs、メモリ内データ保護＝Confidential Computing、署名済みコンテナのみ許可＝Binary Authorization、脅威可視化＝SCC Premium / Google SecOps。",
        },
      ],
    },
  },
  pcde: {
    id: "pcde",
    levelGroup: "Professional",
    label: "Professional Cloud DevOps Engineer (PCDE)",
    shortLabel: "PCDE",
    badgeText: "GOOGLE CLOUD PROFESSIONAL DEVOPS ENGINEER STUDY HUB",
    headline: "Professional Cloud DevOps Engineer（PCDE）",
    description:
      "SRE（SLI/SLO/エラーバジェット）・Cloud Build / Cloud Deploy CI/CD・GKE 運用・Cloud Monitoring / Logging / Trace / Profiler・インシデント対応を学ぶ DevOps/SRE 向け学習ハブです。",
    storageKey: "ai-park-gcp-pcde-progress-v1",
    examFacts: pcdeExamFacts,
    domains: pcdeDomains,
    comparisons: pcdeComparisons,
    patterns: pcdePatterns,
    pitfalls: pcdePitfalls,
    keyFacts: pcdeKeyFacts,
    quickLookup: pcdeQuickLookup,
    practiceQuestions: pcdePracticeQuestions,
    officialResources: pcdeOfficialResources,
    defaultExpanded: { "pcde-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional Cloud DevOps Engineer 本試験（目安70%前後）",
    },
    quizBadgeLabel: "GCP PCDE 演習",
    flashcardTitle: "PCDE SRE・CI/CD・可観測性要件 → 運用手法・サービス即答トレーニング",
    quickSearchChips: ["SLI / SLO", "Cloud Build", "Cloud Deploy", "GKE", "Cloud Monitoring", "Cloud Trace", "Artifact Registry"],
    examDayChecklist: {
      subtitle:
        "Professional Cloud DevOps Engineer は 120 分・約 50〜60 問・有効期限 2 年の SRE/DevOps 専門資格です。Google 流 SRE 原則（バーンレートアラート・トイル削減）と CI/CD・可観測性の実戦構成が問われます。",
      tips: [
        {
          title: "🚨 バーンレートアラート（Burn Rate Alert）",
          body: "単なる瞬間的なエラー率閾値ではなく、エラーバジェットの消費速度（短窓＋長窓の複数ウィンドウバーンレート）でページングとチケット通知を切り分けます。",
        },
        {
          title: "🚀 Cloud Build + Cloud Deploy + Binary Auth",
          body: "ビルド・テスト＝Cloud Build、Artifact Registry 保存、Binary Authorization で署名検証、Cloud Deploy で Canary / Blue-Green 段階プロモーション＆自動ロールバックを設計します。",
        },
        {
          title: "🔭 可観測性 4 ツールの役割分担",
          body: "指標＆SLO＝Cloud Monitoring、ログ収集＆ルーティング＝Cloud Logging（Log Router / ログベース指標）、分散遅延＝Cloud Trace、CPU/メモリホットスポット＝Cloud Profiler。",
        },
        {
          title: "🤝 インシデント対応と GKE 運用",
          body: "Blameless Postmortem と自動化によるトイル削減を最優先。GKE では HPA / VPA / Cluster Autoscaler の競合回避と PodDisruptionBudget・Probes 設計を押さえます。",
        },
      ],
    },
  },
  pcd: {
    id: "pcd",
    levelGroup: "Professional",
    label: "Professional Cloud Developer (PCD)",
    shortLabel: "PCD",
    badgeText: "GOOGLE CLOUD PROFESSIONAL CLOUD DEVELOPER STUDY HUB",
    headline: "Professional Cloud Developer（PCD）",
    description:
      "12-Factor App・Cloud Run / GKE・Cloud Build / Cloud Deploy・Skaffold・Pub/Sub / Eventarc / Cloud Tasks・Secret Manager・Cloud Trace / Profiler を学ぶ開発者向け学習ハブです。",
    storageKey: "ai-park-gcp-pcd-progress-v1",
    examFacts: pcdExamFacts,
    domains: pcdDomains,
    comparisons: pcdComparisons,
    patterns: pcdPatterns,
    pitfalls: pcdPitfalls,
    keyFacts: pcdKeyFacts,
    quickLookup: pcdQuickLookup,
    practiceQuestions: pcdPracticeQuestions,
    officialResources: pcdOfficialResources,
    defaultExpanded: { "pcd-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional Cloud Developer 本試験（目安70%前後）",
    },
    quizBadgeLabel: "GCP PCD 演習",
    flashcardTitle: "PCD アプリ設計・非同期連携・デバッグ要件 → サービス即答トレーニング",
    quickSearchChips: ["Cloud Run", "GKE", "Pub/Sub", "Cloud Tasks", "Eventarc", "Secret Manager", "Cloud Trace"],
    examDayChecklist: {
      subtitle:
        "Professional Cloud Developer は 120 分・約 50〜60 問・有効期限 2 年の開発者向け最上位資格です。クラウドネイティブ設計、ステートレス／非同期連携、開発〜CI/CD ツール、計測・デバッグの選択が中心です。",
      tips: [
        {
          title: "📨 非同期メッセージングの使い分け",
          body: "多対多のイベント配信＝Pub/Sub、特定ワーカーへのレート制御付きタスク実行＝Cloud Tasks、GCP サービスイベントのルーティング＝Eventarc、複数ステップ制御＝Cloud Workflows。",
        },
        {
          title: "🧱 12-Factor App とステートレス設計",
          body: "セッション状態やファイルはコンテナローカルに持たず Cloud Memorystore（Redis）や Cloud Storage へ外出しし、設定・秘密情報は Secret Manager で注入します。",
        },
        {
          title: "🛠️ 開発・デプロイ効率化ツール",
          body: "ローカル/CI のコンテナ反復＝Skaffold / Cloud Code、高速ビルド＝Cloud Build（Buildpacks）、段階リリース＝Cloud Deploy や Cloud Run トラフィック分割を活用します。",
        },
        {
          title: "🔍 パフォーマンス＆エラー診断",
          body: "ローカル/本番で特定の関数が CPU・メモリを食っている場合は Cloud Profiler、マイクロサービス間レイテンシは Cloud Trace、スタックトレース集約は Error Reporting。",
        },
      ],
    },
  },
  pcne: {
    id: "pcne",
    levelGroup: "Professional",
    label: "Professional Cloud Network Engineer (PCNE)",
    shortLabel: "PCNE",
    badgeText: "GOOGLE CLOUD PROFESSIONAL NETWORK ENGINEER STUDY HUB",
    headline: "Professional Cloud Network Engineer（PCNE）",
    description:
      "Global VPC・Shared VPC・PSC・GKE VPC-Native・Cloud Load Balancing・Cloud DNS・Cloud Interconnect / HA VPN・Cloud Router (BGP)・Cloud Armor / NGFW・Network Intelligence Center を学ぶネットワーク専門学習ハブです。",
    storageKey: "ai-park-gcp-pcne-progress-v1",
    examFacts: pcneExamFacts,
    domains: pcneDomains,
    comparisons: pcneComparisons,
    patterns: pcnePatterns,
    pitfalls: pcnePitfalls,
    keyFacts: pcneKeyFacts,
    quickLookup: pcneQuickLookup,
    practiceQuestions: pcnePracticeQuestions,
    officialResources: pcneOfficialResources,
    defaultExpanded: { "pcne-domain-1": true },
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional Cloud Network Engineer 本試験（目安70%前後）",
    },
    quizBadgeLabel: "GCP PCNE 演習",
    flashcardTitle: "PCNE ネットワーク設計・BGP・LB 要件 → 構成・診断手法即答トレーニング",
    quickSearchChips: ["Shared VPC", "Private Service Connect", "Cloud Load Balancing", "Cloud Router", "Interconnect", "Cloud DNS", "Cloud Armor"],
    examDayChecklist: {
      subtitle:
        "Professional Cloud Network Engineer は 120 分・約 50〜60 問・有効期限 2 年のネットワーク専門資格です。BGP 経路制御（MED・AS-Path）、LB 種別選定、PSC/NCC、NIC による疎通診断が高頻度で出題されます。",
      tips: [
        {
          title: "🔀 VPC 接続方式の選定基準",
          body: "一元ネットワーク管理＋権限分離＝Shared VPC、単純 1 対 1（非推移的）＝VPC ピアリング、ハブ＆スポーク大規模接続＝Network Connectivity Center、IP 重複回避サービス公開＝Private Service Connect。",
        },
        {
          title: "⚖️ ロードバランサ 4 象限の整理",
          body: "外部/内部 × グローバル/リージョン × L7(HTTP/S)/L4(TCP/UDP) × プロキシ/パススルー（クライアント元 IP 維持・UDP 低遅延＝パススルー LB）を正確に整理します。",
        },
        {
          title: "📡 ハイブリッド＆BGP（Cloud Router）",
          body: "送信経路制御は BGP の MED 値（小さい方が優先）、受信経路制御は AS-Path プリペンドやカスタムルート広報。Dedicated 99.99% SLA は 2 メトロ×4 接続構成が必須です。",
        },
        {
          title: "🧪 疎通トラブルシューティング",
          body: "実パケット無しでの経路・FW 設定検証＝Connectivity Tests、トラフィック監査＝VPC Flow Logs、FW ルール最適化＝Firewall Insights、L7 IDS＝Cloud IDS / Packet Mirroring。",
        },
      ],
    },
  },
};

interface GcpProgress {
  completedTopics: string[];
  quizAnswers: Record<string, number[]>;
  bookmarkedQuestions: string[];
  masteredCards: string[];
  topicNotes: Record<string, string>;
  mockExamHistory: CertMockExamRecord[];
}

const DEFAULT_PROGRESS: GcpProgress = {
  completedTopics: [],
  quizAnswers: {},
  bookmarkedQuestions: [],
  masteredCards: [],
  topicNotes: {},
  mockExamHistory: [],
};

const DOMAIN_ICONS: Record<string, typeof Cloud> = {
  "cdl-domain-1": Cloud,
  "cdl-domain-2": Database,
  "cdl-domain-3": Sparkles,
  "cdl-domain-4": Layers,
  "cdl-domain-5": ShieldCheck,
  "cdl-domain-6": Gauge,
  "gail-domain-1": Sparkles,
  "gail-domain-2": Cloud,
  "gail-domain-3": Brain,
  "gail-domain-4": Layers,
  "ace-domain-1": Wrench,
  "ace-domain-2": Cpu,
  "ace-domain-3": Terminal,
  "ace-domain-4": Gauge,
  "ace-domain-5": ShieldCheck,
  "adp-domain-1": Database,
  "adp-domain-2": Activity,
  "adp-domain-3": GitBranch,
  "adp-domain-4": ShieldCheck,
  "pca-domain-1": Layers,
  "pca-domain-2": Network,
  "pca-domain-3": ShieldCheck,
  "pca-domain-4": Cpu,
  "pca-domain-5": Database,
  "pca-domain-6": Gauge,
  "pde-domain-1": Layers,
  "pde-domain-2": Database,
  "pde-domain-3": Cpu,
  "pde-domain-4": Wrench,
  "pde-domain-5": ShieldCheck,
  "pmle-domain-1": Brain,
  "pmle-domain-2": Database,
  "pmle-domain-3": Cpu,
  "pmle-domain-4": Sparkles,
  "pmle-domain-5": GitBranch,
  "pmle-domain-6": Activity,
  "pcse-domain-1": Lock,
  "pcse-domain-2": Network,
  "pcse-domain-3": ShieldCheck,
  "pcse-domain-4": Activity,
  "pcse-domain-5": Wrench,
  "pcde-domain-1": Layers,
  "pcde-domain-2": GitBranch,
  "pcde-domain-3": Activity,
  "pcde-domain-4": Gauge,
  "pcde-domain-5": Cpu,
  "pcd-domain-1": Layers,
  "pcd-domain-2": Terminal,
  "pcd-domain-3": GitBranch,
  "pcd-domain-4": Cpu,
  "pcd-domain-5": Activity,
  "pcne-domain-1": Network,
  "pcne-domain-2": Layers,
  "pcne-domain-3": Cloud,
  "pcne-domain-4": Wrench,
  "pcne-domain-5": Gauge,
};

const ACCENT_STYLES: Record<
  GcpDomain["accentColor"],
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

const COMPARISON_CATEGORIES = [
  "すべて",
  "コンピュート",
  "ストレージ・DB",
  "AI・データ分析",
  "ネットワーク・セキュリティ",
  "運用・移行・コスト",
] as const;

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
  return raw.filter(
    (item): item is CertMockExamRecord =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as CertMockExamRecord).date === "string" &&
      typeof (item as CertMockExamRecord).correct === "number" &&
      typeof (item as CertMockExamRecord).total === "number" &&
      typeof (item as CertMockExamRecord).scaledScore === "number"
  );
}

function loadGcpProgress(storageKey: string): GcpProgress {
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

function normalizeGcpSearchQuery(kw: string): string {
  return kw.split(/[（(/]/)[0].trim();
}

const CERT_LEVEL_GROUPS: { level: GcpLevelGroup; badge: string; ids: GcpCertId[] }[] = [
  { level: "Foundational", badge: "入門・ビジネス", ids: ["cdl", "gail"] },
  { level: "Associate", badge: "基礎実装・実務", ids: ["ace", "adp"] },
  {
    level: "Professional",
    badge: "専門設計・運用",
    ids: ["pca", "pde", "pmle", "pcse", "pcde", "pcd", "pcne"],
  },
];

export default function GcpInfoPage() {
  const [certId, setCertId] = useState<GcpCertId>("cdl");
  const config = CERT_CONFIG[certId];

  const [activeTab, setActiveTab] = useState<TabId>("domains");
  const [progressByCert, setProgressByCert] = useState<Record<GcpCertId, GcpProgress>>({
    cdl: DEFAULT_PROGRESS,
    gail: DEFAULT_PROGRESS,
    ace: DEFAULT_PROGRESS,
    adp: DEFAULT_PROGRESS,
    pca: DEFAULT_PROGRESS,
    pde: DEFAULT_PROGRESS,
    pmle: DEFAULT_PROGRESS,
    pcse: DEFAULT_PROGRESS,
    pcde: DEFAULT_PROGRESS,
    pcd: DEFAULT_PROGRESS,
    pcne: DEFAULT_PROGRESS,
  });
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>(
    CERT_CONFIG.cdl.defaultExpanded
  );
  const [confirmReset, setConfirmReset] = useState(false);
  const [copiedNotes, setCopiedNotes] = useState(false);

  // トピック検索・フィルター
  const [topicQuery, setTopicQuery] = useState("");
  const [onlyIncompleteTopics, setOnlyIncompleteTopics] = useState(false);
  const [onlyWithNotesTopics, setOnlyWithNotesTopics] = useState(false);
  const [openNoteTopics, setOpenNoteTopics] = useState<Record<string, boolean>>({});

  // 比較表フィルター
  const [compCategory, setCompCategory] = useState<string>("すべて");
  const [compQuery, setCompQuery] = useState("");

  // 演習タブジャンプ先
  const [quizDomainTarget, setQuizDomainTarget] = useState<string>("all");

  // バックアップ / 復元パネル
  const [showBackupPanel, setShowBackupPanel] = useState(false);
  const [backupInput, setBackupInput] = useState("");
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setProgressByCert({
        cdl: loadGcpProgress(CERT_CONFIG.cdl.storageKey),
        gail: loadGcpProgress(CERT_CONFIG.gail.storageKey),
        ace: loadGcpProgress(CERT_CONFIG.ace.storageKey),
        adp: loadGcpProgress(CERT_CONFIG.adp.storageKey),
        pca: loadGcpProgress(CERT_CONFIG.pca.storageKey),
        pde: loadGcpProgress(CERT_CONFIG.pde.storageKey),
        pmle: loadGcpProgress(CERT_CONFIG.pmle.storageKey),
        pcse: loadGcpProgress(CERT_CONFIG.pcse.storageKey),
        pcde: loadGcpProgress(CERT_CONFIG.pcde.storageKey),
        pcd: loadGcpProgress(CERT_CONFIG.pcd.storageKey),
        pcne: loadGcpProgress(CERT_CONFIG.pcne.storageKey),
      });
    });
  }, []);

  const progress = progressByCert[certId];

  const saveProgress = (next: GcpProgress) => {
    setProgressByCert((prev) => ({ ...prev, [certId]: next }));
    try {
      window.localStorage.setItem(config.storageKey, JSON.stringify(next));
    } catch {
      // localStorage quota exceeded / disabled
    }
  };

  const handleSwitchCert = (nextCert: GcpCertId) => {
    if (nextCert === certId) return;
    playCyberClick();
    setCertId(nextCert);
    setExpandedDomains(CERT_CONFIG[nextCert].defaultExpanded);
    setTopicQuery("");
    setCompCategory("すべて");
    setCompQuery("");
    setQuizDomainTarget("all");
    setConfirmReset(false);
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

  const handleUpdateTopicNote = (topicId: string, text: string) => {
    const nextNotes = { ...progress.topicNotes };
    if (text.trim() === "") {
      delete nextNotes[topicId];
    } else {
      nextNotes[topicId] = text;
    }
    saveProgress({ ...progress, topicNotes: nextNotes });
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

  const handleRecordMockExam = (record: CertMockExamRecord) => {
    const nextHistory = [record, ...progress.mockExamHistory].slice(0, 10);
    saveProgress({ ...progress, mockExamHistory: nextHistory });
  };

  const handleResetQuiz = () => {
    saveProgress({ ...progress, quizAnswers: {} });
  };

  const handleToggleMasteredCard = (keyword: string) => {
    const exists = progress.masteredCards.includes(keyword);
    const masteredCards = exists
      ? progress.masteredCards.filter((k) => k !== keyword)
      : [...progress.masteredCards, keyword];
    saveProgress({ ...progress, masteredCards });
  };

  const handleResetMasteredCards = () => {
    saveProgress({ ...progress, masteredCards: [] });
  };

  const handleResetAllClick = () => {
    if (!confirmReset) {
      playCyberClick();
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    playCyberClick();
    saveProgress(DEFAULT_PROGRESS);
    setConfirmReset(false);
  };

  const handleExpandAllDomains = (open: boolean) => {
    playCyberClick();
    const next: Record<string, boolean> = {};
    for (const d of config.domains) {
      next[d.id] = open;
    }
    setExpandedDomains(next);
  };

  const handleJumpToDomainQuiz = (domainId: string) => {
    playCyberClick();
    setQuizDomainTarget(domainId);
    setActiveTab("quiz");
  };

  const handleJumpToServiceComparison = (keyword: string) => {
    playCyberClick();
    const cleanQuery = normalizeGcpSearchQuery(keyword);
    setCompCategory("すべて");
    setCompQuery(cleanQuery);
    setActiveTab("comparisons");
  };

  const handleFocusDomain = (domainId: string) => {
    playCyberClick();
    setExpandedDomains((prev) => ({ ...prev, [domainId]: true }));
    setTimeout(() => {
      document.getElementById(domainId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  };

  const handleCopyNotesMarkdown = async () => {
    playCyberClick();
    const lines: string[] = [`# ${config.label} マイメモ`, ""];
    for (const domain of config.domains) {
      const domainLines: string[] = [];
      for (const topic of domain.topics) {
        const note = (progress.topicNotes[topic.id] ?? "").trim();
        if (note) {
          domainLines.push(`### ${topic.code}: ${topic.title}`, "", note, "");
        }
      }
      if (domainLines.length > 0) {
        lines.push(`## Domain ${domain.number}: ${domain.title}`, "", ...domainLines);
      }
    }
    if (lines.length <= 2) return;
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopiedNotes(true);
      setTimeout(() => setCopiedNotes(false), 2500);
    } catch {
      // ignore clipboard errors
    }
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

  const handleImportBackup = () => {
    playCyberClick();
    try {
      const parsed = JSON.parse(backupInput.trim()) as Record<string, unknown>;
      const restored: GcpProgress = {
        completedTopics: normalizeStringArray(parsed.completedTopics),
        quizAnswers: normalizeQuizAnswers(parsed.quizAnswers),
        bookmarkedQuestions: normalizeStringArray(parsed.bookmarkedQuestions),
        masteredCards: normalizeStringArray(parsed.masteredCards),
        topicNotes: normalizeStringRecord(parsed.topicNotes),
        mockExamHistory: normalizeMockExamHistory(parsed.mockExamHistory),
      };
      saveProgress(restored);
      setBackupInput("");
      setImportMessage(`${config.shortLabel} の学習データを復元しました。`);
      setTimeout(() => setImportMessage(null), 3000);
    } catch {
      setImportMessage("JSON形式が正しくありません。コピーしたバックアップ文字列を確認してください。");
    }
  };

  const allTopics = useMemo(() => config.domains.flatMap((d) => d.topics), [config.domains]);
  const completedTopicCount = allTopics.filter((t) =>
    progress.completedTopics.includes(t.id)
  ).length;
  const topicPct = allTopics.length > 0 ? Math.round((completedTopicCount / allTopics.length) * 100) : 0;

  const answeredQuizCount = Object.keys(progress.quizAnswers).length;
  const correctQuizCount = config.practiceQuestions.filter((q) =>
    isQuestionCorrect(q, progress.quizAnswers[q.id])
  ).length;

  const masteredCardCount = progress.masteredCards.length;
  const notedTopicCount = Object.values(progress.topicNotes).filter((v) => v.trim().length > 0).length;

  const totalActions =
    allTopics.length + config.practiceQuestions.length + config.quickLookup.length;
  const doneActions = completedTopicCount + answeredQuizCount + masteredCardCount;
  const overallPct = totalActions > 0 ? Math.round((doneActions / totalActions) * 100) : 0;

  const quizDomains = useMemo(
    () =>
      config.domains.map((d) => ({
        id: d.id,
        number: d.number,
        shortLabel: `D${d.number}`,
        filterLabel: `${d.number}: ${d.title}`,
      })),
    [config.domains]
  );

  const filteredDomains = useMemo(() => {
    const q = topicQuery.trim().toLowerCase();
    return config.domains
      .map((d) => {
        const topics = d.topics.filter((t) => {
          if (onlyIncompleteTopics && progress.completedTopics.includes(t.id)) {
            return false;
          }
          if (onlyWithNotesTopics && !(progress.topicNotes[t.id] ?? "").trim()) {
            return false;
          }
          if (!q) return true;
          const haystack = [t.code, t.title, ...t.services, ...t.keyPoints, t.examTip]
            .join(" ")
            .toLowerCase();
          return haystack.includes(q);
        });
        return { ...d, visibleTopics: topics };
      })
      .filter((d) => d.visibleTopics.length > 0);
  }, [
    config.domains,
    topicQuery,
    onlyIncompleteTopics,
    onlyWithNotesTopics,
    progress.completedTopics,
    progress.topicNotes,
  ]);

  const availableComparisonCategories = useMemo(
    () =>
      COMPARISON_CATEGORIES.filter(
        (cat) => cat === "すべて" || config.comparisons.some((c) => c.category === cat)
      ),
    [config.comparisons]
  );

  const normalizedCompQuery = compQuery.trim().toLowerCase();

  const filteredComparisons = useMemo(() => {
    return config.comparisons.filter((comp) => {
      if (compCategory !== "すべて" && comp.category !== compCategory) return false;
      if (!normalizedCompQuery) return true;
      const haystack = [
        comp.title,
        comp.subtitle,
        comp.decisionRule,
        ...comp.columns,
        ...comp.rows.flatMap((r) => [r.feature, ...r.values]),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedCompQuery);
    });
  }, [config.comparisons, compCategory, normalizedCompQuery]);

  const filteredQuickLookup = useMemo(() => {
    if (!normalizedCompQuery) return config.quickLookup;
    return config.quickLookup.filter((item) =>
      `${item.keyword} ${item.category} ${item.recommended} ${item.reason}`
        .toLowerCase()
        .includes(normalizedCompQuery)
    );
  }, [config.quickLookup, normalizedCompQuery]);

  const filteredPatterns = useMemo(() => {
    if (!normalizedCompQuery) return config.patterns;
    return config.patterns.filter((pat) =>
      [pat.title, pat.badge, pat.summary, ...pat.flow, ...pat.keyDesignPoints]
        .join(" ")
        .toLowerCase()
        .includes(normalizedCompQuery)
    );
  }, [config.patterns, normalizedCompQuery]);

  const filteredPitfalls = useMemo(() => {
    if (!normalizedCompQuery) return config.pitfalls;
    return config.pitfalls.filter((pit) =>
      [pit.trap, pit.whyWrong, pit.correctApproach]
        .join(" ")
        .toLowerCase()
        .includes(normalizedCompQuery)
    );
  }, [config.pitfalls, normalizedCompQuery]);

  const filteredKeyFacts = useMemo(() => {
    if (!normalizedCompQuery) return config.keyFacts;
    return config.keyFacts.filter((kf) =>
      [kf.target, kf.value, kf.detail].join(" ").toLowerCase().includes(normalizedCompQuery)
    );
  }, [config.keyFacts, normalizedCompQuery]);

  const tabs: { id: TabId; label: string; icon: typeof BookOpen; badge?: string }[] = [
    {
      id: "domains",
      label: "トピック別学習",
      icon: BookOpen,
      badge: `${completedTopicCount}/${allTopics.length}`,
    },
    { id: "comparisons", label: "比較・逆引き・設計", icon: TableProperties },
    {
      id: "flashcards",
      label: "暗記カード",
      icon: Layers2,
      badge: `${masteredCardCount}/${config.quickLookup.length}`,
    },
    {
      id: "quiz",
      label: "練習問題・模試",
      icon: HelpCircle,
      badge: `${correctQuizCount}/${config.practiceQuestions.length}`,
    },
    { id: "resources", label: "公式リソース", icon: Compass },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="GCP・Google Cloud情報局"
        subtitle="Foundational (CDL / GAIL) ・ Associate (ACE / ADP) ・ Professional (PCA / PDE / PMLE / PCSE / PCDE / PCD / PCNE) 全11資格統合学習ハブ"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          title="🚧 一部工事中・学習ハブ先行公開"
          message="現在 Google Cloud 認定資格（CDL / GAIL / ACE / ADP / PCA / PDE / PMLE / PCSE / PCDE / PCD / PCNE 全11資格）の公式試験ガイドに基づく学習ハブを掲載しています。社内の GCP 利用ルールや資格取得支援制度等は準備中（確定次第掲載）です。"
          statusType="construction"
        />

        {/* 資格レベル切り替え（全11資格・レベル別グループ） */}
        <section className="flex flex-col gap-3 bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center space-x-2">
              <Cloud size={16} className="text-cyan-600" />
              <span className="text-xs sm:text-sm font-black text-slate-800">
                学習資格選択（全11資格）
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              現在: {config.levelGroup} / {config.shortLabel}
            </span>
          </div>
          <div className="space-y-2">
            {CERT_LEVEL_GROUPS.map((group) => (
              <div
                key={group.level}
                className="flex flex-col sm:flex-row sm:items-center gap-2 bg-slate-100/90 p-2 rounded-xl border border-slate-200/70"
              >
                <div className="flex items-center space-x-1.5 sm:w-44 shrink-0 px-1.5">
                  <span className="text-[11px] font-black text-slate-800">{group.level}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    {group.badge}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {group.ids.map((id) => {
                    const item = CERT_CONFIG[id];
                    const active = certId === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleSwitchCert(id)}
                        onMouseEnter={() => playCyberHover()}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer sm:whitespace-nowrap text-left ${
                          active
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 学習ステータス HUD バナー */}
        <TiltCard maxTilt={2} glareOpacity={0.05} className="rounded-3xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border border-cyan-700/50 p-5 sm:p-8 text-white shadow-xl"
          >
            <div className="absolute -top-10 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 tracking-wider">
                    <Cloud size={12} />
                    <span>{config.badgeText}</span>
                  </span>
                  <span className="text-xs text-slate-300">
                    {allTopics.length} トピック ・ 比較表 {config.comparisons.length} 種 ・ カード{" "}
                    {config.quickLookup.length} 枚 ・ 演習 {config.practiceQuestions.length} 問
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white break-words">
                  <span className="inline-block">{config.headline}</span>
                  <span className="inline-block ml-1">合格対策学習ハブ</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {config.description}
                </p>
              </div>

              <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:min-w-[360px]">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">トピック習得</div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">{topicPct}%</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {completedTopicCount} / {allTopics.length}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">暗記カード</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    {masteredCardCount} / {config.quickLookup.length}
                  </div>
                  <div className="text-[11px] text-slate-400">枚習得</div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold">演習問題</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                    {correctQuizCount} / {config.practiceQuestions.length}
                  </div>
                  <div className="text-[11px] text-slate-400">問正解</div>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* 試験概要カード */}
        <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {config.examFacts.map((fact) => (
            <div
              key={fact.label}
              className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs space-y-1 min-w-0"
            >
              <div className="text-[11px] font-bold text-slate-400">{fact.label}</div>
              <div className="text-sm sm:text-base font-black text-slate-900 break-words">
                {fact.value}
              </div>
              <div className="text-[11px] text-slate-500 leading-snug">{fact.detail}</div>
            </div>
          ))}
        </section>

        {/* 総合進捗＆データ管理バー */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 text-xs font-bold">
                <span className="text-slate-700 flex items-start space-x-1.5">
                  <Award className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>
                    {config.shortLabel} 総合学習進捗（トピック・暗記カード・練習問題）
                  </span>
                </span>
                <span className="font-mono text-cyan-700 shrink-0">{overallPct}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyNotesMarkdown}
                disabled={notedTopicCount === 0}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-50"
              >
                {copiedNotes ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span className="text-emerald-700">Markdownコピー済</span>
                  </>
                ) : (
                  <>
                    <StickyNote size={13} />
                    <span>メモをMarkdownコピー</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  playCyberClick();
                  setShowBackupPanel((v) => !v);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <Download size={13} />
                <span>バックアップ / 復元</span>
              </button>

              <button
                type="button"
                onClick={handleResetAllClick}
                className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  confirmReset
                    ? "bg-rose-600 text-white border-rose-600"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-rose-600"
                }`}
              >
                <RotateCcw size={13} />
                <span>{confirmReset ? "もう一度押すと全消去" : "進捗リセット"}</span>
              </button>
            </div>
          </div>

          {showBackupPanel && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-xs text-slate-600">
                  {config.shortLabel} の進捗やメモはブラウザの localStorage に保存されます。別端末へ移行する場合は JSON 文字列をコピーしてください。
                </p>
                <button
                  type="button"
                  onClick={handleCopyBackup}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer shrink-0"
                >
                  {copiedBackup ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedBackup ? "コピーしました" : "現在のデータをコピー"}</span>
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={backupInput}
                  onChange={(e) => setBackupInput(e.target.value)}
                  placeholder="復元するバックアップJSON文字列を貼り付け..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={handleImportBackup}
                  disabled={!backupInput.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 disabled:opacity-40 cursor-pointer shrink-0"
                >
                  復元を実行
                </button>
              </div>
              {importMessage && (
                <div className="text-xs font-bold text-cyan-700">{importMessage}</div>
              )}
            </div>
          )}
        </section>

        {/* タブナビゲーション */}
        <nav className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playCyberClick();
                  setActiveTab(tab.id);
                }}
                onMouseEnter={() => playCyberHover()}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={15} className="shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                      active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* TAB 1: トピック別学習 */}
        {activeTab === "domains" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="relative w-full lg:flex-1 lg:max-w-xs">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={topicQuery}
                  onChange={(e) => setTopicQuery(e.target.value)}
                  placeholder="GCP サービス・gcloud 検索..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                />
                {topicQuery && (
                  <button
                    type="button"
                    onClick={() => setTopicQuery("")}
                    aria-label="検索をクリア"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playCyberClick();
                    setOnlyIncompleteTopics((v) => !v);
                  }}
                  className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    onlyIncompleteTopics
                      ? "bg-cyan-600 text-white border-cyan-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-cyan-300"
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
                  className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    onlyWithNotesTopics
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-amber-300"
                  }`}
                >
                  <StickyNote size={13} />
                  <span>メモあり ({notedTopicCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExpandAllDomains(true)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronsUpDown size={13} />
                  <span>全展開</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExpandAllDomains(false)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <span>全折りたたみ</span>
                </button>
              </div>
            </div>

            {/* ドメイン別クイックジャンプ＆進捗ミニバー */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 ${
                config.domains.length === 4
                  ? "lg:grid-cols-4"
                  : config.domains.length === 5
                  ? "lg:grid-cols-5"
                  : "lg:grid-cols-6"
              }`}
            >
              {config.domains.map((domain) => {
                const style = ACCENT_STYLES[domain.accentColor];
                const done = domain.topics.filter((t) =>
                  progress.completedTopics.includes(t.id)
                ).length;
                const pct = domain.topics.length > 0 ? Math.round((done / domain.topics.length) * 100) : 0;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => {
                      setTopicQuery("");
                      setOnlyIncompleteTopics(false);
                      setOnlyWithNotesTopics(false);
                      handleFocusDomain(domain.id);
                    }}
                    onMouseEnter={() => playCyberHover()}
                    className="bg-white rounded-xl border border-slate-200/80 hover:border-cyan-300 p-3 text-left transition-all shadow-xs space-y-1.5 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${style.badge}`}>
                        D{domain.number}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {done}/{domain.topics.length}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-cyan-700 line-clamp-2 leading-snug min-h-[2rem]">
                      {domain.title}
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${style.bar} transition-all duration-300`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredDomains.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-2">
                <Search className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="text-sm font-black text-slate-700">
                  条件に一致するトピックがありません
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTopicQuery("");
                    setOnlyIncompleteTopics(false);
                    setOnlyWithNotesTopics(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  フィルターを解除
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDomains.map((domain) => {
                  const Icon = DOMAIN_ICONS[domain.id] ?? Cloud;
                  const style = ACCENT_STYLES[domain.accentColor];
                  const isExpanded = Boolean(expandedDomains[domain.id] || topicQuery.trim());
                  const domainDone = domain.topics.filter((t) =>
                    progress.completedTopics.includes(t.id)
                  ).length;
                  const domainPct = Math.round((domainDone / domain.topics.length) * 100);

                  return (
                    <div
                      key={domain.id}
                      id={domain.id}
                      className={`scroll-mt-6 bg-white rounded-2xl border ${style.border} shadow-xs overflow-hidden`}
                    >
                      <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            playCyberClick();
                            setExpandedDomains((prev) => ({
                              ...prev,
                              [domain.id]: !prev[domain.id],
                            }));
                          }}
                          className="flex items-start space-x-3.5 text-left flex-1 min-w-0 cursor-pointer"
                        >
                          <div className={`p-2.5 rounded-xl border shrink-0 ${style.iconBg}`}>
                            <Icon size={20} />
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${style.badge}`}
                              >
                                Domain {domain.number} ・ 目安 {domain.weight}
                              </span>
                              <span className="text-xs font-mono text-slate-500">
                                完了 {domainDone}/{domain.topics.length} ({domainPct}%)
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 break-words">
                              {domain.title}
                              <span className="ml-2 text-xs font-normal text-slate-400">
                                {domain.englishTitle}
                              </span>
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">{domain.summary}</p>
                          </div>
                        </button>

                        <div className="flex items-center justify-end space-x-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleJumpToDomainQuiz(domain.id)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                          >
                            <span>この分野の問題を解く</span>
                            <ArrowRight size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playCyberClick();
                              setExpandedDomains((prev) => ({
                                ...prev,
                                [domain.id]: !prev[domain.id],
                              }));
                            }}
                            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer"
                            aria-label="展開切り替え"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4">
                          {domain.visibleTopics.map((topic) => {
                            const isDone = progress.completedTopics.includes(topic.id);
                            const noteText = progress.topicNotes[topic.id] ?? "";
                            const isNoteOpen = Boolean(openNoteTopics[topic.id] || noteText.trim());

                            return (
                              <div
                                key={topic.id}
                                className={`bg-white rounded-xl border p-5 space-y-3 transition-all ${
                                  isDone ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200/80"
                                }`}
                              >
                                <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-2.5 sm:gap-3">
                                  <button
                                    type="button"
                                    onClick={() => toggleTopic(topic.id)}
                                    className="flex items-start space-x-2.5 text-left cursor-pointer group min-w-0 flex-1"
                                  >
                                    {isDone ? (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-slate-300 group-hover:text-cyan-500 shrink-0 mt-0.5" />
                                    )}
                                    <div className="min-w-0">
                                      <span className="text-[11px] font-mono font-bold text-slate-400">
                                        Topic {topic.code}
                                      </span>
                                      <h4
                                        className={`text-sm sm:text-base font-black break-words ${
                                          isDone ? "text-emerald-950" : "text-slate-900"
                                        }`}
                                      >
                                        {topic.title}
                                      </h4>
                                    </div>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      playCyberClick();
                                      setOpenNoteTopics((prev) => ({
                                        ...prev,
                                        [topic.id]: !prev[topic.id],
                                      }));
                                    }}
                                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer shrink-0 ${
                                      noteText.trim()
                                        ? "bg-amber-50 text-amber-800 border-amber-200"
                                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                    }`}
                                  >
                                    <StickyNote size={12} />
                                    <span>{noteText.trim() ? "メモ済" : "メモ"}</span>
                                  </button>
                                </div>

                                {/* 関連サービス・コマンド */}
                                <div className="flex flex-wrap gap-1.5">
                                  {topic.services.map((svc) => (
                                    <button
                                      key={svc}
                                      type="button"
                                      onClick={() => handleJumpToServiceComparison(svc)}
                                      title="比較表で検索する"
                                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 font-mono text-[11px] font-bold text-slate-700 hover:text-cyan-800 transition-colors cursor-pointer"
                                    >
                                      {svc}
                                    </button>
                                  ))}
                                </div>

                                {/* 学習要点 */}
                                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                                  {topic.keyPoints.map((pt) => (
                                    <li key={pt} className="flex items-start space-x-2">
                                      <span className="text-cyan-500 font-bold mt-0.5">•</span>
                                      <span className="leading-relaxed">{pt}</span>
                                    </li>
                                  ))}
                                </ul>

                                {/* 試験対策ヒント */}
                                <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 px-3.5 py-2.5 flex items-start space-x-2">
                                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <p className="text-xs text-amber-950 leading-relaxed">
                                    <span className="font-bold">試験のポイント: </span>
                                    {topic.examTip}
                                  </p>
                                </div>

                                {/* 個人メモ */}
                                {isNoteOpen && (
                                  <div className="pt-2">
                                    <textarea
                                      rows={2}
                                      value={noteText}
                                      onChange={(e) => handleUpdateTopicNote(topic.id, e.target.value)}
                                      placeholder="自分用の学習メモや公式ドキュメントの覚え書きを記入（自動保存）..."
                                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/30 text-xs text-slate-800 focus:outline-none focus:border-amber-400"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: 比較表・設計パターン */}
        {activeTab === "comparisons" && (
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {availableComparisonCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        playCyberClick();
                        setCompCategory(cat);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        compCategory === cat
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
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
                    placeholder="比較表・逆引き・サービス検索..."
                    className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                  />
                  {compQuery && (
                    <button
                      type="button"
                      onClick={() => setCompQuery("")}
                      aria-label="検索をクリア"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* 人気サービス クイック検索チップ */}
              <div className="flex flex-wrap items-center gap-1.5 px-1">
                <span className="text-[11px] font-bold text-slate-400 mr-1">
                  よく調べるサービス:
                </span>
                {config.quickSearchChips.map((kw) => {
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
                          : "bg-white text-slate-600 border-slate-200 hover:border-cyan-300 hover:text-cyan-700"
                      }`}
                    >
                      {kw}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* すべて0件時のエンプティステート */}
            {filteredQuickLookup.length === 0 &&
              filteredComparisons.length === 0 &&
              filteredPatterns.length === 0 &&
              filteredPitfalls.length === 0 &&
              filteredKeyFacts.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3 shadow-xs">
                  <Search className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="text-sm font-black text-slate-900">
                    「{compQuery}」に一致する項目が見つかりませんでした
                  </div>
                  <p className="text-xs text-slate-500">
                    別のキーワード（例：{config.quickSearchChips.slice(0, 4).join("、")}）で検索するか、条件をリセットしてください。
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setCompCategory("すべて");
                      setCompQuery("");
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    検索・カテゴリをリセット
                  </button>
                </div>
              )}

            {/* 要件キーワード → 推奨サービス即断チートシート */}
            {filteredQuickLookup.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>本番直前：要件キーワード → 推奨サービス即断チートシート</span>
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    {filteredQuickLookup.length} 件
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredQuickLookup.map((item) => (
                    <div
                      key={item.keyword}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          {item.keyword}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-black text-cyan-700 break-words">
                        → {item.recommended}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {filteredComparisons.length > 0 && (
              <div className="space-y-5">
                {filteredComparisons.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200">
                          {comp.category}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                          {comp.title}
                        </h3>
                        <p className="text-xs text-slate-500">{comp.subtitle}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            {comp.columns.map((col) => (
                              <th key={col} className="py-2.5 px-3 font-black text-slate-700 whitespace-nowrap">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {comp.rows.map((row) => (
                            <tr key={row.feature} className="hover:bg-slate-50/70">
                              <td className="py-2.5 px-3 font-bold text-slate-800">{row.feature}</td>
                              {row.values.map((val, idx) => (
                                <td key={idx} className="py-2.5 px-3 text-slate-600 text-xs">
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="rounded-xl bg-slate-900 text-slate-100 px-4 py-3 text-xs flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-cyan-300">使い分けルール: </strong>
                        {comp.decisionRule}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 頻出アーキテクチャ・運用パターン */}
            {filteredPatterns.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-cyan-600" />
                  <span>頻出アーキテクチャ・運用パターン</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPatterns.map((pat) => (
                    <SpotlightCard
                      key={pat.id}
                      className="p-5 space-y-3 bg-white border border-slate-200/80 rounded-2xl"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm sm:text-base font-black text-slate-900">{pat.title}</h4>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
                          {pat.badge}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {pat.flow.map((step, idx) => (
                          <div key={step} className="flex items-center gap-1.5">
                            <span className="px-2 py-1 rounded-lg bg-slate-100 font-mono text-[11px] font-bold text-slate-800">
                              {step}
                            </span>
                            {idx < pat.flow.length - 1 && (
                              <ArrowRight size={12} className="text-slate-400 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{pat.summary}</p>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {pat.keyDesignPoints.map((pt) => (
                          <li key={pt} className="flex items-start space-x-1.5">
                            <span className="text-cyan-600 font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </SpotlightCard>
                  ))}
                </div>
              </section>
            )}

            {/* 試験のひっかけ対策 */}
            {filteredPitfalls.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>よくあるひっかけ・誤答パターン</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPitfalls.map((pit) => (
                    <div
                      key={pit.id}
                      className="bg-white rounded-2xl border border-amber-200/80 p-5 space-y-2.5 shadow-xs"
                    >
                      <div className="text-xs font-black text-rose-700">✕ {pit.trap}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{pit.whyWrong}</p>
                      <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 px-3 py-2 text-xs text-emerald-950">
                        <span className="font-bold">○ 正しいアプローチ: </span>
                        {pit.correctApproach}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 重要仕様・数値早見 */}
            {filteredKeyFacts.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                  <Gauge className="w-5 h-5 text-indigo-600" />
                  <span>重要仕様・制限値早見表</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {filteredKeyFacts.map((kf) => (
                    <div
                      key={kf.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-1 shadow-xs min-w-0"
                    >
                      <div className="font-mono text-xs font-black text-indigo-700 break-words">{kf.target}</div>
                      <div className="text-sm font-black text-slate-900 break-words">{kf.value}</div>
                      <p className="text-[11px] text-slate-500 leading-snug">{kf.detail}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* TAB 3: フラッシュカード */}
        {activeTab === "flashcards" && (
          <CertificationFlashcards
            key={certId}
            items={config.quickLookup}
            masteredKeywords={progress.masteredCards}
            onToggleMastered={handleToggleMasteredCard}
            onResetMastered={handleResetMasteredCards}
            badgeText={`GCP ${config.shortLabel} 直前暗記フラッシュカード`}
            title={config.flashcardTitle}
            promptLabel="次の要件に対応する Google Cloud サービス・機能は？"
            answerLabel="推奨サービス・コマンド"
          />
        )}

        {/* TAB 4: 練習問題・模擬試験 */}
        {activeTab === "quiz" && (
          <CertificationPracticeQuiz
            key={certId}
            questions={config.practiceQuestions}
            domains={quizDomains}
            examBadgeLabel={config.quizBadgeLabel}
            passingConfig={config.passingConfig}
            answers={progress.quizAnswers}
            bookmarkedIds={progress.bookmarkedQuestions}
            mockExamHistory={progress.mockExamHistory}
            initialDomain={quizDomainTarget}
            onSubmitAnswer={handleSubmitAnswer}
            onToggleBookmark={handleToggleBookmark}
            onRecordMockExam={handleRecordMockExam}
            onResetQuiz={handleResetQuiz}
          />
        )}

        {/* TAB 5: 公式リソース */}
        {activeTab === "resources" && (
          <div className="space-y-8">
            {/* 試験本番・直前チェックリスト */}
            <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 break-words">
                  {config.label} 試験本番・直前チェックリスト（時間配分＆受験のコツ）
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {config.examDayChecklist.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                {config.examDayChecklist.tips.map((tip) => (
                  <div
                    key={tip.title}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-1.5 min-w-0"
                  >
                    <div className="font-black text-slate-900 text-xs sm:text-sm break-words">
                      {tip.title}
                    </div>
                    <p className="leading-relaxed text-slate-600">{tip.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 公式学習リソース */}
            <section className="space-y-3">
              <h3 className="text-lg font-black text-slate-900">
                Google Cloud 公式学習リソース（{config.label}）
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.officialResources.map((res) => (
                  <TiltCard key={res.url} className="h-full">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playCyberClick()}
                      className="block h-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-cyan-300 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                          {res.badge}
                        </span>
                        <ExternalLink size={15} className="text-slate-400" />
                      </div>
                      <h4 className="text-base font-black text-slate-900">{res.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                      <div className="text-[11px] font-mono text-cyan-700 truncate">{res.url}</div>
                    </a>
                  </TiltCard>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
