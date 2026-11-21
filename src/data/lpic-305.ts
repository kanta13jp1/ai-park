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

export interface Lpic305Domain {
  id: string;
  exam: "305-300";
  number: string;
  title: string;
  englishTitle: string;
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  summary: string;
  topics: LpicTopicItem[];
}

// 出典: Linux Professional Institute (LPI) LPIC-3 Virtualization and Containerization Version 3.0 (Exam 305-300) 公式試験概要・Objectives
export const lpic305ExamFacts: CertExamFact[] = [
  { label: "対象試験", value: "305-300", detail: "1科目合格で LPIC-3 認定" },
  { label: "試験時間", value: "90 分", detail: "選択・記述（穴埋め）混在" },
  { label: "問題数", value: "60 問", detail: "仮想化・コンテナ技術" },
  { label: "合格ライン", value: "500 点", detail: "200〜800 点スケール" },
  { label: "前提資格", value: "LPIC-2 保持", detail: "有効な LPIC-2 認定が必要" },
  { label: "受験形式", value: "ピアソンVUE", detail: "テストセンター / OnVUE（5年間有効）" },
];

// 出典: LPI LPIC-305 Objectives V3.0 (Topic 351 - 353)
export const lpic305Domains: Lpic305Domain[] = [
  {
    id: "topic-351",
    exam: "305-300",
    number: "351",
    title: "フル仮想化",
    englishTitle: "Full Virtualization",
    accentColor: "indigo",
    summary: "仮想化理論（Type1/2、P2V/V2V）、Xen（Dom0/DomU/xl）、QEMU/KVM/VirtIO、および libvirt（virsh・ストレージプール・ライブマイグレーション）を学びます。",
    topics: [
      {
        id: "351-1",
        code: "351.1 - 351.2",
        title: "仮想化概念・P2V/V2V・Xen アーキテクチャ",
        commands: ["xl list", "xl create", "xl console", "virt-v2v", "virt-p2v", "systemd-machined"],
        keyPoints: [
          "Type-1（ベアメタル）vs Type-2（ホスト型）ハイパーバイザ、ハードウェア支援仮想化（Intel VT-x / AMD-V）と準仮想化（PV / PVHVM）",
          "P2V（物理→仮想）および V2V（仮想→仮想）マイグレーションの概念（`virt-v2v` など）",
          "Xen 4.x 構成: 特権ドメイン `Dom0`（ハードウェア制御・管理）とゲストドメイン `DomU`、`xl` コマンドおよび XenStore / XAPI",
        ],
        examTip: "Xen の管理コマンドは旧 `xm` から現行 `xl` へ移行しており、`Dom0` と `DomU` の役割分担は頻出です。",
      },
      {
        id: "351-2",
        code: "351.3 - 351.4",
        title: "QEMU / KVM / VirtIO と libvirt (virsh)",
        commands: ["qemu-system-x86_64", "qemu-img", "virsh", "virt-install", "virtlogd", "virtlockd"],
        keyPoints: [
          "KVM は Linux カーネルモジュール（`/dev/kvm`）として動作し、QEMU がデバイスエミュレーションと VirtIO 準仮想化ドライバ（ネットワーク・ブロックI/O）を提供",
          "`qemu-img create -f qcow2 disk.qcow2 20G` やバッキングファイル（`-b` / `-F`）による差分ディスク・スナップショット管理",
          "`libvirt`（`libvirtd` / `virtlogd` / `virtlockd`）: `/etc/libvirt/qemu/*.xml` 定義、`virsh list --all`, `virsh start/shutdown/destroy`, `virsh snapshot-create-as`",
          "`virsh migrate --live` によるライブマイグレーション、ストレージプール（dir / lvm / iscsi）と仮想ネットワーク（NAT / Bridge）管理",
        ],
        examTip: "`virsh shutdown` はゲスト OS への ACPI 正常終了シグナル、`virsh destroy` は強制電源断（設定やディスクは削除されない、削除は `undefine`）です。",
      },
    ],
  },
  {
    id: "topic-352",
    exam: "305-300",
    number: "352",
    title: "コンテナ仮想化",
    englishTitle: "Container Virtualization",
    accentColor: "cyan",
    summary: "Linux カーネル技術（Namespaces/cgroups/Capabilities/seccomp）・OCI/runc/containerd/Podman、LXC/LXD、Docker、および Kubernetes/Compose 等を習得します。",
    topics: [
      {
        id: "352-1",
        code: "352.1 - 352.2",
        title: "コンテナカーネル機構・OCI と LXC / LXD",
        commands: ["unshare", "nsenter", "runc", "podman", "buildah", "skopeo", "lxc launch", "lxc exec"],
        keyPoints: [
          "Linux コンテナの隔離・制限基盤: Namespaces（pid, net, mnt, uts, ipc, user, cgroup）、cgroups（リソース上限）、Capabilities、seccomp / SELinux / AppArmor",
          "OCI（Open Container Initiative）仕様（runtime-spec / image-spec）、低レベルランタイム `runc` と高レベル `containerd` / CRI-O",
          "デーモンレス・ルートレス対応ツール群: `podman`（実行）、`buildah`（イメージ構築）、`skopeo`（レジストリ間コピー・検査）",
          "LXC / LXD: システムコンテナ（OS 全体に近い init 動作）を `lxc launch` / `lxc config` / `lxc profile` で管理",
        ],
        examTip: "プロセスやネットワーク等の「見え方を分離」するのが Namespaces、CPU・メモリ等の「資源使用量を制限」するのが cgroups です。",
      },
      {
        id: "352-2",
        code: "352.3 - 352.4",
        title: "Docker 運用・Dockerfile・オーケストレーション",
        commands: ["docker build", "docker run", "docker volume", "docker network", "docker compose", "kubectl", "helm"],
        keyPoints: [
          "Dockerfile 主要命令: `FROM`, `RUN`, `COPY` / `ADD`, `ENV`, `WORKDIR`, `EXPOSE`, `USER`, `ENTRYPOINT`, `CMD`（マルチステージビルドによる軽量化）",
          "永続データ（名前付きボリューム `docker volume` / バインドマウント `-v`）とネットワーク（bridge / host / none / overlay）",
          "オーケストレーション: `Docker Compose`（単一ホスト複数コンテナ定義）、`Docker Swarm`、`Kubernetes`（Pod / Deployment / Service）・`Helm`（Chart パッケージ）",
        ],
        examTip: "`COPY` と `ADD` の違い（`ADD` は tar 自動展開や URL 取得機能があるが通常は `COPY` 推奨）、`ENTRYPOINT` と `CMD` の組み合わせは頻出です。",
      },
    ],
  },
  {
    id: "topic-353",
    exam: "305-300",
    number: "353",
    title: "VM デプロイとプロビジョニング",
    englishTitle: "VM Deployment and Provisioning",
    accentColor: "emerald",
    summary: "クラウド管理基盤（OpenStack/Terraform）、Packer によるゴールデンイメージ作成、cloud-init による初期設定自動化、Vagrant を学びます。",
    topics: [
      {
        id: "353-1",
        code: "353.1 - 353.4",
        title: "OpenStack / Terraform・Packer・cloud-init・Vagrant",
        commands: ["terraform init", "terraform plan", "terraform apply", "packer build", "cloud-init", "vagrant up"],
        keyPoints: [
          "クラウドサービスモデル（IaaS / PaaS / SaaS）と OpenStack（Nova, Neutron, Cinder, Glance, Keystone）および Terraform（IaC: HCL, State, `plan`/`apply`）",
          "Packer: 単一のテンプレート（HCL2 / JSON）から KVM/QEMU、AWS AMI、LXC 等複数プラットフォーム向けマシンイメージを自動ビルド",
          "`cloud-init`: 汎用クラウドイメージ初回起動時に `user-data`（YAML: `#cloud-config`）やメタデータから SSH 鍵・ユーザー・パッケージ・ディスク拡張を自動設定",
          "Vagrant: `Vagrantfile` と Box を用いてローカル開発用 VM（VirtualBox / libvirt 等）を再現性高く構築（`vagrant up` / `ssh` / `provision` / `destroy`）",
        ],
        examTip: "`#cloud-config` ヘッダから始まる cloud-init user-data の書式と、Packer（事前イメージ作成）vs cloud-init（起動時初期化）の役割分担は定番です。",
      },
    ],
  },
];

