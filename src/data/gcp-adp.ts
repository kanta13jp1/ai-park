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

// 出典: Google Cloud 認定 Associate Data Practitioner 公式ページ・試験ガイド・ドキュメント (https://cloud.google.com/learn/certification/data-practitioner?hl=ja / 確認日: 2026-11-22)
export const adpExamFacts: CertExamFact[] = [
  {
    label: "対象試験",
    value: "Associate Data Practitioner",
    detail: "データ取り込み・分析・パイプライン・管理",
  },
  {
    label: "試験時間",
    value: "120 分",
    detail: "選択問題（単一選択・複数選択）",
  },
  {
    label: "問題数",
    value: "約 50〜60 問",
    detail: "英語・日本語に対応（試験回により変動）",
  },
  {
    label: "合格ライン",
    value: "非公開（合否通知）",
    detail: "公式はスコア非公開（Pass / Fail 判定）",
  },
  {
    label: "有効期限",
    value: "3 年間",
    detail: "認定取得日から 3 年で再認定が必要",
  },
  {
    label: "受験形式",
    value: "CertMetrics / Pearson VUE",
    detail: "オンライン監督（OnVUE）またはテストセンター受験（推奨経験 6 ヶ月+）",
  },
];

export const adpDomains: GcpDomain[] = [
  {
    id: "adp-domain-1",
    number: "01",
    title: "データの準備と取り込み",
    englishTitle: "Data Preparation and Ingestion",
    weight: "約 30%",
    accentColor: "indigo",
    summary:
      "ETL / ELT の選定、データ品質評価とノーコード前処理（Dataprep / Cloud Data Fusion）、バッチおよびストリーミングのデータ取り込み（Storage Transfer Service / BigQuery Data Transfer Service / Pub/Sub / Dataflow / Datastream）、要件に応じたストレージ・データベース選定を学びます。",
    topics: [
      {
        id: "adp-1-1",
        code: "1.1",
        title: "ETL / ELT 設計とデータ品質評価・前処理（Dataprep / Data Fusion）",
        services: ["ETL / ELT", "Dataprep", "Cloud Data Fusion", "Dataflow"],
        keyPoints: [
          "構造化・半構造化・非構造化データや主要フォーマット（CSV / JSON / Apache Parquet / Avro）の特性を理解し、欠損値・重複・型不整合などのデータ品質を評価・整形する",
          "取り込み前に外部で変換・PII マスキング等を行う ETL と、まず BigQuery 等の DWH へ生データをロードしてから SQL / Dataform で変換する ELT を要件とスキルセットに応じて使い分ける",
          "Dataprep はプログラミング不要のビジュアル画面でデータ探索・異常値検出・クレンジングレシピを作成でき、Dataflow を実行エンジンとして大規模変換できる",
          "Cloud Data Fusion は CDAP ベースのノーコード / ローコード GUI パイプライン基盤で、オンプレミス DB や各種 SaaS 向けコネクタを使って視覚的に ETL / ELT を統合できる",
        ],
        examTip:
          "『非エンジニアのアナリストが GUI で対話的に欠損値や表記揺れを整形したい』＝ Dataprep、『豊富なコネクタを用いて GUI ベースで複数システムから ETL 統合したい』＝ Cloud Data Fusion。",
      },
      {
        id: "adp-1-2",
        code: "1.2",
        title: "バッチデータ転送とファイル・SaaS からの一括ロード",
        services: [
          "Storage Transfer Service",
          "BigQuery Data Transfer Service",
          "Transfer Appliance",
          "bq load",
        ],
        keyPoints: [
          "Storage Transfer Service は Amazon S3・Azure Blob Storage・HTTP/HTTPS・オンプレミスや別バケットから Cloud Storage へ大容量データをスケジュール／継続的にオンライン転送する",
          "ネットワーク帯域が限られており数十 TB〜ペタバイト級のデータを物理デバイス発送でオフライン移行する場合は Transfer Appliance を選択する",
          "BigQuery Data Transfer Service（DTS）は Google 広告・Google アナリティクス 4・YouTube・SaaS や Cloud Storage / S3 から BigQuery への定期ロードをコード不要で自動化する",
          "`bq load` コマンドや Cloud Console、SQL の `LOAD DATA` を用いて Cloud Storage 上の CSV / JSON / Parquet / Avro ファイルを BigQuery テーブルへロードできる（列指向の Parquet や Avro はスキーマ自動認識と圧縮効率に優れる）",
        ],
        examTip:
          "『Amazon S3 や HTTP サーバーから Cloud Storage へ定期転送』＝ Storage Transfer Service、『SaaS や広告データを BigQuery へコードレスで定期ロード』＝ BigQuery Data Transfer Service。",
      },
      {
        id: "adp-1-3",
        code: "1.3",
        title: "ストリーミング取り込みと CDC（変更データキャプチャ）",
        services: ["Pub/Sub", "Dataflow", "Datastream", "BigQuery Subscription"],
        keyPoints: [
          "Pub/Sub は IoT センサーやアプリイベントなどをリアルタイムに受信するフルマネージドな非同期メッセージング基盤（At-least-once 配信）",
          "複雑な変換やウィンドウ集計を伴わないシンプルなストリーミング取り込みでは、Pub/Sub の BigQuery サブスクリプション（BigQuery Subscription）や Cloud Storage サブスクリプションにより Dataflow なしで直接書き込める",
          "Dataflow（Apache Beam）はバッチ処理とストリーミング処理を単一モデルで実装できるサーバーレス基盤で、重複排除やウィンドウ集計・複雑変換を伴うパイプラインに使用する",
          "Datastream は Cloud SQL・Oracle・PostgreSQL・MySQL などの運用 DB から変更データキャプチャ（CDC）によって INSERT / UPDATE / DELETE 差分をサーバーレスで低遅延同期する",
        ],
        examTip:
          "『既存 RDB の更新差分（CDC）を本稼働 DB への負荷を抑えながらリアルタイムで BigQuery へ反映したい』＝ Datastream、『変換不要で Pub/Sub からそのまま BigQuery へ取り込みたい』＝ BigQuery Subscription。",
      },
      {
        id: "adp-1-4",
        code: "1.4",
        title: "データストレージ・データベース選定とロード先設計",
        services: [
          "Cloud Storage",
          "BigQuery",
          "Cloud SQL",
          "Cloud Spanner",
          "Firestore",
          "Cloud Bigtable",
        ],
        keyPoints: [
          "Cloud Storage は画像・動画・音声・ログ等の非構造化データやデータレイクの着地点（ランディングゾーン）として標準利用される無制限のオブジェクトストレージ",
          "BigQuery はペタバイト級の列指向サーバーレス DWH（OLAP）で、大規模 SQL 分析・BI・集計処理の中心を担う",
          "Cloud SQL は一般的な Web / 業務アプリ向けマネージド RDB（MySQL / PostgreSQL / SQL Server）、Cloud Spanner はグローバル水平スケール・強整合性・高可用性が必要なミッションクリティカル分散 RDB",
          "Firestore はモバイル / Web アプリ向けのリアルタイム同期対応 NoSQL ドキュメント DB、Cloud Bigtable は IoT 時系列やアドテク等のミリ秒級超低レイテンシ・高スループットなワイドカラム NoSQL",
        ],
        examTip:
          "『トランザクション処理（OLTP）＝ Cloud SQL / Cloud Spanner / Firestore、超低レイテンシ IoT 時系列＝ Cloud Bigtable、大規模 SQL 分析（OLAP）＝ BigQuery、非構造化ファイル＝ Cloud Storage』の切り分けが鉄則。",
      },
    ],
  },
  {
    id: "adp-domain-2",
    number: "02",
    title: "データの分析とプレゼンテーション",
    englishTitle: "Data Analysis and Presentation",
    weight: "約 27%",
    accentColor: "cyan",
    summary:
      "BigQuery SQL による分析と物理設計最適化（パーティショニング・クラスタリング・マテリアライズドビュー・EXPORT DATA）、BigQuery Studio と Colab Enterprise による探索的分析、BigQuery ML による SQL ベースの予測・Gemini 連携、Looker / Looker Studio による可視化を学びます。",
    topics: [
      {
        id: "adp-2-1",
        code: "2.1",
        title: "BigQuery SQL 分析・最適化とビュー・データエクスポート",
        services: [
          "BigQuery",
          "パーティショニング",
          "クラスタリング",
          "マテリアライズドビュー",
          "EXPORT DATA",
        ],
        keyPoints: [
          "BigQuery は列指向ストレージのため、`SELECT *` を避けて必要な列のみを指定することでスキャンバイト課金とクエリ実行時間を直接削減できる（`LIMIT` を付けてもスキャン量は減らない）",
          "日付・タイムスタンプ・整数範囲によるパーティショニング（Partitioning）でスキャン対象区画を限定し、最大 4 列指定のクラスタリング（Clustering）でブロック内の並び順を最適化してフィルタ・集計を高速化する",
          "標準ビュー（Logical View）は SQL ロジックの再利用やアクセス分割に用い、マテリアライズドビュー（Materialized View）は集計結果を事前計算・自動最新化して繰り返し実行される重い集計クエリを高速化する",
          "分析済みデータの外部連携やバックアップ出力には、`EXPORT DATA` SQL 文または `bq extract` コマンドを使って Cloud Storage へ Parquet / Avro / CSV / JSON 形式でエクスポートする",
        ],
        examTip:
          "『同じ重い集計クエリがダッシュボードから何度も実行される』＝ マテリアライズドビュー、『日次ログテーブルのスキャンコスト削減』＝ 日付パーティショニング＋必要列指定。",
      },
      {
        id: "adp-2-2",
        code: "2.2",
        title: "BigQuery Studio・Colab Enterprise と BigQuery ML の活用",
        services: ["BigQuery Studio", "Colab Enterprise", "BigQuery ML", "Gemini in BigQuery"],
        keyPoints: [
          "BigQuery Studio は SQL エディタ・Python ノートブック・データ準備・パイプライン管理を統合した分析ワークスペースとして機能する",
          "Colab Enterprise は Google Cloud の IAM・VPC セキュリティと統合されたマネージド Jupyter ノートブック環境で、BigQuery DataFrames（BigFrames）等を使い Python で大規模データを探索・可視化できる",
          "BigQuery ML（BQML）を使うと、BigQuery からデータを外部へ移動せずに標準 SQL（`CREATE MODEL` / `ML.EVALUATE` / `ML.PREDICT`）だけで回帰・分類・クラスタリング・時系列予測モデルを構築・推論できる",
          "Gemini in BigQuery による SQL / Python 生成支援や、BigQuery リモートモデル経由での Vertex AI / 生成 AI モデル呼び出しにより、テキスト要約・分類などをテーブルデータへ SQL から直接適用できる",
        ],
        examTip:
          "『SQL スキルを持つアナリストが BigQuery 内の顧客データを使って即座に解約予測モデルを構築したい』＝ BigQuery ML、『VPC/IAM 統制下で Python ノートブック分析したい』＝ Colab Enterprise。",
      },
      {
        id: "adp-2-3",
        code: "2.3",
        title: "Looker・Looker Studio による BI 可視化とプレゼンテーション",
        services: ["Looker", "Looker Studio", "LookML", "BI Engine", "Connected Sheets"],
        keyPoints: [
          "Looker Studio は無料から利用可能なセルフサービス BI ツールで、BigQuery・Google スプレッドシート・GA4 等と接続し、インタラクティブなグラフやダッシュボードを素早く共有できる",
          "Looker は LookML を用いて KPI 計算式やテーブル結合ロジックをコードとして一元管理（Git バージョン管理対応）し、全社で指標定義のブレを防ぎつつガバナンスの効いた BI・組み込み分析を提供する",
          "BigQuery BI Engine は BigQuery 上のインメモリ分析サービスで、Looker や Looker Studio からの対話型ダッシュボードクエリをサブ秒レベルに高速化する",
          "Connected Sheets（BigQuery 用コネクテッド シート）により、ビジネスユーザーは使い慣れた Google スプレッドシートの画面・ピボットテーブル・数式のまま数十億行の BigQuery データを直接集計できる",
        ],
        examTip:
          "『全社で指標（売上・粗利等）の定義をコード統一してバージョン管理したい』＝ Looker（LookML）、『ノーコードで迅速に無料から可視化共有』＝ Looker Studio、『スプレッドシートのまま大規模集計』＝ Connected Sheets。",
      },
    ],
  },
  {
    id: "adp-domain-3",
    number: "03",
    title: "データ パイプラインのオーケストレーション",
    englishTitle: "Data Pipeline Orchestration",
    weight: "約 18%",
    accentColor: "emerald",
    summary:
      "Dataform（SQLX）による BigQuery ELT パイプラインと品質テスト、Cloud Composer（Apache Airflow）・Workflows・Cloud Scheduler・Eventarc による自動化とイベント駆動制御、Dataproc（Spark / Hadoop）の活用とパイプライン監視を学びます。",
    topics: [
      {
        id: "adp-3-1",
        code: "3.1",
        title: "Dataform（SQLX）による ELT パイプラインと品質アサーション",
        services: ["Dataform", "SQLX", "アサーション", "スケジュール実行", "BigQuery 予約クエリ"],
        keyPoints: [
          "単発で依存関係の少ない SQL 定期集計であれば BigQuery 予約クエリ（Scheduled Queries）で十分だが、複数テーブル間の依存管理や開発ワークフローが必要な場合は Dataform を選択する",
          "Dataform は SQLX ファイルでテーブル・ビュー・増分更新（Incremental tables）を定義し、`${ref(\"...\")}` 構文で依存関係グラフ（DAG）を自動解決しながら ELT を実行する",
          "アサーション（Assertions）を組み込むことで、変換後のデータに NULL 混入・主キー重複・値域異常がないかを自動検証し、異常時に下流テーブルへの反映を止められる",
          "Git リポジトリ連携によるコードレビューや、Dataform ワークフロー構成によるスケジュール実行（または Cloud Composer からのトリガー）で本番パイプラインを安全に運用する",
        ],
        examTip:
          "『BigQuery 内の複数 SQL 変換を依存関係管理・Git 管理・アサーション（品質チェック）付きで実行したい』＝ Dataform（SQLX）、『単独 SQL を毎日定時に回すだけ』＝ BigQuery 予約クエリ。",
      },
      {
        id: "adp-3-2",
        code: "3.2",
        title: "Cloud Composer・Workflows・イベント駆動オーケストレーション",
        services: [
          "Cloud Composer",
          "Cloud Scheduler",
          "Workflows",
          "Eventarc",
          "Cloud Run functions",
        ],
        keyPoints: [
          "Cloud Composer は Apache Airflow ベースのフルマネージドオーケストレーションサービスで、Python DAG により BigQuery / Dataflow / Dataproc / 外部 API を跨ぐ複雑なワークフローとリトライを統制する",
          "Cloud Scheduler はフルマネージドな cron スケジューラで、定刻に Workflows・Cloud Run・Pub/Sub・HTTP エンドポイントを起動するトリガーとして活用する",
          "Workflows は YAML / JSON でステップを定義する軽量サーバーレス オーケストレータで、Airflow クラスタを常駐させずに GCP サービスや外部 API の順序・条件分岐連携を自動化する",
          "Cloud Storage へのファイル到着を起点に即座にロードや通知を起動する場合は、Eventarc（または GCS イベントトリガー）から Cloud Run functions や Workflows をイベント駆動で呼び出す",
        ],
        examTip:
          "『ファイルが GCS に届いたら即処理を起動』＝ Eventarc + Cloud Run functions / Workflows、『複雑 DAG・バックフィル・外部基盤連携』＝ Cloud Composer。",
      },
      {
        id: "adp-3-3",
        code: "3.3",
        title: "Dataproc（Spark / Hadoop）活用とパイプライン監視",
        services: ["Dataproc", "Dataproc Serverless", "Cloud Monitoring", "Cloud Logging"],
        keyPoints: [
          "Dataproc はマネージド Apache Spark / Hadoop サービスで、既存のオンプレミス PySpark・Spark SQL・Hive ジョブを最小限の改修で Google Cloud へ移行できる",
          "入力・出力データをクラスタ内 HDFS ではなく Cloud Storage に分離することで、ジョブ実行時のみ起動して完了後に削除する「エフェメラルクラスタ」運用が可能となりコストを大幅削減できる",
          "クラスタのサイズ設計や維持管理自体を不要にし、PySpark / Spark SQL ジョブを直接サーバーレス実行したい場合は Dataproc Serverless を選択する",
          "パイプラインの正常性・エラー検知・遅延アラートには Cloud Monitoring（アラートポリシー・ジョブメトリクス監視）と Cloud Logging（エラーログ検索・監査）を組み合わせる",
        ],
        examTip:
          "『既存の Spark スクリプトを最小修正でコスト最適に動かしたい』＝ データを Cloud Storage に置いて Dataproc エフェメラルクラスタまたは Dataproc Serverless。",
      },
    ],
  },
  {
    id: "adp-domain-4",
    number: "04",
    title: "データ管理",
    englishTitle: "Data Management",
    weight: "約 25%",
    accentColor: "amber",
    summary:
      "Cloud IAM と BigQuery のきめ細かなアクセス制御（承認済みビュー・列レベルセキュリティ）、暗号鍵管理（CMEK）、Sensitive Data Protection（Cloud DLP）による PII 保護、Dataplex・Data Catalog・Data Lineage による統合ガバナンス、ストレージライフサイクルと復旧・可用性設計を学びます。",
    topics: [
      {
        id: "adp-4-1",
        code: "4.1",
        title: "Cloud IAM 最小権限・BigQuery きめ細かなアクセス制御と暗号化",
        services: ["Cloud IAM", "承認済みビュー", "列レベルセキュリティ", "Cloud KMS", "CMEK"],
        keyPoints: [
          "Cloud IAM では権限が広すぎる基本ロール（Owner / Editor / Viewer）を避け、事前定義ロール（例：`roles/bigquery.dataViewer` と `roles/bigquery.jobUser` の責務分離）やカスタムロールで最小権限を徹底する",
          "BigQuery の承認済みビュー（Authorized Views）・承認済みデータセットを使うと、元テーブルの直接閲覧権限を付与せずに集計・フィルタ済み結果のみを他部門ユーザーへ安全に共有できる",
          "同一テーブル内で給与や個人番号などの機密列だけを隠したい場合は Data Catalog のポリシータグによる列レベルセキュリティ（Column-level security）、特定部署の行だけ見せたい場合は行レベルアクセスポリシーを使用する",
          "保存データは既定で Google 管理鍵により暗号化されるが、鍵のローテーション頻度や即時無効化（アクセス遮断）を自社管理したいコンプライアンス要件では Cloud KMS による顧客管理の暗号鍵（CMEK）を設定する",
        ],
        examTip:
          "『元テーブルを直接見せず集計結果だけ共有』＝ 承認済みビュー、『特定列のアクセス制限』＝ 列レベルセキュリティ（ポリシータグ）、『自社による暗号鍵ライフサイクル管理』＝ CMEK。",
      },
      {
        id: "adp-4-2",
        code: "4.2",
        title: "機密データ保護（Cloud DLP）と Dataplex ガバナンス・リネージ",
        services: ["Cloud DLP", "Dataplex", "Data Catalog", "Data Lineage", "データ品質"],
        keyPoints: [
          "Sensitive Data Protection（旧 Cloud DLP）は BigQuery や Cloud Storage、データストリーム内の PII（クレジットカード番号・マイナンバー・メールアドレス等）を自動検出し、マスキングやトークン化（匿名化）できる",
          "Dataplex は Cloud Storage と BigQuery に分散したデータ資産を「レイク → ゾーン（Raw / Curated）→ アセット」として論理的に統合し、統一ポリシー適用と自動データ品質（Data Quality）検証を実施する",
          "Data Catalog（Dataplex Universal Catalog）は全社テーブルやバケットのメタデータ検索・タグテンプレート・ビジネス用語集を一元化し、必要なデータを素早く発見できるようにする",
          "Data Lineage（データリネージ）機能を有効化することで、BigQuery・Dataform・Dataflow・Dataproc 等を跨ぐデータの由来と変換経路を自動可視化し、障害時や仕様変更時の影響調査を迅速化する",
        ],
        examTip:
          "『PII の自動検出とマスキング/匿名化』＝ Cloud DLP（Sensitive Data Protection）、『GCS と BigQuery を跨ぐ横断的な検索・データ品質検証・データリネージ』＝ Dataplex / Data Catalog。",
      },
      {
        id: "adp-4-3",
        code: "4.3",
        title: "データライフサイクル・コスト最適化・高可用性とディザスタリカバリ",
        services: [
          "ライフサイクル管理",
          "ストレージクラス",
          "Autoclass",
          "Time Travel",
          "マルチリージョン",
        ],
        keyPoints: [
          "Cloud Storage の 4 つのストレージクラス（Standard / Nearline / Coldline / Archive）はアクセス頻度と最低保存期間（なし / 30日 / 90日 / 365日）で選び、オブジェクト ライフサイクル管理で自動移行・自動削除を設定する",
          "データへのアクセス頻度が予測不能または時間とともに不規則に変化するバケットでは、Autoclass を有効化することで自動的に最適なストレージクラスへ調整できる",
          "BigQuery の Time Travel 機能により、最大 7 日間（2〜7 日で変更可能）の過去任意時点のテーブル状態を `FOR SYSTEM_TIME AS OF` で照会し、誤った `DELETE` やテーブル上書きを迅速に復旧できる",
          "データレジデンシー規制（国内保存等）がある場合はシングルリージョン（例：`asia-northeast1`）を指定し、リージョン障害への耐性（DR / 高可用性）が必要な場合はマルチリージョンまたはクロスリージョン レプリケーション・テーブルスナップショットを設計する",
        ],
        examTip:
          "『誤操作で消した BigQuery データを 7 日以内に戻す』＝ Time Travel、『アクセス頻度が読めない GCS バケットのコスト最適化』＝ Autoclass、『経過日数での自動階層移動』＝ ライフサイクル管理。",
      },
    ],
  },
];

