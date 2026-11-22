import type {
  CertExamFact,
  CertFlashcardItem,
  CertQuestion,
} from "@/components/certification/types";
import type {
  GcpDomain,
  GcpComparisonTable,
  GcpArchitecturePattern,
  GcpPitfall,
  GcpKeyFact,
  GcpOfficialResource,
} from "./gcp-types";

// 出典: Google Cloud 認定 Professional Cloud Developer 公式ページ (https://cloud.google.com/learn/certification/cloud-developer?hl=ja / 確認日: 2026-11-22)
export const pcdExamFacts: CertExamFact[] = [
  { label: "対象試験", value: "Professional Cloud Developer", detail: "クラウドネイティブ設計・開発・CI/CD・可観測性" },
  { label: "試験時間 / 形式", value: "120 分 / CertMetrics", detail: "単一・複数選択（テストセンター / OnVUE オンライン監督・日英対応）" },
  { label: "問題数", value: "50〜60 問", detail: "公式ページ記載（出題数は試験回により変動）" },
  { label: "合格ライン", value: "非公開（合否通知）", detail: "公式スコア非公開（合否のみ通知）" },
  { label: "有効期限", value: "2 年間", detail: "Professional 認定は取得日から 2 年で再認定が必要" },
  { label: "推奨経験", value: "業界3年以上 / GCP1年以上", detail: "Google Cloud での設計・開発・運用経験（前提資格不要）" },
];

