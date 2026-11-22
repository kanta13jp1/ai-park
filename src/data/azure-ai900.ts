// 出典: Microsoft Learn Exam AI-900 公式試験ガイド (Study guide for Exam AI-900)
import type {
  CertExamFact,
  CertFlashcardItem,
  CertQuestion,
} from "@/components/certification/types";
import type {
  AzureDomain,
  AzureComparisonTable,
  AzureArchitecturePattern,
  AzurePitfall,
  AzureKeyFact,
  AzureOfficialResource,
} from "./azure-types";

export const ai900ExamFacts: CertExamFact[] = [
  { label: "対象試験", value: "Exam AI-900", detail: "Azure AI Fundamentals・ML/開発経験不要" },
  { label: "試験時間", value: "45 分", detail: "着席目安 65 分・全体案内含む" },
  { label: "合格スコア", value: "700 / 1000", detail: "スケールスコア 100〜1000 点" },
  { label: "有効期限", value: "無期限（更新不要）", detail: "Fundamentals 資格は失効しない" },
  { label: "受験形式", value: "Pearson VUE", detail: "テストセンター / オンライン監督試験" },
  { label: "試験形式", value: "選択・分類問題", detail: "ドラッグ＆ドロップ・複数選択等" },
];

export const ai900Domains: AzureDomain[] = [
  {
    id: "ai900-domain-1",
    number: "01",
    title: "AI ワークロードと考慮事項",
    englishTitle: "Describe Artificial Intelligence workloads and considerations",
    weight: "15〜20%",
    accentColor: "indigo",
    summary:
      "代表的な 6 種類の AI ワークロード（異常検出・ビジョン・NLP・ナレッジマイニング・ドキュメントインテリジェンス・生成 AI）の特徴と、Microsoft が掲げる責任ある AI（Responsible AI）の 6 原則を理解します。",
    topics: [
      {
        id: "ai900-1-1",
        code: "1.1",
        title: "AI ワークロードの種類と用途",
        services: [
          "Anomaly Detection",
          "Computer Vision",
          "NLP",
          "Knowledge Mining",
          "Document Intelligence",
          "Generative AI",
        ],
        keyPoints: [
          "異常検出（Anomaly Detection）は時系列データから通常のパターンを外れた兆候（不正取引・センサー故障・サーバー負荷スパイクなど）を自動検知する",
          "コンピューター ビジョンは画像・動画の内容理解（分類・物体検出・OCR）を扱い、自然言語処理（NLP）はテキスト・音声の意味解析・翻訳・会話理解を担う",
          "ナレッジマイニングは大量の非構造化データ（PDF・画像・文書）から情報を抽出して検索可能にし、ドキュメント インテリジェンスは領収書や帳票から構造化項目（キー・値ペア）を読み取る",
          "生成 AI（Generative AI）は自然言語の指示（プロンプト）に基づき、テキスト・画像・コードなどの新しいコンテンツを生成・要約する",
        ],
        examTip:
          "『大量の非構造化文書を横断検索＝ナレッジマイニング』『領収書や請求書の項目抽出＝ドキュメント インテリジェンス』『センサーの時系列外れ値検知＝異常検出』の切り分けが頻出。",
      },
      {
        id: "ai900-1-2",
        code: "1.2",
        title: "責任ある AI（Responsible AI）の 6 原則",
        services: [
          "公平性 (Fairness)",
          "信頼性と安全性",
          "プライバシーとセキュリティ",
          "包括性 (Inclusiveness)",
          "透明性・説明責任",
        ],
        keyPoints: [
          "公平性（Fairness）は性別・人種・年齢などの属性によるバイアスを排除しすべての人を公平に扱う原則。包括性（Inclusiveness）は視覚・聴覚・身体的な障がいを含む多様な利用者が恩恵を受けられる設計を目指す原則",
          "信頼性と安全性（Reliability and Safety）は予期しない入力やエッジケースでも安全に動作するよう厳格なテスト・検証を行う原則（医療・自動運転等で特に重要）",
          "プライバシーとセキュリティ（Privacy and Security）は学習データや推論入力の個人情報を保護し、アクセス制御・暗号化・法令遵守を徹底する原則",
          "透明性（Transparency）は AI 利用の明示や仕組み・限界の説明可能性を確保する原則、説明責任（Accountability）は開発者・組織が倫理規範とガバナンスに基づき AI の振る舞いに責任を持つ原則",
        ],
        examTip:
          "『バイアス排除で融資審査を差別しない＝公平性』『聴覚障がい者向けにリアルタイム字幕を提供＝包括性』『AI が根拠と限界を明示する＝透明性』『人間の監視体制と規約遵守＝説明責任』を明確に区別する。",
      },
    ],
  },
  {
    id: "ai900-domain-2",
    number: "02",
    title: "Azure における機械学習の基本原則",
    englishTitle: "Describe fundamental principles of machine learning on Azure",
    weight: "15〜20%",
    accentColor: "cyan",
    summary:
      "回帰・分類・クラスタリングの区別、特徴量・ラベル・データ分割・各種評価指標（RMSE/R²/Accuracy/Precision/Recall/F1/AUC）、および Azure Machine Learning の主要機能を学びます。",
    topics: [
      {
        id: "ai900-2-1",
        code: "2.1",
        title: "教師あり学習と教師なし学習の種別",
        services: ["回帰 (Regression)", "二項分類 / 多クラス分類", "クラスタリング (K-Means)"],
        keyPoints: [
          "教師あり学習は正解ラベル付きの過去データから入力と出力の関係を学習する手法で、代表的なタスクに「回帰」と「分類」がある",
          "回帰（Regression）は住宅価格・売上金額・気温など連続的な数値を予測する。分類（Classification）はスパム判定（二項分類）やペンギン種別判定（多クラス分類）など離散的なカテゴリを予測する",
          "教師なし学習は正解ラベルのないデータから構造やグループを見出す手法で、代表例のクラスタリング（K-Means 等）は顧客セグメンテーションなどに用いられる",
        ],
        examTip:
          "予測対象が『連続数値（価格・需要数）』なら回帰、『カテゴリ（Yes/No・A/B/C）』なら分類、そもそも『ラベルなしデータで似た特徴をグループ化』ならクラスタリング。",
      },
      {
        id: "ai900-2-2",
        code: "2.2",
        title: "ML のコア概念（特徴量・ラベル・分割）と評価指標",
        services: [
          "特徴量 / ラベル",
          "学習・検証データ分割",
          "MAE / RMSE / R²",
          "Precision / Recall / F1 / AUC",
        ],
        keyPoints: [
          "モデル入力の属性を特徴量（Features：x）、予測対象をラベル（Label：y）と呼ぶ。過学習（Overfitting）を防ぐため、学習データと検証（テスト）データに分割して未知データでの汎化性能を測る",
          "回帰の評価指標には MAE（平均絶対誤差）・RMSE（二乗平均平方根誤差：0 に近いほど良、大きな外れ値に敏感）・決定係数 R²（1 に近いほど当てはまりが良）を用いる",
          "分類の評価では混同行列（TP・FP・FN・TN）から Accuracy（正解率）・Precision（適合率：陽性予測のうち真の陽性割合）・Recall（再現率：実際の陽性を検出できた割合）・F1 スコア（適合率と再現率の調和平均）を算出する",
          "AUC（ROC 曲線下面積）は閾値に依存しない分類性能指標（0.5 がランダム、1.0 が完璧）。陽性が極端に少ない不均衡データでは Accuracy だけで判断してはならない",
        ],
        examTip:
          "『病気や不正検知で見逃し（FN）を減らしたい＝Recall 重視』『正常メールをスパムと誤判定（FP）したくない＝Precision 重視』『誤差の大きさを測る数値予測＝RMSE/R²』。",
      },
      {
        id: "ai900-2-3",
        code: "2.3",
        title: "Azure Machine Learning（AutoML・Designer・基盤資産）",
        services: [
          "Azure Machine Learning",
          "Automated ML",
          "Azure ML Designer",
          "Compute / Registry / Endpoint",
        ],
        keyPoints: [
          "Automated ML（AutoML）はデータセットと予測対象ラベル・評価指標を指定するだけで、最適なアルゴリズムとハイパーパラメータを自動探索・試行して高精度モデルを生成する",
          "Azure ML Designer はデータの前処理・分割・アルゴリズム学習・スコアリング・評価のモジュールをドラッグ＆ドロップで接続し、視覚的に ML パイプラインを構築できるキャンバス機能",
          "Azure ML ワークスペースは開発用 Compute Instance・分散学習用 Compute Cluster（自動スケール）・サーバーレス コンピューティング、データ資産（Data Assets）、モデル レジストリを一元管理する",
          "学習済みモデルはモデル レジストリに登録し、リアルタイム推論用のマネージド オンライン エンドポイントまたは大量データ一括推論用のバッチ エンドポイントとしてデプロイできる",
        ],
        examTip:
          "『コードを書かずに最適アルゴリズム選定まで自動化したい』＝ Automated ML、『視覚的なパイプラインをドラッグ＆ドロップで組みたい』＝ Azure ML Designer。",
      },
    ],
  },
  {
    id: "ai900-domain-3",
    number: "03",
    title: "Azure のコンピューター ビジョン ワークロード",
    englishTitle: "Describe features of computer vision workloads on Azure",
    weight: "15〜20%",
    accentColor: "emerald",
    summary:
      "画像分類・物体検出・セマンティック セグメンテーション・OCR などの画像解析タスクと、Azure AI Vision / Custom Vision / Azure AI Face / Document Intelligence の使い分けを学びます。",
    topics: [
      {
        id: "ai900-3-1",
        code: "3.1",
        title: "コンピューター ビジョンの主要タスク",
        services: [
          "画像分類",
          "物体検出 (Bounding Box)",
          "セマンティック セグメンテーション",
          "キャプション生成 / OCR",
        ],
        keyPoints: [
          "画像分類（Image Classification）は画像全体に対して 1 つまたは複数のカテゴリラベルを割り当てる（例：写っている果物がリンゴかミカンかを判定）",
          "物体検出（Object Detection）は画像内の複数の対象を識別し、それぞれの位置を境界ボックス（Bounding Box：座標・幅・高さ）とラベルで返す",
          "セマンティック セグメンテーション（Semantic Segmentation）はピクセル単位でクラスを分類し、境界ボックスではなく物体の正確な輪郭マスクを抽出する",
          "画像キャプション生成・タグ付けは画像の内容を説明する文章やキーワードを生成し、OCR（光学文字認識）は写真・看板・文書中の印刷文字や手書き文字をテキストとして抽出する",
        ],
        examTip:
          "『画像のラベルを 1 つ答える＝画像分類』『どこに何があるか四角い枠で示す＝物体検出』『道路と歩行者をピクセル単位で塗り分ける＝セマンティック セグメンテーション』。",
      },
      {
        id: "ai900-3-2",
        code: "3.2",
        title: "Azure AI Vision・Custom Vision・Azure AI Face",
        services: ["Azure AI Vision", "Azure AI Custom Vision", "Azure AI Face", "Limited Access"],
        keyPoints: [
          "Azure AI Vision は事前学習済みモデルを使い、画像のタグ付け・キャプション生成・スマートトリミング・物体検出・Read API による高精度 OCR（印刷/手書き）を即座に実行できる",
          "Azure AI Custom Vision は自社の画像データをアップロードしてラベル付けするだけで、独自の「画像分類」および「物体検出」モデルを学習・公開できる（エッジ向けエクスポートも可）",
          "Azure AI Face は画像内の顔を検出し境界ボックス・顔のランドマーク（目/鼻/口の位置）・顔の向き・マスクや眼鏡の有無を返す",
          "責任ある AI 方針により、Azure AI Face での感情推定や性別・年齢などの属性推測は廃止され、個人の特定・照合（顔認識/Verification/Identification）機能は Limited Access 申請・承認が必要",
        ],
        examTip:
          "『自社製品だけの良品・不良品画像を判定＝Custom Vision（画像分類）』『Azure AI Face で感情を分類できるか？＝できない（責任ある AI により廃止・制限）』。",
      },
      {
        id: "ai900-3-3",
        code: "3.3",
        title: "Azure AI Document Intelligence（旧 Form Recognizer）",
        services: [
          "Document Intelligence",
          "事前構築済み請求書/領収書モデル",
          "カスタムモデル",
          "レイアウト / Read",
        ],
        keyPoints: [
          "Azure AI Document Intelligence（旧 Azure Form Recognizer）は単なる文字読み取り（OCR）を超え、文書内のキー・値ペア（例：「合計金額」と「¥12,000」）、表構造、選択マーク（チェックボックス）を構造化データとして抽出する",
          "領収書・請求書・名刺・ID カード・医療保険証・税務書類（W-2 等）向けの事前構築済み（Prebuilt）モデルを備え、学習データなしで即座に利用できる",
          "自社特有のフォーマットを持つ申込書や点検票には、数枚〜のサンプル文書からレイアウトや項目を学習させるカスタムモデル（Template / Neural モデル）を作成する",
        ],
        examTip:
          "看板やスキャン画像から『純粋なテキストだけ』を取るなら Azure AI Vision (Read OCR)、請求書や領収書から『項目名と金額などの構造化データ』を抜くなら Document Intelligence。",
      },
    ],
  },
  {
    id: "ai900-domain-4",
    number: "04",
    title: "Azure の自然言語処理 (NLP) ワークロード",
    englishTitle: "Describe features of Natural Language Processing workloads on Azure",
    weight: "15〜20%",
    accentColor: "amber",
    summary:
      "Azure AI Language によるテキスト分析（感情分析・NER・PII・キーフレーズ・要約）、CLU と Question Answering による対話理解、Speech・Translator・Azure AI Search を習得します。",
    topics: [
      {
        id: "ai900-4-1",
        code: "4.1",
        title: "Azure AI Language のテキスト分析機能",
        services: [
          "Azure AI Language",
          "キーフレーズ抽出",
          "NER / PII 検出",
          "感情分析 / 要約 / 言語検出",
        ],
        keyPoints: [
          "言語検出（Language Detection）は入力テキストの主言語（ISO 639-1 コード等）と信頼度スコアを判定する。感情分析（Sentiment Analysis）はポジティブ・ニュートラル・ネガティブ・混在のスコアに加え、オピニオンマイニングで対象ごとの評価も抽出する",
          "キーフレーズ抽出（Key Phrase Extraction）は文書の主要な論点を示す語句を取り出し、固有表現認識（NER）は人名・地名・組織名・日時・数量などのカテゴリ付きエンティティとエンティティリンクを抽出する",
          "PII（個人を特定できる情報）検出は氏名・電話番号・住所・クレジットカード番号等を自動検出・墨消し（Redaction）してプライバシー保護を支援する",
          "テキスト要約（Summarization）は原文の重要文を抜き出す「抽出型要約（Extractive）」と、文意を保って新しい表現でまとめる「抽象型要約（Abstractive）」の両方を提供する",
        ],
        examTip:
          "『口コミが肯定か否定か＝感情分析』『記事の重要トピック単語＝キーフレーズ抽出』『人名や場所の分類＝NER』『電話番号等のマスク処理＝PII 検出』。",
      },
      {
        id: "ai900-4-2",
        code: "4.2",
        title: "会話言語理解 (CLU) と質問応答 (Question Answering)",
        services: [
          "CLU (会話言語理解)",
          "Question Answering",
          "発話 / インテント / エンティティ",
          "ナレッジベース",
        ],
        keyPoints: [
          "会話言語理解（CLU：旧 LUIS）はユーザーの発話（Utterance）から目的であるインテント（Intent：例「フライト予約」「照明を消す」）と、対象パラメータであるエンティティ（Entity：例「東京」「リビング」）を予測するカスタム自然言語理解機能",
          "質問応答（Question Answering：旧 QnA Maker）は既存の FAQ ページ（URL）・社内マニュアル PDF・TSV 等から質問と回答のペアを自動抽出し、ナレッジベースを構築する",
          "Question Answering は曖昧な質問に対するマルチターン（聞き返し・フォローアッププロンプト）対話や、挨拶等の雑談（Chit-chat）にも対応できる",
        ],
        examTip:
          "『家電や業務アプリへのコマンド指示（何を・どこに対して行うか）＝CLU（Utterance/Intent/Entity）』『FAQ 文書をもとにした一問一答ボット＝Question Answering』。",
      },
      {
        id: "ai900-4-3",
        code: "4.3",
        title: "Azure AI Speech・Translator・Azure AI Search",
        services: [
          "Azure AI Speech",
          "Azure AI Translator",
          "Azure AI Search",
          "スキルセット / ベクター検索",
        ],
        keyPoints: [
          "Azure AI Speech は音声をテキスト化する Speech-to-Text（STT）、自然なニューラル音声を合成する Text-to-Speech（TTS）、および音声入力をリアルタイムで別言語へ変換する音声翻訳を提供する",
          "Azure AI Translator は 100 以上の言語に対応したリアルタイムのテキスト翻訳、書式を保持したままドキュメント（Word/PDF 等）を変換するドキュメント翻訳、文字種変換（音訳）を提供する",
          "Azure AI Search（旧 Cognitive Search）はナレッジマイニングの中核であり、インデクサーで取り込んだ非構造化データに AI スキルセット（OCR・NER・翻訳等）を適用して検索インデックスを構築する",
          "Azure AI Search はキーワード検索に加え、意味ベクトルで検索するベクター検索・ハイブリッド検索・セマンティック ランキングを備え、生成 AI（RAG）の参照データ基盤としても活用される",
        ],
        examTip:
          "『音声の書き起こし・音声合成・音声の直接翻訳＝Azure AI Speech』『テキストや文書の翻訳＝Azure AI Translator』『PDF や画像を AI 解析して横断検索＝Azure AI Search』。",
      },
    ],
  },
  {
    id: "ai900-domain-5",
    number: "05",
    title: "Azure の生成 AI ワークロード",
    englishTitle: "Describe features of generative AI workloads on Azure",
    weight: "20〜25%",
    accentColor: "indigo",
    summary:
      "Transformer・トークン・埋め込み・RAG・ファインチューニングなど LLM の基礎原理と、Azure OpenAI Service / Azure AI Foundry / Azure AI Content Safety / Microsoft Copilot を理解します。",
    topics: [
      {
        id: "ai900-5-1",
        code: "5.1",
        title: "生成 AI と LLM の基礎（トークン・RAG・ファインチューニング）",
        services: [
          "Transformer",
          "トークン化 / Embeddings",
          "プロンプトエンジニアリング",
          "RAG / ファインチューニング",
        ],
        keyPoints: [
          "大規模言語モデル（LLM）は Transformer アーキテクチャ（アテンション機構により文脈内の単語間関係や順序を捉える）に基づき、前後の文脈から次に来る確率が最も高いトークンを予測・生成する",
          "トークン化（Tokenization）は入力テキストを処理単位（サブワード等）に分割する工程で、埋め込み（Embeddings）はテキストの意味を数値ベクトルに変換し意味的類似度計算を可能にする",
          "プロンプト エンジニアリングではシステム メッセージ（役割と制約の指示）・Zero-shot / Few-shot（少数例の提示）・Temperature（低いほど決定的、高いほど多様）や Top-p の調整で出力品質を高める",
          "RAG（検索拡張生成 / グラウンディング）は外部検索ストアの最新・固有情報をプロンプトに付与して根拠ある回答を生成する手法。ファインチューニングはモデルの重み自体を追加学習させて口調や特化形式を最適化する手法",
        ],
        examTip:
          "『モデルの再学習なしで最新情報や社内データに基づいた回答をさせたい（ハルシネーション抑制）＝RAG / グラウンディング』『応答スタイルや専門タスクの振る舞いを学習させたい＝ファインチューニング』。",
      },
      {
        id: "ai900-5-2",
        code: "5.2",
        title: "Azure OpenAI Service・Azure AI Foundry・Content Safety",
        services: [
          "Azure OpenAI Service",
          "Azure AI Foundry",
          "Azure AI Content Safety",
          "Microsoft Copilot",
        ],
        keyPoints: [
          "Azure OpenAI Service は GPT 系（テキスト生成・対話・推論）・DALL-E（テキストから画像生成）・Whisper（音声認識）・Embeddings モデルを、Azure RBAC・仮想ネットワーク分離・データ保護等のエンタープライズ基盤上で提供する",
          "Azure AI Foundry（旧 Azure AI Studio）は Azure OpenAI やオープンモデル（Llama・Mistral・Phi 等）のカタログ探索、Prompt Flow によるワークフロー構築、RAG 連携、安全性・根拠性評価を一元的に行う統合開発プラットフォーム",
          "Azure AI Content Safety はテキストと画像から 4 つの有害カテゴリ（ヘイト・自傷・性的・暴力）を重大度レベル別に検出・フィルタリングし、Prompt Shields でプロンプトインジェクション（脱獄攻撃）を防御する",
          "Microsoft Copilot は Microsoft 365（Word/Excel/Teams 等）・GitHub・Windows などに標準統合された SaaS 型 AI アシスタントであり、独自アプリ構築には Azure OpenAI / Azure AI Foundry を利用する",
        ],
        examTip:
          "『有害コンテンツの自動遮断やジェイルブレイク対策＝Azure AI Content Safety』『複数モデルの比較評価や Prompt Flow・RAG の統合開発＝Azure AI Foundry』『Office 業務支援をそのまま利用＝Microsoft Copilot』。",
      },
    ],
  },
];

