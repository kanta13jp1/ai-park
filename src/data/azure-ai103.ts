// 出典: Microsoft Learn Exam AI-103 公式試験ガイド (Study guide for Exam AI-103 / 旧 AI-102 後継)
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

export const ai103ExamFacts: CertExamFact[] = [
  { label: "対象試験", value: "Exam AI-103", detail: "Azure AI Apps & Agents Developer ※旧 AI-102 後継" },
  { label: "試験時間", value: "100 分", detail: "着席 120 分目安・ラボ含む場合は 120 分" },
  { label: "合格スコア", value: "700 / 1000", detail: "スケールスコア 100〜1000 点" },
  { label: "有効期限", value: "1 年間（無料更新）", detail: "Microsoft Learn 更新評価で延長" },
  { label: "受験形式", value: "Pearson VUE", detail: "Microsoft Learn 参照可・ケーススタディ含む" },
  { label: "試験形式", value: "選択・ケーススタディ", detail: "Microsoft Foundry / Python・REST 実装含む" },
];

export const ai103Domains: AzureDomain[] = [
  {
    id: "ai103-domain-1",
    number: "01",
    title: "Azure AI ソリューションの計画と管理",
    englishTitle: "Plan and manage an Azure AI solution",
    weight: "25〜30%",
    accentColor: "indigo",
    summary:
      "Microsoft Foundry（旧 Azure AI Foundry）のプロジェクト/ハブ構成と適材適所のサービス選定、Entra ID・マネージド ID・Private Endpoint・Content Safety による統制、さらに PTU クォータ計画や OpenTelemetry トレーシング・評価まで運用基盤全体を設計します。",
    topics: [
      {
        id: "ai103-1-1",
        code: "1.1",
        title: "Microsoft Foundry プロジェクト/ハブ構成とサービス選定",
        services: [
          "Microsoft Foundry",
          "Foundry リソース / プロジェクト",
          "AI Hub (クラシックハブ)",
          "AIProjectClient (Python SDK)",
        ],
        keyPoints: [
          "Microsoft Foundry リソースはモデル・エージェント・評価・接続を一元管理する最上位のエンドポイント単位であり、その配下にアプリや環境（dev / stg / prod）ごとの分離境界となる Foundry プロジェクトを配置する",
          "複数チームで仮想ネットワーク・データ接続・共有コンピューティングやオープンモデルのファインチューニング基盤を共有する場合は AI Hub（ハブベースプロジェクト）を選択し、軽量なエージェント・推論アプリにはスタンドアロン Foundry プロジェクトを利用する",
          "アプリコードからは接続文字列や個別リソースキーを乱立させず、`azure-ai-projects` の `AIProjectClient` 経由でプロジェクト エンドポイントへ接続し、プロジェクト内 Connections として Azure AI Search やストレージを紐付ける",
          "既存 SaaS（Microsoft 365 Copilot 等）で済む要件か、事前構築済み Azure AI サービス（Vision / Language / Document Intelligence）で完結するか、LLM・Agent Service を組むべきかを工数と制御要件から見極める",
        ],
        examTip:
          "『複数プロジェクトで共通ネットワークや ML コンピューティングを継承・統制したい＝Hub ベースプロジェクト』『Agent Service や標準 API を迅速に分離管理＝Foundry リソース + プロジェクト』。",
      },
      {
        id: "ai103-1-2",
        code: "1.2",
        title: "AI リソースの認証・セキュリティ・責任ある AI ガバナンス",
        services: [
          "マネージド ID / DefaultAzureCredential",
          "Azure RBAC (Foundry User / Project Manager)",
          "Private Endpoint / Managed VNet",
          "Azure AI Content Safety",
        ],
        keyPoints: [
          "本番アプリケーションから Microsoft Foundry / Azure OpenAI への認証には API キーのコード埋め込みを避け、マネージド ID と `DefaultAzureCredential` によるキーレス（Microsoft Entra ID）認証を第一選択とする（キーが必要な外部連携は Azure Key Vault に格納）",
          "最小権限の RBAC 設計では、推論利用のみに `Foundry User`（旧 Azure AI User）や `Cognitive Services OpenAI User` を割り当て、開発者操作には `Foundry Project Manager`（旧 Azure AI Project Manager）を使い、`Contributor` のみに依存しない",
          "パブリック ネットワーク アクセスを無効化し、Azure Private Endpoint と Private DNS ゾーン（または Hub のマネージド VNet）を組み合わせることで、モデル推論やナレッジ検索の通信を閉域化する",
          "Azure AI Content Safety により 4 つの有害カテゴリ（ヘイト・自傷・性的・暴力）を重大度レベル別に遮断し、Prompt Shields で直接脱獄・間接的プロンプトインジェクション（XPIA）を防御、Protected Material 検出で著作権出力を監視する",
        ],
        examTip:
          "『Contributor 権限があるのにデータプレーンの推論 API が 403 で失敗する』＝ 管理プレーン権限のみでデータプレーン用ロール（Foundry User / Cognitive Services OpenAI User）が不足している定番パターン。",
      },
      {
        id: "ai103-1-3",
        code: "1.3",
        title: "コスト管理・クォータ（PTU vs 標準従量）・監視とトレース",
        services: [
          "Provisioned Throughput (PTU)",
          "Global Standard / Spillover",
          "Azure Monitor / Application Insights",
          "Foundry Tracing & Evaluators",
        ],
        keyPoints: [
          "標準従量課金（Standard / Global Standard）はトークン数（TPM/RPM 制限）に応じた柔軟な利用に適し、プロビジョニング済みスループット（PTU）は処理帯域を専用予約して本番の予測可能な高スループット・低遅延を保証する",
          "PTU のクォータ超過による HTTP 429（Too Many Requests）やピーク時スパイクを防ぐため、余剰トラフィックをペアの標準デプロイへ自動逃がす「スピルオーバー（Spillover）」構成と指数バックオフ リトライを組み合わせる",
          "Microsoft Foundry のトレーシングは OpenTelemetry と Application Insights を基盤とし、ユーザー入力から RAG 検索、ツール呼び出し、LLM 推論までのスパンとトークン消費量・レイテンシを相関 ID で追跡する（ログへの機微情報平文出力は避ける）",
          "モデルの継続的品質担保には Foundry の評価機能（Groundedness・Relevance・Coherence・Safety Evaluators）と Azure Monitor アラート（エラー率・429 発生数・消費トークン閾値）を組み込む",
        ],
        examTip:
          "『高負荷本番で固定レイテンシと専用帯域が必要＝PTU』『PTU 上限超過時の 429 を止めずにさばきたい＝Spillover（標準デプロイへのオーバーフロー）』。",
      },
    ],
  },
  {
    id: "ai103-domain-2",
    number: "02",
    title: "生成 AI とエージェント ソリューションの実装",
    englishTitle: "Implement generative AI and agentic solutions",
    weight: "30〜35%",
    accentColor: "cyan",
    summary:
      "Microsoft Foundry でのモデル選定・デプロイとプロンプト/パラメータ設計、Azure AI Search を用いた高精度 RAG パイプライン構築、そして Foundry Agent Service・Tool/Function Calling・MCP 連携・マルチエージェント協調・評価までを実装します。",
    topics: [
      {
        id: "ai103-2-1",
        code: "2.1",
        title: "モデルカタログ選定・デプロイ・プロンプト設計・パラメータ調整",
        services: [
          "Microsoft Foundry Model Catalog",
          "推論パラメータ (temperature / top_p / max_tokens)",
          "Structured Outputs (JSON Schema)",
          "Fine-tuning / Serverless API",
        ],
        keyPoints: [
          "Foundry モデル カタログではタスク特性・コンテキスト長・コスト・レイテンシに応じ、推論能力重視のフロンティアモデル（GPT 系等）と軽量高速な SLM（Phi 系等）やオープンモデル（Llama / Mistral）を比較選定してデプロイする",
          "推論パラメータ制御：`temperature`（0 に近いほど決定的・再現性高、高いほど多様）・`top_p`（累積確率による語彙候補絞り込み、通常は `temperature` とどちらか一方を調整）・`max_tokens`（最大出力トークン上限とコスト制御）を適切に設定する",
          "プロンプト設計ではシステム メッセージでの役割・制約明示、Few-shot 例示、CoT（段階的思考）を活用し、システム連携向けには `response_format` による Structured Outputs（JSON Schema 準拠）で出力形式を厳格化する",
          "固有の最新データ参照には RAG を優先し、ファインチューニングは「望ましい出力形式・専門文体・ツール呼び出し傾向の定着」や小規模モデルへの知識蒸留など、プロンプトと RAG で補えない領域に限定して適用する",
        ],
        examTip:
          "『JSON 形式で確実なスキーマ出力を得たい＝Structured Outputs』『決定的・再現性重視の出力＝temperature を低く設定（0.0〜0.2）』。",
      },
      {
        id: "ai103-2-2",
        code: "2.2",
        title: "RAG（Retrieval-Augmented Generation）とナレッジ接続",
        services: [
          "Azure AI Search",
          "ベクター / ハイブリッド / セマンティック検索",
          "Embeddings モデル",
          "ドキュメント チャンキング / グラウンディング",
        ],
        keyPoints: [
          "RAG パイプラインは「文書取り込み・レイアウト解析 → 意味単位のチャンキング（オーバーラップ付き分割）→ Embeddings モデルによるベクトル化 → Azure AI Search への索引登録 → 検索結果によるグラウンディング生成」で構成する",
          "検索精度を最大化するには、BM25 によるキーワード検索（型番・固有名詞に強い）と HNSW 等によるベクター検索（意味・言い換えに強い）を組み合わせた「ハイブリッド検索」に、L2 再順位付けを行う「セマンティック ランキング」を併用する",
          "Azure AI Search のインデクサーと統合ベクター化（Integrated Vectorization / スキルセット）を用いると、Blob Storage 更新時の分割・OCR・埋め込み生成を自動パイプライン化できる",
          "マルチテナントや権限付き社内文書を扱う場合は、検索ドキュメントにグループ/ユーザー識別子メタデータを保持し、クエリ実行時にユーザー権限に応じた `filter`（セキュリティ トリミング）を必ず適用する",
        ],
        examTip:
          "『製品型番の厳密一致と自然文の意味検索を両立して精度を上げたい＝ハイブリッド検索＋セマンティック ランキング』『閲覧権限外の文書が回答に混ざるのを防ぐ＝検索クエリ時のセキュリティ フィルタ適用』。",
      },
      {
        id: "ai103-2-3",
        code: "2.3",
        title: "エージェントアプリケーションの構築とオーケストレーション",
        services: [
          "Microsoft Foundry Agent Service",
          "Function Calling / OpenAPI Tool",
          "MCP (Model Context Protocol)",
          "File Search / Code Interpreter / Connected Agents",
        ],
        keyPoints: [
          "Microsoft Foundry Agent Service はスレッド管理・状態保持・自律的な推論ループ・ツール呼び出しをマネージドで提供し、Python SDK（`AIProjectClient`）からエージェント定義・実行・メッセージ取得を行える",
          "組み込みツールとして `FileSearchTool`（アップロード文書への簡易 RAG）、`CodeInterpreterTool`（サンドボックス内 Python 実行・グラフ生成）、`AzureAISearchTool` / `BingGroundingTool` があり、独自ロジックには `FunctionTool` や `OpenApiTool` を接続する",
          "標準化された外部連携には **MCP（Model Context Protocol / `McpTool`）** を用い、リモート MCP サーバーが公開するツール群や承認ポリシー（`require_approval`）を疎結合にエージェントへ組み込む",
          "単一エージェントでは煩雑な業務（調査・分析・承認等）は役割分担した複数エージェント（Connected Agents / オーケストレーター＆スペシャリスト構成）へ分割し、実行トレースと Groundedness・ツール呼び出し精度の評価・Content Safety フィルタを通して運用する",
        ],
        examTip:
          "『外部 SaaS や社内ツールを標準プロトコルで疎結合に発見・接続＝MCP（McpTool）』『アプリ側 Python 関数を直接実行＝FunctionTool』『Python 計算や CSV 可視化＝CodeInterpreterTool』。",
      },
    ],
  },
  {
    id: "ai103-domain-3",
    number: "03",
    title: "コンピューター ビジョン ソリューションの実装",
    englishTitle: "Implement computer vision solutions",
    weight: "10〜15%",
    accentColor: "emerald",
    summary:
      "Azure AI Vision v4（ImageAnalysisClient）による汎用画像解析・Read OCR・マルチモーダル埋め込みと、Azure AI Custom Vision / Video Indexer を用いた独自視覚モデル・動画メタデータ抽出の実装を学びます。",
    topics: [
      {
        id: "ai103-3-1",
        code: "3.1",
        title: "Azure AI Vision による画像分析とマルチモーダル埋め込み",
        services: [
          "Azure AI Vision (ImageAnalysisClient)",
          "Caption / Dense Captions / Objects / Tags",
          "Read API (OCR)",
          "Background Removal / Multimodal Embeddings",
        ],
        keyPoints: [
          "Azure AI Vision Image Analysis 4.0（`ImageAnalysisClient`）では 1 回の `analyze` 呼び出しで `VisualFeatures`（`CAPTION`, `DENSE_CAPTIONS`, `TAGS`, `OBJECTS`, `PEOPLE`, `SMART_CROPS`, `READ`）を組み合わせて効率よく取得できる",
          "Read API（`VisualFeatures.READ`）は画像・看板・スキャン文書内の印刷文字および手書き文字を行・単語単位のテキストと境界ポリゴン座標付きで高精度に抽出する",
          "背景削除（Background Removal）や人物検出・スマートトリミング機能により、EC 商品画像の自動切り抜きやサムネイル最適化をコード数行で自動化できる",
          "マルチモーダル埋め込み（`vectorizeImage` / `vectorizeText`）を用いると、画像とテキストを同一のベクトル空間へ写像し、「テキストのクエリから類似画像を探す」クロスモーダル検索を Azure AI Search 等と連携して構築できる",
        ],
        examTip:
          "『テキストの検索語で画像データベースから一致する画像を探したい』＝ Azure AI Vision マルチモーダル埋め込み（Vectorize Image / Text）＋ ベクター検索。",
      },
      {
        id: "ai103-3-2",
        code: "3.2",
        title: "カスタムビジョンモデル（Custom Vision）と動画解析（Video Indexer）",
        services: [
          "Azure AI Custom Vision",
          "画像分類 / 物体検出",
          "Compact ドメイン (エッジエクスポート)",
          "Azure AI Video Indexer",
        ],
        keyPoints: [
          "Azure AI Custom Vision は汎用モデルで識別できない自社製品や製造ラインの欠陥などを、ラベル付き画像データセットから「画像分類（Multiclass / Multilabel）」または「物体検出（Bounding Box）」として学習・公開する",
          "学習プロジェクトのドメイン設定で Compact 系ドメイン（例：General (compact)）を選択すると、学習済みモデルを ONNX / CoreML / TensorFlow / Docker コンテナ形式へエクスポートしエッジ端末でオフライン推論できる",
          "カスタムモデル公開時は反復（Iteration）ごとに Precision・Recall・AP（Average Precision）を評価し、クラス不均衡やデータ不足を補強したうえで「Publish」して予測エンドポイントへ反映する",
          "Azure AI Video Indexer は動画・音声ファイルを解析し、音声文字起こし（トランスクリプト）・画面内テキスト（OCR）・話者識別・登場シーン・キーフレーム・トピック・ブランド検出などの時系列インサイトを一括抽出する",
        ],
        examTip:
          "『エッジデバイスやオフライン環境へモデルを出力したい＝Custom Vision の Compact ドメイン』『動画から音声文字起こし＋画面内テロップ OCR＋シーン分割をまとめて抽出＝Azure AI Video Indexer』。",
      },
    ],
  },
  {
    id: "ai103-domain-4",
    number: "04",
    title: "テキスト分析ソリューションの実装",
    englishTitle: "Implement text analysis solutions",
    weight: "10〜15%",
    accentColor: "amber",
    summary:
      "Azure AI Language（感情分析・NER・PII 墨消し・要約・カスタム分類）、CLU と Custom Question Answering による自然言語理解・FAQ 基盤、および Azure AI Speech / Azure AI Translator による音声・多言語翻訳ソリューションを習得します。",
    topics: [
      {
        id: "ai103-4-1",
        code: "4.1",
        title: "Azure AI Language（感情分析・キーフレーズ・NER・PII・要約）",
        services: [
          "Azure AI Language (TextAnalyticsClient)",
          "Sentiment & Opinion Mining",
          "NER / PII Redaction",
          "Summarization / Custom Text",
        ],
        keyPoints: [
          "`TextAnalyticsClient` を通じて言語検出・感情分析（文全体と対象語ごとの評価を返すオピニオンマイニング）・キーフレーズ抽出・固有表現認識（NER）を一貫した Python SDK / REST API で実行できる",
          "PII（個人を特定できる情報）検出機能は氏名・電話番号・メール・住所・銀行口座等を識別し、`redacted_text` による自動マスク処理（Redaction）を行う（LLM へプロンプト送信する前段のマスキングとしても有効）",
          "文書要約には原文の重要文をそのまま抽出する「抽出型要約（Extractive）」、要点を新規文章化する「抽象型要約（Abstractive）」、さらに発話者・問題・解決策を整理する「会話要約（Conversation Summarization）」がある",
          "業界固有カテゴリの振り分けや独自固有表現（契約条項や部品コード等）を低遅延で安定抽出したい場合は、Custom Text Classification および Custom NER を学習・デプロイする",
        ],
        examTip:
          "『LLM へ送信する前に顧客テキスト内の電話番号や氏名を決定論的にマスクしたい』＝ Azure AI Language の PII 検出（Redaction）。",
      },
      {
        id: "ai103-4-2",
        code: "4.2",
        title: "会話言語理解（CLU）・カスタム質問応答（Custom Question Answering）",
        services: [
          "CLU (ConversationAnalysisClient)",
          "Intent / Entity / Utterance",
          "Custom Question Answering",
          "Orchestration Workflow",
        ],
        keyPoints: [
          "会話言語理解（CLU）はユーザー発話（Utterance）に対して、実行目的であるインテント（Intent）と、日時・場所・数量などのパラメータであるエンティティ（Entity：学習・リスト・事前構築済み・正規表現）を抽出する",
          "Custom Question Answering（CQA）は FAQ URL・PDF・Word・TSV から質問と回答のナレッジベースを構築し、同義語設定・信頼度スコア閾値・マルチターン（フォローアップ プロンプト）による段階的絞り込みを提供する",
          "単一アプリ内でコマンド解釈（CLU）と FAQ 応答（CQA）を併用する場合は、Orchestration Workflow（オーケストレーション プロジェクト）またはエージェントの意図ルーティングによって適切なプロジェクトへ振り分ける",
          "CLU / CQA のモデル開発では発話例へのラベル付け → 学習（Train）→ 評価 → エイリアス指定によるデプロイ（Deploy）というライフサイクルを管理する",
        ],
        examTip:
          "『発話から「予約変更」という意図と「東京・来週火曜」という引数を抜きたい＝CLU』『既存の社内 FAQ 文書から一問一答・聞き返し対話を作りたい＝Custom Question Answering』。",
      },
      {
        id: "ai103-4-3",
        code: "4.3",
        title: "Azure AI Speech と Azure AI Translator の実装",
        services: [
          "Azure AI Speech (SpeechConfig)",
          "STT / TTS / SSML / Speech Translation",
          "Custom Speech / Custom Neural Voice",
          "Azure AI Translator (Text / Document)",
        ],
        keyPoints: [
          "Azure AI Speech SDK では `SpeechConfig`（サブスクリプションまたは Entra 認証トークン＋リージョン）と `AudioConfig` を組み合わせて、リアルタイムおよびバッチの Speech-to-Text（STT）、Text-to-Speech（TTS）、話者分離（Diarization）を実装する",
          "TTS の発音・抑揚・ポーズ・話速を細かく制御するには **SSML（Speech Synthesis Markup Language）** を用い、専門用語や業界略語の認識精度を高めるには Custom Speech（音響・言語モデルのカスタマイズ）を適用する",
          "`TranslationRecognizer` を使うと、入力音声を認識しながら即座に 1 つまたは複数のターゲット言語のテキストや音声へ直接翻訳（音声翻訳）できる",
          "Azure AI Translator は 100 以上の言語に対応する低遅延 Text Translation（REST / `TextTranslationClient`）に加え、Word・PDF・Excel 等のレイアウトや書式を保ったまま一括翻訳する **Document Translation** と独自用語を反映する Custom Translator を提供する",
        ],
        examTip:
          "『音声の発音や間合い・読み方を細かく指示したい＝SSML』『Word や PDF のレイアウト・表組みを崩さず丸ごと多言語翻訳したい＝Document Translation』。",
      },
    ],
  },
  {
    id: "ai103-domain-5",
    number: "05",
    title: "情報抽出ソリューションの実装",
    englishTitle: "Implement information extraction solutions",
    weight: "10〜15%",
    accentColor: "cyan",
    summary:
      "Azure AI Document Intelligence（旧 Form Recognizer）による高精度レイアウト解析・事前構築済み/カスタム帳票モデルと、Azure Content Understanding によるドキュメント・音声・動画横断のマルチモーダル構造化パイプラインを設計・実装します。",
    topics: [
      {
        id: "ai103-5-1",
        code: "5.1",
        title: "Azure AI Document Intelligence（レイアウト・事前構築済みモデル）",
        services: [
          "Azure AI Document Intelligence",
          "DocumentIntelligenceClient",
          "prebuilt-layout / prebuilt-read",
          "prebuilt-invoice / receipt / idDocument",
        ],
        keyPoints: [
          "Azure AI Document Intelligence（旧 Form Recognizer）は非同期ポーリング型の `DocumentIntelligenceClient`（`begin_analyze_document`）等を用い、PDF・画像・Office 文書から文字だけでなく文書構造を抽出する",
          "`prebuilt-read` は全ページのテキスト・段落・言語抽出に特化し、`prebuilt-layout` は表（テーブル行・列・セル結合）・見出し・段落・選択マーク（チェックボックス）を解析し、RAG チャンク化に適した Markdown 形式でも出力できる",
          "請求書（`prebuilt-invoice`）・領収書（`prebuilt-receipt`）・本人確認書類（`prebuilt-idDocument`）・名刺・契約書などは事前構築済みモデルを使い、学習なしで信頼度（`confidence`）付きキー・値ペアを取得できる",
          "抽出結果の各フィールドには信頼度スコア（Confidence）が返されるため、一定閾値未満のフィールドだけを人手レビュー（Human-in-the-Loop）へ回す業務ワークフローを組み込める",
        ],
        examTip:
          "『RAG の前処理として複雑な表や見出し構造を含む PDF をきれいな Markdown へ変換したい』＝ Document Intelligence の `prebuilt-layout` モデル（Markdown 出力指定）。",
      },
      {
        id: "ai103-5-2",
        code: "5.2",
        title: "カスタム抽出/分類モデルと Azure Content Understanding",
        services: [
          "Custom Extraction (Template / Neural)",
          "Custom Classification Model",
          "Azure Content Understanding",
          "Multimodal Analyzers",
        ],
        keyPoints: [
          "独自書式のフォームに対しては、固定レイアウトかつ高速低コストな「カスタム テンプレート モデル」と、レイアウト変動が大きい非定型文書（複数形式の契約書等）に強い「カスタム ニューラル モデル」を使い分ける（コンポーズド モデルで複数型を 1 ID に統合可能）",
          "種類が混在する大量のスキャン PDF を事前仕分けし、1 PDF 内に複数書類が綴じられたファイルを境界分割（Splitting）してから抽出モデルへ流す場合は「カスタム分類モデル（Custom Classification）」を前段に配置する",
          "Azure Content Understanding（Microsoft Foundry Tools）はドキュメント・画像・音声・動画を統合扱うマルチモーダル解析サービスであり、ベース アナライザー（`prebuilt-document`, `prebuilt-audio`, `prebuilt-video`, `prebuilt-image`）や RAG 向けアナライザー（`prebuilt-documentSearch` 等）を提供する",
          "Content Understanding のカスタム アナライザーでは自然言語のフィールド説明と型定義からなる出力スキーマを定義するだけで、大量のバウンディングボックス学習ラベル付けなしに推論ベースの構造化 JSON を抽出できる",
        ],
        examTip:
          "『固定帳票の大量高速抽出＝Custom Template』『書式が多様な契約書＝Custom Neural』『PDF・画像・音声・動画を統一スキーマで抽出したい／ラベル付けなしで柔軟抽出＝Azure Content Understanding』。",
      },
    ],
  },
];

