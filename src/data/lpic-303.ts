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

export interface Lpic303Domain {
  id: string;
  exam: "303-300";
  number: string;
  title: string;
  englishTitle: string;
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  summary: string;
  topics: LpicTopicItem[];
}

// 出典: Linux Professional Institute (LPI) LPIC-3 Security Version 3.0 (Exam 303-300) 公式試験概要・Objectives
export const lpic303ExamFacts: CertExamFact[] = [
  { label: "対象試験", value: "303-300", detail: "1科目合格で LPIC-3 認定" },
  { label: "試験時間", value: "90 分", detail: "選択・記述（穴埋め）混在" },
  { label: "問題数", value: "60 問", detail: "エンタープライズセキュリティ" },
  { label: "合格ライン", value: "500 点", detail: "200〜800 点スケール" },
  { label: "前提資格", value: "LPIC-2 保持", detail: "有効な LPIC-2 認定が必要" },
  { label: "受験形式", value: "ピアソンVUE", detail: "テストセンター / OnVUE（5年間有効）" },
];

// 出典: LPI LPIC-303 Objectives V3.0 (Topic 331 - 335)
export const lpic303Domains: Lpic303Domain[] = [
  {
    id: "topic-331",
    exam: "303-300",
    number: "331",
    title: "暗号化",
    englishTitle: "Cryptography",
    accentColor: "indigo",
    summary: "X.509 証明書と PKI、OpenSSL による CA/署名/検証、LUKS/eCryptfs ファイルシステム暗号化、DNSSEC/DANE/DoT/DoH を学びます。",
    topics: [
      {
        id: "331-1",
        code: "331.1 - 331.2",
        title: "X.509 証明書・PKI・TLS 認証と暗号化",
        commands: ["openssl", "openssl req", "openssl x509", "openssl s_client", "openssl verify", "update-ca-trust"],
        keyPoints: [
          "PKI 要素: ルート CA / 中間 CA、CSR（証明書署名要求）、CRL（失効リスト）、OCSP（リアルタイム失効確認・OCSP Stapling）",
          "`openssl req -new -x509` で自己署名証明書生成、`openssl s_client -connect host:443 -showcerts` で TLS 証明書チェーン確認",
          "Let's Encrypt / ACME（certbot）による自動証明書発行と、SAN（Subject Alternative Name）の重要性",
        ],
        examTip: "PEM（Base64テキスト）と DER（バイナリ）の変換オプション `-inform` / `-outform` や、`openssl s_client` の検証オプションは定番です。",
      },
      {
        id: "331-2",
        code: "331.3 - 331.4",
        title: "暗号化ファイルシステムと DNS 暗号化",
        commands: ["cryptsetup", "ecryptfs-mount-private", "dnssec-keygen", "dnssec-signzone", "delv", "unbound"],
        keyPoints: [
          "LUKS（`cryptsetup luksFormat / luksOpen`）はブロックデバイス全体を暗号化し、複数パスフレーズ（最大8/32スロット）や `/etc/crypttab` による起動時復号に対応",
          "eCryptfs はスタック型ファイルシステムでホームディレクトリ単位等の暗号化に利用",
          "DNSSEC（RRSIG / DNSKEY / DS レコードによる改ざん防止）、DANE（TLSA レコードで証明書検証）、DoT（TCP 853）/ DoH（HTTPS 443）",
        ],
        examTip: "DNSSEC が提供するのは「応答の正当性・非改ざん保証」であり通信の秘匿（暗号化）ではない点、暗号化は DoT/DoH が担う点に注意。",
      },
    ],
  },
  {
    id: "topic-332",
    exam: "303-300",
    number: "332",
    title: "ホストセキュリティ",
    englishTitle: "Host Security",
    accentColor: "cyan",
    summary: "カーネル・ブート（Secure Boot/TPM）の堅牢化、ファイル改ざん検知・監査（AIDE/auditd）、リソース制御（cgroups/systemd）を習得します。",
    topics: [
      {
        id: "332-1",
        code: "332.1 - 332.3",
        title: "ホスト堅牢化・侵入検知（AIDE/auditd）・リソース制御",
        commands: ["sysctl", "mokutil", "aide", "auditctl", "ausearch", "aureport", "systemd-run", "ulimit"],
        keyPoints: [
          "カーネル堅牢化: `kernel.kptr_restrict`, `kernel.dmesg_restrict`, `fs.protected_symlinks`, ASLR（`kernel.randomize_va_space = 2`）",
          "UEFI Secure Boot と TPM 2.0 による信頼されたブート検証（`mokutil --sb-state`）",
          "AIDE（`/etc/aide.conf`, `aide --init`, `aide --check`）でファイルハッシュ・メタデータの改ざんを検知",
          "Linux Audit（`auditd` / `/etc/audit/rules.d/`）: `auditctl -w /etc/passwd -p wa -k passwd_watch` で監査し `ausearch -k` / `aureport` で調査",
        ],
        examTip: "`auditctl -w <パス> -p rwxa -k <キー>` の各フラグと、systemd ユニットの `MemoryMax=` / `CPUQuota=` / `ProtectSystem=strict` などのサンドボックス化は頻出です。",
      },
    ],
  },
  {
    id: "topic-333",
    exam: "303-300",
    number: "333",
    title: "アクセス制御",
    englishTitle: "Access Control",
    accentColor: "emerald",
    summary: "任意アクセス制御（DAC / POSIX ACL / 拡張属性・Linux Capabilities）と強制アクセス制御（SELinux / AppArmor）を網羅します。",
    topics: [
      {
        id: "333-1",
        code: "333.1 - 333.2",
        title: "DAC・Capabilities と MAC（SELinux / AppArmor）",
        commands: ["getfacl", "setfacl", "getcap", "setcap", "getenforce", "setenforce", "semanage", "restorecon", "aa-status"],
        keyPoints: [
          "POSIX ACL（`setfacl -m u:alice:rw file`）とマスク（`m::`）、拡張属性（`lsattr` / `chattr +i` で不変化）",
          "Linux Capabilities（`setcap cap_net_bind_service=+ep /usr/bin/myserver`）で root 全権を与えず特権のみ付与",
          "SELinux: Enforcing / Permissive / Disabled、コンテキスト（`user:role:type:level`）、`semanage fcontext` + `restorecon`、`setsebool -P`、`audit2allow`",
          "AppArmor: パスベースの MAC（`/etc/apparmor.d/`）、Enforce モードと Complain モード（`aa-enforce` / `aa-complain` / `aa-logprof`）",
        ],
        examTip: "SELinux は inode の拡張属性（ラベル）ベース、AppArmor はファイルパスベースという設計思想の違いが試験でよく問われます。",
      },
    ],
  },
  {
    id: "topic-334",
    exam: "303-300",
    number: "334",
    title: "ネットワークセキュリティ",
    englishTitle: "Network Security",
    accentColor: "amber",
    summary: "802.1X / FreeRADIUS 認証、NIDS（Snort / Suricata）、nftables / ipset による高度フィルタ、VPN（OpenVPN / IPsec / WireGuard）を学びます。",
    topics: [
      {
        id: "334-1",
        code: "334.1 - 334.4",
        title: "RADIUS・NIDS・nftables・VPN（OpenVPN/IPsec/WireGuard）",
        commands: ["radtest", "snort", "suricata", "nft", "ipset", "wg", "wg-quick", "swanctl"],
        keyPoints: [
          "FreeRADIUS（`/etc/raddb/`）による AAA（認証・認可・課金）と IEEE 802.1X（EAP）ポートベース認証",
          "NIDS（Snort / Suricata）のルール構文（`alert tcp any any -> $HOME_NET 22 (...)`）とインライン IPS モード",
          "`nftables`（`nft add table inet filter`, `nft add chain ...`, `nft list ruleset`）による IPv4/IPv6 統合（`inet`）フィルタリング",
          "VPN: OpenVPN（TLS/UDP or TCP）、IPsec（strongSwan / IKEv2 / ESP）、WireGuard（`wg` / 公開鍵ベースの軽量・高速カーネル実装）",
        ],
        examTip: "WireGuard は従来の設定ファイル中心から `wg` / `wg-quick` と公開鍵・`AllowedIPs` による簡潔な構成が特徴で V3.0 で重視されます。",
      },
    ],
  },
  {
    id: "topic-335",
    exam: "303-300",
    number: "335",
    title: "脅威と脆弱性評価",
    englishTitle: "Threats and Vulnerability Assessment",
    accentColor: "indigo",
    summary: "一般的なセキュリティ脆弱性（CVE/CVSS・OWASP・中間者攻撃等）と、ペネトレーションテスト・脆弱性診断手法を理解します。",
    topics: [
      {
        id: "335-1",
        code: "335.1 - 335.2",
        title: "脆弱性評価・ペネトレーションテスト・監査ツール",
        commands: ["nmap", "lynis", "openvas / gvm", "wireshark / tshark", "nikto"],
        keyPoints: [
          "脅威知識: CVE（共通脆弱性識別子）・CVSS スコア、中間者攻撃（MITM）、ARP スプーフィング、バッファオーバーフロー、インジェクション",
          "ペネトレーションテストの工程: 偵察（Reconnaissance）→ スキャン・列挙 → 脆弱性検証（Exploitation）→ 報告",
          "Nmap スキャン手法（`-sS` SYNスキャン、`-sU` UDP、`-sV` バージョン検出、`-O` OS検出、`--script vuln` NSEスクリプト）",
          "Lynis（`lynis audit system`）による Linux ホストのローカルセキュリティ監査・ハードニングスコア算出",
        ],
        examTip: "パッシブ偵察とアクティブスキャンの違い、および Nmap の SYN ステルススキャン（`-sS`）の仕組みは頻出です。",
      },
    ],
  },
];

