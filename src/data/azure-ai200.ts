// 出典: Microsoft Learn Exam AI-200 公式試験ガイド (Study guide for Exam AI-200 / 旧 AZ-204 後継)
import type {
  CertExamFact,
  CertFlashcardItem,
  CertQuestion,
} from "@/components/certification/types";
import type {
  AzureDomain,
  AzureComparisonTable,
  AzureArchitecturePattern,
  AzurePitfall,
  AzureKeyFact,
  AzureOfficialResource,
} from "./azure-types";

export const ai200ExamFacts: CertExamFact[] = [
  {
    label: "対象試験",
    value: "Exam AI-200",
    detail: "Azure AI Cloud Developer ※旧 AZ-204 後継",
  },
  {
    label: "試験時間",
    value: "100 分",
    detail: "着席 120 分目安・ラボ含む場合は 120 分",
  },
  {
    label: "合格スコア",
    value: "700 / 1000",
    detail: "スケールスコア 100〜1000 点",
  },
  {
    label: "有効期限",
    value: "1 年間（無料更新）",
    detail: "Microsoft Learn 更新評価で延長",
  },
  {
    label: "受験形式",
    value: "Pearson VUE",
    detail: "Microsoft Learn 参照可・ケーススタディ含む",
  },
  {
    label: "試験形式",
    value: "選択・ケーススタディ",
    detail: "コンテナ・AI データ基盤・イベント統合・観測性実装",
  },
];

