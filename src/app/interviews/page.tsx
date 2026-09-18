"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import {
  UserCheck,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Calendar,
  X,
  Send,
  Quote,
  TrendingUp,
  Clock,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";

interface InterviewArticle {
  id: string;
  title: string;
  interviewee: string;
  role: string;
  date: string;
  tag: string;
  tagColor: string;
  summary: string;
  metrics: string;
  qna: { q: string; a: string }[];
  advice: string;
}

const interviewArticles: InterviewArticle[] = [
  {
    id: "helpdesk-automation",
    title: "「月間40時間の問い合わせ対応を85%削減」Slack × Gemini によるヘルプデスク自動化の裏側",
    interviewee: "佐藤 恵美 氏",
    role: "DXソリューション部 課長代理",
    date: "2026.09.12",
    tag: "業務削減",
    tagColor: "bg-emerald-100 text-emerald-800",
    summary:
      "社内の各部署から殺到するPCトラブルやツール仕様の問い合わせ。Gemini Enterpriseと社内ナレッジベースを連携させ、回答ドラフトをSlackで自動生成する仕組みを構築した取り組みについて聞きました。",
    metrics: "問い合わせ一次対応時間 85% 削減 (月40時間 → 6時間)",
    qna: [
      {
        q: "導入前に最も課題に感じていたことは何ですか？",
        a: "過去に何度も同じ質問が寄せられているのに、担当者が都度過去のWikiやマニュアルを探して回答を手打ちしており、開発業務に集中できない時間が多かったことです。",
      },
      {
        q: "工夫したプロンプトやアーキテクチャのポイントは？",
        a: "単に回答させるだけでなく、『該当する社内マニュアルのURL』と『確信度』を必ず併記させました。確信度が低い場合は『CoE窓口にご案内します』とエスカレーションする安全設計にしています。",
      },
      {
        q: "チームメンバーの反応はどうでしたか？",
        a: "最初はAIの回答に半信半疑でしたが、回答ドラフトの精度が非常に高く、今ではチーム全員が『なくてはならない相棒』として活用しています。",
      },
    ],
    advice: "まずは『毎日10分使っている定型業務』を1つ選んでAIに任せてみることが成功への最短ルートです！",
  },
  {
    id: "sre-subagents",
    title: "「AIは監視オペレータの頼れる相棒」Antigravityの並列Subagentsが切り拓くSRE障害調査の自動化",
    interviewee: "高橋 誠 氏",
    role: "クラウド基盤推進部 テクニカルリード",
    date: "2026.08.28",
    tag: "現場DX & SRE",
    tagColor: "bg-purple-100 text-purple-800",
    summary:
      "マイクロサービスの大規模化に伴い、アラート発生時の分散ログ調査が属人化。Antigravityの自律型SubagentsとCloud Logging MCPを組み合わせ、障害一次切り分けをわずか2分で完結させる自動化を実現。",
    metrics: "障害原因の一次調査時間 25分 → 2分 (92% 短縮)",
    qna: [
      {
        q: "Subagents（並列エージェント）を採用した理由は？",
        a: "1つのプロンプトで『ログ検索』『ナレッジ照合』『影響シミュレーション』をすべてやらせるとタイムアウトや誤認が起きやすいため、専門役割を持つ複数のSubagentに並列分担させる構成が最適でした。",
      },
      {
        q: "苦労した点と克服方法は？",
        a: "MCP経由で取得するログ量が膨大になりトークンを圧迫した点です。Filter条件をルール化し、直近のエラーログと直前の正常ログの差分だけを渡す前処理を組み込みました。",
      },
    ],
    advice: "エージェントにすべてを丸投げするのではなく、明確な役割（Role）と境界（Guardrail）を与えることが鍵です。",
  },
  {
    id: "data-analysis-bigquery",
    title: "「SQLが書けなくても即座にデータ分析」BigQuery × Gemini で実現した全社データ民主化",
    interviewee: "中村 陽子 氏",
    role: "データソリューション部 シニアアナリスト",
    date: "2026.08.10",
    tag: "データ分析",
    tagColor: "bg-blue-100 text-blue-800",
    summary:
      "マーケティングや営業推進の非エンジニアメンバーが、自然言語で質問するだけでBigQueryから必要なデータを抽出し、SQLの最適化まで自動で行うワークフローを整備した実績をインタビュー。",
    metrics: "データ抽出依頼チケットの消化スピード 3倍向上",
    qna: [
      {
        q: "データ民主化において大切にしたことは？",
        a: "誰でもクエリを実行できるようにしつつ、PB単位の全件スキャンで莫大なクラウド費用が発生しないよう、社内Skill (`bigquery-sql-optimization`) でパーティション指定を強制したことです。",
      },
      {
        q: "今後の展望について教えてください。",
        a: "抽出したデータを元に、AIが施策提案や売上予測レポートまで自動でスライド化してくれる仕組みをCoEと共同で検証中です。",
      },
    ],
    advice: "データ構造を整えて適切なメタデータを付与しておけば、AIは世界で最も頼りになるデータアナリストになります。",
  },
];

