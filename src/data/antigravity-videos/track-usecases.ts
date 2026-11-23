// Track 5 (usecases: 14本)
// 出どころ: YouTube 公式チャンネル (@googleantigravity / UC_eVxIPHFZm7oF_gET0x-8Q)
// 取得手段: yt-dlp 一次メタデータ・概要欄・字幕取得（取得日: 2026-11-23）

import type { AntigravityVideo } from "./types";

export const usecaseVideos: AntigravityVideo[] = [
  {
    id: "Li3fV7uA8Ww",
    recommendedOrder: 49,
    title: "Building a real-time AI language tutor",
    jaTitle: "リアルタイム AI 語学チューター「XR Language Teacher」の構築",
    format: "video",
    track: "usecases",
    availability: "public",
    uploadDate: "2026-11-18",
    durationSeconds: 183,
    summary:
      "Google AI Edge Gallery に収録された 100% オフライン動作のオンデバイス語学チューター「XR Language Teacher」を、Antigravity で構築した事例です。手描きフローチャートの写真から実装計画を立て、ASR・Gemma 4・TTS の 3 パイプライン統合や Figma MCP によるデザインコンポーネント直結を実現しています。",
    takeaways: [
      "手描きフローチャートの写真を Antigravity へアップロードし、段階的な実装計画を立案して素早くプロトタイプ化できる",
      "音声認識（ASR）→ Gemma 4 による推論 → 音声合成（TTS）という 3 つのオンデバイス AI パイプラインを統合し、完全オフラインで動作する",
      "Figma MCP を活用することで、Figma 上の UI デザインとエンジニアリング側の実コンポーネントを直接マッピングして開発を進められる",
    ],
    quiz: {
      question: "「XR Language Teacher」の推論処理（思考パート）を担い、完全オフライン動作を実現しているモデルとデザイン連携手段の組合せはどれですか？",
      choices: [
        "クラウド版 Gemini API と画像手動スライス書き出し",
        "オンデバイスの Gemma 4 と Figma MCP ツール",
        "WebGPU 専用推論エンジンとメール添付の仕様書",
      ],
      answerIndex: 1,
      explanation:
        "XR Language Teacher は ASR・Gemma 4・TTS の 3 パイプラインにより 100% オフラインで動作し、Figma MCP を介してデザインと実コードのコンポーネントを直接接続しています。",
    },
    tags: ["On-Device AI", "Gemma 4", "Google AI Edge", "Figma MCP", "ASR/TTS"],
  },
  {
    id: "RwvHbdHeeqU",
    recommendedOrder: 50,
    title: "Building Antigravity Demos with Antigravity",
    jaTitle: "Antigravity 自身で高品質な製品デモ動画を自律制作する",
    format: "video",
    track: "usecases",
    availability: "public",
    uploadDate: "2026-11-10",
    durationSeconds: 76,
    summary:
      "新機能のリリース速度に合わせてドキュメントとデモ動画を最新化し続けるため、専門エージェント群（マルチエージェント）で Antigravity のデモを制作する仕組みを紹介します。AI が架空映像を生成するのではなく、実際の Antigravity CLI/SDK や Blender をエージェントが操作・録画し、編集・音声収録・品質レビューまで分担します。",
    takeaways: [
      "構成・ナラティブ担当、CLI/SDK 操作担当、ナレーション担当、品質レビュー担当など役割別の複数エージェントで動画制作を分業している",
      "動画そのものを生成 AI で描画するのではなく、エージェントが実際の Antigravity や 3D ツール（Blender 等）を駆動して画面収録する方式を採る",
      "Carbon の活用により、新機能リリースに追従してドキュメントや高品質デモを迅速に展開できるようになった",
    ],
    quiz: {
      question: "この動画で紹介されているエージェントチームのデモ制作方式の特徴として正しいものはどれですか？",
      choices: [
        "画面録画を行わず、動画生成モデルだけで架空の UI 映像を合成する",
        "単一の巨大プロンプトで 1 体のエージェントに全工程を直列実行させる",
        "エージェントが実際の Antigravity CLI/SDK や Blender 等を自動操作・録画し、編集やレビューまで分担する",
      ],
      answerIndex: 2,
      explanation:
        "映像を直接生成するのではなく、エージェントが実際の Antigravity アプリ CLI や SDK、Blender を使ったリグを自律操作して録画し、レビューや音響調整まで分担している点が特徴です。",
    },
    tags: ["Carbon", "Multi-Agent", "CLI/SDK", "Blender", "Demo Automation"],
  },
  {
    id: "afQqqcmLUWw",
    recommendedOrder: 51,
    title: "Accelerating cheminformatics with Google Antigravity",
    jaTitle: "Science プラグインによる創薬・ケモインフォマティクス研究の加速",
    format: "video",
    track: "usecases",
    availability: "public",
    uploadDate: "2026-11-03",
    durationSeconds: 280,
    summary:
      "Google DeepMind の化学研究者らが、Antigravity の Science プラグイン（Cheminformatics Skills）を使って創薬ワークフローを統合・加速するデモです。特許・論文からの分子構造抽出、ChEMBL/PubChem を根拠としたデータ整理、ロルラチニブを例とした剛直化（rigidification）解析や効力予測モデルの構築を数分で実行します。",
    takeaways: [
      "Science プラグインにより、RDKit 等のライブラリ操作だけでなく化学の基本原則やベストプラクティスに沿った解析をエージェントが実行できる",
      "論文や特許から数千件の化合物を抽出し、ChEMBL や PubChem 等の一次情報源を明記したレポートと対話型ビューアを生成する",
      "クリゾチニブから大環状構造のロルラチニブへと剛直化する事例を題材に、脳移行性予測や Matched Molecular Pair 解析、効力予測モデル構築を連続実施する",
    ],
    quiz: {
      question: "動画内の創薬デモで取り上げられた「剛直化（rigidification）」解析において、比較・出典照合に用いられた実例とデータベースはどれですか？",
      choices: [
        "クリゾチニブと大環状類縁体ロルラチニブ、および ChEMBL・PubChem 等の出典データ",
        "AlphaFold タンパク質配列のみを用い、化学構造データベースは参照しない",
        "一般 Web 検索の匿名ブログ記事のみを根拠にした仮想分子生成",
      ],
      answerIndex: 0,
      explanation:
        "肺がん治療薬クリゾチニブを環化・剛直化したロルラチニブを例に、ChEMBL・PubChem・一次論文・特許へ出典を紐付けながら特性や効力予測を解析しています。",
    },
    tags: ["Science Plugin", "Cheminformatics", "RDKit", "Google DeepMind", "Drug Discovery"],
  },
  {
    id: "JDyatKs10Kk",
    recommendedOrder: 52,
    title: "Accelerating antimicrobial peptide discovery with Google Antigravity",
    jaTitle: "Antigravity × Science Skills による新規抗菌ペプチド探索",
    format: "video",
    track: "usecases",
    availability: "public",
    uploadDate: "2026-10-15",
    durationSeconds: 370,
    summary:
      "薬剤耐性菌（AMR）に対抗する新規抗菌ペプチドの探索を、Google DeepMind の研究者が Science Skills 搭載の Antigravity で実演します。UniProt でのスクリーニング、Prot-ALM による機能予測、Swiss-Prot に対する BLAST 新規性検証、AlphaFold 構造と PDB 既知構造の重ね合わせ（RMSD 約 1Å）、ウェットラボ実験計画の立案までを一貫して行います。",
    takeaways: [
      "UniProt の肺炎球菌プロテオーム（90〜100 アミノ酸）から、機能予測モデル Prot-ALM で抗菌活性が期待される未解析ペプチド候補を特定した",
      "Swiss-Prot への BLAST 検索で最大配列一致率 26%（E-value 0.03）と新規性を裏付けつつ、AlphaFold 予測構造と PDB 既知 AMP 構造が RMSD 約 1Å で一致する立体構造を 3D 可視化した",
      "配列探索・構造検証・ゲノム文脈評価・作用機序予測を経て、ウェットラボ向けの段階的な実験計画まで同一ワークベンチ内で生成した",
    ],
    quiz: {
      question: "候補ペプチドの配列新規性を検証し、さらに立体構造の類似性を確認するために動画内で使われた手法の組合せはどれですか？",
      choices: [
        "Twitter 投稿検索と手動 Excel グラフ作成",
        "Swiss-Prot に対する BLAST 検索と、AlphaFold 予測構造×PDB 構造の重ね合わせ",
        "化学反応式の手計算と 2D 画像のみの目視確認",
      ],
      answerIndex: 1,
      explanation:
        "BLAST で Swiss-Prot に既知ホモログがない（最大一致率 26%）ことを確認したうえで、AlphaFold 予測立体構造と PDB の既知抗菌ペプチド構造を重ね合わせて高い構造一致を示しました。",
    },
    tags: ["Science Plugin", "AlphaFold", "UniProt", "BLAST", "Google DeepMind"],
  },
  {
    id: "4rwvcOu1JxE",
    recommendedOrder: 53,
    title: "How to Build an Android App on Antigravity",
    jaTitle: "Stitch MCP × Android CLI プラグインで作るネイティブ Android アプリ",
    format: "video",
    track: "usecases",
    availability: "public",
    uploadDate: "2026-10-06",
    durationSeconds: 294,
    summary:
      "音楽理論（音符・音階・コード）学習用の Android アプリを、デザイン作成から実機実行まで Antigravity 上で完結させるチュートリアルです。Stitch で作成した 4 画面のデザインを Stitch MCP 経由で取り込み、Android CLI プラグインのスキルを用いて Jetpack Compose コンポーネントを構築し、エミュレータと実機スマートフォンで動作検証します。",
    takeaways: [
      "Stitch でプロンプトから 4 画面のモバイル UI デザインを生成し、エクスポートメニューから Stitch MCP サーバーを Antigravity に登録できる",
      "プロジェクト設定の Customizations（Build with Google セクション）から Android プラグインを導入すると、Android CLI 操作に必要なスキルがエージェントへ付与される",
      "取得した画面デザインを基に Jetpack Compose のネイティブ画面を自動生成し、Android エミュレータでの検証から実機ビルド実行まで一気通貫で行える",
    ],
    quiz: {
      question: "この動画で Stitch の画面デザインを Antigravity へ引き渡し、Android ビルド・検証を行うために導入した 2 つの要素はどれですか？",
      choices: [
        "Stitch MCP サーバーと Build with Google の Android CLI プラグイン",
        "Figma 手動 HTML 書き出しと React Native 変換ツール",
        "Blender プラグインと macOS Finder デーモン",
      ],
      answerIndex: 0,
      explanation:
        "Stitch 側で生成した画面を Stitch MCP サーバー経由で Antigravity が取得し、Build with Google セクションから追加した Android プラグイン（Android CLI スキル）でビルドとエミュレータ／実機確認を行っています。",
    },
    tags: ["Android", "Jetpack Compose", "Stitch MCP", "Android CLI", "Mobile"],
  },
  {
    id: "b2qw3rDNX0Q",
    recommendedOrder: 54,
    title: "Accelerating genomic discovery: AlphaGenome Atlas",
    jaTitle: "AlphaGenome Atlas Skill によるコードレス・ゲノム変異解析",
    format: "video",
    track: "usecases",
    availability: "public",
    uploadDate: "2026-09-08",
    durationSeconds: 200,
    summary:
      "Google DeepMind の研究者が、1 ペタバイト規模の AlphaGenome Atlas データセットを扱う専用スキルを用いて、血液疾患に関わる HBB 遺伝子のイントロン 2 変異を解析する事例です。AVI スコアによる変異の優先順位付け、ClinVar アノテーションとの突合、ref/alt 予測プロットの可視化により、1 行もコードを書かずに検証可能な分子仮説へ到達します。",
    takeaways: [
      "AlphaGenome Atlas Skill を介して 1 ペタバイト規模のデータセットへ直接アクセスし、対象領域（HBB 遺伝子イントロン 2）の全変異と AVI スコアを取得・順位付けできる",
      "ClinVar データベースとチャット内で自動突合することで、既知の病的変異と同等の高スコアを持ちながら未注釈（unannotated）の注目変異を迅速に抽出できる",
      "最上位の未注釈変異について詳細な ref/alt 効果予測プロットを描画し、スプライシング異常（新規擬似エクソンの取り込み）という具体的な分子仮説を数分で導き出せる",
    ],
    quiz: {
      question: "HBB 遺伝子イントロン 2 の解析で、未注釈の高スコア変異について AlphaGenome の詳細予測プロットが示唆した分子メカニズムは何ですか？",
      choices: [
        "遺伝子全体の完全欠失による転写停止",
        "実験試薬の汚染による測定ノイズ",
        "新規の擬似エクソン取り込みを引き起こすスプライシング変化",
      ],
      answerIndex: 2,
      explanation:
        "AVI スコアと ClinVar 突合で見つかった高スコアの未注釈変異に対し、ref/alt 予測プロットを比較した結果、ベースラインに対して新たな擬似エクソンが含まれるスプライシング変化が予測されました。",
    },
    tags: ["Science Plugin", "AlphaGenome Atlas", "Genomics", "ClinVar", "Google DeepMind"],
  },
  {
    id: "4dNry5zP0Jo",
    recommendedOrder: 55,
    title: "Gemma Translator: offline DIY translation device built with Gemma 4 + Antigravity",
    jaTitle: "Gemma 4 × Antigravity で作る完全オフライン DIY 翻訳機",
    format: "video",
    track: "usecases",
    availability: "public",
    uploadDate: "2026-08-05",
    durationSeconds: 74,
    summary:
      "Raspberry Pi 5 と汎用パーツ、3D プリント筐体を組み合わせ、Wi-Fi やクラウド API 一切不要で動作する携帯翻訳機「Gemma Translator」を Antigravity で製作した事例です。LiteRT-LM 上で Gemma 4（gemma4-e2b）を動かし、音声認識に Moonshine、音声合成に Kokoro、UI にモノクロームの React フロントエンドを採用しています。",
    takeaways: [
      "Raspberry Pi 5・小型タッチスクリーン・スピーカー・ロータリーノブ付きキーボードなど市販部品と 3D プリント筐体で構成された DIY ハードウェア",
      "LiteRT-LM による Gemma 4（gemma4-e2b）翻訳、Moonshine（ASR）、Kokoro（TTS）のすべてが端末内ローカルで完結し、API や Wi-Fi を必要としない",
      "モノクロームの React Web フロントエンドと Python サーバーを組み合わせ、ノブ回転やプッシュ・トゥ・トークをキーボードイベントとして処理している（リポジトリ公開済み）",
    ],
    quiz: {
      question: "完全オフライン翻訳機「Gemma Translator」のオンデバイス推論スタック（翻訳・音声認識・音声合成）の正しい組合せはどれですか？",
      choices: [
        "クラウド翻訳 API・Whisper サーバー・Web Speech API",
        "LiteRT-LM 上の Gemma 4（gemma4-e2b）・Moonshine（ASR）・Kokoro（TTS）",
        "Gemma 3n クラウドエンドポイント・Android TTS・Flutter UI",
      ],
      answerIndex: 1,
      explanation:
        "概要欄に明記されている通り、Python サーバー＋LiteRT-LM で Gemma 4（gemma4-e2b）を実行し、音声認識に Moonshine、音声合成に Kokoro をすべてオンデバイスで動かしています。",
    },
    tags: ["Gemma 4", "LiteRT-LM", "Raspberry Pi", "Offline AI", "Hardware"],
  },
  {
    id: "yAQraqNJNy8",
    recommendedOrder: 56,
    title: "Google Antigravity: Building custom automation tools",
    jaTitle: "Antigravity 2.0 で作る Chrome 拡張機能＆macOS 自動整理ツール",
    format: "video",
    track: "usecases",
    playlist: "The Liftoff Series",
    availability: "public",
    uploadDate: "2026-08-04",
    durationSeconds: 227,
    summary:
      "Antigravity 2.0 を使い、開いたまま溜まるタブを最終アクセス時刻別に自動グループ化する Manifest V3 Chrome 拡張機能と、デスクトップ／書類フォルダを自動タグ付けする macOS 常駐 Swift デーモンを構築する実践デモです。`/grillme` コマンドでの仕様詰め、プロジェクト単位の権限設定（Turbo モード）、音声入力、Artifact へのコメント修正といった 2.0 の操作感も確認できます。",
    takeaways: [
      "プロンプト末尾に `/grillme` を付けると、実装前に永続化方式や並び順、新規タブの扱いなどの設計詳細をエージェントが対話形式で詰めてくれる",
      "Antigravity 2.0 のプロジェクト単位の権限設定を Turbo モードへ切り替えることで、ファイル書込やローカルデーモンのビルド・常駐化まで都度承認なしで自律実行できる",
      "音声入力での機能追加（「Today 以外のタブグループを自動折りたたみ」）や Artifact への直接コメント（設定ファイルによる除外パターン対応）で反復改善を行える",
    ],
    quiz: {
      question: "Antigravity 2.0 において、コード生成前に設計の細部（永続化や色・並び順など）をエージェントから質問形式で詰めてもらうために使われたスラッシュコマンドはどれですか？",
      choices: [
        "`/grillme`",
        "`/turbo`",
        "`/deploy`",
      ],
      answerIndex: 0,
      explanation:
        "プロンプトの末尾に `/grillme` を追加すると、いきなりコードを書き始めるのではなく設計詳細をインタビュー形式で確認・合意したうえで実装計画を生成します。",
    },
    tags: ["The Liftoff Series", "Antigravity 2.0", "Chrome Extension", "Voice Input", "Automation"],
  },
  {
    id: "SzmfH4P00vI",
    recommendedOrder: 57,
    title: "Google Antigravity: Building a Real-Time AI Race Coach",
    jaTitle: "サーキット 100 mph・オフライン環境で動くリアルタイム AI レースコーチ",
    format: "video",
    track: "usecases",
    availability: "public",
    uploadDate: "2026-07-31",
    durationSeconds: 356,
    summary:
      "実車サーキット走行（時速 100 マイル超・2G 環境）でドライバーが信頼できるリアルタイム AI レースコーチを Antigravity で開発したプロジェクト事例です。Wi-Fi が使えないコース上の制約からクラウドの Gemini ではなく Pixel 10 の TPU 上でファインチューニング済み Gemma 4 をローカル実行し、CAN-USB 変換器経由の車両テレメトリと走行前後ブリーフィングを連携させています。",
    takeaways: [
      "サーキット上で通信が使えず遅延が命取りになるため、クラウドの Gemini ではなく Pixel 10 の TPU で Gemma 4 をローカルファインチューニングして推論している",
      "レースエンジニアではない開発者に対し、CAN-to-USB コンバータを介した GPS・加速度・ペダル・舵角テレメトリの取得方法を Antigravity がコーチングしながら実装を支援した",
      "エージェントが走行データを解析してコーナー毎のミスや重点課題を走行前ブリーフィングとして生成し、走行後ブリーフィングで目標達成を検証する仕組みを構築した",
    ],
    quiz: {
      question: "サーキット走行中の Wi-Fi 不在と低遅延要件を満たすため、最終的に車載推論へ採用された構成はどれですか？",
      choices: [
        "車載ルーター経由でクラウド上の Gemini へ毎回問い合わせる構成",
        "映像データのみを走行終了後にクラウドへアップロードする事後解析構成",
        "Pixel 10 上の TPU でファインチューニングした Gemma 4 をオフライン実行する構成",
      ],
      answerIndex: 2,
      explanation:
        "コース上ではインターネット接続が保証されず遅延も許容できないため、Pixel 10 端末の TPU 上でファインチューニング済みの Gemma 4 をオフライン実行する構成へ切り替えました。",
    },
    tags: ["Gemma 4", "Pixel 10", "On-Device AI", "Telemetry", "Real-Time"],
  },
  {
    id: "xlALU-kyFdw",
    recommendedOrder: 58,
    title: "Antigravity SDK: Building a digital simulated world",
    jaTitle: "Antigravity SDK で構築した Google I/O マルチエージェント仮想空間",
    format: "video",
    track: "usecases",
    availability: "public",
    uploadDate: "2026-06-18",
    durationSeconds: 71,
    summary:
      "Google I/O 向けに Antigravity SDK を使って構築されたマルチエージェント社会シミュレーションデモ「Antigravity Orbits」の紹介です。来場者が自身をスキャンして生成した仮想アバターとプロフィールを宇宙ステーション型の仮想空間へ送り込み、アバター同士が自律的に会話・交流したり基調講演を視聴したりする様子を通じてマルチエージェント協調の可能性を示します。",
    takeaways: [
      "Google Antigravity SDK を活用し、複数のエージェント（来場者の仮想アバター）が自律的に対話・交流する「Antigravity Orbits」を Google I/O で展示した",
      "参加者は自身のスキャンからアバターを生成しプロフィールを設定するだけで、宇宙ステーション空間内でのエージェント間インタラクションを体験できる",
      "このデモで培ったマルチエージェント協調の仕組みは、コーディングやビジュアル生成など複数エージェントの計画・連携を要するあらゆる開発に応用できる",
    ],
    quiz: {
      question: "Google I/O 向けに Antigravity SDK で構築された仮想空間デモ「Antigravity Orbits」の主な仕組みはどれですか？",
      choices: [
        "来場者から作成した仮想アバター同士が、模擬宇宙ステーション内で自律的に会話・交流する",
        "単一のチャットボットが I/O のスケジュールだけを静止画で表示する",
        "物理ロボットアームを遠隔操作して会場の案内パンフレットを配布する",
      ],
      answerIndex: 0,
      explanation:
        "Antigravity SDK によるマルチエージェント社会シミュレーションとして、来場者のアバター同士が宇宙ステーション空間で自律的に会話し交流する体験を構築しました。",
    },
    tags: ["Antigravity SDK", "Multi-Agent", "Google I/O", "Simulation"],
  },
  {
    id: "v0eokiSJO74",
    recommendedOrder: 59,
    title: "From Genetic Variant to Wet-lab: Accelerating the path from hypothesis to experiment",
    jaTitle: "遺伝子変異の仮説検証からウェットラボ試薬設計までを数分で完結",
    format: "video",
    track: "usecases",
    availability: "public",
    uploadDate: "2026-05-19",
    durationSeconds: 174,
    summary:
      "Google DeepMind の生物学者が Science Skills を組み込んだ Antigravity を使い、AK2 遺伝子の変異観察から実験室での検証用 DNA 配列設計までを数分で進めるデモです。UniProt・PubChem・ChEMBL など 30 以上の科学データベースと予測モデルを統合し、ミスセンス変異以外の第 2 仮説（スプライシング欠損・フレームシフト）を抽出して AlphaFold 構造上で影響領域を特定します。",
    takeaways: [
      "Science Skills により UniProt・PubChem・ChEMBL をはじめとする 30 以上の主要科学データベースとフロンティア予測モデルを単一ワークスペースに統合できる",
      "AK2 遺伝子のミスセンス変異だけでなく、予測モデルによる重篤なスプライシング異常（フレームシフト誘発）という別仮説を掘り起こし、AlphaFold 立体構造上で影響部位を可視化した",
      "従来の半日仕事だった転写産物調査や断片設計をエージェントが自動化し、両仮説をウェットラボで実測検証するための正確な DNA 配列ブループリントまで出力した",
    ],
    quiz: {
      question: "AK2 遺伝子変異の調査において、エージェントが構造可視化と並んで最終出力した「ウェットラボ移行に必要な成果物」は何ですか？",
      choices: [
        "製薬企業向けの特許出願テンプレート PDF",
        "両仮説を実験室で物理検証するための正確な DNA 配列設計（ブループリント）",
        "患者向け問診票の多言語翻訳テキスト",
      ],
      answerIndex: 1,
      explanation:
        "仮説と AlphaFold 構造上の根拠を固めたあと、手動で転写産物を調べて断片を設計する代わりに、実験検証用の具体的な DNA 配列ブループリントをエージェントが生成しています。",
    },
    tags: ["Science Plugin", "AlphaFold", "Genomics", "UniProt", "Google DeepMind"],
  },
  {
    id: "1rF_SZZ3yWs",
    recommendedOrder: 60,
    title: "How marketers are using Google Antigravity",
    jaTitle: "非エンジニアのマーケターが語る Google Antigravity 活用法",
    format: "video",
    track: "usecases",
    availability: "public",
    uploadDate: "2026-05-19",
    durationSeconds: 122,
    summary:
      "Google のコンシューマーアプリマーケティング部門でエグゼクティブ戦略・ナラティブ統括を務める非エンジニアの担当者が、Antigravity を執筆・思考パートナーとして活用する事例を紹介します。コーディング知識がなくてもチャット形式とサンプル文章・指示書の提供によって自分の文体（tone of voice）を再現させ、下書き作成や企画の切り口提案を高速化しています。",
    takeaways: [
      "コードを書けない非技術職であっても、親しみやすいチャットインターフェースを通じてエージェントに業務を依頼できる",
      "過去の文章サンプルや指示を与えることで、本人のトーン＆マナーに忠実なドラフト作成や切り口提案を行う思考パートナーとして機能する",
      "日々のワークフローと長年培ったノウハウを指示として蓄積（コード化）することで、使い続けるほど出力精度が高まり人間の能力を拡張してくれる",
    ],
    quiz: {
      question: "コードを書かないマーケティング担当者が Antigravity を活用する際、どのように自分の文体やノウハウをエージェントへ反映させていますか？",
      choices: [
        "専用の C++ 拡張モジュールを自作してコンパイルする",
        "既存の社内 ERP データベースへ直接 SQL クエリを発行する",
        "文章サンプルと指示をチャットで渡し、思考・執筆パートナーとしてワークフローを蓄積させる",
      ],
      answerIndex: 2,
      explanation:
        "非エンジニアであっても、チャット欄から自分の文章サンプルや指示を与えることでトーン＆マナーを再現したドラフト作成や切り口提案を得られる点が強調されています。",
    },
    tags: ["Marketing", "Non-Technical", "Writing Partner", "Workflow"],
  },
  {
    id: "rKQ9b4UMpGQ",
    recommendedOrder: 61,
    title: "Antigravity solves the invert pendulum",
    jaTitle: "未知の実機ハードウェアで倒立振子制御問題を解決する",
    format: "video",
    track: "usecases",
    availability: "public",
    uploadDate: "2025-11-29",
    durationSeconds: 177,
    summary:
      "学習データに存在しない独自ハードウェア（台車上の振り子を振り上げて直立安定させる倒立振子装置）の制御コードを、Antigravity で設計・チューニングした実験動画です。センサー値や通信仕様を初回のプロンプトで伝え、実機挙動のダイナミクス・プロット画像を読み込ませてゲイン（減衰など）を 2〜3 回反復調整することで、実世界での直立安定化に成功しています。",
    takeaways: [
      "事前学習データに存在しない独自装置の計測値・操作指令・通信プロトコルをプロンプトで与えるだけで、数分で制御器コードの初版を生成しユーザーへレビューを求める",
      "初期実行で台車がオーバーシュートして安定しない際、実行結果のダイナミクス・プロット（グラフ）を入力するとエージェントが原因を推論し、減衰増加などのゲイン調整を提案する",
      "コード生成からグラフに基づく 2〜3 回のパラメータ反復調整を経て、実際の物理デバイス上で振り子の振り上げ・直立安定化を達成した",
    ],
    quiz: {
      question: "制御器がオーバーシュートして安定しなかった際、開発者は Antigravity へ何を入力してパラメータ調整を行いましたか？",
      choices: [
        "直前ランのシステム挙動（ダイナミクス）を示すプロット画像・グラフ",
        "市販制御器の PDF マニュアル 500 ページ分",
        "エージェント任せのランダム数値探索のみ（結果フィードバックなし）",
      ],
      answerIndex: 0,
      explanation:
        "直前の試行におけるシステムの挙動プロットをモデルへ入力することで、Antigravity がオーバーシュート原因を読み取り、減衰を増やすなどのゲイン調整を推論・提案しました。",
    },
    tags: ["Control Systems", "Hardware", "Robotics", "Tuning"],
  },
  {
    id: "YX-OpeNZYI4",
    recommendedOrder: 62,
    title: "Building a self-playing pinball machine with Antigravity",
    jaTitle: "Web Serial API × コンピュータビジョンで作る自動プレイ・ピンボールマシン",
    format: "video",
    track: "usecases",
    availability: "public",
    uploadDate: "2025-11-21",
    durationSeconds: 176,
    summary:
      "2 基のソレノイドアクチュエータとカメラを備えた実機のピンボール台を、ノート PC から自律プレイさせるプロジェクトです。Antigravity がマイコン用ファームウェア、Web Serial API／Bluetooth 連携（simple serial sender）、コンピュータビジョン処理、ブラウザ UI を計画・実装し、盤面の円形ライトによる誤検知を除外ゾーン設定で解消しています。",
    takeaways: [
      "Web Serial API などの通信仕様とゴールを伝えるだけで、Antigravity がタスクリストと計画を立てて承認を求めながら、マイコン用ファームウェアからブラウザ UI まで一連を実装する",
      "フリッパー周辺を監視するカメラ映像とソレノイド駆動を USB 経由で統合し、PC 上のソフトウェアが実機の状況を認識して物理フリッパーを操作する",
      "盤面の円形ライトがボールと誤認される課題に対し、フリッパーを発動させない除外ゾーンを設定する微調整によって高精度な自動プレイを実現した",
    ],
    quiz: {
      question: "コンピュータビジョンが盤面のランダムな丸いライトをピンボールの玉と誤認してしまう課題は、どのように解決されましたか？",
      choices: [
        "盤面のすべての照明の配線を物理的に切断した",
        "フリッパーを発動させない除外ゾーン（トリガー対象外領域）を設けて微調整した",
        "カメラを取り外し、固定秒数ごとのタイマー操作に切り替えた",
      ],
      answerIndex: 1,
      explanation:
        "発光する円形ライトがボールとして認識されてしまう問題に対し、アルゴリズム側でフリッパーを発動させないゾーンを設けて微調整することで対処しています。",
    },
    tags: ["Web Serial API", "Computer Vision", "Hardware", "Microcontroller", "IoT"],
  },
];
