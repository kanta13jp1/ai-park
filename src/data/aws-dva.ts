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

// 出典: AWS Certified Developer - Associate (DVA-C03) 公式試験ガイド (旧 DVA-C02 は 2026/11/30 終了・2026/12/01 より DVA-C03)
// https://docs.aws.amazon.com/ja_jp/aws-certification/latest/developer-associate-03/developer-associate-03.html
export const dvaExamFacts: SaaExamFact[] = [
  { label: "試験コード", value: "DVA-C03", detail: "Associate（旧DVA-C02は2026/11/30終了・12/01開始）" },
  { label: "試験時間", value: "130 分", detail: "約2時間10分" },
  { label: "問題数", value: "65 問", detail: "採点50問 + 非採点15問" },
  { label: "合格ライン", value: "720 点", detail: "100〜1000点スケール" },
  { label: "出題形式", value: "択一 / 複数", detail: "サーバーレス・コンテナ・AI統合・CI/CD開発最適化" },
  { label: "受験料", value: "$150 USD", detail: "ピアソンVUE / オンライン可" },
];

export const dvaDomains: SaaDomain[] = [
  {
    id: "dva-domain-1",
    number: 1,
    title: "AWS のサービスによる開発",
    englishTitle: "Development with AWS Services",
    weight: 30,
    accentColor: "indigo",
    summary:
      "出題比率最大の 30%（DVA-C03 改定）。AWS Lambda の呼び出しモデル・ESM・同時実行制御、API Gateway、SQS/SNS/EventBridge/Step Functions、DynamoDB の設計に加え、AI 支援開発ツールおよびマネージド AWS AI サービス統合（Amazon Bedrock 等）が問われます。",
    topics: [
      {
        id: "dva-d1-t1",
        title: "AWS Lambda の実行ライフサイクル・呼び出しモデル・同時実行制御",
        services: [
          "AWS Lambda",
          "Event Source Mapping",
          "Lambda Concurrency",
          "Lambda SnapStart",
          "Lambda Layers",
          "AWS Step Functions",
        ],
        keyPoints: [
          "同期呼び出し（API Gateway / ALB）は呼び出し元が応答を待ち Lambda 側の自動リトライなし。非同期呼び出し（S3 / SNS / EventBridge）は内部キューで最大 2 回自動リトライし、Destinations（OnSuccess/OnFailure）や DLQ を設定できる",
          "Event Source Mapping (ESM) は SQS / Kinesis / DynamoDB Streams をポーリングする。SQS では ReportBatchItemFailures による部分バッチ失敗返却、ストリームでは BisectBatchOnFunctionError による二分分割リトライが重要",
          "Reserved Concurrency は関数単位の最大・確保同時実行数を定義し（0 にするとスロットリング）、Provisioned Concurrency は事前初期化済み環境を常時ウォーム維持する（$LATEST ではなく発行済みバージョン/エイリアスが必須）",
          "Lambda SnapStart は初期化済み実行環境のスナップショットを保存してコールドスタートを大幅に短縮し、Lambda Layers（最大 5 層・合計解凍 250 MB 以下）は共通ライブラリを分離共有する",
        ],
        examTip:
          "「バッチ内の失敗レコードだけ再処理したい」＝ ESM の ReportBatchItemFailures。「ワークフローで人間承認や数日待機」＝ Step Functions Standard。",
      },
      {
        id: "dva-d1-t2",
        title: "Amazon API Gateway とイベント駆動・非同期メッセージング・AI 統合",
        services: [
          "Amazon API Gateway",
          "Amazon SQS",
          "Amazon SNS",
          "Amazon EventBridge",
          "Kinesis Data Streams",
          "DLQ",
          "Amazon Bedrock",
        ],
        keyPoints: [
          "API Gateway は REST API（Usage Plans/API Key/VTL/レスポンスキャッシュ/Private API 対応）、HTTP API（低遅延・低コスト・JWT/IAM 認可）、WebSocket API（$connect/$disconnect/$default による双方向通信）を使い分ける",
          "SQS Standard は高スループット・少なくとも 1 回配信、FIFO キューは厳密な順序（MessageGroupId）と 5 分間の重複排除（MessageDeduplicationId）を保証する（バッチなし 300 TPS / バッチあり 3,000 TPS）",
          "Amazon EventBridge はイベントの JSON コンテンツに基づく高度なルールフィルタリング・Input Transformer による整形・SaaS イベント連携・API Destinations を提供し、Kinesis Data Streams はシャード単位（入力 1 MB/s・出力 2 MB/s）でリアルタイム順序保持を担う",
          "DVA-C03 追加範囲: AI 支援開発ツールによる仕様駆動コード生成・自動レビュー・リファクタリングを活用し、Amazon Bedrock などのマネージド AWS AI サービスを SDK / 非同期パイプライン経由でアプリケーションに統合する",
        ],
        examTip:
          "「Usage Plans と API キーによるクライアント別スロットリング」や「レスポンスキャッシュ」が必要なら HTTP API ではなく REST API を選ぶ。",
      },
      {
        id: "dva-d1-t3",
        title: "データストア開発（DynamoDB / ElastiCache / S3 / RDS Proxy）",
        services: [
          "Amazon DynamoDB",
          "DynamoDB Streams",
          "DAX",
          "Amazon ElastiCache",
          "Amazon S3",
          "RDS Proxy",
        ],
        keyPoints: [
          "DynamoDB は 1 RCU = 4 KB までの強整合性読み取り 1 回/秒（結果整合性なら 2 回/秒）、1 WCU = 1 KB までの書き込み 1 回/秒。テーブル作成時のみ定義可能な LSI（同一 PK・10 GB 上限）と後から追加可能な GSI を使い分ける",
          "DynamoDB の Conditional Writes（ConditionExpression）で楽観的ロックを実装でき、TTL 属性（エポック秒）により期限切れアイテムを WCU 消費なしで 48 時間以内に自動削除できる",
          "DynamoDB Streams は変更イベント（KEYS_ONLY / NEW_IMAGE / OLD_IMAGE / NEW_AND_OLD_IMAGES）を 24 時間保持し、Lambda ESM と連携できる。DAX は DynamoDB API 互換のマイクロ秒インメモリキャッシュを提供する",
          "Amazon RDS Proxy は Lambda 関数からの大量・短命な DB コネクションをプーリングして DB 負荷とフェイルオーバー時間を削減し、ElastiCache (Redis/Valkey) はセッション・ランキング・汎用キャッシュを担う",
        ],
        examTip:
          "「Lambda スパイク時に RDS の max_connections 枯渇」＝ RDS Proxy。「DynamoDB 作成後に別キー検索追加」＝ GSI。",
      },
    ],
  },
  {
    id: "dva-domain-2",
    number: 2,
    title: "セキュリティ",
    englishTitle: "Security",
    weight: 26,
    accentColor: "emerald",
    summary:
      "出題比率 26%。Cognito 認証・Authorizer・IAM/STS/SigV4・KMS エンベロープ暗号化・Secrets 管理に加え、DVA-C03 新設 Task 2.3 の AI サービス利用セキュリティ（VPC エンドポイントプライベート接続・Bedrock Guardrails・エージェント認可/HITL）が問われます。",
    topics: [
      {
        id: "dva-d2-t1",
        title: "アプリケーション認証・認可（Cognito・Authorizer・IAM / STS・SigV4）",
        services: [
          "Amazon Cognito",
          "User Pools vs Identity Pools",
          "Lambda Authorizer",
          "IAM",
          "AWS STS",
          "SigV4",
        ],
        keyPoints: [
          "Cognito User Pools はサインアップ/サインイン・MFA・OIDC/SAML 連携を担い JWT（ID/Access/Refresh トークン）を発行する。Cognito Identity Pools は JWT や外部 IdP トークンを STS 経由で一時的な AWS IAM 認証情報へ交換する",
          "API Gateway の認可は Cognito Authorizer（User Pools JWT 検証）、Lambda Authorizer（TOKEN/REQUEST 型でカスタム認証し IAM ポリシーをキャッシュ）、IAM 認可（SigV4 署名＋リソースポリシー）を使い分ける",
          "AWS STS の AssumeRole / AssumeRoleWithWebIdentity で一時的認証情報を取得し、サードパーティとのクロスアカウント連携では Confused Deputy（混乱した代理）防止のため ExternalId 条件を付与する",
          "AWS SDK や IAM 認証付き API Gateway を手動 HTTP リクエストで呼び出す際は Signature Version 4 (SigV4) 署名が必要となる",
        ],
        examTip:
          "「モバイルアプリから S3 へ直接アップロードさせる一時認証情報」＝ Cognito Identity Pools。「カスタム Bearer トークン検証」＝ Lambda Authorizer。",
      },
      {
        id: "dva-d2-t2",
        title: "暗号化・鍵管理（KMS エンベロープ暗号化・S3 暗号化・ACM・CORS）",
        services: [
          "AWS KMS",
          "Envelope Encryption",
          "S3 Encryption",
          "ACM",
          "CORS",
        ],
        keyPoints: [
          "AWS KMS の直接 Encrypt API 上限は 4 KB。4 KB を超えるデータには Envelope Encryption（GenerateDataKey で平文 DEK と暗号化済み DEK を取得し、ローカルでデータ暗号化後に平文 DEK を破棄して暗号化済み DEK を保存）を使用する",
          "KMS Encryption Context（非機密のキー・バリュー対）を渡すと暗号文と結び付き改ざん検知と CloudTrail 監査ログ記録・ポリシー条件制御に活用できる",
          "S3 Encryption はデフォルトの SSE-S3、KMS でキーポリシー管理・監査可能な SSE-KMS（S3 Bucket Key で KMS API コールコストを削減）、顧客が鍵を管理する SSE-C を選択できる",
          "ACM (AWS Certificate Manager) で SSL/TLS 証明書を管理し、ブラウザのクロスオリジン通信では API Gateway（特に Lambda プロキシ統合時は Lambda レスポンス自体）や S3 バケットへ CORS ヘッダー（Access-Control-Allow-Origin 等）を設定する",
        ],
        examTip:
          "「4 KB を超えるファイルを KMS で暗号化」＝ GenerateDataKey によるエンベロープ暗号化。「Lambda プロキシ統合で CORS エラー」＝ Lambda レスポンスヘッダーに設定。",
      },
      {
        id: "dva-d2-t3",
        title: "シークレット保護・一時URL発行・AI サービス利用セキュリティ (Task 2.3)",
        services: [
          "AWS Secrets Manager",
          "Parameter Store",
          "S3 Presigned URL",
          "CloudFront Signed URL",
          "AWS WAF",
          "Bedrock Guardrails",
          "VPC Endpoint",
        ],
        keyPoints: [
          "AWS Secrets Manager は RDS/Aurora/Redshift 等の認証情報を保管し Lambda による自動ローテーションをネイティブ提供。Systems Manager Parameter Store は階層設定・KMS 暗号化 SecureString（Standard 無料・最大 4 KB）を管理する",
          "S3 Presigned URL（署名付き URL）や CloudFront Signed URL / Signed Cookie で時間制限付きの限定公開を行い、AWS WAF で L7 境界を防御する",
          "DVA-C03 Task 2.3（AI サービスセキュリティ）: Interface 型 VPC エンドポイントでプライベート接続してプロンプト/応答がモデル再学習に使われないようデータプライバシーを制御し、Amazon Bedrock Guardrails でコンテンツフィルタ・PII/PHI リダクション・拒否トピック・プロンプトインジェクション対策を強制する",
          "AI エージェントとの連携ではツール実行の最小権限認可・セッション分離・機密操作に対する Human-in-the-Loop (HITL) 承認フローを実装し、CloudWatch 等モニタリングログへの機密情報混入を防ぐ",
        ],
        examTip:
          "「AI 呼び出しを閉域化し入出力 PII 検出＋ツール認可」＝ Interface VPC Endpoint ＋ Bedrock Guardrails ＋ セッション分離/HITL承認。",
      },
    ],
  },
  {
    id: "dva-domain-3",
    number: 3,
    title: "テストとデプロイ",
    englishTitle: "Testing and Deployment",
    weight: 22,
    accentColor: "amber",
    summary:
      "出題比率 22%（DVA-C03 で「テストとデプロイ」へ改称）。AWS SAM / CloudFormation / CDK、SAM ユニットテスト・AI テスト生成、Amazon ECR コンテナイメージと ECS / EKS / Fargate デプロイ、CodePipeline/CodeDeploy が問われます。",
    topics: [
      {
        id: "dva-d3-t1",
        title: "IaC・テスト自動化・サーバーレス展開（SAM / CloudFormation / CDK）",
        services: [
          "AWS SAM",
          "AWS CloudFormation",
          "AWS CDK",
          "Lambda Versions & Aliases",
          "API Gateway Stages",
        ],
        keyPoints: [
          "AWS SAM は sam build / sam local invoke / sam package / sam deploy に加え、SAM を用いたユニットテスト（Task 3.2 再分類）および AutoPublishAlias + DeploymentPreference による安全な Canary/Linear 展開を自動化できる",
          "CloudFormation は Change Sets（変更セット）、Stack Policy、DeletionPolicy（Retain/Snapshot）、Outputs Export + Fn::ImportValue で安全に差分適用・スタック間連携を行う",
          "AWS CDK は TypeScript/Python 等の汎用言語（L1/L2/L3 Construct）でインフラを記述・ユニットテストし、cdk synth 経由で cdk deploy する。AWS AI ツールでテストケース生成や回帰テスト自動化を支援できる",
          "Lambda Versions / Aliases（加重トラフィック分割）と API Gateway Stages / Stage Variables（${stageVariables.alias}）を組み合わせて環境切替とカナリアリリースを行う",
        ],
        examTip:
          "「ローカルで Docker を使って Lambda と API Gateway をユニットテスト・検証」＝ sam local invoke / sam local start-api。",
      },
      {
        id: "dva-d3-t2",
        title: "CI/CD パイプラインとコンテナレジストリ（CodePipeline / CodeBuild / CodeDeploy / ECR）",
        services: [
          "AWS CodePipeline",
          "AWS CodeBuild",
          "AWS CodeDeploy",
          "Blue/Green & Canary",
          "Amazon ECR",
          "AWS CodeArtifact",
        ],
        keyPoints: [
          "AWS CodePipeline は Source → Build → Test → Deploy を S3 アーティファクト連携でオーケストレーションし、Manual Approval（手動承認）や AWS AI ツールによるデプロイ検証・自動承認判断を組み合わせる",
          "AWS CodeBuild は buildspec.yml で単体テストやビルドを実行し、Docker ビルド時は privilegedMode: true を有効化して Amazon ECR へプッシュする（ECR タグ付け・ライフサイクルポリシー・イメージ脆弱性スキャンも出題対象）",
          "AWS CodeDeploy は appspec.yml を使い EC2 / ECS / Lambda の Canary / Linear / Blue-Green 展開と BeforeAllowTraffic / AfterAllowTraffic フック検証＋CloudWatch アラーム連動自動ロールバックを行う",
          "AWS CodeArtifact は npm / PyPI / Maven / NuGet 等のプライベートパッケージ依存関係を安全に一元管理・キャッシュする",
        ],
        examTip:
          "「CodeBuild で Docker build が失敗する」＝ privilegedMode 未有効化。「ECR 古いイメージ自動削除＆脆弱性検知」＝ ECR ライフサイクルポリシー＆イメージスキャン。",
      },
      {
        id: "dva-d3-t3",
        title: "コンテナ（ECS / EKS / Fargate）・Elastic Beanstalk・AppConfig",
        services: [
          "AWS Elastic Beanstalk",
          "Amazon ECS",
          "Amazon EKS",
          "AWS Fargate",
          "AWS AppConfig",
        ],
        keyPoints: [
          "AWS Elastic Beanstalk は All at once / Rolling / Immutable / Traffic splitting / Blue-Green の各ポリシーを提供し、ダウンタイムなし・容量維持・高速ロールバックには Immutable を選ぶ",
          "DVA-C03 Task 3.3 強化: Amazon ECS のタスク定義と AWS Fargate 起動タイプ、または Amazon EKS マニフェスト（Deployment・ローリング更新）を用いてコンテナ化アプリをデプロイする（コンテナの IAM 権限には ECS Task Role を使用）",
          "AWS AppConfig はアプリの再デプロイなしにフィーチャーフラグや動的設定を JSON Schema / Lambda で検証し、アラーム監視付きで段階的ロールアウトする",
        ],
        examTip:
          "「コード再デプロイなしで機能フラグを段階配信＆自動ロールバック」＝ AWS AppConfig。「K8s 運用や Fargate タスク定義でロール分離」＝ ECS Task Role / EKS マニフェスト。",
      },
    ],
  },
  {
    id: "dva-domain-4",
    number: 4,
    title: "トラブルシューティングと最適化",
    englishTitle: "Troubleshooting and Optimization",
    weight: 22,
    accentColor: "cyan",
    summary:
      "出題比率 22%（DVA-C03 で拡大・Lambda パフォーマンスチューニングを再分類統合）。X-Ray 分散トレース（Annotations vs Metadata）、CloudWatch Logs Insights / EMF、AWS AI ツールを活用したエラー分析と最適化提案、コールドスタート/キャッシュ設計が問われます。",
    topics: [
      {
        id: "dva-d4-t1",
        title: "分散トレーシングと可観測性（AWS X-Ray / CloudWatch / CloudTrail）",
        services: [
          "AWS X-Ray",
          "Annotations vs Metadata",
          "CloudWatch Logs Insights",
          "CloudWatch EMF",
          "AWS CloudTrail",
        ],
        keyPoints: [
          "AWS X-Ray はリクエスト全体のサービスマップとレイテンシ内訳（Segments / Subsegments）を可視化する。Lambda では Active Tracing 有効化と IAM 権限、EC2/ECS では X-Ray デーモンまたは ADOT（OpenTelemetry）が必要",
          "X-Ray の Annotations（インデックス化されるキー・バリュー対）はフィルター式での検索・絞り込みが可能。Metadata（任意の JSON オブジェクト）はインデックスされず検索不可のためデバッグ補足情報に使う",
          "CloudWatch Logs Insights はロググループに対して fields / filter / stats / sort / parse クエリを実行し、エラー傾向やレイテンシ集計を高速分析できる",
          "CloudWatch Embedded Metric Format (EMF) は構造化 JSON ログ内に _aws メタデータ付きメトリクスを出力し、PutMetricData API の同期呼び出し遅延なしでカスタムメトリクスを非同期抽出できる。API 権限不足や操作履歴の調査には CloudTrail を確認する",
        ],
        examTip:
          "「X-Ray で特定顧客IDや注文状態でトレースを検索したい」＝ Metadata ではなく Annotations を使う。",
      },
      {
        id: "dva-d4-t2",
        title: "障害切り分け・API エラー分析・フォールトトレラント設計",
        services: [
          "Lambda Troubleshooting",
          "API Gateway Errors",
          "Exponential Backoff",
          "Dead Letter Queue",
        ],
        keyPoints: [
          "API Gateway のエラー切り分け: 400（リクエスト検証失敗）、401（Cognito/JWT 不正）、403（WAF/Resource Policy 拒否/API Key 欠如/SigV4 不正）、429（スロットリング）、502（Lambda プロキシ統合の戻り値 JSON 形式不正）、504（統合 29 秒タイムアウト超過）",
          "Lambda のスロットリング（429 TooManyRequestsException）はリージョン同時実行クォータ上限・Reserved Concurrency 到達・バースト制限が原因。非同期や ESM ではリトライ後に Dead Letter Queue (DLQ) や Destinations へ退避する",
          "外部 API や AWS SDK 呼び出しの一時的エラー（5xx / Throttling）には、リトライ間隔を倍増させつつランダムな揺らぎを加える Exponential Backoff with Jitter（指数バックオフ＋ジッター）を実装しリトライ集中を防ぐ",
          "べき等性（Idempotency）を保証する設計（DynamoDB の Conditional Writes や一意のトランザクション ID チェック）により、ネットワークリトライ時の二重課金・重複処理を防ぐ",
        ],
        examTip:
          "「API Gateway + Lambda プロキシ統合で 502 Bad Gateway」＝ statusCode / headers / body(文字列) の形式不備。",
      },
      {
        id: "dva-d4-t3",
        title: "パフォーマンスとコストの最適化（コールドスタート・キャッシュ・ポーリング）",
        services: [
          "Cold Start Optimization",
          "Provisioned Concurrency",
          "API Gateway Caching",
          "ElastiCache Caching Strategies",
          "SQS Long Polling",
        ],
        keyPoints: [
          "Lambda コールドスタート＆パフォーマンスチューニング（DVA-C03 D4 再分類）: SDK クライアントや DB 接続をハンドラー外で初期化して再利用し、不要パッケージ削減・適切なメモリ増量（CPU とネットワーク帯域も比例増加）・Provisioned Concurrency / SnapStart を組み合わせる。AWS AI ツールでボトルネック分析・最適化提案も可能",
          "API Gateway Caching（REST API ステージキャッシュ: 0.5 GB〜237 GB、TTL 0〜3,600 秒）で GET 応答をキャッシュし、バックエンド呼び出しと課金を削減できる（Cache-Control: max-age=0 でバイパス可）",
          "ElastiCache キャッシュ戦略: Lazy Loading（キャッシュミス時のみ DB 取得して格納・TTL で古いデータ対策）と Write-Through（DB 書き込み時に同時更新・常に最新だが書き込み遅延と未使用データの消費あり）を使い分ける",
          "SQS Long Polling（ReceiveMessageWaitTimeSeconds: 1〜20 秒）を設定すると空レスポンスを排除でき、受信コスト削減とレイテンシ改善を両立できる",
        ],
        examTip:
          "「Lambda の処理速度も遅く CPU バウンド」＝ メモリ設定を引き上げる（CPU が比例して増加し、結果的にコストが下がることもある）。",
      },
    ],
  },
];

