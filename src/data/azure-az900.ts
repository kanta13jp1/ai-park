// 出典: Microsoft Learn Exam AZ-900 公式試験ガイド (Study guide for Exam AZ-900)
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

export const az900ExamFacts: CertExamFact[] = [
  { label: "対象試験", value: "Exam AZ-900", detail: "Azure Fundamentals・クラウド基礎" },
  { label: "試験時間", value: "45 分", detail: "着席目安 65 分・全体案内含む" },
  { label: "合格スコア", value: "700 / 1000", detail: "スケールスコア 100〜1000 点" },
  { label: "有効期限", value: "無期限（更新不要）", detail: "Fundamentals 資格は失効しない" },
  { label: "受験形式", value: "Pearson VUE", detail: "テストセンター / オンライン監督試験" },
  { label: "試験形式", value: "選択・分類問題", detail: "ドラッグ＆ドロップ・複数選択等" },
];

export const az900Domains: AzureDomain[] = [
  {
    id: "az900-domain-1",
    number: "01",
    title: "クラウドの概念",
    englishTitle: "Describe cloud concepts",
    weight: "25〜30%",
    accentColor: "indigo",
    summary:
      "クラウドコンピューティングの基本定義、責任共有モデル、パブリック・プライベート・ハイブリッドの展開モデル、CapEx/OpEx と従量課金、IaaS・PaaS・SaaS の違いを体系的に学びます。",
    topics: [
      {
        id: "az900-1-1",
        code: "1.1",
        title: "クラウド定義と責任共有モデル",
        services: ["クラウドコンピューティング", "責任共有モデル", "Azure データセンター"],
        keyPoints: [
          "クラウドコンピューティングは、サーバー・ストレージ・ネットワーク・分析等のコンピューティングサービスをインターネット経由でオンデマンド提供する仕組み",
          "物理セキュリティ・物理ホスト・物理ネットワークの保護は、どのサービス形態でも常に Microsoft（クラウドプロバイダー）の責任範囲",
          "情報・データ、デバイス、アカウント・ID の管理は、オンプレミス／IaaS／PaaS／SaaS のいずれでも常に顧客の責任範囲",
          "OS・ネットワーク制御・アプリケーションの管理責任は IaaS・PaaS・SaaS の選択に応じて段階的に Microsoft 側へ移る",
        ],
        examTip: "『情報・データ・アカウント・ID の保護』はクラウドに移行しても必ず顧客責任に残る点が頻出。",
      },
      {
        id: "az900-1-2",
        code: "1.2",
        title: "クラウドモデル（パブリック・プライベート・ハイブリッド）",
        services: ["パブリッククラウド", "プライベートクラウド", "ハイブリッドクラウド", "Azure Arc"],
        keyPoints: [
          "パブリッククラウドはサードパーティプロバイダーが所有・運用し、一般公開のネットワーク経由で複数組織がハードウェア基盤を共有利用するモデル（初期投資不要・迅速な拡張）",
          "プライベートクラウドは単一組織専用のクラウド環境（自社データセンターや専用ホスティング）で構築し、自社でハードウェア保守と高度な統制を担うモデル",
          "ハイブリッドクラウドはパブリッククラウドとプライベートクラウド（オンプレミス）をネットワーク連携させ、データやアプリを双方で運用する柔軟なモデル",
          "マルチクラウドは複数社のパブリッククラウドプロバイダーを併用して特定ベンダー依存の回避や最適サービスの選択を行う構成",
        ],
        examTip: "『既存オンプレミスの機密DBを残しつつ、季節的な Web 需要増分だけ Azure で処理したい』＝ ハイブリッドクラウド。",
      },
      {
        id: "az900-1-3",
        code: "1.3",
        title: "クラウドのメリット（可用性・拡張性・経済性・管理性）",
        services: [
          "高可用性",
          "スケーラビリティ",
          "弾力性",
          "信頼性",
          "予測可能性",
          "ガバナンス",
          "CapEx vs OpEx",
          "従量課金",
        ],
        keyPoints: [
          "高可用性は障害時もサービス継続できるよう冗長化する性質、信頼性は障害から復旧し期待通り動作し続ける能力を指す",
          "スケーラビリティは手動または計画的な垂直（スペック変更）・水平（台数増減）の拡張能力、弾力性（Elasticity）は負荷変動に連動した自動スケールアウト／インを指す",
          "予測可能性にはパフォーマンス（自動スケールやロードバランシングによる安定応答）とコスト（従量課金・料金計算ツールによる支出見通し）の 2 側面がある",
          "CapEx（設備投資：物理サーバーの初期一括購入）から OpEx（運用費：使った分だけ支払う従量課金モデル）へ転換でき、ガバナンス機能で規約・セキュリティ統制を統一できる",
        ],
        examTip: "『アクセス急増時に自動でインスタンスを増やし、減少時に自動で戻す』＝ 弾力性（Elasticity）、『初期購入費の削減』＝ OpEx / 従量課金。",
      },
      {
        id: "az900-1-4",
        code: "1.4",
        title: "クラウドサービス種別（IaaS・PaaS・SaaS）",
        services: ["IaaS", "PaaS", "SaaS", "Azure Virtual Machines", "Azure App Service", "Microsoft 365"],
        keyPoints: [
          "IaaS（Azure Virtual Machines 等）は仮想サーバー・ネットワーク基盤を借りるモデルで、OS やミドルウェアを自由制御できるため既存 VM のリフト＆シフトに最適",
          "PaaS（Azure App Service / Azure SQL Database 等）は OS やランタイムのパッチ管理を Microsoft に任せ、開発者がアプリケーションコードとデータに集中できるモデル",
          "SaaS（Microsoft 365 / Dynamics 365 等）は完成されたソフトウェアをインターネット経由で利用するモデルで、顧客はユーザー設定とデータ管理のみを行う",
          "柔軟性・制御性は IaaS ＞ PaaS ＞ SaaS の順で高く、運用管理の手間削減・導入スピードは SaaS ＞ PaaS ＞ IaaS の順で優れる",
        ],
        examTip: "『OS パッチ管理から解放されつつ自作 Web アプリをデプロイしたい』＝ PaaS、『レガシー OS 設定をそのまま移行』＝ IaaS。",
      },
    ],
  },
  {
    id: "az900-domain-2",
    number: "02",
    title: "Azure のアーキテクチャとサービス",
    englishTitle: "Describe Azure architecture and services",
    weight: "35〜40%",
    accentColor: "cyan",
    summary:
      "リージョン・可用性ゾーン・管理階層などのコア構造に加え、主要コンピュート、VNet ネットワーキング、Azure Storage の冗長性とアクセス層、Microsoft Entra ID とゼロトラストを網羅します。",
    topics: [
      {
        id: "az900-2-1",
        code: "2.1",
        title: "コア構造（リージョン・可用性ゾーン・リソース管理階層）",
        services: [
          "Azure リージョン",
          "リージョンペア",
          "可用性ゾーン",
          "管理グループ",
          "サブスクリプション",
          "リソースグループ",
        ],
        keyPoints: [
          "Azure リージョンは低遅延ネットワークで接続されたデータセンター群の地理的エリアで、多くのリージョンは約 480km 以上離れた同一地域内のリージョンペアと計画保守・災害復旧を連携する",
          "可用性ゾーン（AZ）は 1 リージョン内に独立した電源・冷却・ネットワークを備えて物理分離されたデータセンター群（通常 3 ゾーン以上）で、ゾーン単位の障害からワークロードを隔離する",
          "Azure の管理階層は上から『管理グループ → サブスクリプション → リソースグループ → リソース』の 4 層で構成され、RBAC 権限や Azure Policy は上位から下位へ継承される",
          "すべてのリソースは必ず 1 つのリソースグループに属し、リソースグループ同士のネスト（入れ子）は不可。別リージョンのリソースを同一リソースグループに混在させることは可能",
        ],
        examTip: "『リージョン障害への備え』＝ リージョンペア、『データセンター火災等の局所障害』＝ 可用性ゾーン、『RG 内へ RG を入れる』＝ 不可。",
      },
      {
        id: "az900-2-2",
        code: "2.2",
        title: "コンピュートサービス（VM・コンテナ・PaaS・サーバーレス・VDI）",
        services: [
          "Azure Virtual Machines",
          "Virtual Machine Scale Sets",
          "Azure Container Instances",
          "Azure Kubernetes Service",
          "Azure App Service",
          "Azure Functions",
          "Azure Virtual Desktop",
        ],
        keyPoints: [
          "Azure Virtual Machines (VM) は OS レベルの完全制御が可能な IaaS で、Virtual Machine Scale Sets (VMSS) を使うと同一構成の複数 VM を負荷に応じて自動増減・負荷分散できる",
          "Azure Container Instances (ACI) はサーバー管理不要で単発・軽量コンテナを素早く起動でき、Azure Kubernetes Service (AKS) は大規模コンテナの自動復旧・スケーリングを担うマネージド Kubernetes",
          "Azure App Service は Web アプリ・REST API を自動スケール付きでホストする PaaS 基盤、Azure Functions はイベント駆動でコード片を実行・実行時間分のみ課金されるサーバーレス基盤",
          "Azure Virtual Desktop (AVD) はクラウド上の仮想デスクトップ・アプリ配信（VDI）サービスで、Windows 10/11 のマルチセッションにより 1 台の VM を複数ユーザーで効率共有できる",
        ],
        examTip: "『クラスター管理不要で軽量コンテナ実行』＝ ACI、『マルチコンテナの本格オーケストレーション』＝ AKS、『イベント駆動の短時間処理』＝ Functions。",
      },
      {
        id: "az900-2-3",
        code: "2.3",
        title: "ネットワーキング（VNet・エンドポイント・ハイブリッド接続・DNS）",
        services: [
          "Azure Virtual Network",
          "サブネット",
          "VNet ピアリング",
          "パブリック / プライベート エンドポイント",
          "Azure VPN Gateway",
          "Azure ExpressRoute",
          "Azure DNS",
        ],
        keyPoints: [
          "Azure Virtual Network (VNet) は Azure 内の分離されたプライベートネットワーク空間で、サブネットに分割して IP アドレス範囲管理や NSG による通信制御を行う",
          "VNet ピアリングを使うと 2 つの VNet（同一リージョン・別リージョン問わず）を Microsoft バックボーンネットワーク経由で低遅延かつプライベートに接続できる",
          "パブリックエンドポイントはインターネット経由の接続先を提供する一方、プライベートエンドポイントは Azure PaaS サービスに VNet 内のプライベート IP を割り当てインターネット非公開で接続する",
          "Azure VPN Gateway はパブリックインターネット上に暗号化 VPN トンネル（S2S/P2S）を張り、Azure ExpressRoute は通信事業者経由の専用閉域回線で高帯域・低遅延接続を実現する。Azure DNS は高速なドメイン名前解決を提供",
        ],
        examTip: "『インターネットを経由しないオンプレミスとの専用プライベート接続』＝ ExpressRoute、『暗号化インターネット接続（低コスト）』＝ VPN Gateway。",
      },
      {
        id: "az900-2-4",
        code: "2.4",
        title: "ストレージ（Blob・Disk・Files・冗長性・アクセス層・AzCopy）",
        services: [
          "Azure Blob Storage",
          "Azure Disk Storage",
          "Azure Files",
          "LRS / ZRS / GRS / GZRS",
          "Hot / Cool / Cold / Archive",
          "AzCopy",
        ],
        keyPoints: [
          "Blob Storage は画像・動画・ログ等の非構造化データ向けオブジェクトストレージ、Azure Disk Storage は VM 接続用のブロックストレージ（マネージドディスク）、Azure Files は SMB/NFS 対応のマネージド共有ファイルシステム",
          "冗長性は LRS（単一 DC 内 3 コピー・11 ナイン）、ZRS（3 可用性ゾーン同期・12 ナイン）、GRS（別リージョン非同期複製・16 ナイン）、GZRS（ZRS＋別リージョン複製・16 ナイン）から要件に応じて選択する",
          "Blob アクセス層は Hot（頻繁アクセス）、Cool（最低 30 日・低頻度）、Cold（最低 90 日・超低頻度・オンライン即時読取）、Archive（最低 180 日・オフラインで読取時に数時間のリハイドレートが必要）に分かれる",
          "AzCopy はローカル環境と Azure Blob / Files 間やストレージアカウント間で大容量ファイルを高速コピー・同期するコマンドラインツール（Azure File Sync や Data Box 等と用途で補完）",
        ],
        examTip: "『即座にアクセス不要で保管単価最安（180日以上）』＝ Archive、『オンライン即時取得が必要で90日以上長期保管』＝ Cold。",
      },
      {
        id: "az900-2-5",
        code: "2.5",
        title: "ID・アクセス・セキュリティ（Entra ID・RBAC・ゼロトラスト・Defender）",
        services: [
          "Microsoft Entra ID",
          "SSO / MFA",
          "条件付きアクセス",
          "Azure RBAC",
          "ゼロトラスト",
          "多層防御",
          "Microsoft Defender for Cloud",
        ],
        keyPoints: [
          "Microsoft Entra ID（旧 Azure AD）はクラウドベースの ID・アクセス管理サービスで、認証（誰であるかの検証）を担い、シングルサインオン（SSO）や多要素認証（MFA）を提供する",
          "条件付きアクセスはユーザー属性・場所・デバイス準拠状態・リスクシグナルを評価してサインイン許可・MFA 要求・ブロックを動的制御し、Azure RBAC はリソースに対する認可（何ができるか）を最小権限で付与する",
          "ゼロトラストは『明示的に検証する・最小特権アクセスを使う・侵害を前提とする』の 3 原則に基づき、社内ネットワーク境界内であっても無条件に信頼しないモデル",
          "多層防御（Defense in Depth）は物理・ID とアクセス・境界・ネットワーク・コンピューティング・アプリケーション・データの 7 層で独立防御を張り、Microsoft Defender for Cloud はマルチクラウド含むセキュリティ姿勢管理（CSPM）と脅威保護を提供",
        ],
        examTip: "『条件（場所・端末状態）に応じた認証制御』＝ 条件付きアクセス、『誰がリソースに何の操作を行えるか』＝ RBAC、『多段階防御層』＝ 多層防御。",
      },
    ],
  },
  {
    id: "az900-domain-3",
    number: "03",
    title: "Azure の管理とガバナンス",
    englishTitle: "Describe Azure management and governance",
    weight: "30〜35%",
    accentColor: "emerald",
    summary:
      "コスト見積りと支出最適化ツール、Azure Policy やリソースロックによる統制、コンプライアンス管理、および IaC・Azure Arc・監視ツール群の役割を学びます。",
    topics: [
      {
        id: "az900-3-1",
        code: "3.1",
        title: "コスト管理（コスト要因・計算ツール・Cost Management・タグ）",
        services: [
          "Azure 料金計算ツール",
          "TCO 計算ツール",
          "Microsoft Cost Management",
          "リソースタグ",
        ],
        keyPoints: [
          "Azure のコスト要因にはリソースの種類・使用量（従量課金メーター）・リージョン（地域単価差）・帯域幅（インターネットからの受信データは無料、送信データには課金）が含まれる",
          "Azure 料金計算ツール（Pricing Calculator）はこれから構築する Azure リソース構成の月額・年額見積りを算出でき、TCO 計算ツールは既存オンプレミス環境を Azure へ移行した場合の総所有コスト削減額を試算する",
          "Microsoft Cost Management は実稼働後の利用料金を可視化・分析し、予算（Budgets）としきい値アラートを設定して予期せぬ支出増加を監視する",
          "リソースタグ（キーと値のペア）をリソースへ付与すると部署別・環境別・プロジェクト別のコスト配賦集計が容易になる（なおリソースグループのタグは配下リソースへ自動継承されない）",
        ],
        examTip: "『新規構成の月額見積り』＝ 料金計算ツール、『オンプレとの総コスト比較』＝ TCO 計算ツール、『稼働中の予算アラート』＝ Cost Management。",
      },
      {
        id: "az900-3-2",
        code: "3.2",
        title: "ガバナンスとコンプライアンス（Purview・Policy・ロック・Trust Portal）",
        services: [
          "Microsoft Purview",
          "Azure Policy",
          "リソースロック",
          "Service Trust Portal",
        ],
        keyPoints: [
          "Azure Policy はリソースの作成・更新時に『許可するリージョン制限』『特定 VM サイズ制限』『必須タグ付け』などのルールを自動評価・強制し、準拠状態を可視化する",
          "リソースロックはサブスクリプション・リソースグループ・リソースに適用して誤操作を防ぎ、`CanNotDelete`（削除不可・変更可）と `ReadOnly`（読み取り専用・削除と変更を禁止）の 2 種類がある",
          "Microsoft Purview はオンプレミス・マルチクラウド・SaaS に跨がるデータ資産の検出・カタログ化・機密データ分類・データ系統追跡を行う統合データガバナンスサービス",
          "Microsoft Service Trust Portal は ISO・SOC・GDPR・FedRAMP などの独立監査機関によるコンプライアンス監査レポートやセキュリティホワイトペーパーを公開・提供するポータル",
        ],
        examTip: "『所有者権限でも誤削除を防ぎたい』＝ CanNotDelete ロック、『構築可能リージョンを東日本のみに強制』＝ Azure Policy、『第三者監査報告書取得』＝ Service Trust Portal。",
      },
      {
        id: "az900-3-3",
        code: "3.3",
        title: "デプロイ管理と監視ツール（Portal・CLI・Arc・ARM/Bicep・監視）",
        services: [
          "Azure Portal",
          "Azure Cloud Shell",
          "Azure CLI / PowerShell",
          "Azure Arc",
          "ARM テンプレート / Bicep",
          "Azure Advisor",
          "Azure Service Health",
          "Azure Monitor",
        ],
        keyPoints: [
          "Azure Portal（GUI ブラウザ管理）に加え、ブラウザ上で即座に Bash（Azure CLI）や Azure PowerShell を実行できる対話型シェル環境として Azure Cloud Shell が利用できる",
          "ARM テンプレート（JSON）と Bicep（より簡潔な宣言型 DSL）は Infrastructure as Code (IaC) を実現し、同一構成を冪等・反復的に自動デプロイできる",
          "Azure Arc はオンプレミスや他社クラウド（AWS・GCP 等）上のサーバー・Kubernetes・SQL Server を Azure Resource Manager へ統合し、Azure Policy・RBAC・タグを一元適用する",
          "Azure Monitor はリソースのメトリクス・ログ（Log Analytics）・アプリ性能（Application Insights）・アラートを収集監視し、Azure Service Health は Azure 基盤自体の障害・保守予定を通知、Azure Advisor は信頼性・セキュリティ・性能・コスト・運用の 5 分野で最適化推奨を提示する",
        ],
        examTip: "『オンプレや他社クラウドの VM に Azure Policy を適用したい』＝ Azure Arc、『Azure 側の障害やメンテナンス通知』＝ Service Health、『構成改善提案』＝ Advisor。",
      },
    ],
  },
];