export const lpic305Comparisons: LpicComparisonTable[] = [
  {
    id: "vm-vs-container",
    category: "仮想化アーキテクチャ",
    title: "フル仮想化（KVM/Xen）vs コンテナ仮想化（Docker/LXC）",
    subtitle: "LPIC-3 351 / 352 隔離レベルとカーネル共有",
    columns: ["比較項目", "フル仮想化 (KVM / Xen)", "コンテナ (Docker / LXC / Podman)"],
    rows: [
      { feature: "ゲスト OS カーネル", values: ["VM ごとに独立したゲストカーネルを実行", "ホストの Linux カーネルを全コンテナで共有"] },
      { feature: "隔離機構", values: ["ハイパーバイザ＋ハードウェア支援 (VT-x/AMD-V)", "カーネル Namespaces ＋ cgroups ＋ seccomp/MAC"] },
      { feature: "起動速度・オーバーヘッド", values: ["秒〜数十秒、OS 起動分のメモリ消費", "ミリ秒〜数秒、極めて軽量"] },
      { feature: "別 OS（Windows 等）の実行", values: ["可能", "不可（ホストと同一カーネル ABI の Linux のみ）"] },
    ],
    decisionRule: "異なるカーネル・Windows VM・強固なハイパーバイザ分離が必要なら KVM/Xen、軽量・高速な Linux ワークロード集約はコンテナ。",
  },
  {
    id: "qemu-disk-formats",
    category: "ストレージ形式",
    title: "QEMU 仮想ディスク形式比較（raw vs qcow2）",
    subtitle: "LPIC-3 351.3 `qemu-img` イメージ特性",
    columns: ["項目", "raw", "qcow2 (QEMU Copy-On-Write v2)"],
    rows: [
      { feature: "スナップショット・Copy-on-Write", values: ["イメージ単体では非対応", "対応（内部スナップショット・バッキングファイル可）"] },
      { feature: "シンプロビジョニング（スパース）", values: ["ファイルシステム依存（スパースファイル時は可）", "標準対応（実使用量に応じて拡張・圧縮可）"] },
      { feature: "I/O パフォーマンス", values: ["メタデータ変換がなくオーバーヘッド最小", "クラスタ参照のわずかなオーバーヘッドあり"] },
    ],
    decisionRule: "スナップショットやベースイメージからの差分クローン（backing file）を使う場合は `qcow2`、純粋な生性能最優先は `raw`。",
  },
  {
    id: "lxc-vs-docker",
    category: "コンテナ技術",
    title: "システムコンテナ（LXC/LXD）vs アプリコンテナ（Docker/OCI）",
    subtitle: "LPIC-3 352.1 - 352.3 設計思想の違い",
    columns: ["項目", "LXC / LXD（システムコンテナ）", "Docker / Podman（アプリコンテナ）"],
    rows: [
      { feature: "主な用途", values: ["軽量 VM のように複数プロセス・systemd/SSH を動かす", "1 コンテナ 1 プロセス（マイクロサービス・イミュータブル）"] },
      { feature: "イメージ構築方法", values: ["稼働中コンテナを更新・スナップショットしてイメージ化", "`Dockerfile` / `Containerfile` から宣言的にレイヤビルド"] },
      { feature: "状態保持", values: ["ステートフル運用が多い（永続ディスク前提）", "ステートレス前提（データは Volume へ外出し）"] },
    ],
    decisionRule: "従来型 OS 運用の軽量代替は LXC/LXD、CI/CD でレイヤビルドして使い捨てデプロイするアプリ基盤は Docker/OCI。",
  },
  {
    id: "provisioning-tools",
    category: "プロビジョニング",
    title: "VM 構築・プロビジョニングツール役割比較",
    subtitle: "LPIC-3 353 Packer / cloud-init / Vagrant / Terraform",
    columns: ["ツール", "主なフェーズ・役割", "代表設定ファイル"],
    rows: [
      { feature: "Terraform", values: ["クラウド/仮想基盤（VM・NW・LB）のインフラリソース作成", "`*.tf` (HCL)"] },
      { feature: "Packer", values: ["各クラウド/ハイパーバイザ向けの事前ビルド済みイメージ作成", "`*.pkr.hcl` / `template.json`"] },
      { feature: "cloud-init", values: ["クラウド VM 初回起動時のユーザー・SSH鍵・初期スクリプト設定", "`user-data` (`#cloud-config`)"] },
      { feature: "Vagrant", values: ["ローカル環境での再現可能な開発用仮想マシン自動構築", "`Vagrantfile`"] },
    ],
    decisionRule: "Packer で「黄金イメージ」を焼き、Terraform で VM を展開し、cloud-init で「起動時の個別設定（IP・鍵等）」を注入するのが王道。",
  },
];