export const ai103Comparisons: AzureComparisonTable[] = [
  {
    id: "ai103-comp-model-deploy",
    category: "AI・機械学習",
    title: "Microsoft Foundry モデルデプロイとカスタマイズ手法の比較",
    subtitle: "課金・性能保証・カスタマイズ粒度に応じた設計選定",
    columns: ["オプション / 手法", "課金・スループット特性", "主なカスタマイズ範囲", "推奨ユースケース"],
    rows: [
      {
        feature: "Standard / Global Standard",
        values: [
          "トークン従量課金（TPM / RPM クォータ制約あり）",
          "システムプロンプト・推論パラメータ調整",
          "開発検証、トラフィック変動が大きいアプリ、PoC",
        ],
      },
      {
        feature: "Provisioned Throughput (PTU)",
        values: [
          "予約帯域の時間課金（低遅延・SLA/安定性能、Spillover 可）",
          "専用帯域上での確定スループット推論",
          "本番ミッションクリティカル・高同時実行ワークロード",
        ],
      },
      {
        feature: "RAG（グラウンディング）",
        values: [
          "検索ストア（AI Search）費用 ＋ 推論トークン費用",
          "最新の外部知識・出典参照・権限制御（filter）",
          "頻繁に更新される社内規程・仕様書・ナレッジ検索",
        ],
      },
      {
        feature: "ファインチューニング",
        values: [
          "学習ジョブ費用 ＋ 専用ホスティング時間課金",
          "モデル重み調整（文体・専門出力形式・SLM 最適化）",
          "プロンプトや Few-shot で安定しない独自フォーマット固定",
        ],
      },
    ],
    decisionRule:
      "まず Standard + プロンプト工夫 → 事実根拠が必要なら RAG → 出力形式や口調定着のみファインチューニング → 本番安定帯域が必要なら PTU（＋Spillover）。",
  },
  {
    id: "ai103-comp-agent-tools",
    category: "コンピュート",
    title: "Foundry Agent Service ツール統合方式の比較",
    subtitle: "エージェントに持たせる能力（検索・コード実行・外部 API・MCP）の選び方",
    columns: ["ツール種別", "ホスト / 実行主体", "強み・特徴", "適したシナリオ"],
    rows: [
      {
        feature: "FileSearchTool",
        values: [
          "Foundry Agent Service マネージド ベクターストア",
          "アップロードファイルの自動分割・埋め込み・検索を即統合",
          "数個〜小中規模ドキュメントに基づくエージェント内簡易 RAG",
        ],
      },
      {
        feature: "CodeInterpreterTool",
        values: [
          "Foundry 管理の隔離 Python サンドボックス",
          "Python 実行による厳密計算・データ集計・グラフ画像出力",
          "CSV 分析、数値計算（LLM の暗算回避）、レポート生成",
        ],
      },
      {
        feature: "FunctionTool / OpenApiTool",
        values: [
          "アプリ側 Python コード実行 / REST API 呼び出し",
          "独自業務ロジックや既存 REST API スキーマを直接関数定義",
          "社内業務 DB 更新やアプリ固有アクションの確実な制御",
        ],
      },
      {
        feature: "McpTool (Model Context Protocol)",
        values: [
          "リモート MCP サーバー（標準プロトコル通信）",
          "動的ツール一覧取得・標準連携・実行前承認（require_approval）",
          "複数の外部ツール基盤や社内サービスを疎結合に接続",
        ],
      },
    ],
    decisionRule:
      "計算やグラフ作成＝CodeInterpreter、手元の文書検索＝FileSearch、自社関数＝FunctionTool、標準化された外部ツールサーバー連携＝McpTool。",
  },
  {
    id: "ai103-comp-rag-search",
    category: "ストレージ・DB",
    title: "Azure AI Search の検索モードとインデクシング比較",
    subtitle: "RAG の再現率（Recall）と順位付け精度（Precision）を高める選定基準",
    columns: ["検索 / 構築方式", "内部アルゴリズム・仕組み", "強みと弱み", "本番 RAG での採用判断"],
    rows: [
      {
        feature: "キーワード検索 (フルテキスト)",
        values: [
          "転置インデックス ＋ BM25 スコアリング",
          "製品型番・エラーコードに強いが類義語・言い換えに弱い",
          "厳密語句検索やフィルタ補助として使用",
        ],
      },
      {
        feature: "ベクター検索 (Embeddings)",
        values: [
          "HNSW 近似最近傍 / Exhaustive KNN（コサイン類似度等）",
          "意味の近さや多言語に強いが固有名詞・記号の完全一致が苦手",
          "セマンティック類似検索や画像検索との統合時に使用",
        ],
      },
      {
        feature: "ハイブリッド検索 ＋ セマンティック ランキング",
        values: [
          "BM25 ＋ ベクトル検索を RRF 統合し L2 モデルで再順位付け",
          "厳密一致と意味理解を両立し、最上位チャンク精度を大幅向上",
          "本番 RAG アプリケーションにおける標準推奨構成",
        ],
      },
      {
        feature: "統合ベクター化 (Integrated Vectorization)",
        values: [
          "インデクサー ＋ チャンキング・OCR・埋め込みスキルセット",
          "Blob 等からの取り込み〜分割〜ベクトル化をコードレス自動化",
          "文書更新が継続的に発生するドキュメント基盤で推奨",
        ],
      },
    ],
    decisionRule:
      "本番 RAG は「ハイブリッド検索 ＋ セマンティック ランキング」を基本とし、自動更新には統合ベクター化（スキルセット）と権限 `filter` を組み合わせる。",
  },
  {
    id: "ai103-comp-vision-extraction",
    category: "AI・機械学習",
    title: "ビジョン・テキスト・情報抽出サービスの選定基準",
    subtitle: "非構造化データ（画像・動画・音声・文書）の目的に応じた API 使い分け",
    columns: ["サービス名", "対象モダリティ", "主な出力データ", "選ぶべき決め手"],
    rows: [
      {
        feature: "Azure AI Vision / Custom Vision",
        values: [
          "静止画（汎用解析 / 独自ラベル学習）",
          "キャプション・物体座標・Read OCR・マルチモーダルベクトル",
          "画像タグ付けやクロスモーダル検索、エッジ向け独自不良品検知",
        ],
      },
      {
        feature: "Azure AI Video Indexer",
        values: [
          "動画ファイル（映像 ＋ 音声トラック）",
          "時系列トランスクリプト・画面 OCR・話者・シーン・トピック",
          "動画の自動チャプター化や映像内テロップ・発話の横断検索",
        ],
      },
      {
        feature: "Azure AI Document Intelligence",
        values: [
          "帳票・PDF・スキャン文書",
          "レイアウト Markdown・表・選択マーク・信頼度付きキー・値ペア",
          "請求書・領収書・定型/準定型フォームからの決定論的・高精度抽出",
        ],
      },
      {
        feature: "Azure Content Understanding",
        values: [
          "マルチモーダル（文書・画像・音声・動画）",
          "自然言語スキーマに基づく構造化 JSON ＋ RAG 向け要約・索引出力",
          "複数メディア横断処理や事前ラベル付けなしの柔軟な構造化抽出",
        ],
      },
    ],
    decisionRule:
      "定型/高精度帳票と Markdown 表抽出＝Document Intelligence、ラベルなし柔軟抽出や動画/音声含む統合スキーマ抽出＝Content Understanding。",
  },
  {
    id: "ai103-comp-security-safety",
    category: "ネットワーク・セキュリティ",
    title: "AI アプリの認証・閉域化・Content Safety 多層防御",
    subtitle: "資格情報保護・ネットワーク分離・プロンプト攻撃対策の役割分担",
    columns: ["防御レイヤー", "実装手段・サービス", "防ぐ脅威・リスク", "AI-103 実装ベストプラクティス"],
    rows: [
      {
        feature: "ID・認証・RBAC",
        values: [
          "マネージド ID + DefaultAzureCredential / Foundry User 等",
          "API キー漏洩・過剰権限による不正操作",
          "キー認証を無効化し Entra ID + データプレーン最小権限 RBAC",
        ],
      },
      {
        feature: "ネットワーク閉域化",
        values: [
          "Private Endpoint + Private DNS / Hub Managed VNet",
          "インターネット経由の盗聴・外部からの不正エンドポイント到達",
          "パブリックアクセス無効化と VNet 内閉域通信の徹底",
        ],
      },
      {
        feature: "入力・出力モデレーション",
        values: [
          "Azure AI Content Safety（4 カテゴリ重大度 + PII 検出）",
          "有害コンテンツ出力や機微個人情報（PII）の LLM 送信・流出",
          "要件に応じた重大度閾値調整と送信前後の PII Redaction",
        ],
      },
      {
        feature: "敵対的プロンプト防御",
        values: [
          "Prompt Shields（User / Document Attacks）+ Protected Material",
          "直接脱獄、RAG 経由の間接インジェクション（XPIA）、著作権侵害",
          "外部文書読み込み前に Prompt Shields で命令乗っ取りを遮断",
        ],
      },
    ],
    decisionRule:
      "認証＝DefaultAzureCredential + 最小 RBAC、通信＝Private Endpoint、有害出力・脱獄/XPIA＝Content Safety + Prompt Shields。",
  },
  {
    id: "ai103-comp-observability-eval",
    category: "ガバナンス・監視・コスト",
    title: "AI アプリのトレーシング・評価・監視機能の比較",
    subtitle: "LLM とエージェントの振る舞いを本番運用で可視化・計測する手段",
    columns: ["機能 / ツール", "計測・収集対象", "実行タイミング", "運用上の用途"],
    rows: [
      {
        feature: "Foundry Tracing (OpenTelemetry)",
        values: [
          "プロンプト〜検索〜ツール呼出〜LLM 応答のスパンと相関 ID",
          "推論・エージェント実行時にリアルタイム収集",
          "Agent の推論ステップ遅延解析・ツール失敗箇所の特定",
        ],
      },
      {
        feature: "Foundry Evaluators (品質・安全性)",
        values: [
          "Groundedness・Relevance・Coherence・Safety（攻撃耐性）",
          "CI/CD デプロイ前テストおよび本番サンプリング定期評価",
          "プロンプト変更やモデル更新時のデグレード・ハルシネーション検知",
        ],
      },
      {
        feature: "Azure Monitor メトリクス & アラート",
        values: [
          "HTTP 429 率・エラー数・TTFT（初回トークン時間）・消費トークン",
          "プラットフォーム指標の連続監視（常時）",
          "PTU 飽和検知、Spillover 監視、予算アラート通知",
        ],
      },
      {
        feature: "Azure AI Content Safety 監査・フィードバック",
        values: [
          "ブロック発生カテゴリ・重大度・ユーザー評価ログ",
          "コンテンツフィルタ発火時・アプリ応答後",
          "誤ブロック閾値のチューニングと安全ガバナンス報告",
        ],
      },
    ],
    decisionRule:
      "因果トレース（なぜそのツールを呼んだか）＝OpenTelemetry Tracing、回答の根拠性検証＝Evaluators、クォータと 429 監視＝Azure Monitor。",
  },
];