export const az900Comparisons: AzureComparisonTable[] = [
  {
    id: "az900-comp-service-models",
    category: "コンピュート",
    title: "オンプレミス / IaaS / PaaS / SaaS 比較",
    subtitle: "管理責任の範囲と柔軟性・運用負荷のトレードオフ",
    columns: ["モデル", "顧客が管理する領域", "Azure 代表例", "適したユースケース"],
    rows: [
      {
        feature: "オンプレミス",
        values: ["物理・ネットワーク〜OS・アプリ・データすべて", "自社データセンター", "厳格な物理管理や独自ハードウェア制約がある場合"],
      },
      {
        feature: "IaaS",
        values: ["OS・ミドルウェア・アプリ・データ・アクセス設定", "Azure Virtual Machines", "既存 VM を最小改修で移行（リフト＆シフト）・OS 自由制御"],
      },
      {
        feature: "PaaS",
        values: ["アプリコード・データ・アクセス設定（OS 管理不要）", "Azure App Service / Azure Functions", "インフラ保守を減らしアプリ開発・デプロイを迅速化"],
      },
      {
        feature: "SaaS",
        values: ["データ・ユーザーアカウント・設定のみ", "Microsoft 365 / Dynamics 365", "メール・コラボレーション・業務アプリを即座に利用開始"],
      },
    ],
    decisionRule: "既存 OS やミドルウェア制御が必須なら IaaS、開発効率優先なら PaaS、標準業務ツール利用なら SaaS を選びます。",
  },
  {
    id: "az900-comp-compute",
    category: "コンピュート",
    title: "Azure 主要コンピュートサービス比較",
    subtitle: "制御粒度・管理負荷・実行形態による使い分け",
    columns: ["サービス", "実行単位・形態", "運用管理負荷", "主な適用シナリオ"],
    rows: [
      {
        feature: "Azure Virtual Machines (VM)",
        values: ["仮想マシン (IaaS)", "高（OS パッチ・構成管理あり）", "レガシーアプリ移行・OS やドライバの自由制御"],
      },
      {
        feature: "Virtual Machine Scale Sets (VMSS)",
        values: ["同一構成 VM 群の自動スケール", "高（テンプレート共通化）", "負荷変動に応じて同一構成 VM を自動増減・冗長化"],
      },
      {
        feature: "Azure Container Instances (ACI)",
        values: ["単体コンテナ (PaaS / サーバーレス)", "極低（VM やクラスター管理不要）", "単発タスク・軽量コンテナの高速起動"],
      },
      {
        feature: "Azure Kubernetes Service (AKS)",
        values: ["コンテナオーケストレーション", "中（コントロールプレーンは Azure 管理）", "複雑なマイクロサービス・自動復旧・宣言的運用"],
      },
      {
        feature: "Azure App Service",
        values: ["Web アプリ / API 基盤 (PaaS)", "低（OS/ランタイム管理不要）", "Web サイト・REST API の継続デプロイと自動スケール"],
      },
      {
        feature: "Azure Functions",
        values: ["イベント駆動関数 (サーバーレス)", "極低（コードのみ管理・実行分課金）", "HTTP 要求や Blob 更新契機の軽量・短時間処理"],
      },
      {
        feature: "Azure Virtual Desktop (AVD)",
        values: ["クラウド VDI (Windows マルチセッション)", "低〜中（デスクトップ環境管理）", "リモートワーク向け仮想デスクトップ・アプリ配信"],
      },
    ],
    decisionRule: "OS 制御は VM/VMSS、手軽なコンテナは ACI、本格 Kubernetes は AKS、Web は App Service、イベント処理は Functions、仮想デスクトップは AVD。",
  },
  {
    id: "az900-comp-storage-redundancy",
    category: "ストレージ・DB",
    title: "Azure Storage 冗長性オプション比較",
    subtitle: "コピー数・データ持続性（ナイン数）・保護できる障害範囲",
    columns: ["冗長性オプション", "コピー数・配置範囲", "年間持続性（目安）", "保護できる障害範囲"],
    rows: [
      {
        feature: "LRS（ローカル冗長）",
        values: ["単一データセンター内に同期 3 コピー", "11 ナイン (99.999999999%)", "サーバーラック・ドライブ故障（DC/AZ 障害は不可）"],
      },
      {
        feature: "ZRS（ゾーン冗長）",
        values: ["同一リージョン内の 3 つの可用性ゾーンへ同期 3 コピー", "12 ナイン (99.9999999999%)", "可用性ゾーン 1 つ分のデータセンター障害"],
      },
      {
        feature: "GRS（ジオ冗長）",
        values: ["プライマリ LRS（3）＋ペアリージョンへ非同期（3）", "16 ナイン (99.99999999999999%)", "リージョン全体の広域災害（障害時に切り替え）"],
      },
      {
        feature: "RA-GRS（読み取りアクセスジオ冗長）",
        values: ["GRS 構成 ＋ セカンダリ側の常時読み取り許可", "16 ナイン (99.99999999999999%)", "リージョン災害保護 ＋ セカンダリからの参照読み取り"],
      },
      {
        feature: "GZRS / RA-GZRS（ジオゾーン冗長）",
        values: ["プライマリ ZRS（3 AZ）＋ペアリージョンへ非同期（3）", "16 ナイン (99.99999999999999%)", "同一リージョン内 AZ 障害とリージョン災害の両方"],
      },
    ],
    decisionRule: "最小コストは LRS、同一リージョン内 AZ 保護は ZRS、災害対策は GRS、AZ＋地域災害の最高耐性は GZRS を選択します。",
  },
  {
    id: "az900-comp-storage-tiers",
    category: "ストレージ・DB",
    title: "Azure Storage 種別と Blob アクセス層比較",
    subtitle: "データ構造とアクセス頻度・最低保存期間による選択基準",
    columns: ["サービス / アクセス層", "データ特性・読取方式", "最低保存期間 / 費用傾向", "適したユースケース"],
    rows: [
      {
        feature: "Blob Storage（Hot 層）",
        values: ["非構造化オブジェクト・オンライン即時読取", "最低期間なし / 保管高め・アクセス最安", "Web 画像・頻繁に読み書きされるアクティブデータ"],
      },
      {
        feature: "Blob Storage（Cool 層）",
        values: ["非構造化オブジェクト・オンライン即時読取", "30 日 / 保管安め・アクセスやや高め", "月次参照程度の短期バックアップ・非アクティブデータ"],
      },
      {
        feature: "Blob Storage（Cold 層）",
        values: ["非構造化オブジェクト・オンライン即時読取", "90 日 / Cool より保管安価・アクセス高め", "ほぼ参照しないが即時アクセスを維持したい長期データ"],
      },
      {
        feature: "Blob Storage（Archive 層）",
        values: ["非構造化オブジェクト・オフライン（数時間リハイドレート必要）", "180 日 / 保管最安・取得時コスト高", "規制監査ログ・数時間復元待ちを許容できるアーカイブ"],
      },
      {
        feature: "Azure Disk Storage",
        values: ["VM 専用ブロックストレージ（OS/データディスク）", "プロビジョニング容量・性能課金", "Azure VM の OS ドライブ・高 IOPS データベース領域"],
      },
      {
        feature: "Azure Files",
        values: ["SMB / NFS 対応マネージド共有フォルダ", "容量・トランザクション課金", "複数 VM やオンプレミスからの共有ファイルサーバー置換"],
      },
    ],
    decisionRule: "VM ディスクは Disk、共有ファイルは Files、オブジェクトは頻度に応じて Blob Hot / Cool(30日) / Cold(90日) / Archive(180日) を使い分けます。",
  },
  {
    id: "az900-comp-networking",
    category: "ネットワーク・セキュリティ",
    title: "Azure ネットワーク接続と閉域アクセス比較",
    subtitle: "通信経路・暗号化・閉域性に応じた接続方式の選定",
    columns: ["機能・サービス", "接続対象", "通信経路・閉域性", "主な用途と特徴"],
    rows: [
      {
        feature: "VNet ピアリング",
        values: ["Azure VNet 同士（同一/別リージョン）", "Microsoft バックボーン閉域接続", "ゲートウェイ不要・低遅延高帯域で VNet 間を相互接続"],
      },
      {
        feature: "パブリック エンドポイント",
        values: ["インターネット経由で Azure リソースへ接続", "パブリック IP 経由（インターネット）", "外部公開 Web サービスやグローバル利用者向け公開"],
      },
      {
        feature: "プライベート エンドポイント",
        values: ["VNet から Azure PaaS サービスへ接続", "VNet 内プライベート IP（完全閉域）", "Azure Storage や SQL をインターネット非公開で安全接続"],
      },
      {
        feature: "Azure VPN Gateway",
        values: ["オンプレミス / 端末と Azure VNet", "パブリックインターネット上の暗号化トンネル", "低コストで迅速に構築できるサイト間・ポイント対サイト接続"],
      },
      {
        feature: "Azure ExpressRoute",
        values: ["オンプレミス網と Microsoft クラウド", "専用プライベート回線（インターネット非経由）", "高帯域・予測可能な低遅延・厳格な閉域接続要件"],
      },
    ],
    decisionRule: "VNet 間はピアリング、PaaS の閉域利用はプライベートエンドポイント、安価な拠点間は VPN Gateway、専用線閉域は ExpressRoute。",
  },
  {
    id: "az900-comp-governance-cost",
    category: "ガバナンス・監視・コスト",
    title: "コスト管理・ガバナンス・監視ツール比較",
    subtitle: "事前見積り・ルール強制・稼働監視・最適化の役割分担",
    columns: ["ツール・機能", "主な役割・目的", "対象・実行タイミング", "試験で問われる区別ポイント"],
    rows: [
      {
        feature: "Azure 料金計算ツール",
        values: ["導入予定リソースの費用見積り", "構築前・構成選択ベース", "これから構築する Azure 構成の月額概算を算出"],
      },
      {
        feature: "TCO 計算ツール",
        values: ["オンプレと Azure の総コスト比較", "移行検討時（3〜5 年比較）", "電力・保守・ハードウェア費を含めた移行削減効果を試算"],
      },
      {
        feature: "Microsoft Cost Management",
        values: ["実支出の分析・予算アラート・削減", "運用中（課金データ可視化）", "タグ別集計や予算しきい値通知でクラウド費用を統制"],
      },
      {
        feature: "Azure Policy",
        values: ["構成ルール評価・非準拠リソース阻止", "リソース作成・更新・定期監査", "許可リージョン制限・必須タグ強制など構成そのものを統制"],
      },
      {
        feature: "リソースロック",
        values: ["誤削除・誤変更の防止", "対象スコープ（継承あり）", "CanNotDelete（削除のみ禁止）と ReadOnly（変更も禁止）の 2 種"],
      },
      {
        feature: "Azure Advisor",
        values: ["5 分野の最適化ベストプラクティス提案", "既存構成の継続スキャン", "コスト・セキュリティ・信頼性・性能・運用の改善助言を提示"],
      },
      {
        feature: "Azure Service Health",
        values: ["Azure 基盤の障害・計画保守・勧告通知", "Azure プラットフォーム全体", "自環境に影響する Azure リージョン障害やメンテ情報を確認"],
      },
      {
        feature: "Azure Monitor",
        values: ["メトリクス・ログ収集と障害アラート", "顧客リソース（Azure＋オンプレ）", "VM CPU 率やアプリログ分析・しきい値アラートの実行基盤"],
      },
    ],
    decisionRule: "事前試算は料金/TCO計算、実費監視はCost Management、ルール強制はPolicy、誤削除防止はロック、基盤障害はService Health、リソース監視はMonitor。",
  },
];

