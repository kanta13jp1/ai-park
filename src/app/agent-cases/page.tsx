"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberSuccess, playCyberHover } from "@/lib/sound";
import {
  WORKSPACE_AGENTS,
  ORCHESTRATION_MODES,
  SWARM_WORKSPACE_MODES,
  SWARM_ROLE_PATTERNS,
  AGENT_TEMPLATES,
  type WorkspaceAgentCategory,
} from "@/data/agent-cases";
import {
  Bot,
  Copy,
  Check,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Layers,
  Compass,
  ExternalLink,
  FileCode2,
  Terminal,
  Network,
  GitBranch,
  Lock,
  Wrench,
  Users,
  Eye,
  Pencil,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { useState, useMemo, type KeyboardEvent as ReactKeyboardEvent } from "react";
import Link from "next/link";

type TabId = "agents" | "orchestration" | "templates";
const TAB_ORDER: TabId[] = ["agents", "orchestration", "templates"];

const CATEGORIES: Array<"all" | WorkspaceAgentCategory> = [
  "all",
  "リリース監査",
  "セキュリティ・品質",
  "システム・協調設計",
];

const WORKSPACE_BADGE_CLASS: Record<"inherit" | "share" | "branch", string> = {
  inherit: "bg-slate-100 text-slate-800 border-slate-300",
  share: "bg-indigo-50 text-indigo-700 border-indigo-200",
  branch: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

export default function AgentCasesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("agents");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyErrorId, setCopyErrorId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | WorkspaceAgentCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredAgents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return WORKSPACE_AGENTS.filter((agent) => {
      const matchCategory = selectedCategory === "all" || agent.category === selectedCategory;
      if (!matchCategory) return false;
      if (q === "") return true;
      const target = [
        agent.name,
        agent.displayName,
        agent.description,
        agent.sourcePath,
        agent.invocationPrompt,
        ...agent.tools,
        ...agent.highlights,
      ]
        .join(" ")
        .toLowerCase();
      return target.includes(q);
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = async (id: string, text: string) => {
    playCyberClick();
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setCopyErrorId(id);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      playCyberSuccess();
      setCopyErrorId(null);
      setCopiedId(id);
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2000);
    } catch {
      setCopyErrorId(id);
    }
  };

  const handleTabKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % TAB_ORDER.length;
    else if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = TAB_ORDER.length - 1;
    if (nextIndex === null) return;
    e.preventDefault();
    const nextTab = TAB_ORDER[nextIndex];
    playCyberClick();
    setActiveTab(nextTab);
    document.getElementById(`agent-cases-tab-${nextTab}`)?.focus();
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="Subagents 活用事例 & カスタムエージェント"
        subtitle="AI Park 実在カスタムエージェント定義（6件）・Subagents / Workflow / Swarm 使い分け・定義テンプレート"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 工事中：各部署のSubagents・Swarm実測導入事例を準備しています"
          message="実務での導入前後の計測データ・ヒアリング事例は現在収集中であり、確認前の数値や架空の事例は掲載していません。以下では AI Park リポジトリ（.agents/agents/）に定義済みの実在カスタムエージェント 6 件、Subagents / Workflow / Agent Swarms の使い分け、およびスターターテンプレートを掲載しています。"
        />

        {/* HUDハイライト */}
        <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-3xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40 cursor-default"
          >
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-mono font-bold tracking-wider uppercase">
                  <Bot size={14} className="text-indigo-400" />
                  <span>SUBAGENTS &amp; AGENT SWARMS</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                  役割と権限を絞ったエージェントで、調査・実装・監査を分業する
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  リポジトリの <code className="text-cyan-300 font-mono">.agents/agents/*.md</code> にカスタムエージェントを定義すると、
                  使用ツールを絞った専門エージェントとして{" "}
                  <code className="text-cyan-300 font-mono">invoke_subagent</code> や{" "}
                  <code className="text-cyan-300 font-mono">run_workflow</code>、
                  <code className="text-cyan-300 font-mono">/swarm</code> から呼び出せます。
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <Link
                    href="/skills-hub"
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md"
                  >
                    <span>社内 Skills カタログ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/mcp-hub"
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white font-bold text-xs transition-colors border border-white/15"
                  >
                    <span>MCP 連携ハブ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/ai-projects"
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white font-bold text-xs transition-colors border border-white/15"
                  >
                    <span>社内 AI プロジェクト一覧</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 shrink-0 font-mono text-xs space-y-2 w-full lg:w-auto">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>SWARM / AGENT 設計の安全原則</span>
                </div>
                <div className="text-slate-200">・監査役（verifier）は read-only・編集禁止</div>
                <div className="text-slate-200">・同時編集する author は workspace: &quot;share&quot; で分離</div>
                <div className="text-slate-200">・kill 前に必ずコミット＆coordinator 作業コピーへ統合</div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* タブ切り替えバー */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div role="tablist" aria-label="カスタムエージェント・Swarm ガイドのセクション切替" className="flex flex-wrap items-center gap-1.5">
            <button
              id="agent-cases-tab-agents"
              type="button"
              role="tab"
              aria-selected={activeTab === "agents"}
              aria-controls="agent-cases-panel-agents"
              tabIndex={activeTab === "agents" ? 0 : -1}
              onKeyDown={(e) => handleTabKeyDown(e, 0)}
              onClick={() => {
                playCyberClick();
                setActiveTab("agents");
              }}
              onMouseEnter={() => playCyberHover()}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "agents"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>実在カスタムエージェント ({WORKSPACE_AGENTS.length})</span>
            </button>
            <button
              id="agent-cases-tab-orchestration"
              type="button"
              role="tab"
              aria-selected={activeTab === "orchestration"}
              aria-controls="agent-cases-panel-orchestration"
              tabIndex={activeTab === "orchestration" ? 0 : -1}
              onKeyDown={(e) => handleTabKeyDown(e, 1)}
              onClick={() => {
                playCyberClick();
                setActiveTab("orchestration");
              }}
              onMouseEnter={() => playCyberHover()}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "orchestration"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Network className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Subagents・Swarm 使い分け</span>
            </button>
            <button
              id="agent-cases-tab-templates"
              type="button"
              role="tab"
              aria-selected={activeTab === "templates"}
              aria-controls="agent-cases-panel-templates"
              tabIndex={activeTab === "templates" ? 0 : -1}
              onKeyDown={(e) => handleTabKeyDown(e, 2)}
              onClick={() => {
                playCyberClick();
                setActiveTab("templates");
              }}
              onMouseEnter={() => playCyberHover()}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "templates"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>エージェント定義テンプレート ({AGENT_TEMPLATES.length})</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500 px-2">
            ※ 各部署の実測効果・導入事例は準備中（現在はリポジトリ実定義＋設計ガイドを掲載）
          </span>
        </div>

        {/* タブ1: 実在カスタムエージェント (6) */}
        {activeTab === "agents" && (
          <div id="agent-cases-panel-agents" role="tabpanel" aria-labelledby="agent-cases-tab-agents" className="space-y-6">
            {/* 検索＆カテゴリフィルター */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    type="text"
                    aria-label="カスタムエージェントを検索"
                    placeholder="エージェント名、ツール名（view_file 等）、説明、ファイルパスで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-16 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white transition-all font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      クリア
                    </button>
                  )}
                </div>

                <Link
                  href="/interviews"
                  onMouseEnter={() => playCyberHover()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs shrink-0"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                  <span>導入事例の取材に立候補</span>
                </Link>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
                <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>カテゴリ:</span>
                </span>
                {CATEGORIES.map((cat) => {
                  const count =
                    cat === "all"
                      ? WORKSPACE_AGENTS.length
                      : WORKSPACE_AGENTS.filter((a) => a.category === cat).length;
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      type="button"
                      key={cat}
                      aria-pressed={isSelected}
                      onClick={() => {
                        playCyberClick();
                        setSelectedCategory(cat);
                      }}
                      onMouseEnter={() => playCyberHover()}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                      }`}
                    >
                      {cat === "all" ? "すべて" : cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* エージェントカード一覧 */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-600" aria-hidden="true" />
                    <span>AI Park 実在カスタムエージェント定義（参考実例）</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    AI Park リポジトリ内の <code className="font-mono">.agents/agents/</code> に配置されている実在の定義ファイルです
                  </p>
                </div>
                <span aria-live="polite" className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80 self-start sm:self-auto">
                  該当 {filteredAgents.length} / 全 {WORKSPACE_AGENTS.length} 件
                </span>
              </div>

              {filteredAgents.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                  <Compass className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-600">
                    該当するカスタムエージェントが見つかりませんでした
                  </p>
                  <p className="text-xs text-slate-400">
                    検索キーワードやカテゴリを変更してお試しください。
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredAgents.map((agent) => (
                    <TiltCard
                      key={agent.id}
                      maxTilt={6}
                      glareOpacity={0.12}
                      className="h-full rounded-2xl"
                    >
                      <SpotlightCard
                        spotlightColor="rgba(99, 102, 241, 0.12)"
                        className="bg-white border-slate-200/90 shadow-sm h-full rounded-2xl"
                      >
                        <div className="p-6 flex flex-col justify-between h-full space-y-4">
                          <div className="space-y-3.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
                                  {agent.status}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    agent.readOnly
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-amber-50 text-amber-800 border-amber-200"
                                  }`}
                                >
                                  {agent.readOnly ? <Eye size={10} /> : <Pencil size={10} />}
                                  <span>{agent.readOnly ? "Read-Only" : "編集ツールあり"}</span>
                                </span>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                {agent.category}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
                                {agent.displayName}
                              </h4>
                              <div className="text-[11px] font-mono text-slate-500 break-all">
                                {agent.sourcePath}
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {agent.description}
                            </p>

                            {/* 許可ツール一覧 */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-bold text-slate-400 inline-flex items-center gap-1 mr-0.5">
                                <Wrench size={11} />
                                <span>tools:</span>
                              </span>
                              {agent.tools.map((tool) => (
                                <span
                                  key={tool}
                                  className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>

                            {/* 定義ファイルの主な処理ステップ */}
                            <ul className="space-y-1 text-[11px] text-slate-600 bg-slate-50/90 border border-slate-200/70 rounded-xl p-3">
                              {agent.highlights.map((item) => (
                                <li key={item} className="flex items-start gap-1.5 leading-relaxed">
                                  <span className="text-indigo-500 font-bold mt-0.5">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>

                            {/* 呼び出し例コピー */}
                            <div className="space-y-1.5 font-mono">
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span>呼び出しプロンプト例:</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(agent.id, agent.invocationPrompt)}
                                  onMouseEnter={() => playCyberHover()}
                                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer"
                                >
                                  {copiedId === agent.id ? (
                                    <>
                                      <Check size={12} className="text-emerald-600" />
                                      <span className="text-emerald-600">コピー完了</span>
                                    </>
                                  ) : copyErrorId === agent.id ? (
                                    <span className="text-rose-600">コピー失敗（手動選択してください）</span>
                                  ) : (
                                    <>
                                      <Copy size={12} />
                                      <span>指示文をコピー</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="bg-slate-950 text-cyan-300 p-3 rounded-xl text-xs overflow-x-auto border border-slate-800">
                                <code>{agent.invocationPrompt}</code>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                            <span className="text-slate-400">出どころ: {agent.sourceOrigin}</span>
                            <a
                              href={agent.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => playCyberClick()}
                              className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700"
                            >
                              <span>GitHub で実ファイルを見る</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      </SpotlightCard>
                    </TiltCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* タブ2: Subagents・Swarm 使い分け */}
        {activeTab === "orchestration" && (
          <div id="agent-cases-panel-orchestration" role="tabpanel" aria-labelledby="agent-cases-tab-orchestration" className="space-y-8">
            {/* 導入概要カード */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                  <Network className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    単発委譲・決定的ワークフロー・Agent Swarms（/swarm）の使い分け
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Antigravity ではタスクの規模や並列度に応じて 3 つの協調方式を選択できます。
                    1 つの調査や監査なら <code className="font-mono text-indigo-700">invoke_subagent</code>、
                    リスト全件への一括処理なら <code className="font-mono text-indigo-700">run_workflow</code>、
                    実装と監査の分離や共有ボード上の自律協調には <code className="font-mono text-indigo-700">/swarm</code> を使います。
                  </p>
                </div>
              </div>
            </div>

            {/* 3方式比較テーブル */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  マルチエージェント実行 3 方式の比較
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  制御主体・コンテキスト共有・ワークスペース分離の仕組みで選びます
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold">
                      <th className="py-3 px-4 whitespace-nowrap">実行方式</th>
                      <th className="py-3 px-4 min-w-[220px] whitespace-nowrap">起動・協調の仕組み</th>
                      <th className="py-3 px-4 min-w-[200px] whitespace-nowrap">コンテキスト共有</th>
                      <th className="py-3 px-4 min-w-[200px] whitespace-nowrap">ワークスペース制御</th>
                      <th className="py-3 px-4 min-w-[200px] whitespace-nowrap">向いている用途</th>
                      <th className="py-3 px-4 min-w-[200px] whitespace-nowrap">主な注意点</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ORCHESTRATION_MODES.map((mode) => (
                      <tr key={mode.id} className="hover:bg-slate-50/60 align-top">
                        <td className="py-3.5 px-4 whitespace-nowrap space-y-1">
                          <div className="font-extrabold text-indigo-700">{mode.name}</div>
                          <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {mode.badge}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 leading-relaxed">
                          {mode.mechanism}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                          {mode.contextSharing}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 leading-relaxed font-mono text-[11px]">
                          {mode.workspaceHandling}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 leading-relaxed">
                          {mode.bestFor}
                        </td>
                        <td className="py-3.5 px-4 text-amber-900 bg-amber-50/40 leading-relaxed">
                          {mode.caution}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Swarm ワークスペース分離モード選択ガイド */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Swarm ワークスペースモード選択ガイド（inherit / share / branch）
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SWARM_WORKSPACE_MODES.map((item) => (
                  <div
                    key={item.mode}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${WORKSPACE_BADGE_CLASS[item.mode]}`}
                        >
                          workspace: &quot;{item.mode}&quot;
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.mechanism}</p>
                      <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-2.5 text-[11px] text-slate-700 leading-relaxed">
                        <span className="font-bold text-indigo-800 block mb-0.5">推奨ロール:</span>
                        {item.recommendedRoles}
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 leading-relaxed flex items-start gap-1.5">
                      <AlertTriangle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>{item.caution}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Swarm 役割分離（author vs verifier / monitor / @mention） */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Swarm の役割分離と共有ボード（@mention）運用ルール</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    実装役（author）と監査役（verifier）を分離し、@mention で必要なメンバーだけを起こします
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-900 text-cyan-300 self-start sm:self-auto">
                  swarm_wait = 待機時 0 トークン
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold">
                      <th className="py-3 px-4 whitespace-nowrap">役割</th>
                      <th className="py-3 px-4 whitespace-nowrap">標準 workspace</th>
                      <th className="py-3 px-4 min-w-[240px] whitespace-nowrap">主な責務（author vs verifier）</th>
                      <th className="py-3 px-4 min-w-[260px] whitespace-nowrap">共有ボード・@mention 運用</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SWARM_ROLE_PATTERNS.map((row) => (
                      <tr key={row.role} className="hover:bg-slate-50/60 align-top">
                        <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900 whitespace-nowrap">
                          @{row.role}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border ${WORKSPACE_BADGE_CLASS[row.defaultWorkspace]}`}
                          >
                            {row.defaultWorkspace}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 leading-relaxed">{row.purpose}</td>
                        <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                          {row.boardRule}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* タブ3: エージェント定義テンプレート (2) */}
        {activeTab === "templates" && (
          <div id="agent-cases-panel-templates" role="tabpanel" aria-labelledby="agent-cases-tab-templates" className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-indigo-600" />
                <span>
                  そのまま使えるカスタムエージェント定義テンプレート（全 {AGENT_TEMPLATES.length} 種）
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                リポジトリ直下の <code className="font-mono">.agents/agents/&lt;エージェント名&gt;.md</code> に配置することで、
                使用ツール（<code className="font-mono">tools</code>）を制限した読み取り専用監査役やレビュー支援エージェントを定義できます。
              </p>
            </div>

            <div className="space-y-6">
              {AGENT_TEMPLATES.map((tpl) => {
                const cmdCopyId = `tpl-cmd-${tpl.id}`;
                const mdCopyId = `tpl-md-${tpl.id}`;
                return (
                  <div
                    key={tpl.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                            .agents/agents/{tpl.fileName}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Lock size={11} />
                            <span>{tpl.readOnly ? "Read-Only" : "編集可"}</span>
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                          {tpl.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600">{tpl.summary}</p>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold text-slate-400">tools:</span>
                          {tpl.tools.map((tool) => (
                            <span
                              key={tool}
                              className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="shrink-0 text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                        用途: {tpl.useCase}
                      </span>
                    </div>

                    {/* PowerShell フォルダ作成コマンド */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-slate-500" />
                          <span>1. フォルダ作成コマンド（Windows PowerShell）</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(cmdCopyId, tpl.powershellCmd)}
                          onMouseEnter={() => playCyberHover()}
                          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                        >
                          {copiedId === cmdCopyId ? (
                            <>
                              <Check size={12} className="text-emerald-600" />
                              <span className="text-emerald-600">コピー完了</span>
                            </>
                          ) : copyErrorId === cmdCopyId ? (
                            <span className="text-rose-600">コピー失敗（手動コピーしてください）</span>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>コマンドをコピー</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-slate-900 text-emerald-300 p-3 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                        <code>{tpl.powershellCmd}</code>
                      </div>
                    </div>

                    {/* エージェント定義 Markdown 全文 */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span>2. {tpl.fileName} 内容（そのまま貼り付け）</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(mdCopyId, tpl.markdownContent)}
                          onMouseEnter={() => playCyberHover()}
                          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                        >
                          {copiedId === mdCopyId ? (
                            <>
                              <Check size={12} className="text-emerald-600" />
                              <span className="text-emerald-600">コピー完了</span>
                            </>
                          ) : copyErrorId === mdCopyId ? (
                            <span className="text-rose-600">コピー失敗（手動コピーしてください）</span>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>テンプレートをコピー</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed whitespace-pre-wrap">
                        <code>{tpl.markdownContent}</code>
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
