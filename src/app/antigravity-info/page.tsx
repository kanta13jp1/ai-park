"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Terminal,
  Cpu,
  BookOpen,
  PlayCircle,
  ShieldCheck,
  Search,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Compass,
  Zap,
  CheckCircle2,
  Lightbulb,
  Wrench,
  TableProperties,
  Keyboard,
  FileCode2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Video,
  X,
} from "lucide-react";
import HeroBanner from "@/components/HeroBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import AgentSwarmsSection from "@/components/antigravity/AgentSwarmsSection";
import WorkflowModeAdvisor from "@/components/antigravity/WorkflowModeAdvisor";
import InlineCodeText from "@/components/antigravity/InlineCodeText";
import OfficialVideoHub, { preloadAntigravityVideos } from "@/components/antigravity/OfficialVideoHub";
import { playCyberClick, playCyberHover, playCyberSuccess } from "@/lib/sound";
import { ANTIGRAVITY_VIDEO_COUNTS } from "@/data/antigravity-videos/meta";
import {
  antigravitySurfaces,
  antigravityFeatures,
  modalityComparison,
  practicalExamples,
  antigravityShortcuts,
  antigravityConfigTemplates,
  antigravityFaqs,
  swarmWorkspaceModes,
  swarmRolePatterns,
  swarmLifecycleSteps,
  workflowAdvisorScenarios,
  officialDocLinks,
  type FeatureCategory,
  type ExampleCategory,
  type SurfaceId,
} from "@/data/antigravity-info";

type TabId = "overview" | "features" | "examples" | "videos" | "reference";

const FEATURE_CATEGORIES: FeatureCategory[] = [
  "すべて",
  "AIモダリティ",
  "カスタマイズ・連携",
  "自律実行・テスト",
  "セキュリティ・権限",
];

const EXAMPLE_CATEGORIES: ExampleCategory[] = [
  "すべて",
  "調査・設計",
  "実装・リファクタ",
  "テスト・UI検証",
  "自動化・標準化",
];

const SURFACE_ICONS: Record<SurfaceId, typeof Cpu> = {
  app: Layers,
  ide: Sparkles,
  cli: Terminal,
  sdk: Cpu,
};