// 出典: Google Cloud 認定 Professional Cloud Developer 公式試験ガイド（5領域体系）および最新公式試験ガイド PDF (https://services.google.com/fh/files/misc/professional_cloud_developer_exam_guide_english.pdf)
export const pcdDomains: GcpDomain[] = [
  {
    id: "pcd-domain-1",
    number: "01",
    title: "スケーラブルで可用性・信頼性の高いクラウドネイティブアプリの設計",
    englishTitle: "Designing highly scalable, available, and reliable cloud-native applications",
    weight: "約 26〜32%",
    accentColor: "indigo",
    summary:
      "12-Factor App 原則・ステートレス設計・グレースフルシャットダウン、Cloud Run / GKE / Cloud Run functions / App Engine の選定、Workload Identity・Secret Manager・API Gateway によるセキュア API 設計を学びます。",
    topics: [
      {
        id: "pcd-1-1",
        code: "1.1",
        title: "12-Factor App 原則とステートレス／耐障害性設計",
        services: ["12-Factor App", "Cloud Memorystore", "Secret Manager", "Graceful Shutdown"],
        keyPoints: [
          "12-Factor App の原則に基づき、アプリプロセスはステートレスに保ち、セッションや共有状態は Cloud Memorystore（Redis）や Firestore などのバッキングサービスへ外部化する",
          "設定値（エンドポイント等）は環境変数で注入し、API キーや DB パスワード等の機密値はハードコードせず Secret Manager でバージョン・IAM 管理する",
          "Graceful Shutdown（ディスポーザビリティ）として、`SIGTERM` 受信後（Cloud Run は強制終了 `SIGKILL` まで最大 10 秒）に処理中リクエスト完了・DB 接続クローズ・ログフラッシュを実行する",
        ],
        examTip: "『オートスケール環境でユーザーのログイン状態がインスタンス切替時に消える』＝ ローカルメモリ保持を廃止し Cloud Memorystore 等へ外部化する。",
      },
      {
        id: "pcd-1-2",
        code: "1.2",
        title: "コンピュート実行基盤の選定（Cloud Run / GKE / Cloud Run functions / App Engine）",
        services: ["Cloud Run", "GKE", "Cloud Run functions", "App Engine", "Compute Engine"],
        keyPoints: [
          "Cloud Run は任意のコンテナ（HTTP / gRPC / WebSocket 対応）をサーバーレス実行でき、リクエスト単価の従量課金・ゼロスケール・高速オートスケールに優れる",
          "GKE（Google Kubernetes Engine）は複雑なマイクロサービス間メッシュ、ステートフルワークロード、GPU 制御、Kubernetes エコシステムが必要な場合に最適",
          "Cloud Run functions はイベント駆動（Cloud Storage / Pub/Sub / Eventarc）の単一目的処理に適し、App Engine はコード配置中心の PaaS（Standard はゼロスケール、Flexible は Docker 対応・最小 1 台）、Compute Engine は OS 制御が必須なレガシー処理向け",
        ],
        examTip: "『カスタムランタイムや任意バイナリをコンテナで動かしたいが、Kubernetes クラスタ管理は避けたい』＝ Cloud Run。",
      },
      {
        id: "pcd-1-3",
        code: "1.3",
        title: "セキュア設計・認証基盤と API 管理（Workload Identity / API Gateway / Endpoints）",
        services: ["Workload Identity", "Service Accounts", "Cloud Endpoints", "API Gateway", "Identity-Aware Proxy (IAP)"],
        keyPoints: [
          "ワークロードごとに専用の Service Accounts を割り当てて最小権限の原則を徹底し、デフォルトサービスアカウントや静的 JSON 秘密鍵ファイルの使用を排除する",
          "GKE 上の Pod が Google Cloud API を呼ぶ際は Workload Identity（Workload Identity Federation for GKE）で Kubernetes ServiceAccount と IAM ServiceAccount を紐付け、外部環境（GitHub Actions / AWS 等）からも秘密鍵不要のフェデレーションを利用する",
          "API 管理ではサーバーレスの Cloud Run / Cloud Run functions 向けにフルマネージドな API Gateway、GKE/Compute Engine のコンテナ近接プロキシ（ESPv2）に Cloud Endpoints、エンタープライズ全機能に Apigee を選択し、社内アプリのゼロトラスト認証には Identity-Aware Proxy (IAP) を使う",
        ],
        examTip: "『Kubernetes Pod から安全に BigQuery/GCS を読み書きさせたい』＝ Workload Identity。『Cloud Run 前段で管理不要な OpenAPI 認証・キー制御』＝ API Gateway。",
      },
    ],
  },
  {
    id: "pcd-domain-2",
    number: "02",
    title: "アプリケーションのビルドとテスト",
    englishTitle: "Building and testing applications",
    weight: "約 20〜23%",
    accentColor: "cyan",
    summary:
      "Cloud Workstations / Cloud Code / Skaffold によるクラウドネイティブ開発ループ、ローカルエミュレータ活用、Cloud Build・Artifact Registry・Artifact Analysis による自動テスト＆セキュアビルドを学びます。",
    topics: [
      {
        id: "pcd-2-1",
        code: "2.1",
        title: "クラウド開発環境と自動ビルド（Cloud Code / Skaffold / Cloud Build / Artifact Registry）",
        services: ["Cloud Code", "Skaffold", "Cloud Build", "Artifact Registry", "Cloud Workstations"],
        keyPoints: [
          "Cloud Workstations は VPC 内の事前定義イメージ上で IDE を安全に稼働させるフルマネージド開発環境を提供し、開発端末へのソース/資格情報持ち出しを防ぐ",
          "Cloud Code（VS Code / JetBrains 拡張）と Skaffold を組み合わせると、ローカルコード編集の自動検知→コンテナビルド→ローカル/開発 GKE や Cloud Run への反復デプロイ・ブレークポイントデバッグが自動化される",
          "Cloud Build（`cloudbuild.yaml`）でソースからビルド・テストを実行し、成果物のコンテナイメージや言語パッケージ（npm / Maven / PyPI / Docker）は Artifact Registry へ一元保管する",
        ],
        examTip: "『VS Code 上でソース保存と同時に Kubernetes/Cloud Run の開発ループを自動更新・デバッグしたい』＝ Cloud Code + Skaffold。",
      },
      {
        id: "pcd-2-2",
        code: "2.2",
        title: "ローカルエミュレータ・テスト戦略とコンテナ脆弱性対策",
        services: ["ローカルエミュレータ", "Cloud Build 統合テスト", "マルチステージビルド", "Artifact Analysis"],
        keyPoints: [
          "Google Cloud CLI のローカルエミュレータ（Firestore / Pub/Sub / Cloud Spanner / Cloud Bigtable 等）を用いることで、課金やネットワーク遅延なしに高速な単体・統合テストを実行できる（Cloud SQL には公式 gcloud エミュレータがないためローカル DB コンテナ等を使用）",
          "Dockerfile のマルチステージビルドと軽量ベースイメージ（Distroless 等）および `--cache-from` 等のレイヤキャッシュを活用し、イメージサイズ縮小・攻撃面低減・Cloud Build 統合テスト実行時間の短縮を同時に達成する",
          "Artifact Registry と連携した Artifact Analysis により、プッシュ時および継続的な OS/言語パッケージの CVE 脆弱性スキャンを自動化し、重要脆弱性検出時にビルドやデプロイを停止できる",
        ],
        examTip: "『Cloud Build 上で VPC 内のプライベートな DB に対して統合テストを実行したい』＝ Cloud Build プライベートプール（Private Pools）。",
      },
    ],
  },
  {
    id: "pcd-domain-3",
    number: "03",
    title: "アプリケーションのデプロイ",
    englishTitle: "Deploying applications",
    weight: "約 18〜24%",
    accentColor: "emerald",
    summary:
      "Cloud Deploy を中心としたプログレッシブデリバリー（Canary / Blue-Green）、Binary Authorization、GKE の Probes・HPA・PDB、Cloud Run / App Engine の本番チューニングを学びます。",
    topics: [
      {
        id: "pcd-3-1",
        code: "3.1",
        title: "Cloud Deploy による継続的デリバリーとトラフィック分割（Canary / Blue-Green）",
        services: ["Cloud Deploy", "Canary / Blue-Green", "Cloud Run トラフィック分割", "Binary Authorization"],
        keyPoints: [
          "Cloud Deploy は Skaffold を利用して Dev → Staging → Prod への宣言的プロモーション・承認ゲート・ロールバックを管理し、`:latest` ではなく不変ダイジェスト（`@sha256:...`）で環境間の一貫性を保証する",
          "Cloud Run トラフィック分割（`--no-traffic` デプロイ後の比率指定やタグ URL）および GKE / Cloud Deploy の Canary / Blue-Green 戦略により、一部ユーザーへの段階検証と異常時の秒単位切り戻しを実現する",
          "Binary Authorization を本番 GKE や Cloud Run に適用し、CI のテストと Artifact Analysis 脆弱性基準を通過して暗号署名（Attestation）されたイメージのみ実行を許可する",
        ],
        examTip: "『本番トラフィックの 5% だけ新バージョンへ流してエラー率を検証し、問題があれば即 0% に戻したい』＝ Cloud Run トラフィック分割 / Cloud Deploy Canary。",
      },
      {
        id: "pcd-3-2",
        code: "3.2",
        title: "GKE デプロイメント設計（Health Probes / HPA / PodDisruptionBudget）",
        services: ["Startup / Readiness / Liveness Probe", "Horizontal Pod Autoscaler", "PodDisruptionBudget"],
        keyPoints: [
          "Startup / Readiness / Liveness Probe の責務を明確に分離する（起動待機＝Startup Probe、ロードバランサのトラフィック受付判定＝Readiness Probe、ハング時の再起動判定＝Liveness Probe）",
          "Horizontal Pod Autoscaler (HPA) により CPU・メモリ使用率や Cloud Monitoring の外部/カスタム指標（Pub/Sub 未処理メッセージ数など）に応じて Pod レプリカ数を自動増減させる",
          "複数レプリカ構成としたうえで PodDisruptionBudget (PDB)（例：`maxUnavailable: 1`）を設定し、ノードアップグレードや縮小などの自発的退避時にも最低限の稼働 Pod 数を維持する",
        ],
        examTip: "『初回起動に 90 秒かかるアプリが Liveness 失敗で CrashLoopBackOff になる』＝ Startup Probe を追加する。",
      },
      {
        id: "pcd-3-3",
        code: "3.3",
        title: "サーバーレス本番チューニング（Concurrency・min-instances・Direct VPC Egress・App Engine）",
        services: ["Cloud Run Concurrency", "min-instances", "Direct VPC Egress", "App Engine Flexible / Standard"],
        keyPoints: [
          "Cloud Run Concurrency（既定 80、最大 1,000）は I/O 待ちが多い Web API では高く設定してインスタンス数を抑え、CPU 負荷の高い処理や非スレッドセーフなアプリでは 1 に近づける",
          "min-instances を 1 以上に設定すると常時待機インスタンスが確保され、サーバーレス環境でのコールドスタート遅延を大幅に削減できる",
          "Direct VPC Egress を利用すると Serverless VPC Access コネクタ用の仲介 VM を管理せずに Cloud Run から VPC 内リソース（Cloud Memorystore やプライベート IP の Cloud SQL）へ直接・低遅延・低コスト通信できる。App Engine では用途に応じ App Engine Flexible / Standard（カスタムコンテナ vs 高速ゼロスケール）を使い分ける",
        ],
        examTip: "『Serverless VPC Access コネクタの作成・維持コストなしで Cloud Run から VPC 内部 IP へ高速接続したい』＝ Direct VPC Egress。",
      },
    ],
  },
  {
    id: "pcd-domain-4",
    number: "04",
    title: "Google Cloud サービスとの統合",
    englishTitle: "Integrating Google Cloud services",
    weight: "約 15〜21%",
    accentColor: "amber",
    summary:
      "データストア設計とセキュア接続（Firestore / Cloud SQL / Cloud Spanner / Cloud Storage）、非同期連携（Pub/Sub / Cloud Tasks / Cloud Workflows / Eventarc）、Google Cloud API の耐障害統合パターンを学びます。",
    topics: [
      {
        id: "pcd-4-1",
        code: "4.1",
        title: "データストア選定・スキーマ設計とセキュア接続（Firestore / Cloud SQL / Spanner / GCS）",
        services: ["Firestore", "Cloud SQL", "Cloud Spanner", "Cloud Storage", "Cloud SQL Auth Proxy"],
        keyPoints: [
          "Firestore はリアルタイム同期・モバイルオフライン対応・自動スケールに優れたドキュメント DB（複数フィールド条件は複合インデックス設計、単調増加 ID によるホットスポット回避に注意）",
          "Cloud SQL（最大 64TB）は既存 MySQL/PostgreSQL/SQL Server アプリ向けで、接続時は IP 許可リスト管理が不要な Cloud SQL Auth Proxy（または Language Connectors）で IAM 認証と自動 TLS 暗号化を行う",
          "Cloud Spanner はグローバル強整合・水平スケール（マルチリージョン 99.999% SLA）を実現し、単調増加キーを避けた UUIDv4 やビット反転シーケンス、親子結合を高速化する Interleaved Tables（`INTERLEAVE IN PARENT`）で設計する。非構造化オブジェクトの保管・配信には強整合な Cloud Storage を用いる",
        ],
        examTip: "『Cloud Spanner で連番主キーを使ったら書き込みスループットが伸びない』＝ UUIDv4 等へ変更しスプリット集中（ホットスポット）を解消する。",
      },
      {
        id: "pcd-4-2",
        code: "4.2",
        title: "非同期メッセージング・イベント駆動とオーケストレーション（Pub/Sub / Cloud Tasks / Workflows / Eventarc）",
        services: ["Pub/Sub", "Cloud Tasks", "Cloud Workflows", "Eventarc", "Cloud Scheduler"],
        keyPoints: [
          "Pub/Sub は 1 対多の疎結合なイベント配信を担い（少なくとも 1 回配信＝冪等設計必須、Ordering Keys によるキー単位順序保証、試行 5〜100 回超過で Dead-Letter Topic 転送、保持最大 31 日）",
          "Cloud Tasks は特定のワーカー（HTTP / App Engine）に対して秒間ディスパッチ数（`max_dispatches_per_second`）や同時実行数、将来時刻の遅延実行を細かく制御したい非同期ジョブに最適",
          "Eventarc は 90 以上の Google Cloud イベントソースや Cloud Audit Logs から CloudEvents 形式で Cloud Run 等を起動でき、複数サービスを順番・分岐・リトライ付きで繋ぐ場合は Cloud Workflows、定期 cron 実行には Cloud Scheduler を使う",
        ],
        examTip: "『外部 API のレート制限（10 req/sec）を超えないよう非同期処理を平準化したい』＝ Cloud Tasks。『複数 API を順次・条件分岐で調整したい』＝ Cloud Workflows。",
      },
      {
        id: "pcd-4-3",
        code: "4.3",
        title: "Google Cloud API 統合・ADC 認証と耐障害性（Exponential Backoff・署名付き URL）",
        services: ["Application Default Credentials", "Exponential Backoff", "Cloud Client Libraries", "Signed URL"],
        keyPoints: [
          "アプリからは生の HTTP 呼び出しよりも公式の Cloud Client Libraries を利用することで、接続プーリング・gRPC 高速通信・ページネーション・自動リトライの恩恵を受けられる",
          "認証には Application Default Credentials (ADC) を利用し、ローカルでは環境変数や gcloud 認証、本番（Cloud Run / GKE / GCE）ではメタデータサーバー／Workload Identity をコード変更なしで切り替える",
          "一時的なネットワーク障害やレート制限（HTTP 429 / 500 / 503）に対しては、ジッター付きの Exponential Backoff と冪等キー（Idempotency Key）を実装する。大容量ファイルの受け渡しはアプリサーバーを経由せず Cloud Storage の Signed URL を発行してクライアントと直接通信させる",
        ],
        examTip: "『200MB の動画アップロードを Cloud Run が中継してメモリ不足・制限超過する』＝ Signed URL でクライアントから Cloud Storage へ直接アップロード。",
      },
    ],
  },
  {
    id: "pcd-domain-5",
    number: "05",
    title: "デプロイ済みアプリケーションの管理",
    englishTitle: "Managing deployed applications",
    weight: "約 12〜18%",
    accentColor: "indigo",
    summary:
      "Cloud Monitoring・Cloud Logging（構造化ログ / ログベース指標）・Error Reporting による監視と異常検知、Cloud Trace・Cloud Profiler・OpenTelemetry を使った本番の性能調査とデバッグを学びます。",
    topics: [
      {
        id: "pcd-5-1",
        code: "5.1",
        title: "Cloud Monitoring・Cloud Logging・Error Reporting による監視と異常検知",
        services: ["Cloud Monitoring", "Cloud Logging", "Error Reporting", "Log-based Metrics", "Ops Agent"],
        keyPoints: [
          "Cloud Monitoring でシステム指標・カスタム指標・SLO/アップタイムチェック・アラートポリシーを一元管理し、Compute Engine VM 内の OS 指標とログは推奨統合エージェントの Ops Agent で収集する",
          "Cloud Logging の Log-based Metrics（ログベースの指標）を使うと、特定エラーコードやビジネスイベントのログ発生回数を時系列メトリクスに変換してグラフ表示・アラート発報できる",
          "Error Reporting は Cloud Logging に出力されたスタックトレースを解析して同一例外を自動グルーピングし、新規エラー発生時や急増時に即座に開発チームへ通知する",
        ],
        examTip: "『ログの中から未捕捉の例外（スタックトレース）だけを自動集約し新規発生を通知したい』＝ Error Reporting。",
      },
      {
        id: "pcd-5-2",
        code: "5.2",
        title: "Cloud Trace・Cloud Profiler・OpenTelemetry による分散トレースと性能最適化",
        services: ["Cloud Trace", "Cloud Profiler", "OpenTelemetry", "構造化ログ"],
        keyPoints: [
          "Cloud Trace はマイクロサービスを横断するリクエスト単位の Span レイテンシを可視化し、どのサービス間通信や DB クエリが遅延ボトルネックかを特定する",
          "Cloud Profiler は本番環境にほぼ負荷をかけず（常時低オーバーヘッドサンプリング）CPU 時間やヒープメモリ消費が大きい関数をフレームグラフで特定する",
          "OpenTelemetry を利用してベンダー中立にトレース・メトリクスを計装し、アプリが `stdout` へ出力する 構造化ログ（JSON）に `severity` と `logging.googleapis.com/trace` フィールドを含めることで、ログとトレースを 1 画面で相関分析できる",
        ],
        examTip: "『どのサービス間呼び出しが遅いか』＝ Cloud Trace、『どの関数が CPU/メモリを食っているか』＝ Cloud Profiler。",
      },
    ],
  },
];

