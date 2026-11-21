import type {
  CertExamFact,
  CertFlashcardItem,
  CertQuestion,
} from "@/components/certification/types";

export interface LpicTopicItem {
  id: string;
  code: string;
  title: string;
  commands: string[];
  keyPoints: string[];
  examTip: string;
}

export interface LpicDomain {
  id: string;
  exam: "101-500" | "102-500";
  number: string;
  title: string;
  englishTitle: string;
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  summary: string;
  topics: LpicTopicItem[];
}

export interface LpicComparisonRow {
  feature: string;
  values: string[];
}

export interface LpicComparisonTable {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  columns: string[];
  rows: LpicComparisonRow[];
  decisionRule: string;
}

export interface LpicWorkflowPattern {
  id: string;
  title: string;
  badge: string;
  flow: string[];
  summary: string;
  keyDesignPoints: string[];
}

export interface LpicPitfall {
  id: string;
  trap: string;
  whyWrong: string;
  correctApproach: string;
}

export interface LpicKeyPathFact {
  id: string;
  target: string;
  value: string;
  detail: string;
}

export interface LpicOfficialResource {
  title: string;
  description: string;
  url: string;
  badge: string;
}

// 出典: Linux Professional Institute (LPI) LPIC-1 Version 5.0 (Exam 101-500 / 102-500) 公式試験概要
export const lpic1ExamFacts: CertExamFact[] = [
  { label: "対象試験", value: "101-500 / 102-500", detail: "2科目合格で LPIC-1 認定" },
  { label: "試験時間", value: "各 90 分", detail: "101・102 それぞれ 90 分" },
  { label: "問題数", value: "各 60 問", detail: "選択問題 ＋ 記述（穴埋め）問題" },
  { label: "合格ライン", value: "500 点", detail: "200〜800 点スケール" },
  { label: "有効期限", value: "5 年間", detail: "ACTIVE ステータス維持期間" },
  { label: "受験形式", value: "ピアソンVUE", detail: "テストセンター / OnVUE オンライン" },
];