export const ai103Patterns: AzureArchitecturePattern[] = [
  {
    id: "ai103-pat-1",
    title: "エンタープライズ閉域 RAG（Microsoft Foundry + Azure AI Search）",
    badge: "Enterprise RAG",
    flow: [
      "ドキュメント (Blob Storage / Private Endpoint)",
      "Document Intelligence (Layout Markdown 抽出)",
      "Azure AI Search (統合ベクター化・ハイブリッド検索)",
      "Microsoft Foundry (GPT + Groundedness 評価)",
    ],
    summary:
      "複雑レイアウトの文書を Document Intelligence で高精度に構造化テキスト化し、Azure AI Search のハイブリッド＋セマンティック ランキングで根拠を取得して、Private Endpoint 経由の Foundry モデルが回答を生成する標準 RAG 構成です。",
    keyDesignPoints: [
      "アプリ〜AI Search〜Foundry 間はすべて `DefaultAzureCredential`（マネージド ID）と Private Endpoint で接続し、API キーとパブリック通信を排除する",
      "検索クエリには利用者の Entra ID グループに基づくセキュリティ `filter` を付与し、閲覧権限外の情報が回答へ混入するのを防ぐ",
    ],
  },
  {
    id: "ai103-pat-2",
    title: "Foundry Agent Service ＋ MCP サーバー連携マルチツール構成",
    badge: "Agentic & MCP",
    flow: [
      "ユーザー要求 (Python AIProjectClient)",
      "Foundry Agent Service (推論オーケストレーター)",
      "組み込みツール (FileSearch / CodeInterpreter)",
      "リモート MCP サーバー (McpTool + 承認ゲート)",
    ],
    summary:
      "Foundry Agent Service を司令塔として、ファイル検索や Python サンドボックス計算（Code Interpreter）と、標準化されたリモート MCP サーバー経由の外部業務ツールを動的に組み合わせて業務を遂行するパターンです。",
    keyDesignPoints: [
      "更新系・機密操作を行う MCP ツール呼び出しには `require_approval` 等の人間承認（Human-in-the-Loop）ステップを設定し誤実行を防ぐ",
      "エージェントの全ツール呼び出しチェーンは OpenTelemetry トレーシングでスパン記録し、無限ループや失敗ステップを即座に特定する",
    ],
  },
  {
    id: "ai103-pat-3",
    title: "帳票仕分け〜マルチモーダル抽出パイプライン（Doc Intelligence + Content Understanding）",
    badge: "Information Extraction",
    flow: [
      "非構造化メディア (PDF・画像・音声・動画)",
      "カスタム分類モデル (文書種別判定・分割)",
      "Document Intelligence / Content Understanding",
      "信頼度判定 & 業務ストア格納",
    ],
    summary:
      "複数書類が混在するファイルや動画・音声を含む多様なコンテンツを、定型帳票は Document Intelligence、非定型・マルチモーダル資産は Content Understanding に振り分けて構造化 JSON を生成するパターンです。",
    keyDesignPoints: [
      "事前構築済みモデル（`prebuilt-invoice` 等）で対応できる領域は学習を省き、固定独自書式は Custom Template、書式がばらつく文書は Custom Neural や Content Understanding を選定する",
      "抽出フィールドの `confidence` スコアが設定閾値を下回る項目のみ人手確認キューへ回し、精度と自動化率を両立させる",
    ],
  },
  {
    id: "ai103-pat-4",
    title: "Content Safety ＋ Prompt Shields 多層ガードレール＆CI 評価構成",
    badge: "Responsible AI",
    flow: [
      "入力プロンプト & 取得文書 (Prompt Shields 検査)",
      "Azure AI Language (PII 検出・Redaction)",
      "Foundry モデル推論 (Content Safety フィルタ)",
      "Foundry Evaluators (Groundedness & Safety 検証)",
    ],
    summary:
      "ユーザー入力の脱獄攻撃、RAG 取得文書内の間接的プロンプトインジェクション（XPIA）、個人情報流出、有害出力を多層で遮断し、継続的評価で品質を検証する安全設計パターンです。",
    keyDesignPoints: [
      "RAG コンテキストとして外部文書をプロンプトへ注入する直前に Prompt Shields の Document Attacks 検査を実行し、セッション乗っ取りを防ぐ",
      "プロンプト改定やモデルバージョン変更時には Foundry Evaluators（Groundedness / Relevance / Safety）を CI パイプラインで自動実行する",
    ],
  },
  {
    id: "ai103-pat-5",
    title: "PTU ＋ Spillover 高可用推論と OpenTelemetry 可観測性構成",
    badge: "PTU & Observability",
    flow: [
      "クライアントアプリ (指数バックオフ実装)",
      "PTU デプロイ (プライマリ専用帯域)",
      "Global Standard デプロイ (Spillover 超過逃がし先)",
      "Azure Monitor & Application Insights (メトリクス/トレース)",
    ],
    summary:
      "本番通常トラフィックを PTU の確定スループットで低遅延処理しつつ、突発的なピーク超過分を Global Standard へ自動スピルオーバーさせて HTTP 429 によるサービス断を回避する構成です。",
    keyDesignPoints: [
      "PTU 使用率とスピルオーバー発生率を Azure Monitor メトリクスで監視し、定常超過が続く場合のみ PTU 予約量を計画増強する",
      "OpenTelemetry トレースでは相関 ID やトークン数・遅延を記録する一方、プロンプト本文の個人情報はサニタイズまたは記録制御する",
    ],
  },
  {
    id: "ai103-pat-6",
    title: "リアルタイム音声・多言語翻訳・NLP 統合アシスタント",
    badge: "Speech & NLP",
    flow: [
      "音声ストリーム入力 (Azure AI Speech STT)",
      "Azure AI Translator (リアルタイム多言語翻訳)",
      "CLU / Custom Question Answering (意図・FAQ 解析)",
      "SSML 音声応答合成 (Azure AI Speech TTS)",
    ],
    summary:
      "多言語での音声入力をリアルタイム認識・翻訳し、操作コマンドは CLU、知識照会は Custom Question Answering（またはエージェント）へルーティングして、SSML 制御による自然な音声で応答を返す構成です。",
    keyDesignPoints: [
      "専門用語の認識精度が必要な場面では Custom Speech を、ドキュメント一括翻訳には書式保持可能な Document Translation を使い分ける",
      "音声応答時の固有名詞読み上げやポーズは SSML タグで明示制御し、ユーザー体験を高める",
    ],
  },
];