export const lpic305Patterns: LpicWorkflowPattern[] = [
  {
    id: "kvm-qcow2-clone",
    title: "qcow2 バッキングファイルを用いた高速差分 VM 展開フロー",
    badge: "351.3 - 351.4",
    flow: ["ベースイメージ準備 (base.qcow2)", "qemu-img create -f qcow2 -F qcow2 -b base.qcow2 vm1.qcow2", "virt-install --import", "virsh list / console"],
    summary: "読み取り専用ベースイメージを共有し、各 VM は変更差分だけを書き込むことでディスクと展開時間を節約する手法です。",
    keyDesignPoints: [
      "ベースイメージ（backing file）を後から直接変更・起動すると全子イメージが破損するため、必ず読み取り専用にする",
      "`qemu-img info vm1.qcow2` でどのバッキングファイルに依存しているか確認できる",
    ],
  },
  {
    id: "libvirt-live-migrate",
    title: "libvirt (virsh) ライブマイグレーション実行フロー",
    badge: "351.4",
    flow: ["共有ストレージ / ネットワーク疎通確認", "ホスト間名前解決・時刻同期", "virsh migrate --live <vm> qemu+ssh://dst/system", "移行先で virsh list 確認"],
    summary: "稼働中の KVM 仮想マシンを無停止のまま別の物理ハイパーバイザへ移動する手順です。",
    keyDesignPoints: [
      "両ホストから同一の共有ストレージ（NFS/iSCSI/Ceph等）へアクセスできるか、`--copy-storage-all` を併用する",
      "CPU モデルの互換性がない場合は共通のベース CPU モデルを VM の XML に指定しておく",
    ],
  },
  {
    id: "multistage-docker",
    title: "Dockerfile マルチステージビルドによる軽量セキュアイメージ作成",
    badge: "352.3",
    flow: ["FROM golang AS builder", "コンパイル実行", "FROM alpine / distroless", "COPY --from=builder", "USER nonroot 設定"],
    summary: "ビルド用コンパイラや開発ツールを最終イメージから排除し、攻撃面とサイズを最小化するコンテナパターンです。",
    keyDesignPoints: [
      "最終ステージではルート以外の非特権ユーザー（`USER` 命令）を指定する",
      "`.dockerignore` を配置して `.git` や不要ファイル・機密情報がビルドコンテキストに送られるのを防ぐ",
    ],
  },
  {
    id: "packer-cloudinit",
    title: "Packer ＋ cloud-init によるゴールデンイメージパイプライン",
    badge: "353.2 - 353.3",
    flow: ["Packer でベース OS インストール", "cloud-init 導入・machine-id 初期化", "qcow2 / AMI 出力", "Terraform + user-data で本番展開"],
    summary: "不変インフラ（Immutable Infrastructure）を実現する VM イメージ自動ビルド〜デプロイの流れです。",
    keyDesignPoints: [
      "イメージをテンプレート化する際は `/etc/machine-id` を空にし SSH ホスト鍵を削除しておき、起動時に cloud-init で固有生成させる",
      "テスト時にはローカルの ISO（NoCloud データソース `cidata`）を使って cloud-init 動作を検証できる",
    ],
  },
];