// 出典: LPI LPIC-1 Exam 101-500 / 102-500 Objectives (Version 5.0)
export const lpic1Domains: LpicDomain[] = [
  {
    id: "topic-101",
    exam: "101-500",
    number: "101",
    title: "システムアーキテクチャ",
    englishTitle: "System Architecture",
    accentColor: "indigo",
    summary: "ハードウェア認識（/sys, /proc, lsusb, lspci）、カーネル起動から systemd / SysVinit までの起動プロセスとターゲット制御を学びます。",
    topics: [
      {
        id: "101-1",
        code: "101.1",
        title: "ハードウェア設定の決定と構成",
        commands: ["lsusb", "lspci", "lsmod", "modprobe", "/proc", "/sys", "/dev"],
        keyPoints: [
          "sysfs（/sys）はカーネルのデバイス・ドライバ情報を階層構造で公開する仮想ファイルシステム",
          "procfs（/proc）はプロセスやCPU（/proc/cpuinfo）・メモリ（/proc/meminfo）・割り込み（/proc/interrupts）情報を提供",
          "modprobe は依存関係を解決してカーネルモジュールをロード/アンロード（-r）する",
          "lsmod でロード済みモジュール一覧、lspci / lsusb で PCI / USB デバイスを確認",
        ],
        examTip: "modprobe と insmod の違い（依存関係解決の有無）および /sys と /proc の役割は頻出。",
      },
      {
        id: "101-2",
        code: "101.2",
        title: "システムの起動（BIOS/UEFI・ブート・カーネル）",
        commands: ["dmesg", "journalctl -k", "/boot", "initrd / initramfs"],
        keyPoints: [
          "起動順序: BIOS/UEFI → ブートローダ（GRUB2）→ Linux カーネル + initramfs → PID 1（systemd / init）",
          "initramfs はルートファイルシステムをマウントする前に必要なドライバ等を提供する初期 RAM ファイルシステム",
          "dmesg や journalctl -b / journalctl -k でカーネルリングバッファの起動メッセージを確認",
        ],
        examTip: "UEFI の EFI システムパーティション（ESP）のマウント先は /boot/efi。",
      },
      {
        id: "101-3",
        code: "101.3",
        title: "ランレベルとブートターゲットの切り替え",
        commands: ["systemctl isolate", "systemctl get-default", "systemctl set-default", "telinit", "shutdown"],
        keyPoints: [
          "systemd ではランレベルに相当する単位をターゲット（multi-user.target, graphical.target 等）で管理",
          "ランレベル 3 ≒ multi-user.target、ランレベル 5 ≒ graphical.target、ランレベル 1 ≒ rescue.target",
          "systemctl isolate <target> で現在のターゲットを即時切り替え、set-default で次回起動時を変更",
          "shutdown -h +10 や shutdown -r now で予定時刻やメッセージを指定して停止・再起動",
        ],
        examTip: "systemctl isolate と set-default の使い分け、wall メッセージ送信を伴う shutdown のオプションに注意。",
      },
    ],
  },
  {
    id: "topic-102",
    exam: "101-500",
    number: "102",
    title: "Linux のインストールとパッケージ管理",
    englishTitle: "Linux Installation and Package Management",
    accentColor: "cyan",
    summary: "ディスクパーティション設計、GRUB2、共有ライブラリ、Debian系（dpkg/apt）および Red Hat系（rpm/yum/dnf）のパッケージ管理を習得します。",
    topics: [
      {
        id: "102-1",
        code: "102.1 - 102.3",
        title: "ハードディスク設計・GRUB2・共有ライブラリ",
        commands: ["grub-install", "grub-mkconfig", "ldd", "ldconfig", "/etc/ld.so.conf"],
        keyPoints: [
          "MBR は最大 2TB・基本パーティション最大4つ、GPT は 2TB 超・128パーティション（標準）に対応",
          "/boot、/var、/home、swap を別パーティションに分ける理由（ログ肥大化や再インストール時の保護）",
          "GRUB2 の設定ファイルは /boot/grub/grub.cfg（直接編集せず /etc/default/grub を編集後 update-grub / grub2-mkconfig）",
          "ldd で実行ファイルが依存する共有ライブラリを表示、/etc/ld.so.conf 更新後は ldconfig を実行",
        ],
        examTip: "LD_LIBRARY_PATH 環境変数と /etc/ld.so.cache の再構築コマンド ldconfig は穴埋めでも問われやすい。",
      },
      {
        id: "102-2",
        code: "102.4 - 102.5",
        title: "Debian / RPM パッケージ管理",
        commands: ["dpkg", "apt", "apt-cache", "rpm", "yum", "dnf"],
        keyPoints: [
          "dpkg -i（インストール）、dpkg -r（設定残し削除）、dpkg -P（設定含め完全削除）、dpkg -S（ファイル所属検索）",
          "apt update でリポジトリ情報更新、apt upgrade / dist-upgrade でパッケージ更新",
          "rpm -ivh（新規）、rpm -Uvh（アップグレード）、rpm -qf（ファイル所属検索）、rpm -qi（詳細）",
          "dnf / yum はリポジトリから依存関係を自動解決してインストール・更新を実行",
        ],
        examTip: "「このファイルはどのパッケージ由来か？」を調べる dpkg -S と rpm -qf の対比は超頻出。",
      },
    ],
  },
  {
    id: "topic-103",
    exam: "101-500",
    number: "103",
    title: "GNU と Unix のコマンド",
    englishTitle: "GNU and Unix Commands",
    accentColor: "emerald",
    summary: "シェル操作、ストリームとリダイレクト、テキストフィルタ、プロセス監視・優先度制御、正規表現、vi エディタの基礎を網羅します。",
    topics: [
      {
        id: "103-1",
        code: "103.1 - 103.4",
        title: "コマンドライン・テキスト処理・リダイレクト",
        commands: ["grep", "sed", "cut", "sort", "uniq", "tr", "xargs", "tee", "find"],
        keyPoints: [
          "標準入力(0)、標準出力(1)、標準エラー出力(2)。2>&1 で標準エラーを標準出力へ統合",
          "tee は標準入力を画面に出力しつつファイルにも書き出す（-a で追記）",
          "uniq は連続する重複行のみ除去するため、事前に sort と組み合わせるのが定石",
          "xargs は標準入力から受け取った文字列をコマンドの引数として渡す",
        ],
        examTip: "command > file 2>&1 と command 2>&1 > file の評価順の違いは定番のひっかけ問題。",
      },
      {
        id: "103-2",
        code: "103.5 - 103.8",
        title: "プロセス管理・優先度・正規表現・vi",
        commands: ["ps", "top", "kill", "killall", "bg", "fg", "nice", "renice", "grep -E", "vi"],
        keyPoints: [
          "シグナル: SIGTERM(15: 通常終了・デフォルト), SIGKILL(9: 強制終了・捕捉不可), SIGHUP(1: 再読み込み)",
          "nice 値の範囲は -20（最高優先度）〜 19（最低優先度）。一般ユーザーは優先度を下げる（数値を大きくする）のみ可能",
          "基本正規表現(BRE)と拡張正規表現(ERE: grep -E / egrep で +, ?, |, () をエスケープなしで使用)",
          "vi: コマンドモードでの保存終了は :wq または ZZ、破棄終了は :q!",
        ],
        examTip: "nice は新規起動時、renice は実行中プロセス（-p PID）に対して使用。SIGKILL(9) はトラップできない。",
      },
    ],
  },
  {
    id: "topic-104",
    exam: "101-500",
    number: "104",
    title: "デバイスと Linux ファイルシステム",
    englishTitle: "Devices, Linux Filesystems, Filesystem Hierarchy Standard",
    accentColor: "amber",
    summary: "パーティション・ファイルシステム作成、マウント・fstab、クォータ、パーミッション・特殊権限、リンク、FHS を学びます。",
    topics: [
      {
        id: "104-1",
        code: "104.1 - 104.4",
        title: "ファイルシステム・マウント・ディスクチェック",
        commands: ["fdisk", "parted", "mkfs", "fsck", "mount", "umount", "df", "du", "blkid", "/etc/fstab"],
        keyPoints: [
          "df -h はファイルシステム全体の空き容量、du -sh はディレクトリ/ファイルのディスク使用量",
          "fsck は原則アンマウント状態で実行する（破損防止）。ext 系には tune2fs や e2fsck もある",
          "/etc/fstab の6フィールド: デバイス(UUID推奨) / マウントポイント / FS種類 / オプション / dump / fsck順序",
          "blkid や lsblk -f でパーティションの UUID を確認",
        ],
        examTip: "mount -a で /etc/fstab の記述をテスト・一括マウントできる。fsck 順序の 0 はチェックなし、1 はルート。",
      },
      {
        id: "104-2",
        code: "104.5 - 104.7",
        title: "パーミッション・リンク・FHS",
        commands: ["chmod", "chown", "chgrp", "umask", "ln", "ln -s", "find", "locate", "which"],
        keyPoints: [
          "特殊権限: SUID(4000: 実行者の権限で実行)、SGID(2000: グループ継承)、Sticky bit(1000: /tmp 等で所有者以外削除不可)",
          "umask は新規作成時のデフォルト権限（ファイル 666、ディレクトリ 777）から引く値（例: umask 022 → ファイル 644）",
          "ハードリンク（同じ inode 共有、パーティション跨ぎ不可、ディレクトリ不可）vs シンボリックリンク（ln -s）",
          "FHS: /etc（設定）、/var（可変ログ・スプール）、/usr（ユーザーコマンド・ライブラリ）、/bin・/sbin（基本コマンド）",
        ],
        examTip: "find / -perm -4000 で SUID が設定されたファイルを検索できる。Sticky bit が付いた /tmp は末尾が t。",
      },
    ],
  },
  {
    id: "topic-105",
    exam: "102-500",
    number: "105",
    title: "シェルおよびシェルスクリプト",
    englishTitle: "Shells and Shell Scripting",
    accentColor: "indigo",
    summary: "ログインシェル/非ログインシェルの設定ファイル読み込み順、環境変数、シェルスクリプトの条件分岐・ループを習得します。",
    topics: [
      {
        id: "105-1",
        code: "105.1",
        title: "シェル環境のカスタマイズと使用",
        commands: ["export", "env", "set", "unset", "alias", "source / .", "~/.bashrc", "/etc/profile"],
        keyPoints: [
          "ログインシェル: /etc/profile → ~/.bash_profile（または ~/.bash_login → ~/.profile）",
          "非ログイン対話シェル: ~/.bashrc（および /etc/bash.bashrc）を読み込む",
          "export VAR=value で子プロセスへ環境変数を引き継ぐ",
          "source file（または . file）で現在のシェルコンテキストでスクリプトを実行",
        ],
        examTip: "ログイン時と対話シェル起動時で読まれるファイルの違いは 102-500 序盤の定番問題。",
      },
      {
        id: "105-2",
        code: "105.2",
        title: "簡単なスクリプトの作成とカスタマイズ",
        commands: ["#!/bin/bash", "if [ ... ]; then", "for", "while", "case", "$?", "$#", "$@"],
        keyPoints: [
          "特殊変数: $0（スクリプト名）、$1..$9（引数）、$#（引数の数）、$?（直前コマンドの終了ステータス、0が正常）",
          "test コマンド（[ ]）: 数値比較は -eq, -ne, -gt, -lt、文字列比較は =, !=, -z、ファイルは -f, -d, -e",
          "chmod +x script.sh で実行権限を付与し、./script.sh で実行",
        ],
        examTip: "数値比較に == ではなく -eq を使う点と、$? が直前コマンドの終了コードである点は必ず押さえる。",
      },
    ],
  },
  {
    id: "topic-106",
    exam: "102-500",
    number: "106",
    title: "ユーザーインターフェースとデスクトップ",
    englishTitle: "User Interfaces and Desktops",
    accentColor: "cyan",
    summary: "X11・Wayland の仕組み、ディスプレイマネージャ（GDM/LightDM）、アクセシビリティ機能を理解します。",
    topics: [
      {
        id: "106-1",
        code: "106.1 - 106.3",
        title: "X11・Wayland・アクセシビリティ",
        commands: ["DISPLAY", "xhost", "xdpyinfo", "xwininfo", "/etc/X11/xorg.conf"],
        keyPoints: [
          "X Window System（X11）はネットワーク透過なクライアント/サーバモデル（Xサーバが画面描画、アプリがXクライアント）",
          "DISPLAY 環境変数の書式は ホスト名:ディスプレイ番号.スクリーン番号（例: :0.0）",
          "Wayland は X11 の後継プロトコルで、コンポジタが直接ディスプレイサーバを兼ねてセキュリティと描画性能を向上",
          "アクセシビリティ: スクリーンリーダー（Orca）、オンスクリーンキーボード、ハイコントラスト、スティッキーキー等",
        ],
        examTip: "X11 では「画面側が X サーバ、アプリ側が X クライアント」という逆転しがちな用語に注意。",
      },
    ],
  },
  {
    id: "topic-107",
    exam: "102-500",
    number: "107",
    title: "管理タスク",
    englishTitle: "Administrative Tasks",
    accentColor: "emerald",
    summary: "ユーザー・グループ管理（/etc/passwd, /etc/shadow）、ジョブスケジューリング（cron, at, systemd timer）、ロケールと文字コードを学びます。",
    topics: [
      {
        id: "107-1",
        code: "107.1",
        title: "ユーザーとグループアカウントの管理",
        commands: ["useradd", "usermod", "userdel", "passwd", "groupadd", "chage", "/etc/skel"],
        keyPoints: [
          "/etc/passwd: ユーザー名:x:UID:GID:コメント:ホームディレクトリ:ログインシェル（全ユーザー閲覧可）",
          "/etc/shadow: 暗号化パスワードと有効期限情報（root のみ閲覧可）",
          "useradd -m でホームディレクトリ作成（/etc/skel の内容をコピー）、usermod -aG group user で補助グループ追加",
          "chage -l user でパスワード有効期限情報の確認・設定",
        ],
        examTip: "usermod で補助グループを追加するとき -G だけだと既存補助グループが上書きされるため -aG を使う。",
      },
      {
        id: "107-2",
        code: "107.2 - 107.3",
        title: "ジョブスケジューリングとローカライゼーション",
        commands: ["crontab", "at", "anacron", "systemctl list-timers", "locale", "tzselect", "iconv"],
        keyPoints: [
          "crontab 書式: 分(0-59) 時(0-23) 日(1-31) 月(1-12) 曜日(0-7, 0と7は日曜) コマンド",
          "/etc/cron.allow と /etc/cron.deny による利用制限（allow が存在すれば allow のみ許可）",
          "at は1回限りの予約実行（atq で確認、atrm で削除）。systemd timer は .timer と対になる .service を実行",
          "LANG / LC_ALL（最優先）環境変数、timedatectl でタイムゾーン設定、iconv -f 元 -t 先 で文字コード変換",
        ],
        examTip: "LC_ALL は他のすべての LC_* や LANG より優先される。cron.allow と cron.deny の優先関係も頻出。",
      },
    ],
  },
  {
    id: "topic-108",
    exam: "102-500",
    number: "108",
    title: "必須システムサービス",
    englishTitle: "Essential System Services",
    accentColor: "amber",
    summary: "時刻同期（NTP / chrony）、システムログ（rsyslog / systemd-journald）、メール転送（MTA基礎）、印刷（CUPS）を学習します。",
    topics: [
      {
        id: "108-1",
        code: "108.1 - 108.2",
        title: "時刻同期とシステムログ",
        commands: ["timedatectl", "chronyc", "ntpq", "hwclock", "journalctl", "logger", "/etc/rsyslog.conf"],
        keyPoints: [
          "chrony（chronyc tracking / sources）や ntpd（ntpq -p）で時刻同期、hwclock --systohc でハードウェアクロックへ同期",
          "rsyslog の書式: ファシリティ.プライオリティ（例: mail.err, *.info;mail.none）→ 出力先",
          "journalctl -u nginx.service（ユニット指定）、-f（リアルタイム追従）、-p err（優先度指定）",
          "logger コマンドでスクリプト等から syslog にテストメッセージを送信可能",
        ],
        examTip: "ファシリティ（auth, kern, mail 等）とプライオリティ（emerg〜debug）の記号（= はそのレベルのみ、! は除外）に注意。",
      },
      {
        id: "108-2",
        code: "108.3 - 108.4",
        title: "メール転送エージェント（MTA）基礎と印刷管理",
        commands: ["mailq", "newaliases", "/etc/aliases", "~/.forward", "lp", "lpq", "lprm", "cupsd"],
        keyPoints: [
          "/etc/aliases を編集した後は必ず newaliases コマンドを実行してデータベース（aliases.db）を更新する",
          "mailq（または postqueue -p）で送信待ちメールキューを確認",
          "CUPS（Common Unix Printing System）は IPP（ポート 631）を使用し、Web 管理画面（localhost:631）を提供",
        ],
        examTip: "/etc/aliases 編集後の newaliases 実行忘れは試験の定番ポイント。",
      },
    ],
  },
  {
    id: "topic-109",
    exam: "102-500",
    number: "109",
    title: "ネットワークの基礎",
    englishTitle: "Networking Fundamentals",
    accentColor: "indigo",
    summary: "TCP/IP とサブネット、IPv4/IPv6、基本設定コマンド（ip, ss, nmcli）、トラブルシューティング、DNS クライアント設定を習得します。",
    topics: [
      {
        id: "109-1",
        code: "109.1 - 109.3",
        title: "TCP/IP・ネットワーク設定・トラブルシュート",
        commands: ["ip addr", "ip route", "ss", "nmcli", "ping", "traceroute", "tracepath"],
        keyPoints: [
          "iproute2 ツール群: ip addr show（IP確認）、ip link（インターフェース）、ip route（ルーティングテーブル）",
          "ss -tulnp で待ち受け中の TCP/UDP ポートとプロセスを確認（従来の netstat の後継）",
          "主要ポート番号: SSH(22), SMTP(25), DNS(53), HTTP(80), POP3(110), NTP(123), IMAP(143), HTTPS(443)",
          "プライベート IP 範囲: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16",
        ],
        examTip: "ifconfig / netstat / route といった旧コマンドと ip / ss の対応関係を整理しておく。",
      },
      {
        id: "109-2",
        code: "109.4",
        title: "クライアント側の DNS 設定",
        commands: ["dig", "host", "getent", "/etc/hosts", "/etc/resolv.conf", "/etc/nsswitch.conf"],
        keyPoints: [
          "/etc/nsswitch.conf の hosts 行で名前解決の順序（例: files dns）を決定する",
          "/etc/hosts は静的なホスト名と IP の対応表、/etc/resolv.conf は参照する DNS サーバ（nameserver）を指定",
          "dig @8.8.8.8 example.com MX などで詳細な DNS クエリとレコード確認が可能",
        ],
        examTip: "nsswitch.conf で files が先にあるか dns が先にあるかで名前解決の挙動が変わる。",
      },
    ],
  },
  {
    id: "topic-110",
    exam: "102-500",
    number: "110",
    title: "セキュリティ",
    englishTitle: "Security",
    accentColor: "cyan",
    summary: "権限昇格（sudo/su）、システム・ネットワークポート監査、SSH 鍵認証とポートフォワーディング、GPG 暗号化を学びます。",
    topics: [
      {
        id: "110-1",
        code: "110.1 - 110.2",
        title: "管理業務のセキュリティとホストの保護",
        commands: ["sudo", "visudo", "su -", "ulimit", "passwd -l", "chage", "/etc/nologin"],
        keyPoints: [
          "/etc/sudoers は構文チェックを行う visudo コマンドで編集する",
          "su - username（ハイフン付き）は対象ユーザーのログイン環境（環境変数・ホームディレクトリ）を読み込んで切り替える",
          "ulimit -n（オープンファイル数）等でユーザーごとのリソース制限を設定（永続化は /etc/security/limits.conf）",
          "/etc/nologin ファイルが存在すると、root 以外の一般ユーザーはログインできなくなる",
        ],
        examTip: "visudo を使う理由（保存時の構文チェックで sudo 不能を防ぐ）と su と su - の違いは超重要。",
      },
      {
        id: "110-2",
        code: "110.3",
        title: "SSH と GPG による暗号化・認証",
        commands: ["ssh-keygen", "ssh-copy-id", "ssh -L", "ssh -R", "gpg", "/etc/ssh/sshd_config"],
        keyPoints: [
          "SSH 公開鍵認証: クライアントで ssh-keygen → 公開鍵（.pub）をサーバの ~/.ssh/authorized_keys へ配置",
          "~/.ssh ディレクトリは 700、authorized_keys と秘密鍵は 600 のパーミッションが必要",
          "ローカルポートフォワーディング（ssh -L ローカルポート:宛先:宛先ポート SSHサーバ）",
          "GPG: gpg --gen-key（鍵ペア生成）、--encrypt（相手公開鍵で暗号化）、--decrypt（自分の秘密鍵で復号）、--sign（署名）",
        ],
        examTip: "SSH のパーミッション要件（700 / 600）と /etc/ssh/sshd_config の PermitRootLogin / PasswordAuthentication は頻出。",
      },
    ],
  },
];

