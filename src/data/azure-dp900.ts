// 出典: Microsoft Learn Exam DP-900 公式試験ガイド (Study guide for Exam DP-900)
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

export const dp900ExamFacts: CertExamFact[] = [
  { label: "対象試験", value: "Exam DP-900", detail: "Azure Data Fundamentals・データ基礎" },
  { label: "試験時間", value: "45 分", detail: "着席目安 65 分・全体案内含む" },
  { label: "合格スコア", value: "700 / 1000", detail: "スケールスコア 100〜1000 点" },
  { label: "有効期限", value: "無期限（更新不要）", detail: "Fundamentals 資格は失効しない" },
  { label: "受験形式", value: "Pearson VUE", detail: "テストセンター / オンライン監督試験" },
  { label: "試験形式", value: "選択・分類問題", detail: "ドラッグ＆ドロップ・複数選択等" },
];

export const dp900Domains: AzureDomain[] = [
  {
    id: "dp900-domain-1",
    number: "01",
    title: "コアデータの概念",
    englishTitle: "Describe core data concepts",
    weight: "25〜30%",
    accentColor: "indigo",
    summary:
      "構造化・半構造化・非構造化データの形式とデータストア種別、バッチ処理とストリーミング処理、トランザクション（OLTP）と分析（OLAP）の違い、およびデータ専門ロール（DBA・Data Engineer・Data Analyst）の責務と主要ツールを理解します。",
    topics: [
      {
        id: "dp900-1-1",
        code: "1.1",
        title: "構造化 / 半構造化 / 非構造化データとデータストア種別",
        services: [
          "構造化データ (RDB / 表形式)",
          "半構造化データ (JSON / Avro / ORC / Parquet / XML)",
          "非構造化データ (画像 / 動画 / バイナリ)",
          "ファイルストレージ / データベース",
        ],
        keyPoints: [
          "構造化データは定義済みの固定スキーマ（行と列からなるテーブル構造）に従い、各列に厳密なデータ型が設定される（例：リレーショナルデータベースの顧客台帳や注文明細）",
          "半構造化データはテーブルのような固定表形式を持たないが、キーやタグ、区切り文字などの自己記述構造によって要素を識別できる（例：JSON・XML・YAML・Avro・ORC・Parquet）",
          "非構造化データは決まったスキーマや内部構造を持たないバイナリ／メディアデータであり、オブジェクトストレージや共有ファイルシステムに格納される（例：画像・音声・動画・PDF）",
          "データストアは大別してファイルストレージ（CSV・JSON・Parquet・画像などのファイル単位保存）とデータベース（レコードへの構造化クエリや索引アクセスを行う管理システム）に分かれる",
        ],
        examTip:
          "『JSON・XML・Parquet・Avro＝半構造化データ』『リレーショナル表＝構造化データ』『画像・音声・動画＝非構造化データ』の 3 分類は最頻出。Parquet や ORC は分析向け列指向ファイル形式として半構造化（自己記述スキーマ付きファイル）に分類される点に注意。",
      },
      {
        id: "dp900-1-2",
        code: "1.2",
        title: "バッチ処理 vs ストリーミング処理・トランザクション (OLTP) vs 分析 (OLAP)",
        services: [
          "OLTP (トランザクション処理)",
          "OLAP (分析処理)",
          "ACID 特性",
          "バッチ処理 / ストリーミング処理",
        ],
        keyPoints: [
          "OLTP（Online Transaction Processing）は日々の業務操作（注文登録・決済・在庫更新等）で多数の短い読み書きを高頻度かつ低遅延で処理し、ACID（原子性・一貫性・分離性・永続性）でデータ整合性を保証する",
          "OLAP（Online Analytical Processing）は大量の履歴データを集約・集計し、売上推移分析や BI レポート用に最適化された読み取り中心のシステム（データウェアハウス・データレイク等）を指す",
          "バッチ処理（Batch Processing）は一定時間や件数分のデータを蓄積してからスケジュール起動等によりまとめて一括変換・集計する方式で、高スループットだが結果反映まで遅延が生じる",
          "ストリーミング処理（Stream Processing）は IoT センサーやアプリログ等の連続イベントを受信した瞬間に低遅延で継続処理し、リアルタイム監視や即時アラートを実現する",
        ],
        examTip:
          "『即時決済や在庫の整合性（ACID）＝OLTP』『数年分の売上集計と傾向分析＝OLAP』『毎晩 0 時に 1 日分を一括集計＝バッチ』『センサー値異常を数秒以内に検知＝ストリーミング』。",
      },
      {
        id: "dp900-1-3",
        code: "1.3",
        title: "データ専門ロール（DBA・Data Engineer・Data Analyst）の責務とツール",
        services: [
          "Database Administrator (DBA)",
          "Data Engineer",
          "Data Analyst",
          "Azure Data Studio / Power BI / Purview",
        ],
        keyPoints: [
          "Database Administrator（DBA：データベース管理者）はデータベースの構築・バックアップと復元・高可用性構成・セキュリティ権限（RBAC やログイン管理）・クエリ／インデックスの性能最適化を担い、Azure portal・SQL Server Management Studio (SSMS)・Azure Data Studio・Azure CLI 等を使用する",
          "Data Engineer（データ エンジニア）は多様なデータソースからの取り込み、クレンジング・変換パイプライン（ETL/ELT）の構築、データレイクやデータウェアハウスの設計・運用を担い、Azure Data Factory・Azure Synapse Analytics・Azure Databricks・Microsoft Fabric 等を使用する",
          "Data Analyst（データ アナリスト）は整備されたデータモデルをもとに統計分析や傾向把握を行い、経営判断や業務改善に役立つレポート・ダッシュボードを構築する役割で、主に Microsoft Power BI や SQL クエリ、Microsoft Purview カタログ検索を活用する",
        ],
        examTip:
          "『権限・バックアップ・性能チューニング＝DBA』『パイプライン構築・データクレンジング・データレイク整備＝Data Engineer』『グラフ・ダッシュボード作成とビジネス指標の可視化＝Data Analyst』と責務で切り分ける。",
      },
    ],
  },
  {
    id: "dp900-domain-2",
    number: "02",
    title: "Azure のリレーショナル データ",
    englishTitle: "Identify considerations for relational data on Azure",
    weight: "20〜25%",
    accentColor: "cyan",
    summary:
      "正規化・主キー/外部キー・インデックス・ビューや DDL/DML/DCL といったリレーショナルの基本概念、Azure SQL ファミリーと PostgreSQL / MySQL のサービス種別、および IaaS と PaaS の管理責任の違いを学びます。",
    topics: [
      {
        id: "dp900-2-1",
        code: "2.1",
        title: "リレーショナル概念（正規化・主キー/外部キー・インデックス・ビュー・DDL/DML/SQL）",
        services: [
          "正規化 (Normalization)",
          "主キー / 外部キー",
          "インデックス / ビュー",
          "SQL (DDL / DML / DCL)",
        ],
        keyPoints: [
          "正規化（Normalization）は各エンティティを独立したテーブルに分割してデータ重複を排し、更新異常や不整合を防ぐ設計手法。テーブル間の結合は一意識別子である主キー（Primary Key）と関連先を参照する外部キー（Foreign Key）で行う",
          "インデックス（Index）は検索条件に使われる列の参照構造を保持して SELECT クエリの取得を高速化する（データ行自体を物理的に並べ替えるクラスター化インデックスと、別構造でポインタを持つ非クラスター化インデックスがある）",
          "ビュー（View）は保存された SELECT クエリに基づく仮想テーブルであり、複雑な結合の隠蔽や特定列のみの公開（アクセス制御）に役立つ。ストアドプロシージャは再利用可能な SQL 処理群をサーバー側で実行する仕組み",
          "SQL 文は用途別に 3 区分され、DDL（データ定義言語：CREATE / ALTER / DROP）は構造定義、DML（データ操作言語：SELECT / INSERT / UPDATE / DELETE）はデータ読み書き、DCL（データ制御言語：GRANT / REVOKE / DENY）は権限付与・剥奪を担う",
        ],
        examTip:
          "『テーブル作成・変更・削除（CREATE/ALTER/DROP）＝DDL』『行の検索・追加・更新・削除（SELECT/INSERT/UPDATE/DELETE）＝DML』『アクセス許可・剥奪（GRANT/REVOKE）＝DCL』。",
      },
      {
        id: "dp900-2-2",
        code: "2.2",
        title: "Azure のリレーショナル DB サービス（SQL ファミリー・PostgreSQL・MySQL）",
        services: [
          "SQL Server on Azure VM",
          "Azure SQL Managed Instance",
          "Azure SQL Database",
          "Azure Database for PostgreSQL / MySQL",
        ],
        keyPoints: [
          "SQL Server on Azure Virtual Machines は Azure VM 上で SQL Server を稼働させる IaaS であり、OS・SQL バージョン・ストレージ構成を完全に制御できるため、最小改修のリフト＆シフトや OS 依存アプリとの共存に適する",
          "Azure SQL Managed Instance はオンプレミス SQL Server との 100% に近い互換性とインスタンス単位機能（SQL Server Agent・クロスデータベースクエリ・ネイティブ VNet 分離）を備えたフルマネージド PaaS",
          "Azure SQL Database はクラウド向けに最適化されたフルマネージド PaaS（単一データベース / 複数 DB でリソース共有する Elastic Pool・サーバーレス・Hyperscale）であり、OS やインスタンス運用を最小化して最新 SQL 機能を提供する",
          "オープンソース RDBMS 向けには Azure Database for PostgreSQL（Flexible Server）および Azure Database for MySQL（Flexible Server）が PaaS として提供され、高可用性・自動バックアップ・パッチ適用を備える",
        ],
        examTip:
          "Azure SQL 3 形態の区別が超頻出：『OS まで制御したい＝SQL Server on Azure VM』『SQL Agent や複数 DB 跨ぎが必要で PaaS を使いたい＝SQL Managed Instance』『クラウド新規アプリで管理最小化・Elastic Pool/サーバーレス活用＝SQL Database』。",
      },
      {
        id: "dp900-2-3",
        code: "2.3",
        title: "リレーショナルワークロードのユースケースと管理責任比較（IaaS vs PaaS）",
        services: [
          "IaaS (SQL Server on VM)",
          "PaaS (SQL DB / SQL MI / OSS DB)",
          "サーバーレス / Elastic Pool",
          "自動バックアップ・パッチ・HA",
        ],
        keyPoints: [
          "IaaS（SQL Server on Azure VM）ではハードウェアと仮想化基盤は Microsoft が管理する一方、ゲスト OS のセキュリティパッチ、SQL Server 自体のバージョン更新、高可用性構成（Always On 可用性グループ等）は顧客側の責任となる",
          "PaaS（Azure SQL Database / SQL Managed Instance / PostgreSQL・MySQL Flexible Server）では OS と DBMS のパッチ適用・自動バックアップ・ポイントインタイムリストア・組み込み高可用性がサービスに統合され、顧客はデータ設計・クエリ最適化・アクセス権限管理に専念できる",
          "Elastic Pool は使用ピーク時間が異なる複数データベース間で CPU/メモリ（DTU または vCore）リソースを共有してコスト効率を高める仕組み。サーバーレス枠は非アクティブ時にコンピュートを自動一時停止してストレージ課金のみに抑える",
        ],
        examTip:
          "『利用時間帯がずれる多数の小規模 DB のコスト最適化＝Elastic Pool』『間欠的利用でアイドル時にコンピュート課金を止めたい＝Azure SQL Database サーバーレス』。",
      },
    ],
  },
  {
    id: "dp900-domain-3",
    number: "03",
    title: "Azure の非リレーショナル データ",
    englishTitle: "Describe considerations for working with non-relational data on Azure",
    weight: "15〜20%",
    accentColor: "emerald",
    summary:
      "Azure Blob Storage（ブロック/追加/ページ・アクセス層）・ADLS Gen2（階層型名前空間）・Azure Files・Azure Table の特性と、Azure Cosmos DB の 5 つのマルチモデル API および NoSQL データモデル選定基準を学びます。",
    topics: [
      {
        id: "dp900-3-1",
        code: "3.1",
        title: "Azure Storage（Blob 種別/層・ADLS Gen2 階層型名前空間・Files・Table）",
        services: [
          "Azure Blob Storage (Block / Append / Page)",
          "アクセス層 (Hot / Cool / Cold / Archive)",
          "Azure Data Lake Storage Gen2",
          "Azure Files / Azure Table Storage",
        ],
        keyPoints: [
          "Blob Storage には用途別の 3 種別がある：一般ファイルやメディアを保存する『ブロック BLOB（Block Blob）』、ログ等の末尾追記に最適化された『追加 BLOB（Append Blob）』、VM 仮想ディスク等のランダム読み書き向けの『ページ BLOB（Page Blob）』",
          "Blob アクセス層はアクセス頻度に応じてコスト最適化でき、Hot（頻繁アクセス）・Cool（最低 30 日・低頻度）・Cold（最低 90 日・超低頻度・オンライン即時読取）・Archive（最低 180 日・オフラインで読取に数時間のリハイドレートが必要）から選択する",
          "Azure Data Lake Storage Gen2（ADLS Gen2）は Blob Storage を基盤に『階層型名前空間（Hierarchical Namespace）』を有効化し、ディレクトリ構造・アトミックな移動/名前変更・POSIX 準拠 ACL を備えた大規模分析向けデータレイクを提供する",
          "Azure Files は SMB/NFS プロトコルで複数 VM やオンプレミスからマウント可能なマネージド共有ファイルシステム、Azure Table Storage はシンプルなキー／値（エンティティ）データを安価に保存する基本 NoSQL ストア",
        ],
        examTip:
          "『ADLS Gen2 を有効化するストレージ設定＝階層型名前空間（Hierarchical Namespace）』『ログの追記＝Append Blob』『VM ディスク VHD＝Page Blob』『数時間待ち許容の最安保管＝Archive 層』。",
      },
      {
        id: "dp900-3-2",
        code: "3.2",
        title: "Azure Cosmos DB のマルチモデル API（NoSQL・MongoDB・Cassandra・Gremlin・Table）",
        services: [
          "Azure Cosmos DB for NoSQL",
          "Azure Cosmos DB for MongoDB",
          "Azure Cosmos DB for Apache Cassandra",
          "Azure Cosmos DB for Apache Gremlin / Table",
        ],
        keyPoints: [
          "Azure Cosmos DB はグローバル分散・低遅延・高可用性 SLA を備えたフルマネージドマルチモデル NoSQL データベースであり、パーティションキーによる水平スケーリングとスループット単位 RU/s（要求ユニット/秒）で課金・性能制御を行う",
          "NoSQL 用 API（旧 SQL API）は JSON ドキュメントを SQL 風クエリで操作する標準 API、MongoDB 用 API は既存 MongoDB アプリのコードやドライバをほぼ変えずに BSON ドキュメントを扱える API",
          "Apache Cassandra 用 API は既存のワイド列（列ファミリ）ストレージ向けアプリケーション・CQL 互換ワークロードに適する",
          "Apache Gremlin 用 API は頂点（Vertex）と辺（Edge）でつながりを表現するグラフデータベース向け、Table 用 API は Azure Table Storage からの移行やグローバル分散・自動セカンダリインデックスが必要なキー/値アプリに適する",
        ],
        examTip:
          "Cosmos DB API の即答ルール：『JSON + SQL クエリの新規開発＝NoSQL』『既存 MongoDB 移行＝MongoDB』『列ファミリ/CQL＝Apache Cassandra』『頂点と辺の関係探索＝Apache Gremlin』『Azure Table Storage 拡張移行＝Table』。",
      },
      {
        id: "dp900-3-3",
        code: "3.3",
        title: "非リレーショナルデータ選定基準（ドキュメント・キーバリュー・列ファミリ・グラフ）",
        services: [
          "ドキュメント データベース",
          "キー / バリュー ストア",
          "列ファミリ (ワイド列) ストア",
          "グラフ データベース",
        ],
        keyPoints: [
          "ドキュメント データベース（Cosmos DB for NoSQL / MongoDB）は商品カタログ・ユーザープロファイル・注文伝票など、レコードごとに属性構造が柔軟に変化するネスト構造 JSON/BSON の読み書きに最適",
          "キー / バリュー ストア（Azure Table Storage / Cosmos DB for Table）は一意キーを指定した単純・高速な値取得（セッション情報・設定値・IoT 最新状態参照等）に適し、複雑な結合やアドホック集計は不得手",
          "列ファミリ（ワイド列）データベース（Cosmos DB for Apache Cassandra）は共通の行キーに対して行ごとに異なる大量の列を格納する疎（スパース）な表形式（テレメトリ・時系列ログ等）に強い",
          "グラフ データベース（Cosmos DB for Apache Gremlin）は SNS の友人関係、組織階層、不正送金ネットワーク、レコメンドエンジンなど『エンティティ間の多対多の関連トラバーサル』に最適",
        ],
        examTip:
          "『商品ごとに属性項目が異なる EC カタログ＝ドキュメント DB』『社員同士や顧客・商品間の複雑なつながり検索＝グラフ DB（Gremlin）』『キー指定の単純検索＝キーバリュー』。",
      },
    ],
  },
  {
    id: "dp900-domain-4",
    number: "04",
    title: "Azure の分析ワークロード",
    englishTitle: "Describe an analytics workload on Azure",
    weight: "25〜30%",
    accentColor: "amber",
    summary:
      "データ取り込みと ETL/ELT パターン、Azure Data Factory・Azure Synapse Analytics・Azure Databricks・Microsoft Fabric / OneLake の役割、リアルタイム分析基盤、および Microsoft Power BI による可視化を学びます。",
    topics: [
      {
        id: "dp900-4-1",
        code: "4.1",
        title: "データ取り込み・ELT/ETL と最新データウェアハウス（ADF・Synapse・Databricks・Fabric）",
        services: [
          "ETL / ELT パイプライン",
          "Azure Data Factory",
          "Azure Synapse Analytics",
          "Azure Databricks / Microsoft Fabric (OneLake)",
        ],
        keyPoints: [
          "ETL（抽出・変換・読み込み）は格納前のパイプライン段階で加工・機密マスキングを済ませて DWH へ保存する方式。ELT（抽出・読み込み・変換）はまずデータレイクへ生データを高速ロードし、分散エンジン（SQL/Spark）の計算力で柔軟に変換する最新クラウド主流の方式",
          "Azure Data Factory（ADF）はリンクされたサービス（接続情報）・データセット・アクティビティ・パイプラインおよびコードレスのマッピングデータフローで構成されるクラウドのデータ統合・オーケストレーションサービス",
          "Azure Synapse Analytics はデータレイクと大規模並列処理（MPP）データウェアハウス（専用 SQL プール・サーバーレス SQL プール）・Apache Spark プール・Synapse パイプライン・Data Explorer を統合した分析プラットフォーム",
          "Azure Databricks は Apache Spark と Delta Lake を中核にデータエンジニアリングや ML を協調実行する基盤。Microsoft Fabric は OneLake（単一 SaaS データレイク）を土台に Data Factory・Data Engineering・Data Warehouse・Real-Time Intelligence・Power BI を一体提供する",
        ],
        examTip:
          "『生データを先にデータレイクへ保存してから処理＝ELT』『データソース間コピーとオーケストレーションのノーコード構築＝Azure Data Factory』『Delta Lake ベースの Spark 協調開発＝Databricks』『OneLake 統合 SaaS 分析＝Microsoft Fabric』。",
      },
      {
        id: "dp900-4-2",
        code: "4.2",
        title: "リアルタイム分析（Azure Event Hubs・Azure Stream Analytics・Real-Time Intelligence）",
        services: [
          "Azure Event Hubs / IoT Hub",
          "Azure Stream Analytics",
          "ウィンドウ集計 (Tumbling / Hopping / Sliding)",
          "Microsoft Fabric Real-Time Intelligence",
        ],
        keyPoints: [
          "リアルタイム分析は通常『イベント取り込み（Ingestion）→ ストリーム処理（Processing）→ 出力先（Sink）』の 3 段階で構成され、毎秒数百万イベントを受信する Azure Event Hubs（またはデバイス双方向管理付きの Azure IoT Hub）が入口を担う",
          "Azure Stream Analytics は SQL ベースの宣言的クエリでストリームデータをリアルタイムにフィルタリング・結合・時間集計し、タンブリング（固定非重複）・ホッピング（重複あり定期移動）・スライディング（イベント発生駆動）・セッション・スナップショットのウィンドウ関数を備える",
          "処理されたストリーム結果はリアルタイム監視用の Power BI ストリーミングデータセットや、後続の長期保存・バッチ分析用として ADLS Gen2・Azure SQL Database・Cosmos DB へ直接書き出せる",
          "Microsoft Fabric の Real-Time Intelligence は Eventstream によるノーコードストリーム取込と Eventhouse（KQL データベース）による高速タイムシリーズ検索・リアルタイムダッシュボードを提供する",
        ],
        examTip:
          "『重複なしの 5 分間隔（0〜5分、5〜10分）＝タンブリング ウィンドウ』『重複しながら一定間隔で移動（直近 10 分を 5 分ごとに計算）＝ホッピング ウィンドウ』『イベント発火時のみ境界評価＝スライディング ウィンドウ』。",
      },
      {
        id: "dp900-4-3",
        code: "4.3",
        title: "BI とデータ可視化（Microsoft Power BI：データモデル・ダッシュボード・ページ分割レポート）",
        services: [
          "Power BI Desktop / Service",
          "スタースキーマ / セマンティックモデル",
          "レポート / ダッシュボード",
          "ページ分割レポート (Paginated Reports)",
        ],
        keyPoints: [
          "Power BI の標準フローでは Power BI Desktop でデータ取得・Power Query による整形・データモデリング・レポート作成を行い、クラウド上の Power BI サービスへ発行して組織内で共有・自動更新する",
          "分析用データモデルには数値集計対象の『ファクト テーブル』と切り口属性（日付・店舗・商品等）の『ディメンション テーブル』を結ぶスタースキーマが推奨され、発行されたデータモデルと計算指標（DAX メジャー）はセマンティックモデル（旧データセット）として管理される",
          "Power BI レポートは 1 つのセマンティックモデルに基づく複数ページの対話的分析ビュー。ダッシュボードは Power BI サービス上で複数のレポートやデータセットから主要ビジュアルを 1 枚の単一画面へピン留めした監視キャンバス",
          "ページ分割レポート（Paginated Reports）は複数ページにわたる表や請求書・明細一覧を余白・ヘッダー・改ページまで厳密に制御し、印刷や PDF/Excel エクスポートに最適化したピクセル単位の定型帳票",
        ],
        examTip:
          "『複数レポートの重要指標を 1 画面にまとめる＝ダッシュボード（Power BI サービスのみ作成可）』『全行を省略なく複数ページの PDF/印刷用帳票に出力＝ページ分割レポート』『中央にファクト・周囲にディメンション＝スタースキーマ』。",
      },
    ],
  },
];

