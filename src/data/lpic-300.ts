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

export interface Lpic300Domain {
  id: string;
  exam: "300-300";
  number: string;
  title: string;
  englishTitle: string;
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  summary: string;
  topics: LpicTopicItem[];
}

// 出典: Linux Professional Institute (LPI) LPIC-3 Mixed Environments Version 3.0 (Exam 300-300) 公式試験概要・Objectives
export const lpic300ExamFacts: CertExamFact[] = [
  { label: "対象試験", value: "300-300", detail: "1科目合格で LPIC-3 認定" },
  { label: "試験時間", value: "90 分", detail: "選択・記述（穴埋め）混在" },
  { label: "問題数", value: "60 問", detail: "エンタープライズ混在環境" },
  { label: "合格ライン", value: "500 点", detail: "200〜800 点スケール" },
  { label: "前提資格", value: "LPIC-2 保持", detail: "有効な LPIC-2 認定が必要" },
  { label: "受験形式", value: "ピアソンVUE", detail: "テストセンター / OnVUE（5年間有効）" },
];

// 出典: LPI LPIC-300 Objectives V3.0 (Topic 301 - 305)
export const lpic300Domains: Lpic300Domain[] = [
  {
    id: "topic-301",
    exam: "300-300",
    number: "301",
    title: "Samba の基礎",
    englishTitle: "Samba Basics",
    accentColor: "indigo",
    summary: "Samba のアーキテクチャ・主要デーモン（smbd / nmbd / winbindd / samba）・smb.conf 構文・TDB データベースの保守を学びます。",
    topics: [
      {
        id: "301-1",
        code: "301.1 - 301.3",
        title: "Samba 概念・設定・定期メンテナンス",
        commands: ["smbd", "nmbd", "winbindd", "samba", "testparm", "smbstatus", "tdbbackup", "smbcontrol"],
        keyPoints: [
          "smbd（SMB/CIFS ファイル・印刷共有・TCP 445/139）、nmbd（NetBIOS 名前解決・UDP 137/138）、winbindd（AD/NT ユーザー・グループ解決）の役割",
          "Active Directory ドメインコントローラとして稼働する場合は統合デーモン `samba` が起動し、内部で smbd 等を制御する",
          "`testparm` で `/etc/samba/smb.conf` の構文検証、`smbstatus` で現在の接続・ファイルロック状況を確認",
          "`tdbbackup` / `tdbdump` / `tdbtool` による Samba 内部 Trivial Database（.tdb）のバックアップと整合性チェック",
        ],
        examTip: "スタンドアロン/メンバーサーバでは `smbd` + `nmbd` + `winbindd`、AD DC モードでは `samba` デーモンを起動する点が問われます。",
      },
    ],
  },
  {
    id: "topic-302",
    exam: "300-300",
    number: "302",
    title: "Samba と Active Directory ドメイン",
    englishTitle: "Samba and Active Directory Domains",
    accentColor: "cyan",
    summary: "Samba AD ドメインコントローラの構築・DNS/Kerberos 連携・ユーザー/グループ/GPO 管理・AD ドメイン参加を習得します。",
    topics: [
      {
        id: "302-1",
        code: "302.1 - 302.3",
        title: "Samba AD DC 構築・名前解決・AD ユーザー管理",
        commands: ["samba-tool domain provision", "samba-tool user", "samba-tool dns", "kinit", "klist"],
        keyPoints: [
          "`samba-tool domain provision` で新規 AD ドメインを構築（サーバーロール DC、内部 DNS または BIND9_DLZ を選択）",
          "AD には正確な時刻同期（NTP/chrony）と SRV レコード（`_ldap._tcp`, `_kerberos._tcp`）を含む DNS、および Kerberos（`/etc/krb5.conf`）が不可欠",
          "`samba-tool user create / list / delete` や `samba-tool group`、`samba-tool gpo` で AD オブジェクトとグループポリシーを管理",
        ],
        examTip: "AD DC 構築後は生成された `krb5.conf` を `/etc/krb5.conf` へ配置し、`kinit administrator` で TGT 取得を確認する手順が定番です。",
      },
      {
        id: "302-2",
        code: "302.4 - 302.5",
        title: "ドメインメンバー参加とローカルユーザー管理",
        commands: ["net ads join", "net ads testjoin", "wbinfo", "pdbedit", "smbpasswd"],
        keyPoints: [
          "ドメインメンバー参加: `smb.conf` で `security = ads` と `realm`・`workgroup` を設定し、`net ads join -U Administrator` を実行",
          "`wbinfo -u` / `-g` で winbind 経由の AD ユーザー・グループ一覧確認、`wbinfo -t` で信頼シークレットの検証",
          "ローカル SAM DB（passdb backend = tdbsam）管理には `pdbedit -L`（一覧）や `smbpasswd -a` を使用",
        ],
        examTip: "`smb.conf` の `idmap config`（tdb / rid / ad バックエンド）による SID と Linux UID/GID のマッピング方式は頻出です。",
      },
    ],
  },
  {
    id: "topic-303",
    exam: "300-300",
    number: "303",
    title: "Samba 共有の設定",
    englishTitle: "Samba Share Configuration",
    accentColor: "emerald",
    summary: "ファイル共有・POSIX/Windows NT ACL マッピング・DFS（分散ファイルシステム）・プリント共有を網羅します。",
    topics: [
      {
        id: "303-1",
        code: "303.1 - 303.4",
        title: "ファイル共有セキュリティ・ACL・DFS・印刷共有",
        commands: ["vfs_acl_xattr", "setfacl", "getfacl", "net rpc rights", "smb.conf"],
        keyPoints: [
          "共有パラメータ: `valid users`, `read only`, `write list`, `browseable`, `create mask`, `directory mask`, `hosts allow`",
          "Windows NT ACL を拡張属性（xattr）で保持するため `vfs objects = acl_xattr` と `map acl inherit = yes` を設定",
          "DFS 共有: `[global]` で `host msdfs = yes`、共有側で `msdfs root = yes` を指定し、`msdfs:server\\share` 形式のシンボリックリンクを作成",
          "CUPS 連携プリント共有（`printing = cups`, `[printers]`, `[print$]` によるドライバ自動配布）",
        ],
        examTip: "共有レベルのアクセス制限（`valid users` 等）とファイルシステムレベルの権限（POSIX/NT ACL）の両方が AND で適用される点に注意。",
      },
    ],
  },
  {
    id: "topic-304",
    exam: "300-300",
    number: "304",
    title: "Samba クライアントの設定",
    englishTitle: "Samba Client Configuration",
    accentColor: "amber",
    summary: "SSSD / Winbind / PAM / NSS による Linux 認証統合、CIFS クライアントマウント、Windows 側からの連携設定を学びます。",
    topics: [
      {
        id: "304-1",
        code: "304.1 - 304.3",
        title: "SSSD・Winbind 認証統合と CIFS クライアント",
        commands: ["realm join", "sssd.conf", "mount.cifs", "smbclient", "pam_mkhomedir"],
        keyPoints: [
          "`realmd`（`realm join`）と `sssd`（`/etc/sssd/sssd.conf`, 権限 600）を用いて Linux クライアントを AD ドメインへ統合",
          "`/etc/nsswitch.conf` の `passwd` / `group` 行に `winbind` または `sss` を追加し、PAM で `pam_winbind.so` / `pam_sss.so` + `pam_mkhomedir.so` を構成",
          "`mount -t cifs //server/share /mnt -o username=...,vers=3.0,credentials=/root/.smbcred` で安全にマウント",
          "`smbclient -L //server` で共有一覧表示、`smbget` でコマンドライン取得",
        ],
        examTip: "`sssd.conf` のパーミッションは `600`（所有者 root）でないと `sssd` サービスが起動を拒否します。",
      },
    ],
  },
  {
    id: "topic-305",
    exam: "300-300",
    number: "305",
    title: "Linux ID 管理とファイル共有",
    englishTitle: "Linux Identity Management and File Sharing",
    accentColor: "indigo",
    summary: "FreeIPA による一元 ID・認証・認可管理、FreeIPA と Active Directory の信頼関係、NFSv4 + Kerberos 認証を習得します。",
    topics: [
      {
        id: "305-1",
        code: "305.1 - 305.4",
        title: "FreeIPA 運用・AD 信頼・NFSv4 + Kerberos",
        commands: ["ipa-server-install", "ipa-client-install", "ipa user-add", "ipa hbactest", "ipa trust-add", "mount -t nfs4"],
        keyPoints: [
          "FreeIPA は 389 Directory Server（LDAP）・MIT Kerberos・Dogtag PKI・BIND（任意）・NTP を統合した Linux 向け ID 管理基盤",
          "`ipa` コマンドでユーザー・ホストグループ・HBAC（Host-Based Access Control）・SUDO ルールを一元管理",
          "`ipa trust-add` により FreeIPA レルムと Active Directory フォレスト間のクロスレルム信頼（AD Trust）を構築可能",
          "NFSv4（ポート 2049 単一ポート）では `/etc/exports` に `sec=krb5` / `krb5i`（整合性）/ `krb5p`（暗号化）を指定して Kerberos 認証・暗号化を実現",
        ],
        examTip: "NFSv4 のセキュリティフレーバー `krb5`（認証のみ）・`krb5i`（認証＋改ざん検知）・`krb5p`（認証＋通信暗号化）の区別は超頻出です。",
      },
    ],
  },
];