export const dvaComparisons: SaaComparisonTable[] = [
  {
    id: "dva-comp-lambda",
    category: "コンピュート",
    title: "AWS Lambda 呼び出しモデル・Concurrency・SnapStart・ESM",
    subtitle: "同期/非同期/ポーリングのエラー処理とコールドスタート・同時実行制御の使い分け",
    columns: ["機能 / モデル", "仕組み・リトライ・設定", "主なユースケース・試験ポイント"],
    rows: [
      {
        feature: "同期呼び出し (Synchronous)",
        values: [
          "API Gateway / ALB / SDK (RequestResponse)。自動リトライなし（最大ペイロード 6 MB）",
          "即時レスポンスが必要な REST/HTTP API。呼び出し元でエラーハンドリング・リトライを実装",
        ],
      },
      {
        feature: "非同期呼び出し (Asynchronous)",
        values: [
          "S3 / SNS / EventBridge / SDK (Event)。内部キュー経由で最大 2 回自動リトライ（最大ペイロード 256 KB）",
          "失敗時は DLQ（SQS/SNS）または Lambda Destinations（OnSuccess/OnFailure 先に SQS/SNS/Lambda/EventBridge）へ送信",
        ],
      },
      {
        feature: "Event Source Mapping (ESM)",
        values: [
          "SQS / Kinesis / DynamoDB Streams を Lambda 側がポーリング（BatchSize / BatchingWindow 設定）",
          "SQS は ReportBatchItemFailures で失敗項目のみ再試行。ストリーム系は BisectBatchOnFunctionError でバッチ二分分割",
        ],
      },
      {
        feature: "Reserved Concurrency vs Provisioned Concurrency",
        values: [
          "Reserved: 同時実行数の上限保証（追加課金なし・0 で停止） / Provisioned: 事前ウォーム待機（追加課金・Version/Alias 必須）",
          "他関数からの枯渇防止や DB 負荷上限には Reserved。低遅延・コールドスタートゼロ要件には Provisioned Concurrency",
        ],
      },
      {
        feature: "Lambda SnapStart & Lambda Layers",
        values: [
          "SnapStart: 初期化済み MicroVM スナップショットから高速復元 / Layers: 最大 5 層（合計解凍 250 MB 以下）",
          "対応ランタイム（Java/Python/.NET）の起動高速化に SnapStart。共通ライブラリ・ランタイム依存の共有に Layers",
        ],
      },
    ],
    decisionRule:
      "「SQS バッチで成功分を二重処理したくない」＝ ESM の ReportBatchItemFailures。「1秒未満の定常レイテンシが必要」＝ Provisioned Concurrency または SnapStart。",
  },
  {
    id: "dva-comp-apigw",
    category: "ネットワーク",
    title: "Amazon API Gateway 種別・Authorizer・Stage・Caching・Errors",
    subtitle: "REST / HTTP / WebSocket API の違いと認可・ステージ変数・エラー切り分け",
    columns: ["項目 / 機能", "仕様・特徴", "選定・トラブルシュートポイント"],
    rows: [
      {
        feature: "REST API vs HTTP API vs WebSocket API",
        values: [
          "REST: 全機能（Usage Plans/API Key/VTL/Caching/Private） / HTTP: 低コスト・低遅延（JWT/IAM/Lambda Auth） / WebSocket: 双方向通信",
          "API キー課金・キャッシュ・リクエスト変換・WAF 直結が必要なら REST API。単純な JWT/IAM 連携と低遅延なら HTTP API",
        ],
      },
      {
        feature: "Authorizer（認可方式 4 種）",
        values: [
          "IAM (SigV4) / Cognito User Pools (JWT) / Lambda Authorizer (TOKEN・REQUEST 型、ポリシー最大 3,600 秒キャッシュ) / Resource Policy",
          "AWS 内サービス呼び出しは IAM、ユーザープール JWT は Cognito、外部 OAuth や独自ヘッダー検証は Lambda Authorizer",
        ],
      },
      {
        feature: "Stage / Stage Variables & API Gateway Caching",
        values: [
          "Stage Variables で ${stageVariables.alias} のようにバックエンドを動的に切替。REST ステージ単位で 0.5〜237 GB（TTL 0〜3,600 秒）キャッシュ",
          "dev/prod 環境で Lambda Alias を切り替える際に Stage Variables を活用。Canary リリースで段階的トラフィック分割も可",
        ],
      },
      {
        feature: "API Gateway Errors (4xx / 5xx) & CORS",
        values: [
          "401 (JWT 不正) / 403 (WAF/Resource Policy/Lambda Auth Deny) / 429 (スロットリング) / 502 (プロキシ JSON 形式不正) / 504 (29 秒超過)",
          "Lambda プロキシ統合で 502 が出る場合は { statusCode, headers, body(文字列) } 形式を確認。CORS ヘッダーも Lambda 側で返却",
        ],
      },
    ],
    decisionRule:
      "「Usage Plans / API Gateway Caching が必要」＝ REST API。「プロキシ統合で 502 Bad Gateway や CORS 失敗」＝ Lambda の返却形式とレスポンスヘッダーを確認。",
  },
  {
    id: "dva-comp-dynamodb",
    category: "データベース",
    title: "Amazon DynamoDB 設計・RCU/WCU・LSI vs GSI・Streams・DAX・TTL",
    subtitle: "キャパシティ計算、セカンダリインデックス、ストリーム連携、高速化・整合性制御",
    columns: ["機能 / 概念", "仕組み・制限値", "設計・試験対策のポイント"],
    rows: [
      {
        feature: "RCU / WCU & 整合性モデル",
        values: [
          "1 RCU = 4 KB 強整合性 1 回/秒（結果整合性 2 回/秒・トランザクション 2 RCU）。1 WCU = 1 KB 書き込み 1 回/秒（トランザクション 2 WCU）",
          "Provisioned（Auto Scaling 可）は安定負荷向け、On-Demand は予測不能スパイク向け。最大アイテムサイズ 400 KB",
        ],
      },
      {
        feature: "LSI vs GSI（セカンダリインデックス）",
        values: [
          "LSI: テーブル作成時のみ定義可・同一 PK・別 SK・ベース RCU/WCU 共有・10 GB 上限（最大 5） / GSI: 作成後も追加/削除可・別 PK 可・独立 RCU/WCU（結果整合性のみ）",
          "後からクエリパターンが増えた場合は GSI。GSI の WCU 不足はベーステーブルの書き込みもスロットリングする点に注意",
        ],
      },
      {
        feature: "Query vs Scan & FilterExpression",
        values: [
          "Query はパーティションキー指定で効率検索。Scan は全件走査（Parallel Scan で高速化可）。FilterExpression は読み込み後に除外",
          "FilterExpression を使っても RCU は全スキャン/クエリ対象分が消費されるため、コスト削減にはキー設計または GSI を使う",
        ],
      },
      {
        feature: "DynamoDB Streams & DAX",
        values: [
          "Streams: 変更ログを 24 時間保持（KEYS_ONLY / NEW_IMAGE / OLD_IMAGE / NEW_AND_OLD_IMAGES） / DAX: マイクロ秒インメモリキャッシュ",
          "非同期集計や通知連携には Streams + Lambda。読み取りマイクロ秒化には DAX（ただし強整合性読み取り時はバイパスされる）",
        ],
      },
      {
        feature: "TTL・Conditional Writes・Transactions",
        values: [
          "TTL: Unix エポック秒指定で WCU 消費なしに 48 時間以内自動削除 / Conditional Writes: attribute_not_exists 等の条件付き更新",
          "セッション失効や古いログ削除は TTL（厳密ならアプリ側でも期限フィルタ）。二重更新・楽観的ロックには Conditional Writes",
        ],
      },
    ],
    decisionRule:
      "「作成済みテーブルへ検索軸追加」＝ GSI。「FilterExpression でも RCU が減らない」＝ PK/GSI を見直す。「WCU 無料自動削除」＝ TTL。",
  },
  {
    id: "dva-comp-s3-cache",
    category: "ストレージ",
    title: "Amazon S3 開発連携・ElastiCache キャッシュ戦略・RDS Proxy",
    subtitle: "アプリからの安全な S3 アクセス、キャッシュパターン（Lazy Loading vs Write-Through）、DB コネクション管理",
    columns: ["サービス / 機能", "仕組み・特徴", "使い分け・試験ポイント"],
    rows: [
      {
        feature: "S3 Presigned URL & Multipart Upload",
        values: [
          "Presigned URL: IAM 権限に基づく期限付き GET/PUT URL。Multipart Upload: 100 MB 以上推奨（5 GB 超は必須、1 回 PUT 上限 5 GB）",
          "サーバーを経由せずクライアントから直接 S3 へ安全にアップロード/ダウンロードさせる場合は S3 Presigned URL を発行",
        ],
      },
      {
        feature: "S3 イベント通知 & CORS",
        values: [
          "ObjectCreated/Removed イベントを Lambda / SQS / SNS / EventBridge へ通知。ブラウザからの直接 PUT 等には S3 バケット CORS 設定が必要",
          "1 オブジェクトから複数後続処理へ分岐したい場合や詳細フィルタには S3 Event Notifications → EventBridge 連携が有効",
        ],
      },
      {
        feature: "ElastiCache Caching Strategies (Lazy Loading vs Write-Through)",
        values: [
          "Lazy Loading: キャッシュミス時のみ DB から取得し格納（TTL で鮮度制御） / Write-Through: DB 更新時にキャッシュも同時更新",
          "読み取り多・メモリ節約重視なら Lazy Loading。常に最新キャッシュが必要（かつ読み取り直前ミスを避けたい）なら Write-Through",
        ],
      },
      {
        feature: "RDS Proxy",
        values: [
          "Lambda 等からの多数・短命な接続をプーリングして RDS/Aurora へ再利用。IAM 認証・Secrets Manager 統合およびフェイルオーバー高速化",
          "サーバーレスアプリからのスパイクアクセスで RDS 接続数枯渇や接続遅延が起きる場合は RDS Proxy を前段に配置",
        ],
      },
    ],
    decisionRule:
      "「ブラウザから S3 へ直接大容量アップロード」＝ S3 Presigned URL + Multipart Upload + CORS。「Lambda から RDS 接続枯渇」＝ RDS Proxy。",
  },
  {
    id: "dva-comp-async",
    category: "非同期・連携",
    title: "SQS vs SNS vs EventBridge vs Step Functions vs Kinesis",
    subtitle: "非同期メッセージング・ストリーミング・ワークフロー・リトライ制御の選定",
    columns: ["サービス / 技術", "配信・実行モデル", "主な機能・開発者向け試験ポイント"],
    rows: [
      {
        feature: "Amazon SQS (Standard / FIFO / Long Polling / DLQ)",
        values: [
          "Pull 型 1 対 1 キュー。Visibility Timeout で二重処理防止、SQS Long Polling (WaitTimeSeconds 1〜20 秒) で空応答削減",
          "maxReceiveCount 超過で Dead Letter Queue (DLQ) へ退避。厳密順序・重複排除なら FIFO（MessageGroupId 単位で順序保証）",
        ],
      },
      {
        feature: "Amazon SNS",
        values: [
          "Push 型 1 対多 Pub/Sub。Filter Policies でサブスクライバ単位の属性/ペイロードフィルタリングが可能（FIFO Topic → FIFO SQS 対応）",
          "1 つのイベントを複数の独立コンシューマへ配信しつつ平準化する場合は SNS + 複数 SQS Fan-out 構成",
        ],
      },
      {
        feature: "Amazon EventBridge",
        values: [
          "サーバーレスイベントバス（AWS サービス・カスタムアプリ・SaaS 連携）。JSON 内容パターンマッチと Input Transformer による整形",
          "サービス間を疎結合にルーティングし、特定フィールド値での高度な振り分けや定期スケジュール実行を行う場合に最適",
        ],
      },
      {
        feature: "AWS Step Functions (Standard vs Express)",
        values: [
          "Standard: 最大 1 年・確実に 1 回実行・監査履歴・Callback (.waitForTaskToken) / Express: 最大 5 分・高スループット・少なくとも 1 回",
          "分散トランザクション（Saga パターン）、人手承認待ち、15 分超の長時間ワークフロー調整は Standard ワークフロー",
        ],
      },
      {
        feature: "Kinesis Data Streams & Exponential Backoff",
        values: [
          "Kinesis: シャード単位で時系列データ保持（24 時間〜365 日）・複数コンシューマ並列読取 / Exponential Backoff with Jitter: 指数バックオフ+揺らぎ",
          "Kinesis の ProvisionedThroughputExceededException や SDK スロットリング対策には Exponential Backoff + Jitter とシャーディング見直し",
        ],
      },
    ],
    decisionRule:
      "「空レスポンス課金削減」＝ SQS Long Polling。「リトライ地獄防止」＝ Exponential Backoff with Jitter。「人手承認含む状態遷移」＝ Step Functions Standard。",
  },
  {
    id: "dva-comp-security",
    category: "セキュリティ",
    title: "Cognito・IAM / STS / SigV4・KMS Envelope Encryption・Secrets 管理",
    subtitle: "アプリ認証認可・一時認証情報・暗号化・シークレット保管の正確な使い分け",
    columns: ["サービス / 機能", "役割・メカニズム", "選定と実装上の注意点"],
    rows: [
      {
        feature: "Amazon Cognito (User Pools vs Identity Pools)",
        values: [
          "User Pools: ユーザーディレクトリ・認証・JWT 発行 / Identity Pools: JWT 等を AWS STS 経由で一時 IAM 認証情報へ変換",
          "API Gateway 認証だけなら User Pools、クライアントから直接 S3/DynamoDB 等の AWS API を呼ぶなら Identity Pools を併用",
        ],
      },
      {
        feature: "IAM ロール / AWS STS / SigV4",
        values: [
          "STS AssumeRole / AssumeRoleWithWebIdentity で一時認証情報を発行。HTTP 署名には Signature Version 4 (SigV4) を使用",
          "コード・コンテナ・EC2・Lambda に静的アクセスキーを置かず IAM ロールを付与。外部委託先アカウント連携には ExternalId を必須化",
        ],
      },
      {
        feature: "AWS KMS & Envelope Encryption",
        values: [
          "直接 Encrypt 上限は 4 KB。4 KB 超は GenerateDataKey でデータキーを生成する Envelope Encryption（エンベロープ暗号化）を実施",
          "S3 Encryption (SSE-S3 / SSE-KMS / SSE-C) では SSE-KMS + S3 Bucket Key で KMS API 費用を抑制。Encryption Context で改ざん検証・監査強化",
        ],
      },
      {
        feature: "AWS Secrets Manager vs Parameter Store",
        values: [
          "Secrets Manager: ネイティブ自動ローテーション（RDS 等）・有料 / Parameter Store: 階層設定管理・SecureString・Standard 無料（4 KB 上限）",
          "自動ローテーションが必須なら Secrets Manager、安価なアプリケーション設定・機能フラグ・KMS 暗号化文字列保存は Parameter Store",
        ],
      },
      {
        feature: "ACM / AWS WAF / CloudFront Signed URL",
        values: [
          "ACM: 転送時 TLS 証明書（ALB/CloudFront/API GW 統合・自動更新） / WAF: L7 防御 / CloudFront Signed URL: エッジ限定配信",
          "API Gateway や CloudFront の HTTPS 終端には ACM。有料コンテンツや期限付きグローバル配布には CloudFront Signed URL / Cookie",
        ],
      },
      {
        feature: "Amazon Bedrock & Bedrock Guardrails（VPC Endpoint）",
        values: [
          "Interface VPC Endpoint で閉域接続し入出力のモデル学習オプトアウトを維持。Guardrails で PII/PHI 検出・拒否トピック・プロンプトインジェクション制御",
          "DVA-C03 Task 2.3 中核。AI エージェントのツール使用認可・セッション分離・HITL 承認およびログ内の機密データ保護を実施",
        ],
      },
    ],
    decisionRule:
      "「JWT 発行」＝ Cognito User Pools、「S3 直接アクセス用の一時 IAM 認証」＝ Identity Pools、「4 KB 超暗号化」＝ KMS Envelope Encryption、「AI 入出力の PII 制御と閉域接続」＝ Bedrock Guardrails ＋ VPC Endpoint。",
  },
  {
    id: "dva-comp-iac",
    category: "コンピュート",
    title: "AWS SAM vs CloudFormation vs AWS CDK vs Elastic Beanstalk vs AppConfig",
    subtitle: "IaC・サーバーレスデプロイ・PaaS・動的設定管理ツールの選定",
    columns: ["ツール / サービス", "記法・特徴", "主な用途・デプロイ機能"],
    rows: [
      {
        feature: "AWS SAM (Serverless Application Model)",
        values: [
          "YAML テンプレート（Transform: AWS::Serverless-2016-10-31）。sam local でローカル実行・デバッグ可能",
          "Lambda・API Gateway・DynamoDB 等のサーバーレス定義を簡潔化。AutoPublishAlias + DeploymentPreference で自動カナリア展開",
        ],
      },
      {
        feature: "AWS CloudFormation",
        values: [
          "宣言的 YAML/JSON で全 AWS リソースを定義。Change Sets・Drift Detection・Stack Policies・Nested Stacks・Export/Fn::ImportValue",
          "SAM や CDK の実行基盤。重要リソースの誤削除防止には DeletionPolicy: Retain や Stack Policy を設定",
        ],
      },
      {
        feature: "AWS CDK (Cloud Development Kit)",
        values: [
          "TypeScript/Python/Java 等の実プログラミング言語で L1/L2/L3 Construct を記述し、cdk synth で CloudFormation へ変換",
          "開発者が馴染んだ言語でループ・型安全・テスト可能な IaC を構築したい場合に最適（cdk diff / cdk deploy）",
        ],
      },
      {
        feature: "AWS Elastic Beanstalk",
        values: [
          "アプリコードと .ebextensions / .platform を渡すだけで EC2/ELB/ASG を自動管理する PaaS",
          "All at once（停止あり最速）/ Rolling / Rolling with additional batch / Immutable（無停止・新 ASG・高速ロールバック）/ Traffic splitting / Blue-Green",
        ],
      },
      {
        feature: "AWS AppConfig",
        values: [
          "アプリ再デプロイ不要で機能フラグや設定を動的配布（JSON Schema / Lambda 検証 + アラーム監視ロールバック）",
          "S3/Parameter Store/CodePipeline と連携し、本番設定変更のバリデーションと段階ロールアウトを実施",
        ],
      },
    ],
    decisionRule:
      "「サーバーレスをローカル検証＋最小 YAML」＝ AWS SAM。「プログラミング言語で IaC」＝ AWS CDK。「EC2 PaaS で無停止・高速ロールバック」＝ Elastic Beanstalk Immutable。",
  },
  {
    id: "dva-comp-cicd",
    category: "コンピュート",
    title: "CodePipeline / CodeBuild / CodeDeploy・Blue/Green & Canary・ECR / CodeArtifact",
    subtitle: "CI/CD パイプライン設計、buildspec/appspec 構造、トラフィックシフト戦略",
    columns: ["サービス / 戦略", "定義ファイル・動作", "試験での重要ポイント"],
    rows: [
      {
        feature: "AWS CodePipeline",
        values: [
          "Source → Build → Test → Deploy を自動オーケストレーション。各ステージ間アーティファクトは S3 バケット経由で受け渡し",
          "本番反映前の手動確認には Manual Approval アクションを挿入（SNS 通知可）。EventBridge 連携でパイプライン状態変更を通知",
        ],
      },
      {
        feature: "AWS CodeBuild (buildspec.yml)",
        values: [
          "phases（install / pre_build / build / post_build）、env（parameter-store / secrets-manager）、artifacts、cache、reports を記述",
          "ビルド内で Docker イメージ作成・Amazon ECR へプッシュするにはビルド環境で privilegedMode: true が必須",
        ],
      },
      {
        feature: "AWS CodeDeploy (appspec.yml) & ECS / EKS / AWS Fargate",
        values: [
          "EC2（In-place / Blue-Green）、Amazon ECS on AWS Fargate（Blue-Green）、Amazon EKS マニフェスト（Deployment ローリング更新）、Lambda（Versions & Aliases トラフィックシフト: Canary / Linear）に対応",
          "Lambda/ECS では BeforeAllowTraffic / AfterAllowTraffic フックで自動テストを実行。ECS タスク自体の AWS API 権限は Task Role に付与",
        ],
      },
      {
        feature: "トラフィックシフト (Blue/Green & Canary / Linear / All-at-once)",
        values: [
          "Canary: 初回 10% 等を移行し待機後に残り移行 / Linear: 一定間隔で均等割合ずつ移行 / All-at-once: 即時 100% 切替",
          "リスクを最小限に抑えて新バージョンを検証するなら Canary（例: Canary10Percent5Minutes）または Linear",
        ],
      },
      {
        feature: "Amazon ECR & AWS CodeArtifact",
        values: [
          "ECR: フルマネージド Docker コンテナレジストリ（タグ付け・ライフサイクルポリシー・イメージ脆弱性スキャン） / CodeArtifact: 依存パッケージ管理",
          "DVA-C03 Task 3.1/3.3 強化。古い未タグイメージ自動削除は ECR ライフサイクルポリシー、プライベート npm/PyPI 共有は CodeArtifact",
        ],
      },
    ],
    decisionRule:
      "「CodeBuild で docker build 実行」＝ privilegedMode: true。「トラフィック切替前の自動検証」＝ CodeDeploy appspec.yml の BeforeAllowTraffic フック。",
  },
  {
    id: "dva-comp-obs-opt",
    category: "コスト最適化",
    title: "AWS X-Ray・CloudWatch Logs Insights / EMF・アプリケーション最適化",
    subtitle: "分散トレーシング計装、ゼロ遅延メトリクス出力、レイテンシ・コスト削減手法",
    columns: ["機能 / 最適化手法", "仕組み・仕様", "診断・最適化の決め手"],
    rows: [
      {
        feature: "AWS X-Ray (Segment / Subsegment / Sampling)",
        values: [
          "Segment（各サービス実行情報）と Subsegment（下流 AWS/HTTP 呼び出し）を X-Ray デーモン / ADOT 経由で収集。サンプリング規則でコスト制御",
          "Lambda は Active Tracing 有効化＋IAM 権限、ECS はサイドカー等でデーモン稼働（UDP 2000）。ADOT で OpenTelemetry 計装も可",
        ],
      },
      {
        feature: "X-Ray Annotations vs Metadata",
        values: [
          "Annotations: インデックス化されるキー・バリュー対（トレース検索・Filter Expression 可） / Metadata: 非インデックス任意 JSON（検索不可）",
          "「特定ユーザー ID や注文 ID でエラーのトレースを抽出したい」場合は必ず Annotations を使う（Metadata では検索できない）",
        ],
      },
      {
        feature: "CloudWatch Logs Insights & CloudWatch EMF",
        values: [
          "Logs Insights: 専用クエリ構文（fields/filter/stats/sort/parse）でログ高速分析。EMF: ログ内の _aws JSON から非同期メトリクス生成",
          "Lambda から高頻度カスタムメトリクスを低遅延・低 API コストで記録したい場合は PutMetricData ではなく CloudWatch EMF を使用",
        ],
      },
      {
        feature: "CloudTrail & Cold Start Optimization",
        values: [
          "CloudTrail: IAM 権限エラー（AccessDenied）やデプロイ操作の API 監査。コールドスタート対策: ハンドラー外での SDK/DB 初期化・メモリ調整・Provisioned Concurrency/SnapStart",
          "Lambda 実行時間の短縮と CPU 増強にはメモリ引き上げが有効。VPC 内 Lambda でも現在は Hyperplane ENI により VPC コールドスタート遅延は大幅に改善済み",
        ],
      },
    ],
    decisionRule:
      "「X-Ray で特定 ID 検索」＝ Annotations。「カスタムメトリクス記録時の同期 API 遅延排除」＝ CloudWatch EMF。「CPU 不足による処理遅延」＝ Lambda メモリ引き上げ。",
  },
];

