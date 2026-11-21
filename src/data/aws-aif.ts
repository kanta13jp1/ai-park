import type {
  SaaExamFact,
  SaaDomain,
  SaaComparisonTable,
  SaaQuickLookupItem,
  SaaQuestion,
  SaaOfficialResource,
  SaaArchitecturePattern,
  SaaPitfall,
  SaaLimitFact,
} from "@/data/aws-saa";

// 出典: AWS Certified AI Practitioner (AIF-C01) 公式試験ガイド / AWS 公式ドキュメント
export const aifExamFacts: SaaExamFact[] = [
  { label: "試験コード", value: "AIF-C01", detail: "Foundational レベル" },
  { label: "試験時間", value: "90 分", detail: "1時間30分" },
  { label: "問題数", value: "65 問", detail: "採点50問 + 非採点15問" },
  { label: "合格ライン", value: "700 点", detail: "100〜1000点スケール" },
  { label: "出題形式", value: "択一 / 複数", detail: "AI・生成AIの基礎とユースケース選定" },
  { label: "受験料", value: "$100 USD", detail: "ピアソンVUE / オンライン可" },
];

export const aifDomains: SaaDomain[] = [
  {
    id: "aif-domain-1",
    number: 1,
    title: "AI および ML の基礎",
    englishTitle: "Fundamentals of AI and ML",
    weight: 20,
    accentColor: "indigo",
    summary:
      "AI・機械学習（ML）・ディープラーニング・生成 AI の基礎概念、教師あり/教師なし/強化学習の使い分け、ML 開発ライフサイクル（データ準備・評価指標・ドリフト監視）、および学習不要な AWS AI マネージドサービスの選定が問われます。",
    topics: [
      {
        id: "aif-d1-t1",
        title: "AI・ML の基本概念と学習パラダイム（教師あり / 教師なし / 強化学習）",
        services: ["教師あり学習", "教師なし学習", "強化学習", "ディープラーニング", "埋め込みベクトル"],
        keyPoints: [
          "AI（人工知能）⊃ 機械学習（ML）⊃ ディープラーニング（深層学習）⊃ 生成 AI の包含関係を理解し、ルールベースプログラムとの違い（データからパターンを学習）を整理する",
          "教師あり学習はラベル付きデータから分類（スパム判定・画像分類）や回帰（売上・価格予測）を学習し、教師なし学習はラベルなしデータからクラスタリング・異常検知・次元削減を行う",
          "強化学習はエージェントが環境内で行動して報酬を最大化する方策を学習し、ディープラーニングは多層ニューラルネットワークで画像・音声・自然言語の複雑な特徴を抽出する",
          "テキストや画像を意味的な数値配列へ変換する「埋め込みベクトル（Embeddings）」、および事前計算で知識を獲得する「トレーニング」と新規入力から予測する「推論（Inference）」を区別する",
        ],
        examTip:
          "「ラベル付きデータでカテゴリ分類や数値予測」＝ 教師あり学習、「ラベルなしで顧客セグメント分割」＝ 教師なし学習、「確定的な計算・条件分岐で解ける業務」＝ ML 不要（従来プログラム）。",
      },
      {
        id: "aif-d1-t2",
        title: "ML 開発ライフサイクル・評価指標と AWS AI マネージドサービス",
        services: [
          "Amazon SageMaker",
          "Amazon Rekognition",
          "Amazon Comprehend",
          "Amazon Textract",
          "Amazon Transcribe",
          "Amazon Polly",
          "Amazon Translate",
          "Amazon Kendra",
          "Amazon Personalize",
          "Amazon Lex",
        ],
        keyPoints: [
          "ML ライフサイクル（課題定義 → データ収集・EDA・特徴量エンジニアリング → 学習・チューニング → 評価 → デプロイ → 監視）で、過学習（学習データへの過剰適合）と未学習を防ぐ",
          "分類の評価指標（混同行列に基づく Accuracy・Precision・Recall・F1 スコア・AUC-ROC）と回帰の評価指標（RMSE・MAE）をビジネス要件（偽陰性回避＝Recall 重視等）に応じて選定する",
          "独自モデルの構築・学習・Feature Store・Pipelines・Model Monitor まで一貫管理する場合は Amazon SageMaker を利用する",
          "モデル学習不要の API として使える AWS AI マネージドサービス：画像/動画分析（Rekognition）、NLP/感情/PII（Comprehend）、文書 OCR/表抽出（Textract）、文字起こし（Transcribe）、音声合成（Polly）、翻訳（Translate）、企業検索（Kendra）、レコメンド（Personalize）、対話ボット（Lex）",
        ],
        examTip:
          "「自社でモデル学習せず即座に画像認識・OCR・翻訳を組み込みたい」＝ Rekognition / Textract / Translate 等のマネージド AI サービス。「表形式の独自予測モデル」＝ Amazon SageMaker。",
      },
    ],
  },
  {
    id: "aif-domain-2",
    number: 2,
    title: "生成 AI の基礎",
    englishTitle: "Fundamentals of Generative AI",
    weight: 24,
    accentColor: "emerald",
    summary:
      "トークン・チャンク・Transformer・拡散モデルなどの生成 AI の仕組み、ハルシネーションや非決定性といったビジネス適用上の限界、ならびに Amazon Bedrock・Amazon Q・Trainium / Inferentia などの AWS 基盤が問われます。",
    topics: [
      {
        id: "aif-d2-t1",
        title: "生成 AI の仕組み（Transformer・トークン・基盤モデル・限界）",
        services: ["基盤モデル (FM)", "Transformer", "トークンとチャンク", "マルチモーダルモデル", "ハルシネーション"],
        keyPoints: [
          "基盤モデル（Foundation Model: FM）は大規模データで事前学習された汎用モデルで、テキスト生成の LLM、画像生成の拡散モデル（Diffusion Model）、テキスト・画像・音声を横断するマルチモーダルモデルを含む",
          "Transformer アーキテクチャは Self-Attention（自己注意機構）により文脈中のトークン間の関連性を並列計算し、長文脈の理解と生成を高精度に処理する",
          "入力テキストはトークン（単語やサブワード）へ分割され、コンテキストウィンドウ（最大トークン数）や課金単位となる。検索用長文はチャンク分割（Chunking）して埋め込み化する",
          "生成 AI の主な限界として、事実に基づかないもっともらしい誤情報を出力するハルシネーション（Hallucination）、非決定性（同一入力でも出力が揺らぐ）、解釈可能性の低さ、知識カットオフがある",
        ],
        examTip:
          "「文脈の離れた単語同士の関連性を捉えるアーキテクチャ」＝ Transformer（Self-Attention）。「もっともらしい誤回答」＝ ハルシネーション（RAG や Guardrails で軽減）。",
      },
      {
        id: "aif-d2-t2",
        title: "AWS 生成 AI 基盤（Amazon Bedrock・Amazon Q・Trainium / Inferentia）",
        services: [
          "Amazon Bedrock",
          "Amazon Q Business",
          "Amazon Q Developer",
          "AWS Trainium",
          "AWS Inferentia",
        ],
        keyPoints: [
          "Amazon Bedrock は主要プロバイダ（Amazon Nova / Titan、Anthropic Claude、Meta Llama、Mistral、Cohere、Stability AI 等）の基盤モデルを単一のサーバーレス API で安全に利用できるフルマネージドサービス",
          "Amazon Q Business は社内データソースとアクセス権限を連携するビジネス向け生成 AI アシスタント、Amazon Q Developer は IDE や AWS コンソールでコード生成・レビュー・モダナイズを支援する開発者向けアシスタント",
          "AWS 独自設計の ML 専用アクセラレータ：AWS Trainium（Trn インスタンス）は大規模モデルの学習（トレーニング）向けにコスト効率を最適化し、AWS Inferentia（Inf インスタンス）は高スループット・低遅延な推論向けに最適化",
          "ビジネス要件に応じた FM 選定では、対応モダリティ・レイテンシ・コスト（モデルサイズやトークン単価）・コンテキストウィンドウ長・カスタマイズ可否のトレードオフを評価する",
        ],
        examTip:
          "「サーバーレス API で複数 FM を比較・利用」＝ Amazon Bedrock。「コーディング支援」＝ Amazon Q Developer、「ノーコード社内検索チャット」＝ Amazon Q Business。「学習用」＝ Trainium、「推論用」＝ Inferentia。",
      },
    ],
  },
  {
    id: "aif-domain-3",
    number: 3,
    title: "基盤モデルのアプリケーション",
    englishTitle: "Applications of Foundation Models",
    weight: 28,
    accentColor: "amber",
    summary:
      "出題比率最大の 28%。プロンプトエンジニアリングと推論パラメータ（Temperature / Top-P / Top-K）、Bedrock Knowledge Bases による RAG、Fine-Tuning・継続的事前学習、Bedrock Agents、SageMaker JumpStart、モデル評価指標（ROUGE / BLEU / BERTScore）と推論課金が問われます。",
    topics: [
      {
        id: "aif-d3-t1",
        title: "プロンプトエンジニアリングと推論パラメータ設計",
        services: ["プロンプトエンジニアリング", "Chain-of-Thought", "Temperature", "Top-P / Top-K", "Max Tokens"],
        keyPoints: [
          "代表的プロンプト技法：Zero-shot（例示なし）、Few-shot（数個の入出力例を提示して形式・精度を安定化）、Chain-of-Thought / CoT（推論ステップを段階的に出力させ論理・計算を改善）、System Prompt（役割・制約定義）、Negative Prompt（除外指定）",
          "推論パラメータ：Temperature（低いほど決定的・事実重視、高いほど多様・創造的）、Top-P（累積確率 P 内のトークン候補を選択）、Top-K（確率上位 K 個に制限）、Max Tokens / Stop Sequences（生成長と停止文字列を制御）",
          "モデルの再学習や外部 DB 構築が不要なため、生成 AI の精度改善はまずプロンプトエンジニアリングから着手するのが最も低コストで迅速なアプローチとなる",
          "悪意あるユーザー入力でシステム指示を上書き・回避させる「プロンプトインジェクション」や「ジェイルブレイク」に対する防御設計を考慮する",
        ],
        examTip:
          "「追加学習・追加データストアなしで出力品質を改善したい」＝ プロンプトエンジニアリング（Few-shot / CoT）。「一貫性・正確性重視の応答」＝ Temperature を 0 に近づける。",
      },
      {
        id: "aif-d3-t2",
        title: "RAG（Amazon Bedrock Knowledge Bases）とベクトル検索",
        services: ["RAG", "Bedrock Knowledge Bases", "OpenSearch Serverless", "Aurora pgvector", "Amazon S3"],
        keyPoints: [
          "RAG（Retrieval-Augmented Generation：検索拡張生成）は、外部の最新データや社内文書から関連チャンクを検索しプロンプトへ注入することで、モデルの再学習なしに最新情報反映・ハルシネーション抑制・出典（Citation）提示を実現する",
          "Knowledge Bases for Amazon Bedrock は Amazon S3 のデータ取り込み、チャンク分割、埋め込み生成、ベクトルデータベース登録、クエリ検索、出典付き回答生成をフルマネージドで自動化する",
          "代表的なベクトルデータストア：Amazon OpenSearch Serverless（フルマネージド・サーバーレス）、Amazon Aurora PostgreSQL（pgvector 拡張：既存 RDB 統合）、Amazon Kendra、Pinecone / Redis 等",
          "チャンクサイズ・オーバーラップ・取得件数（Top-K）・メタデータフィルタの調整によって検索再現率と回答精度を最適化できる",
        ],
        examTip:
          "「モデルを再学習せずに最新の社内規程・製品仕様を参照して出典付きで回答」＝ RAG（Amazon Bedrock Knowledge Bases ＋ S3 ＋ ベクトルストア）。",
      },
      {
        id: "aif-d3-t3",
        title: "基盤モデルのカスタマイズ（Fine-Tuning・継続的事前学習）と Bedrock Agents",
        services: ["Fine-Tuning", "継続的事前学習", "RLHF", "Bedrock Agents", "AWS Lambda"],
        keyPoints: [
          "Instruction-based Fine-Tuning（指示ベースファインチューニング）：少量のラベル付き（プロンプト・応答ペア）データを用いて、特定の出力フォーマット（JSON 等）やトーン・特定タスク精度を向上させる",
          "Continued Pre-training（継続的事前学習）：大規模なラベルなしドメイン特化データ（専門文献・業界用語など）を追加学習させ、モデルに特定領域の知識や文脈を深く定着させる",
          "RLHF（人間のフィードバックによる強化学習）：人間の評価ランキングから報酬モデルを学習し、モデルの振る舞いを有用性・安全性・指示遵守の方向へ最適化する",
          "Agents for Amazon Bedrock はユーザーの複雑な要求を計画・分解し、Knowledge Bases の検索や AWS Lambda 関数（Action Groups）経由での外部 API・DB 更新を自律的にオーケストレーションする",
        ],
        examTip:
          "「特定出力形式や専門トーンの学習」＝ Fine-Tuning。「膨大な未ラベル専門文書を馴染ませる」＝ 継続的事前学習。「外部システムを自律実行（予約・注文更新）」＝ Bedrock Agents ＋ Lambda。",
      },
      {
        id: "aif-d3-t4",
        title: "FM 選定・推論最適化（JumpStart / 課金）とモデル評価指標",
        services: [
          "SageMaker JumpStart",
          "Provisioned Throughput",
          "Batch Inference",
          "Bedrock Model Evaluation",
          "ROUGE / BLEU / BERTScore",
        ],
        keyPoints: [
          "Amazon SageMaker JumpStart はオープンソースおよび商用基盤モデル（Llama・Mistral・Hugging Face モデル等）をワンクリックでデプロイ・カスタマイズでき、モデル重みや専用インスタンスを柔軟に制御できる",
          "Amazon Bedrock の推論料金体系：On-Demand（トークン単位の従量課金）、Provisioned Throughput（一定スループット保証・時間課金・カスタム学習済みモデルのホストに必須）、Batch Inference（S3 上の大量データを非同期一括処理しコスト低減）",
          "生成 AI の自動評価指標：ROUGE（要約タスクの N-gram 再現率中心）、BLEU（機械翻訳の N-gram 適合率中心）、BERTScore（埋め込みベクトルによる意味的類似度）、Perplexity（言語モデルの予測不確実性・低いほど良好）",
          "Amazon Bedrock Model Evaluation を活用し、自動評価・人間による評価・LLM-as-a-Judge を組み合わせて正確性・毒性・堅牢性・レイテンシ・コストを比較検証する",
        ],
        examTip:
          "「OSS モデルのインスタンス・重みを自社管理で展開」＝ SageMaker JumpStart。「カスタムモデルのホスティング」＝ Provisioned Throughput。「要約評価」＝ ROUGE、「翻訳評価」＝ BLEU。",
      },
    ],
  },
  {
    id: "aif-domain-4",
    number: 4,
    title: "責任ある AI のガイドライン",
    englishTitle: "Guidelines for Responsible AI",
    weight: 14,
    accentColor: "cyan",
    summary:
      "AWS が定める責任ある AI の 8 原則、Amazon Bedrock Guardrails による有害出力や PII の統制、Amazon A2I による人手確認、ならびに Amazon SageMaker Clarify・Model Monitor・AWS AI Service Cards によるバイアス対策・説明可能性・透明性が問われます。",
    topics: [
      {
        id: "aif-d4-t1",
        title: "責任ある AI の 8 原則と Bedrock Guardrails・Human-in-the-Loop",
        services: ["責任ある AI", "Bedrock Guardrails", "Amazon A2I", "ウォーターマーク検出"],
        keyPoints: [
          "AWS の責任ある AI（Responsible AI）の 8 つの主要次元：公平性（Fairness）、説明可能性（Explainability）、プライバシーとセキュリティ（Privacy & Security）、安全性（Safety）、制御可能性（Controllability）、真実性と堅牢性（Veracity & Robustness）、ガバナンス（Governance）、透明性（Transparency）",
          "Amazon Bedrock Guardrails は複数 FM にまたがり統一的な安全ポリシーを適用し、有害コンテンツのフィルタリング、拒否トピック（Denied Topics）、禁止語句、PII マスキング/ブロック、プロンプト攻撃防御、コンテキストグラウンディングチェック（RAG ハルシネーション抑制）を提供する",
          "Amazon Augmented AI（Amazon A2I）は AI の推論信頼度がしきい値を下回った場合や重要判断において、人間のレビュアーによる確認ワークフロー（Human-in-the-Loop）を統合する",
          "Amazon Titan Image Generator 等が生成画像に埋め込む不可視の電子透かしとウォーターマーク検出（Watermark Detection）機能により、AI 生成画像の識別と偽情報対策を支援する",
        ],
        examTip:
          "「どのモデルを使っても一律で禁止トピック・有害表現・PII をブロックしたい」＝ Bedrock Guardrails。「信頼度が低い推論のみ人手レビュー」＝ Amazon A2I。",
      },
      {
        id: "aif-d4-t2",
        title: "バイアス検知・説明可能性（SageMaker Clarify）・透明性（Service Cards）",
        services: ["SageMaker Clarify", "SageMaker Model Monitor", "AWS AI Service Cards", "バイアスとデータドリフト"],
        keyPoints: [
          "Amazon SageMaker Clarify は学習前後のデータセットおよびモデルのバイアス（属性間の偏り）を定量検出し、SHAP 値に基づく特徴量寄与度によってモデル予測の説明可能性（Explainability）を提供する（LLM の毒性・バイアス評価にも対応）",
          "Amazon SageMaker Model Monitor は本番デプロイ後の入力データ分布変化（データドリフト）や予測精度劣化・バイアス逸脱を継続的に監視してアラートを通知する",
          "解釈可能性（Interpretability：決定木や線形モデルのように構造自体が直感的）と説明可能性（Explainability：SHAP 等で複雑モデルの判断理由を事後解説）の使い分けとトレードオフを理解する",
          "AWS AI Service Cards やモデルカード（Model Cards）を通じて、各 AI サービスの想定ユースケース・制限事項・責任ある設計上の推奨事項を透明性高く共有・文書化する",
        ],
        examTip:
          "「データや予測の偏り検知・SHAP による根拠説明」＝ SageMaker Clarify。「本番運用中の入力変化（データドリフト）検知」＝ SageMaker Model Monitor。「公式サービスの透明性文書」＝ AWS AI Service Cards。",
      },
    ],
  },
  {
    id: "aif-domain-5",
    number: 5,
    title: "AI ソリューションのセキュリティ、コンプライアンス、ガバナンス",
    englishTitle: "Security, Compliance, and Governance for AI Solutions",
    weight: 14,
    accentColor: "indigo",
    summary:
      "AI システムの境界防御（IAM・KMS・PrivateLink・Macie）、Amazon Bedrock のデータ非学習・非共有保証、監査ログ（CloudTrail・Bedrock モデル呼び出しログ）、データリネージ、および責任共有モデルとコンプライアンス統制が問われます。",
    topics: [
      {
        id: "aif-d5-t1",
        title: "AI セキュリティ境界防御・暗号化・データプライバシー",
        services: ["IAM", "AWS KMS", "AWS PrivateLink", "Amazon Macie", "Bedrock データ非学習"],
        keyPoints: [
          "Amazon Bedrock データプライバシー保証：顧客が送信したプロンプト・推論応答・カスタマイズ用データはベースモデルの再学習に使用されず、サードパーティモデルプロバイダとも共有されない",
          "最小権限の IAM ロール・ポリシーによってモデルやデータへのアクセスを制御し、AWS KMS（カスタマーマネージドキー: CMK）で S3 学習データ・ベクトル DB・カスタムモデル・暗号化通信を保護する",
          "AWS PrivateLink（Interface VPC エンドポイント）により、VPC 内のアプリと Amazon Bedrock / SageMaker 間のトラフィックをインターネットに出さず AWS プライベートネットワーク内で閉域接続する",
          "Amazon Macie を使用して学習データや RAG 用ソースを保存する Amazon S3 バケット内の個人情報（PII）や機密データを自動検出・分類し、意図しないデータ混入を防止する",
        ],
        examTip:
          "「VPC からインターネット非経由で Bedrock を呼び出す」＝ AWS PrivateLink。「S3 内の PII 事前発見」＝ Amazon Macie。「Bedrock がプロンプトを他社モデル学習に使うか」＝ 使わない（データ非学習）。",
      },
      {
        id: "aif-d5-t2",
        title: "AI コンプライアンス・監査ログ・データリネージと責任共有モデル",
        services: [
          "AWS CloudTrail",
          "Bedrock モデル呼び出しログ",
          "AWS Config",
          "AWS Artifact",
          "SageMaker ML Lineage Tracking",
        ],
        keyPoints: [
          "AWS CloudTrail は「誰が・いつ・どの AI リソース管理 API を呼んだか」を記録し、Bedrock モデル呼び出しログ（Model Invocation Logging）は実際の推論プロンプト・応答・メタデータを S3 や CloudWatch Logs へ監査記録する",
          "AWS Config は AI 環境リソース（S3 暗号化設定・パブリックアクセス遮断等）の構成変更履歴とルール準拠を監視し、AWS Artifact は AWS の SOC・ISO・HIPAA・GDPR 等の第三者認証レポートを提供する",
          "Amazon SageMaker ML Lineage Tracking により、データセット・前処理コード・パラメータ・学習済みモデルの来歴（リネージ）を自動記録し、再現性と監査ガバナンスを担保する",
          "AI における AWS 責任共有モデル：AWS は基盤インフラとマネージドモデル基盤のセキュリティを担い、顧客はプロンプト/データ保護・KMS 暗号化・IAM 権限・Guardrails 設定・リージョン選定によるデータレジデンシー遵守を担う",
        ],
        examTip:
          "「推論時のプロンプトと応答内容の監査保管」＝ Bedrock モデル呼び出しログ。「API 呼び出し操作監査」＝ CloudTrail。「学習データからモデルまでの系譜追跡」＝ SageMaker ML Lineage Tracking。",
      },
    ],
  },
];