export const pcdComparisons: GcpComparisonTable[] = [
  {
    id: "pcd-comp-compute",
    category: "コンピュート",
    title: "アプリ実行基盤比較（Cloud Run / GKE / Cloud Run functions / App Engine / Compute Engine）",
    subtitle: "コンテナ柔軟性・スケーリング・運用負荷の選定基準",
    columns: ["実行基盤", "実行単位 / 柔軟性", "スケーリング / チューニング", "最適なユースケース"],
    rows: [
      {
        feature: "Cloud Run",
        values: [
          "任意コンテナ（HTTP / gRPC / WebSocket / Jobs）",
          "ゼロスケール可・min-instances 設定・Cloud Run Concurrency（既定80/最大1,000）・Direct VPC Egress",
          "Web API・マイクロサービス・イベント処理全般の第一選択",
        ],
      },
      {
        feature: "GKE (Google Kubernetes Engine)",
        values: [
          "Kubernetes Pod / コンテナ（フルエコシステム）",
          "HPA / VPA / Cluster Autoscaler・GPU・カスタムネットワーキング",
          "複雑なマイクロサービス・サービスメッシュ・マルチクラウド移植性",
        ],
      },
      {
        feature: "Cloud Run functions",
        values: [
          "単一目的関数コード（Node/Python/Go/Java等）",
          "イベント自動スケール・Cloud Run 基盤（第2世代は同時実行・HTTP 最大 60 分 / イベント最大 540 秒）",
          "GCS / Pub/Sub / Eventarc を契機とする軽量グルーコード・Webhook",
        ],
      },
      {
        feature: "App Engine Flexible / Standard",
        values: [
          "Standard（言語サンドボックス）/ Flexible（カスタム Docker VM）",
          "Standard は数秒起動＆ゼロスケール、Flexible は最小 1 インスタンス常駐",
          "既存 App Engine 資産の運用やバージョン管理付き PaaS デプロイ",
        ],
      },
      {
        feature: "Compute Engine",
        values: [
          "仮想マシン（OS・カーネル・独自ミドルウェア完全制御）",
          "マネージドインスタンスグループ (MIG) による VM 単位オートスケール",
          "コンテナ化困難なレガシーアプリ・特殊カーネル/ライセンス要件",
        ],
      },
    ],
    decisionRule: "コンテナのサーバーレス実行＝Cloud Run、K8s 制御＝GKE、軽量イベント関数＝Cloud Run functions、OS 制御＝Compute Engine。",
  },
  {
    id: "pcd-comp-datastore",
    category: "ストレージ・DB",
    title: "アプリ向けデータストア・キャッシュ・オブジェクトストレージ比較",
    subtitle: "データ構造・整合性・接続方式・スケーリング基準",
    columns: ["サービス", "データモデル / 強整合性", "スケール / 主な特徴", "アプリ接続・設計ポイント"],
    rows: [
      {
        feature: "Firestore",
        values: [
          "ドキュメント型 NoSQL / クエリ強整合性",
          "サーバーレス自動スケール・リアルタイムリスナー・オフライン同期",
          "複合インデックス設計・単調増加 ID 回避（ローカルエミュレータ対応）",
        ],
      },
      {
        feature: "Cloud SQL",
        values: [
          "マネージド RDB（MySQL / PostgreSQL / SQL Server）",
          "最大 64TB・垂直スケール＋非同期リードレプリカ",
          "Cloud SQL Auth Proxy（IAM 認証・自動 TLS）または Private IP で接続",
        ],
      },
      {
        feature: "Cloud Spanner",
        values: [
          "分散 RDB（TrueTime 外部強整合・ACID）",
          "水平無制限スケール・マルチリージョン 99.999% SLA",
          "単調増加キー回避（UUIDv4 等）・Interleaved Tables で結合高速化",
        ],
      },
      {
        feature: "Cloud Memorystore",
        values: [
          "インメモリ Key-Value（Redis / Valkey / Memcached）",
          "サブミリ秒レイテンシ・VPC 内接続",
          "12-Factor App のセッション外部化・キャッシュ層（Direct VPC Egress 併用）",
        ],
      },
      {
        feature: "Cloud Storage",
        values: [
          "オブジェクトストレージ（読み取り強整合性）",
          "容量無制限・クラス自動移行（Lifecycle）",
          "Signed URL で大容量ファイルの直接アップロード/ダウンロードを安全許可",
        ],
      },
    ],
    decisionRule: "モバイル/リアルタイム＝Firestore、64TB 以下単一地域 RDB＝Cloud SQL、世界規模強整合 RDB＝Cloud Spanner、セッション/キャッシュ＝Cloud Memorystore、ファイル＝Cloud Storage + Signed URL。",
  },
  {
    id: "pcd-comp-async",
    category: "コンピュート",
    title: "非同期メッセージング・イベント駆動・オーケストレーション比較",
    subtitle: "疎結合配信・レート制御・イベント検知・手順管理の使い分け",
    columns: ["サービス", "連携モデル", "主な制御機能", "典型的な開発ユースケース"],
    rows: [
      {
        feature: "Pub/Sub",
        values: [
          "1 対多 Pub/Sub（非同期メッセージング）",
          "少なくとも 1 回配信・Ordering Keys・Dead-Letter Topic（5〜100回）・最大31日保持",
          "マイクロサービス間の疎結合イベント配信・ストリーミング取込（冪等設計必須）",
        ],
      },
      {
        feature: "Cloud Tasks",
        values: [
          "明示的ターゲット向けタスクキュー",
          "秒間レート制限（max_dispatches_per_second）・同時実行上限・遅延実行スケジュール",
          "外部 API のレート上限遵守・ユーザー操作の重い後続処理の平滑化",
        ],
      },
      {
        feature: "Eventarc",
        values: [
          "CloudEvents 標準イベントルーター",
          "90+ GCP ソース・Cloud Audit Logs 連携・属性フィルタリング",
          "バケットアップロードやリソース変更をトリガーに Cloud Run 等を起動",
        ],
      },
      {
        feature: "Cloud Workflows",
        values: [
          "サーバーレス ステートフルオーケストレーション",
          "YAML/JSON DAG・条件分岐・並列実行・Exponential Backoff リトライ・コールバック",
          "複数 API や Cloud Run を順序・状態保持しながら確実に連携する業務フロー",
        ],
      },
      {
        feature: "Cloud Scheduler",
        values: [
          "マネージド Cron スケジューラ",
          "タイムゾーン指定定期実行（HTTP / Pub/Sub / Workflows 起動）",
          "日次バッチ・定期メンテナンス・ポーリング代替トリガー",
        ],
      },
    ],
    decisionRule: "1対多疎結合配信＝Pub/Sub、相手先レート制御/遅延キュー＝Cloud Tasks、GCPイベント起点＝Eventarc、複数ステップ調整＝Cloud Workflows。",
  },
  {
    id: "pcd-comp-security-api",
    category: "ネットワーク・セキュリティ",
    title: "認証・シークレット・API 管理・ゼロトラスト比較",
    subtitle: "アプリ開発者が実装する安全境界と認証モデル",
    columns: ["サービス / 機能", "役割・保護対象", "キーレス / 推奨構成", "使い分けの決め手"],
    rows: [
      {
        feature: "Workload Identity / Service Accounts / ADC",
        values: [
          "ワークロードの ID と GCP API 認証",
          "GKE は Workload Identity、アプリは Application Default Credentials (ADC) を利用",
          "JSON 秘密鍵ファイルを排除し、専用 Service Accounts に最小権限を付与",
        ],
      },
      {
        feature: "Secret Manager",
        values: [
          "API キー・DB パスワード・証明書保管",
          "バージョニング・IAM 制御・Pub/Sub ローテーション通知",
          "Cloud Run 環境変数/ボリュームマウントや Cloud Build へ安全注入",
        ],
      },
      {
        feature: "API Gateway / Cloud Endpoints",
        values: [
          "API ルーティング・認証（JWT / API キー）・監視",
          "API Gateway はサーバーレス完全管理、Cloud Endpoints は ESPv2 プロキシ型",
          "Cloud Run / Cloud Run functions 向け＝API Gateway、GKE 近接＝Cloud Endpoints",
        ],
      },
      {
        feature: "Identity-Aware Proxy (IAP)",
        values: [
          "Web アプリ・管理画面へのゼロトラストアクセス制御",
          "Google アカウント / Cloud Identity 認証＋端末コンテキスト検証",
          "社内業務アプリに VPN なしで ID ベースのアクセス制限を付与",
        ],
      },
      {
        feature: "Binary Authorization",
        values: [
          "デプロイ時のコンテナ署名検証（Admission Control）",
          "CI テスト＋脆弱性チェック済みの Attestor 署名イメージのみ許可",
          "未検証・ローカルビルドのコンテナの本番 GKE / Cloud Run 投入を遮断",
        ],
      },
    ],
    decisionRule: "資格情報排除＝Workload Identity + ADC、シークレット保管＝Secret Manager、サーバーレス API 管理＝API Gateway、社内アプリ認証＝Identity-Aware Proxy (IAP)。",
  },
  {
    id: "pcd-comp-cicd",
    category: "運用・移行・コスト",
    title: "開発環境・CI/CD・プログレッシブデリバリー比較",
    subtitle: "ローカルループから本番カナリア展開までのツールチェーン",
    columns: ["ツール / サービス", "担当フェーズ", "主な機能・強み", "PCD 試験でのポイント"],
    rows: [
      {
        feature: "Cloud Workstations / Cloud Code / Skaffold",
        values: [
          "ローカル / クラウド開発ループ",
          "VPC 内 IDE・ファイル変更時の自動コンテナ再ビルド＆デプロイ・ステップデバッグ",
          "ローカルエミュレータ（Firestore / Pub/Sub 等）と併用して高速反復開発",
        ],
      },
      {
        feature: "Cloud Build",
        values: [
          "CI（ビルド・単体/統合テスト）",
          "マルチステージビルドキャッシュ・Cloud Build 統合テスト・プライベートプール対応",
          "不変ダイジェスト（`@sha256`）生成と Secret Manager 安全連携",
        ],
      },
      {
        feature: "Artifact Registry + Artifact Analysis",
        values: [
          "成果物保管＆脆弱性スキャン",
          "Docker / npm / Maven / Python 統合管理・CVE 継続スキャン",
          "旧 Container Registry の後継。CI/CD ゲートとして脆弱性を検出",
        ],
      },
      {
        feature: "Cloud Deploy",
        values: [
          "CD（段階的プロモーション＆ロールバック）",
          "Dev→Staging→Prod 承認・Canary / Blue-Green 戦略・Cloud Run トラフィック分割",
          "Skaffold 連携でビルド済み同一リリースを安全昇格・自動ロールバック",
        ],
      },
    ],
    decisionRule: "開発ループ＝Cloud Code + Skaffold、ビルド＆テスト＝Cloud Build、スキャン付保管＝Artifact Registry + Artifact Analysis、段階リリース＝Cloud Deploy。",
  },
  {
    id: "pcd-comp-observability",
    category: "運用・移行・コスト",
    title: "可観測性・診断ツール＆デプロイ済みアプリ健全性比較",
    subtitle: "ログ・メトリクス・トレース・プロファイル・Probes の役割分担",
    columns: ["ツール / 機能", "収集・監視対象", "主な可視化・制御内容", "トラブルシューティング時の使い分け"],
    rows: [
      {
        feature: "Cloud Monitoring & Ops Agent",
        values: [
          "システム/カスタムメトリクス・SLO・アップタイム",
          "ダッシュボード・アラート・Compute Engine のメモリ/ログ収集（Ops Agent）",
          "可用性低下・エラー率上昇・レイテンシ SLO 違反の検知",
        ],
      },
      {
        feature: "Cloud Logging & Log-based Metrics",
        values: [
          "構造化ログ（stdout JSON）・Audit Logs",
          "ログフィルタ検索・Log Analytics・ログ件数/分布からのメトリクス化",
          "Trace ID 相関付きの構造化ログによるエラー文脈調査と異常件数アラート",
        ],
      },
      {
        feature: "Error Reporting",
        values: [
          "アプリケーションの例外・スタックトレース",
          "重複エラーの自動グルーピング・新規エラー発生通知",
          "本番アプリで発生中の未認識クラッシュ・例外の即時把握",
        ],
      },
      {
        feature: "Cloud Trace & OpenTelemetry",
        values: [
          "分散リクエストの Span（呼び出し区間）",
          "サービス間通信のウォーターフォール図・OpenTelemetry 標準計装",
          "どのマイクロサービスや外部 DB 呼び出しが遅延原因かの特定",
        ],
      },
      {
        feature: "Cloud Profiler",
        values: [
          "本番コードの CPU・ヒープ・割り当てプロファイル",
          "低オーバーヘッド常時サンプリング・フレームグラフ表示",
          "コード内のどの関数・メソッドが CPU やメモリを過剰消費しているか特定",
        ],
      },
      {
        feature: "GKE Probes & PDB / Graceful Shutdown",
        values: [
          "アプリライフサイクルと稼働維持",
          "Startup / Readiness / Liveness Probe・Horizontal Pod Autoscaler・PodDisruptionBudget",
          "12-Factor App 準拠の SIGTERM 終了処理と無停止ローリング更新",
        ],
      },
    ],
    decisionRule: "例外集約＝Error Reporting、サービス間遅延＝Cloud Trace、遅い関数特定＝Cloud Profiler、指標アラート＝Cloud Monitoring / Log-based Metrics。",
  },
];