export const dvaQuickLookup: SaaQuickLookupItem[] = [
  {
    keyword: "SQS バッチ内の失敗メッセージだけを再試行させたい",
    category: "Lambda / ESM",
    recommended: "ReportBatchItemFailures (Partial Batch Response)",
    reason: "Lambda Event Source Mapping で有効化し、失敗した messageId のみを batchItemFailures 配列で返却することで成功済みメッセージの再処理を防止できます。",
  },
  {
    keyword: "Lambda 非同期呼び出しの失敗イベントと原因を保持・ルーティングしたい",
    category: "非同期処理",
    recommended: "Lambda Destinations (OnFailure / OnSuccess) / DLQ",
    reason: "非同期呼び出しの最大 2 回リトライ後に失敗した場合、Destinations なら詳細メタデータ付きで SQS/SNS/Lambda/EventBridge へ送信できます。",
  },
  {
    keyword: "クライアント別レート制限と API キー管理・レスポンスキャッシュが必要",
    category: "API Gateway",
    recommended: "API Gateway REST API (Usage Plans + API Gateway Caching)",
    reason: "HTTP API は低コスト・低遅延ですが Usage Plans・API キー・ステージレスポンスキャッシュに非対応のため、REST API を選択します。",
  },
  {
    keyword: "DynamoDB テーブル作成後に新しい検索キーを追加したい",
    category: "データベース",
    recommended: "GSI (Global Secondary Index)",
    reason: "LSI はテーブル作成時のみ定義可能です。作成済みテーブルへ別のパーティションキー・ソートキーで検索軸を追加する場合は GSI を使います。",
  },
  {
    keyword: "DynamoDB で期限切れデータを WCU 消費なしで自動削除したい",
    category: "データベース",
    recommended: "DynamoDB TTL (Time to Live)",
    reason: "Unix エポック秒の属性を指定すると、期限経過後 48 時間以内にバックグラウンドで書き込みキャパシティを消費せず自動削除されます。",
  },
  {
    keyword: "DynamoDB への同時更新による上書き競合（ロストアップデート）を防ぎたい",
    category: "データベース",
    recommended: "Conditional Writes (ConditionExpression / 楽観的ロック)",
    reason: "attribute_not_exists やバージョン番号一致の ConditionExpression を付与することで、条件を満たさない競合書き込みを原子的に拒否できます。",
  },
  {
    keyword: "Web/モバイルアプリから S3 や DynamoDB へ直接アクセスする一時認証を発行したい",
    category: "セキュリティ",
    recommended: "Amazon Cognito Identity Pools (フェデレーテッドアイデンティティ)",
    reason: "User Pools が発行する JWT や外部 IdP トークンを AWS STS 経由で一時的な IAM 認証情報（AccessKey/SecretKey/SessionToken）へ交換します。",
  },
  {
    keyword: "4 KB を超える大きなデータやファイルを AWS KMS で暗号化したい",
    category: "セキュリティ",
    recommended: "Envelope Encryption (KMS GenerateDataKey)",
    reason: "KMS の直接 Encrypt API は 4 KB 上限があるため、GenerateDataKey でデータキー（DEK）を取得しローカルで暗号化するエンベロープ暗号化を用います。",
  },
  {
    keyword: "RDS データベースのパスワードをコード変更なしで定期自動ローテーションしたい",
    category: "セキュリティ",
    recommended: "AWS Secrets Manager",
    reason: "Parameter Store には組み込みの自動ローテーション機能がありません。Secrets Manager なら Lambda による自動ローテーションを標準利用できます。",
  },
  {
    keyword: "クライアントに S3 バケットを公開せず期限付きでファイルを直接アップロードさせたい",
    category: "ストレージ",
    recommended: "S3 Presigned URL (署名付き URL)",
    reason: "発行者の IAM 権限を利用して有効期限付きの署名付き URL を生成し、バックエンドサーバーに負荷をかけず直接 PUT/GET させられます。",
  },
  {
    keyword: "サーバーレスアプリをローカルで Docker 実行・テストしカナリア展開したい",
    category: "デプロイ",
    recommended: "AWS SAM (sam local / DeploymentPreference)",
    reason: "sam local invoke / start-api によるローカルデバッグと、AutoPublishAlias + DeploymentPreference による CodeDeploy カナリア展開を統合できます。",
  },
  {
    keyword: "CodeBuild の buildspec.yml 内で Docker イメージをビルドして ECR へ Push したい",
    category: "CI/CD",
    recommended: "CodeBuild 環境設定で privilegedMode: true を有効化",
    reason: "特権モード（Privileged）を有効化しないと CodeBuild コンテナ内の Docker デーモンが起動できず docker build が失敗します。",
  },
  {
    keyword: "Lambda のコールドスタートをなくし全ランタイムでミリ秒応答を維持したい",
    category: "最適化",
    recommended: "Provisioned Concurrency (+ ハンドラー外での SDK 初期化)",
    reason: "指定数の実行環境を事前に初期化済みで常時待機させるため、突発トラフィックでもコールドスタートを回避できます（発行済み Alias/Version 必須）。",
  },
  {
    keyword: "Lambda の同時スパイクによる RDS / Aurora の接続数枯渇を防ぎたい",
    category: "データベース",
    recommended: "Amazon RDS Proxy",
    reason: "Lambda からの大量の短命コネクションをプーリング・共有し、DB 側のメモリ・接続数枯渇やフェイルオーバー時のダウンタイムを削減します。",
  },
  {
    keyword: "AWS X-Ray のトレースを顧客 ID や注文タイプでフィルタリング・検索したい",
    category: "可観測性",
    recommended: "X-Ray Annotations（Metadata は検索不可）",
    reason: "Annotations は X-Ray コンソール/API でインデックス化されフィルター式に使えますが、Metadata は保存されるだけで検索対象になりません。",
  },
  {
    keyword: "Lambda の処理時間を増やさずにカスタムメトリクスを高頻度で記録したい",
    category: "可観測性",
    recommended: "CloudWatch Embedded Metric Format (EMF)",
    reason: "標準出力に _aws メタデータ付き JSON ログを書き出すだけで、同期的な PutMetricData API 呼び出し遅延なしにカスタムメトリクスを非同期抽出できます。",
  },
  {
    keyword: "Elastic Beanstalk でダウンタイムなし・容量維持・即時ロールバック可能な更新をしたい",
    category: "デプロイ",
    recommended: "Immutable デプロイポリシー（または Blue/Green）",
    reason: "新しい Auto Scaling グループで新規インスタンスを起動・ヘルスチェック後に切り替えるため、既存環境を傷つけず失敗時は即座に切り戻せます。",
  },
  {
    keyword: "SQS キューの空ポーリング課金と受信遅延を減らしたい",
    category: "最適化",
    recommended: "SQS Long Polling (ReceiveMessageWaitTimeSeconds: 1〜20 秒)",
    reason: "メッセージ到着まで接続を最大 20 秒待機させることで、空のレスポンス回数と API リクエスト課金を大幅に削減できます。",
  },
  {
    keyword: "生成 AI アプリへの入出力から PII をマスクしインターネット非経由で接続したい",
    category: "セキュリティ",
    recommended: "Amazon Bedrock Guardrails + Interface VPC Endpoint",
    reason: "DVA-C03 Task 2.3 対応。PrivateLink 接続とモデル学習オプトアウトを保ちつつ、PII/PHI リダクションとプロンプトインジェクション制御を強制できます。",
  },
  {
    keyword: "コンテナイメージの脆弱性スキャンと古い未タグイメージの自動削除を行いたい",
    category: "テスト・デプロイ",
    recommended: "Amazon ECR（スキャン + ライフサイクルポリシー）& ECS / EKS",
    reason: "DVA-C03 Domain 3 強化。ECR ライフサイクルポリシーで不要イメージを自動整理し、スキャン後に ECS Fargate / EKS へ安全にデプロイします。",
  },
];

