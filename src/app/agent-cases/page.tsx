"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import BookingModal from "@/components/BookingModal";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import {
  Bot,
  Cpu,
  GitBranch,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code2,
  Zap,
  TrendingUp,
  PlusCircle,
  X,
  Send,
  Layers,
  FileText,
} from "lucide-react";
import { useState } from "react";

interface AgentCase {
  id: string;
  name: string;
  category: string;
  model: string;
  orchestration: string;
  impact: string;
  metrics: { label: string; value: string }[];
  description: string;
  architectureFlow: { step: string; detail: string }[];
  promptSnippet: string;
  status: "本番運用中" | "全社展開中" | "PoC検証完了";
}

const initialCases: AgentCase[] = [
  {
    id: "payment-error-diagnosis",
    name: "API決済・トランザクションエラー自動診断 Subagent",
    category: "障害対応 & SRE自動化",
    model: "Google Gemini 2.5 Pro",
    orchestration: "Antigravity 並列Subagent + Cloud Logging MCP",
    impact: "障害一次切り分け時間を 25分 → 2分 に短縮 (92% 削減)",
    metrics: [
      { label: "平均調査時間", value: "2分" },
      { label: "月間削減工数", value: "約 65 時間" },
      { label: "一次原因特定精度", value: "94.2%" },
    ],
    description:
      "決済APIやマイクロサービスのトランザクションエラー発生時、自律エージェントがCloud Loggingからエラーログを抽出し、DBスロークエリや外部接続タイムアウトなどの既知インシデントナレッジと照合。推定根本原因と推奨対処チケットを自動起票します。",
    architectureFlow: [
      { step: "1. 障害トリガー検知", detail: "Cloud MonitoringのアラートWebHookを受信" },
      { step: "2. ログ解析Subagent", detail: "Cloud Logging MCPを叩き、トレースIDに基づく分散ログを走査" },
      { step: "3. 過去ナレッジ照合Subagent", detail: "社内Notion/Confluenceの過去障害DBをベクトル検索" },
      { step: "4. 対処プラン生成 & 通知", detail: "Slack（#incident-room）へ原因と切り替え手順を即時投稿" },
    ],
    promptSnippet: `あなたは障害一次調査専門のSubagentです。
与えられた Trace ID から関連エラーログをCloud Logging MCP経由で取得し、
以下のフォーマットで原因と推奨アクションを報告してください。
1. エラー種別 (Timeout / NullPointer / RateLimit)
2. 影響ユーザー規模
3. 推奨復旧コマンドまたはロールバック手順`,
    status: "全社展開中",
  },
  {
    id: "procurement-pdf-analyzer",
    name: "社内調達・見積書マルチモーダル自動突合エージェント",
    category: "業務自動化 & DX",
    model: "Gemini 2.5 Flash / Document AI",
    orchestration: "Antigravity Workflow + Google Drive MCP",
    impact: "月間 160件 の見積突合作業を完全自動化 (月40時間削減)",
    metrics: [
      { label: "突合処理時間", value: "1件あたり 8秒" },
      { label: "OCR読取精度", value: "99.1%" },
      { label: "コスト削減率", value: "従来比 80% 減" },
    ],
    description:
      "仕入先から届くPDF見積書や仕様書をGoogle Drive経由で取得し、品名・型番・数量・単価をOCR抽出。過去の契約履歴マスターや市場参考価格と自動照合し、単価乖離や数量不整合をハイライトした承認申請ドラフトを作成します。",
    architectureFlow: [
      { step: "1. 見積書PDFアップロード", detail: "指定のGoogle Drive共有フォルダに格納" },
      { step: "2. マルチモーダル抽出", detail: "Gemini 2.5 Flashで表・非構造テキスト・手書き印影を高精度認識" },
      { step: "3. 過去契約DB突合", detail: "BigQuery上の購買履歴データと単価・納期を比較" },
      { step: "4. 承認レポート生成", detail: "乖離率アラート付きMarkdownレポートを稟議システムへ連携" },
    ],
    promptSnippet: `PDF画像内の品名、型番、単価、納期をJSON形式で抽出してください。
過去標準単価マトリクスと比較し、単価が10%以上乖離している項目には
"alert_flag: true" を付与し、その理由候補を出力してください。`,
    status: "本番運用中",
  },
  {
    id: "pr-auto-review-tester",
    name: "PR自動コードレビュー & Playwrightテスト生成Agent",
    category: "開発支援 & 品質向上",
    model: "Gemini 2.5 Pro / Antigravity CLI",
    orchestration: "GitHub Actions + Playwright Skill + Git MCP",
    impact: "レビュー手戻り 40% 削減、テスト網羅率 15% 向上",
    metrics: [
      { label: "PR一次レビュー時間", value: "即時 (30秒以内)" },
      { label: "セキュリティ指摘率", value: "100% (ゼロ漏れ)" },
      { label: "テストコード自動生成", value: "85%がそのまま採用" },
    ],
    description:
      "GitHubでプルリクエストが作成されるとAntigravityがバックグラウンドで起動。コーディング規約・セキュリティ脆弱性・破壊的操作（DROP TABLE等）のチェックを行い、不足しているE2Eテストコード（Playwright）を自動生成してPRに提案コミットします。",
    architectureFlow: [
      { step: "1. PRオープン検知", detail: "GitHub Actions runner が Antigravity CLI (agy) を起動" },
      { step: "2. 規約・セキュリティ検証", detail: "社内Rule (`accidental-data-loss-prevention`) を適用" },
      { step: "3. テスト生成Subagent", detail: "修正箇所に対するPlaywright E2E検証コードを合成" },
      { step: "4. レビューコメント投稿", detail: "修正案とテスト実行結果のスクリーンショットをPRに付与" },
    ],
    promptSnippet: `あなたはMightyLINKシニアQAエンジニアです。
PRの差分コード（diff）を解析し、エッジケースを検証するPlaywrightテストコードを作成してください。
また、SQLインジェクションやセキュリティ上の懸念点がないか精査してください。`,
    status: "全社展開中",
  },
];

