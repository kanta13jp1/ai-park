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

// 出典: AWS Certified Solutions Architect - Professional (SAP-C03) 公式試験ガイド (旧 SAP-C02 は 2026/11/16 終了・2026/11/17 より SAP-C03 開始)
// https://docs.aws.amazon.com/ja_jp/aws-certification/latest/solutions-architect-professional-03/solutions-architect-professional-03.html
export const sapExamFacts: SaaExamFact[] = [
  { label: "試験コード", value: "SAP-C03", detail: "Professional（旧SAP-C02は2026/11/16終了・11/17移行）" },
  { label: "試験時間", value: "180 分", detail: "3時間（英語受験時のみ ESL+30分申請可）" },
  { label: "問題数", value: "75 問", detail: "採点65問 + 非採点10問" },
  { label: "合格ライン", value: "750 点", detail: "100〜1000点スケール" },
  { label: "出題形式", value: "択一 / 複数", detail: "長文シナリオ設計・AI/自動運用統合" },
  { label: "受験料", value: "$300 USD", detail: "ピアソンVUE / オンライン可" },
];

export const sapDomains: SaaDomain[] = [
  {
    id: "sap-domain-1",
    number: 1,
    title: "クラウド向けに構築されたアーキテクチャの設計と実装",
    englishTitle: "Architecture Design and Implementation Built for the Cloud",
    weight: 25,
    accentColor: "indigo",
    summary:
      "出題比率 25%（SAP-C03 再編 D1）。ハイブリッドネットワーク（Direct Connect / Cloud WAN / VPC Lattice / IPv6）・データレイクハウス（Glue / Athena / Lake Formation）・生成 AI（Amazon Bedrock / AgentCore / RAG）・マルチテナント分散設計が問われます。",
    topics: [
      {
        id: "sap-d1-t1",
        title: "ハイブリッド接続・VPC Lattice サービスメッシュ・IPv6 ネットワーク設計",
        services: [
          "Direct Connect",
          "Transit Gateway",
          "Cloud WAN",
          "Route 53 Resolver",
          "PrivateLink",
          "VPC Lattice",
        ],
        keyPoints: [
          "AWS Direct Connect（専有 1/10/100 Gbps・Hosted）を複数ロケーションで冗長化し、Direct Connect Gateway の Transit VIF 経由で複数リージョンの Transit Gateway と接続する",
          "AWS Transit Gateway は数千の VPC とオンプレミス接続を集約し、検査 VPC の Appliance Mode 有効化で非対称ルーティングを防止。グローバル網の一元ポリシー管理には AWS Cloud WAN、CIDR 重複時の単方向公開には AWS PrivateLink、オンプレミス DNS 双方向解決には Route 53 Resolver＋AWS RAM を用いる",
          "SAP-C03 追加範囲: マイクロサービス間通信と可観測性の簡素化に Amazon VPC Lattice や Amazon ECS Service Connect を活用し、IPv6 採用・デュアルスタック移行戦略やハイブリッドコンピューティング（EKS/ECS Anywhere・Outposts・Local Zones）を設計する",
        ],
        examTip:
          "「CIDR 重複＋単方向公開」＝ PrivateLink。「複数アカウント跨ぎマイクロサービスのサービスメッシュ＋認可統合」＝ VPC Lattice。",
      },
      {
        id: "sap-d1-t2",
        title: "イベント駆動・サーバーレスワークフロー・データレイクハウス設計",
        services: [
          "EventBridge",
          "Step Functions",
          "Amazon MSK",
          "Kinesis Data Streams",
          "API Gateway",
          "Lake Formation",
          "AWS Glue",
          "Amazon Athena",
        ],
        keyPoints: [
          "AWS Step Functions（Standard 最大 1 年・人手承認/Saga 補償、Express 最大 5 分・高スループット）や持続実行ワークフロー、EventBridge のクロスアカウントルーティング/リプレイ、API Gateway WebSocket API によるリアルタイム Pub/Sub パターンを組み合わせる",
          "既存 Apache Kafka 互換には Amazon MSK、サーバーレス運用重視のストリーム収集には Kinesis Data Streams を選定する",
          "SAP-C03 追加範囲: Amazon S3 ＋ AWS Lake Formation ＋ AWS Glue Data Catalog ＋ Amazon Athena（Apache Iceberg 含む）によるデータレイクハウス、およびクロスアカウントデータ共有・テナント分離（サイロ/プール型・行レベルセキュリティ）を設計する",
        ],
        examTip:
          "「既存 Kafka 資産の無改修移行」＝ Amazon MSK。「S3 ベースでガバナンス・行/列単位アクセス制御付きレイクハウス」＝ Lake Formation＋Athena。",
      },
      {
        id: "sap-d1-t3",
        title: "生成 AI / RAG 統合・モダンアプリ基盤（Bedrock / コンテナ / サーバーレス）",
        services: [
          "Amazon Bedrock",
          "Bedrock Knowledge Bases",
          "SageMaker AI",
          "Amazon ECS",
          "Amazon EKS",
          "AWS Fargate",
          "AWS App Runner",
          "AWS Lambda",
          "RDS Proxy",
        ],
        keyPoints: [
          "SAP-C03 Task 1.2 新設: Amazon Bedrock をマルチアカウント構成でアプリ統合し、Amazon Bedrock Knowledge Bases（ベクトルストア連携）による RAG の取り込み/検索戦略、ツール連携を伴う AI エージェント（Bedrock AgentCore）、および独自 ML 推論向け Amazon SageMaker AI エンドポイントを設計する",
          "ワークロード特性に応じて AWS App Runner（Web 最速）、Amazon ECS on AWS Fargate（AWS 統合＋ノード管理レス）、Amazon EKS（Kubernetes 資産互換）、AWS Lambda（最大 15 分・10 GB、DB 接続スパイク時は Amazon RDS Proxy でプーリング）を使い分ける",
        ],
        examTip:
          "「RAG のマネージド取り込み・ベクトル検索構成」＝ Amazon Bedrock Knowledge Bases。「Lambda の RDB 接続枯渇」＝ RDS Proxy。",
      },
    ],
  },
  {
    id: "sap-domain-2",
    number: 2,
    title: "セキュリティ、コンプライアンス、ガバナンス",
    englishTitle: "Security, Compliance, and Governance",
    weight: 25,
    accentColor: "emerald",
    summary:
      "出題比率 25%（SAP-C03 再編 D2）。Organizations SCP / RCP・Control Tower・ハイブリッド/ワークロード認証（IAM Roles Anywhere / EKS Pod Identity）・ポスト量子暗号含む KMS 暗号化・責任ある AI コントロール（Bedrock Guardrails）が問われます。",
    topics: [
      {
        id: "sap-d2-t1",
        title: "マルチアカウント統制・SCP / RCP・ハイブリッド/ワークロード認証",
        services: [
          "Control Tower",
          "Organizations",
          "SCP",
          "RCP",
          "IAM Identity Center",
          "Cognito",
          "IAM Roles Anywhere",
          "EKS Pod Identity",
        ],
        keyPoints: [
          "AWS Control Tower と AWS Organizations の予防的ガードレールを組み合わせ、アカウント権限上限を規定する SCP に加え、組織内リソースへの外部/意図しないアクセス境界を制御する RCP（Resource Control Policy）でデータ境界を強制する",
          "人間の SSO は IAM Identity Center、エンドユーザーの SaaS/マルチテナント認可は Amazon Cognito（OAuth 2.0 / テナントコンテキスト）、オンプレミス/ハイブリッドワークロードの X.509 証明書ベース一時 IAM 認証は IAM Roles Anywhere、Kubernetes Pod 単位の最小権限は EKS Pod Identity を採用する",
        ],
        examTip:
          "「オンプレミスサーバーに長期 IAM アクセスキーを置かず一時認証情報を取得」＝ IAM Roles Anywhere。「全アカウントのリソースポリシー上限を統制」＝ RCP。",
      },
      {
        id: "sap-d2-t2",
        title: "組織監査・ポスト量子暗号化・境界防御・責任ある AI 統制",
        services: [
          "CloudTrail",
          "Security Hub",
          "GuardDuty",
          "Config Aggregator",
          "AWS Network Firewall",
          "AWS KMS",
          "Bedrock Guardrails",
          "AWS Artifact",
        ],
        keyPoints: [
          "AWS CloudTrail 組織証跡＋S3 Object Lock（別アカウント保存）、Security Hub・GuardDuty・AWS Config Aggregator の委任管理者統合、検査専用 VPC の AWS Network Firewall（TGW Appliance Mode 有効）で組織全体の可視性と防御を統一する",
          "SAP-C03 Task 2.2/2.4/2.5 追加範囲: AWS KMS のポスト量子暗号（ML-DSA / ML-KEM）を見据えた暗号戦略、データレジデンシー制御、AWS Artifact によるコンプライアンス証跡収集に加え、Amazon Bedrock Guardrails・AgentCore Identity・AWS Step Functions による AI 運用の人間承認（HITL）ワークフローを設計する",
        ],
        examTip:
          "「将来追加されるアカウントも自動集約＆WORM証跡保存」＝ CloudTrail Organization Trail ＋ S3 Object Lock。「AI の不適切出力抑止＋高リスク操作の人間承認」＝ Bedrock Guardrails ＋ Step Functions。",
      },
    ],
  },
  {
    id: "sap-domain-3",
    number: 3,
    title: "コストを最適化したアーキテクチャの設計",
    englishTitle: "Cost-Optimized Architecture Design",
    weight: 15,
    accentColor: "amber",
    summary:
      "出題比率 15%（SAP-C03 再編 D3）。Graviton・AI 推論コスト最適化（階層選択/バッチ/クロスリージョン推論ルーティング）・ネットワーク転送コスト・ストレージ/DB/オブザーバビリティコスト・タグ/Cost Categories 統制が問われます。",
    topics: [
      {
        id: "sap-d3-t1",
        title: "コンピュート・AI 推論・データベース・オブザーバビリティコスト最適化",
        services: [
          "Compute Optimizer",
          "Savings Plans",
          "Spot Instances",
          "Graviton",
          "S3 Intelligent-Tiering",
          "Aurora Serverless v2",
          "ElastiCache",
          "DAX",
        ],
        keyPoints: [
          "AWS Compute Optimizer（CloudWatch Agent のメモリ計測連携含む）によるライトサイジング、Compute Savings Plans と EC2 Spot Instances の混在、AWS Graviton（ARM64）移行で単価と電力を削減する",
          "アクセスパターンが読めない大量データには S3 Intelligent-Tiering、スパイク性 DB には Aurora Serverless v2（0.5 ACU 単位）、読み取りオフロードには ElastiCache / DAX / Read Replica を選定する",
          "SAP-C03 追加範囲: Amazon Bedrock / SageMaker AI のモデル階層選定・バッチ推論・キャッシュ・クロスリージョン推論ルーティングによる AI コスト最適化と、ログフィルタリング・メトリクス集約・保持最適化によるオブザーバビリティコスト削減を行う",
        ],
        examTip:
          "「AI 推論コストをモデル品質を保ちつつ削減」＝ 適切なモデル階層選択＋プロンプトキャッシュ＋バッチ推論活用。",
      },
      {
        id: "sap-d3-t2",
        title: "ネットワーク転送コスト・組織横断 FinOps・予算統制",
        services: [
          "Gateway VPC Endpoint",
          "CloudFront",
          "AWS Budgets",
          "Cost Explorer",
          "Cost Categories",
          "AWS RAM",
        ],
        keyPoints: [
          "Private Subnet から S3 / DynamoDB への通信を無料の Gateway 型 VPC エンドポイントへ切り替えて NAT Gateway のデータ処理課金を排除し、インターネット下り配信は S3 直接ではなく CloudFront 経由へ寄せる",
          "Transit Gateway と AWS PrivateLink のデータ処理・クロス AZ 転送コストやマルチリージョンデータ複製の転送コストを設計段階から最小化する",
          "AWS Organizations 一括請求の下で、ポリシーベースのタグ強制と AWS Cost Categories / Cost Explorer / AWS Budgets により部門別チャージバック・ショーバック・コスト異常検知を運用する",
        ],
        examTip:
          "「NAT Gateway 課金急増・通信先は S3/DynamoDB」＝ Gateway VPC Endpoint。「Transit Gateway の接続・転送単価を組織横断で最適化＋部門配賦」＝ AWS RAM 共有 ＋ Cost Categories。",
      },
    ],
  },
  {
    id: "sap-domain-4",
    number: 4,
    title: "回復力、移行、事業の継続性",
    englishTitle: "Resilience, Migration, and Business Continuity",
    weight: 15,
    accentColor: "cyan",
    summary:
      "出題比率 15%（SAP-C03 再編 D4）。RPO/RTO 設計・マルチクラスター/マルチリージョン DR（Aurora Global DB / Route 53 ARC）・Backup 耐ランサムウェア保護・AWS FIS 復旧検証・7R 大規模移行（MGN / DMS / AWS Transform）が問われます。",
    topics: [
      {
        id: "sap-d4-t1",
        title: "マルチリージョン DR・マルチクラスター可用性・バックアップ統制",
        services: [
          "Aurora Global Database",
          "DynamoDB Global Tables",
          "Route 53 ARC",
          "Global Accelerator",
          "Pilot Light",
          "Warm Standby",
          "AWS Backup",
          "AWS Resilience Hub",
        ],
        keyPoints: [
          "Aurora Global Database（1 秒未満のストレージ複製・Write Forwarding）と DynamoDB Global Tables（Active-Active）に加え、障害中リージョンのコントロールプレーン API に依存しない Route 53 ARC データプレーン切替や Global Accelerator（TCP/UDP 固定 Anycast IP）を組み合わせる",
          "SAP-C03 追加範囲: Amazon EKS / ECS のマルチクラスター DR 戦略、AWS Resilience Hub による RTO/RPO 評価、AWS Backup Organizations ポリシー＋Backup Vault Lock（WORM）によるランサムウェア/誤削除対策を実施する",
        ],
        examTip:
          "「コントロールプレーン障害下でも確実にリージョン切替」＝ Route 53 ARC。「ランサムウェア対策で管理者も消せない暗号化バックアップ」＝ AWS Backup Vault Lock (WORM)。",
      },
      {
        id: "sap-d4-t2",
        title: "7R 大規模移行・異種 DB / ストレージ移行・段階的カットオーバー",
        services: [
          "AWS MGN",
          "Migration Hub",
          "AWS DMS",
          "AWS SCT",
          "AWS DataSync",
          "Snow Family",
          "Storage Gateway",
          "Transfer Family",
          "FSx for NetApp ONTAP",
          "S3 Batch Operations",
          "Route 53 Weighted",
          "Refactor Spaces",
        ],
        keyPoints: [
          "AWS Migration Hub や AWS Transform（モダナイズ加速）を用いて 7R を計画し、VM の Rehost は AWS MGN、異種 DB（Oracle → Aurora）は AWS SCT ＋ AWS DMS (CDC)、広帯域オンライン同期は AWS DataSync、狭帯域大容量は Snow Family（Snowball Edge）で移行する",
          "オンプレミス共有維持・移行には Storage Gateway や FSx for NetApp ONTAP（SnapMirror）、パートナー転送は AWS Transfer Family、過去 S3 一括複製は S3 Batch Operations、DNS 段階切替は Route 53 Weighted、モノリス分割には Migration Hub Refactor Spaces を選定する",
        ],
        examTip:
          "「Oracle PL/SQL 含む最小停止移行」＝ AWS SCT ＋ AWS DMS (CDC)。「100 Mbps で 450 TB を数週間で移行」＝ Snowball Edge ＋ DataSync 差分。",
      },
    ],
  },
  {
    id: "sap-domain-5",
    number: 5,
    title: "運用上の優秀性とオートメーション",
    englishTitle: "Operational Excellence and Automation",
    weight: 20,
    accentColor: "indigo",
    summary:
      "出題比率 20%（SAP-C03 新設独立 D5）。マルチアカウント IaC・DevSecOps CI/CD（ECR スキャン・Inspector・ロール委任）・高度オブザーバビリティ（CloudWatch Synthetics / RUM / Container Insights / ADOT / AI 監視）・安全制約付き自動修復とカオス試験（AWS FIS）が問われます。",
    topics: [
      {
        id: "sap-d5-t1",
        title: "マルチアカウント IaC・Policy-as-Code・DevSecOps CI/CD",
        services: [
          "AWS CDK",
          "StackSets",
          "Service Catalog",
          "CodePipeline",
          "CodeBuild",
          "CodeDeploy",
          "Amazon Inspector",
        ],
        keyPoints: [
          "CloudFormation StackSets（Service-managed OU 自動展開）、AWS CDK（再利用可能な L3 Construct とユニットテスト）、AWS Service Catalog（Launch Constraint による非特権セルフサービス払い出し）、および Policy-as-Code（ドリフト検出・予防的検証）を組み合わせる",
          "SAP-C03 Task 5.2 新設: クロスアカウント CodePipeline（ロール委任・アーティファクト昇格）、Amazon Inspector / Amazon ECR イメージスキャニングと署名検証による脆弱性ゲート、および Amazon Bedrock Evaluation による AI 出力の継続検証を CI/CD パイプラインへ統合する",
        ],
        examTip:
          "「開発者に強力な IAM 権限を渡さず承認済みスタックを作成させる」＝ Service Catalog (Launch Constraint)。「パイプラインでコンテナ脆弱性を自動遮断」＝ ECR スキャン / Inspector。",
      },
      {
        id: "sap-d5-t2",
        title: "高度オブザーバビリティ・AI 監視・制御された自動修復と AWS FIS",
        services: [
          "CloudWatch",
          "AWS X-Ray",
          "ADOT",
          "AWS Config",
          "Systems Manager",
          "Session Manager",
          "SSM Automation",
          "AWS FIS",
        ],
        keyPoints: [
          "AWS Systems Manager Session Manager で踏み台・SSH 鍵を廃止して操作ログを監査し、AWS Config ＋ SSM Automation による自動修復ではサーキットブレーカー・レート制限・指数バックオフ等の安全制約を設けてカスケード障害を防ぐ",
          "SAP-C03 Task 5.3/5.4 新設: CloudWatch Synthetics（外形監視）・CloudWatch RUM・Container Insights（ECS/EKS）・AWS Distro for OpenTelemetry (ADOT) ＋ X-Ray、さらに AI モデル推論レイテンシ/ドリフト指標を統合監視し、AWS Fault Injection Service (FIS) で制御されたカオス復旧テストを実施する",
        ],
        examTip:
          "「自動修復が暴走して本番を巻き込むのを防ぐ安全設計」＝ サーキットブレーカー＋レート制限。「DR や障害耐性を本番同等で実証計測」＝ AWS Fault Injection Service (FIS)。",
      },
    ],
  },
];