export const ai900Comparisons: AzureComparisonTable[] = [
  {
    id: "ai900-comp-ml-types",
    category: "AI・機械学習",
    title: "機械学習タスク 3 種別の比較（回帰・分類・クラスタリング）",
    subtitle: "目的・教師ラベルの有無・代表的な評価指標の整理",
    columns: ["タスク種別", "学習方式", "出力形式", "主な評価指標", "代表的なユースケース"],
    rows: [
      {
        feature: "回帰 (Regression)",
        values: [
          "教師あり学習（ラベル必須）",
          "連続的な数値",
          "MAE / RMSE / R²",
          "不動産価格・売上高・気温・需要数の予測",
        ],
      },
      {
        feature: "分類 (Classification)",
        values: [
          "教師あり学習（ラベル必須）",
          "離散的なカテゴリ（2値 / 多クラス）",
          "Accuracy / Precision / Recall / F1 / AUC",
          "スパムメール判定・疾患診断・顧客離反判定",
        ],
      },
      {
        feature: "クラスタリング (Clustering)",
        values: [
          "教師なし学習（ラベル不要）",
          "特徴が似たグループ（クラスタ ID）",
          "シルエット係数・重心間距離",
          "購買傾向による顧客セグメンテーション・異常検知前段",
        ],
      },
    ],
    decisionRule:
      "数値を当てる＝回帰、決まったカテゴリに分ける＝分類、正解ラベルなしで似たデータ同士をまとめる＝クラスタリング。",
  },
  {
    id: "ai900-comp-vision",
    category: "AI・機械学習",
    title: "Azure コンピューター ビジョン系サービスの使い分け",
    subtitle: "画像解析・独自モデル学習・顔検出・帳票抽出の選定基準",
    columns: ["サービス", "事前学習 vs カスタム", "主な出力・機能", "最適なユースケース"],
    rows: [
      {
        feature: "Azure AI Vision",
        values: [
          "事前学習済み API",
          "タグ・キャプション生成・一般物体検出・Read OCR",
          "汎用的な画像の説明生成や写真・看板からの文字読み取り",
        ],
      },
      {
        feature: "Azure AI Custom Vision",
        values: [
          "カスタム学習（GUI/少データ）",
          "独自ラベルの画像分類・境界ボックス物体検出",
          "自社製品の種類識別や製造ラインの欠陥箇所検出",
        ],
      },
      {
        feature: "Azure AI Face",
        values: [
          "事前学習済み API（一部制限あり）",
          "顔の境界ボックス・ランドマーク・向き・照合（承認制）",
          "写真内の顔位置検出や承認済み本人確認（感情推測は不可）",
        ],
      },
      {
        feature: "Azure AI Document Intelligence",
        values: [
          "事前学習済み ＋ カスタムモデル",
          "事前構築済み請求書/領収書モデル・レイアウト解析・キー・値ペア抽出",
          "領収書・請求書・ID カード・社内帳票の自動データ入力",
        ],
      },
    ],
    decisionRule:
      "汎用 OCR・キャプション＝AI Vision、独自対象の画像分類/検出＝Custom Vision、領収書・請求書の構造化＝Document Intelligence。",
  },
  {
    id: "ai900-comp-ml-compute",
    category: "コンピュート",
    title: "Azure Machine Learning の開発手法とコンピューティング比較",
    subtitle: "Automated ML / Designer / スクリプト実行と推論基盤の選び方",
    columns: ["機能 / コンピュート", "操作・実行スタイル", "想定スキル", "主な用途"],
    rows: [
      {
        feature: "Automated ML (AutoML)",
        values: [
          "自動アルゴリズム探索・チューニング",
          "ML 実装知識不要（データ準備のみ）",
          "表形式データや画像から最短で高精度ベースラインモデルを作成",
        ],
      },
      {
        feature: "Azure ML Designer",
        values: [
          "ドラッグ＆ドロップのビジュアルパイプライン",
          "ローコード（処理フローの理解）",
          "前処理・学習・評価の手順を視覚的に設計・実験",
        ],
      },
      {
        feature: "Compute Instance / Cluster",
        values: [
          "開発用単体 VM / 自動スケール分散ノード群",
          "Python SDK / CLI",
          "Notebook 開発（Instance）と大規模バッチ学習（Cluster）",
        ],
      },
      {
        feature: "Managed Online / Batch Endpoint",
        values: [
          "リアルタイム REST API / 非同期一括推論",
          "MLOps / アプリ連携",
          "低レイテンシの単発予測（Online）と夜間一括予測（Batch）",
        ],
      },
      {
        feature: "学習・検証データ分割 (Train/Validation Split)",
        values: [
          "データセットを学習用と検証用に分離してモデル評価",
          "データ準備の基本（過学習・データリーク防止）",
          "未知データへの汎化性能を RMSE や F1 等で客観検証",
        ],
      },
    ],
    decisionRule:
      "試行錯誤を自動化したい＝AutoML、処理フローを視覚的に組みたい＝Designer、本格分散学習＝Compute Cluster。",
  },
  {
    id: "ai900-comp-search-rag",
    category: "ストレージ・DB",
    title: "ナレッジマイニングと RAG 検索基盤のデータ処理比較",
    subtitle: "非構造化ストレージから Azure AI Search による検索・グラウンディングまで",
    columns: ["検索・処理方式", "扱うデータ表現", "強み", "適したシナリオ"],
    rows: [
      {
        feature: "キーワード検索 (フルテキスト)",
        values: [
          "転置インデックス（単語一致・BM25）",
          "製品型番・固有名詞の厳密一致に強い",
          "型番や規定番号など正確な語句を含む文書検索",
        ],
      },
      {
        feature: "ベクター検索 (Embeddings)",
        values: [
          "数値ベクトル（意味空間上の距離）",
          "言い換えや類義語・マルチモーダル検索が可能",
          "ユーザーの自然な質問文と意味が近い社内規定の検索",
        ],
      },
      {
        feature: "ハイブリッド検索 ＋ セマンティック ランキング",
        values: [
          "キーワード ＋ ベクトルの統合 ＋ L2 再順位付け",
          "厳密一致と意味理解の両立・最高精度",
          "RAG（検索拡張生成）で LLM に正確な根拠を渡す本番構成",
        ],
      },
      {
        feature: "AI エンリッチメント スキルセット",
        values: [
          "Blob 等からの取込時に OCR / NER / 翻訳を実行",
          "画像やスキャン PDF も構造化して索引登録可能",
          "社内ドキュメント群（PDF・画像混在）のナレッジマイニング",
        ],
      },
    ],
    decisionRule:
      "RAG 本番基盤の検索精度を最大化する場合は、Azure AI Search のハイブリッド検索＋セマンティック ランキングと AI スキルセットを組み合わせる。",
  },
  {
    id: "ai900-comp-safety-sec",
    category: "ネットワーク・セキュリティ",
    title: "Azure AI における安全性・責任ある AI・セキュリティ統制",
    subtitle: "有害出力対策・インジェクション防御・アクセス認可の役割分担",
    columns: ["制御レイヤー / サービス", "保護対象・役割", "主な機能", "適用ポイント"],
    rows: [
      {
        feature: "Azure AI Content Safety",
        values: [
          "入力プロンプトおよび生成出力コンテンツ",
          "ヘイト・自傷・性的・暴力の 4 カテゴリ重大度検出とブロック",
          "チャット UI や画像生成アプリでの有害表現フィルタリング",
        ],
      },
      {
        feature: "Prompt Shields",
        values: [
          "LLM へのユーザー入力・外部文書入力",
          "直接的・間接的プロンプトインジェクション（脱獄）の検知",
          "RAG で外部テキストを読み込ませる際の悪意ある指示防御",
        ],
      },
      {
        feature: "Microsoft Entra ID ＋ RBAC",
        values: [
          "Azure AI リソースへの API 呼び出し・管理操作",
          "最小権限の原則によるキーレス認証（マネージド ID）",
          "本番アプリから Azure OpenAI / Search への安全な接続",
        ],
      },
      {
        feature: "Limited Access 承認 (Face 等)",
        values: [
          "高リスクな生体認証・カスタム音声合成機能",
          "ユースケース審査に通過した顧客のみ識別機能を有効化",
          "個人の顔識別やカスタムニューラル音声の悪用防止",
        ],
      },
      {
        feature: "責任ある AI 6 原則（信頼性と安全性・プライバシーとセキュリティ・透明性・説明責任）",
        values: [
          "公平性・信頼性と安全性・プライバシーとセキュリティ・包括性・透明性・説明責任",
          "バイアス排除・堅牢性検証・データ保護・障がい者配慮・利用明示・人間の統制",
          "すべての AI システム企画・学習・運用段階における必須ガバナンス基準",
        ],
      },
    ],
    decisionRule:
      "有害出力や脱獄防止＝Azure AI Content Safety（＋Prompt Shields）、認証認可＝Entra ID RBAC、顔識別利用＝Limited Access。",
  },
  {
    id: "ai900-comp-genai-approach",
    category: "ガバナンス・監視・コスト",
    title: "生成 AI 導入と LLM カスタマイズのコスト・運用比較",
    subtitle: "既存 SaaS 活用からプロンプト・RAG・ファインチューニングまでの投資判断",
    columns: ["アプローチ", "開発・運用コスト", "データ鮮度 / 根拠性", "適用すべき判断基準"],
    rows: [
      {
        feature: "Microsoft Copilot (SaaS 利用)",
        values: [
          "極小（ライセンス契約のみ・構築不要）",
          "Microsoft 365 テナント内の権限範囲を参照",
          "文書作成・会議要約など定常業務の生産性向上を即実現",
        ],
      },
      {
        feature: "プロンプトエンジニアリング",
        values: [
          "低（API 呼び出しと指示文調整のみ）",
          "モデルの学習済み知識に依存",
          "要約・翻訳・一般質問など汎用タスクを低コストで実装",
        ],
      },
      {
        feature: "Transformer / トークン化 / Embeddings（LLM 基礎）",
        values: [
          "中（基盤モデル理解・RAG 設計）",
          "Transformer の自己注意機構・単語のトークン化・意味ベクトル化",
          "Azure AI Language（キーフレーズ抽出・NER・感情分析）や RAG 検索との連携",
        ],
      },
      {
        feature: "RAG（グラウンディング）",
        values: [
          "中（Azure AI Search 連携が必要）",
          "高（最新データ反映・出典提示が可能）",
          "社内規定や製品仕様など固有かつ変化する事実に基づく回答",
        ],
      },
      {
        feature: "ファインチューニング",
        values: [
          "高（学習データ作成・再学習・専用ホスティング費）",
          "低（学習時点の静的知識・単体では出典不可）",
          "プロンプトや RAG で再現困難な独自文体・出力形式の固定",
        ],
      },
    ],
    decisionRule:
      "まずプロンプト工夫 → 最新・固有事実の参照は RAG → それでも独自の口調や構造化出力を極めたい場合のみファインチューニングを検討。",
  },
];

