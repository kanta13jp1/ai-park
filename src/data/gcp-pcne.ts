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

// 出典: Google Cloud 認定 Professional Cloud Network Engineer 公式試験ガイド・公式ドキュメント
export const pcneExamFacts: CertExamFact[] = [
  { label: "対象試験", value: "Professional Cloud Network Engineer", detail: "VPC設計・負荷分散・ハイブリッド接続・監視最適化" },
  { label: "試験時間", value: "120 分", detail: "選択問題（単一選択・複数選択）" },
  { label: "問題数", value: "50〜60 問", detail: "公式ガイド基準（出題数は試験回により変動）" },
  { label: "合格ライン", value: "非公開（合否通知）", detail: "公式スコア非公開（合否のみ通知）" },
  { label: "有効期限", value: "2 年間", detail: "Professional レベル認定（取得日から 2 年）" },
  { label: "受験環境・推奨経験", value: "Webassessor / 3年以上", detail: "業界3年以上・GCP ネットワーク構築/運用1年以上推奨" },
];

export const pcneDomains: GcpDomain[] = [
  {
    id: "pcne-domain-1",
    number: "01",
    title: "Google Cloud ネットワークの設計・計画・プロトタイピング",
    englishTitle: "Designing, planning, and prototyping a Google Cloud network",
    weight: "公式非公開（全体設計）",
    accentColor: "indigo",
    summary:
      "Global VPC と Network Service Tiers（Premium / Standard）の選定、Shared VPC / VPC Network Peering / Network Connectivity Center のトポロジ設計、GKE VPC-Native（Alias IP）の IP サイジングとマネージドサービス接続設計を学びます。",
    topics: [
      {
        id: "pcne-1-1",
        code: "1.1",
        title: "Global VPC・Network Service Tiers とマルチプロジェクトトポロジ",
        services: ["Global VPC", "Network Service Tiers", "Shared VPC", "VPC Network Peering"],
        keyPoints: [
          "Google Cloud の VPC はグローバルリソースであり、単一 VPC 内に複数リージョンのサブネットを配置してリージョン間通信を内部バックボーン経由で行える",
          "Network Service Tiers では Premium Tier（Google グローバルバックボーン経由・グローバル Anycast 外部 LB 対応・高可用性）と Standard Tier（インターネット経由・リージョン外部 IP のみ・低コスト）をワークロード要件で使い分ける",
          "Shared VPC は同一組織内のホストプロジェクトでネットワーク・Firewall・ハイブリッド接続を一元管理し、サービスプロジェクトへサブネット単位で IAM 権限を付与する",
          "VPC Network Peering は異なる VPC（別組織可）をプライベート IP で接続するが非推移的（Non-transitive）であり、1 VPC あたりデフォルト上限 25 ピアリングかつ IP 重複不可という制約を持つ",
        ],
        examTip: "『同一組織内でネットワーク管理とアプリ開発の責務を分離し、共通の Interconnect を共有したい』＝ Shared VPC、『別組織の独立管理 VPC 同士を 1 対 1 接続』＝ VPC Network Peering。",
      },
      {
        id: "pcne-1-2",
        code: "1.2",
        title: "GKE VPC-Native（Alias IP）とプライベートサービス接続設計",
        services: ["GKE VPC-Native", "Alias IP", "Private Service Connect", "Private Services Access"],
        keyPoints: [
          "GKE VPC-Native クラスタはサブネットのセカンダリ IP 範囲から Alias IP を Pod と Service に割り当てるため、VPC ルート上限を圧迫せず Cloud NAT・Peering・オンプレ接続と自然に統合できる",
          "GKE Standard でノードあたりデフォルト最大 110 Pod の場合、IP 再利用衝突を防ぐ 2 倍ルール（220 IP 以上）により各ノードへ /24（256 IP）の Alias IP ブロックが自動確保されるため、ノード数に応じた十分なセカンダリ CIDR 設計が不可欠",
          "Private Services Access（PSA）は Cloud SQL・AlloyDB・Memorystore 等の Google マネージドサービス VPC へ `/16` 等の IP 範囲を割り当てて VPC ピアリングする方式（非推移的のためオンプレ接続にはカスタムルート広報が必要）",
          "Private Service Connect（PSC）は NAT ベースの単方向エンドポイント／バックエンド公開であり、コンシューマー側とプロデューサー側の IP 重複を許容し、VPC ピアリング上限や推移的制約を回避できる",
        ],
        examTip: "『IP 重複がある顧客 VPC や多数のパートナー VPC へ自社サービスを安全にプライベート公開したい』＝ Private Service Connect（PSC）。",
      },
      {
        id: "pcne-1-3",
        code: "1.3",
        title: "負荷分散・DNS・ハブ＆スポークおよびサーバーレス接続計画",
        services: ["Cloud Load Balancing", "Cloud DNS", "Network Connectivity Center", "Serverless VPC Access"],
        keyPoints: [
          "要件（外部 vs 内部、L7 HTTP(S) vs L4 TCP/UDP、グローバル Anycast vs リージョン、プロキシ vs パススルー、送信元 IP 保持有無）から最適な Cloud Load Balancing 種別を最初に決定する",
          "Cloud DNS 設計では、パブリック／プライベートゾーンの分離、オンプレミス DNS との相互名前解決（Inbound / Outbound Forwarding）、および Shared VPC 環境での DNS ゾーン共有（クロスプロジェクト結合／DNS Peering）を計画する",
          "Network Connectivity Center（NCC）はハブ＆スポークモデルで、複数の VPC スポークやオンプレミス／他クラウド接続（Interconnect・HA VPN・Router Appliance）間のルーティングとサイト間データ転送を統合オーケストレーションする",
          "Cloud Run や Cloud Run functions（第 1/2 世代）から VPC 内のプライベートリソース（Cloud SQL・Memorystore・内部 LB 等）へ通信するには、Serverless VPC Access コネクタ（または Cloud Run の Direct VPC Egress）を計画する",
        ],
        examTip: "『複数拠点や多数 VPC をハブ＆スポークでつなぎ、VPC ピアリングの非推移制約を解消したい』＝ Network Connectivity Center（NCC）。",
      },
    ],
  },
  {
    id: "pcne-domain-2",
    number: "02",
    title: "Virtual Private Cloud（VPC）インスタンスの実装",
    englishTitle: "Implementing Virtual Private Cloud (VPC) instances",
    weight: "公式非公開（VPC実装）",
    accentColor: "cyan",
    summary:
      "Custom Mode VPC・サブネット拡張・MTU・動的ルーティングモード（Regional / Global）の実装、Policy-Based Routing・Cloud NAT・Multi-NIC VM、さらに Cloud NGFW・階層型ファイアウォールポリシー・Secure Tags を学びます。",
    topics: [
      {
        id: "pcne-2-1",
        code: "2.1",
        title: "Custom Mode VPC・サブネット・MTU・動的ルーティングモード",
        services: ["Custom Mode VPC", "Dynamic Routing Mode", "VPC MTU", "Private Google Access"],
        keyPoints: [
          "本番環境では自動モード（`10.128.0.0/9` を全リージョンに自動生成しオンプレ等と重複しやすい）ではなく Custom Mode VPC を作成し、必要なリージョンに重複しない CIDR でサブネットを定義する（サブネットの拡張は既存 VM を止めずインプレースで可能だが縮小は不可）",
          "Dynamic Routing Mode を Regional（デフォルト）にすると Cloud Router は同一リージョンのサブネットのみを広報・学習ルートも同リージョンのみに適用する。Global に変更すると VPC 内全リージョンのサブネット広報とフェイルオーバーが可能になる",
          "VPC MTU はデフォルト 1460 bytes であり、1500 bytes やジャンボフレーム 8896 bytes へ変更可能だが、通信パス上の全リソース（対向 VPC・VLAN Attachment・オンプレ機器）と MTU を一致させる必要がある",
          "Private Google Access（PGA）はサブネット単位で有効化し、外部 IP を持たない VM から `private.googleapis.com`（`199.36.153.8/30`）または VPC Service Controls 対応の `restricted.googleapis.com`（`199.36.153.4/30`）経由で Google APIs へ閉域接続させる",
        ],
        examTip: "『東京リージョンの Cloud Router で受け取ったオンプレルートを、大阪リージョンの VM からも利用させたい』＝ VPC の Dynamic Routing Mode を Global に変更。",
      },
      {
        id: "pcne-2-2",
        code: "2.2",
        title: "ルーティング・Cloud NAT・マルチ NIC（NVA）構成",
        services: ["Policy-Based Routing", "Custom Static Routes", "Cloud NAT", "Multi-NIC VM"],
        keyPoints: [
          "通常の VPC ルーティングは最長プレフィックス一致（LPM）→ 優先度（数値が小さい方が優先）で評価される。Policy-Based Routing（PBR）を用いると、送信元 IP やプロトコル/ポート等の条件に一致する通信を VPC ルートより優先して特定の内部ネットワーク LB 等へ誘導できる",
          "Custom Static Routes にネットワークタグを指定すると、特定タグを持つ VM のアウトバウンド通信のみを専用ネクストホップ（例：NVA 仮想ファイアウォールやデフォルトインターネットゲートウェイ迂回）へ制御できる",
          "Cloud NAT は外部 IP を持たない VM や GKE ノードがアウトバウンド通信（パッケージ更新や外部 API 呼び出し等）を行うためのリージョナル分散マネージド SNAT サービスであり、外部からの非要求インバウンド接続は許可しない（最小ポート既定 64 ポート/VM、外部 IP 付き VM には非適用）",
          "サードパーティ製 NVA（仮想ファイアウォール等）を構築する Multi-NIC VM では、各 NIC を別々の VPC ネットワークのサブネットへ接続し、`--can-ip-forward`（IP フォワーディング）を有効化する",
        ],
        examTip: "『外部 IP のない VM 群が固定の送信元パブリック IP で外部パートナー API にアクセスしたい』＝ Cloud NAT に手動割り当ての静的外部 IP を設定。",
      },
      {
        id: "pcne-2-3",
        code: "2.3",
        title: "Cloud NGFW・階層型ファイアウォールポリシー・セキュアタグ",
        services: ["Cloud NGFW", "Hierarchical Firewall Policy", "Secure Tags", "Service Account Filtering"],
        keyPoints: [
          "評価順は Hierarchical Firewall Policy（組織・フォルダ階層に紐づく最上位ガードレール、`goto_next` で下位へ評価委譲可）→ Global/Regional Network Firewall Policy → 従来の VPC Firewall Rules の順で評価される",
          "Cloud NGFW は Essentials（L3/L4・セキュアタグ）、Standard（FQDN オブジェクト・ジオロケーション・Google 脅威インテリジェンスリスト）、Enterprise（L7 IPS 侵入防止・TLS インスペクションによるインライン遮断）の 3 ティアを提供する",
          "Secure Tags は Resource Manager と IAM（`roles/resourcemanager.tagUser`）で厳格に統制されるタグであり、VM 編集権限を持つ開発者が自由に付け替えられる従来の Network Tags と異なり、本番ファイアウォールのターゲット統制に適する",
          "Service Account Filtering を用いると、IP やタグではなく VM にアタッチされた IAM サービスアカウントを送信元/送信先として指定し、ゼロトラストなマイクロセグメンテーションを実現できる（同一 VPC またはピアリング VPC 内で有効）",
        ],
        examTip: "『VM 作成者が勝手にタグを変更してセキュリティルールをすり抜けるのを防ぎたい』＝ Network Tags ではなく Secure Tags（または Service Account Filtering）を使用。",
      },
    ],
  },
  {
    id: "pcne-domain-3",
    number: "03",
    title: "ネットワークサービスの構成",
    englishTitle: "Configuring network services",
    weight: "公式非公開（サービス構成）",
    accentColor: "emerald",
    summary:
      "L7/L4 Cloud Load Balancing の各方式と Proxy-Only Subnet・NEG 構成、Cloud CDN キャッシュ制御、Cloud Armor（WAF / Adaptive Protection）と SSL Policy、Cloud DNS（転送・ピアリング・ルーティングポリシー・DNSSEC）を学びます。",
    topics: [
      {
        id: "pcne-3-1",
        code: "3.1",
        title: "Cloud Load Balancing・Proxy-Only Subnet・NEG 構成",
        services: ["Global External Application LB", "Proxy-Only Subnet", "Internal Passthrough Network LB", "NEG"],
        keyPoints: [
          "Global External Application LB は単一のグローバル Anycast IP（Premium Tier）で世界中のユーザーを最寄り健全バックエンドへ誘導し、URL マップ・HTTP(S) ヘッダ操作・Cloud Armor・Cloud CDN と統合できる",
          "Regional External / Internal Application LB および Cross-Region Internal Application LB（Envoy ベースのプロキシ LB）を展開するリージョンには、Envoy プロキシ用の専用 Proxy-Only Subnet（`purpose=REGIONAL_MANAGED_PROXY`、推奨 `/23`）の作成が必須",
          "Internal Passthrough Network LB（リージョン L4 ILB）はプロキシを介さずクライアント送信元 IP を保持したまま転送でき、カスタム静的ルートのネクストホップ（高可用性 NVA 構成等）としても指定できる",
          "Network Endpoint Group（NEG）は用途に応じ使い分ける：Zonal NEG（GKE Container-native LB で Pod IP 直結し kube-proxy ホップを削減）、Serverless NEG（Cloud Run / App Engine）、Hybrid Connectivity NEG（オンプレ IP:ポート）、Internet NEG（外部 FQDN）",
        ],
        examTip: "『リージョン内部アプリケーション LB を作成しようとしてサブネット不足エラーが出た』＝ Proxy-Only Subnet（推奨 `/23`）の未作成が原因。",
      },
      {
        id: "pcne-3-2",
        code: "3.2",
        title: "Cloud CDN・Cloud Armor・SSL ポリシー構成",
        services: ["Cloud CDN", "Cloud Armor", "Adaptive Protection", "SSL Policy"],
        keyPoints: [
          "Cloud CDN は外部アプリケーション LB のバックエンドサービスまたは Backend Bucket で有効化し、キャッシュモード（`USE_ORIGIN_HEADERS` / `CACHE_ALL_STATIC` / `FORCE_CACHE_ALL`）、URL 署名（Signed URL / Cookie）、およびパス単位のキャッシュ無効化（Invalidation）を設定する",
          "Cloud Armor は外部 LB のエッジで動作し、IP 許可/拒否、地理的制限、OWASP Top 10 事前定義 WAF ルール（SQLi/XSS 等）、レート制限（Rate-based ban / Throttle）を適用できる（新規導入時は `preview` モードで誤検知を検証可能）",
          "Cloud Armor Adaptive Protection（Enterprise ティア等）は機械学習で L7 DDoS 攻撃やトラフィック急増の異常パターンをリアルタイム検知し、攻撃シグネチャに基づく緩和 WAF ルールを自動提案する",
          "SSL Policy をターゲット HTTPS / SSL プロキシへアタッチすることで、TLS 1.0/1.1 等の古いバージョンや脆弱な暗号スイートを禁止し、TLS 1.2 / 1.3 の `MODERN` または `RESTRICTED` プロファイルを強制できる",
        ],
        examTip: "『Cloud Armor ルールをいきなり遮断設定にして正常通信を止めたくない』＝ Preview モード（ログ記録のみ）で影響確認してから本番適用。",
      },
      {
        id: "pcne-3-3",
        code: "3.3",
        title: "Cloud DNS（転送・ピアリング・ルーティングポリシー・DNSSEC）",
        services: ["Cloud DNS Forwarding", "DNS Peering", "DNSSEC", "DNS Routing Policy"],
        keyPoints: [
          "Cloud DNS Forwarding（Outbound Forwarding ゾーンまたは Outbound Server Policy）は VPC 内の名前解決をオンプレミス DNS サーバーへ条件転送し、送信元 IP として Google 管理レンジ `35.199.192.0/19` を使用する（オンプレ側の FW 許可と戻りルートが必須）",
          "オンプレミスから Cloud DNS プライベートゾーンを名前解決するには、VPC サブネット上にエントリポイント IP を払い出す Inbound Server Policy（受信サーバーポリシー）を有効化する",
          "DNS Peering はコンシューマー VPC からプロデューサー VPC（例：Shared VPC やハブ VPC）のプライベートゾーン／転送ゾーンを直接参照させる仕組みで、各 VPC にレコードを重複登録せずに済む",
          "DNS Routing Policy により Geo-location（地理的位置）・加重ラウンドロビン（WRR）・フェイルオーバー（ヘルスチェック連動）を実現でき、パブリックゾーンでは DNSSEC を有効化して DNS スプーフィングやキャッシュポイズニングを防止できる",
        ],
        examTip: "『VPC からオンプレ DNS サーバーへ名前解決が飛ばない』＝ オンプレ側で `35.199.192.0/19` からの UDP/TCP 53 許可と、同レンジへの BGP 戻りルート広告を確認。",
      },
    ],
  },
  {
    id: "pcne-domain-4",
    number: "04",
    title: "ハイブリッド相互接続の実装",
    englishTitle: "Implementing hybrid interconnectivity",
    weight: "公式非公開（ハイブリッド重点）",
    accentColor: "amber",
    summary:
      "Dedicated Interconnect・Partner Interconnect・HA VPN の選定と 99.9% / 99.99% SLA トポロジ、VLAN Attachment、Cloud Router による BGP（ASN・MED・BFD・Custom Route Advertisement）構成を学びます。",
    topics: [
      {
        id: "pcne-4-1",
        code: "4.1",
        title: "Dedicated / Partner Interconnect・VLAN Attachment と SLA トポロジ",
        services: ["Dedicated Interconnect", "Partner Interconnect", "VLAN Attachment", "99.99% SLA Topology"],
        keyPoints: [
          "Dedicated Interconnect は Google 指定のコロケーション施設（PoP）で物理光ファイバを直接クロスコネクト接続し（10Gbps / 100Gbps 単位）、Partner Interconnect は認定パートナー回線経由で接続するため（50Mbps〜50Gbps）コロケーション施設に自社ラックが無い場合に最適",
          "Dedicated / Partner Interconnect の論理接続はリージョナルリソースである VLAN Attachment で作成し、複数リージョンの VPC や Shared VPC ホストプロジェクトと接続できる",
          "99.9% SLA 達成には『単一メトロ内の異なる 2 つのエッジ可用性ドメイン（zone1 / zone2）』に 2 本の接続（VLAN Attachment 2 本）が必要（1 本のみでは SLA 対象外）",
          "99.99% SLA 達成には『2 つの異なるメトロ（都市圏）それぞれで両方のエッジ可用性ドメインに配置する計 4 本の接続』を構成し、かつ VPC の Dynamic Routing Mode を Global に設定する必要がある",
        ],
        examTip: "『Dedicated Interconnect の本番 SLA 99.99% 要件』＝ 2 メトロ × 各 2 エッジ可用性ドメイン（計 4 接続）＋ VPC Global Dynamic Routing。",
      },
      {
        id: "pcne-4-2",
        code: "4.2",
        title: "HA VPN・Cloud Router（BGP / MED / カスタムルート広報）",
        services: ["HA VPN", "Cloud Router", "BGP MED", "Custom Route Advertisement"],
        keyPoints: [
          "HA VPN は 2 つの冗長インターフェースを持つゲートウェイを適切なオンプレミス側冗長ピアと組むことで 99.99% の可用性 SLA を提供し、IPsec トンネルあたり最大 3Gbps（複数トンネルの ECMP 構成で帯域拡張可）のスループットを発揮する",
          "Interconnect 通信を IPsec で暗号化する『HA VPN over Cloud Interconnect（Encrypted Interconnect）』では、カプセル化オーバーヘッドのため VLAN Attachment と VPC の MTU を 1440 bytes に合わせる必要がある",
          "Cloud Router の BGP ASN 要件として、Partner Interconnect では Google 指定の ASN `16550` が必須である一方、Dedicated Interconnect および HA VPN では任意のプライベート ASN（`64512–65534` 等）を設定できる",
          "BGP MED（Multi-Exit Discriminator）でアクティブ／パッシブ優先度（小さい値ほど優先）や ECMP（同一 MED 値）を制御し、デフォルトでは広報されない `199.36.153.4/30`・PSA 範囲・`35.199.192.0/19` 等は Custom Route Advertisement で明示広報する（BFD で障害検知を高速化可能）",
        ],
        examTip: "『オンプレから Private Services Access の Cloud SQL プライベート IP や Private Google Access VIP へ専用線経由で到達できない』＝ Cloud Router で Custom Route Advertisement が未設定。",
      },
    ],
  },
  {
    id: "pcne-domain-5",
    number: "05",
    title: "ネットワーク運用の管理・監視・最適化",
    englishTitle: "Managing, monitoring, and optimizing network operations",
    weight: "公式非公開（監視・最適化）",
    accentColor: "indigo",
    summary:
      "VPC Flow Logs・Firewall Insights・Packet Mirroring・Cloud IDS による可観測性と脅威検知、Network Intelligence Center（Connectivity Tests / Performance Dashboard / Network Topology）を用いた障害診断とコスト・パフォーマンス最適化を学びます。",
    topics: [
      {
        id: "pcne-5-1",
        code: "5.1",
        title: "VPC Flow Logs・Firewall Insights・Packet Mirroring・Cloud IDS",
        services: ["VPC Flow Logs", "Firewall Insights", "Packet Mirroring", "Cloud IDS"],
        keyPoints: [
          "VPC Flow Logs はサブネット単位で有効化し、L3/L4 トラフィックのメタデータ（送信元/先 IP・ポート・バイト数・RTT 等）を Cloud Logging へ記録する（ペイロードは記録せず、サンプリングレートと集約間隔でログコストを最適化できる）",
          "Firewall Insights は Firewall Rules Logging と連携し、ヒットしない未使用ルール・重複ルール・優先度により隠されたシャドウ化ルールを自動検出し、セキュリティルールの棚卸しと最適化を支援する",
          "Packet Mirroring はサブネット・ネットワークタグ・インスタンス単位で通信パケットの**全ペイロード**（Ingress / Egress）を複製し、Internal Passthrough Network LB 背後の IDS/フォレンジックコレクタへパス外転送する",
          "Cloud IDS（Cloud Intrusion Detection System）は内部で Packet Mirroring を利用してパス外（Out-of-path）で L7 ペイロードを解析し、マルウェアや C&C 通信を低遅延影響なしで検知・アラート化する（インライン遮断には Cloud NGFW Enterprise を使用）",
        ],
        examTip: "『本番通信のレイテンシに影響を与えず全ペイロードから C&C 通信を検知したい』＝ Cloud IDS（Packet Mirroring 利用）、『メタデータと送信量だけ可視化したい』＝ VPC Flow Logs。",
      },
      {
        id: "pcne-5-2",
        code: "5.2",
        title: "Network Intelligence Center による障害診断とパフォーマンス最適化",
        services: ["Network Intelligence Center", "Connectivity Tests", "Performance Dashboard", "Network Topology"],
        keyPoints: [
          "Network Intelligence Center（NIC）は Google Cloud 全体のネットワーク可視化・診断・最適化を統合した管理コンソールである",
          "Connectivity Tests は実パケットを送出することなく VPC ルート・ファイアウォール・Cloud NAT・LB・Peering・VPN・VLAN Attachment 等の構成をトレースし、到達可否と遮断箇所（例：特定 Firewall ルールやルート欠如）を即座に特定できる",
          "Performance Dashboard は自プロジェクトのリージョン間／ゾーン間／オンプレ（Interconnect/VPN）間のパケットロス率と RTT レイテンシに加え、Google Cloud 全体ベースラインとの比較を提供し、障害が自社設定か基盤要因かの切り分けに役立つ",
          "Network Topology はリージョン・VPC・GKE・ロードバランサ・ハイブリッド拠点間のリアルタイムトラフィックとスループットをインタラクティブグラフで可視化し、Network Analyzer と合わせて設定不備や IP 枯渇を早期発見できる",
        ],
        examTip: "『VM 間で通信が通らない原因がルートかファイアウォールか、パケットを流さず即特定したい』＝ Connectivity Tests、『リージョン間の遅延やパケロス増加が Google 基盤側か確認したい』＝ Performance Dashboard。",
      },
    ],
  },
];

