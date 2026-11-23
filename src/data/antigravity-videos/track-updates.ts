// Track 3 (updates: 9本)
// 出どころ: YouTube 公式チャンネル (@googleantigravity / UC_eVxIPHFZm7oF_gET0x-8Q)
// 取得手段: yt-dlp 一次メタデータ・概要欄・字幕取得（取得日: 2026-11-23）

import type { AntigravityVideo } from "./types";

export const updateVideos: AntigravityVideo[] = [
  {
    id: "im_cBjH6lDQ",
    recommendedOrder: 24,
    title: "Mission Report Ep. 01 | Antigravity Updates",
    jaTitle: "Mission Report Ep. 01：Agent Skills・Terminal Sandboxing・Gemini 3 Flash 導入",
    format: "video",
    track: "updates",
    playlist: "Mission Report",
    availability: "public",
    uploadDate: "2026-02-02",
    durationSeconds: 153,
    summary:
      "月次アップデート紹介シリーズ「Mission Report」第 1 回。公式ローンチから 2 か月間の基盤強化として、オープン標準で再利用可能な「Agent Skills」の正式公開、Gemini ベースの新しい Tab モデル基盤、コマンド実行をプロジェクトフォルダ内に厳格制限する「Terminal Sandboxing」を紹介しています。あわせて 12 月の追加機能（Gemini 3 Flash、コードベースに基づく UI モックやシステム図生成向けの Nano Banana Pro 統合、ネイティブ音声対応、Agent Manager 高速化）や、Ephemeral Messages・Artifacts・時速 100 マイル超の車向け AI レーシングコーチ実装事例も取り上げます。",
    takeaways: [
      "Agent Skills が正式公開され、チームの専門知識やベストプラクティスをオープン標準の再利用可能なスキルとしてパッケージ化し、チーム全体で共有できるようになりました。",
      "Terminal Sandboxing により、エージェントが実行するすべてのターミナルコマンドがプロジェクトフォルダ内に厳格制限され、意図しない領域への変更を防げます。",
      "Tab モデルの Gemini ベース新基盤への刷新に加え、Gemini 3 Flash、Nano Banana Pro 統合、ネイティブ音声対応、Agent Manager と長時間会話の高速化が実施されました。",
    ],
    quiz: {
      question: "Ep. 01 で紹介された「Terminal Sandboxing」の主な役割はどれですか？",
      choices: [
        "エージェントが実行したコマンドのログを外部クラウドへ自動保存すること",
        "すべてのターミナルコマンド実行をプロジェクトフォルダ内に厳格制限し、意図しない場所への変更を防ぐこと",
        "複数のターミナルプロセスを自動並列化してビルド時間を短縮すること",
      ],
      answerIndex: 1,
      explanation:
        "Terminal Sandboxing は、エージェントが実行するすべてのターミナルコマンドをプロジェクトフォルダ内に厳格に閉じ込めることで、変更すべきでない場所を保護する安全機能として導入されました。",
    },
    tags: [
      "Mission Report",
      "Agent Skills",
      "Terminal Sandboxing",
      "Gemini 3 Flash",
      "Nano Banana Pro",
      "Artifacts",
    ],
  },
  {
    id: "Lfhf575Z_yI",
    recommendedOrder: 25,
    title: "Mission Report Ep. 02 | Antigravity Updates",
    jaTitle: "Mission Report Ep. 02：Gemini 3.1 Pro・Nano Banana 2・Quota Dashboard と Q&A",
    format: "video",
    track: "updates",
    playlist: "Mission Report",
    availability: "public",
    uploadDate: "2026-03-03",
    durationSeconds: 252,
    summary:
      "第 2 回では、高速化とテキスト描画・ローカライズ・画像検索グラウンディング精度を向上させた「Nano Banana 2」と、複雑な長期タスクの計画に強みを持つ高度な推論モデル「Gemini 3.1 Pro」の追加を発表しています。さらに各モデルの残クォータをリアルタイム確認できる「Model Quota Dashboard」や 1 クリックでの Artifact ローカル保存、Implementation Plan / Screenshot to UI のデモに加え、振り返りからの Skills 生成や「Low/High」と「Fast/Planning」の 2 軸の違いに関する Q&A を解説します。",
    takeaways: [
      "複雑な長期タスクの計画に優れた「Gemini 3.1 Pro」と、高速かつ高精度なテキスト描画・画像検索グラウンディングを備えた「Nano Banana 2」が追加されました。",
      "Model Quota Dashboard で利用可能なモデルクォータをリアルタイムに把握でき、生成した Artifact も 1 クリックでローカルへダウンロード可能になりました。",
      "モデルの Low/High は API レベルでの思考量を制御し、Fast/Planning は Artifact 生成やタスク整理などエージェントへ提供するツール群を切り替える別の軸として機能します。",
    ],
    quiz: {
      question: "Q&A で解説された「Low / High」と「Fast / Planning」の 2 軸の違いとして正しいものはどれですか？",
      choices: [
        "Low / High は出力言語の種類を切り替え、Fast / Planning はクラウド実行とローカル実行を切り替える",
        "どちらも内部的には同じ設定であり、表示画面によって名称が異なるだけである",
        "Low / High はモデル API レベルの思考量を制御し、Fast / Planning は Artifact 生成などエージェントに与えるツールを切り替える",
      ],
      answerIndex: 2,
      explanation:
        "番組内の Q&A では、Low / High は各呼び出しでモデルがどれだけ思考するか（API レベル）、Planning / Fast はエージェントに Artifact 生成やタスクのグループ化といった追加ツールを与えるかどうかを制御する 2 つの独立した軸であると説明されています。",
    },
    tags: [
      "Mission Report",
      "Gemini 3.1 Pro",
      "Nano Banana 2",
      "Model Quota Dashboard",
      "Implementation Plan",
      "Agent Skills",
    ],
  },
  {
    id: "fTf3QBUM3Zg",
    recommendedOrder: 26,
    title: "Mission Report Ep. 03 | Antigravity Updates",
    jaTitle: "Mission Report Ep. 03：UI 洗練・AGENTS.md 対応・Linux 版サンドボックス",
    format: "video",
    track: "updates",
    playlist: "Mission Report",
    availability: "public",
    uploadDate: "2026-04-06",
    durationSeconds: 179,
    summary:
      "第 3 回のテーマはプロダクト全体の洗練（Product Polish）です。すべての中間ステップを辿らなくても最終出力と Artifact を前面で確認できるチャットビュー簡素化、サイドバーのステータス表示集約と 1 クリックのチャットアーカイブ、会話読込・MCP 認証・Agent Manager の高速化を紹介しています。さらにグローバル規約用の GEMINI.md に加えてプロジェクト固有規約を記述する AGENTS.md の読込に対応し、macOS に続き Linux でもカーネルレベルの Terminal Sandboxing が利用可能になりました。",
    takeaways: [
      "チャットビューの簡素化・サイドバーのステータス集約・1 クリックのチャットアーカイブ・MCP 認証の円滑化により、複数エージェント並行時の状況把握が容易になりました。",
      "全プロジェクト共通のグローバルルールには GEMINI.md、特定プロジェクト固有のルールには AGENTS.md を使う構成で両ファイルの読み込みに対応しました。",
      "カーネルレベルの Terminal Sandboxing が macOS に続き Linux へ拡大され、Q&A では Skills の段階的読込を活用したリポジトリ別 MCP 絞り込みや Subagent 連携の方向性も語られました。",
    ],
    quiz: {
      question: "Ep. 03 で案内された GEMINI.md と AGENTS.md の推奨される使い分けはどれですか？",
      choices: [
        "GEMINI.md を常時適用したいグローバルルールに使い、AGENTS.md を特定プロジェクト固有のルールに使う",
        "GEMINI.md はフロントエンド専用、AGENTS.md はバックエンド専用として自動判別される",
        "AGENTS.md へ完全移行したため、GEMINI.md は読み込まれなくなった",
      ],
      answerIndex: 0,
      explanation:
        "動画内では、常にエージェントへ従わせたいグローバルなルールには GEMINI.md を用い、特定のプロジェクトに固有のルールには AGENTS.md を使う方針が示されています。",
    },
    tags: [
      "Mission Report",
      "AGENTS.md",
      "GEMINI.md",
      "Terminal Sandboxing",
      "Linux",
      "MCP",
      "Subagents",
    ],
  },
  {
    id: "C8Ch-l7PZe0",
    recommendedOrder: 27,
    title: "Mission Report Ep. 04 | Antigravity Updates",
    jaTitle: "Mission Report Ep. 04：Google I/O 発表まとめ（Antigravity 2.0・CLI・SDK）",
    format: "video",
    track: "updates",
    playlist: "Mission Report",
    availability: "public",
    uploadDate: "2026-06-05",
    durationSeconds: 369,
    summary:
      "Google I/O での発表を含む過去最大規模のアップデート回です。複数プロジェクトで複数エージェントを同時オーケストレーションできる独立デスクトップアプリ「Antigravity 2.0」（Subagents 並列実行、非同期バックグラウンドタスク管理、cron 形式のスケジュールタスク、音声文字起こし対応）を中心に、継続して修正・維持される「Antigravity IDE」、ターミナル向けの軽量な「Antigravity CLI」（1 コマンドでの 2.0 への会話インポート・Skills/Hooks/Subagents/Plugins 対応）、Python からハーネスを直接呼び出せる「Antigravity SDK」の統合エコシステムを解説します。",
    takeaways: [
      "独立デスクトップアプリ「Antigravity 2.0」が登場し、複数プロジェクト横断のオーケストレーション、Subagents 並列実行、非同期タスク管理、cron スケジュール実行、音声文字起こしに対応しました。",
      "Antigravity IDE も維持・改善されており、非コード業務を含む幅広いタスクは 2.0 で動かしつつ、深いコーディングは Antigravity IDE や任意のエディタへ接続して併用できます。",
      "軽量な「Antigravity CLI」（2.0 への会話インポートや Plugins 等を継承）と pip install 可能な Python 製「Antigravity SDK」により、同一ハーネスをターミナルや自作アプリからも活用できます。",
    ],
    quiz: {
      question: "Ep. 04 で紹介された「Antigravity SDK」の特徴として正しいものはどれですか？",
      choices: [
        "IDE の UI テーマのみをカスタマイズするための CSS ライブラリである",
        "pip install で導入でき、メモリ管理・ツール実行・安全ガードレールを自動管理しつつ 2.0 や CLI と同じハーネスを Python から呼び出せる",
        "音声入力のみを扱う専用ドライバであり、カスタムスキルは利用できない",
      ],
      answerIndex: 1,
      explanation:
        "Antigravity SDK は 1 回の pip install で導入でき、メモリ・ツール実行・安全ガードレールといった基盤を自動管理しながら、2.0 や CLI と同じ Antigravity ハーネスを Python から直接呼び出してカスタムエージェントを構築できます。",
    },
    tags: [
      "Mission Report",
      "Antigravity 2.0",
      "Antigravity CLI",
      "Antigravity SDK",
      "Subagents",
      "Scheduled Tasks",
      "Google I/O",
    ],
  },
  {
    id: "uivEgGR9go4",
    recommendedOrder: 28,
    title: "Mission Report Ep. 05 | Antigravity Updates",
    jaTitle: "Mission Report Ep. 05：クォータ画面刷新・Projects 改称・PDF/音声対応と CLI 高速化",
    format: "video",
    track: "updates",
    playlist: "Mission Report",
    availability: "public",
    uploadDate: "2026-07-07",
    durationSeconds: 323,
    summary:
      "第 5 回では、設定の Models タブで 5 時間枠と週間枠の使用量・残量を把握できる刷新版「Quota Dashboard」と、Workspaces から「Projects」への正式改称（複数フォルダ統合およびプロジェクト独立の設定・セキュリティ・ルール適用）を紹介しています。さらに PDF のドラッグ＆ドロップネイティブ対応、サイドバー/Artifact ビューアでの音声プレビュー、Markdown の整形表示/Raw 切替、会話内で質問できる組み込みガイド、2.0 と CLI 両対応のスラッシュコマンド（対話式要件ヒアリング用コマンド・自律完遂型 `/goal`・定期実行 `/schedule`）、CLI のフルスクリーン編集・LaTeX 数式表示・権限管理と高速化を取り上げます。",
    takeaways: [
      "設定画面の Models タブにある新 Quota Dashboard で、5 時間クォータと週間クォータの使用済み割合および残量を簡単に確認できるようになりました。",
      "Workspaces は「Projects」へ改称され、フロントエンドとバックエンドの別リポジトリ等を 1 つにまとめつつ、グローバル設定を汚さず独立したセキュリティ構成やルールを設定できます。",
      "PDF 直接読込、音声プレビュー、Markdown 表示切替、会話内 Antigravity Guide、/goal・/schedule 等のスラッシュコマンド、CLI の対話的権限管理と並列履歴読込が加わりました。",
    ],
    quiz: {
      question: "Ep. 05 で「Workspaces」から正式改称された「Projects」の機能説明として正しいものはどれですか？",
      choices: [
        "単一または複数フォルダを束ねてエージェントの作業範囲を区切り、グローバル設定に影響せず独立した設定・セキュリティ・ルールを持たせられる",
        "クラウド請求アカウントをプロジェクトごとに自動新規作成する課金管理単位である",
        "1 プロジェクトにつき 1 ファイルしか読み込めない軽量モードの名称である",
      ],
      answerIndex: 0,
      explanation:
        "Projects はエージェントの境界とスコープを定義する単位であり、単一フォルダだけでなくフロントエンドとバックエンド等の複数フォルダをグループ化し、グローバル設定へ影響を与えずにプロジェクト別の設定・セキュリティ・ルールを適用できます。",
    },
    tags: [
      "Mission Report",
      "Quota Dashboard",
      "Projects",
      "PDF",
      "Slash Commands",
      "Antigravity CLI",
      "Antigravity Guide",
    ],
  },
  {
    id: "tiFLdJJGpno",
    recommendedOrder: 29,
    title: "New Updates in Google Antigravity | Episode 6",
    jaTitle: "New Updates Episode 6：Gemini 3.6 Flash・CLI モード切替・SDK マルチモーダル応答",
    format: "video",
    track: "updates",
    playlist: "Mission Report",
    availability: "public",
    uploadDate: "2026-08-11",
    durationSeconds: 356,
    summary:
      "エピソード 6 では、3.5 Flash 比で出力トークン消費量を平均 17% 削減し多段階コーディングの実行ループを抑えて高速化した「Gemini 3.6 Flash」を発表しています。また待機中メッセージの即時送信/アイドル時キュー設定、JSON・CSV・Markdown・テキストのドラッグ＆ドロップ入力、CLI の `Shift+Tab` による実行モード切替（`default` / `accept edits`）・`/effort` 調整・刷新版 `/model` ピッカー・ライブコード検索 `/codesearch`（`Esc` で即停止）・JSON Schema 出力、さらに SDK のマルチモーダルツール応答、14 種の音声フォーマット対応、OpenTelemetry トレーシングを紹介します。",
    takeaways: [
      "Gemini 3.6 Flash が全面展開され、3.5 Flash と比べて出力トークン消費量を平均 17% 削減しつつ多段階コーディング時の反復ループを減らして完了を高速化しました。",
      "JSON・CSV・Markdown・テキストファイルの直接投入やキュー済みメッセージ制御に加え、CLI では Shift+Tab での実行モード切替、/effort、/codesearch、JSON スキーマ固定出力が利用可能になりました。",
      "Antigravity SDK はカスタムツールから生成 UI スクリーンショット・音声・動画・ドキュメントを直接返すマルチモーダル応答、14 種の音声フォーマット、OpenTelemetry トレースに対応しました。",
    ],
    quiz: {
      question: "Ep. 06 で紹介された CLI の「Shift+Tab」で切り替える実行モード（default / accept edits）の動作として正しいものはどれですか？",
      choices: [
        "accept edits モードではファイル変更に加えてすべてのターミナルコマンドも確認なしで実行される",
        "default モードでは確認を一切挟まずにチャットを一括完了する",
        "accept edits モードではファイル変更を自動承認する一方、ターミナルコマンドや機微な操作の実行前には引き続き確認プロンプトを表示する",
      ],
      answerIndex: 2,
      explanation:
        "default モードではファイルに触れる前にも一時停止して行単位の差分を確認でき、accept edits モードではファイル編集を自動承認しつつもターミナルコマンドなど機微な操作の前には確認が求められます。",
    },
    tags: [
      "Mission Report",
      "Gemini 3.6 Flash",
      "Antigravity CLI",
      "Antigravity SDK",
      "OpenTelemetry",
      "Multimodal",
    ],
  },
  {
    id: "Plq-FIEbQkk",
    recommendedOrder: 30,
    title: "New Updates in Google Antigravity | Episode 7",
    jaTitle: "New Updates Episode 7：Gemini 3.7 Flash・Remote Control・IDE 拡張と Git 統合",
    format: "video",
    track: "updates",
    availability: "public",
    uploadDate: "2026-09-04",
    durationSeconds: 300,
    summary:
      "エピソード 7 では、多段階計画・デバッグ・初回コード精度を大幅に高め、年内は 3.6 Flash の半額相当（クォータ効率 2 倍）で使える「Gemini 3.7 Flash」を発表しています。また Pixel・Chromebook・iPad や Android/iOS ブラウザから稼働中セッションへ接続しネイティブプッシュ通知を受信できる「Remote Control」、Antigravity 2.0 の `.agent` フォルダでのカスタムエージェント定義・サイドバー統合 Git（リアルタイム差分/1 クリックコミット）・内蔵ターミナル、VS Code・Visual Studio・JetBrains 向け IDE 拡張、Gemini Enterprise 対応、CLI のモーダルエディタと NDJSON ヘッドレス実行を紹介します。",
    takeaways: [
      "Gemini 3.7 Flash は多段階計画・デバッグ・初回コード精度を向上させ、年内は従来の 3.6 Flash の半額コスト相当でクォータを 2 倍長持ちさせられます。",
      "Remote Control によりスマートフォンやタブレット等のブラウザから稼働中のセッションを遠隔確認でき、2.0 本体にも .agent 定義・統合 Git 差分・内蔵ターミナルが追加されました。",
      "VS Code・Visual Studio・JetBrains 向けの Antigravity IDE 拡張機能に加え、支出上限や権限管理を備えた Gemini Enterprise 連携、CLI の NDJSON ストリーム駆動にも対応しました。",
    ],
    quiz: {
      question: "Ep. 07 で追加された Antigravity 2.0 および CLI におけるカスタムエージェント／特化型 Subagent の定義方法はどれですか？",
      choices: [
        "IDE の実行バイナリ内の設定リソースを書き換える",
        ".agent フォルダ内に Markdown と YAML フロントマターを使って専用ツールやシステムプロンプトを定義する",
        "ローカル端末の hosts ファイルへエージェント名を追記する",
      ],
      answerIndex: 1,
      explanation:
        "Ep. 07 では、.agent フォルダに Markdown と YAML フロントマターを用いて専用ツールやシステムプロンプトを記述することで、カスタムエージェントや特化型 Subagent を作成できる（CLI でも利用可能）ことが紹介されています。",
    },
    tags: [
      "Gemini 3.7 Flash",
      "Remote Control",
      "Antigravity 2.0",
      "IDE Extensions",
      "Git",
      "Enterprise",
      "CLI",
    ],
  },
  {
    id: "aQCKyc2qtXo",
    recommendedOrder: 31,
    title: "New Updates in Google Antigravity | Episode 8",
    jaTitle: "New Updates Episode 8：Gemini 3.8 Flash・Teamwork/Boost・インタラクティブ UI 生成",
    format: "video",
    track: "updates",
    playlist: "Mission Report",
    availability: "public",
    uploadDate: "2026-10-05",
    durationSeconds: 275,
    summary:
      "エピソード 8 では、6 週間で 3 度目の更新となる日常開発の主力モデル「Gemini 3.8 Flash」に加え、長時間・数日規模の複雑な研究課題に複数エージェントが並列挑戦する「Teamwork」と、難解なバグや性能ボトルネック・大規模再構成に向けて実装役と独立検証役のペアで徹底テストを行う「Boost」の 2 つのマルチエージェントコマンドを紹介しています。さらに外部依存なしでプレビューや会話内に動作する UI プロトタイプや可視化を描画する機能、隔離環境での自動実行と破壊的操作の確認を両立する新権限システム、ターミナル分割保存、`Cmd/Ctrl+L` 引用、CLI の `remote control start` 常駐サービス化も解説します。",
    takeaways: [
      "日常開発の標準モデル「Gemini 3.8 Flash」（従来と同価格・同速度）に加え、長期研究向けの「Teamwork」と、実装＋独立検証ペアで難所を精査する「Boost」が導入されました。",
      "テキストや Markdown 表にとどまらず、外部依存なしでプレビューペインや会話内にローカル動作するインタラクティブな可視化・UI プロトタイプを提示できるようになりました。",
      "安全なコマンドを隔離環境で自動実行し破壊的操作や外部通信のみ確認を求める新権限システム、ターミナル分割状態の保持、Cmd/Ctrl+L 引用、CLI の OS バックグラウンド常駐に対応しました。",
    ],
    quiz: {
      question: "Ep. 08 で紹介された「Teamwork」と「Boost」の使い分けとして正しいものはどれですか？",
      choices: [
        "Teamwork は 1 行のタイポ修正専用、Boost はドキュメント翻訳専用である",
        "どちらも単一エージェントの応答温度パラメータを変更するだけの機能である",
        "Teamwork は数時間〜数日かかる複雑・研究課題に複数エージェントで挑み、Boost は難解なエラーやボトルネック解消に実行役と独立検証役のペアを投入する",
      ],
      answerIndex: 2,
      explanation:
        "Teamwork は複数エージェントが長時間にわたり独立して提案・検証・構築を進める研究的な難題向け（トークン消費大）、Boost は難解なバグや性能ボトルネック・複雑リファクタに対して実装側と独立検証側のペアで入念にテストするワークフロー向けとして紹介されています。",
    },
    tags: [
      "Mission Report",
      "Gemini 3.8 Flash",
      "Teamwork",
      "Boost",
      "Generative UI",
      "Permissions",
      "Remote Control",
    ],
  },
  {
    id: "UO2mTQMlB-8",
    recommendedOrder: 32,
    title: "New Updates in Google Antigravity | Episode 9",
    jaTitle: "New Updates Episode 9：Gemini 4 Argon・Subagent 直接対話・Windows Rootless Sandbox",
    format: "video",
    track: "updates",
    playlist: "Mission Report",
    availability: "public",
    uploadDate: "2026-11-02",
    durationSeconds: 289,
    summary:
      "エピソード 9 では、Google 社内の実コードベースにおける大規模バグバックログ消化やサーバー CPU オーバーヘッド半減などの本番課題で検証された最新フロンティアモデル「Gemini 4 Argon」のデスクトップアプリ・CLI・IDE 展開を発表しています。また Gemini macOS アプリへの Antigravity UX 統合、サードパーティ製を含むプラグインの会話内 1 クリック推奨導入、Subagent への直接指示（チャット選択および CLI `@subagent`）、コードによる定期バックグラウンドワークフロー構築、サイドペインのプラグイン UI・内蔵ブラウザ・Jupyter ノートブック対応、モバイル音声連携・1 クリック PDF 出力、CLI の Auto モード・Windows Rootless Sandboxing・刷新 `/diff`・`Alt+M`・`/compact` まで幅広く紹介します。",
    takeaways: [
      "最新フロンティアモデル「Gemini 4 Argon」がアプリ・CLI・IDE に展開され、Google 社内の本番コードベース課題で検証された高度なソフトウェア開発力を利用できるようになりました。",
      "チャットから稼働中 Subagent を選んで直接指示（CLI では @subagent）できるほか、会話内でのプラグイン 1 クリック追加、サイドペインの内蔵ブラウザ・Jupyter 表示、1 クリック PDF 出力が加わりました。",
      "CLI では Linux/macOS 向け Auto モード（Shift+Tab）、Windows 向け Rootless Sandboxing、構文強調・折りたたみ・ライブ検索対応の新 /diff、Alt+M 即時制御、/compact が実装されました。",
    ],
    quiz: {
      question: "Ep. 09 で追加された「Subagent への直接メッセージ機能」によって可能になったことはどれですか？",
      choices: [
        "メインエージェント経由の伝言を待たずに、チャット選択や CLI の @subagent から稼働中の Subagent の進捗確認と直接の軌道修正を行うこと",
        "起動中のすべての Subagent を強制終了してメインエージェントへ統合すること",
        "Subagent の出力をすべて音声データのみに制限すること",
      ],
      answerIndex: 0,
      explanation:
        "メインエージェントが作業を複数 Subagent に展開した際、メインエージェントの間接リレーを待たずにチャットから各 Subagent をクリック（CLI では @subagent）して進捗を確認し、直接指示を出して軌道修正できるようになりました。",
    },
    tags: [
      "Mission Report",
      "Gemini 4 Argon",
      "Subagents",
      "Plugins",
      "Built-in Browser",
      "Windows Sandbox",
      "Antigravity CLI",
    ],
  },
];
