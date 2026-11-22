// 出典: Microsoft Learn Exam AZ-305 公式試験ガイド (Study guide for Exam AZ-305)
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

export const az305ExamFacts: CertExamFact[] = [
  {
    label: "対象試験",
    value: "Exam AZ-305",
    detail: "Azure Solutions Architect Expert ※AZ-104 要",
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
    value: "設計・ケーススタディ",
    detail: "Well-Architected / CAF 準拠",
  },
];

export const az305Domains: AzureDomain[] = [
  {
    id: "az305-domain-1",
    number: "01",
    title: "ID・ガバナンス・監視ソリューションの設計",
    englishTitle: "Design identity, governance, and monitoring solutions",
    weight: "25〜30%",
    accentColor: "indigo",
    summary:
      "Azure Monitor / Log Analytics のログ収集とルーティング、Microsoft Entra ID と Key Vault によるゼロトラスト認証設計、Cloud Adoption Framework (CAF) に基づく管理グループ・Azure Policy・Defender for Cloud のガバナンス設計を学びます。",
    topics: [
      {
        id: "az305-1-1",
        code: "1.1",
        title: "ログと監視設計",
        services: [
          "Azure Monitor",
          "Log Analytics",
          "データ収集ルール (DCR)",
          "Application Insights",
          "Microsoft Sentinel",
        ],
        keyPoints: [
          "Azure Monitor Agent (AMA) とデータ収集ルール (DCR) により、仮想マシンやオンプレミス (Azure Arc) から必要なログだけをフィルタリング・変換し、複数ワークスペースへ柔軟にルーティングできる",
          "診断設定（Diagnostic Settings）では用途別に出力先を使い分ける：KQL による対話分析とアラートは Log Analytics、長期コンプライアンス保管は Storage Account、外部 SIEM 連携は Event Hubs を選定",
          "Log Analytics ワークスペース設計では集中管理型とリージョン/部門分散型を比較し、テーブル層（Analytics / Basic / Auxiliary）と保持期間を組み合わせてコストと検索要件を最適化する",
          "Application Insights（OpenTelemetry 連携）による分散トレーシング・ライブメトリクスでアプリ性能を監視し、Microsoft Sentinel（SIEM/SOAR）で脅威の相関分析と自動プレイブック対応を設計",
        ],
        examTip:
          "『複数ソースからログをフィルタリングしてコストを抑えつつ複数送信先へ送る』＝ AMA + DCR、『長期低コスト保管と KQL 分析の両立』＝ 診断設定の並列出力または Log Analytics テーブル層分離。",
      },
      {
        id: "az305-1-2",
        code: "1.2",
        title: "認証・認可・シークレット設計",
        services: [
          "Microsoft Entra ID",
          "Entra B2B / External ID",
          "マネージド ID",
          "Entra PIM",
          "条件付きアクセス",
          "Azure Key Vault",
        ],
        keyPoints: [
          "外部ビジネスパートナーや取引先アカウントを自社テナントへ招待する連携には Microsoft Entra B2B コラボレーション、一般消費者向け（B2C）の独自サインアップ/サインイン基盤には Microsoft Entra External ID を選定する",
          "Azure リソース間のアクセスには資格情報管理が不要なマネージド ID（単一リソース専属のシステム割り当て / 複数リソース共有のユーザー割り当て）を第一選択とする",
          "シークレット・暗号鍵・TLS 証明書は Azure Key Vault（RBAC 認可モデル＋論理削除＋消去保護有効）へ集約し、ネットワークは Private Endpoint で閉域化する",
          "特権ロールの常時割り当てを排し、Microsoft Entra PIM（Just-In-Time 昇格・承認・MFA 要求・アクセスレビュー）と条件付きアクセス（リスクベース・準拠デバイス要求）でゼロトラストを徹底する",
        ],
        examTip:
          "『コードや設定にクライアントシークレットを書かずに Key Vault や SQL へ接続』＝ マネージド ID、『特権ロールを承認付きで一時昇格』＝ Entra PIM、『パートナー招待＝B2B / 一般顧客＝External ID』。",
      },
      {
        id: "az305-1-3",
        code: "1.3",
        title: "ガバナンス設計",
        services: [
          "管理グループ階層",
          "Azure ランディングゾーン (CAF)",
          "Azure Policy",
          "Microsoft Defender for Cloud",
          "タグ戦略",
        ],
        keyPoints: [
          "Cloud Adoption Framework (CAF) の Azure ランディングゾーンに基づき、管理グループ階層（最大 6 階層）で Platform（Identity / Management / Connectivity）と Landing Zones（Corp / Online）にサブスクリプションを責務分離する",
          "Azure Policy は作成時の強制禁止（Deny）・監査（AuditIfNotExists）に加え、Modify や DeployIfNotExists とマネージド ID を用いた修復タスクで診断設定やタグ付与を自動標準化できる",
          "Microsoft Defender for Cloud により CSPM（セキュアスコア・規制コンプライアンス評価）とサーバー/SQL/コンテナ/ストレージ向けの高度な脅威保護（Defender プラン）を一元設計する",
          "コスト配賦と運用自動化のためのタグ戦略は、Azure Policy の Inherit a tag ルールでサブスクリプション/リソースグループから自動継承させて入力漏れを防ぐ",
        ],
        examTip:
          "『リソース作成時に特定構成をブロックする＝RBAC ではなく Azure Policy (Deny)』『作成後に自動で診断設定やタグを付与・修復する＝DeployIfNotExists / Modify + 修復タスク』。",
      },
    ],
  },
  {
    id: "az305-domain-2",
    number: "02",
    title: "データ ストレージ ソリューションの設計",
    englishTitle: "Design data storage solutions",
    weight: "20〜25%",
    accentColor: "cyan",
    summary:
      "リレーショナル DB（Azure SQL ファミリ・PostgreSQL/MySQL）の選定と暗号化、非リレーショナルストレージ（Blob / ADLS Gen2 / Files / Cosmos DB 整合性レベル＆パーティション設計）、データ統合・リアルタイム分析基盤の設計を学びます。",
    topics: [
      {
        id: "az305-2-1",
        code: "2.1",
        title: "リレーショナル DB 設計",
        services: [
          "Azure SQL Database",
          "Azure SQL Managed Instance",
          "SQL Server on Azure VM",
          "Azure Database for PostgreSQL / MySQL",
          "TDE / Always Encrypted",
        ],
        keyPoints: [
          "SQL 移行・新規構築の 3 択：クラウドネイティブ PaaS は Azure SQL Database、SQL Server エージェント・CLR・クロス DB クエリ・リンクサーバー等の高互換が必要で運用負荷を下げたい場合は Azure SQL Managed Instance、OS/SQL インスタンス完全制御やレガシー統合は SQL Server on Azure VM",
          "Azure SQL Database の構成最適化：間欠トラフィックは Serverless（自動一時停止）、ピークが分散する複数 DB 群は Elastic Pool、最大 100 TB 級の大容量・高速読取スケールアウトは Hyperscale、超低レイテンシ・高 IOPS は Business Critical を選択",
          "オープンソース RDB は Azure Database for PostgreSQL / MySQL Flexible Server を利用し、同一リージョン内の可用性ゾーン冗長 HA や読み取りレプリカ、バースト可能/汎用/メモリ最適化層を使い分ける",
          "データ保護の多層化：保存データ暗号化には TDE（Key Vault による顧客管理キー CMK 対応）、DBA やクラウド管理者からも機密列の平文を秘匿する場合はクライアント側暗号化の Always Encrypted を設計する",
        ],
        examTip:
          "『SQL Agent やクロス DB クエリが必要かつ PaaS＝SQL Managed Instance』『DBA からも機密列を保護＝Always Encrypted』『複数 SaaS テナント DB のリソース共有＝Elastic Pool』。",
      },
      {
        id: "az305-2-2",
        code: "2.2",
        title: "非リレーショナル DB 設計",
        services: [
          "Azure Blob Storage",
          "ADLS Gen2",
          "Azure Files",
          "Azure Cosmos DB",
          "不変ストレージ (WORM)",
        ],
        keyPoints: [
          "非構造化ストレージ選定：汎用オブジェクトは Blob Storage、Hadoop/Spark 等の分析向け階層型名前空間（POSIX ACL・ディレクトリ原子的操作）は ADLS Gen2、オンプレ SMB/NFS 共有移行や複数 VM 同時マウントは Azure Files を選定",
          "Blob アクセス層（Hot / Cool / Cold / Archive）をライフサイクル管理ポリシーで自動移行してコストを最適化し、規制対応（SEC 17a-4 等）には WORM 不変ストレージ（時間ベース保持・訴訟ホールド）を適用する",
          "Azure Cosmos DB のパーティション設計では、論理パーティション上限（20 GB）とホットパーティションによるスロットリング（429）を避けるため、値の種類が多く均等分散する高カーディナリティ属性をパーティションキーに選ぶ",
          "Cosmos DB の 5 つの整合性レベル（Strong・Bounded Staleness・Session [既定]・Consistent Prefix・Eventual）を、一貫性・レイテンシ・RU/s コストのトレードオフから業務要件に合わせて選択する",
        ],
        examTip:
          "Cosmos DB は『既定が Session（自セッション内で最新読取保証）』、Strong は複数書き込みリージョン非対応・RU コスト最大。分析用ディレクトリ階層は ADLS Gen2 を選ぶ。",
      },
      {
        id: "az305-2-3",
        code: "2.3",
        title: "データ統合・分析設計",
        services: [
          "Azure Data Factory",
          "Azure Synapse Analytics",
          "Microsoft Fabric",
          "Azure Event Hubs",
          "Azure Stream Analytics",
        ],
        keyPoints: [
          "バッチ中心の ETL/ELT パイプラインは Azure Data Factory (ADF) で構築し、オンプレミスや VNet 閉域 DB からのデータ抽出にはセルフホステッド統合ランタイム（SHIR）を配置する",
          "分析基盤選定：超並列（MPP）専用 SQL プール・サーバーレス SQL・Spark を組み合わせた PaaS 分析基盤の Azure Synapse Analytics、および OneLake 基盤でデータ統合・レイクハウス・リアルタイム分析・Power BI を一体提供する SaaS 型プラットフォーム Microsoft Fabric を使い分ける",
          "ストリーミングパイプライン：秒間数百万イベントの取り込みと Kafka 互換バッファリング（Capture で ADLS Gen2 自動保存可）には Azure Event Hubs、時間ウィンドウ集計・異常検知 SQL クエリには Azure Stream Analytics を使用",
          "ADLS Gen2 / OneLake 上でメダリオンアーキテクチャ（Bronze: 生データ → Silver: クレンジング → Gold: 集計）と Parquet / Delta Lake 形式を採用し、分析コストと性能を最適化する",
        ],
        examTip:
          "『オンプレ閉域 DB からクラウド分析基盤へ ETL 連携』＝ ADF + セルフホステッド統合ランタイム (SHIR)、『高スループットテレメトリ取り込み＋ウィンドウ集計』＝ Event Hubs + Stream Analytics。",
      },
    ],
  },
  {
    id: "az305-domain-3",
    number: "03",
    title: "ビジネス継続性ソリューションの設計",
    englishTitle: "Design business continuity solutions",
    weight: "15〜20%",
    accentColor: "emerald",
    summary:
      "RPO/RTO 要件を満たすバックアップ＆災害復旧（DR）戦略、可用性ゾーン・グローバル負荷分散・複合 SLA 計算に基づく高可用性アーキテクチャ設計を学びます。",
    topics: [
      {
        id: "az305-3-1",
        code: "3.1",
        title: "RPO/RTO・バックアップ＆DR 設計",
        services: [
          "Azure Backup",
          "Azure Site Recovery (ASR)",
          "SQL フェイルオーバー グループ",
          "アクティブ geo レプリケーション",
          "Cosmos DB マルチリージョン",
        ],
        keyPoints: [
          "誤削除やランサムウェアからのポイントインタイム復元・長期保管には Azure Backup（Recovery Services コンテナー / Backup コンテナー）を使用し、論理削除・不変コンテナー・マルチユーザー承認（MUA）でバックアップ自体の破壊を防ぐ",
          "リージョン障害時の迅速な復旧（低 RTO/RPO）が必要な IaaS VM（Azure 間またはオンプレ VMware/Hyper-V → Azure）には Azure Site Recovery (ASR) と復旧計画（起動順序・スクリプト自動実行）を設計する",
          "Azure SQL の DR 比較：単一 DB ごとに最大 4 つの読み取り専用セカンダリを持てるアクティブ geo レプリケーション（フェイルオーバー時に接続文字列変更が必要）vs 複数 DB をまとめアプリ設定変更なしで自動フェイルオーバーできる SQL フェイルオーバー グループ",
          "ストレージ冗長性（LRS / ZRS / GRS / RA-GRS / GZRS / RA-GZRS）を RPO・読み取り要件で選定し、書き込みまで完全なマルチリージョン Active-Active が必要な場合は Cosmos DB マルチリージョン書き込みを採用する",
        ],
        examTip:
          "『アプリの接続文字列を変えずに Azure SQL を自動フェイルオーバー』＝ SQL フェイルオーバー グループ、『単一 DB に最大 4 つ読取レプリカ』＝ アクティブ geo レプリケーション、『VM のリージョン DR』＝ ASR。",
      },
      {
        id: "az305-3-2",
        code: "3.2",
        title: "高可用性設計",
        services: [
          "可用性ゾーン (AZ)",
          "リージョンペア",
          "Azure Load Balancer",
          "Application Gateway",
          "Azure Front Door",
          "Azure Traffic Manager",
        ],
        keyPoints: [
          "可用性階層の設計：単一データセンター内ラック障害耐性（可用性セット 99.95%）→ 同一リージョン内の物理的に独立した複数施設（可用性ゾーン AZ 99.99%）→ 自然災害耐性（リージョンペア・地理冗長）へと段階的に要件適合させる",
          "ロードバランサー 4 種の選定：リージョン内 L4 低レイテンシ＝Azure Load Balancer (Standard は AZ 対応)、リージョン内 L7 URL ルーティング/WAF＝Application Gateway、グローバル L7 Anycast・エッジキャッシュ・WAF＝Azure Front Door、グローバル DNS ベース（非 HTTP/TCP 対応）＝Azure Traffic Manager",
          "複合 SLA（Composite SLA）の評価：直列依存は各コンポーネントの積（例：99.95% × 99.99% ≒ 99.94%）となり低下し、並列冗長化すると `1 - (1 - SLA1) × (1 - SLA2)` で向上する",
          "コストと RTO/RPO に応じて Active-Active（常時両リージョン稼働）・Warm Standby（縮小規模で待機）・Cold Standby（IaC＋バックアップから復旧）の災害復旧パターンを選択する",
        ],
        examTip:
          "『非 HTTP の TCP/UDP をグローバル分散』＝ Traffic Manager、『HTTP/HTTPS を Anycast で高速ルーティング + キャッシュ + WAF』＝ Azure Front Door、『直列システムの複合 SLA は積で下がる』は計算問題で頻出。",
      },
    ],
  },
  {
    id: "az305-domain-4",
    number: "04",
    title: "インフラストラクチャ ソリューションの設計",
    englishTitle: "Design infrastructure solutions",
    weight: "30〜35%",
    accentColor: "amber",
    summary:
      "コンピュート・コンテナ選定、メッセージング＆API 統合、Azure Migrate / Data Box による移行設計、ハブ＆スポーク / Virtual WAN のハイブリッドネットワーク、Well-Architected Framework とコスト最適化を学びます。",
    topics: [
      {
        id: "az305-4-1",
        code: "4.1",
        title: "コンピュート設計",
        services: [
          "Azure VM / VMSS",
          "Azure Kubernetes Service (AKS)",
          "Azure Container Apps",
          "Azure App Service",
          "Azure Functions",
          "Azure Batch",
        ],
        keyPoints: [
          "ワークロード別の実行基盤選定：OS 完全制御や商用パッケージ＝VM / VMSS、Web/API の迅速な PaaS 運用（デプロイスロット・VNet 統合）＝App Service、イベント駆動サーバーレス関数＝Azure Functions（VNet 統合・コールドスタート回避は Flex Consumption / Premium プラン、ステートフルワークフローは Durable Functions）",
          "コンテナ基盤の 3 段階選択：Kubernetes API・Helm・複雑なクラスタ/ネットワーク制御が必要＝AKS、K8s 運用を隠蔽し KEDA スケール・ゼロスケール・Dapr を使いたいマイクロサービス＝Azure Container Apps (ACA)、単発バッチコンテナ＝Azure Container Instances (ACI)",
          "大規模並列 HPC・科学計算・映像レンダリングのジョブスケジューリングと Spot VM 活用による高スループット処理には Azure Batch を選定する",
          "マルチテナント回避や完全ネットワーク分離が必要な場合は App Service Environment v3 (ASE v3) や AKS のプライベートクラスタ＋VNet インジェクションを構成する",
        ],
        examTip:
          "『K8s 専門運用チーム無しで KEDA やゼロスケール・マイクロサービスを動かしたい』＝ Azure Container Apps、『K8s エコシステム完全制御が必要』＝ AKS、『VNet 閉域接続が要る Functions』＝ Premium / Flex Consumption。",
      },
      {
        id: "az305-4-2",
        code: "4.2",
        title: "アプリ統合と API 設計",
        services: [
          "Azure Service Bus",
          "Azure Event Grid",
          "Azure Event Hubs",
          "Azure Queue Storage",
          "Azure Logic Apps",
          "Azure API Management",
        ],
        keyPoints: [
          "メッセージとイベントの 4 択設計：FIFO 順序保証・トランザクション・重複検出・デッドレターキューが必要な業務メッセージ＝Azure Service Bus、80 GB 超の単純非同期キュー＝Queue Storage、状態変化の離散通知とサブスクリプションフィルタ＝Azure Event Grid、秒間数百万件のストリーミング取り込み＝Azure Event Hubs",
          "数百種の SaaS・オンプレコネクタを用いたローコード業務ワークフロー統合には Azure Logic Apps（VNet 統合・プライベート通信が必要な場合は Standard プラン）を採用する",
          "Azure API Management (APIM) を API ゲートウェイとして配置し、OAuth 2.0 / JWT 検証・レート制限・バージョン管理・応答キャッシュ・開発者ポータルを一元化する",
          "APIM を Application Gateway (WAF) 背後の内部 VNet モードで公開することで、API バックエンドへのゼロトラスト通信と境界防御を両立できる",
        ],
        examTip:
          "『FIFO・重複排除・トランザクション・DLQ＝Service Bus』『Blob 作成などのイベントリアクション＝Event Grid』『API の認可・レート制限・開発者ポータル＝API Management』。",
      },
      {
        id: "az305-4-3",
        code: "4.3",
        title: "移行設計",
        services: [
          "Azure Migrate",
          "Azure Database Migration Service",
          "Azure Data Box",
          "AzCopy",
          "Azure Storage Mover",
        ],
        keyPoints: [
          "Azure Migrate を移行の統合ハブとし、オンプレミス（VMware / Hyper-V / 物理）・Web アプリ・DB のエージェントレス検出、依存関係マッピング、適正サイズ＆コスト評価、Server Migration による移行を段階実行する",
          "データベース移行：Azure Database Migration Service (DMS) によるオンライン移行（CDC による最小停止）またはオフライン移行、および SQL Server から SQL MI への Managed Instance Link によるハイブリッド同期切替を設計する",
          "大規模データ移行では『データ量 (bit) ÷ 実効帯域 (bps)』で必要日数を試算し、オンライン（AzCopy / Azure Storage Mover）で間に合わない場合は暗号化済み物理デバイスの Azure Data Box（Disk / Data Box / Heavy）を選択する",
          "ワークロードごとに 5R 戦略（Rehost / Refactor / Rearchitect / Rebuild / Replace）を適用し、スケジュールと事業価値のバランスを取る",
        ],
        examTip:
          "移行問題ではまず『Azure Migrate で検出・依存関係・サイズ評価』を行い、回線計算で期限内に送れない数十〜数百 TB データには『Azure Data Box』を選ぶ。",
      },
      {
        id: "az305-4-4",
        code: "4.4",
        title: "ハイブリッド＆エッジ接続・ルーティング設計",
        services: [
          "ハブ＆スポーク",
          "Azure Virtual WAN",
          "ExpressRoute",
          "VPN Gateway",
          "Azure Private Link",
          "Azure Firewall",
        ],
        keyPoints: [
          "VNet ピアリングは非推移的であるため、ハブ＆スポーク構成でスポーク間やオンプレミスと通信するには Hub VNet に Azure Firewall 等の NVA とサブネットへのユーザー定義ルート（UDR）を配置する",
          "多拠点のブランチ VPN/SD-WAN と複数リージョンのハブ間をフルメッシュかつ自動経過ルーティング（Any-to-Any トランジット）で結ぶ場合は Azure Virtual WAN (Standard) を採用する",
          "専用線（ExpressRoute：閉域・低レイテンシ・最大 100 Gbps）とインターネット暗号化トンネル（VPN Gateway：S2S/P2S）を組み合わせ、ExpressRoute の冗長バックアップとして S2S VPN（またはデータ暗号化のための ExpressRoute 上の IPsec / MACsec）を設計する",
          "PaaS への閉域アクセスには Azure Private Link (Private Endpoint) と privatelink.* プライベート DNS ゾーンを使用し、オンプレミスからの名前解決には Azure DNS Private Resolver を構成する",
        ],
        examTip:
          "『スポーク VNet 間の通信制御＋中央検査＝ハブ＆スポーク + Azure Firewall + UDR』『多拠点・マルチリージョンのフルメッシュ自動ルーティング＝Virtual WAN』『PaaS 閉域化＋オンプレからの名前解決＝Private Endpoint + DNS Private Resolver』。",
      },
      {
        id: "az305-4-5",
        code: "4.5",
        title: "Well-Architected Framework とコスト最適化設計",
        services: [
          "Azure Well-Architected Framework",
          "予約インスタンス (RI)",
          "Azure Savings Plan",
          "Azure Hybrid Benefit",
          "Azure Spot VM",
        ],
        keyPoints: [
          "Azure Well-Architected Framework (WAF) の 5 本柱（信頼性・セキュリティ・コスト最適化・オペレーショナルエクセレンス・パフォーマンス効率）のトレードオフを意識し、要件に対し過剰投資（オーバースペック）を避ける",
          "長期コミット割引の使い分け：特定リージョン・特定 SKU が 1〜3 年固定の安定稼働ワークロードには最大割引の予約インスタンス（RI）、複数リージョンやコンピュートサービス（VM/AKS/App Service/Functions/ACA）を横断して柔軟に構成変更する場合は Azure Savings Plan for Compute を選定",
          "既存のソフトウェアアシュアランス（SA）付き Windows Server / SQL Server ライセンスを持ち込んで大幅にライセンス費を削減できる Azure Hybrid Benefit (AHB) を適用する",
          "エビクション（30 秒前通知による割り込み停止）を許容できるステートレス・バッチワークロードには Azure Spot VM を採用し、Azure Advisor の推奨事項で継続的に遊休リソースを最適化する",
        ],
        examTip:
          "『リージョンやコンピュートサービスを変更する可能性がある長期利用＝Azure Savings Plan』『構成固定で割引率最大化＝予約インスタンス (RI)』『既存 SA ライセンス活用＝Azure Hybrid Benefit』。",
      },
    ],
  },
];