export const ai103Pitfalls: AzurePitfall[] = [
  {
    id: "ai103-pit-1",
    trap: "AI リソースへの RBAC として「Contributor」を割り当てれば、Python アプリがマネージド ID で推論 API を呼び出せると考える",
    whyWrong:
      "`Contributor` は Azure リソースの作成・設定変更などのコントロールプレーン権限のみで、モデル推論やエージェント操作を行うデータプレーン権限が含まれません。",
    correctApproach:
      "本番アプリ（マネージド ID）や開発者には `Foundry User`（旧 Azure AI User）、`Foundry Project Manager`、`Cognitive Services OpenAI User` などのデータプレーン用 RBAC ロールを付与し、`DefaultAzureCredential` で認証する。",
  },
  {
    id: "ai103-pit-2",
    trap: "最新社内規定を答えさせるのにファインチューニングを選び、RAG でも単一検索（キーワードのみ／ベクターのみ）で済ませる",
    whyWrong:
      "ファインチューニングは静的知識の定着には不向きで出典提示も保証できません。また RAG もキーワードのみでは言い換えに弱く、ベクターのみでは型番や固有記号を取りこぼします。",
    correctApproach:
      "最新・固有事実へのグラウンディングには RAG を採用し、Azure AI Search の「ハイブリッド検索 ＋ セマンティック ランキング」とアクセス権に応じたセキュリティ `filter` を構成する。",
  },
  {
    id: "ai103-pit-3",
    trap: "PTU（Provisioned Throughput）を契約すれば容量超過時も無限に処理でき、エラーハンドリングは不要だと考える",
    whyWrong:
      "PTU には契約単位に基づく厳密なスループット上限があり、上限を超えると HTTP 429 が返却されます。無対策ではピーク時にエラーが急増します。",
    correctApproach:
      "PTU デプロイにペアの標準（Standard / Global Standard）デプロイへの「Spillover（スピルオーバー）」を設定し、クライアント側でも `Retry-After` ヘッダに従った指数バックオフ リトライを実装する。",
  },
  {
    id: "ai103-pit-4",
    trap: "RAG で取得した外部文書からの間接的プロンプトインジェクション（XPIA）を、システムプロンプトの「指示に従わないで」だけで防げると考える",
    whyWrong:
      "システムプロンプトの自然言語指示だけでは、外部ドキュメント内に巧妙に埋め込まれた敵対的コマンドによるセッション乗っ取りを確実にブロックできません。",
    correctApproach:
      "Azure AI Content Safety の **Prompt Shields（Document Attacks 検査）** を組み込み、有害出力 4 カテゴリフィルタおよび Foundry Evaluators（Safety / Groundedness）と多層で防御・検証する。",
  },
  {
    id: "ai103-pit-5",
    trap: "請求書の明細表抽出に Azure AI Vision の Read OCR だけを選んだり、動画・音声・文書混在パイプラインをすべてカスタム OCR スクリプトで組む",
    whyWrong:
      "Azure AI Vision Read OCR は生テキストと座標の抽出までで、請求書項目や表構造のキー・値ペア化を行いません。また動画や音声を横断するスキーマ抽出を個別実装すると保守性が著しく低下します。",
    correctApproach:
      "帳票の構造化や Markdown レイアウト抽出には **Azure AI Document Intelligence**、文書・画像・音声・動画を統一カスタムスキーマで柔軟抽出したい場合は **Azure Content Understanding**、動画解析特化には **Video Indexer** を選定する。",
  },
  {
    id: "ai103-pit-6",
    trap: "「明日の会議を予約して」のようなパラメータ付きコマンド解析に Custom Question Answering を使う／テキスト翻訳に Azure AI Speech を使う",
    whyWrong:
      "Custom Question Answering は FAQ ナレッジからの質問応答用であり、発話から操作意図（Intent）と引数（Entity）を抜く設計ではありません。またテキスト同士や文書の翻訳は Translator の担当です。",
    correctApproach:
      "コマンドの意図＋エンティティ抽出は **CLU**、FAQ 対話は **Custom Question Answering**、音声認識・音声合成・音声直接翻訳は **Azure AI Speech**、テキスト/文書翻訳は **Azure AI Translator** を使い分ける。",
  },
];

