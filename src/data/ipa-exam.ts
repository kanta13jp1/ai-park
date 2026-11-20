import type {
  CertExamFact,
  CertFlashcardItem,
  CertPassingConfig,
  CertQuestion,
} from "@/components/certification/types";

export type IpaExamId = "ip" | "fe" | "ap" | "sc" | "db" | "nw";

export interface IpaExamMeta {
  id: IpaExamId;
  shortLabel: string;
  title: string;
  subtitle: string;
  skillLevel: string;
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  description: string;
  examFacts: CertExamFact[];
  passingConfig: CertPassingConfig;
  secondsPerQuestion: number;
}

export interface IpaTopicItem {
  id: string;
  code: string;
  title: string;
  keywords: string[];
  keyPoints: string[];
  examTip: string;
}

export interface IpaDomain {
  id: string;
  examId: IpaExamId;
  number: string;
  category: "ストラテジ系" | "マネジメント系" | "テクノロジ系";
  title: string;
  accentColor: "indigo" | "emerald" | "amber" | "cyan";
  summary: string;
  topics: IpaTopicItem[];
}

export interface IpaComparisonRow {
  feature: string;
  values: string[];
}

export interface IpaComparisonTable {
  id: string;
  examIds: IpaExamId[];
  category: "ネットワーク・セキュリティ" | "開発・データベース" | "マネジメント・戦略" | "コンピュータ基礎";
  title: string;
  subtitle: string;
  columns: string[];
  rows: IpaComparisonRow[];
  decisionRule: string;
}

export interface IpaFormulaPattern {
  id: string;
  examIds: IpaExamId[];
  title: string;
  badge: string;
  flow: string[];
  summary: string;
  keyDesignPoints: string[];
}

export interface IpaPitfall {
  id: string;
  examIds: IpaExamId[];
  trap: string;
  whyWrong: string;
  correctApproach: string;
}

export interface IpaKeyFact {
  id: string;
  examIds: IpaExamId[];
  target: string;
  value: string;
  detail: string;
}

export interface IpaOfficialResource {
  title: string;
  description: string;
  url: string;
  badge: string;
}

export interface IpaFlashcardItem extends CertFlashcardItem {
  examId: IpaExamId;
}

export interface IpaQuestion extends CertQuestion {
  examId: IpaExamId;
}

// 出典: 独立行政法人情報処理推進機構 (IPA) 情報処理技術者試験 試験要綱・シラバス（https://www.ipa.go.jp/shiken/syllabus.html）
export const ipaExamMetas: IpaExamMeta[] = [
  {
    id: "ip",
    shortLabel: "ITパスポート (IP)",
    title: "ITパスポート試験（iパス）",
    subtitle: "スキルレベル 1 ・ 全社会人/IT基礎",
    skillLevel: "レベル 1",
    accentColor: "emerald",
    description:
      "IT を利活用するすべての社会人・学生が備えておくべき、経営戦略・IT管理・AI/セキュリティ・ネットワークの基礎知識を体系的に学びます。",
    examFacts: [
      { label: "試験形式", value: "CBT 方式", detail: "随時受験可能（テストセンター）" },
      { label: "試験時間", value: "120 分", detail: "小問 100 問を一括解答" },
      { label: "問題数", value: "100 問", detail: "すべて四肢択一式（総合出題）" },
      { label: "合格基準", value: "総合 600 点以上", detail: "1,000 点満点中（分野別各 300 点以上）" },
      { label: "対象領域", value: "3 分野", detail: "ストラテジ・マネジメント・テクノロジ" },
      { label: "有効期限", value: "無期限", detail: "国家試験として生涯有効" },
    ],
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 600,
      passingPct: 60,
      officialExamLabel: "ITパスポート試験（1,000点満点）",
    },
    secondsPerQuestion: 72,
  },
  {
    id: "fe",
    shortLabel: "基本情報技術者 (FE)",
    title: "基本情報技術者試験（FE）",
    subtitle: "スキルレベル 2 ・ エンジニア登竜門",
    skillLevel: "レベル 2",
    accentColor: "cyan",
    description:
      "ITエンジニアとして必要なコンピュータ科学基礎、ネットワーク・DB・セキュリティの知識（科目A）と、アルゴリズム・情報セキュリティ実践力（科目B）を学びます。",
    examFacts: [
      { label: "試験形式", value: "CBT 方式", detail: "通年受験可能（科目A・B 連続）" },
      { label: "試験時間", value: "90分 / 100分", detail: "科目A: 90分 ＋ 科目B: 100分" },
      { label: "問題数", value: "60問 / 20問", detail: "科目A: 60問 / 科目B: 20問（多肢選択）" },
      { label: "合格基準", value: "各 600 点以上", detail: "科目A・B それぞれ 1,000 点満点中" },
      { label: "重点領域", value: "アルゴリズム等", detail: "科目Bは擬似言語とセキュリティが中心" },
      { label: "有効期限", value: "無期限", detail: "国家試験として生涯有効" },
    ],
    passingConfig: {
      minScore: 0,
      maxScore: 1000,
      passingScore: 600,
      passingPct: 60,
      officialExamLabel: "基本情報技術者試験（科目A・B 各1,000点満点）",
    },
    secondsPerQuestion: 90,
  },
  {
    id: "ap",
    shortLabel: "応用情報技術者 (AP)",
    title: "応用情報技術者試験（AP）",
    subtitle: "スキルレベル 3 ・ 設計/推進リーダー",
    skillLevel: "レベル 3",
    accentColor: "indigo",
    description:
      "システムアーキテクチャ設計、データベース・ネットワーク応用、情報セキュリティ、プロジェクト・サービスマネジメントの高度な応用力を学びます。",
    examFacts: [
      { label: "試験形式", value: "午前＋午後", detail: "IPA 公式試験要綱に基づく2部構成" },
      { label: "試験時間", value: "90分 / 150分", detail: "午前: 90分（80問） / 午後: 150分" },
      { label: "問題数", value: "80問 / 記述選択", detail: "午後は記述式（セキュリティ必須＋選択）" },
      { label: "合格基準", value: "各 60 点以上", detail: "午前・午後ともに 100 点満点中 60 点" },
      { label: "多段階選抜", value: "午前基準必須", detail: "午前が基準点未満の場合、午後は採点対象外" },
      { label: "有効期限", value: "無期限", detail: "国家試験として生涯有効" },
    ],
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 60,
      passingPct: 60,
      officialExamLabel: "応用情報技術者試験（午前・午後 各100点満点）",
    },
    secondsPerQuestion: 90,
  },
  {
    id: "sc",
    shortLabel: "安全確保支援士 (SC)",
    title: "情報処理安全確保支援士試験（SC）",
    subtitle: "スキルレベル 4 ・ サイバーセキュリティ専門",
    skillLevel: "レベル 4",
    accentColor: "indigo",
    description:
      "セキュア設計・脆弱性対策、認証・認可・暗号基盤、インシデント対応（CSIRT）やセキュリティ法規・監査まで、高度なセキュリティ実践力を学びます。",
    examFacts: [
      { label: "試験形式", value: "科目A＋科目B", detail: "A-1/A-2（選択）＋ B（記述）" },
      { label: "試験時間", value: "50/40/150分", detail: "A-1:50分 / A-2:40分 / B:150分" },
      { label: "問題数", value: "30/25/4問中2", detail: "B（午後）は4問中2問を選択解答" },
      { label: "合格基準", value: "各 60 点以上", detail: "すべての科目で 100 点満点中 60 点" },
      { label: "免除制度", value: "科目A-1免除可", detail: "AP合格等により2年間免除申請可能" },
      { label: "登録資格", value: "士業（登録制）", detail: "合格後に登録することで名称独占資格" },
    ],
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 60,
      passingPct: 60,
      officialExamLabel: "情報処理安全確保支援士試験（各科目100点満点）",
    },
    secondsPerQuestion: 90,
  },
  {
    id: "db",
    shortLabel: "データベース (DB)",
    title: "データベーススペシャリスト試験（DB）",
    subtitle: "スキルレベル 4 ・ データ基盤・DB設計専門",
    skillLevel: "レベル 4",
    accentColor: "cyan",
    description:
      "概念データモデリング（E-R図）、論理・物理設計、SQLチューニング、同時実行制御と障害回復、分散DB・データ分析基盤の専門知識を学びます。",
    examFacts: [
      { label: "試験形式", value: "A-1/A-2/B-1/B-2", detail: "A系（選択）＋ B系（記述式）" },
      { label: "試験時間", value: "50/40/90/120分", detail: "B-1:90分 / B-2:120分" },
      { label: "問題数", value: "30/25/2/1問", detail: "B-1:3問中2 / B-2:2問中1問選択" },
      { label: "合格基準", value: "各 60 点以上", detail: "すべての科目で 100 点満点中 60 点" },
      { label: "免除制度", value: "科目A-1免除可", detail: "AP合格等により2年間免除申請可能" },
      { label: "有効期限", value: "無期限", detail: "国家試験として生涯有効" },
    ],
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 60,
      passingPct: 60,
      officialExamLabel: "データベーススペシャリスト試験（各科目100点満点）",
    },
    secondsPerQuestion: 90,
  },
  {
    id: "nw",
    shortLabel: "ネットワーク (NW)",
    title: "ネットワークスペシャリスト試験（NW）",
    subtitle: "スキルレベル 4 ・ NW設計・運用専門",
    skillLevel: "レベル 4",
    accentColor: "emerald",
    description:
      "L2/L3冗長化設計、OSPF/BGP経路制御、DNS/HTTP/TLS詳細、VPN・ゼロトラスト・クラウド接続アーキテクチャの高度な設計力を学びます。",
    examFacts: [
      { label: "試験形式", value: "A-1/A-2/B-1/B-2", detail: "A系（選択）＋ B系（記述式）" },
      { label: "試験時間", value: "50/40/90/120分", detail: "B-1:90分 / B-2:120分" },
      { label: "問題数", value: "30/25/2/1問", detail: "B-1:3問中2 / B-2:2問中1問選択" },
      { label: "合格基準", value: "各 60 点以上", detail: "すべての科目で 100 点満点中 60 点" },
      { label: "免除制度", value: "科目A-1免除可", detail: "AP合格等により2年間免除申請可能" },
      { label: "有効期限", value: "無期限", detail: "国家試験として生涯有効" },
    ],
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 60,
      passingPct: 60,
      officialExamLabel: "ネットワークスペシャリスト試験（各科目100点満点）",
    },
    secondsPerQuestion: 90,
  },
];