export const az305Comparisons: AzureComparisonTable[] = [
  {
    id: "az305-comp-compute",
    category: "コンピュート",
    title: "コンピュート＆コンテナ実行基盤の選定比較",
    subtitle: "制御性・K8s 要否・サーバーレス・バッチ特性の判断軸",
    columns: ["サービス", "実行・管理モデル", "スケーリング / ネットワーク", "最適設計シナリオ"],
    rows: [
      {
        feature: "Azure VM / VMSS",
        values: [
          "IaaS（OS〜ミドルウェアまで自社管理）",
          "VNet 直接配置・ルールベース自動スケール",
          "OS 固有設定・カーネル要件・Lift & Shift 移行",
        ],
      },
      {
        feature: "Azure App Service",
        values: [
          "Web/API 特化 PaaS（デプロイスロット対応）",
          "負荷/スケジュール拡張・VNet 統合・ASE v3 分離",
          "Web アプリ・REST API の迅速な本番運用",
        ],
      },
      {
        feature: "Azure Functions",
        values: [
          "イベント駆動サーバーレス FaaS / Durable 対応",
          "Flex Consumption / Premium で VNet・待機排除",
          "タイマー・イベント契機の軽量処理・オーケストレーション",
        ],
      },
      {
        feature: "Azure Container Apps",
        values: [
          "サーバーレスコンテナ（K8s 管理不要・Dapr 内蔵）",
          "KEDA イベント拡張・ゼロスケール・VNet 環境",
          "K8s 専任運用なしでマイクロサービスを構築",
        ],
      },
      {
        feature: "Azure Kubernetes Service (AKS)",
        values: [
          "フル機能のマネージド Kubernetes",
          "Pod/ノード自動拡張・プライベートクラスタ対応",
          "Helm/CRD・高度なメッシュ・K8s API 完全制御",
        ],
      },
      {
        feature: "Azure Batch",
        values: [
          "マネージド並列計算・HPC ジョブスケジューラ",
          "VM/Spot VM プールをジョブキューに応じ自動伸縮",
          "大規模科学演算・金融シミュレーション・映像処理",
        ],
      },
    ],
    decisionRule:
      "K8s 管理不要のマイクロサービス＝Container Apps、K8s 完全制御＝AKS、Web PaaS＝App Service、大容量 HPC＝Azure Batch。",
  },
  {
    id: "az305-comp-messaging",
    category: "コンピュート",
    title: "アプリ統合＆メッセージング・イベント基盤比較",
    subtitle: "順序保証・イベント配信・ストリーミング・ワークフローの選定",
    columns: ["サービス", "通信モデルと容量特性", "主な保証・機能", "最適設計シナリオ"],
    rows: [
      {
        feature: "Azure Service Bus",
        values: [
          "エンタープライズキュー / Pub-Sub (最大 80 GB)",
          "FIFO セッション・重複検出・トランザクション・DLQ",
          "注文・決済・在庫更新など厳格な業務メッセージ連携",
        ],
      },
      {
        feature: "Azure Queue Storage",
        values: [
          "単純 FIFO 非保証キュー（最大 500 TiB まで）",
          "REST ベースの低コスト大量メッセージ保管",
          "80 GB を超えるシンプルなバックグラウンド作業キュー",
        ],
      },
      {
        feature: "Azure Event Grid",
        values: [
          "プッシュ型イベントルーター（離散イベント）",
          "属性フィルタリング・1 秒未満の低遅延リアクション",
          "Blob 作成やリソース変更契機のサーバーレス駆動",
        ],
      },
      {
        feature: "Azure Event Hubs",
        values: [
          "高スループットイベントストリーム（Kafka 互換）",
          "パーティション並列処理・リプレイ・Capture 自動保存",
          "秒間数百万件の IoT テレメトリ・アプリログ取り込み",
        ],
      },
      {
        feature: "Azure Logic Apps",
        values: [
          "ワークフロー統合オーケストレーション",
          "数百種の SaaS/オンプレコネクタ・Standard は VNet 対応",
          "承認フロー・SaaS 連携・B2B/EDI 定型業務自動化",
        ],
      },
    ],
    decisionRule:
      "厳密な業務コマンド＝Service Bus、状態変化の通知＝Event Grid、大量ストリーム＝Event Hubs、80GB 超の単純キュー＝Queue Storage。",
  },
  {
    id: "az305-comp-rdb",
    category: "ストレージ・DB",
    title: "SQL Server 移行先および Azure RDB 選定比較",
    subtitle: "互換性・運用オフロード・スケーリング要件の判断軸",
    columns: ["サービス", "互換性 / 管理範囲", "容量・スケーリング特性", "最適設計シナリオ"],
    rows: [
      {
        feature: "Azure SQL Database",
        values: [
          "クラウド最適化 PaaS（DB 単位分離）",
          "Serverless・Elastic Pool・Hyperscale (100 TB〜)",
          "新規クラウドアプリ・SaaS マルチテナント基盤",
        ],
      },
      {
        feature: "Azure SQL Managed Instance",
        values: [
          "PaaS かつ SQL Server エンジンほぼ完全互換",
          "SQL Agent・クロス DB クエリ・リンクサーバー対応",
          "最小改修でオンプレ SQL Server を PaaS 移行",
        ],
      },
      {
        feature: "SQL Server on Azure VM",
        values: [
          "IaaS（OS および SQL インスタンス完全制御）",
          "Azure Hybrid Benefit・特定バージョン/SSRS/SSIS 対応",
          "OS/レジストリ依存・レガシー SQL 機能の継続利用",
        ],
      },
      {
        feature: "Azure Database for PostgreSQL / MySQL",
        values: [
          "マネージド OSS RDB (Flexible Server)",
          "ゾーン冗長 HA・読取レプリカ・TDE / 保存時暗号化",
          "Linux / OSS スタックアプリのマネージド運用",
        ],
      },
    ],
    decisionRule:
      "新規 SaaS/クラウドアプリ＝SQL Database、SQL Agent 等の互換性＋PaaS＝SQL Managed Instance、OS/特殊拡張依存＝SQL on VM。",
  },
  {
    id: "az305-comp-cosmos-consistency",
    category: "ストレージ・DB",
    title: "Azure Cosmos DB 整合性レベル（5 種）比較",
    subtitle: "一貫性・レイテンシ・スループットコストのトレードオフ",
    columns: ["整合性レベル", "保証される読み取り順序と鮮度", "レイテンシ / RU コスト", "代表ユースケース"],
    rows: [
      {
        feature: "Strong（強整合性）",
        values: [
          "全リージョンで最新の確定済み書き込みのみ読み取り可",
          "最高 RU コスト・最長書き込み遅延（単一書込リージョン限定）",
          "二重引落しを絶対に防ぐ金融台帳・厳密な在庫残高",
        ],
      },
      {
        feature: "Bounded Staleness（有界整合性）",
        values: [
          "指定したバージョン数 (K) または時間 (T) 以内の遅延を保証",
          "高コスト・リージョン内強整合 / リージョン間は制限付き遅延",
          "株価表示・IoT グローバルダッシュボード・リーダーボード",
        ],
      },
      {
        feature: "Session（セッション：既定）",
        values: [
          "同一クライアントセッション内で Read-Your-Writes を保証",
          "バランスの良い低レイテンシ・RU コスト",
          "EC ショッピングカート・ユーザープロフィール更新",
        ],
      },
      {
        feature: "Consistent Prefix（一貫性プレフィックス）",
        values: [
          "書き込み順序の逆転は起きない（古い状態が見える場合はある）",
          "低レイテンシ・低 RU コスト",
          "スポーツ試合のスコア更新・チャット/コメント投稿順",
        ],
      },
      {
        feature: "Eventual（結果整合性）",
        values: [
          "順序保証なし（最終的に全レプリカが収束）",
          "最低レイテンシ・最低 RU コスト（最大可用性）",
          "SNS のいいね数・閲覧数・商品レビュー集計",
        ],
      },
    ],
    decisionRule:
      "通常は既定の Session、厳格な金融残高は Strong、更新順序逆転のみ不可なら Consistent Prefix、最速・最安なら Eventual。",
  },
  {
    id: "az305-comp-lb",
    category: "ネットワーク・セキュリティ",
    title: "トラフィック分散・L4/L7 ロードバランサー比較",
    subtitle: "レイヤ・グローバル/リージョン・WAF・プロトコル対応の違い",
    columns: ["サービス", "スコープ / レイヤ", "主な機能（WAF / TLS / キャッシュ）", "最適設計シナリオ"],
    rows: [
      {
        feature: "Azure Load Balancer (Standard)",
        values: [
          "リージョン（単一リージョン内）・L4 (TCP/UDP)",
          "WAF なし / SSL 終端なし / 超低レイテンシ・AZ 冗長",
          "VM/NVA の内部・外部 L4 負荷分散、非 HTTP 通信",
        ],
      },
      {
        feature: "Application Gateway",
        values: [
          "リージョン（単一リージョン内）・L7 (HTTP/HTTPS)",
          "統合 WAF v2・TLS 終端・パス/ホストベースルーティング",
          "単一リージョン内の Web/API・内部 APIM の前段 WAF",
        ],
      },
      {
        feature: "Azure Front Door",
        values: [
          "グローバル Anycast エッジ・L7 (HTTP/HTTPS)",
          "グローバル WAF・エッジキャッシュ・TLS 終端・高速切替",
          "マルチリージョン Web/API・静的配信高速化・DDoS 防御",
        ],
      },
      {
        feature: "Azure Traffic Manager",
        values: [
          "グローバル DNS ベース（L4/L7 非依存）",
          "WAF/キャッシュなし（実通信はクライアントから直接）",
          "非 HTTP (TCP/UDP) のグローバル誘導・低コスト DNS 切替",
        ],
      },
    ],
    decisionRule:
      "グローバル Web + WAF＝Front Door、非 HTTP のグローバル分散＝Traffic Manager、リージョン内 L7 + WAF＝App Gateway、L4＝Load Balancer。",
  },
  {
    id: "az305-comp-cost",
    category: "ガバナンス・監視・コスト",
    title: "Azure コスト最適化（FinOps）モデル比較",
    subtitle: "コミットメント期間・柔軟性・中断許容度に応じた最適選択",
    columns: ["コスト最適化手段", "対象範囲と適用条件", "柔軟性と割引特性", "最適設計シナリオ"],
    rows: [
      {
        feature: "Azure 予約インスタンス (RI)",
        values: [
          "特定 SKU・リージョン（1 年 / 3 年利用確約）",
          "対象固定の代わりに最大級の割引率（同ファミリ内サイズ柔軟性あり）",
          "構成とリージョンが変わらない 24 時間稼働の本番 VM / DB",
        ],
      },
      {
        feature: "Azure Savings Plan for Compute",
        values: [
          "時間あたり支出額コミット（1 年 / 3 年）",
          "VM / AKS / App Service / Functions / ACA・リージョン横断で自動適用",
          "今後サイズ変更やサーバーレス移行・リージョン拡張が予定される基盤",
        ],
      },
      {
        feature: "Azure Hybrid Benefit (AHB)",
        values: [
          "SA 付き Windows Server / SQL Server ライセンス持込",
          "OS・SQL ライセンス料を大幅に削減（RI や Savings Plan と併用可）",
          "既存オンプレミスライセンス資産を活用した Windows / SQL 移行",
        ],
      },
      {
        feature: "Azure Spot VM",
        values: [
          "Azure の余剰コンピュートキャパシティ利用",
          "最大大幅割引だが 30 秒前通知で割り込み停止（エビクション）あり",
          "中断・再実行可能なバッチ、CI/CD ランナー、検証、Batch プール",
        ],
      },
    ],
    decisionRule:
      "構成固定の長期本番＝RI、構成・サービスが変わる可能性あり＝Savings Plan、SA ライセンス保有＝AHB 併用、中断可バッチ＝Spot VM。",
  },
  {
    id: "az305-comp-enterprise-arch",
    category: "ガバナンス・監視・コスト",
    title: "エンタープライズ ID・非リレーショナル・移行・閉域設計一覧",
    subtitle: "CAF ランディングゾーン・ストレージ・データ統合・移行・Well-Architected 設計の選定軸",
    columns: ["設計領域", "主要 Azure サービス", "アーキテクチャ設計ポイント", "採用基準の決め手"],
    rows: [
      {
        feature: "ID・ガバナンス・監視設計",
        values: [
          "Microsoft Entra ID（条件付きアクセス）・Microsoft Defender for Cloud・Application Insights",
          "Azure ランディングゾーン（CAF）・タグ戦略・リージョンペアによるガバナンス統一",
          "組織全体のセキュリティ姿勢管理と分散 APM 監視の標準化",
        ],
      },
      {
        feature: "非リレーショナル ＆ 分析設計",
        values: [
          "Azure Blob Storage・Azure Files・Azure Synapse Analytics",
          "ADLS Gen2・Microsoft Fabric・不変ストレージ（WORM）を組み合わせた分析基盤",
          "大規模非構造化データ保管、共有ファイル、MPP 型データウェアハウス分析",
        ],
      },
      {
        feature: "閉域ネットワーク ＆ API 設計",
        values: [
          "VPN Gateway・ExpressRoute・Azure Private Link・Azure API Management",
          "ハブ＆スポーク / Virtual WAN 上で PaaS 閉域化と API レート制限を統合",
          "パブリック公開を排除しつつ安全なハイブリッド・API 連携を実現",
        ],
      },
      {
        feature: "移行 ＆ 設計評価フレームワーク",
        values: [
          "Azure Database Migration Service・Azure Storage Mover・Azure Well-Architected Framework",
          "Azure Migrate 検出→オンライン CDC/ファイル移行後に WAF 5 本柱で継続評価",
          "最小ダウンタイム移行と信頼性・セキュリティ・コスト最適化の両立",
        ],
      },
    ],
    decisionRule:
      "CAF ランディングゾーン＋タグ戦略で土台を固め、Private Link＋VPN Gateway/ExpressRoute で閉域化し、WAF 5 本柱で継続最適化する。",
  },
];