export const sapComparisons: SaaComparisonTable[] = [
  {
    id: "sap-comp-network",
    category: "ネットワーク",
    title: "ハイブリッド接続・大規模マルチVPCネットワーク設計",
    subtitle: "Direct Connect / Transit Gateway / Cloud WAN / Route 53 Resolver / Network Firewall / PrivateLink",
    columns: ["サービス / 機能", "トポロジ / 動作層", "主な用途・SAP 試験での選定ポイント"],
    rows: [
      {
        feature: "AWS Direct Connect (+ Direct Connect Gateway)",
        values: [
          "オンプレミス ⇔ AWS 専用物理回線 (1/10/100 Gbps)",
          "Transit VIF ＋ DX Gateway 経由で複数リージョンの Transit Gateway と接続。暗号化はデフォルト非対応（MACsec または IPsec VPN 併用）。",
        ],
      },
      {
        feature: "AWS Transit Gateway",
        values: [
          "リージョン内のハブ＆スポーク (L3 ルーティング)",
          "数千 VPC・VPN・DX を集約。複数ルートテーブルで環境隔離。検査 VPC では Appliance Mode 有効化で非対称ルーティングを防止。",
        ],
      },
      {
        feature: "AWS Cloud WAN",
        values: [
          "グローバル・マルチリージョン一元管理コアネットワーク",
          "複数リージョンの VPC・オンプレミス・SD-WAN を単一ネットワークポリシー（セグメント定義）で自動接続・統合管理。",
        ],
      },
      {
        feature: "Route 53 Resolver (Endpoint / ルール)",
        values: [
          "ハイブリッド DNS 名前解決 (TCP/UDP 53)",
          "インバウンド（オンプレミス → AWS PHZ 解決）とアウトバウンド（AWS → オンプレミス DNS 転送ルール）。AWS RAM で複数アカウント共有可。",
        ],
      },
      {
        feature: "AWS Network Firewall",
        values: [
          "VPC 境界・検査 VPC 向けマネージド L3-L7 FW / IPS",
          "ステートフル検査、Suricata ルール、FQDN ドメインフィルタリングに対応。TGW Appliance Mode と組み合わせて東西・南北を一元検査。",
        ],
      },
      {
        feature: "AWS PrivateLink",
        values: [
          "単方向サービス公開 (Interface VPC Endpoint)",
          "サービス提供側と利用側で VPC CIDR が重複していても安全にプライベート接続可能。NLB / GWLB をエンドポイントサービスとして公開。",
        ],
      },
      {
        feature: "AWS Global Accelerator & Route 53 Weighted",
        values: [
          "Anycast 固定 IP (TCP/UDP) / DNS 加重分散",
          "Global Accelerator は DNS TTL に依存しない高速フェイルオーバーとバックボーン最適化。Route 53 Weighted はカナリア・段階的カットオーバー向け。",
        ],
      },
    ],
    decisionRule:
      "「複数リージョン×オンプレミスの単一ポリシー統合」＝ Cloud WAN、「検査VPCでの通信不安定解消」＝ TGW Appliance Mode、「CIDR重複の回避」＝ PrivateLink。",
  },
  {
    id: "sap-comp-org",
    category: "セキュリティ",
    title: "マルチアカウント統制・ランディングゾーン設計",
    subtitle: "Control Tower / Organizations / SCP / StackSets / AWS RAM / IAM Identity Center",
    columns: ["サービス / 機能", "スコープ・適用対象", "選定ポイント・制約事項"],
    rows: [
      {
        feature: "AWS Control Tower",
        values: [
          "Organizations 全体のランディングゾーン",
          "Account Factory による新規アカウント自動払い出し、Log Archive / Audit アカウント分離、予防的・検出的・プロアクティブガードレールを統合。",
        ],
      },
      {
        feature: "AWS Organizations & SCP",
        values: [
          "管理アカウント以外のメンバーアカウント全体",
          "ルートユーザーや Admin も含む最大権限の上限（Deny）を強制。権限を付与するものではない。管理アカウント自身には非適用。",
        ],
      },
      {
        feature: "IAM Identity Center",
        values: [
          "組織全体の人間のユーザー・グループ SSO",
          "外部 IdP（SAML 2.0 / SCIM）と連携し、Permission Sets でアカウント・OU ごとに短期一時クレデンシャルを発行。",
        ],
      },
      {
        feature: "CloudFormation StackSets",
        values: [
          "複数アカウント × 複数リージョン一括 IaC",
          "Service-managed 権限モードにより Organizations の OU 配下へ新規追加されたアカウントにも自動でベースラインスタックを展開。",
        ],
      },
      {
        feature: "AWS RAM (Resource Access Manager)",
        values: [
          "OU / 組織 / アカウント間のリソース共有",
          "Transit Gateway、VPC サブネット（VPC共有）、Route 53 Resolver ルール、License Manager 等を重複課金・重複管理なしで安全に共有。",
        ],
      },
      {
        feature: "AWS Config Aggregator",
        values: [
          "組織全体・複数リージョンの構成準拠状況集約",
          "委任管理者アカウントから全アカウントのリソース変更履歴・ルール準拠状態を一元照会・可視化。",
        ],
      },
    ],
    decisionRule:
      "「新規アカウントにも自動で初期設定を展開」＝ Control Tower / StackSets (Service-managed)、「管理者にも特定リージョン利用を禁止」＝ SCP、「サブネットやTGW共有」＝ AWS RAM。",
  },
  {
    id: "sap-comp-sec-ops",
    category: "セキュリティ",
    title: "組織横断の監査・脅威検知・セキュア運用自動化",
    subtitle: "CloudTrail Organization Trail / Security Hub / GuardDuty / AWS Config / Systems Manager",
    columns: ["サービス", "対象範囲", "組織統合・自動化のポイント"],
    rows: [
      {
        feature: "AWS CloudTrail (Organization Trail)",
        values: [
          "全アカウント・全リージョンの API 証跡",
          "管理アカウントまたは委任管理者で作成。Log Archive アカウントの S3 バケットへ Object Lock (WORM)＋整合性検証付きで改ざん防止保存。",
        ],
      },
      {
        feature: "AWS Security Hub",
        values: [
          "組織全体のセキュリティ態勢一元管理",
          "委任管理者で全アカウントを有効化し、GuardDuty / Inspector / Macie / Config の検出結果を ASFF 形式で集約。EventBridge 経由で自動対処。",
        ],
      },
      {
        feature: "Amazon GuardDuty",
        values: [
          "CloudTrail / VPC Flow Logs / DNS / EKS / S3 脅威検知",
          "委任管理者＋自動有効化設定で新規アカウントも即保護。組織全体で単一ポイントの ML 脅威分析。",
        ],
      },
      {
        feature: "AWS Systems Manager (Session Manager / Patch Manager)",
        values: [
          "EC2 / オンプレミスハイブリット管理 (Agent)",
          "Session Manager で SSH/RDP ポート・踏み台・鍵を廃止し IAM 制御＋操作ログを S3/CloudWatch Logs へ保存。",
        ],
      },
      {
        feature: "AWS Config + SSM Automation",
        values: [
          "設定ドリフト検知と自動修復 (Remediation)",
          "非準拠（例: SG で SSH 0.0.0.0/0 開放）を検知し、SSM Automation Runbook を自動実行して即時修復。",
        ],
      },
    ],
    decisionRule:
      "「踏み台廃止と SSH 操作ログ監査」＝ Session Manager、「違反設定の即時自動修復」＝ AWS Config ＋ SSM Automation。",
  },
  {
    id: "sap-comp-dr",
    category: "データベース",
    title: "マルチリージョン Active-Active & DR・DB ボトルネック最適化",
    subtitle: "Aurora Global Database / DynamoDB Global Tables / Route 53 ARC / Pilot Light / Warm Standby / RDS Proxy",
    columns: ["サービス / 戦略", "RPO / RTO 目安", "アーキテクチャ選定と制約"],
    rows: [
      {
        feature: "Aurora Global Database",
        values: [
          "RPO 1秒未満 / RTO 約1分目安 (管理昇格)",
          "ストレージレベルの専用レプリケーションで最大 5 セカンダリリージョンへ複製。Write Forwarding や Fast Clone にも対応。",
        ],
      },
      {
        feature: "DynamoDB Global Tables",
        values: [
          "RPO 1秒未満 / RTO ゼロに近い (Active-Active)",
          "複数リージョンで同時書き込み・読み取り可能なフルマネージドマルチリージョン NoSQL（Last Writer Wins 競合解決）。",
        ],
      },
      {
        feature: "Route 53 Application Recovery Controller (ARC)",
        values: [
          "データプレーン API による確実な切替",
          "コントロールプレーン障害時でもルーティングコントロールでトラフィックを安全に切り替え、Readiness Check で容量不足を事前検知。",
        ],
      },
      {
        feature: "Pilot Light vs Warm Standby",
        values: [
          "Pilot Light: 数十分 / Warm Standby: 数分",
          "Pilot Light はコア DB のみ稼働しアプリ層は障害時に起動。Warm Standby は縮小規模の本番フルスタックを常時稼働させてスケールアウト。",
        ],
      },
      {
        feature: "Amazon RDS Proxy & Read Replica",
        values: [
          "フェイルオーバー最大66%短縮 / 読み取り分散",
          "RDS Proxy は Lambda 等からの接続急増をプーリングで吸収。Read Replica は非同期レプリカへ参照系クエリをオフロード。",
        ],
      },
      {
        feature: "Aurora Serverless v2 / ElastiCache / DAX",
        values: [
          "瞬時スケール / サブミリ秒〜マイクロ秒キャッシュ",
          "Aurora Serverless v2 は 0.5 ACU 単位で細粒度伸縮。DynamoDB 読み取りマイクロ秒化は DAX、汎用キャッシュ/ランキングは ElastiCache。",
        ],
      },
    ],
    decisionRule:
      "「グローバル Active-Active 書き込み」＝ DynamoDB Global Tables、「コントロールプレーン非依存フェイルオーバー」＝ Route 53 ARC、「Lambda 接続枯渇対策」＝ RDS Proxy。",
  },
  {
    id: "sap-comp-migration",
    category: "コンピュート",
    title: "大規模ワークロード移行（サーバー / DB / 大容量データ）",
    subtitle: "AWS MGN / Migration Hub / AWS DMS / AWS SCT / AWS DataSync / Snow Family / Transfer Family",
    columns: ["サービス", "移行対象・方向", "仕組み・SAP 試験での使い分け"],
    rows: [
      {
        feature: "AWS Application Migration Service (MGN)",
        values: [
          "物理・仮想・他クラウド VM → EC2 (Rehost)",
          "エージェントによる継続的ブロックレベルレプリケーションで、テスト起動確認後に最小ダウンタイムで EC2 へカットオーバー。",
        ],
      },
      {
        feature: "AWS Migration Hub",
        values: [
          "組織全体の移行検出・進捗管理ハブ",
          "Application Discovery Service 等と連携してサーバー依存関係を可視化し、7R 計画・サイジング・MGN/DMS の進捗を一元追跡。",
        ],
      },
      {
        feature: "AWS SCT + AWS DMS",
        values: [
          "異種 / 同種 DB → RDS / Aurora / Redshift",
          "異種移行では SCT でスキーマ・ストアドプロシージャを変換し、DMS の Full Load + CDC（継続レプリケーション）で最小停止移行。",
        ],
      },
      {
        feature: "AWS DataSync",
        values: [
          "オンプレミス NFS/SMB/オブジェクト ⇔ S3/EFS/FSx",
          "専用プロトコルで TLS 暗号化・自動検証・帯域幅スロットリング付きの高速オンラインデータ同期（最大10 Gbps 級）。",
        ],
      },
      {
        feature: "AWS Snow Family (Snowball Edge / Snowmobile)",
        values: [
          "オフライン大容量データ移行 (数十 TB 〜 PB 級)",
          "回線が細い（例: 100 Mbps 等）または納期内にオンライン転送不能な環境で物理デバイス輸送により安全に S3 へ一括投入。",
        ],
      },
      {
        feature: "AWS Transfer Family",
        values: [
          "SFTP / FTPS / FTP / AS2 連携 → S3 / EFS",
          "既存の取引先ファイル転送ワークフローを変更せずにサーバーレスなマネージドエンドポイントへ移行。",
        ],
      },
    ],
    decisionRule:
      "「異種 DB のコード変換＋無停止切替」＝ SCT ＋ DMS (CDC)、「狭帯域で数百 TB 移行」＝ Snowball Edge、「既存サーバー無改修移行」＝ MGN。",
  },
  {
    id: "sap-comp-storage",
    category: "ストレージ",
    title: "ハイブリッドストレージ＆大規模 S3 運用管理",
    subtitle: "Storage Gateway / FSx for NetApp ONTAP / S3 Intelligent-Tiering / S3 Batch Operations / AWS Backup",
    columns: ["サービス / 機能", "対応プロトコル / 特徴", "主な用途・導入判断基準"],
    rows: [
      {
        feature: "AWS Storage Gateway (File / Volume / Tape)",
        values: [
          "NFS / SMB / iSCSI / VTL (ローカルキャッシュ)",
          "オンプレミス拠点に低遅延キャッシュを残しつつ実データを S3 / EBS スナップショットへ透過的に保存・アーカイブ。",
        ],
      },
      {
        feature: "Amazon FSx for NetApp ONTAP",
        values: [
          "NFS + SMB + iSCSI 同時アクセス / SnapMirror",
          "オンプレミスの NetApp ONTAP 環境をスナップショット・重複排除・圧縮・SnapMirror 複製そのままに AWS 上へ移行。",
        ],
      },
      {
        feature: "S3 Intelligent-Tiering",
        values: [
          "アクセス頻度に応じた自動階層移動（取得料なし）",
          "アクセスパターンが不明・変動する大量データに対し、監視料のみで Frequent / IA / Archive Instant / Deep Archive へ自動最適化。",
        ],
      },
      {
        feature: "S3 Batch Operations",
        values: [
          "数百万〜数十億 S3 オブジェクトへの一括処理",
          "既存オブジェクトに対するクロスリージョン複製（Batch Replication）、KMS 再暗号化、タグ変更、Lambda 起動を非同期実行。",
        ],
      },
      {
        feature: "AWS Backup (Vault Lock / クロスアカウント)",
        values: [
          "EBS / RDS / EFS / FSx / DynamoDB 統合保護",
          "Organizations 連携で組織全体のバックアップポリシーを一元適用。Backup Vault Lock (WORM) で管理者による削除・改ざんも防止。",
        ],
      },
    ],
    decisionRule:
      "「NetApp SnapMirror やマルチプロトコル共有を維持」＝ FSx for NetApp ONTAP、「既存 S3 大量データの過去分複製」＝ S3 Batch Operations。",
  },
  {
    id: "sap-comp-cicd",
    category: "コンピュート",
    title: "CI/CD デプロイ戦略とエンタープライズ IaC 自動化",
    subtitle: "CodePipeline / CodeBuild / CodeDeploy Blue-Green & Canary / StackSets / AWS CDK / Service Catalog / SSM Automation",
    columns: ["サービス / 戦略", "対象 / 機能", "運用・ロールバック・ガバナンス特性"],
    rows: [
      {
        feature: "AWS CodePipeline & CodeBuild",
        values: [
          "マルチステージビルド・テスト・承認・展開",
          "クロスアカウント展開時は KMS CMK 暗号化アーティファクトバケット＋各環境アカウントの IAM ロール引き受け（AssumeRole）を構成。",
        ],
      },
      {
        feature: "AWS CodeDeploy (Blue-Green / Canary)",
        values: [
          "EC2 / ECS / Lambda への安全リリース",
          "Blue-Green は新環境検証後に ALB/ターゲットグループを切替（即ロールバック可）。Canary（例: 10%を5分検証）と Linear で段階移行＋CloudWatch アラーム自動停止。",
        ],
      },
      {
        feature: "CloudFormation StackSets",
        values: [
          "アカウント × リージョン横断の宣言的展開",
          "OU 単位の自動デプロイ・ドリフト検出・同時実行数と障害許容数の制御により、全社基盤を安全にロールアウト。",
        ],
      },
      {
        feature: "AWS CDK (Cloud Development Kit)",
        values: [
          "TypeScript / Python 等による IaC + L3 Construct",
          "複雑な構成をプログラミング言語とユニットテストで検証し、組織標準 Construct ライブラリとして社内配布。",
        ],
      },
      {
        feature: "AWS Service Catalog",
        values: [
          "承認済み製品のセルフサービス払い出し",
          "Launch Constraint により利用者に VPC/IAM 作成権限を与えずに安全なテンプレート展開を許可。",
        ],
      },
      {
        feature: "SSM Automation",
        values: [
          "パッチ・AMI ビルド・自動修復 Runbook",
          "EventBridge / Config と連携し、ゴールデン AMI 作成、承認フロー、インシデント自動復旧を実行。",
        ],
      },
    ],
    decisionRule:
      "「本番エラー検知で自動ロールバックする段階配信」＝ CodeDeploy Canary ＋ CloudWatch アラーム、「非特権開発者への安全な環境払い出し」＝ Service Catalog。",
  },
  {
    id: "sap-comp-modern",
    category: "コンピュート",
    title: "アプリケーション・モダナイゼーション実行基盤の選定",
    subtitle: "App Runner / Amazon ECS / AWS Fargate / Amazon EKS / AWS Lambda / Refactor Spaces",
    columns: ["サービス", "抽象度・管理責任", "適したモダナイゼーション要件"],
    rows: [
      {
        feature: "AWS App Runner",
        values: [
          "フルマネージド Web コンテナ/ソース実行",
          "ロードバランサ・TLS・オートスケールを自動構成。Web API やフロントをインフラ管理ゼロで最速コンテナ化したい場合。",
        ],
      },
      {
        feature: "Amazon ECS (+ AWS Fargate)",
        values: [
          "AWS ネイティブコンテナオーケストレーション",
          "Fargate 利用で EC2 ノード管理不要。ALB/NLB・Service Connect・Cloud Map・IAM タスクロールとの深い統合と運用最小化。",
        ],
      },
      {
        feature: "Amazon EKS",
        values: [
          "マネージド Kubernetes コントロールプレーン",
          "既存の Kubernetes マニフェスト/Helm チャート資産の活用、Karpenter による高度なノード最適化、マルチクラウド可搬性が必要な場合。",
        ],
      },
      {
        feature: "AWS Lambda",
        values: [
          "サーバーレス関数 (最大15分 / 10 GB)",
          "イベント駆動のマイクロサービス・非同期ワーカー・API バックエンド。コンテナイメージデプロイ（最大10 GB）にも対応。",
        ],
      },
      {
        feature: "AWS Migration Hub Refactor Spaces",
        values: [
          "Strangler Fig 段階的分割オーケストレーター",
          "モノリスと新規マイクロサービスが複数アカウントに跨がる状態で、API Gateway / NLB / Transit Gateway のルーティングを自動統合。",
        ],
      },
    ],
    decisionRule:
      "「Web コンテナを最小工数で公開」＝ App Runner、「AWS 統合＆ノード管理レス」＝ ECS on Fargate、「既存 K8s 移行」＝ EKS、「段階的モノリス分割」＝ Refactor Spaces。",
  },
  {
    id: "sap-comp-event",
    category: "非同期・連携",
    title: "イベント駆動・ワークフロー・大規模ストリーミング",
    subtitle: "EventBridge / Step Functions / Amazon MSK / Kinesis Data Streams / API Gateway / CloudWatch & X-Ray",
    columns: ["サービス", "実行モデル / 特徴", "エンタープライズ選定基準"],
    rows: [
      {
        feature: "Amazon EventBridge",
        values: [
          "サーバーレスイベントバス (コンテンツフィルタ)",
          "複数アカウント・SaaS 連携・イベントアーカイブとリプレイ・API Destinations による外部 HTTP 連携を伴う疎結合ルーティング。",
        ],
      },
      {
        feature: "AWS Step Functions (Standard vs Express)",
        values: [
          "Standard (最大1年/厳密1回) vs Express (最大5分/高スループット)",
          "長時間の人手承認コールバックや Saga 補償トランザクションには Standard、大量イベントの短時間並列処理には Express。",
        ],
      },
      {
        feature: "Amazon MSK (Managed Streaming for Apache Kafka)",
        values: [
          "フルマネージド Apache Kafka (サーバーレス/プロビジョンド)",
          "既存の Kafka クライアント・Connect・Streams 資産をコード変更なしでクラウド移行し、長期トピック保持や柔軟なパーティション制御を維持。",
        ],
      },
      {
        feature: "Amazon Kinesis Data Streams",
        values: [
          "リアルタイムストリーム (On-Demand / Provisioned)",
          "Lambda / Firehose / Managed Service for Apache Flink とのネイティブ統合で運用ゼロのリアルタイム分析パイプラインを構築。",
        ],
      },
      {
        feature: "Amazon API Gateway (+ CloudFront)",
        values: [
          "REST / HTTP / WebSocket API 管理",
          "使用量プラン（API キー単位のクォータ・スロットリング）、Cognito/Lambda Authorizer 認証、プライベート API（Interface Endpoint）を提供。",
        ],
      },
      {
        feature: "Amazon CloudWatch & AWS X-Ray",
        values: [
          "メトリクス/ログ統合 & 分散トレーシング",
          "非同期パイプライン全体のレイテンシ可視化（Trace ID 伝播）や Logs Insights による横断調査でボトルネックを特定。",
        ],
      },
    ],
    decisionRule:
      "「既存 Kafka 資産のそのまま移行」＝ Amazon MSK、「長時間ワークフロー＆Saga 補償」＝ Step Functions Standard、「イベントリプレイ＆クロスアカウント配信」＝ EventBridge。",
  },
  {
    id: "sap-comp-cost",
    category: "コスト最適化",
    title: "大規模環境の FinOps・転送コスト・コンピュート最適化",
    subtitle: "Compute Optimizer / Savings Plans / Spot Instances / AWS Graviton / Gateway VPC Endpoint / AWS Budgets / Cost Explorer",
    columns: ["サービス / 施策", "対象領域", "コスト削減メカニズムと注意点"],
    rows: [
      {
        feature: "AWS Compute Optimizer & AWS Graviton",
        values: [
          "EC2 / EBS / Lambda / ECS Fargate の適正化",
          "CloudWatch Agent のメモリメトリクスを含めて過剰スペックを検出。ARM64 互換アプリは Graviton へ移行し価格性能比を大幅向上。",
        ],
      },
      {
        feature: "Savings Plans vs Spot Instances",
        values: [
          "安定ベースライン割引 vs 中断許容ワークロード",
          "Compute Savings Plans は EC2/Fargate/Lambda に柔軟適用（最大66%減）。Spot は最大90%減（2分前通知に耐えるステートレス・分散処理向け）。",
        ],
      },
      {
        feature: "Gateway VPC Endpoint & CloudFront",
        values: [
          "NAT Gateway 課金・インターネット転送料の削減",
          "S3/DynamoDB 通信は無料の Gateway VPC Endpoint へ迂回。外部配信は S3 直接より単価の安い CloudFront キャッシュ経由へ統合。",
        ],
      },
      {
        feature: "AWS Budgets & Cost Explorer & Cost Categories",
        values: [
          "組織横断の予算統制・チャージバック・異常検知",
          "コスト配分タグと AWS Cost Categories で部門・環境別コストを分類（ショーバック/チャージバック）し、Budgets でしきい値通知や IAM 自動制御を実行。Amazon Bedrock のモデル階層・バッチ推論・ログ保持最適化も重要。",
        ],
      },
    ],
    decisionRule:
      "「NAT GW の S3 通信課金ゼロ化」＝ Gateway VPC Endpoint、「EC2/Fargate 混在環境の長期割引」＝ Compute Savings Plans、「過剰プロビジョニング自動検出」＝ Compute Optimizer、「AI推論/ログ最適化」＝ モデル階層選定＋保持フィルタリング。",
  },
  {
    id: "sap-comp-ai-data-sec",
    category: "セキュリティ",
    title: "SAP-C03 生成 AI / RAG・ゼロトラスト認証・データ境界・PQC",
    subtitle: "Bedrock / Knowledge Bases / Guardrails / RCP / IAM Roles Anywhere / EKS Pod Identity / KMS ポスト量子暗号 / AWS Artifact",
    columns: ["サービス / 機能", "対象レイヤ", "SAP-C03 設計判断のポイント"],
    rows: [
      {
        feature: "Amazon Bedrock & Knowledge Bases (RAG) / AgentCore",
        values: [
          "生成 AI アプリ・RAG・AI エージェント",
          "ベクトルストア連携 RAG による最新知識取り込みと Bedrock AgentCore によるツール実行統合。Amazon SageMaker AI エンドポイントは独自モデル学習・推論向け。",
        ],
      },
      {
        feature: "Bedrock Guardrails & Step Functions HITL",
        values: [
          "AI 入出力フィルタ・人間による監督",
          "コンテンツフィルタ/拒否トピック/PII 保護を Bedrock Guardrails で強制し、AgentCore Identity によるアクセス制御と Step Functions 承認フロー（HITL）を組み合わせる。",
        ],
      },
      {
        feature: "Organizations SCP / RCP & AWS KMS (ML-DSA / ML-KEM)",
        values: [
          "組織データ境界 & ポスト量子暗号 (PQC)",
          "SCP（IAM 主体の権限制限）と RCP（組織内リソース側のアクセス上限）で二重ガード。AWS KMS の ML-DSA / ML-KEM ポスト量子暗号戦略とデータレジデンシー制御に対応。",
        ],
      },
      {
        feature: "IAM Roles Anywhere / EKS Pod Identity / Cognito",
        values: [
          "ハイブリッド / K8s / アプリ認証認可",
          "オンプレミスの X.509 証明書から一時 IAM 認証を得るなら IAM Roles Anywhere、EKS Pod 権限管理は EKS Pod Identity、マルチテナントアプリ認証は Amazon Cognito。",
        ],
      },
      {
        feature: "Lake Formation / AWS Artifact / AWS Security Lake",
        values: [
          "データガバナンス・証跡収集・分析セキュリティ",
          "AWS Glue / Amazon Athena（Iceberg）構成の行・列レベル認可には Lake Formation、コンプライアンス証跡取得は AWS Artifact。",
        ],
      },
    ],
    decisionRule:
      "「オンプレから静的キーなしで AWS IAM 一時認証」＝ IAM Roles Anywhere、「AI 有害入出力・高リスク操作制御」＝ Bedrock Guardrails ＋ Step Functions HITL、「アカウントだけでなく組織内リソースへの外部流入制御」＝ RCP。",
  },
  {
    id: "sap-comp-ops-network",
    category: "コンピュート",
    title: "SAP-C03 サービスメッシュ・DevSecOps・高度オブザーバビリティ・カオス試験",
    subtitle: "VPC Lattice / AWS FIS / Resilience Hub / Inspector / ADOT / Synthetics / RUM",
    columns: ["サービス / 機能", "カテゴリ", "SAP-C03 運用自動化・信頼性での選定基準"],
    rows: [
      {
        feature: "Amazon VPC Lattice & ECS Service Connect",
        values: [
          "マイクロサービス間通信メッシュ",
          "EC2/ECS/EKS/Lambda を横断したサービスディスカバリ・認証ポリシー・カナリア重み付けルーティングをネットワーク構成負荷なく統合。",
        ],
      },
      {
        feature: "AWS Fault Injection Service (FIS) & AWS Resilience Hub",
        values: [
          "カオスエンジニアリング / DR 検証",
          "AZ 障害やスロットリングを安全に注入してフェイルオーバーと RTO/RPO を実測検証。Resilience Hub で回復力スコアを継続評価。",
        ],
      },
      {
        feature: "Amazon Inspector & ECR イメージスキャン",
        values: [
          "DevSecOps パイプライン脆弱性検査",
          "CI/CD でコンテナ脆弱性スキャン（Amazon ECR / Inspector）と署名検証を強制し、重大 CVE 検出時はデプロイを遮断。",
        ],
      },
      {
        feature: "CloudWatch Synthetics / RUM / ADOT / EC2・DB 運用自動化",
        values: [
          "外形監視・OpenTelemetry・安全自動修復",
          "ADOT で OpenTelemetry トレース/メトリクス統合、Synthetics で死活外形監視、RUM で実ユーザー遅延計測。SSM Automation 自動修復にはサーキットブレーカー等を付与。",
        ],
      },
    ],
    decisionRule:
      "「複数 VPC/アカウント間マイクロサービス通信の統一認可と観測」＝ VPC Lattice、「制御された障害注入で RTO 実測」＝ AWS FIS、「CI/CD で脆弱コンテナ遮断」＝ Inspector ＋ ECR スキャン。",
  },
];