export const az900Patterns: AzureArchitecturePattern[] = [
  {
    id: "az900-pat-1",
    title: "高可用・自動拡張 Web アプリ基盤",
    badge: "Availability & Scale",
    flow: [
      "ユーザー (HTTPS)",
      "Azure DNS / パブリック エンドポイント",
      "Azure App Service (自動スケール)",
      "可用性ゾーン分散バックエンド",
    ],
    summary:
      "OS 管理不要の PaaS（App Service）を複数インスタンス・可用性ゾーンへ分散配置し、アクセス集中時の弾力性と高可用性を両立する標準 Web 構成です。",
    keyDesignPoints: [
      "弾力性により需要増減へ自動追従し、過剰なアイドルリソース課金を防止",
      "複数可用性ゾーンに配置することで単一データセンター障害時も継続稼働",
    ],
  },
  {
    id: "az900-pat-2",
    title: "ハイブリッドクラウド閉域接続と統合管理",
    badge: "Hybrid Cloud",
    flow: [
      "オンプレミス データセンター",
      "Azure ExpressRoute / VPN Gateway",
      "Azure Virtual Network (VNet)",
      "Azure Virtual Machines / Azure Arc",
    ],
    summary:
      "機密ワークロードをオンプレミスに残しつつ、専用閉域回線または暗号化 VPN で Azure VNet と接続し、Azure Arc で双方を統一管理する構成です。",
    keyDesignPoints: [
      "厳格な閉域・低遅延要件には ExpressRoute、迅速かつ低コストな接続には VPN Gateway を選択",
      "Azure Arc によりオンプレミス側のサーバーにも Azure Policy やタグ管理を一元適用可能",
    ],
  },
  {
    id: "az900-pat-3",
    title: "サーバーレス処理と Blob 階層化保管パイプライン",
    badge: "Serverless & Storage",
    flow: [
      "ファイル格納 (Blob Hot 層)",
      "Azure Functions (イベント駆動)",
      "ライフサイクル移行 (Cool → Cold)",
      "Blob Archive 層 (長期保管)",
    ],
    summary:
      "データアップロードを契機にサーバーレス関数で処理を実行し、時間の経過とともに利用頻度が下がるファイルを低コスト層へ段階移行するパターンです。",
    keyDesignPoints: [
      "Azure Functions はコード実行時間のみ課金され、待機中のサーバーコストが不要",
      "30 日経過後に Cool、90 日で Cold、数時間復元可の長期保管は Archive（180 日以上）で保管費を最適化",
    ],
  },
  {
    id: "az900-pat-4",
    title: "ゼロトラストに基づく ID 認証と閉域アクセス",
    badge: "Zero Trust Security",
    flow: [
      "ユーザーサインイン (SSO / MFA)",
      "Microsoft Entra ID (条件付きアクセス)",
      "Azure RBAC 最小権限チェック",
      "プライベート エンドポイント経由接続",
    ],
    summary:
      "ネットワーク境界に頼らず、ユーザー ID・端末状態・リスクを毎回検証した上で、最小権限と VNet プライベート通信だけを許可するゼロトラスト構成です。",
    keyDesignPoints: [
      "『明示的に検証・最小特権・侵害を前提とする』の 3 原則を Entra ID と RBAC で実装",
      "プライベート エンドポイントにより PaaS サービスをパブリックインターネットから完全に遮断",
    ],
  },
  {
    id: "az900-pat-5",
    title: "FinOps コスト見積り・予算統制サイクル",
    badge: "Cost & FinOps",
    flow: [
      "TCO 計算ツール / 料金計算ツール",
      "リソースタグ付与 (部署・環境)",
      "Microsoft Cost Management (予算アラート)",
      "Azure Advisor (コスト最適化推奨)",
    ],
    summary:
      "導入前の費用見積りから運用中のタグ別コスト可視化、予算通知、Advisor による遊休リソース削減提案までを一貫運用する財務管理サイクルです。",
    keyDesignPoints: [
      "移行効果の経営判断には TCO 計算ツール、具体的な月額試算には料金計算ツールを活用",
      "リソースグループに付けたタグは配下リソースに自動継承されないため、Azure Policy で付与を徹底",
    ],
  },
  {
    id: "az900-pat-6",
    title: "組織ガバナンス・IaC デプロイ・運用監視構成",
    badge: "Governance & Monitoring",
    flow: [
      "管理グループ → サブスクリプション",
      "Azure Policy / リソースロック適用",
      "ARM テンプレート / Bicep デプロイ",
      "Azure Monitor / Azure Service Health",
    ],
    summary:
      "管理階層に沿ってセキュリティ・リージョン制約と誤削除ロックを継承させ、IaC で再現性の高い構築を行い、監視と基盤障害通知を組み合わせる構成です。",
    keyDesignPoints: [
      "上位スコープの RBAC や Policy は配下のサブスクリプション・リソースグループへ自動継承される",
      "リソース監視は Azure Monitor、Azure 基盤の障害通知は Service Health と役割を明確分離",
    ],
  },
];

