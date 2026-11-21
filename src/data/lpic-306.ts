import type {
  CertExamFact,
  CertFlashcardItem,
  CertQuestion,
} from "@/components/certification/types";
import type {
  LpicTopicItem,
  LpicComparisonTable,
  LpicWorkflowPattern,
  LpicPitfall,
  LpicKeyPathFact,
  LpicOfficialResource,
} from "./lpic-1";

export interface Lpic306Domain {
  id: string;
  exam: "306-300";
  number: string;
  title: string;
  englishTitle: string;
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  summary: string;
  topics: LpicTopicItem[];
}

// 出典: Linux Professional Institute (LPI) LPIC-3 High Availability and Storage Clusters Version 3.0 (Exam 306-300) 公式試験概要・Objectives
export const lpic306ExamFacts: CertExamFact[] = [
  { label: "対象試験", value: "306-300", detail: "1科目合格で LPIC-3 認定" },
  { label: "試験時間", value: "90 分", detail: "選択・記述（穴埋め）混在" },
  { label: "問題数", value: "60 問", detail: "高可用性・クラスタストレージ" },
  { label: "合格ライン", value: "500 点", detail: "200〜800 点スケール" },
  { label: "前提資格", value: "LPIC-2 保持", detail: "有効な LPIC-2 認定が必要" },
  { label: "受験形式", value: "ピアソンVUE", detail: "テストセンター / OnVUE（5年間有効）" },
];

// 出典: LPI LPIC-306 Objectives V3.0 (Topic 361 - 364)
export const lpic306Domains: Lpic306Domain[] = [
  {
    id: "topic-361",
    exam: "306-300",
    number: "361",
    title: "高可用性クラスタ管理",
    englishTitle: "High Availability Cluster Management",
    accentColor: "indigo",
    summary: "HA 理論（Quorum/Fencing/Split-brain）、LVS・Keepalived・HAProxy による負荷分散クラスタ、Pacemaker + Corosync フェイルオーバークラスタを学びます。",
    topics: [
      {
        id: "361-1",
        code: "361.1 - 361.2",
        title: "HA 理論と負荷分散クラスタ（LVS / Keepalived / HAProxy）",
        commands: ["ipvsadm", "keepalived", "haproxy", "systemctl", "vrrp"],
        keyPoints: [
          "HA 基本指標: MTBF（平均故障間隔）、MTTR（平均修復時間）、可用性（MTBF / (MTBF + MTTR)）、SLA、SPOF 排除",
          "スプリットブレイン対策: Quorum（過半数投票）と Fencing / STONITH（ノードレベル/リソースレベル強制隔離）",
          "LVS（IPVS: `ipvsadm`）: L4 ロードバランサ（NAT / DR: Direct Routing / TUN 方式）。`Keepalived`（VRRP による VIP 引き継ぎ＋IPVS 管理）",
          "HAProxy: L4/L7 高性能リバースプロキシ・ヘルスチェック・ACL ベースルーティング（`frontend` / `backend` / `listen`）",
        ],
        examTip: "LVS の DR（Direct Routing）モードではクライアントへの戻り通信がリアルサーバから直接返るため高スループットですが、ARP 問題（`arp_ignore` / `arp_announce`）対策が必要です。",
      },
      {
        id: "361-2",
        code: "361.3",
        title: "フェイルオーバークラスタ（Pacemaker / Corosync）",
        commands: ["pcs", "crm", "corosync-cfgtool", "stonith_admin", "cibadmin"],
        keyPoints: [
          "Pacemaker（リソース管理・CIB）＋ Corosync（ノード間メッセージング・メンバーシップ・Votequorum）の連携構造",
          "リソース構成: Primitive（単一リソース）、Group（順番起動＋同一ノード配置）、Clone / Promotable（複数ノード起動・Master/Slave）",
          "制約（Constraints）: Location（ノード配置優先度）、Colocation（同居/非同居）、Order（起動・停止順序）",
          "管理 CLI: `pcs status` / `pcs resource create` / `pcs constraint` / `pcs property set stonith-enabled=true`（または `crmsh`）",
        ],
        examTip: "2ノードクラスタの Corosync では `two_node: 1` と STONITH（Fencing）の組み合わせがスプリットブレイン防止の要となります。",
      },
    ],
  },
  {
    id: "topic-362",
    exam: "306-300",
    number: "362",
    title: "高可用性クラスタストレージ",
    englishTitle: "High Availability Cluster Storage",
    accentColor: "cyan",
    summary: "DRBD によるネットワーク越しのブロック複製、SAN/iSCSI・DM-Multipath 経路冗長化、DLM・CLVM・GFS2/OCFS2 クラスタファイルシステムを習得します。",
    topics: [
      {
        id: "362-1",
        code: "362.1 - 362.3",
        title: "DRBD・iSCSI / Multipath・クラスタ FS (DLM / CLVM / GFS2)",
        commands: ["drbdadm", "drbdmanage", "iscsiadm", "multipath", "multipathd", "lvmlockd", "mkfs.gfs2"],
        keyPoints: [
          "DRBD 9.x: ネットワーク RAID-1 のようにブロックデバイスを複製。プロトコル A（非同期）/ B（メモリ同期）/ C（ディスク書込完全同期）",
          "iSCSI Target（`targetcli`）/ Initiator（`iscsiadm`）と DM-Multipath（`/etc/multipath.conf`, `multipath -ll`）によるマルチパス冗長化",
          "複数ノードから同時マウントする共有ディスク型 FS（GFS2 / OCFS2）には DLM（分散ロックマネージャ）と CLVM/`lvmlockd` が不可欠",
        ],
        examTip: "DRBD の同期プロトコル C（両ノードのローカルディスク書き込み完了後に完了応答）と、共有 FS に ext4/XFS を直接複数ノードから同時マウントしてはいけない点（即破損）は超頻出です。",
      },
    ],
  },
  {
    id: "topic-363",
    exam: "306-300",
    number: "363",
    title: "高可用性分散ストレージ",
    englishTitle: "High Availability Distributed Storage",
    accentColor: "emerald",
    summary: "スケールアウト型の分散ファイルシステム GlusterFS と、統合分散ストレージプラットフォーム Ceph（MON/OSD/MGR/MDS・RBD・CephFS）を学びます。",
    topics: [
      {
        id: "363-1",
        code: "363.1 - 363.2",
        title: "GlusterFS と Ceph 分散ストレージ",
        commands: ["gluster peer probe", "gluster volume create", "ceph status", "ceph osd", "rbd"],
        keyPoints: [
          "GlusterFS: メタデータサーバ不要の分散 FS。Brick（実ストレージ）を束ねて Distributed / Replicated / Dispersed ボリュームを作成",
          "Ceph コンポーネント: OSD（データ実体格納・複製）、MON（クラスタ状態マップ管理）、MGR（メトリクス・管理補助）、MDS（CephFS 用メタデータ）",
          "Ceph データ配置: CRUSH アルゴリズムにより、中央索引サーバなしでオブジェクト配置先（PG → OSD）を計算決定",
          "Ceph インターフェース: RADOS ブロックデバイス（RBD）、CephFS（POSIX 共有 FS）、RADOSGW（S3/Swift 互換オブジェクト）",
        ],
        examTip: "Ceph の各デーモン（MON / OSD / MGR / MDS）の役割と、分散計算に CRUSH アルゴリズムが使われる点は頻出です。",
      },
    ],
  },
  {
    id: "topic-364",
    exam: "306-300",
    number: "364",
    title: "単一ノード高可用性",
    englishTitle: "Single Node High Availability",
    accentColor: "amber",
    summary: "単一サーバ内の耐障害性（S.M.A.R.T./UPS/Monit、高度 RAID、LVM シンプロビジョニング/スナップショット/LVM RAID、NIC ボンディング/VLAN/BGP）を網羅します。",
    topics: [
      {
        id: "364-1",
        code: "364.1 - 364.4",
        title: "ローカル監視・高度 RAID/LVM・ネットワーク冗長化",
        commands: ["smartctl", "monit", "mdadm", "lvcreate --type thin", "nmcli", "ip link", "bridge"],
        keyPoints: [
          "単一ノード監視: `smartd`/`smartctl`（ディスク予兆）、NUT / `apcupsd`（UPS 電源連携）、`monit`（プロセス・リソース死活監視・自動再起動）",
          "高度 LVM: シンプロビジョニング（`--thinpool` / `-T`）、CoW スナップショット（`-s`）、LVM RAID（`--type raid1/raid5`）、`lvconvert`",
          "NIC ボンディング（`bonding` ドライバ）: `balance-rr`(0), `active-backup`(1: 耐障害標準), `802.3ad`(4: LACP), `balance-alb`(6)",
          "L2/L3 冗長化: 802.1Q VLAN タグ、RSTP（スパニングツリー高速収束）、BGP による Anycast/マルチホーム経路広告の基礎",
        ],
        examTip: "Bonding の mode 1（`active-backup`）はスイッチ側の特殊設定（LACP）不要で冗長化でき、mode 4（`802.3ad`）はスイッチ側の LACP 設定が必須です。",
      },
    ],
  },
];