const SURFACE_COLORS: Record<SurfaceId, string> = {
  app: "bg-indigo-50 text-indigo-700 border-indigo-200",
  ide: "bg-cyan-50 text-cyan-700 border-cyan-200",
  cli: "bg-emerald-50 text-emerald-700 border-emerald-200",
  sdk: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function AntigravityInfoPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [featureCategory, setFeatureCategory] = useState<FeatureCategory>("すべて");
  const [exampleCategory, setExampleCategory] = useState<ExampleCategory>("すべて");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyAnnouncement, setCopyAnnouncement] = useState("");
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(antigravityFaqs[0]?.id ?? null);
  const [initialVideoId, setInitialVideoId] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      const vParam = params.get("v");
      if (
        tabParam === "overview" ||
        tabParam === "features" ||
        tabParam === "examples" ||
        tabParam === "videos" ||
        tabParam === "reference"
      ) {
        setActiveTab(tabParam);
      } else if (vParam) {
        setActiveTab("videos");
      }
      if (vParam) {
        setInitialVideoId(vParam);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredFeatures = useMemo(() => {
    return antigravityFeatures.filter((item) => {
      const matchCat = featureCategory === "すべて" || item.category === featureCategory;
      if (!matchCat) return false;
      if (!normalizedQuery) return true;
      const target = [
        item.name,
        item.summary,
        item.practicalTip,
        item.shortcutOrSyntax ?? "",
        ...item.details,
      ]
        .join(" ")
        .toLowerCase();
      return target.includes(normalizedQuery);
    });
  }, [featureCategory, normalizedQuery]);

  const filteredExamples = useMemo(() => {
    return practicalExamples.filter((item) => {
      const matchCat = exampleCategory === "すべて" || item.category === exampleCategory;
      if (!matchCat) return false;
      if (!normalizedQuery) return true;
      const target = [
        item.title,
        item.scene,
        item.prompt,
        ...item.usedFeatures,
        ...item.workflowSteps,
        ...item.checkPoints,
      ]
        .join(" ")
        .toLowerCase();
      return target.includes(normalizedQuery);
    });
  }, [exampleCategory, normalizedQuery]);

  const filteredShortcuts = useMemo(() => {
    if (!normalizedQuery) return antigravityShortcuts;
    return antigravityShortcuts.filter((item) =>
      [item.surface, item.keysOrCommand, item.action, item.notes]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredConfigTemplates = useMemo(() => {
    if (!normalizedQuery) return antigravityConfigTemplates;
    return antigravityConfigTemplates.filter((item) =>
      [item.title, item.filePath, item.description, item.code]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredFaqs = useMemo(() => {
    if (!normalizedQuery) return antigravityFaqs;
    return antigravityFaqs.filter((item) =>
      [item.category, item.question, item.answer]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        playCyberSuccess();
        setCopiedId(id);
        setCopyAnnouncement("クリップボードにコピーしました。");
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
        copyTimeoutRef.current = setTimeout(() => {
          setCopiedId((prev) => (prev === id ? null : prev));
          setCopyAnnouncement("");
        }, 2000);
      })
      .catch(() => {});
  };

  const syncUrlParams = (nextTab: TabId, nextVideoId?: string | null) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (nextTab === "overview") {
      url.searchParams.delete("tab");
      url.searchParams.delete("v");
    } else {
      url.searchParams.set("tab", nextTab);
      if (nextTab === "videos" && nextVideoId) {
        url.searchParams.set("v", nextVideoId);
      } else if (nextTab !== "videos") {
        url.searchParams.delete("v");
      }
    }
    window.history.replaceState(null, "", url.toString());
  };

  const selectTab = (nextTab: TabId, shouldScrollToTabs = false) => {
    setActiveTab(nextTab);
    syncUrlParams(nextTab);
    if (nextTab === "videos") {
      void preloadAntigravityVideos();
    }
    if (shouldScrollToTabs && typeof window !== "undefined") {
      const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("ag-tablist-container")?.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  const tabOrder: TabId[] = ["overview", "features", "examples", "videos", "reference"];
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
    selectTab(nextTab);
    document.getElementById(`ag-tab-${nextTab}`)?.focus();
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/70 min-h-screen">
      <HeroBanner
        title="Antigravity 情報局"
        subtitle="Google Antigravity の主要機能解説・実行環境比較・実務ですぐ使える実行例ガイド"
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <p className="sr-only" role="status" aria-live="polite">
          {copyAnnouncement}
        </p>

        {/* 一部工事中の誠実な注記（社内お知らせ・社内FAQは準備中） */}
        <UnderConstructionAlert
          title="🚧 一部工事中（機能解説・実務実行例を公開中）"
          statusType="construction"
          message="Google Antigravity の公式機能解説・実行環境ガイド・実務向けプロンプト実行例を公開しています。社内向けのお知らせ・社内固有の FAQ は現在準備中です。"
          prepDetails="社内向けお知らせ・社内共有 Rules / Skills の案内を順次追加予定"
          releaseDate="未定"
        />

        {/* クイック誘導・関連導線バナー */}
        <TiltCard maxTilt={2.5} glareOpacity={0.05} className="rounded-3xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-700/50 p-6 sm:p-7 text-white shadow-xl">
            <div className="absolute top-0 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 tracking-wider">
                    ANTIGRAVITY KNOWLEDGE HUB
                  </span>
                  <span className="text-xs text-indigo-200">
                    公式仕様に基づく機能解説 &amp; 実務実行例
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  機能の使い分けを知り、日々の開発・調査・検証をエージェントと進める
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Antigravity 2.0・IDE・CLI（<code className="text-cyan-300 font-mono">agy</code>）・SDK の全体像から、Skills・Rules・MCP・Subagents・Agent Swarms（<code className="text-cyan-300 font-mono">/swarm</code>）・Browser Automation などの実務での組み合わせ方までを整理しています。
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    playCyberClick();
                    selectTab("videos", true);
                  }}
                  onMouseEnter={() => {
                    playCyberHover();
                    void preloadAntigravityVideos();
                  }}
                  onFocus={() => void preloadAntigravityVideos()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-black text-slate-950 shadow-md transition-all cursor-pointer"
                >
                  <Video size={14} aria-hidden="true" />
                  <span>公式YouTube動画 ({ANTIGRAVITY_VIDEO_COUNTS.total}本)</span>
                </button>
                <Link
                  href="/guide"
                  onClick={() => playCyberClick()}
                  onMouseEnter={() => playCyberHover()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all"
                >
                  <BookOpen size={14} className="text-cyan-300" />
                  <span>導入ガイド</span>
                </Link>
                <Link
                  href="/academy"
                  onClick={() => playCyberClick()}
                  onMouseEnter={() => playCyberHover()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-xs font-bold text-white shadow-md transition-all"
                >
                  <PlayCircle size={14} />
                  <span>Antigravity Academy</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* タブ切り替え + 検索バー */}
        <div
          id="ag-tablist-container"
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs"
        >
          <div role="tablist" aria-label="Antigravity 情報局のセクション切替" className="flex flex-wrap gap-2">
            {(
              [
                { id: "overview", label: "全体像・使い分け", icon: Compass },
                { id: "features", label: `機能解説 (${antigravityFeatures.length})`, icon: Wrench },
                { id: "examples", label: `実務の実行例 (${practicalExamples.length})`, icon: Zap },
                { id: "videos", label: `公式YouTube動画 (${ANTIGRAVITY_VIDEO_COUNTS.total})`, icon: Video },
                { id: "reference", label: "リファレンス・FAQ", icon: HelpCircle },
              ] as const
            ).map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`ag-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`ag-panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  onClick={() => {
                    playCyberClick();
                    selectTab(tab.id);
                  }}
                  onMouseEnter={() => {
                    playCyberHover();
                    if (tab.id === "videos") {
                      void preloadAntigravityVideos();
                    }
                  }}
                  onFocus={() => {
                    if (tab.id === "videos") {
                      void preloadAntigravityVideos();
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <Icon size={15} className={`shrink-0 ${isActive ? "text-cyan-300" : "text-slate-500"}`} aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab !== "overview" && (
            <div className="relative w-full lg:w-64 shrink-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                aria-label="キーワードで絞り込み"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="キーワードで絞り込み..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="検索をクリア"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* タブ 1: 全体像・使い分け */}
        {activeTab === "overview" && (
          <div id="ag-panel-overview" role="tabpanel" aria-labelledby="ag-tab-overview" tabIndex={0} className="space-y-8">
            {/* 4つの実行環境（Surfaces） */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Layers size={19} className="text-indigo-600" />
                    <span>Antigravity の 4 つの実行環境（Surfaces）</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    同じエージェント基盤を、デスクトップアプリ・IDE・CLI・SDK の 4 つの形態から目的に応じて利用できます。
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {antigravitySurfaces.map((surface) => {
                  const Icon = SURFACE_ICONS[surface.id];
                  return (
                    <SpotlightCard
                      key={surface.id}
                      spotlightColor="rgba(99, 102, 241, 0.12)"
                      className="bg-white border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-cyan-300 flex items-center justify-center shrink-0">
                              <Icon size={20} />
                            </div>
                            <div>
                              <h4 className="text-base font-black text-slate-900">{surface.name}</h4>
                              <p className="text-xs font-semibold text-slate-500">{surface.tagline}</p>
                            </div>
                          </div>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${SURFACE_COLORS[surface.id]}`}
                          >
                            {surface.badge}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          <InlineCodeText text={surface.description} />
                        </p>

                        <ul className="space-y-1.5 pt-1">
                          {surface.highlights.map((hl) => (
                            <li key={hl} className="flex items-start gap-2 text-xs text-slate-700">
                              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span>
                                <InlineCodeText text={hl} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-500 font-medium">
                          <strong className="text-slate-700">向いている用途:</strong> {surface.recommendedFor}
                        </span>
                        <a
                          href={surface.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold shrink-0"
                        >
                          <span>Doc</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>
            </section>

            {/* 目的に合う実行モード診断（WorkflowModeAdvisor） */}
            <WorkflowModeAdvisor scenarios={workflowAdvisorScenarios} />

            {/* 操作モダリティ使い分け早見表 */}
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <TableProperties size={19} className="text-cyan-600" />
                  <span>操作モダリティ使い分け早見表</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  タスクの粒度や対象範囲に合わせてモダリティを選ぶと、手戻りを減らしつつ高速に作業できます。
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left border-collapse">
                    <caption className="sr-only">操作モダリティ使い分け早見表</caption>
                    <thead>
                      <tr className="bg-slate-900 text-slate-200 text-xs">
                        <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">モダリティ</th>
                        <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">呼び出し方</th>
                        <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">対象スコープ</th>
                        <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">最適なユースケース</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {modalityComparison.map((row) => (
                        <tr key={row.modality} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                            {row.modality}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-indigo-700">
                            <InlineCodeText
                              text={row.trigger}
                              codeClassName="font-mono bg-indigo-50 text-indigo-800 px-1 py-0.5 rounded"
                            />
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{row.scope}</td>
                          <td className="py-3.5 px-4 text-slate-700">{row.bestUseCase}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Agent Swarms (/swarm) 並列マルチエージェント運用ガイド */}
            <AgentSwarmsSection
              workspaceModes={swarmWorkspaceModes}
              rolePatterns={swarmRolePatterns}
              lifecycleSteps={swarmLifecycleSteps}
              onJumpToSwarmExamples={() => {
                setActiveTab("examples");
                setExampleCategory("すべて");
                setSearchQuery("Agent Swarms");
                const prefersReduced =
                  typeof window !== "undefined" &&
                  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
                document.getElementById("ag-tablist-container")?.scrollIntoView({
                  behavior: prefersReduced ? "auto" : "smooth",
                  block: "start",
                });
                requestAnimationFrame(() => {
                  document.getElementById("ag-tab-examples")?.focus();
                });
              }}
            />

            {/* 次に見るアクション */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => {
                  playCyberClick();
                  selectTab("features", true);
                }}
                className="text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-indigo-600">NEXT STEP 1</span>
                  <h4 className="text-base font-black text-slate-900">
                    機能解説カタログ（{antigravityFeatures.length} 項目）
                  </h4>
                  <p className="text-xs text-slate-600">
                    Skills・Rules・MCP・Subagents・Sandbox などの詳細仕様と活用ポイントを解説
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0"
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  playCyberClick();
                  selectTab("examples", true);
                }}
                className="text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-cyan-600">NEXT STEP 2</span>
                  <h4 className="text-base font-black text-slate-900">
                    実務の実行例＆プロンプト（{practicalExamples.length} 件）
                  </h4>
                  <p className="text-xs text-slate-600">
                    調査・リファクタ・ビルド検証・ブラウザ確認のコピーして使える実行例
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all shrink-0"
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  playCyberClick();
                  selectTab("videos", true);
                }}
                onMouseEnter={() => void preloadAntigravityVideos()}
                className="text-left p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950 text-white border border-indigo-700/50 hover:border-cyan-400 hover:shadow-md transition-all flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-cyan-300">NEXT STEP 3</span>
                  <h4 className="text-base font-black text-white">
                    公式 YouTube 動画学習（全 {ANTIGRAVITY_VIDEO_COUNTS.total} 本）
                  </h4>
                  <p className="text-xs text-slate-300">
                    要約・要点 3 点・確認クイズ・視聴進捗トラッカー付きで全動画を体系学習
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="text-cyan-300 group-hover:translate-x-1 transition-all shrink-0"
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  playCyberClick();
                  selectTab("reference", true);
                }}
                className="text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-600">NEXT STEP 4</span>
                  <h4 className="text-base font-black text-slate-900">
                    リファレンス・FAQ を見る
                  </h4>
                  <p className="text-xs text-slate-600">
                    ショートカット早見表・設定テンプレート・よくある質問（{antigravityFaqs.length} 問）
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0"
                />
              </button>
            </section>
          </div>
        )}

        {/* タブ 2: 機能解説カタログ */}
        {activeTab === "features" && (
          <div id="ag-panel-features" role="tabpanel" aria-labelledby="ag-tab-features" tabIndex={0} className="space-y-6">
            <div role="group" aria-label="機能カテゴリ絞り込み" className="flex flex-wrap gap-2">
              {FEATURE_CATEGORIES.map((cat) => {
                const active = featureCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      playCyberClick();
                      setFeatureCategory(cat);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      active
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {filteredFeatures.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
                <p className="text-sm text-slate-500">
                  条件に一致する機能解説が見つかりませんでした。検索条件をリセットしてお試しください。
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFeatureCategory("すべて");
                    setSearchQuery("");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  条件をリセット
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filteredFeatures.map((feat) => (
                  <SpotlightCard
                    key={feat.id}
                    spotlightColor="rgba(6, 182, 212, 0.1)"
                    className="bg-white border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {feat.category}
                        </span>
                        <a
                          href={feat.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                          <span>公式Doc</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>

                      <div>
                        <h3 className="text-base font-black text-slate-900">{feat.name}</h3>
                        {feat.shortcutOrSyntax && (
                          <p className="mt-1 text-xs font-mono text-cyan-700 bg-cyan-50/70 border border-cyan-200/70 rounded-lg px-2.5 py-1 inline-block">
                            {feat.shortcutOrSyntax}
                          </p>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <InlineCodeText text={feat.summary} />
                      </p>

                      <ul className="space-y-1.5 pt-1">
                        {feat.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                            <span>
                              <InlineCodeText text={detail} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3 flex items-start gap-2.5 text-xs text-amber-950">
                      <Lightbulb size={15} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">実務のコツ: </span>
                        <span>
                          <InlineCodeText
                            text={feat.practicalTip}
                            codeClassName="font-mono text-[0.9em] bg-amber-100/80 text-amber-950 px-1 py-0.5 rounded break-words"
                          />
                        </span>
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* タブ 3: 実務の実行例 */}
        {activeTab === "examples" && (
          <div id="ag-panel-examples" role="tabpanel" aria-labelledby="ag-tab-examples" tabIndex={0} className="space-y-6">
            <div role="group" aria-label="実行例カテゴリ絞り込み" className="flex flex-wrap gap-2">
              {EXAMPLE_CATEGORIES.map((cat) => {
                const active = exampleCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      playCyberClick();
                      setExampleCategory(cat);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      active
                        ? "bg-cyan-600 text-white border-cyan-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:border-cyan-300 hover:text-cyan-700"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {filteredExamples.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
                <p className="text-sm text-slate-500">
                  条件に一致する実行例が見つかりませんでした。検索条件をリセットしてお試しください。
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setExampleCategory("すべて");
                    setSearchQuery("");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  条件をリセット
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredExamples.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300">
                            CASE {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                            {ex.category}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                          {ex.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600">{ex.scene}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 shrink-0">
                        {ex.usedFeatures.map((uf) => (
                          <span
                            key={uf}
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {uf}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* コピー可能なプロンプト / コマンド例 */}
                    <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          実行プロンプト / コマンド例
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(ex.id, ex.prompt)}
                          onMouseEnter={() => playCyberHover()}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-all cursor-pointer"
                        >
                          {copiedId === ex.id ? (
                            <>
                              <Check size={13} className="text-emerald-400" />
                              <span className="text-emerald-300">コピー済み</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>コピー</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-xs text-cyan-200 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                        {ex.prompt}
                      </pre>
                    </div>

                    {/* 実行フロー & 確認ポイント */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-2">
                        <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <Zap size={14} className="text-indigo-600" />
                          <span>実行の流れ</span>
                        </h4>
                        <ol className="space-y-1.5 text-xs text-slate-700 list-decimal list-inside">
                          {ex.workflowSteps.map((step) => (
                            <li key={step} className="leading-relaxed">
                              <InlineCodeText text={step} />
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="rounded-xl bg-emerald-50/50 border border-emerald-200/70 p-4 space-y-2">
                        <h4 className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-emerald-600" />
                          <span>確認ポイント（品質・安全）</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-emerald-950">
                          {ex.checkPoints.map((cp) => (
                            <li key={cp} className="flex items-start gap-1.5 leading-relaxed">
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                              <span>
                                <InlineCodeText text={cp} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* タブ 4: 公式YouTube動画学習 */}
        {activeTab === "videos" && (
          <div id="ag-panel-videos" role="tabpanel" aria-labelledby="ag-tab-videos" tabIndex={0}>
            <OfficialVideoHub
              searchQuery={searchQuery}
              initialVideoId={initialVideoId}
              onSelectVideoId={(videoId) => syncUrlParams("videos", videoId)}
              onResetSearch={() => setSearchQuery("")}
            />
          </div>
        )}

        {/* タブ 5: リファレンス・FAQ */}
        {activeTab === "reference" && (
          <div id="ag-panel-reference" role="tabpanel" aria-labelledby="ag-tab-reference" tabIndex={0} className="space-y-8">
            {filteredShortcuts.length === 0 &&
              filteredConfigTemplates.length === 0 &&
              filteredFaqs.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
                  <p className="text-sm text-slate-500">
                    条件に一致するリファレンス・FAQ が見つかりませんでした。検索条件をリセットしてお試しください。
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    検索をリセット
                  </button>
                </div>
              )}

            {/* ショートカット・コマンド早見表 */}
            {filteredShortcuts.length > 0 && (
              <section className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Keyboard size={19} className="text-indigo-600" aria-hidden="true" />
                    <span>ショートカット・CLI コマンド早見表</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    IDE・Chat Canvas・Antigravity CLI（
                    <code className="font-mono text-xs bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded">
                      agy
                    </code>
                    ）でよく使う操作のまとめです。
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left border-collapse">
                      <caption className="sr-only">ショートカット・CLI コマンド早見表</caption>
                      <thead>
                        <tr className="bg-slate-900 text-slate-200 text-xs">
                          <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">環境</th>
                          <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">キー / コマンド</th>
                          <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">動作</th>
                          <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">補足</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                        {filteredShortcuts.map((item) => (
                          <tr key={`${item.surface}-${item.keysOrCommand}`} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px]">
                                {item.surface}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs font-bold text-indigo-700 whitespace-nowrap">
                              {item.keysOrCommand}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-900">{item.action}</td>
                            <td className="py-3 px-4 text-slate-600 text-xs">{item.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* 設定テンプレート・構成例 */}
            {filteredConfigTemplates.length > 0 && (
              <section className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <FileCode2 size={19} className="text-cyan-600" />
                    <span>設定テンプレート・ディレクトリ構成例</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    <code className="font-mono text-xs bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded">
                      .agents/
                    </code>{" "}
                    配下の Skill 定義や CLI 設定パス、セキュリティポリシー項目を確認できます。
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredConfigTemplates.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-sm sm:text-base font-black text-slate-900">{tmpl.title}</h4>
                          <p className="text-xs font-mono text-indigo-600 mt-0.5">{tmpl.filePath}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(tmpl.id, tmpl.code)}
                          onMouseEnter={() => playCyberHover()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all cursor-pointer self-start sm:self-auto"
                        >
                          {copiedId === tmpl.id ? (
                            <>
                              <Check size={13} className="text-emerald-400" />
                              <span className="text-emerald-300">コピー済み</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>テンプレートをコピー</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600">{tmpl.description}</p>
                      <pre className="rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs text-cyan-200 font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {tmpl.code}
                      </pre>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* よくある質問（FAQ） */}
            {filteredFaqs.length > 0 && (
              <section className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <HelpCircle size={19} className="text-emerald-600" />
                    <span>よくある質問（公式仕様ベース FAQ）</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    使い分け・設定の優先順位・
                    <code className="font-mono text-xs bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded">
                      .agents/
                    </code>{" "}
                    の読み込み仕様など、よくある疑問をまとめています。
                  </p>
                </div>

                <div className="space-y-3">
                  {filteredFaqs.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs"
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`ag-faq-panel-${faq.id}`}
                          onClick={() => {
                            playCyberClick();
                            setOpenFaqId(isOpen ? null : faq.id);
                          }}
                          className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                        >
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                              {faq.category}
                            </span>
                            <span className="text-xs sm:text-sm font-black text-slate-900">
                              Q. {faq.question}
                            </span>
                          </div>
                          {isOpen ? (
                            <ChevronUp size={18} className="text-slate-400 shrink-0" aria-hidden="true" />
                          ) : (
                            <ChevronDown size={18} className="text-slate-400 shrink-0" aria-hidden="true" />
                          )}
                        </button>
                        {isOpen && (
                          <div
                            id={`ag-faq-panel-${faq.id}`}
                            className="px-5 pb-4 pt-1 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/40"
                          >
                            <InlineCodeText text={faq.answer} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}

        {/* 公式ドキュメント・関連ハブリンク */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Google Antigravity 公式ドキュメント・関連ページ
              </h3>
              <p className="text-xs text-slate-500">
                最新の仕様変更・詳細オプションは公式リファレンスもあわせてご確認ください。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/skills-hub"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200"
              >
                社内 Skills カタログ
              </Link>
              <Link
                href="/mcp-hub"
                className="text-xs font-bold text-cyan-700 hover:text-cyan-800 px-3 py-1.5 rounded-lg bg-cyan-50 border border-cyan-200"
              >
                MCP 連携ハブ
              </Link>
              <Link
                href="/agent-cases"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200"
              >
                エージェント・Swarm ガイド
              </Link>
              <Link
                href="/troubleshooting"
                className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200"
              >
                Windows トラブルシューター
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {officialDocLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
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
