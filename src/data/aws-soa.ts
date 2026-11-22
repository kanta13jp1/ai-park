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

// 出典: AWS Certified CloudOps Engineer - Associate (SOA-C03) 公式試験ガイド
// https://docs.aws.amazon.com/ja_jp/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html
export const soaExamFacts: SaaExamFact[] = [
  { label: "試験コード", value: "SOA-C03", detail: "Associate レベル・旧SysOps改定" },
  { label: "試験時間", value: "130 分", detail: "約2時間10分" },
  { label: "問題数", value: "65 問", detail: "採点50問 + 非採点15問" },
  { label: "合格ライン", value: "720 点", detail: "100〜1000点スケール" },
  {
    label: "出題形式",
    value: "択一 / 複数",
    detail: "運用監視・自動修復・IaC・ネットワークトラブルシュート",
  },
  { label: "受験料", value: "$150 USD", detail: "ピアソンVUE / オンライン可" },
];

export const soaDomains: SaaDomain[] = [
  {
    id: "soa-domain-1",
    number: 1,
    title: "モニタリング、ロギング、分析、修復、パフォーマンス最適化",
    englishTitle: "Monitoring, Logging, Analysis, Remediation, and Performance Optimization",
    weight: 22,
    accentColor: "indigo",
    summary:
      "出題比率 22%。旧 SOA-C02（2025年9月29日終了）の後継である SOA-C03 において、CloudWatch によるメトリクス/ログ収集、複合アラーム、EventBridge・Systems Manager による自動修復、パフォーマンス/コスト適正化が問われます。",
    topics: [
      {
        id: "soa-d1-monitoring",
        title: "CloudWatch メトリクス・エージェント・ログ収集と複合アラーム",
        services: [
          "Amazon CloudWatch",
          "CloudWatch Agent",
          "CloudWatch Logs",
          "CloudWatch Composite Alarms",
          "CloudWatch Synthetics",
          "AWS X-Ray",
        ],
        keyPoints: [
          "EC2 の標準メトリクスにはメモリ使用率やディスク空き容量が含まれないため、OS レベルの指標やログ収集には CloudWatch Agent を導入する",
          "CloudWatch Logs のメトリクスフィルターでログ内のエラー文字列を数値メトリクス化してアラーム化し、サブスクリプションフィルターで Lambda や Kinesis へリアルタイム転送できる",
          "CloudWatch Composite Alarms は複数の子アラームを AND / OR / NOT 条件で結合してアラートノイズを抑制し、CloudWatch Synthetics は Canary スクリプトで外形監視を行う",
        ],
        examTip:
          "「EC2 のメモリ/ディスク監視」＝ CloudWatch Agent、「複数条件を満たした時のみ通知」＝ Composite Alarms、「外形監視」＝ Synthetics。",
      },
      {
        id: "soa-d1-remediation",
        title: "イベント駆動の自動修復・運用監査（CloudTrail / EventBridge / SSM）",
        services: [
          "AWS CloudTrail",
          "Amazon EventBridge",
          "SSM Automation",
          "SSM OpsCenter",
          "AWS Health Dashboard",
        ],
        keyPoints: [
          "AWS CloudTrail は誰が・いつ・どの API を呼び出したかを記録し、EventBridge ルールと組み合わせることで不正変更や特定 API 実行を即座に検知できる",
          "EventBridge でアラーム状態変化やリソースイベントを受け取り、SSM Automation（Runbook）や AWS Lambda を起動して再起動・隔離・設定是正を自動修復できる",
          "AWS Health Dashboard は自身のアカウントに影響する AWS サービス障害やハードウェアメンテナンス予定を通知し、SSM OpsCenter はアラームから OpsItem を起票して調査を集約する",
        ],
        examTip:
          "「障害/設定違反の自動修復」＝ EventBridge + SSM Automation。「ハードウェア交換予定の事前検知と自動退避」＝ AWS Health Dashboard + EventBridge。",
      },
      {
        id: "soa-d1-performance",
        title: "パフォーマンス分析・ライトサイジング・運用最適化",
        services: [
          "AWS Compute Optimizer",
          "AWS Trusted Advisor",
          "Performance Insights",
          "CloudWatch Logs Insights",
          "S3 Storage Lens",
        ],
        keyPoints: [
          "AWS Compute Optimizer は CloudWatch メトリクス履歴を分析し、EC2・EBS・Lambda・ECS on Fargate の過剰/過少プロビジョニングを検出してライトサイジングを提案する",
          "RDS / Aurora の SQL ボトルネックや待機イベント分析には Performance Insights、大量ログの対話的な集計分析には CloudWatch Logs Insights を使用する",
          "AWS Trusted Advisor はアイドル状態のリソースやセキュリティ推奨事項を点検し、S3 Storage Lens は組織全体の S3 利用状況と未完了マルチパート等を可視化する",
        ],
        examTip:
          "「CloudWatch メトリクスに基づくサイズ適正化提案」＝ Compute Optimizer、「DB 待機イベント・負荷 SQL 特定」＝ Performance Insights。",
      },
    ],
  },
  {
    id: "soa-domain-2",
    number: 2,
    title: "信頼性と事業継続性",
    englishTitle: "Reliability and Business Continuity",
    weight: 22,
    accentColor: "emerald",
    summary:
      "出題比率 22%。Auto Scaling の Warm Pools やライフサイクルフックによる可用性制御、RDS/Aurora のフェイルオーバー・接続管理、AWS Backup・DLM・S3 CRR によるバックアップと災害復旧（DR）が問われます。",
    topics: [
      {
        id: "soa-d2-scaling",
        title: "EC2 Auto Scaling・ELB ヘルスチェックとスケーリング設計",
        services: [
          "EC2 Auto Scaling",
          "Auto Scaling Warm Pools",
          "Lifecycle Hooks",
          "ALB / NLB",
          "Amazon ElastiCache",
        ],
        keyPoints: [
          "Auto Scaling Warm Pools は事前に初期化済みインスタンスを待機させ、起動直後のソフト導入やウォームアップに時間を要するアプリのスケールアウトを高速化する",
          "Lifecycle Hooks は起動時（Pending:Wait）や終了時（Terminating:Wait）に待機状態を設け、インスタンス削除前のログ退避や設定処理を確実に完了させる",
          "ALB 配下の Auto Scaling グループでは ELB ヘルスチェックを有効化してアプリ応答異常を自動置換し、DB 読み取り負荷軽減には Amazon ElastiCache を前段に配置する",
        ],
        examTip:
          "「スケールアウト起動時間短縮」＝ Warm Pools、「インスタンス終了前のスクリプト/ログ退避」＝ Lifecycle Hooks。",
      },
      {
        id: "soa-d2-backup-dr",
        title: "バックアップ自動化・スナップショット管理と DR（RPO / RTO）",
        services: [
          "AWS Backup",
          "Amazon DLM",
          "S3 CRR",
          "S3 Versioning",
          "AWS Fault Injection Service",
        ],
        keyPoints: [
          "AWS Backup は EBS・RDS・DynamoDB・EFS・S3 のバックアップ計画を一元管理し、クロスリージョン/クロスアカウントコピーや Backup Vault Lock による改ざん防止に対応する",
          "Amazon DLM（Data Lifecycle Manager）はタグベースで EBS スナップショットや EBS バックアップ AMI の定期作成・保持期間・自動削除を軽量に管理する",
          "S3 CRR（クロスリージョンレプリケーション）は送信元・送信先両バケットで S3 Versioning 有効化が必須（既存ファイルには S3 Batch Replication を併用）。耐障害性テストには Fault Injection Service を使用する",
        ],
        examTip:
          "「複数サービスの統合バックアップ＋改ざん防止」＝ AWS Backup。「EBS スナップショット/AMI の自動ローテーションのみ」＝ Amazon DLM。",
      },
      {
        id: "soa-d2-db-ha",
        title: "データベース高可用性・Multi-AZ・フェイルオーバー運用",
        services: [
          "RDS Multi-AZ",
          "RDS Read Replica",
          "Aurora Global Database",
          "RDS Proxy",
          "Amazon EFS",
        ],
        keyPoints: [
          "RDS Multi-AZ は別 AZ のスタンバイへ同期レプリケーションして障害時に自動フェイルオーバーするが、通常の読み取り分散は不可（読み取り負荷分散には Read Replica を作成）",
          "Aurora Global Database は通常 1 秒未満で別リージョンへストレージ複製し、リージョン障害時の RPO 数秒・RTO 1 分未満の高速昇格を実現する",
          "Amazon RDS Proxy はサーバーレス等からの大量 DB 接続をプーリングし、コネクション枯渇回避とフェイルオーバー時間短縮を支援する。共有 POSIX ファイルには Amazon EFS を利用する",
        ],
        examTip:
          "「Lambda からの DB コネクション枯渇・フェイルオーバー時間短縮」＝ RDS Proxy。「リージョン間 DR で高速昇格」＝ Aurora Global Database。",
      },
    ],
  },
  {
    id: "soa-domain-3",
    number: 3,
    title: "デプロイ、プロビジョニング、自動化",
    englishTitle: "Deployment, Provisioning, and Automation",
    weight: 22,
    accentColor: "amber",
    summary:
      "出題比率 22%。CloudFormation のドリフト検出・変更セット・StackSets・DeletionPolicy による IaC 運用、AWS CDK や Terraform の活用、Systems Manager によるフリート全体のパッチ適用と構成管理が問われます。",
    topics: [
      {
        id: "soa-d3-iac",
        title: "IaC プロビジョニング・ドリフト検出・マルチアカウント展開",
        services: [
          "AWS CloudFormation",
          "CloudFormation Drift Detection",
          "CloudFormation StackSets",
          "AWS CDK",
          "Terraform",
          "AWS Service Catalog",
        ],
        keyPoints: [
          "CloudFormation Change Sets で更新前の変更影響を事前確認し、DeletionPolicy（Retain / Snapshot）でスタック削除時のデータベースや S3 の誤削除を防止する",
          "CloudFormation Drift Detection により、スタック外で手動変更されたセキュリティグループや設定の差分（ドリフト）を検出する。複数アカウント・リージョン展開には StackSets を使う",
          "AWS CDK はプログラミング言語から CloudFormation を生成し、Terraform はマルチクラウド環境を State ファイルで管理する。AWS Service Catalog は承認済みテンプレートを社内へセルフサービス配布する",
        ],
        examTip:
          "「スタック外の手動変更発見」＝ CloudFormation Drift Detection。「マルチアカウント/リージョン一括展開」＝ StackSets。「承認済み構成のセルフサービス提供」＝ Service Catalog。",
      },
      {
        id: "soa-d3-ssm-ops",
        title: "Systems Manager による構成管理・パッチ適用・デプロイ自動化",
        services: [
          "AWS Systems Manager",
          "SSM Patch Manager",
          "SSM Run Command",
          "SSM State Manager",
          "EC2 Image Builder",
          "AWS CodeDeploy",
        ],
        keyPoints: [
          "SSM Patch Manager とメンテナンスウィンドウを組み合わせ、対象 EC2 フリートの OS/ソフトパッチ適用を業務影響のない時間帯で自動実行し準拠レポートを取得する",
          "SSM Run Command は複数インスタンスへアドホックなスクリプトを実行し、SSM State Manager は定期スケジュールでソフトウェア状態やエージェント設定を望ましい状態へ維持する",
          "EC2 Image Builder でゴールデン AMI の構築・テスト・配布を自動化し、AWS CodeDeploy で EC2/ECS/Lambda への Blue/Green・Canary デプロイと異常時自動ロールバックを実現する",
        ],
        examTip:
          "「一度きりの一括コマンド実行」＝ Run Command、「定期的な望ましい状態維持」＝ State Manager、「OS パッチ＋コンプライアンス報告」＝ Patch Manager。",
      },
    ],
  },
  {
    id: "soa-domain-4",
    number: 4,
    title: "セキュリティとコンプライアンス",
    englishTitle: "Security and Compliance",
    weight: 16,
    accentColor: "cyan",
    summary:
      "出題比率 16%。IAM Access Analyzer による過剰権限の検出、AWS Config・Security Hub・GuardDuty を用いた継続的な準拠チェックと自動修復、Session Manager や S3 Object Lock・Access Points による保護が問われます。",
    topics: [
      {
        id: "soa-d4-iam-compliance",
        title: "IAM アクセス制御・コンプライアンス評価・脅威検知",
        services: [
          "IAM Access Analyzer",
          "AWS Config",
          "AWS Security Hub",
          "Amazon GuardDuty",
          "Amazon Inspector",
          "AWS Organizations / SCP",
        ],
        keyPoints: [
          "IAM Access Analyzer は外部アカウントやパブリックに意図せず共有されている S3・IAM ロール・KMS キー等を検出し、CloudTrail ログからの最小権限ポリシー生成も支援する",
          "AWS Config はリソースの設定変更履歴を記録し、ルール違反（未暗号化 EBS やパブリック SG 等）を検知すると SSM Automation と連携して自動修復を実行できる",
          "AWS Security Hub は GuardDuty（脅威検知）・Inspector（CVE 脆弱性診断）・Config の検出結果を集約する。AWS Organizations SCP はメンバーアカウントの管理者も含め最大権限を制限する",
        ],
        examTip:
          "「外部共有されたリソース検出」＝ IAM Access Analyzer、「設定違反検知＋自動修復」＝ AWS Config、「複数セキュリティ検知の一元統合」＝ Security Hub。",
      },
      {
        id: "soa-d4-data-secrets",
        title: "データ保護・WORM 不変性・シークレットと接続管理",
        services: [
          "SSM Session Manager",
          "Parameter Store",
          "Secrets Manager",
          "AWS KMS",
          "S3 Object Lock",
          "S3 Access Points",
        ],
        keyPoints: [
          "SSM Session Manager により、インバウンド SSH/RDP ポートや踏み台サーバーなしでプライベートサブネットの EC2 へ接続し、操作セッションログを S3 や CloudWatch Logs へ保存できる",
          "RDS 認証情報の自動ローテーションには Secrets Manager、コストを抑えた階層型設定値の保管には Systems Manager Parameter Store を選択する。クロスアカウント暗号化には KMS CMK を利用する",
          "S3 Object Lock の Compliance モードはルートユーザーを含め保持期間内の削除・上書きを禁止する。S3 Access Points は利用者ごとに専用の権限と VPC 制限を分割してバケットポリシー肥大化を防ぐ",
        ],
        examTip:
          "「SSH ポート開放なし＋コマンド履歴監査」＝ Session Manager、「ルートも削除不可の WORM」＝ S3 Object Lock (Compliance)、「巨大な S3 バケットポリシーの分割」＝ S3 Access Points。",
      },
    ],
  },
  {
    id: "soa-domain-5",
    number: 5,
    title: "ネットワーキングとコンテンツ配信",
    englishTitle: "Networking and Content Delivery",
    weight: 18,
    accentColor: "indigo",
    summary:
      "出題比率 18%。VPC Flow Logs や Reachability Analyzer を用いた疎通障害の切り分け、AWS Network Firewall の境界検査、Route 53 Resolver によるハイブリッド DNS、Transit Gateway や CloudFront OAC 配信が問われます。",
    topics: [
      {
        id: "soa-d5-vpc-troubleshoot",
        title: "VPC 接続トラブルシュート・境界検査・マルチ VPC 接続",
        services: [
          "VPC Flow Logs",
          "VPC Reachability Analyzer",
          "AWS Network Firewall",
          "AWS Transit Gateway",
          "VPC Endpoint",
          "Security Group / NACL",
        ],
        keyPoints: [
          "VPC Flow Logs は ENI・サブネット・VPC レベルの ACCEPT/REJECT メタデータを記録し、VPC Reachability Analyzer は実トラフィックを流さず設定を静的解析して SG/NACL/ルート表の遮断箇所を特定する",
          "Security Group はステートフル（Allow のみ）、Network ACL はステートレス（Allow と Deny をルール番号順に評価）。L7 ドメインフィルタや IPS には AWS Network Firewall を利用する",
          "多数の VPC やオンプレミス（VPN/Direct Connect）のハブ接続には Transit Gateway を用い、S3/DynamoDB への無料プライベート接続には Gateway 型 VPC Endpoint（その他は Interface 型）を使用する",
        ],
        examTip:
          "「疎通不可の原因ルール（SG/NACL/ルート）を静的診断」＝ VPC Reachability Analyzer、「通信拒否履歴の集計」＝ VPC Flow Logs。",
      },
      {
        id: "soa-d5-dns-cdn",
        title: "ハイブリッド DNS（Route 53 Resolver）とエッジコンテンツ配信",
        services: [
          "Amazon Route 53",
          "Route 53 Resolver",
          "Amazon CloudFront",
          "CloudFront OAC",
          "AWS WAF",
          "AWS Global Accelerator",
        ],
        keyPoints: [
          "Route 53 Resolver の Inbound エンドポイントはオンプレミスから VPC プライベートホストゾーンへの解決を受け付け、Outbound エンドポイント＋転送ルールは VPC からオンプレミス DNS へクエリを転送する",
          "Amazon CloudFront で S3 オリジンを配信する際は CloudFront OAC（Origin Access Control）を設定し、バケットポリシーで CloudFront 以外からの S3 直接アクセスを遮断する",
          "L7 Web 攻撃・IP/レート制限には AWS WAF を CloudFront や ALB に適用し、TCP/UDP 通信の高速化と固定 Anycast IP が必要な場合は AWS Global Accelerator を使用する",
        ],
        examTip:
          "「オンプレ→VPC 名前解決」＝ Route 53 Resolver Inbound、「VPC→オンプレ名前解決」＝ Outbound。「S3 直接アクセス遮断」＝ CloudFront OAC。",
      },
    ],
  },
];

