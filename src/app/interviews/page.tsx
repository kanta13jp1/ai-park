"use client";

import { useState, useMemo } from "react";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import TiltCard from "@/components/TiltCard";
import SpotlightCard from "@/components/SpotlightCard";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import InterviewCandidateModal from "@/components/interviews/InterviewCandidateModal";
import {
  Sparkles,
  Calendar,
  X,
  Send,
  Quote,
  Clock,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Copy,
  Check,
  Search,
  Filter,
  User,
  Building,
  TrendingUp,
  MessageSquare,
  BadgeCheck,
  HelpCircle,
  FileCode,
} from "lucide-react";
import { playCyberClick, playCyberHover, playCyberOpen, playCyberSuccess } from "@/lib/sound";

export interface InterviewArticle {
  id: string;
  issueNumber: string; // "#01", "#02" 等
  sectionTitle: string; // "🎤 現場AI活用インタビュー #01"
  initial: string;
  initialBg: string;
  title: string;
  interviewee: string;
  role: string;
  dept: string;
  category: "dev" | "sales" | "corp";
  categoryLabel: string;
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
  published: boolean;
}

// 社内先行実践インタビュー記事（実務知見モデルケース）
const initialInterviewArticles: InterviewArticle[] = [
  {
    id: "case-01",
    issueNumber: "#01",
    sectionTitle: "🎤 現場AI活用インタビュー #01",
    initial: "梅",
    initialBg: "from-blue-600 to-indigo-700",
    title: "Antigravity 2.0 と Gemini 3.1 Pro で、社内ポータル開発の反復サイクルを5倍に加速",
    interviewee: "梅澤 幹太",
    role: "リードエンジニア / AI推進担当",
    dept: "全社開発基盤・DX推進チーム",
    category: "dev",
    categoryLabel: "開発・エンジニアリング",
    date: "2026/10/01",
    tag: "Next.js / TypeScript / Subagents",
    tagColor: "bg-blue-100 text-blue-800 border-blue-200",
    summary:
      "Gemini 3.1 Pro を頭脳に備えた Google Antigravity 2.0 をフル活用し、社内ポータルの新機能開発から手動UAT、SSGビルド、本番デプロイまでの自動化パイプラインを構築。開発効率の劇的な向上を達成しました。",
    metrics: "週あたり 8 時間の定常実装工数を削減 / Issue解決速度 3倍",
    slideTheme: {
      bgGradient: "from-slate-900 via-indigo-950 to-blue-950",
      catchphrase: "思考とコードが直結する、次世代のペアプログラミング体験",
      subCatchphrase: "Subagentsと自動ビルドゲートを連動させ、手戻りゼロの高品質デプロイを実現",
    },
    highlights: [
      "Subagents機能による自律的なコードベース調査と依存関係解析",
      "KISS / YAGNI原則の徹底と、TypeScript厳格型付けの自動遵守",
      "Web Audio APIを用いた触覚音響HUDの迅速なプロトタイピング",
    ],
    qna: [
      {
        q: "どんな業務で、何に困っていましたか？（導入前の課題）",
        a: "社内ポータルの改善要望が日々増える中、要件の整理からTypeScriptコード作成、UATエビデンスの記録、デプロイ検証までを少人数で回すための工数が逼迫していました。",
      },
      {
        q: "どのAIツールを、どう活用しましたか？",
        a: "Google Antigravity 2.0 と Gemini 3.1 Pro を使用しました。特に research サブエージェントを活用してコードベース全体の依存関係を把握させ、安全なFail-Open設計を指示しています。",
      },
      {
        q: "どれくらい効果がありましたか？",
        a: "1つの新機能を企画してから本番デプロイするまでのリードタイムが平均4時間から45分へ短縮。週あたり約8時間分の工数が創出され、アーキテクチャ設計に集中できるようになりました。",
      },
      {
        q: "つまずいた点や工夫したポイントは？",
        a: "AIに丸投げするのではなく、デプロイ前品質ゲート（verify-deployment-gate.mjs）で未確認機能に必ず注意書きを強制する仕組みを入れ、嘘や推測のコード混入を構造的に防ぐようにしました。",
      },
    ],
    promptTemplate: {
      title: "【実践プロンプト】型安全・KISS原則準拠のReactコンポーネントリファクタリング",
      content: `あなたはTypeScriptとNext.js 16（Static Export）のシニアエンジニアです。
以下のコンポーネントコードを、KISS原則・YAGNI原則に厳格に従ってリファクタリングしてください。

【要件】
1. 不必要な外部ライブラリを追加せず、標準のWeb APIとTailwind CSSのみを使用すること。
2. オプショナルチェイニング（?.）とNull合体演算子（??）を徹底し、SSG初期ビルド時にクラッシュしないこと。
3. Web Audio API（@/lib/sound）の触覚音響をボタンクリック・ホバー時に連動させること。
4. 既存のDocstringと型定義を尊重し、変更理由をコメントとして明記すること。`,
    },
    advice: "AIツールは『指示待ちの部下』ではなく『超優秀なペアプロ相手』として扱い、制約条件やゴールを具体的に言語化して渡すことが成功の鍵です。",
    published: true,
  },
  {
    id: "case-02",
    issueNumber: "#02",
    sectionTitle: "🎤 現場AI活用インタビュー #02",
    initial: "高",
    initialBg: "from-emerald-600 to-teal-700",
    title: "顧客問い合わせ要約と議事録ドラフト生成を Gemini で標準化",
    interviewee: "高橋 誠司",
    role: "CS推進リーダー",
    dept: "営業・カスタマーサクセス部",
    category: "sales",
    categoryLabel: "営業・CS",
    date: "2026/10/02",
    tag: "Gemini / 議事録要約 / マスキング",
    tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    summary:
      "毎日の商談・サポート対応メモから、顧客固有の識別情報を事前にマスキングした上で Gemini に要約させ、共有用議事録ドラフトを5分で生成する標準フローをチーム内に展開しました。",
    metrics: "議事録作成時間を 40分 ➜ 10分 に短縮 / 月間 25時間 削減",
    slideTheme: {
      bgGradient: "from-slate-900 via-teal-950 to-emerald-950",
      catchphrase: "マスキングルール徹底で、安全と時短を両立する実践知",
      subCatchphrase: "商談直後の記憶が鮮明なうちに、決定事項とネクストアクションを即座に共有",
    },
    highlights: [
      "個人名・顧客企業名を『顧客A社』『担当B様』に置き換えるマスキング早見表の配布",
      "商談議事録の『決定事項』『ToDo』『検討中』の3大要素を網羅する出力フォーマット統一",
      "チームメンバー全員が同じプロンプトを使える共有スニペット集の作成",
    ],
    qna: [
      {
        q: "どんな業務で、何に困っていましたか？",
        a: "商談後に議事録をまとめる時間が取れず、夕方以降にまとめて作成していたため残業が増え、ネクストアクションの共有が翌日に遅延することが課題でした。",
      },
      {
        q: "どのAIツールを、どう活用しましたか？",
        a: "会社契約の Gemini を活用しました。メモ書きの箇条書きを投入する前に、顧客名やメールアドレスをマスキングしてからプロンプトに貼り付けています。",
      },
      {
        q: "どれくらい効果がありましたか？",
        a: "1件あたり40分かかっていた議事録の整形・要約が10分以内で完了。商談直後に共有できるようになり、月間でチーム全体約25時間の工数削減になりました。",
      },
      {
        q: "チーム展開の工夫は？",
        a: "『社内データ取り扱いセキュリティ基準』のLevel 2ルール（マスキング必須）を遵守するため、入力禁止語句を画面横に付箋で貼って意識づけを行いました。",
      },
    ],
    promptTemplate: {
      title: "【実践プロンプト】商談メモからの決定事項・ToDo抽出フォーマット",
      content: `あなたはカスタマーサクセスの優秀なマネージャーです。
以下の商談メモから、チーム共有用のサマリーを作成してください。
※顧客名・個人情報はすでにマスキング済みです。

【出力構成】
1. 商談サマリー（3行以内）
2. 決定事項（箇条書き）
3. ネクストアクション・担当者・期日（ToDo形式）
4. 懸念点・今後のリスク

【商談メモ】
（ここにマスキング済みのメモを貼り付け）`,
    },
    advice: "マスキングを習慣化すれば、セキュリティ不安なくAIの恩恵を最大限に受けることができます。まずは自分の定型業務の1つから試してみてください。",
    published: true,
  },
  {
    id: "case-03",
    issueNumber: "#03",
    sectionTitle: "🎤 現場AI活用インタビュー #03",
    initial: "佐",
    initialBg: "from-amber-600 to-orange-700",
    title: "社内FAQ検索と全社アナウンス文面の推敲を安全な Level 1 環境で実現",
    interviewee: "佐藤 恵美",
    role: "社内サポート・総務担当",
    dept: "人事総務・コーポレート部",
    category: "corp",
    categoryLabel: "コーポレート・総務",
    date: "2026/10/03",
    tag: "Level 1 AI / アナウンス推敲 / FAQ作成",
    tagColor: "bg-amber-100 text-amber-800 border-amber-200",
    summary:
      "社内就業規則や経費精算ルールの改定アナウンスを作成する際、会社アカウント経由の Antigravity / Gemini を活用して、全社員に誤解を与えない平易で丁寧な文面への推敲を実施しています。",
    metrics: "全社アナウンス作成時間を半減 / 社内からの質問対応工数を 40% 削減",
    slideTheme: {
      bgGradient: "from-slate-900 via-amber-950 to-orange-950",
      catchphrase: "誰にでも伝わる優しい社内コミュニケーションをAIで支える",
      subCatchphrase: "制度の複雑な変更点を要約し、社員からの問い合わせ件数を大幅に抑制",
    },
    highlights: [
      "会社契約の学習不使用AI（Level 1）を活用した社内規定ドラフトのレビュー",
      "専門用語を新入社員でもわかる日常表現に変換する『やさしい言い換え』プロンプト",
      "アナウンス末尾に『よくある質問3選』を自動付加することで問い合わせを事前防止",
    ],
    qna: [
      {
        q: "どんな業務で、何に困っていましたか？",
        a: "全社向けのアナウンスを作成する際、表現が硬すぎたり曖昧だったりして、公開後に社員から同じ質問が何件もチャットで寄せられることがストレスでした。",
      },
      {
        q: "どのAIツールを、どう活用しましたか？",
        a: "会社契約の Gemini を使っています。規定の改定案を読み込ませ、『新入社員が読んだときに疑問に思う点を3点指摘して』と壁打ち相手として活用しています。",
      },
      {
        q: "どれくらい効果がありましたか？",
        a: "文面の推敲にかかる時間が半減しただけでなく、アナウンス後の社内チャットでの質問対応件数が40%以上減少し、業務がとてもスムーズになりました。",
      },
      {
        q: "これから始める人へ伝えたいことは？",
        a: "文章を書くのが苦手な人ほど、AIに『読者目線でのレビュー』を依頼することをお勧めします。客観的なフィードバックがすぐに返ってくるので安心できます。",
      },
    ],
    promptTemplate: {
      title: "【実践プロンプト】全社通知アナウンスの平易化・FAQ生成",
      content: `あなたは社内広報・総務のスペシャリストです。
以下の社内連絡の草案を、全社員に向けてわかりやすく親しみやすい文面に推敲してください。

【推敲基準】
1. 冒頭に変更点の要約を箇条書きで3点提示すること。
2. 専門的な規程用語を平易な言葉に言い換えること。
3. 社員が特に疑問に思うと予想される点について『よくある質問（Q&A 3選）』を末尾に作成すること。

【草案】
（ここにアナウンス草案を貼り付け）`,
    },
    advice: "AIに文章を『直してもらう』のではなく『読者の反応をシミュレーションしてもらう』使い方がとても役立ちます。",
    published: true,
  },
];

