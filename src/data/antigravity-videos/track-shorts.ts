// Track 6 (shorts: 22本)
// 出どころ: YouTube 公式チャンネル (@googleantigravity / UC_eVxIPHFZm7oF_gET0x-8Q)
// 取得手段: yt-dlp 一次メタデータ・概要欄・字幕取得（取得日: 2026-11-23）

import type { AntigravityVideo } from "./types";

export const shortVideos: AntigravityVideo[] = [
  {
    id: "aUDRxl-oofo",
    recommendedOrder: 63,
    title: "Antigravity Tip: Use personalized Skills",
    jaTitle: "Antigravity Tip：パーソナライズされた Skills を活用しよう",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-02-11",
    durationSeconds: 21,
    summary:
      "公開 Skills も手軽で便利ですが、自分の思考や作業スタイルに合わせたパーソナライズ Skills を作るのが最も効果的だと紹介するショート動画。現在のセッションで行った指示をそのまま Skill として変換・保存するよう Antigravity に頼む方法が語られます。",
    takeaways: [
      "公開 Skills は導入が簡単で役立つ一方、自分の進め方に定着するパーソナライズ Skills の作成が推奨されている",
      "セッション内でエージェントに伝えた指示内容を振り返らせ、そのまま Skill に変換して保存するよう依頼できる",
      "自分流の判断基準や手順を Skill 化しておくことで、自分の思考に沿った振る舞いを再現しやすくなる",
    ],
    quiz: {
      question: "パーソナライズされた Skills を手軽に作成する方法として、動画内で紹介されている依頼はどれですか？",
      choices: [
        "すべての公開 Skills を一括インストールしてから手動で削除する",
        "これまでのセッションで指示した内容をまとめ、Skill に変換して保存するよう依頼する",
        "毎回チャット冒頭に同じ長文ルールを手入力してコピー＆ペーストする",
      ],
      answerIndex: 1,
      explanation:
        "動画では、これまでのセッションでエージェントに伝えた指示内容を Skill として変換・保存させることで、自分のスタイルに合った振る舞いを実現できると紹介されています。",
    },
    tags: ["Shorts", "Skills", "パーソナライズ", "Tip"],
  },
  {
    id: "WglkZq4tsbc",
    recommendedOrder: 64,
    title: "From image to code in minutes! 🪑✨",
    jaTitle: "写真から数分でゲーム用コードを生成！🪑✨",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-02-17",
    durationSeconds: 32,
    summary:
      "実物の椅子の写真を Antigravity にアップロードし、バーチャルカフェの世界観に合うゲームオブジェクトのコードへ数分で変換するデモ。エージェントが画像を解析してコードを生成し、ブラウザ上で動作検証まで完結させます。",
    takeaways: [
      "実物の椅子を撮影した画像を Antigravity に渡すだけで、ゲーム内で使えるオブジェクトのコードを生成できる",
      "プロンプトでバーチャルカフェ全体の世界観（aesthetic）に合わせるよう指示して見た目を調和させている",
      "エージェントはコード生成後にブラウザを使って実際の動作・表示まで検証し、完成品を確認する",
    ],
    quiz: {
      question: "椅子の写真からゲームオブジェクトのコードを生成したあと、エージェントは何を使って動作確認を行いましたか？",
      choices: [
        "ブラウザを使って実際にコードが動作しているか検証した",
        "外部の 3D プリンタに出力して形状を計測した",
        "動作確認は行わず、コンパイル結果のテキストだけを表示した",
      ],
      answerIndex: 0,
      explanation:
        "画像解析とコード生成のあと、エージェントがブラウザ上でコードが実際に機能しているかを検証する流れが紹介されています。",
    },
    tags: ["Shorts", "画像入力", "ブラウザ検証", "ゲーム開発"],
  },
  {
    id: "UnoyXfq1oTI",
    recommendedOrder: 65,
    title: "Best Antigravity Coding Tip",
    jaTitle: "Antigravity コーディング最大のコツ：How ではなく What を伝える",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-02-18",
    durationSeconds: 29,
    summary:
      "エージェンティック AI を扱う上で最も重要なコツとして、「やり方（How）」ではなく「達成したいこと（What）」を伝え、自己検証できるツールと十分なコンテキストを与える原則を解説するショート動画。",
    takeaways: [
      "細かい手順（How）を指示し続けるのではなく、目的（What）を伝えて検証用ツールを渡すのが基本方針",
      "Web アプリ開発なら Chrome ブラウザツールを有効化し、エージェント自身が画面を見て完了確認できるようにする",
      "パッケージのバイナリではなくドキュメントなど課題解決に十分なコンテキストを与えると、確認待ちや手戻りが減る",
    ],
    quiz: {
      question: "Web アプリ開発などでエージェントが自律的に完了確認できるようにするため、動画で推奨されている工夫はどれですか？",
      choices: [
        "細かい実装手順を 1 行ずつ指示し、ブラウザやドキュメントは一切使わせない",
        "Java パッケージのドキュメントではなくバイナリファイルだけを渡す",
        "達成したい目的（What）と十分なコンテキストに加え、Chrome ブラウザツール等の検証手段を有効にする",
      ],
      answerIndex: 2,
      explanation:
        "動画では「How ではなく What を伝え、検証ツール（Web アプリなら Chrome ブラウザツール）やパッケージのドキュメントなど十分なコンテキストを与える」ことがコツとして挙げられています。",
    },
    tags: ["Shorts", "プロンプト設計", "ブラウザ検証", "ベストプラクティス"],
  },
  {
    id: "eB3jysQ_FX4",
    recommendedOrder: 66,
    title: "Stop repeating yourself and start building skills. 🛠️",
    jaTitle: "同じ説明の繰り返しをやめて Skills を作ろう 🛠️",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-03-03",
    durationSeconds: 26,
    summary:
      "繰り返しのコーディング作業を毎回プロンプトで説明し直す代わりに、一言の指示でエージェント Skill として記録・再利用する方法を短く紹介する Tips 動画。",
    takeaways: [
      "Antigravity では「このワークフローを Skill にして」と 1 回プロンプトを出すだけで新しい Skill を作成できる",
      "繰り返し行うコーディング操作や手順をエージェントが Skill として取り込んで保持する",
      "一度 Skill 化すれば、同じアクションを毎回説明し直すことなくいつでも再利用できる",
    ],
    quiz: {
      question: "繰り返しの作業を Skill にするメリットとして動画内で説明されているものはどれですか？",
      choices: [
        "一度だけ実行した後に履歴ごと完全削除できる点",
        "同じ手順を毎回プロンプトで説明し直さず、いつでも同じアクションを再実行できる点",
        "別のプログラミング言語へ自動翻訳して公開できる点",
      ],
      answerIndex: 1,
      explanation:
        "一度ワークフローを Skill にしておけば、同じ作業を行うたびにプロンプトで説明し直す必要がなくなり、いつでも同じアクションを実行できます。",
    },
    tags: ["Shorts", "Skills", "ワークフロー効率化"],
  },
  {
    id: "CuCCd0W0heo",
    recommendedOrder: 67,
    title: "From screenshot to functional UI in no time.",
    jaTitle: "スクリーンショットから即座に動く Flutter UI へ",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-03-04",
    durationSeconds: 28,
    summary:
      "Gemini 3 Flash 搭載の Antigravity を使い、モックアップのスクリーンショットから高忠実度な Flutter UI を生成して実機デバイス上で動かすまでの流れを紹介するショート動画。",
    takeaways: [
      "Gemini 3 Flash の活用により、UI モックアップの高い再現度（high fidelity）でコード化できる",
      "スクリーンショットをドロップして「Flutter UI として再構築して」と頼むだけでデバイス起動まで進められる",
      "静的な画像ではなく実際に動く UI をベースに反復改善（イテレーション）を進められる",
    ],
    quiz: {
      question: "この動画でモックアップのスクリーンショットを高忠実度に再現するために使われていると紹介されたモデルはどれですか？",
      choices: [
        "Gemini 3 Flash",
        "Gemini 1.0 Nano",
        "モデル名は動画内で一切言及されていない",
      ],
      answerIndex: 0,
      explanation:
        "概要欄と字幕の両方で、Gemini 3 Flash によってモックアップを高忠実度に再現し、Flutter UI としてデバイス起動できることが明記されています。",
    },
    tags: ["Shorts", "Gemini 3 Flash", "Flutter", "UI生成"],
  },
  {
    id: "IF1HzIQdf2I",
    recommendedOrder: 68,
    title: "Antigravity can do more than ship code and you don’t even have to leave your editor.",
    jaTitle: "コード以外もエディタから離れずに実行：記事から Google スライド作成",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-03-05",
    durationSeconds: 48,
    summary:
      "コード生成にとどまらず、ブログ記事 URL を読み取って要点を抽出し、スライド構成の Implementation Plan を立てた上でブラウザ経由で Google スライドのたたき台まで作成するデモ動画。",
    takeaways: [
      "ブログ記事の URL をブラウザで開いて読み込み、プレゼンの核となる要点を抽出して調査を行える",
      "各スライドのキーアイデアをまとめた Implementation Plan を先に作成し、承認後に構築へ進む",
      "ブラウザで Google スライドを開いて初期スライドを組み立て、チームへレビュー依頼する下準備まで完了できる",
    ],
    quiz: {
      question: "エージェントが Google スライドの生成を始める前に、構成確認のために作成したドキュメントは何ですか？",
      choices: [
        "料金見積書と請求書",
        "データベースのマイグレーションスクリプト",
        "各スライドのキーアイデアをまとめた Implementation Plan",
      ],
      answerIndex: 2,
      explanation:
        "ブログ記事から要点を読み取ったあと、各スライドの主要アイデアを含む Implementation Plan を作成し、ユーザーが内容を確認して進める流れが映っています。",
    },
    tags: ["Shorts", "Google Slides", "ブラウザ自動化", "Implementation Plan"],
  },
  {
    id: "uGNXlAb6MOc",
    recommendedOrder: 69,
    title: "We built Artifacts so you don’t have to guess what the agent is doing.",
    jaTitle: "Artifacts の仕組み：エージェントの意図と進捗を共有する",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-03-06",
    durationSeconds: 75,
    summary:
      "長時間・大規模タスクでエージェントが何をしているか把握するための「Artifacts」を詳しく紹介する動画。Implementation Plan・タスクリスト・Walkthrough と、画像上へのドラッグ指定を含むコメント反復ループを解説します。",
    takeaways: [
      "Artifacts はユーザーとエージェント間で共有される動的な中間成果物（shared source of truth）として機能する",
      "コード記述前の Implementation Plan、実行中にリアルタイム更新されるタスクリスト、ブラウザ録画やスクショ付き Walkthrough が生成される",
      "Plan・Walkthrough・変更コード行への直接コメントや画像上のドラッグ選択により、エージェントの軌道修正ができる",
    ],
    quiz: {
      question: "動画内で「Artifacts の真価（real power）」として強調されている機能はどれですか？",
      choices: [
        "タスク終了後にすべての計画と記録を自動消去して痕跡を残さないこと",
        "Implementation Plan・Walkthrough・コード行・画像上のドラッグ選択に対して直接コメントし軌道修正できるフィードバックループ",
        "ユーザーの承認なしで本番環境へ自動課金・公開すること",
      ],
      answerIndex: 1,
      explanation:
        "ただエージェントの動きを眺めるだけでなく、Plan や Walkthrough、変更箇所や画像に直接コメントして意図した方向へ導けるフィードバックループが核として説明されています。",
    },
    tags: ["Shorts", "Artifacts", "Implementation Plan", "Walkthrough", "フィードバック"],
  },
  {
    id: "Ib2szBigsRE",
    recommendedOrder: 70,
    title: "Seamlessly move between the big picture and the fine details without losing context.",
    jaTitle: "Agent Manager と Editor をコンテキスト維持のまま自在に行き来する",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-03-07",
    durationSeconds: 58,
    summary:
      "大規模コードベースを扱う開発者向けに、複数エージェントの並列管理・調査を担う「Agent Manager」と、精密なデバッグや手動仕上げを行う「Editor」を別ウィンドウかつ状態同期でシームレスに切り替える設計を解説します。",
    takeaways: [
      "エージェント中心の全体統括（Agent Manager）とエディタ中心の細部調整（Editor）をあえて別ウィンドウに分離している",
      "両者の状態はリアルタイムで同期されており、Editor を閉じた状態からでもコンテキストを失わず瞬時に切り替えられる",
      "IDE 外での非同期エージェント管理と、IDE 内の Tab・Command 等を使った同期的な仕上げの両立が可能",
    ],
    quiz: {
      question: "Antigravity が Agent Manager（エージェント主導ビュー）と Editor（エディタ主導ビュー）を設計した方法として正しいものはどれですか？",
      choices: [
        "両者を別ウィンドウに分離しつつ状態を同期させ、ハンドオフを最適化している",
        "Editor 機能を廃止し、テキスト入力のみで編集する方式に一本化している",
        "Editor と Agent Manager の状態は一切同期せず、毎回手動でコピーする",
      ],
      answerIndex: 0,
      explanation:
        "両方を 1 画面に無理に詰め込むのではなく別ウィンドウに分けつつ状態を同期させており、Editor が閉じていても瞬時に切り替えられると説明されています。",
    },
    tags: ["Shorts", "Agent Manager", "Editor", "並列開発"],
  },
  {
    id: "o82IxKiv9cI",
    recommendedOrder: 71,
    title: "Watch Antigravity build an app that fetches Met data, handles drag-and-drop, and analyzes colors",
    jaTitle: "Met API 連携・画像 D&D デザイン改善・配色抽出アプリを 2 プロンプトで構築",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-03-08",
    durationSeconds: 62,
    summary:
      "メトロポリタン美術館（Met）API から彫刻や美術品の画像を取得し配色パレットを生成する Web アプリを制作するデモ。機能実装後、Nano Banana で作った参考画像をドラッグ＆ドロップして見た目を刷新し、ブラウザで検証・動作確認します。",
    takeaways: [
      "Met API から作品画像を取得し、作品のカラーパレットを抽出するアプリを Implementation Plan に沿って構築した",
      "初期版の見た目改善のため、Nano Banana で作成した参考画像をチャットへドラッグ＆ドロップし、計画を更新させて再構築した",
      "エージェントのブラウザ検証に加え、ユーザー自身もブラウザでクリックによる HEX カラーコードコピーなどの操作感を確認した",
    ],
    quiz: {
      question: "初期アプリの機能は動いたもののデザイン（見た目）を改善したいとき、ユーザーはどのような手順で指示しましたか？",
      choices: [
        "CSS ファイルをすべて削除してテキストだけのページを作り直させた",
        "カラーコードをすべて手動でハードコーディングして入力し直した",
        "Nano Banana で作成した好みの UI 参考画像をドラッグ＆ドロップして再構築させた",
      ],
      answerIndex: 2,
      explanation:
        "機能は動くが理想のデザインではなかったため、Nano Banana で作成したイメージ画像をドラッグ＆ドロップして渡したところ、Implementation Plan を更新して見た目を作り直しました。",
    },
    tags: ["Shorts", "Met API", "ドラッグ＆ドロップ", "Nano Banana", "ブラウザ検証"],
  },
  {
    id: "7kSMHv9fITQ",
    recommendedOrder: 72,
    title: "Getting familiar with a new codebase is as simple as asking the right questions",
    jaTitle: "新しいコードベースを素早く理解する 3 つの質問・可視化テクニック",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-03-10",
    durationSeconds: 37,
    summary:
      "リポジトリ全体を手作業で通読しなくても、適切な質問と操作によって新しいコードベースを短時間で把握する 3 つの方法を紹介するショート動画。",
    takeaways: [
      "任意のコードブロックをハイライトし、「何をする処理か」「なぜこの書き方か」「どこから来ているか」などピンポイントに質問できる",
      "関連する複数ファイルをまとめてドラッグ＆ドロップすると、ファイル間の相互作用を即座に解説してくれる",
      "全体像を俯瞰したいときは Mermaid 図の生成を依頼し、アーキテクチャを一目で把握できる",
    ],
    quiz: {
      question: "コードベース全体のアーキテクチャを一目で把握したいとき、動画内で紹介されている依頼方法はどれですか？",
      choices: [
        "全ファイルを PDF に印刷して手書きで線を引く",
        "Antigravity に Mermaid 図（Mermaid diagram）を生成してもらう",
        "リポジトリ内のコメントをすべて削除してから再実行する",
      ],
      answerIndex: 1,
      explanation:
        "全体像をつかむ方法として、Antigravity に Mermaid 図を生成させてアーキテクチャを 1 枚の図でマッピングする手法が紹介されています。",
    },
    tags: ["Shorts", "コードリーディング", "Mermaid", "オンボーディング"],
  },
  {
    id: "uQ7PNeXqjbA",
    recommendedOrder: 73,
    title: "We asked Antigravity to onboard a new designer",
    jaTitle: "新任デザイナーのオンボーディング：サイト解析から Gmail 下書きまで自動化",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-03-10",
    durationSeconds: 44,
    summary:
      "新任デザイナーから求められたフォント・SVG ロゴ・カラーパレットの案内を Antigravity に任せるデモ。Implementation Plan 承認後にサイトをクロールして Walkthrough にまとめ、確認後に Gmail で案内メールの下書きを作成します。",
    takeaways: [
      "Implementation Plan 承認後、エージェントがブラウザで自社サイトを巡回し、フォント・カラーパレット・SVG ロゴを抽出した",
      "抽出したデザイン仕様は見やすい Walkthrough にまとめられ、SVG ロゴが正しいかも確認できる状態で提示された",
      "仕様の確認後、そのまま Gmail を開いてデザイナー宛ての案内メールを下書き作成し、最終確認して送信できた",
    ],
    quiz: {
      question: "ウェブサイトからフォント・SVG ロゴ・カラーパレットを抽出して Walkthrough にまとめたあと、エージェントはどのアプリでメール下書きを作成しましたか？",
      choices: [
        "Gmail",
        "Google スプレッドシート",
        "端末のターミナル画面",
      ],
      answerIndex: 0,
      explanation:
        "Walkthrough 上で SVG ロゴなどを確認したあと、エージェントが Gmail を開いて情報をまとめたメールの下書きを作成し、ユーザーが確認して送信する流れが紹介されています。",
    },
    tags: ["Shorts", "オンボーディング", "Gmail", "Walkthrough", "ブラウザ自動化"],
  },
  {
    id: "K4_iNowuCLA",
    recommendedOrder: 74,
    title: "Have you tried /btw in Google Antigravity?",
    jaTitle: "長時間タスクを止めずに別質問できる /btw スラッシュコマンド",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-07-20",
    durationSeconds: 40,
    summary:
      "仕様書からアプリを生成するような長時間タスクの実行中に、メインエージェントの作業を中断せず別の質問ができるスラッシュコマンド `/btw` の使い方を紹介する動画。",
    takeaways: [
      "長時間タスクの途中で聞き忘れたことがあっても、メインのエージェントを止める必要がない",
      "`/btw` を使うと別のエージェントが立ち上がり、並行して質問を投げかけられる",
      "「このアプリではどのフレームワークを使う予定か」といった確認をメイン処理完了と並行して行える",
    ],
    quiz: {
      question: "メインのエージェントが長時間タスクを実行している最中に、作業を止めず質問するためのスラッシュコマンドはどれですか？",
      choices: [
        "`/stop`",
        "`/reset`",
        "`/btw`",
      ],
      answerIndex: 2,
      explanation:
        "長時間タスクを中断せずに別エージェントへ質問を投げられるコマンドとして `/btw` が紹介されています。",
    },
    tags: ["Shorts", "/btw", "スラッシュコマンド", "並行質問"],
  },
  {
    id: "xwbZNchtrGQ",
    recommendedOrder: 75,
    title: "Package your skills and tools into an Agent Plugin",
    jaTitle: "Skills と MCP をまとめる Agent Plugin 仕様と Build with Google プラグイン",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-08-18",
    durationSeconds: 77,
    summary:
      "Skills や MCP 設定などを 1 つにパッケージ化する新しい Agent Plugin 仕様の構造と、Antigravity の設定画面からすぐ導入できる「Build with Google」プラグイン群を紹介する動画。",
    takeaways: [
      "Agent Plugin 仕様は、マニフェスト・`skills` サブディレクトリ・MCP 設定ファイル・必要に応じたクライアント固有項目からなるシンプルなディレクトリ構造",
      "Antigravity 内の「設定 → Customizations → Build with Google plugins（Customize）」から Google 公式プラグイン群を簡単に選択できる",
      "Android・モダン Web ガイド・Antigravity SDK・Firebase・Dart・Flutter・Data Agent Kit（BigQuery / Cloud Spanner）・Gemini API などが用意されている",
    ],
    quiz: {
      question: "動画内で説明された「Agent Plugin 仕様」のディレクトリ構造に含まれる要素の組み合わせとして正しいものはどれですか？",
      choices: [
        "コンパイル済みバイナリファイルとスクリーンショット画像のみ",
        "マニフェスト、`skills` サブディレクトリ、MCP 設定ファイル、およびクライアント固有の項目",
        "Git のコミット履歴ファイルと Dockerfile のみ",
      ],
      answerIndex: 1,
      explanation:
        "Agent Plugin 仕様は、マニフェスト（manifest）、`skills` サブディレクトリ、MCP 設定ファイル、およびクライアント固有項目で構成されるディレクトリ構造であると説明されています。",
    },
    tags: ["Shorts", "Agent Plugin", "Skills", "MCP", "Build with Google"],
  },
  {
    id: "bnEC54Xf4pY",
    recommendedOrder: 76,
    title: "Antigravity on your phone?",
    jaTitle: "スマホからも操作可能：Antigravity Remote Control の始め方",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-09-01",
    durationSeconds: 54,
    summary:
      "モバイル端末から Antigravity を操作できる Remote Control 機能のセットアップ手順を解説するショート動画。設定画面で有効化して QR コードを読み取るだけで同じプロジェクトが同期され、スマホカメラの写真を使った会話も始められます。",
    takeaways: [
      "「設定 → Application」から「Enable Remote Control」をオンにし、自動生成されたデバイス名（変更可能）と QR コードを確認する",
      "QR コードをスキャンしてモバイル版を開くと、デスクトップとまったく同じプロジェクトが同期される",
      "スマホのカメラで撮影した写真をアップロードしてプロンプトを送ると、両デバイス間で即座に会話が同期される",
    ],
    quiz: {
      question: "モバイルで Remote Control を利用開始する手順として、動画内で示された操作はどれですか？",
      choices: [
        "Application 設定で「Enable Remote Control」を有効化し、表示された QR コードをスキャンする",
        "モバイル端末側に専用サーバーのソースコードを手動コンパイルして配置する",
        "デスクトップ側でプロジェクトを ZIP 圧縮して毎回メール送信する",
      ],
      answerIndex: 0,
      explanation:
        "「Settings → Application」で Enable Remote Control を有効化し、QR コードをスキャンするだけで同一プロジェクトが同期されたモバイル版が開きます。",
    },
    tags: ["Shorts", "Remote Control", "モバイル連携", "QRコード"],
  },
  {
    id: "B740Ra_mx0U",
    recommendedOrder: 77,
    title: "Using Projects in Antigravity",
    jaTitle: "Projects 機能の活用：複数リポジトリをまとめて横断開発",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-09-02",
    durationSeconds: 33,
    summary:
      "従来の Workspaces から Projects へ移行したことで、1 つの Project 内に複数のフォルダをまとめられるようになったメリットを解説するショート動画。フロントエンドとバックエンドの Git リポジトリを同居させ、サブエージェント連携で横断変更・検証を行えます。",
    takeaways: [
      "Workspaces から Projects への移行により、1 つの Project に複数のフォルダを登録できるようになった",
      "フロントエンドとバックエンドそれぞれの Git リポジトリを 1 つの Project 内でチェックアウトし、システム横断で質問・変更できる",
      "各担当領域にサブエージェントを起動して個別に変更させ、オーケストレーター役のエージェントで E2E 検証する活用と好相性",
    ],
    quiz: {
      question: "Workspaces から Projects へ移行したことで可能になった構成として、動画内で挙げられている具体例はどれですか？",
      choices: [
        "1 つの Project に単一ファイルしか置けなくし、Git 利用を禁止する構成",
        "すべてのコードを単一のクラウド専用フォルダに強制統合する構成",
        "フロントエンドとバックエンドの Git リポジトリなど複数フォルダを 1 つの Project にまとめ、サブエージェントで横断変更・検証する構成",
      ],
      answerIndex: 2,
      explanation:
        "複数フォルダを 1 つの Project に持てるようになったことで、フロントエンドとバックエンドの Git リポジトリをまとめて扱い、サブエージェント連携で横断的な変更や E2E 検証ができると解説されています。",
    },
    tags: ["Shorts", "Projects", "マルチリポジトリ", "Subagents"],
  },
  {
    id: "HjEExWetrMc",
    recommendedOrder: 78,
    title: "Customizing your Antigravity theme",
    jaTitle: "Antigravity テーマのカスタマイズと /btw での配色案生成",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-09-02",
    durationSeconds: 52,
    summary:
      "Antigravity のテーマ設定（Light / Dark モードと background・foreground・accent の 3 色構成）を紹介しつつ、メイン会話のコンテキストを汚さずに `/btw` で配色 HEX コードを提案させて Appearance に適用するデモ動画。",
    takeaways: [
      "テーマ設定は大枠の Light / Dark テーマに加え、background・foreground・accent の 3 色でカスタマイズできる",
      "「Great Wave テーマ用の 3 つの HEX カラーを考えて」といった単発依頼を `/btw` で出すと、メインのコンテキストに混入させずに済む",
      "得られた HEX コードを Appearance 設定へ反映することで、好みの配色へ手軽に調整できる",
    ],
    quiz: {
      question: "動画内でテーマの配色アイデアを得るために `/btw` を使った理由として述べられていることは何ですか？",
      choices: [
        "テーマ設定は `/btw` 経由でしかデータベースに保存できないため",
        "メイン作業のコンテキストに影響を与えずに、単発のサブエージェントで必要な情報だけ取得できるため",
        "`/btw` を使うとカラーコードが自動的に動画として書き出されるため",
      ],
      answerIndex: 1,
      explanation:
        "ちょっとした単発の調べもの・提案取得に `/btw` を使うことで、進行中のメインコンテキストを汚さずにサブエージェントから結果を受け取れる利点が示されています。",
    },
    tags: ["Shorts", "テーマ設定", "Appearance", "/btw"],
  },
  {
    id: "T3vOZgPHNNw",
    recommendedOrder: 79,
    title: "What are slash commands in Antigravity?",
    jaTitle: "Antigravity のスラッシュコマンド紹介（antigravity-guide / /learn）",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-09-02",
    durationSeconds: 42,
    summary:
      "Antigravity 内の代表的なスラッシュコマンドとして、製品やアプリの使い方を案内する `antigravity-guide` と、会話内容から Skills やコンテキストの更新案・Markdown アーティファクトへの保存を提案する `/learn` を紹介する動画。",
    takeaways: [
      "`antigravity-guide` コマンドを実行すると、Antigravity 自体の機能や使い方を対話的に案内してもらえる",
      "`/learn` コマンドを使うと、エージェントがその会話を振り返ってプロジェクトの Skills やコンテキストの更新案を見つけてくれる",
      "`/learn` で得た学びを Markdown アーティファクトとして保存し、今後の作業へ引き継ぐ使い方もできる",
    ],
    quiz: {
      question: "会話の内容を振り返り、プロジェクトの Skills やコンテキストの更新案を見つけて提案してくれるコマンドはどれですか？",
      choices: [
        "`/learn`",
        "`/archive`",
        "`/theme`",
      ],
      answerIndex: 0,
      explanation:
        "動画では `/learn` を実行することで会話を確認し、プロジェクト用 Skills やコンテキストの更新提案や Markdown アーティファクトへの保存を行えると説明されています。",
    },
    tags: ["Shorts", "スラッシュコマンド", "/learn", "antigravity-guide"],
  },
  {
    id: "mYzc3sYMtMw",
    recommendedOrder: 80,
    title: "Do you use subagents?",
    jaTitle: "Subagents の活用：最大 10 階層のネストとスコープ／役割分担",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-09-02",
    durationSeconds: 47,
    summary:
      "オーケストレーション担当のエージェントからタスク単位でサブエージェントを起動し、役割や担当範囲を分けて開発を進める考え方を解説するショート動画。サブエージェントは最大 10 階層（10 depth levels）まで入れ子にできます。",
    takeaways: [
      "オーケストレーターからタスクごとにサブエージェントを起動でき、サブエージェント同士も最大 10 階層までネスト可能",
      "バックエンド担当・フロントエンド担当・統合担当といった「スコープ（担当範囲）」で分担できる",
      "コードレビュー役・QA 役・敵対的レビュアー（adversarial reviewer）役など「役割（hats）」を被せて多角的に検証できる",
    ],
    quiz: {
      question: "動画内で言及されている、サブエージェントがさらにサブエージェントを呼び出せる最大階層（深さ）はいくつですか？",
      choices: [
        "最大 2 階層まで",
        "最大 5 階層まで",
        "最大 10 階層まで",
      ],
      answerIndex: 2,
      explanation:
        "字幕で「subagents can have subagents up to a 10 depth level」と明言されており、最大 10 階層までネスト可能です。",
    },
    tags: ["Shorts", "Subagents", "オーケストレーション", "QA・レビュー"],
  },
  {
    id: "rF0dh96w9uk",
    recommendedOrder: 81,
    title: "Archiving conversations in Antigravity",
    jaTitle: "Antigravity 2.0 での会話アーカイブと削除の使い分け",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-09-02",
    durationSeconds: 50,
    summary:
      "Antigravity 2.0 ではアクティブな会話がエージェントのコンテキストとして参照され得るため、使わない会話を積極的にアーカイブする習慣を推奨する動画。必要に応じて復元できるアーカイブと、エラーや古い状態を残さないための削除の違いも解説します。",
    takeaways: [
      "アクティブな状態のまま残っている会話や長時間の会話はエージェントのコンテキストを圧迫するため、使わないものは積極的なアーカイブが推奨される",
      "アーカイブした会話は画面から一覧整理（実質的に対象外扱い）しつつ、必要になれば復元画面から取り戻すことも可能",
      "エラーを起こした履歴や古い状態（stale state）を記憶させたくない場合は、アーカイブではなく削除（Delete）を使うのが有効",
    ],
    quiz: {
      question: "エラーが起きた履歴や古い状態をエージェントに記憶させたくない場合、アーカイブ以外に推奨されている操作はどれですか？",
      choices: [
        "会話をアクティブのまま最上部に固定（ピン留め）する",
        "会話を削除（Delete）して古い状態を取り除く",
        "同じ内容で新しい会話を 10 個複製する",
      ],
      answerIndex: 1,
      explanation:
        "エラーや古い状態をエージェントに覚えておいてほしくないケースでは、会話を削除（Delete）することで取り除けると説明されています。",
    },
    tags: ["Shorts", "Antigravity 2.0", "会話アーカイブ", "コンテキスト管理"],
  },
  {
    id: "s3zk0MrzrB0",
    recommendedOrder: 82,
    title: "Google Antigravity context window optimization",
    jaTitle: "コンテキストウィンドウ最適化：Skills 優先とプロジェクト単位の MCP 読込",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-09-02",
    durationSeconds: 51,
    summary:
      "コンテキストウィンドウの消費が速すぎるときの見直しポイントを解説するショート動画。Customizations 画面で消費予算を確認し、常時読込される MCP ツールを厳選してできるだけ Skills 側へ寄せる方針と、プロジェクト単位での MCP 読み込み活用を勧めています。",
    takeaways: [
      "コンテキストを消費しすぎているときは、まず Customizations 画面で現在のバジェット（消費量）が過剰になっていないか確認する",
      "原則として知識・手順は可能な限り Skills に寄せ、本当に必要な MCP ツールだけを取捨選択して有効化する",
      "有効化した MCP ツールは新しいチャットを開くたびに丸ごと読み込まれるため、プラグインや MCP 設定でプロジェクト単位に読み込む工夫が重要",
    ],
    quiz: {
      question: "コンテキスト消費を抑えるための一般的な目安（rule of thumb）として、動画内で勧められている構成はどれですか？",
      choices: [
        "可能な限り Skills として保持し、本当に必要な MCP ツールだけをプロジェクト単位等で厳選して読み込む",
        "すべての MCP ツールを全プロジェクトで常時有効化し、Skills は一切使わない",
        "新しいチャットを開くたびにコンテキスト予算の上限設定を無効化する",
      ],
      answerIndex: 0,
      explanation:
        "MCP ツールは新規チャット開始のたびに毎回読み込まれてコンテキストを消費するため、できる限り Skills に寄せて、MCP ツールは必要最小限・プロジェクト単位で厳選することが推奨されています。",
    },
    tags: ["Shorts", "コンテキスト最適化", "Skills", "MCP"],
  },
  {
    id: "Njk6DACL0gA",
    recommendedOrder: 83,
    title: "How have Gemini models evolved?",
    jaTitle: "Gemini モデルの進化：Flash の伴走ループから Argon の外向きループへ",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-10-27",
    durationSeconds: 52,
    summary:
      "Flash 世代から Argon への Gemini モデルの進化を振り返る対談ショート動画。計画を細かく練って素早く結果を得ていた Flash の伴走型（インナーループ）から、最終ゴールを伝えるだけで細部やプレイ・スクリーンショット確認まで自律的に完遂する Argon（アウターループ）への変化を語ります。",
    takeaways: [
      "Flash では結果を高速に得つつも、人間が Implementation Plan を丁寧に練り込む伴走ループ（companion loop）が中心だった",
      "Argon ではユーザーの意図をより的確に汲み取り、インナーループから「ゴールだけ指定して詳細を任せる」アウターループへ近づいている",
      "たとえばゲームの再構築を頼めば、実際に自分でプレイしスクリーンショットで画面を確認しながら正しい結果へ到達できるようになっている",
    ],
    quiz: {
      question: "動画内で語られた、Flash から Argon へのモデル進化による開発スタイルの変化として適切なものはどれですか？",
      choices: [
        "Implementation Plan を使わなくなり、1 行ずつ手動でタイピングする方式に戻った",
        "人間が細部まで命令しなければ何も動かなくなった",
        "最終ゴールを指定するだけで、モデルが細部の実装や画面確認（スクショ等）まで自律的に進めるアウターループへ進化した",
      ],
      answerIndex: 2,
      explanation:
        "Flash 期の丁寧な計画作り中心の伴走ループから、Argon では最終ゴールを示すだけでモデルが細部や検証（ゲームのプレイやスクリーンショット確認など）を自律的に担う段階へ進んでいると語られています。",
    },
    tags: ["Shorts", "Gemini", "Flash", "Argon", "モデル進化"],
  },
  {
    id: "Rc8belcms5U",
    recommendedOrder: 84,
    title: "How has prompting changed?",
    jaTitle: "プロンプトの書き方はどう変わったか：精密記述から思考のそのまま入力へ",
    format: "short",
    track: "shorts",
    availability: "public",
    uploadDate: "2026-10-27",
    durationSeconds: 27,
    summary:
      "以前は意図外の動きを防ぐため非常に厳密な言葉遣いが求められていたが、音声モデルと Antigravity の頭脳（推論能力）の進化により、思いついたことを整理せずそのまま吐き出す（word dump）入力でも要点が汲み取られるようになった変化を語るショート動画。",
    takeaways: [
      "以前は期待どおりのことだけを実行させるために、プロンプトの表現を極めて厳密に整える必要があった",
      "音声入力モデルと Antigravity の中核となる頭脳の発展により、整理されていない思考の羅列（word dump）でも受け止められる",
      "必要な情報の核（nuggets）さえ含まれていれば全体の意図を汲んで実行してくれるため、入力の手間（input friction）が大きく下がった",
    ],
    quiz: {
      question: "音声モデルや Antigravity の頭脳の進化によって変わった「入力スタイル」について、動画ではどのように説明されていますか？",
      choices: [
        "これまで以上に厳格な構文テンプレートに従わないとエラーになるようになった",
        "整理されていない思考の吐き出し（word dump）でも重要な要素が含まれていれば意図を汲み取って実行でき、入力の摩擦が減った",
        "テキスト入力は廃止され、コード番号のみでの入力が必須になった",
      ],
      answerIndex: 1,
      explanation:
        "以前は厳密な表現が不可欠でしたが、音声モデルと Antigravity の進化により、情報の核が含まれていれば整理されていない入力（word dump）でも意図が通じ、入力の心理的・作業的負荷が大きく下がったと説明されています。",
    },
    tags: ["Shorts", "プロンプト", "音声入力", "UX"],
  },
];