export const lpic300Comparisons: LpicComparisonTable[] = [
  {
    id: "samba-daemons",
    category: "Samba 基礎",
    title: "Samba 主要デーモンと実行モード比較",
    subtitle: "LPIC-3 301.1 デーモン別の役割・ポート・起動形態",
    columns: ["デーモン", "主な役割", "代表ポート", "起動モード"],
    rows: [
      { feature: "smbd", values: ["SMB/CIFS ファイル・印刷共有、認証・ロック制御", "TCP 445 / 139", "スタンドアロン / メンバー（AD DC時は内部起動）"] },
      { feature: "nmbd", values: ["NetBIOS 名前解決・ブラウジングサービス", "UDP 137 / 138", "スタンドアロン / メンバー（AD DC時は不要）"] },
      { feature: "winbindd", values: ["Windows/AD ユーザー・グループの NSS/PAM 解決、idmap", "ローカルソケット / RPC", "ドメインメンバー（AD DC時は内部起動）"] },
      { feature: "samba", values: ["AD DC 統合プロセス（KDC / LDAP / DNS / smbd 管理）", "LDAP 389, Kerberos 88, DNS 53 等", "Active Directory ドメインコントローラ専用"] },
    ],
    decisionRule: "AD DC として立てる場合は `samba` サービスのみを有効化し、`smbd`/`nmbd`/`winbind` を個別に同時起動しない。",
  },
  {
    id: "sssd-vs-winbind",
    category: "クライアント認証",
    title: "Linux AD 統合クライアント比較（SSSD vs Winbind）",
    subtitle: "LPIC-3 304.1 / 305 認証バックエンド選定",
    columns: ["比較項目", "SSSD (System Security Services Daemon)", "Winbind (winbindd)"],
    rows: [
      { feature: "主な対応バックエンド", values: ["AD / FreeIPA / LDAP / Kerberos を統一管理", "Active Directory / NT4 ドメイン / Samba"] },
      { feature: "オフラインキャッシュ", values: ["標準で強力な資格情報・エントリキャッシュあり", "設定（winbind offline logon = yes）で対応"] },
      { feature: "Samba ファイルサーバ連携", values: ["一部制限あり（純粋な AD メンバー共有は Winbind 推奨の場合あり）", "Samba の idmap / ACL と最も親和性が高い"] },
      { feature: "設定ファイルと権限", values: ["/etc/sssd/sssd.conf（パーミッション 600 必須）", "/etc/samba/smb.conf（idmap config 等）"] },
    ],
    decisionRule: "Linux クライアントログイン・FreeIPA 環境は SSSD（`realm join`）、Samba ファイル共有サーバでの AD 連携は Winbind。",
  },
  {
    id: "acl-mapping",
    category: "共有と権限",
    title: "Samba ファイル共有における ACL 方式比較",
    subtitle: "LPIC-3 303.2 POSIX ACL vs Windows NT ACL",
    columns: ["方式", "使用する設定 / コマンド", "特徴・適用場面"],
    rows: [
      { feature: "POSIX ACL", values: ["`setfacl` / `getfacl`（ファイルシステム標準ACL）", "Linux ローカル側と共有側の権限をそのまま一致させたい場合"] },
      { feature: "Windows NT ACL (xattr)", values: ["`vfs objects = acl_xattr` + `map acl inherit = yes`", "Windows エクスプローラから継承・詳細権限（Full/Modify等）を正確に保持したい場合"] },
    ],
    decisionRule: "Windows クライアント主体の共有サーバで細かな継承・所有者権限を扱う場合は `acl_xattr` VFS モジュールが必須。",
  },
  {
    id: "smb-vs-nfsv4",
    category: "ファイル共有",
    title: "エンタープライズ共有比較（SMB3 vs NFSv4 + Kerberos）",
    subtitle: "LPIC-3 304.2 / 305.4 プロトコル特性",
    columns: ["項目", "SMB / CIFS (mount.cifs)", "NFSv4 + Kerberos"],
    rows: [
      { feature: "主な対象", values: ["Windows / macOS / Linux 混在環境", "Linux / UNIX 系および FreeIPA 環境"] },
      { feature: "暗号化・認証オプション", values: ["SMB3 暗号化（`smb encrypt`）・Kerberos(`sec=krb5`)", "`sec=krb5`（認証）/`krb5i`（整合性）/`krb5p`（暗号化）"] },
      { feature: "使用ポート", values: ["TCP 445", "TCP 2049（単一ポートでファイアウォール透過性高）"] },
    ],
    decisionRule: "Windows 混在共有は SMB3（CIFS）、Linux 同士＋FreeIPA 一元認証のセキュア共有は NFSv4（`sec=krb5p`）。",
  },
];

