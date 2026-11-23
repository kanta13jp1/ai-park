// Track 7 (livestreams: 7本)
// 出どころ: YouTube 公式チャンネル (@googleantigravity / UC_eVxIPHFZm7oF_gET0x-8Q)
// 取得手段: yt-dlp 一次メタデータ・概要欄・字幕取得（取得日: 2026-11-23）

import type { AntigravityVideo } from "./types";

export const livestreamVideos: AntigravityVideo[] = [
  {
    id: "mfT8qpPNYyg",
    recommendedOrder: 85,
    title: "Google Antigravity Livestream",
    jaTitle: "Google Antigravity ライブストリーム：最新機能・活用Tips・Q&A",
    format: "stream",
    track: "livestreams",
    availability: "public",
    uploadDate: "2026-07-16",
    durationSeconds: 2859,
    summary:
      "DevRel の Rody Davis が Antigravity の最新アップデート解説とライブ Q&A を実施。データベース項目の変更影響箇所をアーティファクトとして洗い出しサブエージェントとオーケストレーターで検証する手順や、初日からの防御的プログラミング（悪意ある呼び出し・エッジケースを想定したセキュリティレビュー）、新機能であるメッセージのキュー投入と目標（North Star）に沿ったコンテキスト調整を紹介します。",
    takeaways: [
      "データベース項目の変更など広範囲の調査では、エージェントに該当箇所のレポート／アーティファクトを作成させ、各プロジェクト担当のサブエージェントと全体検証用オーケストレーターを組み合わせて変更を流し込む。",
      "Web アプリとバックエンド連携では開発初日から防御的プログラミングを徹底し、不正アクセスや想定外の状態入力を突くエッジケースのセキュリティレビューをサブエージェントに依頼する。",
      "エージェントのデフォルト提案にただ同意するのではなく、設定した目標（North Star）に向けて押し戻しながらコンテキストを共同で練り上げ、メッセージのキュー投入も活用して効率化する。",
    ],
    quiz: {
      question:
        "配信内で Rody Davis が「防御的プログラミング（defensive programming）」として推奨している開発時のアプローチはどれですか？",
      choices: [
        "UI 実装を終えたあとに、本番環境での表示確認のみを行う",
        "開発初日からバックエンドへの不正アクセスや誤った状態送信を想定し、エージェント／サブエージェントに悪用エッジケースのセキュリティレビューを行わせる",
        "セキュリティ関連の実装はすべてエージェントの初期提案をそのまま無条件で承認する",
      ],
      answerIndex: 1,
      explanation:
        "セキュリティ実践のパートで、バックエンドを呼び出す相手には悪意や権限不足があり得る前提で計画・実装時からサブエージェント等に壊し方（エッジケース）を検証させる防御的プログラミングが推奨されています。",
    },
    tags: ["Livestream", "Q&A", "Subagents", "Artifacts", "Security", "Queued Messages"],
  },
  {
    id: "LcnBRo11mnk",
    recommendedOrder: 86,
    title: "Google Antigravity Livestream: AMA",
    jaTitle: "Google Antigravity ライブストリーム：開発チーム AMA（質問会）",
    format: "stream",
    track: "livestreams",
    availability: "public",
    uploadDate: "2026-07-30",
    durationSeconds: 2265,
    summary:
      "DevRel の Rody Davis と新たにチームへ加わった Alexander Nohe (Nohe) が、Reddit・Twitter・YouTube チャットからの質問にリアルタイムで回答する AMA 配信。Teamwork に関する Q&A やアプリ／CLI 双方からのフィードバック送信方法、Antigravity 2.0 で Gemma モデルをハーネスと連携させる際の SDK 活用条件、単一 HTML ファイル生成＋静的ファイルサーバーによる手軽な個人ツール構築術まで実演付きで回答します。",
    takeaways: [
      "デバッグにも直結するフィードバックは、アプリ内の「Settings → Provide feedback」ボタンと、CLI 内の `/feedback` スラッシュコマンドのどちらからでも送信できる。",
      "Gemini Flash のクォータ消費を抑える目的などで Gemma をハーネスへ組み込みたい場合、Antigravity 2.0 時点では設定柔軟性の高い SDK 経由での構成が必要となる。",
      "ちょっとした個人向けツールを作るときは、複数ファイルの Web サイトではなく JS と CSS を 1 つにまとめた単一 HTML ファイルを生成させ、静的ファイルサーバーで動かすと JSON/CSV エクスポート機能などを素早く作れる。",
    ],
    quiz: {
      question:
        "この AMA 配信で紹介された、CLI 上から開発チームへフィードバックを送信するためのスラッシュコマンドはどれですか？",
      choices: ["/feedback", "/debug-report", "/submit-issue"],
      answerIndex: 0,
      explanation:
        "アプリ内の「Settings → Provide feedback」とあわせて、CLI 内では `/feedback` コマンドを実行することでデバッグに有用なフィードバックを直接送れることが実演されています。",
    },
    tags: ["Livestream", "AMA", "Q&A", "Feedback", "CLI", "SDK", "Teamwork", "Gemma"],
  },
  {
    id: "VIybKGFS4Hw",
    recommendedOrder: 87,
    title: "Google Antigravity Livestream: Remote Control and Custom Agents",
    jaTitle: "Google Antigravity ライブストリーム：Remote Control とカスタムエージェント",
    format: "stream",
    track: "livestreams",
    availability: "public",
    uploadDate: "2026-08-21",
    durationSeconds: 2863,
    summary:
      "Remote Control と新たに発表された Custom Agents（カスタムエージェント）を中心に、最新機能と実践 Tips を紹介するライブ配信。独立したコンテキストウィンドウを持つ特化型エージェントへ冗長な GCP ログ解析などを委譲してメインエージェントを保つ方法や、Chrome／iOS／Android で PWA として導入する手順、エージェントから逆質問を引き出してプロンプトを具体化する「grill me」アプローチ、IDE 拡張機能について語ります。",
    takeaways: [
      "Custom Agents を使うと専用のコンテキストウィンドウを持つ専門エージェントへ作業を委譲でき、非常に冗長な GCP ログの調査などをメインエージェントから切り離して扱える。",
      "Chrome の「Open in app」／インストール操作や iOS・Android から PWA（Progressive Web App）として導入することで、通知などモバイル流儀の体験とあわせて外出先からも利用しやすくなる。",
      "要件をうまくプロンプトに落とし込めないときは「grill me」を活用し、Antigravity 側から確認質問を返してもらうことで実装意図を対話的に明確化できる。",
    ],
    quiz: {
      question:
        "配信内で紹介された Custom Agents（カスタムエージェント）を利用する主な利点として説明されているものはどれですか？",
      choices: [
        "すべてのログ調査や補助作業を単一のメインコンテキストウィンドウに集中させる点",
        "組み込みツールと MCP サーバーをすべて無効化して最小構成に固定する点",
        "専用のコンテキストウィンドウを持つ特化型エージェントへ、冗長な GCP ログ解析などの専門作業を委譲できる点",
      ],
      answerIndex: 2,
      explanation:
        "Custom Agents は独自のコンテキストウィンドウを持つ特化エージェントへ作業を委譲でき、非常に長大になりやすい GCP ログの分析などもメインのエージェントとは分けて処理できる点が解説されています。",
    },
    tags: ["Livestream", "Remote Control", "Custom Agents", "Subagents", "PWA", "MCP", "IDE Extensions"],
  },
  {
    id: "YCsHDx_9pZc",
    recommendedOrder: 88,
    title: "Planning and Artifacts: Google Antigravity Livestream",
    jaTitle: "プランニングと Artifacts：Google Antigravity ライブストリーム",
    format: "stream",
    track: "livestreams",
    availability: "public",
    uploadDate: "2026-09-16",
    durationSeconds: 3065,
    summary:
      "Rody Davis と Alexander Nohe (Nohe) が、プランニング・Artifacts・ワークフロー分離を中心に実演と Q&A を行うライブ配信。新規リポジトリと GitHub リポジトリ（`agy test`）を連携させ Issue ベース開発用のカスタムスキルを組み立てるデモや、手順が未確定な曖昧な構想（nebulous concepts）からモジュール単位を実装する際の Teamwork 活用、長大な単一チャットに頼らずワークフローをスキルへ切り出す実践的な利点を解説します。",
    takeaways: [
      "Remote Control・ターミナル・VCS 連携など矢継ぎ早のリリースに触れつつ、空リポジトリと GitHub を紐づけて Issue 起点の独自スキルを定義する開発ワークフローを実演。",
      "Teamwork は 1 手目から細かな手順が決まっていない曖昧な構想（nebulous concepts）やアプリ全体・モジュール単位の実装を自律計画から進めたい場面で真価を発揮する。",
      "1 つのチャットセッションにすべての作業を延々と継ぎ足すのではなく、再利用可能なワークフローをスキルとして切り離すことで保守性と見通しが大きく向上する。",
    ],
    quiz: {
      question:
        "配信内で議論された Teamwork 機能が特に適しているユースケースとして挙げられたものはどれですか？",
      choices: [
        "すでに 1 行単位の正確な作業手順が確定している軽微なタイポ修正のみを行うとき",
        "具体的な手順計画がまだ固まっていない曖昧な構想（nebulous concepts）から、アプリ全体やモジュール単位の実装を進めたいとき",
        "AI エージェントを一切使わずに手動で Git リポジトリの権限設定だけを変更するとき",
      ],
      answerIndex: 1,
      explanation:
        "社内ハッカソンでの Teamwork 活用に触れつつ、手順が確定していない「nebulous concepts（曖昧な構想）」やモジュール全体の実装を、計画立案から任せて進めたいときに有効だと説明されています。",
    },
    tags: ["Livestream", "Planning", "Artifacts", "Skills", "Teamwork", "VCS", "Q&A"],
  },
  {
    id: "7dBQRYLGf4s",
    recommendedOrder: 89,
    title: "Building Dashboards: Google Antigravity Livestream",
    jaTitle: "ダッシュボード構築：Google Antigravity ライブストリーム",
    format: "stream",
    track: "livestreams",
    availability: "public",
    uploadDate: "2026-10-07",
    durationSeconds: 2405,
    summary:
      "Antigravity チームの Cam と Chris Brocks が、刷新された UI・新オートメーション・新パーミッションシステム・WSL サポートの話題に続き、ダッシュボード構築の実践をライブデモする配信。Salesforce から上位商談を照会・更新しながら「良いダッシュボードは良質なデータから生まれる」ための事前データ探索の重要性や、AI が陥りがちなサイバーパンク調デザインを避けて意図したテーマへ導くコツを共有します。",
    takeaways: [
      "ダッシュボード構築に入る前にまず Antigravity と対話してデータソース（デモでは Salesforce の上位 10 商談など）を探索・更新して整えることで、粗悪データによる不正確な可視化を防ぐ。",
      "デザイン方針を指定せずに任せると AI が紫・ピンク基調のサイバーパンク風に偏りやすいため、使いたいコンポーネントやテーマの方向性を明示して軌道修正する。",
      "WSL サポートや新パーミッションシステム、さらに `Command+Shift+O` などのショートカットを駆使しながら、生成・リフレッシュ・自己修復を含めて反復的にダッシュボードを仕上げる。",
    ],
    quiz: {
      question:
        "この配信のダッシュボード構築デモにおいて、画面デザインに着手する前に行うべき重要ステップとして強調されたことは何ですか？",
      choices: [
        "Antigravity と対話してデータソースの探索（ディスカバリー）とデータ整理を行い、良質な元データを確保すること",
        "データの妥当性を確認する前に、まずサイバーパンク調の配色テンプレートを適用すること",
        "Salesforce などの外部データソースを切断し、固定のダミー値だけでグラフを描画すること",
      ],
      answerIndex: 0,
      explanation:
        "Salesforce 連携パートで、元データがゴミならダッシュボードもゴミになる（garbage data in, garbage dashboard out）ため、先に Antigravity と対話してデータを探索・更新しておく重要性が語られています。",
    },
    tags: ["Livestream", "Dashboards", "Salesforce", "WSL", "Permissions", "Automations", "UI Design"],
  },
  {
    id: "o-vqgLUUBaw",
    recommendedOrder: 90,
    title: "Google Antigravity Livestream: Behind the Product and Gemini 4 Argon",
    jaTitle: "Google Antigravity ライブストリーム：開発の裏側と Gemini 4 Argon",
    format: "stream",
    track: "livestreams",
    availability: "public",
    uploadDate: "2026-10-14",
    durationSeconds: 2346,
    summary:
      "Gemini デスクトップアプリ（`Command+Shift+A` でトグル切り替え）などの直近リリースを振り返りつつ、プロダクト設計の舞台裏と Gemini 4 Argon の実力を語るライブ配信。システム全体を見渡して統一的な抽象化（unified abstraction）を組み立てる Argon の強みや、ベンチマーク数値だけでなく社内での日常利用を通じた A/B テスト・実用評価、ループ外モデルによる要約を含む多層検証とブラウザ連携、アプリ内フィードバックの活用方針を紹介します。",
    takeaways: [
      "Gemini 4 Argon は単発のコード出力にとどまらず、複数箇所の仕組みを横断的に理解して統一的な抽象化（unified abstraction）を導き出す場面で高い性能を発揮する。",
      "セキュリティと信頼性では、コード確認に加えて実行ループ外のモデルにスクリプト内容を要約させるなど複数の検証レイヤーを重ねることで出力への信頼度を高められる。",
      "ベンチマークと実運用のズレを埋めるため社内の日常利用による A/B テストを重視しており、アプリ内の「Submit feedback」から送られたフィードバックにも開発チームが目を通して製品・モデル改善に活かしている。",
    ],
    quiz: {
      question:
        "この配信で語られた Gemini 4 Argon の強み、および製品チームのモデル評価・フィードバック活用方針として正しいものはどれですか？",
      choices: [
        "単一ファイルの定型補完のみに特化しており、公開ベンチマークの数値だけを唯一の評価指標としている",
        "ブラウザ内の操作連携は完全に非対応であり、アプリ内フィードバックボタンの投稿は自動破棄されている",
        "システム全体を横断して統一的な抽象化を提案できる点に加え、ベンチマークだけでなく社内での長時間実利用による A/B テストやアプリ内「Submit feedback」の声を重視している",
      ],
      answerIndex: 2,
      explanation:
        "配信内で、Argon はコード全体を見渡した unified abstraction が得意であること、ベンチマークと実使用の乖離を踏まえて社内の日常利用で A/B テストを行っていること、そしてアプリ内の Submit feedback をチームが直接確認していることが説明されています。",
    },
    tags: ["Livestream", "Gemini 4 Argon", "Product", "Desktop App", "Security", "Browser Use", "Feedback"],
  },
  {
    id: "f2MKsvXcOG4",
    recommendedOrder: 91,
    title: "Google Antigravity Livestream: Building automations",
    jaTitle: "Google Antigravity ライブストリーム：Automations（自動化）の構築",
    format: "stream",
    track: "livestreams",
    availability: "public",
    uploadDate: "2026-10-28",
    durationSeconds: 2714,
    summary:
      "Chris（進行・チャット担当）と Cam King（ライブ実装担当）が、Antigravity の Automations（自動化）・内蔵ブラウザ・サイドカー／プラグイン・Gemini のマルチモーダル機能を実演するライブ配信。内蔵ブラウザで地域のイベント情報を収集してカレンダー化する自動化のダッシュボード登録と権限承認フローをはじめ、動画内のロゴ出現時刻や広告挿入位置の特定・JSON 出力・音声文字起こし、配信中のマイク音声を 5 分ごとに拾ってミームや漫画を生成するカスタムプラグインを披露します。",
    takeaways: [
      "Automations ダッシュボードで定期実行タスクをオンにする際は、GitHub へのリクエストやスクリプト実行など必要な権限を確認・承認したうえで、稼働時の思考プロセス（chain of thought）をリアルタイムに追跡できる。",
      "Gemini のマルチモーダル機能を活用し、動画からブランドロゴの出現タイミングや最適な広告挿入ポイントの特定、音声の文字起こし、全体の構造化 JSON 出力まで一貫して処理できる。",
      "Sidecars やカスタムプラグイン機構を組み合わせることで、ライブ配信中のマイク音声を 5 分間隔で取得してミームや 4 コマ漫画を自動生成するような独自プラグインも構築できる。",
    ],
    quiz: {
      question:
        "Cam King が実演した Automations ダッシュボード上での自動化有効化と動作確認について、配信内で見せた手順はどれですか？",
      choices: [
        "要求される権限の確認を行わずに実行し、終了後の結果テキストだけを確認する",
        "Automations ダッシュボードで GitHub 連携やスクリプト実行に関する要求権限を確認・承認してオンにし、稼働時の chain of thought（思考プロセス）を追う",
        "内蔵ブラウザを完全に停止したうえで、毎回手動でカレンダー項目を 1 件ずつ手入力する",
      ],
      answerIndex: 1,
      explanation:
        "カレンダー作成の自動化デモで、Automations ダッシュボードに登録されたタスクに対して GitHub リクエストと作成スクリプトの権限確認・承認を行って有効化し、実行中の chain of thought を確認する手順が実演されています。",
    },
    tags: ["Livestream", "Automations", "Browser", "Sidecars", "Plugins", "Multimodal", "JSON"],
  },
];