export const sapQuickLookup: SaaQuickLookupItem[] = [
  {
    keyword: "CIDR 重複がある別アカウント VPC へ社内 API を安全に公開",
    category: "ネットワーク",
    recommended: "AWS PrivateLink (NLB + Endpoint Service)",
    reason: "PrivateLink は単方向サービス公開のため CIDR 重複があっても通信可能で、NAT や VPC Peering が不要。",
  },
  {
    keyword: "Transit Gateway 経由の Firewall VPC で通信が断続的に失敗する",
    category: "ネットワーク",
    recommended: "Transit Gateway Appliance Mode 有効化",
    reason: "ステートフルファイアウォールの往復通信を同一 AZ のアプライアンスへ固定し、非対称ルーティングドロップを防ぐ。",
  },
  {
    keyword: "オンプレミス DNS と VPC Route 53 Private Hosted Zone の双方向解決",
    category: "ネットワーク",
    recommended: "Route 53 Resolver (インバウンド/アウトバウンド) + AWS RAM",
    reason: "共有サービス VPC にエンドポイントを集約し、転送ルールを RAM で組織内全アカウントへ共有できる。",
  },
  {
    keyword: "複数リージョン・拠点のネットワークを単一ポリシーでグローバル統合",
    category: "ネットワーク",
    recommended: "AWS Cloud WAN (+ Direct Connect)",
    reason: "グローバルコアネットワークとセグメントポリシーにより、リージョン間ルーティングや検査挿入を宣言的に自動化できる。",
  },
  {
    keyword: "全メンバーアカウントの管理者に対しても特定リージョン利用や監査無効化を禁止",
    category: "セキュリティ",
    recommended: "AWS Organizations SCP + Control Tower",
    reason: "SCP はメンバーアカウント内の AdministratorAccess やルートユーザーにも適用される予防的ガードレール。",
  },
  {
    keyword: "新規追加アカウントも含め全アカウントへベースライン VPC/IAM/Config を自動展開",
    category: "ガバナンス",
    recommended: "CloudFormation StackSets (Service-managed) / Control Tower",
    reason: "OU 単位でターゲット指定すると、以後 OU に追加された新規アカウントにも自動的にスタックがデプロイされる。",
  },
  {
    keyword: "踏み台サーバーと SSH 鍵を廃止し操作ログも監査保存したい",
    category: "運用・セキュリティ",
    recommended: "AWS Systems Manager Session Manager",
    reason: "インバウンド 22/3389 番ポート不要で IAM 制御接続し、全コマンド履歴を S3 / CloudWatch Logs へ記録可能。",
  },
  {
    keyword: "リージョン障害時にコントロールプレーン API 障害下でも確実にフェイルオーバー",
    category: "DR・高可用性",
    recommended: "Route 53 Application Recovery Controller (ARC)",
    reason: "コントロールプレーンに依存しない高信頼データプレーン API でルーティングを切り替え、Safety Rules で誤操作を防止。",
  },
  {
    keyword: "RPO 数秒・複数リージョンからローカル読み書きする Active-Active DB",
    category: "データベース",
    recommended: "Amazon DynamoDB Global Tables",
    reason: "フルマネージドのマルチリージョン・マルチアクティブ構成で通常 1 秒未満の双方向レプリケーションを提供。",
  },
  {
    keyword: "Lambda の同時実行スパイクで RDS の max_connections が枯渇",
    category: "データベース",
    recommended: "Amazon RDS Proxy",
    reason: "DB コネクションをプーリングして共有し、接続数の爆発抑制とフェイルオーバー時間短縮を同時に達成。",
  },
  {
    keyword: "Oracle / SQL Server のストアドプロシージャ含め Aurora へ最小停止移行",
    category: "移行",
    recommended: "AWS SCT + AWS DMS (Full Load + CDC)",
    reason: "SCT で異種スキーマと PL/SQL を変換し、DMS の継続的変更キャプチャ (CDC) でカットオーバー停止時間を極小化。",
  },
  {
    keyword: "狭帯域回線（100 Mbps 等）で数百 TB のデータを数週間以内に S3 へ移行",
    category: "移行",
    recommended: "AWS Snow Family (Snowball Edge) + DataSync (差分)",
    reason: "大容量初期データは物理輸送でオフライン投入し、直前の小さな差分のみネットワーク同期することで期限内に完了。",
  },
  {
    keyword: "オンプレミスの NetApp ONTAP 環境を SnapMirror や NFS/SMB 互換のまま移行",
    category: "ストレージ",
    recommended: "Amazon FSx for NetApp ONTAP",
    reason: "ONTAP の重複排除・スナップショット・SnapMirror・マルチプロトコル機能を無改修でそのままクラウド移行できる。",
  },
  {
    keyword: "モノリスから別アカウントの新マイクロサービスへ段階的 Strangler Fig 移行",
    category: "モダナイゼーション",
    recommended: "AWS Migration Hub Refactor Spaces",
    reason: "API Gateway / NLB / Transit Gateway を自動オーケストレーションし、パス単位で安全にトラフィックを新サービスへ切替。",
  },
  {
    keyword: "既存 Apache Kafka アプリをコード変更なしでマネージド移行したい",
    category: "非同期・連携",
    recommended: "Amazon MSK",
    reason: "ネイティブ Apache Kafka 互換のため既存コンシューマ/プロデューサを変更せずクラスター運用をオフロード可能。",
  },
  {
    keyword: "NAT Gateway 経由の S3 大量通信コストを削減し EC2/Fargate 全体も割引したい",
    category: "コスト最適化",
    recommended: "Gateway VPC Endpoint + Compute Savings Plans",
    reason: "S3/DynamoDB 通信を無料の Gateway 型へ逃がしつつ、EC2・Fargate・Lambda を横断適用できる Compute SP を組み合わせる。",
  },
  {
    keyword: "非特権の開発者に承認済みアーキテクチャだけセルフサービス作成させたい",
    category: "ガバナンス",
    recommended: "AWS Service Catalog (Launch Constraint)",
    reason: "開発者には Service Catalog の起動権限のみ付与し、実際のリソース作成権限は Launch Constraint ロールに委譲できる。",
  },
  {
    keyword: "数日間の人手承認と失敗時の補償ロールバック (Saga) を含むワークフロー",
    category: "非同期・連携",
    recommended: "AWS Step Functions (Standard ワークフロー)",
    reason: "最大 1 年間の状態保持・タスクコールバック待機・Catch による補償処理実行を宣言的に実装できる。",
  },
  {
    keyword: "複数 VPC / アカウント間のマイクロサービス通信と認可を一元メッシュ化",
    category: "ネットワーク",
    recommended: "Amazon VPC Lattice (+ ECS Service Connect)",
    reason: "SAP-C03 追加範囲。サービスディスカバリ・IAM 認証/認可・重み付きカナリア制御をネットワーク負担なく統一できます。",
  },
  {
    keyword: "社内ドキュメントを使った RAG 構成と AI 入出力・ツール実行の安全制御",
    category: "生成 AI / セキュリティ",
    recommended: "Bedrock Knowledge Bases + Guardrails (+ Step Functions HITL)",
    reason: "SAP-C03 新設要件。Knowledge Bases で RAG を構築し、Bedrock Guardrails と Step Functions 承認で安全性を担保します。",
  },
  {
    keyword: "本番相当環境への安全制約付き障害注入（カオス試験）と RTO/RPO 実測",
    category: "運用自動化・回復力",
    recommended: "AWS Fault Injection Service (FIS) + AWS Resilience Hub",
    reason: "SAP-C03 追加範囲。停止条件付きで制御された障害シナリオを実行し、フェイルオーバー時間と回復力スコアを計測します。",
  },
];