export const lpic300Patterns: LpicWorkflowPattern[] = [
  {
    id: "samba-ad-dc",
    title: "Samba Active Directory ドメインコントローラ構築フロー",
    badge: "302.1",
    flow: ["時刻同期(chrony)確認", "既存 smb.conf 退避", "samba-tool domain provision", "krb5.conf 配置", "samba サービス起動", "kinit / smbclient で検証"],
    summary: "Linux 上に新規 Active Directory フォレスト/ドメインコントローラを構築する標準フローです。",
    keyDesignPoints: [
      "プロビジョニング前に既存の `/etc/samba/smb.conf` が残っていると失敗するため事前に削除・退避する",
      "プロビジョニング時に生成された `krb5.conf` を `/etc/krb5.conf` へコピーし、`/etc/resolv.conf` が自サーバ DNS を向くよう設定する",
      "`host -t SRV _ldap._tcp.<domain>` で AD 用 DNS レコードの自動登録を検証する",
    ],
  },
  {
    id: "linux-ad-join",
    title: "Linux クライアントの AD 参加（realmd + SSSD）フロー",
    badge: "304.1",
    flow: ["DNS(AD向き)設定", "realm discover <domain>", "realm join -U Admin <domain>", "sssd.conf 調整", "id user@domain で確認"],
    summary: "Linux サーバを既存 Active Directory に参加させ、AD アカウントで SSH/sudo ログイン可能にする手順です。",
    keyDesignPoints: [
      "`realm join` は Samba / SSSD / Kerberos の必要な設定とマシンアカウント登録を自動化してくれる",
      "短縮名（`@domain` なし）でログインさせたい場合は `sssd.conf` の `use_fully_qualified_names = False` を設定する",
      "初回ログイン時のホームディレクトリ自動作成には `pam_mkhomedir.so`（または `oddjob-mkhomedir`）を有効にする",
    ],
  },
  {
    id: "samba-xattr-share",
    title: "Windows ACL 互換の Samba 共有ディレクトリ構成",
    badge: "303.1 - 303.2",
    flow: ["smb.conf に vfs objects = acl_xattr", "共有ディレクトリ作成・権限付与", "SeDiskOperatorPrivilege 付与", "Windows から権限設定"],
    summary: "Windows 管理者がファイルサーバのフォルダ権限を GUI（セキュリティタブ）から安全に管理できるようにする手順です。",
    keyDesignPoints: [
      "`net rpc rights grant \"DOMAIN\\Domain Admins\" SeDiskOperatorPrivilege` で管理者グループへ共有権限変更権を付与する",
      "基礎の Linux ファイルシステムが `user_xattr` と `acl` をサポートしている必要がある（ext4/XFS は標準対応）",
    ],
  },
  {
    id: "freeipa-nfsv4",
    title: "FreeIPA ＋ Kerberos 認証付き NFSv4 共有フロー",
    badge: "305.1 - 305.4",
    flow: ["ipa-client-install", "ipa service-add nfs/<host>", "ipa-getkeytab で keytab 取得", "/etc/exports に sec=krb5p", "mount -t nfs4 -o sec=krb5p"],
    summary: "FreeIPA 管理下の Linux クライアント間で、ホストIP偽装を防ぎ暗号化された NFSv4 マウントを実現する構成です。",
    keyDesignPoints: [
      "NFS サーバ・クライアント双方で時刻同期がずれていると Kerberos チケット検証に失敗する（許容誤差通常 5 分以内）",
      "`/etc/krb5.keytab` に `nfs/<FQDN>` プリンシパルの鍵を登録し、`rpc.gssd`（クライアント）/`rpc.svcgssd` または `gssproxy` を稼働させる",
    ],
  },
];

