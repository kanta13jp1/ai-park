// Antigravity Academy の教材データ
// 内容は導入ガイド・注意事項（公式ドキュメント／実機画面で確認済み、2026/09/26）と同じ事実に基づく。
// 動画は公式チャンネルの動画（YouTube oEmbed で投稿チャンネルを確認、2026/09/26）。社内で収録した動画も lesson.video に設定できる。

export type LessonBlock =
  | { type: "p"; text: string }
  | { type: "steps"; items: string[] }
  | { type: "tip"; text: string }
  | { type: "warn"; text: string }
  | { type: "image"; file: string; alt: string }
  | { type: "h"; id: string; text: string } // ページ内見出し（右側の目次に表示）
  | { type: "code"; label?: string; text: string } // コピーボタン付きのコマンド
  | { type: "link"; href: string; text: string }
  | { type: "prompt"; label?: string; text: string } // そのまま使えるプロンプト例（コピーボタン付き）
  | { type: "shot"; alt: string; todo: string }; // 撮影待ちの画面キャプチャ枠（todo に撮る画面を書く）

export interface VideoRef {
  id: string; // YouTube の動画ID
  title: string;
  channel: string; // 公式チャンネル名（oEmbed で確認済み）
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  section: string; // コース内のまとまり（目次の見出し）
  summary: string; // 1〜2文の概要（動画の下に表示）
  video?: VideoRef;
  // AI推進担当が作成した動画（public/videos/academy/<id>.mp4 / .vtt / .jpg）。scripts/academy-video で生成
  ownVideo?: string;
  blocks: LessonBlock[];
}

export interface QuizQuestion {
  q: string;
  choices: string[];
  answer: number; // choices の添字
  explanation: string;
}