export const aifComparisons: SaaComparisonTable[] = [
  {
    id: "comp-aif-genai-platforms",
    category: "コンピュート",
    title: "AWS 生成 AI プラットフォーム＆専用チップ比較（Bedrock / SageMaker / Amazon Q）",
    subtitle: "サーバーレス FM API・カスタマイズ基盤・生成 AI アシスタント・ML 専用チップの使い分け",
    columns: ["サービス / チップ", "レイヤー・特徴", "主な機能・対象モデル", "最適なユースケース"],
    rows: [
      {
        feature: "Amazon Bedrock",
        values: [
          "サーバーレス FM API（フルマネージド）",
          "Amazon Nova / Titan・Anthropic Claude・Meta Llama・Mistral 等を単一 API で利用。Knowledge Bases / Agents / Guardrails 統合",
          "インフラ管理ゼロで既存基盤モデルを安全に呼び出し、RAG やガードレール付き生成 AI アプリを迅速構築",
        ],
      },
      {
        feature: "Amazon SageMaker / SageMaker JumpStart",
        values: [
          "ML 構築・学習・ホスティング基盤",
          "独自 ML 構築（Pipelines / Feature Store / Model Monitor）に加え、JumpStart で OSS/商用 FM をワンクリック展開・重み制御",
          "表形式の独自機械学習モデル開発、あるいは OSS 基盤モデルの専用インスタンス・ハイパーパラメータを細かく制御したい場合",
        ],
      },
      {
        feature: "Amazon Q Business / Amazon Q Developer",
        values: [
          "即時導入型 生成 AI アシスタント",
          "Q Business は社内データ連携＆アクセス権継承チャット。Q Developer は IDE/AWS コンソールでのコード生成・診断・移行支援",
          "開発工数をかけず社内情報検索チャットを導入（Q Business）、またはソフトウェア開発・AWS 運用生産性を向上（Q Developer）",
        ],
      },
      {
        feature: "AWS Trainium / AWS Inferentia",
        values: [
          "AWS 独自設計 ML 専用チップ",
          "Trainium（EC2 Trn インスタンス）は分散学習向け、Inferentia（EC2 Inf インスタンス）は高スループット・低遅延推論向け",
          "大規模ディープラーニング／基盤モデルの学習コスト最適化（Trainium）と本番推論の価格性能比最適化（Inferentia）",
        ],
      },
    ],
    decisionRule:
      "「サーバーレス API で FM 活用」＝ Bedrock、「OSS モデルや独自 ML の詳細制御」＝ SageMaker（JumpStart）、「既製社内チャット / 開発支援」＝ Amazon Q、「学習用チップ」＝ Trainium、「推論用チップ」＝ Inferentia。",
  },
  {
    id: "comp-aif-customization",
    category: "データベース",
    title: "FM カスタマイズ手法＆RAG ベクトルデータストア比較",
    subtitle: "Prompt Engineering・RAG・Fine-Tuning・継続的事前学習・RLHF とベクトル DB 選定",
    columns: ["手法 / ストア", "データの性質・コスト", "仕組みと効果", "適したシナリオ・注意点"],
    rows: [
      {
        feature: "プロンプトエンジニアリング（Zero-shot / Few-shot / Chain-of-Thought）",
        values: [
          "追加学習不要・最小コスト",
          "入力指示の工夫や少数例示（Few-shot）、段階的推論（Chain-of-Thought）で回答品質を即時改善",
          "最初に試すべき手法。コンテキストウィンドウ上限やプロンプトインジェクション対策（Guardrails 等）に留意",
        ],
      },
      {
        feature: "RAG（Amazon Bedrock Knowledge Bases）",
        values: [
          "非構造化データ・中コスト（モデル再学習不要）",
          "Amazon S3 の文書をチャンク分割・埋め込み化し、ベクトル検索で関連情報をプロンプトに注入して出典付き回答を生成",
          "日々更新される社内規程や製品マニュアルを参照させ、ハルシネーション抑制と出典（Citation）提示を両立したい場合",
        ],
      },
      {
        feature: "ベクトル DB（OpenSearch Serverless / Aurora pgvector / Kendra）",
        values: [
          "埋め込みベクトルの高速類似検索",
          "OpenSearch Serverless（完全サーバーレス）、Aurora PostgreSQL pgvector（既存 RDB と統合）、Amazon Kendra（検索精度重視）",
          "Bedrock Knowledge Bases のバックエンドとして、サーバーレス運用・既存 PostgreSQL 連携・エンタープライズ検索要件で選択",
        ],
      },
      {
        feature: "Fine-Tuning（指示ベースファインチューニング）",
        values: [
          "少〜中規模のラベル付きペア・中〜高コスト",
          "プロンプトと期待応答のペアデータで重みを調整（PEFT / LoRA 等含む）し、出力形式やトーン・特定タスク精度を定着",
          "常に厳密な JSON 形式で返させたい、自社ブランド特有の文体・応答作法をモデルに覚えさせたい場合（最新知識の追加には RAG）",
        ],
      },
      {
        feature: "継続的事前学習（Continued Pre-training） / RLHF",
        values: [
          "大規模データ・最高コスト",
          "継続的事前学習は大規模な未ラベル専門テキストで領域知識を注入。RLHF は人間選好データから強化学習で振る舞いを整合",
          "医療・法務・金融など高度な専門語彙の深い獲得（継続的事前学習）や、安全性・有用性の人間アライメント（RLHF）",
        ],
      },
    ],
    decisionRule:
      "「最小コストで即時改善」＝ プロンプト、「最新・非公開知識の出典付き参照」＝ RAG（Knowledge Bases）、「出力様式・口調の定着」＝ Fine-Tuning、「大規模専門知識の注入」＝ 継続的事前学習。",
  },
  {
    id: "comp-aif-managed-ai",
    category: "非同期・連携",
    title: "AWS AI マネージドサービス＆エージェントオーケストレーション比較",
    subtitle: "学習不要のタスク特化 API 群と自律エージェント（Bedrock Agents / A2I）の役割分担",
    columns: ["サービス名", "対象モダリティ / 領域", "主な機能・試験キーワード"],
    rows: [
      {
        feature: "Amazon Rekognition",
        values: [
          "画像・動画分析 (CV)",
          "物体・シーン検出、顔認識・比較、著名人識別、不適切コンテンツ検出（Content Moderation）、画像内テキスト抽出",
        ],
      },
      {
        feature: "Amazon Textract",
        values: [
          "文書 OCR・構造抽出",
          "スキャン PDF・画像から単なる文字だけでなく、表（テーブル）・フォームのキーバリューペア・請求書/本人確認書類項目を抽出",
        ],
      },
      {
        feature: "Amazon Comprehend",
        values: [
          "自然言語処理 (NLP)",
          "テキストの感情分析（ポジ/ネガ）、キーフレーズ・固有表現抽出、言語判定、トピックモデリング、PII（個人情報）検出・墨消し",
        ],
      },
      {
        feature: "Amazon Transcribe / Amazon Polly / Amazon Translate",
        values: [
          "音声認識 / 音声合成 / 翻訳",
          "Transcribe は音声→テキスト文字起こし（話者分離・医療対応）、Polly はテキスト→自然な音声合成、Translate は多言語ニューラル翻訳",
        ],
      },
      {
        feature: "Amazon Kendra / Amazon Personalize / Amazon Lex",
        values: [
          "検索 / 推薦 / 対話ボット",
          "Kendra は自然言語で質問できる企業内インテリジェント検索、Personalize は行動履歴に基づくレコメンド、Lex は NLU 対話ボット構築",
        ],
      },
      {
        feature: "Agents for Amazon Bedrock（＋ AWS Lambda） / Amazon A2I",
        values: [
          "自律タスク実行 / 人手レビュー",
          "Bedrock Agents は ReAct 等でタスクを計画分解し、AWS Lambda（Action Groups）経由で外部 API・DB 操作を実行。A2I は低信頼推論を人手確認へ分岐",
        ],
      },
    ],
    decisionRule:
      "「帳票の表や項目抽出」＝ Textract、「文字の感情・PII 分析」＝ Comprehend、「動画の不適切検出」＝ Rekognition、「文字起こし/読み上げ」＝ Transcribe/Polly、「外部システム連携の自律実行」＝ Bedrock Agents＋Lambda。",
  },
  {
    id: "comp-aif-ml-fundamentals",
    category: "コンピュート",
    title: "ML 学習パラダイム＆生成 AI 基礎コンセプト比較",
    subtitle: "教師あり/教師なし/強化学習・ディープラーニングと Transformer・埋め込み・トークン",
    columns: ["概念 / パラダイム", "データ要件・仕組み", "代表的な用途と注意点"],
    rows: [
      {
        feature: "教師あり学習（分類 / 回帰）",
        values: [
          "正解ラベル付きデータが必要",
          "離散クラス予測の「分類」（解約予測・不正検知）と連続値予測の「回帰」（需要・価格予測）。表形式予測は従来 ML が高効率",
        ],
      },
      {
        feature: "教師なし学習（クラスタリング / 異常検知）",
        values: [
          "ラベルなしデータから構造を発見",
          "顧客セグメンテーション（K-Means 等）、外れ値・異常検知、次元削減。事前の正解ラベル付けコストが不要",
        ],
      },
      {
        feature: "強化学習（Reinforcement Learning）",
        values: [
          "試行錯誤と報酬シグナル",
          "状態・行動・報酬のループで長期的な累積報酬を最大化する方策を学習（ロボティクス、ゲーム、動的最適化、RLHF の基盤）",
        ],
      },
      {
        feature: "ディープラーニング / 基盤モデル (FM) / マルチモーダルモデル",
        values: [
          "多層ニューラルネット・大規模事前学習",
          "非構造化データ（画像・テキスト・音声）の高次元パターンを抽出。FM は 1 モデルで要約・翻訳・QA・画像生成など多タスクに対応",
        ],
      },
      {
        feature: "Transformer / トークンとチャンク / 埋め込みベクトル / ハルシネーション",
        values: [
          "Self-Attention による文脈理解",
          "トークン単位でコンテキストウィンドウとコストを計算し、埋め込みベクトルで意味検索。非決定性とハルシネーション（もっともらしい誤情報）に注意",
        ],
      },
    ],
    decisionRule:
      "「正解ラベルありの予測」＝ 教師あり、「ラベルなしで群分け」＝ 教師なし、「報酬で試行錯誤」＝ 強化学習。「生成 AI は確率的であり確定ロジックや表形式回帰の代替に乱用しない」点が頻出。",
  },
  {
    id: "comp-aif-params-eval",
    category: "コスト最適化",
    title: "FM 推論パラメータ・評価指標・推論課金モデル比較",
    subtitle: "Temperature / Top-P / Top-K / Max Tokens・ROUGE / BLEU / BERTScore・推論コスト最適化",
    columns: ["カテゴリ", "項目 / 指標", "挙動・計算観点・選定基準"],
    rows: [
      {
        feature: "Temperature / Top-P / Top-K / Max Tokens",
        values: [
          "推論ランダム性と出力長の制御",
          "Temperature（0 で決定的・事実重視、高値で創造的）、Top-P（累積確率しきい値）、Top-K（上位 K 候補）、Max Tokens（生成上限と課金抑制）",
        ],
      },
      {
        feature: "ROUGE / BLEU / BERTScore / Perplexity",
        values: [
          "生成 AI 自動評価指標（Bedrock Model Evaluation）",
          "ROUGE は要約の再現率重視、BLEU は翻訳の適合率重視、BERTScore は埋め込みによる意味的類似度、Perplexity は予測の不確実性（低いほど良）",
        ],
      },
      {
        feature: "分類・回帰 ML 評価指標（Accuracy / Precision / Recall / F1 / RMSE）",
        values: [
          "教師あり ML の品質評価",
          "Precision（陽性予測の正確さ：誤検知抑制）、Recall（実際の陽性網羅率：疾患や不正の見逃し防止）、F1（調和平均）、RMSE/MAE（回帰誤差）",
        ],
      },
      {
        feature: "Amazon Bedrock On-Demand",
        values: [
          "入力・出力トークン単位の完全従量課金",
          "初期コミットメント不要でスパイクや検証ワークロードに最適。ただしカスタム学習済みモデルのホストは非対応",
        ],
      },
      {
        feature: "Amazon Bedrock Provisioned Throughput",
        values: [
          "モデルユニット時間課金（スループット保証）",
          "大量・安定した高スループット要件やレイテンシ保証向け。Fine-Tuning / 継続的事前学習したカスタムモデルの推論には必須",
        ],
      },
      {
        feature: "Amazon Bedrock Batch Inference",
        values: [
          "S3 大量データの非同期一括処理",
          "リアルタイム応答が不要な夜間レポート要約や大量タグ付けで On-Demand 比コストを大幅に削減",
        ],
      },
    ],
    decisionRule:
      "「事実・抽出タスク」＝ Temperature 低め、「要約評価」＝ ROUGE、「翻訳評価」＝ BLEU、「意味類似度」＝ BERTScore、「カスタムモデル推論」＝ Provisioned Throughput、「非同期大量処理」＝ Batch Inference。",
  },
  {
    id: "comp-aif-responsible-ai",
    category: "セキュリティ",
    title: "責任ある AI（8原則）・ガードレール・説明可能性・監視ツール比較",
    subtitle: "責任あるAI（Responsible AI）を実現する Bedrock Guardrails / SageMaker Clarify / Model Monitor / A2I / Service Cards の使い分け",
    columns: ["ツール / 原則", "対象ステージ・役割", "主な機能と試験での判断基準"],
    rows: [
      {
        feature: "責任ある AI（Responsible AI）の 8 原則",
        values: [
          "設計〜運用全体のガバナンス基準",
          "公平性・説明可能性・プライバシーとセキュリティ・安全性・制御可能性・真実性と堅牢性・ガバナンス・透明性の 8 次元で評価",
        ],
      },
      {
        feature: "Amazon Bedrock Guardrails",
        values: [
          "推論入出力のリアルタイム安全制御",
          "有害コンテンツフィルタ、拒否トピック（Denied Topics）、禁止語句、PII マスキング/ブロック、プロンプト攻撃防御、コンテキストグラウンディング検証",
        ],
      },
      {
        feature: "Amazon SageMaker Clarify",
        values: [
          "学習データ・モデル評価（バイアス＆説明可能性）",
          "学習前後のデータ・予測バイアスを定量検出し、SHAP 値で特徴量重要度（予測理由）を可視化。FM の毒性・バイアス評価にも対応",
        ],
      },
      {
        feature: "Amazon SageMaker Model Monitor",
        values: [
          "本番デプロイ後の継続監視",
          "本番推論の入力データ分布変化（バイアスとデータドリフト）、モデル品質劣化、特徴量帰属の変化を自動検知しアラート発信",
        ],
      },
      {
        feature: "Amazon A2I / ウォーターマーク検出 / AWS AI Service Cards",
        values: [
          "人手介在・真実性・透明性",
          "Amazon A2I は低信頼推論を人手レビューへルーティング。ウォーターマーク検出で AI 生成画像を識別。AWS AI Service Cards で仕様・制約を開示",
        ],
      },
    ],
    decisionRule:
      "「有害出力や PII の即時ブロック」＝ Bedrock Guardrails、「SHAP 値での説明可能性とバイアス検出」＝ SageMaker Clarify、「本番ドリフト検知」＝ Model Monitor、「人手確認」＝ Amazon A2I。",
  },
  {
    id: "comp-aif-security-governance",
    category: "セキュリティ",
    title: "AI セキュリティ・プライバシー・監査・ガバナンス統制比較",
    subtitle: "IAM / KMS / Macie / CloudTrail / Bedrock モデル呼び出しログ / Config / Artifact / Lineage / 責任共有モデル",
    columns: ["機能 / サービス", "保護・監査レイヤー", "主な役割とコンプライアンス対応"],
    rows: [
      {
        feature: "Bedrock データ非学習（データプライバシー）",
        values: [
          "顧客入力・出力の保護原則",
          "Amazon Bedrock はプロンプト・補完出力・カスタマイズデータをベースモデルの再学習に利用せず、モデルプロバイダへも共有しない",
        ],
      },
      {
        feature: "IAM / AWS KMS",
        values: [
          "認証認可・データ暗号化",
          "最小権限の IAM ロールでモデル呼び出しとデータ参照を制限。KMS CMK で S3 学習データ・ベクトル DB・カスタムモデル・推論ログを暗号化",
        ],
      },
      {
        feature: "Amazon Macie",
        values: [
          "S3 機密データ・PII 自動発見",
          "学習データや RAG ナレッジを格納する S3 バケットをスキャンし、氏名・カード番号・認証情報などの PII 混入を事前検知",
        ],
      },
      {
        feature: "AWS CloudTrail / Bedrock モデル呼び出しログ",
        values: [
          "コントロール操作監査 / 推論コンテンツ監査",
          "CloudTrail は誰がいつ管理 API を実行したかを記録。Bedrock モデル呼び出しログは入力プロンプトと出力応答を S3 / CloudWatch Logs へ保存",
        ],
      },
      {
        feature: "AWS Config / AWS Artifact / SageMaker ML Lineage Tracking / 責任共有モデル",
        values: [
          "構成準拠・認証文書・系譜・責任境界",
          "Config は設定準拠監視、Artifact は ISO/SOC/HIPAA 等レポート取得、ML Lineage Tracking はデータ〜モデル来歴追跡。データ保護と Guardrails 設定は顧客責任",
        ],
      },
    ],
    decisionRule:
      "「API 操作履歴」＝ CloudTrail、「プロンプト/応答の記録」＝ Bedrock モデル呼び出しログ、「S3 の PII 発見」＝ Macie、「第三者認証文書」＝ Artifact、「来歴追跡」＝ ML Lineage Tracking。",
  },
  {
    id: "comp-aif-network-storage",
    category: "ネットワーク",
    title: "AI ワークロードの閉域接続・データ保管・データレジデンシー比較",
    subtitle: "AWS PrivateLink（VPC エンドポイント）・S3 / ベクトル DB のセキュア接続とリージョン統制",
    columns: ["サービス / 設計要素", "通信・配置スコープ", "AI セキュリティ・コンプライアンス上の利点"],
    rows: [
      {
        feature: "AWS PrivateLink（Interface VPC エンドポイント）",
        values: [
          "VPC 内のプライベート IP 接続",
          "Amazon Bedrock や SageMaker への API 呼び出しをパブリックインターネットに出さず、AWS バックボーン網内で閉域通信を実現",
        ],
      },
      {
        feature: "Amazon S3（データレイク・RAG ソース・ログ保管）",
        values: [
          "リージョン単位の堅牢オブジェクト保管",
          "学習データ・RAG 文書・Bedrock モデル呼び出しログを KMS 暗号化＋バケットポリシー＋パブリックアクセスブロックで保護",
        ],
      },
      {
        feature: "OpenSearch Serverless / Aurora pgvector（VPC 統合）",
        values: [
          "プライベートサブネット内のベクトル検索",
          "社外秘ナレッジの埋め込みベクトルをプライベートネットワーク上で隔離保管し、IAM と KMS でアクセスと暗号化を統制",
        ],
      },
      {
        feature: "リージョン選定とデータレジデンシー統制",
        values: [
          "単一リージョン完結とクロスリージョン推論の考慮",
          "GDPR や国内法規でデータ越境が禁止される場合、データが指定リージョン内に留まるようデプロイ先リージョンや IAM / SCP で制限",
        ],
      },
    ],
    decisionRule:
      "「インターネット非経由で Bedrock/SageMaker に接続」＝ AWS PrivateLink。「データ越境防止」＝ リージョン選定・SCP 制限・S3 暗号化。",
  },
];

