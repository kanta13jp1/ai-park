export interface SaaExamFact {
  label: string;
  value: string;
  detail: string;
}

export interface SaaTopic {
  id: string;
  title: string;
  services: string[];
  keyPoints: string[];
  examTip: string;
}

export interface SaaDomain {
  id: string;
  number: number;
  title: string;
  englishTitle: string;
  weight: number; // %
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  summary: string;
  topics: SaaTopic[];
}

export interface SaaComparisonRow {
  feature: string;
  values: string[];
}

export interface SaaComparisonTable {
  id: string;
  category: "ネットワーク" | "ストレージ" | "データベース" | "非同期・連携" | "セキュリティ";
  title: string;
  subtitle: string;
  columns: string[];
  rows: SaaComparisonRow[];
  decisionRule: string;
}

export interface SaaQuestion {
  id: string;
  domainId: string;
  domainLabel: string;
  difficulty: "基礎" | "標準" | "応用";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  keywords: string[];
}

export interface SaaOfficialResource {
  title: string;
  description: string;
  url: string;
  badge: string;
}

// 出典: AWS Certified Solutions Architect - Associate (SAA-C03) 公式試験ガイド
export const saaExamFacts: SaaExamFact[] = [
  { label: "試験コード", value: "SAA-C03", detail: "Associate レベル" },
  { label: "試験時間", value: "130 分", detail: "約2時間10分" },
  { label: "問題数", value: "65 問", detail: "採点50問 + 非採点15問" },
  { label: "合格ライン", value: "720 点", detail: "100〜1000点スケール" },
  { label: "出題形式", value: "択一 / 複数", detail: "シナリオベース問題中心" },
  { label: "受験料", value: "$150 USD", detail: "ピアソンVUE (オンライン可)" },
];