export const soaComparisons: SaaComparisonTable[] = [
  {
    id: "soa-comp-cw-tools",
    category: "非同期・連携",
    title: "CloudWatch 機能群の使い分け（Metrics / Alarms / Logs / Agent / Synthetics / X-Ray）",
    subtitle: "OS 指標収集・ログ分析・複合アラーム・外形監視・分散トレースの比較",
    columns: ["機能 / サービス", "収集・監視対象", "SOA-C03 試験での選定基準"],
    rows: [
      {
        feature: "CloudWatch Agent",
        values: [
          "EC2/オンプレミスの OS レベル指標（メモリ使用率・ディスク空き容量）とカスタムログ",
          "標準メトリクスにメモリ/ディスク容量は含まれないため必須（IAM ロール権限が必要）",
        ],
      },
      {
        feature: "CloudWatch Logs (Metric Filter / Subscription Filter / Logs Insights)",
        values: [
          "ログパターンのメトリクス化 / リアルタイム転送 / 対話クエリ分析",
          "エラー件数のアラーム化は Metric Filter、Lambda/Kinesis 連携は Subscription Filter、アドホック集計は Logs Insights",
        ],
      },
      {
        feature: "CloudWatch Composite Alarms",
        values: [
          "複数の子アラームを AND / OR / NOT 論理式で結合（1複合あたり最大100個）",
          "複数指標の同時異常時のみ通知してアラート疲れ（誤検知）を抑制",
        ],
      },
      {
        feature: "CloudWatch Synthetics",
        values: [
          "Canary（Node.js / Python スクリプト）による定期的な外形監視",
          "エンドポイントの死活、API 応答、画面表示やリンク切れの自動検知",
        ],
      },
      {
        feature: "AWS X-Ray",
        values: [
          "分散トレーシングとサービスマップによる遅延可視化",
          "マイクロサービス/Lambda 間のボトルネックや下流エラー箇所の特定",
        ],
      },
    ],
    decisionRule:
      "「EC2 のメモリ/ディスク監視」＝ CloudWatch Agent、「複合条件での通知抑制」＝ Composite Alarms、「定期外形監視」＝ Synthetics。",
  },
  {
    id: "soa-comp-audit-remediate",
    category: "非同期・連携",
    title: "イベント駆動の自動修復・監査（CloudTrail / EventBridge / SSM Automation / OpsCenter / Health）",
    subtitle: "API 操作証跡・AWS 障害通知・自動修復ランブックの連携",
    columns: ["サービス / 機能", "検知・トリガー内容", "主な運用・自動修復ユースケース"],
    rows: [
      {
        feature: "AWS CloudTrail",
        values: [
          "誰が・いつ・どの API を呼んだかの操作履歴（管理イベント / データイベント）",
          "不正な SG 変更やリソース削除の監査追跡、EventBridge 連携による即時通知",
        ],
      },
      {
        feature: "Amazon EventBridge",
        values: [
          "AWS サービス状態変化・CloudTrail API・Config 評価・スケジュールイベント",
          "ルールでイベントをフィルタリングし、Lambda・SSM Automation・SNS へ自動ルーティング",
        ],
      },
      {
        feature: "SSM Automation",
        values: [
          "Runbook（SSM ドキュメント）に基づく運用手順の自動実行",
          "インスタンス再起動、AMI 作成、非準拠リソースの修復をイベント駆動で自動化",
        ],
      },
      {
        feature: "SSM OpsCenter",
        values: [
          "CloudWatch アラームや EventBridge から自動起票される運用作業項目（OpsItem）",
          "障害発生時の関連リソース・設定変更・Runbook 実行を1画面に集約",
        ],
      },
      {
        feature: "AWS Health Dashboard",
        values: [
          "アカウントに影響する AWS サービス障害・予定メンテナンス（EBS 交換等）通知",
          "EventBridge でメンテナンス通知を受け取り、事前退避や運用チーム通知を自動化",
        ],
      },
    ],
    decisionRule:
      "「異常イベントを契機に Runbook で自動修復」＝ EventBridge + SSM Automation。「AWS ハードウェア保守予定の検知」＝ AWS Health Dashboard。",
  },
  {
    id: "soa-comp-ssm",
    category: "コンピュート",
    title: "AWS Systems Manager (SSM) 主要機能の使い分け",
    subtitle: "踏み台レス接続・パッチ管理・状態維持・パラメータ管理・ゴールデンイメージ",
    columns: ["SSM 機能 / 関連サービス", "主な役割", "試験での選定ポイント"],
    rows: [
      {
        feature: "SSM Session Manager",
        values: [
          "SSH (Port 22)/RDP/踏み台サーバー不要のブラウザ・CLI 対話シェル接続",
          "IAM で接続制御し、全操作セッションログを S3 / CloudWatch Logs へ監査記録",
        ],
      },
      {
        feature: "SSM Run Command",
        values: [
          "タグやインスタンス ID 指定で複数 EC2・ハイブリッドノードへコマンド一括実行",
          "アドホックな調査コマンド実行やエージェント設定配布に最適（SSH 不要）",
        ],
      },
      {
        feature: "SSM Patch Manager",
        values: [
          "パッチベースラインとメンテナンスウィンドウによる OS/ソフトパッチ自動適用",
          "適用状況のコンプライアンスダッシュボード可視化と再起動スケジュール制御",
        ],
      },
      {
        feature: "SSM State Manager",
        values: [
          "定義した関連付けスケジュールでインスタンス設定を継続的に維持・是正",
          "CloudWatch Agent 導入状態やウイルス対策ソフト稼働などの望ましい状態維持",
        ],
      },
      {
        feature: "SSM Parameter Store",
        values: [
          "設定値や暗号化文字列（KMS 連携）の階層型キーバリュー保存",
          "Standard（4KB/1万件）は無料。Secrets Manager と異なり自動ローテーション非対応",
        ],
      },
      {
        feature: "EC2 Image Builder",
        values: [
          "ゴールデン AMI・コンテナイメージの作成・パッチ適用・自動テスト・配布",
          "最新パッチ済み AMI をパイプライン化し、複数アカウント/リージョンへ展開",
        ],
      },
    ],
    decisionRule:
      "「Port 22 なしで SSH 代替＋操作ログ記録」＝ SSM Session Manager、「定期的な OS 構成維持」＝ SSM State Manager、「パッチ自動適用」＝ SSM Patch Manager。",
  },
  {
    id: "soa-comp-iac",
    category: "コンピュート",
    title: "IaC・デプロイ自動化（CloudFormation / CDK / Terraform / Service Catalog / CodeDeploy）",
    subtitle: "構成ドリフト検出・安全なスタック更新・マルチアカウント展開",
    columns: ["サービス / 機能", "特徴・仕組み", "運用・トラブルシュート上の重要ポイント"],
    rows: [
      {
        feature: "AWS CloudFormation (Change Sets / DeletionPolicy)",
        values: [
          "Change Sets で更新影響の事前プレビュー。DeletionPolicy (Retain/Snapshot) で誤削除防止",
          "ロールバック原因調査はイベントログや cfn-init / cfn-signal タイムアウトを確認",
        ],
      },
      {
        feature: "CloudFormation Drift Detection",
        values: [
          "スタック管理リソースに対してスタック外で行われた手動変更を検出",
          "コンソール等で誰かが SG ルールを変更した際の差分特定に使用（自動修復はしない）",
        ],
      },
      {
        feature: "CloudFormation StackSets",
        values: [
          "単一テンプレートを複数 AWS アカウント・複数リージョンへ一括展開・更新",
          "Organizations 連携により新規メンバーアカウントへの自動デプロイにも対応",
        ],
      },
      {
        feature: "AWS CDK vs Terraform",
        values: [
          "CDK は TypeScript/Python 等で CloudFormation テンプレートを生成する AWS ネイティブツール",
          "Terraform は HCL 構文と State ファイルを用い、マルチクラウドやサードパーティ SaaS も統一管理",
        ],
      },
      {
        feature: "AWS Service Catalog",
        values: [
          "承認済み CloudFormation テンプレートを製品ポートフォリオとして統制配布",
          "利用者へ強い IAM 権限を与えずに起動制約ロールで安全なセルフサービスプロビジョニングを実現",
        ],
      },
      {
        feature: "AWS CodeDeploy",
        values: [
          "EC2/Auto Scaling/ECS/Lambda への In-place・Blue/Green・Canary デプロイ自動化",
          "CloudWatch アラーム連動による自動ロールバックでデプロイ失敗時の影響を局所化",
        ],
      },
    ],
    decisionRule:
      "「スタック外の手動設定変更を検出」＝ CloudFormation Drift Detection、「承認済み構成のみ利用者に公開」＝ Service Catalog。",
  },
  {
    id: "soa-comp-scaling",
    category: "コンピュート",
    title: "Auto Scaling・ELB・キャッシュの運用とスケール制御",
    subtitle: "Warm Pools・Lifecycle Hooks・ヘルスチェック・キャッシュ",
    columns: ["機能 / サービス", "動作・特徴", "運用設計での使い分け"],
    rows: [
      {
        feature: "EC2 Auto Scaling (Target Tracking / Predictive)",
        values: [
          "ターゲット追跡は目標指標（CPU/ALB リクエスト数）維持、予測スケーリングはスパイク前起動",
          "ELB ヘルスチェックを有効化することでアプリ応答異常のインスタンスも自動置換",
        ],
      },
      {
        feature: "Auto Scaling Warm Pools",
        values: [
          "ソフト導入・初期化完了済みの EC2 を Stopped/Hibernated 等で事前待機",
          "起動スクリプトが重いアプリケーションのスケールアウト所要時間を大幅短縮",
        ],
      },
      {
        feature: "Lifecycle Hooks",
        values: [
          "Pending:Wait / Terminating:Wait 状態でカスタム処理完了まで遷移を一時停止",
          "スケールインで終了する前にログを S3 へ退避、またはカスタム登録解除を実行",
        ],
      },
      {
        feature: "ALB / NLB",
        values: [
          "ALB は L7（HTTP ヘルスチェック・パスルーティング）、NLB は L4（固定 IP・超低遅延）",
          "Deregistration Delay（接続ドレイニング）により処理中リクエストの強制切断を防止",
        ],
      },
      {
        feature: "Amazon ElastiCache",
        values: [
          "Redis / Valkey（Multi-AZ 自動フェイルオーバー・永続化）と Memcached",
          "RDS/DynamoDB 前段のキャッシュやセッション共有により DB 負荷スパイクを緩和",
        ],
      },
    ],
    decisionRule:
      "「重い初期設定によるスケール遅延解消」＝ Warm Pools、「終了前のログ退避待機」＝ Lifecycle Hooks。",
  },
  {
    id: "soa-comp-db-ha",
    category: "データベース",
    title: "RDS / Aurora 高可用性・スケーリング・性能分析・接続管理",
    subtitle: "Multi-AZ vs Read Replica・Aurora Global Database・RDS Proxy・Performance Insights",
    columns: ["機能 / サービス", "レプリケーション / 役割", "障害復旧・性能面の重要事項"],
    rows: [
      {
        feature: "RDS Multi-AZ",
        values: [
          "同一リージョン別 AZ への同期レプリケーション（可用性・自動フェイルオーバー専用）",
          "スタンバイは読み取りクエリ処理不可。フェイルオーバー時はエンドポイントの DNS 先が切替",
        ],
      },
      {
        feature: "RDS Read Replica",
        values: [
          "非同期レプリケーションによる参照クエリ分散（同一/クロスリージョン作成可）",
          "災害時は別リージョンのリードレプリカを手動でスタンドアロン DB へ昇格可能",
        ],
      },
      {
        feature: "Aurora Global Database",
        values: [
          "専用インフラで別リージョンへ通常1秒未満のストレージレベル複製",
          "リージョン障害時に RPO 数秒・RTO 1分未満での高速プロモートに対応",
        ],
      },
      {
        feature: "RDS Proxy",
        values: [
          "アプリケーションと RDS/Aurora 間のフルマネージド DB コネクションプール",
          "Lambda 等からの同時接続爆発を防ぎ、Multi-AZ フェイルオーバー時の切替遅延も短縮",
        ],
      },
      {
        feature: "Performance Insights",
        values: [
          "DB 負荷（Average Active Sessions）を待機イベント・SQL 文・ユーザー別に可視化",
          "ロック競合や高負荷 SQL の原因特定に直結（CloudWatch だけでは SQL 単位は不明）",
        ],
      },
    ],
    decisionRule:
      "「Lambda からの DB 接続枯渇防止」＝ RDS Proxy、「重い SQL やロック競合の調査」＝ Performance Insights、「秒単位のリージョン DR」＝ Aurora Global Database。",
  },
  {
    id: "soa-comp-backup-storage",
    category: "ストレージ",
    title: "バックアップ自動化・スナップショット・S3 データ保護",
    subtitle: "AWS Backup vs DLM・S3 Versioning / CRR / Object Lock / Storage Lens・EFS",
    columns: ["サービス / 機能", "保護対象・方式", "SOA-C03 試験での選択基準"],
    rows: [
      {
        feature: "AWS Backup",
        values: [
          "EBS・RDS・DynamoDB・EFS・S3 等を単一ポリシーで一元バックアップ管理",
          "クロスアカウント/クロスリージョン複製、Backup Vault Lock（WORM 不変保護）対応",
        ],
      },
      {
        feature: "Amazon DLM (Data Lifecycle Manager)",
        values: [
          "タグ指定で EBS スナップショットと EBS バックアップ AMI の作成・保持・削除を自動化",
          "EBS/AMI に特化したシンプルで追加料金不要のライフサイクル自動化",
        ],
      },
      {
        feature: "S3 Versioning & S3 CRR",
        values: [
          "誤削除/上書き保護（Versioning）と別リージョンへの非同期複製（CRR）",
          "CRR には両バケットの Versioning 有効化が必須。既存オブジェクト複製には S3 Batch Replication",
        ],
      },
      {
        feature: "S3 Object Lock",
        values: [
          "Versioning を前提とした WORM（一定期間の改ざん・削除防止）",
          "Governance モードは特定 IAM 権限で解除可、Compliance モードはルートでも削除不可",
        ],
      },
      {
        feature: "S3 Storage Lens & Amazon EFS",
        values: [
          "S3 Storage Lens は組織全体のバケット使用量・暗号化・未完了パート等を可視化",
          "Amazon EFS は複数 AZ 共有の POSIX NFS。AWS Backup や EFS 自動バックアップと連携",
        ],
      },
    ],
    decisionRule:
      "「複数 AWS サービスをまとめて暗号化・不変ロック保管」＝ AWS Backup、「EBS/AMI スナップショットの定期ローテのみ」＝ Amazon DLM、「ルートでも消せない S3 保護」＝ S3 Object Lock (Compliance)。",
  },
  {
    id: "soa-comp-security",
    category: "セキュリティ",
    title: "コンプライアンス監査・脅威検知・シークレット管理",
    subtitle: "Config / Security Hub / GuardDuty / Inspector / Access Analyzer / SCP / KMS / Secrets Manager / S3 Access Points",
    columns: ["サービス / 機能", "監視・制御領域", "運用自動化・最小権限設計のポイント"],
    rows: [
      {
        feature: "AWS Config",
        values: [
          "リソース設定変更履歴の記録とマネージド/カスタムルール準拠評価",
          "非準拠検出時に SSM Automation 連携で自動修復を実行可能",
        ],
      },
      {
        feature: "AWS Security Hub",
        values: [
          "GuardDuty・Inspector・Config・Access Analyzer 等の検出結果を一元集約",
          "CIS / AWS 基礎セキュリティベストプラクティス基準で組織全体のスコアを評価",
        ],
      },
      {
        feature: "Amazon GuardDuty & Amazon Inspector",
        values: [
          "GuardDuty はログ分析による脅威検知、Inspector は EC2/ECR/Lambda の CVE 脆弱性診断",
          "Inspector は SSM エージェントまたはエージェントレススキャンで継続的に脆弱性を検出",
        ],
      },
      {
        feature: "IAM Access Analyzer",
        values: [
          "外部アカウントやパブリックへ共有された S3/IAM ロール/KMS 等の意図しない公開を検出",
          "CloudTrail アクセス履歴に基づき最小権限の IAM ポリシーを自動生成可能",
        ],
      },
      {
        feature: "AWS Organizations / SCP",
        values: [
          "OU・アカウント単位での最大権限ガードレール（予防的統制）",
          "メンバーアカウントの AdministratorAccess やルートユーザーに対しても操作を拒否可能",
        ],
      },
      {
        feature: "Secrets Manager vs AWS KMS",
        values: [
          "Secrets Manager は RDS/Redshift 認証情報の自動ローテーション対応",
          "AWS KMS はカスタマーマネージドキー (CMK) でキーポリシーやクロスアカウント復号権限を制御",
        ],
      },
      {
        feature: "S3 Access Points",
        values: [
          "共有バケットに対してチーム・アプリごとの専用ホスト名/ポリシー/VPC 制限を作成",
          "単一バケットポリシーのサイズ上限（20KB）や管理複雑化を回避",
        ],
      },
    ],
    decisionRule:
      "「設定非準拠の検知と自動修復」＝ AWS Config、「外部共有リソースの棚卸し」＝ IAM Access Analyzer、「DB パスワード自動ローテーション」＝ Secrets Manager。",
  },
  {
    id: "soa-comp-networking",
    category: "ネットワーク",
    title: "VPC トラブルシュート・境界検査・ハイブリッド DNS と配信制御",
    subtitle: "VPC Flow Logs / Reachability Analyzer / Network Firewall / Route 53 Resolver / Transit Gateway / CloudFront OAC",
    columns: ["サービス / 機能", "レイヤー・目的", "ネットワーク運用・トラブルシュートでの使い分け"],
    rows: [
      {
        feature: "VPC Flow Logs",
        values: [
          "ENI/サブネット/VPC 単位の IP トラフィック ACCEPT/REJECT メタデータ記録",
          "パケットの中身（ペイロード）は記録しない。CloudWatch Logs や S3 (Athena) へ出力して解析",
        ],
      },
      {
        feature: "VPC Reachability Analyzer",
        values: [
          "送信元と送信先間のルーティング・SG・NACL・IGW/TGW を静的解析",
          "実パケットを送信せず、通信を遮断している具体的なルールや経路欠落を特定",
        ],
      },
      {
        feature: "Security Group / NACL / AWS Network Firewall",
        values: [
          "SG は ENI 単位ステートフル（Allow のみ）、NACL はサブネット単位ステートレス（Allow/Deny）",
          "AWS Network Firewall は VPC 境界でステートフルなドメイン名フィルタ・IPS・TLS 検査を実行",
        ],
      },
      {
        feature: "AWS Transit Gateway & VPC Endpoint",
        values: [
          "Transit Gateway は多数 VPC とオンプレミス回線をハブ＆スポーク接続",
          "VPC Endpoint（Gateway 型: S3/DynamoDB 無料、Interface 型: PrivateLink）で閉域接続",
        ],
      },
      {
        feature: "Amazon Route 53 & Route 53 Resolver",
        values: [
          "Route 53 はヘルスチェック連動フェイルオーバー等。Resolver はハイブリッド DNS 解決",
          "Inbound はオンプレ→VPC、Outbound は VPC→オンプレ DNS サーバーへのクエリ転送",
        ],
      },
      {
        feature: "Amazon CloudFront (OAC) / AWS WAF / AWS Global Accelerator",
        values: [
          "CloudFront OAC は S3 直接アクセスを禁止しエッジ配信を強制。WAF は L7 攻撃を防御",
          "Global Accelerator は固定 Anycast IP で TCP/UDP トラフィックをバックボーン経由高速化",
        ],
      },
    ],
    decisionRule:
      "「通信できない設定ミスの静的特定」＝ VPC Reachability Analyzer、「拒否パケットの時系列監視」＝ VPC Flow Logs、「オンプレ↔VPC 双方向 DNS」＝ Route 53 Resolver。",
  },
  {
    id: "soa-comp-perf-cost",
    category: "コスト最適化",
    title: "CloudOps パフォーマンス適正化・コスト診断・カオス検証",
    subtitle: "Compute Optimizer / Trusted Advisor / Fault Injection Service",
    columns: ["サービス", "分析・検証対象", "運用改善での活用ポイント"],
    rows: [
      {
        feature: "AWS Compute Optimizer",
        values: [
          "CloudWatch の過去メトリクス履歴に基づく ML ライトサイジング分析",
          "EC2/EBS/Lambda/ECS Fargate のスペック過剰・不足を特定（CloudWatch Agent でメモリも評価可）",
        ],
      },
      {
        feature: "AWS Trusted Advisor",
        values: [
          "コスト最適化・パフォーマンス・セキュリティ・耐障害性・サービス上限の総合診断",
          "未アタッチ EBS・アイドル ELB・公開ポート・ルート MFA 未設定等を検出しアラート連携",
        ],
      },
      {
        feature: "AWS Fault Injection Service (FIS)",
        values: [
          "制御されたフォールト注入（EC2 強制停止・API スロットリング・AZ 障害シミュレーション）",
          "本番前のカオスエンジニアリングで監視アラーム・Auto Scaling・DR 復旧手順を実証",
        ],
      },
    ],
    decisionRule:
      "「使用率に基づくサイズ最適化」＝ Compute Optimizer、「遊休資源・セキュリティ基礎点検」＝ Trusted Advisor、「障害訓練・アラーム検証」＝ Fault Injection Service。",
  },
];