export const lpic306Comparisons: LpicComparisonTable[] = [
  {
    id: "lb-tools",
    category: "負荷分散",
    title: "負荷分散・VIP 管理技術比較（LVS / Keepalived / HAProxy）",
    subtitle: "LPIC-3 361.2 L4・L7 ロードバランサと VRRP",
    columns: ["ソフトウェア", "動作層", "主な役割・特徴"],
    rows: [
      { feature: "LVS (IPVS)", values: ["L4（カーネル空間）", "超高速パケット転送（NAT / Direct Routing / Tunnel）"] },
      { feature: "Keepalived", values: ["L3/L4（VRRP ＋ IPVS管理）", "VRRP で VIP フェイルオーバーを行い、LVS や HAProxy と連携"] },
      { feature: "HAProxy", values: ["L4 / L7（ユーザー空間）", "HTTP ヘッダ/URL 検査、SSL 終端、詳細なヘルスチェック"] },
    ],
    decisionRule: "「Keepalived で VIP の冗長化（Active/Standby）を行い、後ろの HAProxy へトラフィックを受ける」構成が実務定番です。",
  },
  {
    id: "drbd-protocols",
    category: "レプリケーション",
    title: "DRBD 複製プロトコル比較（Protocol A / B / C）",
    subtitle: "LPIC-3 362.1 書き込み完了タイミングと耐障害性",
    columns: ["プロトコル", "書き込み完了応答のタイミング", "データ損失リスク・用途"],
    rows: [
      { feature: "Protocol A（非同期）", values: ["ローカルディスク書込＋ローカル送信バッファ投入完了時", "災害時データ損失の可能性あり。遠距離 WAN 複製向け"] },
      { feature: "Protocol B（準同期）", values: ["ローカルディスク書込＋ピアのメモリ受信完了時", "ピアの電源同時断ではメモリ上の未書込分を失う可能性"] },
      { feature: "Protocol C（完全同期）", values: ["ローカル・ピア双方のディスク書込完了後", "データ損失ゼロ（高信頼クラスタの標準）。低遅延 LAN 向け"] },
    ],
    decisionRule: "LAN 内の HA フェイルオーバークラスタではデータ整合性最優先の **Protocol C** を選択する。",
  },
  {
    id: "distributed-storage",
    category: "分散ストレージ",
    title: "クラスタ・分散ストレージ比較（DRBD / GlusterFS / Ceph）",
    subtitle: "LPIC-3 362 / 363 規模とアクセス方式",
    columns: ["ストレージ", "構造・方式", "主な利用形態"],
    rows: [
      { feature: "DRBD", values: ["2〜数ノード間のブロックレベル同期ミラー（RAID-1相当）", "Pacemaker と組む Active/Passive DB・共有ブロック基盤"] },
      { feature: "GlusterFS", values: ["メタデータサーバなしのファイルベース分散/複製 FS", "Brick を追加してスケールアウトする共有ファイルシステム"] },
      { feature: "Ceph", values: ["CRUSH による自己修復型ユニファイドストレージ (OSD/MON)", "大規模ブロック(RBD)・ファイル(CephFS)・オブジェクト(S3)"] },
    ],
    decisionRule: "小規模 2 ノード Active/Standby は DRBD、メタデータサーバ不要のファイル共有は GlusterFS、大規模クラウド基盤は Ceph。",
  },
  {
    id: "bonding-modes",
    category: "ネットワーク冗長",
    title: "Linux NIC Bonding モード比較",
    subtitle: "LPIC-3 364.4 主要モードとスイッチ要件",
    columns: ["モード番号・名称", "動作概要", "スイッチ側の特別設定"],
    rows: [
      { feature: "0 (balance-rr)", values: ["ラウンドロビン送信（帯域集約＋耐障害）", "静的トランク設定が必要な場合あり（順序逆転に注意）"] },
      { feature: "1 (active-backup)", values: ["1本のみ稼働し障害時に待機 NIC へ切替", "不要（異なるスイッチへの跨ぎ接続も可能）"] },
      { feature: "4 (802.3ad / LACP)", values: ["IEEE 802.3ad 動的リンクアグリゲーション", "必須（スイッチ側でも LACP を有効化）"] },
      { feature: "6 (balance-alb)", values: ["ARP ネゴシエーションを用いた送受信負荷分散", "不要（スイッチ非依存で負荷分散）"] },
    ],
    decisionRule: "異なる2台のスイッチへ接続して確実にフェイルオーバーさせたい場合は **mode 1 (`active-backup`)**、帯域拡張も兼ねるなら **mode 4 (`802.3ad`)**。",
  },
];