export const dp900Comparisons: AzureComparisonTable[] = [
  {
    id: "dp900-comp-relational-services",
    category: "ストレージ・DB",
    title: "Azure リレーショナル データベース サービス比較（IaaS vs PaaS）",
    subtitle: "SQL Server 互換性・運用負荷・オープンソース対応に応じた選定基準",
    columns: ["サービス", "提供形態と管理範囲", "主な特徴・互換性", "適したユースケース"],
    rows: [
      {
        feature: "SQL Server on Azure VM",
        values: [
          "IaaS（OS・SQL パッチ・HA 構成は顧客管理）",
          "オンプレミスと完全な SQL / OS 互換性",
          "OS アクセスやレガシー設定をそのまま維持するリフト＆シフト",
        ],
      },
      {
        feature: "Azure SQL Managed Instance",
        values: [
          "PaaS（OS・パッチ・自動バックアップは Microsoft 管理）",
          "SQL Agent・クロス DB クエリ対応・VNet 分離",
          "インスタンス機能に依存する既存 SQL Server のクラウド移行",
        ],
      },
      {
        feature: "Azure SQL Database",
        values: [
          "PaaS（最小管理負荷・単一 DB / Elastic Pool）",
          "自動バックアップ・パッチ・HA・サーバーレス・Hyperscale 対応",
          "管理工数を最小化したいクラウドネイティブ業務アプリ",
        ],
      },
      {
        feature: "Azure Database for PostgreSQL / MySQL",
        values: [
          "PaaS（Flexible Server・HA / バックアップ統合）",
          "コミュニティ版 PostgreSQL / MySQL 互換",
          "オープンソース RDBMS ベースの Web アプリ・SaaS 基盤",
        ],
      },
    ],
    decisionRule:
      "OS 制御必須＝SQL Server on VM、SQL Agent 等が必要で PaaS＝SQL Managed Instance、新規クラウドアプリ＝SQL Database、OSS 互換＝PostgreSQL / MySQL。",
  },
  {
    id: "dp900-comp-nonrelational-stores",
    category: "ストレージ・DB",
    title: "Azure 非リレーショナル ストレージ ＆ Cosmos DB API 比較",
    subtitle: "ファイル／オブジェクト格納とマルチモデル NoSQL データモデルの使い分け",
    columns: ["サービス / API", "データモデル・構造", "代表的な特性", "最適なシナリオ"],
    rows: [
      {
        feature: "Azure Blob Storage (Block/Append/Page)",
        values: [
          "非構造化オブジェクト（ファイル・ログ・VHD）",
          "Hot / Cool(30日) / Cold(90日) / Archive(180日)",
          "画像・動画・バックアップ・追記ログ・VM 仮想ディスク格納",
        ],
      },
      {
        feature: "Azure Data Lake Storage Gen2",
        values: [
          "階層型名前空間付きオブジェクト（ディレクトリ/ファイル）",
          "POSIX 準拠 ACL・大容量分析向け高速操作",
          "Spark・Synapse・Databricks が読み書きするビッグデータ基盤",
        ],
      },
      {
        feature: "Azure Files",
        values: [
          "ファイルストレージ（SMB / NFS マネージド共有フォルダ）",
          "複数 VM・オンプレからの同時ネットワークマウント",
          "既存ファイルサーバー置換やリフト＆シフトアプリの設定共有",
        ],
      },
      {
        feature: "Azure Table Storage / Cosmos DB (Table)",
        values: [
          "キー / バリュー（スキーマレス エンティティ）",
          "Table Storage は単一安価、Cosmos DB はグローバル分散・副索引",
          "一意キーによる高速ルックアップ（セッション・構成・IoT 状態）",
        ],
      },
      {
        feature: "Azure Cosmos DB for NoSQL / Azure Cosmos DB for MongoDB",
        values: [
          "ドキュメント データベース（JSON / BSON）",
          "柔軟スキーマ・SQL 風クエリ (NoSQL) / Mongo ドライバ互換",
          "商品カタログ・顧客プロファイル・コンテンツ管理システム",
        ],
      },
      {
        feature: "Azure Cosmos DB for Apache Cassandra / Gremlin",
        values: [
          "列ファミリ (Cassandra) / グラフ データベース (Gremlin 頂点・辺)",
          "CQL 互換ワイド列格納 / 多対多のグラフ探索クエリ",
          "時系列テレメトリ (Cassandra) / 不正検知・SNS 関係分析 (Gremlin)",
        ],
      },
    ],
    decisionRule:
      "大規模分析ファイル＝ADLS Gen2、共有フォルダ＝Azure Files、低遅延マルチモデル NoSQL＝Cosmos DB（JSON は NoSQL、グラフは Gremlin、列ファミリは Cassandra）。",
  },
  {
    id: "dp900-comp-workloads-processing",
    category: "コンピュート",
    title: "データ処理ワークロード＆パイプライン方式比較",
    subtitle: "OLTP vs OLAP・バッチ vs ストリーミング・ETL vs ELT の判断軸",
    columns: ["分類 / アプローチ", "処理タイミング・対象", "データ構造・最適化方向", "典型的な利用場面"],
    rows: [
      {
        feature: "OLTP（トランザクション処理）",
        values: [
          "常時・高頻度の単一行読み書き（低遅延）",
          "高度に正規化されたテーブル・ACID 保証重視",
          "EC 注文処理・銀行振込・在庫引き当て・予約管理",
        ],
      },
      {
        feature: "OLAP（分析処理）",
        values: [
          "大量履歴データの複雑集計・多次元分析",
          "非正規化・スタースキーマ（ファクト＆ディメンション）",
          "年次売上トレンド分析・部門横断 BI レポーティング",
        ],
      },
      {
        feature: "バッチ処理 (Batch)",
        values: [
          "蓄積データを定期スケジュールで一括処理",
          "大量データスループット最大化（分〜時間単位遅延）",
          "夜間締め集計・月次請求データ生成・大規模履歴変換",
        ],
      },
      {
        feature: "ストリーミング処理 (Streaming)",
        values: [
          "発生イベントをミリ秒〜秒単位で連続処理",
          "時間窓（Tumbling/Hopping/Sliding）による逐次集計",
          "異常検知アラート・不正決済ブロック・ライブ計器監視",
        ],
      },
      {
        feature: "ETL（抽出 → 変換 → 読込）",
        values: [
          "ターゲット格納前の変換エンジンで加工・整形",
          "格納前に不要列や個人情報を除去して厳格統制",
          "規制要件で生データを DWH に残せない定型データ連携",
        ],
      },
      {
        feature: "ELT（抽出 → 読込 → 変換）",
        values: [
          "生データを先に Data Lake/DW へ格納後に分散変換",
          "元データを保持し用途別に何度でも再加工可能",
          "構造化・非構造化混在の最新クラウドレイクハウス分析",
        ],
      },
    ],
    decisionRule:
      "整合性のある業務更新＝OLTP、履歴集計＝OLAP、定期一括＝バッチ、即時検知＝ストリーミング、先行格納後変換＝ELT。",
  },
  {
    id: "dp900-comp-analytics-platforms",
    category: "コンピュート",
    title: "Azure データ統合・分析・リアルタイム処理基盤比較",
    subtitle: "Data Factory・Synapse・Databricks・Fabric・Event Hubs・Stream Analytics の使い分け",
    columns: ["Azure サービス", "中核エンジン・役割", "主な処理スタイル", "適した分析ワークロード"],
    rows: [
      {
        feature: "Azure Data Factory (ADF)",
        values: [
          "データ統合・オーケストレーション",
          "GUI パイプライン＋ノーコード変換（Data Flow）",
          "異種システム間の定期データコピー・ETL/ELT 制御",
        ],
      },
      {
        feature: "Azure Synapse Analytics",
        values: [
          "統合 SQL DWH ＋ Spark ＋ パイプライン",
          "サーバーレス/専用 SQL プールによる大規模並列クエリ",
          "エンタープライズ DWH 分析と Data Lake 横断 SQL 探索",
        ],
      },
      {
        feature: "Azure Databricks",
        values: [
          "Apache Spark ＋ Delta Lake 協調環境",
          "Python / Scala / SQL ノートブック分散処理",
          "大規模データエンジニアリング・高度な機械学習基盤",
        ],
      },
      {
        feature: "Microsoft Fabric (OneLake)",
        values: [
          "SaaS 型エンドツーエンド統合分析",
          "OneLake 上で Warehouse / Lakehouse / BI を共有",
          "データ統合から Power BI まで単一 SaaS 基盤で完結",
        ],
      },
      {
        feature: "Azure Event Hubs / Stream Analytics / Microsoft Fabric Real-Time Intelligence",
        values: [
          "高スループット受信 ＋ SQL ストリーム処理 / リアルタイム分析",
          "連続イベントストリームのウィンドウ集計（Tumbling / Hopping / Sliding）",
          "IoT センサーやクリックストリームの即時監視・Power BI 連携",
        ],
      },
    ],
    decisionRule:
      "オーケストレーション＝ADF、MPP 型 DWH＝Synapse、Spark/Delta ノートブック＝Databricks、統合 SaaS＝Fabric、リアルタイム集計＝Event Hubs＋Stream Analytics。",
  },
  {
    id: "dp900-comp-security-access",
    category: "ネットワーク・セキュリティ",
    title: "Azure データ基盤のアクセス制御・暗号化・閉域化比較",
    subtitle: "ID 認証・RBAC/ACL 認可・暗号化・ネットワーク分離の実装レイヤー",
    columns: ["保護レイヤー / 仕組み", "対象サービス例", "制御の仕組み", "試験で問われる重要ポイント"],
    rows: [
      {
        feature: "Microsoft Entra 認証 vs SQL 認証",
        values: [
          "Azure SQL Database / SQL MI / Synapse",
          "組織 ID・MFA 統合 (Entra) vs DB 固有アカウント",
          "一元管理と MFA 対応の観点から Microsoft Entra 認証が推奨",
        ],
      },
      {
        feature: "Azure RBAC vs POSIX ACL",
        values: [
          "Blob Storage / ADLS Gen2",
          "コンテナ単位の粗粒度 (RBAC) vs ディレクトリ・ファイル単位 (ACL)",
          "ADLS Gen2 の階層型名前空間でフォルダ単位の細粒度 ACL を実現",
        ],
      },
      {
        feature: "Private Endpoint / ファイアウォール",
        values: [
          "Azure SQL / Cosmos DB / Storage / Synapse",
          "VNet プライベート IP 割り当て vs 許可 IP 範囲制限",
          "インターネット非公開の完全閉域通信は Private Endpoint を使用",
        ],
      },
      {
        feature: "保存時暗号化 (TDE / SSE) ＋ 転送時 TLS",
        values: [
          "Azure SQL / Azure Storage / Cosmos DB",
          "ディスク保存データの自動暗号化 ＋ 通信経路の HTTPS/TLS",
          "Azure SQL の TDE や Storage の SSE は既定で有効化されている",
        ],
      },
    ],
    decisionRule:
      "フォルダ/ファイル単位の詳細権限＝ADLS Gen2 POSIX ACL、完全閉域接続＝Private Endpoint、保管データ保護＝TDE/SSE。",
  },
  {
    id: "dp900-comp-roles-bi-cost",
    category: "ガバナンス・監視・コスト",
    title: "データ専門ロール・ガバナンス・Power BI 成果物と課金軸比較",
    subtitle: "組織役割・Microsoft Purview・Power BI 出力形態・コスト設計の整理",
    columns: ["ロール / 機能領域", "主な責務・対象", "主要ツール・出力形態", "ガバナンス・コストの着眼点"],
    rows: [
      {
        feature: "Database Administrator (DBA)",
        values: [
          "DB 可用性・セキュリティ・バックアップ・性能最適化",
          "Azure portal / SSMS / Azure Data Studio / CLI",
          "SQL DTU/vCore やサーバーレス枠選定・インデックス最適化",
        ],
      },
      {
        feature: "Data Engineer",
        values: [
          "取り込みパイプライン・クレンジング・分析基盤構築",
          "Azure Data Factory / Synapse / Databricks / Fabric",
          "ELT による生データ再利用と Blob Cool/Cold/Archive 階層化",
        ],
      },
      {
        feature: "Data Analyst",
        values: [
          "データモデル整形・指標定義・業務可視化",
          "Microsoft Power BI (Power Query / DAX / スタースキーマ)",
          "セマンティックモデル共通化による集計定義の統一",
        ],
      },
      {
        feature: "Power BI レポート / ダッシュボード / ページ分割",
        values: [
          "詳細探索 (レポート) / 監視集約 (ダッシュボード) / 印刷帳票",
          "Power BI Desktop (レポート) / サービス (ダッシュボード)",
          "ダッシュボードは複数レポートから 1 画面へピン留め、ページ分割は PDF/印刷向け",
        ],
      },
      {
        feature: "Microsoft Purview",
        values: [
          "全社データ資産のスキャン・カタログ・系統追跡",
          "Microsoft Purview データマップ・データカタログ",
          "機密データ自動分類と分析データの出典（リネージ）可視化",
        ],
      },
    ],
    decisionRule:
      "運用保全＝DBA、パイプライン整備＝Data Engineer、可視化＝Data Analyst、資産カタログと系統＝Microsoft Purview。",
  },
];

