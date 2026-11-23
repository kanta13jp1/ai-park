// Track 4 (remote-models: 16本)
// 出どころ: YouTube 公式チャンネル (@googleantigravity / UC_eVxIPHFZm7oF_gET0x-8Q)
// 取得手段: yt-dlp 一次メタデータ・概要欄・字幕取得（取得日: 2026-11-23）

import type { AntigravityVideo } from "./types";

export const remoteModelVideos: AntigravityVideo[] = [
  {
    id: "9Y-bOQkXh-I",
    recommendedOrder: 33,
    title: "Voice mode in Google Antigravity",
    jaTitle: "Google Antigravity の Voice Mode 紹介（Gemini Live 搭載）",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2026-11-06",
    durationSeconds: 190,
    summary:
      "Gemini Live モデルを搭載した Voice Mode の紹介動画です。声だけで開発計画の相談やコード変更の指示、権限プロンプトの承認・拒否をハンズフリーで行えるほか、好みの音声選択や再生速度の調整、対話中の割り込み発話、テキストや PDF 画像のアップロードにも対応し、多言語でのライブ対話を通じて作業を進められます。",
    takeaways: [
      "Gemini Live 搭載により、コーディングや Google Docs 作成と並行して音声でライブ対話・計画・コード指示が行えます。",
      "音声の選択（Fola / Arlo 等）や再生速度の調整、必要時の割り込み、PDF 等のファイル追加アップロードに対応しています。",
      "「allow it for this conversation」のように権限チェックの承認も音声で行え、終了時は「bye」と発話するか終了操作で閉じられます。",
    ],
    quiz: {
      question:
        "Voice Mode で作業中にエージェントから権限確認を求められた際、動画内で実演されている承認方法として正しいものはどれですか？",
      choices: [
        "Voice Mode を一度終了して、ターミナルで設定ファイルを書き換える",
        "「allow it for this conversation」のように音声で発話して承認する",
        "英語以外の言語に切り替えた場合のみ自動承認される",
      ],
      answerIndex: 1,
      explanation:
        "概要欄およびデモにある通り、Voice Mode では Gemini Live によるライブ対話の中で、権限プロンプトの承認（「この会話で許可」や拒否）も声に出して行えます。",
    },
    tags: ["Voice Mode", "Gemini Live", "音声操作", "権限承認", "多言語"],
  },
  {
    id: "_YIAcXZg9Yk",
    recommendedOrder: 34,
    title: "Remote Agents in Google Antigravity",
    jaTitle: "Google Antigravity の Remote Agents：クラウド仮想マシンで常時稼働",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2026-11-06",
    durationSeconds: 60,
    summary:
      "独立したクラウド仮想マシン（VM）上でタスクを実行する Remote Agents の紹介です。GitHub リポジトリや Google Drive フォルダを元にリモートプロジェクトを作成してタスクを投入すると、ノート PC を閉じた後もバックグラウンドで作業が継続され、外出先からスマートフォンのブラウザで権限解除や方針変更、新規タスク投入を行えます。",
    takeaways: [
      "タスクは独立したクラウド仮想マシン上の隔離環境で実行され、PC を閉じた後も開発が継続します。",
      "GitHub リポジトリだけでなく Google Drive フォルダを指定してリモートプロジェクトを作成できます。",
      "スマートフォン等のブラウザから権限チェック解除や方向修正が可能で、テスト通過後にレビュー用 Pull Request を作成します。",
    ],
    quiz: {
      question:
        "Remote Agents でリモートプロジェクトを作成する際、動画内で挙げられている指定元の組み合わせとして正しいものはどれですか？",
      choices: [
        "GitHub リポジトリまたは Google Drive フォルダ",
        "ローカルの USB メモリまたは FTP サーバーのみ",
        "Figma ファイルまたは Canva テンプレートのみ",
      ],
      answerIndex: 0,
      explanation:
        "動画の字幕解説では、GitHub リポジトリまたは Google Drive フォルダを使ってリモートプロジェクトを作成し、独立したクラウド VM 上でタスクを開始できると説明されています。",
    },
    tags: ["Remote Agents", "クラウドVM", "Pull Request", "モバイル操作", "バックグラウンド実行"],
  },
  {
    id: "1RXEp3rUuck",
    recommendedOrder: 35,
    title: "First Look: Remote Control with Antigravity",
    jaTitle: "First Look: Antigravity の Remote Control 機能",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2026-08-21",
    durationSeconds: 46,
    summary:
      "手元の環境で稼働中の Antigravity セッションへ、最新の対応ブラウザや iOS・Android 端末など任意のデバイスから接続できる Remote Control のファーストルックです。Settings の App メニューから有効化してニックネームを付けるだけで、移動中でも Artifacts へのコメントやファイルアップロード、ネイティブプッシュ通知への応答が可能です。",
    takeaways: [
      "Google Pixel・Chromebook・デスクトップ・iOS / Android 等、対応ブラウザやモバイル端末から稼働中セッションへアクセスできます。",
      "ネイティブ体験としてインストールすると、入力待ち時のネイティブプッシュ通知を受け取って応答できます。",
      "Settings → App で Remote Control をオンにし、複数台を識別しやすいニックネームを設定して管理できます。",
    ],
    quiz: {
      question:
        "Remote Control を利用する際、動画で案内されている有効化手順と複数環境管理の工夫として正しいものはどれですか？",
      choices: [
        "ターミナルで SSH 鍵を手動発行し、ポート番号で毎回接続先を識別する",
        "モバイルアプリ側からのみ設定でき、デスクトップ側の設定は不要",
        "Settings の App から Remote Control をトグルで有効化し、必要に応じてニックネームを設定する",
      ],
      answerIndex: 2,
      explanation:
        "動画内では、Settings → App から Remote Control をオンにし、複数デバイスから接続・管理しやすいようニックネームを設定できる手順が紹介されています。",
    },
    tags: ["Remote Control", "モバイル対応", "プッシュ通知", "Artifacts", "設定方法"],
  },
  {
    id: "-O5sq8TqP-g",
    recommendedOrder: 36,
    title: "Remote Control with Antigravity",
    jaTitle: "Antigravity Remote Control：ローカル環境を維持した統合マルチデバイス操作",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2026-08-21",
    durationSeconds: 90,
    summary:
      "ローカルやクラウドのデスクトップ・ノート PC・サーバー上のセッションを、ブラウザやアプリから 1 つの画面に統合して監視・操作できる Remote Control の紹介です。ソースコードやツール、認証情報はワークステーション側に保持されたままビルド環境を再構築せずに接続でき、長時間タスクの承認や質問応答を外出先から行えます。",
    takeaways: [
      "デスクトップ・ノート PC・サーバー上の全セッションを単一の統合ビューで監視し、編集承認や指示出しを行えます。",
      "ソースコード・ツール・認証情報は元のワークステーションに残るため、別端末でビルド環境を再現・同期する必要がありません。",
      "調査・設計から大規模リファクタリングまで長時間エージェントを走らせ、レビュー準備完了時のプッシュ通知で必要なときだけ介入できます。",
    ],
    quiz: {
      question:
        "Remote Control を使ってスマートフォン等から作業を続ける際、ソースコードやビルド環境・認証情報の扱いはどうなりますか？",
      choices: [
        "接続元のワークステーション上にそのまま保持され、別端末への環境再構築や同期は不要",
        "接続のたびにモバイル端末側へ全ソースコードと認証情報を複製してローカルビルドする",
        "リモート接続時は認証情報がすべて自動削除され、読み取り専用になる",
      ],
      answerIndex: 0,
      explanation:
        "解説では、ローカルコンテキスト（ソースコード・ツール・認証情報）はワークステーションに保持されたまま維持され、別デバイスでビルド環境を再構築・同期する必要はないと説明されています。",
    },
    tags: ["Remote Control", "環境維持", "長時間タスク", "マルチデバイス", "プッシュ通知"],
  },
  {
    id: "8QGW7ePYepE",
    recommendedOrder: 37,
    title: "Google Antigravity: Remote Control Walkthrough",
    jaTitle: "Google Antigravity Remote Control 詳細ウォークスルー（PWA・モバイル設定）",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2026-08-21",
    durationSeconds: 307,
    summary:
      "Antigravity 2.0 および CLI で Remote Control を設定し、Web ハブ（antigravity.google.com）経由でデスクトップや iOS・Android から操作する約 5 分間の詳細ウォークスルーです。インスタンス切替ドロップダウン、ブラウザ枠なしで起動できる PWA インストール手順、OS 通知設定、モバイル画面での Artifacts レビューとコメント投稿まで実演します。",
    takeaways: [
      "Settings → App で Remote Control を有効化すると、antigravity.google.com のハブに Antigravity 2.0 や CLI の各インスタンスが一覧表示され切り替えられます。",
      "Desktop Chrome・Android（メニューからインストール）・iOS（共有からホーム画面に追加）の PWA 化により、ブラウザ UI なしで Agent Manager を起動できます。",
      "モバイル最適化レイアウト上で Walkthrough 等の Artifacts 閲覧・コメント追加・権限ポップアップ承認・OS ネイティブ通知応答が可能です。",
    ],
    quiz: {
      question:
        "ウォークスルー動画内で紹介されている、Remote Control をデスクトップやモバイルで快適に使用するための活用方法として正しいものはどれですか？",
      choices: [
        "antigravity.google.com には 1 台のデバイスしか登録できないため、毎回古い端末を削除する",
        "Chrome 等から PWA としてインストールし、ホーム画面からブラウザ枠なしで起動して OS 通知を受け取る",
        "モバイルブラウザ上では Artifacts の閲覧ができず、テキストログのみ確認する",
      ],
      answerIndex: 1,
      explanation:
        "動画のチャプター（Desktop PWA setup / PWA benefits on mobile）では、Desktop・Android・iOS で PWA（ホーム画面へ追加）としてインストールし、ネイティブ通知を受け取って Artifacts 確認やコメント投稿を行う手順が実演されています。",
    },
    tags: ["Remote Control", "ウォークスルー", "PWA", "Antigravity 2.0", "モバイルレビュー"],
  },
  {
    id: "kyhw-v_iVf0",
    recommendedOrder: 38,
    title: "Gemini 4 Hydrogen available in Google Antigravity",
    jaTitle: "Gemini 4 Hydrogen が Google Antigravity で利用可能に",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2026-11-12",
    durationSeconds: 88,
    summary:
      "高速で信頼性の高い日常開発（daily driver）向けモデル「Gemini 4 Hydrogen」の Google Antigravity 対応紹介動画です。肥大化したコードのリファクタリングや、Astro サイトのライブラリ更新に伴う破壊的変更の自動修正、マルチモーダル理解を活かした全ページ画像の alt テキスト一括生成など、Gemini 4 Carbon による統括と併用できる実務タスクを実演します。",
    takeaways: [
      "Gemini 4 Hydrogen は高速かつ堅実なコーディングとエージェント実行を担う日常開発向けモデルとして位置づけられています。",
      "Astro サイトの例では、依存関係のバージョン乖離を監査・更新し、非推奨 API や破壊的変更を修正して数分でビルドを通します。",
      "マルチモーダル理解を活かし、サイト全体の画像を一括点検して適切な alt テキストを生成するアクセシビリティ改善にも活用できます。",
    ],
    quiz: {
      question:
        "動画内で Gemini 4 Hydrogen のマルチモーダル理解とスピードを活かした Web サイト改善例として挙げられているものはどれですか？",
      choices: [
        "すべてのページとブログの画像を点検し、正確な alt テキストを 1 パスで生成する",
        "サーバーの物理ラック配線をカメラで撮影して自動配線する",
        "動画ファイルをフレーム単位で 3D モデリングデータに変換する",
      ],
      answerIndex: 0,
      explanation:
        "動画では、サイト全体のパフォーマンスやアクセシビリティ向上の例として、全ページ・ブログ記事の画像を検査して正確な alt テキストを 1 パスで生成する活用法が紹介されています。",
    },
    tags: ["Gemini 4 Hydrogen", "コード保守", "依存関係更新", "アクセシビリティ", "Gemini 4 Carbon"],
  },
  {
    id: "3tacaSEZM9M",
    recommendedOrder: 39,
    title: "Bug Triage with Gemini 4 Hydrogen and Gemini 4 Carbon",
    jaTitle: "Gemini 4 Hydrogen と Carbon による OSS バグトリアージ自動化",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2026-11-12",
    durationSeconds: 110,
    summary:
      "Antigravity SDK と Gemini 4 Hydrogen・Carbon の 2 モデルを組み合わせ、OSS リポジトリの大量 Issue を自動トリアージ＆修正する事例紹介です。高頻度対応や UI 反復・PR コメント追従に強い Hydrogen と、大規模リファクタリングや未整理の新機能実装・セキュリティ確認を担う Carbon の役割分担を解説します。",
    takeaways: [
      "Antigravity SDK 上で「トリアージエージェント」と「コーディングエージェント」の 2 体構成を組み、Issue 判定からビルド・テスト・修正提出まで自動化します。",
      "トリアージ役と高速な UI 反復・PR コメント対応には、高トラフィックを素早く処理できる Gemini 4 Hydrogen を使用します。",
      "広範囲に影響する大規模リファクタリングや要件整理を含む新機能開発、安全性（サイバーセキュリティ）の確認を伴う PR には Gemini 4 Carbon を使い分けます。",
    ],
    quiz: {
      question:
        "動画の 2 エージェント構成において、Gemini 4 Carbon を特に使い分ける場面として説明されているものはどれですか？",
      choices: [
        "新規 Issue の一次受付を高速にさばく高トラフィックなトリアージ専用処理",
        "広範な変更を伴う大規模リファクタリング、詰め切れていない新機能追加、および安全性確認を伴う PR",
        "UI の配色を PR コメント経由で素早く微調整する軽量反復作業のみ",
      ],
      answerIndex: 1,
      explanation:
        "動画では、トリアージや高速な UI 反復には Hydrogen を使う一方、多くの箇所が変わる大規模リファクタリングや詰め切れていない新機能追加、サイバーセキュリティ面の安全性確保を伴う PR には Carbon を使用すると説明されています。",
    },
    tags: ["Gemini 4 Hydrogen", "Gemini 4 Carbon", "バグトリアージ", "Antigravity SDK", "モデル使い分け"],
  },
  {
    id: "1dAcJEIlQM8",
    recommendedOrder: 40,
    title: "Gemini 4 Argon: 3D World in Blender",
    jaTitle: "Gemini 4 Argon：Blender で日本の寺院・五重塔 3D 世界を自律構築",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2026-10-13",
    durationSeconds: 166,
    summary:
      "Google DeepMind のチームが、Antigravity 上の Gemini 4 Argon を用いてヘッドレス CLI 経由の Blender で日本の寺院・五重塔 3D モデルを単一プロンプトから自律構築した事例です。設計用 Skill を参照し、設計図作成から Nano Banana による 4 枚の参照画像生成、オーケストレーターと敵対的批評エージェントの反復ループ、さらにアニメーションや鐘の音・環境音の自動生成まで実演します。",
    takeaways: [
      "3D モデリング用の Skill（手順ドキュメント）を参照し、単一プロンプトからヘッドレス Blender CLI 上で複雑な 3D 建築を構築しています。",
      "建築設計図の作成後に Nano Banana で 4 枚の理想参照画像を生成し、Blender のレンダリング結果と照合する基準にしています。",
      "オーケストレーターと敵対的批評（adversarial critic）によるマルチエージェントループで品質を詰め、アニメーションや環境音も手続き生成しました。",
    ],
    quiz: {
      question:
        "この 3D 寺院構築ワークフローで、Nano Banana が生成した 4 枚の画像はどのような役割を果たしていますか？",
      choices: [
        "最終出力の壁紙用サムネイルとしてそのまま差し替え利用する",
        "Blender 内のテクスチャ圧縮率を計算するベンチマーク専用データとして使う",
        "マルチエージェントの敵対的ループで、Blender のレンダリング画像を比較・評価する理想の参照画像として使う",
      ],
      answerIndex: 2,
      explanation:
        "動画では、設計図をもとに Nano Banana で生成した 4 枚の画像が、オーケストレーターと敵対的批評エージェントによるループで Blender のレンダリング結果を比較検証するための参照基準として使われたと説明されています。",
    },
    tags: ["Gemini 4 Argon", "Blender", "Nano Banana", "マルチエージェント", "Skills"],
  },
  {
    id: "biOWEPYyS5c",
    recommendedOrder: 41,
    title: "Gemini 4 Argon: Modernizing 40 year code",
    jaTitle: "Gemini 4 Argon：40〜50 年前の科学計算コードをモダン Rust へ刷新",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2026-10-13",
    durationSeconds: 167,
    summary:
      "流体力学や海洋・環境モデルなど 40〜50 年前のレガシー科学計算コードベースを、Antigravity と Gemini 4 Argon でモダンな Rust へ自律移行した事例です。①現状再現とベンチマーク整備、②全行精査によるバグ・最適化余地の抽出、③新コードコンパイルとベースライン比較の 3 段階ワークフローで、実行速度 2 倍超の場面やメモリ削減、数値安定性と保守性の向上を実現しました。",
    takeaways: [
      "「現状コード再現・ベンチマーク作成 → 全行精査とバグ／最適化箇所特定 → Rust 移行とベースライン比較」の 3 段階で安全に移行しています。",
      "コード全体と物理シミュレーション領域の文脈を統合的に読み取り、数値安定性の改善やバグ候補の根拠提示を行います。",
      "単なる逐語翻訳にとどまらず、場所によって 2 倍以上の高速化・メモリ削減とともにコメントやドキュメントを備えた整理済み Rust コードを生成しました。",
    ],
    quiz: {
      question:
        "動画内で紹介された 40 年前の科学計算コードを Rust へ刷新する 3 段階プロセスのうち、第 1 段階で行った作業は何ですか？",
      choices: [
        "元のコードベースをそのまま再現・コンパイル・実行し、比較用のベンチマークを作成する",
        "元のコードを一切動かさず、ファイル名だけを見て最初から Rust で書き直す",
        "先にすべての既存コメントとドキュメントを削除して行数だけを減らす",
      ],
      answerIndex: 0,
      explanation:
        "動画の解説では、第 1 段階として元のコードベースをそのまま再現・実行・コンパイルしてベンチマークを作成し、その後に全行精査と Rust 移行・ベースライン比較へ進んだと述べられています。",
    },
    tags: ["Gemini 4 Argon", "Rust移行", "レガシー刷新", "科学計算", "ベンチマーク"],
  },
  {
    id: "WP4bC8sTIN8",
    recommendedOrder: 42,
    title: "Multi-Agent Localization with Gemini 4 Argon",
    jaTitle: "Gemini 4 Argon マルチエージェントによる 17 言語ローカライズ事例",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2026-10-13",
    durationSeconds: 172,
    summary:
      "Google Antigravity 公式サイトの 100 ページ超のコンテンツ・技術文書を、Gemini 4 Argon と `/teamwork` プレビューのマルチエージェント協調で 2 日間で 17 言語へローカライズした事例です。実装前にリードエージェントがヒアリングを行い、代表言語（メキシコ系スペイン語）で 3〜4 回の校正を経て基準を定めたうえで、並列の Worker / Auditor エージェントを展開する手法を解説します。",
    takeaways: [
      "変更を加える前にリードエージェントが質問インタビューを行い、ローカライズ方針の認識齟齬を防いでから着手しています。",
      "まず 1 言語（メキシコ系スペイン語）で 3〜4 回のフィードバック反復を行って機械的直訳を解消し、自然な技術用語の基準を固めました。",
      "基準確定後に並列の Worker・Auditor エージェントで 17 言語へ展開し、最後にネイティブ話者がスポット確認する Human-in-the-loop で品質と速度を両立しました。",
    ],
    quiz: {
      question:
        "100 ページ以上のドキュメントを 17 言語へ同時展開する前に、機械的な直訳を防ぐため最初にとった手順は何ですか？",
      choices: [
        "人間のレビューを完全に廃止し、1 回のワンショットプロンプトで 17 言語を同時確定させた",
        "メキシコ系スペイン語を先行対象として 3〜4 回のフィードバックで表現品質を校正した",
        "技術用語をすべて英語のまま残し、接続詞だけを機械翻訳した",
      ],
      answerIndex: 1,
      explanation:
        "動画では、全 17 言語へ並列展開する前に、話者が流暢なメキシコ系スペイン語で初期パスと 3〜4 回のフィードバック校正を行って自然な表現基準を整えたと説明されています。",
    },
    tags: ["Gemini 4 Argon", "ローカライズ", "マルチエージェント", "/teamwork", "Human-in-the-loop"],
  },
  {
    id: "T2Wfds62ZjM",
    recommendedOrder: 43,
    title: "Building Real-Time Animation with Gemini 4 Argon",
    jaTitle: "Gemini 4 Argon でコードのみでリアルタイムアニメーション・音響・専用ツールを構築",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2026-10-13",
    durationSeconds: 136,
    summary:
      "Google のクリエイティブテクノロジストが、動画・画像・音声といった外部メディア素材を一切使わず、Antigravity 上の Gemini 4 Argon による純粋なコード生成のみでリアルタイムアニメーションと生成音響を作った事例です。サブエージェント並列実行で ASCII や印象派・ステンドグラス風など多数のスタイルを探索しつつ、自らパラメータ調整できる専用 GUI ツールまで生成させる制作手法を紹介します。",
    takeaways: [
      "動画・画像・音声の外部ファイルを一切使わず、リアルタイム描画と生成オーディオをコードのみで実装しています。",
      "完成物だけでなく、アニメーションや音楽要素をリアルタイムに手動調整するための専用 GUI ツール自体をモデルに構築させました。",
      "Antigravity のサブエージェント並列実行を活用し、1 つ作る時間で 10〜20 以上のスタイルバリエーション（ASCII・印象派・ステンドグラス調等）を試作しました。",
    ],
    quiz: {
      question:
        "この制作事例で、外部のメディアファイルを使わずに作品表現を思い通りに仕上げるため、作者がモデルに作成させたものは何ですか？",
      choices: [
        "アニメーションや音楽の要素をリアルタイムに手動微調整できる専用 GUI ツール",
        "外部のストック動画サイトから素材を自動購入・ダウンロードするクローラー",
        "アニメーションを紙に印刷してスキャンし直すバッチスクリプト",
      ],
      answerIndex: 0,
      explanation:
        "動画の字幕では、各バリエーションを毎回プロンプトで変えるだけでなく、アニメーションや音楽の要素をリアルタイムに自分で微調整できる専用 GUI を生成させたと語られています。",
    },
    tags: ["Gemini 4 Argon", "ジェネラティブアート", "リアルタイム描画", "専用ツール構築", "サブエージェント並列"],
  },
  {
    id: "nPpvkQ3zxSA",
    recommendedOrder: 44,
    title: "Autonomous Web Optimization with Gemini 3.7 Flash",
    jaTitle: "Gemini 3.7 Flash と /goal による自律 Web 最適化（Lighthouse 100 点達成）",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2026-08-13",
    durationSeconds: 138,
    summary:
      "ツール呼び出し精度や Artifacts 表現力が向上した Gemini 3.7 Flash を使い、ランディングページの高速化とコード現代化を自律実行する動画です。前半で Chrome MCP サーバーとモダン Web ガイダンスプラグインを用いて課題診断の Artifact を生成し、後半では組み込みコマンド `/goal` で全 Lighthouse 指標 100 点を終了条件に設定して改善ループを自律完結させる流れを実演します。",
    takeaways: [
      "Chrome MCP サーバーと Web ガイダンスプラグインを組み合わせ、アクセシビリティや旧式 API、Lighthouse スコアの現状診断 Artifact を自動生成します。",
      "Antigravity 組み込みコマンド `/goal` で達成目標（全 Lighthouse 指標 100 点・HTML / CSS / JS 現代化）を指定すると、到達まで自律ループを実行します。",
      "エージェントはバックグラウンドのブラウザ監査とコード修正を反復し、完了時に達成スコアと変更内容をまとめた Artifact を出力します。",
    ],
    quiz: {
      question:
        "動画内で、すべての Lighthouse スコアを 100 点にする終了条件を設定し、モデルを自律ループさせるために使用した組み込みコマンドはどれですか？",
      choices: ["/compact", "/goal", "/grill-me"],
      answerIndex: 1,
      explanation:
        "動画の後半では、終了条件（exit criteria）を定めてモデルが目標に到達するまで自律的に修正と検証のループを回すために、組み込みコマンド `/goal` を使用しています。",
    },
    tags: ["Gemini 3.7 Flash", "/goal", "Lighthouse", "Chrome MCP", "Web最適化"],
  },
  {
    id: "oCFqZ0Ri6gg",
    recommendedOrder: 45,
    title: "Gemini 3 Flash vs 3 Pro Marathon Dashboard",
    jaTitle: "Gemini 3 Flash vs 3 Pro マラソンダッシュボード比較",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2025-12-17",
    durationSeconds: 55,
    summary:
      "Gemini 3 Flash のリリースに合わせて公開された、Gemini 3 Pro とのマラソンダッシュボード比較デモ（55 秒・字幕データなし）です。概要欄では、従来の AI IDE 体験を維持しつつエディタ・ターミナル・ブラウザを横断してタスクを自律計画・実行できる Google Antigravity 上で、Gemini 3 Flash がフロンティア級の知能と電光石火のスピードを備えていることが紹介されています。",
    takeaways: [
      "Gemini 3 Flash の提供開始に合わせて、Gemini 3 Pro との挙動をマラソンダッシュボード題材で対比する短尺デモ動画です。",
      "概要欄では Gemini 3 Flash の特徴として「フロンティア級の知能」と「電光石火のスピード（lightning speed）」が挙げられています。",
      "Antigravity のエージェントはエディタ・ターミナル・ブラウザを横断し、ワークスペース単位で複雑な開発タスクを自律的に計画・実行します。",
    ],
    quiz: {
      question:
        "この動画の概要欄で説明されている、Google Antigravity におけるエージェントの動作範囲として正しいものはどれですか？",
      choices: [
        "エディタ内のコード補完のみに限定され、ターミナルやブラウザには接続しない",
        "人間の手動操作の代わりにブラウザのブックマーク整理のみを行う",
        "エディタ・ターミナル・ブラウザを横断して動作し、複雑なタスクを自律的に計画・実行する",
      ],
      answerIndex: 2,
      explanation:
        "概要欄の公式説明では、Antigravity のエージェントがエディタ・ターミナル・ブラウザにまたがって動作し、複雑なエンドツーエンドのタスクを自律的に計画・実行できると明記されています。",
    },
    tags: ["Gemini 3 Flash", "Gemini 3 Pro", "モデル比較", "高速推論", "デモ"],
  },
  {
    id: "MPkgMSWQMSU",
    recommendedOrder: 46,
    title: "Gemini 3 Flash: Launching a Limited Edition Product Drop",
    jaTitle: "Gemini 3 Flash：限定商品の発売準備を単一プロンプトで完結",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2025-12-17",
    durationSeconds: 110,
    summary:
      "Gemini 3 Flash を使い、かぎ針編みショップの限定新商品（バナナ着ぐるみウサギ）発売準備を 1 回のプロンプトで完遂するデモです。Google スプレッドシート（ID: cotton_tail）からブラウザ経由で商品情報を取得し、1 週間後の発売に向けたウェイトリスト登録フォームの追加やヘッダーボタン（Join Waitlist）変更、さらにスクリーンショットとブラウザ操作による動作検証まで自律実行します。",
    takeaways: [
      "コードベースの把握後、エージェントがブラウザで Google スプレッドシートを開いて該当行（cotton_tail）の商品データを取得しています。",
      "商品追加に加え、ヘッダー画像の更新とボタン文言の「Explore farm drop」から「Join Waitlist」への変更、フォーム連携を一括実装します。",
      "実装後は Gemini 3 Flash のマルチモーダル推論（スクリーンショット確認とブラウザ操作）により、自らフォーム入力・送信確認まで検証します。",
    ],
    quiz: {
      question:
        "動画内で、エージェントが新商品の詳細情報を取得するために参照・閲覧した外部データソースは何ですか？",
      choices: [
        "Google スプレッドシート（ID: cotton_tail）の該当行",
        "GitHub Releases のバイナリ配布ページ",
        "PDF 形式の社内経理マニュアル",
      ],
      answerIndex: 0,
      explanation:
        "概要欄のプロンプトおよび字幕にある通り、商品写真は添付しつつ残りの商品情報は Google スプレッドシート（ID: cotton_tail）からエージェントがブラウザを開いて取得しました。",
    },
    tags: ["Gemini 3 Flash", "Google Sheets", "E2E検証", "マルチモーダル", "Web更新"],
  },
  {
    id: "Bbt5s_xADZ4",
    recommendedOrder: 47,
    title: "Gemini 3 Flash In Action: Limited Edition Product Drop",
    jaTitle: "Gemini 3 Flash 実践デモ：EC 限定ドロップの自動更新と検証（完全版）",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2025-12-17",
    durationSeconds: 136,
    summary:
      "Google Antigravity 上の Gemini 3 Flash により、EC ストアの限定商品ドロップを単一プロンプトで自動化する実践デモ（136 秒版）です。Gemini 3 Pro に迫る性能を高速に発揮し、Google スプレッドシートからの商品データ抽出、ヒーロー画像・CTA 更新、ウェイトリスト登録フォームのバックエンド連携、さらに完了後の実画面クリック確認まで通しで検証します。",
    takeaways: [
      "Gemini 3 Flash は Gemini 3 Pro に近い精度を保ちつつ高速に動作し、計画立案から実装・自己検証まで単一プロンプトで完了します。",
      "スクリーンショット認識とコンピュータ操作を組み合わせたマルチモーダル推論で、ヒーロー画像や新商品クリック時のポップアップ動作を検証します。",
      "実フォームへのテスト入力から登録確認、バックエンド反映、最終画面のウォークスルー提示までエージェントが自律的に確認しています。",
    ],
    quiz: {
      question:
        "実装完了後の検証フェーズにおいて、Gemini 3 Flash が動作の正しさを確認するために組み合わせている機能はどれですか？",
      choices: [
        "コードの構文チェックのみで、ブラウザ上の表示やクリック確認は行わない",
        "スクリーンショットとコンピュータ操作を組み合わせたマルチモーダル推論",
        "外部の人間テスターにチャットで目視確認を依頼するプロセス",
      ],
      answerIndex: 1,
      explanation:
        "字幕の解説では、Gemini 3 Flash がスクリーンショットとコンピュータ操作を組み合わせたマルチモーダル推論を用いて、ウェイトリストのポップアップやバックエンド動作を自己検証していると説明されています。",
    },
    tags: ["Gemini 3 Flash", "ECストア更新", "自律検証", "マルチモーダル推論", "ウォークスルー"],
  },
  {
    id: "FB6HO7CZHWw",
    recommendedOrder: 48,
    title: "Nano Banana Pro is now available on Google Antigravity",
    jaTitle: "Nano Banana Pro が Google Antigravity に登場（部分修正・インフォグラフィック）",
    format: "video",
    track: "remote-models",
    availability: "public",
    uploadDate: "2025-11-20",
    durationSeconds: 51,
    summary:
      "画像の特定箇所を高精度に部分修正できる「Nano Banana Pro」の Google Antigravity 対応紹介です。植物ショップのライトモード Web デザインを初期生成したあと、画像全体を作り直すのではなく「修正したい領域を選択してコメントを残す」ことで見出し文言やボタン色の変更だけを的確に反映するフローに加え、複雑コードベースのデータフロー図解への活用も紹介されています。",
    takeaways: [
      "生成画像をゼロから作り直さず、選択領域とレビューコメントによって特定部分（テキスト文言やボタン配色等）だけを精密に書き換えられます。",
      "デモでは植物サイトのライトモードデザイン生成後、見出しを「bring plants home」へ、ボタンをより濃い緑へ部分修正しています。",
      "Web デザインの微調整だけでなく、複雑なコードベースのデータフローを分かりやすいインフォグラフィックとして可視化する用途にも活用できます。",
    ],
    quiz: {
      question:
        "Nano Banana Pro を使って生成済みの Web デザイン画像を調整する際、動画で実演されている手順として正しいものはどれですか？",
      choices: [
        "テキスト文言や色を 1 か所変えるためにも、毎回プロンプトを書き直して別画像を新規生成する",
        "Antigravity 上で CSS コードのみを直接編集し、画像生成モデルは使わない",
        "画像内の特定領域を選択して変更内容のコメントを残し、該当箇所だけをピンポイントで更新させる",
      ],
      answerIndex: 2,
      explanation:
        "デモでは、生成した画像内の修正したい箇所を選択してコメント（見出し文言の変更やボタンを濃い緑にする指示）を残すことで、全体を作り直さずに特定部分のみを書き換える操作が実演されています。",
    },
    tags: ["Nano Banana Pro", "画像生成", "部分編集", "UIデザイン", "インフォグラフィック"],
  },
];