export default function InterviewsPage() {
  const [selectedArticle, setSelectedArticle] = useState<InterviewArticle | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [candidateDept, setCandidateDept] = useState("");
  const [candidateTheme, setCandidateTheme] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !candidateDept) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsSubmitModalOpen(false);
      setCandidateName("");
      setCandidateDept("");
      setCandidateTheme("");
      alert("インタビューへの立候補ありがとうございます！CoE編集部より日程調整のご連絡を差し上げます。");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <HeroBanner
        title="社員インタビュー・活用事例集"
        subtitle="社内業務でAIツールを実践導入している社員の生の声・工夫・成果を共有します"
      />

      <div className="max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionAlert
          statusType="draft"
          title="📋 取材準備中・ドラフト事例モデル掲載"
          message="現在掲載されているインタビュー記事は、社内実務ユースケースに基づくモデルケース（ドラフト）です。正式な社内インタビューの取材・記事公開を順次準備しています。"
          prepDetails="社内各部署からの取材立候補を受付中（下の「取材に立候補する」ボタンより応募可能）"
          releaseDate="2026年10月16日(金)"
        />
        {/* バナー */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-emerald-200/60 text-emerald-800 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-emerald-950 flex items-center space-x-1">
                  <span>📰</span>
                  <span>現場のAI活用インタビュー記事を公開中</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-semibold text-[10px]">
                  現場の声
                </span>
              </div>
              <p className="text-emerald-800/90 leading-relaxed">
                実際にツールを活用して工数削減や品質向上を達成した社員の「リアルな工夫」「直面した壁」「乗り越え方」を掲載しています。
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-end sm:self-center"
          >
            <PlusCircle size={14} />
            <span>取材に立候補する</span>
          </button>
        </div>

        {/* 記事一覧 */}
        <div className="space-y-5">
          {interviewArticles.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.tagColor}`}>
                    {item.tag}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{item.date}</span>
                  </span>
                  <span className="text-xs text-slate-600 font-semibold">
                    | {item.interviewee} ({item.role})
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base md:text-lg leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>

                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <TrendingUp size={13} className="text-emerald-600" />
                  <span className="font-bold text-slate-800">{item.metrics}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedArticle(item)}
                className="shrink-0 inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start md:self-center"
              >
                <span>インタビューを読む</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 記事詳細モーダル */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-2 border-b border-slate-100 pb-4">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${selectedArticle.tagColor}`}>
                {selectedArticle.tag}
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-800">{selectedArticle.interviewee}</span>
                <span>（{selectedArticle.role}）</span>
                <span>•</span>
                <span>取材日: {selectedArticle.date}</span>
              </div>
            </div>

            {/* 定量効果バナー */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
              <div className="p-2 bg-emerald-500 text-white rounded-lg">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span className="text-[11px] text-emerald-800 font-bold">達成された定量成果</span>
                <div className="text-base font-black text-emerald-950">{selectedArticle.metrics}</div>
              </div>
            </div>

            {/* Q&Aセクション */}
            <div className="space-y-5 text-xs">
              {selectedArticle.qna.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-start space-x-2">
                    <span className="text-blue-600 font-black">Q.</span>
                    <span>{item.q}</span>
                  </h4>
                  <p className="text-slate-700 leading-relaxed pl-5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>

            {/* 先輩からのアドバイス */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs space-y-1.5 text-amber-950">
              <div className="font-bold flex items-center space-x-1.5 text-amber-900">
                <Quote size={15} className="text-amber-600" />
                <span>これから始める社員へのメッセージ</span>
              </div>
              <p className="text-amber-900/90 leading-relaxed pl-5 italic">
                「{selectedArticle.advice}」
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 取材立候補モーダル */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                />
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-colors flex items-center space-x-1.5"
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
