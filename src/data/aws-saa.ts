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

export interface SaaQuickLookupItem {
  keyword: string;
  category: string;
  recommended: string;
  reason: string;
}

export interface SaaQuestion {
  id: string;
  domainId: string;
  domainLabel: string;
  difficulty: "基礎" | "標準" | "応用";
  selectCount: 1 | 2; // 1 = 択一, 2 = 2つ選択
  question: string;
  options: string[];
  correctIndices: number[];
  explanation: string;
  keywords: string[];
}

export interface SaaOfficialResource {
  title: string;
  description: string;
  url: string;
  badge: string;
}

export interface SaaArchitecturePattern {
  id: string;
  title: string;
  badge: string;
  flow: string[];
  summary: string;
  keyDesignPoints: string[];
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
      "出題比率最大の30%。IAMの最小権限設計、VPCの境界防御、データの暗号化（保管時・転送時）、監査・脅威検知、マルチアカウント統制が問われます。",
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
        title: "暗号化・鍵管理・シークレット保護",
        services: ["AWS KMS", "Secrets Manager", "Parameter Store", "ACM", "S3 Encryption"],
        keyPoints: [
          "Secrets Manager は RDS などの認証情報の「自動ローテーション」に対応（Parameter Store は自動ローテーション非対応）",
          "KMS のカスタマーマネージドキー (CMK) は鍵のローテーション制御やクロスアカウント共有・詳細なアクセス制御が可能",
          "ACM（AWS Certificate Manager）は ALB や CloudFront に統合して SSL/TLS 証明書を無料発行・自動更新する",
        ],
        examTip: "「DBパスワードの自動ローテーション」＝ Secrets Manager。「証明書の自動更新」＝ ACM。",
      },
      {
        id: "d1-audit",
        title: "監査ログ・脅威検知・コンプライアンス",
        services: ["CloudTrail", "AWS Config", "Amazon GuardDuty", "Amazon Macie", "Security Hub", "Inspector"],
        keyPoints: [
          "CloudTrail は誰がいつどの API を呼んだかを記録（操作監査）。AWS Config はリソースの設定変更履歴とルール準拠を記録",
          "GuardDuty は VPC フローログ・DNS ログ・CloudTrail を分析して不正アクセスや暗号資産マイニング等の脅威を検知",
          "Amazon Macie は S3 バケット内の PII（個人情報・機密データ）を機械学習で自動検出し、Inspector は EC2/ECR/Lambda の脆弱性をスキャン",
        ],
        examTip: "「誰が削除したか追跡」＝ CloudTrail。「設定準拠チェック」＝ Config。「S3内の個人情報検出」＝ Macie。",
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
        services: ["ALB", "NLB", "EC2 Auto Scaling", "RDS Multi-AZ"],
        keyPoints: [
          "RDS Multi-AZ は同期レプリケーションでスタンバイを維持し、障害時に自動フェイルオーバー（可用性向上・読み取り分散は不可）",
          "ALB は L7（HTTP/HTTPS、パス/ホストベースルーティング）、NLB は L4（超低レイテンシ、固定IP、TCP/UDP）",
          "Auto Scaling の予測スケーリング（Predictive）は過去のトラフィック傾向を学習し、スパイク前に先回りでインスタンスを起動する",
        ],
        examTip: "「読み取り負荷分散」は Read Replica、「自動フェイルオーバー」は Multi-AZ。「固定IPが必要」なELBは NLB。",
      },
      {
        id: "d2-dns-routing",
        title: "Route 53 ルーティングポリシーとマルチリージョン制御",
        services: ["Route 53", "Route 53 Health Check", "Alias Record"],
        keyPoints: [
          "フェイルオーバールーティング＋ヘルスチェックで、プライマリリージョン障害時にセカンダリへ自動切り替え",
          "レイテンシールーティングはユーザーに最も遅延の少ないリージョンへ案内。位置情報（Geolocation）は国・地域制限やコンプライアンス向け",
          "加重（Weighted）ルーティングはカナリアリリースやブルー/グリーン展開のトラフィック比率制御に活用",
        ],
        examTip: "「特定国のユーザーを自国リージョンに固定（コンプライアンス）」＝ 位置情報（Geolocation）。「最速応答」＝ レイテンシ。",
      },
      {
        id: "d2-decoupling",
        title: "疎結合アーキテクチャと非同期処理",
        services: ["Amazon SQS", "Amazon SNS", "EventBridge", "Step Functions", "API Gateway"],
        keyPoints: [
          "SQS は 1対1 のキューイング（スパイク吸収・バックプレッシャー対策）。順序厳密かつ重複排除なら FIFO キュー",
          "SNS は 1対多の Pub/Sub ファンアウト。SNS トピック → 複数の SQS キューへの Fan-out パターンは頻出",
          "Step Functions は複数 Lambda や ECS タスクのワークフロー制御（リトライ・分岐・最大1年間の状態保持）に最適",
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
        id: "d3-db",
        title: "データベース最適化（RDB / NoSQL / 分析）",
        services: ["Aurora", "DynamoDB", "DAX", "Redshift", "OpenSearch"],
        keyPoints: [
          "DynamoDB はミリ秒単位のキーバリュー/ドキュメントDB。マイクロ秒の読み取りキャッシュが必要なら DAX (DynamoDB Accelerator)",
          "DynamoDB のホットパーティション対策はカーディナリティの高いパーティションキー選定。別軸検索には GSI（グローバルセカンダリインデックス）",
          "Aurora Serverless v2 は予測不能・断続的なワークロードに対し、キャパシティを瞬時に自動スケール。分析(OLAP)は Redshift、全文検索は OpenSearch",
        ],
        examTip: "「DynamoDB でマイクロ秒レスポンス」＝ DAX。「数TB〜PBのSQL集計/BI分析」＝ Redshift。",
      },
      {
        id: "d3-compute",
        title: "コンピューティング最適化（サーバーレス / コンテナ / HPC）",
        services: ["AWS Lambda", "ECS / Fargate", "EKS", "AWS Batch", "Placement Groups"],
        keyPoints: [
          "Lambda は最大実行時間15分・メモリ最大10GB。15分を超えるバッチや長時間コンテナ処理は ECS on Fargate / AWS Batch を選択",
          "EC2 クラスタープレイスメントグループは同一 AZ 内の近接配置により、HPC 等で超低レイテンシ・高スループットを実現",
          "スプレッドプレイスメントグループは各インスタンスを異なるハードウェアに分散配置し、同時障害リスクを低減（最大7台/AZ）",
        ],
        examTip: "「15分以上の処理」で Lambda を除外し Fargate/Batch を選ぶ問題は定番。「HPC低遅延」＝ クラスタープレイスメントグループ。",
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
        id: "d4-storage-cost",
        title: "S3・EBS ストレージ階層化とライフサイクル",
        services: ["S3 Intelligent-Tiering", "S3 Glacier", "S3 Lifecycle", "EBS gp3"],
        keyPoints: [
          "アクセスパターンが不明・変化するデータは S3 Intelligent-Tiering が自動で最適階層へ移動（取り出し料金なし）",
          "S3 ライフサイクルルールで古いオブジェクトを Glacier Flexible / Deep Archive へ自動移行、または不完全なマルチパートアップロードを自動削除",
          "EBS は旧世代 gp2 より gp3 の方が約20%安価で、IOPS とスループットを容量と独立してプロビジョニング可能",
        ],
        examTip: "「アクセス頻度不明」＝ Intelligent-Tiering。「7年保存で年1回未満」＝ Glacier Deep Archive。",
      },
      {
        id: "d4-network-cost",
        title: "データ転送料金・NAT Gateway コストの削減",
        services: ["Gateway VPC Endpoint", "CloudFront", "Same-AZ Placement"],
        keyPoints: [
          "NAT Gateway は時間課金＋データ処理課金がかかる。Private Subnet から S3/DynamoDB へは無料の Gateway型 VPC エンドポイントを使うと大幅削減",
          "インターネット向けの大容量配信では S3 直接配信より CloudFront 経由の方がインターネット転送料単価が安く、キャッシュヒット時はオリジン転送もゼロ",
          "同一 AZ 内のプライベート IP 通信は無料だが、異なる AZ 間の通信にはデータ転送料（GB単位）が発生する",
        ],
        examTip: "「NAT Gateway のコストが高い原因が S3 への大量転送」→ Gateway型 VPC エンドポイントを追加！",
      },
      {
        id: "d4-governance-cost",
        title: "コスト可視化・予算管理・異常検知",
        services: ["AWS Budgets", "Cost Explorer", "Cost Anomaly Detection", "Trusted Advisor"],
        keyPoints: [
          "AWS Budgets はコストや使用量がしきい値を超えた（または予測された）際に SNS/Email 通知や自動 IAM 制限アクションを実行",
          "Cost Explorer は過去の利用傾向の可視化と将来予測、リザーブド/Savings Plans の推奨購入額を提示",
          "AWS Cost Anomaly Detection は機械学習で予期せぬコスト急増を自動検知しアラート通知",
        ],
        examTip: "「予算超過の事前アラート・自動制限」＝ AWS Budgets。「異常スパイクの自動検知」＝ Cost Anomaly Detection。",
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
    id: "comp-vpc-connect",
    category: "ネットワーク",
    title: "VPC Peering vs Transit Gateway vs PrivateLink",
    subtitle: "VPC間・オンプレミス・サービス間の接続設計",
    columns: ["方式", "接続トポロジ", "主な特徴・制約"],
    rows: [
      { feature: "VPC Peering", values: ["1対1（非推移的）", "少数VPCの低コスト直結。10個以上増えるとフルメッシュ管理が煩雑"] },
      { feature: "AWS Transit Gateway", values: ["ハブ＆スポーク", "数十〜数千のVPCとSite-to-Site VPN/Direct Connectを一元接続"] },
      { feature: "AWS PrivateLink", values: ["サービス公開（単方向）", "CIDR重複があっても安全に特定サービスのみ公開・接続可能"] },
    ],
    decisionRule: "「多数のVPCを一元ハブで接続」＝ Transit Gateway。「CIDR重複環境でサービスだけ公開」＝ PrivateLink。",
  },
  {
    id: "comp-global-accel",
    category: "ネットワーク",
    title: "CloudFront vs Global Accelerator vs S3 Transfer Acceleration",
    subtitle: "グローバルユーザーのアクセス高速化",
    columns: ["サービス", "プロトコル", "キャッシュ", "主な用途"],
    rows: [
      { feature: "Amazon CloudFront", values: ["HTTP / HTTPS", "エッジでキャッシュ", "Webサイト、画像/動画配信、APIレスポンス高速化"] },
      { feature: "AWS Global Accelerator", values: ["TCP / UDP", "なし（経路最適化）", "ゲーム/IoT/VoIP、固定Anycast IP、瞬時フェイルオーバー"] },
      { feature: "S3 Transfer Acceleration", values: ["HTTP / HTTPS", "なし（エッジ経由アップロード）", "遠隔地からS3バケットへの大容量ファイルアップロード高速化"] },
    ],
    decisionRule: "「静的コンテンツをエッジにキャッシュ」＝ CloudFront。「非HTTPや固定IP」＝ Global Accelerator。",
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
    id: "comp-storage-types",
    category: "ストレージ",
    title: "EBS vs EFS vs FSx vs S3",
    subtitle: "ストレージ4種別のアーキテクチャ選定",
    columns: ["サービス", "種別", "アクセス元", "適したワークロード"],
    rows: [
      { feature: "Amazon EBS", values: ["ブロックストレージ", "単一AZの単一EC2", "OSルートボリューム、高IOPSデータベース (io2)"] },
      { feature: "Amazon EFS", values: ["NFS共有ファイル (Linux)", "複数AZの多数EC2/ECS/Lambda", "CMS共有ファイル、コンテナ永続共有ストレージ"] },
      { feature: "Amazon FSx", values: ["マネージド専用ファイル", "Windows(SMB) / Lustre(HPC)", "AD連携Windowsファイル共有、機械学習/HPC高速演算"] },
      { feature: "Amazon S3", values: ["オブジェクトストレージ", "HTTPS API (どこからでも)", "静的資産、データレイク、バックアップ、静的Webホスティング"] },
    ],
    decisionRule: "「複数AZのLinuxでマウント共有」＝ EFS。「Windows/SMB/AD」＝ FSx for Windows。「11個の9の耐久性」＝ S3。",
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

export const saaQuickLookup: SaaQuickLookupItem[] = [
  {
    keyword: "DBパスワードの自動ローテーション",
    category: "セキュリティ",
    recommended: "AWS Secrets Manager",
    reason: "RDS / Aurora / Redshift 等の認証情報ローテーションをネイティブに自動化可能。",
  },
  {
    keyword: "S3 バケット内の個人情報 (PII) 自動検出",
    category: "セキュリティ",
    recommended: "Amazon Macie",
    reason: "機械学習を用いて S3 内の機密データ・個人情報をスキャンして可視化。",
  },
  {
    keyword: "特定IPアドレスの通信拒否 (Deny)",
    category: "セキュリティ",
    recommended: "Network ACL / AWS WAF",
    reason: "Security Group は Allow のみ。IP拒否は NACL（VPC層）または WAF（L7層）。",
  },
  {
    keyword: "NAT Gateway の S3 転送コスト削減",
    category: "コスト最適化",
    recommended: "Gateway 型 VPC エンドポイント",
    reason: "S3 / DynamoDB への通信を無料のプライベート経路へ逃がせる。",
  },
  {
    keyword: "15分を超えるサーバーレス/コンテナ処理",
    category: "コンピュート",
    recommended: "ECS on Fargate / AWS Batch",
    reason: "Lambda の最大実行時間は15分のため、長時間処理はコンテナまたは Batch。",
  },
  {
    keyword: "DynamoDB のマイクロ秒レベル読み取り",
    category: "データベース",
    recommended: "DynamoDB Accelerator (DAX)",
    reason: "DynamoDB API 互換のインメモリキャッシュによりミリ秒→マイクロ秒へ高速化。",
  },
  {
    keyword: "複数AZ・多数のLinuxから同時マウント",
    category: "ストレージ",
    recommended: "Amazon EFS",
    reason: "POSIX準拠のフルマネージド NFS。EBS は単一AZ・原則単一EC2限定。",
  },
  {
    keyword: "Windows SMB 共有 + Active Directory 連携",
    category: "ストレージ",
    recommended: "Amazon FSx for Windows File Server",
    reason: "NTFS / SMB / AD統合にネイティブ対応したマネージドファイルサーバー。",
  },
  {
    keyword: "スパイク吸収・バックエンドDB保護",
    category: "疎結合",
    recommended: "Amazon SQS",
    reason: "リクエストをキューにバッファリングし、ワーカーが処理可能な速度で処理。",
  },
  {
    keyword: "固定Anycast IP + TCP/UDP グローバル高速化",
    category: "ネットワーク",
    recommended: "AWS Global Accelerator",
    reason: "CloudFront は HTTP/HTTPS 専用。非HTTPや固定IPが必要な場合は Global Accelerator。",
  },
  {
    keyword: "複数アカウントの最大権限を一括制限 (Admin含む)",
    category: "セキュリティ",
    recommended: "AWS Organizations (SCP)",
    reason: "SCP はメンバーアカウント内のルートや管理者にも適用される予防的ガードレール。",
  },
  {
    keyword: "1つのイベントを複数の後続システムへ同時並列配信",
    category: "疎結合",
    recommended: "Amazon SNS + SQS (Fan-out)",
    reason: "SNS トピックへ発行し、各処理専用の SQS キューにサブスクライブさせる。",
  },
  {
    keyword: "RPO数秒・RTO数分でリージョン障害対策（コスト抑制）",
    category: "弾力性・DR",
    recommended: "Pilot Light (Aurora Global Database 等)",
    reason: "コアDBのみセカンダリで同期稼働させ、障害時にアプリ層を起動・スケールする。",
  },
  {
    keyword: "アクセスパターン不明・変動する S3 コスト最適化",
    category: "コスト最適化",
    recommended: "S3 Intelligent-Tiering",
    reason: "アクセス頻度を自動監視して最適階層へ移動し、取り出し料金もかからない。",
  },
  {
    keyword: "中断可能だが最大90%コスト削減したいバッチ処理",
    category: "コスト最適化",
    recommended: "EC2 スポットインスタンス",
    reason: "未使用キャパシティを活用。チェックポイントから再開可能なワークロードに最適。",
  },
  {
    keyword: "HPC 向けの超低レイテンシ・インスタンス間高速通信",
    category: "コンピュート",
    recommended: "クラスタープレイスメントグループ",
    reason: "同一 AZ 内の近接したハードウェア上に EC2 を配置しネットワーク帯域を最大化。",
  },
];

export const saaPracticeQuestions: SaaQuestion[] = [
  {
    id: "q1",
    domainId: "domain-1",
    domainLabel: "Domain 1: セキュアなアーキテクチャ",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "Amazon EC2 インスタンス上で動作するアプリケーションから Amazon S3 バケットへファイルをアップロードする必要があります。セキュリティのベストプラクティスとして最も適切な方法はどれですか？",
    options: [
      "IAM ユーザーのアクセスキーとシークレットキーを EC2 内の環境変数に設定する",
      "S3 バケットへのアクセス権限を持つ IAM ロールを作成し、EC2 インスタンスプロファイルとしてアタッチする",
      "S3 バケットポリシーで EC2 インスタンスのパブリック IP アドレスからの書き込みを許可する",
      "ルートアカウントの認証情報を使用して S3 API を呼び出す",
    ],
    correctIndices: [1],
    explanation:
      "EC2 から AWS サービスへアクセスする場合、静的なアクセスキーをインスタンス内に保存せず、IAM ロール（インスタンスプロファイル）を割り当てて STS による一時的な認証情報を自動ローテーションで取得するのがベストプラクティスです。",
    keywords: ["IAMロール", "一時的認証情報", "アクセスキー非保存"],
  },
  {
    id: "q2",
    domainId: "domain-1",
    domainLabel: "Domain 1: セキュアなアーキテクチャ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "プライベートサブネット内の多数の EC2 インスタンスが、Amazon S3 上の巨大なデータセットを頻繁に読み書きしています。現在 NAT Gateway 経由で通信しているためデータ処理料金が高額になっています。インターネットを経由せずセキュアかつ最もコスト効率よくこの問題を解決する方法はどれですか？",
    options: [
      "VPC 内に Interface 型 VPC エンドポイント（AWS PrivateLink）を S3 用に作成する",
      "VPC 内に Gateway 型 VPC エンドポイントを S3 用に作成し、ルートテーブルを更新する",
      "NAT Gateway を NAT インスタンス（t3.micro）に置き換える",
      "EC2 インスタンスをパブリックサブネットに移動し、Internet Gateway 経由で通信させる",
    ],
    correctIndices: [1],
    explanation:
      "Amazon S3 と DynamoDB に対しては「Gateway 型 VPC エンドポイント」が無料で提供されており、時間課金やデータ処理課金がかかりません。Interface 型（PrivateLink）は時間・データ課金が発生するため、VPC 内からの S3 アクセス削減には Gateway 型が最適です。",
    keywords: ["Gateway型VPCエンドポイント", "S3", "NAT Gatewayコスト削減"],
  },
  {
    id: "q3",
    domainId: "domain-1",
    domainLabel: "Domain 1: セキュアなアーキテクチャ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "企業は AWS Organizations を使用して複数の AWS アカウントを管理しています。開発者アカウントの管理者（AdministratorAccess を持つ IAM ユーザー）であっても、特定の高価な GPU インスタンスを起動したり、CloudTrail を無効化したりできないように強制したいと考えています。どの機能を使用すべきですか？",
    options: [
      "IAM アクセス境界（Permissions Boundary）を各 IAM ユーザーに手動設定する",
      "AWS Organizations のサービスコントロールポリシー（SCP）で該当操作を明示的に拒否（Deny）し、OU に適用する",
      "AWS Config ルールを設定し、違反リソースを検知してアラートメールを送る",
      "Amazon GuardDuty を有効化して不審な API コールをブロックする",
    ],
    correctIndices: [1],
    explanation:
      "AWS Organizations の SCP（サービスコントロールポリシー）は、アカウント内のルートユーザーや AdministratorAccess を持つ IAM ユーザーに対しても権限の上限（ガードレール）を強制できます。Config や GuardDuty は検知サービスであり予防的制限ではありません。",
    keywords: ["AWS Organizations", "SCP", "マルチアカウント統制"],
  },
  {
    id: "q4",
    domainId: "domain-1",
    domainLabel: "Domain 1: セキュアなアーキテクチャ",
    difficulty: "標準",
    selectCount: 2,
    question:
      "Amazon S3 バケットに顧客の機密ドキュメントを保管しています。意図しないパブリック公開や暗号化されていないオブジェクトの保存を防ぎ、さらにバケット内に個人情報（PII）が含まれていないか自動検出したいと考えています。採用すべき組み合わせを【2つ】選んでください。",
    options: [
      "S3 バケットおよびアカウントレベルで「S3 パブリックアクセスブロック」を有効化する",
      "Amazon GuardDuty を有効にして S3 内のテキストファイルを全文解析する",
      "Amazon Macie を有効化して S3 バケット内の機密データ・個人情報を自動検出する",
      "Network ACL を設定して S3 バケットへの HTTP 接続を拒否する",
      "EC2 セキュリティグループで S3 のアウトバウンドポートを制限する",
    ],
    correctIndices: [0, 2],
    explanation:
      "S3 の意図しない公開防止には「S3 パブリックアクセスブロック」が最も確実です。また、S3 バケット内の PII（個人情報）検出には Amazon Macie を使用します（GuardDuty は不審な API やアクセスパターンの脅威検知であり、ファイル内容の PII 検出ではありません）。",
    keywords: ["S3パブリックアクセスブロック", "Amazon Macie", "複数選択"],
  },
  {
    id: "q5",
    domainId: "domain-2",
    domainLabel: "Domain 2: 弾力性に優れたアーキテクチャ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Web サイトで注文データを受け付ける際、セール期間中にトラフィックが急増するとバックエンドのデータベース処理が追いつかずタイムアウトが発生します。注文リクエストを失うことなく受け付け、バックエンドが処理可能なペースで非同期に処理できる疎結合アーキテクチャはどれですか？",
    options: [
      "ALB の背後に配置した Amazon SQS キューに注文を送信し、Auto Scaling する EC2 ワーカーがポーリングして処理する",
      "注文データを直接 Amazon RDS に書き込み、リードレプリカを増やす",
      "Amazon CloudFront で POST リクエストをキャッシュし、バックエンドへの到達を遅らせる",
      "Amazon SNS トピックから直接 Amazon RDS へデータを書き込む",
    ],
    correctIndices: [0],
    explanation:
      "Amazon SQS をバッファ（キュー）として前段に配置し、ワーカー層（EC2 / ECS / Lambda）が処理可能なペースでメッセージを取得・処理することで、急激なスパイクによる DB 過負荷を防ぎリクエストの取りこぼしも防止できます。",
    keywords: ["Amazon SQS", "疎結合", "スパイク吸収"],
  },
  {
    id: "q6",
    domainId: "domain-2",
    domainLabel: "Domain 2: 弾力性に優れたアーキテクチャ",
    difficulty: "応用",
    selectCount: 1,
    question:
      "あるミッションクリティカルなシステムでは、リージョン全体が停止した場合でも RTO（目標復旧時間）を数分以内、RPO（目標復旧時点）を数秒以内に抑える必要があります。かつ平時のコストは Active-Active 構成より抑えたい場合、最適な DR（ディザスタリカバリ）戦略はどれですか？",
    options: [
      "Backup and Restore（S3 への定期バックアップのみ維持し、障害時に環境を再構築）",
      "Pilot Light（セカンダリリージョンで最小構成のコアデータベースのみ同期稼働させ、障害時にアプリ層をスケールアウト）",
      "Multi-Site Active/Active（両リージョンで常にフルキャパシティで稼働）",
      "単一リージョン内での Multi-AZ 構成のみを維持する",
    ],
    correctIndices: [1],
    explanation:
      "Pilot Light はコアとなるデータベース（Aurora Global Database など）を常に稼働・レプリケーションさせておき、アプリサーバー等は障害時に起動・スケールさせる方式で、RPO/RTO を短く保ちつつ平時コストを抑えられます。単一リージョンの Multi-AZ はリージョン障害に対応できません。",
    keywords: ["DR戦略", "Pilot Light", "RTO/RPO"],
  },
  {
    id: "q7",
    domainId: "domain-2",
    domainLabel: "Domain 2: 弾力性に優れたアーキテクチャ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "注文イベントが発生した際、「在庫引き当て」「メール通知」「分析データ保存」の3つの独立したマイクロサービスへ同時に同じイベントを配信し、各サービスが自身のペースで確実に処理できるようにしたいと考えています。最も適切な AWS 構成はどれですか？",
    options: [
      "1つの Amazon SQS キューに3つのマイクロサービスを接続して競合消費させる",
      "Amazon SNS トピックにイベントを送信し、3つの Amazon SQS キューをサブスクライブさせる（Fan-out 構成）",
      "Application Load Balancer でパスごとに3つの EC2 へ同時複製する",
      "Amazon RDS のトリガーから直接3つの外部 API を同期呼び出しする",
    ],
    correctIndices: [1],
    explanation:
      "1対多の配信と各バックエンドの非同期バッファリングを両立する王道パターンが「SNS + SQS Fan-out」です。1つの SQS キューを複数サービスで共有すると、誰か1つがメッセージを削除してしまい全サービスに届きません。",
    keywords: ["SNS + SQS Fan-out", "1対多配信", "疎結合"],
  },
  {
    id: "q8",
    domainId: "domain-2",
    domainLabel: "Domain 2: 弾力性に優れたアーキテクチャ",
    difficulty: "基礎",
    selectCount: 2,
    question:
      "Amazon RDS for PostgreSQL を本番運用しています。AZ（アベイラビリティーゾーン）障害時の自動フェイルオーバーによる高可用性と、ダッシュボード系クエリによる読み取り負荷の分散の両方を実現したい場合、設定すべき構成を【2つ】選んでください。",
    options: [
      "RDS インスタンスで Multi-AZ 配置を有効化する",
      "RDS インスタンスのストレージタイプを gp3 から io2 に変更する",
      "RDS のリードレプリカ（Read Replica）を作成し、参照系クエリを振り向ける",
      "EC2 上にセルフマネージドのスタンドアロン PostgreSQL を構築する",
      "RDS スナップショットを毎時 S3 へエクスポートする",
    ],
    correctIndices: [0, 2],
    explanation:
      "RDS Multi-AZ はスタンバイ機を同期維持して障害時の自動フェイルオーバー（高可用性）を担いますが、スタンバイは読み取りに使えません。読み取り負荷の分散には別途リードレプリカ（非同期）を作成します。",
    keywords: ["RDS Multi-AZ", "リードレプリカ", "複数選択"],
  },
  {
    id: "q9",
    domainId: "domain-3",
    domainLabel: "Domain 3: 高パフォーマンスなアーキテクチャ",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "複数のアベイラビリティーゾーン（AZ）にまたがって稼働する多数の Linux EC2 インスタンスから、共通のディレクトリに同時に読み書きできる POSIX 準拠の共有ファイルシステムが必要です。運用負荷を最小限に抑えるマネージドサービスはどれですか？",
    options: [
      "Amazon EBS（gp3 ボリューム）",
      "Amazon EFS（Elastic File System）",
      "Amazon S3",
      "Amazon FSx for Windows File Server",
    ],
    correctIndices: [1],
    explanation:
      "Amazon EFS はサーバーレスで自動拡張する NFSv4 ベースの共有ファイルシステムであり、複数 AZ の多数の Linux EC2 / ECS / Lambda から同時にマウントして POSIX 互換のファイル操作が可能です。EBS は単一 AZ 限定、S3 はオブジェクトストレージ（POSIX非準拠）です。",
    keywords: ["Amazon EFS", "複数AZ共有", "POSIX/NFS"],
  },
  {
    id: "q10",
    domainId: "domain-3",
    domainLabel: "Domain 3: 高パフォーマンスなアーキテクチャ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "グローバルに展開するオンラインゲームのバックエンドで、TCP および UDP プロトコルを使用する低レイテンシ通信が必要です。また、クライアント側のファイアウォール設定のために固定の Anycast IP アドレスを提供する必要があります。最適なサービスはどれですか？",
    options: [
      "Amazon CloudFront",
      "AWS Global Accelerator",
      "Application Load Balancer (ALB)",
      "Amazon Route 53 レイテンシールーティング",
    ],
    correctIndices: [1],
    explanation:
      "AWS Global Accelerator は 2 つの固定 Anycast IP アドレスを提供し、エッジロケーションから AWS のプライベートバックボーンネットワーク経由で最寄りのリージョンへ TCP/UDP トラフィックを高速転送します。CloudFront は HTTP/HTTPS 専用です。",
    keywords: ["Global Accelerator", "TCP/UDP", "固定Anycast IP"],
  },
  {
    id: "q11",
    domainId: "domain-3",
    domainLabel: "Domain 3: 高パフォーマンスなアーキテクチャ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Amazon DynamoDB をバックエンドに使用するモバイルアプリで、新キャンペーン開始に伴い読み取りトラフィックが急増し、数ミリ秒のレイテンシをさらに「マイクロ秒」レベルまで短縮しつつ、既存の DynamoDB API 呼び出しコードの変更を最小限に抑えたいと考えています。最適な選択はどれですか？",
    options: [
      "Amazon ElastiCache for Memcached を導入し、アプリ側でキャッシュ制御ロジックを書き直す",
      "Amazon DynamoDB Accelerator (DAX) クラスターを前段に配置する",
      "DynamoDB のグローバルテーブルを有効化する",
      "Amazon Redshift にデータをコピーして参照させる",
    ],
    correctIndices: [1],
    explanation:
      "DAX (DynamoDB Accelerator) は DynamoDB 専用のフルマネージド・インメモリキャッシュであり、DynamoDB と API 互換性があるため、クライアントのエンドポイントを変更するだけでマイクロ秒レベルの読み取り性能を実現できます。",
    keywords: ["DynamoDB", "DAX", "マイクロ秒キャッシュ"],
  },
  {
    id: "q12",
    domainId: "domain-3",
    domainLabel: "Domain 3: 高パフォーマンスなアーキテクチャ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "動画ファイルのエンコード処理を実行するサーバーレスパイプラインを設計しています。1ファイルあたりの処理時間は平均 25〜40 分かかります。サーバー管理の手間を最小限に抑えつつこの処理を実行する最適なコンピューティングサービスはどれですか？",
    options: [
      "AWS Lambda（メモリ 10GB 設定）",
      "Amazon ECS on AWS Fargate",
      "Amazon API Gateway 統合レスポンス",
      "Amazon CloudFront Functions",
    ],
    correctIndices: [1],
    explanation:
      "AWS Lambda の最大実行時間は 15 分であるため、25〜40 分かかる処理はタイムアウトします。サーバー管理不要（サーバーレス）で長時間コンテナを実行できる Amazon ECS on AWS Fargate（または AWS Batch）が最適です。",
    keywords: ["AWS Fargate", "Lambda 15分制限", "長時間バッチ"],
  },
  {
    id: "q13",
    domainId: "domain-4",
    domainLabel: "Domain 4: コストを最適化したアーキテクチャ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "大量の画像ファイルを Amazon S3 に保存しています。アップロード直後は頻繁にアクセスされますが、30日以降はアクセス頻度が予測不能に変動します。手動の運用なしにストレージコストを自動的に最適化するにはどのストレージクラスを使うべきですか？",
    options: [
      "S3 Standard-IA",
      "S3 Intelligent-Tiering",
      "S3 Glacier Deep Archive",
      "S3 One Zone-IA",
    ],
    correctIndices: [1],
    explanation:
      "S3 Intelligent-Tiering はアクセスパターンを自動監視し、アクセス頻度に応じて「頻繁」「低頻度」「アーカイブインスタント」等の階層へ自動移動させます。取り出し料金も発生しないため、アクセスパターンが不明または変動するデータに最適です。",
    keywords: ["S3 Intelligent-Tiering", "コスト自動最適化", "アクセス頻度変動"],
  },
  {
    id: "q14",
    domainId: "domain-4",
    domainLabel: "Domain 4: コストを最適化したアーキテクチャ",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "動画レンダリングのバッチ処理システムを構築しています。処理は中断されてもチェックポイントから再開可能であり、EC2 インスタンスの計算コストを最大限（最大90%程度）削減したいと考えています。どの EC2 購入オプションが最適ですか？",
    options: [
      "オンデマンドインスタンス",
      "EC2 スポットインスタンス",
      "専用ホスト (Dedicated Hosts)",
      "スタンダードリザーブドインスタンス（1年契約）",
    ],
    correctIndices: [1],
    explanation:
      "EC2 スポットインスタンスは AWS の未使用キャパシティを利用することでオンデマンド比最大90%の割引を受けられます。2分前の通知で中断される可能性がありますが、中断・再開に耐えられるステートレス/バッチ処理には最もコスト効率が高い選択肢です。",
    keywords: ["スポットインスタンス", "耐障害バッチ", "最大コスト削減"],
  },
  {
    id: "q15",
    domainId: "domain-4",
    domainLabel: "Domain 4: コストを最適化したアーキテクチャ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "コンプライアンス要件により、監査ログを最低 7 年間保管する必要があります。普段このデータにアクセスすることはほぼありませんが、監査時には最大 12〜48 時間以内に取り出せれば許容されます。最もストレージコストを抑えられる S3 ストレージクラスはどれですか？",
    options: [
      "S3 Standard-IA",
      "S3 Glacier Instant Retrieval",
      "S3 Glacier Flexible Retrieval",
      "S3 Glacier Deep Archive",
    ],
    correctIndices: [3],
    explanation:
      "S3 Glacier Deep Archive は 12〜48 時間での取り出しを許容する代わりに、S3 の中で最も低いストレージ単価（長期アーカイブ向け、最低保存期間180日）を提供します。",
    keywords: ["Glacier Deep Archive", "7年保管", "最安アーカイブ"],
  },
  {
    id: "q16",
    domainId: "domain-4",
    domainLabel: "Domain 4: コストを最適化したアーキテクチャ",
    difficulty: "応用",
    selectCount: 1,
    question:
      "複数の AWS リージョンや異なるインスタンスファミリー（EC2）に加えて、今後 AWS Fargate や AWS Lambda への移行も検討しています。今後 1〜3 年間の継続的なコンピューティング利用に対して、アーキテクチャ変更の柔軟性を維持しつつ大幅なコスト削減を実現できる割引プランはどれですか？",
    options: [
      "スタンダードリザーブドインスタンス (Standard RI)",
      "Compute Savings Plans",
      "EC2 Instance Savings Plans",
      "オンデマンドキャパシティ予約",
    ],
    correctIndices: [1],
    explanation:
      "Compute Savings Plans はインスタンスファミリー・サイズ・OS・リージョンを問わず適用でき、さらに EC2 だけでなく AWS Fargate や AWS Lambda の利用料金にも自動的に割引が適用されるため、最も柔軟性が高い割引オプションです。",
    keywords: ["Compute Savings Plans", "Fargate/Lambda適用", "柔軟なコスト最適化"],
  },
  {
    id: "q17",
    domainId: "domain-1",
    domainLabel: "Domain 1: セキュアなアーキテクチャ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "有料会員向けの動画・PDF コンテンツを Amazon S3 に保存し、Amazon CloudFront 経由で世界中に配信しています。未認証ユーザーの S3 バケットへの直接アクセスを防ぎつつ、ログイン済み会員のみが一定時間だけ複数ファイルへアクセスできるようにする最適な構成はどれですか？",
    options: [
      "S3 バケットをパブリック公開し、アプリケーション側でランダムなファイル名を生成する",
      "CloudFront に OAC (Origin Access Control) を設定して S3 直接アクセスを遮断し、CloudFront の署名付き Cookie を発行する",
      "各会員に個別の IAM ユーザーを作成し、S3 へのアクセスキーを配布する",
      "S3 バケットポリシーで会員の自宅 IP アドレスをすべて手作業で許可する",
    ],
    correctIndices: [1],
    explanation:
      "S3 への直接アクセスを遮断するには CloudFront の OAC (Origin Access Control) を使用します。また、有料会員向けに複数の保護されたファイルへのアクセス制御を行う場合は、CloudFront の署名付き Cookie（単一ファイルなら署名付き URL）が最適です。",
    keywords: ["CloudFront OAC", "署名付きCookie", "限定コンテンツ配信"],
  },
  {
    id: "q18",
    domainId: "domain-2",
    domainLabel: "Domain 2: 弾力性に優れたアーキテクチャ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "グローバルなニュースサイトを運用しており、欧州・北米・アジアの3リージョンに環境を構築しています。EU のデータ保護規制により、フランスおよびドイツからのアクセスは必ず欧州リージョン（eu-central-1）にルーティングし、他の地域のユーザーは最寄りのリージョンへ案内したい場合、Amazon Route 53 でどのルーティングポリシーを組み合わせるべきですか？",
    options: [
      "シンプルルーティングのみ",
      "位置情報ルーティング（Geolocation）を使用して国・地域ごとにエンドポイントを指定する",
      "複数値回答ルーティング（Multivalue Answer）",
      "加重ルーティング（Weighted）で均等分散する",
    ],
    correctIndices: [1],
    explanation:
      "コンプライアンスや地域限定のコンテンツ制御など「ユーザーの地理的位置（国・大陸）に基づいて必ず特定リージョンへルーティングする」要件には、Route 53 の位置情報ルーティング（Geolocation）を使用します（レイテンシベースは遅延最小化目的であり地域固定には使いません）。",
    keywords: ["Route 53", "位置情報ルーティング", "データレジデンシー"],
  },
  {
    id: "q19",
    domainId: "domain-3",
    domainLabel: "Domain 3: 高パフォーマンスなアーキテクチャ",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "毎日数億件のクリックストリームログ（Parquet 形式）が Amazon S3 に蓄積されています。サーバーやクラスターのプロビジョニング・管理を一切行わず、必要なときだけ S3 上のファイルに対して直接標準 SQL クエリを実行してアドホック分析したい場合、最も適切なサービスはどれですか？",
    options: [
      "Amazon Redshift プロビジョンドクラスター",
      "Amazon Athena",
      "Amazon EMR（常時稼働クラスター）",
      "Amazon RDS for MySQL",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Athena はサーバーレスのインタラクティブクエリサービスで、インフラ管理不要で S3 上のデータ（Parquet/JSON/CSV 等）に対して標準 SQL を直接実行し、スキャンしたデータ量に応じた従量課金で利用できます。",
    keywords: ["Amazon Athena", "サーバーレスSQL", "S3直接分析"],
  },
  {
    id: "q20",
    domainId: "domain-4",
    domainLabel: "Domain 4: コストを最適化したアーキテクチャ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Amazon S3 バケットに対して大容量ファイルのマルチパートアップロードが頻繁に行われていますが、ネットワーク切断等で中断された「不完全なマルチパートアップロード」のパーツが大量に残り、不要なストレージ課金が発生しています。運用負荷なくこのコストを削減する方法はどれですか？",
    options: [
      "AWS Lambda 関数を毎時間起動し、全バケットのパーツをスキャンして削除する",
      "S3 ライフサイクルルールを設定し、開始から一定日数（例：7日）経過した不完全なマルチパートアップロードを自動削除する",
      "S3 Intelligent-Tiering を有効にしてパーツを別階層へ移動させる",
      "S3 バージョニングを無効化する",
    ],
    correctIndices: [1],
    explanation:
      "S3 ライフサイクルポリシーの「不完全なマルチパートアップロードの削除（AbortIncompleteMultipartUpload）」アクションを設定するだけで、指定日数後に未完了パーツが自動クリーンアップされ、追加の開発や運用コストなしでストレージ課金を削減できます。",
    keywords: ["S3ライフサイクル", "マルチパートアップロード削除", "不要コスト削減"],
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

export const saaArchitecturePatterns: SaaArchitecturePattern[] = [
  {
    id: "pat-web-3tier",
    title: "高可用性 Web 3層アーキテクチャ",
    badge: "王道パターン",
    flow: ["Route 53", "CloudFront + WAF", "ALB (Public)", "Auto Scaling (Private)", "RDS Multi-AZ (Private)"],
    summary: "SPOF（単一障害点）を排除し、静的配信キャッシュと L7 防御、Multi-AZ データベースを組み合わせた標準的な Web 基盤。",
    keyDesignPoints: [
      "アプリ層と DB 層はプライベートサブネットに配置し、外部からの直接アクセスを遮断",
      "静的コンテンツは S3 + CloudFront (OAC) へオフロードしてオリジン負荷と転送料を削減",
    ],
  },
  {
    id: "pat-serverless-api",
    title: "サーバーレス REST API 構成",
    badge: "運用最小化",
    flow: ["API Gateway", "AWS Lambda", "DynamoDB (+ DAX)", "S3 (静的UI)"],
    summary: "サーバー管理ゼロでリクエスト数に応じて自動スケールし、使った分だけ課金されるイベント駆動 API 構成。",
    keyDesignPoints: [
      "Lambda の最大実行時間（15分）を超える処理は Step Functions 分割または ECS on Fargate へ逃がす",
      "Private Subnet 内から S3/DynamoDB へアクセスする場合は Gateway 型 VPC エンドポイントを使用",
    ],
  },
  {
    id: "pat-decoupled-fanout",
    title: "疎結合 Fan-out 非同期処理構成",
    badge: "耐障害・平準化",
    flow: ["API / Producer", "Amazon SNS", "複数 SQS キュー", "ECS / Lambda Worker", "DLQ (退避)"],
    summary: "1つのイベントを複数の独立システムへ同時配信しつつ、各ワーカーの処理速度に合わせてスパイクを平準化する構成。",
    keyDesignPoints: [
      "SQS に DLQ（デッドレターキュー）を設定し、繰り返し失敗するメッセージを隔離して調査可能にする",
      "厳密な順序保証・重複排除が必要な場合のみ FIFO トピック＋FIFO キューを選択",
    ],
  },
  {
    id: "pat-hybrid-secure",
    title: "オンプレミス連携 & マルチアカウント統制",
    badge: "エンタープライズ",
    flow: ["オンプレミス", "Direct Connect (+ VPN予備)", "Transit Gateway", "共有サービス / アプリ VPC"],
    summary: "多数の VPC とオンプレミス拠点を有線専用線（冗長化あり）でハブ接続し、Organizations + SCP で統制する構成。",
    keyDesignPoints: [
      "Direct Connect の冗長化には複数ロケーション接続、またはコスト重視のバックアップとして Site-to-Site VPN を併用",
      "Transit Gateway により VPC 間のフルメッシュピアリング管理を解消",
    ],
  },
];