export const dvaPracticeQuestions: SaaQuestion[] = [
  {
    id: "dva-q1",
    domainId: "dva-domain-1",
    domainLabel: "Domain 1: AWS のサービスによる開発",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "Amazon SQS スタンダードキューをイベントソースマッピング（ESM）として AWS Lambda 関数をトリガーしています。最大 10 件のメッセージを含むバッチ処理のうち、3 件目だけが処理に失敗し残りの 9 件は正常に完了しました。成功した 9 件を再処理させず、失敗した 3 件目だけをキューに戻してリトライさせる最も適切な実装はどれですか？",
    options: [
      "バッチ内で 1 件でも例外が発生したら関数全体からエラーをスローする",
      "イベントソースマッピングで ReportBatchItemFailures を有効にし、関数から失敗したメッセージ ID を含む batchItemFailures を返却する",
      "Lambda 関数に非同期呼び出し用の Dead Letter Queue (DLQ) を直接設定する",
      "SQS キューの可視性タイムアウトを 0 秒に設定する",
    ],
    correctIndices: [1],
    explanation:
      "SQS の Event Source Mapping で `FunctionResponseTypes: [\"ReportBatchItemFailures\"]` を有効にし、関数から `{ \"batchItemFailures\": [{ \"itemIdentifier\": \"<messageId>\" }] }` を返すことで、成功分は削除され失敗したメッセージのみが再試行されます。",
    keywords: ["Lambda ESM", "SQS", "ReportBatchItemFailures"],
  },
  {
    id: "dva-q2",
    domainId: "dva-domain-1",
    domainLabel: "Domain 1: AWS のサービスによる開発",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Amazon DynamoDB テーブル（パーティションキー: `userId`、ソートキー: `createdAt`）から特定ユーザーの過去ログを取得する際、開発者が `Scan` API と `FilterExpression`（`userId = :u`）を組み合わせたところ、取得件数が少ないにもかかわらず RCU の消費量が非常に多くなっています。RCU 消費を最小化し効率的に取得するための最善の改善策はどれですか？",
    options: [
      "FilterExpression の条件を増やして返却属性を絞り込む",
      "ProjectionExpression を追加して RCU 消費量を半分にする",
      "Scan の代わりに Query API を使用し、KeyConditionExpression でパーティションキー `userId` を指定する",
      "読み込み整合性を強整合性（ConsistentRead: true）に変更する",
    ],
    correctIndices: [2],
    explanation:
      "DynamoDB の `FilterExpression` や `ProjectionExpression` はテーブルからアイテムを読み込んだ「後」に適用されるため、スキャンした全データ分の RCU が消費されます。パーティションキーを指定できる場合は必ず `Query` API（`KeyConditionExpression`）を使用します。",
    keywords: ["DynamoDB", "Query vs Scan", "FilterExpression"],
  },
  {
    id: "dva-q3",
    domainId: "dva-domain-1",
    domainLabel: "Domain 1: AWS のサービスによる開発",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Amazon S3 のオブジェクト作成イベントから非同期で AWS Lambda 関数を呼び出しています。外部決済 API の一時停止により Lambda 関数が失敗した場合、自動リトライ完了後に「失敗した元イベント JSON」に加えて「エラー内容とスタックトレースを含む詳細ペイロード」を Amazon EventBridge へ送信したいと考えています。最も適切な機能はどれですか？",
    options: [
      "Lambda の同期呼び出し用 DLQ（SQS）",
      "Lambda Destinations（送信先）の OnFailure ターゲットとして EventBridge を設定する",
      "Lambda 関数の Reserved Concurrency を 0 に設定する",
      "S3 バケットのライフサイクルルールで失敗ログを転送する",
    ],
    correctIndices: [1],
    explanation:
      "非同期呼び出しのエラー処理では、従来の DLQ（SQS/SNS のみ、元イベントペイロードのみ）に代わり Lambda Destinations が推奨されます。Destinations なら OnSuccess / OnFailure の送信先に SQS・SNS・Lambda・EventBridge を指定でき、リクエストとレスポンスコンテキスト（エラー詳細含む）を自動で渡せます。",
    keywords: ["Lambda Destinations", "非同期呼び出し", "EventBridge"],
  },
  {
    id: "dva-q4",
    domainId: "dva-domain-1",
    domainLabel: "Domain 1: AWS のサービスによる開発",
    difficulty: "標準",
    selectCount: 2,
    question:
      "Amazon DynamoDB を用いた予約・セッション管理システムを開発しています。「複数のワーカーが同時に同じ予約レコードを上書き更新する競合（ロストアップデート）を防ぐこと」と、「有効期限切れのセッションデータを書き込みキャパシティ（WCU）を消費せずに自動削除すること」の 2 要件を満たすための機能を【2つ】選んでください。",
    options: [
      "UpdateItem / PutItem 実行時に ConditionExpression による Conditional Writes（楽観的ロック）を実装する",
      "定期的に全テーブルを Scan して期限切れレコードを BatchWriteItem で削除する Lambda を動かす",
      "テーブルに有効期限（Unix エポック秒）を格納する属性を定義し、DynamoDB TTL (Time to Live) を有効化する",
      "ローカルセカンダリインデックス (LSI) をテーブル作成後に追加する",
      "Amazon DAX クラスターを有効化してすべての書き込みリクエストをキャッシュさせる",
    ],
    correctIndices: [0, 2],
    explanation:
      "同時更新の競合防止には `ConditionExpression` を用いた Conditional Writes（例: バージョン番号一致や `attribute_not_exists`）を使用します。また、有効期限切れアイテムの無料自動削除（WCU 消費なし）には DynamoDB TTL を利用します（LSI はテーブル作成後には追加できません）。",
    keywords: ["Conditional Writes", "DynamoDB TTL", "複数選択"],
  },
  {
    id: "dva-q5",
    domainId: "dva-domain-2",
    domainLabel: "Domain 2: セキュリティ",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "モバイルアプリケーションでユーザーのサインアップ・ログインを管理しつつ、ログイン済みユーザーごとに自分の S3 プレフィックス配下へ直接ファイルをアップロードできる一時的な AWS IAM 認証情報を付与したいと考えています。最も適切な Amazon Cognito の構成はどれですか？",
    options: [
      "Cognito User Pools のみを使用し、発行された JWT をそのまま S3 API の署名ヘッダーに渡す",
      "Cognito User Pools でユーザー認証と JWT 発行を行い、Cognito Identity Pools と連携して STS 経由で一時的な AWS 認証情報を取得する",
      "各モバイルユーザーに専用の IAM ユーザーを作成し、アクセスキーをアプリ内に配布する",
      "S3 バケットをパブリック書き込み可能に設定し、ファイル名にランダム文字列を使う",
    ],
    correctIndices: [1],
    explanation:
      "Cognito User Pools はユーザー認証と JWT 発行を行いますが、AWS リソースへ直接アクセスするための IAM 認証情報は発行しません。User Pools のトークンを Cognito Identity Pools へ渡すことで、AWS STS 経由で IAM ロールに紐づいた一時的な認証情報を取得できます。",
    keywords: ["Cognito User Pools", "Cognito Identity Pools", "STS"],
  },
  {
    id: "dva-q6",
    domainId: "dva-domain-2",
    domainLabel: "Domain 2: セキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "社内アプリケーションで、最大 50 MB の大容量ドキュメントファイルをクライアント側または EC2 上で AWS KMS を用いて暗号化してから保存する必要があります。KMS API のペイロードサイズ制限（4 KB）を回避しつつ安全に暗号化する標準的な実装方法はどれですか？",
    options: [
      "ファイルを 4 KB ごとに分割し、各チャンクごとに KMS Encrypt API を数万回呼び出す",
      "KMS の GenerateDataKey API でデータ暗号化キー（DEK）を生成し、平文 DEK でローカル暗号化した後、平文 DEK をメモリから破棄して暗号化済み DEK をデータと一緒に保存する（エンベロープ暗号化）",
      "KMS カスタマーマネージドキー (CMK) のエクスポート機能を使って秘密鍵をアプリ内にダウンロードする",
      "暗号化を行わず、Base64 エンコードのみを実施して保存する",
    ],
    correctIndices: [1],
    explanation:
      "AWS KMS の `Encrypt` API は最大 4 KB までのデータしか直接暗号化できません。4 KB を超えるデータには、KMS `GenerateDataKey` で生成したデータキーを用いてアプリ側で暗号化し、暗号化されたデータキーをデータと共に保持する「エンベロープ暗号化（Envelope Encryption）」を使用します。",
    keywords: ["AWS KMS", "Envelope Encryption", "GenerateDataKey"],
  },
  {
    id: "dva-q7",
    domainId: "dva-domain-2",
    domainLabel: "Domain 2: セキュリティ",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "AWS Lambda 関数から Amazon RDS for PostgreSQL へ接続する際、コンプライアンス要件によりデータベースパスワードを 30 日ごとに自動ローテーションし、コードや環境変数に平文パスワードを保存しないようにしたいと考えています。最も運用負荷の少ない AWS サービスはどれですか？",
    options: [
      "AWS Systems Manager Parameter Store（Standard パラメータ）",
      "AWS Secrets Manager",
      "AWS Lambda の非暗号化環境変数",
      "Amazon S3 バケット内の設定ファイル（公開設定）",
    ],
    correctIndices: [1],
    explanation:
      "AWS Secrets Manager は RDS・Aurora・Redshift 等の認証情報に対する組み込みの自動ローテーション機能（マネージド Lambda ローテーション関数）を提供しており、シークレット取得時もコードから SDK 経由で最新値を取得できます。Parameter Store は組み込み自動ローテーションに非対応です。",
    keywords: ["Secrets Manager", "自動ローテーション", "RDS認証情報"],
  },
  {
    id: "dva-q8",
    domainId: "dva-domain-2",
    domainLabel: "Domain 2: セキュリティ",
    difficulty: "応用",
    selectCount: 1,
    question:
      "別ドメインの SPA（React アプリ）から Amazon API Gateway (REST API) の Lambda プロキシ統合エンドポイントへ GET / POST リクエストを送信したところ、API Gateway コンソールで CORS を有効化したにもかかわらず、ブラウザ上で依然として `Access-Control-Allow-Origin` ヘッダー不足による CORS エラーが発生しています。原因と正しい修正方法はどれですか？",
    options: [
      "REST API では CORS が一切サポートされていないため HTTP API へ移行する",
      "Lambda プロキシ統合ではバックエンド Lambda がレスポンスヘッダーを制御するため、Lambda 関数の返却オブジェクト内の `headers` に `Access-Control-Allow-Origin` 等を含める",
      "API Gateway ではなく Route 53 に TXT レコードとして CORS ポリシーを追加する",
      "ブラウザの代わりに IAM ユーザーを作成して SigV4 ヘッダーを付与する",
    ],
    correctIndices: [1],
    explanation:
      "API Gateway の Lambda プロキシ統合（Lambda Proxy Integration）を使用する場合、実際のレスポンス（`GET`/`POST` 等）のステータスコードやヘッダーは Lambda 関数がそのまま返却します。コンソールの CORS 有効化は `OPTIONS` プリフライトモックを作成しますが、実リクエストの `Access-Control-Allow-Origin` ヘッダーは Lambda 関数自身のレスポンスに含める必要があります。",
    keywords: ["API Gateway", "Lambdaプロキシ統合", "CORS"],
  },
  {
    id: "dva-q9",
    domainId: "dva-domain-3",
    domainLabel: "Domain 3: テストとデプロイ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "AWS SAM テンプレート（`template.yaml`）を使用して AWS Lambda 関数をデプロイしています。新しいコードを公開する際、最初からトラフィックの 10% だけを新バージョンへ流し、5 分間 CloudWatch アラーム（エラー率上昇）を監視して問題がなければ残り 90% へ切り替える段階的デプロイを自動構成したい場合、SAM テンプレートに設定すべきプロパティの組み合わせはどれですか？",
    options: [
      "`AutoPublishAlias` と `DeploymentPreference`（`Type: Canary10Percent5Minutes` および `Alarms`）を設定する",
      "`MemorySize` を 10240 に設定し `Timeout` を 900 に設定する",
      "`ReservedConcurrentExecutions` を 10 に固定する",
      "`Tracing: Active` のみを有効化してデプロイする",
    ],
    correctIndices: [0],
    explanation:
      "AWS SAM では `AWS::Serverless::Function` に `AutoPublishAlias`（例: `live`）と `DeploymentPreference`（例: `Type: Canary10Percent5Minutes` + `Alarms` + 任意で `Hooks`）を記述するだけで、裏側の AWS CodeDeploy リソースを自動生成して安全なカナリアデプロイと自動ロールバックを実現できます。",
    keywords: ["AWS SAM", "DeploymentPreference", "Canary"],
  },
  {
    id: "dva-q10",
    domainId: "dva-domain-3",
    domainLabel: "Domain 3: テストとデプロイ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "AWS CodeDeploy を使用して Lambda 関数のトラフィックシフトデプロイを実行する際、新バージョンへ本番トラフィックを流す「直前」にスモークテスト用の別 Lambda 関数を自動実行し、検証が成功した場合のみ本番トラフィックの移行を許可したいと考えています。`appspec.yml` の `Hooks` セクションで指定すべきライフサイクルフックはどれですか？",
    options: [
      "AfterAllowTraffic",
      "BeforeAllowTraffic",
      "ApplicationStop",
      "DownloadBundle",
    ],
    correctIndices: [1],
    explanation:
      "Lambda デプロイ向けの CodeDeploy `appspec.yml` では、トラフィック移行前に検証関数を実行する `BeforeAllowTraffic` フックと、移行完了後に検証を行う `AfterAllowTraffic` フックを使用します（`ApplicationStop` や `DownloadBundle` は EC2/オンプレミスデプロイ向けフックです）。",
    keywords: ["CodeDeploy", "appspec.yml", "BeforeAllowTraffic"],
  },
  {
    id: "dva-q11",
    domainId: "dva-domain-3",
    domainLabel: "Domain 3: テストとデプロイ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "AWS Elastic Beanstalk 上で稼働する本番 Web アプリケーションを新バージョンへデプロイします。「デプロイ中にダウンタイムを発生させず」「全キャパシティを 100% 維持し」「問題発生時は既存インスタンスを変更していないため極めて高速にロールバックできる」という要件を単一環境内で満たす最適なデプロイポリシーはどれですか？",
    options: [
      "All at once（すべて一度に）",
      "Rolling（ローリング）",
      "Immutable（イミュータブル）",
      "手動で EC2 をすべて終了してから再作成",
    ],
    correctIndices: [2],
    explanation:
      "Elastic Beanstalk の `Immutable` デプロイは、新しい一時的な Auto Scaling グループ上に同数の新規インスタンスを起動し、ヘルスチェック合格後に本番 ELB へ接続して旧インスタンスを終了します。キャパシティ低下や既存インスタンス改変がなく、失敗時は新インスタンス群を破棄するだけで即座にロールバックできます。",
    keywords: ["Elastic Beanstalk", "Immutable", "ゼロダウンタイム"],
  },
  {
    id: "dva-q12",
    domainId: "dva-domain-3",
    domainLabel: "Domain 3: テストとデプロイ",
    difficulty: "標準",
    selectCount: 2,
    question:
      "AWS CodePipeline と AWS CodeBuild を組み合わせて、コンテナ化アプリケーションの Docker イメージをビルドし Amazon ECR へプッシュした後、開発者の確認を経て本番 ECS へデプロイするパイプラインを構築しています。「CodeBuild 内で Docker ビルドを正常に動作させること」と「本番反映前に担当者による承認ステップを挟むこと」を満たす設定を【2つ】選んでください。",
    options: [
      "CodeBuild プロジェクトの環境設定で `privilegedMode: true`（特権モード）を有効化する",
      "buildspec.yml の `env` セクションに本番 AWS ルートアカウントのパスワードを平文で記述する",
      "CodePipeline の本番デプロイステージの直前に Manual Approval（手動承認）アクションを追加する",
      "CodeDeploy の appspec.yml で `All at once` のみ許可し IAM ロールを削除する",
      "Docker ビルドを諦め、ビルド済みイメージを手動で S3 パブリックバケットへアップロードする",
    ],
    correctIndices: [0, 2],
    explanation:
      "CodeBuild コンテナ内で `docker build` 等の Docker デーモン操作を実行するにはプロジェクト設定の `privilegedMode: true` が必要です。また、本番デプロイ前に人手でのリリース承認を挟む場合は CodePipeline の Manual Approval アクション（SNS 通知連携可）を追加します。",
    keywords: ["CodeBuild privilegedMode", "CodePipeline", "Manual Approval"],
  },
  {
    id: "dva-q13",
    domainId: "dva-domain-4",
    domainLabel: "Domain 4: トラブルシューティングと最適化",
    difficulty: "標準",
    selectCount: 1,
    question:
      "マイクロサービス環境で AWS X-Ray を有効化しています。開発チームは X-Ray コンソールのトレース検索画面において、特定の `customerId` や `orderTier`（例: `annotation.customerId = \"123\"`）を指定して該当リクエストのトレースだけを瞬時に絞り込みたいと考えています。X-Ray SDK でこれらの値を記録すべきメソッド／領域はどれですか？",
    options: [
      "サブセグメントの Metadata（メタデータ）として記録する",
      "セグメントまたはサブセグメントの Annotations（アノテーション）として記録する",
      "S3 バケットのオブジェクトタグのみに書き込む",
      "CloudFormation の Outputs セクションへ出力する",
    ],
    correctIndices: [1],
    explanation:
      "AWS X-Ray では `Annotations` がインデックス化されるキー・バリュー対であり、フィルター式を用いたトレースの検索・絞り込みに利用できます。`Metadata` は任意の JSON オブジェクトを保存できますがインデックス化されないため検索条件には使えません。",
    keywords: ["AWS X-Ray", "Annotations vs Metadata", "分散トレーシング"],
  },
  {
    id: "dva-q14",
    domainId: "dva-domain-4",
    domainLabel: "Domain 4: トラブルシューティングと最適化",
    difficulty: "応用",
    selectCount: 1,
    question:
      "高トラフィックの AWS Lambda 関数からビジネス指標（例: 注文金額やキャッシュヒット数）をカスタム CloudWatch メトリクスとして記録したいと考えています。ただし、リクエストのたびに同期的な `PutMetricData` API コールを発行すると関数の実行レイテンシが悪化し API コストも増大します。関数の応答時間を悪化させず低コストでカスタムメトリクスを生成するベストプラクティスはどれですか？",
    options: [
      "CloudWatch Embedded Metric Format (EMF) 形式で構造化 JSON ログを標準出力へ書き出し、CloudWatch に非同期でメトリクスを抽出させる",
      "各リクエスト内で Amazon RDS に INSERT した後、別の Cron ジョブから `PutMetricData` を 1 件ずつ呼ぶ",
      "Lambda 関数内で `sleep(1)` を入れて `PutMetricData` のスロットリングを回避する",
      "X-Ray のサンプリングレートを 0% に設定してメトリクスへ変換する",
    ],
    correctIndices: [0],
    explanation:
      "CloudWatch Embedded Metric Format (EMF) を利用すると、Lambda は `_aws` メタデータを含む JSON ログを標準出力（CloudWatch Logs）へ書き出すだけで済み、CloudWatch 側が非同期でカスタムメトリクスを自動抽出するため、同期 API 呼び出しの遅延やスロットリングを排除できます。",
    keywords: ["CloudWatch EMF", "カスタムメトリクス", "低レイテンシ"],
  },
  {
    id: "dva-q15",
    domainId: "dva-domain-4",
    domainLabel: "Domain 4: トラブルシューティングと最適化",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "Node.js で実装された AWS Lambda 関数において、ウォーム実行時の処理時間を短縮するとともに、すべての実行環境でコールドスタートの遅延を極力なくしたいと考えています。有効な最適化手法の組み合わせはどれですか？",
    options: [
      "ハンドラー関数の内側で毎回 AWS SDK クライアントを新規生成し、メモリを最小の 128 MB に固定する",
      "AWS SDK クライアントや DB 接続プールをハンドラー関数の「外」で初期化して実行環境間で再利用し、発行済みエイリアスに対して Provisioned Concurrency を設定する",
      "Lambda のタイムアウトを最大の 15 分に延長する",
      "すべての依存ライブラリを ZIP に含めず実行時に毎回インターネットから npm install する",
    ],
    correctIndices: [1],
    explanation:
      "ハンドラー関数の外（グローバルスコープ）で SDK クライアントや接続オブジェクトを初期化すると、コンテナが再利用されるウォーム呼び出しで初期化コストが不要になります。さらに発行済みバージョン／エイリアスへ Provisioned Concurrency を設定することで、コールドスタート自体を排除できます。",
    keywords: ["Cold Start", "Provisioned Concurrency", "ハンドラー外初期化"],
  },
  {
    id: "dva-q16",
    domainId: "dva-domain-4",
    domainLabel: "Domain 4: トラブルシューティングと最適化",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Amazon API Gateway (REST API) の Lambda プロキシ統合エンドポイントへリクエストを送信したところ、クライアントへ `502 Bad Gateway`（`Malformed Lambda proxy response`）が返却されました。CloudWatch Logs 上の Lambda 関数自体はエラーを投げずに正常終了しています。最も可能性の高い原因はどれですか？",
    options: [
      "Lambda 関数の戻り値 JSON が API Gateway プロキシ統合の必須形式（数値 `statusCode`、オブジェクト `headers`、文字列化された `body`）を満たしていない",
      "API Gateway の統合タイムアウト（29 秒）を超過した",
      "DynamoDB の WCU が不足してリクエストがキューイングされた",
      "CloudFront のキャッシュ TTL が 0 秒に設定されている",
    ],
    correctIndices: [0],
    explanation:
      "API Gateway の Lambda プロキシ統合で Lambda 自体がエラーなく終了したにもかかわらず `502 Bad Gateway` が返る典型的な原因は、戻り値フォーマットがプロキシ統合仕様（`statusCode` が整数、`body` が JSON 文字列など）に準拠していないことです（なお 29 秒超過時は `504 Gateway Timeout` になります）。",
    keywords: ["API Gateway 502", "Lambdaプロキシ統合", "トラブルシューティング"],
  },
  {
    id: "dva-q17",
    domainId: "dva-domain-2",
    domainLabel: "Domain 2: セキュリティ",
    difficulty: "標準",
    selectCount: 2,
    question:
      "DVA-C03 Task 2.3 の要件に従い、社内開発の Lambda アプリから Amazon Bedrock 基盤モデルを呼び出し、ツール実行を行う AI エージェント基盤を構築しています。「プロンプト・応答がインターネットを経由しないプライベート接続を確立しつつモデル再学習に使われないこと」と「個人情報（PII）のマスキング・拒否トピック制御およびプロンプトインジェクション防御を共通適用すること」を満たす構成を【2つ】選んでください。",
    options: [
      "VPC 内に Amazon Bedrock 用の Interface 型 VPC エンドポイント（AWS PrivateLink）を構成してプライベート接続する",
      "Amazon Bedrock Guardrails を構成して PII/PHI リダクション・拒否トピック・プロンプトインジェクション防御を適用する",
      "プロンプト文字列と応答全文（PII 含む）を無加工のままパブリック S3 バケットと平文 CloudWatch ログへ出力する",
      "AI エージェントが実行する機密ツール操作を認証なしで誰でも呼べるようにしセッションを全ユーザーで共有する",
      "API キーを Lambda 環境変数に平文ハードコードし、パブリックインターネット経由で外部 LLM を呼び出す",
    ],
    correctIndices: [0, 1],
    explanation:
      "DVA-C03 で新設された Task 2.3（AI サービス利用セキュリティ）では、VPC エンドポイントによるプライベート接続、入出力データのモデルトレーニング非利用、Amazon Bedrock Guardrails によるコンテンツフィルタ/PII リダクション/インジェクション防御、エージェントのツール認可・セッション分離・HITL 承認が重視されます。",
    keywords: ["DVA-C03 Task 2.3", "Bedrock Guardrails", "VPC Endpoint", "複数選択"],
  },
  {
    id: "dva-q18",
    domainId: "dva-domain-3",
    domainLabel: "Domain 3: テストとデプロイ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Amazon EKS および Amazon ECS on AWS Fargate 向けのコンテナイメージを CI/CD パイプラインで継続的にビルド・デプロイしています。「イメージプッシュ時の脆弱性自動スキャン」と「古い未タグ（untagged）イメージがレジストリに蓄積するのを自動削除ルールで防ぐこと」を低運用コストで実現する最適な組み合わせはどれですか？",
    options: [
      "Amazon ECR リポジトリでプッシュ時イメージスキャンとライフサイクルポリシー（Lifecycle Policy）を設定し、EKS マニフェスト / ECS タスク定義のローリング更新でデプロイする",
      "Docker Hub のパブリックリポジトリに本番イメージを公開し、毎月手動で削除する",
      "Amazon S3 に Dockerfile だけ保存し、本番ポッド起動時に毎回インターネットから apt install する",
      "Amazon CloudWatch Logs の保持期間を 1 日に設定してレジストリ容量を削減する",
    ],
    correctIndices: [0],
    explanation:
      "DVA-C03（テストとデプロイ）ではコンテナイメージ管理（Amazon ECR のスキャン・タグ付け・ライフサイクルポリシー）および ECS タスク定義 / EKS マニフェスト・Fargate を用いたデプロイが出題強化されています。",
    keywords: ["Amazon ECR", "ライフサイクルポリシー", "EKS / ECS Fargate"],
  },
];

