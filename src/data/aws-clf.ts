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
} from "@/data/aws-saa";

// 出典: AWS Certified Cloud Practitioner (CLF-C02) 公式試験ガイド / AWS 公式ドキュメント
export const clfExamFacts: SaaExamFact[] = [
  { label: "試験コード", value: "CLF-C02", detail: "Foundational レベル" },
  { label: "試験時間", value: "90 分", detail: "1時間30分" },
  { label: "問題数", value: "65 問", detail: "採点50問 + 非採点15問" },
  { label: "合格ライン", value: "700 点", detail: "100〜1000点スケール" },
  { label: "出題形式", value: "択一 / 複数", detail: "基礎・サービス選定中心" },
  { label: "受験料", value: "$100 USD", detail: "ピアソンVUE / オンライン可" },
];

export const clfDomains: SaaDomain[] = [
  {
    id: "clf-domain-1",
    number: 1,
    title: "クラウドのコンセプト",
    englishTitle: "Cloud Concepts",
    weight: 24,
    accentColor: "indigo",
    summary:
      "AWS クラウドの価値提案（6つのメリット・従量課金による変動費化）、AWS Well-Architected フレームワーク、AWS CAF、移行の 6R、およびハイブリッドを含むクラウドデプロイモデルが問われます。",
    topics: [
      {
        id: "clf-d1-t1",
        title: "クラウドのメリットと経済性（従量課金・スケーラビリティ・アジリティ）",
        services: ["従量課金", "スケーラビリティと弾力性", "アジリティ", "エコノミクスオブスケール"],
        keyPoints: [
          "データセンターへの初期設備投資（CapEx）を、利用した分だけ支払う変動費（OpEx / 従量課金）へ転換できる",
          "エコノミクスオブスケール（規模の経済）により、AWS の大規模な調達・運用効率が低価格な利用料金として還元される",
          "事前のキャパシティ推測が不要になり、必要な時に数分で世界中に展開できるためアジリティ（俊敏性）が飛躍的に高まる",
          "スケーラビリティ（需要増に応じた拡張）と弾力性（負荷変動に合わせた自動増減）により、過剰プロビジョニングや機会損失を防ぐ",
        ],
        examTip: "「固定費から変動費への転換」＝ 従量課金、「数分でグローバルに試して展開」＝ アジリティ・グローバル展開。",
      },
      {
        id: "clf-d1-t2",
        title: "Well-Architected フレームワークとクラウド移行戦略（6R・AWS CAF）",
        services: ["AWS Well-Architected", "AWS CAF", "移行の 6R", "AWS Migration Hub"],
        keyPoints: [
          "AWS Well-Architected フレームワークは「運用上の優秀性・セキュリティ・信頼性・パフォーマンス効率・コスト最適化・持続可能性」の 6 本の柱で構成される",
          "AWS Cloud Adoption Framework (CAF) はビジネス・人材・ガバナンス・プラットフォーム・セキュリティ・運用の 6 つのパースペクティブで組織のクラウド移行を導く",
          "移行の 6R（Rehost / Replatform / Refactor / Repurchase / Retire / Retain）のうち、変更なしの移行は Rehost、小規模最適化は Replatform、SaaS 製品への乗り換えは Repurchase",
          "AWS Migration Hub を使うと複数ツールにまたがる移行プロジェクトの進捗を単一ダッシュボードで追跡できる",
        ],
        examTip: "「コード変更なしでそのまま移行」＝ Rehost、「SaaS へ切替」＝ Repurchase、「6つの視点で組織変革」＝ AWS CAF。",
      },
      {
        id: "clf-d1-t3",
        title: "クラウドデプロイモデルとグローバル基盤活用",
        services: ["ハイブリッドクラウド", "AWS Outposts", "グローバルインフラ", "AWS Snowball Edge"],
        keyPoints: [
          "クラウドデプロイモデルには「クラウド（オールインクラウド）」「ハイブリッド（オンプレミスと AWS の連携）」「オンプレミス（プライベートクラウド）」がある",
          "AWS Outposts は AWS が提供する専用ハードウェアを顧客のオンプレミス拠点に設置し、AWS と一貫した API・ツールで超低遅延処理やデータレジデンシー要件に対応する",
          "AWS グローバルインフラ（リージョン・AZ・エッジロケーション）を活用することで、物理インフラの調達・保守（差別化につながらない重労働）から解放される",
          "大容量データのオフライン移行や過酷なエッジ環境でのローカル計算には AWS Snowball Edge を利用できる",
        ],
        examTip: "「オンプレミス環境に AWS のラックを設置して超低遅延処理」＝ AWS Outposts。「大容量データの物理輸送」＝ Snowball Edge。",
      },
    ],
  },
  {
    id: "clf-domain-2",
    number: 2,
    title: "セキュリティとコンプライアンス",
    englishTitle: "Security and Compliance",
    weight: 30,
    accentColor: "emerald",
    summary:
      "出題比率 30% の中核ドメイン。AWS 責任共有モデルの境界理解、IAM とルートアカウント保護、暗号化・境界防御・監査・脅威検知・コンプライアンス報告サービスの役割が問われます。",
    topics: [
      {
        id: "clf-d2-t1",
        title: "AWS 責任共有モデルとアクセス管理（IAM・ルートユーザー）",
        services: ["責任共有モデル", "IAM", "IAM Identity Center", "MFA"],
        keyPoints: [
          "AWS は「クラウドのセキュリティ」（物理データセンター警備、ハードウェア、ハイパーバイザー、ネットワーク基盤）に責任を持つ",
          "顧客は「クラウド内のセキュリティ」（顧客データ、暗号化設定、IAM アクセス制御、EC2 のゲスト OS パッチ、Security Group/NACL 設定）に責任を持つ",
          "ルートユーザーには必ず MFA（多要素認証）を有効化して日常業務には使用せず、最小権限の原則に従って IAM ユーザー・グループ・ロールを設計する",
          "IAM Identity Center（旧 AWS SSO）により、複数の AWS アカウントや業務アプリへのシングルサインオンを一元管理できる",
        ],
        examTip: "「物理施設やホストOSの保護」＝ AWS 責任。「S3 バケット権限・EC2 のゲスト OS パッチ・顧客データ管理」＝ 顧客責任。",
      },
      {
        id: "clf-d2-t2",
        title: "ガバナンス・監査・脅威検知・コンプライアンス",
        services: [
          "AWS CloudTrail",
          "AWS Config",
          "Amazon GuardDuty",
          "Amazon Inspector",
          "Amazon Macie",
          "AWS Artifact",
        ],
        keyPoints: [
          "AWS CloudTrail は誰が・いつ・どの API を呼び出したかの操作監査ログを記録し、AWS Config はリソースの設定変更履歴とコンプライアンスルール準拠を評価する",
          "Amazon GuardDuty は機械学習で不審な挙動や不正アクセスの脅威を継続検知し、Amazon Inspector は EC2・ECR・Lambda の脆弱性（CVE 等）を自動診断する",
          "Amazon Macie は S3 バケット内の個人情報（PII）や機密データを自動検出する",
          "AWS Artifact は AWS が取得している第三者コンプライアンスレポート（SOC / ISO / PCI DSS 等）や契約文書へのオンデマンドアクセスを提供する",
        ],
        examTip: "「AWS のコンプライアンス証明書取得」＝ AWS Artifact。「API 履歴追跡」＝ CloudTrail。「S3 内の個人情報検出」＝ Macie。",
      },
      {
        id: "clf-d2-t3",
        title: "データ暗号化・シークレット保護・ネットワーク境界防御",
        services: [
          "AWS KMS",
          "AWS Secrets Manager",
          "AWS WAF",
          "AWS Shield",
          "Security Group",
          "Network ACL",
        ],
        keyPoints: [
          "AWS KMS (Key Management Service) で暗号化キーを作成・管理し、保存データ（保管時）やサービス連携暗号化を統制する",
          "AWS Secrets Manager はデータベースパスワードや API キーなどの機密情報を安全に保管し、自動ローテーションできる",
          "AWS Shield Standard は全 AWS 顧客に追加料金なしで自動適用され DDoS 攻撃を防御（Advanced は 24/7 DRT 支援やコスト保護を追加）。AWS WAF は SQLi や XSS 等の L7 Web 攻撃を防御する",
          "VPC 境界ではインスタンス単位でステートフル（許可のみ）の Security Group と、サブネット単位でステートレス（許可・拒否）の Network ACL を併用する",
        ],
        examTip: "「Web アプリへの SQLi/XSS ブロック」＝ AWS WAF。「自動適用される DDoS 対策」＝ AWS Shield Standard。「DB 資格情報の自動ローテーション」＝ Secrets Manager。",
      },
    ],
  },
  {
    id: "clf-domain-3",
    number: 3,
    title: "クラウドのテクノロジーとサービス",
    englishTitle: "Cloud Technology and Services",
    weight: 34,
    accentColor: "amber",
    summary:
      "出題比率最大の 34%。グローバルインフラ（リージョン・AZ・エッジ）、VPC ネットワーキング、コンピュート、ストレージ、データベース、分析・生成 AI/ML サービスの適切な選定が問われます。",
    topics: [
      {
        id: "clf-d3-t1",
        title: "グローバルインフラとネットワーキング（Region / AZ / VPC / CloudFront）",
        services: [
          "リージョン / AZ",
          "エッジロケーション",
          "Amazon VPC",
          "Amazon CloudFront",
          "Amazon Route 53",
          "AWS Direct Connect",
        ],
        keyPoints: [
          "リージョンは地理的に独立した拠点であり、各リージョン内のアベイラビリティーゾーン (AZ) は電源・冷却・ネットワークが分離された 1 つ以上のデータセンター群で構成される",
          "エッジロケーションは Amazon CloudFront のコンテンツキャッシュ配信や Amazon Route 53 の DNS 解決に使われ、エンドユーザーの近くから低遅延で応答する",
          "Amazon VPC は AWS 内の論理的に分離された仮想ネットワークであり、パブリック/プライベートサブネットやゲートウェイで通信を制御する",
          "AWS Direct Connect はオンプレミスと AWS を専用線で結び、インターネット経由の VPN より安定した帯域と低遅延を実現する",
        ],
        examTip: "「単一拠点障害に備えた冗長化」＝ 複数 AZ 配置。「世界中のユーザーへ静的・動的コンテンツを高速配信」＝ CloudFront（エッジロケーション）。",
      },
      {
        id: "clf-d3-t2",
        title: "コンピュート・サーバーレス・コンテナ・IaC・非同期連携",
        services: [
          "Amazon EC2",
          "AWS Lambda",
          "Amazon ECS",
          "AWS Fargate",
          "AWS Elastic Beanstalk",
          "Amazon Lightsail",
          "Amazon SQS",
          "Amazon SNS",
          "AWS CloudFormation",
        ],
        keyPoints: [
          "Amazon EC2 は OS やミドルウェアを自由に制御できる仮想サーバー。AWS Lambda はサーバー管理不要でイベント駆動・実行時間課金のサーバーレス関数",
          "Amazon ECS / EKS はコンテナオーケストレーションサービス、AWS Fargate はサーバー管理なしでコンテナを実行するサーバーレス基盤",
          "AWS Elastic Beanstalk はコードをアップロードするだけで環境構築・ELB・自動スケールを行う PaaS、Amazon Lightsail は定額料金のシンプルな VPS サービス",
          "Amazon SQS（メッセージキュー）と Amazon SNS（Pub/Sub 通知）で疎結合アーキテクチャを構築し、AWS CloudFormation でインフラ構成をテンプレートコード化 (IaC) する",
        ],
        examTip: "「コードを渡して環境構築を自動化」＝ Elastic Beanstalk。「手軽な定額 VPS」＝ Lightsail。「コードでインフラ再現」＝ CloudFormation。",
      },
      {
        id: "clf-d3-t3",
        title: "ストレージ・データベース・分析・AI/ML サービス",
        services: [
          "Amazon S3",
          "S3 Glacier",
          "Amazon EBS",
          "Amazon EFS",
          "Amazon RDS",
          "Amazon Aurora",
          "Amazon DynamoDB",
          "Amazon Redshift",
          "Amazon Bedrock",
          "Amazon SageMaker",
        ],
        keyPoints: [
          "オブジェクトストレージの Amazon S3（耐久性 99.999999999%）、長期アーカイブ向けの S3 Glacier、EC2 単体用ブロックストレージの Amazon EBS、複数 AZ・複数 EC2 共有ファイルシステムの Amazon EFS を使い分ける",
          "トランザクション処理にはマネージド RDB の Amazon RDS や高速・高可用な Amazon Aurora、ミリ秒応答のサーバーレス NoSQL には Amazon DynamoDB を選ぶ",
          "ペタバイト規模のデータウェアハウス分析 (OLAP) には Amazon Redshift、S3 データへのサーバーレス SQL 分析には Amazon Athena が適する",
          "生成 AI の基盤モデルを API で安全に活用する Amazon Bedrock や、機械学習モデルの構築・学習・デプロイを行う Amazon SageMaker など多様な AI/ML サービスがある",
        ],
        examTip: "「大容量 BI 集計」＝ Redshift、「スキーマレス高速 NoSQL」＝ DynamoDB、「複数 EC2 共有ストレージ」＝ EFS、「生成 AI モデル API」＝ Bedrock。",
      },
    ],
  },
  {
    id: "clf-domain-4",
    number: 4,
    title: "請求、料金、およびサポート",
    englishTitle: "Billing, Pricing, and Support",
    weight: 12,
    accentColor: "cyan",
    summary:
      "AWS 課金の基本要素、EC2 購入オプションの選定、見積り・分析・予算アラート・一括請求ツール、そして 4 種類のサポートプランと Trusted Advisor の違いが問われます。",
    topics: [
      {
        id: "clf-d4-t1",
        title: "AWS 料金モデルと EC2 購入オプション",
        services: [
          "オンデマンドインスタンス",
          "Savings Plans",
          "リザーブドインスタンス",
          "スポットインスタンス",
          "Dedicated Hosts",
        ],
        keyPoints: [
          "AWS 料金の基本 3 ドライバーは「コンピューティング」「ストレージ」「アウトバウンドデータ転送」（インターネットからのインバウンド転送は原則無料）",
          "オンデマンドは長期契約なしで柔軟、Savings Plans / リザーブドインスタンスは 1 年または 3 年のコミットメントで最大約 72% 割引となる",
          "スポットインスタンスは未使用キャパシティを活用しオンデマンド比最大 90% 割引だが、AWS がキャパシティを必要とする際は 2 分前通知で中断される",
          "Dedicated Hosts（専用ホスト）は物理サーバーを専有でき、既存ソフトウェアライセンスの持ち込み（BYOL：ソケット/コア単位課金）や厳格なコンプライアンスに対応する",
        ],
        examTip: "「中断許容バッチで最大割引」＝ スポット。「既存ライセンス BYOL」＝ Dedicated Hosts。「EC2・Fargate・Lambda を横断割引」＝ Compute Savings Plans。",
      },
      {
        id: "clf-d4-t2",
        title: "料金見積り・請求管理・マルチアカウント統合ツール",
        services: [
          "AWS Pricing Calculator",
          "AWS Cost Explorer",
          "AWS Budgets",
          "AWS Cost and Usage Report",
          "AWS Organizations",
          "コスト配分タグ",
        ],
        keyPoints: [
          "AWS Pricing Calculator は AWS 導入前に構成予定サービスの月額・年額コストを試算する見積りツール",
          "AWS Cost Explorer は過去および現在のコスト・使用量をグラフで可視化し、将来数か月の利用傾向を予測する",
          "AWS Budgets はコストや使用量が設定しきい値を超過した（または予測超過した）際にアラート通知を行い、Cost and Usage Report (CUR) は最も詳細な請求明細データを提供する",
          "AWS Organizations の一括請求（Consolidated Billing）により複数アカウントの請求を一本化し、使用量合算によるボリュームディスカウントやコスト配分タグによる部門別集計を実現する",
        ],
        examTip: "「導入前の事前見積り」＝ Pricing Calculator。「予算しきい値アラート」＝ Budgets。「一括請求と割引合算」＝ Organizations。",
      },
      {
        id: "clf-d4-t3",
        title: "AWS サポートプラン・診断ツール・技術支援リソース",
        services: [
          "AWS サポートプラン",
          "AWS Trusted Advisor",
          "AWS Health Dashboard",
          "AWS Marketplace",
          "AWS re:Post",
        ],
        keyPoints: [
          "サポートプランは Basic（無料・請求/アカウント問い合わせ可）、Developer（営業時間内メール技術サポート）、Business（24/7 電話/チャット/メール・本番ダウン 1 時間未満・Trusted Advisor 全チェック）、Enterprise（ビジネスクリティカル障害 15 分未満・専任 TAM）",
          "AWS Trusted Advisor は「コスト最適化・パフォーマンス・セキュリティ・耐障害性・サービスクォータ」の 5 カテゴリを自動点検しベストプラクティスを提案する",
          "AWS Health Dashboard は AWS サービス全体の稼働状況や自アカウントに影響するイベント・メンテナンス情報を通知する",
          "AWS Marketplace からサードパーティ製ソフトウェアを調達でき、公式 Q&A コミュニティの AWS re:Post で技術的な質問やナレッジ検索も行える",
        ],
        examTip: "「24/7 電話サポート＋Trusted Advisor 全項目を最小コストで」＝ Business。「専任 TAM＋15分以内応答」＝ Enterprise。「障害状況確認」＝ Health Dashboard。",
      },
    ],
  },
];