export const ai200Domains: AzureDomain[] = [
  {
    id: "ai200-domain-1",
    number: "01",
    title: "Azure でのコンテナー化ソリューションの開発",
    englishTitle: "Develop containerized solutions on Azure",
    weight: "20〜25%",
    accentColor: "indigo",
    summary:
      "Azure Container Registry (ACR) と ACR Tasks によるイメージビルド・署名・マネージド ID プル、Azure Container Apps (ACA) のリビジョン・KEDA・Dapr・シークレット設計、および AKS のワークロード展開とプローブ・Workload Identity を習得します。",
    topics: [
      {
        id: "ai200-1-1",
        code: "1.1",
        title: "コンテナホスティング選定と Azure Container Registry (ACR)",
        services: [
          "Azure Container Registry",
          "ACR Tasks",
          "Azure Container Apps",
          "AKS",
          "Azure Container Instances",
        ],
        keyPoints: [
          "ホスティング選定の基準：単発バッチや軽量起動は Azure Container Instances (ACI)、Kubernetes 管理不要のマイクロサービス・イベント駆動・ゼロスケールは Azure Container Apps (ACA)、CRD・サービスメッシュ・GPU ノードプール等の完全制御は AKS を選定する",
          "ACR Tasks（`az acr build` やマルチステップタスク YAML）を使うとローカルに Docker デーモンを用意せずにクラウド上でコンテナーイメージをビルド・プッシュでき、Git コミットやベースイメージ更新を契機とした自動再ビルドも構成できる",
          "コンテナーイメージのサプライチェーン保護には ACR のリポジトリ権限・コンテンツ信頼 / Notation 署名検証を用い、OS や依存脆弱性の継続スキャンを組み合わせる",
          "ACR からのイメージプル時は管理者ユーザー（Admin user）の共有パスワードを無効化し、ワークロードのマネージド ID へ `AcrPull` ロールを割り当ててパスワードレスで認証する",
        ],
        examTip:
          "『ローカル Docker 不要でビルド自動化』＝ ACR Tasks、『ACR 認証で資格情報を持たせない』＝ マネージド ID + `AcrPull` ロール、『K8s 不要＋イベント駆動スケール』＝ ACA。",
      },
      {
        id: "ai200-1-2",
        code: "1.2",
        title: "Azure Container Apps のデプロイと運用",
        services: [
          "Azure Container Apps",
          "リビジョン管理",
          "KEDA",
          "Dapr",
          "Azure Files / シークレットボリューム",
        ],
        keyPoints: [
          "リビジョン管理は Single（単一アクティブ）と Multiple（複数同時アクティブ）を切り替えられ、Multiple モードでは新旧リビジョンへ重み付け（合計 100%）によるトラフィック分割やリビジョンラベルを使ったブルーグリーン / カナリアテストを実行できる",
          "内蔵された KEDA（Kubernetes Event-driven Autoscaling）により、HTTP 同時実行数や Azure Service Bus キュー長・Event Hubs ラグに応じてレプリカ数を自動伸縮し、`minReplicas: 0` 設定で無通信時のゼロスケール課金停止が可能",
          "Dapr（Distributed Application Runtime）をサイドカーとして有効化すると、アプリコードを変更せず状態管理・サービス間呼び出し・Pub/Sub（Service Bus 等）・バインディングを標準 HTTP/gRPC API で抽象化できる",
          "シークレットはアプリレベルで定義し、環境変数または `storageType: Secret` のボリュームマウントとしてコンテナー内ファイルへ配置できる（シークレット値更新時は新リビジョン作成またはリビジョン再起動が必要）。永続ストレージ共有には Azure Files をボリュームマウントする",
        ],
        examTip:
          "『リビジョン間で 80%/20% トラフィック分割』＝ Multiple リビジョンモード、『Service Bus キュー長で 0→N 台スケール』＝ ACA 内蔵 KEDA スケーラー、『シークレット更新が反映されない』＝ リビジョン再起動漏れ。",
      },
      {
        id: "ai200-1-3",
        code: "1.3",
        title: "AKS ワークロード展開とネットワーク / ヘルスプローブ設計",
        services: [
          "Azure Kubernetes Service (AKS)",
          "Liveness / Readiness / Startup Probe",
          "Ingress / Application Routing",
          "Microsoft Entra Workload ID",
        ],
        keyPoints: [
          "Kubernetes マニフェスト（Deployment / Service / ConfigMap / Secret）でレプリカ構成やリソース要求・制限（`requests` / `limits`）を定義し、ローリングアップデート戦略で無停止展開を行う",
          "3 種類のヘルスプローブを厳格に使い分ける：起動時の重い AI モデル読込等で Liveness 誤爆を防ぐ Startup Probe、準備完了・依存復旧まで Service からトラフィックを除外する Readiness Probe、プロセス自体がハングした際にコンテナを再起動する Liveness Probe",
          "外部公開や L7 パスルーティングには Application Routing アドオン（NGINX Ingress）や Application Gateway for Containers (AGC) を用い、TLS 終端や内部ロードバランサ構成を設計する",
          "Pod から Key Vault や Cosmos DB 等の Azure サービスへアクセスする際は、非推奨の Pod Identity ではなく OIDC Issuer とフェデレーション資格情報を用いた Microsoft Entra Workload ID でポッド単位の最小権限認証を実装する",
        ],
        examTip:
          "『初期化に時間がかかる AI コンテナが起動途中で何度も再起動される』＝ Startup Probe 未設定で Liveness Probe が先に失敗している典型パターン。",
      },
    ],
  },
  {
    id: "ai200-domain-2",
    number: "02",
    title: "Azure データ管理サービスを用いた AI ソリューション開発",
    englishTitle: "Develop AI solutions by using Azure data management services",
    weight: "25〜30%",
    accentColor: "cyan",
    summary:
      "Azure Cosmos DB for NoSQL（パーティション設計・整合性・Change Feed・DiskANN ベクター検索）、Azure Database for PostgreSQL + pgvector（HNSW / IVFFlat）、Azure Managed Redis（セマンティックキャッシュ・RediSearch）、および RAG データ取り込みパイプラインの実装を学びます。",
    topics: [
      {
        id: "ai200-2-1",
        code: "2.1",
        title: "Azure Cosmos DB for NoSQL とベクター検索 / DiskANN",
        services: [
          "Azure Cosmos DB (NoSQL API)",
          "Change Feed",
          "DiskANN / Sharded DiskANN",
          "整合性レベル",
        ],
        keyPoints: [
          "パーティションキーは高カーディナリティかつ読み書きが均等分散する属性（または階層型パーティションキー `/tenantId`, `/userId`）を選び、論理パーティション上限（20 GB）とホットパーティションによる 429 スロットリングを回避する",
          "整合性レベルは Strong / Bounded Staleness / Session（既定：同一セッション内で Read-Your-Writes 保証）/ Consistent Prefix / Eventual の 5 段階から、AI 会話履歴の鮮度要件と RU コストに応じて選択する",
          "Change Feed（変更フィード：プルモデルまたは Change Feed Processor / Azure Functions トリガー）により、アイテムの挿入・更新イベントを順序付きで捕捉し、非同期の埋め込み生成や下流インデックス更新を駆動できる",
          "ベクター検索ではコンテナー作成時に Vector Policy と Vector Index を定義する。`DiskANN` は最大 4,096 次元（`flat` は 505 次元上限）の高速 ANN 検索を提供し（1,000 ベクトル未満ではフルスキャン動作）、マルチテナント分離には `Sharded DiskANN`（`vectorIndexShardKey`）が有効。なおベクターポリシーとインデックスはコンテナー作成後に変更できない",
        ],
        examTip:
          "『既存の Cosmos DB コンテナーに後から DiskANN ベクターポリシーを追加したい』は不可（新規コンテナー作成＋移行が必要）。また 1,000 件未満は DiskANN グラフが完全構築されずフルスキャンになる点に注意。",
      },
      {
        id: "ai200-2-2",
        code: "2.2",
        title: "Azure Database for PostgreSQL + pgvector によるベクター検索",
        services: [
          "Azure Database for PostgreSQL (Flexible Server)",
          "pgvector",
          "HNSW インデックス",
          "IVFFlat インデックス",
        ],
        keyPoints: [
          "Azure Database for PostgreSQL Flexible Server で `pgvector` 拡張機能（`CREATE EXTENSION vector;`）を有効化すると、リレーショナルデータや構造化メタデータと同一トランザクション内で `vector(n)` 型の埋め込みベクトルを格納・結合検索できる",
          "類似度検索インデックスは主に 2 種類：`HNSW`（多層グラフ構造）は高い検索精度（Recall）と高速なクエリ性能を発揮する一方、構築時間とメモリ消費が大きい。`IVFFlat`（クラスタ分割）はビルドが高速で省メモリだが、`lists` や検索時 `ivfflat.probes` の調整が必要",
          "`pgvector` で HNSW または IVFFlat インデックスを作成できるベクトル次元数の上限は最大 2,000 次元。2,000 次元を超える埋め込みを扱う場合はモデル設定や次元削減（Matryoshka / 射影）で 2,000 次元以下に収める必要がある",
          "距離演算子はモデル特性に合わせて選択する：コサイン距離 `<=>`、ユークリッド距離 (L2) `<->`、長さが 1 に正規化された埋め込みベクトルには高速な内積 `<#>` を用いる（インデックス作成時の演算子クラスとクエリ演算子の一致が必須）",
        ],
        examTip:
          "『pgvector で 3,072 次元の埋め込みに HNSW インデックスを貼ったらエラーになった』＝ pgvector インデックス上限 2,000 次元超過が原因。インデックス定義とクエリ演算子（例：`vector_cosine_ops` と `<=>`）の一致も必須。",
      },
      {
        id: "ai200-2-3",
        code: "2.3",
        title: "Azure Managed Redis による状態管理とセマンティックキャッシュ",
        services: [
          "Azure Managed Redis",
          "RediSearch",
          "セマンティックキャッシュ",
          "Azure API Management",
        ],
        keyPoints: [
          "Azure Managed Redis はインメモリデータストアとして AI アプリの会話コンテキスト・セッション状態・レート制御をサブミリ秒で処理し、`RediSearch` モジュールによってハッシュ / JSON 上のベクターインデックスとハイブリッド検索を提供する",
          "前提制約として、`RediSearch` モジュールは Azure Managed Redis インスタンスの新規作成時のみ有効化可能であり、作成済みインスタンスへ後から追加することはできない",
          "セマンティックキャッシュ構成では、入力プロンプトの埋め込みベクトルを生成し、RediSearch の `HNSW` または `FLAT` インデックス（COSINE / L2 / IP）で過去の問い合わせを類似度検索し、閾値内かつメタデータフィルタ（テナント・権限・モデル版）一致時に LLM 呼び出しをバイパスして即応する",
          "実装経路は大きく 2 通り：アプリ側で RedisVL / Semantic Kernel 等から直接参照する方法と、Azure API Management (APIM) の外部キャッシュ連携および `<llm-semantic-cache-lookup>` / `<llm-semantic-cache-store>` ポリシーでゲートウェイ層に集約する方法がある",
        ],
        examTip:
          "『既存 Redis インスタンスに後からベクター検索用 RediSearch を追加できない』点と、『マルチテナント環境では類似度検索時に必ずテナント/権限フィルタを併用する』点が最頻出。",
      },
      {
        id: "ai200-2-4",
        code: "2.4",
        title: "AI / RAG 向けデータ取り込み・チャンク化・インデックス更新パイプライン",
        services: [
          "Azure Blob Storage",
          "Event Grid / Change Feed",
          "Azure Functions",
          "Vector Stores",
        ],
        keyPoints: [
          "ソースデータの増分同期はバッチ全量再構築ではなく、Blob 作成・削除イベント（Event Grid）や DB 更新（Cosmos DB Change Feed）を起点に Azure Functions 等で変更分のみ再ベクトル化するイベント駆動パイプラインが推奨される",
          "ドキュメントのチャンク化（Chunking）では固定長または見出し・段落単位の構造認識分割と適切なオーバーラップ（重複幅）を設計し、文脈の分断を防ぎつつ埋め込みモデルのトークン上限内に収める",
          "各チャンクレコードにはソース文書 ID・チャンク連番・更新日時・埋め込みモデルバージョン・アクセス制御用メタデータ（`tenantId` / `allowedGroups` 等）を併せて保存し、検索時のフィルタリングと論理削除を追従可能にする",
          "更新パイプラインはネットワーク再試行や重複イベントに備え、決定的なチャンク ID（例：`docId_chunkIndex`）を用いたべき等（Idempotent）な Upsert と、元文書削除時の古いチャンク一括削除を組み込む",
        ],
        examTip:
          "『元ファイルが更新・削除されたのに古いチャンクが RAG 検索結果に残り続ける』＝ べき等 ID 管理と削除イベント（BlobDeleted 等）時のチャンクパージ処理の設計漏れ。",
      },
    ],
  },
  {
    id: "ai200-domain-3",
    number: "03",
    title: "Azure サービスへの接続と利用",
    englishTitle: "Connect to and consume Azure services",
    weight: "20〜25%",
    accentColor: "emerald",
    summary:
      "Azure Service Bus による順序保証・トランザクション・DLQ メッセージング、Azure Event Grid によるイベントルーティングと再試行・デッドレタリング、および Azure Functions（Flex Consumption / Durable Functions）によるサーバーレス API と長時間 AI オーケストレーションを習得します。",
    topics: [
      {
        id: "ai200-3-1",
        code: "3.1",
        title: "Azure Service Bus による信頼性の高いメッセージング",
        services: [
          "Azure Service Bus",
          "Queue / Topic & Subscription",
          "Sessions (FIFO)",
          "Dead-Letter Queue (DLQ)",
        ],
        keyPoints: [
          "1 対 1 のコマンド処理にはキュー（Queue）、1 対多で複数コンシューマーへルール別に配信（SQL フィルター / 相関フィルター）する場合はトピックとサブスクリプション（Topic / Subscription）を選定する",
          "受信モードは `ReceiveAndDelete`（即時削除・低オーバーヘッドだが処理失敗時に消失リスク）と `PeekLock`（既定・処理完了時に `Complete`、失敗時に `Abandon` / `DeadLetter`）を使い分ける。`PeekLock` のロック期間は既定 60 秒・設定上限 5 分で、長時間処理時は SDK の自動ロック更新を使用する",
          "セッション（`RequiresSession`）を有効化すると `SessionId` 単位の厳密な FIFO 順序保証が実現でき、重複検出（Duplicate Detection）は `MessageId` ベースで二重処理を排除する",
          "サイズとスループット：Standard 層の最大メッセージサイズは 256 KB、Premium 層（専用リソース・VNet 閉域・AZ 対応）は AMQP 単一メッセージで最大 100 MB（HTTP / バッチは 1 MB）に対応し、`MaxDeliveryCount` 超過や TTL 切れメッセージはデッドレターキュー（DLQ）へ自動退避される",
        ],
        examTip:
          "『ユーザーごとの会話ターンや注文状態を厳密に順処理したい』＝ Service Bus セッション、`PeekLock` の 5 分上限超過による再配信対策 ＝ 自動ロック更新または非同期ジョブ切り出し。",
      },
      {
        id: "ai200-3-2",
        code: "3.2",
        title: "Azure Event Grid によるイベント駆動ワークフロー",
        services: [
          "Azure Event Grid",
          "System / Custom / Namespace Topics",
          "CloudEvents v1.0",
          "Dead-lettering",
        ],
        keyPoints: [
          "Event Grid は離散的な状態変化（Blob 作成、Key Vault シークレット期限切迫、独自アプリイベント）をプッシュ配信するイベントルーターであり、Azure リソース向けシステムトピック、独自イベント向けカスタムトピック、プル型配信や MQTT も統合する Event Grid Namespace を提供する",
          "イベントスキーマは Event Grid 固有スキーマに加え、CNCF 標準の CloudEvents v1.0 スキーマをネイティブサポートし、イベントタイプ（`eventType`）・プレフィックス/サフィックス（`subjectBeginsWith` / `subjectEndsWith`）・高度属性フィルターで購読側処理のみを絞り込める",
          "サブスクライバーがエラー（5xx 等）を返した場合、Event Grid は既定で最大 24 時間または最大 30 回（どちらか早い方まで）10 秒〜12 時間の指数バックオフスケジュールで配信を再試行する",
          "すべての再試行を使い切ったイベントや恒久的エラー（400 / 403 等）は既定で破棄されるため、本番ではデッドレタリング（Dead-lettering）を有効化して Azure Blob Storage コンテナーへ未配信イベントを退避・再処理できるようにする",
        ],
        examTip:
          "『大容量テレメトリのストリーミング・順序リプレイ』＝ Event Hubs、『状態変化の軽量プッシュ通知＋フィルタリング』＝ Event Grid、『FIFO・DLQ・トランザクション』＝ Service Bus。",
      },
      {
        id: "ai200-3-3",
        code: "3.3",
        title: "Azure Functions と Durable Functions によるサーバーレス統合",
        services: [
          "Azure Functions (Isolated Worker)",
          "Flex Consumption / Premium プラン",
          "Triggers & Bindings",
          "Durable Functions",
        ],
        keyPoints: [
          "分離ワーカーモデル（Isolated Worker Model）とトリガー / 入出力バインディング（HTTP, Timer, Blob, Cosmos DB, Service Bus, Event Grid）を組み合わせ、ボイラープレート接続コードを最小化してマイクロサービス API やデータ処理関数を構築する",
          "ホスティングプラン選定：Flex Consumption は従量課金と高速スケーリングを保ちつつ常時準備（Always Ready）インスタンス・インスタンス単位メモリ設定・VNet 統合（対象サブネットを `Microsoft.App/environments` へ委任）をサポート。旧 Consumption と異なり `host.json` の `functionTimeout` 上限撤廃（既定 30 分・非 HTTP で無制限設定可）に対応する",
          "注意点として、Flex Consumption 等でも HTTP トリガー関数の応答上限は Azure Load Balancer のアイドルタイムアウトにより 230 秒固定である。230 秒を超える同期 HTTP 待機は必ずエラーとなる",
          "複数 LLM 呼び出しの並列実行（Fan-out / Fan-in）、関数チェーン、人間承認待ち（External Event）、230 秒超の非同期 HTTP API パターン（`202 Accepted` + ステータス確認 URI 返却）には Durable Functions を使用する",
        ],
        examTip:
          "『VNet 内リソースへ閉域接続しつつ従量課金でコールドスタートを抑えたい』＝ Flex Consumption プラン（サブネット委任は `Microsoft.App/environments`）、『230 秒超の HTTP リクエスト』＝ Durable Functions の非同期 HTTP API パターン。",
      },
    ],
  },
  {
    id: "ai200-domain-4",
    number: "04",
    title: "Azure ソリューションのセキュリティ・監視・トラブルシューティング",
    englishTitle: "Secure, monitor, and troubleshoot Azure solutions",
    weight: "20〜25%",
    accentColor: "amber",
    summary:
      "Azure Key Vault と Azure App Configuration によるシークレット・機能フラグ管理、マネージド ID と Microsoft Entra ID（MSAL / DefaultAzureCredential / 最小権限 RBAC）認証、および OpenTelemetry・Application Insights・Log Analytics・KQL による分散トレーシングと障害解析を学びます。",
    topics: [
      {
        id: "ai200-4-1",
        code: "4.1",
        title: "Azure Key Vault と Azure App Configuration による構成・機密保護",
        services: [
          "Azure Key Vault",
          "Azure App Configuration",
          "Feature Flags",
          "Sentinel キー / Key Vault 参照",
        ],
        keyPoints: [
          "API キー・接続文字列・暗号鍵・TLS 証明書は Azure Key Vault へ一元格納し、アクセス制御にはレガシーなアクセス ポリシーではなくきめ細かなスコープ管理が可能な Azure RBAC アクセス許可モデル（`Key Vault Secrets User` 等）を使用する",
          "Key Vault は既定でソフト削除（Soft Delete：既定 90 日、7〜90 日設定可）が強制有効化されており、さらにコンテナーやアイテムの完全強制削除を防ぐため消去保護（Purge Protection）を有効化し、Event Grid（`SecretNearExpiry` 等）＋ Functions で自動ローテーションを実装する",
          "非機密の設定値や階層化構成（ラベルによる `Dev` / `Prod` 分離）、およびコード再デプロイなしにカナリア公開・緊急停止を行える機能フラグ（Feature Flags）は Azure App Configuration で一元管理する",
          "App Configuration から Key Vault シークレットの URI を参照（Key Vault Reference）させて設定取得パスを統一でき、実行中の動的再読み込みには変更検知用のセンチネルキー（Sentinel key）を監視するミドルウェア構成を組み合わせる",
        ],
        examTip:
          "『非機密の構成値と機能フラグ＋Key Vault への統一参照窓口』＝ App Configuration、『機密データ保管＋RBAC＋ソフト削除/消去保護』＝ Key Vault。",
      },
      {
        id: "ai200-4-2",
        code: "4.2",
        title: "マネージド ID・Microsoft Entra ID 認証・最小権限 RBAC",
        services: [
          "システム割り当て / ユーザー割り当てマネージド ID",
          "DefaultAzureCredential",
          "MSAL",
          "Azure RBAC (データプレーン)",
        ],
        keyPoints: [
          "Azure サービス間の認証は資格情報・シークレット不要のマネージド ID を原則とする：単一リソースとライフサイクルを共有し削除時に自動消去される「システム割り当て」、複数コンテナ・関数で共有し事前プロビジョニングできる「ユーザー割り当て」を要件で使い分ける",
          "Azure SDK の `DefaultAzureCredential`（`Azure.Identity` / `azure-identity`）を用いると、ローカル開発時は開発者の Azure CLI / VS Code 資格情報、Azure 本番環境では環境変数設定のみでマネージド ID へとコード変更なしに自動切替できる",
          "ユーザー代理アクセスや対話型サインイン、On-Behalf-Of (OBO) トークン取得が必要な場合は MSAL（Microsoft Authentication Library）を使用してトークンキャッシュとスコープ要求を実装する",
          "最小権限の原則に基づき、管理プレーンの `Contributor` ではなく操作対象に応じたデータプレーンロール（`Storage Blob Data Contributor`, `Key Vault Secrets User`, `Azure Service Bus Data Sender` / `Receiver`, `Cosmos DB Built-in Data Contributor` 等）を割り当てる",
        ],
        examTip:
          "『複数インスタンス間で同じ事前承認済み ID を使い回し、リソース再作成時も権限付与をやり直したくない』＝ ユーザー割り当てマネージド ID。",
      },
      {
        id: "ai200-4-3",
        code: "4.3",
        title: "分散トレーシングと観測性（OpenTelemetry・Application Insights・KQL）",
        services: [
          "OpenTelemetry SDK",
          "Application Insights",
          "Log Analytics",
          "KQL (Kusto Query Language)",
        ],
        keyPoints: [
          "分散 AI アプリ（API ゲートウェイ → Container Apps → Service Bus → Functions → ベクター DB / LLM）の計装には、ベンダー中立標準の OpenTelemetry SDK（Azure Monitor OpenTelemetry Distro）を導入し、トレース・メトリクス・構造化ログを一貫して出力する",
          "W3C Trace Context（`traceparent` ヘッダーや Service Bus メッセージプロパティ `Diagnostic-Id`）を非同期メッセージ越えでも伝播させることで、Application Insights のアプリケーションマップとエンドツーエンド トランザクション詳細上で単一の `operation_Id` として結合可視化できる",
          "高トラフィック環境でテレメトリ課金を最適化しつつ因果関係を維持するには、アダプティブ/固定率サンプリングや不要スパンのフィルタリング、ライブメトリクスによるリアルタイム監視を組み合わせる",
          "Log Analytics ワークスペース上では KQL（`requests`, `dependencies`, `exceptions`, `traces` テーブル）を用い、`where timestamp > ago(1h)`, `summarize percentile(duration, 95) by bin(timestamp, 5m), name`, `join` 等でボトルネックや失敗依存先を特定する",
        ],
        examTip:
          "『HTTP から Service Bus を挟んだ先の Functions 処理まで 1 本のトレースとして追いたい』＝ OpenTelemetry SDK ＋ メッセージプロパティへの W3C Trace Context 伝播（`operation_Id` 相関）。",
      },
    ],
  },
];