export const dvaOfficialResources: SaaOfficialResource[] = [
  {
    title: "AWS Certified Developer – Associate 公式試験ページ",
    description: "DVA-C03（旧 DVA-C02 は 2026/11/30 終了）の試験概要、サンプル問題、受験予約への公式ポータル。",
    url: "https://aws.amazon.com/jp/certification/certified-developer-associate/",
    badge: "AWS公式",
  },
  {
    title: "DVA-C03 公式試験ガイド（日本語ドキュメント）",
    description: "DVA-C02 → DVA-C03 改定比較・新設 Task 2.3（AI セキュリティ）・4 ドメイン重み（30/26/22/22%）の一次資料。",
    url: "https://docs.aws.amazon.com/ja_jp/aws-certification/latest/developer-associate-03/developer-associate-03.html",
    badge: "公式試験ガイド",
  },
  {
    title: "AWS Skill Builder (公式デジタル学習プラットフォーム)",
    description: "DVA 対応の公式練習問題セット（Official Practice Question Set）やサーバーレス・コンテナ開発ラボを提供。",
    url: "https://skillbuilder.aws/",
    badge: "無料演習あり",
  },
  {
    title: "AWS Serverless Application Model (AWS SAM) デベロッパーガイド",
    description: "template.yaml 仕様、sam local デバッグ、DeploymentPreference によるカナリアデプロイの公式リファレンス。",
    url: "https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/what-is-sam.html",
    badge: "SAMガイド",
  },
  {
    title: "AWS X-Ray デベロッパーガイド",
    description: "セグメント/サブセグメント、Annotations vs Metadata、サンプリング規則、Lambda/ECS 計装の公式ドキュメント。",
    url: "https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/aws-xray.html",
    badge: "可観測性",
  },
];