export const ai103KeyFacts: AzureKeyFact[] = [
  {
    id: "ai103-kf-1",
    target: "Exam AI-103 試験概要",
    value: "100 分・合格 700 / 1000 点",
    detail: "旧 AI-102 の正式後継。5 ドメイン構成で Microsoft Foundry / Python・REST 実装が中心（更新は年 1 回無料）",
  },
  {
    id: "ai103-kf-2",
    target: "Foundry Project vs AI Hub",
    value: "分離単位 vs 共有インフラ境界",
    detail: "Project はアプリ/環境別の分離境界、AI Hub は共有 VNet・接続・ML コンピューティングを束ねるハブ基盤",
  },
  {
    id: "ai103-kf-3",
    target: "Foundry RBAC & キーレス認証",
    value: "DefaultAzureCredential + Foundry User",
    detail: "API キー直書きは非推奨。マネージド ID とデータプレーンロール（Foundry User / Project Manager）を割り当て",
  },
  {
    id: "ai103-kf-4",
    target: "PTU と Spillover",
    value: "専用予約帯域 ＋ 超過時標準逃がし",
    detail: "PTU は確定スループット・低遅延を保証し、Spillover 設定でピーク超過トラフィックを Standard デプロイへ自動分散",
  },
  {
    id: "ai103-kf-5",
    target: "Azure AI Search 本番 RAG",
    value: "ハイブリッド検索 ＋ セマンティック ランキング",
    detail: "BM25（型番等）とベクトル検索（意味類似）を統合し、L2 再順位付け＋ユーザー権限フィルタで根拠精度と安全性を確保",
  },
  {
    id: "ai103-kf-6",
    target: "Foundry Agent Service ツール",
    value: "MCP / Function / FileSearch / CodeInterpreter",
    detail: "AIProjectClient から接続。標準外部ツールサーバーは McpTool、独自 Python 関数は FunctionTool を使い分ける",
  },
  {
    id: "ai103-kf-7",
    target: "Content Safety 防御機能",
    value: "4 カテゴリ ＋ Prompt Shields ＋ Protected Material",
    detail: "ヘイト・自傷・性的・暴力の重大度フィルタ、直接/間接インジェクション（XPIA）防御、既知テキスト/コード検出を統合",
  },
  {
    id: "ai103-kf-8",
    target: "Foundry Tracing & Evaluators",
    value: "OpenTelemetry + 根拠性・安全性自動評価",
    detail: "スパン/相関 ID で推論・ツール連鎖を可視化し、Groundedness・Relevance・Coherence・Safety を定量評価",
  },
  {
    id: "ai103-kf-9",
    target: "Vision vs Custom Vision vs Video Indexer",
    value: "汎用 API / 独自モデル / 動画時系列解析",
    detail: "ImageAnalysisClient はマルチモーダル埋め込み対応。エッジ展開は Custom Vision (Compact)、動画横断は Video Indexer",
  },
  {
    id: "ai103-kf-10",
    target: "Doc Intelligence vs Content Understanding",
    value: "高精度帳票・Layout vs マルチモーダル統一抽出",
    detail: "Document Intelligence は prebuilt-layout (Markdown) や Template/Neural に強み、Content Understanding は文書/音声/動画対応",
  },
];

export const ai103QuickLookup: CertFlashcardItem[] = [
  {
    keyword: "Microsoft Foundry でアプリ・環境（dev/prod）ごとにモデル接続・評価・エージェントを分離する作業境界",
    category: "計画・管理・ガバナンス",
    recommended: "Foundry プロジェクト（Foundry Project）",
    reason: "Foundry リソース配下で開発・検証・本番のアクセス制御や接続資産を明確に分離できます。",
  },
  {
    keyword: "複数プロジェクト間で共有 VNet・データ接続・オープンモデル用コンピューティングを継承・統制する親リソース",
    category: "計画・管理・ガバナンス",
    recommended: "AI Hub（ハブベースプロジェクト）",
    reason: "共有ネットワークとガバナンスポリシーを一元管理し、配下の複数プロジェクトへ継承できます。",
  },
  {
    keyword: "Python アプリから API キーをコードに書かず Entra ID / マネージド ID で Foundry へ認証する標準クラス",
    category: "計画・管理・ガバナンス",
    recommended: "DefaultAzureCredential（azure-identity）",
    reason: "ローカル開発の認証情報から本番マネージド ID までコード変更なしで安全にキーレス認証できます。",
  },
  {
    keyword: "Foundry プロジェクトでデータプレーン（モデル推論・利用）を許可する最新 RBAC ロール",
    category: "計画・管理・ガバナンス",
    recommended: "Foundry User（旧 Azure AI User）",
    reason: "Contributor などの管理プレーン権限ではなく、推論データ操作を最小権限で付与します。",
  },
  {
    keyword: "本番ワークロードに専用処理帯域を予約し、上限超過分だけ標準従量デプロイへ自動逃がす構成",
    category: "計画・管理・ガバナンス",
    recommended: "PTU ＋ Spillover（スピルオーバー）",
    reason: "定常トラフィックの低遅延保証とピーク時 HTTP 429 エラーの回避を両立します。",
  },
  {
    keyword: "AI エージェントの推論〜検索〜ツール呼出の因果連鎖を相関 ID とスパンで可視化する基盤",
    category: "計画・管理・ガバナンス",
    recommended: "Foundry Tracing（OpenTelemetry + Application Insights）",
    reason: "マルチステップ処理のボトルネックやツールエラー箇所をエンドツーエンドで追跡できます。",
  },
  {
    keyword: "LLM の生成結果に一定の再現性・決定論的振る舞いを求めるときに低く設定する推論パラメータ",
    category: "生成AI・RAG",
    recommended: "temperature（0.0〜0.2 付近に設定）",
    reason: "確率分布の尖鋭化により、事実ベースの回答や構造化抽出でのばらつきを抑えます。",
  },
  {
    keyword: "LLM の出力を必ず指定した JSON スキーマ構造に厳格準拠させる API 機能",
    category: "生成AI・RAG",
    recommended: "Structured Outputs（response_format: json_schema）",
    reason: "後続プログラムでの JSON パース失敗や型不一致を防ぎます。",
  },
  {
    keyword: "型番等のキーワード一致（BM25）と意味ベクトル検索を融合し L2 再順位付けで RAG 精度を最大化する方式",
    category: "生成AI・RAG",
    recommended: "ハイブリッド検索 ＋ セマンティック ランキング",
    reason: "Azure AI Search で単一検索の弱点を補い、最も根拠性の高いチャンクを上位に返せます。",
  },
  {
    keyword: "RAG 応答において利用者が閲覧権限を持たない社内文書が検索結果へ混入するのを防ぐ実装",
    category: "生成AI・RAG",
    recommended: "セキュリティ メタデータ付与 ＋ クエリ時 filter（セキュリティ トリミング）",
    reason: "検索インデックス取得段階で認可済みドキュメントのみに絞り込みます。",
  },
  {
    keyword: "RAG で外部文書を読み込む際に埋め込まれた間接的プロンプトインジェクション（XPIA）を検知・遮断する機能",
    category: "生成AI・RAG",
    recommended: "Azure AI Content Safety Prompt Shields（Document Attacks）",
    reason: "外部ドキュメント内の悪意ある命令によるエージェントやモデルの乗っ取りを防ぎます。",
  },
  {
    keyword: "Foundry プロジェクトからエージェント作成・スレッド管理・ツール連携を一元操作する Python クライアント",
    category: "エージェント・オーケストレーション",
    recommended: "AIProjectClient（azure-ai-projects）",
    reason: "エンドポイント接続・エージェント実行・組み込み/外部ツール定義を統一 API で扱えます。",
  },
  {
    keyword: "外部のツールサーバーや社内データ基盤へ標準プロトコルで疎結合接続し承認制御も行えるエージェントツール",
    category: "エージェント・オーケストレーション",
    recommended: "McpTool（Model Context Protocol）",
    reason: "リモート MCP サーバー上のツールを自動発見・呼び出しでき、`require_approval` で人間承認も挟めます。",
  },
  {
    keyword: "エージェントに CSV 集計・統計計算・グラフ画像生成などを隔離環境で安全に実行させる組み込みツール",
    category: "エージェント・オーケストレーション",
    recommended: "CodeInterpreterTool",
    reason: "LLM による数値の誤算を防ぎ、動的な Python コード実行で正確な演算結果を返せます。",
  },
  {
    keyword: "エージェントの回答が参照ソースに忠実か・安全かを定量スコアで自動検証する仕組み",
    category: "エージェント・オーケストレーション",
    recommended: "Foundry Evaluators（Groundedness / Relevance / Safety）",
    reason: "CI/CD や本番サンプリングでハルシネーションや安全基準逸脱を早期検知できます。",
  },
  {
    keyword: "テキストの検索クエリと画像データを同じベクトル空間に変換してクロスモーダル検索を実現する機能",
    category: "コンピュータービジョン",
    recommended: "Azure AI Vision マルチモーダル埋め込み（vectorizeImage / vectorizeText）",
    reason: "画像のタグ事前付与なしでも自然言語での意味的な画像検索を構築できます。",
  },
  {
    keyword: "独自の製造不良画像を学習し、Docker コンテナや ONNX としてエッジ環境へエクスポートできるビジョン基盤",
    category: "コンピュータービジョン",
    recommended: "Azure AI Custom Vision（Compact ドメイン）",
    reason: "コンパクトドメイン学習によりクラウド非接続のエッジ端末上での低遅延推論に対応します。",
  },
  {
    keyword: "動画ファイルから音声文字起こし・画面内テロップ OCR・話者・登場シーンを一括で時系列抽出するサービス",
    category: "コンピュータービジョン",
    recommended: "Azure AI Video Indexer",
    reason: "映像と音声の複合分析により動画アーカイブの検索やチャプター生成を自動化できます。",
  },
  {
    keyword: "顧客フィードバックを LLM やデータベースへ送る前に氏名・電話番号・口座番号等を自動検出して伏せ字化する機能",
    category: "テキスト分析・音声",
    recommended: "Azure AI Language（PII 検出 / Redaction）",
    reason: "プライバシー保護とコンプライアンス遵守のため機微情報を決定論的にマスクします。",
  },
  {
    keyword: "ユーザーの発話から実行意図（Intent）と日時・場所などの固有パラメータ（Entity）を抽出するサービス",
    category: "テキスト分析・音声",
    recommended: "会話言語理解（CLU: Conversational Language Understanding）",
    reason: "業務コマンドや対話アプリのアクション判定・パラメータ抽出に最適化されています。",
  },
  {
    keyword: "音声合成（TTS）で特定の固有名詞の発音・話速・強調・無音ポーズを XML タグで精密制御するマークアップ",
    category: "テキスト分析・音声",
    recommended: "SSML（Speech Synthesis Markup Language）",
    reason: "Azure AI Speech の `speak_ssml_async` 等で読み上げ品質を細かくカスタマイズできます。",
  },
  {
    keyword: "Word・PDF・PowerPoint などの書式やレイアウトを保持したまま複数言語へ一括変換する翻訳機能",
    category: "テキスト分析・音声",
    recommended: "Azure AI Translator（Document Translation）",
    reason: "Blob Storage 等と連携し文書のデザインや表構造を崩さずバッチ/同期翻訳を行えます。",
  },
  {
    keyword: "複雑な表や段落・チェックボックスを含む PDF を解析し RAG 向けに整った Markdown 形式で出力するモデル",
    category: "情報抽出",
    recommended: "Azure AI Document Intelligence（prebuilt-layout）",
    reason: "単なる文字順 OCR と異なり表構造や見出し階層を保ったままチャンク化用データを生成できます。",
  },
  {
    keyword: "文書・画像・音声・動画を統一的に扱い、事前バウンディングボックス学習なしでカスタム JSON スキーマ抽出を行う基盤",
    category: "情報抽出",
    recommended: "Azure Content Understanding（Custom Analyzer）",
    reason: "ベースアナライザーと自然言語フィールド定義を組み合わせマルチモーダル構造化抽出を行えます。",
  },
];