export const ai200Comparisons: AzureComparisonTable[] = [
  {
    id: "ai200-comp-containers",
    category: "コンピュート",
    title: "Azure コンテナ・サーバーレス実行基盤比較",
    subtitle: "制御粒度・スケーリングモデル・タイムアウト特性・AI ワークロード適正",
    columns: ["実行基盤", "管理モデル・制御範囲", "スケーリング・タイムアウト特性", "最適ユースケース"],
    rows: [
      {
        feature: "Azure Container Apps (ACA)",
        values: [
          "サーバーレスコンテナ（K8s 管理不要・Dapr 内蔵）",
          "KEDA イベント伸縮・ゼロスケール・Multiple リビジョン分割",
          "HTTP API・非同期ワーカー・マイクロサービス構築",
        ],
      },
      {
        feature: "Azure Kubernetes Service (AKS)",
        values: [
          "フル機能のマネージド Kubernetes（Pod/Node 完全制御）",
          "HPA/KEDA・GPU ノードプール・3 種ヘルスプローブ細密設定",
          "独自 CRD・高度なメッシュ・大規模推論クラスタ運用",
        ],
      },
      {
        feature: "Azure Container Instances (ACI)",
        values: [
          "オーケストレーターなしの軽量サーバーレスコンテナ群",
          "秒単位起動・単発ジョブ終了後課金停止（自動スケール非標準）",
          "単発バッチ変換・CI ビルドエグゼキューター・短時間タスク",
        ],
      },
      {
        feature: "Azure Functions (Flex Consumption)",
        values: [
          "イベント駆動 FaaS（トリガー/バインディング・VNet 委任統合）",
          "Always Ready 待機可・非 HTTP 無制限（HTTP 応答は 230 秒上限）",
          "イベント連動の軽量 RAG 索引処理・Durable オーケストレーション",
        ],
      },
    ],
    decisionRule:
      "K8s 管理不要のコンテナ連携＝ACA、CRD/GPU 細密制御＝AKS、単発タスク＝ACI、イベントトリガー関数・長時間調停＝Functions (+ Durable)。",
  },
  {
    id: "ai200-comp-messaging",
    category: "コンピュート",
    title: "メッセージング・イベント駆動サービス比較",
    subtitle: "順序保証・配信モデル・サイズ上限・再試行と DLQ の使い分け",
    columns: ["サービス", "配信モデル・メッセージ上限", "順序・信頼性・再試行機構", "AI アプリでの主用途"],
    rows: [
      {
        feature: "Azure Service Bus",
        values: [
          "プル型キュー / Pub-Sub（Standard 256 KB / Premium AMQP 100 MB）",
          "セッションによる FIFO 保証・重複検出・PeekLock（最大 5 分）・DLQ",
          "推論ジョブキュー・会話順保証処理・確実なコマンド配信",
        ],
      },
      {
        feature: "Azure Event Grid",
        values: [
          "プッシュ型イベントルーター（1 イベント既定 64 KB〜最大 1 MB）",
          "属性/CloudEvents フィルタ・最大 24 時間 / 30 回再試行＋Blob DLQ",
          "Blob 更新契機の RAG 索引起動・Key Vault 期限通知",
        ],
      },
      {
        feature: "Azure Event Hubs",
        values: [
          "パーティション分割型高スループットストリーム（Kafka 互換）",
          "コンシューマーグループによる並列読取・時間軸リプレイ・Capture",
          "秒間大量のテレメトリ・LLM 利用ログのリアルタイム収集",
        ],
      },
      {
        feature: "Azure Queue Storage",
        values: [
          "HTTP REST ベースの単純ストレージキュー（1 メッセージ最大 64 KB）",
          "FIFO 非保証・最大 500 TiB 容量・7 日間 TTL（既定）",
          "80 GB 超の大量バックグラウンドジョブ参照 ID の低コスト保管",
        ],
      },
    ],
    decisionRule:
      "FIFO・DLQ・100 MB 大容量業務メッセージ＝Service Bus、状態変化のプッシュ通知＝Event Grid、大量ストリーム＝Event Hubs。",
  },
  {
    id: "ai200-comp-data-stores",
    category: "ストレージ・DB",
    title: "AI ワークロード向け Azure データストア比較",
    subtitle: "Cosmos DB NoSQL・PostgreSQL Flexible Server・Azure Managed Redis の役割分担",
    columns: ["データストア", "データモデルと検索機能", "スケーリング・整合性・特徴", "AI ソリューションでの主用途"],
    rows: [
      {
        feature: "Azure Cosmos DB for NoSQL",
        values: [
          "JSON ドキュメント＋組込ベクター検索（DiskANN / Flat）＋全文検索",
          "グローバル分散・5 段階整合性（既定 Session）・Change Feed 連携",
          "マルチリージョン RAG ストア・会話履歴・イベント駆動パイプライン起点",
        ],
      },
      {
        feature: "Azure DB for PostgreSQL (Flexible)",
        values: [
          "リレーショナル DB ＋ `pgvector`（HNSW / IVFFlat・最大 2,000 次元）",
          "ACID トランザクション・SQL JOIN フィルタ・ゾーン冗長 HA",
          "業務マスタ/ACL とベクターを同一 SQL で厳密結合する RAG 検索",
        ],
      },
      {
        feature: "Azure Managed Redis",
        values: [
          "インメモリ KV/Hash/JSON ＋ RediSearch（作成時有効化必須）",
          "サブミリ秒応答・TTL 管理・HNSW/FLAT ベクター検索",
          "LLM セマンティックキャッシュ・チャット状態・セッション/レート制限",
        ],
      },
      {
        feature: "Azure Blob Storage",
        values: [
          "非構造化オブジェクト（PDF / Office / 画像 / 音声）",
          "低コスト大容量・変更フィード・Event Grid イベント発火",
          "RAG 元ドキュメントの原本保管とチャンク化パイプラインの入力層",
        ],
      },
    ],
    decisionRule:
      "グローバル分散・Change Feed・4,096 次元＝Cosmos DB、SQL JOIN と ACID＝PostgreSQL + pgvector、サブミリ秒セマンティックキャッシュ＝Managed Redis。",
  },
  {
    id: "ai200-comp-vector-indexes",
    category: "AI・機械学習",
    title: "ベクター検索インデックス＆セマンティックキャッシュ比較",
    subtitle: "DiskANN・HNSW・IVFFlat・Flat の精度・メモリ・次元数制約",
    columns: ["方式 / インデックス", "採用サービス", "精度・速度・メモリ特性", "主な制約・設計指針"],
    rows: [
      {
        feature: "DiskANN / Sharded DiskANN",
        values: [
          "Azure Cosmos DB for NoSQL",
          "ディスク最適化グラフ ANN により低 RU・低メモリで大規模検索",
          "最大 4,096 次元対応。1,000 件未満はフルスキャン・作成後変更不可",
        ],
      },
      {
        feature: "HNSW",
        values: [
          "PostgreSQL (pgvector) / Managed Redis",
          "高い検索精度（Recall）と高速検索を両立（メモリ・構築時間は大）",
          "pgvector は最大 2,000 次元上限。演算子クラスとクエリ演算子一致必須",
        ],
      },
      {
        feature: "IVFFlat",
        values: [
          "PostgreSQL (pgvector)",
          "構築が高速で省メモリだが精度は `lists` と `probes` 調整依存",
          "最大 2,000 次元上限。十分な初期データ投入後に作成するのが推奨",
        ],
      },
      {
        feature: "Flat（ブルートフォース）",
        values: [
          "Cosmos DB (最大 505 次元) / Redis",
          "厳密 100% 再現率の k-NN 探索（データ量増加に伴い線形に遅延増）",
          "小規模データセットや厳密一致が必要な検証・小テナント向け",
        ],
      },
      {
        feature: "セマンティックキャッシュ構成",
        values: [
          "Azure Managed Redis (RediSearch) + APIM / RedisVL",
          "類似プロンプトをベクター閾値判定で即時返却し推論遅延・コストを削減",
          "テナント/権限/埋め込みモデルバージョンのメタデータフィルタ併用が必須",
        ],
      },
    ],
    decisionRule:
      "pgvector で精度重視＝HNSW、pgvector で構築速度重視＝IVFFlat、Cosmos DB 大規模/高次元＝DiskANN、LLM 応答再利用＝Redis セマンティックキャッシュ。",
  },
  {
    id: "ai200-comp-identity-config",
    category: "ネットワーク・セキュリティ",
    title: "ID 認証・シークレット・構成管理比較",
    subtitle: "マネージド ID・Azure Key Vault・Azure App Configuration の責務分離",
    columns: ["サービス / 機能", "管理対象とライフサイクル", "権限・変更反映の仕組み", "AI ソリューション設計指針"],
    rows: [
      {
        feature: "システム割り当てマネージド ID",
        values: [
          "単一 Azure リソースに 1 対 1 紐付く Entra ID（削除時自動消去）",
          "資格情報ローテーション不要・RBAC で必要最小限ロール付与",
          "単体 ACA / Function / VM から ACR・Key Vault・DB へ接続",
        ],
      },
      {
        feature: "ユーザー割り当てマネージド ID",
        values: [
          "独立リソースとして作成し複数リソースで共有可能",
          "リソース再作成や複数ワーカー構成でも同じ権限を維持",
          "複数 AKS ノード/Pod や複数地域ワーカーで共通権限を再利用",
        ],
      },
      {
        feature: "Azure Key Vault",
        values: [
          "シークレット・暗号鍵・TLS 証明書（ソフト削除 90 日＋消去保護）",
          "Azure RBAC 推奨（`Key Vault Secrets User` 等）・Event Grid 期限通知",
          "外部 LLM API キーや接続文字列の暗号化保管とローテーション",
        ],
      },
      {
        feature: "Azure App Configuration",
        values: [
          "非機密の階層設定（ラベル別）・機能フラグ・Key Vault 参照 URI",
          "センチネルキー監視による動的リフレッシュ・Managed ID 認証",
          "モデル切替フラグ・プロンプト温度パラメータ・機能段階公開管理",
        ],
      },
    ],
    decisionRule:
      "単一リソース専属＝システム MI、複数共有/事前認可＝ユーザー MI、機密値＝Key Vault、非機密設定＋機能フラグ＋KV 参照＝App Configuration。",
  },
  {
    id: "ai200-comp-observability",
    category: "ガバナンス・監視・コスト",
    title: "分散トレーシング＆観測性シグナル比較",
    subtitle: "OpenTelemetry・Application Insights・Log Analytics KQL の使い分け",
    columns: ["ツール / シグナル", "収集データと粒度の特徴", "相関・検索・コスト最適化手法", "トラブルシューティング用途"],
    rows: [
      {
        feature: "OpenTelemetry 分散トレース",
        values: [
          "W3C Trace Context によるサービス跨ぎのスパン親子関係・所要時間",
          "`operation_Id` で HTTP/Service Bus/DB 呼び出しを一気通貫で結合",
          "API→ワーカー→ベクターDB→LLM の遅延ボトルネック特定",
        ],
      },
      {
        feature: "OpenTelemetry メトリクス",
        values: [
          "集約済み数値時系列（要求数・トークン消費・キュー長・CPU）",
          "事前集約により高負荷時も低コスト・高速に推移グラフとアラート評価",
          "KEDA スケール閾値調整・SLO レイテンシ監視",
        ],
      },
      {
        feature: "Log Analytics (KQL クエリ)",
        values: [
          "`requests` / `dependencies` / `exceptions` / `traces` の生ログ",
          "`where` / `summarize percentile(duration, 95)` / `join` で柔軟解析",
          "特定エラーコードの根本原因調査・429 スロットリング頻度分析",
        ],
      },
      {
        feature: "Application Insights Live Metrics",
        values: [
          "1 秒間隔のリアルタイムテレメトリストリーム（ストレージ非課金）",
          "サンプリングバイパスでデプロイ直後の失敗や負荷急増を即時監視",
          "新リビジョン切替やトラフィック分割直後のライブ健全性確認",
        ],
      },
    ],
    decisionRule:
      "跨ぎ遅延特定＝OpenTelemetry トレース、SLO 数値監視＝メトリクス、詳細原因究明＝Log Analytics KQL、切替直後確認＝Live Metrics。",
  },
];