export const saaDomains: SaaDomain[] = [
  {
    id: "domain-1",
    number: 1,
    title: "セキュアなアーキテクチャの設計",
    englishTitle: "Design Secure Architectures",
    weight: 30,
    accentColor: "indigo",
    summary:
      "出題比率最大の30%。IAMの最小権限設計、VPCの境界防御、データの暗号化（保管時・転送時）、マルチアカウント統制が問われます。",
    topics: [
      {
        id: "d1-iam",
        title: "IAM・フェデレーション・マルチアカウント統制",
        services: ["IAM", "AWS STS", "IAM Identity Center", "AWS Organizations", "SCP"],
        keyPoints: [
          "EC2やLambdaから他サービスへアクセスする際はアクセスキーを埋め込まず IAM ロール（STSの一時認証情報）を使う",
          "AWS Organizations の SCP（サービスコントロールポリシー）は、管理アカウント以外のメンバーアカウントに最大権限の上限を設定する",
          "IAM Identity Center（旧 AWS SSO）で複数アカウントやSAML 2.0 IdP連携を一元管理する",
        ],
        examTip: "「一時的な認証情報」「外部IDプロバイダ」「複数アカウントの一括制限」が出たら STS / Identity Center / SCP を連想。",
      },
      {
        id: "d1-vpc-sec",
        title: "VPC 境界防御とプライベート接続",
        services: ["Security Group", "Network ACL", "AWS WAF", "AWS Shield", "VPC Endpoint", "PrivateLink"],
        keyPoints: [
          "Security Group はステートフル（許可のみ）、Network ACL はサブネット単位でステートレス（許可と拒否の両方・ルール番号順）",
          "インターネットを経由せず AWS サービスと通信する場合は VPC エンドポイント（S3/DynamoDB は無料の Gateway型、その他は Interface型）",
          "AWS WAF は L7（SQLi/XSS/IP制限/Geoブロック）を防御し、ALB・CloudFront・API Gateway にアタッチ可能",
        ],
        examTip: "「特定のIPを拒否（Deny）」は NACL または WAF。「通信をインターネットに出さない」は PrivateLink / VPC Endpoint。",
      },
      {
        id: "d1-encryption",
        title: "暗号化・鍵管理・脅威検知",
        services: ["AWS KMS", "Secrets Manager", "ACM", "CloudTrail", "GuardDuty", "Macie"],
        keyPoints: [
          "Secrets Manager は RDS などの認証情報の「自動ローテーション」に対応（Parameter Store は自動ローテーション非対応）",
          "KMS のカスタマーマネージドキー (CMK) は鍵のローテーション制御やクロスアカウント共有・詳細なアクセス制御が可能",
          "Amazon Macie は S3 バケット内の PII（個人情報・機密データ）を機械学習で自動検出する",
        ],
        examTip: "「DBパスワードの自動ローテーション」＝ Secrets Manager。「S3内の個人情報検出」＝ Macie。",
      },
    ],
  },
  {
    id: "domain-2",
    number: 2,
    title: "弾力性に優れたアーキテクチャの設計",
    englishTitle: "Design Resilient Architectures",
    weight: 26,
    accentColor: "emerald",
    summary:
      "障害に強く自動復旧する構成（高可用性・スケーラビリティ・疎結合・ディザスタリカバリ）を設計する力を問われます。",
    topics: [
      {
        id: "d2-ha-scaling",
        title: "Multi-AZ・ELB・Auto Scaling による高可用性",
        services: ["ALB", "NLB", "Auto Scaling", "Route 53", "RDS Multi-AZ"],
        keyPoints: [
          "RDS Multi-AZ は同期レプリケーションでスタンバイを維持し、障害時に自動フェイルオーバー（可用性向上・読み取り分散は不可）",
          "ALB は L7（HTTP/HTTPS、パス/ホストベースルーティング）、NLB は L4（超低レイテンシ、固定IP、TCP/UDP）",
          "Route 53 のフェイルオーバールーティングとヘルスチェックを組み合わせ、リージョン障害時の自動切り替えを実現",
        ],
        examTip: "「読み取り負荷分散」は Read Replica、「自動フェイルオーバー」は Multi-AZ。「固定IPが必要」なELBは NLB。",
      },
      {
        id: "d2-decoupling",
        title: "疎結合アーキテクチャと非同期処理",
        services: ["Amazon SQS", "Amazon SNS", "EventBridge", "Step Functions", "API Gateway"],
        keyPoints: [
          "SQS は 1対1 のキューイング（スパイク吸収・バックプレッシャー対策）。順序厳密かつ重複排除なら FIFO キュー（最大300 TPS、バッチで3000）",
          "SNS は 1対多の Pub/Sub ファンアウト。SNS トピック → 複数の SQS キューへの Fan-out パターンは頻出",
          "EventBridge はルールベースのイベントルーティング（SaaS連携・スケジュール実行・コンテンツフィルタリング）に最適",
        ],
        examTip: "「処理のスパイクを平準化・バックエンド保護」＝ SQS。「複数システムへ同時通知」＝ SNS + SQS Fan-out。",
      },
      {
        id: "d2-dr",
        title: "バックアップとディザスタリカバリ (DR)",
        services: ["AWS Backup", "S3 CRR", "Pilot Light", "Warm Standby", "Aurora Global Database"],
        keyPoints: [
          "DR 4戦略（コスト低→高 / RTO短縮）: Backup & Restore ＜ Pilot Light（最小限のコアDBのみ稼働） ＜ Warm Standby ＜ Multi-Site Active/Active",
          "S3 クロスリージョンレプリケーション (CRR) を使うには、送信元・送信先両方のバケットでバージョニング有効化が必須",
          "Aurora Global Database は別リージョンへのレプリケーションを通常1秒未満で行い、リージョン障害時に高速プロモート可能",
        ],
        examTip: "「RPO/RTO が数分以内かつコストも抑えたい」なら Pilot Light または Warm Standby を検討。",
      },
    ],
  },
  {
    id: "domain-3",
    number: 3,
    title: "高パフォーマンスなアーキテクチャの設計",
    englishTitle: "Design High-Performing Architectures",
    weight: 24,
    accentColor: "amber",
    summary:
      "ワークロード特性に応じた最適なストレージ・データベース・キャッシュ・コンピューティング基盤の選定が問われます。",
    topics: [
      {
        id: "d3-storage",
        title: "ストレージ選定（ブロック / ファイル / オブジェクト）",
        services: ["Amazon EBS", "Amazon EFS", "Amazon FSx", "Amazon S3", "Storage Gateway"],
        keyPoints: [
          "EBS は単一 AZ の単一 EC2 に接続するブロックストレージ（io2 Block Express は超高 IOPS 向け）。Multi-Attach は io1/io2 のみ",
          "EFS は複数 AZ・多数の EC2/ECS/Lambda から同時にマウントできる Linux 向け POSIX 共有ファイルシステム (NFS)",
          "Windows 共有 (SMB/NTFS/AD連携) は FSx for Windows File Server、HPC 超高速処理は FSx for Lustre",
        ],
        examTip: "「複数のEC2でLinuxファイルを共有」＝ EFS。「Windows共有/SMB」＝ FSx for Windows。「超低レイテンシDB」＝ EBS io2。",
      },
      {
        id: "d3-cache-cdn",
        title: "エッジ配信・ネットワーク高速化・キャッシュ",
        services: ["CloudFront", "Global Accelerator", "ElastiCache", "DAX", "S3 Transfer Acceleration"],
        keyPoints: [
          "CloudFront は静的/動的コンテンツの HTTP キャッシュ配信（エッジロケーション）。S3 への直接アクセスを制限するには OAC (Origin Access Control) を使用",
          "Global Accelerator は Anycast IP を使い、AWS バックボーン経由で TCP/UDP 通信を高速化（非HTTPや固定IPが必要なグローバルアプリ向け）",
          "ElastiCache for Redis / Valkey はリーダーボード（Sorted Sets）、セッション管理、レプリケーション・マルチAZ対応",
        ],
        examTip: "「HTTPキャッシュ配信」＝ CloudFront。「非HTTP/UDP/固定IPでグローバル高速化」＝ Global Accelerator。",
      },
      {
        id: "d3-db-compute",
        title: "データベース最適化とサーバーレス/コンテナ",
        services: ["Aurora", "DynamoDB", "Redshift", "AWS Lambda", "ECS / Fargate"],
        keyPoints: [
          "DynamoDB はミリ秒単位のキーバリュー/ドキュメントDB。マイクロ秒の読み取りキャッシュが必要なら DAX (DynamoDB Accelerator)",
          "Lambda は最大実行時間15分。15分を超えるバッチや長時間コンテナ処理は ECS on Fargate / AWS Batch を選択",
          "Aurora Serverless v2 は予測不能・断続的なワークロードに対し、キャパシティを瞬時に自動スケールする",
        ],
        examTip: "「15分以上の処理」で Lambda を除外し Fargate/Batch を選ぶ問題は定番。",
      },
    ],
  },
  {
    id: "domain-4",
    number: 4,
    title: "コストを最適化したアーキテクチャの設計",
    englishTitle: "Design Cost-Optimized Architectures",
    weight: 20,
    accentColor: "cyan",
    summary:
      "適切な購入オプション、データ転送料金の削減、ストレージ階層化、サーバーレス活用によるコスト最適化が問われます。",
    topics: [
      {
        id: "d4-compute-cost",
        title: "EC2 購入オプションとライトサイジング",
        services: ["Savings Plans", "Spot Instances", "Reserved Instances", "Compute Optimizer"],
        keyPoints: [
          "Compute Savings Plans はインスタンスファミリー・リージョン・Fargate/Lambda にまたがって柔軟に最大66%割引",
          "スポットインスタンスは最大90%割引だが、2分前の通知で中断される可能性あり（ステートレス・バッチ・耐障害性ワークロード向け）",
          "AWS Compute Optimizer は CloudWatch メトリクスを分析し、過剰プロビジョニングの削減（ライトサイジング）を提案",
        ],
        examTip: "「中断されても再開可能なバッチ処理でコスト最小化」＝ スポットインスタンス。「1〜3年の安定稼働で柔軟性重視」＝ Compute Savings Plans。",
      },
      {
        id: "d4-storage-net-cost",
        title: "S3 コスト最適化とデータ転送料金削減",
        services: ["S3 Intelligent-Tiering", "S3 Glacier", "S3 Lifecycle", "Gateway Endpoint", "AWS Budgets"],
        keyPoints: [
          "アクセスパターンが不明・変化するデータは S3 Intelligent-Tiering が自動で最適階層へ移動（取り出し料金なし）",
          "NAT Gateway は時間課金＋データ処理課金がかかる。Private Subnet から S3/DynamoDB へは無料の Gateway型 VPC エンドポイントを使うと大幅削減",
          "AWS Budgets はコストや使用量がしきい値を超えた（または予測された）際にアラート通知・自動アクションを実行",
        ],
        examTip: "「NAT Gateway のコストが高い原因が S3 への大量転送」→ Gateway型 VPC エンドポイントを追加！",
      },
    ],
  },
];