export const pcdPatterns: GcpArchitecturePattern[] = [
  {
    id: "pcd-pat-1",
    title: "12-Factor App 準拠 Cloud Run サーバーレス API パターン",
    badge: "12-Factor + Cloud Run",
    flow: [
      "API Gateway (JWT / API キー)",
      "Cloud Run (min-instances / Concurrency / Direct VPC Egress)",
      "Secret Manager + Cloud Memorystore",
      "Cloud SQL (Cloud SQL Auth Proxy)",
    ],
    summary:
      "12-Factor App の原則に沿ってセッションを Cloud Memorystore へ外部化し、Direct VPC Egress と Cloud SQL Auth Proxy で高速かつ鍵不要に DB・キャッシュと統合する標準 API 構成。",
    keyDesignPoints: [
      "SIGTERM 受信後 10 秒以内の Graceful Shutdown で進行中リクエストと DB 接続を安全終了",
      "I/O 中心処理では Cloud Run Concurrency を引き上げ、min-instances >= 1 でコールドスタートを抑制",
    ],
  },
  {
    id: "pcd-pat-2",
    title: "イベント駆動＆レート制御付き非同期ワークフローパターン",
    badge: "Eventarc + Tasks + Workflows",
    flow: [
      "クライアント → Signed URL (Cloud Storage 直アップロード)",
      "Eventarc / Pub/Sub (Dead-Letter Topic)",
      "Cloud Workflows (状態管理)",
      "Cloud Tasks (レート制御) → Cloud Run functions",
    ],
    summary:
      "大容量ファイルを Signed URL で直接受け取り、Eventarc/Pub/Sub のイベント駆動と Cloud Workflows のオーケストレーション、Cloud Tasks のレート平滑化を組み合わせた高耐障害構成。",
    keyDesignPoints: [
      "Pub/Sub は少なくとも 1 回配信のため、コンシューマー側で冪等キーを用いた重複排除を実装",
      "外部 API 呼び出し等には Exponential Backoff + ジッターと Cloud Tasks の `max_dispatches_per_second` を併用",
    ],
  },
  {
    id: "pcd-pat-3",
    title: "開発ループから本番 Canary までのセキュア CI/CD パターン",
    badge: "Cloud Code + Build + Deploy",
    flow: [
      "Cloud Workstations / Cloud Code (Skaffold + ローカルエミュレータ)",
      "Cloud Build (マルチステージビルド＆統合テスト)",
      "Artifact Registry + Artifact Analysis",
      "Binary Authorization → Cloud Deploy (Canary / Blue-Green)",
    ],
    summary:
      "ローカル開発時の迅速な検証から、脆弱性スキャン・暗号署名・段階的リリース（Canary / Blue-Green / Cloud Run トラフィック分割）までを一貫させるサプライチェーン安全構成。",
    keyDesignPoints: [
      "Cloud Build で生成した不変ダイジェスト（`@sha256:...`）を Cloud Deploy で Dev → Staging → Prod へプロモーション",
      "Private IP のテスト DB へ接続する Cloud Build 統合テストにはプライベートプールを利用",
    ],
  },
  {
    id: "pcd-pat-4",
    title: "GKE ゼロトラスト＆無停止マイクロサービスパターン",
    badge: "GKE + Workload Identity",
    flow: [
      "Cloud Endpoints / Identity-Aware Proxy (IAP)",
      "GKE (Startup / Readiness / Liveness Probe + HPA + PDB)",
      "Workload Identity (KSA ⇄ GSA)",
      "Cloud Spanner / Firestore",
    ],
    summary:
      "GKE Pod への静的サービスアカウント鍵配布を廃止し、適切なヘルスプローブと PodDisruptionBudget で計画メンテナンス・オートスケール時も無停止稼働を保つ構成。",
    keyDesignPoints: [
      "Startup Probe で初期化遅延中の誤再起動を防ぎ、Horizontal Pod Autoscaler と PodDisruptionBudget で負荷変動と退避を両立",
      "Cloud Spanner では Interleaved Tables と非連番主キーで高い書き込み分散性能を確保",
    ],
  },
  {
    id: "pcd-pat-5",
    title: "OpenTelemetry 統合オブザーバビリティ＆迅速デバッグパターン",
    badge: "OTel + Trace + Profiler",
    flow: [
      "アプリ (Cloud Client Libraries + OpenTelemetry)",
      "構造化ログ (stdout JSON + trace フィールド)",
      "Cloud Logging (Log-based Metrics) / Error Reporting",
      "Cloud Trace + Cloud Profiler + Cloud Monitoring",
    ],
    summary:
      "ログ・メトリクス・トレース・プロファイルを OpenTelemetry と構造化ログで関連付け、本番障害の検知からサービス間遅延特定・コード内ボトルネック解明までを最短化する構成。",
    keyDesignPoints: [
      "構造化ログに `logging.googleapis.com/trace` を付与し、エラーログからワンクリックで Cloud Trace の Span を確認",
      "Compute Engine 併用時は Ops Agent で OS メモリ指標・ログを統合収集し、Error Reporting で新規例外を通知",
    ],
  },
  {
    id: "pcd-pat-6",
    title: "ハイブリッド認証＆マネージド API 公開パターン",
    badge: "API Gateway + ADC + Cloud SQL Auth Proxy",
    flow: [
      "外部クライアント / App Engine Flexible / Standard",
      "API Gateway (認証・レート制御)",
      "Application Default Credentials (ADC) / Service Accounts",
      "Cloud SQL (Cloud SQL Auth Proxy) / Cloud Storage",
    ],
    summary:
      "開発環境と本番環境で認証コードを分岐させずに ADC を貫徹し、API Gateway によるアクセス制御と Cloud SQL Auth Proxy による安全な DB 接続を実現する構成。",
    keyDesignPoints: [
      "Cloud Client Libraries と ADC により環境変数・ローカル認証・本番サービスアカウントを透過的に切り替え",
      "App Engine / Cloud Run / GKE 間で一貫した IAM 最小権限と Secret Manager 参照を適用",
    ],
  },
];

export const pcdPitfalls: GcpPitfall[] = [
  {
    id: "pcd-pit-1",
    trap: "「サービスアカウントの JSON 秘密鍵を発行し、Docker イメージや環境変数に保存して GCP API を呼ぶ」",
    whyWrong:
      "静的な JSON 鍵はソースリポジトリやコンテナイメージからの漏洩リスクが極めて高く、定期ローテーションの運用負担も増大します。",
    correctApproach:
      "アプリコードは Application Default Credentials (ADC) を使い、Cloud Run / Compute Engine は専用 Service Accounts のメタデータ認証、GKE は Workload Identity を使用します。",
  },
  {
    id: "pcd-pit-2",
    trap: "「Cloud Run や GKE コンテナのローカルメモリ・ローカルディスクにユーザーセッションやアップロードファイルを永続保存する」",
    whyWrong:
      "水平オートスケールやインスタンス再起動・リビジョン切替のたびに異なるコンテナへリクエストがルーティングされ、ローカル状態は消失します（12-Factor App 原則違反）。",
    correctApproach:
      "セッションや高速参照データは Cloud Memorystore（Redis）や Firestore へ、大容量ファイルは Cloud Storage（Signed URL 活用）へ外部化します。",
  },
  {
    id: "pcd-pit-3",
    trap: "「大容量ファイルのアップロード/ダウンロードを Cloud Run や App Engine アプリサーバー経由でプロキシ実装する」",
    whyWrong:
      "リクエストサイズ上限やメモリ超過・タイムアウトを招き、不要なコンピュート課金とレイテンシ悪化の原因になります。",
    correctApproach:
      "バックエンド API は短時間有効な Cloud Storage の Signed URL を生成して返すだけにし、クライアントから直接 Cloud Storage へ転送させます。",
  },
  {
    id: "pcd-pit-4",
    trap: "「外部 API の秒間レート制限を守る用途や特定スケジュールでの遅延実行に Pub/Sub だけを使う」",
    whyWrong:
      "Pub/Sub は 1 対多の高スループット配信向けであり、明示的な秒間ディスパッチ数上限の指定や将来時刻タスクの細かな制御には向きません。また少なくとも 1 回配信のため重複受信も起こります。",
    correctApproach:
      "ターゲット側への実行レート制限（`max_dispatches_per_second`）や遅延スケジューリングには Cloud Tasks を選択し、Pub/Sub 利用時は必ず冪等処理を実装します。",
  },
  {
    id: "pcd-pit-5",
    trap: "「Cloud Spanner の主キーに単調増加する AUTO_INCREMENT 連番や先頭タイムスタンプを使う」",
    whyWrong:
      "新規レコードの挿入が常にキースペース末尾の単一スプリットに集中し、書き込みホットスポットが発生して Cloud Spanner の水平スケール性能を阻害します。",
    correctApproach:
      "UUIDv4、ビット反転シーケンス、または高カーディナリティ列を先頭にした複合主キーを設計し、親子テーブルには Interleaved Tables を活用します。",
  },
  {
    id: "pcd-pit-6",
    trap: "「API パスワードを Cloud KMS に平文保存したり、Cloud Deploy で `:latest` タグを使い回したりする」",
    whyWrong:
      "Cloud KMS は暗号鍵（暗号化/復号操作）管理用でありアプリ資格情報の保管サービスではありません。また `:latest` タグは上書き可能なため環境間の同一性を保証できません。",
    correctApproach:
      "API キーや DB 接続文字列は Secret Manager に保管し、コンテナはマルチステージビルド後に不変ダイジェスト（`@sha256:...`）＋ Cloud Deploy でプロモーションします。",
  },
];