export const ai103PracticeQuestions: CertQuestion[] = [
  // Domain 1: Plan and manage an Azure AI solution (4 questions: 3 single, 1 multi)
  {
    id: "ai103-q1",
    domainId: "ai103-domain-1",
    domainLabel: "01: 計画と管理",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Python で開発した Web アプリケーションから、Microsoft Foundry プロジェクトにデプロイされた GPT モデルと Azure AI Search へ安全に接続したいと考えています。本番環境における資格情報管理および Azure RBAC 設定のベストプラクティスとして最も適切なものはどれですか？",
    options: [
      "ポータルから取得した API キーを Python ソースコード内の定数として直接記述し、リソースグループに `Contributor` ロールを割り当てる",
      "アプリにシステム割り当てマネージド ID を有効化し、コードでは `DefaultAzureCredential` を使用して、AI リソースのデータプレーン用ロール（`Foundry User` / `Search Index Data Reader` 等）を割り当てる",
      "パブリック ネットワーク アクセスを全 IP 許可にしたうえで、閲覧者（Reader）ロールのみをマネージド ID に割り当てて推論を実行する",
      "開発者個人の Entra ID パスワードを環境変数へハードコードし、Owner ロールで接続する",
    ],
    correctIndices: [1],
    explanation:
      "API キーのコード直書きは漏洩リスクが高く、また `Contributor` や `Reader` といった管理プレーンロールには推論・検索のデータプレーン権限が含まれません。マネージド ID ＋ `DefaultAzureCredential` ＋最小権限のデータプレーンロールの組み合わせが標準推奨です。",
    keywords: ["DefaultAzureCredential", "マネージド ID", "Foundry User"],
  },
  {
    id: "ai103-q2",
    domainId: "ai103-domain-1",
    domainLabel: "01: 計画と管理",
    difficulty: "標準",
    selectCount: 1,
    question:
      "社内の複数プロジェクトチームが Microsoft Foundry を利用するにあたり、全チーム共通のマネージド仮想ネットワーク（VNet）・Private Endpoint 設定・共通ストレージ接続・オープンソースモデルのファインチューニング環境を一元管理したうえで、プロジェクトごとに作業境界を分離したいと考えています。適切な構成単位はどれですか？",
    options: [
      "全チームで単一の API キーを共有し、同じ 1 つのプロジェクト内に全アプリを混在させる",
      "Azure AI Video Indexer リソースのみを作成して全プロジェクトの VNet 基盤にする",
      "共有設定を統制する AI Hub を作成し、その配下に各チーム用のハブベースプロジェクトを作成する",
      "クライアント PC のローカル環境ごとに異なるサブスクリプションを都度新規作成する",
    ],
    correctIndices: [2],
    explanation:
      "AI Hub は複数のプロジェクト間で共有のネットワーク分離設定・接続・コンピューティング・ガバナンスを一元管理し継承させるための上位リソースです（プロジェクトごとにアクセス制御や実験資産を分離できます）。",
    keywords: ["AI Hub", "Foundry プロジェクト", "ガバナンス"],
  },
  {
    id: "ai103-q3",
    domainId: "ai103-domain-1",
    domainLabel: "01: 計画と管理",
    difficulty: "応用",
    selectCount: 1,
    question:
      "24 時間稼働する本番カスタマーサポート向け LLM エンドポイントで、定常負荷に対して低遅延かつ確定スループットを保証するためプロビジョニング済みスループット（PTU）を導入しました。突発的なアクセス急増によって PTU 予約帯域を超過した際も HTTP 429 エラーで顧客要求を失敗させず、余剰分だけ従量課金へ自動で逃がしたい場合、構成すべき機能はどれですか？",
    options: [
      "PTU デプロイに対してペアとなる標準（Standard / Global Standard）デプロイを指定し、スピルオーバー（Spillover）を有効化する",
      "モデルの `temperature` を `0.0` に固定してトークン課金を無制限化する",
      "すべてのリクエストを毎回 Batch API へ切り替えて 24 時間後に結果を返す",
      "Foundry のプロンプトキャッシュを削除し、毎回システムプロンプトを 10 倍の長さにする",
    ],
    correctIndices: [0],
    explanation:
      "PTU のスピルオーバー（Spillover）を構成すると、PTU の予約帯域を超過したトラフィックのみを標準（Standard / Global Standard）従量課金デプロイへ自動転送し、429 によるサービス断を防止できます。",
    keywords: ["PTU", "Spillover", "HTTP 429 対策"],
  },
  {
    id: "ai103-q4",
    domainId: "ai103-domain-1",
    domainLabel: "01: 計画と管理",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Microsoft Foundry で構築したエージェント アプリケーションを本番運用へ移行する際、障害調査のための分散トレーシングおよび責任ある AI の安全性・品質モニタリングとして正しい実装方針を 2 つ選択してください。",
    options: [
      "OpenTelemetry ベースの Foundry トレーシングと Application Insights を連携し、相関 ID でユーザー要求から検索・ツール呼出・LLM 応答までのスパンとレイテンシを追跡する",
      "トレーシングの利便性のため、顧客のクレジットカード番号やパスワードを含む生のプロンプト全文を無制限に公開ログへ平文出力する",
      "Azure AI Content Safety のカテゴリ別フィルタに加え、Prompt Shields と Foundry Evaluators（Groundedness / Safety）を組み合わせて攻撃耐性と根拠性を検証する",
      "責任ある AI 対策としてシステムプロンプトに「悪いことを言わないで」と 1 行書けば、技術的な安全性評価やフィルタリングは一切不要になる",
    ],
    correctIndices: [0, 2],
    explanation:
      "Foundry トレーシング（OpenTelemetry + Application Insights）によるエンドツーエンドの因果追跡と、Content Safety（Prompt Shields 含む）＋ Foundry Evaluators による多層評価が推奨されます。ログへの機微情報平文出力はセキュリティ違反です。",
    keywords: ["OpenTelemetry", "Foundry Tracing", "Prompt Shields", "Evaluators"],
  },

  // Domain 2: Implement generative AI and agentic solutions (4 questions: 3 single, 1 multi)
  {
    id: "ai103-q5",
    domainId: "ai103-domain-2",
    domainLabel: "02: 生成 AI とエージェント",
    difficulty: "標準",
    selectCount: 1,
    question:
      "社内マニュアルや仕様書を統合検索する RAG アプリケーションを Azure AI Search で構築しています。ユーザーは「エラーコード E-402 の復旧手順」のような正確な型番・コードを含む質問もすれば、「ネットワークに繋がらないときの対処は？」といった言い換えを含む自然な質問も行います。検索再現率とトップ順位の精度を最大化するための検索方式はどれですか？",
    options: [
      "ベクター検索を完全に無効化し、完全一致の正規表現検索のみを使用する",
      "キーワード検索を無効化し、1 ドキュメント全体を分割せず 1 ベクトルだけ登録する",
      "Azure AI Search を使わず、毎回のプロンプトに社内マニュアル全ページを丸ごと貼り付ける",
      "BM25 キーワード検索と Embeddings ベクター検索を組み合わせた「ハイブリッド検索」に、L2 再順位付けを行う「セマンティック ランキング」を併用する",
    ],
    correctIndices: [3],
    explanation:
      "型番・コード等の厳密語句一致に強いキーワード検索（BM25）と、類義語・意味理解に強いベクター検索を統合する「ハイブリッド検索」に、「セマンティック ランキング」の L2 再順位付けを組み合わせるのが Azure AI Search 本番 RAG の標準解です。",
    keywords: ["ハイブリッド検索", "セマンティック ランキング", "Azure AI Search"],
  },
  {
    id: "ai103-q6",
    domainId: "ai103-domain-2",
    domainLabel: "02: 生成 AI とエージェント",
    difficulty: "標準",
    selectCount: 1,
    question:
      "Microsoft Foundry Agent Service と Python SDK（`azure-ai-projects`）を用いてデータ分析アシスタントを構築しています。ユーザーがアップロードした売上 CSV ファイルを読み込み、正確な四則演算・集計統計・棒グラフ画像ファイルをその場で生成して返却したい場合、エージェントに付与すべき組み込みツールはどれですか？",
    options: [
      "`BingGroundingTool`（公開 Web 検索のみ）",
      "`CodeInterpreterTool`（隔離されたサンドボックスでの Python コード生成・実行）",
      "Azure AI Translator（テキスト多言語翻訳のみ）",
      "Custom Vision（画像分類モデル学習のみ）",
    ],
    correctIndices: [1],
    explanation:
      "LLM は単体では複雑な数値集計やグラフ描画に弱いため、Foundry Agent Service の `CodeInterpreterTool` を有効化することで、安全なサンドボックス上で Python スクリプトを実行して正確な計算結果やグラフ画像を生成できます。",
    keywords: ["CodeInterpreterTool", "Foundry Agent Service", "Python SDK"],
  },
  {
    id: "ai103-q7",
    domainId: "ai103-domain-2",
    domainLabel: "02: 生成 AI とエージェント",
    difficulty: "応用",
    selectCount: 1,
    question:
      "エージェント アプリケーションから社内の複数のリモート ツール基盤（チケット管理・ドキュメント検索・承認システム等）へ接続する際、ツールごとに個別のプロプライエタリな関数スキーマを毎回手動で作り直すのではなく、標準化されたオープンプロトコルでツール一覧を動的に取得し、重要操作前に承認ゲート（`require_approval`）を挟めるツール連携方式はどれですか？",
    options: [
      "Azure AI Document Intelligence の `prebuilt-receipt` モデル",
      "Azure AI Speech の `SpeechSynthesizer`",
      "`McpTool`（Model Context Protocol によるリモート MCP サーバー接続）",
      "プロンプトの `max_tokens` を 100 に下げる設定",
    ],
    correctIndices: [2],
    explanation:
      "MCP（Model Context Protocol）はモデル/エージェントと外部ツール・コンテキストを接続するオープン標準であり、Foundry Agent Service の `McpTool` を使うことでリモート MCP サーバーのツールを疎結合に統合し承認制御も行えます。",
    keywords: ["MCP", "McpTool", "ツール連携"],
  },
  {
    id: "ai103-q8",
    domainId: "ai103-domain-2",
    domainLabel: "02: 生成 AI とエージェント",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Microsoft Foundry でチャット・構造化抽出・RAG アプリを実装する際のモデルパラメータおよび API 設計について、正しい記述を 2 つ選択してください。",
    options: [
      "最新の社内商品価格をモデルに答えさせるには、RAG よりもモデル重みを更新するファインチューニングの方が常に低コストで更新が容易である",
      "業務システム連携のために LLM の出力を必ず指定 JSON 構造（型・必須項目）に厳格一致させたい場合は、`response_format` に JSON Schema を渡す Structured Outputs を利用する",
      "RAG システムでユーザーの閲覧権限外の文書が回答に引用されないようにするには、`temperature` を 2.0 に上げれば自動的に解決する",
      "FAQ 回答や情報抽出のように一貫性と再現性を重視するタスクでは `temperature` を低く（例：`0.0`〜`0.2`）設定し、アイデア創出のように多様性が必要な場合のみ高く設定する",
    ],
    correctIndices: [1, 3],
    explanation:
      "Structured Outputs（JSON Schema）で出力形式を保証でき、決定性・再現性重視なら `temperature` を下げます。最新・固有知識の参照はファインチューニングではなく RAG が適切であり、アクセス制御には Azure AI Search のクエリ時セキュリティ `filter` が必須です。",
    keywords: ["Structured Outputs", "temperature", "RAG 設計"],
  },

  // Domain 3: Implement computer vision solutions (4 questions: 3 single, 1 multi)
  {
    id: "ai103-q9",
    domainId: "ai103-domain-3",
    domainLabel: "03: コンピューター ビジョン",
    difficulty: "標準",
    selectCount: 1,
    question:
      "数万枚の製品写真・素材写真を管理するデータベースに対して、ユーザーが「赤い金属製のギアが写っている写真」のように自由な自然言語テキストを入力し、意味的に最も一致する画像を検索できるようにしたいと考えています。事前タグ付けを行わずに画像とテキストを同一空間で照合できる Azure AI Vision の機能はどれですか？",
    options: [
      "Azure AI Vision マルチモーダル埋め込み（`vectorizeImage` / `vectorizeText`）による画像・テキストのベクトル化とベクター検索連携",
      "Azure AI Speech の Speech-to-Text API",
      "Azure AI Language の感情分析（Sentiment Analysis）",
      "Azure AI Translator の文字種変換（Transliteration）",
    ],
    correctIndices: [0],
    explanation:
      "Azure AI Vision のマルチモーダル埋め込み（Multimodal Embeddings）を使うと、画像とテキストを共通の意味ベクトル空間へ変換できるため、Azure AI Search 等と組み合わせてテキストによる高精度な類似画像検索を実現できます。",
    keywords: ["マルチモーダル埋め込み", "Azure AI Vision", "画像検索"],
  },
  {
    id: "ai103-q10",
    domainId: "ai103-domain-3",
    domainLabel: "03: コンピューター ビジョン",
    difficulty: "標準",
    selectCount: 1,
    question:
      "製造工場のカメラ映像から自社独自部品の微細な表面傷を判定するため、Azure AI Custom Vision で独自の画像分類モデルを構築します。クラウドへのネットワーク接続が不安定な工場内エッジデバイス（Docker コンテナ / ONNX ランタイム）へ学習済みモデルをエクスポートしてオフライン推論を実行したい場合、プロジェクト作成時または設定時に必須となる条件はどれですか？",
    options: [
      "プロジェクトの種別を「音声翻訳」に変更して学習する",
      "プロジェクトのドメイン（Domain）設定で Compact 系ドメイン（例：`General (compact)`）を選択してモデルを学習する",
      "Azure AI Search のインデクサーで画像を圧縮する",
      "モデルをエクスポートせず、毎回クラウドの GPT モデルへ生動画を送信する",
    ],
    correctIndices: [1],
    explanation:
      "Azure AI Custom Vision でモデルを ONNX・TensorFlow・CoreML・Docker コンテナ等へエクスポートしてエッジ推論するには、軽量なモデル構造を用いる Compact 系ドメインを選択して学習する必要があります。",
    keywords: ["Custom Vision", "Compact ドメイン", "エッジデプロイ"],
  },
  {
    id: "ai103-q11",
    domainId: "ai103-domain-3",
    domainLabel: "03: コンピューター ビジョン",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "研修用・広報用の動画アーカイブ（MP4 等）から、発話の自動文字起こし（トランスクリプト）、動画画面内に表示されるスライド文字（OCR）、登場人物・話者の切り替わり、およびシーンごとのトピックを時系列メタデータとして自動抽出して動画内検索を可能にしたい場合、最適なサービスはどれですか？",
    options: [
      "Azure AI Document Intelligence（`prebuilt-invoice`）",
      "Azure AI Language（PII 検出）",
      "Foundry `CodeInterpreterTool`",
      "Azure AI Video Indexer",
    ],
    correctIndices: [3],
    explanation:
      "Azure AI Video Indexer は映像（OCR・シーン・オブジェクト・顔）と音声（文字起こし・話者識別・感情・トピック）のマルチモーダル分析を統合し、動画の時系列インサイトを抽出・検索可能にします。",
    keywords: ["Azure AI Video Indexer", "動画解析", "OCR"],
  },
  {
    id: "ai103-q12",
    domainId: "ai103-domain-3",
    domainLabel: "03: コンピューター ビジョン",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Azure AI Vision 4.0 SDK（`ImageAnalysisClient`）および視覚 AI ソリューションの実装について、正しい記述を 2 つ選択してください。",
    options: [
      "1 回の `analyze` API 呼び出しで `VisualFeatures` に複数項目（例：`CAPTION`, `TAGS`, `OBJECTS`, `READ`）を指定して一括取得できる",
      "EC 商品画像から背景を切り抜く Background Removal 機能は存在せず、必ず Custom Vision でピクセル分類を自前学習する必要がある",
      "Azure AI Face の標準機能は感情推定（怒り・喜び等）と年齢推測を提供しており、個人識別にも事前審査は一切不要である",
      "Read OCR（`VisualFeatures.READ`）は画像内の印刷文字および手書き文字を行・単語のテキストと境界ポリゴン座標で抽出する",
    ],
    correctIndices: [0, 3],
    explanation:
      "Azure AI Vision 4.0 の `ImageAnalysisClient` は複数の `VisualFeatures` を 1 リクエストで組み合わせ実行でき、Read OCR や Background Removal（背景削除）を標準提供します。なお Azure AI Face は感情・属性推測が廃止され、個人識別は Limited Access 承認制です。",
    keywords: ["ImageAnalysisClient", "VisualFeatures", "Read OCR"],
  },

  // Domain 4: Implement text analysis solutions (4 questions: 3 single, 1 multi)
  {
    id: "ai103-q13",
    domainId: "ai103-domain-4",
    domainLabel: "04: テキスト分析",
    difficulty: "基礎",
    selectCount: 1,
    question:
      "顧客サポートチャットボットが受け取った問い合わせテキストを外部の分析基盤や LLM へ送信する前に、テキスト中に含まれる顧客の氏名・電話番号・住所・クレジットカード番号などの個人識別情報を確実に検出し、アスタリスク（`*`）等へ自動置換して匿名化（墨消し）したい場合、使用すべき Azure AI Language の機能はどれですか？",
    options: [
      "キーフレーズ抽出（Key Phrase Extraction）",
      "抽象型テキスト要約（Abstractive Summarization）",
      "PII（個人を特定できる情報）検出とマスク処理（`redacted_text`）",
      "言語検出（Language Detection）",
    ],
    correctIndices: [2],
    explanation:
      "Azure AI Language（`TextAnalyticsClient`）の PII 検出機能は、事前定義カテゴリに基づいて個人機微情報を高精度に検出し、マスク済みテキスト（`redacted_text`）を返却できます。",
    keywords: ["PII 検出", "Redaction", "Azure AI Language"],
  },
  {
    id: "ai103-q14",
    domainId: "ai103-domain-4",
    domainLabel: "04: テキスト分析",
    difficulty: "標準",
    selectCount: 1,
    question:
      "業務支援エージェントのフロントエンドで、「明日の午後 3 時に大阪支店の会議室 B を予約して」というユーザーの自然言語発話から、実行すべきアクション「会議室予約（Intent）」と、日時・拠点・部屋名などの引数（Entity）を高精度に抽出したい場合、適した Azure AI Language の機能はどれですか？",
    options: [
      "カスタム質問応答（Custom Question Answering）",
      "会話言語理解（CLU: Conversational Language Understanding）",
      "Azure AI Translator（Document Translation）",
      "Azure AI Document Intelligence（`prebuilt-layout`）",
    ],
    correctIndices: [1],
    explanation:
      "ユーザーの発話（Utterance）から目的（Intent）と抽出パラメータ（Entity）を予測するカスタム自然言語理解モデルには会話言語理解（CLU）を使用します。FAQ 文書からの応答には Custom Question Answering を使います。",
    keywords: ["CLU", "Intent", "Entity"],
  },
  {
    id: "ai103-q15",
    domainId: "ai103-domain-4",
    domainLabel: "04: テキスト分析",
    difficulty: "標準",
    selectCount: 1,
    question:
      "英語・スペイン語・日本語で作成された大量の製品マニュアル（Word `.docx` および PDF ファイル）について、見出し・表組み・箇条書き・画像配置などの元のドキュメント書式とレイアウトを完全に保持したまま多言語へ一括翻訳したい場合、最も適した Azure サービス機能はどれですか？",
    options: [
      "Azure AI Translator の Document Translation（ドキュメント翻訳）",
      "Azure AI Speech の `SpeechRecognizer`（Speech-to-Text）",
      "Azure AI Language の固有表現認識（NER）",
      "Azure AI Vision の Dense Captions",
    ],
    correctIndices: [0],
    explanation:
      "テキスト文字列のみを変換する Text Translation とは異なり、Azure AI Translator の Document Translation は Blob Storage 等上の `.docx` / `.pdf` / `.xlsx` ファイルの構造と書式を維持したまま翻訳済みドキュメントを生成できます。",
    keywords: ["Document Translation", "Azure AI Translator", "書式保持"],
  },
  {
    id: "ai103-q16",
    domainId: "ai103-domain-4",
    domainLabel: "04: テキスト分析",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Azure AI Speech および Azure AI Language の実装仕様として、正しい記述を 2 つ選択してください。",
    options: [
      "Azure AI Language の感情分析では文章全体のスコアのみ返され、特定の製品属性や対象語ごとの評価（オピニオンマイニング）は一切取得できない",
      "Text-to-Speech（TTS）で音声合成する際、SSML（Speech Synthesis Markup Language）を用いることで固有名詞の発音・話速・強調・無音ポーズ（`<break>`）を細かく制御できる",
      "Azure AI Speech の `TranslationRecognizer` を用いると、話者の音声認識（STT）とターゲット言語へのリアルタイム翻訳を単一の音声パイプラインで実行できる",
      "Custom Speech を利用しても業界固有の専門用語や製品名の音声認識精度を向上させることはできない",
    ],
    correctIndices: [1, 2],
    explanation:
      "TTS の細かな読み上げ制御には SSML、音声の直接翻訳には `TranslationRecognizer`、専門用語・背景ノイズ適応には Custom Speech が用意されています。また Azure AI Language の感情分析はオピニオンマイニングにより対象ごとの評価も抽出可能です。",
    keywords: ["SSML", "TranslationRecognizer", "Azure AI Speech"],
  },

  // Domain 5: Implement information extraction solutions (4 questions: 3 single, 1 multi)
  {
    id: "ai103-q17",
    domainId: "ai103-domain-5",
    domainLabel: "05: 情報抽出",
    difficulty: "標準",
    selectCount: 1,
    question:
      "複雑な複数段組レイアウト、結合セルを含む表（テーブル）、チェックボックス（選択マーク）が混在する技術仕様書 PDF を RAG パイプラインへ取り込むため、文書の段落構造や表の意味を損なわずに LLM が扱いやすい Markdown 形式へ変換したいと考えています。最も適した Azure AI Document Intelligence のモデルはどれですか？",
    options: [
      "`prebuilt-businessCard`（名刺モデル）",
      "`prebuilt-layout`（レイアウト モデル・Markdown 出力形式指定）",
      "Azure AI Custom Vision（画像分類モデル）",
      "Azure AI Translator（リアルタイムテキスト翻訳）",
    ],
    correctIndices: [1],
    explanation:
      "`prebuilt-layout` モデルはテキストだけでなく段落・見出し・表構造（行・列・セル結合）・選択マークを解析し、RAG チャンキングに最適な Markdown 形式として出力できます。",
    keywords: ["Document Intelligence", "prebuilt-layout", "Markdown 出力"],
  },
  {
    id: "ai103-q18",
    domainId: "ai103-domain-5",
    domainLabel: "05: 情報抽出",
    difficulty: "標準",
    selectCount: 1,
    question:
      "取引先ごとに書式・表の位置・ページ数が大きく異なる多種多様な非定型契約書 PDF から、「契約締結日」「契約金額」「解約通知期限」などの共通項目を構造化抽出したいと考えています。固定レイアウトを前提とするカスタム テンプレート モデルではなく、レイアウト変動に強く文脈を踏まえて抽出できるモデルはどれですか？",
    options: [
      "Azure AI Vision のスマートトリミング（Smart Crops）",
      "Azure AI Speech の話者分離（Diarization）",
      "CLU の正規表現エンティティのみ",
      "Azure AI Document Intelligence のカスタム ニューラル モデル（Custom Neural Model）",
    ],
    correctIndices: [3],
    explanation:
      "固定位置の同一書式に高速・低コストで適する Custom Template モデルに対し、Custom Neural モデルはディープラーニングによりレイアウトや構造が大きく異なる非定型文書からも同一フィールドを高精度に抽出できます。",
    keywords: ["Custom Neural Model", "非定型文書", "Document Intelligence"],
  },
  {
    id: "ai103-q19",
    domainId: "ai103-domain-5",
    domainLabel: "05: 情報抽出",
    difficulty: "応用",
    selectCount: 1,
    question:
      "ドキュメント（PDF/画像）に加えて、顧客通話の音声録音ファイルや説明動画ファイルなど複数モダリティの資産を単一プラットフォームで処理し、事前のバウンディングボックス学習ラベル付けを行わずに自然言語のフィールド説明付きスキーマ定義だけで構造化 JSON を抽出したい場合、適したサービスはどれですか？",
    options: [
      "Azure AI Face の顔境界ボックス検出",
      "Azure AI Language の言語検出 API のみ",
      "Azure Content Understanding（ベース アナライザー ＋ カスタム スキーマ アナライザー）",
      "Azure Load Balancer（Standard SKU）",
    ],
    correctIndices: [2],
    explanation:
      "Azure Content Understanding はドキュメント・画像・音声・動画のマルチモーダル解析に対応し、`prebuilt-document` / `prebuilt-audio` / `prebuilt-video` 等をベースにカスタム スキーマ（フィールド説明と型定義）を定義して柔軟な構造化抽出を実行できます。",
    keywords: ["Azure Content Understanding", "マルチモーダル", "カスタムアナライザー"],
  },
  {
    id: "ai103-q20",
    domainId: "ai103-domain-5",
    domainLabel: "05: 情報抽出",
    difficulty: "応用",
    selectCount: 2,
    question:
      "Azure AI Document Intelligence を用いた実業務向けの文書処理パイプライン設計について、正しい実装プラクティスを 2 つ選択してください。",
    options: [
      "1 つのスキャン PDF 内に請求書・発注書・領収書など複数種類の書類が連続して綴じられている場合は、前段にカスタム分類モデル（Custom Classification）を配置して書類境界の分割と種別判定を行ってから抽出モデルへ渡す",
      "抽出結果の各フィールドに返される信頼度スコア（`confidence`）を評価し、閾値未満の項目だけ人手確認（Human-in-the-Loop）へ振り分けることで精度と業務効率を両立する",
      "事前構築済みの請求書モデル（`prebuilt-invoice`）を利用する場合でも、必ず自社で 500 枚以上の学習画像に手動でバウンディングボックスを付与して再学習する必要がある",
      "`DocumentIntelligenceClient` はすべての文書解析を同期的な HTTP GET 1 回で即座に完了するため、非同期ポーリング（LRO）は存在しない",
    ],
    correctIndices: [0, 1],
    explanation:
      "複数書類の混在 PDF にはカスタム分類モデルによる仕分け・分割が有効であり、`confidence` スコア閾値で自動確定と人手レビューを分岐させるのが実務の定石です。`prebuilt-invoice` は事前学習不要で即利用でき、API は通常非同期の Long-Running Operation（`begin_analyze_document`）として実行します。",
    keywords: ["カスタム分類モデル", "信頼度スコア", "DocumentIntelligenceClient"],
  },
];