export const sapPracticeQuestions: SaaQuestion[] = [
  // Domain 1: クラウド向けに構築されたアーキテクチャの設計と実装
  {
    id: "sap-q1",
    domainId: "sap-domain-1",
    domainLabel: "Domain 1: クラウド向け設計と実装",
    difficulty: "標準",
    selectCount: 1,
    question:
      "ある企業では AWS Transit Gateway をハブとして数十個のワークロード VPC を接続し、すべての VPC 間（東西）およびインターネット向け（南北）トラフィックを複数 AZ にまたがる検査専用 VPC 内の AWS Network Firewall でステートフル検査しています。構築後、ワークロード間で断続的な TCP セッション切断とタイムアウトが発生しています。原因を解消する最も適切な対処法はどれですか？",
    options: [
      "AWS Network Firewall をステートレスモードのみに変更し、接続状態の追跡を無効化する",
      "検査専用 VPC の Transit Gateway アタッチメントで Appliance Mode（アプライアンスモード）を有効化する",
      "Transit Gateway の代わりにすべての VPC 間でフルメッシュの VPC ピアリングを構築する",
      "Network Firewall の代わりに Network ACL を各 VPC サブネットに適用してディープパケットインスペクションを行う",
    ],
    correctIndices: [1],
    explanation:
      "Transit Gateway はデフォルトでは送信元と同じ AZ のアタッチメントへトラフィックを転送しようとするため、複数 AZ に跨ぐ通信で行きと帰りで異なる AZ の Network Firewall インスタンスを通過し（非対称ルーティング）、ステートフル検査によって戻りパケットがドロップされます。検査専用 VPC の TGW アタッチメントで Appliance Mode を有効化することで、同一フローの往復が同じ AZ に維持されます。",
    keywords: ["Transit Gateway", "Network Firewall", "Appliance Mode", "非対称ルーティング"],
  },
  {
    id: "sap-q2",
    domainId: "sap-domain-1",
    domainLabel: "Domain 1: クラウド向け設計と実装",
    difficulty: "応用",
    selectCount: 1,
    question:
      "親会社が企業買収を実施した結果、親会社の共有サービス VPC（10.0.0.0/16）と子会社の本番 VPC（10.0.0.0/16）で CIDR ブロックが完全に重複しています。IP アドレスの再設計を行わずに、親会社アカウント内の Application Load Balancer 配下で稼働する社内課金 API を、子会社アカウントからインターネットを経由せずプライベートに呼び出せるようにしたい場合、最適な構成はどれですか？",
    options: [
      "親会社と子会社の VPC 間で VPC ピアリングを作成し、ルートテーブルで 10.0.0.0/16 を相互にルーティングする",
      "親会社側で ALB をターゲットとする Network Load Balancer（NLB）を作成し、AWS PrivateLink（VPC エンドポイントサービス）として公開し、子会社 VPC に Interface 型 VPC エンドポイントを作成する",
      "両方の VPC を AWS Transit Gateway に接続し、同一ルートテーブルに関連付ける",
      "親会社の ALB をインターネット向け（Internet-facing）に変更し、AWS WAF で子会社の NAT Gateway IP を許可する",
    ],
    correctIndices: [1],
    explanation:
      "CIDR が重複する VPC 同士は VPC ピアリングや通常の Transit Gateway ルーティングで直接接続できません。AWS PrivateLink（NLB の背後に ALB をターゲット登録してエンドポイントサービス化）を用いることで、CIDR 重複の影響を受けずに単方向のプライベート接続を安全に提供できます。",
    keywords: ["AWS PrivateLink", "CIDR重複", "NLB + ALB", "マルチアカウント"],
  },
  {
    id: "sap-q3",
    domainId: "sap-domain-1",
    domainLabel: "Domain 1: クラウド向け設計と実装",
    difficulty: "標準",
    selectCount: 1,
    question:
      "AWS Organizations で 60 個の AWS アカウントを運用しており、AWS Direct Connect と AWS Transit Gateway を介してオンプレミスデータセンターと接続しています。すべてのアカウントの VPC からオンプレミス社内ドメイン（corp.internal）を解決でき、かつオンプレミスからも AWS 内の Route 53 Private Hosted Zone（aws.internal）を解決できるようにしたいと考えています。コストと運用負荷を最小限に抑える構成はどれですか？",
    options: [
      "60 アカウントすべての全 VPC に Route 53 Resolver のインバウンドおよびアウトバウンドエンドポイントを個別にデプロイする",
      "共有サービス VPC にのみ Route 53 Resolver のインバウンド/アウトバウンドエンドポイントと転送ルールを作成し、AWS RAM で転送ルールを全アカウントへ共有するとともに各 VPC を Private Hosted Zone に関連付ける",
      "各 VPC に EC2 ベースの BIND DNS フォワーダーを 2 台ずつ構築して Auto Scaling させる",
      "Route 53 のパブリックホストゾーンにすべての社内レコードを登録して解決させる",
    ],
    correctIndices: [1],
    explanation:
      "Route 53 Resolver エンドポイントは ENI ごとに時間課金が発生するため、各 VPC に作成すると高コストかつ管理が煩雑になります。集約用（Shared Services）VPC にエンドポイントと転送ルールを 1 組配置し、AWS RAM（Resource Access Manager）で転送ルールを組織内の他アカウントへ共有するのが標準のベストプラクティスです。",
    keywords: ["Route 53 Resolver", "AWS RAM", "ハイブリッド DNS"],
  },
  {
    id: "sap-q4",
    domainId: "sap-domain-2",
    domainLabel: "Domain 2: セキュリティ・ガバナンス",
    difficulty: "応用",
    selectCount: 2,
    question:
      "金融系企業が AWS Organizations を用いて 80 アカウントのランディングゾーンを構築しています。コンプライアンス要件として、(1) 既存および将来作成される全アカウント・全リージョンの API 操作ログをメンバーアカウントの管理者でも削除・改ざんできない状態で単一アーカイブ先へ保存すること、(2) メンバーアカウント内の AdministratorAccess 保持者であっても ap-northeast-1 と ap-northeast-3 以外でのリソース作成や GuardDuty の無効化を行えないように強制すること、が求められています。実装すべき対策を【2つ】選んでください。",
    options: [
      "管理アカウント（または委任管理者）で AWS CloudTrail の組織証跡（Organization Trail）を作成し、ログアーカイブ専用アカウントの S3 バケット（S3 Object Lock とログファイル整合性検証を有効化）へ保存する",
      "AWS Organizations の OU またはルートに対して、guardduty:DeleteDetector の拒否および条件キー aws:RequestedRegion で指定 2 リージョン以外の非グローバル操作を拒否する SCP をアタッチする",
      "各メンバーアカウントのルートユーザーに対して IAM アクセス境界（Permissions Boundary）を手動で設定する",
      "AWS Config を管理アカウントにのみ設定し、非準拠リソース作成を週次メールで通知する",
      "IAM Identity Center で管理アカウントにのみ AdministratorAccess を割り当て、メンバーアカウントのログインを全面禁止する",
    ],
    correctIndices: [0, 1],
    explanation:
      "全アカウントの改ざん不可能な監査ログ一元集約には「CloudTrail 組織証跡 ＋ 別アカウント S3（Object Lock + 整合性検証）」が必要です。また、メンバーアカウントの管理者（AdministratorAccess）も含めてリージョン制限や GuardDuty 停止を予防的に禁止するには Organizations の SCP を使用します（Permissions Boundary はルートユーザーにアタッチできません）。",
    keywords: ["CloudTrail Organization Trail", "S3 Object Lock", "SCP", "複数選択"],
  },

  // Domain 4: 回復力・移行・事業継続性 & Domain 1: アーキテクチャ設計
  {
    id: "sap-q5",
    domainId: "sap-domain-4",
    domainLabel: "Domain 4: 回復力・移行・事業継続性",
    difficulty: "応用",
    selectCount: 1,
    question:
      "ミッションクリティカルな決済 API を ap-northeast-1（プライマリ）と ap-northeast-3（セカンダリ）の 2 リージョンで設計しています。要件として RPO は 5 秒未満、RTO は 2 分以内であり、プライマリリージョンで AWS コントロールプレーン API（Route 53 レコード更新 API 等）が利用できない障害シナリオでも確実にセカンダリへトラフィックを切り替えられるようにする必要があります。最適な構成はどれですか？",
    options: [
      "RDS for PostgreSQL のクロスリージョンリードレプリカを使い、障害時に AWS CLI で Route 53 の DNS レコードを手動変更する",
      "Amazon Aurora Global Database で 1 秒未満のクロスリージョン複製を行い、トラフィック切替には Route 53 Application Recovery Controller (ARC) のデータプレーンルーティングコントロールを使用する",
      "S3 クロスリージョンレプリケーションへ毎時 RDS スナップショットをコピーし、障害時に CloudFormation でセカンダリ環境を新規作成する",
      "同一リージョン内の RDS Multi-AZ と Auto Scaling のみを構成し、リージョン障害時はサポートに連絡する",
    ],
    correctIndices: [1],
    explanation:
      "Aurora Global Database はストレージ層で通常 1 秒未満のレプリケーションを行い、RPO 数秒・高速昇格を実現します。また、リージョン障害時にはコントロールプレーン API が影響を受ける可能性があるため、高信頼なデータプレーン API でフェイルオーバーを実行する Route 53 Application Recovery Controller (ARC) のルーティングコントロールが SAP-C03 の定石です。",
    keywords: ["Aurora Global Database", "Route 53 ARC", "データプレーン切替", "DR"],
  },
  {
    id: "sap-q6",
    domainId: "sap-domain-4",
    domainLabel: "Domain 4: 回復力・移行・事業継続性",
    difficulty: "標準",
    selectCount: 1,
    question:
      "北米・欧州・アジアの 3 大陸にユーザーを持つリアルタイム共同編集 SaaS を新規構築します。すべての地域のユーザーが最寄りリージョンに対して一桁ミリ秒のレイテンシで「読み取りと書き込みの両方」を実行でき、リージョン間のデータ同期と競合解決を AWS 側でフルマネージドに処理したい場合、最適なアーキテクチャはどれですか？",
    options: [
      "単一リージョンの Amazon RDS for MySQL に書き込みを集約し、各大陸に Read Replica を配置してアプリ側で書き込みを転送する",
      "Route 53 のレイテンシーベースルーティング背後に各リージョンの API Gateway / コンピュート層を配置し、データストアとして Amazon DynamoDB Global Tables を採用する",
      "Amazon Redshift クラスターを 3 リージョンに配置し、毎分 S3 経由でバッチ同期する",
      "Amazon ElastiCache for Memcached のみを使用し、リージョン間を VPC ピアリングで同期する",
    ],
    correctIndices: [1],
    explanation:
      "DynamoDB Global Tables は複数リージョンで同時に読み書き可能な Active-Active（マルチアクティブ）NoSQL テーブルを提供し、通常 1 秒未満の双方向レプリケーションと Last Writer Wins による自動競合解決をマネージドで処理します。",
    keywords: ["DynamoDB Global Tables", "Active-Active", "レイテンシールーティング"],
  },
  {
    id: "sap-q7",
    domainId: "sap-domain-5",
    domainLabel: "Domain 5: 運用上の優秀性と自動化",
    difficulty: "応用",
    selectCount: 1,
    question:
      "データサイエンス部門の社員が分析用の標準環境（特定の暗号化設定・VPC サブネット・IAM ロール・EMR クラスターを含む）を必要に応じてオンデマンドで作成できるようにしたいと考えています。ただし、セキュリティポリシーにより社員の IAM ロールには VPC、KMS キー、IAM ロールを直接作成する権限を一切付与できません。要件を満たす最適な仕組みはどれですか？",
    options: [
      "社内の AWS CloudFormation テンプレートを共有 S3 バケットに置き、社員の IAM ロールに iam:CreateRole と kms:CreateKey の権限を一時付与する",
      "承認済みの CloudFormation テンプレートを AWS Service Catalog の製品として登録し、プロビジョニング権限を持つ Launch Constraint（起動制約）ロールを設定したうえで、社員には Service Catalog エンドユーザー権限のみ付与する",
      "社員ごとに個別の AWS アカウントを作成し、全員に AdministratorAccess を付与して AWS Config で事後監査する",
      "AWS CodeCommit に Terraform コードを置き、社員各自のローカル PC から管理者アクセスキーで apply させる",
    ],
    correctIndices: [1],
    explanation:
      "AWS Service Catalog に Launch Constraint（起動制約）ロールを割り当てることで、エンドユーザー自身に IAM ロール作成や VPC/KMS 作成の権限を与えなくても、承認された製品テンプレートを安全にセルフサービス展開できます。",
    keywords: ["AWS Service Catalog", "Launch Constraint", "最小権限IaC"],
  },
  {
    id: "sap-q8",
    domainId: "sap-domain-1",
    domainLabel: "Domain 1: クラウド向け設計と実装",
    difficulty: "標準",
    selectCount: 1,
    question:
      "新規の法人向け購買承認プラットフォームのバックエンドをサーバーレスで構築します。注文受付後、(1) 在庫確保、(2) 与信チェック、(3) 高額案件の場合に人手による承認待ち（最大 72 時間待機）、(4) 出荷指示を順に実行し、途中の出荷指示が失敗した場合は確保済みの在庫と与信枠を取り消す補償トランザクション（Saga パターン）を確実に 1 回ずつ実行したいと考えています。最も適した設計はどれですか？",
    options: [
      "AWS Step Functions の Express ワークフローを使用し、Lambda 内で sleep() して 72 時間待機する",
      "AWS Step Functions の Standard ワークフローを使用し、コールバック（waitForTaskToken）パターンで人手承認を待機し、Catch 定義による補償ステップを実行する",
      "Amazon SQS スタンダードキューと 1 つの AWS Lambda 関数（タイムアウト 15 分）だけで全体の状態を管理する",
      "Amazon EventBridge のスケジュールルールのみで 1 分ごとに DB をポーリングする",
    ],
    correctIndices: [1],
    explanation:
      "Step Functions Standard ワークフローは最大 1 年間の状態保持・タスクコールバック（waitForTaskToken）による人間承認の無課金待機・Exactly-once 実行・Catch/Retry を用いた Saga 補償トランザクションをサポートします（Express ワークフローは最大 5 分かつコールバック待機非対応）。",
    keywords: ["Step Functions Standard", "Sagaパターン", "waitForTaskToken"],
  },

  {
    id: "sap-q9",
    domainId: "sap-domain-1",
    domainLabel: "Domain 1: クラウド向け設計と実装",
    difficulty: "標準",
    selectCount: 1,
    question:
      "既存の EC2 ベース Web アプリケーションの一部を VPC 内の AWS Lambda 関数へ移行し、Amazon RDS for PostgreSQL へ接続しています。キャンペーン時のトラフィック急増で Lambda の同時実行数が 1,500 まで急上昇すると、RDS 側で「FATAL: remaining connection slots are reserved」エラーが頻発し、また DB フェイルオーバー後のアプリ復旧にも時間を要しています。アプリロジックの大幅な書き換えなしに両方の課題を解決する方法はどれですか？",
    options: [
      "Lambda の予約済み同時実行数を 10 に制限し、超過リクエストをすべてエラーにする",
      "Amazon RDS Proxy を導入して RDS の前段に配置し、Lambda の接続先エンドポイントを RDS Proxy へ変更する",
      "RDS インスタンスのインスタンスクラス変更ではなく、Lambda のメモリを 10 GB まで引き上げる",
      "RDS for PostgreSQL を Amazon S3 + Athena へ即座に置き換える",
    ],
    correctIndices: [1],
    explanation:
      "Amazon RDS Proxy はフルマネージドのデータベースプロキシとして Lambda 等からの大量接続をプーリング・多重化し、RDS への実コネクション数消費を抑制するとともに、Multi-AZ フェイルオーバー時のダウンタイムも大幅に短縮します。",
    keywords: ["RDS Proxy", "Lambdaコネクション枯渇", "パフォーマンス改善"],
  },
  {
    id: "sap-q10",
    domainId: "sap-domain-4",
    domainLabel: "Domain 4: 回復力・移行・事業継続性",
    difficulty: "標準",
    selectCount: 1,
    question:
      "グローバル展開している既存のリアルタイム音声通話・オンラインゲーム基盤では、us-east-1 と eu-west-1 の Network Load Balancer（NLB）背後の EC2 群へ、クライアントからカスタムの TCP および UDP プロトコルで直接通信しています。クライアントの接続遅延を改善しつつ、顧客側ファイアウォールの許可リスト用に 2 つの固定 IP アドレスのみを案内し、さらにリージョン障害時にクライアントの DNS キャッシュ（TTL）に左右されず即時フェイルオーバーしたい場合、導入すべきサービスはどれですか？",
    options: [
      "Amazon CloudFront を両リージョンの NLB の前段に追加する",
      "AWS Global Accelerator を導入し、両リージョンの NLB をエンドポイントグループとして登録する",
      "Amazon Route 53 のフェイルオーバールーティングの TTL を 0 秒に設定する",
      "S3 Transfer Acceleration を有効化する",
    ],
    correctIndices: [1],
    explanation:
      "CloudFront は HTTP/HTTPS 専用でありカスタム TCP/UDP には対応しません。AWS Global Accelerator は 2 つの固定 Anycast IP アドレスを提供し、最寄りの AWS エッジから AWS バックボーンネットワーク経由で TCP/UDP 通信を最適化し、ヘルスチェック異常時も DNS TTL に関係なく 1 分未満で正常リージョンへ迂回します。",
    keywords: ["Global Accelerator", "TCP/UDP", "Anycast固定IP"],
  },
  {
    id: "sap-q11",
    domainId: "sap-domain-5",
    domainLabel: "Domain 5: 運用上の優秀性と自動化",
    difficulty: "応用",
    selectCount: 1,
    question:
      "既存の AWS 環境の運用監査で、(1) パブリックサブネットの踏み台 EC2 と共有 SSH 秘密鍵を使って運用者がログインしており誰がどのコマンドを実行したか追えない点、(2) 運用者がデバッグ目的で Security Group の 22 番ポートを 0.0.0.0/0 に開放したまま戻し忘れる点、が指摘されました。踏み台サーバーと SSH 鍵を完全に廃止し、かつ 0.0.0.0/0 の SSH 開放を検知次第自動でクローズするよう既存環境を改善する最適な組み合わせはどれですか？",
    options: [
      "AWS Systems Manager Session Manager（VPC Interface Endpoint 併用）を導入して踏み台とインバウンド 22 番ポートを廃止し、AWS Config の restricted-ssh ルールと SSM Automation による自動修復を組み合わせる",
      "踏み台 EC2 のインスタンスサイズを大きくし、Security Group の変更を毎晩手動で確認する",
      "全 EC2 インスタンスをパブリックサブネットへ移動し、NACL で全通信を許可する",
      "Amazon Macie を有効化して Security Group のポート 22 開放をスキャンする",
    ],
    correctIndices: [0],
    explanation:
      "SSM Session Manager によりインバウンドポート開放や SSH 鍵・踏み台なしで IAM 認証接続と操作ログ（S3/CloudWatch Logs）記録が可能になります。さらに AWS Config のマネージドルール（restricted-ssh）と SSM Automation 修復アクションを組み合わせることで、違反 Security Group ルールを自動で取り消せます。",
    keywords: ["Session Manager", "AWS Config", "SSM Automation", "自動修復"],
  },
  {
    id: "sap-q12",
    domainId: "sap-domain-3",
    domainLabel: "Domain 3: コスト最適化",
    difficulty: "応用",
    selectCount: 2,
    question:
      "30 個の本番アカウントの月次コスト分析の結果、(1) プライベートサブネットから Amazon S3 と DynamoDB への大量データアクセスにより NAT Gateway のデータ処理料金が月間 150 TB 分発生していること、(2) 24 時間 365 日稼働する EC2 と ECS on Fargate のコンピューティング基盤がすべてオンデマンド課金のままで、一部インスタンスは過剰プロビジョニング状態であること、が判明しました。既存システムの可用性を損なわず最大のコスト削減効果を得られる改善策を【2つ】選んでください。",
    options: [
      "該当 VPC のルートテーブルに S3 および DynamoDB 向けの Gateway 型 VPC エンドポイントを追加し、NAT Gateway をバイパスさせる",
      "CloudWatch Agent によるメモリメトリクス収集と AWS Compute Optimizer の推奨に基づくライトサイジングを実施し、定常ベースライン利用分に対して Compute Savings Plans を購入する",
      "すべての S3 バケット通信を Gateway 型ではなく Interface 型 VPC エンドポイントへ変更する",
      "状態を保持する本番プライマリデータベースを中断通知付きの EC2 スポットインスタンスへ移行する",
      "毎日頻繁に読み書きされる S3 Standard データをすべて S3 Glacier Deep Archive へ移動する",
    ],
    correctIndices: [0, 1],
    explanation:
      "S3 / DynamoDB へのアクセスには無料の Gateway 型 VPC エンドポイントを使うことで NAT Gateway のデータ処理課金をゼロにできます（Interface 型は時間・データ課金が発生）。また、Compute Optimizer によるライトサイジングと、EC2/Fargate 両方に柔軟適用できる Compute Savings Plans の組み合わせが最も効果的です。",
    keywords: ["Gateway VPC Endpoint", "Compute Optimizer", "Compute Savings Plans", "複数選択"],
  },

  {
    id: "sap-q13",
    domainId: "sap-domain-4",
    domainLabel: "Domain 4: 回復力・移行・事業継続性",
    difficulty: "標準",
    selectCount: 1,
    question:
      "データセンター契約終了に伴い、4 か月以内に 200 台の Linux/Windows 業務アプリ VM を最小停止で AWS へリフト＆シフト（Rehost）し、同時に複雑な PL/SQL ストアドプロシージャを含む 4 TB のオンプレミス Oracle データベースを Amazon Aurora PostgreSQL へほぼ無停止で移行する必要があります。最適な移行ツール群の組み合わせはどれですか？",
    options: [
      "VM は AWS Application Migration Service (MGN) でブロックレベル継続複製して移行し、Oracle DB は AWS SCT でスキーマ・PL/SQL を変換したうえで AWS DMS（Full Load ＋ CDC）で移行する",
      "VM は手動で ISO イメージを作成して S3 にアップロードし、Oracle DB は AWS DMS のみで PL/SQL を自動変換して移行する",
      "VM と Oracle DB の両方を AWS DataSync だけで直接 Amazon RDS へ同期する",
      "AWS Snowmobile を使って 200 台の VM のメモリ状態ごと輸送する",
    ],
    correctIndices: [0],
    explanation:
      "物理/仮想サーバーの無改修リフト＆シフト（Rehost）には AWS Application Migration Service (MGN) が標準です。また、AWS DMS 自体は異種 DB のスキーマやストアドプロシージャ（PL/SQL）を変換しないため、AWS SCT（Schema Conversion Tool）で事前変換し、DMS の Full Load ＋ CDC（継続的変更データキャプチャ）で最小停止カットオーバーを行います。",
    keywords: ["AWS MGN", "AWS SCT", "AWS DMS CDC", "異種DB移行"],
  },
  {
    id: "sap-q14",
    domainId: "sap-domain-4",
    domainLabel: "Domain 4: 回復力・移行・事業継続性",
    difficulty: "応用",
    selectCount: 1,
    question:
      "オンプレミスのファイルサーバーに保管されている 450 TB のメディアアーカイブデータを 3 週間以内に Amazon S3 へ移行し、その後も日々発生する新規ファイルのみ継続的に同期し続けたいと考えています。ただし、拠点のインターネット回線は共有の 100 Mbps（移行に割り当て可能な帯域は最大 50 Mbps）であり、Direct Connect の新規開通は納期に間に合いません。期限内に移行を完了する最も現実的な設計はどれですか？",
    options: [
      "AWS DataSync エージェントをオンプレミスに配置し、50 Mbps 回線を使って 450 TB すべてを 3 週間以内にオンライン転送する",
      "複数台の AWS Snowball Edge Storage Optimized デバイスを取り寄せて高速な社内 LAN 経由でデータを並列コピー・返送して S3 へ投入し、返送後に発生した差分のみ AWS DataSync でオンライン同期する",
      "S3 Transfer Acceleration を有効化し、ブラウザから手動でマルチパートアップロードする",
      "Amazon FSx for Windows File Server をオンプレミスに配送して接続する",
    ],
    correctIndices: [1],
    explanation:
      "50 Mbps の帯域では 1 日あたり約 540 GB 程度しか転送できないため、450 TB の転送には 2 年以上かかり 3 週間以内の完了は物理的に不可能です。大容量の初期移行は AWS Snowball Edge（複数台）によるオフライン物理輸送で行い、その間の小さな更新差分のみを AWS DataSync でオンライン同期するのが最適です。",
    keywords: ["Snowball Edge", "AWS DataSync", "帯域計算", "大容量データ移行"],
  },
  {
    id: "sap-q15",
    domainId: "sap-domain-4",
    domainLabel: "Domain 4: 回復力・移行・事業継続性",
    difficulty: "応用",
    selectCount: 1,
    question:
      "長年運用してきた設計・製造部門のアプリケーション群は、オンプレミスの NetApp ONTAP ストレージクラスター上の同一ボリュームに対し、Linux クライアントからは NFSv4、Windows クライアントからは SMB で同時アクセスしており、NetApp SnapMirror による遠隔複製と重複排除・スナップショット機能に強く依存しています。アプリケーションコードやストレージ利用手順を変更せず AWS へ移行する場合、最適なサービスはどれですか？",
    options: [
      "Amazon EFS へデータをコピーし、Windows クライアントも NFS に改修する",
      "Amazon FSx for NetApp ONTAP を構築し、オンプレミス ONTAP から NetApp SnapMirror で直接レプリケーションして移行する",
      "Amazon S3 バケットへ移行し、クライアントアプリを S3 REST API 呼び出しに全面改修する",
      "Amazon EBS ボリュームに手動で Samba と NFS サーバーを構築し、マルチアタッチで共有する",
    ],
    correctIndices: [1],
    explanation:
      "Amazon FSx for NetApp ONTAP はフルマネージドの NetApp ONTAP ファイルシステムであり、NFS・SMB・iSCSI のマルチプロトコル同時アクセス、重複排除・圧縮、およびオンプレミス ONTAP からの SnapMirror 直接レプリケーションをネイティブにサポートしています。",
    keywords: ["FSx for NetApp ONTAP", "SnapMirror", "マルチプロトコル共有"],
  },
  {
    id: "sap-q16",
    domainId: "sap-domain-4",
    domainLabel: "Domain 4: 回復力・移行・事業継続性",
    difficulty: "標準",
    selectCount: 1,
    question:
      "EC2 上で稼働する巨大なモノリシック Java アプリケーションを、Strangler Fig パターンで段階的にコンテナ化されたマイクロサービス（Amazon ECS on AWS Fargate）へ切り出しています。今後新設されるマイクロサービスはそれぞれ独立した部門別 AWS アカウントに配置されますが、既存のモノリス向けエンドポイントと新マイクロサービス向けエンドポイントを URL パス単位で透過的に振り分けつつ、マルチアカウント間のネットワークや API プロキシの手動構築・管理コストを最小化したい場合、どのサービスを活用すべきですか？",
    options: [
      "AWS Migration Hub Refactor Spaces を使用し、マルチアカウント環境での API Gateway / NLB / Transit Gateway によるパスベースルーティングを自動オーケストレーションする",
      "すべてのマイクロサービスのパブリック IP を DNS ラウンドロビンで直接クライアントに返却する",
      "新サービスが稼働するすべてのアカウント間で手動で VPC ピアリングと Nginx リバースプロキシを管理する",
      "AWS Schema Conversion Tool (SCT) を使って Java モノリスをマイクロサービスに自動変換する",
    ],
    correctIndices: [0],
    explanation:
      "AWS Migration Hub Refactor Spaces は Strangler Fig パターンによる段階的モダナイゼーション専用のオーケストレーションサービスであり、複数 AWS アカウントに跨がる環境（Transit Gateway、Resource Access Manager、API Gateway、NLB）とルーティング設定を自動プロビジョニングします。",
    keywords: ["Refactor Spaces", "Strangler Fig", "ECS Fargate", "モダナイゼーション"],
  },

  // SAP-C03 新設領域（AI/RAG・VPC Lattice・RCP/PQC/HITL・Cost Categories・FIS/DevSecOps）
  {
    id: "sap-q17",
    domainId: "sap-domain-1",
    domainLabel: "Domain 1: クラウド向け設計と実装",
    difficulty: "応用",
    selectCount: 2,
    question:
      "SAP-C03 Task 1.1 / 1.2 に基づき、複数 AWS アカウントに分散した Amazon ECS / Lambda マイクロサービス群から、社内最新規定に基づく RAG 検索とツール実行を伴う生成 AI 基盤を統合運用したいと考えています。「マルチアカウントの VPC ペアリングや個別プロキシ構築を最小化しつつサービス間認証とカナリア重み付けルーティングを統合すること」と「社内ドキュメントのベクトル検索取り込みと検索・生成（RAG）をフルマネージドで構築すること」を満たす組み合わせを【2つ】選んでください。",
    options: [
      "Amazon VPC Lattice（および ECS Service Connect）でアカウント境界を越えたサービスディスカバリ・IAM 認証ポリシー・重み付きルーティングを構成する",
      "Amazon Bedrock Knowledge Bases とベクトルストアを構成して社内ドキュメントの自動チャンク分割・埋め込み取り込み・RAG 検索を実現する",
      "全アカウントのサブネットを単一 VPC ピアリングメッシュで接続し、各 EC2 上に手動 Nginx リバースプロキシを配置する",
      "社内ドキュメントを毎時間パブリック S3 へ公開し、クライアントから無認証で読み込ませる",
      "基盤モデルの重みパラメータを毎回ゼロから自前 GPU で再事前学習させて知識を更新する",
    ],
    correctIndices: [0, 1],
    explanation:
      "SAP-C03 の新設要件では、マルチアカウントのマイクロサービス通信・認可の統合に Amazon VPC Lattice / ECS Service Connect を、RAG 取り込み・検索には Amazon Bedrock Knowledge Bases を選定する設計判断が問われます。",
    keywords: ["SAP-C03", "VPC Lattice", "Bedrock Knowledge Bases", "RAG"],
  },
  {
    id: "sap-q18",
    domainId: "sap-domain-2",
    domainLabel: "Domain 2: セキュリティ・ガバナンス",
    difficulty: "応用",
    selectCount: 2,
    question:
      "SAP-C03 Task 2.1 / 2.5 に基づき、オンプレミス工場内のサーバー群に長期固定 IAM アクセスキーを一切保存せずに AWS S3/KMS へ安全アクセスさせたい要件と、Amazon Bedrock 上のエージェント AI 基盤で有害コンテンツ遮断・PII 保護・高リスク操作時の人間承認を強制したい要件を同時に満たす設計を【2つ】選んでください。",
    options: [
      "オンプレミスサーバーの X.509 クライアント証明書を用いて AWS IAM Roles Anywhere 経由で短期の一時 IAM 認証情報を取得させる",
      "Amazon Bedrock Guardrails でコンテンツフィルタ・拒否トピック・PII 保護を適用し、機密実行前には AWS Step Functions による人間承認（HITL）ワークフローを介在させる",
      "オンプレミスサーバー全台にルートユーザーの固定アクセスキーを暗号化せず環境変数として配布する",
      "組織全体の S3 バケットポリシーを Principal: * に設定してオンプレミスからのアクセスを許可する",
      "エージェント AI に AdministratorAccess を付与し、承認なしで本番 DB 削除 API を実行させる",
    ],
    correctIndices: [0, 1],
    explanation:
      "ハイブリッドワークロードの証明書ベース一時 IAM 認証には AWS IAM Roles Anywhere を用います。また SAP-C03 Task 2.5（責任ある AI コントロール）では Bedrock Guardrails と AgentCore Identity / Step Functions を用いた Human-in-the-Loop（人間による監督）が重要です。",
    keywords: ["SAP-C03", "IAM Roles Anywhere", "Bedrock Guardrails", "HITL"],
  },
  {
    id: "sap-q19",
    domainId: "sap-domain-2",
    domainLabel: "Domain 2: セキュリティ・ガバナンス",
    difficulty: "応用",
    selectCount: 1,
    question:
      "AWS Organizations 配下で全アカウントの S3 バケットや KMS キー等のリソースに対し、アカウント境界を越えて「組織外（外部アカウント）からの意図しないアクセスをリソースポリシー上限で一括禁止し、外部からの TLS 接続も強制したい」と考えています。IAM 主体側を制限する SCP だけでなく、リソース側へのデータ境界ガードレールとして管理アカウント/委任管理者が適用すべきポリシーはどれですか？",
    options: [
      "Resource Control Policy (RCP) を AWS Organizations のルートまたは OU に適用する",
      "AWS Budgets のアラートアクションを S3 バケットへ付与する",
      "Amazon CloudWatch Synthetics Canary を各アカウントへ配置する",
      "EC2 インスタンスメタデータ IMDSv1 を全アカウントで有効化する",
    ],
    correctIndices: [0],
    explanation:
      "SAP-C03 で明示されたデータ境界統制では、IAM プリンシパルの最大権限を制限する SCP に加え、組織内の AWS リソースへ適用されるアクセス上限を一元規定する Resource Control Policy (RCP) を併用します。",
    keywords: ["SAP-C03", "RCP", "データ境界", "AWS Organizations"],
  },
  {
    id: "sap-q20",
    domainId: "sap-domain-3",
    domainLabel: "Domain 3: コスト最適化",
    difficulty: "標準",
    selectCount: 2,
    question:
      "SAP-C03 Domain 3 の要件として、複数事業部が共用する生成 AI・分析プラットフォームにおいて「事業部単位の正確なコスト配賦（チャージバック/ショーバック）を自動化すること」と「Amazon Bedrock / CloudWatch Logs 運用における推論およびオブザーバビリティコストを品質を損なわず削減すること」を満たす施策を【2つ】選んでください。",
    options: [
      "コスト配分タグのタグポリシー強制と AWS Cost Categories を構成し、事業部別のコストルールとチャージバック集計を自動化する",
      "Amazon Bedrock のプロンプト階層選択・バッチ推論・キャッシュを活用し、CloudWatch Logs はログフィルタリング・メトリクス集約・保持期間最適化を行う",
      "全ワークロードの全デバッグログを CloudWatch Logs に無期限（Never Expire）で保存し、毎秒全件を Athena でスキャンする",
      "軽量な分類タスクも含めすべての AI リクエストを常に最大サイズ基盤モデルのオンデマンド同期推論のみで処理する",
      "単一の管理アカウントに全事業部のタグなしリソースを混在させ、手動スプレッドシートで按分する",
    ],
    correctIndices: [0, 1],
    explanation:
      "SAP-C03 Domain 3（Task 3.1 / 3.3 / 3.4）では、タグ強制と AWS Cost Categories によるチャージバック、AI/ML ワークロードのモデル階層選定・バッチ推論・キャッシュ活用、およびログフィルタリング/保持最適化によるコスト効率的なオブザーバビリティ設計が問われます。",
    keywords: ["SAP-C03", "AWS Cost Categories", "AIコスト最適化", "複数選択"],
  },
  {
    id: "sap-q21",
    domainId: "sap-domain-3",
    domainLabel: "Domain 3: コスト最適化",
    difficulty: "標準",
    selectCount: 1,
    question:
      "同一リージョン内の複数 AZ にまたがるマイクロサービスと、社外向け大容量メディアダウンロード基盤を運用しています。データ転送コストとコンピュート単価を継続的に削減するため、既存の ARM64 対応コンテナ/EC2 ワークロード移行と配信経路見直しを行う最適な組み合わせはどれですか？",
    options: [
      "AWS Graviton プロセッサへの移行で価格性能比を改善し、社外配信は S3 直接ではなく Amazon CloudFront キャッシュ経由へ統合してインターネット転送料単価を抑える",
      "すべての通信をパブリック IP 経由でクロス AZ 転送させ、NAT Gateway を多段化する",
      "CloudFront を削除して全リージョンの EC2 から直接インターネットへ配信する",
      "アクセス頻度が不規則な大規模データをすべてプロビジョンド IOPS SSD (io2) 上に複製保管する",
    ],
    correctIndices: [0],
    explanation:
      "SAP-C03 Task 3.1/3.2 では AWS Graviton 採用によるコンピュートコスト/サステナビリティ最適化と、CloudFront や PrivateLink/VPC エンドポイントを活用したネットワークデータ転送コスト最適化が問われます。",
    keywords: ["AWS Graviton", "CloudFront", "データ転送コスト削減"],
  },
  {
    id: "sap-q22",
    domainId: "sap-domain-5",
    domainLabel: "Domain 5: 運用上の優秀性と自動化",
    difficulty: "応用",
    selectCount: 2,
    question:
      "SAP-C03 Domain 5（運用上の優秀性とオートメーション）に基づき、(1) クロスアカウント CI/CD パイプライン内でコンテナイメージの重大な脆弱性 (CVE) をデプロイ前に自動検知して昇格を止める仕組みと、(2) AZ 障害や API レイテンシ悪化時に自動スケーリングやフェイルオーバーが設計通り機能するかを制御された障害注入で定期検証する仕組みを導入したい場合、最適な組み合わせを【2つ】選んでください。",
    options: [
      "Amazon ECR のイメージスキャンおよび Amazon Inspector をパイプラインへ統合し、重大脆弱性検出時に昇格ゲートで自動停止する",
      "AWS Fault Injection Service (FIS) を用いて停止条件（Stop Condition）付きのカオス実験を実施し、AWS Resilience Hub やオブザーバビリティ指標と組み合わせて復旧性を検証する",
      "本番 EC2 インスタンスを運用者がランダムな時刻に AWS コンソールから手動終了し、アラームが鳴るか目視確認する",
      "CI/CD のセキュリティスキャンをすべて省略し、本番稼働後に年 1 回の手動チェックのみ実施する",
      "自動修復アクションのサーキットブレーカーとレート制限をすべて解除し、無制限に再起動ループさせる",
    ],
    correctIndices: [0, 1],
    explanation:
      "SAP-C03 Domain 5（Task 5.2 / 5.4）では、DevSecOps パイプラインへの Amazon Inspector / ECR イメージスキャン統合、および AWS Fault Injection Service (FIS) による制御されたカオス試験と安全制約付き（サーキットブレーカー・レート制限・指数バックオフ）自動修復の設計が重視されます。",
    keywords: ["SAP-C03", "AWS FIS", "Amazon Inspector", "DevSecOps"],
  },
];