export const pcdKeyFacts: GcpKeyFact[] = [
  { id: "pcd-kf-1", target: "Cloud Run Graceful Shutdown", value: "SIGTERM 後 最大 10 秒で SIGKILL", detail: "接続クローズ・ログフラッシュ・処理中リクエスト完了を 10 秒以内に実施（12-Factor App）" },
  { id: "pcd-kf-2", target: "Cloud Run Concurrency / min-instances", value: "既定 80 / 最大 1,000（同時実行）", detail: "I/O 中心 API は値引上げで効率化し、min-instances >= 1 でコールドスタート削減" },
  { id: "pcd-kf-3", target: "Direct VPC Egress", value: "VPC コネクタ VM 不要で直接接続", detail: "Cloud Run から Cloud Memorystore やプライベート IP の Cloud SQL へ低遅延・低コスト接続" },
  { id: "pcd-kf-4", target: "Cloud Run リクエストタイムアウト", value: "既定 5 分 / 最大 60 分 (3,600 秒)", detail: "長時間バッチは Cloud Run Jobs や Cloud Workflows へ分離" },
  { id: "pcd-kf-5", target: "Pub/Sub 配信保証と DLT", value: "少なくとも 1 回 / 試行 5〜100 回", detail: "冪等処理が必須。超過時は Dead-Letter Topic へ転送（保持期間最大 31 日）" },
  { id: "pcd-kf-6", target: "Cloud Tasks vs Pub/Sub vs Workflows", value: "レート制御＝Tasks / 1対多＝Pub/Sub", detail: "Eventarc は 90+ ソースを CloudEvents 連携、Cloud Workflows は状態付き手順調整、Cloud Scheduler は Cron" },
  { id: "pcd-kf-7", target: "Cloud Spanner vs Cloud SQL", value: "Spanner 99.999% SLA / SQL 最大 64TB", detail: "グローバル強整合・水平拡張＝Cloud Spanner（UUIDv4 キー推奨）、単一地域 RDB＝Cloud SQL" },
  { id: "pcd-kf-8", target: "Cloud SQL Auth Proxy", value: "IAM 認証 + 自動 TLS 暗号化", detail: "固定 IP 許可リスト管理や手動 SSL 証明書配布なしで Cloud SQL へ安全接続" },
  { id: "pcd-kf-9", target: "Workload Identity & ADC", value: "JSON 鍵不要のセキュア認証", detail: "GKE Pod は Workload Identity、アプリコードは Application Default Credentials (ADC) と Service Accounts を利用" },
  { id: "pcd-kf-10", target: "API 管理 (Gateway / Endpoints / IAP)", value: "サーバーレス＝API Gateway", detail: "GKE 近接プロキシ＝Cloud Endpoints、ゼロトラスト Web 認証＝Identity-Aware Proxy (IAP)" },
  { id: "pcd-kf-11", target: "GKE Probes & PDB & HPA", value: "Startup / Readiness / Liveness + PDB", detail: "Startup で遅い起動を保護し、PodDisruptionBudget と Horizontal Pod Autoscaler で高可用化" },
  { id: "pcd-kf-12", target: "ローカル開発・CI/CD", value: "Cloud Code + Skaffold + Cloud Build", detail: "Cloud Workstations とローカルエミュレータで高速開発、Artifact Registry + Artifact Analysis + Binary Authorization + Cloud Deploy で安全展開" },
  { id: "pcd-kf-13", target: "Canary / Blue-Green とトラフィック分割", value: "不変 @sha256 で段階展開", detail: "Cloud Run トラフィック分割や Cloud Deploy Canary で一部流入検証＆即時ロールバック" },
  { id: "pcd-kf-14", target: "可観測性 5 点セット & OpenTelemetry", value: "Trace / Profiler / Logging / Monitoring / Error Reporting", detail: "構造化ログの trace 連携、Log-based Metrics で集計監視、VM は Ops Agent で統合収集" },
  { id: "pcd-kf-15", target: "Exponential Backoff + Jitter & Client Libraries", value: "429 / 5xx 再試行の標準設計", detail: "Cloud Client Libraries は認証・接続プール・gRPC・リトライを簡素化、ジッター併用で再試行集中を回避" },
];

export const pcdQuickLookup: CertFlashcardItem[] = [
  {
    keyword: "12-Factor App で Cloud Run コンテナ終了時に未完了処理や DB 接続を安全終了する設計",
    category: "クラウドネイティブ設計",
    recommended: "Graceful Shutdown（SIGTERM 後 10 秒猶予）",
    reason: "Cloud Run は終了前に SIGTERM を送信するため、10 秒以内に受信受付停止・接続クローズ・ログフラッシュを行います。",
  },
  {
    keyword: "ステートレスな Cloud Run / GKE アプリからユーザーセッションを外部化して超高速参照する基盤",
    category: "キャッシュ / 状態管理",
    recommended: "Cloud Memorystore (Redis)",
    reason: "オートスケールで別インスタンスへ振り分けられてもサブミリ秒で一貫したセッション・キャッシュを共有できます。",
  },
  {
    keyword: "API キー・DB パスワード・OAuth クライアント秘密をバージョン管理付きで安全に保管・注入",
    category: "セキュリティ",
    recommended: "Secret Manager",
    reason: "ソースコードや環境変数への平文記載を排除し、IAM 最小権限・バージョン管理・Pub/Sub ローテーション連携が可能です。",
  },
  {
    keyword: "ローカル開発から Cloud Run / GKE 本番までコード変更なしで認証を切り替える Google Cloud 標準機構",
    category: "認証 / SDK",
    recommended: "Application Default Credentials (ADC)",
    reason: "環境変数やメタデータサーバー、Workload Identity から自動的に認証情報を解決します。",
  },
  {
    keyword: "GKE 上の Pod が静的 JSON サービスアカウント鍵を持たずに Google Cloud API を呼び出す推奨構成",
    category: "GKE セキュリティ",
    recommended: "Workload Identity Federation for GKE",
    reason: "Kubernetes ServiceAccount (KSA) と IAM ServiceAccount (GSA) を紐付け、短命トークンで安全に認証します。",
  },
  {
    keyword: "マイクロサービスや CI パイプラインごとに最小権限を割り当てる Google Cloud の機械用 ID",
    category: "IAM",
    recommended: "専用 Service Accounts（サービスアカウント）",
    reason: "過剰な権限を持つデフォルトサービスアカウントの流用を避け、ワークロード単位で権限境界を分離できます。",
  },
  {
    keyword: "Cloud Run や Cloud Run functions の前段に置き OpenAPI 定義で認証・API キー・ルーティングを管理",
    category: "API 管理",
    recommended: "API Gateway",
    reason: "プロキシコンテナ（ESPv2）を自前で運用せずにフルマネージドなサーバーレス API 管理層を提供できます。",
  },
  {
    keyword: "未認証ユーザーや外部クライアントへ一定時間だけ Cloud Storage の大容量アップロード/ダウンロードを許可",
    category: "ストレージ / セキュリティ",
    recommended: "Signed URL（署名付き URL）",
    reason: "アプリサーバーを中継せずクライアントと Cloud Storage を直接通信させ、負荷とタイムアウトを回避できます。",
  },
  {
    keyword: "VS Code 等から VPC 内の統一コンテナ環境へ接続しローカル端末へのコード保存を防ぐ開発基盤",
    category: "開発環境",
    recommended: "Cloud Workstations",
    reason: "事前構成済みの開発イメージと IAM/VPC 境界制御により、オンボーディング短縮と情報漏洩防止を両立します。",
  },
  {
    keyword: "IDE 上でソース編集を自動検知して Skaffold による再ビルド・デバッグを回す拡張機能",
    category: "開発ツール",
    recommended: "Cloud Code + Skaffold",
    reason: "Kubernetes や Cloud Run 向けのインナー開発ループとリモートステップデバッグをシームレスに統合します。",
  },
  {
    keyword: "コンテナビルド・自動テスト・パッケージ保管をサーバーレスで統合する CI 基盤",
    category: "CI / ビルド",
    recommended: "Cloud Build + Artifact Registry",
    reason: "マルチステージビルドやキャッシュ、プライベートプールでの閉域統合テスト、不変ダイジェスト保管を一貫実行できます。",
  },
  {
    keyword: "Artifact Registry に保存されたコンテナや言語パッケージの既知 CVE 脆弱性を自動検査する機能",
    category: "サプライチェーン",
    recommended: "Artifact Analysis",
    reason: "プッシュ時・継続スキャンで脆弱性を検知し、危険なイメージの本番展開を防ぐトリガーに利用できます。",
  },
  {
    keyword: "同一のビルド成果物を承認ゲート付きで Dev → Staging → Prod へ段階展開・自動ロールバックする CD",
    category: "CD / デプロイ",
    recommended: "Cloud Deploy",
    reason: "Canary / Blue-Green 戦略や検証ステップ、Automation ルールによる安全なプログレッシブデリバリーを管理します。",
  },
  {
    keyword: "CI のテストと脆弱性基準をパスした暗号署名付きコンテナのみ本番 GKE / Cloud Run で起動許可",
    category: "サプライチェーン",
    recommended: "Binary Authorization",
    reason: "デプロイ時のアドミッション制御により、未検証イメージや改ざんイメージの稼働を確実にブロックします。",
  },
  {
    keyword: "初期化に 60 秒以上かかるコンテナが GKE で起動完了前に Liveness 失敗で再起動ループになるのを防止",
    category: "GKE ヘルスチェック",
    recommended: "Startup Probe",
    reason: "Startup Probe が成功するまで Liveness / Readiness Probe を無効化し、遅い起動でも安定稼働させます。",
  },
  {
    keyword: "GKE ノードアップグレードや縮小時に同時停止可能な Pod 数を制限して可用性を守る設定",
    category: "GKE 可用性",
    recommended: "PodDisruptionBudget (PDB)",
    reason: "自発的退避（Eviction）時の最低稼働数または最大停止数を宣言し、無停止メンテナンスを実現します。",
  },
  {
    keyword: "I/O 待ちが多い Cloud Run API でコールドスタート削減とインスタンス効率向上を両立する設定",
    category: "サーバーレス最適化",
    recommended: "min-instances + Concurrency 引き上げ",
    reason: "最小インスタンス確保で初期遅延を防ぎつつ、1 インスタンスあたりの同時処理数を上げてコストを抑えます。",
  },
  {
    keyword: "Serverless VPC Access コネクタ VM の構築・運用なしで Cloud Run から VPC 内リソースへ通信",
    category: "サーバーレスネットワーク",
    recommended: "Direct VPC Egress",
    reason: "仲介 VM 不要で Cloud Memorystore や Cloud SQL プライベート IP へ直接・高スループット・低コスト接続できます。",
  },
  {
    keyword: "モバイル/Web アプリのオフライン対応・リアルタイムリスナー・自動スケールを備える NoSQL DB",
    category: "データベース",
    recommended: "Firestore（Native モード）",
    reason: "クライアント SDK からのリアルタイム同期と強整合クエリをサーバーレスで提供します。",
  },
  {
    keyword: "グローバル分散環境で水平スケール・外部強整合性・99.999% SLA を提供するリレーショナル DB",
    category: "データベース",
    recommended: "Cloud Spanner",
    reason: "TrueTime によるグローバル整合性と水平拡張を持ち、非連番主キー＋Interleaved Tables で高スループットを発揮します。",
  },
  {
    keyword: "Cloud SQL へ IP 許可リスト管理や手動 SSL 証明書更新なしで IAM 認証・暗号化接続する推奨手段",
    category: "DB セキュリティ",
    recommended: "Cloud SQL Auth Proxy（または Language Connectors）",
    reason: "IAM ベースの認可と自動 TLS トンネリングにより、クラウド上・ローカル双方から安全に DB へ接続できます。",
  },
  {
    keyword: "特定エンドポイントへの実行レート（req/sec）上限や未来時刻の実行スケジュールを指定して非同期処理",
    category: "非同期タスク",
    recommended: "Cloud Tasks",
    reason: "ターゲット単位のディスパッチレート制限・同時実行制限・リトライ制御により外部 API 過負荷を防ぎます。",
  },
  {
    keyword: "複数 API・Cloud Run・Pub/Sub の呼び出し順序や条件分岐、リトライを YAML で状態管理しながら調整",
    category: "オーケストレーション",
    recommended: "Cloud Workflows",
    reason: "サーバーレスで最大数十分〜長時間のステートフルな手順実行・エラーハンドリングをコードレスに近く定義できます。",
  },
  {
    keyword: "本番マイクロサービスの「サービス間通信遅延」と「CPU/メモリ消費関数」をそれぞれ解明する 2 ツール",
    category: "可観測性",
    recommended: "Cloud Trace（遅延）＋ Cloud Profiler（CPU/メモリ）",
    reason: "OpenTelemetry 連携の分散トレースで区間遅延を、フレームグラフの常時プロファイラでコード内ホットスポットを特定します。",
  },
];