export const soaQuickLookup: SaaQuickLookupItem[] = [
  {
    keyword: "EC2 のメモリ使用率・ディスク空き容量を監視",
    category: "モニタリング",
    recommended: "CloudWatch Agent",
    reason: "標準 EC2 メトリクスに OS 内部のメモリやディスク残量は含まれないためエージェント導入が必要。",
  },
  {
    keyword: "複数アラームの同時異常時のみ通知（ノイズ削減）",
    category: "モニタリング",
    recommended: "CloudWatch Composite Alarms",
    reason: "複数の子アラームを AND / OR / NOT で結合し、単独スパイクによる誤報を防止。",
  },
  {
    keyword: "ログ内のエラー文字列をカウントしてアラーム化",
    category: "ロギング",
    recommended: "CloudWatch Logs メトリクスフィルター",
    reason: "ログイベントからカスタムメトリクスを生成し、しきい値超過でアラームや修復を起動。",
  },
  {
    keyword: "SSH ポート(22)や踏み台なしで EC2 接続＋操作記録",
    category: "セキュリティ",
    recommended: "SSM Session Manager",
    reason: "IAM 制御された安全なシェル接続を提供し、コマンド履歴を S3 / CloudWatch Logs へ保存。",
  },
  {
    keyword: "アラームや Config 非準拠を契機に自動で環境修復",
    category: "自動化",
    recommended: "EventBridge + SSM Automation",
    reason: "状態変化イベントをルールで捕捉し、Runbook による隔離・再起動・設定修復を自動実行。",
  },
  {
    keyword: "CloudFormation スタック外の手動変更を検出",
    category: "IaC",
    recommended: "CloudFormation Drift Detection",
    reason: "スタック作成後のコンソール手動編集などによる構成ドリフト（差分）を可視化。",
  },
  {
    keyword: "複数 AWS アカウント・複数リージョンへ IaC 一括展開",
    category: "IaC",
    recommended: "CloudFormation StackSets",
    reason: "管理アカウントから Organizations メンバーアカウント全体へ共通基盤を展開・更新。",
  },
  {
    keyword: "重い初期化処理を伴う Auto Scaling の起動高速化",
    category: "信頼性",
    recommended: "EC2 Auto Scaling Warm Pools",
    reason: "初期化済みのインスタンスを待機状態に保ち、スケールアウト時の立ち上がり時間を短縮。",
  },
  {
    keyword: "Auto Scaling 終了前にインスタンスからログ退避",
    category: "信頼性",
    recommended: "Auto Scaling ライフサイクルフック",
    reason: "Terminating:Wait 状態で終了を一時停止し、SSM/スクリプトでログ転送完了後に終了。",
  },
  {
    keyword: "複数 AWS サービスの統合バックアップと削除保護",
    category: "事業継続性",
    recommended: "AWS Backup (+ Vault Lock)",
    reason: "EBS・RDS・EFS・DynamoDB 等を単一ポリシーで定期保護し、Vault Lock で WORM 化。",
  },
  {
    keyword: "ルートユーザーでも削除できない S3 長期保管",
    category: "セキュリティ",
    recommended: "S3 Object Lock (Compliance モード)",
    reason: "保持期限が切れるまで全ユーザー（ルート含む）による上書き・削除を完全にブロック。",
  },
  {
    keyword: "Lambda からの DB 接続数枯渇・フェイルオーバー短縮",
    category: "データベース",
    recommended: "Amazon RDS Proxy",
    reason: "コネクションをプーリングして DB 負荷を抑え、Multi-AZ 障害時の切替時間も短縮。",
  },
  {
    keyword: "パケットを流さずに VPC 内の疎通遮断原因を特定",
    category: "ネットワーク",
    recommended: "VPC Reachability Analyzer",
    reason: "ルートテーブル・SG・NACL の構成を静的解析し、どのルールが通信を止めているか特定。",
  },
  {
    keyword: "オンプレミス DNS と VPC プライベートドメインの相互解決",
    category: "ネットワーク",
    recommended: "Route 53 Resolver (Inbound / Outbound)",
    reason: "Inbound でオンプレからのクエリを受信し、Outbound ルールでオンプレ DNS へ転送。",
  },
  {
    keyword: "S3 への直接アクセスを遮断し CloudFront 経由のみ許可",
    category: "ネットワーキング",
    recommended: "CloudFront OAC (Origin Access Control)",
    reason: "S3 バケットポリシーで特定の CloudFront ディストリビューションからの読み取りのみ許可。",
  },
  {
    keyword: "過去の利用指標から EC2/EBS の過剰スペックを特定",
    category: "コスト最適化",
    recommended: "AWS Compute Optimizer",
    reason: "CloudWatch メトリクス履歴（Agent によるメモリ指標含む）を解析し最適なサイズを提案。",
  },
];

