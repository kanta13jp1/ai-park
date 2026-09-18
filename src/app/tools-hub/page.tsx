"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import {
  Wrench,
  Terminal,
  Cpu,
  Database,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  PlusCircle,
  X,
  Send,
  Lock,
  Layers,
  Search,
} from "lucide-react";
import { useState } from "react";

interface AiTool {
  id: string;
  name: string;
  vendor: string;
  category: "コーディング" | "全社対話" | "高度分析" | "社内開発";
  status: "全社公認 (即時利用可)" | "申請制 (ライセンス配布)" | "特定PJ限定";
  securityLevel: "Level 1: 社内機密OK" | "Level 2: マスキング必須" | "Level 3: 公開情報のみ";
  recommendedFor: string;
  licenseGuide: string;
  link: string;
}

const authorizedTools: AiTool[] = [
  {
    id: "antigravity",
    name: "Google Antigravity (IDE / CLI)",
    vendor: "Google DeepMind",
    category: "コーディング",
    status: "全社公認 (即時利用可)",
    securityLevel: "Level 1: 社内機密OK",
    recommendedFor: "自律並列サブエージェント開発、テスト自動化、Skills/Rulesによる規約遵守開発",
    licenseGuide: "社内エンジニア全員に標準配布。agy コマンドで即座に利用可能。",
    link: "/guide",
  },
  {
    id: "gemini-enterprise",
    name: "Gemini Enterprise (Web / Workspace)",
    vendor: "Google Cloud",
    category: "全社対話",
    status: "全社公認 (即時利用可)",
    securityLevel: "Level 1: 社内機密OK",
    recommendedFor: "Gmail/Drive連携要約、文書ドラフト、会議議事録作成、マルチモーダル画像解析",
    licenseGuide: "全社員のGoogle Workspaceアカウントに標準付与済み。",
    link: "/antigravity-info",
  },
  {
    id: "gemini-code-assist",
    name: "Gemini Code Assist",
    vendor: "Google Cloud",
    category: "コーディング",
    status: "全社公認 (即時利用可)",
    securityLevel: "Level 1: 社内機密OK",
    recommendedFor: "VS Code / IntelliJ 内でのリアルタイムコード補完、ユニットテスト生成",
    licenseGuide: "開発者ポータルより拡張機能をインストールして社内SSOログイン。",
    link: "/guide",
  },
  {
    id: "claude-sonnet",
    name: "Claude 3.5 Sonnet (Vertex AI経由)",
    vendor: "Anthropic / GCP",
    category: "高度分析",
    status: "申請制 (ライセンス配布)",
    securityLevel: "Level 2: マスキング必須",
    recommendedFor: "長文仕様書の整合性検証、複雑なロジック設計、高度なアーキテクチャ検討",
    licenseGuide: "プロジェクト単位での利用申請が必要（下記申請フォームより）。",
    link: "#apply",
  },
  {
    id: "chatgpt-enterprise",
    name: "ChatGPT Enterprise",
    vendor: "OpenAI",
    category: "全社対話",
    status: "特定PJ限定",
    securityLevel: "Level 2: マスキング必須",
    recommendedFor: "特定の顧客向け実証実験（PoC）、GPTsによる独自業務アプリ検証",
    licenseGuide: "DX推進部による個別審査制。",
    link: "#apply",
  },
];

const internalUtilities = [
  {
    title: "セキュア画像・ログ自動マスキングツール",
    category: "セキュリティ",
    desc: "プロンプトに入力する前のエラーログや画面キャプチャから、個人名・IP・パスワードをブラウザ側で自動黒塗り・置換するユーティリティ。",
    status: "公開中",
    link: "#",
  },
  {
    title: "MightyLINK 共通プロンプトライブラリ",
    category: "プロンプト集",
    desc: "仕様書レビュー、バグ報告チケット起票、テスト仕様書生成など部署内で検証済みの高精度プロンプトテンプレート集。",
    status: "公開中",
    link: "/idea-board",
  },
  {
    title: "Antigravity 社内共通SDK (TypeScript/Python)",
    category: "SDK・ライブラリ",
    desc: "社内DBやSlackへ安全に接続するカスタムMCPサーバーを手軽に作成できる公式スターターキットリポジトリ。",
    status: "公開中",
    link: "/mcp-hub",
  },
];