// 出典: LPI LPIC-1 Exam 101-500 / 102-500 Objectives (Version 5.0)
export const lpic1Comparisons: LpicComparisonTable[] = [
  {
    id: "pkg-mgmt",
    category: "パッケージ・起動",
    title: "パッケージ管理コマンド比較（Debian系 vs Red Hat系）",
    subtitle: "LPIC-1 102.4 / 102.5 の頻出コマンド対応表",
    columns: ["操作内容", "Debian系（dpkg / apt）", "Red Hat系（rpm / dnf・yum）"],
    rows: [
      { feature: "ローカルパッケージをインストール", values: ["dpkg -i file.deb", "rpm -ivh file.rpm"] },
      { feature: "リポジトリからインストール", values: ["apt install pkg", "dnf install pkg / yum install pkg"] },
      { feature: "パッケージ検索・詳細確認（キャッシュ）", values: ["apt-cache search kw / apt-cache show pkg", "dnf search kw / dnf info pkg"] },
      { feature: "パッケージ削除（設定残す/完全）", values: ["dpkg -r / dpkg -P pkg", "rpm -e pkg / dnf remove pkg"] },
      { feature: "ファイルが属するパッケージを検索", values: ["dpkg -S /path/to/file", "rpm -qf /path/to/file"] },
      { feature: "パッケージ内のファイル一覧", values: ["dpkg -L pkg", "rpm -ql pkg"] },
      { feature: "パッケージ情報・メタデータ更新", values: ["apt update", "dnf check-update"] },
    ],
    decisionRule: "「依存関係解決あり」なら apt / dnf、「オフラインの依存・詳細確認」は apt-cache、「単体ファイル(.deb/.rpm)の直接操作・所属検索」なら dpkg / rpm。",
  },
  {
    id: "systemd-vs-sysv",
    category: "パッケージ・起動",
    title: "systemd（systemctl）と旧 SysVinit の対比",
    subtitle: "サービス起動・自動起動・ターゲット切り替え",
    columns: ["操作内容", "systemd（現在の標準）", "SysVinit（旧方式）"],
    rows: [
      { feature: "サービス開始・停止・再起動", values: ["systemctl start/stop/restart unit", "service name start/stop/restart"] },
      { feature: "起動時の自動起動有効/無効", values: ["systemctl enable / disable unit", "chkconfig name on / off"] },
      { feature: "ユニットの起動禁止（マスク）", values: ["systemctl mask unit", "（同等の専用コマンドなし）"] },
      { feature: "現在のモードを即時切り替え", values: ["systemctl isolate <target>", "telinit <runlevel>"] },
      { feature: "CUI マルチユーザーモード", values: ["multi-user.target", "ランレベル 3"] },
      { feature: "GUI グラフィカルモード", values: ["graphical.target", "ランレベル 5"] },
      { feature: "デフォルト起動ターゲット確認・設定", values: ["systemctl get-default / set-default <target>", "/etc/inittab の id:<n>:initdefault"] },
    ],
    decisionRule: "マスク（mask）は /dev/null へのリンクを作り、手動起動も含めて完全に無効化したいときに使う。",
  },
  {
    id: "hw-kernel-modules",
    category: "パッケージ・起動",
    title: "ハードウェア認識・仮想ファイルシステム・カーネルモジュール管理",
    subtitle: "LPIC-1 101.1: /proc・/sys・/dev と lsusb・lspci・lsmod・modprobe",
    columns: ["対象 / コマンド", "主な役割・情報源", "よく使うオプション / 例", "試験での確認ポイント"],
    rows: [
      { feature: "lsusb", values: ["USB 接続デバイスの確認", "lsusb -v / lsusb -t（ツリー表示）", "ベンダー ID・プロダクト ID の確認"] },
      { feature: "lspci", values: ["PCI / PCIe デバイスの確認", "lspci -v / lspci -k（使用ドライバ表示）", "デバイスに紐づくカーネルドライバ名を確認できる -k が頻出"] },
      { feature: "lsmod", values: ["ロード済みカーネルモジュール一覧", "lsmod（/proc/modules の内容を表示）", "モジュールサイズと依存参照数（Used by）を確認"] },
      { feature: "modprobe", values: ["依存関係を解決してロード / アンロード", "modprobe <mod> / modprobe -r <mod>", "insmod / rmmod と異なり modules.dep を参照して依存も自動処理"] },
      { feature: "/proc（procfs）", values: ["プロセス・CPU・メモリ等の実行時情報", "/proc/cpuinfo, /proc/meminfo, /proc/interrupts", "カーネルパラメータ参照・調整（/proc/sys）にも使う仮想 FS"] },
      { feature: "/sys（sysfs）", values: ["デバイス・バス・ドライバの階層構造", "/sys/block/, /sys/class/, /sys/bus/", "udev がハードウェア構成を検知しデバイスを作成する際の情報源"] },
      { feature: "/dev（devtmpfs）", values: ["デバイスファイルの配置先", "/dev/sda, /dev/nvme0n1, /dev/null", "udev ルール（/etc/udev/rules.d/）によって命名や権限を制御"] },
    ],
    decisionRule: "PCI/USB 確認は lspci / lsusb、ロード済み確認は lsmod、依存解決ありのロード・削除は modprobe（-r）。/sys はデバイス階層、/proc はプロセス・システム状態。",
  },
  {
    id: "boot-init-target",
    category: "パッケージ・起動",
    title: "起動プロセス・カーネルログ・ランレベル / 停止コマンド比較",
    subtitle: "LPIC-1 101.2 / 101.3: /boot・initrd / initramfs・dmesg・shutdown・telinit",
    columns: ["コマンド / パス", "対象フェーズ・役割", "代表オプション / 配置先", "試験での注意点"],
    rows: [
      { feature: "/boot と initrd / initramfs", values: ["カーネル本体・初期 RAM ディスク配置", "/boot/vmlinuz-*, /boot/initramfs-*, /boot/efi", "initrd / initramfs はルート FS マウント前に必要ドライバを提供。UEFI の ESP は /boot/efi"] },
      { feature: "dmesg", values: ["カーネルリングバッファのログ表示", "dmesg -T（日時表示）/ dmesg -l err", "起動直後のハードウェア認識やドライバメッセージを確認"] },
      { feature: "journalctl -k", values: ["systemd-journald からカーネルログ抽出", "journalctl -k（-b で今回起動分に限定）", "dmesg と同等のカーネルメッセージを journal 経由で確認可能"] },
      { feature: "systemctl isolate / get-default / set-default", values: ["systemd ターゲットの即時・永続切替", "systemctl isolate rescue.target / get-default / set-default", "isolate は即時切替のみ、set-default は次回起動時の既定ターゲットを変更"] },
      { feature: "telinit", values: ["SysVinit 互換のランレベル即時変更", "telinit 3（CUI）/ telinit 5（GUI）/ telinit 1", "systemd 環境でも互換コマンドとして対応ターゲットへ切り替える"] },
      { feature: "shutdown", values: ["ユーザーへ通知しつつ安全に停止・再起動", "shutdown -h +10 \"msg\" / shutdown -r now / shutdown -c", "-h で停止、-r で再起動、-c で予定キャンセル（wall 通知を伴う）"] },
    ],
    decisionRule: "起動時のカーネルログ確認は dmesg または journalctl -k。即時ターゲット切替は systemctl isolate（旧 telinit）、次回既定値確認・変更は get-default / set-default、計画停止は shutdown。",
  },
  {
    id: "grub-shared-libs",
    category: "パッケージ・起動",
    title: "GRUB2 ブートローダと共有ライブラリ管理の比較",
    subtitle: "LPIC-1 102.2 / 102.3: grub-install・grub-mkconfig・ldd・ldconfig・/etc/ld.so.conf",
    columns: ["コマンド / ファイル", "対象領域・役割", "代表的な使い方・コマンド例", "注意点・試験ポイント"],
    rows: [
      { feature: "grub-install", values: ["GRUB2 本体をブート領域へインストール", "grub-install /dev/sda（UEFI は ESP 対象）", "MBR または EFI システムパーティションへブートローダ本体を書き込む"] },
      { feature: "grub-mkconfig", values: ["GRUB2 設定ファイル（grub.cfg）を生成", "grub-mkconfig -o /boot/grub/grub.cfg", "/etc/default/grub 編集後に実行（Debian 系は update-grub、RHEL 系は grub2-mkconfig）"] },
      { feature: "ldd", values: ["実行ファイルが依存する共有ライブラリ表示", "ldd /usr/bin/ssh", "不足ライブラリが not found と表示されるため障害切り分けに利用"] },
      { feature: "/etc/ld.so.conf", values: ["共有ライブラリの検索パス設定", "/etc/ld.so.conf および /etc/ld.so.conf.d/*.conf", "標準の /lib, /usr/lib 以外のディレクトリを追加したい場合に記述"] },
      { feature: "ldconfig", values: ["共有ライブラリキャッシュの再構築", "ldconfig（/etc/ld.so.cache を更新）", "/etc/ld.so.conf 更新後に必ず実行。一時指定は環境変数 LD_LIBRARY_PATH"] },
    ],
    decisionRule: "ブートローダ書込は grub-install、設定反映は grub-mkconfig。依存ライブラリ確認は ldd、/etc/ld.so.conf 編集後のキャッシュ再構築は ldconfig。",
  },
  {
    id: "special-perm",
    category: "ファイル・権限",
    title: "特殊パーミッション（SUID / SGID / Sticky bit）",
    subtitle: "数値表記（4/2/1）とシンボル表記（s/t）の整理",
    columns: ["種別", "8進数", "ls -l 表記", "主な役割・代表例"],
    rows: [
      { feature: "SUID (Set User ID)", values: ["4000", "所有者実行欄が s (または S)", "実行時のみファイル所有者の権限で動作（例: /usr/bin/passwd）"] },
      { feature: "SGID (Set Group ID)", values: ["2000", "グループ実行欄が s (または S)", "ファイル: グループ権限で実行 / ディレクトリ: 新規ファイルのグループを継承"] },
      { feature: "Sticky bit", values: ["1000", "その他実行欄が t (または T)", "ディレクトリ内で所有者・root 以外のファイル削除を禁止（例: /tmp）"] },
    ],
    decisionRule: "実行権限(x)がない状態に特殊権限を付けると大文字（S / T）になる。chmod 4755 で SUID 付き rwxr-xr-x。",
  },
  {
    id: "disk-fs-mount",
    category: "ファイル・権限",
    title: "パーティション分割・ファイルシステム・マウント管理比較",
    subtitle: "LPIC-1 104.1 - 104.4: fdisk・parted・mkfs・fsck・mount・umount・df・du・blkid・/etc/fstab",
    columns: ["コマンド / ファイル", "役割・操作対象", "代表コマンド / 書式", "試験ポイント"],
    rows: [
      { feature: "fdisk / parted", values: ["ディスクパーティションの作成・変更", "fdisk /dev/sdb（MBR）/ parted /dev/sdb（GPT対応）", "MBR は最大 2TB・基本 4 つまで。2TB 超や GPT は parted や gdisk を使用"] },
      { feature: "mkfs", values: ["パーティションへファイルシステム作成", "mkfs -t ext4 /dev/sdb1 / mkfs.xfs /dev/sdb1", "既存データは初期化される。スワップ作成は mkswap を使用"] },
      { feature: "fsck", values: ["ファイルシステムの検査・修復", "fsck /dev/sdb1 / e2fsck -f /dev/sdb1", "データ破損防止のため原則アンマウント状態で実行する"] },
      { feature: "mount / umount", values: ["ファイルシステムの接続と解除", "mount /dev/sdb1 /mnt / umount /mnt（一括は mount -a）", "umount で busy エラー時は lsof や fuser で使用中プロセスを特定"] },
      { feature: "df / du", values: ["空き容量（FS単位）と使用量（ディレクトリ単位）", "df -h（-i で inode）/ du -sh /var/log", "df はマウント済み FS 全体、du は指定ディレクトリ配下の合計を集計"] },
      { feature: "blkid と /etc/fstab", values: ["UUID 確認と起動時自動マウント設定", "blkid で UUID 確認 → /etc/fstab に 6 列記述", "第6列（fsck 順）は / が 1、その他は 2、チェック不要は 0"] },
    ],
    decisionRule: "FS 全体の空き容量は df、ディレクトリ単位の使用量は du。fsck 実行前は必ず umount。/etc/fstab には blkid で取得した UUID を記述する。",
  },
  {
    id: "perm-ownership-link",
    category: "ファイル・権限",
    title: "所有権・パーミッション・umask・リンク作成の比較",
    subtitle: "LPIC-1 104.5 / 104.6: chmod・chown・chgrp・umask・ln・ln -s",
    columns: ["コマンド", "操作対象・仕組み", "代表的な使用例", "制約・試験ポイント"],
    rows: [
      { feature: "chmod", values: ["アクセス権（r/w/x および特殊権限）の変更", "chmod 755 file / chmod u+x,go-w file", "8進数表記（4/2/1）とシンボル表記（u/g/o/a, +/-/=）の両方に対応"] },
      { feature: "chown", values: ["所有者（および所有グループ）の変更", "chown user1 file / chown -R user1:devgrp dir", "所有者の変更は原則 root のみ可能。コロン区切りでグループも同時変更可"] },
      { feature: "chgrp", values: ["所有グループのみの変更", "chgrp devgrp file / chgrp -R devgrp dir", "所有者であれば自身が所属する別グループへ変更できる"] },
      { feature: "umask", values: ["新規作成時のデフォルト権限マスク値", "umask 022（ファイル 644 / ディレクトリ 755）", "ファイルの最大 666、ディレクトリの最大 777 からビット単位で減算"] },
      { feature: "ln（ハードリンク）", values: ["同一ファイルシステム内で同じ inode を共有", "ln target hardlink", "異なるパーティション跨ぎ不可・ディレクトリ不可。元を消してもデータ残存"] },
      { feature: "ln -s（シンボリックリンク）", values: ["パス文字列を指す別 inode の参照を作成", "ln -s /path/to/target symlink", "別パーティション・ディレクトリへも作成可。元を削除するとリンク切れ"] },
    ],
    decisionRule: "所有者変更は chown（user:group 同時も可）、グループのみは chgrp。別FS跨ぎやディレクトリのリンクは ln -s、同一 inode 共有は ln。",
  },
  {
    id: "file-search-tools",
    category: "ファイル・権限",
    title: "ファイル・コマンド検索コマンド比較（find vs locate vs which）",
    subtitle: "LPIC-1 104.7: リアルタイム走査・インデックスDB・PATH 検索の違い",
    columns: ["比較項目", "find", "locate", "which"],
    rows: [
      { feature: "検索方式・対象", values: ["ディレクトリツリーをリアルタイム走査", "updatedb が作る DB を高速検索", "環境変数 PATH 内の実行コマンドを検索"] },
      { feature: "最新変更の反映", values: ["即時反映（現在のディスク状態を参照）", "updatedb 実行前の新規ファイルは未反映", "PATH 上に実行権限付きで配置されれば即時検出"] },
      { feature: "代表的な使用例", values: ["find / -perm -4000 / find /var -name '*.log' -mtime -7", "locate -i sshd_config", "which python3（-a で一致する全パスを表示）"] },
      { feature: "強み・補足", values: ["サイズ・更新日時・権限・所有者指定や -exec 連携が可能", "パスの一部指定で高速に候補を探せる", "シェル組込コマンドやエイリアス確認には type も併用"] },
    ],
    decisionRule: "権限・日時・サイズ等の条件検索や最新ファイル探索は find、高速なファイル名検索は locate（要 updatedb）、実行ファイルの所在確認は which。",
  },
  {
    id: "text-stream-filters",
    category: "シェル・テキスト",
    title: "テキスト処理・フィルタ・正規表現・vi エディタ比較",
    subtitle: "LPIC-1 103.2 - 103.4 / 103.7 - 103.8: grep・sed・cut・sort・uniq・tr・xargs・tee・vi",
    columns: ["コマンド", "主な機能・処理内容", "代表オプション / 使用例", "組み合わせ・試験ポイント"],
    rows: [
      { feature: "grep / grep -E", values: ["パターン一致行の抽出（BRE / 拡張正規表現 ERE）", "grep -i -v 'ERR' file / grep -E '(foo|bar)+'", "grep -E（旧 egrep）では +, ?, |, () をエスケープ不要で使用可能"] },
      { feature: "sed", values: ["ストリーム単位の文字列置換・行削除", "sed 's/old/new/g' file（-i で直接上書き）", "行内の全一致を置換するには末尾の g フラグが必要"] },
      { feature: "cut", values: ["区切り文字や文字位置による列切り出し", "cut -d: -f1,7 /etc/passwd / cut -c1-5", "-d で区切り文字（既定はタブ）、-f でフィールド番号を指定"] },
      { feature: "sort と uniq", values: ["行の並べ替えと連続重複行の集約・削除", "sort -n -r / sort file | uniq -c", "uniq は隣接する重複行のみ処理するため事前に sort を通すのが定石"] },
      { feature: "tr", values: ["標準入力に対する1文字単位の置換・削除", "tr 'a-z' 'A-Z' < file / tr -d '\\r'", "ファイル名を直接引数に取れないためリダイレクトまたはパイプで入力"] },
      { feature: "xargs", values: ["標準入力から受け取った項目を引数としてコマンド実行", "find . -name '*.tmp' -print0 | xargs -0 rm", "空白を含むファイル名対策には -print0 と -0 を併用"] },
      { feature: "tee", values: ["標準入力を画面（標準出力）とファイルへ同時出力", "cmd | tee app.log（-a で追記）", "パイプラインの途中経過を確認しつつログ保存する際に利用"] },
      { feature: "vi", values: ["CUI 標準のモーダルテキストエディタ", "保存終了 :wq / ZZ、破棄終了 :q!、検索 /word", "挿入モード（i, a, o）から Esc でコマンドモードへ戻る"] },
    ],
    decisionRule: "行抽出は grep（拡張正規表現は grep -E）、文字列置換は sed、1文字置換・削除は tr、列抽出は cut、重複集計は sort | uniq -c、引数展開は xargs、分岐保存は tee。",
  },
  {
    id: "shell-env-files",
    category: "シェル・テキスト",
    title: "シェル環境変数・エイリアス・設定ファイル読み込み比較",
    subtitle: "LPIC-1 105.1: export・env・set・unset・alias・source / .・~/.bashrc・/etc/profile",
    columns: ["コマンド / ファイル", "スコープ・役割", "代表例 / 読み込みタイミング", "試験での区別ポイント"],
    rows: [
      { feature: "export", values: ["シェル変数を環境変数化し子プロセスへ継承", "export PATH=$PATH:/usr/local/bin", "export なしの代入（VAR=1）は現在のシェルのみ有効"] },
      { feature: "env / set", values: ["変数一覧の表示（環境変数のみ vs シェル全体）", "env（または env -i cmd）/ set", "env はエクスポート済み環境変数のみ、set はシェル変数・関数・設定も表示"] },
      { feature: "unset", values: ["定義済みの変数・環境変数や関数を削除", "unset MY_VAR", "空文字代入（MY_VAR=''）とは異なり変数定義そのものを消去する"] },
      { feature: "alias", values: ["コマンドの別名（短縮形）定義・一覧表示", "alias ll='ls -la'（解除は unalias ll）", "永続化するには ~/.bashrc 等の設定ファイルへ追記する"] },
      { feature: "source / .", values: ["現在のシェルコンテキストでファイルを読み込む", "source ~/.bashrc または . ~/.bashrc", "別プロセス（./file）で実行すると環境変更が現在のシェルに残らない"] },
      { feature: "/etc/profile", values: ["ログインシェル起動時の全ユーザー共通設定", "ログイン時に最初に読まれ ~/.bash_profile 等へ続く", "システム全体の初期 PATH や環境変数設定を配置"] },
      { feature: "~/.bashrc", values: ["非ログイン対話シェルの個人設定", "端末エミュレータ起動時などに自動読み込み", "エイリアスやシェル関数、プロンプト（PS1）等を記述"] },
    ],
    decisionRule: "環境変数表示は env、シェル変数含む全表示は set、削除は unset。現シェルへ即時反映は source / .。ログイン時は /etc/profile、対話シェルは ~/.bashrc。",
  },
  {
    id: "bash-script-constructs",
    category: "シェル・テキスト",
    title: "シェルスクリプトの基本構文・条件分岐・ループ・特殊変数",
    subtitle: "LPIC-1 105.2: #!/bin/bash・if [ ... ]; then・for・while・case・$?・$#・$@",
    columns: ["構文 / 変数", "用途・意味", "書式・使用例", "試験での注意点"],
    rows: [
      { feature: "#!/bin/bash", values: ["スクリプトを実行するインタプリタ指定（Shebang）", "1行目先頭に #!/bin/bash を記述し chmod +x", "2行目以降の # は通常コメントだが、1行目の #! のみカーネルが解釈"] },
      { feature: "if [ ... ]; then", values: ["test コマンド（[ ]）による条件分岐", "if [ \"$n\" -eq 10 ]; then ... elif ... else ... fi", "数値比較は -eq, -ne, -gt, -lt、文字列は =, !=, -z。[ と ] の内側に空白必須"] },
      { feature: "case", values: ["変数値に対する複数パターンの分岐", "case \"$1\" in start) ... ;; *) ... ;; esac", "各分岐の終端は ;;、ブロック全体の終了は逆綴りの esac"] },
      { feature: "for / while", values: ["リスト反復（for）と条件成立中の反復（while）", "for f in *.txt; do ... done / while read line; do ... done", "ループ終了はいずれも done。seq や {1..5} と組み合わせる出題も多い"] },
      { feature: "$?", values: ["直前コマンドの終了ステータス（0 が正常終了）", "grep -q root /etc/passwd; echo $?", "0 以外はエラーまたは不一致。&& / || 連結の成否判定にも使われる"] },
      { feature: "$# と $@", values: ["引数の個数（$#）と全引数の展開（$@）", "echo \"count=$#\" / for a in \"$@\"; do ... done", "\"$@\" は各引数を個別にクォート保持、\"$*\" は1つの文字列へ結合"] },
    ],
    decisionRule: "先頭行は #!/bin/bash、直前終了コードは $?（0 が成功）、引数数は $#、個別引数展開は \"$@\"。if [ ... ]; then では数値比較に -eq を使う。",
  },
  {
    id: "process-job-signal",
    category: "プロセス・ログ",
    title: "プロセス監視・シグナル送信・ジョブ制御・優先度管理",
    subtitle: "LPIC-1 103.5 / 103.6: ps・top・kill・killall・bg・fg・nice・renice",
    columns: ["コマンド", "操作対象・役割", "代表オプション / 例", "対比・試験ポイント"],
    rows: [
      { feature: "ps / top", values: ["プロセスの静的スナップショット / 動的監視", "ps aux / ps -ef / top（対話的にリアルタイム更新）", "top 画面内では k でシグナル送信、r で nice 値変更が可能"] },
      { feature: "kill / killall", values: ["PID 指定 / プロセス名指定でのシグナル送信", "kill -15 <PID> / kill -9 <PID> / killall httpd", "既定は SIGTERM(15: 通常終了)。SIGKILL(9) は捕捉・無視不可の強制終了"] },
      { feature: "bg / fg", values: ["バックグラウンド再開 / フォアグラウンド復帰", "Ctrl+Z で停止 → bg %1 / fg %1（jobs で一覧確認）", "コマンド末尾に & を付けると最初からバックグラウンドで実行"] },
      { feature: "nice / renice", values: ["プロセス優先度（-20 〜 19）の起動時指定 / 実行中変更", "nice -n 10 cmd / renice 10 -p <PID>", "値が小さいほど高優先度（既定は 0）。負の値（優先度上げ）は root のみ可"] },
    ],
    decisionRule: "PID 指定停止は kill、名前指定は killall。一時停止ジョブの背景継続は bg、前景戻しは fg。起動時優先度は nice、実行中変更は renice。",
  },
  {
    id: "cron-timer",
    category: "プロセス・ログ",
    title: "ジョブスケジューリング手法の使い分け",
    subtitle: "cron / anacron / at / systemd timer",
    columns: ["ツール", "実行頻度", "電源断時の扱い", "設定場所・コマンド"],
    rows: [
      { feature: "cron", values: ["定期実行（分単位）", "停止中のジョブはスキップ", "crontab -e / /etc/crontab"] },
      { feature: "anacron", values: ["定期実行（日・週・月単位）", "起動後に未実行分を遅延実行", "/etc/anacrontab"] },
      { feature: "at", values: ["1回限りの予約実行", "指定時刻を過ぎていれば次回起動時等に処理", "at 18:00 / atq / atrm"] },
      { feature: "systemd timer", values: ["定期・単発（秒単位も可）", "Persistent=true で未実行分を実行", "*.timer + *.service / systemctl list-timers"] },
    ],
    decisionRule: "常時稼働サーバの定時処理は cron、ノートPCなど電源断がある環境の日次処理は anacron または Persistent=true の systemd timer。",
  },
  {
    id: "time-sync-hwclock",
    category: "プロセス・ログ",
    title: "システム時刻・タイムゾーン・NTP 同期コマンド比較",
    subtitle: "LPIC-1 108.1: timedatectl・chronyc・ntpq・hwclock",
    columns: ["コマンド", "対象・用途", "代表サブコマンド / オプション", "試験ポイント"],
    rows: [
      { feature: "timedatectl", values: ["systemd 環境の時刻・タイムゾーン・NTP 統合管理", "timedatectl status / set-timezone Asia/Tokyo / set-ntp true", "/etc/localtime 変更や NTP 有効/無効を一括設定"] },
      { feature: "chronyc", values: ["chrony（chronyd）の監視・状態確認", "chronyc tracking / chronyc sources", "間欠接続や仮想環境でも素早く同期補正できる現行標準 NTP ツール"] },
      { feature: "ntpq", values: ["従来の ntpd デーモンへの問い合わせ", "ntpq -p（参照 NTP サーバ一覧と同期状態 * を表示）", "NTP は UDP ポート 123 を使用。設定ファイルは /etc/ntp.conf"] },
      { feature: "hwclock", values: ["ハードウェアクロック（RTC）の参照と同期", "hwclock -r（表示）/ --systohc（OS→HW）/ --hctosys（HW→OS）", "システム停止中も時刻を保持するマザーボード上の RTC と OS 時刻を合わせる"] },
    ],
    decisionRule: "タイムゾーン設定は timedatectl、chrony 状態確認は chronyc、ntpd 確認は ntpq -p、RTC 同期は hwclock。",
  },
  {
    id: "logging-syslog-journal",
    category: "プロセス・ログ",
    title: "システムログ管理比較（rsyslog vs systemd-journald・logger）",
    subtitle: "LPIC-1 108.2: /etc/rsyslog.conf・journalctl・logger",
    columns: ["コマンド / ファイル", "ログ基盤・役割", "書式・代表オプション", "試験での注意点"],
    rows: [
      { feature: "/etc/rsyslog.conf", values: ["rsyslog のファシリティ・プライオリティ別振り分け設定", "mail.err /var/log/maillog、*.info;mail.none /var/log/messages", "プライオリティは指定以上すべて（= でそのレベルのみ、! や none で除外）"] },
      { feature: "journalctl", values: ["systemd-journald が記録するバイナリログ検索", "journalctl -u sshd.service -f / -p err / -k（カーネル）", "再起動後もログを残すには Storage=persistent または /var/log/journal を設定"] },
      { feature: "logger", values: ["コマンドラインやスクリプトから syslog へメッセージ送信", "logger -p local0.info \"backup done\" / logger -t myscript \"msg\"", "rsyslog 振り分けルールの動作確認やスクリプトログ出力に活用"] },
    ],
    decisionRule: "テキストログ出力ルール定義は /etc/rsyslog.conf、journal 検索・追従は journalctl、CLI からの手動ログ送信は logger。",
  },
  {
    id: "user-group-mgmt",
    category: "システム管理・UI",
    title: "ユーザー・グループ・パスワード期限管理コマンド比較",
    subtitle: "LPIC-1 107.1: useradd・usermod・userdel・groupadd・passwd・chage・/etc/skel",
    columns: ["コマンド / パス", "対象・操作内容", "代表オプション / 例", "試験での注意点"],
    rows: [
      { feature: "useradd", values: ["新規ユーザーアカウントの作成", "useradd -m -s /bin/bash user1 / useradd -D", "-m でホーム作成（-D でデフォルト値表示・変更）"] },
      { feature: "/etc/skel", values: ["新規ユーザー作成時にホームへ複製される雛形", ".bashrc, .bash_profile 等を配置", "useradd -m 実行時に /etc/skel 配下のファイルがコピーされる"] },
      { feature: "usermod", values: ["既存ユーザー属性・所属グループの変更", "usermod -aG wheel user1 / usermod -L user1", "補助グループ追加時は -aG が必須（-G のみだと既存補助グループを上書き）"] },
      { feature: "userdel", values: ["既存ユーザーの削除", "userdel user1 / userdel -r user1", "-r を付けるとホームディレクトリとメールスプールも同時に削除"] },
      { feature: "groupadd", values: ["新規グループの作成（/etc/group 更新）", "groupadd -g 2000 devteam / groupadd -r sysgrp", "変更は groupmod、削除は groupdel を使用"] },
      { feature: "passwd", values: ["パスワード変更とアカウントロック", "passwd user1 / passwd -l user1（ロック）/ -u（解除）", "-l は /etc/shadow のパスワード欄先頭に ! を付けて無効化"] },
      { feature: "chage", values: ["パスワード有効期限・日数の確認と変更", "chage -l user1 / chage -M 90 user1 / chage -E YYYY-MM-DD user1", "-M はパスワード最大有効日数、-E はアカウント自体の有効期限"] },
    ],
    decisionRule: "新規作成は useradd -m（/etc/skel 複製）、補助グループ追加は usermod -aG、ホームごと削除は userdel -r、有効期限管理は chage。",
  },
  {
    id: "locale-charset-tz",
    category: "システム管理・UI",
    title: "ロケール・タイムゾーン・文字コード変換比較",
    subtitle: "LPIC-1 107.3: locale・tzselect・iconv と環境変数優先度",
    columns: ["コマンド / 変数", "役割", "代表例・確認方法", "試験でのポイント"],
    rows: [
      { feature: "locale", values: ["現在のロケール設定と利用可能ロケール一覧の確認", "locale / locale -a（対応一覧）", "優先順位は LC_ALL > LC_*（LC_TIME 等）> LANG。LC_ALL=C で標準英語・コード順動作"] },
      { feature: "tzselect", values: ["対話形式で地域別の TZ タイムゾーン文字列を検索", "tzselect（選択後に TZ='Asia/Tokyo' 等の書式を出力）", "ファイル設定を直接書き換えないため、TZ 変数や timedatectl と区別する"] },
      { feature: "iconv", values: ["ファイルの文字エンコーディングを変換", "iconv -f EUC-JP -t UTF-8 in.txt -o out.txt", "-f が変換元（from）、-t が変換先（to）、-l で変換可能な文字コード一覧を表示"] },
    ],
    decisionRule: "ロケール確認は locale（最優先変数は LC_ALL）、タイムゾーン対話検索は tzselect、文字コード変換は iconv -f <元> -t <先>。",
  },
  {
    id: "mta-cups-services",
    category: "システム管理・UI",
    title: "メール転送（MTA）と印刷管理（CUPS）コマンド比較",
    subtitle: "LPIC-1 108.3 / 108.4: mailq・newaliases・/etc/aliases・~/.forward・lp・lpq・lprm・cupsd",
    columns: ["領域", "コマンド / 設定", "役割・操作内容", "ポイント・補足"],
    rows: [
      { feature: "メールキュー確認", values: ["mailq", "送信待ちメールキュー一覧を表示", "Postfix の postqueue -p と同等"] },
      { feature: "システムエイリアス", values: ["/etc/aliases と newaliases", "システム全体のメール転送・別名を定義し DB を更新", "/etc/aliases 編集後は必ず newaliases を実行して /etc/aliases.db を再生成"] },
      { feature: "個人転送設定", values: ["~/.forward", "一般ユーザーが自身の受信メール転送先を指定", "自身のホームディレクトリ配下に転送先アドレスを記述"] },
      { feature: "印刷実行・キュー確認", values: ["lp と lpq", "lp でジョブ投入、lpq で待機・印刷中ジョブ確認", "例: lp -d printer1 file.pdf / lpq -P printer1（状態確認は lpstat も使用）"] },
      { feature: "印刷ジョブ取消", values: ["lprm", "指定した Job ID の印刷ジョブをキューから削除", "lpq で確認した Job ID を指定して lprm <job-id>（cancel コマンドも可）"] },
      { feature: "印刷デーモン", values: ["cupsd", "CUPS（IPP: ポート 631）を提供する印刷サービス本体", "設定は /etc/cups/cupsd.conf、管理画面は http://localhost:631/"] },
    ],
    decisionRule: "/etc/aliases 更新時は newaliases、ユーザー単位転送は ~/.forward、キュー確認は mailq。印刷は投入 lp / 確認 lpq / 削除 lprm、デーモンは cupsd。",
  },
  {
    id: "x11-wayland-desktop",
    category: "システム管理・UI",
    title: "X Window System（X11）関連環境変数・コマンド・設定比較",
    subtitle: "LPIC-1 106.1: DISPLAY・xhost・xdpyinfo・xwininfo・/etc/X11/xorg.conf",
    columns: ["項目 / コマンド", "役割", "書式・代表例", "試験での注意点"],
    rows: [
      { feature: "DISPLAY", values: ["X クライアントの描画先 X サーバを指定", "export DISPLAY=:0.0 / host:0.0", "書式は ホスト名:ディスプレイ番号.スクリーン番号（画面側が X サーバ）"] },
      { feature: "xhost", values: ["X サーバへのホスト単位アクセス制御を管理", "xhost +local: / xhost -", "xhost + は全接続許可となり危険なため、実務では ssh -X や xauth を推奨"] },
      { feature: "xdpyinfo", values: ["X サーバ全体のディスプレイ情報・解像度等を表示", "xdpyinfo | grep dimensions", "接続中の X ディスプレイ全体の機能・色深度・解像度を確認"] },
      { feature: "xwininfo", values: ["指定またはクリックした個別ウィンドウ情報を表示", "xwininfo（ウィンドウ ID・座標・サイズを表示）", "xdpyinfo（ディスプレイ全体）と xwininfo（個別ウィンドウ）の違いが重要"] },
      { feature: "/etc/X11/xorg.conf", values: ["X.Org サーバの画面・デバイス設定ファイル", "/etc/X11/xorg.conf および /etc/X11/xorg.conf.d/*.conf", "自動設定で不足する個別デバイス設定等を手動記述する場所"] },
    ],
    decisionRule: "描画先指定は DISPLAY、アクセス制御は xhost、ディスプレイ全体確認は xdpyinfo、個別ウィンドウ確認は xwininfo、設定は /etc/X11/xorg.conf。",
  },
  {
    id: "net-tools",
    category: "ネットワーク",
    title: "ネットワーク確認コマンド（iproute2 vs 旧 net-tools）",
    subtitle: "LPIC-1 109.2 / 109.3 の新旧コマンド対応",
    columns: ["確認・操作対象", "iproute2（推奨・現行）", "旧 net-tools（参考）"],
    rows: [
      { feature: "IPアドレス・NIC確認", values: ["ip addr show (ip a)", "ifconfig"] },
      { feature: "ルーティングテーブル確認", values: ["ip route show (ip r)", "route -n"] },
      { feature: "待ち受けポート・ソケット確認", values: ["ss -tulnp", "netstat -tulnp"] },
      { feature: "ARP キャッシュ確認", values: ["ip neigh show", "arp -a"] },
    ],
    decisionRule: "試験では ip / ss / nmcli が中心だが、トラブルシュート選択肢として netstat / ifconfig も出題される。",
  },
  {
    id: "net-troubleshoot-dns",
    category: "ネットワーク",
    title: "疎通確認・経路追跡・DNS / 名前解決ツールと設定比較",
    subtitle: "LPIC-1 109.3 / 109.4: ping・traceroute・tracepath・dig・host・getent・名前解決設定",
    columns: ["コマンド / ファイル", "仕組み・用途", "代表例・書式", "試験での区別ポイント"],
    rows: [
      { feature: "ping", values: ["ICMP Echo による到達性と応答時間（RTT）確認", "ping -c 4 8.8.8.8（IPv6 は ping6 / ping -6）", "Linux では -c で回数を指定しないと停止するまで送信し続ける"] },
      { feature: "traceroute", values: ["経由ルータ（ホップ）ごとの経路と遅延を調査", "traceroute -n example.com（-I で ICMP 使用）", "TTL を 1 から増やし各ルータからの応答で経路を可視化"] },
      { feature: "tracepath", values: ["一般ユーザー権限で経路と Path MTU を確認", "tracepath example.com（IPv6 は tracepath6）", "traceroute と異なり特権不要で最小 MTU 値も確認可能"] },
      { feature: "dig / host", values: ["DNS サーバへ直接問い合わせレコードを確認", "dig @8.8.8.8 example.com MX / host -t MX example.com", "/etc/hosts 等を経由せず DNS に直接クエリを送る（dig は詳細、host は簡潔）"] },
      { feature: "getent", values: ["nsswitch.conf の順序に従い OS の名前解決等を実行", "getent hosts example.com / getent passwd user1", "dig と異なり /etc/hosts（files）も含めたシステム全体の解決結果を検証可能"] },
      { feature: "名前解決設定ファイル", values: ["/etc/nsswitch.conf・/etc/hosts・/etc/resolv.conf", "hosts: files dns（順序）/ nameserver 8.8.8.8（DNS 先）", "nsswitch.conf が参照順、hosts が静的対応表、resolv.conf が DNS サーバ指定"] },
    ],
    decisionRule: "到達確認は ping、経路と MTU は tracepath（詳細制御は traceroute）。DNS 直接クエリは dig / host、nsswitch.conf 準拠の名前解決確認は getent。",
  },
  {
    id: "security-priv-limits",
    category: "セキュリティ",
    title: "権限昇格・リソース制限・ログイン抑止とロックの比較",
    subtitle: "LPIC-1 110.1 / 110.2: sudo・visudo・su -・ulimit・passwd -l・chage・/etc/nologin",
    columns: ["コマンド / ファイル", "目的・制御内容", "代表例・関連ファイル", "試験での注意点"],
    rows: [
      { feature: "sudo と visudo", values: ["許可ユーザーへの限定的な特権コマンド実行付与", "sudo <cmd> / visudo（/etc/sudoers を編集）", "visudo は保存時に構文検査を行い、記述ミスによる sudo 不能を防ぐ"] },
      { feature: "su -", values: ["対象ユーザーのログイン環境ごとユーザー切替", "su -（root へ）/ su - user1", "ハイフン（-）を省略した su では元の環境変数・作業ディレクトリを引き継ぐ"] },
      { feature: "ulimit", values: ["シェル・子プロセスのリソース上限（FD数等）制御", "ulimit -a（確認）/ ulimit -n 4096（オープンファイル数）", "ソフト(-S)とハード(-H)上限がある。永続設定は /etc/security/limits.conf"] },
      { feature: "passwd -l と chage", values: ["パスワードロックとアカウント有効期限管理", "passwd -l user1（解除 -u）/ chage -E YYYY-MM-DD user1", "passwd -l はパスワード認証のみ無効化するため SSH 鍵認証は別途制御が必要"] },
      { feature: "/etc/nologin", values: ["メンテナンス時等に root 以外のログインを一時禁止", "テキストを記述して /etc/nologin を作成（終了後は削除）", "ファイル存在中は一般ユーザーのログインを拒否しファイル内容を表示"] },
    ],
    decisionRule: "sudoers 編集は必ず visudo、環境ごと切替は su -、リソース制限は ulimit（永続は limits.conf）、一時ログイン禁止は /etc/nologin。",
  },
  {
    id: "ssh-gpg-crypto",
    category: "セキュリティ",
    title: "SSH 鍵認証・ポート転送・sshd 設定と GPG 暗号化の比較",
    subtitle: "LPIC-1 110.3: ssh-keygen・ssh-copy-id・ssh -L / -R・/etc/ssh/sshd_config・gpg",
    columns: ["コマンド / 設定", "役割・機能", "代表例・設定内容", "権限・セキュリティ要件"],
    rows: [
      { feature: "ssh-keygen", values: ["SSH 公開鍵・秘密鍵ペアの生成", "ssh-keygen -t ed25519 / ssh-keygen -t rsa -b 4096", "秘密鍵は 600 で保管し他者へ共有しない。公開鍵（.pub）を接続先へ登録"] },
      { feature: "ssh-copy-id", values: ["公開鍵をリモートサーバの authorized_keys へ登録", "ssh-copy-id user@host", "リモート側の ~/.ssh を 700、authorized_keys を 600 へ適切に設定"] },
      { feature: "ssh -L と ssh -R", values: ["ローカル / リモート ポートフォワーディング", "ssh -L 8080:dst:80 bastion / ssh -R 9000:localhost:80 bastion", "-L はローカル側ポートを先方へ転送、-R はリモート側ポートを手元へ転送"] },
      { feature: "/etc/ssh/sshd_config", values: ["OpenSSH サーバ（sshd）のセキュリティ設定", "PermitRootLogin no / PasswordAuthentication no / Port", "設定変更後は sshd -t で構文チェックし systemctl reload sshd"] },
      { feature: "gpg", values: ["GnuPG による公開鍵暗号化・復号・電子署名", "gpg --gen-key / gpg -e -r user file / gpg -d file.gpg / gpg --sign", "暗号化（-e）には受信者の公開鍵、復号（-d）と署名には自身の秘密鍵を使用"] },
    ],
    decisionRule: "鍵生成は ssh-keygen、鍵登録は ssh-copy-id（~/.ssh は 700 / 鍵は 600）、ローカル転送は ssh -L、リモート転送は ssh -R、暗号化・署名は gpg。",
  },
];