export const soaPracticeQuestions: SaaQuestion[] = [
  {
    id: "soa-q1",
    domainId: "soa-domain-1",
    domainLabel: "Domain 1: モニタリング・分析・修復",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "Amazon EC2 インスタンスの OS レベルのメモリ使用率とディスク空き容量を Amazon CloudWatch で監視し、しきい値超過時にアラームを発報させたいと考えています。運用負荷を最小限に抑えるために必要な設定はどれですか？",
    options: [
      "EC2 の「詳細モニタリング（1分間隔）」を有効化する",
      "EC2 に適切な IAM ロールを付与し、CloudWatch Agent をインストールしてメモリ・ディスクメトリクスを収集する",
      "AWS CloudTrail のデータイベントを有効化して OS メモリを監視する",
      "Amazon Inspector エージェントでメモリ使用率のしきい値アラームを設定する",
    ],
    correctIndices: [1],
    explanation:
      "EC2 の標準メトリクス（基本/詳細モニタリング）はハイパーバイザーから観測できる CPU・ネットワーク・ディスク I/O 等のみであり、OS 内部のメモリ使用率やディスク空き容量は含まれません。これらを監視するには IAM ロールを付与した上で CloudWatch Agent を導入する必要があります。",
    keywords: ["CloudWatch Agent", "メモリ監視", "IAMロール"],
  },
  {
    id: "soa-q2",
    domainId: "soa-domain-1",
    domainLabel: "Domain 1: モニタリング・分析・修復",
    difficulty: "標準",
    selectCount: 1,
    question:
      "アプリケーションの運用監視で、CPU 使用率アラーム、メモリ使用率アラーム、ALB の HTTP 5XX エラーアラームが個別に頻繁に発報し、一時的な単発スパイクによるアラート疲れが起きています。「CPU とメモリの両方が高負荷で、かつ 5XX エラーが発生している時だけ」SNS で緊急通知する最も簡単な方法はどれですか？",
    options: [
      "3つのメトリクスすべてに対して個別の SNS トピックとメール通知を設定する",
      "CloudWatch Composite Alarms を作成し、3つの子アラームを AND 条件のルール式で結合して SNS アクションを設定する",
      "Amazon CloudWatch Synthetics Canary を 1 分ごとに実行する",
      "AWS Trusted Advisor のチェック間隔を 1 分に変更する",
    ],
    correctIndices: [1],
    explanation:
      "CloudWatch Composite Alarms（複合アラーム）を使用すると、複数の個別メトリクスアラームの状態を AND / OR / NOT 論理式で結合し、複合条件が ALARM になった場合のみ通知や修復アクションを起動してアラートノイズを削減できます。",
    keywords: ["Composite Alarms", "アラートノイズ削減", "AND条件"],
  },
  {
    id: "soa-q3",
    domainId: "soa-domain-1",
    domainLabel: "Domain 1: モニタリング・分析・修復",
    difficulty: "標準",
    selectCount: 1,
    question:
      "EC2 インスタンスの定期ハードウェアメンテナンスに伴うリタイアイベントを自動検知し、メンテナンス開始前に運用担当者へ通知するとともに、自動で対象インスタンスの停止・起動（別ホストへの移行）を実行するアーキテクチャを構築したいと考えています。最適なサービスの組み合わせはどれですか？",
    options: [
      "AWS Health Dashboard イベントを Amazon EventBridge ルールで捕捉し、SNS 通知および SSM Automation を起動する",
      "Amazon Macie で EC2 メンテナンス通知をスキャンし、AWS Glue で処理する",
      "VPC Flow Logs を S3 に保存し、Amazon Athena で毎日手動クエリを実行する",
      "AWS Budgets でメンテナンスイベントのアラートを作成する",
    ],
    correctIndices: [0],
    explanation:
      "AWS Health（AWS Health Dashboard）はハードウェアリタイアやサービス障害などのアカウント固有イベントを発行します。Amazon EventBridge で `aws.health` イベントを捕捉し、SNS 通知や Systems Manager (SSM) Automation Runbook をトリガーすることで自動修復・退避が可能です。",
    keywords: ["AWS Health Dashboard", "EventBridge", "SSM Automation"],
  },
  {
    id: "soa-q4",
    domainId: "soa-domain-1",
    domainLabel: "Domain 1: モニタリング・分析・修復",
    difficulty: "標準",
    selectCount: 2,
    question:
      "EC2 上の Web アプリケーションから CloudWatch Logs へ出力される大量のアプリケーションログを分析・監視しています。「ログ内に `CRITICAL_ERROR` が出現した回数を継続的に数値化してアラーム発報する仕組み」と、「障害調査時に必要な期間だけサーバーレスで対話的にログ集計クエリを実行する仕組み」を最小の運用コストで実現する組み合わせを【2つ】選んでください。",
    options: [
      "CloudWatch Logs のメトリクスフィルター（Metric Filter）を作成し、カスタムメトリクスにアラームを設定する",
      "すべてのログを一度 Amazon RDS に毎日バッチ挿入して SQL で検索する",
      "CloudWatch Logs Insights を使用してロググループに対して対話的なクエリ・集計を実行する",
      "AWS Shield Advanced を有効化してアプリケーションログを解析する",
      "Amazon Route 53 ヘルスチェックでログファイルの文字列を検索する",
    ],
    correctIndices: [0, 2],
    explanation:
      "特定のログパターンをカウントして CloudWatch メトリクス・アラーム化するには「メトリクスフィルター（Metric Filter）」を使用します。また、蓄積されたログをインフラ管理なしでアドホックに検索・集計するには「CloudWatch Logs Insights」が最適です。",
    keywords: ["メトリクスフィルター", "Logs Insights", "複数選択"],
  },
  {
    id: "soa-q5",
    domainId: "soa-domain-2",
    domainLabel: "Domain 2: 信頼性と事業継続性",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Amazon EC2 Auto Scaling グループで稼働しているアプリケーションにおいて、スケールインによりインスタンスが終了される際、ローカルディスク上の重要な診断ログを Amazon S3 バケットへアップロード完了するまでインスタンスの終了を待機させる必要があります。最も適切な機能はどれですか？",
    options: [
      "Auto Scaling グループの「終了保護（Termination Protection）」を全インスタンスに有効化する",
      "EC2 Auto Scaling のライフサイクルフック（`EC2_INSTANCE_TERMINATING`）を設定し、アップロード完了後に CompleteLifecycleAction を呼ぶ",
      "ALB のヘルスチェック間隔を 300 秒に延長する",
      "スポットインスタンスの中断通知を利用する",
    ],
    correctIndices: [1],
    explanation:
      "Auto Scaling ライフサイクルフック（Lifecycle Hooks）で `EC2_INSTANCE_TERMINATING` を構成すると、インスタンスが `Terminating:Wait` 状態に入り、デフォルト 3,600 秒（ハートビート延長可）の間、終了を保留してログ退避等のカスタム処理を確実に完了できます。",
    keywords: ["Lifecycle Hooks", "Terminating:Wait", "ログ退避"],
  },
  {
    id: "soa-q6",
    domainId: "soa-domain-2",
    domainLabel: "Domain 2: 信頼性と事業継続性",
    difficulty: "標準",
    selectCount: 1,
    question:
      "EC2 Auto Scaling グループで動作するレガシーアプリケーションは、起動時の大容量データダウンロードと初期キャッシュ構築に約 10 分かかるため、急激なアクセス増時にスケールアウトが間に合いません。起動済みインスタンスの課金を最小限に抑えつつ、スケールアウト時の利用可能時間を大幅に短縮する最適な機能はどれですか？",
    options: [
      "Auto Scaling Warm Pools（ウォームプール）を設定し、初期化済みインスタンスを Stopped 状態で事前待機させる",
      "すべてのインスタンスを常時 InService で最大キャパシティ数だけ稼働させ続ける",
      "Instance Metadata Service (IMDSv2) を無効化して起動を早める",
      "EBS ボリュームのタイプを sc1（Cold HDD）に変更する",
    ],
    correctIndices: [0],
    explanation:
      "EC2 Auto Scaling の Warm Pools は、起動・初期化スクリプト実行まで完了させたインスタンスを停止（Stopped）または休止状態でプールしておき、スケールアウト時に即座に InService へ投入できるため、コンピュート課金を抑えながら高速なスケールアウトを実現します。",
    keywords: ["Warm Pools", "Auto Scaling", "スケールアウト高速化"],
  },
  {
    id: "soa-q7",
    domainId: "soa-domain-2",
    domainLabel: "Domain 2: 信頼性と事業継続性",
    difficulty: "応用",
    selectCount: 1,
    question:
      "多数の AWS Lambda 関数から Amazon RDS for PostgreSQL (Multi-AZ) へ同時アクセスするアーキテクチャにおいて、トラフィック急増時に DB の最大接続数上限に達するエラーが発生し、またフェイルオーバー時の再接続にも時間がかかっています。アプリケーションの SQL ロジックを変えずに両方の問題を解決する最適なマネージドサービスはどれですか？",
    options: [
      "Amazon RDS Proxy を RDS の前段に配置し、Lambda の接続先エンドポイントを RDS Proxy へ変更する",
      "Amazon ElastiCache for Memcached に直接 SQL クエリを書き込む",
      "RDS のリードレプリカを 10 個作成して書き込みを分散する",
      "Lambda のタイムアウトを 15 分に延長する",
    ],
    correctIndices: [0],
    explanation:
      "Amazon RDS Proxy はフルマネージドのデータベースプロキシとして DB 接続をプーリング・共有するため、Lambda 等のサーバーレス環境からの大量同時接続によるコネクション枯渇を防止し、Multi-AZ フェイルオーバー時のダウンタイムも大幅に短縮します。",
    keywords: ["RDS Proxy", "コネクションプール", "フェイルオーバー短縮"],
  },
  {
    id: "soa-q8",
    domainId: "soa-domain-3",
    domainLabel: "Domain 3: デプロイ・プロビジョニング・自動化",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "本番環境のインフラを AWS CloudFormation で管理していますが、障害対応中に運用担当者がマネジメントコンソールから手動でセキュリティグループのルールを変更した可能性があります。現在の実環境と CloudFormation テンプレート定義との間に乖離が生じていないか確認する機能はどれですか？",
    options: [
      "CloudFormation Change Sets（変更セット）を実行する",
      "CloudFormation Drift Detection（ドリフト検出）を実行する",
      "AWS CloudFormation StackSets を作成する",
      "Amazon Inspector でスタックをスキャンする",
    ],
    correctIndices: [1],
    explanation:
      "CloudFormation Drift Detection は、スタックによってプロビジョニングされたリソースの現在の構成プロパティを検出し、テンプレート定義からの手動変更（構成ドリフト）の有無と差分箇所を特定できます。Change Sets はテンプレート更新時の影響事前確認に使います。",
    keywords: ["Drift Detection", "構成ドリフト", "CloudFormation"],
  },
  {
    id: "soa-q9",
    domainId: "soa-domain-3",
    domainLabel: "Domain 3: デプロイ・プロビジョニング・自動化",
    difficulty: "標準",
    selectCount: 1,
    question:
      "AWS CloudFormation テンプレートで Amazon RDS インスタンスと Amazon S3 バケットを含む環境を構築しています。万が一スタック自体を誤って削除（DeleteStack）した場合でも、RDS データベースのデータまたは S3 バケット内のデータが物理削除されずに保護されるようにテンプレートへ記述すべき属性はどれですか？",
    options: [
      "リソース定義に `DeletionPolicy: Retain`（または RDS では `Snapshot`）を設定する",
      "テンプレートの Outputs セクションに `Protect: true` を記述する",
      "DependsOn 属性で他のリソースへの依存関係を追加する",
      "Change Sets の自動実行を有効化する",
    ],
    correctIndices: [0],
    explanation:
      "CloudFormation の `DeletionPolicy` 属性に `Retain` を指定するとスタック削除時もリソース自体が保持され、RDS や EBS 等で `Snapshot` を指定すると削除前に自動スナップショットが取得されます（デフォルトの `Delete` ではリソースも削除されます）。",
    keywords: ["DeletionPolicy", "Retain", "誤削除防止"],
  },
  {
    id: "soa-q10",
    domainId: "soa-domain-3",
    domainLabel: "Domain 3: デプロイ・プロビジョニング・自動化",
    difficulty: "標準",
    selectCount: 1,
    question:
      "数百台の Amazon EC2 インスタンス（Linux / Windows 混在）に対し、毎月指定された深夜時間帯のみ重要度「Critical」および「Security」の OS パッチを自動適用し、すべてのインスタンスが最新のベースラインに準拠しているかレポートで確認したいと考えています。SSH/RDP を開放せず最小の手間で実現できる AWS サービスはどれですか？",
    options: [
      "AWS Systems Manager Patch Manager とメンテナンスウィンドウを使用する",
      "AWS CloudFormation の更新を毎月手動で実行する",
      "Amazon CloudWatch Synthetics で各 OS のアップデートコマンドを実行する",
      "AWS CodeBuild で毎月すべての EC2 に SSH ログインして yum/apt を実行する",
    ],
    correctIndices: [0],
    explanation:
      "AWS Systems Manager (SSM) Patch Manager では OS ごとのパッチベースライン（重要度・承認遅延等）を定義でき、メンテナンスウィンドウと組み合わせることで指定時間帯に自動適用し、パッチコンプライアンス状況を一元レポートできます。",
    keywords: ["SSM Patch Manager", "メンテナンスウィンドウ", "パッチコンプライアンス"],
  },
  {
    id: "soa-q11",
    domainId: "soa-domain-4",
    domainLabel: "Domain 4: セキュリティとコンプライアンス",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "セキュリティ監査要件により、プライベートサブネット内の EC2 インスタンスへの SSH（ポート 22）および踏み台サーバーの運用を完全に廃止し、すべてのコマンド実行操作ログを Amazon S3 バケットへ監査証跡として記録する必要が生じました。最適な解決策はどれですか？",
    options: [
      "EC2 にパブリック IP を付与し、Security Group でポート 2222 を開放する",
      "AWS Systems Manager Session Manager を利用し、S3 ロギングと IAM アクセス制御を構成する",
      "VPC Flow Logs を有効にして SSH コマンド文字列を S3 へ保存する",
      "AWS Artifact からコンプライアンスレポートをダウンロードする",
    ],
    correctIndices: [1],
    explanation:
      "SSM Session Manager を使用すると、インバウンドポート（SSH/RDP）や踏み台サーバーなしで IAM 認証されたシェル接続が可能になり、セッションの標準出力・コマンド履歴を Amazon S3 や CloudWatch Logs へ記録できます。",
    keywords: ["SSM Session Manager", "踏み台レス", "監査ログ"],
  },
  {
    id: "soa-q12",
    domainId: "soa-domain-4",
    domainLabel: "Domain 4: セキュリティとコンプライアンス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "金融規制のコンプライアンス要件により、Amazon S3 バケットに保存する監査アーカイブファイルを 5 年間、AWS アカウントのルートユーザーや管理権限を持つ IAM ユーザーであっても絶対に削除・上書き・保持期間の短縮ができない WORM（Write-Once-Read-Many）状態で保護する必要があります。設定すべき構成はどれですか？",
    options: [
      "S3 Versioning を有効化し、バケットポリシーで通常の IAM ユーザーのみ削除を拒否する",
      "S3 Object Lock を有効化し、「コンプライアンスモード（Compliance mode）」で 5 年間の保持期間を設定する",
      "S3 Object Lock を「ガバナンスモード（Governance mode）」で設定する",
      "S3 ライフサイクルルールで 5 年後に Glacier Deep Archive へ移行する",
    ],
    correctIndices: [1],
    explanation:
      "S3 Object Lock のコンプライアンスモード（Compliance mode）では、保持期間が満了するまでアカウントのルートユーザーを含め誰であっても保護対象オブジェクトバージョンの削除・上書き・保持期間短縮ができません。ガバナンスモードは `s3:BypassGovernanceRetention` 権限で上書き可能です。",
    keywords: ["S3 Object Lock", "Complianceモード", "WORM"],
  },
  {
    id: "soa-q13",
    domainId: "soa-domain-4",
    domainLabel: "Domain 4: セキュリティとコンプライアンス",
    difficulty: "応用",
    selectCount: 2,
    question:
      "AWS Organizations で複数アカウントを運用している環境で、「外部アカウントやインターネットへ意図せず公開・共有されている S3 バケットや IAM ロール、KMS キーを自動検出する仕組み」と、「GuardDuty、Inspector、AWS Config などのセキュリティ検出結果を単一ダッシュボードへ一元集約し、ベストプラクティス基準で評価する仕組み」を導入したいと考えています。採用すべきサービスの組み合わせを【2つ】選んでください。",
    options: [
      "IAM Access Analyzer を組織レベルで有効化する",
      "AWS CloudFormation Drift Detection を全アカウントで毎分実行する",
      "AWS Security Hub を有効化し、管理者アカウントへ各サービスの検出結果を集約する",
      "Amazon Route 53 Resolver で外部共有リソースをブロックする",
      "AWS Backup Vault Lock で IAM ポリシーをロックする",
    ],
    correctIndices: [0, 2],
    explanation:
      "IAM Access Analyzer は自動推論を用いて外部エンティティに共有された S3 バケット・IAM ロール・KMS キー・SQS 等を検出します。また、AWS Security Hub は GuardDuty、Inspector、Config、Access Analyzer などのセキュリティ検出結果を一元集約して基準評価を行います。",
    keywords: ["IAM Access Analyzer", "Security Hub", "複数選択"],
  },
  {
    id: "soa-q14",
    domainId: "soa-domain-5",
    domainLabel: "Domain 5: ネットワーキングとコンテンツ配信",
    difficulty: "標準",
    selectCount: 1,
    question:
      "複数 VPC と AWS Transit Gateway を介した環境で、アプリケーションサブネットの EC2 インスタンスから別 VPC 内の RDS インスタンスへ TCP ポート 5432 で接続できません。実際にテストパケットを送信することなく、ルートテーブル、Security Group、Network ACL、Transit Gateway の設定を静的解析して通信を遮断している原因箇所を即座に特定するサービスはどれですか？",
    options: [
      "VPC Reachability Analyzer（VPC 到達可能性アナライザー）",
      "Amazon GuardDuty",
      "AWS Direct Connect Gateway",
      "Amazon CloudFront Functions",
    ],
    correctIndices: [0],
    explanation:
      "VPC Reachability Analyzer はネットワーク構成（ルートテーブル、Security Group、NACL、IGW、VPC Peering、Transit Gateway 等）を静的モデルで解析し、実トラフィックを送らずにホップごとの経路と遮断理由（どのルールが止めているか）を正確に特定できます。",
    keywords: ["VPC Reachability Analyzer", "疎通診断", "Transit Gateway"],
  },
  {
    id: "soa-q15",
    domainId: "soa-domain-5",
    domainLabel: "Domain 5: ネットワーキングとコンテンツ配信",
    difficulty: "応用",
    selectCount: 1,
    question:
      "AWS Direct Connect で接続されたハイブリッド環境において、VPC 内の EC2 インスタンスがオンプレミスの DNS サーバーで管理されている社内ドメイン（例：`corp.internal`）の名前解決を行えるようにし、同時にオンプレミス端末からも VPC 内の Route 53 プライベートホストゾーンを解決できるようにしたいと考えています。必要な構成はどれですか？",
    options: [
      "Amazon Route 53 Resolver の Outbound エンドポイント（＋転送ルール）と Inbound エンドポイントの両方を 2 つ以上の AZ に作成する",
      "VPC のパブリックサブネットに Route 53 パブリックホストゾーンの NS レコードを登録する",
      "VPC Endpoint（Gateway 型）を Route 53 用に作成する",
      "AWS Global Accelerator にオンプレミスのプライベート IP を登録する",
    ],
    correctIndices: [0],
    explanation:
      "オンプレミスから VPC プライベートホストゾーンへの DNS クエリ受信には「Route 53 Resolver Inbound エンドポイント」、VPC からオンプレミス DNS へのクエリ転送には「Outbound エンドポイント＋転送ルール（Forwarding Rule）」を使用します。可用性のため各エンドポイントは 2 AZ 以上に配置します。",
    keywords: ["Route 53 Resolver", "Inbound/Outbound", "ハイブリッドDNS"],
  },
  {
    id: "soa-q16",
    domainId: "soa-domain-5",
    domainLabel: "Domain 5: ネットワーキングとコンテンツ配信",
    difficulty: "標準",
    selectCount: 1,
    question:
      "静的 Web コンテンツを Amazon S3 バケットに配置し、Amazon CloudFront を通じて HTTPS で配信しています。ユーザーが S3 バケットの直接エンドポイント URL へアクセスすることを完全に遮断し、CloudFront ディストリビューション経由のリクエストのみ許可するための最新ベストプラクティスはどれですか？",
    options: [
      "S3 バケットをパブリック公開し、オブジェクトキー名を暗号化する",
      "CloudFront に Origin Access Control (OAC) を設定し、S3 パブリックアクセスブロック有効化と併せてバケットポリシーで該当 CloudFront ARN からのアクセスのみ許可する",
      "Security Group で S3 バケットへのインターネットアクセスを拒否する",
      "AWS Config ルールで S3 への直接アクセスを毎時間削除する",
    ],
    correctIndices: [1],
    explanation:
      "S3 オリジンへの直接アクセスを防ぎ CloudFront 経由のみ許可する現在の推奨方式は「Origin Access Control (OAC)」です。S3 パブリックアクセスブロックを有効にし、バケットポリシーで `cloudfront.amazonaws.com` サービスプリンシパルと `AWS:SourceArn` 条件を制限します。",
    keywords: ["CloudFront OAC", "S3バケットポリシー", "直接アクセス遮断"],
  },
];