export const adpComparisons: GcpComparisonTable[] = [
  {
    id: "adp-comp-processing",
    category: "コンピュート",
    title: "ETL / ELT データ処理・変換エンジンの使い分け",
    subtitle: "ノーコード・SQL・Apache Beam・Spark と開発スキルセットによる選定",
    columns: ["サービス", "開発方式", "主な強み", "適しているシナリオ"],
    rows: [
      {
        feature: "Dataprep",
        values: [
          "GUI（ビジュアルレシピ）",
          "対話的なデータ探索・欠損/異常値クレンジング（Dataflow 実行）",
          "非エンジニアのアナリスト主導で行う前処理・品質改善",
        ],
      },
      {
        feature: "Cloud Data Fusion",
        values: [
          "GUI（CDAP ベース）",
          "多様な DB / SaaS コネクタを用いたノーコード / ローコード ETL",
          "複数システムやオンプレミスからの視覚的データ統合",
        ],
      },
      {
        feature: "Dataform",
        values: [
          "SQLX（宣言的 SQL）",
          "依存関係（${ref()}）・アサーション・Git 連携・スケジュール実行",
          "BigQuery 内部での SQL 中心 ELT パイプライン運用",
        ],
      },
      {
        feature: "Dataflow",
        values: [
          "Apache Beam（Python / Java / Go）",
          "バッチ＆ストリーミング統一処理・オートスケール・サーバーレス",
          "複雑なストリーム加工・ウィンドウ集計・大規模変換",
        ],
      },
      {
        feature: "Dataproc / Dataproc Serverless",
        values: [
          "Apache Spark / Hadoop / Hive",
          "既存 Spark 資産の最小改修移行、GCS 連携エフェメラル実行",
          "オンプレミス Hadoop / Spark 移行やサーバーレス Spark バッチ",
        ],
      },
      {
        feature: "Cloud Run functions",
        values: [
          "軽量コード（Python / Node.js 等）",
          "Eventarc 等のイベント契機で即起動するサーバーレス関数",
          "GCS ファイル到着直後の軽量検証・ロード起動・通知",
        ],
      },
    ],
    decisionRule:
      "ノーコード整形＝Dataprep、GUI コネクタ統合＝Cloud Data Fusion、BigQuery 内 SQL 変換＝Dataform、ストリーム＆複雑変換＝Dataflow、既存 Spark 移行＝Dataproc（運用レスなら Dataproc Serverless）。",
  },
  {
    id: "adp-comp-storage-db",
    category: "ストレージ・DB",
    title: "Google Cloud ストレージ・データベース選定",
    subtitle: "非構造化データ・OLTP・NoSQL・OLAP（DWH）の役割分担",
    columns: ["サービス", "データ種別", "スケール / 整合性", "主な用途"],
    rows: [
      {
        feature: "Cloud Storage",
        values: [
          "オブジェクト（非構造化 / Parquet / Avro / CSV）",
          "容量無制限・高耐久性",
          "データレイク Raw 領域・バックアップ・EXPORT DATA の出力先",
        ],
      },
      {
        feature: "BigQuery",
        values: [
          "列指向サーバーレス DWH（OLAP）",
          "ペタバイト級・秒単位 SQL 分析",
          "大規模集計・BI 分析・BigQuery ML 予測",
        ],
      },
      {
        feature: "Cloud SQL",
        values: [
          "マネージド RDB（MySQL / PostgreSQL / SQL Server）",
          "リージョン内 HA 構成・TB 級",
          "一般的な Web / 業務システムの標準 OLTP データベース",
        ],
      },
      {
        feature: "Cloud Spanner",
        values: [
          "グローバル分散 RDB（SQL）",
          "水平無制限・99.999% 可用性・強整合性",
          "世界規模で強整合性が必要な金融・在庫管理 OLTP",
        ],
      },
      {
        feature: "Firestore",
        values: [
          "サーバーレス NoSQL ドキュメント DB",
          "自動水平スケール・リアルタイム同期",
          "モバイル / Web アプリの状態管理・オフライン同期",
        ],
      },
      {
        feature: "Cloud Bigtable",
        values: [
          "NoSQL ワイドカラム DB",
          "10ms 未満の超低レイテンシ・ペタバイト級",
          "IoT 時系列センサー・アドテク・高スループット書き込み",
        ],
      },
    ],
    decisionRule:
      "生ファイル＝Cloud Storage、SQL 分析＝BigQuery、標準 RDB＝Cloud SQL、グローバル強整合 RDB＝Cloud Spanner、モバイル同期＝Firestore、IoT 時系列＝Cloud Bigtable。",
  },
  {
    id: "adp-comp-storage-class",
    category: "ストレージ・DB",
    title: "Cloud Storage ストレージクラス＆ライフサイクル比較",
    subtitle: "最低保存期間・取り出し料金・Autoclass・リージョン構成",
    columns: ["クラス / 機能", "最低保存期間", "取り出し料金", "想定ユースケース"],
    rows: [
      {
        feature: "Standard",
        values: [
          "なし",
          "なし",
          "頻繁にアクセスするホットデータ・直近のパイプライン入力",
        ],
      },
      {
        feature: "Nearline",
        values: [
          "30 日",
          "あり",
          "月 1 回未満のアクセス（日次 / 週次バックアップや月次レポート）",
        ],
      },
      {
        feature: "Coldline",
        values: [
          "90 日",
          "あり",
          "四半期に 1 回程度のアクセス（災害復旧用データ・四半期監査）",
        ],
      },
      {
        feature: "Archive",
        values: [
          "365 日",
          "あり（高め）",
          "年 1 回未満のアクセス（法令対応の長期ログ保管）",
        ],
      },
      {
        feature: "Autoclass / ライフサイクル管理",
        values: [
          "自動調整 / ルール指定",
          "Autoclass はクラス移行費の最適化あり",
          "アクセス頻度が不規則なら Autoclass、経過日数ルールが固定ならライフサイクル管理",
        ],
      },
    ],
    decisionRule:
      "経過日数が明確（例：30日→Nearline、365日→削除）ならライフサイクル管理、アクセス頻度が読めない場合は Autoclass。なお国内保管要件は単一リージョン、広域冗長はマルチリージョンを選定します。",
  },
  {
    id: "adp-comp-analysis-bi",
    category: "AI・データ分析",
    title: "BigQuery 最適化・ノートブック・ML・BI 可視化比較",
    subtitle: "クエリ高速化・コスト削減・予測モデリング・ダッシュボード提供",
    columns: ["機能 / サービス", "対象領域", "仕組み・強み", "選定の目安"],
    rows: [
      {
        feature: "パーティショニング & クラスタリング",
        values: [
          "BigQuery 物理設計最適化",
          "日付等で区画を絞り（パーティショニング）、最大4列ソート（クラスタリング）で読取削減",
          "巨大テーブルのクエリコスト削減と高速化の必須基本設計",
        ],
      },
      {
        feature: "マテリアライズドビュー & BI Engine",
        values: [
          "集計高速化・キャッシング",
          "事前計算の自動最新化（マテリアライズドビュー）とインメモリ高速化（BI Engine）",
          "ダッシュボードから同じ重い集計クエリが反復実行される場合",
        ],
      },
      {
        feature: "BigQuery Studio & Colab Enterprise",
        values: [
          "統合探索・Python 分析",
          "SQL エディタとマネージド Jupyter ノートブック（IAM/VPC 統制）を統合",
          "BigQuery 上の大規模データを Python（BigFrames 等）で探索する場合",
        ],
      },
      {
        feature: "BigQuery ML & Gemini in BigQuery",
        values: [
          "SQL 機械学習・生成 AI 連携",
          "CREATE MODEL / ML.PREDICT の SQL だけで学習・推論、Gemini 補助・リモートモデル呼出",
          "データを移動せず SQL ベースで予測モデル構築やテキスト分析を行う場合",
        ],
      },
      {
        feature: "Looker vs Looker Studio (+ Connected Sheets)",
        values: [
          "BI 可視化・KPI 統制",
          "LookML で KPI 定義を一元管理する Looker、無料から使える Looker Studio、シート操作の Connected Sheets",
          "全社ガバナンス重視＝Looker、手軽な可視化＝Looker Studio、表計算連携＝Connected Sheets",
        ],
      },
    ],
    decisionRule:
      "スキャン削減＝パーティショニング＋クラスタリング、反復集計高速化＝マテリアライズドビュー＋BI Engine、全社KPI統一＝Looker (LookML)、SQLでML＝BigQuery ML。",
  },
  {
    id: "adp-comp-security-gov",
    category: "ネットワーク・セキュリティ",
    title: "データセキュリティ・アクセス制御・ガバナンス比較",
    subtitle: "Cloud IAM・暗号化・PII 保護・Dataplex 統合統治",
    columns: ["機能 / サービス", "保護対象", "主な制御メカニズム", "出題での見分け方"],
    rows: [
      {
        feature: "Cloud IAM & 承認済みビュー",
        values: [
          "データセット・テーブル・ビュー",
          "事前定義ロールで最小権限を付与。承認済みビューで元テーブル権限なしに集計のみ公開",
          "『元テーブルは見せず集計済みビューだけ許可したい』ケース",
        ],
      },
      {
        feature: "列レベルセキュリティ & 行レベル制御",
        values: [
          "テーブル内の特定列・行",
          "Data Catalog ポリシータグによる列アクセス制限と行レベルアクセスポリシー",
          "『同じテーブルの給与列だけ隠す／自部署データ行だけ見せる』ケース",
        ],
      },
      {
        feature: "Cloud KMS (CMEK)",
        values: [
          "保存データの暗号鍵",
          "自社管理の暗号鍵（CMEK）で鍵ローテーションや緊急時の鍵失効による遮断を制御",
          "『Google 管理鍵ではなく自社で暗号鍵のライフサイクルを管理したい』要件",
        ],
      },
      {
        feature: "Cloud DLP (Sensitive Data Protection)",
        values: [
          "PII（個人情報・機密値）",
          "マイナンバー・クレカ番号等を自動検査し、マスキングやトークン化で匿名化",
          "『取り込み前後や保存データの個人情報を自動検出してマスクしたい』要件",
        ],
      },
      {
        feature: "Dataplex / Data Catalog / Data Lineage",
        values: [
          "レイク・DWH 横断メタデータ＆品質",
          "レイク/ゾーン統合管理、データ品質ルール検証、メタデータ検索、データ来歴追跡",
          "『GCS と BigQuery 全体の品質チェック・カタログ検索・来歴追跡』要件",
        ],
      },
    ],
    decisionRule:
      "集計共有＝承認済みビュー、機密列隠蔽＝列レベルセキュリティ、鍵管理＝CMEK、PII 検出・匿名化＝Cloud DLP、横断カタログ・品質・来歴＝Dataplex。",
  },
  {
    id: "adp-comp-ingest-orch",
    category: "運用・移行・コスト",
    title: "データ取り込み・転送・オーケストレーション比較",
    subtitle: "バッチ移行・CDC・ストリーミング取り込みとワークフロー自動化",
    columns: ["サービス / 機能", "役割・トリガー", "特徴", "選定基準"],
    rows: [
      {
        feature: "Storage Transfer Service / Transfer Appliance",
        values: [
          "バッチデータ転送（GCS 宛）",
          "オンライン定期転送（STS）vs 物理アプライアンス発送（Transfer Appliance）",
          "帯域十分・クラウド間＝STS、低帯域・数十TB以上一括＝Appliance",
        ],
      },
      {
        feature: "BigQuery Data Transfer Service & bq load",
        values: [
          "BigQuery への定期/手動ロード",
          "広告・GA4・SaaS・GCS からの自動定期ロード（DTS）と CLI / SQL 一括ロード（bq load）",
          "SaaS データのコードレス定期取込は DTS、ファイル一括投入は bq load",
        ],
      },
      {
        feature: "Pub/Sub (BigQuery Subscription) & Datastream",
        values: [
          "リアルタイム取込 & CDC",
          "イベントの直接 BigQuery 書込（BigQuery Subscription）と RDB 変更差分同期（Datastream）",
          "加工不要イベント＝BigQuery Subscription、RDB 更新差分＝Datastream",
        ],
      },
      {
        feature: "Dataform vs BigQuery 予約クエリ",
        values: [
          "SQL 変換の定期実行・品質管理",
          "SQLX 依存関係＋アサーション＋Git 管理（Dataform）vs 単発定期 SQL（予約クエリ）",
          "複数テーブル依存やテストあり＝Dataform、単発日次集計＝予約クエリ",
        ],
      },
      {
        feature: "Cloud Composer / Workflows / Cloud Scheduler / Eventarc",
        values: [
          "パイプライン統制・監視",
          "Airflow DAG（Composer）、軽量 API 連携（Workflows）、cron（Scheduler）、イベント駆動（Eventarc）＋ Cloud Monitoring / Cloud Logging",
          "複雑バッチ＝Composer、軽量 API＝Workflows、ファイル到着起動＝Eventarc",
        ],
      },
    ],
    decisionRule:
      "転送元と加工有無で取込手段を絞り込み、BigQuery 内 SQL 依存は Dataform、複数基盤を跨ぐ DAG 制御は Cloud Composer、ファイル到着即時実行は Eventarc を選びます。",
  },
];