export const dp900Patterns: AzureArchitecturePattern[] = [
  {
    id: "dp900-pat-1",
    title: "OLTP 業務データベースから夜間分析連携パターン",
    badge: "OLTP to OLAP",
    flow: [
      "業務 Web アプリ (OLTP)",
      "Azure SQL Database (高可用 PaaS)",
      "Azure Data Factory (バッチ抽出)",
      "分析用データウェアハウス (OLAP)",
    ],
    summary:
      "日々の業務更新を ACID 保証の Azure SQL Database で高速処理しつつ、重い集計クエリは Azure Data Factory で夜間にデータウェアハウスへ抽出して負荷分離する基本構成です。",
    keyDesignPoints: [
      "OLTP データベースへ直接大規模 BI クエリを投げないことで業務トランザクションの応答遅延を防止",
      "正規化された OLTP スキーマから分析向けスタースキーマへ変換して読み取り効率を最大化",
    ],
  },
  {
    id: "dp900-pat-2",
    title: "モダン データレイクハウス ＆ ELT 分析基盤",
    badge: "Modern Data Warehouse / ELT",
    flow: [
      "構造化 / 半構造化ソース",
      "Azure Data Factory / Fabric パイプライン",
      "ADLS Gen2 / OneLake (階層型格納)",
      "Synapse / Databricks → Power BI",
    ],
    summary:
      "多様な形式のデータをまず ADLS Gen2 や Microsoft Fabric OneLake へ生データのまま格納し、Spark や SQL の並列計算力でクレンジング・変換（ELT）を行う現代的な分析構成です。",
    keyDesignPoints: [
      "ADLS Gen2 の階層型名前空間と POSIX ACL によりフォルダ単位の高速移動と細粒度アクセス制御を実現",
      "Parquet / Delta Lake 形式の列指向フォーマットにより大容量スキャンとストレージ圧縮を両立",
    ],
  },
  {
    id: "dp900-pat-3",
    title: "IoT・クリックストリーム リアルタイム分析パイプライン",
    badge: "Real-Time Streaming",
    flow: [
      "センサー / アプリイベント発生",
      "Azure Event Hubs / IoT Hub",
      "Azure Stream Analytics (時間窓集計)",
      "Power BI リアルタイム可視化 / 長期保管",
    ],
    summary:
      "大量の連続イベントを Azure Event Hubs で取り込み、Azure Stream Analytics の SQL クエリ（Tumbling / Hopping 等の時間窓）で即時集計してライブ監視とストレージ保存を同時実行します。",
    keyDesignPoints: [
      "受信基盤とストリーム処理エンジンの分離により毎秒数百万イベント規模のスパイクを吸収",
      "異常検知アラート用の即時シンク（Power BI）と履歴学習用シンク（ADLS Gen2）へ同時出力可能",
    ],
  },
  {
    id: "dp900-pat-4",
    title: "グローバル分散マルチモデル NoSQL アプリ基盤",
    badge: "Non-Relational / Cosmos DB",
    flow: [
      "グローバル利用者リクエスト",
      "Azure Cosmos DB (マルチモデル API)",
      "パーティションキー水平分散 (RU/s)",
      "Change Feed 連携分析",
    ],
    summary:
      "スキーマが柔軟な JSON ドキュメントやグラフ・列ファミリデータを Azure Cosmos DB に格納し、パーティションキー設計と RU/s スケーリングで世界中のユーザーへ低遅延応答を返す構成です。",
    keyDesignPoints: [
      "既存アプリの資産を活かす MongoDB / Cassandra / Gremlin / Table API と標準 NoSQL API から最適選択",
      "ホットパーティションを避ける適切なパーティションキー選定により均一なスループット配分を確保",
    ],
  },
  {
    id: "dp900-pat-5",
    title: "オンプレミス SQL Server 段階移行と閉域保護構成",
    badge: "SQL Migration & Security",
    flow: [
      "オンプレミス SQL Server",
      "互換性・OS 制御要件評価",
      "SQL Server on VM / SQL Managed Instance",
      "Private Endpoint ＋ 自動バックアップ保護",
    ],
    summary:
      "既存システムの SQL Server Agent や OS 依存度に応じて SQL Server on Azure VM（IaaS）または Azure SQL Managed Instance（PaaS）を選び、Private Endpoint で閉域移行するパターンです。",
    keyDesignPoints: [
      "OS レベルの設定変更が不要であれば SQL Managed Instance を選ぶことでパッチ適用と HA 管理を削減",
      "Microsoft Entra 認証と TDE（保存時暗号化）・Private Endpoint を組み合わせてゼロトラスト保護を強化",
    ],
  },
  {
    id: "dp900-pat-6",
    title: "Microsoft Power BI エンタープライズ BI 配信基盤",
    badge: "BI & Data Visualization",
    flow: [
      "各種データソース (SQL / Lake / Parquet)",
      "Power Query 整形・スタースキーマ構築",
      "Power BI セマンティックモデル発行",
      "レポート・ダッシュボード・ページ分割配信",
    ],
    summary:
      "Power BI Desktop でデータ整形とスタースキーマのセマンティックモデルを構築し、Power BI サービス上で対話レポート・単一画面ダッシュボード・定型ページ分割レポートを目的に応じて配信する構成です。",
    keyDesignPoints: [
      "ファクトテーブルとディメンションテーブルを分けたスタースキーマ設計により DAX 計算と絞り込みを高速化",
      "経営 KPI 監視はダッシュボード、深掘り分析はレポート、明細の PDF/印刷出力はページ分割レポートと使い分け",
    ],
  },
];