export const aifQuickLookup: SaaQuickLookupItem[] = [
  {
    keyword: "独自モデルの学習やインフラ管理なしで主要 FM（Claude・Nova・Llama 等）をサーバーレス API で利用",
    category: "生成 AI 基盤",
    recommended: "Amazon Bedrock",
    reason:
      "主要プロバイダの基盤モデルを単一のサーバーレス API から呼び出せ、RAG・Agents・Guardrails も統合利用できます。",
  },
  {
    keyword: "モデルを再学習せず、最新の社内規程やマニュアルを参照して出典付きで回答生成",
    category: "FM アプリケーション",
    recommended: "RAG（Amazon Bedrock Knowledge Bases）",
    reason:
      "Amazon S3 の文書を自動チャンク分割・ベクトル化して検索プロンプトへ注入し、最新情報への追従とハルシネーション抑制を両立します。",
  },
  {
    keyword: "ユーザーの自然言語指示から、知識検索と外部 API / DB 更新（Lambda）まで自律実行",
    category: "FM アプリケーション",
    recommended: "Bedrock Agents ＋ AWS Lambda",
    reason:
      "Agents for Amazon Bedrock がタスク計画とアクション分解を行い、Action Groups 経由で AWS Lambda や Knowledge Bases を自動呼び出しします。",
  },
  {
    keyword: "複数モデル共通で有害表現フィルタ・禁止トピック拒否・PII マスキング・RAG 根拠検証を適用",
    category: "責任ある AI",
    recommended: "Amazon Bedrock Guardrails",
    reason:
      "モデルに依存しない統一ガードレールとして、入力プロンプト攻撃防御・禁止トピック遮断・PII 保護・コンテキストグラウンディングチェックを提供します。",
  },
  {
    keyword: "特定の出力フォーマット（JSON 等）や独自トーンを少量〜中量の教師データでモデルに定着",
    category: "FM カスタマイズ",
    recommended: "Fine-Tuning（指示ベースファインチューニング）",
    reason:
      "プロンプトと期待応答のペアデータで重みを調整（PEFT/LoRA 等）することで、定型様式や特定タスクの応答品質を安定化します。",
  },
  {
    keyword: "オープンソース基盤モデルをワンクリック展開し、専用インスタンスや重みを自社制御",
    category: "生成 AI 基盤",
    recommended: "Amazon SageMaker JumpStart",
    reason:
      "Hugging Face や各種オープンモデルを SageMaker 上の専用インスタンスへ展開し、Fine-Tuning やネットワーク設定を柔軟に制御できます。",
  },
  {
    keyword: "開発工数を抑えて社内検索チャットを即時導入（Q Business） / 開発者のコーディング支援（Q Developer）",
    category: "生成 AI アシスタント",
    recommended: "Amazon Q Business / Amazon Q Developer",
    reason:
      "Amazon Q Business は既存認証と連携する業務チャットをノーコード導入でき、Amazon Q Developer は IDE 等でコード生成・移行を支援します。",
  },
  {
    keyword: "スキャンした PDF 請求書や申込書から、文字だけでなく表やキーバリューペアを抽出",
    category: "AWS AI サービス",
    recommended: "Amazon Textract（画像/動画分析は Amazon Rekognition）",
    reason:
      "Textract は帳票のレイアウト・表・フォーム項目を構造化抽出し、Rekognition は画像・動画の物体・顔・不適切コンテンツを検出します。",
  },
  {
    keyword: "テキストの感情分析・PII 検出（Comprehend）、音声文字起こし（Transcribe）、音声合成（Polly）、翻訳（Translate）",
    category: "AWS AI サービス",
    recommended: "Amazon Comprehend / Transcribe / Polly / Translate",
    reason:
      "機械学習の専門知識やモデル学習なしで、自然言語処理・音声処理・ニューラル翻訳を API 呼び出しだけで組み込めます。",
  },
  {
    keyword: "事実ベースの FAQ やデータ抽出で揺らぎを抑え、決定的で再現性の高い出力を得たい",
    category: "推論パラメータ",
    recommended: "Temperature を 0 に近づける（Top-P / Top-K・Max Tokens 併用）",
    reason:
      "Temperature を下げるほど確率の高いトークンが選ばれ創造的逸脱が抑えられます。Max Tokens で過剰出力・課金も制御します。",
  },
  {
    keyword: "要約（ROUGE）・翻訳（BLEU）・意味類似度（BERTScore）や人間評価で複数 FM を定量比較",
    category: "モデル評価",
    recommended: "Amazon Bedrock Model Evaluation（ROUGE / BLEU / BERTScore）",
    reason:
      "自動評価指標（ROUGE/BLEU/BERTScore）や LLM-as-a-Judge・人手評価を組み合わせ、精度・毒性・コストの観点からモデルを選定します。",
  },
  {
    keyword: "大規模モデルの分散学習コスト最適化（Trainium） vs 高スループット低遅延推論（Inferentia）",
    category: "コンピュート",
    recommended: "AWS Trainium（学習） / AWS Inferentia（推論）",
    reason:
      "AWS が設計した専用アクセラレータ（Trn / Inf インスタンス）により、汎用 GPU 比で学習・推論それぞれのコストパフォーマンスを高めます。",
  },
  {
    keyword: "学習データやモデルの属性バイアス検出、および SHAP 値による判断理由の説明可能性可視化",
    category: "責任ある AI",
    recommended: "Amazon SageMaker Clarify",
    reason:
      "データとモデル予測のバイアス指標算出および SHAP 値による特徴量重要度分析を行い、公平性と説明可能性を担保します。",
  },
  {
    keyword: "AI 推論の信頼度が低い場合のみ人間が確認（A2I）し、AI 生成画像の電子透かしを検証",
    category: "責任ある AI",
    recommended: "Amazon A2I / ウォーターマーク検出（Service Cards で仕様確認）",
    reason:
      "Amazon Augmented AI (A2I) で Human-in-the-Loop を実装でき、Titan Image Generator 等のウォーターマーク検出で AI 生成物を識別できます。",
  },
  {
    keyword: "本番デプロイ後に発生する入力データ分布の変化（データドリフト）や精度劣化を継続監視",
    category: "ML 運用監視",
    recommended: "Amazon SageMaker Model Monitor",
    reason:
      "本番推論トラフィックの統計特性をベースラインと比較し、データドリフト・モデル品質低下・バイアス変化を自動アラートします。",
  },
  {
    keyword: "VPC 内からインターネットに出さず Bedrock へ接続し、RAG 用 S3 バケット内の PII を事前検出",
    category: "セキュリティ",
    recommended: "AWS PrivateLink ＋ Amazon Macie ＋ AWS KMS",
    reason:
      "PrivateLink で閉域接続し、Macie で S3 内の機密 PII 混入を防ぎ、KMS（CMK）で保管データ・ベクトルを暗号化します。",
  },
  {
    keyword: "Bedrock の管理 API 操作監査（CloudTrail）と、推論プロンプト/応答の記録（モデル呼び出しログ）",
    category: "監査・ログ",
    recommended: "AWS CloudTrail ＋ Bedrock モデル呼び出しログ（非学習原則）",
    reason:
      "Bedrock は顧客データをベースモデル学習に使わない設計であり、操作監査には CloudTrail、推論内容の証跡保存にはモデル呼び出しログを有効化します。",
  },
  {
    keyword: "学習データからモデルまでの系譜追跡（Lineage）と AWS 第三者コンプライアンス認証レポート取得",
    category: "ガバナンス",
    recommended: "SageMaker ML Lineage Tracking / AWS Artifact / AWS Config",
    reason:
      "ML Lineage Tracking でモデル再現性を保証し、AWS Config で構成準拠を評価、AWS Artifact から SOC/ISO 等の監査文書を入手します。",
  },
];