export const lpic306Patterns: LpicWorkflowPattern[] = [
  {
    id: "pacemaker-ha",
    title: "Pacemaker + Corosync フェイルオーバークラスタ構築フロー",
    badge: "361.3",
    flow: ["pcs host auth", "pcs cluster setup", "pcs cluster start --all", "STONITH(Fencing) 設定", "VIP/サービス Resource 作成", "Colocation/Order 制約定義"],
    summary: "VIP と対象サービスを連動させ、障害時に自動で待機ノードへ引き継ぐ高可用性クラスタの基本フローです。",
    keyDesignPoints: [
      "本番運用では `stonith-enabled=true` のまま IPMI/PDU/SBD 等の適切な Fencing デバイスを構成し、スプリットブレインによるデータ破壊を防ぐ",
      "`pcs constraint colocation add`（同一ノードに配置）と `pcs constraint order`（VIP 先に起動→サービス起動）をセットで設定する",
    ],
  },
  {
    id: "keepalived-haproxy",
    title: "Keepalived (VRRP) ＋ HAProxy 冗長ロードバランサ構成",
    badge: "361.2",
    flow: ["Keepalived で VIP + track_script 設定", "sysctl net.ipv4.ip_nonlocal_bind=1", "HAProxy で VIP:443 を bind", "バックエンドヘルスチェック有効化"],
    summary: "ロードバランサ自体が SPOF にならないよう、2 台の HAProxy を VRRP で Active/Standby 冗長化する定番構成です。",
    keyDesignPoints: [
      "待機系ノードは起動時点で VIP を保持していないため、`/etc/sysctl.conf` に `net.ipv4.ip_nonlocal_bind = 1` を設定して HAProxy が起動できるようにする",
      "HAProxy プロセスダウンを検知したら VIP 優先度を下げる（`vrrp_script`）仕組みを入れる",
    ],
  },
  {
    id: "drbd-active-passive",
    title: "DRBD 9.x プライマリ/セカンダリ構築と同期確認フロー",
    badge: "362.1",
    flow: ["/etc/drbd.d/*.res 定義", "drbdadm create-md <res>", "drbdadm up <res>", "drbdadm primary --force (初回)", "drbdadm status で UpToDate 確認"],
    summary: "共有 SAN なしで 2 台の Linux サーバ間にリアルタイム複製された冗長ストレージを用意する手順です。",
    keyDesignPoints: [
      "ネットワーク経由の複製には `protocol C;` を指定して両ノード書き込み保証を行う",
      "Pacemaker から管理する場合は OS 起動時に drbd サービスを直接自動マウントさせずクラスタリソースとして制御する",
    ],
  },
  {
    id: "lvm-thin-snap",
    title: "LVM シンプロビジョニングとスナップショット運用フロー",
    badge: "364.3",
    flow: ["lvcreate -L 100G -T vg0/thinpool", "lvcreate -V 50G -T vg0/thinpool -n vol1", "lvcreate -s --name snap1 vg0/vol1", "領域監視と自動拡張率設定"],
    summary: "実使用分だけを動的に消費するシンプールと、高速・省スペースなシンスナップショットの作成手順です。",
    keyDesignPoints: [
      "シンプールが 100% 満杯になると書き込めなくなるため、`/etc/lvm/lvm.conf` の `thin_pool_autoextend_threshold` を設定して自動拡張を有効化する",
      "シンスナップショットは作成時デフォルトで読み取り専用かつアクティベーションスキップ（`-K` で有効化）になる点に注意する",
    ],
  },
];

export const lpic306Pitfalls: LpicPitfall[] = [
  {
    id: "pit306-1",
    trap: "Active/Active で 2 台のサーバから同一の iSCSI / SAN 共有ディスク上の `ext4` または `XFS` を同時マウントする",
    whyWrong: "`ext4` や `XFS` は単一ホストからのマウントを前提としたローカルファイルシステムであり、複数ノード間のメタデータキャッシュ整合性やロック機構がないため、同時マウントすると即座にファイルシステムが破壊される。",
    correctApproach: "複数ノードからの同時読み書きマウントが必要な場合は、DLM 連携対応のクラスタファイルシステム（`GFS2` や `OCFS2`）、または `NFS`/`CephFS` を使用する。",
  },
  {
    id: "pit306-2",
    trap: "スプリットブレイン対策として 2 ノードクラスタで STONITH（Fencing）を無効化（`stonith-enabled=false`）のまま本番運用する",
    whyWrong: "通信断が起きた際、双方のノードが「相手が死んだ」と判断して同じ共有ストレージへ同時に書き込み、データ破壊を引き起こす。",
    correctApproach: "本番クラスタでは必ずハードウェア/ストレージベースの Fencing（STONITH）を有効化し、異常ノードを確実に隔離してからフェイルオーバーさせる。",
  },
  {
    id: "pit306-3",
    trap: "LVS Direct Routing（DR）構成でリアルサーバのループバック（`lo`）に VIP を設定したまま ARP 対策を忘れる",
    whyWrong: "リアルサーバが VIP 宛ての ARP リクエストに応答してしまい、クライアントのトラフィックがロードバランサをバイパスして特定の 1 台へ直接流れてしまう。",
    correctApproach: "リアルサーバ側で `net.ipv4.conf.all.arp_ignore = 1` および `arp_announce = 2` を設定し、VIP への ARP 応答を抑止する。",
  },
  {
    id: "pit306-4",
    trap: "Keepalived + HAProxy で、バックアップ側のサーバを起動しようとして HAProxy が `Cannot bind socket` で起動失敗する",
    whyWrong: "バックアップノードは待機中に VIP を保持していないため、Linux カーネルの標準設定では未保持 IP へのソケットバインドが拒否される。",
    correctApproach: "`/etc/sysctl.conf` に `net.ipv4.ip_nonlocal_bind = 1` を設定して `sysctl -p` を適用する。",
  },
  {
    id: "pit306-5",
    trap: "NIC Bonding の mode 4（`802.3ad` / LACP）を Linux 側だけに設定してスイッチ側を通常のアクセスポートのままにする",
    whyWrong: "802.3ad は接続先スイッチとの間で LACPDU パケットをネゴシエーションして初めてリンク集約と冗長化が機能する。",
    correctApproach: "スイッチ側で LACP（Link Aggregation）を構成できない場合や 2 台の独立スイッチへ跨ぐ場合は `mode 1`（`active-backup`）を使う。",
  },
  {
    id: "pit306-6",
    trap: "GFS2 や OCFS2 を導入したのに `dlm`（Distributed Lock Manager）やクラスタ基盤を動かさずにマウントしようとする",
    whyWrong: "クラスタファイルシステムはノード間でブロックや inode のロック状態を同期するために DLM（および Corosync メンバーシップ）を必要とする。",
    correctApproach: "Pacemaker/Corosync クラスタ上で `dlm` リソースを起動したうえでクラスタ FS をマウントする。",
  },
];