export const sapOfficialResources: SaaOfficialResource[] = [
  {
    title: "AWS Certified Solutions Architect – Professional 公式試験ページ",
    description: "SAP-C03（旧 SAP-C02 は 2026/11/16 終了）の公式試験概要、サンプル問題、受験要項のポータル。",
    url: "https://aws.amazon.com/jp/certification/certified-solutions-architect-professional/",
    badge: "AWS公式",
  },
  {
    title: "SAP-C03 公式試験ガイド（日本語ドキュメント）",
    description: "SAP-C02 → SAP-C03 改定比較・5 ドメイン重み（25/25/15/15/20%）・AI/FIS/PQC 出題範囲の一次資料。",
    url: "https://docs.aws.amazon.com/ja_jp/aws-certification/latest/solutions-architect-professional-03/solutions-architect-professional-03.html",
    badge: "公式試験ガイド",
  },
  {
    title: "AWS Skill Builder (公式デジタル学習プラットフォーム)",
    description: "SAP 対応の公式練習問題集・模擬試験（Official Practice Exam）や深掘りコースを提供。",
    url: "https://skillbuilder.aws/",
    badge: "模擬試験あり",
  },
  {
    title: "AWS Prescriptive Guidance (規範的ガイダンス)",
    description: "エンタープライズ移行（7R・MGN・DMS）、ランディングゾーン、モダナイゼーションの実践パターン集。",
    url: "https://aws.amazon.com/jp/prescriptive-guidance/",
    badge: "移行・実践",
  },
  {
    title: "AWS Well-Architected フレームワーク",
    description: "大規模複雑システムにおけるセキュリティ・信頼性・性能・コスト・運用・持続可能性の設計判断基準を体系化。",
    url: "https://aws.amazon.com/jp/architecture/well-architected/",
    badge: "設計思想",
  },
];