// 出典: IPA 情報処理技術者試験 シラバス（IP / FE / AP）
export const ipaDomains: IpaDomain[] = [
  // --- ITパスポート (IP) ---
  {
    id: "ip-strategy",
    examId: "ip",
    number: "IP-1",
    category: "ストラテジ系",
    title: "企業と法務・経営戦略・システム戦略",
    accentColor: "emerald",
    summary: "コーポレートガバナンス、知的財産権・個人情報保護法、SWOT/PPM等の経営分析手法、DXやクラウド活用の基礎を押さえます。",
    topics: [
      {
        id: "ip-st-1",
        code: "IP 1.1",
        title: "企業活動・法務（コンプライアンス・知財）",
        keywords: ["著作権", "特許権", "個人情報保護法", "NDA", "コーポレートガバナンス", "PDCA"],
        keyPoints: [
          "著作権は創作と同時に自動発生（無方式主義）、特許権は出願と審査登録が必要（産業財産権）",
          "プログラムのソースコードやマニュアルは著作権で保護されるが、アルゴリズムやプログラム言語自体は対象外",
          "個人情報保護法では、氏名・生年月日等の組み合わせで特定の個人を識別できる情報や個人識別符号が保護対象",
          "請負契約は成果物の完成責任、準委任契約は善管注意義務による業務遂行責任を負う",
        ],
        examTip: "著作権（出願不要）と特許権・意匠権・商標権（出願・登録が必要）の違いは毎回のように問われます。",
      },
      {
        id: "ip-st-2",
        code: "IP 1.2",
        title: "経営戦略・マーケティング・システム戦略",
        keywords: ["SWOT分析", "PPM", "KPI/KGI", "ROI", "RPA", "PoC", "RFP"],
        keyPoints: [
          "SWOT分析は内部環境（強み・弱み）と外部環境（機会・脅威）の4象限で戦略を整理する",
          "PPM（プロダクトポートフォリオマネジメント）は市場成長率と市場占有率で「花形・金のなる木・問題児・負け犬」に分類",
          "KGI（重要目標達成指標）は最終ゴール、KPI（重要業績評価指標）はプロセスの中間指標",
          "RFP（提案依頼書）は発注側がベンダーにシステム要件や調達条件を示して提案を求める文書",
        ],
        examTip: "RFI（情報提供依頼書）→ RFP（提案依頼書）→ 見積・契約の調達プロセス順を整理しましょう。",
      },
    ],
  },
  {
    id: "ip-management",
    examId: "ip",
    number: "IP-2",
    category: "マネジメント系",
    title: "開発技術・プロジェクト・サービスマネジメント",
    accentColor: "amber",
    summary: "アジャイル/ウォーターフォールの開発モデル、WBS・ガントチャート等のプロジェクト管理、SLA・ITIL・内部統制の基礎を学びます。",
    topics: [
      {
        id: "ip-mg-1",
        code: "IP 2.1",
        title: "システム開発手法とプロジェクト管理",
        keywords: ["ウォーターフォール", "アジャイル", "スクラム", "WBS", "アローダイアグラム"],
        keyPoints: [
          "ウォーターフォールは工程を順に完了させ手戻りを抑える手法、アジャイルは短い反復（イテレーション/スプリント）で素早く価値を届ける手法",
          "WBS（Work Breakdown Structure）はプロジェクト全体の作業を階層的に細分化した構成図",
          "プロジェクトの制約条件（スコープ・コスト・スケジュール・品質）のトレードオフ管理が重要",
        ],
        examTip: "スクラムの役割（プロダクトオーナー、スクラムマスター、開発者）とイベントの特徴を把握しましょう。",
      },
      {
        id: "ip-mg-2",
        code: "IP 2.2",
        title: "サービスマネジメントとシステム監査",
        keywords: ["SLA", "ITIL", "インシデント管理", "ITサービス継続管理", "システム監査"],
        keyPoints: [
          "SLA（Service Level Agreement）は提供者と利用者の間でサービス品質（稼働率・応答時間等）を数値で合意する契約",
          "インシデント管理は障害発生時に「まずは迅速にサービスを復旧させる」ことが最優先（根本原因究明は問題管理）",
          "システム監査人は被監査部門から独立した立場（外観上・精神上の独立性）で客観的に評価・助言を行う",
        ],
        examTip: "インシデント管理（一次復旧）と問題管理（根本原因の排除）の役割分担は頻出です。",
      },
    ],
  },
  {
    id: "ip-technology",
    examId: "ip",
    number: "IP-3",
    category: "テクノロジ系",
    title: "基礎理論・AI・ネットワーク・情報セキュリティ",
    accentColor: "cyan",
    summary: "2進数・論理演算、生成AI/機械学習の基礎用語、TCP/IP・HTTP/HTTPS・DNS、情報セキュリティの3要素（CIA）と対策を学びます。",
    topics: [
      {
        id: "ip-tc-1",
        code: "IP 3.1",
        title: "情報セキュリティの3要素（CIA）と攻撃手法",
        keywords: ["機密性", "完全性", "可用性", "フィッシング", "ランサムウェア", "多要素認証"],
        keyPoints: [
          "CIA：機密性（アクセス制御・暗号化）、完全性（改ざん防止・ハッシュ）、可用性（二重化・バックアップ）",
          "ランサムウェアは端末やファイルを暗号化し、復号と引き換えに身代金を要求するマルウェア",
          "多要素認証（MFA）は「知識（パスワード）」「所有（ICカード・認証アプリ）」「生体（指紋・顔）」のうち2つ以上を組み合わせる",
        ],
        examTip: "多要素認証は同じカテゴリを2つ（例：パスワード＋秘密の質問）組み合わせても「多要素」にはなりません。",
      },
      {
        id: "ip-tc-2",
        code: "IP 3.2",
        title: "ネットワーク・データベース・AI基礎",
        keywords: ["DNS", "DHCP", "HTTP/HTTPS", "主キー", "関係データベース", "教師あり学習"],
        keyPoints: [
          "DNSはドメイン名とIPアドレスを相互変換、DHCPは端末へIPアドレス等を自動割り当てする仕組み",
          "関係データベース（RDB）では「主キー（一意に識別）」と「外部キー（他表の主キーを参照）」で表同士を関連付ける",
          "機械学習には正解ラベル付きデータを使う「教師あり学習」、ラベルなしの「教師なし学習」、試行錯誤と報酬で学ぶ「強化学習」がある",
        ],
        examTip: "生成AIのハルシネーション（事実と異なる出力）やプロンプトインジェクション等のリスク用語も確認しておきましょう。",
      },
    ],
  },

  // --- 基本情報技術者 (FE) ---
  {
    id: "fe-cs",
    examId: "fe",
    number: "FE-1",
    category: "テクノロジ系",
    title: "基礎理論・アルゴリズム・データ構造（科目A/B）",
    accentColor: "cyan",
    summary: "2進数・浮動小数点・論理演算、配列・リスト・スタック・キュー・木構造、探索・整列アルゴリズムと計算量 O(n) を押さえます。",
    topics: [
      {
        id: "fe-cs-1",
        code: "FE 1.1",
        title: "離散数学・数値表現と論理演算",
        keywords: ["2の補数", "IEEE 754", "シフト演算", "ド・モルガンの法則", "ビットマスク"],
        keyPoints: [
          "負の整数は「ビット反転＋1」の2の補数で表現し、加算回路だけで減算を処理できる",
          "論理左シフト1ビットは2倍（符号なし）、論理右シフト1ビットは1/2倍（端数切り捨て）に相当",
          "AND は特定ビットの抽出（マスク）、OR は特定ビットのセット、XOR はビット反転や一致判定に使う",
        ],
        examTip: "16進数・2進数の相互変換と、負数の2の補数表現は科目Aの定番計算問題です。",
      },
      {
        id: "fe-cs-2",
        code: "FE 1.2",
        title: "データ構造とアルゴリズム（科目B 対策）",
        keywords: ["スタック(LIFO)", "キュー(FIFO)", "二分探索", "クイックソート", "再帰呼出し"],
        keyPoints: [
          "スタックは後入れ先出し（LIFO：関数呼出し管理等）、キューは先入れ先出し（FIFO：待ち行列・BFS）",
          "二分探索はソート済み配列に対して中央値と比較を繰り返し、計算量 O(log n) で高速に探索する",
          "科目Bの擬似言語トレースでは、配列添字の開始番号（1始まりか0始まりか）とループ終了条件を必ず紙に書き出して追う",
        ],
        examTip: "科目Bのアルゴリズム問題では、境界値（ループの初回・最終回）の変数の値をトレース表で追うのが確実です。",
      },
    ],
  },
  {
    id: "fe-sys",
    examId: "fe",
    number: "FE-2",
    category: "テクノロジ系",
    title: "コンピュータシステム・ネットワーク・DB",
    accentColor: "indigo",
    summary: "CPU・キャッシュ・仮想記憶、RAID、TCP/IP・サブネット計算、関係データベースの正規化・SQL・トランザクション（ACID）を学びます。",
    topics: [
      {
        id: "fe-sys-1",
        code: "FE 2.1",
        title: "ハードウェア・OS・稼働率計算",
        keywords: ["キャッシュメモリ", "ページング", "直列/並列稼働率", "RAID 0/1/5", "割り込み"],
        keyPoints: [
          "実効アクセス時間 ＝ ヒット率 × キャッシュ時間 ＋ (1 － ヒット率) × 主記憶時間",
          "直列システムの稼働率は A × B、並列システム（少なくとも1つ稼働）は 1 － (1 － A)(1 － B)",
          "RAID 1 はミラーリング（耐障害性高・容量50%）、RAID 5 はパリティ分散（3台以上・1台故障まで復旧可）",
        ],
        examTip: "並列稼働率は「両方とも同時に故障する確率を引く」と覚えると計算ミスが減ります。",
      },
      {
        id: "fe-sys-2",
        code: "FE 2.2",
        title: "データベース正規化・SQL・ネットワーク",
        keywords: ["第1〜第3正規化", "JOIN", "GROUP BY", "ACID特性", "サブネットマスク", "NAT/NAPT"],
        keyPoints: [
          "第1正規化（繰り返し項目の排除）、第2正規化（部分関数従属の排除）、第3正規化（推移的関数従属の排除）",
          "SQL の実行順イメージ：FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY",
          "NAT はプライベートIPとグローバルIPの1対1変換、NAPT（IPマスカレード）はポート番号も使って1対多変換",
        ],
        examTip: "WHERE はグループ化前の行絞り込み、HAVING は GROUP BY 後の集計結果に対する絞り込みです。",
      },
    ],
  },
  {
    id: "fe-sec-mgmt",
    examId: "fe",
    number: "FE-3",
    category: "マネジメント系",
    title: "情報セキュリティ実践・テスト技法・マネジメント",
    accentColor: "emerald",
    summary: "共通鍵・公開鍵暗号、デジタル署名・PKI、Web脆弱性対策、ブラックボックス/ホワイトボックステスト、CPM/EVM を学びます。",
    topics: [
      {
        id: "fe-sec-1",
        code: "FE 3.1",
        title: "暗号技術・デジタル署名・Web脆弱性対策",
        keywords: ["AES/RSA", "ハイブリッド暗号", "デジタル署名", "SQLインジェクション", "XSS", "CSRF"],
        keyPoints: [
          "デジタル署名は「送信者の秘密鍵でハッシュ値を暗号化 → 受信者が送信者の公開鍵で検証」し、改ざん検知と否認防止を実現",
          "SQLインジェクション対策はプレースホルダ（バインド機構）によるSQL文とパラメータの分離が根本対策",
          "XSS（クロスサイトスクリプティング）対策は入力値検証と出力時のHTMLエスケープ処理",
        ],
        examTip: "暗号化（受信者の公開鍵で暗号化）とデジタル署名（送信者の秘密鍵で署名）の鍵の向きを混同しないこと。",
      },
      {
        id: "fe-sec-2",
        code: "FE 3.2",
        title: "テスト技法と工程管理（EVM・クリティカルパス）",
        keywords: ["同値分割", "限界値分析", "カバレッジ(C0/C1/C2)", "クリティカルパス", "EVM"],
        keyPoints: [
          "同値分割は入力値を有効/無効クラスに分け代表値をテスト、限界値分析はその境界値（±1等）を集中的にテスト",
          "ホワイトボックステストの網羅基準：命令網羅（C0）＜ 分岐網羅（C1）＜ 条件網羅（C2）",
          "EVM（Earned Value Management）：PV（計画）、EV（出来高）、AC（実コスト）。SV=EV-PV、CV=EV-AC",
        ],
        examTip: "EVM は「主役がいつも EV（EV から引く）」と覚えると SV/CV/SPI/CPI の符号を間違えません。",
      },
    ],
  },

  // --- 応用情報技術者 (AP) ---
  {
    id: "ap-arch",
    examId: "ap",
    number: "AP-1",
    category: "テクノロジ系",
    title: "システムアーキテクチャ・性能設計・DB応用",
    accentColor: "indigo",
    summary: "フォールトトレラント設計、キューイング理論（M/M/1）、分散トランザクション（2相コミット）、ロック制御とデッドロック対策を学びます。",
    topics: [
      {
        id: "ap-ar-1",
        code: "AP 1.1",
        title: "高信頼化設計と待ち行列理論",
        keywords: ["フォールトトレラント", "フェールセーフ", "フールプルーフ", "M/M/1待ち行列", "スケールアウト"],
        keyPoints: [
          "フェールセーフ（故障時は安全側へ停止）、フェールソフト（機能縮退して継続）、フールプルーフ（誤操作を構造的に防ぐ）",
          "M/M/1 モデル：平均サービス時間 Ts、利用率 ρ = λTs のとき、平均待ち時間 Wq = ρ / (1 - ρ) × Ts",
          "レスポンスタイム要件を満たすため、ボトルネック箇所（CPU/メモリ/I/O/NW）を特定しスケールアップ/アウトを選定",
        ],
        examTip: "フェールセーフ（信号の赤点滅等）とフェールソフト（縮退運転）の違いは午後記述でもよく問われます。",
      },
      {
        id: "ap-ar-2",
        code: "AP 1.2",
        title: "同時実行制御・障害回復・インデックス設計",
        keywords: ["共有ロック/専有ロック", "2相ロック", "ロールバック/ロールフォワード", "B+木インデックス", "アイソレーションレベル"],
        keyPoints: [
          "チェックポイント後の媒体障害ではバックアップから復元＋ログの更新後情報でロールフォワード、未完了トランザクションはロールバック",
          "デッドロック防止：資源の獲得順序の統一、ロック粒度の適正化、タイムアウト設定",
          "インデックスは検索高速化に有効だが、INSERT/UPDATE/DELETE 時の更新オーバーヘッドとトレードオフになる",
        ],
        examTip: "ダーティリード・ファジーリード・ファントムリードと各分離レベル（Read Committed 等）の関係を整理しましょう。",
      },
    ],
  },
  {
    id: "ap-nw-sec",
    examId: "ap",
    number: "AP-2",
    category: "テクノロジ系",
    title: "ネットワーク応用・高度セキュリティ設計",
    accentColor: "cyan",
    summary: "ルーティング（OSPF/BGP）・VLAN・ロードバランシング、TLS1.3、ゼロトラスト、CSIRT・リスクアセスメント・認証連携（OAuth/OIDC/SAML）を学びます。",
    topics: [
      {
        id: "ap-ns-1",
        code: "AP 2.1",
        title: "ネットワーク設計と経路制御・負荷分散",
        keywords: ["VLSM/CIDR", "VLAN", "OSPF/BGP", "TLS 1.3", "DNSSEC", "WAF"],
        keyPoints: [
          "OSPF は AS 内のリンク状態型ルーティング（コスト最小経路）、BGP は AS 間の経路制御（パスベクトル型）",
          "L4ロードバランサは IP/ポート単位で高速転送、L7ロードバランサは HTTP ヘッダ・URL パスを見て振分可能",
          "TLS 1.3 では前方秘匿性（PFS）を持つ ECDHE 鍵交換が標準となり、ハンドシェイクが 1-RTT に短縮された",
        ],
        examTip: "午後ネットワーク分野では、パケットの流れ（送信元/宛先 IP と MAC アドレスの書き換え有無）を追う問題が定番です。",
      },
      {
        id: "ap-ns-2",
        code: "AP 2.2",
        title: "リスクマネジメントと認証・認可アーキテクチャ",
        keywords: ["リスク対応4分類", "OAuth 2.0", "OpenID Connect", "SAML", "ゼロトラスト", "SPF/DKIM/DMARC"],
        keyPoints: [
          "リスク対応の4分類：リスク低減（対策実施）・リスク回避（事業停止等）・リスク共有/移転（保険・外注）・リスク保有（受容）",
          "OAuth 2.0 は認可（アクセス権の委譲）、OpenID Connect は OAuth 2.0 上に構築された認証プロトコル（IDトークン発行）",
          "メールなりすまし対策：SPF（送信元IP検証）、DKIM（電子署名検証）、DMARC（認証失敗時のポリシー指示とレポート）",
        ],
        examTip: "応用情報の午後は情報セキュリティが必須解答です。攻撃手法と「技術的＋運用的」な再発防止策をセットで書けるようにしましょう。",
      },
    ],
  },
  {
    id: "ap-mgmt-strat",
    examId: "ap",
    number: "AP-3",
    category: "ストラテジ系",
    title: "経営戦略・ITガバナンス・システム監査",
    accentColor: "amber",
    summary: "エンタープライズアーキテクチャ、財務指標（NPV/ROI/ROE）、ITIL4/SLA設計、プロジェクトのリスク・ステークホルダー管理を学びます。",
    topics: [
      {
        id: "ap-ms-1",
        code: "AP 3.1",
        title: "投資評価（NPV/ROI）と経営・財務分析",
        keywords: ["NPV（正味現在価値）", "ROI", "損益分岐点売上高", "ROE", "ファイブフォース分析"],
        keyPoints: [
          "損益分岐点売上高 ＝ 固定費 ÷ (1 － 変動費率) ＝ 固定費 ÷ 限界利益率",
          "NPV（正味現在価値）は将来キャッシュフローを割引率で現在価値に割り引いた合計から初期投資を引いた値（＞0 なら投資価値あり）",
          "ROE（自己資本利益率）＝ 当期純利益 ÷ 自己資本（＝ 売上高純利益率 × 総資本回転率 × 財務レバレッジ）",
        ],
        examTip: "損益分岐点と限界利益率の計算は午前・午後（経営戦略）の両方で出題されるため、公式を確実に押さえましょう。",
      },
      {
        id: "ap-ms-2",
        code: "AP 3.2",
        title: "ITサービスマネジメント・BCP・内部統制",
        keywords: ["RTO / RPO", "ITガバナンス", "変更管理", "構成管理データベース(CMDB)", "BCP"],
        keyPoints: [
          "RTO（目標復旧時間）はシステム停止から復旧までの許容時間、RPO（目標復旧時点）は復旧時に許容できるデータ損失時点",
          "変更管理（CAB による影響評価・承認）により、無計画な変更による障害発生を防ぐ",
          "BCP（事業継続計画）では重要業務の特定（BIA）と代替手段の事前確保・定期訓練が不可欠",
        ],
        examTip: "RTO（時間軸：何時間以内に戻すか）と RPO（データ軸：いつ時点のデータまで戻すか）の区別を明確にしましょう。",
      },
    ],
  },

  // --- 情報処理安全確保支援士 (SC) ---
  {
    id: "sc-sec",
    examId: "sc",
    number: "SC-1",
    category: "テクノロジ系",
    title: "サイバー攻撃手法とセキュア設計・実装",
    accentColor: "indigo",
    summary: "Web脆弱性（SQLi/XSS/CSRF/SSRF/クリックジャッキング）、セキュアコーディング、WAF/EDR/SIEM/SOAR による多層防御を学びます。",
    topics: [
      {
        id: "sc-sec-1",
        code: "SC 1.1",
        title: "Web/API 脆弱性とセキュアアーキテクチャ",
        keywords: ["SSRF", "CSP", "CORS", "SameSite Cookie", "クリックジャッキング", "OAuth 2.0/PKCE"],
        keyPoints: [
          "SSRF（Server-Side Request Forgery）はサーバから内部ネットワークやクラウドメタデータ（169.254.169.254）へ不正リクエストを送らせる攻撃",
          "クリックジャッキング対策は HTTP レスポンスヘッダ `X-Frame-Options: DENY` または CSP の `frame-ancestors` ディレクティブ",
          "OAuth 2.0 パブリッククライアント（SPA/ネイティブアプリ）では認可コード横取り対策として PKCE（Proof Key for Code Exchange）が必須",
        ],
        examTip: "科目B（午後）では脆弱性の「攻撃成立条件」と「コード/設定レベルの修正内容」を具体的に記述させる問題が頻出です。",
      },
      {
        id: "sc-sec-2",
        code: "SC 1.2",
        title: "ネットワーク防御・暗号基盤（PKI/TLS）",
        keywords: ["TLS 1.3", "OCSP Stapling", "HSTS", "DNSSEC", "DMARC/BIMI", "ゼロトラスト"],
        keyPoints: [
          "HSTS（HTTP Strict Transport Security）はブラウザに HTTPS 接続のみを強制し、SSLストリッピング攻撃を防ぐ",
          "ゼロトラストネットワークでは社内/社外を問わず「すべてのアクセスを検証」し、IdP・EDR・ZTNA による動的アクセス制御を行う",
          "IPsec VPN では IKE（鍵交換）と ESP（暗号化・認証）を用い、NAT 越え時は NAT-T（UDP 4500）を使用する",
        ],
        examTip: "メールセキュリティ（SPF/DKIM/DMARC/S/MIME）と DNS セキュリティ（DNSSEC/DoH/DoT）の動作原理は要整理です。",
      },
    ],
  },
  {
    id: "sc-ops",
    examId: "sc",
    number: "SC-2",
    category: "マネジメント系",
    title: "インシデント対応（CSIRT）・リスク・法規",
    accentColor: "amber",
    summary: "CSIRT 運用とフォレンジック、脅威インテリジェンス・脆弱性管理（CVSS/SBOM）、関連法規（不正アクセス禁止法・個人情報保護法・サイバーセキュリティ基本法）を学びます。",
    topics: [
      {
        id: "sc-ops-1",
        code: "SC 2.1",
        title: "CSIRT インシデントレスポンスとログ保全",
        keywords: ["NIST SP 800-61", "デジタルフォレンジック", "SIEM/SOAR", "SBOM", "CVSS v3/v4"],
        keyPoints: [
          "インシデント対応フロー：準備 → 検知・分析 → 封じ込め・根絶・復旧 → 事後活動（教訓の反映）",
          "揮発性データの保全優先順位（RFC 3227）：レジスタ/キャッシュ → メモリ（RAM） → ネットワーク接続/プロセス → ディスク → バックアップ",
          "SBOM（Software Bill of Materials）により OSS の依存コンポーネントを把握し、Log4j 等の脆弱性発覚時に迅速に影響範囲を特定",
        ],
        examTip: "感染端末を即座にシャットダウンするとメモリ上のマルウェアや暗号鍵が失われるため、原則はネットワーク遮断＋メモリダンプ保全です。",
      },
    ],
  },

  // --- データベーススペシャリスト (DB) ---
  {
    id: "db-design",
    examId: "db",
    number: "DB-1",
    category: "テクノロジ系",
    title: "概念データモデリング（E-R図）と論理設計",
    accentColor: "cyan",
    summary: "業務要件からのエンティティ抽出、スーパータイプ/サブタイプ、多対多の関連エンティティ化、正規化と関数従属の厳密な検証を学びます。",
    topics: [
      {
        id: "db-ds-1",
        code: "DB 1.1",
        title: "E-R図モデリングと関数従属・正規化",
        keywords: ["E-R図", "関連エンティティ", "スーパータイプ/サブタイプ", "ボイス・コッド正規形(BCNF)", "第4・第5正規形"],
        keyPoints: [
          "多対多（M:N）の関連はそのまま実装できないため、双方の主キーを外部キーとして持つ「関連エンティティ（連関エンティティ）」へ分解する",
          "履歴管理（単価改定や組織異動等）を扱う場合は、主キーに「適用開始日」などの時間属性を含めて複合主キーにする",
          "排他的サブタイプでは、区分コードと各サブタイプの整合性を保つ制約設計（または NULL 許容の単一テーブル統合）を検討する",
        ],
        examTip: "午後Ⅰ・午後Ⅱのモデリング問題では、問題文の「〜ごとに1つ」「〜の履歴を保持する」という業務ルールから主キーと多重度を正確に読み取ります。",
      },
      {
        id: "db-ds-2",
        code: "DB 1.2",
        title: "SQL 応用とパフォーマンス・実行計画",
        keywords: ["ウィンドウ関数", "CTE (WITH句)", "相関サブクエリ", "B+木インデックス", "ハッシュ結合/ネステッドループ結合"],
        keyPoints: [
          "ウィンドウ関数（OVER / PARTITION BY / ORDER BY）により、グループ集約と行ごとの詳細表示・ランキングを 1 回のスキャンで記述できる",
          "複合インデックス（A, B）は先頭列 A を含む条件で有効（最左プレフィックス原則）。列に対する関数適用や後方一致 LIKE '%abc' はインデックス無効化の原因",
          "結合アルゴリズム：ネステッドループ結合（小規模駆動表＋インデックス有りに有効）、ハッシュ結合（大規模表の等価結合に有効）、ソートマージ結合",
        ],
        examTip: "実行計画（EXPLAIN）の読み取りと、インデックスを効かせるための SQL 書き換え・統計情報更新は定番出題です。",
      },
    ],
  },
  {
    id: "db-ops",
    examId: "db",
    number: "DB-2",
    category: "テクノロジ系",
    title: "同時実行制御・障害回復・分散/クラウドDB",
    accentColor: "indigo",
    summary: "MVCC・2相ロック・分離レベルと異常現象、WAL（Write-Ahead Logging）・チェックポイント、2相コミット（2PC）とレプリケーションを学びます。",
    topics: [
      {
        id: "db-op-1",
        code: "DB 2.1",
        title: "トランザクション分離レベルとロック・MVCC",
        keywords: ["ダーティリード", "ノンリピータブルリード", "ファントムリード", "MVCC", "2相コミット(2PC)"],
        keyPoints: [
          "Read Committed はダーティリードを防ぎ、Repeatable Read はノンリピータブルリードを防ぎ、Serializable はファントムリードまで防ぐ",
          "MVCC（多版型同時実行制御）では読取りが書込みをブロックせず、スナップショット時点の一貫性を保てる",
          "分散データベースの2相コミット（Prepare 相 → Commit 相）は原子性を保証するが、コーディネータ障害時のブロッキングが課題",
        ],
        examTip: "各分離レベルで「どの異常現象（ダーティ／ファジー／ファントム）が発生し得るか」の対応表は確実に暗記しましょう。",
      },
    ],
  },

  // --- ネットワークスペシャリスト (NW) ---
  {
    id: "nw-arch",
    examId: "nw",
    number: "NW-1",
    category: "テクノロジ系",
    title: "L2/L3 冗長化設計とルーティング（OSPF/BGP）",
    accentColor: "emerald",
    summary: "STP/RSTP・リンクアグリゲーション、VRRP/HSRP、OSPF エリア設計・BGP パス属性・MPLS・SD-WAN による高可用ネットワーク設計を学びます。",
    topics: [
      {
        id: "nw-ar-1",
        code: "NW 1.1",
        title: "L2スイッチング・冗長化（STP/LAG/VRRP）",
        keywords: ["RSTP (802.1w)", "IEEE 802.1Q VLAN", "LACP (802.3ad)", "VRRP", "Gratuitous ARP"],
        keyPoints: [
          "RSTP は従来の STP（最大30〜50秒）より高速にコンバージェンス（数秒以内）し、ループを防止する",
          "VRRP ではマスターが仮想 IP と仮想 MAC（00-00-5E-00-01-XX）を保持し、切り替え時に Gratuitous ARP を送信してスイッチの MAC テーブルを更新する",
          "LACP（リンクアグリゲーション）は複数物理リンクを論理1本に束ねて帯域拡張と耐障害性を両立する",
        ],
        examTip: "午後問題では VRRP のマスター/バックアップ切り替え時のパケット経路と ARP テーブルの挙動がよく問われます。",
      },
      {
        id: "nw-ar-2",
        code: "NW 1.2",
        title: "ルーティング応用（OSPF / BGP）と IPv6",
        keywords: ["OSPF DR/BDR", "エリア0（バックボーン）", "BGP AS_PATH/MED/LOCAL_PREF", "IPv6 SLAAC/DHCPv6"],
        keyPoints: [
          "OSPF はマルチエリア構成時に全エリアがエリア0（バックボーンエリア）に物理的または仮想リンクで接続される必要がある",
          "BGP の経路選択基準：LOCAL_PREF（大きい方・AS内送信方向制御）＞ AS_PATH 長（短い方）＞ ORIGIN ＞ MED（小さい方・外部からの流入制御）",
          "TCP スループットは帯域幅だけでなく RTT とウィンドウサイズ（BDP：帯域遅延積）に制約されるため、大規模遅延回線ではウィンドウ拡大オプションが重要",
        ],
        examTip: "BGP の LOCAL_PREF（自ASからの出口選択）と MED（相手ASからの入口誘導）の役割の違いは頻出です。",
      },
    ],
  },
  {
    id: "nw-app",
    examId: "nw",
    number: "NW-2",
    category: "テクノロジ系",
    title: "上位プロトコル（DNS/HTTP/TLS）と NW セキュリティ",
    accentColor: "cyan",
    summary: "DNS 再帰検索と権威サーバ・キャッシュポイズニング対策、HTTP/2・HTTP/3(QUIC)、プロキシ・ロードバランサ（DSR）・無線LAN（WPA3）を学びます。",
    topics: [
      {
        id: "nw-ap-1",
        code: "NW 2.1",
        title: "DNS・HTTP/3 (QUIC)・負荷分散方式",
        keywords: ["QUIC (UDP 443)", "DNS 再帰/反復", "DSR (Direct Server Return)", "X-Forwarded-For", "WPA3-Enterprise"],
        keyPoints: [
          "HTTP/3 はトランスポート層に UDP ベースの QUIC を採用し、TCP の Head-of-Line Blocking 解消と TLS 1.3 統合による 0-RTT/1-RTT 接続を実現",
          "DSR 構成のロードバランサでは戻りパケットをサーバから直接クライアントへ返すため、LB の負荷を大幅に軽減できる",
          "プロキシやリバースプロキシ経由時は接続元 IP がプロキシのものになるため、`X-Forwarded-For` ヘッダや PROXY protocol で元のクライアント IP を引き継ぐ",
        ],
        examTip: "午後ネットワーク設計では「パケットの送信元/宛先 IP・ポート・MAC が各機器通過時にどう書き換わるか」を表に整理する力が問われます。",
      },
    ],
  },
];

