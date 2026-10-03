"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import BookingModal from "@/components/BookingModal";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import { playCyberClick, playCyberHover, playCyberOpen } from "@/lib/sound";
import {
  Users,
  Sparkles,
  MessageCircle,
  Search,
  Filter,
  CheckCircle2,
  Send,
  X,
  Building,
  UserPlus,
  ExternalLink,
  Award,
} from "lucide-react";
import { useState } from "react";
import { GITHUB_REPO } from "@/lib/githubFeedback";

interface Ambassador {
  id: number;
  name: string;
  dept: string;
  role: string;
  avatarColor: string;
  specialties: string[];
  recentAchievement: string;
  availableTopics: string[];
  slackHandle: string;
  isModel?: boolean; // 公募選定前のモデルプロフィール（架空）。正式登録された実在メンバーは false
}

// 第1期アンバサダー制度（案）。社内決裁後に「案」を外す
const programDraft = [
  { label: "役割", text: "自チームのAI活用の相談役。困りごとを拾ってAI推進担当につなぎ、うまくいった工夫をAI Parkで共有する" },
  { label: "人数・任期", text: "各事業部から1名程度、任期は半年（第1期：2026年10月〜2027年3月）" },
  { label: "活動量の目安", text: "月2時間程度（月1回のアンバサダー会＋チーム内での相談対応）" },
  { label: "選び方", text: "自薦・他薦を受け付け、AI推進担当 と各事業部リーダーで相談して決定。専門資格やAI開発経験は不問" },
  { label: "相談窓口", text: "開設までは Office Hour と Google Chat の「AI勉強会」スペースで受け付け" },
];

function buildApplyIssueUrl(fields: { author: string; dept: string; specialty: string; motivation: string }) {
  const params = new URLSearchParams({
    template: "ambassador.yml",
    title: `[アンバサダー応募] ${fields.dept} ${fields.author}`,
    author: fields.author,
    dept: fields.dept,
    specialty: fields.specialty,
    motivation: fields.motivation,
  });
  return `https://github.com/${GITHUB_REPO}/issues/new?${params.toString()}`;
}

// 選定・正式登録が済んだ第1期アンバサダー
// 第1期アンバサダー（公募・選定準備中）
const initialAmbassadors: Ambassador[] = [];

const filterCategories = [
  "すべて",
  "Google Antigravity",
  "Subagents並列実行",
  "MCPツール連携",
  "プロンプトエンジニアリング",
  "社内AI利用規約",
  "Next.js / TypeScript",
  "BigQuery",
];