export const lpic306KeyPaths: LpicKeyPathFact[] = [
  { id: "kp306-1", target: "/etc/corosync/corosync.conf", value: "Corosync メンバー設定", detail: "クラスタノードIP・Votequorum・two_node 等を定義" },
  { id: "kp306-2", target: "/etc/haproxy/haproxy.cfg", value: "HAProxy 設定", detail: "haproxy -c -f /etc/haproxy/haproxy.cfg で構文検証" },
  { id: "kp306-3", target: "/etc/keepalived/keepalived.conf", value: "Keepalived VRRP 設定", detail: "vrrp_instance, virtual_ipaddress, priority 等を定義" },
  { id: "kp306-4", target: "/etc/drbd.d/*.res", value: "DRBD リソース定義", detail: "ノード名・ディスク・IP・protocol C 等を記述" },
  { id: "kp306-5", target: "/etc/multipath.conf", value: "DM-Multipath 設定", detail: "multipath -ll で現在の冗長パス状態を確認" },
  { id: "kp306-6", target: "/etc/ceph/ceph.conf", value: "Ceph クラスタ設定", detail: "ceph -s / ceph health detail で健全性確認" },
  { id: "kp306-7", target: "ip_nonlocal_bind = 1", value: "VIP 未保持での bind 許可", detail: "HAProxy 待機ノード起動に必須の sysctl 設定" },
  { id: "kp306-8", target: "arp_ignore=1 / arp_announce=2", value: "LVS-DR の ARP 抑止", detail: "リアルサーバでの VIP ARP 衝突を防止" },
];