export const ai200Patterns: AzureArchitecturePattern[] = [
  {
    id: "ai200-pat-1",
    title: "KEDA イベント駆動 ACA ワーカー＆ACR 閉域ビルド構成",
    badge: "Container Apps & KEDA",
    flow: [
      "ソースコード (Git / Azure CLI)",
      "ACR Tasks (クラウドビルド & 署名)",
      "Azure Container Apps (システム MI で AcrPull)",
      "KEDA スケーラー (Service Bus キュー長・0〜N 自動伸縮)",
    ],
    summary:
      "ローカル Docker を使わず ACR Tasks で安全にビルドしたイメージを、管理者パスワードレス（AcrPull）で ACA へ展開し、Service Bus キュー長に応じたゼロスケールと自動水平拡張を実現するパターン。",
    keyDesignPoints: [
      "ACR の管理者アカウントは無効化し、ACA 側のマネージド ID に `AcrPull` ロールを付与してプルする",
      "待機コスト削減のため `minReplicas: 0` を設定し、Service Bus のメッセージ滞留数閾値で即座にスケールアウトする",
    ],
  },
  {
    id: "ai200-pat-2",
    title: "Azure Managed Redis セマンティックキャッシュ付き RAG API 構成",
    badge: "Semantic Cache & RAG",
    flow: [
      "クライアントプロンプト (API 入力)",
      "Container Apps / APIM (埋め込みベクトル生成)",
      "Azure Managed Redis (RediSearch HNSW 類似度検索)",
      "Cosmos DB DiskANN / LLM 推論 (ミス時のみ実行)",
    ],
    summary:
      "類似した過去質問への応答を Azure Managed Redis（RediSearch モジュール作成時有効）のベクターインデックスで高速判定し、キャッシュヒット時は高コストなベクター DB 検索と LLM 推論をバイパスする構成。",
    keyDesignPoints: [
      "マルチテナント分離のため、キャッシュエントリのメタデータに `tenantId` と埋め込みモデルバージョンを保持しハイブリッドフィルタする",
      "APIM を前段に置く場合は `<llm-semantic-cache-lookup>` / `<llm-semantic-cache-store>` ポリシーでアプリ無改修キャッシュも可能",
    ],
  },
  {
    id: "ai200-pat-3",
    title: "Change Feed & Event Grid による RAG 増分ベクトル索引パイプライン",
    badge: "Incremental Indexing",
    flow: [
      "ドキュメント更新 (Blob Storage / Cosmos DB)",
      "Event Grid / Change Feed プロセッサ",
      "Azure Functions (Flex Consumption・チャンク化 & 埋め込み)",
      "PostgreSQL pgvector (HNSW インデックスへべき等 Upsert)",
    ],
    summary:
      "ドキュメントやソースレコードの作成・変更・削除イベントのみを非同期処理し、オーバーラップ付きチャンク分割とベクトル化を経て PostgreSQL pgvector（または Cosmos DB DiskANN）へべき等に反映するパターン。",
    keyDesignPoints: [
      "決定的なチャンク ID とアクセス制御メタデータを付与して Upsert し、元ファイル削除イベント受信時は古いチャンクを確実削除する",
      "Flex Consumption の `Microsoft.App/environments` 委任 VNet 統合により、プライベートエンドポイント配下の DB へ安全に書き込む",
    ],
  },
  {
    id: "ai200-pat-4",
    title: "Durable Functions による長時間マルチステップ AI オーケストレーション",
    badge: "Durable Orchestration",
    flow: [
      "HTTP Starter Function (202 Accepted + ステータス URI 返却)",
      "Orchestrator Function (Fan-out / Fan-in 並列実行制御)",
      "Activity Functions (分割文書解析・推論呼び出し)",
      "Service Bus / Cosmos DB (結果永続化 & 完了通知)",
    ],
    summary:
      "Azure Load Balancer の HTTP 230 秒アイドル制限を回避するため非同期 HTTP API パターンを採用し、大量チャンクの並列分析（Fan-out / Fan-in）と完了後の集約・外部通知を信頼性高く制御する構成。",
    keyDesignPoints: [
      "Orchestrator 関数コードはリプレイ機構で再実行されるため決定的に記述し、外部 I/O や時刻取得はすべて Activity 関数または専用 API へ委譲する",
      "外部承認や人間によるレビューを挟むワークフローは `WaitForExternalEvent` で無課金待機させる",
    ],
  },
  {
    id: "ai200-pat-5",
    title: "AKS Workload ID & Key Vault / App Configuration ゼロトラスト構成",
    badge: "AKS & Zero Trust",
    flow: [
      "AKS Pod (ServiceAccount + OIDC トークン)",
      "Microsoft Entra Workload ID (DefaultAzureCredential)",
      "Azure App Configuration (構成値・機能フラグ + KV 参照)",
      "Azure Key Vault (RBAC + ソフト削除 / 消去保護)",
    ],
    summary:
      "AKS Pod 単位に Microsoft Entra Workload ID を割り当て、静的シークレットやクラスター全体の過剰権限を排除しつつ、App Configuration 経由で機能フラグと Key Vault 機密を統一管理する構成。",
    keyDesignPoints: [
      "Pod の Startup / Readiness / Liveness Probe を役割分離し、初期化待ちと外部依存遮断による誤再起動ループを防ぐ",
      "App Configuration にセンチネルキーを設定し、プロンプト設定や機能フラグ更新を再起動なしで動的反映する",
    ],
  },
  {
    id: "ai200-pat-6",
    title: "OpenTelemetry 分散トレーシング＆KQL レイテンシ診断構成",
    badge: "OpenTelemetry & KQL",
    flow: [
      "分散 AI API / ワーカー (OpenTelemetry SDK 計装)",
      "W3C Trace Context 伝播 (HTTP / Service Bus ヘッダー)",
      "Application Insights (エンドツーエンド依存関係相関)",
      "Log Analytics ワークスペース (KQL P95 レイテンシ・例外解析)",
    ],
    summary:
      "フロントエンド API から非同期 Service Bus・Functions・ベクター DB・LLM 呼び出しまでを単一の分散トレースとして関連付け、KQL クエリで遅延工程と失敗原因を即座に特定する観測性パターン。",
    keyDesignPoints: [
      "Service Bus 送信時にメッセージプロパティへトレースコンテキストを埋め込み、コンシューマー側で親スパンとして復元する",
      "サンプリング率の適正化と Live Metrics 併用により、コストを抑えつつデプロイ直後の障害を即検知する",
    ],
  },
];

