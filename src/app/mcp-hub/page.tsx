"use client";

import { useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import { playCyberClick, playCyberHover, playCyberSuccess } from "@/lib/sound";
import {
  MCP_ARCHITECTURE_LAYERS,
  MCP_PRIMITIVES,
  MCP_TRANSPORTS,
  MCP_CUSTOMIZATION_COMPARISON,
  MCP_CONFIG_LOCATIONS,
  AI_PARK_MCP_TOOLS,
  AI_PARK_MCP_TRANSPORTS,
  MCP_CONFIG_TEMPLATES,
  MCP_SECURITY_LEVEL_GUIDANCE,
  MCP_SAFETY_CHECKLIST,
  MCP_OFFICIAL_LINKS,
} from "@/data/mcp-hub";
import {
  Plug,
  Layers,
  FileJson,
  ShieldCheck,
  Search,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Server,
  Cpu,
  Network,
  FolderTree,
  Lock,
  CheckCircle2,
  Circle,
  RotateCcw,
  Compass,
  BookOpen,
  MessageSquare,
  SlidersHorizontal,
  Info,
} from "lucide-react";

type TabId = "architecture" | "templates" | "safety";
type TransportFilter = "all" | "Stdio (ローカル)" | "Streamable HTTP (リモート)";

export default function McpHubPage() {
  const [activeTab, setActiveTab] = useState<TabId>("architecture");
  const [searchQuery, setSearchQuery] = useState("");
  const [transportFilter, setTransportFilter] = useState<TransportFilter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyErrorId, setCopyErrorId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredArchitecture = useMemo(() => {
    if (!normalizedQuery) return MCP_ARCHITECTURE_LAYERS;
    return MCP_ARCHITECTURE_LAYERS.filter((item) =>
      [
        item.name,
        item.roleLabel,
        item.summary,
        item.antigravityExample,
        ...item.responsibilities,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredPrimitives = useMemo(() => {
    if (!normalizedQuery) return MCP_PRIMITIVES;
    return MCP_PRIMITIVES.filter((item) =>
      [item.name, item.controlModel, item.summary, item.safetyNote, ...item.examples]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredTransports = useMemo(() => {
    if (!normalizedQuery) return MCP_TRANSPORTS;
    return MCP_TRANSPORTS.filter((item) =>
      [
        item.name,
        item.scopeLabel,
        item.mechanism,
        item.bestFor,
        item.caution,
        ...item.configKeys,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredCustomization = useMemo(() => {
    if (!normalizedQuery) return MCP_CUSTOMIZATION_COMPARISON;
    return MCP_CUSTOMIZATION_COMPARISON.filter((row) =>
      [row.type, row.configPath, row.loadingTiming, row.bestFor, row.howItWorks]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredLocations = useMemo(() => {
    if (!normalizedQuery) return MCP_CONFIG_LOCATIONS;
    return MCP_CONFIG_LOCATIONS.filter((loc) =>
      [loc.scope, loc.path, loc.description, loc.caution]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredAiParkTools = useMemo(() => {
    if (!normalizedQuery) return AI_PARK_MCP_TOOLS;
    return AI_PARK_MCP_TOOLS.filter((tool) =>
      [tool.name, tool.category, tool.summary, tool.safetyNote]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredAiParkTransports = useMemo(() => {
    if (!normalizedQuery) return AI_PARK_MCP_TRANSPORTS;
    return AI_PARK_MCP_TRANSPORTS.filter((entry) =>
      [entry.name, entry.transport, entry.location, entry.availability, entry.commandOrUrl]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredTemplates = useMemo(() => {
    return MCP_CONFIG_TEMPLATES.filter((tpl) => {
      const matchTransport =
        transportFilter === "all" || tpl.transport === transportFilter;
      if (!matchTransport) return false;
      if (!normalizedQuery) return true;
      return [
        tpl.title,
        tpl.serverKey,
        tpl.transport,
        tpl.packageOrEndpoint,
        tpl.authRequirement,
        tpl.summary,
        tpl.recommendedScope,
        tpl.configJson,
        ...tpl.notes,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [normalizedQuery, transportFilter]);

  const filteredSecurityLevels = useMemo(() => {
    if (!normalizedQuery) return MCP_SECURITY_LEVEL_GUIDANCE;
    return MCP_SECURITY_LEVEL_GUIDANCE.filter((lvl) =>
      [
        lvl.level,
        lvl.title,
        lvl.targetToolsSummary,
        lvl.mcpGuidance,
        lvl.allowedScope,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredChecklist = useMemo(() => {
    if (!normalizedQuery) return MCP_SAFETY_CHECKLIST;
    return MCP_SAFETY_CHECKLIST.filter((chk) =>
      [chk.category, chk.title, chk.detail, chk.actionHint]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const architectureTabCount =
    filteredArchitecture.length +
    filteredPrimitives.length +
    filteredTransports.length +
    filteredCustomization.length +
    filteredLocations.length +
    filteredAiParkTools.length +
    filteredAiParkTransports.length;
  const templatesTabCount = filteredTemplates.length;
  const safetyTabCount =
    filteredSecurityLevels.length + filteredChecklist.length;

  const checkedCount = checkedIds.length;
  const totalChecklistCount = MCP_SAFETY_CHECKLIST.length;
  const checklistProgressPercent =
    totalChecklistCount > 0
      ? Math.round((checkedCount / totalChecklistCount) * 100)
      : 0;

  const handleCopy = async (id: string, text: string) => {
    playCyberClick();
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setCopiedId((prev) => (prev === id ? null : prev));
      setCopyErrorId(id);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      playCyberSuccess();
      setCopyErrorId(null);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 2000);
    } catch {
      setCopiedId((prev) => (prev === id ? null : prev));
      setCopyErrorId(id);
    }
  };

  const toggleChecklistItem = (id: string) => {
    playCyberClick();
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetSearch = () => {
    playCyberClick();
    setSearchQuery("");
    setTransportFilter("all");
  };

  const tabOrder: TabId[] = ["architecture", "templates", "safety"];
  const handleTabKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabOrder.length;
    else if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = tabOrder.length - 1;
    if (nextIndex === null) return;
    e.preventDefault();
    const nextTab = tabOrder[nextIndex];
    playCyberClick();
    setActiveTab(nextTab);
    document.getElementById(`mcp-tab-${nextTab}`)?.focus();
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title="MCP 外部ツール連携ハブ"
        subtitle="Model Context Protocol の仕組み・mcp_config.json 設定テンプレート・安全利用チェックリスト（社内承認リスト準備中）"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 工事中：社内で正式に利用を認める MCP サーバー一覧・申請フローを準備しています"
          message="社内で正式に利用を認める MCP サーバー一覧・申請フローは現在準備中（確定次第掲載）です。このページでは先行して、公式 Model Context Protocol（MCP）の仕組み、汎用的な mcp_config.json テンプレート例、および導入前の安全確認チェックリストを掲載しています。"
          prepDetails="承認済みサーバーリスト・申請手順を策定中（業務データ接続前は AI推進担当へ事前相談）"
        />

        {/* HUD ハイライトカード */}
        <TiltCard maxTilt={3} glareOpacity={0.06} className="rounded-3xl">
          <div
            onMouseEnter={() => playCyberHover()}
            className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40 cursor-default"
          >
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-mono font-bold tracking-wider uppercase">
                  <Plug size={14} className="text-cyan-400 shrink-0" />
                  <span>MODEL CONTEXT PROTOCOL (MCP)</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                  外部ツール・ドキュメント連携を標準仕様と安全基準で理解する
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  MCP は AI エージェントと外部のデータ・ツールをつなぐオープン標準プロトコルです。Antigravity では{" "}
                  <code className="text-cyan-300 font-mono">mcp_config.json</code>{" "}
                  に定義し、チャット画面右上の{" "}
                  <code className="text-cyan-300 font-mono">
                    Additional Options (...) &gt; MCP Servers
                  </code>{" "}
                  から接続状態や公開ツールを確認できます。
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <Link
                    href="/tools-hub"
                    onClick={() => playCyberClick()}
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95"
                  >
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>社内セキュリティ基準 (/tools-hub)</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </Link>
                  <Link
                    href="/guide"
                    onClick={() => playCyberClick()}
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 hover:text-white font-bold text-xs transition-colors border border-white/15"
                  >
                    <span>導入ガイド・安全設定 (/guide)</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => playCyberClick()}
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 hover:text-white font-bold text-xs transition-colors border border-white/15"
                  >
                    <span>利用前相談・お問い合わせ (/contact)</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </Link>
                </div>
              </div>

              <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 shrink-0 font-mono text-xs space-y-2 w-full lg:w-80">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} className="shrink-0" />
                  <span>MCP SAFETY PRINCIPLES</span>
                </div>
                <div className="text-slate-200">・最小権限＆読み取り専用設定を優先</div>
                <div className="text-slate-200">・トークン・APIキーの Git 非コミット</div>
                <div className="text-slate-200">・破壊的操作は必ず人間が確認・承認</div>
                <div className="text-amber-300 pt-1 border-t border-white/10 text-[11px]">
                  ※ 社内承認済みリスト・申請フローは準備中
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* タブ切り替え＆キーワード検索ツールバー */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div role="tablist" aria-label="MCP 連携ハブのセクション切替" className="flex flex-wrap items-center gap-1.5 min-w-0">
              <button
                id="mcp-tab-architecture"
                type="button"
                role="tab"
                aria-selected={activeTab === "architecture"}
                aria-controls="mcp-panel-architecture"
                tabIndex={activeTab === "architecture" ? 0 : -1}
                onKeyDown={(e) => handleTabKeyDown(e, 0)}
                onClick={() => {
                  playCyberClick();
                  setActiveTab("architecture");
                }}
                onMouseEnter={() => playCyberHover()}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "architecture"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>MCP の仕組み & 構成ガイド</span>
                {normalizedQuery && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      activeTab === "architecture"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {architectureTabCount}
                  </span>
                )}
              </button>

              <button
                id="mcp-tab-templates"
                type="button"
                role="tab"
                aria-selected={activeTab === "templates"}
                aria-controls="mcp-panel-templates"
                tabIndex={activeTab === "templates" ? 0 : -1}
                onKeyDown={(e) => handleTabKeyDown(e, 1)}
                onClick={() => {
                  playCyberClick();
                  setActiveTab("templates");
                }}
                onMouseEnter={() => playCyberHover()}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "templates"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileJson className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>mcp_config.json 設定テンプレート ({MCP_CONFIG_TEMPLATES.length})</span>
                {normalizedQuery && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      activeTab === "templates"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {templatesTabCount}
                  </span>
                )}
              </button>

              <button
                id="mcp-tab-safety"
                type="button"
                role="tab"
                aria-selected={activeTab === "safety"}
                aria-controls="mcp-panel-safety"
                tabIndex={activeTab === "safety" ? 0 : -1}
                onKeyDown={(e) => handleTabKeyDown(e, 2)}
                onClick={() => {
                  playCyberClick();
                  setActiveTab("safety");
                }}
                onMouseEnter={() => playCyberHover()}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "safety"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>安全利用チェックリスト & 導入前確認</span>
                {normalizedQuery && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      activeTab === "safety"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {safetyTabCount}
                  </span>
                )}
              </button>
            </div>

            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                aria-label="キーワード検索"
                placeholder="MCP 仕様・設定キー・安全項目を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white transition-all font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={resetSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 text-[11px] font-bold cursor-pointer"
                >
                  クリア
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono">
                ※ 掲載テンプレートは公式仕様に基づく汎用参考例です（社内承認済み一覧は工事中）
              </span>
              {normalizedQuery && (
                <span aria-live="polite" className="font-mono text-indigo-700 font-bold">
                  一致件数: 仕組み {architectureTabCount} / テンプレ {templatesTabCount} / 安全 {safetyTabCount}
                </span>
              )}
            </div>
            {activeTab === "templates" && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-slate-500 font-bold mr-1">
                  <SlidersHorizontal size={12} aria-hidden="true" />
                  <span>接続方式:</span>
                </span>
                {(
                  [
                    "all",
                    "Stdio (ローカル)",
                    "Streamable HTTP (リモート)",
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={transportFilter === mode}
                    onClick={() => {
                      playCyberClick();
                      setTransportFilter(mode);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      transportFilter === mode
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {mode === "all" ? "すべて" : mode}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* タブ 1: MCP の仕組み & 構成ガイド */}
        {activeTab === "architecture" && (
          <div id="mcp-panel-architecture" role="tabpanel" aria-labelledby="mcp-tab-architecture" className="space-y-8">
            {architectureTabCount === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
                <Compass className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">
                  「{searchQuery}」に一致する仕組み・構成ガイドが見つかりませんでした
                </p>
                <p className="text-xs text-slate-500">
                  別のキーワード（例: Host, Tools, Stdio, Streamable, Hooks）で検索するか、条件をリセットしてください。
                </p>
                <button
                  type="button"
                  onClick={resetSearch}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  検索条件をリセット
                </button>
              </div>
            ) : (
              <>
                {/* 1. Host / Client / Server アーキテクチャ */}
                {filteredArchitecture.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                          <Server className="w-5 h-5 text-indigo-600 shrink-0" />
                          <span>1. MCP アーキテクチャ（Host / Client / Server）</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                          AI アプリ（Host）と外部機能（Server）を直接結合せず、1対1 の Client セッションで安全に分離する構造です。
                        </p>
                      </div>
                      <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start lg:self-auto shrink-0">
                        Host ⇄ Client ⇄ Server（JSON-RPC 2.0）
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      {filteredArchitecture.map((layer) => (
                        <SpotlightCard
                          key={layer.id}
                          spotlightColor="rgba(99, 102, 241, 0.12)"
                          className="bg-white border-slate-200/90 shadow-xs rounded-2xl h-full"
                        >
                          <div className="p-5 flex flex-col justify-between h-full space-y-4">
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300 text-[11px] font-mono font-bold">
                                  {layer.id.toUpperCase()}
                                </span>
                                <span className="text-[11px] font-bold text-indigo-600">
                                  {layer.roleLabel}
                                </span>
                              </div>
                              <h4 className="text-base font-extrabold text-slate-900">
                                {layer.name}
                              </h4>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {layer.summary}
                              </p>
                              <ul className="space-y-1.5 pt-1 text-xs text-slate-700">
                                {layer.responsibilities.map((resp) => (
                                  <li key={resp} className="flex items-start gap-1.5 leading-relaxed">
                                    <CheckCircle2
                                      size={13}
                                      className="text-indigo-500 shrink-0 mt-0.5"
                                    />
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                              <span className="font-bold text-slate-700">Antigravity 対応例: </span>
                              {layer.antigravityExample}
                            </div>
                          </div>
                        </SpotlightCard>
                      ))}
                    </div>
                  </section>
                )}

                {/* 2. サーバーが提供する 3 つのプリミティブ */}
                {filteredPrimitives.length > 0 && (
                  <section className="space-y-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-cyan-600 shrink-0" />
                        <span>2. MCP サーバーが提供する 3 つの機能（Tools / Resources / Prompts）</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                        誰が呼び出しの主導権を持つか（AI モデル / アプリ / ユーザー）によって役割が分かれています。
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      {filteredPrimitives.map((prim) => (
                        <div
                          key={prim.id}
                          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-2.5">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-[11px] font-bold">
                              {prim.controlModel}
                            </span>
                            <h4 className="text-base font-extrabold text-slate-900">
                              {prim.name}
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {prim.summary}
                            </p>
                            <div className="space-y-1 pt-1">
                              <div className="text-[11px] font-bold text-slate-500">主な例:</div>
                              <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                                {prim.examples.map((ex) => (
                                  <li key={ex}>{ex}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950 leading-relaxed">
                            <span className="font-bold">安全観点: </span>
                            {prim.safetyNote}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 3. Stdio vs Streamable HTTP トランスポート比較表 */}
                {filteredTransports.length > 0 && (
                  <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Network className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>3. 通信方式（トランスポート）の比較：Stdio vs Streamable HTTP</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        ローカル実行とリモート接続のどちらを使うかで、設定キーと注意点が異なります（横スクロール可）。
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold">
                            <th className="py-3 px-4 whitespace-nowrap">通信方式</th>
                            <th className="py-3 px-4 whitespace-nowrap">実行形態 / 主なキー</th>
                            <th className="py-3 px-4 min-w-[200px] whitespace-nowrap">仕組み</th>
                            <th className="py-3 px-4 min-w-[180px] whitespace-nowrap">向いている用途</th>
                            <th className="py-3 px-4 min-w-[200px] whitespace-nowrap">運用上の注意点</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredTransports.map((tr) => (
                            <tr key={tr.id} className="hover:bg-slate-50/60 align-top">
                              <td className="py-3.5 px-4 whitespace-nowrap space-y-1">
                                <div className="font-extrabold text-indigo-700">{tr.name}</div>
                                <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600">
                                  {tr.scopeLabel}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                                <div className="space-y-1">
                                  {tr.configKeys.map((k) => (
                                    <div key={k}>
                                      <code className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                                        {k}
                                      </code>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-slate-700 leading-relaxed">
                                {tr.mechanism}
                              </td>
                              <td className="py-3.5 px-4 text-slate-700 leading-relaxed">
                                {tr.bestFor}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                                {tr.caution}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* 4. Antigravity カスタマイズ機能 5 種の使い分け表 */}
                {filteredCustomization.length > 0 && (
                  <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        4. Antigravity カスタマイズ機能 5 種の使い分け（Skills / Rules / Hooks / MCP / Plugins）
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        すべてを MCP に頼るのではなく、規約は Rules、定型手順は Skills、強制検証は Hooks と組み合わせます。
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold">
                            <th className="py-3 px-4 whitespace-nowrap">種別</th>
                            <th className="py-3 px-4 whitespace-nowrap">設定ファイル / 配置先</th>
                            <th className="py-3 px-4 whitespace-nowrap">読み込みタイミング</th>
                            <th className="py-3 px-4 min-w-[210px] whitespace-nowrap">向いている用途</th>
                            <th className="py-3 px-4 min-w-[200px] whitespace-nowrap">動作の仕組み</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredCustomization.map((row) => (
                            <tr
                              key={row.type}
                              className={`hover:bg-slate-50/60 align-top ${
                                row.type === "MCP Servers" ? "bg-cyan-50/40" : ""
                              }`}
                            >
                              <td className="py-3.5 px-4 font-extrabold text-indigo-700 whitespace-nowrap">
                                {row.type}
                              </td>
                              <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                                {row.configPath}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">{row.loadingTiming}</td>
                              <td className="py-3.5 px-4 text-slate-700 leading-relaxed">
                                {row.bestFor}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                                {row.howItWorks}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* 5. mcp_config.json 配置場所と確認方法 */}
                {filteredLocations.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FolderTree className="w-5 h-5 text-indigo-600 shrink-0" />
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                        5. Antigravity での設定ファイル配置場所と確認 UI
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {filteredLocations.map((loc) => (
                        <div
                          key={loc.path}
                          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold">
                              {loc.scope}
                            </span>
                            <div className="bg-slate-100 text-slate-900 px-3 py-2 rounded-lg font-mono text-[11px] break-all">
                              {loc.path}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {loc.description}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-slate-100 text-[11px] text-rose-700 leading-relaxed">
                            <span className="font-bold">注意: </span>
                            {loc.caution}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 sm:p-5 border border-slate-800 flex items-start gap-3 text-xs leading-relaxed">
                      <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white">UI での稼働確認方法: </span>
                        Antigravity のチャット右上の追加オプション（
                        <code className="font-mono text-cyan-300">
                          Additional Options (...) &gt; MCP Servers
                        </code>
                        ）を開くと、接続中のサーバー一覧・公開されているツール・生の設定ファイル（
                        <code className="font-mono text-cyan-300">View raw config</code>
                        ）を確認できます。
                      </div>
                    </div>
                  </section>
                )}

                {/* 6. AI Park 自前 MCP サーバー & WebMCP 対応 */}
                {(filteredAiParkTools.length > 0 || filteredAiParkTransports.length > 0) && (
                  <section id="ai-park-mcp" className="bg-white rounded-2xl border border-indigo-200 overflow-hidden shadow-sm">
                    <div className="px-5 sm:px-6 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-cyan-50/50 to-white flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">
                          <Plug size={12} aria-hidden="true" />
                          <span>リポジトリ同梱 MCP &amp; WebMCP 実装</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                          6. AI Park 専用 MCP サーバー（Antigravity 直接操作対応）
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Antigravity から AI Park の検索・ステータス照会・ボード起票（既定 dryRun）・品質ゲート実行・MCP App UI 表示を行う実装をリポジトリ内に同梱しています。
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <span role="status" aria-live="polite" className="sr-only">
                          {copiedId === "cmd-validate-plugin" ? "プラグイン検証コマンドをクリップボードにコピーしました。" : ""}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              "cmd-validate-plugin",
                              "agy plugin validate --strict .agents/plugins/ai-park-mcp"
                            )
                          }
                          onMouseEnter={() => playCyberHover()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                        >
                          {copiedId === "cmd-validate-plugin" ? (
                            <>
                              <Check size={13} className="text-emerald-400" />
                              <span className="text-emerald-300">検証コマンドをコピー済</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>プラグイン検証コマンドをコピー</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-6">
                      {copyErrorId === "cmd-validate-plugin" && (
                        <div
                          role="alert"
                          className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold"
                        >
                          クリップボードへのコピーに失敗しました。コマンドを手動で選択してコピーしてください。
                        </div>
                      )}

                      {filteredAiParkTransports.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {filteredAiParkTransports.map((entry) => (
                            <div
                              key={entry.id}
                              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-extrabold text-slate-900">
                                  {entry.name}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[10px] font-bold text-indigo-700">
                                  {entry.transport}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-slate-600 break-all">
                                配置: {entry.location}
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed">
                                {entry.availability}
                              </p>
                              <div className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-cyan-200 font-mono text-[11px] break-all">
                                {entry.commandOrUrl}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {filteredAiParkTools.length > 0 && (
                        <div className="overflow-x-auto border border-slate-200 rounded-xl">
                          <table className="w-full min-w-[640px] text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold">
                                <th className="py-3 px-4 whitespace-nowrap">ツール名</th>
                                <th className="py-3 px-4 whitespace-nowrap">区分</th>
                                <th className="py-3 px-4 min-w-[220px] whitespace-nowrap">機能概要</th>
                                <th className="py-3 px-4 min-w-[200px] whitespace-nowrap">安全設計</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {filteredAiParkTools.map((tool) => (
                                <tr key={tool.name} className="hover:bg-slate-50/60 align-top">
                                  <td className="py-3 px-4 font-mono font-bold text-indigo-700 whitespace-nowrap">
                                    {tool.name}
                                  </td>
                                  <td className="py-3 px-4 whitespace-nowrap">
                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700">
                                      {tool.category}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                                    {tool.summary}
                                  </td>
                                  <td className="py-3 px-4 text-slate-600 leading-relaxed">
                                    {tool.safetyNote}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}

        {/* タブ 2: mcp_config.json 設定テンプレート */}
        {activeTab === "templates" && (
          <div id="mcp-panel-templates" role="tabpanel" aria-labelledby="mcp-tab-templates" className="space-y-6">
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>テンプレート利用前の必須確認（汎用参考例・社内承認リスト準備中）</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                AI Park 専用テンプレートを除く汎用 3 種は公式ドキュメントに基づく<strong>参考記述例</strong>であり、社内業務利用が承認済みであることを示すものではありません。設定内の{" "}
                <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded">
                  &lt;ALLOWED_DIRECTORY_PATH&gt;
                </code>{" "}
                や{" "}
                <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded">
                  &lt;YOUR_GITHUB_PAT&gt;
                </code>{" "}
                等はプレースホルダ表記です。実キーへ置き換えた設定ファイルを Git へコミットしないでください。
              </p>
            </div>

            {filteredTemplates.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
                <Compass className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">
                  条件に一致する設定テンプレートが見つかりませんでした
                </p>
                <p className="text-xs text-slate-500">
                  検索キーワードや接続方式フィルターを変更してお試しください。
                </p>
                <button
                  type="button"
                  onClick={resetSearch}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  検索・フィルターをリセット
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredTemplates.map((tpl) => {
                  const isCopied = copiedId === tpl.id;
                  const isCopyError = copyErrorId === tpl.id;

                  return (
                    <div
                      key={tpl.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-mono font-bold">
                              {tpl.transport}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold">
                              {tpl.statusBadge}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                            {tpl.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {tpl.summary}
                          </p>
                        </div>

                        <a
                          href={tpl.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playCyberClick()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0 self-start"
                        >
                          <span>{tpl.docLabel}</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                          <div className="text-[11px] font-bold text-slate-500">
                            対象パッケージ / URL
                          </div>
                          <div className="font-mono text-slate-800 break-all">
                            {tpl.packageOrEndpoint}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                          <div className="text-[11px] font-bold text-slate-500">
                            認証・制限方式
                          </div>
                          <div className="text-slate-800 font-medium">{tpl.authRequirement}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                          <div className="text-[11px] font-bold text-slate-500">想定用途</div>
                          <div className="text-slate-800 font-medium">{tpl.recommendedScope}</div>
                        </div>
                      </div>

                      {/* JSON コードブロック + try/catch コピーボタン */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-600">
                          <span className="font-mono">
                            mcp_config.json（serverKey: {tpl.serverKey}）
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(tpl.id, tpl.configJson)}
                            onMouseEnter={() => playCyberHover()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all cursor-pointer active:scale-95"
                          >
                            {isCopied ? (
                              <>
                                <Check size={13} className="text-emerald-400" />
                                <span className="text-emerald-300">コピー完了</span>
                              </>
                            ) : isCopyError ? (
                              <>
                                <AlertTriangle size={13} className="text-rose-400" />
                                <span className="text-rose-300">コピー失敗</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span>JSON をコピー</span>
                              </>
                            )}
                          </button>
                        </div>

                        {isCopyError && (
                          <div
                            role="alert"
                            className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold"
                          >
                            クリップボードへのコピーに失敗しました。下の JSON コードを手動で選択してコピーしてください。
                          </div>
                        )}

                        <pre className="bg-slate-950 text-cyan-200 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                          <code>{tpl.configJson}</code>
                        </pre>
                      </div>

                      {/* 補足・安全上の注意 */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="text-xs font-extrabold text-slate-800">
                          設定時のポイント・安全上の注意
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {tpl.notes.map((note) => (
                            <li key={note} className="flex items-start gap-1.5 leading-relaxed">
                              <CheckCircle2
                                size={13}
                                className="text-indigo-500 shrink-0 mt-0.5"
                              />
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* タブ 3: 安全利用チェックリスト & 導入前確認 */}
        {activeTab === "safety" && (
          <div id="mcp-panel-safety" role="tabpanel" aria-labelledby="mcp-tab-safety" className="space-y-8">
            {safetyTabCount === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
                <Compass className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">
                  「{searchQuery}」に一致する安全基準・チェック項目が見つかりませんでした
                </p>
                <button
                  type="button"
                  onClick={resetSearch}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  検索条件をリセット
                </button>
              </div>
            ) : (
              <>
                {/* 1. AI Park セキュリティ基準（Level 1〜3）との対応 */}
                {filteredSecurityLevels.length > 0 && (
                  <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                          <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>AI Park セキュリティ基準（Level 1〜3）と MCP 連携の対応</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          <Link
                            href="/tools-hub"
                            className="text-indigo-600 hover:underline font-bold"
                          >
                            /tools-hub の社内データ取り扱いセキュリティ基準
                          </Link>
                          に照らして、接続先サーバーと扱えるデータ区分を確認します。
                        </p>
                      </div>
                      <Link
                        href="/tools-hub"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 self-start lg:self-auto shrink-0"
                      >
                        <span>基準表（/tools-hub）を見る</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                      {filteredSecurityLevels.map((lvl) => {
                        const styleMap = {
                          emerald: {
                            card: "border-emerald-200 bg-emerald-50/40",
                            title: "text-emerald-900",
                            badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
                          },
                          amber: {
                            card: "border-amber-200 bg-amber-50/40",
                            title: "text-amber-900",
                            badge: "bg-amber-100 text-amber-800 border-amber-200",
                          },
                          rose: {
                            card: "border-rose-200 bg-rose-50/40",
                            title: "text-rose-900",
                            badge: "bg-rose-100 text-rose-800 border-rose-200",
                          },
                        }[lvl.badgeTone];

                        return (
                          <div
                            key={lvl.level}
                            className={`p-4 rounded-xl border ${styleMap.card} flex flex-col justify-between space-y-3`}
                          >
                            <div className="space-y-2">
                              <div className={`font-extrabold text-sm ${styleMap.title}`}>
                                {lvl.title}
                              </div>
                              <p className="text-slate-600 text-[11px] leading-relaxed">
                                <span className="font-bold text-slate-800">基準対象: </span>
                                {lvl.targetToolsSummary}
                              </p>
                              <p className="text-slate-700 text-xs leading-relaxed">
                                {lvl.mcpGuidance}
                              </p>
                            </div>
                            <div
                              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold ${styleMap.badge}`}
                            >
                              接続目安: {lvl.allowedScope}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* 2. 導入前・運用前 安全利用チェックリスト */}
                {filteredChecklist.length > 0 && (
                  <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="space-y-1 min-w-0">
                        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                          <span>MCP 導入前セルフチェックリスト（全 {totalChecklistCount} 項目）</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          新しい MCP サーバーを検証・検討する前に、各項目をクリックして確認漏れがないか点検できます（ブラウザ内一時状態のみ・社内申請代替ではありません）。
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
                        <div className="flex-1 lg:w-44 min-w-0 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-600">
                            <span>確認進捗</span>
                            <span aria-live="polite" className="shrink-0">
                              {checkedCount} / {totalChecklistCount} ({checklistProgressPercent}%)
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 transition-all duration-300"
                              style={{ width: `${checklistProgressPercent}%` }}
                            />
                          </div>
                        </div>

                        {checkedCount > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              playCyberClick();
                              setCheckedIds([]);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer shrink-0"
                          >
                            <RotateCcw size={12} />
                            <span>リセット</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredChecklist.map((chk) => {
                        const isChecked = checkedIds.includes(chk.id);
                        return (
                          <button
                            key={chk.id}
                            type="button"
                            onClick={() => toggleChecklistItem(chk.id)}
                            aria-pressed={isChecked}
                            className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                              isChecked
                                ? "bg-emerald-50/70 border-emerald-300 shadow-2xs"
                                : "bg-slate-50/60 border-slate-200 hover:border-indigo-300 hover:bg-white"
                            }`}
                          >
                            {isChecked ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-1.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                                  {chk.category}
                                </span>
                                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                                  {chk.title}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {chk.detail}
                              </p>
                              <div className="text-[11px] font-mono text-indigo-700">
                                ポイント: {chk.actionHint}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {checkedCount === totalChecklistCount && (
                      <div aria-live="polite" className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="font-bold">
                          全 {totalChecklistCount} 項目のセルフチェックを確認しました。実務データへ接続する場合は、社内ルールが確定するまで事前に AI 推進担当へご相談ください。
                        </div>
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 self-start lg:self-auto"
                        >
                          <span>事前相談する (/contact)</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    )}
                  </section>
                )}

                {/* 3. 関連ページ導線カード（/tools-hub・/guide・/contact） */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Link
                    href="/tools-hub"
                    onClick={() => playCyberClick()}
                    onMouseEnter={() => playCyberHover()}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-5 shadow-2xs transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <Lock size={18} />
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      AI Tools Hub（/tools-hub）
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      社内データ取り扱いセキュリティ基準（Level 1〜3）と、社内 AI 利用の注意事項 5 箇条を確認できます。
                    </p>
                  </Link>

                  <Link
                    href="/guide"
                    onClick={() => playCyberClick()}
                    onMouseEnter={() => playCyberHover()}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-5 shadow-2xs transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <BookOpen size={18} />
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Antigravity 導入ガイド（/guide）
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      会社の Google Cloud プロジェクト接続手順や、STEP 6 の安全設定（Security Preset: Default）を確認できます。
                    </p>
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => playCyberClick()}
                    onMouseEnter={() => playCyberHover()}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-cyan-300 p-5 shadow-2xs transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
                        <MessageSquare size={18} />
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      お問い合わせ・相談窓口（/contact）
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      新しい MCP サーバーの業務利用検討や、扱ってよいデータ範囲に迷った際の相談はこちらから行えます。
                    </p>
                  </Link>
                </section>
              </>
            )}
          </div>
        )}

        {/* 公式一次情報リンク & ポータル内関連ハブ */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                公式ドキュメント・関連ポータルページ
              </h3>
              <p className="text-xs text-slate-500">
                仕様変更や詳細な設定オプションは一次ドキュメントもあわせてご確認ください。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/tools-hub"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200"
              >
                AI Tools Hub
              </Link>
              <Link
                href="/guide"
                className="text-xs font-bold text-indigo-700 hover:text-indigo-800 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200"
              >
                Antigravity 導入ガイド
              </Link>
              <Link
                href="/contact"
                className="text-xs font-bold text-cyan-700 hover:text-cyan-800 px-3 py-1.5 rounded-lg bg-cyan-50 border border-cyan-200"
              >
                お問い合わせ
              </Link>
              <Link
                href="/skills-hub"
                className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200"
              >
                社内 Skills カタログ
              </Link>
              <Link
                href="/antigravity-info"
                className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200"
              >
                Antigravity 情報局
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {MCP_OFFICIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playCyberClick()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>{link.label}</span>
                <ExternalLink size={11} className="text-slate-400" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