export const clfComparisons: SaaComparisonTable[] = [
  {
    id: "comp-clf-shared-responsibility",
    category: "セキュリティ",
    title: "AWS 責任共有モデル（Shared Responsibility Model）",
    subtitle: "「クラウドのセキュリティ（AWS）」と「クラウド内のセキュリティ（顧客）」の責任境界",
    columns: ["管理領域", "IaaS (Amazon EC2)", "マネージド / PaaS (RDS / S3 / Lambda)", "責任主体"],
    rows: [
      {
        feature: "物理データセンター・ハードウェア・ネットワーク基盤",
        values: ["AWS が管理", "AWS が管理", "常に AWS（クラウドのセキュリティ）"],
      },
      {
        feature: "仮想化層（ハイパーバイザー）・ホスト OS",
        values: ["AWS が管理", "AWS が管理", "常に AWS"],
      },
      {
        feature: "ゲスト OS パッチ・ランタイム・DB エンジン更新",
        values: ["顧客がパッチ適用・管理", "AWS が自動パッチ・管理", "サービス形態により変化"],
      },
      {
        feature: "ファイアウォール・ネットワーク設定 (Security Group / Network ACL)",
        values: ["顧客がルールを設定", "顧客がアクセス境界を設定", "顧客（クラウド内のセキュリティ）"],
      },
      {
        feature: "顧客データ・暗号化設定・IAM 権限 / MFA",
        values: ["顧客が管理・保護", "顧客が管理・保護", "常に顧客（全サービス共通）"],
      },
    ],
    decisionRule:
      "EC2 のゲスト OS パッチと顧客データ・IAM/MFA 設定は顧客責任。RDS/Lambda 等のマネージドサービスでは OS/DB 管理が AWS 側へ移ります。",
  },
  {
    id: "comp-clf-security-services",
    category: "セキュリティ",
    title: "セキュリティ・監査・暗号化・防御サービス比較",
    subtitle: "IAM / 監査証跡 / 脅威・脆弱性検知 / コンプライアンス / 境界防御の役割分担",
    columns: ["サービス", "カテゴリ", "主な役割と特徴"],
    rows: [
      {
        feature: "IAM / MFA / IAM Identity Center",
        values: ["認証・認可・SSO", "最小権限のアクセス制御、多要素認証 (MFA)、複数アカウントへのシングルサインオン管理"],
      },
      {
        feature: "AWS CloudTrail / AWS Config",
        values: ["操作監査 / 構成履歴", "CloudTrail は誰がいつどの API を実行したか記録。Config はリソース設定の変更履歴とルール準拠を評価"],
      },
      {
        feature: "Amazon GuardDuty / Amazon Inspector",
        values: ["脅威検知 / 脆弱性診断", "GuardDuty は ML で不審な挙動や不正アクセスを検知。Inspector は EC2・ECR・Lambda の脆弱性を自動スキャン"],
      },
      {
        feature: "Amazon Macie / AWS Artifact",
        values: ["PII 検出 / 認証文書", "Macie は S3 内の個人情報 (PII) を自動検出。Artifact は AWS の SOC/ISO 等コンプライアンスレポートを提供"],
      },
      {
        feature: "AWS KMS / AWS Secrets Manager",
        values: ["鍵管理 / シークレット", "KMS は暗号化キーの作成・制御。Secrets Manager は DB パスワード等の安全な保管と自動ローテーション"],
      },
      {
        feature: "AWS WAF / AWS Shield / Security Group / Network ACL",
        values: ["境界防御・DDoS", "WAF は L7 (SQLi/XSS) 防御。Shield Standard は無料の DDoS 対策。SG(許可のみ)/NACL(許可・拒否) は VPC 制御"],
      },
    ],
    decisionRule:
      "「API 操作履歴」＝ CloudTrail、「設定準拠」＝ Config、「脅威検知」＝ GuardDuty、「脆弱性」＝ Inspector、「S3 の PII」＝ Macie、「第三者認証文書」＝ Artifact。",
  },
  {
    id: "comp-clf-compute",
    category: "コンピュート",
    title: "コンピュート基礎比較（EC2 / Lambda / ECS / Elastic Beanstalk / Lightsail）",
    subtitle: "サーバー管理の自由度・自動化レベル・課金体系による使い分け",
    columns: ["サービス", "実行モデル", "運用管理の負担", "最適なユースケース"],
    rows: [
      {
        feature: "Amazon EC2",
        values: ["IaaS（仮想サーバー）", "OS・ミドルウェア・パッチを顧客が管理", "OS レベルの細かい制御や既存業務ソフトの移行、Auto Scaling 連携"],
      },
      {
        feature: "AWS Lambda",
        values: ["サーバーレス関数 (FaaS)", "サーバー管理不要（コードのみデプロイ）", "イベント駆動の短時間処理（最大 15 分）、実行回数と 1ms 単位の実行時間課金"],
      },
      {
        feature: "Amazon ECS / AWS Fargate",
        values: ["コンテナ / サーバーレス実行", "Fargate 利用時はサーバー管理不要", "Docker コンテナのマイクロサービス実行、EC2 上またはサーバーレスでの柔軟な運用"],
      },
      {
        feature: "AWS Elastic Beanstalk",
        values: ["PaaS（自動環境構築）", "プロビジョニング・ELB・スケールを自動化", "開発者がコードだけアップロードし Web アプリを迅速に展開したい場合"],
      },
      {
        feature: "Amazon Lightsail",
        values: ["簡易 VPS（定額プラン）", "事前構成済みの簡単管理画面", "小規模 Web サイト・ブログ・テスト環境を予測可能な月額固定料金で運用"],
      },
    ],
    decisionRule:
      "「OS から自由制御」＝ EC2、「コードのみで構築自動化 (PaaS)」＝ Elastic Beanstalk、「定額の簡易 VPS」＝ Lightsail、「サーバーレス関数」＝ Lambda。",
  },
  {
    id: "comp-clf-storage",
    category: "ストレージ",
    title: "ストレージ基礎比較（S3 / Glacier / EBS / EFS / Snowball Edge）",
    subtitle: "オブジェクト・ブロック・共有ファイル・物理データ移行の選定基準",
    columns: ["サービス", "ストレージ種別", "アクセス・接続形態", "特徴・代表的な用途"],
    rows: [
      {
        feature: "Amazon S3",
        values: ["オブジェクトストレージ", "HTTPS API / URL 経由", "耐久性 99.999999999% (11個の9)。画像・動画・バックアップ・静的 Web ホスティング"],
      },
      {
        feature: "S3 Glacier (Instant / Flexible / Deep Archive)",
        values: ["アーカイブストレージ", "S3 ライフサイクル等", "低頻度アクセス・長期保管向け超低価格クラス（Deep Archive は取り出し 12〜48 時間）"],
      },
      {
        feature: "Amazon EBS",
        values: ["ブロックストレージ", "単一 AZ の単一 EC2 に接続", "OS ルートボリュームや高速データベース領域。スナップショットを S3 に保存可能"],
      },
      {
        feature: "Amazon EFS",
        values: ["共有ファイル (NFS)", "複数 AZ・複数 EC2 から同時マウント", "Linux インスタンス間で共有する CMS コンテンツやアプリケーション共通ディレクトリ"],
      },
      {
        feature: "AWS Snowball Edge",
        values: ["物理データ転送・エッジ", "物理デバイスを配送", "ネットワーク帯域が限られる拠点から TB〜PB 規模のデータをオフラインで AWS へ移行"],
      },
    ],
    decisionRule:
      "「静的 Web や大容量ファイル」＝ S3、「単一 EC2 のディスク」＝ EBS、「複数 EC2 で共有マウント」＝ EFS、「物理ハードでの大量データ輸送」＝ Snowball Edge。",
  },
  {
    id: "comp-clf-database",
    category: "データベース",
    title: "データベース・分析・AI/ML 基礎比較（RDS / Aurora / DynamoDB / Redshift）",
    subtitle: "構造化・非構造化データ処理と生成 AI / 機械学習サービスの住み分け",
    columns: ["サービス", "データモデル / 分類", "主な特徴・用途"],
    rows: [
      {
        feature: "Amazon RDS",
        values: ["マネージド RDB (OLTP)", "MySQL / PostgreSQL / Oracle / SQL Server 等。Multi-AZ で自動フェイルオーバー、バックアップ自動化"],
      },
      {
        feature: "Amazon Aurora",
        values: ["クラウド最適化 RDB", "MySQL / PostgreSQL 互換。標準より最大 3〜5 倍高速、3 AZ に 6 コピー分散保存し高可用性"],
      },
      {
        feature: "Amazon DynamoDB",
        values: ["サーバーレス NoSQL", "キーバリュー / ドキュメント型。データ量に関わらず一桁ミリ秒の一貫した低遅延応答"],
      },
      {
        feature: "Amazon Redshift",
        values: ["データウェアハウス (OLAP)", "ペタバイト級データの高速集計 SQL・BI レポート分析に最適化された列指向 DWH"],
      },
      {
        feature: "Amazon Bedrock / Amazon SageMaker",
        values: ["生成 AI / 機械学習 (ML)", "Bedrock は主要基盤モデルをサーバーレス API で利用。SageMaker は独自 ML モデルの構築・学習・デプロイ"],
      },
    ],
    decisionRule:
      "「定型トランザクション RDB」＝ RDS/Aurora、「スキーマレス超高速 NoSQL」＝ DynamoDB、「大規模 BI 集計 (OLAP)」＝ Redshift、「生成 AI モデル活用」＝ Bedrock。",
  },
  {
    id: "comp-clf-global-infra",
    category: "ネットワーク",
    title: "グローバルインフラ＆ネットワーキング基礎（Region / AZ / Edge / Outposts）",
    subtitle: "高可用性・低遅延配信・ハイブリッド接続を支える物理＆論理ネットワーク基盤",
    columns: ["要素 / サービス", "配置・スコープ", "役割と試験での判断基準"],
    rows: [
      {
        feature: "リージョン (Region) / アベイラビリティーゾーン (AZ)",
        values: ["地理的拠点 / 独立 DC 群", "リージョンは法令・遅延・価格で選定。複数 AZ 分散により単一データセンター障害に耐える高可用性を実現"],
      },
      {
        feature: "エッジロケーション / Amazon CloudFront",
        values: ["世界中の配信拠点 (CDN)", "エンドユーザー最寄りのエッジに静的/動的コンテンツをキャッシュし、高速かつ低遅延で配信"],
      },
      {
        feature: "Amazon Route 53",
        values: ["グローバル DNS サービス", "ドメイン名の登録、IP アドレスへの名前解決、ヘルスチェック付きルーティングを提供"],
      },
      {
        feature: "Amazon VPC / AWS Direct Connect",
        values: ["論理分離ネットワーク / 専用線", "VPC はプライベートな仮想ネットワーク空間。Direct Connect はオンプレミスと専用線で安定・高速接続"],
      },
      {
        feature: "AWS Outposts",
        values: ["オンプレミス設置型 AWS 基盤", "顧客データセンター内に AWS ハードウェアを設置し、超低遅延処理やローカルデータ保持を実現"],
      },
    ],
    decisionRule:
      "「高可用性のための複数拠点分散」＝ 複数 AZ、「グローバル配信の高速化」＝ CloudFront（エッジロケーション）、「オンプレに AWS 機材設置」＝ Outposts。",
  },
  {
    id: "comp-clf-migration-concepts",
    category: "非同期・連携",
    title: "クラウド利点・移行 6R・AWS CAF・Well-Architected・疎結合 / IaC",
    subtitle: "クラウドコンセプトとアーキテクチャ設計・自動化・メッセージングの基礎",
    columns: ["概念 / サービス", "主要要素", "試験で見抜くキーワード"],
    rows: [
      {
        feature: "クラウドのメリット & ハイブリッドクラウド",
        values: ["従量課金 / エコノミクスオブスケール / スケーラビリティと弾力性 / アジリティ / グローバルインフラ", "固定費の変動費化、規模の経済による値下げ、数分で世界展開、オンプレミス＋AWS 協調のハイブリッドクラウド"],
      },
      {
        feature: "AWS Well-Architected フレームワーク",
        values: ["6 本の柱", "運用上の優秀性・セキュリティ・信頼性・パフォーマンス効率・コスト最適化・持続可能性"],
      },
      {
        feature: "AWS CAF (Cloud Adoption Framework)",
        values: ["6 つのパースペクティブ", "ビジネス・人材・ガバナンス・プラットフォーム・セキュリティ・運用の視点で組織の移行計画を策定"],
      },
      {
        feature: "移行の 6R / AWS Migration Hub",
        values: ["Rehost / Replatform / Refactor / Repurchase / Retire / Retain", "そのまま移行＝Rehost、SaaS へ切替＝Repurchase、移行進捗の統合追跡＝Migration Hub"],
      },
      {
        feature: "Amazon SQS / Amazon SNS / AWS CloudFormation",
        values: ["キュー / Pub/Sub / IaC", "SQS はメッセージキューで疎結合化、SNS は一斉通知、CloudFormation はテンプレートでインフラをコード自動構築"],
      },
    ],
    decisionRule:
      "「アプリ無改修リフト＆シフト」＝ Rehost、「組織全体の移行フレームワーク」＝ AWS CAF、「インフラのコード化 (IaC)」＝ CloudFormation。",
  },
  {
    id: "comp-clf-billing-tools",
    category: "コスト最適化",
    title: "料金・請求管理ツール & EC2 購入オプション比較",
    subtitle: "事前見積り・コスト分析・予算アラート・一括請求・EC2 割引モデルの使い分け",
    columns: ["ツール / 購入オプション", "利用タイミング・性質", "主な機能・割引・選定ポイント"],
    rows: [
      {
        feature: "AWS Pricing Calculator",
        values: ["導入前（事前見積り）", "利用予定サービスの構成を入力し、月額・年額の見積りコストを算出"],
      },
      {
        feature: "AWS Cost Explorer",
        values: ["導入後（分析・将来予測）", "過去の利用額・傾向をグラフで可視化し、Savings Plans / RI の購入推奨も提示"],
      },
      {
        feature: "AWS Budgets / AWS Cost and Usage Report (CUR)",
        values: ["予算通知 / 最詳細明細", "Budgets はコストや使用量のしきい値超過時に通知。CUR は最も詳細なリソース単位の請求明細を出力"],
      },
      {
        feature: "AWS Organizations (Consolidated Billing) / コスト配分タグ",
        values: ["マルチアカウント統合・部門集計", "複数アカウントの請求を一本化しボリュームディスカウントを合算。タグ付与で部門別・案件別集計が可能"],
      },
      {
        feature: "オンデマンド / Savings Plans / リザーブドインスタンス",
        values: ["柔軟従量 / 1〜3 年割引契約", "長期安定稼働では Savings Plans / RI で最大約 72% 割引（Compute SP は EC2/Fargate/Lambda に適用）"],
      },
      {
        feature: "スポットインスタンス / Dedicated Hosts",
        values: ["最大 90% 割引 / 物理専有", "中断可能なバッチはスポット（2 分前通知）。既存コアライセンス持ち込み (BYOL) には Dedicated Hosts"],
      },
    ],
    decisionRule:
      "「導入前見積り」＝ Pricing Calculator、「予算超過アラート」＝ Budgets、「過去可視化」＝ Cost Explorer、「一括請求」＝ Organizations、「BYOL」＝ Dedicated Hosts。",
  },
  {
    id: "comp-clf-support-plans",
    category: "コスト最適化",
    title: "AWS サポートプラン 4種比較（Basic / Developer / Business / Enterprise）",
    subtitle: "技術サポート体制・初回応答時間 SLA・Trusted Advisor・専任 TAM の違い",
    columns: ["比較項目", "Basic", "Developer", "Business", "Enterprise"],
    rows: [
      {
        feature: "サポート窓口・対象",
        values: ["請求・アカウント問合せのみ（無料）", "営業時間内のメール技術サポート（1 名）", "24/7 電話・チャット・メール（無制限）", "24/7 電話・チャット・メール（無制限）"],
      },
      {
        feature: "初回応答時間 SLA",
        values: ["技術サポートなし", "一般 24 時間未満 / 障害 12 時間未満", "本番システム障害 4 時間未満 / ダウン 1 時間未満", "ビジネスクリティカル障害 15 分未満"],
      },
      {
        feature: "AWS Trusted Advisor",
        values: ["コアチェックのみ（セキュリティ基本項目等）", "コアチェックのみ", "全チェック項目利用可能（5 カテゴリ）", "全チェック項目利用可能（5 カテゴリ）"],
      },
      {
        feature: "専任支援・関連リソース",
        values: ["AWS Health Dashboard / AWS re:Post / AWS Marketplace", "AWS Health Dashboard / ケース起票", "AWS Support API / Infrastructure Event Management (有料)", "専任 TAM (Technical Account Manager) / IEM 込み / Well-Architected レビュー"],
      },
    ],
    decisionRule:
      "「本番向けに 24/7 電話支援＋Trusted Advisor 全項目を最小コストで」＝ Business、「専任 TAM＋15 分以内応答」＝ Enterprise。",
  },
];