export const sapArchitecturePatterns: SaaArchitecturePattern[] = [
  {
    id: "sap-pat-landing-zone",
    title: "マルチアカウント Landing Zone & 中央検査ハブ構成",
    badge: "組織統制",
    flow: [
      "Control Tower + Organizations (SCP)",
      "Direct Connect GW / TGW",
      "検査 VPC (Network Firewall + Appliance Mode)",
      "RAM 共有サービス / ワークロード VPC",
    ],
    summary:
      "Control Tower と SCP で組織ガードレールを強制しつつ、Transit Gateway（Appliance Mode 有効）経由で全南北・東西通信を Network Firewall で一元検査するエンタープライズ標準構成。",
    keyDesignPoints: [
      "Log Archive / Security Audit アカウントを分離し、CloudTrail Organization Trail と Config Aggregator / Security Hub を集約",
      "Route 53 Resolver ルールや共有サブネットは AWS RAM で重複作成せず組織全体へ配布",
    ],
  },
  {
    id: "sap-pat-multiregion-arc",
    title: "マルチリージョン Active-Active & ARC 確実切替構成",
    badge: "超高可用性・DR",
    flow: [
      "Route 53 ARC (Routing Control)",
      "Global Accelerator / CloudFront",
      "Multi-Region API / ECS",
      "DynamoDB Global Tables / Aurora Global DB",
    ],
    summary:
      "コントロールプレーン障害時にも影響を受けない Route 53 ARC データプレーン制御とグローバル DB レプリケーションを組み合わせ、RPO 数秒・RTO 分単位を実現する構成。",
    keyDesignPoints: [
      "Readiness Check でセカンダリリージョンのキャパシティやクォータ不足を平時から自動監査",
      "RDB 要件では Aurora Global Database（Write Forwarding / 管理昇格）、NoSQL 要件では DynamoDB Global Tables を選択",
    ],
  },
  {
    id: "sap-pat-strangler-modern",
    title: "Strangler Fig 段階的モダナイゼーション構成",
    badge: "モダナイゼーション",
    flow: [
      "Refactor Spaces (API GW / NLB / TGW)",
      "既存モノリス (EC2)",
      "新規サービス (ECS Fargate / App Runner / Lambda)",
      "EventBridge / Step Functions",
    ],
    summary:
      "Migration Hub Refactor Spaces によりマルチアカウント間のプロキシとルーティングを自動構築し、既存モノリスを停止せず機能単位でコンテナ・サーバーレスへ順次切り出す構成。",
    keyDesignPoints: [
      "新規マイクロサービス間の連携には EventBridge や Step Functions を採用して疎結合化",
      "CI/CD は CodePipeline ＋ CodeDeploy（Canary / Blue-Green）で自動ロールバックを保証",
    ],
  },
  {
    id: "sap-pat-hybrid-migration",
    title: "大規模ハイブリッド無停止 DB ＆ ストレージ移行構成",
    badge: "大規模移行",
    flow: [
      "オンプレミス Oracle / NAS / VM",
      "AWS SCT (変換) / MGN / Snowball",
      "AWS DMS (CDC) / DataSync",
      "Aurora PostgreSQL / S3 / FSx ONTAP",
    ],
    summary:
      "MGN によるサーバー移行、SCT＋DMS (CDC) による異種 DB 無停止移行、Snowball Edge＋DataSync による大容量データ同期を組み合わせた実践移行パイプライン。",
    keyDesignPoints: [
      "狭帯域回線では Snowball Edge で初期バルク投入し、切り替え直前の差分のみ DataSync で同期",
      "NetApp ONTAP 資産は FSx for NetApp ONTAP の SnapMirror 直接連携でアプリ改修をゼロ化",
    ],
  },
];