// 区分横断・比較表データ
export const ipaComparisons: IpaComparisonTable[] = [
  {
    id: "comp-crypto",
    examIds: ["ip", "fe", "ap", "sc", "nw"],
    category: "ネットワーク・セキュリティ",
    title: "暗号化方式とデジタル署名の比較",
    subtitle: "鍵の種類・処理速度・用途の違い（IP〜高度共通重要テーマ）",
    columns: ["共通鍵暗号 (AES等)", "公開鍵暗号 (RSA等)", "デジタル署名"],
    rows: [
      { feature: "使用する鍵", values: ["暗号化・復号で同じ鍵", "受信者の公開鍵で暗号化 / 秘密鍵で復号", "送信者の秘密鍵で署名 / 公開鍵で検証"] },
      { feature: "処理速度", values: ["高速（大量データ向き）", "低速（鍵配送・少容量向き）", "ハッシュ値に対して行うため高速"] },
      { feature: "主な目的", values: ["通信・データの機密性確保", "鍵配送・ハイブリッド暗号", "改ざん検知・送信元認証・否認防止"] },
      { feature: "鍵数の問題 (n人)", values: ["n(n-1)/2 個必要（鍵配送問題）", "2n 個で済む", "公開鍵の正当性確認に PKI/CA が必要"] },
    ],
    decisionRule: "「データを隠す」なら受信者の公開鍵（または共通鍵）、「本人証明・改ざん検知」なら送信者の秘密鍵で署名する。",
  },
  {
    id: "comp-auth",
    examIds: ["fe", "ap", "sc"],
    category: "ネットワーク・セキュリティ",
    title: "Webセキュリティ攻撃と根本対策",
    subtitle: "脆弱性の原理と試験で問われる正しい対策",
    columns: ["SQLインジェクション", "XSS (クロスサイトスクリプティング)", "CSRF (クロスサイトリクエストフォージェリ)"],
    rows: [
      { feature: "攻撃対象", values: ["サーバ側の DB", "利用者のブラウザ（JS実行）", "認証済み利用者のブラウザ経由で意図しない操作"] },
      { feature: "主な被害", values: ["DB情報の窃取・改ざん・削除", "Cookie窃取・画面改ざん", "勝手な送金・パスワード変更・退会"] },
      { feature: "根本対策", values: ["プレースホルダ（バインド機構）", "出力時の HTML エスケープ", "推測困難な CSRF トークンの検証"] },
    ],
    decisionRule: "SQLi＝プレースホルダ、XSS＝エスケープ、CSRF＝トークン検証＋SameSite Cookie。",
  },
  {
    id: "comp-dev-model",
    examIds: ["ip", "fe", "ap"],
    category: "開発・データベース",
    title: "ソフトウェア開発モデルの使い分け",
    subtitle: "ウォーターフォール・アジャイル・プロトタイピング比較",
    columns: ["ウォーターフォール", "アジャイル（スクラム等）", "プロトタイピング"],
    rows: [
      { feature: "進め方", values: ["上流から下流へ順番に工程完了", "短いスプリントを反復し段階的リリース", "試作品（プロトタイプ）を早期に作成・評価"] },
      { feature: "仕様変更への強さ", values: ["低い（後工程ほど手戻りコスト大）", "高い（変更を前提に優先順位調整）", "仕様が曖昧な初期段階の認識合わせに強い"] },
      { feature: "向いている案件", values: ["要件が明確な大規模・基幹系", "市場変化が速いWeb/新規事業", "UI/UX や操作感の合意が必要な案件"] },
    ],
    decisionRule: "要件固定・大規模ならウォーターフォール、変化対応・早期価値提供ならアジャイル。",
  },
  {
    id: "comp-raid",
    examIds: ["fe", "ap"],
    category: "コンピュータ基礎",
    title: "RAID レベル比較（RAID 0 / 1 / 5 / 6）",
    subtitle: "耐障害性・必要台数・実効容量の違い",
    columns: ["RAID 0 (ストライピング)", "RAID 1 (ミラーリング)", "RAID 5", "RAID 6"],
    rows: [
      { feature: "最低台数", values: ["2台", "2台", "3台", "4台"] },
      { feature: "実効容量 (n台)", values: ["n 台分 (100%)", "n/2 台分 (50%)", "n - 1 台分", "n - 2 台分"] },
      { feature: "耐障害性", values: ["なし（1台故障で全損）", "1台故障まで継続", "1台故障まで継続", "2台同時故障まで継続"] },
      { feature: "特徴", values: ["高速化のみ・冗長性なし", "最もシンプルで復元が速い", "パリティを全ディスクに分散", "パリティを2重に分散"] },
    ],
    decisionRule: "RAID 0 は冗長性なしに注意。1台故障耐性で容量効率重視なら RAID 5、2台同時故障対策なら RAID 6。",
  },
  {
    id: "comp-test",
    examIds: ["fe", "ap"],
    category: "開発・データベース",
    title: "ブラックボックステスト vs ホワイトボックステスト",
    subtitle: "テスト設計技法と網羅基準",
    columns: ["ブラックボックステスト", "ホワイトボックステスト"],
    rows: [
      { feature: "着眼点", values: ["外部仕様（入力と出力の関係）", "内部構造（ソースコードの制御パス）"] },
      { feature: "主な技法", values: ["同値分割・限界値分析・デシジョンテーブル", "命令網羅(C0)・分岐網羅(C1)・条件網羅(C2)"] },
      { feature: "適用工程", values: ["結合テスト・システムテスト中心", "単体テスト中心"] },
    ],
    decisionRule: "仕様ベースの境界値確認はブラックボックス、分岐やロジックの網羅確認はホワイトボックス。",
  },
  {
    id: "comp-sso",
    examIds: ["ap", "sc"],
    category: "ネットワーク・セキュリティ",
    title: "認証・認可連携プロトコル（SAML / OAuth 2.0 / OIDC）",
    subtitle: "エンタープライズ SSO と API 認可の使い分け",
    columns: ["SAML 2.0", "OAuth 2.0", "OpenID Connect (OIDC)"],
    rows: [
      { feature: "主な目的", values: ["認証（Web SSO）", "認可（アクセス権限の委譲）", "認証 ＋ 認可"] },
      { feature: "データ形式", values: ["XML（SAML アサーション）", "JSON / トークン", "JSON（JWT形式の ID トークン）"] },
      { feature: "主な用途", values: ["社内 IdP と SaaS 間の SSO", "サードパーティアプリへの API 権限付与", "モバイル/SPA/Web のモダン認証"] },
    ],
    decisionRule: "エンタープライズ SaaS の SSO には SAML、API 認可は OAuth 2.0、モダンアプリ認証には OIDC（＋PKCE）。",
  },
  {
    id: "comp-isolation",
    examIds: ["ap", "db"],
    category: "開発・データベース",
    title: "トランザクション分離レベルと異常現象",
    subtitle: "発生し得る異常（○＝防止、×＝発生し得る）",
    columns: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
    rows: [
      { feature: "ダーティリード", values: ["× 発生", "○ 防止", "○ 防止", "○ 防止"] },
      { feature: "ノンリピータブルリード", values: ["× 発生", "× 発生", "○ 防止", "○ 防止"] },
      { feature: "ファントムリード", values: ["× 発生", "× 発生", "× 発生", "○ 防止"] },
    ],
    decisionRule: "RDBMS 標準の多くは Read Committed または Repeatable Read（MVCC）。厳密な直列化が必要な場合のみ Serializable を選択。",
  },
  {
    id: "comp-routing",
    examIds: ["ap", "nw"],
    category: "ネットワーク・セキュリティ",
    title: "ルーティングプロトコル比較（RIP / OSPF / BGP）",
    subtitle: "アルゴリズム・適用範囲・メトリックの違い",
    columns: ["RIP / RIPv2", "OSPF", "BGP-4"],
    rows: [
      { feature: "分類", values: ["IGP（AS内）", "IGP（AS内）", "EGP（AS間）"] },
      { feature: "方式", values: ["ディスタンスベクタ型", "リンクステート型（SPF）", "パスベクタ型"] },
      { feature: "経路選択基準", values: ["ホップ数（最大15）", "リンクコスト（帯域幅反比例）", "パス属性（LOCAL_PREF, AS_PATH等）"] },
      { feature: "トランスポート", values: ["UDP 520", "IP プロトコル番号 89", "TCP 179"] },
    ],
    decisionRule: "大規模社内網・データセンタ内は OSPF、ISP やマルチホーム接続・クラウド間 BGP ピアリングは BGP-4。",
  },
];