export const lpic303Comparisons: LpicComparisonTable[] = [
  {
    id: "selinux-vs-apparmor",
    category: "アクセス制御",
    title: "強制アクセス制御（MAC）比較：SELinux vs AppArmor",
    subtitle: "LPIC-3 333.2 ラベルベースとパスベースの設計比較",
    columns: ["比較項目", "SELinux", "AppArmor"],
    rows: [
      { feature: "識別方式", values: ["inode 拡張属性のセキュリティコンテキスト（ラベル）", "ファイルの絶対パス名ベース"] },
      { feature: "動作モード", values: ["Enforcing / Permissive / Disabled", "Enforce / Complain（ログのみ記録）"] },
      { feature: "ファイル移動(mv)時の挙動", values: ["mv は元のラベルを保持（cp は親ディレクトリ継承）", "パスが変わると適用されるプロファイルが変わりうる"] },
      { feature: "主な管理コマンド", values: ["`getenforce`, `setenforce`, `semanage`, `restorecon`", "`aa-status`, `aa-enforce`, `aa-complain`, `aa-logprof`"] },
    ],
    decisionRule: "ファイルを `mv` した際に意図したコンテキストが付かないときは `restorecon -Rv` で再ラベル付けする（SELinux）。",
  },
  {
    id: "luks-vs-ecryptfs",
    category: "暗号化",
    title: "Linux 暗号化ストレージ比較（LUKS/dm-crypt vs eCryptfs）",
    subtitle: "LPIC-3 331.3 ブロック暗号化とスタック型暗号化",
    columns: ["比較項目", "LUKS / dm-crypt", "eCryptfs"],
    rows: [
      { feature: "暗号化レイヤー", values: ["ブロックデバイス単位（パーティション/LVM全体）", "ディレクトリ・ファイル単位（スタック型FS）"] },
      { feature: "利用場面", values: ["サーバ全体のディスク暗号化、交換・廃棄時の保護", "特定ユーザーのホームディレクトリ単位暗号化"] },
      { feature: "設定・管理", values: ["`cryptsetup` + `/etc/crypttab`", "`ecryptfs-mount-private` / `mount -t ecryptfs` / `ecryptfs-migrate-home`"] },
    ],
    decisionRule: "OS・Swap 含むディスク全体の保護には LUKS、ログイン時のみ復号したいユーザーホーム単位には eCryptfs（`ecryptfs-mount-private`）。",
  },
  {
    id: "openssl-pki-commands",
    category: "暗号化",
    title: "OpenSSL / X.509 PKI 証明書操作コマンド比較",
    subtitle: "LPIC-3 331.1 - 331.2 鍵・CSR 生成から TLS 検証・信頼登録まで",
    columns: ["コマンド", "主な役割", "代表オプション・用途"],
    rows: [
      { feature: "openssl req", values: ["秘密鍵・CSR・自己署名証明書生成", "`openssl req -new -x509`（ルートCA作成）、`-newkey` で秘密鍵と CSR を同時生成"] },
      { feature: "openssl x509", values: ["証明書確認・変換・署名", "`-text -noout` で内容確認、`-inform`/`-outform` で PEM/DER 変換、CSR 署名"] },
      { feature: "openssl s_client", values: ["TLS 接続・チェーン実機検証", "`-connect host:443 -showcerts` でサーバ証明書チェーン・暗号スイートを確認"] },
      { feature: "openssl verify", values: ["証明書チェーンの信頼検証", "`-CAfile ca.pem cert.pem` で指定 CA 配下の正当性を検証"] },
      { feature: "update-ca-trust", values: ["OS 信頼ストア更新 (RHEL系)", "`/etc/pki/ca-trust/source/anchors/` へ配置後に実行（Debian系は `update-ca-certificates`）"] },
    ],
    decisionRule: "証明書の生成は `openssl req`、内容確認や変換は `openssl x509`、稼働中 TLS サーバの接続検査は `openssl s_client` を使用。",
  },
  {
    id: "dns-security-comparison",
    category: "暗号化",
    title: "DNS セキュリティ機構と運用ツール比較（DNSSEC / Unbound / DoT / DoH）",
    subtitle: "LPIC-3 331.4 ゾーン署名・検証リゾルバ・通信路暗号化",
    columns: ["技術・コマンド", "保護する対象", "主な役割・代表オプション"],
    rows: [
      { feature: "dnssec-keygen", values: ["DNSSEC 署名鍵", "ゾーン署名用の ZSK（Zone Signing Key）および KSK（Key Signing Key `-f KSK`）を生成"] },
      { feature: "dnssec-signzone", values: ["DNS ゾーンファイル署名", "ゾーンへ RRSIG / DNSKEY / NSEC(3) レコードを付与し署名済みゾーンを作成"] },
      { feature: "delv", values: ["DNSSEC 検証確認", "ローカルの検証ロジックを用いて DNSSEC 信頼チェーンと署名の妥当性をテスト"] },
      { feature: "unbound", values: ["検証キャッシュ DNS リゾルバ", "DNSSEC 検証および DoT（TCP 853）転送に対応した高セキュリティキャッシュ DNS サーバ"] },
      { feature: "DANE / DoT / DoH", values: ["証明書ピン留め / 通信暗号化", "DANE（TLSA レコード）で証明書検証を補強し、DoT（TCP 853）/ DoH（HTTPS 443）でクエリを秘匿"] },
    ],
    decisionRule: "応答の改ざん防止は DNSSEC（`dnssec-keygen` / `dnssec-signzone` / `delv`）、通信自体の暗号化は DoT/DoH 対応のリゾルバ（`unbound` 等）で行う。",
  },
  {
    id: "host-hardening-audit",
    category: "ホストセキュリティ",
    title: "ホスト堅牢化・改ざん検知・監査コマンド比較",
    subtitle: "LPIC-3 332.1 - 332.2 カーネル設定・Secure Boot・AIDE・auditd",
    columns: ["コマンド / 機構", "分類", "主な役割・確認内容"],
    rows: [
      { feature: "sysctl", values: ["カーネル堅牢化", "`kernel.kptr_restrict`, `kernel.dmesg_restrict`, `kernel.randomize_va_space` (ASLR) 等の設定・参照"] },
      { feature: "mokutil", values: ["UEFI Secure Boot / MOK", "`mokutil --sb-state` で Secure Boot 有効状態の確認や Machine Owner Key 管理を実行"] },
      { feature: "aide", values: ["ファイル改ざん検知 (HIDS)", "`aide --init` でベースライン DB を作成し、`aide --check` でハッシュ・属性の変化を検知"] },
      { feature: "auditctl / ausearch / aureport", values: ["Linux Audit (`auditd`)", "`auditctl` で監視ルール定義、`ausearch -k` で監査イベント検索、`aureport` で認証/実行サマリ出力"] },
    ],
    decisionRule: "ファイル変更のベースライン比較は `aide`、カーネルレベルでのアクセス・特権実行のリアルタイム監査追跡は `auditctl` / `ausearch` / `aureport`。",
  },
  {
    id: "resource-control-comparison",
    category: "ホストセキュリティ",
    title: "プロセスリソース制限比較（systemd-run / cgroups vs ulimit）",
    subtitle: "LPIC-3 332.3 リソース消費制御とサンドボックス化",
    columns: ["比較項目", "systemd-run / systemd ユニット (cgroups)", "ulimit / PAM limits"],
    rows: [
      { feature: "制御単位と機構", values: ["カーネル cgroups によるサービス/スコープ単位の総量制限", "シェル・プロセス単位の POSIX リソース上限（`RLIMIT_*`）"] },
      { feature: "主な制限項目", values: ["`MemoryMax=`, `CPUQuota=`, `TasksMax=`, `ProtectSystem=`", "ファイル記述子数（`-n`）、ユーザープロセス数（`-u`）、コアサイズ（`-c`）"] },
      { feature: "即時実行・永続化", values: ["`systemd-run -p MemoryMax=512M <cmd>` / `.service` ファイル", "`ulimit -n 4096`（セッション一時適用）/ `/etc/security/limits.conf`"] },
    ],
    decisionRule: "特定コマンドを一時的に cgroups 上限付きで隔離実行するには `systemd-run`、ログインユーザーやシェルの開けるファイル数上限等には `ulimit` を使う。",
  },
  {
    id: "dac-acl-capabilities",
    category: "アクセス制御",
    title: "拡張 DAC（POSIX ACL）と Linux Capabilities 比較",
    subtitle: "LPIC-3 333.1 細粒度ファイル権限と最小特権の分離",
    columns: ["機構", "主要コマンド", "機能・使い分け"],
    rows: [
      { feature: "POSIX ACL", values: ["`getfacl` / `setfacl`", "`setfacl -m u:user:rw` で特定ユーザー/グループへ個別権限、`-d` でデフォルト ACL を付与し、`getfacl` で確認"] },
      { feature: "Linux Capabilities", values: ["`getcap` / `setcap`", "SUID root を使わず実行ファイルへ必要最小限の特権（例: `cap_net_bind_service=+ep`）のみ付与・参照"] },
      { feature: "拡張ファイル属性", values: ["`lsattr` / `chattr`", "`chattr +i`（Immutable）で root による上書き・削除も防止（`lsattr` で確認）"] },
    ],
    decisionRule: "通常の Unix 権限を超えた複数ユーザー/グループ別の細かい共有権は `setfacl` / `getfacl`、root 特権の分割付与は `setcap` / `getcap`。",
  },
  {
    id: "vpn-comparison",
    category: "ネットワーク",
    title: "VPN プロトコル・実装比較（OpenVPN / IPsec / WireGuard）",
    subtitle: "LPIC-3 334.4 トンネル方式・実装レイヤー",
    columns: ["VPN 技術", "動作レイヤー・基盤", "主な設定・管理特徴"],
    rows: [
      { feature: "OpenVPN", values: ["ユーザー空間（TUN/TAP）＋ TLS", "証明書(PKI)基盤でファイアウォール越え（TCP 443等）が容易"] },
      { feature: "IPsec (strongSwan)", values: ["カーネル XFRM（ESP/AH）＋ IKEv2", "標準規格でネットワーク機器（ルータ/FW）との拠点間 VPN に強く、`swanctl` で VICI 制御・確認"] },
      { feature: "WireGuard", values: ["Linux カーネル空間実装（UDP）", "公開鍵・`AllowedIPs` のみの超軽量・高速な最新暗号構成（`wg` / `wg-quick` で操作）"] },
    ],
    decisionRule: "ルータ間標準接続は IPsec（`swanctl`）、SSL 証明書・TCP 越え柔軟性は OpenVPN、高速・シンプル構成は WireGuard（`wg` / `wg-quick`）。",
  },
  {
    id: "network-ids-aaa",
    category: "ネットワーク",
    title: "ネットワーク認証（RADIUS）と NIDS/IPS（Snort / Suricata）比較",
    subtitle: "LPIC-3 334.1 - 334.2 AAA テストと不正通信検知",
    columns: ["ツール", "分類・プロトコル", "主な役割・特徴"],
    rows: [
      { feature: "FreeRADIUS (radtest)", values: ["AAA / IEEE 802.1X (EAP)", "ネットワーク認証・認可・課金を提供し、`radtest` で認証応答テストを実行"] },
      { feature: "Snort (snort)", values: ["シグネチャ型 NIDS / IPS", "ルール（`alert tcp any any -> $HOME_NET 22` 等）に基づき不審パケットを検知・遮断"] },
      { feature: "Suricata (suricata)", values: ["マルチスレッド NIDS / IPS / NSM", "マルチスレッドによる高速検査、Snort ルール互換、EVE JSON 形式の詳細イベント出力"] },
    ],
    decisionRule: "RADIUS 認証の疎通検証は `radtest`、マルチコア活用や構造化ログ出力が必要な NIDS/IPS 環境では `suricata`（または `snort`）を採用。",
  },
  {
    id: "nftables-vs-iptables",
    category: "ネットワーク",
    title: "パケットフィルタ比較（nftables vs iptables）",
    subtitle: "LPIC-3 334.3 テーブル統合とセット処理",
    columns: ["項目", "nftables (`nft`)", "iptables (`iptables` / `ipset`)"],
    rows: [
      { feature: "IPv4 / IPv6 管理", values: ["`inet` ファミリで IPv4 と IPv6 を単一ルールセット統合", "iptables と ip6tables を別々に管理"] },
      { feature: "ルール更新の原子性", values: ["トランザクション単位でアトミックに一括適用可能", "1ルールごとの追加・削除（iptables-restore は一括）"] },
      { feature: "大量 IP ブロック", values: ["ネイティブの Set / Map 構文を内蔵", "外部の `ipset` と `-m set` を組み合わせる"] },
    ],
    decisionRule: "`nftables` はフックを明示しない限りデフォルトでチェーンを作らないため、`type filter hook input priority 0;` 等を明示して構成する。",
  },
  {
    id: "vulnerability-assessment-tools",
    category: "脆弱性評価",
    title: "脆弱性評価・ローカル監査・パケット解析ツール比較",
    subtitle: "LPIC-3 335.2 ペネトレーションテストとセキュリティ診断の使い分け",
    columns: ["ツール", "診断対象・手法", "代表コマンド・特徴"],
    rows: [
      { feature: "Nmap (nmap)", values: ["ポートスキャン・サービス/OS 検出", "`nmap -sS`（SYN スキャン）、`-sV`、`-O`、`--script vuln` でネットワーク露出面を把握"] },
      { feature: "Lynis (lynis)", values: ["ローカル Linux ホスト監査", "`lynis audit system` で設定不備・カーネル・認証設定を検査しハードニング提案を出力"] },
      { feature: "OpenVAS / GVM", values: ["総合ネットワーク脆弱性スキャナ", "`openvas` / `gvm`（Greenbone Vulnerability Management）により CVE ベースで網羅的に脆弱性を検出"] },
      { feature: "Nikto (nikto)", values: ["Web サーバ脆弱性スキャナ", "`nikto -h <target>` で危険な CGI・デフォルトファイル・古いサーバ構成・ヘッダ不備を検査"] },
      { feature: "Wireshark / tshark", values: ["ネットワークパケット詳細解析", "GUI 解析の `wireshark` と、SSH 経由等で CLI キャプチャ・フィルタ解析する `tshark`"] },
    ],
    decisionRule: "ホスト内部の堅牢化監査は `lynis`、ポート/サービス特定は `nmap`、CVE ベースの網羅スキャンは `openvas`（`gvm`）、Web サーバ特化は `nikto`、通信実体の解析は `wireshark` / `tshark`。",
  },
];

