"use client";

import HeroBanner from "@/components/HeroBanner";
import OfficeHourBanner from "@/components/OfficeHourBanner";
import UnderConstructionAlert from "@/components/UnderConstructionAlert";
import SpotlightCard from "@/components/SpotlightCard";
import TiltCard from "@/components/TiltCard";
import SkillApplicationModal from "@/components/skills/SkillApplicationModal";
import { playCyberClick, playCyberSuccess, playCyberHover } from "@/lib/sound";
import {
  WORKSPACE_SKILLS,
  CUSTOMIZATION_COMPARISON,
  SKILL_DISCOVERY_TIERS,
  SKILL_TEMPLATES,
} from "@/data/skills-hub";
import {
  Wrench,
  Copy,
  Check,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Layers,
  Plus,
  Compass,
  ExternalLink,
  BookOpen,
  FileCode2,
  Terminal,
  Sparkles,
  FolderTree,
} from "lucide-react";
import { useState, useMemo, type KeyboardEvent as ReactKeyboardEvent } from "react";
import Link from "next/link";

type TabId = "catalog" | "guide" | "templates";
const TAB_ORDER: TabId[] = ["catalog", "guide", "templates"];

export default function SkillsHubPage() {
  const [activeTab, setActiveTab] = useState<TabId>("catalog");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyErrorId, setCopyErrorId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [liveNotice, setLiveNotice] = useState("");

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
    document.getElementById(`skills-hub-tab-${nextTab}`)?.focus();
  };

  const categories = ["all", "品質・UAT", "運用自動化", "コード・品質"] as const;

  const filteredSkills = useMemo(() => {
    return WORKSPACE_SKILLS.filter((skill) => {
      const matchCategory = selectedCategory === "all" || skill.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        q === "" ||
        skill.name.toLowerCase().includes(q) ||
        skill.displayName.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.triggerPhrase.toLowerCase().includes(q) ||
        skill.sourcePath.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = async (id: string, text: string) => {
    playCyberClick();
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      setCopyErrorId(id);
      setLiveNotice("クリップボードへコピーできませんでした。手動でコピーしてください");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      playCyberSuccess();
      setCopyErrorId(null);
      setCopiedId(id);
      setLiveNotice("クリップボードにコピーしました");
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2000);
    } catch {
      setCopyErrorId(id);
      setLiveNotice("クリップボードへのコピーに失敗しました");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <div role="status" aria-live="polite" className="sr-only">
        {liveNotice}
      </div>
      <HeroBanner
        title="社内 Skills カタログ"
        subtitle="AI Park 実運用 Skills の参考実例・作り方ガイド・SKILL.md テンプレート（全社カタログ準備中）"
      />
      <OfficeHourBanner />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <UnderConstructionAlert
          statusType="construction"
          title="🚧 工事中：全社共有の社内Skillsカタログを準備しています"
          message="全社共通の審査・公開カタログは準備中です。以下では AI Park リポジトリ（.agents/skills/）で実際に使っている運用スキル 4 件と、自作向けガイド・スターターテンプレートを掲載しています。"
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
                  <Wrench size={14} className="text-indigo-400" />
                  <span>ANTIGRAVITY SKILLS</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                  定型手順とチェック観点を「再現できるスキル」へ
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Antigravity Skills は、プロジェクトで培った定常業務・品質チェック・公開前確認などを{" "}
                  <code className="text-cyan-300 font-mono">SKILL.md</code> にまとめた手順書です。
                  リポジトリの <code className="text-cyan-300 font-mono">.agents/skills/</code> に配置するだけで、エージェントが必要な場面で自律的に読み込んで実行できます。
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setIsApplyModalOpen(true);
                    }}
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>新規Skillを提案・申請する</span>
                  </button>
                  <Link
                    href="/guide"
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white font-bold text-xs transition-colors border border-white/15"
                  >
                    <span>導入ガイドを見る</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/antigravity-info"
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white font-bold text-xs transition-colors border border-white/15"
                  >
                    <span>Antigravity情報局</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/study-archive"
                    onMouseEnter={() => playCyberHover()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white font-bold text-xs transition-colors border border-white/15"
                  >
                    <span>AI勉強会アーカイブ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 shrink-0 font-mono text-xs space-y-2 w-full lg:w-auto">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>SAFETY CHECKLIST（推奨確認観点）</span>
                </div>
                <div className="text-slate-200">・シークレット・APIキー非含有の検証済</div>
                <div className="text-slate-200">・破壊的コマンド（DROP/RM）の遮断</div>
                <div className="text-slate-200">・YAMLフロントマター（name / description）と明確な手順記述</div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* タブ切り替えバー */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div role="tablist" aria-label="社内 Skills カタログのセクション切替" className="flex flex-wrap items-center gap-1.5">
            <button
              id="skills-hub-tab-catalog"
              type="button"
              role="tab"
              aria-selected={activeTab === "catalog"}
              aria-controls="skills-hub-panel-catalog"
              tabIndex={activeTab === "catalog" ? 0 : -1}
              onKeyDown={(e) => handleTabKeyDown(e, 0)}
              onClick={() => {
                playCyberClick();
                setActiveTab("catalog");
              }}
              onMouseEnter={() => playCyberHover()}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "catalog"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>実運用スキル一覧 ({WORKSPACE_SKILLS.length})</span>
            </button>
            <button
              id="skills-hub-tab-guide"
              type="button"
              role="tab"
              aria-selected={activeTab === "guide"}
              aria-controls="skills-hub-panel-guide"
              tabIndex={activeTab === "guide" ? 0 : -1}
              onKeyDown={(e) => handleTabKeyDown(e, 1)}
              onClick={() => {
                playCyberClick();
                setActiveTab("guide");
              }}
              onMouseEnter={() => playCyberHover()}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "guide"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Skills の仕組み & 使い分け</span>
            </button>
            <button
              id="skills-hub-tab-templates"
              type="button"
              role="tab"
              aria-selected={activeTab === "templates"}
              aria-controls="skills-hub-panel-templates"
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
              <span>SKILL.md テンプレート ({SKILL_TEMPLATES.length})</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500 px-2">
            ※ 全社審査済みカタログは工事中（現在は実例＋テンプレートを掲載）
          </span>
        </div>

        {/* タブ1: 実運用スキル一覧 */}
        {activeTab === "catalog" && (
          <div id="skills-hub-panel-catalog" role="tabpanel" aria-labelledby="skills-hub-tab-catalog" className="space-y-6">
            {/* フィルター＆検索バー */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    type="text"
                    aria-label="スキルを検索"
                    placeholder="スキル名、構文、キーワード、ファイルパスで検索..."
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

                <button
                  type="button"
                  onClick={() => {
                    playCyberClick();
                    setIsApplyModalOpen(true);
                  }}
                  onMouseEnter={() => playCyberHover()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                  <span>自作Skillの提案</span>
                </button>
              </div>

              <div role="group" aria-label="カテゴリで絞り込み" className="flex flex-wrap items-center gap-2 pb-1 pt-1">
                <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>カテゴリ:</span>
                </span>
                {categories.map((cat) => {
                  const count =
                    cat === "all"
                      ? WORKSPACE_SKILLS.length
                      : WORKSPACE_SKILLS.filter((s) => s.category === cat).length;
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

            {/* スキル一覧 */}
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div>
                  <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" aria-hidden="true" />
                    <span>AI Park 実運用 Skills（参考実例・準備中）</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    AI Park リポジトリ内の <code className="font-mono">.agents/skills/</code> で運用している実在スキル定義です
                  </p>
                </div>
                <span aria-live="polite" className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80 self-start lg:self-auto shrink-0 whitespace-nowrap">
                  該当 {filteredSkills.length} / 全 {WORKSPACE_SKILLS.length} 件
                </span>
              </div>

              {filteredSkills.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                  <Compass className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-600">
                    該当するスキルが見つかりませんでした
                  </p>
                  <p className="text-xs text-slate-400">
                    検索キーワードやカテゴリを変更してお試しください。
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredSkills.map((skill) => (
                    <TiltCard
                      key={skill.id}
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
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
                                {skill.status}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                {skill.category}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                                {skill.displayName}
                              </h3>
                              <div className="text-[11px] font-mono text-slate-500 break-all">
                                {skill.sourcePath}
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {skill.description}
                            </p>

                            {/* 呼び出し例 */}
                            <div className="space-y-1.5 font-mono">
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span>呼び出しプロンプト例:</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(skill.id, skill.triggerPhrase)}
                                  onMouseEnter={() => playCyberHover()}
                                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer"
                                >
                                  {copiedId === skill.id ? (
                                    <>
                                      <Check size={12} className="text-emerald-600" />
                                      <span className="text-emerald-600">コピー完了</span>
                                    </>
                                  ) : copyErrorId === skill.id ? (
                                    <span className="text-rose-600">コピー失敗（手動選択してください）</span>
                                  ) : (
                                    <>
                                      <Copy size={12} />
                                      <span>構文をコピー</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="bg-slate-950 text-cyan-300 p-3 rounded-xl text-xs overflow-x-auto border border-slate-800">
                                <code>{skill.triggerPhrase}</code>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                            <span className="text-slate-400">出どころ: {skill.author}</span>
                            <a
                              href={skill.githubUrl}
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

        {/* タブ2: Skills の仕組み & 使い分け */}
        {activeTab === "guide" && (
          <div id="skills-hub-panel-guide" role="tabpanel" aria-labelledby="skills-hub-tab-guide" className="space-y-8">
            {/* Progressive Disclosure の解説 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    なぜ Rules だけでなく Skills を使うのか？（Progressive Disclosure）
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <code className="font-mono text-indigo-700">AGENTS.md</code> などの Rules は会話のたびに常時読み込まれるため、長い手順書をすべて書くとコンテキストを圧迫します。
                    一方 <strong>Skills</strong> は、通常時は「スキル名（<code className="font-mono">name</code>）と概要（<code className="font-mono">description</code>）」だけを読み込み、
                    <strong>関連するタスクを実行するときだけエージェントが <code className="font-mono">SKILL.md</code> の全文を読み込む（Progressive Disclosure）</strong>仕組みになっています。
                  </p>
                </div>
              </div>
            </div>

            {/* カスタマイズ 5 機能の使い分け表 */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Antigravity カスタマイズ機能 5 種の使い分け
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  目的に合わせて Rules・Skills・Hooks・MCP・Plugins を使い分けます
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold">
                      <th className="py-3 px-4 whitespace-nowrap">種別</th>
                      <th className="py-3 px-4 whitespace-nowrap">設定ファイル / 配置先</th>
                      <th className="py-3 px-4 whitespace-nowrap">読み込みタイミング</th>
                      <th className="py-3 px-4 min-w-[220px] whitespace-nowrap">向いている用途</th>
                      <th className="py-3 px-4 min-w-[200px] whitespace-nowrap">動作の仕組み</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {CUSTOMIZATION_COMPARISON.map((row) => (
                      <tr key={row.type} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4 font-extrabold text-indigo-700 whitespace-nowrap">
                          {row.type}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                          {row.configPath}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{row.loadingTiming}</td>
                        <td className="py-3.5 px-4 text-slate-700 leading-relaxed">{row.bestFor}</td>
                        <td className="py-3.5 px-4 text-slate-600 leading-relaxed">{row.enforcement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 読み込み優先順位 3 階層 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-indigo-600" aria-hidden="true" />
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Skills の配置場所と読み込み優先順位
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {SKILL_DISCOVERY_TIERS.map((tier) => (
                  <div
                    key={tier.priority}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-mono font-bold">
                        優先度 {tier.priority}
                      </span>
                      <span className="text-[11px] font-bold text-indigo-600">
                        {tier.scope}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900">{tier.label}</h3>
                    <div className="bg-slate-100 text-slate-800 px-2.5 py-1.5 rounded-lg font-mono text-[11px] break-all">
                      {tier.path}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{tier.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* タブ3: SKILL.md テンプレート */}
        {activeTab === "templates" && (
          <div id="skills-hub-panel-templates" role="tabpanel" aria-labelledby="skills-hub-tab-templates" className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-indigo-600" aria-hidden="true" />
                <span>そのまま使える SKILL.md スターターテンプレート（全 {SKILL_TEMPLATES.length} 種）</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                自分のリポジトリに <code className="font-mono">.agents/skills/&lt;フォルダ名&gt;/SKILL.md</code> を作成して貼り付けるだけで使えます。AI勉強会の「ステップ1：スキル作成課題」のベースとしても利用できます。
              </p>
            </div>

            <div className="space-y-6">
              {SKILL_TEMPLATES.map((tpl) => {
                const cmdCopyId = `tpl-cmd-${tpl.id}`;
                const mdCopyId = `tpl-md-${tpl.id}`;
                return (
                  <div
                    key={tpl.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                          .agents/skills/{tpl.folderName}/SKILL.md
                        </div>
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                          {tpl.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600">{tpl.summary}</p>
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
                              <Check size={12} className="text-emerald-600" aria-hidden="true" />
                              <span className="text-emerald-600">コピー完了</span>
                            </>
                          ) : copyErrorId === cmdCopyId ? (
                            <span className="text-rose-600">コピー失敗（手動コピーしてください）</span>
                          ) : (
                            <>
                              <Copy size={12} aria-hidden="true" />
                              <span>コマンドをコピー</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-slate-900 text-emerald-300 p-3 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                        <code>{tpl.powershellCmd}</code>
                      </div>
                    </div>

                    {/* SKILL.md 全文 */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span>2. SKILL.md 内容（そのまま貼り付け）</span>
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
                              <span>SKILL.md をコピー</span>
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

      {/* 新規Skill提案モーダル */}
      <SkillApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}