export const saaComparisons: SaaComparisonTable[] = [
  {
    id: "comp-sg-nacl",
    category: "セキュリティ",
    title: "Security Group vs Network ACL",
    subtitle: "VPC のファイアウォール2層の使い分け",
    columns: ["項目", "Security Group (SG)", "Network ACL (NACL)"],
    rows: [
      { feature: "適用レベル", values: ["ENI（EC2等のインスタンス単位）", "サブネット単位（サブネット内の全リソース）"] },
      { feature: "状態管理", values: ["ステートフル（戻り通信は自動許可）", "ステートレス（インバウンド/アウトバウンド両方定義）"] },
      { feature: "ルール種別", values: ["許可（Allow）のみ", "許可（Allow）と拒否（Deny）の両方"] },
      { feature: "評価順序", values: ["全ルールを統合して評価", "ルール番号の小さい順に評価（一致したら終了）"] },
    ],
    decisionRule: "特定の悪意あるIPアドレスをブロックしたい場合は「NACL（またはAWS WAF）」を選択します。",
  },
  {
    id: "comp-elb",
    category: "ネットワーク",
    title: "ALB vs NLB vs GWLB",
    subtitle: "Elastic Load Balancing の選定基準",
    columns: ["項目", "ALB (Application)", "NLB (Network)", "GWLB (Gateway)"],
    rows: [
      { feature: "動作レイヤー", values: ["L7 (HTTP / HTTPS / gRPC)", "L4 (TCP / UDP / TLS)", "L3 (IPパケット / GENEVE)"] },
      { feature: "主な用途", values: ["Webアプリ、パス/ホストルーティング、認証連携", "超低レイテンシ、毎秒数百万リクエスト、固定IP", "サードパーティ製ファイアウォール/IDSアプライアンス"] },
      { feature: "静的IP / Elastic IP", values: ["非対応（DNS名のみ）", "対応（AZごとに固定IP/EIP割当可）", "非対応"] },
    ],
    decisionRule: "「WebのURLパスで振り分けたい」なら ALB、「TCP/UDPや固定IP・超低遅延」なら NLB。",
  },
  {
    id: "comp-messaging",
    category: "非同期・連携",
    title: "SQS vs SNS vs EventBridge vs Kinesis",
    subtitle: "疎結合・イベント駆動の使い分け",
    columns: ["サービス", "パターン", "主な特徴・用途"],
    rows: [
      { feature: "Amazon SQS", values: ["1対1 キュー (Pull型)", "メッセージのバッファリング、スパイク吸収、Worker間の負荷平準化"] },
      { feature: "Amazon SNS", values: ["1対多 Pub/Sub (Push型)", "複数サブスクライバ（SQS/Lambda/Email/HTTP）への一斉ファンアウト配信"] },
      { feature: "EventBridge", values: ["イベントバス (ルール型)", "AWSサービス/SaaSイベントの高度なフィルタリングとターゲットルーティング"] },
      { feature: "Kinesis Data Streams", values: ["リアルタイムストリーム", "IoT/ログ等の連続データを複数コンシューマが順序維持してリアルタイム処理"] },
    ],
    decisionRule: "「複数の後続処理に同時に同じイベントを配りつつ各処理を平準化」＝ SNS + SQS Fan-out パターン。",
  },
  {
    id: "comp-storage",
    category: "ストレージ",
    title: "S3 ストレージクラスの選定",
    subtitle: "アクセス頻度・取り出し時間とコストのバランス",
    columns: ["クラス", "取り出し時間", "最低保存期間", "適した用途"],
    rows: [
      { feature: "S3 Standard", values: ["ミリ秒", "なし", "頻繁にアクセスされるデータ"] },
      { feature: "S3 Intelligent-Tiering", values: ["ミリ秒（アーカイブ層除く）", "なし", "アクセスパターンが不明・変動するデータ"] },
      { feature: "S3 Standard-IA / One Zone-IA", values: ["ミリ秒", "30日", "アクセスは少ないが即時取得が必要（One Zoneは再生成可能データ向け）"] },
      { feature: "S3 Glacier Instant Retrieval", values: ["ミリ秒", "90日", "四半期に1回程度だがミリ秒で取り出したいアーカイブ"] },
      { feature: "S3 Glacier Flexible Retrieval", values: ["数分〜12時間", "90日", "年1〜2回のバックアップ・災害復旧（コスト重視）"] },
      { feature: "S3 Glacier Deep Archive", values: ["12〜48時間", "180日", "法令遵守等で7〜10年保管する最安アーカイブ"] },
    ],
    decisionRule: "「ミリ秒取得が必要だが年数回しか読まない」は Glacier Instant Retrieval。「12時間待てる長期保存」は Deep Archive。",
  },
  {
    id: "comp-db",
    category: "データベース",
    title: "RDS Multi-AZ vs Read Replica vs Aurora",
    subtitle: "可用性と読み取りスケーリングの違い",
    columns: ["構成", "レプリケーション", "主な目的", "フェイルオーバー"],
    rows: [
      { feature: "RDS Multi-AZ", values: ["同期（同一リージョン別AZ）", "高可用性（HA）", "自動フェイルオーバー（スタンバイは通常読み取り不可）"] },
      { feature: "RDS Read Replica", values: ["非同期（同リージョン/別リージョン）", "読み取り負荷分散・DR準備", "手動昇格が必要"] },
      { feature: "Amazon Aurora", values: ["3AZに6コピーを自動分散", "高性能・高可用性（MySQL/PostgreSQL互換）", "高速フェイルオーバー・最大15個のリードレプリカ"] },
    ],
    decisionRule: "「読み取りクエリの負荷を下げたい」なら Read Replica、「DB障害時に無停止に近く自動復旧したい」なら Multi-AZ。",
  },
];