export const lpic305Pitfalls: LpicPitfall[] = [
  {
    id: "pit305-1",
    trap: "稼働中の仮想マシンを停止したくて `virsh destroy <vm>` を実行したらデータや定義が消えると思い込む（または逆に安全にシャットダウンされると思う）",
    whyWrong: "`virsh destroy` は VM のディスクや XML 定義を削除するコマンドではなく「物理マシンの電源ケーブルを抜くような即時強制停止」である。",
    correctApproach: "OS を正常終了するには `virsh shutdown`、完全に定義を削除するには停止後に `virsh undefine` を使う。",
  },
  {
    id: "pit305-2",
    trap: "Docker コンテナを停止・再作成してもコンテナ内の `/var/lib/mysql` に書いたデータが永続化されると思う",
    whyWrong: "コンテナの書き込み可能レイヤはコンテナ削除（`docker rm`）と同時に消滅する。",
    correctApproach: "永続化が必要なデータは `docker volume create` による名前付きボリュームまたはホスト側バインドマウント（`-v` / `--mount`）へ逃がす。",
  },
  {
    id: "pit305-3",
    trap: "Dockerfile で `RUN apt-get update` と `RUN apt-get install` を別々の行に分け、前の古いキャッシュが効いてパッケージ取得に失敗する",
    whyWrong: "Docker のビルドキャッシュは命令単位で効くため、`apt-get update` 単体行のキャッシュが古いまま `install` 行だけが再実行されると古いインデックスを参照する。",
    correctApproach: "`RUN apt-get update && apt-get install -y ... && rm -rf /var/lib/apt/lists/*` のように 1 つの `RUN` 命令へまとめる。",
  },
  {
    id: "pit305-4",
    trap: "cloud-init の `user-data` 先頭に `#cloud-config` を書き忘れる",
    whyWrong: "cloud-init は先頭行のマジックヘッダでフォーマット（YAML cloud-config かシェルスクリプト `#!/bin/sh` か）を判別するため、ヘッダがないと YAML が解釈されず無視される。",
    correctApproach: "YAML 形式の user-data の 1 行目には必ず `#cloud-config` を記述する。",
  },
  {
    id: "pit305-5",
    trap: "qcow2 のバッキングファイル（元イメージ）を誤って直接起動して書き込んでしまう",
    whyWrong: "差分ディスク（オーバーレイ）はバッキングファイルの特定のブロック配置を前提としているため、親側が変更されると全クローン VM のファイルシステムが破損する。",
    correctApproach: "バッキングファイルは `chmod 444` 等で読み取り専用保護し、絶対に変更しない。",
  },
  {
    id: "pit305-6",
    trap: "Container と VM の違いを「どちらも完全に独立した別 OS カーネルを持つ」と混同する",
    whyWrong: "コンテナはホスト OS のカーネルを共有しているため、ホストと異なるカーネル（例: Linux ホスト上で Windows コンテナ）を直接動かすことはできない。",
    correctApproach: "Namespaces（分離）と cgroups（制限）がホストカーネル上の仕組みであることを正確に理解する。",
  },
];

export const lpic305KeyPaths: LpicKeyPathFact[] = [
  { id: "kp305-1", target: "/etc/libvirt/qemu/*.xml", value: "libvirt VM 定義ファイル", detail: "直接編集せず virsh edit <domain> で編集する" },
  { id: "kp305-2", target: "/dev/kvm", value: "KVM カーネルインターフェース", detail: "VT-x/AMD-V が有効な場合に作成されるデバイス" },
  { id: "kp305-3", target: "/var/log/libvirt/", value: "libvirt / QEMU ログ", detail: "virtlogd 経由でコンソールログ等を記録" },
  { id: "kp305-4", target: "#cloud-config", value: "cloud-init YAML ヘッダ", detail: "user-data 1行目に必須の識別子" },
  { id: "kp305-5", target: "/var/lib/cloud/", value: "cloud-init 状態保存先", detail: "cloud-init clean で初回起動状態をリセット可" },
  { id: "kp305-6", target: "Vagrantfile", value: "Vagrant 構成ファイル", detail: "Box・ネットワーク・Synced Folder・Provisioner を定義" },
  { id: "kp305-7", target: "Dockerfile / Containerfile", value: "コンテナビルド定義", detail: "docker build / podman build で OCI イメージを生成" },
  { id: "kp305-8", target: "VirtIO", value: "準仮想化ドライバ", detail: "QEMU/KVM ゲストの Disk(virtio-blk)・NIC 性能を最大化" },
];