export const pcneComparisons: GcpComparisonTable[] = [
  {
    id: "pcne-comp-vpc-topology",
    category: "ネットワーク・セキュリティ",
    title: "マルチプロジェクト・マルチ VPC 接続 & VPC 基本設計比較",
    subtitle: "Global VPC・Shared VPC・VPC Peering・NCC・Private Service Connect の選定基準",
    columns: ["機能 / 方式", "接続スコープ・形態", "主な制約 / 特徴", "推奨ユースケース"],
    rows: [
      {
        feature: "Global VPC (Custom Mode VPC)",
        values: ["単一 VPC で全リージョン統合", "Dynamic Routing Mode（Regional/Global）と VPC MTU を構成可", "自動モードの IP 重複を避ける本番標準構成"],
      },
      {
        feature: "Shared VPC",
        values: ["同一組織内のホスト ↔ サービス PJ", "Host Project でネットワーク・Firewall・ハイブリッドを一元統制", "組織内の開発チーム間での責務分離・IP 統一管理"],
      },
      {
        feature: "VPC Network Peering",
        values: ["別組織・別 PJ の VPC 間 1対1", "非推移的（Non-transitive）・IP 重複不可・上限 25 接続", "少数の独立組織・別管理 VPC 間の直接通信"],
      },
      {
        feature: "Network Connectivity Center (NCC)",
        values: ["ハブ＆スポーク統合（VPC / Hybrid）", "多数 VPC スポークや Interconnect/VPN をハブで中継接続", "大規模マルチ VPC・マルチ拠点の一元ルーティング"],
      },
      {
        feature: "Private Service Connect (PSC)",
        values: ["NAT ベース単方向エンドポイント", "IP 重複許容・ピアリング上限回避・推移制約を受けにくい", "SaaS 公開・組織外パートナー接続・Google API 閉域接続"],
      },
      {
        feature: "Private Services Access (PSA)",
        values: ["マネージドサービス VPC とのピアリング", "Cloud SQL/AlloyDB/Memorystore 向け・オンプレにはカスタム広報要", "Google マネージド DB との閉域接続"],
      },
      {
        feature: "Serverless VPC Access",
        values: ["サーバーレス → VPC コネクタ", "Cloud Run / Cloud Run functions から内部 IP リソースへ接続", "サーバーレスアプリから内部 DB/VM への閉域通信"],
      },
    ],
    decisionRule:
      "同一組織の統制＝Shared VPC、少数独立 VPC＝VPC Network Peering、ハブ中継＝Network Connectivity Center、IP 重複許容のサービス公開＝Private Service Connect。",
  },
  {
    id: "pcne-comp-lb",
    category: "ネットワーク・セキュリティ",
    title: "Cloud Load Balancing ロードバランサ & Network Service Tiers 比較",
    subtitle: "L7/L4・外部/内部・プロキシ/パススルー・Proxy-Only Subnet・NEG の選定軸",
    columns: ["ロードバランサ / 機能", "レイヤ / スコープ", "主な要件・特性", "適用シナリオ"],
    rows: [
      {
        feature: "Global External Application LB",
        values: ["L7 HTTP(S) / グローバル Anycast", "Premium Tier・Cloud CDN・Cloud Armor・SSL Policy 対応", "グローバル Web/API・マルチリージョン自動フェイルオーバー"],
      },
      {
        feature: "Regional External / Internal Application LB",
        values: ["L7 HTTP(S) / リージョン Envoy", "展開リージョンに Proxy-Only Subnet（推奨 /23）が必須", "データレジデンシー制約・VPC 内 L7 ルーティング"],
      },
      {
        feature: "External Passthrough Network LB",
        values: ["L4 TCP/UDP / リージョン", "プロキシせず送信元 IP 保持・超低レイテンシ", "オンラインゲーム UDP・非 HTTP 独自プロトコル"],
      },
      {
        feature: "Internal Passthrough Network LB",
        values: ["L4 TCP/UDP / リージョン内部", "送信元 IP 保持・カスタム静的ルートの Next Hop に指定可", "VPC 内ミドルウェア・NVA 仮想アプライアンスの冗長化"],
      },
      {
        feature: "Network Endpoint Group (NEG)",
        values: ["Zonal / Serverless / Hybrid / Internet", "GKE Pod IP 直結・Cloud Run・オンプレ IP をバックエンド化", "Container-native LB（kube-proxy 回避）やハイブリッド負荷分散"],
      },
      {
        feature: "Network Service Tiers",
        values: ["Premium Tier vs Standard Tier", "Premium＝Google バックボーン経由 / Standard＝ISP 経由リージョン", "低遅延＆グローバル LB なら Premium、コスト優先なら Standard"],
      },
    ],
    decisionRule:
      "Web/API グローバル配信＝Global External Application LB（Premium Tier）、Envoy 系リージョン LB＝Proxy-Only Subnet 必須、元 IP 保持や NVA Next Hop＝Passthrough Network LB。",
  },
  {
    id: "pcne-comp-hybrid",
    category: "ネットワーク・セキュリティ",
    title: "ハイブリッド相互接続（Interconnect vs HA VPN）& Cloud Router 比較",
    subtitle: "帯域・SLA トポロジ・MTU・Cloud Router BGP ASN / MED / Custom Route Advertisement",
    columns: ["接続方式 / 要素", "帯域・MTU 仕様", "SLA・ASN 要件", "選定・設計ポイント"],
    rows: [
      {
        feature: "Dedicated Interconnect",
        values: ["10Gbps / 100Gbps 単位・VLAN Attachment 最大 8896B", "単一メトロ2接続＝99.9% / 2メトロ4接続＝99.99% SLA Topology", "コロケーション施設に自社ラックがあり大容量・最低遅延が必要"],
      },
      {
        feature: "Partner Interconnect",
        values: ["50Mbps 〜 50Gbps（パートナー経由）", "2メトロ4接続で 99.99% SLA・Cloud Router ASN 16550 必須", "コロケーション拠点を持たずに専用線接続したい"],
      },
      {
        feature: "HA VPN",
        values: ["最大 3Gbps / トンネル（ECMP で拡張）", "2 インターフェース冗長構成で 99.99% SLA・プライベート ASN 使用", "インターネット経由・迅速導入・Interconnect 上なら MTU 1440B"],
      },
      {
        feature: "Cloud Router (BGP / MED)",
        values: ["動的ルート交換・BFD 高速障害検知", "Dedicated/HA VPN＝プライベート ASN、Partner＝ASN 16550", "BGP MED で Active/Passive（低値優先）や Active/Active (ECMP) 制御"],
      },
      {
        feature: "Custom Route Advertisement",
        values: ["非サブネット CIDR の広報追加", "PSA 範囲・199.36.153.4/30・35.199.192.0/19 等を手動指定", "オンプレから Cloud SQL プライベート IP や PGA/DNS へ到達させる"],
      },
    ],
    decisionRule:
      "自社ラックなし専用線＝Partner Interconnect（ASN 16550）、10G以上直接＝Dedicated Interconnect（4本2メトロで 99.99% SLA）、迅速暗号化＝HA VPN。",
  },
  {
    id: "pcne-comp-dns-access",
    category: "ネットワーク・セキュリティ",
    title: "Cloud DNS・プライベートアクセス & Cloud NAT 比較",
    subtitle: "Cloud DNS Forwarding / Peering / DNSSEC・PGA・Cloud NAT の責務整理",
    columns: ["機能 / 仕組み", "通信方向・動作単位", "重要 IP 範囲・設定仕様", "典型的な利用場面"],
    rows: [
      {
        feature: "Cloud DNS Forwarding (Outbound)",
        values: ["VPC → オンプレミス DNS 転送", "送信元 IP は 35.199.192.0/19（FW 許可＆戻りルート必須）", "GCP VM から社内ドメイン（corp.internal 等）を名前解決"],
      },
      {
        feature: "Cloud DNS Inbound Server Policy",
        values: ["オンプレミス → Cloud DNS 受信", "VPC サブネットごとに受信エントリポイント VIP を生成", "オンプレミス端末から GCP プライベートゾーンを名前解決"],
      },
      {
        feature: "DNS Peering & DNS Routing Policy",
        values: ["他 VPC 参照 / 条件別応答制御", "DNS Peering でゾーン共有、WRR / Geo / Failover で応答制御", "Shared VPC/ハブ構成での一元 DNS 管理・障害時切替"],
      },
      {
        feature: "DNSSEC",
        values: ["パブリック DNS 応答の署名検証", "ドメインレジストラへ DS レコードを登録して信頼連鎖確立", "DNS スプーフィング・キャッシュポイズニングの防止"],
      },
      {
        feature: "Private Google Access (PGA)",
        values: ["外部 IP なし VM → Google API", "private.googleapis.com (199.36.153.8/30) / restricted (199.36.153.4/30)", "VPC-SC 境界内の閉域環境から GCS / BigQuery API を利用"],
      },
      {
        feature: "Cloud NAT",
        values: ["外部 IP なし VM → インターネット (SNAT)", "リージョナル分散マネージド・既定最小 64 ポート/VM・非要求受信不可", "非公開 VM の OS パッチ取得や固定 IP での外部 API 連携"],
      },
    ],
    decisionRule:
      "VPC→オンプレ解決＝Cloud DNS Forwarding（35.199.192.0/19）、Google API 閉域＝Private Google Access、外部ネット送信＝Cloud NAT。",
  },
  {
    id: "pcne-comp-security",
    category: "ネットワーク・セキュリティ",
    title: "クラウドネットワーク防御（Cloud NGFW / Cloud Armor / Cloud IDS）比較",
    subtitle: "階層型ポリシー・Secure Tags・WAF・パス外検知の使い分け",
    columns: ["サービス / 機能", "動作位置・レイヤ", "制御方式・粒度", "防げる脅威 / 用途"],
    rows: [
      {
        feature: "Hierarchical Firewall Policy",
        values: ["組織 / フォルダ階層（最優先）", "全配下 VPC へ強制適用・goto_next でプロジェクト側へ委譲可", "全社統一の悪意ある IP 遮断・管理ポート制限ガードレール"],
      },
      {
        feature: "Cloud NGFW (Standard / Enterprise)",
        values: ["VPC インライン（L3〜L7 IPS）", "Secure Tags・Service Account Filtering・FQDN・TLS 復号 IPS", "IAM 統制下でのマイクロセグメンテーションとインライン脅威遮断"],
      },
      {
        feature: "Cloud Armor (+ Adaptive Protection)",
        values: ["外部アプリケーション LB エッジ（L7）", "OWASP WAF ルール・レート制限・ML ベース DDoS ルール自動提案", "SQLi/XSS・ボット・L7 HTTP フラッド DDoS 攻撃の緩和"],
      },
      {
        feature: "Cloud IDS (+ Packet Mirroring)",
        values: ["VPC パス外 / Out-of-path（L7）", "Packet Mirroring で全ペイロード複製・本番通信への遅延影響ゼロ", "マルウェア・C&C 通信・脆弱性悪用の高精度検知とアラート化"],
      },
    ],
    decisionRule:
      "組織ガードレール＝Hierarchical Firewall Policy、タグ改ざん防止＝Secure Tags / Service Account Filtering、L7 エッジ防御＝Cloud Armor、遅延ゼロ全ペイロード検知＝Cloud IDS。",
  },
  {
    id: "pcne-comp-ops-routing",
    category: "運用・移行・コスト",
    title: "Network Intelligence Center 監視・診断 & ルーティング制御比較",
    subtitle: "障害切り分け・経路可視化・ルーティング制御・GKE Alias IP 最適化",
    columns: ["ツール / 機能", "主な機能・取得情報", "実パケット影響 / 評価順", "最適トラブルシュート / 設計用途"],
    rows: [
      {
        feature: "Connectivity Tests",
        values: ["設定ベースの静的＆ライブ到達性トレース", "実パケット送出なしで遮断 Firewall / ルート欠如を特定", "VM 間・ハイブリッド間の『通信できない』原因の即時切り分け"],
      },
      {
        feature: "Performance Dashboard",
        values: ["プロジェクト＆Google全体の RTT・パケロス率", "リージョン間・オンプレ間のネットワーク品質を可視化", "遅延増加がアプリ問題か Google 基盤/回線問題かの切り分け"],
      },
      {
        feature: "Network Topology",
        values: ["VPC・GKE・LB・ハイブリッドの動的可視化", "リージョン/拠点間のトラフィック量と異常メトリクスを俯瞰", "全体通信フローとボトルネック箇所の視覚的把握"],
      },
      {
        feature: "VPC Flow Logs & Firewall Insights",
        values: ["L3/L4 フロー記録 & ルールヒット分析", "サンプリング・集約間隔調整でコスト抑制 / 未使用・重複ルール特定", "通信傾向監査・トラフィック課金分析・FW ルールの棚卸し"],
      },
      {
        feature: "Policy-Based Routing & Custom Static Routes",
        values: ["条件ベース強制転送 / タグ付き静的ルート", "PBR は標準 VPC ルートより先に評価・Multi-NIC VM (NVA) 誘導可", "特定送信元やプロトコルをセキュリティアプライアンス経由へ強制"],
      },
      {
        feature: "GKE VPC-Native (Alias IP)",
        values: ["Pod / Service へセカンダリ CIDR 割当", "既定 110 Pod/Node＝/24 消費・VPC ルート上限を圧迫しない", "大規模 GKE クラスタの IP 計画と VPC ネイティブ統合"],
      },
    ],
    decisionRule:
      "疎通不可の原因特定＝Connectivity Tests、パケロス/遅延切り分け＝Performance Dashboard、FW 棚卸し＝Firewall Insights、通信量分析＝VPC Flow Logs。",
  },
];