export const saaPracticeQuestions: SaaQuestion[] = [
  {
    id: "q1",
    domainId: "domain-1",
    domainLabel: "Domain 1: セキュアなアーキテクチャ",
    difficulty: "基礎",
    question:
      "Amazon EC2 インスタンス上で動作するアプリケーションから Amazon S3 バケットへファイルをアップロードする必要があります。セキュリティのベストプラクティスとして最も適切な方法はどれですか？",
    options: [
      "IAM ユーザーのアクセスキーとシークレットキーを EC2 内の環境変数に設定する",
      "S3 バケットへのアクセス権限を持つ IAM ロールを作成し、EC2 インスタンスプロファイルとしてアタッチする",
      "S3 バケットポリシーで EC2 インスタンスのパブリック IP アドレスからの書き込みを許可する",
      "ルートアカウントの認証情報を使用して S3 API を呼び出す",
    ],
    correctIndex: 1,
    explanation:
      "EC2 から AWS サービスへアクセスする場合、静的なアクセスキーをインスタンス内に保存せず、IAM ロール（インスタンスプロファイル）を割り当てて STS による一時的な認証情報を自動ローテーションで取得するのがベストプラクティスです。",
    keywords: ["IAMロール", "一時的認証情報", "アクセスキー非保存"],
  },
  {
    id: "q2",
    domainId: "domain-1",
    domainLabel: "Domain 1: セキュアなアーキテクチャ",
    difficulty: "標準",
    question:
      "プライベートサブネット内の多数の EC2 インスタンスが、Amazon S3 上の巨大なデータセットを頻繁に読み書きしています。現在 NAT Gateway 経由で通信しているためデータ処理料金が高額になっています。インターネットを経由せずセキュアかつ最もコスト効率よくこの問題を解決する方法はどれですか？",
    options: [
      "VPC 内に Interface 型 VPC エンドポイント（AWS PrivateLink）を S3 用に作成する",
      "VPC 内に Gateway 型 VPC エンドポイントを S3 用に作成し、ルートテーブルを更新する",
      "NAT Gateway を NAT インスタンス（t3.micro）に置き換える",
      "EC2 インスタンスをパブリックサブネットに移動し、Internet Gateway 経由で通信させる",
    ],
    correctIndex: 1,
    explanation:
      "Amazon S3 と DynamoDB に対しては「Gateway 型 VPC エンドポイント」が無料で提供されており、時間課金やデータ処理課金がかかりません。Interface 型（PrivateLink）は時間・データ課金が発生するため、VPC 内からの S3 アクセス削減には Gateway 型が最適です。",
    keywords: ["Gateway型VPCエンドポイント", "S3", "NAT Gatewayコスト削減"],
  },
  {
    id: "q3",
    domainId: "domain-1",
    domainLabel: "Domain 1: セキュアなアーキテクチャ",
    difficulty: "標準",
    question:
      "企業は AWS Organizations を使用して複数の AWS アカウントを管理しています。開発者アカウントの管理者（AdministratorAccess を持つ IAM ユーザー）であっても、特定の高価な GPU インスタンスを起動したり、CloudTrail を無効化したりできないように強制したいと考えています。どの機能を使用すべきですか？",
    options: [
      "IAM アクセス境界（Permissions Boundary）を各 IAM ユーザーに手動設定する",
      "AWS Organizations のサービスコントロールポリシー（SCP）で該当操作を明示的に拒否（Deny）し、OU に適用する",
      "AWS Config ルールを設定し、違反リソースを検知してアラートメールを送る",
      "Amazon GuardDuty を有効化して不審な API コールをブロックする",
    ],
    correctIndex: 1,
    explanation:
      "AWS Organizations の SCP（サービスコントロールポリシー）は、アカウント内のルートユーザーや AdministratorAccess を持つ IAM ユーザーに対しても権限の上限（ガードレール）を強制できます。Config や GuardDuty は検知サービスであり予防的制限ではありません。",
    keywords: ["AWS Organizations", "SCP", "マルチアカウント統制"],
  },
  {
    id: "q4",
    domainId: "domain-2",
    domainLabel: "Domain 2: 弾力性に優れたアーキテクチャ",
    difficulty: "標準",
    question:
      "Web サイトで注文データを受け付ける際、セール期間中にトラフィックが急増するとバックエンドのデータベース処理が追いつかずタイムアウトが発生します。注文リクエストを失うことなく受け付け、バックエンドが処理可能なペースで非同期に処理できる疎結合アーキテクチャはどれですか？",
    options: [
      "ALB の背後に配置した Amazon SQS キューに注文を送信し、Auto Scaling する EC2 ワーカーがポーリングして処理する",
      "注文データを直接 Amazon RDS に書き込み、リードレプリカを増やす",
      "Amazon CloudFront で POST リクエストをキャッシュし、バックエンドへの到達を遅らせる",
      "Amazon SNS トピックから直接 Amazon RDS へデータを書き込む",
    ],
    correctIndex: 0,
    explanation:
      "Amazon SQS をバッファ（キュー）として前段に配置し、ワーカー層（EC2 / ECS / Lambda）が処理可能なペースでメッセージを取得・処理することで、急激なスパイクによる DB 過負荷を防ぎリクエストの取りこぼしも防止できます。",
    keywords: ["Amazon SQS", "疎結合", "スパイク吸収"],
  },
  {
    id: "q5",
    domainId: "domain-2",
    domainLabel: "Domain 2: 弾力性に優れたアーキテクチャ",
    difficulty: "応用",
    question:
      "あるミッションクリティカルなシステムでは、リージョン全体が停止した場合でも RTO（目標復旧時間）を数分以内、RPO（目標復旧時点）を数秒以内に抑える必要があります。かつ平時のコストは Active-Active 構成より抑えたい場合、最適な DR（ディザスタリカバリ）戦略はどれですか？",
    options: [
      "Backup and Restore（S3 への定期バックアップのみ維持し、障害時に環境を再構築）",
      "Pilot Light（セカンダリリージョンで最小構成のコアデータベースのみ同期稼働させ、障害時にアプリ層をスケールアウト）",
      "Multi-Site Active/Active（両リージョンで常にフルキャパシティで稼働）",
      "単一リージョン内での Multi-AZ 構成のみを維持する",
    ],
    correctIndex: 1,
    explanation:
      "Pilot Light はコアとなるデータベース（Aurora Global Database など）を常に稼働・レプリケーションさせておき、アプリサーバー等は障害時に起動・スケールさせる方式で、RPO/RTO を短く保ちつつ平時コストを抑えられます。単一リージョンの Multi-AZ はリージョン障害に対応できません。",
    keywords: ["DR戦略", "Pilot Light", "RTO/RPO"],
  },
  {
    id: "q6",
    domainId: "domain-3",
    domainLabel: "Domain 3: 高パフォーマンスなアーキテクチャ",
    difficulty: "基礎",
    question:
      "複数のアベイラビリティーゾーン（AZ）にまたがって稼働する多数の Linux EC2 インスタンスから、共通のディレクトリに同時に読み書きできる POSIX 準拠の共有ファイルシステムが必要です。運用負荷を最小限に抑えるマネージドサービスはどれですか？",
    options: [
      "Amazon EBS（gp3 ボリューム）",
      "Amazon EFS（Elastic File System）",
      "Amazon S3",
      "Amazon FSx for Windows File Server",
    ],
    correctIndex: 1,
    explanation:
      "Amazon EFS はサーバーレスで自動拡張する NFSv4 ベースの共有ファイルシステムであり、複数 AZ の多数の Linux EC2 / ECS / Lambda から同時にマウントして POSIX 互換のファイル操作が可能です。EBS は単一 AZ 限定、S3 はオブジェクトストレージ（POSIX非準拠）です。",
    keywords: ["Amazon EFS", "複数AZ共有", "POSIX/NFS"],
  },
  {
    id: "q7",
    domainId: "domain-3",
    domainLabel: "Domain 3: 高パフォーマンスなアーキテクチャ",
    difficulty: "標準",
    question:
      "グローバルに展開するオンラインゲームのバックエンドで、TCP および UDP プロトコルを使用する低レイテンシ通信が必要です。また、クライアント側のファイアウォール設定のために固定の Anycast IP アドレスを提供する必要があります。最適なサービスはどれですか？",
    options: [
      "Amazon CloudFront",
      "AWS Global Accelerator",
      "Application Load Balancer (ALB)",
      "Amazon Route 53 レイテンシールーティング",
    ],
    correctIndex: 1,
    explanation:
      "AWS Global Accelerator は 2 つの固定 Anycast IP アドレスを提供し、エッジロケーションから AWS のプライベートバックボーンネットワーク経由で最寄りのリージョンへ TCP/UDP トラフィックを高速転送します。CloudFront は HTTP/HTTPS 専用です。",
    keywords: ["Global Accelerator", "TCP/UDP", "固定Anycast IP"],
  },
  {
    id: "q8",
    domainId: "domain-4",
    domainLabel: "Domain 4: コストを最適化したアーキテクチャ",
    difficulty: "標準",
    question:
      "大量の画像ファイルを Amazon S3 に保存しています。アップロード直後は頻繁にアクセスされますが、30日以降はアクセス頻度が予測不能に変動します。手動の運用なしにストレージコストを自動的に最適化するにはどのストレージクラスを使うべきですか？",
    options: [
      "S3 Standard-IA",
      "S3 Intelligent-Tiering",
      "S3 Glacier Deep Archive",
      "S3 One Zone-IA",
    ],
    correctIndex: 1,
    explanation:
      "S3 Intelligent-Tiering はアクセスパターンを自動監視し、アクセス頻度に応じて「頻繁」「低頻度」「アーカイブインスタント」等の階層へ自動移動させます。取り出し料金も発生しないため、アクセスパターンが不明または変動するデータに最適です。",
    keywords: ["S3 Intelligent-Tiering", "コスト自動最適化", "アクセス頻度変動"],
  },
  {
    id: "q9",
    domainId: "domain-4",
    domainLabel: "Domain 4: コストを最適化したアーキテクチャ",
    difficulty: "基礎",
    question:
      "動画レンダリングのバッチ処理システムを構築しています。処理は中断されてもチェックポイントから再開可能であり、EC2 インスタンスの計算コストを最大限（最大90%程度）削減したいと考えています。どの EC2 購入オプションが最適ですか？",
    options: [
      "オンデマンドインスタンス",
      "EC2 スポットインスタンス",
      "専用ホスト (Dedicated Hosts)",
      "スタンダードリザーブドインスタンス（1年契約）",
    ],
    correctIndex: 1,
    explanation:
      "EC2 スポットインスタンスは AWS の未使用キャパシティを利用することでオンデマンド比最大90%の割引を受けられます。2分前の通知で中断される可能性がありますが、中断・再開に耐えられるステートレス/バッチ処理には最もコスト効率が高い選択肢です。",
    keywords: ["スポットインスタンス", "耐障害バッチ", "最大コスト削減"],
  },
];