export default function AmbassadorsPage() {
  const [ambassadors] = useState<Ambassador[]>(initialAmbassadors);
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [searchQuery, setSearchQuery] = useState("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // 公募フォームステート
  const [applyName, setApplyName] = useState("");
  const [applyDept, setApplyDept] = useState("");
  const [applySpecialty, setApplySpecialty] = useState("");
  const [applyMotivation, setApplyMotivation] = useState("");

  // 応募は GitHub Issue フォーム（ambassador.yml）へ入力内容を引き継いで起票 → Google Chat に通知
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName || !applyDept) return;
    window.open(
      buildApplyIssueUrl({ author: applyName, dept: applyDept, specialty: applySpecialty, motivation: applyMotivation }),
      "_blank",
      "noopener,noreferrer"
    );
    setAppliedSuccess(true);
    setApplyName("");
    setApplyDept("");
    setApplySpecialty("");
    setApplyMotivation("");
  };

  const filteredAmbassadors = ambassadors.filter((amb) => {
    const matchesCategory =
      selectedCategory === "すべて" ||
      amb.specialties.some((s) => s.includes(selectedCategory));

    const matchesSearch =
      amb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amb.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amb.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amb.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      amb.availableTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="社内AIアンバサダー"
        subtitle="各事業部・開発チームでAI活用をリードする推進メンバーの紹介 & 相談窓口"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionAlert
          statusType="draft"
          title="📋 準備中：第1期アンバサダーを募集中です"
          message="各事業部のAI活用を牽引するアンバサダーは現在公募・選定準備中です。"
          prepDetails="自薦・他薦問わず、上の「アンバサダーに立候補する」ボタンからご応募いただけます。"
          releaseDate="2026年10月23日(金)"
        />

        {/* バナー: アンバサダー稼働中 */}
        <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-indigo-950">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-200/60 text-indigo-800 rounded-lg shrink-0 mt-0.5">
              <Award className="w-5 h-5 text-indigo-700" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-indigo-950 flex items-center space-x-1">
                  <span>🤝</span>
                  <span>第1期 社内AIアンバサダーネットワーク</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 border border-sky-300 text-sky-900 font-semibold text-[10px]">
                  📋 公募準備中
                </span>
              </div>
              <p className="text-indigo-900/90 leading-relaxed">
                自チームの技術スタックや業務内容に最も近いアンバサダーに、Google Chat や Office Hour を通じてAI活用・実装の相談ができるようにします。第1期の応募を受付中です。
              </p>
            </div>
          </div>
          <button
            onClick={() => { playCyberOpen(); setIsApplyModalOpen(true); }} onMouseEnter={() => playCyberHover()}
            className="shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-end sm:self-center"
          >
            <UserPlus size={14} />
            <span>アンバサダーに応募する</span>
          </button>
        </div>

        {/* 第1期 制度（案） */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-bold text-sm text-slate-900">第1期 AIアンバサダー制度</h3>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 self-start">
              📋 準備中：社内決裁前の案です
            </span>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            {programDraft.map((d) => (
              <div key={d.label} className="flex gap-2">
                <dt className="font-bold text-slate-700 shrink-0 w-24">{d.label}</dt>
                <dd className="text-slate-600 leading-relaxed">{d.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 検索 & フィルター */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="アンバサダー名、所属、得意技術で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => { playCyberClick(); setSelectedCategory(cat); }} onMouseEnter={() => playCyberHover()}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-xs font-semibold"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* アンバサダーグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAmbassadors.map((amb) => (
            <div
              key={amb.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* ヘッダー */}
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-12 h-12 rounded-xl ${amb.avatarColor} font-bold flex items-center justify-center shrink-0 text-sm shadow-xs`}
                  >
                    {amb.name.slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{amb.name}</h4>
                    {amb.isModel && (
                      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        📋 モデル（架空）
                      </span>
                    )}
                    <p className="text-xs text-slate-500">{amb.dept}</p>
                    <span className="inline-block mt-0.5 text-[11px] font-semibold text-blue-700">
                      {amb.role}
                    </span>
                  </div>
                </div>

                {/* 得意技術バッジ */}
                <div className="flex flex-wrap gap-1">
                  {amb.specialties.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* 実績ハイライト */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block">推進実績</span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {amb.recentAchievement}
                  </p>
                </div>

                {/* 相談可能テーマ */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 block">主な相談可能テーマ</span>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    {amb.availableTopics.map((topic, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition-colors border border-blue-200 text-center"
                >
                  Office Hourで相談
                </button>
                {!amb.isModel && (
                  <span
                    className="p-2 bg-slate-100 text-slate-700 rounded-lg"
                    title="Google Chat の「AI勉強会」スペースで声をかけてください"
                  >
                    <MessageCircle size={15} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAmbassadors.length === 0 && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-600 space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Users size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  第1期 社内AIアンバサダー 公募中
                </h4>
                <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                  アンバサダーは現在選定準備中です。各事業部・開発チームからAI活用を盛り上げてくださる推進メンバー（自薦・他薦問わず）をお待ちしています。
                </p>
              </div>
              <button
                onClick={() => { playCyberOpen(); setIsApplyModalOpen(true); }} onMouseEnter={() => playCyberHover()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <UserPlus size={14} />
                <span>アンバサダーに応募・立候補する</span>
              </button>
            </div>

            {/* アンバサダー参加の4大メリット */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>アンバサダー参加の4大メリット</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <SpotlightCard
                  spotlightColor="rgba(56, 189, 248, 0.2)"
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5"
                >
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    🚀 先行トライアル
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    最新のAIモデルや新規検証ツールの優先利用アカウントやPoC環境を先行提供します。
                  </p>
                </SpotlightCard>
                <SpotlightCard
                  spotlightColor="rgba(99, 102, 241, 0.2)"
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5"
                >
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    🤝 推進担当と直結
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    AI推進担当（梅澤）や各事業部のキーマンと月1回の定例会で最新知見を直接共有できます。
                  </p>
                </SpotlightCard>
                <SpotlightCard
                  spotlightColor="rgba(16, 185, 129, 0.2)"
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5"
                >
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    🎓 勉強会開催サポート
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    自チーム向けのハンズオンや勉強会を開く際、資料作成や進行を推進担当がバックアップします。
                  </p>
                </SpotlightCard>
                <SpotlightCard
                  spotlightColor="rgba(245, 158, 11, 0.2)"
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5"
                >
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    🏆 社内アピール
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    チームでの取り組みや工夫をAI Parkインタビューや全社報で紹介し、社内実績として可視化します。
                  </p>
                </SpotlightCard>
              </div>
            </div>
            {/* よくある質問 (FAQ) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span>よくある質問 (FAQ)</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                  <p className="font-bold text-slate-900">Q. プログラミングやAIの専門知識に自信がなくても応募できますか？</p>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    A. もちろん大歓迎です！文章作成、リサーチ、議事録要約など、業務効率化の工夫やチームメンバーの困りごとを拾い上げていただく役割ですので、専門資格や開発スキルは不要です。
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                  <p className="font-bold text-slate-900">Q. 業務との両立や拘束時間はどの程度ですか？</p>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    A. 月2時間程度（月1回のアンバサダー定例会 ＋ チーム内での簡単な質問受け付け）を想定しています。通常業務に支障が出ない範囲でご参加いただけます。
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                  <p className="font-bold text-slate-900">Q. 応募後の選考・決定フローはどうなりますか？</p>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    A. 応募後、AI推進担当（梅澤）と15分ほどのカジュアルなオンライン面談を行い、関心分野や活動内容のすり合わせを行った上で決定いたします。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* アンバサダー公募モーダル */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                MightyLINK AI 推進リーダー公募
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                AIアンバサダーへの参加応募
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                自チームのAI推進をリードし、AI推進担当と連携して知見やSkillsを共有するアンバサダーを募集しています。専門資格や高度なAI開発経験は不問です。
              </p>
            </div>

            {appliedSuccess ? (
              <div className="py-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="font-bold text-emerald-950 text-base">応募フォームを開きました</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  別タブで開いた GitHub の画面で「Submit new issue」を押すと応募が完了し、AI推進担当 に通知が届きます。
                  選定後、AI推進担当 から Google Chat でご連絡します。
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedSuccess(false);
                    setIsApplyModalOpen(false);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                >
                  閉じる
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      お名前 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例: 佐々木 拓也"
                      value={applyName}
                      onChange={(e) => setApplyName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      所属部署 / プロジェクト <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例: 基幹システム部"
                      value={applyDept}
                      onChange={(e) => setApplyDept(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    関心のある領域・得意な技術スタック
                  </label>
                  <input
                    type="text"
                    placeholder="例: Python, BigQuery, テスト自動化, プロンプト設計"
                    value={applySpecialty}
                    onChange={(e) => setApplySpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    自チームでやってみたいこと・志望動機
                  </label>
                  <textarea
                    rows={3}
                    placeholder="自チームの業務でAIを活用してみたい点や、アンバサダーとしてやってみたい活動をご記入ください。"
                    value={applyMotivation}
                    onChange={(e) => setApplyMotivation(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    「アンバサダーに応募する」を押すと、入力内容が入った GitHub Issue の起票画面が開きます。Issue 送信後、自動的に AI推進担当 に通知が届きます。
                  </p>
                  <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>GitHubアカウントをお持ちでない方:</span>
                    <a
                      href="https://mail.google.com/chat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-bold"
                    >
                      Google Chat（AI推進担当：梅澤）へ直接DM
                    </a>
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                  >
                    <Send size={13} />
                    <span>アンバサダーに応募する</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Office Hour 予約モーダル */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