export const pcnePatterns: GcpArchitecturePattern[] = [
  {
    id: "pcne-pat-1",
    title: "エンタープライズ Shared VPC ＋ 99.99% SLA ハイブリッドハブ構成",
    badge: "Shared VPC + 4-Link Interconnect",
    flow: [
      "オンプレミス 2 拠点 (BGP / MED)",
      "Dedicated Interconnect ×4 (2 メトロ)",
      "Cloud Router (Global Dynamic Routing)",
      "Shared VPC Host Project",
      "Service Projects (GKE VPC-Native)",
    ],
    summary:
      "2 つの異なるメトロエリアにまたがる 4 本の Dedicated Interconnect と Global Dynamic Routing Mode を組み合わせ、Shared VPC 上の複数事業部プロジェクトへ 99.99% SLA の閉域基盤を一元提供する構成。",
    keyDesignPoints: [
      "Host Project で Firewall Insights・Hierarchical Firewall Policy・Custom Route Advertisement を集約管理",
      "99.99% SLA 要件を満たすため 2 メトロ × 両エッジ可用性ドメイン（計 4 VLAN Attachment）を配備",
    ],
  },
  {
    id: "pcne-pat-2",
    title: "グローバル Web アプリ向け L7 負荷分散・CDN・WAF 多層エッジ防御",
    badge: "Global LB + Cloud Armor + CDN",
    flow: [
      "ユーザー (Premium Tier Anycast)",
      "Global External Application LB + SSL Policy",
      "Cloud Armor (WAF / Adaptive Protection)",
      "Cloud CDN / Serverless NEG (Cloud Run)",
    ],
    summary:
      "Premium Tier の単一グローバル Anycast IP を入口に、TLS 1.2/1.3 強制・Cloud Armor による WAF/DDoS 防御・Cloud CDN によるエッジ配信を組み合わせた高可用・低遅延構成。",
    keyDesignPoints: [
      "SSL Policy（Modern/Restricted）で古い TLS プロトコルと脆弱な暗号スイートを遮断",
      "GKE バックエンドでは Zonal NEG（Container-native LB）により Pod へ直接負荷分散",
    ],
  },
  {
    id: "pcne-pat-3",
    title: "IP 重複許容の SaaS プライベート公開（Private Service Connect）",
    badge: "Private Service Connect",
    flow: [
      "コンシューマー VPC (顧客環境)",
      "PSC エンドポイント / PSC バックエンド",
      "Service Attachment (NAT 変換)",
      "プロデューサー Internal LB",
      "SaaS バックエンド (GKE / GCE)",
    ],
    summary:
      "VPC Network Peering の IP アドレス重複禁止・接続数上限（25）・非推移制約を回避し、顧客やパートナー VPC から安全かつ一方向で自社サービスへプライベート接続させる構成。",
    keyDesignPoints: [
      "プロデューサー側サブネット（NAT 用）で送信元 IP を変換するため顧客間・自社間の CIDR 重複を完全に許容",
      "IAM/Connection Preference で接続許可プロジェクトをホワイトリスト制御",
    ],
  },
  {
    id: "pcne-pat-4",
    title: "ハイブリッド DNS 統合解決 ＋ VPC-SC 対応閉域 Google API アクセス",
    badge: "Hybrid DNS & Private Google Access",
    flow: [
      "オンプレミス端末 / DNS",
      "Cloud DNS Inbound/Outbound Forwarding (35.199.192.0/19)",
      "Cloud Router (Custom Route Advertisement)",
      "restricted.googleapis.com (199.36.153.4/30)",
    ],
    summary:
      "オンプレミスと Google Cloud 間で相互にプライベートドメインを解決しつつ、外部 IP のない VM やオンプレから VPC Service Controls 対応の Google API へ閉域接続する構成。",
    keyDesignPoints: [
      "Outbound Forwarding の送信元 `35.199.192.0/19` と Private Google Access VIP（`199.36.153.4/30`）を Cloud Router で広報",
      "パブリック DNS ゾーンでは DNSSEC を有効化して名前解決の改ざん・ポイズニングを防止",
    ],
  },
  {
    id: "pcne-pat-5",
    title: "Policy-Based Routing ＋ Multi-NIC NVA インライン検査・暗号化構成",
    badge: "PBR + Multi-NIC NVA",
    flow: [
      "ワークロード VPC サブネット",
      "Policy-Based Routing (条件一致)",
      "Internal Passthrough Network LB (Next Hop)",
      "Multi-NIC VM (NVA 検査・--can-ip-forward)",
      "Cloud NAT / Interconnect 出口",
    ],
    summary:
      "規制要件でサードパーティ製仮想ファイアウォール（NVA）によるトラフィック検査が必須な環境で、Internal Passthrough Network LB と Policy-Based Routing により透過的に冗長検査する構成。",
    keyDesignPoints: [
      "NVA は各インターフェースを異なる VPC（Untrust / Trust 等）に接続し IP フォワーディングを有効化",
      "Envoy 系リージョン LB を使う別リージョン構成では Proxy-Only Subnet（推奨 `/23`）を事前確保",
    ],
  },
  {
    id: "pcne-pat-6",
    title: "パス外脅威検知（Cloud IDS）＋ Network Intelligence Center 運用基盤",
    badge: "Cloud IDS + NIC Observability",
    flow: [
      "本番 VPC サブネット通信",
      "Packet Mirroring (全ペイロード複製)",
      "Cloud IDS エンドポイント (L7 脅威検知)",
      "NIC (Connectivity Tests / Performance Dashboard / Topology)",
    ],
    summary:
      "本番トラフィックへ遅延を与えずに全ペイロードのマルウェア・C&C 通信を検知し、同時に Network Intelligence Center と VPC Flow Logs で運用監視と障害切り分けを自動化する構成。",
    keyDesignPoints: [
      "インライン遮断が必要な L7 IPS/TLS 検査には Cloud NGFW Enterprise、遅延ゼロの検知には Cloud IDS を選択",
      "Firewall Insights で未使用・シャドウ化ルールを定期削除し運用負債と誤設定リスクを低減",
    ],
  },
];