export const az305Patterns: AzureArchitecturePattern[] = [
  {
    id: "az305-pat-1",
    title: "CAF エンタープライズ ランディングゾーン＆一元監視構成",
    badge: "Governance & Sentinel",
    flow: [
      "管理グループ階層 (Platform / Landing Zones)",
      "Azure Policy (DeployIfNotExists 自動修復)",
      "中央 Log Analytics + DCR",
      "Microsoft Sentinel (SIEM / SOAR)",
    ],
    summary:
      "Cloud Adoption Framework (CAF) に沿って管理グループで権限とガバナンスを統制しつつ、全サブスクリプションのログを中央 Log Analytics と Microsoft Sentinel へ集約する企業基盤構成。",
    keyDesignPoints: [
      "Platform（Identity / Management / Connectivity）と Landing Zones（Corp / Online）でサブスクリプションを責務分離",
      "Azure Policy の DeployIfNotExists とマネージド ID により、新規作成リソースの診断設定や AMA / DCR 適用を自動化",
    ],
  },
  {
    id: "az305-pat-2",
    title: "ハブ＆スポーク型 閉域ハイブリッドネットワーク構成",
    badge: "Zero Trust Networking",
    flow: [
      "オンプレミス (ExpressRoute + VPN 冗長)",
      "Hub VNet (Azure Firewall / DNS Private Resolver)",
      "Spoke VNet (ワークロード)",
      "Private Endpoint (PaaS 閉域化)",
    ],
    summary:
      "オンプレミスとの冗長接続を Hub VNet で終端し、Spoke 間および外部通信を Azure Firewall と UDR で検査しつつ、PaaS へは Private Link 経由で閉域接続する構成。",
    keyDesignPoints: [
      "VNet ピアリングの非推移性を補うため、Spoke サブネットに Hub の Azure Firewall 宛て UDR（0.0.0.0/0 等）を設定",
      "Azure DNS Private Resolver と privatelink.* プライベート DNS ゾーンでオンプレミスから Private Endpoint の名前解決を実現",
    ],
  },
  {
    id: "az305-pat-3",
    title: "グローバル Active-Active Web＆データ分散構成",
    badge: "Multi-Region HA",
    flow: [
      "Azure Front Door + WAF",
      "複数リージョン AKS / App Service (AZ 冗長)",
      "SQL フェイルオーバー グループ / Cosmos DB",
    ],
    summary:
      "グローバル Anycast エッジの Azure Front Door でセキュリティ防御と高速ルーティングを行い、リージョン障害時にもエンドポイント変更なしで業務継続できる高可用性構成。",
    keyDesignPoints: [
      "リージョン内は可用性ゾーン（AZ）分散で単一施設障害を吸収し、リージョン障害は Front Door のヘルスプローブで自動切り離し",
      "SQL フェイルオーバー グループの不変リスナーや Cosmos DB マルチリージョン書き込みによりデータ層の RTO/RPO 要件を担保",
    ],
  },
  {
    id: "az305-pat-4",
    title: "メダリオン型 エンタープライズ データ統合・分析基盤",
    badge: "Analytics & Streaming",
    flow: [
      "オンプレ DB (ADF SHIR) / Event Hubs",
      "Azure Stream Analytics (リアルタイム集計)",
      "ADLS Gen2 (Bronze / Silver / Gold)",
      "Microsoft Fabric / Synapse + Power BI",
    ],
    summary:
      "バッチ ETL（Azure Data Factory）とリアルタイムストリーム（Event Hubs + Stream Analytics）を ADLS Gen2 上のメダリオン層へ統合し、BI 分析へ繋ぐデータ基盤構成。",
    keyDesignPoints: [
      "オンプレミス閉域 DB からのデータ抽出にはセルフホステッド統合ランタイム（SHIR）と Private Link を併用",
      "ADLS Gen2 の階層型名前空間（HNS）と Delta Lake / Parquet 形式で分析スキャン性能を向上",
    ],
  },
  {
    id: "az305-pat-5",
    title: "ゼロトラスト API ゲートウェイ＆イベント駆動マイクロサービス",
    badge: "App Integration",
    flow: [
      "Application Gateway (WAF v2)",
      "API Management (内部 VNet モード)",
      "Azure Container Apps / Functions",
      "Azure Service Bus (FIFO セッション)",
    ],
    summary:
      "WAF で L7 攻撃を遮断した通信を内部 VNet モードの API Management で認証・レート制御し、疎結合なマイクロサービスと Service Bus でスパイク吸収と順序保証を実現する構成。",
    keyDesignPoints: [
      "Service Bus のセッション・重複検出・デッドレターキューにより決済や在庫引当などの厳密な整合性を担保",
      "各サービス間および Azure Key Vault / DB 接続はすべてマネージド ID で行いシークレットレス化",
    ],
  },
  {
    id: "az305-pat-6",
    title: "段階的クラウド移行（アセスメント → CDC / 物理転送）構成",
    badge: "Cloud Migration",
    flow: [
      "Azure Migrate (検出・依存関係分析)",
      "Database Migration Service (オンライン CDC)",
      "Azure Data Box / AzCopy",
      "Azure SQL MI / VMSS (本番切替)",
    ],
    summary:
      "Azure Migrate で依存関係と適正サイズを評価した上で、DB は最小ダウンタイムの CDC、大容量ファイルは帯域計算に基づく物理または並列転送で安全に移行する構成。",
    keyDesignPoints: [
      "稼働中 SQL Server の継続同期には DMS オンライン移行や Managed Instance Link を用い停止時間を最小化",
      "移行後は Azure Backup・Azure Policy・Azure Hybrid Benefit / Savings Plan を直ちに適用してガバナンスとコストを最適化",
    ],
  },
];

