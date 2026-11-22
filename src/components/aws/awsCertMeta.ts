import type { CertPassingConfig } from "@/components/certification/types";

export type AwsCertId = "clf" | "aif" | "saa" | "dva" | "soa" | "sap";
export type AwsCertLevel = "Foundational" | "Associate" | "Professional";

export interface AwsCertMeta {
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
}

export const AWS_CERT_IDS: AwsCertId[] = ["clf", "aif", "saa", "dva", "soa", "sap"];

export const AWS_LEVEL_GROUPS: {
  level: AwsCertLevel;
  badge: string;
  ids: AwsCertId[];
}[] = [
  { level: "Foundational", badge: "入門・基礎", ids: ["clf", "aif"] },
  { level: "Associate", badge: "実務設計・開発・運用", ids: ["saa", "dva", "soa"] },
  { level: "Professional", badge: "上級アーキテクト", ids: ["sap"] },
];

const ESL_ACCOMMODATION_TIP = {
  title: "ピアソンVUE 受験準備（オンライン / 会場・ESL +30分）",
  body: "オンライン受験（OnVUE）の場合は事前のシステムテストと静かな個室・本人確認書類が必須。非英語母語者が英語で受験する場合に限り（日本語受験は対象外）、試験予約前に AWS 認定アカウントで申請すると試験時間 +30 分延長（ESL +30 MINUTES）が利用可能です。",
};