export const lpic305QuickLookup: CertFlashcardItem[] = [
  {
    keyword: "QEMU/KVM 環境で仮想ディスクやネットワークのオーバーヘッドを減らす準仮想化ドライバ群",
    category: "351: フル仮想化",
    recommended: "VirtIO",
    reason: "エミュレーションによる割り込み負荷を減らし、ネイティブに近い I/O 性能を引き出す。",
  },
  {
    keyword: "QEMU の仮想ディスクイメージの作成・形式変換・バッキングファイル指定・情報確認を行うコマンド",
    category: "351: フル仮想化",
    recommended: "qemu-img (create / convert / info)",
    reason: "Copy-on-Write 対応の `qcow2` 形式の操作で必須。",
  },
  {
    keyword: "libvirt で VM の XML 定義を構文チェック付きで安全に編集するコマンド",
    category: "351: フル仮想化",
    recommended: "virsh edit <ドメイン名>",
    reason: "`/etc/libvirt/qemu/*.xml` を直接エディタで開くと libvirtd に反映されない場合がある。",
  },
  {
    keyword: "libvirt で実行中の仮想マシンを無停止のまま別ホストへ移動するコマンド",
    category: "351: フル仮想化",
    recommended: "virsh migrate --live",
    reason: "共有ストレージまたは `--copy-storage-all` と適切なネットワーク経路が必要。",
  },
  {
    keyword: "Xen 4.x 環境でドメインの一覧表示・起動・コンソール接続を行う管理コマンド",
    category: "351: フル仮想化",
    recommended: "xl (list / create / console)",
    reason: "従来の `xm` コマンドの後継ツールスタック。",
  },
  {
    keyword: "コンテナのプロセスID・ネットワーク・マウント空間などの「見え方」を隔離する Linux カーネル機能",
    category: "352: コンテナカーネル",
    recommended: "Namespaces (名前空間)",
    reason: "`unshare` や `nsenter` コマンドで手動操作・調査も可能。",
  },
  {
    keyword: "コンテナやプロセスグループごとの CPU・メモリ・I/O 資源使用量を制限・計測するカーネル機能",
    category: "352: コンテナカーネル",
    recommended: "cgroups (Control Groups)",
    reason: "Namespaces が隔離、cgroups がリソース上限制御を担う。",
  },
  {
    keyword: "デーモンレス・ルートレスで OCI コンテナの実行、ビルド、レジストリ操作を行う 3 つのツール群",
    category: "352: コンテナ仮想化",
    recommended: "Podman / Buildah / Skopeo",
    reason: "Podman=実行、Buildah=イメージ構築、Skopeo=レジストリ間コピー・検査。",
  },
  {
    keyword: "OCI（Open Container Initiative）仕様に準拠し、コンテナプロセスを直接生成する低レベルランタイム",
    category: "352: コンテナ仮想化",
    recommended: "runc",
    reason: "Docker/containerd や CRI-O/Podman などの下層で Namespaces/cgroups を設定しコンテナを起動する。",
  },
  {
    keyword: "システムコンテナ（LXC/LXD）で新しいコンテナを作成・起動し、内部でシェルを実行するコマンド",
    category: "352: LXC / LXD",
    recommended: "lxc launch / lxc exec",
    reason: "イメージ管理は `lxc image`、リソースやプロファイルは `lxc profile` / `lxc config`。",
  },
  {
    keyword: "Docker でコンテナ削除後もデータを永続化するために推奨される Docker 管理下のストレージ領域",
    category: "352: Docker",
    recommended: "名前付きボリューム (docker volume)",
    reason: "コンテナのライフサイクルから分離され、`--mount` や `-v` で複数コンテナ間共有も可能。",
  },
  {
    keyword: "Kubernetes のアプリケーションマニフェスト群をテンプレート化しパッケージ管理するツール",
    category: "352: オーケストレーション",
    recommended: "Helm (Chart)",
    reason: "K8s 上の複雑なリソース一式（Deployment/Service等）をバージョン管理・デプロイできる。",
  },
  {
    keyword: "QEMU/AWS/LXC 等向けに単一設定からゴールデンマシンイメージを自動ビルドするツール",
    category: "353: プロビジョニング",
    recommended: "Packer (packer build)",
    reason: "ビルド後は不要なワークスペースを残さず再現性の高い OS イメージを出力する。",
  },
  {
    keyword: "クラウド VM の初回起動時に SSH 鍵配置・パッケージ導入・FS リサイズを自動で行う仕組み",
    category: "353: プロビジョニング",
    recommended: "cloud-init",
    reason: "メタデータサービスや NoCloud (`cidata`) ISO から `user-data`（先頭 `#cloud-config`）を読み込む。",
  },
  {
    keyword: "テスト目的で `cloud-init` の初回起動済みフラグを消去し再実行可能にするコマンド",
    category: "353: プロビジョニング",
    recommended: "cloud-init clean",
    reason: "ゴールデンイメージ化前のクリーンアップにも使用される。",
  },
  {
    keyword: "ローカルで `Vagrantfile` に基づき開発用仮想マシンを起動・SSH接続・破棄するコマンド",
    category: "353: プロビジョニング",
    recommended: "vagrant up / ssh / destroy",
    reason: "プロビジョナー（shell / ansible 等）の実行や共有フォルダ設定を自動化する。",
  },
  {
    keyword: "インフラ構成を HCL で宣言的に記述し、`plan` で差分確認後 `apply` で環境構築する IaC ツール",
    category: "353: クラウド管理",
    recommended: "Terraform",
    reason: "OpenStack・AWS・libvirt 等多様なプロバイダを同一ワークフローで管理できる。",
  },
  {
    keyword: "ホスト側の既存のプロセスが別のプロセス（例: コンテナ）の Namespace に入って調査するコマンド",
    category: "352: コンテナカーネル",
    recommended: "nsenter",
    reason: "コンテナ内にシェルツールがない場合でもホスト側からプロセス空間を指定してデバッグできる。",
  },
];