export const lpic303Patterns: LpicWorkflowPattern[] = [
  {
    id: "selinux-troubleshoot",
    title: "SELinux 拒否トラブルシュートとコンテキスト修正フロー",
    badge: "333.2",
    flow: ["getenforce 確認", "ausearch -m avc -ts recent", "semanage fcontext -a", "restorecon -Rv <path>", "必要時 setsebool -P"],
    summary: "Web サーバ等を非標準ポート・非標準ディレクトリで動かす際の SELinux 拒否を安全に解決する標準手順です。",
    keyDesignPoints: [
      "まず `setenforce 0`（Permissive）で一時切り分けしても、本番で Disabled のまま放置しない",
      "`chcon` による変更は `restorecon` や再ラベルで元に戻るため、永続化には必ず `semanage fcontext` ＋ `restorecon` を使う",
      "`semanage port -a -t http_port_t -p tcp 8080` のように非標準ポートにもコンテキストを割り当てられる",
    ],
  },
  {
    id: "auditd-setup",
    title: "auditd による重要ファイル改ざん・特権コマンド監査フロー",
    badge: "332.2",
    flow: ["/etc/audit/rules.d/*.rules 記述", "augenrules --load", "auditctl -l で有効確認", "ausearch -k <key>", "aureport で要約"],
    summary: "`/etc/shadow` や `/etc/sudoers` へのアクセス・変更をカーネルレベルで追跡する監査基盤の構築手順です。",
    keyDesignPoints: [
      "`-w /etc/sudoers -p wa -k sudo_changes` のように書き込み(`w`)・属性変更(`a`)を監視対象にする",
      "`aureport -au`（認証結果）や `aureport -x`（実行ファイル別）で日々のセキュリティサマリを出力できる",
    ],
  },
  {
    id: "openssl-ca-flow",
    title: "OpenSSL による社内プライベート CA 構築とサーバ証明書署名",
    badge: "331.1",
    flow: ["CA 秘密鍵・自己署名ルート証明書作成", "サーバ秘密鍵 + CSR (SAN付) 生成", "CA で CSR に署名 (x509 / ca)", "クライアントへ CA 証明書信頼登録"],
    summary: "TLS 通信を検証するためのプライベート PKI 構築と証明書チェーン検証の基本手順です。",
    keyDesignPoints: [
      "モダンなブラウザ・クライアントでは CN だけでなく SAN（`subjectAltName = DNS:...`）の記載が必須",
      "OS の信頼ストアへの追加は RHEL 系なら `/etc/pki/ca-trust/source/anchors/` ＋ `update-ca-trust`、Debian 系なら `/usr/local/share/ca-certificates/` ＋ `update-ca-certificates`",
    ],
  },
  {
    id: "wireguard-tunnel",
    title: "WireGuard 拠点・クライアント VPN トンネル構築フロー",
    badge: "334.4",
    flow: ["wg genkey | tee priv | wg pubkey > pub", "/etc/wireguard/wg0.conf 作成", "AllowedIPs で経路制御", "wg-quick up wg0", "wg show でハンドシェイク確認"],
    summary: "軽量で高速な WireGuard を用いた暗号化トンネル構築の標準手順です。",
    keyDesignPoints: [
      "`AllowedIPs` は「暗号化対象として送る宛先IP」と「相手ピアから受信を許可する送信元IP（cryptokey routing）」の両方を意味する",
      "ゲートウェイとして転送する場合は `net.ipv4.ip_forward = 1` と `nftables`/`iptables` でのマスカレードが必要",
    ],
  },
];