export const lpic300Pitfalls: LpicPitfall[] = [
  {
    id: "pit300-1",
    trap: "Samba を AD ドメインコントローラとしてプロビジョニングした後に `systemctl start smbd nmbd` を実行する",
    whyWrong: "AD DC モードでは単一の統合デーモン `samba` が内部で SMB・LDAP・KDC・RPC サーバをまとめて管理するため、`smbd` 等を別起動すると競合して失敗する。",
    correctApproach: "AD DC では `smbd` / `nmbd` / `winbind` を停止・無効化し、`samba`（`samba-ad-dc`）サービスのみを起動する。",
  },
  {
    id: "pit300-2",
    trap: "`/etc/sssd/sssd.conf` を作成・編集した際に権限を `644` のまま `systemctl start sssd` する",
    whyWrong: "`sssd.conf` にはバインドパスワード等の機密設定が含まれうるため、所有者が root かつパーミッションが `0600` でないと起動時にエラーで拒否される。",
    correctApproach: "必ず `chown root:root /etc/sssd/sssd.conf && chmod 600 /etc/sssd/sssd.conf` を設定する。",
  },
  {
    id: "pit300-3",
    trap: "`/etc/fstab` に CIFS マウントのユーザー名とパスワードを平文で直接記述する",
    whyWrong: "`/etc/fstab` は一般ユーザーも読み取り可能（644）であるため、認証情報が全ユーザーへ漏洩する。",
    correctApproach: "`chmod 600 /root/.smbcred` のようなクレデンシャルファイルを作成し、fstab には `credentials=/root/.smbcred` オプションを指定する。",
  },
  {
    id: "pit300-4",
    trap: "Samba AD ドメインメンバー構成で `idmap config` の範囲（range）をドメイン間で重複させる",
    whyWrong: "`idmap config *`（デフォルト領域）と `idmap config MYDOM` の UID/GID 範囲が重なると、SID と UID のマッピングが衝突しファイル所有権が破損する。",
    correctApproach: "デフォルトドメイン `*` 用（例: `3000-7999`）と参加ドメイン用（例: `10000-999999`）で絶対に重複しない範囲を指定する。",
  },
  {
    id: "pit300-5",
    trap: "NFSv4 で `sec=krb5` を指定しただけで通信データ自体も暗号化されていると思い込む",
    whyWrong: "`sec=krb5` は Kerberos による「認証」のみを行い、ファイルデータ本体は平文で流れる。",
    correctApproach: "改ざん検知には `sec=krb5i`、データ通信の暗号化まで行うには `sec=krb5p`（Privacy）を指定する。",
  },
  {
    id: "pit300-6",
    trap: "FreeIPA 環境で直接 `useradd` や `passwd` を実行したり、`/etc/hosts` の不整合のまま構築する",
    whyWrong: "FreeIPA の ID 管理・Kerberos・DNS は FQDN と双方向名前解決（正引き・逆引き）および NTP 時刻同期に強く依存している。",
    correctApproach: "構築前にホスト名を FQDN に設定し、時刻同期と名前解決を整えたうえで、`ipa user-add` 等の FreeIPA コマンドで管理する。",
  },
];

export const lpic300KeyPaths: LpicKeyPathFact[] = [
  { id: "kp300-1", target: "/etc/samba/smb.conf", value: "Samba メイン設定", detail: "testparm で文法検査、-v でデフォルト含む全設定確認" },
  { id: "kp300-2", target: "/etc/krb5.conf", value: "Kerberos クライアント設定", detail: "default_realm, kdc, admin_server 等を定義" },
  { id: "kp300-3", target: "/etc/sssd/sssd.conf", value: "SSSD 設定（0600必須）", detail: "AD / FreeIPA / LDAP ドメインの認証とキャッシュを制御" },
  { id: "kp300-4", target: "/var/lib/samba/", value: "Samba TDB / LDB 保存先", detail: "tdbbackup で内部データベースを安全にバックアップ" },
  { id: "kp300-5", target: "TCP 445 / UDP 137-138", value: "SMB / NetBIOS ポート", detail: "SMB over TCP は 445、NetBIOS 名解決は 137/138" },
  { id: "kp300-6", target: "sec=krb5 / 5i / 5p", value: "NFSv4 Kerberos 強度", detail: "krb5=認証 / krb5i=整合性 / krb5p=暗号化" },
  { id: "kp300-7", target: "vfs objects = acl_xattr", value: "Windows NT ACL 保持", detail: "拡張属性に Windows セキュリティ記述子を格納" },
  { id: "kp300-8", target: "msdfs root = yes", value: "Samba DFS 共有有効化", detail: "[global] の host msdfs = yes と組み合わせて使用" },
];

