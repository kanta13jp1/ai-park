"use client";

import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import {
  Sparkles,
  Calendar,
  X,
  Send,
  Quote,
  Clock,
  CheckCircle2,
  PlusCircle,
  Play,
  ArrowRight,
  Copy,
  Check,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { GITHUB_REPO } from "@/lib/githubFeedback";

interface InterviewArticle {
  id: string;
  issueNumber: string; // "#05", "#04" 等
  sectionTitle: string; // "🎤 Gemini活用事例インタビュー #05"
  initial: string;
  initialBg: string;
  title: string;
  interviewee: string;
  role: string;
  date: string;
  tag: string;
  tagColor: string;
  summary: string;
  metrics: string;
  slideTheme: {
    bgGradient: string;
    catchphrase: string;
    subCatchphrase: string;
  };
  highlights: string[];
  qna: { q: string; a: string }[];
  promptTemplate?: {
    title: string;
    content: string;
  };
  advice: string;
  published?: boolean; // 実取材・本人と上長の原稿確認が済んだ正式記事のみ true（未指定はモデルケース）
}

// 取材キット：取材の流れと質問項目（記事フォーマットの各欄に対応）
const interviewFlow = [
  { step: "立候補", desc: "下のボタンから立候補（GitHub Issue）。AI CoE に通知が届きます" },
  { step: "日程調整", desc: "AI CoE 編集部から連絡し、30分の取材枠を調整（オンライン可）" },
  { step: "取材", desc: "下の質問項目に沿ってお話を伺います。画面を見せながらでもOK" },
  { step: "原稿確認", desc: "ご本人と上長に原稿を確認いただき、社外秘の情報がないかをチェック" },
  { step: "公開", desc: "確認が取れた記事から「正式公開」として掲載します" },
];

const interviewQuestions = [
  "どんな業務で、何に困っていましたか？（AI導入前の状況）",
  "どのAIツールを、どう使いましたか？（使ったプロンプトや手順があれば）",
  "どれくらい効果がありましたか？（時間・件数などの数字で分かる範囲）",
  "うまくいかなかったこと・つまずいたことは？",
  "これから始める人へのアドバイスをひとこと",
];

function buildCandidateIssueUrl(fields: { author: string; dept: string; theme: string }) {
  const params = new URLSearchParams({
    template: "interview.yml",
    title: `[取材立候補] ${fields.dept} ${fields.author}`,
    author: fields.author,
    dept: fields.dept,
    theme: fields.theme,
  });
  return `https://github.com/${GITHUB_REPO}/issues/new?${params.toString()}`;
}

function ArticleStatusBadge({ published }: { published?: boolean }) {
  return published ? (
    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
      ✅ 正式公開
    </span>
  ) : (
    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
      📋 モデルケース（架空の事例）
    </span>
  );
}

const interviewArticles: InterviewArticle[] = [
  {
    id: "network-sre-gemini",
    issueNumber: "#05",
    sectionTitle: "🎤 Gemini活用事例インタビュー #05",
    initial: "T",
    initialBg: "bg-indigo-600 text-white",
    title: "ログ解析からクラウド構築まで！「丸投げしない」AI活用術",
    interviewee: "高橋 誠 さん",
    role: "クラウド基盤推進部 ネットワーク・インフラ担当",
    date: "2026.09.12",
    tag: "インフラ & SRE",
    tagColor: "bg-indigo-100 text-indigo-800",
    summary:
      "パケットキャプチャやエラーログといった「ファクト（事実）」をベースにしたAIの活用法から、AIの回答精度を高めるための「言語化能力」の重要性など、インフラエンジニアならではの実践的なノウハウをご紹介します。",
    metrics: "障害切り分け・ログ解析時間 25分 → 2分 に短縮 (92% 削減)",
    slideTheme: {
      bgGradient: "from-indigo-900 via-slate-900 to-purple-950",
      catchphrase: "Gemini活用術：\n丸投げから主体的な協働へ",
      subCatchphrase: "ファクトベースのログ解析とプロンプト言語化",
    },
    highlights: [
      "エラーログやパケットキャプチャの生データをそのまま渡し、前提条件を言語化して与える",
      "「何が起きているか」と「何が正常か」の差分を指示することでハルシネーションを防止",
      "AIの出力を鵜呑みにせず、TerraformやAWS CLIコマンドのdry-runで必ず検証する文化を徹底",
    ],
    qna: [
      {
        q: "AIを活用し始めたきっかけと、現場で直面した最初の壁は何でしたか？",
        a: "大規模なネットワーク切り替え作業で、数万行に及ぶ分散ログから原因エラーを特定するのに膨大な時間がかかっていました。当初は『このエラー直して』と曖昧に丸投げしてしまい、的外れな回答が返ってくる壁にぶつかりました。",
      },
      {
        q: "「丸投げしない活用術」とは具体的にどのようなアプローチですか？",
        a: "AIは『前提条件と事実（ファクト）』を与えて初めて最高の能力を発揮します。エラーログの直前の正常リクエスト、期待するネットワークトポロジー、利用しているOSバージョンを箇条書きで言語化してプロンプトにインプットするアプローチへ変えたところ、解決策の的中率が劇的に跳ね上がりました。",
      },
      {
        q: "インフラエンジニアにとって、生成AI時代に求められるスキルは何だと思いますか？",
        a: "『自分の意図やシステムの前提を正確に言葉にする力（言語化能力）』です。コマンドを丸暗記することよりも、システムがどう振る舞うべきかをAIへロジカルに指示できるエンジニアが圧倒的な成果を出せる時代になっています。",
      },
    ],
    promptTemplate: {
      title: "【高橋さん直伝】インフラ障害ログ解析プロンプト",
      content: `あなたはインフラSREエンジニアです。以下のシステム構成とエラーログから、根本原因の候補と確認すべきコマンドを3つ提示してください。

【システム環境】
- クラウド: AWS (VPC内 ECS Fargate + RDS PostgreSQL)
- 発生事象: APIゲートウェイで504 Gateway Timeoutがスパイク

【直前ログ（正常）】
GET /api/v1/health -> 200 OK (5ms)

【エラーログ】
ERROR: connection to server at "db.internal" failed: Connection timed out (0x0000274c)

【回答フォーマット】
1. 推定される根本原因（確信度つき）
2. 即時確認すべきCLIコマンド / クエリ
3. 一時緩和策`,
    },
    advice: "AIへの丸投げを卒業し、自分の思考の補助輪としてファクトを渡す習慣をつけてみてください。世界が変わります！",
  },
  {
    id: "architect-ai-driven",
    issueNumber: "#04",
    sectionTitle: "🎤 Gemini活用事例インタビュー #04",
    initial: "HK",
    initialBg: "bg-slate-700 text-white",
    title: "AIは「記憶が1日で消える超優秀なエンジニア」！アーキテクトが語るAI駆動開発",
    interviewee: "HK さん",
    role: "基幹システム開発部 アーキテクト",
    date: "2026.09.05",
    tag: "設計 & アーキテクチャ",
    tagColor: "bg-sky-100 text-sky-800",
    summary:
      "コンテキストの制限や仕様の誤認を前提とした「タスク細分化（Divide & Conquer）」の設計思想や、設計書・コードレビューにおけるガードレールの重要性など、アーキテクト視点でのAI共創開発論を語っていただきました。",
    metrics: "新規マイクロサービス設計〜PoC工数 3週間 → 5日 (75% 圧縮)",
    slideTheme: {
      bgGradient: "from-slate-900 via-blue-950 to-slate-900",
      catchphrase: "Geminiエンジニアリングと\nリスク管理の極意",
      subCatchphrase: "記憶が消える超優秀な相棒をどう指揮するか",
    },
    highlights: [
      "AIは超優秀だがコンテキストが流れる。だからこそ「1タスク＝1責務」に分解して渡す",
      "社内共通のRules / Guidelines（AGENTS.md等）をあらかじめ定義し、設計ブレを防止",
      "「コードを書かせる前」に必ずアーキテクチャ設計とテスト計画をレビュー・合意させる",
    ],
    qna: [
      {
        q: "「記憶が1日で消える超優秀なエンジニア」という表現の意図を教えてください。",
        a: "AIは世界中の技術知識を持つ天才エンジニアですが、会話セッションが変われば過去の議論を忘れ、文脈が長くなれば細部を見落とします。だからこそ、人間側が『プロジェクトの文脈やルール』を外付けメモリ（Rulesやプロンプト指示）として常に提供してあげる設計が必要不可欠なのです。",
      },
      {
        q: "AI駆動開発で最も失敗しやすいパターンは何ですか？",
        a: "『この仕様でシステム全体を一気に作って』と巨大な要件を一度に渡してしまうことです。必ず要件定義 → データモデリング → インターフェース定義 → 単体実装 → テスト、とステップごとに刻んでレビューを入れることが最も手戻りを防ぐ近道です。",
      },
      {
        q: "社内エンジニアへ向けたメッセージをお願いします。",
        a: "コードを書く作業自体はAIが肩代わりしてくれる時代になりました。だからこそ、アーキテクチャの整合性、非機能要件、セキュリティ境界といった『本質的な設計力』を磨くことが、エンジニアにとって最大の差別化になります。",
      },
    ],
    promptTemplate: {
      title: "【HKさん直伝】設計レビュー用ガードレールプロンプト",
      content: `あなたはシニアシステムアーキテクトです。提示された新機能のインターフェース設計案について、以下の観点から厳格にコードレビューを行ってください。

【レビュー観点】
1. べき等性（Idempotency）が担保されているか（ネットワーク断・二重送信への耐性）
2. 下位互換性（Breaking Changesがないか）
3. エラーハンドリングの分類（クライアント起因4xx vs サーバ起因5xx）
4. パフォーマンスのボトルネック（N+1問題、過剰なメモリ消費）

【インターフェース案】
(ここにOpenAPI仕様やTypeScript型定義をペースト)`,
    },
    advice: "AIを単なるタイピング代行機にするのではなく、最上位のペアプログラミングパートナーとして議論をぶつけてみてください。",
  },
  {
    id: "helpdesk-slack-gemini",
    issueNumber: "#03",
    sectionTitle: "🎤 Gemini活用事例インタビュー #03",
    initial: "SM",
    initialBg: "bg-emerald-600 text-white",
    title: "「月間40時間の問い合わせを85%削減」Slack × Gemini によるヘルプデスク自動化",
    interviewee: "佐藤 恵美 さん",
    role: "DXソリューション部 課長代理",
    date: "2026.08.22",
    tag: "全社DX推進",
    tagColor: "bg-emerald-100 text-emerald-800",
    summary:
      "社内FAQやマニュアルをRAG連携し、Slack上で回答ドラフトを即時生成。確信度スコア付きで安全にエスカレーションする仕組みを構築し、現場のサポート工数を激減させた取り組みを伺いました。",
    metrics: "問い合わせ一次対応時間 85% 削減 (月40時間 → 6時間)",
    slideTheme: {
      bgGradient: "from-emerald-950 via-slate-900 to-teal-950",
      catchphrase: "全社ヘルプデスク革命：\nSlack × Gemini RAG自動化",
      subCatchphrase: "確信度スコア付きの安心エスカレーション設計",
    },
    highlights: [
      "社内規程・PCセットアップ手順をベクトル検索で瞬時に引き当て",
      "確信度が80%未満の場合は『担当者へエスカレーション』する安全フェイルセーフ",
      "回答末尾に必ず参照した社内ポータルのURLを明記し、社内信頼を獲得",
    ],
    qna: [
      {
        q: "導入前に現場が抱えていた最大の課題は何でしたか？",
        a: "『VPNが繋がらない』『パスワードを再発行したい』といった過去何百回も回答してきた質問に、エンジニアやサポート担当者が都度手作業でチャットを返信しており、本来の開発業務が分断されていたことです。",
      },
      {
        q: "運用の定着化で工夫されたポイントは？",
        a: "最初から100点の完全自動回答を目指さず、『回答のドラフトをまずAIが提示し、担当者がボタン一つで確認・送信できる半自動化』からスタートしたことです。これにより誤回答のリスクを防ぎつつ、現場の心理的ハードルをゼロにできました。",
      },
    ],
    advice: "まずは『毎日10分使っている定型業務』を1つ選んでAIに任せてみることが、組織DX成功への最短ルートです！",
  },
  {
    id: "data-democracy-bigquery",
    issueNumber: "#02",
    sectionTitle: "🎤 Gemini活用事例インタビュー #02",
    initial: "NY",
    initialBg: "bg-blue-600 text-white",
    title: "「SQLが書けなくてもデータ分析」BigQuery × Gemini で実現した全社データ民主化",
    interviewee: "中村 陽子 さん",
    role: "データソリューション部 シニアアナリスト",
    date: "2026.08.10",
    tag: "データ分析 & BI",
    tagColor: "bg-blue-100 text-blue-800",
    summary:
      "マーケティングや営業推進の非エンジニアメンバーが、自然言語で質問するだけでBigQueryから必要なデータを抽出し、SQLの最適化まで自動で行うワークフローを整備した実績をインタビュー。",
    metrics: "データ抽出依頼チケットの消化スピード 3倍向上",
    slideTheme: {
      bgGradient: "from-blue-950 via-slate-900 to-indigo-950",
      catchphrase: "自然言語でSQL生成：\n全社データ民主化の軌跡",
      subCatchphrase: "コスト爆発を防ぐ社内Skillガードレール",
    },
    highlights: [
      "非エンジニアでも『先月の部署別利用トレンドを出して』と打つだけでSQLを生成",
      "PB単位のフルスキャン事故を防ぐため、パーティション指定を強制するSkillを標準配備",
      "データ抽出待ちのボトルネックを解消し、現場が自律的に仮説検証できる体制へ",
    ],
    qna: [
      {
        q: "データ民主化において最も重視した安全対策は何ですか？",
        a: "誰でもクエリを実行できるようにしつつ、莫大なクラウド費用が発生しないよう、社内Skill (`bigquery-sql-optimization`) でパーティション指定を強制したことです。",
      },
      {
        q: "今後の展望について教えてください。",
        a: "抽出したデータを元に、AIが施策提案や売上予測レポートまで自動でスライド化してくれる仕組みをCoEと共同で検証中です。",
      },
    ],
    advice: "データ構造を整えて適切なメタデータを付与しておけば、AIは世界で最も頼りになるデータアナリストになります。",
  },
  {
    id: "subagents-frontend-automation",
    issueNumber: "#01",
    sectionTitle: "🎤 Gemini活用事例インタビュー #01",
    initial: "YY",
    initialBg: "bg-rose-600 text-white",
    title: "自律並列Subagentsで挑むフロントエンド自動テスト & コードレビュー",
    interviewee: "山本 雄二 さん",
    role: "デジタルサービス推進部 開発リーダー",
    date: "2026.07.25",
    tag: "テスト自動化",
    tagColor: "bg-rose-100 text-rose-800",
    summary:
      "画面変更のたびに発生していた手動回帰テストを、Playwrightと連携する自律型Subagentsで自動化。単一プロンプトの限界を突破した自律並列エージェントの実践知見を公開します。",
    metrics: "リリース前リグレッションテスト工数 60% 削減",
    slideTheme: {
      bgGradient: "from-rose-950 via-slate-900 to-slate-950",
      catchphrase: "自律並列エージェントで\nフロントエンドE2Eを革新",
      subCatchphrase: "探索・テスト・レポートの完全自動化パイプライン",
    },
    highlights: [
      "仕様探索エージェントとテスト実行エージェントを分離して並列稼働",
      "UIの破壊的変更をスクリーンショット差分検知で自動レポート",
      "PR作成時にレビューコメントと修正コード案を自動提示",
    ],
    qna: [
      {
        q: "Subagents（並列エージェント）を導入した決め手は？",
        a: "1つのAIセッションでコードを読み、テストを書き、ブラウザを操作させると途中でコンテキストが混乱していました。探索役、実装役、レビュアー役に分担させることで、人間チームと同じ役割分担を実現できました。",
      },
    ],
    advice: "小さなスコープからエージェントを走らせてみてください。チームに優秀なジュニアエンジニアが数人加わったような感覚が得られます。",
  },
];

export default function InterviewsPage() {
  const [selectedArticle, setSelectedArticle] = useState<InterviewArticle | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [candidateDept, setCandidateDept] = useState("");
  const [candidateTheme, setCandidateTheme] = useState("");
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // 立候補は GitHub Issue フォーム（interview.yml）へ入力内容を引き継いで起票 → Google Chat に通知
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !candidateDept) return;
    window.open(
      buildCandidateIssueUrl({ author: candidateName, dept: candidateDept, theme: candidateTheme }),
      "_blank",
      "noopener,noreferrer"
    );
    setIsSubmitModalOpen(false);
    setCandidateName("");
    setCandidateDept("");
    setCandidateTheme("");
  };

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* ヒーローヘッダー（参考サイト完全準拠：ダーク光跡グラデーション & 中央白文字） */}
      <div className="w-full relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white py-14 sm:py-20 px-4 border-b border-slate-800 shadow-lg">
        {/* 背景の光跡・ブラー装飾 */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-48 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent blur-2xl transform -rotate-6" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-3 z-10">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-300 tracking-wide">
            <Sparkles size={13} className="text-cyan-400" />
            <span>MightyLINK AI Case Studies</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            Gemini活用インタビュー
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            社内の第一線でAIツールを実践導入しているエンジニア・現場リーダーの「リアルな生の声」「直面した壁」「乗り越え方」を共有します。
          </p>
        </div>
      </div>

      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* デプロイ品質ゲート連動アラート */}
        <UnderConstructionAlert
          statusType="draft"
          title="📋 取材準備中・ドラフト事例モデル掲載"
          message="現在掲載されているインタビュー記事は、社内実務ユースケースに基づくモデルケース（ドラフト）です。正式な社内インタビューの取材・記事公開を順次準備しています。"
          prepDetails="取材立候補を受付中（下の「取材に立候補する」から応募するとAI CoEに通知されます）。各記事の「モデルケース」「正式公開」バッジで区別できます"
          releaseDate="2026年10月16日(金)"
        />

        {/* 取材立候補案内バナー */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-indigo-700/50">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30">
                次回 #06 取材募集中
              </span>
              <span className="text-xs text-slate-300">次回インタビューの主役はあなたです！</span>
            </div>
            <h3 className="text-base font-bold text-white">
              あなたのチームのAI活用事例や工夫を社内ポータルに掲載しませんか？
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              「自作プロンプトで作業を時短した」「Antigravityを導入してみた」など、小さな工夫でも大歓迎です。CoE編集部が取材・記事化をサポートします。
            </p>
          </div>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="shrink-0 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center space-x-1.5 self-end sm:self-center"
          >
            <PlusCircle size={15} />
            <span>取材に立候補する</span>
          </button>
        </div>

        {/* 取材キット：流れと質問項目 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">🗓️ 取材から公開までの流れ</h3>
            <ol className="space-y-2">
              {interviewFlow.map((f, i) => (
                <li key={f.step} className="flex items-start gap-2.5 text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900">{f.step}：</span>
                    {f.desc}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">🎤 取材でお聞きすること（所要30分）</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
              {interviewQuestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-500">
              準備は不要です。顧客名・案件名などは記事では伏せ字にします。
            </p>
          </div>
        </div>

        {/* 連載インタビュー一覧（参考サイト再現：通し番号見出し ＋ 2カラムメディアカード） */}
        <div className="space-y-8">
          {[...interviewArticles]
            .sort((a, b) => Number(Boolean(b.published)) - Number(Boolean(a.published)))
            .map((article) => (
            <div key={article.id} className="space-y-3">
              {/* セクション見出し（青ラインバー付き） */}
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full shrink-0" />
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                  <span>{article.sectionTitle}</span>
                </h2>
                <ArticleStatusBadge published={article.published} />
              </div>

              {/* 2カラム・メディアカード */}
              <div
                onClick={() => setSelectedArticle(article)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer overflow-hidden group"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  {/* 左カラム：テキスト情報エリア (7 cols) */}
                  <div className="p-6 md:p-7 md:col-span-7 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* 話者アバター ＆ 所属 */}
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0 ${article.initialBg}`}
                        >
                          {article.initial}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                            {article.interviewee}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {article.role}
                          </p>
                        </div>
                      </div>

                      {/* キャッチーな記事タイトル */}
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {article.title}
                      </h4>

                      {/* リード文・要約 */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>

                    {/* フッターメトリクス ＆ 日付 */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-[11px]">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        <span>{article.metrics}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {article.date} 公開
                      </span>
                    </div>
                  </div>

                  {/* 右カラム：スライド・動画風サムネイルエリア (5 cols) */}
                  <div
                    className={`md:col-span-5 relative p-6 sm:p-7 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${article.slideTheme.bgGradient} text-white`}
                  >
                    {/* 背景装飾 */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-2xl" />
                    </div>

                    <div className="relative z-10 space-y-2">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-300 font-bold px-2 py-0.5 rounded bg-white/10 border border-white/10 inline-block">
                        Featured Slide
                      </span>
                      <p className="text-base sm:text-lg font-extrabold text-white leading-tight whitespace-pre-line drop-shadow-sm">
                        {article.slideTheme.catchphrase}
                      </p>
                      <p className="text-xs text-slate-300 font-light">
                        {article.slideTheme.subCatchphrase}
                      </p>
                    </div>

                    {/* 中央の再生・展開ボタン */}
                    <div className="relative z-10 pt-6 flex items-center justify-between">
                      <div className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110">
                        <Play size={16} className="fill-white translate-x-0.5" />
                      </div>
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                        <span>記事・スライドを読む</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 記事詳細 ＆ 一問一答モーダル */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* 閉じるボタン */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* モーダルヘッダー */}
            <div className="space-y-3 border-b border-slate-100 pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  {selectedArticle.sectionTitle}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${selectedArticle.tagColor}`}>
                  {selectedArticle.tag}
                </span>
                <ArticleStatusBadge published={selectedArticle.published} />
                <span className="text-xs text-slate-400 font-mono">
                  {selectedArticle.date}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center space-x-3 pt-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${selectedArticle.initialBg}`}
                >
                  {selectedArticle.initial}
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block">
                    {selectedArticle.interviewee}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedArticle.role}
                  </span>
                </div>
              </div>
            </div>

            {/* スライド風ハイライト（3大ポイント） */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-5 space-y-3">
              <span className="text-xs font-bold text-cyan-300 tracking-wide uppercase font-mono">
                Key Takeaways / 実践ハイライト
              </span>
              <div className="space-y-2 text-xs sm:text-sm text-slate-200">
                {selectedArticle.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-cyan-400 font-bold shrink-0 mt-0.5">0{idx + 1}.</span>
                    <span className="leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 定量効果メトリクス */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3 text-emerald-900">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
              <div>
                <span className="text-[11px] font-semibold text-emerald-700 block">実測された成果:</span>
                <span className="text-sm font-bold text-emerald-950">{selectedArticle.metrics}</span>
              </div>
            </div>

            {/* 一問一答（Q&A） */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Quote className="text-blue-600 w-5 h-5" />
                <span>インタビュー一問一答（抜粋）</span>
              </h3>

              <div className="space-y-4">
                {selectedArticle.qna.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold text-xs bg-blue-100 px-1.5 py-0.5 rounded shrink-0">
                        Q{idx + 1}
                      </span>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm leading-relaxed">
                        {item.q}
                      </p>
                    </div>
                    <div className="flex items-start space-x-2 pt-1 border-t border-slate-200/60">
                      <span className="text-slate-600 font-bold text-xs bg-slate-200 px-1.5 py-0.5 rounded shrink-0">
                        A
                      </span>
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 明日から使える実践プロンプト定型句（ワンクリックコピー） */}
            {selectedArticle.promptTemplate && (
              <div className="bg-slate-900 text-slate-100 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300">
                    {selectedArticle.promptTemplate.title}
                  </span>
                  <button
                    onClick={() =>
                      handleCopyPrompt(
                        selectedArticle.id,
                        selectedArticle.promptTemplate!.content
                      )
                    }
                    className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded font-semibold text-white transition-colors"
                  >
                    {copiedPromptId === selectedArticle.id ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span className="text-emerald-400">コピー完了</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>プロンプトをコピー</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs font-mono bg-black/40 p-3.5 rounded-lg border border-white/10 overflow-x-auto leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {selectedArticle.promptTemplate.content}
                </pre>
              </div>
            )}

            {/* 現場からのアドバイス */}
            <div className="border-l-4 border-amber-500 bg-amber-50/70 p-4 rounded-r-xl space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                現場読者へのメッセージ
              </span>
              <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed italic">
                &ldquo;{selectedArticle.advice}&rdquo;
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 取材立候補モーダル */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                取材募集
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                活用インタビューへの立候補・情報提供
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                チーム内で試して効果があったAI活用の工夫やエピソードをお寄せください。CoE編集部が取材・記事化します。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">お名前 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="例: 山本 雄二"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">所属部署 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="例: デジタル推進第一部"
                    value={candidateDept}
                    onChange={(e) => setCandidateDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">取り組み内容・アピールポイント</label>
                <textarea
                  rows={3}
                  placeholder="「自作のプロンプトで〇〇作業を短縮した」「チームでAntigravityを運用中」など自由にご記入ください。"
                  value={candidateTheme}
                  onChange={(e) => setCandidateTheme(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              <p className="text-slate-500 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                「立候補を送信」を押すと、入力内容が入った GitHub Issue の画面が開きます。そこで送信すると AI CoE に通知が届きます。
                Issue は公開されるため、顧客名・案件名・社外秘の数値は書かずに概要だけご記入ください。
              </p>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <Send size={13} />
                  <span>立候補を送信</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
