"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ArrowRight,
  Sparkles,
  FileText,
  Tag,
  X,
  ExternalLink,
} from "lucide-react";

interface SearchIndexItem {
  title: string;
  category: string;
  href: string;
  description: string;
  keywords: string[];
}

const siteSearchIndex: SearchIndexItem[] = [
  {
    title: "Google Antigravity 導入ガイド",
    category: "導入・設定",
    href: "/guide",
    description: "IDE / CLI (agy) の社内セットアップ手順、スラッシュコマンド活用法、モデル切り替え",
    keywords: ["antigravity", "agy", "cli", "ide", "セットアップ", "環境構築", "コマンド", "インストール", "gemini-3.1-pro"],
  },
  {
    title: "社内Skillsカタログ",
    category: "開発支援",
    href: "/skills-hub",
    description: "破壊的操作防止、Playwright自動テスト、BigQuery最適化など社内公認スキル集の配布・登録申請",
    keywords: ["skills", "skill.md", "スキル", "配布", "申請", "テスト自動化", "playwright", "bigquery", "データ損失防止"],
  },
  {
    title: "MCP外部ツール連携ガイド",
    category: "拡張機能",
    href: "/mcp-hub",
    description: "社内DB、Google Drive、ブラウザ検証をAntigravityに直結するModel Context Protocol設定",
    keywords: ["mcp", "model context protocol", "外部ツール", "google drive", "データベース", "連携", "サーバー"],
  },
  {
    title: "Antigravity情報局 (CoE相談室)",
    category: "サポート",
    href: "/antigravity-info",
    description: "AI CoE相談デスク、Office Hour予約、マンツーマンでの導入支援とブレスト",
    keywords: ["情報局", "相談", "office hour", "予約", "coe", "メンター", "サポート", "カレンダー"],
  },
  {
    title: "アイデア宣言ボード",
    category: "共創",
    href: "/idea-board",
    description: "社内AI活用のアイデア起票、共創、いいねリアクション、PoC検証中のプロジェクト共有",
    keywords: ["アイデア", "宣言", "ボード", "共創", "いいね", "poc", "slack", "提案"],
  },
  {
    title: "Subagents活用事例",
    category: "実装事例",
    href: "/agent-cases",
    description: "API決済エラー自動診断、見積書PDFマルチモーダル突合、PR自動コードレビューなど自律エージェント事例",
    keywords: ["subagents", "agent", "事例", "アーキテクチャ", "ログ解析", "障害", "見積書", "レビュー", "プロンプト"],
  },
  {
    title: "社内AI活用状況 & ROIシミュレータ",
    category: "推進指標",
    href: "/adoption",
    description: "全社フェーズ進捗、チーム人数・時給に応じた削減工数・コストROIリアルタイム試算、アンケート集計",
    keywords: ["活用状況", "roi", "シミュレータ", "削減時間", "コスト", "アンケート", "満足度", "フェーズ"],
  },
  {
    title: "利用状況ダッシュボード",
    category: "統計分析",
    href: "/gemini-stats",
    description: "部署別MAU、プロンプト推移、期間切替、CSVインポート/エクスポート、モデル別シェア",
    keywords: ["統計", "ダッシュボード", "利用率", "mau", "プロンプト", "csv", "部署", "エクスポート"],
  },
  {
    title: "社内AIアンバサダー",
    category: "コミュニティ",
    href: "/ambassadors",
    description: "各部署のAI推進リーダー一覧、得意技術スタック、Slack相談窓口、アンバサダー公募",
    keywords: ["アンバサダー", "リーダー", "相談", "slack", "推進", "公募", "高橋", "佐藤", "田中"],
  },
  {
    title: "AI Tools Hub",
    category: "ツール一覧",
    href: "/tools-hub",
    description: "社内公認AIツール（Antigravity, Gemini, Claude, ChatGPT等）のセキュリティ基準、ライセンス申請",
    keywords: ["tools", "ツール", "ライセンス", "申請", "セキュリティ", "基準", "claude", "chatgpt", "gemini"],
  },
  {
    title: "学習リソース & 勉強会アーカイブ",
    category: "教育",
    href: "/learning",
    description: "全社員向けセキュリティ必修講座、エンジニア向けハンズオン、過去の勉強会録画・スライド",
    keywords: ["学習", "勉強会", "アーカイブ", "動画", "スライド", "カリキュラム", "研修", "教育"],
  },
  {
    title: "AI活用インタビュー",
    category: "現場の声",
    href: "/interviews",
    description: "社内エンジニアや業務担当者のリアルなAI活用体験談、生の声、導入効果",
    keywords: ["インタビュー", "生の声", "現場", "体験談", "導入効果", "エンジニア"],
  },
  {
    title: "開発ロードマップ & 実装スケジュール",
    category: "プロジェクト",
    href: "/roadmap",
    description: "AI Parkの全機能拡充スケジュール、フェーズ進捗、マイルストーン",
    keywords: ["ロードマップ", "スケジュール", "進捗", "マイルストーン", "計画", "フェーズ"],
  },
];

const popularTags = [
  "Skills",
  "Antigravity",
  "プロンプト",
  "Office Hour",
  "Subagents",
  "アンバサダー",
  "セキュリティ",
  "ROIシミュレータ",
];

export default function SiteOmnisearch() {
  const [query, setQuery] = useState("");

  const searchResults = query.trim()
    ? siteSearchIndex.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* 検索ヘッダーバー (参考サイトに合わせたブルーグラデーション) */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Search size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base">サイト内横断検索</h3>
            <p className="text-xs text-blue-100">
              AI Park 内のガイド、Skills、事例、アンバサダー、規程を横断検索します
            </p>
          </div>
        </div>
      </div>

      {/* 検索フォーム & サジェストタグ */}
      <div className="p-6 space-y-4">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="探したい機能やキーワードを入力（例: Skills, プロンプト, 障害, アンバサダー, 申請...）"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 人気の検索キーワード */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="font-semibold text-slate-700 flex items-center space-x-1 mr-1">
            <Tag size={12} />
            <span>よく検索されるキーワード:</span>
          </span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-medium border border-slate-200/80"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* 検索結果一覧 */}
        {query.trim() && (
          <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-slate-800">
                検索結果: {searchResults.length} 件がヒットしました
              </span>
              <span>「{query}」の検索結果</span>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchResults.map((result) => (
                  <Link
                    key={result.title}
                    href={result.href}
                    className="p-3.5 bg-slate-50/70 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl transition-all flex flex-col justify-between group space-y-1.5"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                          {result.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs group-hover:text-blue-700 transition-colors">
                        {result.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-snug mt-1">
                        {result.description}
                      </p>
                    </div>

                    <div className="pt-1 flex items-center justify-end text-[11px] text-blue-600 font-semibold space-x-1 group-hover:translate-x-0.5 transition-transform">
                      <span>ページを開く</span>
                      <ArrowRight size={12} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl">
                「{query}」に一致するコンテンツは見つかりませんでした。別のキーワードをお試しください。
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
