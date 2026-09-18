"use client";

import OfficeHourBanner from "@/components/OfficeHourBanner";
import BookingModal from "@/components/BookingModal";
import {
  Cloud,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  BookOpen,
  ExternalLink,
  HelpCircle,
  ArrowRight,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useState } from "react";

export default function AwsInfoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // 本番環境（GitHub Pages: /ai-park）対応のベースパス
  const basePath = process.env.NODE_ENV === "production" ? "/ai-park" : "";

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const supportTopics = [
    {
      icon: Sparkles,
      iconColor: "text-amber-600 bg-amber-100",
      title: "Amazon Bedrock / 生成AI",
      desc: "Claude 3.5 Sonnet / Amazon Titan を用いた社内データ検索（RAG）、Knowledge Bases、Bedrock Agentsの構築ハンズオンや技術相談を提供します。",
      tag: "生成AI・LLM",
    },
    {
      icon: Cloud,
      iconColor: "text-blue-600 bg-blue-100",
      title: "AWSアカウント即時発行",
      desc: "プロジェクト専用のマルチアカウント申請、サンドボックス検証環境の即日プロビジョニング、IAM権限設定をスムーズに代行・支援します。",
      tag: "基盤・アカウント",
    },
    {
      icon: DollarSign,
      iconColor: "text-emerald-600 bg-emerald-100",
      title: "アーキテクチャ & コスト診断",
      desc: "サーバーレス（Lambda / Fargate）構成の最適化、S3ライフサイクル設計、無駄なリソースを削減する社内コスト削減レビューを実施します。",
      tag: "最適化・コスト",
    },
    {
      icon: ShieldCheck,
      iconColor: "text-indigo-600 bg-indigo-100",
      title: "セキュリティ & ガバナンス",
      desc: "MightyLINK標準のセキュリティチェックシート対応、個人情報・機密データ取扱基準、VPCエンドポイント等のセキュア通信設定をサポートします。",
      tag: "セキュリティ",
    },
  ];

  const articles = [
    {
      id: "bedrock-rag",
      tag: "ハンズオン",
      tagColor: "bg-amber-100 text-amber-800",
      date: "2026.09.15",
      title: "【社内実践】Amazon Bedrock Knowledge Bases による社内ドキュメント即時検索RAG構築ガイド",
      desc: "社内S3バケット内の業務マニュアルや規程PDFをOpenSearch Serverlessと連携させ、高精度な社内Q&Aボットを数時間で構築する完全手順です。",
    },
    {
      id: "governance-2026",
      tag: "ガイドライン",
      tagColor: "bg-blue-100 text-blue-800",
      date: "2026.09.01",
      title: "【2026年度版】社内AWS環境における機密データ取扱いルールと利用申請フロー",
      desc: "個人情報や社外秘情報を取り扱う際のマスキング必須要件と、承認プロセスの簡易化（即日サンドボックス提供）についての改定ポイントを解説。",
    },
    {
      id: "study-archive",
      tag: "勉強会録画",
      tagColor: "bg-purple-100 text-purple-800",
      date: "2026.08.28",
      title: "第12回 社内AWSもくもく会 & アーキテクチャ相談会 アーカイブ動画",
      desc: "Lambda SnapStartを活用したコールドスタート解消事例と、生成AIを活用したインフラIaCコード自動生成の実演セッションアーカイブです。",
    },
  ];

  const faqs = [
    {
      q: "クラウドやAWSの知識がほとんどない初歩的な段階でも相談できますか？",
      a: "もちろん大歓迎です！「自部署のこの業務をAWSや生成AIで自動化できるか知りたい」「何から勉強すればいいかわからない」といった構想段階の壁打ちとしてお気軽にご利用ください。",
    },
    {
      q: "Amazon Bedrock の検証利用料は各部署の予算付けが必要ですか？",
      a: "社内PoC支援枠が用意されており、初期のプロトタイプ検証・学習用途であればクラウド推進チームの共有予算枠で無償利用可能です。お気軽にご相談ください。",
    },
    {
      q: "相談会（Office Hour）は1名だけでも参加可能ですか？チーム参加もできますか？",
      a: "個人での1on1相談、チーム複数名での設計レビュー参加のどちらも対応しています。ご都合の良い形式でご予約ください。",
    },
    {
      q: "検証用AWSアカウントは申請からどのくらいで利用開始できますか？",
      a: "標準サンドボックス環境であれば、申請承認後、原則1〜2営業日以内に利用開始通知をお送りしています。",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* 1. AWSブランドカラー（ディープアンバー×ブロンズ光跡）ヒーローヘッダー */}
      <div className="relative w-full overflow-hidden flex items-center justify-center select-none shadow-md bg-gradient-to-r from-[#1c120c] via-[#2d1b0d] to-[#1a0f08] h-48 md:h-56">
        {/* 光跡・放射状グローエフェクト */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-48 bg-gradient-to-r from-amber-600 to-orange-500 rounded-full blur-3xl transform -rotate-12" />
          <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-36 bg-gradient-to-r from-yellow-500 to-amber-700 rounded-full blur-2xl transform rotate-6" />
        </div>

        {/* スピード感のある流線SVG */}
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
        >
          <path
            d="M-100,180 C300,120 700,240 1300,100"
            stroke="url(#awsGold)"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M-50,220 C350,160 750,280 1350,140"
            stroke="url(#awsOrange)"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            fill="none"
          />
          <path
            d="M0,80 C400,200 800,60 1200,180"
            stroke="url(#awsGold)"
            strokeWidth="2"
            fill="none"
          />
          <defs>
            <linearGradient id="awsGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="awsOrange" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* ヘッダータイトル */}
        <div className="relative z-10 text-center px-4 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide">
            <span>☁️ MightyLINK Cloud CoE</span>
            <span>•</span>
            <span>Amazon Bedrock & AWS活用</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
            AWS情報局
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/90 max-w-xl mx-auto font-medium">
            社内でのAWS活用・生成AI（Bedrock）導入支援・アーキテクチャ相談窓口
          </p>
        </div>
      </div>

      {/* 2. AI Office Hour 予約バー（参考サイト完全再現） */}
      <OfficeHourBanner />

      {/* 3. メインコンテンツエリア */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12 space-y-12">
        {/* ======================================================== */}
        {/* フィーチャーセクション: 社内名物エバンジェリスト カード */}
        {/* ======================================================== */}
        <section className="flex flex-col items-center">
          <div className="w-full max-w-md bg-[#faf7f0] border-2 border-[#e6decb] rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-900/5 text-center relative overflow-hidden">
            {/* 上部タグ */}
            <div className="inline-block px-3 py-1 rounded-full bg-[#ecdcc4] text-[#784d1b] text-[11px] font-bold tracking-wider mb-4 border border-[#debfa0]">
              MightyLINK AWS推進エバンジェリスト
            </div>

            {/* 写真フレーム（レトロクラシックなポートレート） */}
            <div className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-md border-4 border-white bg-slate-200 mb-3 group">
              <img
                src={`${basePath}/images/aws-evangelist.jpg`}
                alt="AWS推進エバンジェリスト 馬渕さん"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                <span className="text-white text-xs font-bold px-3 py-1 bg-black/60 backdrop-blur-xs rounded-full">
                  クラウド何でも相談役
                </span>
              </div>
            </div>

            {/* 参考サイト完全オマージュのアイコニックな注記 */}
            <p className="text-xs sm:text-sm font-bold text-slate-600 tracking-wide mb-4">
              ※馬渕さんへの許可は得ています
            </p>

            {/* エバンジェリスト名 & 役職 */}
            <div className="space-y-1 border-t border-[#e2d8c0] pt-4">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                馬渕 誠 <span className="text-sm font-normal text-slate-600">（まぶち まこと）</span>
              </h3>
              <p className="text-xs text-amber-800 font-semibold">
                クラウド推進部 / AWS Ambassadors & 生成AIリード
              </p>
            </div>

            {/* メッセージ吹き出し */}
            <div className="mt-4 p-4 rounded-2xl bg-white border border-[#e4dcce] shadow-2xs text-left">
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                「『AWSアカウントってどうやって申請するの？』『社内データでBedrockを使ってみたい！』『アーキテクチャの壁打ち相手になってほしい』など、初歩的な疑問から本番設計まで何でも気軽にお声がけください！」
              </p>
            </div>

            {/* アクションボタン */}
            <div className="mt-5 space-y-2">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer group"
              >
                <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>馬渕さんに個別相談する（Office Hour 予約）</span>
              </button>
              <div className="flex items-center justify-center space-x-3 text-[11px] text-slate-500 pt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>平日 10:00〜18:00 受付中（1回30分・オンライン）</span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4大サポート領域（AWS情報局でサポートできること） */}
        {/* ======================================================== */}
        <section className="space-y-5">
          <div className="flex items-center space-x-2.5 border-b border-slate-200 pb-3">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                AWS情報局でサポートできること
              </h2>
              <p className="text-xs text-slate-500">
                初歩的な使い方の相談から、社内生成AI活用、エンタープライズ統制まで幅広くカバー
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {supportTopics.map((topic, idx) => {
              const Icon = topic.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${topic.iconColor}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {topic.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {topic.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="text-amber-700 hover:text-amber-800 font-bold inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <span>このテーマで相談する</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 最新トピック・ナレッジ & ハンズオン資料 */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                AWS最新トピック & 社内ナレッジ
              </h2>
            </div>
            <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
              社内限定公開
            </span>
          </div>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            {articles.map((art) => (
              <div
                key={art.id}
                className="p-5 hover:bg-amber-50/40 transition-colors flex items-start justify-between group cursor-pointer"
                onClick={() => setModalOpen(true)}
              >
                <div className="space-y-1.5 pr-4">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${art.tagColor}`}
                    >
                      {art.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {art.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-700 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {art.desc}
                  </p>
                </div>
                <div className="shrink-0 mt-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-amber-100 text-slate-400 group-hover:text-amber-700 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* よくある質問 (FAQ) & 社内申請・窓口リンク */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* FAQ */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-base text-slate-900">
                よくある質問 (FAQ)
              </h3>
            </div>
            <div className="space-y-4 text-xs">
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="font-bold text-slate-900 flex items-start space-x-1.5">
                    <span className="text-amber-600 font-black">Q.</span>
                    <span>{faq.q}</span>
                  </p>
                  <p className="text-slate-600 pl-4 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 社内リンク & 窓口 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">
                  社内申請 & サポート窓口
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                <a
                  href="#it-service-desk"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("社内IT申請ポータル（ServiceNow）へ遷移します（社内SSO認証が必要です）");
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800 transition-all font-medium"
                >
                  <div className="flex items-center space-x-2">
                    <Cloud className="w-4 h-4 text-amber-600" />
                    <span>AWS アカウント即時発行申請（ServiceNow）</span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400" />
                </a>

                <a
                  href="#slack-support"
                  onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard("#proj-aws-support", 99);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800 transition-all font-medium"
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>Slack チャンネル: #proj-aws-support</span>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {copiedIndex === 99 ? "コピー完了！" : "コピー"}
                  </span>
                </a>

                <a
                  href="#cloud-guideline"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("MightyLINK クラウド利用・セキュリティ統制ガイドライン（社内Confluence）を開きます");
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800 transition-all font-medium"
                >
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>MightyLINK クラウド利用セキュリティ基準書</span>
                  </div>
                  <ExternalLink size={13} className="text-slate-400" />
                </a>
              </div>
            </div>

            {/* 下部Office Hour案内 */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5 mt-2">
              <p className="font-bold flex items-center space-x-1">
                <span>💡 申請前の事前相談も大歓迎</span>
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                「どのインスタンスやLLMモデルを選ぶべきかわからない」場合も、Office Hourで事前にアドバイザーと一緒に要件定義できます。
              </p>
            </div>
          </div>
        </div>

        {/* ページフッター注記 */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
            <span>MightyLINK AI Park: クラウド推進・AWS情報局 公式デスク</span>
          </div>
          <p className="text-[11px]">
            ※当コンテンツは社内専用です。無断転載および社外への共有はご遠慮ください。
          </p>
        </div>
      </div>

      {/* 予約モーダル */}
      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