export const pcnePitfalls: GcpPitfall[] = [
  {
    id: "pcne-pit-1",
    trap: "「VPC Network Peering を A↔B と B↔C で結べば、A から C やオンプレミス（Interconnect）にも推移的に通信できる」と考える",
    whyWrong:
      "VPC Network Peering は厳密に非推移的（Non-transitive）です。A↔B と B↔C がピアリングされていても A↔C は通信できず、また B に接続されたオンプレミスへ A から到達するには Custom Route Export/Import 等の明示設計が必要です（そもそも C まで直列中継不可）。",
    correctApproach:
      "複数 VPC とオンプレミスを柔軟に相互接続する場合は Network Connectivity Center（NCC）のハブ＆スポーク構成、サービス公開のみなら Private Service Connect（PSC）を採用します。",
  },
  {
    id: "pcne-pit-2",
    trap: "「Dedicated Interconnect を 1 つのメトロ（1 施設）内に 2 本引けば 99.99% SLA が保証される」と思う",
    whyWrong:
      "単一メトロ内の異なる 2 つのエッジ可用性ドメインに 2 本構成した場合の SLA は **99.9%** です。メトロ全体の電源・回線・災害障害やメトロ単位の計画メンテナンスに耐える 99.99% SLA 基準を満たしません。",
    correctApproach:
      "99.99% SLA を満たすには、2 つの異なるメトロエリアそれぞれで両エッジ可用性ドメインにまたがる計 4 本の接続（VLAN Attachment 4 本）と VPC の Global Dynamic Routing Mode を構成します。",
  },
  {
    id: "pcne-pit-3",
    trap: "「Cloud DNS Outbound Forwarding を設定したのに、オンプレミス側ファイアウォールで Cloud Router やサブネット IP だけ許可して名前解決が失敗する」",
    whyWrong:
      "Cloud DNS がオンプレミス DNS サーバーへ転送クエリを送出する際、VM のサブネット IP ではなく Google 管理の特別なプロキシレンジ `35.199.192.0/19` が送信元 IP になります。",
    correctApproach:
      "オンプレミス側のファイアウォールで `35.199.192.0/19` からの UDP/TCP ポート 53 を許可し、かつ Cloud Router の Custom Route Advertisement（またはオンプレ側ルート）で `35.199.192.0/19` の戻り経路が Google Cloud へ向くよう構成します。",
  },
  {
    id: "pcne-pit-4",
    trap: "「Cloud NAT を構成すれば外部 IP を持つ VM の送信元 IP も NAT ゲートウェイ IP に統一でき、外部からのインバウンド通信も受けられる」と誤解する",
    whyWrong:
      "Cloud NAT は外部 IP を持たないプライベート VM（または GKE ノード）の**アウトバウンド専用** SNAT であり、外部 IP が付与された VM の通信には一切適用されず、外部からの非要求インバウンド接続も受け付けません。",
    correctApproach:
      "送信元 IP を Cloud NAT に統一したい VM からは外部 IP を外し、外部からのインバウンド受け口が必要な場合は Cloud Load Balancing を前面に配置します。",
  },
  {
    id: "pcne-pit-5",
    trap: "「Regional External / Internal Application LB を通常サブネットだけの VPC にそのまま作成できる」と思って構築が止まる",
    whyWrong:
      "Envoy ベースのリージョンまたはクロスリージョン Application LB（Regional External / Internal Application LB）は、バックエンド側サブネットとは別にプロキシ専用の `Proxy-Only Subnet`（推奨 `/23`、`purpose=REGIONAL_MANAGED_PROXY`）がないと作成できません。",
    correctApproach:
      "対象リージョンにリージョンあたり 1 つの Proxy-Only Subnet（推奨 `/23`）を事前作成し、実バックエンド用サブネットとは IP 範囲を分けて構成します。",
  },
  {
    id: "pcne-pit-6",
    trap: "「GKE VPC-Native クラスタで Pod 用セカンダリ範囲に狭い `/24` を割り当ててしまい、ノード追加時に IP 枯渇エラーが出る」",
    whyWrong:
      "GKE Standard でデフォルトの最大 Pod 数/ノード（110）のまま作成すると、各ノードへ `2 × 110 = 220` 以上の IP を満たす `/24`（256 IP）の Alias IP ブロックが 1 ブロックずつ予約されます。全体 Pod 範囲が `/24` だと **1 ノードしか起動できず** 2 ノード目で IP 枯渇します。",
    correctApproach:
      "『最大想定ノード数 × ノードあたり Alias IP ブロックサイズ』でセカンダリ Pod 範囲（例：`/16` や `/17` 等）を計算するか、ノードあたり最大 Pod 数（`--max-pods-per-node`）を 32 や 64 へ引き下げて `/26` や `/25` 単位へ最適化します。",
  },
];