export const ai200Pitfalls: AzurePitfall[] = [
  {
    id: "ai200-pit-1",
    trap: "AKS の Liveness Probe に外部 DB や外部 AI API への疎通チェックを含めたり、モデル読込時間が長いのに Startup Probe を省略する",
    whyWrong:
      "Liveness Probe の失敗は即座にコンテナの強制再起動を引き起こすため、起動中のモデル読込や外部 DB の一時遅延で全 Pod が再起動ループ（CrashLoopBackOff）に陥り障害が拡大します。",
    correctApproach:
      "起動時の初期化待ちは Startup Probe、外部依存の一時断に対するトラフィック切り離しは Readiness Probe、プロセス内部のデッドロック検知のみを Liveness Probe へ分離する。",
  },
  {
    id: "ai200-pit-2",
    trap: "Azure Managed Redis インスタンス作成後に RediSearch を追加しようとする／セマンティックキャッシュにテナント条件を付けずに検索する",
    whyWrong:
      "RediSearch モジュールはインスタンス作成時にのみ有効化でき、後から追加できません。また全ユーザーのキャッシュを同一空間で類似検索すると別テナントの機密応答が返るリスクがあります。",
    correctApproach:
      "インスタンス新規作成時に必ず RediSearch モジュールを有効化し、検索クエリには類似度閾値に加えて `tenantId`・権限・埋め込みモデルバージョンのメタデータフィルタを必須化する。",
  },
  {
    id: "ai200-pit-3",
    trap: "Cosmos DB コンテナー作成後に DiskANN ベクターポリシーを変更できると思う／pgvector で 3,072 次元ベクトルへそのまま HNSW インデックスを貼ろうとする",
    whyWrong:
      "Cosmos DB のコンテナーベクターポリシーとベクターインデックス定義は作成後変更不可（イミュータブル）であり、DiskANN は 1,000 ベクトル未満ではフルスキャンになります。また `pgvector` の HNSW / IVFFlat インデックス上限は 2,000 次元です。",
    correctApproach:
      "Cosmos DB は作成時に次元数（最大 4,096）・距離関数・DiskANN 設定を確定（変更時は新コンテナーへ移行）し、`pgvector` で 2,000 次元を超えるモデルは次元削減後にインデックスを構築する。",
  },
  {
    id: "ai200-pit-4",
    trap: "Azure Functions の `host.json` で `functionTimeout` を延ばせば、HTTP トリガーでも 5 分以上の同期 AI 推論レスポンスを返せると思う",
    whyWrong:
      "Flex Consumption 等で関数自体の実行タイムアウトを延長できても、HTTP トリガーの同期応答は前段の Azure Load Balancer アイドルタイムアウトにより 230 秒で必ず切断されます。",
    correctApproach:
      "230 秒を超える可能性がある HTTP 起点の AI 処理は、Durable Functions の非同期 HTTP API パターン（`202 Accepted`＋ステータス照会 URL）または Service Bus 経由の非同期ワーカーへ切り出す。",
  },
  {
    id: "ai200-pit-5",
    trap: "Azure Service Bus の `PeekLock` 処理で 5 分を超える AI 解析を実行し、ロック自動更新なし・ジョブ切り出しなしで重複実行や DLQ 落ちを起こす",
    whyWrong:
      "`PeekLock` の最大ロック期間は 5 分（既定 60 秒）が上限であり、処理完了前に期限切れになると別ワーカーへ再配信され、規定回数超過でデッドレターキューへ送られます。",
    correctApproach:
      "SDK の自動ロック更新（Auto-lock renewal）を構成するか、メッセージ受領後すぐにジョブ状態を外部永続化して `Complete` し、長時間処理は Durable Functions 等へ委譲する。",
  },
  {
    id: "ai200-pit-6",
    trap: "Azure App Configuration の値をポータルで変更すれば、実行中のアプリが再起動なし・SDK 構成なしで自動更新されると思う",
    whyWrong:
      "App Configuration SDK の既定構成では起動時ロードのみとなり、センチネルキーやリフレッシュ間隔を設定しない限りメモリ内の構成値や機能フラグは更新されません。",
    correctApproach:
      "更新トリガー専用のセンチネルキーを監視登録してリフレッシュミドルウェア（キャッシュ有効期限＋再読込）を実装し、シークレット本体は Key Vault 参照とローテーションイベントで管理する。",
  },
];

export const ai200KeyFacts: AzureKeyFact[] = [
  {
    id: "ai200-kf-1",
    target: "Cosmos DB DiskANN 仕様",
    value: "最大 4,096 次元 / 1,000 件〜",
    detail: "Flat は 505 次元上限。1,000 ベクトル未満はフルスキャンとなりポリシーは作成後変更不可",
  },
  {
    id: "ai200-kf-2",
    target: "pgvector インデックス次元上限",
    value: "最大 2,000 次元",
    detail: "Azure DB for PostgreSQL の HNSW / IVFFlat インデックス構築上限。超過時は次元削減が必要",
  },
  {
    id: "ai200-kf-3",
    target: "Service Bus 最大メッセージサイズ",
    value: "Standard 256 KB / Premium 100 MB",
    detail: "Premium 層の 100 MB は AMQP 単一メッセージのみ対応（HTTP およびバッチは 1 MB 上限）",
  },
  {
    id: "ai200-kf-4",
    target: "Service Bus PeekLock 期間",
    value: "既定 60 秒 / 最大 5 分",
    detail: "長時間タスクには SDK の自動ロック更新（Auto-lock renewal）設定が必須",
  },
  {
    id: "ai200-kf-5",
    target: "Event Grid 既定再試行上限",
    value: "最大 24 時間 または 30 回",
    detail: "10 秒〜12 時間の指数バックオフ再試行。到達後は設定時 Storage Blob へデッドレタリング",
  },
  {
    id: "ai200-kf-6",
    target: "Functions HTTP 応答タイムアウト",
    value: "最大 230 秒（固定上限）",
    detail: "Flex Consumption で非 HTTP の functionTimeout は無制限設定可能だが HTTP は LB 上限で 230 秒",
  },
  {
    id: "ai200-kf-7",
    target: "Functions Flex VNet 委任",
    value: "Microsoft.App/environments",
    detail: "Flex Consumption プランの VNet 統合用サブネットに必須となるリソースプロバイダー委任先",
  },
  {
    id: "ai200-kf-8",
    target: "Key Vault ソフト削除保持期間",
    value: "既定 90 日（7〜90 日設定可）",
    detail: "ソフト削除は全コンテナー必須有効。完全抹消防止には消去保護（Purge Protection）を併用",
  },
  {
    id: "ai200-kf-9",
    target: "Container Apps リビジョン伸縮",
    value: "KEDA で 0〜N 台自動スケール",
    detail: "Multiple モードで重み合計 100% のトラフィック分割・ラベル指定、minReplicas: 0 に対応",
  },
  {
    id: "ai200-kf-10",
    target: "Managed Redis RediSearch",
    value: "インスタンス作成時のみ有効化可",
    detail: "ベクター検索・セマンティックキャッシュ用モジュールはプロビジョニング後からの追加不可",
  },
];

export const ai200QuickLookup: CertFlashcardItem[] = [
  {
    keyword: "ローカル Docker デーモン不要で ACR 上に Dockerfile を送り自動ビルドする機能",
    category: "コンテナ・ACR",
    recommended: "ACR Tasks（az acr build）",
    reason: "クラウド側でイメージビルド・プッシュ・ベースイメージ更新トリガー実行を自動化できます。",
  },
  {
    keyword: "Kubernetes 管理なしで KEDA イベント伸縮とゼロスケールを実現するコンテナ基盤",
    category: "コンテナ・ACR",
    recommended: "Azure Container Apps (ACA)",
    reason: "コントロールプレーン管理不要で HTTP・Service Bus 等に応じた 0〜N 台伸縮に対応します。",
  },
  {
    keyword: "ACA で新旧バージョンに 80% / 20% の割合を指定してカナリアリリースする仕組み",
    category: "コンテナ・ACR",
    recommended: "Multiple リビジョンモード（トラフィック分割）",
    reason: "アクティブな複数リビジョン間で合計 100% の重み付けルーティングやラベル指定が可能です。",
  },
  {
    keyword: "ACA でアプリコードを変更せず状態管理や Pub/Sub を提供するサイドカーランタイム",
    category: "コンテナ・ACR",
    recommended: "Dapr（Distributed Application Runtime）",
    reason: "Service Bus や Redis 等のバックエンド差異を標準 HTTP/gRPC API で抽象化します。",
  },
  {
    keyword: "AKS で AI モデル読込など起動が重いコンテナの Liveness 誤再起動を防ぐプローブ",
    category: "コンテナ・ACR",
    recommended: "Startup Probe",
    reason: "Startup Probe が成功するまで Liveness / Readiness Probe の実行を待機させることができます。",
  },
  {
    keyword: "AKS で一時的な下流障害時にコンテナを再起動せず Service 宛先から除外するプローブ",
    category: "コンテナ・ACR",
    recommended: "Readiness Probe",
    reason: "失敗時は Pod を再起動せずトラフィック転送（Endpoints）からのみ切り離します。",
  },
  {
    keyword: "AKS の Pod ごとに静的シークレットなしで最小権限の Entra ID 認証を与える仕組み",
    category: "コンテナ・ACR",
    recommended: "Microsoft Entra Workload ID",
    reason: "OIDC Issuer と ServiceAccount のフェデレーション資格情報により Pod 単位で安全に認証します。",
  },
  {
    keyword: "Cosmos DB NoSQL で最大 4,096 次元の大規模近似最近傍（ANN）検索を担うインデックス",
    category: "AI データ・ベクター検索",
    recommended: "DiskANN / Sharded DiskANN",
    reason: "低メモリ・低 RU で高精度なベクトル検索を実行でき、Sharded でテナント分離も可能です。",
  },
  {
    keyword: "Cosmos DB の新規追加・更新を順序捕捉し RAG 埋め込みパイプラインを自動起動する機能",
    category: "AI データ・ベクター検索",
    recommended: "Azure Cosmos DB Change Feed",
    reason: "Change Feed Processor や Azure Functions トリガーで変更分だけを非同期処理できます。",
  },
  {
    keyword: "PostgreSQL pgvector でビルド時間より検索精度（Recall）とクエリ速度を優先するインデックス",
    category: "AI データ・ベクター検索",
    recommended: "HNSW インデックス",
    reason: "多層グラフ構造により IVFFlat より高い再現率と低レイテンシ検索を提供します（上限 2,000 次元）。",
  },
  {
    keyword: "PostgreSQL pgvector でメモリ消費とインデックス構築時間を抑えたい場合に選ぶ方式",
    category: "AI データ・ベクター検索",
    recommended: "IVFFlat インデックス",
    reason: "リスト分割により構築負荷が軽く、`ivfflat.probes` 調整で速度と精度のバランスを取れます。",
  },
  {
    keyword: "類似する過去プロンプトへの LLM 応答をベクトル類似検索で再利用し遅延と費用を削減",
    category: "AI データ・ベクター検索",
    recommended: "セマンティックキャッシュ（Azure Managed Redis + RediSearch）",
    reason: "作成時有効の RediSearch HNSW/FLAT とテナントフィルタを組み合わせ、キャッシュヒット時は LLM を呼び出しません。",
  },
  {
    keyword: "Service Bus で会話スレッドや顧客単位に厳密な FIFO 順序処理を実現する機能",
    category: "メッセージング・サーバーレス",
    recommended: "メッセージセッション（Sessions）",
    reason: "同一の `SessionId` を持つメッセージ群を単一コンシューマーへ順番にロック配信します。",
  },
  {
    keyword: "Service Bus で再配信回数超過や不正メッセージを一時退避・監査する専用サブキュー",
    category: "メッセージング・サーバーレス",
    recommended: "デッドレターキュー（DLQ）",
    reason: "毒メッセージによる無限ループを防ぎ、後から `DeadLetterReason` を確認して再処理できます。",
  },
  {
    keyword: "Event Grid で最大 24 時間 / 30 回の再試行後も失敗したイベントを保存する仕組み",
    category: "メッセージング・サーバーレス",
    recommended: "デッドレタリング（Storage Blob 宛先）",
    reason: "構成しておかないと再試行上限到達後にイベントが破棄されるため、本番では Blob 保存を有効化します。",
  },
  {
    keyword: "Event Grid でマルチクラウド間の相互運用性が高い標準 JSON イベント形式",
    category: "メッセージング・サーバーレス",
    recommended: "CloudEvents v1.0 スキーマ",
    reason: "CNCF 準拠の標準ヘッダー・構造でカスタムトピックや Namespace トピックのイベントを送受信できます。",
  },
  {
    keyword: "従量課金ながら Always Ready 待機と VNet 統合（Microsoft.App/environments 委任）に対応",
    category: "メッセージング・サーバーレス",
    recommended: "Azure Functions Flex Consumption プラン",
    reason: "旧 Consumption の VNet 非対応とコールドスタート課題を解消し、高効率なサーバーレス統合を実現します。",
  },
  {
    keyword: "Azure Functions で 230 秒超の非同期 HTTP API や並列 Fan-out/Fan-in を組む拡張",
    category: "メッセージング・サーバーレス",
    recommended: "Durable Functions",
    reason: "`202 Accepted` のステータスポーリングや永続チェックポイントによるステートフルなオーケストレーションを提供します。",
  },
  {
    keyword: "コード再デプロイなしに機能のオン/オフや段階公開を切り替えるマネージド構成サービス",
    category: "セキュリティ・構成",
    recommended: "Azure App Configuration（Feature Flags）",
    reason: "環境ラベル別の構成値管理・Key Vault 参照の統一窓口・機能フラグ評価を提供します。",
  },
  {
    keyword: "App Configuration 更新時にアプリ側の全構成キャッシュを一括再読込させる監視キー",
    category: "セキュリティ・構成",
    recommended: "センチネルキー（Sentinel key）",
    reason: "設定変更の最後にセンチネルキーを更新することで、中間状態を読まずにアトミックに再読み込みできます。",
  },
  {
    keyword: "ローカル開発と Azure 本番でコード変更なしに資格情報チェーンを自動解決する認証クラス",
    category: "セキュリティ・構成",
    recommended: "DefaultAzureCredential（Azure Identity SDK）",
    reason: "開発端末の CLI/IDE 資格情報から本番のマネージド ID トークン取得まで単一インターフェースで統一します。",
  },
  {
    keyword: "Key Vault の誤削除猶予（90 日）に加え、削除済みアイテムの強制抹消自体を阻止する設定",
    category: "セキュリティ・構成",
    recommended: "ソフト削除（Soft Delete）＋ 消去保護（Purge Protection）",
    reason: "内部不正や誤操作によって保持期間中にシークレット・暗号鍵が完全消去されるリスクを遮断します。",
  },
  {
    keyword: "Azure サービス間の分散トレース・メトリクス・ログを標準形式で計装するフレームワーク",
    category: "監視・トラブルシューティング",
    recommended: "OpenTelemetry SDK（Azure Monitor Distro）",
    reason: "W3C Trace Context を伝播させ Application Insights で一気通貫の依存関係・遅延解析を実現します。",
  },
  {
    keyword: "Log Analytics 上の `requests` や `dependencies` から P95 遅延やエラーを抽出する言語",
    category: "監視・トラブルシューティング",
    recommended: "KQL（Kusto Query Language）",
    reason: "`where`・`summarize percentile(duration, 95) by bin(...)`・`join` 等で迅速に障害解析できます。",
  },
];

