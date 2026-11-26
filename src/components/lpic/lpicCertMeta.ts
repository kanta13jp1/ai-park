import type { CertPassingConfig } from "../certification/types";

export type LpicLevel = "lpic-1" | "lpic-2" | "lpic-300" | "lpic-303" | "lpic-305" | "lpic-306";

export const LPIC_LEVELS: readonly LpicLevel[] = [
  "lpic-1",
  "lpic-2",
  "lpic-300",
  "lpic-303",
  "lpic-305",
  "lpic-306",
];

export interface LpicLevelMeta {
  id: LpicLevel;
  label: string;
  badgeText: string;
  shortExamCode: string;
  headline: string;
  description: string;
  storageKey: string;
  examFilters: { id: string; label: string }[];
  defaultExpanded: Record<string, boolean>;
  passingConfig: CertPassingConfig;
  quizBadgeLabel: string;
  flashcardTitle: string;
  quickSearchChips: string[];
  examDayChecklist: {
    subtitle: string;
    tips: { title: string; body: string }[];
  };
}

export const LPIC_LEVEL_META: Record<LpicLevel, LpicLevelMeta> = {
  "lpic-1": {
    id: "lpic-1",
    label: "LPIC-1 (101 / 102)",
    badgeText: "LPIC-1 (101 / 102) STUDY HUB",
    shortExamCode: "101-500 / 102-500",
    headline: "LPIC-1（101-500 / 102-500）",
    description:
      "LPI 公式試験範囲（Version 5.0）の Topic 101〜110 に沿って、コマンド比較表・フラッシュカード暗記・択一＆複数選択の実践問題をまとめた学習ページです。学習記録はブラウザに自動保存されます。",
    storageKey: "ai-park-lpic-1-progress-v1",
    examFilters: [
      { id: "all", label: "全トピック (101-110)" },
      { id: "101-500", label: "Exam 101-500 (101-104)" },
      { id: "102-500", label: "Exam 102-500 (105-110)" },
    ],
    defaultExpanded: { "topic-101": true },
    passingConfig: {
      minScore: 200,
      maxScore: 800,
      passingScore: 500,
      passingPct: 63,
      officialExamLabel: "LPIC-1 本試験（101-500 / 102-500）",
    },
    quizBadgeLabel: "LPIC-1 (101/102) 演習",
    flashcardTitle: "要件・用途 → コマンド / 設定ファイル 即答トレーニング",
    quickSearchChips: ["lsmod", "systemctl", "dpkg", "rpm", "chmod", "umask", "ss", "cron"],
    examDayChecklist: {
      subtitle:
        "LPIC-1（101-500 / 102-500）は各90分・60問の試験です。記述問題での正確なコマンド・パス入力と時間配分が合格（500点）の鍵になります。",
      tips: [
        {
          title: "時間配分：1問約90秒ペース（90分・60問）",
          body: "30問経過時点で残り45分前後が目安です。長考しそうな設問は仮選択・見直しフラグを活用し、まず60問すべてに目を通して解答し切るのが確実です。",
        },
        {
          title: "記述（穴埋め）対策：オプション・パスの正確な綴り",
          body: "選択問題に加えて記述（穴埋め）問題が出題されます。コマンド名・オプション・設定ファイルパス（例: /etc/fstab 等）は大文字・小文字を含め、タブ補完なしで正確に入力できるよう整理しておきます。",
        },
        {
          title: "合格条件・認定要件：500/800点（2科目合格）",
          body: "200〜800点スケールで 500 点以上が合格ラインです。LPIC-1 に前提資格はありませんが、認定取得には 101-500 と 102-500 の2科目両方に合格する必要があります（認定の有効期間は5年間）。",
        },
        {
          title: "受験環境準備：ピアソンVUE / OnVUE の事前確認",
          body: "予約前に LPI ID（LPI アカウント）との紐付けを確認し、当日は規定の有効な本人確認書類を準備します。OnVUE オンライン受験では事前のシステムテストと受験環境（静かな個室・机上整理）の確認が必須です。",
        },
      ],
    },
  },
  "lpic-2": {
    id: "lpic-2",
    label: "LPIC-2 (201 / 202)",
    badgeText: "LPIC-2 (201 / 202) STUDY HUB",
    shortExamCode: "201-450 / 202-450",
    headline: "LPIC-2（201-450 / 202-450）",
    description:
      "LPI 公式試験範囲（Version 4.5）の Topic 200〜212 に沿って、カーネル・LVM/RAID・BIND・Nginx/Apache・Samba/NFS・PAM・Postfix・iptables 等の実務＆試験対策をまとめた学習ページです。",
    storageKey: "ai-park-lpic-2-progress-v1",
    examFilters: [
      { id: "all", label: "全トピック (200-212)" },
      { id: "201-450", label: "Exam 201-450 (200-206)" },
      { id: "202-450", label: "Exam 202-450 (207-212)" },
    ],
    defaultExpanded: { "topic-200": true },
    passingConfig: {
      minScore: 200,
      maxScore: 800,
      passingScore: 500,
      passingPct: 63,
      officialExamLabel: "LPIC-2 本試験（201-450 / 202-450）",
    },
    quizBadgeLabel: "LPIC-2 (201/202) 演習",
    flashcardTitle: "LPIC-2 要件・運用課題 → コマンド / 設定 即答トレーニング",
    quickSearchChips: ["vmstat", "mdadm", "lvextend", "BIND", "Nginx", "NFS", "PAM"],
    examDayChecklist: {
      subtitle:
        "LPIC-2（201-450 / 202-450）は各90分・60問の試験です。サービス設定ディレクティブの正確な綴りと前提資格の確認が重要になります。",
      tips: [
        {
          title: "時間配分：1問約90秒ペース（90分・60問）",
          body: "201・202 それぞれ 90 分で 60 問（1問約90秒）です。設定ファイルや出力結果の読み取りに時間を使いすぎないよう、迷う問題は見直しフラグを付けてテンポ良く進めます。",
        },
        {
          title: "記述（穴埋め）対策：オプション・パスの正確な綴り",
          body: "選択問題に加え、コマンド・オプション・設定ファイルパス・設定パラメータ名を入力する記述問題が出題されます。LVM/RAID・BIND・Apache/Nginx・PAM などの主要パスと綴りを正確に押さえておきます。",
        },
        {
          title: "合格条件・前提資格：500/800点・有効な LPIC-1",
          body: "各科目とも 200〜800 点スケールで 500 点以上が合格ラインです。LPIC-2 の認定取得には 201-450 と 202-450 の合格に加え、有効（ACTIVE）な LPIC-1 認定の保持が必要です。",
        },
        {
          title: "受験環境準備：ピアソンVUE / OnVUE の事前確認",
          body: "LPI ID の紐付けと有効な本人確認書類を事前に確認します。OnVUE オンライン受験を利用する場合は、本番と同じ PC・ネットワーク環境で事前のシステムテストを必ず完了させてください。",
        },
      ],
    },
  },
  "lpic-300": {
    id: "lpic-300",
    label: "LPIC-3 300 混在環境",
    badgeText: "LPIC-3 300 MIXED ENVIRONMENTS",
    shortExamCode: "300-300",
    headline: "LPIC-3 Mixed Environments（300-300）",
    description:
      "LPI 公式試験範囲（Version 3.0）の Topic 301〜305 に沿って、Samba AD DC・Windows ACL/DFS・SSSD/Winbind 統合・FreeIPA・NFSv4+Kerberos をまとめた学習ページです。",
    storageKey: "ai-park-lpic-300-progress-v1",
    examFilters: [{ id: "all", label: "全トピック (301-305)" }],
    defaultExpanded: { "topic-301": true },
    passingConfig: {
      minScore: 200,
      maxScore: 800,
      passingScore: 500,
      passingPct: 63,
      officialExamLabel: "LPIC-3 300 本試験（300-300）",
    },
    quizBadgeLabel: "LPIC-3 300-300 演習",
    flashcardTitle: "LPIC-3 300 混在環境・Samba/FreeIPA 即答トレーニング",
    quickSearchChips: ["smbd", "SSSD", "Winbind", "acl_xattr", "FreeIPA", "krb5p"],
    examDayChecklist: {
      subtitle:
        "LPIC-3 300（300-300）は90分・60問の上級専門試験です。Samba / AD / FreeIPA の設定項目と前提資格の確認が合格（500点）の鍵になります。",
      tips: [
        {
          title: "時間配分：1問約90秒ペース（90分・60問）",
          body: "60問を90分で解答するため 1 問約 90 秒が目安です。smb.conf や SSSD の設定断片を読み解く設問は時間を要しやすいため、見直しフラグを活用して全問解答を優先します。",
        },
        {
          title: "記述（穴埋め）対策：オプション・パスの正確な綴り",
          body: "選択問題と記述（穴埋め）問題が混在します。Samba デーモン名（smbd / winbindd 等）、samba-tool サブコマンド、smb.conf のパラメータや /etc/sssd/sssd.conf 等のパスを正確な綴りで整理しておきます。",
        },
        {
          title: "合格条件・前提資格：500/800点・有効な LPIC-2",
          body: "200〜800 点スケールで 500 点以上が合格ラインです。300-300 は 1 科目合格で LPIC-3 Mixed Environments 認定となりますが、認定には有効（ACTIVE）な LPIC-2 認定の保持が必要です。",
        },
        {
          title: "受験環境準備：ピアソンVUE / OnVUE の事前確認",
          body: "受験予約時の LPI ID 一致と有効な本人確認書類を確認しておきます。OnVUE オンライン受験の場合は、事前のシステムテストと試験規定に沿った個室環境の準備が必須です。",
        },
      ],
    },
  },
  "lpic-303": {
    id: "lpic-303",
    label: "LPIC-3 303 セキュリティ",
    badgeText: "LPIC-3 303 SECURITY",
    shortExamCode: "303-300",
    headline: "LPIC-3 Security（303-300）",
    description:
      "LPI 公式試験範囲（Version 3.0）の Topic 331〜335 に沿って、X.509/PKI・DNSSEC・AIDE/auditd・SELinux/AppArmor・nftables/WireGuard・脆弱性評価をまとめた学習ページです。",
    storageKey: "ai-park-lpic-303-progress-v1",
    examFilters: [{ id: "all", label: "全トピック (331-335)" }],
    defaultExpanded: { "topic-331": true },
    passingConfig: {
      minScore: 200,
      maxScore: 800,
      passingScore: 500,
      passingPct: 63,
      officialExamLabel: "LPIC-3 303 本試験（303-300）",
    },
    quizBadgeLabel: "LPIC-3 303-300 演習",
    flashcardTitle: "LPIC-3 303 暗号・MAC・監査・VPN 即答トレーニング",
    quickSearchChips: ["SELinux", "AppArmor", "LUKS", "WireGuard", "nftables", "AIDE"],
    examDayChecklist: {
      subtitle:
        "LPIC-3 303（303-300）は90分・60問のセキュリティ専門試験です。暗号・MAC・監査・VPN の正確なコマンド構文とパス知識が求められます。",
      tips: [
        {
          title: "時間配分：1問約90秒ペース（90分・60問）",
          body: "90分で60問（1問約90秒）の構成です。SELinux ポリシーや nftables ルール・OpenSSL オプションの読み取りで迷ったら仮選択＋見直しフラグで進め、記述問題に時間を残します。",
        },
        {
          title: "記述（穴埋め）対策：オプション・パスの正確な綴り",
          body: "選択問題に加え記述（穴埋め）問題が出題されます。semanage / restorecon / cryptsetup / wg / auditctl 等のコマンドや、/etc/audit/auditd.conf・/etc/aide.conf などの設定パス・オプションを正確に綴れるようにします。",
        },
        {
          title: "合格条件・前提資格：500/800点・有効な LPIC-2",
          body: "200〜800 点スケールで 500 点以上が合格ラインです。303-300 は 1 科目合格で LPIC-3 Security 認定となりますが、認定には有効（ACTIVE）な LPIC-2 認定の保持が必要です。",
        },
        {
          title: "受験環境準備：ピアソンVUE / OnVUE の事前確認",
          body: "LPI ID の確認と規定の有効な本人確認書類の準備を済ませておきます。OnVUE オンライン受験を利用する際は、事前にシステムテストを実施し、通信やカメラ要件を確認してください。",
        },
      ],
    },
  },
  "lpic-305": {
    id: "lpic-305",
    label: "LPIC-3 305 仮想化・コンテナ",
    badgeText: "LPIC-3 305 VIRTUALIZATION & CONTAINERS",
    shortExamCode: "305-300",
    headline: "LPIC-3 Virtualization & Containerization（305-300）",
    description:
      "LPI 公式試験範囲（Version 3.0）の Topic 351〜353 に沿って、KVM/QEMU/Xen/libvirt・Namespaces/cgroups/OCI・Docker/LXC・Packer/cloud-init/Vagrant をまとめた学習ページです。",
    storageKey: "ai-park-lpic-305-progress-v1",
    examFilters: [{ id: "all", label: "全トピック (351-353)" }],
    defaultExpanded: { "topic-351": true },
    passingConfig: {
      minScore: 200,
      maxScore: 800,
      passingScore: 500,
      passingPct: 63,
      officialExamLabel: "LPIC-3 305 本試験（305-300）",
    },
    quizBadgeLabel: "LPIC-3 305-300 演習",
    flashcardTitle: "LPIC-3 305 仮想化・コンテナ・自動化 即答トレーニング",
    quickSearchChips: ["KVM", "qcow2", "virsh", "Docker", "LXC", "Packer", "cloud-init"],
    examDayChecklist: {
      subtitle:
        "LPIC-3 305（305-300）は90分・60問の仮想化・コンテナ専門試験です。KVM / libvirt / コンテナ / プロビジョニングツールの正確なコマンド整理が鍵です。",
      tips: [
        {
          title: "時間配分：1問約90秒ペース（90分・60問）",
          body: "90分で60問（1問約90秒）のペース配分を意識し、30問時点で残り45分前後を目安に進めます。XML 定義や cloud-init の設定読み取りで立ち止まりすぎないようフラグ機能を活用します。",
        },
        {
          title: "記述（穴埋め）対策：オプション・パスの正確な綴り",
          body: "選択問題に加えて記述（穴埋め）問題が含まれます。virsh・qemu-img・xl・docker・lxc 系のサブコマンドや、/etc/libvirt/qemu/ などの関連パス・オプションの正確な綴りを整理しておきます。",
        },
        {
          title: "合格条件・前提資格：500/800点・有効な LPIC-2",
          body: "200〜800 点スケールで 500 点以上が合格ラインです。305-300 は 1 科目合格で LPIC-3 Virtualization and Containerization 認定となりますが、認定には有効（ACTIVE）な LPIC-2 認定の保持が必要です。",
        },
        {
          title: "受験環境準備：ピアソンVUE / OnVUE の事前確認",
          body: "ピアソンVUE 予約時の LPI ID と有効な本人確認書類を確認します。OnVUE オンライン受験では、事前システムテストの完了と静かな個室環境の確保が必要です。",
        },
      ],
    },
  },
  "lpic-306": {
    id: "lpic-306",
    label: "LPIC-3 306 高可用性",
    badgeText: "LPIC-3 306 HIGH AVAILABILITY & STORAGE",
    shortExamCode: "306-300",
    headline: "LPIC-3 High Availability & Storage Clusters（306-300）",
    description:
      "LPI 公式試験範囲（Version 3.0）の Topic 361〜364 に沿って、Pacemaker/Corosync/STONITH・Keepalived/HAProxy・DRBD/GFS2・GlusterFS/Ceph・Bonding をまとめた学習ページです。",
    storageKey: "ai-park-lpic-306-progress-v1",
    examFilters: [{ id: "all", label: "全トピック (361-364)" }],
    defaultExpanded: { "topic-361": true },
    passingConfig: {
      minScore: 200,
      maxScore: 800,
      passingScore: 500,
      passingPct: 63,
      officialExamLabel: "LPIC-3 306 本試験（306-300）",
    },
    quizBadgeLabel: "LPIC-3 306-300 演習",
    flashcardTitle: "LPIC-3 306 クラスタ・分散ストレージ・冗長化 即答トレーニング",
    quickSearchChips: ["Pacemaker", "Keepalived", "HAProxy", "DRBD", "Ceph", "Bonding"],
    examDayChecklist: {
      subtitle:
        "LPIC-3 306（306-300）は90分・60問の高可用性・ストレージ専門試験です。Pacemaker / HAProxy / DRBD / Ceph のコマンドと構成知識を正確に押さえます。",
      tips: [
        {
          title: "時間配分：1問約90秒ペース（90分・60問）",
          body: "90分で60問（1問あたり約90秒）です。クラスタ構成やフェンシング・スプリットブレイン対策のシナリオ設問に時間をかけすぎないよう、見直しフラグを使ってペースを保ちます。",
        },
        {
          title: "記述（穴埋め）対策：オプション・パスの正確な綴り",
          body: "選択問題と記述（穴埋め）問題が出題されます。crm / pcs・corosync・drbdadm・ceph・keepalived・haproxy に関連するコマンド、設定ファイルパス、重要ディレクティブの正確な綴りを定着させます。",
        },
        {
          title: "合格条件・前提資格：500/800点・有効な LPIC-2",
          body: "200〜800 点スケールで 500 点以上が合格ラインです。306-300 は 1 科目合格で LPIC-3 High Availability and Storage Clusters 認定となりますが、認定には有効（ACTIVE）な LPIC-2 認定の保持が必要です。",
        },
        {
          title: "受験環境準備：ピアソンVUE / OnVUE の事前確認",
          body: "受験前に LPI ID とピアソンVUE アカウントの紐付け、および有効な本人確認書類を確認します。OnVUE オンライン受験では事前のシステムテストと周囲環境の準備が必須です。",
        },
      ],
    },
  },
};