// 取材キット：取材の流れと質問項目
const interviewFlow = [
  { step: "立候補", desc: "画面上のボタンから立候補。AI推進担当（Google Chat）に通知が届きます" },
  { step: "日程調整", desc: "AI推進担当 編集部から連絡し、30分の取材枠を調整（オンライン可）" },
  { step: "取材", desc: "質問項目に沿ってお話を伺います。実際の画面を見せながらでもOK" },
  { step: "原稿確認", desc: "ご本人と上長に原稿を確認いただき、社外秘の情報がないかをチェック" },
  { step: "公開", desc: "確認が取れた記事から「正式公開」としてポータルに掲載します" },
];

const interviewQuestions = [
  "どんな業務で、何に困っていましたか？（AI導入前の状況）",
  "どのAIツールを、どう使いましたか？（使ったプロンプトや手順があれば）",
  "どれくらい効果がありましたか？（時間・件数などの数字で分かる範囲）",
  "うまくいかなかったこと・つまずいたことは？",
  "これから始める人へのアドバイスをひとこと",
];

export default function InterviewsPage() {
  const [selectedArticle, setSelectedArticle] = useState<InterviewArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    return initialInterviewArticles.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchName = item.interviewee.toLowerCase().includes(q);
        const matchDept = item.dept.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchTag = item.tag.toLowerCase().includes(q);
        return matchTitle || matchName || matchDept || matchSummary || matchTag;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyPrompt = (id: string, text: string) => {
    playCyberSuccess();
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const handleOpenArticle = (art: InterviewArticle) => {
    playCyberOpen();
    setSelectedArticle(art);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* ヒーローヘッダー */}
      <div className="w-full relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white py-14 sm:py-20 px-4 border-b border-slate-800 shadow-lg">
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
            現場のAI活用インタビュー
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            社内の第一線でAIツールを実践導入しているエンジニア・現場リーダーの「リアルな生の声」「直面した壁」「乗り越え方」を共有します。
          </p>
        </div>
      </div>

      <OfficeHourBanner />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* 取材立候補案内バナー */}
        <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-2xl">
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-indigo-700/50">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30">
                  取材大募集中
                </span>
                <span className="text-xs text-slate-300 font-medium">次回インタビューの主役はあなたです！</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                あなたのチームのAI活用事例や時短ワザを社内に共有しませんか？
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                「自作プロンプトで作業を時短した」「Antigravityを導入してみた」など、小さな工夫でも大歓迎です。所要30分でAI推進担当が取材・記事化をサポートします。
              </p>
            </div>
            <button
              onClick={() => {
                playCyberOpen();
                setIsSubmitModalOpen(true);
              }}
              onMouseEnter={() => playCyberHover()}
              className="shrink-0 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20 transition-all flex items-center space-x-1.5 self-start sm:self-center cursor-pointer active:scale-95"
            >
              <PlusCircle size={16} />
              <span>取材に立候補する</span>
            </button>
          </div>
        </TiltCard>

        {/* 検索 & カテゴリフィルター */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="氏名、部署名、活用ツール、キーワードで記事を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 text-[11px] shrink-0">
              <Filter size={12} />
              部門:
            </span>
            <button
              onClick={() => {
                playCyberClick();
                setSelectedCategory("all");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs shrink-0 ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              すべて ({initialInterviewArticles.length})
            </button>
            <button
              onClick={() => {
                playCyberClick();
                setSelectedCategory("dev");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs shrink-0 ${
                selectedCategory === "dev"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              開発・エンジニアリング (1)
            </button>
            <button
              onClick={() => {
                playCyberClick();
                setSelectedCategory("sales");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs shrink-0 ${
                selectedCategory === "sales"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              営業・CS (1)
            </button>
            <button
              onClick={() => {
                playCyberClick();
                setSelectedCategory("corp");
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs shrink-0 ${
                selectedCategory === "corp"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              コーポレート・総務 (1)
            </button>
          </div>
        </div>

        {/* 記事一覧 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>実践インタビュー記事一覧</span>
            </h3>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              該当 {filteredArticles.length} / 全 {initialInterviewArticles.length} 件
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {filteredArticles.map((article) => (
              <TiltCard key={article.id} maxTilt={3} glareOpacity={0.05} className="rounded-2xl">
                <SpotlightCard className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-5">
                    {/* 左側：イニシャルアイコン & 基本情報 */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${article.initialBg} text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0`}
                      >
                        {article.initial}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-600">
                            {article.sectionTitle}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${article.tagColor}`}>
                            {article.tag}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                            <Calendar size={11} />
                            {article.date}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {article.title}
                        </h4>

                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium pt-0.5">
                          <span className="flex items-center gap-1 text-slate-700 font-bold">
                            <User size={13} className="text-indigo-600" />
                            {article.interviewee}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Building size={13} className="text-slate-400" />
                            {article.dept}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 右側：成果指標バッジ */}
                    <div className="w-full md:w-auto p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 shrink-0">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp size={12} />
                        実感している定量的効果
                      </span>
                      <p className="text-xs font-bold text-emerald-950">
                        {article.metrics}
                      </p>
                    </div>
                  </div>

                  {/* サマリー & アクション */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 max-w-2xl">
                      {article.summary}
                    </p>

                    <button
                      onClick={() => handleOpenArticle(article)}
                      className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      <span>インタビューを読む</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </SpotlightCard>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* 取材キット：流れと質問項目 */}
        <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-2xl">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>取材から公開までの流れ</span>
              </h3>
              <ol className="space-y-2">
                {interviewFlow.map((f, i) => (
                  <li key={f.step} className="flex items-start gap-2.5 text-xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
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
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>取材でお聞きすること（所要30分）</span>
                </h3>
                <button
                  type="button"
                  onMouseEnter={() => playCyberHover()}
                  onClick={() => {
                    const sheetText = [
                      "【AI活用インタビュー 事前アンケート雛形】",
                      "1. お名前 / ご所属:",
                      "2. どんな業務で、何に困っていましたか？（AI導入前の状況）:",
                      "3. どのAIツールを、どう使いましたか？（使ったプロンプトや手順）:",
                      "4. どれくらい効果がありましたか？（時間短縮・作業削減など数字で分かる範囲）:",
                      "5. うまくいかなかったこと・つまずいた点:",
                      "6. これから始める社員へのアドバイス:",
                    ].join("\n");
                    navigator.clipboard.writeText(sheetText);
                    playCyberSuccess();
                    setCopiedPromptId("sheet");
                    setTimeout(() => setCopiedPromptId(null), 2000);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  {copiedPromptId === "sheet" ? (
                    <>
                      <Check size={12} className="text-emerald-600" />
                      <span className="text-emerald-600 font-bold">コピー完了</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>質問シートをコピー</span>
                    </>
                  )}
                </button>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                {interviewQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        </TiltCard>

        {/* 運用ステータス案内 */}
        <UnderConstructionAlert
          statusType="draft"
          title="📋 現場のAI活用インタビュー（先行実践事例 公開中）"
          message="社内の先行実践チーム（開発DX、営業CS、バックオフィス）のモデル事例を掲載しています。あなたのチームの実践知もぜひお聞かせください！"
        />
      </div>

      {/* 記事詳細スライドモーダル */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                playCyberClick();
                setSelectedArticle(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* スライドヘッダー */}
            <div
              className={`rounded-2xl p-6 bg-gradient-to-r ${selectedArticle.slideTheme.bgGradient} text-white space-y-3 shadow-lg`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {selectedArticle.sectionTitle}
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {selectedArticle.date} 取材
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold leading-snug">
                {selectedArticle.slideTheme.catchphrase}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed opacity-90">
                {selectedArticle.slideTheme.subCatchphrase}
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs border-t border-white/20">
                <span className="font-bold">{selectedArticle.interviewee}</span>
                <span>/</span>
                <span>{selectedArticle.role}</span>
                <span>（{selectedArticle.dept}）</span>
              </div>
            </div>

            {/* ハイライト3点 */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-indigo-600" />
                <span>実践のハイライト</span>
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {selectedArticle.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Q&A 形式の本文 */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Quote className="w-4 h-4 text-indigo-600" />
                <span>インタビュー詳細</span>
              </h4>
              <div className="space-y-4">
                {selectedArticle.qna.map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                    <p className="text-xs font-bold text-slate-900 flex items-start gap-2">
                      <span className="text-indigo-600 font-extrabold">Q.</span>
                      <span>{item.q}</span>
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed pl-5 whitespace-pre-wrap">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 実践プロンプトテンプレート */}
            {selectedArticle.promptTemplate && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-600" />
                    <span>{selectedArticle.promptTemplate.title}</span>
                  </h4>
                  <button
                    onClick={() =>
                      handleCopyPrompt(
                        selectedArticle.id,
                        selectedArticle.promptTemplate!.content
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors"
                  >
                    {copiedPromptId === selectedArticle.id ? (
                      <>
                        <Check size={13} className="text-emerald-600" />
                        <span className="text-emerald-600">コピー完了</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>プロンプトをコピー</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap border border-slate-800">
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
                onClick={() => {
                  playCyberClick();
                  setSelectedArticle(null);
                }}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 取材立候補モーダル */}
      <InterviewCandidateModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
}