export const dp900Pitfalls: AzurePitfall[] = [
  {
    id: "dp900-pit-1",
    trap: "JSON・XML・Parquet などのファイルを「テーブルではないから非構造化データ」と分類してしまう",
    whyWrong:
      "固定の行列スキーマを持たない点は非構造化と同じですが、キー名・タグ・埋め込みメタデータでフィールド構造を自己記述しているデータは「半構造化データ」に分類されます。",
    correctApproach:
      "リレーショナル表＝構造化、JSON / XML / Avro / ORC / Parquet＝半構造化、画像 / 音声 / 動画 / 生 PDF バイナリ＝非構造化と明確に区別する。",
  },
  {
    id: "dp900-pit-2",
    trap: "「Oracle や SQL Server の OLTP DB に直接 Power BI の全期間履歴集計を繋ぐのが一番シンプル」と考える",
    whyWrong:
      "OLTP データベースは正規化された多数の細かな更新トランザクション向けに最適化されており、全期間スキャンや大規模結合を繰り返すと本番業務の応答性能を大きく劣化させます。",
    correctApproach:
      "業務処理は OLTP（Azure SQL 等）、大規模集計と過去比較は Data Factory 等で OLAP 用データウェアハウス／Lakehouse（Synapse / Fabric）へ分離して実行する。",
  },
  {
    id: "dp900-pit-3",
    trap: "SQL Server Agent や複数データベース間のクロス DB クエリが必要な移行先として Azure SQL Database 単体を選んでしまう",
    whyWrong:
      "Azure SQL Database（単一 DB）はクラウド最適化の PaaS であり、SQL Server Agent やインスタンス単位のクロス DB クエリ（3 部分名参照）などのインスタンス機能には対応しません。",
    correctApproach:
      "SQL Agent や高互換なインスタンス機能を維持しつつ OS 管理を省きたい場合は Azure SQL Managed Instance、OS 制御まで必要なら SQL Server on Azure VM を選ぶ。",
  },
  {
    id: "dp900-pit-4",
    trap: "Blob Storage の追加（Append）BLOB やページ（Page）BLOB、および Archive アクセス層の即時読み取り可否を混同する",
    whyWrong:
      "ブロック BLOB は一般ファイル、追加 BLOB はログ等の追記専用、ページ BLOB は VM ディスク等のランダム R/W 専用です。また Archive 層はオフラインであり、直接ダウンロードはできません。",
    correctApproach:
      "即時にオンライン読み取りが必要だがアクセス頻度が低い長期保管には Cold 層（最低 90 日）等を選び、Archive 層（最低 180 日）は数時間のリハイドレート待ちを許容できる場合のみ使う。",
  },
  {
    id: "dp900-pit-5",
    trap: "グラフ構造のデータや列ファミリデータに対し、すべて Cosmos DB for NoSQL や Azure Table Storage で代用しようと考える",
    whyWrong:
      "Cosmos DB はマルチモデル基盤であり、多対多の関係探索を SQL 風の JSON クエリや単純なキーバリューで表現すると結合負荷や開発複雑度が跳ね上がります。",
    correctApproach:
      "頂点と辺の関係探索＝Gremlin API、ワイド列／CQL＝Apache Cassandra API、MongoDB 互換＝MongoDB API、グローバル KV＝Table API、JSON ドキュメント＝NoSQL API とモデルに合わせて選択する。",
  },
  {
    id: "dp900-pit-6",
    trap: "Power BI Desktop 上で「ダッシュボード」や「複数レポートのピン留め」を作成しようとする、または全明細印刷に通常レポートを使う",
    whyWrong:
      "Power BI ダッシュボードはクラウド上の Power BI サービス専用機能であり、Power BI Desktop ではレポート（複数ページ）のみ作成します。通常レポートのテーブルはスクロール前提で印刷時の全行改ページ制御に不向きです。",
    correctApproach:
      "Power BI Desktop で作成したレポートを発行後、Power BI サービス上で重要タイルをダッシュボードへピン留めし、請求書や全明細の定型印刷にはページ分割レポート（Paginated Reports）を使う。",
  },
];