export const lpic1Patterns: LpicWorkflowPattern[] = [
  {
    id: "disk-mount",
    title: "新規ディスクのパーティション作成〜永続マウント",
    badge: "104.1 - 104.3",
    flow: ["lsblk / fdisk -l", "parted / fdisk", "mkfs.ext4 /dev/sdb1", "blkid で UUID 取得", "/etc/fstab に追記", "mount -a で検証"],
    summary: "新規ブロックデバイスをフォーマットし、再起動後も自動でマウントされるように設定する標準手順です。",
    keyDesignPoints: [
      "/etc/fstab ではデバイス名（/dev/sdb1）が起動順で変わるリスクがあるため UUID=... の指定が推奨される",
      "mount -a を実行してエラーが出ないことを必ず確認してから再起動する",
      "スワップ領域の場合は mkswap と swapon を使用する",
    ],
  },
  {
    id: "ssh-key-auth",
    title: "SSH 公開鍵認証とローカルポートフォワーディング",
    badge: "110.3",
    flow: ["ssh-keygen -t ed25519", "ssh-copy-id user@host", "chmod 700 ~/.ssh && 600 authorized_keys", "/etc/ssh/sshd_config 調整", "systemctl reload sshd"],
    summary: "パスワード認証に頼らない安全な SSH 鍵認証の構築と、安全なトンネル通信のパターンです。",
    keyDesignPoints: [
      "ssh-copy-id を使うとリモート側のパーミッション（700 / 600）も適切に設定してくれる",
      "sshd_config で PasswordAuthentication no にする場合は、先に鍵認証でログインできることを確認する",
      "ssh -L 8080:127.0.0.1:80 user@bastion でローカルの 8080 番を踏み台経由で転送できる",
    ],
  },
  {
    id: "text-pipeline",
    title: "ログ集計のためのテキスト処理パイプライン",
    badge: "103.2 - 103.4",
    flow: ["grep / zgrep で抽出", "cut / awk で列切り出し", "sort で並べ替え", "uniq -c で件数集計", "sort -nr | head -n 10"],
    summary: "大量のログや CSV から頻出エラーやアクセス元を素早く集計する Unix 哲学の基本パターンです。",
    keyDesignPoints: [
      "uniq は隣接する同一行しかまとめられないため、必ず直前に sort を挟む",
      "sort -n は数値順、-r は降順",
      "標準エラー出力も含めてパイプに渡したい場合は 2>&1 | を使用する",
    ],
  },
  {
    id: "systemd-troubleshoot",
    title: "systemd サービスの起動障害調査フロー",
    badge: "101.3 / 108.2",
    flow: ["systemctl status <unit>", "journalctl -u <unit> -xe", "systemctl cat <unit>", "systemctl daemon-reload", "systemctl restart <unit>"],
    summary: "サービスが起動しない・設定変更が反映されないときに切り分ける標準手順です。",
    keyDesignPoints: [
      "ユニットファイル（.service）を編集した後は systemctl daemon-reload の実行が必須",
      "journalctl -u <unit> -b で直近の起動以降の該当ユニットログのみを抽出できる",
      "systemctl is-enabled / is-active はシェルスクリプト内での状態確認にも便利",
    ],
  },
];