export const az900Pitfalls: AzurePitfall[] = [
  {
    id: "az900-pit-1",
    trap: "「クラウドへ移行すれば OS パッチ適用やアカウント管理も含めすべて Microsoft の責任になる」と誤解する",
    whyWrong:
      "責任共有モデルでは、情報・データ・デバイス・アカウント・ID は IaaS・PaaS・SaaS を問わず常に顧客責任です。また IaaS（VM）では OS とミドルウェアの更新も顧客責任に残ります。",
    correctApproach:
      "物理インフラは常に Microsoft、データと ID は常に顧客、OS・アプリ層は IaaS／PaaS／SaaS の種類で分担が変わる点を押さえる。",
  },
  {
    id: "az900-pit-2",
    trap: "「同一リージョン内の可用性ゾーン（AZ）を使えばリージョン全体の広域災害からも保護される」と考える",
    whyWrong:
      "可用性ゾーンは同一リージョン内の独立データセンター群であり、単一データセンター障害は防げますが、リージョン全域に影響する大規模災害には耐えられません。",
    correctApproach:
      "リージョン災害への耐性が必要な場合はリージョンペアや GRS / GZRS などのジオ冗長構成を選択する。",
  },
  {
    id: "az900-pit-3",
    trap: "「Blob Storage の Archive 層のデータは必要なときに即座に読み取り可能だ」と誤解する",
    whyWrong:
      "Archive 層はオフライン層であり、直接ダウンロードできません。読み取るには Hot・Cool・Cold のオンライン層へリハイドレートする必要があり、通常数時間かかります。",
    correctApproach:
      "即時アクセスが必要だが頻度が低いデータは Cool（最低 30 日）や Cold（最低 90 日）を選び、数時間待ちを許容できる長期保管のみ Archive（最低 180 日）を使う。",
  },
  {
    id: "az900-pit-4",
    trap: "「Azure Policy と Azure RBAC は同じアクセス制御機能であり、どちらか一方で代替できる」と考える",
    whyWrong:
      "RBAC は『誰が・どのリソースに・何の操作を実行できるか（操作権限）』を制御し、Azure Policy は『リソース自体の許可構成（作成リージョンや SKU、必須タグなど）』を評価・制限します。",
    correctApproach:
      "ユーザーの操作権限制御は RBAC、リソースのコンプライアンス準拠と作成ルール強制は Azure Policy と明確に使い分ける。",
  },
  {
    id: "az900-pit-5",
    trap: "「CanNotDelete リソースロックを設定すると、リソースの設定変更や読み取りも一切できなくなる」と誤解する",
    whyWrong:
      "CanNotDelete ロックは『削除のみ』を禁止するため、権限を持つユーザーによる読み取りや設定変更（更新）は引き続き実行可能です。",
    correctApproach:
      "誤削除のみ防止したいときは CanNotDelete、設定変更まで含めて凍結したいときは ReadOnly ロックを選択する。",
  },
  {
    id: "az900-pit-6",
    trap: "「リソースグループにタグを付与すれば、その中に作成済みの全リソースにも同じタグが自動で継承される」と考える",
    whyWrong:
      "RBAC 権限や Azure Policy 割り当ては上位階層から下位へ自動継承されますが、リソースタグはリソースグループから配下リソースへ自動継承されません。",
    correctApproach:
      "配下リソースへのタグ徹底・継承が必要な場合は、Azure Policy（作成・更新時のタグ付与/継承ポリシー）を組み合わせて適用する。",
  },
];