export const pcneKeyFacts: GcpKeyFact[] = [
  { id: "pcne-kf-1", target: "Cloud DNS Outbound 送信元", value: "35.199.192.0/19", detail: "オンプレ FW の UDP/TCP 53 許可と戻りルート広報が必須" },
  { id: "pcne-kf-2", target: "Private Google Access VIP", value: "199.36.153.8/30 / .4/30", detail: "private (.8/30) と VPC-SC 対応の restricted (.4/30)" },
  { id: "pcne-kf-3", target: "Partner Interconnect ASN", value: "16550 (必須)", detail: "Dedicated Interconnect / HA VPN は任意のプライベート ASN を使用" },
  { id: "pcne-kf-4", target: "Dedicated Interconnect SLA", value: "99.99% = 2メトロ×4接続", detail: "単一メトロ・2エッジ可用性ドメイン構成は 99.9% SLA" },
  { id: "pcne-kf-5", target: "HA VPN 帯域・SLA", value: "最大 3Gbps/トンネル・99.99%", detail: "2 インターフェース構成時。暗号化 VLAN 接続時は MTU 1440B" },
  { id: "pcne-kf-6", target: "VPC Network Peering 上限", value: "25 ピアリング / VPC (既定)", detail: "非推移的（Non-transitive）かつサブネット CIDR 重複不可" },
  { id: "pcne-kf-7", target: "Proxy-Only Subnet 推奨サイズ", value: "/23 (512 IP) / リージョン", detail: "Envoy ベースの Regional / Internal Application LB で必須" },
  { id: "pcne-kf-8", target: "GKE Alias IP (110 Pod/Node)", value: "/24 (256 IP) / Node", detail: "2 × max_pods の空き確保規則により既定 110 Pod で /24 消費" },
  { id: "pcne-kf-9", target: "Cloud NAT 最小ポート数", value: "64 ポート / VM (既定)", detail: "動的・静的ポート割り当て選択可。外部 IP 付き VM には非適用" },
  { id: "pcne-kf-10", target: "VPC & VLAN Attachment MTU", value: "1460B / 1500B / 8896B", detail: "VLAN 既定 1440B。ジャンボ 8896B は経路上すべて一致が必要" },
  { id: "pcne-kf-11", target: "Firewall 評価優先順", value: "Hierarchical → Network → VPC", detail: "Hierarchical で goto_next 指定時のみ下位ルール評価へ委譲" },
  { id: "pcne-kf-12", target: "Network Intelligence Center", value: "パケットレス到達検証", detail: "Connectivity Tests で構成ベース遮断特定、Performance Dashboard で RTT 計測" },
];

export const pcneQuickLookup: CertFlashcardItem[] = [
  { keyword: "同一組織内でネットワーク管理（Host）とアプリ開発（Service）のプロジェクト権限を分離する VPC 構成", category: "VPC 設計", recommended: "Shared VPC（共有 VPC）", reason: "Firewall・サブネット・ハイブリッド接続を中央チームが統制し、各チームへサブネット利用権限のみを付与できます。" },
  { keyword: "IP アドレス重複を許容し、ピアリング数上限や非推移制約を受けずに自社サービスを他 VPC へ公開", category: "接続・公開", recommended: "Private Service Connect (PSC)", reason: "プロデューサーとコンシューマー間で NAT 変換を行うため CIDR 重複を許容し、一方向の閉域アクセスを提供できます。" },
  { keyword: "複数の VPC やオンプレミス拠点（Interconnect / HA VPN）をハブ＆スポークで統合ルーティング", category: "ハイブリッド", recommended: "Network Connectivity Center (NCC)", reason: "VPC スポークとハイブリッドスポークを中央ハブで接続し、VPC ピアリングの非推移制約を解消します。" },
  { keyword: "GKE Pod が VPC サブネットのセカンダリ IP 範囲を直接使い VPC ルート上限消費を抑える方式", category: "GKE ネットワーキング", recommended: "GKE VPC-Native クラスタ (Alias IP)", reason: "Pod と Service に Alias IP を割り当て、VPC ネイティブにルーティング・NAT・オンプレ接続と統合できます。" },
  { keyword: "グローバル Anycast IP・Google バックボーン経由と ISP 経由リージョン IP を切り替えるティア設定", category: "アーキテクチャ", recommended: "Network Service Tiers (Premium / Standard)", reason: "Global External LB や Cloud CDN フル活用・低遅延は Premium、インターネット経由で通信費削減は Standard を選びます。" },
  { keyword: "東京リージョンの Cloud Router で学習したオンプレルートを大阪リージョンの VM からも使う VPC 設定", category: "ルーティング", recommended: "Global Dynamic Routing Mode", reason: "Dynamic Routing Mode を Regional から Global へ変更すると全リージョンでサブネット広報と学習ルート共有が有効になります。" },
  { keyword: "VM の編集権限を持つ開発者が勝手にファイアウォール用タグを付け替えられないよう IAM で統制", category: "セキュリティ", recommended: "Secure Tags（または Service Account Filtering）", reason: "Secure Tags は Resource Manager IAM で付与権限を制限でき、Network Tags のすり抜けリスクを防ぎます。" },
  { keyword: "組織・フォルダ単位で全配下 VPC に優先強制し、必要に応じて下位ルールへ評価を委譲する仕組み", category: "セキュリティ", recommended: "Hierarchical Firewall Policy", reason: "組織ルートやフォルダに紐付け、`goto_next` アクションでプロジェクト側の評価へ引き継げます。" },
  { keyword: "Regional External / Internal Application LB をデプロイする前にリージョンへ用意すべき専用サブネット", category: "ロードバランシング", recommended: "Proxy-Only Subnet（推奨 /23）", reason: "Envoy ベースのプロキシ型ロードバランサの内部プロキシ群が使用する専用 IP プールです。" },
  { keyword: "オンラインゲームの UDP 通信など、プロキシせず送信元クライアント IP を保持して超低遅延負荷分散", category: "ロードバランシング", recommended: "External Passthrough Network LB (L4)", reason: "プロキシを介さずパケットを直接転送するため送信元 IP が維持され、UDP/TCP 非 HTTP に最適です。" },
  { keyword: "NVA（仮想ファイアウォール）冗長化のネクストホップとして使えるリージョン内部ロードバランサ", category: "ロードバランシング", recommended: "Internal Passthrough Network LB (L4)", reason: "カスタム静的ルートや Policy-Based Routing のネクストホップターゲットとして指定できます。" },
  { keyword: "GKE コンテナ Pod の IP:ポートへ kube-proxy を介さずロードバランサから直接トラフィックを届ける", category: "GKE ネットワーキング", recommended: "Zonal NEG (Container-native Load Balancing)", reason: "ノード間ホップを削減し、レイテンシ低下と精密なヘルスチェックを実現します。" },
  { keyword: "VPC からオンプレミス DNS へ Outbound Forwarding する際にオンプレ側 FW で許可すべき送信元レンジ", category: "Cloud DNS", recommended: "35.199.192.0/19", reason: "Cloud DNS のアウトバウンド転送プロキシが使用する予約 IP レンジであり、UDP/TCP 53 許可と戻りルートが必須です。" },
  { keyword: "VPC Service Controls 境界内で、非対応 API を遮断しつつ Google APIs へ閉域接続する VIP", category: "閉域アクセス", recommended: "restricted.googleapis.com (199.36.153.4/30)", reason: "Private Google Access で VPC-SC 対応サービスのみへ接続を限定し、境界外へのデータ持ち出しを防ぎます。" },
  { keyword: "コロケーション施設に自社ラックを持たず 50Mbps〜50Gbps の専用線接続を構築するサービス", category: "ハイブリッド", recommended: "Partner Interconnect", reason: "認定サービスプロバイダ網を経由して Google Cloud へ接続します（Cloud Router ASN は 16550 が必須）。" },
  { keyword: "Dedicated Interconnect で本番 99.99% SLA を満たすために必要な最小物理構成", category: "ハイブリッド", recommended: "2 つの異なるメトロ × 各 2 エッジ可用性ドメイン（計 4 接続）", reason: "単一メトロ 2 接続では 99.9% SLA 止まりであり、メトロ障害・計画保守耐性のために 2 メトロ 4 接続＋Global Routing が必要です。" },
  { keyword: "2 つの BGP ルート経路の優先度を調整し Active/Passive や ECMP を制御する BGP 属性", category: "ハイブリッド", recommended: "BGP MED (Multi-Exit Discriminator)", reason: "Cloud Router の広報プレフィックス優先度（低い値ほど優先）や同一コストでの ECMP 分散を制御します。" },
  { keyword: "Dedicated Interconnect 上の通信を追加で IPsec 暗号化する際の必須 MTU 設定", category: "ハイブリッド", recommended: "1440 bytes (HA VPN over Cloud Interconnect)", reason: "IPsec カプセル化のオーバーヘッドを考慮し、VLAN Attachment と VPC の MTU を 1440 bytes に統一します。" },
  { keyword: "外部 IP を持たない VM がインターネット上の外部 API へ接続するためのマネージド SNAT", category: "アウトバウンド", recommended: "Cloud NAT", reason: "外部からの非要求インバウンドを受けずに安全なアウトバウンド接続を提供し、静的外部 IP 固定も可能です。" },
  { keyword: "外部アプリケーション LB のエッジで ML により L7 DDoS 異常を検知し WAF ルールを提案する機能", category: "エッジ防御", recommended: "Cloud Armor Adaptive Protection", reason: "ベースライン学習により未知の HTTP フラッド攻撃を特定し、緩和ルール案を提示します。" },
  { keyword: "本番トラフィックの遅延を増やさずパス外（Packet Mirroring）で L7 マルウェア・C&C 通信を検知", category: "セキュリティ監視", recommended: "Cloud IDS", reason: "Packet Mirroring で複製した全ペイロードを解析してアラート化します（インライン遮断は Cloud NGFW Enterprise）。" },
  { keyword: "実パケットを送らずに VM 間やオンプレ間の通信がどの FW ルール・ルートで遮断されるか特定", category: "トラブルシュート", recommended: "Network Intelligence Center — Connectivity Tests", reason: "VPC ルート、ファイアウォール、NAT、VPN/Interconnect の設定をトレースし到達可否を即時可視化します。" },
  { keyword: "リージョン間・オンプレ間のレイテンシ（RTT）やパケットロスが Google 基盤側か自社環境か切り分ける", category: "トラブルシュート", recommended: "Network Intelligence Center — Performance Dashboard", reason: "自プロジェクトの計測値と Google Cloud 全体の品質ベースラインを比較して原因を切り分けます。" },
  { keyword: "未使用・重複・シャドウ化された VPC ファイアウォールルールを検出してルールを最適化する機能", category: "運用最適化", recommended: "Firewall Insights", reason: "ルールごとのヒット実績や優先順位の重なりを分析し、不要ルールの削除や設定改善を提案します。" },
];