export const soaArchitecturePatterns: SaaArchitecturePattern[] = [
  {
    id: "soa-pat-auto-remediation",
    title: "イベント駆動・自動修復（Auto-Remediation）運用構成",
    badge: "自動運用",
    flow: ["CloudWatch / AWS Config", "Amazon EventBridge", "SSM Automation", "SNS 通知", "SSM OpsCenter"],
    summary:
      "メトリクス異常やコンプライアンス違反を検知した瞬間に、人手を介さず SSM Automation Runbook で自動修復・隔離と記録を行う構成。",
    keyDesignPoints: [
      "複数の個別アラームは CloudWatch Composite Alarms で集約し、誤報による不要な修復起動を防止",
      "修復結果やインシデントの関連情報を SSM OpsCenter の OpsItem と SNS 通知で運用チームへ連携",
    ],
  },
  {
    id: "soa-pat-zero-bastion-ops",
    title: "踏み台レス・フリート運用管理構成",
    badge: "セキュア運用",
    flow: ["IAM / Identity Center", "SSM Session Manager", "Private Subnet EC2", "CloudWatch Logs / S3", "SSM Patch Manager"],
    summary:
      "Port 22/3389 や踏み台サーバーを撤廃し、Session Manager・Patch Manager・State Manager で閉域フリートを安全に運用する構成。",
    keyDesignPoints: [
      "Session Manager の操作ログは S3 バケット（暗号化・ライフサイクル適用）または CloudWatch Logs へ自動記録",
      "インターネットに出ないプライベートサブネットでは `ssm` / `ssmmessages` / `ec2messages` 用 Interface 型 VPC Endpoint を配置",
    ],
  },
  {
    id: "soa-pat-resilient-backup-dr",
    title: "統合バックアップ＆マルチリージョン DR 構成",
    badge: "事業継続",
    flow: ["Route 53 Health Check", "EC2 Auto Scaling (Warm Pools)", "Aurora Global Database", "AWS Backup (Vault Lock)", "S3 CRR (Versioning)"],
    summary:
      "Warm Pools による高速スケール、Aurora Global DB と S3 CRR による地理的複製、AWS Backup Vault Lock による不変バックアップを統合した構成。",
    keyDesignPoints: [
      "AWS Backup の Backup Vault Lock と S3 Object Lock (Compliance) でランサムウェアや誤操作によるバックアップ削除を防止",
      "Fault Injection Service (FIS) を用いて定期的にフェイルオーバーやアラーム発報の実地検証を実施",
    ],
  },
  {
    id: "soa-pat-hybrid-dns-inspect",
    title: "ハイブリッド DNS ＆ トラフィック境界検査構成",
    badge: "ネットワーク運用",
    flow: ["オンプレミス DNS", "Direct Connect / VPN", "Route 53 Resolver", "AWS Transit Gateway", "AWS Network Firewall"],
    summary:
      "Route 53 Resolver でオンプレミスと VPC の双方向名前解決を実現し、Transit Gateway 経由トラフィックを Network Firewall で検査する構成。",
    keyDesignPoints: [
      "Inbound / Outbound エンドポイントは高可用性のため 2 つ以上の AZ に配置",
      "VPC Flow Logs と VPC Reachability Analyzer を併用し、通信ログ監視と構成変更前の経路検証を両立",
    ],
  },
];