// 頻出公式・思考パターン
export const ipaFormulaPatterns: IpaFormulaPattern[] = [
  {
    id: "pat-availability",
    examIds: ["ip", "fe", "ap", "nw"],
    title: "直列・並列システムの稼働率計算",
    badge: "頻出計算",
    flow: ["直列: A × B", "並列: 1 - (1-A)(1-B)", "複合系は部分ごとに分解"],
    summary: "機器を冗長化（並列）すると稼働率は向上し、直列につなぐと稼働率は低下します。",
    keyDesignPoints: [
      "例：稼働率 0.9 の機器を2台並列にすると 1 - (0.1 × 0.1) = 0.99",
      "MTBF（平均故障間隔）と MTTR（平均修復時間）から稼働率 = MTBF ÷ (MTBF + MTTR)",
    ],
  },
  {
    id: "pat-breakeven",
    examIds: ["ip", "fe", "ap"],
    title: "損益分岐点売上高の算出",
    badge: "ストラテジ定番",
    flow: ["変動費率 = 変動費 ÷ 売上高", "限界利益率 = 1 - 変動費率", "損益分岐点 = 固定費 ÷ 限界利益率"],
    summary: "利益がゼロになる売上高を求める公式です。目標利益がある場合は分子に（固定費＋目標利益）を置きます。",
    keyDesignPoints: [
      "固定費 300万円、変動費率 0.4（40%）なら、限界利益率 0.6 → 300 ÷ 0.6 = 500万円",
      "目標利益 120万円を加える場合は (300 + 120) ÷ 0.6 = 700万円",
    ],
  },
  {
    id: "pat-subnet",
    examIds: ["fe", "ap", "nw"],
    title: "CIDR / サブネットホスト数の計算",
    badge: "ネットワーク基礎",
    flow: ["ホスト部ビット数 h = 32 - プレフィックス長", "総アドレス数 = 2^h", "割当可能ホスト数 = 2^h - 2"],
    summary: "ネットワークアドレス（全ビット0）とブロードキャストアドレス（全ビット1）の2つを除いた数が端末に割り当て可能です。",
    keyDesignPoints: [
      "/24 の場合：h = 8 → 2^8 - 2 = 254 台",
      "/26 の場合：h = 6 → 2^6 - 2 = 62 台（64刻みでサブネット分割）",
    ],
  },
  {
    id: "pat-critical-path",
    examIds: ["fe", "ap"],
    title: "アローダイアグラムとクリティカルパス",
    badge: "マネジメント定番",
    flow: ["最早結合点時刻（順方向で最大値）", "最遅結合点時刻（逆方向で最小値）", "余裕時間 = 0 の経路がクリティカルパス"],
    summary: "プロジェクト全体の最短所要日数を決める最長経路がクリティカルパスです。この経路上の遅れは全体遅延に直結します。",
    keyDesignPoints: [
      "合流点では「すべての先行作業が終わるまで次へ進めない」ため、順方向では最大値を取る",
      "短縮（クラッシング）を検討する際は、クリティカルパス上の作業から優先して短縮する",
    ],
  },
  {
    id: "pat-bdp",
    examIds: ["nw"],
    title: "TCP 帯域遅延積（BDP）と実効スループット",
    badge: "NW 性能計算",
    flow: ["BDP = 帯域幅(bps) × RTT(秒)", "最大ウィンドウサイズ(byte) × 8 ÷ RTT", "理論上限と比較"],
    summary: "高遅延回線では TCP ウィンドウサイズ（標準 64KB）がボトルネックになり、回線帯域を使い切れないことがあります。",
    keyDesignPoints: [
      "例：RTT 100ms（0.1秒）、ウィンドウサイズ 64KB（≒ 524,288 bit）のとき、実効上限 ≒ 5.24 Mbps",
      "対策として TCP ウィンドウ拡大オプション（RFC 7323）を有効化する",
    ],
  },
  {
    id: "pat-db-io",
    examIds: ["db"],
    title: "B+木インデックスのブロック参照回数",
    badge: "DB 物理設計",
    flow: ["ルートノード → 中間ノード → リーフノード", "高さ h 回の I/O ＋ 実テーブル参照", "ファンアウト数（1ページ内のポインタ数）で決まる"],
    summary: "数千万件のテーブルでも B+木の高さは通常 3〜4 階層に収まるため、極少数のブロック読込みで目的行へ到達できます。",
    keyDesignPoints: [
      "カバリングインデックス（インデックスのみで SELECT 列を完結）なら実テーブル参照 I/O も削減可能",
      "カーディナリティ（値の種類の多さ）が低い列への単一インデックスは効果が薄い",
    ],
  },
];