export const sapPitfalls: SaaPitfall[] = [
  {
    id: "sap-pit-scp-root",
    trap: "AWS Organizations の SCP を設定すれば管理アカウント（Management Account）やサービスリンクロールの操作も制限できると思う",
    whyWrong:
      "SCP はメンバーアカウントにのみ適用され、管理アカウント自身の操作および AWS サービスリンクロールには制約を及ぼしません。",
    correctApproach:
      "管理アカウントには本番ワークロードを配置せず最小限の管理操作のみに限定し、すべてのワークロードと監査はメンバーアカウント（OU 配下）へ分離して SCP を適用する。",
  },
  {
    id: "sap-pit-tgw-appliance",
    trap: "Transit Gateway 経由で検査専用 VPC の AWS Network Firewall を通す際、デフォルト設定のまま複数 AZ に配置する",
    whyWrong:
      "デフォルトでは送信元と同じ AZ に戻ろうとするため、行きと帰りで異なる AZ のステートフルファイアウォールを経由して非対称ルーティングとなり、通信がドロップされます。",
    correctApproach:
      "検査専用 VPC の Transit Gateway アタッチメントで「Appliance Mode（アプライアンスモード）」を必ず有効化し、同一フローの往復を同じ AZ に固定する。",
  },
  {
    id: "sap-pit-dms-sct",
    trap: "Oracle から Aurora PostgreSQL への移行で、AWS DMS だけでストアドプロシージャやビューも自動変換できると思う",
    whyWrong:
      "AWS DMS はデータ移行および基本的なテーブル構造作成のみを担当し、PL/SQL などのストアドプロシージャ・トリガー・関数等のコード変換は行いません。",
    correctApproach:
      "まず AWS SCT（Schema Conversion Tool）でスキーマとストアドプロシージャを変換してターゲットへ適用し、その後に AWS DMS（Full Load + CDC）でデータを同期する。",
  },
  {
    id: "sap-pit-arc-controlplane",
    trap: "リージョン障害時の DR 切り替え設計で、障害中リージョンのコントロールプレーン API（Route 53 レコード更新や CFn デプロイ）に依存する",
    whyWrong:
      "大規模リージョン障害時にはコントロールプレーン API が高負荷または利用不可となり、DNS 更新やインフラ新規起動の自動化が失敗するリスクがあります。",
    correctApproach:
      "Route 53 ARC のデータプレーンルーティングコントロールや事前プロビジョニング済み Warm Standby / Pilot Light を用い、コントロールプレーン非依存で切り替えられるようにする。",
  },
  {
    id: "sap-pit-rds-proxy",
    trap: "AWS Lambda から RDS へ直接接続し、スパイク時に接続エラーが出たら RDS のインスタンスサイズアップだけで解決しようとする",
    whyWrong:
      "インスタンスサイズを上げてもサーバーレス関数の同時実行スパイクによる TCP/TLS ハンドシェイク負荷と短寿命コネクションの急増は根本解消せず、コストも跳ね上がります。",
    correctApproach:
      "Amazon RDS Proxy を導入してコネクションプーリングを行い、Lambda からの接続要求を多重化するとともに Multi-AZ フェイルオーバー時間も短縮する。",
  },
  {
    id: "sap-pit-dx-encrypt",
    trap: "AWS Direct Connect は専用物理線だから通信内容もデフォルトで暗号化されており、トランジット暗号化要件を満たすと思う",
    whyWrong:
      "Direct Connect はプライベートな物理専用線ですが、L2/L3 レベルでの暗号化はデフォルトでは行われません（10Gbps/100Gbps 一部構成での MACsec または VPN 併用が必要）。",
    correctApproach:
      "「Direct Connect 上の通信を暗号化する」要件がある場合は、Direct Connect 対応ロケーションでの MACsec、または Direct Connect（Public VIF）上で Site-to-Site VPN（IPsec）を確立する。",
  },
];