export const clfQuickLookup: SaaQuickLookupItem[] = [
  {
    keyword: "EC2 の OS パッチ適用や顧客データ暗号化の責任主体",
    category: "セキュリティ",
    recommended: "顧客（AWS 責任共有モデル）",
    reason: "物理環境やホスト基盤は AWS（「クラウドのセキュリティ」）、EC2 のゲスト OS や顧客データ・IAM は顧客（「クラウド内のセキュリティ」）の責任です。",
  },
  {
    keyword: "AWS の第三者認証レポート（SOC 2 / ISO 27001 / PCI DSS）の取得",
    category: "コンプライアンス",
    recommended: "AWS Artifact",
    reason: "AWS のセキュリティおよびコンプライアンスに関する監査レポートや契約書（BAA 等）へセルフサービスでアクセスできます。",
  },
  {
    keyword: "誰が・いつ・どの API を呼んだかの操作履歴追跡",
    category: "監査",
    recommended: "AWS CloudTrail",
    reason: "アカウント内の API コールおよびマネジメントコンソール操作を記録し、セキュリティ監査やインシデント調査に利用します。",
  },
  {
    keyword: "EC2・コンテナイメージ (ECR)・Lambda の脆弱性スキャン",
    category: "セキュリティ",
    recommended: "Amazon Inspector",
    reason: "ソフトウェアの脆弱性 (CVE) や意図しないネットワーク到達可能性を継続的に自動スキャンします。",
  },
  {
    keyword: "S3 バケット内の個人情報（PII）や機密データの自動発見",
    category: "セキュリティ",
    recommended: "Amazon Macie",
    reason: "機械学習とパターンマッチングにより、S3 内に保存された氏名・クレジットカード番号等の機密データを検出します。",
  },
  {
    keyword: "コードを渡すだけで Web アプリを自動構築・スケール (PaaS)",
    category: "コンピュート",
    recommended: "AWS Elastic Beanstalk",
    reason: "開発者はアプリケーションコードのみ用意すれば、EC2・ELB・Auto Scaling のプロビジョニングを自動化できます。",
  },
  {
    keyword: "予測可能な定額料金で小規模サイトや開発環境を簡単構築",
    category: "コンピュート",
    recommended: "Amazon Lightsail",
    reason: "仮想サーバー・ストレージ・データ転送がバンドルされた固定月額の VPS サービスです。",
  },
  {
    keyword: "オンプレミス施設内に AWS ハードウェアを設置して超低遅延処理",
    category: "ハイブリッド",
    recommended: "AWS Outposts",
    reason: "AWS と同じ API・ツール・コントロールプレーンを自社データセンター内で利用でき、データレジデンシー要件にも対応します。",
  },
  {
    keyword: "複数 AZ にまたがる複数の Linux EC2 から同時マウントする共有ストレージ",
    category: "ストレージ",
    recommended: "Amazon EFS",
    reason: "自動拡張するフルマネージド NFS ファイルシステムであり、複数 EC2 でファイルを共有できます。",
  },
  {
    keyword: "ペタバイト規模の構造化データを高速 SQL 分析する DWH",
    category: "データベース",
    recommended: "Amazon Redshift",
    reason: "OLAP / BI レポート向けに最適化されたフルマネージド・ペタバイト級データウェアハウスです。",
  },
  {
    keyword: "既存システムをコード改修なしでそのまま AWS へ移行 (6R)",
    category: "クラウド移行",
    recommended: "Rehost（リフト＆シフト）",
    reason: "最小限の労力で迅速にオンプレミスからクラウドへ移し、移行後に段階的な最適化を図れます。",
  },
  {
    keyword: "組織のクラウド移行準備を 6 つの視点で整理するフレームワーク",
    category: "クラウドコンセプト",
    recommended: "AWS CAF (Cloud Adoption Framework)",
    reason: "ビジネス・人材・ガバナンス・プラットフォーム・セキュリティ・運用の 6 パースペクティブで移行を支援します。",
  },
  {
    keyword: "AWS 導入前に構成予定サービスの月額コストを事前見積り",
    category: "請求・料金",
    recommended: "AWS Pricing Calculator",
    reason: "サービス種別やリージョン・稼働時間を選んで、構築前の概算利用料をシミュレーションできます。",
  },
  {
    keyword: "予算しきい値超過の事前アラート通知とコスト傾向グラフ分析",
    category: "請求・料金",
    recommended: "AWS Budgets / AWS Cost Explorer",
    reason: "予算アラートには AWS Budgets、過去支出の可視化と予測・割引推奨には Cost Explorer を使用します。",
  },
  {
    keyword: "複数アカウントの請求統合とボリュームディスカウント合算",
    category: "請求・ガバナンス",
    recommended: "AWS Organizations（一括請求）",
    reason: "Consolidated Billing により支払いを一本化し、グループ全体の利用量に応じた段階割引や RI/SP 共有が可能です。",
  },
  {
    keyword: "24/7 技術サポート＋Trusted Advisor 全チェックを最小コストで利用",
    category: "サポート",
    recommended: "Business サポートプラン（TAM 付きは Enterprise）",
    reason: "Business 以上で 24/7 電話/チャット/メール（本番ダウン 1h 未満）と Trusted Advisor 全項目が解放されます。",
  },
];