export const az305Pitfalls: AzurePitfall[] = [
  {
    id: "az305-pit-1",
    trap: "「ハブ＆スポーク構成で VNet ピアリングを結べば、スポーク A からハブを経由してスポーク B やオンプレミスへ自動的に通信できる」と考える",
    whyWrong:
      "Azure の VNet ピアリングは非推移的（Non-transitive）であるため、ピアリング設定だけではハブ越しの自動ルーティングは成立しません。",
    correctApproach:
      "ハブ側に Azure Firewall 等の NVA を配置し、各スポークのサブネットに UDR（ユーザー定義ルート）でハブ経由の次ホップを指定するか、経過ルーティングを自動化する Azure Virtual WAN を採用する。",
  },
  {
    id: "az305-pit-2",
    trap: "「Azure SQL Database の TDE（透過的データ暗号化）を有効にしていれば、特権を持つ DBA からも機密列の平文を見られなくできる」と考える",
    whyWrong:
      "TDE はディスクやバックアップ等の保存時暗号化であり、DB エンジン内部で自動復号されるためクエリ権限を持つ DBA には平文が表示されます。",
    correctApproach:
      "DBA やクラウド管理者からも機密列（マイナンバー・カード番号等）の平文を秘匿したい場合は、クライアント側ドライバで暗号化・復号を行う Always Encrypted を設計する。",
  },
  {
    id: "az305-pit-3",
    trap: "「Azure Cosmos DB でスループットを高めるため、日付や定数ステータスをパーティションキーに選ぶ」",
    whyWrong:
      "カーディナリティが低い属性や単調増加する日付を選ぶと特定パーティションへ負荷が集中（ホットパーティション）し、429 スロットリングや論理パーティション上限（20 GB）に達します。",
    correctApproach:
      "ユーザー ID やテナント ID（あるいは複合パーティションキー）など、値の種類が多く読み取り・書き込みが均等分散する高カーディナリティ属性を選定する。",
  },
  {
    id: "az305-pit-4",
    trap: "「Azure Backup で日次バックアップを取得していれば、リージョン障害時に RTO 15 分以内で即時復旧する DR 要件も満たせる」と混同する",
    whyWrong:
      "Azure Backup は誤削除やランサムウェアからのポイントインタイム復元（RTO は復元サイズ依存で数時間〜）を目的としており、低 RTO/RPO の継続レプリケーションではありません。",
    correctApproach:
      "バックアップ保護（論理削除・不変コンテナー）とは別に、低 RTO/RPO が必要な VM には Azure Site Recovery (ASR)、Azure SQL にはフェイルオーバー グループ等の DR 機構を設計する。",
  },
  {
    id: "az305-pit-5",
    trap: "「直列依存するサービス（App Service 99.95% × SQL DB 99.99%）を組み合わせても、高い方の 99.99% が全体の SLA になる」と誤算する",
    whyWrong:
      "直列に依存するシステムはどちらか一方が停止すると全体が停止するため、複合 SLA は積（99.95% × 99.99% ≒ 99.94%）となり単体より低下します。",
    correctApproach:
      "目標 SLA を達成するため、並列冗長構成（`1 - (1 - SLA1) × (1 - SLA2)`）や可用性ゾーン分散、非同期メッセージング（Service Bus）による疎結合設計を組み合わせる。",
  },
  {
    id: "az305-pit-6",
    trap: "「VNet 内の閉域リソース（オンプレミス DB 等）へ接続する要件で、従来型 Consumption プランの Azure Functions や Logic Apps 従量課金プランを選ぶ」",
    whyWrong:
      "従来型の従量課金（Consumption）プランの Azure Functions や Logic Apps 従量課金プランはマルチテナント基盤のため、VNet 統合による閉域アクセスに対応していません。",
    correctApproach:
      "閉域 VNet リソースへの接続が必須なサーバーレス統合では、Azure Functions Flex Consumption / Premium プラン、Logic Apps Standard プラン、または Azure Container Apps を選定する。",
  },
];