export const pcdPracticeQuestions: CertQuestion[] = [
  {
    id: "pcd-q1",
    domainId: "pcd-domain-1",
    domainLabel: "01: スケーラブル設計",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "EC サイトの Web アプリケーションを Cloud Run 上でオートスケール運用しています。アクセス急増時にインスタンス数が 1 から 10 へ増えると、ユーザーのログインセッションが突然切れて再ログインを求められる障害が発生しました。12-Factor App の原則に沿った最も適切な恒久対策はどれですか？",
    options: [
      "Cloud Run の最大インスタンス数を 1 に固定してスケールアウトを禁止する",
      "セッション状態をコンテナ内のインメモリ保持から Cloud Memorystore (Redis) などの外部キャッシュサービスへ移行し、アプリをステートレス化する",
      "コンテナイメージ内に SQLite ファイルを同梱してセッションを書き込む",
      "ユーザーにブラウザのキャッシュを毎回削除してもらう",
    ],
    correctIndices: [1],
    explanation:
      "12-Factor App ではプロセスをステートレスに保ち、共有状態やセッションは Cloud Memorystore (Redis) や Firestore などのバッキングサービスへ外部化することが原則です。",
    keywords: ["12-Factor App", "Cloud Memorystore", "ステートレス設計"],
  },
  {
    id: "pcd-q2",
    domainId: "pcd-domain-1",
    domainLabel: "01: スケーラブル設計",
    difficulty: "標準",
    selectCount: 1,
    question:
      "カスタム C++ ライブラリを含む特殊な Docker コンテナとして Web API（HTTP/gRPC 対応）を構築しました。日中は数千リクエストを処理しますが深夜はアクセスがほぼゼロになるため、アイドル時の課金を抑えたい一方、Kubernetes クラスタの構築やノード管理の運用負荷は避けたいと考えています。最適なコンピュート基盤はどれですか？",
    options: [
      "Cloud Run",
      "GKE Standard クラスタ",
      "App Engine Flexible 環境",
      "Compute Engine の単一 VM",
    ],
    correctIndices: [0],
    explanation:
      "Cloud Run は任意のカスタムコンテナ（HTTP / gRPC 対応）をサーバーレス実行でき、リクエストが無い時間帯はインスタンスをゼロへスケールダウンして課金を抑えられます（App Engine Flexible は最小 1 インスタンス常駐が必要です）。",
    keywords: ["Cloud Run", "コンピュート選定", "ゼロスケール"],
  },
  {
    id: "pcd-q3",
    domainId: "pcd-domain-1",
    domainLabel: "01: スケーラブル設計",
    difficulty: "応用",
    selectCount: 1,
    question:
      "複数の Cloud Run バックエンドサービスを統合して外部パートナー向けに REST API を公開します。OpenAPI 仕様に基づいて API キー検証や Firebase Auth / JWT トークン認証、ルーティングを行いたいものの、GKE 上で自前プロキシ（ESPv2）コンテナを管理したりエンタープライズ向けの大規模な開発者ポータルを構築したりする予定はなく、完全サーバーレスで軽量に運用したいです。最適なサービスはどれですか？",
    options: [
      "API Gateway",
      "Compute Engine 上の独自 Nginx",
      "Cloud Scheduler",
      "Cloud NAT",
    ],
    correctIndices: [0],
    explanation:
      "API Gateway は Cloud Run / Cloud Run functions / App Engine 向けの完全マネージドなサーバーレス API 管理層であり、OpenAPI 定義による認証（JWT/APIキー）とバックエンドルーティングをプロキシ管理不要で提供します。",
    keywords: ["API Gateway", "Cloud Run", "OpenAPI"],
  },
  {
    id: "pcd-q4",
    domainId: "pcd-domain-1",
    domainLabel: "01: スケーラブル設計",
    difficulty: "標準",
    selectCount: 2,
    question:
      "GKE クラスタ上で動作するマイクロサービスから、(1) Cloud Storage バケットの読み書き、および (2) 外部サードパーティ決済 API 用の機密キー参照を行う必要があります。サービスアカウント鍵の漏洩リスクを排除した Google Cloud 推奨のセキュリティ構成を 2 つ選択してください。",
    options: [
      "Workload Identity Federation for GKE を有効化し、Kubernetes ServiceAccount (KSA) と専用 IAM ServiceAccount (GSA) を紐付けて JSON 鍵ファイルを使用しない",
      "外部決済 API キーは Secret Manager に格納し、GSA へ最小権限（Secret Accessor）のみを付与して安全に取得する",
      "IAM サービスアカウントの JSON 秘密鍵を生成し、Dockerfile の COPY 命令でコンテナイメージに含める",
      "GKE ノードのデフォルト Compute Engine サービスアカウントに Project Owner ロールを付与する",
    ],
    correctIndices: [0, 1],
    explanation:
      "GKE Pod からの Google Cloud API 呼び出しには Workload Identity を使うことで静的 JSON 鍵を完全に排除でき、また外部 API キー等の機密値は Secret Manager でバージョン管理・IAM 統制するのがベストプラクティスです。",
    keywords: ["Workload Identity", "Secret Manager", "最小権限"],
  },
  {
    id: "pcd-q5",
    domainId: "pcd-domain-2",
    domainLabel: "02: ビルドとテスト",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "アプリケーション開発チームがローカル PC 上で、クラウド課金やネットワーク遅延、共有環境のデータ汚染を気にせず Firestore および Pub/Sub と連携するコードの単体・統合テストを高速に反復実行したいと考えています。Google Cloud CLI が提供する最も適切な機能はどれですか？",
    options: [
      "Google Cloud CLI のローカルエミュレータ（Firestore エミュレータ・Pub/Sub エミュレータ）を起動し、環境変数で接続先を切り替える",
      "開発者全員に本番プロジェクトの Firestore への直接書き込み権限を付与する",
      "毎回 Cloud Build を回して本番 GKE へデプロイしてからログを見る",
      "Cloud Storage Archive クラスをデータベース代わりに使用する",
    ],
    correctIndices: [0],
    explanation:
      "Google Cloud CLI は Firestore・Pub/Sub・Cloud Spanner・Cloud Bigtable などのローカルエミュレータを提供しており、`FIRESTORE_EMULATOR_HOST` や `PUBSUB_EMULATOR_HOST` を指定することで高速かつ安全にローカルテストできます。",
    keywords: ["ローカルエミュレータ", "Firestore", "Pub/Sub"],
  },
  {
    id: "pcd-q6",
    domainId: "pcd-domain-2",
    domainLabel: "02: ビルドとテスト",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Cloud Build で Go / Java 製のマイクロサービスコンテナをビルドしていますが、コンパイラやビルドツールが含まれたままイメージサイズが 1.5GB を超え、脆弱性スキャンでの指摘数増加とデプロイ時間の遅延が課題になっています。また毎回のビルド時間も短縮したいです。最も効果的な改善策はどれですか？",
    options: [
      "マルチステージビルドを採用して最終実行ステージを軽量ベースイメージ（Distroless 等）に絞り、Artifact Registry のレイヤキャッシュ（`--cache-from` 等）を併用する",
      "ビルド時間を短縮するためテストと脆弱性スキャンをすべて削除する",
      "ビルド用 VM のメモリを下げて毎回キャッシュなしでフルビルドする",
      "ソースコードをビルドせずにそのまま本番コンテナ内へ全量配置する",
    ],
    correctIndices: [0],
    explanation:
      "マルチステージビルドによりビルド専用ツール類を最終イメージから除外（攻撃面とサイズを劇的に削減）でき、さらに Artifact Registry のキャッシュを利用することで Cloud Build のビルド時間も短縮できます。",
    keywords: ["マルチステージビルド", "Cloud Build", "Artifact Registry"],
  },
  {
    id: "pcd-q7",
    domainId: "pcd-domain-2",
    domainLabel: "02: ビルドとテスト",
    difficulty: "応用",
    selectCount: 1,
    question:
      "Cloud Build の自動統合テストステップから、自社 VPC 内のプライベート IP のみにアクセス制限された検証用 Cloud SQL および社内リポジトリサーバーへ安全に接続してテストを実行する必要があります。標準の共有マネージドワーカーでは VPC 内部へ到達できない場合、構成すべき機能はどれですか？",
    options: [
      "検証用 Cloud SQL に `0.0.0.0/0` のパブリック IP 許可設定を追加する",
      "Cloud Build プライベートプール（Private Pools）を作成し、VPC とのプライベート接続経由で統合テストを実行する",
      "Cloud CDN をテスト DB の前面に配置する",
      "開発者のノート PC に本番データをコピーしてローカル実行させる",
    ],
    correctIndices: [1],
    explanation:
      "Cloud Build のプライベートプール（Private Pools）を使うと、専用ワーカーを自社 VPC ネットワークとピアリング接続して閉域ネットワーク内のリソース（Private IP の Cloud SQL 等）へ安全にアクセスできます。",
    keywords: ["Cloud Build 統合テスト", "Private Pools", "閉域接続"],
  },
  {
    id: "pcd-q8",
    domainId: "pcd-domain-2",
    domainLabel: "02: ビルドとテスト",
    difficulty: "標準",
    selectCount: 2,
    question:
      "コンテナベースのアプリケーションを Artifact Registry に保管し、GKE 本番環境へ安全にデリバリーする仕組みを強化しています。「既知の CVE 脆弱性の自動検出」と「信頼された CI ビルドでテスト・署名されたイメージのみの本番起動許可」を実現する 2 つの機能を選択してください。",
    options: [
      "Artifact Registry で Artifact Analysis による自動・継続的脆弱性スキャンを有効化する",
      "Binary Authorization を有効化し、信頼された証明者（Attestor）の署名がないコンテナイメージの本番デプロイを拒否する",
      "Cloud Run トラフィック分割を 100% 旧バージョンに固定する",
      "Compute Engine の起動スクリプトに `curl` コマンドを書く",
    ],
    correctIndices: [0, 1],
    explanation:
      "Artifact Analysis がコンテナや依存パッケージの脆弱性を継続スキャンし、Binary Authorization がビルド・テスト・スキャン通過後の暗号署名（Attestation）をデプロイ時に検証することでサプライチェーンを保護します。",
    keywords: ["Artifact Analysis", "Binary Authorization", "サプライチェーン"],
  },
  {
    id: "pcd-q9",
    domainId: "pcd-domain-3",
    domainLabel: "03: デプロイ",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "Cloud Run で稼働中の本番 API に新機能を含むコンテナイメージをデプロイします。いきなり全ユーザーへ新バージョンを公開せず、まず本番トラフィックの 5% だけを新リビジョンへ流してエラー率を監視し、問題があれば即座に旧リビジョンへ 100% 戻せるようにしたいです。最も適切な手順はどれですか？",
    options: [
      "`--no-traffic` オプション付きで新リビジョンをデプロイし、Cloud Run トラフィック分割で新リビジョン 5%・旧リビジョン 95% に設定して監視する",
      "新リビジョンを別の新規 Cloud Run サービスとして公開し、DNS レコードを毎回手動変更する",
      "旧リビジョンを削除してから新リビジョンを 100% でデプロイする",
      "全ユーザーに新バージョン用 URL をメールで案内して手動で切り替えてもらう",
    ],
    correctIndices: [0],
    explanation:
      "Cloud Run はリビジョン管理とトラフィック分割をネイティブサポートしており、`--no-traffic` デプロイ後の比率指定（Canary）と異常時の即時 100% 切り戻しが数秒で実行できます。",
    keywords: ["Cloud Run トラフィック分割", "Canary", "ロールバック"],
  },
  {
    id: "pcd-q10",
    domainId: "pcd-domain-3",
    domainLabel: "03: デプロイ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "開発（Dev）→ ステージング（Staging）→ 本番（Prod）の 3 環境の GKE クラスタに対して、ビルド済みの同一コンテナイメージ（不変の SHA256 ダイジェスト指定）を承認フロー付きで順次展開し、ロールアウトの進行状況追跡や Canary 展開・ワンクリックロールバックを一元管理したいと考えています。最適なサービスはどれですか？",
    options: [
      "Cloud Deploy（Skaffold 連携）",
      "Cloud Storage バケット同期",
      "Cloud Scheduler",
      "Identity-Aware Proxy (IAP)",
    ],
    correctIndices: [0],
    explanation:
      "Cloud Deploy は Skaffold を活用して複数ターゲット環境への宣言的デリバリーパイプライン、承認ゲート、Canary/Blue-Green 戦略、履歴追跡、ロールバックをフルマネージドに提供します。",
    keywords: ["Cloud Deploy", "Skaffold", "Canary / Blue-Green"],
  },
  {
    id: "pcd-q11",
    domainId: "pcd-domain-3",
    domainLabel: "03: デプロイ",
    difficulty: "応用",
    selectCount: 1,
    question:
      "GKE 上の Java 製 API コンテナは、起動時のキャッシュ構築と依存ライブラリの初期化に約 75 秒かかります。現在 Liveness Probe（初期遅延 10 秒・間隔 10 秒・失敗閾値 3 回）のみを設定しているため、起動完了前に Pod が何度も強制再起動（CrashLoopBackOff）してしまいます。またノード更新時のサービス断も防ぎたいです。最適な修正はどれですか？",
    options: [
      "Liveness Probe を完全に削除し、レプリカ数を 1 に固定する",
      "Startup Probe を設定して初期化完了まで Liveness / Readiness 判定を待機させ、複数レプリカ構成のうえで PodDisruptionBudget (`maxUnavailable: 1` 等) を設定する",
      "Readiness Probe のタイムアウトを 1 秒に短縮する",
      "`maxUnavailable: 0` の PodDisruptionBudget をレプリカ 1 の Pod に設定する",
    ],
    correctIndices: [1],
    explanation:
      "起動が遅いコンテナには Startup Probe を設定することで、起動中のみ長い猶予を与えつつ起動後のデッドロック検知（Liveness）を迅速に保てます。また複数レプリカ＋適切な PDB によりノード保守時の無停止性を確保できます。",
    keywords: ["Startup Probe", "GKE Probes", "PodDisruptionBudget"],
  },
  {
    id: "pcd-q12",
    domainId: "pcd-domain-3",
    domainLabel: "03: デプロイ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "I/O 待ち（外部 DB・キャッシュ参照）が中心の Cloud Run サービスについて、(1) 初回アクセス時のコールドスタート遅延をなくしたい、(2) 1 インスタンスで効率よく複数リクエストを処理したい、(3) 仲介 VM の管理コストなしで VPC 内の Cloud Memorystore へプライベート接続したい、という 3 要件を満たす最適な設定の組み合わせはどれですか？",
    options: [
      "min-instances を 1 以上に設定し、Cloud Run Concurrency を引き上げ、Direct VPC Egress を構成する",
      "Concurrency を 1 に下げ、min-instances を 0 にしてパブリックインターネット経由で Memorystore へ接続する",
      "Compute Engine VM を手動作成して SSH トンネルを張る",
      "App Engine Standard の第 1 世代ランタイムへ移行する",
    ],
    correctIndices: [0],
    explanation:
      "`min-instances >= 1` でコールドスタートを防ぎ、I/O 待ちが多い場合は Concurrency を上げることでインスタンス数とコストを削減でき、Direct VPC Egress によって Serverless VPC Access コネクタ VM なしで高速に VPC 接続できます。",
    keywords: ["min-instances", "Cloud Run Concurrency", "Direct VPC Egress"],
  },
  {
    id: "pcd-q13",
    domainId: "pcd-domain-4",
    domainLabel: "04: サービス統合",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "モバイルおよび Web 向けのリアルタイムチャット・タスク共有アプリを開発しています。クライアント端末がオフライン状態でもローカルキャッシュに対して読み書きを継続でき、オンライン復帰時に自動同期されるほか、データ変更をリアルタイムリスナーで即時 UI 反映できるサーバーレスデータベースはどれですか？",
    options: [
      "Firestore（Native モード）",
      "Cloud SQL for MySQL",
      "BigQuery",
      "Cloud Storage Coldline",
    ],
    correctIndices: [0],
    explanation:
      "Firestore（Native モード）はモバイル/Web SDK によるオフライン永続化とリアルタイムリスナー（スナップショット監視）、自動水平スケーリングを備えるドキュメント型 NoSQL データベースです。",
    keywords: ["Firestore", "オフライン同期", "リアルタイムリスナー"],
  },
  {
    id: "pcd-q14",
    domainId: "pcd-domain-4",
    domainLabel: "04: サービス統合",
    difficulty: "標準",
    selectCount: 2,
    question:
      "アプリケーションからマネージドリレーショナルデータベース（Cloud Spanner および Cloud SQL）へ安全かつ高パフォーマンスに統合するための設計・実装ベストプラクティスを 2 つ選択してください。",
    options: [
      "Cloud Spanner では書き込みホットスポットを防ぐため、単調増加連番ではなく UUIDv4 等を主キーに選び、親子テーブルの物理局所性向上に Interleaved Tables (`INTERLEAVE IN PARENT`) を利用する",
      "Cloud Run や GKE、ローカル開発環境から Cloud SQL へ接続する際、IP 許可リスト管理を不要にし IAM 認証＋自動 TLS 暗号化を行うため Cloud SQL Auth Proxy（または Language Connectors）を使う",
      "Cloud Spanner のすべてのテーブル主キーに現在時刻のタイムスタンプを先頭カラムとして設定する",
      "Cloud SQL の接続負荷を減らすため、認証なしでパブリックインターネットに `0.0.0.0/0` を開放する",
    ],
    correctIndices: [0, 1],
    explanation:
      "Cloud Spanner では単調増加主キーによるホットスポット回避（UUIDv4 等＋Interleaved Tables）が重要であり、Cloud SQL では Cloud SQL Auth Proxy / Language Connectors による IAM 認証＋暗号化トンネル接続が推奨されます。",
    keywords: ["Cloud Spanner", "Cloud SQL Auth Proxy", "スキーマ設計"],
  },
  {
    id: "pcd-q15",
    domainId: "pcd-domain-4",
    domainLabel: "04: サービス統合",
    difficulty: "応用",
    selectCount: 1,
    question:
      "注文確定後に外部の配送業者 API へ通知を送信する機能を開発しています。配送業者 API 側には「毎秒最大 10 リクエストまで」という厳格なレート制限があり、ピーク時に制限を超えるとすべて失敗してしまいます。また将来時刻を指定したリマインダー送信も行いたいです。Cloud Run ワーカーへの呼び出しレートを厳密制御する最適なサービスはどれですか？",
    options: [
      "Cloud Tasks（キューの `max_dispatches_per_second` 制御とスケジュール機能を利用）",
      "Pub/Sub のファンアウトのみ",
      "Cloud Load Balancing",
      "Cloud Profiler",
    ],
    correctIndices: [0],
    explanation:
      "ターゲット側の処理速度や外部 API のレート制限に合わせて実行間隔（`max_dispatches_per_second`）や同時実行数、遅延実行時刻を制御したい非同期タスクには Cloud Tasks が最適です。",
    keywords: ["Cloud Tasks", "レート制御", "非同期キュー"],
  },
  {
    id: "pcd-q16",
    domainId: "pcd-domain-4",
    domainLabel: "04: サービス統合",
    difficulty: "応用",
    selectCount: 1,
    question:
      "Web アプリからユーザーが最大 500MB の高解像度画像を Cloud Storage へアップロードする機能を実装します。Cloud Run の HTTP/1 リクエストサイズ上限（32 MiB）やメモリ消費を回避し、ユーザーにバケット全体の IAM 権限も付与せずに安全にアップロードさせつつ、アプリ側の API リトライで `429 Too Many Requests` による再試行集中を防ぐ組み合わせとして最も適切なものはどれですか？",
    options: [
      "バックエンドで短時間有効な Cloud Storage の Signed URL を発行してクライアントから直接アップロードさせ、API 再試行には Exponential Backoff with Jitter を実装する",
      "Cloud Run のメモリを 32GB に増やして全ファイルを Base64 エンコードで JSON POST させる",
      "Cloud Storage バケットを `allUsers` に書き込み可能（Public Write）として公開する",
      "API エラー時は待機時間 0 ミリ秒の無限 `while` ループで即時リトライする",
    ],
    correctIndices: [0],
    explanation:
      "大容量ファイルの直接転送には時間・メソッド制限付きの Signed URL（署名付き URL）を発行するのが定石です。また一時的エラーの再試行ではジッター付き Exponential Backoff で Thundering Herd（リトライ集中）を防ぎます。",
    keywords: ["Signed URL", "Cloud Storage", "Exponential Backoff"],
  },
  {
    id: "pcd-q17",
    domainId: "pcd-domain-5",
    domainLabel: "05: 運用と可観測性",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "5 つのマイクロサービス（API Gateway → 認証 → 注文 → 在庫 → 決済）を連携させた処理で応答時間が突然 4 秒以上に悪化しました。「どのサービス間通信や外部 API 呼び出しの区間（Span）が全体の遅延の大部分を占めているか」をリクエスト単位のウォーターフォール図で特定したい場合、使用すべきサービスはどれですか？",
    options: [
      "Cloud Trace",
      "Error Reporting",
      "Cloud Build",
      "Secret Manager",
    ],
    correctIndices: [0],
    explanation:
      "Cloud Trace は分散トレーシングサービスであり、マイクロサービス間でトレースコンテキストを伝播させることで、1 つのリクエスト内の各処理区間（Span）の所要時間を可視化しボトルネックを特定できます。",
    keywords: ["Cloud Trace", "分散トレーシング", "レイテンシ調査"],
  },
  {
    id: "pcd-q18",
    domainId: "pcd-domain-5",
    domainLabel: "05: 運用と可観測性",
    difficulty: "標準",
    selectCount: 1,
    question:
      "本番稼働中の Go 製バックエンドサービスにおいて CPU 使用率が異常に高く、特定のリクエスト処理が非効率なループや正規表現処理を実行している疑いがあります。本番サービスを停止せず、パフォーマンスへの影響を最小限に抑えながら、コード内のどの関数・メソッドが CPU やヒープメモリを最も消費しているかフレームグラフで特定するツールはどれですか？",
    options: [
      "Cloud Profiler",
      "Cloud Armor",
      "Cloud Scheduler",
      "Artifact Analysis",
    ],
    correctIndices: [0],
    explanation:
      "Cloud Profiler は本番環境での常時低オーバーヘッドサンプリングにより、関数レベルの CPU 使用量やメモリ割り当てをフレームグラフとして可視化し、コード内のボトルネックを特定します。",
    keywords: ["Cloud Profiler", "フレームグラフ", "CPU/メモリ分析"],
  },
  {
    id: "pcd-q19",
    domainId: "pcd-domain-5",
    domainLabel: "05: 運用と可観測性",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Cloud Run 上のアプリケーションで、重大度（ERROR / WARNING 等）によるログの正確なフィルタリング、Cloud Trace のリクエストトレースとの相関付け、および未捕捉の例外スタックトレースの自動集約・通知を行いたいと考えています。開発者が実装すべきロギング設計として最も適切なものはどれですか？",
    options: [
      "コンテナ内のローカルファイル `/var/log/app.log` にプレーンテキストで書き込む",
      "`stdout` へ `severity` や `logging.googleapis.com/trace` フィールドを含む構造化ログ（JSON）を出力し、Error Reporting と連携させる",
      "すべてのログを `console.log` の単一行文字列にして標準エラーへ出力しない",
      "デバッグ以外の全ログ出力を無効化する",
    ],
    correctIndices: [1],
    explanation:
      "Cloud Run や GKE では `stdout` へ JSON 形式の構造化ログを出力すると Cloud Logging が `severity` や `logging.googleapis.com/trace` を自動解析して Trace 画面と相関連携し、スタックトレースは Error Reporting が自動集約します。",
    keywords: ["構造化ログ", "Cloud Logging", "Error Reporting"],
  },
  {
    id: "pcd-q20",
    domainId: "pcd-domain-5",
    domainLabel: "05: 運用と可観測性",
    difficulty: "応用",
    selectCount: 2,
    question:
      "デプロイ済みアプリケーション（Cloud Run および一部 Compute Engine VM のハイブリッド構成）の可観測性と障害検知力を高めるための運用プラクティスとして正しいものを 2 つ選択してください。",
    options: [
      "Compute Engine VM 上の OS メモリ使用率やディスク詳細指標、アプリログを統一収集するため、Fluent Bit と OpenTelemetry ベースの Ops Agent を導入する",
      "アプリログ内の特定ビジネスエラー（例：`jsonPayload.code='PAYMENT_TIMEOUT'`）の発生件数を時系列で監視・アラート化するため、Cloud Logging のログベース指標（Log-based Metrics）と Cloud Monitoring アラートを作成する",
      "アラート数を減らすため Cloud Monitoring のアップタイムチェックと通知チャネルをすべて削除する",
      "分散トレースのベンダーロックインを避けるため、トレースヘッダー（`traceparent`）を各マイクロサービスで意図的に破棄する",
    ],
    correctIndices: [0, 1],
    explanation:
      "Compute Engine VM のメトリクス・ログ統合収集には Ops Agent が推奨され、任意の構造化ログパターンを時系列メトリクス化するには Log-based Metrics＋Cloud Monitoring アラートポリシーが有効です。",
    keywords: ["Ops Agent", "Log-based Metrics", "Cloud Monitoring"],
  },
];

