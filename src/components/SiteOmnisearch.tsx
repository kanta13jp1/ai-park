"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  ArrowRight,
  Tag,
  X,
} from "lucide-react";
import { playCyberClick, playCyberHover } from "@/lib/sound";

interface SearchIndexItem {
  title: string;
  category: string;
  href: string;
  description: string;
  keywords: string[];
}

const siteSearchIndex: SearchIndexItem[] = [
  {
    title: "最新AIニュース & リリースレーダー",
    category: "ニュース・速報",
    href: "/news",
    description: "社内外の生成AI・エージェント・基盤モデル・社内AI Parkの最新公式動向を一括キャッチアップ",
    keywords: ["ニュース", "news", "速報", "deepmind", "gemini", "mcp", "リリース", "アップデート", "公式発表", "trend"],
  },

  {
    title: "ご意見・改善ToDoボード",
    category: "フィードバック",
    href: "/feedback-todo",
    description: "社員からのご意見・改善要望の蓄積、進捗管理、タスク起票、CSVエクスポート",
    keywords: ["ご意見", "改善", "todo", "フィードバック", "要望", "バックログ", "チャット", "杉村", "タスク", "起票"],
  },
  {
    title: "使い方・学び 総合ハブ",
    category: "ナレッジ",
    href: "/how-to",
    description: "AIツール一覧、教育用コンテンツ、AI活用インタビュー、AWS・クラウド情報局の総合案内ポータル",
    keywords: ["使い方", "学び", "ハブ", "ポータル", "教育", "ツール一覧", "インタビュー", "aws", "クラウド", "初心者"],
  },
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
    description: "AI Park実運用Skills（4件）・仕組みガイド・SKILL.mdテンプレート（全社カタログ工事中）",
    keywords: ["skills", "skill.md", "スキル", "テンプレート", "作り方", "rules", "hooks", "mcp", "提案", "申請"],
  },
  {
    title: "MCP外部ツール連携ガイド",
    category: "拡張機能",
    href: "/mcp-hub",
    description: "Antigravity と外部ツールをつなぐ MCP の設定（工事中）",
    keywords: ["mcp", "model context protocol", "外部ツール", "google drive", "データベース", "連携", "サーバー"],
  },
  {
    title: "Antigravity情報局",
    category: "サポート",
    href: "/antigravity-info",
    description: "Antigravity 機能解説と実務活用の実行例を掲載中（社内向けQ&A・お知らせは工事中）",
    keywords: ["情報局", "antigravity", "機能解説", "実行例", "相談", "office hour", "サポート"],
  },
  {
    title: "AWS・クラウド情報局 (SAA-C03学習ハブ)",
    category: "資格・クラウド",
    href: "/aws-info",
    description: "AWS認定ソリューションアーキテクト(SAA-C03)学習ハブ・練習クイズ・比較表を掲載中（社内AWS利用ルール等は工事中）",
    keywords: ["aws", "saa", "saa-c03", "クラウド", "試験", "模擬試験", "クイズ", "flashcards", "well-architected"],
  },
  {
    title: "GCP・Google Cloud情報局 (CDL/ACE/PCA)",
    category: "資格・Google Cloud",
    href: "/gcp-info",
    description: "Google Cloud 認定資格（CDL / ACE / PCA）統合学習ハブ・練習クイズ・比較表を掲載中（社内GCP利用ルール等は工事中）",
    keywords: ["gcp", "google cloud", "cdl", "ace", "pca", "cloud digital leader", "associate cloud engineer", "professional cloud architect", "試験", "クイズ", "flashcards"],
  },
  {
    title: "LPIC・Linux情報局 (LPIC-1学習ハブ)",
    category: "資格・Linux",
    href: "/lpic-info",
    description: "LPIC-1（101-500 / 102-500）学習ハブ・練習クイズ・コマンド早見表を掲載中（社内資格支援ルール等は工事中）",
    keywords: ["lpic", "lpic-1", "101-500", "102-500", "linux", "コマンド", "試験", "クイズ", "flashcards"],
  },
  {
    title: "情報処理技術者試験情報局 (IP/FE/AP/高度)",
    category: "資格・IPA",
    href: "/ipa-info",
    description: "ITパスポート・基本情報・応用情報・高度試験（SC/DB/NW）統合学習ハブを掲載中（社内資格支援ルール等は工事中）",
    keywords: ["ipa", "情報処理技術者試験", "itパスポート", "ip", "基本情報", "fe", "応用情報", "ap", "sc", "db", "nw", "セキュリティ"],
  },
  {
    title: "アイデア宣言ボード",
    category: "共創",
    href: "/idea-board",
    description: "AI活用のアイデアを宣言して協力者を募る場所（GitHub Issue で受付・Google Chat に通知）、AIビジネスモデル提案コンテスト（暫定版）",
    keywords: ["アイデア", "宣言", "ボード", "共創", "いいね", "poc", "slack", "提案"],
  },
  {
    title: "Subagents活用事例",
    category: "実装事例",
    href: "/agent-cases",
    description: "社内でのエージェント活用事例（工事中）",
    keywords: ["subagents", "agent", "事例", "アーキテクチャ", "ログ解析", "障害", "見積書", "レビュー", "プロンプト"],
  },
  {
    title: "社内AI活用状況",
    category: "推進指標",
    href: "/adoption",
    description: "全社・部署ごとの AI 活用状況（工事中：実データ連携の準備中）",
    keywords: ["活用状況", "roi", "シミュレータ", "削減時間", "コスト", "アンケート", "満足度", "フェーズ"],
  },
  {
    title: "Antigravity利用監視（Gemini利用率）",
    category: "統計分析",
    href: "/gemini-stats",
    description: "社内 Google Cloud プロジェクト経由の Antigravity 利用回数・90日無料トライアル残高・課金推移の自動同期ダッシュボード（β版）",
    keywords: ["統計", "ダッシュボード", "利用率", "gemini", "antigravity", "利用監視", "無料トライアル", "課金", "bigquery", "コスト"],
  },
  {
    title: "Antigravity Academy",
    category: "教育カリキュラム",
    href: "/academy",
    description: "動画と図解で体系的に学ぶAntigravity実践講座（全12レッスン）、評価テスト、ブラウザ内修了証発行",
    keywords: ["academy", "アカデミー", "レッスン", "動画", "チュートリアル", "テスト", "修了証", "教育", "実践", "入門"],
  },
  {
    title: "社内AIプロジェクト一覧",
    category: "実践プロジェクト",
    href: "/ai-projects",
    description: "社内各部署で進行中のAI活用プロジェクト一覧、課題、効果、GitHub Issue連携、自動掲載",
    keywords: ["プロジェクト", "事例", "実案件", "poc", "社内開発", "rag", "進捗", "自動掲載", "issue"],
  },
  {
    title: "AI Park カレンダー",
    category: "コミュニティ・イベント",
    href: "/calendar",
    description: "社内AI勉強会などのイベント予定（社内アカウントで表示）、AI勉強会アジェンダの自動追加",
    keywords: ["カレンダー", "予定", "勉強会", "イベント", "スケジュール", "アジェンダ", "gas", "office hour"],
  },
  {
    title: "AI勉強会アーカイブ",
    category: "コミュニティ・イベント",
    href: "/study-archive",
    description: "AI勉強会の開催回ごとの録画動画・議事メモ・次回課題をまとめて確認（β版・社内 Google Workspace 限定公開）",
    keywords: ["勉強会", "アーカイブ", "録画", "動画", "議事メモ", "議事録", "課題", "study-archive"],
  },
  {
    title: "社内AIアンバサダー",
    category: "コミュニティ",
    href: "/ambassadors",
    description: "第1期アンバサダーの応募受付（準備中）",
    keywords: ["アンバサダー", "リーダー", "相談", "slack", "推進", "公募"],
  },
  {
    title: "AI Tools Hub",
    category: "ツール一覧",
    href: "/tools-hub",
    description: "社内AI利用のセキュリティ基準（Level 1〜3）と注意事項5箇条",
    keywords: ["tools", "ツール", "ライセンス", "申請", "セキュリティ", "基準", "claude", "chatgpt", "gemini"],
  },
  {
    title: "教育用コンテンツ",
    category: "教育",
    href: "/learning",
    description: "初級編チートシート（頼み方・編集の流れ・エラー対処）、Antigravity Academy への案内",
    keywords: ["学習", "勉強会", "アーカイブ", "動画", "スライド", "カリキュラム", "研修", "教育"],
  },
  {
    title: "AI活用インタビュー",
    category: "現場の声",
    href: "/interviews",
    description: "社内のAI活用事例の取材記事（準備中）、取材の立候補",
    keywords: ["インタビュー", "生の声", "現場", "体験談", "導入効果", "エンジニア"],
  },
  {
    title: "開発ロードマップ & 実装スケジュール",
    category: "プロジェクト",
    href: "/roadmap",
    description: "AI Parkの全機能拡充スケジュール、フェーズ進捗、マイルストーン",
    keywords: ["ロードマップ", "スケジュール", "進捗", "マイルストーン", "計画", "フェーズ"],
  },
  {
    title: "Windows エラー解決早見表（確定コマンド集）",
    category: "トラブル解決",
    href: "/guide#troubleshooting-board",
    description: "PowerShell実行ポリシー、GCPアカウント・プロジェクト切替、文字化け、ポート重複のワンクリック解決コマンド",
    keywords: ["トラブル", "エラー", "windows", "powershell", "executionpolicy", "gcloud", "adc", "文字化け", "utf8", "heap", "ポート競合", "解決"],
  },
  {
    title: "社内AI入力 セルフチェック診断ツール",
    category: "ガバナンス",
    href: "/guide#safety-checker",
    description: "顧客データ・個人情報・未公開機密の入力可否を判定する3問の安全セルフチェック診断",
    keywords: ["セルフチェック", "安全診断", "入力チェック", "機密", "個人情報", "判定", "3大チェック", "診断"],
  },
  {
    title: "穴埋めプロンプト集（実務テンプレ）",
    category: "プロンプト",
    href: "/learning#interactive-prompts",
    description: "コピペですぐ使える要約・コード生成・エラー調査・メール作成の穴埋め型実務プロンプト集",
    keywords: ["プロンプト", "穴埋め", "テンプレ", "コピペ", "要約", "コード生成", "エラー調査", "メール作成"],
  },
  {
    title: "安全なプロンプト基本ルール＆禁止入力早見表",
    category: "ガバナンス",
    href: "/learning#safe-prompting-rules",
    description: "個人情報・機密情報の禁止ルール（OK/NG対比）と安全な依頼3大テクニック",
    keywords: ["安全ルール", "禁止入力", "機密漏洩防止", "プレースホルダー", "ガイドライン", "ルール"],
  },
  {
    title: "Gemini利用統計 同期ステータス & 確認チェック",
    category: "統計分析",
    href: "/gemini-stats#sync-status",
    description: "Antigravity利用監視のデータ同期状況、確定プロジェクト情報、反映確認チェックリスト",
    keywords: ["gemini統計", "faq", "プライバシー", "同期ステータス", "更新頻度", "ログ仕様", "antigravity-pj-xxxxxx"],
  },
  {
    title: "部署別実践テンプレ＆実務フロー",
    category: "活用事例",
    href: "/ai-projects#dept-templates",
    description: "開発・営業/企画・人事/総務などの実務フロー例",
    keywords: ["部署別", "テンプレ", "営業", "開発", "企画", "人事", "総務", "実務フロー"],
  },
  {
    title: "開発者手動UAT管理コンソール（プリフライト）",
    category: "品質管理",
    href: "/preflight",
    description: "4大評価軸（仕様・デザイン・操作性・視認性）の社内受入テスト管理コンソール",
    keywords: ["uat", "プリフライト", "受入テスト", "品質ゲート", "手動検証", "4大評価軸", "推進専用"],
  },
];