export const soaPitfalls: SaaPitfall[] = [
  {
    id: "soa-pit-cw-memory",
    trap: "EC2 の標準 CloudWatch メトリクス（または詳細モニタリング）だけでメモリ使用率やディスク空き容量が取得できると思う",
    whyWrong:
      "EC2 の組み込みメトリクスはハイパーバイザーから観測できる CPU・ネットワーク・ディスク I/O のみで、OS 内部のメモリやファイルシステム残量は収集されません。",
    correctApproach:
      "IAM ロールを付与した上で「CloudWatch Agent」をインストール・設定し、カスタムメトリクスとして CloudWatch へ送信する。",
  },
  {
    id: "soa-pit-cfn-drift",
    trap: "コンソールで手動変更されたリソースがあっても、CloudFormation スタックをそのまま再更新すれば自動で元通り修復されると思う",
    whyWrong:
      "CloudFormation はテンプレート側に差分がなければ更新をスキップする場合があり、スタック外の手動変更（ドリフト）を自動修復しません。",
    correctApproach:
      "CloudFormation Drift Detection（ドリフト検出）で手動変更の差分を特定した上で、テンプレートまたは実リソースを計画的に一致させる。",
  },
  {
    id: "soa-pit-s3-crr-ver",
    trap: "S3 クロスリージョンレプリケーション (CRR) を有効化するだけで既存の過去ファイルも自動で別リージョンへ複製されると思う",
    whyWrong:
      "CRR には送信元・送信先両バケットで S3 Versioning 有効化が必須であり、また設定有効化「以降」の新規・更新オブジェクトのみ複製されます。",
    correctApproach:
      "両バケットで S3 Versioning を有効化した上で、既存の過去オブジェクトの複製には S3 Batch Replication を使用する。",
  },
  {
    id: "soa-pit-s3-lock-gov",
    trap: "ルートユーザーを含め誰にも削除できない法定 WORM 保護として S3 Object Lock のガバナンスモード (Governance) を選ぶ",
    whyWrong:
      "ガバナンスモードでは `s3:BypassGovernanceRetention` IAM 権限を持つ管理者が保持設定を上書き・削除できてしまいます。",
    correctApproach:
      "アカウントのルートユーザーであっても保持期限前の削除・短縮を完全に禁止するには S3 Object Lock の「Compliance モード」を選択する。",
  },
  {
    id: "soa-pit-flowlogs-payload",
    trap: "VPC Flow Logs を有効にすれば、通信パケットの HTTP URL パスや TLS ペイロードの中身まで確認できると思う",
    whyWrong:
      "VPC Flow Logs が記録するのは送信元/先 IP・ポート・プロトコル・パケット数・バイト数・ACCEPT/REJECT 等の接続メタデータのみです。",
    correctApproach:
      "L7 のドメインフィルタリングや詳細検査には AWS Network Firewall や ALB / CloudFront ログ、または VPC Traffic Mirroring を利用する。",
  },
  {
    id: "soa-pit-param-ssm",
    trap: "Systems Manager Parameter Store の機能だけで RDS データベースパスワードを自動ローテーションしようとする",
    whyWrong:
      "Parameter Store には RDS/Redshift 認証情報を組み込みで自動ローテーションする機能がありません（Lambda 等での自前実装が必要）。",
    correctApproach:
      "データベース認証情報の自動ローテーションが要件に含まれる場合は AWS Secrets Manager を選択する。",
  },
];

