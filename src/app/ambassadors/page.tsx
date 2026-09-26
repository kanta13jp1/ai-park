"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import BookingModal from "@/components/BookingModal";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
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
  { label: "役割", text: "自チームのAI活用の相談役。困りごとを拾ってAI CoEにつなぎ、うまくいった工夫をAI Parkで共有する" },
  { label: "人数・任期", text: "各事業部から1名程度、任期は半年（第1期：2026年10月〜2027年3月）" },
  { label: "活動量の目安", text: "月2時間程度（月1回のアンバサダー会＋チーム内での相談対応）" },
  { label: "選び方", text: "自薦・他薦を受け付け、AI CoE と各事業部リーダーで相談して決定。専門資格やAI開発経験は不問" },
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

const initialAmbassadors: Ambassador[] = [
  {
    id: 1,
    name: "高橋 誠",
    dept: "クラウド基盤推進部",
    role: "Antigravity CoE テクニカルリード",
    avatarColor: "bg-blue-600 text-white",
    specialties: ["Google Antigravity", "Subagents並列実行", "MCPツール連携", "Terraform"],
    recentAchievement: "インフラ自動プロビジョニング用MCPサーバーを開発し全社展開中",
    availableTopics: ["CLI/IDE環境構築", "カスタムMCPサーバー作成", "破壊的操作防止ルール設定"],
    isModel: true,
    slackHandle: "#ask-coe-takahashi",
  },
  {
    id: 2,
    name: "佐藤 恵美",
    dept: "DXソリューション部",
    role: "業務自動化推進アンバサダー",
    avatarColor: "bg-purple-600 text-white",
    specialties: ["プロンプトエンジニアリング", "Gemini 3.1 Pro", "Document AI", "業務フロー改善"],
    recentAchievement: "調達見積書のPDF自動抽出・比較AIエージェントのPoCを主導",
    availableTopics: ["非エンジニア向けプロンプト作成", "PDF・画像解析", "議事録自動化"],
    isModel: true,
    slackHandle: "#ask-coe-sato",
  },
  {
    id: 3,
    name: "田中 健一",
    dept: "品質保証・セキュリティ統括部",
    role: "AIガバナンス & 安全利用アンバサダー",
    avatarColor: "bg-emerald-600 text-white",
    specialties: ["社内AI利用規約", "機密情報保護", "データマスキング", "著作権・ライセンス"],
    recentAchievement: "全社向け「生成AI利用セキュリティチェックシート」の策定と運用自動化",
    availableTopics: ["社内データ取扱い可否", "商用利用リスク", "外部API連携審査"],
    isModel: true,
    slackHandle: "#ask-coe-tanaka",
  },
  {
    id: 4,
    name: "鈴木 大樹",
    dept: "システム開発第一部 (ECプラットフォーム)",
    role: "プロダクト開発AI推進アンバサダー",
    avatarColor: "bg-amber-600 text-white",
    specialties: ["Next.js / TypeScript", "Playwright自動テスト", "コード自動レビュー", "Skills開発"],
    recentAchievement: "プルリクエスト自動レビューAgentをチームに導入しレビュー時間を半減",
    availableTopics: ["フロントエンドAI駆動開発", "E2Eテスト自動生成", "自作Skillの配布"],
    isModel: true,
    slackHandle: "#ask-coe-suzuki",
  },
  {
    id: 5,
    name: "中村 陽子",
    dept: "データソリューション部",
    role: "データ分析 & BQ推進アンバサダー",
    avatarColor: "bg-cyan-600 text-white",
    specialties: ["BigQuery", "SQL最適化", "Vertex AI", "Python / pandas"],
    recentAchievement: "BigQuery SQL自動最適化Skillを作成し社内カタログにて公開",
    availableTopics: ["大量データ高速集計", "BQコスト削減", "データ分析自動化"],
    isModel: true,
    slackHandle: "#ask-coe-nakamura",
  },
  {
    id: "6" as any,
    name: "渡辺 翔太",
    dept: "SRE推進室",
    role: "障害対応 & 運用自動化アンバサダー",
    avatarColor: "bg-rose-600 text-white",
    specialties: ["オブザーバビリティ", "ログ解析Agent", "Slack Bot", "障害復旧支援"],
    recentAchievement: "システム障害時のログ自動要約Botを社内Slackへ導入",
    availableTopics: ["アラート自動解析", "Datadog / Cloud Logging連携", "オンコール自動化"],
    isModel: true,
    slackHandle: "#ask-coe-watanabe",
  },
];

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
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>(initialAmbassadors);
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
          title="📋 公募準備中・モデルプロフィール掲載中"
          message="掲載中のアンバサダーは「モデル（架空）」のプロフィールです。第1期の応募受付を開始しました（応募は AI CoE に通知されます）。選定・正式登録と相談窓口の開設を準備中です。"
          prepDetails="社内アンバサダー選定基準の策定および各事業部からの公募受付フェーズ"
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
            onClick={() => setIsApplyModalOpen(true)}
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
                onClick={() => setSelectedCategory(cat)}
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
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 space-y-2">
            <p className="text-sm font-semibold">該当するアンバサダーが見つかりませんでした。</p>
            <p className="text-xs text-slate-400">検索条件を変更するか、右上の「アンバサダーに応募する」からご参加ください。</p>
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
                自チームのAI推進をリードし、全社CoEと連携して知見やSkillsを共有するアンバサダーを募集しています。専門資格や高度なAI開発経験は不問です。
              </p>
            </div>

            {appliedSuccess ? (
              <div className="py-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="font-bold text-emerald-950 text-base">応募フォームを開きました</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  別タブで開いた GitHub の画面で「Submit new issue」を押すと応募が完了し、AI CoE に通知が届きます。
                  選定後、AI CoE から Google Chat でご連絡します。
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

                <p className="text-slate-500 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                  「アンバサダーに応募する」を押すと入力内容が入った GitHub Issue の画面が開きます。応募内容は公開されるため、社外秘の情報は書かないでください。
                </p>

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