export const az900KeyFacts: AzureKeyFact[] = [
  {
    id: "az900-kf-1",
    target: "Exam AZ-900 合格ライン",
    value: "700 / 1000",
    detail: "100〜1000 のスケールスコアで 700 点以上が合格・資格は無期限",
  },
  {
    id: "az900-kf-2",
    target: "Azure リソース階層（4 層）",
    value: "管理グループ → サブスクリプション → RG → リソース",
    detail: "RBAC と Azure Policy は下位へ継承されるが、タグは自動継承されない",
  },
  {
    id: "az900-kf-3",
    target: "可用性ゾーン (Availability Zones)",
    value: "同一リージョン内の独立データセンター群",
    detail: "独立した電源・冷却・ネットワークを備えゾーン単位の障害を隔離",
  },
  {
    id: "az900-kf-4",
    target: "LRS（ローカル冗長ストレージ）",
    value: "11 ナイン（99.999999999%）",
    detail: "単一データセンター内に 3 コピー同期保存（最小コスト・AZ 障害は不可）",
  },
  {
    id: "az900-kf-5",
    target: "ZRS（ゾーン冗長ストレージ）",
    value: "12 ナイン（99.9999999999%）",
    detail: "同一リージョン内 3 つの可用性ゾーンへ同期複製し AZ 障害から保護",
  },
  {
    id: "az900-kf-6",
    target: "GRS / GZRS（ジオ冗長ストレージ）",
    value: "16 ナイン（99.99999999999999%）",
    detail: "セカンダリリージョンへ非同期複製（計 6 コピー）し地域災害から保護",
  },
  {
    id: "az900-kf-7",
    target: "Blob Cool / Cold アクセス層",
    value: "最低保存期間 30 日 / 90 日",
    detail: "オンライン即時アクセス可能・期間未満での削除/移動は早期削除料金が発生",
  },
  {
    id: "az900-kf-8",
    target: "Blob Archive アクセス層",
    value: "最低保存期間 180 日（オフライン）",
    detail: "保管単価最安・読み取りにはオンライン層への数時間のリハイドレートが必要",
  },
  {
    id: "az900-kf-9",
    target: "リソースロック種別",
    value: "CanNotDelete / ReadOnly",
    detail: "サブスクリプションや RG に適用でき、所有者でも解除なしに削除・変更不可",
  },
  {
    id: "az900-kf-10",
    target: "Azure Advisor の 5 本柱",
    value: "信頼性・セキュリティ・性能・コスト・運用",
    detail: "現在の構成を分析して最適化の推奨事項を提示（基盤障害通知は Service Health）",
  },
];