export const saaOfficialResources: SaaOfficialResource[] = [
  {
    title: "AWS Certified Solutions Architect – Associate 公式試験ページ",
    description: "最新の試験概要、試験ガイド（PDF）、サンプル問題、受験予約への公式ポータル。",
    url: "https://aws.amazon.com/jp/certification/certified-solutions-architect-associate/",
    badge: "AWS公式",
  },
  {
    title: "AWS Skill Builder (公式デジタル学習プラットフォーム)",
    description: "SAA-C03 対応の公式模擬試験（Official Practice Question Set）や無料デジタルトレーニングを提供。",
    url: "https://explore.skillbuilder.aws/learn",
    badge: "無料演習あり",
  },
  {
    title: "AWS Well-Architected フレームワーク",
    description: "SAA-C03 の4ドメインの土台となる「運用上の優秀性・セキュリティ・信頼性・パフォーマンス効率・コスト最適化・持続可能性」の6本の柱。",
    url: "https://aws.amazon.com/jp/architecture/well-architected/",
    badge: "設計思想",
  },
  {
    title: "AWS アーキテクチャセンター",
    description: "リファレンスアーキテクチャ図やベストプラクティス集。本番問題の構成パターン理解に役立ちます。",
    url: "https://aws.amazon.com/jp/architecture/",
    badge: "構成図集",
  },
];