export const aifPracticeQuestions: SaaQuestion[] = [
  {
    id: "aif-q1",
    domainId: "aif-domain-1",
    domainLabel: "Domain 1: AI および ML の基礎",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "ある EC 事業者は、過去の購買履歴データ（購入金額・頻度・カテゴリ等）をもとに、事前に定義された正解ラベルがない状態で、行動パターンの似た顧客グループを自動的に見つけ出したいと考えています。このタスクに最も適した機械学習のアプローチはどれですか？",
    options: [
      "教師あり学習（回帰）",
      "教師なし学習（クラスタリング）",
      "強化学習",
      "指示ベースファインチューニング",
    ],
    correctIndices: [1],
    explanation:
      "正解ラベルを持たないデータから類似グループ（セグメント）を自動発見するタスクは、教師なし学習の代表的な手法であるクラスタリングに該当します。教師あり学習はラベル付きデータが必要です。",
    keywords: ["教師なし学習", "クラスタリング", "ML パラダイム"],
  },
  {
    id: "aif-q2",
    domainId: "aif-domain-1",
    domainLabel: "Domain 1: AI および ML の基礎",
    difficulty: "標準",
    selectCount: 1,
    question:
      "ある組織は、取引先から PDF やスキャン画像形式で送られてくる請求書から「単なる文字データだけでなく、明細テーブル（表）の構造や金額・請求日のキーバリューペア」を自動で抽出したいと考えています。独自の機械学習モデルを学習せずに実装できる最適な AWS サービスはどれですか？",
    options: [
      "Amazon Rekognition",
      "Amazon Textract",
      "Amazon Polly",
      "Amazon Personalize",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Textract はスキャンされたドキュメントや PDF からテキストだけでなく、フォーム（キーバリューペア）や表（テーブル）構造を高精度に自動抽出するマネージド OCR/文書分析サービスです。",
    keywords: ["Amazon Textract", "帳票構造抽出", "AWS AI サービス"],
  },
  {
    id: "aif-q3",
    domainId: "aif-domain-1",
    domainLabel: "Domain 1: AI および ML の基礎",
    difficulty: "標準",
    selectCount: 1,
    question:
      "医療画像診断の支援モデルを評価する際、コストや後続検査の観点から「実際には疾患がある（陽性）患者を誤って陰性と判定してしまう見逃し（偽陰性：False Negative）」をできる限り減らすことが最優先とされています。混同行列に基づく評価指標のうち、この要件で最も重視すべき指標はどれですか？",
    options: [
      "適合率（Precision）",
      "再現率（Recall）",
      "決定係数（R2）",
      "平均二乗誤差平方根（RMSE）",
    ],
    correctIndices: [1],
    explanation:
      "再現率（Recall = TP / (TP + FN)）は「実際に陽性であるデータのうち、モデルが正しく陽性と検出できた割合」を示し、偽陰性（見逃し）を最小化したい医療スクリーニングや不正検知で最優先されます。Precision は偽陽性抑制、RMSE/R2 は回帰指標です。",
    keywords: ["再現率 (Recall)", "混同行列", "ML 評価指標"],
  },
  {
    id: "aif-q4",
    domainId: "aif-domain-2",
    domainLabel: "Domain 2: 生成 AI の基礎",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "大規模言語モデル（LLM）を活用した社内問い合わせシステムにおいて、実際には存在しない社内規程の条文番号や架空の参照元を、モデルが自信満々にもっともらしい文章で回答してしまう現象が発生しました。生成 AI 特有のこの課題は何と呼ばれますか？",
    options: [
      "過学習（Overfitting）",
      "データドリフト（Data Drift）",
      "ハルシネーション（Hallucination）",
      "次元削減（Dimensionality Reduction）",
    ],
    correctIndices: [2],
    explanation:
      "生成 AI が事実やコンテキストに基づかない誤った情報をもっともらしく生成する現象はハルシネーション（幻覚）と呼ばれます。RAG による根拠注入や Bedrock Guardrails のコンテキストグラウンディングチェック等で緩和します。",
    keywords: ["ハルシネーション", "LLM の限界", "RAG"],
  },
  {
    id: "aif-q5",
    domainId: "aif-domain-2",
    domainLabel: "Domain 2: 生成 AI の基礎",
    difficulty: "標準",
    selectCount: 1,
    question:
      "ある企業は、独自の GPU クラスターや推論サーバーのインフラを運用管理することなく、単一のマネージド API 経由で Anthropic Claude、Amazon Nova、Meta Llama などの複数の基盤モデルを比較・切り替えながら生成 AI アプリケーションを構築したいと考えています。最も適した AWS サービスはどれですか？",
    options: [
      "Amazon Bedrock",
      "Amazon EC2（P5 インスタンスの手動管理）",
      "Amazon Transcribe",
      "AWS Trainium",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Bedrock は主要 AI 企業の多様な基盤モデルをサーバーレスの統合 API で提供し、インフラ構築・管理なしでモデルの比較・切り替え・RAG 統合・ガードレール適用を行えるフルマネージドサービスです。",
    keywords: ["Amazon Bedrock", "サーバーレス API", "複数基盤モデル"],
  },
  {
    id: "aif-q6",
    domainId: "aif-domain-2",
    domainLabel: "Domain 2: 生成 AI の基礎",
    difficulty: "標準",
    selectCount: 1,
    question:
      "ある開発組織では、ソフトウェアエンジニアが IDE 上でコーディング中のコード提案・単体テスト作成・セキュリティ脆弱性スキャン・古い言語バージョンのアップグレード支援を受けられる生成 AI アシスタントを導入したいと考えています。最適な AWS サービスはどれですか？",
    options: [
      "Amazon Q Business",
      "Amazon Q Developer",
      "Amazon Comprehend",
      "Amazon Kendra",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Q Developer は IDE や AWS マネジメントコンソール、CLI と統合してコード生成・レビュー・テスト作成・コード変換を支援する開発者向け生成 AI アシスタントです。Amazon Q Business は社内文書連携の業務チャット向けです。",
    keywords: ["Amazon Q Developer", "コーディング支援", "生成 AI アシスタント"],
  },
  {
    id: "aif-q7",
    domainId: "aif-domain-2",
    domainLabel: "Domain 2: 生成 AI の基礎",
    difficulty: "標準",
    selectCount: 2,
    question:
      "生成 AI（基盤モデル / LLM）の特性およびビジネスシステムへの適用判断に関する説明として、正しいものを【2つ】選んでください。",
    options: [
      "基盤モデルは確率的に次トークンを生成するため非決定性があり、同一プロンプトでも出力が変化し得る",
      "表形式の数値予測や厳密な計算ルールに基づく給与計算など、あらゆる問題で従来の機械学習や決定論的プログラムより生成 AI の方が低コストかつ正確である",
      "Transformer アーキテクチャの Self-Attention 機構により、文脈内のトークン間の関連性を並列処理して長文脈を捉えられる",
      "Amazon Bedrock を利用すると、入力トークン数やモデルサイズに関わらず 1 リクエストあたりの料金は常に完全固定となる",
      "生成 AI は事前学習時点以降に発生した最新の社内情報も、外部検索や学習なしで常に正確に回答できる",
    ],
    correctIndices: [0, 2],
    explanation:
      "基盤モデルは確率的生成に基づく非決定性を持ち、Transformer の Self-Attention により長文脈の関連性を捉えます。一方、表形式予測や確定ルールには従来 ML や従来プログラムの方が適する場合があり、オンデマンド課金はトークン量とモデルに依存し、最新知識には RAG 等が必要です。",
    keywords: ["Transformer", "非決定性", "生成 AI 適用判断"],
  },
  {
    id: "aif-q8",
    domainId: "aif-domain-3",
    domainLabel: "Domain 3: 基盤モデルのアプリケーション",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "ある企業は、毎週改訂される製品仕様書や社内 FAQ（Amazon S3 に保存）の内容に基づいて社内チャットボットに回答させたいと考えています。モデルの再学習を行わず、最新ドキュメントの反映と回答根拠（出典）の提示を最も運用負荷少なく実現する方法はどれですか？",
    options: [
      "毎週新しい仕様書を使って基盤モデルを最初から事前学習し直す",
      "Knowledge Bases for Amazon Bedrock を用いた RAG（検索拡張生成）を構成する",
      "プロンプトの Temperature パラメータを最大値（1.0）に設定する",
      "AWS Trainium インスタンスで独自の拡散モデルを学習する",
    ],
    correctIndices: [1],
    explanation:
      "Knowledge Bases for Amazon Bedrock による RAG を構築すると、S3 上の最新ドキュメントのチャンク分割・埋め込み化・ベクトル検索（OpenSearch Serverless 等）と出典（Citation）付き回答生成をモデル再学習なしで自動化できます。",
    keywords: ["RAG", "Bedrock Knowledge Bases", "出典提示"],
  },
  {
    id: "aif-q9",
    domainId: "aif-domain-3",
    domainLabel: "Domain 3: 基盤モデルのアプリケーション",
    difficulty: "標準",
    selectCount: 1,
    question:
      "法務契約書の条項抽出や事実確認の QA アプリケーションにおいて、基盤モデルの創造的な表現や回答のばらつきを最小限に抑え、最も確率の高い決定的・一貫性のある出力を得たい場合、推論パラメータをどのように調整すべきですか？",
    options: [
      "Temperature を 0 に近づける（低めに設定する）",
      "Temperature を最大値（1.0）に引き上げる",
      "Top-K を無制限に拡大しランダムサンプリングを強める",
      "Negative Prompt にすべての名詞を追加する",
    ],
    correctIndices: [0],
    explanation:
      "Temperature は次トークン選択の確率分布の鋭さを制御します。0 に近づけるほど最も確率の高いトークンが優先されて決定的・事実重視の安定した出力になり、高くするほど多様で創造的な出力になります。",
    keywords: ["Temperature", "推論パラメータ", "決定的出力"],
  },
  {
    id: "aif-q10",
    domainId: "aif-domain-3",
    domainLabel: "Domain 3: 基盤モデルのアプリケーション",
    difficulty: "標準",
    selectCount: 1,
    question:
      "基盤モデルの重みを更新する追加学習コストをかけずに、複雑な多段階の論理推論や業務条件の判定における回答精度を向上させるため、プロンプト上で「結論を出す前に思考プロセスをステップごとに書き出す」よう指示し、あわせて数個の思考例を提示しました。この組み合わせに該当する手法はどれですか？",
    options: [
      "RLHF と 継続的事前学習",
      "Chain-of-Thought（思考の連鎖）と Few-shot プロンプティング",
      "ROUGE と BLEU スコアリング",
      "Provisioned Throughput と Batch Inference",
    ],
    correctIndices: [1],
    explanation:
      "数個の入出力例を提示するのが Few-shot プロンプティング、段階的な推論過程を出力させる手法が Chain-of-Thought（CoT）プロンプティングです。モデル重みを変えずに論理推論精度を向上できます。",
    keywords: ["Chain-of-Thought", "Few-shot", "プロンプトエンジニアリング"],
  },
  {
    id: "aif-q11",
    domainId: "aif-domain-3",
    domainLabel: "Domain 3: 基盤モデルのアプリケーション",
    difficulty: "応用",
    selectCount: 1,
    question:
      "ある EC プラットフォームは、顧客の「注文商品の配送状況を調べて、遅延していれば再配送手配を登録してほしい」という自然言語の依頼に対し、LLM が自律的に手順を計画し、社内知識の参照と既存の注文管理 API（AWS Lambda 経由）の実行を連携して完了するシステムを構築したいと考えています。最適な Amazon Bedrock の機能はどれですか？",
    options: [
      "Agents for Amazon Bedrock（Action Groups ＋ Knowledge Bases 連携）",
      "Amazon Bedrock Batch Inference",
      "Amazon SageMaker Clarify",
      "Amazon Polly",
    ],
    correctIndices: [0],
    explanation:
      "Agents for Amazon Bedrock は、ユーザー目標を達成するために推論ステップ（オーケストレーション）を自動分解し、Knowledge Bases の検索や AWS Lambda 関数として実装された Action Groups（外部 API/DB 操作）を自律呼び出しします。",
    keywords: ["Bedrock Agents", "Action Groups", "AWS Lambda"],
  },
  {
    id: "aif-q12",
    domainId: "aif-domain-3",
    domainLabel: "Domain 3: 基盤モデルのアプリケーション",
    difficulty: "応用",
    selectCount: 1,
    question:
      "ある研究チームは、英語および日本語の長文技術ドキュメントに対する基盤モデルの「自動要約（Summarization）」品質を評価するにあたり、モデルの生成した要約文と人間が作成した参照要約文との間で、N-gram の再現率中心の一致度を自動計測したいと考えています。最も代表的な評価指標はどれですか？",
    options: [
      "ROUGE（Recall-Oriented Understudy for Gisting Evaluation）",
      "RMSE（Root Mean Squared Error）",
      "K-Means シルエット係数",
      "SHAP 値",
    ],
    correctIndices: [0],
    explanation:
      "ROUGE（ROUGE-1 / ROUGE-2 / ROUGE-L 等）は自動要約タスクの標準的な評価指標であり、参照テキストとの N-gram 重複（再現率重視）を測定します。なお機械翻訳では適合率重視の BLEU、意味類似度では BERTScore がよく使われます。",
    keywords: ["ROUGE", "モデル評価指標", "要約評価"],
  },
  {
    id: "aif-q13",
    domainId: "aif-domain-4",
    domainLabel: "Domain 4: 責任ある AI のガイドライン",
    difficulty: "標準",
    selectCount: 1,
    question:
      "ある企業は、Amazon Bedrock 上で複数の基盤モデルを切り替えて利用する社内生成 AI アプリにおいて、モデルの種類に関わらず一貫して「投資助言に関する質問の拒否（Denied Topics）」「電話番号やクレジットカード番号などの PII 自動マスキング」「RAG 回答が参照文書に根拠を持たない場合のハルシネーション検知」を適用したいと考えています。最適な機能はどれですか？",
    options: [
      "Amazon Bedrock Guardrails",
      "Amazon SageMaker Feature Store",
      "AWS Glue Data Catalog",
      "Amazon Translate",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Bedrock Guardrails は複数 FM 共通の安全レイヤーとして機能し、有害コンテンツフィルタ、拒否トピック（Denied Topics）、禁止語句、PII マスキング/ブロック、プロンプト攻撃防御、コンテキストグラウンディングチェックを提供します。",
    keywords: ["Bedrock Guardrails", "責任ある AI", "PII マスキング"],
  },
  {
    id: "aif-q14",
    domainId: "aif-domain-4",
    domainLabel: "Domain 4: 責任ある AI のガイドライン",
    difficulty: "応用",
    selectCount: 1,
    question:
      "金融与信審査を行う機械学習システムにおいて、監査部門から「学習データやモデル予測に年齢・性別などの属性によるバイアス（偏り）が含まれていないか定量検証すること」および「個々の審査結果に対してどの入力特徴量がどれだけ影響したかを SHAP 値で説明できること」が求められました。最適な AWS サービスはどれですか？",
    options: [
      "Amazon SageMaker Clarify",
      "Amazon Lex",
      "AWS Artifact",
      "Amazon Transcribe",
    ],
    correctIndices: [0],
    explanation:
      "Amazon SageMaker Clarify は、学習前後のデータ・モデルにおける潜在的バイアスの検出と、SHAP（SHapley Additive exPlanations）値を用いた特徴量重要度の可視化によるモデル説明可能性（Explainability）を提供します。",
    keywords: ["SageMaker Clarify", "SHAP 値", "バイアスと説明可能性"],
  },
  {
    id: "aif-q15",
    domainId: "aif-domain-5",
    domainLabel: "Domain 5: AI ソリューションのセキュリティ、コンプライアンス、ガバナンス",
    difficulty: "標準",
    selectCount: 1,
    question:
      "機密性の高い顧客問い合わせを扱う企業が Amazon Bedrock の導入を検討しています。「VPC 内のアプリケーションからパブリックインターネットを経由せずに Bedrock API を呼び出す」「プロンプトや出力がベースモデルの再学習に使われない」「保管データを顧客管理の暗号化キーで保護する」要件を満たす構成として正しいものはどれですか？",
    options: [
      "AWS PrivateLink（Interface VPC エンドポイント）と AWS KMS（CMK）を使用し、Bedrock のデータ非学習・非共有仕様を活用する",
      "パブリックサブネットに NAT ゲートウェイを配置し、インターネット経由で Bedrock へ接続する",
      "Bedrock のプロンプトはすべてサードパーティのモデル提供元がベースモデル再学習に自動利用するため、API 利用を諦めてオンプレミスに限定する",
      "S3 バケットをパブリック読み取り可能に設定し、署名なし URL で学習データを渡す",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Bedrock では顧客のプロンプト・出力・カスタムデータはベースモデルの再学習に使用されずモデルプロバイダとも共有されません。さらに AWS PrivateLink で VPC 内からインターネット非経由で接続し、AWS KMS（CMK）で暗号化統制が可能です。",
    keywords: ["AWS PrivateLink", "AWS KMS", "Bedrock データ非学習"],
  },
  {
    id: "aif-q16",
    domainId: "aif-domain-5",
    domainLabel: "Domain 5: AI ソリューションのセキュリティ、コンプライアンス、ガバナンス",
    difficulty: "応用",
    selectCount: 2,
    question:
      "規制産業の企業が AWS 上で RAG および生成 AI システムを運用するにあたり、「RAG 用データソース（Amazon S3）内に意図せず混入した個人情報（PII）を自動検出・分類すること」と「すべての基盤モデル推論リクエスト（プロンプトおよび応答メタデータ）を監査証跡として S3 や CloudWatch Logs へ自動記録すること」を実装したいと考えています。適切な AWS 機能・サービスの組み合わせを【2つ】選んでください。",
    options: [
      "Amazon Macie を有効化し、S3 バケット内の機密データや個人情報（PII）を自動検出・監視する",
      "Amazon Bedrock のモデル呼び出しログ（Model Invocation Logging）を有効化し、推論リクエストと応答を S3 / CloudWatch Logs へ記録する",
      "AWS Pricing Calculator を使用して、S3 バケット内の PII 混入率をリアルタイムにブロックする",
      "Amazon Polly を使用して、すべての監査ログを音声ファイルに変換して保存する",
      "Amazon Lightsail を使用して、Bedrock の責任共有モデル境界を自動変更する",
    ],
    correctIndices: [0, 1],
    explanation:
      "S3 バケット内の個人情報（PII）や機密データの自動発見には Amazon Macie を使用し、Amazon Bedrock へのプロンプト入力・応答出力の監査ログ記録にはモデル呼び出しログ（Model Invocation Logging）を使用します（管理 API 操作の監査は AWS CloudTrail を併用）。",
    keywords: ["Amazon Macie", "Bedrock モデル呼び出しログ", "監査・ガバナンス"],
  },
];

export const aifArchitecturePatterns: SaaArchitecturePattern[] = [
  {
    id: "aif-pat-rag-bedrock",
    title: "Amazon Bedrock Knowledge Bases セキュア RAG 構成",
    badge: "RAG 標準",
    flow: [
      "Amazon S3 (文書 + Macie)",
      "Titan Embeddings",
      "OpenSearch Serverless / Aurora pgvector",
      "Bedrock Knowledge Bases",
      "Bedrock Guardrails",
    ],
    summary:
      "社内ドキュメントを S3 に保管し、Macie で PII 検査・KMS 暗号化を行ったうえで、Knowledge Bases と Guardrails を介して出典付き・安全統制済みの回答を提供する標準 RAG アーキテクチャ。",
    keyDesignPoints: [
      "AWS PrivateLink により VPC 内からの Bedrock 呼び出しとベクトルストア通信をインターネット非経由で閉域化",
      "Guardrails のコンテキストグラウンディングチェックにより、検索文書に根拠のないハルシネーション応答を抑制",
    ],
  },
  {
    id: "aif-pat-bedrock-agents",
    title: "Agents for Amazon Bedrock 自律タスク実行構成",
    badge: "エージェント",
    flow: [
      "ユーザー自然言語入力",
      "Bedrock Agents (計画・分解)",
      "Knowledge Bases (検索)",
      "AWS Lambda (Action Groups)",
      "社内 API / DynamoDB",
    ],
    summary:
      "LLM がユーザーの要望を達成するための手順を自律的に計画し、ナレッジ検索と Lambda 経由の外部システム実行（注文確認・チケット起票等）を連携させる構成。",
    keyDesignPoints: [
      "各 Action Group の API スキーマを明確に定義し、Lambda 実行ロールには最小権限の IAM ポリシーのみを付与",
      "重要操作の前後や信頼度低下時には Amazon A2I 等で人間による承認（Human-in-the-Loop）を組み合わせ可能",
    ],
  },
  {
    id: "aif-pat-managed-pipeline",
    title: "マネージド AI サービス連携・マルチモーダル文書/音声処理",
    badge: "学習不要 API",
    flow: [
      "Amazon S3 (PDF / 音声 / 画像)",
      "Textract / Transcribe / Rekognition",
      "Comprehend (感情・PII 検出)",
      "Amazon Translate",
      "Amazon A2I (低信頼確認)",
    ],
    summary:
      "カスタムモデルの学習や GPU 管理を行わず、タスク特化型の AWS AI マネージドサービスを組み合わせて帳票抽出・文字起こし・翻訳・PII 検出を自動化する構成。",
    keyDesignPoints: [
      "定型的な文書 OCR や音声テキスト化・感情分析に専用 AI サービスを使うことで、汎用 LLM より高速・低コストに処理可能",
      "Textract や Rekognition の抽出信頼度がしきい値を下回ったデータだけ Amazon A2I で人手レビューへ回す設計が有効",
    ],
  },
  {
    id: "aif-pat-sagemaker-gov",
    title: "SageMaker カスタム ML ＆ 責任ある AI ガバナンス構成",
    badge: "ガバナンス・監査",
    flow: [
      "S3 (KMS 暗号化)",
      "SageMaker Clarify / JumpStart",
      "ML Lineage Tracking",
      "Model Monitor (ドリフト検知)",
      "CloudTrail + Model Invocation Logs",
    ],
    summary:
      "モデル学習から本番監視までのバイアス検査・説明可能性（SHAP）・来歴追跡・操作監査を一貫統合したエンタープライズ向け AI ガバナンス構成。",
    keyDesignPoints: [
      "SageMaker Clarify で学習前後バイアスと SHAP 特徴量寄与度を検証し、本番稼働後は Model Monitor でデータドリフトを継続監視",
      "CloudTrail で管理 API 操作、Bedrock モデル呼び出しログで推論入出力、AWS Config / Artifact で準拠証跡を保全",
    ],
  },
];

export const aifPitfalls: SaaPitfall[] = [
  {
    id: "aif-pit-rag-vs-finetune",
    trap: "最新の社内規定や毎日更新される商品情報を答えさせるために、RAG ではなく Fine-Tuning だけで解決しようとする",
    whyWrong:
      "Fine-Tuning は出力形式（JSON 等）や専門トーン・タスクの振る舞い定着に適しており、頻繁に更新される知識の参照や出典（Citation）提示には向かず再学習コストも高くなります。",
    correctApproach:
      "最新・非公開知識の参照と出典提示には「RAG（Amazon Bedrock Knowledge Bases）」、応答スタイルや形式の調整には「Fine-Tuning」、両方必要なら併用します。",
  },
  {
    id: "aif-pit-bedrock-privacy",
    trap: "Amazon Bedrock に入力したプロンプトや出力データは、AWS やモデル提供元のベースモデルの再学習に自動で流用されると思う",
    whyWrong:
      "Amazon Bedrock のデータプライバシー設計では、顧客のプロンプト・補完応答・カスタマイズデータはベースモデルの学習に使われず、サードパーティプロバイダへも共有されません。",
    correctApproach:
      "その上で企業ポリシーに応じて AWS KMS（CMK）暗号化、AWS PrivateLink 閉域接続、IAM 最小権限、Amazon Macie による PII 事前検知を組み合わせます。",
  },
  {
    id: "aif-pit-temp-factual",
    trap: "正確な契約条項抽出や事実ベースの RAG 応答システムで、Temperature や Top-P を高い値に設定してしまう",
    whyWrong:
      "Temperature や Top-P を高くすると確率の低いトークンも選ばれやすくなり、出力のランダム性が増して事実と異なる表現やハルシネーションリスクが高まります。",
    correctApproach:
      "事実重視・抽出・分類タスクでは Temperature を 0 に近づけて決定的な出力にし、ブレインストーミング等の創造的タスクでのみ高めに調整します（通常 Temperature と Top-P の片方のみ調整）。",
  },
  {
    id: "aif-pit-genai-overkill",
    trap: "単純な四則演算・確定的な業務ルール判定や表形式データの数値回帰まで、すべて大規模 LLM で処理しようとする",
    whyWrong:
      "確定ロジックや表形式数値予測に LLM を使うと、計算コスト・レイテンシ増大に加え、非決定性による計算ミスや解釈可能性低下を招きます。",
    correctApproach:
      "確定ルールは従来プログラム、表形式の分類・回帰は従来の教師あり ML（Amazon SageMaker）、帳票 OCR や音声認識はマネージド AI（Textract/Transcribe）、非構造化言語生成・要約に LLM を適材適所で使い分けます。",
  },
  {
    id: "aif-pit-eval-metrics",
    trap: "要約品質を BLEU だけで測ったり、疾患・不正の見逃し防止（偽陰性回避）が最優先の分類タスクで Precision や Accuracy だけを見て判断する",
    whyWrong:
      "要約タスクの再現率重視指標は ROUGE、機械翻訳の適合率重視指標は BLEU、意味類似度は BERTScore です。また陽性見逃し防止には Recall が不可欠で、クラス不均衡データでは Accuracy だけでは誤判断します。",
    correctApproach:
      "タスクに応じて ROUGE（要約）/ BLEU（翻訳）/ BERTScore（意味類似度）/ Perplexity と、分類指標（Precision vs Recall vs F1）を正しく選定します。",
  },
  {
    id: "aif-pit-guardrails-security",
    trap: "VPC 内の機密ワークロードからパブリック通信のまま Bedrock を呼び出し、PII マスキングや RAG 用 S3 バケット検査を行わずに公開する",
    whyWrong:
      "閉域網要件下でのインターネット経由通信や、プロンプト攻撃・PII 出力・S3 内機密データ混入の放置は、セキュリティおよび責任ある AI ガバナンス違反につながります。",
    correctApproach:
      "AWS PrivateLink で閉域接続し、Amazon Macie で S3 内の PII を検出・保護、Bedrock Guardrails で有害表現・禁止トピック・PII 出力・RAG グラウンディングを自動統制します。",
  },
];

export const aifKeyLimits: SaaLimitFact[] = [
  {
    id: "aif-lim-params",
    service: "FM 推論パラメータ（Temperature / Top-P / Top-K / Max Tokens）",
    limitValue: "Temperature 0.0〜1.0 / Top-P 0〜1",
    detail:
      "Temperature を 0 に近づけると決定的・事実重視になり、高めると多様性が増します。Top-P（Nucleus Sampling）は累積確率、Top-K は上位 K トークンに絞り、Max Tokens で最大出力長を制御します。",
  },
  {
    id: "aif-lim-bedrock-privacy",
    service: "Amazon Bedrock データプライバシー（データ非学習）",
    limitValue: "ベースモデル学習への利用なし・非共有",
    detail:
      "入力プロンプト・推論応答・カスタマイズ用データはベースモデルの再学習に使用されずモデルプロバイダへも共有されません。KMS（CMK）と PrivateLink で暗号化・閉域化できます。",
  },
  {
    id: "aif-lim-bedrock-pricing",
    service: "Amazon Bedrock 推論課金モデル（On-Demand / Provisioned / Batch）",
    limitValue: "従量トークン / 時間課金スループット保証 / 非同期バッチ",
    detail:
      "On-Demand はトークン単位課金、Provisioned Throughput は安定高負荷やカスタムモデル推論に必須、Batch Inference は S3 大量データの一括処理でコストを低減します。",
  },
  {
    id: "aif-lim-eval-metrics",
    service: "生成 AI 自動評価指標（ROUGE / BLEU / BERTScore / Perplexity）",
    limitValue: "タスク別定量的評価（Bedrock Model Evaluation）",
    detail:
      "ROUGE（要約の N-gram 一致）、BLEU（翻訳の精度重視）、BERTScore（埋め込みによる意味類似度）、Perplexity（予測不確実性・低いほど良）を人手評価や LLM-as-a-Judge と併用します。",
  },
  {
    id: "aif-lim-responsible-ai",
    service: "AWS 責任あるAI（Responsible AI）の中核次元",
    limitValue: "8 つの主要原則（Fairness 〜 Transparency）",
    detail:
      "公平性・説明可能性・プライバシーとセキュリティ・安全性・制御可能性・真実性と堅牢性・ガバナンス・透明性の 8 次元で評価し、Bedrock Guardrails・SageMaker Clarify・AWS AI Service Cards 等で実践します。",
  },
  {
    id: "aif-lim-ai-stack",
    service: "AWS AI/ML スタック選定基準（3 層構造）",
    limitValue: "AI サービス / Amazon Bedrock / Amazon SageMaker",
    detail:
      "最上層: 学習不要 API（Rekognition・Comprehend・Textract 等）や Amazon Q。中間層: サーバーレス FM API（Bedrock）。基盤層: 独自学習・OSS 制御（SageMaker / JumpStart・Trainium / Inferentia）。",
  },
];

export const aifOfficialResources: SaaOfficialResource[] = [
  {
    title: "AWS Certified AI Practitioner 公式試験ページ",
    description: "AIF-C01 の試験概要、最新の試験ガイド（PDF）、サンプル問題、受験予約の公式ページ。",
    url: "https://aws.amazon.com/jp/certification/certified-ai-practitioner/",
    badge: "AWS公式",
  },
  {
    title: "AWS Skill Builder (公式デジタル学習プラットフォーム)",
    description: "AIF-C01 対応の生成 AI 基礎コースや公式練習問題セット（Official Practice Question Set）を提供。",
    url: "https://explore.skillbuilder.aws/learn",
    badge: "無料講座あり",
  },
  {
    title: "Amazon Bedrock 公式サービスページ",
    description: "基盤モデルの選択、Knowledge Bases（RAG）、Agents、Guardrails、料金・プライバシー仕様の公式案内。",
    url: "https://aws.amazon.com/jp/bedrock/",
    badge: "生成 AI 中核",
  },
  {
    title: "AWS 責任ある AI（Responsible AI）公式ページ",
    description: "AWS が定義する責任ある AI の 8 つの主要次元、AWS AI Service Cards、関連ガバナンスツールの解説。",
    url: "https://aws.amazon.com/jp/ai/responsible-ai/",
    badge: "頻出ガイドライン",
  },
];

const AIF_SERVICE_QUERY_ALIASES: Record<string, string> = {
  "基盤モデル (FM)": "基盤モデル",
  "トークンとチャンク": "トークン",
  "Top-P / Top-K": "Top-P",
  "Bedrock Knowledge Bases": "Knowledge Bases",
  "Bedrock Agents": "Bedrock Agents",
  "Bedrock Model Evaluation": "Bedrock Model Evaluation",
  "ROUGE / BLEU / BERTScore": "ROUGE",
  "Bedrock Guardrails": "Guardrails",
  "Amazon A2I": "A2I",
  "AWS AI Service Cards": "Service Cards",
  "バイアスとデータドリフト": "データドリフト",
  "Bedrock データ非学習": "データ非学習",
  "Bedrock モデル呼び出しログ": "モデル呼び出しログ",
  "SageMaker ML Lineage Tracking": "ML Lineage Tracking",
  "責任ある AI": "責任ある AI",
};

/** 5ドメイン内のサービスバッジ名を、比較表・逆引き検索にヒットする正規化クエリへ変換する */
export function resolveAifServiceQuery(serviceName: string): string {
  const mapped = AIF_SERVICE_QUERY_ALIASES[serviceName];
  if (mapped) return mapped;
  return serviceName.replace(/^(Amazon|AWS)\s+/i, "").trim();
}