export const lpic1Pitfalls: LpicPitfall[] = [
  {
    id: "pit-1",
    trap: "標準エラー出力をファイルに捨てつつ出力を別ファイルへ保存しようとして `cmd 2>&1 > out.txt` と書く",
    whyWrong: "リダイレクトは左から順に評価されるため、先に 2>&1 が「その時点の標準出力（画面）」を指してしまい、標準エラーが画面に出たままになる。",
    correctApproach: "`cmd > out.txt 2>&1` と書くことで、先に標準出力を out.txt に向けた上で標準エラーを同じ先へ統合できる。",
  },
  {
    id: "pit-2",
    trap: "ユーザーに補助グループを追加しようとして `usermod -G docker alice` を実行する",
    whyWrong: "`-G` 単体では既存の補助グループがすべて上書きされ、元々所属していたグループ（例: sudo / wheel）から外れてしまう。",
    correctApproach: "追加する場合は必ず `-a`（append）を併用し、`usermod -aG docker alice` を実行する。",
  },
  {
    id: "pit-3",
    trap: "ハードリンクで別パーティションのファイルやディレクトリへリンクを張ろうとする",
    whyWrong: "ハードリンクは同じファイルシステム内の同じ inode 番号を参照する仕組みのため、パーティション（ファイルシステム）を跨ぐことやディレクトリのリンク作成はできない。",
    correctApproach: "別パーティションやディレクトリへのリンクにはシンボリックリンク（`ln -s`）を使用する。",
  },
  {
    id: "pit-4",
    trap: "`cron` と `anacron`、および `/etc/cron.allow` と `/etc/cron.deny` の優先度を混同する",
    whyWrong: "両方存在する場合に deny が勝つと誤解しやすい。",
    correctApproach: "`/etc/cron.allow` が存在する場合、記載されたユーザーのみ許可され `cron.deny` は無視される。どちらもない場合は root のみ許可（ディストリにより異なる場合あり）。",
  },
  {
    id: "pit-5",
    trap: "`/etc/aliases` を編集した後に再読み込みせずメール転送が動かない",
    whyWrong: "MTA（Postfix 等）はテキストの `/etc/aliases` ではなくバイナリ DB（`/etc/aliases.db`）を参照するため。",
    correctApproach: "編集後は必ず `newaliases`（または `postalias /etc/aliases`）を実行して DB を再生成する。",
  },
  {
    id: "pit-6",
    trap: "ディレクトリに実行権限（`x`）を付けずに読み取り権限（`r`）だけ与えて `cd` できると思う",
    whyWrong: "ディレクトリにおける `r` は中身のファイル名一覧を見る権限であり、ディレクトリへ移動（`cd`）や中身のファイルアクセスには `x`（検索権限）が必要。",
    correctApproach: "共有ディレクトリ等には `r-x`（5）や `rwx`（7）のように実行権限 `x` を含める。",
  },
];