const popularTags = [
  "Skills",
  "Antigravity",
  "プロンプト",
  "エラー解決",
  "セルフチェック",
  "セキュリティ",
  "Academy",
  "プリフライト",
];

export default function SiteOmnisearch() {
  const [query, setQuery] = useState("");

  // '/' キーでインライン検索窓にフォーカス
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        const input = document.getElementById("site-omnisearch-input");
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
      {/* 検索ヘッダーバー (ラグジュアリー・サイバーグラデーション) */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-900/40">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl text-slate-950 shadow-md shadow-cyan-500/20">
            <Search size={18} />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg tracking-tight">サイト内横断検索</h3>
            <p className="text-xs text-slate-300 font-light">
              AI Park 内のガイド、Academy、事例、アンバサダー、利用規約を瞬時に横断検索
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-slate-300 font-mono">
          <span className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white/15 rounded">/</kbd>
            <span className="text-[11px] text-slate-400">フォーカス</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white/15 rounded">⌘K</kbd>
            <span className="text-[11px] text-slate-400">パレット</span>
          </span>
        </div>
      </div>

      {/* 検索フォーム & サジェストタグ */}
      <div className="p-6 sm:p-8 space-y-4">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            id="site-omnisearch-input"
            type="text"
            placeholder="探したい機能やキーワードを入力（例: Skills, プロンプト, 障害, アンバサダー, 申請...）"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 text-sm bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
          />
          {query && (
            <button
              onClick={() => {
                playCyberClick();
                setQuery("");
              }}
              onMouseEnter={() => playCyberHover()}
              className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 人気の検索キーワード */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-slate-700 flex items-center space-x-1 mr-1">
            <Tag size={12} className="text-blue-600" />
            <span>クイック検索タグ:</span>
          </span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                playCyberClick();
                setQuery(tag);
              }}
              onMouseEnter={() => playCyberHover()}
              className="px-3 py-1 bg-slate-100/80 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 rounded-full transition-all font-medium border border-slate-200/80 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((result) => (
                  <Link
                    key={result.title}
                    href={result.href}
                    onClick={() => playCyberClick()}
                    onMouseEnter={() => playCyberHover()}
                    className="p-4 bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50/40 border border-slate-200/90 hover:border-blue-400 rounded-2xl transition-all duration-200 flex flex-col justify-between group space-y-2.5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200/60 font-mono">
                          {result.category}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {result.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {result.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end text-xs text-blue-600 font-bold space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>ページを開く</span>
                      <ArrowRight size={13} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-400 bg-slate-50/80 rounded-2xl border border-slate-200/60">
                「{query}」に一致するコンテンツは見つかりませんでした。別のキーワードをお試しください。
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
