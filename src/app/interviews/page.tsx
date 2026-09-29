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
  { step: "立候補", desc: "下のボタンから立候補（GitHub Issue）。AI推進担当 に通知が届きます" },
  { step: "日程調整", desc: "AI推進担当 編集部から連絡し、30分の取材枠を調整（オンライン可）" },
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

// 実際に取材し、本人と上長の原稿確認が済んだ記事だけを追加する
const interviewArticles: InterviewArticle[] = [];

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
          title="📋 準備中：取材を始める準備をしています"
          message="インタビュー記事はまだありません。取材の立候補を受け付けています。"
          prepDetails="下の「取材に立候補する」から応募すると AI推進担当に通知されます"
          releaseDate="2026年10月16日(金)"
        />

        {/* 取材立候補案内バナー */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-indigo-700/50">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30">
                取材募集中
              </span>
              <span className="text-xs text-slate-300">次回インタビューの主役はあなたです！</span>
            </div>
            <h3 className="text-base font-bold text-white">
              あなたのチームのAI活用事例や工夫を社内ポータルに掲載しませんか？
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              「自作プロンプトで作業を時短した」「Antigravityを導入してみた」など、小さな工夫でも大歓迎です。AI推進担当が取材・記事化をサポートします。
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
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">🎤 取材でお聞きすること（所要30分）</h3>
              <button
                type="button"
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
            <p className="text-[11px] text-slate-500">
              準備は不要です。質問シートをコピーして事前メモに活用いただいても、当日の手ぶらインタビューでも問題ありません。顧客名等は伏せ字処理します。
            </p>
          </div>
        </div>

        {/* 連載インタビュー一覧（参考サイト再現：通し番号見出し ＋ 2カラムメディアカード） */}
        <div className="space-y-8">
          {interviewArticles.length === 0 && (
            <div className="space-y-4">
              {/* 第1弾 企画中ティザーカード */}
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/50 p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold">
                      企画・執筆中
                    </span>
                    <span className="text-xs font-bold text-indigo-900">
                      第1弾インタビュー予告
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    2026年10月16日(金) 公開予定
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    「Antigravityで挑む社内開発の自動化とプロトタイピング超速検証（仮）」
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    DX推進・開発チームにおけるAntigravity導入と、Subagents / スラッシュコマンドを活用した実装検証のリアルな試行錯誤を総力取材中。原稿確認完了後に正式公開いたします。
                  </p>
                </div>

                <div className="pt-2 border-t border-indigo-100/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    ※社内機密・顧客データ等の確認が完了した記事から順次掲載されます
                  </span>
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="text-indigo-600 hover:text-indigo-700 font-bold inline-flex items-center gap-1 text-xs"
                  >
                    <span>あなたのチームも取材を受けませんか？</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center text-slate-500 space-y-1">
                <p className="text-xs font-bold text-slate-700">📋 正式記事は本人・上長確認が完了次第掲載されます</p>
                <p className="text-[11px]">自薦・他薦問わず、小さな工夫でもお気軽にご応募ください。</p>
              </div>
            </div>
          )}
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
                チーム内で試して効果があったAI活用の工夫やエピソードをお寄せください。AI推進担当が取材・記事化します。
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

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  「立候補を送信」を押すと、入力内容が入った GitHub Issue の起票画面が開きます。Issue 送信後、自動的に AI推進担当 に通知が届き、日程調整のご連絡を差し上げます。
                </p>
                <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>GitHubアカウントをお持ちでない方:</span>
                  <a
                    href="https://mail.google.com/chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Google Chat（AI推進担当：梅澤）へ直接DM
                  </a>
                </div>
              </div>

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