export const sapKeyLimits: SaaLimitFact[] = [
  {
    id: "sap-lim-scp",
    service: "AWS Organizations / SCP",
    limitValue: "5,120 バイト / 最大 5 個",
    detail: "1つの SCP ポリシードキュメント上限は 5,120 バイト、ルート・OU・アカウントへそれぞれ最大 5 個までアタッチ可能。",
  },
  {
    id: "sap-lim-dx",
    service: "AWS Direct Connect",
    limitValue: "専有 1/10/100 Gbps ・ Hosted 50M〜10G",
    detail: "複数リージョンの TGW へ統合するには Direct Connect Gateway ＋ Transit VIF を使用。デフォルト非暗号化。",
  },
  {
    id: "sap-lim-aurora-global",
    service: "Aurora Global Database",
    limitValue: "遅延 通常 1 秒未満 / 最大 5 セカンダリ",
    detail: "プライマリ以外に最大 5 つのセカンダリリージョンへ複製可能（各リージョン最大 16 リードレプリカ）。",
  },
  {
    id: "sap-lim-step",
    service: "AWS Step Functions",
    limitValue: "Standard 最大 1 年 / Express 最大 5 分",
    detail: "ペイロード上限 256 KB。長時間の人手承認コールバックや Saga 補償処理は Standard、高頻度短時間処理は Express。",
  },
  {
    id: "sap-lim-lambda-apigw",
    service: "AWS Lambda & API Gateway",
    limitValue: "Lambda 15 分・10 GB / API GW 基本 29 秒",
    detail: "API Gateway の同期統合タイムアウトは基本 29 秒のため、長時間処理は SQS/Step Functions 等で非同期 202 応答へ逃がす。",
  },
  {
    id: "sap-lim-stream",
    service: "SQS / Kinesis / EventBridge",
    limitValue: "SQS・EB 256 KB / Kinesis 1MB/s Write",
    detail: "Kinesis Data Streams は 1 シャードあたり書込 1 MB/s (1,000件/s)・読取 2 MB/s。EventBridge と SQS のメッセージ上限は 256 KB。",
  },
];

export const sapServiceQueryAliases: Record<string, string> = {
  "Gateway VPC Endpoint": "VPC Endpoint",
  "Route 53 Weighted": "Weighted",
  "Systems Manager": "Systems Manager",
  "Session Manager": "Session Manager",
  "SSM Automation": "SSM Automation",
  "Config Aggregator": "Config Aggregator",
  "AWS Config": "Config",
  "AWS MGN": "MGN",
  "AWS DMS": "DMS",
  "AWS SCT": "SCT",
  "AWS RAM": "RAM",
  "AWS CDK": "CDK",
  "Snow Family": "Snow",
  "Amazon MSK": "MSK",
  "Amazon ECS": "ECS",
  "Amazon EKS": "EKS",
  "AWS Fargate": "Fargate",
  "AWS App Runner": "App Runner",
  "AWS Lambda": "Lambda",
  "AWS DataSync": "DataSync",
  "AWS Backup": "Backup",
  "AWS Budgets": "Budgets",
  "AWS X-Ray": "X-Ray",
  "VPC Lattice": "VPC Lattice",
  "Lake Formation": "Lake Formation",
  "Bedrock Knowledge Bases": "Knowledge Bases",
  "SageMaker AI": "SageMaker AI",
  "IAM Roles Anywhere": "IAM Roles Anywhere",
  "EKS Pod Identity": "EKS Pod Identity",
  "Bedrock Guardrails": "Guardrails",
  "AWS Artifact": "Artifact",
  "Cost Categories": "Cost Categories",
  "AWS Resilience Hub": "Resilience Hub",
  "Amazon Inspector": "Inspector",
  "ADOT": "ADOT",
  "AWS FIS": "FIS",
};