export const ai900Patterns: AzureArchitecturePattern[] = [
  {
    id: "ai900-pat-1",
    title: "社内ナレッジ活用 RAG（検索拡張生成）パターン",
    badge: "Generative AI / RAG",
    flow: [
      "社内規定 PDF (Blob Storage)",
      "Azure AI Search (ベクター検索)",
      "Azure OpenAI Service (GPT)",
      "Azure AI Content Safety",
    ],
    summary:
      "社内の最新ドキュメントを Azure AI Search で検索・抽出し、根拠コンテキストとしてプロンプトに埋め込んで Azure OpenAI Service で回答生成する標準構成です。",
    keyDesignPoints: [
      "モデルを再学習（ファインチューニング）せずに最新・固有の事実に基づく回答と出典提示を実現",
      "Azure AI Content Safety と Prompt Shields により不適切表現や間接的プロンプトインジェクションを抑止",
    ],
  },
  {
    id: "ai900-pat-2",
    title: "請求書・領収書の自動データ抽出ワークフロー",
    badge: "Document Intelligence",
    flow: [
      "スキャン画像・PDF 入力",
      "Azure AI Document Intelligence",
      "キー・値ペア構造化 JSON",
      "業務データベース登録",
    ],
    summary:
      "事前構築済みまたはカスタムの Document Intelligence モデルを用い、紙帳票から取引先・日付・金額・明細テーブルを自動抽出して業務システムへ連携する構成です。",
    keyDesignPoints: [
      "汎用領収書・請求書は事前構築済みモデルで ML 開発なしに即座に運用開始可能",
      "独自の社内書式がある場合は数枚からのカスタムモデル学習と信頼度しきい値による人手確認を組み合わせる",
    ],
  },
  {
    id: "ai900-pat-3",
    title: "Azure Machine Learning ノーコード学習〜推論デプロイ",
    badge: "Azure Machine Learning",
    flow: [
      "データ資産登録",
      "Automated ML / ML Designer",
      "モデル レジストリ",
      "マネージド エンドポイント",
    ],
    summary:
      "表形式データの収集から AutoML や Designer でのモデル学習・評価・登録、さらにリアルタイムまたはバッチ推論 API 公開までを一気通貫で管理する構成です。",
    keyDesignPoints: [
      "学習データと検証データを分割して過学習を防止し、タスクに応じた指標（RMSE / F1 / AUC 等）でモデルを選定",
      "モデル レジストリでバージョン管理を行い、マネージド エンドポイントへ安全にデプロイ",
    ],
  },
  {
    id: "ai900-pat-4",
    title: "多言語カスタマーサポート・音声対話自動化",
    badge: "NLP & Speech",
    flow: [
      "顧客音声入力 (Speech-to-Text)",
      "Azure AI Translator",
      "CLU / Question Answering",
      "音声応答合成 (Text-to-Speech)",
    ],
    summary:
      "音声認識・多言語翻訳・意図理解（CLU）または FAQ 検索（Question Answering）・音声合成を連携させ、多言語対応の自動応答窓口を構成するパターンです。",
    keyDesignPoints: [
      "コマンド・手続きの意図分類には CLU、FAQ ドキュメント検索には Question Answering を使い分ける",
      "音声入力の書き起こしと音声合成は Azure AI Speech に統一し、テキスト翻訳は Azure AI Translator を組み合わせる",
    ],
  },
  {
    id: "ai900-pat-5",
    title: "非構造化データ横断のナレッジマイニング基盤",
    badge: "Knowledge Mining",
    flow: [
      "非構造化データ (文書・画像)",
      "Azure AI Search インデクサー",
      "AI スキルセット (OCR / NER)",
      "検索インデックス公開",
    ],
    summary:
      "PDF・Office 文書・画像が混在するデータストアから、インデクサーと AI スキルセットで文字や固有表現・キーフレーズを自動抽出し検索可能にする構成です。",
    keyDesignPoints: [
      "スキャン画像内の文字も OCR スキルとマージ処理によって検索対象テキストへ統合可能",
      "Azure AI Language の NER や翻訳スキルを組み込むことで多言語・属性別のファセット検索を実現",
    ],
  },
  {
    id: "ai900-pat-6",
    title: "製造ライン外観検査向けカスタム画像認識パイプライン",
    badge: "Computer Vision",
    flow: [
      "検査対象画像収集",
      "Azure AI Custom Vision ラベル付け",
      "カスタムモデル学習・評価",
      "推論 API / エッジ展開",
    ],
    summary:
      "自社製品特有の傷や部品欠損を検知するため、Azure AI Custom Vision で画像分類または物体検出モデルを学習し推論環境に展開するパターンです。",
    keyDesignPoints: [
      "不良の有無だけを判別するなら「画像分類」、不良箇所の位置を枠で囲むなら「物体検出」を選択",
      "コンパクトドメインで学習することでエッジデバイスやオフライン環境向けモデルへのエクスポートにも対応",
    ],
  },
];