export const dp900KeyFacts: AzureKeyFact[] = [
  {
    id: "dp900-kf-1",
    target: "Exam DP-900 合格基準",
    value: "700 / 1000 点（更新不要）",
    detail: "試験時間 45 分・100〜1000 のスケールスコアで判定され Fundamentals 資格は失効しない",
  },
  {
    id: "dp900-kf-2",
    target: "データの 3 分類",
    value: "構造化・半構造化・非構造化",
    detail: "RDB 表（構造化）、JSON/XML/Avro/ORC/Parquet（半構造化）、画像/動画/音声（非構造化）",
  },
  {
    id: "dp900-kf-3",
    target: "トランザクション ACID 特性",
    value: "原子性・一貫性・分離性・永続性",
    detail: "Atomicity / Consistency / Isolation / Durability により OLTP データの整合性を保証",
  },
  {
    id: "dp900-kf-4",
    target: "SQL 言語の 3 区分",
    value: "DDL / DML / DCL",
    detail: "定義＝CREATE・ALTER・DROP（DDL）、操作＝SELECT・INSERT・UPDATE・DELETE（DML）、権限＝GRANT・REVOKE（DCL）",
  },
  {
    id: "dp900-kf-5",
    target: "Azure SQL 3 形態の階層",
    value: "SQL VM (IaaS) / SQL MI / SQL DB",
    detail: "OS 制御は SQL on VM、高互換 PaaS（SQL Agent 等）は SQL MI、クラウド最適化 PaaS は SQL DB",
  },
  {
    id: "dp900-kf-6",
    target: "Blob Storage の 3 種別",
    value: "ブロック / 追加 (Append) / ページ (Page)",
    detail: "一般ファイルはブロック、ログ追記は追加、VM 仮想ディスクのランダム R/W はページ BLOB",
  },
  {
    id: "dp900-kf-7",
    target: "Blob アクセス層と最低期間",
    value: "Hot / Cool(30日) / Cold(90日) / Archive(180日)",
    detail: "Hot/Cool/Cold はオンライン即時読取可、Archive のみオフラインで読取時にリハイドレート必要",
  },
  {
    id: "dp900-kf-8",
    target: "ADLS Gen2 の中核機能",
    value: "階層型名前空間 (HNS) ＋ POSIX ACL",
    detail: "Blob Storage 上に真のディレクトリ構造とアトミック操作・ファイル単位権限を提供",
  },
  {
    id: "dp900-kf-9",
    target: "Azure Cosmos DB の 5 API",
    value: "NoSQL / MongoDB / Cassandra / Gremlin / Table",
    detail: "JSON、BSON、ワイド列、グラフ（頂点・辺）、キー/バリューのマルチモデルに対応",
  },
  {
    id: "dp900-kf-10",
    target: "Power BI データモデルと出力",
    value: "スタースキーマ ＋ 3 種の閲覧形態",
    detail: "ファクト＆ディメンション構造を基盤に、レポート・ダッシュボード・ページ分割レポートを提供",
  },
];