export const lpic305PracticeQuestions: CertQuestion[] = [
  {
    id: "q-351-1",
    domainId: "topic-351",
    domainLabel: "351: フル仮想化",
    difficulty: "標準",
    selectCount: 1,
    question: "`virsh` コマンドにおいて、`virsh destroy web01` と `virsh shutdown web01` の挙動の違いとして正しいものはどれですか？",
    options: [
      "`destroy` はディスクイメージファイルを削除し、`shutdown` は定義のみ削除する",
      "`shutdown` はゲスト OS へ正常終了（ACPI）を要求し、`destroy` は電源を強制的に切断する（定義やディスクは残る）",
      "`destroy` はライブマイグレーション後に元 VM を削除するコマンドである",
      "両者は完全に同じ動作をするエイリアスである",
    ],
    correctIndices: [1],
    explanation:
      "`virsh shutdown` はゲスト OS による正常シャットダウン、`virsh destroy` は即座の強制停止です。VM 定義自体の削除には `virsh undefine` を使用します。",
    keywords: ["virsh", "shutdown", "destroy"],
  },
  {
    id: "q-351-2",
    domainId: "topic-351",
    domainLabel: "351: フル仮想化",
    difficulty: "標準",
    selectCount: 1,
    question: "既存のベースイメージ `ubuntu-base.qcow2` をバッキングファイルとして参照する、差分書き込み専用の仮想ディスク `app01.qcow2` を作成する `qemu-img` コマンドはどれですか？",
    options: [
      "qemu-img create -f qcow2 -F qcow2 -b ubuntu-base.qcow2 app01.qcow2",
      "qemu-img convert -f raw -O qcow2 ubuntu-base.qcow2 app01.qcow2",
      "qemu-img snapshot -c app01.qcow2 ubuntu-base.qcow2",
      "qemu-img resize ubuntu-base.qcow2 +20G",
    ],
    correctIndices: [0],
    explanation:
      "`-b <バッキングファイル>` と `-F <バッキング形式>` を指定して `qemu-img create` を実行すると、ベースイメージへの差分のみを記録するクローンディスクを作成できます。",
    keywords: ["qemu-img", "qcow2", "バッキングファイル"],
  },
  {
    id: "q-351-3",
    domainId: "topic-351",
    domainLabel: "351: フル仮想化",
    difficulty: "基礎",
    selectCount: 1,
    question: "Xen ハイパーバイザにおいて、物理ハードウェアへの直接アクセス権限を持ち、他の仮想マシン（ゲスト）の作成・管理を担う特権ドメインの名称はどれですか？",
    options: ["DomU", "Dom0", "KVM", "VirtIO"],
    correctIndices: [1],
    explanation:
      "Xen では管理用の特権ドメインを `Dom0`（Domain 0）、通常のゲストドメインを `DomU`（Unprivileged Domain）と呼びます。",
    keywords: ["Xen", "Dom0", "DomU"],
  },
  {
    id: "q-351-4",
    domainId: "topic-351",
    domainLabel: "351: フル仮想化",
    difficulty: "標準",
    selectCount: 1,
    question: "libvirt 管理下の KVM 仮想マシンの XML 設定（メモリ割り当てやデバイス定義）を編集する際、変更が正しく認識・構文検証される推奨方法はどれですか？",
    options: [
      "`vi /etc/libvirt/qemu/vm1.xml` で直接編集する",
      "`virsh edit vm1` コマンドを使用して編集する",
      "`qemu-img amend vm1.xml` を実行する",
      "`sysctl -w libvirt.xml` で上書きする",
    ],
    correctIndices: [1],
    explanation:
      "`virsh edit <ドメイン名>` は保存時に XML スキーマ検証を行い、libvirtd に設定を正しくリロードさせます。",
    keywords: ["virsh edit", "libvirt", "XML"],
  },
  {
    id: "q-351-5",
    domainId: "topic-351",
    domainLabel: "351: フル仮想化",
    difficulty: "標準",
    selectCount: 2,
    question: "QEMU/KVM における VirtIO および libvirt 構成要素について正しい記述を 2 つ選んでください。",
    options: [
      "VirtIO 準仮想化ドライバをゲストで使用することで、エミュレーションによる I/O オーバーヘッドを大幅に削減できる",
      "`virtlogd` と `virtlockd` はそれぞれ VM コンソールログ管理と仮想ディスクイメージの排他ロックを担う補助デーモンである",
      "KVM は Type-2 ハイパーバイザ専用のユーザー空間エミュレータでありカーネルモジュールを持たない",
      "`virsh migrate --live` は物理ホスト間で仮想マシンを移行する際、常に事前に VM を停止する必要がある",
    ],
    correctIndices: [0, 1],
    explanation:
      "VirtIO は準仮想化による高速 I/O を実現し、`virtlogd`/`virtlockd` は libvirt における安全なログ・ディスクロック管理デーモンです。",
    keywords: ["VirtIO", "virtlogd", "virtlockd"],
  },
  {
    id: "q-352-1",
    domainId: "topic-352",
    domainLabel: "352: コンテナ仮想化",
    difficulty: "基礎",
    selectCount: 1,
    question: "Linux コンテナにおいて、コンテナごとに独立したプロセス番号空間（PID 1）やネットワークインターフェース空間を隔離して見せるカーネル機能はどれですか？",
    options: ["cgroups", "Namespaces", "Capabilities", "seccomp"],
    correctIndices: [1],
    explanation:
      "Namespaces（pid, net, mnt, ipc, uts, user, cgroup）がビュー（空間）の隔離を担当し、cgroups が CPU・メモリ等の資源使用量制限を担当します。",
    keywords: ["Namespaces", "cgroups", "コンテナ基盤"],
  },
  {
    id: "q-352-2",
    domainId: "topic-352",
    domainLabel: "352: コンテナ仮想化",
    difficulty: "標準",
    selectCount: 1,
    question: "バックグラウンドの常駐デーモンや root 権限を必要とせず（Daemonless / Rootless）、Docker と互換性の高い CLI で OCI コンテナを実行・管理できるツールはどれですか？",
    options: ["Podman", "Xen xl", "libvirtd", "Vagrant"],
    correctIndices: [0],
    explanation:
      "Podman はデーモンレスかつルートレスで OCI コンテナを管理でき、`buildah`（イメージ構築）や `skopeo`（レジストリ操作）と組み合わせて利用されます。",
    keywords: ["Podman", "Buildah", "OCI"],
  },
  {
    id: "q-352-3",
    domainId: "topic-352",
    domainLabel: "352: コンテナ仮想化",
    difficulty: "標準",
    selectCount: 1,
    question: "LXC / LXD と Docker の設計思想の違いとして最も適切なものはどれですか？",
    options: [
      "LXC/LXD は OS 全体に近いシステムコンテナ用途に強く、Docker は単一アプリケーションプロセスのパッケージ化・デプロイに特化している",
      "Docker はハードウェア完全仮想化であるため Linux カーネルをホストと共有しない",
      "LXC は Windows 専用コンテナであり Linux では動作しない",
      "Docker は `Dockerfile` を使わず常に実行中コンテナへの SSH ログインで運用するのが標準である",
    ],
    correctIndices: [0],
    explanation:
      "LXC/LXD は複数サービス（systemd 等）が動く軽量な OS 環境（システムコンテナ）に向いており、Docker はマイクロサービス等のアプリケーションコンテナに向いています。",
    keywords: ["LXC", "LXD", "システムコンテナ"],
  },
  {
    id: "q-352-4",
    domainId: "topic-352",
    domainLabel: "352: コンテナ仮想化",
    difficulty: "標準",
    selectCount: 1,
    question: "Dockerfile におけるマルチステージビルド（`FROM ... AS builder` と `COPY --from=builder ...`）を採用する主なメリットはどれですか？",
    options: [
      "最終イメージにビルドツールや中間ソースを残さず、イメージサイズ縮小とセキュリティ攻撃面削減を両立できる",
      "コンテナ内で自動的に KVM ハイパーバイザが有効化される",
      "コンテナ間のネットワーク帯域が 10 倍に向上する",
      "Kubernetes マニフェストを不要にできる",
    ],
    correctIndices: [0],
    explanation:
      "コンパイル等のビルド工程を前段ステージで行い、実行に必要な成果物バイナリだけを最小ベースイメージへ `COPY --from=` することで軽量・安全なイメージを作れます。",
    keywords: ["Dockerfile", "マルチステージビルド"],
  },
  {
    id: "q-352-5",
    domainId: "topic-352",
    domainLabel: "352: コンテナ仮想化",
    difficulty: "応用",
    selectCount: 2,
    question: "Kubernetes および周辺コンテナ技術について、正しい説明を 2 つ選んでください。",
    options: [
      "`runc` は OCI runtime-spec に準拠してコンテナを直接起動する低レベルコンテナランタイムである",
      "`Helm` は Kubernetes リソース定義を Chart としてテンプレート化・パッケージ管理するツールである",
      "`seccomp` はコンテナのメモリ上限をバイト単位で制限するためのファイルシステムである",
      "`Docker Swarm` は Kubernetes の別名であり同じ API サーバを使用する",
    ],
    correctIndices: [0, 1],
    explanation:
      "`runc` は OCI 準拠の低レベルランタイム、`Helm` は Kubernetes 向けパッケージマネージャです。`seccomp` はシステムコール（syscall）の制限を行うカーネル機能です。",
    keywords: ["runc", "OCI", "Helm", "Kubernetes"],
  },
  {
    id: "q-353-1",
    domainId: "topic-353",
    domainLabel: "353: VM デプロイ・プロビジョニング",
    difficulty: "標準",
    selectCount: 1,
    question: "クラウド向け VM の初回起動時に YAML 形式の `user-data` を渡してパッケージ導入や SSH 鍵設定を自動実行させたい場合、`user-data` の 1 行目に必ず記述すべきヘッダはどれですか？",
    options: ["#cloud-config", "#!/bin/yaml", "---cloud-init", "#user-data"],
    correctIndices: [0],
    explanation:
      "`cloud-init` が YAML 構成ファイルとして認識するためには、1 行目に `#cloud-config` を記載する必要があります。",
    keywords: ["cloud-init", "#cloud-config", "user-data"],
  },
  {
    id: "q-353-2",
    domainId: "topic-353",
    domainLabel: "353: VM デプロイ・プロビジョニング",
    difficulty: "基礎",
    selectCount: 1,
    question: "単一のコード（テンプレート）から QEMU/KVM イメージ、AWS AMI、LXC イメージなどの事前構成済み OS ゴールデンイメージを自動ビルドするツールはどれですか？",
    options: ["Packer", "cloud-init", "nsenter", "virsh"],
    correctIndices: [0],
    explanation:
      "HashiCorp Packer は複数のターゲットプラットフォーム（Builder）向けのマシンイメージを自動作成するツールです。",
    keywords: ["Packer", "ゴールデンイメージ"],
  },
  {
    id: "q-353-3",
    domainId: "topic-353",
    domainLabel: "353: VM デプロイ・プロビジョニング",
    difficulty: "標準",
    selectCount: 1,
    question: "Packer 等で作成した仮想マシンイメージを後からクローン展開する際、すべての VM でホスト固有の識別子や SSH ホスト鍵が重複しないよう、テンプレート化前に実施すべき処理として正しいものはどれですか？",
    options: [
      "`/etc/machine-id` を空にし、`/etc/ssh/ssh_host_*` 鍵および `cloud-init clean` で初回状態を初期化する",
      "全ユーザーの `~/.ssh/authorized_keys` を削除せず全 VM で同じ root パスワードを固定する",
      "`/etc/fstab` を空ファイルにしておく",
      "ネットワークインターフェースに MAC アドレスを固定ハードコードする",
    ],
    correctIndices: [0],
    explanation:
      "`machine-id` や SSH ホスト鍵が残ったままクローンすると重複障害やセキュリティ問題が起きるため、事前にクリア（sysprep / `cloud-init clean`）しておきます。",
    keywords: ["cloud-init clean", "machine-id", "テンプレート化"],
  },
  {
    id: "q-353-4",
    domainId: "topic-353",
    domainLabel: "353: VM デプロイ・プロビジョニング",
    difficulty: "基礎",
    selectCount: 1,
    question: "開発環境向けに `Vagrantfile` と Box を用いてローカル VM を自動構築し、プロビジョニングを再実行したい場合に使用する Vagrant コマンドはどれですか？",
    options: [
      "vagrant up --provision（または vagrant provision）",
      "vagrant init --force",
      "vagrant box build",
      "vagrant snapshot push",
    ],
    correctIndices: [0],
    explanation:
      "すでに起動している Vagrant VM に対してプロビジョナーを再実行するには `vagrant provision` または `vagrant reload --provision` / `vagrant up --provision` を使います。",
    keywords: ["Vagrant", "Vagrantfile", "vagrant provision"],
  },
  {
    id: "q-353-5",
    domainId: "topic-353",
    domainLabel: "353: VM デプロイ・プロビジョニング",
    difficulty: "標準",
    selectCount: 2,
    question: "クラウド基盤・プロビジョニングツールに関する説明として正しいものを 2 つ選んでください。",
    options: [
      "Terraform では `terraform plan` で変更内容の事前確認（ドライラン）を行ってから `terraform apply` で適用する",
      "OpenStack はコンピュート（Nova）・ネットワーク（Neutron）・ストレージ（Cinder）等から構成される OSS の IaaS 基盤である",
      "`cloud-init` はローカルの VirtualBox 専用でありパブリッククラウドでは利用できない",
      "Packer は稼働中の Kubernetes Pod に対してのみリアルタイムにメモリを増設するツールである",
    ],
    correctIndices: [0, 1],
    explanation:
      "Terraform の `plan` / `apply` ワークフローと、OpenStack の主要コンポーネント（Nova/Neutron/Cinder 等）はクラウド管理の基礎知識です。",
    keywords: ["Terraform", "OpenStack", "IaaS"],
  },
];

// 出典: Linux Professional Institute (LPI) 公式リソース
export const lpic305OfficialResources: LpicOfficialResource[] = [
  {
    title: "LPI 公式 LPIC-3 Virtualization and Containerization (305) 概要",
    description: "LPIC-3 305-300 試験の公式概要、前提資格、認定要件です。",
    url: "https://www.lpi.org/our-certifications/lpic-3-305-overview",
    badge: "公式",
  },
  {
    title: "LPIC-305 Objectives V3.0（英語一次情報）",
    description: "Topic 351〜353 の詳細出題項目・重要ファイル・コマンド一覧です。",
    url: "https://wiki.lpi.org/wiki/LPIC-305_Objectives_V3.0",
    badge: "試験範囲",
  },
  {
    title: "LPIC-3 305 Objectives V3.0（日本語訳）",
    description: "LPI Wiki で公開されている Exam 305 Version 3.0 の日本語版試験範囲です。",
    url: "https://wiki.lpi.org/wiki/LPIC-3_305_Objectives_V3.0(JA)",
    badge: "日本語範囲",
  },
];