export const adpPatterns: GcpArchitecturePattern[] = [
  {
    id: "adp-pat-1",
    title: "サーバーレス ELT モダンデータウェアハウス構成",
    badge: "Dataform + BigQuery",
    flow: [
      "Cloud Storage (Raw)",
      "BigQuery (bq load / DTS)",
      "Dataform (SQLX + アサーション)",
      "マテリアライズドビュー",
      "Looker / Looker Studio",
    ],
    summary:
      "生データをまず低コストにロードし、BigQuery 内で Dataform により依存関係管理・品質テスト付きで SQL 変換を行い、BI 層へ高速提供する ADP 王道パターン。",
    keyDesignPoints: [
      "Dataform の `${ref(...)}` とスケジュール実行により ELT の依存順序と日次更新を自動制御",
      "アサーションで NULL や重複を検知し、マテリアライズドビューと BI Engine で Looker / Looker Studio 表示を高速化",
    ],
  },
  {
    id: "adp-pat-2",
    title: "リアルタイム・イベント取り込み＆分析構成",
    badge: "Pub/Sub + Dataflow",
    flow: [
      "アプリ / IoT",
      "Pub/Sub (BigQuery Subscription / Dataflow)",
      "BigQuery (パーティショニング)",
      "BI Engine",
      "Looker Studio",
    ],
    summary:
      "リアルタイムイベントを Pub/Sub で受け取り、加工不要なら BigQuery サブスクリプションで直接、変換・集計が必要なら Dataflow を経由して BigQuery へ書き込む構成。",
    keyDesignPoints: [
      "単純なイベント記録であれば BigQuery Subscription を使うことで Dataflow の構築・運用コストを削減",
      "取り込み先テーブルは取り込み時刻やイベント日付でパーティショニングし、ダッシュボードのスキャンコストを抑制",
    ],
  },
  {
    id: "adp-pat-3",
    title: "イベント駆動ファイル自動ロード＆監視構成",
    badge: "Eventarc + Workflows",
    flow: [
      "Cloud Storage (ファイル到着)",
      "Eventarc",
      "Cloud Run functions / Workflows",
      "BigQuery (LOAD DATA) / Dataform",
      "Cloud Monitoring / Cloud Logging",
    ],
    summary:
      "Cloud Storage バケットへのファイルアップロードをトリガーに、常駐サーバーなしで自動的にデータ検証・BigQuery ロード・下流変換を起動する軽量パターン。",
    keyDesignPoints: [
      "Cloud Composer を常駐させるほどでもない単発ファイル連携を Workflows と Cloud Run functions でサーバーレス完結",
      "Cloud Logging でロード履歴を記録し、失敗時は Cloud Monitoring のアラートポリシーで即時通知",
    ],
  },
  {
    id: "adp-pat-4",
    title: "RDB 変更差分（CDC）同期＆予測分析構成",
    badge: "Datastream + BigQuery ML",
    flow: [
      "Cloud SQL / 外部 RDB",
      "Datastream (CDC)",
      "Cloud Storage / BigQuery",
      "BigQuery ML / Colab Enterprise",
    ],
    summary:
      "運用中のトランザクション DB に負荷をかけずに変更差分（CDC）を BigQuery へ継続同期し、最新データで SQL 機械学習や Python 探索分析を行う構成。",
    keyDesignPoints: [
      "夜間の全件バッチダンプを不要化し、ほぼリアルタイムな在庫・注文状況を分析・予測に活用",
      "SQL 主体の予測モデルは BigQuery ML、複雑な可視化や特徴量探索は Colab Enterprise で実行",
    ],
  },
  {
    id: "adp-pat-5",
    title: "機密データ保護＆全社ガバナンス統合構成",
    badge: "Cloud DLP + Dataplex",
    flow: [
      "Cloud Storage (Raw)",
      "Cloud DLP (PII マスキング)",
      "Dataplex (データ品質 / Data Catalog / Data Lineage)",
      "BigQuery (承認済みビュー / 列レベルセキュリティ / CMEK)",
    ],
    summary:
      "個人情報（PII）の検出・マスキングから、レイク横断のカタログ・リネージ・品質検証、そして列・ビュー単位の最小権限共有と鍵管理までを一貫して担保する構成。",
    keyDesignPoints: [
      "Cloud DLP（Sensitive Data Protection）で機密値をマスクし、Dataplex で Raw / Curated ゾーンのデータ品質を自動検証",
      "一般利用者には承認済みビューまたはポリシータグによる列レベルセキュリティを適用し、CMEK で鍵の自社管理を実現",
    ],
  },
  {
    id: "adp-pat-6",
    title: "大規模バッチ移行＆マルチ基盤オーケストレーション",
    badge: "Cloud Composer + Dataproc",
    flow: [
      "Storage Transfer Service / Transfer Appliance",
      "Cloud Storage (ライフサイクル管理 / Autoclass)",
      "Cloud Composer (Airflow DAG / Cloud Scheduler)",
      "Dataproc / Dataproc Serverless",
      "BigQuery (EXPORT DATA)",
    ],
    summary:
      "外部クラウドやオンプレミスからの大規模バッチ移行後、Cloud Composer と Dataproc を使って Spark バッチと BigQuery 集計・外部出力を統合スケジュールする構成。",
    keyDesignPoints: [
      "Dataproc の入出力は Cloud Storage に分離し、ジョブ完了後に削除するエフェメラル構成または Dataproc Serverless でコスト最適化",
      "保管データはライフサイクル管理または Autoclass で階層移行し、必要に応じて EXPORT DATA で他システム向けに書き出し",
    ],
  },
];