export const dp900QuickLookup: CertFlashcardItem[] = [
  {
    keyword: "JSON・XML・Parquet・Avro など自己記述タグやキーを持つが固定表形式ではないデータ",
    category: "コアデータ概念",
    recommended: "半構造化データ (Semi-structured data)",
    reason: "固定テーブルスキーマはないものの、タグやメタデータで構造を解析できます。",
  },
  {
    keyword: "ACID 特性を保証し、注文登録や決済など多数の短い読み書きを高頻度で処理する仕組み",
    category: "コアデータ概念",
    recommended: "OLTP（オンライン トランザクション処理）",
    reason: "正規化されたテーブル構造で日常業務データの整合性を維持します。",
  },
  {
    keyword: "数年分の履歴データを集約し、多次元集計やトレンド可視化に最適化された処理系",
    category: "コアデータ概念",
    recommended: "OLAP（オンライン 分析処理）",
    reason: "データウェアハウス等で大規模な読み取り・集計クエリを高速処理します。",
  },
  {
    keyword: "一定期間や件数分のデータを蓄積してからスケジュール実行でまとめて変換・集計する方式",
    category: "コアデータ概念",
    recommended: "バッチ処理 (Batch processing)",
    reason: "高スループット処理に優れ、日次・時間単位の集計ジョブに適します。",
  },
  {
    keyword: "データベースの権限管理・バックアップ・高可用性・インデックス最適化を担当するロール",
    category: "コアデータ概念",
    recommended: "Database Administrator (DBA)",
    reason: "Azure portal・SSMS・Azure Data Studio・CLI 等で DB 基盤を保守運用します。",
  },
  {
    keyword: "データ取り込みパイプライン・ETL/ELT 変換・データレイク基盤を構築・運用するロール",
    category: "コアデータ概念",
    recommended: "Data Engineer (データ エンジニア)",
    reason: "Data Factory・Synapse・Databricks・Microsoft Fabric 等で分析用データを整備します。",
  },
  {
    keyword: "テーブル内の重複を排除し、主キーと外部キーで参照整合性を保つリレーショナル設計手法",
    category: "リレーショナルデータ",
    recommended: "正規化 (Normalization)",
    reason: "更新異常を防ぎデータの一貫性を維持するためにテーブルを分割・関連付けます。",
  },
  {
    keyword: "テーブルデータの検索・挿入・更新・削除を行う SQL 命令区分（SELECT / INSERT / UPDATE / DELETE）",
    category: "リレーショナルデータ",
    recommended: "DML（データ操作言語）",
    reason: "テーブル構造ではなくテーブル内の行データを直接操作するステートメント群です。",
  },
  {
    keyword: "テーブルやビューの構造を定義・変更・削除する SQL 命令区分（CREATE / ALTER / DROP）",
    category: "リレーショナルデータ",
    recommended: "DDL（データ定義言語）",
    reason: "データベースオブジェクトの定義（スキーマ）自体を作成・変更・削除します。",
  },
  {
    keyword: "SQL Server 移行時に OS レベルの完全制御と独自ソフトウェア共存が必要な場合の選択肢",
    category: "リレーショナルデータ",
    recommended: "SQL Server on Azure Virtual Machines (IaaS)",
    reason: "OS と SQL Server インスタンス双方の設定自由度が最も高い展開形態です。",
  },
  {
    keyword: "SQL Server Agent やクロス DB クエリ互換が必要だが OS パッチ管理を省きたい PaaS",
    category: "リレーショナルデータ",
    recommended: "Azure SQL Managed Instance",
    reason: "オンプレミス SQL Server との高いインスタンス互換性と VNet 分離を備えた PaaS です。",
  },
  {
    keyword: "OS やインスタンス管理を最小化し、Elastic Pool やサーバーレス枠を活用できるクラウド DB",
    category: "リレーショナルデータ",
    recommended: "Azure SQL Database",
    reason: "モダンなクラウドネイティブアプリ向けに自動管理と柔軟なスケーリングを提供します。",
  },
  {
    keyword: "テキスト・画像・動画・バックアップファイルなどの一般非構造化データ向け Blob 種別",
    category: "非リレーショナルデータ",
    recommended: "ブロック BLOB (Block Blob)",
    reason: "個別ブロックの並列アップロードにより大容量ファイルの格納と配信を効率化します。",
  },
  {
    keyword: "監査ログやイベントデータの末尾への順次追記に最適化された Blob 種別",
    category: "非リレーショナルデータ",
    recommended: "追加 BLOB (Append Blob)",
    reason: "既存データの書き換えを行わず末尾にブロックを追加する処理に特化しています。",
  },
  {
    keyword: "Azure VM の仮想ハードディスク（VHD）などランダムアクセス読み書き用の Blob 種別",
    category: "非リレーショナルデータ",
    recommended: "ページ BLOB (Page Blob)",
    reason: "512 バイトページの集合として構成され、任意位置の頻繁な読み書きに適します。",
  },
  {
    keyword: "Azure Blob Storage 上で階層型名前空間と POSIX ACL を提供しビッグデータ分析を高速化する基盤",
    category: "非リレーショナルデータ",
    recommended: "Azure Data Lake Storage Gen2 (ADLS Gen2)",
    reason: "真のフォルダ構造によりディレクトリ名の高速変更やファイル単位権限管理を行えます。",
  },
  {
    keyword: "最低 180 日保存・保管単価最安で、読み取り前に数時間のリハイドレートが必要な Blob アクセス層",
    category: "非リレーショナルデータ",
    recommended: "Archive アクセス層",
    reason: "オフライン層であるため長期アーカイブ保管のコストを最小限に抑えられます。",
  },
  {
    keyword: "頂点（Vertex）と辺（Edge）によりエンティティ間の複雑な関係性を格納・探索する Cosmos DB API",
    category: "非リレーショナルデータ",
    recommended: "Azure Cosmos DB for Apache Gremlin",
    reason: "SNS のつながりや不正検知・レコメンド等のグラフデータ処理を高速実行できます。",
  },
  {
    keyword: "コード不要の GUI パイプラインで多様なソースからのデータ取込とワークフロー制御を行うサービス",
    category: "分析ワークロード",
    recommended: "Azure Data Factory (ADF)",
    reason: "パイプライン・アクティビティ・データフローを用いて ETL/ELT をオーケストレーションします。",
  },
  {
    keyword: "専用/サーバーレス SQL プール・Spark・パイプラインを統合したエンタープライズ分析プラットフォーム",
    category: "分析ワークロード",
    recommended: "Azure Synapse Analytics",
    reason: "大規模並列処理 (MPP) データウェアハウスとデータレイククエリを単一環境で提供します。",
  },
  {
    keyword: "Apache Spark と Delta Lake を中核にノートブックで協調データ処理・ML を行う統合分析基盤",
    category: "分析ワークロード",
    recommended: "Azure Databricks",
    reason: "Python/Scala/SQL/R による高速分散処理とレイクハウス構成の構築に強みを持ちます。",
  },
  {
    keyword: "OneLake を中核にデータエンジニアリング・DW・リアルタイム分析・Power BI を統合する SaaS 基盤",
    category: "分析ワークロード",
    recommended: "Microsoft Fabric",
    reason: "単一 SaaS 環境と共通フォーマット（Delta Parquet）でデータの重複コピーを削減します。",
  },
  {
    keyword: "毎秒数百万イベントを受信する基盤と SQL 時間窓クエリでリアルタイム集計する処理エンジンの組み合わせ",
    category: "分析ワークロード",
    recommended: "Azure Event Hubs ＋ Azure Stream Analytics",
    reason: "Tumbling や Hopping などのウィンドウ関数で連続ストリームを即時分析できます。",
  },
  {
    keyword: "Power BI サービス上で複数レポートの主要タイルを 1 枚の単一キャンバスへピン留めする監視画面",
    category: "分析ワークロード",
    recommended: "Power BI ダッシュボード",
    reason: "複数ソースの重要指標を 1 ページで俯瞰でき、タイルクリックで元レポートへ遷移できます。",
  },
];

