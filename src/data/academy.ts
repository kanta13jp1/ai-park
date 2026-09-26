// Antigravity Academy の教材データ
// 内容は導入ガイド・注意事項（公式ドキュメント／実機画面で確認済み、2026/09/26）と同じ事実に基づく。
// 動画は収録後に lesson.video（YouTube の動画ID）を設定すると表示される。

export type LessonBlock =
  | { type: "p"; text: string }
  | { type: "steps"; items: string[] }
  | { type: "tip"; text: string }
  | { type: "warn"; text: string }
  | { type: "image"; file: string; alt: string };

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  video?: string;
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
    lessons: [
      {
        id: "what",
        title: "Antigravity とは",
        minutes: 5,
        blocks: [
          { type: "p", text: "Google Antigravity は、AI エージェントに開発や調査などの作業を任せるためのツールです。自分の PC のフォルダを「プロジェクト」として登録し、チャットで依頼すると、エージェントがファイルを読み書きしたりコマンドを実行したりして作業を進めます。" },
          { type: "steps", items: [
            "Antigravity 2.0（アプリ）：エージェントに仕事を依頼・管理する中心のアプリ",
            "Antigravity IDE：コードを見ながら作業したい人向けのエディタ（任意で追加）",
            "Antigravity CLI（agy）：ターミナルから使いたい人向け（任意）",
          ] },
          { type: "p", text: "業務では、会社の Google アカウントのまま会社の Google Cloud プロジェクト経由で使います。料金は使った分だけ会社の請求にまとまるため、個人で Google AI Pro に加入する必要はありません。" },
          { type: "warn", text: "個人の Google アカウントで使う場合は個人向けの利用規約が適用されます。顧客情報・社内機密・未公開のソースコードは入力しないでください。" },
        ],
      },
      {
        id: "install",
        title: "インストールする",
        minutes: 5,
        blocks: [
          { type: "p", text: "必要な環境は Windows 10（64bit）以降です。公式サイトからインストーラーをダウンロードします。" },
          { type: "steps", items: [
            "https://antigravity.google/download を開く",
            "「Windows」を選び、「Antigravity 2.0」の「Download for x64」をクリック（ARM 版 PC の場合だけ ARM64）",
            "ダウンロードした Antigravity-x64.exe を実行し、「インストールしています…」の画面が終わるまで待つ",
          ] },
          { type: "image", file: "G1-download-app.png", alt: "ダウンロードページ" },
          { type: "image", file: "G2-install.png", alt: "ダウンロード完了とインストール中の画面" },
          { type: "tip", text: "「Windows によって PC が保護されました」と出たら、公式サイトから入手したファイルであることを確認したうえで「詳細情報」→「実行」を選びます。" },
        ],
      },
      {
        id: "signin",
        title: "サインインと初期設定",
        minutes: 5,
        blocks: [
          { type: "steps", items: [
            "スタートメニューから Antigravity を起動",
            "業務で使う場合は「Use business account」を選び、会社アカウントでサインインしてから会社の Google Cloud プロジェクトを選ぶ",
            "テーマ（画面の色）を選ぶ → Google プラグインは分からなければ選ばずに進む → 利用規約を確認して「Accept」→「Finish」",
          ] },
          { type: "tip", text: "会社のプロジェクト ID は AI CoE から案内されます。「権限がない」と表示された場合は、管理者の設定が終わっていない可能性があるので AI CoE に連絡してください。" },
        ],
      },
      {
        id: "safety",
        title: "最初に必ず：安全設定",
        minutes: 5,
        blocks: [
          { type: "p", text: "左下の「Settings」→「General」で、エージェントにどこまで任せるかを決めます。慣れるまでは、必ず確認が入る設定にしておきます。" },
          { type: "steps", items: [
            "Security Preset：「Default」を選ぶ（ターミナルのコマンド実行と、作業フォルダの外のファイル操作の前に確認が入る）",
            "Plan Review Policy：「Always Ask」を選ぶ（作業を始める前に計画を見せて確認を求める）",
          ] },
          { type: "image", file: "G6-settings-options.png", alt: "Security Preset と Plan Review Policy の選択肢" },
          { type: "warn", text: "「Full machine」は PC 内のどのファイルでも読み書きでき、「Turbo mode」は安全のための確認がすべて無くなります。業務では使わないでください。" },
        ],
      },
      {
        id: "first-task",
        title: "はじめての依頼",
        minutes: 5,
        blocks: [
          { type: "steps", items: [
            "左側「Projects」の右にあるフォルダ＋のアイコンから、作業させたいフォルダを登録する",
            "左上の「New Conversation」をクリック",
            "入力欄（Ask anything...）に、やってほしいことを日本語で書いて送信する",
          ] },
          { type: "image", file: "G5-main.png", alt: "メイン画面" },
          { type: "tip", text: "最初は「このフォルダの中身を説明して」のような、ファイルを変更しない依頼から試すと安心です。" },
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
    lessons: [
      {
        id: "ask",
        title: "伝わる頼み方（4点セット）",
        minutes: 5,
        blocks: [
          { type: "p", text: "AI への依頼は「目的・対象・条件・完了の形」の4点をそろえると、やり直しが減ります。" },
          { type: "steps", items: [
            "目的：何のためにやるか",
            "対象：どのファイル・どの画面か（ファイル名を具体的に）",
            "条件：変えてはいけないこと・使う言語やルール",
            "完了の形：どうなれば終わりか（テストが通る・画面に表示される など）",
          ] },
          { type: "tip", text: "例：「src/app/contact/page.tsx の送信ボタンを、必須項目が空のときは押せないようにしてください。見た目は変えないでください。」" },
        ],
      },
      {
        id: "plan",
        title: "計画を確認してから任せる",
        minutes: 5,
        blocks: [
          { type: "p", text: "Plan Review Policy を「Always Ask」にしておくと、エージェントは作業の前に計画を見せてくれます。計画を読んで、方針が合っていれば進めてもらい、違えばその場で修正を伝えます。" },
          { type: "steps", items: [
            "入力欄で「/」を入力して「plan」を選ぶと、まず計画を作らせることができる",
            "計画の中で「変更するファイル」「やらないこと」を確認する",
            "分からない手順があれば、進める前に理由を質問する",
          ] },
        ],
      },
      {
        id: "git",
        title: "変更の確認と取り消し（Git）",
        minutes: 8,
        blocks: [
          { type: "p", text: "エージェントは複数のファイルを一度に書き換えます。作業前にブランチを切り、変更を差分で確認してから取り込むのが事故を防ぐ基本です。" },
          { type: "steps", items: [
            "git switch -c feature/xxx：作業用ブランチを作る（main で直接作業しない）",
            "git status / git diff：何が変わったかを確認する",
            "git add . && git commit -m \"...\"：確認できた変更を記録する",
            "git restore <file>：意図と違う変更をコミット前に取り消す",
          ] },
        ],
      },
      {
        id: "error",
        title: "エラーが出たときの対処",
        minutes: 5,
        blocks: [
          { type: "steps", items: [
            "エラーメッセージを省略せず全文そのまま貼り、「原因と直し方を説明して」と頼む",
            "直前に何をしたか（実行したコマンド・変更したファイル）も一緒に伝える",
            "同じ修正を3回繰り返しても直らないときは、git restore で元に戻して頼み方を変える",
            "解決しないときはエラー文を添えて Office Hour／お問い合わせへ",
          ] },
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
    lessons: [
      {
        id: "levels",
        title: "データのレベル分け",
        minutes: 5,
        blocks: [
          { type: "steps", items: [
            "Level 1（社内機密・コード入力可）：会社として契約し、入力データを学習に使わないことが担保されたAI（会社の Google Cloud 経由の Antigravity、Gemini Enterprise など）",
            "Level 2（マスキング必須）：氏名・電話番号・顧客名などを置き換えてから入力する",
            "Level 3（公開情報のみ）：個人アカウントのAIツール。公開情報での学習・試用にとどめる",
          ] },
        ],
      },
      {
        id: "rules",
        title: "注意事項5箇条（暫定版）",
        minutes: 5,
        blocks: [
          { type: "steps", items: [
            "機密・個人情報は入力先を選ぶ",
            "入力前にマスキングする",
            "出力は必ず人が確認する",
            "成果物の責任は使った人が持つ",
            "迷ったら使う前に相談する",
          ] },
          { type: "p", text: "詳細は社長・杉村さんとの協議のうえ正式決定されます。最新版は AI Tools Hub の「社内AI利用の注意事項」を確認してください。" },
        ],
      },
      {
        id: "help",
        title: "困ったときの相談先",
        minutes: 3,
        blocks: [
          { type: "steps", items: [
            "Office Hour：画面上部の「AI Office Hour 予約」から",
            "Google Chat の「AI勉強会」スペース",
            "お問い合わせページのフォーム・FAQ",
          ] },
        ],
      },
    ],
    quiz: [
      { q: "顧客の個人情報を入力してよいのはどれですか？", choices: ["個人アカウントの無料AI", "会社として契約し学習不使用が担保されたAI（Level 1）", "どのAIでもよい"], answer: 1, explanation: "機密・個人情報は Level 1 のAIにのみ入力します。" },
      { q: "Level 2 のツールに入力する前にすることはどれですか？", choices: ["マスキング（氏名や顧客名の置き換え）", "何もしない", "入力内容を長くする"], answer: 0, explanation: "Level 2 では個人情報や顧客を特定できる情報を置き換えてから入力します。" },
      { q: "AI が作った資料を社外に出す責任は誰にありますか？", choices: ["AI を作った会社", "AI を使った人", "誰にもない"], answer: 1, explanation: "AI で作った成果物でも、社外に出す・本番に反映する責任は利用者にあります。" },
      { q: "AI の回答に含まれる数値や法令の情報はどう扱いますか？", choices: ["そのまま使う", "一次情報で確認してから使う", "無視する"], answer: 1, explanation: "AI の出力には誤りが含まれるため、事実や数値は一次情報で確認します。" },
      { q: "扱ってよいデータか判断できないときはどうしますか？", choices: ["とりあえず入力してみる", "使う前に AI CoE に相談する", "同僚の判断に任せる"], answer: 1, explanation: "迷ったら使う前に Office Hour や Google Chat で AI CoE に相談します。" },
    ],
  },
];

export const courseMinutes = (c: Course) => c.lessons.reduce((sum, l) => sum + l.minutes, 0);
