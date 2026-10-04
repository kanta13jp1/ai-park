"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import TiltCard from "@/components/TiltCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import SpotlightCard from "@/components/SpotlightCard";
import { basePath } from "@/lib/basePath";
import {
  aiNewsMaster,
  aiNewsCategoryMaster,
  type AINewsItem,
} from "@/data/ai-news";
import { playCyberHover, playCyberClick } from "@/lib/sound";
import {
  Search,
  ExternalLink,
  Share2,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Filter,
  Calendar,
  Newspaper,
  ArrowUpRight,
  Tag,
  Flame,
  Zap,
  Check,
  X,
  Building2,
  Layers,
  BookOpen,
  MessageSquareShare,
  RefreshCw,
  Radio,
  Activity,
  ShieldCheck,
  Globe,
} from "lucide-react";

export default function AiNewsPage() {
  const [newsList, setNewsList] = useState<AINewsItem[]>(aiNewsMaster);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("2026/10/03 23:42:36");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshSuccess, setRefreshSuccess] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImportance, setSelectedImportance] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 自動同期パイプラインから最新ニュースをフェッチ（Fail-Open安全設計）
  const fetchLiveNews = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
      playCyberClick();
    }
    try {
      const res = await fetch(`${basePath}/data/ai-news-live.json?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          setNewsList(data.items);
          if (data.lastSyncedAtFormatted) {
            setLastSyncedAt(data.lastSyncedAtFormatted);
          }
          setIsLiveActive(true);
          if (isManual) {
            setRefreshSuccess(true);
            setTimeout(() => setRefreshSuccess(false), 3000);
          }
        }
      }
    } catch (err) {
      console.warn("[News Pipeline] Live fetch error, fallback to static master:", err);
    } finally {
      if (isManual) {
        setIsRefreshing(false);
      }
    }
  }, []);

  // 初期ロード時に自動実行（マウントクリーンアップ付き）
  useEffect(() => {
    let ignore = false;
    const loadLiveNews = async () => {
      try {
        const res = await fetch(`${basePath}/data/ai-news-live.json?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (res.ok && !ignore) {
          const data = await res.json();
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            setNewsList(data.items);
            if (data.lastSyncedAtFormatted) {
              setLastSyncedAt(data.lastSyncedAtFormatted);
            }
            setIsLiveActive(true);
          }
        }
      } catch (err) {
        console.warn("[News Pipeline] Live fetch error, fallback to static master:", err);
      }
    };

    loadLiveNews();
    return () => {
      ignore = true;
    };
  }, []);

  // フィルタリング
  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      // カテゴリ絞り込み
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // 重要度絞り込み
      if (selectedImportance !== "all" && item.importance !== selectedImportance) {
        return false;
      }
      // 検索キーワード
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchSummary = item.summary.toLowerCase().includes(query);
        const matchImpact = item.impactForStaff.toLowerCase().includes(query);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(query));
        const matchSource = item.sourceName.toLowerCase().includes(query);
        return matchTitle || matchSummary || matchImpact || matchTags || matchSource;
      }
      return true;
    });
  }, [selectedCategory, selectedImportance, searchQuery]);

  // URL共有コピー
  const handleCopyShareUrl = (item: AINewsItem) => {
    playCyberClick();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}#${item.id}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2500);
      });
    }
  };

  // 重要度バッジのスタイリング
  const getImportanceBadge = (importance: AINewsItem["importance"], label: string) => {
    switch (importance) {
      case "hot":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-600 border border-rose-500/20 shadow-xs">
            <Flame size={11} className="text-rose-500 animate-pulse" />
            <span>{label}</span>
          </span>
        );
      case "official":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-600 border border-blue-500/20 shadow-xs">
            <CheckCircle2 size={11} className="text-blue-500" />
            <span>{label}</span>
          </span>
        );
      case "release":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-xs">
            <Zap size={11} className="text-emerald-500" />
            <span>{label}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Tag size={10} className="text-slate-500" />
            <span>{label}</span>
          </span>
        );
    }
  };

  // カテゴリバッジのスタイリング
  const getCategoryBadge = (category: AINewsItem["category"], label: string) => {
    switch (category) {
      case "internal":
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
            🏢 {label}
          </span>
        );
      case "google":
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200/70">
            🌐 {label}
          </span>
        );
      case "model":
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/70">
            🧠 {label}
          </span>
        );
      case "agent_mcp":
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/70">
            🤖 {label}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            📰 {label}
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50/80 bg-grid-pattern min-h-screen">
      <HeroBanner
        title={
          <span className="break-keep inline-flex flex-wrap items-center justify-center gap-x-2">
            <span className="whitespace-nowrap">最新AIニュース</span>
            <span className="text-cyan-300 font-mono text-xl sm:text-2xl md:text-3xl">&</span>
            <span className="whitespace-nowrap">リリースレーダー</span>
          </span>
        }
        subtitle="社内外の生成AI・エージェント・基盤モデル・社内AI Parkの最新公式アップデートを一括キャッチアップ"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* 自動巡回パイプライン HUDステータスバー */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-indigo-500/30 shadow-lg relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
                <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-black tracking-wide text-white uppercase flex items-center gap-1.5">
                    ⚡ 自動巡回ニュースパイプライン
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    完全自動反映 (LIVE)
                  </span>
                  {refreshSuccess && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/50 animate-bounce">
                      <Check size={10} />
                      最新ライブデータを同期しました
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  GitHub Actions（6時間定時Cron）が各社公式フィード（Google DeepMind, OpenAI, Anthropic, xAI, DeepSeek等）を自動巡回・最新情報を即時反映。
                </p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-1.5 font-mono">
                  <span>最終自動巡回: <strong className="text-indigo-200">{lastSyncedAt}</strong></span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">配信中: <strong className="text-emerald-300">{newsList.length}件</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <button
                onClick={() => fetchLiveNews(true)}
                disabled={isRefreshing}
                onMouseEnter={() => playCyberHover()}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isRefreshing
                    ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
                <span>{isRefreshing ? "同期中..." : "最新ニュースを今すぐ再取得"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPIサマリーカード */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <TiltCard maxTilt={5} glareOpacity={0.08} className="h-full rounded-2xl">
            <div
              onMouseEnter={() => playCyberHover()}
              className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3 h-full"
            >
              <div className="p-2.5 sm:p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <Newspaper className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">配信中ニュース</p>
                <p className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1 font-mono">
                  <AnimatedCounter value={newsList.length} duration={800} />
                  <span className="text-xs font-normal text-slate-500">件</span>
                </p>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={5} glareOpacity={0.08} className="h-full rounded-2xl">
            <div
              onMouseEnter={() => playCyberHover()}
              className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3 h-full"
            >
              <div className="p-2.5 sm:p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">社内リリース</p>
                <p className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1 font-mono">
                  <AnimatedCounter value={newsList.filter((n) => n.category === "internal").length} duration={800} />
                  <span className="text-xs font-normal text-slate-500">件</span>
                </p>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={5} glareOpacity={0.08} className="h-full rounded-2xl">
            <div
              onMouseEnter={() => playCyberHover()}
              className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3 h-full"
            >
              <div className="p-2.5 sm:p-3 bg-sky-50 text-sky-600 rounded-xl shrink-0">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">主要各社 / 一次情報</p>
                <p className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1 font-mono">
                  <AnimatedCounter value={newsList.filter((n) => n.category !== "internal").length} duration={800} />
                  <span className="text-xs font-normal text-slate-500">件</span>
                </p>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={5} glareOpacity={0.08} className="h-full rounded-2xl">
            <div
              onMouseEnter={() => playCyberHover()}
              className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3 h-full"
            >
              <div className="p-2.5 sm:p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">情報更新日</p>
                <p className="text-sm sm:text-base font-black text-slate-900 tracking-tight font-mono">
                  {lastSyncedAt.split(" ")[0] || "2026/10/03"}
                </p>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* フィルター＆検索ツールバー */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* 検索入力欄 */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ニュース、タグ、キーワードで検索..."
                className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* 重要度フィルター */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs text-slate-500 font-bold shrink-0 mr-1 flex items-center gap-1">
                <Filter size={12} />
                <span>重要度:</span>
              </span>
              {[
                { id: "all", label: "すべて" },
                { id: "hot", label: "HOT 🔥" },
                { id: "official", label: "公式発表 📢" },
                { id: "release", label: "社内リリース 🚀" },
                { id: "tech", label: "技術解説 🛠️" },
              ].map((imp) => (
                <button
                  key={imp.id}
                  onClick={() => {
                    playCyberClick();
                    setSelectedImportance(imp.id);
                  }}
                  onMouseEnter={playCyberHover}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    selectedImportance === imp.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {imp.label}
                </button>
              ))}
            </div>
          </div>

          {/* カテゴリピルタブ */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
            {aiNewsCategoryMaster.map((cat) => {
              const count =
                cat.id === "all"
                  ? newsList.length
                  : newsList.filter((item) => item.category === cat.id).length;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playCyberClick();
                    setSelectedCategory(cat.id);
                  }}
                  onMouseEnter={playCyberHover}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? "bg-indigo-700 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* メインレイアウト: ニュース一覧 (8) + サイドバー (4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ニュース一覧エリア */}
          <div className="lg:col-span-8 space-y-5">
            {filteredNews.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  該当するニュースが見つかりませんでした
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  検索キーワードを変更するか、フィルターをリセットしてお試しください。
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedImportance("all");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  フィルターをリセット
                </button>
              </div>
            ) : (
              filteredNews.map((news) => (
                <TiltCard
                  key={news.id}
                  id={news.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all p-5 sm:p-6 space-y-4 group"
                >
                  {/* ヘッダーメタ情報 */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(news.category, news.categoryLabel)}
                      {getImportanceBadge(news.importance, news.importanceLabel)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <Calendar size={12} />
                      <span>{news.date}</span>
                    </div>
                  </div>

                  {/* タイトル */}
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug break-keep">
                    {news.title}
                  </h3>

                  {/* サマリー */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light break-keep">
                    {news.summary}
                  </p>

                  {/* 社内実務へのインパクトボックス */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Sparkles size={13} className="text-indigo-600 shrink-0" />
                      <span>社内実務への影響・メリット:</span>
                    </div>
                    <p className="text-slate-600 pl-4 leading-relaxed font-light break-keep">
                      {news.impactForStaff}
                    </p>
                  </div>

                  {/* おすすめ対象＆タグ */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-[11px]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-400 font-medium">対象:</span>
                      {news.recommendedFor.map((r, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold"
                        >
                          {r}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-1">
                      {news.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-indigo-50/60 text-indigo-700 text-[10px] font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* アクションボタンバー */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="font-medium">出典:</span>
                      <span className="font-bold text-slate-700">{news.sourceName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* URL共有コピーボタン */}
                      <button
                        onClick={() => handleCopyShareUrl(news)}
                        onMouseEnter={playCyberHover}
                        title="記事の直接リンクをクリップボードにコピー"
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        {copiedId === news.id ? (
                          <>
                            <Check size={13} className="text-emerald-600" />
                            <span className="text-emerald-600">コピー済</span>
                          </>
                        ) : (
                          <>
                            <Share2 size={13} />
                            <span>共有</span>
                          </>
                        )}
                      </button>

                      {/* 一次情報リンク */}
                      <a
                        href={news.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={playCyberClick}
                        onMouseEnter={playCyberHover}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>一次情報を見る</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </TiltCard>
              ))
            )}
          </div>

          {/* 右サイドバー: ハイライト＆社内推奨 */}
          <div className="lg:col-span-4 space-y-6">
            {/* 今週のAIトレンド要点 SpotlightCard */}
            <SpotlightCard
              spotlightColor="rgba(99, 102, 241, 0.2)"
              className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-700/50 shadow-xl space-y-4"
            >
              <div className="flex items-center gap-2 text-cyan-400">
                <TrendingUp size={18} />
                <h4 className="text-sm font-black tracking-wide uppercase">
                  今週のAIトレンド 3大要点
                </h4>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300 font-light leading-relaxed">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <p className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                    <span>Gemini 4 Argon 発表 (DeepMind)</span>
                  </p>
                  <p className="text-[11px] text-slate-300 pl-3">
                    次世代フロンティア知能として公式公開。超大規模推論とマルチモーダル自律基盤を刷新。
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <p className="font-bold text-sky-300 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
                    <span>主要各社フロンティア加速（Claude / Manus / Codex）</span>
                  </p>
                  <p className="text-[11px] text-slate-300 pl-3">
                    Claude Opus 5.5の推論、Manus自律実行、Codex/Canvas dots、DeepSeek-R1など各社が激突。
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <p className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    <span>プリフライト品質ゲートの全面稼働</span>
                  </p>
                  <p className="text-[11px] text-slate-300 pl-3">
                    人間による手動受入テスト（70項目）とCIゲートにより、虚偽や推測の混入をゼロガード。
                  </p>
                </div>
              </div>
            </SpotlightCard>

            {/* 社内推奨クイックアクション */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black text-slate-900 tracking-wider uppercase flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-600" />
                <span>社内推奨クイックアクション</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <Link
                  href="/guide"
                  onClick={playCyberClick}
                  onMouseEnter={playCyberHover}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 text-slate-700 hover:text-indigo-900 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen size={15} className="text-indigo-600" />
                    <div>
                      <p className="font-bold">Antigravity 導入ガイド</p>
                      <p className="text-[10px] text-slate-500">5分でIDE・CLI環境構築</p>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>

                <Link
                  href="/learning"
                  onClick={playCyberClick}
                  onMouseEnter={playCyberHover}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 text-slate-700 hover:text-indigo-900 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers size={15} className="text-indigo-600" />
                    <div>
                      <p className="font-bold">穴埋めプロンプト集</p>
                      <p className="text-[10px] text-slate-500">議事録・要約・コード生成</p>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>

                <Link
                  href="/feedback-todo"
                  onClick={playCyberClick}
                  onMouseEnter={playCyberHover}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 text-slate-700 hover:text-indigo-900 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquareShare size={15} className="text-indigo-600" />
                    <div>
                      <p className="font-bold">改善ToDoボード</p>
                      <p className="text-[10px] text-slate-500">未対応タスク・意見投稿</p>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* 情報提供・リクエスト窓口 */}
            <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 p-5 rounded-3xl border border-indigo-100 space-y-2.5 text-xs text-indigo-950">
              <p className="font-black flex items-center gap-1.5">
                <span>💡 ニュース・トピック掲載リクエスト</span>
              </p>
              <p className="text-[11px] text-indigo-800/80 leading-relaxed font-light">
                「この最新AIツールを取り上げてほしい」「社内での成功事例を掲載したい」などのご提案は、社内Google Chatまたはご意見ToDoボードまでお気軽にどうぞ！
              </p>
              <div className="pt-1">
                <Link
                  href="/feedback-todo"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <span>改善ToDoボードから起票する</span>
                  <ArrowUpRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 内部用簡易Globeアイコン
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