export const az305KeyFacts: AzureKeyFact[] = [
  {
    id: "az305-kf-1",
    target: "管理グループ階層の最大深度",
    value: "最大 6 階層",
    detail: "ルート管理グループとサブスクリプション自体を除き最大 6 階層までネスト可能",
  },
  {
    id: "az305-kf-2",
    target: "複合 SLA の計算原則",
    value: "直列は積 / 並列は 1-(1-S1)(1-S2)",
    detail: "99.95% × 99.99% ≒ 99.94%（直列で低下）、99.9% の 2 重並列で 99.9999%（向上）",
  },
  {
    id: "az305-kf-3",
    target: "Cosmos DB 既定の整合性レベル",
    value: "Session（セッション）",
    detail: "5 種のうち既定値。同一セッション内での Read-Your-Writes と低遅延を両立",
  },
  {
    id: "az305-kf-4",
    target: "Cosmos DB 論理パーティション上限",
    value: "最大 20 GB",
    detail: "同一パーティションキー値の上限。高カーディナリティキーでホットパーティションを回避",
  },
  {
    id: "az305-kf-5",
    target: "SQL アクティブ geo レプリケーション",
    value: "最大 4 つの読取セカンダリ",
    detail: "単一 DB の非同期複製。SQL MI は非対応・接続先不変の自動切替はフェイルオーバー グループ",
  },
  {
    id: "az305-kf-6",
    target: "Azure SQL Database Hyperscale",
    value: "最大 100 TB 級まで自動拡張",
    detail: "ストレージスナップショットによる高速バックアップと最大複数読取レプリカのスケールアウト対応",
  },
  {
    id: "az305-kf-7",
    target: "Service Bus vs Queue Storage",
    value: "80 GB 超は Queue Storage",
    detail: "FIFO・重複排除・トランザクション・DLQ が必要なら Service Bus（上限 80 GB）",
  },
  {
    id: "az305-kf-8",
    target: "Log Analytics テーブル層",
    value: "Analytics / Basic / Auxiliary",
    detail: "フル KQL とアラートは Analytics、低コスト調査は Basic、超長期監査ログは Auxiliary",
  },
  {
    id: "az305-kf-9",
    target: "Savings Plan vs 予約インスタンス",
    value: "柔軟性 vs 最大割引率",
    detail: "RI は特定リージョン/SKU 固定で最大割引、Savings Plan はコンピュート横断で柔軟適用",
  },
  {
    id: "az305-kf-10",
    target: "大容量移行の回線計算目安",
    value: "データ量 (bit) ÷ 実効帯域 (bps)",
    detail: "転送期限内に回線速度で間に合わない場合は物理デバイスの Azure Data Box を選択",
  },
];

export const az305QuickLookup: CertFlashcardItem[] = [
  {
    keyword: "コードにパスワードやシークレットを持たせず Azure サービス間で安全に認証する仕組み",
    category: "ID・セキュリティ",
    recommended: "マネージド ID (Managed Identity)",
    reason: "Entra ID が自動で ID を管理・トークン発行するため、Key Vault や SQL DB へ資格情報なしで安全に接続できます。",
  },
  {
    keyword: "Owner 等の特権ロールを常時付与せず、必要時のみ承認付き・期限付きで一時昇格させる仕組み",
    category: "ID・ガバナンス",
    recommended: "Microsoft Entra PIM",
    reason: "Just-In-Time (JIT) の特権昇格、承認ワークフロー、MFA 要求、および監査証跡により特権侵害リスクを抑えます。",
  },
  {
    keyword: "取引先や外部パートナーの既存アカウントを自社テナントへ招待し共同作業する認証設計",
    category: "ID・認証",
    recommended: "Microsoft Entra B2B コラボレーション",
    reason: "外部ユーザーが自身の既存 ID を使ってサインインでき、追加パスワード管理なしにアクセス制御できます。",
  },
  {
    keyword: "一般消費者（B2C）向け Web/モバイルアプリのサインアップ・SNS ログイン基盤",
    category: "ID・認証",
    recommended: "Microsoft Entra External ID",
    reason: "自社社員向けテナントと分離された顧客向け ID 管理基盤としてセルフサービス登録やソーシャル認証を提供します。",
  },
  {
    keyword: "新規作成リソースを標準準拠へ強制し、非準拠リソースも自動で設定追加・修復する機能",
    category: "ガバナンス",
    recommended: "Azure Policy（DeployIfNotExists / Modify + 修復タスク）",
    reason: "RBAC（誰ができるか）ではなく構成ルール（何が許可されるか）を制御し、マネージド ID で自動修復します。",
  },
  {
    keyword: "複数 VM や Arc 環境のログをフィルタリング・加工し、複数ワークスペースへ振り分ける仕組み",
    category: "監視・ログ",
    recommended: "Azure Monitor Agent (AMA) + データ収集ルール (DCR)",
    reason: "不要なログを取り込み前に除外して Log Analytics 課金を抑え、ワークロード単位で柔軟にルーティングできます。",
  },
  {
    keyword: "Entra ID・Defender・Firewall 等のログを横断的に相関分析し、自動封じ込めを行う基盤",
    category: "セキュリティ・監視",
    recommended: "Microsoft Sentinel (SIEM / SOAR)",
    reason: "Log Analytics 上で脅威ハンティングとインシデント検出を行い、Logic Apps プレイブックで自動対応できます。",
  },
  {
    keyword: "SQL Server エージェント・クロス DB クエリ・CLR を維持したまま最小改修で移行できる PaaS",
    category: "データベース",
    recommended: "Azure SQL Managed Instance",
    reason: "最新の SQL Server データベースエンジンとほぼ 100% の互換性を保ちつつ、PaaS の自動パッチ・バックアップを享受できます。",
  },
  {
    keyword: "ピーク時間帯が異なる多数のマルチテナント SQL DB でパフォーマンス資源を共有しコスト最適化",
    category: "データベース",
    recommended: "Azure SQL Database Elastic Pool",
    reason: "単一 DB ごとに最大負荷で確保するより、プール全体で DTU/vCore を共有することで大幅なコスト圧縮が可能です。",
  },
  {
    keyword: "DB 管理者（DBA）やクラウド運用者からも特定列の平文を秘匿するデータベース暗号化機能",
    category: "セキュリティ・DB",
    recommended: "Always Encrypted",
    reason: "暗号鍵をクライアント側（または Key Vault 保護下）に置き、クライアントドライバ側でのみ復号するため DBA にも平文が見えません。",
  },
  {
    keyword: "ビッグデータ分析向けにディレクトリ単位の原子的操作と POSIX ACL を提供するデータレイク",
    category: "ストレージ・分析",
    recommended: "Azure Data Lake Storage Gen2 (ADLS Gen2)",
    reason: "Blob Storage 上で階層型名前空間（HNS）を有効化することで、Spark/Synapse からの分析スループットを大幅に向上します。",
  },
  {
    keyword: "規制要件により一定期間のファイル削除・上書きを完全にブロックする Blob 保護機能",
    category: "ストレージ・コンプライアンス",
    recommended: "不変ストレージ（WORM：時間ベース保持 / 訴訟ホールド）",
    reason: "コンテナーまたはバージョンレベルで改ざん不可（Write Once, Read Many）を強制し、管理者による削除も防ぎます。",
  },
  {
    keyword: "同一セッション内の読み取り整合性を保証しつつ高可用性と低遅延を両立する既定の整合性",
    category: "データベース",
    recommended: "Cosmos DB Session 整合性",
    reason: "自分の書き込みは即座に読める（Read-Your-Writes）一方、Strong のような高レイテンシ・高 RU コストを避けられます。",
  },
  {
    keyword: "オンプレミス閉域ネットワーク内の DB から Azure へ安全にバッチ抽出するパイプライン構成",
    category: "データ統合",
    recommended: "Azure Data Factory + セルフホステッド統合ランタイム (SHIR)",
    reason: "SHIR をオンプレまたは VNet 内に配置することで、ファイアウォールを開放せず送信通信で安全に ETL 抽出できます。",
  },
  {
    keyword: "Azure Disk・Blob・PostgreSQL・AKS のバックアップと不変保護を担う新しいコンテナー",
    category: "バックアップ・DR",
    recommended: "Azure Backup コンテナー（Backup Vault）",
    reason: "Recovery Services コンテナー（VM/SQL 向け）に加え、新しい PaaS/クラウドネイティブ資産の一元バックアップを提供します。",
  },
  {
    keyword: "リージョン障害時にアプリ接続文字列を変更せず複数の Azure SQL DB を自動フェイルオーバー",
    category: "ビジネス継続性",
    recommended: "Azure SQL フェイルオーバー グループ（Failover Groups）",
    reason: "不変の読み取り/書き込みリスナーエンドポイントにより、切替時のアプリ設定変更なしで迅速な DR を実現します。",
  },
  {
    keyword: "複数リージョンの Web/API に対し Anycast IP・エッジキャッシュ・L7 WAF・高速切替を提供",
    category: "ネットワーク・HA",
    recommended: "Azure Front Door",
    reason: "Microsoft のグローバルエッジネットワーク上で TLS 終端・WAF 防御・キャッシュを行い、障害リージョンを即座に切り離します。",
  },
  {
    keyword: "HTTP/HTTPS に限らず TCP/UDP 通信も含め、DNS ベースでグローバル負荷分散するサービス",
    category: "ネットワーク・HA",
    recommended: "Azure Traffic Manager",
    reason: "パフォーマンス・加重・優先度・地理ベースの DNS 応答によってクライアントを最適なリージョンへ誘導します。",
  },
  {
    keyword: "Kubernetes クラスタ運用を不要にし KEDA・Dapr・ゼロスケールに対応するマイクロサービス基盤",
    category: "コンピュート",
    recommended: "Azure Container Apps (ACA)",
    reason: "AKS のようなコントロールプレーンやノード維持管理なしで、イベント駆動のコンテナスケーリングを実現します。",
  },
  {
    keyword: "FIFO 順序保証・トランザクション・重複排除・DLQ が求められる業務メッセージング基盤",
    category: "アプリ統合",
    recommended: "Azure Service Bus",
    reason: "セッション機能とエンタープライズ級メッセージブローカー機能により、決済や注文処理の信頼性を担保します。",
  },
  {
    keyword: "Blob アップロードやリソース作成などの離散イベントをフィルタリングしプッシュ配信する基盤",
    category: "アプリ統合",
    recommended: "Azure Event Grid",
    reason: "ポーリング不要でイベント発生を即座に Functions や Logic Apps へ通知するサーバーレスイベントルーターです。",
  },
  {
    keyword: "非推移的な VNet ピアリング環境でスポーク間・外部通信を中央検査してルーティングする構成",
    category: "ネットワーク",
    recommended: "ハブ＆スポーク + Azure Firewall + UDR",
    reason: "スポークのサブネットにユーザー定義ルートを設定し、すべてのトラフィックを Hub の Firewall 経由に強制します。",
  },
  {
    keyword: "多拠点ブランチ VPN・ExpressRoute・複数リージョンハブ間の経過ルーティングを自動化する基盤",
    category: "ネットワーク",
    recommended: "Azure Virtual WAN (Standard)",
    reason: "手動の UDR や VNet ピアリング管理を不要にし、拠点間・リージョン間の Any-to-Any 接続をマネージドで提供します。",
  },
  {
    keyword: "SA 付き Windows Server / SQL Server ライセンスを Azure へ持ち込んで費用削減する特典",
    category: "コスト最適化",
    recommended: "Azure Hybrid Benefit (AHB)",
    reason: "既存オンプレミスのソフトウェアアシュアランス特典により、VM や SQL PaaS のライセンス課金を大幅に抑えられます。",
  },
];