export const lpic303Pitfalls: LpicPitfall[] = [
  {
    id: "pit303-1",
    trap: "SELinux で `chcon -t httpd_sys_content_t /srv/web` を実行したから設定が永続化されたと思う",
    whyWrong: "`chcon` は現在のファイルの拡張属性を一時変更するだけで、SELinux ポリシーDB（fcontext）には登録されないため、`restorecon` やシステム全体の再ラベル時に上書きされて元に戻る。",
    correctApproach: "永続化するには `semanage fcontext -a -t httpd_sys_content_t '/srv/web(/.*)?'` を登録した後に `restorecon -Rv /srv/web` を実行する。",
  },
  {
    id: "pit303-2",
    trap: "DNSSEC を有効化すれば DNS クエリの盗聴（プライバシー保護）も防げると思う",
    whyWrong: "DNSSEC はデジタル署名（RRSIG）によって DNS 応答の「改ざん・なりすまし」を検知する仕組みであり、通信内容自体は平文である。",
    correctApproach: "DNS クエリ通信の暗号化・秘匿化には DoT（DNS over TLS: 853）または DoH（DNS over HTTPS: 443）を使用する。",
  },
  {
    id: "pit303-3",
    trap: "SELinux でファイルを別ディレクトリへ `mv` したとき、移動先ディレクトリのデフォルトラベルが自動で付くと思う",
    whyWrong: "`cp` は新規作成のため移動先のデフォルトラベルを継承するが、`mv` は元の inode と拡張属性（元の SELinux ラベル）をそのまま移動先へ持ち込むためアクセス拒否の原因になる。",
    correctApproach: "設定ファイルやコンテンツを移動した後は `restorecon -v` を実行して適切なラベルへ戻す。",
  },
  {
    id: "pit303-4",
    trap: "AIDE データベースの `/var/lib/aide/aide.db.gz` を同じサーバの保護なしディレクトリへ置いたまま信頼する",
    whyWrong: "攻撃者が root 権限を奪取した場合、ファイル改ざんと同時にローカルの AIDE データベースも再生成・改ざんできてしまう。",
    correctApproach: "初期化した AIDE DB や署名済み基準ファイルは読み取り専用メディアや別ホスト（リモート）へ安全に退避し、比較時のみ参照する。",
  },
  {
    id: "pit303-5",
    trap: "Linux Capabilities を使うため実行ファイルに SUID (`chmod 4755`) と `setcap` を混同する",
    whyWrong: "SUID root はプロセスへ全特権を与えるため侵害時の被害が大きい。",
    correctApproach: "たとえば 1024 番未満ポートを開くだけなら `setcap 'cap_net_bind_service=+ep' /path/to/bin` とし、最小特権を徹底する。",
  },
  {
    id: "pit303-6",
    trap: "Nmap で `-sS`（SYN スキャン）を実行したのにログに一切残らないと過信する",
    whyWrong: "TCP 3ウェイハンドシェイクを完了させないためアプリケーション層の接続ログに残りにくいものの、IDS/IPS（Snort/Suricata）やファイアウォールログには SYN パケットの連続送信が検知される。",
    correctApproach: "IDS やパケット監視から見れば半開スキャンも容易に検知される点を理解しておく。",
  },
];