export default function ToolsHubPage() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedToolForApply, setSelectedToolForApply] = useState<string>("Claude 3.5 Sonnet (Vertex AI経由)");
  const [applicantName, setApplicantName] = useState("");
  const [applicantDept, setApplicantDept] = useState("");
  const [purpose, setPurpose] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantDept || !agreed) {
      alert("必須項目および利用規約への同意を確認してください。");
      return;
    }

    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setIsApplyModalOpen(false);
      setApplicantName("");
      setApplicantDept("");
      setPurpose("");
      setAgreed(false);
      alert("AIツールの利用申請を受け付けました！1〜2営業日以内にライセンス発行のご案内をお送りします。");
    }, 1800);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="AI Tools Hub"
        subtitle="MightyLINK 社内公認AIツール・セキュリティ基準・自作ユーティリティ集積地"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {/* バナー */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-emerald-200/60 text-emerald-800 rounded-lg shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-emerald-950 flex items-center space-x-1">
                  <span>📍</span>
                  <span>公認 AI Tools Hub & 申請フロー公開中</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-semibold text-[10px]">
                  Phase 3 機能稼働
                </span>
              </div>
              <p className="text-emerald-800/90 leading-relaxed">
                社内で承認されている各AIツールのセキュリティ区分、利用推奨ユースケース、および新規ライセンス申請手順をまとめています。
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-end sm:self-center"
          >
            <PlusCircle size={14} />
            <span>ツール利用申請を行う</span>
          </button>
        </div>

        {/* セキュリティマトリクス基準表 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span>社内データ取り扱いセキュリティ基準 (早見表)</span>
            </h3>
            <span className="text-xs text-slate-400">セキュリティ統括 CoE 監修</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Level 1: 社内機密・コード入力可</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                対象: <strong>Antigravity, Gemini Enterprise</strong><br />
                エンタープライズ契約により入力データがモデル学習に使用されないことが法的に保証されています。社内ソースコードや設計書の投入が可能です。
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 font-bold">
                <AlertTriangle size={16} className="text-amber-600" />
                <span>Level 2: マスキング必須</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                対象: <strong>Claude 3.5 (Vertex経由), ChatGPT Enterprise</strong><br />
                個人情報（氏名、電話番号等）や特定顧客の識別情報は必ずマスキングツールで秘匿化した上で入力してください。
              </p>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
              <div className="flex items-center space-x-2 text-rose-800 font-bold">
                <XCircle size={16} className="text-rose-600" />
                <span>Level 3: 一般公開情報のみ</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                対象: <strong>個人アカウントの無料AIツール</strong><br />
                社内規程により、業務における個人アカウントのChatGPT等の利用は厳禁です。必ず本ポータル公認の社内アカウントをご利用ください。
              </p>
            </div>
          </div>
        </div>

        {/* 公認ツール一覧グリッド */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span>社内公認AIツール・プラットフォーム一覧</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {authorizedTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {tool.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {tool.vendor}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{tool.name}</h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        tool.securityLevel.includes("Level 1")
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {tool.securityLevel}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <span className="font-semibold text-slate-700 block">推奨ユースケース:</span>
                    <p className="leading-relaxed">{tool.recommendedFor}</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">利用資格・ライセンス: </span>
                    <span>{tool.licenseGuide}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-slate-500">{tool.status}</span>
                  {tool.link.startsWith("/") ? (
                    <a
                      href={tool.link}
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-bold"
                    >
                      <span>ガイドを見る</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedToolForApply(tool.name);
                        setIsApplyModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-200 transition-colors"
                    >
                      利用申請する
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 社内開発ユーティリティ集 */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-purple-600" />
            <span>社内開発AIユーティリティ & プロンプトライブラリ</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {internalUtilities.map((util, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    {util.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2 mb-1">
                    {util.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{util.desc}</p>
                </div>
                <a
                  href={util.link}
                  className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center space-x-1"
                >
                  <span>ツールを開く →</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ツール利用申請モーダル */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                アカウント申請
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                AIツール利用ライセンス申請
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                社内規定に基づき、個別ライセンス発行およびAPIキーの配布申請を行います。
              </p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">申請対象ツール</label>
                <select
                  value={selectedToolForApply}
                  onChange={(e) => setSelectedToolForApply(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Claude 3.5 Sonnet (Vertex AI経由)">Claude 3.5 Sonnet (Vertex AI経由)</option>
                  <option value="ChatGPT Enterprise">ChatGPT Enterprise</option>
                  <option value="Google Antigravity Enterprise拡張枠">Google Antigravity Enterprise拡張枠</option>
                  <option value="Gemini Code Assist 個別開発枠">Gemini Code Assist 個別開発枠</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    申請者氏名 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例: 佐々木 隆"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    所属部署 / PJ名 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例: クラウド基盤推進部"
                    value={applicantDept}
                    onChange={(e) => setApplicantDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">利用目的・対象業務</label>
                <textarea
                  rows={3}
                  placeholder="どのような業務で利用するか、想定する効果などを簡単にご記入ください。"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-700 leading-snug">
                    【誓約】MightyLINK 社内AI利用規程に則り、未マスキングの個人情報や特定秘密を入力せず、適切な目的のみに利用することを誓約します。
                  </span>
                </label>
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <Send size={13} />
                  <span>申請を送信する</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