export const lpic1KeyPaths: LpicKeyPathFact[] = [
  { id: "kp-1", target: "/etc/fstab", value: "起動時自動マウント設定", detail: "デバイス(UUID) / マウント先 / FS / オプション / dump / fsck順" },
  { id: "kp-2", target: "/etc/passwd & /etc/shadow", value: "ユーザー情報 & パスワード", detail: "passwd は全ユーザー閲覧可、shadow は root のみ閲覧可" },
  { id: "kp-3", target: "/etc/nsswitch.conf", value: "名前解決の参照順序", detail: "hosts: files dns の順で /etc/hosts と DNS を参照" },
  { id: "kp-4", target: "/etc/resolv.conf", value: "DNS サーバ指定", detail: "nameserver 8.8.8.8 / search domain.local 等を記述" },
  { id: "kp-5", target: "/etc/ssh/sshd_config", value: "SSH サーバ設定", detail: "PermitRootLogin, PasswordAuthentication, Port 等を設定" },
  { id: "kp-6", target: "~/.ssh 権限", value: "ディレクトリ 700 / 鍵 600", detail: "権限が緩いと sshd が鍵認証を拒否する" },
  { id: "kp-7", target: "umask 022", value: "ファイル 644 / ディレクトリ 755", detail: "新規作成の最大権限（666 / 777）から umask 値を減算" },
  { id: "kp-8", target: "nice 値の範囲", value: "-20（高）〜 19（低）", detail: "デフォルトは 0。負の値（優先度上げ）は root のみ指定可能" },
];