export const lpic303KeyPaths: LpicKeyPathFact[] = [
  { id: "kp303-1", target: "/etc/selinux/config", value: "SELinux モード設定", detail: "SELINUX=enforcing / permissive / disabled" },
  { id: "kp303-2", target: "/etc/apparmor.d/", value: "AppArmor プロファイル", detail: "パス単位でプログラムの許可リソースを制限" },
  { id: "kp303-3", target: "/etc/audit/rules.d/", value: "auditd 監査ルール", detail: "augenrules --load で統合反映" },
  { id: "kp303-4", target: "/etc/crypttab", value: "LUKS 起動時復号定義", detail: "デバイス UUID・鍵ファイル・オプションを記述" },
  { id: "kp303-5", target: "/etc/aide.conf", value: "AIDE 改ざん検知定義", detail: "監視対象パスとチェック項目（ハッシュ・権限等）" },
  { id: "kp303-6", target: "/etc/nftables.conf", value: "nftables ルール永続化", detail: "nft list ruleset の出力を保存・読み込み" },
  { id: "kp303-7", target: "/etc/wireguard/*.conf", value: "WireGuard 設定", detail: "wg-quick up <iface> でトンネル起動" },
  { id: "kp303-8", target: "TCP 853 (DoT) / 443 (DoH)", value: "DNS 暗号化ポート", detail: "DNSSEC とは異なり通信路を暗号化" },
];

export const lpic303QuickLookup: CertFlashcardItem[] = [
  {
    keyword: "HTTPS サーバがクライアントへ OCSP 応答を事前取得・添付して検証高速化とプライバシーを守る機能",
    category: "331: 暗号化・PKI",
    recommended: "OCSP Stapling",
    reason: "クライアントから CA の OCSP レスポンダへ直接問い合わせる負荷と通信履歴露出を減らせる。",
  },
  {
    keyword: "DNS の TLSA レコードを用いて特定ドメインの TLS 証明書や公開鍵を検証するプロトコル",
    category: "331: 暗号化・PKI",
    recommended: "DANE (DNS-Based Authentication of Named Entities)",
    reason: "DNSSEC で保護された DNS ゾーンの TLSA レコードにより CA 以外の信頼検証やピン留めを行える。",
  },
  {
    keyword: "OpenSSL で対象サーバの TLS 証明書チェーン・暗号スイート・検証結果を確認するコマンド",
    category: "331: 暗号化・PKI",
    recommended: "openssl s_client -connect host:443 -showcerts",
    reason: "STARTTLS を確認する場合は `-starttls smtp` 等を指定できる。",
  },
  {
    keyword: "LUKS で暗号化されたブロックデバイスを初期化・復号マッピングするコマンド",
    category: "331: 暗号化ストレージ",
    recommended: "cryptsetup luksFormat / luksOpen",
    reason: "起動時の自動復号マッピングは `/etc/crypttab` に定義する。",
  },
  {
    keyword: "ファイルのハッシュ値やパーミッション変化を基準 DB と比較して改ざんを検知するツール",
    category: "332: ホストセキュリティ",
    recommended: "AIDE (aide --init / --check)",
    reason: "初期状態データベースの改ざんを防ぐため、外部メディアや別サーバに退避するのが推奨される。",
  },
  {
    keyword: "Linux Audit システムで特定ファイルへの書き込みや属性変更を監視対象に追加するコマンド",
    category: "332: ホストセキュリティ",
    recommended: "auditctl -w <パス> -p wa -k <キー>",
    reason: "記録されたログの検索は `ausearch -k <キー>`、サマリ作成は `aureport`。",
  },
  {
    keyword: "UEFI Secure Boot の有効状態確認および MOK（Machine Owner Key）管理を行うコマンド",
    category: "332: ホストセキュリティ",
    recommended: "mokutil",
    reason: "`mokutil --sb-state` で Secure Boot 状態を確認できる。",
  },
  {
    keyword: "root 全権を与える代わりに、特定バイナリへ「1024番未満の特権ポートバインド権」だけを付与する",
    category: "333: アクセス制御",
    recommended: "setcap cap_net_bind_service=+ep <バイナリ>",
    reason: "確認は `getcap`、削除は `setcap -r`。",
  },
  {
    keyword: "SELinux のファイルコンテキスト規則を永続的に追加し、実際のファイルへ適用する2コマンド",
    category: "333: アクセス制御",
    recommended: "semanage fcontext -a → restorecon -Rv",
    reason: "`chcon` だけでは一時変更に留まるため、ポリシー登録と再ラベルをセットで行う。",
  },
  {
    keyword: "SELinux の AVC 拒否ログから許可ポリシーモジュール（.pp）のひな形を生成するコマンド",
    category: "333: アクセス制御",
    recommended: "audit2allow",
    reason: "ただし機械的な許可は過剰権限になりやすいため、先に fcontext や bool 設定で解決できないか検討する。",
  },
  {
    keyword: "AppArmor でプロファイルの拒否をせずログのみ記録する学習モード（Complain）へ切り替える",
    category: "333: アクセス制御",
    recommended: "aa-complain <プロファイル/パス>",
    reason: "強制モードへ戻すのは `aa-enforce`、ログから対話的にプロファイルを更新するのは `aa-logprof`。",
  },
  {
    keyword: "root を含む全ユーザーからのファイルの変更・削除・リネームを禁止する拡張属性",
    category: "333: アクセス制御",
    recommended: "chattr +i (Immutable)",
    reason: "追記のみ許可したい場合は `chattr +a`（Append only）、属性確認は `lsattr`。",
  },
  {
    keyword: "nftables で IPv4 と IPv6 の両方を 1 つのテーブルで統一的にフィルタリングするアドレスファミリ",
    category: "334: ネットワーク",
    recommended: "inet",
    reason: "`ip` は IPv4 のみ、`ip6` は IPv6 のみ、`inet` は両方を統合処理する。",
  },
  {
    keyword: "FreeRADIUS サーバの認証応答をローカルからコマンドラインでテストするユーティリティ",
    category: "334: ネットワーク",
    recommended: "radtest",
    reason: "ユーザー名・パスワード・RADIUS サーバ・ポート・共有シークレットを指定して Access-Accept を確認する。",
  },
  {
    keyword: "Suricata / Snort などのネットワーク侵入検知システムにおいて通信をリアルタイムに遮断できる動作モード",
    category: "334: ネットワーク",
    recommended: "IPS (インライン) モード",
    reason: "受動監視（IDS）ではなくネットワーク経路上に配置し `drop` / `reject` アクションでパケットを遮断する。",
  },
  {
    keyword: "WireGuard の設定ファイルで「相手の公開鍵に紐づけて許可・ルーティングする IP 範囲」を指定する項目",
    category: "334: ネットワーク",
    recommended: "AllowedIPs",
    reason: "暗号鍵ルーティング（Cryptokey Routing）の核となるディレクティブ。",
  },
  {
    keyword: "Nmap で TCP 3ウェイハンドシェイクを完了させずにポート状態を調べる高速ステルススキャン",
    category: "335: 脆弱性評価",
    recommended: "nmap -sS (SYN スキャン)",
    reason: "SYN を送り SYN/ACK が返れば開（open）と判断して RST を返し、接続を確立しない。",
  },
  {
    keyword: "Linux システムの設定不備やセキュリティ推奨事項をローカルで自動監査・スコア化するツール",
    category: "335: 脆弱性評価",
    recommended: "Lynis (lynis audit system)",
    reason: "カーネル設定・権限・サービス構成を検査しハードニングの提案を行う。",
  },
  {
    keyword: "特定ドメインに対して SSL/TLS 証明書の発行を許可する認証局（CA）を制限・明示する DNS レコード",
    category: "331: 暗号化・PKI",
    recommended: "CAA レコード",
    reason: "Certificate Authority Authorization により、意図しない CA からの不正証明書発行リスクを低減できる。",
  },
  {
    keyword: "BIND 等の DNS サーバ間でゾーン転送や動的更新（DDNS）を行う際、共有鍵と HMAC で通信を認証する仕組み",
    category: "331: 暗号化・PKI",
    recommended: "TSIG (Transaction Signature)",
    reason: "DNSSEC がクライアント向け応答署名であるのに対し、TSIG はサーバ間のゾーン転送や更新の認証に使う。",
  },
  {
    keyword: "systemd のスライスやサービスユニット単位で CPU・メモリ・I/O 消費量をリアルタイム監視するコマンド",
    category: "332: ホストセキュリティ",
    recommended: "systemd-cgtop",
    reason: "cgroup ツリーの階層構造を確認する `systemd-cgls` と併せて、リソース制限（MemoryMax 等）の効果検証に使う。",
  },
  {
    keyword: "Linux カーネルのアドレス空間配置ランダム化（ASLR）をスタック・ライブラリ・ヒープまで最大有効化する sysctl 設定",
    category: "332: ホストセキュリティ",
    recommended: "kernel.randomize_va_space = 2",
    reason: "0 は無効、1 は保守的（ヒープ除外）、2 は完全有効化であり、メモリ破壊攻撃への耐性を高める。",
  },
  {
    keyword: "Linux ファイルシステムの拡張属性（Extended Attributes: user.*, security.* 等）を設定・確認するコマンド",
    category: "333: アクセス制御",
    recommended: "setfattr / getfattr",
    reason: "`setfattr -n user.key -v val file` で属性を設定し、`getfattr -d file` で値を参照できる。",
  },
  {
    keyword: "多数の IP アドレスやネットワークをハッシュ等で高速管理し、iptables の単一ルールから一括照合する拡張",
    category: "334: ネットワーク",
    recommended: "ipset (-m set --match-set)",
    reason: "数千件のブロック対象 IP を個別の iptables ルールに展開せず、O(1) に近い高速照合で管理できる。",
  },
];