export const pcnePracticeQuestions: CertQuestion[] = [
  {
    id: "pcne-q1",
    domainId: "pcne-domain-1",
    domainLabel: "01: ネットワーク設計・計画",
    difficulty: "基礎",
    selectCount: 1,
    question: "多拠点から利用される Web アプリケーションを Google Cloud にデプロイします。単一のグローバル Anycast IP アドレスを使用し、ユーザーの最寄りエッジ拠点から Google のプライベートバックボーン経由でバックエンドへルーティングすることで低遅延と高い可用性を確保したい場合、選択すべき Network Service Tier とロードバランサの組み合わせはどれですか？",
    options: [
      "Premium Tier ＋ グローバル外部アプリケーション ロードバランサ（Global External Application LB）",
      "Standard Tier ＋ グローバル外部アプリケーション ロードバランサ",
      "Standard Tier ＋ リージョン外部パススルー ネットワーク ロードバランサ",
      "Premium Tier ＋ 内部パススルー ネットワーク ロードバランサ",
    ],
    correctIndices: [0],
    explanation: "グローバル Anycast IP および Google のグローバルバックボーン経由のルーティングを提供する Global External Application LB は Premium Tier でのみ利用可能です。Standard Tier ではトラフィックが一般インターネット（ISP）を経由し、リージョナル外部 IP のみサポートされます。",
    keywords: ["Network Service Tiers", "Premium Tier", "Global External Application LB"],
  },
  {
    id: "pcne-q2",
    domainId: "pcne-domain-1",
    domainLabel: "01: ネットワーク設計・計画",
    difficulty: "標準",
    selectCount: 1,
    question: "大規模企業において、ネットワーク専門チームが VPC・サブネット・ファイアウォール・Cloud Interconnect を一括管理し、15 個のアプリケーション開発プロジェクト（同一組織配下）には、指定されたサブネット上にのみ Compute Engine や GKE を作成させたいと考えています。将来の拡張性も考慮した最適なネットワーク構成はどれですか？",
    options: [
      "ホストプロジェクトとサービスプロジェクトを分離した Shared VPC を構築し、各開発チームへサブネット単位で `roles/compute.networkUser` を付与する",
      "15 個のプロジェクトごとに個別 VPC を作成し、VPC Network Peering でフルメッシュ接続する",
      "すべての開発プロジェクトで単一のプロジェクトを共有し、全開発者にプロジェクト編集者（Editor）を付与する",
      "全サブネットを自動モード（Auto Mode）VPC として作成する",
    ],
    correctIndices: [0],
    explanation: "同一組織内でネットワーク管理とアプリ開発の責務を明確に分離し、ファイアウォールや Interconnect を共有するエンタープライズ標準構成は Shared VPC です。フルメッシュの VPC Network Peering は管理が煩雑になり、ピアリング上限（既定 25）にも近づきやすくなります。",
    keywords: ["Shared VPC", "責務分離", "IAM"],
  },
  {
    id: "pcne-q3",
    domainId: "pcne-domain-1",
    domainLabel: "01: ネットワーク設計・計画",
    difficulty: "標準",
    selectCount: 1,
    question: "自社が運用する分析プラットフォームを、多数の顧客企業の Google Cloud VPC へプライベート公開する予定です。一部の顧客 VPC とは CIDR 範囲（`10.0.0.0/16` 等）が重複しており、また顧客数は将来的に 50 社以上に増える見込みです。顧客側に CIDR 変更を求めず、スケーラブルに閉域接続を提供する最適な機能はどれですか？",
    options: [
      "VPC Network Peering",
      "Private Service Connect（PSC）",
      "すべての VM にパブリック IP を付与したインターネット公開",
      "Private Services Access（PSA）を全顧客と共有する",
    ],
    correctIndices: [1],
    explanation: "Private Service Connect（PSC）はプロデューサー側の NAT サブネットによって通信元 IP を変換するため、コンシューマー VPC との IP 重複を完全に許容します。また VPC Network Peering の接続上限（既定 25）や非推移制約を受けずに多数の顧客へ公開可能です。",
    keywords: ["Private Service Connect", "IP 重複許容", "SaaS 公開"],
  },
  {
    id: "pcne-q4",
    domainId: "pcne-domain-1",
    domainLabel: "01: ネットワーク設計・計画",
    difficulty: "応用",
    selectCount: 2,
    question: "最大 100 ノードまでスケールする GKE Standard の VPC-Native クラスタ（デフォルト設定：ノードあたり最大 110 Pod）を設計しています。また、同一 VPC 内の Cloud Run サービスからも Private Service Access 経由の Cloud SQL へプライベート接続する必要があります。設計上の正しい判断を 2 つ選択してください。",
    options: [
      "デフォルトの最大 110 Pod/ノードでは 1 ノードあたり `/24`（256 IP）の Alias IP ブロックが予約されるため、100 ノードを収容するには Pod 用セカンダリ CIDR に少なくとも `/17`（32,768 IP）以上（100 × 256 = 25,600 IP）を確保する",
      "Cloud Run から VPC 内の Cloud SQL プライベート IP へ到達するため、Serverless VPC Access コネクタ（または Direct VPC Egress）を構成する",
      "Pod 用セカンダリ範囲に `/24` を 1 つ割り当てれば、100 ノードすべてで各 110 Pod を起動できる",
      "GKE VPC-Native クラスタは Alias IP を使わず従来の静的 VPC ルートを Pod ごとに消費する",
    ],
    correctIndices: [0, 1],
    explanation: "GKE VPC-Native クラスタでは `2 × max_pods` 以上の IP 空間をノードごとに確保するため、110 Pod/ノードでは各ノードに `/24`（256 IP）が割り当てられます（100 ノードなら 25,600 IP 以上＝`/17` 以上が必要）。また Cloud Run から VPC 内プライベート IP（PSA 接続の Cloud SQL 等）へ通信するには Serverless VPC Access または Direct VPC Egress が必要です。",
    keywords: ["GKE VPC-Native", "Alias IP", "Serverless VPC Access"],
  },
  {
    id: "pcne-q5",
    domainId: "pcne-domain-2",
    domainLabel: "02: VPC の実装",
    difficulty: "基礎",
    selectCount: 1,
    question: "東京リージョン（`asia-northeast1`）のサブネット `10.10.1.0/24` に配置された Compute Engine VM に割り当て可能な IP アドレスが不足してきたため、同一サブネットの IP 範囲を `/24` から `/23` へ拡大したいと考えています。既存 VM への影響を避けた最も適切な手順はどれですか？",
    options: [
      "Custom Mode VPC の対象サブネットに対して `gcloud compute networks subnets expand-ip-range` を実行し、インプレースでプレフィックスを `/23` へ拡張する",
      "既存サブネットを一度削除してから `/23` で作り直す",
      "まず VPC の動的ルーティングモードを Global に変更する",
      "サブネットは拡張できないため必ず新規 VPC を作成する",
    ],
    correctIndices: [0],
    explanation: "Google Cloud の VPC サブネットは、既存の稼働中 VM を停止・再作成することなくインプレースで IP 範囲を拡張（プレフィックス長を小さくする、例：`/24` → `/23`）できます。ただし一度拡張したサブネット範囲を後から縮小することはできません。",
    keywords: ["Custom Mode VPC", "サブネット拡張", "CIDR"],
  },
  {
    id: "pcne-q6",
    domainId: "pcne-domain-2",
    domainLabel: "02: VPC の実装",
    difficulty: "標準",
    selectCount: 1,
    question: "東京リージョンと大阪リージョンの両方にサブネットを持つ Custom Mode VPC があります。Dedicated Interconnect と Cloud Router を東京リージョンにのみ構築したところ、東京の VM からはオンプレミスと通信できましたが、大阪リージョンの VM からはオンプレミスのサブネットへ到達できませんでした。原因と対処法として最も適切なものはどれですか？",
    options: [
      "VPC の Dynamic Routing Mode がデフォルトの `Regional` になっているため、大阪リージョンへオンプレの動的ルートが伝播されず、大阪サブネットも広報されていない。Dynamic Routing Mode を `Global` へ変更する",
      "大阪リージョンに Cloud NAT を追加作成する",
      "大阪のサブネットにセカンダリ Alias IP を追加する",
      "VPC の MTU を 8896 バイトに変更する",
    ],
    correctIndices: [0],
    explanation: "Dynamic Routing Mode が `Regional` の場合、Cloud Router は同一リージョン（東京）内のサブネットしか広報せず、学習したオンプレルートも同リージョン内でのみ有効になります。`Global` へ変更することで VPC 内全リージョンへルート広報と学習ルート伝播が行われます。",
    keywords: ["Dynamic Routing Mode", "Global Routing", "Cloud Router"],
  },
  {
    id: "pcne-q7",
    domainId: "pcne-domain-2",
    domainLabel: "02: VPC の実装",
    difficulty: "標準",
    selectCount: 1,
    question: "外部 IP アドレスを持たないプライベートサブネット上の Compute Engine VM 群から、外部の決済パートナー API へ HTTPS 通信を行う必要があります。パートナー側では送信元 IP ホワイトリスト登録が必須なため、固定の外部 IP アドレスから通信させつつ、外部から VM への非要求インバウンド接続は遮断したいです。最適な実装はどれですか？",
    options: [
      "Cloud NAT を対象リージョン・サブネットに構成し、NAT IP 割り当て方式を手動（静的予約済み外部 IP アドレスを指定）に設定する",
      "すべての VM に予約済み静的外部 IP を直接アタッチする",
      "対象サブネットで Private Google Access のみを有効化する",
      "VPC ネットワークのデフォルトインターネットルートを削除する",
    ],
    correctIndices: [0],
    explanation: "Cloud NAT を使うと外部 IP を持たない VM からアウトバウンド通信のみ許可でき、NAT 用に静的外部 IP を手動割り当てすることでパートナー側へ申告する送信元 IP を固定できます。Private Google Access は Google APIs 向けであり外部パートナー API へは通信できません。",
    keywords: ["Cloud NAT", "静的外部 IP", "アウトバウンド SNAT"],
  },
  {
    id: "pcne-q8",
    domainId: "pcne-domain-2",
    domainLabel: "02: VPC の実装",
    difficulty: "応用",
    selectCount: 2,
    question: "セキュリティ監査チームから、マルチプロジェクト環境における VPC ファイアウォール統制について「1) 組織・フォルダレベルで悪意ある外部 IP レンジを全プロジェクト横断で最優先ブロックし、それ以外の判断はプロジェクト側へ委譲したい」「2) VM 作成権限を持つ開発者がタグを自由に書き換えて DB アクセス許可ルールをすり抜けるリスクを排除したい」という要件が出ました。適切な実装を 2 つ選択してください。",
    options: [
      "Hierarchical Firewall Policy を組織・フォルダに適用して拒否ルールを最上位に配置し、配下へ委譲したいトラフィックに `goto_next` アクションを設定する",
      "従来の Network Tags ではなく、Resource Manager の IAM で付与権限を厳格に統制できる Secure Tags（または Service Account Filtering）をファイアウォールターゲットに使う",
      "すべての開発者プロジェクトに個別の VPC ファイアウォールルールを手動コピーし、Network Tags を利用する",
      "VPC Flow Logs を有効化するだけで通信のインライン遮断を行う",
    ],
    correctIndices: [0, 1],
    explanation: "Hierarchical Firewall Policy は組織・フォルダ単位で全配下 VPC に最優先適用でき、`goto_next` により下位の Network / VPC ルールへ評価を引き継げます。また従来の Network Tags は VM 編集権限があれば誰でも変更可能ですが、Secure Tags（IAM 統制）や Service Account Filtering を使うとすり抜けを防止できます。",
    keywords: ["Hierarchical Firewall Policy", "Secure Tags", "Service Account Filtering"],
  },
  {
    id: "pcne-q9",
    domainId: "pcne-domain-3",
    domainLabel: "03: ネットワークサービス構成",
    difficulty: "基礎",
    selectCount: 1,
    question: "単一の VPC 内に、異なる 2 つのマイクロサービス（A と B）が稼働しています。今回、通信パス上の URL パス（`/api/v1/*` と `/api/v2/*`）に応じた L7 ルーティングを VPC 内のみで行うため、東京リージョン（`asia-northeast1`）に Regional Internal Application Load Balancer を新規構築しようとしています。通常の VM 用サブネット以外に同リージョンへ必ず用意すべきものはどれですか？",
    options: [
      "Proxy-Only Subnet（`purpose=REGIONAL_MANAGED_PROXY`、推奨 `/23`）",
      "GKE Autopilot 専用クラスタ",
      "Cloud CDN の Backend Bucket",
      "Dedicated Interconnect の VLAN Attachment",
    ],
    correctIndices: [0],
    explanation: "Envoy ベースのプロキシ型ロードバランサ（Regional External / Internal Application LB、Cross-Region Internal Application LB）を展開するリージョンには、Envoy プロキシが使用する専用の Proxy-Only Subnet（推奨 `/23`）の事前作成が必須です。",
    keywords: ["Proxy-Only Subnet", "Envoy", "Regional Application LB"],
  },
  {
    id: "pcne-q10",
    domainId: "pcne-domain-3",
    domainLabel: "03: ネットワークサービス構成",
    difficulty: "標準",
    selectCount: 1,
    question: "オンライン対戦ゲームの UDP 通信（ポート 27015）を東京リージョンの Compute Engine マネージドインスタンスグループ（MIG）へ負荷分散します。ゲームサーバー側でクライアントの送信元 IP アドレスをそのまま取得し、かつプロキシ処理によるオーバーヘッドを避けて超低レイテンシを実現したい場合、最適なロードバランサはどれですか？",
    options: [
      "外部パススルー ネットワーク ロードバランサ（External Passthrough Network LB）",
      "グローバル外部アプリケーション ロードバランサ（Global External Application LB）",
      "グローバル外部プロキシ ネットワーク ロードバランサ（External Proxy Network LB）",
      "Cloud CDN",
    ],
    correctIndices: [0],
    explanation: "外部パススルー ネットワーク ロードバランサ（リージョナル L4）はプロキシを介さず UDP/TCP トラフィックを直接バックエンド VM へ転送するため、クライアントの送信元 IP アドレスが保持され、超低レイテンシの UDP ゲーム通信に適しています。",
    keywords: ["External Passthrough Network LB", "UDP", "送信元 IP 保持"],
  },
  {
    id: "pcne-q11",
    domainId: "pcne-domain-3",
    domainLabel: "03: ネットワークサービス構成",
    difficulty: "標準",
    selectCount: 1,
    question: "グローバル外部アプリケーション ロードバランサで公開中の EC サイトに対して、SQL インジェクション等の OWASP Top 10 攻撃やボットによる突発的な L7 HTTP フラッド（DDoS）攻撃への対策を強化したいと考えています。さらに、通常のアクセス急増と攻撃の違いを機械学習で検知して緩和ルールの提案まで受けたい場合、構成すべき機能はどれですか？",
    options: [
      "Cloud Armor セキュリティポリシー（事前定義 WAF ルール・レート制限）および Adaptive Protection を有効化する",
      "Cloud NAT の動的ポート割り当てを有効化する",
      "Cloud DNS に DNSSEC を設定する",
      "VPC Flow Logs のサンプリングレートを 100% に引き上げる",
    ],
    correctIndices: [0],
    explanation: "Cloud Armor は外部アプリケーション LB のエッジで OWASP WAF ルールとレート制限を提供し、Adaptive Protection を有効化すると ML モデルが L7 DDoS の異常トラフィックを検知して具体的な緩和 WAF ルールを自動提案します。",
    keywords: ["Cloud Armor", "Adaptive Protection", "WAF"],
  },
  {
    id: "pcne-q12",
    domainId: "pcne-domain-3",
    domainLabel: "03: ネットワークサービス構成",
    difficulty: "応用",
    selectCount: 1,
    question: "Google Cloud の VPC から、Cloud VPN 経由でオンプレミスデータセンターの社内 DNS サーバー（`172.16.10.53`）へ `corp.local` ドメインの名前解決を転送するため、Cloud DNS の Outbound Forwarding ゾーンを設定しました。しかし VM から名前解決がタイムアウトします。オンプレミス側のネットワーク／ファイアウォール管理者に確認・設定依頼すべき最も重要なポイントはどれですか？",
    options: [
      "オンプレミスのファイアウォールで `35.199.192.0/19` からの UDP/TCP ポート 53 通信を許可し、かつ `35.199.192.0/19` 宛ての戻りルートが Cloud VPN 経由で Google Cloud へ向いているか確認する",
      "オンプレミスのファイアウォールで VPC のプライマリサブネット CIDR のみを UDP 53 で許可する",
      "オンプレミス DNS サーバーへ `169.254.169.254` 宛てのルートを設定する",
      "パブリック DNS ゾーンで DNSSEC を無効化する",
    ],
    correctIndices: [0],
    explanation: "Cloud DNS Outbound Forwarding の転送元 IP は VM のサブネット IP ではなく Google 予約の `35.199.192.0/19` です。オンプレミス側ファイアウォールでこのレンジからの TCP/UDP 53 を許可し、かつ Cloud Router の Custom Route Advertisement やオンプレ静的ルートで `35.199.192.0/19` の戻り経路を確保する必要があります。",
    keywords: ["Cloud DNS Forwarding", "35.199.192.0/19", "ハイブリッド DNS"],
  },
  {
    id: "pcne-q13",
    domainId: "pcne-domain-4",
    domainLabel: "04: ハイブリッド相互接続",
    difficulty: "基礎",
    selectCount: 1,
    question: "オンプレミスデータセンターと Google Cloud を専用線でプライベート接続したいと考えています。必要帯域は 2Gbps であり、自社は Google 指定のコロケーション施設（PoP）にラックを保有していません。認定通信事業者の回線網を経由して専用線接続を構築する際、選択すべきサービスと Cloud Router に設定する必須 BGP ASN はどれですか？",
    options: [
      "Partner Interconnect を選択し、Cloud Router の BGP ASN として `16550` を設定する",
      "Dedicated Interconnect を選択し、Cloud Router の BGP ASN として `65001` を設定する",
      "HA VPN を選択し、Cloud Router の BGP ASN として `16550` を設定する",
      "Classic VPN を選択し、静的ルーティングのみで構成する",
    ],
    correctIndices: [0],
    explanation: "自社がコロケーション施設にラックを持たず 50Mbps〜50Gbps 帯域で接続する場合は Partner Interconnect を選択します。Partner Interconnect 用 Cloud Router の Google 側ローカル BGP ASN には必ず `16550` を指定する必要があります。",
    keywords: ["Partner Interconnect", "Cloud Router", "ASN 16550"],
  },
  {
    id: "pcne-q14",
    domainId: "pcne-domain-4",
    domainLabel: "04: ハイブリッド相互接続",
    difficulty: "標準",
    selectCount: 1,
    question: "2 つの Dedicated Interconnect 接続（Primary と Secondary）を同一メトロ・同一リージョン内に構成し、通常時はすべてのトラフィックを Primary 側だけで処理し、Primary 障害時のみ Secondary 側へ自動フェイルオーバー（Active/Passive）させたいと考えています。Cloud Router およびオンプレミスルータの BGP 構成として適切な方法はどれですか？",
    options: [
      "Cloud Router の広報ルートに対して、Primary 側の BGP セッションへ低い MED（Multi-Exit Discriminator）値（例：100）、Secondary 側へ高い MED 値（例：1000）を設定する",
      "両方の BGP セッションへ完全に同一の MED 値（例：100）を設定する",
      "Cloud Router の BGP セッションを停止し、Secondary 側には手動で静的ルートのみ設定する",
      "Dedicated Interconnect の代わりに Cloud CDN を接続する",
    ],
    correctIndices: [0],
    explanation: "BGP の MED（Multi-Exit Discriminator）は値が**小さい**ほど優先度が高くなります。Primary に低い MED、Secondary に高い MED を設定することで Active/Passive 構成になり、同一 MED を設定すると ECMP（Active/Active 負荷分散）になります。",
    keywords: ["BGP MED", "Active/Passive", "Cloud Router"],
  },
  {
    id: "pcne-q15",
    domainId: "pcne-domain-4",
    domainLabel: "04: ハイブリッド相互接続",
    difficulty: "応用",
    selectCount: 2,
    question: "ミッションクリティカルな基幹系システム向けに Dedicated Interconnect で **99.99% の可用性 SLA** を満たしつつ、オンプレミス拠点から VPC Service Controls 保護下の Google APIs（`restricted.googleapis.com`: `199.36.153.4/30`）および Private Services Access 接続された Cloud SQL プライベート IP へ専用線経由でアクセスさせたいです。必須の設計要件を 2 つ選択してください。",
    options: [
      "2 つの異なるメトロエリア（都市圏）それぞれで 2 つのエッジ可用性ドメインにまたがる計 4 本の Dedicated Interconnect（4 本の VLAN Attachment）を構築し、VPC の Dynamic Routing Mode を Global に設定する",
      "Cloud Router で Custom Route Advertisement（カスタムルート広報）を有効化し、`199.36.153.4/30` および Cloud SQL に割り当てた Private Services Access CIDR をオンプレミスへ広報する",
      "単一メトロ・単一コロケーション施設内に Dedicated Interconnect を 2 本だけ接続し、Dynamic Routing Mode は Regional のままにする",
      "Cloud Router のデフォルト広報設定のみで自動的に `199.36.153.4/30` と他社ピアリング VPC 範囲が広報されるため追加設定は不要",
    ],
    correctIndices: [0, 1],
    explanation: "Dedicated Interconnect の 99.99% SLA には 2 メトロ × 両エッジ可用性ドメインの 4 接続トポロジと VPC Global Dynamic Routing Mode が必要です。また Cloud Router はデフォルトでは VPC サブネットしか広報しないため、`restricted.googleapis.com`（`199.36.153.4/30`）や PSA 範囲をオンプレへ届けるには Custom Route Advertisement が必須です。",
    keywords: ["99.99% SLA Topology", "Custom Route Advertisement", "Dedicated Interconnect"],
  },
  {
    id: "pcne-q16",
    domainId: "pcne-domain-4",
    domainLabel: "04: ハイブリッド相互接続",
    difficulty: "応用",
    selectCount: 1,
    question: "コンプライアンス要件により、Dedicated Interconnect 上を流れるすべての通信を L3 レベルの IPsec で暗号化するため「HA VPN over Cloud Interconnect（暗号化された VLAN アタッチメント）」を導入することになりました。パケットの断片化や MTU 不整合による通信不具合を防ぐため、VLAN Attachment および VPC ネットワークの MTU として設定すべき正しい値はどれですか？",
    options: [
      "1440 bytes",
      "8896 bytes（ジャンボフレーム）",
      "1500 bytes",
      "9000 bytes",
    ],
    correctIndices: [0],
    explanation: "HA VPN over Cloud Interconnect（暗号化された VLAN Attachment）では、IPsec ヘッダの暗号化カプセル化オーバーヘッドを確保するため、VLAN Attachment と関連 VPC の MTU を 1440 bytes に設定することが公式仕様で求められます。",
    keywords: ["HA VPN", "VLAN Attachment", "MTU 1440"],
  },
  {
    id: "pcne-q17",
    domainId: "pcne-domain-5",
    domainLabel: "05: 運用・監視・最適化",
    difficulty: "基礎",
    selectCount: 1,
    question: "「VPC 内のサブネット A からサブネット B の特定 TCP ポートへの通信が突然つながらなくなった」という問い合わせを受けました。実際にテスト用パケットを送信したり VM にログインしたりすることなく、VPC ルート・ファイアウォールルール・ピアリング・NAT 等の構成情報を静的・動的にトレースして遮断理由を即座に特定できるツールはどれですか？",
    options: [
      "Network Intelligence Center の Connectivity Tests",
      "VPC Flow Logs のサンプリング設定変更",
      "Cloud Armor の Adaptive Protection",
      "Cloud DNS の DNSSEC 検証",
    ],
    correctIndices: [0],
    explanation: "Connectivity Tests は送信元と宛先を指定するだけで、実際のデータパケットに影響を与えずに経路上のルート、ファイアウォールルール、ロードバランサ、VPN/Interconnect 等の構成をトレースし、どこで許可/ドロップされるかを診断できます。",
    keywords: ["Network Intelligence Center", "Connectivity Tests", "障害切り分け"],
  },
  {
    id: "pcne-q18",
    domainId: "pcne-domain-5",
    domainLabel: "05: 運用・監視・最適化",
    difficulty: "標準",
    selectCount: 1,
    question: "セキュリティ監査により、本番サブネットを流れる全通信パケットの**ペイロード中身（HTTP 本文や暗号化前後のパケットデータを含む全バイト）**を検査し、未知のマルウェアやコマンド＆コントロール（C&C）通信の兆候を検知したいという要件が出ました。ただし本番ワークロードの通信経路にインラインプロキシを挟んでレイテンシや単一障害点リスクを増やすことは避けたいです。最適なソリューションはどれですか？",
    options: [
      "Cloud IDS（内部で Packet Mirroring を利用してパス外で L7 脅威検知）を導入する",
      "VPC Flow Logs を有効化する",
      "Firewall Insights を有効化する",
      "Cloud NAT のログレベルを `ALL` に変更する",
    ],
    correctIndices: [0],
    explanation: "VPC Flow Logs は L3/L4 ヘッダのメタデータのみを記録しペイロードは取得しません。本番通信に遅延を与えずに全ペイロードをパス外で複製・検査して脅威を検知するには、Packet Mirroring ベースの Cloud IDS を利用します。",
    keywords: ["Cloud IDS", "Packet Mirroring", "パス外脅威検知"],
  },
  {
    id: "pcne-q19",
    domainId: "pcne-domain-5",
    domainLabel: "05: 運用・監視・最適化",
    difficulty: "標準",
    selectCount: 1,
    question: "長年運用している Shared VPC において、ファイアウォールルールが 300 個以上に肥大化しました。「過去数ヶ月間一度もヒットしていない不要ルール」「より高い優先度のルールによって完全に上書き・シャドウ化されているルール」「重複している許可ルール」を自動特定してルールセットを整理・最適化したい場合に活用すべき機能はどれですか？",
    options: [
      "Network Intelligence Center の Firewall Insights",
      "Performance Dashboard",
      "Cloud CDN のキャッシュ無効化（Invalidation）",
      "Private Service Connect",
    ],
    correctIndices: [0],
    explanation: "Firewall Insights は Firewall Rules Logging と連携して各ルールのヒット数を分析し、ヒット実績のないルールや優先度によりシャドウ化されたルール、過度に広い許可範囲を自動検出して最適化提案を提示します。",
    keywords: ["Firewall Insights", "シャドウ化ルール", "運用最適化"],
  },
  {
    id: "pcne-q20",
    domainId: "pcne-domain-5",
    domainLabel: "05: 運用・監視・最適化",
    difficulty: "応用",
    selectCount: 2,
    question: "東京リージョン（`asia-northeast1`）と米国リージョン（`us-central1`）間でマイクロサービス間の通信遅延とパケットロスが急増したという報告がありました。「障害が Google Cloud のバックボーンネットワーク全体で起きているのか、自社プロジェクト固有の構成か」を切り分けつつ、リージョン間・オンプレ間のトラフィック量とコスト内訳を調査したい場合、活用すべき 2 つの機能はどれですか？",
    options: [
      "Network Intelligence Center の Performance Dashboard で自プロジェクトのリージョン間 RTT・パケットロス率と Google Cloud 全体のベースラインを比較し、Network Topology でトラフィックフローを俯瞰する",
      "VPC Flow Logs を有効化（必要に応じてサンプリングと集約間隔を最適化）してどの VM・ポートペア間で大容量通信やリトライが発生しているか分析する",
      "Cloud Armor のレート制限を全内部通信へ適用する",
      "全サブネットを Auto Mode VPC へ変換する",
    ],
    correctIndices: [0, 1],
    explanation: "Performance Dashboard は自社プロジェクトと Google Cloud 全体のリージョン間 RTT・パケットロス指標を比較でき、Network Topology は全体フローとボトルネックを視覚化します。さらに具体的な送信元/先 VM やポート単位のトラフィック内訳・課金要因分析には VPC Flow Logs が有効です。",
    keywords: ["Performance Dashboard", "Network Topology", "VPC Flow Logs"],
  },
];