export const adpPitfalls: GcpPitfall[] = [
  {
    id: "adp-pit-1",
    trap: "BigQuery で `SELECT * ... LIMIT 10` を実行すればスキャン料金もほとんどかからないと思い込む",
    whyWrong:
      "BigQuery のオンデマンド課金は実際にスキャンされた列とパーティションの総バイト数で決まるため、`LIMIT` 句を付けても列指向の全列スキャンが発生して高額になることがあります（クラスタリングやパーティションでの絞り込みが必要です）。",
    correctApproach:
      "`SELECT *` を避けて必要な列だけを指定し、日付・数値でのパーティショニングおよびクラスタリングを併用する。さらに誤削除対策として Time Travel も把握しておく。",
  },
  {
    id: "adp-pit-2",
    trap: "テーブル間の依存関係が複雑な ELT パイプラインもすべて BigQuery 予約クエリの時間差実行だけで組む",
    whyWrong:
      "BigQuery 予約クエリ同士にはネイティブな依存解決やアサーション（品質テスト）、Git バージョン管理がなく、前段ジョブの遅延時に不整合データで後続が走ってしまいます。",
    correctApproach:
      "単発の独立クエリには BigQuery 予約クエリを使い、複数テーブルの依存関係（SQLX `${ref()}`）やデータ品質アサーション・Git 連携が必要な ELT には Dataform を採用する。",
  },
  {
    id: "adp-pit-3",
    trap: "コストを下げたい一心で頻繁にアクセスするデータやアクセスパターン不明なデータを Cloud Storage Archive に入れる",
    whyWrong:
      "Archive（最低保存期間 365 日）や Coldline（90 日）は保管単価が安い反面、取り出し料金と早期削除・移動の残日数課金が高いため、アクセスが少しでも発生すると Standard より割高になります。",
    correctApproach:
      "アクセス頻度に応じて適切なストレージクラスを選び、定期的な経過移動・削除はライフサイクル管理で設定する。アクセス頻度が読めない場合は Autoclass を有効化する。",
  },
  {
    id: "adp-pit-4",
    trap: "BigQuery の一部集計結果や一部列だけを他部署へ共有するために、データセット全体の Viewer ロールを付与する",
    whyWrong:
      "データセットやプロジェクトレベルの Viewer（基本ロール）を付与すると、元の詳細テーブルに含まれる個人情報や機密列まで丸見えになってしまいます。",
    correctApproach:
      "元テーブルへの権限なしで集計結果のみ公開するには承認済みビューを使い、同一テーブル内の特定列だけを隠すには列レベルセキュリティ（ポリシータグ）＋事前に Cloud DLP で PII マスキングを行う。",
  },
  {
    id: "adp-pit-5",
    trap: "加工やウィンドウ集計が不要な Pub/Sub → BigQuery 取り込みや軽量 API 連携にも毎回 Dataflow / Cloud Composer を構築する",
    whyWrong:
      "単純なイベント取り込みや軽量な 2〜3 ステップ連携に常駐クラスターやカスタム Beam パイプラインを構築すると、不要なコストと運用・保守負荷が増大します。",
    correctApproach:
      "変換不要のストリーミング書き込みには Pub/Sub の BigQuery Subscription を直接利用し、軽量 API 連携やイベント駆動処理は Workflows / Cloud Scheduler / Eventarc を使い分ける。",
  },
  {
    id: "adp-pit-6",
    trap: "BigQuery で誤って `DELETE` やテーブル上書きをした際、事前スナップショットが無いと絶対に復旧できないと思い込む（または数ヶ月前も戻せると思い込む）",
    whyWrong:
      "BigQuery は既定で過去 7 日間の Time Travel 履歴を保持しており直近の復旧が可能ですが、7 日を超えたデータは Time Travel では戻せません。",
    correctApproach:
      "7 日以内の誤操作復旧には Time Travel（`FOR SYSTEM_TIME AS OF`）を使い、長期保持や地域障害対策にはテーブルスナップショット、マルチリージョン構成、または Cloud Storage への EXPORT DATA を組み合わせる。",
  },
];