export const ai200PracticeQuestions: CertQuestion[] = [
  {
    id: "ai200-q1",
    domainId: "ai200-domain-1",
    domainLabel: "01: コンテナー化ソリューション",
    difficulty: "標準",
    selectCount: 1,
    question:
      "AI 推論ワーカーを含む複数のマイクロサービスをコンテナーとして運用する基盤を選定しています。要件は「Kubernetes コントロールプレーンやノードパッチの運用負荷を排すること」「Azure Service Bus のキュー長に応じて 0〜20 レプリカへ自動スケールすること」「Dapr によるサービス間呼び出し抽象化を利用できること」です。最適なホスティングサービスはどれですか？",
    options: [
      "Azure Container Instances (ACI)",
      "Azure Container Apps (ACA)",
      "Azure Kubernetes Service (AKS) のマニュアルノードプール",
      "Azure Virtual Machines 上の Docker Compose",
    ],
    correctIndices: [1],
    explanation:
      "Azure Container Apps (ACA) はフルマネージドなサーバーレスコンテナ環境であり、Kubernetes 管理不要で内蔵 KEDA（Service Bus 等でのゼロスケール対応）と Dapr サイドカー統合をネイティブ提供します。",
    keywords: ["Azure Container Apps", "KEDA", "Dapr", "ゼロスケール"],
  },
  {
    id: "ai200-q2",
    domainId: "ai200-domain-1",
    domainLabel: "01: コンテナー化ソリューション",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Azure Container Registry (ACR) を利用した CI/CD およびランタイム実行基盤のセキュリティ強化を検討しています。「ビルド端末にローカル Docker デーモンをインストールせずにクラウド上でイメージをビルドすること」と「AKS や ACA から ACR へのプル時に管理者ユーザーや静的パスワードを使わずに認証すること」を満たす正しい組み合わせはどれですか？",
    options: [
      "ローカル Docker でビルドして FTP アップロードし、ACR の管理者アカウント（admin user）のパスワードを平文で環境変数に渡す",
      "ACR Geo-replication だけを有効化し、匿名プル（Anonymous pull）を本番レジストリで許可する",
      "ACR Tasks（`az acr build`）でイメージをビルドし、実行基盤のマネージド ID に `AcrPull` RBAC ロールを割り当てる",
      "Azure Storage Account に tar ファイルを保存し、コンテナ起動時に毎回手動インポートする",
    ],
    correctIndices: [2],
    explanation:
      "ACR Tasks を用いるとクラウド上でコンテナイメージを自動ビルドでき、実行側（ACA / AKS）のマネージド ID に `AcrPull` ロールを付与することでパスワードレスの安全なイメージプルが実現します。",
    keywords: ["ACR Tasks", "AcrPull", "マネージド ID"],
  },
  {
    id: "ai200-q3",
    domainId: "ai200-domain-1",
    domainLabel: "01: コンテナー化ソリューション",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Azure Container Apps (ACA) で本番運用中の AI API に対し、新バージョンのリビジョンへトラフィックの 20% だけを割り当ててカナリア検証を行い、さらに外部 API キーをアプリレベルのシークレットとして定義し、コンテナ内の `/mnt/secrets` へファイルとしてマウントしたいと考えています。正しい設計・運用手順を 2 つ選択してください。",
    options: [
      "リビジョンモードを「Multiple（複数）」に設定し、旧リビジョン 80%・新リビジョン 20% の合計 100% でトラフィック重みを構成する",
      "Single リビジョンモードのままにすれば、自動的に複数リビジョン間で 50% ずつトラフィックが分割される",
      "`secrets` で定義した機密を `volumes`（`storageType: Secret`）経由で `volumeMounts` に割り当て、シークレット値変更時は新リビジョン作成またはリビジョン再起動を行う",
      "ACA のアプリレベルシークレットを編集すると、稼働中の古いコンテナ内ファイルへ即時・無再起動で上書き反映される",
    ],
    correctIndices: [0, 2],
    explanation:
      "トラフィック分割には Multiple リビジョンモードが必要です。また `storageType: Secret` でシークレットをボリュームマウントできますが、シークレット値を後から変更・削除した場合はリビジョン再起動（または新リビジョン展開）を行わないと稼働中インスタンスに反映されません。",
    keywords: ["ACA リビジョン", "トラフィック分割", "シークレットボリューム"],
  },
  {
    id: "ai200-q4",
    domainId: "ai200-domain-1",
    domainLabel: "01: コンテナー化ソリューション",
    difficulty: "応用",
    selectCount: 1,
    question:
      "Azure Kubernetes Service (AKS) 上に大容量の埋め込みモデルをメモリへ読み込む推論 Pod を展開したところ、初期化に約 90 秒かかるため「起動完了前に Liveness Probe が失敗し続けて `CrashLoopBackOff` になる」問題と「外部ベクター DB が一時的に接続断になっただけで Pod ごと再起動されてしまう」問題が発生しています。プローブ構成の正しい改善策はどれですか？",
    options: [
      "3 つのプローブすべてを無効化し、外部 DB 障害時も Service からリクエストを送り続ける",
      "初期化完了まで Liveness / Readiness 判定を待機させる `Startup Probe` を設定し、外部 DB 疎通確認はトラフィック遮断のみを行う `Readiness Probe` に分離し、`Liveness Probe` はプロセス自身の生存確認のみに限定する",
      "Liveness Probe の検査対象に外部 DB と外部 LLM API の両方を追加し、`periodSeconds: 1` に短縮する",
      "Readiness Probe だけを削除し、Startup Probe が失敗したらトラフィックを強制転送する",
    ],
    correctIndices: [1],
    explanation:
      "Startup Probe は重い起動処理を保護し、Readiness Probe は依存先障害時に Pod を殺さずトラフィックだけ外す役割を持ちます。Liveness Probe に外部依存を含めると連鎖再起動を引き起こします。",
    keywords: ["Startup Probe", "Readiness Probe", "Liveness Probe", "AKS"],
  },
  {
    id: "ai200-q5",
    domainId: "ai200-domain-1",
    domainLabel: "01: コンテナー化ソリューション",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "AKS クラスター内の複数のマイクロサービス Pod から Azure Key Vault や Azure Cosmos DB へアクセスします。クラスターノード全体の VM マネージド ID を全 Pod で共有して過剰権限になることを避け、静的クライアントシークレットも持たせずに Pod（Kubernetes ServiceAccount）単位で最小権限の Entra ID 認証を行いたい場合、採用すべき機能はどれですか？",
    options: [
      "Azure Bastion とノードへの直接 SSH ログイン",
      "サービスプリンシパルのシークレット文字列を ConfigMap に平文保存する方式",
      "ノードプールの VMSS システム割り当てマネージド ID への `Owner` ロール付与",
      "Microsoft Entra Workload ID（OIDC Issuer とフェデレーション ID 資格情報）",
    ],
    correctIndices: [3],
    explanation:
      "Microsoft Entra Workload ID は AKS の OIDC Issuer と Kubernetes ServiceAccount トークンを連携させ、Pod 単位で資格情報レスかつ最小権限の認証を実現する現在の推奨方式です。",
    keywords: ["Microsoft Entra Workload ID", "AKS", "OIDC", "最小権限"],
  },
  {
    id: "ai200-q6",
    domainId: "ai200-domain-2",
    domainLabel: "02: AI データ管理サービス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Azure Cosmos DB for NoSQL を用いてマルチテナント向け AI チャット履歴およびドキュメントチャンクを格納するコンテナーを設計しています。特定のテナントや特定日付に書き込み・読み取りが集中して 429 スロットリング（ホットパーティション）が発生したり、単一論理パーティションの上限 20 GB に達したりする事態を防ぐための最適なパーティションキー設計はどれですか？",
    options: [
      "カーディナリティが高くワークロードが均等に分散する階層型パーティションキー（例：`/tenantId`, `/sessionId`）を選定する",
      "すべてのドキュメントで値がほぼ同じになる `/status`（例：`\"active\"`）をパーティションキーにする",
      "日付単位の単調増加キー `/createdDate`（`YYYY-MM-DD`）を選び、当日の書き込みを 1 パーティションへ集中させる",
      "パーティションキーを設定せず、単一物理パーティション固定のまま RU だけを 100 万に引き上げる",
    ],
    correctIndices: [0],
    explanation:
      "Cosmos DB では高カーディナリティなキーや階層型パーティションキー（最大 3 階層）を用いることで、20 GB 論理パーティション上限の回避と全物理パーティションへの均一な RU 分散を実現します。",
    keywords: ["Cosmos DB", "階層型パーティションキー", "ホットパーティション", "429"],
  },
  {
    id: "ai200-q7",
    domainId: "ai200-domain-2",
    domainLabel: "02: AI データ管理サービス",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Azure Cosmos DB for NoSQL のベクター検索および DiskANN インデックスを RAG 用ナレッジベースに採用する際、設計・実装上の制約や機能として正しいものを 2 つ選択してください。",
    options: [
      "`DiskANN` インデックスは 10 件のテストデータを入れた段階から直ちにフルグラフ検索が動作し、既存コンテナーのインデックスポリシー編集だけで後付けできる",
      "`DiskANN` インデックスは最大 4,096 次元（`flat` は 505 次元上限）の高速な近似最近傍検索をサポートし、マルチテナント分離には `vectorIndexShardKey` による Sharded DiskANN を利用できる",
      "DiskANN は 505 次元までしか対応せず、それ以上はすべて自動切り捨てされる",
      "コンテナーのベクターポリシー（Vector Policy）およびベクターインデックス定義はコンテナー作成時に確定する必要があり、後から変更する場合は新規コンテナーの作成とデータ移行が必要になる",
    ],
    correctIndices: [1, 3],
    explanation:
      "Cosmos DB の DiskANN は最大 4,096 次元に対応し Sharded DiskANN でテナント単位の検索効率化が可能です。ただしベクターポリシーとインデックス定義は作成後イミュータブルであり、また 1,000 ベクトル未満の間はフルスキャンとして処理されます。",
    keywords: ["Cosmos DB", "DiskANN", "Sharded DiskANN", "イミュータブル"],
  },
  {
    id: "ai200-q8",
    domainId: "ai200-domain-2",
    domainLabel: "02: AI データ管理サービス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Azure Database for PostgreSQL Flexible Server 上で `pgvector` 拡張機能を使い、社内業務マスタ（SQL テーブル）と JOIN しながら高速なベクター検索を行う設計をしています。埋め込みモデルのベクトル次元数が 3,072 次元の場合、`CREATE INDEX ... USING hnsw` を実行するとどのような制約に直面し、どう対処すべきですか？",
    options: [
      "PostgreSQL の `pgvector` は 128 次元までしか保存すらできないため、利用自体を諦める",
      "`IVFFlat` に変えれば 100,000 次元まで無制限にインデックスを貼れるので、そのまま実行する",
      "`pgvector` の HNSW および IVFFlat インデックス構築上限は最大 2,000 次元であるため、モデル出力を 2,000 次元以下へ次元削減（縮小）してからインデックスを構築する",
      "カラム型を `TEXT` に変更すれば HNSW インデックスが自動で効く",
    ],
    correctIndices: [2],
    explanation:
      "`pgvector` は 2,000 次元を超えるベクトルを列自体へ格納することは可能ですが、HNSW および IVFFlat インデックスの作成上限が 2,000 次元となっているため、インデックス高速化を行うには 2,000 次元以下への次元削減（または低次元出力設定）が必要です。",
    keywords: ["PostgreSQL", "pgvector", "HNSW", "IVFFlat", "2000次元"],
  },
  {
    id: "ai200-q9",
    domainId: "ai200-domain-2",
    domainLabel: "02: AI データ管理サービス",
    difficulty: "応用",
    selectCount: 2,
    question:
      "LLM 推論の応答レイテンシとトークンコストを削減するため、Azure Managed Redis を用いた「セマンティックキャッシュ」を構築します。運用要件とプラットフォーム制約に照らして正しい設計判断を 2 つ選択してください。",
    options: [
      "ベクターインデックス機能に必要な `RediSearch` モジュールはインスタンス作成後には追加できないため、Azure Managed Redis 新規プロビジョニング時に有効化する",
      "通常の文字列キーキャッシュのままインスタンスを作成し、運用開始 1 ヶ月後にポータルから RediSearch モジュールをオンにする",
      "異なる埋め込みモデル同士のベクトルを同一インデックスに混在させても、コサイン類似度はそのまま正しく比較できる",
      "類似度検索時にはベクトル距離の閾値判定だけでなく、テナント ID・アクセス権限・埋め込みモデルバージョン等のメタデータフィルタを併用して他者情報の誤返却を防ぐ",
    ],
    correctIndices: [0, 3],
    explanation:
      "Azure Managed Redis の RediSearch モジュールはインスタンス作成時のみ有効化可能です。またセマンティックキャッシュでは、異なる権限・テナントや異なる埋め込みモデル間の誤ヒットを防ぐためメタデータフィルタが必須となります。",
    keywords: ["Azure Managed Redis", "RediSearch", "セマンティックキャッシュ"],
  },
  {
    id: "ai200-q10",
    domainId: "ai200-domain-2",
    domainLabel: "02: AI データ管理サービス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "グローバルユーザーが利用する AI アシスタントの「同一セッション内の直前ターンの会話履歴を、直後のターンで必ず読み取れる（Read-Your-Writes）こと」を保証しつつ、書き込み時の不要なリージョン間同期遅延や高い RU 消費は抑えたい場合、Azure Cosmos DB で選定すべき整合性レベルはどれですか？",
    options: [
      "Strong（強整合性）",
      "Session（セッション：既定値）",
      "Eventual（結果整合性）",
      "Consistent Prefix（一貫性プレフィックス）",
    ],
    correctIndices: [1],
    explanation:
      "Cosmos DB の既定整合性である Session 整合性は、同一セッショントークンを持つクライアントに対して自分の書き込みを即座に読み取れることを保証しつつ、Strong より低レイテンシかつ低 RU コストで動作します。",
    keywords: ["Cosmos DB", "Session 整合性", "Read-Your-Writes"],
  },
  {
    id: "ai200-q11",
    domainId: "ai200-domain-2",
    domainLabel: "02: AI データ管理サービス",
    difficulty: "応用",
    selectCount: 1,
    question:
      "Azure Blob Storage に格納された数万件の PDF マニュアルについて、一部のファイルが更新または削除された際に全量再構築を行わず、該当ファイルのチャンクだけを追従更新・削除する RAG データ取り込みパイプラインを実装したいです。最も適切かつ信頼性の高い設計はどれですか？",
    options: [
      "Blob 作成/更新/削除の Event Grid イベント（または Service Bus 経由）をトリガーに Azure Functions を起動し、決定的なチャンク ID でべき等 Upsert しつつ削除イベント時は対象ドキュメントの既存チャンクを削除する",
      "毎分タイマーで全数万件の PDF をダウンロードして全ベクターテーブルを `TRUNCATE` し全件再埋め込みする",
      "ファイルを Blob へアップロードした後、運用者が手動で SQL の DELETE 文と Python スクリプトを実行する",
      "PDF バイナリをそのまま暗号化せずにクライアント側 JavaScript で毎回パースして LLM に全送する",
    ],
    correctIndices: [0],
    explanation:
      "Event Grid の Blob イベントと決定的なチャンク ID（例：`docId_chunkIndex`）によるべき等更新・削除処理を組み合わせることで、大規模コーパスでも低コストかつ鮮度の高い RAG インデックスを維持できます。",
    keywords: ["RAG パイプライン", "Event Grid", "べき等", "チャンク化"],
  },
  {
    id: "ai200-q12",
    domainId: "ai200-domain-3",
    domainLabel: "03: Azure サービス接続・統合",
    difficulty: "標準",
    selectCount: 1,
    question:
      "AI 文書処理パイプラインにおいて、受信した 1 つのジョブメッセージを「請求書処理ワーカー」「監査アーカイブワーカー」「不正検知ワーカー」の 3 つの異なる独立サービスへ同時配信し、各サービスがメッセージ属性（例：`docType = 'invoice'`）に応じて必要なメッセージだけを処理し、処理不能な毒メッセージは DLQ へ隔離したいです。最適なサービスはどれですか？",
    options: [
      "Azure Queue Storage の単一キュー",
      "Azure Event Hubs の単一コンシューマーグループ",
      "Azure Service Bus のトピック（Topic）とサブスクリプション（SQL / 相関フィルター＋DLQ 付き）",
      "Azure DNS の CNAME レコード",
    ],
    correctIndices: [2],
    explanation:
      "1 対多の Pub-Sub 配信に加え、サブスクリプション側の属性フィルタリング・確実な処理保証・デッドレターキュー（DLQ）を備えるのは Azure Service Bus のトピック＆サブスクリプションです。",
    keywords: ["Azure Service Bus", "Topic", "Subscription", "DLQ"],
  },
  {
    id: "ai200-q13",
    domainId: "ai200-domain-3",
    domainLabel: "03: Azure サービス接続・統合",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Azure Service Bus を使った重い AI 解析ジョブ連携において、「単一メッセージで約 15 MB のドキュメントペイロードを直接送りたい」という要件と、「コンシューマー側の `PeekLock` 処理が 8 分程度かかることがありロック切れによる重複配信を防ぎたい」という要件があります。正しい実装対策を 2 つ選択してください。",
    options: [
      "Standard 層のままメッセージサイズ上限を 50 MB に変更し、HTTP プロトコルで送信する",
      "Service Bus の Premium 層を選択し、AMQP プロトコル（単一メッセージ最大 100 MB 対応）とエンティティの最大メッセージサイズ設定を構成する（あるいは Claim-Check パターンで Blob URI を渡す）",
      "`PeekLock` の最大ロック設定時間は 5 分が上限のため、Service Bus SDK の自動ロック更新（Auto-lock renewal）を有効化するか、ジョブ状態を永続化して速やかに `Complete` し非同期ワーカーへ切り出す",
      "キューのロック期間（Lock Duration）をポータルで直接「30 分」に設定する",
    ],
    correctIndices: [1, 2],
    explanation:
      "Standard 層は 256 KB 上限であり、100 MB の大容量メッセージは Premium 層の AMQP 単一メッセージでのみ対応します（なお 15 MB 程度でも Claim-Check パターン併用が実践的です）。また `PeekLock` の最大ロック期間は 5 分であるため、5 分超の処理では SDK の自動ロック更新または非同期ジョブ切り出しが必要です。",
    keywords: ["Service Bus Premium", "AMQP 100MB", "PeekLock", "Auto-lock renewal"],
  },
  {
    id: "ai200-q14",
    domainId: "ai200-domain-3",
    domainLabel: "03: Azure サービス接続・統合",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Azure Event Grid のカスタムトピックから Azure Functions（Webhook エンドポイント）へ CloudEvents v1.0 形式でイベントをプッシュ配信しています。受信側の Webhook が一時障害で 503 エラーを返し続けた場合の既定の再試行動作と、イベント損失を防ぐための正しい対策はどれですか？",
    options: [
      "Event Grid はエラー時でも再試行を 1 回も行わず、自動的に Azure Service Bus へ転送する",
      "既定で 365 日間メモリ内に永久保持されるため、デッドレタリング設定は不要である",
      "400 Bad Request の場合のみ 30 日間無制限にリトライされる",
      "既定では指数バックオフで最大 24 時間または最大 30 回（早い方）まで再試行された後に破棄されるため、サブスクリプションでデッドレタリング（Storage Blob 宛先）を構成して未配信イベントを保存する",
    ],
    correctIndices: [3],
    explanation:
      "Event Grid は既定で最大 24 時間または 30 回の指数バックオフ再試行を行いますが、それ以降はデッドレター宛先（Storage Blob）が未構成だとイベントが破棄されます。",
    keywords: ["Azure Event Grid", "再試行ポリシー", "デッドレタリング", "CloudEvents"],
  },
  {
    id: "ai200-q15",
    domainId: "ai200-domain-3",
    domainLabel: "03: Azure サービス接続・統合",
    difficulty: "応用",
    selectCount: 1,
    question:
      "Azure Functions で外部閉域 VNet 内の Private Endpoint 経由でしか到達できない PostgreSQL へ接続し、Service Bus トリガーで 40 分かかる重いバッチ処理を行いつつ、アイドル時は従量課金でコストを抑えたいです。プラン選定と VNet 設定として正しいものはどれですか？",
    options: [
      "旧来の標準 Consumption（従量課金）プランを選択すれば、サブネット委任なしで閉域 VNet リソースへアクセスでき、タイムアウトも無制限になる",
      "Flex Consumption プランを選択し、`Microsoft.App/environments` へ委任したサブネットへ VNet 統合を行い、`host.json` の `functionTimeout` を要件に合わせて構成する",
      "HTTP トリガー関数として実装すれば、Azure Load Balancer を経由しても 40 分間同期接続を維持できる",
      "Flex Consumption プランの VNet 統合サブネットは `Microsoft.Web/serverFarms` のみに委任しなければならない",
    ],
    correctIndices: [1],
    explanation:
      "Flex Consumption プランは VNet 統合（サブネット委任先：`Microsoft.App/environments`）に対応し、非 HTTP トリガーでは `host.json` で 30 分以上の無制限タイムアウトも構成可能です（一方、HTTP トリガー応答には 230 秒上限がある点に注意）。",
    keywords: ["Flex Consumption", "VNet 統合", "Microsoft.App/environments", "functionTimeout"],
  },
  {
    id: "ai200-q16",
    domainId: "ai200-domain-3",
    domainLabel: "03: Azure サービス接続・統合",
    difficulty: "標準",
    selectCount: 1,
    question:
      "クライアントから HTTP POST で 100 ページの契約書解析リクエストを受け取り、各ページを並列で AI 分析して最後に統合要約レポートを作成し、処理に約 5 分かかるためクライアントには進捗確認用 URI を即座に返却したいです。Azure Functions で採用すべき最適なアーキテクチャパターンはどれですか？",
    options: [
      "Durable Functions を用い、HTTP Starter から `202 Accepted`＋`statusQueryGetUri` を返す「非同期 HTTP API」と、Orchestrator 内で並列タスクを集約する「Fan-out / Fan-in」を組み合わせる",
      "単一の HTTP トリガー関数内で 100 ページを順番に同期ループ処理し、5 分後に `200 OK` を返そうとする",
      "クライアント側で 100 個の Blob を直接書き込み、ブラウザを 5 分間フリーズさせて待つ",
      "Durable Orchestrator 関数の中から直接ランダム値生成や非決定的な現在時刻取得を多用して制御する",
    ],
    correctIndices: [0],
    explanation:
      "HTTP トリガーの 230 秒応答上限を回避しつつ大量ページの並列処理と最終集約を信頼性高く実装するには、Durable Functions の非同期 HTTP API パターンと Fan-out / Fan-in パターンの組み合わせが定石です。",
    keywords: ["Durable Functions", "Fan-out/Fan-in", "非同期 HTTP API", "230秒"],
  },
  {
    id: "ai200-q17",
    domainId: "ai200-domain-4",
    domainLabel: "04: セキュリティ・監視・診断",
    difficulty: "応用",
    selectCount: 2,
    question:
      "複数マイクロサービスから成る AI アプリにおいて、「非機密のシステムプロンプト設定値・機能フラグはコード再デプロイなしで動的に切り替えたい」「外部 API キーや暗号鍵は厳格に保護し、管理者の誤削除でも完全消去されないようにしたい」という要件があります。正しい実装方針を 2 つ選択してください。",
    options: [
      "Azure App Configuration に機能フラグ・設定値・Key Vault 参照 URI を集約し、センチネルキー（Sentinel key）の監視によって稼働中アプリの設定キャッシュを動的リフレッシュする",
      "すべての LLM API キーを平文のまま Azure App Configuration の通常キー値として保存し、認証なしで公開する",
      "Azure Key Vault を Azure RBAC 認可モデルで構成して `Key Vault Secrets User` を最小権限付与し、ソフト削除（Soft Delete）に加えて消去保護（Purge Protection）を有効化する",
      "Key Vault のアクセス制御は RBAC ではなく、管理対象外になりやすい Access Policy のみを使い、ソフト削除を無効化する",
    ],
    correctIndices: [0, 2],
    explanation:
      "設定・機能フラグ・Key Vault 参照の統一窓口とセンチネルキーによる動的反映には Azure App Configuration、機密の暗号化保管と強制削除防止（ソフト削除＋消去保護＋RBAC）には Azure Key Vault を組み合わせます。",
    keywords: ["App Configuration", "Sentinel キー", "Key Vault", "Purge Protection"],
  },
  {
    id: "ai200-q18",
    domainId: "ai200-domain-4",
    domainLabel: "04: セキュリティ・監視・診断",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Python / C# で開発中の AI バックエンドサービスについて、ローカル開発端末では開発者個人の Azure CLI / VS Code 認証を使い、Azure Container Apps へのデプロイ後はコードや分岐ロジックを一切書き換えず自動的にマネージド ID で Key Vault と Cosmos DB へ認証させたいです。Azure SDK で使用すべき認証クラスはどれですか？",
    options: [
      "`ClientSecretCredential` にハードコードした本番シークレット",
      "ユーザー名とパスワードを直接コードへ埋め込む `UsernamePasswordCredential`",
      "`DefaultAzureCredential`（Azure Identity SDK）",
      "匿名アクセスを許可した `AzureKeyCredential(\"dev-placeholder\")`",
    ],
    correctIndices: [2],
    explanation:
      "`DefaultAzureCredential` は環境変数・Workload Identity / マネージド ID・Azure CLI・Visual Studio Code 等の認証ソースを順序評価するため、ローカル開発から本番環境まで単一コードでシームレスに資格情報レス認証を切り替えられます。",
    keywords: ["DefaultAzureCredential", "Azure Identity", "マネージド ID"],
  },
  {
    id: "ai200-q19",
    domainId: "ai200-domain-4",
    domainLabel: "04: セキュリティ・監視・診断",
    difficulty: "標準",
    selectCount: 1,
    question:
      "API ゲートウェイ → Container Apps → Azure Service Bus → Azure Functions → ベクター DB と複数サービスを経由する AI 処理で、どの工程が遅延・失敗しているかを単一のエンドツーエンド トランザクションとして Application Insights 上で相関可視化したいです。最も適切な実装はどれですか？",
    options: [
      "各サービスの標準出力にタイムスタンプ付きの文字列ログだけを出して、目視で時刻を照合する",
      "各サービスに OpenTelemetry SDK（Azure Monitor Distro）を組み込み、HTTP ヘッダーおよび Service Bus メッセージプロパティ経由で W3C Trace Context（`traceparent` / `operation_Id`）を伝播させる",
      "Application Insights を API ゲートウェイだけに導入し、非同期の Service Bus と Functions 側は一切計装しない",
      "VM ゲスト OS のディスク使用率メトリクスだけを 15 分おきに監視する",
    ],
    correctIndices: [1],
    explanation:
      "OpenTelemetry SDK と W3C Trace Context 伝播を同期 HTTP および非同期メッセージング（Service Bus プロパティ）の両方で引き継ぐことで、Application Insights 上で単一の `operation_Id` に紐付いた依存関係マップ・ガントチャートを追跡できます。",
    keywords: ["OpenTelemetry", "W3C Trace Context", "Application Insights", "分散トレーシング"],
  },
  {
    id: "ai200-q20",
    domainId: "ai200-domain-4",
    domainLabel: "04: セキュリティ・監視・診断",
    difficulty: "応用",
    selectCount: 1,
    question:
      "Application Insights と統合された Log Analytics ワークスペースにおいて、「直近 2 時間で HTTP 500 系エラーまたは所要時間 3,000 ms 超となった `/api/rag/query` リクエストの件数と 95 パーセンタイル（P95）レイテンシを 5 分間隔で集計し、関連する例外ログを `operation_Id` で突合したい」場合に使用する機能・クエリ要素として正しいものはどれですか？",
    options: [
      "Azure Portal のリソースロック画面から `ReadOnly` ロックを設定してメトリクスを凍結する",
      "PostgreSQL の `pgvector` クエリ内で `<=>` 演算子を使ってアプリケーションログの文字列検索を行う",
      "Azure Cost Management の予算アラート画面で CPU 平均値だけを確認する",
      "Log Analytics の KQL で `requests` テーブルを `where timestamp > ago(2h)`・`summarize count(), percentile(duration, 95) by bin(timestamp, 5m)` で集計し、`exceptions` テーブルと `on operation_Id` で `join` する",
    ],
    correctIndices: [3],
    explanation:
      "Log Analytics / Application Insights の詳細ログ相関とパーセンタイル集計には KQL（Kusto Query Language）の `requests` / `exceptions` テーブル、`ago()`、`bin()`、`percentile()`、`join on operation_Id` を活用します。",
    keywords: ["KQL", "Log Analytics", "percentile", "operation_Id"],
  },
];