export const az900QuickLookup: CertFlashcardItem[] = [
  {
    keyword: "初期設備投資（CapEx）を抑え、利用量に応じて支払う運用費モデル",
    category: "クラウド概念",
    recommended: "OpEx（従量課金モデル）",
    reason: "物理サーバーの一括購入が不要となり、使った分だけ柔軟に支払えます。",
  },
  {
    keyword: "IaaS・PaaS・SaaS を問わず常に顧客側の管理責任に残る領域",
    category: "クラウド概念",
    recommended: "情報・データ、デバイス、アカウント・ID",
    reason: "物理基盤は Microsoft 責任ですが、データ保護とアクセス管理は常に顧客責任です。",
  },
  {
    keyword: "オンプレミス環境とパブリッククラウドを連携させて併用するモデル",
    category: "クラウド概念",
    recommended: "ハイブリッドクラウド",
    reason: "既存資産や規制データをオンプレミスに残しつつクラウドの拡張性を活用できます。",
  },
  {
    keyword: "負荷の増減に応じてリソースを自動的にスケールアウト／インする性質",
    category: "クラウド概念",
    recommended: "弾力性（Elasticity）",
    reason: "手動変更を待たず需要変動に自動追従し、性能確保とコスト最適化を両立します。",
  },
  {
    keyword: "OS パッチ管理を任せ、Web アプリのコードとデータ管理に専念できるモデル",
    category: "クラウド概念",
    recommended: "PaaS（Azure App Service 等）",
    reason: "基盤 OS やランタイム保守が不要になり、開発スピードを高められます。",
  },
  {
    keyword: "同一リージョン内で電源・冷却・通信が独立した物理データセンター群",
    category: "コア構造",
    recommended: "可用性ゾーン（Availability Zones）",
    reason: "1 つのデータセンターが停止しても他ゾーンでサービス継続できます。",
  },
  {
    keyword: "複数のサブスクリプションを束ねて RBAC や Policy を一括適用する上位階層",
    category: "コア構造",
    recommended: "管理グループ（Management Groups）",
    reason: "最大 6 階層のツリーで組織全体の権限とガバナンスポリシーを継承管理できます。",
  },
  {
    keyword: "同一構成の複数仮想マシンを負荷に応じて自動増減・分散させる機能",
    category: "コンピュート",
    recommended: "Virtual Machine Scale Sets (VMSS)",
    reason: "同一 VM イメージから自動スケールと可用性ゾーン分散を一元構成できます。",
  },
  {
    keyword: "オーケストレーション基盤の構築なしで単発コンテナを迅速起動するサービス",
    category: "コンピュート",
    recommended: "Azure Container Instances (ACI)",
    reason: "VM 管理や Kubernetes 運用なしでコンテナ単位の高速実行と秒単位課金が可能です。",
  },
  {
    keyword: "HTTP リクエストやファイル追加などを契機にコードを実行するサーバーレス基盤",
    category: "コンピュート",
    recommended: "Azure Functions",
    reason: "イベント駆動で自動スケールし、待機時間ではなく実行時リソース消費分のみ課金されます。",
  },
  {
    keyword: "Windows 10/11 マルチセッションをクラウドから配信する仮想デスクトップ基盤",
    category: "コンピュート",
    recommended: "Azure Virtual Desktop (AVD)",
    reason: "複数ユーザーで単一 VM リソースを共有しつつ安全なリモート業務環境を提供します。",
  },
  {
    keyword: "インターネットを経由せず専用閉域回線でオンプレミスと Azure を接続",
    category: "ネットワーキング",
    recommended: "Azure ExpressRoute",
    reason: "通信事業者の閉域網経由で高帯域・予測可能な低遅延かつセキュアな接続を実現します。",
  },
  {
    keyword: "Azure PaaS サービスを VNet 内のプライベート IP 経由で安全に接続する仕組み",
    category: "ネットワーキング",
    recommended: "Azure Private Endpoint",
    reason: "Storage や SQL Database 等へのトラフィックをパブリックインターネットへ出さず閉域化できます。",
  },
  {
    keyword: "同一リージョン内の 3 つの可用性ゾーンへデータを同期複製する冗長性（12 ナイン）",
    category: "ストレージ",
    recommended: "ZRS（ゾーン冗長ストレージ）",
    reason: "データセンター 1 箇所分の障害が発生しても無停止でデータ読み書きを継続できます。",
  },
  {
    keyword: "最低 180 日保存・保管単価最安で読み取り時に数時間のリハイドレートが必要な層",
    category: "ストレージ",
    recommended: "Blob Archive アクセス層",
    reason: "オフライン保管により長期間のコンプライアンスやバックアップ費用を最小化できます。",
  },
  {
    keyword: "ローカルと Azure Blob / Files 間やアカウント間で高速データ転送する CLI",
    category: "ストレージ",
    recommended: "AzCopy",
    reason: "並列転送により大容量オブジェクトや共有ファイルのアップロード・コピーを高速化します。",
  },
  {
    keyword: "場所・デバイス準拠状態・サインインリスクを評価して MFA や拒否を動的制御",
    category: "セキュリティ",
    recommended: "Microsoft Entra 条件付きアクセス",
    reason: "ゼロトラストの『明示的な検証』原則に基づきコンテキスト単位のアクセス判断を行います。",
  },
  {
    keyword: "サブスクリプションやリソース単位で『誰が何を操作できるか』を最小権限で付与",
    category: "セキュリティ",
    recommended: "Azure RBAC（ロールベースのアクセス制御）",
    reason: "組み込みロールやカスタムロールで閲覧・共同作成・所有者等の操作権限を厳密制御します。",
  },
  {
    keyword: "クラウド環境とハイブリッド資産のセキュリティポスチャ評価と脅威防御を実行",
    category: "セキュリティ",
    recommended: "Microsoft Defender for Cloud",
    reason: "セキュアスコアの可視化や脆弱性・不審なアクティビティの検知を一元提供します。",
  },
  {
    keyword: "デプロイ予定の Azure サービス構成を選択して月額・年額コストを事前見積り",
    category: "コスト管理",
    recommended: "Azure 料金計算ツール",
    reason: "VM スペック・ストレージ容量・リージョンごとの概算利用額を事前に試算できます。",
  },
  {
    keyword: "部署やプロジェクト単位のコスト配賦・可視化と予算超過アラートを管理",
    category: "コスト管理",
    recommended: "Microsoft Cost Management ＋ リソースタグ",
    reason: "タグによる分類集計と予算しきい値通知でクラウド費用の透明性を保てます。",
  },
  {
    keyword: "作成可能リージョンの限定や必須タグの強制をサブスクリプション全体に適用",
    category: "ガバナンス",
    recommended: "Azure Policy",
    reason: "組織標準に違反するリソース構成のデプロイ拒否や非準拠リソースの検出を自動化します。",
  },
  {
    keyword: "所有者権限ユーザーによる誤削除や意図しない設定変更を物理的ロックで防止",
    category: "ガバナンス",
    recommended: "リソースロック（CanNotDelete / ReadOnly）",
    reason: "ロックを明示的に解除しない限り、重要な本番リソースの削除や書き換えを遮断します。",
  },
  {
    keyword: "オンプレミスや他社クラウド上のサーバー・K8s を Azure 管理基盤へ統合する機能",
    category: "管理・監視",
    recommended: "Azure Arc",
    reason: "Azure 外のインフラにも Azure Policy・RBAC・タグ・Defender を一貫適用できます。",
  },
];