export const az305PracticeQuestions: CertQuestion[] = [
  {
    id: "az305-q1",
    domainId: "az305-domain-1",
    domainLabel: "01: ID・ガバナンス・監視設計",
    difficulty: "標準",
    selectCount: 1,
    question:
      "大規模エンタープライズの複数サブスクリプションにおいて、Azure リソースおよび仮想マシンの診断ログを収集する設計を行っています。セキュリティ監査要件として「7 年間の改ざん防止アーカイブを最小コストで保持すること」、運用要件として「直近 90 日間のログに対して KQL による対話分析とアラート発火を行うこと」の両立が求められています。最適な構成はどれですか？",
    options: [
      "すべてのログを Log Analytics ワークスペースの Analytics 層で 7 年間保持する設定だけを構成する",
      "診断設定およびデータ収集ルール (DCR) を構成し、直近の分析・アラート用は Log Analytics ワークスペースへ、長期コンプライアンス保管用は不変ストレージ (WORM) 有効の Azure Storage Account へ並列ルーティングする",
      "すべての仮想マシンにローカルテキストファイルとして 7 年分保存し、必要時のみ RDP 接続して確認する",
      "Azure Key Vault へすべての診断ログをシークレットとして格納する",
    ],
    correctIndices: [1],
    explanation:
      "診断設定や DCR は単一ソースから複数の出力先へ並列送信できます。高頻度の KQL 分析・アラートは Log Analytics（例：90 日保持）、長期の低コスト・改ざん防止保管は WORM 有効の Storage Account（Archive/Cool 層）へ分離するのが定石です。",
    keywords: ["診断設定", "DCR", "Log Analytics", "不変ストレージ"],
  },
  {
    id: "az305-q2",
    domainId: "az305-domain-1",
    domainLabel: "01: ID・ガバナンス・監視設計",
    difficulty: "標準",
    selectCount: 1,
    question:
      "一般消費者向けに公開する新規 Web サービス（Azure App Service 上で稼働）を設計しています。利用者は Google アカウントや自身のメールアドレスでセルフサービスサインアップできる必要があり、一方で App Service からバックエンドの Azure Key Vault および Azure SQL Database へ接続する際にはコード内に資格情報を一切保存したくありません。最適な組み合わせはどれですか？",
    options: [
      "利用者の認証には Microsoft Entra B2B を使用し、バックエンド接続には接続文字列を App Service の環境変数に平文で登録する",
      "利用者の認証基盤には Microsoft Entra External ID を採用し、App Service から Key Vault / SQL DB へのアクセスにはマネージド ID を構成する",
      "社内テナントに一般消費者全員を通常メンバーとして手動登録し、Key Vault アクセスにはサービスプリンシパルのシークレットをソースコードに埋め込む",
      "匿名アクセスを全リソースで許可し、ファイアウォールのみを設定する",
    ],
    correctIndices: [1],
    explanation:
      "一般消費者（B2C）向けの外部認証基盤には Microsoft Entra External ID（旧 B2C の次世代構成）を使用し、Azure サービス間の資格情報レス認証にはマネージド ID を構成するのが標準設計です。",
    keywords: ["Entra External ID", "マネージド ID", "Key Vault"],
  },
  {
    id: "az305-q3",
    domainId: "az305-domain-1",
    domainLabel: "01: ID・ガバナンス・監視設計",
    difficulty: "応用",
    selectCount: 1,
    question:
      "Cloud Adoption Framework (CAF) に準拠したランディングゾーンにおいて、今後作成されるすべてのサブスクリプションおよびストレージアカウントに対し「特定の承認済みリージョン以外での作成を禁止すること」と「新規・既存のストレージアカウントへ診断設定を自動適用して構成ドリフトを防ぐこと」を両立したいです。最適な実装方法はどれですか？",
    options: [
      "各開発者に Contributor ロールではなく Owner ロールを付与し、社内マニュアルで順守を呼びかける",
      "対象管理グループに『許可された場所 (Deny)』と『診断設定の自動展開 (DeployIfNotExists)』を含む Azure Policy イニシアチブを割り当て、マネージド ID による修復タスクを実行する",
      "Azure Advisor のコスト推奨設定を有効化する",
      "リソースロック（ReadOnly）をルート管理グループへ直接設定する",
    ],
    correctIndices: [1],
    explanation:
      "リージョン制限の強制には Deny 効果のポリシー、診断設定やタグなどの自動構成・既存修復には DeployIfNotExists / Modify 効果のポリシーと修復タスク（マネージド ID 権限付与）を管理グループへ適用します。",
    keywords: ["Azure Policy", "DeployIfNotExists", "CAF", "管理グループ"],
  },
  {
    id: "az305-q4",
    domainId: "az305-domain-1",
    domainLabel: "01: ID・ガバナンス・監視設計",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "本番サブスクリプションの運用チームに対し、平時は閲覧権限のみを持たせ、緊急メンテナンス時のみ最大 4 時間だけ Contributor 権限へ昇格できるようにしたいです。昇格時にはセキュリティ責任者の承認、MFA 認証、および準拠済み管理デバイスからのアクセスを必須としたい場合、組み合わせるべき Microsoft Entra 機能はどれですか？",
    options: [
      "Microsoft Entra PIM（Privileged Identity Management）と条件付きアクセス",
      "Microsoft Entra Connect Sync のみ",
      "Azure Front Door と Azure Traffic Manager",
      "Shared Access Signature (SAS) とアクセスキー",
    ],
    correctIndices: [0],
    explanation:
      "Entra PIM で対象ロールを Eligible（対象）として登録し承認・期限・MFA 条件を設定し、条件付きアクセスでデバイスコンプライアンスを検証することでゼロトラストな特権アクセス管理を実現できます。",
    keywords: ["Entra PIM", "条件付きアクセス", "JIT 特権管理"],
  },
  {
    id: "az305-q5",
    domainId: "az305-domain-1",
    domainLabel: "01: ID・ガバナンス・監視設計",
    difficulty: "応用",
    selectCount: 2,
    question:
      "マルチクラウドおよびオンプレミス（Azure Arc 対応サーバー）を含むハイブリッド環境全体のセキュリティ態勢評価（CSPM）と、インシデント発生時の横断的な相関分析・自動隔離（SIEM/SOAR）を設計しています。アーキテクチャ上採用すべき 2 つの設計要素を選択してください。",
    options: [
      "Microsoft Defender for Cloud を有効化し、セキュアスコアによる構成脆弱性可視化とワークロード向け脅威保護を適用する",
      "Microsoft Sentinel を中央 Log Analytics ワークスペースで有効化し、Defender for Cloud や Entra ID・Firewall ログを相関分析して Logic Apps プレイブックで自動対処する",
      "セキュリティログを一切保存しない設定にし、コストをゼロにする",
      "すべてのサーバーの RDP / SSH ポート (3389 / 22) をインターネットへ常時開放する",
    ],
    correctIndices: [0, 1],
    explanation:
      "CSPM およびワークロード保護は Microsoft Defender for Cloud、クラウドネイティブ SIEM/SOAR による横断相関分析と自動レスポンスは Microsoft Sentinel + Logic Apps プレイブックの連携が標準設計です。",
    keywords: ["Defender for Cloud", "Microsoft Sentinel", "SOAR"],
  },
  {
    id: "az305-q6",
    domainId: "az305-domain-2",
    domainLabel: "02: データ ストレージ設計",
    difficulty: "応用",
    selectCount: 1,
    question:
      "オンプレミスで稼働中の基幹業務システム用 SQL Server を Azure へ移行します。アプリケーションは SQL Server エージェントによる夜間バッチジョブ、複数データベースをまたぐクロス DB クエリ、および CLR ストアドプロシージャに依存していますが、OS パッチ管理やハードウェア保守などのインフラ運用はできる限り Azure 側へ委ねて PaaS として運用したいです。最適な移行先はどれですか？",
    options: [
      "Azure SQL Database（単一データベース）",
      "Azure SQL Managed Instance",
      "Azure Table Storage",
      "Azure Database for PostgreSQL",
    ],
    correctIndices: [1],
    explanation:
      "Azure SQL Managed Instance は SQL Server エージェント、クロス DB クエリ、CLR、リンクサーバーなどオンプレミス SQL Server との高いインスタンスレベル互換性を備えつつ、OS/DB 管理を委ねられる PaaS です。",
    keywords: ["SQL Managed Instance", "SQL Server 移行", "互換性"],
  },
  {
    id: "az305-q7",
    domainId: "az305-domain-2",
    domainLabel: "02: データ ストレージ設計",
    difficulty: "標準",
    selectCount: 1,
    question:
      "50 社以上の顧客ごとにデータベースを分離した SaaS アプリケーションを Azure SQL Database で構築しています。顧客ごとに利用ピーク時間帯が異なり大半の時間帯は低負荷であるため、総コストを抑えたいです。さらに、DB に保存する顧客の機密情報列はデータベース管理者（DBA）がクエリを実行しても平文で閲覧できないように設計する必要があります。最適な構成はどれですか？",
    options: [
      "50 個の DB にそれぞれ最大負荷基準の単一 Business Critical プランを割り当て、TDE のみを有効化する",
      "50 個の DB を Azure SQL Elastic Pool にまとめてリソース共有でコストを最適化し、機密情報列には Always Encrypted を適用する",
      "全顧客のデータを単一の Azure Blob Storage CSV ファイルに格納する",
      "SQL Server on Azure VM を 50 台構築し、Dynamic Data Masking のみを設定する",
    ],
    correctIndices: [1],
    explanation:
      "ピーク時間帯がずれる複数 DB 群のリソース共有によるコスト最適化には Elastic Pool を使用し、特権 DBA からも機密列の平文を秘匿する要件にはクライアント側暗号化の Always Encrypted を採用します。",
    keywords: ["Elastic Pool", "Always Encrypted", "マルチテナント"],
  },
  {
    id: "az305-q8",
    domainId: "az305-domain-2",
    domainLabel: "02: データ ストレージ設計",
    difficulty: "応用",
    selectCount: 1,
    question:
      "グローバル規模のオンラインゲーム向けプレイヤープロフィール＆所持アイテム基盤を Azure Cosmos DB for NoSQL で設計しています。プレイヤーがアイテムを購入した直後は、同じユーザーのセッション内で確実に最新状態を即時読み取れる必要がありますが、他プレイヤーのプロフィール反映にはわずかな遅延を許容でき、コストとスループットを最優先したいです。またホットパーティションを防ぐキー設計が求められます。最適な構成はどれですか？",
    options: [
      "整合性レベルを Strong に変更し、パーティションキーに購入日（YYYY-MM-DD）を設定する",
      "整合性レベルは既定の Session を維持し、パーティションキーにはカーディナリティが高く負荷が均等分散する playerId（または複合キー）を選定する",
      "整合性レベルを Eventual に変更し、パーティションキーに固定定数 \"all-users\" を設定する",
      "整合性レベルを Bounded Staleness にし、パーティションキーにアイテムカテゴリ（3 種類のみ）を設定する",
    ],
    correctIndices: [1],
    explanation:
      "同一セッション内の Read-Your-Writes 要件に最も適合し、性能と RU コストのバランスに優れるのが既定の Session 整合性です。パーティションキーは負荷分散のため高カーディナリティな playerId 等を選びます。",
    keywords: ["Cosmos DB", "Session 整合性", "パーティションキー"],
  },
  {
    id: "az305-q9",
    domainId: "az305-domain-2",
    domainLabel: "02: データ ストレージ設計",
    difficulty: "標準",
    selectCount: 1,
    question:
      "数ペタバイト規模の IoT 分析データをクラウド上のデータレイクへ蓄積します。データ処理ジョブ（Spark）ではフォルダ単位の原子的リネームとディレクトリ/ファイル単位の POSIX ACL によるアクセス制御が必要です。さらに監査データ用コンテナーについては、規制順守のため 5 年間はサブスクリプション管理者であっても削除・上書きができないようにロックする必要があります。最適な構成はどれですか？",
    options: [
      "階層型名前空間（HNS）が無効な汎用 Blob Storage を作成し、リソースロック (CanNotDelete) のみを設定する",
      "階層型名前空間（HNS）を有効化した Azure Data Lake Storage Gen2 (ADLS Gen2) を構成し、監査データ用コンテナーに時間ベースの不変ストレージポリシー（WORM）を設定する",
      "Azure Files Premium のみを作成し、SMB 共有で全員にフルコントロールを付与する",
      "Azure Managed Disks を 100 本連結して仮想マシン上で RAID 構成を組む",
    ],
    correctIndices: [1],
    explanation:
      "ビッグデータ処理向けの POSIX ACL・原子的ディレクトリ操作には ADLS Gen2（HNS 有効）が必須です。また、管理者であっても一定期間データの削除・変更を禁止するコンプライアンス要件には不変ストレージ（WORM）のロック済みポリシーを用います。",
    keywords: ["ADLS Gen2", "階層型名前空間", "不変ストレージ WORM"],
  },
  {
    id: "az305-q10",
    domainId: "az305-domain-2",
    domainLabel: "02: データ ストレージ設計",
    difficulty: "標準",
    selectCount: 2,
    question:
      "製造業向けのデータ分析プラットフォームを設計しています。「オンプレミスの閉域工場 DB から夜間にバッチデータを安全に抽出してクラウドへ取り込む要件」と「稼働中の生産ラインから毎秒数万件送信されるセンサーデータをリアルタイムに集計し、1 分ウィンドウで異常値を検知する要件」の 2 つを満たす適切なサービス選定を 2 つ選択してください。",
    options: [
      "Azure Data Factory にセルフホステッド統合ランタイム (SHIR) を構成し、オンプレミス閉域 DB からの夜間バッチ抽出を実行する",
      "Azure Event Hubs で大量のセンサーイベントストリームを取り込み、Azure Stream Analytics の時間ウィンドウ SQL クエリで異常検知を実行する",
      "オンプレミス DB のポート 1433 をパブリックインターネットへ全開放して外部から直接参照する",
      "リアルタイム異常検知のために Azure Data Box を毎日トラックで配送する",
    ],
    correctIndices: [0, 1],
    explanation:
      "閉域オンプレ DB からのバッチ抽出は ADF + セルフホステッド統合ランタイム (SHIR)、高スループットのリアルタイムイベント取り込みと時間ウィンドウ集計は Event Hubs + Stream Analytics が王道設計です。",
    keywords: ["Azure Data Factory", "SHIR", "Event Hubs", "Stream Analytics"],
  },
  {
    id: "az305-q11",
    domainId: "az305-domain-3",
    domainLabel: "03: ビジネス継続性設計",
    difficulty: "応用",
    selectCount: 1,
    question:
      "Web アプリケーションを単一リージョンの Azure App Service（SLA 99.95%）に配置し、同アプリが単一リージョンの Azure SQL Database（SLA 99.99%）へ同期的に直列接続して業務処理を行います。追加の並列冗長化や待機系を一切設けない構成において、このシステム全体の複合 SLA（Composite SLA）はどのように評価されますか？",
    options: [
      "高い方の SLA が採用され、全体として 99.99% になる",
      "直列依存のため各コンポーネント SLA の積（99.95% × 99.99% ≒ 99.94%）となり、単体より低下する",
      "両者の平均値である 99.97% になる",
      "並列冗長計算が適用され、99.9999% に向上する",
    ],
    correctIndices: [1],
    explanation:
      "直列に依存するシステムではいずれか一方が停止してもシステム全体が停止するため、複合 SLA は各コンポーネント SLA の掛け算（0.9995 × 0.9999 ≒ 0.99940005 ＝ 約 99.94%）となり、単体要素より低くなります。",
    keywords: ["複合 SLA", "直列依存", "可用性設計"],
  },
  {
    id: "az305-q12",
    domainId: "az305-domain-3",
    domainLabel: "03: ビジネス継続性設計",
    difficulty: "応用",
    selectCount: 1,
    question:
      "東日本リージョンをプライマリとする基幹業務システムの Azure SQL Database（複数 DB 連携）について、大規模災害により東日本リージョン全体が利用不能となった場合でも、アプリケーションの接続文字列を変更することなく西日本リージョンへ自動フェイルオーバーさせ、RPO 数秒・RTO 1 分以内で業務を継続したいです。最適な DR 設計はどれですか？",
    options: [
      "Azure Backup の長期保持（LTR）スナップショットのみを 1 日 1 回取得する",
      "東日本と西日本の間で Azure SQL フェイルオーバー グループ（Failover Groups）を構成し、読み取り/書き込みリスナーエンドポイントをアプリケーションに設定する",
      "単一 DB に対してアクティブ geo レプリケーションを設定し、障害発生時は運用者が全アプリの接続文字列を手動書き換えする",
      "ローカル冗長ストレージ（LRS）のみの VM 上にデータベースを移行する",
    ],
    correctIndices: [1],
    explanation:
      "Azure SQL フェイルオーバー グループは、複数の DB をまとめて別リージョンへ自動フェイルオーバーでき、かつ不変の読み取り/書き込みリスナーエンドポイント（<group>.database.windows.net）によりアプリ側の接続文字列変更が不要です。",
    keywords: ["SQL フェイルオーバー グループ", "自動フェイルオーバー", "DR"],
  },
  {
    id: "az305-q13",
    domainId: "az305-domain-3",
    domainLabel: "03: ビジネス継続性設計",
    difficulty: "標準",
    selectCount: 1,
    question:
      "独自開発のリアルタイム通信サーバー（HTTP/HTTPS ではなく独自の TCP/UDP プロトコルを使用）を複数リージョンの VM スケール セットにデプロイしています。世界中のクライアントを最もネットワーク遅延が小さい正常リージョンへ誘導し、リージョン障害時にはヘルスチェックにより別リージョンへ自動切り替えたい場合、最適なロードバランシングサービスはどれですか？",
    options: [
      "Azure Front Door",
      "Azure Application Gateway",
      "Azure Traffic Manager（パフォーマンス ルーティング方式）",
      "Azure Content Delivery Network (CDN) のみ",
    ],
    correctIndices: [2],
    explanation:
      "Azure Front Door と Application Gateway は HTTP/HTTPS（L7）専用です。TCP/UDP などの非 HTTP プロトコルをグローバルにリージョン間ルーティング・フェイルオーバーする場合は DNS ベースの Azure Traffic Manager（パフォーマンス方式）を選定します。",
    keywords: ["Azure Traffic Manager", "非 HTTP", "グローバルルーティング"],
  },
  {
    id: "az305-q14",
    domainId: "az305-domain-3",
    domainLabel: "03: ビジネス継続性設計",
    difficulty: "標準",
    selectCount: 1,
    question:
      "ランサムウェア攻撃によって特権アカウントが侵害された場合でも、本番 Azure VM および Azure Database for PostgreSQL のバックアップデータが攻撃者によって即座に完全消去されない多層防御が必要です。同時に、東日本リージョン災害時に複数の本番 Azure VM を定義済み起動順序に従って西日本リージョンへ迅速フェイルオーバーさせたい場合、最適な設計はどれですか？",
    options: [
      "論理削除・不変コンテナーおよびマルチユーザー承認（MUA）を有効化した Recovery Services / Backup コンテナーでバックアップを保護し、リージョン間の VM 復旧には Azure Site Recovery (ASR) と復旧計画を使用する",
      "本番 VM のスナップショットを同一サブスクリプションのローカルディスク上にのみ保存する",
      "Azure Front Door だけで VM の OS データを自動バックアップする",
      "Azure Policy で全リージョンの VM 作成を Deny にする",
    ],
    correctIndices: [0],
    explanation:
      "バックアップデータの破壊対策には論理削除・不変コンテナー・MUA（重大操作に別の承認者を必須化）を組み合わせ、VM 群の低 RTO リージョン切替と依存順序復旧には ASR の復旧計画を設計します。",
    keywords: ["Azure Backup", "不変コンテナー", "MUA", "Azure Site Recovery"],
  },
  {
    id: "az305-q15",
    domainId: "az305-domain-3",
    domainLabel: "03: ビジネス継続性設計",
    difficulty: "応用",
    selectCount: 2,
    question:
      "グローバル規模の E コマース基盤において、高可用性と L7 エッジセキュリティの設計見直しを行っています。「世界中からの HTTPS リクエストを最寄りエッジで終端・キャッシュ・WAF 防御しつつ、リージョン障害時は即座に別リージョンへ切り替えること」および「各リージョン内での単一データセンター施設（電源・空調）障害でも AKS クラスタが停止しないこと」の 2 要件を満たす設計を選択してください。",
    options: [
      "グローバルエントリポイントとして Azure Front Door（Premium + WAF + キャッシュ）を配置し、複数リージョンのバックエンドを監視・自動切替する",
      "各リージョン内の AKS ノードプールおよびストレージ/DB を複数の可用性ゾーン（Availability Zones）にまたがって分散配置する",
      "可用性ゾーンを使わず、単一リージョンの単一ゾーンにすべての VM を集約する",
      "L7 WAF としてネットワークセキュリティグループ (NSG) のポート番号許可のみを使用する",
    ],
    correctIndices: [0, 1],
    explanation:
      "グローバル L7 入口・WAF・エッジキャッシュ・リージョン間高速フェイルオーバーには Azure Front Door、単一データセンター（施設）障害耐性には複数可用性ゾーン（AZ）分散配置を組み合わせます。",
    keywords: ["Azure Front Door", "WAF", "可用性ゾーン (AZ)"],
  },
  {
    id: "az305-q16",
    domainId: "az305-domain-4",
    domainLabel: "04: インフラストラクチャ設計",
    difficulty: "標準",
    selectCount: 1,
    question:
      "開発チームがコンテナ化された複数のマイクロサービスを構築しています。要件として「Azure Service Bus のキュー長に応じた自動スケール（KEDA）」「アクセスがない時間帯のゼロスケールによるコスト削減」「Dapr による状態管理・サービス間連携」が求められていますが、社内に Kubernetes クラスタのコントロールプレーンやバージョンアップを管理する専任 SRE はいません。最適なコンピュート基盤はどれですか？",
    options: [
      "Azure Virtual Machines 上へ手動で Docker を構築する",
      "Azure Container Apps (ACA)",
      "Azure Batch",
      "Azure Site Recovery",
    ],
    correctIndices: [1],
    explanation:
      "Azure Container Apps (ACA) はフルマネージドなサーバーレスコンテナ基盤であり、K8s クラスタ運用を隠蔽したまま KEDA オートスケール・ゼロスケール・Dapr 統合・VNet 分離を提供します。",
    keywords: ["Azure Container Apps", "KEDA", "Dapr", "サーバーレスコンテナ"],
  },
  {
    id: "az305-q17",
    domainId: "az305-domain-4",
    domainLabel: "04: インフラストラクチャ設計",
    difficulty: "応用",
    selectCount: 1,
    question:
      "決済および在庫引当を行う分散システム間で非同期メッセージを連携する基盤を設計しています。ビジネス要件として「同一注文 ID 内での厳密な先入れ先出し（FIFO）順序保証」「ネットワーク再送時に同一メッセージを二重処理しない重複検出機能」「処理失敗メッセージを後続調査用に退避するデッドレターキュー（DLQ）」が必須です。最も適したサービスはどれですか？",
    options: [
      "Azure Queue Storage",
      "Azure Event Grid",
      "Azure Service Bus（セッションおよび重複検出有効）",
      "Azure Data Lake Storage Gen2",
    ],
    correctIndices: [2],
    explanation:
      "FIFO 順序保証（セッション機能）、自動重複検出、トランザクション、デッドレターキュー (DLQ) などのエンタープライズメッセージング機能を標準提供するサービスは Azure Service Bus です。",
    keywords: ["Azure Service Bus", "FIFO", "重複検出", "DLQ"],
  },
  {
    id: "az305-q18",
    domainId: "az305-domain-4",
    domainLabel: "04: インフラストラクチャ設計",
    difficulty: "応用",
    selectCount: 1,
    question:
      "オンプレミスのデータセンターにある 50 台の仮想マシンと 150 TB の映像アーカイブを Azure へ移行するプロジェクトを計画しています。まずマシン間の通信依存関係と移行後の適正サイジング・コスト試算を行う必要があり、さらに 150 TB の映像データは現在利用可能な 100 Mbps 回線で 10 日以内に Azure Blob Storage へ格納しなければなりません。最適な設計はどれですか？",
    options: [
      "依存関係分析も 150 TB 転送もすべて AzCopy コマンドのみで 100 Mbps 回線上から 10 日以内に実行する",
      "サーバー検出・依存関係マッピング・コスト評価には Azure Migrate を使用し、100 Mbps 回線では 10 日間で約 10 TB 程度しか転送できないため 150 TB のデータ移行には Azure Data Box（物理デバイス）を採用する",
      "Azure Migrate だけを使えば 150 TB のデータが回線帯域に関係なく一瞬で圧縮転送される",
      "150 TB の映像データを Azure SQL Database の BLOB 列へ直接挿入する",
    ],
    correctIndices: [1],
    explanation:
      "100 Mbps（理論値約 12.5 MB/s ≒ 約 1.08 TB/日）では 10 日間でも約 10 TB 強しか転送できず 150 TB は物理的に間に合いません。依存関係分析とサイズ試算には Azure Migrate、帯域を超える大容量初期移行には Azure Data Box を組み合わせます。",
    keywords: ["Azure Migrate", "Azure Data Box", "帯域計算"],
  },
  {
    id: "az305-q19",
    domainId: "az305-domain-4",
    domainLabel: "04: インフラストラクチャ設計",
    difficulty: "応用",
    selectCount: 2,
    question:
      "世界 30 拠点以上の支社（SD-WAN / IPsec VPN）および本社データセンター（ExpressRoute）を、東日本・米国東部・西欧州の複数 Azure リージョンと統合接続し、拠点間およびリージョンハブ間の経過ルーティング（Any-to-Any トランジット）を手間なく自動構成したいと考えています。さらに、各支社および Azure 上のワークロードから Azure Storage / Azure SQL Database へインターネットを経由せずプライベート IP でアクセスしたいです。適切な 2 つを選択してください。",
    options: [
      "Azure Virtual WAN (Standard) を導入し、多拠点 VPN・ExpressRoute・複数リージョンハブ間の自動経過ルーティングを構成する",
      "Azure Storage と Azure SQL Database に Private Endpoint（Azure Private Link）を構成し、Azure DNS Private Resolver とプライベート DNS ゾーンでオンプレミスからの名前解決を実現する",
      "すべての拠点と全リージョンのスポーク VNet 同士を個別にフルメッシュ VNet ピアリングする",
      "PaaS サービスへのアクセスはすべてパブリックエンドポイントのまま『すべてのネットワークを許可』に設定する",
    ],
    correctIndices: [0, 1],
    explanation:
      "多拠点 SD-WAN/VPN・ExpressRoute と複数リージョンハブのフルメッシュ自動ルーティングには Azure Virtual WAN (Standard)、PaaS の閉域化とオンプレからの名前解決には Private Endpoint + Azure DNS Private Resolver を採用します。",
    keywords: ["Azure Virtual WAN", "Private Endpoint", "DNS Private Resolver"],
  },
  {
    id: "az305-q20",
    domainId: "az305-domain-4",
    domainLabel: "04: インフラストラクチャ設計",
    difficulty: "標準",
    selectCount: 2,
    question:
      "Azure Well-Architected Framework (WAF) のコスト最適化の柱に基づき、クラウド利用料を継続的に削減する設計を行っています。「今後 3 年間で複数リージョンにわたり VM ファミリの変更や Azure Container Apps / App Service へのモダナイズが見込まれる常時稼働コンピュート群」と「途中で割り込み停止してもチェックポイントから再実行可能な夜間レンダリング／科学計算バッチ」に対して、それぞれ最適なコスト削減アプローチを 2 つ選択してください。",
    options: [
      "リージョンやコンピュートサービスの柔軟な変更が見込まれる常時稼働基盤には、Azure Savings Plan for Compute を適用する",
      "割り込み停止を許容できる夜間レンダリング／計算バッチには、Azure Spot VM（または Azure Batch + Spot）を採用する",
      "将来のサービス変更が確実であるにもかかわらず、特定リージョン・特定 VM SKU 固定の予約インスタンスのみを 100% 全量購入する",
      "常時稼働のユーザー向け本番データベースを Azure Spot VM 上で単一ノード運用する",
    ],
    correctIndices: [0, 1],
    explanation:
      "構成変更やサーバーレス/コンテナ移行が見込まれる場合はリージョン・サービス横断で自動適用される Azure Savings Plan for Compute、中断許容のバッチには Azure Spot VM が最適です（RI は構成固定分に限定して併用します）。",
    keywords: ["Azure Savings Plan", "Azure Spot VM", "Well-Architected Framework"],
  },
];

export const az305OfficialResources: AzureOfficialResource[] = [
  {
    title: "Microsoft Certified: Azure Solutions Architect Expert 認定",
    description:
      "資格の全体像、前提資格（AZ-104）、スキル要件および更新ポリシーを確認できる公式認定ページです。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/azure-solutions-architect/",
    badge: "公式認定ページ",
  },
  {
    title: "Exam AZ-305 試験ガイド (Study Guide)",
    description:
      "4 つの出題領域の配分比率、評価対象スキル、出題範囲の変更履歴を確認できる一次情報です。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/resources/study-guides/az-305",
    badge: "公式試験ガイド",
  },
  {
    title: "Exam AZ-305: Designing Microsoft Azure Infrastructure Solutions",
    description:
      "試験概要・受験予約・模擬テスト（Practice Assessment）へアクセスできる公式試験ページです。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/exams/az-305/",
    badge: "公式試験ページ",
  },
  {
    title: "コース AZ-305T00 公式ラーニングパス",
    description:
      "ID・ガバナンス・データストレージ・事業継続・インフラ設計を体系的に学べる Microsoft Learn 公式コースです。",
    url: "https://learn.microsoft.com/ja-jp/training/courses/az-305t00",
    badge: "公式トレーニング",
  },
];