export const clfPracticeQuestions: SaaQuestion[] = [
  {
    id: "clf-q1",
    domainId: "clf-domain-1",
    domainLabel: "Domain 1: クラウドのコンセプト",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "企業がオンプレミスのデータセンターから AWS クラウドへ移行することで得られる経済的メリットとして、初期の固定設備投資（CapEx）を減らし、実際にリソースを使った分だけ支払う形態に切り替えられる特徴を何と呼びますか？",
    options: [
      "専用ハードウェアの買い切り契約",
      "従量課金モデル（変動費 / OpEx への転換）",
      "オンプレミス専有ライセンス",
      "長期固定データセンター賃料",
    ],
    correctIndices: [1],
    explanation:
      "AWS クラウドの主要なメリットの 1 つは、データセンターやサーバーの先行投資（固定費 / CapEx）を、利用したリソース量に応じた変動費（OpEx / 従量課金）へ置き換えられる点です。",
    keywords: ["従量課金", "CapEx vs OpEx", "クラウドのメリット"],
  },
  {
    id: "clf-q2",
    domainId: "clf-domain-1",
    domainLabel: "Domain 1: クラウドのコンセプト",
    difficulty: "標準",
    selectCount: 1,
    question:
      "ある企業は、データセンターの契約更新期限が迫っているため、既存の仮想マシン上の業務アプリケーションをコードやアーキテクチャを変更せずに、そのまま Amazon EC2 へ迅速に移行したいと考えています。AWS の移行戦略「6R」のどれに該当しますか？",
    options: [
      "Refactor（リファクタリング）",
      "Repurchase（リパーチェス）",
      "Rehost（リホスト / リフト＆シフト）",
      "Retire（リタイア）",
    ],
    correctIndices: [2],
    explanation:
      "アプリケーションに変更を加えずそのままクラウドへ移行する戦略は Rehost（リフト＆シフト）と呼ばれます。Refactor はクラウドネイティブに再設計、Repurchase は SaaS 等への製品乗り換え、Retire は不要システムの廃止を指します。",
    keywords: ["移行の6R", "Rehost", "リフト＆シフト"],
  },
  {
    id: "clf-q3",
    domainId: "clf-domain-1",
    domainLabel: "Domain 1: クラウドのコンセプト",
    difficulty: "標準",
    selectCount: 1,
    question:
      "製造工場の生産ラインにおいて、現地のセンサーデータをミリ秒単位の超低遅延でローカル処理しつつ、AWS クラウドと同じ API や管理ツールを用いてシームレスにハイブリッド運用を行いたいと考えています。最も適切な AWS サービスはどれですか？",
    options: [
      "AWS Outposts",
      "AWS Artifact",
      "AWS Pricing Calculator",
      "Amazon Lightsail",
    ],
    correctIndices: [0],
    explanation:
      "AWS Outposts は AWS が設計・管理するラックやサーバーを顧客のオンプレミス施設に設置し、ローカルでの超低遅延処理やデータレジデンシー要件を満たしながら AWS クラウドと同じ環境で運用できるハイブリッドサービスです。",
    keywords: ["AWS Outposts", "ハイブリッドクラウド", "低遅延ローカル処理"],
  },
  {
    id: "clf-q4",
    domainId: "clf-domain-1",
    domainLabel: "Domain 1: クラウドのコンセプト",
    difficulty: "標準",
    selectCount: 2,
    question:
      "AWS クラウドを採用することで組織が享受できる代表的なメリットとして正しいものを【2つ】選んでください。",
    options: [
      "世界中の複数のリージョンへ数分でデプロイでき、アジリティ（俊敏性）が向上する",
      "すべてのアプリケーション設定や顧客データのセキュリティ責任を AWS へ完全に委譲できる",
      "AWS の大規模利用によるエコノミクスオブスケール（規模の経済）により、低コストな従量課金が実現する",
      "新サービス検証のために物理サーバーの調達から 6 か月前後の準備期間を必ず確保できる",
      "利用量に関わらず毎月完全に同一の固定料金のみが課金される",
    ],
    correctIndices: [0, 2],
    explanation:
      "AWS クラウドは数分でグローバル展開できるアジリティと、AWS の規模の経済によるコスト削減メリットを提供します。なお、顧客データやアプリ設定のセキュリティ責任は顧客に残るため 2 番目は誤りです。",
    keywords: ["アジリティ", "エコノミクスオブスケール", "複数選択"],
  },
  {
    id: "clf-q5",
    domainId: "clf-domain-2",
    domainLabel: "Domain 2: セキュリティとコンプライアンス",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "AWS 責任共有モデルにおいて、Amazon EC2 インスタンスを利用している場合に「顧客」が責任を持つ項目はどれですか？",
    options: [
      "AWS データセンターの物理的な入退室管理と警備",
      "EC2 仮想化基盤（ハイパーバイザー）のセキュリティパッチ適用",
      "EC2 上のゲスト OS へのセキュリティパッチ適用および Security Group のルール設定",
      "破損した物理ストレージディスクの廃棄処理",
    ],
    correctIndices: [2],
    explanation:
      "EC2（IaaS）において、物理設備・ハイパーバイザー・ディスク廃棄は AWS（「クラウドのセキュリティ」）の責任であり、ゲスト OS パッチや Security Group・IAM・顧客データの保護は顧客（「クラウド内のセキュリティ」）の責任です。",
    keywords: ["責任共有モデル", "顧客責任", "Amazon EC2"],
  },
  {
    id: "clf-q6",
    domainId: "clf-domain-2",
    domainLabel: "Domain 2: セキュリティとコンプライアンス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "金融・監査部門から、AWS のデータセンターや基盤サービスが ISO 27001 や SOC 2、PCI DSS などの第三者セキュリティ認証に準拠していることを示す公式コンプライアンスレポートの提出を求められました。ダウンロードに使用する AWS サービスはどれですか？",
    options: [
      "Amazon Inspector",
      "AWS Artifact",
      "AWS Trusted Advisor",
      "Amazon GuardDuty",
    ],
    correctIndices: [1],
    explanation:
      "AWS Artifact は、AWS の各種コンプライアンスレポート（SOC、ISO、PCI 等）や BAA などのオンライン契約書をオンデマンドで取得できるポータルサービスです。",
    keywords: ["AWS Artifact", "コンプライアンスレポート", "SOC/ISO"],
  },
  {
    id: "clf-q7",
    domainId: "clf-domain-2",
    domainLabel: "Domain 2: セキュリティとコンプライアンス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "ある日、開発環境の Amazon EC2 インスタンスが予期せず削除されていることが発覚しました。「誰が・いつ・どの IP アドレスから」削除 API を呼び出したのかを追跡・調査するために確認すべきサービスはどれですか？",
    options: [
      "AWS CloudTrail",
      "Amazon Macie",
      "AWS Shield",
      "AWS Pricing Calculator",
    ],
    correctIndices: [0],
    explanation:
      "AWS CloudTrail は、AWS アカウント内で実行された API コールやマネジメントコンソール操作の監査ログ（ユーザー、時刻、送信元 IP、操作内容）を記録します。",
    keywords: ["AWS CloudTrail", "API監査ログ", "操作追跡"],
  },
  {
    id: "clf-q8",
    domainId: "clf-domain-2",
    domainLabel: "Domain 2: セキュリティとコンプライアンス",
    difficulty: "標準",
    selectCount: 2,
    question:
      "AWS IAM（Identity and Access Management）を安全に運用するためのベストプラクティスとして適切なものを【2つ】選んでください。",
    options: [
      "AWS アカウントのルートユーザーに多要素認証 (MFA) を有効化し、日常業務での利用を避ける",
      "管理の手間を省くため、すべての IAM ユーザーに AdministratorAccess 権限を付与する",
      "職務やアプリケーションに必要な権限だけを付与する「最小権限の原則」を適用する",
      "EC2 上のソースコード内に IAM ユーザーのアクセスキーを直接記述する",
      "チーム全員で 1 つのルートユーザーのパスワードを共有して作業する",
    ],
    correctIndices: [0, 2],
    explanation:
      "IAM の基本ベストプラクティスは、ルートユーザーの保護（MFA 有効化と日常利用の回避）および最小権限の原則の徹底です。EC2 からは静的キーではなく IAM ロールを使用します。",
    keywords: ["IAM", "MFA", "最小権限の原則"],
  },
  {
    id: "clf-q9",
    domainId: "clf-domain-3",
    domainLabel: "Domain 3: クラウドのテクノロジーとサービス",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "AWS において、同じリージョン内で電源・冷却・ネットワークが物理的に分離されており、火災や停電などの単一拠点障害からアプリケーションを保護するためにシステムを分散配置する構成単位はどれですか？",
    options: [
      "エッジロケーション",
      "アベイラビリティーゾーン (AZ)",
      "AWS Organizations",
      "AWS Budgets",
    ],
    correctIndices: [1],
    explanation:
      "アベイラビリティーゾーン (AZ) は、1 つのリージョン内で物理的に隔離された 1 つ以上のデータセンター群です。複数の AZ にリソースを分散（Multi-AZ）することで高い可用性と耐障害性を実現します。",
    keywords: ["アベイラビリティーゾーン", "高可用性", "グローバルインフラ"],
  },
  {
    id: "clf-q10",
    domainId: "clf-domain-3",
    domainLabel: "Domain 3: クラウドのテクノロジーとサービス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "開発チームは、EC2 インスタンスの構築やロードバランサー・Auto Scaling の設定を手動で管理することなく、Web アプリケーションのソースコードをアップロードするだけで自動的にデプロイ・スケーリングを行いたいと考えています。最も適したサービスはどれですか？",
    options: [
      "AWS Elastic Beanstalk",
      "Amazon Snowball Edge",
      "Amazon EFS",
      "AWS Direct Connect",
    ],
    correctIndices: [0],
    explanation:
      "AWS Elastic Beanstalk は PaaS として機能し、コードやコンテナをアップロードするだけでキャパシティのプロビジョニング、負荷分散、Auto Scaling、ヘルスモニタリングを自動処理します。",
    keywords: ["AWS Elastic Beanstalk", "PaaS", "自動デプロイ"],
  },
  {
    id: "clf-q11",
    domainId: "clf-domain-3",
    domainLabel: "Domain 3: クラウドのテクノロジーとサービス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "ペタバイト規模の構造化データ（売上履歴やアクセスログ）を集約し、BI ツールと連携して複雑な SQL 集計クエリや経営レポート分析（OLAP）を高速実行するためのフルマネージド・データウェアハウスサービスはどれですか？",
    options: [
      "Amazon DynamoDB",
      "Amazon Redshift",
      "Amazon EBS",
      "Amazon SQS",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Redshift は大規模データの集計分析 (OLAP) に最適化されたフルマネージドのデータウェアハウスサービスです。DynamoDB はトランザクションや高速キーバリュー検索向けの NoSQL、EBS はブロックストレージ、SQS はキューサービスです。",
    keywords: ["Amazon Redshift", "データウェアハウス", "BI分析"],
  },
  {
    id: "clf-q12",
    domainId: "clf-domain-3",
    domainLabel: "Domain 3: クラウドのテクノロジーとサービス",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "世界中のユーザーに対して、Web サイトの画像や動画などの静的コンテンツおよび API レスポンスを最寄りのエッジロケーションにキャッシュし、低遅延で高速配信するための AWS サービスはどれですか？",
    options: [
      "Amazon CloudFront",
      "AWS CloudTrail",
      "AWS Storage Gateway",
      "Amazon RDS",
    ],
    correctIndices: [0],
    explanation:
      "Amazon CloudFront は世界中のエッジロケーションを活用する高速コンテンツ配信ネットワーク (CDN) サービスで、ユーザーに近い拠点からキャッシュ配信することで遅延を大幅に低減します。",
    keywords: ["Amazon CloudFront", "エッジロケーション", "CDN"],
  },
  {
    id: "clf-q13",
    domainId: "clf-domain-4",
    domainLabel: "Domain 4: 請求、料金、およびサポート",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "企業はこれから新規システムを AWS 上に構築するにあたり、構成予定の EC2 インスタンスや RDS、S3 ストレージなどの月額利用料金を「導入前」に見積もりたいと考えています。使用する公式ツールはどれですか？",
    options: [
      "AWS Cost Explorer",
      "AWS Pricing Calculator",
      "AWS CloudTrail",
      "AWS Health Dashboard",
    ],
    correctIndices: [1],
    explanation:
      "AWS Pricing Calculator は、AWS 利用開始前にサービス構成やリージョンを入力して予想コストを試算するための見積りツールです。Cost Explorer は導入後の過去実績可視化・予測に用います。",
    keywords: ["AWS Pricing Calculator", "事前見積り", "料金試算"],
  },
  {
    id: "clf-q14",
    domainId: "clf-domain-4",
    domainLabel: "Domain 4: 請求、料金、およびサポート",
    difficulty: "標準",
    selectCount: 1,
    question:
      "金融シミュレーションや動画エンコードなど、途中で中断されてもチェックポイントから再開できるバッチ処理を Amazon EC2 上で実行します。オンデマンド料金と比較して最大 90% 近いコスト削減を実現できる最適な EC2 購入オプションはどれですか？",
    options: [
      "オンデマンドインスタンス",
      "スポットインスタンス",
      "Dedicated Hosts（専用ホスト）",
      "全額前払いスタンダードリザーブドインスタンス",
    ],
    correctIndices: [1],
    explanation:
      "スポットインスタンスは AWS の未使用 EC2 キャパシティを大幅に割引された料金（最大 90% 割引）で利用できます。2 分前の中断通知が発生する可能性があるため、中断・再開に耐えられるバッチ処理に最適です。",
    keywords: ["スポットインスタンス", "最大90%割引", "耐障害バッチ"],
  },
  {
    id: "clf-q15",
    domainId: "clf-domain-4",
    domainLabel: "Domain 4: 請求、料金、およびサポート",
    difficulty: "標準",
    selectCount: 1,
    question:
      "複数部門がそれぞれ独立した AWS アカウントを運用しています。AWS Organizations の一括請求（Consolidated Billing）を有効化することで得られる主なメリットはどれですか？",
    options: [
      "すべての開発者がルートアカウントのパスワードを共有できるようになる",
      "全アカウントの請求を一本化し、使用量の合算によるボリュームディスカウントや RI/Savings Plans の共有を受けられる",
      "メンバーアカウント内のすべての S3 ストレージ料金が永久に無料になる",
      "エンタープライズサポートの月額料金が全アカウントで無料になる",
    ],
    correctIndices: [1],
    explanation:
      "AWS Organizations の一括請求（Consolidated Billing）では、複数アカウントの請求を単一の支払方法へ統合し、利用量を合算してボリュームディスカウント（段階的割引）やリザーブドインスタンス / Savings Plans の割引をアカウント間で共有できます。",
    keywords: ["AWS Organizations", "一括請求", "ボリュームディスカウント"],
  },
  {
    id: "clf-q16",
    domainId: "clf-domain-4",
    domainLabel: "Domain 4: 請求、料金、およびサポート",
    difficulty: "標準",
    selectCount: 1,
    question:
      "本番稼働システムを運用する企業が、「24時間365日の電話・チャット・メールによる技術サポート」「本番システムダウン時の 1 時間未満の初回応答 SLA」「AWS Trusted Advisor の全チェック項目」を、最も低いサポートプランコストで満たしたい場合、どのプランを選ぶべきですか？",
    options: [
      "Basic サポートプラン",
      "Developer サポートプラン",
      "Business サポートプラン",
      "Enterprise サポートプラン",
    ],
    correctIndices: [2],
    explanation:
      "Business サポートプランは、24/7 技術サポート、本番システムダウン時 1 時間未満の応答 SLA、AWS Trusted Advisor の全チェック項目、AWS Support API を利用でき、本番環境向けの最もコスト効率が高い選択肢です（専任 TAM や 15 分応答が必須の場合は Enterprise）。",
    keywords: ["Business サポートプラン", "Trusted Advisor全チェック", "1時間SLA"],
  },
];

export const clfArchitecturePatterns: SaaArchitecturePattern[] = [
  {
    id: "clf-pat-web-ha",
    title: "高可用性マネージド Web アプリ基本構成",
    badge: "基本王道",
    flow: ["Amazon Route 53", "Amazon CloudFront", "ELB (複数 AZ)", "EC2 Auto Scaling", "Amazon RDS (Multi-AZ)"],
    summary:
      "複数アベイラビリティーゾーン (AZ) への分散配置と自動スケーリングにより、単一障害点を排除したクラウド標準構成。",
    keyDesignPoints: [
      "CloudFront により静的資産をエッジロケーションから低遅延配信し、オリジン負荷を軽減",
      "RDS Multi-AZ により障害時の自動フェイルオーバーを実現し、データベースの可用性を確保",
    ],
  },
  {
    id: "clf-pat-serverless",
    title: "サーバーレス Web & API 構成",
    badge: "運用最小化",
    flow: ["Amazon CloudFront", "Amazon S3 (静的UI)", "Amazon API Gateway", "AWS Lambda", "Amazon DynamoDB"],
    summary:
      "仮想サーバーの OS パッチ管理を不要にし、リクエスト量に応じた自動拡張と完全従量課金を実現する構成。",
    keyDesignPoints: [
      "AWS 責任共有モデル上、OS やランタイムの保守を AWS 側へオフロードして開発に集中可能",
      "アクセスゼロ時はコンピュート課金が発生せず、スパイク時も自動でスケールアウト",
    ],
  },
  {
    id: "clf-pat-hybrid",
    title: "オンプレミス連携＆段階的移行構成",
    badge: "ハイブリッド",
    flow: ["オンプレミス / Outposts", "AWS Direct Connect", "Amazon VPC", "AWS Snowball Edge", "Amazon S3"],
    summary:
      "自社データセンターと AWS を専用線や Outposts で接続し、大容量データを安全に移行・連携させる構成。",
    keyDesignPoints: [
      "オンライン回線で時間がかかる大容量データは AWS Snowball Edge でオフライン物理輸送",
      "超低遅延やデータ常駐要件がある処理は AWS Outposts でオンプレミス拠点に配置",
    ],
  },
  {
    id: "clf-pat-governance",
    title: "マルチアカウント統制＆コスト可視化構成",
    badge: "ガバナンス",
    flow: ["AWS Organizations", "IAM Identity Center", "CloudTrail + Config", "Cost Explorer", "AWS Budgets"],
    summary:
      "複数アカウントの請求と認証を一元統合し、操作監査と予算アラートを標準装備する組織向け基本構成。",
    keyDesignPoints: [
      "一括請求（Consolidated Billing）でボリュームディスカウントを合算し、コスト配分タグで部門集計",
      "CloudTrail で API 証跡を保全し、AWS Budgets で予算超過前にメール/SNS 通知",
    ],
  },
];

export const clfPitfalls: SaaPitfall[] = [
  {
    id: "clf-pit-shared-resp",
    trap: "AWS に移行すれば、OS パッチや顧客データの暗号化設定もすべて AWS が代行してくれると思う",
    whyWrong:
      "責任共有モデルでは、AWS は「クラウドのセキュリティ（物理・ホスト基盤）」を担い、顧客は「クラウド内のセキュリティ（データ・IAM・EC2 のゲスト OS パッチ等）」に責任を持ちます。",
    correctApproach:
      "サービス形態ごとに境界を確認し、EC2 のゲスト OS 更新や IAM・MFA・データ保護は顧客側の運用として設計する。",
  },
  {
    id: "clf-pit-cost-tools",
    trap: "AWS Pricing Calculator で今月の確定請求額を確認し、AWS Cost Explorer で予算アラートを送る",
    whyWrong:
      "Pricing Calculator は「導入前の見積り」専用ツールであり、実際の請求明細や予算アラート通知機能は持ちません。",
    correctApproach:
      "事前見積りは Pricing Calculator、過去コスト分析は Cost Explorer、予算超過アラートは AWS Budgets、詳細明細は CUR を使う。",
  },
  {
    id: "clf-pit-sg-deny",
    trap: "Security Group に特定の不正 IP アドレスを「拒否（Deny）」するルールを追加する",
    whyWrong:
      "Security Group はステートフルで「許可（Allow）」ルールのみ定義でき、明示的な拒否ルールは設定できません。",
    correctApproach:
      "サブネット単位での特定 IP 拒否には「Network ACL」、HTTP/L7 Web 攻撃や IP ブロックには「AWS WAF」を使用する。",
  },
  {
    id: "clf-pit-audit-tools",
    trap: "誰が EC2 を削除したか調べるために Amazon Inspector や AWS Artifact を確認する",
    whyWrong:
      "Inspector はソフトウェアの脆弱性診断、Artifact は AWS のコンプライアンス証明書取得サービスであり、API 操作ログは記録しません。",
    correctApproach:
      "API 操作の履歴（「誰が・いつ・何を」）は AWS CloudTrail、リソース設定変更履歴は AWS Config を確認する。",
  },
  {
    id: "clf-pit-support-plans",
    trap: "Basic または Developer サポートプランで、24/7 電話サポートや Trusted Advisor の全チェックが使えると思う",
    whyWrong:
      "Basic（無料）と Developer は Trusted Advisor のコアチェックのみ利用可能で、24/7 電話サポートにも対応していません。",
    correctApproach:
      "24/7 技術サポート・本番ダウン 1 時間以内 SLA・Trusted Advisor 全項目が必要なら Business 以上、専任 TAM と 15 分応答なら Enterprise を選ぶ。",
  },
  {
    id: "clf-pit-storage-mixup",
    trap: "複数台の EC2 から同時に読み書きする共有ファイル領域として Amazon EBS や Amazon S3 をマウントする",
    whyWrong:
      "EBS は原則として同一 AZ 内の単一 EC2 専用ブロックストレージであり、S3 は POSIX ファイルシステムではなくオブジェクトストレージです。",
    correctApproach:
      "複数 EC2/複数 AZ から NFS として同時共有マウントする場合は Amazon EFS、静的大容量ファイルの API 保存には Amazon S3 を使う。",
  },
];

export const clfKeyLimits: SaaLimitFact[] = [
  {
    id: "clf-lim-s3",
    service: "Amazon S3 耐久性",
    limitValue: "99.999999999% (11 個の 9)",
    detail: "標準クラスは複数 AZ にデータを自動冗長化し、単一オブジェクト最大 5 TB まで保存可能。",
  },
  {
    id: "clf-lim-support",
    service: "AWS サポートプラン応答 SLA",
    limitValue: "Enterprise 15 分未満 / Business 1 時間未満",
    detail: "Developer は営業時間内メール（一般 24h / 障害 12h 未満）、Business は本番ダウン 1h 未満、Enterprise はビジネスクリティカル障害 15 分未満＋専任 TAM。",
  },
  {
    id: "clf-lim-lambda",
    service: "AWS Lambda 実行時間と課金",
    limitValue: "最大 15 分 / 1ms 単位課金",
    detail: "リクエスト数と実行時間による完全従量課金（月 100 万リクエストの無料枠あり）。長時間バッチには ECS / Fargate や EC2 を使用。",
  },
  {
    id: "clf-lim-sp-ri",
    service: "Savings Plans / リザーブドインスタンス",
    limitValue: "1 年または 3 年契約（最大約 72% 割引）",
    detail: "全額前払い・一部前払い・前払いなしを選択でき、Compute Savings Plans は EC2・Fargate・Lambda へ柔軟に適用。",
  },
  {
    id: "clf-lim-spot",
    service: "EC2 スポットインスタンス",
    limitValue: "最大 90% 割引 / 2 分前中断通知",
    detail: "未使用キャパシティを活用。AWS 側の回収時には 2 分前の通知で中断されるため、中断許容ワークロード向け。",
  },
  {
    id: "clf-lim-az-subnet",
    service: "アベイラビリティーゾーン (AZ) と VPC サブネット",
    limitValue: "1 サブネット = 1 AZ / 複数データセンター独立",
    detail: "AZ は電源・冷却が独立した高可用性単位。VPC の 1 つのサブネットは 1 つの AZ 内に作成する。",
  },
];

export const clfOfficialResources: SaaOfficialResource[] = [
  {
    title: "AWS Certified Cloud Practitioner 公式試験ページ",
    description: "CLF-C02 の試験概要、最新の試験ガイド（PDF）、サンプル問題、受験予約の公式ページ。",
    url: "https://aws.amazon.com/jp/certification/certified-cloud-practitioner/",
    badge: "AWS公式",
  },
  {
    title: "AWS Skill Builder (公式デジタル学習プラットフォーム)",
    description: "Cloud Practitioner Essentials 日本語コースや CLF-C02 公式練習問題セットを提供。",
    url: "https://explore.skillbuilder.aws/learn",
    badge: "無料講座あり",
  },
  {
    title: "AWS 責任共有モデル 公式解説ページ",
    description: "「クラウドのセキュリティ (AWS)」と「クラウド内のセキュリティ (顧客)」の境界を図解で確認。",
    url: "https://aws.amazon.com/jp/compliance/shared-responsibility-model/",
    badge: "頻出基礎",
  },
  {
    title: "AWS サポートプラン比較（公式ページ）",
    description: "Basic / Developer / Business / Enterprise 各プランの対応時間 SLA と含まれる特典一覧。",
    url: "https://aws.amazon.com/jp/premiumsupport/plans/",
    badge: "料金・サポート",
  },
];

const CLF_SERVICE_QUERY_ALIASES: Record<string, string> = {
  "スケーラビリティと弾力性": "スケーラビリティ",
  "AWS Well-Architected": "Well-Architected",
  "移行の 6R": "6R",
  "リージョン / AZ": "AZ",
  "AWS Config": "AWS Config",
  "オンデマンドインスタンス": "オンデマンド",
  "AWS サポートプラン": "サポートプラン",
  "AWS Cost and Usage Report": "Cost and Usage Report",
};

/** 4ドメイン内のサービスバッジ名を、比較表・逆引き検索にヒットする正規化クエリへ変換する */
export function resolveClfServiceQuery(serviceName: string): string {
  const mapped = CLF_SERVICE_QUERY_ALIASES[serviceName];
  if (mapped) return mapped;
  return serviceName.replace(/^(Amazon|AWS)\s+/i, "").trim();
}