export const lpic306QuickLookup: CertFlashcardItem[] = [
  {
    keyword: "2 つのクラスタノードが通信断により互いを停止と誤認し、両方が同時に Active になる危険な状態",
    category: "361: HA 理論",
    recommended: "Split-brain (スプリットブレイン)",
    reason: "データ破損の原因となるため、Quorum（過半数票）と STONITH/Fencing で確実に防止する。",
  },
  {
    keyword: "異常ノードの電源強制断やストレージアクセス遮断を行い、クラスタから確実に隔離する機構",
    category: "361: HA 理論",
    recommended: "Fencing / STONITH",
    reason: "STONITH = Shoot The Other Node In The Head。データ破壊を防ぐ最後の砦。",
  },
  {
    keyword: "可用性（Availability）を MTBF と MTTR から算出する計算式",
    category: "361: HA 理論",
    recommended: "MTBF / (MTBF + MTTR)",
    reason: "MTBF（平均故障間隔）を延ばし、MTTR（平均修復時間）を縮めることで稼働率が上がる。",
  },
  {
    keyword: "VRRP を用いて複数ノード間で仮想 IP アドレス（VIP）を引き継ぎ、LVS/IPVS 管理も行えるデーモン",
    category: "361: 負荷分散",
    recommended: "Keepalived",
    reason: "HAProxy 等の外部プロセスの死活チェック（`vrrp_script`）と組み合わせる構成も定番。",
  },
  {
    keyword: "LVS の Direct Routing (DR) 構成でリアルサーバの `lo` にある VIP への ARP 応答を抑止する sysctl",
    category: "361: 負荷分散",
    recommended: "arp_ignore=1 / arp_announce=2",
    reason: "ロードバランサの VIP 宛てパケットをリアルサーバが直接奪ってしまうのを防ぐ。",
  },
  {
    keyword: "Pacemaker で複数リソースの「同一ノードへの配置」と「起動順序」を制御する 2 つの制約",
    category: "361: フェイルオーバー",
    recommended: "Colocation / Order 制約",
    reason: "Location 制約は「どのノードで動かすか（優先度）」を制御する。",
  },
  {
    keyword: "Pacemaker/Corosync クラスタの全体ステータス・リソース状態・エラーを一覧表示するコマンド",
    category: "361: フェイルオーバー",
    recommended: "pcs status (または crm status)",
    reason: "リソースの強制移動は `pcs resource move`、エラーリセットは `pcs resource cleanup`。",
  },
  {
    keyword: "ネットワーク越しのブロック複製 DRBD において、両ノードのディスク書き込み完了を確認して応答する方式",
    category: "362: DRBD",
    recommended: "Protocol C (完全同期)",
    reason: "Protocol A は非同期、Protocol B はメモリ到達同期、Protocol C はディスク書込同期。",
  },
  {
    keyword: "SAN/iSCSI ストレージへの冗長化された複数経路（パス）を集約し、自動フェイルオーバーを行う機能",
    category: "362: クラスタストレージ",
    recommended: "DM-Multipath (multipathd)",
    reason: "構成済みパスの確認は `multipath -ll`、設定ファイルは `/etc/multipath.conf`。",
  },
  {
    keyword: "複数ノードから同一共有ブロックデバイスを同時読み書きマウントできるクラスタファイルシステム例",
    category: "362: クラスタストレージ",
    recommended: "GFS2 / OCFS2 (DLM 併用)",
    reason: "ext4 や XFS は同時マウント非対応のため必ず専用クラスタ FS と DLM を使用する。",
  },
  {
    keyword: "GlusterFS において、ストレージ構成の基本単位となる各サーバ上のローカルディレクトリ",
    category: "363: GlusterFS",
    recommended: "Brick (ブリック)",
    reason: "信頼済みストレージプール（`gluster peer probe`）上の Brick を束ねて Volume を作る。",
  },
  {
    keyword: "Ceph において、実際のデータオブジェクトをローカルディスクへ格納し複製・復旧を行うデーモン",
    category: "363: Ceph",
    recommended: "OSD (Object Storage Daemon)",
    reason: "MON はマップ管理、MGR は監視補助、MDS は CephFS 用メタデータを担当。",
  },
  {
    keyword: "Ceph が中央メタデータ索引サーバを使わずにオブジェクトの配置先 OSD を高速計算するアルゴリズム",
    category: "363: Ceph",
    recommended: "CRUSH",
    reason: "クライアントとクラスタが同じ CRUSH マップから自律的にデータ位置を計算でき単一障害点をなくす。",
  },
  {
    keyword: "Ceph が提供する仮想マシン用ブロックストレージ、POSIX 共有FS、S3 互換オブジェクトの 3 機能",
    category: "363: Ceph",
    recommended: "RBD / CephFS / RADOSGW (RGW)",
    reason: "すべて下層の RADOS（Reliable Autonomic Distributed Object Store）上で動作する。",
  },
  {
    keyword: "単一 Linux ノード上でプロセス・ファイル・CPU/メモリ異常を監視し、自動再起動や通知を行う軽量ツール",
    category: "364: 単一ノード HA",
    recommended: "Monit (monit)",
    reason: "設定ファイル `/etc/monitrc` 等でサービス死活やディスク空き率閾値を記述する。",
  },
  {
    keyword: "NIC Bonding でスイッチ側の設定変更（LACP）不要で確実にフェイルオーバー冗長化を行えるモード",
    category: "364: NW 冗長化",
    recommended: "mode 1 (active-backup)",
    reason: "1本が障害でリンクダウンすると即座に待機 NIC が引き継ぐ。LACP 帯域束ねは mode 4 (`802.3ad`)。",
  },
  {
    keyword: "LVM で物理容量以上の仮想サイズを割り当て、実際の書き込み時にのみ領域を消費する機能",
    category: "364: 高度 LVM",
    recommended: "シンプロビジョニング (--thinpool / -T)",
    reason: "`thin_pool_autoextend_threshold` を設定しプール枯渇を防ぐ運用が重要。",
  },
  {
    keyword: "待機系ロードバランサがまだ VIP を持っていなくても HAProxy を事前バインド起動させるカーネル設定",
    category: "361: 負荷分散",
    recommended: "net.ipv4.ip_nonlocal_bind = 1",
    reason: "Keepalived と HAProxy を組み合わせる際の必須パラメータ。",
  },
  {
    keyword: "カーネル空間で動作する LVS (IPVS) の仮想サービスおよびリアルサーバの転送テーブルを管理・確認するコマンド",
    category: "361: 負荷分散",
    recommended: "ipvsadm",
    reason: "`ipvsadm -Ln` で仮想 IP、バックエンド実サーバ、振り分け方式、アクティブ接続数を確認できる。",
  },
  {
    keyword: "Linux イニシエータから iSCSI ターゲットのディスカバリ、ログイン、セッション確認を行うコマンド",
    category: "362: iSCSI",
    recommended: "iscsiadm (-m discovery / node / session)",
    reason: "まず `-m discovery -t st -p <IP>` でターゲットを取得し、`-m node --login` でセッションを確立する。",
  },
  {
    keyword: "/etc/drbd.d/*.res の設定に基づき DRBD メタデータ作成・リソース起動・役割切替を行う管理コマンド",
    category: "362: DRBD",
    recommended: "drbdadm",
    reason: "`create-md` で初期化、`up` で起動、`primary` / `secondary` で昇格・降格、`status` で同期確認を行う。",
  },
  {
    keyword: "GlusterFS でサーバ同士を信頼済みストレージプールへ追加し、共有ボリュームを作成する一連のコマンド",
    category: "363: GlusterFS",
    recommended: "gluster peer probe / gluster volume create",
    reason: "ノード追加後に `replica` 等を指定してボリュームを作成し、`gluster volume start` で公開する。",
  },
  {
    keyword: "Linux ソフトウェア RAID の構築・監視・障害ディスク交換と、同期状態を確認する /proc ファイル",
    category: "364: 高度 RAID",
    recommended: "mdadm / /proc/mdstat",
    reason: "`/proc/mdstat` でアレイ状態やリビルド進捗を確認し、`mdadm --manage` で `--fail` / `--remove` / `--add` を行う。",
  },
  {
    keyword: "HDD/SSD の S.M.A.R.T. 自己診断属性を取得し、ディスク故障の予兆監視を行うコマンドとデーモン",
    category: "364: 単一ノード HA",
    recommended: "smartctl / smartd",
    reason: "`smartctl -a /dev/sda` で詳細属性を確認し、`smartd` で不良セクタ等の異常兆候を監視・通知する。",
  },
];