export const soaKeyLimits: SaaLimitFact[] = [
  {
    id: "soa-lim-cw-metrics",
    service: "Amazon CloudWatch メトリクス解像度と保持期間",
    limitValue: "最小 1 秒 (高解像度) / 最大 15 か月 (455 日) 保持",
    detail:
      "EC2 基本監視は 5 分間隔、詳細監視は 1 分間隔。カスタム高解像度メトリクスは 1 秒粒度で 3 時間保持され、1 分データは 15 日、5 分は 63 日、1 時間データは 455 日保持されます。",
  },
  {
    id: "soa-lim-ssm-param",
    service: "SSM Parameter Store クォータ",
    limitValue: "Standard 4 KB (10,000 件) / Advanced 8 KB (100,000 件)",
    detail:
      "1 AWS アカウント・1 リージョンあたりの上限。Advanced ティア（有料）では 8 KB までの値保存や有効期限通知ポリシーが利用可能です。",
  },
  {
    id: "soa-lim-asg-lifecycle",
    service: "Auto Scaling Lifecycle Hooks 待機時間",
    limitValue: "デフォルト 3,600 秒 (1 時間) / 最大 48 時間",
    detail:
      "Pending:Wait または Terminating:Wait 状態のデフォルトタイムアウトは 3,600 秒。RecordLifecycleActionHeartbeat による延長上限は 48 時間またはハートビートの 100 倍のうち短い方です。",
  },
  {
    id: "soa-lim-cfn-template",
    service: "AWS CloudFormation テンプレートサイズ上限",
    limitValue: "API 直接指定 51,200 バイト / S3 URL 経由 1 MB",
    detail:
      "CreateStack 等の TemplateBody 直接指定は 51,200 バイトまで。大規模テンプレートは Amazon S3 に配置して TemplateURL（最大 1 MB）で指定します。",
  },
  {
    id: "soa-lim-cw-composite",
    service: "CloudWatch Composite Alarms",
    limitValue: "1 複合アラームあたり最大 100 個の子アラーム",
    detail:
      "AND / OR / NOT 論理式で複数アラームを統合してアラートノイズを抑制。アクションとして SNS、Lambda、SSM OpsItems 作成等を実行できます。",
  },
  {
    id: "soa-lim-r53-resolver",
    service: "Route 53 Resolver エンドポイント",
    limitValue: "最小 2 AZ（1 エンドポイントあたり 2〜6 IP アドレス）",
    detail:
      "高可用性のため Inbound / Outbound エンドポイント作成時は最低 2 つのアベイラビリティーゾーンを指定し、最大 6 個の ENI IP アドレスを割り当て可能です。",
  },
];