export const dp900PracticeQuestions: CertQuestion[] = [
  {
    id: "dp900-q1",
    domainId: "dp900-domain-1",
    domainLabel: "01: コアデータの概念",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "IoT センサーから送信される JSON ファイルや、列指向分析フォーマットの Apache Parquet ファイルのように、固定されたテーブル（行・列）スキーマは持たないものの、キーや埋め込みメタデータで構造を識別できるデータはどれに分類されますか？",
    options: [
      "構造化データ（Structured data）",
      "半構造化データ（Semi-structured data）",
      "非構造化データ（Unstructured data）",
      "正規化リレーショナルデータ",
    ],
    correctIndices: [1],
    explanation:
      "JSON・XML・Avro・ORC・Parquet などは、RDB のような固定表形式ではないものの自己記述タグやキー／スキーマ情報を含むため「半構造化データ」に分類されます。",
    keywords: ["半構造化データ", "JSON", "Parquet"],
  },
  {
    id: "dp900-q2",
    domainId: "dp900-domain-1",
    domainLabel: "01: コアデータの概念",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "オンラインショッピングサイトの決済システムにおいて、在庫引当・注文確定・決済記録の一連の処理を「すべて成功するか、失敗時はすべてロールバックして不整合を残さない」形で高頻度に処理したい場合、求められるシステム種別と整合性モデルの組み合わせはどれですか？",
    options: [
      "OLAP システムとバッチ集計処理",
      "非構造化データレイクと Append Blob",
      "OLTP システムと ACID 特性（原子性・一貫性・分離性・永続性）",
      "ページ分割レポートと Power Query",
    ],
    correctIndices: [2],
    explanation:
      "日々の業務トランザクションを整合性を保ちながら高速に読み書きするシステムは OLTP（Online Transaction Processing）であり、ACID 特性によって信頼性と一貫性が保証されます。",
    keywords: ["OLTP", "ACID 特性", "トランザクション"],
  },
  {
    id: "dp900-q3",
    domainId: "dp900-domain-1",
    domainLabel: "01: コアデータの概念",
    difficulty: "標準",
    selectCount: 1,
    question:
      "データ活用基盤を運用するにあたり、「多様なソースからのデータ取り込み、クレンジング・変換（ETL/ELT）パイプラインの構築、およびデータレイクやデータウェアハウス基盤の整備」を主担当とするロールはどれですか？",
    options: [
      "Database Administrator（データベース管理者）",
      "Data Engineer（データ エンジニア）",
      "Data Analyst（データ アナリスト）",
      "ネットワーク運用監視担当",
    ],
    correctIndices: [1],
    explanation:
      "Data Engineer はパイプライン（ADF 等）や分析ストレージ基盤（Synapse / Databricks / Fabric）を構築し、分析可能な状態へデータを統合・整備する役割を担います。DB の権限やバックアップ運用は DBA、BI レポート作成による業務洞察は Data Analyst の役割です。",
    keywords: ["Data Engineer", "データロール", "ETL/ELT"],
  },
  {
    id: "dp900-q4",
    domainId: "dp900-domain-1",
    domainLabel: "01: コアデータの概念",
    difficulty: "標準",
    selectCount: 2,
    question:
      "バッチ処理（Batch processing）とストリーミング処理（Stream processing）の比較について、正しい説明を 2 つ選択してください。",
    options: [
      "バッチ処理は一定期間分のデータを蓄積してからまとめて処理するため、大量データの一括変換に適するが、イベント発生から結果反映までに遅延がある",
      "ストリーミング処理では過去 1 年分の履歴ファイルを夜間一括で圧縮・集計する用途にのみ利用できる",
      "ストリーミング処理はイベントが発生するたびに連続してデータを取り込み処理するため、リアルタイム監視や即時アラートに適している",
      "バッチ処理は常にミリ秒単位の即時応答を返すため、オンライン決済のリアルタイム承認に必須である",
    ],
    correctIndices: [0, 2],
    explanation:
      "バッチ処理は蓄積データの一括処理（高スループット・一定遅延あり）、ストリーミング処理は到着イベントの逐次・低遅延処理（リアルタイム分析）を担います。",
    keywords: ["バッチ処理", "ストリーミング処理", "データ処理"],
  },
  {
    id: "dp900-q5",
    domainId: "dp900-domain-1",
    domainLabel: "01: コアデータの概念",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "Database Administrator（DBA）が Azure 上のリレーショナルデータベースの運用管理・クエリ実行・バックアップ設定・権限付与を行う際に主に使用するツールの組み合わせとして適切なものはどれですか？",
    options: [
      "Power BI ページ分割レポート ビルダーのみ",
      "Azure AI Custom Vision と Azure AI Face",
      "Azure Event Hubs のパーティションキー単体",
      "Azure portal・SQL Server Management Studio (SSMS)・Azure Data Studio・Azure CLI",
    ],
    correctIndices: [3],
    explanation:
      "DBA は Azure portal や Azure CLI でのリソース構成管理に加え、SSMS やクロスプラットフォームの Azure Data Studio を用いてデータベースの保守・監視・クエリ実行を行います。",
    keywords: ["DBA", "Azure Data Studio", "SSMS"],
  },
  {
    id: "dp900-q6",
    domainId: "dp900-domain-2",
    domainLabel: "02: Azure のリレーショナル データ",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "リレーショナルデータベースにおいて、テーブルの構造（定義）を新規作成・変更・削除するために使用する DDL（データ定義言語：Data Definition Language）の SQL ステートメントだけで構成されている組み合わせはどれですか？",
    options: [
      "SELECT・INSERT・UPDATE・DELETE",
      "CREATE・ALTER・DROP",
      "GRANT・REVOKE・DENY",
      "JOIN・GROUP BY・ORDER BY",
    ],
    correctIndices: [1],
    explanation:
      "CREATE / ALTER / DROP はテーブルやビューなどの定義を操作する DDL です。SELECT / INSERT / UPDATE / DELETE は DML（データ操作言語）、GRANT / REVOKE / DENY は DCL（データ制御言語）に該当します。",
    keywords: ["DDL", "SQL", "CREATE ALTER DROP"],
  },
  {
    id: "dp900-q7",
    domainId: "dp900-domain-2",
    domainLabel: "02: Azure のリレーショナル データ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "リレーショナルデータベースにおける「インデックス（Index）」と「ビュー（View）」の役割に関する説明として正しいものはどれですか？",
    options: [
      "インデックスを作成するとデータの読み取り速度が低下し、ビューを作成するとデータベースの全データが物理的に 2 倍に複製される",
      "主キーを定義したテーブルには外部キーやインデックスを一切作成できない",
      "インデックスは特定列の参照構造を保持して検索クエリ（SELECT）を高速化し、ビューは保存されたクエリを仮想テーブルとして見せることで複雑な結合の隠蔽や参照列の制限に役立つ",
      "ビューは画像や動画などの非構造化データのみを保存するためのバイナリコンテナである",
    ],
    correctIndices: [2],
    explanation:
      "インデックスは検索の高速化に寄与し（ただし書き込み時は索引更新コストが若干発生）、ビューは標準ではデータ実体を複製せず SELECT クエリ定義を保持する仮想テーブルです。",
    keywords: ["インデックス", "ビュー", "リレーショナル概念"],
  },
  {
    id: "dp900-q8",
    domainId: "dp900-domain-2",
    domainLabel: "02: Azure のリレーショナル データ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "オンプレミスで稼働中の SQL Server データベースを Azure へ移行する際、OS のパッチ適用やバックアップ管理などの基盤運用は Microsoft に任せつつ（PaaS）、『SQL Server Agent によるジョブ実行』や『複数データベースを跨いだクエリ』といったインスタンスレベル機能を維持したい場合、最適なサービスはどれですか？",
    options: [
      "Azure SQL Database（単一データベース）",
      "Azure SQL Managed Instance",
      "SQL Server on Azure Virtual Machines（IaaS）",
      "Azure Table Storage",
    ],
    correctIndices: [1],
    explanation:
      "Azure SQL Managed Instance はほぼ 100% の SQL Server 互換性（SQL Server Agent・クロス DB クエリ・VNet ネイティブ統合）を備えながら、OS やパッチ管理を自動化するフルマネージド PaaS です。",
    keywords: ["Azure SQL Managed Instance", "SQL Server Agent", "PaaS"],
  },
  {
    id: "dp900-q9",
    domainId: "dp900-domain-2",
    domainLabel: "02: Azure のリレーショナル データ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "多数のアプリやテナントごとに専用の Azure SQL Database を用意する必要がありますが、各データベースの利用ピーク時間帯が異なっており、個別に最大リソースを割り当てるとコストが高くなります。共有リソースプール内で各 DB が必要な分を融通し合いコストを最適化する構成はどれですか？",
    options: [
      "SQL Server on Azure VM の単一固定インスタンス",
      "Blob Archive アクセス層",
      "Azure Stream Analytics タンブリングウィンドウ",
      "Azure SQL Elastic Pool（エラスティック プール）",
    ],
    correctIndices: [3],
    explanation:
      "Azure SQL Elastic Pool を利用すると、使用パターンが予測困難またはピーク時間帯がずれる複数の単一データベース間で DTU / vCore リソースを共有でき、過剰プロビジョニングを削減できます。",
    keywords: ["Elastic Pool", "Azure SQL Database", "コスト最適化"],
  },
  {
    id: "dp900-q10",
    domainId: "dp900-domain-2",
    domainLabel: "02: Azure のリレーショナル データ",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Azure におけるリレーショナルデータベースサービスの選定と IaaS / PaaS の責任分担について、正しい記述を 2 つ選択してください。",
    options: [
      "Azure SQL Database（PaaS）を利用する場合、顧客が仮想マシンの OS カーネルパッチを手動で毎月適用する必要がある",
      "SQL Server on Azure Virtual Machines（IaaS）では、ゲスト OS のセキュリティ更新や SQL Server 自体のパッチ適用・構成管理の責任は顧客側に残る",
      "正規化を行うと同一テーブルに同じ顧客住所や商品名を意図的に何重にも重複コピーして保存できるようになる",
      "Azure Database for PostgreSQL（Flexible Server）および Azure Database for MySQL（Flexible Server）は、自動バックアップやパッチ適用を備えたマネージド PaaS として提供される",
    ],
    correctIndices: [1, 3],
    explanation:
      "IaaS の SQL Server on VM は OS 制御の自由度が高い反面 OS/SQL の保守責任が顧客に残ります。PaaS の Azure SQL や PostgreSQL/MySQL Flexible Server は OS/DB パッチやバックアップを Microsoft が管理します。正規化はデータ重複の排除と整合性維持を目的とします。",
    keywords: ["IaaS vs PaaS", "PostgreSQL", "MySQL", "SQL Server on VM"],
  },
  {
    id: "dp900-q11",
    domainId: "dp900-domain-3",
    domainLabel: "03: Azure の非リレーショナル データ",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "Azure Blob Storage において、多数のサーバーやアプリケーションから生成される監査ログ・イベントログを「既存内容を書き換えずにファイル末尾へ連続して追記（Append）」する用途に最適化された Blob の種類はどれですか？",
    options: [
      "ブロック BLOB（Block Blob）",
      "追加 BLOB（Append Blob）",
      "ページ BLOB（Page Blob）",
      "SMB 共有ファイル（Azure Files）",
    ],
    correctIndices: [1],
    explanation:
      "追加 BLOB（Append Blob）はブロックの末尾への追加操作に特化しており、ログ記録に最適です。ブロック BLOB は一般ファイル・メディア向け、ページ BLOB は VM 仮想ディスク（VHD）等のランダム読み書き向けです。",
    keywords: ["Append Blob", "Blob Storage", "ログ追記"],
  },
  {
    id: "dp900-q12",
    domainId: "dp900-domain-3",
    domainLabel: "03: Azure の非リレーショナル データ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "ビッグデータ分析向けに Azure Storage アカウントを作成し、ディレクトリ階層の作成・フォルダ単位の原子的な名前変更・ファイル/ディレクトリ単位の POSIX 準拠アクセス制御（ACL）を有効にして Azure Data Lake Storage Gen2（ADLS Gen2）として利用するために、アカウント作成時に有効化すべき機能はどれですか？",
    options: [
      "階層型名前空間（Hierarchical Namespace）",
      "Azure SQL Elastic Pool",
      "静的 Web サイトホスティングのみ",
      "Apache Gremlin グラフ API",
    ],
    correctIndices: [0],
    explanation:
      "Azure Data Lake Storage Gen2 は Azure Blob Storage を基盤として「階層型名前空間（Hierarchical Namespace）」を有効化することで、仮想ディレクトリではなく真の階層ディレクトリ構造と POSIX ACL・高速なリネーム/削除を実現します。",
    keywords: ["ADLS Gen2", "階層型名前空間", "POSIX ACL"],
  },
  {
    id: "dp900-q13",
    domainId: "dp900-domain-3",
    domainLabel: "03: Azure の非リレーショナル データ",
    difficulty: "標準",
    selectCount: 1,
    question:
      "法規制対応のためログデータを 5 年間保管する必要がありますが、普段はほとんどアクセスしないものの「監査担当者から照会があった瞬間にリハイドレート待ち時間なしで即座にオンラインダウンロードできる状態」を維持しつつ保管コストを抑えたい場合、適した Blob アクセス層はどれですか？",
    options: [
      "Hot アクセス層",
      "Archive アクセス層（最低 180 日・オフライン）",
      "ページ BLOB 専用プレミアム層",
      "Cold アクセス層（最低 90 日・オンライン即時読取可）",
    ],
    correctIndices: [3],
    explanation:
      "Archive 層は最も保管単価が安いもののオフライン層であるため、読み取り前に数時間のリハイドレートが必要です。オンラインのまま即時アクセスを維持しつつ超低頻度データを安価に長期保管するには Cold 層（最低 90 日）または Cool 層（最低 30 日）を選びます。",
    keywords: ["Cold 層", "Archive 層", "リハイドレート"],
  },
  {
    id: "dp900-q14",
    domainId: "dp900-domain-3",
    domainLabel: "03: Azure の非リレーショナル データ",
    difficulty: "標準",
    selectCount: 2,
    question:
      "Azure Cosmos DB のマルチモデル API および非リレーショナルデータモデルの選定について、正しい組み合わせを 2 つ選択してください。",
    options: [
      "SNS ユーザー同士のつながりやレコメンド・不正送金ネットワークのように「頂点（Vertex）と辺（Edge）」の複雑な関係性を探索する場合は『Azure Cosmos DB for Apache Gremlin』を選ぶ",
      "JSON ドキュメントを SQL 風の構文で柔軟に検索・操作したい場合は必ず『Azure Files (SMB)』を選ぶ必要がある",
      "既存の Apache Cassandra ベースのワイド列（列ファミリ）アプリケーションと CQL クエリ資産を移行する場合は『Azure Cosmos DB for Apache Cassandra』を選ぶ",
      "Azure Cosmos DB は単一リージョン専用であり、グローバル分散レプリケーションや低遅延 SLA には対応していない",
    ],
    correctIndices: [0, 2],
    explanation:
      "グラフ構造は Apache Gremlin API、列ファミリ/CQL は Apache Cassandra API、JSON ドキュメントは NoSQL API、BSON 互換は MongoDB API、グローバル KV は Table API を選びます。Azure Cosmos DB はターンキーのグローバル分散と SLA を備えています。",
    keywords: ["Cosmos DB", "Gremlin", "Apache Cassandra", "マルチモデル"],
  },
  {
    id: "dp900-q15",
    domainId: "dp900-domain-3",
    domainLabel: "03: Azure の非リレーショナル データ",
    difficulty: "応用",
    selectCount: 1,
    question:
      "既存のオンプレミス Windows サーバー上の共有フォルダを利用しているレガシー業務アプリケーションをクラウドへ移行する際、複数台の Azure VM および社内端末から標準の SMB プロトコルでそのままネットワークドライブとしてマウントしてファイルを共有したい場合、最適なサービスはどれですか？",
    options: [
      "Azure Cosmos DB for NoSQL",
      "Azure Table Storage",
      "Azure Files",
      "Blob Archive アクセス層",
    ],
    correctIndices: [2],
    explanation:
      "Azure Files は業界標準の SMB（Server Message Block）および NFS プロトコルに対応したフルマネージドな共有ファイルシステムであり、OS に依存せずネットワークドライブとして同時マウントできます。",
    keywords: ["Azure Files", "SMB", "共有ファイルシステム"],
  },
  {
    id: "dp900-q16",
    domainId: "dp900-domain-4",
    domainLabel: "04: Azure の分析ワークロード",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "オンプレミス DB・SaaS・Blob Storage など多様なデータソースからデータを抽出し、まず生データのままデータレイク（ADLS Gen2 / OneLake）へ高速ロードしたうえで、後続の Spark や SQL エンジンの計算能力を用いて分析用途ごとに柔軟に加工・変換する方式はどれですか？",
    options: [
      "ELT（Extract, Load, Transform）",
      "OLTP トランザクションロック",
      "DCL 権限剥奪",
      "ページ分割レポート出力",
    ],
    correctIndices: [0],
    explanation:
      "抽出（Extract）したデータを先にターゲットのデータレイク／データウェアハウスへ読み込み（Load）、その基盤の分散計算力で後から変換（Transform）する手法を ELT と呼びます。格納前に変換を終えるのは ETL です。",
    keywords: ["ELT", "ETL", "データレイク"],
  },
  {
    id: "dp900-q17",
    domainId: "dp900-domain-4",
    domainLabel: "04: Azure の分析ワークロード",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Azure Data Factory（ADF）において、「接続先データストアの認証情報・場所（例：Azure SQL Database への接続設定）」「参照対象となるテーブルやファイル構造の定義」「コピーや変換などの処理ステップ」「それらを順序立てて実行するワークフロー」にそれぞれ対応する用語の正しい並びはどれですか？",
    options: [
      "ディメンション → ファクト → ダッシュボード → タイル",
      "リンクされたサービス（Linked Service）→ データセット（Dataset）→ アクティビティ（Activity）→ パイプライン（Pipeline）",
      "主キー → 外部キー → クラスター化インデックス → ビュー",
      "タンブリング → ホッピング → スライディング → スナップショット",
    ],
    correctIndices: [1],
    explanation:
      "ADF では接続文字列を表す「リンクされたサービス」、データ表現の「データセット」、単一処理の「アクティビティ」、処理フロー全体の「パイプライン」を組み合わせてデータ統合を構成します。",
    keywords: ["Azure Data Factory", "パイプライン", "Linked Service"],
  },
  {
    id: "dp900-q18",
    domainId: "dp900-domain-4",
    domainLabel: "04: Azure の分析ワークロード",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Azure Stream Analytics の SQL クエリにおいて、「重複を一切許さず連続した固定の 5 分間隔（例：10:00〜10:05、10:05〜10:10、10:10〜10:15）ごとにセンサーの平均温度を集計したい」場合に選択すべきウィンドウ関数はどれですか？",
    options: [
      "ホッピング ウィンドウ（Hopping window）",
      "スライディング ウィンドウ（Sliding window）",
      "タンブリング ウィンドウ（Tumbling window）",
      "セッション ウィンドウ（Session window）",
    ],
    correctIndices: [2],
    explanation:
      "タンブリング ウィンドウは連続して隣り合い重複のない固定時間長で集計します。一定間隔ごとに重複を許して前進するのはホッピング ウィンドウ、イベント発生/終了時のみ評価するのはスライディング ウィンドウです。",
    keywords: ["Azure Stream Analytics", "タンブリング ウィンドウ", "リアルタイム分析"],
  },
  {
    id: "dp900-q19",
    domainId: "dp900-domain-4",
    domainLabel: "04: Azure の分析ワークロード",
    difficulty: "標準",
    selectCount: 2,
    question:
      "Microsoft Power BI におけるデータモデリングと閲覧成果物（レポート・ダッシュボード・ページ分割レポート）について、正しい記述を 2 つ選択してください。",
    options: [
      "請求書や全明細テーブルを改ページ・余白を含めて省略なくすべて PDF や印刷物として出力する場合は「ダッシュボードのスクリーンショット」が最適である",
      "Power BI サービス上で複数のレポートから主要なビジュアル（タイル）を 1 枚の単一画面へピン留めして全体俯瞰する機能は「ダッシュボード」であり、Power BI Desktop 単体ではなく Power BI サービス上で作成する",
      "分析用のデータモデルでは、数値集計対象（売上金額・数量など）を保持する中心の「ファクト テーブル」と、日付・商品・顧客などの切り口属性を持つ「ディメンション テーブル」を関連付けるスタースキーマが推奨される",
      "Power BI レポートは 1 ページしか作成できず、スライサーやフィルターを使った対話的なドリルダウン操作には対応していない",
    ],
    correctIndices: [1, 2],
    explanation:
      "Power BI ダッシュボードは Power BI サービス上で複数レポートの指標を 1 画面へまとめる機能、スタースキーマはファクト＋ディメンションによる推奨モデルです。印刷や PDF 向けの定型明細出力にはページ分割レポート（Paginated Reports）を用い、通常レポートは複数ページの対話操作に対応します。",
    keywords: ["Power BI", "ダッシュボード", "スタースキーマ", "ページ分割レポート"],
  },
  {
    id: "dp900-q20",
    domainId: "dp900-domain-4",
    domainLabel: "04: Azure の分析ワークロード",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Azure における大規模分析・統合プラットフォーム（Azure Synapse Analytics・Azure Databricks・Microsoft Fabric）に関する説明として正しいものを 2 つ選択してください。",
    options: [
      "Microsoft Fabric は OneLake という単一の統合ストレージ基盤を土台に、データ統合・データエンジニアリング・データウェアハウス・Real-Time Intelligence・Power BI を SaaS として一体提供する",
      "Azure Databricks では Python や Scala を使用できず、ノーコードのドラッグ＆ドロップ図表作成のみに機能が限定されている",
      "OneLake を利用する場合、分析ツールごとに必ず独自形式へデータを 5 重にコピーして保存し直す必要がある",
      "Azure Synapse Analytics は大規模並列処理（MPP）SQL プールによるデータウェアハウス分析と Apache Spark プール、Data Factory 相当のパイプラインを単一ワークスペースに統合している",
    ],
    correctIndices: [0, 3],
    explanation:
      "Microsoft Fabric は OneLake（Delta Parquet 中心の単一論理レイク）を基盤に分析ワークロード全般を統合する SaaS プラットフォームで、ショートカット等によりデータ重複コピーを削減します。Azure Synapse Analytics は SQL プール（専用/サーバーレス）・Spark・パイプラインを統合し、Azure Databricks は Spark と Delta Lake を中心に Python/Scala/SQL/R の協調開発を支援します。",
    keywords: ["Microsoft Fabric", "OneLake", "Azure Synapse Analytics", "Azure Databricks"],
  },
];

export const dp900OfficialResources: AzureOfficialResource[] = [
  {
    title: "Microsoft Certified: Azure Data Fundamentals 認定ページ",
    description: "DP-900 資格の概要、対象ロール、受験登録と認定条件の公式ハブです。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/azure-data-fundamentals/",
    badge: "公式認定ページ",
  },
  {
    title: "Exam DP-900 公式試験ガイド (Study Guide)",
    description: "出題 4 ドメインの最新配点比率と評価対象スキル（Skills measured）の一次情報です。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/resources/study-guides/dp-900",
    badge: "公式試験ガイド",
  },
  {
    title: "Azure Architecture Center: データベースアーキテクチャ設計の始め方",
    description: "リレーショナル／非リレーショナル／分析データストアの選定基準と設計指針を網羅した公式リファレンスです。",
    url: "https://learn.microsoft.com/ja-jp/azure/architecture/databases/database-get-started",
    badge: "公式設計ガイド",
  },
  {
    title: "Course DP-900T00 公式ラーニングパス",
    description: "コアデータ概念、リレーショナル／非リレーショナル、分析ワークロードを学べる公式無料コースです。",
    url: "https://learn.microsoft.com/ja-jp/training/courses/dp-900t00",
    badge: "公式トレーニング",
  },
];
