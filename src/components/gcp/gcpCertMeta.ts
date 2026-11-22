import type { CertPassingConfig } from "@/components/certification/types";

export type GcpCertId =
  | "cdl"
  | "gail"
  | "ace"
  | "adp"
  | "pca"
  | "pde"
  | "pmle"
  | "pcse"
  | "pcde"
  | "pcd"
  | "pcne";

export type GcpLevelGroup = "Foundational" | "Associate" | "Professional";

export interface GcpCertMeta {
  id: GcpCertId;
  levelGroup: GcpLevelGroup;
  label: string;
  shortLabel: string;
  badgeText: string;
  headline: string;
  description: string;
  storageKey: string;
  defaultExpanded: Record<string, boolean>;
  secondsPerQuestion: number;
  passingConfig: CertPassingConfig;
  quizBadgeLabel: string;
  flashcardTitle: string;
  quickSearchChips: string[];
  examDayChecklist: {
    subtitle: string;
    tips: { title: string; body: string }[];
  };
}

export const GCP_CERT_IDS: GcpCertId[] = [
  "cdl",
  "gail",
  "ace",
  "adp",
  "pca",
  "pde",
  "pmle",
  "pcse",
  "pcde",
  "pcd",
  "pcne",
];

export const CERT_LEVEL_GROUPS: {
  level: GcpLevelGroup;
  badge: string;
  ids: GcpCertId[];
}[] = [
  { level: "Foundational", badge: "入門・ビジネス", ids: ["cdl", "gail"] },
  { level: "Associate", badge: "基礎実装・実務", ids: ["ace", "adp"] },
  {
    level: "Professional",
    badge: "専門設計・運用",
    ids: ["pca", "pde", "pmle", "pcse", "pcde", "pcd", "pcne"],
  },
];