export const ai900Pitfalls: AzurePitfall[] = [
  {
    id: "ai900-pit-1",
    trap: "領収書や請求書の項目抽出に Azure AI Vision の Read OCR だけを選べば十分だと考える",
    whyWrong:
      "Read OCR は画像内の文字列をそのまま読み取るだけで、「どれが請求金額でどれが明細行の表か」というキー・値ペアや構造化までは行いません。",
    correctApproach:
      "領収書・請求書・フォームから構造化された項目や表を抽出する要件では Azure AI Document Intelligence（旧 Form Recognizer）を選択する。",
  },
  {
    id: "ai900-pit-2",
    trap: "Azure AI Face でユーザーの感情（怒り・喜び）や年齢・性別を判定したり、誰でも顔識別を使えると考える",
    whyWrong:
      "Microsoft の責任ある AI 方針により、感情推定や属性推測機能は廃止されており、個人の識別（Identification）・照合機能は Limited Access 審査の承認が必須です。",
    correctApproach:
      "通常の利用範囲は顔の位置検出（境界ボックス・ランドマーク・顔の向き等）と認識し、個人の照合や識別が必要な場合は Limited Access 申請が必要であることを押さえる。",
  },
  {
    id: "ai900-pit-3",
    trap: "LLM に最新の社内規定や商品価格を答えさせるためにファインチューニングを行う",
    whyWrong:
      "ファインチューニングは高コストで更新のたびに再学習が必要になり、事実の正確性や出典提示も単体では保証できません。",
    correctApproach:
      "最新・固有の事実データを根拠として回答させたい場合は RAG（検索拡張生成 / グラウンディング）を選び、ファインチューニングは出力スタイルや専門形式の学習に限定する。",
  },
  {
    id: "ai900-pit-4",
    trap: "発生率 1% の不正検知モデルを評価する際、Accuracy（正解率）が 99% だから優秀と判断する",
    whyWrong:
      "すべてを「正常（陰性）」と予測するだけの無意味なモデルでも Accuracy は 99% になり、肝心の不正（陽性）を 1 件も見つけられません。",
    correctApproach:
      "クラス不均衡データでは混同行列に基づく Recall（見逃し防止）・Precision（誤検知防止）・F1 スコア・AUC を確認する。",
  },
  {
    id: "ai900-pit-5",
    trap: "責任ある AI の「公平性（Fairness）」と「包括性（Inclusiveness）」、および「透明性」と「説明責任」を混同する",
    whyWrong:
      "公平性は性別・人種等のバイアスなく公平に扱うこと、包括性は障がい等を持つ人も含めすべての人を包摂しアクセス可能にすることであり対象観点が異なります。",
    correctApproach:
      "『差別的バイアスの排除＝公平性』『障がい者対応などのアクセシビリティ＝包括性』『AI 利用の明示と理由説明＝透明性』『人間のガバナンス・法的/倫理的責任＝説明責任』で整理する。",
  },
  {
    id: "ai900-pit-6",
    trap: "テキストの翻訳に Azure AI Speech を使う、または音声認識だけで自動翻訳が完結すると考える",
    whyWrong:
      "Azure AI Speech は音声→テキスト（STT）・テキスト→音声（TTS）・音声翻訳を担当し、テキスト同士やドキュメントの翻訳は Azure AI Translator の担当です。",
    correctApproach:
      "音声が関わる文字起こし・音声合成・音声翻訳＝Azure AI Speech、テキストおよび文書の多言語翻訳＝Azure AI Translator と明確に分ける。",
  },
];