export const az900PracticeQuestions: CertQuestion[] = [
  {
    id: "az900-q1",
    domainId: "az900-domain-1",
    domainLabel: "01: クラウドの概念",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "ある企業が自社データセンターの物理サーバー購入による初期投資を抑え、季節変動に合わせて使った分だけ料金を支払う形態へ切り替えたいと考えています。この財務モデルの変化を表す説明として最も適切なものはどれですか？",
    options: [
      "CapEx（設備投資）から OpEx（運用費）への移行",
      "OpEx（運用費）から CapEx（設備投資）への移行",
      "プライベートクラウド専用ハードウェアの買い切り契約",
      "オンプレミスサーバーの減価償却期間の短縮",
    ],
    correctIndices: [0],
    explanation:
      "物理機器を事前に一括購入する支出は CapEx（設備投資）、クラウドで実際の利用量に応じて継続的に支払う従量課金モデル（Consumption-based model）は OpEx（運用費）に該当します。",
    keywords: ["CapEx", "OpEx", "従量課金"],
  },
  {
    id: "az900-q2",
    domainId: "az900-domain-1",
    domainLabel: "01: クラウドの概念",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "Azure の責任共有モデルにおいて、IaaS・PaaS・SaaS のどのサービス種別を選んだ場合でも、常に顧客側の責任範囲となるものはどれですか？",
    options: [
      "物理データセンターの入退室管理と電源設備の保守",
      "ハイパーバイザーと物理ホストサーバーのパッチ適用",
      "情報・データ、デバイス、アカウントと ID の管理",
      "PaaS 基盤の基盤 OS カーネルのセキュリティ更新",
    ],
    correctIndices: [2],
    explanation:
      "どのクラウドモデルを選択しても『情報・データ』『デバイス』『アカウントと ID』の保護と管理は常に顧客責任です。物理セキュリティやホスト保守は常に Microsoft が担います。",
    keywords: ["責任共有モデル", "顧客責任"],
  },
  {
    id: "az900-q3",
    domainId: "az900-domain-1",
    domainLabel: "01: クラウドの概念",
    difficulty: "標準",
    selectCount: 1,
    question:
      "規制要件により顧客の基幹データベースは自社データセンターの専用環境に残しつつ、キャンペーン時などアクセスが急増する Web フロントエンドだけを Azure 上で柔軟に運用したい場合、採用すべきクラウドモデルはどれですか？",
    options: [
      "パブリッククラウド単独構成",
      "プライベートクラウド単独構成",
      "ハイブリッドクラウド",
      "SaaS 単独構成",
    ],
    correctIndices: [2],
    explanation:
      "オンプレミス（プライベート環境）と Azure（パブリッククラウド）をネットワーク連携させてワークロードを適材適所で併用する構成はハイブリッドクラウドと呼ばれます。",
    keywords: ["ハイブリッドクラウド", "クラウドモデル"],
  },
  {
    id: "az900-q4",
    domainId: "az900-domain-1",
    domainLabel: "01: クラウドの概念",
    difficulty: "標準",
    selectCount: 1,
    question:
      "アクセス負荷の急増に合わせてクラウド基盤が自動的にコンピューティングインスタンス数を増やし、負荷が下がると自動的に削減して無駄なコストを抑えるクラウドの特性はどれですか？",
    options: [
      "弾力性（Elasticity）",
      "データレジデンシー",
      "垂直スケーリングの手動適用",
      "CapEx の固定化",
    ],
    correctIndices: [0],
    explanation:
      "弾力性（Elasticity）は、負荷や需要の変化に応じてリソースを動的に自動拡張・自動縮小する能力を指します。",
    keywords: ["弾力性", "スケーラビリティ"],
  },
  {
    id: "az900-q5",
    domainId: "az900-domain-1",
    domainLabel: "01: クラウドの概念",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "開発チームが新しい Web アプリケーションを公開する際、OS のインストールやパッチ適用といったインフラ保守を行わずに、アプリケーションのコードと設定のデプロイだけに専念したいと考えています。適しているクラウドサービス種別と Azure サービスの組み合わせはどれですか？",
    options: [
      "IaaS（Azure Virtual Machines）",
      "PaaS（Azure App Service）",
      "SaaS（Microsoft 365）",
      "オンプレミス仮想化（Hyper-V）",
    ],
    correctIndices: [1],
    explanation:
      "Azure App Service は PaaS であり、基盤 OS やランタイムの管理は Microsoft に任せ、開発者はアプリ開発とデプロイに注力できます。",
    keywords: ["PaaS", "Azure App Service"],
  },
  {
    id: "az900-q6",
    domainId: "az900-domain-1",
    domainLabel: "01: クラウドの概念",
    difficulty: "標準",
    selectCount: 2,
    question:
      "クラウド導入における『信頼性』『予測可能性』『ガバナンス』のメリットに関する記述として正しいものを 2 つ選択してください。",
    options: [
      "信頼性とは、障害やコンポーネント故障から復旧し、期待通りに機能し続けるシステム能力を指す",
      "コストの予測可能性により、従量課金や料金計算ツールを用いてクラウド利用額の見通しを立てやすい",
      "クラウドへ移行するとガバナンス機能が不要になり、ポリシー統制なしでコンプライアンスが自動達成される",
      "IaaS を利用すれば、アプリケーションコードの脆弱性対応やデータ保護も Microsoft の責任になる",
    ],
    correctIndices: [0, 1],
    explanation:
      "信頼性は障害からの復旧・継続能力、予測可能性はコストや性能の見通しを立てやすい特性を指します。ガバナンスはテンプレートやポリシー適用により統制を強化するメリットであり不要になるわけではありません。",
    keywords: ["信頼性", "予測可能性", "ガバナンス"],
  },
  {
    id: "az900-q7",
    domainId: "az900-domain-2",
    domainLabel: "02: Azure のアーキテクチャとサービス",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "Azure のリソース管理階層（管理グループ・サブスクリプション・リソースグループ・リソース）に関する説明として正しいものはどれですか？",
    options: [
      "1 つのリソースグループ内に別のリソースグループを入れ子（ネスト）で作成できる",
      "1 つの Azure リソースは複数のリソースグループに同時に所属できる",
      "管理グループに適用した Azure Policy や RBAC 権限は、配下のサブスクリプションやリソースグループへ継承される",
      "リソースグループと同じリージョンにあるリソースしか、そのリソースグループへ配置できない",
    ],
    correctIndices: [2],
    explanation:
      "RBAC と Azure Policy は上位階層（管理グループ → サブスクリプション → リソースグループ → リソース）から下位へ継承されます。なおリソースグループのネストや 1 リソースの複数グループ所属は不可で、別リージョンのリソースを同一グループへ格納することは可能です。",
    keywords: ["管理グループ", "サブスクリプション", "リソースグループ"],
  },
  {
    id: "az900-q8",
    domainId: "az900-domain-2",
    domainLabel: "02: Azure のアーキテクチャとサービス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "単一リージョン内で火災や停電などにより 1 つのデータセンター全体が停止しても、アプリケーションを無停止で継続稼働させたい場合、VM やデータベースを配置すべき構造はどれですか？",
    options: [
      "単一の可用性ゾーン内にある 1 台の VM",
      "同一リージョン内の複数の可用性ゾーン（Availability Zones）への分散配置",
      "LRS 冗長ストレージ 1 つのみの構成",
      "同一リソースグループ内のタグ付けのみ",
    ],
    correctIndices: [1],
    explanation:
      "可用性ゾーン（AZ）は同一リージョン内で電源・冷却・ネットワークが物理分離された独立データセンター群であり、複数ゾーンへ分散することでデータセンター単位の障害に耐えられます。",
    keywords: ["可用性ゾーン", "高可用性"],
  },
  {
    id: "az900-q9",
    domainId: "az900-domain-2",
    domainLabel: "02: Azure のアーキテクチャとサービス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Blob ストレージへファイルがアップロードされた瞬間にのみ起動してメタデータを抽出し、処理が完了したら即座に課金が止まるイベント駆動のコードを実行したい場合、最も適した Azure コンピュートサービスはどれですか？",
    options: [
      "Azure Virtual Machines",
      "Azure Functions",
      "Azure Virtual Desktop",
      "Azure Dedicated Host",
    ],
    correctIndices: [1],
    explanation:
      "Azure Functions はインフラ管理不要のサーバーレスコンピューティングであり、イベントをトリガーにして短時間コードを実行し、実行時間と消費リソース分のみ課金されます。",
    keywords: ["Azure Functions", "サーバーレス"],
  },
  {
    id: "az900-q10",
    domainId: "az900-domain-2",
    domainLabel: "02: Azure のアーキテクチャとサービス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "金融関連システムにおいて、オンプレミスネットワークと Azure Virtual Network を『パブリックインターネットを一切経由しない』専用のプライベート回線で接続し、安定した高帯域と低遅延を確保したい場合に選ぶべきサービスはどれですか？",
    options: [
      "Azure VPN Gateway（サイト間 VPN）",
      "Azure ExpressRoute",
      "パブリック IP アドレス経由の RDP 接続",
      "Azure DNS",
    ],
    correctIndices: [1],
    explanation:
      "VPN Gateway はパブリックインターネット上に暗号化トンネルを構築しますが、Azure ExpressRoute は接続プロバイダー経由の専用プライベート接続でインターネットを通らずに Azure へ接続します。",
    keywords: ["ExpressRoute", "閉域接続"],
  },
  {
    id: "az900-q11",
    domainId: "az900-domain-2",
    domainLabel: "02: Azure のアーキテクチャとサービス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "重要な業務データを Azure Storage に保存するにあたり、同一リージョン内の可用性ゾーン障害に耐えられるだけでなく、リージョン全体の大規模災害発生時にも別リージョンにデータを残して保護したい場合、選択すべき冗長性オプションはどれですか？",
    options: [
      "LRS（ローカル冗長ストレージ）",
      "ZRS（ゾーン冗長ストレージ）",
      "GZRS（ジオゾーン冗長ストレージ）",
      "単一マネージドディスク（冗長化なし）",
    ],
    correctIndices: [2],
    explanation:
      "GZRS（および読み取り可能な RA-GZRS）はプライマリリージョンで ZRS（3 つの可用性ゾーン同期）を行い、さらにペアとなるセカンダリリージョンへ非同期複製（合計 6 コピー・16 ナイン）を行うため、AZ 障害とリージョン災害の両方に耐えられます。",
    keywords: ["GZRS", "ストレージ冗長性"],
  },
  {
    id: "az900-q12",
    domainId: "az900-domain-2",
    domainLabel: "02: Azure のアーキテクチャとサービス",
    difficulty: "応用",
    selectCount: 1,
    question:
      "法規制により 7 年間の保管が義務付けられている監査ログファイルを Azure Blob Storage に保存します。通常はほぼアクセスせず、万一の監査時には取り出しに数時間かかっても問題ないため、ストレージ保管単価を最も安く抑えたい場合に適したアクセス層はどれですか？",
    options: [
      "Hot アクセス層",
      "Cool アクセス層（最低 30 日）",
      "Cold アクセス層（最低 90 日）",
      "Archive アクセス層（最低 180 日）",
    ],
    correctIndices: [3],
    explanation:
      "Archive アクセス層はオフライン保管により最も低いストレージ単価を提供し、最低保存期間は 180 日です。読み取り時にオンライン層へのリハイドレート（数時間）を許容できる長期アーカイブに最適です。",
    keywords: ["Archive 層", "Blob Storage", "コスト最適化"],
  },
  {
    id: "az900-q13",
    domainId: "az900-domain-2",
    domainLabel: "02: Azure のアーキテクチャとサービス",
    difficulty: "標準",
    selectCount: 2,
    question:
      "Azure のコンピュート・ネットワーキングサービスに関する説明として正しいものを 2 つ選択してください。",
    options: [
      "Azure Virtual Desktop (AVD) は Windows 10/11 のマルチセッション環境を提供し、仮想デスクトップを効率的に配信できる",
      "Azure Private Endpoint を使うと、Azure Storage や Azure SQL Database などの PaaS サービスへ VNet 内のプライベート IP で接続できる",
      "Azure Container Instances (ACI) を利用するには事前に Kubernetes コントロールプレーンの構築が必須である",
      "VNet ピアリングを利用すると、すべてのトラフィックが必ずパブリックインターネットを経由して暗号化転送される",
    ],
    correctIndices: [0, 1],
    explanation:
      "AVD は Windows マルチセッション VDI を提供し、Private Endpoint は PaaS へ VNet のプライベート IP を割り当てます。ACI は Kubernetes 管理不要で単発コンテナを実行でき、VNet ピアリングは Microsoft 内部バックボーン経由でプライベート通信を行います。",
    keywords: ["AVD", "Private Endpoint", "ACI", "VNet ピアリング"],
  },
  {
    id: "az900-q14",
    domainId: "az900-domain-2",
    domainLabel: "02: Azure のアーキテクチャとサービス",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Azure におけるゼロトラストモデルと ID・セキュリティ制御に関する正しい記述を 2 つ選択してください。",
    options: [
      "ゼロトラストの 3 原則は『明示的に検証する』『最小特権アクセスを使う』『侵害を前提とする』である",
      "Microsoft Entra の条件付きアクセスは、ユーザー・場所・デバイス準拠状態などの条件に基づきアクセス許可や MFA 要求を制御する",
      "社内ネットワーク（VPN 接続済み）からのアクセスであれば、ゼロトラストモデルでは認証や検証を完全に省略できる",
      "多層防御（Defense in Depth）とは、ファイアウォール 1 箇所だけを強化して内部セキュリティを省く手法である",
    ],
    correctIndices: [0, 1],
    explanation:
      "ゼロトラストでは社内ネットワーク内でも暗黙の信頼を行わず、場所やデバイス状態等を評価する条件付きアクセスと最小権限（RBAC / JIT）を徹底します。多層防御は物理からデータまで 7 層を重ねて単一防御突破時の被害を抑える考え方です。",
    keywords: ["ゼロトラスト", "条件付きアクセス", "多層防御"],
  },
  {
    id: "az900-q15",
    domainId: "az900-domain-3",
    domainLabel: "03: Azure の管理とガバナンス",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "既存のオンプレミスデータセンターで稼働中の物理サーバーやストレージ、電力・冷却・保守費を含めた運用コストと、同等の環境を Azure へ移行した場合の 3〜5 年間の総コストを比較試算したい場合に利用すべき公式ツールはどれですか？",
    options: [
      "Azure TCO 計算ツール（Total Cost of Ownership Calculator）",
      "Azure Service Health",
      "Azure Monitor",
      "AzCopy",
    ],
    correctIndices: [0],
    explanation:
      "TCO 計算ツールはオンプレミス環境のインフラ・運用コストと Azure 移行後のコスト削減見込みを比較試算するツールです。一方、構築予定の Azure リソース構成から月額費用を見積もるには Azure 料金計算ツールを使います。",
    keywords: ["TCO 計算ツール", "コスト管理"],
  },
  {
    id: "az900-q16",
    domainId: "az900-domain-3",
    domainLabel: "03: Azure の管理とガバナンス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Azure のコスト要因およびリソースタグの仕様に関する説明として正しいものはどれですか？",
    options: [
      "インターネットから Azure データセンターへの受信（インバウンド）データ転送は原則無料だが、Azure 外への送信（アウトバウンド）データ転送は課金対象となる",
      "リソースグループに付与したタグは、その配下に作成したすべての仮想マシンやストレージアカウントへ自動的に継承される",
      "Azure リソースの単価は世界中の全リージョンで完全に同一であり、デプロイ先リージョンはコストに影響しない",
      "停止して割り当て解除（Stopped Deallocated）にした仮想マシンのコンピュート時間課金も、稼働中と同額で請求され続ける",
    ],
    correctIndices: [0],
    explanation:
      "インターネットからの受信データ転送は無料、送信データ転送には帯域幅課金が発生します（リージョン間転送等も有料）。リソースグループのタグは配下リソースに自動継承されず、リージョンによって料金単価も異なります。割り当て解除状態の VM はコンピュート課金が止まります（ディスク等ストレージ費は継続）。",
    keywords: ["コスト要因", "帯域幅", "リソースタグ"],
  },
  {
    id: "az900-q17",
    domainId: "az900-domain-3",
    domainLabel: "03: Azure の管理とガバナンス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "本番データベースを含むリソースグループに対して、管理者権限（所有者ロール）を持つユーザーであっても誤ってリソースを削除できないようにしつつ、必要な設定変更や通常の読み書き操作は許可したい場合、適用すべき機能はどれですか？",
    options: [
      "CanNotDelete リソースロック",
      "ReadOnly リソースロック",
      "Azure 料金計算ツール",
      "Azure Advisor",
    ],
    correctIndices: [0],
    explanation:
      "CanNotDelete ロックはリソースの読み取りと設定変更は許可しつつ削除だけを禁止します。ReadOnly ロックは削除に加えて変更も禁止します。",
    keywords: ["リソースロック", "CanNotDelete", "ガバナンス"],
  },
  {
    id: "az900-q18",
    domainId: "az900-domain-3",
    domainLabel: "03: Azure の管理とガバナンス",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "セキュリティ監査の対応として、Microsoft が Azure に対して取得している ISO 27001 や SOC 2 などの独立第三者監査レポートおよびコンプライアンス関連ドキュメントをダウンロードしたい場合、アクセスすべきポータルはどれですか？",
    options: [
      "Azure Cloud Shell",
      "Microsoft Service Trust Portal",
      "Azure Pricing Calculator",
      "Azure Virtual Network Manager",
    ],
    correctIndices: [1],
    explanation:
      "Microsoft Service Trust Portal は Microsoft のクラウドサービスに関する第三者監査報告書、コンプライアンス文書、セキュリティ実装ホワイトペーパーを取得できる公式ポータルです。",
    keywords: ["Service Trust Portal", "コンプライアンス"],
  },
  {
    id: "az900-q19",
    domainId: "az900-domain-3",
    domainLabel: "03: Azure の管理とガバナンス",
    difficulty: "標準",
    selectCount: 2,
    question:
      "Azure のデプロイ自動化とハイブリッド環境管理に関する説明として正しいものを 2 つ選択してください。",
    options: [
      "ARM テンプレートや Bicep を用いる Infrastructure as Code (IaC) により、同一環境を宣言的・再現可能にデプロイできる",
      "Azure Arc を利用すると、オンプレミスや他社クラウド上のサーバーや Kubernetes を Azure 管理画面へ統合し Azure Policy 等を適用できる",
      "Azure Cloud Shell は Windows ローカル PC に専用エージェントをインストールしないと起動できない",
      "Bicep はネットワーク帯域幅を計測するためだけの監視ツールであり、リソースのプロビジョニングには使用できない",
    ],
    correctIndices: [0, 1],
    explanation:
      "ARM テンプレート / Bicep は宣言型 IaC ツールで冪等なデプロイを実現し、Azure Arc は Azure 外のマルチクラウド・オンプレミス資産へ Azure のガバナンスや監視を拡張します。Cloud Shell はブラウザ上から追加インストール不要で利用可能です。",
    keywords: ["ARM テンプレート", "Bicep", "Azure Arc", "IaC"],
  },
  {
    id: "az900-q20",
    domainId: "az900-domain-3",
    domainLabel: "03: Azure の管理とガバナンス",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Azure の運用監視・正常性確認・最適化ツールに関する正しい組み合わせを 2 つ選択してください。",
    options: [
      "使用中の東日本リージョンで Azure プラットフォーム側の障害や計画メンテナンスが発生していないか確認するには『Azure Service Health』を使う",
      "稼働中リソースのコスト削減・セキュリティ・信頼性・パフォーマンス・運用に関する推奨改善案を確認するには『Azure Advisor』を使う",
      "Web アプリの詳細な応答時間や VM の CPU 使用率の推移を収集・アラート通知するには『Microsoft Purview』を使う",
      "複数のサブスクリプションへ『東日本リージョンのみデプロイ許可』というルールを強制するには『Azure 料金計算ツール』を使う",
    ],
    correctIndices: [0, 1],
    explanation:
      "Azure 基盤側の障害や計画メンテ確認は Azure Service Health、5 本柱の最適化提案は Azure Advisor が担います。VM やアプリのテレメトリ監視は Azure Monitor、データガバナンスは Microsoft Purview、ルール強制は Azure Policy の役割です。",
    keywords: ["Azure Service Health", "Azure Advisor", "Azure Monitor"],
  },
];

export const az900OfficialResources: AzureOfficialResource[] = [
  {
    title: "Microsoft Certified: Azure Fundamentals 認定公式ページ",
    description: "AZ-900 認定資格の概要、対象者、受験要件、更新不要（無期限）ルールを確認できます。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/azure-fundamentals/",
    badge: "公式認定ページ",
  },
  {
    title: "Exam AZ-900 公式試験ガイド (Study Guide)",
    description: "出題分野別の出題比率と評価項目（Skills measured）の最新一次情報です。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/resources/study-guides/az-900",
    badge: "公式試験ガイド",
  },
  {
    title: "Exam AZ-900 試験詳細・無料練習用評価",
    description: "Pearson VUE での受験予約および Microsoft Learn 無料の練習用評価へアクセスできます。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/exams/az-900/",
    badge: "試験・模擬評価",
  },
  {
    title: "Microsoft Learn 公式トレーニング (AZ-900T00)",
    description: "クラウド概念、Azure アーキテクチャ、管理とガバナンスを体系的に学べる公式コースです。",
    url: "https://learn.microsoft.com/ja-jp/training/courses/az-900t00",
    badge: "公式トレーニング",
  },
];