export const dvaArchitecturePatterns: SaaArchitecturePattern[] = [
  {
    id: "dva-pat-serverless-api",
    title: "Cognito 認証付きサーバーレス REST API 構成",
    badge: "DVA王道",
    flow: [
      "Cognito User Pools (JWT)",
      "API Gateway (Authorizer / Caching)",
      "AWS Lambda (Alias)",
      "RDS Proxy / DynamoDB (+ DAX)",
    ],
    summary:
      "JWT 認可とステージキャッシュでバックエンドを保護し、Lambda エイリアスと RDS Proxy / DynamoDB により高負荷に耐えるサーバーレス API 構成。",
    keyDesignPoints: [
      "API Gateway の Cognito Authorizer または Lambda Authorizer で認証・認可をバックエンド前に集約",
      "Lambda から RDB へ接続する場合は RDS Proxy で接続プーリング、NoSQL 高速読み取りには DynamoDB + DAX を活用",
    ],
  },
  {
    id: "dva-pat-event-esm",
    title: "高耐久イベント駆動 & Partial Batch 処理構成",
    badge: "非同期耐障害",
    flow: [
      "EventBridge / SNS",
      "Amazon SQS (Long Polling)",
      "Lambda ESM (ReportBatchItemFailures)",
      "DLQ / Destinations",
    ],
    summary:
      "疎結合メッセージングと部分バッチ失敗制御（ReportBatchItemFailures）により、二重処理を防ぎつつ障害メッセージを確実に退避する構成。",
    keyDesignPoints: [
      "SQS Event Source Mapping で ReportBatchItemFailures を有効化し、失敗アイテムのみを再試行",
      "リトライ上限超過メッセージは DLQ へ隔離し、DynamoDB Conditional Writes でべき等性を担保",
    ],
  },
  {
    id: "dva-pat-sam-cicd",
    title: "AWS SAM + CodePipeline 自動カナリア CI/CD",
    badge: "CI/CD自動化",
    flow: [
      "Git Repository",
      "CodeBuild (sam build & test)",
      "Manual Approval",
      "CodeDeploy (Canary + Alarm)",
      "Lambda Alias",
    ],
    summary:
      "SAM テンプレートと CodePipeline で単体テスト・承認・トラフィック段階切替・エラー時自動ロールバックまでを一気通貫で自動化する構成。",
    keyDesignPoints: [
      "buildspec.yml のパラメータ参照（Parameter Store / Secrets Manager）でビルド時の認証情報露出を防止",
      "BeforeAllowTraffic フックでスモークテストを実施し、CloudWatch Alarm 発火時は自動ロールバック",
    ],
  },
  {
    id: "dva-pat-observability",
    title: "分散トレーシング & ゼロ遅延メトリクス監視",
    badge: "可観測性",
    flow: [
      "API Gateway (X-Ray Active)",
      "Lambda (X-Ray SDK / ADOT + EMF)",
      "CloudWatch Logs Insights",
      "X-Ray Service Map",
    ],
    summary:
      "X-Ray Annotations によるビジネスキー検索と CloudWatch EMF による非同期カスタムメトリクス記録を組み合わせた本番運用構成。",
    keyDesignPoints: [
      "トレースの絞り込みに使う顧客 ID や注文番号は Metadata ではなく Annotations へ記録",
      "同期的な PutMetricData API を避け、CloudWatch EMF 構造化 JSON ログでレイテンシ増加を防止",
    ],
  },
];