export const ai900KeyFacts: AzureKeyFact[] = [
  {
    id: "ai900-kf-1",
    target: "Exam AI-900 合格基準",
    value: "700 / 1000 点（更新不要）",
    detail: "試験時間 45 分・100〜1000 のスケールスコアで判定され資格は永久有効",
  },
  {
    id: "ai900-kf-2",
    target: "責任ある AI の 6 原則",
    value: "公平・信頼安全・保護・包括・透明・説明責任",
    detail: "Microsoft Responsible AI Standard が定義する 6 つの設計・運用原則",
  },
  {
    id: "ai900-kf-3",
    target: "教師あり vs 教師なし学習",
    value: "ラベルあり vs ラベルなし",
    detail: "回帰・分類は正解ラベル付きデータ、クラスタリングはラベルなしデータ",
  },
  {
    id: "ai900-kf-4",
    target: "回帰の評価指標",
    value: "MAE / RMSE / R²",
    detail: "RMSE・MAE は 0 に近いほど誤差小、決定係数 R² は 1 に近いほど高性能",
  },
  {
    id: "ai900-kf-5",
    target: "分類の評価指標",
    value: "Precision / Recall / F1 / AUC",
    detail: "見逃し厳禁は Recall、誤警報厳禁は Precision、総合比較は F1 と AUC",
  },
  {
    id: "ai900-kf-6",
    target: "Azure AI Custom Vision",
    value: "画像分類 ＆ 物体検出",
    detail: "少数の独自画像から分類モデル・境界ボックス物体検出モデルを学習",
  },
  {
    id: "ai900-kf-7",
    target: "Azure AI Document Intelligence",
    value: "旧 Form Recognizer",
    detail: "領収書・請求書等の事前構築済みモデルと独自帳票向けカスタムモデルを提供",
  },
  {
    id: "ai900-kf-8",
    target: "CLU vs Question Answering",
    value: "意図・エンティティ vs FAQ 応答",
    detail: "CLU（旧 LUIS）は発話解析、Question Answering（旧 QnA Maker）は知識検索",
  },
  {
    id: "ai900-kf-9",
    target: "LLM Temperature パラメータ",
    value: "低い＝決定的 / 高い＝創造的",
    detail: "事実回答やコード生成は低め、アイデア出しや文章表現の多様化には高めに設定",
  },
  {
    id: "ai900-kf-10",
    target: "Azure AI Content Safety",
    value: "4 カテゴリ検出 ＋ Prompt Shields",
    detail: "ヘイト・自傷・性的・暴力の重大度フィルタリングと脱獄（インジェクション）防御",
  },
];