export const lpic306PracticeQuestions: CertQuestion[] = [
  {
    id: "q-361-1",
    domainId: "topic-361",
    domainLabel: "361: HA クラスタ管理",
    difficulty: "標準",
    selectCount: 1,
    question: "2 ノードのフェイルオーバークラスタにおいて、ノード間のハートビート通信が途絶えた際に両ノードが同時に Active となって共有データを破壊する（スプリットブレイン）のを防ぐため最も重要な機構はどれですか？",
    options: [
      "Fencing / STONITH により異常・隔離ノードを強制電源断またはストレージ遮断する",
      "両ノードのホスト名を同一にする",
      "Keepalived の VIP を両ノードで常に同時保持させる",
      "ext4 のジャーナル機能を無効にする",
    ],
    correctIndices: [0],
    explanation:
      "スプリットブレインによるデータ破壊を確実に防ぐには、Fencing / STONITH（IPMI や PDU による強制電源断、SBD 等）で相手ノードを確実に停止・隔離してからリソースを引き継ぐことが不可欠です。",
    keywords: ["スプリットブレイン", "STONITH", "Fencing"],
  },
  {
    id: "q-361-2",
    domainId: "topic-361",
    domainLabel: "361: HA クラスタ管理",
    difficulty: "標準",
    selectCount: 1,
    question: "Keepalived (VRRP) と HAProxy を Active/Standby で構成した際、VIP をまだ保持していない Standby ノード側で HAProxy が正常に起動できるよう設定すべき Linux カーネルパラメータはどれですか？",
    options: [
      "net.ipv4.ip_nonlocal_bind = 1",
      "net.ipv4.conf.all.arp_ignore = 1",
      "vm.swappiness = 0",
      "kernel.panic = 10",
    ],
    correctIndices: [0],
    explanation:
      "`net.ipv4.ip_nonlocal_bind = 1` を有効にすることで、現在自ホストのインターフェースに割り当てられていない VIP に対してもプロセスが `bind()` して待機できるようになります。",
    keywords: ["ip_nonlocal_bind", "Keepalived", "HAProxy"],
  },
  {
    id: "q-361-3",
    domainId: "topic-361",
    domainLabel: "361: HA クラスタ管理",
    difficulty: "標準",
    selectCount: 1,
    question: "Pacemaker クラスタにおいて、「Web サーバのリソースは必ず仮想 IP（VIP）リソースと同じノード上で稼働させ、かつ VIP の起動後に Web サーバを起動する」ように設定する際に使用する制約の組み合わせはどれですか？",
    options: [
      "Colocation 制約 と Order 制約",
      "Location 制約 と Fencing 制約",
      "Quorum 制約 と Clone 制約",
      "Multipath 制約 と VRRP 制約",
    ],
    correctIndices: [0],
    explanation:
      "`Colocation` 制約で「同じ（または別の）ノードに配置するか」を定義し、`Order` 制約で「どの順番で起動・停止するか」を定義します。",
    keywords: ["Pacemaker", "Colocation", "Order"],
  },
  {
    id: "q-361-4",
    domainId: "topic-361",
    domainLabel: "361: HA クラスタ管理",
    difficulty: "基礎",
    selectCount: 1,
    question: "LVS（IPVS）の Direct Routing（DR）モードにおいて、リアルサーバが自身のループバックインターフェース（`lo`）に設定された VIP への外部からの ARP リクエストに応答してしまうのを防ぐための適切なカーネルパラメータ設定はどれですか？",
    options: [
      "`arp_ignore = 1` および `arp_announce = 2` を設定する",
      "`ip_forward = 0` のみを設定する",
      "`tcp_syncookies = 0` を設定する",
      "`rp_filter = 2` のみを設定する",
    ],
    correctIndices: [0],
    explanation:
      "LVS-DR 構成ではリアルサーバも `lo` に VIP を持つため、ARP 応答を抑止する `arp_ignore = 1` と `arp_announce = 2` をリアルサーバ側に設定する必要があります。",
    keywords: ["LVS", "Direct Routing", "arp_ignore"],
  },
  {
    id: "q-361-5",
    domainId: "topic-361",
    domainLabel: "361: HA クラスタ管理",
    difficulty: "標準",
    selectCount: 2,
    question: "Pacemaker + Corosync クラスタの診断・検証および負荷分散制御に関して正しい記述を 2 つ選んでください。",
    options: [
      "`corosync-quorumtool` や `corosync-cfgtool` を用いて、クラスタのクォーラム状態（定足数・投票数）や通信リングの健全性を確認できる",
      "`crm_simulate` を使用すると、ノード障害やメンテナンス移行時にクラスタリソースがどのように再配置されるかを事前検証できる",
      "Pacemaker の `Location` 制約は、あるリソースを別のリソースと必ず同一ノードに配置することを強制する制約である",
      "HAProxy はカーネル空間の Netfilter フックのみで動作するため、HTTP ヘッダや URL パスに基づく L7 ルーティングは行えない",
    ],
    correctIndices: [0, 1],
    explanation:
      "`corosync-quorumtool` / `corosync-cfgtool` は Corosync のクォーラムと通信リング確認に、`crm_simulate` はリソース遷移のシミュレーションに使用されます。同一ノード配置の強制は `Colocation` 制約、HTTP ヘッダ検査等の L7 負荷分散は `HAProxy` の特徴です。",
    keywords: ["corosync-quorumtool", "crm_simulate", "Pacemaker"],
  },
  {
    id: "q-362-1",
    domainId: "topic-362",
    domainLabel: "362: HA クラスタストレージ",
    difficulty: "標準",
    selectCount: 1,
    question: "DRBD（Distributed Replicated Block Device）において、ローカルディスクおよびリモートノードのディスク双方への書き込みが完了した時点でアプリケーションへ完了を返し、データ損失ゼロを重視する同期プロトコルはどれですか？",
    options: ["Protocol A", "Protocol B", "Protocol C", "Protocol D"],
    correctIndices: [2],
    explanation:
      "`Protocol C` は完全同期複製プロトコルであり、両ノードのローカルストレージへの書き込み完了を確認してから書き込み完了を返すため、高信頼 HA クラスタの標準として使われます。",
    keywords: ["DRBD", "Protocol C", "同期複製"],
  },
  {
    id: "q-362-2",
    domainId: "topic-362",
    domainLabel: "362: HA クラスタストレージ",
    difficulty: "標準",
    selectCount: 1,
    question: "SAN や iSCSI の共有ブロックストレージに対して、複数の Linux ノードから同時に読み書き可能な状態でマウントする必要がある場合、適切なファイルシステムとロック基盤の組み合わせはどれですか？",
    options: [
      "ext4 ＋ standard LVM",
      "XFS ＋ systemd-journald",
      "GFS2（または OCFS2）＋ DLM（分散ロックマネージャ）",
      "vfat ＋ autofs",
    ],
    correctIndices: [2],
    explanation:
      "`ext4` や `XFS` を複数ノードから同時マウントするとメタデータが即座に破損します。必ず `DLM` と連携したクラスタファイルシステム（`GFS2` / `OCFS2`）を使用します。",
    keywords: ["GFS2", "OCFS2", "DLM"],
  },
  {
    id: "q-362-3",
    domainId: "topic-362",
    domainLabel: "362: HA クラスタストレージ",
    difficulty: "基礎",
    selectCount: 1,
    question: "DM-Multipath（`multipathd`）で構成された SAN/iSCSI デバイスの冗長パス一覧、パス優先度グループ、および各パスの状態（active / ready 等）を確認するコマンドはどれですか？",
    options: ["multipath -ll", "iscsiadm -m session", "drbdadm status", "lsblk -m"],
    correctIndices: [0],
    explanation:
      "`multipath -ll` は現在のマルチパストポロジと各経路のリンク状態・優先度グループの詳細を表示します。",
    keywords: ["DM-Multipath", "multipath -ll", "SAN"],
  },
  {
    id: "q-362-4",
    domainId: "topic-362",
    domainLabel: "362: HA クラスタストレージ",
    difficulty: "標準",
    selectCount: 1,
    question: "Linux ノードを iSCSI イニシエータとして構成し、リモートストレージのターゲット（IQN）を検出（ディスカバリ）してセッションへログインする `iscsiadm` コマンドの手順として正しいものはどれですか？",
    options: [
      "`iscsiadm -m discovery -t st -p <ターゲットIP>` でターゲット一覧を検出し、`iscsiadm -m node -T <IQN> -p <ターゲットIP> --login` で接続する",
      "`iscsiadm -m target --create <IQN>` を実行してから `mkfs.gfs2` で直接フォーマットする",
      "`multipath -ll` で iSCSI ターゲットへ CHAP パスワードを設定してログインする",
      "`drbdadm create-md` をイニシエータ側で実行すると自動的に iSCSI セッションが確立される",
    ],
    correctIndices: [0],
    explanation:
      "iSCSI イニシエータではまず `discovery` モード（`-m discovery -t st -p <IP>`）でターゲットを検出し、続いて `node` モード（`--login`）でセッションを確立します。接続済みセッションの確認には `iscsiadm -m session` を使用します。",
    keywords: ["iscsiadm", "iSCSI", "SendTargets"],
  },
  {
    id: "q-362-5",
    domainId: "topic-362",
    domainLabel: "362: HA クラスタストレージ",
    difficulty: "応用",
    selectCount: 2,
    question: "DRBD および DM-Multipath によるクラスタストレージの構築と運用に関して正しい記述を 2 つ選んでください。",
    options: [
      "DRBD リソースを初回構築する際は、`drbdadm create-md <リソース名>` でメタデータ領域を作成してから `drbdadm up` で有効化する",
      "DM-Multipath で複数の物理パスが `/dev/mapper/mpatha` 等へ集約された後、その上のパーティション用デバイスマップを作成する際に `kpartx` が使われることがある",
      "DRBD の `Protocol A` はローカルとリモート双方のディスク書き込み完了を待つため、最もデータ損失リスクが低い",
      "`ext4` ファイルシステムを複数ノードから同時に読み書きマウントする場合でも、`multipathd` が稼働していればファイルロックが自動で整合される",
    ],
    correctIndices: [0, 1],
    explanation:
      "DRBD は `drbdadm create-md` でメタデータ初期化後に `drbdadm up` で起動します。また `kpartx` はマルチパスデバイス上のパーティション用マッピング作成に使われます。`Protocol A` は非同期複製であり、`multipathd` は複数ノード間ロックではなく経路冗長化を担います。",
    keywords: ["drbdadm", "kpartx", "DM-Multipath"],
  },
  {
    id: "q-363-1",
    domainId: "topic-363",
    domainLabel: "363: HA 分散ストレージ",
    difficulty: "標準",
    selectCount: 1,
    question: "Ceph クラスタにおいて、中央の単一メタデータ検索サーバを介さずに、クライアントとクラスタノードがオブジェクトの格納先 OSD を自律的に計算・決定するためのアルゴリズムはどれですか？",
    options: ["CRUSH", "Paxos", "VRRP", "LACP"],
    correctIndices: [0],
    explanation:
      "Ceph は `CRUSH`（Controlled Replication Under Scalable Hashing）アルゴリズムによって、クラスタマップと配置ルールからデータの格納先 OSD を計算するためボトルネックになりません。",
    keywords: ["Ceph", "CRUSH", "分散ストレージ"],
  },
  {
    id: "q-363-2",
    domainId: "topic-363",
    domainLabel: "363: HA 分散ストレージ",
    difficulty: "標準",
    selectCount: 2,
    question: "Ceph クラスタを構成するデーモンの役割の組み合わせとして正しいものを 2 つ選んでください。",
    options: [
      "OSD（ceph-osd）: 実データオブジェクトのディスク保存、複製、リカバリを担当する",
      "MON（ceph-mon）: クラスタのトポロジ・状態マップ（Monitor Map / OSD Map 等）を維持し Quorum を形成する",
      "MDS（ceph-mds）: RADOS ブロックデバイス（RBD）のローカル iSCSI ターゲットのみを管理する",
      "RBD（ceph-rbd）: X.509 証明書の自動更新を担う CA デーモンである",
    ],
    correctIndices: [0, 1],
    explanation:
      "`ceph-osd` がデータ格納・複製、`ceph-mon` がクラスタ状態マップ管理と過半数合意を担当します。`ceph-mds` は POSIX ファイルシステムである `CephFS` のメタデータ管理用です（RBD は MDS 不要）。",
    keywords: ["Ceph OSD", "Ceph MON", "Ceph MDS"],
  },
  {
    id: "q-363-3",
    domainId: "topic-363",
    domainLabel: "363: HA 分散ストレージ",
    difficulty: "基礎",
    selectCount: 1,
    question: "GlusterFS において、別々のサーバを追加して信頼済みストレージプールを形成する際に最初に実行するコマンドはどれですか？",
    options: [
      "gluster peer probe <ホスト名/IP>",
      "gluster volume create <名前>",
      "gluster brick add",
      "ceph osd create",
    ],
    correctIndices: [0],
    explanation:
      "まず `gluster peer probe` で各ノードを信頼済みプール（Trusted Storage Pool）へ参加させ、その後に各ノードの Brick を指定して `gluster volume create` を実行します。",
    keywords: ["GlusterFS", "gluster peer probe", "Brick"],
  },
  {
    id: "q-363-4",
    domainId: "topic-363",
    domainLabel: "363: HA 分散ストレージ",
    difficulty: "標準",
    selectCount: 1,
    question: "GlusterFS において、単一ノードの障害が発生してもデータアクセスを継続できるよう、同一ファイルを複数の異なるサーバ上の Brick へ自動的に複製して冗長性を確保するボリュームタイプはどれですか？",
    options: [
      "Replicated Volume（レプリケーションボリューム）",
      "Distributed Volume（分散ボリューム、複製なし）",
      "Striped Volume（ストライプボリューム、複製なし）",
      "Local Loopback Volume",
    ],
    correctIndices: [0],
    explanation:
      "GlusterFS の標準 `Distributed` ボリュームはファイルを各 Brick へ分散配置するだけで冗長性がありません。耐障害性を持たせるには `replica <N>` を指定した `Replicated` ボリューム（またはイレイジャー符号化を用いる `Dispersed` ボリューム）を構成します。",
    keywords: ["GlusterFS", "Replicated Volume", "Brick"],
  },
  {
    id: "q-363-5",
    domainId: "topic-363",
    domainLabel: "363: HA 分散ストレージ",
    difficulty: "応用",
    selectCount: 2,
    question: "Ceph 分散ストレージのコンポーネントおよび管理コマンドに関して正しい記述を 2 つ選んでください。",
    options: [
      "`rbd` コマンドを使用して、Ceph クラスタ上のプール内に仮想マシン等からマウント可能な RADOS ブロックデバイスイメージを作成・マップできる",
      "`ceph status`（または `ceph -s`）を実行すると、クラスタの全体健全性（`HEALTH_OK` 等）、MON のクォーラム状態、OSD の稼働数、PG の状態を確認できる",
      "`RADOSGW (RGW)` は POSIX 準拠のカーネルファイルシステムをマウントするための専用プロトコルであり、S3 API には非対応である",
      "`Ceph` では単一の `MDS` ノードがすべてのブロックデバイス（RBD）とオブジェクト（RGW）のデータ本体を仲介して転送する",
    ],
    correctIndices: [0, 1],
    explanation:
      "`rbd` コマンドでブロックデバイスイメージの操作、`ceph status`（`ceph -s`）でクラスタ全体の健全性確認を行います。`RADOSGW` は S3/Swift 互換オブジェクトストレージゲートウェイであり、`MDS` は CephFS のメタデータのみを担当します（データ本体は CRUSH に従いクライアントと OSD 間で直接やり取りされます）。",
    keywords: ["rbd", "ceph status", "RADOSGW", "CephFS"],
  },
  {
    id: "q-364-1",
    domainId: "topic-364",
    domainLabel: "364: 単一ノード HA",
    difficulty: "標準",
    selectCount: 1,
    question: "Linux NIC Bonding において、接続先スイッチ側でのリンクアグリゲーション（LACP）設定が不要であり、異なる 2 台のスイッチへ接続して障害時に待機側 NIC へ即座に切り替えられるモードはどれですか？",
    options: [
      "mode 1 (active-backup)",
      "mode 4 (802.3ad)",
      "mode 0 (balance-rr)",
      "mode 2 (balance-xor)",
    ],
    correctIndices: [0],
    explanation:
      "`mode 1 (active-backup)` はスイッチ側の特別なトランク/LACP 設定を必要とせず、異なる物理スイッチへ跨いで接続してもシンプルかつ確実にフェイルオーバーを実現できます。",
    keywords: ["Bonding", "active-backup", "mode 1"],
  },
  {
    id: "q-364-2",
    domainId: "topic-364",
    domainLabel: "364: 単一ノード HA",
    difficulty: "標準",
    selectCount: 1,
    question: "Linux NIC Bonding の `mode 4 (802.3ad)` を利用する場合に必須となる要件はどれですか？",
    options: [
      "接続先スイッチ側でも IEEE 802.3ad (LACP) が有効化・設定されていること",
      "すべての NIC で IPv6 のみを無効にすること",
      "ジャンボフレームを 576 バイトに制限すること",
      "Corosync を同一サーバで起動すること",
    ],
    correctIndices: [0],
    explanation:
      "`mode 4 (802.3ad)` はスイッチとの間で LACP プロトコルをやり取りして動的リンク集約を行うため、スイッチポート側の LACP 設定が必須です。",
    keywords: ["802.3ad", "LACP", "Bonding mode 4"],
  },
  {
    id: "q-364-3",
    domainId: "topic-364",
    domainLabel: "364: 単一ノード HA",
    difficulty: "標準",
    selectCount: 1,
    question: "LVM シンプロビジョニングでシンプール（Thin Pool）を運用する際、実領域が 100% 枯渇してボリュームが読み取り専用化・ハングするのを防ぐために `/etc/lvm/lvm.conf` で設定すべき重要項目はどれですか？",
    options: [
      "`thin_pool_autoextend_threshold` および `thin_pool_autoextend_percent`（dmeventd 連携による自動拡張）",
      "`snapshot_autoextend_disabled = 1`",
      "`use_lvmlockd = 0`",
      "`max_pv = 1`",
    ],
    correctIndices: [0],
    explanation:
      "シンプールは実容量超過（オーバーコミット）が可能なため、閾値（例: 80%）到達時に自動でプールを拡張する `thin_pool_autoextend_threshold` の設定が運用上重要です。",
    keywords: ["LVM シンプロビジョニング", "thin_pool_autoextend_threshold"],
  },
  {
    id: "q-364-4",
    domainId: "topic-364",
    domainLabel: "364: 単一ノード HA",
    difficulty: "基礎",
    selectCount: 1,
    question: "単一 Linux サーバ上で特定デーモンプロセスの死活監視や CPU/メモリ/ディスク使用率の閾値監視を行い、異常時に自動再起動やアラート送信を実行できる軽量監視ツールはどれですか？",
    options: ["Monit (`monit`)", "tdbbackup", "packstack", "exportfs"],
    correctIndices: [0],
    explanation:
      "Monit はプロセス・ファイル・ネットワーク・システムリソースの監視と自動復旧アクション（restart 等）を定義できる単一ノード高可用性ツールです。",
    keywords: ["Monit", "プロセス監視", "自動復旧"],
  },
  {
    id: "q-364-5",
    domainId: "topic-364",
    domainLabel: "364: 単一ノード HA",
    difficulty: "標準",
    selectCount: 2,
    question: "高可用性（HA）設計の理論・指標に関して正しい説明を 2 つ選んでください。",
    options: [
      "可用性（Availability）は `MTBF / (MTBF + MTTR)` で表され、平均修復時間（MTTR）を短くすることでも向上する",
      "Quorum（クォーラム）はクラスタ構成ノードの過半数が合意できる状態を維持し、少数派パーティションの単独稼働を防ぐ仕組みである",
      "Active/Active 構成では負荷分散はできないため、常に 1 台の待機系が遊休状態になる",
      "SPOF（Single Point of Failure）を増やすことでクラスタの可用性は向上する",
    ],
    correctIndices: [0, 1],
    explanation:
      "可用性の式 `MTBF / (MTBF + MTTR)` と Quorum によるスプリットブレイン抑止は HA 設計の基礎です。Active/Active は複数系が同時に処理を担い、SPOF（単一障害点）は排除すべき対象です。",
    keywords: ["MTBF", "MTTR", "Quorum", "SPOF"],
  },
];

// 出典: Linux Professional Institute (LPI) 公式リソース
export const lpic306OfficialResources: LpicOfficialResource[] = [
  {
    title: "LPI 公式 LPIC-3 High Availability and Storage Clusters (306) 概要",
    description: "LPIC-3 306-300 試験の公式概要、前提資格、認定要件です。",
    url: "https://www.lpi.org/our-certifications/lpic-3-306-overview",
    badge: "公式",
  },
  {
    title: "LPIC-306 Objectives V3.0（英語一次情報）",
    description: "Topic 361〜364 の詳細出題項目・重要ファイル・コマンド一覧です。",
    url: "https://wiki.lpi.org/wiki/LPIC-306_Objectives_V3.0",
    badge: "試験範囲",
  },
  {
    title: "LPIC-3 306 Objectives V3.0（日本語訳）",
    description: "LPI Wiki で公開されている Exam 306 Version 3.0 の日本語版試験範囲です。",
    url: "https://wiki.lpi.org/wiki/LPIC-3_306_Objectives_V3.0(JA)",
    badge: "日本語範囲",
  },
];