export interface Course {
  id: string;
  title: string;
  level: "入門" | "初級" | "全員必修";
  summary: string;
  icon: string;
  color: string; // カード上部の背景（Tailwind クラス）
  outcomes: string[]; // このコースで学べること
  referenceVideo?: VideoRef;
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

export const PASS_RATE = 0.8;

export const courses: Course[] = [
  {
    id: "antigravity-101",
    title: "Antigravity 101：はじめての導入",
    level: "入門",
    summary: "Antigravity のしくみから、インストール・サインイン・安全設定・最初の依頼までを一通り体験します。",
    icon: "🚀",
    color: "bg-sky-100",
    outcomes: [
      "Antigravity 2.0・IDE・CLI の役割の違いを説明できる",
      "Windows に Antigravity をインストールし、会社アカウントでサインインできる",
      "Security Preset と Plan Review Policy を安全な設定にできる",
      "作業フォルダを登録して、最初の依頼を出せる",
    ],
    lessons: [
      {
        id: "what",
        title: "Antigravity とは",
        minutes: 5,
        section: "はじめに",
        summary: "Antigravity でできることと、業務で使うときの前提（会社の Google Cloud 経由）を押さえます。",
        ownVideo: "antigravity-101-what",
        video: { id: "6C0FjHoN3qE", title: "Google Antigravity 2.0 Beginner's Guide", channel: "Google Antigravity" },
        blocks: [
          {
            "type": "p",
            "text": "Antigravity は、AI エージェントに作業を任せるための Google のツールです。チャットで「こうしてほしい」と頼むと、エージェントが自分の PC のフォルダの中身を読み、ファイルを作ったり直したりしながら作業を進めます。"
          },
          {
            "type": "h",
            "id": "screen",
            "text": "画面の見方"
          },
          {
            "type": "p",
            "text": "起動すると、次のような画面が開きます。まずは4か所だけ覚えれば大丈夫です。"
          },
          {
            "type": "image",
            "file": "G5-main.png",
            "alt": "Antigravity のメイン画面"
          },
          {
            "type": "steps",
            "items": [
              "①「Projects」の右のアイコン：作業させたいフォルダを登録する場所",
              "②「New Conversation」：新しい依頼（会話）を始めるボタン",
              "③「Settings」：安全設定などを変える場所（レッスン4で使います）",
              "「Open IDE」：コードを見ながら作業したいときにエディタを開くボタン"
            ]
          },
          {
            "type": "h",
            "id": "chat",
            "text": "頼み方はチャットと同じ"
          },
          {
            "type": "p",
            "text": "画面の中央にある入力欄に、やってほしいことを日本語で書いて送るだけです。「@」でファイルを指定したり、「/」で便利な機能（計画だけ作らせる「/plan」など）を呼び出したりもできます。"
          },
          {
            "type": "image",
            "file": "L1-input.png",
            "alt": "依頼を書く入力欄"
          },
          {
            "type": "h",
            "id": "forms",
            "text": "4つの使い方"
          },
          {
            "type": "steps",
            "items": [
              "Antigravity 2.0（デスクトップアプリ）：中心となるアプリ。迷ったらこれ",
              "Antigravity IDE：コードを見ながら作業したい人向けのエディタ",
              "CLI（agy）：ターミナルから使いたい人向け",
              "VS Code などの拡張機能：いつものエディタの中で使いたい人向け"
            ]
          },
          {
            "type": "h",
            "id": "business",
            "text": "業務で使うときの前提"
          },
          {
            "type": "p",
            "text": "業務では、会社の Google アカウントのまま、会社の Google Cloud プロジェクト経由で使います。料金は使った分だけ会社の請求にまとまるので、個人で Google AI Pro に加入する必要はありません。"
          },
          {
            "type": "warn",
            "text": "個人の Google アカウントで使う場合は個人向けの利用規約が適用されます。顧客情報・社内機密・未公開のソースコードは入力しないでください。"
          },
          {
            "type": "h",
            "id": "recap",
            "text": "まとめ"
          },
          {
            "type": "p",
            "text": "Antigravity は、チャットで頼むとエージェントがフォルダの中で作業してくれるツールです。画面は「Projects」「New Conversation」「入力欄」「Settings」の4か所を押さえれば使い始められます。業務では会社の Google Cloud 経由で使います。"
          }
        ],
      },
      {
        id: "install",
        title: "インストールする",
        minutes: 10,
        section: "セットアップ",
        summary: "Antigravity は、デスクトップアプリ・エディタ（IDE）・ターミナル（CLI）・既存エディタの拡張機能の4つの形で使えます。まずはデスクトップアプリを入れましょう。",
        ownVideo: "antigravity-101-install",
        blocks: [
          { type: "h", id: "app", text: "Antigravity 2.0（デスクトップアプリ）" },
          { type: "p", text: "エージェントに仕事を依頼・管理する中心のアプリです。迷ったらこれを入れてください。必要な環境は Windows 10（64bit）以降です。" },
          { type: "steps", items: [
            "公式のダウンロードページを開く",
            "①「Windows」を選び、②「Antigravity 2.0」の「Download for x64」をクリック（Snapdragon など ARM 版の PC の場合だけ「Download for ARM64」）",
            "ダウンロードした Antigravity-x64.exe を開く",
            "「Antigravity セットアップ」の画面で「インストールしています。しばらくお待ちください…」と表示されるので、終わるまで待つ",
          ] },
          { type: "link", href: "https://antigravity.google/download", text: "公式ダウンロードページを開く" },
          { type: "image", file: "G1-download-app.png", alt: "ダウンロードページで Windows を選び Download for x64 を押すところ" },
          { type: "image", file: "G2-install.png", alt: "ダウンロード完了とインストール中の画面" },
          { type: "tip", text: "「Windows によって PC が保護されました」と出たら、公式サイト（antigravity.google）から入手したファイルであることを確認したうえで「詳細情報」→「実行」を選びます。以前のバージョンがあり「Keep Both / Replace」を聞かれたら「Replace」を選びます。" },

          { type: "h", id: "ide", text: "Antigravity IDE（エディタ版）" },
          { type: "p", text: "コードを見ながら作業したい人向けの、エディタとエージェントの画面が一体になったアプリです。デスクトップアプリ右上の「Install IDE」（インストール済みなら「Open IDE」）から入れられます。ダウンロードページの下のほうにある「Antigravity IDE (Standalone)」の「Download for x64」からも入手できます。" },
          { type: "image", file: "G7-download-ide.png", alt: "ダウンロードページの Antigravity IDE (Standalone)" },
          { type: "tip", text: "デスクトップアプリから「Open IDE」を押すと「An external application wants to open ...」という確認が出ます。自分で押した場合だけ「Yes」を選びます。" },

          { type: "h", id: "cli", text: "CLI（ターミナルから使う）" },
          { type: "p", text: "PowerShell やコマンドプロンプトからエージェントを使いたい人向けです。公式のインストールコマンドを実行すると、agy コマンドが使えるようになります。" },
          { type: "code", label: "Windows PowerShell", text: "irm https://antigravity.google/cli/install.ps1 | iex" },
          { type: "code", label: "Windows コマンドプロンプト（CMD）", text: "curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd" },
          { type: "code", label: "macOS / Linux", text: "curl -fsSL https://antigravity.google/cli/install.sh | bash" },
          { type: "image", file: "G3-download-cli.png", alt: "ダウンロードページの CLI インストールコマンド" },
          { type: "p", text: "インストールが終わるとブラウザが開き、サインインを求められます。作業したいフォルダに移動して agy を実行すると、初回は画面の色・表示方法・フォルダを信頼するかの確認が出ます。" },
          { type: "code", label: "作業フォルダで実行", text: "agy" },

          { type: "h", id: "extensions", text: "VS Code などの拡張機能" },
          { type: "p", text: "いつも使っているエディタの中で Antigravity のエージェントを使うこともできます。VS Code・Visual Studio・JetBrains（IntelliJ IDEA など）・Zed・Xcode 向けの公式拡張機能があります。" },
          { type: "steps", items: [
            "VS Code の場合：1.90 以降で、Ctrl+Shift+X で拡張機能を開く",
            "「Google Antigravity」（発行元：Google）を検索して「Install」をクリック",
            "左のアクティビティバーの Antigravity アイコンをクリックし、Google アカウントでサインインする",
          ] },
          { type: "image", file: "G4-ide-extensions.png", alt: "ダウンロードページの Antigravity for IDEs" },
          { type: "link", href: "https://antigravity.google/docs/ide/extensions", text: "各エディタの拡張機能の公式ドキュメント" },

          { type: "h", id: "which", text: "どれを使えばいい？" },
          { type: "steps", items: [
            "はじめての人・コードをあまり書かない人：Antigravity 2.0（デスクトップアプリ）",
            "コードを見ながら直したい人：Antigravity IDE、またはいつものエディタの拡張機能",
            "ターミナルに慣れている人・作業を自動化したい人：CLI（agy）",
          ] },
          { type: "p", text: "どれを使っても同じ Google アカウントでサインインし、業務では会社の Google Cloud プロジェクト経由で使います。次のレッスンでサインインと初期設定を行います。" },
          {"type": "h", "id": "recap", "text": "まとめ"},
          {"type": "p", "text": "迷ったらデスクトップアプリを入れます。コードを見たい人は IDE か拡張機能、ターミナル派は CLI（agy）。どれを使っても、業務では会社の Google Cloud 経由でサインインします。"},
        ],
      },
      {
        id: "signin",
        title: "サインインと初期設定",
        minutes: 5,
        section: "セットアップ",
        summary: "会社アカウントでサインインし、初期設定を済ませます。",
        ownVideo: "antigravity-101-signin",
        blocks: [
          {
            "type": "p",
            "text": "インストールが終わったら、Antigravity を起動してサインインします。業務で使うときと、個人で学習するときでサインイン方法が違うので注意してください。"
          },
          {
            "type": "h",
            "id": "launch",
            "text": "起動する"
          },
          {
            "type": "steps",
            "items": [
              "スタートメニューを開き「Antigravity」を探してクリックする",
              "「Loading Antigravity」と表示されている間は、そのまま待つ"
            ]
          },
          {
            "type": "image",
            "file": "S0-loading.png",
            "alt": "起動中の画面（Loading Antigravity）"
          },
          {
            "type": "p",
            "text": "しばらくすると「Welcome to Antigravity」の画面が表示され、サインイン方法を2つから選びます。"
          },
          {
            "type": "image",
            "file": "S1-signin.png",
            "alt": "サインイン方法を選ぶ画面"
          },
          {
            "type": "h",
            "id": "business",
            "text": "業務で使う場合（会社アカウント）"
          },
          {
            "type": "steps",
            "items": [
              "「Use business account」を選ぶ",
              "ブラウザが開くので、会社の Google アカウントでログインする",
              "会社の Google Cloud プロジェクトを選ぶ（プロジェクト ID は AI推進担当から案内されます）",
              "ブラウザに表示される「Open Antigravity」をクリックしてアプリに戻る"
            ]
          },
          {
            "type": "tip",
            "text": "「権限がない」などと表示された場合は、管理者側の設定（導入ガイドの A1〜A3）が終わっていない可能性があります。表示されたメッセージをそのまま AI推進担当に送ってください。"
          },
          {
            "type": "link",
            "href": "https://kanta13jp1.github.io/ai-park/guide",
            "text": "会社の Google Cloud で使うための手順（導入ガイド）"
          },
          {
            "type": "h",
            "id": "personal",
            "text": "個人で学習する場合"
          },
          {
            "type": "p",
            "text": "「Continue with Google」を選び、個人の Google アカウントでログインします。業務の情報は入力しないでください。"
          },
          {
            "type": "h",
            "id": "setup",
            "text": "初期設定"
          },
          {
            "type": "steps",
            "items": [
              "テーマ（画面の色）を選ぶ",
              "Google プラグインの選択は、分からなければ何も選ばずに進む",
              "利用規約を確認して「Accept」",
              "「Finish」をクリックすると、メイン画面が開く"
            ]
          },
          {
            "type": "shot",
            "alt": "テーマ選択〜Finish の画面",
            "todo": "初回起動時に表示されるテーマ選択・プラグイン選択・利用規約・Finish の各画面"
          },
          {
            "type": "h",
            "id": "recap",
            "text": "まとめ"
          },
          {
            "type": "p",
            "text": "業務では「Use business account」で会社アカウントにサインインし、会社のプロジェクトを選びます。初期設定はテーマ選択 → プラグイン（飛ばしてOK）→ Accept → Finish の順です。"
          }
        ],
      },
      {
        id: "safety",
        title: "最初に必ず：安全設定",
        minutes: 5,
        section: "セットアップ",
        summary: "エージェントに任せる範囲を決める2つの設定を、安全な状態にします。",
        ownVideo: "antigravity-101-safety",
        blocks: [
          {
            "type": "p",
            "text": "使い始める前に、エージェントにどこまで任せるかを決めておきましょう。最初は「何かする前に必ず確認してくれる」設定にしておくと安心です。"
          },
          {
            "type": "h",
            "id": "open",
            "text": "設定画面を開く"
          },
          {
            "type": "steps",
            "items": [
              "左下の「Settings」をクリック",
              "左のメニューから「General」を選ぶ"
            ]
          },
          {
            "type": "image",
            "file": "G6-settings.png",
            "alt": "Settings の General 画面"
          },
          {
            "type": "h",
            "id": "security-preset",
            "text": "Security Preset（任せる範囲）"
          },
          {
            "type": "p",
            "text": "「Security Preset」は、エージェントが確認なしでできることの範囲です。右側の ▼ をクリックすると4つの選択肢が出ます。"
          },
          {
            "type": "image",
            "file": "L2-security-preset.png",
            "alt": "Security Preset の設定欄"
          },
          {
            "type": "steps",
            "items": [
              "Default（おすすめ）：ターミナルのコマンド実行と、作業フォルダの外のファイル操作の前に必ず確認が入る",
              "Full machine：コマンドは確認が入るが、PC 内のどのファイルでも読み書きできる",
              "Turbo mode：安全のための確認がすべて無くなる",
              "Custom：項目ごとに自分で細かく決める"
            ]
          },
          {
            "type": "image",
            "file": "G6-settings-options.png",
            "alt": "おすすめの設定（Default と Always Ask）"
          },
          {
            "type": "h",
            "id": "plan-review",
            "text": "Plan Review Policy（計画の確認）"
          },
          {
            "type": "p",
            "text": "「Plan Review Policy」は、作業を始める前に計画を見せてくれるかどうかの設定です。「Always Ask」を選ぶと、エージェントはまず計画を見せて、あなたの確認を待ってくれます。"
          },
          {
            "type": "image",
            "file": "L3-plan-review.png",
            "alt": "Plan Review Policy の設定欄"
          },
          {
            "type": "warn",
            "text": "「Full machine」「Turbo mode」と「Always Proceed」は、慣れるまで・業務では使わないでください。意図しないファイルの変更やコマンドの実行を止められなくなります。"
          },
          {
            "type": "h",
            "id": "recap",
            "text": "まとめ"
          },
          {
            "type": "p",
            "text": "Settings → General で、Security Preset を「Default」、Plan Review Policy を「Always Ask」にします。これで、エージェントは作業前に計画を見せ、コマンド実行や作業フォルダ外の操作の前に必ず確認してくれます。"
          }
        ],
      },
      {
        id: "first-task",
        title: "はじめての依頼",
        minutes: 5,
        section: "使ってみる",
        summary: "作業フォルダを登録して、はじめての依頼を出してみます。",
        ownVideo: "antigravity-101-first-task",
        blocks: [
          {
            "type": "p",
            "text": "いよいよ最初の依頼です。まずは、ファイルを変更しない「質問」から試してみましょう。"
          },
          {
            "type": "h",
            "id": "project",
            "text": "作業フォルダを登録する"
          },
          {
            "type": "steps",
            "items": [
              "左側の「Projects」の右にあるフォルダ＋のアイコンをクリック",
              "開いた画面で、作業させたいフォルダを選ぶ",
              "「Projects」の一覧にフォルダ名が表示されれば登録完了"
            ]
          },
          {
            "type": "image",
            "file": "G5-main.png",
            "alt": "Projects の登録ボタンと New Conversation"
          },
          {
            "type": "h",
            "id": "ask",
            "text": "依頼を送る"
          },
          {
            "type": "steps",
            "items": [
              "左上の「New Conversation」をクリック",
              "入力欄の上に、登録したフォルダ名が表示されていることを確認する",
              "入力欄に依頼を書いて Enter キーで送る"
            ]
          },
          {
            "type": "image",
            "file": "L1-input.png",
            "alt": "依頼を書く入力欄"
          },
          {
            "type": "h",
            "id": "example",
            "text": "例：フォルダの中身を説明してもらう"
          },
          {
            "type": "p",
            "text": "最初は、次のようにファイルを変更しないことをはっきり書いて頼むと安心です。"
          },
          {
            "type": "prompt",
            "text": "このフォルダの中にあるファイルの構成と、それぞれの役割を初心者にも分かるように説明してください。ファイルは変更しないでください。",
            "label": "はじめての依頼"
          },
          {
            "type": "shot",
            "alt": "エージェントの回答画面",
            "todo": "上のプロンプトを送ったあと、エージェントがフォルダの中身を説明している画面"
          },
          {
            "type": "tip",
            "text": "回答の途中で分からない言葉が出てきたら、そのまま「〇〇とは何ですか？」と続けて質問して大丈夫です。"
          },
          {
            "type": "h",
            "id": "recap",
            "text": "まとめ"
          },
          {
            "type": "p",
            "text": "「Projects」にフォルダを登録し、「New Conversation」から入力欄に依頼を書いて送ります。最初は「ファイルは変更しないでください」と添えた質問から始めると安全です。"
          }
        ],
      },
    ],
    quiz: [
      { q: "業務で Antigravity を使うときの正しい方法はどれですか？", choices: ["個人の Google AI Pro に加入して使う", "会社アカウントで会社の Google Cloud プロジェクト経由で使う", "同僚のアカウントを借りて使う"], answer: 1, explanation: "業務では会社の Google Cloud プロジェクト経由で使います。料金は会社の請求に従量課金でまとまります。" },
      { q: "インストールに必要な Windows の環境はどれですか？", choices: ["Windows 10（64bit）以降", "Windows 7 以降", "どの Windows でもよい"], answer: 0, explanation: "公式の必要環境は Windows 10（64bit）以降です。" },
      { q: "慣れるまでの Security Preset として推奨されているのはどれですか？", choices: ["Turbo mode", "Full machine", "Default"], answer: 2, explanation: "Default はコマンド実行や作業フォルダ外のファイル操作の前に確認が入ります。" },
      { q: "Plan Review Policy を「Always Ask」にすると何が起きますか？", choices: ["作業前に計画を見せて確認を求める", "確認なしですぐ作業を進める", "チャットが使えなくなる"], answer: 0, explanation: "Always Ask は作業を始める前に計画（ドキュメント）の確認を求めます。" },
      { q: "個人アカウントの Antigravity に入力してはいけないものはどれですか？", choices: ["公開されている技術記事の内容", "顧客情報や未公開のソースコード", "一般的なプログラミングの質問"], answer: 1, explanation: "個人アカウントには個人向け規約が適用されるため、顧客情報・社内機密・未公開コードは入力しません。" },
    ],
  },
  {
    id: "antigravity-practice",
    title: "Antigravity 実践：AI エージェントに仕事を任せる",
    level: "初級",
    summary: "伝わる頼み方、計画の確認、変更のチェックと取り消し、エラー対応まで、仕事で使うための基本動作を身につけます。",
    icon: "🛠️",
    color: "bg-amber-100",
    outcomes: [
      "目的・対象・条件・完了の形をそろえて依頼できる",
      "作業前に計画を作らせて、方針を確認してから任せられる",
      "Git で AI の変更を確認し、必要なら取り消せる",
      "エラーが出たときに、必要な情報をそろえて相談できる",
    ],
    referenceVideo: { id: "Dk4MD6TNiWE", title: "Inside Google Antigravity 2.0: The complete developer guide", channel: "Google Cloud Tech" },
    lessons: [
      {
        id: "ask",
        title: "伝わる頼み方（4点セット）",
        minutes: 5,
        section: "依頼のしかた",
        summary: "やり直しを減らす「4点セット」の頼み方を身につけます。",
        ownVideo: "antigravity-practice-ask",
        video: { id: "bSp-foRDH5M", title: "How to build apps and automate tasks with Google Antigravity 2.0", channel: "Google" },
        blocks: [
          {
            "type": "p",
            "text": "エージェントは、言われたことを言われたとおりに進めます。やり直しを減らすコツは、頼む前に「目的・対象・条件・完了の形」の4点をそろえることです。"
          },
          {
            "type": "h",
            "id": "four",
            "text": "4点セット"
          },
          {
            "type": "steps",
            "items": [
              "目的：何のためにやるか",
              "対象：どのファイル・どの画面か（ファイル名を具体的に）",
              "条件：変えてはいけないこと・使う言語やルール",
              "完了の形：どうなれば終わりか（テストが通る・画面に表示される など）"
            ]
          },
          {
            "type": "h",
            "id": "bad",
            "text": "よくない例"
          },
          {
            "type": "prompt",
            "text": "問い合わせフォームを直して",
            "label": "あいまいな依頼"
          },
          {
            "type": "p",
            "text": "これだと、どのファイルの何を、どう直せば終わりなのかが分かりません。エージェントは推測で作業を始めてしまい、意図と違う変更が入りがちです。"
          },
          {
            "type": "h",
            "id": "good",
            "text": "よい例"
          },
          {
            "type": "prompt",
            "text": "src/app/contact/page.tsx の送信ボタンを、必須項目が空のときは押せないようにしてください。見た目は変えないでください。直したら、どのように確認すればよいかも教えてください。",
            "label": "4点セットの依頼"
          },
          {
            "type": "p",
            "text": "「対象（ファイル名）」「目的（空のときは押せない）」「条件（見た目は変えない）」「完了の形（確認方法）」がそろっています。"
          },
          {
            "type": "tip",
            "text": "4点を全部思いつかないときは、「この作業を頼みたいです。依頼の前に確認すべきことを質問してください」と頼むと、エージェントが足りない点を聞いてくれます。"
          },
          {
            "type": "h",
            "id": "recap",
            "text": "まとめ"
          },
          {
            "type": "p",
            "text": "依頼は「目的・対象・条件・完了の形」の4点をそろえます。あいまいなまま頼むより、ファイル名や変えてはいけないことを具体的に書いたほうが、やり直しが減ります。"
          }
        ],
      },
      {
        id: "plan",
        title: "計画を確認してから任せる",
        minutes: 5,
        section: "依頼のしかた",
        summary: "作業前に計画を作らせ、方針を確認してから任せる流れを学びます。",
        ownVideo: "antigravity-practice-plan",
        blocks: [
          {
            "type": "p",
            "text": "大きな変更や、どこを直すべきか分からない作業では、いきなり作業させずに、まず計画を作らせるのが安全です。"
          },
          {
            "type": "h",
            "id": "setting",
            "text": "計画を必ず見せてもらう設定"
          },
          {
            "type": "p",
            "text": "Settings → General の「Plan Review Policy」を「Always Ask」にしておくと、エージェントは作業前に計画を見せて、あなたの確認を待ちます（レッスン「最初に必ず：安全設定」で設定済みのはずです）。"
          },
          {
            "type": "image",
            "file": "L3-plan-review.png",
            "alt": "Plan Review Policy と「/」→「plan」の案内"
          },
          {
            "type": "h",
            "id": "plan",
            "text": "計画だけ作らせる"
          },
          {
            "type": "steps",
            "items": [
              "入力欄に「/plan」と入力する（「/」を入力すると候補に「plan」が表示されるので、それを選んでもOK）",
              "続けて、やりたいことを書いて送る",
              "エージェントが、作業の前に計画（どのファイルをどう変えるか）を作って見せてくれる"
            ]
          },
          {
            "type": "tip",
            "text": "以前の「計画モード」は、今は「/plan」で呼び出す形になっています（アプリ内の案内「Planning mode has moved to /plan」より）。"
          },
          {
            "type": "p",
            "text": "たとえば、次のように「まだ変更しない」ことをはっきり書きます。"
          },
          {
            "type": "prompt",
            "text": "ヘッダーにダークモードの切り替えボタンを付けたいです。まず、どのファイルをどう変更するかの計画だけを作ってください。まだファイルは変更しないでください。",
            "label": "計画を作らせる依頼"
          },
          {
            "type": "shot",
            "alt": "エージェントが計画を示している画面",
            "todo": "上のプロンプトを送ったあと、変更予定のファイルと手順が並んだ計画（implementation plan）が表示された画面"
          },
          {
            "type": "h",
            "id": "check",
            "text": "計画のチェックポイント"
          },
          {
            "type": "steps",
            "items": [
              "変更するファイルは、思っている範囲に収まっているか",
              "「やらないこと」（触ってほしくないファイルや機能）が守られているか",
              "手順の中に分からないものがあれば、進める前に理由を質問する"
            ]
          },
          {
            "type": "p",
            "text": "問題なければ計画どおりに進めてもらい、違っていればその場で「〇〇は変更しないで」などと修正を伝えます。"
          },
          {
            "type": "h",
            "id": "recap",
            "text": "まとめ"
          },
          {
            "type": "p",
            "text": "「Always Ask」で計画を必ず見せてもらい、大きな作業は「/plan」でまず計画だけ作らせます。変更するファイルとやらないことを確認してから進めてもらいましょう。"
          }
        ],
      },
      {
        id: "git",
        title: "変更の確認と取り消し（Git）",
        minutes: 8,
        section: "安全に進める",
        summary: "AI の変更を Git で確認し、意図と違えば取り消す方法を学びます。",
        ownVideo: "antigravity-practice-git",
        blocks: [
          {
            "type": "p",
            "text": "エージェントは一度に複数のファイルを書き換えます。Git を使えば、何が変わったかを確認でき、意図と違えば元に戻せます。コマンドは右のボタンでコピーできます。"
          },
          {
            "type": "h",
            "id": "branch",
            "text": "作業前にブランチを作る"
          },
          {
            "type": "p",
            "text": "main（本番用）で直接作業せず、作業用のブランチを作ってから依頼します。"
          },
          {
            "type": "code",
            "text": "git switch -c feature/dark-mode",
            "label": "作業用ブランチを作る（feature/dark-mode の部分は作業内容に合わせて変える）"
          },
          {
            "type": "h",
            "id": "check",
            "text": "変わったところを確認する"
          },
          {
            "type": "code",
            "text": "git status",
            "label": "変更されたファイルの一覧"
          },
          {
            "type": "code",
            "text": "git diff",
            "label": "変更の中身（追加は + 、削除は - で表示）"
          },
          {
            "type": "p",
            "text": "エージェントに要点をまとめてもらうのも便利です。"
          },
          {
            "type": "prompt",
            "text": "今回変更したファイルと、それぞれの変更内容の要点を一覧にしてください。",
            "label": "変更内容の確認"
          },
          {
            "type": "h",
            "id": "commit",
            "text": "問題なければ記録する"
          },
          {
            "type": "code",
            "text": "git add .\ngit commit -m \"ヘッダーにダークモード切り替えを追加\"",
            "label": "変更を記録（コミット）する"
          },
          {
            "type": "h",
            "id": "restore",
            "text": "意図と違えば取り消す"
          },
          {
            "type": "code",
            "text": "git restore <ファイル名>",
            "label": "コミット前の変更を元に戻す"
          },
          {
            "type": "tip",
            "text": "IDE（Antigravity IDE や VS Code）を使っている場合は、左側の「ソース管理」からも同じ操作をボタンで行えます。"
          },
          {
            "type": "shot",
            "alt": "IDE のソース管理画面",
            "todo": "Antigravity IDE の「ソース管理」で、変更されたファイルと差分が表示されている画面"
          },
          {
            "type": "h",
            "id": "recap",
            "text": "まとめ"
          },
          {
            "type": "p",
            "text": "作業前にブランチを作り、git status と git diff で変更を確認してからコミットします。意図と違う変更は git restore で取り消せます。"
          }
        ],
      },
      {
        id: "error",
        title: "エラーが出たときの対処",
        minutes: 5,
        section: "安全に進める",
        summary: "エラーが出たときに、早く解決するための伝え方を学びます。",
        ownVideo: "antigravity-practice-error",
        blocks: [
          {
            "type": "p",
            "text": "エラーが出ても慌てなくて大丈夫です。エージェントに必要な情報をそろえて伝えれば、原因と直し方を一緒に探してくれます。"
          },
          {
            "type": "h",
            "id": "tell",
            "text": "伝える3つのこと"
          },
          {
            "type": "steps",
            "items": [
              "エラーメッセージの全文（省略しない）",
              "直前に何をしたか（実行したコマンド・変更したファイル）",
              "本当はどうなってほしかったか"
            ]
          },
          {
            "type": "h",
            "id": "template",
            "text": "そのまま使える依頼の型"
          },
          {
            "type": "prompt",
            "text": "次のエラーが出ました。原因と直し方を、初心者にも分かるように説明してください。直す前に、どのファイルをどう変更するかを先に教えてください。\n\n【直前にしたこと】\n（例：npm run build を実行した）\n\n【本当はどうなってほしいか】\n（例：ビルドが成功してほしい）\n\n【エラー全文】\n（ここにエラーをそのまま貼り付ける）",
            "label": "エラー相談の型"
          },
          {
            "type": "h",
            "id": "loop",
            "text": "直らないときは"
          },
          {
            "type": "steps",
            "items": [
              "同じ修正を3回繰り返しても直らないときは、いったん git restore で元に戻す",
              "頼み方を変える（エラーの前後の状況を詳しく書く・「まず原因の候補を3つ挙げて」と頼む）",
              "それでも解決しないときは、エラー文を添えて Office Hour／お問い合わせへ"
            ]
          },
          {
            "type": "h",
            "id": "recap",
            "text": "まとめ"
          },
          {
            "type": "p",
            "text": "エラー全文・直前にしたこと・期待する結果の3つをそろえて伝えます。同じ修正を繰り返すようなら一度元に戻して、頼み方を変えましょう。"
          }
        ],
      },
    ],
    quiz: [
      { q: "伝わる頼み方の「4点セット」に含まれないものはどれですか？", choices: ["完了の形", "対象", "AI の気分"], answer: 2, explanation: "4点セットは目的・対象・条件・完了の形です。" },
      { q: "エージェントにまず計画だけを作らせたいときの操作はどれですか？", choices: ["入力欄で「/」を入力して「plan」を選ぶ", "アプリを再起動する", "Turbo mode にする"], answer: 0, explanation: "「/」から plan を選ぶと、エージェントが計画を作成します。" },
      { q: "エージェントに作業させる前にしておくべき Git の操作はどれですか？", choices: ["main ブランチで直接作業する", "作業用ブランチを作る", "リポジトリを削除する"], answer: 1, explanation: "作業用ブランチを作っておけば、変更を安全に確認・取り消しできます。" },
      { q: "コミット前の意図しない変更を取り消すコマンドはどれですか？", choices: ["git restore <file>", "git push", "git clone"], answer: 0, explanation: "git restore で作業中の変更を元に戻せます。" },
      { q: "エラーが出たとき、AI に伝える内容として最も良いのはどれですか？", choices: ["「動かない」とだけ伝える", "エラー全文と直前にした操作を伝える", "何も伝えず同じ依頼を繰り返す"], answer: 1, explanation: "エラー全文と直前の操作があると、原因の特定が早くなります。" },
    ],
  },
  {
    id: "safe-ai-use",
    title: "安全に使う：社内 AI 利用ルール",
    level: "全員必修",
    summary: "扱うデータのレベル分けと、社内 AI 利用の注意事項5箇条（暫定版）を学びます。AI を使うすべての社員向けです。",
    icon: "🛡️",
    color: "bg-emerald-100",
    outcomes: [
      "扱うデータのレベル（Level 1〜3）に応じて入力先を選べる",
      "社内AI利用の注意事項5箇条を説明できる",
      "判断に迷ったときの相談先が分かる",
    ],
    lessons: [
      {
        id: "levels",
        title: "データのレベル分け",
        minutes: 5,
        section: "ルール",
        summary: "入力してよいデータを、AI の種類ごとに3つのレベルで判断します。",
        ownVideo: "safe-ai-use-levels",
        blocks: [
          {
            "type": "p",
            "text": "AI に入力してよいデータは、使う AI の種類によって違います。入力する前に「この AI はどのレベルか」を確認しましょう。"
          },
          {
            "type": "h",
            "id": "levels",
            "text": "3つのレベル"
          },
          {
            "type": "steps",
            "items": [
              "Level 1（社内機密・コード入力可）：会社として契約し、入力データを学習に使わないことが担保された AI（会社の Google Cloud 経由の Antigravity、Gemini Enterprise など）",
              "Level 2（マスキング必須）：氏名・電話番号・顧客名などを置き換えてから入力する",
              "Level 3（公開情報のみ）：個人アカウントの AI ツール。公開情報での学習・試用にとどめる"
            ]
          },
          {
            "type": "link",
            "href": "https://kanta13jp1.github.io/ai-park/tools-hub",
            "text": "AI Tools Hub のセキュリティ基準早見表"
          },
          {
            "type": "h",
            "id": "masking",
            "text": "マスキングの例"
          },
          {
            "type": "p",
            "text": "Level 2 の AI に相談するときは、個人や会社を特定できる情報を置き換えます。"
          },
          {
            "type": "prompt",
            "text": "取引先A社の担当者（Bさん）から、納期を2週間延ばしてほしいというメールが届きました。丁寧にお断りしつつ、代わりに1週間なら調整できると伝える返信文を作ってください。",
            "label": "マスキングした相談"
          },
          {
            "type": "tip",
            "text": "実際の会社名・氏名・メールアドレス・電話番号・金額は、「A社」「Bさん」「〇〇円」のように置き換えてから入力します。"
          },
          {
            "type": "h",
            "id": "recap",
            "text": "まとめ"
          },
          {
            "type": "p",
            "text": "入力前に、使う AI のレベルを確認します。機密や個人情報は Level 1 の AI にだけ入力し、Level 2 ではマスキング、Level 3 では公開情報だけを扱います。"
          }
        ],
      },
      {
        id: "rules",
        title: "注意事項5箇条（暫定版）",
        minutes: 5,
        section: "ルール",
        summary: "社内AI利用の注意事項5箇条（暫定版）を確認します。",
        ownVideo: "safe-ai-use-rules",
        blocks: [
          {
            "type": "p",
            "text": "社内で AI を使うときの注意事項5箇条（暫定版）です。迷ったときは、この5つに立ち返ってください。"
          },
          {
            "type": "h",
            "id": "rule1",
            "text": "1. 機密・個人情報は入力先を選ぶ"
          },
          {
            "type": "p",
            "text": "顧客の個人情報・社内機密・未公開ソースコードは、会社契約で学習不使用が担保された AI（Level 1）にのみ入力します。"
          },
          {
            "type": "h",
            "id": "rule2",
            "text": "2. 入力前にマスキングする"
          },
          {
            "type": "p",
            "text": "Level 2 のツールでは、氏名・電話番号・メールアドレス・顧客名・案件名などを置き換えてから入力します。"
          },
          {
            "type": "h",
            "id": "rule3",
            "text": "3. 出力は必ず人が確認する"
          },
          {
            "type": "p",
            "text": "AI の回答やコードには誤りが含まれます。事実・数値・法令・セキュリティに関わる内容は一次情報で確認し、コードはレビューとテストを通してから使います。"
          },
          {
            "type": "h",
            "id": "rule4",
            "text": "4. 成果物の責任は使った人が持つ"
          },
          {
            "type": "p",
            "text": "AI で作った資料・コードでも、社外に出す・本番に反映する責任は利用者にあります。"
          },
          {
            "type": "h",
            "id": "rule5",
            "text": "5. 迷ったら使う前に相談する"
          },
          {
            "type": "p",
            "text": "新しいツールの業務利用や、扱ってよいデータか判断できない場合は、利用前に AI推進担当へ相談してください。"
          },
          {
            "type": "tip",
            "text": "詳細は社長・杉村さんとの協議のうえ正式決定されます。最新版は AI Tools Hub の「社内AI利用の注意事項」で確認してください。"
          },
          {
            "type": "h",
            "id": "recap",
            "text": "まとめ"
          },
          {
            "type": "p",
            "text": "入力先を選ぶ・マスキングする・出力を確認する・責任は使った人・迷ったら相談、の5つです。"
          }
        ],
      },
      {
        id: "help",
        title: "困ったときの相談先",
        minutes: 3,
        section: "サポート",
        summary: "困ったときにどこへ相談すればよいかを確認します。",
        ownVideo: "safe-ai-use-help",
        blocks: [
          {
            "type": "p",
            "text": "分からないこと・困ったことがあれば、ひとりで悩まずに相談してください。"
          },
          {
            "type": "h",
            "id": "where",
            "text": "相談先"
          },
          {
            "type": "steps",
            "items": [
              "Office Hour：画面上部の「AI Office Hour 予約」から",
              "Google Chat の「AI勉強会」スペース",
              "お問い合わせページのフォーム・FAQ"
            ]
          },
          {
            "type": "link",
            "href": "https://kanta13jp1.github.io/ai-park/contact",
            "text": "お問い合わせ・よくある質問"
          },
          {
            "type": "h",
            "id": "how",
            "text": "相談するときに書くとよいこと"
          },
          {
            "type": "prompt",
            "text": "【やりたいこと】\n【試したこと】\n【困っていること・エラー文】\n【使っているツール】（例：Antigravity 2.0）",
            "label": "相談メッセージの型"
          },
          {
            "type": "h",
            "id": "recap",
            "text": "まとめ"
          },
          {
            "type": "p",
            "text": "Office Hour・Google Chat の AI勉強会スペース・お問い合わせページの3か所で相談できます。やりたいこと・試したこと・困っていることを書くと、早く解決できます。"
          }
        ],
      },
    ],
    quiz: [
      { q: "顧客の個人情報を入力してよいのはどれですか？", choices: ["個人アカウントの無料AI", "会社として契約し学習不使用が担保されたAI（Level 1）", "どのAIでもよい"], answer: 1, explanation: "機密・個人情報は Level 1 のAIにのみ入力します。" },
      { q: "Level 2 のツールに入力する前にすることはどれですか？", choices: ["マスキング（氏名や顧客名の置き換え）", "何もしない", "入力内容を長くする"], answer: 0, explanation: "Level 2 では個人情報や顧客を特定できる情報を置き換えてから入力します。" },
      { q: "AI が作った資料を社外に出す責任は誰にありますか？", choices: ["AI を作った会社", "AI を使った人", "誰にもない"], answer: 1, explanation: "AI で作った成果物でも、社外に出す・本番に反映する責任は利用者にあります。" },
      { q: "AI の回答に含まれる数値や法令の情報はどう扱いますか？", choices: ["そのまま使う", "一次情報で確認してから使う", "無視する"], answer: 1, explanation: "AI の出力には誤りが含まれるため、事実や数値は一次情報で確認します。" },
      { q: "扱ってよいデータか判断できないときはどうしますか？", choices: ["とりあえず入力してみる", "使う前に AI推進担当 に相談する", "同僚の判断に任せる"], answer: 1, explanation: "迷ったら使う前に Office Hour や Google Chat で AI推進担当 に相談します。" },
    ],
  },
];

export const courseMinutes = (c: Course) => c.lessons.reduce((sum, l) => sum + l.minutes, 0);