export const adpKeyFacts: GcpKeyFact[] = [
  {
    id: "adp-kf-1",
    target: "BigQuery コスト最適化",
    value: "列指定 + パーティショニング + クラスタリング",
    detail: "SELECT * や LIMIT のみの利用を避け、スキャン対象データ量を直接削減する",
  },
  {
    id: "adp-kf-2",
    target: "BigQuery Time Travel",
    value: "最大 7 日間（2〜7日で設定）",
    detail: "FOR SYSTEM_TIME AS OF で誤削除・誤更新したテーブル状態を即時照会・復旧可能",
  },
  {
    id: "adp-kf-3",
    target: "GCS 最低保存期間",
    value: "Nearline 30日 / Coldline 90日 / Archive 365日",
    detail: "頻度不明のバケットには Autoclass、経過日数ルールにはライフサイクル管理を使用",
  },
  {
    id: "adp-kf-4",
    target: "Dataform（SQLX）",
    value: "${ref()} 依存解決 + アサーション",
    detail: "BigQuery 内 ELT の品質検証とスケジュール実行・Git 管理を宣言的に自動化",
  },
  {
    id: "adp-kf-5",
    target: "ETL / ELT ツール選定",
    value: "Dataprep / Cloud Data Fusion / Dataflow vs Dataform",
    detail: "ノーコード整形は Dataprep、GUI 統合は Data Fusion、SQL ELT は Dataform",
  },
  {
    id: "adp-kf-6",
    target: "Pub/Sub 直接ロード",
    value: "BigQuery Subscription",
    detail: "変換不要のイベントストリームを Dataflow なしで直接 BigQuery テーブルへ書き込み",
  },
  {
    id: "adp-kf-7",
    target: "BigQuery きめ細かな保護",
    value: "承認済みビュー / 列レベルセキュリティ",
    detail: "元テーブル権限なし共有は承認済みビュー、機密列の制御はポリシータグを使用",
  },
  {
    id: "adp-kf-8",
    target: "暗号鍵管理（Cloud KMS）",
    value: "Google 管理鍵 vs CMEK",
    detail: "ローテーション周期や鍵失効によるアクセス遮断を自社制御する場合は CMEK を選択",
  },
  {
    id: "adp-kf-9",
    target: "BI・可視化ファミリ",
    value: "Looker (LookML) / Looker Studio / Connected Sheets",
    detail: "全社 KPI 統一は Looker、無料高速可視化は Looker Studio、BI Engine でサブ秒化",
  },
  {
    id: "adp-kf-10",
    target: "統合ガバナンス基盤",
    value: "Dataplex / Data Catalog / Data Lineage",
    detail: "GCS と BigQuery 横断のメタデータ検索、データ品質ルール検証、来歴追跡を実施",
  },
  {
    id: "adp-kf-11",
    target: "オーケストレーション＆監視",
    value: "Cloud Composer / Workflows / Cloud Scheduler / Eventarc",
    detail: "Cloud Monitoring と Cloud Logging でパイプライン実行異常・遅延を可視化通知",
  },
  {
    id: "adp-kf-12",
    target: "バッチ転送・CDC 移行",
    value: "Storage Transfer Service / Transfer Appliance / bq load / Datastream",
    detail: "オンライン転送は STS、物理移行は Appliance、SaaS は DTS、DB 変更同期は Datastream",
  },
];