export const lpic1QuickLookup: CertFlashcardItem[] = [
  {
    keyword: "カーネルのデバイス・ドライバ情報を階層構造で公開する仮想ファイルシステム",
    category: "101: システムアーキテクチャ",
    recommended: "sysfs (/sys)",
    reason: "ハードウェアデバイスとカーネルドライバの情報を構造化して公開する。/proc はプロセス・CPU・メモリ情報中心。",
  },
  {
    keyword: "依存関係を解決しながらカーネルモジュールをロード/アンロードするコマンド",
    category: "101: システムアーキテクチャ",
    recommended: "modprobe (削除は -r)",
    reason: "insmod と異なり、modules.dep を参照して依存モジュールも自動的にロードする。",
  },
  {
    keyword: "systemd で現在のターゲットを即座に切り替えるコマンド",
    category: "101: システムアーキテクチャ",
    recommended: "systemctl isolate <target>",
    reason: "次回起動時のデフォルトを変更したい場合は systemctl set-default <target> を使用する。",
  },
  {
    keyword: "特定のファイルがどの Debian パッケージに属しているか調べる",
    category: "102: パッケージ管理",
    recommended: "dpkg -S <ファイルパス>",
    reason: "Red Hat 系（RPM）での同等コマンドは rpm -qf <ファイルパス>。",
  },
  {
    keyword: "共有ライブラリのキャッシュ（/etc/ld.so.cache）を再構築するコマンド",
    category: "102: パッケージ管理",
    recommended: "ldconfig",
    reason: "/etc/ld.so.conf や /etc/ld.so.conf.d/ を変更した後に実行して共有ライブラリのリンクを更新する。",
  },
  {
    keyword: "標準入力を画面（標準出力）に表示しつつファイルにも書き出すコマンド",
    category: "103: GNUとUnixコマンド",
    recommended: "tee (追記は -a)",
    reason: "パイプラインの途中でログをファイル保存しながら後続のコマンドや画面に流したいときに使う。",
  },
  {
    keyword: "標準エラー出力を標準出力と同じファイルにまとめてリダイレクトする",
    category: "103: GNUとUnixコマンド",
    recommended: "command > file 2>&1",
    reason: "左から評価されるため、先に > file で標準出力を向けた後に 2>&1 を指定する（または &> file）。",
  },
  {
    keyword: "プロセスが捕捉・無視できない強制終了シグナル番号と名前",
    category: "103: GNUとUnixコマンド",
    recommended: "SIGKILL (9)",
    reason: "通常終了の SIGTERM (15) は kill のデフォルトで捕捉可能だが、SIGKILL (9) は即座に強制終了する。",
  },
  {
    keyword: "実行中のプロセスの優先度（nice値）を後から変更するコマンド",
    category: "103: GNUとUnixコマンド",
    recommended: "renice <値> -p <PID>",
    reason: "コマンド起動時に指定するのが nice、起動後に変更するのが renice。",
  },
  {
    keyword: "パーティションの UUID やファイルシステム種別を確認するコマンド",
    category: "104: ファイルシステム",
    recommended: "blkid (または lsblk -f)",
    reason: "/etc/fstab に UUID=... を記述する際の確認に使う。",
  },
  {
    keyword: "ファイルシステムの空き容量を確認する df とディレクトリ使用量を確認する du",
    category: "104: ファイルシステム",
    recommended: "df -h / du -sh",
    reason: "df はマウント済みファイルシステム単位、du は指定したディレクトリ・ファイル単位の容量を集計する。",
  },
  {
    keyword: "ディレクトリ内でファイル所有者・root 以外の削除を禁止する特殊権限",
    category: "104: ファイルシステム",
    recommended: "Sticky bit (1000 / +t)",
    reason: "/tmp に設定されている（drwxrwxrwt）。数値では先頭に 1 を付ける（例: chmod 1777）。",
  },
  {
    keyword: "ログインシェル起動時に全ユーザー共通で最初に読み込まれる設定ファイル",
    category: "105: シェル・スクリプト",
    recommended: "/etc/profile",
    reason: "その後ユーザーの ~/.bash_profile（なければ ~/.bash_login → ~/.profile）が読み込まれる。",
  },
  {
    keyword: "シェルスクリプトで直前に実行したコマンドの終了ステータスを保持する変数",
    category: "105: シェル・スクリプト",
    recommended: "$?",
    reason: "0 が正常終了、0 以外が異常終了を示す。引数の個数は $#。",
  },
  {
    keyword: "既存ユーザーに既存の補助グループを維持したまま新しい補助グループを追加する",
    category: "107: 管理タスク",
    recommended: "usermod -aG <group> <user>",
    reason: "-a を付けずに -G だけ指定すると既存の補助グループが上書き削除されてしまう。",
  },
  {
    keyword: "現在のシェルやプログラムで最優先されるロケール環境変数",
    category: "107: 管理タスク",
    recommended: "LC_ALL",
    reason: "LC_ALL が設定されていると、LANG や他の LC_*（LC_TIME 等）の値をすべて上書きする。",
  },
  {
    keyword: "systemd-journald のログから特定サービスのログをリアルタイム追従表示する",
    category: "108: システムサービス",
    recommended: "journalctl -u <unit> -f",
    reason: "-u でユニット指定、-f で tail -f のようにリアルタイム表示、-k でカーネルログのみ表示。",
  },
  {
    keyword: "/etc/aliases を編集した後にデータベースを更新するために実行するコマンド",
    category: "108: システムサービス",
    recommended: "newaliases",
    reason: "MTA はバイナリ形式の aliases.db を参照するため、テキスト編集後にこのコマンドが必須。",
  },
  {
    keyword: "待ち受け中の TCP/UDP ポートと対応するプロセスを確認する（iproute2）",
    category: "109: ネットワーク",
    recommended: "ss -tulnp",
    reason: "netstat の後継コマンド。-t(TCP), -u(UDP), -l(LISTEN), -n(数値), -p(プロセス)。",
  },
  {
    keyword: "ホスト名解決で /etc/hosts と DNS のどちらを優先するか制御するファイル",
    category: "109: ネットワーク",
    recommended: "/etc/nsswitch.conf",
    reason: "hosts: files dns と書かれていれば、まず /etc/hosts(files) を引き、次に DNS を引く。",
  },
  {
    keyword: "/etc/sudoers を構文チェック付きで安全に編集するコマンド",
    category: "110: セキュリティ",
    recommended: "visudo",
    reason: "構文エラーがあると保存前に警告してくれるため、sudo が使えなくなる事故を防げる。",
  },
  {
    keyword: "対象ユーザーのログイン環境変数を読み込んでユーザーを切り替える",
    category: "110: セキュリティ",
    recommended: "su - <username>",
    reason: "ハイフン（- または -l）を付けないと元のユーザーの環境変数やカレントディレクトリが引き継がれる。",
  },
  {
    keyword: "SSH 公開鍵認証でリモートサーバ側の authorized_keys に求められるパーミッション",
    category: "110: セキュリティ",
    recommended: "600 (~/.ssh は 700)",
    reason: "他ユーザーから書き込み・読み取り可能な緩い権限だと sshd がセキュリティ上認証を拒否する。",
  },
  {
    keyword: "root 以外の全ユーザーのログインを一時的に禁止するために作成するファイル",
    category: "110: セキュリティ",
    recommended: "/etc/nologin",
    reason: "メンテナンス時などに作成し、ファイル内のテキストがログイン試行ユーザーへメッセージ表示される。",
  },
];