export const ai900QuickLookup: CertFlashcardItem[] = [
  {
    keyword: "時系列の売上やセンサーデータから通常外のスパイクや故障兆候を検知するワークロード",
    category: "AI基礎・責任あるAI",
    recommended: "異常検出 (Anomaly Detection)",
    reason: "過去の正常パターンから外れた異常値を自動検出する AI ワークロードです。",
  },
  {
    keyword: "AI による融資審査や採用で性別・人種などのバイアスによる差別を防ぐ原則",
    category: "AI基礎・責任あるAI",
    recommended: "公平性 (Fairness)",
    reason: "すべての人に対して偏りなく公平な結果を出力するよう設計・検証する原則です。",
  },
  {
    keyword: "視覚や聴覚に障がいのあるユーザーも利用できるよう字幕や音声読み上げを組み込む原則",
    category: "AI基礎・責任あるAI",
    recommended: "包括性 (Inclusiveness)",
    reason: "多様な能力や背景を持つすべての人に開かれた AI を設計する原則です。",
  },
  {
    keyword: "AI システムと対話している事実や予測根拠・限界をユーザーへ分かりやすく示す原則",
    category: "AI基礎・責任あるAI",
    recommended: "透明性 (Transparency)",
    reason: "利用者が AI の動作仕組みと制約を理解できるようにする原則です。",
  },
  {
    keyword: "AI の運用結果に対し、開発チームや組織がガバナンス・法的/倫理的責任を負う原則",
    category: "AI基礎・責任あるAI",
    recommended: "説明責任 (Accountability)",
    reason: "人間による監視体制や倫理基準の遵守を通じて組織が責任を果たす原則です。",
  },
  {
    keyword: "過去の物件データ（面積・駅距離等）から連続的な販売価格（数値）を予測する ML タスク",
    category: "機械学習",
    recommended: "回帰 (Regression)",
    reason: "特徴量をもとに連続数値ラベルを予測する教師あり学習タスクです。",
  },
  {
    keyword: "メールが「スパム」か「通常」か、または動物の種類をカテゴリ予測する ML タスク",
    category: "機械学習",
    recommended: "分類 (Classification)",
    reason: "二項分類または多クラス分類として離散的なラベルを予測する教師あり学習です。",
  },
  {
    keyword: "正解ラベルのない顧客購買データを特徴の近さで自動的にグループ分けする ML タスク",
    category: "機械学習",
    recommended: "クラスタリング (Clustering)",
    reason: "K-Means 等を用い、ラベルなしでデータの類似構造を見出す教師なし学習です。",
  },
  {
    keyword: "コードを書かずに最適なアルゴリズムとハイパーパラメータ探索を自動実行する機能",
    category: "機械学習",
    recommended: "Azure Machine Learning Automated ML",
    reason: "データと目的指標を指定するだけで高精度なモデル候補を自動生成します。",
  },
  {
    keyword: "データ準備・学習・評価モジュールをドラッグ＆ドロップで繋いで視覚的に実験する機能",
    category: "機械学習",
    recommended: "Azure ML Designer",
    reason: "ノーコード/ローコードのキャンバス上で ML パイプラインを構築できます。",
  },
  {
    keyword: "画像に写る対象の位置を四角い枠（座標）とラベルで複数同時に特定するタスク",
    category: "コンピュータービジョン",
    recommended: "物体検出 (Object Detection)",
    reason: "画像全体へのラベル付け（画像分類）と異なり境界ボックスで位置を返します。",
  },
  {
    keyword: "自動運転向けに道路・歩行者・標識をピクセル単位のマスクで塗り分けて識別するタスク",
    category: "コンピュータービジョン",
    recommended: "セマンティック セグメンテーション",
    reason: "画像内の各ピクセルがどのクラスに属するかを精密に判定します。",
  },
  {
    keyword: "少数の自社製品写真をアップロードして独自の画像分類・物体検出モデルを作成するサービス",
    category: "コンピュータービジョン",
    recommended: "Azure AI Custom Vision",
    reason: "ラベル付けから学習・推論 API 公開・エッジ出力まで簡単に実行できます。",
  },
  {
    keyword: "画像内の人の顔を検出し境界ボックスや目・鼻・口の位置、顔の向きを抽出するサービス",
    category: "コンピュータービジョン",
    recommended: "Azure AI Face",
    reason: "顔検出機能を提供し、個人の照合・識別機能は Limited Access 承認制となっています。",
  },
  {
    keyword: "領収書や請求書の画像・PDF から合計金額や日付・明細表を構造化抽出するサービス",
    category: "コンピュータービジョン",
    recommended: "Azure AI Document Intelligence",
    reason: "旧 Form Recognizer であり、事前構築済みモデルとカスタム帳票モデルを提供します。",
  },
  {
    keyword: "レビュー文がポジティブかネガティブか、および対象語ごとの評価傾向を数値化する機能",
    category: "自然言語処理",
    recommended: "Azure AI Language（感情分析）",
    reason: "感情スコアとオピニオンマイニングにより顧客の満足度を自動分析します。",
  },
  {
    keyword: "テキストから氏名・電話番号・住所などの個人情報を検出し自動マスクする機能",
    category: "自然言語処理",
    recommended: "Azure AI Language（PII 検出）",
    reason: "個人を特定できる機微情報を認識し墨消し（Redaction）を行います。",
  },
  {
    keyword: "ユーザーの発話から目的（インテント）とパラメータ（エンティティ）を抽出する機能",
    category: "自然言語処理",
    recommended: "会話言語理解 (CLU)",
    reason: "旧 LUIS であり、対話アプリや音声アシスタントのコマンド解釈に最適です。",
  },
  {
    keyword: "既存の FAQ ページやマニュアル PDF から質問応答ボット用ナレッジベースを構築する機能",
    category: "自然言語処理",
    recommended: "Question Answering",
    reason: "旧 QnA Maker であり、一問一答やマルチターンの聞き返し応答を提供します。",
  },
  {
    keyword: "音声のテキスト文字起こし（STT）・自然な音声合成（TTS）・音声翻訳を行うサービス",
    category: "自然言語処理",
    recommended: "Azure AI Speech",
    reason: "音声入出力に関わる認識・合成・音声間翻訳を統合的に提供します。",
  },
  {
    keyword: "PDF や画像を含む大量の非構造化文書を AI スキルで解析し横断・ベクター検索可能にする基盤",
    category: "自然言語処理",
    recommended: "Azure AI Search",
    reason: "ナレッジマイニングおよび RAG 向け検索エンジンとして機能します。",
  },
  {
    keyword: "外部検索ストアの社内資料をプロンプトに付与し、LLM の誤情報（ハルシネーション）を抑える手法",
    category: "生成AI",
    recommended: "RAG（検索拡張生成 / グラウンディング）",
    reason: "モデルを再学習せずに最新の固有情報へ根拠づけて回答させられます。",
  },
  {
    keyword: "Azure OpenAI や他社モデル探索・Prompt Flow・評価を一元的に行う統合開発環境",
    category: "生成AI",
    recommended: "Azure AI Foundry（旧 AI Studio）",
    reason: "モデルカタログ選定から RAG 構築・安全性評価までを一貫して行えます。",
  },
  {
    keyword: "LLM の入出力から有害表現（ヘイト・暴力等）や脱獄プロンプトを検知・遮断するサービス",
    category: "生成AI",
    recommended: "Azure AI Content Safety",
    reason: "4 つの有害カテゴリの重大度分類と Prompt Shields による防御を提供します。",
  },
];