export const ai200OfficialResources: AzureOfficialResource[] = [
  {
    title: "Microsoft Certified: Azure AI Cloud Developer Associate 認定ページ",
    description:
      "AI-200 資格の全体像、対象開発者像（旧 AZ-204 後継）、スキル要件および更新ポリシーを確認できます。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/azure-ai-cloud-developer/",
    badge: "公式認定ページ",
  },
  {
    title: "Exam AI-200 公式試験ガイド (Study Guide)",
    description:
      "4 つの出題ドメイン（重み付け 20〜30%）と詳細タスク・最新改訂内容の一次情報です。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/resources/study-guides/ai-200",
    badge: "公式試験ガイド",
  },
  {
    title: "Exam AI-200 試験詳細・模擬評価ページ",
    description:
      "試験時間・受験登録・Microsoft Learn 試験中参照ルールおよび公式 Practice Assessment へアクセスできます。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/exams/ai-200/",
    badge: "試験詳細・模擬",
  },
  {
    title: "コース AI-200T00 公式ラーニング コース (Microsoft Learn)",
    description:
      "コンテナ開発・Cosmos DB/pgvector/Redis・Service Bus/Event Grid/Functions・監視を体系的に学べる公式トレーニングです。",
    url: "https://learn.microsoft.com/ja-jp/training/courses/ai-200t00",
    badge: "公式トレーニング",
  },
];