export const pcneOfficialResources: GcpOfficialResource[] = [
  {
    title: "Professional Cloud Network Engineer 認定公式ページ",
    description: "試験概要（120分 / 50〜60問 / 2年間有効）、推奨経験、最新トレーニングパスを確認できます。",
    url: "https://cloud.google.com/learn/certification/cloud-network-engineer",
    badge: "公式認定ページ",
  },
  {
    title: "Professional Cloud Network Engineer 試験ガイド",
    description: "VPC 設計・実装・ネットワークサービス・ハイブリッド相互接続・運用監視の出題範囲一次情報です。",
    url: "https://cloud.google.com/learn/certification/guides/cloud-network-engineer?hl=ja",
    badge: "公式試験ガイド",
  },
  {
    title: "Professional Cloud Network Engineer サンプル問題",
    description: "Google Cloud 公式のサンプル問題で出題形式・ケース判断の難易度を確認できます。",
    url: "https://cloud.google.com/learn/certification/sample-questions/cloud-network-engineer",
    badge: "公式サンプル",
  },
  {
    title: "VPC 設計ベストプラクティス・リファレンス（公式ドキュメント）",
    description: "Shared VPC・VPC Peering・GKE VPC-Native・ハイブリッド接続の公式設計指針です。",
    url: "https://cloud.google.com/architecture/best-practices-vpc-design?hl=ja",
    badge: "公式設計ガイド",
  },
];