export const adpQuickLookup: CertFlashcardItem[] = [
  {
    keyword: "Amazon S3 や HTTP エンドポイントから Cloud Storage へ大容量データをオンライン定期転送する",
    category: "データ転送",
    recommended: "Storage Transfer Service",
    reason: "他クラウドやオンプレミスから Cloud Storage へのスケジュール・増分オンライン転送を自動化できます。",
  },
  {
    keyword: "ネットワーク帯域が狭いオンプレミスから数十 TB〜PB のデータを物理機器配送で移行する",
    category: "データ転送",
    recommended: "Transfer Appliance",
    reason: "大容量データを専用アプライアンスに格納して配送することで、低帯域環境でも迅速に移行できます。",
  },
  {
    keyword: "Google 広告・GA4・SaaS や Cloud Storage から BigQuery へコードレスで定期ロードする",
    category: "取り込み",
    recommended: "BigQuery Data Transfer Service (DTS)",
    reason: "標準コネクタとスケジュール設定だけで BigQuery へのデータ取り込みを自動化できます。",
  },
  {
    keyword: "非エンジニアのアナリストがノーコード GUI で欠損値修正や表記揺れのクレンジングを行う",
    category: "データ準備",
    recommended: "Dataprep",
    reason: "ビジュアル画面でデータ品質を確認しながら変換レシピを作成し、裏側で Dataflow 実行できます。",
  },
  {
    keyword: "豊富な GUI コネクタを使ってオンプレ DB や複数システムからコードレス ETL 統合を行う",
    category: "データ準備",
    recommended: "Cloud Data Fusion",
    reason: "CDAP ベースの GUI により、コーディングなしで多様なデータソースをパイプライン統合できます。",
  },
  {
    keyword: "Cloud SQL や外部 RDB の INSERT / UPDATE / DELETE 差分をサーバーレス CDC で同期する",
    category: "ストリーミング / CDC",
    recommended: "Datastream",
    reason: "本番 RDB への負荷を抑えながら変更データキャプチャ（CDC）で BigQuery や GCS へ低遅延同期します。",
  },
  {
    keyword: "複雑な変換を伴わないリアルタイムイベントを Dataflow なしで直接 BigQuery へ書き込む",
    category: "ストリーミング",
    recommended: "Pub/Sub（BigQuery Subscription）",
    reason: "トピックのサブスクリプション設定だけで BigQuery テーブルへ直接ストリーミング書き込みできます。",
  },
  {
    keyword: "バッチ処理とストリーミング処理を単一の Apache Beam コードで実装するサーバーレス処理基盤",
    category: "ETL / 処理",
    recommended: "Dataflow",
    reason: "イベント時刻ベースのウィンドウ集計や複雑なストリーム変換をフルマネージドで自動スケール実行します。",
  },
  {
    keyword: "既存の Apache Spark / Hadoop スクリプトを最小改修・コスト最適（GCS 分離）で実行する",
    category: "ETL / 処理",
    recommended: "Dataproc / Dataproc Serverless",
    reason: "データを GCS に置くことでジョブ単位のエフェメラルクラスタやサーバーレス Spark 実行が可能です。",
  },
  {
    keyword: "画像・動画・生ログなどの非構造化データ保管やデータレイクのランディングゾーン",
    category: "ストレージ",
    recommended: "Cloud Storage",
    reason: "あらゆる形式・サイズのオブジェクトを高耐久性かつ低コストで無制限に格納できます。",
  },
  {
    keyword: "アクセス頻度が不規則で予測できない Cloud Storage バケットのクラスを自動最適化する",
    category: "ストレージ / コスト",
    recommended: "Autoclass",
    reason: "オブジェクトのアクセスパターンに応じて Standard〜Archive 間を自動で移行しコストを抑えます。",
  },
  {
    keyword: "Cloud Storage のファイルを 30 日後に Nearline へ移行し 365 日後に自動削除する機能",
    category: "ストレージ / コスト",
    recommended: "オブジェクト ライフサイクル管理",
    reason: "経過日数（Age）や条件に基づいてストレージクラス変更と削除を自動実行できます。",
  },
  {
    keyword: "グローバル規模で水平スケールし、強整合性と 99.999% 可用性が必要な分散リレーショナル DB",
    category: "データベース",
    recommended: "Cloud Spanner",
    reason: "ACID トランザクションとグローバル水平スケーラビリティを両立する唯一のマネージド RDB です。",
  },
  {
    keyword: "IoT センサーやアドテクの大量時系列データを 10ms 未満の超低レイテンシで書き込む NoSQL",
    category: "データベース",
    recommended: "Cloud Bigtable",
    reason: "ペタバイト級スケールと超高速な単一キー読み書き・レンジスキャンに最適化されています。",
  },
  {
    keyword: "BigQuery の巨大テーブルでスキャンバイト課金とクエリ実行時間を削減する物理設計 2 点",
    category: "BigQuery 最適化",
    recommended: "パーティショニング & クラスタリング",
    reason: "必要な区画とソート済みブロックのみを読み込むよう絞り込み、クエリコストを大幅削減します。",
  },
  {
    keyword: "ダッシュボードから同じ重い集計クエリが何度も実行される場合の自動事前計算機能",
    category: "BigQuery 最適化",
    recommended: "マテリアライズドビュー（+ BI Engine）",
    reason: "集計結果を事前保持し元テーブル更新時に自動差分リフレッシュすることで高速化・省コスト化します。",
  },
  {
    keyword: "BigQuery 内のデータを外部移動せず SQL だけで離反予測や需要予測モデルを構築・推論する",
    category: "機械学習",
    recommended: "BigQuery ML",
    reason: "`CREATE MODEL` や `ML.PREDICT` など標準 SQL のみで ML や Gemini リモートモデルを呼び出せます。",
  },
  {
    keyword: "BigQuery や Vertex AI と統合されたセキュアなマネージド Jupyter ノートブックで Python 分析する",
    category: "データ分析",
    recommended: "Colab Enterprise（BigQuery Studio）",
    reason: "IAM や VPC 境界の統制下で BigFrames 等を用いて大規模データを対話的に分析できます。",
  },
  {
    keyword: "LookML で全社共通の KPI 計算式を一元定義・Git 管理し指標の定義揺れを防ぐ BI プラットフォーム",
    category: "BI / 可視化",
    recommended: "Looker",
    reason: "ガバナンスの効いたセマンティックレイヤにより、全社で一貫した指標と組み込み分析を提供します。",
  },
  {
    keyword: "ビジネスユーザーが普段のスプレッドシート操作のまま数十億行の BigQuery データを直接集計する",
    category: "BI / 可視化",
    recommended: "Connected Sheets（および Looker Studio）",
    reason: "SQL を書かずにピボットテーブルや関数で BigQuery を集計でき、手軽な可視化には Looker Studio を使います。",
  },
  {
    keyword: "BigQuery 内の複数 SQL 変換を SQLX の依存関係管理・アサーション・Git 連携で実行する",
    category: "オーケストレーション",
    recommended: "Dataform",
    reason: "`${ref()}` による DAG 解決と品質テスト（アサーション）で信頼性の高い ELT を自動化します。",
  },
  {
    keyword: "Apache Airflow の Python DAG で GCP 内外を跨ぐ複雑なデータパイプラインを統合制御する",
    category: "オーケストレーション",
    recommended: "Cloud Composer",
    reason: "Dataproc・Dataflow・BigQuery・外部 API 間の複雑な依存とバックフィル・リトライを管理できます。",
  },
  {
    keyword: "BigQuery で元テーブル閲覧権限なしで集計結果だけ公開し、特定機密列も隠蔽するアクセス制御",
    category: "セキュリティ",
    recommended: "承認済みビュー & 列レベルセキュリティ（ポリシータグ）",
    reason: "用途に応じてビュー単位の共有と列単位のポリシータグ保護を組み合わせ、最小権限を実現します。",
  },
  {
    keyword: "PII 自動検出・マスキングと、GCS/BigQuery 横断のデータ品質・メタデータ検索・来歴追跡・誤削除復旧",
    category: "ガバナンス / 保護",
    recommended: "Cloud DLP / Dataplex（Data Catalog / Lineage）/ Time Travel",
    reason: "機密保護に Cloud DLP、横断統治に Dataplex、7日以内の誤削除復旧に Time Travel を使い分けます。",
  },
];