export const lpic300QuickLookup: CertFlashcardItem[] = [
  {
    keyword: "Samba を Active Directory ドメインコントローラとして新規構築するコマンド",
    category: "302: Samba と AD",
    recommended: "samba-tool domain provision",
    reason: "対話形式またはオプション指定で AD ドメイン・Kerberos・DNS 設定を一括生成する。",
  },
  {
    keyword: "Samba ドメインメンバーを既存の Active Directory ドメインへ参加させるコマンド",
    category: "302: Samba と AD",
    recommended: "net ads join -U Administrator",
    reason: "参加状態の確認は `net ads testjoin`、Kerberos 連携には `security = ads` が必要。",
  },
  {
    keyword: "Samba の内部 Trivial Database (.tdb) を稼働中のまま安全にバックアップするコマンド",
    category: "301: Samba 基礎",
    recommended: "tdbbackup",
    reason: "TDB ロック整合性を保ちながら `.tdb` ファイルのバックアップと整合性チェック（`-v`）を行える。",
  },
  {
    keyword: "Windows クライアントの細かい NT ACL と継承情報を Linux 上で保持する Samba VFS モジュール",
    category: "303: Samba 共有",
    recommended: "acl_xattr (vfs objects = acl_xattr)",
    reason: "Linux ファイルシステムの拡張属性（xattr）に Windows ACL を格納する。",
  },
  {
    keyword: "Samba 共有上で Windows 管理者へ共有権限・ACL 変更特権を付与するコマンド",
    category: "303: Samba 共有",
    recommended: "net rpc rights grant",
    reason: "`SeDiskOperatorPrivilege` 特権を付与することで Windows ツールからの共有管理が可能になる。",
  },
  {
    keyword: "Samba 共有において複数サーバの共有を単一名前空間へ統合する仕組みと必須パラメータ",
    category: "303: Samba 共有",
    recommended: "DFS (host msdfs = yes / msdfs root = yes)",
    reason: "共有ディレクトリ内に `msdfs:server\\share` 形式のシンボリックリンクを配置して誘導する。",
  },
  {
    keyword: "winbindd 経由で Active Directory 側のユーザー・グループ一覧や信頼関係を確認するコマンド",
    category: "302: Samba と AD",
    recommended: "wbinfo (-u / -g / -t)",
    reason: "`getent passwd` が NSS 経由の確認であるのに対し、`wbinfo` は winbindd への直接確認に使う。",
  },
  {
    keyword: "Linux で `/etc/samba/smb.conf` の設定が有効かどうかと現在の接続状況を確認する2つのコマンド",
    category: "301: Samba 基礎",
    recommended: "testparm / smbstatus",
    reason: "`testparm` は構文検証、`smbstatus` は現在の接続クライアント・共有・ロック一覧表示。",
  },
  {
    keyword: "SSSD を利用して Linux ホストを Active Directory または FreeIPA ドメインへ簡単に参加させる CLI",
    category: "304: Samba クライアント",
    recommended: "realm join (realmd)",
    reason: "事前のドメイン検索は `realm discover`、一覧確認は `realm list`。",
  },
  {
    keyword: "SSSD の設定ファイル `/etc/sssd/sssd.conf` に要求される必須パーミッション",
    category: "304: Samba クライアント",
    recommended: "0600 (所有者 root:root)",
    reason: "権限が緩いとセキュリティ上 sssd サービスが起動を拒否する。",
  },
  {
    keyword: "CIFS 共有を `/etc/fstab` からパスワードを露出せずにマウントするためのオプション",
    category: "304: Samba クライアント",
    recommended: "credentials=/path/to/file",
    reason: "username/password を別ファイル（0600）へ分離して fstab から参照させる。",
  },
  {
    keyword: "ドメインユーザーの初回ログイン時に Linux 上へホームディレクトリを自動作成する PAM モジュール",
    category: "304: Samba クライアント",
    recommended: "pam_mkhomedir.so",
    reason: "セッションスタック（`session required pam_mkhomedir.so`）に記述して `/etc/skel` から作成する。",
  },
  {
    keyword: "FreeIPA サーバを構築するコマンドおよびクライアントを参加させるコマンド",
    category: "305: FreeIPA / NFS",
    recommended: "ipa-server-install / ipa-client-install",
    reason: "FreeIPA は 389 DS・MIT Kerberos・Dogtag CA 等を一括統合セットアップする。",
  },
  {
    keyword: "FreeIPA と Active Directory 間でクロスレルム信頼関係を構築するコマンド",
    category: "305: FreeIPA / NFS",
    recommended: "ipa trust-add",
    reason: "AD 側のユーザー・グループが FreeIPA 管理下の Linux リソースへアクセスできるようになる。",
  },
  {
    keyword: "FreeIPA において「どのユーザーがどのホストへどのサービスでアクセスできるか」を制御する機能",
    category: "305: FreeIPA / NFS",
    recommended: "HBAC (Host-Based Access Control)",
    reason: "`ipa hbacrule-add` で定義し、`ipa hbactest` で事前にアクセス可否をシミュレーションできる。",
  },
  {
    keyword: "NFSv4 マウントで Kerberos 認証に加えて通信データの暗号化も有効にするセキュリティオプション",
    category: "305: FreeIPA / NFS",
    recommended: "sec=krb5p",
    reason: "`krb5` は認証のみ、`krb5i` は整合性検証付き、`krb5p` はペイロード暗号化付き。",
  },
  {
    keyword: "Linux 上で現在の Kerberos TGT（Ticket Granting Ticket）を取得・確認するコマンド",
    category: "302 / 305: Kerberos",
    recommended: "kinit / klist",
    reason: "チケットの破棄には `kdestroy` を使用する。",
  },
  {
    keyword: "Samba で稼働中のデーモンへ設定再読み込みやデバッグレベル変更のメッセージを送るコマンド",
    category: "301: Samba 基礎",
    recommended: "smbcontrol",
    reason: "例: `smbcontrol all reload-config` や `smbcontrol smbd debug 3`。",
  },
  {
    keyword: "Samba AD ドメインコントローラのディレクトリデータベース（sam.ldb）の整合性を検査・修復するコマンド",
    category: "301: Samba 基礎",
    recommended: "samba-tool dbcheck (--fix)",
    reason: "AD オブジェクト間のリンク不整合などを検出し、--cross-ncs オプションで全名前空間を検査できる。",
  },
  {
    keyword: "Samba AD DC が保持する LDB（LDAP互換）データベースをコマンドラインから検索・照会するコマンド",
    category: "301: Samba 基礎",
    recommended: "ldbsearch -H /var/lib/samba/private/sam.ldb",
    reason: "tdbdump/tdbtool が .tdb 用であるのに対し、AD オブジェクトを格納する LDB の参照には ldbsearch/ldbedit を使用する。",
  },
  {
    keyword: "ローカルの Samba パスワードデータベース（tdbsam）に登録されたユーザーを一覧・詳細管理するコマンド",
    category: "302: Samba と AD",
    recommended: "pdbedit (-L / -v / -a)",
    reason: "smbpasswd でもパスワード設定やユーザー追加は可能だが、pdbedit はフラグや SID・プロファイルパス等の詳細管理を行える。",
  },
  {
    keyword: "Winbind で Windows SID と Linux UID/GID を対応付ける主な 2 つのバックエンド（AD属性利用 vs 決定論的算出）",
    category: "302: Samba と AD",
    recommended: "ad (idmap_ad) / rid (idmap_rid)",
    reason: "AD 側の RFC 2307 属性（uidNumber/gidNumber）を使う場合は ad、AD に属性を入れず RID から一意計算する場合は rid を選ぶ。",
  },
  {
    keyword: "Samba プリント共有で Windows クライアント用ドライバを配布する特殊共有と、スプール処理を効率化するデーモン",
    category: "303: Samba 共有",
    recommended: "[print$] / spoolssd",
    reason: "[print$] に各アーキテクチャ向けドライバを配置し、spoolssd（rpc_daemon:spoolssd = fork）で大量の印刷リクエストを処理する。",
  },
  {
    keyword: "NFSv4 で擬似ファイルシステムのルートを指定するエクスポート設定と、名前ベース ID マッピングの設定ファイル",
    category: "305: FreeIPA / NFS",
    recommended: "fsid=0 (/etc/exports) / /etc/idmapd.conf",
    reason: "NFSv4 は fsid=0 を起点とした単一ツリーで公開し、idmapd.conf の Domain をサーバ・クライアント間で一致させて UID/GID を解決する。",
  },
];

