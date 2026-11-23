// Track 1 (onboarding: 8本) & Track 2 (core-liftoff: 15本)
// 出どころ: YouTube 公式チャンネル (@googleantigravity / UC_eVxIPHFZm7oF_gET0x-8Q)
// 取得手段: yt-dlp 一次メタデータ・概要欄・字幕取得（取得日: 2026-11-23）

import type { AntigravityVideo } from "./types";

export const onboardingCoreVideos: AntigravityVideo[] = [
  {
    id: "SVCBA-pBgt0",
    recommendedOrder: 1,
    title: "Welcome to Google Antigravity 🚀",
    jaTitle: "Google Antigravity へようこそ",
    format: "video",
    track: "onboarding",
    availability: "public",
    uploadDate: "2025-11-18",
    durationSeconds: 144,
    summary:
      "Gemini 3 世代のモデル性能を前提に、IDE をエージェント主体の開発基盤へ進化させた Google Antigravity の公式紹介動画です。開発者は全手順を手動実装する立場からエージェントを統括・設計する立場へ移り、エディタ・ターミナル・ブラウザを横断する自律実行と Artifact による品質検証を体験できます。",
    takeaways: [
      "開発者の役割は各手順の手動実装から、解決策を設計し複数ワークスペースのエージェントを管理する立場（manager of agents）へ移行します。",
      "エージェントは実装計画を立て、エディタ・ターミナル・ブラウザを横断しながら並列にタスクを実行します。",
      "ブラウザのスクリーンショットや操作録画などの検証用 Artifact、コード差分、デザインモックアップへ直接視覚的コメントを残して最後の 10% を仕上げられます。",
    ],
    quiz: {
      question:
        "この導入動画で説明されている、Google Antigravity における開発者の新しい役割として最も適切なものはどれですか？",
      choices: [
        "すべてのコードを手作業で 1 行ずつ書き切ること",
        "解決策を設計し、ツール群を操る複数のエージェントを管理すること",
        "ブラウザの動作確認を毎回手動スクリーンショットで記録すること",
      ],
      answerIndex: 1,
      explanation:
        "動画では、開発者が自ら全手順を実装するのではなく、ソリューションを設計してエージェントを管理する立場（manager of agents）へ進化すると説明されています。",
    },
    tags: [
      "イントロダクション",
      "エージェント開発",
      "Artifact",
      "ブラウザ検証",
      "並列実行",
    ],
  },
  {
    id: "nTOVIGsqCuY",
    recommendedOrder: 2,
    title: "Learn the basics of Google Antigravity",
    jaTitle: "Google Antigravity の基本操作チュートリアル",
    format: "video",
    track: "onboarding",
    availability: "public",
    uploadDate: "2025-11-18",
    durationSeconds: 833,
    summary:
      "Google Antigravity の初期セットアップから Next.js 製のフライト追跡アプリの構築までを一通り学ぶ基本チュートリアルです。`Agent Manager`・`Antigravity Editor`・統合ブラウザの 3 つの基本画面を使い分けながら、エージェント主導の開発・テスト・リファクタリング・Google カレンダー連携の流れを解説しています（概要欄では Antigravity 2.0 向け更新ガイドも案内されています）。",
    takeaways: [
      "作業は `Agent Manager`・`Antigravity Editor`（`Command E` 等で切替）・統合 Chrome ブラウザの 3 つの基本画面で構成されます。",
      "ローカルフォルダを開いて要件を伝えると、エージェントがコード生成からターミナル実行（`automatic` 設定時は自動承認）まで自律的に進めます。",
      "ブラウザでの動作確認、エディタ上でのコードリファクタリング、外部サービス連携、コミットまで一連の開発サイクルを実践形式で学べます。",
    ],
    quiz: {
      question:
        "動画内で紹介されている、Google Antigravity を構成する 3 つの基本インターフェースの組み合わせはどれですか？",
      choices: [
        "Agent Manager、Antigravity Editor、統合ブラウザ",
        "データベース設計画面、GitHub Actions、モバイルエミュレータ",
        "スプレッドシート、メールクライアント、PDF ビューア",
      ],
      answerIndex: 0,
      explanation:
        "動画冒頭で、ワークスペース横断管理の `Agent Manager`、コード編集用の `Antigravity Editor`、実画面テスト用の統合ブラウザの 3 画面が基本概念として紹介されています。",
    },
    tags: [
      "基本ガイド",
      "Agent Manager",
      "Editor",
      "統合ブラウザ",
      "初期セットアップ",
    ],
  },
  {
    id: "6C0FjHoN3qE",
    recommendedOrder: 3,
    title: "Google Antigravity 2.0 Beginner's Guide",
    jaTitle: "Google Antigravity 2.0 初心者ガイド",
    format: "video",
    track: "onboarding",
    availability: "public",
    uploadDate: "2026-05-19",
    durationSeconds: 974,
    summary:
      "マルチエージェントチーム、スケジュールタスク、ネイティブ音声入力、Google 製品とのワンクリック連携を備えてゼロから刷新されたデスクトップ版 `Antigravity 2.0` の初心者向けガイドです。`Street Guesser` という地図ゲームの構築を通じ、音声での計画作成、アーキテクチャ図や質問を含む実装計画 Artifact のレビュー、サブエージェント活用、定期タスク設定までを解説しています。",
    takeaways: [
      "オンボーディングの `Build with Google` 画面から、モダン Web ガイダンスや Chrome DevTools などのスキル・プラグインをワンクリックで導入できます。",
      "マイクボタンによる音声入力で要件を伝え、実装に入る前にアーキテクチャ図や確認質問を含む実装計画 Artifact を先にレビューできます。",
      "既存の Antigravity IDE ユーザーは `keep Antigravity IDE` をチェックしてスムーズに移行・併用でき、マルチエージェントやスケジュールタスクも活用できます。",
    ],
    quiz: {
      question:
        "Antigravity 2.0 のオンボーディングにある「Build with Google」ページでは何を行えますか？",
      choices: [
        "課金プランの請求書 PDF のみをダウンロードする",
        "Google 製品と連携するスキルやプラグイン（例：Chrome DevTools など）をインストールする",
        "ローカルの Git リポジトリをすべてクラウドへ強制削除する",
      ],
      answerIndex: 1,
      explanation:
        "動画のオンボーディング手順では、`Build with Google` 画面からモダン Web ガイダンスや Chrome DevTools などのスキル・プラグインを導入できることが示されています。",
    },
    tags: [
      "Antigravity 2.0",
      "初心者ガイド",
      "音声入力",
      "Build with Google",
      "スケジュールタスク",
    ],
    relatedAcademyHref: "/academy",
  },
  {
    id: "jYWQtG8BBSY",
    recommendedOrder: 4,
    title: "Google Antigravity, Redesigned",
    jaTitle: "刷新された Google Antigravity UI の全貌",
    format: "video",
    track: "onboarding",
    availability: "public",
    uploadDate: "2026-11-17",
    durationSeconds: 266,
    summary:
      "複数エージェントの並列オーケストレーションに特化してゼロから再設計された Antigravity の新 UI 解説動画です。入力待ちを最優先で並べるサイドバー、送信前に実行場所（ローカル／クラウド）や Git ブランチを切り替えられるオーサリング領域、音声通話の文字起こし表示、チャット横でのブラウザ操作ライブ監視などを紹介します。",
    takeaways: [
      "サイドバーは「ユーザーの入力待ち」→「作業中」→「非アクティブ」の優先順で自動整理され、多数の並列会話でも必要な確認を見落としません。",
      "指示を送信する前に、実行環境（ローカル端末／バックグラウンド複製クラウド環境）・Git ブランチ・ワークフロー・コネクタをオーサリング画面上部で切替できます。",
      "チャット横にブラウザが表示されてカーソル操作や停止ボタンが使えるほか、音声応答をミュートしてテキストのみ読む設定や通話後の全文字起こし確認にも対応します。",
    ],
    quiz: {
      question:
        "再設計された Antigravity のサイドバーは、複数エージェントの会話をどのような優先順位で並べ替えますか？",
      choices: [
        "作成日時の古い順に固定表示する",
        "ファイルサイズが大きい順に並べる",
        "ユーザーの入力が必要なものを最上段に、続いて作業中、その下に非アクティブを配置する",
      ],
      answerIndex: 2,
      explanation:
        "動画では、多数の並列会話を切り替えながら確認する手間を省くため、「入力待ち」「作業中」「非アクティブ」の順で自動整理されることが説明されています。",
    },
    tags: [
      "UI刷新",
      "並列エージェント",
      "サイドバー",
      "音声対話",
      "ライブブラウザ",
    ],
  },
  {
    id: "04IqH38SlOI",
    recommendedOrder: 5,
    title: "Which Antigravity surface should I use? 2.0 vs CLI vs IDE vs SDK",
    jaTitle: "どれを使うべき？ 2.0・CLI・IDE・SDK の使い分け",
    format: "video",
    track: "onboarding",
    availability: "public",
    uploadDate: "2026-06-12",
    durationSeconds: 1116,
    summary:
      "Google I/O で発表された `Antigravity 2.0`（デスクトップアプリ）・`IDE`・`CLI`・`SDK` の 4 つのサーフェスをどう使い分けるかを実践的な `travel companion` モノレポ開発で解説する動画です。すべて同じエージェント品質を共有しており、`turbo mode` でのコマンド実行から `Install IDE` ボタン、CLI での DB 設定、SDK を用いたエージェント構築まで横断的に実演します。",
    takeaways: [
      "`Antigravity 2.0`・`IDE`・`CLI`・`SDK` のすべてで同一のエージェント基盤を共有し、ワークフローに応じて単体でも組み合わせても利用できます。",
      "実装計画とコマンド内容に納得した段階で設定の `turbo mode` を有効にすると、ターミナルコマンドの毎回承認を省いて高速に進められます。",
      "`Antigravity 2.0` 右上の `Install IDE` ボタンから従来型エディタ（Mac/Windows/Linux）を導入でき、CLI や SDK ともシームレスに連携できます。",
    ],
    quiz: {
      question:
        "この動画で実演された `turbo mode`（ターボモード）を有効にする主な目的は何ですか？",
      choices: [
        "画面のフレームレートを 120fps に引き上げること",
        "実装計画を確認したうえで、ターミナルコマンド実行時の個別承認を省略すること",
        "すべてのコードをローカルではなく外部 SNS へ自動投稿すること",
      ],
      answerIndex: 1,
      explanation:
        "動画では、実装計画と提案コマンドに納得した段階で設定から `turbo mode` を有効化し、エージェントが確認待ちなしでターミナルコマンドを実行できるようにする使い方が紹介されています。",
    },
    tags: ["サーフェス比較", "Antigravity 2.0", "CLI", "IDE", "SDK"],
  },
  {
    id: "WiWDrTujl_w",
    recommendedOrder: 6,
    title: "FIRST LOOK into Google Antigravity CLI",
    jaTitle: "Google Antigravity CLI ファーストルック",
    format: "video",
    track: "onboarding",
    availability: "public",
    uploadDate: "2026-05-19",
    durationSeconds: 183,
    summary:
      "ターミナルから離れずに使える軽量サーフェス `Antigravity CLI` の発表動画です。`Antigravity 2.0` と同じエージェント基盤を持ち、作業中断なしの背景質問 `/btw`、会話分岐 `/fork`、スクリプト自動化向けの `-p` フラグ、そしてワークスペース内のカスタムスキルが自動登録されるスラッシュコマンド機能などを紹介します。",
    takeaways: [
      "CLI で開始した会話はコマンド 1 つで `Antigravity 2.0` デスクトップ GUI へエクスポートでき、サブエージェント並列実行や Artifact 生成にも対応します。",
      "ビルドやテストの実行中でも `/btw` で別質問を投げられ、`/fork` で会話を即座に分岐して別アプローチを安全に実験できます。",
      "`-p` フラグでスクリプトや cron ジョブへ組み込めるほか、ワークスペース定義のカスタムスキルが補完対応のスラッシュコマンドとして自動登録されます。",
    ],
    quiz: {
      question:
        "Antigravity CLI で作業中のタスクを中断せずに裏で別の質問をしたい場合、どのコマンドを使いますか？",
      choices: ["/btw", "/exit", "/clear"],
      answerIndex: 0,
      explanation:
        "動画では、長時間ビルドやテストの待機中にアクティブなタスクを止めず背景で質問できるコマンドとして `/btw`（別アプローチの分岐には `/fork`）が紹介されています。",
    },
    tags: [
      "CLI",
      "スラッシュコマンド",
      "スクリプト連携",
      "カスタムスキル",
      "ターミナル",
    ],
  },
  {
    id: "am0lg5-ofvQ",
    recommendedOrder: 7,
    title: "Google Antigravity CLI Full Walkthrough",
    jaTitle: "Google Antigravity CLI 完全ウォークスルー",
    format: "video",
    track: "onboarding",
    availability: "public",
    uploadDate: "2026-05-19",
    durationSeconds: 429,
    summary:
      "Markdown ジャーナル兼 To-Do アプリ（`j2d.py`）の開発を通じて `Antigravity CLI` の操作手順を詳しく解説するウォークスルー動画です。`/config` による設定確認、コンテキストウィンドウの消費トークン監視、`/artifacts` での実装計画・レポート閲覧、`/diff` による Git 差分確認からサブエージェント活用まで実演します。",
    takeaways: [
      "`/config` での設定変更や、エージェントが消費しているコンテキストウィンドウのトークン量のリアルタイム確認が行えます。",
      "エージェント作業中でも並行して `/artifacts` で実装計画やウォークスルーを確認し、`/diff` で現在の Git 変更差分をチェックできます。",
      "別ペインで生成物（`j2d.py`）を実行・検証しながら、上下キーでの項目選択対応やリサーチ用サブエージェント活用へと段階的に改善できます。",
    ],
    quiz: {
      question:
        "Antigravity CLI でエージェントが現在のターンに行った Git 変更差分を確認するにはどのスラッシュコマンドを使用しますか？",
      choices: ["/version", "/journal", "/diff"],
      answerIndex: 2,
      explanation:
        "ウォークスルー内では、エージェントが生成・変更したファイルの VCS（Git）差分を即座に確認するコマンドとして `/diff` が実演されています。",
    },
    tags: ["CLI", "ウォークスルー", "/diff", "/artifacts", "コンテキスト管理"],
  },
  {
    id: "RGhunHLnVIg",
    recommendedOrder: 8,
    title: "Announcing Google Antigravity SDK",
    jaTitle: "Google Antigravity SDK 発表",
    format: "video",
    track: "onboarding",
    availability: "public",
    uploadDate: "2026-05-19",
    durationSeconds: 71,
    summary:
      "Google Antigravity 本体を駆動するエージェントエンジンを Python 環境から直接利用できるようにする `Antigravity SDK` の発表動画です。シンプルな Python スクリプトで対話型エージェントを起動でき、引数単位でツール権限を制御できるポリシーエンジンや、バックグラウンド事象を監視して通知する組み込みトリガーを備えています。",
    takeaways: [
      "シンプルな Python スクリプトから、Antigravity と同じエージェントエンジンとカスタムツールを使った対話型エージェントを起動できます。",
      "ポリシーエンジンにより「特定引数のときのみツール実行を許可」や YOLO モードなど細かな権限制御を設定できます。",
      "MCP・スキル・カスタムツール・フックに加え、バックグラウンドイベントを監視して必要なときに連絡する組み込みトリガーも標準搭載しています。",
    ],
    quiz: {
      question:
        "Antigravity SDK の「ポリシーエンジン」によって制御できる内容として動画内で言及されているものはどれですか？",
      choices: [
        "特定引数でのみツール実行を許可するなどの細かな権限制御や YOLO モード",
        "ターミナル画面のフォントサイズと配色テーマのみ",
        "YouTube チャンネルの再生リスト順の自動変更",
      ],
      answerIndex: 0,
      explanation:
        "動画では、ポリシーエンジンを使って「特定の引数の場合にのみツール実行を許可する」ことや、自律許可の YOLO モードを設定できると説明されています。",
    },
    tags: ["SDK", "Python", "ポリシーエンジン", "MCP", "Hooks"],
  },
  {
    id: "tB7flTt8A1E",
    recommendedOrder: 9,
    title: "Global Knowledge Base",
    jaTitle: "グローバルナレッジベース（機能紹介クリップ）",
    format: "video",
    track: "core-liftoff",
    availability: "public",
    uploadDate: "2025-11-18",
    durationSeconds: 32,
    summary:
      "Google Antigravity における「Global Knowledge Base（グローバルナレッジベース）」をテーマにした 32 秒の機能紹介クリップです（字幕・音声解説なしの短尺映像）。概要欄に記された、ワークスペース横断でエージェントを管理し複雑な開発タスクを委譲するプラットフォーム構成要素の一つを示しています。",
    takeaways: [
      "タイトル「Global Knowledge Base」が示す通り、グローバルナレッジベースを主題とした 32 秒の紹介クリップです。",
      "概要欄では、複数ワークスペースを横断してエージェントを管理し、タスク指向の高い抽象度で開発できる点が述べられています。",
      "字幕・音声解説なしの短尺クリップであり、Antigravity の要素一覧を把握する入口として活用できます。",
    ],
    quiz: {
      question:
        "この 32 秒の機能紹介クリップ（`tB7flTt8A1E`）が焦点を当てているテーマをタイトルから選んだものはどれですか？",
      choices: [
        "Global Knowledge Base（グローバルナレッジベース）",
        "クラウド課金アラートの CSV エクスポート",
        "モバイル実機の USB デバッグ手順",
      ],
      answerIndex: 0,
      explanation:
        "本動画はタイトル「Global Knowledge Base」の通りグローバルナレッジベースを主題とし、概要欄にある複数ワークスペース横断型エージェント基盤の一部として公開されています。",
    },
    tags: [
      "Global Knowledge Base",
      "コア概念",
      "機能紹介クリップ",
      "ワークスペース",
    ],
  },
  {
    id: "6QeVnO709r0",
    recommendedOrder: 10,
    title: "Task lists, Artifacts, and Verification",
    jaTitle: "タスクリスト・Artifact・検証（機能紹介クリップ）",
    format: "video",
    track: "core-liftoff",
    availability: "public",
    uploadDate: "2025-11-18",
    durationSeconds: 33,
    summary:
      "Google Antigravity における「Task lists（タスクリスト）」「Artifacts（アーティファクト）」「Verification（検証）」をテーマにした 33 秒の機能紹介クリップです（字幕・音声解説なし）。概要欄に記載された「エージェントによる自律的な計画立案と複雑なタスクの End-to-End 実行」を支える 3 要素を示しています。",
    takeaways: [
      "「Task lists」「Artifacts」「Verification」という 3 つの要素に焦点を当てた 33 秒の映像クリップです。",
      "概要欄では、エージェントがエディタ・ターミナル・ブラウザを横断して自律的に計画・実行することが示されています。",
      "字幕や音声解説はないため、タイトルと概要欄で示された開発フロー全体の見取り図を素早く掴む位置づけです。",
    ],
    quiz: {
      question:
        "この紹介クリップのタイトルに並んでいる 3 つのキーワードの組み合わせはどれですか？",
      choices: [
        "Issues、Pull Requests、Releases",
        "Task lists、Artifacts、Verification",
        "Lint、Format、Deploy",
      ],
      answerIndex: 1,
      explanation:
        "動画タイトルは「Task lists, Artifacts, and Verification」であり、タスクリスト・Artifact・検証の 3 要素をテーマとしています。",
    },
    tags: ["タスクリスト", "Artifact", "検証", "機能紹介クリップ"],
  },
  {
    id: "HRH4kUlMeAM",
    recommendedOrder: 11,
    title: "Agent Across Editor, Terminal, and Browser",
    jaTitle: "エディタ・ターミナル・ブラウザを横断するエージェント",
    format: "video",
    track: "core-liftoff",
    availability: "public",
    uploadDate: "2025-11-18",
    durationSeconds: 26,
    summary:
      "エージェントが「Editor（エディタ）」「Terminal（ターミナル）」「Browser（ブラウザ）」の 3 領域を横断して動作することをテーマにした 26 秒の機能紹介クリップです（字幕なし）。概要欄の通り、馴染みある AI IDE を土台に複合タスクを自律実行する Antigravity の中核特徴を示しています。",
    takeaways: [
      "タイトル「Agent Across Editor, Terminal, and Browser」の通り、3 つの開発サーフェス横断をテーマにした 26 秒の紹介クリップです。",
      "従来の AI IDE 体験を核に残しつつ、複数環境をまたぐ自律実行へ発展させている点が概要欄で示されています。",
      "字幕・音声解説なしの短尺クリップとして、統合環境全体の動作イメージを端的に示します。",
    ],
    quiz: {
      question:
        "概要欄とタイトルによると、Google Antigravity のエージェントが横断して動作する 3 つの開発環境とはどれですか？",
      choices: [
        "スプレッドシート、スライド、ドキュメント",
        "メール、カレンダー、チャット",
        "エディタ、ターミナル、ブラウザ",
      ],
      answerIndex: 2,
      explanation:
        "タイトルおよび概要欄に明記されている通り、エージェントは Editor（エディタ）、Terminal（ターミナル）、Browser（ブラウザ）の 3 つを横断してタスクを遂行します。",
    },
    tags: [
      "エディタ",
      "ターミナル",
      "ブラウザ",
      "自律実行",
      "機能紹介クリップ",
    ],
  },
  {
    id: "JG28VZRHRe0",
    recommendedOrder: 12,
    title: "Agent Manager",
    jaTitle: "Agent Manager（機能紹介クリップ）",
    format: "video",
    track: "core-liftoff",
    availability: "public",
    uploadDate: "2025-11-18",
    durationSeconds: 30,
    summary:
      "Google Antigravity の中核画面である「Agent Manager」をテーマにした 30 秒の機能紹介クリップです（字幕なし）。概要欄に記載の通り、開発者が各ワークスペースを横断してエージェントを管理し、より高いタスク単位の視点で開発を進める体験を示しています。",
    takeaways: [
      "タイトル「Agent Manager」の通り、エージェント管理画面をテーマにした 30 秒の紹介クリップです。",
      "概要欄では、複数ワークスペースにまたがるエージェントをタスク単位で統括する考え方が説明されています。",
      "字幕・音声解説なしの短尺クリップであり、エージェント管理ハブの存在を短時間で確認できます。",
    ],
    quiz: {
      question:
        "この 30 秒のクリップが示す「Agent Manager」は、開発者がどのような視点で開発を進めるための仕組みと関連づけられていますか？",
      choices: [
        "より高いタスク単位（task-oriented level）でワークスペース横断のエージェントを管理する視点",
        "CPU クロックやメモリレジスタを手動で書き換える視点",
        "単一ファイルの文字数カウントだけを行う視点",
      ],
      answerIndex: 0,
      explanation:
        "概要欄にある通り、Antigravity は開発者がワークスペース横断でエージェントを管理し、より高いタスク指向レベル（higher, task-oriented level）で操作できるようにする設計です。",
    },
    tags: ["Agent Manager", "タスク管理", "ワークスペース", "機能紹介クリップ"],
  },
  {
    id: "WpjiSzypOkY",
    recommendedOrder: 13,
    title: "Artifact-level feedback",
    jaTitle: "Artifact レベルのフィードバック（機能紹介クリップ）",
    format: "video",
    track: "core-liftoff",
    availability: "public",
    uploadDate: "2025-11-18",
    durationSeconds: 24,
    summary:
      "Google Antigravity における「Artifact-level feedback（Artifact 単位のフィードバック）」をテーマにした 24 秒の機能紹介クリップです（字幕なし）。自律的に計画・実行を進めるエージェントに対し、成果物や中間生成物（Artifact）上で直接軌道修正を伝える概念を示しています。",
    takeaways: [
      "タイトル「Artifact-level feedback」の通り、Artifact 単位でのフィードバックをテーマにした 24 秒の紹介クリップです。",
      "エージェントの自律的な計画・実行に対して、成果物レベルで連携・指示する Antigravity の設計を示しています。",
      "字幕・音声解説なしの短尺クリップとして、フィードバック連携の基本概念を簡潔に伝えます。",
    ],
    quiz: {
      question:
        "タイトル「Artifact-level feedback」が意味する協調アプローチとして最も適切なものはどれですか？",
      choices: [
        "エージェントを一度アンインストールしてから再質問すること",
        "音声通話のみでコマンドを 1 文字ずつ読み上げること",
        "エージェントが作成した Artifact（中間生成物や成果物）に対して直接フィードバックを与えること",
      ],
      answerIndex: 2,
      explanation:
        "タイトルが示す通り、エージェントとのやり取りにおいて Artifact（計画書や画面キャプチャ等の成果物）レベルで直接フィードバックを返す仕組みを指します。",
    },
    tags: ["Artifact", "フィードバック", "協調開発", "機能紹介クリップ"],
  },
  {
    id: "eqLqAMDgL5U",
    recommendedOrder: 14,
    title: "How to better understand, follow, and collaborate with the agent",
    jaTitle: "エージェントの意図を理解し、追いかけ、協働する方法（Artifacts 入門）",
    format: "video",
    track: "core-liftoff",
    availability: "public",
    uploadDate: "2026-01-15",
    durationSeconds: 92,
    summary:
      "エージェントが大規模で時間のかかるタスクを担うほど進捗や意図が見えにくくなる課題に対し、Google Antigravity が用意した `Artifacts`（アーティファクト）の仕組みを 92 秒で解説する動画です。実装計画・タスクリスト・ウォークスルーを共有の正本とし、画像上のドラッグ選択を含む直接コメントでエージェントと協働する方法が分かります。",
    takeaways: [
      "`Artifacts` は実装前に示す `implementation plan`、進捗をリアルタイム更新する `task list`、ブラウザ実行の証拠（スクリーンショット・録画）を含む `walkthrough` 等で構成されます。",
      "実装計画やウォークスルー、変更されたコード行に加え、画像上でドラッグ選択して精密なフィードバックを残すことができます。",
      "単なる作業観察ではなく、人とエージェントの「共有された情報源（shared source of truth）」として認識ズレを防ぎます。",
    ],
    quiz: {
      question:
        "この動画で紹介されている Artifact のフィードバック機能として正しいものはどれですか？",
      choices: [
        "テキストの要約しか表示できず、コメント機能はない",
        "実装計画・変更コード行に加え、画像上のドラッグ選択にも直接コメントを残せる",
        "実装完了後にしか閲覧できず、計画段階では作られない",
      ],
      answerIndex: 1,
      explanation:
        "動画では、`implementation plan`・`walkthrough`・変更コード行へのコメントだけでなく、画像上でドラッグ選択して精密な視覚的フィードバックを送れることが説明されています。",
    },
    tags: [
      "Artifact",
      "実装計画",
      "ウォークスルー",
      "画像フィードバック",
      "協調開発",
    ],
  },
  {
    id: "4mnP1lRdUm8",
    recommendedOrder: 15,
    title: "Intro to Agent Skills",
    jaTitle: "Agent Skills 入門（必要なときだけ効く専門知識）",
    format: "video",
    track: "core-liftoff",
    playlist: "The Liftoff Series",
    availability: "public",
    uploadDate: "2026-02-28",
    durationSeconds: 246,
    summary:
      "コンテキスト肥大化（context bloat）を避けつつ、タスクに関連するときだけ専門知識を読み込ませる `Agent Skills` の仕組みを解説する動画です。ローカルやグローバルのエージェントスキルディレクトリに `name` と `description` を YAML フロントマターで記した `SKILL.md` を配置し、Three.js（TSL）を用いた 3D 太陽系ゲーム構築の例でオンデマンド読込の効果を示します。",
    takeaways: [
      "全知識を常にプロンプトへ詰め込むとコンテキストが肥大化するため、`SKILL.md` の `name`・`description` を見てエージェントが必要時だけ自律読込します。",
      "スキルフォルダには `SKILL.md` のほか、スクリプト・コード例・各種リソースを同梱してチームや GitHub 等で共有できます。",
      "学習データに少ない最新技術（Three.js の TSL 等）や企業・業界固有の標準をスキル化すると、出力のスタイルと精度を安定させられます。",
    ],
    quiz: {
      question:
        "Agent Skills が「コンテキスト肥大化（context bloat）」を防げる理由として動画で説明されている仕組みはどれですか？",
      choices: [
        "すべてのスキル本文を会話開始時に無条件で毎回全文読み込むから",
        "ローカルのコードベースをすべて自動削除してから推論するから",
        "YAML フロントマターの `name` と `description` を手がかりに、タスクに関連するときだけオンデマンドで読み込むから",
      ],
      answerIndex: 2,
      explanation:
        "動画では、`SKILL.md` 冒頭の YAML フロントマター（`name` と `description`）をエージェントが参照し、現在のタスクに関係があるスキルだけを選択的に読み込むことでコンテキスト消費を抑えると説明されています。",
    },
    tags: [
      "Agent Skills",
      "SKILL.md",
      "コンテキスト最適化",
      "The Liftoff Series",
      "Three.js",
    ],
  },
  {
    id: "3kMuohNwqVY",
    recommendedOrder: 16,
    title: "The Liftoff Series - Building with Editor and Manager modes",
    jaTitle: "The Liftoff Series - Editor モードと Manager モードの連携",
    format: "video",
    track: "core-liftoff",
    playlist: "The Liftoff Series",
    availability: "unlisted",
    uploadDate: "2025-11-18",
    durationSeconds: 63,
    summary:
      "非同期のエージェント管理画面（Manager）と同期的なコード編集画面（Editor）をあえて別ウィンドウに分離し、シームレスな状態同期で連携させる設計思想を 63 秒で解説する限定公開動画です。大規模既存コードベースのリサーチを Manager で並列化し、細部の仕上げを Editor へ即座に引き継ぐプロ開発者向けワークフローを紹介します。",
    takeaways: [
      "コードベース調査などの並列作業は Manager ビューで行い、直接コードを整えたいときは Editor ビューへ瞬時に切り替えられます。",
      "2 つのビューを無理に 1 画面へ押し込まず分離しているため、Editor を閉じた状態から開いても作業状態が即座に同期されます。",
      "Editor 内にも Tab 補完やコマンド等の AI 機能が備わっており、非同期管理と同期コーディングを両立できます。",
    ],
    quiz: {
      question:
        "Antigravity が Manager ビューと Editor ビューを 1 つの画面に詰め込まず、別ウィンドウ設計にしている理由として動画内で語られていることは何ですか？",
      choices: [
        "別ウィンドウ間で作業状態を同期し、非同期エージェント管理と同期コード編集それぞれの操作性を損なわないため",
        "Editor ウィンドウでは AI 機能を一切使えない仕様にするため",
        "Manager ウィンドウを開いている間はターミナルを使えなくするため",
      ],
      answerIndex: 0,
      explanation:
        "動画では、両者を 1 ウィンドウに押し込むのではなく分離してハンドオフを最適化することで、Editor を閉じていても状態同期を保ち、非同期管理と同期編集の双方を快適に使えると説明されています。",
    },
    tags: [
      "The Liftoff Series",
      "Editorモード",
      "Managerモード",
      "ハンドオフ",
      "限定公開",
    ],
  },
  {
    id: "4I3Y87NJEOA",
    recommendedOrder: 17,
    title: "Learn about subagents in Antigravity",
    jaTitle: "Antigravity のサブエージェント活用ガイド（旧版・限定公開）",
    format: "video",
    track: "core-liftoff",
    playlist: "The Liftoff Series",
    availability: "unlisted",
    uploadDate: "2026-09-30",
    durationSeconds: 177,
    summary:
      "メインチャットが長大化してコンテキストが乱れる課題や逐次待ちを解消する「サブエージェント（Subagents）」の仕組みを解説する限定公開動画です（概要欄に `[OLD-DO NOT PUBLISH]` 注記あり）。独立したコンテキストウィンドウを持つサブエージェントの使いどころや Markdown によるカスタム定義、さらに組み込みコマンド `boost` と `teamwork` の特徴とトークン負荷の注意点を学べます。",
    takeaways: [
      "各サブエージェントは独自のコンテキストウィンドウ・システムプロンプト・ツールを持ち、調査・デバッグ・セキュリティ監査・テスト作成などを独立並列で担当します。",
      "起動したサブエージェントはクリックして使用ツールや読込コンテキストを確認でき、メインエージェント側から軌道修正も可能です。",
      "Markdown でカスタム定義できるほか、多層で協調する組み込みコマンド `boost`・`teamwork` もありますが、トークン消費と実行時間が大きいため重い開発課題に限定して使うべきと案内されています。",
    ],
    quiz: {
      question:
        "動画内で `boost` や `teamwork` コマンドについて示されている運用上の注意点は何ですか？",
      choices: [
        "1 行のタイポ修正など日常的な軽い編集に毎回必ず使うべきである",
        "使用するとフロントエンドしか編集できずバックエンドには使えない",
        "サブエージェント群を背後で大量に動かすためトークン消費と実行時間が大きく、重要で重い開発課題向けにとっておくべきである",
      ],
      answerIndex: 2,
      explanation:
        "動画では、`boost` と `teamwork` は裏側で多層のサブエージェント木をオーケストレーションするため多くのトークンと時間を要し、日常の小さな編集ではなく重厚なエンジニアリング課題に温存するよう推奨されています。",
    },
    tags: [
      "The Liftoff Series",
      "サブエージェント",
      "boost",
      "teamwork",
      "限定公開",
    ],
  },
  {
    id: "yiHKlPuZ73c",
    recommendedOrder: 18,
    title: "The Liftoff Series - How frontend devs use agents within the browser",
    jaTitle: "The Liftoff Series - フロントエンド開発でのブラウザ連携検証",
    format: "video",
    track: "core-liftoff",
    playlist: "The Liftoff Series",
    availability: "public",
    uploadDate: "2025-11-18",
    durationSeconds: 60,
    summary:
      "フロントエンドやフルスタック開発者が費やす「画面の反復クリックやフォーム入力テスト」の時間をエージェントへ委譲し、エディタとブラウザの開発ループを完結させる 60 秒動画です。問い合わせフォーム追加を例に、実装計画へブラウザ検証手順を含め、エージェント自身がクリック・スクロール・入力してスクリーンショットや録画をウォークスルーへ添付する流れを紹介します。",
    takeaways: [
      "レスポンシブ確認や繰り返し操作のテストというフロントエンド特有の負荷を、ブラウザ操作エージェントが肩代わりします。",
      "実装計画の段階から「ブラウザでどう検証するか」のセクションが組み込まれ、コード変更後にエージェントが実操作でテストします。",
      "最終のウォークスルーでは完了報告だけでなく、実ブラウザ動作のスクリーンショットと操作録画が証拠として添付されます。",
    ],
    quiz: {
      question:
        "問い合わせフォームの追加を依頼した例において、エージェントはコード変更後のテスト結果をどのように報告しますか？",
      choices: [
        "口頭メッセージだけで「問題ありません」と 1 行返す",
        "クリックやスクロール・入力で実動作を検証したうえで、スクリーンショットや操作録画をウォークスルーに挿入して報告する",
        "ユニットテストのコードだけを出力してブラウザは起動しない",
      ],
      answerIndex: 1,
      explanation:
        "動画では、エージェントがブラウザ上でクリック・スクロール・入力テストを行った後、最終ウォークスルーにスクリーンショットや画面録画を組み込んで検証完了を報告する「browser-in-the-loop」が解説されています。",
    },
    tags: [
      "The Liftoff Series",
      "フロントエンド",
      "ブラウザテスト",
      "画面録画",
      "Artifact",
    ],
  },
  {
    id: "htV29JrMXmA",
    recommendedOrder: 19,
    title: "The Liftoff Series - Trusting the agents' work through verification",
    jaTitle: "The Liftoff Series - 検証計画の自動実行による信頼性担保",
    format: "video",
    track: "core-liftoff",
    playlist: "The Liftoff Series",
    availability: "public",
    uploadDate: "2025-11-18",
    durationSeconds: 69,
    summary:
      "雑な AI 生成コード（AI-generated slop）を防ぎ、大規模システムでも信頼できる品質を保つための「エージェント自律検証」を解説する 69 秒動画です。クラスのリファクタリングを例に、実装計画の段階でユニットテスト実行計画を立て、編集後に実行し、失敗すれば自ら検知して修正反復するプロセスを紹介します。",
    takeaways: [
      "クラスのリファクタリング等を依頼すると、実装計画の中に既存ユニットテストの実行を含む検証計画（plan of verification）が自動で組み込まれます。",
      "コード変更後は計画通りにテストを実行し、その結果を最終ウォークスルーへ明記します。",
      "テストが失敗した場合はエージェント自身が誤りを検知し、通るまで自律的に反復修正を行います。",
    ],
    quiz: {
      question:
        "コード変更後の検証テストが失敗した場合、動画内の Antigravity エージェントはどのように振る舞いますか？",
      choices: [
        "失敗を無視して「成功」と記録し、ログを削除する",
        "ユーザーに手動で全テストを書き直すよう求めて終了する",
        "失敗を検知して、修正と再検証の反復を自律的に行う",
      ],
      answerIndex: 2,
      explanation:
        "動画では、検証が失敗した際にエージェントがその誤りを検知し、自律的に修正イテレーションを回して結果をウォークスルーで報告する仕組みが強調されています。",
    },
    tags: [
      "The Liftoff Series",
      "品質検証",
      "ユニットテスト",
      "自己修復",
      "リファクタリング",
    ],
  },
  {
    id: "B4do6xuIgD4",
    recommendedOrder: 20,
    title: "The Liftoff Series - Developing with parallel agents",
    jaTitle: "The Liftoff Series - バックグラウンド並列エージェントによる開発",
    format: "video",
    track: "core-liftoff",
    playlist: "The Liftoff Series",
    availability: "public",
    uploadDate: "2025-11-18",
    durationSeconds: 77,
    summary:
      "突発的なバグ調査や単発の分析依頼によるコンテキストスイッチ（思考の中断）を防ぎ、集中時間を守るための並列エージェント活用法を解説する 77 秒動画です。`Manager` に複数ワークスペースを事前読込しておき、現在の作業ビューを切り替えずに裏方のエージェントへバグ修正やテスト・ドキュメント調査を委譲する流れを示します。",
    takeaways: [
      "`Manager` 上に複数ワークスペースをプリロードできるため、別案件のための環境切替待ち時間が発生しません。",
      "主タスクの画面を開いたままバックグラウンドエージェントへ別タスクを任せ、深い思考のフローを維持できます。",
      "エージェントは確認や承認が必要なタイミングや完了時のウォークスルー審査のときだけ通知して戻ってきます。",
    ],
    quiz: {
      question:
        "この動画が解決策として提示している、開発者の集中時間を奪う最大の要因は何ですか？",
      choices: [
        "IDE のフォント変更操作",
        "突発対応などで別作業へ切り替えることによるコンテキストスイッチのコスト",
        "モニターの解像度が高すぎること",
      ],
      answerIndex: 1,
      explanation:
        "動画では、緊急バグや単発依頼によるコンテキストスイッチが開発時間を大きく奪う問題を取り上げ、ビューを切り替えずにバックグラウンドエージェントへ委譲する手法を解説しています。",
    },
    tags: [
      "The Liftoff Series",
      "並列開発",
      "バックグラウンドエージェント",
      "コンテキストスイッチ対策",
    ],
  },
  {
    id: "yhcSn4-DpQk",
    recommendedOrder: 21,
    title: "The Liftoff Series - Reduce your prompts with better agent feedback",
    jaTitle: "The Liftoff Series - 的確なフィードバックでプロンプト回数を減らす",
    format: "video",
    track: "core-liftoff",
    playlist: "The Liftoff Series",
    availability: "public",
    uploadDate: "2025-11-18",
    durationSeconds: 75,
    summary:
      "最後の 10% を修正するために最初の 90% 以上のプロンプトを費やしてしまう「指示出しの泥沼」を、`Artifacts` への直接コメントで解消する方法を示す 75 秒動画です。実装前の計画書や変更後のコード差分に対し Google ドキュメントのような感覚でコメントを残し、少ないやり取りで意図通りの結果へ導く手順を解説します。",
    takeaways: [
      "タスクの仕様不足がエージェントの迷走（rabbit holes）を招くため、コード変更前の実装計画段階で軌道修正することが重要です。",
      "実装計画に対して Google ドキュメントのようにインラインコメントを付け、反映後の計画を承認してから実装へ進めます。",
      "生成されたコード差分に対してもピンポイントにコメントでき、同僚の開発者や PM と協働する感覚で最後の仕上げを行えます。",
    ],
    quiz: {
      question:
        "動画内で、エージェントの実装計画（Implementation Plan）をレビューして修正指示を出す体験は何に例えられていますか？",
      choices: [
        "バイナリエディタで 16 進数を書き換える操作",
        "コマンドラインから正規表現だけで置換する操作",
        "標準的な Google ドキュメントにコメントを付けるような操作",
      ],
      answerIndex: 2,
      explanation:
        "動画では、実装計画に複数の修正点を指摘する操作を「標準的な Google ドキュメントにコメントを残すように」と表現し、承認後に実装へ進む流れが示されています。",
    },
    tags: [
      "The Liftoff Series",
      "Artifact",
      "フィードバック",
      "実装計画",
      "コードレビュー",
    ],
  },
  {
    id: "QVNF5R9eU2A",
    recommendedOrder: 22,
    title: "The Liftoff Series - Feedback with the agent for frontend development",
    jaTitle: "The Liftoff Series - フロントエンド UI への視覚的フィードバック",
    format: "video",
    track: "core-liftoff",
    playlist: "The Liftoff Series",
    availability: "public",
    uploadDate: "2025-11-18",
    durationSeconds: 68,
    summary:
      "プロトタイプ作成（0→1）は速くてもデザイン仕上げ（1→100）に手間がかかるフロントエンド開発で、ブラウザのスクリーンショット Artifact 上に直接範囲選択とコメントを残して修正指示を出す 68 秒動画です。Figma ページを参照した Web 実装を例に、言葉で位置を説明する煩わしさなしに高精度な UI 調整を行うフローを紹介します。",
    takeaways: [
      "Figma 等を参照してエージェントが実装した Web 画面に対し、エージェント自身が撮影した実装スクリーンショット Artifact を確認します。",
      "テキストだけで「右上のどのボタン」と説明する代わりに、画像上で直接パーツを範囲選択しデザインツール感覚で修正コメントを付けられます。",
      "位置情報と修正内容が正確に伝わるため、経験豊富なデザイナーやフロントエンド開発者と組むように 1→100 の詰めが速くなります。",
    ],
    quiz: {
      question:
        "実装されたフロントエンド画面を 1 から 100 へ仕上げる際、この動画で推奨されているフィードバック方法はどれですか？",
      choices: [
        "CSS ファイル全体を削除してゼロから作り直させる",
        "スクリーンショット Artifact 上で直接箇所を視覚的に選択し、デザインツールのようにコメントを残す",
        "画面を見ずにテキストだけでピクセル座標をすべて暗算で指示する",
      ],
      answerIndex: 1,
      explanation:
        "動画では、エージェントが撮ったスクリーンショット Artifact を開き、修正したい要素を直接選択してコメントを残すことで、高精度な UI 修正を実現できると説明されています。",
    },
    tags: [
      "The Liftoff Series",
      "フロントエンド",
      "視覚的フィードバック",
      "Figma",
      "スクリーンショット",
    ],
  },
  {
    id: "sDyTcXXn1AU",
    recommendedOrder: 23,
    title: "The Liftoff Series - How product managers bring abstract idea to life",
    jaTitle: "The Liftoff Series - PM が抽象的なアイデアを即座に形にする方法",
    format: "video",
    track: "core-liftoff",
    playlist: "The Liftoff Series",
    availability: "public",
    uploadDate: "2026-01-06",
    durationSeconds: 83,
    summary:
      "プロダクトマネージャー（PM）が PRD やチケット作成・部門間ハンドオフに数日〜数週間かける代わりに、Antigravity で動くプロトタイプを即座に作って仮説検証する 83 秒動画です。動画内の題材である「dog B&B（犬向け宿泊施設）」の Wiki ページを例に、検索フィルタの実装から要約機能への方向転換までをその場で試す様子を紹介します。",
    takeaways: [
      "仕様書やチケットを書く前にエージェントへ直接依頼することで、見た目だけのモックではなく実際に操作できるライブプロトタイプが即座に作れます。",
      "検索フィルタを触ってみて気づいた課題をもとに、ページ要約機能を追加するなどその場で UX 仮説を素早く反復できます。",
      "抽象的なドキュメントではなく「触って確かめられる実物」をチームへ共有し、意思決定を加速させられます。",
    ],
    quiz: {
      question:
        "この動画における PM（プロダクトマネージャー）向けの最も大きな活用メリットとして語られているものは何ですか？",
      choices: [
        "PRD やチケットのやり取りに数週間かける前に、実際に操作できるライブプロトタイプでアイデアを素早く形にし共有できること",
        "プロダクト戦略会議をすべて音声通話の録音だけで完結できること",
        "エンジニアの代わりに本番データベースのスキーマ削除を自動実行できること",
      ],
      answerIndex: 0,
      explanation:
        "動画では、PM がチケットや PRD の段階から何週間も待たずに、実際に操作可能なプロトタイプをその場で作って改善・共有できる価値が解説されています。",
    },
    tags: ["The Liftoff Series", "PM向け", "プロトタイピング", "仮説検証", "PoC"],
  },
];