export const dvaPitfalls: SaaPitfall[] = [
  {
    id: "dva-pit-xray-metadata",
    trap: "AWS X-Ray で検索・フィルタリングしたい値（顧客 ID 等）を Metadata に記録する",
    whyWrong:
      "X-Ray の Metadata は非インデックスの任意 JSON 領域であり、コンソールや GetTraceSummaries のフィルター式で検索できません。",
    correctApproach:
      "検索やフィルタリング条件に使うキー・バリュー対は必ず「Annotations」へ記録し、Metadata は補助デバッグ情報に留める。",
  },
  {
    id: "dva-pit-dynamodb-filter",
    trap: "DynamoDB の Scan / Query で FilterExpression を指定して RCU 消費を節約しようとする",
    whyWrong:
      "FilterExpression は DynamoDB がアイテムを読み込んで RCU を消費した「後」に結果を絞り込むため、RCU 削減効果はありません。",
    correctApproach:
      "読み込み消費を抑えるには適切なパーティションキー/ソートキーでの Query、または検索軸に合わせた GSI を設計する。",
  },
  {
    id: "dva-pit-lsi-later",
    trap: "運用中の既存 DynamoDB テーブルに対して後から LSI（ローカルセカンダリインデックス）を追加する",
    whyWrong:
      "LSI はベーステーブル作成時にのみ定義可能であり、既存テーブルへの後付けや削除はできません。",
    correctApproach:
      "既存テーブルへ後から新しいクエリ用の検索軸を追加する場合は、いつでも作成・削除できる GSI（グローバルセカンダリインデックス）を使う。",
  },
  {
    id: "dva-pit-kms-4kb",
    trap: "4 KB を超える設定ファイルや画像データを AWS KMS の Encrypt API で直接暗号化する",
    whyWrong:
      "KMS の直接暗号化 API（Encrypt）は最大 4 KB（4,096 バイト）までのペイロード制限があり、超過するとエラーになります。",
    correctApproach:
      "KMS GenerateDataKey でデータキーを生成しローカルでデータを暗号化するエンベロープ暗号化（Envelope Encryption）を実装する。",
  },
  {
    id: "dva-pit-apigw-cors",
    trap: "API Gateway Lambda プロキシ統合で、コンソールの CORS 設定だけで全レスポンスが CORS 対応になると思う",
    whyWrong:
      "プロキシ統合では API Gateway がバックエンドのヘッダーを上書きしないため、OPTIONS 以外の実応答で Access-Control-Allow-Origin が欠落します。",
    correctApproach:
      "Lambda 関数が返すレスポンス JSON の headers プロパティに `Access-Control-Allow-Origin` 等の CORS ヘッダーを明示的に含める。",
  },
  {
    id: "dva-pit-lambda-async-dlq",
    trap: "API Gateway（同期呼び出し）から実行した Lambda が失敗したとき、設定した Lambda DLQ / Destinations に送られると思う",
    whyWrong:
      "Lambda の自動 2 回リトライ、DLQ、および Destinations は「非同期呼び出し」（または対応 ESM 失敗先）でのみ機能します。",
    correctApproach:
      "同期呼び出しでは呼び出し元（API Gateway やクライアント SDK）へ即座にエラーが返るため、呼び出し元側でリトライや退避を実装する。",
  },
];