export const lpic300PracticeQuestions: CertQuestion[] = [
  {
    id: "q-301-1",
    domainId: "topic-301",
    domainLabel: "301: Samba の基礎",
    difficulty: "標準",
    selectCount: 1,
    question: "Samba を Active Directory ドメインコントローラ（AD DC）として構成・起動する際に使用するメインデーモンはどれですか？",
    options: ["smbd のみ", "nmbd と winbindd", "samba", "sssd"],
    correctIndices: [2],
    explanation:
      "AD DC モードでは統合デーモンである `samba` を起動します。`samba` が内部で SMB・LDAP・KDC・RPC 等のプロセスを管理するため、従来の `smbd` / `nmbd` を個別起動しません。",
    keywords: ["samba デーモン", "AD DC", "smbd"],
  },
  {
    id: "q-301-2",
    domainId: "topic-301",
    domainLabel: "301: Samba の基礎",
    difficulty: "基礎",
    selectCount: 1,
    question: "稼働中の Samba サーバにおける現在のクライアント接続一覧、開かれている共有、およびファイルロック状況を確認するコマンドはどれですか？",
    options: ["testparm", "smbstatus", "tdbbackup", "nmblookup"],
    correctIndices: [1],
    explanation:
      "`smbstatus` は現在の SMB 接続、開かれているファイル、ロック状態を表示します。`testparm` は `smb.conf` の構文検証コマンドです。",
    keywords: ["smbstatus", "testparm"],
  },
  {
    id: "q-301-3",
    domainId: "topic-301",
    domainLabel: "301: Samba の基礎",
    difficulty: "標準",
    selectCount: 1,
    question: "Samba が内部で管理する `.tdb` データベースファイルを、サービス稼働中でも整合性を保ったままバックアップできるコマンドはどれですか？",
    options: ["tdbbackup", "smbpasswd", "pdbedit -b", "rsync --tdb"],
    correctIndices: [0],
    explanation:
      "`tdbbackup` は TDB ファイルの内部ロックを取得して安全なバックアップを作成します。`-v` オプションで既存 TDB の整合性検証・自動復旧にも使えます。",
    keywords: ["tdbbackup", "TDB"],
  },
  {
    id: "q-301-4",
    domainId: "topic-301",
    domainLabel: "301: Samba の基礎",
    difficulty: "応用",
    selectCount: 2,
    question: "Samba Active Directory ドメインコントローラや内部データベースのトラブルシューティング（LPIC-3 301.4）に関する記述として正しいものを 2 つ選んでください。",
    options: [
      "`samba-tool dbcheck` を用いると、AD ディレクトリデータベースの整合性検査および `--fix` による修復を行える",
      "`ldbsearch` を用いると、Samba AD の LDB データベース（`sam.ldb` 等）から LDAP クエリ形式でオブジェクトを検索できる",
      "`smb.conf` の `log level` では全体一律の数値しか指定できず、認証（auth）などサブシステム別のログレベル設定は行えない",
      "`tdbdump` は Linux カーネルの SELinux AVC 拒否ログを解析してポリシーを自動生成するコマンドである",
    ],
    correctIndices: [0, 1],
    explanation:
      "Samba AD DC の整合性確認には `samba-tool dbcheck`、LDB データベース参照には `ldbsearch` を使用します。なお `log level = 1 auth:5 winbind:3` のようにデバッグクラス別レベル指定が可能で、`tdbdump` は TDB ファイルの内容出力コマンドです。",
    keywords: ["samba-tool dbcheck", "ldbsearch", "トラブルシューティング"],
  },
  {
    id: "q-302-1",
    domainId: "topic-302",
    domainLabel: "302: Samba と AD ドメイン",
    difficulty: "標準",
    selectCount: 1,
    question: "Samba を新規 Active Directory ドメインコントローラとしてプロビジョニングするコマンドはどれですか？",
    options: [
      "net ads join domain",
      "samba-tool domain provision",
      "ipa-server-install --ad",
      "smbpasswd --provision",
    ],
    correctIndices: [1],
    explanation:
      "`samba-tool domain provision` を実行することで、新規 AD ドメイン用の `smb.conf`、LDB データベース、Kerberos 設定、DNS ゾーンが生成されます。",
    keywords: ["samba-tool", "domain provision"],
  },
  {
    id: "q-302-2",
    domainId: "topic-302",
    domainLabel: "302: Samba と AD ドメイン",
    difficulty: "標準",
    selectCount: 1,
    question: "Linux サーバを Samba ドメインメンバーとして既存の Active Directory（`security = ads`）へ参加させるコマンドはどれですか？",
    options: [
      "samba-tool domain join member",
      "net ads join -U Administrator",
      "wbinfo --join",
      "kinit -j Administrator",
    ],
    correctIndices: [1],
    explanation:
      "ドメインメンバーとしての参加には `net ads join -U <管理者名>` を使用し、`net ads testjoin` で参加状態を検証します。",
    keywords: ["net ads join", "ドメインメンバー"],
  },
  {
    id: "q-302-3",
    domainId: "topic-302",
    domainLabel: "302: Samba と AD ドメイン",
    difficulty: "応用",
    selectCount: 2,
    question: "Samba AD ドメインの動作および Kerberos 認証において、必須となる前提条件・インフラ要素を 2 つ選んでください。",
    options: [
      "正確な時刻同期（NTP / chrony による数分以内の同期）",
      "SRV レコード（_ldap._tcp や _kerberos._tcp）を解決できる DNS 環境",
      "全クライアントへの NFSv3 エクスポート公開",
      "SELinux の完全無効化（Disabled）",
    ],
    correctIndices: [0, 1],
    explanation:
      "Active Directory（Kerberos 認証）は時刻ずれに厳格であり NTP 時刻同期が必須です。またクライアントや DC がお互いを発見するため DNS の SRV レコード解決が不可欠です。",
    keywords: ["NTP", "DNS SRV", "Kerberos"],
  },
  {
    id: "q-302-4",
    domainId: "topic-302",
    domainLabel: "302: Samba と AD ドメイン",
    difficulty: "標準",
    selectCount: 1,
    question: "Samba ドメインメンバーの Winbind ID マッピング（`idmap config`）において、Active Directory 側のユーザー／グループオブジェクトに設定された RFC 2307 属性（`uidNumber` / `gidNumber`）をそのまま Linux の UID/GID として使用するバックエンドはどれですか？",
    options: [
      "ad (idmap_ad)",
      "rid (idmap_rid)",
      "tdb (idmap_tdb)",
      "autorid (idmap_autorid)",
    ],
    correctIndices: [0],
    explanation:
      "`idmap_ad`（`backend = ad`）は AD 内の RFC 2307 POSIX 属性（`uidNumber`, `gidNumber` 等）を参照して UID/GID を決定します。AD にそれらの属性を持たせず SID の RID から決定論的に算出する場合は `rid`（または複数ドメイン向けの `autorid`）、ローカル割り当てには `tdb` を使用します。",
    keywords: ["idmap_ad", "idmap_rid", "Winbind"],
  },
  {
    id: "q-303-1",
    domainId: "topic-303",
    domainLabel: "303: Samba 共有の設定",
    difficulty: "標準",
    selectCount: 1,
    question: "Samba のファイル共有で Windows クライアントが設定する複雑な NT ACL や継承フラグを Linux の拡張属性（xattr）として保持するために必要な VFS モジュール設定はどれですか？",
    options: [
      "vfs objects = acl_xattr",
      "vfs objects = recycle",
      "nt acl support = false",
      "posix acl = strict",
    ],
    correctIndices: [0],
    explanation:
      "`vfs objects = acl_xattr`（多くの場合 `map acl inherit = yes` を併用）を設定することで、Windows セキュリティ記述子をファイルシステムの拡張属性に保存できます。",
    keywords: ["acl_xattr", "vfs objects", "Windows ACL"],
  },
  {
    id: "q-303-2",
    domainId: "topic-303",
    domainLabel: "303: Samba 共有の設定",
    difficulty: "標準",
    selectCount: 1,
    question: "Samba で DFS（分散ファイルシステム）ルート共有を有効にする際、`[global]` セクションと対象共有セクションにそれぞれ指定するパラメータの組み合わせはどれですか？",
    options: [
      "[global] に host msdfs = yes、共有に msdfs root = yes",
      "[global] に dfs enable = yes、共有に dfs share = yes",
      "[global] に wide links = no、共有に follow symlinks = no",
      "[global] に browseable = yes、共有に public = yes",
    ],
    correctIndices: [0],
    explanation:
      "Samba で DFS を機能させるには `[global]` で `host msdfs = yes` を有効にし、DFS ルートとなる共有セクションに `msdfs root = yes` を記述します。",
    keywords: ["DFS", "host msdfs", "msdfs root"],
  },
  {
    id: "q-303-3",
    domainId: "topic-303",
    domainLabel: "303: Samba 共有の設定",
    difficulty: "応用",
    selectCount: 1,
    question: "Samba 共有 `[project]` に `valid users = @dev` と `read only = no` を設定し、さらに Linux 側のディレクトリパーミッションが `0755`（所有者 root:root）である場合、`dev` グループの一般ユーザーは新規ファイルを作成できますか？",
    options: [
      "Samba の read only = no が優先されるため作成できる",
      "Linux ファイルシステム側の書き込み権限（w）がないため作成できない",
      "valid users に書かれていれば root 権限で作成される",
      "Windows クライアントからであれば作成できる",
    ],
    correctIndices: [1],
    explanation:
      "Samba は共有設定（`valid users`, `read only` 等）のチェックを通過した後に、実際の OS（Linux ファイルシステム）の権限でアクセスするため、両方で許可されている必要があります。",
    keywords: ["valid users", "POSIX 権限", "アクセス制御"],
  },
  {
    id: "q-303-4",
    domainId: "topic-303",
    domainLabel: "303: Samba 共有の設定",
    difficulty: "標準",
    selectCount: 1,
    question: "Samba で CUPS 連携プリント共有（`printing = cups`）を構成し、Windows クライアントへプリンタドライバを自動配布する仕組みにおいて、ドライバファイルを格納する共有セクション名と、プリントスプール処理を効率化するために起動する専用デーモンの組み合わせはどれですか？",
    options: [
      "`[print$]` と `spoolssd`",
      "`[drivers$]` と `nmbd`",
      "`[cups$]` と `winbindd`",
      "`[printers]` と `tdbbackup`",
    ],
    correctIndices: [0],
    explanation:
      "Windows 向けプリンタドライバの格納・自動ダウンロード（Point and Print）には特殊共有 `[print$]` を使用します。また大量の印刷ジョブ・RPC 要求を高速に処理するために専用のプリフォークデーモン `spoolssd`（`rpc_daemon:spoolssd = fork`）を利用できます。",
    keywords: ["[print$]", "spoolssd", "CUPS プリント共有"],
  },
  {
    id: "q-304-1",
    domainId: "topic-304",
    domainLabel: "304: Samba クライアントの設定",
    difficulty: "標準",
    selectCount: 1,
    question: "SSSD を利用している Linux クライアントが起動せずログに権限エラーが出ています。`/etc/sssd/sssd.conf` に対して設定すべき正しい所有者とパーミッションはどれですか？",
    options: [
      "root:root / 644",
      "root:root / 600",
      "sssd:sssd / 755",
      "root:wheel / 640",
    ],
    correctIndices: [1],
    explanation:
      "`/etc/sssd/sssd.conf` は所有者が `root:root`、パーミッションが `0600`（所有者のみ読み書き可）でないとセキュリティ上の理由で `sssd` が起動を拒否します。",
    keywords: ["sssd.conf", "0600", "SSSD"],
  },
  {
    id: "q-304-2",
    domainId: "topic-304",
    domainLabel: "304: Samba クライアントの設定",
    difficulty: "基礎",
    selectCount: 1,
    question: "Linux から SMB 共有 `//filesrv/share` を `/mnt/share` へ安全にマウントする際、`/etc/fstab` に認証情報を直書きせずに別ファイルへ分離するマウントオプションはどれですか？",
    options: [
      "authfile=/root/.smbcred",
      "credentials=/root/.smbcred",
      "keytab=/root/.smbcred",
      "passfile=/root/.smbcred",
    ],
    correctIndices: [1],
    explanation:
      "`mount.cifs` では `credentials=/path/to/file` オプションで `username=...` / `password=...` を書いた `0600` ファイルを指定します。",
    keywords: ["mount.cifs", "credentials", "fstab"],
  },
  {
    id: "q-304-3",
    domainId: "topic-304",
    domainLabel: "304: Samba クライアントの設定",
    difficulty: "標準",
    selectCount: 1,
    question: "AD や FreeIPA などの集中認証ユーザーが Linux クライアントへ初めてログインした際、ローカルにホームディレクトリがなければ自動作成させる PAM モジュールはどれですか？",
    options: [
      "pam_unix.so",
      "pam_mkhomedir.so",
      "pam_limits.so",
      "pam_listfile.so",
    ],
    correctIndices: [1],
    explanation:
      "PAM の `session` スタックに `pam_mkhomedir.so`（または `oddjobd` 経由の `pam_oddjob_mkhomedir.so`）を組み込むことで、初回ログイン時に `/etc/skel` からホームディレクトリを自動生成します。",
    keywords: ["pam_mkhomedir.so", "PAM", "ホームディレクトリ"],
  },
  {
    id: "q-304-4",
    domainId: "topic-304",
    domainLabel: "304: Samba クライアントの設定",
    difficulty: "応用",
    selectCount: 2,
    question: "Linux における CIFS/SMB クライアントマウント（`mount.cifs`）および混在環境の Windows クライアント運用に関する記述として正しいものを 2 つ選んでください。",
    options: [
      "`mount.cifs` で `vers=3.0` 以上を指定して `seal` オプションを付与すると、SMB レベルでの通信データ暗号化が有効になる",
      "`mount.cifs` で `multiuser` オプションを指定すると、マウント後に各ローカルユーザーが自身の Kerberos 等の資格情報で共有へアクセスできる",
      "Windows クライアントが Samba AD ドメインからグループポリシー（GPO）を取得・適用するには、Windows 側へ `sssd` サービスを導入する必要がある",
      "セキュリティ向上のため、Linux クライアントの `mount.cifs` ではデフォルトでレガシーな `vers=1.0` を固定指定することが推奨されている",
    ],
    correctIndices: [0, 1],
    explanation:
      "`seal` は SMB3 以降の通信暗号化を要求するマウントオプションであり、`multiuser` は複数ユーザーが各自の資格情報（`sec=krb5` 等）で同一マウントを利用できるようにします。Windows クライアントの GPO 適用は OS 標準機能で SYSVOL 共有から取得するため Linux 用 `sssd` は不要です。また `vers=1.0`（SMB1）は脆弱性のため非推奨です。",
    keywords: ["mount.cifs", "seal", "multiuser"],
  },
  {
    id: "q-305-1",
    domainId: "topic-305",
    domainLabel: "305: Linux ID 管理と共有",
    difficulty: "標準",
    selectCount: 1,
    question: "FreeIPA において、どのユーザー（グループ）がどのホストに対してどのサービス（SSH や sudo 等）でアクセス可能かを集中管理し、`ipa hbactest` で検証できる仕組みはどれですか？",
    options: [
      "HBAC (Host-Based Access Control)",
      "DAC (Discretionary Access Control)",
      "DFS (Distributed File System)",
      "GPO (Group Policy Object)",
    ],
    correctIndices: [0],
    explanation:
      "FreeIPA は HBAC（Host-Based Access Control）ルールによって「誰が・どのホストへ・どのサービスでログインできるか」をきめ細かく制御し、`ipa hbactest` でテストできます。",
    keywords: ["FreeIPA", "HBAC", "ipa hbactest"],
  },
  {
    id: "q-305-2",
    domainId: "topic-305",
    domainLabel: "305: Linux ID 管理と共有",
    difficulty: "標準",
    selectCount: 1,
    question: "FreeIPA で管理している Linux 環境と既存の Active Directory フォレストとの間にクロスレルム信頼関係を構築するコマンドはどれですか？",
    options: [
      "ipa trust-add",
      "net ads trust",
      "samba-tool forest link",
      "realm trust-create",
    ],
    correctIndices: [0],
    explanation:
      "`ipa trust-add <ADドメイン名> --admin=...` により FreeIPA と Active Directory の間に信頼関係（Trust）を確立できます。",
    keywords: ["FreeIPA", "ipa trust-add", "AD信頼"],
  },
  {
    id: "q-305-3",
    domainId: "topic-305",
    domainLabel: "305: Linux ID 管理と共有",
    difficulty: "標準",
    selectCount: 2,
    question: "NFSv4 エクスポートおよびマウント時のセキュリティオプション（`sec=`）について、正しい説明を 2 つ選んでください。",
    options: [
      "`sec=krb5p` は Kerberos 認証に加えて転送されるデータ通信も暗号化する",
      "`sec=krb5i` は認証に加えてデータ改ざん検知（整合性チェック）を行う",
      "`sec=krb5` はすべてのファイルデータを AES-256 で自動暗号化する",
      "`sec=sys` は Kerberos チケットを用いた相互認証を行う",
    ],
    correctIndices: [0, 1],
    explanation:
      "`sec=krb5` は認証のみ、`sec=krb5i`（Integrity）は認証＋改ざんチェック、`sec=krb5p`（Privacy）は認証＋通信全体の暗号化を行います。`sec=sys` は従来の UID/GID ベースの認証です。",
    keywords: ["NFSv4", "krb5p", "krb5i"],
  },
  {
    id: "q-305-4",
    domainId: "topic-305",
    domainLabel: "305: Linux ID 管理と共有",
    difficulty: "標準",
    selectCount: 1,
    question: "NFSv4 サーバを `/etc/exports` で構成する際、すべての公開ディレクトリを束ねる仮想的な擬似ファイルシステム（Pseudo File System）のルートとして指定するオプションはどれですか？",
    options: [
      "fsid=0",
      "all_squash",
      "no_root_squash",
      "sec=sys",
    ],
    correctIndices: [0],
    explanation:
      "NFSv4 では `/etc/exports` でルートとなるディレクトリに `fsid=0`（または `fsid=root`）を指定し、配下の公開ディレクトリを単一の仮想ツリーとしてクライアントへ見せます。またクライアントとサーバ間のユーザー名／グループ名マッピングは `/etc/idmapd.conf` の `Domain` 設定で行います。",
    keywords: ["NFSv4", "fsid=0", "擬似ファイルシステム"],
  },
];

// 出典: Linux Professional Institute (LPI) 公式リソース
export const lpic300OfficialResources: LpicOfficialResource[] = [
  {
    title: "LPI 公式 LPIC-3 Mixed Environments (300) 概要",
    description: "LPIC-3 300-300 試験の公式概要、前提資格、認定要件です。",
    url: "https://www.lpi.org/our-certifications/lpic-3-300-overview",
    badge: "公式",
  },
  {
    title: "LPIC-300 Objectives V3.0（英語一次情報）",
    description: "Topic 301〜305 の詳細出題項目・重要ファイル・コマンド一覧です。",
    url: "https://wiki.lpi.org/wiki/LPIC-300_Objectives_V3.0",
    badge: "試験範囲",
  },
  {
    title: "LPIC-3 300 Objectives V3.0（日本語訳）",
    description: "LPI Wiki で公開されている Exam 300 Version 3.0 の日本語版試験範囲です。",
    url: "https://wiki.lpi.org/wiki/LPIC-3_300_Objectives_V3.0(JA)",
    badge: "日本語範囲",
  },
];