// ひっかけ・誤答パターン
export const ipaPitfalls: IpaPitfall[] = [
  {
    id: "pit-mfa",
    examIds: ["ip", "fe", "ap"],
    trap: "「パスワード」＋「秘密の質問」の2段階認証を多要素認証（MFA）だと選んでしまう",
    whyWrong: "パスワードも秘密の質問もどちらも「知識情報」であり、要素が1種類しか使われていません。",
    correctApproach: "多要素認証は「知識」「所有」「生体」の異なる2種類以上の要素を組み合わせる必要があります。",
  },
  {
    id: "pit-raid0",
    examIds: ["fe", "ap"],
    trap: "RAID 0 は複数台構成なので1台壊れてもデータが守られると誤解する",
    whyWrong: "RAID 0（ストライピング）はデータを分割して並列書込みするのみで、冗長データ（ミラーやパリティ）を持ちません。",
    correctApproach: "耐障害性が必要な場合は RAID 1（ミラーリング）や RAID 5 / 6（パリティ分散）を選びます。",
  },
  {
    id: "pit-rto-rpo",
    examIds: ["ap", "db", "nw"],
    trap: "RTO（目標復旧時間）と RPO（目標復旧時点）を取り違える",
    whyWrong: "どちらも復旧目標ですが、基準となる軸（停止後の経過時間 vs 障害前のデータ時点）が異なります。",
    correctApproach: "RTO は Time（何時間以内にシステムを復旧させるか）、RPO は Point（どの時点のデータまで戻すか）で覚えます。",
  },
  {
    id: "pit-copyright",
    examIds: ["ip", "fe"],
    trap: "社員が業務で作成したプログラムの著作権は、作成した社員個人に帰属すると思ってしまう",
    whyWrong: "職務著作（法人著作）の要件を満たす場合、特約がなければ著作権は原則として法人（会社）に帰属します。",
    correctApproach: "職務著作（法人帰属）と、外部委託時の権利帰属（特約がなければ原則として開発元＝受託側に帰属）を区別します。",
  },
  {
    id: "pit-cors",
    examIds: ["sc"],
    trap: "CORS で `Access-Control-Allow-Origin: *` と `Access-Control-Allow-Credentials: true` を同時に設定できると思ってしまう",
    whyWrong: "認証情報（Cookie 等）を伴うリクエストに対してワイルドカード `*` は仕様上許可されておらず、ブラウザがレスポンスをブロックします。",
    correctApproach: "Credentials を許可する場合は、信頼できる単一のオリジンを明示的に指定（または許可リストと照合して動的に返却）します。",
  },
  {
    id: "pit-null-sql",
    examIds: ["db"],
    trap: "SQL の `WHERE col != 'A'` や `NOT IN (サブクエリ)` で NULL を含む行が想定通り処理されると思ってしまう",
    whyWrong: "SQL は 3値論理（TRUE / FALSE / UNKNOWN）のため、NULL との比較結果は UNKNOWN となり、NOT IN のサブクエリ結果に NULL が1件でも含まれると全行が返らなくなります。",
    correctApproach: "NULL の判定には必ず `IS NULL` / `IS NOT NULL` を使い、存在否定には `NOT EXISTS` を優先します。",
  },
];

// 重要数値・用語早見
export const ipaKeyFacts: IpaKeyFact[] = [
  { id: "kf-cia", examIds: ["ip", "fe", "ap"], target: "情報セキュリティ3要素", value: "機密性・完全性・可用性", detail: "CIA。真正性・責任追跡性等を加える場合もある" },
  { id: "kf-http", examIds: ["ip", "fe", "ap"], target: "主要ウェルノウンポート", value: "HTTP:80 / HTTPS:443 / SSH:22", detail: "DNS:53、SMTP:25、POP3:110、IMAP:143" },
  { id: "kf-acid", examIds: ["fe", "ap"], target: "トランザクション特性", value: "ACID（原子・一貫・独立・永続）", detail: "すべて完了するか、すべて取り消す（All or Nothing）" },
  { id: "kf-sla", examIds: ["ip", "fe", "ap"], target: "SLA 99.9% の年間停止目安", value: "約 8.76 時間 / 年", detail: "365日 × 24時間 × 0.001 ≒ 8.76時間" },
  { id: "kf-oauth", examIds: ["ap", "sc"], target: "OAuth 2.0 vs OIDC", value: "OAuth=認可 / OIDC=認証", detail: "OpenID Connect は ID トークンで本人認証を行う" },
  { id: "kf-c0c1", examIds: ["fe", "ap"], target: "ホワイトボックス網羅率", value: "C0(命令) ＜ C1(分岐) ＜ C2(条件)", detail: "C1（分岐網羅）はすべての真・偽の分岐を1回以上通る" },
  { id: "kf-ip-pass", examIds: ["ip"], target: "ITパスポート合格ライン", value: "総合600点 & 各分野300点以上", detail: "1分野でも300点未満があると不合格" },
  { id: "kf-ap-pass", examIds: ["ap"], target: "応用情報 多段階選抜", value: "午前60点以上で午後採点", detail: "午前が不合格基準だと午後は採点されない" },
  { id: "kf-sc-volatile", examIds: ["sc"], target: "フォレンジック保全順序", value: "レジスタ → RAM → NW → ディスク", detail: "RFC 3227：揮発性の高いデータから順に保全する" },
  { id: "kf-db-acid", examIds: ["db"], target: "WAL（先行書込みログ）", value: "データページより先にログを永続化", detail: "クラッシュ時のロールフォワード/ロールバックを保証" },
  { id: "kf-nw-mtu", examIds: ["nw"], target: "Ethernet / PPPoE MTU", value: "Ethernet: 1500B / PPPoE: 1492B", detail: "IPsec 等カプセル化時は MSS クランプや PMTUD に注意" },
];

// フラッシュカード（区分別）
export const ipaFlashcards: IpaFlashcardItem[] = [
  // IP
  {
    examId: "ip",
    keyword: "発注側がベンダーに対し、システム要件や調達条件を示して具体的な提案を求める文書",
    category: "IP ストラテジ",
    recommended: "RFP（提案依頼書）",
    reason: "情報収集段階の RFI（情報提供依頼書）の後、具体的な提案・見積を求める際に作成します。",
  },
  {
    examId: "ip",
    keyword: "システムの障害発生時、根本原因の究明よりも先に「サービスの迅速な一次復旧」を目的とするプロセス",
    category: "IP マネジメント",
    recommended: "インシデント管理",
    reason: "一次復旧がインシデント管理、再発防止のための根本原因究明が「問題管理」です。",
  },
  {
    examId: "ip",
    keyword: "知識・所有・生体のうち、異なる2種類以上の要素を組み合わせて本人確認を行う認証方式",
    category: "IP セキュリティ",
    recommended: "多要素認証（MFA）",
    reason: "同一カテゴリを2つ（例：パスワード＋PIN）組み合わせても多要素認証にはなりません。",
  },
  {
    examId: "ip",
    keyword: "生成AIが事実に基づかないもっともらしく誤った情報を出力してしまう現象",
    category: "IP AI・データ",
    recommended: "ハルシネーション（Hallucination）",
    reason: "RAG（検索拡張生成）や人間によるファクトチェック（Human-in-the-Loop）でリスクを低減します。",
  },
  {
    examId: "ip",
    keyword: "サービス提供者と利用者の間で、稼働率や応答時間などの品質水準を数値で合意する契約",
    category: "IP マネジメント",
    recommended: "SLA（Service Level Agreement）",
    reason: "SLO（目標値）や KPI と連動し、品質の客観的評価と継続的改善（SLM）に使います。",
  },
  {
    examId: "ip",
    keyword: "ドメイン名（例：example.com）と IP アドレスを相互に変換する仕組み",
    category: "IP テクノロジ",
    recommended: "DNS（Domain Name System）",
    reason: "UDP/TCP ポート 53 を使用し、名前解決を行います。",
  },
  {
    examId: "ip",
    keyword: "市場成長率と市場占有率の2軸で事業を「花形・金のなる木・問題児・負け犬」に分類する手法",
    category: "IP ストラテジ",
    recommended: "PPM（プロダクトポートフォリオマネジメント）",
    reason: "限られた経営資源をどの事業へ配分するかを判断するフレームワークです。",
  },

  // FE
  {
    examId: "fe",
    keyword: "ソート済みの配列に対して中央の要素と比較を繰り返し、探索範囲を半分ずつ狭めるアルゴリズム",
    category: "FE アルゴリズム",
    recommended: "二分探索法（バイナリサーチ）",
    reason: "計算量は O(log n) と高速ですが、事前にデータが整列されている必要があります。",
  },
  {
    examId: "fe",
    keyword: "SQL文の構造と入力パラメータを分離し、SQLインジェクションを根本的に防ぐ実装手法",
    category: "FE セキュリティ",
    recommended: "プレースホルダ（プリペアドステートメント）",
    reason: "入力値をSQL構文として解釈させず、単なるリテラル値として安全に処理します。",
  },
  {
    examId: "fe",
    keyword: "Webサイトへの出力時に `<` や `>` などを無害な文字実体参照へ変換する XSS 対策",
    category: "FE セキュリティ",
    recommended: "HTML エスケープ処理（サニタイジング）",
    reason: "ブラウザ上で悪意あるスクリプトが実行されるのを防ぎます。",
  },
  {
    examId: "fe",
    keyword: "主キー以外の項目が主キーの一部にのみ依存する（部分関数従属）状態を解消する正規化",
    category: "FE データベース",
    recommended: "第2正規化",
    reason: "第1正規化＝繰り返し排除、第2正規化＝部分関数従属排除、第3正規化＝推移的関数従属排除です。",
  },
  {
    examId: "fe",
    keyword: "プライベート IP アドレスとグローバル IP アドレスを、ポート番号も含めて 1 対多で変換する技術",
    category: "FE ネットワーク",
    recommended: "NAPT（IPマスカレード）",
    reason: "1つのグローバル IP で複数の社内端末が同時にインターネット通信できます。",
  },
  {
    examId: "fe",
    keyword: "送信者が自身の「秘密鍵」でハッシュ値を暗号化して付与し、改ざん検知と本人証明を行う技術",
    category: "FE セキュリティ",
    recommended: "デジタル署名",
    reason: "受信者は送信者の「公開鍵」で署名を検証します。",
  },
  {
    examId: "fe",
    keyword: "後入れ先出し（LIFO）でデータを管理し、関数の戻り番地保存や再帰処理に使われるデータ構造",
    category: "FE データ構造",
    recommended: "スタック（Stack）",
    reason: "先入れ先出し（FIFO）で待ち行列に使われるのは「キュー（Queue）」です。",
  },

  // AP
  {
    examId: "ap",
    keyword: "障害発生時にシステムを安全な状態へ停止・制御する設計思想（例：故障時に赤信号にする）",
    category: "AP アーキテクチャ",
    recommended: "フェールセーフ（Fail Safe）",
    reason: "機能を一部制限してでも稼働を継続する「フェールソフト」や、誤操作を防ぐ「フールプルーフ」と区別します。",
  },
  {
    examId: "ap",
    keyword: "AS（自律システム）間の経路制御に用いられ、パスベクトル型で動作するルーティングプロトコル",
    category: "AP ネットワーク",
    recommended: "BGP（Border Gateway Protocol）",
    reason: "AS 内の経路制御にはリンク状態型の OSPF などが使われます。",
  },
  {
    examId: "ap",
    keyword: "災害・障害発生時に許容できる「最大データ損失時点（どこまでの過去データを戻すか）」の目標",
    category: "AP サービス/BCP",
    recommended: "RPO（目標復旧時点）",
    reason: "システム復旧までの許容時間は RTO（目標復旧時間）です。",
  },
  {
    examId: "ap",
    keyword: "OAuth 2.0 の仕組みを拡張し、ID トークンを発行してユーザーの「本人認証」を実現するプロトコル",
    category: "AP セキュリティ",
    recommended: "OpenID Connect（OIDC）",
    reason: "OAuth 2.0 単体は「認可（権限委譲）」のためのフレームワークです。",
  },
  {
    examId: "ap",
    keyword: "将来得られるキャッシュフローを現在価値に割り引いて合計し、初期投資額を差し引いた投資評価指標",
    category: "AP ストラテジ",
    recommended: "NPV（正味現在価値）",
    reason: "NPV ＞ 0 であれば資本コストを上回る投資価値があると判断できます。",
  },
  {
    examId: "ap",
    keyword: "メール送信元の正規性を電子署名によって検証する送信ドメイン認証技術",
    category: "AP セキュリティ",
    recommended: "DKIM（DomainKeys Identified Mail）",
    reason: "IPアドレスで検証するのが SPF、認証失敗時の扱いをポリシー指定するのが DMARC です。",
  },
  {
    examId: "ap",
    keyword: "システムがクラッシュした際、チェックポイント以降の「更新後ログ」を使って確定済みトランザクションを再反映する復旧処理",
    category: "AP データベース",
    recommended: "ロールフォワード（Roll Forward）",
    reason: "未完了トランザクションを取り消す処理は「ロールバック（更新前ログを使用）」です。",
  },

  // SC (情報処理安全確保支援士)
  {
    examId: "sc",
    keyword: "外部からの入力URL等を検証せずサーバ側が代理リクエストを送り、内部網やメタデータAPIへ不正アクセスさせる攻撃",
    category: "SC Webセキュリティ",
    recommended: "SSRF（Server-Side Request Forgery）",
    reason: "許可ドメインのホワイトリスト検証やプライベートIP帯への接続禁止、IMDSv2 化などで対策します。",
  },
  {
    examId: "sc",
    keyword: "ブラウザに対し、以降そのドメインへの接続を強制的に HTTPS のみに制限させる HTTP レスポンスヘッダ",
    category: "SC 暗号・通信",
    recommended: "HSTS（Strict-Transport-Security）",
    reason: "初回接続時の HTTP ダウングレード（SSLストリッピング）攻撃を防止します。",
  },
  {
    examId: "sc",
    keyword: "OAuth 2.0 の認可コードフローにおいて、SPA やネイティブアプリが認可コードを横取りされるのを防ぐ拡張仕様",
    category: "SC 認証・認可",
    recommended: "PKCE（Proof Key for Code Exchange）",
    reason: "クライアントが生成した code_verifier と code_challenge を使い、正当なクライアントのみトークン交換を許可します。",
  },
  {
    examId: "sc",
    keyword: "透明な iframe に悪意のないサイトを重ね、利用者の意図しないボタンをクリックさせる攻撃",
    category: "SC Webセキュリティ",
    recommended: "クリックジャッキング（Clickjacking）",
    reason: "X-Frame-Options: DENY または CSP の frame-ancestors で他サイトからのフレーム埋め込みを禁止します。",
  },
  {
    examId: "sc",
    keyword: "ソフトウェアに含まれる OSS やライブラリの依存関係を一覧化し、脆弱性影響範囲を迅速に把握するための部品表",
    category: "SC 脆弱性管理",
    recommended: "SBOM（Software Bill of Materials）",
    reason: "SPDX や CycloneDX などの標準形式で管理し、サプライチェーンリスク対策に活用します。",
  },

  // DB (データベーススペシャリスト)
  {
    examId: "db",
    keyword: "E-R図において多対多（M:N）の関連を実装可能な1対多の関係へ分解するために設ける中間テーブル",
    category: "DB モデリング",
    recommended: "関連エンティティ（連関エンティティ）",
    reason: "双方のエンティティの主キーを外部キーとして持ち、関連固有の属性（数量や日付等）も保持します。",
  },
  {
    examId: "db",
    keyword: "読取りトランザクションと書込みトランザクションが互いにブロックし合わないよう、データの複数バージョンを保持する制御方式",
    category: "DB 同時実行制御",
    recommended: "MVCC（多版型同時実行制御）",
    reason: "スナップショット分離により、参照系クエリの高い同時実行性を確保できます。",
  },
  {
    examId: "db",
    keyword: "SELECT 句で必要な列がすべてインデックス内に含まれており、実テーブルへのアクセスを省略できる検索手法",
    category: "DB 物理設計",
    recommended: "カバリングインデックス（Index-Only Scan）",
    reason: "ランダム I/O を大幅に削減し、クエリ性能を劇的に改善できます。",
  },
  {
    examId: "db",
    keyword: "データページ本体をディスクへ書き込む前に、必ずトランザクションログを永続化する DB 復旧の基本原則",
    category: "DB 障害回復",
    recommended: "WAL（Write-Ahead Logging）",
    reason: "バッファ上の未反映データがクラッシュで失われても、ログからロールフォワード復旧が可能になります。",
  },
  {
    examId: "db",
    keyword: "複数の分散データベースノード間で原子性（全確定または全取消）を保証するための合意プロトコル",
    category: "DB 分散設計",
    recommended: "2相コミット（2PC）",
    reason: "Prepare 相で全ノードのコミット可否を確認し、全員 OK の場合のみ Commit 相を実行します。",
  },

  // NW (ネットワークスペシャリスト)
  {
    examId: "nw",
    keyword: "VRRP 等でマスターが切り替わった際、配下 L2 スイッチの MAC アドレステーブルを即座に更新させるために送る特殊な ARP",
    category: "NW 冗長化",
    recommended: "Gratuitous ARP（GARP）",
    reason: "自身の IP/MAC を送信元・ターゲット双方にセットしてブロードキャストし、経路切り替えを周知します。",
  },
  {
    examId: "nw",
    keyword: "ロードバランサが受信したリクエストをバックエンドへ転送し、戻りパケットはサーバから直接クライアントへ返す高速負荷分散構成",
    category: "NW 負荷分散",
    recommended: "DSR（Direct Server Return）",
    reason: "データ量の大きいレスポンス通信が LB を経由しないため、LB の帯域・処理負荷を抑えられます。",
  },
  {
    examId: "nw",
    keyword: "BGP において、自 AS 内から外部 AS へ向かう際の「出口ルータ」の優先順位を制御するために使うパス属性",
    category: "NW ルーティング",
    recommended: "LOCAL_PREF",
    reason: "LOCAL_PREF は値が大きい経路が優先されます（AS 内のみで伝播）。外部からの入口誘導には MED を使います。",
  },
  {
    examId: "nw",
    keyword: "UDP 上に暗号化（TLS 1.3）と多重化ストリームを統合し、TCP の Head-of-Line Blocking を解消した HTTP/3 の基盤プロトコル",
    category: "NW 上位プロトコル",
    recommended: "QUIC",
    reason: "コネクションマイグレーションにより Wi-Fi とモバイル回線の切り替え時も接続を維持できます。",
  },
  {
    examId: "nw",
    keyword: "リバースプロキシやロードバランサ経由時に、バックエンドサーバへ元のクライアント IP アドレスを伝える HTTP ヘッダ",
    category: "NW プロキシ/LB",
    recommended: "X-Forwarded-For",
    reason: "Web サーバのアクセスログ記録や IP 制限でクライアント実 IP を把握するために利用します。",
  },
];