export const ai103OfficialResources: AzureOfficialResource[] = [
  {
    title: "Microsoft Certified: Azure AI Apps and Agents Developer Associate 認定ページ",
    description: "Exam AI-103 認定資格の概要、対象ロール（Python / Microsoft Foundry）、受験要件の公式ハブです。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/azure-ai-apps-and-agents-developer-associate/",
    badge: "公式認定ページ",
  },
  {
    title: "Exam AI-103 公式試験ガイド (Study Guide)",
    description: "5 つの出題ドメイン（計画と管理 / 生成 AI とエージェント / ビジョン / テキスト / 情報抽出）の配点と測定スキルの一次情報です。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/resources/study-guides/ai-103",
    badge: "公式試験ガイド",
  },
  {
    title: "Exam AI-103 試験詳細・模擬評価ページ",
    description: "Exam AI-103（旧 AI-102 後継）の試験予約・Microsoft Learn 試験中参照ルール・無料模擬評価にアクセスできます。",
    url: "https://learn.microsoft.com/ja-jp/credentials/certifications/exams/ai-103/",
    badge: "試験詳細・模擬",
  },
  {
    title: "Course AI-103T00-A 公式トレーニング コース",
    description: "Microsoft Foundry を用いた AI アプリ・エージェント開発の公式ラーニングパスとハンズオン演習モジュールです。",
    url: "https://learn.microsoft.com/ja-jp/training/courses/ai-103t00-a",
    badge: "公式トレーニング",
  },
];