export const GCP_CERT_META: Record<GcpCertId, GcpCertMeta> = {
  cdl: {
    id: "cdl",
    levelGroup: "Foundational",
    label: "Cloud Digital Leader (CDL)",
    shortLabel: "CDL",
    badgeText: "GOOGLE CLOUD DIGITAL LEADER STUDY HUB",
    headline: "Cloud Digital Leader（CDL）",
    description:
      "Google Cloud の基礎概念・DX・データ＆AI活用・セキュリティ・FinOps を網羅した入門〜ビジネス向け認定試験の学習ハブです。進捗やメモはブラウザに自動保存されます。",
    storageKey: "ai-park-gcp-cdl-progress-v1",
    defaultExpanded: { "cdl-domain-1": true },
    secondsPerQuestion: 90,
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Cloud Digital Leader 本試験（公式合格点非公開・本演習目安 70%）",
    },
    quizBadgeLabel: "GCP CDL 演習",
    flashcardTitle: "CDL 要件・ビジネス課題 → Google Cloud サービス即答トレーニング",
    quickSearchChips: [
      "BigQuery",
      "Cloud Storage",
      "Vertex AI",
      "Cloud Run",
      "Cloud Armor",
      "CUD",
    ],
    examDayChecklist: {
      subtitle:
        "Cloud Digital Leader は 90 分・約 50〜60 問・有効期限 3 年の入門〜ビジネス基礎資格です。技術詳細よりも「ビジネス課題に対する適切な Google Cloud ソリューション選定」を素早く判断するのが合格の鍵です。",
      tips: [
        {
          title: "⏱️ 時間配分: 1 問あたり約 1.5 分",
          body: "90 分で 50〜60 問のため、悩む問題はフラグ（見直しマーク）を付けて先に進み、最後に 15 分以上の見直し時間を残します。",
        },
        {
          title: "🏢 ビジネス価値と OpEx / TCO 視点",
          body: "CapEx から OpEx へのシフト、IaaS / PaaS / SaaS の責任共有モデル（データは常に顧客責任）の区別を問題文の制約から読み取ります。",
        },
        {
          title: "🤖 AI / データサービスの即断",
          body: "「ML知識なしで OCR」＝ Document AI、「ペタバイト分析」＝ BigQuery、「非構造化長期保管」＝ Cloud Storage Archive など役割の紐付けを優先します。",
        },
        {
          title: "💰 コスト最適化の定番ひっかけ回避",
          body: "常時稼働の削減は CUD、中断可能なバッチは Spot VM。予算アラートだけではリソースが自動停止しない点に注意してください。",
        },
      ],
    },
  },
  gail: {
    id: "gail",
    levelGroup: "Foundational",
    label: "Generative AI Leader (GAIL)",
    shortLabel: "GAIL",
    badgeText: "GOOGLE CLOUD GENERATIVE AI LEADER STUDY HUB",
    headline: "Generative AI Leader（GAIL）",
    description:
      "生成 AI の基礎・Gemini / Vertex AI・グラウンディング（RAG）・プロンプト＆モデル改善・責任ある AI と導入戦略を学ぶビジネス〜推進リーダー向け学習ハブです。",
    storageKey: "ai-park-gcp-gail-progress-v1",
    defaultExpanded: { "gail-domain-1": true },
    secondsPerQuestion: 90,
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Generative AI Leader 本試験（公式合格点非公開・本演習目安 70%）",
    },
    quizBadgeLabel: "GCP GAIL 演習",
    flashcardTitle: "GAIL 生成 AI 課題・ビジネス要件 → 最適ソリューション即答トレーニング",
    quickSearchChips: [
      "Gemini",
      "Vertex AI",
      "RAG",
      "NotebookLM",
      "Model Garden",
      "責任ある AI",
    ],
    examDayChecklist: {
      subtitle:
        "Generative AI Leader は 90 分・約 50〜60 問・有効期限 3 年の生成 AI 分野の認定資格です。モデルの使い分けと出力精度改善・ガバナンス戦略の判断が中心となります。",
      tips: [
        {
          title: "⏱️ 時間配分: 90 分のペース配分",
          body: "シナリオ文が短〜中程度の設問が中心です。1 問 90 秒以内を目安にテンポ良く進め、見直し時間を確保します。",
        },
        {
          title: "🧭 導入アプローチの段階選択",
          body: "既製ツール（Gemini for Google Workspace / Gemini Notebook (NotebookLM)）で済むか、Gemini Enterprise・Agent Platform（Vertex AI / Model Garden）で構築・連携するかを要件から見極めます。",
        },
        {
          title: "🎯 出力改善手法の切り分け",
          body: "最新・社内情報不足には RAG（グラウンディング）、出力形式やトーンの統制には Few-shot プロンプト、特化振る舞いの学習にはチューニングを選びます。",
        },
        {
          title: "🛡️ 責任ある AI とデータ保護",
          body: "Google Cloud のエンタープライズ利用では顧客データが公開基盤モデルの学習に自動利用されない点と、Human-in-the-loop・Safety Filters の重要性を押さえます。",
        },
      ],
    },
  },
  ace: {
    id: "ace",
    levelGroup: "Associate",
    label: "Associate Cloud Engineer (ACE)",
    shortLabel: "ACE",
    badgeText: "GOOGLE CLOUD ASSOCIATE CLOUD ENGINEER STUDY HUB",
    headline: "Associate Cloud Engineer（ACE）",
    description:
      "プロジェクト階層・IAM・gcloud CLI・Compute Engine / GKE / Cloud Run・VPC ネットワーキング・Cloud Monitoring/Logging の実装と運用を学ぶエンジニア向け学習ハブです。",
    storageKey: "ai-park-gcp-ace-progress-v1",
    defaultExpanded: { "ace-domain-1": true },
    secondsPerQuestion: 120,
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Associate Cloud Engineer 本試験（公式合格点非公開・本演習目安 70%）",
    },
    quizBadgeLabel: "GCP ACE 演習",
    flashcardTitle: "ACE 運用要件 → gcloud コマンド / 推奨サービス即答トレーニング",
    quickSearchChips: [
      "gcloud",
      "GKE",
      "Cloud Run",
      "IAM",
      "Cloud NAT",
      "Ops Agent",
      "VPC",
    ],
    examDayChecklist: {
      subtitle:
        "Associate Cloud Engineer は 120 分・約 50〜60 問・有効期限 3 年のエンジニア向け試験です。CLI コマンド構文、最小権限の IAM、そして「Google 推奨（最も運用負荷が低い）手順」を見抜く力が問われます。",
      tips: [
        {
          title: "⏱️ 時間配分: 1 問約 2 分の余裕を活かす",
          body: "120 分あるためコマンドのフラグやサービス名（例：`gcloud config configurations`, `gcloud container clusters get-credentials`）を落ち着いて読み比べられます。",
        },
        {
          title: "🔑 キーレス認証と最小権限",
          body: "サービスアカウントの JSON 鍵ファイル生成を勧める選択肢は原則不正解（アンチパターン）。Compute Engine は SA アタッチ、GKE は Workload Identity を選びます。",
        },
        {
          title: "🌐 プライベート通信と監視の定番",
          body: "外部 IP なし VM への SSH は IAP、外向きネット通信は Cloud NAT、Google API 通信は Private Google Access、メモリ監視は Ops Agent の導入が必須です。",
        },
        {
          title: "⚙️ API 有効化と予算アラートの罠",
          body: "新規プロジェクトでエラーが出たら `gcloud services enable` 未実行を疑います。予算アラートだけでは自動停止しない点も頻出です。",
        },
      ],
    },
  },
  adp: {
    id: "adp",
    levelGroup: "Associate",
    label: "Associate Data Practitioner (ADP)",
    shortLabel: "ADP",
    badgeText: "GOOGLE CLOUD ASSOCIATE DATA PRACTITIONER STUDY HUB",
    headline: "Associate Data Practitioner（ADP）",
    description:
      "データ取り込み・前処理（BigQuery / Dataform / Dataflow）・可視化（Looker）・パイプラインオーケストレーション（Cloud Composer）・ガバナンス（Dataplex / DLP）を学ぶ実務向け学習ハブです。",
    storageKey: "ai-park-gcp-adp-progress-v1",
    defaultExpanded: { "adp-domain-1": true },
    secondsPerQuestion: 120,
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Associate Data Practitioner 本試験（公式合格点非公開・本演習目安 70%）",
    },
    quizBadgeLabel: "GCP ADP 演習",
    flashcardTitle: "ADP データパイプライン・分析要件 → 最適サービス即答トレーニング",
    quickSearchChips: [
      "BigQuery",
      "Dataform",
      "Dataflow",
      "Cloud Composer",
      "Looker",
      "Dataplex",
      "Pub/Sub",
    ],
    examDayChecklist: {
      subtitle:
        "Associate Data Practitioner は 120 分・約 50〜60 問・有効期限 3 年のデータ実務試験です。バッチ／ストリーミングの取り込み、SQL ベースの変換（Dataform）、BI 可視化、ガバナンスツールの使い分けを整理しておきましょう。",
      tips: [
        {
          title: "⏱️ 時間配分: パイプライン要件を分解する",
          body: "「どこから取り込み（Pub/Sub・Transfer）・どこで変換し（Dataflow・Dataform・Dataproc）・どこに貯めるか（GCS・BigQuery）」を 3 ステップで切り分けます。",
        },
        {
          title: "🔄 変換ツールの使い分け（重要）",
          body: "BigQuery 内の SQL 変換＆アサーション＝Dataform、ノーコード GUI ETL＝Cloud Data Fusion / Dataprep、ストリーム/複雑コード ETL＝Dataflow、既存 Spark＝Dataproc。",
        },
        {
          title: "📊 オーケストレーション vs スケジュール",
          body: "単発の定時 BigQuery SQL は Scheduled Queries、複数サービスを跨ぐ複雑な DAG 依存制御は Cloud Composer（Apache Airflow）を選択します。",
        },
        {
          title: "🛡️ データガバナンスとコスト",
          body: "全社メタデータ・データ品質管理は Dataplex、PII 検出・マスキングは Sensitive Data Protection (DLP)、BigQuery はパーティショニング＆クラスタリングで最適化します。",
        },
      ],
    },
  },
  pca: {
    id: "pca",
    levelGroup: "Professional",
    label: "Professional Cloud Architect (PCA)",
    shortLabel: "PCA",
    badgeText: "GOOGLE CLOUD PROFESSIONAL CLOUD ARCHITECT STUDY HUB",
    headline: "Professional Cloud Architect（PCA）",
    description:
      "マルチリージョン設計・Shared VPC・Interconnect・VPC Service Controls・SRE（SLI/SLO）・大規模移行など、エンタープライズ設計力を問う上級資格向け学習ハブです。",
    storageKey: "ai-park-gcp-pca-progress-v1",
    defaultExpanded: { "pca-domain-1": true },
    secondsPerQuestion: 120,
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional Cloud Architect 本試験（公式合格点非公開・本演習目安 70%）",
    },
    quizBadgeLabel: "GCP PCA 演習",
    flashcardTitle: "PCA 設計要件・制約 → アーキテクチャ選択即答トレーニング",
    quickSearchChips: [
      "Cloud Spanner",
      "Shared VPC",
      "VPC Service Controls",
      "Interconnect",
      "BigQuery",
      "SRE",
      "Cloud EKM",
    ],
    examDayChecklist: {
      subtitle:
        "Professional Cloud Architect は 120 分・50〜60 問・有効期限 2 年の最上位設計資格です。長文シナリオや公式ケーススタディの「ビジネス制約・RTO/RPO・セキュリティ要件」と技術選択を正確に結びつけることが合格の鍵です。",
      tips: [
        {
          title: "⏱️ ケーススタディ問題の読み方",
          body: "最初に設問文を読んで問われている領域（移行・セキュリティ・DR 等）を把握してから、ケーススタディの該当要件・制約箇所をピンポイントで参照すると時間短縮になります。",
        },
        {
          title: "⚖️ 過剰設計（オーバースペック）を避ける",
          body: "RPO 24h / RTO 8h でコスト重視なら Cold Standby が正解。要件以上のコストがかかる Cloud Spanner Multi-Region 等を無条件に選ばないよう注意します。",
        },
        {
          title: "🧱 多層防御の責務分離",
          body: "誰ができるか＝Cloud IAM、禁止設定の強制＝Organization Policy、認証情報漏洩時のデータ持ち出し防止＝VPC Service Controls と役割を明確に分けます。",
        },
        {
          title: "🚚 大容量移行は必ず帯域計算",
          body: "データ量 ÷ 回線速度で移行期限に間に合わない場合は Transfer Appliance。また 99.99% SLA の Dedicated Interconnect は 2 メトロ×4 接続が必要です。",
        },
      ],
    },
  },
  pde: {
    id: "pde",
    levelGroup: "Professional",
    label: "Professional Data Engineer (PDE)",
    shortLabel: "PDE",
    badgeText: "GOOGLE CLOUD PROFESSIONAL DATA ENGINEER STUDY HUB",
    headline: "Professional Data Engineer（PDE）",
    description:
      "BigQuery・Dataflow・Pub/Sub・Dataproc・Cloud Composer・Dataplex・Bigtable・DLP を軸に、スケーラブルで安全なデータ基盤の設計と運用を学ぶデータエンジニア向け学習ハブです。",
    storageKey: "ai-park-gcp-pde-progress-v1",
    defaultExpanded: { "pde-domain-1": true },
    secondsPerQuestion: 120,
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional Data Engineer 本試験（公式合格点非公開・本演習目安 70%）",
    },
    quizBadgeLabel: "GCP PDE 演習",
    flashcardTitle: "PDE データ基盤要件 → 最適サービス・パイプライン設計即答トレーニング",
    quickSearchChips: [
      "BigQuery",
      "Dataflow",
      "Pub/Sub",
      "Dataproc",
      "Cloud Composer",
      "Bigtable",
      "Dataplex",
    ],
    examDayChecklist: {
      subtitle:
        "Professional Data Engineer は 120 分・40〜50 問・有効期限 2 年の専門資格です。BigQuery の物理最適化、Bigtable 行キー設計、Dataflow の遅延データ処理、およびセキュリティ/ガバナンスが頻出です。",
      tips: [
        {
          title: "⏱️ 要件キーワード即断を徹底",
          body: "「10ms未満・大量時系列」＝ Bigtable、「グローバル強整合 SQL」＝ Spanner、「ペタバイト分析」＝ BigQuery、「Spark 移行」＝ Dataproc（エフェメラル+GCS）で即絞り込みます。",
        },
        {
          title: "🔑 Cloud Bigtable 行キーの鉄則",
          body: "タイムスタンプ先頭・単調連番・固定ドメイン先頭はホットスポット化するため NG。ドメイン反転・フィールド昇格・ソルト付加でアクセスを分散させます。",
        },
        {
          title: "🌊 Dataflow（Apache Beam）のストリーム概念",
          body: "ウィンドウ（Fixed / Sliding / Session）、遅延データを扱うウォーターマークと許容遅延（Allowed Lateness）、トリガー、デッドレターパターンの役割を押さえます。",
        },
        {
          title: "📉 BigQuery の高速化＆コスト最適化",
          body: "日付シャーディング乱立は避け、単一テーブルで時間パーティショニング＋クラスタリング＋Materialized View・BI Engine・Storage Read API を活用します。",
        },
      ],
    },
  },
  pmle: {
    id: "pmle",
    levelGroup: "Professional",
    label: "Professional ML Engineer (PMLE)",
    shortLabel: "PMLE",
    badgeText: "GOOGLE CLOUD PROFESSIONAL ML ENGINEER STUDY HUB",
    headline: "Professional Machine Learning Engineer（PMLE）",
    description:
      "Vertex AI（Pipelines / Feature Store / Model Monitoring）・生成 AI（Gemini / RAG）・BigQuery ML・分散学習（GPU/TPU）・MLOps の設計と自動化を学ぶ機械学習エンジニア向け学習ハブです。",
    storageKey: "ai-park-gcp-pmle-progress-v1",
    defaultExpanded: { "pmle-domain-1": true },
    secondsPerQuestion: 120,
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional ML Engineer 本試験（公式合格点非公開・本演習目安 70%）",
    },
    quizBadgeLabel: "GCP PMLE 演習",
    flashcardTitle: "PMLE 機械学習・MLOps 要件 → Vertex AI / 手法即答トレーニング",
    quickSearchChips: [
      "Vertex AI",
      "Gemini",
      "Feature Store",
      "BigQuery ML",
      "AutoML",
      "Pipelines",
      "Model Monitoring",
    ],
    examDayChecklist: {
      subtitle:
        "Professional Machine Learning Engineer は 120 分・50〜60 問・有効期限 2 年の専門資格です。不均衡データ指標、データリーク防止、Vertex AI MLOps、生成 AI（RAG・ファインチューニング）の設計判断が問われます。",
      tips: [
        {
          title: "📏 評価指標とデータリーク防止",
          body: "不均衡クラス分類（不正検知等）では Accuracy ではなく PR-AUC や F1 を重視。スケーリングや統計量計算は必ずデータ分割（Train/Val/Test）後に訓練データのみで fit します。",
        },
        {
          title: "🧠 生成 AI 開発の適切な選択",
          body: "事前学習済み API → プロンプト / RAG（Vertex AI Search・Vector Search）→ LoRA / SFT チューニング → カスタム学習の順で、最小労力・低コストから検討します。",
        },
        {
          title: "🔁 MLOps（Feature Store & Model Monitoring）",
          body: "オンライン推論とオフライン学習の特徴量乖離を防ぐには Vertex AI Feature Store。本番稼働後の Training-Serving Skew と Feature Drift 検知には Model Monitoring を使用します。",
        },
        {
          title: "⚡ 推論レイテンシとコスト最適化",
          body: "リアルタイム推論は Endpoints（トラフィック分割・量子化/蒸留・vLLM 等）、定期一括推論は Batch Prediction、SQL 完結なら BigQuery ML を選択します。",
        },
      ],
    },
  },
  pcse: {
    id: "pcse",
    levelGroup: "Professional",
    label: "Professional Cloud Security Engineer (PCSE)",
    shortLabel: "PCSE",
    badgeText: "GOOGLE CLOUD PROFESSIONAL SECURITY ENGINEER STUDY HUB",
    headline: "Professional Cloud Security Engineer（PCSE）",
    description:
      "IAM / Workload Identity Federation・VPC Service Controls・Cloud Armor / NGFW・Cloud KMS / EKM・DLP・Security Command Center / SecOps を体系的に学ぶセキュリティエンジニア向け学習ハブです。",
    storageKey: "ai-park-gcp-pcse-progress-v1",
    defaultExpanded: { "pcse-domain-1": true },
    secondsPerQuestion: 120,
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional Cloud Security Engineer 本試験（公式合格点非公開・本演習目安 70%）",
    },
    quizBadgeLabel: "GCP PCSE 演習",
    flashcardTitle: "PCSE セキュリティ脅威・要件 → 防御・境界・暗号制御即答トレーニング",
    quickSearchChips: [
      "IAM",
      "VPC Service Controls",
      "Cloud KMS",
      "Cloud Armor",
      "Security Command Center",
      "Cloud DLP",
      "Binary Authorization",
    ],
    examDayChecklist: {
      subtitle:
        "Professional Cloud Security Engineer は 120 分・50〜60 問・有効期限 2 年のセキュリティ専門資格です。Workload Identity Federation、VPC-SC 境界、鍵管理 4 方式、DLP・SecOps の深掘り設計が問われます。",
      tips: [
        {
          title: "🔐 外部ワークロードのキーレス認証",
          body: "AWS / GitHub Actions / オンプレから GCP へアクセスする場合は静的 JSON キーを発行せず Workload Identity Federation、人間の社員フェデレーションには Workforce Identity Federation を選びます。",
        },
        {
          title: "🚧 VPC Service Controls の運用コツ",
          body: "本番境界を一気に適用して業務を止めないよう、まずドライラン（Dry-run）モードで違反ログを検証してから強制適用します。クロスプロジェクト許可には Ingress/Egress ルールを使います。",
        },
        {
          title: "🗝️ 暗号鍵オプション（GMEK / CMEK / CSEK / EKM）",
          body: "鍵ローテーション・失効の自社制御＝CMEK（Cloud KMS / HSM）、Google 外部の自社 KMS 保持＝Cloud EKM、リクエスト時のみ鍵提示＝CSEK を要件文から正確に区別します。",
        },
        {
          title: "🛡️ サプライチェーン＆ランタイム防御",
          body: "改ざん検知ブート＝Shielded VMs、メモリ内データ保護＝Confidential Computing、署名済みコンテナのみ許可＝Binary Authorization、脅威可視化＝SCC Premium / Google SecOps。",
        },
      ],
    },
  },
  pcde: {
    id: "pcde",
    levelGroup: "Professional",
    label: "Professional Cloud DevOps Engineer (PCDE)",
    shortLabel: "PCDE",
    badgeText: "GOOGLE CLOUD PROFESSIONAL DEVOPS ENGINEER STUDY HUB",
    headline: "Professional Cloud DevOps Engineer（PCDE）",
    description:
      "SRE（SLI/SLO/エラーバジェット）・Cloud Build / Cloud Deploy CI/CD・GKE 運用・Cloud Monitoring / Logging / Trace / Profiler・インシデント対応を学ぶ DevOps/SRE 向け学習ハブです。",
    storageKey: "ai-park-gcp-pcde-progress-v1",
    defaultExpanded: { "pcde-domain-1": true },
    secondsPerQuestion: 120,
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional Cloud DevOps Engineer 本試験（公式合格点非公開・本演習目安 70%）",
    },
    quizBadgeLabel: "GCP PCDE 演習",
    flashcardTitle: "PCDE SRE・CI/CD・可観測性要件 → 運用手法・サービス即答トレーニング",
    quickSearchChips: [
      "SLO",
      "Cloud Build",
      "Cloud Deploy",
      "GKE",
      "Cloud Monitoring",
      "Cloud Trace",
      "Artifact Registry",
    ],
    examDayChecklist: {
      subtitle:
        "Professional Cloud DevOps Engineer は 120 分・50〜60 問・有効期限 2 年の SRE/DevOps 専門資格です。Google 流 SRE 原則（バーンレートアラート・トイル削減）と CI/CD・可観測性の実戦構成が問われます。",
      tips: [
        {
          title: "🚨 バーンレートアラート（Burn Rate Alert）",
          body: "単なる瞬間的なエラー率閾値ではなく、エラーバジェットの消費速度（短窓＋長窓の複数ウィンドウバーンレート）でページングとチケット通知を切り分けます。",
        },
        {
          title: "🚀 Cloud Build + Cloud Deploy + Binary Auth",
          body: "ビルド・テスト＝Cloud Build、Artifact Registry 保存、Binary Authorization で署名検証、Cloud Deploy で Canary / Blue-Green 段階プロモーション＆自動ロールバックを設計します。",
        },
        {
          title: "🔭 可観測性 4 ツールの役割分担",
          body: "指標＆SLO＝Cloud Monitoring、ログ収集＆ルーティング＝Cloud Logging（Log Router / ログベース指標）、分散遅延＝Cloud Trace、CPU/メモリホットスポット＝Cloud Profiler。",
        },
        {
          title: "🤝 インシデント対応と GKE 運用",
          body: "Blameless Postmortem と自動化によるトイル削減を最優先。GKE では HPA / VPA / Cluster Autoscaler の競合回避と PodDisruptionBudget・Probes 設計を押さえます。",
        },
      ],
    },
  },
  pcd: {
    id: "pcd",
    levelGroup: "Professional",
    label: "Professional Cloud Developer (PCD)",
    shortLabel: "PCD",
    badgeText: "GOOGLE CLOUD PROFESSIONAL CLOUD DEVELOPER STUDY HUB",
    headline: "Professional Cloud Developer（PCD）",
    description:
      "12-Factor App・Cloud Run / GKE・Cloud Build / Cloud Deploy・Skaffold・Pub/Sub / Eventarc / Cloud Tasks・Secret Manager・Cloud Trace / Profiler を学ぶ開発者向け学習ハブです。",
    storageKey: "ai-park-gcp-pcd-progress-v1",
    defaultExpanded: { "pcd-domain-1": true },
    secondsPerQuestion: 120,
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional Cloud Developer 本試験（公式合格点非公開・本演習目安 70%）",
    },
    quizBadgeLabel: "GCP PCD 演習",
    flashcardTitle: "PCD アプリ設計・非同期連携・デバッグ要件 → サービス即答トレーニング",
    quickSearchChips: [
      "Cloud Run",
      "GKE",
      "Pub/Sub",
      "Cloud Tasks",
      "Eventarc",
      "Secret Manager",
      "Cloud Trace",
    ],
    examDayChecklist: {
      subtitle:
        "Professional Cloud Developer は 120 分・50〜60 問・有効期限 2 年の開発者向け最上位資格です。クラウドネイティブ設計、ステートレス／非同期連携、開発〜CI/CD ツール、計測・デバッグの選択が中心です。",
      tips: [
        {
          title: "📨 非同期メッセージングの使い分け",
          body: "多対多のイベント配信＝Pub/Sub、特定ワーカーへのレート制御付きタスク実行＝Cloud Tasks、GCP サービスイベントのルーティング＝Eventarc、複数ステップ制御＝Cloud Workflows。",
        },
        {
          title: "🧱 12-Factor App とステートレス設計",
          body: "セッション状態やファイルはコンテナローカルに持たず Cloud Memorystore（Redis）や Cloud Storage へ外出しし、設定・秘密情報は Secret Manager で注入します。",
        },
        {
          title: "🛠️ 開発・デプロイ効率化ツール",
          body: "ローカル/CI のコンテナ反復＝Skaffold / Cloud Code、高速ビルド＝Cloud Build（Buildpacks）、段階リリース＝Cloud Deploy や Cloud Run トラフィック分割を活用します。",
        },
        {
          title: "🔍 パフォーマンス＆エラー診断",
          body: "ローカル/本番で特定の関数が CPU・メモリを食っている場合は Cloud Profiler、マイクロサービス間レイテンシは Cloud Trace、スタックトレース集約は Error Reporting。",
        },
      ],
    },
  },
  pcne: {
    id: "pcne",
    levelGroup: "Professional",
    label: "Professional Cloud Network Engineer (PCNE)",
    shortLabel: "PCNE",
    badgeText: "GOOGLE CLOUD PROFESSIONAL NETWORK ENGINEER STUDY HUB",
    headline: "Professional Cloud Network Engineer（PCNE）",
    description:
      "Global VPC・Shared VPC・PSC・GKE VPC-Native・Cloud Load Balancing・Cloud DNS・Cloud Interconnect / HA VPN・Cloud Router (BGP)・Cloud Armor / NGFW・Network Intelligence Center を学ぶネットワーク専門学習ハブです。",
    storageKey: "ai-park-gcp-pcne-progress-v1",
    defaultExpanded: { "pcne-domain-1": true },
    secondsPerQuestion: 120,
    passingConfig: {
      minScore: 0,
      maxScore: 100,
      passingScore: 70,
      passingPct: 70,
      officialExamLabel: "Professional Cloud Network Engineer 本試験（公式合格点非公開・本演習目安 70%）",
    },
    quizBadgeLabel: "GCP PCNE 演習",
    flashcardTitle: "PCNE ネットワーク設計・BGP・LB 要件 → 構成・診断手法即答トレーニング",
    quickSearchChips: [
      "Shared VPC",
      "Private Service Connect",
      "Cloud Load Balancing",
      "Cloud Router",
      "Interconnect",
      "Cloud DNS",
      "Cloud Armor",
    ],
    examDayChecklist: {
      subtitle:
        "Professional Cloud Network Engineer は 120 分・50〜60 問・有効期限 2 年のネットワーク専門資格です。BGP 経路制御（MED・AS-Path）、LB 種別選定、PSC/NCC、NIC による疎通診断が高頻度で出題されます。",
      tips: [
        {
          title: "🔀 VPC 接続方式の選定基準",
          body: "一元ネットワーク管理＋権限分離＝Shared VPC、単純 1 対 1（非推移的）＝VPC ピアリング、ハブ＆スポーク大規模接続＝Network Connectivity Center、IP 重複回避サービス公開＝Private Service Connect。",
        },
        {
          title: "⚖️ ロードバランサ 4 象限の整理",
          body: "外部/内部 × グローバル/リージョン × L7(HTTP/S)/L4(TCP/UDP) × プロキシ/パススルー（クライアント元 IP 維持・UDP 低遅延＝パススルー LB）を正確に整理します。",
        },
        {
          title: "📡 ハイブリッド＆BGP（Cloud Router）",
          body: "送信経路制御は BGP の MED 値（小さい方が優先）、受信経路制御は AS-Path プリペンドやカスタムルート広報。Dedicated 99.99% SLA は 2 メトロ×4 接続構成が必須です。",
        },
        {
          title: "🧪 疎通トラブルシューティング",
          body: "実パケット無しでの経路・FW 設定検証＝Connectivity Tests、トラフィック監査＝VPC Flow Logs、FW ルール最適化＝Firewall Insights、L7 IDS＝Cloud IDS / Packet Mirroring。",
        },
      ],
    },
  },
};