export const ai900PracticeQuestions: CertQuestion[] = [
  {
    id: "ai900-q1",
    domainId: "ai900-domain-1",
    domainLabel: "01: AI ワークロードと考慮事項",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "ある製造工場が、生産ラインの各種センサーから毎秒送信される温度や振動の時系列データを監視し、通常の稼働範囲から外れた故障予兆をリアルタイムに検知したいと考えています。この要件に該当する AI ワークロードはどれですか？",
    options: [
      "異常検出（Anomaly Detection）",
      "ナレッジマイニング（Knowledge Mining）",
      "ドキュメント インテリジェンス（Document Intelligence）",
      "画像分類（Image Classification）",
    ],
    correctIndices: [0],
    explanation:
      "時系列データの連続的な監視から正常パターンを外れた値や兆候を自動的に検出するタスクは異常検出（Anomaly Detection）の典型例です。",
    keywords: ["異常検出", "時系列データ", "AI ワークロード"],
  },
  {
    id: "ai900-q2",
    domainId: "ai900-domain-1",
    domainLabel: "01: AI ワークロードと考慮事項",
    difficulty: "標準",
    selectCount: 1,
    question:
      "音声通話システムに AI を組み込み、聴覚に障がいのある利用者でもリアルタイムで会話内容を把握できるよう自動文字起こし字幕を表示する取り組みは、Microsoft の責任ある AI（Responsible AI）のどの原則を最も直接的に体現していますか？",
    options: [
      "透明性（Transparency）",
      "包括性（Inclusiveness）",
      "説明責任（Accountability）",
      "プライバシーとセキュリティ（Privacy and Security）",
    ],
    correctIndices: [1],
    explanation:
      "身体的・認知的・感覚的な障がいを持つ人々を含め、すべての人が AI の恩恵を受けられるようアクセシビリティを設計に組み込むことは「包括性（Inclusiveness）」の原則に該当します。",
    keywords: ["責任ある AI", "包括性", "アクセシビリティ"],
  },
  {
    id: "ai900-q3",
    domainId: "ai900-domain-1",
    domainLabel: "01: AI ワークロードと考慮事項",
    difficulty: "標準",
    selectCount: 1,
    question:
      "金融機関がローン審査用 AI モデルを開発する際、学習データの偏りによって特定の性別や居住地域の申請者が不当に低い評価を受けないよう検証・是正する取り組みは、責任ある AI のどの原則に対応しますか？",
    options: [
      "信頼性と安全性（Reliability and Safety）",
      "公平性（Fairness）",
      "包括性（Inclusiveness）",
      "透明性（Transparency）",
    ],
    correctIndices: [1],
    explanation:
      "AI システムが属性に基づくバイアスや差別を生まず、すべての人を公平に扱うことを保証するのは「公平性（Fairness）」の原則です。",
    keywords: ["公平性", "バイアス排除", "責任ある AI"],
  },
  {
    id: "ai900-q4",
    domainId: "ai900-domain-1",
    domainLabel: "01: AI ワークロードと考慮事項",
    difficulty: "応用",
    selectCount: 2,
    question:
      "AI システムの運用ガバナンスに関する Microsoft の責任ある AI 原則のうち、「透明性（Transparency）」と「説明責任（Accountability）」の実践として正しい組み合わせを 2 つ選択してください。",
    options: [
      "ユーザーが自動チャットボットと対話していることを明示し、判断の根拠や限界を説明する（透明性）",
      "AI の開発・運用チームが倫理規範への準拠を監督し、運用結果に対する責任体制を明確にする（説明責任）",
      "顧客の個人情報を暗号化せず公開ストレージに保存して検証しやすくする（プライバシーとセキュリティ）",
      "エッジケースでのテストを省略してリリース速度だけを優先する（信頼性と安全性）",
    ],
    correctIndices: [0, 1],
    explanation:
      "透明性は AI 利用の開示と動作・限界の説明可能性を確保し、説明責任は開発者・組織がガバナンス基準に沿って継続的に監視・責任を持つ原則です。",
    keywords: ["透明性", "説明責任", "責任ある AI"],
  },
  {
    id: "ai900-q5",
    domainId: "ai900-domain-2",
    domainLabel: "02: Azure における機械学習",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "不動産の専有面積・築年数・最寄り駅からの距離などの特徴量をもとに、過去データを使って住宅の販売価格（連続的な数値）を予測する場合、適切な機械学習タスクはどれですか？",
    options: [
      "二項分類（Binary Classification）",
      "回帰（Regression）",
      "クラスタリング（Clustering）",
      "固有表現認識（NER）",
    ],
    correctIndices: [1],
    explanation:
      "過去のラベル付きデータから連続的な数値を予測する教師あり学習タスクは「回帰（Regression）」です。",
    keywords: ["回帰", "教師あり学習", "特徴量"],
  },
  {
    id: "ai900-q6",
    domainId: "ai900-domain-2",
    domainLabel: "02: Azure における機械学習",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "EC サイトの購買履歴データはあるものの事前のグループ分け（正解ラベル）が存在しない状態で、購買傾向が似ている顧客同士を 4 つのセグメントに自動分類したい場合、どのアプローチが適していますか？",
    options: [
      "教師なし学習のクラスタリング（K-Means 等）",
      "教師あり学習の回帰",
      "教師あり学習の多クラス分類",
      "Azure AI Document Intelligence の事前構築済みモデル",
    ],
    correctIndices: [0],
    explanation:
      "正解ラベルのないデータから特徴の類似性に基づいてグループを抽出する処理は、教師なし学習の「クラスタリング」に該当します。",
    keywords: ["クラスタリング", "教師なし学習", "K-Means"],
  },
  {
    id: "ai900-q7",
    domainId: "ai900-domain-2",
    domainLabel: "02: Azure における機械学習",
    difficulty: "標準",
    selectCount: 1,
    question:
      "疾病のスクリーニング検査モデルにおいて、「実際には病気である患者を見逃さずに陽性と検出すること（偽陰性 FN を極力減らすこと）」を最優先したい場合、重視すべき分類評価指標はどれですか？",
    options: [
      "適合率（Precision）",
      "再現率（Recall）",
      "二乗平均平方根誤差（RMSE）",
      "決定係数（R²）",
    ],
    correctIndices: [1],
    explanation:
      "再現率（Recall）は「実際の陽性のうち正しく陽性と予測できた割合（TP / (TP + FN)）」であり、偽陰性（見逃し）を最小化したい医療検査や不正検知で重視されます。RMSE や R² は回帰の指標です。",
    keywords: ["Recall", "混同行列", "分類評価指標"],
  },
  {
    id: "ai900-q8",
    domainId: "ai900-domain-2",
    domainLabel: "02: Azure における機械学習",
    difficulty: "標準",
    selectCount: 2,
    question:
      "Azure Machine Learning を用いてコーディング負荷を抑えつつ予測モデルを構築・公開する手法について、正しい記述を 2 つ選択してください。",
    options: [
      "Automated ML（AutoML）を使うと、指定したデータと目標指標に対して複数のアルゴリズムと前処理・ハイパーパラメータの試行を自動実行できる",
      "Azure ML Designer を使うと、データの分割・学習・評価などのモジュールをキャンバス上でドラッグ＆ドロップ接続してパイプラインを作成できる",
      "Azure Machine Learning では学習データを検証用に分割することは許可されていない",
      "モデル レジストリに登録したモデルはリアルタイム API（エンドポイント）としてデプロイできない",
    ],
    correctIndices: [0, 1],
    explanation:
      "AutoML は最適モデル探索の自動化、Azure ML Designer は視覚的パイプライン作成機能を提供します。学習/検証分割やモデルレジストリからのエンドポイント公開も標準機能です。",
    keywords: ["AutoML", "Azure ML Designer", "モデル レジストリ"],
  },
  {
    id: "ai900-q9",
    domainId: "ai900-domain-3",
    domainLabel: "03: コンピューター ビジョン",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "駐車場の監視カメラ画像の中から「自動車」と「歩行者」がそれぞれ写っている位置を特定し、各対象を囲む四角形の境界ボックス（Bounding Box）と座標を取得したい場合、該当するタスクはどれですか？",
    options: [
      "画像分類（Image Classification）",
      "物体検出（Object Detection）",
      "光学文字認識（OCR）",
      "感情分析（Sentiment Analysis）",
    ],
    correctIndices: [1],
    explanation:
      "画像内に存在する複数の対象を識別し、それぞれの位置を境界ボックスの座標として返すのは「物体検出（Object Detection）」です。",
    keywords: ["物体検出", "境界ボックス", "コンピューター ビジョン"],
  },
  {
    id: "ai900-q10",
    domainId: "ai900-domain-3",
    domainLabel: "03: コンピューター ビジョン",
    difficulty: "標準",
    selectCount: 1,
    question:
      "ある企業で従業員が提出する経費精算の領収書画像をアップロードし、「店名」「取引日」「合計金額」「明細テーブル」などの項目を構造化された JSON として自動抽出したいと考えています。最小の開発工数で実現できるサービスはどれですか？",
    options: [
      "Azure AI Document Intelligence（事前構築済み領収書モデル）",
      "Azure AI Face",
      "Azure AI Translator",
      "Azure ML Designer によるゼロからの CNN 学習",
    ],
    correctIndices: [0],
    explanation:
      "Azure AI Document Intelligence（旧 Form Recognizer）には領収書や請求書向けの事前構築済みモデルがあり、学習不要でキー・値ペアや明細表を高精度に抽出できます。",
    keywords: ["Document Intelligence", "領収書", "事前構築済みモデル"],
  },
  {
    id: "ai900-q11",
    domainId: "ai900-domain-3",
    domainLabel: "03: コンピューター ビジョン",
    difficulty: "標準",
    selectCount: 1,
    question:
      "自社が製造する独自部品の検査画像データを用意し、「正常品」か「傷あり不良品」かを判定する専用の視覚モデルを、ゼロからディープラーニングのコードを書かずに学習・デプロイしたい場合、最適なサービスはどれですか？",
    options: [
      "Azure AI Custom Vision",
      "Azure AI Language",
      "Azure AI Speech",
      "Azure AI Content Safety",
    ],
    correctIndices: [0],
    explanation:
      "Azure AI Custom Vision は独自のラベル付き画像をポータルからアップロードするだけで、カスタムの画像分類または物体検出モデルを学習・公開できるサービスです。",
    keywords: ["Custom Vision", "画像分類", "カスタムモデル"],
  },
  {
    id: "ai900-q12",
    domainId: "ai900-domain-3",
    domainLabel: "03: コンピューター ビジョン",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Azure AI Face の機能と責任ある AI に基づく利用制限について、正しい記述を 2 つ選択してください。",
    options: [
      "画像内の顔を検出し、境界ボックスの座標や目・鼻・口などのランドマーク位置、顔の向きを取得できる",
      "個人の特定（Identification）や本人照合（Verification）などの顔認識機能の利用には、Limited Access 申請と承認が必要である",
      "標準機能として、写っている人物の感情（怒り・幸福・悲しみ）や性別・年齢を推定する属性が提供されている",
      "1 枚の画像に複数の顔が写っている場合は常に 1 つしか検出できない",
    ],
    correctIndices: [0, 1],
    explanation:
      "Azure AI Face は複数顔の検出とランドマーク・向き等の取得に対応しますが、責任ある AI 方針により感情・属性推測は廃止され、個人の顔識別・照合は Limited Access 承認制です。",
    keywords: ["Azure AI Face", "Limited Access", "責任ある AI"],
  },
  {
    id: "ai900-q13",
    domainId: "ai900-domain-4",
    domainLabel: "04: 自然言語処理 (NLP)",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "コールセンターの問い合わせログをクラウドへ保存・分析する前に、テキスト内に含まれる顧客の電話番号・メールアドレス・住所・マイナンバー等の個人識別情報を自動検出して伏せ字（墨消し）にしたい場合、使用すべき Azure AI Language の機能はどれですか？",
    options: [
      "PII（個人を特定できる情報）検出",
      "感情分析（Sentiment Analysis）",
      "キーフレーズ抽出（Key Phrase Extraction）",
      "言語検出（Language Detection）",
    ],
    correctIndices: [0],
    explanation:
      "Azure AI Language の PII 検出機能はテキスト内の個人機微情報を特定し、アスタリスク等での自動墨消し（Redaction）を行えます。",
    keywords: ["PII 検出", "Azure AI Language", "個人情報保護"],
  },
  {
    id: "ai900-q14",
    domainId: "ai900-domain-4",
    domainLabel: "04: 自然言語処理 (NLP)",
    difficulty: "標準",
    selectCount: 1,
    question:
      "スマートスピーカーや業務チャットアプリで、「明日の午前 9 時に会議室の照明をつけて」というユーザー発話（Utterance）から、実行すべき操作の意図「照明操作（Intent）」と対象パラメータ「明日の午前 9 時」「会議室」（Entity）を抽出したい場合に適した機能はどれですか？",
    options: [
      "会話言語理解（CLU: Conversational Language Understanding）",
      "Question Answering（質問応答）",
      "テキストの抽象型要約",
      "Azure AI Custom Vision",
    ],
    correctIndices: [0],
    explanation:
      "発話（Utterance）からユーザーの意図（Intent）と固有のパラメータ（Entity）を理解・抽出するのは、Azure AI Language の会話言語理解（CLU）の役割です。",
    keywords: ["CLU", "Intent", "Entity"],
  },
  {
    id: "ai900-q15",
    domainId: "ai900-domain-4",
    domainLabel: "04: 自然言語処理 (NLP)",
    difficulty: "標準",
    selectCount: 1,
    question:
      "国際会議のライブ配信において、話者の英語の音声をリアルタイムに認識して文字起こしし、同時に日本語のテキストおよび音声へ変換して視聴者に届けたい場合、中核として利用すべきサービスはどれですか？",
    options: [
      "Azure AI Speech",
      "Azure AI Document Intelligence",
      "Azure AI Vision",
      "Automated ML",
    ],
    correctIndices: [0],
    explanation:
      "Azure AI Speech は Speech-to-Text（音声認識）、音声翻訳（Speech Translation）、Text-to-Speech（音声合成）を統合的に提供します。",
    keywords: ["Azure AI Speech", "STT", "音声翻訳"],
  },
  {
    id: "ai900-q16",
    domainId: "ai900-domain-4",
    domainLabel: "04: 自然言語処理 (NLP)",
    difficulty: "応用",
    selectCount: 2,
    question:
      "社内のファイルサーバーや Blob Storage に散在する数万件の PDF・Word・スキャン画像を対象にナレッジマイニング基盤を構築する際、Azure AI Search の役割として正しいものを 2 つ選択してください。",
    options: [
      "インデクサーと AI スキルセット（OCR・NER・キーフレーズ抽出等）を使い、画像内の文字や抽出属性を含めた検索インデックスを自動生成できる",
      "キーワード検索に加えてベクター検索およびセマンティック ランキングを組み合わせ、意味的に関連度の高い検索結果を返せる",
      "Azure AI Search 自体がオリジナルの DALL-E 画像を生成して保存する",
      "スキャンされた PDF 画像から文字を抽出することは一切できない",
    ],
    correctIndices: [0, 1],
    explanation:
      "Azure AI Search は AI エンリッチメント（スキルセット）によって非構造化データを解析・索引化し、キーワード・ベクター・セマンティック検索を組み合わせて RAG やナレッジ検索に活用できます。",
    keywords: ["Azure AI Search", "ナレッジマイニング", "ベクター検索"],
  },
  {
    id: "ai900-q17",
    domainId: "ai900-domain-5",
    domainLabel: "05: Azure の生成 AI",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "大規模言語モデル（LLM）において、入力文章を処理単位（単語やサブワード）へ分解する工程と、そのテキストの意味を数値ベクトル空間へ変換して類似検索を可能にする表現の組み合わせとして正しいものはどれですか？",
    options: [
      "分解工程がトークン化（Tokenization）、意味ベクトル表現が埋め込み（Embeddings）",
      "分解工程がクラスタリング、意味ベクトル表現が R²",
      "分解工程が物体検出、意味ベクトル表現が境界ボックス",
      "分解工程が匿名化、意味ベクトル表現が混同行列",
    ],
    correctIndices: [0],
    explanation:
      "LLM はテキストをトークンに分割（Tokenization）して処理し、テキストの意味的類似性を比較・検索する際には埋め込み（Embeddings）ベクトルを使用します。",
    keywords: ["トークン化", "Embeddings", "LLM"],
  },
  {
    id: "ai900-q18",
    domainId: "ai900-domain-5",
    domainLabel: "05: Azure の生成 AI",
    difficulty: "標準",
    selectCount: 1,
    question:
      "社内ヘルプデスク向けチャットボットを構築する際、GPT モデルが一般的な学習知識だけで誤った社内ルール（ハルシネーション）を作ってしまう問題を防ぎ、毎週更新される社内規定 PDF に基づいて出典付きで回答させたい場合、最も費用対効果の高い手法はどれですか？",
    options: [
      "Azure AI Search 等と組み合わせた RAG（検索拡張生成 / グラウンディング）を実装する",
      "毎週すべての社員マニュアルを使って基盤モデルの重みを一から事前学習し直す",
      "Temperature パラメータを最大値（2.0）に設定して創造性を高める",
      "プロンプトからすべてのコンテキスト情報を削除する",
    ],
    correctIndices: [0],
    explanation:
      "最新・固有の社内情報を根拠として答えさせる場合は、外部検索ストアから関連文書を取得してプロンプトに付与する RAG（グラウンディング）が最も確実かつ低コストです。Temperature を上げると出力のばらつきが増えます。",
    keywords: ["RAG", "グラウンディング", "ハルシネーション対策"],
  },
  {
    id: "ai900-q19",
    domainId: "ai900-domain-5",
    domainLabel: "05: Azure の生成 AI",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Azure AI Foundry（旧 Azure AI Studio）で構築している生成 AI チャットボットにおいて、悪意あるユーザーがシステムの制約を突破しようとする「プロンプトインジェクション（脱獄攻撃）」や、暴力・ヘイト・自傷などの有害な入出力を自動検知・ブロックしたい場合、統合すべきサービスはどれですか？",
    options: [
      "Azure AI Content Safety（および Prompt Shields）",
      "Azure AI Custom Vision",
      "Azure ML Designer",
      "Azure AI Translator",
    ],
    correctIndices: [0],
    explanation:
      "Azure AI Content Safety は 4 つの有害カテゴリ（ヘイト・自傷・性的・暴力）を重大度別に判定・遮断し、Prompt Shields 機能で脱獄や間接的プロンプトインジェクション攻撃を防ぎます。",
    keywords: ["Azure AI Content Safety", "Prompt Shields", "Azure AI Foundry"],
  },
  {
    id: "ai900-q20",
    domainId: "ai900-domain-5",
    domainLabel: "05: Azure の生成 AI",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Azure OpenAI Service および Azure の生成 AI エコシステムに関する説明として、正しいものを 2 つ選択してください。",
    options: [
      "Azure OpenAI Service では GPT 系（テキスト/対話）や DALL-E（画像生成）等のモデルを、Microsoft Entra ID 認証や閉域ネットワークなど Azure の企業向けセキュリティ基盤上で利用できる",
      "Azure AI Foundry（旧 Azure AI Studio）では多様なモデルカタログの比較、Prompt Flow によるオーケストレーション、RAG 連携と回答の根拠性評価を一元的に実施できる",
      "Azure OpenAI Service でテキスト生成のランダム性を抑えて一貫した回答を得たい場合は Temperature を高く設定する",
      "Microsoft Copilot を利用するには必ず自社で Python を用いて Transformer モデルをスクラッチ学習させる必要がある",
    ],
    correctIndices: [0, 1],
    explanation:
      "Azure OpenAI Service はエンタープライズセキュリティ付きで OpenAI モデルを提供し、Azure AI Foundry は統合開発・評価環境を提供します。一貫した回答には Temperature を低く設定し、Microsoft Copilot は設定不要で即利用できる SaaS アシスタントです。",
    keywords: ["Azure OpenAI Service", "Azure AI Foundry", "Temperature"],
  },
];

export const ai900OfficialResources: AzureOfficialResource[] = [
  {
    title: "Microsoft Certified: Azure AI Fundamentals 認定ページ",
    description: "資格の概要、対象スキル、受験登録と試験概要の公式ハブです。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/azure-ai-fundamentals/",
    badge: "公式認定ページ",
  },
  {
    title: "Exam AI-900 公式試験ガイド (Study Guide)",
    description: "出題領域（5 ドメイン）の最新配点比率と測定スキルの一次情報です。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/resources/study-guides/ai-900",
    badge: "公式試験ガイド",
  },
  {
    title: "Exam AI-900 試験詳細・無料模擬評価",
    description: "Exam AI-900 の試験予約ページと Microsoft 公式 Practice Assessment へアクセスできます。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/exams/ai-900/",
    badge: "公式試験詳細",
  },
  {
    title: "Microsoft Learn: Azure で AI アプリケーションとエージェントを始める",
    description: "Azure の AI ワークロード・生成 AI・エージェント基礎を体系的に学べる公式ラーニングパス（日本語）です。",
    url: "https://learn.microsoft.com/ja-jp/training/paths/get-started-ai-apps-agents/",
    badge: "公式ラーニングパス",
  },
];