export const lpic303PracticeQuestions: CertQuestion[] = [
  {
    id: "q-331-1",
    domainId: "topic-331",
    domainLabel: "331: 暗号化",
    difficulty: "標準",
    selectCount: 1,
    question: "DNSSEC が提供するセキュリティ機能と、DNS 通信路そのものの暗号化に関する説明として正しいものはどれですか？",
    options: [
      "DNSSEC は公開鍵暗号を用いて DNS クエリと応答の内容を完全に秘匿（暗号化）する",
      "DNSSEC は電子署名により応答の正当性と非改ざん性を保証し、通信の暗号化は DoT や DoH が担う",
      "DoT（DNS over TLS）はデフォルトで UDP 53 番ポートを使用する",
      "TLSA レコードはファイアウォールのルールを自動配布するために使用される",
    ],
    correctIndices: [1],
    explanation:
      "DNSSEC（RRSIG/DNSKEY/DS）はデータの改ざん・なりすまし検知（完全性・真正性）を提供しますが暗号化はしません。通信経路の秘匿には DoT（TCP 853）や DoH（TCP 443）を使用します。",
    keywords: ["DNSSEC", "DoT", "DoH"],
  },
  {
    id: "q-331-2",
    domainId: "topic-331",
    domainLabel: "331: 暗号化",
    difficulty: "標準",
    selectCount: 1,
    question: "OpenSSL を使ってリモートサーバ `example.com:443` へ接続し、提示される TLS 証明書チェーン全体を表示して検証を行うコマンドはどれですか？",
    options: [
      "openssl x509 -connect example.com:443",
      "openssl s_client -connect example.com:443 -showcerts",
      "openssl req -verify example.com:443",
      "openssl ca -check example.com:443",
    ],
    correctIndices: [1],
    explanation:
      "`openssl s_client -connect <host>:<port> -showcerts` は TLS ハンドシェイクを実行し、サーバが返した証明書チェーンや検証結果を詳細に出力します。",
    keywords: ["openssl s_client", "TLS", "証明書チェーン"],
  },
  {
    id: "q-331-3",
    domainId: "topic-331",
    domainLabel: "331: 暗号化",
    difficulty: "基礎",
    selectCount: 1,
    question: "Linux においてブロックデバイス（パーティションや LV）全体を暗号化し、複数キースロットでパスフレーズ管理を行える標準仕組みはどれですか？",
    options: ["LUKS / dm-crypt", "eCryptfs", "umask", "chattr +e"],
    correctIndices: [0],
    explanation:
      "LUKS（Linux Unified Key Setup）は `cryptsetup` で管理するブロックデバイスレベルの標準暗号化仕様です。eCryptfs はディレクトリ・ファイル単位のスタック型暗号化です。",
    keywords: ["LUKS", "cryptsetup", "ブロック暗号化"],
  },
  {
    id: "q-331-4",
    domainId: "topic-331",
    domainLabel: "331: 暗号化",
    difficulty: "応用",
    selectCount: 2,
    question: "DNS のセキュリティ拡張や暗号認証（LPIC-3 331.4）に関する記述として正しいものを 2 つ選んでください。",
    options: [
      "`CAA` レコードは、そのドメインに対して TLS 証明書を発行できる認証局（CA）をドメイン管理者が制限するために用いられる",
      "`TSIG`（Transaction Signature）は、DNS のゾーン転送や動的更新において共有鍵と HMAC を用いて通信を認証する",
      "`NSEC3` レコードは DNS クエリと応答のペイロード全体を TLS 暗号化して盗聴を防ぐためのレコードである",
      "`Clevis` と `Tang` は BIND ゾーンファイルの自動再署名のみを行う専用スクリプト群である",
    ],
    correctIndices: [0, 1],
    explanation:
      "`CAA` レコードで証明書発行を許可する CA を指定でき、`TSIG` でプライマリ／セカンダリ間のゾーン転送（AXFR/IXFR）や動的更新を保護できます。なお `NSEC3` は DNSSEC においてゾーン列挙（Zone Walking）を防ぐためのハッシュ化不在証明レコードであり、通信暗号化ではありません。また `Clevis` / `Tang` は LUKS 暗号化ボリュームのネットワーク結合ディスク暗号化（NBDE）技術です。",
    keywords: ["CAA", "TSIG", "DNSSEC"],
  },
  {
    id: "q-332-1",
    domainId: "topic-332",
    domainLabel: "332: ホストセキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question: "Linux Audit システム（`auditd`）において、`/etc/shadow` への書き込み（`w`）および属性変更（`a`）を監視し、後で `ausearch -k shadow_mod` で検索できるようにする `auditctl` ルールはどれですか？",
    options: [
      "auditctl -w /etc/shadow -p wa -k shadow_mod",
      "auditctl -a /etc/shadow -m rw -t shadow_mod",
      "auditctl -f /etc/shadow --watch shadow_mod",
      "aureport -w /etc/shadow -k shadow_mod",
    ],
    correctIndices: [0],
    explanation:
      "`-w <パス>` で監視ファイル指定、`-p <r|w|x|a>` で監視操作（`w`=書込、`a`=属性変更）、`-k <キー名>` で検索用タグを指定します。",
    keywords: ["auditctl", "auditd", "ausearch"],
  },
  {
    id: "q-332-2",
    domainId: "topic-332",
    domainLabel: "332: ホストセキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question: "ファイル整合性チェッカー AIDE（Advanced Intrusion Detection Environment）の運用において、改ざん検知の信頼性を保つために最も重要なベストプラクティスはどれですか？",
    options: [
      "データベース（`aide.db`）を定期的に自動上書き更新し、常に最新状態に保つ",
      "初期化したベースライン DB や設定を保護された読み取り専用メディアまたは外部ホストに保管する",
      "AIDE チェック時のみ SELinux を Disabled にする",
      "`/tmp` と `/var/log` だけを監視対象に含める",
    ],
    correctIndices: [1],
    explanation:
      "侵入者がローカルの AIDE DB 自体を書き換えると改ざんを検知できなくなるため、基準 DB は読み取り専用媒体やオフライン/別サーバへ保管することが推奨されます。",
    keywords: ["AIDE", "改ざん検知"],
  },
  {
    id: "q-332-3",
    domainId: "topic-332",
    domainLabel: "332: ホストセキュリティ",
    difficulty: "標準",
    selectCount: 2,
    question: "systemd サービスユニットファイルにおいて、対象サービスのセキュリティサンドボックス化・リソース制限を行う設定ディレクティブとして正しいものを 2 つ選んでください。",
    options: [
      "`ProtectSystem=strict`（ルートファイルシステム大部分をサービスから読み取り専用にする）",
      "`MemoryMax=512M`（cgroups によりサービスの最大メモリ消費量を制限する）",
      "`AllowPrivilegeEscalation=always`（常に root 昇格を許可する）",
      "`KernelDisableASLR=yes`（アドレス空間配置のランダム化を無効化する）",
    ],
    correctIndices: [0, 1],
    explanation:
      "systemd では `ProtectSystem=strict`, `PrivateTmp=yes`, `NoNewPrivileges=yes`, `CapabilityBoundingSet=` 等のサンドボックス機能や、`MemoryMax=`, `CPUQuota=` 等の cgroups リソース制御を利用できます。",
    keywords: ["systemd サンドボックス", "ProtectSystem", "MemoryMax"],
  },
  {
    id: "q-332-4",
    domainId: "topic-332",
    domainLabel: "332: ホストセキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question: "Linux カーネルの `sysctl` 設定によって ASLR（アドレス空間配置のランダム化）をスタック・共有ライブラリ・ヒープ領域まで含めて最大限に有効化するパラメータ設定はどれですか？",
    options: [
      "kernel.randomize_va_space = 2",
      "kernel.randomize_va_space = 0",
      "kernel.kptr_restrict = 2",
      "fs.protected_symlinks = 1",
    ],
    correctIndices: [0],
    explanation:
      "`kernel.randomize_va_space` は ASLR を制御し、`0` が無効、`1` が保守的有効化、`2` がヒープ（brk）を含む完全ランダム化です。`kernel.kptr_restrict` は `/proc` 等でのカーネルアドレス表示制限、`fs.protected_symlinks` はシンボリックリンク悪用対策です。",
    keywords: ["ASLR", "sysctl", "randomize_va_space"],
  },
  {
    id: "q-333-1",
    domainId: "topic-333",
    domainLabel: "333: アクセス制御",
    difficulty: "標準",
    selectCount: 1,
    question: "SELinux が Enforcing モードの環境で、Web コンテンツ用に新しく作成した `/srv/myweb` ディレクトリへ `httpd_sys_content_t` タイプを永続的に設定・適用する正しい手順はどれですか？",
    options: [
      "`chcon -R -t httpd_sys_content_t /srv/myweb` のみ実行する",
      "`semanage fcontext -a -t httpd_sys_content_t '/srv/myweb(/.*)?'` 実行後に `restorecon -Rv /srv/myweb` を実行する",
      "`setsebool -P httpd_sys_content_t on` を実行する",
      "`aa-enforce /srv/myweb` を実行する",
    ],
    correctIndices: [1],
    explanation:
      "`chcon` は一時的な変更であり `restorecon` で元に戻ります。ポリシーに永続登録するには `semanage fcontext` でルールを追加した上で `restorecon` で適用します。",
    keywords: ["semanage fcontext", "restorecon", "SELinux"],
  },
  {
    id: "q-333-2",
    domainId: "topic-333",
    domainLabel: "333: アクセス制御",
    difficulty: "基礎",
    selectCount: 1,
    question: "Linux バイナリ `/usr/local/bin/myproxy` に SUID を付与せず、80 番や 443 番といった特権ポート（1024 未満）を一般ユーザー権限でバインドできるようにするコマンドはどれですか？",
    options: [
      "chmod u+s /usr/local/bin/myproxy",
      "setcap cap_net_bind_service=+ep /usr/local/bin/myproxy",
      "chattr +p /usr/local/bin/myproxy",
      "setfacl -m u:nobody:x /usr/local/bin/myproxy",
    ],
    correctIndices: [1],
    explanation:
      "Linux Capabilities の `cap_net_bind_service` を `setcap` で付与することで、他の root 特権を与えず最小権限で特権ポートを開けます。",
    keywords: ["Linux Capabilities", "setcap", "cap_net_bind_service"],
  },
  {
    id: "q-333-3",
    domainId: "topic-333",
    domainLabel: "333: アクセス制御",
    difficulty: "標準",
    selectCount: 1,
    question: "AppArmor に関する説明として正しいものはどれですか？",
    options: [
      "inode の拡張属性ラベルに基づいてアクセス制御を行うため、ファイルを mv しても設定が変わらない",
      "ファイルパスベースのプロファイルで制御し、Enforce モードと Complain モード（ログ記録のみ）を切り替えられる",
      "RHEL 系専用であり Debian/Ubuntu では動作しない",
      "root ユーザーに対しては一切の制限を適用できない",
    ],
    correctIndices: [1],
    explanation:
      "AppArmor はパスベースの MAC（強制アクセス制御）であり、`/etc/apparmor.d/` のプロファイルに従い `aa-enforce` / `aa-complain` でモードを制御します。",
    keywords: ["AppArmor", "aa-complain", "MAC"],
  },
  {
    id: "q-333-4",
    domainId: "topic-333",
    domainLabel: "333: アクセス制御",
    difficulty: "標準",
    selectCount: 1,
    question: "Linux ファイルシステム上の一般ユーザーが独自に定義・操作できる拡張属性（Extended Attributes）の名前空間（Namespace）および設定・取得コマンドの正しい組み合わせはどれですか？",
    options: [
      "`setfattr -n user.tag -v \"prod\" file` と `getfattr -d file`",
      "`setfacl -n attr.tag -v \"prod\" file` と `getfacl -d file`",
      "`chattr -n sys.tag=prod file` と `lsattr -d file`",
      "`setcap -n cap.tag=prod file` と `getcap -d file`",
    ],
    correctIndices: [0],
    explanation:
      "拡張属性には `user.*`、`trusted.*`、`security.*`、`system.*` の名前空間があり、一般ユーザーが任意メタデータを付与できるのは `user.*` です。操作には `setfattr` と `getfattr` を使用します。",
    keywords: ["setfattr", "getfattr", "拡張属性"],
  },
  {
    id: "q-334-1",
    domainId: "topic-334",
    domainLabel: "334: ネットワークセキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question: "`nftables` において、IPv4 と IPv6 の両方のパケットを 1 つのテーブルで統合的にフィルタリングする場合に指定するアドレスファミリはどれですか？",
    options: ["ip", "ip6", "inet", "bridge"],
    correctIndices: [2],
    explanation:
      "`inet` ファミリ（例: `nft add table inet myfilter`）を使うことで、IPv4 と IPv6 を単一のチェーン・ルールセットで扱えます。",
    keywords: ["nftables", "inet ファミリ"],
  },
  {
    id: "q-334-2",
    domainId: "topic-334",
    domainLabel: "334: ネットワークセキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question: "WireGuard の設定ファイルにおける `[Peer]` セクションの `AllowedIPs = 10.10.0.2/32, 192.168.50.0/24` の役割として正しいものはどれですか？",
    options: [
      "このピアから暗号化トンネル越しに受け入れる送信元 IP と、このピアへ向けてトンネルへルーティングする宛先 IP の両方を定義する",
      "SSH 接続を許可するポート番号の一覧を定義する",
      "VPN クライアントへ配布する DNS サーバアドレスのみを指定する",
      "OS 全体の iptables ルールを自動削除する IP を指定する",
    ],
    correctIndices: [0],
    explanation:
      "WireGuard の `AllowedIPs` は送信時のルーティング対象宛先と、受信時の送信元 IP フィルタ（Cryptokey Routing）の双方を制御します。",
    keywords: ["WireGuard", "AllowedIPs"],
  },
  {
    id: "q-334-3",
    domainId: "topic-334",
    domainLabel: "334: ネットワークセキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question: "FreeRADIUS の動作検証のため、テストユーザー `alice` の認証が正常に成功するかをコマンドラインから確認するコマンドはどれですか？",
    options: ["radtest", "ldapwhoami", "wbinfo -a", "auditctl -t"],
    correctIndices: [0],
    explanation:
      "`radtest <user> <password> <radius_host> <nas_port> <secret>` を使って RADIUS サーバの認証応答を確認できます。",
    keywords: ["FreeRADIUS", "radtest", "802.1X"],
  },
  {
    id: "q-334-4",
    domainId: "topic-334",
    domainLabel: "334: ネットワークセキュリティ",
    difficulty: "応用",
    selectCount: 2,
    question: "Netfilter（`iptables` / `ipset`）によるパケットフィルタリングおよび OpenVPN の動作モードに関する記述として正しいものを 2 つ選んでください。",
    options: [
      "`ipset` で多数の IP アドレスをハッシュセットとして管理すると、`iptables` の `-m set --match-set` で単一ルールから高速に照合・遮断できる",
      "OpenVPN で `dev tun` を指定すると L3 IP パケットを扱うルーティング型 VPN となり、`dev tap` を指定すると L2 フレームを扱うブリッジ型 VPN となる",
      "`iptables` でステートフルフィルタリングを構成する際、`--ctstate NEW` だけを許可しておけば戻り通信（`ESTABLISHED`）も自動的にすべて許可される",
      "Snort や Suricata のルールでは `alert` アクションのみが定義されており、パケット破棄（`drop`）は設定できない",
    ],
    correctIndices: [0, 1],
    explanation:
      "`ipset` は大量 IP リストの高速照合に有効です。また OpenVPN は `tun`（L3 ルーティング）と `tap`（L2 イーサネットブリッジ）を選択できます。なお `iptables` のステートフル制御では `ESTABLISHED,RELATED` の許可ルールが必要であり、IPS モードの Snort/Suricata では `drop` / `reject` アクションで遮断できます。",
    keywords: ["ipset", "OpenVPN", "tun / tap"],
  },
  {
    id: "q-335-1",
    domainId: "topic-335",
    domainLabel: "335: 脅威と脆弱性評価",
    difficulty: "基礎",
    selectCount: 1,
    question: "Nmap を用いて TCP 3ウェイハンドシェイクを最後まで完了させずにポートの開閉状態を高速に調査する SYN スキャンのオプションはどれですか？",
    options: ["-sT", "-sS", "-sU", "-sP"],
    correctIndices: [1],
    explanation:
      "`-sS` は TCP SYN ステルススキャン（半開スキャン）を実行します。`-sT` は完全な TCP 接続スキャン、`-sU` は UDP スキャンです。",
    keywords: ["nmap", "-sS", "SYNスキャン"],
  },
  {
    id: "q-335-2",
    domainId: "topic-335",
    domainLabel: "335: 脅威と脆弱性評価",
    difficulty: "標準",
    selectCount: 1,
    question: "Linux サーバ内部から OS 設定・パッケージ・サービス構成・ファイル権限などを包括的に検査し、セキュリティハードニングの推奨事項とスコアを出力するツールはどれですか？",
    options: ["Lynis (`lynis audit system`)", "Wireshark", "Squid", "tdbbackup"],
    correctIndices: [0],
    explanation:
      "Lynis は UNIX/Linux 向けのローカルセキュリティ監査・コンプライアンス評価ツールで、`lynis audit system` で詳細な改善ポイントとハードニングインデックスを確認できます。",
    keywords: ["Lynis", "セキュリティ監査"],
  },
  {
    id: "q-335-3",
    domainId: "topic-335",
    domainLabel: "335: 脅威と脆弱性評価",
    difficulty: "応用",
    selectCount: 2,
    question: "ペネトレーションテストおよび脆弱性管理において、正しい記述を 2 つ選んでください。",
    options: [
      "CVE は公表された既知の脆弱性に割り当てられる一意の識別子、CVSS はその深刻度を数値評価する指標である",
      "脆弱性スキャン（例: OpenVAS/GVM）で検出された結果には誤検知（False Positive）が含まれる可能性があるため精査が必要である",
      "Nmap の SYN スキャン（`-sS`）はファイアウォールや NIDS でも完全に検知不可能なステルス通信である",
      "ペネトレーションテストでは対象システムの所有者による事前の許可やスコープ合意は不要である",
    ],
    correctIndices: [0, 1],
    explanation:
      "CVE（脆弱性ID）と CVSS（深刻度スコア）の役割、およびスキャナ出力に対する誤検知の検証は脆弱性評価の基本です。なお侵入テストは必ず事前の書面許諾とスコープ合意の上で実施し、SYN スキャンも IDS で検知されます。",
    keywords: ["CVE", "CVSS", "脆弱性評価"],
  },
  {
    id: "q-335-4",
    domainId: "topic-335",
    domainLabel: "335: 脅威と脆弱性評価",
    difficulty: "標準",
    selectCount: 1,
    question: "Nmap を用いて対象ホスト上で稼働しているサービスのバージョン情報を特定しつつ、NSE（Nmap Scripting Engine）の脆弱性検査用カテゴリのスクリプトを同時に実行するコマンドはどれですか？",
    options: [
      "nmap -sV --script vuln <target>",
      "nmap -sL --no-script <target>",
      "nmap -sn --ping-scan <target>",
      "nmap -sP --version-disable <target>",
    ],
    correctIndices: [0],
    explanation:
      "`-sV` は開いているポート上のサービス／バージョン検出を行い、`--script vuln` は NSE の `vuln` カテゴリに分類された既知脆弱性チェック用スクリプトを実行します（事前に所有者の書面許可を得た上で実施します）。",
    keywords: ["nmap", "NSE", "-sV"],
  },
];

// 出典: Linux Professional Institute (LPI) 公式リソース
export const lpic303OfficialResources: LpicOfficialResource[] = [
  {
    title: "LPI 公式 LPIC-3 Security (303) 概要",
    description: "LPIC-3 303-300 試験の公式概要、前提資格、認定要件です。",
    url: "https://www.lpi.org/our-certifications/lpic-3-303-overview",
    badge: "公式",
  },
  {
    title: "LPIC-303 Objectives V3.0（英語一次情報）",
    description: "Topic 331〜335 の詳細出題項目・重要ファイル・コマンド一覧です。",
    url: "https://wiki.lpi.org/wiki/LPIC-303_Objectives_V3.0",
    badge: "試験範囲",
  },
  {
    title: "LPIC-3 303 Objectives V3.0（日本語訳）",
    description: "LPI Wiki で公開されている Exam 303 Version 3.0 の日本語版試験範囲です。",
    url: "https://wiki.lpi.org/wiki/LPIC-3_303_Objectives_V3.0(JA)",
    badge: "日本語範囲",
  },
];