export const adpPracticeQuestions: CertQuestion[] = [
  {
    id: "adp-q1",
    domainId: "adp-domain-1",
    domainLabel: "01: データの準備と取り込み",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "他社クラウド（Amazon S3）のバケットに日々蓄積される数十 TB の生ログファイルを、スケジュールに沿って自動的かつオンラインで Cloud Storage バケットへ転送したいと考えています。最も適した Google Cloud サービスはどれですか？",
    options: [
      "BigQuery Data Transfer Service",
      "Storage Transfer Service",
      "Cloud Data Fusion",
      "Datastream",
    ],
    correctIndices: [1],
    explanation:
      "Amazon S3・Azure Blob Storage・HTTP/HTTPS・オンプレミス等から Cloud Storage へオンラインで定期または一括転送する標準サービスは Storage Transfer Service です。",
    keywords: ["Storage Transfer Service", "Cloud Storage", "S3 移行"],
  },
  {
    id: "adp-q2",
    domainId: "adp-domain-1",
    domainLabel: "01: データの準備と取り込み",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "マーケティング部門が Google 広告および Google アナリティクス 4 のレポートデータを、カスタムコードを書くことなく毎日決まった時刻に BigQuery へ自動取り込みしたいと考えています。最も運用負荷の低いサービスはどれですか？",
    options: [
      "BigQuery Data Transfer Service",
      "Dataproc",
      "Transfer Appliance",
      "Cloud Spanner",
    ],
    correctIndices: [0],
    explanation:
      "BigQuery Data Transfer Service（DTS）は Google 広告・GA4・YouTube・主要 SaaS 等から BigQuery への定期ロードをノーコードで自動化するマネージドサービスです。",
    keywords: ["BigQuery Data Transfer Service", "SaaS 連携", "自動ロード"],
  },
  {
    id: "adp-q3",
    domainId: "adp-domain-1",
    domainLabel: "01: データの準備と取り込み",
    difficulty: "標準",
    selectCount: 1,
    question:
      "EC サイトの本番稼働中の Cloud SQL（PostgreSQL）から、INSERT / UPDATE / DELETE の変更差分（CDC）を本稼働 DB に過剰な負荷をかけずにほぼリアルタイムで BigQuery へレプリケーションしたいと考えています。サーバーレスで実現できる最適なサービスはどれですか？",
    options: [
      "Datastream",
      "Dataprep",
      "Transfer Appliance",
      "Looker Studio",
    ],
    correctIndices: [0],
    explanation:
      "Datastream はサーバーレスの変更データキャプチャ（CDC）およびレプリケーションサービスであり、Cloud SQL / Oracle / MySQL / PostgreSQL 等の変更差分を低遅延で BigQuery や Cloud Storage へ同期できます。",
    keywords: ["Datastream", "CDC", "BigQuery 同期"],
  },
  {
    id: "adp-q4",
    domainId: "adp-domain-1",
    domainLabel: "01: データの準備と取り込み",
    difficulty: "標準",
    selectCount: 1,
    question:
      "SQL や Python に不慣れなビジネスアナリストが、BigQuery へロードする前の CSV データの欠損値分布・外れ値・表記揺れをブラウザ上のビジュアル画面で確認し、クリック操作でクレンジングルールを定義して定期変換を実行したいと考えています。最適なツールはどれですか？",
    options: [
      "Cloud Composer",
      "Dataprep",
      "Cloud Bigtable",
      "Cloud KMS",
    ],
    correctIndices: [1],
    explanation:
      "Dataprep はプログラミング不要のビジュアル UI でデータのプロファイリング・異常検知・クレンジングレシピの作成を行い、実行時は Dataflow 上でスケーラブルに変換処理を行えるサービスです。",
    keywords: ["Dataprep", "データクレンジング", "ノーコード"],
  },
  {
    id: "adp-q5",
    domainId: "adp-domain-1",
    domainLabel: "01: データの準備と取り込み",
    difficulty: "応用",
    selectCount: 2,
    question:
      "新規データプラットフォームを構築するにあたり、(A) 画像・動画・音声や未加工の JSON 生ファイルを長期保管するデータレイク領域、(B) 数百 TB の構造化・半構造化データに対して高速な SQL 集計を行うデータウェアハウス（OLAP）領域をそれぞれ用意します。適切なサービスを 2 つ選択してください。",
    options: [
      "(A) に Cloud Storage を採用し、データレイクのランディングゾーンとして利用する",
      "(B) にサーバーレス列指向データウェアハウスの BigQuery を採用する",
      "(A) に Cloud Spanner を採用して数 GB の動画ファイルを BLOB 格納する",
      "(B) に Cloud SQL を採用して 500 TB の全社ログ集計クエリを単一インスタンスで処理する",
    ],
    correctIndices: [0, 1],
    explanation:
      "非構造化データや Raw ファイルの保管・データレイク基盤には Cloud Storage、ペタバイト級の大規模 SQL 分析（OLAP）には BigQuery を選定するのが Google Cloud の標準アーキテクチャです。Cloud Spanner や Cloud SQL は OLTP（トランザクション処理）向けです。",
    keywords: ["Cloud Storage", "BigQuery", "データレイク", "DWH"],
  },
  {
    id: "adp-q6",
    domainId: "adp-domain-1",
    domainLabel: "01: データの準備と取り込み",
    difficulty: "標準",
    selectCount: 1,
    question:
      "モバイルアプリの行動ログイベントが Pub/Sub トピックへ毎秒数千件送信されています。イベントの内容を途中で複雑な加工やウィンドウ集計することなく、最小の運用・開発コストでそのまま BigQuery テーブルへリアルタイム書き込みしたいです。最適な構成はどれですか？",
    options: [
      "Pub/Sub の BigQuery サブスクリプション（BigQuery Subscription）を設定して直接テーブルへ書き込む",
      "Compute Engine VM を複数台立てて独自 Python コンシューマーを 24 時間常駐させる",
      "毎分 Cloud Storage へ 1 件ずつファイルを書き出し、Transfer Appliance で BigQuery へ送る",
      "Dataproc 常駐 Hadoop クラスタを起動して Pig スクリプトを常時回す",
    ],
    correctIndices: [0],
    explanation:
      "複雑な変換やウィンドウ集計が不要な場合、Pub/Sub の BigQuery サブスクリプションを使うことで Dataflow ジョブや VM を構築・管理せずに Pub/Sub から直接 BigQuery へストリーミング挿入できます。",
    keywords: ["Pub/Sub", "BigQuery Subscription", "ストリーミング"],
  },
  {
    id: "adp-q7",
    domainId: "adp-domain-2",
    domainLabel: "02: データの分析とプレゼンテーション",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "BigQuery に数年分・数十 TB の Web アクセスログテーブルがあります。アナリストが直近 7 日間の特定 3 列のみを集計するクエリを実行した際、オンデマンド課金のコストと実行時間を最も効果的に削減する設計・クエリ記述の組み合わせはどれですか？",
    options: [
      "日付列でパーティショニング（＋よく使うフィルタ列でクラスタリング）し、`SELECT *` を避けて必要な 3 列のみを `WHERE` 日付条件付きで指定する",
      "テーブル最適化は行わず、クエリの末尾に `LIMIT 100` を追加する",
      "すべての列を `SELECT *` で取得したうえでアプリ側で不要列を破棄する",
      "テーブルのストレージクラスを Cloud Storage Archive へ変更する",
    ],
    correctIndices: [0],
    explanation:
      "BigQuery は列指向ストレージかつスキャンバイト課金のため、`LIMIT` を付けてもスキャン量は減りません。パーティショニングとクラスタリングで対象区画を絞り、必要列のみを指定することでコストと時間を大幅に削減できます。",
    keywords: ["パーティショニング", "クラスタリング", "BigQuery コスト最適化"],
  },
  {
    id: "adp-q8",
    domainId: "adp-domain-2",
    domainLabel: "02: データの分析とプレゼンテーション",
    difficulty: "標準",
    selectCount: 1,
    question:
      "全社向けダッシュボードから、巨大な売上明細テーブルに対する「日別・店舗別の合計売上集計クエリ」が 1 日に何千回も実行されており、クエリコストと待ち時間が問題になっています。元テーブルに最新データが追加された際も自動追従しつつ、最小の手間で高速化・省コスト化できる BigQuery 機能はどれですか？",
    options: [
      "マテリアライズドビュー（Materialized View）",
      "Time Travel",
      "Storage Transfer Service",
      "Cloud Data Fusion",
    ],
    correctIndices: [0],
    explanation:
      "BigQuery のマテリアライズドビューは集計結果を事前計算して保持し、ベーステーブルの更新に応じてバックグラウンドで自動増分リフレッシュするため、繰り返し実行される集計クエリの応答速度とコストを劇的に改善します。",
    keywords: ["マテリアライズドビュー", "BigQuery", "集計高速化"],
  },
  {
    id: "adp-q9",
    domainId: "adp-domain-2",
    domainLabel: "02: データの分析とプレゼンテーション",
    difficulty: "標準",
    selectCount: 1,
    question:
      "SQL を主に扱うデータアナリストチームが、BigQuery に蓄積された顧客購買履歴テーブルを使って「来月の解約確率を予測する二値分類モデル」を構築・評価し、既存の SQL クエリパイプラインから推論結果を利用したいと考えています。データを外部へ移動せずに実現できる最も適切な機能はどれですか？",
    options: [
      "BigQuery ML（`CREATE MODEL` / `ML.PREDICT`）",
      "Dataproc 上でゼロから Java MapReduce を書く",
      "Cloud Storage のオブジェクト ライフサイクル管理",
      "Connected Sheets",
    ],
    correctIndices: [0],
    explanation:
      "BigQuery ML（BQML）を使うと、BigQuery からデータをエクスポートしたり Python コードを書いたりすることなく、標準 SQL だけで機械学習モデルの学習・評価・予測（`ML.PREDICT`）を完結できます。",
    keywords: ["BigQuery ML", "SQL 機械学習", "予測モデル"],
  },
  {
    id: "adp-q10",
    domainId: "adp-domain-2",
    domainLabel: "02: データの分析とプレゼンテーション",
    difficulty: "応用",
    selectCount: 2,
    question:
      "社内の BI・データ可視化基盤を整備するにあたり、(1) 全社で売上や粗利などの KPI 計算定義をコードとして一元管理・Git バージョン管理し、部門ごとの数値のズレを防ぎたい要件と、(2) 営業企画担当者が SQL を書かずに普段のスプレッドシート操作のまま BigQuery 上の数十億行を直接ピボット集計したい要件があります。適切な選択を 2 つ選んでください。",
    options: [
      "(1) には LookML によるセマンティックレイヤを備えた Looker を採用する",
      "(2) には Google スプレッドシートから BigQuery を直接集計できる Connected Sheets を採用する",
      "(1) には全テーブルを毎日 CSV ダウンロードしてローカル Excel で計算する運用を標準化する",
      "(2) には Pub/Sub サブスクリプションをスプレッドシートに直接接続する",
    ],
    correctIndices: [0, 1],
    explanation:
      "Looker は LookML でビジネス指標定義を一元管理・バージョン管理できるエンタープライズ BI です。また Connected Sheets を使うと、スプレッドシートの使い慣れた操作性のまま BigQuery の大規模データを直接分析できます。",
    keywords: ["Looker", "LookML", "Connected Sheets", "BI"],
  },
  {
    id: "adp-q11",
    domainId: "adp-domain-2",
    domainLabel: "02: データの分析とプレゼンテーション",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "BigQuery で集計・加工した分析結果テーブルを、外部パートナーが利用する Cloud Storage バケットへ列指向の Apache Parquet 形式で分割出力したいと考えています。SQL クエリ内から直接ファイル出力を実行できる標準ステートメントはどれですか？",
    options: [
      "`EXPORT DATA OPTIONS(uri=..., format='PARQUET') AS SELECT ...`",
      "`ALTER TABLE ... SET STORAGE CLASS PARQUET`",
      "`CREATE RESERVATION ... FORMAT PARQUET`",
      "`GRANT EXPORT ON TABLE ...`",
    ],
    correctIndices: [0],
    explanation:
      "BigQuery では `EXPORT DATA` SQL ステートメント（または `bq extract` コマンド）を使用することで、クエリ結果やテーブルを Parquet / Avro / CSV / JSON 形式で Cloud Storage へ直接エクスポートできます。",
    keywords: ["EXPORT DATA", "Parquet", "Cloud Storage"],
  },
  {
    id: "adp-q12",
    domainId: "adp-domain-3",
    domainLabel: "03: データ パイプラインのオーケストレーション",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "BigQuery 内に多数のステージングテーブル・中間集計テーブル・最終マートテーブルがあり、SQL による変換の依存関係管理、Git での変更履歴管理、さらに各ステップでの NULL や一意性の品質チェック（アサーション）を一元的に実装・スケジュール実行したいと考えています。最適なサービスはどれですか？",
    options: [
      "Dataform",
      "Storage Transfer Service",
      "Cloud KMS",
      "Looker Studio",
    ],
    correctIndices: [0],
    explanation:
      "Dataform は SQLX を用いてテーブル間の依存関係（`${ref()}`）を自動解決し、アサーションによるデータ品質テスト・Git 連携・定期実行を提供する BigQuery ELT 向けの標準オーケストレーションサービスです。",
    keywords: ["Dataform", "SQLX", "アサーション", "ELT"],
  },
  {
    id: "adp-q13",
    domainId: "adp-domain-3",
    domainLabel: "03: データ パイプラインのオーケストレーション",
    difficulty: "標準",
    selectCount: 1,
    question:
      "取引先から不定期に Cloud Storage バケットへ CSV ファイルがアップロードされます。ファイルが到着した直後にイベント駆動で軽量な検証と BigQuery ロードを起動したいと考えており、常駐のオーケストレーションクラスターは維持したくありません。最もシンプルな構成はどれですか？",
    options: [
      "Eventarc（GCS オブジェクト作成イベント）をトリガーにして Cloud Run functions または Workflows を起動する",
      "24 時間稼働の大型 Dataproc クラスタを立てて 1 秒ごとに `gsutil ls` をループ実行する",
      "毎日深夜に担当者が手動で Cloud Console からファイルをアップロードし直す",
      "Transfer Appliance を毎回発送する",
    ],
    correctIndices: [0],
    explanation:
      "Cloud Storage へのファイル作成イベントを Eventarc で検知し、Cloud Run functions や Workflows を起動することで、常駐インフラを持たない低コストなイベント駆動パイプラインを構築できます。",
    keywords: ["Eventarc", "Cloud Run functions", "Workflows", "イベント駆動"],
  },
  {
    id: "adp-q14",
    domainId: "adp-domain-3",
    domainLabel: "03: データ パイプラインのオーケストレーション",
    difficulty: "標準",
    selectCount: 2,
    question:
      "既存オンプレミスで運用していた Apache Spark バッチジョブと複数システムの夜間バッチ連携を Google Cloud へ移行し、コストと運用性を最適化したいと考えています。適切な設計アプローチを 2 つ選択してください。",
    options: [
      "Dataproc の入出力データを HDFS ではなく Cloud Storage に分離し、ジョブ実行時のみクラスタを起動して完了後削除するエフェメラル構成（または Dataproc Serverless）を採用する",
      "Dataproc・Dataflow・BigQuery・外部 API 等を跨ぐ複雑なバッチ依存関係と失敗時リトライを管理するため、Cloud Composer（マネージド Apache Airflow）を採用する",
      "Spark ジョブの一時データも永久に失われないよう、すべてのファイルを 24 時間常駐のローカル HDFS のみに保存する",
      "パイプラインの異常監視はコスト節約のため一切行わず、Cloud Monitoring と Cloud Logging を無効化する",
    ],
    correctIndices: [0, 1],
    explanation:
      "Dataproc は Cloud Storage と組み合わせることでエフェメラル実行（または Dataproc Serverless）による大幅なコスト削減が可能です。また複数基盤を跨ぐ複雑な DAG オーケストレーションには Cloud Composer が最適です。",
    keywords: ["Dataproc", "Cloud Composer", "エフェメラルクラスタ", "Airflow"],
  },
  {
    id: "adp-q15",
    domainId: "adp-domain-3",
    domainLabel: "03: データ パイプラインのオーケストレーション",
    difficulty: "応用",
    selectCount: 1,
    question:
      "他のパイプラインや外部システムとの依存関係がなく、単独の集計 SQL クエリ 1 本だけを毎日午前 4 時に実行して BigQuery のサマリーテーブルへ追記（または上書き）したいと考えています。追加のオーケストレーション基盤を構築せずに実現する最も手軽な機能はどれですか？",
    options: [
      "BigQuery 予約クエリ（Scheduled Queries）",
      "GKE Autopilot 上に独自 Airflow を構築",
      "Datastream",
      "Transfer Appliance",
    ],
    correctIndices: [0],
    explanation:
      "複雑な依存関係・テスト・Git 管理が不要な単発の定期 SQL 実行であれば、BigQuery コンソールや API から直接設定できる BigQuery 予約クエリ（Scheduled Queries）が最も軽量でシンプルです。",
    keywords: ["BigQuery 予約クエリ", "スケジュール実行", "KISS"],
  },
  {
    id: "adp-q16",
    domainId: "adp-domain-4",
    domainLabel: "04: データ管理",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "Cloud Storage バケットに保存しているアプリケーションログについて、作成から 30 日経過後に Nearline クラスへ、90 日経過後に Coldline クラスへ自動移行し、さらに 365 日経過後に自動削除してストレージコストを最適化したいと考えています。使用する機能はどれですか？",
    options: [
      "オブジェクト ライフサイクル管理（Object Lifecycle Management）",
      "BigQuery Time Travel",
      "Dataform アサーション",
      "Cloud Spanner",
    ],
    correctIndices: [0],
    explanation:
      "Cloud Storage のオブジェクト ライフサイクル管理を使うと、経過日数（Age）などの条件に基づいてストレージクラス変更（SetStorageClass）や削除（Delete）を自動実行できます。",
    keywords: ["ライフサイクル管理", "ストレージクラス", "Cloud Storage"],
  },
  {
    id: "adp-q17",
    domainId: "adp-domain-4",
    domainLabel: "04: データ管理",
    difficulty: "標準",
    selectCount: 1,
    question:
      "営業部門のアナリストに対し、個人識別情報を含む元の顧客明細テーブル（BigQuery）への直接アクセス権限は一切与えずに、都道府県別の売上合計だけを集計した特定ビューの閲覧権限のみを安全に付与したいと考えています。使用すべき BigQuery の機能はどれですか？",
    options: [
      "承認済みビュー（Authorized View）",
      "プロジェクトの Basic ロール（Owner）付与",
      "EXPORT DATA",
      "Cloud Scheduler",
    ],
    correctIndices: [0],
    explanation:
      "承認済みビュー（Authorized View）を使うと、閲覧ユーザーに対して元データセットや元テーブルのアクセス権限を付与することなく、別データセット上のビュー経由で定義済み集計結果のみを安全に公開できます。",
    keywords: ["承認済みビュー", "Cloud IAM", "最小権限"],
  },
  {
    id: "adp-q18",
    domainId: "adp-domain-4",
    domainLabel: "04: データ管理",
    difficulty: "応用",
    selectCount: 1,
    question:
      "全社分析用の BigQuery 顧客テーブルには一般分析用の列（購入日・カテゴリ等）と高機密列（マイナンバー・年収等）が混在しています。一般アナリストにはテーブル参照を許可しつつ機密列へのクエリだけを拒否し、さらに生データ取り込み段階でクレジットカード番号等の PII を自動検出・マスキングしたい場合、組み合わせるべき機能のペアはどれですか？",
    options: [
      "Data Catalog のポリシータグによる列レベルセキュリティ ＋ Sensitive Data Protection（Cloud DLP）",
      "Cloud Storage Autoclass ＋ BigQuery BI Engine",
      "BigQuery 予約クエリ ＋ Connected Sheets",
      "Transfer Appliance ＋ Cloud Composer",
    ],
    correctIndices: [0],
    explanation:
      "同一テーブル内で特定列へのアクセスだけを制限するには Data Catalog ポリシータグを用いた BigQuery 列レベルセキュリティを使い、PII の自動検出・マスキングには Sensitive Data Protection（Cloud DLP）を組み合わせます。",
    keywords: ["列レベルセキュリティ", "Cloud DLP", "ポリシータグ", "PII 保護"],
  },
  {
    id: "adp-q19",
    domainId: "adp-domain-4",
    domainLabel: "04: データ管理",
    difficulty: "標準",
    selectCount: 2,
    question:
      "Google Cloud 上のデータ保護と障害・誤操作からの復旧に関する正しい説明を 2 つ選択してください。",
    options: [
      "BigQuery では Time Travel 機能により、最大 7 日間（設定により 2〜7 日）の過去時点のテーブル状態を `FOR SYSTEM_TIME AS OF` で参照し、誤った DELETE や上書きから復旧できる",
      "保存データの暗号鍵のローテーションスケジュールや緊急時の鍵失効を自社側で制御したい要件がある場合は、Cloud KMS による顧客管理の暗号鍵（CMEK）を使用する",
      "BigQuery の Time Travel は過去 10 年分の全変更履歴を無制限に復元できる",
      "Google Cloud の Cloud Storage や BigQuery に保存されたデータは、CMEK を設定しない限り暗号化されず平文で保存される",
    ],
    correctIndices: [0, 1],
    explanation:
      "Google Cloud の保存データは既定で Google 管理鍵により常に暗号化されていますが、鍵ライフサイクルの自社管理が必要な場合は CMEK（Cloud KMS）を利用します。また BigQuery Time Travel の保持上限は 7 日間です。",
    keywords: ["Time Travel", "CMEK", "Cloud KMS", "データ復旧"],
  },
  {
    id: "adp-q20",
    domainId: "adp-domain-4",
    domainLabel: "04: データ管理",
    difficulty: "応用",
    selectCount: 1,
    question:
      "組織内の複数プロジェクトにわたり Cloud Storage と BigQuery にデータ資産が分散しています。これらを一つの統合データ基盤として管理し、全社でのメタデータ検索、自動データ品質ルール検証（欠損率チェック等）、そして『どの元テーブルから変換・生成されたか』のデータ来歴追跡を一元的に実施したい場合、中核となるサービスはどれですか？",
    options: [
      "Dataplex（Data Catalog / Data Lineage / データ品質）",
      "Looker Studio",
      "Cloud Run functions",
      "Storage Transfer Service",
    ],
    correctIndices: [0],
    explanation:
      "Dataplex は Cloud Storage と BigQuery に散在するデータを論理的なレイク／ゾーンで統合し、Data Catalog によるメタデータ検索、データ品質チェックの自動化、Data Lineage によるデータ来歴の自動追跡を一元的に提供します。",
    keywords: ["Dataplex", "Data Catalog", "Data Lineage", "データ品質"],
  },
];

