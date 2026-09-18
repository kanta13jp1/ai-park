"use client";

import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import {
  Bot,
  Cpu,
  BarChart3,
  TrendingUp,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle2,
  Users,
  Copy,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  Building,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

interface AgentCase {
  id: string;
  title: string;
  department: string;
  deptTag: string;
  author: string;
  reductionRate: number; // e.g. 96 (%)
  targetPeople: number; // e.g. 3 (人)
  frequency: string; // e.g. "年間12回実施"
  tool: string;
  toolBadgeColor: string;
  gradientBg: string;
  impactSummary: string;
  problem: string;
  flowSteps: { step: string; detail: string }[];
  promptSnippet: string;
  date: string;
}

const initialCases: AgentCase[] = [
  {
    id: "release-email-agent",
    title: "リリース作業予定/開始/終了 メール自動生成Agent",
    department: "クラウド基盤推進部",
    deptTag: "クラウド基盤",
    author: "鈴木 誠",
    reductionRate: 96,
    targetPeople: 3,
    frequency: "年間12回実施",
    tool: "Google Workspace Studio + Gemini",
    toolBadgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    gradientBg: "from-sky-950 via-slate-900 to-indigo-950",
    impactSummary: "リリース告知作成時間 45分 → 2分 に短縮 (96% 削減)",
    problem:
      "本番リリース作業前後の「事前予告・開始通知・完了報告」の社内通知メール作成において、作業項目や関係者リストのコピペ・手動整形に毎回多大な時間と確認コストを要していた。",
    flowSteps: [
      { step: "1. リリースIssue検知", detail: "GitHubのReleaseマイルストーンおよびタグ作成をトリガーに起動" },
      { step: "2. 差分チェンジログ抽出", detail: "直前バージョンからのPR一覧・マージコミットをGeminiで要約" },
      { step: "3. 対象部署別案内文生成", detail: "開発者向け詳細と全社向け簡易サマリーの2系統の文面を生成" },
      { step: "4. Gmail下書き作成 & Slack通知", detail: "承認者へレビューリンクを通知しワンクリックで全社送信完了" },
    ],
    promptSnippet: `あなたはリリース告知専門のAIエージェントです。
以下のマージコミット一覧から、非エンジニア向けに分かりやすい「リリース作業完了通知」を作成してください。
【必須項目】
- 改善された機能の要約（箇条書き3点）
- ユーザー影響（計画停止なし / 画面リロード推奨）
- 不具合報告窓口（#proj-support）`,
    date: "2026.09.16",
  },
  {
    id: "weekly-summary-agent",
    title: "週報サマリー自動生成 Agent",
    department: "DXソリューション部",
    deptTag: "DX推進",
    author: "佐藤 恵美",
    reductionRate: 85,
    targetPeople: 2,
    frequency: "週次実施",
    tool: "Gemini 1.5 Pro + Slack Bolt",
    toolBadgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    gradientBg: "from-indigo-950 via-slate-900 to-purple-950",
    impactSummary: "週報作成・集約工数 120分 → 18分 に短縮 (85% 削減)",
    problem:
      "毎週金曜日にチームメンバー全員の日報やチケット更新履歴から進捗を取りまとめ、マネージャー陣へ提出する週次サマリー作成に毎週2時間を費やしていた。",
    flowSteps: [
      { step: "1. 週次ログ自動クローリング", detail: "Slackの分報チャンネルおよびJira完了チケットを金曜夕方に集約" },
      { step: "2. ネクストアクション抽出", detail: "「達成事項」「発生した課題・ブロッカー」「次週予定」を自動分類" },
      { step: "3. 週報Markdownレポート生成", detail: "チーム共通フォーマットで整形し、ConfluenceとSlackにドラフト作成" },
      { step: "4. リーダー確認 & 自動投稿", detail: "リーダーが微修正を承認すると部会チャンネルへ自動投稿" },
    ],
    promptSnippet: `今週のチーム活動ログ（Slack発言 & Jira更新）をもとに週次サマリーを作成してください。
【出力形式】
### 1. 主な成果・リリース完了項目
### 2. 現在発生している課題・依存関係
### 3. 次週のアクションアイテム（担当者明記）`,
    date: "2026.09.14",
  },
  {
    id: "account-onboarding-bot",
    title: "【アカウント/変更管理】起着任手続きチャットボット",
    department: "コーポレートIT・情シス",
    deptTag: "情シス",
    author: "吉野 明美",
    reductionRate: 75,
    targetPeople: 15,
    frequency: "月40件実施",
    tool: "Amazon Bedrock + Slack Bot",
    toolBadgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    gradientBg: "from-amber-950 via-slate-900 to-slate-950",
    impactSummary: "アカウント発行手続き時間 3営業日 → 即日 に短縮 (75% 削減)",
    problem:
      "新入社員や異動者のPCキッティング、Google Workspace/AWS/GitHubのアカウント付与申請が手動メール・個別申請で分散し、手続き遅延が多発していた。",
    flowSteps: [
      { step: "1. Slack対話式申請", detail: "申請者がスラッシュコマンドで所属・役職・必要権限を入力" },
      { step: "2. 権限マトリクス自動判定", detail: "社内セキュリティ基準と照合し、事前承認済み権限を即時判別" },
      { step: "3. IdP連携・グループ追加", detail: "Google Workspace & AWS IAM Identity Center APIを叩いて自動付与" },
      { step: "4. 初期設定ガイド送付", detail: "本人へパーソナライズされた初期ログイン手順書をDM送付" },
    ],
    promptSnippet: `新任スタッフの所属部署と担当プロジェクトから、必要なSlackチャンネル、GitHubチーム、AWSロールを判定してください。
未承認の特権アクセスが含まれる場合は、上長承認用ワークフローチケットを生成してください。`,
    date: "2026.09.10",
  },
  {
    id: "payment-error-diagnosis",
    title: "API決済・トランザクションエラー自動診断 Subagent",
    department: "SRE・運用自動化チーム",
    deptTag: "SRE",
    author: "高橋 誠",
    reductionRate: 92,
    targetPeople: 4,
    frequency: "障害発生時 (月15回)",
    tool: "Antigravity 並列Subagents",
    toolBadgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    gradientBg: "from-slate-950 via-emerald-950 to-slate-900",
    impactSummary: "障害一次切り分け時間 25分 → 2分 に短縮 (92% 削減)",
    problem:
      "決済APIやマイクロサービスのトランザクションエラー発生時、Cloud Loggingの分散ログ走査と既知インシデント照合に平均25分を要していた。",
    flowSteps: [
      { step: "1. 障害アラート受信", detail: "Cloud MonitoringのアラートWebHookを自律エージェントが検知" },
      { step: "2. 並列ログ走査Subagents", detail: "Trace IDに基づき複数サービスの分散エラーログを並列解析" },
      { step: "3. 既知障害DB照合", detail: "過去インシデントナレッジと照合し、根本原因と復旧コマンドを特定" },
      { step: "4. 障害対策室Slack投稿", detail: "#incident チャンネルへ原因と切り替え手順を即時レポート" },
    ],
    promptSnippet: `Trace IDから抽出されたエラーログを分析し、以下を報告してください。
1. エラー根本原因 (Timeout / NullPointer / DBデッドロック)
2. 影響ユーザー規模
3. 推奨暫定復旧コマンド`,
    date: "2026.09.05",
  },
  {
    id: "procurement-pdf-analyzer",
    title: "社内調達・見積書マルチモーダル自動突合エージェント",
    department: "基幹システム開発部",
    deptTag: "基幹・調達",
    author: "小林 健太",
    reductionRate: 80,
    targetPeople: 5,
    frequency: "月160件実施",
    tool: "Document AI + Gemini 2.5 Flash",
    toolBadgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
    gradientBg: "from-cyan-950 via-slate-900 to-blue-950",
    impactSummary: "見積突合作業 1件15分 → 8秒 (80% 削減、月40時間削減)",
    problem:
      "仕入先から届くPDF見積書や仕様書を手作業でExcel転記し、過去の契約履歴マスターや市場参考価格と照合する作業が月160件発生していた。",
    flowSteps: [
      { step: "1. Google Drive格納", detail: "見積書PDFが指定フォルダにアップロードされると自動検知" },
      { step: "2. 表・印影マルチモーダル認識", detail: "Gemini 2.5 Flashで品名・型番・数量・単価をOCR高精度抽出" },
      { step: "3. BigQuery過去契約照合", detail: "過去同一品目の単価推移と比較し、10%以上の乖離項目を検出" },
      { step: "4. 承認申請ドラフト作成", detail: "アラートフラグ付きMarkdownレポートを稟議システムへ連携" },
    ],
    promptSnippet: `見積書PDFから品名・型番・単価・数量をJSON抽出してください。
過去契約基準単価より高い場合は理由分析フラグを立てて出力してください。`,
    date: "2026.08.30",
  },
  {
    id: "pr-auto-review-tester",
    title: "PR自動コードレビュー & Playwrightテスト生成Agent",
    department: "品質管理・QA部",
    deptTag: "QA",
    author: "松原 英雄",
    reductionRate: 40,
    targetPeople: 25,
    frequency: "全PR対象 (日30回)",
    tool: "Playwright Skill + Antigravity CLI",
    toolBadgeColor: "bg-pink-500/20 text-pink-300 border-pink-400/30",
    gradientBg: "from-pink-950 via-slate-900 to-purple-950",
    impactSummary: "レビュー手戻り 40% 削減、テスト網羅率 15% 向上",
    problem:
      "PR作成時のUI崩れやアクセシビリティ欠落、非同期タイミングバグの発見が人手レビューに依存し、手戻り工数が肥大化していた。",
    flowSteps: [
      { step: "1. PRオープン検知", detail: "GitHub ActionsからAntigravity Subagentをバックグラウンド起動" },
      { step: "2. 差分解析 & E2Eテスト生成", detail: "変更コンポーネントに対応するPlaywrightテストコードを自動生成" },
      { step: "3. ヘッドレス実機検証", detail: "テスト実行とDOMスクリーンショット差分検証を実施" },
      { step: "4. インラインコメント投稿", detail: "潜在バグとアクセシビリティ改善案をPRに自動コメント" },
    ],
    promptSnippet: `PR差分コードを確認し、境界値テストケースと非同期ハンドリング漏れを指摘してください。
必要に応じてPlaywrightのE2Eテストコードを追加提案してください。`,
    date: "2026.08.25",
  },
];

// 部門別データ（アイデア宣言数 vs エージェント登録数）
const deptChartData = [
  { code: "クラウド基盤", ideas: 16, registered: 5 },
  { code: "DXソリューション", ideas: 14, registered: 4 },
  { code: "基幹システム", ideas: 13, registered: 3 },
  { code: "品質管理・QA", ideas: 11, registered: 3 },
  { code: "データ分析", ideas: 9, registered: 2 },
  { code: "情シス・IT", ideas: 8, registered: 2 },
  { code: "SRE・運用", ideas: 6, registered: 2 },
  { code: "CS・業務", ideas: 4, registered: 1 },
];

export default function AgentCasesPage() {
  const [cases] = useState<AgentCase[]>(initialCases);
  const [sortKey, setSortKey] = useState<"newest" | "reduction" | "people">("newest");
  const [selectedCase, setSelectedCase] = useState<AgentCase | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sortedCases = [...cases].sort((a, b) => {
    if (sortKey === "reduction") {
      return b.reductionRate - a.reductionRate;
    }
    if (sortKey === "people") {
      return b.targetPeople - a.targetPeople;
    }
    // newest (default)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      {/* 1. 白基調のシンプルなヘッダー（参考サイト完全再現） */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 text-center shadow-2xs">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          AI Park 事例ポータル
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          社内で実際に承認・本番稼働している自律型AIエージェントの構成・効果事例集
        </p>
      </div>

      {/* 2. メインコンテンツエリア */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* 品質ゲート注意書きバナー */}
        <UnderConstructionAlert
          statusType="poc"
          releaseDate="2026年10月30日(金)"
          message="現在掲載されている事例は、社内先行検証に基づくモデルケース（PoCデータ）です。実運用コードレビューおよび障害解析エージェントの実測ROIを反映し、10月30日に正式公開を予定しています。"
          prepDetails="社内本番稼働実績・定量効果データの集計完了をもって本番運用へ移行"
        />

        {/* ======================================================== */}
        {/* 上部目玉機能: 部門別 アイデア宣言数 vs エージェント登録数 グラフ */}
        {/* ======================================================== */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              部門別：アイデア宣言数 vs エージェント登録数
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              ※各事例の年間削減効果 = 1回あたり削減時間 × 部署全体の年間発生回数
            </p>
          </div>

          {/* 凡例 */}
          <div className="flex items-center justify-center space-x-6 text-xs font-bold pt-1 pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded bg-[#1e293b]" />
              <span className="text-slate-700">アイデア宣言数 (構想)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded bg-[#0284c7]" />
              <span className="text-slate-700">エージェント登録数 (実案件)</span>
            </div>
          </div>

          {/* グラフ描画エリア */}
          <div className="pt-4 pb-2 border-t border-slate-100">
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-4 items-end h-56 px-2">
              {deptChartData.map((d, idx) => {
                const maxVal = 18;
                const ideaHeight = `${(d.ideas / maxVal) * 100}%`;
                const regHeight = `${(d.registered / maxVal) * 100}%`;

                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    {/* バー表示エリア */}
                    <div className="w-full flex items-end justify-center space-x-1 sm:space-x-1.5 h-44 pb-1">
                      {/* アイデア宣言バー（濃紺） */}
                      <div
                        className="w-3.5 sm:w-5 bg-[#1e293b] rounded-t-md hover:bg-slate-700 transition-all relative flex flex-col justify-end"
                        style={{ height: ideaHeight }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-800 transition-opacity">
                          {d.ideas}
                        </span>
                      </div>

                      {/* 登録数バー（水色） */}
                      <div
                        className="w-3.5 sm:w-5 bg-[#0284c7] rounded-t-md hover:bg-sky-500 transition-all relative flex flex-col justify-end"
                        style={{ height: regHeight }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-sky-700 transition-opacity">
                          {d.registered}
                        </span>
                      </div>
                    </div>

                    {/* X軸ラベル */}
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 text-center truncate w-full mt-1.5 pt-1 border-t border-slate-200">
                      {d.code}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 下部セクション: 承認済みのAIエージェント一覧 */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              承認済みのAIエージェント一覧
            </h2>

            {/* 並び替えドロップダウン（参考サイト完全再現） */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-semibold">並び替え:</span>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-bold focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 shadow-2xs"
              >
                <option value="newest">新着順</option>
                <option value="reduction">削減効果が高い順 (%)</option>
                <option value="people">対象人数が多い順</option>
              </select>
            </div>
          </div>

          {/* スライドサムネイル付きカードグリッド（参考サイト完全再現） */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {sortedCases.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedCase(item)}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:border-sky-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                {/* 1. スライド・アーキテクチャ図風 サムネイル枠 */}
                <div
                  className={`relative p-4 sm:p-5 text-white bg-gradient-to-br ${item.gradientBg} flex flex-col justify-between h-48 border-b border-slate-100/10 overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-xl" />
                  </div>

                  {/* 上部ツールタグ */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${item.toolBadgeColor}`}
                    >
                      {item.tool.split("+")[0].trim()}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.date}
                    </span>
                  </div>

                  {/* スライド中央：タイトル & ワークフロー概略 */}
                  <div className="relative z-10 my-auto text-center space-y-1">
                    <p className="text-xs font-black text-white leading-tight drop-shadow-sm group-hover:text-sky-200 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-300 font-mono truncate">
                      {item.tool}
                    </p>
                  </div>

                  {/* 下部メトリクスバー（参考サイトの「96%削減 / 対象3人 / 年間12回」を完全再現） */}
                  <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-bold">
                    <span className="inline-flex items-center space-x-1 text-emerald-400">
                      <span>📉</span>
                      <span>{item.reductionRate}% 削減</span>
                    </span>
                    <span className="text-slate-300 text-[10px]">
                      対象 {item.targetPeople}人 • {item.frequency}
                    </span>
                  </div>
                </div>

                {/* 2. カード下部：タイトル・部門タグ */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {item.deptTag}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.author}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-sky-600 font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>詳細・構成を見る</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 詳細モーダル */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* モーダルヘッダー */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div className="space-y-1.5 pr-6">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                    {selectedCase.deptTag}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    開発者: {selectedCase.author}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedCase.date} 公開
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {selectedCase.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* モーダル本文 */}
            <div className="p-6 space-y-6 text-xs sm:text-sm text-slate-700">
              {/* 定量成果サマリーバナー */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
                    Impact & Metrics
                  </span>
                  <p className="font-extrabold text-sm sm:text-base text-emerald-950">
                    {selectedCase.impactSummary}
                  </p>
                </div>
                <span className="text-2xl font-black text-emerald-600 font-mono shrink-0 ml-4">
                  -{selectedCase.reductionRate}%
                </span>
              </div>

              {/* 課題背景 */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>解決した現場の課題</span>
                </h4>
                <p className="p-4 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed text-slate-800">
                  {selectedCase.problem}
                </p>
              </div>

              {/* アーキテクチャ・フロー */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>エージェント自動化ワークフロー</span>
                </h4>
                <div className="space-y-2">
                  {selectedCase.flowSteps.map((st, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start space-x-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 text-xs">{st.step}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{st.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 実戦プロンプト */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>採用プロンプト / テンプレート</span>
                  </h4>
                  <button
                    onClick={() => copyToClipboard(selectedCase.promptSnippet, 1)}
                    className="text-[11px] text-sky-600 hover:text-sky-700 font-bold inline-flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedIndex === 1 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">コピー完了！</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>プロンプトをコピー</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap border border-slate-800">
                  {selectedCase.promptSnippet}
                </pre>
              </div>
            </div>

            {/* モーダルフッター */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-b-3xl">
              <span className="text-xs text-slate-400">
                利用ツール: {selectedCase.tool}
              </span>
              <button
                onClick={() => setSelectedCase(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