export const dvaKeyLimits: SaaLimitFact[] = [
  {
    id: "dva-lim-lambda",
    service: "AWS Lambda 実行制限・パッケージ・一時領域",
    limitValue: "最大 15 分 / メモリ 10 GB / /tmp 10 GB",
    detail: "ZIP 圧縮 50 MB（解凍後 Layers 含め 250 MB）、ECR コンテナ最大 10 GB。同期ペイロード 6 MB / 非同期 256 KB、Layers 最大 5 個。",
  },
  {
    id: "dva-lim-apigw",
    service: "Amazon API Gateway 制限・キャッシュ",
    limitValue: "統合 29 秒 / ペイロード 10 MB / 10,000 RPS",
    detail: "REST API デフォルト統合タイムアウト 29 秒、アカウントデフォルト 10,000 RPS（バースト 5,000）。キャッシュは 0.5〜237 GB・TTL 最大 3,600 秒。",
  },
  {
    id: "dva-lim-dynamodb",
    service: "Amazon DynamoDB 容量・インデックス・制限",
    limitValue: "アイテム最大 400 KB / 1 RCU=4KB / 1 WCU=1KB",
    detail: "LSI 最大 5 個（作成時のみ・PK あたり 10 GB 上限）、GSI デフォルト最大 20 個、Streams 保持 24 時間、Transactions 最大 100 項目・4 MB。",
  },
  {
    id: "dva-lim-kms",
    service: "AWS KMS 直接暗号化制限・Parameter Store",
    limitValue: "KMS Encrypt 上限 4 KB / SSM Standard 上限 4 KB",
    detail: "4 KB 超の暗号化は GenerateDataKey（Envelope Encryption）。Parameter Store Standard は 10,000 個まで無料（Advanced は 8 KB まで）。",
  },
  {
    id: "dva-lim-sqs-sns",
    service: "Amazon SQS / SNS メッセージ制限",
    limitValue: "最大 256 KB / SQS 保持 4〜14 日 / Long Polling 20 秒",
    detail: "SQS 可視性タイムアウト最大 12 時間。FIFO キューはバッチなし 300 TPS・バッチ（最大 10 件）あり 3,000 TPS（高スループットモード拡張可）。",
  },
  {
    id: "dva-lim-kinesis",
    service: "Amazon Kinesis Data Streams シャード上限",
    limitValue: "1 シャード: 入力 1 MB/s (1,000 req/s) / 出力 2 MB/s",
    detail: "データ保持はデフォルト 24 時間（最大 365 日）。複数コンシューマがそれぞれ独立して 2 MB/s 消費する場合は Enhanced Fan-out を利用。",
  },
];

export const dvaServiceQueryAliases: Record<string, string> = {
  "Lambda Concurrency": "Concurrency",
  "Lambda SnapStart": "SnapStart",
  "Lambda Layers": "Layers",
  "User Pools vs Identity Pools": "User Pools",
  "S3 Encryption": "S3 Encryption",
  "S3 Presigned URL": "Presigned URL",
  "CloudFront Signed URL": "Signed URL",
  "Lambda Versions & Aliases": "Versions & Aliases",
  "API Gateway Stages": "Stage",
  "Blue/Green & Canary": "Canary",
  "Annotations vs Metadata": "Annotations",
  "CloudWatch Logs Insights": "Logs Insights",
  "CloudWatch EMF": "EMF",
  "Lambda Troubleshooting": "502",
  "API Gateway Errors": "4xx / 5xx",
  "Dead Letter Queue": "DLQ",
  "Cold Start Optimization": "コールドスタート",
  "ElastiCache Caching Strategies": "Lazy Loading",
  "SQS Long Polling": "Long Polling",
  "Bedrock Guardrails": "Guardrails",
  "VPC Endpoint": "VPC Endpoint",
};