export const adpOfficialResources: GcpOfficialResource[] = [
  {
    title: "Associate Data Practitioner 認定公式ページ",
    description:
      "試験概要、出題ドメイン、受験登録およびサンプル問題への公式案内を確認できます。",
    url: "https://cloud.google.com/learn/certification/data-practitioner?hl=ja",
    badge: "公式認定ページ",
  },
  {
    title: "Associate Data Practitioner 公式試験ガイド（日本語 PDF）",
    description:
      "4 つの出題ドメイン、配点割合、具体的なスキル要件の一次情報 PDF です。",
    url: "https://services.google.com/fh/files/misc/associate_data_practitioner_exam_guide_japanese.pdf",
    badge: "公式試験ガイド",
  },
  {
    title: "BigQuery 公式ドキュメント",
    description:
      "SQL 分析、データロード / EXPORT DATA、パーティショニング・クラスタリング、BigQuery ML の一次リファレンスです。",
    url: "https://docs.cloud.google.com/bigquery/docs?hl=ja",
    badge: "公式ドキュメント",
  },
  {
    title: "Dataform 公式ドキュメント",
    description:
      "SQLX による ELT パイプライン、依存関係定義、アサーション（品質テスト）、ワークフロー実行ガイドです。",
    url: "https://docs.cloud.google.com/dataform/docs?hl=ja",
    badge: "公式ドキュメント",
  },
  {
    title: "Knowledge Catalog（Dataplex）公式ドキュメント",
    description:
      "データレイク・ゾーン管理、メタデータ検索、データ品質検証、データリネージの公式リファレンスです。",
    url: "https://docs.cloud.google.com/knowledge-catalog/docs?hl=ja",
    badge: "公式ドキュメント",
  },
];