// 練習問題（区分別：各10問）
export const ipaPracticeQuestions: IpaQuestion[] = [
  // --- IP (ITパスポート) ---
  {
    examId: "ip",
    id: "ip-q1",
    domainId: "ip-strategy",
    domainLabel: "IP-1: 企業と法務・経営戦略",
    difficulty: "基礎",
    selectCount: 1,
    question: "知的財産権のうち、特許庁への出願や登録の手続きを必要とせず、創作した時点で自動的に権利が発生するものはどれか。",
    options: ["特許権", "著作権", "商標権", "意匠権"],
    correctIndices: [1],
    explanation: "著作権は無方式主義を採用しており、プログラムや文書などを創作した時点で自動的に発生します。特許権・商標権・意匠権は出願と登録が必要です。",
    keywords: ["著作権", "無方式主義", "産業財産権"],
  },
  {
    examId: "ip",
    id: "ip-q2",
    domainId: "ip-strategy",
    domainLabel: "IP-1: 企業と法務・経営戦略",
    difficulty: "標準",
    selectCount: 1,
    question: "企業の戦略目標（KGI）の達成度合いを測るために、日々の業務プロセスの中間指標として設定・モニタリングするものはどれか。",
    options: ["KPI", "ROI", "SLA", "BCP"],
    correctIndices: [0],
    explanation: "KPI（Key Performance Indicator：重要業績評価指標）は、最終目標である KGI の達成に向けてプロセスが適切に進んでいるかを測る中間指標です。",
    keywords: ["KPI", "KGI"],
  },
  {
    examId: "ip",
    id: "ip-q3",
    domainId: "ip-strategy",
    domainLabel: "IP-1: 企業と法務・経営戦略",
    difficulty: "標準",
    selectCount: 1,
    question: "システム調達において、発注側がITベンダーに対してシステム化の目的や要件、調達条件を示し、具体的な提案書や見積書の提出を求める文書はどれか。",
    options: ["RFI（情報提供依頼書）", "RFP（提案依頼書）", "SLA（サービスレベル合意書）", "NDA（秘密保持契約）"],
    correctIndices: [1],
    explanation: "RFP（Request for Proposal）は具体的な提案を依頼する文書です。事前の技術・事例収集段階では RFI を発行します。",
    keywords: ["RFP", "RFI", "調達"],
  },
  {
    examId: "ip",
    id: "ip-q4",
    domainId: "ip-management",
    domainLabel: "IP-2: 開発・マネジメント",
    difficulty: "基礎",
    selectCount: 1,
    question: "プロジェクト管理において、プロジェクト全体の成果物や必要な作業を階層的に細分化して整理した構成図はどれか。",
    options: ["WBS", "PERT図", "パレート図", "特性要因図"],
    correctIndices: [0],
    explanation: "WBS（Work Breakdown Structure）は、作業を漏れなく階層的に分解・定義する手法です。",
    keywords: ["WBS", "プロジェクト管理"],
  },
  {
    examId: "ip",
    id: "ip-q5",
    domainId: "ip-management",
    domainLabel: "IP-2: 開発・マネジメント",
    difficulty: "標準",
    selectCount: 1,
    question: "ITサービスマネジメントにおいて、システム障害の連絡を受けた際、根本原因の究明よりもまず「迅速なサービスの一次復旧」を最優先に行うプロセスはどれか。",
    options: ["問題管理", "変更管理", "インシデント管理", "構成管理"],
    correctIndices: [2],
    explanation: "インシデント管理は業務への影響を最小限に抑えるための迅速な一次復旧を担います。根本原因の究明と再発防止は問題管理の役割です。",
    keywords: ["インシデント管理", "問題管理", "ITIL"],
  },
  {
    examId: "ip",
    id: "ip-q6",
    domainId: "ip-technology",
    domainLabel: "IP-3: テクノロジ・セキュリティ",
    difficulty: "基礎",
    selectCount: 1,
    question: "情報セキュリティの3要素（CIA）のうち、「許可された利用者だけが必要なときに情報やシステムにアクセスできること」を表すものはどれか。",
    options: ["機密性（Confidentiality）", "完全性（Integrity）", "可用性（Availability）", "真正性（Authenticity）"],
    correctIndices: [2],
    explanation: "システムやデータを必要なときにいつでも利用できる状態を「可用性」と呼びます。機密性は許可者以外への漏えい防止、完全性は改ざん防止です。",
    keywords: ["可用性", "CIA", "情報セキュリティ"],
  },
  {
    examId: "ip",
    id: "ip-q7",
    domainId: "ip-technology",
    domainLabel: "IP-3: テクノロジ・セキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question: "多要素認証（MFA）の例として、最も適切なものはどれか。",
    options: [
      "ログインパスワードと、秘密の質問への回答の両方を入力する",
      "社員証のICカードをかざし、さらに登録済みの指紋認証を行う",
      "8文字以上の英数字と記号を含む複雑なパスワードを設定する",
      "ログイン時に画像に表示された歪んだ文字を読み取って入力する",
    ],
    correctIndices: [1],
    explanation: "ICカード（所有情報）と指紋（生体情報）は異なる2つの認証要素です。パスワードと秘密の質問はいずれも「知識情報」のため多要素認証になりません。",
    keywords: ["多要素認証", "認証要素"],
  },
  {
    examId: "ip",
    id: "ip-q8",
    domainId: "ip-technology",
    domainLabel: "IP-3: テクノロジ・セキュリティ",
    difficulty: "基礎",
    selectCount: 1,
    question: "ネットワークに接続された端末に対して、IPアドレスやサブネットマスク、デフォルトゲートウェイなどの設定情報を自動的に割り当てるプロトコルはどれか。",
    options: ["DNS", "DHCP", "SMTP", "NTP"],
    correctIndices: [1],
    explanation: "DHCP（Dynamic Host Configuration Protocol）は IP アドレス等を自動割り当てします。DNS は名前解決、NTP は時刻同期です。",
    keywords: ["DHCP", "IPアドレス"],
  },
  {
    examId: "ip",
    id: "ip-q9",
    domainId: "ip-technology",
    domainLabel: "IP-3: テクノロジ・セキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question: "ITパスポート試験の合格基準として正しい記述はどれか。",
    options: [
      "総合評価点が600点以上であれば、各分野の得点にかかわらず合格となる",
      "総合評価点が600点以上で、かつ3分野すべてがそれぞれ300点以上である必要がある",
      "3分野のうち2分野が600点以上であれば合格となる",
      "総合評価点が700点以上であれば合格となる",
    ],
    correctIndices: [1],
    explanation: "ITパスポート試験では総合評価点600点以上（1,000点満点）に加え、ストラテジ・マネジメント・テクノロジの3分野すべてで300点以上が必要です。",
    keywords: ["ITパスポート", "合格基準"],
  },
  {
    examId: "ip",
    id: "ip-q10",
    domainId: "ip-strategy",
    domainLabel: "IP-1: 企業と法務・経営戦略",
    difficulty: "標準",
    selectCount: 1,
    question: "固定費が 400 万円、変動費率が 60% のとき、損益分岐点売上高は何万円か。",
    options: ["667 万円", "800 万円", "1,000 万円", "1,200 万円"],
    correctIndices: [2],
    explanation: "限界利益率 = 1 - 0.6 = 0.4。損益分岐点売上高 = 固定費 ÷ 限界利益率 = 400 ÷ 0.4 = 1,000 万円です。",
    keywords: ["損益分岐点", "限界利益率"],
  },

  // --- FE (基本情報技術者) ---
  {
    examId: "fe",
    id: "fe-q1",
    domainId: "fe-cs",
    domainLabel: "FE-1: 基礎理論・アルゴリズム",
    difficulty: "基礎",
    selectCount: 1,
    question: "8ビットの2の補数表現において、10進数の「-10」を2進数で表したものはどれか。",
    options: ["10001010", "11110101", "11110110", "11111010"],
    correctIndices: [2],
    explanation: "+10 は 00001010。全ビット反転すると 11110101、これに 1 を足すと 11110110 になります。",
    keywords: ["2の補数", "負数表現"],
  },
  {
    examId: "fe",
    id: "fe-q2",
    domainId: "fe-cs",
    domainLabel: "FE-1: 基礎理論・アルゴリズム",
    difficulty: "標準",
    selectCount: 1,
    question: "要素数 n のソート済み配列から目的の値を探す際、二分探索法（バイナリサーチ）を用いた場合の平均・最悪計算量（オーダー）はどれか。",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctIndices: [1],
    explanation: "二分探索は1回の比較で探索範囲が半分になるため、計算量は O(log n) です。線形探索は O(n) です。",
    keywords: ["二分探索", "計算量"],
  },
  {
    examId: "fe",
    id: "fe-q3",
    domainId: "fe-cs",
    domainLabel: "FE-1: 基礎理論・アルゴリズム",
    difficulty: "標準",
    selectCount: 1,
    question: "データ構造のうち、先に入れたデータを最初に取り出す（FIFO：First-In First-Out）方式であり、幅優先探索（BFS）や印刷待ち行列などに使われるものはどれか。",
    options: ["スタック", "キュー", "ヒープ", "ハッシュ表"],
    correctIndices: [1],
    explanation: "キューは FIFO（先入れ先出し）です。スタックは LIFO（後入れ先出し）です。",
    keywords: ["キュー", "FIFO", "データ構造"],
  },
  {
    examId: "fe",
    id: "fe-q4",
    domainId: "fe-sys",
    domainLabel: "FE-2: システム・NW・DB",
    difficulty: "標準",
    selectCount: 1,
    question: "稼働率 0.9 の装置を 2 台「並列」に接続したシステムの全体稼働率はいくらか。",
    options: ["0.81", "0.90", "0.98", "0.99"],
    correctIndices: [3],
    explanation: "並列システムの稼働率は 1 - (1 - 0.9) × (1 - 0.9) = 1 - 0.01 = 0.99 です。",
    keywords: ["並列稼働率", "信頼性設計"],
  },
  {
    examId: "fe",
    id: "fe-q5",
    domainId: "fe-sys",
    domainLabel: "FE-2: システム・NW・DB",
    difficulty: "標準",
    selectCount: 1,
    question: "キャッシュメモリのアクセス時間が 10 ns、主記憶のアクセス時間が 100 ns、キャッシュのヒット率が 90% のとき、実効アクセス時間は何 ns か。",
    options: ["19 ns", "20 ns", "55 ns", "91 ns"],
    correctIndices: [0],
    explanation: "実効アクセス時間 = 0.9 × 10 + (1 - 0.9) × 100 = 9 + 10 = 19 ns です。",
    keywords: ["キャッシュメモリ", "実効アクセス時間"],
  },
  {
    examId: "fe",
    id: "fe-q6",
    domainId: "fe-sys",
    domainLabel: "FE-2: システム・NW・DB",
    difficulty: "標準",
    selectCount: 1,
    question: "SQL の SELECT 文において、GROUP BY 句でグループ化した後の集計結果に対して絞り込み条件を指定する句はどれか。",
    options: ["WHERE", "HAVING", "ORDER BY", "DISTINCT"],
    correctIndices: [1],
    explanation: "WHERE はグループ化前の行に対する条件、HAVING は GROUP BY 後の集計結果に対する条件指定に使います。",
    keywords: ["SQL", "HAVING", "GROUP BY"],
  },
  {
    examId: "fe",
    id: "fe-q7",
    domainId: "fe-sys",
    domainLabel: "FE-2: システム・NW・DB",
    difficulty: "応用",
    selectCount: 1,
    question: "IPv4 サブネット「192.168.10.0/26」において、ホストに割り当て可能な IP アドレスの最大数はいくつか。",
    options: ["30", "62", "64", "126"],
    correctIndices: [1],
    explanation: "プレフィックス長 /26 よりホスト部は 32 - 26 = 6 ビット。総数 2^6 = 64 からネットワークアドレスとブロードキャストアドレスの 2 つを引いた 62 個が割り当て可能です。",
    keywords: ["サブネット", "CIDR"],
  },
  {
    examId: "fe",
    id: "fe-q8",
    domainId: "fe-sec-mgmt",
    domainLabel: "FE-3: セキュリティ・テスト・管理",
    difficulty: "標準",
    selectCount: 1,
    question: "Webアプリケーションにおける SQL インジェクション攻撃の根本的な対策として、最も適切なものはどれか。",
    options: [
      "入力文字数に上限を設ける",
      "プレースホルダ（バインド機構）を用いて SQL 文を組み立てる",
      "HTML の特殊文字をエスケープする",
      "HTTPS による通信暗号化を行う",
    ],
    correctIndices: [1],
    explanation: "プレースホルダを使うことで、入力値が SQL の構文として解釈されるのを防ぎ、SQL インジェクションを根本的に防止できます。",
    keywords: ["SQLインジェクション", "プレースホルダ"],
  },
  {
    examId: "fe",
    id: "fe-q9",
    domainId: "fe-sec-mgmt",
    domainLabel: "FE-3: セキュリティ・テスト・管理",
    difficulty: "標準",
    selectCount: 1,
    question: "ホワイトボックステストの網羅基準のうち、「プログラム内のすべての分岐（真と偽）を少なくとも1回は実行する」基準はどれか。",
    options: ["命令網羅（C0）", "分岐網羅（C1）", "複数条件網羅", "限界値分析"],
    correctIndices: [1],
    explanation: "分岐網羅（判定条件網羅：C1）は、すべての分岐の真・偽を最低1回通るようにテストケースを設計します。",
    keywords: ["分岐網羅", "C1", "ホワイトボックステスト"],
  },
  {
    examId: "fe",
    id: "fe-q10",
    domainId: "fe-sec-mgmt",
    domainLabel: "FE-3: セキュリティ・テスト・管理",
    difficulty: "標準",
    selectCount: 1,
    question: "EVM（Earned Value Management）において、PV（計画価値）= 100、EV（出来高）= 80、AC（実コスト）= 90 のとき、スケジュール差異（SV）とコスト差異（CV）の組合せとして正しいものはどれか。",
    options: ["SV = -20, CV = -10", "SV = +20, CV = +10", "SV = -10, CV = -20", "SV = +10, CV = -10"],
    correctIndices: [0],
    explanation: "SV = EV - PV = 80 - 100 = -20（計画より遅れ）、CV = EV - AC = 80 - 90 = -10（予算超過）です。",
    keywords: ["EVM", "SV", "CV"],
  },

  // --- AP (応用情報技術者) ---
  {
    examId: "ap",
    id: "ap-q1",
    domainId: "ap-arch",
    domainLabel: "AP-1: アーキテクチャ・DB応用",
    difficulty: "標準",
    selectCount: 1,
    question: "システム設計における「フェールソフト（Fail Soft）」の説明として、最も適切なものはどれか。",
    options: [
      "故障が発生した際、ただちに安全な側へシステムを停止させる",
      "故障が発生した際、一部の機能を縮小（縮退運転）してでもシステム全体の稼働を継続させる",
      "利用者が誤った操作をしてもシステムが破損しないように構造的に防ぐ",
      "故障が起きないよう、部品の品質を極限まで高める",
    ],
    correctIndices: [1],
    explanation: "フェールソフトは縮退運転によりサービスを継続する設計です。安全側停止がフェールセーフ、誤操作防止がフールプルーフです。",
    keywords: ["フェールソフト", "フェールセーフ", "信頼性設計"],
  },
  {
    examId: "ap",
    id: "ap-q2",
    domainId: "ap-arch",
    domainLabel: "AP-1: アーキテクチャ・DB応用",
    difficulty: "応用",
    selectCount: 1,
    question: "M/M/1 の待ち行列モデルにおいて、窓口の平均サービス時間 Ts が 0.4 秒、利用率が 0.6（60%）のとき、平均待ち時間 Wq は何秒か。",
    options: ["0.24 秒", "0.40 秒", "0.60 秒", "1.00 秒"],
    correctIndices: [2],
    explanation: "M/M/1 の平均待ち時間 Wq = ρ / (1 - ρ) × Ts = 0.6 / (1 - 0.6) × 0.4 = 1.5 × 0.4 = 0.60 秒です。",
    keywords: ["M/M/1", "待ち行列理論"],
  },
  {
    examId: "ap",
    id: "ap-q3",
    domainId: "ap-arch",
    domainLabel: "AP-1: アーキテクチャ・DB応用",
    difficulty: "標準",
    selectCount: 1,
    question: "データベースの障害回復において、チェックポイント取得後に障害が発生した場合、コミット済みのトランザクションを復元するために「更新後ログ」を用いて行う処理はどれか。",
    options: ["ロールバック", "ロールフォワード", "2相ロック", "デッドロック検知"],
    correctIndices: [1],
    explanation: "コミット済みデータの再反映には更新後ログを用いたロールフォワードを行います。未コミットデータの取消しは更新前ログを用いたロールバックです。",
    keywords: ["ロールフォワード", "障害回復", "ログ"],
  },
  {
    examId: "ap",
    id: "ap-q4",
    domainId: "ap-nw-sec",
    domainLabel: "AP-2: ネットワーク・高度セキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question: "異なる AS（自律システム）間を接続し、パスベクトル型で経路情報を交換するルーティングプロトコルはどれか。",
    options: ["OSPF", "RIP", "BGP", "STP"],
    correctIndices: [2],
    explanation: "BGP（Border Gateway Protocol）は AS 間の経路制御（EGP）に使われるパスベクトル型プロトコルです。OSPF や RIP は AS 内（IGP）で使われます。",
    keywords: ["BGP", "OSPF", "ルーティング"],
  },
  {
    examId: "ap",
    id: "ap-q5",
    domainId: "ap-nw-sec",
    domainLabel: "AP-2: ネットワーク・高度セキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question: "認証・認可プロトコルのうち、OAuth 2.0 の仕組みをベースに ID トークンを発行し、ユーザーの「本人認証」を標準化したものはどれか。",
    options: ["SAML", "OpenID Connect（OIDC）", "RADIUS", "Kerberos"],
    correctIndices: [1],
    explanation: "OpenID Connect（OIDC）は OAuth 2.0（認可）を拡張し、ID トークン（JWT）によって認証を実現する標準規格です。",
    keywords: ["OpenID Connect", "OAuth 2.0", "認証"],
  },
  {
    examId: "ap",
    id: "ap-q6",
    domainId: "ap-nw-sec",
    domainLabel: "AP-2: ネットワーク・高度セキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question: "リスクアセスメント後のリスク対応において、サイバー保険への加入やセキュリティ監視の外部委託のように、他者へリスクを分散・転嫁する対応はどれか。",
    options: ["リスク低減", "リスク回避", "リスク共有（移転）", "リスク保有"],
    correctIndices: [2],
    explanation: "保険加入やアウトソーシングなど、第三者とリスクを分け合う対応は「リスク共有（旧：リスク移転）」に分類されます。",
    keywords: ["リスク共有", "リスクマネジメント"],
  },
  {
    examId: "ap",
    id: "ap-q7",
    domainId: "ap-nw-sec",
    domainLabel: "AP-2: ネットワーク・高度セキュリティ",
    difficulty: "標準",
    selectCount: 1,
    question: "送信ドメイン認証技術のうち、送信メールに電子署名を付与し、受信側が DNS 上の公開鍵で検証することで改ざんやなりすましを検知するものはどれか。",
    options: ["SPF", "DKIM", "SMTP-AUTH", "STARTTLS"],
    correctIndices: [1],
    explanation: "DKIM は電子署名による検証、SPF は送信元 IP アドレスの照合による検証を行います。",
    keywords: ["DKIM", "SPF", "メールセキュリティ"],
  },
  {
    examId: "ap",
    id: "ap-q8",
    domainId: "ap-mgmt-strat",
    domainLabel: "AP-3: 経営戦略・サービス管理",
    difficulty: "標準",
    selectCount: 1,
    question: "BCP（事業継続計画）において、システム停止時に「いつ時点のデータまで復旧できれば許容できるか（許容データ損失時点）」を表す指標はどれか。",
    options: ["RTO（目標復旧時間）", "RPO（目標復旧時点）", "MTBF（平均故障間隔）", "MTTR（平均修復時間）"],
    correctIndices: [1],
    explanation: "RPO（Recovery Point Objective）はデータ復旧の目標時点、RTO（Recovery Time Objective）は復旧までの目標時間を表します。",
    keywords: ["RPO", "RTO", "BCP"],
  },
  {
    examId: "ap",
    id: "ap-q9",
    domainId: "ap-mgmt-strat",
    domainLabel: "AP-3: 経営戦略・サービス管理",
    difficulty: "応用",
    selectCount: 1,
    question: "投資評価手法である NPV（正味現在価値）法において、あるシステム投資案件の採用判断基準として適切なものはどれか。",
    options: [
      "NPV が 0 より大きい案件を採用する",
      "NPV が 0 未満の案件を採用する",
      "割引率よりも初期投資額が小さい案件を採用する",
      "回収期間が最も長い案件を採用する",
    ],
    correctIndices: [0],
    explanation: "NPV ＞ 0 であれば、資本コスト（割引率）を上回る現在価値を生み出す投資であるため採用価値があると判断します。",
    keywords: ["NPV", "投資評価"],
  },
  {
    examId: "ap",
    id: "ap-q10",
    domainId: "ap-mgmt-strat",
    domainLabel: "AP-3: 経営戦略・サービス管理",
    difficulty: "標準",
    selectCount: 1,
    question: "応用情報技術者試験の採点方式（多段階選抜方式）に関する正しい説明はどれか。",
    options: [
      "午前試験と午後試験の合計点が 120 点以上であれば合格となる",
      "午前試験が基準点（60点）に達しない場合、午後試験の採点は行われない",
      "午後試験のみ受験し、午前試験は後日受験できる",
      "午後試験はすべて多肢選択式で出題される",
    ],
    correctIndices: [1],
    explanation: "応用情報技術者試験は多段階選抜方式であり、午前試験で基準点（60点）に達しないと午後試験は採点されません。また午後試験は記述式です。",
    keywords: ["応用情報技術者", "多段階選抜", "試験制度"],
  },

  // --- SC (情報処理安全確保支援士) ---
  {
    examId: "sc",
    id: "sc-q1",
    domainId: "sc-sec",
    domainLabel: "SC-1: セキュア設計・実装",
    difficulty: "標準",
    selectCount: 1,
    question: "Web アプリケーションの脆弱性である SSRF（Server-Side Request Forgery）の対策として、最も適切なものはどれか。",
    options: [
      "レスポンスヘッダに X-Frame-Options: DENY を付与する",
      "サーバから外部へリクエストを送る際、接続先ホストの許可リスト検証とプライベート IP 帯へのアクセス制限を行う",
      "すべてのフォームに CSRF トークンを埋め込む",
      "Cookie に HttpOnly 属性を付与する",
    ],
    correctIndices: [1],
    explanation: "SSRF はサーバに任意の URL へリクエストを送らせる攻撃のため、許可リストによる接続先検証とローカル/メタデータ IP（169.254.169.254 等）へのアクセス遮断が有効です。",
    keywords: ["SSRF", "ホワイトリスト"],
  },
  {
    examId: "sc",
    id: "sc-q2",
    domainId: "sc-sec",
    domainLabel: "SC-1: セキュア設計・実装",
    difficulty: "応用",
    selectCount: 1,
    question: "OAuth 2.0 の認可コードフローを SPA やモバイルアプリ（パブリッククライアント）で安全に利用するために導入される拡張仕様はどれか。",
    options: ["PKCE", "SAML", "HSTS", "CSP"],
    correctIndices: [0],
    explanation: "PKCE（Proof Key for Code Exchange）は code_verifier / code_challenge により、認可コードが横取りされた場合でもトークン交換を阻止します。",
    keywords: ["OAuth 2.0", "PKCE"],
  },
  {
    examId: "sc",
    id: "sc-q3",
    domainId: "sc-sec",
    domainLabel: "SC-1: セキュア設計・実装",
    difficulty: "標準",
    selectCount: 1,
    question: "クリックジャッキング攻撃を防ぐための HTTP レスポンスヘッダの設定として適切なものはどれか。",
    options: [
      "Access-Control-Allow-Origin: *",
      "Content-Security-Policy: frame-ancestors 'none'",
      "Strict-Transport-Security: max-age=31536000",
      "X-Content-Type-Options: nosniff",
    ],
    correctIndices: [1],
    explanation: "CSP の `frame-ancestors 'none'`（または `X-Frame-Options: DENY`）により、他オリジンの iframe 内へのページ埋め込みを禁止できます。",
    keywords: ["クリックジャッキング", "CSP"],
  },
  {
    examId: "sc",
    id: "sc-q4",
    domainId: "sc-sec",
    domainLabel: "SC-1: セキュア設計・実装",
    difficulty: "標準",
    selectCount: 1,
    question: "IPsec VPN において、VPN ルータの手前に NAT 機器が存在する場合に ESP パケットを通過させるために用いられる仕組みはどれか。",
    options: ["NAT-T（UDP 4500 カプセル化）", "GRE トンネリング", "PPTP", "SSL-VPN"],
    correctIndices: [0],
    explanation: "ESP はポート番号を持たないため通常の NAPT を通過できません。NAT-T（NAT Traversal）は ESP を UDP ポート 4500 でカプセル化して通過させます。",
    keywords: ["IPsec", "NAT-T"],
  },
  {
    examId: "sc",
    id: "sc-q5",
    domainId: "sc-ops",
    domainLabel: "SC-2: CSIRT・フォレンジック",
    difficulty: "標準",
    selectCount: 1,
    question: "マルウェア感染が疑われる稼働中のサーバからデジタルフォレンジックの証拠を保全する際、RFC 3227 に基づく揮発性データの収集順序として最も優先度が高いものはどれか。",
    options: [
      "ハードディスクの全セクタダンプ",
      "メインメモリ（RAM）およびレジスタ/キャッシュの内容",
      "外部バックアップ媒体のアーカイブ",
      "電源ケーブルを抜いてのハードウェア保全",
    ],
    correctIndices: [1],
    explanation: "揮発性が高いデータ（レジスタ・キャッシュ・メモリ・実行中プロセス・ネットワーク接続）から順に保全し、ディスクイメージは後に行います。",
    keywords: ["フォレンジック", "RFC 3227"],
  },
  {
    examId: "sc",
    id: "sc-q6",
    domainId: "sc-ops",
    domainLabel: "SC-2: CSIRT・フォレンジック",
    difficulty: "標準",
    selectCount: 1,
    question: "情報処理安全確保支援士（登録セキスペ）の試験制度および資格に関する正しい記述はどれか。",
    options: [
      "試験に合格した時点で自動的に情報処理安全確保支援士を名乗ることができる",
      "科目A-1・科目A-2・科目Bのすべてで 60 点以上（100点満点）を取得する必要がある",
      "科目B（午後）は多肢選択式で出題される",
      "応用情報技術者試験の合格者であっても科目A-1 の免除は受けられない",
    ],
    correctIndices: [1],
    explanation: "科目A-1・A-2・B すべてで 60 点以上が必要です。なお資格を名乗るには合格後の登録申請が必要であり、AP 合格者等は科目A-1 が2年間免除されます。",
    keywords: ["情報処理安全確保支援士", "合格基準"],
  },

  // --- DB (データベーススペシャリスト) ---
  {
    examId: "db",
    id: "db-q1",
    domainId: "db-design",
    domainLabel: "DB-1: モデリング・SQL",
    difficulty: "標準",
    selectCount: 1,
    question: "概念データモデリングにおいて、2つのエンティティ間に「多対多（M:N）」の関連が存在する場合の論理設計上の正しい対処法はどれか。",
    options: [
      "一方のテーブルにカンマ区切りで複数の外部キーを格納する",
      "双方の主キーを外部キーとして持つ「関連エンティティ」を新設し、2つの 1対多 に分解する",
      "双方のテーブルに同じ列を重複して持たせる",
      "主キーを削除して全列を NULL 許容にする",
    ],
    correctIndices: [1],
    explanation: "関係データベースでは多対多を直接表現できないため、関連エンティティ（連関エンティティ）を間に挟んで 1対多 と 多対1 に分解します。",
    keywords: ["E-R図", "関連エンティティ"],
  },
  {
    examId: "db",
    id: "db-q2",
    domainId: "db-design",
    domainLabel: "DB-1: モデリング・SQL",
    difficulty: "応用",
    selectCount: 1,
    question: "B+木インデックスが列 (A, B) の順で複合インデックスとして定義されている場合、インデックスが効果的に利用されにくい検索条件はどれか。",
    options: [
      "WHERE A = 10 AND B = 20",
      "WHERE A = 10",
      "WHERE B = 20",
      "WHERE A = 10 AND B > 5",
    ],
    correctIndices: [2],
    explanation: "複合インデックス (A, B) は先頭列 A でソートされた後に B でソートされるため、先頭列 A を指定しない `WHERE B = 20` では通常のインデックスレンジスキャンが効きにくくなります。",
    keywords: ["複合インデックス", "最左プレフィックス"],
  },
  {
    examId: "db",
    id: "db-q3",
    domainId: "db-design",
    domainLabel: "DB-1: モデリング・SQL",
    difficulty: "応用",
    selectCount: 1,
    question: "SQL の `NOT IN (SELECT dept_id FROM closed_depts)` を実行した際、サブクエリの結果に NULL が 1 件でも含まれているとどうなるか。",
    options: [
      "NULL は自動的に無視され、残りの値に一致しない行が返る",
      "全行の評価結果が UNKNOWN（または FALSE）となり、1行も返らなくなる",
      "構文エラーが発生して実行が中断される",
      "NULL の行だけが返される",
    ],
    correctIndices: [1],
    explanation: "SQL の3値論理により `x != NULL` が UNKNOWN となるため、NOT IN の条件全体が TRUE にならず結果が 0 件になります。`NOT EXISTS` の利用が推奨されます。",
    keywords: ["3値論理", "NULL", "NOT IN"],
  },
  {
    examId: "db",
    id: "db-q4",
    domainId: "db-ops",
    domainLabel: "DB-2: 同時実行・障害回復",
    difficulty: "標準",
    selectCount: 1,
    question: "トランザクション分離レベルのうち、「同じ検索条件で2回 SELECT を実行した際、他トランザクションの INSERT によって2回目に新しい行が現れる（ファントムリード）」まで完全に防止できるレベルはどれか。",
    options: ["Read Uncommitted", "Read Committed", "Repeatable Read（標準SQL定義）", "Serializable"],
    correctIndices: [3],
    explanation: "標準 SQL の定義では、ファントムリードまで完全に防止できるのは最高レベルの Serializable です。",
    keywords: ["分離レベル", "ファントムリード"],
  },
  {
    examId: "db",
    id: "db-q5",
    domainId: "db-ops",
    domainLabel: "DB-2: 同時実行・障害回復",
    difficulty: "標準",
    selectCount: 1,
    question: "データベースの WAL（Write-Ahead Logging）プロトコルにおいて、データの永続性（Durability）を保証するために守られるべき規則はどれか。",
    options: [
      "データページをディスクへ書き出した後にログをメモリに記録する",
      "コミット完了時やデータページをディスクへ書き出す前に、対応する更新ログを必ずディスクへ永続化する",
      "チェックポイントごとに全テーブルをロックして読み取り専用にする",
      "すべてのログをメモリ上のみに保持しディスクへは書かない",
    ],
    correctIndices: [1],
    explanation: "WAL では更新内容を反映したデータページをディスクへ書く前に、必ずログを先行してディスクに書き込むことで障害復旧を保証します。",
    keywords: ["WAL", "障害回復"],
  },
  {
    examId: "db",
    id: "db-q6",
    domainId: "db-ops",
    domainLabel: "DB-2: 同時実行・障害回復",
    difficulty: "応用",
    selectCount: 1,
    question: "分散データベースの2相コミット（2PC）プロトコルにおける課題として適切なものはどれか。",
    options: [
      "データの更新順序が保証されない",
      "コーディネータが Prepare 送信後・Commit 決定前に障害を起こすと、参加ノードがロックを保持したままブロッキング状態になる",
      "単一ノードの障害でも自動的にロールフォワードが完了する",
      "ネットワーク通信が1往復で完了するためレイテンシが高い",
    ],
    correctIndices: [1],
    explanation: "2相コミットはブロッキングプロトコルであり、コーディネータ障害時に参加ノードがコミット/アボートを確定できずロックを解放できなくなる課題があります。",
    keywords: ["2相コミット", "分散データベース"],
  },

  // --- NW (ネットワークスペシャリスト) ---
  {
    examId: "nw",
    id: "nw-q1",
    domainId: "nw-arch",
    domainLabel: "NW-1: L2/L3設計・ルーティング",
    difficulty: "標準",
    selectCount: 1,
    question: "VRRP 構成において、バックアップルータがマスターに昇格した直後、配下の L2 スイッチの MAC アドレステーブルを即座に更新させるために送信するパケットはどれか。",
    options: ["Gratuitous ARP（GARP）", "ICMP Redirect", "BPDU TCN", "OSPF Hello"],
    correctIndices: [0],
    explanation: "新マスターが仮想 MAC アドレスを送信元にした Gratuitous ARP をブロードキャストすることで、L2 スイッチのポート学習を即座に更新させます。",
    keywords: ["VRRP", "Gratuitous ARP"],
  },
  {
    examId: "nw",
    id: "nw-q2",
    domainId: "nw-arch",
    domainLabel: "NW-1: L2/L3設計・ルーティング",
    difficulty: "応用",
    selectCount: 1,
    question: "BGP において、自 AS 内のルータ群に対して「外部 AS へ出ていく際の優先出口ルータ」を指定するために用いるパス属性はどれか。",
    options: ["MED（Multi-Exit Discriminator）", "LOCAL_PREF", "AS_PATH", "NEXT_HOP"],
    correctIndices: [1],
    explanation: "LOCAL_PREF は自 AS 内で共有され、値が大きい経路が出口として優先されます。MED は隣接 AS に対して自 AS への入口を誘導する際に用います。",
    keywords: ["BGP", "LOCAL_PREF", "MED"],
  },
  {
    examId: "nw",
    id: "nw-q3",
    domainId: "nw-arch",
    domainLabel: "NW-1: L2/L3設計・ルーティング",
    difficulty: "応用",
    selectCount: 1,
    question: "往復遅延時間（RTT）が 80 ms の回線において、TCP 受信ウィンドウサイズが 64 KB（65,536 バイト）に固定されている場合の理論上の最大スループットに最も近い値はどれか。",
    options: ["約 655 kbps", "約 6.55 Mbps", "約 52.4 Mbps", "約 655 Mbps"],
    correctIndices: [1],
    explanation: "65,536 バイト × 8 bit = 524,288 bit。これを RTT 0.08 秒で割ると 524,288 ÷ 0.08 = 6,553,600 bps ≒ 6.55 Mbps となります。",
    keywords: ["TCP", "帯域遅延積", "スループット"],
  },
  {
    examId: "nw",
    id: "nw-q4",
    domainId: "nw-app",
    domainLabel: "NW-2: 上位プロトコル・負荷分散",
    difficulty: "標準",
    selectCount: 1,
    question: "ロードバランサの DSR（Direct Server Return）構成に関する正しい説明はどれか。",
    options: [
      "往路・復路ともに必ずロードバランサを経由する",
      "クライアントからのリクエストのみロードバランサを経由し、サーバからのレスポンスはロードバランサを通らず直接クライアントへ返される",
      "ロードバランサが HTTP ヘッダを書き換えて別サーバへ転送する",
      "サーバ側に仮想 IP（VIP）を設定する必要がない",
    ],
    correctIndices: [1],
    explanation: "DSR では LB が宛先 MAC のみを実サーバへ書き換えて転送し、サーバ側はループバック等に VIP を持って直接クライアントへ応答を返します。",
    keywords: ["DSR", "ロードバランサ"],
  },
  {
    examId: "nw",
    id: "nw-q5",
    domainId: "nw-app",
    domainLabel: "NW-2: 上位プロトコル・負荷分散",
    difficulty: "標準",
    selectCount: 1,
    question: "HTTP/3 で採用されているトランスポートプロトコル QUIC の特徴として正しいものはどれか。",
    options: [
      "TCP 上で動作し、3ウェイハンドシェイクを必須とする",
      "UDP 上で動作し、TLS 1.3 を統合して 1-RTT/0-RTT 接続とストリーム単位の多重化を実現する",
      "暗号化を行わないため高速に通信できる",
      "ポート番号は TCP 80 番のみを使用する",
    ],
    correctIndices: [1],
    explanation: "QUIC は UDP（主に 443）上で動作し、TLS 1.3 暗号化と複数ストリームの独立した再送制御により、TCP の Head-of-Line Blocking を解消します。",
    keywords: ["HTTP/3", "QUIC"],
  },
  {
    examId: "nw",
    id: "nw-q6",
    domainId: "nw-app",
    domainLabel: "NW-2: 上位プロトコル・負荷分散",
    difficulty: "標準",
    selectCount: 1,
    question: "OSPF のマルチエリア構成において、エリア間の経路情報を交換するためにすべての通常エリアが原則として接続しなければならない特別なエリアはどれか。",
    options: ["エリア 0（バックボーンエリア）", "スタブエリア", "NSSA", "エリア 255"],
    correctIndices: [0],
    explanation: "OSPF ではループ防止のため、すべての非バックボーンエリアはエリア 0（バックボーンエリア）と接続する階層構造をとります。",
    keywords: ["OSPF", "エリア0"],
  },
];

// 出典: 独立行政法人情報処理推進機構 (IPA) 公式ページ
export const ipaOfficialResources: IpaOfficialResource[] = [
  {
    title: "IPA 情報処理技術者試験・情報処理安全確保支援士試験 トップ",
    description: "試験区分一覧、申込スケジュール、CBT 試験案内、最新の制度変更に関する公式情報。",
    url: "https://www.ipa.go.jp/shiken/index.html",
    badge: "IPA 公式トップ",
  },
  {
    title: "試験要綱・シラバス（出題範囲）",
    description: "ITパスポート・基本情報・応用情報・高度試験の公式試験要綱、シラバス PDF が掲載されています。",
    url: "https://www.ipa.go.jp/shiken/syllabus.html",
    badge: "公式シラバス",
  },
  {
    title: "過去問題・解答例・採点講評",
    description: "公開されている過去の問題冊子、配点割合、解答例、採点講評をダウンロードできます。",
    url: "https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html",
    badge: "公式過去問",
  },
];