export const AWS_CERT_META: Record<AwsCertId, AwsCertMeta> = {
  clf: {
    id: "clf",
    shortCode: "CLF-C02",
    level: "Foundational",
    switchLabel: "Cloud Practitioner (CLF-C02)",
    hudBadgeText: "AWS CLF-C02 STUDY HUB",
    headlineLead: "AWS認定クラウドプラクティショナー",
    headlineSuffix: "- 基礎 合格対策",
    description:
      "試験ガイド（CLF-C02）の4つの出題ドメインに沿って、クラウドの基礎概念・責任共有モデル・主要サービスの役割・料金と最新サポートプラン4区分をまとめた入門〜基礎学習ハブです。学習記録はブラウザに自動保存されます。",
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
      step2Title: "主要サービスと料金・サポート体系の整理",
      step2Desc:
        "本ページの「4ドメイン攻略」と「頻出比較表」を使い、EC2 / Lambda / S3 / RDS や最新サポートプラン（Basic / ビジネスサポート+ / エンタープライズ / Unified Operations）の違いを押さえる。",
      step4Desc:
        "90分で65問（1問約1.4分）のペース配分を確認し、苦手ドメインを重点復習して本番（合格ライン 700点）に臨む。",
    },
    examDayChecklist: {
      subtitle:
        "CLF-C02 は90分で65問を出題します。基礎用語の正確な区別と責任共有モデル・料金管理・サポートプランの整理が合格（700点）の鍵です。",
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
          title: "責任共有モデルとサポートプラン4区分を即答",
          body: "「AWS の責任か顧客の責任か」「24/7 技術支援・Trusted Advisor チェック一式＝ビジネスサポート+、指定 TAM・15 分未満＝エンタープライズサポート、5 分未満・24/7 監視＝Unified Operations（※旧 Developer/Business/On-Ramp は 2027/1/1 終了）」を瞬時に判別できるよう整理しておきます。",
        },
        ESL_ACCOMMODATION_TIP,
      ],
    },
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
        "AIF-C01 は90分で65問（択一・複数・並べ替え・内容一致の4形式）を出題します。AI ユースケースに適した AWS サービス選定と責任ある AI・セキュリティ原則の区別が合格（700点）の鍵です。",
      tips: [
        {
          title: "1問約1.4分ペース・4種類の出題形式に備える",
          body: "30問経過時点で残り45分前後が目安。公式ガイド定義の「択一・複数・並べ替え・内容一致」の形式に慣れ、迷う問題はフラグを付けて見直します。",
        },
        {
          title: "非採点問題（15問）に動揺しない",
          body: "65問のうち15問は採点対象外の試験的設問です。見慣れない生成 AI 機能や細かなモデル名が出ても動揺せず、基本の選定軸で着実に得点（700点以上）を狙います。",
        },
        {
          title: "Customization 手法（Prompt / RAG / Fine-Tuning）を見極める",
          body: "「最新の社内ドキュメントを参照」＝ RAG（Bedrock Knowledge Bases）、「特定ドメインの出力形式・口調調整」＝ Fine-Tuning、「追加学習なしで試す」＝ プロンプトエンジニアリング、を軸に絞ります。",
        },
        ESL_ACCOMMODATION_TIP,
      ],
    },
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
        ESL_ACCOMMODATION_TIP,
      ],
    },
  },
  dva: {
    id: "dva",
    shortCode: "DVA-C03",
    level: "Associate",
    switchLabel: "Developer Associate (DVA-C03)",
    hudBadgeText: "AWS DVA-C03 STUDY HUB",
    headlineLead: "AWS認定デベロッパー",
    headlineSuffix: "- アソシエイト 合格対策",
    description:
      "試験ガイド（DVA-C03 ※旧 DVA-C02 は 2026/11/30 終了・12/01 開始）の4つの出題ドメインに沿って、Lambda / API Gateway / DynamoDB 開発・Cognito / KMS・AI サービスセキュリティ（Task 2.3）・ECR/ECS/EKS テスト＆デプロイをまとめた学習ハブです。学習記録はブラウザに自動保存されます。",
    storageKey: "ai-park-aws-dva-progress-v1",
    passingConfig: {
      minScore: 100,
      maxScore: 1000,
      passingScore: 720,
      passingPct: 72,
      officialExamLabel: "AWS公式模擬試験 (DVA-C03)",
    },
    secondsPerQuestion: 120,
    defaultExpanded: { "dva-domain-1": true },
    quizBadgeLabel: "DVA-C03 本番形式演習",
    quickSearchChips: ["Lambda", "DynamoDB", "API Gateway", "Cognito", "Bedrock", "ECR"],
    domainShortLabels: {
      "dva-domain-1": "D1: サービス開発",
      "dva-domain-2": "D2: セキュリティ",
      "dva-domain-3": "D3: テストとデプロイ",
      "dva-domain-4": "D4: トラブルシュート・最適化",
    },
    roadmapSteps: {
      step1Title: "サーバーレス開発と認証・暗号化・AI セキュリティの基礎",
      step1Desc:
        "Lambda 呼び出しモデル・API Gateway 統合・DynamoDB 設計に加え、IAM/STS・KMS エンベロープ暗号化・Task 2.3 の Bedrock 閉域/Guardrails 制御を理解する。",
      step2Title: "API・DB・テスト＆コンテナ CI/CD・監視ツールの使い分け",
      step2Desc:
        "本ページの「4ドメイン攻略」と「頻出比較表」を使い、SAM ユニットテスト・ECR/ECS/EKS デプロイ・Cognito・X-Ray / EMF の違いを整理する。",
      step4Desc:
        "130分で65問（1問約2分）のペース配分を確認し、苦手ドメインを重点復習して本番（合格ライン 720点）に臨む。",
    },
    examDayChecklist: {
      subtitle:
        "DVA-C03（旧 DVA-C02 は 2026/11/30 終了）は130分で65問を出題します。サーバーレス設計・AI利用セキュリティ（Task 2.3）・テスト＆コンテナデプロイ・X-Ray 切り分けが合格（720点）の鍵です。",
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
          title: "DVA-C03 新設ポイントと定番制約値を即断",
          body: "DynamoDB 400KB 上限・KMS 4KB 直接制限に加え、Task 2.3（VPC Endpoint＋学習オプトアウト＋Bedrock Guardrails＋HITL）や ECR スキャン/ライフサイクル・ECS/EKS デプロイを押さえます。",
        },
        ESL_ACCOMMODATION_TIP,
      ],
    },
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
        ESL_ACCOMMODATION_TIP,
      ],
    },
  },
  sap: {
    id: "sap",
    shortCode: "SAP-C03",
    level: "Professional",
    switchLabel: "Solutions Architect Professional (SAP-C03)",
    hudBadgeText: "AWS SAP-C03 STUDY HUB",
    headlineLead: "AWS認定ソリューションアーキテクト",
    headlineSuffix: "- プロフェッショナル 合格対策",
    description:
      "試験ガイド（SAP-C03 ※2026/11/17 改定・旧 SAP-C02 は 11/16 終了）の5つの出題ドメインに沿って、クラウド設計/生成AI（Bedrock/RAG/VPC Lattice）・セキュリティ/RCP/PQC・コスト最適化・回復力/移行・DevSecOps/FIS 自動化を鍛える上級学習ハブです。学習記録はブラウザに自動保存されます。",
    storageKey: "ai-park-aws-sap-progress-v1",
    passingConfig: {
      minScore: 100,
      maxScore: 1000,
      passingScore: 750,
      passingPct: 75,
      officialExamLabel: "AWS公式模擬試験 (SAP-C03)",
    },
    secondsPerQuestion: 140,
    defaultExpanded: { "sap-domain-1": true },
    quizBadgeLabel: "SAP-C03 本番形式演習",
    quickSearchChips: [
      "Organizations",
      "Transit Gateway",
      "Direct Connect",
      "Bedrock",
      "VPC Lattice",
      "AWS FIS",
      "CodeDeploy",
    ],
    domainShortLabels: {
      "sap-domain-1": "D1: クラウド設計・実装",
      "sap-domain-2": "D2: セキュリティ・ガバナンス",
      "sap-domain-3": "D3: コスト最適化",
      "sap-domain-4": "D4: 回復力・移行・BCP",
      "sap-domain-5": "D5: 運用優秀性・自動化",
    },
    roadmapSteps: {
      step1Title: "マルチアカウント統制・ネットワーク・AI 統合の全体像",
      step1Desc:
        "AWS Organizations (SCP/RCP) / Control Tower、Transit Gateway・Direct Connect・VPC Lattice、および生成 AI（Bedrock / RAG）統合基盤を理解する。",
      step2Title: "5ドメイン横断の複合トレードオフ整理",
      step2Desc:
        "本ページの「5ドメイン攻略」と「頻出比較表」を使い、MGN/DMS 大規模移行・ARC マルチリージョン DR・FIS/DevSecOps・FinOps を比較整理する。",
      step4Desc:
        "180分で75問（1問約2.4分）の長文読解ペースを確認し、苦手ドメインを重点復習して本番（合格ライン 750点）に臨む。",
    },
    examDayChecklist: {
      subtitle:
        "SAP-C03 は長文の複合シナリオが75問・180分続く5ドメイン構成の上級試験です。要件と制約を素早く構造化する読解戦略が合格（750点）の鍵になります。",
      tips: [
        {
          title: "1問約2.4分ペース（75問で180分）",
          body: "25問あたり60分（1時間）が基準ペース。長文に時間を奪われすぎないよう、フラグ機能を使って2分半を超えそうな問題は仮回答で次へ進みます。",
        },
        {
          title: "非採点問題（10問）に動揺しない",
          body: "75問のうち10問は採点対象外の試験的設問です。高度な新機能（AgentCore・PQC・FIS 等）が出ても焦らず、65問の採点問題で750点ラインの達成を目指します。",
        },
        {
          title: "要件と制約の「除外条件」から絞る",
          body: "SAP-C03 の選択肢はどれも技術的に実現可能なものが並びます。「ダウンタイム最小」「静的キー不要」「運用負荷最小」などの制約条件に反する選択肢を消去法で落とすのが効果的です。",
        },
        ESL_ACCOMMODATION_TIP,
      ],
    },
  },
};