export const soaOfficialResources: SaaOfficialResource[] = [
  {
    title: "AWS Certified CloudOps Engineer – Associate 公式試験ページ",
    description:
      "SOA-C03（旧 SysOps Administrator - Associate 改定版）の試験概要、公式試験ガイド、サンプル問題、受験予約の公式ポータル。",
    url: "https://aws.amazon.com/jp/certification/certified-cloudops-engineer-associate/",
    badge: "AWS公式",
  },
  {
    title: "SOA-C03 公式試験ガイド（日本語ドキュメント）",
    description:
      "5 ドメインの重み付け（22/22/22/16/18%）・運用タスク・出題範囲の一次資料。",
    url: "https://docs.aws.amazon.com/ja_jp/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html",
    badge: "公式試験ガイド",
  },
  {
    title: "AWS Skill Builder (公式デジタル学習プラットフォーム)",
    description:
      "SOA-C03 対応の CloudOps 実践ラボ、Exam Prep コース、公式模擬試験（Official Practice Question Set）を提供。",
    url: "https://skillbuilder.aws/",
    badge: "無料演習あり",
  },
  {
    title: "AWS Systems Manager 公式ユーザーガイド",
    description:
      "Session Manager、Run Command、Patch Manager、Automation、State Manager、Parameter Store の仕様と運用手順。",
    url: "https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/what-is-systems-manager.html",
    badge: "SSM公式ガイド",
  },
  {
    title: "Amazon CloudWatch 公式ユーザーガイド",
    description:
      "CloudWatch Agent、メトリクス解像度、複合アラーム、Logs Insights、Synthetics の詳細仕様とベストプラクティス。",
    url: "https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
    badge: "監視・ログ公式",
  },
];

export const soaServiceQueryAliases: Record<string, string> = {
  "CloudWatch Composite Alarms": "Composite Alarms",
  "CloudWatch Synthetics": "Synthetics",
  "CloudWatch Logs Insights": "Logs Insights",
  "ALB / NLB": "ALB",
  "Lifecycle Hooks": "Lifecycle Hook",
  "CloudFormation Drift Detection": "Drift Detection",
  "CloudFormation StackSets": "StackSets",
  "AWS Organizations / SCP": "SCP",
  "Security Group / NACL": "NACL",
  "CloudFront OAC": "OAC",
  "Auto Scaling Warm Pools": "Warm Pools",
  "S3 Access Points": "Access Points",
  "S3 Object Lock": "Object Lock",
  "S3 Storage Lens": "Storage Lens",
  "S3 Versioning": "Versioning",
  "Route 53 Resolver": "Route 53 Resolver",
  "VPC Reachability Analyzer": "Reachability Analyzer",
  "VPC Flow Logs": "VPC Flow Logs",
  "VPC Endpoint": "VPC Endpoint",
};