export default function AgentCasesPage() {
  const [cases, setCases] = useState<AgentCase[]>(initialCases);
  const [selectedCase, setSelectedCase] = useState<AgentCase | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // 申請フォーム
  const [formName, setFormName] = useState("");
  const [formDept, setFormDept] = useState("");
  const [formModel, setFormModel] = useState("Gemini 2.5 Pro");
  const [formImpact, setFormImpact] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDept || !formImpact) {
      alert("必須項目を入力してください。");
      return;
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsSubmitModalOpen(false);
      setFormName("");
      setFormDept("");
      setFormImpact("");
      setFormDesc("");
      alert("事例の掲載申請を受け付けました！CoEにて内容を確認後、本ページへ掲載いたします。");
    }, 1800);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <HeroBanner
        title="AI Agent Cases"
        subtitle="MightyLINK 社内自律型AIエージェントの実装事例・アーキテクチャ設計パターン"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        <UnderConstructionAlert
          statusType="poc"
          title="🧪 PoC検証中・事例モデル掲載中"
          message="現在掲載されている自律Subagents構成図・削減時間実績は検証用モデルケースです。社内本番稼働環境での定量測定データ反映を進めています。"
          prepDetails="社内SRE/基盤チームでの本番エージェント稼働ログおよび定量効果の実測フェーズ"
          releaseDate="2026年10月30日(金)"
        />

        {/* バナー */}
        <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-indigo-950">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-200/60 text-indigo-800 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-indigo-700" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-indigo-950 flex items-center space-x-1">
                  <span>🟣</span>
                  <span>社内Subagents活用事例・設計パターン</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 border border-purple-300 text-purple-900 font-semibold text-[10px]">
                  🧪 PoC検証中
                </span>
              </div>
              <p className="text-indigo-900/90 leading-relaxed">
                単なるチャット利用にとどまらず、自律並列エージェント（Subagents）やMCPツール連携を組み込んだ社内導入事例と定量効果をまとめています。
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-end sm:self-center"
          >
            <PlusCircle size={14} />
            <span>自チームの事例を申請</span>
          </button>
        </div>

        {/* 事例カード一覧 */}
        <div className="space-y-6">
          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 hover:border-slate-300 transition-all"
            >
              {/* カードヘッダー */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shrink-0 mt-0.5">
                    <Bot size={22} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                        {c.category}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base md:text-lg">
                      {c.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start md:self-center">
                  <span className="text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border border-emerald-300/80 rounded-xl shadow-2xs">
                    {c.impact}
                  </span>
                </div>
              </div>

              {/* 概要 */}
              <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

              {/* メトリクス表示 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {c.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-center space-y-0.5"
                  >
                    <div className="text-[11px] text-slate-500 font-medium">{m.label}</div>
                    <div className="text-base font-bold text-slate-900">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* アーキテクチャフロー */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Cpu size={14} className="text-purple-600" />
                  <span>自律エージェントの処理フロー & 外部連携</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {c.architectureFlow.map((flow, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-purple-50/40 border border-purple-100 rounded-xl text-xs space-y-1"
                    >
                      <div className="font-bold text-purple-900 text-[11px] flex items-center space-x-1">
                        <span>{flow.step}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-snug">{flow.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* フッターアクション */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3 text-slate-500 text-[11px]">
                  <span>基盤モデル: <strong>{c.model}</strong></span>
                  <span>•</span>
                  <span>オーケストレーション: <strong>{c.orchestration}</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedCase(c)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Code2 size={13} />
                    <span>プロンプト設計を見る</span>
                  </button>
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-2xs flex items-center space-x-1"
                  >
                    <span>類似Agentの導入相談</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* プロンプト詳細モーダル */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                システムプロンプト設計パターン
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {selectedCase.name}
              </h3>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">プロンプト構成例</label>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {selectedCase.promptSnippet}
              </pre>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 space-y-1">
              <span className="font-bold">設計のポイント</span>
              <p className="text-blue-800 text-[11px] leading-relaxed">
                Subagentには出力フォーマットを厳密に定義し、外部ツールの呼び出し判断を明確化することで、ハルシネーション（誤診断）を防ぐプロンプト設計となっています。
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 事例掲載申請モーダル */}
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
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                事例共有
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                自チームのAI活用事例を申請する
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                プロジェクトで検証・開発したエージェントの事例を全社カタログへ掲載し、他チームへ横展開します。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  エージェント名 / 取り組みタイトル <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例: 会議議事録・ネクストアクション自動抽出Agent"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    所属チーム / 申請者 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例: 基盤推進部 / 加藤"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">利用基盤モデル</label>
                  <select
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Gemini 2.5 Pro">Gemini 2.5 Pro</option>
                    <option value="Gemini 2.5 Flash">Gemini 2.5 Flash</option>
                    <option value="Antigravity Subagents">Antigravity Subagents</option>
                    <option value="その他">その他</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  得られた効果・定量インパクト <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例: 月間調査時間を 30時間 削減、作業ミスゼロ化"
                  value={formImpact}
                  onChange={(e) => setFormImpact(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">エージェント概要・構成</label>
                <textarea
                  rows={3}
                  placeholder="どのような仕組みで自動化を行っているか、工夫した点などを簡潔にご記入ください。"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none leading-relaxed"
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <Send size={13} />
                  <span>事例を申請する</span>
                </button>
              </div>
            </form>
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