export const pcdOfficialResources: GcpOfficialResource[] = [
  {
    title: "Professional Cloud Developer 認定公式ページ",
    description: "試験概要（120 分・50〜60 問・有効期間 2 年）、推奨経験、CertMetrics / Pearson VUE 受験案内を確認できます。",
    url: "https://cloud.google.com/learn/certification/cloud-developer?hl=ja",
    badge: "公式認定ページ",
  },
  {
    title: "Professional Cloud Developer 公式試験ガイド (PDF)",
    description: "Google Cloud 公式の出題領域・評価スキル・対象開発ツールの一次情報（英語 PDF）です。",
    url: "https://services.google.com/fh/files/misc/professional_cloud_developer_exam_guide_english.pdf",
    badge: "公式試験ガイド",
  },
  {
    title: "Cloud Run 公式ドキュメント",
    description: "コンテナライフサイクル（SIGTERM）、同時実行数、Direct VPC Egress、トラフィック分割の一次リファレンスです。",
    url: "https://docs.cloud.google.com/run/docs?hl=ja",
    badge: "サーバーレス公式",
  },
  {
    title: "Google Cloud Architecture Framework",
    description: "クラウドネイティブ設計・信頼性・セキュリティ・パフォーマンス最適化の公式ベストプラクティス集です。",
    url: "https://docs.cloud.google.com/architecture/framework?hl=ja",
    badge: "公式設計ガイド",
  },
];