export const lpic1PracticeQuestions: CertQuestion[] = [
  {
    id: "q-101-1",
    domainId: "topic-101",
    domainLabel: "101: システムアーキテクチャ",
    difficulty: "基礎",
    selectCount: 1,
    question: "Linux において、依存関係を自動的に解決しながらカーネルモジュールをロードするコマンドはどれですか？",
    options: ["insmod", "modprobe", "rmmod", "lsmod"],
    correctIndices: [1],
    explanation:
      "`modprobe` は `/lib/modules/$(uname -r)/modules.dep` を参照して依存関係のあるモジュールも同時にロードします。`insmod` は依存関係を解決せず単体ファイルを指定してロードします。",
    keywords: ["modprobe", "insmod", "カーネルモジュール"],
  },
  {
    id: "q-101-2",
    domainId: "topic-101",
    domainLabel: "101: システムアーキテクチャ",
    difficulty: "標準",
    selectCount: 1,
    question: "systemd を採用した Linux で、現在のシステムを即時「マルチユーザー（CUI）モード」へ切り替えるコマンドはどれですか？",
    options: [
      "systemctl set-default multi-user.target",
      "systemctl isolate multi-user.target",
      "systemctl enable multi-user.target",
      "systemctl start runlevel3",
    ],
    correctIndices: [1],
    explanation:
      "現在のターゲットを即座に切り替えるには `systemctl isolate` を使用します。`set-default` は次回起動時のデフォルトターゲットを変更するコマンドです。",
    keywords: ["systemd", "isolate", "multi-user.target"],
  },
  {
    id: "q-102-1",
    domainId: "topic-102",
    domainLabel: "102: インストール・パッケージ管理",
    difficulty: "標準",
    selectCount: 1,
    question: "Debian 系ディストリビューションで、`/usr/bin/vim` がどのパッケージによってインストールされたか検索するコマンドはどれですか？",
    options: [
      "dpkg -L /usr/bin/vim",
      "dpkg -S /usr/bin/vim",
      "apt-cache show /usr/bin/vim",
      "rpm -qf /usr/bin/vim",
    ],
    correctIndices: [1],
    explanation:
      "Debian 系では `dpkg -S <ファイルパス>` で所属パッケージを検索します。`dpkg -L` はパッケージに含まれるファイル一覧の表示、`rpm -qf` は Red Hat 系での同等コマンドです。",
    keywords: ["dpkg -S", "rpm -qf", "パッケージ検索"],
  },
  {
    id: "q-102-2",
    domainId: "topic-102",
    domainLabel: "102: インストール・パッケージ管理",
    difficulty: "標準",
    selectCount: 1,
    question: "`/etc/ld.so.conf` に新しい共有ライブラリのディレクトリパスを追加した後、システムに認識させるために実行するコマンドはどれですか？",
    options: ["ldd", "ldconfig", "modprobe", "depmod"],
    correctIndices: [1],
    explanation:
      "`ldconfig` は `/etc/ld.so.conf` に記載されたパスを検索して `/etc/ld.so.cache` を再構築します。`ldd` は指定した実行ファイルが依存する共有ライブラリを表示するコマンドです。",
    keywords: ["ldconfig", "ldd", "共有ライブラリ"],
  },
  {
    id: "q-103-1",
    domainId: "topic-103",
    domainLabel: "103: GNUとUnixコマンド",
    difficulty: "標準",
    selectCount: 1,
    question: "コマンド `myscript.sh` の標準出力と標準エラー出力の両方を `app.log` に保存する正しい記述はどれですか？",
    options: [
      "myscript.sh 2>&1 > app.log",
      "myscript.sh > app.log 2>&1",
      "myscript.sh 1>&2 > app.log",
      "myscript.sh | app.log",
    ],
    correctIndices: [1],
    explanation:
      "リダイレクトは左から順に評価されます。`> app.log 2>&1` と書くことで、先に標準出力(1)を `app.log` に向けた後、標準エラー(2)を標準出力(1)と同じ先へ向けられます。",
    keywords: ["リダイレクト", "2>&1", "標準エラー出力"],
  },
  {
    id: "q-103-2",
    domainId: "topic-103",
    domainLabel: "103: GNUとUnixコマンド",
    difficulty: "基礎",
    selectCount: 1,
    question: "実行中のプロセス（PID: 1234）の nice 値を 10 に変更するコマンドはどれですか？",
    options: [
      "nice -n 10 1234",
      "renice 10 -p 1234",
      "ps -n 10 1234",
      "kill -10 1234",
    ],
    correctIndices: [1],
    explanation:
      "すでに実行中のプロセスの優先度を変更するには `renice` を使用します。`nice` は新しくコマンドを起動する際に優先度を指定するコマンドです。",
    keywords: ["renice", "nice", "プロセス優先度"],
  },
  {
    id: "q-103-3",
    domainId: "topic-103",
    domainLabel: "103: GNUとUnixコマンド",
    difficulty: "標準",
    selectCount: 2,
    question: "プロセスに対して強制終了（捕捉や無視ができないシグナル）を送るコマンドの組み合わせとして正しいものを 2 つ選んでください。",
    options: [
      "kill -9 2048",
      "kill -15 2048",
      "kill -s SIGKILL 2048",
      "kill -1 2048",
    ],
    correctIndices: [0, 2],
    explanation:
      "強制終了シグナルは `SIGKILL`（番号 `9`）です。`kill -9 <PID>` または `kill -s SIGKILL <PID>` で送信します。`15` は `SIGTERM`（通常終了）、`1` は `SIGHUP`（設定再読込等）です。",
    keywords: ["SIGKILL", "kill -9", "シグナル"],
  },
  {
    id: "q-104-1",
    domainId: "topic-104",
    domainLabel: "104: ファイルシステム・FHS",
    difficulty: "基礎",
    selectCount: 1,
    question: "ディレクトリ `/shared` に Sticky bit を設定し、所有者・パーミッション 1777 とするコマンドはどれですか？",
    options: [
      "chmod 4777 /shared",
      "chmod 2777 /shared",
      "chmod 1777 /shared",
      "chmod 0777 /shared",
    ],
    correctIndices: [2],
    explanation:
      "特殊権限の 8 進数表記は SUID = `4000`、SGID = `2000`、Sticky bit = `1000` です。Sticky bit が付いたディレクトリでは、ファイルの所有者と root 以外は他人のファイルを削除できなくなります。",
    keywords: ["Sticky bit", "1777", "特殊パーミッション"],
  },
  {
    id: "q-104-2",
    domainId: "topic-104",
    domainLabel: "104: ファイルシステム・FHS",
    difficulty: "標準",
    selectCount: 1,
    question: "`umask` の値が `027` のとき、新規に作成される「通常ファイル」と「ディレクトリ」のデフォルトパーミッションの組み合わせはどれですか？",
    options: [
      "ファイル: 640 / ディレクトリ: 750",
      "ファイル: 644 / ディレクトリ: 755",
      "ファイル: 750 / ディレクトリ: 750",
      "ファイル: 650 / ディレクトリ: 750",
    ],
    correctIndices: [0],
    explanation:
      "通常ファイルの最大権限 `666` から `027` をマスク（ビット減算）すると `640`（`rw-r-----`）、ディレクトリの最大権限 `777` から `027` をマスクすると `750`（`rwxr-x---`）になります。",
    keywords: ["umask", "パーミッション計算"],
  },
  {
    id: "q-104-3",
    domainId: "topic-104",
    domainLabel: "104: ファイルシステム・FHS",
    difficulty: "標準",
    selectCount: 1,
    question: "シンボリックリンクとハードリンクに関する説明として正しいものはどれですか？",
    options: [
      "ハードリンクは異なるファイルシステム（パーティション）を跨いで作成できる",
      "シンボリックリンクは元ファイルを削除してもリンク先データにアクセスできる",
      "ハードリンクは元ファイルと同じ inode 番号を共有する",
      "ディレクトリに対してはハードリンクを作成するのが一般的である",
    ],
    correctIndices: [2],
    explanation:
      "ハードリンクは元ファイルと同じ inode 番号を共有するため、一方を削除しても実体は残ります。ただしパーティション跨ぎやディレクトリへのハードリンク作成はできません（シンボリックリンク `ln -s` を使用）。",
    keywords: ["ハードリンク", "シンボリックリンク", "inode"],
  },
  {
    id: "q-105-1",
    domainId: "topic-105",
    domainLabel: "105: シェル・スクリプト",
    difficulty: "標準",
    selectCount: 1,
    question: "bash シェルスクリプト内で、直前に実行したコマンドの終了ステータス（成功時は 0）を参照する特殊変数はどれですか？",
    options: ["$0", "$#", "$?", "$$"],
    correctIndices: [2],
    explanation:
      "`$?` は直前のコマンドの終了ステータスを返します。`$0` はスクリプト名、`$#` は引数の数、`$$` は現在のシェルの PID です。",
    keywords: ["$?", "終了ステータス", "シェルスクリプト"],
  },
  {
    id: "q-105-2",
    domainId: "topic-105",
    domainLabel: "105: シェル・スクリプト",
    difficulty: "標準",
    selectCount: 1,
    question: "非ログインの対話的 bash シェルを起動したときに読み込まれるユーザー個別の設定ファイルはどれですか？",
    options: ["/etc/profile", "~/.bash_profile", "~/.bashrc", "/etc/inittab"],
    correctIndices: [2],
    explanation:
      "非ログインの対話シェル（デスクトップ環境で端末を開いたとき等）は `~/.bashrc` を読み込みます。`/etc/profile` や `~/.bash_profile` はログインシェル起動時に読み込まれます。",
    keywords: ["~/.bashrc", "ログインシェル", "設定ファイル"],
  },
  {
    id: "q-106-1",
    domainId: "topic-106",
    domainLabel: "106: UI・デスクトップ",
    difficulty: "基礎",
    selectCount: 1,
    question: "X Window System（X11）におけるクライアント・サーバモデルと環境変数 `DISPLAY` に関する説明として正しいものはどれですか？",
    options: [
      "ディスプレイやキーボードを制御して描画を行う側が X クライアントである",
      "GUI アプリケーション側が X サーバである",
      "描画を行うディスプレイ側が X サーバ、GUI アプリケーション側が X クライアントである",
      "Wayland は X11 と同じネットワーク透過プロトコルをそのまま継承している",
    ],
    correctIndices: [2],
    explanation:
      "X11 では画面・入力デバイスを管理して描画サービスを提供する側が「X サーバ」、描画を要求するアプリ側が「X クライアント」です。",
    keywords: ["X11", "Xサーバ", "DISPLAY"],
  },
  {
    id: "q-107-1",
    domainId: "topic-107",
    domainLabel: "107: 管理タスク",
    difficulty: "標準",
    selectCount: 1,
    question: "既存のユーザー `bob` について、現在所属している補助グループを保持したまま `wheel` グループを追加するコマンドはどれですか？",
    options: [
      "usermod -G wheel bob",
      "usermod -aG wheel bob",
      "useradd -G wheel bob",
      "groupadd -u bob wheel",
    ],
    correctIndices: [1],
    explanation:
      "`usermod -G` だけだと既存の補助グループが上書きされてしまいます。必ず `-a`（append）を組み合わせて `usermod -aG wheel bob` とします。",
    keywords: ["usermod -aG", "補助グループ"],
  },
  {
    id: "q-107-2",
    domainId: "topic-107",
    domainLabel: "107: 管理タスク",
    difficulty: "応用",
    selectCount: 1,
    question: "`/etc/cron.allow` と `/etc/cron.deny` の両方のファイルが存在し、ユーザー `taro` が両方のファイルに記載されている場合、どうなりますか？",
    options: [
      "cron.deny が優先されるため taro は crontab を使用できない",
      "cron.allow が優先されるため taro は crontab を使用できる",
      "設定が競合するため全ユーザーが crontab を使用できなくなる",
      "root ユーザーの承認プロンプトが表示される",
    ],
    correctIndices: [1],
    explanation:
      "`/etc/cron.allow` が存在する場合、`cron.allow` に記載されたユーザーのみが許可され、`cron.deny` は参照されません（無視されます）。",
    keywords: ["cron.allow", "cron.deny", "crontab"],
  },
  {
    id: "q-108-1",
    domainId: "topic-108",
    domainLabel: "108: 必須システムサービス",
    difficulty: "基礎",
    selectCount: 1,
    question: "メールエイリアス設定ファイル `/etc/aliases` を編集した後、変更を反映させるために実行する必要があるコマンドはどれですか？",
    options: ["mailq", "newaliases", "systemctl reload cron", "sendmail -q"],
    correctIndices: [1],
    explanation:
      "MTA は `/etc/aliases.db` を参照するため、`/etc/aliases` を編集した後は必ず `newaliases` を実行してデータベースを再生成する必要があります。",
    keywords: ["newaliases", "/etc/aliases", "MTA"],
  },
  {
    id: "q-108-2",
    domainId: "topic-108",
    domainLabel: "108: 必須システムサービス",
    difficulty: "標準",
    selectCount: 1,
    question: "systemd-journald のログから、`sshd.service` に関するメッセージのみをリアルタイムで監視（追従表示）するコマンドはどれですか？",
    options: [
      "journalctl -u sshd.service -f",
      "journalctl -k sshd.service",
      "dmesg -u sshd.service",
      "rsyslogd -f sshd.service",
    ],
    correctIndices: [0],
    explanation:
      "`journalctl -u <ユニット名>` で特定サービスのログを抽出し、`-f` オプションで最新のログをリアルタイムに出力し続けます。",
    keywords: ["journalctl", "systemd-journald", "ログ監視"],
  },
  {
    id: "q-109-1",
    domainId: "topic-109",
    domainLabel: "109: ネットワークの基礎",
    difficulty: "基礎",
    selectCount: 1,
    question: "ホスト名から IP アドレスへの名前解決において、`/etc/hosts` と DNS サーバのどちらを先に参照するかを設定するファイルはどれですか？",
    options: [
      "/etc/resolv.conf",
      "/etc/nsswitch.conf",
      "/etc/hostname",
      "/etc/services",
    ],
    correctIndices: [1],
    explanation:
      "`/etc/nsswitch.conf` の `hosts:` 行（例: `hosts: files dns`）によって参照順序が決まります。`/etc/resolv.conf` は問い合わせ先の DNS サーバの IP 等を記述するファイルです。",
    keywords: ["/etc/nsswitch.conf", "/etc/resolv.conf", "名前解決"],
  },
  {
    id: "q-109-2",
    domainId: "topic-109",
    domainLabel: "109: ネットワークの基礎",
    difficulty: "標準",
    selectCount: 2,
    question: "待ち受け状態（LISTEN）の TCP ポートと、それを開いているプロセスを確認できるコマンドを 2 つ選んでください。",
    options: [
      "ss -tlp",
      "ip route show",
      "netstat -tlp",
      "dig -t A localhost",
    ],
    correctIndices: [0, 2],
    explanation:
      "`ss -tlp`（iproute2）および従来の `netstat -tlp`（net-tools）は、待ち受け中の TCP ソケット（`-t -l`）とプロセス情報（`-p`）を表示します。",
    keywords: ["ss", "netstat", "LISTEN ポート"],
  },
  {
    id: "q-110-1",
    domainId: "topic-110",
    domainLabel: "110: セキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question: "SSH 公開鍵認証でリモートサーバへログインできない原因を調査したところ、サーバ側のファイル権限に問題がありました。適切なパーミッションの組み合わせはどれですか？",
    options: [
      "~/.ssh が 777、~/.ssh/authorized_keys が 644",
      "~/.ssh が 700、~/.ssh/authorized_keys が 600",
      "~/.ssh が 600、~/.ssh/authorized_keys が 700",
      "~/.ssh が 755、~/.ssh/authorized_keys が 666",
    ],
    correctIndices: [1],
    explanation:
      "SSH サーバ（sshd）はセキュリティ上、他ユーザーからアクセス・改ざん可能な権限を拒否します。`~/.ssh` ディレクトリは `700`、`authorized_keys`（および秘密鍵）は `600` に設定するのが標準です。",
    keywords: ["SSH 公開鍵認証", "authorized_keys", "パーミッション"],
  },
];

// 出典: Linux Professional Institute (LPI) 公式リソース
export const lpic1OfficialResources: LpicOfficialResource[] = [
  {
    title: "LPI 公式 LPIC-1 認定概要ページ",
    description: "LPIC-1 の試験構成（101-500 / 102-500）、認定要件、有効期限の公式情報です。",
    url: "https://www.lpi.org/our-certifications/lpic-1-overview/",
    badge: "公式",
  },
  {
    title: "Exam 101 Objectives（出題範囲 Version 5.0）",
    description: "Topic 101〜104 の詳細な出題項目・重要ファイル・コマンド一覧の一次情報です。",
    url: "https://wiki.lpi.org/wiki/LPIC-1_Objectives_V5.0#Exam_101",
    badge: "試験範囲",
  },
  {
    title: "Exam 102 Objectives（出題範囲 Version 5.0）",
    description: "Topic 105〜110 の詳細な出題項目・重要ファイル・コマンド一覧の一次情報です。",
    url: "https://wiki.lpi.org/wiki/LPIC-1_Objectives_V5.0#Exam_102",
    badge: "試験範囲",
  },
  {
    title: "LPI Learning Materials（公式無料教材）",
    description: "LPI が無償公開している LPIC-1（101 / 102）向けの公式テキスト・演習問題です。",
    url: "https://learning.lpi.org/en/learning-materials/lpic-1/",
    badge: "公式教材",
  },
];
